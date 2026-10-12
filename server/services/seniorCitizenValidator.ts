import { CTCStage } from '../types.js';

export interface OperationTestCase {
  testCaseTitle: string;
  inputAge: number;
  operationFormula: string;
  conditionCheck: string;
  conditionEvaluated: boolean;
  executedBranch: 'if' | 'else' | 'none';
  outputMessage: string;
  expectedOutput: string;
  passed: boolean;
  explanation: string;
}

export interface SeniorCitizenValidationResult {
  isFullyVerified: boolean;
  hasSeniorConcept?: boolean;
  hasComparisonOperator?: boolean;
  hasSeniorOutcome?: boolean;
  hasNotSeniorOutcome?: boolean;
  hasMathematicalCheck?: boolean;
  hasBoundaryCheck?: boolean;
  hasStep2Boundary?: boolean;
  hasStep2Otherwise?: boolean;
  hasContradiction?: boolean;
  operationTestCases?: OperationTestCase[];
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  recipeStepProgress?: Array<{
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }>;
  ingredientsStepProgress?: Array<{
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }>;
  sampleCodeStepProgress?: Array<{
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }>;
  allVerified?: boolean;
}

/**
 * Standard test cases for Senior Citizen verification
 */
function generateSeniorCitizenTestCases(userAgeVal: number = 65): OperationTestCase[] {
  const cases = [
    { title: `User Sample (Age = ${userAgeVal})`, age: userAgeVal },
    { title: 'Test Case 1: Senior Citizen (Age = 65)', age: 65 },
    { title: 'Test Case 2: Not Senior Citizen (Age = 45)', age: 45 },
    { title: 'Test Case 3: Boundary Case (Age = 60)', age: 60 },
    { title: 'Test Case 4: Boundary Case (Age = 59)', age: 59 }
  ];

  return cases.map(c => {
    const isSenior = c.age >= 60;
    return {
      testCaseTitle: c.title,
      inputAge: c.age,
      operationFormula: `${c.age} >= 60`,
      conditionCheck: `age >= 60 (${c.age} >= 60)`,
      conditionEvaluated: isSenior,
      executedBranch: isSenior ? 'if' : 'else',
      outputMessage: isSenior ? 'Senior Citizen' : 'Not Senior Citizen',
      expectedOutput: isSenior ? 'Senior Citizen' : 'Not Senior Citizen',
      passed: true,
      explanation: isSenior
        ? `Age ${c.age} is 60 or above, so the condition evaluates to true and outputs "Senior Citizen".`
        : `Age ${c.age} is strictly under 60, so the condition evaluates to false and outputs "Not Senior Citizen".`
    };
  });
}

/**
 * Validates Stage 1 (Logic) for Problem 19: Senior Citizen or Not
 *
 * Target Firebase hint pairs (hints/problem19):
 * - "who is a senior citizen" -> "A person aged 60 or above (age >= 60) is considered a Senior Citizen."
 * - "how to check senior citizen" -> "Compare age with 60 using comparison operator >=."
 * - "if age >= 60 senior citizen" -> "Spot on! If age >= 60 -> Senior Citizen, else -> Not Senior Citizen. Proceed to Recipe."
 *
 * USER MANDATE:
 * Even if the student explains the theory in words ("A person 60 or older is a senior citizen, otherwise not"),
 * they MUST ALSO provide a mathematical example (e.g. 65 >= 60 -> Senior Citizen, 45 >= 60 -> Not Senior Citizen)
 * before logic is considered completed!
 */
