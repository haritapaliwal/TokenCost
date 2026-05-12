import SpendForm from '@/components/SpendForm';
import { ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
            Stop overpaying for <span className="text-blue-600">AI tools.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Input your current subscriptions and let our deterministic audit engine find the most
            cost-effective plans for your team&apos;s specific needs.
          </p>

          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <ShieldCheck className="text-green-500" size={20} />
              Deterministic Logic
            </div>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <BarChart3 className="text-blue-500" size={20} />
              Shareable Results
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="py-12">
        <SpendForm />
      </div>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© 2026 AI Spend Audit — Part of the Credex Internship Series</p>
      </footer>
    </main>
  );
}
