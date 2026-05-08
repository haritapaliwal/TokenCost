import React from 'react';
import { AuditResult, TOOLS_CONFIG } from '@/lib/types';
import { TrendingDown, CheckCircle2, ArrowRight, DollarSign } from 'lucide-react';

interface AuditResultsProps {
  results: AuditResult;
  onReset: () => void;
}

export default function AuditResults({ results, onReset }: AuditResultsProps) {
  const hasSavings = results.totalMonthlySavings > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-in fade-in zoom-in duration-500">
      {/* Header Card */}
      <div
        className={`rounded-3xl p-8 text-white shadow-2xl ${hasSavings ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Audit Report</h2>
            <p className="text-blue-100 opacity-90 font-medium">
              {hasSavings
                ? 'We&apos;ve identified significant optimization opportunities for your team.'
                : 'Your current tool mix is already highly optimized. Great job!'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-w-[200px]">
            <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">
              Total Annual Savings
            </div>
            <div className="text-4xl font-black flex items-baseline">
              <DollarSign size={24} className="mr-1" />
              {results.totalAnnualSavings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 px-2 flex items-center gap-2">
          <TrendingDown className="text-blue-600" size={20} />
          Optimization Steps
        </h3>

        {results.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {results.recommendations.map((rec, index) => {
              const tool = TOOLS_CONFIG.find((t) => t.id === rec.toolId);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="font-bold text-slate-900 text-lg">{tool?.name}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{rec.reason}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex-1 md:text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Monthly Savings
                      </div>
                      <div className="text-2xl font-black text-green-600 tracking-tight">
                        +${rec.savings.toLocaleString()}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                    <button
                      onClick={() =>
                        alert(
                          `Taking action for ${tool?.name}...\nIn the final version, this will redirect to the tool&apos;s upgrade/downgrade page.`
                        )
                      }
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      Action
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-lg">No Waste Found</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We analyzed all your subscriptions and couldn&apos;t find any cheaper alternatives
              that match your current performance.
            </p>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="text-slate-500 font-bold hover:text-slate-900 transition-colors flex items-center gap-2 text-sm"
        >
          Modify Audit Data
        </button>
      </div>
    </div>
  );
}
