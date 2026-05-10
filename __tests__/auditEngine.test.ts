import { runAudit } from '../lib/auditEngine';
import { ToolEntry } from '../lib/types';

describe('Audit Engine', () => {
  test('recommends downgrade for solo user on Cursor Business', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Business', seats: 1, monthlySpend: 40, useCase: 'coding' },
    ];

    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedAction).toBe('Switch the solo user to Cursor Pro');
    expect(result.recommendations[0].status).toBe('savings_found');
  });

  test('recommends cheaper alternative for solo ChatGPT Business coder', () => {
    const entries: ToolEntry[] = [
      { toolId: 'chatgpt', plan: 'Business', seats: 1, monthlySpend: 25, useCase: 'coding' },
    ];

    const result = runAudit(entries);
    // Business ($25) -> Copilot Pro ($10) = $15 savings
    expect(result.totalMonthlySavings).toBe(15);
    expect(result.recommendations[0].recommendedAction).toContain('GitHub Copilot Pro');
  });

  test('marks optimal plan correctly', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 20, useCase: 'coding' },
    ];

    const result = runAudit(entries);
    expect(result.recommendations[0].status).toBe('already_optimal');
    expect(result.totalMonthlySavings).toBe(0);
  });

  test('recommends model migration for high-volume API users (> $500)', () => {
    const entries: ToolEntry[] = [
      { toolId: 'openai_api', plan: 'Usage', seats: 1, monthlySpend: 1000, useCase: 'coding' },
    ];

    const result = runAudit(entries);
    // 35% of 1000 = 350
    expect(result.totalMonthlySavings).toBe(350);
    expect(result.recommendations[0].recommendedAction).toContain('GPT-4o mini');
  });
});
