import { runAudit } from '../lib/auditEngine';
import { ToolEntry } from '../lib/types';

describe('Audit Engine', () => {
  // Test 1: Solo user on Business plan
  test('T01: recommends downgrade for solo user on Cursor Business', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Business', seats: 1, monthlySpend: 40, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(20);
    expect(result.recommendations[0].recommendedAction).toBe('Switch the solo user to Cursor Pro');
    expect(result.recommendations[0].status).toBe('savings_found');
  });

  // Test 2: Cheap alternative for coder on ChatGPT Business
  test('T02: recommends cheaper alternative for solo ChatGPT Business coder', () => {
    const entries: ToolEntry[] = [
      { toolId: 'chatgpt', plan: 'Business', seats: 1, monthlySpend: 25, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(15);
    expect(result.recommendations[0].recommendedAction).toContain('GitHub Copilot Pro');
  });

  // Test 3: Already optimal plan
  test('T03: marks already optimal plan with zero savings', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 20, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    expect(result.recommendations[0].status).toBe('already_optimal');
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
  });

  // Test 4: High-volume API migration
  test('T04: recommends model migration for high-volume OpenAI API usage (>$500)', () => {
    const entries: ToolEntry[] = [
      { toolId: 'openai_api', plan: 'Usage', seats: 1, monthlySpend: 1000, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    expect(result.totalMonthlySavings).toBe(350);
    expect(result.recommendations[0].recommendedAction).toContain('GPT-4o mini');
  });

  // Test 5: 2-seat team on Business — still too small, recommends Pro
  test('T05: recommends Pro for 2-seat team on Cursor Business', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Business', seats: 2, monthlySpend: 80, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    // 2 seats * (40 - 20) = $40 savings
    expect(result.totalMonthlySavings).toBe(40);
    expect(result.recommendations[0].status).toBe('savings_found');
    expect(result.recommendations[0].recommendedAction).toContain('Cursor Pro');
  });

  // Test 6: Large team (50 seats) on Teams plan — correctly marked as optimal
  test('T06: marks 50-seat team on Cursor Teams as already optimal', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Teams', seats: 50, monthlySpend: 2000, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    expect(result.recommendations[0].status).toBe('already_optimal');
    expect(result.totalMonthlySavings).toBe(0);
  });

  // Test 7: Multiple tools — total savings aggregate correctly
  test('T07: total savings aggregate correctly across multiple tools', () => {
    const entries: ToolEntry[] = [
      { toolId: 'cursor', plan: 'Business', seats: 1, monthlySpend: 40, useCase: 'coding' },
      { toolId: 'openai_api', plan: 'Usage', seats: 1, monthlySpend: 1000, useCase: 'coding' },
    ];
    const result = runAudit(entries);
    // Cursor: 20 savings + OpenAI: 350 savings = 370
    expect(result.totalMonthlySavings).toBe(370);
    expect(result.totalAnnualSavings).toBe(4440);
  });
});
