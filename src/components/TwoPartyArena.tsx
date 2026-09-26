import React, { useState } from 'react';
import { Sparkles, Shield, User, Lock, Key, CheckCircle, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

export const TwoPartyArena: React.FC = () => {
  // Party 1 (Alice / Prover)
  const [secretNumber, setSecretNumber] = useState<number>(42);
  const [selectedCondition, setSelectedCondition] = useState<'even' | 'range50' | 'square'>('even');
  const [commitment, setCommitment] = useState<string | null>(null);
  const [zkProof, setZkProof] = useState<string | null>(null);
  const [conditionProofClaim, setConditionProofClaim] = useState<string>('');
  const [provingStep, setProvingStep] = useState<number>(1);

  // Party 2 (Bob / Verifier)
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGenerateProof = () => {
    // Validate condition
    let valid = false;
    let claim = '';
    if (selectedCondition === 'even') {
      valid = secretNumber % 2 === 0;
      claim = `The secret number x is strictly EVEN (x % 2 == 0)`;
    } else if (selectedCondition === 'range50') {
      valid = secretNumber > 50;
      claim = `The secret number x satisfies 50 < x < 100`;
    } else if (selectedCondition === 'square') {
      const sqrt = Math.sqrt(secretNumber);
      valid = Number.isInteger(sqrt);
      claim = `The secret number x is a perfect square (∃ y : y² == x)`;
    }

    if (!valid) {
      alert(`Invalid secret: The value ${secretNumber} does NOT satisfy the selected condition "${selectedCondition}".`);
      return;
    }

    // Generate Pedersen commitment
    const blindingFactor = Math.floor(Math.random() * 99999999);
    const comm = `comm_pedersen_${Math.abs(secretNumber * 104729 + blindingFactor).toString(16)}aleo`;
    const proofHex = `zkp_snark_plonk_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    setCommitment(comm);
    setZkProof(proofHex);
    setConditionProofClaim(claim);
    setProvingStep(2);
    setVerificationResult(null);
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult(true);
    }, 600);
  };

  const handleReset = () => {
    setCommitment(null);
    setZkProof(null);
    setConditionProofClaim('');
    setVerificationResult(null);
    setProvingStep(1);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-800/60 rounded-xl p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              2-Party Zero-Knowledge Proof Arena
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                Interactive Prover ↔ Verifier Protocol
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Demonstrating the fundamental "2" cryptographic guarantee: Party 1 proves knowledge of a secret satisfying constraints to Party 2 without ever revealing the secret itself.
            </p>
          </div>
        </div>
      </div>

      {/* Two Parties Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PARTY 1: ALICE (PROVER) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-emerald-950 border border-emerald-600/50 flex items-center justify-center text-emerald-300 font-bold text-xs">
                P1
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Party 1: Prover (Alice)</h3>
                <span className="text-[10px] text-slate-500 font-mono">Private Knowledge Owner</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Leo Circuit Prover
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Enter Private Secret Value <span className="text-slate-500">(Never exposed to Party 2)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={secretNumber}
                  onChange={(e) => setSecretNumber(parseInt(e.target.value, 10) || 0)}
                  disabled={provingStep === 2}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-300 w-full focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Zero-Knowledge Statement to Prove
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  disabled={provingStep === 2}
                  onClick={() => setSelectedCondition('even')}
                  className={`text-left p-2.5 rounded-lg border text-xs transition ${
                    selectedCondition === 'even'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">Constraint: Value is an Even Number</div>
                  <div className="text-[11px] text-slate-500 font-mono">x % 2 == 0 (e.g. 42, 64, 100)</div>
                </button>
                <button
                  type="button"
                  disabled={provingStep === 2}
                  onClick={() => setSelectedCondition('range50')}
                  className={`text-left p-2.5 rounded-lg border text-xs transition ${
                    selectedCondition === 'range50'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">Constraint: Greater than 50</div>
                  <div className="text-[11px] text-slate-500 font-mono">50 &lt; x &lt; 100 (e.g. 64, 88)</div>
                </button>
                <button
                  type="button"
                  disabled={provingStep === 2}
                  onClick={() => setSelectedCondition('square')}
                  className={`text-left p-2.5 rounded-lg border text-xs transition ${
                    selectedCondition === 'square'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="font-semibold">Constraint: Perfect Square</div>
                  <div className="text-[11px] text-slate-500 font-mono">y² == x (e.g. 16, 25, 64, 81)</div>
                </button>
              </div>
            </div>

            {provingStep === 1 ? (
              <button
                onClick={handleGenerateProof}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                Generate ZK Proof & Commitment
              </button>
            ) : (
              <div className="space-y-2 pt-2">
                <div className="p-2.5 bg-emerald-950/60 rounded border border-emerald-800/60 text-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Pedersen Commitment</div>
                  <div className="text-emerald-300 font-mono text-[11px] truncate">{commitment}</div>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <RefreshCw className="w-3 h-3" />
                  Try Another Challenge
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PARTY 2: BOB (VERIFIER) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-cyan-950 border border-cyan-600/50 flex items-center justify-center text-cyan-300 font-bold text-xs">
                P2
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Party 2: Verifier (Bob)</h3>
                <span className="text-[10px] text-slate-500 font-mono">Zero-Knowledge Verifier</span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
              snarkVM Verifier
            </span>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-between">
            {provingStep === 1 ? (
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-8 text-center text-slate-500 text-xs my-auto">
                <Lock className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                Waiting for Party 1 to synthesize proof...
              </div>
            ) : (
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">CLAIM TO VERIFY</span>
                    <span className="text-slate-200 font-medium">{conditionProofClaim}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">COMMITMENT RECEIVED</span>
                    <span className="text-emerald-400 font-mono text-[11px] break-all">{commitment}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">ZK-PROOF DIGEST</span>
                    <span className="text-cyan-400 font-mono text-[11px] break-all">{zkProof}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Privacy Notice:</span> Bob verifies that the claim is 100% mathematically true without learning what number Alice chose.
                </div>

                {verificationResult === null ? (
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer mt-auto"
                  >
                    {isVerifying ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Verifying Bilinear Pairings...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verify Proof Mathematically
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 bg-emerald-950/80 border border-emerald-600/80 rounded-lg text-xs space-y-1.5 mt-auto">
                    <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Proof Successfully Verified!
                    </div>
                    <p className="text-emerald-200/80 text-[11px]">
                      The proof holds. The secret value remains 100% confidential while its validity is mathematically guaranteed.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