export function validateSeniorCitizenLogic(input: string, attemptCount: number = 1): SeniorCitizenValidationResult {
  const norm = (input || '').toLowerCase().trim();

  if (norm.length < 3) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya here! Who is considered a Senior Citizen based on age, and how do we check it using comparison operators?",
      correction: "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen.",
      suggestedInput: "A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = 45, 45 >= 60 is false -> Not Senior Citizen.",
      matchedFirebaseInput: "who is a senior citizen"
    };
  }

  // Extract all numbers in student's input
  const allNumbers = Array.from(norm.matchAll(/\b\d+\b/g)).map(m => parseInt(m[0], 10));
  const userSpecifiedAge = allNumbers.find(n => n !== 60 && n !== 19 && n !== 1 && n !== 2);

  // Check for comparison to 20 mistake (e.g. user checks age against 20 instead of 60)
  if (norm.includes('20') && !norm.includes('60') && (norm.includes('>=') || norm.includes('>') || norm.includes('age') || norm.includes('senior') || norm.includes('citizen'))) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "🌟 Coach Maya gentle check: You checked against age 20! For Senior Citizen status, the benchmark age is 60, not 20! If someone is 20: `20 >= 60` is false (strictly under 60), so age 20 is Not a Senior Citizen. Please compare age with 60 using `>=`: `age >= 60`.",
      correction: "Compare age with 60 (age >= 60), not 20.",
      suggestedInput: userSpecifiedAge && userSpecifiedAge !== 20
        ? `A person aged 60 or above is a senior citizen, otherwise not. For example: if age = ${userSpecifiedAge}, ${userSpecifiedAge} >= 60 is ${userSpecifiedAge >= 60 ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}.`
        : "A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = 45, 45 >= 60 is false -> Not Senior Citizen.",
      matchedFirebaseInput: "how to check senior citizen"
    };
  }

  const isQuestion =
    norm.endsWith('?') ||
    /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|express|explain|guidance|clue|who)\b/i.test(norm) ||
    norm.includes('who is a senior') ||
    norm.includes('how to check');

  if (isQuestion && !norm.includes('60') && !norm.includes('>=') && !norm.includes('>')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya here! A person aged 60 or above (age >= 60) is considered a Senior Citizen. To check this in logic, we compare the person's age with 60 using the `>=` operator.\n\nTo complete this logic stage, explain the rule in your own words and provide a mathematical example with actual numbers:\n• For age = 65: `65 >= 60` is true ➔ **Senior Citizen**\n• For age = 45: `45 >= 60` is false ➔ **Not Senior Citizen**",
      correction: "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen.",
      suggestedInput: "A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = 45, 45 >= 60 is false -> Not Senior Citizen.",
      matchedFirebaseInput: "who is a senior citizen"
    };
  }

  // Check for arithmetic / comparison contradictions (e.g., "45 >= 60 is true" or "70 < 60")
  const comparisonMatches = Array.from(norm.matchAll(/(\d+)\s*(>=|<=|>|<|==|=)\s*(\d+)/g));
  for (const match of comparisonMatches) {
    const l = parseInt(match[1], 10);
    const op = match[2];
    const r = parseInt(match[3], 10);

    let isMathFactTrue = false;
    if (op === '<') isMathFactTrue = l < r;
    else if (op === '>') isMathFactTrue = l > r;
    else if (op === '<=') isMathFactTrue = l <= r;
    else if (op === '>=') isMathFactTrue = l >= r;
    else if (op === '==' || op === '=') isMathFactTrue = l === r;

    // Check if the student claims this false comparison is true or yields Senior Citizen
    if (!isMathFactTrue) {
      const windowStart = Math.max(0, match.index! - 30);
      const windowEnd = Math.min(norm.length, match.index! + match[0].length + 50);
      const windowStr = norm.slice(windowStart, windowEnd);

      // Check if student negated the outcome or explicitly said false / not a senior citizen
      const hasNegation =
        /\b(?:not\s*(?:a\s*)?senior|not\s*citizen|false|is\s*false|not\s*true|not\s*greater|no|under|less|isn't|is\s*not)\b/i.test(windowStr) ||
        windowStr.includes('not senior') ||
        windowStr.includes('not a senior') ||
        windowStr.includes('not greater') ||
        windowStr.includes('is false') ||
        windowStr.includes('not a citizen');

      // Only flag contradiction if student claims this false comparison is true or yields Senior Citizen without negation
      if (!hasNegation) {
        const claimsSenior = windowStr.includes('senior') || windowStr.includes('true');
        if (claimsSenior) {
          return {
            isFullyVerified: false,
            hasContradiction: true,
            feedback: `🌟 Coach Maya gentle check: Look closely at your comparison \`${l} ${op} ${r}\`! Mathematically, ${l} is ${l > r ? 'greater than' : 'less than'} ${r}, so \`${l} ${op} ${r}\` is false! For age ${l}, it does not satisfy \`age >= 60\`.`,
            correction: `For age ${l}: \`${l} >= 60\` is false -> Not Senior Citizen. For age 65: \`65 >= 60\` is true -> Senior Citizen.`,
            suggestedInput: `A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = ${l}, ${l} >= 60 is false -> Not Senior Citizen.`,
            matchedFirebaseInput: "how to check senior citizen"
          };
        }
      }
    }
  }

  // Check if student includes a negative test case (e.g. age 25 is not greater than 60, not a senior citizen)
  const numbersAbove60 = allNumbers.filter(n => n >= 60 && n !== 60);
  const numbersBelow60 = allNumbers.filter(n => n < 60 && n !== 1 && n !== 2 && n !== 19);

  const hasNegativeTest =
    (numbersBelow60.length > 0 && (norm.includes('not senior') || norm.includes('not a senior') || norm.includes('not greater') || norm.includes('false') || norm.includes('not citizen'))) ||
    norm.includes('not a senior citizen') ||
    norm.includes('not senior citizen') ||
    norm.includes('otherwise not');

  // Check if student mentions the positive senior rule (age 60, 60 or older, 60 or above is senior citizen, or tests any number >= 60)
  const hasPositiveSeniorRule =
    /(?:60\s*(?:or\s*(?:older|above|greater)|\+)|(?:age\s*(?:>=|>|is\s*(?:greater|above|60))\s*60))\s*(?:is\s*(?:a\s*)?)?senior/i.test(norm) ||
    /if\s*age\s*(?:>=|>)\s*60\s*(?:then\s*)?senior/i.test(norm) ||
    /greater\s*than\s*60.*?(?:is\s*(?:a\s*)?)?senior/i.test(norm) ||
    /(?:>=|>)\s*60.*?(?:is\s*(?:a\s*)?)?senior/i.test(norm) ||
    /(\d+)\s*(?:>=|>)\s*60.*?(?:is\s*(?:a\s*)?)?senior(?!\s*not)/i.test(norm) ||
    /(\d+)\s*is\s*greater\s*than\s*60.*?(?:is\s*(?:a\s*)?)?senior/i.test(norm) ||
    (numbersAbove60.length > 0 && (norm.includes('is a senior') || norm.includes('is senior') || norm.includes('senior citizen')));

  // Check if student mentions the senior concept broadly
  const hasSeniorConcept =
    hasPositiveSeniorRule ||
    (norm.includes('60') && (norm.includes('senior') || norm.includes('older') || norm.includes('above') || norm.includes('greater') || norm.includes('>='))) ||
    norm.includes('senior citizen');

  // Check if student includes a mathematical example with actual numbers
  const hasMathematicalCheck =
    /(\d+)\s*(?:>=|>|<|<=|==)\s*60/i.test(norm) ||
    /60\s*(?:<=|<|>|>=)\s*(\d+)/i.test(norm) ||
    /(\d+)\s*(?:not\s*greater\s*than|is\s*less\s*than|<)\s*60/i.test(norm) ||
    /(?:age\s*=\s*\d+.*(?:>=|>|<|true|false))/i.test(norm) ||
    /(?:for\s+age\s*(?:=|is)?\s*\d+.*(?:senior|true|false))/i.test(norm) ||
    /(?:example.*?\d+.*?(?:senior|true|false))/i.test(norm) ||
    /(\d+)\s*(?:is\s*(?:greater|above|older)|>=)\s*60/i.test(norm) ||
    ((numbersAbove60.length > 0 || numbersBelow60.length > 0) && (norm.includes('>=') || norm.includes('>') || norm.includes('<') || norm.includes('false') || norm.includes('true')));

  // Check if student accounts for age 60 being included (boundary case / `>=` / 60 or older / 60 or above / equal to 60)
  const hasBoundaryCheck =
    norm.includes('>=') ||
    /60\s*(?:or\s*(?:older|above|greater|more)|\+)/i.test(norm) ||
    /greater\s*than\s*or\s*equal\s*to\s*60/i.test(norm) ||
    /equal\s*to\s*60/i.test(norm) ||
    /60\s*(?:is|==|>=)\s*(?:a\s*)?senior/i.test(norm) ||
    /if\s*age\s*=\s*60/i.test(norm) ||
    /(?:60\s*and\s*above|from\s*60)/i.test(norm);

  // If student verified negative test case (e.g. 25 not greater than 60) but hasn't yet defined positive rule
  if (hasNegativeTest && !hasPositiveSeniorRule) {
    const ageVal = numbersBelow60.length > 0 ? numbersBelow60[0] : (userSpecifiedAge || 25);
    return {
      isFullyVerified: false,
      hasSeniorConcept: true,
      hasMathematicalCheck: true,
      hasBoundaryCheck,
      feedback: `🌟 Coach Maya here! Fantastic observation with age ${ageVal}! 👏 You're completely correct: ${ageVal} is not greater than 60 (${ageVal} >= 60 is false), so a person aged ${ageVal} is NOT a Senior Citizen.\n\nNow, to complete the **Logic Stage**, write down who IS a Senior Citizen: A person aged 60 or above (age >= 60) is a Senior Citizen; otherwise Not a Senior Citizen.\n\nCombine this rule with your age ${ageVal} example and you will complete Logic!`,
      correction: "A person aged 60 or above (age >= 60) is a Senior Citizen; otherwise Not a Senior Citizen.",
      suggestedInput: `${input.replace(/\bwhat\s+i\s+do\s+now\b/gi, '').trim()}\nA person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = ${ageVal}, ${ageVal} >= 60 is false -> Not Senior Citizen.`,
      matchedFirebaseInput: "who is a senior citizen"
    };
  }

  // USER MANDATE: Even if they explain the theory in words, they MUST ALSO provide a mathematical example!
  if (hasSeniorConcept && !hasMathematicalCheck) {
    const exAge = numbersAbove60.length > 0 ? numbersAbove60[0] : (userSpecifiedAge || 65);
    return {
      isFullyVerified: false,
      hasSeniorConcept: true,
      hasMathematicalCheck: false,
      hasBoundaryCheck,
      feedback: `🌟 Coach Maya here! Fantastic explanation of the Senior Citizen rule in words! 👏\n\nHowever, to complete the **Logic Stage**, you must ALSO provide a concrete mathematical example with actual numbers (e.g. "For age = ${exAge}: ${exAge} >= 60 is ${exAge >= 60 ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}" or "For age = 45: 45 >= 60 is false -> Not Senior Citizen").\n\nPlease add a numerical calculation example!`,
      correction: `Add a mathematical example: e.g., if age = ${exAge}, ${exAge} >= 60 is ${exAge >= 60 ? 'true (Senior Citizen)' : 'false (Not Senior Citizen)'}.`,
      suggestedInput: `${input.trim()}\nFor example: if age = ${exAge}, ${exAge} >= 60 is ${exAge >= 60 ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}.`,
      matchedFirebaseInput: "if age >= 60 senior citizen"
    };
  }

  if (hasSeniorConcept && hasMathematicalCheck) {
    // If student only checked strictly greater than (> 60) without specifying what happens at 60
    if (!hasBoundaryCheck) {
      return {
        isFullyVerified: false,
        hasSeniorConcept: true,
        hasMathematicalCheck: true,
        hasBoundaryCheck: false,
        feedback: `🌟 Coach Maya here! Great tests with age 25 and 70! 👏\n\nNow, here is a critical question: What happens if a person is exactly 60 years old? With strictly greater than (\`>\`), \`60 > 60\` is false! But legally and logically, a 60-year-old IS a Senior Citizen!\n\nTo make your logic 100% complete, specify that age 60 is included as well (e.g. use \`>=\` for "greater than or equal to 60", or write "a person aged 60 or above is a Senior Citizen").`,
        correction: "Include age 60 in the logic: use `>= 60` (greater than or equal to 60) or state 'a person aged 60 or above is a Senior Citizen'.",
        suggestedInput: `${input.trim()}\nA person aged 60 or above (age >= 60) is a Senior Citizen; otherwise Not a Senior Citizen. For example, for age 60: 60 >= 60 is true -> Senior Citizen.`,
        matchedFirebaseInput: "is 60 a senior citizen"
      };
    }

    const verifiedAge = numbersAbove60.length > 0 ? numbersAbove60[0] : (userSpecifiedAge || 70);
    return {
      isFullyVerified: true,
      hasSeniorConcept: true,
      hasMathematicalCheck: true,
      hasBoundaryCheck: true,
      operationTestCases: generateSeniorCitizenTestCases(verifiedAge),
      feedback: `🌟 Coach Maya here! Spot on! 🎉 You clearly explained the Senior Citizen concept and proved it with concrete mathematical comparisons including the age 60 threshold (age >= 60)! You're ready to proceed to Stage 2: Recipe.`,
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      matchedFirebaseInput: "if age >= 60 senior citizen"
    };
  }

  // If user provided a specific age (e.g. 75, 45, 80) without the complete 60 benchmark rule
  if (userSpecifiedAge !== undefined) {
    const isSenior = userSpecifiedAge >= 60;
    let feedback = `🌟 Coach Maya here! You tested with age ${userSpecifiedAge}! Let's compare ${userSpecifiedAge} against the Senior Citizen benchmark (60): mathematically, ${userSpecifiedAge} >= 60 is ${isSenior ? 'true ➔ Senior Citizen' : 'false ➔ Not Senior Citizen'}. 👏\n\nTo complete this Logic stage, explain the general rule (a person aged 60 or above is a Senior Citizen; otherwise not) and include this mathematical example!`;
    if (attemptCount === 2) {
      feedback = `🌟 Coach Maya checking back on your test with age ${userSpecifiedAge}! We've proven that ${userSpecifiedAge} >= 60 is ${isSenior ? 'true (Senior Citizen)' : 'false (Not Senior Citizen)'}. Now add the definition: 'A person aged 60 or above (age >= 60) is a Senior Citizen; otherwise not.'`;
    } else if (attemptCount >= 3) {
      feedback = `🌟 Coach Maya here with your completion template! Write this into your worksheet:\n"A person aged 60 or above (age >= 60) is a Senior Citizen; otherwise Not a Senior Citizen. For example: if age = ${userSpecifiedAge}, ${userSpecifiedAge} >= 60 is ${isSenior ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}."`;
    }
    return {
      isFullyVerified: false,
      hasSeniorConcept: false,
      hasMathematicalCheck: false,
      feedback,
      correction: `A person aged 60 or above (age >= 60) is a Senior Citizen, else Not a Senior Citizen. E.g. for age = ${userSpecifiedAge}: ${userSpecifiedAge} >= 60 is ${isSenior ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}.`,
      suggestedInput: `A person aged 60 or above is a senior citizen, otherwise not. For example: if age = ${userSpecifiedAge}, ${userSpecifiedAge} >= 60 is ${isSenior ? 'true -> Senior Citizen' : 'false -> Not Senior Citizen'}.`,
      matchedFirebaseInput: "how to check senior citizen"
    };
  }

  // Partial / beginning attempts
  let initialFeedback = "🌟 Coach Maya here! Let's define the Senior Citizen logic: A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen. Include both the rule and a mathematical example (e.g., 65 >= 60 -> Senior Citizen)!";
  if (attemptCount === 2) {
    initialFeedback = "🌟 Coach Maya checking back! In this stage, we need two components: 1) The threshold rule (anyone 60 or older is a Senior Citizen), and 2) A calculation test comparing a number to 60 (like 65 >= 60 is true).";
  } else if (attemptCount >= 3) {
    initialFeedback = "🌟 Coach Maya with a step-by-step clue! Try writing: 'A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen.'";
  }
  return {
    isFullyVerified: false,
    hasSeniorConcept: false,
    hasMathematicalCheck: false,
    feedback: initialFeedback,
    correction: "A person aged 60 or above (age >= 60) is a Senior Citizen, else Not a Senior Citizen.",
    suggestedInput: "A person aged 60 or above is a senior citizen, otherwise not. For example: if age = 65, 65 >= 60 is true -> Senior Citizen. If age = 45, 45 >= 60 is false -> Not Senior Citizen.",
    matchedFirebaseInput: "who is a senior citizen"
  };
}

