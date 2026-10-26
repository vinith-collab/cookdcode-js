import { GoogleGenAI } from "@google/genai";

/**
 * Recipe Summarizer Service
 * Strictly distills the student's own rough notes, draft lines, and thoughts into
 * a sequential 5-step Recipe (Step 1 to Step 5) using ONLY the user's written content.
 * 
 * Filters out:
 * - Conversational chatter (e.g., "what is recipe", "how to i write")
 * - Help requests / questions (e.g., "i did not understatnd kindly explain again clearly")
 * - Meta-comments (e.g., "now i dont need a example i want a proper logical hint")
 * 
 * Preserves:
 * - Student's exact variable names (e.g., 'a', 'answer', 'finalsum')
 * - Student's own logic and phrasing
 * - Explicit statements written by the student
 */

const CHATTER_PATTERNS = [
  /^\s*(?:what is|what are|what's|how to|how do i|how do we|why do i|why do we|where to|can you|could you|please explain|kindly explain|explain again|help me)\b/i,
  /^\s*(?:i did not understand|i don't understand|i dont understand|puriyala|theriyala|not clear|confused)\b/i,
  /^\s*(?:now i dont need|i don't need|i want a hint|give me hint|give hint|hint please|proper logical hint)\b/i,
  /\b(?:how\s+using\s+to\s+add|tell me how|explain again clearly|kindly explain again)\b/i,
  /^\s*(?:can i write|how should i write|what should i write|how to write|is this right|is this correct)\b/i
];

function isChatter(line) {
  if (!line || typeof line !== "string") return true;
  const trimmed = line.trim();
  if (trimmed.length < 3) return true;
  return CHATTER_PATTERNS.some(rgx => rgx.test(trimmed));
}

const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite"
];

async function callGeminiJsonWithCandidateRotation(genAI, prompt, timeoutMs = 4500) {
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await Promise.race([
        genAI.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), timeoutMs))
      ]);

      const resText = response?.text || (typeof response?.candidates?.[0]?.content?.parts?.[0]?.text === "string" ? response.candidates[0].content.parts[0].text : "");
      if (resText) {
        const parsed = JSON.parse(resText);
        if (parsed) {
          console.info(`[RecipeSummarizerService] ✅ Clean/Format succeeded using model: ${model}`);
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`[RecipeSummarizerService] Candidate model ${model} failed (${err.message}). Trying next candidate...`);
    }
  }
  return null;
}

