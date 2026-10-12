export interface PositiveNegativeValidationResult {
  isFullyVerified: boolean;
  hasPositiveConcept: boolean;
  hasPositiveExample?: boolean;
  hasNegativeConcept: boolean;
  hasNegativeExample?: boolean;
  hasZeroConcept: boolean;
  hasComparisonWithZero: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
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

export interface PositiveNegativeSampleValidationResult {
  allVerified: boolean;
  hasInputVar: boolean;
  hasPositiveCheck: boolean;
  hasPositivePrint: boolean;
  hasNegativeCheck: boolean;
  hasNegativePrint: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  sampleCodeStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
}

/**
 * Validates the Logic stage for Positive or Negative Number (Problem 09)
 */
export function validatePositiveNegativeLogic(text: string): PositiveNegativeValidationResult {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.]/g, ' ').replace(/\s+/g, ' ').trim();

  // Positive logic rule check (greater than 0 / > 0 / above 0 / more than 0)
  const hasPositiveConcept =
    norm.includes('greater than 0') ||
    norm.includes('greater than zero') ||
    norm.includes('more than 0') ||
    norm.includes('more than zero') ||
    norm.includes('> 0') ||
    norm.includes('>0') ||
    norm.includes('above 0') ||
    norm.includes('above zero');

  // Check for positive example numbers (e.g. 1, 2, 3, 5, 10, etc.)
  const textWithoutSteps = norm.replace(/step\s*\d+/g, '').replace(/[><=]\s*0/g, '');
  const hasPositiveExample =
    /(?:positive|eg|e\.g|example|like|such as|values?)\s*(?:is|are|numbers?|like|:)?\s*.*?\b(?:[1-9]\d*)\b/i.test(norm) ||
    /\b(?:1|2|3|4|5|6|7|8|9|10|15|20|50|100)\b/.test(textWithoutSteps) ||
    norm.includes('e g 1') ||
    norm.includes('e g 5') ||
    norm.includes('eg 5') ||
    norm.includes('example 5') ||
    norm.includes('1 2 5') ||
    norm.includes('5 10') ||
    norm.includes('1 2 3');

  // Negative logic rule check (less than 0 / < 0 / below 0 / smaller than 0)
  const hasNegativeConcept =
    norm.includes('less than 0') ||
    norm.includes('less than zero') ||
    norm.includes('smaller than 0') ||
    norm.includes('smaller than zero') ||
    norm.includes('below 0') ||
    norm.includes('below zero') ||
    norm.includes('< 0') ||
    norm.includes('<0');

  // Check for negative example numbers (e.g. -1, -2, -3, -5, -10, etc.)
  const hasNegativeExample =
    /-\s*[1-9]\d*/.test(norm) ||
    /minus\s*[1-9]\d*/.test(norm) ||
    norm.includes('-1') ||
    norm.includes('-2') ||
    norm.includes('-3') ||
    norm.includes('-4') ||
    norm.includes('-5') ||
    norm.includes('-10') ||
    norm.includes('negative 1') ||
    norm.includes('negative 2') ||
    norm.includes('negative 5') ||
    norm.includes('negative 10') ||
    norm.includes('- 1') ||
    norm.includes('- 2') ||
    norm.includes('- 5');

  const hasZeroConcept =
    norm.includes('zero') ||
    norm.includes(' 0 ') ||
    norm.endsWith(' 0') ||
    norm.startsWith('0 ') ||
    norm.includes('neither');

  const hasComparisonWithZero =
    hasPositiveConcept ||
    hasNegativeConcept ||
    norm.includes('compare with 0') ||
    norm.includes('compare with zero');

  const isFullyVerified =
    hasPositiveConcept &&
    hasPositiveExample &&
    hasNegativeConcept &&
    hasNegativeExample;

  let feedback = undefined;
  if (isFullyVerified) {
    feedback = "Spot on! 🌟 Coach Maya here! You've explained the logic with clear rules and concrete examples: Numbers greater than 0 are Positive (e.g., 1, 2, 5) and numbers less than 0 are Negative (e.g., -1, -2, -5). Zero is neither positive nor negative. You've mastered the logic—proceed to Recipe!";
  } else if (hasPositiveExample && hasNegativeExample && !hasPositiveConcept && !hasNegativeConcept) {
    feedback = "Coach Maya here! You provided great example numbers for positive and negative! Now, what is the logical rule? How do we test whether any number is positive or negative by comparing it with 0 (e.g., numbers greater than 0 are positive, numbers less than 0 are negative)?";
  } else if (!hasPositiveConcept && !hasNegativeConcept) {
    feedback = "Coach Maya here! Let's understand positive and negative numbers. A number is tested by comparing it with 0. Can you explain what numbers are Positive (> 0) and what numbers are Negative (< 0), along with example numbers?";
  } else if (!hasPositiveConcept) {
    feedback = "Great start on negative numbers! Now, what is the rule for positive numbers (e.g., numbers greater than 0), and can you give an example?";
  } else if (!hasNegativeConcept) {
    feedback = "Great start on positive numbers! Now, what is the rule for negative numbers (e.g., numbers less than 0), and can you give an example?";
  } else if (!hasPositiveExample && !hasNegativeExample) {
    feedback = "Coach Maya here! You've got the concept right (greater than 0 is positive, less than 0 is negative)! Now to verify the logic, please provide concrete example numbers for both: What is an example of a positive number (e.g., 1, 2, 5), and what is an example of a negative number (e.g., -1, -2, -5)?";
  } else if (!hasPositiveExample) {
    feedback = "You've explained the rules and given a negative example! Now, can you give an example of a positive number (e.g., 1, 2, 5)?";
  } else if (!hasNegativeExample) {
    feedback = "You've explained the rules and given a positive example! Now, can you give an example of a negative number (e.g., -1, -2, -5)?";
  }

  return {
    isFullyVerified,
    hasPositiveConcept,
    hasPositiveExample,
    hasNegativeConcept,
    hasNegativeExample,
    hasZeroConcept,
    hasComparisonWithZero,
    feedback,
    correction: "Numbers greater than 0 are Positive (e.g., 1, 2, 5). Numbers less than 0 are Negative (e.g., -1, -2, -5). Zero (0) is neither.",
    suggestedInput: "Numbers greater than 0 are Positive (e.g. 1, 2, 5), and numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative.",
    matchedFirebaseInput: isFullyVerified ? "positive numbers are greater than 0 (e.g. 5) and negative numbers are less than 0 (e.g. -5)" : undefined
  };
}

