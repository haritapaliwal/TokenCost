import { ToolEntry, AuditRecommendation, AuditResult, ToolID } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED PRICING DATA (May 2026)
// ─────────────────────────────────────────────────────────────────────────────

const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    pro_plus: 60,
    ultra: 200,
    teams: 40,
  },
  copilot: {
    free: 0,
    pro: 10,
    pro_plus: 39,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max_5x: 100,
    max_20x: 200,
    team_standard: 20,
    team_premium: 100,
  },
  chatgpt: {
    free: 0,
    go: 8,
    plus: 20,
    pro: 200,
    business: 20,
  },
  gemini: {
    free: 0,
    one_ai: 19.99,
  },
  windsurf: {
    free: 0,
    pro: 20,
    teams: 40,
  },
} as const;

const TOOL_NAMES: Record<ToolID, string> = {
  cursor: 'Cursor',
  copilot: 'GitHub Copilot',
  claude_consumer: 'Claude',
  anthropic_api: 'Anthropic API',
  chatgpt: 'ChatGPT',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
};

export function runAudit(entries: ToolEntry[]): AuditResult {
  const recommendations = entries.map(analyzeTool);

  const totalMonthlySavings = recommendations.reduce((acc, r) => acc + r.savings, 0);

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: Math.round(totalMonthlySavings * 12),
  };
}

function analyzeTool(entry: ToolEntry): AuditRecommendation {
  const { toolId } = entry;

  switch (toolId) {
    case 'cursor':
      return analyzeCursor(entry);
    case 'copilot':
      return analyzeCopilot(entry);
    case 'claude_consumer':
      return analyzeClaude(entry);
    case 'anthropic_api':
      return analyzeAnthropicApi(entry);
    case 'chatgpt':
      return analyzeChatGPT(entry);
    case 'openai_api':
      return analyzeOpenAiApi(entry);
    case 'gemini':
      return analyzeGemini(entry);
    case 'windsurf':
      return analyzeWindsurf(entry);
    default:
      return optimal(entry, 'No rules defined for this tool yet.');
  }
}

