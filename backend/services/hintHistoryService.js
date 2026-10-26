import { studentHistoryService } from "./studentHistoryService.js";
class HintHistoryService {
  logHintDelivered(userId, programId, section, studentInput, studentCode, hintText, hintLevel, concept, source, completionStatus = "attempting") {
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
  getStudentInteractionHistory(userId, programId) {
    return studentHistoryService.getHistory(userId, programId);
  }
}
const hintHistoryService = new HintHistoryService();
export {
  HintHistoryService,
  hintHistoryService
};
