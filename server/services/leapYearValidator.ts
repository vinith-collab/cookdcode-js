/**
 * Comprehensive, production-grade validator for Problem 15: Leap Year or Not
 *
 * Target Firebase hint pairs (hints/problem15):
 * - logic:
 *   - "what is a leap year" -> "A leap year occurs every 4 years and has 366 days. It is divisible by 4 with remainder 0 (year % 4 == 0)."
 *   - "how to check if a year is leap year" -> "Divide the year by 4 and check if remainder is 0 using modulo operator (%)."
 *   - "if year % 4 == 0 it is leap year" -> "Spot on! year % 4 == 0 -> Leap Year, else -> Not a Leap Year. Proceed to Recipe."
 * - recipe:
 *   - "what steps to write" -> "Step 1: Get input year. Step 2: Check if year % 4 == 0. Step 3: Print result."
 *   - "step 1 : Get input year" -> "Great! Next step?"
 *   - "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year" -> "Kudos! Complete step-by-step algorithm. Proceed to Ingredients."
 * - ingredients:
 *   - "what ingredients do we need" -> "Input variable year, and an if-else condition using modulo operator (%) and equality operator (==)."
 *   - "step 1 : year variable" -> "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
 *   - "how to write if condition" -> "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator. Ex: Check whether remainder when year divided by 4 is 0: L.S: year % 4, R.S: 0, Operator: ==. Looks like: if (year % 4 == 0)."
 *   - "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==" -> "Hurray! if (year % 4 == 0). If true print 'Leap Year', else print 'Not a Leap Year'. Proceed to Sample Code."
 * - samplecode:
 *   - "how to write sample code" -> "Draft the code checking year % 4 == 0. Example:\nvar year = 2024;\nif (year % 4 == 0) print(\"Leap Year\");\nelse print(\"Not a Leap Year\");"
 *   - "var year = 2024; if (year % 4 == 0) print(\"Leap Year\"); else print(\"Not a Leap Year\");" -> "You gotcha! Perfect modulo check for leap year."
 */

export interface OperationTestCase {
  testCaseTitle: string;
  inputYear: number;
  operationFormula: string;
  quotient: number;
  remainder: number;
  conditionCheck: string;
  conditionEvaluated: boolean;
  executedBranch: 'if' | 'else' | 'none';
  outputMessage: string;
  expectedOutput: string;
  passed: boolean;
  explanation: string;
}

export interface LeapYearValidationResult {
  isFullyVerified: boolean;
  hasDivisibleBy4?: boolean;
  hasRemainder0?: boolean;
  hasModuloOperator?: boolean;
  has366DaysOr4Years?: boolean;
  hasLeapYearOutcome?: boolean;
  hasNotLeapYearOutcome?: boolean;
  hasContradiction?: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  operationTestCases?: OperationTestCase[];
  recipeStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
  ingredientsStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
}

export interface LeapYearSampleValidationResult {
  allVerified: boolean;
  hasVariable?: boolean;
  hasCondition?: boolean;
  hasQuotedPositivePrint?: boolean;
  hasUnquotedPositivePrint?: boolean;
  hasElse?: boolean;
  hasQuotedNegativePrint?: boolean;
  hasUnquotedNegativePrint?: boolean;
  hasElseWithCondition?: boolean;
  hasInvertedBranches?: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  operationTestCases?: OperationTestCase[];
  sampleCodeStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
}

/**
 * Validates Stage 1 (Logic) for Problem 15: Leap Year or Not
 */
