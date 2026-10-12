export interface EquationItem {
  leftA: number;
  leftB: number;
  right: number;
  line: string;
}

export interface ArithmeticCheckResult {
  hasEquations: boolean;
  allEquationsValid: boolean;
  invalidEquations: Array<{ equation: string; expected: number; actual: number }>;
  isSequentialAccumulation: boolean;
  isDoubling?: boolean;
  maxN: number;
  finalSum: number;
  equations: EquationItem[];
}

export interface StatedSumResult {
  hasStatedSum: boolean;
  targetN?: number;
  statedSum: number;
  rawText: string;
}

export interface SumOfNValidation {
  isCorrect: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  hasAccumulation: boolean;
  hasFormula: boolean;
  hasTargetMismatch?: boolean;
  hasSumMismatch?: boolean;
}

/**
 * Extracts declared test number n from student input, e.g.:
 * "If i take a number as 3", "take a number as 3", "let n = 5", "if n = 3", "n = 3"
 */
export function extractDeclaredN(text: string): number | undefined {
  if (!text) return undefined;
  const lines = text.split(/[\r\n]+/);

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (!trimmed) continue;
    // Skip equation lines like "0+1=1" or "1+2+3=6"
    if (/^\d+\s*\+\s*\d+\s*=\s*\d+/.test(trimmed)) continue;
    if (/^\d+(?:\s*\+\s*\d+)+\s*=\s*\d+/.test(trimmed)) continue;
    // Skip conclusion statements like "the sum of 3 is 10"
    if (/^(?:the\s*)?sum\s*(?:of\s*)?/i.test(trimmed)) continue;

    // Pattern 1: (if i) take/let/choose/assume/set/consider (a) number/n (as/is/=/:/be) <digit>
    const m1 = trimmed.match(/(?:(?:if\s+(?:i\s+)?)?(?:take|let|choose|assume|consider|set|have|test\s*(?:with|case)?))\s+(?:a\s+)?(?:number|n|input)?\s*(?:as|is|=|be|:|\b)\s*(\d+)\b/i);
    if (m1 && m1[1]) {
      const val = parseInt(m1[1], 10);
      if (val > 0) return val;
    }

    // Pattern 2: if n = <digit> / if n is <digit> / if number is <digit>
    const m2 = trimmed.match(/\bif\s+(?:the\s+)?(?:number|n)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m2 && m2[1]) {
      const val = parseInt(m2[1], 10);
      if (val > 0) return val;
    }

    // Pattern 3: for n = <digit> / for number = <digit>
    const m2b = trimmed.match(/\bfor\s+(?:n|number)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m2b && m2b[1]) {
      const val = parseInt(m2b[1], 10);
      if (val > 0) return val;
    }

    // Pattern 4: n = <digit>, n: <digit>, n is <digit>
    const m3 = trimmed.match(/\bn\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m3 && m3[1]) {
      const val = parseInt(m3[1], 10);
      if (val > 0) return val;
    }

    // Pattern 5: number = <digit>, number is <digit>, number as <digit>
    const m4 = trimmed.match(/\b(?:number|input)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m4 && m4[1]) {
      const val = parseInt(m4[1], 10);
      if (val > 0) return val;
    }
  }

  return undefined;
}

/**
 * Extracts stated sum conclusions from student input, e.g.:
 * "The sum of 3 is 10", "sum of 3 is 10", "the final answer is 10", "answer is 10", "result: 10"
 */
export function extractStatedSum(text: string): StatedSumResult | undefined {
  if (!text) return undefined;
  const lines = text.split(/[\r\n]+/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Pattern 1: "The sum/total/answer/result/output of 3 is 10" or "sum of first 3 numbers is 6"
    const m1 = trimmed.match(/(?:the\s*)?(?:final\s*)?(?:total\s*)?(?:sum|total|answer|ans|result|output|value)\s*(?:of\s*(?:the\s*)?(?:first\s*)?(\d+)(?:\s*(?:natural\s*)?numbers)?)?\s*(?:is|=|equals|becomes|to|:)\s*(\d+)/i);
    if (m1) {
      const targetN = m1[1] ? parseInt(m1[1], 10) : undefined;
      const statedSum = parseInt(m1[2], 10);
      return { hasStatedSum: true, targetN, statedSum, rawText: trimmed };
    }

    // Pattern 2: "the final answer is 10", "final answer = 10", "the answer is 10", "answer: 10"
    const m2 = trimmed.match(/(?:the\s*)?(?:final\s*)?(?:answer|ans|result|output|sum|total)\s*(?:is|=|equals|becomes|to|:)\s*(\d+)/i);
    if (m2) {
      const statedSum = parseInt(m2[1], 10);
      return { hasStatedSum: true, targetN: undefined, statedSum, rawText: trimmed };
    }

    // Pattern 3: "so the final answer is 10", "therefore answer is 10", "hence result is 10"
    const m3 = trimmed.match(/(?:so|hence|therefore|finally)\s*(?:the\s*)?(?:final\s*)?(?:sum|total|answer|ans|result|output)?\s*(?:is|=|equals|becomes|to|:)?\s*(\d+)/i);
    if (m3) {
      const statedSum = parseInt(m3[1], 10);
      return { hasStatedSum: true, targetN: undefined, statedSum, rawText: trimmed };
    }

    // Pattern 4: "answer: 10" or "ans: 10" or "result: 10" or "sum: 10"
    const m4 = trimmed.match(/^(?:the\s*)?(?:final\s*)?(?:answer|ans|result|output|sum|total)\s*[:=]\s*(\d+)$/i);
    if (m4) {
      const statedSum = parseInt(m4[1], 10);
      return { hasStatedSum: true, targetN: undefined, statedSum, rawText: trimmed };
    }
  }

  return undefined;
}

/**
 * Parses addition equations such as:
 * "0+1=1", "1+2=3", "3+3=6", "6+4=10", "10+5=15", "6=4=10"
 * or single-line series: "1+2+3=6"
 * and checks arithmetic and sequential accumulation
 */
