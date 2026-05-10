import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AuditResults from '@/components/AuditResults';
import { Metadata } from 'next';
import { AuditRecommendation, UseCase } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAudit(id: string) {
  const { data, error } = await supabaseAdmin.from('audits').select('*').eq('id', id).single();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAudit(id);
  if (!audit) return { title: 'Audit Not Found' };

  const savings = audit.total_monthly_savings;
  const title = `I'm overpaying $${savings}/mo on AI tools — here's my audit.`;
  const description = `We found $${audit.total_annual_savings.toLocaleString()} in annual waste in this AI stack. Check your own spend in 60 seconds.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: ['https://tokens.credex.ai/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://tokens.credex.ai/og-image.png'],
    },
  };
}

export default async function AuditPage({ params }: PageProps) {
  const { id } = await params;
  const audit = await getAudit(id);

  if (!audit) {
    notFound();
  }

  const results = {
    recommendations: audit.tools as AuditRecommendation[],
    totalMonthlySavings: audit.total_monthly_savings,
    totalAnnualSavings: audit.total_annual_savings,
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-5xl mx-auto px-6 mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          ← Create Your Own Audit
        </Link>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Public Report • Read Only
        </div>
      </div>

      <AuditResults
        results={results}
        teamSize={audit.team_size}
        useCase={audit.use_case as UseCase}
        isPublic={true}
      />
    </main>
  );
}
