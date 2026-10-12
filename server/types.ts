export type CTCStage = 'logic' | 'recipe' | 'ingredients' | 'samplecode';

export interface AiHintRecord {
  id: string;
  programId: string;
  section: CTCStage;
  studentInput: string;
  normalizedInput: string;
  hint: string;
  hintLevel: number;
  concept: string;
  source: 'firebase' | 'llm';
  createdAt: number;
}

export interface StudentHintHistoryItem {
  interactionId: string;
  userId: string;
  programId: string;
  section: CTCStage;
  studentInput: string;
  studentCode?: string;
  hint: string;
  hintLevel: number;
  attempt: number;
  timestamp: number;
  completionStatus: 'stuck' | 'attempting' | 'completed' | 'progressing';
  concept?: string;
  source: 'firebase' | 'llm';
}

export interface MentorHintRequest {
  userId: string;
  programId: string;
  section: CTCStage;
  studentInput?: string;
  studentWorksheet?: string;
  studentCode?: string;
  hintLevel?: number;
  problemTitle?: string;
  problemDescription?: string;
  previousHints?: string[];
  previouslyCompletedStages?: CTCStage[];
  forceLlm?: boolean;
  isClarityRequest?: boolean;
}

export interface MentorHintResponse {
  success: boolean;
  hint: string;
  hintLevel: number;
  source: 'firebase' | 'llm';
  concept: string;
  section: CTCStage;
  shouldRevealSolution?: boolean;
  nextSuggestedAction?: string;
  personalizedReason?: string;
  tokensRemaining?: number;
  cachedInFirebase?: boolean;
}

export interface StructuredLLMOutput {
  hint: string;
  hintLevel: number;
  concept: string;
  section: CTCStage;
  shouldRevealSolution: boolean;
  nextSuggestedAction?: string;
}

export interface ProblemDefinition {
  id: string;
  category: string;
  programName: string;
  description: string;
  concept: string;
  logicReveal?: string;
  recipeReveal?: string;
  ingredientsReveal?: string;
  sampleReveal?: string;
}