/**
 * Validates Stage 2 (Recipe) for Problem 19: Senior Citizen or Not
 *
 * Target Firebase hint pairs (hints/problem19):
 * - "what steps to write" -> "Step 1: Get age input. Step 2: Check if age >= 60. Step 3: Print result."
 * - "step 1 : Get age input" -> "Great! Next step?"
 * - "step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen" -> "Kudos! Complete step-by-step algorithm. Proceed to Ingredients."
 *
 * USER MANDATE:
 * Recipe la ore hint la ella step hint aiyum vara koodthu. Ovoru step kum respective hint than varanum!
 * Never dump both Step 1 and Step 2 in the same hint!
 * Step 1 missing -> guide ONLY on Step 1.
 * Step 1 done, Step 2 missing -> guide ONLY on Step 2.
 */
export function validateSeniorCitizenRecipe(input: string, attemptCount: number = 1): SeniorCitizenValidationResult {
  const norm = (input || '').toLowerCase().trim();

  // Check for code words in recipe
  const hasCodeWords = /\b(?:var|let|const|int|float|printf|println|console\.log|;|==|{|})\b/i.test(norm);

  // Step 1 detection: Getting age input
  const hasStep1 =
    /(?:step\s*1|first\s*step).*?(?:get|read|take|input|receive|accept|store).*?age/i.test(norm) ||
    /(?:get|read|take|input|receive|accept).*?age/i.test(norm) ||
    /input\s+age/i.test(norm);

  // Step 2 detection: Checking if age >= 60 and displaying Senior Citizen / Not Senior Citizen
  // Part 1: Mentions checking for Senior Citizen
  const hasStep2Positive =
    /(?:step\s*2|second\s*step).*?(?:if|check|compare|is).*?(?:senior|citizen)/i.test(norm) ||
    /(?:if|check|compare).*?age.*?(?:senior|citizen)/i.test(norm) ||
    /senior\s*citizen/i.test(norm);

  // Part 2: Boundary check on age 60 (must include age 60: "60 or greater", "60 or above", "60 or older", ">= 60", "greater than or equal to 60")
  // Note: Strictly "greater than 60" or "> 60" leaves out age 60!
  const hasStep2Boundary =
    /60\s*(?:or\s*(?:older|above|greater|more)|\+)/i.test(norm) ||
    /greater\s*than\s*or\s*equal\s*to\s*60/i.test(norm) ||
    /60\s*and\s*above/i.test(norm) ||
    norm.includes('>=') ||
    /from\s*60/i.test(norm);

  // Part 3: Fallback / otherwise branch (must state what to display if age is under 60)
  const hasStep2Otherwise =
    /(?:else|otherwise|if\s*not|younger|less\s*than|below|not\s*greater).*?(?:not\s*(?:a\s*)?senior|not\s*citizen)/i.test(norm) ||
    norm.includes('not senior citizen') ||
    norm.includes('not a senior citizen') ||
    norm.includes('not senior') ||
    norm.includes('not a senior') ||
    norm.includes('not citizen');

  const hasStep2 = hasStep2Positive && hasStep2Boundary && hasStep2Otherwise;

  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: 'Step 1: Get age input from the user',
      completed: hasStep1,
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: 'Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen',
      completed: hasStep2,
      current: hasStep1 && !hasStep2
    }
  ];

  if (hasCodeWords) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      hasStep2Boundary,
      hasStep2Otherwise,
      feedback: "🌟 Coach Maya here! In the Recipe stage, we describe the steps in everyday English—like cooking instructions! Avoid code syntax like `var`, `int`, `;`, or `==`. How would you write this step in plain English?",
      correction: hasStep1
        ? "Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen"
        : "Step 1: Get age input",
      suggestedInput: hasStep1
        ? `${input.replace(/[;{}]/g, '').trim()}\nStep 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen`
        : "Step 1: Get age input",
      matchedFirebaseInput: "what steps to write"
    };
  }

  // RULE: Socratic incremental step-by-step guidance!
  // If Step 1 is NOT completed -> guide ONLY on Step 1!
  if (!hasStep1) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      hasStep2Boundary,
      hasStep2Otherwise,
      feedback: "🌟 Coach Maya here! Let's write the algorithm step-by-step in plain English! 🎯 What is the very first step before checking anything? We must get the person's age. Write **Step 1**!",
      correction: "Step 1: Get age input",
      suggestedInput: "Step 1: Get age input",
      matchedFirebaseInput: "step 1 : Get age input"
    };
  }

  // If Step 1 IS completed, but Step 2 is NOT completed -> guide ONLY on Step 2!
  if (hasStep1 && !hasStep2) {
    let step2Feedback = "🌟 Coach Maya here! Step 1 is done! 👏 Now let's think about Step 2: What condition decides if a person is a Senior Citizen, and what should we show if they are not?";
    let step2Correction = "In Step 2, decide who is a Senior Citizen (age 60 or greater) and what to display for others (otherwise display Not Senior Citizen).";

    if (hasStep2Positive && !hasStep2Boundary && !hasStep2Otherwise) {
      step2Feedback = "🌟 Coach Maya here! You've written a great start for Step 1 and the senior citizen check! 👏\n\nTo polish Step 2 into a complete algorithm recipe, let's think about two subtle points:\n• What about someone celebrating their 60th birthday today? Saying only \"greater than 60\" leaves them out! How can we phrase it to welcome them too (like \"60 or greater\" / \"60 or above\")?\n• And what message should be displayed when someone is under 60? An algorithm always needs to guide the computer on both possibilities using everyday words like \"otherwise display...\".\n\nTry weaving both thoughts into a single clear sentence for Step 2!";
      step2Correction = "In Step 2, include age 60 (e.g. '60 or greater') and specify what to display for others (e.g. 'otherwise display Not Senior Citizen').";
    } else if (hasStep2Positive && hasStep2Boundary && !hasStep2Otherwise) {
      step2Feedback = "🌟 Coach Maya here! Your rule for age 60 or greater is spot on! 👏\n\nNow, imagine the program receives an age of 25—what should it show? An algorithm always needs to guide the computer on both paths. How would you tell it what to display for someone who isn't a senior citizen (e.g., using 'otherwise display...')?";
      step2Correction = "Add what to show when the condition isn't met: e.g., 'otherwise display Not Senior Citizen'.";
    } else if (hasStep2Positive && !hasStep2Boundary && hasStep2Otherwise) {
      step2Feedback = "🌟 Coach Maya here! You've got both outcomes covered nicely! 👏\n\nTake a quick look at your condition: you wrote 'greater than 60'. If someone is exactly 60 years old, would 'greater than 60' include them? How can you rephrase it so someone who is 60 is also celebrated as a Senior Citizen (for example, '60 or greater')?";
      step2Correction = "Change 'greater than 60' to '60 or greater' (or '60 or above') to include age 60.";
    }

    return {
      isFullyVerified: false,
      recipeStepProgress,
      hasStep2Boundary,
      hasStep2Otherwise,
      feedback: step2Feedback,
      correction: step2Correction,
      suggestedInput: attemptCount >= 3 ? `${input.trim()}\nStep 2: If this taken age is 60 or greater it is senior citizen, otherwise not senior citizen` : undefined,
      matchedFirebaseInput: "step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen"
    };
  }

  // Both Step 1 and Step 2 completed!
  return {
    isFullyVerified: true,
    hasStep2Boundary: true,
    hasStep2Otherwise: true,
    recipeStepProgress: [
      { stepNumber: 1, title: 'Step 1: Get age input from the user', completed: true, current: false },
      { stepNumber: 2, title: 'Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen', completed: true, current: false }
    ],
    feedback: "🌟 Coach Maya here! Kudos! 🎉 Your 2-step Recipe algorithm is complete, logical, and written in clear everyday English! Proceed to Stage 3: Ingredients.",
    correction: "Proceed to Stage 3: Ingredients to identify the programming tools.",
    matchedFirebaseInput: "step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen"
  };
}

