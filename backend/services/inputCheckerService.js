import { SEED_PROBLEMS } from "../data/seedData.js";
import { GoogleGenAI, Type } from "@google/genai";
import { firebaseHintService } from "./firebaseHintService.js";
import { validateOddEvenClassification, validateOddEvenRecipe, validateOddEvenLogic, validateOddEvenSampleCode } from "./oddEvenValidator.js";
import { detectProblemType } from "./problemTypes.js";
import { checkSumArithmetic, validateSumOfNLogic, validateSumOfNRecipe, validateSumOfNIngredients, validateSumOfNSampleCode } from "./sumOfNValidator.js";
import { validateFactorialLogic, validateFactorialRecipe, validateFactorialIngredients, validateFactorialSampleCode } from "./factorialValidator.js";
import { validateDivisorLogic, validateDivisorRecipe, validateDivisorIngredients, validateDivisorSampleCode, extractDivisorInputAnalysis, formatDivisorBreakdown } from "./divisorValidator.js";
import { validateMultiplicationLogic, validateMultiplicationRecipe, validateMultiplicationIngredients, validateMultiplicationSampleCode } from "./multiplicationTableValidator.js";
import { validatePrimeLogic, validatePrimeRecipe, validatePrimeIngredients, validatePrimeSampleCode } from "./primeNumberValidator.js";
import { validateNextPrimeLogic, validateNextPrimeRecipe, validateNextPrimeIngredients, validateNextPrimeSampleCode } from "./nextPrimeValidator.js";
import { validatePrimeRangeLogic, validatePrimeRangeRecipe, validatePrimeRangeIngredients, validatePrimeRangeSampleCode, detectLoopVariables } from "./primeRangeValidator.js";
import { validateSexyPrimeLogic, validateSexyPrimeRecipe, validateSexyPrimeIngredients, validateSexyPrimeSampleCode } from "./sexyPrimeValidator.js";
import { validatePositiveNegativeLogic, validatePositiveNegativeRecipe, validatePositiveNegativeIngredients, validatePositiveNegativeSampleCode } from "./positiveNegativeValidator.js";
import { validateThreeDigitLogic, validateThreeDigitRecipe, validateThreeDigitIngredients, validateThreeDigitSampleCode } from "./threeDigitValidator.js";
import { validateVotingEligibilityLogic, validateVotingEligibilityRecipe, validateVotingEligibilityIngredients, validateVotingEligibilitySampleCode } from "./votingEligibilityValidator.js";
import { validatePassFailLogic, validatePassFailRecipe, validatePassFailIngredients, validatePassFailSampleCode } from "./passFailValidator.js";
import { validateGreaterThan100Logic, validateGreaterThan100Recipe, validateGreaterThan100Ingredients, validateGreaterThan100SampleCode } from "./greaterThan100Validator.js";
import { validateProfitLossLogic, validateProfitLossRecipe, validateProfitLossIngredients, validateProfitLossSampleCode } from "./profitLossValidator.js";
import { validateLeapYearLogic, validateLeapYearRecipe, validateLeapYearIngredients, validateLeapYearSampleCode } from "./leapYearValidator.js";
import { validateAdultMinorLogic, validateAdultMinorRecipe, validateAdultMinorIngredients, validateAdultMinorSampleCode } from "./adultMinorValidator.js";
import { validateDivisibleBy5Logic, validateDivisibleBy5Recipe, validateDivisibleBy5Ingredients, validateDivisibleBy5SampleCode } from "./divisibleBy5Validator.js";
import { validateMaximumOfTwoLogic, validateMaximumOfTwoRecipe, validateMaximumOfTwoIngredients, validateMaximumOfTwoSampleCode } from "./maximumOfTwoValidator.js";
import { validateVowelConsonantLogic, validateVowelConsonantRecipe, validateVowelConsonantIngredients, validateVowelConsonantSampleCode } from "./vowelConsonantValidator.js";
import { validateSeniorCitizenLogic, validateSeniorCitizenRecipe, validateSeniorCitizenIngredients, validateSeniorCitizenSampleCode } from "./seniorCitizenValidator.js";
import { validateEvenNumbers1To50Logic, validateEvenNumbers1To50Recipe, validateEvenNumbers1To50Ingredients, validateEvenNumbers1To50SampleCode } from "./evenNumbers1To50Validator.js";
import { getConditionalSpec, generateUniversalIfDirectives } from "./conditionalEngine.js";
import { detectCrossProblemMismatch } from "./crossProblemDetector.js";
let genAIClient = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" }
      }
    });
  }
  return genAIClient;
}
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite"
];
const modelCooldownMap = /* @__PURE__ */ new Map();
let globalQuotaCooldownUntil = 0;

function isStarterRequest(text) {
  if (!text || text.trim().length < 2) return true;
  const norm = text.toLowerCase().trim();
  return (
    norm === "what should we do" ||
    norm === "what should i do" ||
    norm === "what to do" ||
    norm === "what do i do" ||
    norm === "how to start" ||
    norm === "where to start" ||
    norm === "how to do" ||
    norm === "help" ||
    norm === "start" ||
    norm === "i don't know" ||
    norm === "i dont know" ||
    norm === "dont know" ||
    norm === "don't know" ||
    norm === "puriyala" ||
    norm === "theriyala" ||
    norm === "no idea" ||
    /^(what should (we|i) do|how to start|where to start|what do i do|what to do)\b/i.test(norm)
  );
}

function synthesizeHumanTouch(rawHint, section, studentInput, attemptCount = 1) {
  if (!rawHint) {
    if (attemptCount >= 3) {
      return "\u{1F31F} Coach Maara here! Let's solve this step together\u2014look at the template above and try filling in the blanks!";
    }
    if (attemptCount === 2) {
      return "\u{1F31F} Coach Maara checking back in! You're making progress. Let's think carefully about what's needed for this specific step in your worksheet!";
    }
    return "\u{1F31F} Coach Maara here! You are making great strides. Let's think through this step together in your worksheet\u2014what do you think comes next?";
  }
  let clean = rawHint.trim();
  clean = clean.replace(/^🌟\s*Coach Maara note:\s*/i, "");
  if (/^(🌟|coach maara|hey there|awesome|spot on|great work|you're doing|you are doing)/i.test(clean)) {
    return clean;
  }
  const greetings = [
    "\u{1F31F} Coach Maara here! ",
    "\u{1F31F} Coach Maara checking back! ",
    "\u{1F31F} Coach Maara with a fresh tip! ",
    "\u{1F31F} Coach Maara encouraging you! "
  ];
  const greeting = greetings[Math.max(0, attemptCount - 1) % greetings.length] || "\u{1F31F} Coach Maara here! ";
  return `${greeting}${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
}
function extractLatestInput(text) {
  const trimmed = (text || "").trim();
  const rawLines = trimmed.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  if (rawLines.length <= 1) {
    return { latestInput: trimmed, latestLine: trimmed, isMultiline: false };
  }
  const latestLine = rawLines[rawLines.length - 1];
  const isFollowupQuery = (str) => {
    const s = str.toLowerCase();
    return /^(how to|how do|what to|what do|why|puriyala|i did\s*not|i don'?t|explain|can you|what is|how)/i.test(s) || s.includes("understand") || s.includes("puriyala") || s.includes("how to use") || s.includes("dont know") || s.includes("theriyala");
  };
  const blocks = trimmed.split(/\n\s*\n/).map((b) => b.trim()).filter((b) => b.length > 0);
  if (blocks.length > 1) {
    const lastBlock = blocks[blocks.length - 1];
    const prevBlock = blocks[blocks.length - 2];
    if (isFollowupQuery(lastBlock) && prevBlock) {
      return { latestInput: `${prevBlock}
${lastBlock}`, latestLine, isMultiline: true };
    }
    return { latestInput: lastBlock, latestLine, isMultiline: true };
  }
  if (rawLines.length >= 2) {
    const prev = rawLines[rawLines.length - 2].toLowerCase();
    const curr = latestLine.toLowerCase();
    const isPair = isFollowupQuery(latestLine) || prev.includes("odd") && curr.includes("even") || prev.includes("even") && curr.includes("odd") || prev.includes("take") && (curr.includes("%") || curr.includes("table") || curr.includes("even") || curr.includes("odd")) || prev.includes("%") && (curr.includes("even") || curr.includes("odd")) || /\+.*=/.test(prev) && /\+.*=/.test(curr);
    if (isPair) {
      return { latestInput: `${rawLines[rawLines.length - 2]}
${latestLine}`, latestLine, isMultiline: true };
    }
  }
  return { latestInput: latestLine, latestLine, isMultiline: true };
}
function stripCodeWords(s) {
  if (!s || typeof s !== "string") return "";
  return s.replace(/\bprint\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, 'announce "$2"').replace(/\bprintln\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, 'announce "$2"').replace(/\bconsole\.log\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, 'announce "$2"').replace(/\bprint\s+(['"])(.*?)\1/gi, 'announce "$2"').replace(/\bprint\s+(?!message|result|eligible|not eligible)([a-zA-Z0-9_]+)/gi, "announce $1").replace(/\bprint\b/gi, "announce").replace(/\bch\s*==\s*['"]?([a-z])['"]?/gi, "character equals '$1'").replace(/\bch\b/gi, "character").replace(/\bLogical OR\s*\(\s*\|\|\s*\)/gi, "or rule").replace(/\bLogical OR\b/gi, "or rule").replace(/\bOR operator\s*\(\s*\|\|\s*\)/gi, "or rule").replace(/\bOR operator\b/gi, "or rule").replace(/\s*\(\s*\|\|\s*\)/gi, "").replace(/\s*\(\s*&&\s*\)/gi, "").replace(/\b(?:var|let|const|int|float|double|boolean|char|String)\s+([a-zA-Z0-9_]+)\s*=\s*/gi, "input $1 starting at ").replace(/\blet\b(?!['’]s\b|\s+us\b|\s+me\b|\s+them\b|\s+it\b)/gi, "input value").replace(/\b(?:var|const|int|float|double|boolean|char|String)\b/gi, "input value").replace(/\b(?:relational|comparison|modulo|arithmetic|logical)\s+operators?\b/gi, "rule").replace(/\boperators?\b/gi, "rule").replace(/\boperator\b/gi, "rule").replace(/\bvariables?\b/gi, "value").replace(/\bvariable\b/gi, "value").replace(/\bsyntax\b/gi, "wording").replace(/\bcode\b/gi, "steps").replace(/\bprogramming\b/gi, "step-by-step").replace(/\bif-else\s+(?:statements?|blocks?|constructs?)\b/gi, "decision steps").replace(/\b(?:if|else)\s+blocks?\b/gi, "decision step").replace(/\bif\s+conditions?\b/gi, "decision step").replace(/\b['"]?else['"]?\s+conditions?\b/gi, "otherwise case").replace(/\b['"]?else['"]?\s+branch\b/gi, "otherwise step").replace(/\belse\s+display\b/gi, "otherwise display").replace(/\belse\s+announce\b/gi, "otherwise announce").replace(/\belse\s+show\b/gi, "otherwise show").replace(/\b,\s*else\s+->\s*/gi, ", otherwise ").replace(/\belse\s*->\s*/gi, "otherwise ").replace(/\belse\b/gi, "otherwise").replace(/\bconditional\s+statements?\b/gi, "decision steps").replace(/\bconditions\b/gi, "cases").replace(/\s*>=\s*/g, " is greater than or equal to ").replace(/\s*<=\s*/g, " is less than or equal to ").replace(/\s*==\s*/g, " is equal to ").replace(/\s*!=\s*/g, " is not equal to ").replace(/\s*&&\s*/g, " and ").replace(/\s*\|\|\s*/g, " or ").replace(/[{}`]/g, "").replace(/\bL\.S\s*:\s*[^\s,]+,?/gi, "").replace(/\bR\.S\s*:\s*[^\s,]+,?/gi, "").replace(/\bLeft Side\s*:\s*[^\s,]+,?/gi, "").replace(/\bRight Side\s*:\s*[^\s,]+,?/gi, "").replace(/\s{2,}/g, " ").trim();
}
function sanitizePrematurePraise(result, section, problemTitle = "") {
  if (!result || typeof result !== "object") return result;
  if (result.correct === true) return result;

  const feedbackText = String(result.feedback || "");
  const prematurePraiseRegex = /\b(?:hurray|hurrah|kudos|congratulations|congrats|you got it|all \d+ ingredients are verified|all \d+ steps (?:are )?verified|verified!|brilliant work! you've identified all|proceed to (?:ingredients|recipe|taste the sample|sample code)|ready to (?:move on|proceed)|move on to the next|mastered the logic|fantastic work|solution verified)\b/i;

  if (prematurePraiseRegex.test(feedbackText)) {
    let cleaned = feedbackText
      .replace(/🌟 Coach Maara here!\s*(?:Hurray|Hurrah|Kudos|Congrats|Congratulations)[^!.]*[!.]\s*/gi, "🌟 Coach Maara here! Let's examine your current step carefully.\n\n")
      .replace(/\b(?:Hurray|Hurrah|Kudos|Congrats|Congratulations)\s*(?:you got it)?[!.]\s*/gi, "Let's check your current step carefully: ")
      .replace(/Brilliant work! You've identified all \d+ essential programming ingredients[^!.]*[!.]\s*/gi, "Good effort! Let's check your ingredients carefully.\n\n")
      .replace(/Kudos!? You've sequenced all \d+ steps[^!.]*[!.]\s*/gi, "Good progress! Let's refine your sequence.\n\n")
      .replace(/Proceed to (?:ingredients|recipe|taste the sample|sample code)[^!.]*[!.]?/gi, "Review your current step and update your worksheet.");

    if (cleaned.trim().length < 15 || prematurePraiseRegex.test(cleaned)) {
      cleaned = `🌟 Coach Maara here! Take a close look at your ${section} thinking for "${problemTitle || "this problem"}". Ensure your variables, formulas, and logic steps are fully defined and accumulating accurately.`;
    }
    result.feedback = cleaned.trim();
  }
  return result;
}

function detectTasteSampleSyntaxHelp(text) {
  if (!text || typeof text !== "string") return null;
  const norm = text.toLowerCase().trim();

  // Words expressing not knowing / confusion / how-to:
  const hasNotKnowing = /(?:therila|theriyala|theriyathunu|theriyathu|puriyala|purila|don'?t\s*know|dont\s*know|not\s*sure|no\s*idea|epdi\s*(?:eluthanum|eluthurathu|podanum|pannanum|create\s*pannanum)?|how\s*to\s*(?:write|declare|use|code|start|create)|how\s*do\s*i|how\s*can\s*i|help|example|explain|doubt)/i.test(norm);
  const hasSyntaxWord = /\b(?:synatx|syntax|code|coding)\b/i.test(norm);

  const mentionsVar = /\b(?:varable|variable|variables|declaring|declaration|initialization|var|let|const)\b/i.test(norm);
  const mentionsIf = /\b(?:if\s*condition|if\s*statement|if\s*else|condition|conditions|\bif\b)\b/i.test(norm);
  const mentionsLoop = /\b(?:for\s*loop|while\s*loop|\bloop\b|looping|forloop|\bfor\b)\b/i.test(norm);

  const isSyntaxQuery = (hasSyntaxWord && hasNotKnowing) ||
    (hasSyntaxWord && (mentionsVar || mentionsIf || mentionsLoop)) ||
    (hasNotKnowing && (mentionsVar || mentionsIf || mentionsLoop)) ||
    /\b(?:syntax help|syntax example|how to write syntax|how to code syntax|how to write for loop|how to write if condition|how to declare variable|how to write variable)\b/i.test(norm);

  if (!isSyntaxQuery) return null;

  const countSpecific = (mentionsVar ? 1 : 0) + (mentionsIf ? 1 : 0) + (mentionsLoop ? 1 : 0);
  const isGeneralOrAll = countSpecific >= 3 || countSpecific === 0;

  return {
    mentionsVar,
    mentionsIf,
    mentionsLoop,
    isGeneralOrAll
  };
}

function generateTasteSampleSyntaxResponse(syntaxInfo, problemTitle = "", problemType = "") {
  return "🌟 Coach Maara here! Let's build our code prototype step by step using your verified ingredients! Start by writing the first statement in your code editor.";
}

function isTasteSampleStructurallyComplete(code, problemType) {
  if (!code || typeof code !== "string") return false;
  const norm = code.toLowerCase();

  // Basic check: must have at least an assignment/variable and print/output
  const hasVar = /(?:(?:let|var|const|int|float|double|long|char|string)\s+)?[a-zA-Z_]\w*\s*=\s*[^=]/i.test(code) ||
                 /\b(?:input|scanner|cin|prompt|read|sys\.stdin)\b/i.test(norm);
  const hasPrint = /\b(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<|echo|puts)\b/i.test(norm);
  if (!hasVar || !hasPrint) return false;

  if (problemType === "odd-even") {
    const hasMod = /%\s*2/.test(norm) || /modulo|remainder/i.test(norm);
    const hasIf = /\bif\b/.test(norm);
    const hasEven = /\beven\b/i.test(norm);
    const hasOdd = /\bodd\b/i.test(norm);
    const hasForeign = /\b(?:eligible|not\s*eligible|adult|minor|positive|negative|prime)\b/i.test(norm);
    return hasMod && hasIf && hasEven && hasOdd && !hasForeign;
  }

  if (problemType === "positive-negative") {
    const hasComp = />\s*0|<\s*0|>=\s*0|<=\s*0/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    const hasPos = /positive/i.test(norm);
    const hasNeg = /negative/i.test(norm);
    return hasComp && hasIf && hasPos && hasNeg;
  }

  if (problemType === "maximum-of-two") {
    const hasComp = />|</.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasComp && hasIf;
  }

  if (problemType === "leap-year") {
    const hasMod = /%\s*4|%\s*400/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasMod && hasIf;
  }

  if (problemType === "vowel-consonant" || problemType === "vowel-or-consonant") {
    const hasVowelCheck = /[aeiou]/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasVowelCheck && hasIf;
  }

  if (problemType === "divisible-by-5") {
    const hasMod = /%\s*5/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasMod && hasIf;
  }

  if (problemType === "three-digit-number") {
    const hasComp = />=\s*100|>\s*99|len\s*\(/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasComp && hasIf;
  }

  if (problemType === "greater-than-100") {
    const hasComp = />\s*100|>=\s*101/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasComp && hasIf;
  }

  if (problemType === "profit-loss") {
    const hasProfit = /profit|loss/i.test(norm) || />|</.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasProfit && hasIf;
  }

  if (problemType === "senior-citizen" || problemType === "adult-minor" || problemType === "voting-eligibility" || problemType === "pass-fail") {
    const hasComp = />=|>|<=|</.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasComp && hasIf;
  }

  if (problemType === "sum-natural-numbers") {
    const hasAccumulator = /(?:sum|total)\s*=\s*0\b/i.test(norm) || /(?:sum|total)\s*\+=\s*/i.test(norm) || /(?:sum|total)\s*=\s*(?:sum|total)\s*\+/i.test(norm);
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    return (hasAccumulator || /\+/.test(norm)) && hasLoop;
  }

  if (problemType === "factorial") {
    const hasAccumulator = /(?:fact|factorial|prod|product)\s*=\s*1\b/i.test(norm) || /(?:fact|factorial|prod|product)\s*\*=\s*/i.test(norm) || /(?:fact|factorial|prod|product)\s*=\s*(?:fact|factorial|prod|product)\s*\*/i.test(norm);
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    return (hasAccumulator || /\*/.test(norm)) && hasLoop;
  }

  if (problemType === "multiplication-table") {
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    const hasMult = /\*/.test(norm);
    return hasLoop && hasMult;
  }

  if (problemType === "even-numbers-1-to-50") {
    const hasQuestion = /\?|how\s*to|what\s*is/i.test(norm);
    if (hasQuestion) return false;
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    const has50 = /50\b/.test(norm) || /51\b/.test(norm);
    const hasStep2 = /\+=\s*2\b/.test(norm) || /,\s*2\s*\)/.test(norm);
    const hasIf = /\bif\b/i.test(norm);
    const hasMod2 = /%\s*2\b/.test(norm);
    const printsText = /(?:print|println|printf|console\.log)\s*\(\s*["']?(?:even|odd|number)["']?\s*\)/i.test(norm);
    const printsLoopVar = /(?:print|println|printf|console\.log)\s*\(\s*[a-zA-Z_]\w*\s*\)/i.test(norm) && !printsText;
    return hasLoop && has50 && (hasStep2 || (hasIf && hasMod2)) && printsLoopVar;
  }

  if (problemType === "divisors" || problemType === "divisor-of-a-number") {
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    const hasMod = /%/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasLoop && hasMod && hasIf;
  }

  if (problemType === "prime-number") {
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    const hasMod = /%/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasLoop && (hasMod || hasIf);
  }

  if (problemType === "next-prime-number") {
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    return hasLoop;
  }

  if (problemType === "prime-between-range") {
    const hasLoop = /\b(?:for|while)\b/i.test(norm);
    return hasLoop;
  }

  if (problemType === "sexy-prime-number") {
    const hasDiff = /6/.test(norm);
    const hasIf = /\bif\b/.test(norm);
    return hasDiff && (hasIf || hasPrint);
  }

  // General conditional fallback: if it has var, if, and print
  if (/\bif\b/.test(norm) && hasPrint) {
    return true;
  }

  // General loop fallback: if it has loop and print
  if (/\b(?:for|while)\b/.test(norm) && hasPrint) {
    return true;
  }

  return false;
}

class InputCheckerService {
  /**
   * Detects if the student explicitly indicated they are stuck or asked for a worked example
   */
  isUserStuck(text, options) {
    if (options?.isStuck) return true;
    if ((options?.attemptCount ?? 0) >= 3) return true;
    const t = (text || "").toLowerCase();
    const stuckKeywords = [
      "stuck",
      "stuck agitten",
      "i am stuck",
      "im stuck",
      "i'm stuck",
      "give example",
      "show example",
      "give me example",
      "sample",
      "example kudunga",
      "example thanga",
      "example venum",
      "maths example",
      "give math example",
      "show math example",
      "doubt",
      "enakku doubt",
      "doubt irukku",
      "full example",
      "worked example",
      "solution venum",
      "give solution",
      "puriyave illa",
      "i don't know",
      "dont know",
      "theriyala",
      "i did not understand",
      "did not understand",
      "not understand",
      "dont understand",
      "don't understand",
      "puriyala",
      "purila",
      "puriyavillai",
      "explain",
      "help",
      "what to do",
      "how to do",
      "what next",
      "what is next",
      "what is next step",
      "next step",
      "next enna"
    ];
    return stuckKeywords.some((kw) => t.includes(kw));
  }
  resolveWorksheetCandidates(text, section) {
    if (!text || typeof text !== "string") return [text || ""];
    const raw = text.trim();
    if (!raw) return [""];
    const candidates = [raw];

    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return candidates;

    // Candidate 1: Detect subsequent attempt starting with Step 1 or starter header
    const step1Indices = [];
    lines.forEach((l, idx) => {
      if (/^(?:step\s*1\b|1[\.\:\)]|\bpart\s*1\b|\bstage\s*1\b)/i.test(l)) {
        step1Indices.push(idx);
      }
    });
    if (step1Indices.length > 1) {
      const lastStep1Idx = step1Indices[step1Indices.length - 1];
      const latestAttempt = lines.slice(lastStep1Idx).join("\n");
      if (latestAttempt && latestAttempt !== raw && !candidates.includes(latestAttempt)) {
        candidates.push(latestAttempt);
      }
    }

    // Candidate 2: Step-level deduplication (later step X replaces earlier step X)
    const stepMap = new Map();
    const nonStepLines = [];
    lines.forEach((l, idx) => {
      const stepMatch = l.match(/^(?:step\s*(\d+)|(\d+)[\.\:\)])\s*[:\-\s]*(.*)$/i);
      if (stepMatch) {
        const stepNum = parseInt(stepMatch[1] || stepMatch[2], 10);
        stepMap.set(stepNum, l);
      } else {
        nonStepLines.push({ idx, text: l });
      }
    });

    if (stepMap.size > 0) {
      const sortedStepNums = Array.from(stepMap.keys()).sort((a, b) => a - b);
      const dedupedLines = sortedStepNums.map((n) => stepMap.get(n));
      const trailingNonSteps = nonStepLines.filter((item) => item.idx > 0).map((item) => item.text);
      const dedupedText = [...dedupedLines, ...trailingNonSteps].join("\n");
      if (dedupedText && dedupedText !== raw && !candidates.includes(dedupedText)) {
        candidates.push(dedupedText);
      }
    }

    // Candidate 3: In logic / equations, deduplicate equations by left-hand side operands
    const eqMap = new Map();
    let hasEqs = false;
    lines.forEach((l) => {
      const eqMatch = l.match(/(\d+\s*[\+\-\*\/%]\s*\d+)\s*=\s*(\d+)/);
      if (eqMatch) {
        hasEqs = true;
        const lhs = eqMatch[1].replace(/\s+/g, "");
        eqMap.set(lhs, l);
      }
    });
    if (hasEqs && eqMap.size > 0) {
      const dedupedEqLines = lines.map((l) => {
        const eqMatch = l.match(/(\d+\s*[\+\-\*\/%]\s*\d+)\s*=\s*(\d+)/);
        if (eqMatch) {
          const lhs = eqMatch[1].replace(/\s+/g, "");
          if (eqMap.get(lhs) === l) return l;
          return null;
        }
        return l;
      }).filter(Boolean);
      const dedupedEqText = dedupedEqLines.join("\n");
      if (dedupedEqText && dedupedEqText !== raw && !candidates.includes(dedupedEqText)) {
        candidates.push(dedupedEqText);
      }
    }

    // Candidate 4: Category list deduplication in logic (e.g. odd: / even:)
    const catMap = new Map();
    let hasCats = false;
    lines.forEach((l) => {
      const catMatch = l.match(/^\s*(odd|even)\s*[:=]/i);
      if (catMatch) {
        hasCats = true;
        catMap.set(catMatch[1].toLowerCase(), l);
      }
    });
    if (hasCats && catMap.size > 0) {
      const dedupedCatLines = lines.map((l) => {
        const catMatch = l.match(/^\s*(odd|even)\s*[:=]/i);
        if (catMatch) {
          if (catMap.get(catMatch[1].toLowerCase()) === l) return l;
          return null;
        }
        return l;
      }).filter(Boolean);
      const dedupedCatText = dedupedCatLines.join("\n");
      if (dedupedCatText && dedupedCatText !== raw && !candidates.includes(dedupedCatText)) {
        candidates.push(dedupedCatText);
      }
    }

    // Candidate 5: Samplecode / prototype code blocks (if multiple blocks or repeated var declarations)
    if (section === "samplecode") {
      const varMatches = Array.from(raw.matchAll(/(?:^|\n)\s*(?:(?:let|var|const|int|float|double|long|char|string)\s+)?[a-zA-Z_]\w*\s*=\s*(?:[0-9]+|int\(input|prompt|scanner|cin)/gi));
      if (varMatches.length > 1) {
        const lastIdx = varMatches[varMatches.length - 1].index;
        const latestCode = raw.slice(lastIdx).trim();
        if (latestCode && latestCode !== raw && !candidates.includes(latestCode)) {
          candidates.push(latestCode);
        }
      }
      const ifMatches = Array.from(raw.matchAll(/(?:^|\n)\s*if\s*\(/gi));
      if (ifMatches.length > 1) {
        const lastIfIdx = ifMatches[ifMatches.length - 1].index;
        const topCode = raw.slice(0, lastIfIdx);
        const varLine = topCode.split(/\r?\n/).find((l) => /(?:(?:let|var|const|int|float|double)\s+)?[a-zA-Z_]\w*\s*=/i.test(l));
        const latestIfCode = ((varLine ? varLine + "\n" : "") + raw.slice(lastIfIdx)).trim();
        if (latestIfCode && !candidates.includes(latestIfCode)) {
          candidates.push(latestIfCode);
        }
      }
      const blocks = raw.split(/\n\s*\n\s*\n/).map((b) => b.trim()).filter(Boolean);
      if (blocks.length > 1) {
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && !candidates.includes(lastBlock)) {
          candidates.push(lastBlock);
        }
      }
    }

    // Candidate 6: Replace second-to-last line with last line (user appended a correction directly below the error)
    if (lines.length >= 2) {
      const lastLineReplaced = [...lines.slice(0, lines.length - 2), lines[lines.length - 1]].join("\n");
      if (!candidates.includes(lastLineReplaced)) {
        candidates.push(lastLineReplaced);
      }
    }

    return candidates;
  }
  /**
   * Dynamic AI-driven evaluation for ANY problem and ANY stage,
   * retrieving curriculum hints from Firebase and modifying them with human touch.
   */
  async check(category, problemID, section, userInput, options) {
    const text = (userInput || "").trim();
    const isStuck = this.isUserStuck(text, options);
    const isStarter = isStarterRequest(text);

    const seedProblem = SEED_PROBLEMS[problemID];
    const problemTitle = options?.problemTitle || seedProblem?.programName || problemID.replace(/-/g, " ");
    const problemDescription = options?.problemDescription || seedProblem?.description || `Problem: ${problemTitle}`;
    const concept = options?.concept || seedProblem?.concept || "Programming logic and algorithmic problem solving";
    const attemptCount = typeof options?.attemptCount === "number" && options.attemptCount > 0 ? options.attemptCount : 1;

    const evalInput = (text && text.length >= 2) ? text : "what should we do";

    // Strict Cross-Problem Protection: Reject logic/recipe/ingredients/code belonging to any other problem!
    if (text && text.length >= 5) {
      const crossMismatch = detectCrossProblemMismatch(problemID, section, text);
      if (crossMismatch) {
        return {
          correct: false,
          feedback: crossMismatch.message,
          correction: `Please write the ${section === "samplecode" ? "code" : section} specifically for ${crossMismatch.currentTitle}.`,
          isCrossProblemMismatch: true
        };
      }
    }
    const reveal = options?.reveal || {
      logic: seedProblem?.logicReveal,
      recipe: seedProblem?.recipeReveal,
      ingredients: seedProblem?.ingredientsReveal,
      samplecode: seedProblem?.sampleReveal
    };
    const { latestInput, latestLine } = extractLatestInput(evalInput);
    const problemType = detectProblemType(problemID, problemTitle);
    const candidates = this.resolveWorksheetCandidates(evalInput, section);

    let matchedFirebase = null;

    // Fast-path verification across candidates:
    // If student made a mistake in an earlier step/line but corrected it below (or rewrote all steps),
    // immediately identify the correct step and grant completion without repeating previous errors!
    for (const cand of candidates) {
      if (section === "samplecode") {
        if (problemType === "odd-even") {
          const sampleVal = validateOddEvenSampleCode(cand);
          if (sampleVal.allVerified) {
            return sanitizePrematurePraise({
              correct: true,
              feedback: sampleVal.feedback,
              correction: null,
              suggestedInput: null,
              sampleCodeStepProgress: sampleVal.sampleCodeStepProgress,
              stepProgress: sampleVal.stepProgress,
              source: "ai_human_touch"
            }, section, problemTitle);
          }
        } else {
          const syntaxQuery = detectTasteSampleSyntaxHelp(cand) || detectTasteSampleSyntaxHelp(latestInput);
          if (!syntaxQuery && isTasteSampleStructurallyComplete(cand, problemType)) {
            return sanitizePrematurePraise({
              correct: true,
              feedback: `🌟 Coach Maara here! Fantastic job! Your code prototype for "${problemTitle}" is structurally verified across all components! Proceed to the Compiler to compile and run your code!`,
              correction: null,
              suggestedInput: null,
              source: "ai_human_touch"
            }, section, problemTitle);
          }
        }
      }

      if (problemType === "odd-even" && section === "logic") {
        const logicVal = validateOddEvenLogic(cand);
        if (logicVal.isFullyVerified) {
          return sanitizePrematurePraise({
            correct: true,
            feedback: logicVal.feedback,
            correction: null,
            suggestedInput: null,
            logicStepProgress: logicVal.logicStepProgress,
            stepProgress: logicVal.logicStepProgress,
            source: "ai_human_touch"
          }, section, problemTitle);
        }
      }

      const detResult = this.generateSafetyFallback(section, problemTitle, cand, isStuck, matchedFirebase, problemID, attemptCount);
      if (detResult && detResult.correct === true) {
        detResult.source = "ai_human_touch";
        return sanitizePrematurePraise(detResult, section, problemTitle);
      }
    }

    const evalTarget = evalInput;
    try {
      matchedFirebase = await firebaseHintService.findBestMatchingPair(problemID, section, latestInput);
      if ((!matchedFirebase || matchedFirebase.score < 25) && latestLine !== latestInput) {
        const lineMatch = await firebaseHintService.findBestMatchingPair(problemID, section, latestLine);
        if (lineMatch && lineMatch.score > (matchedFirebase?.score ?? 0)) {
          matchedFirebase = lineMatch;
        }
      }
      const isQuestionOrNewThought = latestInput.includes("?") || /why|how|what|puriyala|table|modulo|arithmetic|rem|remainder/i.test(latestInput);
      if (!isQuestionOrNewThought && (!matchedFirebase || matchedFirebase.score < 50) && text !== latestInput) {
        const fullMatch = await firebaseHintService.findBestMatchingPair(problemID, section, text);
        if (fullMatch && fullMatch.score > (matchedFirebase?.score ?? 0)) {
          matchedFirebase = fullMatch;
        }
      }
    } catch (err) {
      console.warn("[InputCheckerService] Error fetching Firebase hint pair:", err?.message || err);
    }
    let dynamicAiResult = null;
    try {
      dynamicAiResult = await Promise.race([
        this.evaluateWithGemini(
          problemTitle,
          problemDescription,
          concept,
          reveal[section],
          section,
          evalTarget,
          isStuck,
          matchedFirebase,
          problemID,
          latestInput,
          attemptCount
        ),
        new Promise((resolve) => setTimeout(() => resolve(null), 14e3))
      ]);
    } catch (err) {
      console.warn("[InputCheckerService] Gemini evaluation timed out or failed, falling back.");
    }
    if (dynamicAiResult) {
      dynamicAiResult.source = "ai_human_touch";
      if (!dynamicAiResult.correct) {
        const stageFallback = this.generateSafetyFallback(section, problemTitle, evalTarget, isStuck, matchedFirebase, problemID, attemptCount);
        dynamicAiResult.correction = dynamicAiResult.correction || stageFallback?.correction || null;
        dynamicAiResult.suggestedInput = dynamicAiResult.suggestedInput || stageFallback?.suggestedInput || null;
        dynamicAiResult.proofType = dynamicAiResult.proofType || stageFallback?.proofType || "mathematical";
      } else {
        dynamicAiResult.correction = null;
        dynamicAiResult.suggestedInput = null;
      }
      return sanitizePrematurePraise(dynamicAiResult, section, problemTitle);
    }

    // Dynamic AI Human Touch Fallback (Generates dynamic response reflecting student's exact questions/input)
    const normText = evalInput.toLowerCase();
    let dynamicFb = "";

    if (section === "samplecode") {
      if (isTasteSampleStructurallyComplete(evalInput, problemType)) {
        return sanitizePrematurePraise({
          correct: true,
          feedback: `🌟 Coach Maara here! Outstanding! Your code prototype for "${problemTitle}" is structurally verified across all components! Proceed to the Compiler to compile and run your code!`,
          correction: null,
          suggestedInput: null,
          source: "ai_human_touch"
        }, section, problemTitle);
      }
    }

    if (problemType === "odd-even" && section === "logic") {
      const logicVal = validateOddEvenLogic(evalInput);
      if (logicVal.isFullyVerified) {
        return sanitizePrematurePraise({
          correct: true,
          feedback: logicVal.feedback,
          correction: null,
          suggestedInput: null,
          logicStepProgress: logicVal.logicStepProgress,
          stepProgress: logicVal.logicStepProgress,
          source: "ai_human_touch"
        }, section, problemTitle);
      } else {
        return sanitizePrematurePraise({
          correct: false,
          feedback: logicVal.feedback,
          correction: logicVal.correction,
          suggestedInput: logicVal.suggestedInput,
          logicStepProgress: logicVal.logicStepProgress,
          stepProgress: logicVal.logicStepProgress,
          source: "ai_human_touch"
        }, section, problemTitle);
      }
    }

    const fallbackResult = this.generateSafetyFallback(section, problemTitle, evalInput, isStuck, matchedFirebase, problemID, attemptCount);

    if (!dynamicFb) {
      if (fallbackResult && fallbackResult.feedback) {
        fallbackResult.source = "ai_human_touch";
        return sanitizePrematurePraise(fallbackResult, section, problemTitle);
      }
      dynamicFb = synthesizeHumanTouch(
        matchedFirebase?.bestPair?.hint || `Take a close look at your ${section} thinking for "${problemTitle}". What do you think comes next in your steps?`,
        section,
        evalInput,
        attemptCount
      );
    }
    return sanitizePrematurePraise({
      correct: false,
      feedback: dynamicFb,
      correction: fallbackResult?.correction || null,
      suggestedInput: fallbackResult?.suggestedInput || null,
      proofType: fallbackResult?.proofType || "mathematical",
      source: "ai_human_touch"
    }, section, problemTitle);
  }
  /**
   * Evaluates student input in real time using Gemini AI,
   * taking the Firebase curriculum hint and modifying it with a warm human touch.
   */
  async evaluateWithGemini(problemTitle, problemDescription, concept, referenceSolution, section, userInput, isStuck, matchedFirebase, problemID, latestInput, attemptCount = 1) {
    const ai = getGenAI();
    if (!ai) {
      console.warn("[InputCheckerService] No GEMINI_API_KEY available.");
      return null;
    }
    const problemType = detectProblemType(problemID, problemTitle);
    const resolvedFbId = firebaseHintService.resolveProblemId(problemID);
    const firebaseContext = matchedFirebase && matchedFirebase.allPairs.length > 0 ? `
FIREBASE CURRICULUM REFERENCE (from hints/${resolvedFbId}/sections/${section}/pairs):
- Matched Reference Input Pattern: "${matchedFirebase.bestPair?.input || ""}"
- Matched Base Curriculum Hint: "${matchedFirebase.bestPair?.hint || ""}"
- Complete Curriculum Sequence for this section (${matchedFirebase.allPairs.length} pairs):
${matchedFirebase.allPairs.map((p, idx) => `  ${idx + 1}. [Input: "${p.input}"] -> [Hint: "${p.hint}"]`).join("\n")}
` : "";
    let problemSpecificDirectives = "";
    if (problemType === "odd-even") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Odd or Even Checker"
Concept: Modulo Operator & Parity
1. TERMINOLOGY RULE (MANDATORY):
   - Always use the phrase "2 table" (or "2-table").
   - NEVER say "2-times table" or "two times table" or "multiplication table of 2"!
2. STAGE 1 (LOGIC):
   - 'correct' MUST REMAIN FALSE UNTIL MATHEMATICALLY DEFINED!
   - Merely listing example numbers (e.g. 'odd: 1, 3, 5' and 'even: 2, 4, 6') is an intermediate step.
   - If numbers are wrong in list, point out the error gently.
   - When numbers are correct, prompt: Look at the even numbers (2, 4, 6...). Which multiplication table do they belong to? What arithmetic operation (+,-,*,/) could test if a number fits into that pattern?
   - DO NOT spoil "2 table" before the student mentions it.
   - When student mentions 2 table and % (or asks how to use them): explain that number % 2 gives the remainder (0 is even, 1 is odd).
   - Both even and odd must be mathematically defined across the worksheet before marking 'correct': true!
3. STAGE 2 (RECIPE):
   - 4 steps:
     Step 1: Get input number
     Step 2: Modulo divide by 2
     Step 3: Check remainder
     Step 4: Remainder 0 even, else odd (or remainder 1 is odd)
   - CRITICAL PARITY CHECK FOR STEP 4:
     * If the student claims remainder 0 (or zero) is odd, OR remainder 1 (or one) is even:
       -> THIS IS MATHEMATICALLY INVERTED AND WRONG!
       -> Set 'correct': false!
       -> Explain that dividing by 2 leaves remainder 0 for EVEN numbers and remainder 1 for ODD numbers.
       -> Guide them to correct Step 4.
   - All 4 steps must be accurately sequenced with correct parity before 'correct': true.
`;
    } else if (problemType === "sum-natural-numbers") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Sum of N Natural Numbers"
Concept: Sequential Accumulation & Loops
1. STAGE 1 (LOGIC):
   - Concept: Sequential accumulation. Natural numbers start from 1 up to n.
   - We start with an initial running total of 0 and sequentially add each number (1, 2, 3... n) step by step.
   - VALID SUCCESSFUL INPUT ('correct': true):
     * If the student traces step-by-step additions in their worksheet like:
       "If n=5: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15"
       OR "1 + 2 + 3 + 4 + 5 = 15"
       OR writes clear verbal explanation: "Start total at 0, then add 1, then add 2, then add 3... up to n."
       -> This is FULLY VALID mathematical logic! Set 'correct': true!
       -> Congratulate them warmly on demonstrating sequential accumulation and guide them to proceed to the Recipe stage!
   - ARITHMETIC ERROR CHECK:
     * If the student writes an equation with a calculation error (e.g. 6+4=9 or 1+2=4):
       -> Set 'correct': false!
       -> Gently point out their exact arithmetic mistake (e.g. "Look closely at your addition: 6 + 4 is 10, not 9! Correct this step so your accumulated total is accurate.")
   - ANTI-DOUBLING / ACCUMULATION INTEGRITY CHECK (CRITICAL):
     * If the student doubles numbers in each line (e.g. "1+1=2, 2+2=4, 3+3=6"):
       -> Set 'correct': false!
       -> Explain clearly: "In each line, you are doubling each number (1+1=2, 2+2=4, 3+3=6) instead of carrying forward the running total! When summing natural numbers from 1 to n, each number is added only ONCE into a running total starting at 0: 0+1=1, 1+2=3, 3+3=6. Notice that in step 2, we add 2 to the previous total 1 (getting 3), NOT 2 to 2!"
     * In genuine sequential accumulation, each step carries forward the accumulated total from the previous step: 0+1=1, 1+2=3, 3+3=6.
     * If equations do not carry forward the previous total (broken chain), set 'correct': false and instruct them how to carry over the running total.
   - BOUNDARY & LOGICAL CONSISTENCY CHECK (CRITICAL):
     * If the student states a test number n (e.g. "If i take a number as 3", "take 3", "n=3"):
       - They must accumulate strictly up to that test number n!
       - For n = 3: the sum of 1 to 3 is 0+1=1, 1+2=3, 3+3=6 (sum = 6).
       - If they continue adding beyond n (e.g. adding 4 to reach 10: "6+4=10") or state "The sum of 3 is 10":
         -> Set 'correct': false!
         -> Explain that 10 is the sum of 4, not 3. For n=3, the sum of 1+2+3 is 6. Adding 4 calculates the sum of 4.
     * If the student states an inaccurate conclusion (e.g. "The sum of 3 is 10"):
       -> Set 'correct': false!
       -> Explain that the sum of the first 3 numbers is 6, not 10.
   - FORMULA SHORTCUT CHECK:
     * If the student only writes the formula "n*(n+1)/2":
       -> Set 'correct': false!
       -> Gently explain: "While n*(n+1)/2 is a great mathematical formula shortcut, in programming we build algorithmic logic by accumulating numbers one by one using a running total. Explain how the total accumulates step by step starting from 0!"
   - STARTING CONFUSION ("What to do / puriyala / theriyala"):
     * Explain that natural numbers start from 1. If n=5, we start with a total of 0 and add 1, then 2, then 3, then 4, then 5. Ask them to trace this addition step by step in the worksheet.

2. STAGE 2 (RECIPE):
   - Concept: Human-readable algorithmic recipe in plain, everyday English.
   - CRITICAL RULE (NO PROGRAMMING WORDS OR TOOLS):
     * The Recipe stage is strictly for human algorithmic thinking!
     * DO NOT use programming keywords or code syntax (e.g. 'loop', 'for', 'while', 'counter i', 'variable', 'i++', 'sum+=', 'int', 'code').
     * Use everyday plain language: 'repeat', 'current number', 'starting number', 'next number', 'total sum'.
     * If the student uses programming keywords, set 'correct': false and instruct them to rephrase using plain everyday words.
   - 5 ATOMIC STEPS (Step 3 and Step 4 MUST BE SPLIT):
     Step 1: Read / get input number n
     Step 2: Start with total sum as 0 and current number as 1
     Step 3: Move to the next number and repeat until reaching n
     Step 4: Add the current number to the total sum
     Step 5: Display / print the final total sum
   - IMPORTANT SPLIT:
     * If the student combines adding and repeating into a single step (e.g. "loop from 1 to n adding each number to sum"):
       -> Set 'correct': false!
       -> Gently explain: "Split into 2 distinct steps: Step 3 (Move to the next number and repeat until reaching n) and Step 4 (Add the current number to the total sum)."
   - All 5 steps must be sequenced before marking 'correct': true!
   - Populate 'recipeStepProgress' with all 5 steps.

3. STAGE 3 (INGREDIENTS):
   - ALL 5 ESSENTIAL INGREDIENTS MUST BE SPECIFICALLY IDENTIFIED BEFORE 'correct': true:
     1. Input variable: n (or input integer)
     2. Accumulator variable: sum initialized to 0 (starts at 0 to collect total)
     3. Loop counter variable: i initialized to 1 (starts at 1 to track current number)
     4. Loop construct: for loop or while loop (repeats addition from 1 to n)
     5. Operators: + or += (addition), = (assignment), <= (boundary comparison)
   - FOR LOOP PARAMETERS MANDATE (CRITICAL USER DIRECTIVE):
     * When the student chooses, mentions, or writes a 'for loop' (e.g. "For loop", "Step 3: For loop", "loop"):
       The hint MUST explicitly tell them what values to mention for the for loop controls:
       1. Start value: 1 (starts from 1)
       2. End value: n (or n + 1 in Python range(1, n + 1) to reach n)
       3. Next step: increment by 1 (advances to the next number each step)
     * In your feedback, explicitly guide:
       "In your for loop, make sure to specify what are the values for start, end, and next step:
       \u2022 Start value: 1 (starts at 1)
       \u2022 End value: n (or n + 1 in Python range to reach n)
       \u2022 Next step: increment by 1 (advances to the next number each step)
       Now, what operators (+ or +=, and =) do we need inside the loop to add each number to the total sum?"
   - CRITICAL STRICTNESS MANDATE:
     * High-level, abstract, or conversational sentences such as:
       "how to start" or "I need a variable for the input, one for the total, and a way to repeat the addition"
       MUST BE MARKED 'correct': false!
     * Merely stating an intent to use variables without naming 'n', 'sum = 0', 'i = 1', 'for/while loop', and operators is NOT acceptable for passing!
     * If ANY ingredient is missing, set 'correct': false and clearly guide the student on what is missing and what to write.
     * CRITICAL ACCUMULATOR CHECK IN INGREDIENTS:
       - If student writes "sum = a + i" or "sum = n + i" or "sum = 0 + i" or "sum = i" in ingredients:
         -> THIS IS A CRITICAL ACCUMULATOR BUG!
         -> 'a' (or 'n') is the input limit/boundary, not the accumulator container!
         -> 'correct' MUST BE FALSE! NEVER say "Hurray you got it!" or "Good work, proceed to taste the sample!".
         -> Explain clearly: "Notice that 'a' (or 'n') is your input limit, not the accumulator! If you write 'sum = a + i', the previous total is not accumulated. To accumulate each number from the loop into the running total, use: sum = sum + i (or sum += i)."
     * Populate 'ingredientsStepProgress' tracking all 5 ingredients.

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Concept: Executable prototype code (in Python, JavaScript, Java, C++, etc.) assembling all verified ingredients for Sum of N Numbers.
   - EXACT 5 ATOMIC CODE STEPS:
     Step 1: Input variable declaration / input read (e.g. n = 5, n = int(input()))
     Step 2: Accumulator variable initialized to 0 (sum = 0; NEVER 1!)
     Step 3: Loop construct iterating from 1 to n (e.g. for (let i = 1; i <= n; i++), for i in range(1, n + 1):)
     Step 4: Sum accumulation inside loop body: sum = sum + i (or sum += i)
     Step 5: Output display statement outside loop: print(sum) (or console.log(sum))
   - AI HUMAN-TOUCH & COACHING GUIDELINES (COACH MAARA):
     * Speak warmly as Coach Maara, your empathetic 1-on-1 coding mentor.
     * Answer syntax queries or conceptual questions warmly with clear examples.
     * ACCUMULATOR OVERWRITE ERROR: If student writes "sum = a + i" or "sum = n + i" or "sum = i" inside loop body, set 'correct': false and explain that this overwrites 'sum' on every iteration instead of accumulating into the running total. Instruct: sum = sum + i (or sum += i).
     * ZERO ACCUMULATOR ERROR: If student starts sum at 1, remind them that sum starts at 0.
     * PYTHON RANGE: If range(1, n), explain that range(1, n + 1) is needed to include n.
     * Populate 'sampleCodeStepProgress' tracking all 5 steps.
     * Set 'correct': true ONLY when all 5 steps are properly present!
`;
    } else if (problemType === "factorial") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Factorial of a Number"
Concept: Sequential Product & Accumulation
1. STAGE 1 (LOGIC):
   - Concept: Factorial of N (N!) via step-by-step sequential product & accumulation.
   - STEP-BY-STEP REQUIREMENT (CRITICAL CTC RULE):
     * In programming, a computer does NOT multiply all numbers in one single line (e.g. 5*4*3*2*1=120). It multiplies iteratively step by step using an accumulator variable (fact = fact * i).
     * If the student only writes a single one-line direct product expansion (e.g. "n=5 
 5*4*3*2*1=120" or "5*4*3*2*1=120" or "1*2*3*4*5=120" or "5! = 120"):
       -> Set 'correct': false!
       -> Praise their mathematical accuracy, but explain that in coding, the computer accumulates the product step by step.
       -> Guide them to write the step-by-step calculations (e.g. 5*4=20, 20*3=60, 60*2=120, 120*1=120).
       -> suggestedInput should be: "5*4=20
20*3=60
60*2=120
120*1=120"
     * Set 'correct': true ONLY when the student writes the step-by-step sequential accumulation traces:
       e.g.,
       5*4=20
       20*3=60
       60*2=120
       120*1=120
       OR
       1*2=2
       2*3=6
       6*4=24
       24*5=120
       OR writes verbal explanation of sequentially multiplying the previous running result with the next number.
       -> When 'correct': true, congratulate them warmly on discovering sequential multiplication and set 'suggestedInput': null / omit it completely!
   - ARITHMETIC ERROR CHECK:
     * If equations have wrong multiplication (e.g. 5*4=25 or 20*3=50):
       -> Set 'correct': false and point out the specific arithmetic error.
   - ZERO MULTIPLICATION ERROR:
     * If student starts total at 0 and multiplies (0*1=0):
       -> Set 'correct': false and explain that multiplying by 0 makes the entire product 0.

2. STAGE 2 (RECIPE):
   - Concept: Human-readable algorithmic recipe for Factorial in plain English without programming keywords (no loop, for, while, i++, code).
   - EXACT 4 ATOMIC STEPS (STRICT SEQUENCING):
     Step 1: Accept / read a number as input (e.g. "Step 1: Accept a number as input")
     Step 2: Generate all numbers from 1 up to the input number (or from input down to 1)
     Step 3 (or Step 2.1): Multiply each generated number with the factorial variable
     Step 4 (or Step 3): Print the final factorial value
   - CRITICAL STEP SEQUENCE RULE:
     * If the student only writes Step 1, or writes Step 1 and manually multiplies a couple isolated numbers (e.g. "Step 2: multiply 5 with 4 and 20 with 3" or asks "After this what i do"):
       -> Step 2 (Generate all numbers from 1 up to the input number / input down to 1) is NOT completed!
       -> Step 3 is NOT completed!
       -> Step 4 is NOT completed!
       -> Set 'correct': false!
       -> DO NOT tell them to print the final result!
       -> Guide them warmly to write Step 2: generate the sequence of numbers from 1 up to the input number (or from input down to 1).
     * Populate recipeStepProgress with accurate 4 steps (Step 1, Step 2, Step 3, Step 4).
     * Only when Step 2 is written, guide them to Step 3 (Multiply each generated number with the factorial variable).
     * Only when Step 3 is written, guide them to Step 4 (Print the final factorial value).
     * Set 'correct': true ONLY when all 4 steps are sequenced!

3. STAGE 3 (INGREDIENTS):
   - EXACT 6 ATOMIC STEPS (STRICT SEQUENCING):
     Step 1: Input variable (e.g. n, a, or num)
     Step 2: Container / accumulator variable initialized to 1 (e.g. fact = 1, b = 1; NEVER 0!)
     Step 3: Loop construct: for loop or while loop
     Step 4: Loop controls: start = 1, end = n, next step = +1 (or start = n, end = 1, next step = -1)
     Step 5: Factorial update inside loop: container = container * i (operators: * and =)
     Step 6: Output / Display statement: print(container) outside the loop!
   - STRICT COMPLETION RULE:
     * Set 'correct': true ONLY when ALL 6 steps (including Step 6: Print / Output statement) are present!
     * If the student has completed Step 5 (or asked why a=a*i is done) but has NOT yet written the print statement (Step 6):
       -> Set 'correct': false!
       -> Step 6 is NOT completed!
       -> If they asked a conceptual question (e.g. "Why we do a=a*i"), answer warmly as Coach Maara explaining why the running product is updated, AND then guide them to add the final ingredient: Step 6 to print the result!
   - HUMAN-TOUCH & COACHING GUIDELINES:
     * Speak warmly as Coach Maara, like an encouraging personal tutor having an open dialogue with the student.
     * Recognize the student's own chosen variable names! If they used 'b' for input and 'a' for container, address them by their chosen names 'b' and 'a'.
     * ZERO CONTAINER MISTAKE: If the student initializes their container to 0 (e.g. b = 0, fact = 0):
       -> Set 'correct': false!
       -> Step 2 is NOT completed!
       -> Gently guide them with Socratic reasoning: ask what happens when they repeatedly multiply by 0 (0 \xD7 1 = 0, 0 \xD7 2 = 0), and ask what number the container should start with instead.
     * LOOP CONTROLS (STEP 4) STRICT RULES:
       -> Loop controls must form a valid sequence to multiply numbers between 1 and the input variable (e.g. from 1 up to input with step +1, OR from input down to 1 with step -1).
       -> If the student writes Start and Stop as the SAME value (e.g. Start: b, Stop: b; or Start: 1, Stop: 1):
          - Step 4 is NOT completed! Set 'correct': false!
          - Point out that starting at 'b' and stopping at 'b' means the loop cannot cycle through the numbers.
          - Since they chose next step '--' to count down from 'b', ask where the loop should stop so it reaches the end of the factorial chain (down to 1).
          - DO NOT mark Step 4 as identified, and DO NOT jump to Step 5 (fact = fact * i) yet!
       -> If the student specifies a step direction that opposes the range (e.g. Start: 1, Stop: b with step: --; or Start: b, Stop: 1 with step: ++):
          - Step 4 is NOT completed! Set 'correct': false!
          - Guide them on the correct step direction.
     * SEQUENCING PROGRESSION:
       -> When Step 1 is done, guide them to Step 2 (container variable = 1).
       -> When Step 1 & 2 are done, guide them to Step 3 (loop construct).
       -> When Step 1, 2, & 3 are done, guide them to Step 4 (loop controls: start, end, next step). DO NOT jump to Step 5 yet!
       -> When Step 1, 2, 3, & 4 are done, guide them to Step 5 (operation inside loop).
       -> When Step 1, 2, 3, 4, & 5 are done, guide them to Step 6 (print/output statement outside the loop).
     * Avoid mechanical, rigid backend phrasing. Craft your response as genuine conversational mentoring with human warmth.
   - If student uses addition (fact = fact + i or b = b + i), set 'correct': false and explain why factorial needs multiplication.

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Concept: Executable prototype code (in Python, JavaScript, Java, C++, etc.) assembling all verified ingredients for Factorial.
   - EXACT 5 ATOMIC CODE STEPS:
     Step 1: Input variable declaration / input read (e.g. n = 5, b = 5, n = int(input()))
     Step 2: Accumulator / container variable initialized to 1 (e.g. fact = 1, a = 1, prod = 1; NEVER 0!)
     Step 3: Loop construct iterating through the numbers from 1 to the input limit (e.g. for (let i = 1; i <= n; i++), for i in range(1, n + 1):, while (i <= n))
     Step 4: Factorial accumulation inside loop body: fact = fact * i (or a = a * i, fact *= i)
     Step 5: Output statement to print/display the final factorial result outside the loop: print(fact) (or print(containerName), console.log(fact)). CRITICAL: Never print the input variable (e.g. print(a) or print(n)) or loop counter (print(i))!
   - AI HUMAN-TOUCH & COACHING GUIDELINES (COACH MAARA):
     * Speak warmly as Coach Maara, like an encouraging personal tutor having an open dialogue with the student.
     * Recognize and honor the student's chosen variable names from earlier stages! If they used 'b' for input and 'a' for container, address them by 'b' and 'a'.
     * CRITICAL - WRONG OUTPUT VARIABLE MISTAKE:
       If the student prints their input variable (e.g. print(a) when 'a' is input and 'b' is container, or print(n)) or prints the loop counter (e.g. print(i)):
       - DO NOT set 'correct': true! You MUST set 'correct': false!
       - Step 5 is NOT completed (completed: false, current: true)!
       - Coach them warmly: "Take a close look at your last line where you wrote \`print({inputName})\`! Variable \`{inputName}\` holds your starting input number, whereas your running factorial product is stored in variable \`{containerName}\`! If you print \`{inputName}\`, you will just see the input number instead of the final factorial calculation. Update your output to: \`print({containerName})\`".
     * MANDATORY LOOP CODE EXAMPLES (USER DIRECTIVE):
       Whenever the student mentions they do not know how to write a loop (e.g. "i did not know how to write loop", "loop theriyala", "how to write loop", "loop example"), asks about syntax, or when they are at Step 3 with loop missing:
       YOU MUST ALWAYS INCLUDE A CONCRETE MULTI-LANGUAGE CODE EXAMPLE BLOCK (Python, JavaScript, Java/C) USING THE STUDENT'S CHOSEN VARIABLE NAME!
       DO NOT merely describe the loop conceptually in conversational words. You MUST show the code example:
       "Here is how you can write the loop using your variable \`{inputName}\`:

       \u{1F40D} **Python:**
       \`\`\`python
       for i in range(1, {inputName} + 1):
       \`\`\`

       \u{1F4BB} **JavaScript:**
       \`\`\`javascript
       for (let i = 1; i <= {inputName}; i++) {
       }
       \`\`\`

       \u2615 **Java / C / C++:**
       \`\`\`java
       for (int i = 1; i <= {inputName}; i++) {
       }
       \`\`\`"
     * ANSWER CONCEPTUAL & SYNTAX QUESTIONS WARMLY:
       If the student asks syntax questions (e.g. "how to write for loop in python", "syntax error", "how to write while loop", "why we do a=a*i", "what does i++ mean"), answer warmly as Coach Maara with clear, simple, human-friendly examples, AND then encourage them on what code line to write next.
     * ZERO CONTAINER MISTAKE: If initialized to 0 (fact = 0 or a = 0), gently explain why 0 \xD7 anything stays 0, and suggest starting at 1.
     * ADDITION MISTAKE: If using + or += (fact = fact + i or a += i), explain that factorial calculates the running product with *.
     * MULTIPLYING BY N MISTAKE: If fact = fact * n, explain that n is the fixed limit and they need to multiply by the loop counter i which visits each number.
     * PYTHON RANGE MISTAKE: If range(1, n), explain that Python ranges stop before the end number and need range(1, n + 1).
     * LOOP SYNTAX: If semicolons or colons are misplaced, gently show the clean loop structure.
     * SEQUENCING PROGRESSION:
       - If Step 1 or 2 missing -> Guide them to declare input and accumulator = 1.
       - If loop missing -> Guide them to write loop from 1 to input.
       - If product update missing -> Guide them to update the container inside the loop.
       - If print missing -> Guide them to display the result outside the loop.
       - If all 5 steps are present and correct -> Set 'correct': true, celebrate warmly, and announce they have successfully tasted the sample and are ready to run their code!
     * Populate 'sampleCodeStepProgress' tracking all 5 steps (Input, Accumulator, Loop, Product Update, Output).
`;
    } else if (problemType === "divisor-of-a-number") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Challenge: Divisors of a Number" (problem04)
Concept: Finding all divisors of a number (iterating from 1 to n with modulo division to test for remainder 0)
Grounded in Firebase structure hints/problem04.

1. STAGE 1 (LOGIC):
   - Concept: Divisors of a number are all integers that divide the number completely without leaving a remainder (remainder == 0).
   - Example with 6: test numbers 1, 2, 3, 4, 5, 6:
     \u2022 6 / 1 leaves remainder 0 (Divisor)
     \u2022 6 / 2 leaves remainder 0 (Divisor)
     \u2022 6 / 3 leaves remainder 0 (Divisor)
     \u2022 6 / 4 leaves remainder 2 (Not a divisor)
     \u2022 6 / 5 leaves remainder 1 (Not a divisor)
     \u2022 6 / 6 leaves remainder 0 (Divisor)
     -> Divisors of 6 are: 1, 2, 3, 6.
   - COMMON MISCONCEPTIONS TO ADDRESS WITH HUMAN TOUCH:
     * Multiples confusion (e.g., listing 12, 18, 24 for 6): Explain that those are multiples! Divisors can never be larger than the number itself; they always lie between 1 and the given number.
     * Starting from 0: Explain that in math, dividing any number by 0 is impossible/undefined. Always start testing from 1.
     * Quotient vs. Divisor (e.g., "6 / 2 = 3 so only 3 is divisor"): Explain that 3 is the quotient, but BOTH 2 and 3 are divisors because both divide 6 with remainder 0.
     * Multiplication/Addition: Explain that multiplication makes numbers larger; we must test using division and check the remainder.
     * Dividing test number by given number (order reversed): Order matters! Divide the given number n by the testing number i (n % i), not i % n.
     * Remainder 1 or more: If remainder is 1 or more, it is not divisible completely. A divisor must leave remainder exactly 0.
     * Only dividing by 2: Dividing by 2 only checks if 2 is a divisor. We must test every number from 1 up to the number.
   - MANDATORY REQUIREMENT: THE STUDENT MUST EXPLICITLY MENTION WHICH NUMBERS ARE DIVISIBLE / THE DIVISORS!
     * IF THE STUDENT ONLY WROTE MODULO EQUATIONS OR TEST CALCULATIONS (e.g. n=5, 5%1=0, 5%2=3, 5%3=2, 5%4=1, 5%5=0) WITHOUT STATING WHICH NUMBERS ARE THE DIVISORS:
       -> DO NOT APPROVE! Set 'correct': false!
       -> Check for arithmetic errors in their modulo calculations (e.g. 5%2 is 1, not 3).
       -> Tell the student: "You tested the numbers with modulo %, but you haven't mentioned which numbers are actually the divisors! Look at where remainder is 0: which numbers divide n completely? Please state the divisors (e.g. 'Divisors of 5 are 1 and 5' or '1, 5 are divisible') to complete your logic!"
     * ONLY AFTER the student explicitly mentions which numbers are divisible (the divisors) for their input:
       -> Verify that the divisors they mentioned are correct!
       -> Set 'correct': true, congratulate warmly, confirm the divisors, and guide to Recipe stage!

2. STAGE 2 (RECIPE):
   - Concept: Human-readable algorithmic recipe in plain English without programming words (no loop, for, while, i++, code).
   - EXACT 4 ATOMIC STEPS:
     Step 1: Get the input number (n)
     Step 2: For every number from 1 up to the given number (starts from 1, NOT 0; up to the given number, NOT stopping before it)
     Step 2.1: Check if dividing the given number by the current number leaves a remainder of 0
     Step 2.2: If the remainder is 0, record / display the current number as a divisor (do NOT stop or break; continue testing until n)
   - COMMON RECIPE MISTAKES TO GUIDE:
     * Starting from 0: Change starting number from 0 to 1 because dividing by 0 is impossible.
     * Stopping before given number: Remind that every number divides itself, so include the number itself.
     * Writing down all numbers: Remind to check remainder 0 before writing down.
     * Stopping after first divisor: Remind not to stop because numbers have multiple divisors.
   - When all 4 steps are sequenced: Set 'correct': true and proceed to Ingredients!
   - Populate 'recipeStepProgress' with all 4 steps.

3. STAGE 3 (INGREDIENTS):
   - EXACT 4 ATOMIC INGREDIENTS:
     Step 1: Variable n for input number
     Step 2: For loop with Start: 1 (i), Stop: n (i <= n), Step: +1
     Step 2.1: If condition with modulo operator: if (n % i == 0)
     Step 2.2: Print statement to display the divisor i (e.g. print(i))
   - COMMON INGREDIENTS MISTAKES TO CATCH:
     * IF CONDITION VS. LOOP CONFUSION:
       If the student writes "if condition start=1, stop=n, step=+1" or associates start, stop, or step with an "if condition", STOP and call out this exact mistake!
       Explain warmly: "In programming, an 'if condition' does NOT have a start, stop, or step. An 'if condition' only tests a condition (such as checking if remainder is 0). What has Start: 1, Stop: n, and Step: +1 is actually a LOOP (For Loop)! In Step 2, change 'if condition' to 'For loop'."
     * HOW TO EXPLAIN / HINT THE IF CONDITION (L.S & R.S BREAKDOWN):
       When guiding the student on writing the if condition (e.g. after loop is identified, or when student asks "how to write if condition", "Step 3: now how to write if condition", or when stuck on Step 2.1 / if condition):
       You MUST explain using Left Side (L.S) and Right Side (R.S) of the operator, exactly like in odd/even:
       "In an If condition, we have two sides: Left side & Right side of the operator:
       \u2022 Left Side (L.S) : n % i (calculates remainder when input n is divided by loop counter i)
       \u2022 Operator : == (equality comparison)
       \u2022 Right Side (R.S) : 0 (checks if remainder is 0)
       So your 'if condition' looks like this: if (n % i == 0)"
     * Loop starts from 0 (i = 0): Error: n % 0 is division by zero! Must start at 1.
     * Loop stops at i < n: Error: misses n as a divisor! Must use i <= n.
     * Single = in condition (n % i = 0): Error: single = assigns, use == for equality comparison.
     * Reversed order (i % n == 0): Error: divide n by i, so use n % i == 0.
     * Quotient check (n / i == 0): Error: use modulo % to check remainder.
     * Printing input n (print(n)): Error: will print n repeatedly instead of divisor i; use print(i).
   - Set 'correct': true ONLY when all 4 ingredients are identified!
   - Populate 'ingredientsStepProgress' with all 4 steps.

4. STAGE 4 (TASTE THE SAMPLE / SAMPLE CODE):
   - Prototype code assembling verified ingredients:
     \`\`\`javascript
     var n = 6;
     for (var i = 1; i <= n; i++) {
       if (n % i == 0) {
         print(i);
       }
     }
     \`\`\`
   - EXACT 4 ATOMIC CODE STEPS:
     Step 1: Input variable declaration (e.g. var n = 6;, n = int(input()))
     Step 2: Loop from 1 to n (e.g. for (var i = 1; i <= n; i++), for i in range(1, n + 1):)
     Step 3: Modulo condition checking divisibility (if (n % i == 0))
     Step 4: Output statement printing divisor i inside if block (print(i);)
   - CRITICAL MENTOR DIRECTIVES & HUMAN TOUCH ERROR ANALYSIS:
     * When analyzing student's latest code line, identify any exact syntax or logical misconception and explain it as Coach Maara with warm empathy:
     * DIVISION OPERATOR (/) INSTEAD OF MODULO (%):
       If student wrote if(a/i==0) or if(n/i==0) or used / in condition:
       Explain: "You wrote if(a/i==0). In programming, the / operator calculates the quotient (e.g. 5 / 1 = 5, not 0), while % calculates the remainder. To test if a number divides evenly with remainder 0, use the modulo operator %: if (a % i == 0)!"
     * REVERSED OPERANDS IN IF:
       If student wrote if(i%a==0) or if(i/a==0):
       Explain: "You wrote if(i%a==0). Remember order matters: we test if the input number a is divided by the testing counter i (a % i == 0), not i % a!"
     * SINGLE EQUALS (=) IN IF:
       If student wrote if(a%i=0):
       Explain: "In programming, single = assigns a value. To compare if remainder equals 0, use the equality comparison operator == (if (a % i == 0))!"
     * LOOP BUGS:
       - Starting from a with i <= 1 (for(i=a; i<=1; i++)): Explain why loop condition is immediately false and instruct to count from 1 to a (for(var i=1; i<=a; i++)).
       - Starting from 0 (i = 0): Division by zero error!
       - Decrement (i--): Infinite loop counting into negatives!
     * PRINT BUGS:
       - Printing input (print(a)): Explain that printing a prints the same number repeatedly instead of each divisor i; use print(i).
       - Break in loop: Logic bug stopping after first divisor!
   - Populate 'sampleCodeStepProgress' with all 4 steps.
   - Set 'correct': true ONLY when all 4 steps are correct!
`;
    } else if (problemType === "multiplication-table") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Multiplication Table of a Number" (CTC Pedagogy Matrix)
Concept: Sequential Multiplication & Repetition (Product = Given Number \xD7 Multiplier)

1. STAGE 1 (LOGIC):
   - Definition: A multiplication table shows the product of a fixed number multiplied sequentially by consecutive numbers from 1 to 10.
   - Core mathematical formula: Result = Given Number \xD7 Multiplier (e.g., for 5: 5x1=5, 5x2=10... 5x10=50).
   - COMMON MISCONCEPTIONS & HOW TO RESPOND:
     * Don't Know / Puriyala: "Multiplication is repeated addition. For table 5: 5 x 1 = 5, 5 x 2 = 10, 5 x 3 = 15... up to 5 x 10 = 50. How does each step produce the result?"
     * Repeated Addition (n + i): "While multiplication is repeated addition, for any step (like step 4), we multiply the given number directly by the step multiplier: 5 x 4 = 20."
     * Division/Modulo Error: "Division splits a number or finds remainders. To build a multiplication table, we must multiply the given number with consecutive multipliers (1, 2, 3...)."
     * Starting at 0: "Multiplying by 0 gives 0 (5 x 0 = 0). Standard multiplication tables start from 1 up to a specified limit (like 10 or 12)."
     * Single Value Error (just multiply by 10): "Multiplying only by 10 gives a single value (50). A table requires calculating and showing the product for every consecutive number from 1 to 10."
     * Base Number Error: "The main table number stays constant (e.g. 5). It is the multiplier that changes consecutively (1, 2, 3, 4...)."
     * Concrete values (e.g. 5 * 1 = 5, 5 * 2 = 10): Acknowledge and guide: "Great example! The table number stays fixed while multiplier increases from 1 to 10. Proceed to Recipe!"
   - Success Path: When student describes keeping given number fixed and multiplying sequentially from 1 to 10, mark correct: true!

2. STAGE 2 (RECIPE):
   - ATOMIC 4-STEP ALGORITHM (Natural English without programming keywords):
     Step 1: Get the input number for the table
     Step 2: Take multiplier numbers starting from 1 up to 10
     Step 2.1: Multiply the input number by the current multiplier
     Step 2.2 / 2.3: Display the multiplier and the calculated product, repeat until multiplier reaches 10
   - COMMON RECIPE MISTAKES:
     * Code keywords (for, i++, print): Remind to write in plain human English.
     * Starting at 0: "Standard tables start from 1. Adjust your starting multiplier from 0 to 1."
     * Single step (multiply by 10): "You need to repeat the calculation for every multiplier from 1 to 10, not just the last number."
     * Early stop: "Do not stop after one multiplier! Continue the repeating process until all multipliers up to 10 are completed."
   - Populate 'recipeStepProgress' with all 4 steps.

3. STAGE 3 (INGREDIENTS):
   - EXACT 4 ATOMIC INGREDIENTS:
     Step 1: Variable n for the table number (students may choose any name: a, n, num, x)
     Step 2: For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)
     Step 2.1: Variable to store calculation (product = n * i, result = a * i)
     Step 2.2: Print statement inside the loop showing the output
   - COMMON INGREDIENTS MISTAKES:
     * Loop Start 0: "Multiplication tables start at 1. Initialize your loop counter with i = 1."
     * Loop Bounds (i < 10): "If you write i < 10, the loop stops at 9, missing the 10th row! Use i <= 10 (or Stop at 10 inclusive)."
     * Loop Step Decrement (step: -1): "Since your loop starts at 1 and counts up to 10, decrementing with -1 will go into negative numbers! Use step: +1."
     * Wrong Operator (product = n + i): "That performs addition! To calculate the table value, use multiplication: product = n * i."
     * Print Outside Loop: "If print is outside the loop, it will only print the very last product (50). Place print inside the loop to display all 10 rows!"
   - Populate 'ingredientsStepProgress' with all 4 steps.

4. STAGE 4 (TASTE THE SAMPLE / SAMPLE CODE):
   - Prototype code assembling verified ingredients:
     var n = 5;
     for (var i = 1; i <= 10; i++) {
       var product = n * i;
       print(n + " x " + i + " = " + product);
     }
   - EXACT 4 ATOMIC CODE STEPS:
     Step 1: Input variable declaration (var n = 5;)
     Step 2: For loop from 1 to 10 (for var i = 1; i <= 10; i++)
     Step 3: Multiplication calculation (var product = n * i;)
     Step 4: Formatted print statement inside loop (print(n + " x " + i + " = " + product);)
   - MANDATORY LOOP CODE EXAMPLES (USER DIRECTIVE):
     Whenever the student mentions they do not know how to write a loop (e.g. "how to write loop from 1 to 10", "i didn't know how to write example", "loop theriyala", "how to write loop", "loop syntax"), asks for an example, or when Step 2 (Loop from 1 to 10) is missing:
     YOU MUST ALWAYS PROVIDE A CONCRETE MULTI-LANGUAGE CODE EXAMPLE BLOCK (JavaScript and Python) in your response!
     "Here is how you can write the loop from 1 to 10:

     \u{1F4BB} **JavaScript / C / Java:**
     \`\`\`javascript
     for (let i = 1; i <= 10; i++) {
     }
     \`\`\`

     \u{1F40D} **Python:**
     \`\`\`python
     for i in range(1, 11):
     \`\`\`"
   - COMMON CODE BUGS TO DETECT:
     * i = 0: "Table start bug: The loop starts at 0, printing 5 x 0 = 0. Change initialization to var i = 1."
     * i < 10: "Boundary bug: i < 10 stops at 9! Change condition to i <= 10 to include the 10th row."
     * n + i: "Calculation bug: n + i adds the numbers (giving 6, 7, 8...). Use n * i for multiplication."
     * n = n * i (overwrite n): "Variable overwrite bug: Modifying n inside the loop changes the base table number exponentially! Keep n constant and multiply n * i into a separate product variable."
     * Print outside loop: "Placement bug: Placing print outside the loop only displays the final product (50). Move print inside the loop block to print all 10 lines."
     * Break in loop: "Loop termination bug: break stops the loop immediately after the 1st line. Remove break so the table runs up to 10."
   - Populate 'sampleCodeStepProgress' with all 4 steps.
`;
    } else if (problemType === "even-numbers-1-to-50") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Print Even Numbers from 1 to 50" (CTC Pedagogy Matrix)
Concept: Loop iteration (1 to 50) and modulo divisibility (i % 2 == 0) or step of 2

1. STAGE 1 (LOGIC):
   - Definition: Even numbers are numbers divisible by 2 with remainder 0 (number % 2 == 0).
   - Range: Between 1 and 50, the even numbers are 2, 4, 6, 8, ... up to 50.
   - When student describes divisibility by 2 with remainder 0 or shows even numbers in range 1 to 50, mark correct: true!

2. STAGE 2 (RECIPE):
   - 4-STEP ALGORITHM (Natural English without programming keywords):
     Step 1: Start counting numbers from 1 up to 50
     Step 2: Check if current number is divisible by 2 with remainder 0
     Step 3: If it is divisible by 2, display that number
     Step 4: Repeat until reaching 50
   - Populate 'recipeStepProgress' with all 4 steps.

3. STAGE 3 (INGREDIENTS):
   - CRITICAL MANDATORY REQUIREMENT: A LOOP FROM 1 TO 50 IS MANDATORY!
   - If the student only writes "variable a" and an if condition WITHOUT defining a loop from 1 to 50, IT IS STRICTLY INCOMPLETE. You MUST set correct: false and guide them:
     "🌟 Coach Maara note: You have set up the even check nicely! But remember, our challenge is to print even numbers from 1 to 50, so we need a Loop to iterate through all numbers.
     Let's define a For loop with Start: 1 (or 2), Stop: 50 (i <= 50), Step: +1 (or +2)!"
   - ATOMIC INGREDIENTS:
     Step 1: For loop with Start: 1 (or 2), Stop: 50 (i <= 50), Step: +1 (or +2)
     Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0
     Step 3: Print statement inside loop: print(i)
   - Populate 'ingredientsStepProgress' with all 3 steps.

4. STAGE 4 (TASTE THE SAMPLE / SAMPLE CODE):
   - Prototype code:
     for (let i = 1; i <= 50; i++) {
       if (i % 2 === 0) {
         console.log(i);
       }
     }
   - Must have loop up to 50, modulo 2 check (or step of 2), and print statement.
`;
    } else if (problemType === "even-numbers-1-to-50") {
        if (section === "logic") {
          const evenLog = validateEvenNumbers1To50Logic(userInput);
          diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (EVEN NUMBERS 1 TO 50 - LOGIC):
- Student Intent: "${evenLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified Status: ${evenLog.isFullyVerified}
- INSTRUCTION FOR COACH MAARA: Even numbers leave remainder 0 when divided by 2 (number % 2 == 0) from 1 to 50.
`;
        } else if (section === "recipe") {
          const evenRec = validateEvenNumbers1To50Recipe(userInput);
          diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (EVEN NUMBERS 1 TO 50 - RECIPE):
- Student Intent: "${evenRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Progress: Step 1 (Count 1..50): ${evenRec.hasStep1}, Step 2 (Divisible by 2): ${evenRec.hasStep2}, Step 3 (Display even): ${evenRec.hasStep3}, Step 4 (Repeat): ${evenRec.hasStep4}
- INSTRUCTION FOR COACH MAARA: Deliver in plain everyday English without code keywords.
`;
        } else if (section === "ingredients") {
          const evenIng = validateEvenNumbers1To50Ingredients(userInput);
          diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (EVEN NUMBERS 1 TO 50 - INGREDIENTS):
- Student Intent: "${evenIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Progress: Loop: ${evenIng.hasLoop}, Even Check: ${evenIng.hasEvenCheck}, Print: ${evenIng.hasPrint}
- INSTRUCTION FOR COACH MAARA:
1. CRITICAL: A loop from 1 to 50 is MANDATORY! If student does not have a loop, set correct: false and guide them to define the For loop!
2. Even condition: Left Side: i % 2, Operator: ==, Right Side: 0.
3. Print statement inside loop: print(i).
`;
        } else if (section === "samplecode") {
          const evenSample = validateEvenNumbers1To50SampleCode(userInput);
          diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (EVEN NUMBERS 1 TO 50 - SAMPLE CODE):
- Verified: ${evenSample.isFullyVerified}
- INSTRUCTION FOR COACH MAARA: Ensure student writes loop from 1 to 50 with if (i % 2 == 0) and print(i).
`;
        }
      } else if (problemType === "prime-number") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Prime Number Checker"
Concept: Divisibility & Factor Counting
1. STAGE 1 (LOGIC):
   - A prime number is greater than 1 with exactly two positive divisors: 1 and itself.
   - For a prime number (e.g. n = 5 or n = 7), dividing by numbers from 1 to n using modulo % gives remainder 0 EXACTLY 2 times (at 1 and n).
   - If the student tests a composite number (like n = 6 or 4 or 8), point out that 6 has 4 zero remainders (divisors: 1, 2, 3, 6), which proves 6 is a composite number (not prime). Ask them to test an actual prime number (such as 5, 7, or 3) with modulo % from 1 to n to prove the 2-zero-remainder rule.
   - If equations contain arithmetic errors (e.g. 6%4=1 instead of 2), point out the arithmetic error.
   - If equations use wrong operators (like / instead of %), guide them to use modulo %.
2. STAGE 2 (RECIPE):
   - Step 1: Get input number n from the user
   - Step 2: Initialize divisor count as 0
   - Step 3: Check every number from 1 to n and test remainder using %
   - Step 4: If remainder is 0, increment divisor count by 1
   - Step 5: If divisor count is exactly 2, display Prime; otherwise display Not Prime
3. STAGE 3 (INGREDIENTS):
   - EXACT 6 ATOMIC INGREDIENTS:
     Step 1: Input variable n (e.g. use n variable)
     Step 2: Divisor counter variable count = 0 (e.g. use variable count = 0)
     Step 3: For loop with start = 1, end = n, next step = +1 (e.g. use for loop: start (1), end (n), next step (+1))
     Step 4: Divisibility test condition using modulo: left side (n % i), operator (==), right side (0)
     Step 5: Increment count variable: count = count + 1 (or increment count)
     Step 6: Final decision condition: if count == 2 display Prime else display Not Prime
   - CRITICAL INGREDIENT FORMAT RULE (NO RAW CODE SYNTAX):
     In Stage 3 Ingredients, the student is identifying abstract programming constructs.
     DO NOT push full raw programming language code syntax (like JavaScript "for (var i = 1; i <= n; i++)") in your clues or suggested inputs.
     Always format clues and suggested inputs in clean ingredient structure:
     \u2022 For Loop: use for loop (start: 1, end: n, next step: +1)
     \u2022 If Condition: use if condition (left side: n % i, operator: ==, right side: 0)
   - HOW TO EXPLAIN THE FOR LOOP (START, STOP, NEXT STEP BREAKDOWN):
     When student writes "use for loop", asks "where does loop start", "what is stop", "what is next step", or is stuck on Step 3:
     You MUST break down the loop into 3 parts:
     "In a For loop ingredient, we specify 3 parts:
     \u2022 Start value : 1 (where testing begins)
     \u2022 Stop/End value : n (where testing stops)
     \u2022 Next step : +1 (how loop advances to test each number)
     So specify:
     use for loop
       start (1),
       end (n), and
       next step (+1)"
   - HOW TO EXPLAIN THE IF CONDITION (L.S & R.S BREAKDOWN):
     When student writes "use if condition", asks "what is leftside of condition", "what is left side", "what is right side", "what operator", "how to write if condition", or is stuck on Step 4:
     You MUST break down the condition into Left Side (L.S) and Right Side (R.S):
     "In an If condition ingredient, we specify:
     \u2022 Left Side (L.S) : n % i (calculates the remainder when input number n is divided by loop counter i using modulo %)
     \u2022 Operator : == (equality comparison)
     \u2022 Right Side (R.S) : 0 (checks if remainder is 0)
     So specify:
     use if condition
       left side (n % i)
       operator (==)
       right side (0)"
   - Set 'correct': true ONLY when all 6 ingredients are identified!
   - Populate 'ingredientsStepProgress' with all 6 steps.
4. STAGE 4 (SAMPLE CODE):
   - Assemble the prototype code with input, count=0, loop, condition, increment, and final print.
`;
    } else if (problemType === "next-prime-number") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Next Prime Number"
Concept: Incremental Search & Primality Testing
1. STAGE 1 (LOGIC):
   - Definition: The next prime number is the smallest prime strictly greater than n (candidate starts at n + 1).
   - ACCEPTANCE RULE (CRITICAL):
     If the user explains the concept completely and correctly, EITHER through THEORY or through MATHEMATICS, you MUST mark 'correct': true!
     * Theory explanation: Explaining that prime numbers only have divisors 1 and itself (2 distinct divisors), and to find the next prime for input n, we start from candidate n + 1 (the next number) and check each consecutive number for primality, stopping at the first prime found.
     * Mathematical explanation: Providing mathematical steps/examples (e.g., for n = 7: candidate = 8 (composite: 8%2=0), 9 (composite: 9%3=0), 10 (composite: 10%2=0), 11 (prime!). The next prime is 11) or divisor ranges (testing candidate % i == 0 for all i from 2 to candidate - 1).
     * Any clear, correct conceptual explanation in English, Tanglish, or mathematical expressions must be approved with 'correct': true.
   - Fallacy checks (Mark correct: false ONLY for real fallacies):
     * Next prime of 7 is 7 -> WRONG: Must be strictly greater than n! Start from n + 1.
     * Just add 1 or 2 -> WRONG: Adding fixed number does not guarantee prime (7+2=9 not prime). Must test each candidate.
     * Input 0 or 1 -> If n <= 1, next prime is 2.
2. STAGE 2 (RECIPE):
   - Sequential steps:
     Step 1: Get input number n
     Step 2: Start candidate number as n + 1 (if candidate < 2, candidate = 2)
     Step 3: Check if candidate number is prime
     Step 3.1: If candidate is prime, display candidate as next prime and stop
     Step 3.2: If candidate is not prime, increase candidate by 1 and repeat from Step 3
   - Set 'correct': true ONLY when all steps are sequenced!
   - Populate 'recipeStepProgress' with all steps.
3. STAGE 3 (INGREDIENTS):
   - Components needed (Supports BOTH Two Divisors Count method AND isPrime Flag method):
     Step 1: Variables a (or n) for input number, b = a + 1 (or candidate = n + 1)
     Step 2: Outer search for loop (Start: b, Stop/End: infinite / until prime found, Next Step: +1)
     Step 3: Prime check loop & count (Start: 1, Stop/End: b (or candidate), Next Step: +1, count = 0) OR isPrime = true (Start: 2, Stop/End: b - 1, Next Step: +1)
     Step 4: If condition inside loop: Left side: b % i (or candidate % i or b % j), Operator: ==, Right side: 0, Action: count = count + 1 (or isPrime = false; break;)
     Step 5: Decision after inner loop: Left side: count, Operator: ==, Right side: 2, Action: print(b); break;
   - CRITICAL INGREDIENT DECOMPOSITION RULES:
     * CRITICAL FOR STEP 3 & STEP 4 (PLACEMENT OF COUNT = 0):
       'count = 0' must be initialized in Step 3 BEFORE the inner loop begins (so each candidate starts fresh with 0 divisors).
       Inside the if condition in Step 4, when remainder is 0 ('b % j == 0'), the action is 'count = count + 1' (or 'count++').
       If the student places 'count = 0' inside/after the if condition, as the action of the if condition, or in Step 5, you MUST NOT mark it correct! Point out with clarity that 'count = 0' resets before the inner loop in Step 3, while Step 4 increments the count ('count = count + 1').
     * IMPORTANT FOR TWO DIVISORS METHOD (Start: 1, End: b):
       Prime numbers have EXACTLY TWO DIVISORS (1 and the number itself).
       Therefore, STARTING AT 1 AND ENDING AT b (inclusive) with 'count = 0' and 'count = count + 1' IS 100% VALID AND CORRECT!
       NEVER tell the student that starting at 1 is wrong or ask them to start at 2 when they are counting divisors from 1 to b!
     * WHEN A STUDENT MENTIONS 'FOR LOOP' OR 'USE FOR LOOP' (e.g. 'Step 2: For loop' or 'Step 3: For loop'):
       You MUST NOT jump to the next step or mark it complete! Instead, prompt them to specify its 3 core parts:
       \u2022 Start: where loop starts (e.g. 'start (b)' or 'start (1)')
       \u2022 End / Stop: when loop stops (e.g. 'end (infinite / until prime found)' or 'end (b)')
       \u2022 Next Step: how it advances ('next step (+1)')
     * FOR STEP 3 INNER LOOP: If the student writes 'End: a', explain with empathy that 'a' is the original input, but we are testing candidate 'b', so the loop must end at 'End: b'!
     * WHEN A STUDENT MENTIONS 'IF CONDITION' OR 'USE IF CONDITION' (e.g. 'Step 4: If condition'):
       You MUST NOT jump to the next step! Instead, prompt them to decompose the condition into:
       \u2022 Left side (L.S): remainder expression (b % i or candidate % i)
       \u2022 Operator: comparison operator (==). IF THE STUDENT WRITES SINGLE EQUAL ('operator: ='), explain that '=' is for assigning values, and they must use '==' (double equals) for checking equality in conditions!
       \u2022 Right side (R.S): value compared to (0)
       \u2022 Action: count = count + 1 (or isPrime = false; break;)
   - Set 'correct': true ONLY when all ingredients are identified!
   - Populate 'ingredientsStepProgress' with all steps.
4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Full prototype assembly with input, outer search for loop, inner loop (either count = 0 from 1 to b, or isPrime = true from 2 to b - 1), modulo condition, and print with break.
   - Detect student bugs:
     * candidate starting at n (returns same number if n is prime) -> Guide to start candidate at n + 1
     * inner loop starting at 0 -> Division by zero error (b % 0)!
     * isPrime / count initialized outside outer search loop -> Guide to reset inside outer search loop for each candidate
     * missing break after print -> Loop keeps searching subsequent primes!
`;
    } else if (problemType === "prime-between-range") {
      problemSpecificDirectives = `
 PROBLEM FOCUS: "Prime Numbers in a Given Range" (problem07 / Problem 8)
Concept: Range Iteration & Primality Testing (Two Divisors Count Method: count == 2)
1. STAGE 1 (LOGIC):
   - Definition: A prime number is a natural number greater than 1 with exactly two unique divisors (1 and itself).
   - Core Verification Rule:
     * Range Completeness & Boundary Check:
       - If the student specifies a range (e.g. "10 to 15 range"), they MUST only test numbers strictly within that range [10, 15] (e.g. 11, 13). If they test numbers exceeding the range (like 17, 19 > 15), REJECT ('correct': false) and ask them to fix range or remove out-of-range numbers.
       - If the student specifies a range (e.g. "10 to 25 range") and tests prime numbers, they MUST identify ALL prime numbers in that specified range (for 10 to 25: 11, 13, 17, 19, 23). If they miss any prime number (like missing 23), DO NOT APPROVE! Set 'correct': false! Inform them: "You tested 11, 13, 17, 19, but prime number 23 is also in the range 10 to 25. Please test 23 or state the general rule for the range."
     * When a student identifies and verifies all prime numbers in the stated range (e.g. for 10 to 20: 11, 13, 17, 19; for 10 to 15: 11, 13; for 10 to 25: 11, 13, 17, 19, 23 with 2 divisors each) OR states the generalized range iteration rule:
       -> APPROVE! Set 'correct': true! Congratulate them on correctly proving the logic.
     * If a student tests both primes and non-primes (e.g. 11 has 2 divisors, 12 has 6 divisors), or tests individual numbers:
       -> APPROVE! Set 'correct': true! It is NOT mandatory to test all composite/non-prime numbers (like 14, 15, 16, 18, 20).
     * If a student writes the general range rule ("For each number in the range from start to end, count how many numbers from 1 to that number divide it with remainder 0. If divisor count is exactly 2, it is a prime number"):
       -> APPROVE! Set 'correct': true!
     * ONLY reject ('correct': false) if:
       - The student has a fundamental misconception (e.g., claiming 12 is prime, claiming prime numbers have 3 divisors, or stating to sum all divisor counts across the entire range together).
       - The input is completely unrelated, blank, or just asks a question like "what do I do here" without any prime/divisor logic.

2. STAGE 2 (RECIPE):
   - Sequential steps in plain English without code keywords:
     Step 1: Get starting number and ending number (start, end)
     Step 2: Pick each number in the range from start up to end
     Step 3: Start/reset divisor count at 0 for the current number
     Step 4: Test every number from 1 up to the current number (if remainder is 0, count increases by 1)
     Step 5: If divisor count is exactly 2, record / display the current number as prime
     Step 6: Repeat this process for the next number until reaching the ending number
   - When providing 'suggestedInput', ALWAYS provide ONLY the SINGLE NEXT MISSING STEP (e.g. 'Step 1: Get starting number and ending number'). NEVER provide all steps at once!
   - Set 'correct': true ONLY when all 6 steps are sequenced (including repeating across the range)! If partial steps given, identify the missing steps specifically.
   - Populate 'recipeStepProgress' with all steps.
3. STAGE 3 (INGREDIENTS):
   - Components needed:
     Step 1: Variables start and end for range limits, num for range candidate
     Step 2: Outer for loop (Start: start (num), Stop: end (num <= end), Step: +1)
     Step 2.1: Accumulator variable count = 0 INSIDE the outer loop
     Step 2.2: Inner for loop (Start: 1 (i), Stop: num (i <= num), Step: +1)
     Step 2.3: Modulo condition: if (num % i == 0) { count++; }
     Step 2.4: Decision check: if (count == 2) { print(num); }
   - When providing 'suggestedInput', ALWAYS provide ONLY the SINGLE NEXT MISSING INGREDIENT STEP. NEVER provide all steps at once!
   - Set 'correct': true ONLY when all ingredients are identified!
   - Populate 'ingredientsStepProgress' with all steps.
4. STAGE 4 (SAMPLE CODE):
   - Executable nested loop prototype with start, end, outer loop, count = 0 inside outer loop, inner loop from 1 to num, modulo condition count++, and if (count == 2) print(num).
   - Set 'correct': true ONLY when prototype is complete and correct!
`;
    } else if (problemType === "sexy-prime-number") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Sexy Prime Numbers" (Problem 8)
Concept: Prime Number Pairs with Difference of 6 (Both numbers must be prime)

1. STAGE 1 (LOGIC):
   - Definition: Sexy primes are pairs of prime numbers that differ from each other by six (the name comes from 'sex', Latin for six).
   - Examples: (5, 11), (7, 13), (11, 17), (13, 19), (17, 23), (23, 29).
   - Core Logic:
     * A number is prime if it has exactly two divisors (1 and itself).
     * For every candidate number, we check if BOTH the candidate AND the candidate plus six have exactly two divisors.
     * Candidate only needs to be checked up to (limit minus six) so that the companion number does not exceed the limit.
   - When student correctly explains that both numbers must be prime with difference of 6, set 'correct': true!

2. STAGE 2 (RECIPE):
   - ATOMIC 5 STEPS (IN NATURAL EVERYDAY ENGLISH - NO VARIABLE NAMES LIKE p, n, n-6):
     Step 1: Get the upper limit number from the user
     Step 2: For each number starting from 2 up to 6 less than the limit
     Step 3: Check if the first number is a prime number
     Step 4: Check if adding 6 to the number also gives a prime number
     Step 5: If both numbers are prime, display them as a pair
   - CRITICAL USER CONFUSION & QUESTION GUIDELINES ("I DID NOT UNDERSTAND / Puriyala"):
     * When the student says "I DID NOT UNDERSTAND", "puriyala", or asks why we do a step:
       Explain with genuine 1-on-1 human empathy as Coach Maara using simple real-world reasoning!
       Example for Step 2 ("Why 6 less than the limit?"):
       "\u{1F31F} Coach Maara here! Let me explain why we stop at 6 less than the limit with a simple example:
       Suppose our upper limit is 30.
       If we take 24, adding 6 gives 24 + 6 = 30 (which is inside our limit!).
       But if we took 25, adding 6 gives 25 + 6 = 31 (which exceeds our limit 30!).
       That's why our sequence of numbers only needs to go up to 6 less than the limit.
       Now, try writing Step 2 in your worksheet: 'Step 2: For each number starting from 2 up to 6 less than the limit'."
     * Set 'correct': true ONLY when all 5 steps are sequenced.
     * Populate 'recipeStepProgress' with all 5 steps.

3. STAGE 3 (INGREDIENTS):
   - EXACT 5 ATOMIC INGREDIENTS:
     Step 1: Variables limit for upper bound, first candidate, second candidate (first + 6)
     Step 2: Outer for loop (Start: 2, Stop: limit - 6, Step: +1)
     Step 3: Counters count1 = 0 and count2 = 0 for primality checking
     Step 4: Divisor loops and modulo conditions (first % i == 0 and second % j == 0)
     Step 5: Decision check: if (count1 == 2 && count2 == 2) print pair
   - Set 'correct': true ONLY when all 5 ingredients are identified!
   - Populate 'ingredientsStepProgress' with all 5 steps.

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Executable nested loop prototype checking primality for both candidates and displaying the pair when both have count == 2.
   - Set 'correct': true ONLY when code prototype is complete and correct!
`;
    } else if (problemType === "positive-negative") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Positive or Negative Number" (Problem 9)
Concept: Comparison Operators & Multi-way Branching (> , < , ==)

1. STAGE 1 (LOGIC):
   - Concept: Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero (0) is neither positive nor negative.
   - We test the number against 0 using comparison operators (> or <).
   - CRITICAL VERIFICATION RULE:
     The student MUST explain BOTH:
     1. The rule: Positive numbers are greater than 0 (> 0), and Negative numbers are less than 0 (< 0).
     2. Concrete examples: Positive example (e.g. 1, 2, 5) and Negative example (e.g. -1, -2, -5).
     DO NOT set 'correct': true if the student ONLY lists numbers (e.g. "positive: 1, 2, 3, negative: -1, -2, -3") without explaining that positive means greater than 0 and negative means less than 0!
     DO NOT set 'correct': true if the student ONLY gives the definition without example numbers!
   - If the rule or comparison with 0 is missing, prompt them: "You gave examples! What is the rule comparing with 0 (e.g., numbers greater than 0 are positive, numbers less than 0 are negative)?"
   - When comparison rules (> 0, < 0) AND example numbers are both present, set 'correct': true.

2. STAGE 2 (RECIPE):
   - Step-by-step algorithm in natural everyday English (NO CODE WORDS):
     Step 1: Get input number n
     Step 2: If the number is greater than 0, display "Positive"
     Step 3: Else / If the number is less than 0, display "Negative" (and optionally handle Zero)
   - When all steps are present, set 'correct': true!
   - Populate 'recipeStepProgress' with all steps.

3. STAGE 3 (INGREDIENTS):
   - Components needed:
     Step 1: Input variable (Variable n for input)
     Step 2: If condition parts (Left Side L.S: n, Operator: >, Right Side R.S: 0)
     Step 3: Inside 'if' block \u2014 operation to print "Positive"
     Step 4: Inside 'else' block \u2014 operation to print "Negative"
   - CRITICAL VERIFICATION RULE:
     DO NOT mark 'correct': true if the student only writes generic terms like "use if condition" or "use print statement"!
     The student MUST define:
     1. Left Side (L.S: n)
     2. Operator (>)
     3. Right Side (R.S: 0)
     4. Inside 'if' block: print "Positive"
     5. Inside 'else' block: print "Negative"
   - If any of these 4 steps are missing, set 'correct': false and prompt them specifically for the missing part!
   - Populate 'ingredientsStepProgress' with all 4 steps.

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Executable prototype:
     var n = 5;
     if (n > 0) {
       print("Positive");
     } else if (n < 0) {
       print("Negative");
     } else {
       print("Zero");
     }
   - Or simple if-else:
     var n = 5;
     if (n > 0) {
       print("Positive");
     } else {
       print("Negative");
     }
   - Check that variable is declared, comparison against 0 is correct, and print statements are inside branches.
   - Set 'correct': true ONLY when code prototype is complete and correct!
`;
    } else if (problemType === "three-digit-number") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Number is 3-Digit or Not" (Problem 10)
Concept: Relational and Logical Operators (n >= 100 && n <= 999)

1. STAGE 1 (LOGIC):
   - Concept: A 3-digit number has 3 digits and ranges from 100 to 999 inclusive (100 <= n <= 999).
   - Test both boundaries using Logical AND (&& / and): n >= 100 AND n <= 999 (or n > 99 AND n < 1000).
   - MANDATORY EXAMPLES (BOTH ARE REQUIRED):
     1. An example of a 3-digit number (e.g., 250, 456)
     2. An example of a NOT 3-digit number (e.g., 45, 1000)
   - If either or both examples are missing, set 'correct': false and prompt the student specifically for the missing example!
   - Set 'correct': true ONLY when the student explains the range (100 to 999) AND provides BOTH a 3-digit example and a NOT 3-digit example.

2. STAGE 2 (RECIPE):
   - Step-by-step algorithm in natural everyday English (NO CODE WORDS):
     Step 1: Get input number n
     Step 2: Check if n is greater than or equal to 100 and less than or equal to 999
     Step 3: If true, display "3-digit number"
     Step 4: Else, display "Not a 3-digit number"
   - When all steps are present, set 'correct': true!
   - Populate 'recipeStepProgress' with all 4 steps.

3. STAGE 3 (INGREDIENTS):
   - Components needed:
     Step 1: Input variable (Variable n for input)
     Step 2: If condition parts (Left Side / L.S: n, Operators: >= and <=, Right Side / R.S: 100 and 999, Logical Operator: && -> n >= 100 && n <= 999)
     Step 3: Inside 'if' block \u2014 operation to print "3-digit number"
     Step 4: Inside 'else' block \u2014 operation to print "Not a 3-digit number"
   - CRITICAL VERIFICATION RULE:
     The student MUST define:
     1. Input variable n
     2. Condition breakdown (Left Side: n, Operators: >= and <=, Right Side: 100 and 999, Logical Operator: &&)
     3. Operation inside 'if' (print "3-digit number")
     4. Operation inside 'else' (print "Not a 3-digit number")
   - If the student does NOT mention Left Side, Right Side, Operators, or what to print inside 'if' and 'else', you MUST set 'correct': false and ask them for the missing details!
   - Populate 'ingredientsStepProgress' with all 4 steps.

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE):
   - Executable prototype:
     var n = 456;
     if (n >= 100 && n <= 999) {
       print("3-digit number");
     } else {
       print("Not a 3-digit number");
     }
   - Check that variable is declared, compound condition (n >= 100 && n <= 999) is correct, and print statements are inside branches.
   - Set 'correct': true ONLY when code prototype is complete and correct!
`;
    } else if (problemType === "voting-eligibility") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Eligible or Not Eligible to Vote" (Problem 11)
Real-world rule: Minimum voting age is 18 years old.

1. STAGE 1 (LOGIC) - STRICT ZERO CODING WORDS & CONTRADICTION REJECTION:
   - ZERO CODING WORDS ALLOWED!
     Do NOT use: 'operator', '>=', '<=', 'print', 'else', 'if condition', 'var', 'variable', 'code', 'syntax', 'L.S', 'R.S'.
     Express purely in everyday human terms: "18 or older", "at least 18", "younger than 18", "eligible to vote", "not eligible".
   - CONTRADICTION & MISCONCEPTION REJECTION (CRITICAL):
     * If the student claims an age >= 18 (such as 20, 18, 19, or >= 18) is NOT eligible (e.g. "20>=18-->vote is not eligible"):
       -> YOU MUST SET 'correct': false!
       -> Explain kindly: 20 is greater than 18, which means someone aged 20 IS eligible to vote! A person is only not eligible when their age is below 18.
     * If the student claims an age under 18 (such as 16, 17) is eligible:
       -> YOU MUST SET 'correct': false!
     * Both outcomes must be stated correctly without contradiction:
       - Age 18 or older -> Eligible to Vote (e.g., age 20 is eligible)
       - Younger than 18 -> Not Eligible to Vote (e.g., age 16 is not eligible)
     * Set 'correct': true ONLY when the student correctly explains that 18 or older is Eligible, younger than 18 is Not Eligible, with zero contradictions and zero code words!

2. STAGE 2 (RECIPE) - STRICT EVERYDAY ENGLISH (NO CODING WORDS):
   - ZERO CODE WORDS ALLOWED! Do NOT use 'print', 'else', '>=', 'var', 'operator', 'syntax', 'if-else'.
   - Use clean everyday action words: "Take", "Check", "If yes announce...", "Otherwise announce...":
     Step 1: Take the person's age
     Step 2: Check whether age is 18 or older
     Step 3: If yes, announce Eligible to vote
     Step 4: Otherwise, announce Not Eligible
   - CRITICAL BOUNDARY ERROR:
     If the student writes "smaller than or equal to 18 it is not eligible" or "less than or equal to 18 is not eligible" or "<= 18 not eligible" or "18 or younger/less is not eligible":
     -> YOU MUST SET 'correct': false!
     -> Explain: "Look closely at your step: if someone is 18 years old, they ARE eligible to vote! Saying 'smaller than or equal to 18' mistakenly includes 18 in the not-eligible group. You must write strictly 'smaller than 18' (less than 18), or simply 'Otherwise, announce Not Eligible'."
   - If the student writes a contradiction (e.g. if age >= 18 display not eligible), set 'correct': false!
   - When all steps are present and correct, set 'correct': true!
   - Populate 'recipeStepProgress' with all steps.

3. STAGE 3 (INGREDIENTS):
   - Components needed:
     Step 1: Input variable (Variable: age, or any variable declared by student such as 'a', 'x', etc.)
     Step 2: If condition breakdown: Left Side (L.S): <varName>, Operator: >=, Right Side (R.S): 18 -> if (<varName> >= 18)
     Step 3: Inside 'if' block \u2014 operation to print "Eligible"
     Step 4: Inside 'else' block \u2014 operation to print "Not Eligible"
   - STEP-BY-STEP GUIDANCE: Guide the student one single ingredient at a time!
   - CRITICAL: If the student has already written/declared a variable (e.g. 'Step 1: Variable a=25', 'var a = 25', 'Variable age'):
     -> Step 1 IS COMPLETED! Mark Step 1 completed.
     -> NEVER ask them to write Step 1 or define a variable again!
     -> Direct them immediately to Step 2 (Left Side, Operator >=, Right Side 18).
   - Set 'correct': true ONLY when all 4 ingredients are identified!

4. STAGE 4 (SAMPLE CODE):
   - Strict prototype requirement:
     var age = 20;
     if (age >= 18) {
       print("Eligible");
     } else {
       print("Not Eligible");
     }
   - Check that variable is declared, comparison (age >= 18) is correct, quotation marks are used around "Eligible" and "Not Eligible", and 'else' branch is present!
   - Set 'correct': true ONLY when code prototype is complete and correct!
`;
    } else if (problemType === "pass-or-fail") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Pass or Fail Based on Mark" (Problem 12)
Real-world rule: A student passes if their mark is 35 or above (mark >= 35); below 35 is Fail.

1. STAGE 1 (LOGIC) - STRICT ZERO CODING WORDS & CONTRADICTION REJECTION:
   - ZERO CODING WORDS ALLOWED!
     Do NOT use: 'operator', '>=', '<=', 'print', 'else', 'if condition', 'var', 'variable', 'code', 'syntax', 'L.S', 'R.S'.
     Express purely in everyday human terms: "35 or more", "at least 35", "less than 35", "Pass", "Fail".
   - CONTRADICTION & MISCONCEPTION REJECTION (CRITICAL):
     * If the student claims a mark >= 35 (such as 35, 40, 50) is Fail:
       -> YOU MUST SET 'correct': false!
       -> Explain kindly: 35 or above is a passing mark! A student only fails when their score is below 35.
     * If the student claims a mark under 35 (such as 20, 30) is Pass:
       -> YOU MUST SET 'correct': false!
     * If the student writes "35 or less is fail":
       -> YOU MUST SET 'correct': false! Mark 35 is PASS, not fail!
     * Both outcomes must be stated correctly:
       - Mark 35 or above -> Pass
       - Below 35 -> Fail
     * Set 'correct': true ONLY when the student correctly explains that 35 or above is Pass, and below 35 is Fail, with zero code words!

2. STAGE 2 (RECIPE) - STRICT EVERYDAY ENGLISH (NO CODING WORDS):
   - ZERO CODE WORDS ALLOWED! Do NOT use 'print', 'else', '>=', 'var', 'operator', 'syntax', 'if-else'.
   - Use clean everyday action words:
     Step 1: Get mark input
     Step 2: If mark is greater than or equal to 35, display Pass, else display Fail
   - CRITICAL BOUNDARY ERROR:
     If the student writes "less than or equal to 35 is Fail" or "<= 35 display Fail":
     -> YOU MUST SET 'correct': false! Mark 35 is Pass!
   - When both steps are present and correct, set 'correct': true!
   - Populate 'recipeStepProgress' with all steps.

3. STAGE 3 (INGREDIENTS):
   - Components needed:
     Step 1: Input variable (Variable: mark, or any variable declared by student such as 'm', 'score')
     Step 2: If condition breakdown: Left Side (L.S): <varName>, Operator: >=, Right Side (R.S): 35 -> if (<varName> >= 35)
     Step 3: Inside 'if' block \u2014 operation to print "Pass" (quotes mandatory!)
     Step 4: Inside 'else' block \u2014 operation to print "Fail" (quotes mandatory!)
   - STEP-BY-STEP GUIDANCE: Guide the student one single ingredient at a time!
   - CRITICAL: If the student has already written/declared a variable (e.g. 'Step 1: mark variable'):
     -> Step 1 IS COMPLETED! Mark Step 1 completed.
     -> NEVER ask them to write Step 1 or define a variable again!
     -> Direct them immediately to Step 2 (Left Side, Operator >=, Right Side 35).
   - Set 'correct': true ONLY when all 4 ingredients are identified!

4. STAGE 4 (SAMPLE CODE):
   - Strict prototype requirement:
     var mark = 45;
     if (mark >= 35) {
       print("Pass");
     } else {
       print("Fail");
     }
   - Check that variable is declared, comparison (mark >= 35) is correct, quotation marks are used around "Pass" and "Fail", and 'else' branch is present!
   - CRITICAL ELSE BRANCH RULES:
     * 'else' NEVER takes parentheses or condition: 'else(mark <= 35)' is an invalid syntax error!
     * Mark 35 is Pass! '<= 35' for Fail is a logical boundary error.
     * The else branch must simply be 'else {'.
   - Set 'correct': true ONLY when code prototype is complete and correct!
`;
    } else if (problemType === "greater-than-100") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Number is Greater than 100 or Not" (Problem 13)
Real-world rule: A number is greater than 100 if num > 100; otherwise it is Not greater than 100.

1. STAGE 1 (LOGIC) - STRICT ZERO CODING WORDS & ACCEPT NATURAL SYNONYMS:
   - ZERO CODING WORDS ALLOWED!
     Do NOT use: 'operator', '>', '<', 'print', 'else', 'if condition', 'var', 'variable', 'code', 'syntax', 'L.S', 'R.S'.
   - ACCEPT NATURAL EVERYDAY SYNONYMS (CRITICAL):
     * The student does NOT need to parrot the exact words "Greater than 100" and "Not greater than 100"!
     * Accept valid conceptual synonyms in everyday words:
       - Greater branch: "greater", "greatest", "bigger", "biggest", "larger", "above 100", "more than 100", "higher"
       - Not greater branch: "not greater", "not greatest", "not bigger", "less", "lesser", "lowest", "least", "smaller", "smallest", "below 100", "100 or less", "otherwise"
     * If the student clearly defines both outcomes (for example: "When a number is greater than 100 it is called as greatest... When a number is lesser than 100 it is called as lowest"):
       -> THIS IS 100% CORRECT AND SOUND LOGIC!
       -> YOU MUST SET 'correct': true!
       -> Celebrate their intuition warmly and invite them to proceed to the Recipe stage!
       -> DO NOT ask them to rephrase or copy-paste specific boilerplate sentences when their logic is already correct!
   - CONTRADICTION & MISCONCEPTION REJECTION (CRITICAL):
     * If the student claims a number <= 100 (such as 50, 80, 100) is Greater:
       -> YOU MUST SET 'correct': false!
       -> Explain kindly: 100 is equal to 100, not strictly greater! Strictly greater than 100 starts from 101.
     * If the student claims a number > 100 (such as 120, 150) is Not Greater or lowest:
       -> YOU MUST SET 'correct': false!
     * Both outcomes must be stated correctly without contradiction:
       - Greater branch -> Greater / greatest / bigger
       - 100 or less branch -> Not Greater / lowest / less / otherwise
     * Set 'correct': true when the student correctly distinguishes both outcomes with zero code words!

2. STAGE 2 (RECIPE) - STRICT EVERYDAY ENGLISH & CONTRADICTION REJECTION:
   - ZERO CODE WORDS ALLOWED! Do NOT use 'print', 'else', '>', 'var', 'operator', 'syntax', 'if-else'.
   - Use clean everyday action words:
     Step 1: Get number input
     Step 2: If number is greater than 100, display Greater than 100 (or greatest), else display Not greater than 100 (or lowest)
   - CONTRADICTION & MISCONCEPTION REJECTION (CRITICAL):
     * If the student claims a number LESSER / LESS / BELOW 100 is "greatest" or "greater" (e.g. "if that number is lesser than 100 it is called as the greatest"):
       -> THIS IS A FATAL ERROR!
       -> YOU MUST SET 'correct': false!
       -> In 'recipeStepProgress', Step 2 MUST have 'completed': false!
       -> Explain clearly: A number less than 100 cannot be 'the greatest'! Numbers below 100 are 'Not greater than 100' or 'lowest'.
     * Set 'correct': true ONLY when Step 1 and Step 2 are BOTH present, completely correct, and free from any logical contradiction!

3. STAGE 3 (INGREDIENTS) - EMPATHETIC HUMAN-TOUCH GUIDANCE:
   - Carefully analyze what the student has ALREADY identified vs what is missing:
     Step 1: Input variable (e.g. var num = 120, or variable: num, or num, or n)
     Step 2: If condition breakdown: Left Side (L.S): n or num, Operator: >, Right Side (R.S): 100 -> if (num > 100) or if (n > 100)
     Step 3: Inside 'if' block \u2014 print("Greater than 100") or print("greatest") [Quotation marks mandatory!]
     Step 4: Inside 'else' block \u2014 print("Not greater than 100") or print("lowest") / print("not greatest") [Quotation marks mandatory!]
   - STRICT THRESHOLD VALIDATION & WRONG NUMBER REJECTION (CRITICAL):
     * The comparison threshold MUST be EXACTLY 100 (e.g. Right Side: 100 or num > 100 or n > 100).
     * If the student specifies ANY OTHER NUMBER such as 1000, 10, 50, 0, etc. (e.g. "RIGHT SIDE: 1000" or "n > 1000"):
       -> THIS IS AN ERROR! Step 2 is NOT completed!
       -> In 'ingredientsStepProgress', Step 2 MUST have 'completed': false!
       -> 'correct' MUST be false!
       -> You MUST warmly alert them: "Take a closer look at your Right Side (R.S)! You wrote 1000, but our problem checks whether the number is greater than 100, not 1000! Change Right Side to 100 (Right Side (R.S): 100)."
       -> DO NOT claim they used 100 or mark Step 2 as completed!
   - CRITICAL "WHAT NEXT" & ALREADY-COMPLETED STEP DIRECTIVE:
     * If the student asks "WHAT IS NEXT STEP?", "what next?", or asks what comes next:
       LOOK CAREFULLY AT WHAT THEY HAVE ALREADY WRITTEN!
       If Step 1 (variable) and Step 2 (if condition breakdown with Left Side, Operator, Right Side) are ALREADY in their text:
       NEVER ask them to write Step 2 again! Acknowledge that Step 1 and Step 2 are completed!
       Directly answer their question with Step 3: Inside the 'if' block, what print statement runs when the number is greater than 100? Wrap it in quotes: print("Greater than 100") [or print("greatest")]!
     * NEVER give a hint or clue for a step the student has ALREADY written in their worksheet!
   - RESPONDING TO QUESTIONS & CONFUSION (CRITICAL):
     * If the student asks how to write a step or says "I don't know / I did not know how to write if condition / puriyala / theriyala / explain / help":
       NEVER repeat a static template like "Spot on! How do you write...?"! That is robotic and unhelpful!
       Instead, warmly answer their exact doubt using the specific variable they declared (e.g. 'n' if they used 'n'):
       Explain that an if-condition has 3 simple parts:
       1. Left Side (L.S): their variable (n)
       2. Operator: > (greater than)
       3. Right Side (R.S): 100 (comparison number)
       Then show them how to write Step 2 in their worksheet!
   - HUMAN TOUCH COACHING:
     * Acknowledge what the student already typed with genuine enthusiasm!
     * If they write unquoted text inside print (e.g. print(greater)), gently explain: "Wrap your message in quotes like print("Greater than 100") so JavaScript treats it as display text, not a variable!"
     * Guide them to the next specific ingredient needed.
   - Accept synonyms: "greatest" / "Greater than 100", and "lowest" / "not greatest" / "Not greater than 100".
   - Set 'correct': true when all 4 ingredients are identified!

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE) - CODE ASSEMBLY & EMPATHY:
   - Full prototype:
     var num = 120;
     if (num > 100) {
       print("Greater than 100");
     } else {
       print("Not greater than 100");
     }
   - Also accept: print("greatest") and print("lowest") / print("not greatest").
   - HUMAN TOUCH FEEDBACK:
     * Celebrate every part they got right (variable declaration, if condition, clean syntax).
     * If they inverted branches (printing 'Not greater' when num > 100), ask warmly: "If num is 120, 120 is greater than 100, right? What should print when the condition is true?"
     * If they wrote else(condition), remind them that 'else' is an automatic catch-all and needs no condition.
     * Keep feedback encouraging, empowering, and focused on building confidence!
`;
    } else if (problemType === "profit-or-loss") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Profit or Loss" (Problem 14)
Real-world rule:
- Cost Price (CP): Amount spent to purchase or make an item.
- Selling Price (SP): Amount received from selling the item.
- If Selling Price is greater than Cost Price (SP > CP): It is a Profit!
- If Selling Price is less than Cost Price (SP < CP) or Cost Price > Selling Price: It is a Loss!
- (If SP == CP: Break-even / No Profit No Loss).

1. STAGE 1 (LOGIC) - STRICT ZERO CODING WORDS & RECOGNIZE BOTH VALID FORMULATIONS:
   - ZERO CODING WORDS ALLOWED!
     Do NOT use: 'operator', '>', '<', 'print', 'else', 'if condition', 'var', 'variable', 'code', 'syntax', 'L.S', 'R.S'.
   - RECOGNIZE BOTH VALID LOGICAL FORMULATIONS (CRITICAL):
     Formulation A: "When Selling Price is greater than Cost Price it is Profit, otherwise Loss." -> 100% CORRECT!
     Formulation B: "When Cost Price is greater than Selling Price it is Loss, otherwise Profit." -> 100% CORRECT!
     Do NOT ask the student to flip Formulation B to Formulation A! Both define the exact same logical boundary!
   - STUDENT NUMERIC EXAMPLES & GUIDANCE (CRITICAL):
     * If student asks for an example, or asks how to start:
       -> Provide a clear numeric example:
          "Suppose Cost Price = 50 and Selling Price = 100. Since Selling Price (100) > Cost Price (50), you earn a Profit of 50!
           If Cost Price = 100 and Selling Price = 70, Cost Price (100) > Selling Price (70), so it is a Loss of 30!"
       -> Suggest they write their rule with numbers or everyday words!
     * If the student provides test numbers (e.g. Cost Price is 50, Selling Price is 100):
       -> DIRECTLY ANALYZE THEIR EXACT NUMBERS in the feedback!
       -> Cost Price = 50, Selling Price = 100.
       -> Since Selling Price (100) is greater than Cost Price (50), they made a Profit of 50!
       -> Connect their numbers to their rule.
       -> When their rule is sound ("Cost Price > Selling Price is Loss, otherwise Profit" OR "Selling Price > Cost Price is Profit, otherwise Loss"), YOU MUST SET 'correct': true!
       -> Mark as Logic Approved by Coach with enthusiastic praise!
   - CONTRADICTION & MISCONCEPTION REJECTION (CRITICAL):
     * If student claims Cost Price > Selling Price is Profit:
       -> YOU MUST SET 'correct': false!
       -> Explain kindly: When Cost Price is higher than Selling Price, money was lost, so it is a Loss!
     * If student claims Selling Price > Cost Price is Loss:
       -> YOU MUST SET 'correct': false!
       -> Explain kindly: When Selling Price is higher than Cost Price, money is gained, so it is a Profit!
     * Both outcomes must be explained in plain English:
       - When Selling Price exceeds Cost Price -> Profit
       - When Cost Price exceeds Selling Price (or Selling Price is less) -> Loss
     * Set 'correct': true when both outcomes are explained clearly without code words!

2. STAGE 2 (RECIPE) - STRICT EVERYDAY ENGLISH:
   - ZERO CODE WORDS ALLOWED! Do NOT use 'print', 'else', '>', 'var', 'operator', 'syntax', 'if-else'.
   - Step 1: Get cost price and selling price.
   - Step 2: If selling price is greater than cost price, display Profit, else display Loss.
   - Contradiction rejection: If Step 2 inverts profit and loss, reject with empathetic correction!
   - Set 'correct': true ONLY when Step 1 and Step 2 are BOTH present, correct, and free from contradiction!

3. STAGE 3 (INGREDIENTS) - 4-STEP BREAKDOWN:
   - Step 1: Input variables: cp (cost price) and sp (selling price).
   - Step 2: If condition breakdown: Left Side (L.S): sp, Operator: >, Right Side (R.S): cp (or L.S: cp, Operator: <, R.S: sp).
     * Alert if user writes cp > sp for Profit!
   - Step 3: Inside 'if' block \u2014 print("Profit") [Quotation marks mandatory!].
   - Step 4: Inside 'else' block \u2014 print("Loss") [Quotation marks mandatory!].
   - Set 'correct': true ONLY when all 4 ingredients are identified!

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE) - CODE ASSEMBLY & EMPATHY:
   - Full prototype:
     var cp = 100;
     var sp = 150;
     if (sp > cp) {
       print("Profit");
     } else {
       print("Loss");
     }
   - Also accept other languages (Python, C, etc.).
   - Check quotes on "Profit" and "Loss", variable declarations, condition sp > cp, clean else branch!
`;
    } else if (problemType === "divisible-by-5") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Divisible by 5 or Not" (Problem 17)
Concept: Modulo Divisibility & If-Else Decision Logic
Mathematical Rule:
- A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0).
- If the remainder is non-zero (n % 5 != 0, e.g. 1, 2, 3, 4), it is Not Divisible by 5.

1. STAGE 1 (LOGIC) - MATHEMATICAL DEFINITION MANDATE:
   - Even if the student explains in English words (e.g. "numbers ending in 0 or 5", "dividing by 5 leaves 0 remainder"), they MUST ALSO define it mathematically using modulo (n % 5 == 0) and example calculations:
     \u2022 Example divisible: 25 % 5 = 0 -> Divisible by 5
     \u2022 Example non-divisible: 23 % 5 = 3 != 0 -> Not Divisible by 5
   - If mathematical modulo condition or example calculation is missing, set 'correct': false and warmly guide them to write the modulo condition n % 5 == 0 and example numbers!
   - If student has arithmetic error (e.g. 23 % 5 = 1 or claiming remainder 0 is not divisible), kindly point out the math error.
   - When both mathematical definition and examples are present, mark 'correct': true!

2. STAGE 2 (RECIPE) - STRICT EVERYDAY ENGLISH (NO CODE WORDS):
   - ZERO CODE WORDS! Do NOT use 'print', 'else', '==', '%', 'var', 'operator', 'syntax', 'if-else'.
   - 3 Clean atomic steps:
     Step 1: Get the input number n (e.g. 25).
     Step 2: Check if dividing the number by 5 leaves remainder 0.
     Step 3: If true display 'Divisible by 5', else display 'Not Divisible by 5'.
   - NEVER dump all steps at once\u2014only guide for their single immediate missing step.

3. STAGE 3 (INGREDIENTS) - 5-STEP STRUCTURE WITH AI HUMAN TOUCH:
   - 5 programming ingredients:
     Step 1: Input variable (e.g. var n = 25, or variable: n)
     Step 2: If condition breakdown: Left Side (L.S): n % 5, Operator: ==, Right Side (R.S): 0
     Step 3: Inside 'if' block \u2014 print("Divisible by 5") [Quotes mandatory!]
     Step 4: Fallback 'else' block
     Step 5: Inside 'else' block \u2014 print("Not Divisible by 5") [Quotes mandatory!]
   - CRITICAL PEDAGOGY ON 'if' vs 'else' IN STEP 2 / STEP 4:
     * If user writes 'else' in Step 2 with condition operands (Left Side, Operator, Right Side):
       Explain with warm human touch:
       "In programming logic, we use the \`if\` construct when we have a condition to test (Left Side: n % 5, Operator: ==, Right Side: 0). The \`else\` construct is a blanket fallback that has NO condition of its own\u2014it automatically catches all other cases. Since you are testing n % 5 == 0, use the \`if\` condition for Step 2!"
     * If user writes Left Side error (e.g. n / 5 instead of n % 5):
       Warmly explain that '/' gives the quotient, while '%' (modulo) gives the remainder needed to test divisibility!
     * If user writes Operator error ('=' instead of '=='):
       Explain that '=' is for assigning values, while '==' is for comparing equality.
     * If user writes Right Side error (non-zero):
       Explain that divisible numbers leave a remainder of 0.
     * If user inverts Step 3 (print 'Not Divisible' in if block) or Step 5 (print 'Divisible' in else block):
       Explain that when n % 5 == 0 evaluates to true, the number IS Divisible by 5!
   - VARIABLE NAME FLEXIBILITY: Adopt whatever variable name the student chooses (n, num, a, val, x).
   - DELIVER DYNAMIC HUMAN-TOUCH FEEDBACK tailored to their latest line!

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE) - CODE ASSEMBLY & AI HUMAN TOUCH:
   - Full prototype assembling verified ingredients:
     var n = 25;
     if (n % 5 == 0) {
       print("Divisible by 5");
     } else {
       print("Not Divisible by 5");
     }
   - DYNAMIC MENTOR VOICE (COACH MAARA):
     * Speak directly to the student as Coach Maara with genuine warmth, empathy, and encouragement!
     * Directly acknowledge what the student typed in their latest line ("${latestInput}").
     * Honor and adopt whatever variable name the student uses (e.g. n, num, val, a, x).
   - STRICT STEP-BY-STEP GUIDANCE (NEVER DUMP THE ENTIRE SOLUTION):
     * Step 1: Variable declaration with test value: 'var n = 25;' (or 'n = 25;').
     * Step 2: If condition checking divisibility: 'if (n % 5 == 0) {'.
     * Step 3: True branch print statement: 'print("Divisible by 5");'.
     * Step 4: Fallback else branch: '} else {'.
     * Step 5: False branch print statement: 'print("Not Divisible by 5"); }'.
   - EMPATHETIC CORRECTION OF COMMON SYNTAX & LOGICAL MISTAKES:
     * Using '/' instead of '%': Gently remind them that '/' computes the quotient, while '%' (modulo) calculates the remainder needed to test divisibility!
     * Using single '=' in condition: Explain that single '=' assigns a value, while '==' compares equality.
     * Attaching condition to 'else' like 'else(n % 5 != 0)': Remind them that 'else' is an automatic catch-all that needs no condition!
     * Missing quotes in print: Remind them that strings must be wrapped in quotes so JavaScript knows they are text.
     * Inverted branches: Remind them that when remainder is 0, the number is Divisible by 5.
   - MULTI-ATTEMPT DYNAMIC VARIATION:
     * Vary your phrasing and explanations on repeated attempts with fresh analogies and Socratic clues.
`;
    } else if (problemType === "senior-citizen") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Senior Citizen or Not" (Problem 19)
Concept: Relational Comparison Operator (>=) & Threshold 60
Firebase Hints Node: "hints/problem19"

1. STAGE 1 (LOGIC) - AGE >= 60 RULE & CONCRETE MATHEMATICAL EXAMPLE (PURE HUMAN TERMS - ZERO CODE WORDS):
   - Target Firebase hints:
     \u2022 "who is a senior citizen" -> "A person aged 60 or above (age >= 60) is considered a Senior Citizen."
     \u2022 "how to check senior citizen" -> "Compare age with 60 using comparison operator >=."
     \u2022 "if age >= 60 senior citizen" -> "Spot on! If age >= 60 -> Senior Citizen, else -> Not Senior Citizen. Proceed to Recipe."
   - CRITICAL REQUIREMENT (USER MANDATE):
     \u2022 Even if the student explains the theory in words ("A person 60 or older is a senior citizen, otherwise not"), they MUST ALSO provide a mathematical example (e.g. "For age = 65: 65 >= 60 is true -> Senior Citizen, or for age = 45: 45 >= 60 is false -> Not Senior Citizen")!
     \u2022 If theory is present without mathematical example, Coach Maara praises their theory and asks for a concrete numerical example.
   - ZERO CODE WORDS! Do NOT use 'var', 'int', 'print', 'printf', 'console.log', 'syntax'.

2. STAGE 2 (RECIPE) - 2-STEP EVERYDAY ENGLISH (ZERO CODE WORDS & SOCRATIC INCREMENTAL STEP-BY-STEP):
   - CRITICAL RULE (USER MANDATE): NEVER dump all steps (Step 1 and Step 2) at once in a single hint or correction!
   - Guide the student ONLY on their immediate NEXT missing recipe step!
   - Step 1: "Step 1: Get age input"
   - Step 2: "Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen"
   - If Step 1 is not written, guide ONLY on Step 1.
   - If Step 1 is written, guide ONLY on Step 2.
   - ZERO CODE WORDS! Do NOT use 'var', '==', '>=', 'print', 'if-else', 'operator', 'variable'.

3. STAGE 3 (INGREDIENTS) - 5 PROGRAMMING TOOLS WITH AI HUMAN TOUCH:
   - 5 programming components:
     1) Step 1: age variable for input
     2) Step 2: If condition with L.S: age, R.S: 60, Operator: >=
     3) Step 3: Inside if block: print("Senior Citizen")
     4) Step 4: Fallback else block
     5) Step 5: Inside else block: print("Not Senior Citizen")
   - Guide Socratic step-by-step; catch single '=' in operator and inverted outputs.

4. STAGE 4 (TASTE THE SAMPLE) - DYNAMIC STUDENT CONTEXT & LIVE PROTOTYPE:
   - Match student's declared variable name and test value dynamically.
   - Catch single '=' (if (age = 60)), self-comparison (if (age >= age)), and unquoted prints.
   - NO test case dump in verified congratulations message.
`;
    } else if (problemType === "vowel-or-consonant") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Vowel or Consonant" (Problem 20)
Concept: Logical OR Operator (||) & Character Equality Comparison
Firebase Hints Node: "hints/problem20"

1. STAGE 1 (LOGIC) - LOGICAL OR RULE & AI HUMAN TOUCH (PURE EVERYDAY HUMAN TERMS - ZERO CODE WORDS):
   - Target Firebase hints:
     \u2022 "how to check if a character is a vowel or consonant" -> "Check if the character equals 'a', 'e', 'i', 'o', or 'u'. If true, it is a Vowel; otherwise Consonant."
   - Character comparison:
     \u2022 Check if the input character equals 'a', 'e', 'i', 'o', or 'u'. Matching ANY ONE vowel makes it a Vowel.
     \u2022 If it is not equal to any vowel, it is a Consonant.
   - Example everyday logic:
     \u2022 Input 'e': Matches vowel 'e' -> Vowel
     \u2022 Input 'x': Does not match any vowel -> Consonant
   - ZERO CODE WORDS! Do NOT use 'ch', 'var', '==', '||', '&&', 'if-else', 'print', 'operator', 'variable', 'syntax'.

2. STAGE 2 (RECIPE) - 3-STEP EVERYDAY ENGLISH (ZERO CODE WORDS & SOCRATIC INCREMENTAL STEP-BY-STEP):
   - CRITICAL RULE: NEVER dump all steps (Step 1, Step 2, Step 3) at once in a single hint or correction!
   - Guide the student ONLY on their immediate NEXT missing recipe step!
   - If Step 1 is not written, guide ONLY on Step 1: "Step 1: Get character input from the user."
   - If Step 1 is done, guide ONLY on Step 2: "Step 2: If character is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel."
   - If Step 1 & 2 are done, guide ONLY on Step 3: "Step 3: Otherwise display Consonant."
   - ZERO CODE WORDS! Do NOT use 'ch', 'var', '==', 'print', '||', 'if-else', 'operator', 'variable'.

3. STAGE 3 (INGREDIENTS) - 5 PROGRAMMING TOOLS WITH AI HUMAN TOUCH:
   - 5 programming components:
     1) Step 1: ch variable for character input
     2) Step 2: If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'
     3) Step 3: Inside if block: print("Vowel")
     4) Step 4: Fallback else block
     5) Step 5: Inside else block: print("Consonant")
`;
    } else if (problemType === "maximum-of-two") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Maximum of Two Numbers" (Problem 18)
Concept: Comparison Operator (>) & If-Else Branching
Firebase Hints Node: "hints/problem18"

1. STAGE 1 (LOGIC) - COMPARISON RULE & AI HUMAN TOUCH:
   - Target Firebase hints:
     \u2022 "how to find maximum of two numbers" -> "Compare number a and number b using the greater-than operator (>)."
     \u2022 "if a > b then a is maximum else b is maximum" -> "Spot on! If a > b, a is greater; else b is greater. Proceed to Recipe."
   - Two numbers comparison:
     \u2022 If number a is greater than number b (a > b), then a is the maximum.
     \u2022 Otherwise (if a <= b, or b > a), then b is the maximum.
   - MATHEMATICAL DEFINITION MANDATE:
     \u2022 Student must mention the two numbers/variables (a and b), the comparison operator (>), and the outcomes.
     \u2022 Concrete example arithmetic: e.g. For a = 25, b = 10: 25 > 10 is true -> 25 is maximum. For a = 7, b = 15: 7 > 15 is false -> 15 is maximum.
   - Contradiction check:
     \u2022 If student claims a < b means a is maximum, gently explain with concrete numbers that smaller numbers cannot be maximum.

2. STAGE 2 (RECIPE) - 2-STEP EVERYDAY ENGLISH (NO CODE WORDS):
   - Target Firebase hints:
     \u2022 "what steps to write" -> "Step 1: Get two numbers a and b. Step 2: Compare a and b. Step 3: Print result."
     \u2022 "step 1 : Get two numbers a and b" -> "Great! How do you compare them?"
     \u2022 "step 2 : If a is greater than b, display a is Maximum, else display b is Maximum" -> "Kudos! Complete step-by-step logic. Proceed to Ingredients."
   - 2 Clear atomic steps:
     Step 1: Get two numbers a and b.
     Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.
   - ZERO CODE WORDS! Do NOT use 'var', '==', 'print', 'syntax', 'if-else', 'operator'.

3. STAGE 3 (INGREDIENTS) - 5 PROGRAMMING TOOLS WITH AI HUMAN TOUCH:
   - Target Firebase hints:
     \u2022 "what ingredients do we need" -> "Input variables a and b, and an if-else condition using comparison operator >."
     \u2022 "step 1 : a and b for input variables" -> "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
     \u2022 "how to write if condition" -> "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator. Ex: Check whether a is greater than b: L.S: a, R.S: b, Operator: >. Looks like: if (a > b)."
     \u2022 "step 2 : If condition with L.S: a, R.S: b, Operator: >" -> "Hurray! if (a > b) prints a, else prints b. Proceed to Sample Code."
   - 5 programming ingredients:
     Step 1: a and b for input variables (or variables a and b)
     Step 2: If condition with Left Side (L.S: a), Right Side (R.S: b), Operator: >
     Step 3: Inside if block: print("a is max")
     Step 4: Fallback else block
     Step 5: Inside else block: print("b is max")
   - PEDAGOGY ON 'if' vs 'else':
     \u2022 If student wrote 'else' in Step 2 with Left Side, Right Side, Operator:
       Warmly explain that 'if' evaluates a condition (a > b), while 'else' is a blanket fallback without condition. Guide them to use 'if' for Step 2!

4. STAGE 4 (SAMPLE CODE / TASTE THE SAMPLE) - CODE ASSEMBLY & AI HUMAN TOUCH:
   - Target Firebase hints:
     \u2022 "how to write sample code" -> "Draft the code comparing a and b.
Example:
var a = 10, b = 25;
if (a > b) print("a is max");
else print("b is max");"
     \u2022 "var a = 10, b = 25; if (a > b) print("a is max"); else print("b is max");" -> "You gotcha! Perfect comparison logic."
   - Full prototype:
     var a = 10, b = 25;
     if (a > b) {
       print("a is max");
     } else {
       print("b is max");
     }
   - DYNAMIC MENTOR VOICE (COACH MAARA):
     * Acknowledge student's typed line ("${latestInput}") directly with warmth.
     * Guide line by line through the code assembly.
     * Explain why 'else' takes no condition if they wrote 'else (a <= b)'.
`;
    } else if (problemType === "adult-or-minor") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Adult or Minor" (Problem 16)
Concept: Age Comparison & If-Else Branching
1. STAGE 1 (LOGIC):
   - An Adult is someone whose age is 18 or older (age >= 18).
   - A Minor is someone whose age is under 18 (age < 18).
   - Guide student to provide mathematical comparison (age >= 18) and example ages (e.g. 20 >= 18 -> Adult, 15 >= 18 -> Minor).
2. STAGE 2 (RECIPE):
   - Step 1: Get input age.
   - Step 2: Check if age >= 18.
   - Step 3: If true display 'Adult', else display 'Minor'.
3. STAGE 3 (INGREDIENTS):
   - Step 1: Input variable (age)
   - Step 2: If condition with Left Side: age, Operator: >=, Right Side: 18
   - Step 3: Inside if block: print("Adult")
   - Step 4: Fallback else block
   - Step 5: Inside else block: print("Minor")
4. STAGE 4 (SAMPLE CODE):
   - var age = 20; if (age >= 18) { print("Adult"); } else { print("Minor"); }
`;
    } else if (problemType === "leap-year") {
      problemSpecificDirectives = `
PROBLEM FOCUS: "Leap Year or Not" (Problem 15)
Concept: Modulo Divisibility by 4
1. STAGE 1 (LOGIC):
   - Leap year occurs every 4 years and has 366 days.
   - Year is divisible by 4 if year % 4 == 0 (remainder 0).
2. STAGE 2 (RECIPE):
   - Step 1: Get input year.
   - Step 2: Check if year divided by 4 leaves remainder 0.
   - Step 3: If true display 'Leap Year', else display 'Not a Leap Year'.
3. STAGE 3 (INGREDIENTS):
   - Step 1: Input variable (year)
   - Step 2: If condition with Left Side: year % 4, Operator: ==, Right Side: 0
   - Step 3: Inside if block: print("Leap Year")
   - Step 4: Fallback else block
   - Step 5: Inside else block: print("Not a Leap Year")
4. STAGE 4 (SAMPLE CODE):
   - var year = 2024; if (year % 4 == 0) { print("Leap Year"); } else { print("Not a Leap Year"); }
`;
    } else {
      const conditionalSpec = getConditionalSpec(problemID, problemTitle, concept);
      if (conditionalSpec) {
        problemSpecificDirectives = generateUniversalIfDirectives(conditionalSpec);
      } else {
        problemSpecificDirectives = `
PROBLEM FOCUS: "${problemTitle}"
Concept: ${concept}
Guide the student sequentially through ${section} stage with warm Socratic guidance.
`;
      }
    }
    const systemInstruction = `You are Coach Maara, a world-class, friendly, warm 1-on-1 personal coding trainer on the Cook The Code (CTC) platform.
Your mission is to evaluate the student's submission or question in real time, integrate the curriculum knowledge from Firebase, and guide them with genuine empathy and human touch.

CURRENT CONTEXT:
- Problem: "${problemTitle}"
- Problem Description: "${problemDescription}"
- Target Stage: ${section.toUpperCase()}
- Concept: "${concept}"

CRITICAL USER DIRECTIVES:
1. FOCUS EXCLUSIVELY ON THE LATEST INPUT ADDED:
   - The student maintains a running worksheet with multiple lines (previous notes/questions).
   - The feedback / hint MUST ONLY address and respond to the LATEST INPUT ADDED by the student ("${latestInput}")!
   - DO NOT comment on earlier lines, greetings, or past confusion.
   - Address their latest statement directly with warm encouragement and focused guidance for that specific line!

2. STRICT ANTI-CODE VOCABULARY IN LOGIC & RECIPE (ABSOLUTE PROHIBITION):
   - In both STAGE 1 (LOGIC) and STAGE 2 (RECIPE), the student is strictly formulating natural language human thoughts and algorithmic cooking steps in everyday English.
   - YOU ARE STRICTLY FORBIDDEN from using code-related or programming terms in your feedback, hints, or correction tips for Logic and Recipe!
   - BANNED TERMS IN LOGIC & RECIPE (MUST NEVER APPEAR):
     * "if", "else", "if-else", "else if", "if condition", "else condition", "conditional statement", "conditions"
     * "else branch", "else case", "code keyword", "syntax", "code statement", "statement"
     * "variables", "operators", "loops", "for loop", "while loop", "print()", "console.log" (these belong EXCLUSIVELY in Stage 3 Ingredients & Stage 4 Sample Code!)
   - IN RECIPE STAGE, USE ONLY NATURAL EVERYDAY ACTION WORDS:
     * Instead of "if n > 0" -> Use "Check whether the number is greater than 0" or "When the number is greater than 0"
     * Instead of "if true display" -> Use "When greater than 0, show..." or "Show 'Positive' for numbers above 0"
     * Instead of "else branch / else display" -> Use "Otherwise, show..." or "For other numbers, show..."
     * Instead of "get variable" -> Use "Get the input number" or "Obtain the number from the user"
   - Keep every sentence in simple, natural conversational English without programming jargon!

3. NEVER POLLUTE HINTS ACROSS PROBLEMS:
   - This evaluation is STRICTLY for "${problemTitle}" (${problemType}).
   - NEVER mention odd/even, modulo 2, or 2 table unless the current problem is explicitly "Odd or Even"!

${problemSpecificDirectives}

4. UNIVERSAL STAGE 3 (INGREDIENTS) STRUCTURAL RULES (APPLIES TO ALL PROBLEMS):
   - VARIABLE NAME FLEXIBILITY (CRITICAL USER MANDATE):
     * The student is free to use ANY valid variable name they prefer: e.g. 'a', 'b', 'x', 'y', 'n', 'num', 'val', 'number', etc. (e.g., 'Step 1: var a=5' or 'var a' or 'let x').
     * YOU ARE STRICTLY FORBIDDEN from asking the student to change their variable name to 'n' or telling them 'n' is mandatory!
     * Recognize their declared variable name immediately and mark Step 1 (Input Variable) as COMPLETED.
     * Adopt their chosen variable name (e.g. 'a' or 'x') in all subsequent clues, condition checks (e.g. 'L.S: a'), and code snippets!
   - LOOPS (Outer Loop, Inner Loop, While Loop, For Loop):
     * When defining or inquiring about any loop (e.g. "how to define loop", "how to define outer loop", "for loop", etc.), the student MUST be guided to specify the 3 core parts:
       1) Start (initial value / starting condition, e.g. start (1) or start (start))
       2) Stop / End condition (boundary / limit, e.g. stop (i <= n) or stop (num <= end))
       3) Next step / Step (increment / decrement, e.g. next step (+1))
     * Asking "how to define loop" or typing just the word "outer loop" / "loop" without start/stop/step MUST NEVER mark that loop as completed/identified! It must trigger a warm Socratic hint explaining the 3 parts (Start, Stop, Next step).
   - IF CONDITIONS (Decisions / Branches / Modulo checks / Divisibility / Equality checks):
     * When defining or inquiring about an if-condition (e.g. "how to define if condition", "if condition", "condition", etc.), the student MUST be guided to specify the 3 core parts:
       1) Left side (e.g. n % i or a > 0 or num % i or count or n % 2)
       2) Comparison operator (e.g. ==, <, >, <=, >=, !=)
       3) Right side (e.g. 0 or 2 or target)
       4) Action (e.g. count = count + 1 or print(num) or break)
     * Asking "how to define if condition" or typing just "if condition" without left side, operator, and right side MUST NEVER mark that condition as completed/identified! It must trigger a warm Socratic hint explaining the 3 parts (Left side, Operator, Right side, Action).
   - ELSE BRANCHES (CRITICAL CONCEPT RULE):
     * An 'else' branch has NO condition (no Left Side, Right Side, or Operator)!
     * If a student tries to define Left Side, Right Side, or Operator for 'else', gently clarify:
       "'if' requires a condition (Left Side, Operator, Right Side), but 'else' is a catch-all branch that does NOT need any condition\u2014it automatically runs when 'if' is false! For 'else', you ONLY need to define the action inside it (e.g. Step 4: Inside 'else' block: print('...'))!"

5. UNIVERSAL STAGE 4 (TASTE THE SAMPLE / SAMPLE CODE) PEDAGOGICAL GUIDANCE (ABSOLUTE PROHIBITION ON BOILERPLATE DUMPS):
   - When the student in Stage 4 (Taste the Sample) asks questions, indicates confusion, or needs guidance on writing code:
     1. Explain the concept warmly and Socratically as Coach Maara in conversational English / natural guidance.
     2. YOU ARE STRICTLY FORBIDDEN from dumping giant boilerplate syntax tutorial cards (NO "💻 JavaScript" / "🐍 Python" multi-language template dumps)!
     3. YOU MUST NEVER dump completed code solutions or pre-written code blocks that give away the answer!
     4. Guide the student on what logical step to take next (e.g. what variable to initialize, or how to set up the loop start and stop) so THEY learn to write the code themselves!
     5. Set 'correct': false until their code prototype is structurally complete.

6. UNIVERSAL STAGE 4 (TASTE THE SAMPLE) MULTI-LANGUAGE FREEDOM & STRUCTURAL COMPLETION MANDATE (CRITICAL USER DIRECTIVE):
   - The student can write their code prototype in ANY programming language (Python, JavaScript, C, C++, Java, etc.) or pseudocode!
   - Taste the Sample is strictly about algorithmic prototype structure, NOT language syntax!
   - You MUST NOT require JavaScript-specific syntax (such as 'var', 'let', semicolons, console.log, or curly braces) if the student writes in Python, C, Java, or pseudocode!
   - In Python, for example:
     'num = 5' is completely valid variable declaration!
     'if (num % 2 == 0):' or 'if num % 2 == 0:' is completely valid condition!
     'print("even number")' is completely valid print!
     'else:' and 'print("odd number")' are completely valid branches!
   - AS LONG AS THE REQUIRED STRUCTURAL COMPONENTS ARE PRESENT (input variables, condition/check/loop, output branches), YOU MUST MARK 'correct': true!
   - Do NOT reject code because of minor syntax variations or string differences (e.g. "even number" vs "even")! The compiler stage will handle language compilation.

7. CRITICAL OVERRIDE MANDATE (SUBSEQUENT & LOWER-LINE STEPS OVERRIDE PREVIOUS ERRORS):
   - When students work across the 4 stages (Logic, Recipe, Ingredients, Taste the Sample), they may make a mistake on the final step, receive an error hint, and then write the correct step below (or rewrite all steps from the beginning).
   - If an earlier line in the worksheet had an error or typo, but in subsequent lines or lower down in their text the student has written the correct step or fulfilled the missing requirement:
     * The lower/subsequent correct step OVERRULES and FIXES the earlier mistake!
     * NEVER repeat the previous error message!
     * If all required steps/components for this stage are satisfied anywhere in their latest text, you MUST set 'correct': true!
     * Warmly celebrate that they successfully completed the stage and guide them to proceed to the next stage!

CORE PEDAGOGICAL & HUMAN-TOUCH RULES:
1. NEVER output the raw Firebase hint verbatim or mechanically.
2. The Firebase hint is your pedagogical guide: identify the exact concept or step it addresses.
3. Transform it by adding a warm, conversational HUMAN TOUCH:
   - Speak directly to the student as Coach Maara with friendly empathy and encouragement.
   - Acknowledge what the student specifically typed in their LATEST line.
   - Guide them toward their single next step or thought without giving away the full code or full answer.

4. ATTEMPT COUNT & PROGRESSIVE FEEDBACK DIRECTIVE (CRITICAL USER MANDATE):
   - Current Check & Run Attempt on this input: #${attemptCount}
   - User requirement: "check & run code click panna antha input ku hint different different ah tharanum."
   - For attempt 1: Provide standard gentle Socratic coaching directing attention to what is missing or incorrect.
   - For attempt 2: Completely vary your vocabulary, phrasing, and explanation angle. Give a clearer, more illustrative clue or explain the "why" behind this step.
   - For attempt >= 3: Provide a highly scaffolded hint with a concrete structure, code syntax template, or fill-in-the-blank clue to help the learner succeed without frustration.
   - NEVER repeat the exact same sentence or phrasing across repeated attempts for the same input!

5. STRICT STEP-BY-STEP GUIDANCE DIRECTIVE (CRITICAL USER MANDATE - NEVER DUMP ALL STEPS AT ONCE):
   - User requirement: "ella steps aiyum hint la sollama step by step ah kudu user input ah identify panni athukku related ana hints ah databse la identify panni atha human touch AI hints ah generate panni kudu"
   - User requirement: "orehint laye ella hint uh varuthu recipe ku set panna maari ingredients and taste the sample laiyum set pannu"
   - In ALL STAGES (Logic, Recipe, Ingredients, and Taste the Sample / Sample Code):
   - YOU ARE STRICTLY FORBIDDEN from listing or dumping all steps/ingredients/lines at once (e.g. Step 1 + Step 2 + Step 3 + Step 4 together) in feedback, clue, or correction!
   - Identify which items the student has completed and which SINGLE item is NEXT.
   - Guide them ONLY on their IMMEDIATE NEXT SINGLE STEP with a warm, encouraging Socratic question.
   - 'correction' and 'suggestedInput' MUST ONLY provide that SINGLE next step / ingredient / code line (e.g. 'Step 1: Variable n for input'), NEVER the full sequence!

6. STRICT FULL COMPLETION REQUIREMENT ('correct': true MANDATE - CRITICAL USER MANDATE):
   - User requirement: "ithula intha oru step ke successful nu varuthu... ovoru program kum naa hints and inputs set panna thevai illa... neeye ithukku munnadi naa If ku sonna instruction ah vachi train airukkanum"
   - You MUST NEVER return 'correct': true for a single step, partial branch, or intermediate work!
   - In Stage 1 (Logic) for conditional problems: 'correct' is true ONLY when BOTH outcomes/branches (the True case AND the False/Else case) are clearly defined! If only one outcome is defined (e.g. student only wrote "b is maximum" or only wrote "a is maximum"), 'correct' MUST BE FALSE!
   - In Stage 2 (Recipe): 'correct' is true ONLY when ALL recipe steps (both Step 1 and Step 2) are completed!
   - In Stage 3 (Ingredients): 'correct' is true ONLY when ALL 5 ingredients are completed (Step 1 variables, Step 2 if condition, Step 3 inside if, Step 4 else, Step 5 inside else)!
   - In Stage 4 (Taste the Sample): 'correct' is true ONLY when ALL 5 code lines/steps are completed!
   - When the student enters an intermediate single step, warmly acknowledge and praise that step in 'feedback', guide them to their next missing step, and keep 'correct': false!

7. SUBSEQUENT CORRECTION / REWRITING FROM START SUPERSEDES PREVIOUS ERROR (CRITICAL USER MANDATE):
   - User requirement: "scenario ipa intha 4 sectionlaium user ella step kandupuduchathuku apram kadasi step matum thappa potrukan so antha thappa identifie pannathuku apram user thiru ella stepaium first lenthu eluthumbothu thirumbi antha finel step error eh thirumba kata kudathu athuku killa ulla correct ana step iruntha atha identifie panni complete kudukanu thirumbi kudutha error eh kuduka kudathu."
   - Across ALL 4 SECTIONS (Logic, Recipe, Ingredients, and Taste the Sample):
   - If the student made a mistake in an earlier step (especially the final step), and subsequently:
     a) Re-wrote the steps from the beginning with the correct steps, OR
     b) Appended the correct step / line below the erroneous line:
   - YOU MUST evaluate based on the LATEST / LOWER CORRECT STEP!
   - The correct step written below ALWAYS OVERRIDES and CLEARS the earlier error!
   - Mark 'correct': true, celebrate completion warmly, and NEVER repeat or display the previous final-step error!
`;
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        correct: { type: Type.BOOLEAN },
        feedback: { type: Type.STRING },
        correction: { type: Type.STRING },
        suggestedInput: { type: Type.STRING },
        proofType: {
          type: Type.STRING,
          enum: ["mathematical", "theoretical", "recipe", "ingredients", "code"]
        },
        recipeStepProgress: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              title: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
              current: { type: Type.BOOLEAN }
            },
            required: ["stepNumber", "title", "completed", "current"]
          }
        }
      },
      required: ["correct", "feedback", "correction"]
    };
    let diagnosticContext = "";
    if (problemType === "positive-negative") {
      if (section === "logic") {
        const pnLog = validatePositiveNegativeLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (POSITIVE OR NEGATIVE NUMBER - LOGIC):
- Student Intent / Classification: "${pnLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${pnLog.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${pnLog.correction || ""}"
- Status: Fully Verified: ${pnLog.isFullyVerified}, Has Positive Concept: ${pnLog.hasPositiveConcept}, Has Negative Concept: ${pnLog.hasNegativeConcept}, Has Positive Example: ${pnLog.hasPositiveExample}, Has Negative Example: ${pnLog.hasNegativeExample}
- INSTRUCTION FOR COACH MAARA:
1. Socratic Step-by-Step Rule: Focus only on what is currently missing.
2. If the user only gave example numbers (e.g. 1, 2, 3, -1, -2, -3), acknowledge the examples and ask for the logical rule comparing with 0.
3. If the user only gave definitions, ask for concrete example numbers.
4. Deliver with an encouraging human touch without giving away everything in one shot.
`;
      } else if (section === "recipe") {
        const pnRec = validatePositiveNegativeRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (POSITIVE OR NEGATIVE NUMBER - RECIPE):
- Student Intent / Classification: "${pnRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${pnRec.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${pnRec.correction || ""}"
- Suggested Next Input: "${pnRec.suggestedInput || ""}"
- Progress: ${JSON.stringify(pnRec.recipeStepProgress)}
- Fully Verified: ${pnRec.isFullyVerified}
- CRITICAL STEP-BY-STEP SCAFFOLDING DIRECTIVE:
  * DO NOT list or dump all recipe steps (Step 1, Step 2, Step 3, Step 4) at once in your feedback or clue!
  * Guide the student ONE SINGLE STEP AT A TIME based on what they have written so far.
  * If they just started or wrote "what id do here" / Step 1 missing: Ask ONLY for Step 1 ("How do we get the number from the user?").
  * If Step 1 is done: Ask ONLY for Step 2 ("What condition tests if n is greater than 0?").
  * If Step 2 is done: Ask ONLY for Step 3 ("If true, what message should we display?").
  * If Step 3 is done: Ask ONLY for Step 4 ("In the else case, what message should we display?").
  * Correction / Clue must be ONLY that single next step: "${pnRec.correction || ""}"!
`;
      } else if (section === "ingredients") {
        const pnIng = validatePositiveNegativeIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (POSITIVE OR NEGATIVE NUMBER - INGREDIENTS):
- Student Intent / Classification: "${pnIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${pnIng.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${pnIng.correction || ""}"
- Suggested Next Input: "${pnIng.suggestedInput || ""}"
- Progress: ${JSON.stringify(pnIng.ingredientsStepProgress)}
- Fully Verified: ${pnIng.isFullyVerified}
- CRITICAL OPERATOR & LOGIC ANALYSIS DIRECTIVE:
  * Check the student's exact operator:
    - If student defined 'operator: <' (or 'a < 0'):
      - This condition checks for NEGATIVE numbers!
      - Therefore, the action inside the 'if' block (Step 3) MUST BE print("Negative"), NOT print("Positive")!
      - The action inside the 'else' block (Step 4) will be print("Positive").
      - Coach Maara must praise their choice of testing for negative numbers first and ask for 'Step 3: Inside if block: print("Negative")'.
    - If student defined 'operator: >' (or 'a > 0'):
      - This condition checks for POSITIVE numbers.
      - Action inside 'if' block (Step 3) is print("Positive"), and inside 'else' (Step 4) is print("Negative").
  * Guide the student ONE SINGLE INGREDIENT AT A TIME. DO NOT dump all 4 steps at once!
  * Correction / Clue must be ONLY that single next ingredient: "${pnIng.correction || ""}"!
`;
      } else if (section === "samplecode") {
        const pnSample = validatePositiveNegativeSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (POSITIVE OR NEGATIVE NUMBER - SAMPLE CODE):
- Student Intent / Classification: "${pnSample.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${pnSample.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${pnSample.correction || ""}"
- Suggested Next Input: "${pnSample.suggestedInput || ""}"
- Progress: ${JSON.stringify(pnSample.sampleCodeStepProgress)}
- Fully Verified: ${pnSample.allVerified}
- CRITICAL BRANCH CHECK DIRECTIVE:
  * If both 'if' and 'else' branches print the SAME string (e.g. both print "negative" or both print "positive"):
    - This is a CRITICAL LOGICAL ERROR!
    - The code MUST NOT be verified! Set correct = false!
    - Point out that since 'if (a < 0)' handles negative, 'else' must print 'positive' (or vice versa).
`;
      }
    } else if (problemType === "three-digit-number") {
      if (section === "logic") {
        const tdLog = validateThreeDigitLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS 3-DIGIT OR NOT - LOGIC):
- Student's Latest Statement: "${latestInput}"
- Status: Fully Verified: ${tdLog.isFullyVerified}
  * Has Lower Bound (>= 100): ${tdLog.hasLowerBound}
  * Has Upper Bound (<= 999 or < 1000): ${tdLog.hasUpperBound}
  * Has Logical AND / Range Concept: ${tdLog.hasLogicalAnd}
  * Has 3-Digit Example (e.g. 250): ${tdLog.hasThreeDigitExample}
  * Has Non-3-Digit Example (e.g. 45 or 1000): ${tdLog.hasNonThreeDigitExample}
- Target Educational Concept: "${tdLog.feedback || matchedFirebase?.bestPair?.hint || "A 3-digit number has 3 digits and ranges from 100 to 999 inclusive."}"
- Recommended Next Step: "${tdLog.correction || ""}"
- Suggested Next Input: "${tdLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & ADAPTIVE 1-ON-1 COACHING):
  * DYNAMIC INPUT RECOGNITION: Speak directly to what the student typed in their latest input ("${latestInput}").
  * BOUNDARY CHECKING:
    - Lower limit: Must be >= 100 (from 100 upwards).
    - Upper limit: Must be strictly below 1000 (<= 999).
    - If student wrote "greater than 1000", explain gently: "Numbers 1000 or greater have 4 or more digits! To be a 3-digit number, it must stay below 1000 (up to 999)."
  * TWO EXAMPLES REQUIRED:
    - Must give an example of a 3-digit number (e.g. 250, 456).
    - Must give an example of a number that is NOT 3 digits (e.g. 45 has 2 digits, 1000 has 4 digits).
  * PROGRESSIVE HINTS ON REPEATED ATTEMPTS (Attempt #${attemptCount}):
    - Never repeat the same wording across attempts!
    - Guide only on what is currently missing, do not dump the whole answer at once!
`;
      } else if (section === "recipe") {
        const tdRec = validateThreeDigitRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS 3-DIGIT OR NOT - RECIPE):
- Student's Latest Statement: "${latestInput}"
- Recipe Step Progress: ${JSON.stringify(tdRec.recipeStepProgress)}
- Fully Verified: ${tdRec.isFullyVerified}
- Step 3 Negation Error: ${Boolean(tdRec.hasStep3NegationError)}
- Branch Contradiction: ${Boolean(tdRec.hasBranchContradiction)}
- Recommended Next Step: "${tdRec.correction || ""}"
- Suggested Next Input: "${tdRec.suggestedInput || ""}"
- CRITICAL BRANCH LOGIC DIRECTIVE:
  * In Step 3 (when number is in range 100 to 999):
    - The action MUST state that it IS a 3-digit number (TRUE branch).
    - If student writes "that number is not a three digit number" in Step 3:
      * THIS IS A CRITICAL LOGICAL ERROR! Numbers in 100..999 ARE 3-digit numbers!
      * Mark Step 3 as INCOMPLETE (completed: false). Set correct = false!
      * Do NOT proceed to ingredients! Explain the error in Step 3!
  * In Step 4 (when NOT in range 100 to 999):
    - The action MUST state that it is NOT a 3-digit number (FALSE branch).
  * If both Step 3 and Step 4 state "not a 3-digit number":
    - THIS IS A CONTRADICTION! Set correct = false!
`;
      } else if (section === "ingredients") {
        const tdIng = validateThreeDigitIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS 3-DIGIT OR NOT - INGREDIENTS):
- Student's Latest Statement: "${latestInput}"
- Ingredients Step Progress: ${JSON.stringify(tdIng.ingredientsStepProgress)}
- Fully Verified: ${tdIng.isFullyVerified}
- Recommended Next Step: "${tdIng.correction || ""}"
- Suggested Next Input: "${tdIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide the student ONE SINGLE INGREDIENT AT A TIME.
  * Variable name flexibility: allow any variable name (e.g., 'a', 'n', 'num').
  * Compound condition: Left side, relational operators (>= and <=), Right sides (100 and 999), and logical AND (&&).
`;
      } else if (section === "samplecode") {
        const tdSample = validateThreeDigitSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS 3-DIGIT OR NOT - SAMPLE CODE):
- Student's Latest Statement: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(tdSample.sampleCodeStepProgress)}
- Fully Verified: ${tdSample.allVerified}
- Recommended Next Step: "${tdSample.correction || ""}"
- Suggested Next Input: "${tdSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Check condition: \`if (n >= 100 && n <= 999)\` (or \`< 1000\`).
  * Check both branches: must print "3-digit number" in if-block, and "Not a 3-digit number" in else-block.
`;
      }
    } else if (problemType === "voting-eligibility") {
      if (section === "logic") {
        const voteLog = validateVotingEligibilityLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ELIGIBLE OR NOT ELIGIBLE TO VOTE - LOGIC):
- Student's Latest Statement: "${latestInput}"
- Status: Fully Verified: ${voteLog.isFullyVerified}
  * Has Minimum Age 18 Concept: ${voteLog.hasAgeConcept}
  * Has Comparison Operator (>= 18): ${voteLog.hasComparisonOperator}
  * Has Eligible Outcome: ${voteLog.hasEligibleOutcome}
  * Has Not Eligible Outcome: ${voteLog.hasNotEligibleOutcome}
- Target Educational Concept: "${voteLog.feedback || matchedFirebase?.bestPair?.hint || "A person must be 18 years old or above (age >= 18) to be eligible to vote."}"
- Recommended Next Step: "${voteLog.correction || ""}"
- Suggested Next Input: "${voteLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & ADAPTIVE 1-ON-1 COACHING):
  * DYNAMIC INPUT RECOGNITION: Speak directly to what the student typed in their latest input ("${latestInput}").
  * AGE REQUIREMENT: Must be 18 or above (age >= 18).
  * BOTH BRANCHES: If age >= 18 then "Eligible to Vote", else "Not Eligible to Vote".
  * STEP-BY-STEP PROGRESSIVE GUIDANCE (Attempt #${attemptCount}):
    - Do NOT dump the whole answer at once!
    - Guide only on what is currently missing!
`;
      } else if (section === "recipe") {
        const voteRec = validateVotingEligibilityRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ELIGIBLE OR NOT ELIGIBLE TO VOTE - RECIPE):
- Student's Latest Statement: "${latestInput}"
- Recipe Step Progress: ${JSON.stringify(voteRec.recipeStepProgress)}
- Fully Verified: ${voteRec.isFullyVerified}
- Recommended Next Step: "${voteRec.correction || ""}"
- Suggested Next Input: "${voteRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide step-by-step in natural everyday English.
  * Step 1: Get input age.
  * Step 2: If age is greater than or equal to 18, display Eligible, else display Not Eligible.
`;
      } else if (section === "ingredients") {
        const voteIng = validateVotingEligibilityIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ELIGIBLE OR NOT ELIGIBLE TO VOTE - INGREDIENTS):
- Student's Latest Statement: "${latestInput}"
- Ingredients Step Progress: ${JSON.stringify(voteIng.ingredientsStepProgress)}
- Fully Verified: ${voteIng.isFullyVerified}
- Recommended Next Step: "${voteIng.correction || ""}"
- Suggested Next Input: "${voteIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide the student ONE SINGLE INGREDIENT AT A TIME.
  * If the student has already written/declared a variable (e.g. 'Variable a=25', 'var a = 25', 'Variable age'):
    - Step 1 IS COMPLETE! DO NOT ask them to write Step 1 or define a variable again!
    - Guide them directly to Step 2: If condition breakdown (Left Side, Operator: >=, Right Side: 18).
  * Step 1: Input variable (age or user's variable name)
  * Step 2: Condition breakdown (Left Side, Operator: >=, Right Side: 18)
  * Step 3: Print "Eligible" inside if block
  * Step 4: Print "Not Eligible" inside else block
`;
      } else if (section === "samplecode") {
        const voteSample = validateVotingEligibilitySampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ELIGIBLE OR NOT ELIGIBLE TO VOTE - SAMPLE CODE):
- Student's Latest Statement: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(voteSample.sampleCodeStepProgress)}
- Fully Verified: ${voteSample.allVerified}
- Recommended Next Step: "${voteSample.correction || ""}"
- Suggested Next Input: "${voteSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Variable: var age = 20;
  * Condition: if (age >= 18) {
  * Mandatory quotes on print strings: print("Eligible"); and print("Not Eligible");
  * CRITICAL ELSE BRANCH RULES:
    - 'else' NEVER takes parentheses or condition: 'else(a<=18)' is an invalid syntax error in programming!
    - Age 18 is legally eligible to vote! Therefore, 'a <= 18' for not eligible is a logical boundary error.
    - The else branch must simply be 'else {' (or 'else if (age < 18)').
    - If student writes 'else(condition)' or 'else if (age <= 18)', mark Step 4 incomplete and correct their syntax and boundary error!
  * Mandatory else branch!
`;
      }
    } else if (problemType === "pass-or-fail") {
      if (section === "logic") {
        const passLog = validatePassFailLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PASS OR FAIL BASED ON MARK - LOGIC):
- Student Intent / Classification: "${passLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || passLog.feedback}"
- Recommended Next Step: "${passLog.correction || ""}"
- Suggested Next Input: "${passLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & ADAPTIVE 1-ON-1 COACHING):
  * DYNAMIC INPUT RECOGNITION: Speak directly to what the student typed in their latest input ("${latestInput}").
  * PASS MARK RULE: Must score 35 or above (mark >= 35) to Pass; below 35 is Fail.
  * ZERO CODE WORDS: No 'print', 'var', 'if-else', 'operator'.
  * CONTRADICTION REJECTION: If student claims 35 or >= 35 is Fail, kindly correct them that 35 is Pass.
`;
      } else if (section === "recipe") {
        const passRec = validatePassFailRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PASS OR FAIL BASED ON MARK - RECIPE):
- Student's Latest Statement: "${latestInput}"
- Recipe Step Progress: ${JSON.stringify(passRec.recipeStepProgress)}
- Fully Verified: ${passRec.isFullyVerified}
- Recommended Next Step: "${passRec.correction || ""}"
- Suggested Next Input: "${passRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide step-by-step in natural everyday English.
  * Step 1: Get mark input.
  * Step 2: If mark is greater than or equal to 35, display Pass, else display Fail.
`;
      } else if (section === "ingredients") {
        const passIng = validatePassFailIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PASS OR FAIL BASED ON MARK - INGREDIENTS):
- Student's Latest Statement: "${latestInput}"
- Ingredients Step Progress: ${JSON.stringify(passIng.ingredientsStepProgress)}
- Fully Verified: ${passIng.isFullyVerified}
- Recommended Next Step: "${passIng.correction || ""}"
- Suggested Next Input: "${passIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide the student ONE SINGLE INGREDIENT AT A TIME.
  * If the student has already written/declared a variable (e.g. 'mark variable', 'var mark = 45'):
    - Step 1 IS COMPLETE! DO NOT ask them to write Step 1 or define a variable again!
    - Guide them directly to Step 2: If condition breakdown (Left Side, Operator: >=, Right Side: 35).
  * Step 1: Input variable (mark or student's variable name)
  * Step 2: Condition breakdown (Left Side, Operator: >=, Right Side: 35)
  * Step 3: Print "Pass" inside if block (mandatory quotes!)
  * Step 4: Print "Fail" inside else block (mandatory quotes!)
`;
      } else if (section === "samplecode") {
        const passSample = validatePassFailSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PASS OR FAIL BASED ON MARK - SAMPLE CODE):
- Student's Latest Statement: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(passSample.sampleCodeStepProgress)}
- Fully Verified: ${passSample.allVerified}
- Recommended Next Step: "${passSample.correction || ""}"
- Suggested Next Input: "${passSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Variable: var mark = 45;
  * Condition: if (mark >= 35) {
  * Mandatory quotes on print strings: print("Pass"); and print("Fail");
  * CRITICAL ELSE BRANCH RULES:
    - 'else' NEVER takes parentheses or condition: 'else(mark <= 35)' is an invalid syntax error!
    - Mark 35 is Pass! '<= 35' for Fail is a logical boundary error.
    - The else branch must simply be 'else {'.
  * Mandatory else branch!
`;
      }
    } else if (problemType === "greater-than-100") {
      if (section === "logic") {
        const gtLog = validateGreaterThan100Logic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS GREATER THAN 100 OR NOT - LOGIC):
- Student Intent / Classification: "${gtLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || gtLog.feedback}"
- Recommended Next Step: "${gtLog.correction || ""}"
- Suggested Next Input: "${gtLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & ADAPTIVE 1-ON-1 COACHING):
  * DYNAMIC INPUT RECOGNITION: Speak directly to what the student typed in their latest input ("${latestInput}").
  * GREATER THAN 100 RULE: If number is greater than 100 (num > 100) -> Greater, otherwise Not Greater.
  * ZERO CODE WORDS: No 'print', 'var', 'if-else', 'operator'.
  * CONTRADICTION REJECTION: 100 is NOT greater than 100! Numbers 100 or below are Not Greater.
`;
      } else if (section === "recipe") {
        const gtRec = validateGreaterThan100Recipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS GREATER THAN 100 OR NOT - RECIPE):
- Student's Latest Statement: "${latestInput}"
- Recipe Step Progress: ${JSON.stringify(gtRec.recipeStepProgress)}
- Fully Verified: ${gtRec.isFullyVerified}
- Recommended Next Step: "${gtRec.correction || ""}"
- Suggested Next Input: "${gtRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide step-by-step in natural everyday English.
  * Step 1: Get number input.
  * Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100.
`;
      } else if (section === "ingredients") {
        const gtIng = validateGreaterThan100Ingredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS GREATER THAN 100 OR NOT - INGREDIENTS):
- Student's Latest Statement: "${latestInput}"
- Ingredients Step Progress: ${JSON.stringify(gtIng.ingredientsStepProgress)}
- Fully Verified: ${gtIng.isFullyVerified}
- Recommended Next Step: "${gtIng.correction || ""}"
- Suggested Next Input: "${gtIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Guide the student ONE SINGLE INGREDIENT AT A TIME.
  * Step 1: Input variable (num or student's variable name)
  * Step 2: Condition breakdown (Left Side: num, Operator: >, Right Side: 100)
  * Step 3: Print "Greater than 100" inside if block (mandatory quotes!)
  * Step 4: Print "Not greater than 100" inside else block (mandatory quotes!)
`;
      } else if (section === "samplecode") {
        const gtSample = validateGreaterThan100SampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NUMBER IS GREATER THAN 100 OR NOT - SAMPLE CODE):
- Student's Latest Statement: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(gtSample.sampleCodeStepProgress)}
- Fully Verified: ${gtSample.allVerified}
- Recommended Next Step: "${gtSample.correction || ""}"
- Suggested Next Input: "${gtSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (1-ON-1 EMPATHETIC HUMAN TOUCH):
  * NEVER output robotic, static, or repetitive templates!
  * Directly acknowledge what the student typed in their latest input ("${latestInput}") with genuine warmth.
  * Notice and use whatever variable name the student chose (e.g. if they declared 'a', use 'a'; if 'n', use 'n'; if 'num', use 'num').
  * If they declared their variable (e.g., 'var a = 120;'), enthusiastically celebrate their start and guide them to write the 'if' condition using their variable ('if (a > 100) {').
  * If they wrote the 'if' condition, guide them warmly to add the print statement inside the if block ('print("Greater than 100");').
  * If they wrote unquoted strings inside print, gently remind them to wrap their text in quotation marks so the computer doesn't search for a variable!
  * If they inverted branches (printing 'Not greater' inside the if block), explain with a smile why 120 > 100 should print 'Greater than 100'.
  * If they wrote 'else(condition)', explain kindly that 'else' is an automatic catch-all that doesn't need parentheses.
  * Keep the tone conversational, friendly, encouraging, and natural like a world-class coding mentor sitting right next to them!
`;
      }
    } else if (problemType === "profit-or-loss") {
      if (section === "logic") {
        const plLog = validateProfitLossLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PROFIT OR LOSS - LOGIC):
- Student's Exact Input: "${latestInput}"
- Fully Verified: ${plLog.isFullyVerified}
- Detected Cost Price Number: ${plLog.costNumber ?? "None"}
- Detected Selling Price Number: ${plLog.sellingNumber ?? "None"}
- Numeric Analysis: "${plLog.numericAnalysis || "No specific numbers"}"
- Evaluated Feedback: "${plLog.feedback}"
- Recommended Next Step: "${plLog.correction || ""}"
- Suggested Next Input: "${plLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC INPUT RECOGNITION (CRITICAL):
    - If student provided numbers (e.g. Cost Price is 50, Selling Price is 100):
      DIRECTLY ANALYZE THEIR NUMBERS! Calculate the difference, explain if it is Profit or Loss, and connect to their rule!
    - RECOGNIZE ALL VALID LOGICAL FORMULATIONS:
      1) "When Selling Price > Cost Price it is Profit, otherwise Loss." (100% CORRECT)
      2) "When Cost Price > Selling Price it is Loss, otherwise Profit." (100% CORRECT)
      3) "When Selling Price < Cost Price it is Loss, otherwise Profit." (100% CORRECT)
      DO NOT ask the student to flip between these formulations! All define the exact same logical boundary.
    - CRITICAL: NO REDUNDANT HINTS!
      * If the student already defined LOSS (e.g. "if selling price is less than cost price it is loss" or "cost price > selling price is loss"):
        THEY HAVE ALREADY DEFINED LOSS! NEVER tell them to define loss or add 'otherwise Loss'! Acknowledge their Loss definition, and warmly ask them to add what happens in the opposite case: PROFIT (e.g. 'otherwise Profit')!
      * If the student already defined PROFIT (e.g. "if selling price is greater than cost price it is profit"):
        THEY HAVE ALREADY DEFINED PROFIT! NEVER tell them to define profit! Acknowledge their Profit definition, and warmly ask them to add what happens in the opposite case: LOSS (e.g. 'otherwise Loss')!
    - If correct, praise their specific numbers and logic, and invite them to Recipe stage.
    - If incorrect, clearly explain why using their numbers and provide the gentle correction.
  * STRICT ZERO CODING WORDS: No 'print', 'var', 'if-else', 'operator', '>', '<'.
`;
      } else if (section === "recipe") {
        const plRec = validateProfitLossRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PROFIT OR LOSS - RECIPE):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${plRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${plRec.isFullyVerified}
- Has Recipe Contradiction: ${plRec.hasRecipeContradiction || false}
- Recipe Step Progress: ${JSON.stringify(plRec.recipeStepProgress)}
- Evaluated Feedback: "${plRec.feedback}"
- Recommended Next Step: "${plRec.correction || ""}"
- Suggested Next Input: "${plRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * ZERO CODE WORDS (STRICT PEDAGOGICAL MANDATE):
    - STRICTLY FORBIDDEN: 'print', 'var', 'if', 'else', 'operator', 'syntax', '>', '<', 'variable', 'code'.
    - Use plain English words: 'get', 'input', 'read', 'compare', 'higher than', 'greater than', 'display', 'announce', 'otherwise'.
  * DYNAMIC INPUT RECOGNITION (CRITICAL):
    - If student asks a question or expresses confusion (e.g. "what steps to write", "how to start", "puriyala", "recipe enna"):
      Warmly explain the 2 simple cooking steps in plain English:
      1) Step 1: Get the two starting values from the user\u2014cost price and selling price.
      2) Step 2: Compare them\u2014if selling price is greater than cost price, display Profit, else display Loss.
      Encourage them to write Step 1 in their worksheet!
    - If student provided Step 1 ONLY (getting cost price and selling price):
      High five them! \u270B Acknowledge they have completed Step 1! Then guide them to write Step 2: how to compare the prices to decide whether to announce Profit or Loss.
    - If student provided Step 2 ONLY (the decision rule without getting inputs):
      Praise their comparison rule! Warmly remind them that before a computer can compare prices, it needs to get them from the user first. Guide them to add Step 1: Get cost price and selling price!
    - RECOGNIZE ALL VALID STEP 2 FORMULATIONS:
      1) "Step 2: If selling price is greater than cost price, display Profit, else display Loss." (100% CORRECT)
      2) "Step 2: If cost price is greater than selling price, display Loss, otherwise display Profit." (100% CORRECT)
      3) "Step 2: If selling price is less than cost price, display Loss, otherwise display Profit." (100% CORRECT)
      Do NOT reject or ask the student to change valid formulations!
    - CONTRADICTION HANDLING WITH HUMAN TOUCH:
      If the student claims Cost Price > Selling Price is Profit (or Selling Price < Cost Price is Profit):
      Gently use the real-world shopkeeper analogy: "If you bought something for \u20B9100 and sold it for \u20B970, you lost \u20B930! When Cost Price is higher than Selling Price, that's a Loss." Help them fix Step 2 with kindness.
    - CELEBRATION UPON COMPLETION:
      When both Step 1 and Step 2 are done without contradiction, celebrate their clear sequential algorithm and invite them to the Ingredients stage!
`;
      } else if (section === "ingredients") {
        const plIng = validateProfitLossIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PROFIT OR LOSS - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(plIng.ingredientsStepProgress)}
- Fully Verified: ${plIng.isFullyVerified}
- Inverted If-Block Print: ${plIng.hasInvertedIfPrint || false}
- Unquoted Print Strings: ${plIng.hasUnquotedPrint || false}
- Evaluated Feedback: "${plIng.feedback}"
- Recommended Next Step: "${plIng.correction || ""}"
- Suggested Next Input: "${plIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC INGREDIENTS RECOGNITION:
    The 4 Ingredients for Profit or Loss:
    1. Input variables: cp (Cost Price) and sp (Selling Price)
    2. If condition structure: Left Side: sp, Operator: >, Right Side: cp (or L.S: cp, Operator: <, R.S: sp)
    3. Inside if block: print("Profit") (with quotes!)
    4. Inside else block: print("Loss") (with quotes!)
  * GUIDANCE BY PROGRESS STATE:
    - If student asks a question or expresses confusion (e.g. "what ingredients do we need", "puriyala", "help"):
      Explain the 4 ingredients warmly like a friendly chef gathering kitchen tools. Guide them to begin with Step 1 (variables cp and sp)!
    - If Step 1 is done:
      Celebrate their variables! Guide them to Step 2: break down the if condition into Left Side (sp), Operator (>), and Right Side (cp).
    - If Step 1 & Step 2 are done:
      Cheer their condition! Guide them to Step 3: what message to print inside the if block when sp > cp is true? Emphasize quotation marks: print("Profit").
    - If Step 1, Step 2 & Step 3 are done:
      Almost there! Guide them to Step 4: inside the else block (when condition is false), print("Loss").
  * COMMON STRUGGLES & EMPATHETIC CORRECTION:
    - Wrong condition (cp > sp for Profit): Kindly explain that if cost price is higher, that's a Loss! To test Profit, Selling Price must be higher (sp > cp).
    - Inverted prints (printing Loss in if block): Explain with a smile that when sp > cp, Selling Price is higher, so it's a Profit!
    - Missing quotation marks (print(Profit)): Explain that without quotes, the computer looks for a variable named Profit instead of printing the text.
  * CELEBRATION UPON COMPLETION:
    When all 4 ingredients are verified, cheer their mastery and transition them to Taste the Sample!
`;
      } else if (section === "samplecode") {
        const plSample = validateProfitLossSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PROFIT OR LOSS - SAMPLE CODE / TASTE THE SAMPLE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(plSample.sampleCodeStepProgress)}
- Fully Verified: ${plSample.allVerified}
- Has Inverted Branches: ${plSample.hasInvertedBranches || false}
- Has Else With Condition: ${plSample.hasElseWithCondition || false}
- Evaluated Feedback: "${plSample.feedback}"
- Recommended Next Step: "${plSample.correction || ""}"
- Suggested Next Input: "${plSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * NEVER dump the complete solution code at once!
  * Directly acknowledge what the student typed in their latest input ("${latestInput}") with genuine warmth.
  * Notice their variable names and test values (e.g. var cp = 100; var sp = 150;).
  * STEP-BY-STEP PROGRESSION:
    1) Step 1: If variables are missing, guide them to declare test numbers: var cp = 100; var sp = 150;.
    2) Step 2: Once variables are declared, guide them to write the if condition: if (sp > cp) {.
    3) Step 3: Inside the if block, guide them to print("Profit");.
    4) Step 4: Guide them to add the fallback else branch: else {.
    5) Step 5: Inside the else block, guide them to print("Loss");.
  * SYNTAX DETAILS WITH HUMAN WARMTH:
    - If they wrote else(condition): Remind them kindly that else is a blanket fallback and never takes parentheses or a condition\u2014just write else {.
    - If unquoted strings in print: Explain why JavaScript needs quotation marks around text messages.
    - If inverted branches: Explain with their test numbers why 150 > 100 must print "Profit".
  * CELEBRATION UPON COMPLETION:
    When the full prototype runs correctly, celebrate enthusiastically!
`;
      }
    } else if (problemType === "divisible-by-5") {
      if (section === "logic") {
        const divLog = validateDivisibleBy5Logic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISIBLE BY 5 OR NOT - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${divLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${divLog.isFullyVerified}
- Mentions 5 / Divisible: ${divLog.hasDivisibilityConcept || false}
- Has Modulo Check (n % 5 == 0): ${divLog.hasModuloCheck || false}
- Has Contradiction: ${divLog.hasContradiction || false}
- Recommended Next Step: "${divLog.correction || ""}"
- Suggested Next Input: "${divLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * CRITICAL PEDAGOGY RULE (MATHEMATICAL DEFINITION MANDATE):
    - Even if the student writes plain words (e.g. "take the number 20", "numbers ending in 0 or 5"), they MUST ALSO define it mathematically (n % 5 == 0) with example calculations (e.g. 25 % 5 = 0 -> Divisible by 5, 23 % 5 = 3 != 0 -> Not Divisible by 5) before Logic can be approved!
    - If mathematical check is missing, DO NOT approve logic (correct: false). Guide them warmly to write the modulo condition n % 5 == 0.
`;
      } else if (section === "recipe") {
        const divRec = validateDivisibleBy5Recipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISIBLE BY 5 OR NOT - RECIPE):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${divRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${divRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(divRec.recipeStepProgress)}
- Recommended Next Step: "${divRec.correction || ""}"
- Suggested Next Input: "${divRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * STRICT STEP-BY-STEP RULE (NEVER SHOW ALL STEPS IN ONE HINT):
    - Do NOT dump all steps at once!
    - Only guide for their current missing step:
      1) Step 1: Get input number n (e.g. 25).
      2) Step 2: Check if dividing the number by 5 leaves remainder 0.
      3) Step 3: If true display 'Divisible by 5', else display 'Not Divisible by 5'.
`;
      } else if (section === "ingredients") {
        const divIng = validateDivisibleBy5Ingredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISIBLE BY 5 OR NOT - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(divIng.ingredientsStepProgress)}
- Fully Verified: ${divIng.isFullyVerified}
- Has Logical Contradiction / Construct Mismatch: ${divIng.hasContradiction || false}
- Pedagogical Diagnostic Insight: "${divIng.feedback}"
- Recommended Next Step: "${divIng.correction || ""}"
- Suggested Next Input: "${divIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Speak directly as Coach Maara with genuine warmth, empathy, and conversational human touch!
  * Do NOT repeat raw static template text or mechanical strings. Synthesize a dynamic, conversational explanation acknowledging what the student wrote ("${latestInput}").
  * Guide step-by-step through the programming tools:
    1) Step 1: Input variable (n)
    2) Step 2: If condition with Left Side: n % 5, Operator: ==, Right Side: 0
    3) Step 3: Inside if block: print("Divisible by 5")
    4) Step 4: Fallback else block
    5) Step 5: Inside else block: print("Not Divisible by 5")
  * EMPATHETIC EXPLANATION FOR 'else' vs 'if' IN STEP 2:
    - If the student wrote 'else' in Step 2 with Left Side, Operator, Right Side, warmly explain:
      "In programming, the \`if\` construct is used to evaluate a specific condition (Left Side: n % 5, Operator: ==, Right Side: 0). The \`else\` construct is a blanket fallback that has no condition of its own. Since you are testing the remainder condition, use \`if\` for Step 2!"
  * Guide them only on their immediate next missing step!
`;
      } else if (section === "samplecode") {
        const divSample = validateDivisibleBy5SampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISIBLE BY 5 OR NOT - SAMPLE CODE / TASTE THE SAMPLE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(divSample.sampleCodeStepProgress)}
- Fully Verified: ${divSample.allVerified}
- Evaluated Feedback: "${divSample.feedback}"
- Recommended Next Step: "${divSample.correction || ""}"
- Suggested Next Input: "${divSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Speak directly as Coach Maara with genuine warmth, empathy, and conversational human touch!
  * Do NOT repeat raw static template text or mechanical strings. Synthesize a dynamic, conversational explanation acknowledging what the student wrote ("${latestInput}").
  * Guide step-by-step through the prototype code lines:
    1) Step 1: Declare sample variable: var n = 25; (or with student's chosen variable name)
    2) Step 2: Write if condition: if (n % 5 == 0) {
    3) Step 3: Inside if block: print("Divisible by 5");
    4) Step 4: Fallback else block: } else {
    5) Step 5: Inside else block: print("Not Divisible by 5"); }
  * SYNTAX COACHING WITH EMPATHY:
    - If student used '/' instead of '%', explain that modulo '%' calculates the remainder to test divisibility!
    - If student used single '=' in condition, explain that '==' is used for comparison.
    - If student attached condition to else like 'else(n % 5 != 0)', explain that else is an automatic fallback and has no condition.
    - If unquoted strings in print, explain why quotes are needed.
  * Guide them only on their immediate next missing code line!
`;
      }
    } else if (problemType === "senior-citizen") {
      if (section === "logic") {
        const scLog = validateSeniorCitizenLogic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SENIOR CITIZEN - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${scLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${scLog.isFullyVerified}
- Mentions Senior Concept: ${scLog.hasSeniorConcept || false}
- Has Mathematical Check: ${scLog.hasMathematicalCheck || false}
- Has Age 60 Boundary Check (>= 60 or 60 or above): ${scLog.hasBoundaryCheck || false}
- Has Contradiction: ${scLog.hasContradiction || false}
- Recommended Next Step: "${scLog.correction || ""}"
- Suggested Next Input: "${scLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hint: "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen."
  * CRITICAL BOUNDARY RULE: A person aged exactly 60 is a Senior Citizen! If the student only wrote strictly greater than (> 60) for numbers like 70 or 25, remind them that 60 > 60 is false, so age 60 would be excluded! Ask them to include age 60 using >= 60 or "60 or above".
  * USER MANDATE: Even if they explain theory in words, they must also write a mathematical example (e.g. 65 >= 60 -> Senior Citizen). If mathematical example is missing, warmly ask for it!
`;
      } else if (section === "recipe") {
        const scRec = validateSeniorCitizenRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SENIOR CITIZEN - RECIPE):
- Student's Exact Input: "${latestInput}"
- Fully Verified: ${scRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(scRec.recipeStepProgress)}
- Step 1 Completed (Get age input): ${scRec.recipeStepProgress?.[0]?.completed}
- Step 2 Completed: ${scRec.recipeStepProgress?.[1]?.completed}
- Has Age 60 Boundary ("60 or greater" / "60 or above"): ${scRec.hasStep2Boundary || false}
- Has Otherwise Path ("otherwise display Not Senior Citizen"): ${scRec.hasStep2Otherwise || false}
- Recommended Next Step: "${scRec.correction || ""}"
- Suggested Next Input: "${scRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * CRITICAL: Do NOT mark Recipe as verified until BOTH parts of Step 2 are completed:
    1) Must include age 60: use "60 or greater" or "60 or above" (not strictly "greater than 60"!).
    2) Must include the fallback/otherwise path: "otherwise display Not Senior Citizen"!
  * STRICT EVERYDAY ENGLISH (NO CODE WORDS): Never use var, >=, print, if-else, syntax.
  * USER MANDATE: Guide ONLY on their immediate missing parts!
`;
      } else if (section === "ingredients") {
        const scIng = validateSeniorCitizenIngredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SENIOR CITIZEN - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Fully Verified: ${scIng.isFullyVerified}
- Ingredients Step Progress: ${JSON.stringify(scIng.ingredientsStepProgress)}
- Step 1 Completed (age variable): ${scIng.ingredientsStepProgress?.[0]?.completed}
- Step 2 Completed (if condition): ${scIng.ingredientsStepProgress?.[1]?.completed}
- Step 3 Completed (print Senior Citizen inside if): ${scIng.ingredientsStepProgress?.[2]?.completed}
- Step 4 Completed (else block): ${scIng.ingredientsStepProgress?.[3]?.completed}
- Step 5 Completed (print Not Senior Citizen inside else): ${scIng.ingredientsStepProgress?.[4]?.completed}
- Recommended Next Step: "${scIng.correction || ""}"
- Suggested Next Input: "${scIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * CRITICAL: If the student asks a question like "what is fallback block we need to use", they have NOT identified the fallback block yet! Answer their question directly: explain that the fallback block is called the "else" block, and guide them to write "Step 4: else block"! NEVER say "You correctly identified" when the student asked a question!
  * Guide step-by-step; catch single '=' in operator and inverted outputs.
`;
      } else if (section === "samplecode") {
        const scSample = validateSeniorCitizenSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SENIOR CITIZEN - SAMPLE CODE):
- Student's Exact Input: "${latestInput}"
- Fully Verified: ${scSample.allVerified}
- Sample Code Step Progress: ${JSON.stringify(scSample.sampleCodeStepProgress)}
- Recommended Next Step: "${scSample.correction || ""}"
- Suggested Next Input: "${scSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Honor and mirror student's variable name.
  * Catch single '=', self-comparison (age >= age), unquoted strings.
`;
      }
    } else if (problemType === "vowel-or-consonant") {
      if (section === "logic") {
        const vcLog = validateVowelConsonantLogic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (VOWEL OR CONSONANT - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${vcLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${vcLog.isFullyVerified}
- Mentions Vowels (a,e,i,o,u): ${vcLog.hasVowelConcept || false}
- Mentions Consonants: ${vcLog.hasConsonantConcept || false}
- Has Logical OR Operator (||): ${vcLog.hasOrOperator || false}
- Has Contradiction: ${vcLog.hasContradiction || false}
- Recommended Next Step: "${vcLog.correction || ""}"
- Suggested Next Input: "${vcLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hint: "Check if character ch equals 'a', 'e', 'i', 'o', or 'u' using logical OR (||). If true, it is a Vowel; else Consonant."
  * Speak with warmth, encouragement, and concrete examples (e.g. 'e' matches vowel -> Vowel; 'x' doesn't match -> Consonant).
`;
      } else if (section === "recipe") {
        const vcRec = validateVowelConsonantRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (VOWEL OR CONSONANT - RECIPE):
- Student's Exact Input: "${latestInput}"
- Fully Verified: ${vcRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(vcRec.recipeStepProgress)}
- Recommended Next Step: "${vcRec.correction || ""}"
- Suggested Next Input: "${vcRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * STRICT EVERYDAY ENGLISH (NO CODE WORDS): Never use var, ==, print, ||, syntax.
  * 3 clear steps:
    1) Step 1: Get character input ch.
    2) Step 2: If ch is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel.
    3) Step 3: Otherwise display Consonant.
`;
      } else if (section === "ingredients") {
        const vcIng = validateVowelConsonantIngredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (VOWEL OR CONSONANT - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(vcIng.ingredientsStepProgress)}
- Fully Verified: ${vcIng.isFullyVerified}
- Recommended Next Step: "${vcIng.correction || ""}"
- Suggested Next Input: "${vcIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * 5 programming ingredients:
    1) Step 1: ch variable
    2) Step 2: If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'
    3) Step 3: Inside if block: print("Vowel")
    4) Step 4: Fallback else block
    5) Step 5: Inside else block: print("Consonant")
`;
      } else if (section === "samplecode") {
        const vcSample = validateVowelConsonantSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (VOWEL OR CONSONANT - SAMPLE CODE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(vcSample.sampleCodeStepProgress)}
- Fully Verified: ${vcSample.allVerified}
- Evaluated Feedback: "${vcSample.feedback}"
- Recommended Next Step: "${vcSample.correction || ""}"
- Suggested Next Input: "${vcSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA:
  * Step-by-step code assembly:
    1) var ch = 'e';
    2) if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
    3) print("Vowel");
    4) } else {
    5) print("Consonant"); }
`;
      }
    } else if (problemType === "maximum-of-two") {
      if (section === "logic") {
        const maxLog = validateMaximumOfTwoLogic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MAXIMUM OF TWO NUMBERS - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${maxLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${maxLog.isFullyVerified}
- Mentions Two Numbers: ${maxLog.hasTwoNumbersConcept || false}
- Has Greater-Than Comparison (>): ${maxLog.hasComparisonOperator || false}
- Has Maximum Outcome Defined: ${maxLog.hasGreaterOutcome || false}
- Has Contradiction: ${maxLog.hasContradiction || false}
- Recommended Next Step: "${maxLog.correction || ""}"
- Suggested Next Input: "${maxLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hint: "Compare number a and number b using the greater-than operator (>). If a > b, a is greater; else b is greater. Proceed to Recipe."
  * Speak with warmth, encouragement, and concrete number examples (e.g. 25 > 10 is true -> 25 is maximum; 7 > 15 is false -> 15 is maximum).
  * If comparison or mathematical check is missing, guide them to state: 'If a > b, a is maximum, else b is maximum.'
`;
      } else if (section === "recipe") {
        const maxRec = validateMaximumOfTwoRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MAXIMUM OF TWO NUMBERS - RECIPE):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${maxRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${maxRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(maxRec.recipeStepProgress)}
- Recommended Next Step: "${maxRec.correction || ""}"
- Suggested Next Input: "${maxRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hint: "Step 1: Get two numbers a and b. Step 2: Compare a and b. Step 3: Print result."
  * STRICT EVERYDAY ENGLISH (NO CODE WORDS): Never use var, ==, print, operator, syntax.
  * Two simple steps:
    1) Step 1: Get two numbers a and b.
    2) Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.
  * Guide only for their current missing step!
`;
      } else if (section === "ingredients") {
        const maxIng = validateMaximumOfTwoIngredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MAXIMUM OF TWO NUMBERS - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(maxIng.ingredientsStepProgress)}
- Fully Verified: ${maxIng.isFullyVerified}
- Has Logical Contradiction / Construct Mismatch: ${maxIng.hasContradiction || false}
- Pedagogical Diagnostic Insight: "${maxIng.feedback}"
- Recommended Next Step: "${maxIng.correction || ""}"
- Suggested Next Input: "${maxIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hints:
    - "Input variables a and b, and an if-else condition using comparison operator >."
    - "Step 1: a and b for input variables"
    - "Step 2: If condition with L.S: a, R.S: b, Operator: >"
    - "Hurray! if (a > b) prints a, else prints b. Proceed to Sample Code."
  * 5 programming ingredients:
    1) Step 1: a and b for input variables
    2) Step 2: If condition with Left Side: a, Right Side: b, Operator: >
    3) Step 3: Inside if block: print("a is max")
    4) Step 4: Fallback else block
    5) Step 5: Inside else block: print("b is max")
  * EMPATHETIC EXPLANATION FOR 'else' vs 'if' IN STEP 2:
    If student wrote 'else' in Step 2 with comparison operands, explain that 'if' evaluates a condition while 'else' is an automatic fallback without condition.
`;
      } else if (section === "samplecode") {
        const maxSample = validateMaximumOfTwoSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MAXIMUM OF TWO NUMBERS - SAMPLE CODE / TASTE THE SAMPLE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(maxSample.sampleCodeStepProgress)}
- Fully Verified: ${maxSample.allVerified}
- Evaluated Feedback: "${maxSample.feedback}"
- Recommended Next Step: "${maxSample.correction || ""}"
- Suggested Next Input: "${maxSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * Target Firebase Hints:
    - "Draft the code comparing a and b.
Example:
var a = 10, b = 25;
if (a > b) print("a is max");
else print("b is max");"
    - "You gotcha! Perfect comparison logic."
  * Step-by-step code assembly:
    1) var a = 10, b = 25;
    2) if (a > b) {
    3) print("a is max");
    4) } else {
    5) print("b is max"); }
  * Guide one line at a time with warm encouraging feedback!
`;
      }
    } else if (problemType === "adult-or-minor") {
      if (section === "logic") {
        const amLog = validateAdultMinorLogic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ADULT OR MINOR - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${amLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${amLog.isFullyVerified}
- Mentions Age 18: ${amLog.hasAgeConcept || false}
- Has Comparison Condition (age >= 18): ${amLog.hasComparisonOperator || false}
- Has Mathematical Check: ${amLog.hasMathematicalCheck || false}
- Has Contradiction: ${amLog.hasContradiction || false}
- Recommended Next Step: "${amLog.correction || ""}"
- Suggested Next Input: "${amLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * PEDAGOGICAL ESSENCE:
    - An Adult is someone whose age is 18 or older (age >= 18).
    - A Minor is someone whose age is under 18 (age < 18).
    - STRICT REQUIREMENT: Even if the student writes plain words, guide them warmly to also show the mathematical comparison (age >= 18) with an example age (like 20 >= 18 -> true -> Adult, 15 >= 18 -> false -> Minor).
`;
      } else if (section === "recipe") {
        const amRec = validateAdultMinorRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ADULT OR MINOR - RECIPE):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${amRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${amRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(amRec.recipeStepProgress)}
- Recommended Next Step: "${amRec.correction || ""}"
- Suggested Next Input: "${amRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * STRICT STEP-BY-STEP RULE (NEVER SHOW ALL STEPS IN ONE HINT):
    - Do NOT dump all steps at once!
    - Only guide for their current missing step:
      1) Step 1: Get input age (e.g. 20).
      2) Step 2: Check if age >= 18.
      3) Step 3: If true display 'Adult', else display 'Minor'.
`;
      } else if (section === "ingredients") {
        const amIng = validateAdultMinorIngredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ADULT OR MINOR - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(amIng.ingredientsStepProgress)}
- Fully Verified: ${amIng.isFullyVerified}
- Recommended Next Step: "${amIng.correction || ""}"
- Suggested Next Input: "${amIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Act as an encouraging human teacher!
  * Guide step-by-step through the programming tools:
    1) Step 1: Input variable (age)
    2) Step 2: If condition with Left Side: age, Operator: >=, Right Side: 18
    3) Step 3: Inside if block: print("Adult")
    4) Step 4: Fallback else block
    5) Step 5: Inside else block: print("Minor")
`;
      } else if (section === "samplecode") {
        const amSample = validateAdultMinorSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (ADULT OR MINOR - SAMPLE CODE / TASTE THE SAMPLE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(amSample.sampleCodeStepProgress)}
- Fully Verified: ${amSample.allVerified}
- Has Inverted Branches: ${amSample.hasInvertedBranches || false}
- Has Else With Condition: ${amSample.hasElseWithCondition || false}
- Evaluated Feedback: "${amSample.feedback}"
- Recommended Next Step: "${amSample.correction || ""}"
- Suggested Next Input: "${amSample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Speak directly as Coach Maara with genuine warmth, empathy, and conversational human touch!
  * Directly acknowledge what the student wrote in "${latestInput}" with specific praise for what they've gotten right.
  * Guide one line at a time:
    1) Step 1: Declare sample variable: var age = 20; (or with student's chosen variable)
    2) Step 2: Write if condition: if (age >= 18) {
    3) Step 3: Inside if block: print("Adult");
    4) Step 4: Fallback else block: } else {
    5) Step 5: Inside else block: print("Minor"); }
  * SYNTAX COACHING WITH EMPATHY:
    - If student wrote 'else(age < 18)', explain that else is an automatic fallback and has no condition.
    - If unquoted strings in print, explain why quotes are needed.
    - If inverted branches (printing Minor when age >= 18), explain using their sample age!
  * Guide only on their immediate next missing line!
`;
      }
    } else if (problemType === "leap-year") {
      if (section === "logic") {
        const lyLog = validateLeapYearLogic(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (LEAP YEAR OR NOT - LOGIC):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${lyLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${lyLog.isFullyVerified}
- Mentions Divisible by 4: ${lyLog.hasDivisibleBy4 || false}
- Mentions Remainder 0 / year % 4 == 0: ${lyLog.hasRemainder0 || false}
- Mentions 366 days / every 4 years: ${lyLog.has366DaysOr4Years || false}
- Has Contradiction: ${lyLog.hasContradiction || false}
- Recommended Next Step: "${lyLog.correction || ""}"
- Suggested Next Input: "${lyLog.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * ZERO CODE WORDS (STRICT PEDAGOGICAL MANDATE):
    - STRICTLY FORBIDDEN: 'print', 'var', 'if', 'else', 'operator', 'syntax', '>', '<', 'variable', 'code', 'semicolon'.
    - Use everyday human language: 'calendar', 'days in a year', 'every 4 years', 'divisible by 4', 'splits evenly without leftovers (remainder 0)'.
  * PEDAGOGICAL ESSENCE:
    - A leap year occurs every 4 years and has 366 days instead of 365.
    - We check if the year is evenly divisible by 4 (giving a remainder of 0).
    - If year divided by 4 leaves remainder 0 -> Leap Year; otherwise -> Not a Leap Year.
  * CELEBRATION UPON COMPLETION:
    When they state that a year divisible by 4 with remainder 0 is a Leap Year, celebrate warmly and invite them to the Recipe stage!
`;
      } else if (section === "recipe") {
        const lyRec = validateLeapYearRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (LEAP YEAR OR NOT - RECIPE):
- Student's Exact Input: "${latestInput}"
- Student Intent: "${lyRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Fully Verified: ${lyRec.isFullyVerified}
- Recipe Step Progress: ${JSON.stringify(lyRec.recipeStepProgress)}
- Recommended Next Step: "${lyRec.correction || ""}"
- Suggested Next Input: "${lyRec.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Speak directly to the student as an encouraging, live human mentor! Never use robotic, template phrases like "Complete Step X by writing: 'Step X: ...'".
  * ZERO CODE WORDS: No 'print', 'var', 'if', 'else', 'operator', 'syntax', '==', '%'. Use everyday action words.
  * STEP ANALYSIS:
    1) Step 1: Get input year (e.g. 2024).
    2) Step 2: Check if year divided by 4 leaves remainder 0. If the student wrote that they need to divide the year (e.g. "${latestInput}"), warmly praise their intuition, then ask: since leap years happen every 4 years, which number do we divide by, and what remainder must it leave?
    3) Step 3: If true display 'Leap Year', else display 'Not a Leap Year'.
`;
      } else if (section === "ingredients") {
        const lyIng = validateLeapYearIngredients(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (LEAP YEAR OR NOT - INGREDIENTS):
- Student's Exact Input: "${latestInput}"
- Ingredients Progress: ${JSON.stringify(lyIng.ingredientsStepProgress)}
- Fully Verified: ${lyIng.isFullyVerified}
- Recommended Next Step: "${lyIng.correction || ""}"
- Suggested Next Input: "${lyIng.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Act as a warm, enthusiastic human teacher! Acknowledge what the student typed in "${latestInput}".
  * SYNTAX & OPERATOR DIAGNOSTICS:
    - If student wrote 'year/4' on the Left Side: Explain that '/' is division (quotient), but we need the remainder modulo operator '%' ('year % 4').
    - If student wrote '=' as the operator: Explain that '=' is assignment, but in an if condition we need the equality comparison operator '=='.
  * Guide step-by-step through the programming tools:
    1) Step 1: Input variable (year)
    2) Step 2: If condition with Left Side: year % 4, Operator: ==, Right Side: 0
    3) Step 3: Inside if block: print("Leap Year")
    4) Step 4: Fallback else block
    5) Step 5: Inside else block: print("Not a Leap Year")
`;
      } else if (section === "samplecode") {
        const lySample = validateLeapYearSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (LEAP YEAR OR NOT - SAMPLE CODE / TASTE THE SAMPLE):
- Student's Exact Input: "${latestInput}"
- Sample Code Progress: ${JSON.stringify(lySample.sampleCodeStepProgress)}
- Fully Verified: ${lySample.allVerified}
- Has Inverted Branches: ${lySample.hasInvertedBranches || false}
- Has Else With Condition: ${lySample.hasElseWithCondition || false}
- Evaluated Feedback: "${lySample.feedback}"
- Recommended Next Step: "${lySample.correction || ""}"
- Suggested Next Input: "${lySample.suggestedInput || ""}"
- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 Socratic Guidance):
  * DYNAMIC MENTOR VOICE: Celebrate their coding progress with genuine warmth and specific reference to their variables and test values.
  * If they have a syntax error (like else with parentheses or inverted print messages), explain why it happens in a friendly, conversational way with an example year!
  * Guide one line at a time:
    1) var year = 2024;
    2) if (year % 4 == 0) {
    3) print("Leap Year");
    4) } else {
    5) print("Not a Leap Year"); }
`;
      }
    } else if (problemType === "divisor-of-a-number") {
      if (section === "logic") {
        const divLog = validateDivisorLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISORS OF A NUMBER - LOGIC):
- Student Intent / Classification: "${divLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || divLog.feedback}"
- Recommended Next Step: "${divLog.correction || ""}"
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student typed ("${latestInput}"), and guide them warmly without reproducing the reference hint word-for-word.
`;
      } else if (section === "recipe") {
        const rec = validateDivisorRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISORS OF A NUMBER - RECIPE):
- Student Intent / Classification: "${rec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || rec.feedback}"
- Recommended Next Step: "${rec.correction || ""}"
- Progress: Step 1 (Input n): ${rec.hasStep1}, Step 2 (Loop 1..n): ${rec.hasStep2}, Step 2.1 (Check remainder 0): ${rec.hasStep21}, Step 2.2 (Record divisor): ${rec.hasStep22}
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student specifically typed ("${latestInput}"), and guide them warmly in plain everyday English without code keywords (no loop, for, while, i++, code), without reproducing the reference hint word-for-word.
`;
      } else if (section === "ingredients") {
        const ing = validateDivisorIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISORS OF A NUMBER - INGREDIENTS):
- Student Intent / Classification: "${ing.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || ing.feedback}"
- Recommended Next Step: "${ing.correction || ""}"
- Progress: Step 1 (Var n): ${ing.hasInput}, Step 2 (Loop 1..n): ${ing.hasLoop}, Step 2.1 (if n % i == 0): ${ing.hasCondition}, Step 2.2 (print(i)): ${ing.hasPrint}
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student specifically typed ("${latestInput}"), and guide them warmly to specify the exact missing ingredient or fix any syntax/operator bug, without reproducing the reference hint word-for-word.
`;
      } else if (section === "samplecode") {
        const sampleVal = validateDivisorSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (DIVISORS OF A NUMBER - SAMPLE CODE):
- Student Intent / Classification: "${sampleVal.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${sampleVal.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${sampleVal.correction || ""}"
- Suggested Code Input: "${sampleVal.suggestedInput || ""}"
- Progress: Input: ${sampleVal.hasInput}, Loop: ${sampleVal.hasLoop}, Condition: ${sampleVal.hasCondition}, Print: ${sampleVal.hasPrint}
- Detected Input Variable: "${sampleVal.detectedInputName || "a"}"
- Detected Loop Variable: "${sampleVal.detectedLoopVar || "i"}"
- INSTRUCTION FOR COACH MAARA:
1. Connect this stage directly to the INGREDIENTS stage from Stage 3!
2. Acknowledge what the student specifically typed in their latest input ("${latestInput}").
3. If the student has an error (such as using / division instead of % modulo, order reversed, = assignment, or loop boundary bugs), EXPLAIN WHY IT IS AN ERROR with deep empathy and human touch, and guide them on what to change!
4. If they need the next ingredient, give the exact next Ingredient step with concrete code syntax.
5. Your correction must match: "${sampleVal.correction || ""}".
`;
      }
    } else if (problemType === "multiplication-table") {
      if (section === "logic") {
        const mulLog = validateMultiplicationLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MULTIPLICATION TABLE - LOGIC):
- Student Intent / Classification: "${mulLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || mulLog.feedback}"
- Recommended Next Step: "${mulLog.correction || ""}"
- Fully Verified Status: ${mulLog.isFullyVerified}
- INSTRUCTION FOR COACH MAARA:
1. Deliver this educational concept dynamically with an encouraging, empathetic human touch.
2. Acknowledge what the student typed ("${latestInput}").
3. MANDATORY CRITERIA: A multiplication table must cover multipliers sequentially from 1 up to 10. If the student stopped early (e.g. only wrote up to 7 like 1*4=4 ... 7*4=28 without reaching 10 or mentioning 'up to 10'), it is an INCOMPLETE SUBMISSION. You MUST set correct to FALSE, praise their steps up to 7, and clearly instruct them to complete the table all the way up to 10!
4. Do not approve until all multipliers from 1 to 10 are covered.
`;
      } else if (section === "recipe") {
        const mulRec = validateMultiplicationRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MULTIPLICATION TABLE - RECIPE):
- Student Intent / Classification: "${mulRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || mulRec.feedback}"
- Recommended Next Step: "${mulRec.correction || ""}"
- Progress: Step 1 (Input n): ${mulRec.hasStep1}, Step 2 (Multipliers 1..10): ${mulRec.hasStep2}, Step 2.1 (Multiply input by current multiplier): ${mulRec.hasStep21}, Step 2.2/2.3 (Display product & repeat): ${mulRec.hasStep22}
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student specifically typed ("${latestInput}"), and guide them warmly in plain everyday English without code keywords (no loop, for, while, i++, code), without reproducing the reference hint word-for-word.
`;
      } else if (section === "ingredients") {
        const mulIng = validateMultiplicationIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MULTIPLICATION TABLE - INGREDIENTS):
- Student Intent / Classification: "${mulIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || mulIng.feedback}"
- Recommended Next Step: "${mulIng.correction || ""}"
- Progress: Step 1 (Var n): ${mulIng.hasInput}, Step 2 (Loop 1..10): ${mulIng.hasLoop}, Step 3 (Variable to store calculation: product = n * i): ${mulIng.hasCalculation}, Step 4 (Print inside loop): ${mulIng.hasPrint}
- INSTRUCTION FOR COACH MAARA:
1. Deliver this educational concept dynamically with an encouraging, empathetic human touch.
2. Acknowledge what the student specifically typed ("${latestInput}").
3. VARIABLE NAME FLEXIBILITY: Students may use any valid variable names (such as \`a\`, \`n\`, \`num\`, \`x\` for input; \`i\`, \`count\` for loop; \`result\`, \`product\`, \`res\`, \`ans\` for calculation). NEVER force a single rigid variable name like only \`product\` if they named it \`result\`. Acknowledge and adopt their chosen variable names!
4. When the student has defined Step 1 (variable for input) and Step 2 (for loop from 1 to 10), explicitly explain that to store the result of each multiplication inside the loop, we need a variable (like \`result\` or \`product\`). Ask them what variable and calculation formula (\`result = a * i\` or \`product = n * i\`) is needed.
5. Guide them warmly without reproducing the reference hint word-for-word.
`;
      } else if (section === "samplecode") {
        const mulSample = validateMultiplicationSampleCode(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (MULTIPLICATION TABLE - SAMPLE CODE):
- Student Intent / Classification: "${mulSample.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${mulSample.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${mulSample.correction || ""}"
- Suggested Code Input: "${mulSample.suggestedInput || ""}"
- Progress: Input: ${mulSample.hasInput}, Loop: ${mulSample.hasLoop}, Calculation: ${mulSample.hasProductCalculation}, Formatted Print: ${mulSample.hasFormattedPrint}
- INSTRUCTION FOR COACH MAARA:
1. Connect this stage directly to the INGREDIENTS stage from Stage 3!
2. Acknowledge what the student specifically typed in their latest input ("${latestInput}").
3. PROGRESSION AND CODE EXAMPLES:
   - If Step 2 (Loop from 1 to 10) is MISSING or student explicitly states they don't know how to write the loop (e.g. "how to write loop", "i didn't know how to write example"): YOU MUST PROVIDE A CONCRETE MULTI-LANGUAGE CODE EXAMPLE (JavaScript and Python) showing how to write the for loop from 1 to 10!
   - If Step 2 (Loop from 1 to 10) is ALREADY WRITTEN AND VERIFIED (Loop: true): DO NOT SHOW OR REPEAT THE FOR LOOP CODE EXAMPLE!
   - Instead, ask the student: "Where will you store the multiplication result for each step? What variable will hold the answer inside the loop?" (result ah enga store pannuva?). Explain that a variable is needed to store the multiplication calculation (e.g. \`result = a * i;\` or \`var product = n * i;\`).
4. Support user's chosen variable names (\`a\`, \`n\`, \`result\`, \`product\`, \`res\`, \`ans\`).
5. If the student has an error (such as loop starting at 0, boundary i < 10, n + i instead of n * i, overwriting n = n * i, break inside loop, or print outside loop), EXPLAIN WHY IT IS AN ERROR with deep empathy and human touch, and guide them on what to change!
6. If they need the next ingredient, give the exact next Ingredient step with concrete code syntax.
7. Your correction must match: "${mulSample.correction || ""}".
`;
      }
    } else if (problemType === "next-prime-number") {
      if (section === "logic") {
        const npLog = validateNextPrimeLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NEXT PRIME NUMBER - LOGIC):
- Student Intent / Classification: "${npLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || npLog.feedback}"
- Recommended Next Step: "${npLog.correction || ""}"
- Fully Verified Status: ${npLog.isFullyVerified}
- INSTRUCTION FOR COACH MAARA:
1. Deliver this educational concept dynamically with an encouraging, empathetic human touch.
2. Acknowledge what the student typed ("${latestInput}").
3. Explain candidate selection starting at n + 1 and testing each consecutive candidate until a prime is found.
`;
      } else if (section === "recipe") {
        const npRec = validateNextPrimeRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NEXT PRIME NUMBER - RECIPE):
- Student Intent / Classification: "${npRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || npRec.feedback}"
- Recommended Next Step: "${npRec.correction || ""}"
- Step Progress: ${JSON.stringify(npRec.stepProgress)}
- Fully Verified: ${npRec.isFullyVerified}
- INSTRUCTION FOR COACH MAARA:
1. Ground every recipe step directly on the student's mathematical logic from Stage 1!
2. All 5 sequential steps must be present without missing any step:
   - Step 1: Get input number N
   - Step 2: Start candidate number as N + 1 (next number after N)
   - Step 3: Check if candidate is prime (test divisors from 2 to candidate - 1)
   - Step 4: If prime, display candidate as next prime and stop
   - Step 5: If not prime, increase candidate by 1 and repeat from Step 3
3. STRICT NO-CODE-KEYWORDS RULE: The recipe MUST be written in plain everyday human English. Forbid programming syntax/keywords like \`while\`, \`for\`, \`var\`, \`let\`, \`candidate++\`, \`%\`, or \`;\`. If detected, warmly guide them to rephrase using kitchen-like action verbs.
4. HUMAN TOUCH ADAPTIVE HINTS: Look at what the student specifically typed ("${latestInput}"). Identify which steps they successfully wrote and warmly ask for the exact next missing step so they easily understand what to write next.
5. When all 5 steps are complete and code-free, celebrate their accomplishment with high praise and guide them to Stage 3: Ingredients!
`;
      } else if (section === "ingredients") {
        const npIng = validateNextPrimeIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NEXT PRIME NUMBER - INGREDIENTS):
- Student Intent / Classification: "${npIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || npIng.feedback}"
- Recommended Next Step: "${npIng.correction || ""}"
- Step Progress: ${JSON.stringify(npIng.stepProgress)}
- INSTRUCTION FOR COACH MAARA:
1. Deliver this educational concept dynamically with an encouraging, empathetic human touch.
2. Acknowledge what the student specifically typed ("${latestInput}").
3. CRITICAL INGREDIENT HINT STRUCTURE:
   - For Two Divisors Method: We test divisors from 1 to candidate 'b' ('start (1)', 'end (b)', 'next step (+1)'), counting factors ('count = count + 1') and checking 'if (count == 2)'. This is 100% valid because prime numbers have exactly two divisors (1 and itself). Never tell them starting at 1 is wrong!
   - When the student writes/mentions "for loop" or "loop" without all 3 parts, the hint MUST explicitly ask for:
     \u2022 Start: (e.g. 'start (b)' or 'start (1)')
     \u2022 End / Stop: (e.g. 'end (infinite / until prime found)' or 'end (b)')
     \u2022 Next step: (e.g. 'next step (+1)')
   - When the student writes/mentions "if condition" or condition without all parts, the hint MUST explicitly ask for:
     \u2022 Left side (L.S): (e.g. 'b % i' or 'candidate % i')
     \u2022 Operator: (e.g. '=='). If the student used single equal ('='), warmly explain that '=' is assignment and '==' is required for comparison!
     \u2022 Right side (R.S): (e.g. '0')
     \u2022 Action: (e.g. 'count = count + 1' or 'isPrime = false; break;')
4. If the student writes 'End: a' in the inner loop, warmly explain that 'a' is the user's initial input, while 'b' is the candidate number we are currently testing, so the inner loop must end at 'End: b'!
5. If the student writes 'Left side: i % j', explain that the candidate is 'b' and divisor is 'i', so it should be 'b % i'!
`;
      } else if (section === "samplecode") {
        const npSample = validateNextPrimeSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (NEXT PRIME NUMBER - SAMPLE CODE):
- Student Intent / Classification: "${npSample.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${npSample.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${npSample.correction || ""}"
- Suggested Code Input: "${npSample.suggestedInput || ""}"
- Detected Programming Language: "${npSample.detectedLang || "generic"}"
- Progress: Input: ${npSample.hasInput}, Candidate: ${npSample.hasCandidate}, OuterLoop: ${npSample.hasOuterLoop}, InnerLoop: ${npSample.hasInnerLoop}, ModuloCondition: ${npSample.hasModuloCondition}, Print: ${npSample.hasPrint}, Break: ${npSample.hasBreak}, Increment: ${npSample.hasIncrement}
- INSTRUCTION FOR COACH MAARA (SYNTAX SCAFFOLDING & MULTI-LANGUAGE FREEDOM):
1. CRITICAL PEDAGOGY: Do NOT give the full direct completed code immediately on early attempts!
2. Instead, provide a clear syntax structure / pattern example (syntax scaffold) so the student can look at the pattern and write the code themselves!
3. The student can write in ANY programming language (Python, C, C++, Java, JavaScript, TypeScript, etc.).
4. Acknowledge and respect the student's chosen language: if they write Python, format suggestions and syntax patterns in Python; if C/C++/Java/JS, format suggestions in that language!
5. Connect this stage directly to the INGREDIENTS stage from Stage 3!
6. Acknowledge what the student specifically typed in their latest input ("${latestInput}").
7. If there is a bug (e.g. candidate initialized to n instead of n+1, inner loop inclusive boundary, or missing break), explain the bug clearly with warm encouragement and provide the corrected syntax pattern.
`;
      }
    } else if (problemType === "prime-between-range") {
      if (section === "logic") {
        const prLog = validatePrimeRangeLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PRIME NUMBERS IN A GIVEN RANGE - LOGIC):
- Student Intent / Classification: "${prLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || prLog.feedback}"
- Recommended Next Step: "${prLog.correction || ""}"
- Fully Verified Status: ${prLog.isFullyVerified}
- INSTRUCTION FOR COACH MAARA:
1. Deliver this educational concept dynamically with an encouraging, empathetic human touch.
2. Acknowledge what the student typed ("${latestInput}").
3. CRITICAL MATHEMATICAL TRACING & COMPLETION RULE:
   - The student ONLY needs to identify and verify the prime numbers in the range (e.g., in range 10 to 15, the prime numbers are 11 and 13 with 2 divisors each).
   - The student is STRICTLY NOT REQUIRED to list or test non-prime / composite numbers (e.g., 10, 12, 14, 15).
   - If the student listed the prime numbers in the range or stated the general rule (checking if divisor count == 2), this is 100% correct! Mark correct: true and guide them to proceed to Recipe!
   - DO NOT ask them if they checked other numbers in that range!
`;
      } else if (section === "recipe") {
        const prRec = validatePrimeRangeRecipe(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PRIME NUMBERS IN A GIVEN RANGE - RECIPE):
- Student Intent / Classification: "${prRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || prRec.feedback}"
- Recommended Next Step: "${prRec.correction || ""}"
- Step Progress: ${JSON.stringify(prRec.stepProgress)}
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student specifically typed ("${latestInput}"), and guide them warmly in plain everyday English without code keywords (no loop, for, while, i++, code), without reproducing the reference hint word-for-word.
`;
      } else if (section === "ingredients") {
        const prIng = validatePrimeRangeIngredients(userInput);
        const { outerVar, innerVar } = detectLoopVariables(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PRIME NUMBERS IN A GIVEN RANGE - INGREDIENTS):
- Student Intent / Classification: "${prIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${prIng.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${prIng.correction || ""}"
- Suggested Next Input: "${prIng.suggestedInput || ""}"
- Student Chosen Variables:
  * Outer loop / Range variable: "${outerVar}"
  * Inner loop / Divisor variable: "${innerVar}"
- Step Progress Breakdown:
  * Step 1 (Variables start, end, num): ${prIng.variablesIdentified}
  * Step 2 (Outer loop ${outerVar} start to end): ${prIng.outerLoopIdentified}
  * Step 3 (count = 0 inside outer loop): ${prIng.countScopeIdentified}
  * Step 4 (Inner loop ${innerVar} 1 to ${outerVar}): ${prIng.innerLoopIdentified}
  * Step 5 (Modulo check ${outerVar} % ${innerVar} == 0, count++): ${prIng.moduloCheckIdentified}
  * Step 6 (Prime check count == 2, print ${outerVar}): ${prIng.primeCheckIdentified}
- INSTRUCTION FOR COACH MAARA:
1. DYNAMIC VARIABLE ADAPTATION (CRITICAL):
   - The student explicitly chose "${outerVar}" for outer loop / candidate number and "${innerVar}" for inner loop / divisor.
   - You MUST adapt your hints, explanations, and code examples to use their exact variable names ("${outerVar}" and "${innerVar}")!
   - DO NOT hardcode or enforce "num % i" if the student used different variables such as "i" and "j".
   - If the student wrote "${innerVar} / ${outerVar}" (e.g. "j/i") or division operator "/", explain:
     a) Division ("/") gives the quotient; we need the remainder operator ("%") to check if a number divides evenly.
     b) Order of operands: We test if range number "${outerVar}" is divisible by divisor "${innerVar}", so it should be "${outerVar} % ${innerVar}" (not "${innerVar} / ${outerVar}").
     c) Add operator "==" and right side "0", and action "count = count + 1".
2. INCOMPLETE ACTION CRITIQUE (CRITICAL):
   - If the student typed "count+1" without variable assignment or action label (e.g. count+1 alone):
     a) Explain where to store: "count + 1" only computes the increment, but doesn't store it back! We need an assignment: "count = count + 1" (or "count++").
     b) Explain when it executes: It is the action part of this if condition, so label it "action: count = count + 1" so it only increments when the remainder is 0.
   - DO NOT mark Step 5 complete or praise them as ready for Step 6 when "count+1" is incomplete!
3. STEP 6 PRINT VARIABLE CRITIQUE (CRITICAL):
   - If the student wrote "print ${innerVar}" or "print(${innerVar})" in Step 6:
     a) Explain: "${innerVar}" is only the divisor loop variable testing for factors (1 to ${outerVar}).
     b) Explain: "${outerVar}" is the candidate number that is prime when count == 2.
     c) Instruct them to change to "print(${outerVar})" (or "print ${outerVar}").
     d) DO NOT verify ingredients as complete when printing "${innerVar}"!
3. DELIVER SITUATIONAL AND STAGE-ACCURATE FEEDBACK:
   - Acknowledge what the student specifically typed in their latest input ("${latestInput}").
   - Follow the recommended next step: "${prIng.correction || ""}".
4. STRICT STEP PROGRESSION:
   - If the student just wrote or finished Step 4 (Inner loop): The NEXT step MUST BE Step 5 (divisibility check: if ${outerVar} % ${innerVar} == 0, action: count = count + 1).
   - NEVER jump to Step 6 ("is count equal to 2?") when Step 5 (modulo condition) is not yet verified!
   - If Step 2 (Outer Loop) was skipped while Step 4 is defined, warmly celebrate Step 4, explain Step 5, and remind them to define Step 2 outer loop so all numbers in the range get checked.
5. If the student writes about a loop, ask for start, stop, step.
6. If the student asks what to do next after inner loop, guide them to Step 5 (If condition: left side ${outerVar} % ${innerVar}, operator ==, right side 0, action count = count + 1).
`;
      } else if (section === "samplecode") {
        const prSample = validatePrimeRangeSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (PRIME NUMBERS IN A GIVEN RANGE - SAMPLE CODE):
- Student Intent / Classification: "${prSample.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${prSample.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${prSample.correction || ""}"
- Suggested Code Input: "${prSample.suggestedInput || ""}"
- Detected Programming Language: "${prSample.detectedLang || "generic"}"
- Progress: Start: ${prSample.hasStart}, End: ${prSample.hasEnd}, OuterLoop: ${prSample.hasOuterLoop}, CountInit: ${prSample.hasCountInit}, InnerLoop: ${prSample.hasInnerLoop}, ModuloCondition: ${prSample.hasModuloCondition}, CountIncrement: ${prSample.hasCountIncrement}, PrimeCheck: ${prSample.hasPrimeCheck}, Print: ${prSample.hasPrint}
- Step Progress Breakdown: ${JSON.stringify(prSample.sampleCodeStepProgress)}
- INSTRUCTION FOR COACH MAARA (SYNTAX SCAFFOLDING & MULTI-LANGUAGE FREEDOM):
1. CRITICAL PEDAGOGY: Do NOT give the full direct completed code immediately on early attempts!
2. Instead, deliver dynamic, empathetic human-touch guidance acknowledging what the student specifically typed in their latest input ("${latestInput}").
3. The student can write in ANY programming language (Python, C, C++, Java, JavaScript, TypeScript, etc.).
4. Acknowledge and respect the student's chosen language: if they write Python, format suggestions and syntax patterns in Python; if C/C++/Java/JS, format suggestions in that language!
5. Connect this stage directly to the INGREDIENTS stage from Stage 3!
6. If there is a bug (e.g. count initialized outside outer loop, inner loop starting at 0 causing division by zero, inner loop stopping at i < num missing the number itself, division / instead of modulo %, or printing the inner divisor variable), explain the bug clearly with warm empathy and provide the corrected syntax pattern.
7. Guide the student step by step to the next needed step in their sample code: "${prSample.correction || ""}".
`;
      }
    } else if (problemType === "sexy-prime-number") {
      if (section === "logic") {
        const spLog = validateSexyPrimeLogic(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SEXY PRIME NUMBERS - LOGIC):
- Student Intent / Classification: "${spLog.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || spLog.feedback}"
- Recommended Next Step: "${spLog.correction || ""}"
- Progress: Difference of 6: ${spLog.hasPairDifference}, Both Prime: ${spLog.hasBothMustBePrime}, Limit: ${spLog.hasRangeLimit}, Fully Verified: ${spLog.isFullyVerified}
- INSTRUCTION FOR COACH MAARA: Deliver this educational concept dynamically with an encouraging, empathetic human touch. Acknowledge what the student typed ("${latestInput}"), and guide them warmly without reproducing the reference hint word-for-word.
`;
      } else if (section === "recipe") {
        const spRec = validateSexyPrimeRecipe(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SEXY PRIME NUMBERS - RECIPE):
- Student Intent / Classification: "${spRec.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${matchedFirebase?.bestPair?.hint || spRec.feedback}"
- Recommended Next Step: "${spRec.correction || ""}"
- Progress: Step 1 (Get limit): ${spRec.hasStep1Input}, Step 2 (Check up to 6 less than limit): ${spRec.hasStep2OuterLoop}, Step 3 (First prime check): ${spRec.hasStep3CheckPPrime}, Step 4 (Second candidate +6 prime check): ${spRec.hasStep4CheckPPlus6Prime}, Step 5 (Display pair): ${spRec.hasStep5PrintPair}
- Step Progress Breakdown: ${JSON.stringify(spRec.stepProgress)}
- INSTRUCTION FOR COACH MAARA:
1. Deliver dynamic, empathetic human-touch guidance acknowledging what the student specifically typed ("${latestInput}").
2. Explain in plain, natural everyday English without variables (no p, n, n-6, etc.).
3. If the student expressed confusion ("I did not understand", "puriyala", or asks why a step is done), provide a simple, warm explanation with an intuitive example (e.g. why we check numbers up to 6 less than the limit, since candidate + 6 would exceed the limit!).
4. Guide them to their next missing step: "${spRec.correction || ""}".
`;
      } else if (section === "ingredients") {
        const spIng = validateSexyPrimeIngredients(userInput);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SEXY PRIME NUMBERS - INGREDIENTS):
- Student Intent / Classification: "${spIng.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${spIng.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${spIng.correction || ""}"
- Suggested Next Input: "${spIng.suggestedInput || ""}"
- Step Progress Breakdown:
  * Step 1 (Variables: limit, candidate, companion): ${spIng.hasLimitVar && spIng.hasCandidateVars}
  * Step 2 (Outer loop Start: 2, Stop: limit - 6, Step: +1): ${spIng.hasLoops}
  * Step 3 (Distinct counters count1 = 0 for p, count2 = 0 for p + 6): ${spIng.hasSeparateCounters}
  * Step 4 (Divisor modulo conditions & factor count increment for prime checking): ${spIng.hasCombinedCondition}
  * Step 5 (Combined decision if count1 == 2 && count2 == 2 print pair): ${spIng.isFullyVerified}
- SITUATIONAL COACHING DIRECTIVES FOR COACH MAARA:
1. STRICT INCREMENTAL RULE (ANTI-SPOILER / SOCRATIC COACHING):
   - NEVER dump the entire solution, multiple future steps, or both numbers' loops and modulo checks in one giant block!
   - Give ONLY the single immediate next clue based specifically on what the student just wrote in their latest input ("${latestInput}")!
   - Keep feedback concise, conversational (2-3 sentences), encouraging, and focused on the current step.

2. SITUATION A - USER WROTE INVERTED MODULO (e.g. Left side: k % i or k % i == 0):
   - Check the student's loop variables in their worksheet! (e.g., outer loop variable is \`i\`, inner divisor loop is \`k\`).
   - EXPLAIN THE EXACT OPERAND INVERSION MISTAKE:
     "In Step 5, look closely at your modulo check: \`Left side: k % i\`. Since \`i\` is your candidate number (dividend) and \`k\` is the divisor running from 1 to \`i\`, you must divide the candidate number by the divisor (\`i % k == 0\`), NOT the divisor by the candidate (\`k % i\`)!
     Also, remember to specify the 4 parts of the condition:
     1) Left side: \`i % k\`
     2) Operator: \`==\`
     3) Right side: \`0\`
     4) Action: \`count1 = count1 + 1\` (or \`count1++\`)"

3. SITUATION B - USER WROTE "we need to use if condition" OR JUMPED TO IF CONDITION WITHOUT INNER DIVISOR LOOP:
   - Acknowledge their idea: "You rightly noticed that an \`if\` condition with modulo (%) checks if a number divides evenly (\`if (p % i == 0)\`)."
   - Ask for the missing prerequisite: "Before testing divisibility, where does divisor \`i\` come from? We first need an **inner for loop** to generate numbers from 1 to candidate \`p\`! What loop will you define for candidate \`p\`?"
   - Recommended next step: "Define an inner for loop for candidate p (Start: 1, Stop: p, Next step: +1)."

4. SITUATION C - USER REACHED STEP 3 (COUNTERS DEFINED: count1=0, count2=0) & ASKS "WHAT TO DO NEXT":
   - Validate their counters (\`count1 = 0\` and \`count2 = 0\`).
   - Guide them ONLY to the next immediate step (inner loop for candidate \`p\`): "To check if candidate \`p\` is prime, what inner loop (start, stop, step) will generate divisors from 1 to \`p\`?"
   - Do NOT dump the companion loop, modulo checks, or decision check yet!

5. SITUATION D - USER DEFINED INNER LOOP FOR CANDIDATE p:
   - Acknowledge their loop for \`p\`!
   - Ask for candidate \`p\` divisibility check: "Inside this loop, what \`if\` condition checks if \`p\` is divisible by \`i\` with remainder 0, and increments \`count1\`?"

6. SITUATION E - USER DEFINED CANDIDATE p DIVISIBILITY CHECK:
   - Acknowledge candidate \`p\` check!
   - Now ask for companion \`p + 6\` (or \`b\`): "How will you test companion number \`p + 6\` using its divisor loop and \`count2\`?"

7. SITUATION F - USER DEFINED BOTH DIVISIBILITY CHECKS:
   - Guide to Step 5: "What condition checks if both counts equal 2 (\`if (count1 == 2 && count2 == 2)\`) and prints the pair \`(p, p + 6)\` (or \`(i, i + 6)\` or \`(a, b)\`)?"

8. SITUATION G - USER WROTE DECISION CHECK BUT GENERIC PRINT (e.g. "print the sexy prime pair"):
   - Prompt them to specify the exact pair variables to print: "You've written the decision condition! Now specify the exact pair variables to print, e.g. \`print(i, i + 6)\` (or \`print(a, b)\` / \`print(p, p + 6)\`)."
`;
      } else if (section === "samplecode") {
        const spSample = validateSexyPrimeSampleCode(userInput, attemptCount);
        diagnosticContext = `
CURRICULUM PEDAGOGY INSIGHT (SEXY PRIME NUMBERS - SAMPLE CODE / TASTE THE SAMPLE):
- Student Intent / Classification: "${spSample.matchedFirebaseInput || matchedFirebase?.bestPair?.input || latestInput}"
- Target Educational Concept: "${spSample.feedback || matchedFirebase?.bestPair?.hint}"
- Recommended Next Step: "${spSample.correction || ""}"
- Step Progress Breakdown: ${JSON.stringify(spSample.sampleCodeStepProgress)}
- Progress State:
  * Upper Limit Declared: ${spSample.hasUpperLimit}
  * Outer Loop Range (2 to limit - 6): ${spSample.hasOuterLoopRange}
  * Candidate 1 Primality Checked: ${spSample.hasFirstPrimeCheck}
  * Companion Candidate 2 Primality Checked: ${spSample.hasSecondPrimeCheck}
  * Separate Counters Maintained: ${spSample.hasSeparateCounters}
  * Combined Decision & Print: ${spSample.hasCombinedVerification && spSample.hasOutputPair}
- Detected Bugs / Alerts:
  * Counter Overlap Bug: ${spSample.hasCounterOverlapBug}
  * Single Prime Only Bug: ${spSample.hasSinglePrimeOnlyBug}
  * Upper Limit Overflow Bug: ${spSample.hasUpperLimitOverflowBug}

- INSTRUCTION FOR COACH MAARA (AI HUMAN TOUCH & 1-ON-1 COACHING):
1. DEEP LINE-BY-LINE ANALYSIS & STRICT STAGE PROGRESSION:
   - Acknowledge exactly what the student typed in their latest input ("${latestInput}").
   - CRITICAL RULE (NEVER JUMP AHEAD): Look at their FIRST inner loop! If the student is working on candidate 1's divisor loop (e.g. \`for(j=1; j<=a; j++)\` or \`for(j=1; j<=i; j++)\`):
     * Check the loop boundary: If they wrote \`j <= a\` (or \`j <= limit\`), explain that \`a\` is the upper limit (100) and candidate 1 is \`i\`, so the divisor loop must stop at candidate \`i\` (\`j <= i\`), not \`a\`!
     * Then guide them to add candidate 1's modulo condition: \`if (i % j == 0) count1++\`.
     * **DO NOT** talk about candidate 2 or the second inner loop (\`i + 6\`) until candidate 1's divisor loop and modulo check (\`count1++\`) are completely and correctly written!
2. MULTI-LANGUAGE FREEDOM:
   - The student can write in Python, C, C++, Java, or JavaScript.
   - Detect and respect their chosen language and variable names (such as \`i\`, \`limit\`, \`a\`, \`k\`, \`j\` or \`p\`, \`n\`, \`q\`).
3. DYNAMIC SITUATIONAL HINTS:
   - If starting (Step 1/2): Help them set up the outer loop iterating candidate numbers up to \`a - 6\`.
   - If testing Candidate 1 (Step 3): Guide them to reset \`count1 = 0\` and count divisors of candidate \`i\` from 1 to \`i\` (\`for(j=1; j<=i; j++)\` with \`if (i % j == 0) count1++\`).
   - If testing Companion Candidate 2 (Step 4 - ONLY after Step 3 is done!): Guide them to test \`i + 6\` with its own divisor loop (\`for(k=1; k<=i+6; k++)\`) and \`count2\`.
   - If deciding & printing (Step 5): Guide them to check \`if (count1 == 2 && count2 == 2)\` and print the exact pair \`print(i, i + 6)\`.
4. EMPATHETIC BUG CORRECTION:
   - If inner loop stops at upper limit (\`j <= a\`), explain why divisors of \`i\` should only go up to \`i\`.
   - If outer loop overflows (\`i <= a\` instead of \`i <= a - 6\`), explain why \`i + 6\` would exceed the upper limit.
   - If they reuse a single \`count\` variable, explain why divisor counts would collide without separate counters.
5. NO CODE DUMPING: Never give away the entire completed program on early attempts\u2014scaffold syntax step by step!
`;
      }
    }
    const prompt = `EVALUATE THIS SUBMISSION AS COACH MAARA:
PROBLEM: "${problemTitle}" (${problemType})
CURRENT STAGE: ${section.toUpperCase()}
REFERENCE SOLUTION FOR THIS STAGE: "${referenceSolution || "Not provided"}"
STUDENT'S FULL WORKSHEET CONTENT:
"""
${userInput}
"""

LATEST INPUT ADDED (RESPOND SPECIFICALLY TO THIS):
"""
${latestInput}
"""

STUDENT INDICATED THEY ARE STUCK / REQUESTED WORKED EXAMPLE: ${isStuck}

${firebaseContext}
${diagnosticContext}

Evaluate now according to Coach Maara's rules. Return JSON matching the schema.`;
    if (globalQuotaCooldownUntil > Date.now()) {
      return null;
    }
    for (const model of CANDIDATE_MODELS) {
      const cooldownUntil = modelCooldownMap.get(model) || 0;
      if (cooldownUntil > Date.now()) {
        continue;
      }
      try {
        const reqConfig = {
          systemInstruction,
          temperature: attemptCount > 1 ? 0.6 : 0.25,
          responseMimeType: "application/json",
          responseSchema,
          maxOutputTokens: 1000
        };
        if (model.includes("2.5")) {
          reqConfig.thinkingConfig = { thinkingBudget: 0 };
        }
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: reqConfig
        });
        modelCooldownMap.delete(model);
        const rawText = response.text || "";
        if (!rawText.trim()) continue;

        let parsed = null;
        try {
          let cleaned = rawText.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/^```json/i, "").replace(/```$/, "").trim();
          } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```/i, "").replace(/```$/, "").trim();
          }
          const match = cleaned.match(/\{[\s\S]*\}/);
          parsed = JSON.parse(match ? match[0] : cleaned);
        } catch (parseErr) {
          const feedbackMatch = rawText.match(/"feedback"\s*:\s*"((?:[^"\\]|\\.)*)"/);
          if (feedbackMatch) {
            parsed = {
              correct: /"correct"\s*:\s*true/.test(rawText),
              feedback: feedbackMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')
            };
          }
        }
        if (!parsed) continue;
        if (typeof parsed.correct === "boolean" && typeof parsed.feedback === "string") {
          const originalGeminiFeedback = parsed.feedback;
          if (problemType === "odd-even") {
            if (section === "logic") {
              const oddEvenVal = validateOddEvenClassification(userInput);
              if (oddEvenVal.hasList && !oddEvenVal.isCorrect) {
                parsed.correct = false;
                parsed.feedback = oddEvenVal.feedback;
                parsed.correction = oddEvenVal.correction;
                parsed.suggestedInput = oddEvenVal.suggestedInput;
              }
              const logicVal = validateOddEvenLogic(userInput);
              parsed.logicStepProgress = logicVal.logicStepProgress;
              parsed.stepProgress = logicVal.logicStepProgress;
              delete parsed.recipeStepProgress;

              if (!logicVal.isFullyVerified) {
                parsed.correct = false;
                parsed.feedback = logicVal.feedback;
                parsed.correction = logicVal.correction;
                parsed.suggestedInput = logicVal.suggestedInput;
              } else {
                parsed.correct = true;
                parsed.feedback = "🎉 Logic Approved! Spot on! You've defined both Even (remainder 0) and Odd (remainder 1) using modulo 2. Proceed to the Recipe stage!";
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              }
            }
            if (section === "recipe") {
              const rec = validateOddEvenRecipe(userInput);
              parsed.recipeStepProgress = rec.recipeStepProgress;
              if (rec.isParityInverted) {
                parsed.correct = false;
                parsed.feedback = rec.feedback;
                parsed.correction = rec.correction;
                parsed.suggestedInput = rec.suggestedInput;
              } else if (!rec.isFullyVerified) {
                parsed.correct = false;
                const isClaimingDone = /proceed to ingredients|ingredients stage|recipe verified|all \d+ steps completed|congratulations/i.test(parsed.feedback || "");
                if (!parsed.feedback || isClaimingDone || parsed.feedback.trim().length < 20) {
                  parsed.feedback = rec.feedback;
                }
                parsed.correction = rec.correction;
                parsed.suggestedInput = rec.suggestedInput;
              } else {
                parsed.correct = true;
                if (!parsed.feedback || parsed.feedback.trim().length < 20) {
                  parsed.feedback = "\u{1F389} Recipe Successful! Brilliant work! You've sequenced all 4 steps of the algorithm from reading input to making the final decision. You're ready to proceed to the Ingredients stage!";
                }
                parsed.correction = "Proceed to Ingredients to identify the required programming components.";
              }
            }
            if (section === "ingredients") {
              const norm = userInput.toLowerCase();
              const hasN = /\b(?:let|var|const|int)?\s*n\b/.test(norm);
              const hasMod = /%\s*2/.test(norm) || /modulo/.test(norm);
              const hasEven = /even/i.test(norm);
              const hasOdd = /odd/i.test(norm);
              const hasElse = /else/i.test(norm);
              const isDone = hasN && hasMod && hasEven && hasOdd && hasElse;
              parsed.ingredientsStepProgress = [
                { stepNumber: 1, title: "Input variable n", completed: hasN, current: !hasN },
                { stepNumber: 2, title: "If condition (n % 2 == 0)", completed: hasMod, current: hasN && !hasMod },
                { stepNumber: 3, title: "Print 'Even' block", completed: hasEven, current: hasN && hasMod && !hasEven },
                { stepNumber: 4, title: "Else fallback block", completed: hasElse, current: hasN && hasMod && hasEven && !hasElse },
                { stepNumber: 5, title: "Print 'Odd' block", completed: hasOdd, current: hasN && hasMod && hasEven && hasElse && !hasOdd }
              ];
              if (!isDone) {
                parsed.correct = false;
                const isClaimingDone = /proceed to taste|taste the sample|sample code|ingredients verified|congratulations/i.test(parsed.feedback || "");
                if (!parsed.feedback || isClaimingDone || parsed.feedback.trim().length < 20) {
                  parsed.feedback = "\u{1F31F} Coach Maara here! For Odd or Even, identify the 5 programming ingredients: 1) input variable n, 2) If condition testing n % 2 == 0, 3) inside if block: print('Even'), 4) fallback else block, and 5) inside else block: print('Odd').";
                }
                parsed.correction = "List all 5 ingredients: variable n, if (n % 2 == 0), print('Even'), else, print('Odd').";
                parsed.suggestedInput = "step 1: variable n\nstep 2: If condition with L.S: n % 2, Operator: ==, R.S: 0\nstep 3: Inside if: print(\"Even\")\nstep 4: else block\nstep 5: Inside else: print(\"Odd\")";
              } else {
                parsed.correct = true;
                if (!parsed.feedback || parsed.feedback.trim().length < 20) {
                  parsed.feedback = "\u{1F389} Ingredients Verified! Brilliant work! You've identified all 5 essential programming ingredients for checking Odd or Even. Proceed to Taste the Sample!";
                }
                parsed.correction = "Proceed to Taste the Sample stage to draft your prototype.";
              }
            }
            if (section === "samplecode") {
              const sampleVal = validateOddEvenSampleCode(userInput);
              parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
              parsed.stepProgress = sampleVal.sampleCodeStepProgress;
              if (sampleVal.allVerified) {
                parsed.correct = true;
                if (!parsed.feedback || parsed.feedback.trim().length < 20) {
                  parsed.feedback = sampleVal.feedback;
                }
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                parsed.feedback = sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = sampleVal.suggestedInput;
              }
            }
          }
          if (problemType === "sum-natural-numbers") {
            if (section === "logic") {
              const sumVal = validateSumOfNLogic(userInput);
              const arith = checkSumArithmetic(userInput);
              if (arith.hasEquations && !arith.allEquationsValid && arith.invalidEquations.length > 0) {
                parsed.correct = false;
                parsed.feedback = sumVal.feedback;
                parsed.correction = sumVal.correction;
                parsed.suggestedInput = sumVal.suggestedInput;
              } else if (arith.hasEquations && (arith.isDoubling || !arith.isSequentialAccumulation)) {
                parsed.correct = false;
                parsed.feedback = sumVal.feedback;
                parsed.correction = sumVal.correction;
                parsed.suggestedInput = sumVal.suggestedInput;
              } else if (!sumVal.isCorrect && (sumVal.hasTargetMismatch || sumVal.hasSumMismatch)) {
                parsed.correct = false;
                parsed.feedback = sumVal.feedback;
                parsed.correction = sumVal.correction;
                parsed.suggestedInput = sumVal.suggestedInput;
              } else if (sumVal.hasFormula) {
                parsed.correct = false;
                parsed.feedback = sumVal.feedback;
                parsed.correction = sumVal.correction;
                parsed.suggestedInput = sumVal.suggestedInput;
              } else if (!sumVal.isCorrect) {
                parsed.correct = false;
                if (sumVal.feedback) {
                  parsed.feedback = sumVal.feedback;
                  parsed.correction = sumVal.correction;
                  parsed.suggestedInput = sumVal.suggestedInput;
                }
              } else if (sumVal.isCorrect && sumVal.hasAccumulation) {
                parsed.correct = true;
                parsed.feedback = sumVal.feedback || "\u{1F389} Logic Successful! Fantastic work! You have clearly demonstrated how the numbers from 1 to n accumulate step by step into the running total. You're ready to proceed to the Recipe stage to sequence this into an algorithm!";
                parsed.correction = "Proceed to the Recipe stage to write the step-by-step instructions.";
                parsed.suggestedInput = void 0;
              }
            }
            if (section === "recipe") {
              const rec = validateSumOfNRecipe(userInput);
              parsed.recipeStepProgress = rec.recipeStepProgress;
              if (rec.hasProgrammingWords) {
                parsed.correct = false;
                const wordsList = rec.foundProgrammingWords.map((w) => `'${w}'`).join(", ");
                parsed.feedback = `In the Recipe stage, please avoid programming tools and code words (detected: ${wordsList}). The Recipe should be written in plain, human-readable English without programming keywords or code syntax! For example, use 'repeat until reaching n' instead of 'loop', and 'starting number 1' instead of 'counter i = 1'.`;
                parsed.correction = "Replace programming words with everyday language (use 'repeat', 'current number', 'next number').";
                parsed.suggestedInput = rec.suggestedInput || (!rec.hasStep1 ? "Step 1: Get the input number n" : !rec.hasStep2 ? "Step 2: Start with total sum as 0 and current number as 1" : !rec.hasStep3 ? "Step 3: Move to the next number and repeat until reaching n" : !rec.hasStep4 ? "Step 4: Add the current number to the total sum" : "Step 5: Display the final total sum");
              } else if (rec.allStepsDone) {
                parsed.correct = true;
                const donePair = matchedFirebase?.allPairs?.find((p) => p.input.toLowerCase().includes("step 5") || p.input.toLowerCase().includes("step 4")) || matchedFirebase?.bestPair;
                parsed.feedback = donePair?.hint || "Kudos! You've sequenced all essential steps of the algorithm in plain English. Proceed to ingredients.";
                parsed.correction = "Proceed to Ingredients to identify variables and loops.";
                parsed.suggestedInput = void 0;
              } else if (rec.hasCombinedStep3 && (!rec.hasStep1 || !rec.hasStep2 || !rec.hasStep5)) {
                parsed.correct = false;
                parsed.feedback = "Good start combining repeating and adding! However, earlier steps or the final output are still missing. Ensure you read input n (Step 1), start sum at 0 (Step 2), and print the final total sum!";
                parsed.correction = !rec.hasStep1 ? "Add Step 1: Get the input number n from the user." : !rec.hasStep2 ? "Add Step 2: Start total sum = 0 and number = 1." : "Add final step: Display the final total sum.";
                parsed.suggestedInput = rec.suggestedInput;
              } else {
                parsed.correct = false;
                if (rec.isPrintingInputInsteadOfSum || rec.hasWrongAddInRecipe || rec.hasProgrammingWords || rec.hasCombinedStep3 || !parsed.feedback || parsed.feedback.trim().length === 0) {
                  parsed.feedback = synthesizeHumanTouch(rec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput);
                }
                if (rec.correction) {
                  parsed.correction = rec.correction;
                  parsed.suggestedInput = rec.suggestedInput;
                } else if (!rec.hasStep1 && !rec.hasStep2) {
                  parsed.correction = "Start with Step 1: Get the input number n from the user.";
                  parsed.suggestedInput = "Step 1: Get the input number n from the user";
                } else if (!rec.hasStep1 && rec.hasStep2) {
                  parsed.correction = "Add Step 1 at the beginning: Get the input number n from the user.";
                  parsed.suggestedInput = "Step 1: Get the input number n from the user";
                } else if (rec.hasStep1 && !rec.hasStep2) {
                  parsed.correction = "In Step 2: Start with total sum as 0 and current number as 1.";
                  parsed.suggestedInput = "Step 2: Start with total sum as 0 and current number as 1";
                } else if (rec.hasStep1 && rec.hasStep2 && !rec.hasStep3) {
                  parsed.correction = "In Step 3: Move to the next number and repeat until reaching n.";
                  parsed.suggestedInput = "Step 3: Move to the next number and repeat until reaching n";
                } else if (!rec.hasStep4) {
                  parsed.correction = "In Step 4: Add the current number to the total sum.";
                  parsed.suggestedInput = "Step 4: Add the current number to the total sum";
                } else if (!rec.hasStep5) {
                  parsed.correction = "In Step 5: Display the final total sum.";
                  parsed.suggestedInput = "Step 5: Display the final total sum";
                }
              }
            }
            if (section === "ingredients") {
              const ing = validateSumOfNIngredients(userInput);
              parsed.ingredientsStepProgress = ing.ingredientsStepProgress;
              const feedbackIndicatesCompletion = !ing.hasPrintedInputVarInIngredients && !ing.hasWrongSumAccumulation && ing.hasInputVar && /ready to (?:move on|proceed)|taste the sample|everything is (?:perfectly )?in place|all \d+ ingredients (?:are )?verified|ingredients verified|solution verified/i.test(parsed.feedback || "");
              if (ing.allIngredientsDone || (feedbackIndicatesCompletion && (ing.completedCount >= 3 || parsed.correct === true) && !ing.hasPrintedInputVarInIngredients && ing.hasInputVar)) {
                parsed.correct = true;
                if (!parsed.feedback || parsed.feedback.trim().length === 0 || !feedbackIndicatesCompletion) {
                  parsed.feedback = ing.feedback || "\u{1F389} Ingredients Verified! Brilliant work! You've identified all 5 essential programming ingredients, including your loop and sum accumulation step (sum = sum + i). You're ready to proceed to Taste the Sample stage to assemble your code!";
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput);
                }
                parsed.correction = "Proceed to Taste the sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
                if (parsed.ingredientsStepProgress) {
                  parsed.ingredientsStepProgress.forEach(s => { s.completed = true; s.current = false; });
                }
              } else {
                parsed.correct = false;
                if (ing.hasWrongSumAccumulation || ing.hasPrintedInputVarInIngredients || !ing.hasInputVar) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", latestInput);
                  parsed.correction = ing.correction;
                  parsed.suggestedInput = ing.suggestedInput;
                } else if (feedbackIndicatesCompletion) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                } else {
                  if (!parsed.feedback || parsed.feedback.trim().length === 0) {
                    parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || ing.feedback, "ingredients", latestInput);
                  }
                  const mentionsForLoop = /for\s*loop|\bfor\b/i.test(userInput) || /for\s*loop|\bfor\b/i.test(latestInput) || ing.hasLoopConstruct;
                  const hasLoopParams = /\bstart\b/i.test(userInput) && /\bend\b/i.test(userInput) && (/\bnext\s*step\b/i.test(userInput) || /\bstep\b/i.test(userInput) || /\bincrement\b/i.test(userInput));
                  if (mentionsForLoop && !hasLoopParams) {
                    const hasStart = /\bstart(?:s|\s*value)?\b/i.test(parsed.feedback);
                    const hasEnd = /\bend(?:s|\s*value)?\b/i.test(parsed.feedback);
                    const hasNextStep = /\bnext\s*step\b|\bincrement\b/i.test(parsed.feedback);
                    if (!hasStart || !hasEnd || !hasNextStep) {
                      const loopControlsNote = "In your for loop, make sure to specify what are the values for start, end, and next step:\n\u2022 Start value: 1 (starts at 1)\n\u2022 End value: n (or n + 1 in Python range to reach n)\n\u2022 Next step: increment by 1 (advances to the next number each step)";
                      if (parsed.feedback.includes("Using a loop construct is exactly the right way") || parsed.feedback.includes("Using a for loop")) {
                        parsed.feedback = parsed.feedback.replace(
                          /Using a (?:loop construct|for loop)[^.]*\./i,
                          `Using a for loop is exactly the right way to handle the repetition!

${loopControlsNote}
`
                        );
                      } else {
                        parsed.feedback = `${parsed.feedback}

${loopControlsNote}`;
                      }
                    }
                  } else if (hasLoopParams && !ing.hasOperators) {
                    parsed.feedback = "\u{1F31F} You are doing a wonderful job defining the boundaries for your loop! You have correctly identified the start (1), end (n), and next increment step (+1).\n\nNow, the main step is missing: inside the loop, we need to accumulate each number into our total sum using:\n`sum = sum + i` (or `sum += i`).\n\n\u{1F4A1} Why do we write `sum = sum + i`?\n\u2022 `sum` on the right side holds the previous total collected so far.\n\u2022 In each loop iteration, `i` holds the current number (1, 2, 3... up to n).\n\u2022 When we add `+ i`, the computer calculates the updated new total.\n\u2022 The assignment operator (`=`) then stores this updated new total back into `sum`.\n\u2022 If we only wrote `sum = i`, the earlier numbers would be overwritten and lost!\n\u2022 That is why we use `sum = sum + i` (or `sum += i`) to accumulate the running total.";
                  }
                  if (!ing.hasInputVar) {
                    parsed.correction = "Define input variable n.";
                    parsed.suggestedInput = "Step 1: n (input integer)";
                  } else if (!ing.hasAccumulator) {
                    parsed.correction = "Define accumulator variable sum = 0.";
                    parsed.suggestedInput = "Step 2: sum = 0";
                  } else if (!ing.hasLoopConstruct) {
                    parsed.correction = "Choose while loop or for loop to repeat from 1 to n.";
                    parsed.suggestedInput = "Step 3: for loop (or while loop)";
                  } else if (!ing.hasCounter) {
                    parsed.correction = "In your for loop, specify start = 1, end = n, next step = increment by 1 (or loop variable i from 1 to n).";
                    parsed.suggestedInput = "Step 4: start = 1, end = n, next step = +1";
                  } else if (!ing.hasOperators) {
                    parsed.correction = "Add the main step to update sum: sum = sum + i (or sum += i) using addition (+) and assignment (=).";
                    parsed.suggestedInput = "Step 5: sum = sum + i";
                  } else {
                    parsed.correction = "Specify print statement to display sum.";
                    parsed.suggestedInput = "print(sum)";
                  }
                }
              }
            }
            if (section === "samplecode") {
              const sampleVal = validateSumOfNSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
              if (sampleVal.isSyntaxQuery) {
                parsed.correct = false;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = sampleVal.suggestedInput;
              } else if (sampleVal.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (sampleVal.hasVarMismatch || sampleVal.hasStrictLessThan || !sampleVal.hasLoop) {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                  parsed.correction = sampleVal.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput;
                } else if (!sampleVal.hasPrint && sampleVal.hasInput && sampleVal.hasAccumulator && sampleVal.hasLoop && sampleVal.hasSumUpdate) {
                  parsed.feedback = sampleVal.feedback;
                  parsed.correction = sampleVal.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput);
                  parsed.correction = sampleVal.correction || parsed.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput || parsed.suggestedInput;
                } else {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                  parsed.correction = sampleVal.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput;
                }
              }
              const loopInquiry = /loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(userInput) || /loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(latestInput);
              if ((!sampleVal.hasLoop || loopInquiry || sampleVal.isSyntaxQuery) && parsed.feedback && !parsed.feedback.includes("```") && !parsed.feedback.includes("for (let")) {
                parsed.feedback += `

Here is how you can write the loop in different languages:

\u{1F40D} **Python:**
\`\`\`python
for i in range(1, n + 1):
\`\`\`

\u{1F4BB} **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= n; i++) {
}
\`\`\`

\u2615 **Java / C:**
\`\`\`java
for (int i = 1; i <= n; i++) {
}
\`\`\``;
                parsed.suggestedInput = "for (let i = 1; i <= n; i++)";
              }
            }
          }
          if (problemType === "factorial") {
            if (section === "logic") {
              const factLog = validateFactorialLogic(userInput);
              if (factLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = factLog.feedback || `🎉 Logic Approved! Spot on! You've clearly demonstrated how factorial accumulates step by step (for n=${factLog.detectedN}). You are ready to proceed to the Recipe stage!`;
                parsed.correction = "Proceed to the Recipe stage to write the step-by-step algorithm.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                parsed.feedback = factLog.feedback || synthesizeHumanTouch(matchedFirebase?.bestPair?.hint, "logic", latestInput);
                parsed.correction = factLog.correction || "Write the sequential multiplication steps.";
                parsed.suggestedInput = factLog.suggestedInput;
              }
              if (parsed.suggestedInput && (parsed.suggestedInput.toLowerCase().includes("step 1") || parsed.suggestedInput.toLowerCase().includes("accept a number") || parsed.suggestedInput.toLowerCase().includes("recipe"))) {
                parsed.suggestedInput = parsed.correct ? void 0 : factLog.suggestedInput;
              }
            }
            if (section === "recipe") {
              const rec = validateFactorialRecipe(userInput);
              parsed.recipeStepProgress = rec.recipeStepProgress;
              if (rec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback || "\u{1F389} Recipe Successful! Kudos! You've sequenced all the steps of the Factorial algorithm. Proceed to the Ingredients stage!";
                parsed.correction = "Proceed to Ingredients to identify variables and programming constructs.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (rec.currentMissingStep < 4 && (parsed.feedback?.toLowerCase().includes("display that final result") || parsed.feedback?.toLowerCase().includes("show the final result") || parsed.feedback?.toLowerCase().includes("display final result") || parsed.feedback?.toLowerCase().includes("print the final") || parsed.feedback?.toLowerCase().includes("where that final answer should be shown"))) {
                  parsed.feedback = rec.feedback;
                  parsed.correction = rec.correction;
                  parsed.suggestedInput = rec.suggestedInput;
                } else if (!parsed.feedback || parsed.feedback.trim().length === 0) {
                  parsed.feedback = rec.feedback || synthesizeHumanTouch(matchedFirebase?.bestPair?.hint, "recipe", latestInput);
                  parsed.correction = rec.correction;
                  parsed.suggestedInput = rec.suggestedInput;
                } else {
                  parsed.correction = rec.correction;
                  parsed.suggestedInput = rec.suggestedInput;
                }
              }
            }
            if (section === "ingredients") {
              const ing = validateFactorialIngredients(userInput);
              parsed.ingredientsStepProgress = ing.ingredientsStepProgress;
              if (ing.hasZeroFactMistake || ing.hasAdditionMistake || ing.hasLoopControlMistake) {
                parsed.correct = false;
                if (ing.hasLoopControlMistake) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", userInput);
                  parsed.correction = ing.correction;
                  parsed.suggestedInput = ing.suggestedInput;
                } else if (ing.hasZeroFactMistake) {
                  const geminiMentionsZero = Boolean(parsed.feedback && (parsed.feedback.toLowerCase().includes("zero") || parsed.feedback.toLowerCase().includes("0") || parsed.feedback.toLowerCase().includes("multipl")));
                  if (geminiMentionsZero) {
                    parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", userInput);
                  } else {
                    parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", userInput);
                  }
                  parsed.correction = ing.correction;
                  parsed.suggestedInput = ing.suggestedInput;
                } else if (ing.hasAdditionMistake) {
                  const geminiMentionsMultiply = Boolean(parsed.feedback && (parsed.feedback.toLowerCase().includes("product") || parsed.feedback.toLowerCase().includes("multipl") || parsed.feedback.toLowerCase().includes("add")));
                  if (geminiMentionsMultiply) {
                    parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", userInput);
                  } else {
                    parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", userInput);
                  }
                  parsed.correction = ing.correction;
                  parsed.suggestedInput = ing.suggestedInput;
                }
              } else if (ing.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = synthesizeHumanTouch(parsed.feedback || ing.feedback, "ingredients", userInput);
                parsed.correction = "Proceed to Taste the Sample stage to draft your prototype.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (!ing.hasLoopControls) {
                  if (!ing.hasLoopConstruct || parsed.feedback?.toLowerCase().includes("what happens inside") || parsed.feedback?.toLowerCase().includes("arithmetic operation") || parsed.feedback?.toLowerCase().includes("keep multiplying") || parsed.feedback?.toLowerCase().includes("multiply our running total") || parsed.feedback?.toLowerCase().includes("update our container") || parsed.feedback?.toLowerCase().includes("fact = fact *") || parsed.feedback?.toLowerCase().includes("step 5") || parsed.correction?.toLowerCase().includes("fact = fact *") || parsed.correction?.toLowerCase().includes("step 5")) {
                    parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", userInput);
                    parsed.correction = ing.correction;
                    parsed.suggestedInput = ing.suggestedInput;
                  } else if (parsed.feedback && parsed.feedback.trim().length > 0) {
                    parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", userInput);
                    parsed.correction = ing.correction || parsed.correction;
                    parsed.suggestedInput = ing.suggestedInput || parsed.suggestedInput;
                  } else {
                    parsed.feedback = synthesizeHumanTouch(ing.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                    parsed.correction = ing.correction;
                    parsed.suggestedInput = ing.suggestedInput;
                  }
                } else if (!ing.hasPrintStatement) {
                  parsed.correct = false;
                  if (parsed.feedback && parsed.feedback.trim().length > 0) {
                    const mentionsPrint = parsed.feedback.toLowerCase().includes("print") || parsed.feedback.toLowerCase().includes("display");
                    let humanFb = synthesizeHumanTouch(parsed.feedback, "ingredients", userInput);
                    if (!mentionsPrint) {
                      const detectedCont = ing.ingredientsStepProgress[1]?.title.split("=")[0]?.replace("Container Variable:", "")?.trim() || "fact";
                      humanFb += `

Now to finish our ingredients roster, what final statement do we need outside the loop to display or output our completed factorial product? (e.g. \`print(${detectedCont})\`)`;
                    }
                    parsed.feedback = humanFb;
                  } else {
                    parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", userInput);
                  }
                  parsed.correction = ing.correction || `Step 6: print(${ing.ingredientsStepProgress[1]?.title.split("=")[0]?.replace("Container Variable:", "")?.trim() || "fact"}) - Display the final factorial output outside the loop.`;
                  parsed.suggestedInput = ing.suggestedInput || `Step 6: print(${ing.ingredientsStepProgress[1]?.title.split("=")[0]?.replace("Container Variable:", "")?.trim() || "fact"})`;
                } else if (parsed.feedback && parsed.feedback.trim().length > 0) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", userInput);
                  parsed.correction = ing.correction || parsed.correction;
                  parsed.suggestedInput = ing.suggestedInput || parsed.suggestedInput;
                } else {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                  parsed.correction = ing.correction;
                  parsed.suggestedInput = ing.suggestedInput;
                }
              }
            }
            if (section === "samplecode") {
              const sampleVal = validateFactorialSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
              const feedbackIndicatesCompletion = /officially completed|successfully assembled all the pieces|ready to (?:run this code|execute|proceed|taste the sample)|all \d+ steps (?:of the [a-z]+ algorithm )?(?:are )?verified|sample (?:code )?verified|taste the sample verified/i.test(parsed.feedback || "");
              if (sampleVal.isSyntaxQuery) {
                parsed.correct = false;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = sampleVal.suggestedInput;
              } else if (sampleVal.allVerified || (feedbackIndicatesCompletion && parsed.correct === true)) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = void 0;
                if (parsed.sampleCodeStepProgress) {
                  parsed.sampleCodeStepProgress.forEach(s => { s.completed = true; s.current = false; });
                }
              } else {
                parsed.correct = false;
                if (feedbackIndicatesCompletion) {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                } else if (!sampleVal.hasPrint && sampleVal.hasInput && sampleVal.hasAccumulator && sampleVal.hasLoop && sampleVal.hasProductUpdate) {
                  parsed.feedback = sampleVal.feedback;
                  parsed.correction = sampleVal.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput);
                  parsed.correction = sampleVal.correction || parsed.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput || parsed.suggestedInput;
                } else {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                  parsed.correction = sampleVal.correction;
                  parsed.suggestedInput = sampleVal.suggestedInput;
                }
              }
              const loopInquiry = /loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(userInput) || /loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(latestInput);
              if ((!sampleVal.hasLoop || loopInquiry || sampleVal.isSyntaxQuery) && parsed.feedback && !parsed.feedback.includes("```") && !parsed.feedback.includes("for (let")) {
                const varName = sampleVal.detectedInputName || "a";
                parsed.feedback += `

Here is how you can write the loop using your variable \`${varName}\`:

\u{1F40D} **Python:**
\`\`\`python
for i in range(1, ${varName} + 1):
\`\`\`

\u{1F4BB} **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= ${varName}; i++) {
}
\`\`\`

\u2615 **Java / C / C++:**
\`\`\`java
for (int i = 1; i <= ${varName}; i++) {
}
\`\`\``;
                parsed.suggestedInput = `for (let i = 1; i <= ${varName}; i++)`;
              }
            }
          }
          if (problemType === "divisor-of-a-number") {
            if (section === "logic") {
              const divLog = validateDivisorLogic(userInput);
              if (divLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "mathematical";
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && parsed.feedback.includes("divisors of") ? synthesizeHumanTouch(parsed.feedback, "logic", latestInput) : divLog.feedback || "\u{1F389} Logic Approved! Excellent work! You've clearly identified how to find the divisors of a number by testing all numbers from 1 to n. You are ready to proceed to the Recipe stage!";
                parsed.correction = "Proceed to the Recipe stage to write the step-by-step algorithm.";
                parsed.suggestedInput = void 0;
                const analysis = extractDivisorInputAnalysis(userInput);
                const hasDetailedDivisors = analysis ? analysis.divisors.every((d) => parsed.feedback.includes(String(d))) && /divisible|divisors? of/i.test(parsed.feedback) : /divisible|divisors? of/i.test(parsed.feedback);
                if (!hasDetailedDivisors) {
                  parsed.feedback += formatDivisorBreakdown(analysis);
                }
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(divLog.feedback, "logic", latestInput);
                }
                parsed.correction = divLog.correction || "Mention which numbers are divisible (leave remainder 0).";
                parsed.suggestedInput = divLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const rec = validateDivisorRecipe(userInput);
              parsed.recipeStepProgress = rec.recipeStepProgress;
              const feedbackIndicatesCompletion = /ready to (?:move on|proceed)|proceed to ingredients|recipe (?:is )?verified|recipe successful/i.test(parsed.feedback || "");
              if (rec.isFullyVerified || (feedbackIndicatesCompletion && (rec.completedCount >= 3 || parsed.correct === true))) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput) : rec.feedback || "\u{1F389} Recipe Successful! Kudos! You've sequenced all the steps of the Divisors of a Number algorithm in plain English. Proceed to the Ingredients stage!";
                parsed.correction = "Proceed to Ingredients to identify variables and programming constructs.";
                parsed.suggestedInput = void 0;
                if (parsed.recipeStepProgress) {
                  parsed.recipeStepProgress.forEach(s => { s.completed = true; s.current = false; });
                }
              } else {
                parsed.correct = false;
                if (feedbackIndicatesCompletion) {
                  parsed.feedback = synthesizeHumanTouch(rec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput);
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(rec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput);
                }
                parsed.correction = rec.correction || parsed.correction;
                parsed.suggestedInput = rec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const ing = validateDivisorIngredients(userInput);
              parsed.ingredientsStepProgress = ing.ingredientsStepProgress;
              const feedbackIndicatesCompletion = /ready to (?:move on|proceed)|taste the sample|everything is (?:perfectly )?in place|all \d+ ingredients (?:are )?verified|ingredients verified|solution verified/i.test(parsed.feedback || "");
              if (ing.isFullyVerified || (feedbackIndicatesCompletion && (ing.completedStepsCount >= 3 || parsed.correct === true))) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput) : (ing.feedback || "\u{1F389} Ingredients Verified! Brilliant work! You've identified all the key programming ingredients: input variable n, loop from 1 to n, modulo condition (n % i == 0), and print(i). You are ready to assemble your sample code!");
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
                if (parsed.ingredientsStepProgress) {
                  parsed.ingredientsStepProgress.forEach(s => { s.completed = true; s.current = false; });
                }
              } else {
                parsed.correct = false;
                if (feedbackIndicatesCompletion) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                } else if (ing.hasLoopStepDecrement) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", latestInput);
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput);
                } else if (ing.hasLoopConfusionWithIf || ing.needsIfConditionHint || ing.hasLoop && !ing.hasCondition) {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback, "ingredients", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(ing.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                }
                parsed.correction = ing.correction || parsed.correction;
                parsed.suggestedInput = ing.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const sampleVal = validateDivisorSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
              const feedbackIndicatesCompletion = /ready to (?:move on|proceed)|code verified|all tests passed|sample code complete|taste the sample verified/i.test(parsed.feedback || "");
              if (sampleVal.allVerified || (feedbackIndicatesCompletion && parsed.correct === true)) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : sampleVal.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
                if (parsed.sampleCodeStepProgress) {
                  parsed.sampleCodeStepProgress.forEach(s => { s.completed = true; s.current = false; });
                }
              } else {
                parsed.correct = false;
                if (feedbackIndicatesCompletion) {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput);
                } else if (sampleVal.feedback) {
                  parsed.feedback = synthesizeHumanTouch(sampleVal.feedback, "samplecode", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput);
                }
                parsed.correction = sampleVal.correction || parsed.correction;
                parsed.suggestedInput = sampleVal.suggestedInput || parsed.suggestedInput;
              }
            }
          }
          if (problemType === "multiplication-table") {
            if (section === "logic") {
              const mulLog = validateMultiplicationLogic(userInput);
              if (mulLog.isFullyVerified && parsed.correct) {
                parsed.correct = true;
                parsed.proofType = "mathematical";
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "logic", latestInput) : mulLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to write the step-by-step algorithm.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(mulLog.feedback || matchedFirebase?.bestPair?.hint, "logic", latestInput);
                }
                parsed.correction = mulLog.correction || parsed.correction;
                parsed.suggestedInput = mulLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const mulRec = validateMultiplicationRecipe(userInput);
              parsed.recipeStepProgress = mulRec.recipeStepProgress;
              if (mulRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput) : mulRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(mulRec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput);
                }
                parsed.correction = mulRec.correction || parsed.correction;
                parsed.suggestedInput = mulRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const mulIng = validateMultiplicationIngredients(userInput);
              parsed.ingredientsStepProgress = mulIng.ingredientsStepProgress;
              if (mulIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput) : mulIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (mulIng.hasLoopBoundsBug || mulIng.hasLoopStartBug || mulIng.hasLoopStepDecrement || mulIng.hasWrongOperatorBug || mulIng.hasPrintOutsideBug) {
                  parsed.feedback = synthesizeHumanTouch(mulIng.feedback, "ingredients", latestInput);
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput);
                } else {
                  parsed.feedback = synthesizeHumanTouch(mulIng.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput);
                }
                parsed.correction = mulIng.correction || parsed.correction;
                parsed.suggestedInput = mulIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const mulSample = validateMultiplicationSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = mulSample.sampleCodeStepProgress;
              if (mulSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = "\u{1F31F} Coach Maara here! Outstanding work! \u{1F389} You have successfully assembled all 4 essential ingredients for your multiplication table prototype: input variable declaration, loop from 1 to 10, calculating the product, and printing each step. You have mastered the prototype and are ready to proceed to the complete code editor!";
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (!mulSample.hasFormattedPrint && mulSample.hasInput && mulSample.hasLoop && mulSample.hasProductCalculation) {
                  parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && (parsed.feedback.toLowerCase().includes("print") || parsed.feedback.toLowerCase().includes("display")) ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput) : mulSample.feedback;
                  parsed.correction = mulSample.correction || "Print the table row inside the loop (e.g. print(res) or print(a + ' x ' + i + ' = ' + res)).";
                  parsed.suggestedInput = mulSample.suggestedInput || "print(res);";
                } else if (!mulSample.hasProductCalculation && mulSample.hasInput && mulSample.hasLoop) {
                  parsed.feedback = mulSample.feedback;
                  parsed.correction = mulSample.correction;
                  parsed.suggestedInput = mulSample.suggestedInput;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput);
                  parsed.correction = mulSample.correction || parsed.correction;
                  parsed.suggestedInput = mulSample.suggestedInput || parsed.suggestedInput;
                } else if (mulSample.feedback) {
                  parsed.feedback = synthesizeHumanTouch(mulSample.feedback, "samplecode", latestInput);
                  parsed.correction = mulSample.correction || parsed.correction;
                  parsed.suggestedInput = mulSample.suggestedInput || parsed.suggestedInput;
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput);
                  parsed.correction = mulSample.correction || parsed.correction;
                  parsed.suggestedInput = mulSample.suggestedInput || parsed.suggestedInput;
                }
              }
            }
          }
          if (problemType === "even-numbers-1-to-50") {
            if (section === "logic") {
              const evenLog = validateEvenNumbers1To50Logic(userInput, attemptCount);
              if (evenLog.isFullyVerified && parsed.correct) {
                parsed.correct = true;
                parsed.proofType = "mathematical";
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount) : evenLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to write the step-by-step algorithm.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPremature = /proceed to (?:recipe|ingredients|taste the sample|sample code|compiler)|congratulations|hurray|kudos|stage completed|all \d+ steps completed|ready to (?:proceed|run|move on)/i.test(parsed.feedback || "");
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !isPremature && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(evenLog.feedback || matchedFirebase?.bestPair?.hint, "logic", latestInput, attemptCount);
                }
                parsed.correction = evenLog.correction || parsed.correction;
                parsed.suggestedInput = evenLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const evenRec = validateEvenNumbers1To50Recipe(userInput, attemptCount);
              parsed.recipeStepProgress = evenRec.recipeStepProgress;
              if (evenRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : evenRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPremature = /proceed to (?:ingredients|taste the sample|sample code|compiler)|congratulations|hurray|kudos|stage completed|all \d+ steps completed|ready to (?:proceed|run|move on)/i.test(parsed.feedback || "");
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !isPremature && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(evenRec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput, attemptCount);
                }
                parsed.correction = evenRec.correction || parsed.correction;
                parsed.suggestedInput = evenRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const evenIng = validateEvenNumbers1To50Ingredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = evenIng.ingredientsStepProgress;
              if (evenIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : evenIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPremature = /proceed to (?:taste the sample|sample code|compiler)|congratulations|hurray|kudos|stage completed|all \d+ steps completed|ready to (?:proceed|run|move on)/i.test(parsed.feedback || "");
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !isPremature && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(evenIng.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = evenIng.correction || parsed.correction;
                parsed.suggestedInput = evenIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const evenSample = validateEvenNumbers1To50SampleCode(userInput, attemptCount);
              if (evenSample.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : evenSample.feedback;
                parsed.correction = "All done! Run the code and submit.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPremature = /proceed to compiler|all \d+ steps completed|ready to run/i.test(parsed.feedback || "");
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !isPremature && !parsed.feedback.includes("Before we evaluate") && !evenSample.feedback.includes("Missing `if` keyword") && !evenSample.feedback.includes("Wrong print target")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(evenSample.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = evenSample.correction || parsed.correction;
              }
            }
          }
          if (problemType === "prime-number") {
            if (section === "logic") {
              const primeLog = validatePrimeLogic(userInput, attemptCount);
              if (primeLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "mathematical";
                parsed.feedback = primeLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the algorithmic steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(primeLog.feedback || matchedFirebase?.bestPair?.hint, "logic", latestInput, attemptCount);
                }
                parsed.correction = primeLog.correction || parsed.correction;
                parsed.suggestedInput = primeLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const primeRec = validatePrimeRecipe(userInput);
              parsed.recipeStepProgress = primeRec.recipeStepProgress;
              if (primeRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = primeRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(primeRec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput, attemptCount);
                }
                parsed.correction = primeRec.correction || parsed.correction;
                parsed.suggestedInput = primeRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const primeIng = validatePrimeIngredients(userInput);
              parsed.ingredientsStepProgress = primeIng.ingredientsStepProgress;
              if (primeIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = primeIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (primeIng.hasLoopStartBug || primeIng.hasLoopDecrementBug || primeIng.hasLoopStartZeroBug || primeIng.hasLoopStopInclusiveWith2Bug || primeIng.hasWhileForDivisorCheckBug || primeIng.hasMissingConditionOperatorBug) {
                  parsed.feedback = synthesizeHumanTouch(primeIng.feedback, "ingredients", latestInput, attemptCount);
                  parsed.correction = primeIng.correction;
                  parsed.suggestedInput = primeIng.suggestedInput;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(primeIng.feedback || matchedFirebase?.bestPair?.hint, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = primeIng.correction || parsed.correction;
                parsed.suggestedInput = primeIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const primeSample = validatePrimeSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = primeSample.sampleCodeStepProgress;
              if (primeSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = "\u{1F31F} Coach Maara here! Outstanding work! \u{1F389} You have successfully assembled all essential ingredients for your prime number checker prototype: declaring variables, counting divisors with a loop, testing divisibility with modulo, and printing the Prime/Not Prime verdict. You have mastered the prototype and are ready to proceed to the complete code editor!";
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (primeSample.feedback) {
                  parsed.feedback = primeSample.feedback;
                  parsed.correction = primeSample.correction;
                  parsed.suggestedInput = primeSample.suggestedInput;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                  parsed.correction = primeSample.correction || parsed.correction;
                  parsed.suggestedInput = primeSample.suggestedInput || parsed.suggestedInput;
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                  parsed.correction = primeSample.correction || parsed.correction;
                  parsed.suggestedInput = primeSample.suggestedInput || parsed.suggestedInput;
                }
              }
            }
          }
          if (problemType === "next-prime-number") {
            if (section === "logic") {
              const npLog = validateNextPrimeLogic(userInput);
              if (npLog.isFullyVerified || parsed.correct === true && !npLog.hasFatalMisconception) {
                parsed.correct = true;
                parsed.proofType = npLog.isMathematicalExplanation ? "mathematical" : "theoretical";
                if (!parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = npLog.feedback;
                }
                parsed.correction = "Proceed to the Recipe stage to sequence the algorithmic steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                } else if (npLog.feedback) {
                  parsed.feedback = synthesizeHumanTouch(npLog.feedback, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(npLog.feedback || matchedFirebase?.bestPair?.hint, "logic", latestInput, attemptCount);
                }
                parsed.correction = npLog.correction || parsed.correction;
                parsed.suggestedInput = npLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const npRec = validateNextPrimeRecipe(userInput);
              parsed.recipeStepProgress = npRec.stepProgress;
              if (npRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : npRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate, write down")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else if (npRec.feedback) {
                  parsed.feedback = synthesizeHumanTouch(npRec.feedback, "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(npRec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput, attemptCount);
                }
                parsed.correction = npRec.correction || parsed.correction;
                parsed.suggestedInput = npRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const npIng = validateNextPrimeIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = npIng.stepProgress;
              if (npIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : npIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /gathered all|ingredients verified|successfully identified|all (?:the )?necessary ingredients|proud of how|mastered the prototype|proceed to/i.test(parsed.feedback || "");
                if (isPrematureCongrats || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = npIng.feedback;
                } else {
                  parsed.feedback = synthesizeHumanTouch(npIng.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = npIng.correction || parsed.correction;
                parsed.suggestedInput = npIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const npSample = validateNextPrimeSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = npSample.sampleCodeStepProgress;
              if (npSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : npSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isInnerLoopConfusion = !npSample.hasOuterLoop && /inner loop|primality|divisors|modulo|i < b/i.test(parsed.feedback || "");
                if (isInnerLoopConfusion || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(npSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = npSample.correction || parsed.correction;
                parsed.suggestedInput = npSample.suggestedInput || parsed.suggestedInput;
              }
            }
          }
          if (problemType === "prime-between-range") {
            if (section === "logic") {
              const prLog = validatePrimeRangeLogic(userInput);
              const hasErroneousCompositeDemand = /other numbers|composite|search|remaining numbers/i.test(parsed.feedback || "") && prLog.isFullyVerified;
              if (prLog.isFullyVerified || parsed.correct === true && !prLog.hasFatalMisconception) {
                parsed.correct = true;
                parsed.proofType = prLog.isMathematicalProof ? "mathematical" : "theoretical";
                if (hasErroneousCompositeDemand || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = prLog.feedback;
                }
                parsed.correction = "Proceed to the Recipe stage to sequence the algorithmic steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (hasErroneousCompositeDemand || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(prLog.feedback, "logic", latestInput, attemptCount);
                } else if (parsed.feedback && parsed.feedback.trim().length > 20) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                }
                parsed.correction = prLog.correction || parsed.correction;
                parsed.suggestedInput = prLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const prRec = validatePrimeRangeRecipe(userInput);
              parsed.recipeStepProgress = prRec.stepProgress;
              if (prRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : prRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else if (prRec.feedback) {
                  parsed.feedback = synthesizeHumanTouch(prRec.feedback, "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(prRec.feedback || matchedFirebase?.bestPair?.hint, "recipe", latestInput, attemptCount);
                }
                parsed.correction = prRec.correction || parsed.correction;
                parsed.suggestedInput = prRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const prIng = validatePrimeRangeIngredients(userInput);
              parsed.ingredientsStepProgress = prIng.stepProgress;
              if (prIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : prIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready for the final step|final step|last step|last condition|is (?:a )?prime number|count\s*==\s*2|step 6|gathered all|ingredients verified|mastered/i.test(parsed.feedback || "");
                const hasStep5Mismatch = !prIng.moduloCheckIdentified && isPrematureCongrats;
                if (hasStep5Mismatch || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = prIng.feedback;
                } else if (parsed.feedback && parsed.feedback.trim().length > 20) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(prIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                }
                parsed.correction = prIng.correction || parsed.correction;
                parsed.suggestedInput = prIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const prSample = validatePrimeRangeSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = prSample.sampleCodeStepProgress;
              if (prSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : prSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const hasSpecificBugDiagnostic = prSample.feedback && prSample.feedback.includes("\u{1F50D}");
                const isInnerLoopConfusion = !prSample.hasOuterLoop && /inner loop|primality|divisors|modulo|count == 2/i.test(parsed.feedback || "");
                if (hasSpecificBugDiagnostic || isInnerLoopConfusion || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(prSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = prSample.correction || parsed.correction;
                parsed.suggestedInput = prSample.suggestedInput || parsed.suggestedInput;
              }
            }
          }
          if (problemType === "sexy-prime-number") {
            if (section === "logic") {
              const spLog = validateSexyPrimeLogic(userInput);
              if (spLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = spLog.proofType || "mathematical";
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount) : spLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the algorithmic steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(spLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                }
                parsed.correction = spLog.correction || parsed.correction;
                parsed.suggestedInput = spLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const spRec = validateSexyPrimeRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = spRec.stepProgress;
              if (spRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : spRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to move forward|all \d+ steps|wonderful job|recipe verified|mastered|successfully connected all the pieces|proceed to|great job|kudos/i.test(parsed.feedback || "");
                if (!isPrematureCongrats && parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else if (spRec.feedback) {
                  parsed.feedback = synthesizeHumanTouch(spRec.feedback, "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                }
                parsed.correction = spRec.correction || parsed.correction;
                parsed.suggestedInput = spRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const spIng = validateSexyPrimeIngredients(userInput);
              parsed.ingredientsStepProgress = spIng.stepProgress;
              if (spIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : spIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to move forward|all \d+ steps|wonderful job|ingredients verified|mastered|proceed to/i.test(parsed.feedback || "");
                if (!isPrematureCongrats && parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                } else if (spIng.feedback) {
                  parsed.feedback = synthesizeHumanTouch(spIng.feedback, "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                }
                parsed.correction = spIng.correction || parsed.correction;
                parsed.suggestedInput = spIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const spSample = validateSexyPrimeSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = spSample.sampleCodeStepProgress;
              if (spSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : spSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to run|mastered|all \d+ steps|all verified|taste the sample verified|you gotcha|outstanding prototype/i.test(parsed.feedback || "");
                const hasSpecificBug = spSample.feedback && spSample.feedback.includes("\u{1F50D}");
                if (hasSpecificBug || isPrematureCongrats || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(spSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = spSample.correction || parsed.correction;
                parsed.suggestedInput = spSample.suggestedInput || parsed.suggestedInput;
              }
            }
          }
          if (problemType === "positive-negative") {
            if (section === "logic") {
              const pnLog = validatePositiveNegativeLogic(userInput);
              if (pnLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount) : pnLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to run|mastered|all \d+ steps|all verified|proceed to recipe|recipe stage|spot on|great job|hurray|completed the logic|logic successful/i.test(parsed.feedback || "");
                if (isPrematureCongrats || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(pnLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = pnLog.correction || parsed.correction;
                parsed.suggestedInput = pnLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const pnRec = validatePositiveNegativeRecipe(userInput);
              parsed.recipeStepProgress = pnRec.recipeStepProgress;
              if (pnRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : pnRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to run|mastered|all \d+ steps|all verified|proceed to ingredients|ingredients stage|kudos|hurray|spot on|great job|completed the recipe|recipe successful|complete step-by-step recipe/i.test(parsed.feedback || "");
                const isDumpingAllSteps = /1\.\s*get.*2\.\s*check.*3\.\s*check|step 1.*step 2.*step 3.*step 4|1\.\s*get.*2\.\s*check.*3\.\s*if|1\.\s*get the number.*2\.\s*check/i.test(parsed.feedback || "") || /1\.\s*get.*2\.\s*check|step 1.*step 2.*step 3/i.test(parsed.correction || "");
                if (isPrematureCongrats || isDumpingAllSteps || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(pnRec.feedback || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = pnRec.correction || parsed.correction;
                parsed.suggestedInput = pnRec.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "ingredients") {
              const pnIng = validatePositiveNegativeIngredients(userInput);
              parsed.ingredientsStepProgress = pnIng.ingredientsStepProgress;
              if (pnIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : pnIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isPrematureCongrats = /ready to run|mastered|all \d+ steps|all verified|ingredients verified|proceed to|hurray|you defined every|spot on|great job you identified/i.test(parsed.feedback || "");
                if (isPrematureCongrats || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(pnIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = pnIng.correction || parsed.correction;
                parsed.suggestedInput = pnIng.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "samplecode") {
              const pnSample = validatePositiveNegativeSampleCode(userInput);
              parsed.sampleCodeStepProgress = pnSample.sampleCodeStepProgress;
              if (pnSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : pnSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(pnSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                }
                parsed.correction = pnSample.correction || parsed.correction;
                parsed.suggestedInput = pnSample.suggestedInput || parsed.suggestedInput;
              }
            }
          }
          if (problemType === "three-digit-number") {
            if (section === "logic") {
              const tdLog = validateThreeDigitLogic(userInput);
              if (tdLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = tdLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(tdLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || tdLog.correction;
                parsed.suggestedInput = parsed.suggestedInput || tdLog.suggestedInput;
              }
            }
            if (section === "recipe") {
              const tdRec = validateThreeDigitRecipe(userInput);
              const geminiSteps = Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : [];
              const mergedProgress = tdRec.recipeStepProgress.map((step, idx) => {
                const gStep = geminiSteps[idx];
                if (idx === 2 && tdRec.hasStep3NegationError) {
                  return { ...step, completed: false, current: true };
                }
                const isCompleted = step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              if (tdRec.hasStep3NegationError) {
                mergedProgress[2].completed = false;
                mergedProgress.forEach((s, i) => {
                  s.current = i === 2;
                });
              } else {
                const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
                if (firstIncompleteIdx >= 0) {
                  mergedProgress.forEach((s, i) => {
                    s.current = i === firstIncompleteIdx;
                  });
                }
              }
              const allStepsCompleted = !tdRec.hasStep3NegationError && !tdRec.hasBranchContradiction && mergedProgress.every((s) => s.completed);
              parsed.recipeStepProgress = mergedProgress;
              if (allStepsCompleted) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : tdRec.feedback;
                parsed.correction = "Proceed to Ingredients stage!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all \d+ steps completed/i.test(parsed.feedback || "");
                if (tdRec.hasStep3NegationError || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(tdRec.feedback || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = tdRec.hasStep3NegationError ? tdRec.correction : geminiCorrection || tdRec.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? tdRec.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const tdIng = validateThreeDigitIngredients(userInput);
              const geminiSteps = Array.isArray(parsed.ingredientsStepProgress) ? parsed.ingredientsStepProgress : [];
              const mergedProgress = tdIng.ingredientsStepProgress.map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = step.stepNumber === 2 && !step.completed ? false : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress[firstIncompleteIdx].current = true;
              }
              const allStepsCompleted = mergedProgress.every((s) => s.completed);
              parsed.ingredientsStepProgress = mergedProgress;
              if (allStepsCompleted) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : tdIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(tdIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || tdIng.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? tdIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const tdSample = validateThreeDigitSampleCode(userInput);
              parsed.sampleCodeStepProgress = tdSample.sampleCodeStepProgress;
              if (tdSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : tdSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified|all verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(tdSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || tdSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? tdSample.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "voting-eligibility") {
            if (section === "logic") {
              const voteLog = validateVotingEligibilityLogic(userInput);
              if (voteLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = voteLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                if (voteLog.claimsBoundary18Ineligible || voteLog.claimsOver18Ineligible || voteLog.claimsUnder18Eligible || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(voteLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = voteLog.correction || parsed.correction;
                parsed.suggestedInput = voteLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const voteRec = validateVotingEligibilityRecipe(userInput);
              const geminiSteps = Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : [];
              const mergedProgress = (voteRec.recipeStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = voteRec.hasRecipeContradiction || voteRec.hasBoundaryContradiction ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.recipeStepProgress = mergedProgress;
              if (allStepsCompleted && voteRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : voteRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to identify variables and operators.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (voteRec.hasBoundaryContradiction || voteRec.hasRecipeContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(voteRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = voteRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? voteRec.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const voteIng = validateVotingEligibilityIngredients(userInput);
              const geminiSteps = Array.isArray(parsed.ingredientsStepProgress) ? parsed.ingredientsStepProgress : [];
              const mergedProgress = (voteIng.ingredientsStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = voteIng.hasUnquotedPrint ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress[firstIncompleteIdx].current = true;
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.ingredientsStepProgress = mergedProgress;
              if (allStepsCompleted && !voteIng.hasUnquotedPrint && voteIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : voteIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                const isRegressingToStep1 = voteIng.ingredientsStepProgress[0]?.completed && /try writing.*step 1|let's look at our first ingredient|first ingredient for this problem|first step|write out step 1|store the person's age/i.test(parsed.feedback || "");
                if (voteIng.hasUnquotedPrint || isRegressingToStep1 || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(voteIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = voteIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || voteIng.hasUnquotedPrint ? voteIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const voteSample = validateVotingEligibilitySampleCode(userInput);
              parsed.sampleCodeStepProgress = voteSample.sampleCodeStepProgress;
              if (voteSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : voteSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (voteSample.hasElseWithCondition || voteSample.hasElseBoundaryError || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(voteSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || voteSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || voteSample.hasElseWithCondition || voteSample.hasElseBoundaryError ? geminiCorrection ? parsed.suggestedInput || voteSample.suggestedInput : voteSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "pass-or-fail") {
            if (section === "logic") {
              const passLog = validatePassFailLogic(userInput);
              if (passLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = passLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                if (passLog.strictlyGreaterOmits35 || passLog.claimsBoundary35Failed || passLog.claimsOver35Failed || passLog.claimsUnder35Passed || !passLog.hasPassOutcome || !passLog.hasFailOutcome || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(passLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = passLog.correction || parsed.correction;
                parsed.suggestedInput = passLog.suggestedInput || parsed.suggestedInput;
              }
            }
            if (section === "recipe") {
              const passRec = validatePassFailRecipe(userInput);
              const geminiSteps = Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : [];
              const mergedProgress = (passRec.recipeStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = passRec.hasRecipeContradiction || passRec.hasBoundaryContradiction || passRec.hasRecipeStrictlyGreaterOmission ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.recipeStepProgress = mergedProgress;
              if (passRec.isFullyVerified || allStepsCompleted) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : passRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the components!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (passRec.hasRecipeContradiction || passRec.hasBoundaryContradiction || passRec.hasRecipeStrictlyGreaterOmission || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(passRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = passRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || passRec.hasRecipeContradiction || passRec.hasBoundaryContradiction || passRec.hasRecipeStrictlyGreaterOmission ? passRec.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const passIng = validatePassFailIngredients(userInput);
              const geminiSteps = Array.isArray(parsed.ingredientsStepProgress) ? parsed.ingredientsStepProgress : [];
              const mergedProgress = (passIng.ingredientsStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = passIng.hasUnquotedPrint ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.ingredientsStepProgress = mergedProgress;
              if (passIng.isFullyVerified || allStepsCompleted) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : passIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                const isRegressingToStep1 = passIng.ingredientsStepProgress?.[0]?.completed && /try writing.*step 1|let's look at our first ingredient|first ingredient for this problem|first step|write out step 1|store the student's mark/i.test(parsed.feedback || "");
                if (passIng.hasUnquotedPrint || isRegressingToStep1 || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(passIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = passIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || passIng.hasUnquotedPrint ? passIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const passSample = validatePassFailSampleCode(userInput);
              parsed.sampleCodeStepProgress = passSample.sampleCodeStepProgress;
              if (passSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : passSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (passSample.hasElseWithCondition || passSample.hasElseBoundaryError || passSample.hasInvertedBranches || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(passSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || passSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || passSample.hasElseWithCondition || passSample.hasElseBoundaryError ? geminiCorrection ? parsed.suggestedInput || passSample.suggestedInput : passSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "greater-than-100") {
            if (section === "logic") {
              const gtLog = validateGreaterThan100Logic(userInput);
              if (gtLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = gtLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                const hasContradiction = gtLog.claims100IsGreater || gtLog.claimsUnder100IsGreater || gtLog.claimsOver100IsNotGreater;
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|do here/i.test(userInput);
                if (hasContradiction) {
                  parsed.feedback = synthesizeHumanTouch(gtLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else if (!isQuestion && (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate"))) {
                  parsed.feedback = synthesizeHumanTouch(gtLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || gtLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? gtLog.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const gtRec = validateGreaterThan100Recipe(userInput);
              const geminiSteps = Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : [];
              const mergedProgress = (gtRec.recipeStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = gtRec.hasRecipeContradiction ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.recipeStepProgress = mergedProgress;
              const geminiFlaggedCritique = !parsed.correct || /\b(?:however|closer look|mistake|error|not correct|wouldn't be|revisit|contradiction|not the greatest|cannot be)\b/i.test(parsed.feedback || "");
              if (gtRec.isFullyVerified && allStepsCompleted && !gtRec.hasRecipeContradiction && !geminiFlaggedCritique) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") && !geminiFlaggedCritique ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : gtRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the components!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                const geminiAddressedIssue = Boolean(
                  parsed.feedback && parsed.feedback.trim().length >= 20 && !parsed.feedback.includes("Before we evaluate") && !isFalselyClaimingApproval && /\b(?:however|closer look|mistake|error|lesser|less than 100|not the greatest|cannot be|third|step 3|not greater|lowest|check your|instead|wouldn't be|revisit|contradiction)\b/i.test(parsed.feedback)
                );
                if (geminiAddressedIssue) {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                } else if (gtRec.hasRecipeContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(gtRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = gtRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || gtRec.hasRecipeContradiction ? gtRec.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const gtIng = validateGreaterThan100Ingredients(userInput);
              const hasWrongThresholdMatch = /(?:r\.?s|right\s*side)\s*[:=]?\s*(\d+)/i.exec(userInput);
              const wrongThresholdNum = hasWrongThresholdMatch && hasWrongThresholdMatch[1] !== "100" ? hasWrongThresholdMatch[1] : null;
              const mergedProgress = (gtIng.ingredientsStepProgress || []).map((step) => {
                return {
                  ...step,
                  completed: step.completed,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              parsed.ingredientsStepProgress = mergedProgress;
              if (gtIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") && !/take a closer look|belongs in the 'else' block|printing 'not greatest'/i.test(parsed.feedback) ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : gtIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                const isAskingNext = /\b(?:what(?:\s+is)?(?:\s+the)?\s+next(?:\s+step)?|next\s+step|what\s+next|next\s+enna)\b/i.test(userInput);
                const isStaleGuidanceForCompletedStep = firstIncompleteIdx >= 2 && /\b(?:if-condition next|break down this condition|left side|right side|step 2: if condition|to complete this step, try typing:\s*["']?step 2)\b/i.test(parsed.feedback || "") || firstIncompleteIdx >= 3 && /\b(?:inside if block|what message should we display right after this if|step 3)\b/i.test(parsed.feedback || "");
                const hasCriticalError = Boolean(wrongThresholdNum) || gtIng.hasInvertedIfPrint || gtIng.hasWrongRightSide;
                if (hasCriticalError || isStaleGuidanceForCompletedStep || isAskingNext || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(gtIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = gtIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || isAskingNext || Boolean(wrongThresholdNum) || gtIng.hasInvertedIfPrint || gtIng.hasWrongRightSide ? gtIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const gtSample = validateGreaterThan100SampleCode(userInput);
              parsed.sampleCodeStepProgress = gtSample.sampleCodeStepProgress;
              if (gtSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : gtSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (gtSample.hasElseWithCondition || gtSample.hasInvertedBranches || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(gtSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || gtSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || gtSample.hasElseWithCondition || gtSample.hasInvertedBranches ? geminiCorrection ? parsed.suggestedInput || gtSample.suggestedInput : gtSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "profit-or-loss") {
            if (section === "logic") {
              const plLog = validateProfitLossLogic(userInput);
              if (plLog.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = plLog.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                const hasContradiction = plLog.claimsCPGreaterThanSPIsProfit || plLog.claimsSPGreaterThanCPIsLoss || plLog.claimsProfitWhenSPLessThanCP || plLog.claimsLossWhenSPGreaterThanCP;
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|do here/i.test(userInput);
                if (hasContradiction) {
                  parsed.feedback = synthesizeHumanTouch(plLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else if (!isQuestion && (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate"))) {
                  parsed.feedback = synthesizeHumanTouch(plLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || plLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? plLog.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const plRec = validateProfitLossRecipe(userInput);
              const geminiSteps = Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : [];
              const mergedProgress = (plRec.recipeStepProgress || []).map((step, idx) => {
                const gStep = geminiSteps[idx];
                const isCompleted = plRec.hasRecipeContradiction ? step.completed : step.completed || Boolean(gStep?.completed);
                return {
                  ...step,
                  completed: isCompleted,
                  current: false
                };
              });
              const firstIncompleteIdx = mergedProgress.findIndex((s) => !s.completed);
              if (firstIncompleteIdx >= 0) {
                mergedProgress.forEach((s, i) => {
                  s.current = i === firstIncompleteIdx;
                });
              }
              const allStepsCompleted = mergedProgress.length > 0 && mergedProgress.every((s) => s.completed);
              parsed.recipeStepProgress = mergedProgress;
              if (allStepsCompleted && !plRec.hasRecipeContradiction) {
                parsed.correct = true;
                parsed.feedback = plRec.feedback || "Kudos! You have written a crystal-clear recipe for determining profit or loss. Proceed to the Ingredients stage!";
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (plRec.hasRecipeContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(plRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = plRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || plRec.hasRecipeContradiction ? plRec.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const plIng = validateProfitLossIngredients(userInput);
              parsed.ingredientsStepProgress = plIng.ingredientsStepProgress;
              if (plIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : plIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (plIng.hasInvertedIfPrint || plIng.hasUnquotedPrint || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(plIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = plIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || plIng.hasInvertedIfPrint || plIng.hasUnquotedPrint ? plIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const plSample = validateProfitLossSampleCode(userInput);
              parsed.sampleCodeStepProgress = plSample.sampleCodeStepProgress;
              if (plSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : plSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (plSample.hasElseWithCondition || plSample.hasInvertedBranches || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(plSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || plSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || plSample.hasElseWithCondition || plSample.hasInvertedBranches ? geminiCorrection ? parsed.suggestedInput || plSample.suggestedInput : plSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "adult-or-minor") {
            if (section === "logic") {
              const amLog = validateAdultMinorLogic(userInput, attemptCount);
              parsed.operationTestCases = amLog.operationTestCases;
              if (amLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = amLog.feedback || parsed.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule/i.test(userInput);
                if (amLog.hasContradiction || !isQuestion && isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(amLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || amLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || amLog.hasContradiction ? amLog.suggestedInput ? stripCodeWords(amLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const amRec = validateAdultMinorRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = amRec.recipeStepProgress;
              if (amRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : amRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (amRec.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(amRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = amRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || amRec.hasContradiction ? amRec.suggestedInput ? stripCodeWords(amRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const amIng = validateAdultMinorIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = amIng.ingredientsStepProgress;
              if (amIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : amIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (amIng.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(amIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = amIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || amIng.hasContradiction ? amIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const amSample = validateAdultMinorSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = amSample.sampleCodeStepProgress;
              parsed.operationTestCases = amSample.operationTestCases;
              if (amSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : amSample.feedback || synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /prototype verified|chef-de-code prototype verified|all steps complete/i.test(parsed.feedback || "");
                if (amSample.hasElseWithCondition || amSample.hasInvertedBranches || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(amSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = amSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || amSample.hasElseWithCondition || amSample.hasInvertedBranches ? amSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "leap-year") {
            if (section === "logic") {
              const lyLog = validateLeapYearLogic(userInput, attemptCount);
              parsed.operationTestCases = lyLog.operationTestCases;
              if (lyLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = lyLog.feedback || parsed.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule/i.test(userInput);
                if (lyLog.hasContradiction || !isQuestion && isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(lyLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || lyLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || lyLog.hasContradiction ? lyLog.suggestedInput ? stripCodeWords(lyLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const lyRec = validateLeapYearRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = lyRec.recipeStepProgress;
              if (lyRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : lyRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (lyRec.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(lyRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = lyRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || lyRec.hasContradiction ? lyRec.suggestedInput ? stripCodeWords(lyRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const lyIng = validateLeapYearIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = lyIng.ingredientsStepProgress;
              if (lyIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : lyIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (lyIng.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(lyIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = lyIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || lyIng.hasContradiction ? lyIng.suggestedInput || parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const lySample = validateLeapYearSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = lySample.sampleCodeStepProgress;
              parsed.operationTestCases = lySample.operationTestCases;
              if (lySample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : lySample.feedback || synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (lySample.hasElseWithCondition || lySample.hasInvertedBranches || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(lySample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || lySample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || lySample.hasElseWithCondition || lySample.hasInvertedBranches ? geminiCorrection ? parsed.suggestedInput || lySample.suggestedInput : lySample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "divisible-by-5") {
            if (section === "logic") {
              const divLog = validateDivisibleBy5Logic(userInput, attemptCount);
              parsed.operationTestCases = divLog.operationTestCases;
              if (divLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = divLog.feedback || parsed.feedback;
                parsed.correction = "Proceed to the Recipe stage to sequence the steps.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified/i.test(parsed.feedback || "");
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|express|approach/i.test(userInput);
                if (divLog.hasContradiction || !isQuestion && isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(divLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || divLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || divLog.hasContradiction ? divLog.suggestedInput ? stripCodeWords(divLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const divRec = validateDivisibleBy5Recipe(userInput, attemptCount);
              parsed.recipeStepProgress = divRec.recipeStepProgress;
              if (divRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : divRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (divRec.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(divRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = divRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || divRec.hasContradiction ? divRec.suggestedInput ? stripCodeWords(divRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const divIng = validateDivisibleBy5Ingredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = divIng.ingredientsStepProgress;
              if (divIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : divIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(divIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || divIng.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || divIng.hasContradiction ? geminiCorrection ? parsed.suggestedInput || divIng.suggestedInput : divIng.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const divSample = validateDivisibleBy5SampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = divSample.sampleCodeStepProgress;
              parsed.operationTestCases = divSample.operationTestCases;
              if (divSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : divSample.feedback || synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(divSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || divSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? geminiCorrection ? parsed.suggestedInput || divSample.suggestedInput : divSample.suggestedInput : void 0;
              }
            }
          }
          if (problemType === "senior-citizen") {
            if (section === "logic") {
              const scLog = validateSeniorCitizenLogic(userInput, attemptCount);
              parsed.operationTestCases = scLog.operationTestCases;
              if (scLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = "\u{1F389} Logic Successful! Spot on! You have clearly explained the Senior Citizen rule and proved it with mathematical comparisons (tested age 70 >= 60 for Senior Citizen, and age 25 < 60 for Not Senior Citizen). Outstanding work! Proceed to Stage 2: Recipe.";
                parsed.correction = "Proceed to Stage 2: Recipe to sequence the algorithm step by step.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (!scLog.hasBoundaryCheck) {
                  parsed.feedback = synthesizeHumanTouch(scLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else if (parsed.feedback && parsed.feedback.trim().length >= 15 && !parsed.feedback.includes("Before we evaluate")) {
                  let sanitized = parsed.feedback.replace(/proceed to stage 2:? recipe/gi, "keep crafting your logic").replace(/proceed to recipe/gi, "continue refining your logic").replace(/you('re| are) ready to move on/gi, "you're making great progress");
                  parsed.feedback = synthesizeHumanTouch(sanitized, "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(scLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                }
                parsed.correction = scLog.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || scLog.hasContradiction || !scLog.hasMathematicalCheck || !scLog.hasBoundaryCheck ? scLog.suggestedInput ? stripCodeWords(scLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const scRec = validateSeniorCitizenRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = scRec.recipeStepProgress;
              if (scRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") && !parsed.feedback.toLowerCase().includes("missing") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : scRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps|completed the recipe|stage perfectly|well done|successfully identified all|spot on/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate") || !scRec.hasStep2Boundary || !scRec.hasStep2Otherwise) {
                  parsed.feedback = synthesizeHumanTouch(scRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = scRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 3 ? scRec.suggestedInput ? stripCodeWords(scRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const scIng = validateSeniorCitizenIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = scIng.ingredientsStepProgress;
              if (scIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : scIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                const isFalselyClaimingStep4 = !scIng.ingredientsStepProgress?.[3]?.completed && /correctly identified.*fallback|identified.*fallback|got the 'else'|structure ready/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || isFalselyClaimingStep4 || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(scIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                parsed.correction = scIng.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 3 ? scIng.suggestedInput ? stripCodeWords(scIng.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const scSample = validateSeniorCitizenSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = scSample.sampleCodeStepProgress;
              parsed.operationTestCases = scSample.operationTestCases;
              if (scSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = scSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                if (!parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(scSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                parsed.correction = scSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? (scSample.suggestedInput ? stripCodeWords(scSample.suggestedInput) : void 0) : void 0;
              }
            }
          }
          if (problemType === "vowel-or-consonant") {
            if (section === "logic") {
              const vcLog = validateVowelConsonantLogic(userInput, attemptCount);
              parsed.operationTestCases = vcLog.operationTestCases;
              if (vcLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = vcLog.feedback;
                parsed.correction = "Proceed to Stage 2: Recipe to sequence the algorithm step by step.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified|you nailed it|ready to move on|move on to/i.test(parsed.feedback || "");
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|express|approach/i.test(userInput);
                if (vcLog.hasContradiction || !isQuestion && isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(vcLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || vcLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || vcLog.hasContradiction ? vcLog.suggestedInput ? stripCodeWords(vcLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const vcRec = validateVowelConsonantRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = vcRec.recipeStepProgress;
              if (vcRec.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : vcRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps|completed the recipe|stage perfectly|well done|successfully identified all|spot on/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(vcRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = vcRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? vcRec.suggestedInput ? stripCodeWords(vcRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const vcIng = validateVowelConsonantIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = vcIng.ingredientsStepProgress;
              if (vcIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : vcIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(vcIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || vcIng.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? geminiCorrection ? parsed.suggestedInput || vcIng.suggestedInput : vcIng.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const vcSample = validateVowelConsonantSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = vcSample.sampleCodeStepProgress;
              parsed.operationTestCases = vcSample.operationTestCases;
              if (vcSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = vcSample.feedback;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                parsed.feedback = vcSample.feedback || synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                parsed.correction = vcSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? (vcSample.suggestedInput ? stripCodeWords(vcSample.suggestedInput) : void 0) : void 0;
              }
            }
          }
          if (problemType === "maximum-of-two") {
            if (section === "logic") {
              const maxLog = validateMaximumOfTwoLogic(userInput, attemptCount);
              if (maxLog.isFullyVerified) {
                parsed.correct = true;
                parsed.proofType = "theoretical";
                parsed.feedback = maxLog.feedback;
                parsed.correction = "Proceed to Stage 2: Recipe to sequence the algorithm step by step.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to recipe|recipe stage|mastered the logic|logic verified|you nailed it|ready to move on|move on to/i.test(parsed.feedback || "");
                const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|express|approach/i.test(userInput);
                if (maxLog.hasContradiction || !maxLog.hasGreaterOutcome || !maxLog.hasLesserOutcome || !isQuestion && isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(maxLog.feedback || matchedFirebase?.bestPair?.hint || "", "logic", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "logic", latestInput, attemptCount);
                }
                parsed.correction = parsed.correction || maxLog.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || maxLog.hasContradiction ? maxLog.suggestedInput ? stripCodeWords(maxLog.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "recipe") {
              const maxRec = validateMaximumOfTwoRecipe(userInput, attemptCount);
              parsed.recipeStepProgress = maxRec.recipeStepProgress;
              const isGeminiApproving = /ready to move on|move on to the next stage|proceed to ingredients|start picking our ingredients|recipe approved|all steps completed/i.test(parsed.feedback || "");
              if (maxRec.isFullyVerified || isGeminiApproving && !maxRec.hasContradiction && maxRec.recipeStepProgress?.some((s) => s.completed)) {
                parsed.correct = true;
                maxRec.recipeStepProgress?.forEach((s) => s.completed = true);
                parsed.recipeStepProgress = maxRec.recipeStepProgress;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount) : maxRec.feedback;
                parsed.correction = "Proceed to the Ingredients stage to gather the programming tools.";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to ingredients|ingredients stage|recipe verified|all steps/i.test(parsed.feedback || "");
                if (maxRec.hasContradiction || isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(maxRec.feedback || matchedFirebase?.bestPair?.hint || "", "recipe", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "recipe", latestInput, attemptCount);
                }
                parsed.correction = maxRec.correction || parsed.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || maxRec.hasContradiction ? maxRec.suggestedInput ? stripCodeWords(maxRec.suggestedInput) : parsed.suggestedInput : void 0;
              }
            }
            if (section === "ingredients") {
              const maxIng = validateMaximumOfTwoIngredients(userInput, attemptCount);
              parsed.ingredientsStepProgress = maxIng.ingredientsStepProgress;
              if (maxIng.isFullyVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount) : maxIng.feedback;
                parsed.correction = "Proceed to Taste the Sample stage to assemble your code!";
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /proceed to taste|taste the sample|ingredients verified/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(maxIng.feedback || matchedFirebase?.bestPair?.hint || "", "ingredients", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "ingredients", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || maxIng.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 || maxIng.hasContradiction ? geminiCorrection ? parsed.suggestedInput || maxIng.suggestedInput : maxIng.suggestedInput : void 0;
              }
            }
            if (section === "samplecode") {
              const maxSample = validateMaximumOfTwoSampleCode(userInput, attemptCount);
              parsed.sampleCodeStepProgress = maxSample.sampleCodeStepProgress;
              parsed.operationTestCases = maxSample.operationTestCases;
              if (maxSample.allVerified) {
                parsed.correct = true;
                parsed.feedback = parsed.feedback && parsed.feedback.trim().length > 20 && !parsed.feedback.includes("Before we evaluate") ? synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount) : maxSample.feedback || synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              } else {
                parsed.correct = false;
                const isFalselyClaimingApproval = /ready to run|sample code verified\b|all verified\b|all steps completed\b/i.test(parsed.feedback || "");
                if (isFalselyClaimingApproval || !parsed.feedback || parsed.feedback.trim().length < 20 || parsed.feedback.includes("Before we evaluate")) {
                  parsed.feedback = synthesizeHumanTouch(maxSample.feedback || matchedFirebase?.bestPair?.hint || "", "samplecode", latestInput, attemptCount);
                } else {
                  parsed.feedback = synthesizeHumanTouch(parsed.feedback, "samplecode", latestInput, attemptCount);
                }
                const geminiCorrection = typeof parsed.correction === "string" && parsed.correction.trim().length > 5 && !parsed.correction.includes("Check your worksheet") ? parsed.correction : void 0;
                parsed.correction = geminiCorrection || maxSample.correction;
                parsed.suggestedInput = isStuck || attemptCount >= 2 ? geminiCorrection ? parsed.suggestedInput || maxSample.suggestedInput : maxSample.suggestedInput : void 0;
              }
            }
          }
          // Universal Taste the Sample Multi-Language Structural Exit Gate:
          const syntaxQuery = (section === "samplecode") ? (detectTasteSampleSyntaxHelp(latestInput) || detectTasteSampleSyntaxHelp(userInput)) : null;

          if (section === "samplecode" && !syntaxQuery) {
            if (problemType === "odd-even") {
              const sampleVal = validateOddEvenSampleCode(userInput);
              if (!sampleVal.allVerified) {
                parsed.correct = false;
                parsed.feedback = sampleVal.feedback;
                parsed.correction = sampleVal.correction;
                parsed.suggestedInput = sampleVal.suggestedInput;
                parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
                parsed.stepProgress = sampleVal.sampleCodeStepProgress;
              } else {
                parsed.correct = true;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
                parsed.sampleCodeStepProgress = sampleVal.sampleCodeStepProgress;
                parsed.stepProgress = sampleVal.sampleCodeStepProgress;
              }
            } else {
              const isStructurallyComplete = isTasteSampleStructurallyComplete(userInput, problemType);
              const isGeminiPraisingCompletion = /successfully (?:written|assembled|implemented|completed)|you nailed it|congratulations|sample code (?:is )?verified|all \d+ steps (?:are )?completed|prototype correctly implements|fantastic job! you've successfully|outstanding! your (?:sample )?code|ready to (?:run|move on|proceed|test)/i.test(originalGeminiFeedback || "") || /successfully (?:written|assembled|implemented|completed)|you nailed it|congratulations|sample code (?:is )?verified|all \d+ steps (?:are )?completed|prototype correctly implements|fantastic job! you've successfully|outstanding! your (?:sample )?code|ready to (?:run|move on|proceed|test)/i.test(parsed.feedback || "");

              if (parsed.correct === true || isGeminiPraisingCompletion || isStructurallyComplete) {
                parsed.correct = true;
                parsed.correction = void 0;
                parsed.suggestedInput = void 0;
              }
            }
          }

          // Universal Dynamic AI Feedback Preservation across ALL stages & problems:
          const isPrematureApproval = !parsed.correct && /proceed to (?:ingredients|recipe|taste the sample|sample code|compiler)|stage completed|congratulations|hurray|kudos|logic approved|recipe approved|recipe successful|ingredients verified|sample code verified|all \d+ steps completed|ready to (?:proceed|run|move on)/i.test(originalGeminiFeedback || "");
          const hasRichGemini = typeof originalGeminiFeedback === "string" && originalGeminiFeedback.trim().length >= 20 && !originalGeminiFeedback.includes("Before we evaluate");

          const hasValidatorFeedback = typeof parsed.feedback === "string" && parsed.feedback.trim().length >= 20 && parsed.feedback !== originalGeminiFeedback;

          let sanitizedFeedback = hasValidatorFeedback
            ? parsed.feedback
            : ((hasRichGemini && !isPrematureApproval)
              ? synthesizeHumanTouch(originalGeminiFeedback, section, latestInput, attemptCount)
              : (typeof parsed.feedback === "string" ? parsed.feedback : "Let's review this step together in the worksheet."));

          if (section === "samplecode" && !syntaxQuery && parsed.correct === true) {
            if (!sanitizedFeedback || sanitizedFeedback.trim().length < 20 || sanitizedFeedback.includes("assemble the prototype") || sanitizedFeedback.includes("Check your worksheet")) {
              sanitizedFeedback = `🌟 Coach Maara here! Fantastic job! Your code prototype structure for "${problemTitle}" is verified across all required components! You are ready to proceed to the Compiler to compile and run your code!`;
            }
          }

          // Universal Taste the Sample Syntax Query Enforcement:
          if (syntaxQuery) {
            parsed.correct = false;
          }

          let sanitizedCorrection = typeof parsed.correction === "string" ? parsed.correction : void 0;
          let sanitizedSuggestedInput = typeof parsed.suggestedInput === "string" ? parsed.suggestedInput : void 0;
          if (syntaxQuery) {
            sanitizedCorrection = void 0;
            sanitizedSuggestedInput = void 0;
          }
          if (sanitizedCorrection) {
            sanitizedCorrection = sanitizedCorrection.replace(/\bL\.S\s*:\s*/gi, "Left Side: ").replace(/\bR\.S\s*:\s*/gi, "Right Side: ").replace(/\bLogical Op\s*:\s*/gi, "Logical Operator: ");
          }
          if (section === "logic" || section === "recipe") {
            sanitizedFeedback = stripCodeWords(sanitizedFeedback);
            if (sanitizedCorrection) {
              sanitizedCorrection = stripCodeWords(sanitizedCorrection);
            }
            if (sanitizedSuggestedInput) {
              sanitizedSuggestedInput = stripCodeWords(sanitizedSuggestedInput);
            }
          }
          console.info(`[InputCheckerService] ✅ Dynamic AI Hint generated successfully using model: ${model}`);
          return {
            correct: Boolean(parsed.correct),
            feedback: sanitizedFeedback || (typeof parsed.feedback === "string" ? parsed.feedback : "Let's review this step together in the worksheet."),
            correction: sanitizedCorrection || (parsed.correct ? void 0 : "Check your worksheet step and try again."),
            suggestedInput: sanitizedSuggestedInput || void 0,
            proofType: section === "logic" ? parsed.proofType === "theoretical" ? "theoretical" : "mathematical" : parsed.proofType || (section === "recipe" ? "recipe" : section === "ingredients" ? "ingredients" : section === "samplecode" ? "code" : "mathematical"),
            recipeStepProgress: section === "logic" ? void 0 : (Array.isArray(parsed.recipeStepProgress) ? parsed.recipeStepProgress : void 0),
            logicStepProgress: Array.isArray(parsed.logicStepProgress) ? parsed.logicStepProgress : void 0,
            stepProgress: Array.isArray(parsed.stepProgress) ? parsed.stepProgress : (Array.isArray(parsed.logicStepProgress) ? parsed.logicStepProgress : void 0),
            ingredientsStepProgress: Array.isArray(parsed.ingredientsStepProgress) ? parsed.ingredientsStepProgress : void 0,
            sampleCodeStepProgress: Array.isArray(parsed.sampleCodeStepProgress) ? parsed.sampleCodeStepProgress : void 0,
            operationTestCases: Array.isArray(parsed.operationTestCases) ? parsed.operationTestCases : void 0
          };
        }
      } catch (err) {
        const errMsg = err?.message || String(err);
        const isQuotaOrRateLimit = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota") || errMsg.includes("rate limit");
        const isBusy = errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE") || errMsg.includes("temporarily");
        if (isQuotaOrRateLimit) {
          let cooldownSeconds = 60;
          const match = errMsg.match(/retry in ([0-9.]+)s/i);
          if (match && match[1]) {
            cooldownSeconds = Math.ceil(parseFloat(match[1])) + 2;
          }
          modelCooldownMap.set(model, Date.now() + cooldownSeconds * 1e3);
          console.info(`[InputCheckerService] Model ${model} quota reached (429). Setting ${cooldownSeconds}s cooldown on this model and trying next candidate model...`);
          continue;
        } else if (isBusy) {
          modelCooldownMap.set(model, Date.now() + 15e3);
          console.info(`[InputCheckerService] Model ${model} temporarily busy (503/high demand), falling back to next candidate model...`);
        } else {
          modelCooldownMap.set(model, Date.now() + 3e4);
          console.warn(`[InputCheckerService] Gemini model ${model} error:`, errMsg);
        }
      }
    }
    return null;
  }
  /**
   * Minimal fallback if LLM is temporarily unreachable
   */
  generateSafetyFallback(section, problemTitle, userInput, isStuck, matchedFirebase, problemID, attemptCount = 1) {
    const problemType = detectProblemType(problemID, problemTitle);
    if (section === "samplecode") {
      const syntaxQuery = detectTasteSampleSyntaxHelp(userInput);
      if (syntaxQuery) {
        return {
          correct: false,
          feedback: "🌟 Coach Maara here! Take your verified ingredients and let's assemble them step by step into your code editor! Start with your first ingredient statement.",
          correction: "Write the first step of your code prototype.",
          suggestedInput: void 0,
          sampleCodeStepProgress: [
            { stepNumber: 1, title: "Code Prototype", completed: false, current: true }
          ]
        };
      }
      if (problemType === "odd-even") {
        const sampleVal = validateOddEvenSampleCode(userInput);
        return {
          correct: sampleVal.allVerified,
          feedback: sampleVal.feedback,
          correction: sampleVal.correction,
          suggestedInput: sampleVal.suggestedInput,
          sampleCodeStepProgress: sampleVal.sampleCodeStepProgress,
          stepProgress: sampleVal.stepProgress
        };
      }
      if (isTasteSampleStructurallyComplete(userInput, problemType)) {
        return {
          correct: true,
          feedback: `🌟 Coach Maara here! Fantastic job! Your code prototype for "${problemTitle}" is structurally verified across all components! Proceed to the Compiler to compile and run your code!`,
          correction: void 0,
          suggestedInput: void 0,
          sampleCodeStepProgress: [
            { stepNumber: 1, title: "Input Variable", completed: true, current: false },
            { stepNumber: 2, title: "Algorithm Logic", completed: true, current: false },
            { stepNumber: 3, title: "Program Output", completed: true, current: false }
          ]
        };
      }
    }
    if (problemType === "odd-even") {
      if (section === "logic") {
        const oddEvenVal = validateOddEvenClassification(userInput);
        if (oddEvenVal.hasList && !oddEvenVal.isCorrect) {
          return {
            correct: false,
            feedback: `Hey there! Coach Maara here. ${oddEvenVal.feedback}`,
            correction: oddEvenVal.correction || "Check your numbers: Even numbers can be split into 2 equal parts (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...).",
            suggestedInput: oddEvenVal.suggestedInput
          };
        }
        const logicVal = validateOddEvenLogic(userInput);
        return {
          correct: logicVal.isFullyVerified,
          feedback: synthesizeHumanTouch(logicVal.feedback, "logic", userInput, attemptCount),
          correction: logicVal.correction,
          suggestedInput: logicVal.isFullyVerified ? void 0 : logicVal.suggestedInput,
          logicStepProgress: logicVal.logicStepProgress,
          stepProgress: logicVal.logicStepProgress
        };
      }
      if (section === "recipe") {
        const rec = validateOddEvenRecipe(userInput);
        return {
          correct: rec.isFullyVerified,
          feedback: synthesizeHumanTouch(rec.feedback, "recipe", userInput, attemptCount),
          correction: rec.correction,
          suggestedInput: rec.isFullyVerified ? void 0 : rec.suggestedInput,
          recipeStepProgress: rec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const norm = (userInput || "").toLowerCase();
        const hasN = /\b(?:let|var|const|int)?\s*n\b/.test(norm);
        const hasMod = /%\s*2/.test(norm) || /modulo/.test(norm);
        const hasEven = /even/i.test(norm);
        const hasOdd = /odd/i.test(norm);
        const hasElse = /else/i.test(norm);
        const isDone = hasN && hasMod && hasEven && hasOdd && hasElse;
        const ingredientsStepProgress = [
          { stepNumber: 1, title: "Input variable n", completed: hasN, current: !hasN },
          { stepNumber: 2, title: "If condition (n % 2 == 0)", completed: hasMod, current: hasN && !hasMod },
          { stepNumber: 3, title: "Print 'Even' block", completed: hasEven, current: hasN && hasMod && !hasEven },
          { stepNumber: 4, title: "Else fallback block", completed: hasElse, current: hasN && hasMod && hasEven && !hasElse },
          { stepNumber: 5, title: "Print 'Odd' block", completed: hasOdd, current: hasN && hasMod && hasEven && hasElse && !hasOdd }
        ];
        return {
          correct: isDone,
          feedback: isDone ? "🎉 Ingredients Verified! Brilliant work! You've identified all 5 essential programming ingredients for checking Odd or Even. Proceed to Taste the Sample!" : synthesizeHumanTouch("Identify the 5 ingredients: input variable n, if condition testing n % 2 == 0, print Even, else block, and print Odd.", "ingredients", userInput, attemptCount),
          correction: "step 1: variable n\nstep 2: If condition with L.S: n % 2, Operator: ==, R.S: 0\nstep 3: Inside if: print(\"Even\")\nstep 4: else block\nstep 5: Inside else: print(\"Odd\")",
          suggestedInput: isDone ? void 0 : "step 1: variable n\nstep 2: If condition with L.S: n % 2, Operator: ==, R.S: 0\nstep 3: Inside if: print(\"Even\")\nstep 4: else block\nstep 5: Inside else: print(\"Odd\")",
          ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        return {
          correct: false,
          feedback: synthesizeHumanTouch("Assemble the code: declare variable n, write the if condition (n % 2 == 0) printing 'Even', and the else block printing 'Odd'.", "samplecode", userInput, attemptCount),
          correction: "var n = 5;\nif (n % 2 == 0) {\n  print(\"Even\");\n} else {\n  print(\"Odd\");\n}",
          suggestedInput: "var n = 5;\nif (n % 2 == 0) {\n  print(\"Even\");\n} else {\n  print(\"Odd\");\n}"
        };
      }
    }
    if (problemType === "sum-natural-numbers") {
      if (section === "logic") {
        const sumVal = validateSumOfNLogic(userInput, attemptCount);
        if (sumVal.isCorrect && sumVal.hasAccumulation) {
          return {
            correct: true,
            feedback: sumVal.feedback || "\u{1F389} Logic Successful! Fantastic work! You have clearly demonstrated how the numbers from 1 to n accumulate step by step into the running total. You're ready to proceed to the Recipe stage to sequence this into an algorithm!",
            correction: "Proceed to the Recipe stage to write the step-by-step instructions."
          };
        }
        if (!sumVal.isCorrect && sumVal.feedback) {
          return {
            correct: false,
            feedback: synthesizeHumanTouch(sumVal.feedback, "logic", userInput, attemptCount),
            correction: sumVal.correction || "Check your worksheet calculation.",
            suggestedInput: sumVal.suggestedInput
          };
        }
        if (matchedFirebase?.bestPair?.hint) {
          return {
            correct: false,
            feedback: synthesizeHumanTouch(matchedFirebase.bestPair.hint, "logic", userInput, attemptCount),
            correction: sumVal.correction || "Check your worksheet calculation.",
            suggestedInput: sumVal.suggestedInput
          };
        }
      }
      if (section === "recipe") {
        const rec = validateSumOfNRecipe(userInput);
        const doneHint = matchedFirebase?.allPairs?.find((p) => p.input.toLowerCase().includes("step 5"))?.hint || "Kudos. You've sequenced all 5 steps of the algorithm in plain English. Proceed to ingredients.";
        const rawHint = rec.allStepsDone ? doneHint : (rec.feedback || matchedFirebase?.bestPair?.hint || "whatever you found in logic, write it here step by step.\nEx: Step 1: Get the input\nStep 2: Do the process etc..");
        return {
          correct: rec.allStepsDone,
          feedback: synthesizeHumanTouch(rawHint, "recipe", userInput),
          correction: rec.allStepsDone ? "Proceed to ingredients." : (rec.correction || "Start with Step 1: Get the input number n from the user."),
          suggestedInput: rec.allStepsDone ? void 0 : (rec.suggestedInput || "Step 1: Get the input number n from the user"),
          recipeStepProgress: rec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const ing = validateSumOfNIngredients(userInput);
        const doneHint = matchedFirebase?.allPairs?.find((p) => p.input.toLowerCase().includes("step 5: sum = sum + i") || p.hint.toLowerCase().includes("all 5 ingredients are verified") || p.hint.toLowerCase().includes("all the ingredients ready"))?.hint || "Good work. You have all the ingredients ready. Now let's proceed to taste the sample.";
        const rawHint = ing.allIngredientsDone ? doneHint : (ing.feedback || matchedFirebase?.bestPair?.hint);
        return {
          correct: ing.allIngredientsDone,
          feedback: synthesizeHumanTouch(rawHint, "ingredients", userInput),
          correction: ing.allIngredientsDone ? "Proceed to taste the sample." : (ing.correction || "List the input variable n, accumulator sum = 0, loop construct, loop controls (start = 1, end = n), and sum update (sum = sum + i)."),
          suggestedInput: ing.allIngredientsDone ? void 0 : (ing.suggestedInput || "Step 1: n\nStep 2: sum = 0\nStep 3: for loop\nStep 4: start = 1, end = n, next step = +1\nStep 5: sum = sum + i"),
          ingredientsStepProgress: ing.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const sampleVal = validateSumOfNSampleCode(userInput, attemptCount);
        return {
          correct: sampleVal.allVerified,
          feedback: synthesizeHumanTouch(sampleVal.feedback, "samplecode", userInput, attemptCount),
          correction: sampleVal.correction,
          suggestedInput: sampleVal.suggestedInput || void 0,
          sampleCodeStepProgress: sampleVal.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "factorial") {
      if (section === "logic") {
        const factLog = validateFactorialLogic(userInput);
        if (factLog.isFullyVerified) {
          return {
            correct: true,
            feedback: factLog.feedback || `\u{1F389} Logic Successful! Fantastic! You've explained the core logic of Factorial: starting with fact = 1 and sequentially multiplying each number into the running product. Proceed to the Recipe stage!`,
            correction: "Proceed to the Recipe stage to write the step-by-step algorithm."
          };
        }
        return {
          correct: false,
          feedback: factLog.feedback || (matchedFirebase?.bestPair?.hint ? synthesizeHumanTouch(matchedFirebase.bestPair.hint, "logic", userInput) : `To find the factorial of ${factLog.detectedN}, show the sequential calculations step by step.`),
          correction: factLog.correction || "Start with fact = 1 and sequentially multiply each number into fact.",
          suggestedInput: factLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const rec = validateFactorialRecipe(userInput);
        const doneHint = "\u{1F389} Recipe Verified! Kudos! You've sequenced all 4 steps of the Factorial algorithm. Proceed to Ingredients.";
        const rawHint = rec.isFullyVerified ? doneHint : rec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Accept a number as input\nStep 2: Generate all numbers from 1 up to the input number\nStep 2.1: Multiply each generated number with the factorial variable\nStep 3: Print the final factorial value";
        return {
          correct: rec.isFullyVerified,
          feedback: rec.isFullyVerified ? doneHint : rec.feedback || synthesizeHumanTouch(rawHint, "recipe", userInput),
          correction: rec.isFullyVerified ? "Proceed to Ingredients." : rec.correction || "Step 1 : Accept a number as input",
          suggestedInput: rec.isFullyVerified ? void 0 : rec.suggestedInput || "Step 1 : Accept a number as input",
          recipeStepProgress: rec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const ing = validateFactorialIngredients(userInput);
        const doneHint = "Good work! You have all 6 ingredients ready (input variable, container initialized to 1, loop construct, loop controls start=1/end=n/next step=+1, factorial update, and print statement). Let's proceed to taste the sample.";
        const rawHint = ing.isFullyVerified ? doneHint : ing.feedback || matchedFirebase?.bestPair?.hint || "List the input variable n, initialize fact = 1, for loop from 1 to n, fact = fact * i, and print(fact).";
        return {
          correct: ing.isFullyVerified,
          feedback: ing.feedback || synthesizeHumanTouch(rawHint, "ingredients", userInput),
          correction: ing.isFullyVerified ? "Proceed to taste the sample." : ing.correction || "Step 6: print(fact) - Display the final factorial output outside the loop.",
          suggestedInput: ing.isFullyVerified ? void 0 : ing.suggestedInput,
          ingredientsStepProgress: ing.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const sampleVal = validateFactorialSampleCode(userInput, attemptCount);
        return {
          correct: sampleVal.allVerified,
          feedback: synthesizeHumanTouch(sampleVal.feedback, "samplecode", userInput, attemptCount),
          correction: sampleVal.correction,
          suggestedInput: sampleVal.suggestedInput || void 0,
          sampleCodeStepProgress: sampleVal.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "divisor-of-a-number") {
      if (section === "logic") {
        const divLog = validateDivisorLogic(userInput);
        const baseHint = divLog.isFullyVerified ? matchedFirebase?.bestPair?.hint || divLog.feedback : divLog.feedback;
        let finalFeedback = synthesizeHumanTouch(baseHint, "logic", userInput);
        if (divLog.isFullyVerified && !finalFeedback.includes("divisors of")) {
          const analysis = extractDivisorInputAnalysis(userInput);
          finalFeedback += formatDivisorBreakdown(analysis);
        }
        return {
          correct: divLog.isFullyVerified,
          feedback: finalFeedback,
          correction: divLog.correction || "Test each number from 1 up to n and check if dividing leaves remainder 0.",
          suggestedInput: divLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const rec = validateDivisorRecipe(userInput);
        const baseHint = matchedFirebase?.bestPair?.hint || rec.feedback;
        return {
          correct: rec.isFullyVerified,
          feedback: synthesizeHumanTouch(baseHint, "recipe", userInput),
          correction: rec.correction || "Start with Step 1: Get the input number n.",
          suggestedInput: rec.suggestedInput,
          recipeStepProgress: rec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const ing = validateDivisorIngredients(userInput);
        const baseHint = ing.needsIfConditionHint || ing.hasLoopConfusionWithIf ? ing.feedback : matchedFirebase?.bestPair?.hint || ing.feedback;
        return {
          correct: ing.isFullyVerified,
          feedback: synthesizeHumanTouch(baseHint, "ingredients", userInput),
          correction: ing.correction || "Step 1: Variable n for input number.",
          suggestedInput: ing.suggestedInput,
          ingredientsStepProgress: ing.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const sampleVal = validateDivisorSampleCode(userInput, attemptCount);
        const baseHint = matchedFirebase?.bestPair?.hint || sampleVal.feedback;
        return {
          correct: sampleVal.allVerified,
          feedback: synthesizeHumanTouch(baseHint, "samplecode", userInput, attemptCount),
          correction: sampleVal.correction,
          suggestedInput: sampleVal.suggestedInput || void 0,
          sampleCodeStepProgress: sampleVal.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "multiplication-table") {
      if (section === "logic") {
        const mulLog = validateMultiplicationLogic(userInput);
        return {
          correct: mulLog.isFullyVerified,
          feedback: synthesizeHumanTouch(mulLog.feedback, "logic", userInput, attemptCount),
          correction: mulLog.correction || "Show the multiplication table rows step by step.",
          suggestedInput: mulLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const mulRec = validateMultiplicationRecipe(userInput);
        return {
          correct: mulRec.isFullyVerified,
          feedback: synthesizeHumanTouch(mulRec.feedback, "recipe", userInput, attemptCount),
          correction: mulRec.correction || "Step 1: Get the table number from the user.",
          suggestedInput: mulRec.suggestedInput,
          recipeStepProgress: mulRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const mulIng = validateMultiplicationIngredients(userInput);
        return {
          correct: mulIng.isFullyVerified,
          feedback: synthesizeHumanTouch(mulIng.feedback, "ingredients", userInput, attemptCount),
          correction: mulIng.correction || "List variable for table number, loop from 1 to 10, product calculation, and print statement.",
          suggestedInput: mulIng.suggestedInput,
          ingredientsStepProgress: mulIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const mulSample = validateMultiplicationSampleCode(userInput, attemptCount);
        return {
          correct: mulSample.allVerified,
          feedback: synthesizeHumanTouch(mulSample.feedback, "samplecode", userInput, attemptCount),
          correction: mulSample.correction,
          suggestedInput: mulSample.suggestedInput || void 0,
          sampleCodeStepProgress: mulSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "even-numbers-1-to-50") {
      if (section === "logic") {
        const evenLog = validateEvenNumbers1To50Logic(userInput, attemptCount);
        return {
          correct: evenLog.isFullyVerified,
          feedback: synthesizeHumanTouch(evenLog.feedback, "logic", userInput, attemptCount),
          correction: evenLog.correction,
          suggestedInput: evenLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const evenRec = validateEvenNumbers1To50Recipe(userInput, attemptCount);
        return {
          correct: evenRec.isFullyVerified,
          feedback: synthesizeHumanTouch(evenRec.feedback, "recipe", userInput, attemptCount),
          correction: evenRec.correction,
          suggestedInput: evenRec.suggestedInput,
          recipeStepProgress: evenRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const evenIng = validateEvenNumbers1To50Ingredients(userInput, attemptCount);
        return {
          correct: evenIng.isFullyVerified,
          feedback: synthesizeHumanTouch(evenIng.feedback, "ingredients", userInput, attemptCount),
          correction: evenIng.correction,
          suggestedInput: evenIng.suggestedInput,
          ingredientsStepProgress: evenIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const evenSample = validateEvenNumbers1To50SampleCode(userInput, attemptCount);
        return {
          correct: evenSample.isFullyVerified,
          feedback: synthesizeHumanTouch(evenSample.feedback, "samplecode", userInput, attemptCount),
          correction: evenSample.correction,
          suggestedInput: void 0
        };
      }
    }
    if (problemType === "prime-number") {
      if (section === "logic") {
        const primeLog = validatePrimeLogic(userInput);
        return {
          correct: primeLog.isFullyVerified,
          feedback: synthesizeHumanTouch(primeLog.feedback, "logic", userInput, attemptCount),
          correction: primeLog.correction || "Count the divisors: a prime number has exactly 2 divisors (1 and itself).",
          suggestedInput: primeLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const primeRec = validatePrimeRecipe(userInput);
        return {
          correct: primeRec.isFullyVerified,
          feedback: synthesizeHumanTouch(primeRec.feedback, "recipe", userInput, attemptCount),
          correction: primeRec.correction || "Step 1: Get input number n.",
          suggestedInput: primeRec.suggestedInput,
          recipeStepProgress: primeRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const primeIng = validatePrimeIngredients(userInput);
        return {
          correct: primeIng.isFullyVerified,
          feedback: synthesizeHumanTouch(primeIng.feedback, "ingredients", userInput, attemptCount),
          correction: primeIng.correction || "List input variable n, divisor counter count = 0, loop from 1 to n, if condition, and final count == 2 check.",
          suggestedInput: primeIng.suggestedInput,
          ingredientsStepProgress: primeIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const primeSample = validatePrimeSampleCode(userInput, attemptCount);
        return {
          correct: primeSample.allVerified,
          feedback: synthesizeHumanTouch(primeSample.feedback, "samplecode", userInput, attemptCount),
          correction: primeSample.correction,
          suggestedInput: primeSample.suggestedInput || void 0,
          sampleCodeStepProgress: primeSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "next-prime-number") {
      if (section === "logic") {
        const npLog = validateNextPrimeLogic(userInput, attemptCount);
        return {
          correct: npLog.isFullyVerified,
          feedback: synthesizeHumanTouch(npLog.feedback, "logic", userInput, attemptCount),
          correction: npLog.correction || "Start testing candidate numbers from n + 1 consecutively until you find a number with only 2 divisors.",
          suggestedInput: npLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const npRec = validateNextPrimeRecipe(userInput);
        return {
          correct: npRec.isFullyVerified,
          feedback: synthesizeHumanTouch(npRec.feedback, "recipe", userInput, attemptCount),
          correction: npRec.correction || "Step 1: Get the input number n from the user.",
          suggestedInput: npRec.suggestedInput,
          recipeStepProgress: npRec.stepProgress
        };
      }
      if (section === "ingredients") {
        const npIng = validateNextPrimeIngredients(userInput);
        return {
          correct: npIng.isFullyVerified,
          feedback: synthesizeHumanTouch(npIng.feedback, "ingredients", userInput, attemptCount),
          correction: npIng.correction || "List input variable n, candidate = n + 1, outer loop, isPrime flag, inner loop from 2 to candidate-1, modulo check, and verdict check.",
          suggestedInput: npIng.suggestedInput,
          ingredientsStepProgress: npIng.stepProgress
        };
      }
      if (section === "samplecode") {
        const npSample = validateNextPrimeSampleCode(userInput, attemptCount);
        return {
          correct: npSample.allVerified,
          feedback: synthesizeHumanTouch(npSample.feedback, "samplecode", userInput, attemptCount),
          correction: npSample.correction,
          suggestedInput: npSample.suggestedInput || void 0,
          sampleCodeStepProgress: npSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "prime-between-range") {
      if (section === "logic") {
        const prLog = validatePrimeRangeLogic(userInput);
        return {
          correct: prLog.isFullyVerified,
          feedback: synthesizeHumanTouch(prLog.feedback, "logic", userInput, attemptCount),
          correction: prLog.correction || "A prime number has exactly 2 divisors (1 and itself). Loop through each number in the range from start to end and count divisors.",
          suggestedInput: prLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const prRec = validatePrimeRangeRecipe(userInput);
        return {
          correct: prRec.isFullyVerified,
          feedback: synthesizeHumanTouch(prRec.feedback, "recipe", userInput, attemptCount),
          correction: prRec.correction || "Step 1: Get the range limits (start and end).",
          suggestedInput: prRec.suggestedInput,
          recipeStepProgress: prRec.stepProgress
        };
      }
      if (section === "ingredients") {
        const prIng = validatePrimeRangeIngredients(userInput);
        return {
          correct: prIng.isFullyVerified,
          feedback: synthesizeHumanTouch(prIng.feedback, "ingredients", userInput, attemptCount),
          correction: prIng.correction || "List variables start and end, outer for loop from start to end, count = 0 inside outer loop, inner loop from 1 to num, modulo check, and verdict check count == 2.",
          suggestedInput: prIng.suggestedInput,
          ingredientsStepProgress: prIng.stepProgress
        };
      }
      if (section === "samplecode") {
        const prSample = validatePrimeRangeSampleCode(userInput, attemptCount);
        return {
          correct: prSample.allVerified,
          feedback: synthesizeHumanTouch(prSample.feedback, "samplecode", userInput, attemptCount),
          correction: prSample.correction,
          suggestedInput: prSample.suggestedInput || void 0,
          sampleCodeStepProgress: prSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "sexy-prime-number") {
      if (section === "logic") {
        const spLog = validateSexyPrimeLogic(userInput);
        return {
          correct: spLog.isFullyVerified,
          feedback: synthesizeHumanTouch(spLog.feedback, "logic", userInput, attemptCount),
          correction: spLog.correction || "Sexy primes are pairs of prime numbers (p, p + 6) that differ by 6. Both p and p + 6 must have exactly 2 divisors.",
          suggestedInput: spLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const spRec = validateSexyPrimeRecipe(userInput);
        return {
          correct: spRec.isFullyVerified,
          feedback: synthesizeHumanTouch(spRec.feedback, "recipe", userInput, attemptCount),
          correction: spRec.correction || "Step 1: Get the upper limit number from the user.",
          suggestedInput: spRec.suggestedInput,
          recipeStepProgress: spRec.stepProgress
        };
      }
      if (section === "ingredients") {
        const spIng = validateSexyPrimeIngredients(userInput);
        return {
          correct: spIng.isFullyVerified,
          feedback: synthesizeHumanTouch(spIng.feedback, "ingredients", userInput, attemptCount),
          correction: spIng.correction || "List variables n, p, and q = p + 6, outer loop for p from 2 to n - 6, separate counters count1 and count2, modulo checks, and combined verification.",
          suggestedInput: spIng.suggestedInput,
          ingredientsStepProgress: spIng.stepProgress
        };
      }
      if (section === "samplecode") {
        const spSample = validateSexyPrimeSampleCode(userInput, attemptCount);
        return {
          correct: spSample.allVerified,
          feedback: synthesizeHumanTouch(spSample.feedback, "samplecode", userInput, attemptCount),
          correction: spSample.correction,
          suggestedInput: spSample.suggestedInput || void 0,
          sampleCodeStepProgress: spSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "positive-negative") {
      if (section === "logic") {
        const pnLog = validatePositiveNegativeLogic(userInput);
        return {
          correct: pnLog.isFullyVerified,
          feedback: synthesizeHumanTouch(pnLog.feedback || matchedFirebase?.bestPair?.hint || "Numbers greater than 0 are positive, numbers less than 0 are negative.", "logic", userInput, attemptCount),
          correction: pnLog.correction || "Compare the number with 0 using comparison operators (> or <).",
          suggestedInput: pnLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const pnRec = validatePositiveNegativeRecipe(userInput);
        return {
          correct: pnRec.isFullyVerified,
          feedback: synthesizeHumanTouch(pnRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get input number n. Step 2: If n > 0 display Positive, else display Negative.", "recipe", userInput, attemptCount),
          correction: pnRec.correction || "Step 1: Get input number n.",
          suggestedInput: pnRec.suggestedInput,
          recipeStepProgress: pnRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const pnIng = validatePositiveNegativeIngredients(userInput);
        return {
          correct: pnIng.isFullyVerified,
          feedback: synthesizeHumanTouch(pnIng.feedback || matchedFirebase?.bestPair?.hint || "Define variable n, If condition with L.S: n, R.S: 0, Operator: >, and print statements.", "ingredients", userInput, attemptCount),
          correction: pnIng.correction || "Step 1: Input variable n\nStep 2: If condition with L.S: n, R.S: 0, Operator: >\nStep 3: Print statements",
          suggestedInput: pnIng.suggestedInput,
          ingredientsStepProgress: pnIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const pnSample = validatePositiveNegativeSampleCode(userInput);
        return {
          correct: pnSample.allVerified,
          feedback: synthesizeHumanTouch(pnSample.feedback || matchedFirebase?.bestPair?.hint || 'var n = 5;\nif (n > 0) print("Positive");\nelse print("Negative");', "samplecode", userInput, attemptCount),
          correction: pnSample.correction,
          suggestedInput: pnSample.suggestedInput || void 0,
          sampleCodeStepProgress: pnSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "three-digit-number") {
      if (section === "logic") {
        const tdLog = validateThreeDigitLogic(userInput);
        return {
          correct: tdLog.isFullyVerified,
          feedback: synthesizeHumanTouch(tdLog.feedback || matchedFirebase?.bestPair?.hint || "A 3-digit number is between 100 and 999 inclusive.", "logic", userInput, attemptCount),
          correction: tdLog.correction || "Check if the number is greater than or equal to 100 AND less than or equal to 999.",
          suggestedInput: tdLog.suggestedInput
        };
      }
      if (section === "recipe") {
        const tdRec = validateThreeDigitRecipe(userInput);
        return {
          correct: tdRec.isFullyVerified,
          feedback: synthesizeHumanTouch(tdRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get input number n. Step 2: Check if n >= 100 and n <= 999. Step 3: If true display 3-digit number. Step 4: Else display Not a 3-digit number.", "recipe", userInput, attemptCount),
          correction: tdRec.correction || "Step 1: Get input number n.",
          suggestedInput: tdRec.suggestedInput,
          recipeStepProgress: tdRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const tdIng = validateThreeDigitIngredients(userInput);
        return {
          correct: tdIng.isFullyVerified,
          feedback: synthesizeHumanTouch(tdIng.feedback || matchedFirebase?.bestPair?.hint || "Define variable n, compound condition (n >= 100 && n <= 999), and print statements.", "ingredients", userInput, attemptCount),
          correction: tdIng.correction || "Step 1: Variable n for input\nStep 2: If condition with n >= 100 && n <= 999\nStep 3: Inside if block print 3-digit number\nStep 4: Inside else block print Not a 3-digit number",
          suggestedInput: tdIng.suggestedInput,
          ingredientsStepProgress: tdIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const tdSample = validateThreeDigitSampleCode(userInput);
        return {
          correct: tdSample.allVerified,
          feedback: synthesizeHumanTouch(tdSample.feedback || matchedFirebase?.bestPair?.hint || 'var n = 456;\nif (n >= 100 && n <= 999) print("3-digit number");\nelse print("Not a 3-digit number");', "samplecode", userInput, attemptCount),
          correction: tdSample.correction,
          suggestedInput: tdSample.suggestedInput || void 0,
          sampleCodeStepProgress: tdSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "voting-eligibility") {
      if (section === "logic") {
        const voteLog = validateVotingEligibilityLogic(userInput);
        const fb = stripCodeWords(voteLog.feedback || matchedFirebase?.bestPair?.hint || "A person must be 18 years old or older to be eligible to vote.");
        const corr = stripCodeWords(voteLog.correction || "Check whether the person's age is 18 or older.");
        const sug = voteLog.suggestedInput ? stripCodeWords(voteLog.suggestedInput) : void 0;
        return {
          correct: voteLog.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug
        };
      }
      if (section === "recipe") {
        const voteRec = validateVotingEligibilityRecipe(userInput);
        const fb = stripCodeWords(voteRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Take the person's age. Step 2: Check if age is 18 or older. Step 3: If yes, announce Eligible to vote; otherwise, announce Not Eligible.");
        const corr = stripCodeWords(voteRec.correction || "Step 1: Take the person's age.");
        const sug = voteRec.suggestedInput ? stripCodeWords(voteRec.suggestedInput) : void 0;
        return {
          correct: voteRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: voteRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const voteIng = validateVotingEligibilityIngredients(userInput);
        return {
          correct: voteIng.isFullyVerified,
          feedback: synthesizeHumanTouch(voteIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable age, and an if-else condition using comparison operator >=.", "ingredients", userInput, attemptCount),
          correction: voteIng.correction || "step 1 : age variable\nstep 2 : If condition with L.S: age, R.S: 18, Operator: >=",
          suggestedInput: voteIng.suggestedInput,
          ingredientsStepProgress: voteIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const voteSample = validateVotingEligibilitySampleCode(userInput);
        return {
          correct: voteSample.allVerified,
          feedback: synthesizeHumanTouch(voteSample.feedback || matchedFirebase?.bestPair?.hint || 'var age = 20;\nif (age >= 18) print("Eligible");\nelse print("Not Eligible");', "samplecode", userInput, attemptCount),
          correction: voteSample.correction,
          suggestedInput: voteSample.suggestedInput || void 0,
          sampleCodeStepProgress: voteSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "pass-or-fail") {
      if (section === "logic") {
        const passLog = validatePassFailLogic(userInput);
        const fb = stripCodeWords(passLog.feedback || matchedFirebase?.bestPair?.hint || "A student must score 35 or above to pass; below 35 is Fail.");
        const corr = stripCodeWords(passLog.correction || "Compare the mark with 35 using comparison operator >=.");
        const sug = passLog.suggestedInput ? stripCodeWords(passLog.suggestedInput) : void 0;
        return {
          correct: passLog.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug
        };
      }
      if (section === "recipe") {
        const passRec = validatePassFailRecipe(userInput);
        const fb = stripCodeWords(passRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get mark input. Step 2: If mark is greater than or equal to 35, display Pass, else display Fail.");
        const corr = stripCodeWords(passRec.correction || "Step 1: Get mark input.");
        const sug = passRec.suggestedInput ? stripCodeWords(passRec.suggestedInput) : void 0;
        return {
          correct: passRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: passRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const passIng = validatePassFailIngredients(userInput);
        return {
          correct: passIng.isFullyVerified,
          feedback: synthesizeHumanTouch(passIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable mark, and an if-else condition using comparison operator >=.", "ingredients", userInput, attemptCount),
          correction: passIng.correction || "step 1 : mark variable\nstep 2 : If condition with L.S: mark, R.S: 35, Operator: >=",
          suggestedInput: passIng.suggestedInput,
          ingredientsStepProgress: passIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const passSample = validatePassFailSampleCode(userInput);
        return {
          correct: passSample.allVerified,
          feedback: synthesizeHumanTouch(passSample.feedback || matchedFirebase?.bestPair?.hint || 'var mark = 45;\nif (mark >= 35) print("Pass");\nelse print("Fail");', "samplecode", userInput, attemptCount),
          correction: passSample.correction,
          suggestedInput: passSample.suggestedInput || void 0,
          sampleCodeStepProgress: passSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "greater-than-100") {
      const isQuestion2 = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know|rule|do here/i.test(userInput);
      if (section === "logic") {
        const gtLog = validateGreaterThan100Logic(userInput);
        let fb;
        let corr;
        const sug = gtLog.suggestedInput;
        if (isQuestion2) {
          fb = "Great question! In this worksheet stage, our goal is to explain how to check whether any given number is greater than 100 in plain everyday words. Think of any number\u2014if it is strictly more than 100 (like 120 or 150), it is 'Greater than 100'; if it is 100 or less (like 50, 80, or 100 itself), it is 'Not greater than 100'. How would you explain this in your own words?";
          corr = "Explain both outcomes: what makes a number Greater than 100, and what happens when it is 100 or less.";
        } else if (gtLog.claims100IsGreater) {
          fb = "Look closely at 100! 100 is equal to 100, so it is NOT greater than 100. Strictly greater than 100 starts from 101.";
          corr = "Remember: strictly greater means above 100. Numbers 100 or below are Not Greater.";
        } else if (gtLog.claimsUnder100IsGreater) {
          fb = "Look closely at your condition! Numbers 100 or below (like 50 or 80) are NOT greater than 100. Only numbers strictly above 100 are Greater.";
          corr = "Numbers below 100 are Not Greater.";
        } else {
          fb = stripCodeWords(gtLog.feedback || matchedFirebase?.bestPair?.hint || "If a number is greater than 100 it is Greater, otherwise Not Greater.");
          corr = stripCodeWords(gtLog.correction || "Compare the number with 100 using everyday language.");
        }
        return {
          correct: gtLog.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug
        };
      }
      if (section === "recipe") {
        const gtRec = validateGreaterThan100Recipe(userInput);
        const fb = stripCodeWords(gtRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get number input. Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100.");
        const corr = stripCodeWords(gtRec.correction || "Step 1: Get number input.");
        const sug = gtRec.suggestedInput ? stripCodeWords(gtRec.suggestedInput) : void 0;
        return {
          correct: gtRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: gtRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const gtIng = validateGreaterThan100Ingredients(userInput);
        return {
          correct: gtIng.isFullyVerified,
          feedback: synthesizeHumanTouch(gtIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable num, and an if-else condition using comparison operator >.", "ingredients", userInput, attemptCount),
          correction: gtIng.correction || "step 1 : num variable\nstep 2 : If condition with L.S: num, R.S: 100, Operator: >",
          suggestedInput: gtIng.suggestedInput,
          ingredientsStepProgress: gtIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const gtSample = validateGreaterThan100SampleCode(userInput);
        return {
          correct: gtSample.allVerified,
          feedback: synthesizeHumanTouch(gtSample.feedback || matchedFirebase?.bestPair?.hint || 'var num = 120;\nif (num > 100) print("Greater than 100");\nelse print("Not greater than 100");', "samplecode", userInput, attemptCount),
          correction: gtSample.correction,
          suggestedInput: gtSample.suggestedInput || void 0,
          sampleCodeStepProgress: gtSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "profit-or-loss") {
      const isQuestion2 = userInput.endsWith("?") || /how|what|why|help|puriyala|doubt|know|rule|do here/i.test(userInput);
      if (section === "logic") {
        const plLog = validateProfitLossLogic(userInput);
        let fb;
        let corr;
        const sug = plLog.suggestedInput;
        if (plLog.isFullyVerified) {
          fb = plLog.feedback || "Spot on! Correct! Logic Approved! \u{1F389}";
          corr = "Proceed to the Recipe stage to sequence the steps.";
        } else if (plLog.hasNumericContradiction || plLog.claimsCPGreaterThanSPIsProfit || plLog.claimsSPGreaterThanCPIsLoss || plLog.claimsProfitWhenSPLessThanCP || plLog.claimsLossWhenSPGreaterThanCP) {
          fb = plLog.feedback || "Take a closer look at your comparison!";
          corr = plLog.correction;
        } else if (isQuestion2) {
          fb = plLog.feedback || "Explain with numbers or words: SP > CP is Profit; CP > SP is Loss.";
          corr = plLog.correction;
        } else {
          fb = stripCodeWords(plLog.feedback || matchedFirebase?.bestPair?.hint || "If selling price is greater than cost price it is Profit, otherwise Loss.");
          corr = stripCodeWords(plLog.correction || "Compare selling price with cost price using everyday language.");
        }
        return {
          correct: plLog.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug
        };
      }
      if (section === "recipe") {
        const plRec = validateProfitLossRecipe(userInput);
        const fb = stripCodeWords(plRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get cost price and selling price. Step 2: If selling price is greater than cost price, display Profit, else display Loss.");
        const corr = stripCodeWords(plRec.correction || "Step 1: Get cost price and selling price.");
        const sug = plRec.suggestedInput ? stripCodeWords(plRec.suggestedInput) : void 0;
        return {
          correct: plRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: plRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const plIng = validateProfitLossIngredients(userInput);
        return {
          correct: plIng.isFullyVerified,
          feedback: synthesizeHumanTouch(plIng.feedback || matchedFirebase?.bestPair?.hint || "Input variables cp and sp, and an if-else condition comparing sp > cp.", "ingredients", userInput, attemptCount),
          correction: plIng.correction || "step 1 : cp and sp variables\nstep 2 : If condition with L.S: sp, R.S: cp, Operator: >",
          suggestedInput: plIng.suggestedInput,
          ingredientsStepProgress: plIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const plSample = validateProfitLossSampleCode(userInput);
        return {
          correct: plSample.allVerified,
          feedback: synthesizeHumanTouch(plSample.feedback || matchedFirebase?.bestPair?.hint || 'var cp = 100;\nvar sp = 150;\nif (sp > cp) print("Profit");\nelse print("Loss");', "samplecode", userInput, attemptCount),
          correction: plSample.correction,
          suggestedInput: plSample.suggestedInput || void 0,
          sampleCodeStepProgress: plSample.sampleCodeStepProgress
        };
      }
    }
    if (problemType === "divisible-by-5") {
      if (section === "logic") {
        const divLog = validateDivisibleBy5Logic(userInput, attemptCount);
        const fb = divLog.feedback || matchedFirebase?.bestPair?.hint || "A number is divisible by 5 if n % 5 == 0 (leaves remainder 0).";
        const corr = divLog.correction || "Check if n % 5 == 0.";
        const sug = divLog.suggestedInput ? stripCodeWords(divLog.suggestedInput) : void 0;
        return {
          correct: divLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          operationTestCases: divLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const divRec = validateDivisibleBy5Recipe(userInput, attemptCount);
        const fb = divRec.feedback || matchedFirebase?.bestPair?.hint || "Step 2: Check if dividing the number by 5 leaves remainder 0.";
        const corr = divRec.correction || "Step 2: Check if dividing the number by 5 leaves remainder 0.";
        const sug = divRec.suggestedInput ? stripCodeWords(divRec.suggestedInput) : void 0;
        return {
          correct: divRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: divRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const divIng = validateDivisibleBy5Ingredients(userInput, attemptCount);
        return {
          correct: divIng.isFullyVerified,
          feedback: synthesizeHumanTouch(divIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable n, and an if-else condition using modulo operator (%) and equality operator (==) with 0.", "ingredients", userInput, attemptCount),
          correction: divIng.correction || "step 1 : n variable\nstep 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0",
          suggestedInput: divIng.suggestedInput,
          ingredientsStepProgress: divIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const divSample = validateDivisibleBy5SampleCode(userInput, attemptCount);
        return {
          correct: divSample.allVerified,
          feedback: synthesizeHumanTouch(divSample.feedback || matchedFirebase?.bestPair?.hint || 'var n = 25;\nif (n % 5 == 0) print("Divisible by 5");\nelse print("Not Divisible by 5");', "samplecode", userInput, attemptCount),
          correction: divSample.correction,
          suggestedInput: divSample.suggestedInput || void 0,
          sampleCodeStepProgress: divSample.sampleCodeStepProgress,
          operationTestCases: divSample.operationTestCases
        };
      }
    }
    if (problemType === "adult-or-minor") {
      if (section === "logic") {
        const amLog = validateAdultMinorLogic(userInput, attemptCount);
        const fb = amLog.feedback || matchedFirebase?.bestPair?.hint || "A person is an Adult if age >= 18, and a Minor if age < 18.";
        const corr = amLog.correction || "Check if age >= 18.";
        const sug = amLog.suggestedInput ? stripCodeWords(amLog.suggestedInput) : void 0;
        return {
          correct: amLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          operationTestCases: amLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const amRec = validateAdultMinorRecipe(userInput, attemptCount);
        const fb = amRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get input age. Step 2: Check if age >= 18. Step 3: Print result.";
        const corr = amRec.correction || "Step 1: Get input age. Step 2: If age >= 18 display Adult, else display Minor.";
        const sug = amRec.suggestedInput ? stripCodeWords(amRec.suggestedInput) : void 0;
        return {
          correct: amRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: amRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const amIng = validateAdultMinorIngredients(userInput, attemptCount);
        return {
          correct: amIng.isFullyVerified,
          feedback: synthesizeHumanTouch(amIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable age, and an if-else condition using comparison operator (>=) and threshold 18.", "ingredients", userInput, attemptCount),
          correction: amIng.correction || "step 1 : age variable\nstep 2 : If condition with L.S: age, Operator: >=, R.S: 18",
          suggestedInput: amIng.suggestedInput,
          ingredientsStepProgress: amIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const amSample = validateAdultMinorSampleCode(userInput, attemptCount);
        return {
          correct: amSample.allVerified,
          feedback: synthesizeHumanTouch(amSample.feedback || matchedFirebase?.bestPair?.hint || 'var age = 20;\nif (age >= 18) print("Adult");\nelse print("Minor");', "samplecode", userInput, attemptCount),
          correction: amSample.correction,
          suggestedInput: amSample.suggestedInput || void 0,
          sampleCodeStepProgress: amSample.sampleCodeStepProgress,
          operationTestCases: amSample.operationTestCases
        };
      }
    }
    if (problemType === "leap-year") {
      if (section === "logic") {
        const lyLog = validateLeapYearLogic(userInput, attemptCount);
        const fb = lyLog.feedback || matchedFirebase?.bestPair?.hint || "A leap year has 366 days and occurs every 4 years. We check if year % 4 == 0.";
        const corr = lyLog.correction || "Check if year divided by 4 leaves remainder 0.";
        const sug = lyLog.suggestedInput ? stripCodeWords(lyLog.suggestedInput) : void 0;
        return {
          correct: lyLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(fb, "logic", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          operationTestCases: lyLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const lyRec = validateLeapYearRecipe(userInput, attemptCount);
        const fb = lyRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get input year. Step 2: Check if year % 4 == 0. Step 3: Print result.";
        const corr = lyRec.correction || "Step 1: Get input year. Step 2: If year % 4 leaves remainder 0, display Leap Year, else display Not a Leap Year.";
        const sug = lyRec.suggestedInput ? stripCodeWords(lyRec.suggestedInput) : void 0;
        return {
          correct: lyRec.isFullyVerified,
          feedback: synthesizeHumanTouch(fb, "recipe", userInput, attemptCount),
          correction: corr,
          suggestedInput: sug,
          recipeStepProgress: lyRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const lyIng = validateLeapYearIngredients(userInput, attemptCount);
        return {
          correct: lyIng.isFullyVerified,
          feedback: synthesizeHumanTouch(lyIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable year, and an if-else condition using modulo operator (%) and equality operator (==).", "ingredients", userInput, attemptCount),
          correction: lyIng.correction || "step 1 : year variable\nstep 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
          suggestedInput: lyIng.suggestedInput,
          ingredientsStepProgress: lyIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const lySample = validateLeapYearSampleCode(userInput, attemptCount);
        return {
          correct: lySample.allVerified,
          feedback: synthesizeHumanTouch(lySample.feedback || matchedFirebase?.bestPair?.hint || 'var year = 2024;\nif (year % 4 == 0) print("Leap Year");\nelse print("Not a Leap Year");', "samplecode", userInput, attemptCount),
          correction: lySample.correction,
          suggestedInput: lySample.suggestedInput || void 0,
          sampleCodeStepProgress: lySample.sampleCodeStepProgress,
          operationTestCases: lySample.operationTestCases
        };
      }
    }
    if (problemType === "vowel-or-consonant") {
      if (section === "logic") {
        const vcLog = validateVowelConsonantLogic(userInput, attemptCount);
        return {
          correct: vcLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(stripCodeWords(vcLog.feedback || matchedFirebase?.bestPair?.hint || "Check if the character equals 'a', 'e', 'i', 'o', or 'u'. If true, Vowel; otherwise Consonant."), "logic", userInput, attemptCount),
          correction: stripCodeWords(vcLog.correction || "Check if character equals 'a', 'e', 'i', 'o', or 'u': if true Vowel, otherwise Consonant."),
          suggestedInput: vcLog.suggestedInput ? stripCodeWords(vcLog.suggestedInput) : void 0,
          operationTestCases: vcLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const vcRec = validateVowelConsonantRecipe(userInput, attemptCount);
        return {
          correct: vcRec.isFullyVerified,
          feedback: synthesizeHumanTouch(stripCodeWords(vcRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get character input. Step 2: If character is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel, otherwise display Consonant."), "recipe", userInput, attemptCount),
          correction: stripCodeWords(vcRec.correction || "Step 1: Get character input. Step 2: If character is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel, otherwise display Consonant."),
          suggestedInput: vcRec.suggestedInput ? stripCodeWords(vcRec.suggestedInput) : void 0,
          recipeStepProgress: vcRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const vcIng = validateVowelConsonantIngredients(userInput, attemptCount);
        return {
          correct: vcIng.isFullyVerified,
          feedback: synthesizeHumanTouch(vcIng.feedback || matchedFirebase?.bestPair?.hint || "Declare input variable ch, then check if ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'.", "ingredients", userInput, attemptCount),
          correction: vcIng.correction || `step 1 : ch variable
step 2 : If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'
step 3 : Inside if block: print("Vowel")
step 4 : Fallback else block
step 5 : Inside else block: print("Consonant")`,
          suggestedInput: vcIng.suggestedInput,
          ingredientsStepProgress: vcIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const vcSample = validateVowelConsonantSampleCode(userInput, attemptCount);
        return {
          correct: vcSample.allVerified,
          feedback: synthesizeHumanTouch(vcSample.feedback || matchedFirebase?.bestPair?.hint || `var ch = 'e';
if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
  print("Vowel");
} else {
  print("Consonant");
}`, "samplecode", userInput, attemptCount),
          correction: vcSample.correction || '} else {\n  print("Consonant");\n}',
          suggestedInput: vcSample.suggestedInput || void 0,
          sampleCodeStepProgress: vcSample.sampleCodeStepProgress,
          operationTestCases: vcSample.operationTestCases
        };
      }
    }
    if (problemType === "senior-citizen") {
      if (section === "logic") {
        const scLog = validateSeniorCitizenLogic(userInput, attemptCount);
        return {
          correct: scLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(stripCodeWords(scLog.feedback || matchedFirebase?.bestPair?.hint || "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen."), "logic", userInput, attemptCount),
          correction: stripCodeWords(scLog.correction || "Check if age >= 60 using comparison operator >= and include a mathematical example with actual numbers."),
          suggestedInput: scLog.suggestedInput ? stripCodeWords(scLog.suggestedInput) : void 0,
          operationTestCases: scLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const scRec = validateSeniorCitizenRecipe(userInput, attemptCount);
        return {
          correct: scRec.isFullyVerified,
          feedback: synthesizeHumanTouch(stripCodeWords(scRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get age input. Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen."), "recipe", userInput, attemptCount),
          correction: stripCodeWords(scRec.correction || "Step 1: Get age input from the user."),
          suggestedInput: scRec.suggestedInput ? stripCodeWords(scRec.suggestedInput) : void 0,
          recipeStepProgress: scRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const scIng = validateSeniorCitizenIngredients(userInput, attemptCount);
        return {
          correct: scIng.isFullyVerified,
          feedback: synthesizeHumanTouch(scIng.feedback || matchedFirebase?.bestPair?.hint || "Input variable age, and an if-else condition using comparison operator >= with threshold 60.", "ingredients", userInput, attemptCount),
          correction: scIng.correction || "step 1 : age variable\nstep 2 : If condition with L.S: age, R.S: 60, Operator: >=",
          suggestedInput: scIng.suggestedInput,
          ingredientsStepProgress: scIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const scSample = validateSeniorCitizenSampleCode(userInput, attemptCount);
        return {
          correct: scSample.allVerified,
          feedback: synthesizeHumanTouch(scSample.feedback || matchedFirebase?.bestPair?.hint || 'var age = 65;\nif (age >= 60) print("Senior Citizen");\nelse print("Not Senior Citizen");', "samplecode", userInput, attemptCount),
          correction: scSample.correction || 'if (age >= 60) print("Senior Citizen");\nelse print("Not Senior Citizen");',
          suggestedInput: scSample.suggestedInput || void 0,
          sampleCodeStepProgress: scSample.sampleCodeStepProgress,
          operationTestCases: scSample.operationTestCases
        };
      }
    }
    if (problemType === "maximum-of-two") {
      if (section === "logic") {
        const maxLog = validateMaximumOfTwoLogic(userInput, attemptCount);
        return {
          correct: maxLog.isFullyVerified,
          proofType: "theoretical",
          feedback: synthesizeHumanTouch(stripCodeWords(maxLog.feedback || matchedFirebase?.bestPair?.hint || "Compare two numbers: If first number is greater than second number, first is maximum; otherwise second is maximum."), "logic", userInput, attemptCount),
          correction: stripCodeWords(maxLog.correction || "Compare two numbers: If first number is greater than second number, first is maximum; otherwise second is maximum."),
          suggestedInput: maxLog.suggestedInput ? stripCodeWords(maxLog.suggestedInput) : void 0,
          operationTestCases: maxLog.operationTestCases
        };
      }
      if (section === "recipe") {
        const maxRec = validateMaximumOfTwoRecipe(userInput, attemptCount);
        return {
          correct: maxRec.isFullyVerified,
          feedback: synthesizeHumanTouch(stripCodeWords(maxRec.feedback || matchedFirebase?.bestPair?.hint || "Step 1: Get two numbers from user. Step 2: If first number is greater than second number display first is maximum, otherwise display second is maximum."), "recipe", userInput, attemptCount),
          correction: stripCodeWords(maxRec.correction || "Step 1: Get two numbers from user. Step 2: If first number is greater than second number display first is maximum, otherwise display second is maximum."),
          suggestedInput: maxRec.suggestedInput ? stripCodeWords(maxRec.suggestedInput) : void 0,
          recipeStepProgress: maxRec.recipeStepProgress
        };
      }
      if (section === "ingredients") {
        const maxIng = validateMaximumOfTwoIngredients(userInput, attemptCount);
        return {
          correct: maxIng.isFullyVerified,
          feedback: synthesizeHumanTouch(maxIng.feedback || matchedFirebase?.bestPair?.hint || "Declare variables a and b, then use an if condition (a > b) and fallback else block.", "ingredients", userInput, attemptCount),
          correction: maxIng.correction || 'step 1 : a and b variables\nstep 2 : If condition with L.S: a, R.S: b, Operator: >\nstep 3 : Inside if block: print("a is max")\nstep 4 : Fallback else block\nstep 5 : Inside else block: print("b is max")',
          suggestedInput: maxIng.suggestedInput,
          ingredientsStepProgress: maxIng.ingredientsStepProgress
        };
      }
      if (section === "samplecode") {
        const maxSample = validateMaximumOfTwoSampleCode(userInput, attemptCount);
        return {
          correct: maxSample.allVerified,
          feedback: synthesizeHumanTouch(maxSample.feedback || matchedFirebase?.bestPair?.hint || 'var a = 20, b = 40;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}', "samplecode", userInput, attemptCount),
          correction: maxSample.correction || '} else {\n  print("b is max");\n}',
          suggestedInput: maxSample.suggestedInput || void 0,
          sampleCodeStepProgress: maxSample.sampleCodeStepProgress,
          operationTestCases: maxSample.operationTestCases
        };
      }
    }
    const isQuestion = userInput.endsWith("?") || /how|what|why|start|help|puriyala|doubt|know/i.test(userInput);
    if (matchedFirebase?.bestPair) {
      const baseHint = matchedFirebase.bestPair && matchedFirebase.bestPair.hint ? String(matchedFirebase.bestPair.hint) : "";
      const finalHint = section === "logic" || section === "recipe" ? stripCodeWords(baseHint) : baseHint;
      const matchedInput = matchedFirebase.bestPair.input ? String(matchedFirebase.bestPair.input) : void 0;
      let matchedCorrection = void 0;
      if (matchedInput) {
        matchedCorrection = `Try structuring your ${section} following this pattern: "${matchedInput.split('\n')[0]}"`;
      }
      return {
        correct: false,
        feedback: synthesizeHumanTouch(finalHint, section, userInput),
        correction: matchedCorrection || `Think about the next step for ${problemTitle} and write it in the worksheet.`,
        suggestedInput: matchedInput
      };
    }
    if (isQuestion) {
      return {
        correct: false,
        feedback: `Hey! I heard your question. For "${problemTitle}", start by picking a small sample number and working out the first step manually.`,
        correction: "Pick a small test input and work through the first operation.",
        suggestedInput: section === "logic" ? "n = 5" : section === "recipe" ? "Step 1: Get the input number n" : section === "ingredients" ? "Step 1: variable n" : "let n = 5;"
      };
    }
    return {
      correct: false,
      feedback: `Good effort! As your coach, take a close look at your ${section} thinking for "${problemTitle}". Make sure every step follows clearly from the previous one.`,
      correction: `Review your ${section} steps and refine the sequence.`,
      suggestedInput: void 0
    };
  }
}
const inputCheckerService = new InputCheckerService();
export {
  InputCheckerService,
  extractLatestInput,
  inputCheckerService,
  sanitizePrematurePraise,
  stripCodeWords,
  synthesizeHumanTouch
};
