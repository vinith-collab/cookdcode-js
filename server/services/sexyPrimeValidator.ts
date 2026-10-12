/**
 * Sexy Prime Numbers (Problem 08) Validator & Pedagogy Matrix
 * Rule: Pairs of prime numbers that differ by 6: (p, p + 6) such that BOTH p and p + 6 are prime.
 * Base Primitive: Primality Check (divisors count == 2).
 */

export interface StepProgress {
  stepNumber: number;
  title: string;
  completed: boolean;
  current: boolean;
}

export interface SexyPrimeLogicValidation {
  isFullyVerified: boolean;
  hasPairDifference: boolean;
  hasBothMustBePrime: boolean;
  hasRangeLimit: boolean;
  hasNonPrimeExample: boolean;
  isDontKnow: boolean;
  matchedFirebaseInput?: string;
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  proofType?: 'mathematical' | 'theoretical';
}

export interface SexyPrimeRecipeValidation {
  isFullyVerified: boolean;
  hasStep1Input: boolean;
  hasStep2OuterLoop: boolean;
  hasStep3CheckPPrime: boolean;
  hasStep4CheckPPlus6Prime: boolean;
  hasStep5PrintPair: boolean;
  hasCodeKeywords: boolean;
  matchedFirebaseInput?: string;
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  stepProgress: StepProgress[];
  recipeStepProgress: StepProgress[];
  steps: StepProgress[];
}

export interface SexyPrimeIngredientsValidation {
  isFullyVerified: boolean;
  hasLimitVar: boolean;
  hasCandidateVars: boolean;
  hasSeparateCounters: boolean;
  hasLoops: boolean;
  hasCombinedCondition: boolean;
  matchedFirebaseInput?: string;
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  stepProgress: StepProgress[];
  ingredientsStepProgress: StepProgress[];
}

export interface SexyPrimeSampleCodeValidation {
  allVerified: boolean;
  hasUpperLimit: boolean;
  hasOuterLoopRange: boolean;
  hasFirstPrimeCheck: boolean;
  hasSecondPrimeCheck: boolean;
  hasSeparateCounters: boolean;
  hasCombinedVerification: boolean;
  hasOutputPair: boolean;
  hasSinglePrimeOnlyBug: boolean;
  hasCounterOverlapBug: boolean;
  hasUpperLimitOverflowBug: boolean;
  matchedFirebaseInput?: string;
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  sampleCodeStepProgress: StepProgress[];
}

/**
 * Validates Stage 1: Logic for Sexy Prime Numbers
 */
export function validateSexyPrimeLogic(input: string): SexyPrimeLogicValidation {
  const norm = (input || '').toLowerCase().replace(/[^a-z0-9\s%+=\-*\/]/g, ' ').replace(/\s+/g, ' ').trim();

  const isDontKnow =
    norm.includes("don't know") ||
    norm.includes("dont know") ||
    norm.includes("puriyala") ||
    norm.includes("theriyala") ||
    norm.includes("no idea") ||
    norm === "i don t know";

  if (isDontKnow || norm.includes('what is sexy prime') || norm.includes('help') || norm.includes('what to do')) {
    return {
      isFullyVerified: false,
      hasPairDifference: false,
      hasBothMustBePrime: false,
      hasRangeLimit: false,
      hasNonPrimeExample: false,
      isDontKnow: true,
      matchedFirebaseInput: "what is sexy prime number",
      feedback: "🌟 Coach Maya here! Sexy primes are pairs of prime numbers (p, p + 6) that differ by six (the name comes from 'sex', Latin for six).\nFor example:\n• (5, 11): 5 has 2 divisors (1, 5) -> Prime! 11 has 2 divisors (1, 11) -> Prime! Difference is 11 - 5 = 6.\n• (7, 13): Both 7 and 13 are prime, difference is 6.\nBoth numbers in the pair MUST have exactly 2 divisors!",
      correction: "State that sexy primes are pairs (p, p + 6) where both p and p + 6 are prime numbers (each having 2 divisors).",
      suggestedInput: "for each number p up to n - 6, check if both p and p + 6 have exactly 2 divisors (are prime numbers)"
    };
  }

  const hasPairDifference =
    norm.includes('diff') ||
    norm.includes('difference of 6') ||
    norm.includes('differ by 6') ||
    norm.includes('p + 6') ||
    norm.includes('p+6') ||
    norm.includes('6 difference') ||
    norm.includes('gap of 6') ||
    norm.includes('difference is 6') ||
    norm.includes('differ by six') ||
    norm.includes('difference of six');

  const hasBothMustBePrime =
    (norm.includes('both') && (norm.includes('prime') || norm.includes('2 divisors') || norm.includes('two divisors'))) ||
    (norm.includes('p is prime') && (norm.includes('p 6 is prime') || norm.includes('p+6 is prime') || norm.includes('p + 6 is prime'))) ||
    (norm.includes('5 and 11') && (norm.includes('prime') || norm.includes('divisors'))) ||
    (norm.includes('7 and 13') && (norm.includes('prime') || norm.includes('divisors'))) ||
    (norm.includes('two prime') && (norm.includes('6') || norm.includes('six')));

  const hasRangeLimit =
    norm.includes('n - 6') ||
    norm.includes('n-6') ||
    norm.includes('upper bound') ||
    norm.includes('limit') ||
    norm.includes('exceed n');

  const hasNonPrimeExample =
    (norm.includes('19') && norm.includes('25')) ||
    norm.includes('25 is not prime') ||
    norm.includes('25 is composite');

  let matchedFirebaseInput: string | undefined;

  if (hasBothMustBePrime && hasPairDifference) {
    matchedFirebaseInput = "what is sexy prime number";
  } else if (hasNonPrimeExample) {
    matchedFirebaseInput = "what if p is prime but p+6 is not prime";
  } else if (hasRangeLimit) {
    matchedFirebaseInput = "what is the upper bound condition";
  } else if (norm.includes('5') && norm.includes('11')) {
    matchedFirebaseInput = "is 5 and 11 a sexy prime pair";
  }

  const isFullyVerified =
    (hasPairDifference && hasBothMustBePrime) ||
    (norm.includes('both') && norm.includes('p') && (norm.includes('p + 6') || norm.includes('p+6')) && norm.includes('prime')) ||
    ((norm.includes('5, 11') || norm.includes('5 and 11')) && (norm.includes('7, 13') || norm.includes('7 and 13')) && norm.includes('prime'));

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      hasPairDifference,
      hasBothMustBePrime,
      hasRangeLimit,
      hasNonPrimeExample,
      isDontKnow: false,
      matchedFirebaseInput: "for each number p up to n-6 check if both p and p+6 are prime",
      feedback: "🌟 Coach Maya here! Fantastic! 🎉 Sexy primes are pairs of prime numbers (p, p + 6) where both numbers have exactly 2 divisors (are prime) and differ by 6. You have proven the mathematical logic! Proceed to Recipe.",
      correction: "Proceed to the Recipe stage to sequence the algorithmic steps.",
      suggestedInput: undefined,
      proofType: 'mathematical'
    };
  }

  return {
    isFullyVerified: false,
    hasPairDifference,
    hasBothMustBePrime,
    hasRangeLimit,
    hasNonPrimeExample,
    isDontKnow: false,
    matchedFirebaseInput,
    feedback: hasPairDifference && !hasBothMustBePrime
      ? "🌟 Coach Maya here! Good observation about the difference of 6! But remember: what condition must be true for BOTH numbers 'p' and 'p + 6' in the pair?"
      : "🌟 Coach Maya here! How do we define a sexy prime pair? For example, with numbers 5 and 11, why are they considered a sexy prime pair (check their difference and divisor counts)?",
    correction: "State that both p and p + 6 must be prime numbers differing by 6.",
    suggestedInput: "for each candidate p up to n - 6, check if both p and p + 6 have exactly 2 divisors (are prime numbers)"
  };
}

/**
 * Validates Stage 2: Recipe for Sexy Prime Numbers
 * Requires all 5 sequential steps in plain English without code jargon.
 */
