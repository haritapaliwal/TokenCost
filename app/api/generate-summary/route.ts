import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildFallbackSummary } from '@/lib/fallbackSummary';
import { AuditRecommendation } from '@/lib/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  let body: {
    recommendations: AuditRecommendation[];
    teamSize: number;
    useCase: string;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
  } | null = null;
  try {
    const rawBody = await req.json();
    body = rawBody;
    if (!body) throw new Error('Missing request body');
    const { recommendations, teamSize, useCase, totalMonthlySavings, totalAnnualSavings } = body;

    const totalMonthlySpend = recommendations.reduce(
      (sum: number, r: AuditRecommendation) => sum + r.currentSpend,
      0
    );
    const biggestOverspend = [...recommendations].sort((a, b) => b.savings - a.savings)[0];
    const alreadyOptimal =
      recommendations
        .filter((r: AuditRecommendation) => r.status === 'already_optimal')
        .map((r: AuditRecommendation) => r.toolName)
        .join(', ') || 'none identified';

    const toolLines = recommendations
      .map(
        (r: AuditRecommendation) =>
          `- ${r.toolName} (${r.plan}, ${r.seats} seat${r.seats !== 1 ? 's' : ''}): ` +
          `Currently $${r.currentSpend}/month.\n` +
          `  Finding: ${r.finding}\n` +
          `  Recommended action: ${r.recommendedAction}\n` +
          `  Potential saving: $${r.savings}/month\n` +
          `  Reason: ${r.reason}`
      )
      .join('\n\n');

    const userPrompt = `Here is a startup's AI tool audit. Write your summary paragraph now.

Team size: ${teamSize} people
Primary use case: ${useCase}
Monthly AI tool budget: $${totalMonthlySpend}

Current tools and findings:
${toolLines}

Total potential monthly saving: ${totalMonthlySavings}
Total potential annual saving: ${totalAnnualSavings}

The team's biggest overspend is on: ${biggestOverspend?.toolName ?? 'none identified'}
The team is already well-optimized on: ${alreadyOptimal}`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : null;

    if (!text) throw new Error('Empty response from Anthropic API');

    return NextResponse.json({ summary: text, source: 'api' });
  } catch (error) {
    console.error('Anthropic API error — falling back to template:', error);

    if (body) {
      const fallback = buildFallbackSummary({
        recommendations: body.recommendations,
        teamSize: body.teamSize,
        useCase: body.useCase,
        totalMonthlySavings: body.totalMonthlySavings,
        totalAnnualSavings: body.totalAnnualSavings,
      });
      return NextResponse.json({ summary: fallback, source: 'fallback' });
    }

    return NextResponse.json({
      summary:
        'We encountered an error generating your audit summary. Please review the detailed breakdown below.',
      source: 'error',
    });
  }
}

const SYSTEM_PROMPT = `You are a concise, direct financial advisor who specializes in AI tool procurement
for startups. You write like a sharp CFO who also understands engineering — no
jargon, no fluff, no upselling language. You tell people exactly what you see and
what to do about it.

Rules you must follow:
- Write exactly one paragraph of 90–110 words. No more, no less.
- Never use bullet points, headers, or lists. Flowing prose only.
- Never say "based on your audit" or "according to the data" — just say it directly.
- Never mention Credex, affiliate links, or commercial services by name.
- Do not repeat the savings figures verbatim — synthesize them.
- Do not use the words "optimize", "leverage", "utilize", or "streamline".
- If savings are under $100/month, lead with what they're doing right.
- If savings are over $500/month, open with the biggest single opportunity.
- End with one forward-looking sentence about what to watch for next quarter.
- Tone: honest, direct, slightly dry — like a colleague who knows their stuff.`;
