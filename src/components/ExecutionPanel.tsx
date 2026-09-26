import React from 'react';
import { Play, Sparkles, CheckCircle2, AlertCircle, ShieldAlert, Clock, Zap } from 'lucide-react';
import { TransitionDef, LeoRecord, ExecutionTrace } from '../types';

interface ExecutionPanelProps {
  transition: TransitionDef | undefined;
  caller: string;
  onChangeCaller: (caller: string) => void;
  inputs: Record<string, string>;
  onChangeInput: (name: string, value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  records: LeoRecord[];
  lastTrace?: ExecutionTrace;
  error?: string;
}

const PRESET_CALLERS = [
  { label: 'Alice (Default)', address: 'aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwqq25aut79cgrunmt6zfydvs9x2pkq' },
  { label: 'Bob (Peer)', address: 'aleo1s35vd499h7ygt7jxhauq204x0e6vhnz255n9q766x9q22q5z0y9sl92y6m' },
  { label: 'Signer 2 (Multisig)', address: 'aleo1234567890abcdefghijklmnopqrstuvwxyz222222' },
];

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  transition,
  caller,
  onChangeCaller,
  inputs,
  onChangeInput,
  onExecute,
  isExecuting,
  records,
  lastTrace,
  error,
}) => {
  if (!transition) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
        Select a transition to configure inputs and generate zero-knowledge proof.
      </div>
    );
  }

  // Available unspent records
  const unspentRecords = records.filter((r) => !r.spent);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white font-mono">
              transition {transition.name}()
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              ~{transition.estimatedConstraints} constraints
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{transition.description}</p>
        </div>

        {/* Action Button */}
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isExecuting ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Proving Circuit...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Prove & Execute
            </>
          )}
        </button>
      </div>

      {/* Caller Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>self.caller (Signer Address)</span>
          <span className="text-slate-500 normal-case font-normal">Private execution origin</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {PRESET_CALLERS.map((c) => {
            const isSelected = caller === c.address;
            return (
              <button
                key={c.address}
                type="button"
                onClick={() => onChangeCaller(c.address)}
                className={`text-left p-2 rounded-lg border text-xs transition ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold">{c.label}</div>
                <div className="font-mono text-[10px] text-slate-500 truncate">{c.address}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs Configuration */}
      <div className="space-y-3">
        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
          Transition Arguments
        </div>

        {transition.inputs.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">No inputs required for this transition.</div>
        ) : (
          <div className="space-y-2.5">
            {transition.inputs.map((inp) => {
              const isRecordType = inp.type !== 'address' && inp.type !== 'u64' && inp.type !== 'u32' && inp.type !== 'bool' && inp.type !== 'field';
              const matchingRecords = unspentRecords.filter(
                (r) => r.recordName.toLowerCase() === inp.type.toLowerCase()
              );

              return (
                <div key={inp.name} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-emerald-400">
                      {inp.name}: <span className="text-slate-400">{inp.type}</span>
                    </span>
                    {inp.description && (
                      <span className="text-[11px] text-slate-500">{inp.description}</span>
                    )}
                  </div>

                  {isRecordType ? (
                    <div>
                      <select
                        value={inputs[inp.name] || ''}
                        onChange={(e) => onChangeInput(inp.name, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">-- Select an unspent {inp.type} record --</option>
                        {matchingRecords.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.id} (Owner: {r.owner.slice(0, 10)}... | {JSON.stringify(r.data)})
                          </option>
                        ))}
                      </select>
                      {matchingRecords.length === 0 && (
                        <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          No unspent {inp.type} records available. Mint or place a bid first!
                        </p>
                      )}
                    </div>
                  ) : inp.type === 'bool' ? (
                    <select
                      value={inputs[inp.name] ?? 'true'}
                      onChange={(e) => onChangeInput(inp.name, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={inputs[inp.name] ?? inp.defaultValue}
                      onChange={(e) => onChangeInput(inp.name, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Constraint Check Failed</div>
            <div className="text-rose-200/80 text-[11px] mt-0.5">{error}</div>
          </div>
        </div>
      )}

      {/* Last Execution Trace Mini-Summary */}
      {lastTrace && !error && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ZK-Proof Verified & Transition Executed
            </span>
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastTrace.proof.provingTimeMs} ms
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <div className="bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-500 block text-[9px]">CONSTRAINTS</span>
              <span className="text-slate-200">{lastTrace.proof.circuitConstraints}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-500 block text-[9px]">WITNESSES</span>
              <span className="text-slate-200">{lastTrace.proof.witnessCount}</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-500 block text-[9px]">GAS COST</span>
              <span className="text-slate-200">{lastTrace.gasCost} ucredits</span>
            </div>
            <div className="bg-slate-950/60 p-1.5 rounded">
              <span className="text-slate-500 block text-[9px]">PRODUCED UTXOS</span>
              <span className="text-emerald-400">+{lastTrace.createdRecords.length} records</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
