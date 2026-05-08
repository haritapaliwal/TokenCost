import { ToolEntry, AuditRecommendation, AuditResult } from './types';

export function runAudit(entries: ToolEntry[]): AuditResult {
  const recommendations: AuditRecommendation[] = [];

  for (const entry of entries) {
    const recommendation = analyzeTool(entry);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  }

  const totalMonthlySavings = recommendations.reduce((acc, curr) => acc + curr.savings, 0);

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
  };
}

function analyzeTool(entry: ToolEntry): AuditRecommendation | null {
  const { toolId, plan, seats, monthlySpend, useCase } = entry;
  let savings = 0;
  let recommendedAction = 'No changes recommended';
  let reason = 'You are currently on the optimal plan for your usage.';

  // 1. CURSOR RULES
  if (toolId === 'cursor') {
    if (plan.toLowerCase().includes('business') && seats === 1) {
      savings = monthlySpend - 20;
      recommendedAction = 'Switch to Cursor Pro';
      reason =
        'Cursor Business at $40/user is meant for teams. For a solo user, Cursor Pro at $20/mo offers the same features for half the price.';
    }
  }

  // 2. CHATGPT RULES
  if (toolId === 'chatgpt') {
    if (plan.toLowerCase().includes('team') && seats === 1) {
      if (useCase === 'coding') {
        savings = monthlySpend - 10;
        recommendedAction = 'Switch to GitHub Copilot Individual';
        reason =
          'For solo coding, GitHub Copilot at $10/mo is more integrated and cheaper than a ChatGPT Team seat ($25/mo).';
      } else {
        savings = monthlySpend - 20;
        recommendedAction = 'Switch to ChatGPT Plus';
        reason =
          'ChatGPT Team requires a 2-seat minimum or higher pricing. For a solo user, ChatGPT Plus at $20/mo is sufficient.';
      }
    }
  }

  // 3. CLAUDE RULES
  if (toolId === 'claude_consumer') {
    if (plan.toLowerCase().includes('team') && seats < 5) {
      savings = monthlySpend - seats * 20;
      recommendedAction = 'Switch to individual Pro plans';
      reason =
        'Claude Team plans have a 5-seat minimum. For fewer users, individual Pro seats at $20/mo are more cost-effective.';
    }
  }

  // 4. API RULES (Generic logic)
  if (toolId === 'openai_api' || toolId === 'anthropic_api') {
    if (useCase === 'general' && monthlySpend > 100) {
      // Suggesting Gemini 1.5 Flash as a cheaper alternative for high-volume general tasks
      const estimatedGeminiSpend = monthlySpend * 0.1; // Flash is roughly 10-20x cheaper than high-end models
      savings = monthlySpend - estimatedGeminiSpend;
      recommendedAction = 'Migrate high-volume tasks to Gemini 1.5 Flash';
      reason =
        'Your API spend is high. Gemini 1.5 Flash is significantly cheaper than GPT-4o or Claude 3.5 Sonnet for general reasoning tasks.';
    }
  }

  // 5. COPILOT RULES
  if (toolId === 'copilot') {
    if (plan.toLowerCase().includes('enterprise') && seats < 10) {
      savings = monthlySpend - seats * 19;
      recommendedAction = 'Downgrade to GitHub Copilot Business';
      reason =
        'Copilot Enterprise features (like custom models) are rarely utilized by small teams. Copilot Business at $19/mo saves $20/user.';
    }
  }

  if (savings <= 0) return null;

  return {
    toolId,
    currentSpend: monthlySpend,
    recommendedAction,
    savings,
    reason,
  };
}
