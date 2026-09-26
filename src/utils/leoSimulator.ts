import { ExecutionTrace, LeoRecord } from '../types';

export function simulateTransitionExecution(
  programId: string,
  transitionName: string,
  caller: string,
  inputs: Record<string, string>,
  records: LeoRecord[]
): {
  success: boolean;
  message?: string;
  trace?: ExecutionTrace;
  updatedRecords?: LeoRecord[];
} {
  const timestamp = new Date().toISOString();
  const spentRecordIds: string[] = [];
  const createdRecords: LeoRecord[] = [];
  const outputs: Record<string, any> = {};

  try {
    if (transitionName === 'mint_private') {
      const receiver = inputs.receiver || caller;
      const rawAmount = inputs.amount?.replace('u64', '') || '100';
      const amount = parseInt(rawAmount, 10);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid mint amount: must be positive u64');
      }

      const newRec: LeoRecord = {
        id: `rec_${Date.now()}_mint_${amount}`,
        owner: receiver,
        gates: 0,
        programId,
        recordName: 'token',
        data: { amount, is_frozen: false },
        spent: false,
      };
      createdRecords.push(newRec);
      outputs['output_record'] = newRec;
    } else if (transitionName === 'transfer_private') {
      const recId = inputs.sender_record;
      const targetRecord = records.find((r) => r.id === recId && !r.spent);
      if (!targetRecord) {
        throw new Error(`Record ${recId} is either already spent or not found in records vault.`);
      }

      const currentBalance = Number(targetRecord.data.amount || 0);
      const rawAmount = inputs.amount?.replace('u64', '') || '0';
      const transferAmount = parseInt(rawAmount, 10);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error('Transfer amount must be greater than zero.');
      }
      if (currentBalance < transferAmount) {
        throw new Error(`Insufficient funds: record has ${currentBalance}u64, requested ${transferAmount}u64.`);
      }

      spentRecordIds.push(targetRecord.id);

      const receiver = inputs.receiver || 'aleo1unknown...';
      const recipientRec: LeoRecord = {
        id: `rec_${Date.now()}_recv_${transferAmount}`,
        owner: receiver,
        gates: 0,
        programId,
        recordName: 'token',
        data: { amount: transferAmount, is_frozen: false },
        spent: false,
      };

      const changeAmount = currentBalance - transferAmount;
      const changeRec: LeoRecord = {
        id: `rec_${Date.now()}_change_${changeAmount}`,
        owner: targetRecord.owner,
        gates: 0,
        programId,
        recordName: 'token',
        data: { amount: changeAmount, is_frozen: false },
        spent: false,
      };

      createdRecords.push(recipientRec, changeRec);
      outputs['recipient_token'] = recipientRec;
      outputs['sender_change'] = changeRec;
    } else if (transitionName === 'merge_records') {
      const rec1 = records.find((r) => r.id === inputs.first && !r.spent);
      const rec2 = records.find((r) => r.id === inputs.second && !r.spent);
      if (!rec1 || !rec2) {
        throw new Error('Both input records must exist and be unspent.');
      }
      if (rec1.id === rec2.id) {
        throw new Error('Cannot merge a record with itself.');
      }

      spentRecordIds.push(rec1.id, rec2.id);
      const total = Number(rec1.data.amount || 0) + Number(rec2.data.amount || 0);

      const mergedRec: LeoRecord = {
        id: `rec_${Date.now()}_merged_${total}`,
        owner: caller,
        gates: 0,
        programId,
        recordName: 'token',
        data: { amount: total, is_frozen: false },
        spent: false,
      };
      createdRecords.push(mergedRec);
      outputs['merged_token'] = mergedRec;
    } else if (transitionName === 'place_bid') {
      const rawAmount = inputs.amount?.replace('u64', '') || '1000';
      const amount = parseInt(rawAmount, 10);
      const bidder = inputs.bidder || caller;

      const bidRec: LeoRecord = {
        id: `bid_${Date.now()}_${amount}`,
        owner: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq',
        gates: 0,
        programId,
        recordName: 'Bid',
        data: { bidder, amount, is_winner: false },
        spent: false,
      };
      createdRecords.push(bidRec);
      outputs['bid'] = bidRec;
    } else if (transitionName === 'resolve') {
      const b1 = records.find((r) => r.id === inputs.first);
      const b2 = records.find((r) => r.id === inputs.second);
      if (!b1 || !b2) {
        throw new Error('Both sealed bid records must be selected.');
      }
      spentRecordIds.push(b1.id, b2.id);
      const amt1 = Number(b1.data.amount || 0);
      const amt2 = Number(b2.data.amount || 0);
      const winner = amt1 >= amt2 ? b1 : b2;
      const winningRec: LeoRecord = {
        id: `bid_winner_${Date.now()}`,
        owner: winner.owner,
        gates: 0,
        programId,
        recordName: 'Bid',
        data: { ...winner.data, is_winner: false },
        spent: false,
      };
      createdRecords.push(winningRec);
      outputs['frontrunner_bid'] = winningRec;
    } else if (transitionName === 'claim_win') {
      const target = records.find((r) => r.id === inputs.bid);
      if (!target) throw new Error('Bid record not found');
      spentRecordIds.push(target.id);
      const claimedRec: LeoRecord = {
        id: `win_claimed_${Date.now()}`,
        owner: String(target.data.bidder || target.owner),
        gates: 0,
        programId,
        recordName: 'Bid',
        data: { ...target.data, is_winner: true },
        spent: false,
      };
      createdRecords.push(claimedRec);
      outputs['claimed_bid'] = claimedRec;
    } else if (transitionName === 'cast_vote') {
      const ballot = records.find((r) => r.id === inputs.ballot && !r.spent);
      if (!ballot) throw new Error('Ballot record is already spent or invalid.');
      spentRecordIds.push(ballot.id);
      const usedBallot: LeoRecord = {
        id: `used_ballot_${Date.now()}`,
        owner: ballot.owner,
        gates: 0,
        programId,
        recordName: 'Ballot',
        data: { ...ballot.data, used: true, proposal_id: inputs.proposal_id, vote: inputs.vote_affirmative },
        spent: true,
      };
      createdRecords.push(usedBallot);
      outputs['spent_ballot'] = usedBallot;
      outputs['receipt'] = { proposal: inputs.proposal_id, status: 'RECORDED_IN_ZK_TALLY' };
    } else {
      // Generic transition handler
      outputs['status'] = 'Executed successfully';
      outputs['inputs_evaluated'] = inputs;
    }

    // Constraints & Proof generation metrics
    const baseConstraints = 1500 + Math.floor(Math.random() * 800);
    const witnessCount = Math.floor(baseConstraints * 1.34);
    const provingTimeMs = 45 + Math.floor(Math.random() * 85);
    const proofDigest = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const trace: ExecutionTrace = {
      timestamp,
      transitionName,
      caller,
      inputs,
      outputs,
      createdRecords,
      spentRecords: spentRecordIds,
      proof: {
        circuitConstraints: baseConstraints,
        witnessCount,
        provingTimeMs,
        proofDigest: `proof1${proofDigest}`,
        verified: true,
      },
      gasCost: 12500 + Math.floor(Math.random() * 5000),
    };

    // Update records state
    const nextRecords = records.map((r) => {
      if (spentRecordIds.includes(r.id)) {
        return { ...r, spent: true };
      }
      return r;
    });

    return {
      success: true,
      trace,
      updatedRecords: [...createdRecords, ...nextRecords],
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Execution error in transition constraints assertion.',
    };
  }
}