export function checkSumArithmetic(text: string): ArithmeticCheckResult {
  const result: ArithmeticCheckResult = {
    hasEquations: false,
    allEquationsValid: true,
    invalidEquations: [],
    isSequentialAccumulation: false,
    maxN: 0,
    finalSum: 0,
    equations: []
  };

  if (!text) return result;

  // 1. Process line by line
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check single-line series: e.g. "1 + 2 + 3 = 6" or "1 + 2 + 3 + 4 = 10"
    const seriesMatch = trimmed.match(/^((?:\d+\s*\+\s*){2,}\d+)\s*=\s*(\d+)$/);
    if (seriesMatch) {
      result.hasEquations = true;
      const numStrings = seriesMatch[1].split('+').map(s => parseInt(s.trim(), 10));
      const right = parseInt(seriesMatch[2], 10);
      const expectedSum = numStrings.reduce((a, b) => a + b, 0);

      if (expectedSum !== right) {
        result.allEquationsValid = false;
        result.invalidEquations.push({
          equation: seriesMatch[0],
          expected: expectedSum,
          actual: right
        });
      } else {
        const isConsecutive = numStrings.every((val, idx) => val === idx + 1);
        if (isConsecutive) {
          result.isSequentialAccumulation = true;
          result.maxN = numStrings.length;
          result.finalSum = right;
        }
      }
      continue;
    }

    // Match all two-term equations on this line (e.g. "0+1=1", "1+2=3", "6+4=10" or "6=4=10")
    // Notice: [\+=] matches '+' as well as '=' typo (when user forgets Shift key on keyboard)
    const eqRegex = /(\d+)\s*([\+=])\s*(\d+)\s*=\s*(\d+)/g;
    let match: RegExpExecArray | null;
    while ((match = eqRegex.exec(trimmed)) !== null) {
      result.hasEquations = true;
      const leftA = parseInt(match[1], 10);
      const leftB = parseInt(match[3], 10);
      const right = parseInt(match[4], 10);
      const sum = leftA + leftB;

      if (sum !== right) {
        result.allEquationsValid = false;
        result.invalidEquations.push({
          equation: match[0],
          expected: sum,
          actual: right
        });
      } else {
        result.equations.push({ leftA, leftB, right, line: match[0] });
      }
    }
  }

  // Check if two-term equations represent genuine sequential accumulation:
  // e.g. 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15
  // or starting directly with 1+2=3, 3+3=6, 6+4=10
  if (result.equations.length >= 2 && result.invalidEquations.length === 0) {
    // Check if the student is doubling numbers (e.g. 1+1=2, 2+2=4, 3+3=6)
    const doublingCount = result.equations.filter(eq => eq.leftA === eq.leftB && eq.leftA >= 1).length;
    if (doublingCount >= 2 && (doublingCount === result.equations.length || result.equations[0].leftA === result.equations[0].leftB)) {
      result.isDoubling = true;
      result.isSequentialAccumulation = false;
      result.maxN = Math.max(...result.equations.map(eq => eq.leftA));
      result.finalSum = result.equations[result.equations.length - 1].right;
      return result;
    }

    const eq0 = result.equations[0];

    // Pattern 1: Starts with 0 and 1 (0+1=1 or 1+0=1)
    let pattern1Valid = false;
    const isEq0StartingZero = (eq0.leftA === 0 && eq0.leftB === 1) || (eq0.leftA === 1 && eq0.leftB === 0);

    if (isEq0StartingZero && eq0.right === 1) {
      let valid = true;
      let prevTotal = 1;
      for (let i = 1; i < result.equations.length; i++) {
        const eq = result.equations[i];
        const nextNum = i + 1; // 2, 3, 4, ...
        const operandsMatch = (eq.leftA === prevTotal && eq.leftB === nextNum) || (eq.leftA === nextNum && eq.leftB === prevTotal);
        if (!operandsMatch || eq.right !== prevTotal + nextNum) {
          valid = false;
          break;
        }
        prevTotal = eq.right;
      }
      if (valid) {
        pattern1Valid = true;
        result.isSequentialAccumulation = true;
        result.maxN = result.equations.length;
        result.finalSum = prevTotal;
      }
    }

    // Pattern 2: Starts with 1 and 2 (1+2=3 or 2+1=3)
    if (!pattern1Valid) {
      const isEq0StartingOne = (eq0.leftA === 1 && eq0.leftB === 2) || (eq0.leftA === 2 && eq0.leftB === 1);
      if (isEq0StartingOne && eq0.right === 3) {
        let valid = true;
        let prevTotal = 3;
        for (let i = 1; i < result.equations.length; i++) {
          const eq = result.equations[i];
          const nextNum = i + 2; // 3, 4, 5, ...
          const operandsMatch = (eq.leftA === prevTotal && eq.leftB === nextNum) || (eq.leftA === nextNum && eq.leftB === prevTotal);
          if (!operandsMatch || eq.right !== prevTotal + nextNum) {
            valid = false;
            break;
          }
          prevTotal = eq.right;
        }
        if (valid) {
          result.isSequentialAccumulation = true;
          result.maxN = result.equations.length + 1;
          result.finalSum = prevTotal;
        }
      }
    }
  }

  return result;
}

/**
 * Validates Logic stage input for Sum of N Numbers.
 * Strictly verifies arithmetic, boundary conditions, and mathematical truth:
 * - If user chose n=3, they must only accumulate up to 3 (sum is 6).
 * - Adding 4 (6+4=10) or stating "The sum of 3 is 10" is FALSE and must be rejected with helpful guidance.
 * - Doubling numbers (1+1=2, 2+2=4, 3+3=6) is FALSE and must be guided to sequential accumulation.
 */