export function validateLeapYearLogic(input: string, attemptCount: number = 1): LeapYearValidationResult {
  const norm = (input || '').toLowerCase();

  const isQuestion =
    norm.includes('what is a leap year') ||
    norm.includes('what is leap year') ||
    norm.includes('how to check') ||
    norm.includes('how do we know') ||
    norm.endsWith('?');

  if (isQuestion && !norm.includes('if') && !norm.includes('%') && !norm.includes('divis')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya here! A leap year occurs every 4 years and has 366 days instead of 365. To check if a year is a leap year, we test if the year is evenly divisible by 4 (giving a remainder of 0). What mathematical operation or test checks if a number is divisible by 4?",
      correction: "Check if the year is divisible by 4 with a remainder of 0.",
      suggestedInput: "A leap year has 366 days and occurs every 4 years. We test if the year is divisible by 4 with remainder 0 (year % 4 == 0).",
      matchedFirebaseInput: "what is a leap year"
    };
  }

  const mentions4 = /\b4\b|four/i.test(norm);
  const mentionsDivisible = /divisib|divide|divided|divides/i.test(norm);
  const mentionsModulo = /%|mod|modulo|remainder|rem\b/i.test(norm);
  const mentionsRemainder0 = /remainder\s*(is|=|:)?\s*0|rem\s*(is|=|:)?\s*0|%\s*4\s*(=|==)\s*0|divided\s*by\s*4\s*(with|leaves)?\s*(a\s*)?(remainder\s*)?0/i.test(norm);
  const mentions366DaysOr4Years = /366|every\s*4\s*years/i.test(norm);
  const mentionsLeap = /leap\s*year/i.test(norm);
  const mentionsNotLeap = /not\s*(a\s*)?leap/i.test(norm);

  // Extract all 4-digit years mentioned in the student input
  const allYearMatches = Array.from(norm.matchAll(/\b(19\d\d|20\d\d)\b/g)).map(m => parseInt(m[1], 10));

  for (const yr of allYearMatches) {
    const yrRemainder = yr % 4;
    const yrQuotient = Math.floor(yr / 4);
    const isActualLeap = (yrRemainder === 0);

    // Look for statements around this year claiming its outcome:
    // e.g. "2023 is a leap year", "2023 % 4 = 3 so leap year", "year 2023 leap year"
    const yrIndex = norm.indexOf(String(yr));
    const snippet = norm.substring(Math.max(0, yrIndex - 25), Math.min(norm.length, yrIndex + 90));

    const claimsLeapForYr = (
      /leap\s*year/i.test(snippet) &&
      !/(not\s*(a\s*)?leap|non[\s\-]leap|common)/i.test(snippet)
    ) || (
      new RegExp(`${yr}[^.]*?(?:is|=|gives|means|so|therefore)?\\s*(?:a\\s*)?leap\\s*year`, 'i').test(norm)
    );

    const claimsNotLeapForYr = (
      /(?:not\s*(a\s*)?leap|non[\s\-]leap|common\s*year)/i.test(snippet) ||
      new RegExp(`${yr}[^.]*?(?:is|=|gives|means|so|therefore)?\\s*(?:not\\s*(a\\s*)?leap|non[\s\\-]leap)`, 'i').test(norm)
    );

    // Student performed mathematical calculation on a non-leap year (e.g. 2023), but defined it as Leap Year!
    if (!isActualLeap && claimsLeapForYr && !claimsNotLeapForYr) {
      return {
        isFullyVerified: false,
        hasContradiction: true,
        feedback: `🌟 Coach Maya gentle check: Look at your example calculation with **year ${yr}**!\n\n` +
          `• **Mathematical Operation:** \`${yr} ÷ 4 = ${yrQuotient}\` with **remainder ${yrRemainder}** (\`${yr} % 4 = ${yrRemainder}\`).\n` +
          `Your mathematical division is correct (${yr} % 4 is indeed ${yrRemainder}), but your definition is incorrect:\n` +
          `Because the remainder is **${yrRemainder} (not 0)**, **${yr} is NOT a Leap Year!**\n\n` +
          `A year is ONLY a Leap Year when it is evenly divisible by 4 with remainder 0 (\`year % 4 == 0\`, like \`2024 % 4 == 0\`). When the remainder is ${yrRemainder}, it is a **Not a Leap Year** (Common Year of 365 days).`,
        correction: `For year ${yr}: ${yr} % 4 = ${yrRemainder} (remainder != 0), so ${yr} is Not a Leap Year.`,
        suggestedInput: `For year 2024: 2024 % 4 == 0 (remainder 0) -> Leap Year. For year 2023: 2023 % 4 == 3 (remainder 3 != 0) -> Not a Leap Year.`,
        matchedFirebaseInput: "if year % 4 == 0 it is leap year"
      };
    }

    if (isActualLeap && claimsNotLeapForYr && !claimsLeapForYr) {
      return {
        isFullyVerified: false,
        hasContradiction: true,
        feedback: `🌟 Coach Maya check: Look at **year ${yr}**!\n\n` +
          `• **Mathematical Operation:** \`${yr} ÷ 4 = ${yrQuotient}\` with **remainder 0** (\`${yr} % 4 = 0\`).\n` +
          `Because dividing by 4 leaves a remainder of **0**, **${yr} IS a Leap Year!** (It has 366 days).`,
        correction: `For year ${yr}: ${yr} % 4 = 0 (remainder 0), so ${yr} is a Leap Year.`,
        suggestedInput: `If year % 4 == 0, it is a Leap Year; otherwise Not a Leap Year.`,
        matchedFirebaseInput: "if year % 4 == 0 it is leap year"
      };
    }
  }

  const hasContradiction =
    /remainder\s*(is|=|:)?\s*([1-9]|not\s*0|!=0)\s*.*(is|then)?\s*leap/i.test(norm) ||
    /divided\s*by\s*4.*remainder\s*[1-9].*leap/i.test(norm);

  if (hasContradiction) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "🌟 Coach Maya gentle check: If dividing by 4 leaves a remainder greater than 0, it is NOT a leap year! A leap year must be evenly divisible by 4 with remainder 0 (like 2024 / 4 = 506 remainder 0).",
      correction: "A leap year must leave a remainder of 0 when divided by 4 (year % 4 == 0).",
      suggestedInput: "If year % 4 == 0 then it is a Leap Year, otherwise it is Not a Leap Year.",
      matchedFirebaseInput: "if year % 4 == 0 it is leap year"
    };
  }

  const hasDivisibilityLogic = (mentions4 && (mentionsDivisible || mentionsModulo || mentionsRemainder0)) || mentionsRemainder0;
  const hasMathCheck = mentionsModulo || mentionsRemainder0 || norm.includes('%') || norm.includes('== 0') || norm.includes('= 0') || norm.includes('remainder') || norm.includes('÷') || norm.includes('mod');

  // Extract explicit year if student mentioned one (e.g. 2024, 2023)
  const explicitYearMatch = norm.match(/\b(19\d\d|20\d\d|\d{4})\b/);
  const explicitYear = explicitYearMatch ? parseInt(explicitYearMatch[1], 10) : null;

  const hasMathematicalLeapYearDefinition =
    /%\s*4\s*(=|==)\s*0|remainder\s*(is|=|:)?\s*0|rem\s*(is|=|:)?\s*0|divided\s*by\s*4\s*(with|leaves)?\s*(a\s*)?(remainder\s*)?0|mod\s*4\s*(=|==)?\s*0/i.test(norm) ||
    /(?:2020|2024|2028|2000|1996)\s*%\s*4\s*(=|==)?\s*0/i.test(norm);

  // If student mentions dividing the year but hasn't specified the divisor (number 4) or what to display:
  if ((mentionsDivisible || norm.includes('divide') || norm.includes('dividing')) && !mentions4) {
    return {
      isFullyVerified: false,
      hasDivisibleBy4: false,
      hasRemainder0: mentionsRemainder0,
      hasModuloOperator: mentionsModulo,
      has366DaysOr4Years: mentions366DaysOr4Years,
      hasLeapYearOutcome: mentionsLeap,
      feedback: "🌟 Coach Maya hint: You correctly identified that we need to divide the year! 👏\n\n" +
        "**1. Which number do we divide the year by?**\n" +
        "• We divide the year by **4** (because a leap year occurs every 4 years to account for Earth's orbit).\n\n" +
        "**2. What mathematical check do we perform?**\n" +
        "• We check if `year % 4 == 0` (leaves a **remainder of 0**).\n\n" +
        "**3. What should be displayed?**\n" +
        "• If `year % 4 == 0` (remainder is 0, e.g. `2024 % 4 == 0`): Display **\"Leap Year\"**!\n" +
        "• If `year % 4 != 0` (remainder is not 0, e.g. `2023 % 4 == 3`): Display **\"Not a Leap Year\"**!\n\n" +
        "Write this complete rule in your worksheet: `If year % 4 == 0 display 'Leap Year', else display 'Not a Leap Year'`.",
      correction: "Divide the year by 4: if year % 4 == 0 display 'Leap Year', else display 'Not a Leap Year'.",
      suggestedInput: "If year % 4 == 0 display 'Leap Year', else display 'Not a Leap Year'.",
      matchedFirebaseInput: "how to check if a year is leap year"
    };
  }

  // If student only wrote simple text like "leap year was divisible by 4" without mathematical explanation/operation:
  if (hasDivisibilityLogic && !hasMathCheck && !explicitYear) {
    return {
      isFullyVerified: false,
      hasDivisibleBy4: true,
      hasRemainder0: false,
      hasModuloOperator: false,
      has366DaysOr4Years: mentions366DaysOr4Years,
      hasLeapYearOutcome: mentionsLeap,
      feedback: "🌟 Coach Maya here! Good conceptual start in words! You correctly identified that a leap year is divisible by 4.\n\nNow, **explain it mathematically with an example year!**\nShow the mathematical operation:\n• Take an example leap year (like 2024): `2024 ÷ 4 = 506 with remainder 0` (`2024 % 4 == 0`) ➔ **Leap Year**.\n• Take a non-leap year (like 2023): `2023 ÷ 4 = 505 with remainder 3` (`2023 % 4 != 0`) ➔ **Not a Leap Year**.\n\nWrite your mathematical modulo remainder check (`year % 4 == 0`) or example year calculation in your worksheet to complete this logic stage!",
      correction: "Explain mathematically: If year % 4 == 0 (or year divided by 4 leaves remainder 0, like 2024 % 4 == 0), it is a Leap Year; otherwise Not a Leap Year.",
      suggestedInput: "A leap year occurs every 4 years. Mathematically: For year = 2024, 2024 % 4 == 0 (remainder is 0) -> Leap Year. For year = 2023, 2023 % 4 == 3 (remainder != 0) -> Not a Leap Year.",
      matchedFirebaseInput: "how to check if a year is leap year"
    };
  }

  // If student only provided a non-leap year calculation (e.g. 2023 % 4 = 3) without mathematically defining the leap year case:
  if (!hasMathematicalLeapYearDefinition) {
    return {
      isFullyVerified: false,
      hasDivisibleBy4: mentions4,
      hasRemainder0: false,
      hasModuloOperator: mentionsModulo,
      has366DaysOr4Years: mentions366DaysOr4Years,
      hasLeapYearOutcome: mentionsLeap,
      feedback: "🌟 Coach Maya here! Great job showing the non-leap year calculation (e.g. `2023 % 4 = 3`, where remainder is not 0)! 👏\n\nNow, **mathematically define a Leap Year as well!**\nWhat mathematical operation and remainder confirms a Leap Year?\n• Show the remainder 0 rule: `year % 4 == 0` (or `2024 % 4 = 0` with remainder 0).\n• If `year % 4 == 0` (remainder is 0), then it is a **Leap Year**!\n\nAdd the mathematical definition or example for a Leap Year (`year % 4 == 0`) to complete your logic!",
      correction: "Mathematically define Leap Year: If year % 4 == 0 (or 2024 % 4 == 0 with remainder 0), it is a Leap Year.",
      suggestedInput: "If year % 4 == 0 (like 2024 % 4 == 0, remainder 0), it is a Leap Year. If year % 4 != 0 (like 2023 % 4 == 3, remainder 3), it is Not a Leap Year.",
      matchedFirebaseInput: "how to check if a year is leap year"
    };
  }

  if (hasDivisibilityLogic && (mentionsLeap || mentionsRemainder0 || mentions366DaysOr4Years)) {
    const testYear1 = explicitYear !== null ? explicitYear : 2024;
    const q1 = Math.floor(testYear1 / 4);
    const r1 = testYear1 % 4;
    const isLeap1 = (r1 === 0);

    const testYear2 = isLeap1 ? 2023 : 2024;
    const q2 = Math.floor(testYear2 / 4);
    const r2 = testYear2 % 4;
    const isLeap2 = (r2 === 0);

    const operationTestCases: OperationTestCase[] = [
      {
        testCaseTitle: isLeap1 ? "Example 1 (Leap Year Test)" : "Example 1 (Non-Leap Year Test)",
        inputYear: testYear1,
        operationFormula: `${testYear1} ÷ 4 = ${q1} with remainder ${r1} (${testYear1} % 4 = ${r1})`,
        quotient: q1,
        remainder: r1,
        conditionCheck: `${r1} == 0 evaluates to ${isLeap1 ? 'TRUE' : 'FALSE'}`,
        conditionEvaluated: isLeap1,
        executedBranch: isLeap1 ? 'if' : 'else',
        outputMessage: isLeap1 ? "Leap Year" : "Not a Leap Year",
        expectedOutput: isLeap1 ? "Leap Year" : "Not a Leap Year",
        passed: true,
        explanation: `${testYear1} ${isLeap1 ? 'is evenly divisible by 4 with remainder 0' : `leaves remainder ${r1} when divided by 4`}, so it is ${isLeap1 ? 'a Leap Year' : 'Not a Leap Year'}.`
      },
      {
        testCaseTitle: isLeap2 ? "Example 2 (Leap Year Test)" : "Example 2 (Non-Leap Year Test)",
        inputYear: testYear2,
        operationFormula: `${testYear2} ÷ 4 = ${q2} with remainder ${r2} (${testYear2} % 4 = ${r2})`,
        quotient: q2,
        remainder: r2,
        conditionCheck: `${r2} == 0 evaluates to ${isLeap2 ? 'TRUE' : 'FALSE'}`,
        conditionEvaluated: isLeap2,
        executedBranch: isLeap2 ? 'if' : 'else',
        outputMessage: isLeap2 ? "Leap Year" : "Not a Leap Year",
        expectedOutput: isLeap2 ? "Leap Year" : "Not a Leap Year",
        passed: true,
        explanation: `${testYear2} ${isLeap2 ? 'is evenly divisible by 4 with remainder 0' : `leaves remainder ${r2} when divided by 4`}, so it is ${isLeap2 ? 'a Leap Year' : 'Not a Leap Year'}.`
      }
    ];

    const feedback = `🔬 **Logic & Mathematical Operation Verified:**
• **Example 1 (${isLeap1 ? 'Leap Year' : 'Non-Leap Year'}):** \`year = ${testYear1}\` ➔ \`${testYear1} ÷ 4 = ${q1} remainder ${r1}\` (\`${testYear1} % 4 = ${r1}\`). Result: **${isLeap1 ? 'Leap Year' : 'Not a Leap Year'}** ✅
• **Example 2 (${isLeap2 ? 'Leap Year' : 'Non-Leap Year'}):** \`year = ${testYear2}\` ➔ \`${testYear2} ÷ 4 = ${q2} remainder ${r2}\` (\`${testYear2} % 4 = ${r2}\`). Result: **${isLeap2 ? 'Leap Year' : 'Not a Leap Year'}** ✅

🎉 **Both conceptual logic and mathematical operations verified!** 🏆 Having tested the arithmetic operation with concrete example years, your divisibility rule (\`year % 4 == 0\`) is verified as **SUCCESSFUL**! Fantastic job! Proceed to Stage 2: Recipe!`;

    return {
      isFullyVerified: true,
      hasDivisibleBy4: true,
      hasRemainder0: mentionsRemainder0,
      hasModuloOperator: mentionsModulo,
      has366DaysOr4Years: mentions366DaysOr4Years,
      hasLeapYearOutcome: true,
      operationTestCases,
      feedback,
      correction: "Proceed to Stage 2: Recipe to outline your step-by-step algorithm.",
      suggestedInput: undefined,
      matchedFirebaseInput: "if year % 4 == 0 it is leap year"
    };
  }

  let feedback = "🌟 Coach Maya here! To check if a year is a leap year, what number do we divide by, and what remainder must it leave?";
  if (attemptCount >= 2) {
    feedback = "🌟 Coach Maya checking back! Leap years occur every 4 years (like 2020, 2024, 2028). So we divide the year by 4 and check if the remainder is 0! Can you write this rule in everyday words?";
  }

  return {
    isFullyVerified: false,
    hasDivisibleBy4: mentions4,
    hasRemainder0: mentionsRemainder0,
    hasModuloOperator: mentionsModulo,
    has366DaysOr4Years: mentions366DaysOr4Years,
    feedback,
    correction: "Test if year divided by 4 leaves remainder 0 (year % 4 == 0).",
    suggestedInput: "A leap year occurs every 4 years and has 366 days. If the year is divisible by 4 with remainder 0, it is a Leap Year; otherwise, it is Not a Leap Year.",
    matchedFirebaseInput: "how to check if a year is leap year"
  };
}