function analyzeCursor(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, monthlySpend, useCase } = entry;
  const p = plan.toLowerCase();

  if (p.includes('teams') || p.includes('business')) {
    const expectedTeamsCost = seats * PRICING.cursor.teams;
    const proAlternativeCost = seats * PRICING.cursor.pro;
    const savings = expectedTeamsCost - proAlternativeCost;

    if (seats <= 2) {
      return savingsFound(entry, savings, {
        finding: `Teams plan at $${PRICING.cursor.teams}/user is designed for teams needing centralized billing and SSO — not necessary at ${seats} seat${seats > 1 ? 's' : ''}.`,
        recommendedAction: `Switch ${seats > 1 ? 'both users' : 'the solo user'} to Cursor Pro`,
        reason: `Cursor Pro at $${PRICING.cursor.pro}/user delivers identical AI capability (same credit pool, same models). The $${PRICING.cursor.teams - PRICING.cursor.pro}/user premium on Teams pays for admin controls and SSO, which aren't worth it below ~5 seats.`,
      });
    }

    if (useCase !== 'coding' && useCase !== 'mixed' && seats >= 3) {
      const altSavings = monthlySpend * 0.5;
      return savingsFound(entry, altSavings, {
        finding: `Cursor is an AI code editor — your primary use case is ${useCase}, not coding.`,
        recommendedAction: 'Evaluate whether Cursor is the right tool for your use case',
        reason: `A ${useCase}-focused team of ${seats} may be better served by Claude Team ($${PRICING.claude.team_standard}/seat) or ChatGPT Business ($${PRICING.chatgpt.business}/seat) — tools designed for writing and research workflows, at a lower price point.`,
      });
    }

    return optimal(
      entry,
      `Teams plan is appropriate for ${seats} developers needing shared rules and centralized billing.`
    );
  }

  if (p.includes('pro+') || p.includes('pro_plus')) {
    if (seats === 1) {
      const savings = PRICING.cursor.pro_plus - PRICING.cursor.pro;
      return savingsFound(entry, savings, {
        finding: `Cursor Pro+ ($${PRICING.cursor.pro_plus}/mo) is only worth upgrading to if you regularly exhaust Pro's $${PRICING.cursor.pro} credit pool mid-month.`,
        recommendedAction: 'Downgrade to Cursor Pro and monitor credit usage for 30 days',
        reason: `Pro+ gives 3× credit usage over Pro. Most developers using Auto mode (which is unlimited) don't exhaust Pro credits. Try Pro for a month — upgrade again only if you hit limits on frontier models.`,
      });
    }
  }

  if (p.includes('ultra')) {
    const savings = PRICING.cursor.ultra - PRICING.cursor.pro;
    return savingsFound(entry, savings, {
      finding: `Cursor Ultra at $${PRICING.cursor.ultra}/mo is designed for developers who run background agents continuously for 8+ hours/day.`,
      recommendedAction: 'Downgrade to Cursor Pro (or Pro+ if you hit limits)',
      reason: `Ultra provides 20× the credit pool of Pro. Unless you're running overnight agentic tasks at massive scale, Pro+ at $${PRICING.cursor.pro_plus}/mo is sufficient — and Pro at $${PRICING.cursor.pro}/mo is right for most developers.`,
    });
  }

  // Check for overspending on the standard Pro plan
  const expectedProCost = seats * PRICING.cursor.pro;
  if (monthlySpend > expectedProCost && !p.includes('pro+') && !p.includes('ultra')) {
    return savingsFound(entry, monthlySpend - expectedProCost, {
      finding: `You are paying $${monthlySpend}/mo for ${seats} seat(s), which is higher than the standard Cursor Pro price of $${PRICING.cursor.pro}/seat.`,
      recommendedAction: `Switch to standard Cursor Pro billing`,
      reason: `Cursor Pro is officially $${PRICING.cursor.pro}/user/mo. Your current spend suggests you may be on an legacy plan or paying for unused add-ons.`,
    });
  }

  return optimal(
    entry,
    `Cursor Pro at $${PRICING.cursor.pro}/user is the right baseline for individual developers.`
  );
}

function analyzeCopilot(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, monthlySpend } = entry;
  const p = plan.toLowerCase();

  if (p.includes('enterprise')) {
    if (seats < 25) {
      const enterprisePerSeat = PRICING.copilot.enterprise;
      const businessPerSeat = PRICING.copilot.business;
      const savings = (enterprisePerSeat - businessPerSeat) * seats;
      return savingsFound(entry, savings, {
        finding: `Copilot Enterprise adds codebase indexing, GitHub.com Chat, and custom models — features that provide ROI at 50+ developers, not ${seats}.`,
        recommendedAction: 'Downgrade to GitHub Copilot Business',
        reason: `Copilot Business at $${PRICING.copilot.business}/user delivers the same IDE completions, chat, and policy controls your team needs. The $${enterprisePerSeat - businessPerSeat}/user Enterprise premium pays for features only large engineering orgs with complex internal codebases fully utilize.`,
      });
    }
    return optimal(
      entry,
      `Copilot Enterprise is appropriate for a ${seats}-person team with complex internal codebase needs.`
    );
  }

  if (p.includes('business')) {
    if (seats < 5) {
      const businessCost = seats * PRICING.copilot.business;
      const proCost = seats * PRICING.copilot.pro;
      const savings = businessCost - proCost;
      return savingsFound(entry, savings, {
        finding: `Copilot Business adds org-wide policy controls, SSO, and IP indemnity — features that matter most to teams with compliance requirements, not a ${seats}-person team.`,
        recommendedAction: `Switch to ${seats} individual Copilot Pro plans`,
        reason: `Copilot Pro at $${PRICING.copilot.pro}/user includes the same AI completions and chat. Business features like SAML SSO and audit logs typically only matter at 10+ seats or when legal/compliance mandates them.`,
      });
    }
    return optimal(
      entry,
      `Copilot Business is well-matched for a ${seats}-person team needing centralized management.`
    );
  }

  if (p.includes('pro+') || p.includes('pro_plus')) {
    const savings = (PRICING.copilot.pro_plus - PRICING.copilot.pro) * seats;
    return savingsFound(entry, savings, {
      finding: `Copilot Pro+ at $${PRICING.copilot.pro_plus}/mo adds access to all models including o3 and Claude Opus 4.6 — only worth it if you consistently exceed Pro's premium request limits.`,
      recommendedAction: 'Downgrade to Copilot Pro and track premium request usage',
      reason: `Copilot Pro at $${PRICING.copilot.pro}/mo covers most development workflows. Upgrade to Pro+ only if you're regularly hitting monthly request caps before month-end — check your usage dashboard first.`,
    });
  }

  // Check for overspending on the standard Pro plan
  const expectedProCost = seats * PRICING.copilot.pro;
  if (
    monthlySpend > expectedProCost &&
    !p.includes('pro+') &&
    !p.includes('business') &&
    !p.includes('enterprise')
  ) {
    return savingsFound(entry, monthlySpend - expectedProCost, {
      finding: `You are paying $${monthlySpend}/mo for ${seats} seat(s), which is higher than the standard Copilot Pro price of $${PRICING.copilot.pro}/seat.`,
      recommendedAction: `Switch to standard GitHub Copilot Pro billing`,
      reason: `Copilot Pro is officially $${PRICING.copilot.pro}/user/mo. Ensure you aren't being double-billed or paying for features you don't use.`,
    });
  }

  return optimal(
    entry,
    `Copilot Pro at $${PRICING.copilot.pro}/user is the right plan for individual developers.`
  );
}

