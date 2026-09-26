import React from 'react';
import { FileCode, Layers, Shield, ChevronRight, Activity, Terminal } from 'lucide-react';
import { LeoProgram, LeoRecord } from '../types';

interface SidebarProps {
  programs: LeoProgram[];
  selectedProgramId: string;
  onSelectProgram: (id: string) => void;
  selectedTransition: string;
  onSelectTransition: (name: string) => void;
  records: LeoRecord[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  programs,
  selectedProgramId,
  onSelectProgram,
  selectedTransition,
  onSelectTransition,
  records,
}) => {
  const currentProgram = programs.find((p) => p.id === selectedProgramId);
  const activeRecordsCount = records.filter((r) => !r.spent).length;

  return (
    <aside className="w-full lg:w-72 bg-slate-900/60 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 flex flex-col gap-5 flex-shrink-0">
      {/* Program Selector */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            Programs (.aleo)
          </span>
          <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {programs.length}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {programs.map((prog) => {
            const isSelected = prog.id === selectedProgramId;
            return (
              <button
                key={prog.id}
                onClick={() => onSelectProgram(prog.id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between group ${
                  isSelected
                    ? 'bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-800/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="truncate">{prog.name}</span>
                </div>
                {isSelected && <ChevronRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Program Description */}
      {currentProgram && (
        <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 text-xs">
          <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            Program Overview
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {currentProgram.description}
          </p>
        </div>
      )}

      {/* Available Transitions */}
      {currentProgram && (
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Transitions
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentProgram.transitions.length} funcs
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {currentProgram.transitions.map((t) => {
              const isSelected = t.name === selectedTransition;
              return (
                <button
                  key={t.name}
                  onClick={() => onSelectTransition(t.name)}
                  className={`text-left px-3 py-1.5 rounded-md text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{t.name}()</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ~{t.estimatedConstraints}c
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Records Snapshot */}
      <div className="mt-auto bg-slate-950/80 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center gap-1 font-semibold">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            ZK Records Vault
          </span>
          <span className="text-emerald-400 font-mono font-bold text-xs">
            {activeRecordsCount} active
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          Private state UTXOs ready for zero-knowledge transitions.
        </p>
      </div>
    </aside>
  );
};