export function validateSumOfNLogic(text: string): SumOfNValidation {
  const norm = (text || '').toLowerCase();
  const arith = checkSumArithmetic(text);
  const declaredN = extractDeclaredN(text);
  const statedSumInfo = extractStatedSum(text);

  // Helper to build canonical equation trace for a given n
  const buildTraceExample = (n: number) => {
    const steps: string[] = [];
    let current = 0;
    for (let i = 1; i <= n; i++) {
      steps.push(`${current}+${i}=${current + i}`);
      current += i;
    }
    return steps.join('\n');
  };

  // 1. Check for explicit arithmetic errors in any equation (e.g. 6+4=9)
  if (arith.hasEquations && !arith.allEquationsValid && arith.invalidEquations.length > 0) {
    const err = arith.invalidEquations[0];
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `Check your calculation in your worksheet: ${err.equation} is not mathematically correct. ${err.equation.split('=')[0].trim()} equals ${err.expected}, not ${err.actual}! Correct this step so your accumulated total is accurate.`,
      correction: `Fix the calculation error: change "${err.equation}" to "${err.equation.split('=')[0].trim()} = ${err.expected}".`,
      suggestedInput: `${err.equation.split('=')[0].trim()} = ${err.expected}`
    };
  }

  // 2. Check for Doubling Numbers: e.g. 1+1=2, 2+2=4, 3+3=6
  if (arith.hasEquations && arith.allEquationsValid && arith.isDoubling) {
    const target = declaredN ?? statedSumInfo?.targetN ?? arith.maxN ?? 3;
    const expectedSum = (target * (target + 1)) / 2;
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `Look closely at your addition steps: in each line, you are doubling each number (1+1=2, 2+2=4, 3+3=6) instead of carrying forward the running total!\n\nWhen calculating the sum of the first ${target} natural numbers, each counting number (1, 2, 3${target > 3 ? `, ... ${target}` : ''}) is added only ONCE into a running total starting at 0:\n• Step 1: 0 + 1 = 1 (start with 0, add 1 ➔ total is 1)\n• Step 2: 1 + 2 = 3 (carry forward total 1, add 2 ➔ total is 3)\n• Step 3: 3 + 3 = 6 (carry forward total 3, add 3 ➔ total is 6)\n\nNotice that in Step 2, we add 2 to the previous total 1 (getting 3), NOT 2 to 2! Please correct your addition steps so each line accumulates into the previous total.`,
      correction: `Carry forward the accumulated total from each step (e.g. 0+1=1, 1+2=3, 3+3=6) instead of doubling numbers like 1+1 or 2+2.`,
      suggestedInput: `If n=${target}:\n\n${buildTraceExample(target)}\nThe sum of ${target} is ${expectedSum}`
    };
  }

  // 3. Check for Broken / Invalid Accumulation Chain in Equations
  if (arith.hasEquations && arith.allEquationsValid && !arith.isSequentialAccumulation && arith.equations.length >= 2) {
    const target = declaredN ?? statedSumInfo?.targetN ?? 3;
    const expectedSum = (target * (target + 1)) / 2;
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `Look closely at your addition steps: your equations do not show a sequential running total accumulator.\n\nTo demonstrate the logic for the first ${target} natural numbers, each step must add the next counting number to the total accumulated so far:\n• Step 1: 0 + 1 = 1 (start with 0, add 1 ➔ total = 1)\n• Step 2: 1 + 2 = 3 (carry forward 1, add 2 ➔ total = 3)\n• Step 3: 3 + 3 = 6 (carry forward 3, add 3 ➔ total = 6)\n\nCorrect your steps so the result of each step carries over as the starting total for the next step!`,
      correction: `Show the running total growing step by step: 0+1=1, 1+2=3, 3+3=6...`,
      suggestedInput: `If n=${target}:\n\n${buildTraceExample(target)}\nThe sum of ${target} is ${expectedSum}`
    };
  }

  // 4. Check for Mathematical Contradiction in Stated Sum Conclusion
  // e.g. "The sum of 3 is 10" (mathematical sum of 3 is 6, 10 is the sum of 4!)
  if (statedSumInfo?.targetN !== undefined) {
    const target = statedSumInfo.targetN;
    const expectedSum = (target * (target + 1)) / 2;

    if (statedSumInfo.statedSum !== expectedSum) {
      let detail = `Look closely at your conclusion "${statedSumInfo.rawText}": the sum of the first ${target} natural numbers is ${expectedSum}, not ${statedSumInfo.statedSum}!`;

      if (target === 3 && statedSumInfo.statedSum === 10) {
        detail = `Look closely at your steps: you took the number as 3 (n = 3), so you only need to add the numbers up to 3 (1, 2, and 3):\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\nSo the sum of 3 is 6, not 10!\n10 is actually the sum of the first 4 numbers (1 + 2 + 3 + 4 = 10). When you added 4 in "6 + 4 = 10", you added an extra number beyond 3!`;
      }

      return {
        isCorrect: false,
        hasAccumulation: arith.hasEquations,
        hasFormula: false,
        hasSumMismatch: true,
        feedback: `${detail}\n\nTo correct this:\n• If your test number is ${target}, remove steps beyond ${target} and conclude that the sum of ${target} is ${expectedSum}.\n• Or if you want to find the sum of ${arith.maxN > target ? arith.maxN : 4}, change your test number to ${arith.maxN > target ? arith.maxN : 4} (the sum of ${arith.maxN > target ? arith.maxN : 4} is ${statedSumInfo.statedSum}).`,
        correction: `For n = ${target}, the sum of 1 to ${target} is ${expectedSum} (not ${statedSumInfo.statedSum}).`,
        suggestedInput: `If i take a number as ${target}\n\n${buildTraceExample(target)}\nThe sum of ${target} is ${expectedSum}`
      };
    }
  }

  // 5. Check for Boundary Mismatch between Declared Target N and Equation Steps
  // e.g. User wrote "If i take a number as 3", but wrote 4 addition steps up to 4 (6+4=10)
  if (declaredN !== undefined && arith.hasEquations && arith.isSequentialAccumulation) {
    const expectedSumForDeclared = (declaredN * (declaredN + 1)) / 2;

    if (arith.maxN > declaredN) {
      return {
        isCorrect: false,
        hasAccumulation: true,
        hasFormula: false,
        hasTargetMismatch: true,
        feedback: `Look closely at your steps: you chose ${declaredN} as your test number (n = ${declaredN}), which means we only add the numbers from 1 up to ${declaredN} (1, 2${declaredN > 2 ? `, ${declaredN}` : ''}).\n\nFor n = ${declaredN}, the running total stops at ${expectedSumForDeclared}:\n${buildTraceExample(declaredN)}\n\nYour step "${arith.equations[arith.equations.length - 1]?.line || `+ ${arith.maxN}`}" added ${arith.maxN}, which calculates the sum for n = ${arith.maxN} (${arith.finalSum}) instead of ${declaredN}!\n\nTo fix this:\n• Either remove the extra step beyond ${declaredN} so the final sum is ${expectedSumForDeclared}.\n• Or change your starting number to ${arith.maxN} if you wish to calculate the sum of ${arith.maxN}.`,
        correction: `For n = ${declaredN}, only add numbers up to ${declaredN} (the sum of ${declaredN} is ${expectedSumForDeclared}).`,
        suggestedInput: `If i take a number as ${declaredN}\n\n${buildTraceExample(declaredN)}\nThe sum of ${declaredN} is ${expectedSumForDeclared}`
      };
    }

    if (arith.maxN < declaredN) {
      return {
        isCorrect: false,
        hasAccumulation: true,
        hasFormula: false,
        hasTargetMismatch: true,
        feedback: `You chose ${declaredN} as your test number (n = ${declaredN}), but your additions currently stop at ${arith.maxN} (running total = ${arith.finalSum}). To find the complete sum of ${declaredN}, keep adding the remaining numbers until you reach ${declaredN}!`,
        correction: `Continue accumulating up to ${declaredN}: next add ${arith.maxN + 1}...`,
        suggestedInput: `If i take a number as ${declaredN}\n\n${buildTraceExample(declaredN)}\nThe sum of ${declaredN} is ${expectedSumForDeclared}`
      };
    }
  }

  // 6. Check Stated Sum without explicit target in phrase (e.g. "The sum is 10" while declared n is 3)
  if (declaredN !== undefined && statedSumInfo && statedSumInfo.targetN === undefined) {
    const expectedSumForDeclared = (declaredN * (declaredN + 1)) / 2;
    if (statedSumInfo.statedSum !== expectedSumForDeclared) {
      return {
        isCorrect: false,
        hasAccumulation: arith.hasEquations,
        hasFormula: false,
        hasSumMismatch: true,
        feedback: `You chose ${declaredN} as your test number (n = ${declaredN}). The sum of the first ${declaredN} numbers is ${expectedSumForDeclared}, not ${statedSumInfo.statedSum}! Please correct your final total.`,
        correction: `For n = ${declaredN}, the total sum is ${expectedSumForDeclared}.`,
        suggestedInput: `The sum of ${declaredN} is ${expectedSumForDeclared}`
      };
    }
  }

  // 7. If user traced valid sequential accumulation equations (e.g. 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15)
  // and no target or sum mismatches were found
  if (arith.hasEquations && arith.allEquationsValid && arith.isSequentialAccumulation) {
    const targetN = declaredN ?? statedSumInfo?.targetN ?? arith.maxN;
    const expectedSum = (targetN * (targetN + 1)) / 2;

    if (arith.finalSum === expectedSum) {
      return {
        isCorrect: true,
        hasAccumulation: true,
        hasFormula: false,
        feedback: `🎉 Logic Successful! Fantastic work! You have clearly demonstrated how the numbers from 1 to ${targetN} accumulate step by step into the running total (ending with a sum of ${expectedSum}). You're ready to proceed to the Recipe stage to sequence this into an algorithm!`,
        correction: 'Proceed to the Recipe stage to write the step-by-step instructions.'
      };
    }
  }

  // 6. User wrote verbal sequential accumulation
  const describesAccumulation =
    (norm.includes('start') || norm.includes('initial')) &&
    (norm.includes('0') || norm.includes('zero')) &&
    (norm.includes('add') || norm.includes('accumulat') || norm.includes('sum')) &&
    (norm.includes('1 to n') || norm.includes('each number') || norm.includes('next number'));

  if (describesAccumulation) {
    return {
      isCorrect: true,
      hasAccumulation: true,
      hasFormula: false,
      feedback: `🎉 Logic Successful! Excellent explanation! You've captured the core principle of sequential accumulation: starting with a total of 0 and continuously adding each successive number from 1 up to n. Proceed to the Recipe stage!`,
      correction: 'Proceed to the Recipe stage to sequence the steps.'
    };
  }

  // 7. Formula shortcut check: n*(n+1)/2
  const hasFormula = /\bn\s*\*\s*\(\s*n\s*\+\s*1\s*\)\s*\/\s*2/i.test(text) || /\(n\s*\*\s*\(n\s*\+\s*1\)\)\s*\/\s*2/i.test(text);
  if (hasFormula) {
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: true,
      feedback: `You've identified the mathematical shortcut formula n*(n+1)/2! While that formula works instantly in pure mathematics, in programming we build algorithmic logic step-by-step through sequential accumulation. Explain or trace how a running total starts at 0 and adds 1, 2, 3... up to n.`,
      correction: 'Explain how the total accumulates step by step starting from 0, or trace manual additions like 0+1=1, 1+2=3, 3+3=6...',
      suggestedInput: 'If n=5: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15'
    };
  }

  return {
    isCorrect: false,
    hasAccumulation: arith.hasEquations,
    hasFormula: false
  };
}

/**
 * Checks for programming keywords, syntax words, or code operators in Recipe text
 */