export function validateSexyPrimeRecipe(input: string, attemptCount: number = 1): SexyPrimeRecipeValidation {
  const norm = (input || '').toLowerCase().replace(/[^a-z0-9\s%+=\-*\/]/g, ' ').replace(/\s+/g, ' ').trim();
  const rawText = (input || '').toLowerCase();
  const rawLines = (input || '').split('\n').map(l => l.trim()).filter(Boolean);
  const cleanLines = rawLines.map(l => l.replace(/^s?tep\s*\d+[\s.:-]*/i, '').trim().toLowerCase());

  const isConfused =
    rawText.includes('not understand') ||
    rawText.includes("don't understand") ||
    rawText.includes('dont understand') ||
    rawText.includes('puriyala') ||
    rawText.includes('purila') ||
    rawText.includes('doubt') ||
    rawText.includes('stuck') ||
    rawText.includes('help') ||
    rawText.includes('why') ||
    rawText.includes('how to');

  // Map explicitly numbered steps if provided (e.g. STEP 2:, sTEP 3:, etc.)
  const stepMap: { [key: number]: string } = {};
  rawLines.forEach(line => {
    const match = line.match(/^s?tep\s*(\d+)[\s.:-]*(.*)$/i);
    if (match) {
      const stepNum = parseInt(match[1], 10);
      stepMap[stepNum] = (match[2] || '').trim().toLowerCase();
    }
  });

  // Step 1: Get upper limit number from user
  let hasStep1Input = false;
  if (stepMap[1]) {
    const l = stepMap[1];
    hasStep1Input =
      (l.includes('limit') || l.includes('upper') || l.includes('boundary') || l.includes('max') || l.includes('given number') || l.includes('number n') || l.includes('value of n') || l.includes('input number')) &&
      !l.includes('each number') && !l.includes('from 2') && !l.includes('check');
  } else {
    hasStep1Input = cleanLines.some(l => {
      const isLimit = l.includes('limit') || l.includes('upper') || l.includes('boundary') || l.includes('max') || l.includes('range limit') || l.includes('input number') || l.includes('given number');
      const isGet = l.includes('get') || l.includes('take') || l.includes('read') || l.includes('receive') || l.includes('first we') || l.includes('first get') || l.includes('start with') || l.includes('accept');
      const isNotLoop = !l.includes('each number') && !l.includes('from 2') && !l.includes('for each') && !l.includes('less than 6') && !l.includes('check') && !l.includes('numbers of input');
      return (isLimit && isGet) && isNotLoop;
    }) || norm.includes('first we get the limit') || norm.includes('get upper limit') || norm.includes('get the upper limit') || norm.includes('get the limit') || norm.includes('accept the limit');
  }

  // Step 2: For each number starting from 2 up to 6 less than the limit
  let hasStep2OuterLoop = false;
  if (stepMap[2]) {
    const l = stepMap[2];
    hasStep2OuterLoop =
      l.includes('each number') || l.includes('every number') || l.includes('from 2') || l.includes('starting from 2') || l.includes('2 to') || l.includes('6 less') || l.includes('less than 6') || l.includes('limit minus 6') || l.includes('limit - 6') || l.includes('6 before') || l.includes('check each') || l.includes('check number') || l.includes('candidate');
  } else {
    hasStep2OuterLoop = cleanLines.some(l => {
      const isEach = l.includes('each number') || l.includes('every number') || l.includes('candidate') || l.includes('p from 2') || l.includes('numbers from 2') || l.includes('from 2 up to') || l.includes('from 2 to') || l.includes('starting from 2') || l.includes('2 to n - 6') || l.includes('2 to n-6') || l.includes('6 less than') || l.includes('less than 6') || l.includes('limit minus 6') || l.includes('6 before the limit');
      const isLoop = l.includes('repeat') || l.includes('iterate') || l.includes('go through') || l.includes('check all') || l.includes('for each') || l.includes('loop') || l.includes('need to check') || l.includes('check each');
      const isNotStep1 = !l.includes('first we get the limit') && !l.includes('get upper limit') && !l.includes('get the limit');
      return (isEach || isLoop) && isNotStep1;
    }) || norm.includes('from 2 up to') || norm.includes('for each number') || norm.includes('starting from 2') || norm.includes('6 less than the limit') || norm.includes('less than 6 in the limit');
  }

  // Step 3: Check if the first number is prime (has 2 divisors)
  let hasStep3CheckPPrime = false;
  if (stepMap[3]) {
    const l = stepMap[3];
    const hasNotPrimeFlaw =
      (l.includes('is not prime') || l.includes('not prime number') || l.includes('is composite')) &&
      !l.includes('skip') && !l.includes('ignore') && !l.includes('do not print') && !l.includes('continue');
    hasStep3CheckPPrime = (l.includes('prime') || l.includes('divisor') || l.includes('two') || l.includes('check')) && !hasNotPrimeFlaw;
  } else {
    hasStep3CheckPPrime = cleanLines.some(l => {
      const isFirstNum = l.includes('check if p') || l.includes('check p') || l.includes('p is prime') || l.includes('first number is prime') || l.includes('test divisors for p') || l.includes('if p is a prime') || l.includes('first candidate is prime') || l.includes('current number is prime') || l.includes('number is prime') || l.includes('check if the number is prime') || l.includes('first number has');
      const isNotP6 = !l.includes('p + 6') && !l.includes('p+6') && !l.includes('second') && !l.includes('plus 6') && !l.includes('plus six') && !l.includes('adding 6') && !l.includes('after the 6') && !l.includes('after 6');
      const hasStep3NotPrimeFlaw =
        (l.includes('is not prime') || l.includes('not prime number') || l.includes('is composite')) &&
        !l.includes('skip') && !l.includes('ignore') && !l.includes('do not print') && !l.includes('continue');
      return (isFirstNum || (l.includes('check') && l.includes('prime'))) && isNotP6 && !hasStep3NotPrimeFlaw;
    });
  }

  // Step 4: Check if the number plus six is also prime (has 2 divisors)
  let hasStep4CheckPPlus6Prime = false;
  if (stepMap[4]) {
    const l = stepMap[4];
    const isP6 =
      l.includes('p + 6') || l.includes('p+6') || l.includes('p plus 6') || l.includes('companion') ||
      l.includes('second') || l.includes('plus 6') || l.includes('plus six') || l.includes('adding 6') ||
      l.includes('adding six') || l.includes('add 6') || l.includes('6 greater') || l.includes('six greater') ||
      l.includes('after the 6') || l.includes('after 6') || l.includes('6 numbers of') || l.includes('6 numbers after') ||
      l.includes('6 more') || l.includes('difference of 6') || l.includes('differ by 6') || l.includes('differ by six') ||
      (l.includes('6') && (l.includes('second') || l.includes('next') || l.includes('after') || l.includes('other') || l.includes('number')));
    const isPrime = l.includes('prime') || l.includes('divisor') || l.includes('divisors') || l.includes('check') || l.includes('two');
    const hasNotPrimeFlaw =
      (l.includes('is not prime') || l.includes('not prime number') || l.includes('if this number is not prime')) &&
      !l.includes('skip') && !l.includes('ignore') && !l.includes('do not print') && !l.includes('continue');
    hasStep4CheckPPlus6Prime = isP6 && isPrime && !hasNotPrimeFlaw;
  } else {
    hasStep4CheckPPlus6Prime = cleanLines.some(l => {
      // Must NOT be step 2 line (e.g. less than 6 in the limit)
      if (l.includes('less than 6') || l.includes('6 less than') || l.includes('from 2 up to')) return false;
      const isP6 =
        l.includes('p + 6') || l.includes('p+6') || l.includes('p plus 6') || l.includes('companion') ||
        l.includes('second') || l.includes('plus 6') || l.includes('plus six') || l.includes('adding 6') ||
        l.includes('adding six') || l.includes('add 6') || l.includes('6 greater') || l.includes('six greater') ||
        l.includes('after the 6') || l.includes('after 6') || l.includes('6 numbers of') || l.includes('6 numbers after') ||
        l.includes('6 more') || l.includes('difference of 6') || l.includes('differ by 6') || l.includes('differ by six');
      const isPrime = l.includes('prime') || l.includes('divisor') || l.includes('divisors') || l.includes('check') || l.includes('two');
      const hasNotPrimeFlaw =
        (l.includes('is not prime') || l.includes('not prime number') || l.includes('if this number is not prime')) &&
        !l.includes('skip') && !l.includes('ignore') && !l.includes('do not print') && !l.includes('continue');
      return isP6 && isPrime && !hasNotPrimeFlaw;
    });
  }

  // Step 5: If both numbers are prime, display them as a pair
  let hasStep5PrintPair = false;
  if (stepMap[5]) {
    const l = stepMap[5];
    const isPrint = l.includes('display') || l.includes('print') || l.includes('show') || l.includes('output') || l.includes('record') || l.includes('are sexy prime') || l.includes('these numbers are') || l.includes('they are') || l.includes('result') || l.includes('form') || l.includes('pair');
    const isPair = l.includes('pair') || l.includes('both') || l.includes('two numbers') || l.includes('sexy prime') || l.includes('these numbers');
    hasStep5PrintPair = isPrint || isPair;
  } else {
    hasStep5PrintPair = cleanLines.some(l => {
      const isPrint = l.includes('display') || l.includes('print') || l.includes('show') || l.includes('output') || l.includes('record') || l.includes('are sexy prime') || l.includes('these numbers are') || l.includes('they are') || l.includes('result') || l.includes('form');
      const isPair = l.includes('pair') || l.includes('both') || l.includes('two numbers') || l.includes('sexy prime') || l.includes('these numbers');
      return (isPrint && isPair) || l.includes('sexy prime pair') || (l.includes('two numbers are prime') && l.includes('sexy prime'));
    }) || (norm.includes('display') && norm.includes('pair')) || (norm.includes('print') && norm.includes('pair')) || norm.includes('sexy prime pairs') || norm.includes('sexy prime pair');
  }

  const steps: StepProgress[] = [
    { stepNumber: 1, title: 'Get the upper limit number from the user', completed: hasStep1Input, current: !hasStep1Input },
    { stepNumber: 2, title: 'For each number from 2 up to 6 less than the limit', completed: hasStep2OuterLoop, current: hasStep1Input && !hasStep2OuterLoop },
    { stepNumber: 3, title: 'Check if the first number is a prime number', completed: hasStep3CheckPPrime, current: hasStep1Input && hasStep2OuterLoop && !hasStep3CheckPPrime },
    { stepNumber: 4, title: 'Check if adding 6 to the number also gives a prime number', completed: hasStep4CheckPPlus6Prime, current: hasStep1Input && hasStep2OuterLoop && hasStep3CheckPPrime && !hasStep4CheckPPlus6Prime },
    { stepNumber: 5, title: 'If both numbers are prime, display them as a pair', completed: hasStep5PrintPair, current: hasStep1Input && hasStep2OuterLoop && hasStep3CheckPPrime && hasStep4CheckPPlus6Prime && !hasStep5PrintPair }
  ];

  // Code keywords check
  const codeKeywords = ['for (', 'while (', 'let ', 'var ', 'const ', 'int ', 'console.log', 'print(', '===', '!==', '++;', 'count++', 'count1', 'count2'];
  const hasCodeKeywords = codeKeywords.some(kw => rawText.includes(kw));

  if (hasCodeKeywords) {
    return {
      isFullyVerified: false,
      hasStep1Input,
      hasStep2OuterLoop,
      hasStep3CheckPPrime,
      hasStep4CheckPPlus6Prime,
      hasStep5PrintPair,
      hasCodeKeywords: true,
      feedback: "🌟 Coach Maya gentle reminder: In the Recipe stage, we write algorithm steps in plain human English without code keywords (avoid `var`, `for (`, `count++`, `print()`, or `;`). Use natural words like 'Get the upper limit number', 'For each number starting from 2 up to 6 less than the limit', 'Check if the first number is a prime number', 'Check if adding 6 to the number also gives a prime number', and 'If both numbers are prime, display them as a pair'.",
      correction: "Remove code syntax and describe the steps in natural English words.",
      suggestedInput: !hasStep1Input ? "Step 1: Get the upper limit number from the user" : !hasStep2OuterLoop ? "Step 2: For each number starting from 2 up to 6 less than the limit" : !hasStep3CheckPPrime ? "Step 3: Check if the first number is a prime number" : !hasStep4CheckPPlus6Prime ? "Step 4: Check if adding 6 to the number also gives a prime number" : "Step 5: If both numbers are prime, display them as a pair",
      steps,
      stepProgress: steps,
      recipeStepProgress: steps
    };
  }

  // ALL 5 STEPS REQUIRED FOR VERIFICATION
  const isFullyVerified = hasStep1Input && hasStep2OuterLoop && hasStep3CheckPPrime && hasStep4CheckPPlus6Prime && hasStep5PrintPair;

  if (isFullyVerified) {
    const allDoneSteps: StepProgress[] = steps.map(s => ({ ...s, completed: true, current: false }));
    return {
      isFullyVerified: true,
      hasStep1Input,
      hasStep2OuterLoop,
      hasStep3CheckPPrime,
      hasStep4CheckPPlus6Prime,
      hasStep5PrintPair,
      hasCodeKeywords: false,
      matchedFirebaseInput: "step 5 : if both numbers are prime display them as a pair",
      feedback: "🌟 Coach Maya here! Kudos! 🎉 You have sequenced all 5 steps of the Sexy Prime algorithm in crystal-clear plain English without code jargon or raw variables. Proceed to Stage 3: Ingredients!",
      correction: "Proceed to Ingredients stage!",
      suggestedInput: undefined,
      steps: allDoneSteps,
      stepProgress: allDoneSteps,
      recipeStepProgress: allDoneSteps
    };
  }

  // Step-by-step guidance based on what's missing
  let nextStepSuggestion = "Step 1: Get the upper limit number from the user";
  let nextStepCorrection = "Add Step 1: Get the upper limit number from the user.";
  let nextStepFeedback = "🌟 Coach Maya here! Let's write down the steps sequentially. What is the very first step to get the limit boundary for our search?";

  const hasNotPrimeInStep4 = rawText.includes('is not prime') || rawText.includes('not prime number') || rawText.includes('if this number is not prime');

  if (!hasStep1Input && !hasStep4CheckPPlus6Prime && hasNotPrimeInStep4) {
    nextStepSuggestion = "Step 1: Get the upper limit number from the user";
    nextStepCorrection = "Add Step 1 (getting the upper limit) and fix Step 4 (checking if adding 6 gives a prime number).";
    nextStepFeedback = "🌟 Coach Maya here! You've made good progress with your steps, but there are two key adjustments needed:\n1) **Step 1 is missing**: We first need to get the upper limit number from the user ('Step 1: Get the upper limit number from the user').\n2) **Step 4 correction**: Sexy primes require BOTH numbers to be prime (with 2 divisors). Please remove 'if this number is not prime' and adjust Step 4 to check if adding 6 also gives a prime number: 'Step 4: Check if adding 6 to the number also gives a prime number'.";
  } else if (!hasStep1Input) {
    nextStepSuggestion = "Step 1: Get the upper limit number from the user";
    nextStepCorrection = "Add Step 1: Get the upper limit number from the user.";
    if (isConfused || attemptCount >= 2) {
      nextStepFeedback = "🌟 Coach Maya here! No worries at all, let's take it one step at a time! Before we can search for sexy prime pairs, we need to know where to stop searching. So our very first step is to receive the upper limit number from the user. Write this in your worksheet: 'Step 1: Get the upper limit number from the user'.";
    } else {
      nextStepFeedback = "🌟 Coach Maya here! Great effort! Don't forget Step 1: What is the very first step to define the upper search boundary for sexy primes from the user?";
    }
  } else if (!hasStep2OuterLoop) {
    nextStepSuggestion = "Step 2: For each number starting from 2 up to 6 less than the limit";
    nextStepCorrection = "Add Step 2: For each number starting from 2 up to 6 less than the limit.";
    if (isConfused || attemptCount >= 2) {
      nextStepFeedback = "🌟 Coach Maya here! Let me explain why we say 'up to 6 less than the limit' with a simple example:\nSuppose our limit is 30. If we take 24, adding 6 gives 24 + 6 = 30 (which is inside the limit!). But if we took 25, adding 6 gives 31 (which exceeds 30!). That's why our candidates only need to go up to 6 less than the limit.\nTry writing Step 2: 'Step 2: For each number starting from 2 up to 6 less than the limit'.";
    } else {
      nextStepFeedback = "🌟 Coach Maya here! Wonderful start with Step 1! Getting the limit defines our search boundary. Since sexy primes are pairs differing by six, what sequence of numbers will you check starting from 2 up to 6 less than the limit?";
    }
  } else if (!hasStep3CheckPPrime) {
    nextStepSuggestion = "Step 3: Check if the first number is a prime number";
    nextStepCorrection = "Add Step 3: Check if the first number is a prime number (has exactly 2 divisors).";
    if (isConfused || attemptCount >= 2) {
      nextStepFeedback = "🌟 Coach Maya here! Let's break down Step 3: For each candidate number in our sequence, we need to know if it's a prime number (meaning it has exactly 2 divisors: 1 and itself). So Step 3 is: 'Step 3: Check if the first number is a prime number'.";
    } else {
      nextStepFeedback = "🌟 Coach Maya here! Great progress! You've set the search boundary and the sequence of numbers. For Step 3: What must you first test for the current number to verify if it has exactly two divisors?";
    }
  } else if (!hasStep4CheckPPlus6Prime) {
    nextStepSuggestion = "Step 4: Check if adding 6 to the number also gives a prime number";
    nextStepCorrection = "Add Step 4: Check if the number six greater is also a prime number.";
    if (hasNotPrimeInStep4) {
      nextStepFeedback = "🌟 Coach Maya here! In Step 4, remember that sexy primes require BOTH numbers in the pair to be prime numbers (having exactly 2 divisors). You mentioned 'if this number is not prime' — if either number is not prime, no pair can be formed! Please adjust Step 4 to check if adding 6 gives a prime number: 'Step 4: Check if adding 6 to the number also gives a prime number'.";
    } else if (isConfused || attemptCount >= 2) {
      nextStepFeedback = "🌟 Coach Maya here! Since sexy primes are pairs that differ by 6, we must check if adding 6 to our first number also gives a prime number! So Step 4 is: 'Step 4: Check if adding 6 to the number also gives a prime number'.";
    } else {
      nextStepFeedback = "🌟 Coach Maya here! Spot on! The first number is tested. Now for Step 4: What companion number (adding six to the current number) must also be checked to see if it is a prime number?";
    }
  } else {
    nextStepSuggestion = "Step 5: If both numbers are prime, display them as a pair";
    nextStepCorrection = "Add Step 5: If both numbers are prime, display them as a pair.";
    if (isConfused || attemptCount >= 2) {
      nextStepFeedback = "🌟 Coach Maya here! We are at the finish line! If both the first number and the number plus 6 are verified as prime numbers, we show them as a sexy prime pair. Try writing: 'Step 5: If both numbers are prime, display them as a pair'.";
    } else {
      nextStepFeedback = "🌟 Coach Maya here! Almost there! You're checking both numbers. Finally, for Step 5: If both numbers have exactly 2 divisors (are prime), what action do you take to output the sexy prime pair?";
    }
  }

  return {
    isFullyVerified: false,
    hasStep1Input,
    hasStep2OuterLoop,
    hasStep3CheckPPrime,
    hasStep4CheckPPlus6Prime,
    hasStep5PrintPair,
    hasCodeKeywords: false,
    matchedFirebaseInput: undefined,
    feedback: nextStepFeedback,
    correction: nextStepCorrection,
    suggestedInput: nextStepSuggestion,
    steps,
    stepProgress: steps,
    recipeStepProgress: steps
  };
}

