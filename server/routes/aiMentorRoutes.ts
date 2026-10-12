import { Router, Request, Response } from 'express';
import { aiMentorPipeline } from '../services/aiMentorPipeline.js';
import { inputCheckerService } from '../services/inputCheckerService.js';
import { studentHistoryService } from '../services/studentHistoryService.js';
import { firebaseHintService } from '../services/firebaseHintService.js';
import { CTCStage, MentorHintRequest } from '../types.js';

export const aiMentorRouter = Router();

// Primary AI Mentor Endpoint specified in Section 12
aiMentorRouter.post('/hint', async (req: Request, res: Response) => {
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
        error: 'Missing required field: section (must be logic, recipe, ingredients, or samplecode)'
      });
    }

    const payload: MentorHintRequest = {
      userId: userId || 'guest_user',
      programId: programId || 'sum-natural-numbers',
      section: section as CTCStage,
      studentInput: studentInput || '',
      studentWorksheet: studentWorksheet || '',
      studentCode: studentCode || '',
      hintLevel: typeof hintLevel === 'number' ? hintLevel : 1,
      problemTitle,
      problemDescription,
      previousHints: Array.isArray(previousHints) ? previousHints : undefined,
      forceLlm: Boolean(forceLlm),
      isClarityRequest: Boolean(isClarityRequest)
    };

    const response = await aiMentorPipeline.execute(payload);
    return res.json(response);
  } catch (err: any) {
    console.error('[AI Mentor API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI mentor hint',
      message: err?.message || 'Internal error'
    });
  }
});

// Student Hint History Query
aiMentorRouter.get('/history', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'guest_user';
  const programId = req.query.programId as string | undefined;
  const history = studentHistoryService.getHistory(userId, programId);
  return res.json({ success: true, history });
});

// Firebase Cached Hints Inspection
aiMentorRouter.get('/hints-cache', (req: Request, res: Response) => {
  const programId = req.query.programId as string | undefined;
  const section = req.query.section as CTCStage | undefined;
  const hints = firebaseHintService.getAllCachedHints(programId, section);
  return res.json({ success: true, hints, count: hints.length });
});

