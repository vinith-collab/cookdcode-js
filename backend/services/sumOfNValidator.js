function extractDeclaredN(text) {
  if (!text) return void 0;
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    if (!trimmed) continue;
    if (/^\d+\s*\+\s*\d+\s*=\s*\d+/.test(trimmed)) continue;
    if (/^\d+(?:\s*\+\s*\d+)+\s*=\s*\d+/.test(trimmed)) continue;
    if (/^(?:the\s*)?sum\s*(?:of\s*)?/i.test(trimmed)) continue;
    const m1 = trimmed.match(/(?:(?:if\s+(?:i\s+)?)?(?:take|let|choose|assume|consider|set|have|test\s*(?:with|case)?))\s+(?:a\s+)?(?:number|n|input)?\s*(?:as|is|=|be|:|\b)\s*(\d+)\b/i);
    if (m1 && m1[1]) {
      const val = parseInt(m1[1], 10);
      if (val > 0) return val;
    }
    const m2 = trimmed.match(/\bif\s+(?:the\s+)?(?:number|n)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m2 && m2[1]) {
      const val = parseInt(m2[1], 10);
      if (val > 0) return val;
    }
    const m2b = trimmed.match(/\bfor\s+(?:n|number)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m2b && m2b[1]) {
      const val = parseInt(m2b[1], 10);
      if (val > 0) return val;
    }
    const m3 = trimmed.match(/\bn\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m3 && m3[1]) {
      const val = parseInt(m3[1], 10);
      if (val > 0) return val;
    }
    const m4 = trimmed.match(/\b(?:number|input)\s*(?:=|is|as|:)\s*(\d+)\b/i);
    if (m4 && m4[1]) {
      const val = parseInt(m4[1], 10);
      if (val > 0) return val;
    }
  }
  return void 0;
}
function extractStatedSum(text) {
  if (!text) return void 0;
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m1 = trimmed.match(/(?:the\s*)?(?:final\s*)?(?:total\s*)?(?:sum|total|answer|ans|result|output|value)\s*(?:of\s*(?:the\s*)?(?:first\s*)?(?:n\s*(?:natural\s*)?numbers\s*(?:of|for|in)?\s*)?(\d+)(?:\s*(?:natural\s*)?numbers)?)?\s*(?:is|=|equals|becomes|to|:)\s*(\d+)/i);
    if (m1) {
      const targetN = m1[1] ? parseInt(m1[1], 10) : void 0;
      const statedSum = parseInt(m1[2], 10);
      return { hasStatedSum: true, targetN, statedSum, rawText: trimmed };
    }
    const m2 = trimmed.match(/(?:the\s*)?(?:final\s*)?(?:answer|ans|result|output|sum|total)\s*(?:of\s*.*?)?\s*(?:is|=|equals|becomes|to|:)\s*(\d+)/i);
    if (m2) {
      const statedSum = parseInt(m2[1], 10);
      return { hasStatedSum: true, targetN: void 0, statedSum, rawText: trimmed };
    }
    const m3 = trimmed.match(/(?:so|hence|therefore|finally)\s*(?:the\s*)?(?:final\s*)?(?:sum|total|answer|ans|result|output)?\s*(?:is|=|equals|becomes|to|:)?\s*(\d+)/i);
    if (m3) {
      const statedSum = parseInt(m3[1], 10);
      return { hasStatedSum: true, targetN: void 0, statedSum, rawText: trimmed };
    }
    const m4 = trimmed.match(/^(?:the\s*)?(?:final\s*)?(?:answer|ans|result|output|sum|total)\s*[:=]\s*(\d+)$/i);
    if (m4) {
      const statedSum = parseInt(m4[1], 10);
      return { hasStatedSum: true, targetN: void 0, statedSum, rawText: trimmed };
    }
  }
  return void 0;
}
function checkSumArithmetic(text) {
  const result = {
    hasEquations: false,
    allEquationsValid: true,
    invalidEquations: [],
    isSequentialAccumulation: false,
    maxN: 0,
    finalSum: 0,
    equations: [],
    sequenceError: null
  };
  if (!text) return result;
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const seriesMatch = trimmed.match(/^((?:\d+\s*\+\s*){2,}\d+)\s*=\s*(\d+)$/);
    if (seriesMatch) {
      result.hasEquations = true;
      const numStrings = seriesMatch[1].split("+").map((s) => parseInt(s.trim(), 10));
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
    const eqRegex = /(\d+)\s*([\+=])\s*(\d+)\s*=\s*(\d+)/g;
    let match;
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
  // Filter out invalid equations that were subsequently corrected by a valid equation with the same operands
  if (result.invalidEquations.length > 0 && result.equations.length > 0) {
    result.invalidEquations = result.invalidEquations.filter((inv) => {
      const m = inv.equation.match(/(\d+)\s*[\+=]\s*(\d+)/);
      if (!m) return true;
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      const corrected = result.equations.some((eq) => (eq.leftA === a && eq.leftB === b) || (eq.leftA === b && eq.leftB === a));
      return !corrected;
    });
    if (result.invalidEquations.length === 0) {
      result.allEquationsValid = true;
    }
  }
  if (result.equations.length >= 2 && result.invalidEquations.length === 0) {
    const doublingCount = result.equations.filter((eq) => eq.leftA === eq.leftB && eq.leftA >= 1).length;
    if (doublingCount >= 2 && (doublingCount === result.equations.length || result.equations[0].leftA === result.equations[0].leftB)) {
      result.isDoubling = true;
      result.isSequentialAccumulation = false;
      result.maxN = Math.max(...result.equations.map((eq) => eq.leftA));
      result.finalSum = result.equations[result.equations.length - 1].right;
      return result;
    }
    const eq0 = result.equations[0];
    let pattern1Valid = false;
    const isEq0StartingZero = eq0.leftA === 0 && eq0.leftB === 1 || eq0.leftA === 1 && eq0.leftB === 0;
    if (isEq0StartingZero && eq0.right === 1) {
      let valid = true;
      let prevTotal = 1;
      let firstError = null;
      for (let i = 1; i < result.equations.length; i++) {
        const eq = result.equations[i];
        const nextNum = i + 1;
        const operandsMatch = eq.leftA === prevTotal && eq.leftB === nextNum || eq.leftA === nextNum && eq.leftB === prevTotal;
        if (!operandsMatch || eq.right !== prevTotal + nextNum) {
          valid = false;
          if (!firstError) {
            const hasPrevTotal = eq.leftA === prevTotal || eq.leftB === prevTotal;
            const otherOperand = eq.leftA === prevTotal ? eq.leftB : (eq.leftB === prevTotal ? eq.leftA : null);
            firstError = {
              stepIndex: i + 1,
              equation: eq.line,
              prevTotal,
              expectedNextNum: nextNum,
              hasPrevTotal,
              actualAdded: otherOperand
            };
          }
          break;
        }
        prevTotal = eq.right;
      }
      if (valid) {
        pattern1Valid = true;
        result.isSequentialAccumulation = true;
        result.maxN = result.equations.length;
        result.finalSum = prevTotal;
      } else {
        result.sequenceError = firstError;
      }
    }
    if (!pattern1Valid) {
      const isEq0StartingOne = eq0.leftA === 1 && eq0.leftB === 2 || eq0.leftA === 2 && eq0.leftB === 1;
      if (isEq0StartingOne && eq0.right === 3) {
        let valid = true;
        let prevTotal = 3;
        let firstError = null;
        for (let i = 1; i < result.equations.length; i++) {
          const eq = result.equations[i];
          const nextNum = i + 2;
          const operandsMatch = eq.leftA === prevTotal && eq.leftB === nextNum || eq.leftA === nextNum && eq.leftB === prevTotal;
          if (!operandsMatch || eq.right !== prevTotal + nextNum) {
            valid = false;
            if (!firstError) {
              const hasPrevTotal = eq.leftA === prevTotal || eq.leftB === prevTotal;
              const otherOperand = eq.leftA === prevTotal ? eq.leftB : (eq.leftB === prevTotal ? eq.leftA : null);
              firstError = {
                stepIndex: i + 1,
                equation: eq.line,
                prevTotal,
                expectedNextNum: nextNum,
                hasPrevTotal,
                actualAdded: otherOperand
              };
            }
            break;
          }
          prevTotal = eq.right;
        }
        if (valid) {
          result.isSequentialAccumulation = true;
          result.maxN = result.equations.length + 1;
          result.finalSum = prevTotal;
        } else if (!result.sequenceError) {
          result.sequenceError = firstError;
        }
      }
    }
  }
  return result;
}
function validateSumOfNLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().trim();
  const arith = checkSumArithmetic(text);
  const declaredN = extractDeclaredN(text);
  const statedSumInfo = extractStatedSum(text);

  const hasWorksheetContent = arith.hasEquations || (declaredN !== void 0 && statedSumInfo !== void 0);
  const isStarter = !hasWorksheetContent && (
    /^(what|how|where|tell me|explain|help)/i.test(norm) || 
    norm.includes("what should we do") || 
    norm.includes("what should i do") || 
    norm.includes("what do i do") || 
    norm.includes("what i do") || 
    norm.includes("what to do") || 
    norm.includes("how to start") || 
    norm.includes("where to start") || 
    norm.includes("puriyala") || 
    norm.includes("theriyala") || 
    norm.includes("dont know") || 
    norm.includes("don't know") || 
    norm === "help" || 
    norm === "start"
  );

  if (isStarter) {
    if (attemptCount >= 3) {
      return {
        isCorrect: false,
        hasAccumulation: false,
        hasFormula: false,
        feedback: "🌟 Coach Maara here with a concrete step! In your worksheet, pick a test number like n = 3 and write the step-by-step additions:\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\nThe sum of 3 is 6",
        correction: "Show how the running total accumulates step by step: 0+1=1, 1+2=3, 3+3=6...",
        suggestedInput: "If n=3:\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\nThe sum of 3 is 6"
      };
    }
    if (attemptCount === 2) {
      return {
        isCorrect: false,
        hasAccumulation: false,
        hasFormula: false,
        feedback: "🌟 Coach Maara checking back! To sum natural numbers from 1 to n, start with a total of 0 and sequentially add each number (0+1=1, 1+2=3, 3+3=6...). Try testing with n = 4 in your worksheet!",
        correction: "Show how the running total accumulates step by step: 0+1=1, 1+2=3, 3+3=6...",
        suggestedInput: "If n=3:\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\nThe sum of 3 is 6"
      };
    }
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: "🌟 Coach Maara here! Natural numbers are counting numbers starting from 1 (1, 2, 3, 4...). To find their sum, we start with a running total of 0 and add each number one by one!\n\n👉 For example, if we take n = 3:\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\n\nTry writing out the additions for a test number like n = 3 or n = 5 in your worksheet!",
      correction: "Show how the running total accumulates step by step: 0+1=1, 1+2=3, 3+3=6...",
      suggestedInput: "If n=3:\n0 + 1 = 1\n1 + 2 = 3\n3 + 3 = 6\nThe sum of 3 is 6"
    };
  }
  const buildTraceExample = (n) => {
    const steps = [];
    let current = 0;
    for (let i = 1; i <= n; i++) {
      steps.push(`${current}+${i}=${current + i}`);
      current += i;
    }
    return steps.join("\n");
  };
  if (arith.hasEquations && !arith.allEquationsValid && arith.invalidEquations.length > 0) {
    const err = arith.invalidEquations[0];
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `Check your calculation in your worksheet: ${err.equation} is not mathematically correct. ${err.equation.split("=")[0].trim()} equals ${err.expected}, not ${err.actual}! Correct this step so your accumulated total is accurate.`,
      correction: `Fix the calculation error: change "${err.equation}" to "${err.equation.split("=")[0].trim()} = ${err.expected}".`,
      suggestedInput: `${err.equation.split("=")[0].trim()} = ${err.expected}`
    };
  }
  if (arith.hasEquations && arith.allEquationsValid && arith.isDoubling) {
    const target = declaredN ?? statedSumInfo?.targetN ?? arith.maxN ?? 3;
    const expectedSum = target * (target + 1) / 2;
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `Look closely at your addition steps: in each line, you are doubling each number (1+1=2, 2+2=4, 3+3=6) instead of carrying forward the running total!

When calculating the sum of the first ${target} natural numbers, each counting number (1, 2, 3${target > 3 ? `, ... ${target}` : ""}) is added only ONCE into a running total starting at 0:
\u2022 Step 1: 0 + 1 = 1 (start with 0, add 1 \u2794 total is 1)
\u2022 Step 2: 1 + 2 = 3 (carry forward total 1, add 2 \u2794 total is 3)
\u2022 Step 3: 3 + 3 = 6 (carry forward total 3, add 3 \u2794 total is 6)

Notice that in Step 2, we add 2 to the previous total 1 (getting 3), NOT 2 to 2! Please correct your addition steps so each line accumulates into the previous total.`,
      correction: `Carry forward the accumulated total from each step (e.g. 0+1=1, 1+2=3, 3+3=6) instead of doubling numbers like 1+1 or 2+2.`,
      suggestedInput: `If n=${target}:

${buildTraceExample(target)}
The sum of ${target} is ${expectedSum}`
    };
  }
  if (arith.hasEquations && arith.allEquationsValid && !arith.isSequentialAccumulation && arith.equations.length >= 2) {
    const target = declaredN ?? statedSumInfo?.targetN ?? (arith.maxN || 5);
    const expectedSum = target * (target + 1) / 2;
    const seqErr = arith.sequenceError;
    let detailMsg = "";
    if (seqErr) {
      if (seqErr.hasPrevTotal && seqErr.actualAdded !== null) {
        detailMsg = `in step ${seqErr.stepIndex} ("${seqErr.equation}"), you carried forward your running total ${seqErr.prevTotal}, but added ${seqErr.actualAdded} instead of the next counting number ${seqErr.expectedNextNum}!\n\nWhen calculating the sum of the first ${target} natural numbers, each counting number (1, 2, 3${target > 3 ? `, ... ${target}` : ""}) must be added sequentially into a running total starting at 0:\n• Step 1: 0 + 1 = 1 (start with 0, add 1 \u2794 total is 1)\n• Step 2: 1 + 2 = 3 (carry forward total 1, add 2 \u2794 total is 3)\n• Step 3: The next counting number after 2 is ${seqErr.expectedNextNum}! So carry forward ${seqErr.prevTotal} and add ${seqErr.expectedNextNum} (\u2794 ${seqErr.prevTotal} + ${seqErr.expectedNextNum} = ${seqErr.prevTotal + seqErr.expectedNextNum}).`;
      } else {
        detailMsg = `each step must carry forward the previous accumulated total (${seqErr.prevTotal}) and add the next counting number (${seqErr.expectedNextNum}).`;
      }
    } else {
      detailMsg = `your equations do not show a sequential running total accumulator.`;
    }

    let conclusionNote = "";
    if (statedSumInfo && statedSumInfo.statedSum !== expectedSum) {
      conclusionNote = `\n\nAlso notice your conclusion "${statedSumInfo.rawText}": the sum of the first ${target} natural numbers is ${expectedSum}, not ${statedSumInfo.statedSum}!`;
    }

    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: false,
      feedback: `🌟 Coach Maara here! Look closely at your addition steps: ${detailMsg}${conclusionNote}\n\nPlease correct step ${seqErr?.stepIndex || 3} and follow through to ${target}!`,
      correction: `In step ${seqErr?.stepIndex || 3}, carry forward ${seqErr?.prevTotal || "previous total"} and add ${seqErr?.expectedNextNum || "next number"}: "${seqErr?.prevTotal || 3} + ${seqErr?.expectedNextNum || 3} = ${(seqErr?.prevTotal || 3) + (seqErr?.expectedNextNum || 3)}".`,
      suggestedInput: `If n=${target}:\n\n${buildTraceExample(target)}\nThe sum of ${target} is ${expectedSum}`
    };
  }
  if (statedSumInfo?.targetN !== void 0) {
    const target = statedSumInfo.targetN;
    const expectedSum = target * (target + 1) / 2;
    if (statedSumInfo.statedSum !== expectedSum) {
      let detail = `Look closely at your conclusion "${statedSumInfo.rawText}": the sum of the first ${target} natural numbers is ${expectedSum}, not ${statedSumInfo.statedSum}!`;
      if (target === 3 && statedSumInfo.statedSum === 10) {
        detail = `Look closely at your steps: you took the number as 3 (n = 3), so you only need to add the numbers up to 3 (1, 2, and 3):
0 + 1 = 1
1 + 2 = 3
3 + 3 = 6
So the sum of 3 is 6, not 10!
10 is actually the sum of the first 4 numbers (1 + 2 + 3 + 4 = 10). When you added 4 in "6 + 4 = 10", you added an extra number beyond 3!`;
      }
      return {
        isCorrect: false,
        hasAccumulation: arith.hasEquations,
        hasFormula: false,
        hasSumMismatch: true,
        feedback: `${detail}

To correct this:
\u2022 If your test number is ${target}, remove steps beyond ${target} and conclude that the sum of ${target} is ${expectedSum}.
\u2022 Or if you want to find the sum of ${arith.maxN > target ? arith.maxN : 4}, change your test number to ${arith.maxN > target ? arith.maxN : 4} (the sum of ${arith.maxN > target ? arith.maxN : 4} is ${statedSumInfo.statedSum}).`,
        correction: `For n = ${target}, the sum of 1 to ${target} is ${expectedSum} (not ${statedSumInfo.statedSum}).`,
        suggestedInput: `If i take a number as ${target}

${buildTraceExample(target)}
The sum of ${target} is ${expectedSum}`
      };
    }
  }
  if (declaredN !== void 0 && arith.hasEquations && arith.isSequentialAccumulation) {
    const expectedSumForDeclared = declaredN * (declaredN + 1) / 2;
    if (arith.maxN > declaredN) {
      return {
        isCorrect: false,
        hasAccumulation: true,
        hasFormula: false,
        hasTargetMismatch: true,
        feedback: `Look closely at your steps: you chose ${declaredN} as your test number (n = ${declaredN}), which means we only add the numbers from 1 up to ${declaredN} (1, 2${declaredN > 2 ? `, ${declaredN}` : ""}).

For n = ${declaredN}, the running total stops at ${expectedSumForDeclared}:
${buildTraceExample(declaredN)}

Your step "${arith.equations[arith.equations.length - 1]?.line || `+ ${arith.maxN}`}" added ${arith.maxN}, which calculates the sum for n = ${arith.maxN} (${arith.finalSum}) instead of ${declaredN}!

To fix this:
\u2022 Either remove the extra step beyond ${declaredN} so the final sum is ${expectedSumForDeclared}.
\u2022 Or change your starting number to ${arith.maxN} if you wish to calculate the sum of ${arith.maxN}.`,
        correction: `For n = ${declaredN}, only add numbers up to ${declaredN} (the sum of ${declaredN} is ${expectedSumForDeclared}).`,
        suggestedInput: `If i take a number as ${declaredN}

${buildTraceExample(declaredN)}
The sum of ${declaredN} is ${expectedSumForDeclared}`
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
        suggestedInput: `If i take a number as ${declaredN}

${buildTraceExample(declaredN)}
The sum of ${declaredN} is ${expectedSumForDeclared}`
      };
    }
  }
  if (declaredN !== void 0 && statedSumInfo && statedSumInfo.targetN === void 0) {
    const expectedSumForDeclared = declaredN * (declaredN + 1) / 2;
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
  if (arith.hasEquations && arith.allEquationsValid && arith.isSequentialAccumulation) {
    const targetN = declaredN ?? statedSumInfo?.targetN ?? arith.maxN;
    const expectedSum = targetN * (targetN + 1) / 2;
    if (arith.finalSum === expectedSum) {
      return {
        isCorrect: true,
        hasAccumulation: true,
        hasFormula: false,
        feedback: `\u{1F389} Logic Successful! Fantastic work! You have clearly demonstrated how the numbers from 1 to ${targetN} accumulate step by step into the running total (ending with a sum of ${expectedSum}). You're ready to proceed to the Recipe stage to sequence this into an algorithm!`,
        correction: "Proceed to the Recipe stage to write the step-by-step instructions."
      };
    }
  }
  const describesAccumulation = (norm.includes("start") || norm.includes("initial")) && (norm.includes("0") || norm.includes("zero")) && (norm.includes("add") || norm.includes("accumulat") || norm.includes("sum")) && (norm.includes("1 to n") || norm.includes("each number") || norm.includes("next number"));
  if (describesAccumulation) {
    return {
      isCorrect: true,
      hasAccumulation: true,
      hasFormula: false,
      feedback: `\u{1F389} Logic Successful! Excellent explanation! You've captured the core principle of sequential accumulation: starting with a total of 0 and continuously adding each successive number from 1 up to n. Proceed to the Recipe stage!`,
      correction: "Proceed to the Recipe stage to sequence the steps."
    };
  }
  const hasFormula = /\bn\s*\*\s*\(\s*n\s*\+\s*1\s*\)\s*\/\s*2/i.test(text) || /\(n\s*\*\s*\(n\s*\+\s*1\)\)\s*\/\s*2/i.test(text);
  if (hasFormula) {
    return {
      isCorrect: false,
      hasAccumulation: false,
      hasFormula: true,
      feedback: `You've identified the mathematical shortcut formula n*(n+1)/2! While that formula works instantly in pure mathematics, in programming we build algorithmic logic step-by-step through sequential accumulation. Explain or trace how a running total starts at 0 and adds 1, 2, 3... up to n.`,
      correction: "Explain how the total accumulates step by step starting from 0, or trace manual additions like 0+1=1, 1+2=3, 3+3=6...",
      suggestedInput: "If n=5: 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15"
    };
  }
  return {
    isCorrect: false,
    hasAccumulation: arith.hasEquations,
    hasFormula: false,
    feedback: "🌟 Coach Maara here! Let's demonstrate the logic step by step using sequential accumulation. Start with a running total of 0 and add each counting number: 0+1=1, 1+2=3, 3+3=6...",
    correction: "Show the running total growing step by step (e.g. 0+1=1, 1+2=3, 3+3=6...).",
    suggestedInput: "If n=5:\n\n0+1=1\n1+2=3\n3+3=6\n6+4=10\n10+5=15\nThe sum of 5 is 15"
  };
}
function checkProgrammingWordsInRecipe(text) {
  const norm = (text || "").toLowerCase();
  const foundWords = [];
  const checks = [
    { label: "loop", regex: /\bloop(?:s|ing)?\b/i },
    { label: "while", regex: /\bwhile\b/i },
    { label: "for", regex: /\bfor\s+(?:loop|each|[a-z]\b|\()/i },
    { label: "counter i / i", regex: /\b(?:counter\s+i|variable\s+i|\bi\s*=\s*\d|\bi\+\+|\bi\s*<=|\bi\s*<)/i },
    { label: "variable", regex: /\bvariable(?:s)?\b/i },
    { label: "sum +=", regex: /\bsum\s*(?:\+=)/i },
    { label: "code operator (++)", regex: /\+\+/ },
    { label: "semicolon (;)", regex: /;\s*$/m }
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

function validateSumOfNRecipe(text) {
  const norm = (text || "").toLowerCase();
  const prog = checkProgrammingWordsInRecipe(text);
  const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);

  const stepMap = {};
  for (const line of lines) {
    const sm = line.match(/^step\s*([1-5])\b[:.\s-]*(.*)$/i);
    if (sm) {
      stepMap[parseInt(sm[1], 10)] = sm[2].trim();
    }
  }
  const hasNumberedSteps = Object.keys(stepMap).length > 0;

  let step3Line = stepMap[3] ? stepMap[3].toLowerCase() : "";
  let step4Line = stepMap[4] ? stepMap[4].toLowerCase() : "";
  let step5Line = stepMap[5] ? stepMap[5].toLowerCase() : "";
  if (!step3Line || !step4Line || !step5Line) {
    for (const line of lines) {
      const l = line.toLowerCase();
      if (!step3Line && /^step\s*3\b/i.test(l)) step3Line = l;
      if (!step4Line && /^step\s*4\b/i.test(l)) step4Line = l;
      if (!step5Line && /^step\s*5\b/i.test(l)) step5Line = l;
    }
  }

  const hasValidPrintSum = /\b(?:print|display|output|show)\b.*?\b(?:sum|total)\b/i.test(norm);
  const step5Candidate = step5Line || (lines.length > 0 ? lines[lines.length - 1].toLowerCase() : "") || norm;
  const isPrintingInputInsteadOfSum = !hasValidPrintSum && (
    /\b(?:print|display|output|show)\b.*?\b(?:taken\s*(?:number|input|\d+|[na])?|input\s*(?:number|\d+|[na])?|number\s*(?:5|\d+|[na])|\b5\b|\b[na]\b)\b/i.test(step5Candidate) ||
    /\btaken\s+(?:number\s+)?(?:5|\d+|[na])\b/i.test(step5Candidate) ||
    /\bthe\s+taken\s+number\b/i.test(step5Candidate) ||
    /\bnumber\s*5\s*as\s+output\b/i.test(step5Candidate)
  );

  // Strip print statement lines when checking for Step 1 input to prevent "print the taken number" from matching as Step 1
  const normWithoutPrint = norm.replace(/\b(?:print|display|output|show)\b[^\n.]*/gi, "");

  let hasStep1 = false;
  if (hasNumberedSteps) {
    hasStep1 = Boolean(stepMap[1] && (/\b(?:input|read|get|take|enter|ask)\b/i.test(stepMap[1]) || /\b(?:n|number)\b/i.test(stepMap[1])));
  } else {
    hasStep1 = lines.some((l) => {
      const s = l.toLowerCase();
      if (/\b(?:print|display|output|show)\b/i.test(s)) return false;
      return (/\b(?:input|read|get|take|enter|ask)\b/i.test(s) && /\b(?:n|number)\b/i.test(s)) ||
             (/\bstep\s*1\b/i.test(s) && /\b(?:input|number|n|user)\b/i.test(s)) ||
             (/\b(?:get|read|take|ask)\s+(?:the\s+)?(?:input|number|n)\b/i.test(s));
    }) || /\bstep\s*1\b/i.test(normWithoutPrint) && /\b(?:input|number|n)\b/i.test(normWithoutPrint) ||
    /\b(?:input|read|get|take|enter|ask)\b[\s\S]*?\b(?:n|number)\b/i.test(normWithoutPrint);
  }

  let hasStep2 = false;
  const hasSumZeroInit = (norm.includes("sum") || norm.includes("total")) && (norm.includes("0") || norm.includes("zero") || norm.includes("initial") || norm.includes("start"));
  if (hasNumberedSteps) {
    hasStep2 = Boolean(stepMap[2] && (stepMap[2].includes("sum") || stepMap[2].includes("total") || stepMap[2].includes("0") || stepMap[2].includes("zero") || stepMap[2].includes("1"))) || hasSumZeroInit;
  } else {
    hasStep2 = lines.some((l) => {
      const s = l.toLowerCase();
      if (/^step\s*4\b/i.test(s)) return false;
      return (s.includes("sum") || s.includes("total")) && (s.includes("0") || s.includes("zero")) && (s.includes("1") || s.includes("one") || s.includes("start") || s.includes("first") || s.includes("counter") || s.includes("number"));
    }) || (!hasNumberedSteps && (norm.includes("sum") || norm.includes("total")) && (norm.includes("0") || norm.includes("zero")) && (norm.includes("1") || norm.includes("one") || norm.includes("start") || norm.includes("first") || norm.includes("counter"))) || hasSumZeroInit;
  }

  const hasRepeat = (norm.includes("repeat") || norm.includes("loop") || norm.includes("next number") || norm.includes("advance") || norm.includes("increment") || norm.includes("until n") || norm.includes("1 to n") || norm.includes("from 1") || norm.includes("each number"));

  const hasWrongAddInRecipe = (
    /\badd\s+(?:the\s+)?(?:input|n\b|a\b|limit)\s+(?:to|into)\s+(?:the\s+)?(?:total\s+)?sum\b/i.test(norm) ||
    /\bsum\s*=\s*(?:[na]|input|\d+)\s*\+\s*i\b/i.test(norm)
  );
  const hasAdd = (norm.includes("add") || norm.includes("accumulate") || norm.includes("plus")) && (norm.includes("sum") || norm.includes("total")) && !hasWrongAddInRecipe;

  let hasStep3 = hasRepeat;
  let hasStep4 = hasAdd;
  let hasStep5 = !isPrintingInputInsteadOfSum && (norm.includes("print") || norm.includes("display") || norm.includes("output") || norm.includes("show") || norm.includes("return")) && (norm.includes("sum") || norm.includes("total") || norm.includes("result"));

  const hasCombinedStep3 = (hasStep3 && hasStep4);

  const allStepsDone = hasStep1 && hasStep2 && hasStep3 && hasStep4 && hasStep5 && !prog.hasProgrammingWords && !hasWrongAddInRecipe && !isPrintingInputInsteadOfSum;

  let userLines = (text || "").split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  if (userLines.length === 1 && /(?:step\s*\d+|\d+[\.\:\)\-])/i.test(userLines[0])) {
    const inlineMatches = userLines[0].split(/(?=(?:step\s*\d+|\b\d+[\.\:\)\-]))/i).map(l => l.trim()).filter(Boolean);
    if (inlineMatches.length > 1) {
      userLines = inlineMatches;
    }
  }
  const numberedLines = userLines.filter(l => /^(?:step\s*\d+|\d+[\.\:\)\-])/i.test(l));

  let recipeStepProgress;
  if (allStepsDone && numberedLines.length >= 2) {
    recipeStepProgress = numberedLines.map((line, idx) => {
      const cleanTitle = line.replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 45);
      return {
        stepNumber: idx + 1,
        title: cleanTitle || `Step ${idx + 1}`,
        completed: true,
        current: false
      };
    });
  } else if (hasCombinedStep3 || numberedLines.length === 4) {
    recipeStepProgress = [
      { stepNumber: 1, title: "Read input number n", completed: hasStep1, current: !hasStep1 },
      { stepNumber: 2, title: "Start total sum = 0 and number = 1", completed: hasStep2, current: hasStep1 && !hasStep2 },
      { stepNumber: 3, title: "Repeat until n & add current number to sum", completed: hasStep3 && hasStep4, current: hasStep1 && hasStep2 && !(hasStep3 && hasStep4) },
      { stepNumber: 4, title: "Display the final total sum", completed: hasStep5, current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasStep5 }
    ];
  } else {
    recipeStepProgress = [
      { stepNumber: 1, title: "Read input number n", completed: hasStep1, current: !hasStep1 },
      { stepNumber: 2, title: "Start total sum = 0 and number = 1", completed: hasStep2, current: hasStep1 && !hasStep2 },
      { stepNumber: 3, title: "Move to next number & repeat until n", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
      { stepNumber: 4, title: "Add current number to total sum", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 },
      { stepNumber: 5, title: "Display the final total sum", completed: hasStep5, current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasStep5 }
    ];
  }

  const nextMissingStep = !hasStep1 ? "Step 1: Get the input number n from the user" :
    !hasStep2 ? "Step 2: Start total sum = 0 and number = 1" :
    !hasStep3 ? "Step 3: Move to next number & repeat until n" :
    !hasStep4 ? "Step 4: Add current number to total sum" :
    "Step 5: Display the final total sum";

  let recipeFeedback = "";
  let recipeCorrection = "";
  let recipeSuggested = nextMissingStep;

  if (isPrintingInputInsteadOfSum) {
    recipeFeedback = "⚠️ In Step 5, you wrote to print the taken number 5 as output.\n\nNotice that 5 is only your starting input number! If you print the taken number, the program will just output the user's input (5) instead of the accumulated answer (15)!\n\nThe purpose of our algorithm is to print the accumulated total sum.\n\n👉 Correct Step 5: \"Step 5: Finally we need to print the final total sum as output\".";
    recipeCorrection = "In Step 5, print the final total sum instead of the taken number 5.";
    recipeSuggested = "Step 5: Finally we need to print the final total sum as output";
    if (!hasStep1 || !hasStep2 || !hasStep3) {
      recipeFeedback += "\n\n⚠️ Also notice that earlier steps are missing (Step 1: Get input number n, Step 2: Initialize total sum = 0 and number = 1, Step 3: Move to next number & repeat until n). An algorithm must start from Step 1!";
    }
  } else if (hasWrongAddInRecipe) {
    recipeFeedback = "⚠️ In Step 4 of your recipe, you mentioned adding the input limit (or fixed variable) to sum.\n\nRemember, in the algorithm we must add each *current number* from the loop (1, 2, 3... up to n) into our running total sum, not just the fixed input limit!";
    recipeCorrection = "In Step 4, add the current number from the loop to the total sum.";
    recipeSuggested = "Step 4: Add the current number to the total sum";
  } else if (prog.hasProgrammingWords) {
    const wordsList = prog.foundWords.map((w) => `'${w}'`).join(", ");
    recipeFeedback = `In the Recipe stage, please avoid programming tools and code words (detected: ${wordsList}). The Recipe should be written in plain, human-readable English without programming keywords or code syntax! For example, use 'repeat until reaching n' instead of 'loop', and 'starting number 1' instead of 'counter i = 1'.`;
    recipeCorrection = "Replace programming words with everyday language (use 'repeat', 'current number', 'next number').";
    recipeSuggested = nextMissingStep;
  } else if (!hasStep1 && !hasStep2) {
    recipeFeedback = "⚠️ Look closely at your recipe: your steps begin without Step 1 (getting the input number from the user) and Step 2 (initializing total sum to 0)!\n\nEvery algorithm must start from the very beginning:\nStep 1: Get the input number n from the user.";
    recipeCorrection = "Start with Step 1: Get the input number n from the user.";
    recipeSuggested = "Step 1: Get the input number n from the user";
  } else if (!hasStep1) {
    recipeFeedback = "⚠️ Step 1 is missing! Every algorithm recipe must start by taking the input number from the user:\n\"Step 1: Get the input number n from the user\".";
    recipeCorrection = "Start with Step 1: Get the input number n from the user.";
    recipeSuggested = "Step 1: Get the input number n from the user";
  } else if (!hasStep2) {
    recipeFeedback = "⚠️ Step 2 is missing! Before beginning the addition loop, initialize total sum = 0 and start number = 1:\n\"Step 2: Start total sum = 0 and number = 1\".";
    recipeCorrection = "In Step 2: Start total sum = 0 and number = 1.";
    recipeSuggested = "Step 2: Start total sum = 0 and number = 1";
  } else if (!hasStep3) {
    recipeFeedback = "⚠️ Step 3 is missing! We need a step to repeat and advance to the next number:\n\"Step 3: Move to next number & repeat until n\".";
    recipeCorrection = "In Step 3: Move to next number & repeat until n.";
    recipeSuggested = "Step 3: Move to next number & repeat until n";
  } else if (!hasStep4) {
    recipeFeedback = "⚠️ Step 4 is missing! Inside the repeat process, add each current number to the running total sum:\n\"Step 4: Add current number to total sum\".";
    recipeCorrection = "In Step 4: Add current number to total sum.";
    recipeSuggested = "Step 4: Add current number to total sum";
  } else if (!hasStep5) {
    recipeFeedback = "⚠️ Step 5 is missing! After adding all numbers from 1 to n, display the final total sum:\n\"Step 5: Display the final total sum\".";
    recipeCorrection = "In Step 5: Display the final total sum.";
    recipeSuggested = "Step 5: Display the final total sum";
  }

  return {
    hasStep1,
    hasStep2,
    hasStep3,
    hasStep4,
    hasStep5,
    hasCombinedStep3,
    hasWrongAddInRecipe,
    isPrintingInputInsteadOfSum,
    feedback: recipeFeedback,
    correction: recipeCorrection,
    suggestedInput: allStepsDone ? void 0 : recipeSuggested,
    hasProgrammingWords: prog.hasProgrammingWords,
    foundProgrammingWords: prog.foundWords,
    allStepsDone,
    recipeStepProgress
  };
}