export function checkProgrammingWordsInRecipe(text: string): { hasProgrammingWords: boolean; foundWords: string[] } {
  const norm = (text || '').toLowerCase();
  const foundWords: string[] = [];

  const checks = [
    { label: 'loop', regex: /\bloop(?:s|ing)?\b/i },
    { label: 'while', regex: /\bwhile\b/i },
    { label: 'for', regex: /\bfor\s+(?:loop|each|[a-z]\b|\()/i },
    { label: 'counter i / i', regex: /\b(?:counter\s+i|variable\s+i|\bi\s*=\s*\d|\bi\+\+|\bi\s*<=|\bi\s*<)/i },
    { label: 'variable', regex: /\bvariable(?:s)?\b/i },
    { label: 'sum +=', regex: /\bsum\s*(?:\+=)/i },
    { label: 'code operator (++)', regex: /\+\+/ },
    { label: 'semicolon (;)', regex: /;\s*$/m }
  ];

  for (const c of checks) {
    if (c.regex.test(norm) && !foundWords.includes(c.label)) {
      foundWords.push(c.label);
    }
  }

  return {
    hasProgrammingWords: foundWords.length > 0,
    foundWords
  };
}

/**
 * Validates Recipe stage input for Sum of N Numbers.
 * Requires 5 distinct atomic steps in plain English:
 * Step 1: Get the input number n
 * Step 2: Start with total sum as 0 and current number as 1
 * Step 3: Move to the next number and repeat until reaching n
 * Step 4: Add the current number to the total sum
 * Step 5: Display the final total sum
 * 
 * Enforces NO PROGRAMMING WORDS (avoid 'loop', 'for', 'while', 'counter i', 'int').
 * Enforces splitting addition and repetition into 2 separate steps.
 */
export function validateSumOfNRecipe(text: string) {
  const norm = (text || '').toLowerCase();
  const prog = checkProgrammingWordsInRecipe(text);

  const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);

  let hasStep1 = false;
  let hasStep2 = false;
  let hasStep3 = false;
  let hasStep4 = false;
  let hasStep5 = false;
  let hasCombinedStep3 = false;

  // Step 1: Read input number n
  hasStep1 = lines.some(l => {
    const s = l.toLowerCase();
    return (
      (/\b(?:input|read|get|take|enter|ask)\b/i.test(s) && /\b(?:n|number)\b/i.test(s)) ||
      (/\bstep\s*1\b/i.test(s) && /\b(?:input|number|n|user)\b/i.test(s)) ||
      (/\b(?:get|read|take|ask)\s+(?:the\s+)?(?:input|number|n)\b/i.test(s))
    );
  }) || (/\bstep\s*1\b/i.test(norm) && /\b(?:input|number|n)\b/i.test(norm)) ||
     /\b(?:input|read|get|take|enter|ask)\b[\s\S]*?\b(?:n|number)\b/i.test(norm);

  // Step 2: Start total sum = 0 and current number = 1
  hasStep2 = lines.some(l => {
    const s = l.toLowerCase();
    return (s.includes('sum') || s.includes('total')) &&
           (s.includes('0') || s.includes('zero')) &&
           (s.includes('1') || s.includes('one') || s.includes('start') || s.includes('first') || s.includes('counter') || s.includes('number'));
  }) || ((norm.includes('sum') || norm.includes('total')) &&
         (norm.includes('0') || norm.includes('zero')) &&
         (norm.includes('1') || norm.includes('one') || norm.includes('start') || norm.includes('first') || norm.includes('counter')));

  // Inspect Step 3, Step 4, and Step 5 lines
  let step3Line = '';
  let step4Line = '';
  let step5Line = '';

  for (const line of lines) {
    const l = line.toLowerCase();
    if (/^step\s*3\b/i.test(l)) step3Line = l;
    if (/^step\s*4\b/i.test(l)) step4Line = l;
    if (/^step\s*5\b/i.test(l)) step5Line = l;
  }

  // Did user combine adding AND repeating into a single step?
  if ((step3Line && (step3Line.includes('add') || step3Line.includes('sum')) &&
      (step3Line.includes('loop') || step3Line.includes('repeat') || step3Line.includes('1 to n') || step3Line.includes('until'))) ||
      (step4Line && (step4Line.includes('add') || step4Line.includes('sum')) &&
      (step4Line.includes('loop') || step4Line.includes('repeat') || step4Line.includes('1 to n') || step4Line.includes('until')))) {
    if (!step5Line && (step4Line.includes('print') || step4Line.includes('display') || step4Line.includes('output') || step4Line.includes('show'))) {
      hasCombinedStep3 = true;
    }
  }

  // General presence of actions
  const hasRepeat = norm.includes('repeat') || norm.includes('next number') || norm.includes('advance') || norm.includes('increment') || norm.includes('until n') || (norm.includes('repeat') && norm.includes('n'));
  const hasAdd = (norm.includes('add') || norm.includes('accumulate') || norm.includes('plus')) && (norm.includes('sum') || norm.includes('total'));

  if (hasCombinedStep3) {
    hasStep3 = true;
    hasStep4 = false;
    hasStep5 = /\b(?:print|display|output|show|return)\b.*\b(?:sum|total)\b/i.test(norm);
  } else {
    // Step 3: Move to the next number and repeat until reaching n
    hasStep3 = hasRepeat;
    // Step 4: Add the current number to the total sum
    hasStep4 = hasAdd;
    // Step 5: Display the final total sum
    hasStep5 = (norm.includes('print') || norm.includes('display') || norm.includes('output') || norm.includes('show') || norm.includes('return')) &&
               (norm.includes('sum') || norm.includes('total') || norm.includes('result'));
  }

  const recipeStepProgress = [
    { stepNumber: 1, title: 'Read input number n', completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: 'Start total sum = 0 and number = 1', completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: 'Move to next number & repeat until n', completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: 'Add current number to total sum', completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 },
    { stepNumber: 5, title: 'Display the final total sum', completed: hasStep5, current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasStep5 }
  ];

  const allStepsDone = hasStep1 && hasStep2 && hasStep3 && hasStep4 && hasStep5 && !prog.hasProgrammingWords && !hasCombinedStep3;

  return {
    hasStep1,
    hasStep2,
    hasStep3,
    hasStep4,
    hasStep5,
    hasCombinedStep3,
    hasProgrammingWords: prog.hasProgrammingWords,
    foundProgrammingWords: prog.foundWords,
    allStepsDone,
    recipeStepProgress
  };
}

/**
 * Validates Ingredients stage input for Sum of N Numbers.
 * Requires all 5 core programming ingredients:
 * 1. Input variable: n (or number/input)
 * 2. Accumulator variable: sum = 0 (or total initialized to 0)
 * 3. Counter variable: i = 1 (or counter initialized to 1)
 * 4. Loop construct: for loop or while loop
 * 5. Operators: +, +=, =, <=
 */
