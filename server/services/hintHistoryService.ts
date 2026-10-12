import { StudentHintHistoryItem, CTCStage } from '../types.js';
import { studentHistoryService } from './studentHistoryService.js';

export class HintHistoryService {
  public logHintDelivered(
    userId: string,
    programId: string,
    section: CTCStage,
    studentInput: string,
    studentCode: string | undefined,
    hintText: string,
    hintLevel: number,
    concept: string,
    source: 'firebase' | 'llm',
    completionStatus: 'stuck' | 'attempting' | 'completed' | 'progressing' = 'attempting'
  ): StudentHintHistoryItem {
    return studentHistoryService.recordInteraction({
      userId,
      programId,
      section,
      studentInput,
      studentCode,
      hint: hintText,
      hintLevel,
      attempt: studentHistoryService.getHistory(userId, programId, section).length + 1,
      completionStatus,
      concept,
      source
    });
  }

  public getStudentInteractionHistory(userId: string, programId?: string): StudentHintHistoryItem[] {
    return studentHistoryService.getHistory(userId, programId);
  }
}

export const hintHistoryService = new HintHistoryService();
