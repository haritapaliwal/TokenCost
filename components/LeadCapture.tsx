'use client';

import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, Shield } from 'lucide-react';

interface LeadCaptureProps {
  auditId: string;
  teamSize: number;
}

export default function LeadCapture({ auditId, teamSize }: LeadCaptureProps) {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent fail for bots

    setStatus('loading');
    try {
      const response = await fetch('/api/capture-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditId, teamSize, honeypot }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save report');

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save report');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-100 rounded-[2rem] p-10 text-center space-y-4 animate-in fade-in zoom-in">
        <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-200">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Report Saved!</h3>
        <p className="text-slate-600 max-w-md mx-auto font-medium">
          Check your inbox. We&apos;ve sent a copy of this audit to{' '}
          <span className="font-bold text-green-700">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 rounded-[2rem] p-10 border border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <Shield size={120} />
      </div>

      <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left max-w-md">
          <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            <Mail className="text-blue-600" size={24} />
            Save your report.
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            Get a permanent copy of this audit sent to your inbox, along with notifications when new
            savings opportunities apply to your stack.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full md:w-auto space-y-2">
          {/* Honeypot field */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-200 active:scale-95"
            >
              {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : 'Save Audit'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-red-500 text-xs font-bold mt-2 text-center md:text-left">
              {errorMessage}
            </p>
          )}
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center md:text-left">
            🔒 No spam. Just your report and stack updates.
          </p>
        </form>
      </div>
    </div>
  );
}
