'use client';

import React, { useEffect, useState } from 'react';
import { AuditResult, TOOLS_CONFIG, UseCase } from '@/lib/types';
import {
  TrendingDown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import LeadCapture from './LeadCapture';

interface AuditResultsProps {
  results: AuditResult;
  teamSize: number;
  useCase: UseCase;
  isPublic?: boolean;
  onReset?: () => void;
}

export default function AuditResults({
  results,
  teamSize,
  useCase,
  isPublic = false,
  onReset,
}: AuditResultsProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [auditId, setAuditId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const hasSavings = results.totalMonthlySavings > 0;
  const isHighSavings = results.totalMonthlySavings > 500;

  useEffect(() => {
    async function saveAuditAndFetchSummary() {
      try {
        // 1. Save Audit to Supabase
        const saveResponse = await fetch('/api/save-audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recommendations: results.recommendations,
            totalMonthlySavings: results.totalMonthlySavings,
            totalAnnualSavings: results.totalAnnualSavings,
            teamSize,
            useCase,
          }),
        });
        const saveData = await saveResponse.json();
        if (saveData.id) setAuditId(saveData.id);

        // 2. Fetch AI Summary
        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recommendations: results.recommendations,
            teamSize,
            useCase,
            totalMonthlySavings: results.totalMonthlySavings,
            totalAnnualSavings: results.totalAnnualSavings,
          }),
        });
        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error('Failed to process audit:', error);
      } finally {
        setLoadingSummary(false);
      }
    }

    saveAuditAndFetchSummary();
  }, [results, teamSize, useCase]);

  const copyShareLink = () => {
    if (!auditId) return;
    const url = `${window.location.origin}/audit/${auditId}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-6 animate-in fade-in zoom-in duration-700">
      {/* Hero Section - Dark Premium */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 opacity-50" />
        <div className="relative p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              AI Spend Audit Complete
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {hasSavings ? "You're overspending on AI." : 'Your stack is optimized.'}
            </h2>
            <p className="text-slate-400 text-lg max-w-md font-medium">
              {hasSavings
                ? `We've identified $${results.totalAnnualSavings.toLocaleString()} in annual waste across your subscriptions.`
                : "You're currently using the most cost-effective tiers for your team size."}
            </p>

            {auditId && (
              <div className="pt-2">
                <button
                  onClick={copyShareLink}
                  aria-label={
                    copySuccess ? 'Link copied to clipboard' : 'Copy shareable link to clipboard'
                  }
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-sm"
                >
                  {copySuccess ? (
                    <Check size={16} className="text-green-400" />
                  ) : (
                    <Copy size={16} />
                  )}
                  {copySuccess ? 'Link Copied!' : 'Copy Shareable Link'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-10 min-w-[280px] text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                  Total Annual Savings
                </div>
                <div className="text-6xl md:text-7xl font-black tracking-tighter flex items-start justify-center">
                  <span className="text-3xl mt-2 mr-1 text-blue-500">$</span>
                  {results.totalAnnualSavings.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
          <Sparkles className="text-blue-600" size={20} />
          AI Analysis Summary
        </div>
        {loadingSummary ? (
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-[90%] animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-[95%] animate-pulse" />
          </div>
        ) : (
          <p className="text-slate-600 leading-relaxed text-lg italic">&ldquo;{summary}&rdquo;</p>
        )}
      </div>

      {/* Recommendations List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingDown className="text-blue-600" size={24} />
            Optimization Breakdown
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            {results.recommendations.length} Tools Analyzed
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {results.recommendations.map((rec, index) => {
            const tool = TOOLS_CONFIG.find((t) => t.id === rec.toolId);
            const isOptimal = rec.status === 'already_optimal';

            return (
              <div
                key={index}
                className={`group rounded-3xl border p-8 transition-all duration-300 flex flex-col lg:flex-row gap-8 items-start lg:items-center ${
                  isOptimal
                    ? 'bg-slate-50/50 border-slate-100 opacity-80'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200'
                }`}
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOptimal ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}
                    >
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-xl tracking-tight">
                          {tool?.name}
                        </span>
                        {isOptimal && (
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-lg uppercase tracking-tight">
                            Optimal
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm font-medium">
                        {rec.plan} • {rec.seats} Seat{rec.seats !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-900 font-bold leading-tight">{rec.finding}</p>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{rec.reason}</p>
                  </div>
                </div>

                {!isOptimal ? (
                  <div className="flex flex-col items-start lg:items-end gap-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-6 w-full lg:w-auto">
                      <div className="flex-1 lg:text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Monthly Savings
                        </div>
                        <div className="text-3xl font-black text-green-600 tracking-tighter">
                          +${rec.savings.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        aria-label={
                          expandedCard === index
                            ? `Collapse action for ${tool?.name}`
                            : `See recommended action for ${tool?.name}`
                        }
                        className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shrink-0 shadow-lg hover:shadow-blue-200 group-hover:-translate-y-1"
                      >
                        {expandedCard === index ? 'Close' : 'Action'}
                        <ArrowRight
                          size={16}
                          className={`transition-transform ${expandedCard === index ? 'rotate-90' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Inline Action Panel */}
                    {expandedCard === index && (
                      <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                          Recommended Action
                        </p>
                        <p className="text-blue-900 font-bold text-sm leading-relaxed">
                          {rec.recommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-right hidden lg:block pr-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Status
                    </div>
                    <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                      Already Optimal
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lead Capture / Email Gate */}
      <LeadCapture auditId={auditId || ''} teamSize={teamSize} />

      {/* Credex CTA (Conditional) */}
      {isHighSavings && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck size={120} />
          </div>
          <div className="relative space-y-6 max-w-2xl">
            <h3 className="text-3xl font-black leading-tight">
              You could save even more with discounted Credex credits.
            </h3>
            <p className="text-blue-100 text-lg font-medium opacity-90">
              Your spend profile qualifies for enterprise-grade credit discounts. Most teams save an
              additional 15-25% on top of these optimizations.
            </p>
            <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-colors shadow-xl">
              Book a free consultation
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Reset Button (Only if not public) */}
      {!isPublic && (
        <div className="flex flex-col items-center gap-4 pt-10 border-t border-slate-200">
          <button
            onClick={onReset}
            className="text-slate-400 font-bold hover:text-slate-900 transition-colors flex items-center gap-2 text-sm"
            aria-label="Go back and modify audit data"
          >
            Modify Audit Data
          </button>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Deterministic Audit Engine v1.2 • PRICING VERIFIED MAY 2026
          </p>
        </div>
      )}

      {isPublic && (
        <div className="flex flex-col items-center gap-4 pt-10 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Deterministic Audit Engine v1.2 • PRICING VERIFIED MAY 2026
          </p>
        </div>
      )}
    </div>
  );
}
