/**
 * Multiplication Table Program Validator & Pedagogy Matrix (Problem 05)
 * Comprehensive ground-truth rules, misconceptions, and hint sequences.
 */

export interface StepProgress {
  stepNumber: number;
  title: string;
  completed: boolean;
  current: boolean;
}

/**
 * Validates Stage 1: Logic for Multiplication Table
 */
export function validateMultiplicationLogic(text: string): {
  isFullyVerified: boolean;
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
} {
  const norm = (text || '').toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Initial Question / Starter query or stuck
  if (/^(what\s+i\s+do|what\s+do\s+i\s+do|what\s+next|how\s+to|what|how|where|tell me|explain|help)/i.test(norm) && (
    norm.includes('what is a multiplication table') ||
    norm.includes('what should we do') ||
    norm.includes('how to start') ||
    norm.includes('where to start') ||
    norm.includes('what i do') ||
    norm.includes('what do i do')
  )) {
    // If they have concrete equation errors, let equation checker handle it below, otherwise return question prompt
    const hasEquationLines = /\d+\s*[*x×]\s*\d+\s*=\s*\d+/.test(text || '');
    if (!hasEquationLines) {
      return {
        isFullyVerified: false,
        feedback: "🌟 Coach Maya here! What is a multiplication table? For example, for the number 5, what are the values when we multiply 5 by numbers starting from 1 up to 10?",
        correction: "Think about what multiplying 5 by numbers from 1 to 10 produces.",
        suggestedInput: "Keep the given number fixed and multiply it with each number from 1 up to the limit (e.g. 10) to get the product.",
        matchedFirebaseInput: "what should we do to generate the multiplication table of a number"
      };
    }
  }

  // 2. Don't know / puriyala
  if (norm.includes('dont know') || norm.includes("don't know") || norm.includes('puriyala') || norm.includes('theriyala') || norm.includes('no idea')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya here! Multiplication is repeated addition. For table 5:\n• 5 × 1 = 5, 5 × 2 = 10, 5 × 3 = 15, 5 × 4 = 20 ... up to 5 × 10 = 50.\nHow does each step produce the result?",
      correction: "State that we multiply the fixed number with consecutive multipliers from 1 to 10.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "I don't know / puriyala"
    };
  }

  // 3. Multiplication vs Addition bug
  if ((norm.includes('add') || norm.includes('addition') || norm.includes('n + i') || norm.includes('add the number')) && !norm.includes('multiply') && !norm.includes('*') && !norm.includes('×')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: While multiplication can be thought of as repeated addition, for any specific row (like step 4), we multiply the given number directly by the step multiplier: 5 × 4 = 20! How do we write that formula?",
      correction: "Use direct multiplication: Given Number × Multiplier.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "we just add the number in every step / we add n + i"
    };
  }

  // 4. Division / Modulo error
  if (norm.includes('divide') || norm.includes('remainder') || norm.includes('modulo') || norm.includes('%')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: Division splits a number into parts or finds remainders. To build a multiplication table, we must multiply the given number with consecutive multiplier numbers (1, 2, 3...).",
      correction: "Use multiplication instead of division/modulo.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "we should divide or find remainder"
    };
  }

  // 5. Starting at 0 mistake
  if (norm.includes('start multiplying from 0') || norm.includes('from 0 to 10') || norm.includes('starting from 0') || norm.includes('start from 0') || norm.includes('5*0') || norm.includes('5 * 0') || norm.includes('5x0') || norm.includes('5 x 0')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: Multiplying by 0 gives 0 (e.g. 5 × 0 = 0). Standard multiplication tables start from 1 up to a specified limit (like 10 or 12). Start from 1!",
      correction: "Start multipliers from 1: 'Multiply the fixed number with numbers from 1 to 10'.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "start multiplying from 0"
    };
  }

  // 6. Base Number Error & Equation Parsing
  // Parse any equations like 5*1=5, 5*2=10, 5*3=15 OR 1*5=5, 2*5=10, 3*5=15
  const equationMatches: Array<{ a: number; b: number; c: number; raw: string }> = [];
  const eqRegex = /(\d+)\s*[*x×]\s*(\d+)\s*=\s*(\d+)/gi;
  let match;
  while ((match = eqRegex.exec(text || '')) !== null) {
    equationMatches.push({
      a: parseInt(match[1], 10),
      b: parseInt(match[2], 10),
      c: parseInt(match[3], 10),
      raw: match[0]
    });
  }

  if (equationMatches.length > 0) {
    // Determine whether user is using Format A (base * multiplier = product) or Format B (multiplier * base = product)
    // First, check arithmetic correctness of all equations
    for (const eq of equationMatches) {
      if (eq.a * eq.b !== eq.c) {
        return {
          isFullyVerified: false,
          feedback: `🌟 Coach Maya note: Look at "${eq.raw}". Multiplying ${eq.a} × ${eq.b} equals ${eq.a * eq.b}, but you wrote ${eq.c}. Double check your multiplication arithmetic!`,
          correction: `Correct calculation: ${eq.a} * ${eq.b} = ${eq.a * eq.b}.`,
          suggestedInput: `keep the given number fixed and multiply it with each number from 1 up to 10`,
          matchedFirebaseInput: "arithmetic calculation error in table"
        };
      }
    }

    // Determine candidate base numbers
    // In Format A: all eq.a are the same base (e.g., 5 * 1, 5 * 2, 5 * 3...)
    // In Format B: all eq.b are the same base (e.g., 1 * 5, 2 * 5, 3 * 5...)
    const isFormatA_valid = equationMatches.every(eq => eq.a === equationMatches[0].a);
    const isFormatB_valid = equationMatches.every(eq => eq.b === equationMatches[0].b);

    let baseNum: number | null = null;
    let multipliers: number[] = [];

    if (isFormatA_valid && !isFormatB_valid) {
      baseNum = equationMatches[0].a;
      multipliers = equationMatches.map(e => e.b);
    } else if (isFormatB_valid && !isFormatA_valid) {
      baseNum = equationMatches[0].b;
      multipliers = equationMatches.map(e => e.a);
    } else if (isFormatA_valid && isFormatB_valid) {
      // e.g. single equation like 5*1=5 or square like 5*5=25
      // If 5*1=5, base is likely 5 and multiplier is 1 (or base 1 multiplier 5)
      baseNum = equationMatches[0].b === 1 ? equationMatches[0].a : equationMatches[0].a;
      multipliers = [equationMatches[0].b === 1 ? equationMatches[0].b : equationMatches[0].b];
    } else {
      // Neither A nor B is consistently valid across all equations!
      // Find what broke consistency (e.g. base changed from 5 to 10 in 10*3=30)
      const firstA = equationMatches[0].a;
      const firstB = equationMatches[0].b;

      // Check if Format A was intended (first 2 lines had same 'a')
      const formatACount = equationMatches.filter(e => e.a === firstA).length;
      const formatBCount = equationMatches.filter(e => e.b === firstB).length;

      if (formatACount >= formatBCount) {
        const faulty = equationMatches.find(e => e.a !== firstA)!;
        return {
          isFullyVerified: false,
          feedback: `🌟 Coach Maya here! You are off to a great start with your examples! In a multiplication table for ${firstA}, the number ${firstA} must stay fixed as our base for every step. In your step "${faulty.raw}", you changed the base to ${faulty.a}. Keep the base number ${firstA} the same while increasing the multiplier one by one!`,
          correction: `Keep the base number ${firstA} fixed: ${firstA} * 1 = ${firstA * 1}, ${firstA} * 2 = ${firstA * 2}, ${firstA} * 3 = ${firstA * 3} ... up to ${firstA} * 10 = ${firstA * 10}.`,
          suggestedInput: `keep the base number ${firstA} fixed and multiply with multipliers 1 to 10`,
          matchedFirebaseInput: "change the main number in every step"
        };
      } else {
        const faulty = equationMatches.find(e => e.b !== firstB)!;
        return {
          isFullyVerified: false,
          feedback: `🌟 Coach Maya here! You are off to a great start with your examples! In a multiplication table for ${firstB}, the number ${firstB} must stay fixed as our base for every step. In your step "${faulty.raw}", you changed the base to ${faulty.b}. Keep the base number ${firstB} the same while increasing the multiplier one by one!`,
          correction: `Keep the base number ${firstB} fixed: 1 * ${firstB} = ${1 * firstB}, 2 * ${firstB} = ${2 * firstB}, 3 * ${firstB} = ${3 * firstB} ... up to 10 * ${firstB} = ${10 * firstB}.`,
          suggestedInput: `keep the base number ${firstB} fixed and multiply with multipliers 1 to 10`,
          matchedFirebaseInput: "change the main number in every step"
        };
      }
    }

    // Check if multipliers start from 0
    if (multipliers.includes(0)) {
      return {
        isFullyVerified: false,
        feedback: "🌟 Coach Maya note: Multiplying by 0 gives 0 (e.g. 5 × 0 = 0). Standard multiplication tables start from 1 up to a specified limit (like 10 or 12). Start from 1!",
        correction: "Start multipliers from 1: 'Multiply the fixed number with numbers from 1 to 10'.",
        suggestedInput: `keep the base number ${baseNum} fixed and multiply with numbers from 1 to 10`,
        matchedFirebaseInput: "start multiplying from 0"
      };
    }

    // Check if multipliers cover full table (must reach 10 or explicitly state up to 10 / limit / ...)
    const maxMultiplier = multipliers.length > 0 ? Math.max(...multipliers) : 0;
    const hasExplicit10OrRange = norm.includes('10') || norm.includes('limit') || norm.includes('up to') || norm.includes('etc') || norm.includes('...') || norm.includes('continue');

    if (maxMultiplier < 10 && !hasExplicit10OrRange) {
      return {
        isFullyVerified: false,
        feedback: `🌟 Coach Maya here! You did a wonderful job showing the multiplication pattern for ${baseNum} from 1 up to ${maxMultiplier} (${equationMatches[0].raw} to ${equationMatches[equationMatches.length - 1].raw})! However, the problem requires generating the multiplication table all the way up to 10. Please continue your sequence up to 10 (${baseNum} * 10 = ${baseNum! * 10} or 10 * ${baseNum} = ${10 * baseNum!}).`,
        correction: `Continue the table up to 10: write steps all the way through 10 * ${baseNum} = ${10 * baseNum!} (or ${baseNum} * 10 = ${baseNum! * 10}).`,
        suggestedInput: `keep the given number ${baseNum} fixed and multiply with numbers from 1 to 10`,
        matchedFirebaseInput: "incomplete table equations"
      };
    }

    // If valid equations and covers the range
    return {
      isFullyVerified: true,
      feedback: `🌟 Coach Maya here! Fantastic example! You have clearly shown the mathematical pattern: keeping the base number ${baseNum} fixed and multiplying sequentially with multipliers from 1 up to 10 (${equationMatches[0].raw} ... ${equationMatches[equationMatches.length - 1].raw}) to calculate each product! You have mastered this stage, so let's move on to the Recipe stage!`,
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "concrete table values example"
    };
  }

  // 7. Base Number Error in text
  if (norm.includes('change the main number') || norm.includes('change the given number') || norm.includes('change base number')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: The main table number stays constant (e.g. 5). It is the multiplier that changes consecutively (1, 2, 3, 4, ...).",
      correction: "Keep the base number fixed and increment the multiplier.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "change the main number in every step"
    };
  }

  // 8. Single Value Error
  if ((norm.includes('just multiply the number by 10') || norm.includes('only multiply by 10') || norm.includes('multiply by 10')) && !norm.includes('from 1') && !norm.includes('each number') && !norm.includes('every number')) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: Multiplying only by 10 gives a single value (e.g. 50). A table requires calculating and showing the product for every consecutive number from 1 to 10.",
      correction: "Mention testing each multiplier from 1 to 10.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10",
      matchedFirebaseInput: "just multiply the number by 10"
    };
  }

  // 9. Formula Definition
  if (norm.includes('result = number * multiplier') || norm.includes('number * multiplier') || norm.includes('given number * multiplier') || norm.includes('n * i')) {
    return {
      isFullyVerified: true,
      feedback: "🌟 Coach Maya here! Fantastic! That is the core formula: Result = Given Number × Multiplier, where the given number is kept fixed and the multiplier steps sequentially from 1 up to 10! Proceed to Recipe!",
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "for any step we calculate result = number * multiplier"
    };
  }

  // 10. Success Path
  const hasFixedNumber = norm.includes('fixed') || norm.includes('given number') || norm.includes('main number') || norm.includes('same number') || norm.includes('input number') || norm.includes('table number') || norm.includes('n');
  const hasMultipliers = (norm.includes('1 up to 10') || norm.includes('from 1 to 10') || norm.includes('1 to 10') || norm.includes('1 to 12') || norm.includes('consecutive numbers') || norm.includes('each number from 1') || norm.includes('every number from 1') || norm.includes('each multiplier'));
  const hasMultiply = norm.includes('multiply') || norm.includes('multiplication') || norm.includes('product') || norm.includes('*') || norm.includes('times');

  if ((hasFixedNumber && hasMultipliers && hasMultiply) ||
      (norm.includes('keep the given number fixed') && norm.includes('multiply')) ||
      (norm.includes('multiply') && norm.includes('from 1 to 10')) ||
      (norm.includes('multiply') && norm.includes('1 up to 10'))) {
    return {
      isFullyVerified: true,
      feedback: "🌟 Coach Maya here! Fantastic! That is the exact mathematical logic: Take the fixed number, multiply it sequentially with numbers from 1 to the limit (e.g. 10), and display each product! Proceed to Recipe!",
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "keep the given number fixed and multiply it with each number from 1 up to the limit to get the product"
    };
  }

  // General partial / exploratory
  if (hasMultiply) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maya note: You correctly mentioned multiplication! Which number stays fixed, and what range of multipliers should we multiply it by (e.g., from 1 up to 10)?",
      correction: "Specify that the given number is kept fixed and multiplied by consecutive numbers from 1 to 10.",
      suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to the limit to get the product"
    };
  }

  return {
    isFullyVerified: false,
    feedback: "🌟 Coach Maya here! To generate a multiplication table for a number (like 5), what sequence of numbers do we multiply by 5 starting from 1?",
    correction: "Describe keeping the given number fixed and multiplying it with each number from 1 to 10.",
    suggestedInput: "keep the given number fixed and multiply it with each number from 1 up to 10 to get the product"
  };
}