function analyzeClaude(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, monthlySpend, useCase } = entry;
  const p = plan.toLowerCase();

  if ((p.includes('team') || p.includes('team_standard')) && !p.includes('premium')) {
    if (useCase === 'coding') {
      const currentCost = seats * PRICING.claude.team_standard;
      const premiumCost = seats * PRICING.claude.team_premium;
      return optimal(
        entry,
        `Team Standard doesn't include Claude Code — if your team codes with Claude, you need Team Premium at $${PRICING.claude.team_premium}/seat. This would cost $${premiumCost - currentCost}/mo more, but unlocks the terminal agent.`
      );
    }

    if (seats < 5) {
      const teamCost = seats * PRICING.claude.team_standard;
      const proCost = seats * PRICING.claude.pro;
      const savings = Math.max(0, teamCost - proCost);
      if (savings > 0) {
        return savingsFound(entry, savings, {
          finding: `Claude Team plans require a 5-seat minimum. With only ${seats} seats, you're paying for unused capacity or the plan structure doesn't match your size.`,
          recommendedAction: `Switch to ${seats} individual Claude Pro plans`,
          reason: `Claude Pro at $${PRICING.claude.pro}/user includes the same AI access as Team Standard for ${useCase} work — without the 5-seat minimum commitment.`,
        });
      }
    }
    return optimal(
      entry,
      `Claude Team Standard at $${PRICING.claude.team_standard}/seat is appropriate for a ${seats}-person ${useCase} team.`
    );
  }

  if (p.includes('max_5x') || p.includes('max 5x') || p.includes('max5x')) {
    if (seats === 1) {
      const savings = PRICING.claude.max_5x - PRICING.claude.pro;
      return savingsFound(entry, savings, {
        finding: `Claude Max 5x at $${PRICING.claude.max_5x}/mo is for users who consistently hit Pro's usage limits before the reset window.`,
        recommendedAction: 'Downgrade to Claude Pro and monitor usage limits for 2 weeks',
        reason: `Pro at $${PRICING.claude.pro}/mo is sufficient for most power users. Upgrade back to Max 5x only if you're consistently rate-limited during the workday.`,
      });
    }
  }

  if (p.includes('max_20x') || p.includes('max 20x') || p.includes('max20x')) {
    const savings = PRICING.claude.max_20x - PRICING.claude.pro;
    return savingsFound(entry, savings, {
      finding: `Claude Max 20x at $${PRICING.claude.max_20x}/mo provides 20× Pro's usage — only justified for developers running Claude Code agents continuously all day.`,
      recommendedAction: 'Downgrade to Max 5x ($100/mo) or Pro ($20/mo) and test limits',
      reason: `Max 20x is designed for Claude Code power users running multi-hour agentic sessions. Most users are well-served by Pro or Max 5x. Downgrade and spend one week at each tier to find your break-even.`,
    });
  }

  // Check for overspending on the standard Pro plan
  const expectedProCost = seats * PRICING.claude.pro;
  if (monthlySpend > expectedProCost && !p.includes('max')) {
    return savingsFound(entry, monthlySpend - expectedProCost, {
      finding: `You are paying $${monthlySpend}/mo for ${seats} seat(s), which is higher than the standard Claude Pro price of $${PRICING.claude.pro}/seat.`,
      recommendedAction: `Verify your billing and ensure you are only paying $${PRICING.claude.pro}/seat`,
      reason: `Claude Pro is officially $${PRICING.claude.pro}/user/mo. Your current spend suggests you might be paying for extra features or seats that aren't being utilized.`,
    });
  }

  return optimal(
    entry,
    `Claude Pro at $${PRICING.claude.pro}/mo is the right individual plan for ${useCase} work.`
  );
}