/**
 * Validates the Recipe stage for Positive or Negative Number (Problem 09)
 */
export function validatePositiveNegativeRecipe(text: string): PositiveNegativeValidationResult {
  const cleanLines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Filter out pure confusion/question lines for step validation so questions don't trigger false completed steps
  const recipeLines = cleanLines.filter(line => {
    const l = line.toLowerCase();
    const isQuestion =
      l.includes('how to') ||
      l.includes('what') ||
      l.includes('dont know') ||
      l.includes("don't know") ||
      l.includes('did not know') ||
      l.includes('didnt know') ||
      l.includes('help me') ||
      l.includes('explain') ||
      l.includes('tell me') ||
      l.includes('doubt');
    if (isQuestion && !/^step\s*\d+/i.test(line)) {
      return false;
    }
    return true;
  });

  const recipeText = recipeLines.join(' ').toLowerCase().replace(/[^a-z0-9\s><=+\-:]/g, ' ').replace(/\s+/g, ' ').trim();
  const rawText = text.toLowerCase();

  // Check Step 1: Input step
  const hasInputStep =
    recipeLines.some(line => {
      const l = line.toLowerCase();
      return (l.includes('get') || l.includes('take') || l.includes('read') || l.includes('input') || l.includes('step 1')) &&
             (l.includes('input') || l.includes('number') || l.includes(' n ') || l.includes(' n') || l.includes('num') || l.includes('val'));
    }) ||
    recipeText.includes('get the input') ||
    recipeText.includes('get input') ||
    recipeText.includes('take input') ||
    recipeText.includes('step 1');

  // Check Step 2: Positive condition (> 0 or greater than 0)
  const hasPositiveCondition =
    (recipeText.includes('greater than 0') ||
     recipeText.includes('greater than zero') ||
     recipeText.includes('> 0') ||
     recipeText.includes('>0') ||
     recipeText.includes('more than 0') ||
     recipeText.includes('above 0')) &&
    (recipeText.includes('if') || recipeText.includes('check') || recipeText.includes('compare') || recipeText.includes('step 2') || recipeText.includes('when'));

  // Check Step 3: Explicit positive output display / statement
  const hasTrueOutput =
    recipeText.includes('display positive') ||
    recipeText.includes('print positive') ||
    recipeText.includes('show positive') ||
    recipeText.includes('output positive') ||
    recipeText.includes('say positive') ||
    recipeText.includes('if true display positive') ||
    recipeText.includes('if true print positive') ||
    recipeText.includes('it is positive') ||
    recipeText.includes('is positive') ||
    recipeText.includes('then positive') ||
    recipeText.includes('result is positive') ||
    (recipeText.includes('positive') && (recipeText.includes('display') || recipeText.includes('print') || recipeText.includes('show') || recipeText.includes('it is') || recipeText.includes('is') || recipeText.includes('then') || recipeText.includes('step 3') || recipeText.includes('step 2')));

  // Check Step 4: Explicit negative output display / else branch
  const hasFalseOutput =
    recipeText.includes('display negative') ||
    recipeText.includes('print negative') ||
    recipeText.includes('show negative') ||
    recipeText.includes('output negative') ||
    recipeText.includes('else display negative') ||
    recipeText.includes('else print negative') ||
    recipeText.includes('otherwise display negative') ||
    recipeText.includes('it is negative') ||
    recipeText.includes('is negative') ||
    recipeText.includes('then negative') ||
    recipeText.includes('else negative') ||
    recipeText.includes('otherwise negative') ||
    (recipeText.includes('step 4') && recipeText.includes('negative')) ||
    (recipeText.includes('else') && (recipeText.includes('display') || recipeText.includes('print') || recipeText.includes('negative') || recipeText.includes('it is') || recipeText.includes('is')));

  const isFullyVerified =
    hasInputStep &&
    hasPositiveCondition &&
    hasTrueOutput &&
    hasFalseOutput;

  const steps = [
    { stepNumber: 1, title: 'Step 1: Get input number n', completed: hasInputStep, current: !hasInputStep },
    { stepNumber: 2, title: 'Step 2: Check whether n is greater than 0', completed: hasPositiveCondition, current: hasInputStep && !hasPositiveCondition },
    { stepNumber: 3, title: 'Step 3: When greater than 0, show "Positive"', completed: hasTrueOutput, current: hasInputStep && hasPositiveCondition && !hasTrueOutput },
    { stepNumber: 4, title: 'Step 4: Otherwise, show "Negative"', completed: hasFalseOutput, current: hasInputStep && hasPositiveCondition && hasTrueOutput && !hasFalseOutput }
  ];

  const hasAskedHowToFind =
    rawText.includes('did not know') ||
    rawText.includes('how to find') ||
    rawText.includes('how to check') ||
    rawText.includes('how to test');

  let feedback = undefined;
  let correction = undefined;
  let suggestedInput = undefined;

  if (isFullyVerified) {
    feedback = "Kudos! 🌟 Coach Maya here! You have written a complete, crystal-clear step-by-step algorithm for checking positive or negative numbers. Proceed to Ingredients!";
    correction = "Proceed to Ingredients stage!";
  } else if (!hasInputStep) {
    feedback = "Coach Maya here! Let's build the recipe step-by-step! First, how do we get the number from the user? What is Step 1?";
    correction = "Step 1: Get input number n";
    suggestedInput = "Step 1: Get input number n";
  } else if (!hasPositiveCondition) {
    if (hasAskedHowToFind) {
      feedback = "Coach Maya here! Great start with Step 1 (Get the input)! To test whether the number is positive or negative, we compare it with 0: numbers greater than 0 are positive! How would you write Step 2 to check whether the number is greater than 0?";
    } else {
      feedback = "Coach Maya here! Great start with Step 1 (Get the input)! For Step 2, what step checks whether the number n is greater than 0?";
    }
    correction = "Step 2: Check whether n is greater than 0";
    suggestedInput = "Step 2: Check whether n is greater than 0";
  } else if (!hasTrueOutput) {
    feedback = "Coach Maya here! You have Step 1 and the comparison in Step 2. Now for Step 3: When that check is true, what message should we show to the user?";
    correction = "Step 3: When greater than 0, show 'Positive'";
    suggestedInput = "Step 3: When greater than 0, show 'Positive'";
  } else if (!hasFalseOutput) {
    feedback = "Coach Maya here! Excellent work! You have obtained the input and stated that numbers greater than 0 are Positive. Now for the final step: Otherwise, when the number is not greater than 0 (i.e. negative), what message should we show to the user?";
    correction = "Step 4: Otherwise, show 'Negative'";
    suggestedInput = "Step 4: Otherwise, show 'Negative'";
  }

  return {
    isFullyVerified,
    hasPositiveConcept: hasPositiveCondition,
    hasNegativeConcept: hasFalseOutput,
    hasZeroConcept: recipeText.includes('zero'),
    hasComparisonWithZero: hasPositiveCondition || hasFalseOutput,
    recipeStepProgress: steps,
    matchedFirebaseInput: isFullyVerified ? "step 1: get input number n\nstep 2: check whether n is greater than 0\nstep 3: when greater than 0 show positive\nstep 4: otherwise show negative" : undefined,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates the Ingredients stage for Positive or Negative Number (Problem 09)
 */
export function validatePositiveNegativeIngredients(text: string): PositiveNegativeValidationResult {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-:\.]/g, ' ').replace(/\s+/g, ' ').trim();

  // Find variable name dynamically if declared (e.g. 'var a=5', 'var a = 5', 'let x', 'var n', 'num = 5', 'a for input', etc.)
  const varMatch = text.match(/(?:var|let|const|int|declare|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) ||
                   text.match(/(?:var|let|const|int|variable|input)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i) ||
                   text.match(/step\s*1\s*:\s*(?:var|let|const|int|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i);
  const detectedVar = varMatch && varMatch[1] && !['step', 'if', 'else', 'var', 'let', 'const', 'what', 'how'].includes(varMatch[1].toLowerCase()) ? varMatch[1] : 'n';

  const hasVar =
    /(?:var|let|const|int)?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=/i.test(text) ||
    /\b(?:var|let|const|int|variable|input)\b/i.test(text) ||
    /\b(?:n|a|b|x|y|num|val|number)\b/i.test(norm) ||
    norm.includes('step 1') ||
    norm.includes('get input');

  // Left Side (L.S) check
  const hasLeftSide =
    norm.includes('l.s') ||
    norm.includes('l s') ||
    norm.includes('ls') ||
    norm.includes('left side') ||
    norm.includes('left') ||
    /[a-zA-Z_][a-zA-Z0-9_]*\s*[><=]/.test(text) ||
    norm.includes(`l.s: ${detectedVar.toLowerCase()}`) ||
    norm.includes(`l.s : ${detectedVar.toLowerCase()}`) ||
    norm.includes(`left: ${detectedVar.toLowerCase()}`) ||
    norm.includes('l.s: a') ||
    norm.includes('l.s: n') ||
    norm.includes('l.s: x');

  // Right Side (R.S) check
  const hasRightSide =
    norm.includes('r.s') ||
    norm.includes('r s') ||
    norm.includes('rs') ||
    norm.includes('right side') ||
    norm.includes('right') ||
    /[><=]\s*0/.test(norm) ||
    norm.includes('r.s: 0') ||
    norm.includes('r.s : 0') ||
    norm.includes('right: 0');

  // Operator check (> or < or ==)
  const isLessThan =
    norm.includes('operator:<') ||
    norm.includes('operator : <') ||
    norm.includes('operator: <') ||
    norm.includes('operator :<') ||
    norm.includes('less than') ||
    (norm.includes('<') && !norm.includes('<=') && !norm.includes('>'));

  const isGreaterThan =
    norm.includes('operator:>') ||
    norm.includes('operator : >') ||
    norm.includes('operator:> ') ||
    norm.includes('operator: >') ||
    norm.includes('greater than') ||
    (norm.includes('>') && !norm.includes('>=') && !norm.includes('<'));

  const hasOperator =
    norm.includes('operator') ||
    isLessThan ||
    isGreaterThan ||
    norm.includes('==');

  // Condition breakdown is verified when L.S, R.S and Operator are all explicitly addressed
  const hasConditionBreakdown =
    (hasLeftSide && hasRightSide && hasOperator) ||
    norm.includes(`l.s: ${detectedVar.toLowerCase()}, r.s: 0, operator: >`) ||
    norm.includes(`l.s: ${detectedVar.toLowerCase()}, r.s: 0, operator: <`) ||
    norm.includes('l.s: n, r.s: 0, operator: >') ||
    norm.includes('l.s: a, r.s: 0, operator: >') ||
    norm.includes('l.s: a, r.s: 0, operator: <') ||
    norm.includes('l.s : n, r.s : 0, operator : >') ||
    norm.includes('left side: n, right side: 0, operator: >') ||
    (/[a-zA-Z_][a-zA-Z0-9_]*\s*[><]\s*0/.test(text) && (norm.includes('l.s') || norm.includes('left') || norm.includes('operator')));

  const activeOpSymbol = isLessThan ? '<' : '>';
  const expectedIfOutput = isLessThan ? 'Negative' : 'Positive';
  const expectedElseOutput = isLessThan ? 'Positive' : 'Negative';

  // Inside 'if' operation check
  const hasInsideIf =
    (norm.includes(expectedIfOutput.toLowerCase()) && (norm.includes('print') || norm.includes('display') || norm.includes('show') || norm.includes('output') || norm.includes('if')));

  // Inside 'else' / 'else if' operation check
  const hasInsideElse =
    (norm.includes(expectedElseOutput.toLowerCase()) && (norm.includes('print') || norm.includes('display') || norm.includes('show') || norm.includes('output') || norm.includes('else')));

  const hasElseConditionAttempt =
    /step\s*4\s*:\s*else[\s\S]*?(?:left\s*side|l\.s|operator|right\s*side|r\.s)/i.test(text) ||
    /else\s*\(.*?\)/i.test(text) ||
    /(?:inside\s+)?else[\s\S]*?(?:l\.s|left\s*side|operator)/i.test(text);

  const hasValidInsideElse = hasInsideElse && !hasElseConditionAttempt;

  const isFullyVerified =
    hasVar &&
    hasConditionBreakdown &&
    hasInsideIf &&
    hasValidInsideElse;

  const steps = [
    { stepNumber: 1, title: `Step 1: Input variable (${detectedVar})`, completed: hasVar, current: !hasVar },
    { stepNumber: 2, title: `Step 2: If condition parts (L.S: ${detectedVar}, Operator: ${activeOpSymbol}, R.S: 0)`, completed: hasConditionBreakdown, current: hasVar && !hasConditionBreakdown },
    { stepNumber: 3, title: `Step 3: Inside 'if' block — print "${expectedIfOutput}"`, completed: hasInsideIf, current: hasVar && hasConditionBreakdown && !hasInsideIf },
    { stepNumber: 4, title: `Step 4: Inside 'else' block — print "${expectedElseOutput}"`, completed: hasValidInsideElse, current: hasVar && hasConditionBreakdown && hasInsideIf && !hasValidInsideElse }
  ];

  let feedback = undefined;
  let correction = undefined;
  let suggestedInput = undefined;

  if (isFullyVerified) {
    feedback = `Hurray! 🌟 Coach Maya here! You defined every required ingredient: Input variable ${detectedVar}, the complete if-condition breakdown (L.S: ${detectedVar}, Operator: ${activeOpSymbol}, R.S: 0), and the exact output operations inside the 'if' block (print '${expectedIfOutput}') and 'else' block (print '${expectedElseOutput}'). You are ready to proceed to Taste the Sample!`;
    correction = "Proceed to Taste the Sample!";
  } else if (!hasVar) {
    feedback = "Coach Maya here! Let's start with the first ingredient: We need an input variable (e.g., `Step 1: var a = 5` or `Step 1: Variable n to store input`) to hold our number.";
    correction = `Step 1: var ${detectedVar} = 5`;
    suggestedInput = `Step 1: var ${detectedVar} = 5`;
  } else if (!hasConditionBreakdown) {
    feedback = `Coach Maya here! Great start with variable \`${detectedVar}\`! For Step 2, we must break down the exact parts of the 'if' condition:\n• Left Side (L.S): ${detectedVar}\n• Right Side (R.S): 0\n• Operator: > (or <)\n\nCan you define the Left Side (L.S), Right Side (R.S), and Operator for checking if a number is positive or negative?`;
    correction = `Step 2: If condition with L.S: ${detectedVar}, Operator: >, R.S: 0`;
    suggestedInput = `Step 2: If condition with L.S: ${detectedVar}, Operator: >, R.S: 0`;
  } else if (!hasInsideIf) {
    if (isLessThan) {
      feedback = `Coach Maya here! Great job! You chose the \`<\` (less than) operator (\`${detectedVar} < 0\`). Since numbers less than 0 are Negative, when this condition is true, Step 3 inside the \`if\` block should print 'Negative'! What operation should execute inside the \`if\` block?`;
      correction = `Step 3: Inside 'if' block: print("Negative")`;
      suggestedInput = `Step 3: Inside 'if' block: print("Negative")`;
    } else {
      feedback = `Coach Maya here! You've got the condition breakdown for positive numbers (\`${detectedVar} > 0\`)! Now for Step 3: When that condition is true (number is greater than 0), what operation should execute inside the \`if\` block?`;
      correction = `Step 3: Inside 'if' block: print("Positive")`;
      suggestedInput = `Step 3: Inside 'if' block: print("Positive")`;
    }
  } else if (!hasValidInsideElse) {
    if (hasElseConditionAttempt) {
      feedback = `Coach Maya here! Notice a key rule in programming: The 'if' block requires a condition (Left Side, Right Side, Operator), but 'else' is a catch-all branch that does NOT take any condition (no Left Side, Right Side, or Operator)! When 'if' is false, 'else' runs automatically. Please remove the condition parts from Step 4 and only specify what to do inside 'else' (e.g. \`Step 4: Inside 'else' block: print("${expectedElseOutput}")\`).`;
      correction = `Step 4: Inside 'else' block: print("${expectedElseOutput}")`;
      suggestedInput = `Step 4: Inside 'else' block: print("${expectedElseOutput}")`;
    } else if (isLessThan) {
      feedback = `Coach Maya here! Almost there! You have defined \`${detectedVar} < 0\` and inside \`if: print("Negative")\`. Remember that 'else' does NOT have any condition—it runs automatically when 'if' is false! For Step 4, what operation should execute inside the 'else' block?`;
      correction = `Step 4: Inside 'else' block: print("Positive")`;
      suggestedInput = `Step 4: Inside 'else' block: print("Positive")`;
    } else {
      feedback = `Coach Maya here! Almost there! You've defined the variable, condition parts (\`${detectedVar} > 0\`), and inside \`if: print("Positive")\`. Remember that 'else' does NOT have any condition—it runs automatically when 'if' is false! For Step 4, what operation should execute inside the 'else' block?`;
      correction = `Step 4: Inside 'else' block: print("Negative")`;
      suggestedInput = `Step 4: Inside 'else' block: print("Negative")`;
    }
  }

  return {
    isFullyVerified,
    hasPositiveConcept: isLessThan ? hasInsideElse : hasInsideIf,
    hasNegativeConcept: isLessThan ? hasInsideIf : hasInsideElse,
    hasZeroConcept: norm.includes('zero'),
    hasComparisonWithZero: hasConditionBreakdown,
    ingredientsStepProgress: steps,
    matchedFirebaseInput: isFullyVerified ? `step 2 : If condition with L.S: ${detectedVar}, R.S: 0, Operator: ${activeOpSymbol}` : undefined,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates the Sample Code stage for Positive or Negative Number (Problem 09)
 */
export function validatePositiveNegativeSampleCode(text: string): PositiveNegativeSampleValidationResult {
  const norm = text.toLowerCase();

  // Find variable name dynamically
  const varMatch = text.match(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) ||
                   text.match(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*[><]/i);
  const detectedVar = varMatch && varMatch[1] && !['if', 'else', 'var', 'let', 'const', 'print', 'what', 'how'].includes(varMatch[1].toLowerCase()) ? varMatch[1] : 'a';

  const hasInputVar =
    /(?:var|let|const|int)?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*-?\d+/i.test(text) ||
    /[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*(?:int\s*\(\s*)?input/i.test(text);

  const isNegFirst = /if\s*\(?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*<\s*0/i.test(text) || /if\s*\(?\s*0\s*>\s*[a-zA-Z_][a-zA-Z0-9_]*/i.test(text);
  const isPosFirst = /if\s*\(?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*>\s*0/i.test(text) || /if\s*\(?\s*0\s*<\s*[a-zA-Z_][a-zA-Z0-9_]*/i.test(text);
  const hasCondition = isNegFirst || isPosFirst;

  // Extract 'if' block content and 'else' block content
  const ifBlockMatch = text.match(/if\s*\([^)]*\)\s*\{([^}]*)\}/i) || text.match(/if\s*[^:\n]+:\s*\n?\s*([^\n]+)/i);
  const ifBlockText = ifBlockMatch ? ifBlockMatch[1].toLowerCase() : '';

  const elseBlockMatch = text.match(/else\s*\{([^}]*)\}/i) || text.match(/else\s*:\s*\n?\s*([^\n]+)/i);
  const elseBlockText = elseBlockMatch ? elseBlockMatch[1].toLowerCase() : '';

  const hasElseBranch = /else\b/i.test(text);

  // If-branch print verification
  const ifPrintsNeg = /print.*negative/i.test(ifBlockText) || (ifBlockText.includes('negative') && !ifBlockText.includes('positive'));
  const ifPrintsPos = /print.*positive/i.test(ifBlockText) || (ifBlockText.includes('positive') && !ifBlockText.includes('negative'));
  const hasCorrectIfPrint = isNegFirst ? ifPrintsNeg : ifPrintsPos;

  // Else-branch print verification
  const elsePrintsNeg = /print.*negative/i.test(elseBlockText) || (elseBlockText.includes('negative') && !elseBlockText.includes('positive'));
  const elsePrintsPos = /print.*positive/i.test(elseBlockText) || (elseBlockText.includes('positive') && !elseBlockText.includes('negative'));
  const hasCorrectElsePrint = isNegFirst ? elsePrintsPos : elsePrintsNeg;

  // Detect duplicate/identical output bug (e.g. both printing "negative" or both printing "positive")
  const bothPrintNegative = ifPrintsNeg && elsePrintsNeg;
  const bothPrintPositive = ifPrintsPos && elsePrintsPos;
  const bothPrintSame = bothPrintNegative || bothPrintPositive;

  const allVerified =
    hasInputVar &&
    hasCondition &&
    hasCorrectIfPrint &&
    hasElseBranch &&
    hasCorrectElsePrint &&
    !bothPrintSame;

  const steps = [
    { stepNumber: 1, title: `Step 1: Declare input variable (var ${detectedVar} = 5)`, completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: `Step 2: Check condition (if ${detectedVar} ${isNegFirst ? '<' : '>'} 0)`, completed: hasCondition, current: hasInputVar && !hasCondition },
    { stepNumber: 3, title: `Step 3: Print "${isNegFirst ? 'Negative' : 'Positive'}" inside if block`, completed: hasCorrectIfPrint, current: hasInputVar && hasCondition && !hasCorrectIfPrint },
    { stepNumber: 4, title: 'Step 4: Else branch', completed: hasElseBranch, current: hasInputVar && hasCondition && hasCorrectIfPrint && !hasElseBranch },
    { stepNumber: 5, title: `Step 5: Print "${isNegFirst ? 'Positive' : 'Negative'}" inside else block`, completed: hasCorrectElsePrint && !bothPrintSame, current: hasInputVar && hasCondition && hasCorrectIfPrint && hasElseBranch && (!hasCorrectElsePrint || bothPrintSame) }
  ];

  if (allVerified) {
    const allDone = steps.map(s => ({ ...s, completed: true, current: false }));
    return {
      allVerified: true,
      hasInputVar,
      hasPositiveCheck: isPosFirst,
      hasPositivePrint: isNegFirst ? elsePrintsPos : ifPrintsPos,
      hasNegativeCheck: hasElseBranch,
      hasNegativePrint: isNegFirst ? ifPrintsNeg : elsePrintsNeg,
      matchedFirebaseInput: `var ${detectedVar} = 5; if (${detectedVar} ${isNegFirst ? '< 0' : '> 0'}) print("${isNegFirst ? 'Negative' : 'Positive'}"); else print("${isNegFirst ? 'Positive' : 'Negative'}");`,
      feedback: "🌟 Coach Maya here! You gotcha! 🎉 Outstanding prototype! You have successfully implemented the positive/negative checker with clean comparison logic and distinct conditional branches. You are ready to run and test!",
      sampleCodeStepProgress: allDone,
      correction: "Sample code prototype completed!",
      suggestedInput: undefined
    };
  }

  let feedback = undefined;
  let correction = undefined;
  let suggestedInput = undefined;

  if (!hasInputVar) {
    feedback = `Coach Maya here! Let's start with Step 1 of our sample code: Declare an input variable with a test number (e.g. \`var ${detectedVar} = 5;\`).`;
    correction = `var ${detectedVar} = 5;`;
    suggestedInput = `var ${detectedVar} = 5;`;
  } else if (!hasCondition) {
    feedback = `Coach Maya here! Great start with variable \`${detectedVar}\`! For Step 2: Check your condition (e.g. \`if (${detectedVar} > 0)\` for positive or \`if (${detectedVar} < 0)\` for negative).`;
    correction = `if (${detectedVar} > 0) {`;
    suggestedInput = `if (${detectedVar} > 0) {`;
  } else if (!hasCorrectIfPrint) {
    if (isNegFirst) {
      feedback = `Coach Maya here! Great job with \`if (${detectedVar} < 0)\`! Since numbers less than 0 are Negative, inside the if block you must display 'Negative': \`print("negative");\`.`;
      correction = `  print("negative");\n}`;
      suggestedInput = `  print("negative");\n}`;
    } else {
      feedback = `Coach Maya here! Great job with the \`if (${detectedVar} > 0)\` condition! Now for Step 3: Add the action inside the if block to display 'Positive': \`print("positive");\`.`;
      correction = `  print("positive");\n}`;
      suggestedInput = `  print("positive");\n}`;
    }
  } else if (!hasElseBranch) {
    feedback = "Coach Maya here! You've set up the 'if' condition and print! Now for Step 4: Add the `else` branch for when the condition is false.";
    correction = "else {";
    suggestedInput = "else {";
  } else if (bothPrintSame || !hasCorrectElsePrint) {
    if (isNegFirst && bothPrintNegative) {
      feedback = `Coach Maya here! Look closely at your branches: Both your \`if\` and \`else\` blocks are currently set to \`print("negative")\`! Since \`if (${detectedVar} < 0)\` already handles negative numbers, when that condition is false (the \`else\` branch), the number is positive. Please change the print statement inside \`else\` to: \`print("positive");\`.`;
      correction = `else {\n  print("positive");\n}`;
      suggestedInput = `else {\n  print("positive");\n}`;
    } else if (isPosFirst && bothPrintPositive) {
      feedback = `Coach Maya here! Look closely at your branches: Both your \`if\` and \`else\` blocks are currently set to \`print("positive")\`! Since \`if (${detectedVar} > 0)\` already handles positive numbers, when that condition is false (the \`else\` branch), the number is negative. Please change the print statement inside \`else\` to: \`print("negative");\`.`;
      correction = `else {\n  print("negative");\n}`;
      suggestedInput = `else {\n  print("negative");\n}`;
    } else {
      const expectedElseMsg = isNegFirst ? 'positive' : 'negative';
      feedback = `Coach Maya here! Inside your \`else\` block, remember to print the opposite case ('${expectedElseMsg}'): \`print("${expectedElseMsg}");\`.`;
      correction = `else {\n  print("${expectedElseMsg}");\n}`;
      suggestedInput = `else {\n  print("${expectedElseMsg}");\n}`;
    }
  }

  return {
    allVerified: false,
    hasInputVar,
    hasPositiveCheck: isPosFirst,
    hasPositivePrint: isNegFirst ? elsePrintsPos : ifPrintsPos,
    hasNegativeCheck: hasElseBranch,
    hasNegativePrint: isNegFirst ? ifPrintsNeg : elsePrintsNeg,
    sampleCodeStepProgress: steps,
    feedback,
    correction,
    suggestedInput
  };
}