/**
 * Validates Stage 2: Recipe for Multiplication Table
 * Steps:
 * Step 1: Get the input number for the table
 * Step 2: Take multiplier numbers starting from 1 up to 10
 * Step 2.1: Multiply the input number by the current multiplier
 * Step 2.2: Display the multiplier and the calculated product
 * Step 2.3: Repeat the process until the multiplier reaches 10
 */
export function validateMultiplicationRecipe(text: string): {
  hasStep1: boolean;
  hasStep2: boolean;
  hasStep21: boolean;
  hasStep22: boolean;
  isFullyVerified: boolean;
  completedStepsCount: number;
  recipeStepProgress: StepProgress[];
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
} {
  const norm = (text || '').toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, ' ').replace(/\s+/g, ' ').trim();

  // Detect code keywords in Recipe
  const hasCodeKeywords = (norm.includes('for (') || norm.includes('for(') || norm.includes('let i') || norm.includes('var i') || norm.includes('i++') || norm.includes('print(') || norm.includes('console.log'));

  const hasStep1 =
    norm.includes('get the input') ||
    norm.includes('get input') ||
    norm.includes('input number') ||
    norm.includes('table number') ||
    norm.includes('accept a number') ||
    norm.includes('take number') ||
    norm.includes('read number') ||
    /\bstep\s*1\s*:\s*.*n\b/.test(norm);

  const hasStartingZero = norm.includes('from 0 to 10') || norm.includes('starting from 0') || norm.includes('start from 0') || norm.includes('0 to 10');

  const hasStep2 =
    !hasStartingZero &&
    (
      norm.includes('from 1 up to 10') ||
      norm.includes('from 1 to 10') ||
      norm.includes('1 up to 10') ||
      norm.includes('1 to 10') ||
      norm.includes('from 1 up to the limit') ||
      norm.includes('multiplier numbers starting from 1') ||
      norm.includes('for each multiplier') ||
      norm.includes('every number from 1')
    );

  const hasStep21 =
    (norm.includes('multipli') || norm.includes('multiply') || norm.includes('product') || norm.includes('*') || norm.includes('times') || norm.includes('calculate') || norm.includes('compute')) &&
    (
      norm.includes('multiplier') ||
      norm.includes('number by') ||
      norm.includes('each number') ||
      norm.includes('input number by') ||
      norm.includes('input with') ||
      norm.includes('input and') ||
      norm.includes('input by') ||
      norm.includes('generated number') ||
      norm.includes('generated numbers') ||
      norm.includes('one by one') ||
      norm.includes('current') ||
      norm.includes('each') ||
      norm.includes('with number') ||
      norm.includes('with numbers') ||
      norm.includes('with the number') ||
      norm.includes('by number') ||
      norm.includes('by numbers') ||
      norm.includes('from 1 to 10') ||
      norm.includes('1 to 10') ||
      norm.includes('them')
    );

  const hasSingleStepMistake = (norm.includes('multiply the number by 10') || norm.includes('multiply by 10')) && !norm.includes('current') && !norm.includes('each') && !norm.includes('from 1') && !norm.includes('one by one');

  const hasEarlyStop = (norm.includes('display result and stop') || norm.includes('stop after one') || norm.includes('stop the process')) && !norm.includes('until');

  const hasStep22 =
    !hasEarlyStop &&
    (
      norm.includes('display') ||
      norm.includes('print') ||
      norm.includes('show') ||
      norm.includes('record') ||
      norm.includes('write down') ||
      norm.includes('output') ||
      norm.includes('publish')
    ) &&
    (
      norm.includes('product') ||
      norm.includes('result') ||
      norm.includes('multiplier') ||
      norm.includes('table') ||
      norm.includes('output') ||
      norm.includes('multiplication') ||
      norm.includes('answer') ||
      norm.includes('value') ||
      norm.includes('it') ||
      norm.includes('each')
    );

  const completedStepsCount = [hasStep1, hasStep2, hasStep21, hasStep22].filter(Boolean).length;

  const recipeStepProgress: StepProgress[] = [
    { stepNumber: 1, title: 'Get the input number for the table', completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: 'Take multiplier numbers starting from 1 up to 10', completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: 'Multiply the input number by the current multiplier (Step 2.1)', completed: hasStep21, current: hasStep1 && hasStep2 && !hasStep21 },
    { stepNumber: 4, title: 'Display the multiplier and product, repeat until 10 (Step 2.2/2.3)', completed: hasStep22, current: hasStep1 && hasStep2 && hasStep21 && !hasStep22 }
  ];

  // Code keywords warning
  if (hasCodeKeywords) {
    return {
      hasStep1,
      hasStep2,
      hasStep21,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount,
      recipeStepProgress,
      feedback: "🌟 Coach Maya note: In the Recipe stage, describe the steps in plain human English without code syntax (no `for`, `i++`, or `print()`). For example: 'For every multiplier from 1 to 10' and 'Display the result'.",
      correction: "Describe the algorithm in natural plain English.",
      suggestedInput: "step 1: Get the input number\nstep 2: Take multiplier numbers from 1 to 10\nstep 2.1: Multiply input number by current multiplier\nstep 2.2: Display the result and repeat until 10"
    };
  }

  // Bug: Starting at 0
  if (hasStartingZero) {
    return {
      hasStep1: true,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 1,
      recipeStepProgress: [
        { stepNumber: 1, title: 'Get the input number for the table', completed: true, current: false },
        { stepNumber: 2, title: 'Take multiplier numbers starting from 1 up to 10', completed: false, current: true },
        { stepNumber: 3, title: 'Multiply the input number by the current multiplier', completed: false, current: false },
        { stepNumber: 4, title: 'Display the result and repeat until 10', completed: false, current: false }
      ],
      feedback: "🌟 Coach Maya note: Standard multiplication tables start from 1! Adjust your starting multiplier from 0 to 1.",
      correction: "Change Step 2: 'step 2 : Take multiplier numbers starting from 1 up to 10'.",
      suggestedInput: "step 2 : Take multiplier numbers starting from 1 up to 10",
      matchedFirebaseInput: "step 2 : Take numbers starting from 0 to 10"
    };
  }

  // Bug: Single step mistake (multiplying only by 10)
  if (hasSingleStepMistake) {
    return {
      hasStep1,
      hasStep2,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 2,
      recipeStepProgress,
      feedback: "🌟 Coach Maya note: You need to repeat the calculation for every multiplier from 1 to 10, not just multiply by 10 once! Step 2.1: Multiply the input number by the current multiplier.",
      correction: "Step 2.1: Multiply the input number by the current multiplier.",
      suggestedInput: "step 2.1 : Multiply the input number by the current multiplier",
      matchedFirebaseInput: "step 2.1 : multiply the number by 10"
    };
  }

  // Bug: Early stop mistake
  if (hasEarlyStop) {
    return {
      hasStep1,
      hasStep2,
      hasStep21,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 3,
      recipeStepProgress,
      feedback: "🌟 Coach Maya note: Do not stop after one multiplier! Continue the repeating process until all multipliers up to 10 are completed.",
      correction: "Repeat until reaching 10: 'step 2.3 : Repeat the process until the multiplier reaches 10'.",
      suggestedInput: "step 2.2 : Display the multiplier and product\nstep 2.3 : Repeat the process until multiplier reaches 10",
      matchedFirebaseInput: "step 2.2 : display result and stop"
    };
  }

  const isFullyVerified = hasStep1 && hasStep2 && hasStep21 && hasStep22;

  if (isFullyVerified) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: true,
      hasStep22: true,
      isFullyVerified: true,
      completedStepsCount: 4,
      recipeStepProgress,
      feedback: "🌟 Coach Maya here! Kudos! You have written down the clear step-by-step algorithm without any code jargon. Proceed to Ingredients!",
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "step 2.3 : repeat the process until the multiplier reaches 10"
    };
  }

  if (hasStep1 && !hasStep2) {
    return {
      hasStep1: true,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 1,
      recipeStepProgress,
      feedback: "🌟 Coach Maya here! Great! What is the next step to systematically go through each multiplier starting from 1 up to 10?",
      correction: "Write Step 2: 'Take multiplier numbers starting from 1 up to 10'.",
      suggestedInput: "step 2 : Take multiplier numbers starting from 1 up to 10",
      matchedFirebaseInput: "step 1 : Get the input number for the table"
    };
  }

  if (hasStep1 && hasStep2 && !hasStep21) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 2,
      recipeStepProgress,
      feedback: "🌟 Coach Maya here! Nice! For each multiplier in this repeating process, what calculation should be performed?",
      correction: "Write Step 2.1: 'Multiply the input number by the current multiplier'.",
      suggestedInput: "step 2.1 : Multiply the input number by the current multiplier",
      matchedFirebaseInput: "step 2 : Take multiplier numbers starting from 1 up to 10"
    };
  }

  if (hasStep1 && hasStep2 && hasStep21 && !hasStep22) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: true,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 3,
      recipeStepProgress,
      feedback: "🌟 Coach Maya here! Superb! After calculating the product for the current multiplier, what should you do with the result?",
      correction: "Write Step 2.2: 'Display the multiplier and the calculated product'.",
      suggestedInput: "step 2.2 : Display the multiplier and the calculated product\nstep 2.3 : Repeat the process until the multiplier reaches 10",
      matchedFirebaseInput: "step 2.1 : Multiply the input number by the current multiplier"
    };
  }

  return {
    hasStep1: false,
    hasStep2: false,
    hasStep21: false,
    hasStep22: false,
    isFullyVerified: false,
    completedStepsCount: 0,
    recipeStepProgress,
    feedback: "🌟 Coach Maya here! Based on our mathematical logic, write down the sequential steps one by one.\nExample:\nStep 1: Get the table number\nStep 2: ...",
    correction: "Write Step 1: 'step 1 : Get the input number for the table'.",
    suggestedInput: "step 1 : Get the input number for the table",
    matchedFirebaseInput: "what should i do here"
  };
}