export function validateSumOfNIngredients(text: string) {
  const norm = (text || '').toLowerCase();

  // Exclude conversational English pronouns and questions where 'i' appears in regular conversational prose
  // e.g. "I need", "how do I", "if I", "can I", "what should I", "I want", "I think", "I am", "I will", "an input"
  const cleanForCounter = norm.replace(/\b(?:how\s+do\s+i|can\s+i|should\s+i|if\s+i|i\s+(?:need|want|think|have|will|can|am|take|know|start|see|use|must|should))\b/gi, ' ');

  // 1. Input variable n:
  // Must specifically name the variable as 'n' (or 'input n', 'variable n', 'int n', 'number n', 'n = input')
  // Cannot just be the generic English words "a variable for the input" without naming 'n'
  const hasInputVar = (
    /\b(?:variable|var|input|int|let)?\s*[:=]?\s*n\b/i.test(norm) &&
    /\bn\b/i.test(norm) &&
    !/\b(?:not|no)\s+n\b/i.test(norm) &&
    (/\b(?:variable|var|input|int|number|integer|integer\s+input|input\s+integer)\b/i.test(norm) ||
     /\bn\s*(?:=|:|\(|\s+as\b|\s+is\b)/i.test(norm) ||
     /\bvariables?\s*:[^.\n]*\bn\b/i.test(norm) ||
     /\bn\s*,\s*sum/i.test(norm))
  );

  // 2. Accumulator sum initialized to 0:
  // Must name 'sum' or 'total' AND initial value 0 (or 'zero', 'initialized to 0', 'starts at 0')
  const hasAccumulator = (
    /\bsum\s*(?:=|:|\()\s*0/i.test(norm) ||
    /\b(?:sum|total)\s*(?:initialized\s+to\s+0|starts?\s+at\s+0|= 0|is 0)\b/i.test(norm) ||
    (/\b(?:sum|total)\b/i.test(norm) && (norm.includes('0') || norm.includes('zero')) && (norm.includes('accumulator') || norm.includes('accumulate') || norm.includes('running') || norm.includes('init') || norm.includes('start'))) ||
    (/\baccumulator\b/i.test(norm) && (norm.includes('sum') || norm.includes('total') || norm.includes('0') || norm.includes('zero')))
  );

  // 3. Counter variable i initialized to 1:
  // Must specifically name counter or 'i' or 'num/number' AND starting value 1 (or 'counter i', 'i = 1', 'loop counter', 'starting num=1', 'number=1', 'start=1')
  const hasCounter = (
    /\bi\s*=\s*1\b/i.test(norm) ||
    /\bi\s*:\s*1\b/i.test(norm) ||
    /\b(?:starting\s+)?num(?:ber)?\s*[:=]?\s*1\b/i.test(norm) ||
    /\b(?:starting\s+)?num(?:ber)?\s*(?:starts?\s*at|starting\s*at|starting\s*from|from)\s*1\b/i.test(norm) ||
    /\bstart(?:ing)?(?:\s*value|\s*num(?:ber)?)?\s*[:=]?\s*1\b/i.test(norm) ||
    /\bstarts?\s*(?:at|from)\s*1\b/i.test(norm) ||
    /\bstarting\s+num\b/i.test(norm) ||
    /\b(?:counter|count|variable)\s+i\b/i.test(cleanForCounter) ||
    /\bi\s*\(\s*(?:loop\s*)?counter\b/i.test(cleanForCounter) ||
    /\b(?:loop\s*)?counter\s*(?:i\b|[:=]\s*1\b|starts?\s*(?:at|from)\s*1\b)/i.test(cleanForCounter) ||
    (/\bi\b/i.test(cleanForCounter) && /\b(?:counter|starts?\s*(?:at|from)\s*1|initialized\s*to\s*1|from\s*1\s*to\s*n)\b/i.test(cleanForCounter))
  );

  // 4. Loop construct:
  // Must name specific loop construct: 'for loop' or 'while loop' (or 'for / while', 'loop construct: while')
  // Cannot just be "a way to repeat" or "repeat the addition"
  const hasLoopConstruct = (
    /\bfor\s*loop\b/i.test(norm) ||
    /\bwhile\s*loop\b/i.test(norm) ||
    /\b(?:for|while)\s*(?:\/|or)\s*(?:while|for)\b/i.test(norm) ||
    /\bconstructs?\s*:[^.\n]*\b(?:for|while)\b/i.test(norm) ||
    /\bloop\s*construct\b/i.test(norm) ||
    (/\b(?:for|while)\b/i.test(norm) && (norm.includes('loop') || norm.includes('construct')))
  );

  // 5. Main Sum Accumulation / Operators (sum = sum + i / operators + and =):
  // Must describe the actual step of adding current number into the running sum or naming operators for it.
  // CRITICAL: Loop step increment like 'next step=+1' or 'step = +1' or 'i++' does NOT count as the sum accumulation step!
  // CRITICAL: Must use the loop iterator variable 'i' (or 'num'/'current number').
  // REJECT using 'startnum', 'starting num', 'start', '1', or 'n' in the accumulation expression!

  const hasWrongSumAccumulation = (
    /\b(?:sum|total)\s*=\s*(?:sum|total)\s*\+\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|n\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+=\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|n\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|n\b)/i.test(norm)
  );

  const hasValidSumAccumulation = (
    // Explicit sum accumulation assignments/expressions using loop iterator variable i (or num / current number):
    /\b(?:sum|total)\s*=\s*(?:sum|total)\s*\+\s*(?:i\b|num\b|number\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+=\s*(?:i\b|num\b|number\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+\s*(?:i\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    // Plain English description of adding current loop number into sum:
    /\badd\s+(?:the\s+)?(?:current\s+num(?:ber)?|i|loop\s+counter)\s+(?:in)?to\s+(?:the\s+)?(?:total\s+)?sum\b/i.test(norm) ||
    /\b(?:accumulate|accumulating)\s+(?:the\s+)?(?:current\s+num(?:ber)?|i)\s+(?:in)?to\s+(?:the\s+)?(?:total\s+)?sum\b/i.test(norm) ||
    /\b(?:sum|total)\s+plus\s+i\b/i.test(norm)
  );

  const hasSumAccumulation = hasValidSumAccumulation && !hasWrongSumAccumulation;

  const hasOperators = hasSumAccumulation;

  const ingredientsStepProgress = [
    { stepNumber: 1, title: 'Input Variable: n', completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: 'Accumulator: sum = 0', completed: hasAccumulator, current: hasInputVar && !hasAccumulator },
    { stepNumber: 3, title: 'Loop Construct: for / while loop', completed: hasLoopConstruct, current: hasInputVar && hasAccumulator && !hasLoopConstruct },
    { stepNumber: 4, title: 'Loop Controls: i (start: 1, end: n)', completed: hasCounter, current: hasInputVar && hasAccumulator && hasLoopConstruct && !hasCounter },
    { stepNumber: 5, title: 'Sum Update: sum = sum + i', completed: hasSumAccumulation, current: hasInputVar && hasAccumulator && hasLoopConstruct && hasCounter && !hasSumAccumulation }
  ];

  const completedCount = [hasInputVar, hasAccumulator, hasLoopConstruct, hasCounter, hasSumAccumulation].filter(Boolean).length;
  const allIngredientsDone = hasInputVar && hasAccumulator && hasLoopConstruct && hasCounter && hasSumAccumulation;

  const hasLoopParams = (
    /\bstart\b/i.test(norm) &&
    /\bend\b/i.test(norm) &&
    (/\bnext\s*step\b/i.test(norm) || /\bstep\b/i.test(norm) || /\bincrement\b/i.test(norm))
  );

  let feedback = '';
  let correction = '';
  const suggestedInput = 'Step 1: n (input integer)\nStep 2: sum = 0 (accumulator)\nStep 3: for loop\nStep 4: start = 1, end = n, next step = +1\nStep 5: sum = sum + i (operators: + and =)';

  if (allIngredientsDone) {
    feedback = "🎉 Ingredients Verified! Brilliant work! You've identified all 5 essential programming ingredients, including the main step to accumulate the total sum:\n• Input variable n\n• Accumulator sum = 0\n• Loop construct (for loop or while loop)\n• Loop controls: start = 1, end = n, next step = +1 (loop variable i)\n• Main sum accumulation step: sum = sum + i (operators: + and =)\n\nYou're ready to proceed to Taste the Sample stage to assemble your code!";
    correction = 'Proceed to Taste the Sample stage to assemble your code!';
  } else if (completedCount === 0) {
    feedback = "In the Ingredients stage, we need to list the exact programming tools, variables, loops, and operators required to build our code.\n\nPlease list all 5 essential ingredients:\n1. Input variable: n (to store user input)\n2. Accumulator: sum = 0 (starts at 0 to collect the running total)\n3. Loop construct: for loop or while loop\n4. Loop controls: start = 1, end = n, next step = +1 (loop variable i)\n5. Main sum step: sum = sum + i (operators: + or +=, =)";
    correction = 'List the variables (n, sum = 0), loop construct (for/while loop), loop parameters (start = 1, end = n, next step = +1), and sum update step (sum = sum + i).';
  } else {
    const missing: string[] = [];
    if (!hasInputVar) missing.push('Input variable n');
    if (!hasAccumulator) missing.push('Accumulator variable sum = 0');
    if (!hasLoopConstruct) missing.push('Loop construct (for loop or while loop)');
    if (!hasCounter) missing.push('Loop controls: start = 1, end = n, next step = +1 (loop variable i)');
    if (!hasSumAccumulation) {
      missing.push('Main sum calculation step: sum = sum + i (or sum += i) using addition (+) and assignment (=)');
    }

    if (hasWrongSumAccumulation) {
      feedback = "⚠️ In Step 5, you wrote `sum = sum + startnum` (or starting number / constant).\n\nNotice that in your loop (`for loop(i)`), the loop variable that changes on each iteration is `i`! `startnum` is only the initial starting value (1) and does not increase inside the loop. If you write `sum = sum + startnum`, the loop will just add 1 every single time instead of adding each number (1, 2, 3... up to n)!\n\nTo correctly accumulate each number from the loop into the running total, use the loop variable `i`:\n`sum = sum + i` (or `sum += i`).";
      correction = "In Step 5, change your sum step to use the loop variable i: sum = sum + i (or sum += i).";
    } else if (hasLoopConstruct && !hasSumAccumulation && hasInputVar && hasAccumulator && hasCounter) {
      if (hasLoopParams) {
        feedback = "🌟 You are doing a wonderful job defining the boundaries for your loop! You have correctly identified the start (1), end (n), and next increment step (+1).\n\nNow, the main step is missing: inside the loop, we need to accumulate each number into our total sum using:\n`sum = sum + i` (or `sum += i`).\n\n💡 Why do we write `sum = sum + i`?\n• `sum` on the right side holds the previous total collected so far.\n• In each loop iteration, `i` holds the current number (1, 2, 3... up to n).\n• When we add `+ i`, the computer calculates the updated new total.\n• The assignment operator (`=`) then stores this updated new total back into `sum`.\n• If we only wrote `sum = i`, the earlier numbers would be overwritten and lost!\n• That is why we use `sum = sum + i` (or `sum += i`) to accumulate the running total.";
        correction = "Add the main step to update sum: sum = sum + i (or sum += i) using addition (+) and assignment (=).";
      } else {
        feedback = "🌟 You are doing a fantastic job identifying the components! Using a for loop is exactly the right construct for repetition.\n\nIn your for loop, make sure to specify what are the values for start, end, and next step:\n• Start value: 1 (starts at 1)\n• End value: n (or n + 1 in Python range to reach n)\n• Next step: increment by 1 (advances to the next number each step)\n\nAlso, inside the loop we need to accumulate each number into the total sum using `sum = sum + i` (or `sum += i`).\n\n💡 Why `sum = sum + i`? Because `sum` holds our previous total, `i` is the current number from the loop, and adding them together updates `sum` without losing earlier numbers!";
        correction = "In your for loop, specify start = 1, end = n (or n + 1 in range), next step = increment by 1, and the main sum step: sum = sum + i.";
      }
    } else {
      feedback = `Good progress! You've identified ${completedCount} of 5 ingredients.\n\nPlease add the remaining ingredients:\n` +
        missing.map((m) => `• ${m}`).join('\n');
      correction = `Add the missing ingredients: ${missing.join(', ')}.`;
    }
  }

  return {
    hasInputVar,
    hasAccumulator,
    hasCounter,
    hasLoopConstruct,
    hasOperators,
    hasWrongSumAccumulation,
    completedCount,
    allIngredientsDone,
    ingredientsStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

/**
 * Validates Taste the Sample prototype code for Sum of N Numbers.
 * Supports Python, JavaScript, Java, C/C++.
 * Enforces step-by-step guidance without dumping full solutions.
 * Shows only for-loop syntax template when explicitly asked for syntax.
 */
export function validateSumOfNSampleCode(text: string, attemptCount: number = 1) {
  const norm = (text || '').toLowerCase().trim();

  const hasInput = (
    /(?:int\s+)?n\s*=\s*(?:int\(input\(\)\)|[0-9]+|parseInt|prompt|scanner|cin)/i.test(text) ||
    /\b(?:let|const|var|int)?\s*n\s*=/i.test(text) ||
    /\b(?:input\(\)|scanner|cin|prompt)\b/i.test(norm)
  );

  const hasAccumulator = (
    /(?:let|const|var|int\s+)?(?:sum|total|sum_val)\s*=\s*0\b/i.test(text)
  );

  const isSyntaxQuery = (
    norm.includes('syntax') ||
    norm.includes('syntax theriyala') ||
    norm.includes('syntax theriyathunu') ||
    norm.includes('syntax enna') ||
    norm.includes('how to write for loop') ||
    norm.includes('how to write loop') ||
    norm.includes('for loop syntax') ||
    norm.includes('loop syntax') ||
    norm.includes('syntax help') ||
    norm.includes("don't know syntax") ||
    norm.includes('dont know syntax') ||
    norm.includes('loop theriyala') ||
    norm.includes('did not know how to write loop') ||
    norm.includes("don't know how to write loop") ||
    norm.includes('dont know how to write loop') ||
    norm.includes('loop example')
  );

  if (isSyntaxQuery) {
    const loopExamples = `\n\n🐍 **Python:**\n\`\`\`python\nfor i in range(1, n + 1):\n\`\`\`\n\n💻 **JavaScript:**\n\`\`\`javascript\nfor (let i = 1; i <= n; i++) {\n}\n\`\`\`\n\n☕ **Java / C:**\n\`\`\`java\nfor (int i = 1; i <= n; i++) {\n}\n\`\`\``;

    if (hasInput && hasAccumulator) {
      return {
        hasInput: true,
        hasAccumulator: true,
        hasLoop: false,
        hasSumUpdate: false,
        hasPrint: false,
        completedCount: 2,
        allVerified: false,
        isSyntaxQuery: true,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: 'Input Variable (n)', completed: true, current: false },
          { stepNumber: 2, title: 'Accumulator (sum = 0)', completed: true, current: false },
          { stepNumber: 3, title: 'Loop Construct (1 to n)', completed: false, current: true },
          { stepNumber: 4, title: 'Accumulate Sum (sum += i)', completed: false, current: false },
          { stepNumber: 5, title: 'Display Sum (print / output)', completed: false, current: false }
        ],
        feedback: `🌟 Coach Maya here! Happy to help you with the loop! It is completely normal for loop syntax to feel tricky at first.\n\nSince you have already set up your input \`n\` and accumulator \`sum = 0\`, here are clear examples of how to write the loop:${loopExamples}\n\n👉 **Next Step:** Try adding the loop to your code! You can also click **Insert Prototype Example** below.`,
        correction: "Step 3: Add your for loop iterating from 1 to n.",
        suggestedInput: "for (let i = 1; i <= n; i++)"
      };
    }

    return {
      hasInput: false,
      hasAccumulator: false,
      hasLoop: false,
      hasSumUpdate: false,
      hasPrint: false,
      completedCount: 0,
      allVerified: false,
      isSyntaxQuery: true,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: 'Input Variable (n)', completed: false, current: true },
        { stepNumber: 2, title: 'Accumulator (sum = 0)', completed: false, current: false },
        { stepNumber: 3, title: 'Loop Construct (1 to n)', completed: false, current: false },
        { stepNumber: 4, title: 'Accumulate Sum (sum += i)', completed: false, current: false },
        { stepNumber: 5, title: 'Display Sum (print / output)', completed: false, current: false }
      ],
      feedback: `🌟 Coach Maya here! Happy to help with the loop syntax! Here is how to write the loop:${loopExamples}\n\nNow try assembling your prototype step by step: start with declaring \`n\` and \`sum = 0\`!`,
      correction: "Start with Step 1 & 2: declare input n and accumulator sum = 0.",
      suggestedInput: "for i in range(1, n + 1):"
    };
  }

  // Strict validation for loops (supports i = 0 or i = 1, and 1 to n+1 / 0 to n+1)
  const validJsJavaLoop = /for\s*\(\s*(?:(?:let|var|const|int)\s+)?[a-zA-Z_]\w*\s*=\s*(?:0|1)\s*;\s*[a-zA-Z_]\w*\s*(?:<=|<)\s*(?:n|[0-9]+|\w+)\s*;\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1|[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*\+\s*1)\s*\)/i.test(text);
  const validPythonRange = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:0\s*,\s*)?(?:1\s*,\s*)?(?:n\s*\+\s*1|[0-9]+)\s*\)/i.test(text);
  const pythonRangeWithoutPlusOne = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:0\s*,\s*)?1\s*,\s*n\s*\)/i.test(text);
  const validWhileLoop = /while\s*\(?\s*[a-zA-Z_]\w*\s*(?:<=|<)\s*(?:n|[0-9]+)\s*\)?/i.test(text);

  // Specific loop syntax / logic errors
  const hasColonInFor = /for\s*\([^)]*:[^)]*\)/i.test(text);
  const hasIncrementInCondition = /for\s*\([^;:]*[:;]\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1)\s*[:;]/i.test(text);
  const hasInvertedCondition = /for\s*\([^)]*(?:>=|>)\s*(?:5|n|[0-9]+)[^)]*\)|while\s*\(?[^)]*(?:>=|>)\s*(?:5|n|[0-9]+)\)?/i.test(text);
  const pythonRangeZero = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:n|[0-9]+)\s*\)/i.test(text);
  const hasDecrement = /for\s*\([^)]*--[^)]*\)/i.test(text);
  const hasLoopAttempt = /for\s*\(|for\s+[a-zA-Z_]\w*|while\s*\(|while\s+[a-zA-Z_]\w*/i.test(text);

  let loopErrorFeedback = '';
  let loopErrorCorrection = '';
  let loopSuggested = 'for (let i = 1; i <= n; i++)';

  if (hasColonInFor && hasIncrementInCondition) {
    loopErrorFeedback = "⚠️ In Step 3, your `for` loop has two syntax issues:\n1. In JavaScript/Java, the 3 parts of a `for` loop must be separated by semicolons (`;`), not colons (`:`).\n2. The standard order is `for (initialization; condition; update)`. You placed the increment (`i++`) in the middle position instead of the end!\n3. Also, your condition `i >= 5` is inverted (it should be `i <= n` or `i <= 5`).\n\nCorrect syntax structure:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = "Fix for loop syntax: for (let i = 1; i <= n; i++)";
    loopSuggested = "for (let i = 1; i <= n; i++)";
  } else if (hasColonInFor) {
    loopErrorFeedback = "⚠️ In JavaScript/Java, the three parts of a `for` loop must be separated by semicolons (`;`), not colons (`:`).\n\nStructure:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = "Use semicolons (;) in for loop: for (let i = 1; i <= n; i++)";
    loopSuggested = "for (let i = 1; i <= n; i++)";
  } else if (hasIncrementInCondition) {
    loopErrorFeedback = "⚠️ In a `for` loop, the structure is:\n`for (initialization; condition; update)`\n\nYou placed the increment (`i++`) in the middle (condition) position! Place the condition (`i <= n`) second and the increment (`i++`) third:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = "Place condition second and increment last: for (let i = 1; i <= n; i++)";
    loopSuggested = "for (let i = 1; i <= n; i++)";
  } else if (hasInvertedCondition) {
    loopErrorFeedback = "⚠️ In your loop condition, you wrote `i >= 5` (or `i >= n`). Since `i` starts at 1, the condition `1 >= 5` is immediately false, so the loop will never execute even once! To count from 1 up to n, use `i <= n` (or `i <= 5`):\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = "Change loop condition from >= to <= (e.g. i <= n).";
    loopSuggested = "for (let i = 1; i <= n; i++)";
  } else if (hasDecrement) {
    loopErrorFeedback = "⚠️ To count up from 1 to n, you need to increment with `i++` (or `i += 1`) instead of decrementing (`i--`).";
    loopErrorCorrection = "Use i++ instead of i--.";
    loopSuggested = "for (let i = 1; i <= n; i++)";
  } else if (pythonRangeWithoutPlusOne && !validPythonRange) {
    loopErrorFeedback = "⚠️ In Python, `range(1, n)` stops at `n - 1` (for example, `range(1, 5)` only reaches 4). To include `n` (or 5) in the sum, use `range(1, n + 1)`:\n`for i in range(1, n + 1):`";
    loopErrorCorrection = "Use range(1, n + 1) in Python to include n.";
    loopSuggested = "for i in range(1, n + 1):";
  } else if (pythonRangeZero && !validPythonRange) {
    loopErrorFeedback = "⚠️ In Python, `range(n)` starts at 0 and stops at `n - 1`. To sum numbers starting from 1 up to `n`, specify start 1: `range(1, n + 1)`:\n`for i in range(1, n + 1):`";
    loopErrorCorrection = "Use range(1, n + 1) to iterate from 1 to n.";
    loopSuggested = "for i in range(1, n + 1):";
  }

  const hasLoop = (validJsJavaLoop || validPythonRange || validWhileLoop) && !hasColonInFor && !hasIncrementInCondition && !hasInvertedCondition && !hasDecrement;

  // Extract loop variable (default 'i')
  const loopVarMatch = text.match(/for\s*\(\s*(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=/i) ||
                       text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range/i) ||
                       text.match(/while\s*\(?\s*([a-zA-Z_]\w*)\s*(?:<=|<)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : 'i';

  // Valid accumulator updates strictly using the loop variable (e.g. sum += i or sum = sum + i)
  const validSumUpdateRegex = new RegExp(`(?:sum|total|sum_val)\\s*(?:\\+=\\s*${loopVar}|=\\s*(?:sum|total|sum_val)\\s*\\+\\s*${loopVar})\\b`, 'i');
  const hasValidSumUpdate = validSumUpdateRegex.test(text);

  // Check specific incorrect sum updates
  const hasSumOverwriteNPlusI = /(?:sum|total|sum_val)\s*=\s*(?:n\s*\+\s*[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+\s*n)\b/i.test(text);
  const hasSumAddN = /(?:sum|total|sum_val)\s*(?:\+=\s*n|=\s*(?:sum|total|sum_val)\s*\+\s*n)\b/i.test(text);
  const hasSumAddConstantNum = /(?:sum|total|sum_val)\s*(?:\+=\s*[0-9]+|=\s*(?:sum|total|sum_val)\s*\+\s*[0-9]+)\b/i.test(text);
  const hasSumAddStartNum = /(?:sum|total|sum_val)\s*(?:\+=\s*start\w*|=\s*(?:sum|total|sum_val)\s*\+\s*start\w*)\b/i.test(text);
  const hasSumOverwriteI = /(?:sum|total|sum_val)\s*=\s*[a-zA-Z_]\w*(?:\s*\+\s*1)?\s*(?:;|\n|$)/i.test(text) && !validSumUpdateRegex.test(text) && !hasSumOverwriteNPlusI;

  let sumErrorFeedback = '';
  let sumErrorCorrection = '';
  let sumSuggested = `    sum += ${loopVar};`;

  if (hasSumOverwriteNPlusI && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = n + ${loopVar}\`.\n\nNotice that this overwrites \`sum\` on every iteration with \`n + ${loopVar}\` instead of accumulating into the running total! To add each number into the existing sum, add \`${loopVar}\` to \`sum\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change sum = n + ${loopVar} to sum = sum + ${loopVar} (or sum += ${loopVar}).`;
    sumSuggested = `    sum += ${loopVar};`;
  } else if (hasSumAddN && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = sum + n\` (or \`sum += n\`).\n\nNotice that \`n\` is the fixed limit (e.g. 5). If you write \`sum = sum + n\`, the loop will add 5 every single time (5 + 5 + 5 + 5 + 5 = 25) instead of adding each incrementing number (1 + 2 + 3 + 4 + 5 = 15)!\n\nTo accumulate each number from the loop, add the loop variable \`${loopVar}\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change sum = sum + n to sum = sum + ${loopVar} (or sum += ${loopVar}).`;
    sumSuggested = `    sum += ${loopVar};`;
  } else if (hasSumOverwriteI && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = ${loopVar}\`. This overwrites \`sum\` with \`${loopVar}\` rather than adding \`${loopVar}\` to the accumulated \`sum\`.\n\nUse:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change to sum = sum + ${loopVar} (or sum += ${loopVar}).`;
    sumSuggested = `    sum += ${loopVar};`;
  } else if (hasSumAddConstantNum && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you added a constant number to \`sum\`. A constant does not change across loop iterations!\n\nTo add each number from 1 to n, add your loop variable \`${loopVar}\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Add the loop variable ${loopVar} to sum: sum = sum + ${loopVar}.`;
    sumSuggested = `    sum += ${loopVar};`;
  } else if (hasSumAddStartNum && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = sum + startnum\`. The starting value remains 1 and does not change. To accumulate each step from the loop, use the loop variable \`${loopVar}\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change startnum to the loop variable ${loopVar}: sum = sum + ${loopVar}.`;
    sumSuggested = `    sum += ${loopVar};`;
  }

  const hasSumUpdate = hasValidSumUpdate && !hasSumAddN && !hasSumAddConstantNum && !hasSumAddStartNum && !hasSumOverwriteNPlusI && !hasSumOverwriteI;

  const sumContainerWords = ['sum', 'total', 'sum_val', 'ans', 'result'];
  const sumContainerPattern = `(?:${sumContainerWords.join('|')})`;

  const hasContainerInPrint = (
    new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${sumContainerPattern}\\b[^)]*\\)`, 'i').test(text) ||
    new RegExp(`cout\\s*<<[^;]*\\b${sumContainerPattern}\\b`, 'i').test(text) ||
    new RegExp(`printf\\s*\\([^)]*\\b${sumContainerPattern}\\b[^)]*\\)`, 'i').test(text)
  );

  const hasPrintedInputInstead = !hasContainerInPrint && (
    /(?:print|console\.log|System\.out\.print(?:ln)?)\s*\([^)]*\bn\b[^)]*\)/i.test(text) ||
    /cout\s*<<[^;]*\bn\b/i.test(text) ||
    /printf\s*\([^)]*\bn\b[^)]*\)/i.test(text)
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

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: 'Input Variable (n)', completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: 'Accumulator (sum = 0)', completed: hasAccumulator, current: hasInput && !hasAccumulator },
    { stepNumber: 3, title: 'Loop Construct (for / while)', completed: hasLoop, current: hasInput && hasAccumulator && !hasLoop },
    { stepNumber: 4, title: 'Accumulate Sum (sum += i)', completed: hasSumUpdate, current: hasInput && hasAccumulator && hasLoop && !hasSumUpdate },
    { stepNumber: 5, title: 'Display Sum (print / output)', completed: hasPrint, current: hasInput && hasAccumulator && hasLoop && hasSumUpdate && !hasPrint }
  ];

  const completedCount = [hasInput, hasAccumulator, hasLoop, hasSumUpdate, hasPrint].filter(Boolean).length;
  const allVerified = hasInput && hasAccumulator && hasLoop && hasSumUpdate && hasPrint;

  let feedback = '';
  let correction = '';
  let suggestedInput = '';

  if (allVerified) {
    feedback = "🎉 Taste the Sample Verified! Fantastic work! Your prototype correctly implements the full algorithm across all 5 steps:\n• Input variable `n`\n• Initial accumulator `sum = 0`\n• Loop iterating from 1 to `n`\n• Accumulator update (`sum += i`)\n• Output printing the final total (`print(sum)`)\n\nYou are fully ready to code and test!";
    correction = "You're ready to code!";
    suggestedInput = '';
  } else if (!hasInput && !hasAccumulator && !hasLoop && !hasSumUpdate && !hasPrint) {
    feedback = "🌟 Welcome to Stage 4: Taste the Sample! Let's assemble our verified ingredients into a working code prototype step by step.\n\n👉 **Step 1 & 2:** Start by declaring your input variable `n` and initializing your accumulator `sum = 0`.";
    correction = "Start with Step 1 & 2: declare your input n and accumulator sum = 0.";
    suggestedInput = "n = int(input())\nsum = 0";
  } else if (!hasInput || !hasAccumulator) {
    feedback = "🌟 Great start! Make sure you have both your input variable `n` and your accumulator `sum = 0` initialized before starting the loop.\n\n👉 Next: Initialize `n` and `sum = 0`.";
    correction = "Initialize input n and sum = 0.";
    suggestedInput = !hasInput ? "n = int(input())" : "sum = 0";
  } else if (!hasLoop) {
    if (loopErrorFeedback) {
      feedback = loopErrorFeedback;
      correction = loopErrorCorrection;
      suggestedInput = loopSuggested;
    } else if (attemptCount >= 3) {
      feedback = `🌟 Coach Maya here! Let's get this loop written together so you can move forward! Here is the exact template you can place after \`n\` and \`sum = 0\`:\n\n💻 **JavaScript:**\n\`\`\`javascript\nfor (let i = 1; i <= n; i++) {\n  sum += i;\n}\n\`\`\`\n\n🐍 **Python:**\n\`\`\`python\nfor i in range(1, n + 1):\n    sum += i\n\`\`\`\n\n👉 **Next Action:** Add this loop right below \`sum = 0\`!`;
      correction = "Step 3: Add your for loop iterating from 1 to n.";
      suggestedInput = "for (let i = 1; i <= n; i++)";
    } else if (attemptCount === 2) {
      feedback = `🌟 Coach Maya checking back! You've got \`n\` and \`sum = 0\` ready. Now we need our counting engine to visit every number from 1 up to \`n\`.\n\nKey parts of the loop:\n• **Start:** \`i = 1\`\n• **Stop Condition:** \`i <= n\` (or \`range(1, n + 1)\` in Python)\n• **Step:** \`i++\`\n\n👉 Try writing the loop header now!`;
      correction = "Step 3: Add your for loop iterating from 1 to n.";
      suggestedInput = "for (let i = 1; i <= n; i++)";
    } else {
      feedback = "🌟 Great job declaring `n` and `sum = 0`!\n\n👉 **Step 3:** Now write your `for` loop to repeat from 1 to `n`.\n\nHere is how you can write the loop in different languages:\n\n🐍 **Python:**\n\`\`\`python\nfor i in range(1, n + 1):\n\`\`\`\n\n💻 **JavaScript:**\n\`\`\`javascript\nfor (let i = 1; i <= n; i++) {\n}\n\`\`\`\n\n☕ **Java / C:**\n\`\`\`java\nfor (int i = 1; i <= n; i++) {\n}\n\`\`\`\n\nTry adding the loop into your code!";
      correction = "Step 3: Add your for loop iterating from 1 to n.";
      suggestedInput = "for (let i = 1; i <= n; i++)";
    }
  } else if (!hasSumUpdate) {
    if (sumErrorFeedback) {
      feedback = sumErrorFeedback;
      correction = sumErrorCorrection;
      suggestedInput = sumSuggested;
    } else if (attemptCount >= 2) {
      feedback = `🌟 Coach Maya checking in! Your loop is running smoothly, but the container \`sum\` isn't receiving the numbers yet.\n\nInside your loop body, write:\n\`sum = sum + ${loopVar};\` (or \`sum += ${loopVar};\`)\n\n💡 Why? On each repetition, this adds the current number \`${loopVar}\` to the running total stored in \`sum\`.`;
      correction = `Step 4: Add sum += ${loopVar} inside the loop.`;
      suggestedInput = `    sum += ${loopVar};`;
    } else {
      feedback = `🌟 Awesome! Your loop is set up cleanly.\n\n👉 **Step 4:** Inside the loop, add the statement to accumulate each number \`${loopVar}\` into \`sum\` (\`sum += ${loopVar}\` or \`sum = sum + ${loopVar}\`).`;
      correction = `Step 4: Add sum += ${loopVar} inside the loop.`;
      suggestedInput = `    sum += ${loopVar};`;
    }
  } else if (!hasPrint) {
    if (hasPrintedInputInstead) {
      feedback = "⚠️ Coach Maya note: Take a close look at your last line where you wrote `print(n)`!\n\n`n` is your original input limit (e.g. 5), whereas your accumulated sum is safely stored in variable `sum`!\n\nIf you print `n`, you will only output the input number instead of the final sum.\n\n👉 **Update your print statement to output your accumulator:**\n`print(sum)` (or `console.log(sum)`)";
      correction = "Change print(n) to print(sum) to output the final sum.";
      suggestedInput = "print(sum)";
    } else if (hasPrintedLoopVarInstead) {
      feedback = `⚠️ Coach Maya note: In Step 5, you printed the loop variable \`${loopVar}\` (\`print(${loopVar})\`). \`${loopVar}\` is only the counter variable! Your accumulated sum is in \`sum\`.\n\n👉 **Update your print statement to output your accumulator:**\n\`print(sum)\``;
      correction = `Change print(${loopVar}) to print(sum).`;
      suggestedInput = "print(sum)";
    } else if (hasAnyOtherPrint) {
      feedback = "⚠️ Coach Maya note: In Step 5, you added an output statement, but make sure to print your accumulator variable `sum` to display the final calculated sum:\n`print(sum)`";
      correction = "Print accumulator: print(sum).";
      suggestedInput = "print(sum)";
    } else if (attemptCount >= 2) {
      feedback = "🌟 Coach Maya here! All the calculations are done! Now we just need to show the result on screen.\n\nAdd this final line after the loop:\n`print(sum)` (or `console.log(sum);`)\n\n👉 You're just one line away from full completion!";
      correction = "Step 5: Add print(sum) to display the final result.";
      suggestedInput = "console.log(sum);";
    } else {
      feedback = "🌟 Almost finished! Your calculation logic is complete.\n\n👉 **Step 5:** After the loop ends, add your output statement (`print(sum)`, `console.log(sum)`, etc.) to display the final calculated sum to the user.";
      correction = "Step 5: Add print(sum) to display the final result.";
      suggestedInput = "console.log(sum);";
    }
  }

  return {
    hasInput,
    hasAccumulator,
    hasLoop,
    hasSumUpdate,
    hasPrint,
    completedCount,
    allVerified,
    isSyntaxQuery: false,
    sampleCodeStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

