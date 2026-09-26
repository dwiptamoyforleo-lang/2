import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, CheckCircle, Ban, PlusCircle } from 'lucide-react';
import { LeoRecord } from '../types';

interface RecordsVaultProps {
  records: LeoRecord[];
  onAddCustomRecord: (rec: LeoRecord) => void;
}

export const RecordsVault: React.FC<RecordsVaultProps> = ({ records, onAddCustomRecord }) => {
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [filterSpent, setFilterSpent] = useState<'all' | 'unspent' | 'spent'>('unspent');

  const filteredRecords = records.filter((r) => {
    if (filterSpent === 'unspent') return !r.spent;
    if (filterSpent === 'spent') return r.spent;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Zero-Knowledge Records Vault
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Decrypted view of local private records (Leo record UTXOs) stored on-chain in encrypted ciphertext.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setFilterSpent('unspent')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterSpent === 'unspent' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Unspent ({records.filter((r) => !r.spent).length})
            </button>
            <button
              onClick={() => setFilterSpent('spent')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterSpent === 'spent' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Spent ({records.filter((r) => r.spent).length})
            </button>
            <button
              onClick={() => setFilterSpent('all')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterSpent === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({records.length})
            </button>
          </div>

          {/* Toggle View Ciphertext */}
          <button
            onClick={() => setShowEncrypted(!showEncrypted)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {showEncrypted ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{showEncrypted ? 'Show Plaintext' : 'Show Ciphertext'}</span>
          </button>
        </div>
      </div>

      {/* Record Cards Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
          No records match this filter. Execute a mint or transition to create new private records.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className={`rounded-xl border p-4 transition ${
                r.spent
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 shadow-lg hover:border-emerald-700/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">
                      record {r.recordName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {r.programId}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5 truncate max-w-[260px]">
                    ID: {r.id}
                  </div>
                </div>

                {r.spent ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    <Ban className="w-3 h-3 text-slate-400" /> SPENT
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> UNSPENT
                  </span>
                )}
              </div>

              {/* Owner */}
              <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80 text-[11px] font-mono mb-2">
                <span className="text-slate-500 block text-[9px] uppercase">Record Owner</span>
                <span className="text-cyan-400 truncate block">{r.owner}</span>
              </div>

              {/* Data / Payload */}
              {showEncrypted ? (
                <div className="bg-slate-950/90 p-2.5 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1 text-amber-400/90 text-[11px] font-semibold">
                    <Lock className="w-3 h-3" /> On-Chain Ciphertext (AES-GCM / HPKE)
                  </div>
                  <p className="break-all text-slate-500">
                    ciphertext1qgq7yvd7m{r.id.slice(0, 8)}...8a8f192b0c1e
                  </p>
                </div>
              ) : (
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 font-mono text-xs text-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase mb-1 font-semibold">Decrypted Payload</div>
                  {Object.entries(r.data).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-0.5">
                      <span className="text-emerald-400">{key}:</span>
                      <span className="text-slate-300">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