/**
 * Validates Stage 3: Ingredients for Multiplication Table
 * Ingredients:
 * 1. Variable n for table number
 * 2. For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)
 * 3. product = n * i (calculation)
 * 4. Print statement inside loop showing n, i, and product
 */
export function validateMultiplicationIngredients(text: string): {
  hasInput: boolean;
  hasLoop: boolean;
  hasCalculation: boolean;
  hasPrint: boolean;
  isFullyVerified: boolean;
  completedStepsCount: number;
  hasLoopBoundsBug?: boolean;
  hasLoopStartBug?: boolean;
  hasLoopStepDecrement?: boolean;
  hasWrongOperatorBug?: boolean;
  hasPrintOutsideBug?: boolean;
  ingredientsStepProgress: StepProgress[];
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
} {
  const norm = (text || '').toLowerCase().replace(/[^a-z0-9\s%+\-=*×/<>()_]/g, ' ').replace(/\s+/g, ' ').trim();

  // Step 1: Input variable (n, a, num, x, table, input)
  const hasInput =
    norm.includes('variable') ||
    norm.includes('var') ||
    norm.includes('n for table number') ||
    norm.includes('table number') ||
    norm.includes('variable a') ||
    norm.includes('variable n') ||
    norm.includes('variable num') ||
    norm.includes('variable x') ||
    norm.includes('input variable') ||
    norm.includes('get input') ||
    norm.includes('take number') ||
    /\b(variable|var)?\s*[anx](\s*\(?\s*\d*\s*\)?)?\b/.test(norm) ||
    /\bstep\s*1\s*:\s*.*[anx]\b/.test(norm) ||
    norm.includes('input') ||
    norm.includes('number');

  // Loop bugs
  const hasLoopStartBug =
    norm.includes('start: 0') || norm.includes('start = 0') || norm.includes('starting from i = 0') || norm.includes('i = 0') || norm.includes('i=0');

  const hasLoopBoundsBug =
    norm.includes('stop: i < 10') || norm.includes('stop: 9') || norm.includes('i < 10') || norm.includes('stop: < 10');

  const hasLoopStepDecrement =
    (
      norm.includes('next step:-1') ||
      norm.includes('next step: -1') ||
      norm.includes('next step -1') ||
      norm.includes('next step: - 1') ||
      norm.includes('step:-1') ||
      norm.includes('step: -1') ||
      norm.includes('step = -1') ||
      norm.includes('step=-1') ||
      norm.includes('step -1') ||
      norm.includes('i--') ||
      norm.includes('decrement')
    ) && !norm.includes('+1') && !norm.includes('i++');

  const hasCompleteLoop =
    !hasLoopStartBug &&
    !hasLoopBoundsBug &&
    !hasLoopStepDecrement &&
    (
      norm.includes('for loop') ||
      norm.includes('for loop(i)') ||
      norm.includes('for loop (i)') ||
      norm.includes('start: 1') ||
      norm.includes('starts with 1') ||
      norm.includes('start = 1') ||
      norm.includes('from 1 to 10') ||
      norm.includes('1 up to 10') ||
      norm.includes('range(1, 11)') ||
      norm.includes('range(1, 10 + 1)') ||
      norm.includes('i <= 10') ||
      norm.includes('stop: 10') ||
      norm.includes('stop with 10') ||
      norm.includes('stop: i <= 10') ||
      ((norm.includes('start') || norm.includes('from 1') || norm.includes('i = 1')) &&
       (norm.includes('stop') || norm.includes('10')) &&
       (norm.includes('step') || norm.includes('+1') || norm.includes('i++')))
    );

  // Calculation bugs & detection
  // Check for addition bug (+) instead of multiplication
  const hasWrongOperatorBug =
    (
      norm.includes('product = n + i') || norm.includes('product = n+i') ||
      norm.includes('product = a + i') || norm.includes('product = a+i') ||
      norm.includes('result = a + i') || norm.includes('result = a+i') ||
      norm.includes('result = n + i') || norm.includes('result = n+i') ||
      norm.includes('ans = n + i') || norm.includes('n + i') || norm.includes('a + i')
    ) &&
    !norm.includes('*') && !norm.includes('times') && !norm.includes('multiply');

  // Detection for calculation (e.g. result = a * i, product = n * i, a*i=result, n*i=product, a*i, n*i, multiply a and i)
  const hasMultiplicationMath =
    norm.includes('*') ||
    norm.includes('times') ||
    norm.includes('multiply') ||
    norm.includes('product') ||
    norm.includes('multiplication');

  const hasCompleteCalculation =
    !hasWrongOperatorBug &&
    hasMultiplicationMath &&
    (
      // Expressions like product = n * i, result = a * i, a*i=result, n*i=product, etc.
      norm.includes('product = n * i') || norm.includes('product = n*i') ||
      norm.includes('product = a * i') || norm.includes('product = a*i') ||
      norm.includes('result = a * i') || norm.includes('result = a*i') ||
      norm.includes('result = n * i') || norm.includes('result = n*i') ||
      norm.includes('a*i=result') || norm.includes('a * i = result') ||
      norm.includes('n*i=result') || norm.includes('n * i = result') ||
      norm.includes('a*i=product') || norm.includes('a * i = product') ||
      norm.includes('n*i=product') || norm.includes('n * i = product') ||
      norm.includes('a*i') || norm.includes('a * i') ||
      norm.includes('i*a') || norm.includes('i * a') ||
      norm.includes('n*i') || norm.includes('n * i') ||
      norm.includes('i*n') || norm.includes('i * n') ||
      norm.includes('num * i') || norm.includes('num*i') ||
      norm.includes('input * i') || norm.includes('input*i') ||
      norm.includes('multiply a and i') || norm.includes('multiply n and i') ||
      norm.includes('multiply input and i') || norm.includes('multiply input with i') ||
      (norm.includes('result') && (norm.includes('a') || norm.includes('n') || norm.includes('input')) && (norm.includes('i') || norm.includes('multiplier'))) ||
      (norm.includes('product') && (norm.includes('a') || norm.includes('n') || norm.includes('input')) && (norm.includes('i') || norm.includes('multiplier')))
    );

  // Print placement bug & detection
  const hasPrintOutsideBug =
    norm.includes('print statement outside') || norm.includes('outside the loop') || norm.includes('print outside');

  const hasCompletePrint =
    !hasPrintOutsideBug &&
    (
      norm.includes('print statement inside the loop') ||
      norm.includes('print statement inside loop') ||
      norm.includes('inside the loop') ||
      norm.includes('inside loop') ||
      norm.includes('print(n + " x " + i') ||
      norm.includes('print(a + " x " + i') ||
      norm.includes('print(n * i)') ||
      norm.includes('print(a * i)') ||
      norm.includes('print(product)') ||
      norm.includes('print(result)') ||
      norm.includes('print result') ||
      norm.includes('print product') ||
      norm.includes('display n, i, and product') ||
      norm.includes('display a, i, and result') ||
      norm.includes('display result') ||
      norm.includes('display product') ||
      norm.includes('print n, i, and product') ||
      norm.includes('print showing n, i, and product') ||
      norm.includes('print each result') ||
      norm.includes('print the result') ||
      norm.includes('print output') ||
      (/\bstep\s*(?:2\.2|4|5)\s*:\s*.*print\b/.test(norm))
    );

  const completedStepsCount = [hasInput, hasCompleteLoop, hasCompleteCalculation, hasCompletePrint].filter(Boolean).length;
  const isFullyVerified = hasInput && hasCompleteLoop && hasCompleteCalculation && hasCompletePrint;

  const ingredientsStepProgress: StepProgress[] = [
    { stepNumber: 1, title: 'Variable for the table number (e.g. n, a, num)', completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: hasCompleteLoop, current: hasInput && !hasCompleteLoop },
    { stepNumber: 3, title: 'Variable to store calculation (e.g. result = a * i or product = n * i)', completed: hasCompleteCalculation, current: hasInput && hasCompleteLoop && !hasCompleteCalculation },
    { stepNumber: 4, title: 'Print statement inside the loop showing the result', completed: hasCompletePrint, current: hasInput && hasCompleteLoop && hasCompleteCalculation && !hasCompletePrint }
  ];

  // Case: Loop Start at 0 bug
  if (hasLoopStartBug) {
    return {
      hasInput,
      hasLoop: false,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      hasLoopStartBug: true,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: 'Variable n for the table number', completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: false, current: true },
        { stepNumber: 3, title: 'Calculation: product = n * i', completed: false, current: false },
        { stepNumber: 4, title: 'Print statement inside loop', completed: false, current: false }
      ],
      feedback: "🌟 Coach Maya note: Multiplication tables start at 1 (e.g. 5 × 1 = 5). Initialize your loop counter with i = 1 (not 0).",
      correction: "Change loop start to 1: 'step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
      matchedFirebaseInput: "step 2 : For loop starting from i = 0"
    };
  }

  // Case: Loop Bounds bug (< 10)
  if (hasLoopBoundsBug) {
    return {
      hasInput,
      hasLoop: false,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      hasLoopBoundsBug: true,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: 'Variable n for the table number', completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: false, current: true },
        { stepNumber: 3, title: 'Calculation: product = n * i', completed: false, current: false },
        { stepNumber: 4, title: 'Print statement inside loop', completed: false, current: false }
      ],
      feedback: "🌟 Coach Maya note: If you write i < 10, the loop stops at 9, missing the 10th row! Use i <= 10 (or Stop at 10 inclusive).",
      correction: "Use i <= 10: 'step 2 : For loop with Start: 1, Stop: 10 (i <= 10), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
      matchedFirebaseInput: "step 2 : For loop with Start: 1, Stop: i < 10, Step: +1"
    };
  }

  // Case: Loop Step Decrement bug
  if (hasLoopStepDecrement) {
    return {
      hasInput,
      hasLoop: false,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      hasLoopStepDecrement: true,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: 'Variable n for the table number', completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: false, current: true },
        { stepNumber: 3, title: 'Calculation: product = n * i', completed: false, current: false },
        { stepNumber: 4, title: 'Print statement inside loop', completed: false, current: false }
      ],
      feedback: "🌟 Coach Maya note: Look at your loop step where you wrote `step: -1`! Since your loop starts at 1 and counts up to 10, decrementing by -1 will count downwards into negative numbers (1, 0, -1, -2...)! To count upwards from 1 to 10, your step must increment with **`+1`** (or `i++`).",
      correction: "Change loop step to +1: 'step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
      matchedFirebaseInput: "loop step -1 in multiplication"
    };
  }

  // Case: Wrong Operator bug (+)
  if (hasWrongOperatorBug) {
    return {
      hasInput,
      hasLoop: true,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      hasWrongOperatorBug: true,
      completedStepsCount: 2,
      ingredientsStepProgress: [
        { stepNumber: 1, title: 'Variable n for the table number', completed: true, current: false },
        { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: true, current: false },
        { stepNumber: 3, title: 'Calculation: product = n * i', completed: false, current: true },
        { stepNumber: 4, title: 'Print statement inside loop', completed: false, current: false }
      ],
      feedback: "🌟 Coach Maya note: `product = n + i` performs addition (e.g. 5 + 1 = 6)! To calculate the table product, use the multiplication operator `*`: **`product = n * i`**.",
      correction: "Use multiplication: 'step 2.1 : product = n * i'.",
      suggestedInput: "step 2.1 : product = n * i",
      matchedFirebaseInput: "step 2.1 : product = n + i"
    };
  }

  // Case: Print Outside Loop bug
  if (hasPrintOutsideBug) {
    return {
      hasInput,
      hasLoop: true,
      hasCalculation: true,
      hasPrint: false,
      isFullyVerified: false,
      hasPrintOutsideBug: true,
      completedStepsCount: 3,
      ingredientsStepProgress: [
        { stepNumber: 1, title: 'Variable n for the table number', completed: true, current: false },
        { stepNumber: 2, title: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)', completed: true, current: false },
        { stepNumber: 3, title: 'Calculation: product = n * i', completed: true, current: false },
        { stepNumber: 4, title: 'Print statement inside the loop showing n, i, and product', completed: false, current: true }
      ],
      feedback: "🌟 Coach Maya note: If print is outside the loop, it will only print the very last product (50). To display every line of the multiplication table, place the print statement **inside the loop**!",
      correction: "Place print inside loop: 'step 2.2 : print statement inside the loop showing n, i, and product'.",
      suggestedInput: "step 2.2 : print statement inside the loop showing n, i, and product",
      matchedFirebaseInput: "step 2.2 : print statement outside the loop"
    };
  }

  if (isFullyVerified) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCalculation: true,
      hasPrint: true,
      isFullyVerified: true,
      completedStepsCount: 4,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Awesome! You have all the ingredients ready: variable n, for loop (1 to 10), product = n * i, and print statement inside the loop. Now let's proceed to Taste the Sample!",
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "step 2.2 : print statement inside the loop showing n, i, and product"
    };
  }

  if (hasInput && !hasCompleteLoop) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: 1,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Spot on! Now, what loop construct is needed to iterate multipliers from 1 to 10? Specify its Start, Stop, and Step.",
      correction: "Write Step 2: 'For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
      matchedFirebaseInput: "step 1 : n for the table number"
    };
  }

  if (hasInput && hasCompleteLoop && !hasCompleteCalculation) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCalculation: false,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: 2,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! You are doing fantastic! That loop setup is perfectly defined to handle the multipliers from 1 to 10. Now, inside the loop, we need a variable (like `result` or `product`) to store the answer of each multiplication. What variable and calculation formula should we write to calculate and store the product (e.g. `result = a * i` or `product = n * i`)?",
      correction: "Specify a variable to store the calculated value: Write Step 2.1: 'result = a * i' (or 'product = n * i').",
      suggestedInput: "step 2.1 : result = a * i",
      matchedFirebaseInput: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)"
    };
  }

  if (hasInput && hasCompleteLoop && hasCompleteCalculation && !hasCompletePrint) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCalculation: true,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: 3,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maya here! Hurray, that calculation is spot on! Finally, what statement displays the multiplication output (e.g. 'print result' or 'print showing n, i, and product') inside the loop?",
      correction: "Write Step 4 / 2.2: 'print statement inside the loop showing the result'.",
      suggestedInput: "step 4 : print result inside the loop",
      matchedFirebaseInput: "step 2.1 : product = n * i"
    };
  }

  return {
    hasInput: false,
    hasLoop: false,
    hasCalculation: false,
    hasPrint: false,
    isFullyVerified: false,
    completedStepsCount: 0,
    ingredientsStepProgress,
    feedback: "🌟 Coach Maya here! Identify the variables, loop constructs, calculations, and print statements needed for each step. For Step 1, what variable is needed to store the table number?",
    correction: "Write Step 1: 'step 1 : n for the table number'.",
    suggestedInput: "step 1 : n for the table number",
    matchedFirebaseInput: "what do I do here"
  };
}

