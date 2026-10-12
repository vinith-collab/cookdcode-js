import { CTCStage, MentorHintRequest, ProblemDefinition } from '../types.js';
import { SEED_PROBLEMS } from '../data/seedData.js';
import { studentHistoryService } from './studentHistoryService.js';
import { progressAnalyzer } from './progressAnalyzer.js';

export interface FullLearningContext {
  userId: string;
  programId: string;
  problem: ProblemDefinition;
  section: CTCStage;
  stageObjective: string;
  studentInput: string;
  normalizedInput: string;
  studentWorksheet?: string;
  studentCode?: string;
  hintLevel: number;
  previousHints: string[];
  previousMistakes: string[];
  completedStages: CTCStage[];
  attemptCount: number;
  studentMasteredConcepts: string[];
  isClarityRequest?: boolean;
  curriculumHint?: string;
  curriculumInput?: string;
}

export class ContextCollector {
  private getStageObjective(section: CTCStage): string {
    switch (section) {
      case 'logic':
        return 'Understand the problem conceptually, identify patterns, conditions, and algorithmic thinking BEFORE code syntax. No code allowed.';
      case 'recipe':
        return 'Convert the logic into a clear sequential, human-readable plan (step-by-step algorithm). What happens first, next, in loops/branches.';
      case 'ingredients':
        return 'Identify exact programming constructs needed (variables, loops, conditions, operators, functions, data structures) and explain WHY.';
      case 'samplecode':
        return 'Assemble constructs into executable program flow, dry run execution, trace test cases, input/processing/output debugging.';
    }
  }

  public collect(request: MentorHintRequest): FullLearningContext {
    const userId = request.userId || 'anonymous_student';
    const programId = request.programId || 'sum-natural-numbers';
    const section = request.section || 'logic';
    const studentInput = (request.studentInput || '').trim();
    const normalizedInput = studentInput.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

    // Look up problem definition or generate fallback
    const problem = SEED_PROBLEMS[programId] || {
      id: programId,
      category: 'fundamentals',
      programName: request.problemTitle || programId.replace(/-/g, ' ').toUpperCase(),
      description: request.problemDescription || 'Write a program to solve this coding challenge according to Cook The Code principles.',
      concept: 'Algorithmic Thinking'
    };

    // Get historical context for this student and problem
    const history = studentHistoryService.getHistory(userId, programId);
    const sectionHistory = history.filter(h => h.section === section);

    const previousHints = [
      ...(request.previousHints || []),
      ...sectionHistory.map(h => h.hint)
    ].filter((v, i, a) => a.indexOf(v) === i);

    const analysis = progressAnalyzer.analyze(userId, programId);

    return {
      userId,
      programId,
      problem,
      section,
      stageObjective: this.getStageObjective(section),
      studentInput,
      normalizedInput,
      studentWorksheet: request.studentWorksheet,
      studentCode: request.studentCode,
      hintLevel: Math.min(Math.max(request.hintLevel || 1, 1), 4),
      previousHints,
      previousMistakes: analysis.identifiedMistakes,
      completedStages: request.previouslyCompletedStages || analysis.completedStages,
      attemptCount: sectionHistory.length + 1,
      studentMasteredConcepts: analysis.masteredConcepts,
      isClarityRequest: request.isClarityRequest
    };
  }
}

export const contextCollector = new ContextCollector();
