'use client';

import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ToolEntry, ToolID, TOOLS_CONFIG, UseCase, AuditResult } from '@/lib/types';
import { runAudit } from '@/lib/auditEngine';
import AuditResults from './AuditResults';
import { Check, AlertCircle, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USE_CASES: { id: UseCase; label: string }[] = [
  { id: 'coding', label: 'Coding / Development' },
  { id: 'general', label: 'General / Writing' },
  { id: 'enterprise', label: 'Enterprise / Teams' },
  { id: 'individual', label: 'Individual Use' },
];

export default function SpendForm() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [entries, setEntries] = useLocalStorage<ToolEntry[]>('audit-entries', []);
  const [results, setResults] = useState<AuditResult | null>(null);

  // Fix hydration mismatch
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Sync selected tools only after mounting to avoid hydration mismatch
  const activeSelectedTools = React.useMemo(() => {
    if (!isMounted) return new Set<ToolID>();
    return new Set(entries.map((e) => e.toolId));
  }, [isMounted, entries]);

  const toggleTool = (toolId: ToolID) => {
    const newSelected = new Set(activeSelectedTools);
    if (newSelected.has(toolId)) {
      newSelected.delete(toolId);
      setEntries(entries.filter((e) => e.toolId !== toolId));
    } else {
      newSelected.add(toolId);
      setEntries([...entries, { toolId, plan: '', seats: 1, monthlySpend: 0, useCase: 'general' }]);
    }
  };

  const updateEntry = (toolId: ToolID, updates: Partial<ToolEntry>) => {
    setEntries(entries.map((e) => (e.toolId === toolId ? { ...e, ...updates } : e)));
  };

  const handleRunAudit = () => {
    const auditResults = runAudit(entries);
    setResults(auditResults);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isValid = useMemo(() => {
    if (entries.length === 0) return false;
    return entries.every((e) => e.plan && e.seats >= 1 && e.monthlySpend >= 0);
  }, [entries]);

  if (!isMounted) return null;

  if (results) {
    return <AuditResults results={results} onReset={() => setResults(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Select your AI Tools</h2>
          <p className="text-slate-500 mt-1">Which platforms are you currently paying for?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOOLS_CONFIG.map((tool) => {
            const isSelected = activeSelectedTools.has(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium',
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 hover:bg-slate-100'
                )}
              >
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center mb-2',
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-200'
                  )}
                >
                  {isSelected && <Check size={14} />}
                </div>
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 px-2">Usage Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => {
              const tool = TOOLS_CONFIG.find((t) => t.id === entry.toolId);
              return (
                <div
                  key={entry.toolId}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{tool?.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {tool?.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        Plan Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Pro, Team, Business"
                        value={entry.plan}
                        onChange={(e) => updateEntry(entry.toolId, { plan: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                          Seats
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={entry.seats === 0 ? '' : entry.seats}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d+$/.test(val)) {
                              updateEntry(entry.toolId, { seats: val === '' ? 0 : parseInt(val) });
                            }
                          }}
                          onBlur={() => {
                            if (entry.seats < 1) updateEntry(entry.toolId, { seats: 1 });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">
                          Monthly ($)
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={entry.monthlySpend === 0 ? '' : entry.monthlySpend}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                              updateEntry(entry.toolId, {
                                monthlySpend: val === '' ? 0 : parseFloat(val),
                              });
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-500 mb-1 block">
                        Primary Use Case
                      </label>
                      <select
                        value={entry.useCase}
                        onChange={(e) =>
                          updateEntry(entry.toolId, { useCase: e.target.value as UseCase })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-slate-900 appearance-none bg-white"
                      >
                        {USE_CASES.map((uc) => (
                          <option key={uc.id} value={uc.id}>
                            {uc.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center pt-8">
        {!isValid && entries.length > 0 && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-xs font-medium mb-4 border border-amber-100">
            <AlertCircle size={14} />
            Please fill in all plan names and ensure seats ≥ 1
          </div>
        )}

        <button
          onClick={handleRunAudit}
          disabled={!isValid}
          className={cn(
            'px-10 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-200 flex items-center gap-3',
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          Run Audit Engine
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
