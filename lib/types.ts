export type ToolID =
  | 'cursor'
  | 'copilot'
  | 'claude_consumer'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'general' | 'enterprise' | 'individual';

export interface ToolEntry {
  toolId: ToolID;
  plan: string;
  seats: number;
  monthlySpend: number;
  useCase: UseCase;
}

export interface AuditRecommendation {
  toolId: ToolID;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
}

export const TOOLS_CONFIG = [
  { id: 'cursor', name: 'Cursor', category: 'IDE' },
  { id: 'copilot', name: 'GitHub Copilot', category: 'IDE' },
  { id: 'claude_consumer', name: 'Claude (Consumer)', category: 'Chat' },
  { id: 'chatgpt', name: 'ChatGPT', category: 'Chat' },
  { id: 'anthropic_api', name: 'Anthropic API', category: 'API' },
  { id: 'openai_api', name: 'OpenAI API', category: 'API' },
  { id: 'gemini', name: 'Google Gemini', category: 'Chat/API' },
  { id: 'windsurf', name: 'Windsurf', category: 'IDE' },
] as const;
