import React, { useState } from 'react';
import { Copy, Check, FileCheck, Code2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  programName: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChangeCode,
  programName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Editor Top Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-semibold text-slate-300">
            src/main.leo ({programName})
          </span>
          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/50">
            Aleo Leo v1.12
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex overflow-auto font-mono text-xs relative max-h-[520px]">
        {/* Line Numbers */}
        <div className="select-none py-3 px-3 bg-slate-950/80 text-slate-600 text-right font-mono border-r border-slate-800/60 leading-6">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea for editable code */}
        <textarea
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          spellCheck={false}
          className="flex-1 p-3 bg-transparent text-slate-200 outline-none resize-none font-mono leading-6 whitespace-pre overflow-x-auto focus:ring-0 selection:bg-emerald-500/20"
        />
      </div>

      {/* Status Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <FileCheck className="w-3.5 h-3.5" />
            Syntax Verified
          </span>
          <span>{lines.length} lines</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Target: snarkVM R1CS</span>
        </div>
      </div>
    </div>
  );
};