/**
 * Validates Stage 4: Taste the Sample (Sample Code) for Multiplication Table
 */
export function validateMultiplicationSampleCode(code: string, attemptCount: number = 1): {
  hasInput: boolean;
  hasLoop: boolean;
  hasProductCalculation: boolean;
  hasFormattedPrint: boolean;
  allVerified: boolean;
  sampleCodeStepProgress: StepProgress[];
  feedback: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
} {
  const norm = (code || '').toLowerCase().replace(/\s+/g, ' ').trim();

  // Step 1: Input variable declaration (e.g. var n = 5; a = 5; n = 5; let n = 5; n = int(input()))
  const inputVarMatch = code.match(/(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(?:int\(input\(\)\)|\d+)/i);
  const inputVar = inputVarMatch ? inputVarMatch[1] : 'n';

  const hasInput =
    Boolean(inputVarMatch) ||
    /(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(?:int\(input\(\)\)|\d+)/i.test(code) ||
    norm.includes('n = 5') || norm.includes('n=5') || norm.includes('var n = 5') || norm.includes('let n = 5') ||
    norm.includes('a = 5') || norm.includes('a=5') || norm.includes('var a = 5') || norm.includes('let a = 5');

  // Bugs detection
  const hasLoopStart0Bug =
    norm.includes('i = 0') || norm.includes('i=0') || norm.includes('range(0,') || norm.includes('range(0 ,');

  const hasLoopBoundBug =
    (norm.includes('i < 10') || norm.includes('i<10') || norm.includes('range(1, 10)') || norm.includes('range(1,10)')) &&
    !norm.includes('i <= 10') && !norm.includes('range(1, 11)') && !norm.includes('range(1, 10 + 1)');

  const hasLoopStepDecrementBug =
    norm.includes('i--') || norm.includes('i -= 1') || norm.includes('i = i - 1');

  // Step 2: Loop from 1 to 10
  const hasLoop =
    !hasLoopStart0Bug &&
    !hasLoopBoundBug &&
    !hasLoopStepDecrementBug &&
    (
      /(?:for|while)\s*\(?\s*(?:var|let|int)?\s*i\s*=\s*1\s*;\s*i\s*<=\s*10\s*;\s*i(?:\+\+|\s*\+=\s*1|\s*=\s*i\s*\+\s*1)\s*\)?/i.test(code) ||
      /for\s+i\s+in\s+range\(\s*1\s*,\s*(?:11|10\s*\+\s*1)\s*\)/i.test(code) ||
      (norm.includes('i = 1') && norm.includes('i <= 10') && (norm.includes('i++') || norm.includes('i += 1'))) ||
      norm.includes('for (var i = 1; i <= 10; i++)') ||
      norm.includes('for (let i = 1; i <= 10; i++)') ||
      norm.includes('for(i=1;i<=10;i++)') ||
      norm.includes('for i in range(1, 11):')
    );

  // Bug: Addition instead of multiplication (n + i or a + i)
  const hasAdditionBug =
    !norm.includes('*') &&
    (norm.includes('n + i') || norm.includes('n+i') || norm.includes('a + i') || norm.includes('a+i') || norm.includes('i + a') || norm.includes('i + n'));

  // Bug: Overwrite input variable inside loop (n = n * i or a = a * i)
  const hasOverwriteNBug =
    /(?:n|a|num)\s*=\s*(?:n|a|num)\s*\*\s*i/i.test(code) ||
    /(?:n|a|num)\s*\*=\s*i/i.test(code) ||
    norm.includes('n = n * i') || norm.includes('n=n*i') ||
    norm.includes('a = a * i') || norm.includes('a=a*i');

  // Bug: Multiply wrong variable (n * n or i * i or a * a)
  const hasWrongVariableMultiplication =
    (norm.includes('n * n') || norm.includes('n*n') || norm.includes('a * a') || norm.includes('a*a') || norm.includes('i * i') || norm.includes('i*i')) &&
    !norm.includes('n * i') && !norm.includes('n*i') && !norm.includes('a * i') && !norm.includes('a*i') &&
    !norm.includes('i * n') && !norm.includes('i*n') && !norm.includes('i * a') && !norm.includes('i*a');

  // Step 3: Product calculation (e.g. res = i * a, product = n * i, result = a * i, ans = n * i, a*i, etc.)
  const hasProductCalculation =
    !hasAdditionBug &&
    !hasOverwriteNBug &&
    !hasWrongVariableMultiplication &&
    (
      /(?:var|let|const)?\s*(?:product|res|result|ans|mul|output|val)\s*=\s*(?:[a-zA-Z_]\w*|\d+)\s*\*\s*(?:[a-zA-Z_]\w*|\d+)/i.test(code) ||
      /(?:var|let|const)?\s*(?:[a-zA-Z_]\w*)\s*=\s*(?:i\s*\*\s*[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\*\s*i)/i.test(code) ||
      /product\s*=\s*n\s*\*\s*i/i.test(code) ||
      /ans\s*=\s*n\s*\*\s*i/i.test(code) ||
      /result\s*=\s*n\s*\*\s*i/i.test(code) ||
      /res\s*=\s*i\s*\*\s*a/i.test(code) ||
      /res\s*=\s*a\s*\*\s*i/i.test(code) ||
      norm.includes('i * a') || norm.includes('i*a') ||
      norm.includes('a * i') || norm.includes('a*i') ||
      norm.includes('n * i') || norm.includes('n*i') ||
      norm.includes('i * n') || norm.includes('i*n') ||
      norm.includes('num * i') || norm.includes('i * num')
    );

  // Bug: Break inside loop
  const hasBreakBug = /\bbreak\b/i.test(code);

  // Bug: Print outside loop
  // If loop exists and print occurs after the closing brace of the loop
  const hasPrintOutsideBug = (function() {
    const loopMatch = code.match(/for\s*\(.*?\{/i);
    if (loopMatch && loopMatch.index !== undefined) {
      const rest = code.slice(loopMatch.index);
      const closeBraceIdx = rest.indexOf('}');
      if (closeBraceIdx !== -1) {
        const afterLoop = rest.slice(closeBraceIdx);
        if (/print\s*\(|console\.log\s*\(/i.test(afterLoop) && !/print\s*\(|console\.log\s*\(/i.test(rest.slice(0, closeBraceIdx))) {
          return true;
        }
      }
    }
    return false;
  })();

  // Step 4: Formatted print statement inside loop (print res, print(res), print(a + " x " + i + " = " + res), etc.)
  const hasFormattedPrint =
    !hasBreakBug &&
    !hasPrintOutsideBug &&
    (
      /print\s*\(?\s*(?:.*[nai].*|.*product.*|.*res.*|.*result.*|.*ans.*|.*output.*)\s*\)?/i.test(code) ||
      /print\s+(?:res|result|product|ans|output|[a-zA-Z_]\w*)/i.test(code) ||
      /console\.log\s*\(?\s*(?:.*[nai].*|.*product.*|.*res.*|.*result.*|.*ans.*)\s*\)?/i.test(code) ||
      /System\.out\.println\s*\(?\s*(?:.*[nai].*|.*product.*|.*res.*|.*result.*|.*ans.*)\s*\)?/i.test(code) ||
      /cout\s*<<\s*.*[nai].*/i.test(code) ||
      norm.includes('print res') || norm.includes('print(res)') ||
      norm.includes('print result') || norm.includes('print(result)') ||
      norm.includes('print product') || norm.includes('print(product)') ||
      norm.includes('print ans') || norm.includes('print(ans)')
    );

  const allVerified = hasInput && hasLoop && hasProductCalculation && hasFormattedPrint && !hasBreakBug && !hasPrintOutsideBug;

  const sampleCodeStepProgress: StepProgress[] = [
    { stepNumber: 1, title: 'Input variable declaration (var n = 5;)', completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: 'For loop iterating from 1 to 10 (for var i = 1; i <= 10; i++)', completed: hasLoop, current: hasInput && !hasLoop },
    { stepNumber: 3, title: 'Multiplication product calculation (var product = n * i;)', completed: hasProductCalculation, current: hasInput && hasLoop && !hasProductCalculation },
    { stepNumber: 4, title: 'Formatted print statement inside loop (print(n + " x " + i + " = " + product);)', completed: hasFormattedPrint, current: hasInput && hasLoop && hasProductCalculation && !hasFormattedPrint }
  ];

  // Specific bug feedbacks
  if (hasLoopStart0Bug) {
    return {
      hasInput,
      hasLoop: false,
      hasProductCalculation,
      hasFormattedPrint,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Table start bug! The loop starts at 0, printing `5 x 0 = 0`. Change loop initialization to **`var i = 1`**.",
      correction: "Change loop start to 1: 'for (var i = 1; i <= 10; i++)'.",
      suggestedInput: 'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  print(n + " x " + i + " = " + (n * i));\n}',
      matchedFirebaseInput: "var n = 5;\nfor (var i = 0; i <= 10; i++) {\n print(n + \" x \" + i + \" = \" + (n * i));\n}"
    };
  }

  if (hasLoopBoundBug) {
    return {
      hasInput,
      hasLoop: false,
      hasProductCalculation,
      hasFormattedPrint,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Boundary bug! `i < 10` stops at 9, missing the 10th row. Change condition to **`i <= 10`** (or `range(1, 11)` in Python) to include the 10th row.",
      correction: "Change loop condition to i <= 10: 'for (var i = 1; i <= 10; i++)'.",
      suggestedInput: 'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  print(n + " x " + i + " = " + (n * i));\n}',
      matchedFirebaseInput: "var n = 5;\nfor (var i = 1; i < 10; i++) {\n print(n + \" x \" + i + \" = \" + (n * i));\n}"
    };
  }

  if (hasAdditionBug) {
    return {
      hasInput,
      hasLoop,
      hasProductCalculation: false,
      hasFormattedPrint,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Calculation bug! `n + i` adds the numbers (giving 6, 7, 8...). Use **`n * i`** for multiplication!",
      correction: "Use multiplication: 'var product = n * i;'.",
      suggestedInput: 'var product = n * i;',
      matchedFirebaseInput: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n var ans = n + i;\n print(n + \" x \" + i + \" = \" + ans);\n}"
    };
  }

  if (hasOverwriteNBug) {
    return {
      hasInput,
      hasLoop,
      hasProductCalculation: false,
      hasFormattedPrint,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Variable overwrite bug! Modifying `n` inside the loop (`n = n * i`) changes the base table number exponentially! Keep `n` constant and multiply `n * i` into a separate `product` variable or directly in print.",
      correction: "Do not overwrite n. Use 'var product = n * i;'.",
      suggestedInput: 'var product = n * i;',
      matchedFirebaseInput: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n n = n * i;\n print(n);\n}"
    };
  }

  if (hasBreakBug) {
    return {
      hasInput,
      hasLoop,
      hasProductCalculation,
      hasFormattedPrint: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Loop termination bug! `break` stops the loop immediately after the 1st row. Remove `break` so the table runs completely up to 10!",
      correction: "Remove the 'break;' statement from inside the loop.",
      suggestedInput: 'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  print(n + " x " + i + " = " + (n * i));\n}',
      matchedFirebaseInput: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n print(n + \" x \" + i + \" = \" + (n * i));\n break;\n}"
    };
  }

  if (hasPrintOutsideBug) {
    return {
      hasInput,
      hasLoop,
      hasProductCalculation,
      hasFormattedPrint: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya note: Placement bug! Placing print outside the loop only displays the final product (50). Move print inside the loop block `{ ... }` to print all 10 lines!",
      correction: "Move the print statement inside the loop block.",
      suggestedInput: 'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + " x " + i + " = " + product);\n}',
      matchedFirebaseInput: "var n = 5;\nvar ans = 0;\nfor (var i = 1; i <= 10; i++) {\n ans = n * i;\n}\nprint(ans);"
    };
  }

  if (allVerified) {
    return {
      hasInput: true,
      hasLoop: true,
      hasProductCalculation: true,
      hasFormattedPrint: true,
      allVerified: true,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya here! You gotcha! You have successfully written the complete multiplication table prototype with proper iteration, calculation, and output formatting. Let's code!",
      correction: undefined,
      suggestedInput: undefined,
      matchedFirebaseInput: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n var product = n * i;\n print(n + \" x \" + i + \" = \" + product);\n}"
    };
  }

  // Progressive guidance
  if (!hasInput) {
    return {
      hasInput: false,
      hasLoop: false,
      hasProductCalculation: false,
      hasFormattedPrint: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maya here! Let's write the executable prototype. Start by declaring your table number variable:\n```javascript\nvar n = 5;\n```",
      correction: "Declare the input variable n.",
      suggestedInput: "var n = 5;"
    };
  }

  if (!hasLoop) {
    let loopFb = "🌟 Coach Maya here! No worries at all if you are unsure how to write the loop! Here is an example of how to write the loop from 1 to 10:\n\n💻 **JavaScript / C / Java:**\n```javascript\nfor (let i = 1; i <= 10; i++) {\n}\n```\n\n🐍 **Python:**\n```python\nfor i in range(1, 11):\n```\n\nTry adding this for loop right after your variable declaration!";
    if (attemptCount >= 3) {
      loopFb = "🌟 Coach Maya here! Let's get your table iterating! Here is the full structure for declaring the input and running the loop from 1 to 10:\n\n```javascript\nvar n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n}\n```\n\n👉 Add the loop and calculate the product inside!";
    } else if (attemptCount === 2) {
      loopFb = "🌟 Coach Maya checking in! We have our table number `n = 5`. Now write the `for` loop that counts `i` from 1 up to 10 (`i <= 10`).\n\n👉 Template: `for (let i = 1; i <= 10; i++)`";
    }

    return {
      hasInput: true,
      hasLoop: false,
      hasProductCalculation: false,
      hasFormattedPrint: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: loopFb,
      correction: "Write the for loop from 1 to 10: e.g., 'for (let i = 1; i <= 10; i++) {' or 'for i in range(1, 11):'.",
      suggestedInput: "for (let i = 1; i <= 10; i++) {\n}"
    };
  }

  if (!hasProductCalculation) {
    let prodFb = "🌟 Coach Maya here! You have defined your input and started your loop nicely! Now, inside the loop, where will you store the result of each multiplication? What variable and formula will hold the value of multiplying your input number with the loop counter `i` (e.g., `result = a * i;` or `var product = n * i;`)?";
    if (attemptCount >= 2) {
      prodFb = "🌟 Coach Maya checking back! Inside your loop body, calculate the product for each row using:\n`var product = n * i;` (or `var result = a * i;`)\n\nThis multiplies your table number by the current counter `i` on each turn!";
    }

    return {
      hasInput: true,
      hasLoop: true,
      hasProductCalculation: false,
      hasFormattedPrint: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: prodFb,
      correction: "Create a variable inside the loop to store the multiplication result: 'result = a * i;' (or 'var product = n * i;').",
      suggestedInput: "var result = a * i;"
    };
  }

  let printFb = '🌟 Coach Maya here! Finally, print the formatted table line inside the loop:\n```javascript\nprint(n + " x " + i + " = " + product);\n```';
  if (attemptCount >= 2) {
    printFb = '🌟 Coach Maya here! Almost done! Output your calculated product inside the loop:\n`print(n + " x " + i + " = " + product);` (or `console.log(n + " x " + i + " = " + product);`)';
  }

  return {
    hasInput: true,
    hasLoop: true,
    hasProductCalculation: true,
    hasFormattedPrint: false,
    allVerified: false,
    sampleCodeStepProgress,
    feedback: printFb,
    correction: "Print the table row inside the loop.",
    suggestedInput: 'print(n + " x " + i + " = " + product);'
  };
}