// Backward-compatible CookDcode endpoints
const handleCheckInput = async (req: Request, res: Response) => {
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
    category || 'fundamentals',
    problemID || problemId || programId || 'sum-natural-numbers',
    (section as CTCStage) || 'logic',
    userInput || '',
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

aiMentorRouter.post('/checkInput', handleCheckInput);
aiMentorRouter.post('/check', handleCheckInput);

aiMentorRouter.post('/rewriteHint', async (req: Request, res: Response) => {
  const { userContent, section, hintLevel, problemName, source, retrievedHint } = req.body;

  // If there's already a retrievedHint from Firebase, return it
  if (retrievedHint && source === 'firebase') {
    return res.json({
      hint: retrievedHint,
      hintLevel: hintLevel || 1,
      source: 'firebase',
      section: section || 'logic'
    });
  }

  // Otherwise route through AI Mentor Pipeline
  const hintResponse = await aiMentorPipeline.execute({
    userId: 'rewrite_client',
    programId: problemName ? problemName.toLowerCase().replace(/\s+/g, '-') : 'sum-natural-numbers',
    section: (section as CTCStage) || 'logic',
    studentInput: userContent || '',
    hintLevel: hintLevel || 1
  });

  return res.json({
    hint: hintResponse.hint,
    hintLevel: hintResponse.hintLevel,
    source: hintResponse.source,
    section: hintResponse.section
  });
});

// Automated Test Suite Runner (covers Section 25 test cases)
aiMentorRouter.get('/run-tests', async (_req: Request, res: Response) => {
  const testResults: Array<{ name: string; stage: CTCStage; status: 'PASS' | 'FAIL'; details: any }> = [];

  try {
    // 1. Existing Firebase hint test (Prime Number - Logic)
    const test1 = await aiMentorPipeline.execute({
      userId: 'test_user_1',
      programId: 'prime-number',
      section: 'logic',
      studentInput: "I don't understand prime number",
      hintLevel: 1
    });
    testResults.push({
      name: 'Existing Firebase Hint Retrieval',
      stage: 'logic',
      status: test1.source === 'firebase' ? 'PASS' : 'FAIL',
      details: { source: test1.source, hint: test1.hint, concept: test1.concept }
    });

    // 2. Stage 2 Recipe Test (Prime Number - Recipe)
    const test2 = await aiMentorPipeline.execute({
      userId: 'test_user_2',
      programId: 'prime-number',
      section: 'recipe',
      studentInput: 'I know I need to check divisibility, but what should I do next?',
      hintLevel: 2
    });
    testResults.push({
      name: 'Recipe Stage Specificity',
      stage: 'recipe',
      status: test2.section === 'recipe' ? 'PASS' : 'FAIL',
      details: { section: test2.section, hint: test2.hint, level: test2.hintLevel }
    });

    // 3. Stage 3 Ingredients Test (Why do I need count?)
    const test3 = await aiMentorPipeline.execute({
      userId: 'test_user_3',
      programId: 'prime-number',
      section: 'ingredients',
      studentInput: 'Why do I need count?',
      hintLevel: 2
    });
    testResults.push({
      name: 'Ingredients Stage Identification',
      stage: 'ingredients',
      status: test3.section === 'ingredients' ? 'PASS' : 'FAIL',
      details: { hint: test3.hint, concept: test3.concept }
    });

    // 4. Stage 4 Taste The Sample Test
    const test4 = await aiMentorPipeline.execute({
      userId: 'test_user_4',
      programId: 'prime-number',
      section: 'samplecode',
      studentInput: 'My output is wrong for 6',
      studentCode: 'n = 6\ncount = 0\nfor i in range(1, n+1):\n  if n % i == 0: count += 1',
      hintLevel: 3
    });
    testResults.push({
      name: 'Taste The Sample Tracing',
      stage: 'samplecode',
      status: test4.section === 'samplecode' ? 'PASS' : 'FAIL',
      details: { hint: test4.hint, level: test4.hintLevel }
    });

    // 5. Unknown input triggering LLM generation
    const uniqueQuery = `What is the geometric meaning of triangle numbers? ${Date.now()}`;
    const test5 = await aiMentorPipeline.execute({
      userId: 'test_user_5',
      programId: 'sum-natural-numbers',
      section: 'logic',
      studentInput: uniqueQuery,
      hintLevel: 1,
      forceLlm: true
    });
    testResults.push({
      name: 'Unknown Input LLM Generation',
      stage: 'logic',
      status: test5.source === 'llm' && test5.hint.length > 10 ? 'PASS' : 'FAIL',
      details: { source: test5.source, hint: test5.hint }
    });

    // 6. Progressive Hints Escalation (Level 1 -> Level 4)
    const test6a = await aiMentorPipeline.execute({
      userId: 'test_user_6',
      programId: 'sum-natural-numbers',
      section: 'ingredients',
      studentInput: 'I am completely stuck on what variables to use',
      hintLevel: 1
    });
    const test6b = await aiMentorPipeline.execute({
      userId: 'test_user_6',
      programId: 'sum-natural-numbers',
      section: 'ingredients',
      studentInput: 'I am completely stuck on what variables to use',
      hintLevel: 4
    });
    testResults.push({
      name: 'Progressive Hints Escalation',
      stage: 'ingredients',
      status: test6b.hintLevel === 4 && test6a.hint !== test6b.hint ? 'PASS' : 'FAIL',
      details: { level1Hint: test6a.hint, level4Hint: test6b.hint }
    });

    // 7. Student Hint History Persistence
    const history = studentHistoryService.getHistory('test_user_6', 'sum-natural-numbers');
    testResults.push({
      name: 'Student Hint History Stored',
      stage: 'ingredients',
      status: history.length >= 2 ? 'PASS' : 'FAIL',
      details: { recordedInteractions: history.length }
    });

    // 8. Next Prime Recipe Validation (Step-by-step enforcement & No Code Keywords)
    const test8a = await aiMentorPipeline.execute({
      userId: 'test_user_8',
      programId: 'next-prime-number',
      section: 'recipe',
      studentInput: 'while (true) { candidate++; if (isPrime) break; }',
      hintLevel: 1
    });
    const test8b = await aiMentorPipeline.execute({
      userId: 'test_user_8',
      programId: 'next-prime-number',
      section: 'recipe',
      studentInput: 'Step 1: Get the input number n\nStep 2: Start candidate number as n + 1\nStep 3: Check if candidate is prime\nStep 4: If candidate is prime, display candidate and stop\nStep 5: If not prime, increase candidate by 1 and repeat Step 3',
      hintLevel: 1
    });
    testResults.push({
      name: 'Next Prime Recipe Code Keyword Guard',
      stage: 'recipe',
      status: (test8a.hint.includes('without programming') || test8a.hint.includes('gentle reminder') || test8a.hint.includes('code syntax')) ? 'PASS' : 'FAIL',
      details: { hint: test8a.hint }
    });
    testResults.push({
      name: 'Next Prime Recipe Full Step Verification',
      stage: 'recipe',
      status: (test8b.hint.includes('Proceed to Stage 3') || test8b.hint.includes('Ingredients') || test8b.hint.includes('Outstanding') || test8b.hint.includes('complete')) ? 'PASS' : 'FAIL',
      details: { hint: test8b.hint }
    });

    // 9. Problem 12 (Pass or Fail Based on Mark) Hint & Safeguard Validation
    const test9a = await aiMentorPipeline.execute({
      userId: 'test_user_9',
      programId: 'pass-or-fail',
      section: 'logic',
      studentInput: 'what mark is pass',
      hintLevel: 1
    });
    testResults.push({
      name: 'Problem 12 Logic Firebase Hint Retrieval',
      stage: 'logic',
      status: (test9a.hint.includes('35') && (test9a.hint.includes('Pass') || test9a.hint.includes('pass'))) ? 'PASS' : 'FAIL',
      details: { hint: test9a.hint, source: test9a.source }
    });

    const test9b = await aiMentorPipeline.execute({
      userId: 'test_user_9',
      programId: 'pass-or-fail',
      section: 'samplecode',
      studentInput: 'how to write sample code',
      studentCode: 'var mark = 45; if (mark >= 35) print("Pass"); else print("Fail");',
      hintLevel: 1
    });
    testResults.push({
      name: 'Problem 12 Sample Code Hint & Syntax Handling',
      stage: 'samplecode',
      status: (test9b.hint.includes('35') || test9b.hint.includes('Pass') || test9b.hint.includes('mark') || test9b.hint.includes('comparison')) ? 'PASS' : 'FAIL',
      details: { hint: test9b.hint }
    });

    return res.json({
      success: true,
      allPassed: testResults.every(t => t.status === 'PASS'),
      results: testResults
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err, results: testResults });
  }
});
