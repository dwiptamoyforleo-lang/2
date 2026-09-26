import React from 'react';
import { Cpu, ShieldCheck, Terminal, GitBranch, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'editor' | 'proof' | 'vault' | 'arena' | 'docs';
  setActiveTab: (tab: 'editor' | 'proof' | 'vault' | 'arena' | 'docs') => void;
  onResetVault: () => void;
  programName: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetVault,
  programName,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30 px-4 py-2.5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold text-lg">
            2
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-tight text-sm md:text-base">
                Leo 2 Studio
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ZK-SNARK Engine
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-slate-400">dwiptamoyforleo-lang / 2</span>
              <span>•</span>
              <span className="text-emerald-400/90 font-mono">{programName}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeTab === 'editor'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Studio & Editor
          </button>
          <button
            onClick={() => setActiveTab('proof')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeTab === 'proof'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Circuit & Proofs
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeTab === 'vault'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Records Vault
          </button>
          <button
            onClick={() => setActiveTab('arena')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeTab === 'arena'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            2-Party ZK Arena
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
              activeTab === 'docs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            Leo Reference
          </button>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetVault}
            title="Reset vault to initial state"
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset State</span>
          </button>
        </div>
      </div>
    </header>
  );
};
