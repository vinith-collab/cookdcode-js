export interface HintLevelDefinition {
  level: number;
  name: string;
  description: string;
  pedagogicalDirective: string;
}

export const HINT_LEVELS: Record<number, HintLevelDefinition> = {
  1: {
    level: 1,
    name: 'Conceptual Hint',
    description: 'High-level conceptual nudge focusing on core mental models and principles without giving steps or code.',
    pedagogicalDirective: 'Ask a thought-provoking question about the fundamental concept. Help student reflect on what the problem is truly asking.'
  },
  2: {
    level: 2,
    name: 'More Specific Guidance',
    description: 'Point toward the next immediate reasoning step or missing pattern.',
    pedagogicalDirective: 'Provide targeted direction for the next mental hurdle. Relate current understanding to what comes immediately next.'
  },
  3: {
    level: 3,
    name: 'Detailed Logical Guidance',
    description: 'Deep logical breakdown of variables, flow, or conditions without writing code.',
    pedagogicalDirective: 'Walk through concrete logical relationships, tracing examples (like dry-running with a small number like 5). Do not give final code.'
  },
  4: {
    level: 4,
    name: 'Very Detailed Implementation Guidance',
    description: 'Precise structural scaffold or syntax guidance, only when explicitly needed at final level.',
    pedagogicalDirective: 'Explain the exact construct or condition needed and where it fits in the program structure. Stop short of giving the complete final solution unless permitted.'
  }
};

export class HintLevelManager {
  public normalizeLevel(level?: number): number {
    if (typeof level !== 'number' || isNaN(level)) return 1;
    return Math.min(Math.max(Math.round(level), 1), 4);
  }

  public getLevelDefinition(level: number): HintLevelDefinition {
    const validLevel = this.normalizeLevel(level);
    return HINT_LEVELS[validLevel];
  }

  public calculateNextLevel(currentLevel: number, consecutiveStuckCount: number): number {
    if (consecutiveStuckCount >= 1) {
      return Math.min(currentLevel + 1, 4);
    }
    return currentLevel;
  }
}

export const hintLevelManager = new HintLevelManager();
