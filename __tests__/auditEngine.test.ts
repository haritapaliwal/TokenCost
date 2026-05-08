import { runAudit } from '../lib/auditEngine';
import { ToolEntry } from '../lib/types';

describe('Audit Engine', () => {
  test('recommends downgrade for solo user on Cursor Business', () => {
    const entries: ToolEntry[] = [
      {
        toolId: 'cursor',
        plan: 'Business',
        seats: 1,
        monthlySpend: 40,
        useCase: 'coding',
      },
    ];

    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedAction).toBe('Switch to Cursor Pro');
  });

  test('recommends cheaper alternative for solo ChatGPT Team coder', () => {
    const entries: ToolEntry[] = [
      {
        toolId: 'chatgpt',
        plan: 'Team',
        seats: 1,
        monthlySpend: 25,
        useCase: 'coding',
      },
    ];

    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(15);
    expect(result.recommendations[0].recommendedAction).toBe('Switch to GitHub Copilot Individual');
  });

  test('recommends no changes for optimal plan', () => {
    const entries: ToolEntry[] = [
      {
        toolId: 'cursor',
        plan: 'Pro',
        seats: 1,
        monthlySpend: 20,
        useCase: 'coding',
      },
    ];

    const result = runAudit(entries);
    expect(result.recommendations.length).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });

  test('recommends Flash migration for high-volume API users', () => {
    const entries: ToolEntry[] = [
      {
        toolId: 'openai_api',
        plan: 'Tier 3',
        seats: 1,
        monthlySpend: 500,
        useCase: 'general',
      },
    ];

    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBeGreaterThan(400);
    expect(result.recommendations[0].recommendedAction).toContain('Gemini 1.5 Flash');
  });
});
