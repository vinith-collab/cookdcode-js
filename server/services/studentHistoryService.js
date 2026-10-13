class StudentHistoryService {
  // Keyed by userId -> list of history items
  userHistories = /* @__PURE__ */ new Map();
  recordInteraction(item) {
    const interactionId = `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fullItem = {
      ...item,
      interactionId,
      timestamp: Date.now()
    };
    const list = this.userHistories.get(item.userId) || [];
    list.push(fullItem);
    this.userHistories.set(item.userId, list);
    this.syncToFirebase(fullItem).catch((err) => {
      console.warn("[Firebase History Sync Notice]", err?.message || err);
    });
    return fullItem;
  }
  getHistory(userId, programId, section) {
    const list = this.userHistories.get(userId) || [];
    return list.filter((item) => {
      if (programId && item.programId !== programId) return false;
      if (section && item.section !== section) return false;
      return true;
    });
  }
  getPreviousHints(userId, programId, section) {
    const list = this.getHistory(userId, programId, section);
    return list.map((item) => item.hint);
  }
  clearHistory(userId) {
    this.userHistories.delete(userId);
  }
  async syncToFirebase(item) {
    const firebaseUrl = "https://cookdcode-4ce23-default-rtdb.firebaseio.com";
    const path = `${firebaseUrl}/studentHintHistory/${encodeURIComponent(item.userId)}/${encodeURIComponent(item.interactionId)}.json`;
    try {
      await fetch(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        signal: AbortSignal.timeout(2e3)
      });
    } catch {
    }
  }
}
const studentHistoryService = new StudentHistoryService();
export {
  studentHistoryService
};