function cleanStepText(text) {
  if (!text) return "";
  return text
    .replace(/^step\s*[1-5]\s*[:.=\-]*\s*/i, "")
    .replace(/^for\s+ex\s*[:;]\s*/i, "")
    .replace(/^ex\s*[:;]\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Deterministic rule-based extractor
 * Guarantees extraction strictly from user's content with 0% reliance on external network/API.
 */
export function extractRecipeStepsFromUserContent(userInput, problemMeta = {}) {
  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return {
      success: false,
      message: "No content provided to summarize.",
      steps: [],
      cleanRecipeText: ""
    };
  }

  const rawLines = userInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const meaningfulLines = rawLines.filter(l => !isChatter(l));

  if (meaningfulLines.length === 0) {
    return {
      success: false,
      message: "Only general questions or chatter were detected. Please write your algorithm steps.",
      steps: [],
      cleanRecipeText: ""
    };
  }

  const stepMap = { 1: null, 2: null, 3: null, 4: null, 5: null };
  const rawOriginMap = { 1: null, 2: null, 3: null, 4: null, 5: null };

  // 1. Direct "Step X" detection
  for (const line of meaningfulLines) {
    const sm = line.match(/^step\s*([1-5])\b[:.=\-\s]*(.*)$/i);
    if (sm) {
      const stepNum = parseInt(sm[1], 10);
      const text = sm[2].trim();
      if (text && !stepMap[stepNum]) {
        stepMap[stepNum] = cleanStepText(text);
        rawOriginMap[stepNum] = line;
      }
    }
  }

  // 2. Identify repeat / loop instruction
  // Prefer clean general algorithmic instructions like "Move to the next number and repeat until reaching n"
  const repeatLine = meaningfulLines.find(l => {
    if (/^step\s*[1245]\b/i.test(l)) return false;
    return /\b(?:repeat|until|next number|move to next)\b/i.test(l) && !/\b(?:value is|\b1\s*&\s*2\b)\b/i.test(l);
  });

  if (repeatLine) {
    // If step 3 is empty, or step 3 was an addition step (e.g. answer = 1st number + answer)
    if (!stepMap[3] || /\b(?:answer\s*=|\badd\b)/i.test(stepMap[3])) {
      if (!stepMap[4] && stepMap[3] && /\b(?:answer\s*=|\badd\b)/i.test(stepMap[3])) {
        stepMap[4] = stepMap[3];
        rawOriginMap[4] = rawOriginMap[3];
      }
      stepMap[3] = cleanStepText(repeatLine);
      rawOriginMap[3] = repeatLine;
    }
  }

  // 3. Fallbacks for Step 1 (Input)
  if (!stepMap[1]) {
    const inputLine = meaningfulLines.find(l => 
      !/^step\s*[2345]\b/i.test(l) &&
      (/\b(?:input|read|get|declar.*var.*input|take.*input)\b/i.test(l) ||
       /\b(?:var\s+[a-z0-9_]+\s*=|a\s*=\s*input|n\s*=\s*input)\b/i.test(l))
    );
    if (inputLine) {
      stepMap[1] = cleanStepText(inputLine);
      rawOriginMap[1] = inputLine;
    }
  }

  // 4. Fallbacks for Step 2 (Initialization / Range / Condition Setup)
  if (!stepMap[2]) {
    const initLine = meaningfulLines.find(l => 
      !/^step\s*[1345]\b/i.test(l) && l !== rawOriginMap[1] &&
      (/\b(?:sum\s*=\s*0|start.*(?:0|1)|add.*number.*1 to|initializ|for ex.*input.*add)\b/i.test(l) ||
       /\b(?:count\s*=\s*0|fact\s*=\s*1|product\s*=\s*1)\b/i.test(l) ||
       /\b(?:divide.*by\s*2|rem\s*=|candidate\s*=)\b/i.test(l))
    );
    if (initLine) {
      stepMap[2] = cleanStepText(initLine);
      rawOriginMap[2] = initLine;
    }
  }

  // 5. Fallbacks for Step 3 (Loop / Condition 1)
  if (!stepMap[3]) {
    const loopLine = meaningfulLines.find(l => 
      !/^step\s*[1245]\b/i.test(l) && l !== rawOriginMap[1] && l !== rawOriginMap[2] &&
      (/\b(?:repeat|loop|while|next number|iterate|if\s+.*(?:==|is|even|odd|zero|0))\b/i.test(l))
    );
    if (loopLine) {
      stepMap[3] = cleanStepText(loopLine);
      rawOriginMap[3] = loopLine;
    }
  }

  // 6. Fallbacks for Step 4 (Addition / Accumulation / Condition 2)
  if (!stepMap[4]) {
    const opLine = meaningfulLines.find(l => 
      !/^step\s*[1235]\b/i.test(l) && l !== rawOriginMap[1] && l !== rawOriginMap[2] && l !== rawOriginMap[3] &&
      (/\b(?:add|accumulate|sum\s*\+|answer\s*=|total sum|plus|multiply|count\s*\+\+|else|otherwise)\b/i.test(l))
    );
    if (opLine) {
      stepMap[4] = cleanStepText(opLine);
      rawOriginMap[4] = opLine;
    }
  }

  // 7. Fallbacks for Step 5 (Final Output / Display / Store)
  if (!stepMap[5]) {
    const outLine = meaningfulLines.find(l => 
      !/^step\s*[1234]\b/i.test(l) && l !== rawOriginMap[1] && l !== rawOriginMap[2] && l !== rawOriginMap[3] && l !== rawOriginMap[4] &&
      (/\b(?:print|display|store.*final|output|show|return|finalsum|final sum|result)\b/i.test(l))
    );
    if (outLine) {
      stepMap[5] = cleanStepText(outLine);
      rawOriginMap[5] = outLine;
    }
  }

  // Titles suited to algorithmic flow
  const stepTitles = {
    1: "Input Initialization",
    2: "Starting Value / Range",
    3: "Loop / Repetition Condition",
    4: "Calculation / Accumulation",
    5: "Final Result / Output"
  };

  const steps = [1, 2, 3, 4, 5].map(stepNum => ({
    stepNumber: stepNum,
    title: stepTitles[stepNum],
    text: stepMap[stepNum] || `(Not found in your notes — write what should happen for Step ${stepNum})`,
    rawOrigin: rawOriginMap[stepNum] || null,
    isFound: Boolean(stepMap[stepNum])
  }));

  const cleanLines = steps
    .filter(s => s.isFound)
    .map(s => `Step ${s.stepNumber}: ${s.text}`);

  return {
    success: true,
    source: "user_content_rule_engine",
    totalFound: steps.filter(s => s.isFound).length,
    steps,
    cleanRecipeText: cleanLines.join("\n")
  };
}

/**
 * AI-powered summarizer using Gemini when available,
 * with automatic fallback to deterministic extraction.
 */
export async function summarizeRecipe(userInput, problemMeta = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return deterministic extraction strictly from user content
    return extractRecipeStepsFromUserContent(userInput, problemMeta);
  }

  try {
    const genAI = new GoogleGenAI({ apiKey });
    const prompt = `You are an expert algorithm mentor at CookDcode.
A student wrote rough notes/draft in their Recipe worksheet for a coding problem.

STUDENT NOTES:
"""
${userInput}
"""

PROBLEM INFO:
Title: ${problemMeta.title || "Algorithm Challenge"}
Description: ${problemMeta.description || ""}

CRITICAL INSTRUCTIONS:
1. You MUST construct the 5-step recipe (Step 1 to Step 5) EXCLUSIVELY and STRICTLY using the student's OWN written statements, thoughts, variables, and explanations.
2. DO NOT inject textbook or generic definitions. Keep the student's own variable names (e.g. "a", "answer", "finalsum", "total sum") and phrasing.
3. Discard conversational chatter and meta-questions (e.g. "what is recipe", "how to i write", "i did not understand", "explain again", "i want a proper logical hint").
4. If the student has NOT written anything for a particular step, set its text to: "(Not found in your notes — please write this step)". DO NOT fabricate missing steps.
5. Return JSON ONLY with this exact format:
{
  "success": true,
  "steps": [
    { "stepNumber": 1, "title": "...", "text": "...", "rawOrigin": "..." },
    { "stepNumber": 2, "title": "...", "text": "...", "rawOrigin": "..." },
    { "stepNumber": 3, "title": "...", "text": "...", "rawOrigin": "..." },
    { "stepNumber": 4, "title": "...", "text": "...", "rawOrigin": "..." },
    { "stepNumber": 5, "title": "...", "text": "...", "rawOrigin": "..." }
  ],
  "cleanRecipeText": "Step 1: ...\\nStep 2: ...\\nStep 3: ...\\nStep 4: ...\\nStep 5: ..."
}`;

    const parsed = await callGeminiJsonWithCandidateRotation(genAI, prompt, 4500);
    if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      parsed.source = "user_content_ai_synthesized";
      parsed.totalFound = parsed.steps.filter(s => s.text && !s.text.includes("Not found")).length;
      return parsed;
    }
  } catch (err) {
    console.warn("[RecipeSummarizer] LLM summarization fallback to rule engine:", err.message);
  }

  // Reliable fallback strictly using user content
  return extractRecipeStepsFromUserContent(userInput, problemMeta);
}

