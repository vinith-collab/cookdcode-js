import { CTCStage } from '../types.js';
import { studentHistoryService } from './studentHistoryService.js';

export interface ProgressAnalysis {
  completedStages: CTCStage[];
  currentStage: CTCStage;
  identifiedMistakes: string[];
  masteredConcepts: string[];
  recommendedHintLevel: number;
  isStuck: boolean;
}

export class StudentProgressAnalyzer {
  public analyze(userId: string, programId: string): ProgressAnalysis {
    const history = studentHistoryService.getHistory(userId, programId);

    const masteredConcepts = new Set<string>();
    const identifiedMistakes: string[] = [];
    const completedStages = new Set<CTCStage>();

    for (const h of history) {
      if (h.concept) {
        if (h.completionStatus === 'completed' || h.completionStatus === 'progressing') {
          masteredConcepts.add(h.concept);
        }
      }
      if (h.completionStatus === 'stuck') {
        identifiedMistakes.push(`Stuck on ${h.section} (attempt #${h.attempt}): "${h.studentInput}"`);
      }
      if (h.completionStatus === 'completed') {
        completedStages.add(h.section);
      }
    }

    const currentStage: CTCStage = completedStages.has('ingredients')
      ? 'samplecode'
      : completedStages.has('recipe')
      ? 'ingredients'
      : completedStages.has('logic')
      ? 'recipe'
      : 'logic';

    const recentItems = history.slice(-3);
    const isStuck = recentItems.length >= 2 && recentItems.every(i => i.completionStatus === 'stuck');
    const recommendedHintLevel = isStuck ? Math.min(recentItems[recentItems.length - 1].hintLevel + 1, 4) : 1;

    return {
      completedStages: Array.from(completedStages),
      currentStage,
      identifiedMistakes,
      masteredConcepts: Array.from(masteredConcepts),
      recommendedHintLevel,
      isStuck
    };
  }
}

export const progressAnalyzer = new StudentProgressAnalyzer();