function validateSumOfNIngredients(text) {
  const norm = (text || "").toLowerCase();
  const lines = text.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);

  const stepMap = {};
  for (const line of lines) {
    const sm = line.match(/^step\s*([1-5])\b[:.\s-]*(.*)$/i);
    if (sm) {
      stepMap[parseInt(sm[1], 10)] = sm[2].trim();
    }
  }
  const hasNumberedSteps = Object.keys(stepMap).length > 0;

  // Detect printing input variable in Step 5 (e.g. print the a variable, print a, print n)
  const hasPrintedInputVarInIngredients = (
    /\b(?:print|display|output)\s+(?:the\s+)?(?:[na]\s+variable|variable\s+[na]|[na]\b|input\s+variable|input\b)/i.test(norm) ||
    /step\s*5\b[^\n]*\b(?:print|display|output)\b[^\n]*\b(?:[na]|input)\b/i.test(norm)
  ) && !/\b(?:print|display|output)\s+(?:the\s+)?(?:sum|total)(?:\s+variable)?/i.test(norm);

  const cleanForCounter = norm.replace(/\b(?:how\s+do\s+i|can\s+i|should\s+i|if\s+i|i\s+(?:need|want|think|have|will|can|am|take|know|start|see|use|must|should))\b/gi, " ");

  // Accurate input variable check: do not let 'end:a' or 'print the a variable' satisfy input variable declaration
  let hasInputVar = false;
  if (hasNumberedSteps) {
    hasInputVar = Boolean(stepMap[1] && (/\b[na]\b/i.test(stepMap[1]) || /\binput\b/i.test(stepMap[1]) || /\bvariable\b/i.test(stepMap[1])));
  } else {
    const cleanForInput = norm
      .replace(/\bend\s*[:=]\s*[na]\b/gi, "")
      .replace(/\b(?:print|display|output)[^\n]*/gi, "")
      .replace(/\b(?:sum|total)\s*=\s*0/gi, "");
    hasInputVar = /\b(?:step\s*1\b|input\s*variable|variable\s*for\s*input|int\s+[na]|let\s+[na]|var\s+[na]|[na]\s*[:=]\s*(?:input|integer|number|\d+)|input\s*[:=]\s*[na])\b/i.test(cleanForInput) ||
                  (/\bvariables?\s*:[^.\n]*\b[na]\b/i.test(cleanForInput) && /\b[na]\b/i.test(cleanForInput));
  }

  const hasAccumulator = /\bsum\s*(?:=|:|\()\s*0/i.test(norm) || /\b(?:sum|total)\s*(?:initialized\s+to\s+0|starts?\s+at\s+0|= 0|is 0)\b/i.test(norm) || /\b(?:sum|total)\b/i.test(norm) && (norm.includes("0") || norm.includes("zero")) && (norm.includes("accumulator") || norm.includes("accumulate") || norm.includes("running") || norm.includes("init") || norm.includes("start")) || /\baccumulator\b/i.test(norm) && (norm.includes("sum") || norm.includes("total") || norm.includes("0") || norm.includes("zero"));
  const hasCounter = /\bi\s*=\s*1\b/i.test(norm) || /\bi\s*:\s*1\b/i.test(norm) || /\b(?:starting\s+)?num(?:ber)?\s*[:=]?\s*1\b/i.test(norm) || /\b(?:starting\s+)?num(?:ber)?\s*(?:starts?\s*at|starting\s*at|starting\s*from|from)\s*1\b/i.test(norm) || /\bstart(?:ing)?(?:\s*value|\s*num(?:ber)?)?\s*[:=]?\s*1\b/i.test(norm) || /\bstarts?\s*(?:at|from)\s*1\b/i.test(norm) || /\bstarting\s+num\b/i.test(norm) || /\b(?:counter|count|variable)\s+i\b/i.test(cleanForCounter) || /\bi\s*\(\s*(?:loop\s*)?counter\b/i.test(cleanForCounter) || /\b(?:loop\s*)?counter\s*(?:i\b|[:=]\s*1\b|starts?\s*(?:at|from)\s*1\b)/i.test(cleanForCounter) || /\bi\b/i.test(cleanForCounter) && /\b(?:counter|starts?\s*(?:at|from)\s*1|initialized\s*to\s*1|from\s*1\s*to\s*[na])\b/i.test(cleanForCounter) || /\bfor\s*\([^)]*\b1\b/i.test(norm) || /\brange\s*\(\s*1\b/i.test(norm) || /\bend\s*[:=]?\s*[na]\b/i.test(norm) || /\bi\s*<=\s*[na]\b/i.test(norm);
  const hasLoopConstruct = /\bfor\s*loop\b/i.test(norm) || /\bwhile\s*loop\b/i.test(norm) || /\b(?:for|while)\s*(?:\/|or)\s*(?:while|for)\b/i.test(norm) || /\bconstructs?\s*:[^.\n]*\b(?:for|while)\b/i.test(norm) || /\bloop\s*construct\b/i.test(norm) || /\b(?:for|while)\b/i.test(norm) && (norm.includes("loop") || norm.includes("construct"));

  // 1. Wrong accumulator variable on RHS (e.g. sum = a + i, sum = n + i, sum = 0 + i, sum = i + a, sum = i + n, sum = i)
  const hasWrongAccumulatorVariable = (
    /\b(?:sum|total)\s*=\s*(?:[na]|start\w*|input\w*|limit\w*|val\w*|\d+)\s*\+\s*(?:i\b|current\b|num\b)/i.test(norm) ||
    /\b(?:sum|total)\s*=\s*(?:i\b|current\b|num\b)\s*\+\s*(?:[na]|start\w*|input\w*|limit\w*|val\w*|\d+)\b/i.test(norm) ||
    /\b(?:sum|total)\s*=\s*i\b(?!\s*[\+\*])/i.test(norm)
  );

  // 2. Wrong addend on RHS (e.g. sum = sum + startnum, sum = sum + n, sum = sum + 1, sum += n, sum += 1)
  const hasWrongAddend = (
    /\b(?:sum|total)\s*=\s*(?:sum|total)\s*\+\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|[na]\b|input\w*)/i.test(norm) ||
    /\b(?:sum|total)\s*\+=\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|[na]\b|input\w*)/i.test(norm) ||
    /\b(?:sum|total)\s*\+\s*(?:start(?:ing)?\s*num(?:ber)?\b|start\b|1\b|[na]\b|input\w*)/i.test(norm)
  );

  const hasWrongSumAccumulation = hasWrongAccumulatorVariable || hasWrongAddend;
  const hasValidSumAccumulation = (
    /\b(?:sum|total)\s*=\s*(?:sum|total)\s*\+\s*(?:i\b|num\b|number\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+=\s*(?:i\b|num\b|number\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    /\b(?:sum|total)\s*\+\s*(?:i\b|current\s*num(?:ber)?\b)/i.test(norm) ||
    /\badd\s+(?:the\s+)?(?:current\s+num(?:ber)?|i|loop\s+counter)\s+(?:in)?to\s+(?:the\s+)?(?:total\s+)?sum\b/i.test(norm) ||
    /\b(?:accumulate|accumulating)\s+(?:the\s+)?(?:current\s+num(?:ber)?|i)\s+(?:in)?to\s+(?:the\s+)?(?:total\s+)?sum\b/i.test(norm) ||
    /\b(?:sum|total)\s+plus\s+i\b/i.test(norm)
  );
  const hasSumAccumulation = hasValidSumAccumulation && !hasWrongSumAccumulation;
  const hasOperators = hasSumAccumulation;

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "Input Variable: n (or a)", completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: "Accumulator: sum = 0", completed: hasAccumulator, current: hasInputVar && !hasAccumulator },
    { stepNumber: 3, title: "Loop Construct: for / while loop", completed: hasLoopConstruct, current: hasInputVar && hasAccumulator && !hasLoopConstruct },
    { stepNumber: 4, title: "Loop Controls: i (start: 1, end: n)", completed: hasCounter, current: hasInputVar && hasAccumulator && hasLoopConstruct && !hasCounter },
    { stepNumber: 5, title: "Sum Update: sum = sum + i", completed: hasSumAccumulation, current: hasInputVar && hasAccumulator && hasLoopConstruct && hasCounter && !hasSumAccumulation }
  ];

  const completedCount = [hasInputVar, hasAccumulator, hasLoopConstruct, hasCounter, hasSumAccumulation].filter(Boolean).length;
  const allIngredientsDone = hasInputVar && hasAccumulator && hasLoopConstruct && hasCounter && hasSumAccumulation && !hasPrintedInputVarInIngredients;
  const hasLoopParams = /\bstart\b/i.test(norm) && /\bend\b/i.test(norm) && (/\bnext\s*step\b/i.test(norm) || /\bstep\b/i.test(norm) || /\bincrement\b/i.test(norm));

  let feedback = "";
  let correction = "";
  let suggestedInput = "Step 1: n (input integer)\nStep 2: sum = 0 (accumulator)\nStep 3: for loop\nStep 4: start = 1, end = n, next step = +1\nStep 5: sum = sum + i";

  if (hasPrintedInputVarInIngredients) {
    feedback = "⚠️ In Step 5, you wrote 'print the a variable' (or printed the input limit).\n\nNotice that variable 'a' (or 'n') stores your input limit (5)! If you print variable 'a', the computer will output 5 instead of the calculated sum (15)!\n\nThe accumulator holding the running total is variable 'sum'.\n\n👉 Correct Step 5: \"Step 5: print the sum variable\".";
    correction = "In Step 5, print the accumulator variable 'sum' instead of the input variable 'a'.";
    suggestedInput = "Step 5: print the sum variable";
    if (!hasInputVar) {
      feedback += "\n\n⚠️ Also, Step 1 is missing! You started with Step 2 (variable sum = 0), but Step 1 (declaring the input variable a) is needed:\n\"Step 1: input variable a\".";
    }
  } else if (allIngredientsDone) {
    feedback = "🎉 Ingredients Verified! Brilliant work! You've identified all 5 essential programming ingredients, including the main step to accumulate the total sum:\n• Input variable n (or a)\n• Accumulator sum = 0\n• Loop construct (for loop or while loop)\n• Loop controls: start = 1, end = n, next step = +1 (loop variable i)\n• Main sum accumulation step: sum = sum + i (operators: + and =)\n\nYou're ready to proceed to Taste the Sample stage to assemble your code!";
    correction = "Proceed to Taste the Sample stage to assemble your code!";
    suggestedInput = void 0;
  } else if (!hasInputVar && hasAccumulator && hasLoopConstruct && hasCounter) {
    feedback = "⚠️ Look closely at your ingredients: you started with Step 2 (`variable sum=0`), but Step 1 (declaring the input variable `a` or `n`) is missing!\n\nEvery program needs a variable to hold the user's input before running calculations.";
    correction = "Add Step 1 to declare your input variable: 'Step 1: input variable a'.";
    suggestedInput = "Step 1: input variable a\nStep 2: variable sum = 0\nStep 3: for loop(i)\nstart: 1\nend: a\nnext step: +1\nStep 4: sum = sum + i\nStep 5: print the sum variable";
  } else if (completedCount === 0) {
    feedback = "In the Ingredients stage, we need to list the exact programming tools, variables, loops, and operators required to build our code.\n\nPlease list all 5 essential ingredients:\n1. Input variable: n (to store user input)\n2. Accumulator: sum = 0 (starts at 0 to collect the running total)\n3. Loop construct: for loop or while loop\n4. Loop controls: start = 1, end = n, next step = +1 (loop variable i)\n5. Main sum step: sum = sum + i (operators: + or +=, =)";
    correction = "List the variables (n, sum = 0), loop construct (for/while loop), loop parameters (start = 1, end = n, next step = +1), and sum update step (sum = sum + i).";
  } else {
    const missing = [];
    if (!hasInputVar) missing.push("Input variable n (or a)");
    if (!hasAccumulator) missing.push("Accumulator variable sum = 0");
    if (!hasLoopConstruct) missing.push("Loop construct (for loop or while loop)");
    if (!hasCounter) missing.push("Loop controls: start = 1, end = n, next step = +1 (loop variable i)");
    if (!hasSumAccumulation) {
      missing.push("Main sum calculation step: sum = sum + i (or sum += i) using addition (+) and assignment (=)");
    }
    if (hasWrongAccumulatorVariable) {
      const varMatch = norm.match(/\b(?:sum|total)\s*=\s*([na]|input\w*|start\w*|\d+)\s*\+\s*i\b/i) || norm.match(/\b(?:sum|total)\s*=\s*i\s*\+\s*([na]|input\w*|start\w*|\d+)\b/i);
      const usedVar = varMatch ? varMatch[1] : "a";
      if (/\b(?:sum|total)\s*=\s*i\b(?!\s*[\+\*])/i.test(norm)) {
        feedback = "⚠️ In your sum step, you wrote `sum = i`.\n\nNotice that `sum = i` overwrites `sum` with the current number on every iteration, throwing away the previous total! To keep adding each number into our running total, add `i` to the existing `sum`:\n`sum = sum + i` (or `sum += i`).";
        correction = "Change your sum step to accumulate: sum = sum + i (or sum += i).";
        suggestedInput = "Step 5: sum = sum + i";
      } else {
        feedback = `⚠️ In your sum step, you wrote \`sum = ${usedVar} + i\`.\n\nNotice that \`${usedVar}\` is your input limit (or starting value), not the accumulator variable! If you write \`sum = ${usedVar} + i\`, on every loop iteration it calculates \`${usedVar} + i\` instead of carrying forward the running total collected so far.\n\nTo accumulate each number from the loop into the running total, add the loop variable \`i\` to \`sum\`:\n\`sum = sum + i\` (or \`sum += i\`).`;
        correction = `Change sum = ${usedVar} + i to sum = sum + i (or sum += i).`;
        suggestedInput = "Step 5: sum = sum + i";
      }
    } else if (hasWrongAddend) {
      feedback = "⚠️ In your sum step, you added a fixed constant or input limit (`sum = sum + startnum` or `sum = sum + n`).\n\nNotice that in your loop (`for loop(i)`), the loop variable that changes on each iteration is `i`! The starting value or limit does not increase inside the loop. If you write `sum = sum + 1` or `sum = sum + n`, the loop will just add that same value every single time instead of adding each number (1, 2, 3... up to n)!\n\nTo correctly accumulate each number from the loop into the running total, use the loop variable `i`:\n`sum = sum + i` (or `sum += i`).";
      correction = "In your sum step, change your step to use the loop variable i: sum = sum + i (or sum += i).";
      suggestedInput = "Step 5: sum = sum + i";
    } else if (hasLoopConstruct && !hasSumAccumulation && hasInputVar && hasAccumulator && hasCounter) {
      if (hasLoopParams) {
        feedback = "🌟 You are doing a wonderful job defining the boundaries for your loop! You have correctly identified the start (1), end (n), and next increment step (+1).\n\nNow, the main step is missing: inside the loop, we need to accumulate each number into our total sum using:\n`sum = sum + i` (or `sum += i`).\n\n💡 Why do we write `sum = sum + i`?\n• `sum` on the right side holds the previous total collected so far.\n• In each loop iteration, `i` holds the current number (1, 2, 3... up to n).\n• When we add `+ i`, the computer calculates the updated new total.\n• The assignment operator (`=`) then stores this updated new total back into `sum`.\n• If we only wrote `sum = i`, the earlier numbers would be overwritten and lost!\n• That is why we use `sum = sum + i` (or `sum += i`) to accumulate the running total.";
        correction = "Add the main step to update sum: sum = sum + i (or sum += i) using addition (+) and assignment (=).";
        suggestedInput = "Step 5: sum = sum + i";
      } else {
        feedback = "🌟 You are doing a fantastic job identifying the components! Using a for loop is exactly the right construct for repetition.\n\nIn your for loop, make sure to specify what are the values for start, end, and next step:\n• Start value: 1 (starts at 1)\n• End value: n (or n + 1 in Python range to reach n)\n• Next step: increment by 1 (advances to the next number each step)\n\nAlso, inside the loop we need to accumulate each number into the total sum using `sum = sum + i` (or `sum += i`).\n\n💡 Why `sum = sum + i`? Because `sum` holds our previous total, `i` is the current number from the loop, and adding them together updates `sum` without losing earlier numbers!";
        correction = "In your for loop, specify start = 1, end = n, next step = increment by 1, and the main sum step: sum = sum + i.";
        suggestedInput = "start: 1\nend: n\nnext step: +1\nsum = sum + i";
      }
    } else {
      feedback = `Good progress! You've identified ${completedCount} of 5 ingredients.\n\nPlease add the remaining ingredients:\n` + missing.map((m) => `• ${m}`).join("\n");
      correction = `Add the missing ingredients: ${missing.join(", ")}.`;
      suggestedInput = "Step 1: n (input integer)\nStep 2: sum = 0 (accumulator)\nStep 3: for loop\nStep 4: start = 1, end = n, next step = +1\nStep 5: sum = sum + i";
    }
  }

  return {
    hasInputVar,
    hasAccumulator,
    hasCounter,
    hasLoopConstruct,
    hasOperators,
    hasWrongSumAccumulation,
    hasPrintedInputVarInIngredients,
    completedCount,
    allIngredientsDone,
    ingredientsStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

function validateSumOfNSampleCode(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().trim();

  // Extract declared input variable name (e.g. a = 5, n = 5, etc.)
  let declaredInputVar = null;
  const inputDeclMatch = text.match(/(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=\s*(?:int\(input\(\)\)|[0-9]+|parseInt|prompt|scanner|cin)/i);
  if (inputDeclMatch && !/^(?:sum|total|sum_val|i|count)$/i.test(inputDeclMatch[1])) {
    declaredInputVar = inputDeclMatch[1];
  } else {
    const genericInputMatch = text.match(/\b([a-zA-Z_]\w*)\s*=\s*(?:[0-9]+|int\(input)/i);
    if (genericInputMatch && !/^(?:sum|total|sum_val|i|count)$/i.test(genericInputMatch[1])) {
      declaredInputVar = genericInputMatch[1];
    }
  }

  const hasInput = /(?:int\s+)?[na]\s*=\s*(?:int\(input\(\)\)|[0-9]+|parseInt|prompt|scanner|cin)/i.test(text) ||
                   /\b(?:let|const|var|int)?\s*[a-zA-Z_]\w*\s*=\s*(?:int\(input\(\)\)|[0-9]+|parseInt|prompt)/i.test(text) ||
                   /\b(?:input\(\)|scanner|cin|prompt)\b/i.test(norm) ||
                   Boolean(declaredInputVar);

  const hasAccumulator = /(?:let|const|var|int\s+)?(?:sum|total|sum_val)\s*=\s*0\b/i.test(text);

  const isSyntaxQuery = norm.includes("syntax") || norm.includes("syntax theriyala") || norm.includes("syntax theriyathunu") || norm.includes("syntax enna") || norm.includes("how to write for loop") || norm.includes("how to write loop") || norm.includes("for loop syntax") || norm.includes("loop syntax") || norm.includes("syntax help") || norm.includes("don't know syntax") || norm.includes("dont know syntax") || norm.includes("loop theriyala") || norm.includes("did not know how to write loop") || norm.includes("don't know how to write loop") || norm.includes("dont know how to write loop") || norm.includes("loop example");
  if (isSyntaxQuery) {
    const loopExamples = `

🐍 **Python:**
\`\`\`python
for i in range(1, ${declaredInputVar || 'n'} + 1):
\`\`\`

💻 **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= ${declaredInputVar || 'n'}; i++) {
}
\`\`\`

☕ **Java / C:**
\`\`\`java
for (int i = 1; i <= ${declaredInputVar || 'n'}; i++) {
}
\`\`\``;
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
          { stepNumber: 1, title: `Input Variable (${declaredInputVar || 'n'})`, completed: true, current: false },
          { stepNumber: 2, title: "Accumulator (sum = 0)", completed: true, current: false },
          { stepNumber: 3, title: `Loop Construct (1 to ${declaredInputVar || 'n'})`, completed: false, current: true },
          { stepNumber: 4, title: "Accumulate Sum (sum += i)", completed: false, current: false },
          { stepNumber: 5, title: "Display Sum (print / output)", completed: false, current: false }
        ],
        feedback: `🌟 Coach Maara here! Happy to help you with the loop! It is completely normal for loop syntax to feel tricky at first.

Since you have already set up your input \`${declaredInputVar || 'n'}\` and accumulator \`sum = 0\`, here are clear examples of how to write the loop:${loopExamples}

👉 **Next Step:** Try adding the loop to your code! You can also click **Insert Prototype Example** below.`,
        correction: `Step 3: Add your for loop iterating from 1 to ${declaredInputVar || 'n'}.`,
        suggestedInput: `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`
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
        { stepNumber: 1, title: "Input Variable (n)", completed: false, current: true },
        { stepNumber: 2, title: "Accumulator (sum = 0)", completed: false, current: false },
        { stepNumber: 3, title: "Loop Construct (1 to n)", completed: false, current: false },
        { stepNumber: 4, title: "Accumulate Sum (sum += i)", completed: false, current: false },
        { stepNumber: 5, title: "Display Sum (print / output)", completed: false, current: false }
      ],
      feedback: `🌟 Coach Maara here! Happy to help with the loop syntax! Here is how to write the loop:${loopExamples}

Now try assembling your prototype step by step: start with declaring \`${declaredInputVar || 'n'}\` and \`sum = 0\`!`,
      correction: "Start with Step 1 & 2: declare input n and accumulator sum = 0.",
      suggestedInput: "for i in range(1, n + 1):"
    };
  }

  // Extract loop details from JS/Java style loops
  const jsLoopMatch = text.match(/for\s*\(\s*(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=\s*(?:0|1)\s*;\s*([a-zA-Z_]\w*)\s*(<=|<|>=|>|==)\s*([a-zA-Z_]\w*|\d+)\s*;\s*([^)]*)\)/i);
  let loopIterVar = "i";
  let loopOp = null;
  let loopLimitVar = null;
  if (jsLoopMatch) {
    loopIterVar = jsLoopMatch[1];
    loopOp = jsLoopMatch[3];
    loopLimitVar = jsLoopMatch[4];
  } else {
    const pyMatch = text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range\s*\(\s*(?:0\s*,\s*)?(?:1\s*,\s*)?([^)]+)\)/i);
    if (pyMatch) {
      loopIterVar = pyMatch[1];
      loopLimitVar = pyMatch[2].trim();
    }
  }

  // Check 1: Variable mismatch between declared input variable (e.g. 'a') and loop condition variable (e.g. 'n')
  const hasVarMismatch = Boolean(
    declaredInputVar &&
    loopLimitVar &&
    isNaN(Number(loopLimitVar)) &&
    declaredInputVar.toLowerCase() !== loopLimitVar.toLowerCase() &&
    !loopLimitVar.toLowerCase().includes(declaredInputVar.toLowerCase())
  );

  // Check 2: Strict less than (<) condition in loop
  const hasStrictLessThan = loopOp === "<";

  const validJsJavaLoop = /for\s*\(\s*(?:(?:let|var|const|int)\s+)?[a-zA-Z_]\w*\s*=\s*(?:0|1)\s*;\s*[a-zA-Z_]\w*\s*<=\s*(?:n|[0-9]+|\w+)\s*;\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1|[a-zA-Z_]\w*\s*=\s*[a-zA-Z_]\w*\s*\+\s*1)\s*\)/i.test(text);
  const validPythonRange = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:0\s*,\s*)?(?:1\s*,\s*)?(?:n\s*\+\s*1|[a-zA-Z_]\w*\s*\+\s*1|[0-9]+)\s*\)/i.test(text);
  const pythonRangeWithoutPlusOne = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:0\s*,\s*)?1\s*,\s*(?:n|[a-zA-Z_]\w*)\s*\)/i.test(text);
  const validWhileLoop = /while\s*\(?\s*[a-zA-Z_]\w*\s*<=\s*(?:n|[0-9]+|\w+)\s*\)?/i.test(text);
  const hasColonInFor = /for\s*\([^)]*:[^)]*\)/i.test(text);
  const hasIncrementInCondition = /for\s*\([^;:]*[:;]\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1)\s*[:;]/i.test(text);
  const hasInvertedCondition = /for\s*\([^)]*(?:>=|>)\s*(?:5|n|[0-9]+)[^)]*\)|while\s*\(?[^)]*(?:>=|>)\s*(?:5|n|[0-9]+)\)?/i.test(text);
  const pythonRangeZero = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*(?:n|[0-9]+)\s*\)/i.test(text);
  const hasDecrement = /for\s*\([^)]*--[^)]*\)/i.test(text);

  let loopErrorFeedback = "";
  let loopErrorCorrection = "";
  let loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;

  if (hasVarMismatch && hasStrictLessThan) {
    loopErrorFeedback = `⚠️ Coach Maara here! Look closely at your \`for\` loop condition \`i < ${loopLimitVar}\`:

1. 🔍 **Undeclared Variable:** You declared your input variable as \`${declaredInputVar} = 5\`, but in your loop condition you wrote \`i < ${loopLimitVar}\`. Variable \`${loopLimitVar}\` was never declared and does not exist (throws ReferenceError: ${loopLimitVar} is not defined)!
2. 🔢 **Stopping Too Early (<):** You wrote \`i < ${loopLimitVar}\`. The strictly-less-than operator (\`<\`) stops at 4, excluding your input number (${declaredInputVar} = 5) from the sum, which calculates 10 instead of 15!

👉 **Solution:** Change \`i < ${loopLimitVar}\` to \`i <= ${declaredInputVar}\` to use your declared variable and include the final number!`;
    loopErrorCorrection = `Fix loop condition: change "i < ${loopLimitVar}" to "i <= ${declaredInputVar}".`;
    loopSuggested = `for (int i = 1; i <= ${declaredInputVar}; i++) {\n  sum = sum + i;\n}`;
  } else if (hasVarMismatch) {
    loopErrorFeedback = `⚠️ Coach Maara here! In your loop condition, you wrote \`i ${loopOp || "<="} ${loopLimitVar}\`.

Notice that you declared your input variable as \`${declaredInputVar} = 5\`, not \`${loopLimitVar}\`! Variable \`${loopLimitVar}\` was never declared and is undefined in your program.

👉 **Solution:** Change \`${loopLimitVar}\` to your declared input variable \`${declaredInputVar}\`: \`i <= ${declaredInputVar}\`.`;
    loopErrorCorrection = `In loop condition, change "${loopLimitVar}" to your declared variable "${declaredInputVar}": "i <= ${declaredInputVar}".`;
    loopSuggested = `for (int i = 1; i <= ${declaredInputVar}; i++)`;
  } else if (hasStrictLessThan) {
    loopErrorFeedback = `⚠️ Coach Maara here! In your loop condition, you wrote \`i < ${loopLimitVar}\`.

The strictly-less-than operator (\`<\`) stops one number before \`${loopLimitVar}\` (e.g. for 5, it only counts 1, 2, 3, 4 and stops before 5). This excludes \`${loopLimitVar}\` and calculates 10 instead of 15!

👉 **Solution:** Use \`<=\` so the loop includes \`${loopLimitVar}\`: \`i <= ${loopLimitVar}\`.`;
    loopErrorCorrection = `Change "<" to "<=" in your loop condition: "i <= ${loopLimitVar}".`;
    loopSuggested = `for (int i = 1; i <= ${declaredInputVar || loopLimitVar}; i++)`;
  } else if (hasColonInFor && hasIncrementInCondition) {
    loopErrorFeedback = "⚠️ In Step 3, your `for` loop has two syntax issues:\n1. In JavaScript/Java, the 3 parts of a `for` loop must be separated by semicolons (`;`), not colons (`:`).\n2. The standard order is `for (initialization; condition; update)`. You placed the increment (`i++`) in the middle position instead of the end!\n3. Also, your condition `i >= 5` is inverted (it should be `i <= n` or `i <= 5`).\n\nCorrect syntax structure:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = `Fix for loop syntax: for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
    loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
  } else if (hasColonInFor) {
    loopErrorFeedback = "⚠️ In JavaScript/Java, the three parts of a `for` loop must be separated by semicolons (`;`), not colons (`:`).\n\nStructure:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = `Use semicolons (;) in for loop: for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
    loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
  } else if (hasIncrementInCondition) {
    loopErrorFeedback = "⚠️ In a `for` loop, the structure is:\n`for (initialization; condition; update)`\n\nYou placed the increment (`i++`) in the middle (condition) position! Place the condition (`i <= n`) second and the increment (`i++`) third:\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = `Place condition second and increment last: for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
    loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
  } else if (hasInvertedCondition) {
    loopErrorFeedback = "⚠️ In your loop condition, you wrote `i >= 5` (or `i >= n`). Since `i` starts at 1, the condition `1 >= 5` is immediately false, so the loop will never execute even once! To count from 1 up to n, use `i <= n` (or `i <= 5`):\n`for (let i = 1; i <= n; i++)`";
    loopErrorCorrection = `Change loop condition from >= to <= (e.g. i <= ${declaredInputVar || 'n'}).`;
    loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
  } else if (hasDecrement) {
    loopErrorFeedback = "⚠️ To count up from 1 to n, you need to increment with `i++` (or `i += 1`) instead of decrementing (`i--`).";
    loopErrorCorrection = "Use i++ instead of i--.";
    loopSuggested = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
  } else if (pythonRangeWithoutPlusOne && !validPythonRange) {
    loopErrorFeedback = `⚠️ In Python, \`range(1, ${loopLimitVar || 'n'})\` stops at \`${loopLimitVar || 'n'} - 1\` (for example, \`range(1, 5)\` only reaches 4). To include \`${declaredInputVar || loopLimitVar || 'n'}\` in the sum, use \`range(1, ${declaredInputVar || loopLimitVar || 'n'} + 1)\`:\n\`for i in range(1, ${declaredInputVar || loopLimitVar || 'n'} + 1):\``;
    loopErrorCorrection = `Use range(1, ${declaredInputVar || loopLimitVar || 'n'} + 1) in Python to include the final number.`;
    loopSuggested = `for i in range(1, ${declaredInputVar || loopLimitVar || 'n'} + 1):`;
  } else if (pythonRangeZero && !validPythonRange) {
    loopErrorFeedback = "⚠️ In Python, `range(n)` starts at 0 and stops at `n - 1`. To sum numbers starting from 1 up to `n`, specify start 1: `range(1, n + 1)`:\n`for i in range(1, n + 1):`";
    loopErrorCorrection = `Use range(1, ${declaredInputVar || 'n'} + 1) to iterate from 1 to n.`;
    loopSuggested = `for i in range(1, ${declaredInputVar || 'n'} + 1):`;
  }

  const hasLoop = (validJsJavaLoop || validPythonRange || validWhileLoop) &&
                  !hasColonInFor &&
                  !hasIncrementInCondition &&
                  !hasInvertedCondition &&
                  !hasDecrement &&
                  !hasVarMismatch &&
                  !hasStrictLessThan;

  const loopVarMatch = text.match(/for\s*\(\s*(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=/i) || text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range/i) || text.match(/while\s*\(?\s*([a-zA-Z_]\w*)\s*(?:<=|<)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : "i";

  const validSumUpdateRegex = new RegExp(`(?:sum|total|sum_val)\\s*(?:\\+=\\s*${loopVar}|=\\s*(?:sum|total|sum_val)\\s*\\+\\s*${loopVar})\\b`, "i");
  const hasValidSumUpdate = validSumUpdateRegex.test(text);
  const hasSumOverwriteVarPlusI = new RegExp(`(?:sum|total|sum_val)\\s*=\\s*(?:(?:[na]|input\\w*|start\\w*|limit\\w*|val\\w*|\\d+)\\s*\\+\\s*${loopVar}|${loopVar}\\s*\\+\\s*(?:[na]|input\\w*|start\\w*|limit\\w*|val\\w*|\\d+))\\b`, "i").test(text);
  const hasSumAddInputVar = new RegExp(`(?:sum|total|sum_val)\\s*(?:\\+=\\s*(?:[na]|input\\w*|limit\\w*)|=\\s*(?:sum|total|sum_val)\\s*\\+\\s*(?:[na]|input\\w*|limit\\w*))\\b`, "i").test(text);
  const hasSumAddConstantNum = /(?:sum|total|sum_val)\s*(?:\+=\s*[0-9]+|=\s*(?:sum|total|sum_val)\s*\+\s*[0-9]+)\b/i.test(text);
  const hasSumAddStartNum = /(?:sum|total|sum_val)\s*(?:\+=\s*start\w*|=\s*(?:sum|total|sum_val)\s*\+\s*start\w*)\b/i.test(text);
  const hasSumOverwriteI = /(?:sum|total|sum_val)\s*=\s*[a-zA-Z_]\w*(?:\s*\+\s*1)?\s*(?:;|\n|$)/i.test(text) && !validSumUpdateRegex.test(text) && !hasSumOverwriteVarPlusI;

  let sumErrorFeedback = "";
  let sumErrorCorrection = "";
  let sumSuggested = `    sum += ${loopVar};`;

  if (hasSumOverwriteVarPlusI && !hasValidSumUpdate) {
    const wrongVarMatch = text.match(new RegExp(`(?:sum|total|sum_val)\\s*=\\s*([a-zA-Z0-9_]+)\\s*\\+\\s*${loopVar}`, "i")) || text.match(new RegExp(`(?:sum|total|sum_val)\\s*=\\s*${loopVar}\\s*\\+\\s*([a-zA-Z0-9_]+)`, "i"));
    const wrongVar = wrongVarMatch ? wrongVarMatch[1] : "a";
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = ${wrongVar} + ${loopVar}\`.\n\nNotice that this overwrites \`sum\` on every iteration with \`${wrongVar} + ${loopVar}\` instead of accumulating into the running total! To add each number into the existing sum, add \`${loopVar}\` to \`sum\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change sum = ${wrongVar} + ${loopVar} to sum = sum + ${loopVar} (or sum += ${loopVar}).`;
    sumSuggested = `    sum += ${loopVar};`;
  } else if (hasSumAddInputVar && !hasValidSumUpdate) {
    sumErrorFeedback = `⚠️ In Step 4, you wrote \`sum = sum + input\` (or added the input limit variable).\n\nNotice that the input variable is the fixed limit (e.g. 5). If you add the input variable, the loop will add 5 every single time (5 + 5 + 5 + 5 + 5 = 25) instead of adding each incrementing number (1 + 2 + 3 + 4 + 5 = 15)!\n\nTo accumulate each number from the loop, add the loop variable \`${loopVar}\`:\n\`sum = sum + ${loopVar}\` (or \`sum += ${loopVar}\`).`;
    sumErrorCorrection = `Change to add loop variable ${loopVar}: sum = sum + ${loopVar} (or sum += ${loopVar}).`;
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

  const hasSumUpdate = Boolean(hasValidSumUpdate);

  const sumContainerWords = ["sum", "total", "sum_val", "ans", "result"];
  const sumContainerPattern = `(?:${sumContainerWords.join("|")})`;
  const hasContainerInPrint = new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${sumContainerPattern}\\b[^)]*\\)`, "i").test(text) || new RegExp(`cout\\s*<<[^;]*\\b${sumContainerPattern}\\b`, "i").test(text) || new RegExp(`printf\\s*\\([^)]*\\b${sumContainerPattern}\\b[^)]*\\)`, "i").test(text);

  const hasPrintedInputInstead = !hasContainerInPrint && (
    new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b(?:n|${declaredInputVar || 'a'})\\b[^)]*\\)`, "i").test(text) ||
    new RegExp(`cout\\s*<<[^;]*\\b(?:n|${declaredInputVar || 'a'})\\b`, "i").test(text) ||
    new RegExp(`printf\\s*\\([^)]*\\b(?:n|${declaredInputVar || 'a'})\\b[^)]*\\)`, "i").test(text)
  );
  const hasPrintedLoopVarInstead = !hasContainerInPrint && (new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, "i").test(text) || new RegExp(`cout\\s*<<[^;]*\\b${loopVar}\\b`, "i").test(text) || new RegExp(`printf\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, "i").test(text));
  const hasAnyOtherPrint = !hasContainerInPrint && (/print\s*\(/i.test(text) || /console\.log\s*\(/i.test(text) || /System\.out\.print(?:ln)?\s*\(/i.test(text) || /cout\s*<</i.test(text) || /printf\s*\(/i.test(text));
  const hasPrint = hasContainerInPrint;

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: `Input Variable (${declaredInputVar || 'n'})`, completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: "Accumulator (sum = 0)", completed: hasAccumulator, current: hasInput && !hasAccumulator },
    { stepNumber: 3, title: `Loop Construct (1 to ${declaredInputVar || 'n'})`, completed: hasLoop, current: hasInput && hasAccumulator && !hasLoop },
    { stepNumber: 4, title: "Accumulate Sum (sum += i)", completed: hasSumUpdate, current: hasInput && hasAccumulator && hasLoop && !hasSumUpdate },
    { stepNumber: 5, title: "Display Sum (print / output)", completed: hasPrint, current: hasInput && hasAccumulator && hasLoop && hasSumUpdate && !hasPrint }
  ];

  const completedCount = [hasInput, hasAccumulator, hasLoop, hasSumUpdate, hasPrint].filter(Boolean).length;
  const allVerified = hasInput && hasAccumulator && hasLoop && hasSumUpdate && hasPrint;

  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (allVerified) {
    feedback = "🎉 Taste the Sample Verified! Fantastic work! Your prototype correctly implements the full algorithm across all 5 steps:\n• Input variable `" + (declaredInputVar || 'n') + "`\n• Initial accumulator `sum = 0`\n• Loop iterating from 1 to `" + (declaredInputVar || 'n') + "`\n• Accumulator update (`sum += i`)\n• Output printing the final total (`console.log(sum)`)\n\nYou are fully ready to code and test!";
    correction = "You're ready to code!";
    suggestedInput = "";
  } else if (!hasInput && !hasAccumulator && !hasLoop && !hasSumUpdate && !hasPrint) {
    feedback = "🌟 Welcome to Stage 4: Taste the Sample! Let's assemble our verified ingredients into a working code prototype step by step.\n\n👉 **Step 1 & 2:** Start by declaring your input variable `n` and initializing your accumulator `sum = 0`.";
    correction = "Start with Step 1 & 2: declare your input n and accumulator sum = 0.";
    suggestedInput = "let n = 5;\nlet sum = 0;";
  } else if (!hasInput || !hasAccumulator) {
    feedback = "🌟 Great start! Make sure you have both your input variable and accumulator `sum = 0` initialized before starting the loop.\n\n👉 Next: Initialize your input variable and `sum = 0`.";
    correction = "Initialize input and sum = 0.";
    suggestedInput = !hasInput ? "let n = 5;" : "let sum = 0;";
  } else if (!hasLoop) {
    if (loopErrorFeedback) {
      feedback = loopErrorFeedback;
      correction = loopErrorCorrection;
      suggestedInput = loopSuggested;
    } else if (attemptCount >= 3) {
      feedback = `🌟 Coach Maara here! Let's get this loop written together so you can move forward! Here is the exact template you can place after your input and \`sum = 0\`:

💻 **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= ${declaredInputVar || 'n'}; i++) {
  sum += i;
}
\`\`\`

🐍 **Python:**
\`\`\`python
for i in range(1, ${declaredInputVar || 'n'} + 1):
    sum += i
\`\`\`

👉 **Next Action:** Add this loop right below \`sum = 0\`!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${declaredInputVar || 'n'}.`;
      suggestedInput = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
    } else {
      feedback = `🌟 Great job declaring your input and \`sum = 0\`!\n\n👉 **Step 3:** Now write your \`for\` loop to repeat from 1 to \`${declaredInputVar || 'n'}\`:\n\`for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)\``;
      correction = `Step 3: Add your for loop iterating from 1 to ${declaredInputVar || 'n'}.`;
      suggestedInput = `for (let i = 1; i <= ${declaredInputVar || 'n'}; i++)`;
    }
  } else if (!hasSumUpdate) {
    if (sumErrorFeedback) {
      feedback = sumErrorFeedback;
      correction = sumErrorCorrection;
      suggestedInput = sumSuggested;
    } else {
      feedback = `🌟 Awesome! Your loop is set up cleanly.\n\n👉 **Step 4:** Inside the loop, add the statement to accumulate each number \`${loopVar}\` into \`sum\` (\`sum += ${loopVar}\` or \`sum = sum + ${loopVar}\`).`;
      correction = `Step 4: Add sum += ${loopVar} inside the loop.`;
      suggestedInput = `    sum += ${loopVar};`;
    }
  } else if (!hasPrint) {
    if (hasPrintedInputInstead) {
      feedback = `⚠️ Coach Maara note: Take a close look at your last line where you printed \`${declaredInputVar || 'n'}\`!\n\n\`${declaredInputVar || 'n'}\` is your original input limit (e.g. 5), whereas your accumulated sum is safely stored in variable \`sum\`!\n\nIf you print \`${declaredInputVar || 'n'}\`, you will only output the input number instead of the final sum.\n\n👉 **Update your print statement to output your accumulator:**\n\`console.log(sum)\` (or \`print(sum)\`)`;
      correction = `Change print(${declaredInputVar || 'n'}) to console.log(sum) to output the final sum.`;
      suggestedInput = "console.log(sum);";
    } else if (hasPrintedLoopVarInstead) {
      feedback = `⚠️ Coach Maara note: In Step 5, you printed the loop variable \`${loopVar}\` (\`print(${loopVar})\`). \`${loopVar}\` is only the counter variable! Your accumulated sum is in \`sum\`.\n\n👉 **Update your print statement to output your accumulator:**\n\`console.log(sum)\``;
      correction = `Change print(${loopVar}) to console.log(sum).`;
      suggestedInput = "console.log(sum);";
    } else if (hasAnyOtherPrint) {
      feedback = "⚠️ Coach Maara note: In Step 5, you added an output statement, but make sure to print your accumulator variable `sum` to display the final calculated sum:\n`console.log(sum)`";
      correction = "Print accumulator: console.log(sum).";
      suggestedInput = "console.log(sum);";
    } else {
      feedback = "🌟 Almost finished! Your calculation logic is complete.\n\n👉 **Step 5:** After the loop ends, add your output statement (`console.log(sum)` or `print(sum)`) to display the final calculated sum to the user.";
      correction = "Step 5: Add console.log(sum) to display the final result.";
      suggestedInput = "console.log(sum);";
    }
  }

  return {
    hasInput,
    hasAccumulator,
    hasLoop,
    hasSumUpdate,
    hasPrint,
    hasVarMismatch,
    hasStrictLessThan,
    completedCount,
    allVerified,
    isSyntaxQuery: false,
    sampleCodeStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

export {
  checkProgrammingWordsInRecipe,
  checkSumArithmetic,
  extractDeclaredN,
  extractStatedSum,
  validateSumOfNIngredients,
  validateSumOfNLogic,
  validateSumOfNRecipe,
  validateSumOfNSampleCode
};