/**
 * Validates Stage 3: Ingredients for Sexy Prime Numbers
 */
export function validateSexyPrimeIngredients(input: string): SexyPrimeIngredientsValidation {
  const norm = (input || '').toLowerCase().replace(/[^a-z0-9\s%+=\-*\/]/g, ' ').replace(/\s+/g, ' ').trim();
  const rawText = (input || '').toLowerCase();
  const rawLines = (input || '').split('\n').map(l => l.trim()).filter(Boolean);

  // Parse explicitly numbered steps if present
  const stepMap: { [key: number]: string } = {};
  rawLines.forEach(line => {
    const match = line.match(/^s?tep\s*(\d+)[\s.:-]*(.*)$/i);
    if (match) {
      const stepNum = parseInt(match[1], 10);
      stepMap[stepNum] = (match[2] || '').trim().toLowerCase();
    }
  });

  // Step 1: Variables (limit, candidate, companion candidate)
  const hasLimitVar =
    norm.includes('limit') ||
    norm.includes('variable n') ||
    norm.includes('n for upper') ||
    norm.includes('input n') ||
    norm.includes('upper limit n') ||
    norm.includes('n for limit') ||
    norm.includes('limit=') ||
    norm.includes('limit =');

  const hasCandidateVars =
    (norm.includes('p') && (norm.includes('p 6') || norm.includes('p+6') || norm.includes('p + 6') || norm.includes('q'))) ||
    (norm.includes('a') && (norm.includes('b=a+6') || norm.includes('b = a + 6') || norm.includes('b = a+6') || norm.includes('a+6') || norm.includes('a + 6'))) ||
    (norm.includes('candidate') && norm.includes('pair'));

  const hasStep1Vars = hasLimitVar && hasCandidateVars;

  // Step 2: Outer Loop Validation & Flaw Detection
  const hasLoopKeywords =
    norm.includes('outer loop') ||
    norm.includes('for loop') ||
    norm.includes('nested loop') ||
    norm.includes('loop') ||
    norm.includes('start:') ||
    norm.includes('start :') ||
    norm.includes('stop:') ||
    norm.includes('stop :');

  const hasNegativeStep =
    rawText.includes('-1') ||
    rawText.includes('decrement') ||
    rawText.includes('next step :-1') ||
    rawText.includes('next step: -1') ||
    rawText.includes('next step:-1') ||
    rawText.includes('step: -1') ||
    rawText.includes('step:-1') ||
    rawText.includes('step :-1');

  const hasInvertedStartStop =
    (rawText.includes('start:b') || rawText.includes('start: b') || rawText.includes('start:q') || rawText.includes('start: q')) ||
    (rawText.includes('stop:a') || rawText.includes('stop: a') || rawText.includes('stop:p') || rawText.includes('stop: p'));

  const hasLoopFlaw = hasNegativeStep || hasInvertedStartStop;

  const hasValidLoopBounds =
    (norm.includes('start 2') || norm.includes('start: 2') || norm.includes('start:2') || norm.includes('from 2') || norm.includes('p = 2') || norm.includes('a = 2') || norm.includes('p from 2') || norm.includes('range(2') || norm.includes('range (2')) &&
    (norm.includes('stop n') || norm.includes('stop limit') || norm.includes('stop: limit') || norm.includes('stop:limit') || norm.includes('stop: n') || norm.includes('stop:n') || norm.includes('limit - 6') || norm.includes('limit-6') || norm.includes('n - 6') || norm.includes('n-6') || norm.includes('stop: 50') || norm.includes('stop: 44') || norm.includes('to limit') || norm.includes('to n') || norm.includes('p <= n') || norm.includes('p <= limit'));

  const hasStandardLoopCode =
    /for\s*\(\s*(?:var|let|int)?\s*[a-z]\s*=\s*2\s*;\s*[a-z]\s*<=\s*(?:n|limit)(?:\s*-\s*6)?\s*;\s*[a-z]\+\+\s*\)/i.test(rawText) ||
    /for\s+[a-z]\s+in\s+range\s*\(\s*2\s*,\s*(?:n|limit)/i.test(rawText);

  const hasLoops = (hasValidLoopBounds || hasStandardLoopCode || (hasLoopKeywords && !hasLoopFlaw && (norm.includes('from 2') || norm.includes('start: 2') || norm.includes('start 2')))) && !hasLoopFlaw;

  // Step 3: Distinct Divisor Counters
  const hasSeparateCounters =
    (norm.includes('count1') && norm.includes('count2')) ||
    (norm.includes('cnt1') && norm.includes('cnt2')) ||
    (norm.includes('c1') && norm.includes('c2')) ||
    (norm.includes('count_a') && norm.includes('count_b')) ||
    norm.includes('two counters') ||
    norm.includes('separate counter') ||
    norm.includes('distinct counter') ||
    (norm.includes('count') && norm.includes('reset') && (norm.includes('p') || norm.includes('q')));

  const hasCount1Increment =
    norm.includes('count1++') ||
    norm.includes('count1 = count1 + 1') ||
    norm.includes('count1 += 1') ||
    norm.includes('count1+1') ||
    norm.includes('count_a++') ||
    norm.includes('count_a = count_a + 1') ||
    norm.includes('count_a += 1') ||
    norm.includes('c1++');

  const hasCount2Increment =
    norm.includes('count2++') ||
    norm.includes('count2 = count2 + 1') ||
    norm.includes('count2 += 1') ||
    norm.includes('count2+1') ||
    norm.includes('count_b++') ||
    norm.includes('count_b = count_b + 1') ||
    norm.includes('count_b += 1') ||
    norm.includes('c2++');

  // Fine-grained detection of divisor loops and modulo checks
  const hasInnerLoopKeywords =
    norm.includes('inner loop') ||
    norm.includes('divisor loop') ||
    norm.includes('inner for loop') ||
    (norm.includes('for') && (norm.includes('1 to') || norm.includes('start: 1') || norm.includes('start:1') || norm.includes('start 1')));

  // Detect loop variable names
  const outerLoopVarMatch = /for\s*loop\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?/i.exec(rawText);
  const outerVarName = outerLoopVarMatch ? outerLoopVarMatch[1].toLowerCase() : (norm.includes('a =') ? 'a' : (norm.includes('p =') ? 'p' : 'i'));

  // Inner loop detection
  const hasCandidate1InnerLoop =
    /for\s*(?:loop\s*\(?\s*)?(?:i|k|j|m)\s*(?:\)?|\b)(?:from|=|\s*:\s*|\s+in\s+)?\s*(?:1|from\s*:\s*1).*to\s*(?:p|a|i)\b/i.test(rawText) ||
    /start\s*:\s*1.*(?:stop|to)\s*:\s*(?:p|a|i)\b/i.test(rawText) ||
    /for\s*loop\s*\(?\s*(?:k|j|d)\s*\)?.*start\s*:\s*1.*stop\s*:\s*(?:i|p|a)/is.test(rawText) ||
    (hasInnerLoopKeywords && (norm.includes('start: 1') || norm.includes('start 1') || norm.includes('stop: i') || norm.includes('stop: p') || norm.includes('stop: a')));

  // Inverted modulo check (e.g. k % i instead of i % k)
  const hasInvertedCandidate1Modulo =
    /left\s*side\s*:\s*k\s*[%/]\s*i/i.test(rawText) ||
    /left\s*side\s*:\s*j\s*[%/]\s*i/i.test(rawText) ||
    /left\s*side\s*:\s*i\s*[%/]\s*p/i.test(rawText) ||
    /left\s*side\s*:\s*j\s*[%/]\s*p/i.test(rawText) ||
    /left\s*side\s*:\s*i\s*[%/]\s*a/i.test(rawText) ||
    /k\s*%\s*i\s*(?:==|=)?/i.test(rawText) ||
    /j\s*%\s*i\s*(?:==|=)?/i.test(rawText);

  const hasCandidate1Modulo =
    !hasInvertedCandidate1Modulo && (
      /p\s*%\s*i\s*(?:==|=)\s*0/i.test(rawText) ||
      /a\s*%\s*i\s*(?:==|=)\s*0/i.test(rawText) ||
      /i\s*%\s*k\s*(?:==|=)\s*0/i.test(rawText) ||
      /i\s*%\s*j\s*(?:==|=)\s*0/i.test(rawText) ||
      /left\s*side\s*:\s*i\s*[%/]\s*k/i.test(rawText) ||
      /left\s*side\s*:\s*i\s*[%/]\s*j/i.test(rawText) ||
      /left\s*side\s*:\s*p\s*[%/]\s*i/i.test(rawText) ||
      /left\s*side\s*:\s*a\s*[%/]\s*i/i.test(rawText) ||
      /p\s*%\s*i/i.test(rawText) ||
      /a\s*%\s*i/i.test(rawText) ||
      /i\s*%\s*k/i.test(rawText) ||
      /i\s*%\s*j/i.test(rawText) ||
      ((norm.includes('p %') || norm.includes('a %') || norm.includes('i % k') || norm.includes('i % j')) && (hasCount1Increment || norm.includes('count1') || norm.includes('count_a') || norm.includes('c1'))) ||
      hasCount1Increment
    );

  const hasInvertedCandidate2Modulo =
    /left\s*side\s*:\s*k\s*[%/]\s*(?:p\s*\+\s*6|q|a\s*\+\s*6|b|i\s*\+\s*6)/i.test(rawText) ||
    /left\s*side\s*:\s*j\s*[%/]\s*(?:p\s*\+\s*6|q|a\s*\+\s*6|b|i\s*\+\s*6)/i.test(rawText);

  const hasCandidate2InnerLoop =
    /for\s*(?:loop\s*\(?\s*)?(?:j|k|d|m)\s*(?:\)?|\b)(?:from|=|\s*:\s*|\s+in\s+)?\s*(?:1|from\s*:\s*1).*to\s*(?:p\s*\+\s*6|q|a\s*\+\s*6|b|i\s*\+\s*6)\b/i.test(rawText) ||
    /start\s*:\s*1.*(?:stop|to)\s*:\s*(?:p\s*\+\s*6|q|a\s*\+\s*6|b|i\s*\+\s*6)\b/i.test(rawText) ||
    (hasInnerLoopKeywords && (norm.includes('p+6') || norm.includes('p + 6') || norm.includes('q') || norm.includes('b') || norm.includes('i+6') || norm.includes('i + 6') || norm.includes('second number')));

  const hasCandidate2Modulo =
    !hasInvertedCandidate2Modulo && (
      /(?:q|p\s*\+\s*6|\(p\s*\+\s*6\)|b|a\s*\+\s*6|\(a\s*\+\s*6\)|i\s*\+\s*6|\(i\s*\+\s*6\))\s*%\s*(?:j|i|k|d)\s*(?:==|=)\s*0/i.test(rawText) ||
      /left\s*side\s*:\s*(?:q|p\s*\+\s*6|\(p\s*\+\s*6\)|b|a\s*\+\s*6|\(a\s*\+\s*6\)|i\s*\+\s*6)\s*[%/]\s*(?:j|k|d)/i.test(rawText) ||
      /(?:q|p\s*\+\s*6|\(p\s*\+\s*6\)|b|a\s*\+\s*6|\(a\s*\+\s*6\)|i\s*\+\s*6|\(i\s*\+\s*6\))\s*%\s*(?:j|i|k|d)/i.test(rawText) ||
      ((norm.includes('p+6 %') || norm.includes('(p+6) %') || norm.includes('q %') || norm.includes('b %') || norm.includes('i+6 %') || norm.includes('(i+6) %')) && (hasCount2Increment || norm.includes('count2') || norm.includes('count_b') || norm.includes('c2'))) ||
      hasCount2Increment
    );

  // Step 4 is complete when divisibility checks (or factor increments) are provided for both candidates
  const hasCombinedCondition =
    (hasCandidate1Modulo && hasCandidate2Modulo) ||
    (hasCount1Increment && hasCount2Increment) ||
    ((norm.includes('p % i == 0') || norm.includes('a % i == 0')) && (norm.includes('q % j == 0') || norm.includes('(p+6) %') || norm.includes('b % j == 0')));

  // Step 5: Combined Decision & Print (Displaying the Sexy Prime Pair)
  const hasDecisionCheck =
    /count1\s*==\s*2\s*(&&|and)\s*count2\s*==\s*2/i.test(rawText) ||
    /count_a\s*==\s*2\s*(&&|and)\s*count_b\s*==\s*2/i.test(rawText) ||
    /c1\s*==\s*2\s*(&&|and)\s*c2\s*==\s*2/i.test(rawText) ||
    (norm.includes('count1 == 2') && norm.includes('count2 == 2')) ||
    (norm.includes('count_a == 2') && norm.includes('count_b == 2')) ||
    (norm.includes('count1==2') && norm.includes('count2==2')) ||
    (norm.includes('both') && (norm.includes('count == 2') || norm.includes('prime')));

  // Must explicitly state the pair variables to print (e.g. print(i, i+6), print(p, p+6), print(a, b), print(p, q))
  const hasExplicitPairVariables =
    /(?:print|display|show|output|console\.log)\s*\(?\s*(?:pair\s*\(?)?\s*(?:p\s*,\s*(?:p\s*\+\s*6|q)|a\s*,\s*(?:a\s*\+\s*6|b)|i\s*,\s*(?:i\s*\+\s*6|j)|candidate\s*,\s*companion)\s*\)?/i.test(rawText) ||
    /(?:print|display|show|output)\s+(?:pair\s+)?(?:p\s*,\s*(?:p\s*\+\s*6|q)|a\s*,\s*(?:a\s*\+\s*6|b)|i\s*,\s*(?:i\s*\+\s*6|j))/i.test(rawText) ||
    /(?:print|display|show|output)\s+(?:pair\s+)?(?:p\s+and\s+(?:p\s*\+\s*6|q)|a\s+and\s+(?:a\s*\+\s*6|b)|i\s+and\s+(?:i\s*\+\s*6|j))/i.test(rawText) ||
    /\(\s*(?:p\s*,\s*(?:p\s*\+\s*6|q)|a\s*,\s*(?:a\s*\+\s*6|b)|i\s*,\s*(?:i\s*\+\s*6|j))\s*\)/i.test(rawText) ||
    /pair\s*\(\s*(?:p\s*,\s*(?:p\s*\+\s*6|q)|a\s*,\s*(?:a\s*\+\s*6|b)|i\s*,\s*(?:i\s*\+\s*6|j))\s*\)/i.test(rawText) ||
    /print\s*\(\s*(?:[a-z]\s*,\s*[a-z]\s*\+\s*6|[a-z]\s*,\s*[a-z])\s*\)/i.test(rawText) ||
    norm.includes('print p and p 6') ||
    norm.includes('print a and b') ||
    norm.includes('print i and i 6') ||
    norm.includes('print p q') ||
    norm.includes('print a b') ||
    norm.includes('print i i 6');

  const hasGenericPrintWithoutVars =
    !hasExplicitPairVariables && (
      norm.includes('print the sexy prime pair') ||
      norm.includes('print sexy prime pair') ||
      norm.includes('print prime pair') ||
      norm.includes('print the pair') ||
      norm.includes('print pair') ||
      norm.includes('print prime') ||
      norm.includes('print sexy prime') ||
      norm.includes('display pair') ||
      norm.includes('show pair') ||
      norm.includes('output pair') ||
      norm.includes('print') ||
      norm.includes('display')
    );

  const hasPrintPair = hasExplicitPairVariables;

  const hasDecisionAndPrint = hasCombinedCondition && hasDecisionCheck && hasPrintPair;

  const steps: StepProgress[] = [
    {
      stepNumber: 1,
      title: 'Variables: limit n, candidate p, and q = p + 6',
      completed: hasStep1Vars || (hasLimitVar && hasCandidateVars),
      current: !hasLimitVar || !hasCandidateVars
    },
    {
      stepNumber: 2,
      title: 'Outer loop for p from 2 to n - 6 (Start: 2, Stop: limit - 6, Step: +1)',
      completed: hasLoops,
      current: (hasLimitVar || hasCandidateVars) && !hasLoops
    },
    {
      stepNumber: 3,
      title: 'Distinct divisor counters (count1 = 0 for p, count2 = 0 for q)',
      completed: hasSeparateCounters,
      current: hasLoops && !hasSeparateCounters
    },
    {
      stepNumber: 4,
      title: 'Divisor modulo conditions (p % i == 0 & q % j == 0)',
      completed: hasCombinedCondition,
      current: hasLoops && hasSeparateCounters && !hasCombinedCondition
    },
    {
      stepNumber: 5,
      title: 'Combined decision: if (count1 == 2 && count2 == 2) print pair',
      completed: hasDecisionAndPrint,
      current: hasLoops && hasSeparateCounters && hasCombinedCondition && !hasDecisionAndPrint
    }
  ];

  const isFullyVerified =
    hasStep1Vars &&
    hasLoops &&
    hasSeparateCounters &&
    hasCombinedCondition &&
    hasDecisionAndPrint;

  if (isFullyVerified) {
    const allDoneSteps: StepProgress[] = steps.map(s => ({ ...s, completed: true, current: false }));
    return {
      isFullyVerified: true,
      hasLimitVar,
      hasCandidateVars,
      hasSeparateCounters,
      hasLoops,
      hasCombinedCondition,
      matchedFirebaseInput: "step 5 : if (count1 == 2 && count2 == 2) print pair (p, p + 6)",
      feedback: "🌟 Coach Maya here! Awesome work! 🎉 All essential ingredients for Sexy Prime pairs are identified: variables (n, p, q = p + 6), outer loop up to n - 6, distinct divisor counters (count1, count2), modulo condition checks, and combined verification. Proceed to Taste the Sample!",
      correction: "Proceed to Taste the Sample stage to assemble your code!",
      suggestedInput: undefined,
      stepProgress: allDoneSteps,
      ingredientsStepProgress: allDoneSteps
    };
  }

  let nextSuggestion = "Step 1: limit = 50, p = 2, q = p + 6";
  let nextCorrection = "Identify the variables: limit n, candidate p, and q = p + 6.";
  let nextFeedback = "🌟 Coach Maya here! What variables will store the upper limit and the pair of numbers being tested?";

  if (!hasLimitVar || !hasCandidateVars) {
    nextSuggestion = "Step 1: limit = 50, p = 2, q = p + 6";
    nextCorrection = "Add variables: limit n, candidate p, and q = p + 6 (or a and b = a + 6).";
    nextFeedback = "🌟 Coach Maya here! For Step 1: What variables do we need to store the upper limit n and the candidates p and p + 6 (e.g. limit = 50, a = 2, b = a + 6)?";
  } else if (!hasLoops) {
    nextSuggestion = "step 2: for loop with start: 2, stop: limit - 6, next step: +1";
    nextCorrection = "Fix Step 2: Set outer loop start: 2, stop: limit - 6 (or limit), and next step: +1.";
    if (hasLoopFlaw) {
      if (hasNegativeStep && hasInvertedStartStop) {
        nextFeedback = "🌟 Coach Maya here! In Step 2, your loop is set backwards (starting from b, stopping at a, and stepping with -1)! To find all sexy prime pairs, our outer loop needs to iterate upwards starting from 2 up to the limit minus 6 (or limit) with step +1. Please correct Step 2 to: 'step 2: for loop with start: 2, stop: limit - 6, next step: +1'.";
      } else if (hasNegativeStep) {
        nextFeedback = "🌟 Coach Maya here! In Step 2, your loop step is -1 (decrementing)! We need to check numbers in increasing order starting from 2 up to the limit minus 6 with step +1. Please update Step 2: 'step 2: for loop with start: 2, stop: limit - 6, next step: +1'.";
      } else {
        nextFeedback = "🌟 Coach Maya here! In Step 2, check your loop bounds: start should be 2 (the first prime) and stop should be limit - 6 (or limit), not start: b and stop: a. Please update Step 2: 'step 2: for loop with start: 2, stop: limit - 6, next step: +1'.";
      }
    } else {
      nextFeedback = "🌟 Coach Maya here! Great start with the variables! For Step 2: What loop construct will iterate candidate p upwards starting from 2 up to the limit minus 6 with step +1?";
    }
  } else if (!hasSeparateCounters) {
    nextSuggestion = "step 3: count1 = 0 for p, count2 = 0 for p + 6";
    nextCorrection = "Add distinct counters: count1 = 0 for p, count2 = 0 for p + 6.";
    nextFeedback = "🌟 Coach Maya here! Great loop! Now for Step 3: If you use a single `count` variable, the divisor tallies will collide! What distinct counters will you initialize for p and p + 6 (e.g. count1 = 0 for p, count2 = 0 for p + 6)?";
  } else if (!hasCombinedCondition) {
    const mentionsIf = norm.includes('if') || norm.includes('condition') || norm.includes('if condition');

    if (hasInvertedCandidate1Modulo) {
      nextSuggestion = "step 5: if condition: left side (i % k), operator (==), right side (0), action: count1 = count1 + 1";
      nextCorrection = "Fix modulo operands: candidate i must be on the left and divisor k on the right (i % k == 0), with action count1 = count1 + 1.";
      nextFeedback = "🌟 Coach Maya here! In Step 5, look closely at your modulo check: `Left side: k % i`. Since `i` is your candidate number and `k` is the divisor running from 1 to `i`, we must divide candidate `i` by divisor `k` (`i % k == 0`), not divisor by candidate (`k % i`)! Also, remember to specify the operator (`==`), right side (`0`), and action (`count1 = count1 + 1`). Can you update your Step 5?";
    } else if (hasInvertedCandidate2Modulo) {
      nextSuggestion = "step 5.2: if ((p + 6) % j == 0) count2 = count2 + 1";
      nextCorrection = "Fix companion modulo: candidate (p + 6) must be on the left and divisor on the right ((p + 6) % j == 0).";
      nextFeedback = "🌟 Coach Maya here! In your companion check, remember to put candidate `p + 6` (or `b`) on the left and divisor on the right: `(p + 6) % j == 0`, action: `count2 = count2 + 1`!";
    } else if (mentionsIf && !hasCandidate1InnerLoop && !hasCandidate1Modulo) {
      nextSuggestion = "step 4.1: for loop for candidate p (Start: 1, Stop: p, Next step: +1)";
      nextCorrection = "Define an inner for loop to iterate divisors from 1 to p before checking with if.";
      nextFeedback = "🌟 Coach Maya here! You mentioned using an `if` condition—great intuition! An `if` statement with modulo (`%`) is indeed needed to check if a divisor leaves remainder 0. But before testing `p % i == 0`, where does divisor `i` come from? We first need an **inner for loop** to generate divisors from 1 up to `p`! What loop will you define for candidate `p`?";
    } else if (!hasCandidate1InnerLoop && !hasCandidate1Modulo) {
      nextSuggestion = "step 4.1: for loop for candidate p (Start: 1, Stop: p, Next step: +1)";
      nextCorrection = "Define an inner for loop to iterate divisors from 1 to p.";
      nextFeedback = "🌟 Coach Maya here! Distinct counters `count1 = 0` and `count2 = 0` are ready! Next, to test if candidate `p` is prime, we need to generate and test all divisors from 1 to `p`. What inner for loop (Start, Stop, Next step) will iterate divisors for candidate `p`?";
    } else if (hasCandidate1InnerLoop && !hasCandidate1Modulo) {
      nextSuggestion = "step 5: if condition: left side (i % k), operator (==), right side (0), action: count1 = count1 + 1";
      nextCorrection = "Inside the divisor loop, check if divisor divides candidate evenly and increment count1.";
      nextFeedback = "🌟 Coach Maya here! Great inner loop for candidate `i`! Now inside this loop, what `if` condition checks if candidate `i` is divisible by `k` with remainder 0 (`i % k == 0`), and what action increases `count1`?";
    } else if (hasCandidate1Modulo && !hasCandidate2Modulo) {
      nextSuggestion = "step 4.2: for j from 1 to p + 6: if ((p + 6) % j == 0) count2 = count2 + 1";
      nextCorrection = "Now check divisors for companion number p + 6 using its divisor loop and count2.";
      nextFeedback = "🌟 Coach Maya here! Superb! Divisor check for candidate `p` is done! Now, how will you check the companion number `p + 6` (or `b`) using its divisor loop and `count2`?";
    } else {
      nextSuggestion = "step 4: if (p % i == 0) count1 = count1 + 1 and if ((p + 6) % j == 0) count2 = count2 + 1";
      nextCorrection = "Check divisibility for both numbers and increment their counters.";
      nextFeedback = "🌟 Coach Maya here! Divisors are set up! What modulo conditions will test if `p` and `p + 6` divide evenly to increment `count1` and `count2`?";
    }
  } else {
    const hasMalformedCombinedDecision =
      /count1\s*(&&|and)\s*count2\s*==\s*2/i.test(rawText) ||
      /left\s*side\s*:\s*count1\s*(&&|and)\s*count2/i.test(rawText) ||
      /left\s*side\s*:\s*c1\s*(&&|and)\s*c2/i.test(rawText) ||
      /left\s*side\s*:\s*count_a\s*(&&|and)\s*count_b/i.test(rawText);

    const companionVar = outerVarName === 'a' ? 'b' : (outerVarName === 'p' ? 'p + 6' : outerVarName + ' + 6');

    if (hasMalformedCombinedDecision) {
      nextSuggestion = `step 8: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${companionVar})`;
      nextCorrection = `Check each count individually: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${companionVar}).`;
      nextFeedback = `🌟 Coach Maya here! You are so close! In programming, writing \`Left side: count1 && count2, right side: 2\` does not check both variables against 2. You must compare each counter individually: \`if (count1 == 2 && count2 == 2)\` and specify the variables to print: \`print(${outerVarName}, ${companionVar})\`! Can you update your Step 8?`;
    } else if (hasDecisionCheck && hasGenericPrintWithoutVars) {
      nextSuggestion = `step 8: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${companionVar})`;
      nextCorrection = `Specify the exact pair variables to print: print(${outerVarName}, ${companionVar}).`;
      nextFeedback = `🌟 Coach Maya here! You correctly set up \`if (count1 == 2 && count2 == 2)\`! Now, which specific variables should be printed? Instead of writing generic "print the sexy prime pair", specify the actual variables to print: \`print(${outerVarName}, ${companionVar})\`!`;
    } else {
      nextSuggestion = `step 8: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${companionVar})`;
      nextCorrection = `Add decision check with exact variables: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${companionVar}).`;
      nextFeedback = `🌟 Coach Maya here! Both candidate numbers are tested! What final \`if\` condition checks that BOTH \`count1 == 2\` and \`count2 == 2\`, and prints the sexy prime pair \`(${outerVarName}, ${companionVar})\`?`;
    }
  }

  return {
    isFullyVerified: false,
    hasLimitVar,
    hasCandidateVars,
    hasSeparateCounters,
    hasLoops,
    hasCombinedCondition,
    feedback: nextFeedback,
    correction: nextCorrection,
    suggestedInput: nextSuggestion,
    stepProgress: steps,
    ingredientsStepProgress: steps
  };
}

/**
 * Validates Stage 4: Taste the Sample (Sample Code) for Sexy Prime Numbers
 */
export function validateSexyPrimeSampleCode(input: string, attemptCount: number = 1): SexyPrimeSampleCodeValidation {
  const text = input || '';
  const norm = text.toLowerCase().replace(/\s+/g, ' ');

  // Detect language
  let detectedLang = 'javascript';
  if (/def\s+\w+\(|import\s+sys|print\s*\(|range\s*\(|:\s*$/m.test(text) && !text.includes('function') && !text.includes('{')) {
    detectedLang = 'python';
  } else if (/#include|<stdio\.h>|<iostream>|std::cout|printf\s*\(|int\s+main\s*\(/i.test(text)) {
    detectedLang = 'c';
  } else if (/public\s+class|System\.out\.print/i.test(text)) {
    detectedLang = 'java';
  }

  // Detect variable names used
  const limitMatch = text.match(/(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*\d+/);
  const limitVarName = (limitMatch && limitMatch[1] !== 'i' && limitMatch[1] !== 'p' && limitMatch[1] !== 'count1' && limitMatch[1] !== 'count2') ? limitMatch[1] : 'a';

  const hasLimitVar =
    /(?:var|let|const|int)\s+(?:limit|n|max|upper_limit|[a-zA-Z_]\w*)\s*=/i.test(text) ||
    /\b(?:limit|n|max|upper_limit|[a-zA-Z_]\w*)\s*=\s*\d+/i.test(text);

  // Outer loop detection (supports p, i, a, num)
  const outerMatch = text.match(/for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)\s*=\s*2/i);
  const outerVarName = outerMatch ? outerMatch[1] : 'i';

  const hasOuterLoopRange =
    /for\s*\(\s*(?:var|let|int)?\s*(?:p|i|a|num)\s*=\s*2\s*;\s*(?:p|i|a|num)\s*<=\s*(?:n|limit|max|upper_limit|[a-zA-Z_]\w*)\s*-\s*6\s*;\s*(?:p|i|a|num)\+\+\s*\)/i.test(text) ||
    /for\s*\(\s*(?:var|let|int)?\s*(?:p|i|a|num)\s*=\s*2\s*;\s*(?:p|i|a|num)\s*<=\s*(?:n|limit|max|upper_limit|[a-zA-Z_]\w*)\s*;\s*(?:p|i|a|num)\+\+\s*\)/i.test(text) ||
    /for\s+(?:p|i|a|num)\s+in\s+range\s*\(\s*2\s*,\s*(?:n|limit|max|upper_limit|[a-zA-Z_]\w*)/i.test(text) ||
    /for\s*\(\s*(?:int\s+)?(?:p|i|a|num)\s*=\s*2/i.test(text) ||
    /while\s*\(\s*(?:p|i|a|num)\s*<=\s*(?:n|limit|max|[a-zA-Z_]\w*)/i.test(text);

  // Candidate 1 inner loop detection & boundary check:
  // Must run from 1 up to candidate (j <= i or j <= p), NOT up to upper limit (j <= a or j <= 100)
  const hasCand1InnerLoopWrongBoundary =
    new RegExp(`for\\s*\\(\\s*(?:var|let|int)?\\s*([a-zA-Z_]\\w*)\\s*=\\s*1\\s*;\\s*\\1\\s*<=\\s*(?:${limitVarName}|limit|max|\\d+)\\s*;\\s*\\1\\+\\+\\s*\\)`, 'i').test(text) &&
    !new RegExp(`for\\s*\\(\\s*(?:var|let|int)?\\s*([a-zA-Z_]\\w*)\\s*=\\s*1\\s*;\\s*\\1\\s*<=\\s*${outerVarName}\\s*;\\s*\\1\\+\\+\\s*\\)`, 'i').test(text);

  const hasCand1InnerLoopCorrect =
    new RegExp(`for\\s*\\(\\s*(?:var|let|int)?\\s*([a-zA-Z_]\\w*)\\s*=\\s*1\\s*;\\s*\\1\\s*<=\\s*${outerVarName}\\s*;\\s*\\1\\+\\+\\s*\\)`, 'i').test(text) ||
    new RegExp(`for\\s+([a-zA-Z_]\\w*)\\s+in\\s+range\\s*\\(\\s*1\\s*,\\s*${outerVarName}\\s*\\+\\s*1\\s*\\)`, 'i').test(text) ||
    /for\s*\(\s*(?:var|let|int)?\s*(?:j|k|d|divisor)\s*=\s*1\s*;\s*(?:j|k|d|divisor)\s*<=\s*(?:i|p|num)\b/i.test(text);

  // First prime check (candidate 1: p, i, or a modulo condition and counter increment)
  const hasFirstPrimeCheck =
    (/(?:p|i|a|num)\s*%\s*(?:k|j|d|m|divisor)\s*==\s*0/i.test(text) ||
     norm.includes('p %') || norm.includes('i %') || norm.includes('a %')) &&
    (/count(?:1|_a)?\s*(?:\+\+|\+=\s*1|=\s*count(?:1|_a)?\s*\+\s*1)/i.test(text) ||
     /c1\s*(?:\+\+|\+=\s*1)/i.test(text) ||
     /cnt1\s*(?:\+\+|\+=\s*1)/i.test(text));

  // Second prime check (companion candidate 2: q, p+6, b, i+6, a+6)
  const hasSecondPrimeCheck =
    (/(?:q|b|p\s*\+\s*6|\(p\s*\+\s*6\)|i\s*\+\s*6|\(i\s*\+\s*6\)|a\s*\+\s*6|\(a\s*\+\s*6\))\s*%\s*(?:j|k|d|m|divisor2)\s*==\s*0/i.test(text) ||
     norm.includes('q %') || norm.includes('b %') || norm.includes('(p+6) %') || norm.includes('(i+6) %') || norm.includes('i+6 %') || norm.includes('p+6 %')) &&
    (/count(?:2|_b)?\s*(?:\+\+|\+=\s*1|=\s*count(?:2|_b)?\s*\+\s*1)/i.test(text) ||
     /c2\s*(?:\+\+|\+=\s*1)/i.test(text) ||
     /cnt2\s*(?:\+\+|\+=\s*1)/i.test(text));

  const hasSeparateCounters =
    /(?:count1|count2|cnt1|cnt2|c1|c2|count_a|count_b)/i.test(text) ||
    (norm.includes('count1') && norm.includes('count2')) ||
    (/count\s*=\s*0/g.test(text) && text.split(/count\s*=\s*0/i).length > 2);

  // Detect malformed decision conditions like if(...)ANDif(...), if(...)andif(...), or if(...)AND(...)
  const hasMalformedDecisionBug =
    /\bif\s*\([^)]*\)\s*(?:and|&&)?\s*if\s*\([^)]*\)/i.test(text) ||
    /\bif\s*\([^)]*\)\s*and\s*\([^)]*\)/i.test(text) ||
    /\bif\s*\([^)]*\)\s*AND\s*\([^)]*\)/.test(text) ||
    /\bcount1\s*&&\s*count2\s*==\s*2/i.test(text) ||
    /\bcount1\s*and\s*count2\s*==\s*2/i.test(text);

  // Combined verification strictly requires valid syntax:
  // 1. Single if with &&: if (count1 == 2 && count2 == 2)
  // 2. Python if with and: if count1 == 2 and count2 == 2:
  // 3. Nested if: if (count1 == 2) { if (count2 == 2) { ... } }
  const hasCombinedVerification =
    !hasMalformedDecisionBug &&
    (/(?:if\s*\(\s*(?:count1|c1|cnt1)\s*==\s*2\s*&&\s*(?:count2|c2|cnt2)\s*==\s*2\s*\))/i.test(text) ||
     /(?:if\s+(?:count1|c1|cnt1)\s*==\s*2\s+and\s+(?:count2|c2|cnt2)\s*==\s*2\s*:)/i.test(text) ||
     /(?:if\s*\(\s*(?:count1|c1|cnt1)\s*==\s*2\s*\)[\s\S]*?if\s*\(\s*(?:count2|c2|cnt2)\s*==\s*2\s*\))/i.test(text));

  const hasOutputPair =
    /(?:print|console\.log|printf|cout)\s*\(?.*(?:p|i|a|num).*(?:p\s*\+\s*6|i\s*\+\s*6|a\s*\+\s*6|q|b)/i.test(text) ||
    /print\s*\(\s*(?:p|i|a|num)\s*,\s*(?:q|b|p\s*\+\s*6|i\s*\+\s*6|a\s*\+\s*6)\s*\)/i.test(text) ||
    /console\.log\s*\(\s*(?:p|i|a|num)\s*,\s*(?:q|b|p\s*\+\s*6|i\s*\+\s*6|a\s*\+\s*6)\s*\)/i.test(text) ||
    /printf\s*\(\s*"[^"]*"\s*,\s*(?:p|i|a|num)\s*,\s*(?:q|b|p\s*\+\s*6|i\s*\+\s*6|a\s*\+\s*6)\s*\)/i.test(text);

  // Bug checks:
  const hasSinglePrimeOnlyBug = hasFirstPrimeCheck && !hasSecondPrimeCheck && hasOutputPair;

  const hasCounterOverlapBug =
    text.includes('count++') &&
    !text.includes('count1') &&
    !text.includes('count2') &&
    !text.includes('c1') &&
    !text.includes('cnt1') &&
    text.split(/count\s*=\s*0/i).length < 3;

  const hasUpperLimitOverflowBug =
    /(?:p|i|a)\s*<=\s*(?:n|limit|max|[a-zA-Z_]\w*)\b/i.test(text) &&
    !/(?:p|i|a)\s*<=\s*(?:n|limit|max|[a-zA-Z_]\w*)\s*-\s*6/i.test(text) &&
    !norm.includes('p + 6 <=') &&
    !norm.includes('i + 6 <=');

  const steps: StepProgress[] = [
    { stepNumber: 1, title: `Declare upper limit (${limitVarName} = 100)`, completed: hasLimitVar, current: !hasLimitVar },
    { stepNumber: 2, title: `Outer loop from 2 to ${limitVarName} - 6`, completed: hasOuterLoopRange && !hasUpperLimitOverflowBug, current: hasLimitVar && (!hasOuterLoopRange || hasUpperLimitOverflowBug) },
    { stepNumber: 3, title: `Check candidate ${outerVarName} is prime (count1 == 2)`, completed: hasFirstPrimeCheck, current: hasLimitVar && hasOuterLoopRange && !hasFirstPrimeCheck },
    { stepNumber: 4, title: `Check companion ${outerVarName} + 6 is prime (count2 == 2)`, completed: hasSecondPrimeCheck, current: hasLimitVar && hasOuterLoopRange && hasFirstPrimeCheck && !hasSecondPrimeCheck },
    { stepNumber: 5, title: 'If both counts == 2, print pair', completed: hasCombinedVerification && hasOutputPair && !hasMalformedDecisionBug, current: hasLimitVar && hasOuterLoopRange && hasFirstPrimeCheck && hasSecondPrimeCheck && !(hasCombinedVerification && hasOutputPair && !hasMalformedDecisionBug) }
  ];

  // Specific Bug: Malformed Decision Condition (e.g. if(count1==2)ANDif(count2==2))
  if (hasMalformedDecisionBug) {
    return {
      allVerified: false,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck,
      hasSecondPrimeCheck,
      hasSeparateCounters,
      hasCombinedVerification: false,
      hasOutputPair,
      hasSinglePrimeOnlyBug: false,
      hasCounterOverlapBug: false,
      hasUpperLimitOverflowBug: false,
      feedback: `🔍 Decision Syntax Alert: You wrote \`if(count1==2)ANDif(count2==2)\`. In code, you cannot chain conditions with "ANDif". Instead, combine both checks inside a single \`if\` statement using the logical AND operator (\`&&\`): \`if (count1 == 2 && count2 == 2)\`!`,
      correction: `Combine both checks in one if: if (count1 == 2 && count2 == 2) print(${outerVarName}, ${outerVarName} + 6).`,
      suggestedInput: `if (count1 == 2 && count2 == 2) {\n  console.log(${outerVarName}, ${outerVarName} + 6);\n}`,
      sampleCodeStepProgress: steps
    };
  }

  // Specific Bug: Candidate 1 Inner loop boundary runs to upper limit instead of candidate number
  if (hasCand1InnerLoopWrongBoundary) {
    const innerDivMatch = text.match(/for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)\s*=\s*1\s*;/i);
    const divVar = innerDivMatch ? innerDivMatch[1] : 'j';
    return {
      allVerified: false,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck: false,
      hasSecondPrimeCheck: false,
      hasSeparateCounters,
      hasCombinedVerification,
      hasOutputPair,
      hasSinglePrimeOnlyBug: false,
      hasCounterOverlapBug,
      hasUpperLimitOverflowBug,
      feedback: `🔍 Inner Divisor Loop Boundary: In \`for(${divVar}=1; ${divVar}<=${limitVarName}; ${divVar}++)\`, you set the loop stopping condition to \`${divVar}<=${limitVarName}\` (running all the way to upper limit ${limitVarName})! To test if candidate \`${outerVarName}\` is prime, you only test divisors from 1 up to candidate \`${outerVarName}\` (\`${divVar} <= ${outerVarName}\`). Change your loop condition to \`${divVar} <= ${outerVarName}\`, and then add: \`if (${outerVarName} % ${divVar} == 0) count1++;\``,
      correction: `Change inner loop stopping condition to ${divVar} <= ${outerVarName}, then add if (${outerVarName} % ${divVar} == 0) count1++.`,
      suggestedInput: `for (${divVar} = 1; ${divVar} <= ${outerVarName}; ${divVar}++) {\n  if (${outerVarName} % ${divVar} == 0) count1++;\n}`,
      sampleCodeStepProgress: steps
    };
  }

  if (hasCounterOverlapBug) {
    return {
      allVerified: false,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck,
      hasSecondPrimeCheck,
      hasSeparateCounters: false,
      hasCombinedVerification,
      hasOutputPair,
      hasSinglePrimeOnlyBug,
      hasCounterOverlapBug: true,
      hasUpperLimitOverflowBug,
      feedback: "🔍 Variable Collision Alert: You are using the same `count` variable for both candidate numbers without separate tracking. The divisor counts will blend together! Use distinct counters: `count1` for the first number and `count2` for the second number.",
      correction: "Use separate counters: count1 = 0 for the first number and count2 = 0 for the companion number.",
      suggestedInput: "var count1 = 0;\nfor (var k = 1; k <= i; k++) { if (i % k == 0) count1++; }\nvar count2 = 0;\nfor (var j = 1; j <= (i + 6); j++) { if ((i + 6) % j == 0) count2++; }",
      sampleCodeStepProgress: steps
    };
  }

  if (hasSinglePrimeOnlyBug) {
    return {
      allVerified: false,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck,
      hasSecondPrimeCheck: false,
      hasSeparateCounters,
      hasCombinedVerification,
      hasOutputPair,
      hasSinglePrimeOnlyBug: true,
      hasCounterOverlapBug,
      hasUpperLimitOverflowBug,
      feedback: "🔍 Incomplete Pair Verification: You checked that the first number is prime, but Sexy Primes require BOTH numbers in the pair to be prime! You must also check that the companion number (e.g. `i + 6`) has exactly 2 divisors with its own divisor loop.",
      correction: "Add a divisor loop for companion (i + 6) with count2 to verify count2 == 2.",
      suggestedInput: "var count2 = 0;\nfor (var j = 1; j <= (i + 6); j++) {\n  if ((i + 6) % j == 0) count2++;\n}",
      sampleCodeStepProgress: steps
    };
  }

  if (hasUpperLimitOverflowBug) {
    return {
      allVerified: false,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck,
      hasSecondPrimeCheck,
      hasSeparateCounters,
      hasCombinedVerification,
      hasOutputPair,
      hasSinglePrimeOnlyBug,
      hasCounterOverlapBug,
      hasUpperLimitOverflowBug: true,
      feedback: "🔍 Boundary Overflow Warning: If your outer loop runs all the way to `limit`, then `i + 6` will exceed your upper limit `limit`! Adjust your outer loop stopping condition to `i <= limit - 6` (or `p <= n - 6`).",
      correction: "Change outer loop condition to: i <= limit - 6 (or p <= n - 6).",
      suggestedInput: "for (var i = 2; i <= limit - 6; i++)",
      sampleCodeStepProgress: steps
    };
  }

  const allVerified =
    hasLimitVar &&
    hasOuterLoopRange &&
    !hasUpperLimitOverflowBug &&
    hasFirstPrimeCheck &&
    hasSecondPrimeCheck &&
    hasSeparateCounters &&
    hasCombinedVerification &&
    hasOutputPair &&
    !hasMalformedDecisionBug;

  if (allVerified) {
    const allDoneSteps: StepProgress[] = steps.map(s => ({ ...s, completed: true, current: false }));
    return {
      allVerified: true,
      hasUpperLimit: hasLimitVar,
      hasOuterLoopRange,
      hasFirstPrimeCheck,
      hasSecondPrimeCheck,
      hasSeparateCounters,
      hasCombinedVerification,
      hasOutputPair,
      hasSinglePrimeOnlyBug: false,
      hasCounterOverlapBug: false,
      hasUpperLimitOverflowBug: false,
      matchedFirebaseInput: "let limit = 50;\nfor (let i = 2; i <= limit - 6; i++) {\n  let count1 = 0;\n  for (let k = 1; k <= i; k++) {\n    if (i % k === 0) count1++;\n  }\n  if (count1 === 2) {\n    let count2 = 0;\n    for (let j = 1; j <= i + 6; j++) {\n      if ((i + 6) % j === 0) count2++;\n    }\n    if (count2 === 2) {\n      console.log(i, i + 6);\n    }\n  }\n}",
      feedback: "🌟 Coach Maya here! You gotcha! 🎉 Outstanding prototype! You have successfully coded Sexy Prime number pairs: looping up to limit - 6, verifying primality for both numbers with separate counters, and printing the valid pairs. You are ready to run and test!",
      sampleCodeStepProgress: allDoneSteps
    };
  }

  return {
    allVerified: false,
    hasUpperLimit: hasLimitVar,
    hasOuterLoopRange,
    hasFirstPrimeCheck,
    hasSecondPrimeCheck,
    hasSeparateCounters,
    hasCombinedVerification,
    hasOutputPair,
    hasSinglePrimeOnlyBug,
    hasCounterOverlapBug,
    hasUpperLimitOverflowBug,
    feedback: !hasOuterLoopRange
      ? `🌟 Coach Maya here! Let's start with your outer loop: \`for (let ${outerVarName} = 2; ${outerVarName} <= ${limitVarName} - 6; ${outerVarName}++)\` to iterate candidate numbers up to ${limitVarName} - 6.`
      : hasUpperLimitOverflowBug && !hasCand1InnerLoopCorrect && !hasFirstPrimeCheck
      ? `🌟 Coach Maya here! Take a look at your outer loop: \`for(${outerVarName}=2; ${outerVarName}<=${limitVarName}; ${outerVarName}++)\`. Because the companion number in each pair is \`${outerVarName} + 6\`, running all the way to \`${limitVarName}\` means \`${outerVarName} + 6\` will exceed \`${limitVarName}\`! Change your outer loop boundary to \`${outerVarName} <= ${limitVarName} - 6\`.`
      : !hasFirstPrimeCheck
      ? (hasCand1InnerLoopCorrect
          ? `🌟 Coach Maya here! Great inner divisor loop! Now inside this loop, add the condition to test if candidate \`${outerVarName}\` is divisible by the divisor with remainder 0: \`if (${outerVarName} % j == 0) count1++;\``
          : `🌟 Coach Maya here! Great start! Now inside the outer loop, reset \`count1 = 0\` and write the inner loop for candidate \`${outerVarName}\`: \`for (let j = 1; j <= ${outerVarName}; j++)\` with \`if (${outerVarName} % j == 0) count1++;\``)
      : !hasSecondPrimeCheck
      ? `🌟 Coach Maya here! Candidate \`${outerVarName}\` primality check is complete! Now test the companion number \`${outerVarName} + 6\`: reset \`count2 = 0\` and loop \`for (let k = 1; k <= ${outerVarName} + 6; k++)\` with \`if ((${outerVarName} + 6) % k == 0) count2++;\``
      : `🌟 Coach Maya here! Both primality tests are ready! Now check \`if (count1 == 2 && count2 == 2)\` and print the sexy prime pair: \`print(${outerVarName}, ${outerVarName} + 6)\`.`,
    correction: !hasOuterLoopRange ? `Write outer loop: for (let ${outerVarName} = 2; ${outerVarName} <= ${limitVarName} - 6; ${outerVarName}++)` : `Check divisibility for candidate ${outerVarName} with count1++.`,
    suggestedInput: `let ${limitVarName} = 50;\nfor (let ${outerVarName} = 2; ${outerVarName} <= ${limitVarName} - 6; ${outerVarName}++) {\n  let count1 = 0;\n  for (let k = 1; k <= ${outerVarName}; k++) {\n    if (${outerVarName} % k === 0) count1++;\n  }\n  if (count1 === 2) {\n    let count2 = 0;\n    for (let j = 1; j <= ${outerVarName} + 6; j++) {\n      if ((${outerVarName} + 6) % j === 0) count2++;\n    }\n    if (count2 === 2) {\n      console.log(${outerVarName}, ${outerVarName} + 6);\n    }\n  }\n}`,
    sampleCodeStepProgress: steps
  };
}