function analyzeAnthropicApi(entry: ToolEntry): AuditRecommendation {
  const { monthlySpend, useCase } = entry;

  if (monthlySpend > 80 && useCase !== 'coding') {
    const proSavings = monthlySpend - PRICING.claude.pro;
    if (proSavings > 0) {
      return savingsFound(entry, proSavings, {
        finding: `You're spending $${monthlySpend}/mo on Anthropic API for ${useCase} tasks — a flat subscription may be cheaper.`,
        recommendedAction: 'Switch to Claude Pro subscription for personal/team usage',
        reason: `Claude Pro at $${PRICING.claude.pro}/mo provides substantial usage for ${useCase} workflows via the chat interface. API billing is best for building applications, not for direct usage.`,
      });
    }
  }

  if (monthlySpend > 300) {
    return savingsFound(entry, monthlySpend * 0.4, {
      finding: `API spend of $${monthlySpend}/mo suggests heavy use of Sonnet or Opus — switching high-volume tasks to Haiku 4.5 can cut costs significantly.`,
      recommendedAction: 'Migrate routine tasks to Claude Haiku 4.5 ($1/$5 per MTok)',
      reason: `Haiku 4.5 at $1/MTok input and $5/MTok output is 3–5× cheaper than Sonnet 4.6 ($3/$15) for tasks that don't require deep reasoning (classification, summarization, extraction). Route complex tasks to Sonnet, everything else to Haiku.`,
    });
  }

  return optimal(
    entry,
    `API spend of $${monthlySpend}/mo is reasonable. Confirm model selection aligns with task complexity.`
  );
}

