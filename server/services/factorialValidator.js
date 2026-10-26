function getFactorialValue(n) {
  let val = 1;
  for (let i = 1; i <= n; i++) val *= i;
  return val;
}

function getFactorialTerms(n) {
  const terms = [];
  for (let i = n; i >= 1; i--) terms.push(i);
  return terms.join(" * ");
}

function getFactorialFormula(n) {
  const terms = [];
  for (let i = n; i >= 1; i--) terms.push(i);
  return `${terms.join("*")} = ${getFactorialValue(n)}`;
}

function getFactorialStepByStepTrace(n) {
  if (n <= 1) return `1*1=1`;
  const steps = [];
  let running = n;
  for (let i = n - 1; i >= 1; i--) {
    const nextVal = running * i;
    steps.push(`${running}*${i}=${nextVal}`);
    running = nextVal;
  }
  return steps.join("\n");
}

function extractFactorialN(text) {
  const nMatch = text.match(/(?:^|\b)(?:n|num|number|input)\s*[:=]\s*(\d+)/i);
  if (nMatch) {
    const parsed = parseInt(nMatch[1], 10);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }
  const factMatch = text.match(/(\d+)\s*!/);
  if (factMatch) {
    const parsed = parseInt(factMatch[1], 10);
    if (parsed >= 1 && parsed <= 20) return parsed;
  }
  const eqRegex = /(?:^|[^\*×x\d])(\d+)\s*[\*×x]\s*(\d+)\s*=\s*(\d+)/gi;
  const eqList = [];
  let m;
  while ((m = eqRegex.exec(text)) !== null) {
    eqList.push({ a: parseInt(m[1], 10), b: parseInt(m[2], 10), prod: parseInt(m[3], 10) });
  }
  if (eqList.length > 0) {
    const firstMax = Math.max(eqList[0].a, eqList[0].b);
    const firstMin = Math.min(eqList[0].a, eqList[0].b);
    if (firstMax >= 3 && firstMin === firstMax - 1) {
      return firstMax;
    }
    let maxMultiplier = 1;
    for (const eq of eqList) {
      const smaller = Math.min(eq.a, eq.b);
      if (smaller > maxMultiplier && smaller <= 20) maxMultiplier = smaller;
    }
    if (maxMultiplier >= 3 && maxMultiplier <= 20) return maxMultiplier;
  }
  return 5;
}

function checkFactorialProductExpression(text) {
  const chainRegex = /((?:\d+\s*[\*×x]\s*)+\d+)(?:\s*=\s*(\d+))?/gi;
  let match;
  while ((match = chainRegex.exec(text)) !== null) {
    const expr = match[1];
    const statedResult = match[2] ? parseInt(match[2], 10) : void 0;
    const parts = expr.split(/[\*×x]/i).map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    if (parts.length >= 2) {
      const calculatedProduct = parts.reduce((acc, curr) => acc * curr, 1);
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
      if (isConsecutive && endsNearOne || parts.length >= 3) {
        if (statedResult !== void 0) {
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
  const factNotationRegex = /(\d+)\s*!\s*=\s*(\d+)/gi;
  while ((match = factNotationRegex.exec(text)) !== null) {
    const n = parseInt(match[1], 10);
    const stated = parseInt(match[2], 10);
    const fact = (num) => num <= 1 ? 1 : num * fact(num - 1);
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

function checkFactorialSequence(text, userN) {
  const eqRegex = /(?:^|[^\*×x\d])(\d+)\s*[\*×x]\s*(\d+)\s*=\s*(\d+)/gi;
  const equations = [];
  let match;
  while ((match = eqRegex.exec(text)) !== null) {
    const a = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);
    const prod = parseInt(match[3], 10);
    equations.push({ a, b, prod, raw: `${a}*${b}=${prod}` });
  }

  if (equations.length === 0) {
    return {
      hasEquations: false,
      equationsCount: 0,
      isValidChain: false,
      isFullyComplete: false
    };
  }

  const expectedFactVal = getFactorialValue(userN);
  const termsStr = getFactorialTerms(userN);

  // 1. Math arithmetic check: filter out errors that were subsequently corrected below
  const validEquations = equations.filter((eq) => eq.a * eq.b === eq.prod);
  const uncorrectedEquations = equations.filter((eq) => {
    if (eq.a * eq.b === eq.prod) return false;
    const isCorrected = validEquations.some((v) => (v.a === eq.a && v.b === eq.b) || (v.a === eq.b && v.b === eq.a));
    return !isCorrected;
  });

  if (uncorrectedEquations.length > 0) {
    const eq = uncorrectedEquations[0];
    return {
      hasEquations: true,
      equationsCount: equations.length,
      isValidChain: false,
      isFullyComplete: false,
      errorType: "arithmetic_error",
      feedback: `🌟 Coach Maara here! Arithmetic check: In "${eq.raw}", ${eq.a} * ${eq.b} = ${eq.a * eq.b}, not ${eq.prod}! Please correct this multiplication before continuing.`,
      correction: `Fix "${eq.raw}" to ${eq.a} * ${eq.b} = ${eq.a * eq.b}.`,
      suggestedInput: `${eq.a} * ${eq.b} = ${eq.a * eq.b}`
    };
  }

  // Use only valid equations for chain tracing if corrected equations exist
  if (validEquations.length > 0 && validEquations.length < equations.length) {
    equations = validEquations;
  }

  // 2. Determine sequence direction (Descending vs Ascending)
  const eq0 = equations[0];
  const max0 = Math.max(eq0.a, eq0.b);
  const min0 = Math.min(eq0.a, eq0.b);

  const isDescending = (max0 === userN && min0 === userN - 1) || (max0 >= 3 && min0 === max0 - 1);
  const isAscending = (eq0.a === 1 && eq0.b === 2) || (eq0.a === 2 && eq0.b === 1) || (eq0.a === 1 && eq0.b === 1);

  if (!isDescending && !isAscending) {
    if (max0 === userN) {
      return {
        hasEquations: true,
        equationsCount: equations.length,
        isValidChain: false,
        isFullyComplete: false,
        errorType: "wrong_first_step",
        feedback: `🌟 Coach Maara here! Factorial starts by multiplying ${userN} with the consecutive number right below it (${userN - 1}). For ${userN}!, the first step should be ${userN} * ${userN - 1} = ${userN * (userN - 1)}.`,
        correction: `Start with ${userN} * ${userN - 1} = ${userN * (userN - 1)}.`,
        suggestedInput: `${userN} * ${userN - 1} = ${userN * (userN - 1)}`
      };
    }

    return {
      hasEquations: true,
      equationsCount: equations.length,
      isValidChain: false,
      isFullyComplete: false,
      errorType: "invalid_start",
      feedback: `🌟 Coach Maara here! To demonstrate ${userN}! step by step, start with either descending (${userN} * ${userN - 1} = ${userN * (userN - 1)}) or ascending (1 * 2 = 2).`,
      correction: `Start with ${userN} * ${userN - 1} = ${userN * (userN - 1)}.`,
      suggestedInput: `${userN} * ${userN - 1} = ${userN * (userN - 1)}`
    };
  }

  // 3. Trace Descending Chain
  if (isDescending) {
    let currentProd = max0 * min0;
    let nextMultiplier = min0 - 1;

    if (equations.length === 1) {
      if (currentProd === expectedFactVal) {
        return {
          hasEquations: true,
          equationsCount: 1,
          isValidChain: true,
          isFullyComplete: true,
          finalProduct: currentProd
        };
      }
      return {
        hasEquations: true,
        equationsCount: 1,
        isValidChain: true,
        isFullyComplete: false,
        isIncomplete: true,
        feedback: `🌟 Coach Maara here! Good start! You calculated ${eq0.raw}. But ${userN}! is not complete yet (${userN}! = ${expectedFactVal}). Continue by multiplying your result ${currentProd} by the next number (${nextMultiplier}): ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
        correction: `Next step: multiply ${currentProd} by ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}).`,
        suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
      };
    }

    for (let i = 1; i < equations.length; i++) {
      const eq = equations[i];
      const hasPrevProd = (eq.a === currentProd || eq.b === currentProd);

      if (!hasPrevProd) {
        return {
          hasEquations: true,
          equationsCount: equations.length,
          isValidChain: false,
          isFullyComplete: false,
          errorType: "broken_chain",
          feedback: `🌟 Coach Maara here! In factorial, each step multiplies the accumulated product by the next number. After reaching ${currentProd}, you need to multiply ${currentProd} with the next number in sequence (${nextMultiplier}): ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          correction: `Multiply the previous result ${currentProd} by ${nextMultiplier}: ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
        };
      }

      const actualMultiplier = (eq.a === currentProd) ? eq.b : eq.a;

      // Allow optional terminal step multiplying by 1 if already reached expectedFactVal
      if (currentProd === expectedFactVal && actualMultiplier === 1) {
        currentProd = currentProd * 1;
        continue;
      }

      if (actualMultiplier !== nextMultiplier) {
        return {
          hasEquations: true,
          equationsCount: equations.length,
          isValidChain: false,
          isFullyComplete: false,
          errorType: "wrong_multiplier",
          feedback: `🌟 Coach Maara here! In ${userN}! (${userN} factorial), each number from ${userN} down to 1 is multiplied once (${termsStr}). After ${equations[i - 1].raw}, the next number to multiply is ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}), not ${actualMultiplier}!`,
          correction: `Change "${eq.raw}" to ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
        };
      }

      currentProd = currentProd * nextMultiplier;
      nextMultiplier--;
    }

    if (currentProd === expectedFactVal) {
      return {
        hasEquations: true,
        equationsCount: equations.length,
        isValidChain: true,
        isFullyComplete: true,
        finalProduct: currentProd
      };
    }

    return {
      hasEquations: true,
      equationsCount: equations.length,
      isValidChain: true,
      isFullyComplete: false,
      isIncomplete: true,
      feedback: `🌟 Coach Maara here! Good progress! You've reached ${currentProd}. But ${userN}! is not complete yet (${userN}! = ${expectedFactVal}). Next step: multiply your result ${currentProd} by ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}).`,
      correction: `Add the next step: ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
      suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
    };
  }

  // 4. Trace Ascending Chain
  if (isAscending) {
    let currentProd = eq0.prod;
    let nextMultiplier = 2;
    if (eq0.a === 1 && eq0.b === 2 || eq0.a === 2 && eq0.b === 1) {
      currentProd = 2;
      nextMultiplier = 3;
    }

    if (equations.length === 1 && currentProd !== expectedFactVal) {
      return {
        hasEquations: true,
        equationsCount: 1,
        isValidChain: true,
        isFullyComplete: false,
        isIncomplete: true,
        feedback: `🌟 Coach Maara here! Good start! You calculated ${eq0.raw}. To complete ${userN}! = ${expectedFactVal}, next step: multiply ${currentProd} by ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}).`,
        correction: `Next step: multiply ${currentProd} by ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}).`,
        suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
      };
    }

    for (let i = 1; i < equations.length; i++) {
      const eq = equations[i];
      const hasPrevProd = (eq.a === currentProd || eq.b === currentProd);

      if (!hasPrevProd) {
        return {
          hasEquations: true,
          equationsCount: equations.length,
          isValidChain: false,
          isFullyComplete: false,
          errorType: "broken_chain",
          feedback: `🌟 Coach Maara here! In factorial, each step multiplies the accumulated product by the next number. After reaching ${currentProd}, you need to multiply ${currentProd} with the next number in sequence (${nextMultiplier}): ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          correction: `Multiply the previous result ${currentProd} by ${nextMultiplier}: ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
        };
      }

      const actualMultiplier = (eq.a === currentProd) ? eq.b : eq.a;

      if (actualMultiplier !== nextMultiplier) {
        return {
          hasEquations: true,
          equationsCount: equations.length,
          isValidChain: false,
          isFullyComplete: false,
          errorType: "wrong_multiplier",
          feedback: `🌟 Coach Maara here! In ${userN}! (${userN} factorial), numbers are multiplied consecutively from 1 to ${userN}. After ${equations[i - 1].raw}, the next number to multiply is ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}), not ${actualMultiplier}!`,
          correction: `Change "${eq.raw}" to ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
          suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
        };
      }

      currentProd = currentProd * nextMultiplier;
      nextMultiplier++;
    }

    if (currentProd === expectedFactVal) {
      return {
        hasEquations: true,
        equationsCount: equations.length,
        isValidChain: true,
        isFullyComplete: true,
        finalProduct: currentProd
      };
    }

    return {
      hasEquations: true,
      equationsCount: equations.length,
      isValidChain: true,
      isFullyComplete: false,
      isIncomplete: true,
      feedback: `🌟 Coach Maara here! Good progress! You've reached ${currentProd}. To complete ${userN}! = ${expectedFactVal}, next step: multiply ${currentProd} by ${nextMultiplier} (${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}).`,
      correction: `Add the next step: ${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}.`,
      suggestedInput: `${currentProd} * ${nextMultiplier} = ${currentProd * nextMultiplier}`
    };
  }

  return {
    hasEquations: true,
    equationsCount: equations.length,
    isValidChain: false,
    isFullyComplete: false
  };
}

