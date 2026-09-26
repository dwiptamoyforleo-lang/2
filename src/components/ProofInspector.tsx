import React from 'react';
import { Cpu, ShieldCheck, Binary, Lock, CheckCircle2, Hash, Layers } from 'lucide-react';
import { ExecutionTrace } from '../types';

interface ProofInspectorProps {
  lastTrace?: ExecutionTrace;
}

export const ProofInspector: React.FC<ProofInspectorProps> = ({ lastTrace }) => {
  if (!lastTrace) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto my-8">
        <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-300">No Proof Generated Yet</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Execute any transition from the Studio & Editor tab to generate a simulated Marlin/Groth16 ZK-SNARK circuit proof and inspect the synthesized witness.
        </p>
      </div>
    );
  }

  const { proof, transitionName, inputs, outputs, gasCost, timestamp, caller } = lastTrace;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-800/60 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-900/60 rounded-lg text-emerald-400 border border-emerald-700/60">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  Zero-Knowledge Proof Verified
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    PASSED
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transition: <span className="font-mono text-emerald-300">{transitionName}</span> • Executed at {new Date(timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">PROVING TIME</span>
              <span className="text-emerald-400 font-bold">{proof.provingTimeMs} ms</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">R1CS CONSTRAINTS</span>
              <span className="text-slate-200 font-bold">{proof.circuitConstraints}</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 text-[10px] block">ESTIMATED FEE</span>
              <span className="text-amber-300 font-bold">{gasCost} microcredits</span>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Digest & Cryptographic Commitment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Proof String */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-emerald-400" />
              ZK-SNARK Proof Digest
            </span>
            <span className="text-[10px] font-mono text-slate-500">Marlin / AHP</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 break-all select-all leading-5">
            {proof.proofDigest}
          </div>
          <p className="text-[11px] text-slate-500">
            Cryptographic guarantee that valid transition logic was executed without revealing private inputs.
          </p>
        </div>

        {/* Circuit Verification Key */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" />
              Circuit Verification Parameters
            </span>
            <span className="text-[10px] font-mono text-slate-500">BLS12-377</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800/80">
              <span className="text-slate-500">Witness Variables:</span>
              <span className="text-slate-300">{proof.witnessCount}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800/80">
              <span className="text-slate-500">Public Inputs Evaluated:</span>
              <span className="text-slate-300">{Object.keys(inputs).length}</span>
            </div>
            <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800/80">
              <span className="text-slate-500">Caller (Signing Identity):</span>
              <span className="text-cyan-400 truncate max-w-[200px]">{caller}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inputs & Outputs Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Evaluated Inputs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            Transition Inputs Assigned
          </h4>
          <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
            {JSON.stringify(inputs, null, 2)}
          </pre>
        </div>

        {/* Transition Outputs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Transition Outputs & Record Updates
          </h4>
          <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
            {JSON.stringify(outputs, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
