export type ToolID =
  | 'cursor'
  | 'copilot'
  | 'claude_consumer'
  | 'anthropic_api'
  | 'chatgpt'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolEntry {
  toolId: ToolID;
  plan: string;
  seats: number;
  monthlySpend: number;
  useCase: UseCase;
}

export type AuditStatus = 'savings_found' | 'already_optimal' | 'overpaying';

export interface AuditRecommendation {
  toolId: ToolID;
  toolName: string;
  plan: string;
  seats: number;
  currentSpend: number;
  recommendedAction: string;
  finding: string;
  reason: string;
  savings: number;
  status: AuditStatus;
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export const TOOLS_CONFIG = [
  { id: 'cursor', name: 'Cursor', category: 'IDE' },
  { id: 'copilot', name: 'GitHub Copilot', category: 'IDE' },
  { id: 'claude_consumer', name: 'Claude', category: 'Chat' },
  { id: 'chatgpt', name: 'ChatGPT', category: 'Chat' },
  { id: 'anthropic_api', name: 'Anthropic API', category: 'API' },
  { id: 'openai_api', name: 'OpenAI API', category: 'API' },
  { id: 'gemini', name: 'Gemini', category: 'Chat/API' },
  { id: 'windsurf', name: 'Windsurf', category: 'IDE' },
] as const;