function checkFactorialArithmetic(text) {
  const userN = extractFactorialN(text);
  const seq = checkFactorialSequence(text, userN);
  return {
    hasEquations: seq.hasEquations,
    equationsCount: seq.equationsCount,
    allEquationsValid: seq.errorType !== "arithmetic_error",
    hasAccumulationChain: seq.isValidChain,
    finalProduct: seq.finalProduct
  };
}

function validateFactorialLogic(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s*×=]/g, " ");
  const userN = extractFactorialN(text);
  const formulaStr = getFactorialFormula(userN);
  const stepByStepStr = getFactorialStepByStepTrace(userN);
  const firstStep = userN >= 2 ? `${userN}*${userN - 1}=${userN * (userN - 1)}` : "1*1=1";
  const expectedFactVal = getFactorialValue(userN);

  const hasMultiplication = norm.includes("multiply") || norm.includes("product") || norm.includes("*") || norm.includes("\xD7") || norm.includes("into");
  const hasStartFromOne = norm.includes("start with 1") || norm.includes("start fact with 1") || norm.includes("from 1") || norm.includes("fact = 1") || norm.includes("product = 1") || norm.includes("1 to n") || norm.includes(`1 to ${userN}`) || norm.includes("1 to 5");
  const hasZeroSpecialCase = norm.includes("0! = 1") || norm.includes("0 factorial is 1") || norm.includes("zero factorial");

  const seq = checkFactorialSequence(text, userN);
  const prodChain = checkFactorialProductExpression(text);

  // If equations exist, sequential equation validation is definitive
  if (seq.hasEquations) {
    if (seq.isFullyComplete) {
      return {
        isFullyVerified: true,
        hasMultiplication: true,
        hasAccumulationTrace: true,
        hasStartFromOne,
        hasZeroSpecialCase,
        isOneLineDirectProduct: false,
        detectedN: userN,
        feedback: `🎉 Logic Approved! Spot on! You've clearly demonstrated how factorial accumulates step by step (reaching ${expectedFactVal} for n=${userN}). You are ready to proceed to the Recipe stage!`,
        correction: "Proceed to the Recipe stage to write the step-by-step algorithm.",
        suggestedInput: void 0
      };
    } else {
      return {
        isFullyVerified: false,
        hasMultiplication: true,
        hasAccumulationTrace: seq.isValidChain,
        hasStartFromOne,
        hasZeroSpecialCase,
        isOneLineDirectProduct: false,
        detectedN: userN,
        feedback: seq.feedback || `🌟 Coach Maara here! To find the factorial of ${userN} (${userN}!), show each multiplication step by step until you reach ${expectedFactVal}.`,
        correction: seq.correction || `Write the sequential multiplication steps starting from ${firstStep}.`,
        suggestedInput: seq.suggestedInput || stepByStepStr
      };
    }
  }

  // If single line product chain (e.g. 5*4*3*2*1=120 or 5!=120) without sequential steps
  if (prodChain.hasValidProductChain) {
    return {
      isFullyVerified: false,
      hasMultiplication: true,
      hasAccumulationTrace: false,
      hasStartFromOne,
      hasZeroSpecialCase,
      isOneLineDirectProduct: true,
      detectedN: userN,
      feedback: `🌟 Coach Maara here! While ${formulaStr} is mathematically true, in programming a computer cannot multiply all numbers at once in a single step! It calculates the product step by step using a loop and a running total. Can you break this down for n=${userN} into sequential multiplications (e.g., starting with ${firstStep}, then multiplying that result by the next number)?`,
      correction: `Break down ${userN}! into step-by-step multiplications showing how each previous result multiplies with the next number.`,
      suggestedInput: stepByStepStr
    };
  }

  // Verbal explanation check (only if student writes detailed algorithmic sentences without equations)
  const hasVerbalAccumulationLogic = (norm.includes("multiply") || norm.includes("product")) && (
    (norm.includes("start") && norm.includes("1") && (norm.includes("loop") || norm.includes("each number") || norm.includes("repeat"))) ||
    (norm.includes("fact") && norm.includes("1") && norm.includes("multiply") && (norm.includes("each") || norm.includes("1 to"))) ||
    (norm.includes("running") && (norm.includes("product") || norm.includes("total")) && norm.includes("multiply")) ||
    (norm.includes("previous") && (norm.includes("result") || norm.includes("product")) && norm.includes("next number"))
  );

  if (hasVerbalAccumulationLogic) {
    return {
      isFullyVerified: true,
      hasMultiplication: true,
      hasAccumulationTrace: true,
      hasStartFromOne,
      hasZeroSpecialCase,
      isOneLineDirectProduct: false,
      detectedN: userN,
      feedback: `🎉 Logic Approved! Spot on! You've clearly explained how factorial accumulates step by step (starting with 1 and sequentially multiplying each number). You are ready to proceed to the Recipe stage!`,
      correction: "Proceed to the Recipe stage to write the step-by-step algorithm.",
      suggestedInput: void 0
    };
  }

  return {
    isFullyVerified: false,
    hasMultiplication,
    hasAccumulationTrace: false,
    hasStartFromOne,
    hasZeroSpecialCase,
    isOneLineDirectProduct: false,
    detectedN: userN,
    feedback: `🌟 Coach Maara here! To find the factorial of ${userN} (${userN}!), how does a computer multiply the numbers step by step to reach ${expectedFactVal}? Try showing the sequential calculations (e.g. starting with ${firstStep}...).`,
    correction: `Write the sequential multiplication steps starting from ${firstStep}.`,
    suggestedInput: stepByStepStr
  };
}
function validateFactorialRecipe(text) {
  const norm = text.toLowerCase();
  const hasInput = /(accept|get|read|take|receive|read|input)\s*(a\s*)?(number|input|value|n\b)/i.test(norm) || /input\s*\(/i.test(norm) || norm.includes("get the input") || norm.includes("accept a number") || norm.includes("get input") || /step\s*1/i.test(norm) && (norm.includes("input") || norm.includes("number"));
  const hasGenerateNumbers = /(generate|create|list|count|get)\s*(all\s*)?numbers\s*(from\s*)?(1\s*(up\s*)?to|input\s*(number\s*)?(down\s*)?to\s*1|n\s*(down\s*)?to\s*1)/i.test(norm) || /generate\s*(all\s*)?numbers?\s*(from\s*)?1\s*(up\s*)?to\s*(the\s*)?(input|n)/i.test(norm) || /numbers?\s*(from\s*)?1\s*(up\s*)?to\s*(the\s*)?(input|n)/i.test(norm) || /numbers?\s*from\s*(the\s*)?input\s*(number\s*)?(down\s*to|to)\s*1/i.test(norm) || /(repeat|iterate|loop)\s*(for\s*)?(each|all)?\s*numbers?\s*(from\s*1|from\s*input|until\s*1|until\s*n|up\s*to\s*input|up\s*to\s*n)/i.test(norm) || norm.includes("generate all numbers from 1 up to the input") || norm.includes("generate all numbers from 1 to input") || norm.includes("generate numbers from input to 1") || norm.includes("generate all numbers") || norm.includes("repeat from 1 to n") || norm.includes("repeat until reaching 1") || norm.includes("repeat until reaching n") || norm.includes("count from 1 to n");
  const hasMultiplyEach = /(multiply|times)\s*(each|every)\s*(generated\s*)?number\s*(with|to|into)\s*(the\s*)?(factorial|fact|product|result|variable)/i.test(norm) || /multiply\s*each\s*(generated\s*)?number/i.test(norm) || /multiply\s*(all\s*)?the\s*numbers\s*with\s*(the\s*)?(factorial|fact|result)/i.test(norm) || /(multiply|multiplication)\s+.*?\b(previous|prior|accumulated|running)\b.*?\b(output|result|product|value|step)\b/i.test(norm) || /(multiply|multiplication)\s+.*?\b(next|current|generated)\s+(?:number|numbers)\b/i.test(norm) || /(multiply|multiplication)\s+(?:the\s+)?previous\b/i.test(norm) || /(do|perform)\s+multiplication\b/i.test(norm) || /multiplication\s+(?:from|of|between)\s+(?:generated\s+)?numbers/i.test(norm) || norm.includes("multiply the previous step output with the next number") || norm.includes("multiply previous step output") || norm.includes("multiply the previous") || norm.includes("do multiplication from generated numbers") || norm.includes("do multiplication") || norm.includes("multiply each generated number with the factorial variable") || norm.includes("multiply each generated number") || norm.includes("multiply each number with the factorial variable") || norm.includes("multiply each number with fact") || norm.includes("multiply each number") || norm.includes("multiply the result with each number") || norm.includes("fact = fact * i") || norm.includes("fact = fact *");
  const hasPrint = /(print|display|show|output)\s*(the\s*)?(final\s*)?(factorial|fact|result|value|output|answer)/i.test(norm) || /(print|display|show|output)\s+.*?\b(answer|result|factorial|fact|value|output)\b/i.test(norm) || norm.includes("print the final answer as output") || norm.includes("print the final answer") || norm.includes("final answer as output") || norm.includes("print the final factorial value") || norm.includes("print final factorial") || norm.includes("print fact") || norm.includes("display the final value") || norm.includes("display final result") || norm.includes("print the result") || norm.includes("output the result") || norm.includes("print the answer") || norm.includes("print final answer");
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
  let feedback;
  let correction;
  let suggestedInput;
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
    feedback = "\u{1F389} Recipe Verified! Kudos! You've sequenced all the steps of the Factorial algorithm in plain English. Proceed to the Ingredients stage!";
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
function validateFactorialIngredients(text) {
  const norm = text.toLowerCase();
  let detectedInputName = "n";
  const step1VarMatch = text.match(/(?:step\s*1[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*(?:=\s*\d+|for\s+input)?)/i);
  if (step1VarMatch && step1VarMatch[1] && !["variable", "input", "get", "accept", "the", "one", "num"].includes(step1VarMatch[1].toLowerCase())) {
    detectedInputName = step1VarMatch[1];
  } else {
    const genericVarMatch = text.match(/\b([a-z_]\w*)\s*=\s*\d+\b/i);
    if (genericVarMatch && genericVarMatch[1] && !["fact", "variable", "sum"].includes(genericVarMatch[1].toLowerCase())) {
      detectedInputName = genericVarMatch[1];
    }
  }
  const hasInputVar = /\b[anxy]\b/i.test(text) || norm.includes("input variable") || norm.includes("get one input variable") || norm.includes("input number") || norm.includes("variable for input") || norm.includes("accept a number") || norm.includes("read input") || norm.includes("get input") || norm.includes("variable a") || norm.includes("variable n") || norm.includes(`variable ${detectedInputName.toLowerCase()}`) || /\bstep\s*1\b/i.test(norm) && (norm.includes("input") || norm.includes("variable") || norm.includes("number") || /\b[a-z]\b/.test(norm));
  let detectedContainerName = "fact";
  const step2VarMatch = text.match(/(?:step\s*2[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*=\s*(\d+))/i) || text.match(/(?:(?:variable\s+)?([a-z_]\w*)\s*=\s*0\b)/i);
  if (step2VarMatch && step2VarMatch[1] && !["variable", "container", "accumulator"].includes(step2VarMatch[1].toLowerCase())) {
    detectedContainerName = step2VarMatch[1];
  }
  const hasZeroFactMistake = /fact\s*=\s*0\b/i.test(text) || new RegExp(`\\b(?:variable\\s+)?${detectedContainerName}\\s*=\\s*0\\b`, "i").test(text) || /\b(?:variable\s+)?[a-z_]\w*\s*=\s*0\b/i.test(text) || /\bstep\s*2[^\n]*?[=:]\s*0\b/i.test(norm) || norm.includes("container variable stores 0") || norm.includes("stores 0") || norm.includes("stores zero") || norm.includes("initialized to 0") || norm.includes("initial value 0") || norm.includes("b=0") || norm.includes("b = 0");
  const hasFactInitial = !hasZeroFactMistake && (/fact\s*=\s*1\b/i.test(text) || new RegExp(`\\b(?:variable\\s+)?${detectedContainerName}\\s*=\\s*1\\b`, "i").test(text) || /\b(?:variable\s+)?[a-z_]\w*\s*=\s*1\b/i.test(text) || norm.includes("container variable it stores the 1") || norm.includes("container variable it stores 1") || norm.includes("container variable stores 1") || norm.includes("container variable") && (norm.includes(" 1") || norm.includes(" one")) || norm.includes("stores 1") || norm.includes("stores the 1") || norm.includes("initialized to 1") || norm.includes("initial value 1") || norm.includes("start fact 1") || norm.includes("accumulator fact = 1") || /\bstep\s*2[^\n]*?(?:=\s*1\b|stores\s*1\b|initial\s*(?:value\s*)?1\b|\bone\b)/i.test(norm));
  const hasLoopConstruct = norm.includes("for loop") || norm.includes("while loop") || norm.includes("use for loop") || norm.includes("use while loop") || /\bloop\s*construct\b/i.test(norm) || /\bstep\s*3\b/i.test(norm) && (norm.includes("loop") || norm.includes("for") || norm.includes("while"));
  const startMatch = norm.match(/(?:start|from|i\s*=)\s*[:=]?\s*([a-z0-9_]+)/i);
  const rawStart = startMatch ? startMatch[1].toLowerCase() : null;
  const stopMatch = norm.match(/(?:stop|end|i\s*<=|i\s*>=)\s*[:=]?\s*([a-z0-9_]+)/i);
  const rawStop = stopMatch ? stopMatch[1].toLowerCase() : null;
  const nextStepMatch = norm.match(/(?:next\s*step|step\s*size)\s*[:=]?\s*([^\n,]+)/i) || norm.match(/(?:^|\n|\s)step\s*[:=]\s*([^\n,]+)/i);
  const rawNextStep = nextStepMatch ? nextStepMatch[1].toLowerCase().trim() : null;
  const hasSameStartStop = Boolean(rawStart && rawStop && rawStart === rawStop);
  const isDescendingCandidate = Boolean(
    rawStart === detectedInputName.toLowerCase() || rawStart === "n" || rawStart !== null && !isNaN(Number(rawStart)) && Number(rawStart) > 1 || rawNextStep !== null && (rawNextStep.includes("--") || rawNextStep.includes("-1") || rawNextStep.includes("dec") || rawNextStep.includes("sub"))
  );
  const isAscendingCandidate = Boolean(
    rawStart === "1" || rawStart === "2" || rawNextStep !== null && (rawNextStep.includes("++") || rawNextStep.includes("+1") || rawNextStep.includes("inc") || rawNextStep.includes("add"))
  );
  let hasLoopDirectionMistake = false;
  let hasWrongStopMistake = false;
  if (rawStart && rawStop && rawNextStep && !hasSameStartStop) {
    if (isDescendingCandidate) {
      if (rawNextStep.includes("++") || rawNextStep.includes("+1") || rawNextStep.includes("inc") || rawNextStep.includes("add")) {
        hasLoopDirectionMistake = true;
      }
      if (rawStop !== "1" && rawStop !== "2") {
        hasWrongStopMistake = true;
      }
    } else if (isAscendingCandidate) {
      if (rawNextStep.includes("--") || rawNextStep.includes("-1") || rawNextStep.includes("dec") || rawNextStep.includes("sub")) {
        hasLoopDirectionMistake = true;
      }
      if (rawStop !== detectedInputName.toLowerCase() && rawStop !== "n" && isNaN(Number(rawStop))) {
        hasWrongStopMistake = true;
      }
    }
  }
  const hasLoopControlMistake = hasSameStartStop || hasLoopDirectionMistake || hasWrongStopMistake;
  const hasValidAscendingControls = Boolean(
    rawStart && (rawStart === "1" || rawStart === "2") && rawStop && (rawStop === detectedInputName.toLowerCase() || rawStop === "n" || !isNaN(Number(rawStop)) && Number(rawStop) > 1) && rawNextStep && (rawNextStep.includes("+") || rawNextStep.includes("++") || rawNextStep.includes("inc") || rawNextStep.includes("add"))
  );
  const hasValidDescendingControls = Boolean(
    rawStart && (rawStart === detectedInputName.toLowerCase() || rawStart === "n" || !isNaN(Number(rawStart)) && Number(rawStart) > 1) && rawStop && (rawStop === "1" || rawStop === "2") && rawNextStep && (rawNextStep.includes("-") || rawNextStep.includes("--") || rawNextStep.includes("dec") || rawNextStep.includes("sub"))
  );
  const hasStandardLoopSyntax = /\bfrom\s*1\s*(?:up\s*)?to\s*(?:n|[a-z_]\w*|\d+)\b/i.test(norm) || /\bfrom\s*(?:n|[a-z_]\w*|\d+)\s*down\s*to\s*1\b/i.test(norm) || /\brange\s*\(\s*1\s*,\s*(?:n|[a-z_]\w*|\d+)/i.test(norm) || /\bi\s*=\s*1\b.*\bi\s*<=\s*(?:n|[a-z_]\w*|\d+)\b.*\b(?:i\+\+|\+\+i|i\s*\+=\s*1)\b/i.test(norm) || /\bi\s*=\s*(?:n|[a-z_]\w*|\d+)\b.*\bi\s*>=\s*1\b.*\b(?:i--|--i|i\s*-=\s*1)\b/i.test(norm);
  const hasLoopControls = !hasLoopControlMistake && (hasValidAscendingControls || hasValidDescendingControls || hasStandardLoopSyntax);
  const hasAdditionMistake = /fact\s*=\s*fact\s*\+\s*i/i.test(text) || new RegExp(`${detectedContainerName}\\s*=\\s*${detectedContainerName}\\s*\\+\\s*i`, "i").test(text) || /fact\s*\+=/i.test(text) || norm.includes("addition operator") || norm.includes("sum =") && !norm.includes("fact =");
  const hasMultiplyOperator = !hasAdditionMistake && (/fact\s*=\s*fact\s*[\*×]\s*i/i.test(text) || new RegExp(`${detectedContainerName}\\s*=\\s*${detectedContainerName}\\s*[\\*\xD7]\\s*i`, "i").test(text) || /fact\s*\*=/i.test(text) || new RegExp(`${detectedContainerName}\\s*\\*=`, "i").test(text) || /fact\s*=\s*fact\s*[\*×]\s*(?:num|number|current)/i.test(text) || norm.includes("fact = fact * i") || norm.includes("fact = fact *") || norm.includes(`${detectedContainerName} = ${detectedContainerName} *`) || norm.includes("multiply container variable with") || norm.includes("multiply container with current number") || norm.includes("multiply each number with fact") || norm.includes("multiplication operator") || /\bstep\s*5\b/i.test(norm) && (norm.includes("multiply") || norm.includes("*") || norm.includes("fact") || norm.includes("product")));
  const hasPrintStatement = norm.includes("print") || norm.includes("display") || norm.includes("show") || norm.includes("output") || norm.includes("console.log") || norm.includes("system.out") || norm.includes("printf") || norm.includes("cout") || norm.includes("echo") || /\bstep\s*6\b/i.test(norm) && (norm.includes("result") || norm.includes("fact") || norm.includes("value") || norm.includes("print") || norm.includes("display") || norm.includes("final"));
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
    { stepNumber: 3, title: "Loop Construct: for / while loop", completed: hasLoopConstruct, current: currentMissingStep === 3 },
    { stepNumber: 4, title: "Loop Controls: start = 1, end = n, next step = +1", completed: hasLoopControls, current: currentMissingStep === 4 },
    { stepNumber: 5, title: `Factorial Update: ${detectedContainerName} = ${detectedContainerName} * i`, completed: hasMultiplyOperator, current: currentMissingStep === 5 },
    { stepNumber: 6, title: `Display Output: print(${detectedContainerName})`, completed: hasPrintStatement, current: currentMissingStep === 6 }
  ];
  let feedback;
  let correction;
  let suggestedInput;
  if (hasZeroFactMistake) {
    feedback = `\u{1F31F} Coach Maara here! Look closely at Step 2 where \`${detectedContainerName} = 0\`. In Factorial, we are calculating a continuous product by multiplying each number into this container. If we start multiplying from 0, what happens? (e.g. 0 \xD7 1 = 0, 0 \xD7 2 = 0)\u2014the entire result is wiped out to zero! What initial number should \`${detectedContainerName}\` start with so our multiplications work correctly?`;
    correction = `Initialize ${detectedContainerName} to 1 instead of 0.`;
    suggestedInput = `Step 2: ${detectedContainerName} = 1 (container variable)`;
  } else if (hasSameStartStop) {
    feedback = `\u{1F31F} Coach Maara here! Look closely at your loop controls: you have set both Start to \`${rawStart}\` and Stop to \`${rawStop}\`. If the loop starts at \`${rawStart}\` and stops immediately at \`${rawStop}\`, it won't be able to step through all the numbers! You selected \`${rawNextStep || "--"}\` to count downward from \`${rawStart}\`\u2014where should our loop stop so that it includes all positive numbers down to the end? (Hint: what is the lowest positive number we multiply by in factorial?)`;
    correction = `Set Stop to 1 when counting down from ${rawStart} (e.g. Start: ${detectedInputName}, Stop: 1, next step: --).`;
    suggestedInput = `Start:${detectedInputName}
Stop:1
next step:--`;
  } else if (hasLoopDirectionMistake) {
    if (isDescendingCandidate) {
      feedback = `\u{1F31F} Coach Maara here! Your loop starts at \`${rawStart}\` and aims down towards \`${rawStop}\`, but your next step is set to increase (\`${rawNextStep}\`). Stepping upward moves away from 1 towards infinity! How should we step downward to count down from \`${rawStart}\` to \`${rawStop}\`? (Hint: -- or -1)`;
      correction = `Change next step to -- (or -1) when counting down from ${rawStart} to ${rawStop}.`;
      suggestedInput = `Start:${rawStart}
Stop:${rawStop}
next step:--`;
    } else {
      feedback = `\u{1F31F} Coach Maara here! Your loop starts at \`${rawStart}\` and aims up towards \`${rawStop}\`, but your next step is set to decrease (\`${rawNextStep}\`). Stepping backward moves away into negative numbers! How should we step forward to count from \`${rawStart}\` up to \`${rawStop}\`? (Hint: +1 or ++)`;
      correction = `Change next step to +1 (or ++) when counting up from ${rawStart} to ${rawStop}.`;
      suggestedInput = `Start:${rawStart}
Stop:${rawStop}
next step:+1`;
    }
  } else if (hasWrongStopMistake) {
    if (isDescendingCandidate) {
      feedback = `\u{1F31F} Coach Maara here! In Factorial, when counting down from \`${rawStart}\`, our multiplication sequence needs to go all the way down to 1. Currently your stop is \`${rawStop}\`. What should the stop value be? (Hint: 1)`;
      correction = `Set Stop to 1 when counting down from ${rawStart}.`;
      suggestedInput = `Start:${rawStart}
Stop:1
next step:--`;
    } else {
      feedback = `\u{1F31F} Coach Maara here! When counting up from 1, our loop needs to reach our input number \`${detectedInputName}\`. Currently your stop is \`${rawStop}\`. What should the stop value be?`;
      correction = `Set Stop to ${detectedInputName} when counting up from 1.`;
      suggestedInput = `Start:1
Stop:${detectedInputName}
next step:+1`;
    }
  } else if (hasAdditionMistake) {
    feedback = `\u{1F31F} Coach Maara here! Factorial requires calculating the sequential product (multiplication), not the sum! How can we update our container using multiplication instead of addition?`;
    correction = `Use multiplication: ${detectedContainerName} = ${detectedContainerName} * i (or ${detectedContainerName} *= i).`;
    suggestedInput = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i`;
  } else if (currentMissingStep === 1) {
    feedback = "\u{1F31F} Coach Maara here! Let's gather our programming ingredients for Factorial! To begin, what is the input variable we need to receive the number from the user? Write Step 1 to declare our input variable.";
    correction = "Step 1: n (input variable)";
    suggestedInput = "Step 1: n (input variable)";
  } else if (currentMissingStep === 2) {
    feedback = "\u{1F31F} Great start! You've got your input variable declared. Next in Step 2, we need a container variable to store our running product. In Factorial, what initial value should this container start with? (Think about what happens if we multiply by 0!)";
    correction = "Step 2: fact = 1 (container variable)";
    suggestedInput = "Step 2: fact = 1 (container variable)";
  } else if (currentMissingStep === 3) {
    feedback = "\u{1F31F} You've got your input variable and container variable set! Now, to repeat the multiplication for each number from 1 up to our input, what programming loop construct should we bring in for Step 3?";
    correction = "Step 3: for loop (or while loop)";
    suggestedInput = "Step 3: for loop";
  } else if (currentMissingStep === 4) {
    feedback = "\u{1F31F} You're doing a fantastic job, and using a loop is spot on! For Step 4, our loop needs steering controls so it knows where to begin, where to end, and how much to step forward. Where does our loop start, where does it end, and what is our next step?";
    correction = `Step 4: start = 1, end = ${detectedInputName}, next step = +1`;
    suggestedInput = `Step 4: start = 1, end = ${detectedInputName}, next step = +1`;
  } else if (currentMissingStep === 5) {
    feedback = "\u{1F31F} Superb! Now that your loop controls are defined, let's look inside the loop body for Step 5. How should we update our container variable with each new number? What arithmetic operation will combine them?";
    correction = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i (operators: * and =)`;
    suggestedInput = `Step 5: ${detectedContainerName} = ${detectedContainerName} * i`;
  } else if (currentMissingStep === 6) {
    feedback = `\u{1F31F} Great job! All the loop steps and our container update are set. Now, what final statement do we need outside the loop to display our completed factorial result? (e.g. print(${detectedContainerName}))`;
    correction = `Step 6: print(${detectedContainerName}) - Display the final factorial output outside the loop.`;
    suggestedInput = `Step 6: print(${detectedContainerName})`;
  } else {
    feedback = `\u{1F389} Ingredients Verified! Brilliant work! You've identified all 6 essential programming ingredients for Factorial:
\u2022 Input variable (${detectedInputName})
\u2022 Container variable initialized to 1 (${detectedContainerName} = 1)
\u2022 Loop construct (for loop or while loop)
\u2022 Loop controls: start = 1, end = ${detectedInputName}, next step = +1
\u2022 Factorial update inside loop (${detectedContainerName} = ${detectedContainerName} * i)
\u2022 Print / Display statement: print(${detectedContainerName})

You're ready to proceed to Taste the Sample stage to assemble your code!`;
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
function validateFactorialSampleCode(text, attemptCount = 1) {
  const norm = text.toLowerCase().trim();
  let detectedInputName = "n";
  const inputVarMatch = text.match(/(?:(?:let|const|var|int)\s+)?([a-z_]\w*)\s*=\s*(?:(?:int|parseInt)\s*\(\s*(?:input|prompt)\s*\(\s*\)\s*\)|[0-9]+|input\(\)|prompt|scanner|cin)/i) || text.match(/(?:step\s*1[^\n]*?(?:variable\s+)?([a-z_]\w*)\s*=\s*(\d+))/i);
  if (inputVarMatch && inputVarMatch[1]) {
    const candidate = inputVarMatch[1].trim();
    if (!["let", "const", "var", "int", "fact", "factorial", "for", "while"].includes(candidate.toLowerCase())) {
      detectedInputName = candidate;
    }
  }

  const loopVarMatch = text.match(/for\s*\(\s*(?:(?:let|var|const|int)\s+)?([a-zA-Z_]\w*)\s*=/i) || text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range/i) || text.match(/while\s*\(?\s*([a-zA-Z_]\w*)\s*(?:<=|<)/i);
  const loopVar = loopVarMatch && loopVarMatch[1] ? loopVarMatch[1] : "i";

  let detectedContainerName = "fact";
  // 1. Check if student updates a container with multiplication: e.g. j = i * j, j = j * i, j *= i
  const productVarMatch = text.match(/([a-z_]\w*)\s*(?:\*=\s*[a-z_]\w*|=\s*[a-z_]\w*\s*\*\s*[a-z_]\w*)/i);
  if (productVarMatch && productVarMatch[1]) {
    const candidate = productVarMatch[1].trim();
    const candLower = candidate.toLowerCase();
    if (candLower !== detectedInputName.toLowerCase() && candLower !== loopVar.toLowerCase() && !["let", "const", "var", "int", "for", "while"].includes(candLower)) {
      detectedContainerName = candidate;
    }
  }

  // 2. Fallback: check variable initialized to 1 or 0
  if (detectedContainerName === "fact") {
    const containerVarRegex = /(?:(?:let|const|var|int)\s+)?([a-z_]\w*)\s*=\s*(?:1|0)\b/gi;
    let cm;
    while ((cm = containerVarRegex.exec(text)) !== null) {
      const candidate = cm[1].trim();
      const candLower = candidate.toLowerCase();
      if (candLower !== detectedInputName.toLowerCase() && candLower !== loopVar.toLowerCase() && !["let", "const", "var", "int", "for", "while"].includes(candLower)) {
        detectedContainerName = candidate;
        break;
      }
    }
  }

  const hasInput = new RegExp(`(?:let|const|var|int\\s+)?(?:${detectedInputName}|n)\\s*=\\s*(?:(?:int|parseInt)\\s*\\(\\s*(?:input|prompt)\\s*\\(\\s*\\)\\s*\\)|[0-9]+|input\\(\\)|prompt|scanner|cin)`, "i").test(text) || new RegExp(`\\b(?:let|const|var|int)?\\s*(?:${detectedInputName}|n)\\s*=`, "i").test(text) || /\b(?:input\(\)|scanner|cin|prompt)\b/i.test(norm);
  const hasAccumulatorOne = new RegExp(`(?:let|const|var|int\\s+)?(?:fact|factorial|prod|product|ans|${detectedContainerName})\\s*=\\s*1\\b`, "i").test(text);
  const hasAccumulatorZero = new RegExp(`(?:let|const|var|int\\s+)?(?:fact|factorial|prod|product|ans|${detectedContainerName})\\s*=\\s*0\\b`, "i").test(text);
  const hasAccumulator = hasAccumulatorOne && !hasAccumulatorZero;
  const isLoopQuery = /syntax|loop\s*(?:theriyala|example|syntax|help)|(?:did\s+not|don't|dont|not)\s+know\s+(?:how\s+to\s+write\s+)?loop|how\s+to\s+write\s+(?:for\s+)?loop|how\s+to\s+(?:do|write)\s+loop/i.test(text);
  if (isLoopQuery) {
    const loopExamples = `

Here is how you can write the loop using your variable \`${detectedInputName}\`:

\u{1F40D} **Python:**
\`\`\`python
for i in range(1, ${detectedInputName} + 1):
\`\`\`

\u{1F4BB} **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= ${detectedInputName}; i++) {
}
\`\`\`

\u2615 **Java / C / C++:**
\`\`\`java
for (int i = 1; i <= ${detectedInputName}; i++) {
}
\`\`\``;
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
        feedback: `\u{1F31F} Coach Maara here! Happy to help with the loop! It is completely normal for loop syntax to feel tricky at first.

Since you have already set up your input \`${detectedInputName}\` and accumulator \`${detectedContainerName} = 1\`, ${loopExamples}

\u{1F449} **Next Step:** Try adding the loop to your code! You can also click **Insert Prototype Example** below.`,
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
      feedback: `\u{1F31F} Coach Maara here! Happy to help with the loop syntax! ${loopExamples}

Let's start by assembling your code prototype: declare your input \`${detectedInputName}\` and initialize \`${detectedContainerName} = 1\`!`,
      correction: `Use standard for loop syntax: for (let i = 1; i <= ${detectedInputName}; i++)`,
      suggestedInput: `for (let i = 1; i <= ${detectedInputName}; i++)`
    };
  }
  const validJsJavaLoop = new RegExp(`for\\s*\\(\\s*(?:(?:let|var|const|int)\\s+)?[a-zA-Z_]\\w*\\s*=\\s*(?:0|1)\\s*;\\s*[a-zA-Z_]\\w*\\s*(?:<=|<)\\s*(?:n|${detectedInputName}|[0-9]+|\\w+)\\s*;\\s*(?:[a-zA-Z_]\\w*\\+\\+|\\+\\+[a-zA-Z_]\\w*|[a-zA-Z_]\\w*\\s*\\+=\\s*1|[a-zA-Z_]\\w*\\s*=\\s*[a-zA-Z_]\\w*\\s*\\+\\s*1)\\s*\\)`, "i").test(text);
  const validPythonRange = new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*(?:0\\s*,\\s*)?(?:1\\s*,\\s*)?(?:n|${detectedInputName}|[0-9]+)\\s*(?:\\+\\s*1)?\\s*\\)`, "i").test(text);
  const validWhileLoop = new RegExp(`while\\s*\\(?\\s*[a-zA-Z_]\\w*\\s*(?:<=|<)\\s*(?:n|${detectedInputName}|[0-9]+)\\s*\\)?`, "i").test(text);
  const hasColonInFor = /for\s*\([^)]*:[^)]*\)/i.test(text);
  const hasIncrementInCondition = /for\s*\([^;:]*[:;]\s*(?:[a-zA-Z_]\w*\+\+|\+\+[a-zA-Z_]\w*|[a-zA-Z_]\w*\s*\+=\s*1)\s*[:;]/i.test(text);
  const hasInvertedCondition = /for\s*\([^)]*(?:>=|>)\s*(?:5|n|[0-9]+)[^)]*\)|while\s*\(?[^)]*(?:>=|>)\s*(?:5|n|[0-9]+)\)?/i.test(text);
  const pythonRangeWithoutPlusOne = new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*(?:0\\s*,\\s*)?1\\s*,\\s*(?:n|${detectedInputName})\\s*\\)`, "i").test(text);
  let loopErrorFeedback = "";
  let loopErrorCorrection = "";
  let loopSuggested = `for (let i = 1; i <= ${detectedInputName}; i++)`;
  if (hasColonInFor && hasIncrementInCondition) {
    loopErrorFeedback = `\u26A0\uFE0F Coach Maara note: In Step 3, your \`for\` loop syntax needs semicolons (\`;\`) between each part, with condition (\`i <= ${detectedInputName}\`) second and increment (\`i++\`) third.

Structure:
\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Fix loop syntax: for (let i = 1; i <= ${detectedInputName}; i++)`;
  } else if (hasColonInFor) {
    loopErrorFeedback = `\u26A0\uFE0F Coach Maara note: Separate the 3 parts of your \`for\` loop with semicolons (\`;\`), not colons (\`:\`).

Structure:
\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Use semicolons in for loop: for (let i = 1; i <= ${detectedInputName}; i++)`;
  } else if (hasIncrementInCondition) {
    loopErrorFeedback = `\u26A0\uFE0F Coach Maara note: Place the condition (\`i <= ${detectedInputName}\`) second and the increment (\`i++\`) third:
\`for (let i = 1; i <= ${detectedInputName}; i++)\``;
    loopErrorCorrection = `Order: for (initialization; condition; increment)`;
  } else if (hasInvertedCondition) {
    loopErrorFeedback = `\u26A0\uFE0F Coach Maara note: Change loop condition to \`i <= ${detectedInputName}\` so it counts upwards from 1 to ${detectedInputName}.`;
    loopErrorCorrection = `Use i <= ${detectedInputName} in condition.`;
  } else if (pythonRangeWithoutPlusOne && !validPythonRange) {
    loopErrorFeedback = `\u26A0\uFE0F Coach Maara note: In Python, \`range(1, ${detectedInputName})\` stops before \`${detectedInputName}\`. To include \`${detectedInputName}\`, use \`range(1, ${detectedInputName} + 1)\`:
\`for i in range(1, ${detectedInputName} + 1):\``;
    loopErrorCorrection = `Use range(1, ${detectedInputName} + 1) to include ${detectedInputName}.`;
  }
  const hasLoop = (validJsJavaLoop || validPythonRange || validWhileLoop) && !hasColonInFor && !hasIncrementInCondition && !hasInvertedCondition;
  const validProductUpdateRegex = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\*=\\s*${loopVar}|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\*\\s*${loopVar}|=\\s*${loopVar}\\s*\\*\\s*(?:fact|factorial|prod|product|${detectedContainerName}))\\b`, "i");
  const hasValidProductUpdate = validProductUpdateRegex.test(text);
  const hasFactAddI = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\+=\\s*${loopVar}|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\+\\s*${loopVar})\\b`, "i").test(text);
  const hasFactMultiplyN = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*(?:\\*=\\s*(?:n|${detectedInputName})|=\\s*(?:fact|factorial|prod|product|${detectedContainerName})\\s*\\*\\s*(?:n|${detectedInputName}))\\b`, "i").test(text);
  const hasFactOverwriteNIntoI = new RegExp(`(?:fact|factorial|prod|product|${detectedContainerName})\\s*=\\s*(?:(?:n|${detectedInputName})\\s*\\*\\s*[a-zA-Z_]\\w*|[a-zA-Z_]\\w*\\s*\\*\\s*(?:n|${detectedInputName}))\\b`, "i").test(text);
  let productErrorFeedback = "";
  let productErrorCorrection = "";
  let productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  if (hasFactAddI) {
    productErrorFeedback = `\u26A0\uFE0F Coach Maara note: In Step 4, you used addition (\`+\`) instead of multiplication (\`*\`). Factorial calculates the running product of all numbers!

Update your loop body to multiply:
\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Change + to * (e.g. ${detectedContainerName} = ${detectedContainerName} * ${loopVar}).`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  } else if (hasFactMultiplyN) {
    productErrorFeedback = `\u26A0\uFE0F Coach Maara note: In Step 4, you multiplied by \`${detectedInputName}\` (\`${detectedContainerName} = ${detectedContainerName} * ${detectedInputName}\`). \`${detectedInputName}\` is the constant boundary! To multiply each progressive number from the loop, multiply by \`${loopVar}\`:
\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Multiply by loop variable ${loopVar}: ${detectedContainerName} = ${detectedContainerName} * ${loopVar}.`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  } else if (hasFactOverwriteNIntoI) {
    productErrorFeedback = `\u26A0\uFE0F Coach Maara note: In Step 4, you wrote \`${detectedContainerName} = ${detectedInputName} * ${loopVar}\`. This overwrites \`${detectedContainerName}\` on each cycle instead of building upon the running product.

Use:
\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` (or \`${detectedContainerName} *= ${loopVar}\`).`;
    productErrorCorrection = `Use ${detectedContainerName} = ${detectedContainerName} * ${loopVar}.`;
    productSuggested = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
  }
  const hasProductUpdate = hasValidProductUpdate && !hasFactAddI && !hasFactMultiplyN && !hasFactOverwriteNIntoI;
  const containerWords = ["fact", "factorial", "prod", "product", "ans"];
  if (detectedContainerName && !containerWords.includes(detectedContainerName.toLowerCase())) {
    containerWords.push(detectedContainerName.toLowerCase());
  }
  const containerPattern = `(?:${containerWords.join("|")})`;
  const hasContainerInPrint = new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${containerPattern}\\b[^)]*\\)`, "i").test(text) || new RegExp(`cout\\s*<<[^;]*\\b${containerPattern}\\b`, "i").test(text) || new RegExp(`printf\\s*\\([^)]*\\b${containerPattern}\\b[^)]*\\)`, "i").test(text);
  const inputWords = ["n"];
  if (detectedInputName && !inputWords.includes(detectedInputName.toLowerCase())) {
    inputWords.push(detectedInputName.toLowerCase());
  }
  const inputPattern = `(?:${inputWords.join("|")})`;
  const hasPrintedInputInstead = !hasContainerInPrint && (new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${inputPattern}\\b[^)]*\\)`, "i").test(text) || new RegExp(`cout\\s*<<[^;]*\\b${inputPattern}\\b`, "i").test(text) || new RegExp(`printf\\s*\\([^)]*\\b${inputPattern}\\b[^)]*\\)`, "i").test(text));
  const hasPrintedLoopVarInstead = !hasContainerInPrint && (new RegExp(`(?:print|console\\.log|System\\.out\\.print(?:ln)?)\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, "i").test(text) || new RegExp(`cout\\s*<<[^;]*\\b${loopVar}\\b`, "i").test(text) || new RegExp(`printf\\s*\\([^)]*\\b${loopVar}\\b[^)]*\\)`, "i").test(text));
  const hasAnyOtherPrint = !hasContainerInPrint && (/print\s*\(/i.test(text) || /console\.log\s*\(/i.test(text) || /System\.out\.print(?:ln)?\s*\(/i.test(text) || /cout\s*<</i.test(text) || /printf\s*\(/i.test(text));
  const hasPrint = hasContainerInPrint;
  const sampleCodeStepProgress = [
    { stepNumber: 1, title: `Input Variable (${detectedInputName})`, completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: `Accumulator (${detectedContainerName} = 1)`, completed: hasAccumulator, current: hasInput && !hasAccumulator },
    { stepNumber: 3, title: `Loop Construct (1 to ${detectedInputName})`, completed: hasLoop, current: hasInput && hasAccumulator && !hasLoop },
    { stepNumber: 4, title: `Accumulate Product (${detectedContainerName} *= ${loopVar})`, completed: hasProductUpdate, current: hasInput && hasAccumulator && hasLoop && !hasProductUpdate },
    { stepNumber: 5, title: `Display Result (print(${detectedContainerName}))`, completed: hasPrint, current: hasInput && hasAccumulator && hasLoop && hasProductUpdate && !hasPrint }
  ];
  const completedCount = [hasInput, hasAccumulator, hasLoop, hasProductUpdate, hasPrint].filter(Boolean).length;
  const allVerified = hasInput && hasAccumulator && hasLoop && hasProductUpdate && hasPrint;
  let feedback = "";
  let correction = "";
  let suggestedInput = "";
  if (allVerified) {
    feedback = `\u{1F389} Taste the Sample Verified! Fantastic work! Your prototype code correctly brings together all 5 steps of the Factorial algorithm:
