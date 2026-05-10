import { AuditRecommendation } from './types';

interface FallbackInput {
  recommendations: AuditRecommendation[];
  teamSize: number;
  useCase: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export function buildFallbackSummary({
  recommendations,
  teamSize,
  useCase,
  totalMonthlySavings,
  totalAnnualSavings,
}: FallbackInput): string {
  const biggestWin = [...recommendations].sort((a, b) => b.savings - a.savings)[0];
  const hasWins = totalMonthlySavings > 0;

  if (!hasWins || !biggestWin) {
    return (
      `Your ${teamSize}-person team is well-matched to your current AI tool subscriptions ` +
      `for ${useCase} work. Each plan fits your usage pattern — no obvious overspend stands out. ` +
      `Keep an eye on seat counts as you grow; the crossover point where team plans become ` +
      `cheaper than individual licenses typically hits around 5–8 seats.`
    );
  }

  return (
    `Your ${teamSize}-person team is spending more than necessary on AI tools for ${useCase} work. ` +
    `The biggest immediate saving is on ${biggestWin.toolName}: ${biggestWin.recommendedAction}, ` +
    `which saves $${biggestWin.savings}/month on its own. ` +
    `Across all tools, there's $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) ` +
    `available without losing any meaningful capability. ` +
    `Revisit this audit in 90 days — pricing and plan structures in this space change frequently.`
  );
}
