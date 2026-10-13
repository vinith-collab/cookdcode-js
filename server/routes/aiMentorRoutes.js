import { Router } from "express";
import { aiMentorPipeline } from "../services/aiMentorPipeline.js";
import { inputCheckerService } from "../services/inputCheckerService.js";
import { studentHistoryService } from "../services/studentHistoryService.js";
import { firebaseHintService } from "../services/firebaseHintService.js";
const aiMentorRouter = Router();
aiMentorRouter.post("/hint", async (req, res) => {
  try {
    const {
      userId,
      programId,
      section,
      studentInput,
      studentWorksheet,
      studentCode,
      hintLevel,
      problemTitle,
      problemDescription,
      previousHints,
      forceLlm,
      isClarityRequest
    } = req.body;
    if (!section) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: section (must be logic, recipe, ingredients, or samplecode)"
      });
    }
    const payload = {
      userId: userId || "guest_user",
      programId: programId || "sum-natural-numbers",
      section,
      studentInput: studentInput || "",
      studentWorksheet: studentWorksheet || "",
      studentCode: studentCode || "",
      hintLevel: typeof hintLevel === "number" ? hintLevel : 1,
      problemTitle,
      problemDescription,
      previousHints: Array.isArray(previousHints) ? previousHints : void 0,
      forceLlm: Boolean(forceLlm),
      isClarityRequest: Boolean(isClarityRequest)
    };
    const response = await aiMentorPipeline.execute(payload);
    return res.json(response);
  } catch (err) {
    console.error("[AI Mentor API Error]", err);
    return res.status(500).json({
      success: false,
      error: "Failed to process AI mentor hint",
      message: err?.message || "Internal error"
    });
  }
});
aiMentorRouter.get("/history", (req, res) => {
  const userId = req.query.userId || "guest_user";
  const programId = req.query.programId;
  const history = studentHistoryService.getHistory(userId, programId);
  return res.json({ success: true, history });
});
aiMentorRouter.get("/hints-cache", (req, res) => {
  const programId = req.query.programId;
  const section = req.query.section;
  const hints = firebaseHintService.getAllCachedHints(programId, section);
  return res.json({ success: true, hints, count: hints.length });
});
const handleCheckInput = async (req, res) => {
  const {
    category,
    problemID,
    problemId,
    programId,
    problemTitle,
    problemDescription,
    concept,
    reveal,
    section,
    userInput,
    attemptCount,
    isStuck
  } = req.body;
  const result = await inputCheckerService.check(
    category || "fundamentals",
    problemID || problemId || programId || "sum-natural-numbers",
    section || "logic",
    userInput || "",
    {
      attemptCount,
      isStuck,
      problemTitle,
      problemDescription,
      concept,
      reveal
    }
  );
  return res.json(result);
};
aiMentorRouter.post("/checkInput", handleCheckInput);
aiMentorRouter.post("/check", handleCheckInput);
aiMentorRouter.post("/rewriteHint", async (req, res) => {
  const { userContent, section, hintLevel, problemName, source, retrievedHint } = req.body;
  if (retrievedHint && source === "firebase") {
    return res.json({
      hint: retrievedHint,
      hintLevel: hintLevel || 1,
      source: "firebase",
      section: section || "logic"
    });
  }
  const hintResponse = await aiMentorPipeline.execute({
    userId: "rewrite_client",
    programId: problemName ? problemName.toLowerCase().replace(/\s+/g, "-") : "sum-natural-numbers",
    section: section || "logic",
    studentInput: userContent || "",
    hintLevel: hintLevel || 1
  });
  return res.json({
    hint: hintResponse.hint,
    hintLevel: hintResponse.hintLevel,
    source: hintResponse.source,
    section: hintResponse.section
  });
});
aiMentorRouter.get("/run-tests", async (_req, res) => {
  const testResults = [];
  try {
    const test1 = await aiMentorPipeline.execute({
      userId: "test_user_1",
      programId: "prime-number",
      section: "logic",
      studentInput: "I don't understand prime number",
      hintLevel: 1
    });
    testResults.push({
      name: "Existing Firebase Hint Retrieval",
      stage: "logic",
      status: test1.source === "firebase" ? "PASS" : "FAIL",
      details: { source: test1.source, hint: test1.hint, concept: test1.concept }
    });
    const test2 = await aiMentorPipeline.execute({
      userId: "test_user_2",
      programId: "prime-number",
      section: "recipe",
      studentInput: "I know I need to check divisibility, but what should I do next?",
      hintLevel: 2
    });
    testResults.push({
      name: "Recipe Stage Specificity",
      stage: "recipe",
      status: test2.section === "recipe" ? "PASS" : "FAIL",
      details: { section: test2.section, hint: test2.hint, level: test2.hintLevel }
    });
    const test3 = await aiMentorPipeline.execute({
      userId: "test_user_3",
      programId: "prime-number",
      section: "ingredients",
      studentInput: "Why do I need count?",
      hintLevel: 2
    });
    testResults.push({
      name: "Ingredients Stage Identification",
      stage: "ingredients",
      status: test3.section === "ingredients" ? "PASS" : "FAIL",
      details: { hint: test3.hint, concept: test3.concept }
    });
    const test4 = await aiMentorPipeline.execute({
      userId: "test_user_4",
      programId: "prime-number",
      section: "samplecode",
      studentInput: "My output is wrong for 6",
      studentCode: "n = 6\ncount = 0\nfor i in range(1, n+1):\n  if n % i == 0: count += 1",
      hintLevel: 3
    });
    testResults.push({
      name: "Taste The Sample Tracing",
      stage: "samplecode",
      status: test4.section === "samplecode" ? "PASS" : "FAIL",
      details: { hint: test4.hint, level: test4.hintLevel }
    });
    const uniqueQuery = `What is the geometric meaning of triangle numbers? ${Date.now()}`;
    const test5 = await aiMentorPipeline.execute({
      userId: "test_user_5",
      programId: "sum-natural-numbers",
      section: "logic",
      studentInput: uniqueQuery,
      hintLevel: 1,
      forceLlm: true
    });
    testResults.push({
      name: "Unknown Input LLM Generation",
      stage: "logic",
      status: test5.source === "llm" && test5.hint.length > 10 ? "PASS" : "FAIL",
      details: { source: test5.source, hint: test5.hint }
    });
    const test6a = await aiMentorPipeline.execute({
      userId: "test_user_6",
      programId: "sum-natural-numbers",
      section: "ingredients",
      studentInput: "I am completely stuck on what variables to use",
      hintLevel: 1
    });
    const test6b = await aiMentorPipeline.execute({
      userId: "test_user_6",
      programId: "sum-natural-numbers",
      section: "ingredients",
      studentInput: "I am completely stuck on what variables to use",
      hintLevel: 4
    });
    testResults.push({
      name: "Progressive Hints Escalation",
      stage: "ingredients",
      status: test6b.hintLevel === 4 && test6a.hint !== test6b.hint ? "PASS" : "FAIL",
      details: { level1Hint: test6a.hint, level4Hint: test6b.hint }
    });
    const history = studentHistoryService.getHistory("test_user_6", "sum-natural-numbers");
    testResults.push({
      name: "Student Hint History Stored",
      stage: "ingredients",
      status: history.length >= 2 ? "PASS" : "FAIL",
      details: { recordedInteractions: history.length }
    });
    const test8a = await aiMentorPipeline.execute({
      userId: "test_user_8",
      programId: "next-prime-number",
      section: "recipe",
      studentInput: "while (true) { candidate++; if (isPrime) break; }",
      hintLevel: 1
    });
    const test8b = await aiMentorPipeline.execute({
      userId: "test_user_8",
      programId: "next-prime-number",
      section: "recipe",
      studentInput: "Step 1: Get the input number n\nStep 2: Start candidate number as n + 1\nStep 3: Check if candidate is prime\nStep 4: If candidate is prime, display candidate and stop\nStep 5: If not prime, increase candidate by 1 and repeat Step 3",
      hintLevel: 1
    });
    testResults.push({
      name: "Next Prime Recipe Code Keyword Guard",
      stage: "recipe",
      status: test8a.hint.includes("without programming") || test8a.hint.includes("gentle reminder") || test8a.hint.includes("code syntax") ? "PASS" : "FAIL",
      details: { hint: test8a.hint }
    });
    testResults.push({
      name: "Next Prime Recipe Full Step Verification",
      stage: "recipe",
      status: test8b.hint.includes("Proceed to Stage 3") || test8b.hint.includes("Ingredients") || test8b.hint.includes("Outstanding") || test8b.hint.includes("complete") ? "PASS" : "FAIL",
      details: { hint: test8b.hint }
    });
    const test9a = await aiMentorPipeline.execute({
      userId: "test_user_9",
      programId: "pass-or-fail",
      section: "logic",
      studentInput: "what mark is pass",
      hintLevel: 1
    });
    testResults.push({
      name: "Problem 12 Logic Firebase Hint Retrieval",
      stage: "logic",
      status: test9a.hint.includes("35") && (test9a.hint.includes("Pass") || test9a.hint.includes("pass")) ? "PASS" : "FAIL",
      details: { hint: test9a.hint, source: test9a.source }
    });
    const test9b = await aiMentorPipeline.execute({
      userId: "test_user_9",
      programId: "pass-or-fail",
      section: "samplecode",
      studentInput: "how to write sample code",
      studentCode: 'var mark = 45; if (mark >= 35) print("Pass"); else print("Fail");',
      hintLevel: 1
    });
    testResults.push({
      name: "Problem 12 Sample Code Hint & Syntax Handling",
      stage: "samplecode",
      status: test9b.hint.includes("35") || test9b.hint.includes("Pass") || test9b.hint.includes("mark") || test9b.hint.includes("comparison") ? "PASS" : "FAIL",
      details: { hint: test9b.hint }
    });
    return res.json({
      success: true,
      allPassed: testResults.every((t) => t.status === "PASS"),
      results: testResults
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || err, results: testResults });
  }
});
export {
  aiMentorRouter
};
