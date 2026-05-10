# PROMPTS.md

## Feature: AI-generated personalized audit summary

This is the only place in the product where AI is used. The audit math itself is
deterministic hardcoded rules — using AI for the numbers would risk hallucinated
figures, which would destroy trust. The summary is different: its job is to feel
like advice from a knowledgeable colleague, not a spreadsheet printout.

---

## The production prompt

### System prompt

```
You are a concise, direct financial advisor who specializes in AI tool procurement
for startups. You write like a sharp CFO who also understands engineering — no
jargon, no fluff, no upselling language. You tell people exactly what you see and
what to do about it.

Rules you must follow:
- Write exactly one paragraph of 90–110 words. No more, no less.
- Never use bullet points, headers, or lists. Flowing prose only.
- Never say "based on your audit" or "according to the data" — just say it directly.
- Never mention Credex, affiliate links, or commercial services by name except as
  generic category ("a credits marketplace").
- Do not repeat the savings figures verbatim from the input — synthesize them.
- Do not use the words "optimize", "leverage", "utilize", or "streamline".
- If savings are under $100/month, lead with what they're doing right, then note
  the one small adjustment worth making.
- If savings are over $500/month, open with the biggest single opportunity and
  give a concrete first action.
- End with one forward-looking sentence about what to watch for next quarter.
- Tone: honest, direct, slightly dry — like a colleague who knows their stuff.
```

### User prompt (constructed dynamically from audit data)

```
Here is a startup's AI tool audit. Write your summary paragraph now.

Team size: {{teamSize}} people
Primary use case: {{useCase}}
Monthly AI tool budget: ${{totalMonthlySpend}}

Current tools and findings:
{{#each toolResults}}
- {{tool}} ({{plan}}, {{seats}} seat{{#if plural}}s{{/if}}):
  Currently ${{currentSpend}}/month.
  Finding: {{finding}}
  Recommended action: {{recommendedAction}}
  Potential saving: ${{savings}}/month
  Reason: {{reason}}
{{/each}}

Total potential monthly saving: ${{totalMonthlySavings}}
Total potential annual saving: ${{totalAnnualSavings}}

The team's biggest overspend is on: {{biggestOverspendTool}}
The team is already well-optimized on: {{alreadyOptimalTools}}
```

---

## Example filled prompt (for a real audit)

```
Here is a startup's AI tool audit. Write your summary paragraph now.

Team size: 4 people
Primary use case: coding
Monthly AI tool budget: $340

Current tools and findings:
- Cursor (Business plan, 4 seats): Currently $160/month.
  Finding: Business plan at this team size adds admin controls you're unlikely to
  need yet. Pro plan covers all core features.
  Recommended action: Downgrade to Cursor Pro ($80/month for 4 seats).
  Potential saving: $80/month
  Reason: Cursor Business is designed for teams needing SSO and audit logs —
  a 4-person seed team doesn't need either.

- ChatGPT (Team plan, 2 seats): Currently $50/month.
  Finding: For a coding-primary use case with 2 seats, ChatGPT Plus (2×$20)
  covers the same capabilities at the individual level.
  Recommended action: Switch both users to ChatGPT Plus.
  Potential saving: $10/month
  Reason: Team plan adds collaborative workspaces — useful for content teams,
  less useful for developers who primarily want API-quality reasoning.

- GitHub Copilot (Individual plan, 4 seats): Currently $40/month.
  Finding: Well-matched for a coding-primary team at this size.
  Recommended action: No change. Already optimal.
  Potential saving: $0/month
  Reason: Individual plan is the right fit; Business only adds policy controls
  that matter at 25+ seats.

Total potential monthly saving: $90
Total potential annual saving: $1,080

The team's biggest overspend is on: Cursor Business plan
The team is already well-optimized on: GitHub Copilot
```

### Expected output for the above

> "Your Cursor spend is the quick win here — Business plan buys you SSO and audit
> logs, which a four-person coding team won't touch for another year or two. Drop to
> Pro and put that $80 back in the budget immediately. The ChatGPT Team plan is a
> smaller issue but worth tidying up: two Plus subscriptions cover everything you're
> actually using, and the collaborative workspace features are built for content
> workflows, not engineering ones. GitHub Copilot is well-chosen for a coding-heavy
> team and worth keeping. In Q3, revisit Cursor again — if your team grows past eight,
> Business starts making sense."

---

## Implementation (Next.js API route)