function analyzeChatGPT(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, monthlySpend, useCase } = entry;
  const p = plan.toLowerCase();

  if ((p.includes('business') || p.includes('team')) && seats === 1) {
    const savings = monthlySpend - PRICING.chatgpt.plus;
    if (useCase === 'coding') {
      const copilotSavings = monthlySpend - PRICING.copilot.pro;
      return savingsFound(entry, copilotSavings, {
        finding: `ChatGPT Business has a 2-seat minimum and is built for collaboration — for a solo user doing coding, it's the wrong tool at the wrong price.`,
        recommendedAction: 'Switch to GitHub Copilot Pro ($10/mo) for coding tasks',
        reason: `Copilot Pro at $${PRICING.copilot.pro}/mo is purpose-built for coding with IDE integration. ChatGPT Business pricing starts at 2 seats, making it structurally expensive for solo use.`,
      });
    }
    return savingsFound(entry, savings, {
      finding: `ChatGPT Business requires a minimum of 2 seats — a solo user is paying for team features they don't need.`,
      recommendedAction: 'Downgrade to ChatGPT Plus',
      reason: `ChatGPT Plus at $${PRICING.chatgpt.plus}/mo includes GPT-5.5 access, deep research, and all features a solo user needs. Business adds shared workspaces and admin controls, which require at least 2 people to be useful.`,
    });
  }

  if ((p.includes('business') || p.includes('team')) && seats >= 2 && useCase === 'coding') {
    const chatgptCost = seats * PRICING.chatgpt.business;
    const copilotCost = seats * PRICING.copilot.pro;
    const savings = chatgptCost - copilotCost;
    if (savings > 0) {
      return savingsFound(entry, savings, {
        finding: `For a ${seats}-person coding team, ChatGPT Business ($${PRICING.chatgpt.business}/seat) is less integrated than a dedicated coding tool.`,
        recommendedAction: `Switch to GitHub Copilot Pro for each developer`,
        reason: `Copilot Pro at $${PRICING.copilot.pro}/user integrates directly into your IDE with inline completions and chat. ChatGPT Business is better for writing, research, and general knowledge work than for hands-on coding.`,
      });
    }
  }

  if (p.includes('plus') && seats === 1) {
    return optimal(
      entry,
      `ChatGPT Plus at $${PRICING.chatgpt.plus}/mo is the right individual plan for ${useCase} work.`
    );
  }

  if (p.includes('go') && (useCase === 'research' || useCase === 'data')) {
    return optimal(
      entry,
      `ChatGPT Go at $${PRICING.chatgpt.go}/mo may be limiting for ${useCase} work. Consider upgrading to Plus ($${PRICING.chatgpt.plus}/mo) for deeper research and advanced reasoning models.`
    );
  }

  // Check for overspending on the standard Plus plan
  const expectedPlusCost = seats * PRICING.chatgpt.plus;
  if (
    monthlySpend > expectedPlusCost &&
    !p.includes('business') &&
    !p.includes('team') &&
    !p.includes('pro') &&
    !p.includes('go')
  ) {
    return savingsFound(entry, monthlySpend - expectedPlusCost, {
      finding: `You are paying $${monthlySpend}/mo for ${seats} seat(s), which is higher than the standard ChatGPT Plus price of $${PRICING.chatgpt.plus}/seat.`,
      recommendedAction: `Switch to standard ChatGPT Plus billing`,
      reason: `ChatGPT Plus is officially $${PRICING.chatgpt.plus}/user/mo. Verify that you are not paying for unused team seats or legacy pricing.`,
    });
  }

  return optimal(entry, `ChatGPT spend looks reasonable for ${useCase} work at this tier.`);
}

function analyzeOpenAiApi(entry: ToolEntry): AuditRecommendation {
  const { monthlySpend, useCase } = entry;

  if (monthlySpend > 60 && (useCase === 'writing' || useCase === 'research')) {
    const savings = monthlySpend - PRICING.chatgpt.plus;
    return savingsFound(entry, savings, {
      finding: `You're spending $${monthlySpend}/mo on OpenAI API for ${useCase} tasks that could be covered by a flat subscription.`,
      recommendedAction: 'Switch to ChatGPT Plus ($20/mo) for direct usage',
      reason: `ChatGPT Plus at $${PRICING.chatgpt.plus}/mo provides unlimited access for personal ${useCase} work via the web and mobile apps. API billing makes sense for building apps, not for individuals using GPT directly.`,
    });
  }

  if (monthlySpend > 500) {
    return savingsFound(entry, monthlySpend * 0.35, {
      finding: `API spend of $${monthlySpend}/mo suggests you may be routing all tasks to GPT-4o — lighter models can handle most workloads at a fraction of the cost.`,
      recommendedAction: 'Migrate non-critical tasks to GPT-4o mini or GPT-4.1 mini',
      reason: `GPT-4o mini at ~$0.15/MTok input is 16× cheaper than GPT-4o ($2.50/MTok). Classification, summarization, and extraction tasks rarely need a frontier model. Route only complex reasoning to GPT-4o and you can cut API spend significantly.`,
    });
  }

  return optimal(
    entry,
    `API spend of $${monthlySpend}/mo is in a reasonable range. Confirm model selection matches task complexity.`
  );
}