/**
 * Validates Stage 2 (Recipe) for Problem 15: Leap Year or Not
 */
export function validateLeapYearRecipe(input: string, attemptCount: number = 1): LeapYearValidationResult {
  const norm = (input || '').toLowerCase();

  const isAskingNext =
    norm.includes('what steps to write') ||
    norm.includes('what next') ||
    norm.includes('next step') ||
    norm.includes('how to start') ||
    norm.trim() === 'help';

  const hasStep1 =
    /(?:step\s*1\s*:?|get\s*(?:the\s*)?(?:input\s*)?year|read\s*(?:the\s*)?year|take\s*(?:a\s*)?year|input\s*year)/i.test(norm) ||
    /\b(?:2024|2020|2023)\b/i.test(norm);

  const mentionsDivision = /divide|divided|division|%/i.test(norm);
  const mentions4 = /\b4\b|four/i.test(norm);
  const mentionsRemainder0 = /remainder\s*(?:is|=|:)?\s*0|rem\s*(?:is|=|:)?\s*0|%\s*4|divided\s*by\s*4/i.test(norm);

  const hasStep2Condition =
    (mentions4 && (mentionsDivision || mentionsRemainder0 || /divisible/i.test(norm))) ||
    /divided\s*by\s*4\s*leaves\s*(?:a\s*)?remainder\s*0/i.test(norm) ||
    /year\s*%\s*4\s*(=|==)\s*0/i.test(norm);

  const mentionsLeap = /display\s*.*leap|print\s*.*leap|show\s*.*leap|output\s*.*leap/i.test(norm) || norm.includes('display leap year') || norm.includes('print leap year');
  const mentionsNotLeap = /display\s*.*not\s*(?:a\s*)?leap|print\s*.*not\s*(?:a\s*)?leap|show\s*.*not\s*(?:a\s*)?leap|output\s*.*not\s*(?:a\s*)?leap/i.test(norm) || norm.includes('not a leap');

  // Precise mapping checks:
  // 1) Does student map remainder 0 (or divisible by 4) to "Leap Year"?
  const mapsRemainder0ToLeap =
    /remainder\s*(?:is|=|:)?\s*0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm) ||
    /%\s*4\s*(=|==)\s*0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm) ||
    /if\s*(?:the\s*)?remainder\s*(?:is|=|:)?\s*0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm) ||
    /divided\s*by\s*4.*?0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm);

  // 2) Does student map otherwise / non-zero remainder to "Not a Leap Year"?
  const mapsOtherwiseOrNonZeroToNotLeap =
    /(?:otherwise|else|other\s*wise|not\s*0|!=0|greater\s*than\s*0|not\s*zero|leaves\s*remainder)[^.;\n]*?(?:is\s*|display\s*|show\s*|print\s*)?(?:not\s*(?:a\s*)?leap|non[\s\-]leap)/i.test(norm) ||
    /(?:not\s*(?:a\s*)?leap|non[\s\-]leap)[^.;\n]*?(?:otherwise|else|not\s*0|!=0|not\s*zero)/i.test(norm) ||
    norm.includes('not leap') || norm.includes('not a leap');

  // 3) True inverted logic (ONLY when remainder 0 is explicitly mapped to "NOT a leap year" without mapping to "Leap Year"):
  const claimsRemainder0IsNotLeap =
    !mapsRemainder0ToLeap &&
    (/remainder\s*(?:is|=|:)?\s*0[^.;\n]*?\b(?:is|display|show|print|then)?\s*not\s*(?:a\s*)?leap\b/i.test(norm) ||
     /%\s*4\s*(=|==)\s*0[^.;\n]*?\b(?:is|display|show|print|then)?\s*not\s*(?:a\s*)?leap\b/i.test(norm) ||
     /if\s*(?:the\s*)?remainder\s*(?:is|=|:)?\s*0[^.;\n]*?\b(?:is|display|show|print|then)?\s*not\s*(?:a\s*)?leap\b/i.test(norm));

  const claimsNonZeroIsLeap =
    /remainder\s*(?:is\s*not|!=)\s*0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm) ||
    /%\s*4\s*(!=)\s*0(?![^.;\n]*?\bnot\b)[^.;\n]*?\b(?:is|display|show|print|then)?\s*(?:a\s*)?leap\s*year\b/i.test(norm);

  const hasInvertedOutcome = claimsRemainder0IsNotLeap || claimsNonZeroIsLeap;

  const hasStep3Outcome = !hasInvertedOutcome && (
    (mapsRemainder0ToLeap && mapsOtherwiseOrNonZeroToNotLeap) ||
    (mentionsLeap && (mentionsNotLeap || norm.includes('else') || norm.includes('otherwise')))
  );

  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Get input year (e.g. 2024)",
      completed: Boolean(hasStep1),
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Step 2: Check if year divided by 4 leaves remainder 0",
      completed: Boolean(hasStep2Condition),
      current: Boolean(hasStep1 && !hasStep2Condition)
    },
    {
      stepNumber: 3,
      title: "Step 3: Display 'Leap Year' if true, else 'Not a Leap Year'",
      completed: Boolean(hasStep3Outcome),
      current: Boolean(hasStep1 && hasStep2Condition && !hasStep3Outcome)
    }
  ];

  if (hasInvertedOutcome) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: "🌟 Coach Maya gentle check: Look closely at your Step 3 outcome! When a year is divided by 4 and the remainder is 0 (like `2024 % 4 = 0`), that actually means it **IS a Leap Year** (it has 366 days)! When the remainder is NOT 0 (like `2023 % 4 = 3`), it is **Not a Leap Year**.\n\nPlease update Step 3: 'Step 3: If remainder is 0 display Leap Year, else display Not a Leap Year'.",
      correction: "Step 3: If remainder is 0 display Leap Year, else display Not a Leap Year.",
      suggestedInput: "Step 3: If remainder is 0 display Leap Year, else display Not a Leap Year.",
      matchedFirebaseInput: "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year"
    };
  }

  const isFullyVerified = hasStep1 && hasStep2Condition && hasStep3Outcome && !hasInvertedOutcome;

  if (isFullyVerified) {
    const feedback = `🔬 **Recipe Algorithm Trace with Example Year (2024):**
• **Step 1:** Get input year \`year = 2024\`
• **Step 2:** Check remainder: \`2024 ÷ 4 = 506 remainder 0\` (\`2024 % 4 == 0\`)
• **Step 3:** Remainder is 0 ➔ Display **"Leap Year"** (otherwise "Not a Leap Year") ✅

🎉 **Woohoo! Incredible recipe!** 🏆 You wrote a crystal-clear 3-step algorithm for checking a leap year. Ready to gather the coding ingredients! Proceed to Stage 3: Ingredients!`;

    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback,
      correction: "Proceed to Stage 3: Ingredients to identify variables and operators.",
      suggestedInput: undefined,
      matchedFirebaseInput: "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year"
    };
  }

  // If user wrote Step 1 and mentions generic division without specifying number 4:
  if (hasStep1 && mentionsDivision && !mentions4) {
    const variedFeedback = attemptCount >= 2
      ? "🌟 Coach Maya checking in! You've got the right intuition that division is the key operation. 💡 Think about how the calendar works: since a leap day is added every **4 years**, we divide by **4**! How would you describe checking for a remainder of 0 in your recipe?"
      : "🌟 Coach Maya here! You're making great progress—getting the year and knowing we need to divide it! 👏 Which specific number should we divide by, and what remainder confirms a leap year? (Think about how often leap years happen every 4 years!).";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: variedFeedback,
      correction: "Step 2: Check if year divided by 4 leaves remainder 0.",
      suggestedInput: "Step 2: Check if year divided by 4 leaves remainder 0.",
      matchedFirebaseInput: "step 1 : Get input year"
    };
  }

  // If user only wrote Step 1:
  if (hasStep1 && !hasStep2Condition) {
    const variedFeedback = attemptCount >= 2
      ? "🌟 Coach Maya here! Step 1 looks solid. Now for the condition: how do we mathematically test if the year is a leap year? (We divide by 4 and look for a remainder of 0!)."
      : "🌟 Coach Maya here! Great start with Step 1! 👏 For Step 2, what mathematical test will check if this year is evenly divisible by 4 with zero remainder?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: variedFeedback,
      correction: "Step 2: Check if year divided by 4 leaves remainder 0.",
      suggestedInput: "Step 2: Check if year divided by 4 leaves remainder 0.",
      matchedFirebaseInput: "step 1 : Get input year"
    };
  }

  // If user has Step 1 and Step 2 condition, but missing Step 3 outcomes:
  if (hasStep1 && hasStep2Condition && !hasStep3Outcome) {
    const variedFeedback = attemptCount >= 2
      ? "🌟 Coach Maya here! You've set up the divisibility check by 4 perfectly! 👏 Now, what two messages should we display—one when the remainder is 0, and one when it isn't?"
      : "🌟 Coach Maya here! Superb work on the condition! 🌟 To wrap up our recipe in Step 3, what should we display when the year divides evenly, and what should we show otherwise?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: variedFeedback,
      correction: "Step 3: If true display 'Leap Year', else display 'Not a Leap Year'.",
      suggestedInput: "Step 3: If true display 'Leap Year', else display 'Not a Leap Year'.",
      matchedFirebaseInput: "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year"
    };
  }

  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: attemptCount >= 2
      ? "🌟 Coach Maya checking back! Let's build our recipe step by step in plain everyday language:\n• Step 1: Get the year\n• Step 2: Check if dividing by 4 leaves remainder 0\n• Step 3: Display 'Leap Year' if true, otherwise 'Not a Leap Year'."
      : "🌟 Coach Maya here! Let's think like a chef writing a recipe. What is the very first step we must take? (Step 1: Get the input year).",
    correction: "Step 1: Get input year.",
    suggestedInput: "Step 1: Get input year.",
    matchedFirebaseInput: "what steps to write"
  };
}