```typescript
// app/api/generate-summary/route.ts

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { buildFallbackSummary } from '@/lib/fallbackSummary';
import { AuditResult } from '@/types/audit';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { auditResults, teamSize, useCase, totalMonthlySavings, totalAnnualSavings } = body as {
    auditResults: AuditResult[];
    teamSize: number;
    useCase: string;
    totalMonthlySavings: number;
    totalAnnualSavings: number;
  };

  const totalMonthlySpend = auditResults.reduce((sum, r) => sum + r.currentSpend, 0);
  const biggestOverspend = [...auditResults].sort((a, b) => b.savings - a.savings)[0];
  const alreadyOptimal =
    auditResults
      .filter((r) => r.savings === 0)
      .map((r) => r.tool)
      .join(', ') || 'none';

  const toolLines = auditResults
    .map(
      (r) =>
        `- ${r.tool} (${r.plan}, ${r.seats} seat${r.seats !== 1 ? 's' : ''}): ` +
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

Total potential monthly saving: $${totalMonthlySavings}
Total potential annual saving: $${totalAnnualSavings}

The team's biggest overspend is on: ${biggestOverspend?.tool ?? 'none identified'}
The team is already well-optimized on: ${alreadyOptimal}`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : null;

    if (!text) throw new Error('Empty response from Anthropic API');

    return NextResponse.json({ summary: text, source: 'api' });
  } catch (error) {
    console.error('Anthropic API error — falling back to template:', error);
    const fallback = buildFallbackSummary({
      auditResults,
      teamSize,
      useCase,
      totalMonthlySavings,
      totalAnnualSavings,
    });
    return NextResponse.json({ summary: fallback, source: 'fallback' });
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
```

---

## Fallback function (lib/fallbackSummary.ts)

```typescript
// Used when the Anthropic API is unavailable. Must never throw.

import { AuditResult } from '@/types/audit';

interface FallbackInput {
  auditResults: AuditResult[];
  teamSize: number;
  useCase: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function buildFallbackSummary({
  auditResults,
  teamSize,
  useCase,
  totalMonthlySavings,
  totalAnnualSavings,
}: FallbackInput): string {
  const biggestWin = [...auditResults].sort((a, b) => b.savings - a.savings)[0];
  const hasWins = totalMonthlySavings > 0;

  if (!hasWins) {
    return (
      `Your ${teamSize}-person team is well-matched to your current AI tool subscriptions ` +
      `for ${useCase} work. Each plan fits your usage pattern — no obvious overspend stands out. ` +
      `Keep an eye on seat counts as you grow; the crossover point where team plans become ` +
      `cheaper than individual licenses typically hits around 5–8 seats.`
    );
  }

  return (
    `Your ${teamSize}-person team is spending more than necessary on AI tools for ${useCase} work. ` +
    `The biggest immediate saving is on ${biggestWin.tool}: ${biggestWin.recommendedAction}, ` +
    `which saves $${biggestWin.savings}/month on its own. ` +
    `Across all tools, there's $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) ` +
    `available without losing any meaningful capability. ` +
    `Revisit this audit in 90 days — pricing and plan structures in this space change frequently.`
  );
}
```

---

## What I tried that didn't work

**Attempt 1 — No system prompt, all instructions in the user message.**
The model followed the word count instruction inconsistently — sometimes wrote 150 words,
sometimes 60. Moving the rules to a system prompt and keeping the user message as pure data
made it far more reliable.

**Attempt 2 — Asking for JSON output (`{ summary: string }`).**
The model occasionally wrapped the JSON in markdown code fences, which broke JSON.parse().
Since we only need one field, plain text is simpler and more robust.

**Attempt 3 — Instructing "write like a friend."**
Produced chatty, informal summaries ("Hey, so I looked at your tools and..."). Changed to
"like a colleague who knows their stuff" and the tone shifted to something a CFO would
actually forward to their team.

**Attempt 4 — Including the savings figures in the instruction ("mention that they save
$X").**
The model would parrot the numbers verbatim, which felt robotic. Changed to "synthesize
them" and the output reads much more naturally.

**One specific time the AI was wrong and I caught it:**
When the audit showed $0 savings (all tools already optimal), the model still tried to find
something to criticize — it invented a vague suggestion about "watching API costs" even
when no API tools were in the audit. Added the explicit rule "if savings are under $100,
lead with what they're doing right" and tested several zero-savings inputs to confirm the
model stopped manufacturing problems.