function analyzeGemini(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, monthlySpend, useCase } = entry;
  const p = plan.toLowerCase();

  if (seats > 2 && (p.includes('one') || p.includes('premium'))) {
    const savings = monthlySpend - seats * 10;
    return savingsFound(entry, Math.max(savings, 0), {
      finding: `${seats} individual Google One AI Premium subscriptions ($${PRICING.gemini.one_ai}/seat) — Google Workspace with Gemini is typically better-priced for teams.`,
      recommendedAction: 'Evaluate Google Workspace Business + Gemini for teams',
      reason: `Google Workspace plans with Gemini included start lower per seat for teams and provide admin controls, shared storage, and unified billing alongside Gemini Advanced access.`,
    });
  }

  if (seats === 1 && useCase === 'coding') {
    const savings = PRICING.gemini.one_ai - PRICING.copilot.pro;
    return savingsFound(entry, savings, {
      finding: `Google One AI Premium is a general AI subscription — for coding specifically, a purpose-built tool provides better IDE integration.`,
      recommendedAction: 'Switch to GitHub Copilot Pro ($10/mo) for coding tasks',
      reason: `Copilot Pro at $${PRICING.copilot.pro}/mo integrates natively into VS Code, JetBrains, and other IDEs with inline completions. Gemini via Google One is browser-first and less optimized for developer workflows.`,
    });
  }

  return optimal(
    entry,
    `Google One AI Premium at $${PRICING.gemini.one_ai}/mo is well-priced for ${useCase} tasks.`
  );
}

function analyzeWindsurf(entry: ToolEntry): AuditRecommendation {
  const { plan, seats, useCase } = entry;
  const p = plan.toLowerCase();

  if ((p.includes('teams') || p.includes('business')) && seats <= 2) {
    const savings = (PRICING.windsurf.teams - PRICING.windsurf.pro) * seats;
    return savingsFound(entry, savings, {
      finding: `Windsurf Teams at $${PRICING.windsurf.teams}/user adds admin controls and centralized billing — not necessary for ${seats} developer${seats > 1 ? 's' : ''}.`,
      recommendedAction: 'Switch to Windsurf Pro',
      reason: `Windsurf Pro at $${PRICING.windsurf.pro}/user gives the same AI coding experience as Teams. The $${PRICING.windsurf.teams - PRICING.windsurf.pro}/user premium pays for org management features that become useful at 5+ seats.`,
    });
  }

  if (useCase !== 'coding' && useCase !== 'mixed') {
    const savings = seats * PRICING.windsurf.pro * 0.5;
    return savingsFound(entry, savings, {
      finding: `Windsurf is an AI code editor — your primary use case is ${useCase}, not coding.`,
      recommendedAction: `Evaluate Claude Pro or ChatGPT Plus for ${useCase} workflows instead`,
      reason: `Windsurf is purpose-built for developers writing and editing code. For ${useCase} work, a general AI assistant like Claude Pro ($${PRICING.claude.pro}/mo) or ChatGPT Plus ($${PRICING.chatgpt.plus}/mo) is a better fit at the same or lower price.`,
    });
  }

  return optimal(
    entry,
    `Windsurf Pro at $${PRICING.windsurf.pro}/user is a well-priced coding tool.`
  );
}

function savingsFound(
  entry: ToolEntry,
  savings: number,
  details: { finding: string; recommendedAction: string; reason: string }
): AuditRecommendation {
  return {
    toolId: entry.toolId,
    toolName: TOOL_NAMES[entry.toolId],
    plan: entry.plan,
    seats: entry.seats,
    currentSpend: entry.monthlySpend,
    savings: Math.max(0, Math.round(savings)),
    status: savings > 0 ? 'savings_found' : 'already_optimal',
    ...details,
  };
}

function optimal(entry: ToolEntry, reason: string): AuditRecommendation {
  return {
    toolId: entry.toolId,
    toolName: TOOL_NAMES[entry.toolId],
    plan: entry.plan,
    seats: entry.seats,
    currentSpend: entry.monthlySpend,
    savings: 0,
    status: 'already_optimal',
    finding: 'Plan is well-matched to your team size and use case.',
    recommendedAction: 'No changes recommended.',
    reason,
  };
}