/**
 * Validates Stage 3 (Ingredients) for Problem 15: Leap Year or Not
 */
export function validateLeapYearIngredients(input: string, attemptCount: number = 1): LeapYearValidationResult {
  const norm = (input || '').toLowerCase();

  const isAskingNext =
    norm.includes('what ingredients do we need') ||
    norm.includes('what next') ||
    norm.includes('next step') ||
    norm.includes('how to write if') ||
    norm.trim() === 'help';

  const hasVariableYear =
    /step\s*1\s*:?\s*year|variable\s*:?\s*year|var\s+year|year\s*variable|input\s*variable\s*year/i.test(norm) ||
    /\byear\b/i.test(norm);

  const hasDivisionInsteadOfModulo =
    /(?:left\s*side|l\.?s\.?)\s*:?\s*year\s*\/\s*4/i.test(norm) ||
    /year\s*\/\s*4\s*(=|==)/i.test(norm) ||
    ((norm.includes('year/4') || norm.includes('year / 4')) && !norm.includes('year%4') && !norm.includes('year % 4'));

  const hasSingleEqualOperator =
    /operator\s*:?\s*=['"]?(?!=)/i.test(norm) ||
    /(?:l\.?s|left\s*side).*?operator\s*:?\s*=['"]?(?!=)/i.test(norm);

  const hasModuloInCondition =
    /year\s*%\s*4|l\.?s\.?\s*:?\s*year\s*%\s*4|left\s*side\s*:?\s*year\s*%\s*4/i.test(norm) ||
    ((norm.includes('% 4') || norm.includes('%4')) && !hasDivisionInsteadOfModulo);

  const hasEqualityOperator =
    (/operator\s*:?\s*==/i.test(norm) || /==\s*0/i.test(norm) || norm.includes('==')) && !hasSingleEqualOperator;

  const hasRightSide0 =
    /right\s*side\s*:?\s*0|r\.?s\.?\s*:?\s*0/i.test(norm) ||
    /==\s*0/i.test(norm);

  const hasValidIfCondition =
    (hasModuloInCondition || norm.includes('year % 4')) &&
    (hasEqualityOperator || norm.includes('==')) &&
    !hasDivisionInsteadOfModulo &&
    !hasSingleEqualOperator;

  const hasIfStepMention =
    /step\s*2\s*:?\s*if|if\s*condition|l\.s|left\s*side|operator|right\s*side|r\.s/i.test(norm);

  const hasPrintLeap =
    /print\s*\(\s*["']leap\s*year["']\s*\)|step\s*3\s*:?\s*.*print.*leap/i.test(norm) ||
    /display\s*["']?leap\s*year["']?/i.test(norm) ||
    /print\s*(?:it\s*is\s*(?:a\s*)?)?leap\s*year/i.test(norm);

  const hasElseBranch =
    /\belse\s*block\b|\belse\b|fallback\s*else/i.test(norm) && !/step\s*4\s*:?\s*if/i.test(norm);

  const hasPrintNotLeap =
    /print\s*\(\s*["']not\s*(a\s*)?leap\s*year["']\s*\)|step\s*5\s*:?\s*.*print.*not/i.test(norm) ||
    /display\s*["']?not\s*(a\s*)?leap\s*year["']?/i.test(norm) ||
    /print\s*(?:it\s*is\s*(?:a\s*)?)?not\s*(?:a\s*)?leap\s*year/i.test(norm);

  const hasUnquotedPrint =
    /print\s*\(\s*leap\s*year\s*\)|print\s*\(\s*not\s*a\s*leap\s*year\s*\)/i.test(norm);

  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Input variable (year)",
      completed: Boolean(hasVariableYear),
      current: !hasVariableYear
    },
    {
      stepNumber: 2,
      title: "Step 2: If condition (L.S: year % 4, Operator: ==, R.S: 0)",
      completed: Boolean(hasValidIfCondition),
      current: Boolean(hasVariableYear && !hasValidIfCondition)
    },
    {
      stepNumber: 3,
      title: "Step 3: Inside if block: print('Leap Year')",
      completed: Boolean(hasPrintLeap),
      current: Boolean(hasVariableYear && hasValidIfCondition && !hasPrintLeap)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block",
      completed: Boolean(hasElseBranch),
      current: Boolean(hasVariableYear && hasValidIfCondition && hasPrintLeap && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: "Step 5: Inside else block: print('Not a Leap Year')",
      completed: Boolean(hasPrintNotLeap),
      current: Boolean(hasVariableYear && hasValidIfCondition && hasPrintLeap && hasElseBranch && !hasPrintNotLeap)
    }
  ];

  // Specific check for writing another 'if' condition instead of 'else' block in Step 4
  const hasSecondIfInsteadOfElse =
    /step\s*4\s*:?\s*if|if\s*(?:the\s*)?remainder\s*(?:is\s*not|!=)\s*0/i.test(norm) && !hasElseBranch;

  if (hasSecondIfInsteadOfElse) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya checking Step 4: You wrote another `if` condition (`step 4: if the remainder is not zero...`). In programming with if-else constructs, we don't need a second `if` condition—we simply use the blanket fallback **`else` block** (e.g. `step 4 : else block`)! It automatically catches all other years where remainder is not zero. Please update Step 4 to use `step 4 : else block`.",
      correction: "step 4 : else block",
      suggestedInput: "step 4 : else block\nstep 5 : Inside else block: print(\"Not a Leap Year\")",
      matchedFirebaseInput: "how to write if condition"
    };
  }

  // Specific check for both division and single equal errors
  if (hasDivisionInsteadOfModulo && hasSingleEqualOperator) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya checking your Step 2 condition ingredients! Let's polish two crucial tools:\n\n" +
        "1. **Left Side (`year/4`):** The slash `/` gives the division quotient (e.g., `2026 / 4 = 506.5`). But leap years require checking the **remainder**! In code, use the **modulo operator `%`** ➔ `Left side: year % 4`.\n\n" +
        "2. **Operator (`=`):** A single `=` is for assigning values (e.g. `year = 2026`). For **comparing** two values in an `if` condition, use double equals `==` ➔ `operator: ==`.\n\n" +
        "Please update Step 2 with `Left side: year % 4` and `operator: ==`.",
      correction: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
      suggestedInput: "Step 2: If\nLeft side: year % 4\noperator: ==\nRight side: 0",
      matchedFirebaseInput: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: =="
    };
  }

  // Specific check for division instead of modulo
  if (hasDivisionInsteadOfModulo) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya checking Step 2 Left Side: You wrote `Left side: year/4`. In programming, the slash `/` performs regular division (quotient). But to test if a year is a leap year, we must check the **remainder** using the **modulo operator `%`**! Please change it to `Left side: year % 4`.",
      correction: "Left side: year % 4",
      suggestedInput: "Left side: year % 4\noperator: ==\nRight side: 0",
      matchedFirebaseInput: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: =="
    };
  }

  // Specific check for single equal operator
  if (hasSingleEqualOperator) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya checking Step 2 Operator: You wrote `operator: =`. In programming, a single `=` is for assignment (storing a value). For **comparing** two values in an `if` condition, you must use double equals `==`! Please update it to `operator: ==`.",
      correction: "operator: ==",
      suggestedInput: "operator: ==",
      matchedFirebaseInput: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: =="
    };
  }

  if (hasUnquotedPrint) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya syntax alert: Wrap text strings in quotation marks: `print(\"Leap Year\")`. Without quotes, the compiler looks for undeclared variables!",
      correction: 'print("Leap Year"); and print("Not a Leap Year");',
      suggestedInput: 'step 3 : Inside if block: print("Leap Year")\nstep 4 : else block\nstep 5 : Inside else block: print("Not a Leap Year")',
      matchedFirebaseInput: "how to write if condition"
    };
  }

  const isFullyVerified =
    hasVariableYear &&
    hasValidIfCondition &&
    hasPrintLeap &&
    hasElseBranch &&
    hasPrintNotLeap;

  if (isFullyVerified) {
    const feedback = `🔬 **Ingredients Operation Trace with Example Year (2024):**
• **Input Variable:** \`year = 2024\`
• **Condition Operands:** Left Side: \`year % 4\` (➔ \`2024 % 4 = 0\`), Operator: \`==\`, Right Side: \`0\`
• **Condition Evaluation:** \`0 == 0\` evaluates to **true**
• **True Action:** \`print("Leap Year")\`
• **Fallback Else Action:** \`print("Not a Leap Year")\`

🎉 **Woohoo! Outstanding ingredients list!** 🏆 You gathered the \`year\` variable, modulo operator \`% 4\`, comparison \`== 0\`, quoted print statements, and neat else branch. All ingredients verified through concrete operation trace! Proceed to Stage 4: Taste the Sample!`;

    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback,
      correction: "Proceed to Stage 4: Taste the Sample to assemble your prototype code.",
      suggestedInput: undefined,
      matchedFirebaseInput: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: =="
    };
  }

  if (!hasVariableYear) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! What programming ingredients do we need? Start with Step 1: Input variable `year`.",
      correction: "step 1 : year variable",
      suggestedInput: "step 1 : year variable",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }

  if (hasVariableYear && !hasValidIfCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Spot on! You have the `year` variable. 👏 Now for Step 2: How do you write the if condition using Left Side (L.S: `year % 4`), Right Side (R.S: `0`), and Operator (`==`)?",
      correction: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
      suggestedInput: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
      matchedFirebaseInput: "step 1 : year variable"
    };
  }

  if (hasVariableYear && hasValidIfCondition && !hasPrintLeap) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '🌟 Coach Maya here! Great condition! Now for Step 3: Inside the if block, write the winning print statement: `step 3 : Inside if block: print("Leap Year")`.',
      correction: 'step 3 : Inside if block: print("Leap Year")',
      suggestedInput: 'step 3 : Inside if block: print("Leap Year")',
      matchedFirebaseInput: "how to write if condition"
    };
  }

  if (hasVariableYear && hasValidIfCondition && hasPrintLeap && !hasElseBranch) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Step 1, Step 2, and Step 3 are ready! 👏 Now we need the fallback `else` construct: `step 4 : else block`. This handles all years where the remainder is not 0.",
      correction: "step 4 : else block",
      suggestedInput: "step 4 : else block\nstep 5 : Inside else block: print(\"Not a Leap Year\")",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }

  if (hasVariableYear && hasValidIfCondition && hasPrintLeap && hasElseBranch && !hasPrintNotLeap) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Almost finished with ingredients! Add Step 5 inside the else block to print the negative message: `step 5 : Inside else block: print(\"Not a Leap Year\")`.",
      correction: 'step 5 : Inside else block: print("Not a Leap Year")',
      suggestedInput: 'step 5 : Inside else block: print("Not a Leap Year")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }

  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: "🌟 Coach Maya here! Almost done with ingredients! Add the fallback else branch and negative message: `step 4 : else block` and `step 5 : Inside else block: print(\"Not a Leap Year\")`.",
    correction: 'step 4 : else block\nstep 5 : Inside else block: print("Not a Leap Year")',
    suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("Not a Leap Year")',
    matchedFirebaseInput: "what ingredients do we need"
  };
}