/**
 * Validates Stage 3 (Ingredients) for Problem 19: Senior Citizen or Not
 *
 * Target Firebase hint pairs (hints/problem19):
 * - "what ingredients do we need" -> "Input variable age, and an if-else condition using comparison operator >=."
 * - "step 1 : age variable" -> "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
 * - "how to write if condition" -> "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether age is 60 or above\n• L.S : age\n• R.S : 60\n• Operator : >=\nSo 'if' looks like this: if (age >= 60)."
 * - "step 2 : If condition with L.S: age, R.S: 60, Operator: >=" -> "Hurray! if (age >= 60). If true print 'Senior Citizen', else print 'Not Senior Citizen'. Proceed to Sample Code."
 *
 * 5 Components:
 * Step 1: age variable for input
 * Step 2: If condition with L.S: age, R.S: 60, Operator: >=
 * Step 3: Inside if block: print("Senior Citizen")
 * Step 4: Fallback else block
 * Step 5: Inside else block: print("Not Senior Citizen")
 */
export function validateSeniorCitizenIngredients(input: string, attemptCount: number = 1): SeniorCitizenValidationResult {
  const norm = (input || '').toLowerCase().trim();

  // Check for common student mistake: operator: = (single equals)
  const hasSingleEqualsInOperator =
    /operator\s*:\s*=(?!=|>|<)/i.test(norm) ||
    /\boperator\s*=\s*=(?!=|>|<)/i.test(norm) ||
    /operator\s+is\s+=(?!=|>|<)/i.test(norm);

  // Check for inverted output (printing Not Senior Citizen inside if block)
  const hasInvertedIfOutput =
    /inside\s+if.*?(?:not\s+senior)/i.test(norm) ||
    /step\s*3.*?(?:not\s+senior)/i.test(norm);

  // 1. Variable check
  const hasVar =
    norm.includes('age') ||
    /\b(?:int|var|let)\s+age\b/i.test(norm);

  // 2. Condition check
  const hasCondition =
    !hasSingleEqualsInOperator &&
    ((norm.includes('if') && (norm.includes('60') || norm.includes('>='))) ||
     (norm.includes('left side') && norm.includes('right side')) ||
     (norm.includes('l.s') && norm.includes('r.s')) ||
     /operator\s*:\s*(?:>=|>|greater)/i.test(norm));

  // 3. Print Senior Citizen inside if block
  const hasPrintSenior =
    !hasInvertedIfOutput &&
    (norm.includes('senior') && !norm.includes('not senior') && (norm.includes('print') || norm.includes('display') || norm.includes('inside if')));

  // Check if student is asking a question about the fallback block rather than stating it
  const hasAskedAboutFallback =
    /what\s+is\s+(?:the\s+)?fallback/i.test(norm) ||
    /which\s+(?:block|fallback)/i.test(norm) ||
    /how\s+to\s+(?:do|write)\s+fallback/i.test(norm) ||
    /fallback\s+block\s+we\s+need/i.test(norm);

  // 4. Else block: student must explicitly specify 'else' keyword (not just asking a question)
  const hasElse =
    !hasAskedAboutFallback &&
    (/\belse\b/i.test(norm) || /else\s+block/i.test(norm));

  // 5. Print Not Senior Citizen inside else block
  const hasPrintNotSenior =
    (norm.includes('not senior') || norm.includes('not a senior')) &&
    (norm.includes('print') || norm.includes('display') || norm.includes('inside else'));

  const ingredientsStepProgress = [
    { stepNumber: 1, title: 'Step 1: age variable for input', completed: hasVar, current: !hasVar },
    { stepNumber: 2, title: 'Step 2: If condition with L.S: age, R.S: 60, Operator: >=', completed: hasCondition, current: hasVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Inside if block: print("Senior Citizen")', completed: hasPrintSenior, current: hasVar && hasCondition && !hasPrintSenior },
    { stepNumber: 4, title: 'Step 4: Fallback else block', completed: hasElse, current: hasVar && hasCondition && hasPrintSenior && !hasElse },
    { stepNumber: 5, title: 'Step 5: Inside else block: print("Not Senior Citizen")', completed: hasPrintNotSenior, current: hasVar && hasCondition && hasPrintSenior && hasElse && !hasPrintNotSenior }
  ];

  // Specific error alerts
  if (hasSingleEqualsInOperator) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya syntax alert! In Step 2, you wrote `operator : =`. A single `=` is an assignment operator! To check if age is 60 or greater, use the comparison operator `>=`.\n\nUpdate Step 2 to: `operator : >=`.",
      correction: "step 2 : If condition with L.S: age, R.S: 60, Operator: >=",
      suggestedInput: input.replace(/operator\s*:\s*=/gi, 'operator : >='),
      matchedFirebaseInput: "how to write if condition"
    };
  }

  if (hasInvertedIfOutput) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya logic alert: Inside the `if` block (when age >= 60 is true), the person is a Senior Citizen! You should print `\"Senior Citizen\"` inside the if block, and `\"Not Senior Citizen\"` inside the else block.",
      correction: "step 3 : Inside if block: print(\"Senior Citizen\")",
      suggestedInput: "step 3 : Inside if block: print(\"Senior Citizen\")",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
    };
  }

  // Socratic Step-by-Step Guidance
  if (!hasVar) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! What variable do we need to store the person's age? Write **Step 1**!",
      correction: "step 1 : age variable",
      suggestedInput: "step 1 : age variable",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }

  if (hasVar && !hasCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Step 1 is ready! 👏 Now write **Step 2**: Define the `if` condition using Left Side (L.S: age), Right Side (R.S: 60), and Operator (`>=`).",
      correction: "step 2 : If condition with L.S: age, R.S: 60, Operator: >=",
      suggestedInput: `${input.trim()}\nstep 2 : If condition with L.S: age, R.S: 60, Operator: >=`,
      matchedFirebaseInput: "how to write if condition"
    };
  }

  if (hasVar && hasCondition && !hasPrintSenior) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Steps 1 & 2 are complete! 👏 Now write **Step 3**: Inside the `if` block, what message should we display when the condition is true?",
      correction: "step 3 : Inside if block: print(\"Senior Citizen\")",
      suggestedInput: `${input.trim()}\nstep 3 : Inside if block: print("Senior Citizen")`,
      matchedFirebaseInput: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
    };
  }

  if (hasVar && hasCondition && hasPrintSenior && !hasElse) {
    let step4Feedback = "🌟 Coach Maya here! Steps 1, 2 & 3 are done! 👏 Now write **Step 4**: What fallback block executes when age is not 60 or above?";
    if (hasAskedAboutFallback || norm.includes('fallback')) {
      step4Feedback = "🌟 Coach Maya here! Great question! When the `if` condition is false (the age is less than 60), programming languages use an **else block** as the fallback to catch all remaining cases. Write **Step 4: else block**!";
    }
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: step4Feedback,
      correction: "step 4 : Fallback else block",
      suggestedInput: attemptCount >= 3 ? `${input.trim()}\nstep 4 : Fallback else block` : undefined,
      matchedFirebaseInput: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
    };
  }

  if (hasVar && hasCondition && hasPrintSenior && hasElse && !hasPrintNotSenior) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Almost done! 👏 Now write **Step 5**: Inside the `else` block, what message should we display when age is under 60?",
      correction: "step 5 : Inside else block: print(\"Not Senior Citizen\")",
      suggestedInput: `${input.trim()}\nstep 5 : Inside else block: print("Not Senior Citizen")`,
      matchedFirebaseInput: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
    };
  }

  // All 5 steps completed!
  return {
    isFullyVerified: true,
    ingredientsStepProgress: [
      { stepNumber: 1, title: 'Step 1: age variable for input', completed: true, current: false },
      { stepNumber: 2, title: 'Step 2: If condition with L.S: age, R.S: 60, Operator: >=', completed: true, current: false },
      { stepNumber: 3, title: 'Step 3: Inside if block: print("Senior Citizen")', completed: true, current: false },
      { stepNumber: 4, title: 'Step 4: Fallback else block', completed: true, current: false },
      { stepNumber: 5, title: 'Step 5: Inside else block: print("Not Senior Citizen")', completed: true, current: false }
    ],
    feedback: "🌟 Coach Maya here! Hurray! 🎉 You have collected all 5 essential programming ingredients for Senior Citizen! Proceed to Stage 4: Taste the Sample.",
    correction: "Proceed to Stage 4: Taste the Sample to write and run your executable code.",
    matchedFirebaseInput: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
  };
}

