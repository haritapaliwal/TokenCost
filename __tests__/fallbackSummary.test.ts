import { buildFallbackSummary } from '../lib/fallbackSummary';
import { AuditRecommendation } from '../lib/types';

describe('Fallback Summary Generator', () => {
  const mockRecommendations: AuditRecommendation[] = [
    {
      toolId: 'cursor',
      toolName: 'Cursor',
      plan: 'Business',
      seats: 1,
      currentSpend: 40,
      savings: 20,
      status: 'savings_found',
      finding: 'Finding text',
      recommendedAction: 'Switch to Pro',
      reason: 'Reason text',
    },
  ];

  test('generates savings narrative when savings found', () => {
    const summary = buildFallbackSummary({
      recommendations: mockRecommendations,
      teamSize: 1,
      useCase: 'coding',
      totalMonthlySavings: 20,
      totalAnnualSavings: 240,
    });

    expect(summary).toContain('spending more than necessary');
    expect(summary).toContain('Cursor');
    expect(summary).toContain('Switch to Pro');
    expect(summary).toContain('$20/month');
  });

  test('generates optimal narrative when no savings found', () => {
    const summary = buildFallbackSummary({
      recommendations: [],
      teamSize: 5,
      useCase: 'writing',
      totalMonthlySavings: 0,
      totalAnnualSavings: 0,
    });

    expect(summary).toContain('well-matched');
    expect(summary).toContain('no obvious overspend');
  });
});