export const recipeSummarizerService = {
  extractRecipeStepsFromUserContent,
  summarizeRecipe,
  cleanLogicNotes,
  cleanIngredientsNotes,
  cleanSampleCodeNotes,
  cleanAndFormatSection
};

/**
 * Clean & Format Logic Notes
 */
export async function cleanLogicNotes(userInput, problemMeta = {}) {
  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return {
      success: false,
      message: "No logic content provided to format.",
      cleanText: ""
    };
  }

  const rawLines = userInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const meaningfulLines = rawLines.filter(l => !isChatter(l));
  if (meaningfulLines.length === 0) {
    return {
      success: false,
      message: "Only questions or chatter detected. Please write your logic steps.",
      cleanText: ""
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert algorithm mentor at CookDcode.
A student wrote rough thoughts and logic notes in their Logic worksheet for the problem: "${problemMeta.title || "Coding Challenge"}".

STUDENT LOGIC NOTES:
"""
${userInput}
"""

PROBLEM CONTEXT:
${problemMeta.description || ""}

CRITICAL INSTRUCTIONS:
1. Clean and organize the student's thoughts into clear, sequential, numbered points (1., 2., 3., etc.).
2. STRICTLY preserve the student's OWN variables, names, logic, and phrasing.
3. Completely filter out all chatter, meta-questions, and greetings (e.g. "what is logic", "how to write", "please help", "explain again").
4. DO NOT invent or reveal the solution if the student didn't write it. Format and structure what the student wrote.
5. Return JSON ONLY with this exact format:
{
  "success": true,
  "cleanText": "1. ...\\n2. ...\\n3. ..."
}`;

      const parsed = await callGeminiJsonWithCandidateRotation(genAI, prompt, 4500);
      if (parsed && parsed.cleanText) {
        parsed.source = "user_content_ai_logic";
        return parsed;
      }
    } catch (err) {
      console.warn("[cleanLogicNotes] Fallback to deterministic logic engine:", err.message);
    }
  }

  // Deterministic fallback
  const cleaned = meaningfulLines.map((line, idx) => {
    let clean = line
      .replace(/^(?:step\s*\d+|point\s*\d+|\d+[\.\)]|[-*•])\s*[:.\-]*\s*/i, "")
      .trim();
    if (clean) {
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
      return `${idx + 1}. ${clean}`;
    }
    return null;
  }).filter(Boolean);

  return {
    success: true,
    source: "user_content_rule_logic",
    cleanText: cleaned.join("\n")
  };
}

/**
 * Clean & Format Ingredients Notes
 */
export async function cleanIngredientsNotes(userInput, problemMeta = {}) {
  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return {
      success: false,
      message: "No ingredients content provided to format.",
      cleanText: ""
    };
  }

  const rawLines = userInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const meaningfulLines = rawLines.filter(l => !isChatter(l));
  if (meaningfulLines.length === 0) {
    return {
      success: false,
      message: "Only questions or chatter detected. Please write your programming ingredients.",
      cleanText: ""
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert algorithm mentor at CookDcode.
A student wrote rough notes in their Programming Ingredients worksheet for: "${problemMeta.title || "Coding Challenge"}".

STUDENT INGREDIENTS NOTES:
"""
${userInput}
"""

PROBLEM CONTEXT:
${problemMeta.description || ""}

CRITICAL INSTRUCTIONS:
1. Clean and organize the student's notes into a clean, sequential, numbered list of programming ingredients (1. Input variable: ..., 2. Condition / Operator: ..., 3. True branch: ..., 4. False branch: ..., etc.).
2. STRICTLY preserve the student's OWN variable names (e.g. n, a, sum), syntax, and phrasing.
3. Completely filter out all chatter, meta-questions, and greetings.
4. Return JSON ONLY with this exact format:
{
  "success": true,
  "cleanText": "1. ...\\n2. ...\\n3. ..."
}`;

      const parsed = await callGeminiJsonWithCandidateRotation(genAI, prompt, 4500);
      if (parsed && parsed.cleanText) {
        parsed.source = "user_content_ai_ingredients";
        return parsed;
      }
    } catch (err) {
      console.warn("[cleanIngredientsNotes] Fallback to deterministic ingredients engine:", err.message);
    }
  }

  // Deterministic fallback
  const cleaned = meaningfulLines.map((line, idx) => {
    let clean = line
      .replace(/^(?:ingredient\s*\d+|\d+[\.\)]|[-*•])\s*[:.\-]*\s*/i, "")
      .trim();
    if (clean) {
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
      return `${idx + 1}. ${clean}`;
    }
    return null;
  }).filter(Boolean);

  return {
    success: true,
    source: "user_content_rule_ingredients",
    cleanText: cleaned.join("\n")
  };
}