\u2022 Input variable \`${detectedInputName}\`
\u2022 Initial accumulator \`${detectedContainerName} = 1\`
\u2022 Loop iterating from 1 to \`${detectedInputName}\`
\u2022 Product accumulation (\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\`)
\u2022 Output printing the final total (\`print(${detectedContainerName})\`)

You are fully ready to code and test!`;
    correction = "You're ready to code!";
    suggestedInput = "";
  } else if (!hasInput && !hasAccumulator && !hasLoop && !hasProductUpdate && !hasPrint) {
    feedback = `\u{1F31F} Coach Maara here! Welcome to Stage 4: Taste the Sample! Let's assemble our verified ingredients into a working code prototype step by step.

\u{1F449} **Step 1 & 2:** Start by declaring your input variable \`${detectedInputName}\` and initializing your accumulator \`${detectedContainerName} = 1\`.`;
    correction = `Declare input ${detectedInputName} and accumulator ${detectedContainerName} = 1.`;
    suggestedInput = `${detectedInputName} = int(input())
${detectedContainerName} = 1`;
  } else if (!hasInput || !hasAccumulator) {
    if (hasAccumulatorZero) {
      feedback = `\u26A0\uFE0F Coach Maara note: In Step 2, you initialized \`${detectedContainerName} = 0\`. Multiplying anything by 0 keeps the product at 0 forever! Change it to start at 1:
\`${detectedContainerName} = 1\``;
      correction = `Initialize ${detectedContainerName} = 1 instead of 0.`;
      suggestedInput = `${detectedContainerName} = 1`;
    } else {
      feedback = `\u{1F31F} Great start! Make sure you have both your input variable \`${detectedInputName}\` and your accumulator \`${detectedContainerName} = 1\` declared before starting the loop.

\u{1F449} Next: Declare \`${detectedInputName}\` and initialize \`${detectedContainerName} = 1\`.`;
      correction = `Initialize input ${detectedInputName} and ${detectedContainerName} = 1.`;
      suggestedInput = !hasInput ? `${detectedInputName} = int(input())` : `${detectedContainerName} = 1`;
    }
  } else if (!hasLoop) {
    if (loopErrorFeedback) {
      feedback = loopErrorFeedback;
      correction = loopErrorCorrection;
      suggestedInput = loopSuggested;
    } else if (attemptCount >= 3) {
      feedback = `\u{1F31F} Coach Maara here! Let's get your factorial loop connected right away! Place this exact loop after initializing \`${detectedContainerName} = 1\`:

\`\`\`javascript
for (let i = 1; i <= ${detectedInputName}; i++) {
  ${detectedContainerName} = ${detectedContainerName} * i;
}
\`\`\`

\u{1F449} Add the loop and product step!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    } else if (attemptCount === 2) {
      feedback = `\u{1F31F} Coach Maara checking back! You have \`${detectedInputName}\` and \`${detectedContainerName} = 1\` ready. Now we need our counting loop to repeat from 1 up to \`${detectedInputName}\`.

\u2022 **Start:** \`i = 1\`
\u2022 **Stop Condition:** \`i <= ${detectedInputName}\`
\u2022 **Next Step:** \`i++\`

\u{1F449} Try writing the loop statement now!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    } else {
      feedback = `\u{1F31F} Superb progress declaring \`${detectedInputName}\` and \`${detectedContainerName} = 1\`!

\u{1F449} **Step 3:** Now write your \`for\` loop to repeat from 1 to \`${detectedInputName}\`.

Here is how you can write the loop using your variable \`${detectedInputName}\`:

\u{1F40D} **Python:**
\`\`\`python
for i in range(1, ${detectedInputName} + 1):
\`\`\`

\u{1F4BB} **JavaScript:**
\`\`\`javascript
for (let i = 1; i <= ${detectedInputName}; i++) {
}
\`\`\`

\u2615 **Java / C / C++:**
\`\`\`java
for (int i = 1; i <= ${detectedInputName}; i++) {
}
\`\`\`

Try adding the loop into your code!`;
      correction = `Step 3: Add your for loop iterating from 1 to ${detectedInputName}.`;
      suggestedInput = `for (let i = 1; i <= ${detectedInputName}; i++)`;
    }
  } else if (!hasProductUpdate) {
    if (productErrorFeedback) {
      feedback = productErrorFeedback;
      correction = productErrorCorrection;
      suggestedInput = productSuggested;
    } else if (attemptCount >= 2) {
      feedback = `\u{1F31F} Coach Maara checking in! Inside the loop body, multiply the current number into your container:
\`${detectedContainerName} = ${detectedContainerName} * ${loopVar};\` (or \`${detectedContainerName} *= ${loopVar};\`)

This multiplies the previous product by the loop number on each iteration!`;
      correction = `Step 4: Add ${detectedContainerName} = ${detectedContainerName} * ${loopVar} inside the loop.`;
      suggestedInput = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
    } else {
      feedback = `\u{1F31F} Awesome! Your loop is set up cleanly.

\u{1F449} **Step 4:** Inside the loop body, multiply each incrementing number \`${loopVar}\` into your container \`${detectedContainerName}\` (\`${detectedContainerName} = ${detectedContainerName} * ${loopVar}\` or \`${detectedContainerName} *= ${loopVar}\`).`;
      correction = `Step 4: Add ${detectedContainerName} = ${detectedContainerName} * ${loopVar} inside the loop.`;
      suggestedInput = `    ${detectedContainerName} = ${detectedContainerName} * ${loopVar};`;
    }
  } else if (!hasPrint) {
    if (hasPrintedInputInstead) {
      feedback = `\u26A0\uFE0F Coach Maara note: Take a close look at your last line where you wrote \`print(${detectedInputName})\`!

Variable \`${detectedInputName}\` holds your starting input number (like 5), whereas your accumulated factorial product is safely stored in variable \`${detectedContainerName}\`!

If you print \`${detectedInputName}\`, you will only output the input number instead of the final factorial calculation.

\u{1F449} **Update your print statement to output your container:**
\`print(${detectedContainerName})\` (or \`console.log(${detectedContainerName})\`)`;
      correction = `Change print(${detectedInputName}) to print(${detectedContainerName}) to output the final factorial result.`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (hasPrintedLoopVarInstead) {
      feedback = `\u26A0\uFE0F Coach Maara note: In Step 5, you printed the loop variable \`${loopVar}\` (\`print(${loopVar})\`). \`${loopVar}\` is only the counter variable! Your accumulated product is in \`${detectedContainerName}\`.

\u{1F449} **Update your print statement to output your container:**
\`print(${detectedContainerName})\``;
      correction = `Change print(${loopVar}) to print(${detectedContainerName}) to output the final result.`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (hasAnyOtherPrint) {
      feedback = `\u26A0\uFE0F Coach Maara note: In Step 5, you added an output statement, but make sure to print your accumulator variable \`${detectedContainerName}\` to display the final factorial product:
\`print(${detectedContainerName})\``;
      correction = `Print accumulator: print(${detectedContainerName}).`;
      suggestedInput = `print(${detectedContainerName})`;
    } else if (attemptCount >= 2) {
      feedback = `\u{1F31F} Coach Maara here! Everything is computed! Add the output line after the loop to display the final factorial:
\`print(${detectedContainerName})\` (or \`console.log(${detectedContainerName});\`)`;
      correction = `Step 5: Add print(${detectedContainerName}) to display the final result.`;
      suggestedInput = `print(${detectedContainerName});`;
    } else {
      feedback = `\u{1F31F} Almost at the finish line! Your calculation logic is completely in place.

\u{1F449} **Step 5:** Outside the loop, add your output statement (\`print(${detectedContainerName})\`, \`console.log(${detectedContainerName})\`, etc.) to display the final calculated factorial.`;
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
export {
  checkFactorialArithmetic,
  checkFactorialProductExpression,
  checkFactorialSequence,
  extractFactorialN,
  getFactorialFormula,
  getFactorialStepByStepTrace,
  getFactorialValue,
  validateFactorialIngredients,
  validateFactorialLogic,
  validateFactorialRecipe,
  validateFactorialSampleCode
};