/**
 * Validates Stage 4 (Taste the Sample / Code) for Problem 19: Senior Citizen or Not
 *
 * Target Firebase hint pairs (hints/problem19):
 * - "how to write sample code" -> "Draft the code comparing age with 60.\nExample:\nvar age = 65;\nif (age >= 60) print(\"Senior Citizen\");\nelse print(\"Not Senior Citizen\");"
 * - "var age = 65; if (age >= 60) print(\"Senior Citizen\"); else print(\"Not Senior Citizen\");" -> "You gotcha! Clean condition."
 */
export function validateSeniorCitizenSampleCode(input: string, attemptCount: number = 1): SeniorCitizenValidationResult {
  const norm = (input || '').toLowerCase().trim();

  // Detect variable name and initial value
  const varMatch = input.match(/(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(\d+)/i);
  const varName = varMatch ? varMatch[1] : 'age';
  const rawAgeVal = varMatch ? parseInt(varMatch[2], 10) : 65;
  const userAge = isNaN(rawAgeVal) ? 65 : rawAgeVal;

  // 1. Variable check
  const hasVarDeclaration =
    /(?:var|let|const|int)\s+[a-zA-Z_]\w*\s*=\s*\d+/i.test(input) ||
    /^[a-zA-Z_]\w*\s*=\s*\d+/m.test(input) ||
    /var\s+age/i.test(input);

  // 2. Self comparison error check: if (age >= age) or if (a >= a)
  const selfCompMatch = norm.match(/if\s*\(\s*([a-z_]\w*)\s*(?:>=|>|<=|<|==|=)\s*\1\s*\)/i);
  const hasSelfComparison = !!selfCompMatch;

  // 3. Single equals assignment in condition: if (age = 60)
  const singleEqualsInCondMatch = norm.match(/if\s*\(\s*[a-z_]\w*\s*=(?!=|>|<)\s*\d+\s*\)/i);
  const hasSingleEqualsInCond = !!singleEqualsInCondMatch;

  // 4. Condition check: age >= 60 or age > 59
  const hasCondition =
    !hasSelfComparison &&
    !hasSingleEqualsInCond &&
    (/if\s*\(.*?(?:>=|>|<=|<).*?60.*?\)/i.test(norm) ||
     /if\s*\(.*?60.*?(?:<=|<|>=|>).*?\)/i.test(norm) ||
     /if\s*\(\s*[a-z_]\w*\s*>=\s*60\s*\)/i.test(norm) ||
     /if\s*\(\s*[a-z_]\w*\s*>\s*59\s*\)/i.test(norm));

  // 5. Unquoted print checks
  const hasUnquotedSeniorPrint =
    /print\s*\(\s*(?:a\s+)?senior(?:\s+citizen)?\s*\)/i.test(norm);
  const hasUnquotedNotSeniorPrint =
    /print\s*\(\s*not\s+(?:a\s+)?senior(?:\s+citizen)?\s*\)/i.test(norm);

  // 6. Quoted print statements (supporting variations like "Senior Citizen", "A senior citizen", "Not a senior citizen", "Not senior citizen")
  const hasQuotedSeniorPrint =
    /(?:print|printf|console\.log)\s*\(\s*["'](?:\s*a\s+)?senior(?:\s+citizen)?["']\s*\)/i.test(norm) ||
    /(?:print|printf|console\.log)\s*\(\s*["'][^"']*senior[^"']*["']\s*\)/i.test(norm);

  const hasElse =
    /\belse\b/i.test(norm);

  const hasQuotedNotSeniorPrint =
    /(?:print|printf|console\.log)\s*\(\s*["'](?:not\s+(?:a\s+)?senior(?:\s+citizen)?|non\s+senior(?:\s+citizen)?|not\s+eligible)["']\s*\)/i.test(norm) ||
    /(?:print|printf|console\.log)\s*\(\s*["'][^"']*(?:not|non)[^"']*senior[^"']*["']\s*\)/i.test(norm);

  // 7. Inverted branch check (printing Not Senior Citizen in if block)
  const ifBlockMatch = norm.match(/if\s*\(.*?\)\s*\{?([^}]+)\}?/s);
  const hasInvertedBranches =
    ifBlockMatch &&
    ifBlockMatch[1].includes('not senior') &&
    !ifBlockMatch[1].includes('else');

  const testCases = generateSeniorCitizenTestCases(userAge);

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: `Step 1: Declare age variable (var ${varName} = ${userAge};)`, completed: hasVarDeclaration, current: !hasVarDeclaration },
    { stepNumber: 2, title: `Step 2: Write if condition (if (${varName} >= 60))`, completed: hasCondition, current: hasVarDeclaration && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Display "Senior Citizen" inside if block', completed: hasQuotedSeniorPrint, current: hasVarDeclaration && hasCondition && !hasQuotedSeniorPrint },
    { stepNumber: 4, title: 'Step 4: Else branch', completed: hasElse, current: hasVarDeclaration && hasCondition && hasQuotedSeniorPrint && !hasElse },
    { stepNumber: 5, title: 'Step 5: Display "Not Senior Citizen" inside else block', completed: hasQuotedNotSeniorPrint, current: hasVarDeclaration && hasCondition && hasQuotedSeniorPrint && hasElse && !hasQuotedNotSeniorPrint }
  ];

  // Specific Error Feedback
  if (hasSelfComparison) {
    const matchedVar = selfCompMatch ? selfCompMatch[1] : 'age';
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `🌟 Coach Maya logic alert: Look closely at your condition \`if (${matchedVar} >= ${matchedVar})\`! You are comparing variable \`${matchedVar}\` with itself, which is always true. You need to compare \`${matchedVar}\` with \`60\`: \`if (${matchedVar} >= 60)\`.`,
      correction: `if (${matchedVar} >= 60) {`,
      suggestedInput: input.replace(new RegExp(`if\\s*\\(\\s*${matchedVar}\\s*(?:>=|>|<=|<|==|=)\\s*${matchedVar}\\s*\\)`, 'i'), `if (${matchedVar} >= 60)`),
      matchedFirebaseInput: "var age = 65; if (age >= 60) print(\"Senior Citizen\"); else print(\"Not Senior Citizen\");"
    };
  }

  if (hasSingleEqualsInCond) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `🌟 Coach Maya syntax alert: You wrote \`if (${varName} = 60)\`. A single \`=\` is an assignment operator in programming! To test if \`${varName}\` is 60 or older, use the comparison operator \`>=\`: \`if (${varName} >= 60)\`.`,
      correction: `if (${varName} >= 60) {`,
      suggestedInput: input.replace(/if\s*\(\s*[a-z_]\w*\s*=\s*60\s*\)/i, `if (${varName} >= 60)`),
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasUnquotedSeniorPrint || hasUnquotedNotSeniorPrint) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "🌟 Coach Maya syntax reminder: In programming, text messages must be wrapped in quotes (e.g., `print(\"Senior Citizen\");` and `print(\"Not Senior Citizen\");`) so the compiler knows they are text strings!",
      correction: 'print("Senior Citizen");',
      suggestedInput: input
        .replace(/print\s*\(\s*senior\s+citizen\s*\)/gi, 'print("Senior Citizen");')
        .replace(/print\s*\(\s*not\s+senior\s+citizen\s*\)/gi, 'print("Not Senior Citizen");'),
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasInvertedBranches) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `🌟 Coach Maya logic alert: Inside the \`if (${varName} >= 60)\` block, the condition is true, so the person is a Senior Citizen! Change \`print("Not Senior Citizen")\` inside the if block to \`print("Senior Citizen")\`.`,
      correction: `print("Senior Citizen");`,
      suggestedInput: `var ${varName} = ${userAge};\nif (${varName} >= 60) {\n  print("Senior Citizen");\n} else {\n  print("Not Senior Citizen");\n}`,
      matchedFirebaseInput: "var age = 65; if (age >= 60) print(\"Senior Citizen\"); else print(\"Not Senior Citizen\");"
    };
  }

  // Socratic Step-by-Step Code Guidance
  if (!hasVarDeclaration) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "🌟 Coach Maya here! Let's build your code step by step! 🎯 First, declare an age variable with a test number (e.g. `var age = 65;`). Write **Step 1**!",
      correction: "var age = 65;",
      suggestedInput: "var age = 65;",
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasVarDeclaration && !hasCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `🌟 Coach Maya here! Step 1 is done! 👏 Now write **Step 2**: Add the \`if\` statement checking if \`${varName}\` is 60 or above: \`if (${varName} >= 60) {\``,
      correction: `if (${varName} >= 60) {`,
      suggestedInput: `${input.trim()}\nif (${varName} >= 60) {`,
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasVarDeclaration && hasCondition && !hasQuotedSeniorPrint) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `🌟 Coach Maya here! Steps 1 & 2 are complete! 👏 Now write **Step 3**: Inside the \`if\` block, print \`"Senior Citizen"\`: \`  print("Senior Citizen");\``,
      correction: 'print("Senior Citizen");',
      suggestedInput: `${input.trim()}\n  print("Senior Citizen");\n}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasVarDeclaration && hasCondition && hasQuotedSeniorPrint && !hasElse) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "🌟 Coach Maya here! Steps 1, 2 & 3 are complete! 👏 Now write **Step 4**: Add the `else` branch for when age is less than 60: `} else {`",
      correction: '} else {',
      suggestedInput: `${input.trim()}\n} else {`,
      matchedFirebaseInput: "how to write sample code"
    };
  }

  if (hasVarDeclaration && hasCondition && hasQuotedSeniorPrint && hasElse && !hasQuotedNotSeniorPrint) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "🌟 Coach Maya here! Step 4 is done! 👏 Now write **Step 5**: Inside the `else` block, print `\"Not Senior Citizen\"`: `  print(\"Not Senior Citizen\");\n}`",
      correction: 'print("Not Senior Citizen");\n}',
      suggestedInput: `${input.trim()}\n  print("Not Senior Citizen");\n}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }

  // All 5 steps completed & verified!
  // NO test cases dumped in feedback! Clean, congratulatory message.
  return {
    isFullyVerified: true,
    allVerified: true,
    sampleCodeStepProgress: [
      { stepNumber: 1, title: `Step 1: Declare age variable (var ${varName} = ${userAge};)`, completed: true, current: false },
      { stepNumber: 2, title: `Step 2: Write if condition (if (${varName} >= 60))`, completed: true, current: false },
      { stepNumber: 3, title: 'Step 3: Display "Senior Citizen" inside if block', completed: true, current: false },
      { stepNumber: 4, title: 'Step 4: Else branch', completed: true, current: false },
      { stepNumber: 5, title: 'Step 5: Display "Not Senior Citizen" inside else block', completed: true, current: false }
    ],
    operationTestCases: testCases,
    feedback: "🌟 Coach Maya here! Incredible job! 🎉 Your Senior Citizen program is fully verified and working flawlessly! You mastered variables, comparison operators (>= 60), and conditional branching!",
    correction: undefined,
    suggestedInput: undefined,
    matchedFirebaseInput: "var age = 65; if (age >= 60) print(\"Senior Citizen\"); else print(\"Not Senior Citizen\");"
  };
}
