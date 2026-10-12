import { CTCStage } from '../types.js';

export interface FactorialStepProgress {
  stepNumber: number;
  title: string;
  completed: boolean;
  current: boolean;
}

export interface FactorialValidationResult {
  hasInput: boolean;
  hasAccumulator: boolean;
  hasLoop: boolean;
  hasProductUpdate: boolean;
  hasPrint: boolean;
  completedCount: number;
  allVerified: boolean;
  isSyntaxQuery?: boolean;
  detectedInputName?: string;
  detectedContainerName?: string;
  sampleCodeStepProgress?: FactorialStepProgress[];
  feedback: string;
  correction?: string;
  suggestedInput?: string;
}

/**
 * Checks multiplication equations in the text to verify arithmetic correctness and accumulation
 */
export function checkFactorialArithmetic(text: string): {
  hasEquations: boolean;
  equationsCount: number;
  allEquationsValid: boolean;
  hasAccumulationChain: boolean;
  finalProduct?: number;
} {
  const eqRegex = /(\d+)\s*[\*×x]\s*(\d+)\s*=\s*(\d+)/gi;
  const equations: Array<{ a: number; b: number; prod: number; raw: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = eqRegex.exec(text)) !== null) {
    const a = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    const prod = parseInt(match[3], 10);
    equations.push({ a, b, prod, raw: match[0] });
  }

  if (equations.length === 0) {
    return {
      hasEquations: false,
      equationsCount: 0,
      allEquationsValid: true,
      hasAccumulationChain: false
    };
  }

  const allEquationsValid = equations.every(eq => eq.a * eq.b === eq.prod);

  // Check if each subsequent equation uses the previous product (accumulation chain)
  let hasAccumulationChain = false;
  if (equations.length >= 2 && allEquationsValid) {
    let chainCount = 0;
    for (let i = 1; i < equations.length; i++) {
      const prevProd = equations[i - 1].prod;
      if (equations[i].a === prevProd || equations[i].b === prevProd) {
        chainCount++;
      }
    }
    if (chainCount >= equations.length - 1) {
      hasAccumulationChain = true;
    }
  }

  return {
    hasEquations: true,
    equationsCount: equations.length,
    allEquationsValid,
    hasAccumulationChain,
    finalProduct: equations[equations.length - 1]?.prod
  };
}

/**
 * Checks multi-term product expressions like 5*4*3*2*1=120, 1*2*3*4*5=120, 5!, etc.
 */
export function checkFactorialProductExpression(text: string): {
  hasValidProductChain: boolean;
  termsCount: number;
  calculatedProduct?: number;
  statedProduct?: number;
} {
  // Regex to match a chain of numbers multiplied together with optional = result
  // e.g. 5*4*3*2*1 = 120 or 1 * 2 * 3 * 4 * 5 = 120 or 5*4*3*2*1
  const chainRegex = /((?:\d+\s*[\*×x]\s*)+\d+)(?:\s*=\s*(\d+))?/gi;
  let match: RegExpExecArray | null;

  while ((match = chainRegex.exec(text)) !== null) {
    const expr = match[1];
    const statedResult = match[2] ? parseInt(match[2], 10) : undefined;
    const parts = expr.split(/[\*×x]/i).map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

    if (parts.length >= 2) {
      const calculatedProduct = parts.reduce((acc, curr) => acc * curr, 1);
      
      // Check if parts form consecutive descending or ascending sequence (e.g. 5,4,3,2,1 or 1,2,3,4,5)
      let isConsecutive = true;
      const isDescending = parts[0] > parts[1];
      for (let i = 1; i < parts.length; i++) {
        if (isDescending && parts[i - 1] - parts[i] !== 1) {
          isConsecutive = false;
          break;
        }
        if (!isDescending && parts[i] - parts[i - 1] !== 1) {
          isConsecutive = false;
          break;
        }
      }

      const endsNearOne = parts[parts.length - 1] === 1 || parts[parts.length - 1] === 2 || parts[0] === 1;

      if ((isConsecutive && endsNearOne) || parts.length >= 3) {
        if (statedResult !== undefined) {
          if (calculatedProduct === statedResult) {
            return {
              hasValidProductChain: true,
              termsCount: parts.length,
              calculatedProduct,
              statedProduct: statedResult
            };
          }
        } else {
          return {
            hasValidProductChain: true,
            termsCount: parts.length,
            calculatedProduct
          };
        }
      }
    }
  }

  // Also check expressions like 5! = 120, 4! = 24, 3! = 6, 0! = 1, 1! = 1
  const factNotationRegex = /(\d+)\s*!\s*=\s*(\d+)/gi;
  while ((match = factNotationRegex.exec(text)) !== null) {
    const n = parseInt(match[1], 10);
    const stated = parseInt(match[2], 10);
    const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
    if (fact(n) === stated) {
      return {
        hasValidProductChain: true,
        termsCount: n,
        calculatedProduct: stated,
        statedProduct: stated
      };
    }
  }

  return {
    hasValidProductChain: false,
    termsCount: 0
  };
}

/**
 * Extracts the user-specified input number N from input text (e.g. n=4, 4!, 4*3*2*1=24).
 * Defaults to 5 if no specific number is found.
 */
export function extractFactorialN(text: string): number {
  // Check for n=4, n = 4, N=4, input = 4, num = 4
  const nMatch = text.match(/(?:^|\b)(?:n|num|number|input)\s*[:=]\s*(\d+)/i);
  if (nMatch) {
    const parsed = parseInt(nMatch[1], 10);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }

  // Check for 4! or 4 !
  const factMatch = text.match(/(\d+)\s*!/);
  if (factMatch) {
    const parsed = parseInt(factMatch[1], 10);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }

  // Check for product chain like 4*3*2*1
  const chainMatch = text.match(/(\d+)\s*[\*×x]\s*(\d+)/);
  if (chainMatch) {
    const n1 = parseInt(chainMatch[1], 10);
    const n2 = parseInt(chainMatch[2], 10);
    const candidate = Math.max(n1, n2);
    if (candidate >= 1 && candidate <= 20) return candidate;
  }

  return 5;
}

export function getFactorialValue(n: number): number {
  let val = 1;
  for (let i = 1; i <= n; i++) val *= i;
  return val;
}

export function getFactorialFormula(n: number): string {
  const terms: number[] = [];
  for (let i = n; i >= 1; i--) terms.push(i);
  return `${terms.join('*')} = ${getFactorialValue(n)}`;
}

export function getFactorialStepByStepTrace(n: number): string {
  if (n <= 1) return `1*1=1`;
  const steps: string[] = [];
  let running = n;
  for (let i = n - 1; i >= 1; i--) {
    const nextVal = running * i;
    steps.push(`${running}*${i}=${nextVal}`);
    running = nextVal;
  }
  return steps.join('\n');
}

/**
 * Validates student logic for Factorial across natural variations and arithmetic multiplication traces.
 * CRITICAL CTC RULE: Requires step-by-step sequential accumulation trace (e.g. for n=4: 4*3=12, 12*2=24, 24*1=24),
 * not just a single-line formula (4*3*2*1=24).
 * DYNAMIC: Adapts all hints, feedback, and worked examples to the user's chosen input N (e.g. 4, 5, 3, etc.).
 */
