import { StudentHintHistoryItem, CTCStage } from '../types.js';

class StudentHistoryService {
  // Keyed by userId -> list of history items
  private userHistories: Map<string, StudentHintHistoryItem[]> = new Map();

  public recordInteraction(item: Omit<StudentHintHistoryItem, 'interactionId' | 'timestamp'>): StudentHintHistoryItem {
    const interactionId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullItem: StudentHintHistoryItem = {
      ...item,
      interactionId,
      timestamp: Date.now()
    };

    const list = this.userHistories.get(item.userId) || [];
    list.push(fullItem);
    this.userHistories.set(item.userId, list);

    // Also async sync to Firebase RTDB if available
    this.syncToFirebase(fullItem).catch((err) => {
      // Non-blocking log
      console.warn('[Firebase History Sync Notice]', err?.message || err);
    });

    return fullItem;
  }

  public getHistory(userId: string, programId?: string, section?: CTCStage): StudentHintHistoryItem[] {
    const list = this.userHistories.get(userId) || [];
    return list.filter(item => {
      if (programId && item.programId !== programId) return false;
      if (section && item.section !== section) return false;
      return true;
    });
  }

  public getPreviousHints(userId: string, programId: string, section: CTCStage): string[] {
    const list = this.getHistory(userId, programId, section);
    return list.map(item => item.hint);
  }

  public clearHistory(userId: string): void {
    this.userHistories.delete(userId);
  }

  private async syncToFirebase(item: StudentHintHistoryItem): Promise<void> {
    const firebaseUrl = 'https://cookdcode-4ce23-default-rtdb.firebaseio.com';
    const path = `${firebaseUrl}/studentHintHistory/${encodeURIComponent(item.userId)}/${encodeURIComponent(item.interactionId)}.json`;
    try {
      await fetch(path, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(2000)
      });
    } catch {
      // Fallback in-memory storage continues reliably
    }
  }
}

export const studentHistoryService = new StudentHistoryService();
