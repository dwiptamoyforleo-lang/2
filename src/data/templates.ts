import { LeoProgram } from '../types';

export const TEMPLATES: LeoProgram[] = [
  {
    id: 'token',
    name: 'token.aleo',
    programId: 'token.aleo',
    description: 'Private Fungible Token with confidential balance records & zero-knowledge transfer',
    code: `// The 'token.aleo' program.
program token.aleo {
    // A record representing a confidential token balance.
    record token {
        // The token owner.
        owner: address,
        // The token amount.
        amount: u64,
    }

    // Mint tokens directly to a recipient as a private record.
    transition mint_private(receiver: address, amount: u64) -> token {
        return token {
            owner: receiver,
            amount: amount,
        };
    }

    // Transfer tokens confidentially using zero-knowledge record splitting.
    transition transfer_private(sender_record: token, receiver: address, amount: u64) -> (token, token) {
        // Check that the input record has sufficient funds.
        let difference: u64 = sender_record.amount - amount;

        // Produce a token record for the recipient.
        let recipient_token: token = token {
            owner: receiver,
            amount: amount,
        };

        // Produce the change token record for the sender.
        let sender_change: token = token {
            owner: sender_record.owner,
            amount: difference,
        };

        return (recipient_token, sender_change);
    }

    // Combine two private token records into a single consolidated record.
    transition merge_records(first: token, second: token) -> token {
        return token {
            owner: self.caller,
            amount: first.amount + second.amount,
        };
    }
}
`,
    transitions: [
      {
        name: 'mint_private',
        description: 'Mints a new private token record to the receiver address.',
        estimatedConstraints: 1420,
        inputs: [
          { name: 'receiver', type: 'address', defaultValue: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq', description: 'Recipient public address' },
          { name: 'amount', type: 'u64', defaultValue: '1000u64', description: 'Token quantity to mint' },
        ],
      },
      {
        name: 'transfer_private',
        description: 'Transfers funds with zero-knowledge anonymity by consuming an existing record and producing two new records.',
        estimatedConstraints: 3840,
        inputs: [
          { name: 'sender_record', type: 'token', defaultValue: 'rec_01_token_1000', description: 'ID of an unspent token record' },
          { name: 'receiver', type: 'address', defaultValue: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m', description: 'Recipient public address' },
          { name: 'amount', type: 'u64', defaultValue: '250u64', description: 'Transfer amount' },
        ],
      },
      {
        name: 'merge_records',
        description: 'Merges two private token records into a consolidated balance record.',
        estimatedConstraints: 2150,
        inputs: [
          { name: 'first', type: 'token', defaultValue: 'rec_01_token_1000', description: 'First token record ID' },
          { name: 'second', type: 'token', defaultValue: 'rec_02_token_500', description: 'Second token record ID' },
        ],
      },
    ],
  },
  {
    id: 'auction',
    name: 'auction.aleo',
    programId: 'auction.aleo',
    description: 'Sealed-bid auction where bids remain cryptographically hidden until finalized',
    code: `// The 'auction.aleo' program.
program auction.aleo {
    // Record for a sealed private bid.
    record Bid {
        owner: address,
        bidder: address,
        amount: u64,
        is_winner: bool,
    }

    // Submit a private sealed bid to the auctioneer.
    transition place_bid(bidder: address, amount: u64) -> Bid {
        assert_eq(self.caller, bidder);
        return Bid {
            owner: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq, // auctioneer
            bidder: bidder,
            amount: amount,
            is_winner: false,
        };
    }

    // Compare two bids and keep the higher bid as current frontrunner.
    transition resolve(first: Bid, second: Bid) -> Bid {
        // Only the auctioneer can resolve bids.
        assert_eq(self.caller, aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq);
        if (first.amount >= second.amount) {
            return first;
        } else {
            return second;
        }
    }

    // Award winning status to highest bidder.
    transition claim_win(bid: Bid) -> Bid {
        assert_eq(self.caller, aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq);
        return Bid {
            owner: bid.bidder,
            bidder: bid.bidder,
            amount: bid.amount,
            is_winner: true,
        };
    }
}
`,
    transitions: [
      {
        name: 'place_bid',
        description: 'Creates a private bid record transferred to the auctioneer without public leak of the amount.',
        estimatedConstraints: 1980,
        inputs: [
          { name: 'bidder', type: 'address', defaultValue: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m', description: 'Caller / Bidder address' },
          { name: 'amount', type: 'u64', defaultValue: '7500u64', description: 'Bid amount' },
        ],
      },
      {
        name: 'resolve',
        description: 'Compares two sealed bids in zero-knowledge and passes through the winning bid.',
        estimatedConstraints: 2450,
        inputs: [
          { name: 'first', type: 'Bid', defaultValue: 'bid_rec_alpha_5000', description: 'First sealed bid record' },
          { name: 'second', type: 'Bid', defaultValue: 'bid_rec_beta_7500', description: 'Second sealed bid record' },
        ],
      },
      {
        name: 'claim_win',
        description: 'Finalizes the auction by producing a verified winning claim certificate.',
        estimatedConstraints: 1650,
        inputs: [
          { name: 'bid', type: 'Bid', defaultValue: 'bid_rec_beta_7500', description: 'Winning bid record' },
        ],
      },
    ],
  },
  {
    id: 'voting',
    name: 'voting.aleo',
    programId: 'voting.aleo',
    description: 'Anonymous zero-knowledge voting circuit preventing double voting with private ballots',
    code: `// The 'voting.aleo' program.
program voting.aleo {
    // Private ballot record issued to eligible voters.
    record Ballot {
        owner: address,
        ballot_id: field,
        used: bool,
    }

    // Cast a vote confidentially. Proof validates eligibility without revealing voter identity.
    transition cast_vote(ballot: Ballot, proposal_id: u32, vote_affirmative: bool) -> Ballot {
        assert(!ballot.used);
        
        return Ballot {
            owner: ballot.owner,
            ballot_id: ballot.ballot_id,
            used: true,
        };
    }
}
`,
    transitions: [
      {
        name: 'cast_vote',
        description: 'Verifies ballot validity, marks it spent, and yields cryptographic proof of genuine ballot.',
        estimatedConstraints: 3200,
        inputs: [
          { name: 'ballot', type: 'Ballot', defaultValue: 'ballot_rec_0912', description: 'Unspent ballot record' },
          { name: 'proposal_id', type: 'u32', defaultValue: '2u32', description: 'Target proposal index' },
          { name: 'vote_affirmative', type: 'bool', defaultValue: 'true', description: 'Vote YES (true) or NO (false)' },
        ],
      },
    ],
  },
  {
    id: 'multisig2of2',
    name: 'multisig_2of2.aleo',
    programId: 'multisig_2of2.aleo',
    description: 'Dual-Party (2-of-2) Zero-Knowledge threshold vault requiring both cryptographic authorizations',
    code: `// The 'multisig_2of2.aleo' program.
program multisig_2of2.aleo {
    record Proposal {
        owner: address,
        amount: u64,
        recipient: address,
        signer_1_signed: bool,
        signer_2_signed: bool,
    }

    // Propose an asset disbursement requiring 2 signatures.
    transition init_proposal(recipient: address, amount: u64, co_signer: address) -> Proposal {
        return Proposal {
            owner: co_signer,
            amount: amount,
            recipient: recipient,
            signer_1_signed: true,
            signer_2_signed: false,
        };
    }

    // Co-signer executes dual verification.
    transition execute_signed(prop: Proposal) -> u64 {
        assert(prop.signer_1_signed);
        assert_eq(self.caller, prop.owner);
        return prop.amount;
    }
}
`,
    transitions: [
      {
        name: 'init_proposal',
        description: 'Signer 1 creates an authorization record sent to Signer 2.',
        estimatedConstraints: 2100,
        inputs: [
          { name: 'recipient', type: 'address', defaultValue: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m', description: 'Destination address' },
          { name: 'amount', type: 'u64', defaultValue: '50000u64', description: 'Amount to disburse' },
          { name: 'co_signer', type: 'address', defaultValue: 'aleo1234567890abcdefghijklmnopqrstuvwxyz222222', description: 'Secondary approver address' },
        ],
      },
      {
        name: 'execute_signed',
        description: 'Signer 2 signs and satisfies the dual-party 2-of-2 condition.',
        estimatedConstraints: 2890,
        inputs: [
          { name: 'prop', type: 'Proposal', defaultValue: 'prop_rec_dual_key', description: 'Proposal record' },
        ],
      },
    ],
  },
];

export const INITIAL_RECORDS: import('../types').LeoRecord[] = [
  {
    id: 'rec_01_token_1000',
    owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
    gates: 0,
    programId: 'token.aleo',
    recordName: 'token',
    data: { amount: 1000, is_frozen: false },
    spent: false,
  },
  {
    id: 'rec_02_token_500',
    owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
    gates: 0,
    programId: 'token.aleo',
    recordName: 'token',
    data: { amount: 500, is_frozen: false },
    spent: false,
  },
  {
    id: 'bid_rec_alpha_5000',
    owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
    gates: 0,
    programId: 'auction.aleo',
    recordName: 'Bid',
    data: { bidder: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq', amount: 5000, is_winner: false },
    spent: false,
  },
  {
    id: 'bid_rec_beta_7500',
    owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
    gates: 0,
    programId: 'auction.aleo',
    recordName: 'Bid',
    data: { bidder: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m', amount: 7500, is_winner: false },
    spent: false,
  },
  {
    id: 'ballot_rec_0912',
    owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
    gates: 0,
    programId: 'voting.aleo',
    recordName: 'Ballot',
    data: { ballot_id: '8912491294829104field', used: false },
    spent: false,
  },
  {
    id: 'prop_rec_dual_key',
    owner: 'aleo1234567890abcdefghijklmnopqrstuvwxyz222222',
    gates: 0,
    programId: 'multisig_2of2.aleo',
    recordName: 'Proposal',
    data: { amount: 50000, recipient: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m', signer_1_signed: true, signer_2_signed: false },
    spent: false,
  },
];
