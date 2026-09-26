import React from 'react';
import { BookOpen, Code, KeyRound, Shield, AlertTriangle } from 'lucide-react';

export const CheatSheet: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          Leo Language Reference & Cheatsheet
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Essential syntax, types, and programming model concepts for building zero-knowledge smart contracts on Aleo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Data Types */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <KeyRound className="w-4 h-4" />
            Core Primitives & Field Types
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-mono">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-emerald-400">address</span>: Public keys on the Aleo network (e.g. <span className="text-slate-400">aleo1...</span>)
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-emerald-400">field</span>: Native elliptic curve field elements in BLS12-377
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-emerald-400">group</span>: Points on the twisted Edwards curve
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-emerald-400">u8, u16, u32, u64, u128</span>: Standard unsigned integer arithmetic
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-emerald-400">bool</span>: Boolean flag values (<span className="text-cyan-400">true</span> / <span className="text-cyan-400">false</span>)
            </div>
          </div>
        </div>

        {/* Record Model */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <Shield className="w-4 h-4" />
            Record UTXO Model
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-mono">
            <p className="text-slate-400 text-xs font-sans">
              Records are fundamental privacy units in Leo. They hold private state and can only be consumed once by their designated owner.
            </p>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] leading-5">
              <span className="text-purple-400">record</span> Token &#123;<br />
              &nbsp;&nbsp;<span className="text-slate-400">owner</span>: address,<br />
              &nbsp;&nbsp;<span className="text-slate-400">amount</span>: u64,<br />
              &#125;
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              When a transition consumes a record, a cryptographic serial number (nullifier) is recorded on-chain, preventing double spending.
            </p>
          </div>
        </div>

        {/* Transitions vs Finalize */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Code className="w-4 h-4" />
            Transitions vs. Finalize
          </div>
          <div className="text-xs text-slate-400 space-y-2 font-sans">
            <p>
              <strong className="text-slate-200">transition</strong>: Executes purely client-side inside a zero-knowledge circuit. Private arguments never leave the client device.
            </p>
            <p>
              <strong className="text-slate-200">finalize</strong>: Executes on-chain by network consensus validators to update public mappings and global on-chain state.
            </p>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-[11px] text-slate-300">
              transition transfer(rec: Token, to: address) -&gt; Token &#123; ... &#125;
            </div>
          </div>
        </div>

        {/* Assertions & Circuit Constraints */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            Assertions & Safety
          </div>
          <div className="text-xs text-slate-300 space-y-2 font-mono">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-rose-400">assert(condition)</span>: Asserts condition is true in R1CS
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-rose-400">assert_eq(a, b)</span>: Circuit constraint enforcing equality
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-rose-400">self.caller</span>: The address that triggered the execution
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-rose-400">self.signers</span>: Multi-signer authorization set
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