/**
 * Clean & Format Sample Code / Tracing Notes
 */
export async function cleanSampleCodeNotes(userInput, problemMeta = {}) {
  if (!userInput || typeof userInput !== "string" || !userInput.trim()) {
    return {
      success: false,
      message: "No code or trace provided to format.",
      cleanText: ""
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert programming mentor and code formatter at CookDcode.
A student wrote code or sample tracing in their Taste the Sample worksheet for: "${problemMeta.title || "Coding Challenge"}".

STUDENT CODE / NOTES:
"""
${userInput}
"""

PROBLEM CONTEXT:
${problemMeta.description || ""}

CRITICAL INSTRUCTIONS:
1. Format and beautify the student's code or sample trace with clean, standard indentation (4 spaces per block level).
2. Completely remove any conversational chatter, questions, or irrelevant comments (e.g. "what to write", "is this right", "can you help"). Keep meaningful code comments.
3. PRESERVE the student's exact algorithm, variable names, and code logic. Do NOT rewrite or solve the problem differently.
4. Return JSON ONLY with this exact format:
{
  "success": true,
  "cleanText": "..."
}`;

      const parsed = await callGeminiJsonWithCandidateRotation(genAI, prompt, 4500);
      if (parsed && parsed.cleanText) {
        parsed.source = "user_content_ai_code";
        return parsed;
      }
    } catch (err) {
      console.warn("[cleanSampleCodeNotes] Fallback to deterministic code engine:", err.message);
    }
  }

  // Deterministic fallback: filter chatter and clean indentation
  const rawLines = userInput.split(/\r?\n/);
  const cleaned = [];
  let indentLevel = 0;
  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      cleaned.push("");
      continue;
    }
    // Check if chatter comment
    if (/^(?:#|\/\/)\s*/.test(trimmed)) {
      const commentContent = trimmed.replace(/^(?:#|\/\/)\s*/, "");
      if (isChatter(commentContent)) continue;
    } else if (isChatter(trimmed)) {
      continue;
    }

    if (/^(?:else|elif|catch|finally|})/i.test(trimmed) && indentLevel > 0) {
      indentLevel--;
    }
    const indent = "    ".repeat(indentLevel);
    cleaned.push(indent + trimmed.replace(/^(?:\t|\s{4})+/, ""));
    if (/(?:[:{]|=>)\s*$/i.test(trimmed)) {
      indentLevel++;
    }
  }

  return {
    success: true,
    source: "user_content_rule_code",
    cleanText: cleaned.join("\n").trim()
  };
}

/**
 * Universal dispatcher for all 4 sections
 */
export async function cleanAndFormatSection(section, userInput, problemMeta = {}) {
  const norm = (section || "").toLowerCase().trim();
  if (norm === "logic") {
    return cleanLogicNotes(userInput, problemMeta);
  }
  if (norm === "recipe") {
    const res = await summarizeRecipe(userInput, problemMeta);
    if (res && res.cleanRecipeText) {
      res.cleanText = res.cleanRecipeText;
    }
    return res;
  }
  if (norm === "ingredients") {
    return cleanIngredientsNotes(userInput, problemMeta);
  }
  if (norm === "sample" || norm === "samplecode" || norm === "tastethesample") {
    return cleanSampleCodeNotes(userInput, problemMeta);
  }
  // Default to recipe
  return summarizeRecipe(userInput, problemMeta);
}