export function validateFactorialLogic(text: string): {
  isFullyVerified: boolean;
  hasMultiplication: boolean;
  hasAccumulationTrace: boolean;
  hasStartFromOne: boolean;
  hasZeroSpecialCase: boolean;
  isOneLineDirectProduct: boolean;
  detectedN: number;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
} {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s*×=]/g, ' ');

  const userN = extractFactorialN(text);
  const formulaStr = getFactorialFormula(userN);
  const stepByStepStr = getFactorialStepByStepTrace(userN);
  const firstStep = userN >= 2 ? `${userN}*${userN - 1}=${userN * (userN - 1)}` : '1*1=1';
  const expectedFactVal = getFactorialValue(userN);

  const hasMultiplication = norm.includes('multiply') || norm.includes('product') || norm.includes('*') || norm.includes('×') || norm.includes('into');
  const hasStartFromOne = norm.includes('start with 1') || norm.includes('start fact with 1') || norm.includes('from 1') || norm.includes('fact = 1') || norm.includes('product = 1') || norm.includes('1 to n') || norm.includes(`1 to ${userN}`) || norm.includes('1 to 5');
  const hasZeroSpecialCase = norm.includes('0! = 1') || norm.includes('0 factorial is 1') || norm.includes('zero factorial');

  // Ascending accumulation traces (1*2=2, 2*3=6, 6*4=24, 24*5=120)
  const hasAscendingTrace = (
    (/1\s*[\*×]\s*1\s*=\s*1/i.test(text) || /1\s*[\*×]\s*2\s*=\s*2/i.test(text)) &&
    (/2\s*[\*×]\s*3\s*=\s*6/i.test(text) || /6\s*[\*×]\s*4\s*=\s*24/i.test(text) || /24\s*[\*×]\s*5\s*=\s*120/i.test(text))
  );

  // Descending accumulation traces (e.g. 5*4=20, 20*3=60... OR 4*3=12, 12*2=24...)
  const hasDescendingTrace = (
    (/5\s*[\*×]\s*4\s*=\s*20/i.test(text) || /4\s*[\*×]\s*3\s*=\s*12/i.test(text) || /3\s*[\*×]\s*2\s*=\s*6/i.test(text)) &&
    (/20\s*[\*×]\s*3\s*=\s*60/i.test(text) || /12\s*[\*×]\s*2\s*=\s*24/i.test(text) || /6\s*[\*×]\s*1\s*=\s*6/i.test(text) || /60\s*[\*×]\s*2\s*=\s*120/i.test(text) || /120\s*[\*×]\s*1\s*=\s*120/i.test(text) || /24\s*[\*×]\s*1\s*=\s*24/i.test(text))
  );

  const arith = checkFactorialArithmetic(text);
  const prodChain = checkFactorialProductExpression(text);
  
  // Step-by-step accumulation is verified when multiple consecutive operations are traced
  const hasStepByStepTrace = hasAscendingTrace || hasDescendingTrace || (arith.hasEquations && arith.hasAccumulationChain && arith.allEquationsValid && arith.equationsCount >= 2);

  // Verbal explanations describing sequential multiplication of previous result with next number
  const hasVerbalAccumulationLogic = (
    (norm.includes('multiply') || norm.includes('product')) &&
    (
      (norm.includes('first two') && (norm.includes('result') || norm.includes('next number'))) ||
      (norm.includes('result') && (norm.includes('next number') || norm.includes('next'))) ||
      (norm.includes('previous') && norm.includes('next')) ||
      (norm.includes('one by one') && (norm.includes('1 to') || norm.includes('multiply'))) ||
      (norm.includes('each number') && norm.includes('multiply')) ||
      (norm.includes('multiply all numbers') || norm.includes('multiply 1 to'))
    )
  );

  // Detect single-line expansion without step-by-step breakdown (e.g. 5*4*3*2*1=120 or 4*3*2*1=24 or 5!=120)
  const isOneLineDirectProduct = prodChain.hasValidProductChain && !hasStepByStepTrace && !hasVerbalAccumulationLogic;

  let isFullyVerified = false;
  let feedback: string | undefined;
  let correction: string | undefined;
  let suggestedInput: string | undefined;

  if (hasStepByStepTrace || hasVerbalAccumulationLogic) {
    isFullyVerified = true;
    feedback = `🎉 Logic Approved! Spot on! You've clearly demonstrated how factorial accumulates step by step (reaching ${expectedFactVal} for n=${userN}). You are ready to proceed to the Recipe stage!`;
    correction = "Proceed to the Recipe stage to write the step-by-step algorithm.";
  } else if (isOneLineDirectProduct) {
    isFullyVerified = false;
    feedback = `Great start! While ${formulaStr} is mathematically true, in programming a computer cannot multiply all numbers at once in a single step! It calculates the product step by step using a loop and a running total. Can you break this down for n=${userN} into sequential multiplications (e.g., starting with ${firstStep}, then multiplying that result by the next number)?`;
    correction = `Break down ${userN}! into step-by-step multiplications showing how each previous result multiplies with the next number.`;
    suggestedInput = stepByStepStr;
  } else {
    isFullyVerified = false;
    feedback = `To find the factorial of ${userN} (${userN}!), how does a computer multiply the numbers step by step to reach ${expectedFactVal}? Try showing the sequential calculations (e.g. starting with ${firstStep}...).`;
    correction = `Write the sequential multiplication steps starting from ${firstStep}.`;
    suggestedInput = stepByStepStr;
  }

  return {
    isFullyVerified,
    hasMultiplication,
    hasAccumulationTrace: hasStepByStepTrace,
    hasStartFromOne,
    hasZeroSpecialCase,
    isOneLineDirectProduct,
    detectedN: userN,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates step-by-step algorithm recipe for Factorial with atomic 4-step tracking
 * Step 1: Accept a number as input
 * Step 2: Generate all numbers from 1 up to the input number (or from input down to 1)
 * Step 3: Multiply each generated number with the factorial variable
 * Step 4: Print the final factorial value
 */
export function validateFactorialRecipe(text: string): {
  isFullyVerified: boolean;
  hasInput: boolean;
  hasGenerateNumbers: boolean;
  hasMultiplyEach: boolean;
  hasPrint: boolean;
  stepCount: number;
  recipeStepProgress: Array<{
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }>;
  currentMissingStep: number;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
} {
  const norm = text.toLowerCase();

  // Step 1: Accept/Get input
  const hasInput = (
    /(accept|get|read|take|receive|read|input)\s*(a\s*)?(number|input|value|n\b)/i.test(norm) ||
    /input\s*\(/i.test(norm) ||
    norm.includes('get the input') ||
    norm.includes('accept a number') ||
    norm.includes('get input') ||
    (/step\s*1/i.test(norm) && (norm.includes('input') || norm.includes('number')))
  );

  // Step 2: Generate numbers from 1 up to input (or from input down to 1)
  // MUST explicitly state generating the sequence or repeating through all numbers
  const hasGenerateNumbers = (
    /(generate|create|list|count|get)\s*(all\s*)?numbers\s*(from\s*)?(1\s*(up\s*)?to|input\s*(number\s*)?(down\s*)?to\s*1|n\s*(down\s*)?to\s*1)/i.test(norm) ||
    /generate\s*(all\s*)?numbers?\s*(from\s*)?1\s*(up\s*)?to\s*(the\s*)?(input|n)/i.test(norm) ||
    /numbers?\s*(from\s*)?1\s*(up\s*)?to\s*(the\s*)?(input|n)/i.test(norm) ||
    /numbers?\s*from\s*(the\s*)?input\s*(number\s*)?(down\s*to|to)\s*1/i.test(norm) ||
    /(repeat|iterate|loop)\s*(for\s*)?(each|all)?\s*numbers?\s*(from\s*1|from\s*input|until\s*1|until\s*n|up\s*to\s*input|up\s*to\s*n)/i.test(norm) ||
    norm.includes('generate all numbers from 1 up to the input') ||
    norm.includes('generate all numbers from 1 to input') ||
    norm.includes('generate numbers from input to 1') ||
    norm.includes('generate all numbers') ||
    norm.includes('repeat from 1 to n') ||
    norm.includes('repeat until reaching 1') ||
    norm.includes('repeat until reaching n') ||
    norm.includes('count from 1 to n')
  );

  // Step 3 (2.1): Multiply each generated number with the factorial variable / previous output
  const hasMultiplyEach = (
    /(multiply|times)\s*(each|every)\s*(generated\s*)?number\s*(with|to|into)\s*(the\s*)?(factorial|fact|product|result|variable)/i.test(norm) ||
    /multiply\s*each\s*(generated\s*)?number/i.test(norm) ||
    /multiply\s*(all\s*)?the\s*numbers\s*with\s*(the\s*)?(factorial|fact|result)/i.test(norm) ||
    /(multiply|multiplication)\s+.*?\b(previous|prior|accumulated|running)\b.*?\b(output|result|product|value|step)\b/i.test(norm) ||
    /(multiply|multiplication)\s+.*?\b(next|current|generated)\s+(?:number|numbers)\b/i.test(norm) ||
    /(multiply|multiplication)\s+(?:the\s+)?previous\b/i.test(norm) ||
    /(do|perform)\s+multiplication\b/i.test(norm) ||
    /multiplication\s+(?:from|of|between)\s+(?:generated\s+)?numbers/i.test(norm) ||
    norm.includes('multiply the previous step output with the next number') ||
    norm.includes('multiply previous step output') ||
    norm.includes('multiply the previous') ||
    norm.includes('do multiplication from generated numbers') ||
    norm.includes('do multiplication') ||
    norm.includes('multiply each generated number with the factorial variable') ||
    norm.includes('multiply each generated number') ||
    norm.includes('multiply each number with the factorial variable') ||
    norm.includes('multiply each number with fact') ||
    norm.includes('multiply each number') ||
    norm.includes('multiply the result with each number') ||
    norm.includes('fact = fact * i') ||
    norm.includes('fact = fact *')
  );

  // Step 4 (3): Print final factorial value / final answer / output
  const hasPrint = (
    /(print|display|show|output)\s*(the\s*)?(final\s*)?(factorial|fact|result|value|output|answer)/i.test(norm) ||
    /(print|display|show|output)\s+.*?\b(answer|result|factorial|fact|value|output)\b/i.test(norm) ||
    norm.includes('print the final answer as output') ||
    norm.includes('print the final answer') ||
    norm.includes('final answer as output') ||
    norm.includes('print the final factorial value') ||
    norm.includes('print final factorial') ||
    norm.includes('print fact') ||
    norm.includes('display the final value') ||
    norm.includes('display final result') ||
    norm.includes('print the result') ||
    norm.includes('output the result') ||
    norm.includes('print the answer') ||
    norm.includes('print final answer')
  );

  const step1Done = hasInput;
  const step2Done = step1Done && hasGenerateNumbers;
  const step3Done = step1Done && step2Done && hasMultiplyEach;
  const step4Done = step1Done && step2Done && step3Done && hasPrint;

  const completedCount = [step1Done, step2Done, step3Done, step4Done].filter(Boolean).length;
  const isFullyVerified = step1Done && step2Done && step3Done && step4Done;

  let currentMissingStep = 1;
  if (!step1Done) currentMissingStep = 1;
  else if (!step2Done) currentMissingStep = 2;
  else if (!step3Done) currentMissingStep = 3;
  else if (!step4Done) currentMissingStep = 4;
  else currentMissingStep = 5;

  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Accept a number as input",
      completed: step1Done,
      current: currentMissingStep === 1
    },
    {
      stepNumber: 2,
      title: "Generate all numbers from 1 up to the input number",
      completed: step2Done,
      current: currentMissingStep === 2
    },
    {
      stepNumber: 3,
      title: "Multiply each generated number with the factorial variable",
      completed: step3Done,
      current: currentMissingStep === 3
    },
    {
      stepNumber: 4,
      title: "Print the final factorial value",
      completed: step4Done,
      current: currentMissingStep === 4
    }
  ];

  let feedback: string | undefined;
  let correction: string | undefined;
  let suggestedInput: string | undefined;

  if (currentMissingStep === 1) {
    feedback = "Let's start our Factorial recipe! What is the very first step we need before we can calculate anything? Write Step 1 to get the input number.";
    correction = "Write Step 1: Accept a number as input.";
    suggestedInput = "Step 1: Accept a number as input";
  } else if (currentMissingStep === 2) {
    feedback = "You have captured the input number in Step 1! Next, before repeating the multiplication, we need to generate all the numbers from 1 up to the input number (or from the input number down to 1). How would you write Step 2 in everyday words?";
    correction = "Write Step 2: Generate all numbers from 1 up to the input number (or from input down to 1).";
    suggestedInput = "Step 2: Generate all numbers from 1 up to the input number";
  } else if (currentMissingStep === 3) {
    feedback = "Great! You have accepted the input (Step 1) and generated the sequence of numbers (Step 2). Now, while generating each number, what action must be performed to multiply each number into the factorial variable?";
    correction = "Write Step 2.1 / Step 3: Multiply each generated number with the factorial variable.";
    suggestedInput = "Step 2.1: Multiply each generated number with the factorial variable";
  } else if (currentMissingStep === 4) {
    feedback = "Superb! You have accepted the input, generated all numbers, and multiplied each number with the factorial variable. Once all numbers are multiplied, what should the computer do with the final factorial value?";
    correction = "Write Step 3: Print the final factorial value.";
    suggestedInput = "Step 3: Print the final factorial value";
  } else {
    feedback = "🎉 Recipe Verified! Kudos! You've sequenced all the steps of the Factorial algorithm in plain English. Proceed to the Ingredients stage!";
    correction = "Proceed to Ingredients to identify variables and programming constructs.";
  }

  return {
    isFullyVerified,
    hasInput: step1Done,
    hasGenerateNumbers: step2Done,
    hasMultiplyEach: step3Done,
    hasPrint: step4Done,
    stepCount: completedCount,
    recipeStepProgress,
    currentMissingStep,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates Ingredients for Factorial (5 atomic steps):
 * Step 1: Input variable n
 * Step 2: Container / accumulator variable fact = 1 (NOT 0)
 * Step 3: Loop construct: for loop or while loop
 * Step 4: Loop controls: start = 1, end = n, next step = +1 (or start = n, end = 1, next step = -1)
 * Step 5: Factorial update inside loop: fact = fact * i
 */
export function validateFactorialIngredients(text: string): {
  isFullyVerified: boolean;
  hasInputVar: boolean;
  hasFactInitial: boolean;
  hasZeroFactMistake: boolean;
  hasLoopConstruct: boolean;
  hasLoopControls: boolean;
  hasLoopControlMistake?: boolean;
  hasSameStartStop?: boolean;
  hasLoopDirectionMistake?: boolean;
  hasWrongStopMistake?: boolean;
  hasMultiplyOperator: boolean;
  hasAdditionMistake: boolean;
  hasPrintStatement: boolean;
  currentMissingStep: number;
  ingredientsStepProgress: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
} {
  const norm = text.toLowerCase();

  // Detect input variable name (e.g. 'Step 1:Variable b=5' -> 'b', 'Step 1: n' -> 'n')
  let detectedInputName = 'n';
  const step1VarMatch = text.match(/(?:step\s*1[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*(?:=\s*\d+|for\s+input)?)/i);
  if (step1VarMatch && step1VarMatch[1] && !['variable', 'input', 'get', 'accept', 'the', 'one', 'num'].includes(step1VarMatch[1].toLowerCase())) {
    detectedInputName = step1VarMatch[1];
  } else {
    const genericVarMatch = text.match(/\b([a-z_]\w*)\s*=\s*\d+\b/i);
    if (genericVarMatch && genericVarMatch[1] && !['fact', 'variable', 'sum'].includes(genericVarMatch[1].toLowerCase())) {
      detectedInputName = genericVarMatch[1];
    }
  }

  const hasInputVar = (
    /\b[anxy]\b/i.test(text) ||
    norm.includes('input variable') ||
    norm.includes('get one input variable') ||
    norm.includes('input number') ||
    norm.includes('variable for input') ||
    norm.includes('accept a number') ||
    norm.includes('read input') ||
    norm.includes('get input') ||
    norm.includes('variable a') ||
    norm.includes('variable n') ||
    norm.includes(`variable ${detectedInputName.toLowerCase()}`) ||
    (/\bstep\s*1\b/i.test(norm) && (norm.includes('input') || norm.includes('variable') || norm.includes('number') || /\b[a-z]\b/.test(norm)))
  );

  // Detect container variable name (e.g. 'step 2:Variable a=1' -> 'a', 'Step 2: fact = 1' -> 'fact')
  let detectedContainerName = 'fact';
  const step2VarMatch = text.match(/(?:step\s*2[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*=\s*(\d+))/i) ||
                        text.match(/(?:(?:variable\s+)?([a-z_]\w*)\s*=\s*0\b)/i);
  if (step2VarMatch && step2VarMatch[1] && !['variable', 'container', 'accumulator'].includes(step2VarMatch[1].toLowerCase())) {
    detectedContainerName = step2VarMatch[1];
  }

  const hasZeroFactMistake = (
    /fact\s*=\s*0\b/i.test(text) ||
    new RegExp(`\\b(?:variable\\s+)?${detectedContainerName}\\s*=\\s*0\\b`, 'i').test(text) ||
    /\b(?:variable\s+)?[a-z_]\w*\s*=\s*0\b/i.test(text) ||
    /\bstep\s*2[^\n]*?[=:]\s*0\b/i.test(norm) ||
    norm.includes('container variable stores 0') ||
    norm.includes('stores 0') ||
    norm.includes('stores zero') ||
    norm.includes('initialized to 0') ||
    norm.includes('initial value 0') ||
    norm.includes('b=0') ||
    norm.includes('b = 0')
  );

  const hasFactInitial = !hasZeroFactMistake && (
    /fact\s*=\s*1\b/i.test(text) ||
    new RegExp(`\\b(?:variable\\s+)?${detectedContainerName}\\s*=\\s*1\\b`, 'i').test(text) ||
    /\b(?:variable\s+)?[a-z_]\w*\s*=\s*1\b/i.test(text) ||
    norm.includes('container variable it stores the 1') ||
    norm.includes('container variable it stores 1') ||
    norm.includes('container variable stores 1') ||
    (norm.includes('container variable') && (norm.includes(' 1') || norm.includes(' one'))) ||
    norm.includes('stores 1') ||
    norm.includes('stores the 1') ||
    norm.includes('initialized to 1') ||
    norm.includes('initial value 1') ||
    norm.includes('start fact 1') ||
    norm.includes('accumulator fact = 1') ||
    (/\bstep\s*2[^\n]*?(?:=\s*1\b|stores\s*1\b|initial\s*(?:value\s*)?1\b|\bone\b)/i.test(norm))
  );

  const hasLoopConstruct = (
    norm.includes('for loop') ||
    norm.includes('while loop') ||
    norm.includes('use for loop') ||
    norm.includes('use while loop') ||
    /\bloop\s*construct\b/i.test(norm) ||
    (/\bstep\s*3\b/i.test(norm) && (norm.includes('loop') || norm.includes('for') || norm.includes('while')))
  );

  // --- Strict Loop Controls Parsing & Validation ---
  // Extract start value (e.g. 'Start:b', 'Start: 1', 'start = 1', 'from 1')
  const startMatch = norm.match(/(?:start|from|i\s*=)\s*[:=]?\s*([a-z0-9_]+)/i);
  const rawStart = startMatch ? startMatch[1].toLowerCase() : null;

  // Extract stop/end value (e.g. 'Stop:b', 'Stop: 1', 'end = n', 'to n')
  const stopMatch = norm.match(/(?:stop|end|i\s*<=|i\s*>=)\s*[:=]?\s*([a-z0-9_]+)/i);
  const rawStop = stopMatch ? stopMatch[1].toLowerCase() : null;

  // Extract next step / step size (ensure we don't accidentally match 'step 1', 'step 2', etc.)
  const nextStepMatch = norm.match(/(?:next\s*step|step\s*size)\s*[:=]?\s*([^\n,]+)/i) ||
                        norm.match(/(?:^|\n|\s)step\s*[:=]\s*([^\n,]+)/i);
  const rawNextStep = nextStepMatch ? nextStepMatch[1].toLowerCase().trim() : null;

  // Loop control mistakes:
  // 1) Identical start and stop: e.g. Start:b, Stop:b or Start:1, Stop:1
  const hasSameStartStop = Boolean(rawStart && rawStop && rawStart === rawStop);

  const isDescendingCandidate = Boolean(
    rawStart === detectedInputName.toLowerCase() ||
    rawStart === 'n' ||
    (rawStart !== null && !isNaN(Number(rawStart)) && Number(rawStart) > 1) ||
    (rawNextStep !== null && (rawNextStep.includes('--') || rawNextStep.includes('-1') || rawNextStep.includes('dec') || rawNextStep.includes('sub')))
  );

  const isAscendingCandidate = Boolean(
    rawStart === '1' ||
    rawStart === '2' ||
    (rawNextStep !== null && (rawNextStep.includes('++') || rawNextStep.includes('+1') || rawNextStep.includes('inc') || rawNextStep.includes('add')))
  );

  let hasLoopDirectionMistake = false;
  let hasWrongStopMistake = false;

  if (rawStart && rawStop && rawNextStep && !hasSameStartStop) {
    if (isDescendingCandidate) {
      if (rawNextStep.includes('++') || rawNextStep.includes('+1') || rawNextStep.includes('inc') || rawNextStep.includes('add')) {
        hasLoopDirectionMistake = true;
      }
      if (rawStop !== '1' && rawStop !== '2') {
        hasWrongStopMistake = true;
      }
    } else if (isAscendingCandidate) {
      if (rawNextStep.includes('--') || rawNextStep.includes('-1') || rawNextStep.includes('dec') || rawNextStep.includes('sub')) {
        hasLoopDirectionMistake = true;
      }
      if (rawStop !== detectedInputName.toLowerCase() && rawStop !== 'n' && isNaN(Number(rawStop))) {
        hasWrongStopMistake = true;
      }
    }
  }

  const hasLoopControlMistake = hasSameStartStop || hasLoopDirectionMistake || hasWrongStopMistake;

  const hasValidAscendingControls = Boolean(
    rawStart &&
    (rawStart === '1' || rawStart === '2') &&
    rawStop &&
    (rawStop === detectedInputName.toLowerCase() || rawStop === 'n' || (!isNaN(Number(rawStop)) && Number(rawStop) > 1)) &&
    rawNextStep &&
    (rawNextStep.includes('+') || rawNextStep.includes('++') || rawNextStep.includes('inc') || rawNextStep.includes('add'))
  );

  const hasValidDescendingControls = Boolean(
    rawStart &&
    (rawStart === detectedInputName.toLowerCase() || rawStart === 'n' || (!isNaN(Number(rawStart)) && Number(rawStart) > 1)) &&
    rawStop &&
    (rawStop === '1' || rawStop === '2') &&
    rawNextStep &&
    (rawNextStep.includes('-') || rawNextStep.includes('--') || rawNextStep.includes('dec') || rawNextStep.includes('sub'))
  );

  const hasStandardLoopSyntax = (
    /\bfrom\s*1\s*(?:up\s*)?to\s*(?:n|[a-z_]\w*|\d+)\b/i.test(norm) ||
    /\bfrom\s*(?:n|[a-z_]\w*|\d+)\s*down\s*to\s*1\b/i.test(norm) ||
    /\brange\s*\(\s*1\s*,\s*(?:n|[a-z_]\w*|\d+)/i.test(norm) ||
    /\bi\s*=\s*1\b.*\bi\s*<=\s*(?:n|[a-z_]\w*|\d+)\b.*\b(?:i\+\+|\+\+i|i\s*\+=\s*1)\b/i.test(norm) ||
    /\bi\s*=\s*(?:n|[a-z_]\w*|\d+)\b.*\bi\s*>=\s*1\b.*\b(?:i--|--i|i\s*-=\s*1)\b/i.test(norm)
  );

  const hasLoopControls = !hasLoopControlMistake && (
    hasValidAscendingControls ||
    hasValidDescendingControls ||
    hasStandardLoopSyntax
  );

  const hasAdditionMistake = (
    /fact\s*=\s*fact\s*\+\s*i/i.test(text) ||
    new RegExp(`${detectedContainerName}\\s*=\\s*${detectedContainerName}\\s*\\+\\s*i`, 'i').test(text) ||
    /fact\s*\+=/i.test(text) ||
    norm.includes('addition operator') ||
    (norm.includes('sum =') && !norm.includes('fact ='))
  );

  const hasMultiplyOperator = !hasAdditionMistake && (
    /fact\s*=\s*fact\s*[\*×]\s*i/i.test(text) ||
    new RegExp(`${detectedContainerName}\\s*=\\s*${detectedContainerName}\\s*[\\*×]\\s*i`, 'i').test(text) ||
    /fact\s*\*=/i.test(text) ||
    new RegExp(`${detectedContainerName}\\s*\\*=`, 'i').test(text) ||
    /fact\s*=\s*fact\s*[\*×]\s*(?:num|number|current)/i.test(text) ||
    norm.includes('fact = fact * i') ||
    norm.includes('fact = fact *') ||
    norm.includes(`${detectedContainerName} = ${detectedContainerName} *`) ||
    norm.includes('multiply container variable with') ||
    norm.includes('multiply container with current number') ||
    norm.includes('multiply each number with fact') ||
    norm.includes('multiplication operator') ||
    (/\bstep\s*5\b/i.test(norm) && (norm.includes('multiply') || norm.includes('*') || norm.includes('fact') || norm.includes('product')))
  );

  const hasPrintStatement = (
    norm.includes('print') ||
    norm.includes('display') ||
    norm.includes('show') ||
    norm.includes('output') ||
    norm.includes('console.log') ||
    norm.includes('system.out') ||
    norm.includes('printf') ||
    norm.includes('cout') ||
    norm.includes('echo') ||
    (/\bstep\s*6\b/i.test(norm) && (norm.includes('result') || norm.includes('fact') || norm.includes('value') || norm.includes('print') || norm.includes('display') || norm.includes('final')))
  );

  let currentMissingStep = 1;
  if (!hasInputVar) currentMissingStep = 1;
  else if (!hasFactInitial) currentMissingStep = 2;
  else if (!hasLoopConstruct) currentMissingStep = 3;
  else if (!hasLoopControls) currentMissingStep = 4;
  else if (!hasMultiplyOperator) currentMissingStep = 5;
  else if (!hasPrintStatement) currentMissingStep = 6;
  else currentMissingStep = 7;

  const ingredientsStepProgress = [
    { stepNumber: 1, title: `Input Variable: ${detectedInputName}`, completed: hasInputVar, current: currentMissingStep === 1 },
    { stepNumber: 2, title: `Container Variable: ${detectedContainerName} = 1`, completed: hasFactInitial, current: currentMissingStep === 2 },
    { stepNumber: 3, title: 'Loop Construct: for / while loop', completed: hasLoopConstruct, current: currentMissingStep === 3 },
    { stepNumber: 4, title: 'Loop Controls: start = 1, end = n, next step = +1', completed: hasLoopControls, current: currentMissingStep === 4 },
    { stepNumber: 5, title: `Factorial Update: ${detectedContainerName} = ${detectedContainerName} * i`, completed: hasMultiplyOperator, current: currentMissingStep === 5 },
    { stepNumber: 6, title: `Display Output: print(${detectedContainerName})`, completed: hasPrintStatement, current: currentMissingStep === 6 }
  ];

  let feedback: string | undefined;
  let correction: string | undefined;
  let suggestedInput: string | undefined;

  if (hasZeroFactMistake) {
    feedback = `🌟 Coach Maya here! Look closely at Step 2 where \`${detectedContainerName} = 0\`. In Factorial, we are calculating a continuous product by multiplying each number into this container. If we start multiplying from 0, what happens? (e.g. 0 × 1 = 0, 0 × 2 = 0)—the entire result is wiped out to zero! What initial number should \`${detectedContainerName}\` start with so our multiplications work correctly?`;
    correction = `Initialize ${detectedContainerName} to 1 instead of 0.`;
    suggestedInput = `Step 2: ${detectedContainerName} = 1 (container variable)`;
  } else if (hasSameStartStop) {
    feedback = `🌟 Coach Maya here! Look closely at your loop controls: you have set both Start to \`${rawStart}\` and Stop to \`${rawStop}\`. If the loop starts at \`${rawStart}\` and stops immediately at \`${rawStop}\`, it won't be able to step through all the numbers! You selected \`${rawNextStep || '--'}\` to count downward from \`${rawStart}\`—where should our loop stop so that it includes all positive numbers down to the end? (Hint: what is the lowest positive number we multiply by in factorial?)`;
    correction = `Set Stop to 1 when counting down from ${rawStart} (e.g. Start: ${detectedInputName}, Stop: 1, next step: --).`;
    suggestedInput = `Start:${detectedInputName}\nStop:1\nnext step:--`;
  } else if (hasLoopDirectionMistake) {
    if (isDescendingCandidate) {
      feedback = `🌟 Coach Maya here! Your loop starts at \`${rawStart}\` and aims down towards \`${rawStop}\`, but your next step is set to increase (\`${rawNextStep}\`). Stepping upward moves away from 1 towards infinity! How should we step downward to count down from \`${rawStart}\` to \`${rawStop}\`? (Hint: -- or -1)`;
      correction = `Change next step to -- (or -1) when counting down from ${rawStart} to ${rawStop}.`;
      suggestedInput = `Start:${rawStart}\nStop:${rawStop}\nnext step:--`;
    } else {
      feedback = `🌟 Coach Maya here! Your loop starts at \`${rawStart}\` and aims up towards \`${rawStop}\`, but your next step is set to decrease (\`${rawNextStep}\`). Stepping backward moves away into negative numbers! How should we step forward to count from \`${rawStart}\` up to \`${rawStop}\`? (Hint: +1 or ++)`;
      correction = `Change next step to +1 (or ++) when counting up from ${rawStart} to ${rawStop}.`;
      suggestedInput = `Start:${rawStart}\nStop:${rawStop}\nnext step:+1`;
    }
  } else if (hasWrongStopMistake) {
    if (isDescendingCandidate) {
      feedback = `🌟 Coach Maya here! In Factorial, when counting down from \`${rawStart}\`, our multiplication sequence needs to go all the way down to 1. Currently your stop is \`${rawStop}\`. What should the stop value be? (Hint: 1)`;
      correction = `Set Stop to 1 when counting down from ${rawStart}.`;
      suggestedInput = `Start:${rawStart}\nStop:1\nnext step:--`;
    } else {
      feedback = `🌟 Coach Maya here! When counting up from 1, our loop needs to reach our input number \`${detectedInputName}\`. Currently your stop is \`${rawStop}\`. What should the stop value be?`;
      correction = `Set Stop to ${detectedInputName} when counting up from 1.`;
      suggestedInput = `Start:1\nStop:${detectedInputName}\nnext step:+1`;
    }
  } else if (hasAdditionMistake) {
    feedback = `🌟 Coach Maya here! Factorial requires calculating the sequential product (multiplication), not the sum! How can we update our container using multiplication instead of addition?`;
    correction = `Use multiplication: ${detectedContainerName} = ${detectedContainerName} * i (or ${detectedContainerName} *= i).`;
    suggestedInput = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i`;
  } else if (currentMissingStep === 1) {
    feedback = "🌟 Coach Maya here! Let's gather our programming ingredients for Factorial! To begin, what is the input variable we need to receive the number from the user? Write Step 1 to declare our input variable.";
    correction = "Step 1: n (input variable)";
    suggestedInput = "Step 1: n (input variable)";
  } else if (currentMissingStep === 2) {
    feedback = "🌟 Great start! You've got your input variable declared. Next in Step 2, we need a container variable to store our running product. In Factorial, what initial value should this container start with? (Think about what happens if we multiply by 0!)";
    correction = "Step 2: fact = 1 (container variable)";
    suggestedInput = "Step 2: fact = 1 (container variable)";
  } else if (currentMissingStep === 3) {
    feedback = "🌟 You've got your input variable and container variable set! Now, to repeat the multiplication for each number from 1 up to our input, what programming loop construct should we bring in for Step 3?";
    correction = "Step 3: for loop (or while loop)";
    suggestedInput = "Step 3: for loop";
  } else if (currentMissingStep === 4) {
    feedback = "🌟 You're doing a fantastic job, and using a loop is spot on! For Step 4, our loop needs steering controls so it knows where to begin, where to end, and how much to step forward. Where does our loop start, where does it end, and what is our next step?";
    correction = `Step 4: start = 1, end = ${detectedInputName}, next step = +1`;
    suggestedInput = `Step 4: start = 1, end = ${detectedInputName}, next step = +1`;
  } else if (currentMissingStep === 5) {
    feedback = "🌟 Superb! Now that your loop controls are defined, let's look inside the loop body for Step 5. How should we update our container variable with each new number? What arithmetic operation will combine them?";
    correction = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i (operators: * and =)`;
    suggestedInput = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i`;
  } else if (currentMissingStep === 6) {
    feedback = `🌟 Great job! All the loop steps and our container update are set. Now, what final statement do we need outside the loop to display our completed factorial result? (e.g. print(${detectedContainerName}))`;
    correction = `Step 6: print(${detectedContainerName}) - Display the final factorial output outside the loop.`;
    suggestedInput = `Step 6: print(${detectedContainerName})`;
  } else {
    feedback = `🎉 Ingredients Verified! Brilliant work! You've identified all 6 essential programming ingredients for Factorial:\n• Input variable (${detectedInputName})\n• Container variable initialized to 1 (${detectedContainerName} = 1)\n• Loop construct (for loop or while loop)\n• Loop controls: start = 1, end = ${detectedInputName}, next step = +1\n• Factorial update inside loop (${detectedContainerName} = ${detectedContainerName} * i)\n• Print / Display statement: print(${detectedContainerName})\n\nYou're ready to proceed to Taste the Sample stage to assemble your code!`;
    correction = "Proceed to Taste the Sample stage to assemble your code!";
  }

  const isFullyVerified = hasInputVar && hasFactInitial && hasLoopConstruct && hasLoopControls && hasMultiplyOperator && hasPrintStatement && !hasZeroFactMistake && !hasAdditionMistake && !hasLoopControlMistake;

  return {
    isFullyVerified,
    hasInputVar,
    hasFactInitial,
    hasZeroFactMistake,
    hasLoopConstruct,
    hasLoopControls,
    hasLoopControlMistake,
    hasSameStartStop,
    hasLoopDirectionMistake,
    hasWrongStopMistake,
    hasMultiplyOperator,
    hasAdditionMistake,
    hasPrintStatement,
    currentMissingStep,
    ingredientsStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates Taste the Sample (Prototype Code) for Factorial
 * Strictly enforces:
 * 1. Input variable n
 * 2. Accumulator fact = 1 (NOT 0)
 * 3. Loop from 1 to n (or 0 to n)
 * 4. Product update: fact = fact * i (or fact *= i)
 * 5. Display: print(fact)
 */
export function validateFactorialSampleCode(text: string, attemptCount: number = 1): FactorialValidationResult {
  const norm = text.toLowerCase().trim();

  // Detect student's input variable name (e.g. 'b = 5', 'n = 5', 'let b = 5')
  let detectedInputName = 'n';
  const inputVarMatch = text.match(/(?:(?:let|const|var|int)\s+)?([a-z_]\w*)\s*=\s*(?:(?:int|parseInt)\s*\(\s*(?:input|prompt)\s*\(\s*\)\s*\)|[0-9]+|input\(\)|prompt|scanner|cin)/i) ||
                        text.match(/(?:step\s*1[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*=\s*(\d+))/i);
  if (inputVarMatch && inputVarMatch[1]) {
    const candidate = inputVarMatch[1].trim();
    if (!['let', 'const', 'var', 'int', 'fact', 'factorial', 'for', 'while'].includes(candidate.toLowerCase())) {
      detectedInputName = candidate;
    }
  }

  // Detect student's container variable name (e.g. 'a = 1', 'fact = 1', 'let a = 1')
  let detectedContainerName = 'fact';
  const containerVarMatch = text.match(/(?:(?:let|const|var|int)\s+)?([a-z_]\w*)\s*=\s*(?:1|0)\b/i) ||
                            text.match(/(?:step\s*2[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*=\s*(\d+))/i);
  if (containerVarMatch && containerVarMatch[1]) {
    const candidate = containerVarMatch[1].trim();
    if (candidate.toLowerCase() !== detectedInputName.toLowerCase() &&
        !['let', 'const', 'var', 'int', 'i', 'j', 'k', 'n', 'input'].includes(candidate.toLowerCase())) {
      detectedContainerName = candidate;
    }
  }

  const hasInput = (
    new RegExp(`(?:let|const|var|int\\s+)?(?:${detectedInputName}|n)\\s*=\\s*(?:(?:int|parseInt)\\s*\\(\\s*(?:input|prompt)\\s*\\(\\s*\\)\\s*\\)|[0-9]+|input\\(\\)|prompt|scanner|cin)`, 'i').test(text) ||
    new RegExp(`\\b(?:let|const|var|int)?\\s*(?:${detectedInputName}|n)\\s*=`, 'i').test(text) ||
    /\b(?:input\(\)|scanner|cin|prompt)\b/i.test(norm)
  );

  const hasAccumulatorOne = (
    new RegExp(`(?:let|const|var|int\\s+)?(?:fact|factorial|prod|product|ans|${detectedContainerName})\\s*=\\s*1\\b`, 'i').test(text)
  );
  const hasAccumulatorZero = (
    new RegExp(`(?:let|const|var|int\\s+)?(?:fact|factorial|prod|product|ans|${detectedContainerName})\\s*=\\s*0\\b`, 'i').test(text)
  );
  const hasAccumulator = hasAccumulatorOne && !hasAccumulatorZero;

  // Check syntax and loop inquiry queries (e.g. "i did not know how to write loop", "loop theriyala", "loop example")
  const isLoopQuery = /syntax|loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(text);
  if (isLoopQuery) {
    const loopExamples = `\n\nHere is how you can write the loop using your variable \`${detectedInputName}\`:\n\n🐍 **Python:**\n\`\`\`python\nfor i in range(1, ${detectedInputName} + 1):\n\`\`\`\n\n💻 **JavaScript:**\n\`\`\`javascript\nfor (let i = 1; i <= ${detectedInputName}; i++) {\n}\n\`\`\`\n\n☕ **Java / C / C++:**\n\`\`\`java\nfor (int i = 1; i <= ${detectedInputName}; i++) {\n}\n\`\`\``;

    if (hasInput && hasAccumulator) {
      return {
        hasInput: true,
        hasAccumulator: true,
        hasLoop: false,
        hasProductUpdate: false,
        hasPrint: false,
        completedCount: 2,
        allVerified: false,
        isSyntaxQuery: true,
        detectedInputName,
        detectedContainerName,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: `Input Variable (${detectedInputName})`, completed: true, current: false },
          { stepNumber: 2, title: `Accumulator (${detectedContainerName} = 1)`, completed: true, current: false },
          { stepNumber: 3, title: `Loop Construct (1 to ${detectedInputName})`, completed: false, current: true },
          { stepNumber: 4, title: `Accumulate Product (${detectedContainerName} *= i)`, completed: false, current: false },
          { stepNumber: 5, title: `Display Result (print(${detectedContainerName}))`, completed: false, current: false }
        ],
        feedback: `🌟 Coach Maya here! Happy to help with the loop! It is completely normal for loop syntax to feel tricky at first.\n\nSince you have already set up your input \`${detectedInputName}\` and accumulator \`${detectedContainerName} = 1\`, ${loopExamples}\n\n👉 **Next Step:** Try adding the loop to your code! You can also click **Insert Prototype Example** below.`,
        correction: `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`,
        suggestedInput: `for (let i = 1; i <= ${detectedInputName}; i++)`
      };
    }

    return {
      hasInput: false,
      hasAccumulator: false,
      hasLoop: false,
      hasProductUpdate: false,
      hasPrint: false,
      completedCount: 0,
      allVerified: false,
      isSyntaxQuery: true,
      detectedInputName,
      detectedContainerName,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Input Variable (${detectedInputName})`, completed: false, current: true },
        { stepNumber: 2, title: `Accumulator (${detectedContainerName} = 1)`, completed: false, current: false },
        { stepNumber: 3, title: `Loop Construct (1 to ${detectedInputName})`, completed: false, current: false },
        { stepNumber: 4, title: `Accumulate Product (${detectedContainerName} *= i)`, completed: false, current: false },
        { stepNumber: 5, title: `Display Result (print(${detectedContainerName}))`, completed: false, current: false }
      ],
      feedback: `🌟 Coach Maya here! Happy to help with the loop syntax! ${loopExamples}\n\nLet's start by assembling your code prototype: declare your input \`${detectedInputName}\` and initialize \`${detectedContainerName} = 1\`!`,
      correction: `Use standard for loop syntax: for (let i = 1; i <= ${detectedInputName}; i++)`,
      suggestedInput: `for (let i = 1; i <= ${detectedInputName}; i++)`
    };
  }

  // Strict loop validation
  const validJsJavaLoop = (
    new RegExp(`for\\s*\\(\\s*(?:(?:let|var|const|int)\\s+)?[a-zA-Z_]\\w*\\s*=\\s*(?:0|1)\\s*;\\s*[a-zA-Z_]\\w*\\s*(?:<=|<)\\s*(?:n|${detectedInputName}|[0-9]+|\\w+)\\s*;\\s*(?:[a-zA-Z_]\\w*\\+\\+|\\+\\+[a-zA-Z_]\\w*|[a-zA-Z_]\\w*\\s*\\+=\\s*1|[a-zA-Z_]\\w*\\s*=\\s*[a-zA-Z_]\\w*\\s*\\+\\s*1)\\s*\\)`, 'i').test(text)
  );
  const validPythonRange = (
    new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*(?:0\\s*,\\s*)?(?:1\\s*,\\s*)?(?:n|${detectedInputName}|[0-9]+)\\s*(?:\\+\\s*1)?\\s*\\)`, 'i').test(text)
  );
  const validWhileLoop = (
    new RegExp(`while\\s*\\(?\\s*[a-zA-Z_]\\w*\\s*(?:<=|<)\\s*(?:n|${detectedInputName}|[0-9]+)\\s*\\)?`, 'i').test(text)
  );

  const hasColonInFor = /for\s*\([^)]*:[^)]*\)/i.test(text);
  const hasIncrementInCondition = /for\s*\([^;:]*[:;]\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1)\s*[:;]/i.test(text);
  const hasInvertedCondition = /for\s*\([^)]*(?:>=|>)\s*(?:5|n|[0-9]+)[^)]*\)|while\s*\(?[^)]*(?:>=|>)\s*(?:5|n|[0-9]+)\)?/i.test(text);
  const pythonRangeWithoutPlusOne = new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*(?:0\\s*,\\s*)?1\\s*,\\s*(?:n|${detectedInputName})\\s*\\)`, 'i').test(text);

  let loopErrorFeedback = '';
  let loopErrorCorrection = '';
  let loopSuggested = `for (let i = 1; i <= ${detectedInputName}; i++)`;

  if (hasColonInFor && hasIncrementInCondition) {
    loopErrorFeedback = `⚠️ Coach Maya note: In Step 3, your \`for\` loop syntax needs semicolons (\`;\`) between each part, with condition (\`i <= ${detectedInputName}\`) second and increment (\`i++\`) third.\n\nStructure:\n\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Fix loop syntax: for (let i = 1; i <= ${detectedInputName}; i++)`;
  } else if (hasColonInFor) {
    loopErrorFeedback = `⚠️ Coach Maya note: Separate the 3 parts of your \`for\` loop with semicolons (\`;\`), not colons (\`:\`).\n\nStructure:\n\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Use semicolons in for loop: for (let i = 1; i <= ${detectedInputName}; i++)`;
  } else if (hasIncrementInCondition) {
    loopErrorFeedback = `⚠️ Coach Maya note: Place the condition (\`i <= ${detectedInputName}\`) second and the increment (\`i++\`) third:\n\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Order: for (initialization; condition; increment)`;
  } else if (hasInvertedCondition) {
    loopErrorFeedback = `⚠️ Coach Maya note: Change loop condition to \`i <= ${detectedInputName}\` so it counts upwards from 1 to ${detectedInputName}.`;
    loopErrorCorrection = `Use i <= ${detectedInputName} in condition.`;
  } else if (pythonRangeWithoutPlusOne && !validPythonRange) {
    loopErrorFeedback = `⚠️ Coach Maya note: In Python, \`range(1, ${detectedInputName})\` stops before \`${detectedInputName}\`. To include \`${detectedInputName}\`, use \`range(1, ${detectedInputName} + 1)\`:\n\`for i in range(1, ${detectedInputName} + 1):\``;
    loopErrorCorrection = `Use range(1, ${detectedInputName} + 1) to include ${detectedInputName}.`;
  }

  const hasLoop = (validJsJavaLoop || validPythonRange || validWhileLoop) && !hasColonInFor && !hasIncrementInCondition && !hasInvertedCondition;

  // Extract loop variable
  const loopVarMatch = text.match(/for\s*\(\s*(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=/i) ||
                       text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range/i) ||
                       text.match(/while\s*\(?\s*([a-zA-Z_]\w*)\s*(?:<=|<)/i);
  const loopVar = (loopVarMatch && loopVarMatch[1]) ? loopVarMatch[1] : 'i';

  // Valid accumulator updates: fact = fact * i, fact *= i, a = a * i
  const validProductUpdateRegex = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\*=\\s*${loopVar}|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\*\\s*${loopVar}|=\\s*${loopVar}\\s*\\*\\s*(?:fact|factorial|prod|product|${detectedContainerName}))\\b`, 'i');
  const hasValidProductUpdate = validProductUpdateRegex.test(text);

  // Specific incorrect product updates
  const hasFactAddI = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\+=\\s*${loopVar}|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\+\\s*${loopVar})\\b`, 'i').test(text);
  const hasFactMultiplyN = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\*=\\s*(?:n|${detectedInputName})|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\*\\s*(?:n|${detectedInputName}))\\b`, 'i').test(text);
  const hasFactOverwriteNIntoI = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*=\\s*(?:(?:n|${detectedInputName})\\s*\\*\\s*[a-zA-Z_]\\w*|[a-zA-Z_]\\w*\\s*\\*\\s*(?:n|${detectedInputName}))\\b`, 'i').test(text);

  let productErrorFeedback = '';
  let productErrorCorrection = '';
  let productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;

  if (hasFactAddI) {
    productErrorFeedback = `⚠️ Coach Maya note: In Step 4, you used addition (\`+\`) instead of multiplication (\`*\`). Factorial calculates the running product of all numbers!\n\nUpdate your loop body to multiply:\n\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Change + to * (e.g. ${detectedContainerName} = ${detectedContainerName} * ${loopVar}).`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  } else if (hasFactMultiplyN) {
    productErrorFeedback = `⚠️ Coach Maya note: In Step 4, you multiplied by \`${detectedInputName}\` (\`${detectedContainerName} = ${detectedContainerName} * ${detectedInputName}\`). \`${detectedInputName}\` is the constant boundary! To multiply each progressive number from the loop, multiply by \`${loopVar}\`:\n\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Multiply by loop variable ${loopVar}: ${detectedContainerName} = ${detectedContainerName} * ${loopVar}.`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  } else if (hasFactOverwriteNIntoI) {
    productErrorFeedback = `⚠️ Coach Maya note: In Step 4, you wrote \`${detectedContainerName} = ${detectedInputName} * ${loopVar}\`. This overwrites \`${detectedContainerName}\` on each cycle instead of building upon the running product.\n\nUse:\n\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Use ${detectedContainerName} = ${detectedContainerName} * ${loopVar}.`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  }

  const hasProductUpdate = hasValidProductUpdate && !hasFactAddI && !hasFactMultiplyN && !hasFactOverwriteNIntoI;

  const containerWords = ['fact', 'factorial', 'prod', 'product', 'ans'];
  if (detectedContainerName && !containerWords.includes(detectedContainerName.toLowerCase())) {
    containerWords.push(detectedContainerName.toLowerCase());
  }
  const containerPattern = `(?:${containerWords.join('|')})`;

  const hasContainerInPrint = (
    new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${containerPattern}\\b[^)]*\\)`, 'i').test(text) ||
    new RegExp(`cout\\s*<<[^;]*\\b${containerPattern}\\b`, 'i').test(text) ||
    new RegExp(`printf\\s*\\([^)]*\\b${containerPattern}\\b[^)]*\\)`, 'i').test(text)
  );

  const inputWords = ['n'];
  if (detectedInputName && !inputWords.includes(detectedInputName.toLowerCase())) {
    inputWords.push(detectedInputName.toLowerCase());
  }
  const inputPattern = `(?:${inputWords.join('|')})`;

  const hasPrintedInputInstead = !hasContainerInPrint && (
    new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${inputPattern}\\b[^)]*\\)`, 'i').test(text) ||
    new RegExp(`cout\\s*<<[^;]*\\b${inputPattern}\\b`, 'i').test(text) ||
    new RegExp(`printf\\s*\\([^)]*\\b${inputPattern}\\b[^)]*\\)`, 'i').test(text)
  );

  const hasPrintedLoopVarInstead = !hasContainerInPrint && (
    new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, 'i').test(text) ||
    new RegExp(`cout\\s*<<[^;]*\\b${loopVar}\\b`, 'i').test(text) ||
    new RegExp(`printf\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, 'i').test(text)
  );

  const hasAnyOtherPrint = !hasContainerInPrint && (
    /print\s*\(/i.test(text) ||
    /console\.log\s*\(/i.test(text) ||
    /System\.out\.print(?:ln)?\s*\(/i.test(text) ||
    /cout\s*<</i.test(text) ||
    /printf\s*\(/i.test(text)
  );

  const hasPrint = hasContainerInPrint;

  const sampleCodeStepProgress: FactorialStepProgress[] = [
    { stepNumber: 1, title: `Input Variable (${detectedInputName})`, completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: `Accumulator (${detectedContainerName} = 1)`, completed: hasAccumulator, current: hasInput && !hasAccumulator },
    { stepNumber: 3, title: `Loop Construct (1 to ${detectedInputName})`, completed: hasLoop, current: hasInput && hasAccumulator && !hasLoop },
    { stepNumber: 4, title: `Accumulate Product (${detectedContainerName} *= ${loopVar})`, completed: hasProductUpdate, current: hasInput && hasAccumulator && hasLoop && !hasProductUpdate },
    { stepNumber: 5, title: `Display Result (print(${detectedContainerName}))`, completed: hasPrint, current: hasInput && hasAccumulator && hasLoop && hasProductUpdate && !hasPrint }
  ];

  const completedCount = [hasInput, hasAccumulator, hasLoop, hasProductUpdate, hasPrint].filter(Boolean).length;
  const allVerified = hasInput && hasAccumulator && hasLoop && hasProductUpdate && hasPrint;

  let feedback = '';
  let correction = '';
  let suggestedInput = '';

  if (allVerified) {
    feedback = `🎉 Taste the Sample Verified! Fantastic work! Your prototype code correctly brings together all 5 steps of the Factorial algorithm:\n• Input variable \`${detectedInputName}\`\n• Initial accumulator \`${detectedContainerName} = 1\`\n• Loop iterating from 1 to \`${detectedInputName}\`\n• Product accumulation (\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\`)\n• Output printing the final total (\`print(${detectedContainerName})\`)\n\nYou are fully ready to code and test!`;
    correction = "You're ready to code!";
    suggestedInput = '';
  } else if (!hasInput && !hasAccumulator && !hasLoop && !hasProductUpdate && !hasPrint) {
    feedback = `🌟 Coach Maya here! Welcome to Stage 4: Taste the Sample! Let's assemble our verified ingredients into a working code prototype step by step.\n\n👉 **Step 1 & 2:** Start by declaring your input variable \`${detectedInputName}\` and initializing your accumulator \`${detectedContainerName} = 1\`.`;
    correction = `Declare input ${detectedInputName} and accumulator ${detectedContainerName} = 1.`;
    suggestedInput = `${detectedInputName} = int(input())\n${detectedContainerName} = 1`;
  } else if (!hasInput || !hasAccumulator) {
    if (hasAccumulatorZero) {
      feedback = `⚠️ Coach Maya note: In Step 2, you initialized \`${detectedContainerName} = 0\`. Multiplying anything by 0 keeps the product at 0 forever! Change it to start at 1:\n\`${detectedContainerName} = 1\``;
      correction = `Initialize ${detectedContainerName} = 1 instead of 0.`;
      suggestedInput = `${detectedContainerName} = 1`;
    } else {
      feedback = `🌟 Great start! Make sure you have both your input variable \`${detectedInputName}\` and your accumulator \`${detectedContainerName} = 1\` declared before starting the loop.\n\n👉 Next: Declare \`${detectedInputName}\` and initialize \`${detectedContainerName} = 1\`.`;
      correction = `Initialize input ${detectedInputName} and ${detectedContainerName} = 1.`;
      suggestedInput = !hasInput ? `${detectedInputName} = int(input())` : `${detectedContainerName} = 1`;
    }
  } else if (!hasLoop) {
    if (loopErrorFeedback) {
      feedback = loopErrorFeedback;
      correction = loopErrorCorrection;
      suggestedInput = loopSuggested;
    } else if (attemptCount >= 3) {
      feedback = `🌟 Coach Maya here! Let's get your factorial loop connected right away! Place this exact loop after initializing \`${detectedContainerName} = 1\`:\n\n\`\`\`javascript\nfor (let i = 1; i <= ${detectedInputName}; i++) {\n  ${detectedContainerName} = ${detectedContainerName} * i;\n}\n\`\`\`\n\n👉 Add the loop and product step!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    } else if (attemptCount === 2) {
      feedback = `🌟 Coach Maya checking back! You have \`${detectedInputName}\` and \`${detectedContainerName} = 1\` ready. Now we need our counting loop to repeat from 1 up to \`${detectedInputName}\`.\n\n• **Start:** \`i = 1\`\n• **Stop Condition:** \`i <= ${detectedInputName}\`\n• **Next Step:** \`i++\`\n\n👉 Try writing the loop statement now!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    } else {
      feedback = `🌟 Superb progress declaring \`${detectedInputName}\` and \`${detectedContainerName} = 1\`!\n\n👉 **Step 3:** Now write your \`for\` loop to repeat from 1 to \`${detectedInputName}\`.\n\nHere is how you can write the loop using your variable \`${detectedInputName}\`:\n\n🐍 **Python:**\n\`\`\`python\nfor i in range(1, ${detectedInputName} + 1):\n\`\`\`\n\n💻 **JavaScript:**\n\`\`\`javascript\nfor (let i = 1; i <= ${detectedInputName}; i++) {\n}\n\`\`\`\n\n☕ **Java / C / C++:**\n\`\`\`java\nfor (int i = 1; i <= ${detectedInputName}; i++) {\n}\n\`\`\`\n\nTry adding the loop into your code!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    }
  } else if (!hasProductUpdate) {
    if (productErrorFeedback) {
      feedback = productErrorFeedback;
      correction = productErrorCorrection;
      suggestedInput = productSuggested;
    } else if (attemptCount >= 2) {
      feedback = `🌟 Coach Maya checking in! Inside the loop body, multiply the current number into your container:\n\`${detectedContainerName} = ${detectedContainerName} * ${loopVar};\` (or \`${detectedContainerName} *= ${loopVar};\`)\n\nThis multiplies the previous product by the loop number on each iteration!`;
      correction = `Step 4: Add ${detectedContainerName} = ${detectedContainerName} * ${loopVar} inside the loop.`;
      suggestedInput = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
    } else {
      feedback = `🌟 Awesome! Your loop is set up cleanly.\n\n👉 **Step 4:** Inside the loop body, multiply each incrementing number \`${loopVar}\` into your container \`${detectedContainerName}\` (\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` or \`${detectedContainerName} *= ${loopVar}\`).`;
      correction = `Step 4: Add ${detectedContainerName} = ${detectedContainerName} * ${loopVar} inside the loop.`;
      suggestedInput = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
    }
  } else if (!hasPrint) {
    if (hasPrintedInputInstead) {
      feedback = `⚠️ Coach Maya note: Take a close look at your last line where you wrote \`print(${detectedInputName})\`!\n\nVariable \`${detectedInputName}\` holds your starting input number (like 5), whereas your accumulated factorial product is safely stored in variable \`${detectedContainerName}\`!\n\nIf you print \`${detectedInputName}\`, you will only output the input number instead of the final factorial calculation.\n\n👉 **Update your print statement to output your container:**\n\`print(${detectedContainerName})\` (or \`console.log(${detectedContainerName})\`)`;
      correction = `Change print(${detectedInputName}) to print(${detectedContainerName}) to output the final factorial result.`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (hasPrintedLoopVarInstead) {
      feedback = `⚠️ Coach Maya note: In Step 5, you printed the loop variable \`${loopVar}\` (\`print(${loopVar})\`). \`${loopVar}\` is only the counter variable! Your accumulated product is in \`${detectedContainerName}\`.\n\n👉 **Update your print statement to output your container:**\n\`print(${detectedContainerName})\``;
      correction = `Change print(${loopVar}) to print(${detectedContainerName}) to output the final result.`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (hasAnyOtherPrint) {
      feedback = `⚠️ Coach Maya note: In Step 5, you added an output statement, but make sure to print your accumulator variable \`${detectedContainerName}\` to display the final factorial product:\n\`print(${detectedContainerName})\``;
      correction = `Print accumulator: print(${detectedContainerName}).`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (attemptCount >= 2) {
      feedback = `🌟 Coach Maya here! Everything is computed! Add the output line after the loop to display the final factorial:\n\`print(${detectedContainerName})\` (or \`console.log(${detectedContainerName});\`)`;
      correction = `Step 5: Add print(${detectedContainerName}) to display the final result.`;
      suggestedInput = `print(${detectedContainerName});`;
    } else {
      feedback = `🌟 Almost at the finish line! Your calculation logic is completely in place.\n\n👉 **Step 5:** Outside the loop, add your output statement (\`print(${detectedContainerName})\`, \`console.log(${detectedContainerName})\`, etc.) to display the final calculated factorial.`;
      correction = `Step 5: Add print(${detectedContainerName}) to display the final result.`;
      suggestedInput = `print(${detectedContainerName});`;
    }
  }

  return {
    hasInput,
    hasAccumulator,
    hasLoop,
    hasProductUpdate,
    hasPrint,
    completedCount,
    allVerified,
    isSyntaxQuery: false,
    detectedInputName,
    detectedContainerName,
    sampleCodeStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}