/**
 * Validates Stage 4 (Taste the Sample / Code) for Problem 15: Leap Year or Not
 */
export function validateLeapYearSampleCode(input: string, attemptCount: number = 1): LeapYearSampleValidationResult {
  const norm = (input || '').toLowerCase();

  const isAskingNext =
    norm.includes('how to write sample code') ||
    norm.includes('where to start') ||
    norm.includes('how to write') ||
    norm.trim() === 'help';

  const hasVariable =
    /(?:var|let|const|int)\s+year\s*=\s*\d+|year\s*=\s*\d+/i.test(input) ||
    /\b2024\b|\b2020\b|\b2023\b/.test(input);

  const hasCondition =
    /if\s*\(\s*year\s*%\s*4\s*==\s*0\s*\)|if\s*\(\s*year\s*%\s*4\s*===\s*0\s*\)|if\s+year\s*%\s*4\s*==\s*0\s*:/i.test(input) ||
    /if\s*\(\s*\(?\s*year\s*%\s*4\s*\)?\s*==\s*0\s*\)/i.test(input);

  const hasElseWithCondition =
    /else\s*\(\s*year\s*%\s*4/i.test(input) ||
    /else\s*if\s*\(\s*year\s*%\s*4/i.test(input);

  const hasQuotedPositivePrint =
    /print(?:ln)?\s*\(\s*["']leap\s*year["']\s*\)/i.test(input) ||
    /console\.log\s*\(\s*["']leap\s*year["']\s*\)/i.test(input);

  const hasUnquotedPositivePrint =
    /print(?:ln)?\s*\(\s*leap\s*year\s*\)/i.test(input);

  const hasElse = /\belse\b/i.test(input);

  const hasQuotedNegativePrint =
    /print(?:ln)?\s*\(\s*["']not\s*(a\s*)?leap\s*year["']\s*\)/i.test(input) ||
    /console\.log\s*\(\s*["']not\s*(a\s*)?leap\s*year["']\s*\)/i.test(input);

  const hasUnquotedNegativePrint =
    /print(?:ln)?\s*\(\s*not\s*(a\s*)?leap\s*year\s*\)/i.test(input);

  const hasInvertedBranches =
    /if\s*\(\s*year\s*%\s*4\s*==\s*0\s*\)[^{;]*\{?[^}]*print[^)]*not\s*a\s*leap/i.test(input);

  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Declare input year (var year = 2024;)",
      completed: Boolean(hasVariable),
      current: !hasVariable
    },
    {
      stepNumber: 2,
      title: "Step 2: Write if condition (if (year % 4 == 0) {)",
      completed: Boolean(hasCondition),
      current: Boolean(hasVariable && !hasCondition)
    },
    {
      stepNumber: 3,
      title: "Step 3: Print 'Leap Year' inside if block",
      completed: Boolean(hasQuotedPositivePrint),
      current: Boolean(hasVariable && hasCondition && !hasQuotedPositivePrint)
    },
    {
      stepNumber: 4,
      title: "Step 4: Add else branch",
      completed: Boolean(hasElse),
      current: Boolean(hasVariable && hasCondition && hasQuotedPositivePrint && !hasElse)
    },
    {
      stepNumber: 5,
      title: "Step 5: Print 'Not a Leap Year' inside else block",
      completed: Boolean(hasQuotedNegativePrint),
      current: Boolean(hasVariable && hasCondition && hasQuotedPositivePrint && hasElse && !hasQuotedNegativePrint)
    }
  ];

  // Extract student's test year or default to 2024
  let studentYear: number | null = null;
  const yearVarMatch = input.match(/(?:var|let|const|int)?\s*year\s*=\s*(\d+)/i) ||
                       input.match(/\b(19\d\d|20\d\d|\d{4})\b/);
  if (yearVarMatch) {
    studentYear = parseInt(yearVarMatch[1], 10);
  }

  const testYear1 = studentYear !== null ? studentYear : 2024;
  const q1 = Math.floor(testYear1 / 4);
  const r1 = testYear1 % 4;
  const isLeap1 = (r1 === 0);

  const testYear2 = isLeap1 ? 2023 : 2024;
  const q2 = Math.floor(testYear2 / 4);
  const r2 = testYear2 % 4;
  const isLeap2 = (r2 === 0);

  const b1: 'if' | 'else' | 'none' = isLeap1 ? 'if' : (hasElse ? 'else' : 'none');
  const out1 = isLeap1
    ? (hasInvertedBranches ? "Not a Leap Year" : (hasQuotedPositivePrint ? "Leap Year" : "No output"))
    : (hasInvertedBranches ? "Leap Year" : (hasQuotedNegativePrint ? "Not a Leap Year" : (hasElse ? "Missing message" : "No output")));
  const pass1 = (out1 === (isLeap1 ? "Leap Year" : "Not a Leap Year"));

  const b2: 'if' | 'else' | 'none' = isLeap2 ? 'if' : (hasElse ? 'else' : 'none');
  const out2 = isLeap2
    ? (hasInvertedBranches ? "Not a Leap Year" : (hasQuotedPositivePrint ? "Leap Year" : "No output"))
    : (hasInvertedBranches ? "Leap Year" : (hasQuotedNegativePrint ? "Not a Leap Year" : (hasElse ? "Missing message" : "No output")));
  const pass2 = (out2 === (isLeap2 ? "Leap Year" : "Not a Leap Year"));

  const operationTestCases: OperationTestCase[] = [
    {
      testCaseTitle: isLeap1 ? "Test Case 1 (Leap Year Test)" : "Test Case 1 (Non-Leap Year Test)",
      inputYear: testYear1,
      operationFormula: `${testYear1} ÷ 4 = ${q1} with remainder ${r1} (${testYear1} % 4 = ${r1})`,
      quotient: q1,
      remainder: r1,
      conditionCheck: `${r1} == 0 evaluates to ${isLeap1 ? 'TRUE' : 'FALSE'}`,
      conditionEvaluated: isLeap1,
      executedBranch: b1,
      outputMessage: out1,
      expectedOutput: isLeap1 ? "Leap Year" : "Not a Leap Year",
      passed: pass1,
      explanation: pass1
        ? `${testYear1} ${isLeap1 ? 'is evenly divisible by 4 (remainder 0), executing if-branch' : `leaves remainder ${r1} (not 0), executing else-branch`} ➔ Output: "${out1}". Correct!`
        : `Expected "${isLeap1 ? 'Leap Year' : 'Not a Leap Year'}" but code evaluated to "${out1}".`
    },
    {
      testCaseTitle: isLeap2 ? "Test Case 2 (Leap Year Test)" : "Test Case 2 (Non-Leap Year Test)",
      inputYear: testYear2,
      operationFormula: `${testYear2} ÷ 4 = ${q2} with remainder ${r2} (${testYear2} % 4 = ${r2})`,
      quotient: q2,
      remainder: r2,
      conditionCheck: `${r2} == 0 evaluates to ${isLeap2 ? 'TRUE' : 'FALSE'}`,
      conditionEvaluated: isLeap2,
      executedBranch: b2,
      outputMessage: out2,
      expectedOutput: isLeap2 ? "Leap Year" : "Not a Leap Year",
      passed: pass2,
      explanation: pass2
        ? `${testYear2} ${isLeap2 ? 'is evenly divisible by 4 (remainder 0), executing if-branch' : `leaves remainder ${r2} (not 0), executing else-branch`} ➔ Output: "${out2}". Correct!`
        : `Expected "${isLeap2 ? 'Leap Year' : 'Not a Leap Year'}" but code evaluated to "${out2}".`
    }
  ];

  if (hasElseWithCondition) {
    return {
      allVerified: false,
      hasElseWithCondition: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya syntax alert: `else` is a blanket fallback and never takes parentheses or a condition! Simply write `else { print(\"Not a Leap Year\"); }`.",
      correction: 'else {\n  print("Not a Leap Year");\n}',
      suggestedInput: 'else {\n  print("Not a Leap Year");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasInvertedBranches) {
    return {
      allVerified: false,
      hasInvertedBranches: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: `🔬 **Operation Execution Check with Example Year (${testYear1}):**
• **Input:** \`year = ${testYear1}\`
• **Operation:** \`${testYear1} ÷ 4 = ${q1}\` remainder \`${r1}\` (\`${testYear1} % 4 = ${r1}\`)
• **Condition:** \`year % 4 == 0\` evaluates to **TRUE**!
• **Your Code Output:** \`"${out1}"\` ❌ (Expected: \`"Leap Year"\`)

🌟 **Coach Maya check:** When \`year % 4 == 0\` evaluates to true (like 2024 % 4 == 0), that means it IS a Leap Year! Put \`print("Leap Year");\` inside the \`if\` block, and \`print("Not a Leap Year");\` in the \`else\` block.`,
      correction: 'if (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
      suggestedInput: 'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  const allVerified =
    hasVariable &&
    hasCondition &&
    hasQuotedPositivePrint &&
    hasElse &&
    hasQuotedNegativePrint &&
    pass1 &&
    pass2;

  if (allVerified) {
    const feedback = `🔬 **Live Code Operation & Execution Verification:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• **Test Case 1 (${isLeap1 ? 'Leap Year Test' : 'Non-Leap Year Test'}):**
  - **Input Year:** \`year = ${testYear1}\`
  - **Arithmetic Operation:** \`${testYear1} ÷ 4 = ${q1}\` with remainder \`${r1}\` (\`${testYear1} % 4 = ${r1}\`)
  - **Condition Check:** \`${r1} == 0\` evaluates to \`${isLeap1 ? 'TRUE' : 'FALSE'}\`
  - **Branch Executed:** \`${b1}\` block ➔ \`print("${out1}")\`
  - **Program Output:** \`"${out1}"\` [PASSED ✅]

• **Test Case 2 (${isLeap2 ? 'Leap Year Test' : 'Non-Leap Year Test'}):**
  - **Input Year:** \`year = ${testYear2}\`
  - **Arithmetic Operation:** \`${testYear2} ÷ 4 = ${q2}\` with remainder \`${r2}\` (\`${testYear2} % 4 = ${r2}\`)
  - **Condition Check:** \`${r2} == 0\` evaluates to \`${isLeap2 ? 'TRUE' : 'FALSE'}\`
  - **Branch Executed:** \`${b2}\` block ➔ \`print("${out2}")\`
  - **Program Output:** \`"${out2}"\` [PASSED ✅]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 **Both example year operations executed and verified!** 🏆 Having evaluated concrete example years (\`${testYear1}\` and \`${testYear2}\`) through the arithmetic operations and verified the remainder calculation and branching, your code is verified as **SUCCESSFUL**! You are an algorithmic champion! 🚀`;

    return {
      allVerified: true,
      hasVariable: true,
      hasCondition: true,
      hasQuotedPositivePrint: true,
      hasElse: true,
      hasQuotedNegativePrint: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback,
      correction: 'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
      suggestedInput: 'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
      matchedFirebaseInput: 'var year = 2024; if (year % 4 == 0) print("Leap Year"); else print("Not a Leap Year");'
    };
  }

  if (isAskingNext || (!hasVariable && !hasCondition)) {
    return {
      allVerified: false,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya here! Ready to build our leap year prototype? Let's start with Step 1: Declare a test year variable—for example `var year = 2024;`. How would you write that first line?",
      correction: "var year = 2024;",
      suggestedInput: "var year = 2024;",
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (!hasCondition) {
    let fb = `🔬 **Operation Check on Your Test Variable (\`year = ${testYear1}\`):**
• **Arithmetic Operation:** \`${testYear1} ÷ 4 = ${q1}\` with remainder \`${r1}\` (\`${testYear1} % 4 = ${r1}\`).
• Next, our code must test if this remainder equals 0!

🌟 Coach Maya here! Fantastic! You've declared your \`year\` variable! 👏 Now for Step 2: Write the \`if\` statement to perform this divisibility operation: \`if (year % 4 == 0) {\`.`;

    if (attemptCount >= 3) {
      fb = `🔬 **Operation Check:** \`${testYear1} ÷ 4 = ${q1}\` remainder \`${r1}\` (\`${testYear1} % 4 = ${r1}\`).
🌟 Coach Maya with a syntax clue! Here is the condition to check if year is divisible by 4:
\`\`\`javascript
if (year % 4 == 0) {
\`\`\``;
    } else if (attemptCount === 2) {
      fb = `🔬 **Operation Check:** Since \`${testYear1}\` divided by 4 leaves remainder \`${r1}\`, testing \`year % 4 == 0\` lets our code detect the leap year!
🌟 Write: \`if (year % 4 == 0) {\`.`;
    }
    return {
      allVerified: false,
      hasVariable: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: fb,
      correction: 'if (year % 4 == 0) {\n  print("Leap Year");\n}',
      suggestedInput: 'if (year % 4 == 0) {\n  print("Leap Year");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      return {
        allVerified: false,
        hasVariable: true,
        hasCondition: true,
        operationTestCases,
        sampleCodeStepProgress,
        feedback: "🌟 Coach Maya syntax alert: Wrap the words in quotation marks: `print(\"Leap Year\");`.",
        correction: 'print("Leap Year");',
        suggestedInput: 'print("Leap Year");',
        matchedFirebaseInput: "how to write sample code"
      };
    }
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: `🔬 **Operation Check with \`year = ${testYear1}\`:**
• **Operation:** \`${testYear1} ÷ 4 = ${q1}\` remainder \`${r1}\` (\`${testYear1} % 4 = ${r1}\`).
• Condition \`(${testYear1} % 4 == 0)\` evaluates to **${isLeap1 ? 'TRUE' : 'FALSE'}**!

🌟 Coach Maya here! Great condition! Now inside the \`{\` curly braces \`}\` of your \`if\` block, print the winning message: \`print("Leap Year");\`.`,
      correction: 'print("Leap Year");',
      suggestedInput: 'print("Leap Year");',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (!hasElse) {
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      hasQuotedPositivePrint: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: `🔬 **Operation Check with Example Years:**
• **Test 1 (Leap Year - 2024):** \`2024 % 4 = 0\` ➔ Condition True ➔ Output: "Leap Year" ✅
• **Test 2 (Non-Leap Year - 2023):** \`2023 % 4 = 3\` ➔ Condition False ➔ ⚠️ No else block found to handle non-leap years!

🌟 Coach Maya here! You have the leap year branch ready! Now for Step 4: What happens if the year is not divisible by 4? Add the fallback \`else\` branch: \`else { print("Not a Leap Year"); }\`.`,
      correction: 'else {\n  print("Not a Leap Year");\n}',
      suggestedInput: 'else {\n  print("Not a Leap Year");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      return {
        allVerified: false,
        hasVariable: true,
        hasCondition: true,
        hasQuotedPositivePrint: true,
        hasElse: true,
        operationTestCases,
        sampleCodeStepProgress,
        feedback: "🌟 Coach Maya syntax alert: Inside the `else` block, wrap your message in quotation marks: `print(\"Not a Leap Year\");`.",
        correction: 'print("Not a Leap Year");',
        suggestedInput: 'print("Not a Leap Year");',
        matchedFirebaseInput: "how to write sample code"
      };
    }
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      hasQuotedPositivePrint: true,
      hasElse: true,
      operationTestCases,
      sampleCodeStepProgress,
      feedback: `🔬 **Operation Check with Non-Leap Year (2023):**
• **Operation:** \`2023 ÷ 4 = 505 remainder 3\` (\`2023 % 4 = 3\`).
• Condition \`3 == 0\` evaluates to **FALSE**, entering the \`else\` block.
• Output needed inside else!

🌟 Coach Maya here! Almost done! Inside the \`else\` block, print the fallback message: \`print("Not a Leap Year");\`.`,
      correction: 'print("Not a Leap Year");',
      suggestedInput: 'print("Not a Leap Year");',
      matchedFirebaseInput: "how to write sample code"
    };
  }

  return {
    allVerified: false,
    sampleCodeStepProgress,
    feedback: "🌟 Coach Maya here! Keep going with your prototype code.",
    correction: 'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
    suggestedInput: 'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
    matchedFirebaseInput: "how to write sample code"
  };
}
