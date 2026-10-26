function validatePrimeRangeLogic(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  if (/^(what\s+i\s+do|what\s+do\s+i\s+do|what\s+next|how\s+to|what|how|where|tell me|explain|help)/i.test(norm) && (norm.includes("range") || norm.includes("prime") || norm.includes("what should we do"))) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! What does 'Prime numbers in a range' mean? For example, between 10 and 20, what are all the prime numbers, and how do we check each one?",
      correction: "Think about checking every number in the range from start to end by counting its divisors.",
      suggestedInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
      matchedFirebaseInput: "what should we do to find prime numbers in a range"
    };
  }
  if (norm.includes("dont know") || norm.includes("don't know") || norm.includes("puriyala") || norm.includes("theriyala") || norm.includes("no idea") || norm === "i don t know") {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! A range gives a starting number and an ending number (e.g., 10 to 20). We check each number one by one.\nFor each number, count how many numbers from 1 to that number divide it with remainder 0.\n\u2022 10: Divisors are 1, 2, 5, 10 -> Count = 4 (Not prime)\n\u2022 11: Divisors are 1, 11 -> Count = 2 (Prime!)\n\u2022 12: Divisors are 1, 2, 3, 4, 6, 12 -> Count = 6 (Not prime)\n\u2022 13: Divisors are 1, 13 -> Count = 2 (Prime!)\nIf the count of divisors is exactly 2, it is a Prime Number!",
      correction: "Iterate through the range and check if divisor count is exactly 2.",
      suggestedInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
      matchedFirebaseInput: "I don't know / puriyala"
    };
  }
  if (norm.includes("why count") || norm.includes("why 2") || norm.includes("why must") || norm.includes("divisor count 2")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: true,
      feedback: "\u{1F31F} Coach Maara math breakdown: By definition, a prime number has exactly 2 distinct divisors: 1 and itself.\n\u2022 For 7: Divisors are 1 and 7 -> Total divisors = 2 (Prime!)\n\u2022 For 6: Divisors are 1, 2, 3, 6 -> Total divisors = 4 (Not Prime)\n\u2022 For 1: Divisor is only 1 -> Total divisors = 1 (Not Prime).",
      correction: "A prime number has exactly 2 divisors (1 and itself).",
      suggestedInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
      matchedFirebaseInput: "why must the count of divisors be exactly 2"
    };
  }
  if (norm.includes("1 is prime") || norm.includes("starts from 1 is 1 prime") || norm.includes("is 1 a prime") || norm.includes("include 1 as prime")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: true,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara math rule: Number 1 has only 1 divisor (itself). Since its divisor count is 1 (not 2), 1 is NOT a prime number!",
      correction: "1 is not prime because it has only 1 divisor.",
      suggestedInput: "count divisors from 1 to n and check if count == 2",
      matchedFirebaseInput: "if range starts from 1, is 1 prime because count is small"
    };
  }
  if (norm.includes("keep adding") || norm.includes("total count of all") || norm.includes("add count together")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: true,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara logic alert: Each number in the range is an independent test! When you move to the next number, you must reset divisor count back to 0.",
      correction: "Reset count to 0 for every number in the range.",
      suggestedInput: "for each number in range, reset count = 0, count divisors from 1 to num, if count == 2 it is prime",
      matchedFirebaseInput: "should we keep adding divisor counts together"
    };
  }
  let declaredStart = null;
  let declaredEnd = null;
  const rangeRegex = /(?:for\s+|from\s+|between\s+|range\s+)?(\d{1,4})\s*(?:to|-|and)\s*(\d{1,4})(?:\s*range)?/i;
  const rangeMatch = norm.match(rangeRegex);
  if (rangeMatch) {
    const s = parseInt(rangeMatch[1], 10);
    const e = parseInt(rangeMatch[2], 10);
    if (!isNaN(s) && !isNaN(e) && e >= s) {
      declaredStart = s;
      declaredEnd = e;
    }
  }
  const testedNumbersSet = /* @__PURE__ */ new Set();
  const testedNumberMatches = norm.matchAll(/\b(\d{1,4})\s*(?:had|has|is|have|was|divisors|only)/gi);
  for (const m of testedNumberMatches) {
    const num = parseInt(m[1], 10);
    if (num !== declaredStart && num !== declaredEnd && num > 2) {
      testedNumbersSet.add(num);
    }
  }
  const commonCandidates = [11, 12, 13, 14, 15, 16, 17, 18, 19, 23, 29, 31, 37];
  for (const c of commonCandidates) {
    if (norm.includes(`${c} had`) || norm.includes(`${c} has`) || norm.includes(`${c} is`) || norm.includes(`for ${c}`) || norm.includes(` ${c} `) && (norm.includes("divisor") || norm.includes("prime"))) {
      testedNumbersSet.add(c);
    }
  }
  const testedNumbers = Array.from(testedNumbersSet);
  const helperIsPrime = (n) => {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  };
  if (declaredStart !== null && declaredEnd !== null && testedNumbers.length > 0) {
    const outOfRange = testedNumbers.filter((n) => n < declaredStart || n > declaredEnd);
    if (outOfRange.length > 0) {
      const primesInRange = [];
      for (let i = declaredStart; i <= declaredEnd; i++) {
        if (helperIsPrime(i)) primesInRange.push(i);
      }
      return {
        isFullyVerified: false,
        hasFatalMisconception: true,
        isTheoryExplanation: false,
        isMathematicalExplanation: true,
        feedback: `\u26A0\uFE0F Range Boundary Inconsistency: You stated the range is **${declaredStart} to ${declaredEnd}**, but you tested **${outOfRange.join(", ")}**, which ${outOfRange.length > 1 ? "are" : "is"} outside this range (${outOfRange.join(", ")} > ${declaredEnd})!

\u2022 For your specified range **${declaredStart} to ${declaredEnd}**: The only prime numbers within this boundary are **${primesInRange.length > 0 ? primesInRange.join(", ") : "none"}**.
\u2022 If you intended to check up to ${Math.max(...testedNumbers)} (e.g. 10 to 20), please update your range heading to **${declaredStart} to ${Math.max(declaredEnd, ...testedNumbers)} range** to keep your logic consistent!`,
        correction: `Adjust your range statement to match the tested numbers, or test only numbers within [${declaredStart}, ${declaredEnd}].`,
        suggestedInput: `for ${declaredStart} to ${Math.max(declaredEnd, ...testedNumbers)} range
11 had only two divisors 1,11 it is a prime number
13 had only two divisors 1,13 it is prime number
17 had only two divisors 1,17 it is a prime number
19 had only two divisors 1,19 it is a prime number`,
        matchedFirebaseInput: "range boundary mismatch"
      };
    }
  }
  const hasGeneralizedRangeStatement = (norm.includes("for each number") || norm.includes("every number") || norm.includes("all numbers") || norm.includes("each number in the range") || norm.includes("for every number") || norm.includes("from start to end") && norm.includes("each")) && (norm.includes("count") || norm.includes("divisor") || norm.includes("divide") || norm.includes("remainder 0") || norm.includes("rem 0")) && (norm.includes("2") || norm.includes("two") || norm.includes("1 and itself"));
  const hasTwoDivisorsOrPrimeVerdict = norm.includes("2") || norm.includes("two") || norm.includes("1 and itself") || norm.includes("prime");
  if (declaredStart !== null && declaredEnd !== null && !hasGeneralizedRangeStatement) {
    const primesInDeclaredRange = [];
    for (let i = declaredStart; i <= declaredEnd; i++) {
      if (helperIsPrime(i)) primesInDeclaredRange.push(i);
    }
    const testedPrimes = testedNumbers.filter((n) => helperIsPrime(n) && n >= declaredStart && n <= declaredEnd);
    const missingPrimes = primesInDeclaredRange.filter((p) => !testedNumbersSet.has(p));
    if (missingPrimes.length > 0) {
      return {
        isFullyVerified: false,
        hasFatalMisconception: false,
        isTheoryExplanation: true,
        isMathematicalExplanation: true,
        feedback: `\u{1F31F} Good work identifying prime numbers! For your stated range **${declaredStart} to ${declaredEnd}**, you tested: **${testedPrimes.length > 0 ? testedPrimes.join(", ") : "some numbers"}**.

\u26A0\uFE0F However, there ${missingPrimes.length > 1 ? "are" : "is"} missing prime number${missingPrimes.length > 1 ? "s" : ""} in this range: **${missingPrimes.join(", ")}**!

\u{1F449} To complete the Logic stage for range ${declaredStart} to ${declaredEnd}:
1) Also verify **${missingPrimes.join(", ")}** (has only 2 divisors: 1 and ${missingPrimes.join(", ")}), OR
2) State the general rule: "For each number in the range from start to end, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2, it is a prime number."`,
        correction: `Include missing prime(s): ${missingPrimes.join(", ")} or state the general range logic rule.`,
        suggestedInput: `for ${declaredStart} to ${declaredEnd} range
${primesInDeclaredRange.map((p) => `${p} had only two divisors 1,${p} it is a prime number`).join("\n")}`,
        matchedFirebaseInput: "incomplete primes in range"
      };
    } else if (primesInDeclaredRange.length > 0 && missingPrimes.length === 0 && hasTwoDivisorsOrPrimeVerdict) {
      return {
        isFullyVerified: true,
        hasFatalMisconception: false,
        isTheoryExplanation: true,
        isMathematicalExplanation: true,
        isMathematicalProof: true,
        feedback: `\u{1F31F} Spot on! You found ALL the prime numbers in range ${declaredStart} to ${declaredEnd} (${primesInDeclaredRange.join(", ")}) because each has exactly 2 unique divisors (1 and itself). You have proven the mathematical logic! Proceed to Recipe.`,
        matchedFirebaseInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
        correction: "Proceed to Recipe stage.",
        suggestedInput: "for each number in the range, count divisors from 1 to num, if count == 2 it is prime"
      };
    }
  }
  if (hasGeneralizedRangeStatement) {
    return {
      isFullyVerified: true,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      isMathematicalProof: true,
      feedback: "Fantastic! That is the exact mathematical logic: Iterate through every number in the range, count its divisors from 1 to that number, and if the count is exactly 2, it is a Prime Number. Proceed to Recipe!",
      matchedFirebaseInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
      correction: "Proceed to the Recipe stage to sequence the algorithmic steps.",
      suggestedInput: "for each number in the range, count divisors from 1 to num, if count == 2 it is prime"
    };
  }
  return {
    isFullyVerified: false,
    hasFatalMisconception: false,
    isTheoryExplanation: false,
    isMathematicalExplanation: false,
    feedback: "\u{1F31F} Coach Maara: Good thought! Be specific: For each number in the range [start, end], how do we test if it has exactly 2 divisors (from 1 to that number)?",
    correction: "Iterate through the range and check if divisor count is exactly 2.",
    suggestedInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime"
  };
}
function validatePrimeRangeRecipe(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  const rawText = (text || "").toLowerCase();
  const rawLines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const cleanLines = rawLines.map((l) => l.replace(/^step\s*\d+[\s.:-]*/i, "").trim().toLowerCase());
  const isStuckQuery = norm.includes("what i do here") || norm.includes("what should i do") || norm.includes("what to do") || norm.includes("i did not know") || norm.includes("i dont know") || norm.includes("dont know") || norm.includes("not know") || norm.includes("theriyala") || norm.includes("puriyala") || norm.includes("stuck") || norm.includes("please help") || norm.includes("help me");
  const hasStep1 = cleanLines.some((l) => {
    const isStartEnd = l.includes("start") && l.includes("end") || l.includes("starting") && l.includes("ending");
    const isGet = l.includes("get") || l.includes("take") || l.includes("input") || l.includes("read") || l.includes("receive");
    const isRangeOnly = l.includes("range limits") || l.includes("boundaries") && (l.includes("start") || l.includes("end"));
    const isNotLoop = !l.includes("each number") && !l.includes("every number") && !l.includes("pick each") && !l.includes("repeat") && !l.includes("from 1");
    return (isStartEnd || isGet && (l.includes("number") || l.includes("range")) || isRangeOnly) && isNotLoop;
  });
  const hasStep2 = cleanLines.some((l) => {
    const isEach = l.includes("each number") || l.includes("every number") || l.includes("pick each") || l.includes("take each") || l.includes("for each") || l.includes("one by one");
    const isRangeLoop = l.includes("from start") && l.includes("end") || l.includes("start") && l.includes("up to end") || l.includes("iterate through") || l.includes("loop through");
    const isNotStep1Decl = !l.includes("get starting number and ending number") && !l.includes("two variables") && !l.includes("get start");
    const isNotRepeat = !l.includes("repeat this process") && !l.includes("repeat for next");
    return (isEach || isRangeLoop) && isNotStep1Decl && isNotRepeat;
  });
  const hasResetCount = cleanLines.some((l) => {
    const isCount = l.includes("count") || l.includes("counter");
    const isZero = l.includes("0") || l.includes("zero") || l.includes("reset") || l.includes("start with 0") || l.includes("set to 0") || l.includes("initialize");
    const isNotDecision = !l.includes("count == 2") && !l.includes("count is 2") && !l.includes("count is two") && !l.includes("count = 2") && !l.includes("count ==2") && !l.includes("count 2") && !l.includes("divisor count is 2");
    const isNotIncrement = !l.includes("count++") && !l.includes("count + 1") && !l.includes("count increases") && !l.includes("increase count") && !l.includes("increment");
    return isCount && isZero && isNotDecision && isNotIncrement;
  });
  const hasTestDivisors = cleanLines.some((l) => {
    const isTestRange = l.includes("1 to") || l.includes("1 up to") || l.includes("from 1");
    const isDivide = l.includes("divide") || l.includes("divisible") || l.includes("check remainder") || l.includes("divides") || l.includes("remainder is 0") || l.includes("remainder 0");
    const isTestWord = l.includes("test all") || l.includes("test") && (l.includes("divisor") || l.includes("factor"));
    const isNotReset = !l.includes("reset divisor count") && !l.includes("count to 0") && !l.includes("count = 0");
    const isNotDecision = !l.includes("display as prime") && !l.includes("count is 2") && !l.includes("count == 2");
    return (isTestRange || isDivide || isTestWord) && isNotReset && isNotDecision;
  });
  const hasCheckCount2 = cleanLines.some((l) => {
    const isTwo = l.includes("2") || l.includes("two") || l.includes("only two");
    const isPrime = l.includes("prime") || l.includes("display") || l.includes("print") || l.includes("show") || l.includes("output") || l.includes("record");
    const isCountMatch = l.includes("count == 2") || l.includes("count is 2") || l.includes("count = 2") || l.includes("count is two") || l.includes("two divisors");
    return isTwo && isPrime || isCountMatch && (isPrime || l.includes("as prime"));
  });
  const hasRepeatStep = cleanLines.some((l) => {
    const isRepeat = l.includes("repeat") || l.includes("next number") || l.includes("continue") || l.includes("move to next");
    const isUntilEnd = l.includes("until end") || l.includes("until ending") || l.includes("till end") || l.includes("till ending") || l.includes("all remaining") || l.includes("all numbers until");
    return isRepeat || isUntilEnd;
  });
  const steps = [
    { stepNumber: 1, title: "Get starting and ending numbers", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "Pick each number in range", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "Reset divisor count = 0", completed: hasResetCount, current: hasStep1 && hasStep2 && !hasResetCount },
    { stepNumber: 4, title: "Test divisors from 1 to number", completed: hasTestDivisors, current: hasStep1 && hasStep2 && hasResetCount && !hasTestDivisors },
    { stepNumber: 5, title: "If divisor count is 2, display as prime", completed: hasCheckCount2, current: hasStep1 && hasStep2 && hasResetCount && hasTestDivisors && !hasCheckCount2 },
    { stepNumber: 6, title: "Repeat for next numbers until end number", completed: hasRepeatStep, current: hasStep1 && hasStep2 && hasResetCount && hasTestDivisors && hasCheckCount2 && !hasRepeatStep }
  ];
  const codeKeywords = ["for (", "while (", "let ", "var ", "const ", "int ", "console.log", "print(", "===", "!==", "++;", "count++"];
  const hasCodeKeywords = codeKeywords.some((kw) => rawText.includes(kw));
  if (hasCodeKeywords) {
    return {
      isFullyVerified: false,
      hasCodeKeywords: true,
      feedback: "\u{1F31F} Coach Maara gentle reminder: In the Recipe stage, we write algorithm steps in plain human English without code keywords (no `var`, `for (`, `count++`, `print()`, or `;`). Use natural words like 'Get starting and ending numbers', 'For each number in the range', 'Reset divisor count to 0', 'Test divisors from 1 to number', 'If count is 2, display as prime', and 'Repeat until reaching end number'.",
      correction: "Remove code syntax and describe the steps in natural English.",
      suggestedInput: !hasStep1 ? "Step 1: Get starting number and ending number" : !hasStep2 ? "Step 2: For each number in the range from start to end" : !hasResetCount ? "Step 3: Reset divisor count to 0" : !hasTestDivisors ? "Step 4: Test divisors from 1 to number" : !hasCheckCount2 ? "Step 5: If divisor count is 2, display as prime" : "Step 6: Repeat this process for the next number until reaching the ending number",
      steps,
      stepProgress: steps,
      recipeStepProgress: steps
    };
  }
  if (hasStep1 && hasStep2 && hasResetCount && hasTestDivisors && hasCheckCount2 && hasRepeatStep) {
    const allDoneSteps = steps.map((s) => ({ ...s, completed: true, current: false }));
    return {
      isFullyVerified: true,
      hasCodeKeywords: false,
      feedback: "Kudos! You have written down a complete, crystal-clear step-by-step algorithm including repetition across the entire range without any code jargon. Proceed to Ingredients.",
      matchedFirebaseInput: "step 2.5 : Repeat this process for the next number until reaching the ending number",
      correction: "Proceed to Ingredients stage!",
      suggestedInput: void 0,
      steps: allDoneSteps,
      stepProgress: allDoneSteps,
      recipeStepProgress: allDoneSteps
    };
  }
  let nextStepSuggestion = "Step 1: Get starting number and ending number";
  let nextStepCorrection = "Start with Step 1: Get starting number and ending number.";
  let nextStepFeedback = "\u{1F31F} Coach Maara here! Let's write the algorithm step-by-step. What is the very first step we need before checking any range?";
  if (!hasStep1) {
    nextStepSuggestion = "Step 1: Get starting number and ending number";
    nextStepCorrection = "Add Step 1: Get starting number and ending number.";
    nextStepFeedback = "\u{1F31F} Step 1 needed: What are the starting and ending boundaries for our prime check?";
  } else if (!hasStep2) {
    nextStepSuggestion = "Step 2: For each number in the range from start up to end";
    nextStepCorrection = "Add Step 2: Pick each number in the range from start to end.";
    nextStepFeedback = hasResetCount ? "\u{1F31F} Great progress! You have Step 1 (range inputs) and Step 3 (reset count), but notice that Step 2 is missing in between: before testing a number, what step goes through each number in the range from start to end?" : "\u{1F31F} Great start with Step 1! What is the next step to go through each number in this range from start to end?";
  } else if (!hasResetCount) {
    nextStepSuggestion = "Step 3: Reset divisor count to 0 for the current number";
    nextStepCorrection = "Add Step 3: Reset divisor count to 0.";
    nextStepFeedback = "Awesome! When starting with a new number in the range, what should the divisor count be initialized to?";
  } else if (!hasTestDivisors) {
    nextStepSuggestion = "Step 4: Test divisors from 1 up to the current number";
    nextStepCorrection = "Add Step 4: Test divisors from 1 to current number.";
    nextStepFeedback = "Great! How do we test all possible divisors for the current number?";
  } else if (!hasCheckCount2) {
    nextStepSuggestion = "Step 5: If divisor count is exactly 2, display the current number as prime";
    nextStepCorrection = "Add Step 5: If divisor count is 2, display as prime.";
    nextStepFeedback = "Almost there! What decision do we make when the divisor count is exactly 2?";
  } else {
    nextStepSuggestion = "Step 6: Repeat this process for the next number until reaching the ending number";
    nextStepCorrection = "Add Step 6: Repeat this process for all remaining numbers until the end number.";
    nextStepFeedback = "\u{1F31F} We found one prime check process, but how do we ensure this continues for all numbers in the range? Add Step 6 to repeat for the next number until reaching the end number.";
  }
  if (isStuckQuery) {
    nextStepFeedback = `\u{1F31F} Coach Maara is here to help! ${nextStepFeedback}`;
  }
  return {
    isFullyVerified: false,
    hasCodeKeywords: false,
    feedback: nextStepFeedback,
    correction: nextStepCorrection,
    suggestedInput: nextStepSuggestion,
    steps,
    stepProgress: steps,
    recipeStepProgress: steps
  };
}
function detectLoopVariables(rawText) {
  let outerVar = "num";
  let innerVar = "i";
  const step2Text = (/step\s*2[\s\S]*?(?=step\s*[3-6]|$)/i.exec(rawText) || [""])[0];
  const step2VarMatch = /for\s*loop\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?/i.exec(step2Text) || /for\s*\(\s*(?:var|let)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i.exec(step2Text) || /outer\s*(?:for\s*)?loop\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?/i.exec(rawText);
  const step4Text = (/(?:step\s*4|inner)[\s\S]*?(?=step\s*[5-6]|what\s*i|$)/i.exec(rawText) || [""])[0];
  const step4VarMatch = /for\s*loop\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?/i.exec(step4Text) || /for\s*\(\s*(?:var|let)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i.exec(step4Text) || /inner\s*(?:for\s*)?loop\s*\(?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)?/i.exec(rawText);
  if (step2VarMatch && step2VarMatch[1]) {
    const v = step2VarMatch[1].trim();
    if (v && !["loop", "for", "outer", "variable", "step"].includes(v.toLowerCase())) {
      outerVar = v;
    }
  }
  if (step4VarMatch && step4VarMatch[1]) {
    const v = step4VarMatch[1].trim();
    if (v && !["loop", "for", "inner", "variable", "step"].includes(v.toLowerCase())) {
      innerVar = v;
    }
  }
  if (step4Text && (/end\s*:\s*i\b/i.test(step4Text) || /stop\s*:\s*i\b/i.test(step4Text)) && outerVar === "num") {
    outerVar = "i";
  }
  if (outerVar.toLowerCase() === "i" && innerVar.toLowerCase() === "i") {
    if (/for\s*loop\s*\(?\s*j\s*\)?/i.test(rawText) || /\bj\b/i.test(step4Text) || /left\s*side\s*:\s*j/i.test(rawText) || /j\s*[\/%]/i.test(rawText)) {
      innerVar = "j";
    } else {
      innerVar = "j";
    }
  }
  if (outerVar.toLowerCase() === innerVar.toLowerCase()) {
    if (outerVar.toLowerCase() === "i") innerVar = "j";
    else innerVar = "i";
  }
  const moduloMatch = /left\s*side\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*[%/]\s*([a-zA-Z_][a-zA-Z0-9_]*)/i.exec(rawText) || /([a-zA-Z_][a-zA-Z0-9_]*)\s*%\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*==\s*0/i.exec(rawText);
  if (moduloMatch && moduloMatch[1] && moduloMatch[2]) {
    const oV = moduloMatch[1].trim();
    const iV = moduloMatch[2].trim();
    if (oV !== iV && !["step", "if", "side", "left", "right", "operator", "action"].includes(oV.toLowerCase()) && !["step", "if", "side", "left", "right", "operator", "action"].includes(iV.toLowerCase())) {
      outerVar = oV;
      innerVar = iV;
    }
  }
  return { outerVar, innerVar };
}
function validatePrimeRangeIngredients(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  const rawLines = (text || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const cleanLines = rawLines.map((l) => l.replace(/^step\s*\d+[\s.:-]*/i, "").trim());
  const { outerVar, innerVar } = detectLoopVariables(text || "");
  const isStuckQuery = norm.includes("i did not know") || norm.includes("i dont know") || norm.includes("not know") || norm.includes("dont know") || norm.includes("theriyala") || norm.includes("puriyala") || norm.includes("stuck") || norm.includes("please help");
  const isLoopQuery = norm.includes("how to define outer loop") || norm.includes("how to define loop") || norm.includes("how to write outer loop") || norm.includes("how to write loop") || norm.includes("how to define inner loop") || norm.includes("how to write inner loop") || norm.includes("loop syntax") || norm.includes("loop eppdi");
  const isConditionQuery = norm.includes("how to define if condition") || norm.includes("how to define condition") || norm.includes("how to write if condition") || norm.includes("how to write condition") || norm.includes("condition syntax") || norm.includes("condition eppdi") || norm.includes("left side eppdi") || norm.includes("operator eppdi");
  const hasInvertedOuterBounds = (norm.includes("start:end") || norm.includes("start: end") || norm.includes("start (end)") || norm.includes("start(end)")) && (norm.includes("stop:start") || norm.includes("stop: start") || norm.includes("stop (start)") || norm.includes("stop(start)"));
  const hasNegativeStep = norm.includes("next step:-1") || norm.includes("next step: -1") || norm.includes("step: -1") || norm.includes("step:-1") || norm.includes("step (-1)") || norm.includes("step -1") || norm.includes("next step -1") || norm.includes("-1");
  const hasStartIsEnd = norm.includes("start:end") || norm.includes("start: end") || norm.includes("start (end)") || norm.includes("start(end)") || norm.includes("start") && norm.includes(":end");
  const hasStopIsStart = norm.includes("stop:start") || norm.includes("stop: start") || norm.includes("stop (start)") || norm.includes("stop(start)") || norm.includes("stop") && norm.includes(":start");
  const variablesIdentified = norm.includes("start") && norm.includes("end") && (norm.includes("var") || norm.includes("variable") || norm.includes("let") || norm.includes("num") || norm.includes("need") || norm.includes("two") || norm.includes("limits"));
  const hasOuterLoopBlock = () => {
    if (hasInvertedOuterBounds || hasNegativeStep || hasStartIsEnd || hasStopIsStart) return false;
    const lineMatch = cleanLines.some((l) => {
      const lNorm = l.toLowerCase();
      if ((lNorm.includes("two variables") || lNorm.includes("variable")) && !lNorm.includes("for") && !lNorm.includes("loop")) {
        return false;
      }
      const hasValidStart = /\b(start\s*\(?start\)?|start\s*:\s*start|start\s*=\s*start|from\s*start|num\s*=\s*start|let\s*num\s*=\s*start|i\s*=\s*start|start\s*variable)\b/i.test(lNorm);
      const hasValidStop = /\b(stop\s*\(?num\s*<=\s*end\)?|stop\s*:\s*num\s*<=\s*end|stop\s*:\s*end|stop\s*\(?end\)?|num\s*<=\s*end|i\s*<=\s*end|to\s*end|until\s*end|end\s*variable)\b/i.test(lNorm);
      const hasValidStep = /\b(next\s*step\s*\(?\+?1\)?|next\s*step\s*:\s*\+?1|step\s*:\s*\+?1|step\s*\(?\+?1\)?|\+1|\+\+|increment|num\+\+|i\+\+)\b/i.test(lNorm);
      const isSingleLineFor = /for\s*\(.*(num|start|i).*(end|<=).*\)/i.test(lNorm) && !lNorm.includes("-1");
      return isSingleLineFor || hasValidStart && hasValidStop && hasValidStep || lNorm.includes("outer") && hasValidStart && hasValidStop;
    });
    if (lineMatch) return true;
    const step2BlockMatch = /step\s*2[\s\S]*?(?=step\s*[3-6]|$)/i.exec(text);
    if (step2BlockMatch) {
      const bNorm = step2BlockMatch[0].toLowerCase();
      const bHasStart = (bNorm.includes("start:start") || bNorm.includes("start: start") || bNorm.includes("start (start)") || bNorm.includes("from start") || bNorm.includes("start variable")) && !bNorm.includes("start:end") && !bNorm.includes("start: 1");
      const bHasStop = (bNorm.includes("stop:end") || bNorm.includes("stop: end") || bNorm.includes("stop:num<=end") || bNorm.includes("stop: num <= end") || bNorm.includes("stop:i<=end") || bNorm.includes("end:end") || bNorm.includes("end: end") || bNorm.includes("num <= end") || bNorm.includes("end variable")) && !bNorm.includes("stop:start");
      const bHasStep = (bNorm.includes("next step:+1") || bNorm.includes("next step: +1") || bNorm.includes("step: +1") || bNorm.includes("+1") || bNorm.includes("++")) && !bNorm.includes("-1");
      if (bHasStart && (bHasStop || bHasStep)) return true;
    }
    return false;
  };
  const outerLoopMatches = hasOuterLoopBlock();
  const outerLoopIdentified = !isLoopQuery && outerLoopMatches;
  const countScopeIdentified = cleanLines.some((l) => {
    const lNorm = l.toLowerCase();
    return lNorm.includes("count") && (lNorm.includes("0") || lNorm.includes("zero")) && (lNorm.includes("inside") || lNorm.includes("reset") || lNorm.includes("var count") || lNorm.includes("count = 0") || lNorm.includes("count=0") || lNorm.includes("set"));
  }) || (norm.includes("count = 0") || norm.includes("count=0") || norm.includes("reset count to 0") || norm.includes("reset divisor count to 0"));
  const hasInnerLoopBlock = () => {
    const lineMatch = cleanLines.some((l) => {
      const lNorm = l.toLowerCase();
      if (lNorm.includes("two variables") || lNorm.includes("outer") && !lNorm.includes("inner")) {
        return false;
      }
      const hasInnerWord = /\b(inner\s*for|inner\s*loop|inner|divisor\s*loop)\b/i.test(lNorm);
      const hasDivisorStart = /\b(start\s*\(?1\)?|start\s*:\s*1|from\s*1|i\s*=\s*1|j\s*=\s*1|1\s*to\s*(num|i))\b/i.test(lNorm);
      const hasDivisorStop = /\b(stop\s*\(?i\s*<=\s*num\)?|stop\s*:\s*i\s*<=\s*num|stop\s*:\s*j\s*<=\s*i|stop\s*:\s*current\s*num|end\s*:\s*current\s*num|end\s*:\s*i|stop\s*:\s*i|i\s*<=\s*num|j\s*<=\s*i|to\s*num|until\s*num)\b/i.test(lNorm);
      const hasStep = /\b(next\s*step|\+1|\+\+|step\s*:\s*\+?1|step\s*\(\+?1\)|increment)\b/i.test(lNorm);
      const isSingleLineInner = /for\s*\(.*(i|j)\s*=\s*1.*(num|i).*\)/i.test(lNorm);
      return isSingleLineInner || hasInnerWord && (hasDivisorStart || hasDivisorStop) || hasDivisorStart && hasDivisorStop && hasStep;
    });
    if (lineMatch) return true;
    const step4Match = /(step\s*4|inner)[\s\S]*?(?=step\s*[5-6]|what\s*i|$)/i.exec(text);
    if (step4Match) {
      const bNorm = step4Match[0].toLowerCase();
      const bHasStart1 = bNorm.includes("start:1") || bNorm.includes("start: 1") || bNorm.includes("start(1)") || bNorm.includes("from 1") || bNorm.includes("i = 1") || bNorm.includes("j = 1") || bNorm.includes("start: 1");
      const bHasStopNum = bNorm.includes("end:current num") || bNorm.includes("end: current num") || bNorm.includes("stop:current num") || bNorm.includes("stop: current num") || bNorm.includes("end:num") || bNorm.includes("end: num") || bNorm.includes("stop:num") || bNorm.includes("stop: num") || bNorm.includes("end:i") || bNorm.includes("end: i") || bNorm.includes("stop:i") || bNorm.includes("stop: i") || bNorm.includes("i <= num") || bNorm.includes("j <= i");
      const bHasStep1 = bNorm.includes("next step:+1") || bNorm.includes("next step: +1") || bNorm.includes("step:+1") || bNorm.includes("step: +1") || bNorm.includes("+1") || bNorm.includes("++") || bNorm.includes("increment");
      if (bHasStart1 && (bHasStopNum || bHasStep1)) return true;
    }
    const hasExplicitStart1 = norm.includes("start:1") || norm.includes("start: 1") || norm.includes("start (1)");
    const hasExplicitEndNum = norm.includes("end:current num") || norm.includes("end: current num") || norm.includes("end:num") || norm.includes("end: num") || norm.includes("end:i") || norm.includes("end: i") || norm.includes("stop:num") || norm.includes("stop: num") || norm.includes("i <= num") || norm.includes("j <= i");
    const hasExplicitStep1 = norm.includes("next step:+1") || norm.includes("next step: +1") || norm.includes("next step: 1");
    if (hasExplicitStart1 && hasExplicitEndNum && hasExplicitStep1) return true;
    return false;
  };
  const innerLoopMatches = hasInnerLoopBlock();
  const innerLoopIdentified = !isLoopQuery && innerLoopMatches;
  const hasFullIncrementAction = /count\s*=\s*count\s*\+\s*1/i.test(text) || /count\s*\+\+/i.test(text) || /count\s*\+=\s*1/i.test(text) || /action\s*:\s*count/i.test(text) || /action\s*.*count/i.test(text) || /this\s*happen\s*count/i.test(text) || /happen\s*count/i.test(text) || /equal\s*to\s*zero\s*.*count/i.test(text) || /when\s*.*zero\s*.*count/i.test(text) || /if\s*.*zero\s*.*count/i.test(text) || /increase\s*(?:the\s*)?count/i.test(text) || /increment\s*(?:the\s*)?count/i.test(text) || /count\s*(?:increases|goes\s*up|will\s*increase|is\s*incremented)/i.test(text) || cleanLines.some((l) => /count/i.test(l) && (/happen/i.test(l) || /action/i.test(l) || /increase/i.test(l) || /add/i.test(l) || /increment/i.test(l)));
  const normDynModulo1 = `${outerVar}%${innerVar}==0`;
  const normDynModulo2 = `${outerVar} % ${innerVar} == 0`;
  const normDynModulo3 = `${outerVar} % ${innerVar} = 0`;
  const hasModuloLineOrPart = norm.includes("%") || norm.includes("modulo") || norm.includes("remainder") || norm.includes("divisible") || /left\s*side/i.test(text);
  const hasZeroLineOrPart = norm.includes("0") || norm.includes("zero") || /right\s*side/i.test(text) || /equal\s*to\s*zero/i.test(text);
  const moduloCheckIdentified = !isConditionQuery && hasFullIncrementAction && (hasModuloLineOrPart && hasZeroLineOrPart || cleanLines.some((l) => {
    const lNorm = l.toLowerCase();
    const hasModulo = lNorm.includes("%") || lNorm.includes("modulo") || lNorm.includes("remainder");
    const hasZero = lNorm.includes("0") || lNorm.includes("zero");
    const hasAction = lNorm.includes("count++") || lNorm.includes("count = count + 1") || lNorm.includes("count += 1");
    const isIfStyle = lNorm.includes("left side") && hasModulo && lNorm.includes("right side") && hasZero || /if\s*\(?.*%.*0\)?/i.test(lNorm) || hasModulo && hasZero && hasAction;
    return isIfStyle;
  }) || norm.includes("num % i == 0") || norm.includes("num%i==0") || norm.includes("i % j == 0") || norm.includes("i%j==0") || norm.includes("m % n == 0") || norm.includes("m%n==0") || norm.includes("k % i == 0") || norm.includes("k%i==0") || norm.includes("j % k == 0") || norm.includes("j%k==0") || norm.includes(normDynModulo1) || norm.includes(normDynModulo2) || norm.includes(normDynModulo3) || norm.includes(`${outerVar} % ${innerVar}`) && norm.includes("0"));
  const isPrintingInnerVar = outerVar !== innerVar && (new RegExp(`\\bprint\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bdisplay\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\boutput\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bprint\\s+${innerVar}\\b`, "i").test(norm)) && !(new RegExp(`\\bprint\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bprint\\s+${outerVar}\\b`, "i").test(norm) || norm.includes("print num") || norm.includes("print(num)") || norm.includes("print current num") || norm.includes("print current number") || norm.includes("print range number"));
  const hasPrimePrintAction = !isPrintingInnerVar && (norm.includes("print") || norm.includes("display") || norm.includes("output") || norm.includes("show") || norm.includes("prime") || /action\s*:\s*print/i.test(text) || /happen\s*.*print/i.test(text));
  const hasCountTwoCondition = norm.includes("count == 2") || norm.includes("count==2") || norm.includes("count = 2") || norm.includes("count is 2") || norm.includes("count equal to 2") || norm.includes("count") && (norm.includes("2") || norm.includes("two"));
  const primeCheckIdentified = !isConditionQuery && !isPrintingInnerVar && (hasPrimePrintAction && hasCountTwoCondition || cleanLines.some((l) => {
    const lNorm = l.toLowerCase();
    const hasTwo = lNorm.includes("2") || lNorm.includes("two");
    const hasPrint = lNorm.includes("print") || lNorm.includes("display") || lNorm.includes("prime") || lNorm.includes("output");
    const isCount2 = lNorm.includes("count == 2") || lNorm.includes("count = 2") || lNorm.includes("count is 2") || lNorm.includes("left side") && lNorm.includes("count") && hasTwo;
    return isCount2 && hasPrint && !lNorm.includes(`print ${innerVar}`) && !lNorm.includes(`print(${innerVar})`);
  }));
  const steps = [
    { stepNumber: 1, title: "Variables start, end, num", completed: variablesIdentified, current: !variablesIdentified },
    { stepNumber: 2, title: `Outer loop (${outerVar}) from start to end`, completed: outerLoopIdentified, current: variablesIdentified && !outerLoopIdentified },
    { stepNumber: 3, title: "count = 0 inside outer loop", completed: countScopeIdentified, current: countScopeIdentified ? false : outerLoopIdentified || variablesIdentified },
    { stepNumber: 4, title: `Inner loop (${innerVar}) = 1 to ${outerVar}`, completed: innerLoopIdentified, current: innerLoopIdentified ? false : countScopeIdentified },
    { stepNumber: 5, title: `if (${outerVar} % ${innerVar} == 0) count++`, completed: moduloCheckIdentified, current: moduloCheckIdentified ? false : innerLoopIdentified },
    { stepNumber: 6, title: `if (count == 2) print(${outerVar})`, completed: primeCheckIdentified, current: primeCheckIdentified ? false : moduloCheckIdentified }
  ];
  if (isStuckQuery && !isLoopQuery && !isConditionQuery) {
    if (innerLoopIdentified && !moduloCheckIdentified) {
      return {
        isFullyVerified: false,
        feedback: `\u{1F31F} Coach Maara here to help! You have clearly defined your Inner For Loop (testing divisors from 1 to ${outerVar} with loop variable \`${innerVar}\`). Inside this loop, we test if \`${outerVar}\` is divisible by \`${innerVar}\`.

Define the 4 parts of the condition:
1) Left side: \`${outerVar} % ${innerVar}\`
2) Operator: \`==\`
3) Right side: \`0\`
4) Action: \`count = count + 1\` (or \`count++\`)

Example:
Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
        matchedFirebaseInput: "how to define if condition for divisibility",
        correction: `Add Step 5: If condition with left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1.`,
        suggestedInput: `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
        stepProgress: steps,
        ingredientsStepProgress: steps,
        variablesIdentified,
        outerLoopIdentified,
        countScopeIdentified,
        innerLoopIdentified: true,
        moduloCheckIdentified: false,
        primeCheckIdentified: false
      };
    }
    if (variablesIdentified && !outerLoopIdentified && !innerLoopIdentified) {
      return {
        isFullyVerified: false,
        feedback: `\u{1F31F} Coach Maara here to help! You did a great job setting up the range variables (\`start\` and \`end\`). Next, to go through each number in that range using variable \`${outerVar}\`, we need an **Outer For Loop**.

Remember, define the 3 key parts:
1) Start (initial value: \`start\`)
2) Stop / End condition (boundary: \`${outerVar} <= end\`)
3) Next step (increment: \`+1\`)

Example:
Step 2: Outer for loop: start (start), stop (${outerVar} <= end), next step (+1)`,
        matchedFirebaseInput: "how to define outer loop",
        correction: `Define outer for loop with start (start), stop (${outerVar} <= end), and next step (+1).`,
        suggestedInput: `Step 2: Outer for loop: start (start), stop (${outerVar} <= end), next step (+1)`,
        stepProgress: steps,
        ingredientsStepProgress: steps,
        variablesIdentified,
        outerLoopIdentified: false,
        countScopeIdentified: false,
        innerLoopIdentified: false,
        moduloCheckIdentified: false,
        primeCheckIdentified: false
      };
    }
  }
  if (isLoopQuery) {
    const isInner = norm.includes("inner") || norm.includes("divisor");
    if (isInner) {
      return {
        isFullyVerified: false,
        feedback: `\u{1F31F} Coach Maara here! To define an Inner Loop, you must specify 3 key parts:
1) Start (initial value: 1)
2) Stop / End condition (boundary: ${innerVar} <= ${outerVar})
3) Next step (increment: +1)

Example:
Step 4: Inner for loop: start (1), stop (${innerVar} <= ${outerVar}), next step (+1)`,
        matchedFirebaseInput: "how to define inner loop",
        correction: `Define inner loop with start (1), stop (${innerVar} <= ${outerVar}), and next step (+1).`,
        suggestedInput: `Step 4: Inner for loop: start (1), stop (${innerVar} <= ${outerVar}), next step (+1)`,
        stepProgress: steps,
        ingredientsStepProgress: steps,
        variablesIdentified,
        outerLoopIdentified,
        countScopeIdentified,
        innerLoopIdentified: false,
        moduloCheckIdentified,
        primeCheckIdentified
      };
    }
    return {
      isFullyVerified: false,
      feedback: `\u{1F31F} Coach Maara here! To define an Outer Loop, you must specify 3 key parts:
1) Start (initial value: start)
2) Stop / End condition (boundary: ${outerVar} <= end)
3) Next step (increment: +1)

Example:
Step 2: Outer for loop: start (start), stop (${outerVar} <= end), next step (+1)`,
      matchedFirebaseInput: "how to define outer loop",
      correction: `Define outer loop with start (start), stop (${outerVar} <= end), and next step (+1).`,
      suggestedInput: `Step 2: Outer for loop: start (start), stop (${outerVar} <= end), next step (+1)`,
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified: false,
      countScopeIdentified,
      innerLoopIdentified: false,
      moduloCheckIdentified,
      primeCheckIdentified
    };
  }
  if (isConditionQuery) {
    const isPrimeDecision = norm.includes("prime") || norm.includes("display") || norm.includes("print");
    if (isPrimeDecision) {
      return {
        isFullyVerified: false,
        feedback: `\u{1F31F} Coach Maara here! To define the Prime Check Decision If Condition, specify:
1) Left side (count)
2) Comparison operator (==)
3) Right side (2)
4) Action (print(${outerVar}))

Example:
Step 6: If condition: left side (count), operator (==), right side (2), action: print(${outerVar})`,
        matchedFirebaseInput: "how to define prime if condition",
        correction: `Define if condition with left side (count), operator (==), right side (2), action: print(${outerVar}).`,
        suggestedInput: `Step 6: If condition: left side (count), operator (==), right side (2), action: print(${outerVar})`,
        stepProgress: steps,
        ingredientsStepProgress: steps,
        variablesIdentified,
        outerLoopIdentified,
        countScopeIdentified,
        innerLoopIdentified,
        moduloCheckIdentified,
        primeCheckIdentified: false
      };
    }
    return {
      isFullyVerified: false,
      feedback: `\u{1F31F} Coach Maara here! To define the Divisibility Check If Condition, specify:
1) Left side (${outerVar} % ${innerVar})
2) Comparison operator (==)
3) Right side (0)
4) Action (count = count + 1)

Example:
Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      matchedFirebaseInput: "how to define if condition",
      correction: `Define if condition with left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1.`,
      suggestedInput: `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified,
      countScopeIdentified,
      innerLoopIdentified,
      moduloCheckIdentified: false,
      primeCheckIdentified
    };
  }
  const hasDivisionInLeft = norm.includes("/") && !norm.includes("%") && (norm.includes("left side") || norm.includes("leftside") || norm.includes("step 5") || norm.includes("if condition"));
  const hasInvertedModulo = norm.includes(`${innerVar}%${outerVar}`) || norm.includes(`${innerVar} % ${outerVar}`) || outerVar === "i" && innerVar === "j" && (norm.includes("j/i") || norm.includes("j / i") || norm.includes("j%i") || norm.includes("j % i"));
  if (hasDivisionInLeft || hasInvertedModulo) {
    let customExplanation = "";
    if (hasDivisionInLeft && hasInvertedModulo) {
      customExplanation = `You chose variable \`${outerVar}\` for your outer range loop and \`${innerVar}\` for your inner divisor loop!
\u2022 **Operator**: Use the remainder/modulo operator \`%\` (not division \`/\`) to test for exact divisibility.
\u2022 **Variable Order**: Place the candidate number \`${outerVar}\` first, and the divisor \`${innerVar}\` second: \`${outerVar} % ${innerVar}\` (e.g. \`${outerVar} % ${innerVar} == 0\`).
\u2022 **Operator & Action**: Include \`operator: ==\`, \`right side: 0\`, and \`action: count = count + 1\`.`;
    } else if (hasDivisionInLeft) {
      customExplanation = `You used division \`/\` in \`${outerVar} / ${innerVar}\`. Division gives the quotient, but we need the remainder to test if it divides evenly. Use the modulo operator \`%\`: \`${outerVar} % ${innerVar} == 0\`.`;
    } else {
      customExplanation = `Check the order of variables in your modulo condition! We test whether the current range number (\`${outerVar}\`) is divisible by the divisor (\`${innerVar}\`), so write \`${outerVar} % ${innerVar}\` (not \`${innerVar} % ${outerVar}\`).`;
    }
    return {
      isFullyVerified: false,
      feedback: `\u{1F50D} Step 5 Condition Alert:
${customExplanation}

\u{1F4A1} Correct format for Step 5:
Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      matchedFirebaseInput: `step 5: left side ${innerVar}/${outerVar}`,
      correction: `Use left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1.`,
      suggestedInput: `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified,
      countScopeIdentified,
      innerLoopIdentified,
      moduloCheckIdentified: false,
      primeCheckIdentified: false
    };
  }
  const hasOnlyCountPlusOne = /count\s*\+\s*1/i.test(text) && !/count\s*=\s*count\s*\+\s*1/i.test(text) && !/count\s*\+\+/i.test(text) && !/count\s*\+=\s*1/i.test(text);
  const mentionsStep5OrModulo = norm.includes("step 5") || norm.includes("left side") || norm.includes("%");
  if (hasOnlyCountPlusOne && mentionsStep5OrModulo) {
    return {
      isFullyVerified: false,
      feedback: `\u{1F50D} Step 5 Action & Assignment Alert:
You wrote \`count+1\`, but notice two crucial programming concepts:
1) **Where to store it?** Writing \`count + 1\` only calculates the sum, but doesn't save it anywhere! To update the count variable, we must store the result back using variable assignment: \`count = count + 1\` (or \`count++\`).
2) **When does it execute?** This counter should only increment when the if condition is satisfied (when remainder is 0). In our 4-part condition format, clearly label it: \`action: count = count + 1\`.

\u{1F4A1} Correct format for Step 5:
Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      matchedFirebaseInput: "step 5: count+1 without assignment",
      correction: `Update action to store the result in count: action: count = count + 1.`,
      suggestedInput: `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`,
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified,
      countScopeIdentified,
      innerLoopIdentified,
      moduloCheckIdentified: false,
      primeCheckIdentified: false
    };
  }
  if (isPrintingInnerVar) {
    return {
      isFullyVerified: false,
      feedback: `\u{1F50D} Step 6 Variable Alert:
You wrote \`print ${innerVar}\`, but look closely at what your variables represent:
\u2022 \`${innerVar}\` is your **Inner Loop Divisor** (numbers 1 to ${outerVar} tested to find factors).
\u2022 \`${outerVar}\` is your **Current Range Number** being checked for primality.

When \`count == 2\`, the number that is prime is the candidate number \`${outerVar}\`, not the divisor \`${innerVar}\`! Change your print action to \`print(${outerVar})\` (or \`print ${outerVar}\`).

\u{1F4A1} Correct format for Step 6:
Step 6: If condition: left side (count), operator (==), right side (2), action: print(${outerVar})`,
      matchedFirebaseInput: `step 6: print ${innerVar} instead of ${outerVar}`,
      correction: `Change print action to output ${outerVar}: print(${outerVar}) instead of print(${innerVar}).`,
      suggestedInput: `Step 6: If condition: left side (count), operator (==), right side (2), action: print(${outerVar})`,
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified,
      countScopeIdentified,
      innerLoopIdentified,
      moduloCheckIdentified,
      primeCheckIdentified: false
    };
  }
  if (hasInvertedOuterBounds || hasStartIsEnd && hasStopIsStart || hasStartIsEnd && hasNegativeStep) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F50D} Outer Loop Direction Alert:\nLet's check your outer loop setup:\n1) **Start**: You wrote `start: end`, but to check from the beginning of the range, start should be `start` (initial value).\n2) **Stop**: You wrote `stop: start`, but to check up to the boundary, stop condition should be `num <= end` (or `end`).\n3) **Next Step**: You wrote `Next step: -1`, but to move forward through the numbers, the step should be `+1` (increment).\n\n\u{1F4A1} Correct format:\nStep 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      matchedFirebaseInput: "step 2 : start:end stop:start next step:-1",
      correction: "Define outer loop going forward: start (start), stop (num <= end), and next step (+1).",
      suggestedInput: "Step 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified: false,
      countScopeIdentified: false,
      innerLoopIdentified: false,
      moduloCheckIdentified: false,
      primeCheckIdentified: false
    };
  }
  if (hasNegativeStep && !norm.includes("+1") && !norm.includes("++")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F50D} Loop Step Alert: You wrote `Next step: -1`. To check each number in ascending order from start to end (e.g. 10 to 20), we must increment forward by `+1`, not decrement by `-1`.\n\n\u{1F4A1} Example:\nStep 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      matchedFirebaseInput: "step 2 : next step -1",
      correction: "Change next step to +1 to move forward through the range.",
      suggestedInput: "Step 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified: false,
      countScopeIdentified: false,
      innerLoopIdentified: false,
      moduloCheckIdentified: false,
      primeCheckIdentified: false
    };
  }
  if ((hasStartIsEnd || hasStopIsStart) && !outerLoopIdentified) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F50D} Outer Loop Boundary Alert: Check your loop limits!\n\u2022 **Start** should be `start` (starting number).\n\u2022 **Stop** should be `num <= end` (ending number boundary).\n\n\u{1F4A1} Example:\nStep 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      matchedFirebaseInput: "step 2 : start and stop boundaries reversed",
      correction: "Set start to start and stop to num <= end.",
      suggestedInput: "Step 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified: false,
      countScopeIdentified: false,
      innerLoopIdentified: false,
      moduloCheckIdentified: false,
      primeCheckIdentified: false
    };
  }
  if (norm.includes("count = 0 before") || norm.includes("count = 0 outside") || norm.includes("count before the outer loop")) {
    return {
      isFullyVerified: false,
      feedback: "Placement Bug! If count = 0 is outside the outer loop, the divisor count will keep accumulating for all numbers combined. Place var count = 0; INSIDE the outer loop!",
      matchedFirebaseInput: "step 2.1 : count = 0 before the outer loop",
      correction: "Place count = 0 inside the outer loop so it resets for each number.",
      suggestedInput: "Step 3: count = 0 inside outer loop",
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified,
      countScopeIdentified: false,
      innerLoopIdentified,
      moduloCheckIdentified,
      primeCheckIdentified
    };
  }
  if (norm.includes("num < end") || norm.includes("i < end") || norm.includes("stop: end - 1")) {
    return {
      isFullyVerified: false,
      feedback: "If you write num < end, the loop stops before end, missing the ending number! Use num <= end.",
      matchedFirebaseInput: "step 2 : For loop with num < end",
      correction: "Use num <= end so the loop includes the ending number.",
      suggestedInput: "Step 2: Outer for loop: start (start), stop (num <= end), next step (+1)",
      stepProgress: steps,
      ingredientsStepProgress: steps,
      variablesIdentified,
      outerLoopIdentified: false,
      countScopeIdentified,
      innerLoopIdentified,
      moduloCheckIdentified,
      primeCheckIdentified
    };
  }
  if (variablesIdentified && outerLoopIdentified && countScopeIdentified && innerLoopIdentified && moduloCheckIdentified && primeCheckIdentified) {
    const allDoneSteps = steps.map((s) => ({ ...s, completed: true, current: false }));
    return {
      isFullyVerified: true,
      feedback: "Awesome! All ingredients are systematically identified with loops (start, stop, step) and conditions (left side, operator, right side). Now let's proceed to Taste the Sample.",
      matchedFirebaseInput: "step 2.4 : if (count == 2) { print(num); }",
      correction: "Proceed to Taste the Sample stage to assemble your code!",
      suggestedInput: void 0,
      stepProgress: allDoneSteps,
      ingredientsStepProgress: allDoneSteps,
      variablesIdentified: true,
      outerLoopIdentified: true,
      countScopeIdentified: true,
      innerLoopIdentified: true,
      moduloCheckIdentified: true,
      primeCheckIdentified: true
    };
  }
  let nextIngSuggestion = "Step 1: Variables start, end, num";
  let nextIngCorrection = "Identify variables start and end for range limits.";
  let nextIngFeedback = "\u{1F31F} Coach Maara: Let's list the ingredients one by one. What variables do we need to store the range limits and candidate number?";
  if (!variablesIdentified) {
    nextIngSuggestion = "Step 1: Variables start, end, num";
    nextIngCorrection = "List variables start, end, and num.";
    nextIngFeedback = "What variables do we need to store the starting number, ending number, and current number?";
  } else if (innerLoopIdentified && !moduloCheckIdentified) {
    const hasConditionParts = (norm.includes("left side") || norm.includes("leftside") || norm.includes(`${outerVar}%${innerVar}`) || norm.includes(`${outerVar} % ${innerVar}`)) && (norm.includes("right side") || norm.includes("rightside") || norm.includes("0")) && (norm.includes("operator") || norm.includes("=="));
    if (hasConditionParts) {
      nextIngSuggestion = `action: count = count + 1`;
      nextIngCorrection = `Add the action to Step 5: action: count = count + 1.`;
      nextIngFeedback = `\u{1F31F} You have successfully set up the condition with Left side (\`${outerVar} % ${innerVar}\`), Operator (\`==\`), and Right side (\`0\`)! You're almost there. Now, add the action that increases your divisor counter when this condition is met:
\`action: count = count + 1\``;
    } else {
      nextIngSuggestion = `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`;
      nextIngCorrection = outerLoopIdentified ? `Add Step 5: If condition with left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1.` : `Add Step 5: If condition (${outerVar} % ${innerVar} == 0) count++, and ensure Step 2 outer loop is defined.`;
      nextIngFeedback = outerLoopIdentified ? `\u{1F31F} You defined your inner loop! Next, inside this loop, define the condition to check if \`${innerVar}\` divides \`${outerVar}\` without a remainder: left side (\`${outerVar} % ${innerVar}\`), operator (\`==\`), right side (\`0\`), action (\`count = count + 1\`).` : `\u{1F31F} Great progress defining your inner divisor loop! Inside this loop, we need Step 5: if condition with left side (\`${outerVar} % ${innerVar}\`), operator (\`==\`), right side (\`0\`), action (\`count = count + 1\`). (Also make sure to add Step 2 outer loop from start to end so it checks every number in the range!)`;
    }
  } else if (!outerLoopIdentified) {
    nextIngSuggestion = `Step 2: Outer for loop: start (start), stop (${outerVar} <= end), next step (+1)`;
    nextIngCorrection = `Define outer for loop specifying start (start), stop (${outerVar} <= end), and next step (+1).`;
    nextIngFeedback = `\u{1F31F} You have defined your variables! Next, to go through each number from start to end, define the outer loop with: start (start), stop (${outerVar} <= end), and next step (+1).`;
  } else if (!countScopeIdentified) {
    nextIngSuggestion = "Step 3: count = 0 inside outer loop";
    nextIngCorrection = "Reset divisor count to 0 inside the outer loop.";
    nextIngFeedback = "Where should the count variable be declared so it resets for each number?";
  } else if (!innerLoopIdentified) {
    nextIngSuggestion = `Step 4: Inner for loop: start (1), stop (${innerVar} <= ${outerVar}), next step (+1)`;
    nextIngCorrection = `Define inner for loop specifying start (1), stop (${innerVar} <= ${outerVar}), and next step (+1).`;
    nextIngFeedback = `To define the inner loop, specify the 3 parts: start (1), stop (${innerVar} <= ${outerVar}), and next step (+1).`;
  } else if (!moduloCheckIdentified) {
    nextIngSuggestion = `Step 5: If condition: left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1`;
    nextIngCorrection = `Define if condition with left side (${outerVar} % ${innerVar}), operator (==), right side (0), action: count = count + 1.`;
    nextIngFeedback = `To define the divisibility check, specify the 3 parts: left side (${outerVar} % ${innerVar}), operator (==), and right side (0).`;
  } else {
    nextIngSuggestion = `Step 6: If condition: left side (count), operator (==), right side (2), action: print(${outerVar})`;
    nextIngCorrection = `Define if condition with left side (count), operator (==), right side (2), action: print(${outerVar}).`;
    nextIngFeedback = `\u{1F31F} Brilliant work! You have configured the modulo check and divisor count increment! Now for the final ingredient (Step 6): Define the condition to check if \`count\` equals \`2\` and print \`${outerVar}\`:
left side (\`count\`), operator (\`==\`), right side (\`2\`), action (\`print(${outerVar})\`).`;
  }
  return {
    isFullyVerified: false,
    feedback: nextIngFeedback,
    correction: nextIngCorrection,
    suggestedInput: nextIngSuggestion,
    stepProgress: steps,
    ingredientsStepProgress: steps,
    variablesIdentified,
    outerLoopIdentified,
    countScopeIdentified,
    innerLoopIdentified,
    moduloCheckIdentified,
    primeCheckIdentified
  };
}
function validatePrimeRangeSampleCode(code, attemptCount) {
  const text = code || "";
  const norm = text.toLowerCase().replace(/\s+/g, " ").trim();
  let lang = "javascript";
  if (/def\s+\w+/i.test(text) || /for\s+\w+\s+in\s+range/i.test(text) || /print\s*\(.*?\)/.test(text) && !text.includes(";") && !text.includes("{") && !text.includes("let ") && !text.includes("var ")) {
    lang = "python";
  } else if (/#include\s*<iostream>/i.test(text) || /std::cout/i.test(text) || /cout\s*<</i.test(text)) {
    lang = "cpp";
  } else if (/#include\s*<stdio\.h>/i.test(text) || /printf\s*\(/i.test(text)) {
    lang = "c";
  } else if (/public\s+class/i.test(text) || /System\.out\.print/i.test(text)) {
    lang = "java";
  }
  let outerVar = "i";
  let innerVar = "j";
  let startVar = "start";
  let endVar = "end";
  const rangeDeclMatch = text.match(/\b(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*\d+[\s,;]+(?:(?:var|let|const|int)?\s*)?([a-zA-Z_]\w*)\s*=\s*\d+/i);
  if (rangeDeclMatch) {
    startVar = rangeDeclMatch[1];
    endVar = rangeDeclMatch[2];
  } else if (/\b(low|from|a)\b/i.test(text)) {
    startVar = text.match(/\b(low|from|a)\b/i)[1];
  }
  const pyOuterMatch = text.match(/for\s+([a-zA-Z_]\w*)\s+in\s+range/i);
  const cOuterMatch = text.match(/for\s*\(\s*(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(?:[a-zA-Z_]\w*|\d+)\s*;/i);
  if (pyOuterMatch) {
    outerVar = pyOuterMatch[1];
  } else if (cOuterMatch) {
    outerVar = cOuterMatch[1];
  }
  const pyInnerMatches = Array.from(text.matchAll(/for\s+([a-zA-Z_]\w*)\s+in\s+range/gi));
  if (pyInnerMatches.length >= 2) {
    innerVar = pyInnerMatches[1][1];
  } else {
    const cInnerMatches = Array.from(text.matchAll(/for\s*\(\s*(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(?:[a-zA-Z_]\w*|\d+)\s*;/gi));
    if (cInnerMatches.length >= 2) {
      innerVar = cInnerMatches[1][1];
    } else if (outerVar === "i") {
      innerVar = "j";
    } else if (outerVar === "num") {
      innerVar = "i";
    }
  }
  const hasStart = /\b(start|low|a|from|min|num1|x)\s*=\s*\d+/i.test(text) || /\b(start|low|a|from|min|num1|x)\b/i.test(text) || /\brange\s*\(\s*\d+\s*,/i.test(text);
  const hasEnd = /\b(end|high|b|to|max|num2|y)\s*=\s*\d+/i.test(text) || /\b(end|high|b|to|max|num2|y)\b/i.test(text) || /\brange\s*\(\s*\d+\s*,\s*\d+\s*\)/i.test(text) || /;\s*[^;]*<=\s*(?:end|high|b|to|max|\d+)\s*;/i.test(text);
  const hasRangeInputs = hasStart && hasEnd || /\bstart\b/i.test(text) && /\bend\b/i.test(text) || /\brange\s*\(\s*10\s*,\s*2[01]\s*\)/i.test(text);
  const hasOuterLoop = /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(/i.test(text) || /for\s*\(\s*(?:var|let|const|int)?\s*[a-zA-Z_]\w*\s*=\s*(?:[a-zA-Z_]\w*|\d+)\s*;\s*[a-zA-Z_]\w*\s*<=\s*(?:[a-zA-Z_]\w*|\d+)\s*;\s*[a-zA-Z_]\w*(?:\+\+|\+=\s*1)\s*\)/i.test(text) || /for\s*\(\s*(?:var|let|const|int)?\s*[a-zA-Z_]\w*\s*=\s*(?:[a-zA-Z_]\w*|\d+)\s*;\s*[a-zA-Z_]\w*\s*<\s*(?:[a-zA-Z_]\w*|\d+)\s*;\s*[a-zA-Z_]\w*(?:\+\+|\+=\s*1)\s*\)/i.test(text) || /while\s*\(\s*[a-zA-Z_]\w*\s*<=\s*(?:[a-zA-Z_]\w*|\d+)\s*\)/i.test(text);
  const hasCountInitInside = (/\b(?:var|let|const|int)?\s*count\s*=\s*0\b/i.test(text) || /\bcnt\s*=\s*0\b/i.test(text)) && hasOuterLoop && (text.indexOf("count") > text.indexOf("for") || text.includes("while") && text.indexOf("count") > text.indexOf("while"));
  const allForMatches = Array.from(text.matchAll(/for\s*\(|for\s+[a-zA-Z_]\w*\s+in/gi));
  let textAfterOuterLoop = "";
  if (allForMatches.length >= 1 && allForMatches[0].index !== void 0) {
    const firstForIdx = allForMatches[0].index;
    const newlineAfterFirstFor = text.indexOf("\n", firstForIdx);
    textAfterOuterLoop = newlineAfterFirstFor !== -1 ? text.slice(newlineAfterFirstFor) : "";
  }
  const hasAttemptedSecondLoop = /for\s*\(|for\s+[a-zA-Z_]\w*\s+in/i.test(textAfterOuterLoop);
  const hasInnerRangeCopyBug = hasAttemptedSecondLoop && (new RegExp(`for\\s*\\(\\s*(?:var|let|const|int)?\\s*([a-zA-Z_]\\w*)\\s*=\\s*(?:${startVar}|a|start)\\s*;\\s*\\1\\s*<=\\s*(?:${endVar}|b|end)\\s*;`, "i").test(textAfterOuterLoop) || new RegExp(`for\\s+([a-zA-Z_]\\w*)\\s+in\\s+range\\s*\\(\\s*(?:${startVar}|a|start)\\s*,\\s*(?:${endVar}|b|end)`, "i").test(textAfterOuterLoop));
  const hasInnerSameVarBug = hasAttemptedSecondLoop && (new RegExp(`for\\s*\\(\\s*(?:var|let|const|int)?\\s*${outerVar}\\s*=\\s*1\\s*;\\s*${outerVar}\\s*<=`, "i").test(textAfterOuterLoop) || new RegExp(`for\\s+${outerVar}\\s+in\\s+range\\s*\\(\\s*1\\s*,`, "i").test(textAfterOuterLoop));
  const hasInnerLoopEndAtRangeBug = hasAttemptedSecondLoop && (new RegExp(`for\\s*\\(\\s*(?:var|let|const|int)?\\s*[a-zA-Z_]\\w*\\s*=\\s*1\\s*;[^;]*<=\\s*(?:${endVar}|b|end)\\s*;`, "i").test(textAfterOuterLoop) || new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*1\\s*,\\s*(?:${endVar}|b|end)`, "i").test(textAfterOuterLoop));
  const hasInnerLoopZeroBug = hasAttemptedSecondLoop && (/for\s*\(\s*(?:var|let|const|int)?\s*[a-zA-Z_]\w*\s*=\s*0\s*;/i.test(textAfterOuterLoop) || /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*0\s*,/i.test(textAfterOuterLoop));
  const hasInnerStrictBoundBug = hasAttemptedSecondLoop && (new RegExp(`for\\s*\\(\\s*(?:var|let|const|int)?\\s*[a-zA-Z_]\\w*\\s*=\\s*1\\s*;[^;]*<\\s*${outerVar}\\s*;`, "i").test(textAfterOuterLoop) || new RegExp(`for\\s+[a-zA-Z_]\\w*\\s+in\\s+range\\s*\\(\\s*1\\s*,\\s*${outerVar}\\s*\\)\\s*:`, "i").test(textAfterOuterLoop) && !textAfterOuterLoop.includes(`${outerVar} + 1`));
  const hasInnerLoop = hasAttemptedSecondLoop && (new RegExp(`for\\s*\\(\\s*(?:var|let|const|int)?\\s*([a-zA-Z_]\\w*)\\s*=\\s*1\\s*;\\s*\\1\\s*<=\\s*${outerVar}\\s*;\\s*\\1(?:\\+\\+|\\+=\\s*1)\\s*\\)`, "i").test(textAfterOuterLoop) || new RegExp(`for\\s+([a-zA-Z_]\\w*)\\s+in\\s+range\\s*\\(\\s*1\\s*,\\s*${outerVar}\\s*\\+\\s*1\\s*\\)`, "i").test(textAfterOuterLoop) || /for\s*\(\s*(?:var|let|const|int)?\s*(?:j|d|k|divisor)\s*=\s*1\s*;\s*(?:j|d|k|divisor)\s*<=\s*(?:i|num|[a-zA-Z_]\w*)\s*;/i.test(textAfterOuterLoop) || /for\s+(?:j|d|k|divisor)\s+in\s+range\s*\(\s*1\s*,\s*(?:i|num|[a-zA-Z_]\w*)\s*\+\s*1\s*\)/i.test(textAfterOuterLoop)) && !hasInnerRangeCopyBug && !hasInnerSameVarBug && !hasInnerLoopEndAtRangeBug && !hasInnerLoopZeroBug && !hasInnerStrictBoundBug;
  const hasInvertedModuloBug = new RegExp(`if\\s*\\(?\\s*${innerVar}\\s*%\\s*${outerVar}\\s*==\\s*0`, "i").test(text);
  const hasModuloCondition = (new RegExp(`(?:${outerVar}|num)\\s*%\\s*(?:${innerVar}|j|d|k|divisor|i)\\s*(?:==|===)\\s*0`, "i").test(text) || /%\s*(?:j|i|d|k|divisor)\s*(?:==|===)\s*0/i.test(text) || /if\s*\(?.*%.*==\s*0\)?/i.test(text) || /if\s+[a-zA-Z_]\w*\s*%\s*[a-zA-Z_]\w*\s*==\s*0\s*:/i.test(text)) && !hasInvertedModuloBug;
  const hasCountIncrement = /\bcount\s*(?:\+\+|\+=\s*1|=\s*count\s*\+\s*1)/i.test(text) || /\bcnt\s*(?:\+\+|\+=\s*1|=\s*cnt\s*\+\s*1)/i.test(text);
  const hasPrimeCheck = /\bcount\s*(?:==|===)\s*2\b/i.test(text) || /\bcnt\s*(?:==|===)\s*2\b/i.test(text);
  const isPrintingInnerVar = outerVar !== innerVar && (new RegExp(`\\bprint\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bconsole\\.log\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bprintf\\s*\\([^)]*\\b${innerVar}\\b`, "i").test(text) || new RegExp(`\\bcout\\s*<<\\s*${innerVar}\\b`, "i").test(text) || new RegExp(`\\bSystem\\.out\\.print(?:ln)?\\s*\\(?\\s*${innerVar}\\s*\\)?`, "i").test(text)) && !(new RegExp(`\\bprint\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bconsole\\.log\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bprintf\\s*\\([^)]*\\b${outerVar}\\b`, "i").test(text) || new RegExp(`\\bcout\\s*<<\\s*${outerVar}\\b`, "i").test(text) || new RegExp(`\\bSystem\\.out\\.print(?:ln)?\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text));
  const hasValidCandidatePrint = new RegExp(`\\bprint\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bconsole\\.log\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || new RegExp(`\\bprintf\\s*\\([^)]*\\b${outerVar}\\b`, "i").test(text) || new RegExp(`\\bcout\\s*<<\\s*${outerVar}\\b`, "i").test(text) || new RegExp(`\\bSystem\\.out\\.print(?:ln)?\\s*\\(?\\s*${outerVar}\\s*\\)?`, "i").test(text) || /\bprint\s*\(\s*(?:i|num|cand|candidate|n)\s*\)/i.test(text) || /\bconsole\.log\s*\(\s*(?:i|num|cand|candidate|n)\s*\)/i.test(text) || /\bprintf\s*\(\s*["'][^"']*["']\s*,\s*(?:i|num|cand|candidate|n)\s*\)/i.test(text);
  const isPrintingLiteralBug = !hasValidCandidatePrint && (/print\s*\(\s*['"]?[a-zA-Z\s_]+['"]?\s*\)/i.test(text) || /printf\s*\(\s*['"][^"']*(?:prime|number|yes)[^"']*['"]\s*\)/i.test(text) || /cout\s*<<\s*['"][^"']*(?:prime|number|yes)[^"']*['"]/i.test(text) || /System\.out\.print(?:ln)?\s*\(\s*['"][^"']*(?:prime|number)[^"']*['"]\s*\)/i.test(text));
  const hasPrint = hasValidCandidatePrint && !isPrintingInnerVar;
  const countDeclIndex = text.search(/\b(?:var|let|const|int)?\s*count\s*=\s*0\b/i);
  const outerForIndex = text.search(/for\s*\(|for\s+[a-zA-Z_]\w*\s+in\s+range/i);
  const hasCountOutsideLoopBug = countDeclIndex !== -1 && outerForIndex !== -1 && countDeclIndex < outerForIndex && !text.slice(outerForIndex).match(/\bcount\s*=\s*0\b/i);
  const hasDivisionBug = /if\s*\(?.*\/.*==\s*0\)?/i.test(text) && !text.includes("%");
  const hasAssignmentInIfBug = /if\s*\(\s*count\s*=\s*2\s*\)/i.test(text) || /if\s*\(?.*%.*=\s*0\)?/i.test(text) && !/==/.test(text);
  const hasInvertedOuterBoundBug = /for\s*\(\s*(?:var|let|const|int)?\s*[a-zA-Z_]\w*\s*=\s*end\s*;\s*[a-zA-Z_]\w*\s*<=\s*start/i.test(text) || /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*end\s*,\s*start\s*\)/i.test(text);
  const step1Complete = hasRangeInputs;
  const step2Complete = step1Complete && hasOuterLoop && !hasInvertedOuterBoundBug;
  const step3Complete = step2Complete && hasCountInitInside && !hasCountOutsideLoopBug;
  const step4Complete = step3Complete && hasInnerLoop && !hasInnerLoopZeroBug && !hasInnerStrictBoundBug;
  const step5Complete = step4Complete && hasModuloCondition && hasCountIncrement && !hasDivisionBug && !hasAssignmentInIfBug;
  const step6Complete = step5Complete && hasPrimeCheck && hasPrint && !isPrintingInnerVar;
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: `Range boundaries (${startVar} = 10, ${endVar} = 20)`,
      completed: step1Complete,
      current: !step1Complete
    },
    {
      stepNumber: 2,
      title: `Outer loop (${outerVar}) from ${startVar} to ${endVar}`,
      completed: step2Complete,
      current: step1Complete && !step2Complete
    },
    {
      stepNumber: 3,
      title: "Reset count = 0 inside outer loop",
      completed: step3Complete,
      current: step2Complete && !step3Complete
    },
    {
      stepNumber: 4,
      title: `Inner loop (${innerVar}) from 1 to ${outerVar}`,
      completed: step4Complete,
      current: step3Complete && !step4Complete
    },
    {
      stepNumber: 5,
      title: `Divisibility test: if (${outerVar} % ${innerVar} == 0) count++`,
      completed: step5Complete,
      current: step4Complete && !step5Complete
    },
    {
      stepNumber: 6,
      title: `Prime decision: if (count == 2) print(${outerVar})`,
      completed: step6Complete,
      current: step5Complete && !step6Complete
    }
  ];
  const getLanguageSnippet = (type) => {
    if (lang === "python") {
      switch (type) {
        case "step1":
          return `start = 10
end = 20`;
        case "step2":
          return `start = 10
end = 20
for ${outerVar} in range(start, end + 1):`;
        case "step3":
          return `for ${outerVar} in range(start, end + 1):
    count = 0`;
        case "step4":
          return `    count = 0
    for ${innerVar} in range(1, ${outerVar} + 1):`;
        case "step5":
          return `        if ${outerVar} % ${innerVar} == 0:
            count += 1`;
        case "step6":
          return `    if count == 2:
        print(${outerVar})`;
        case "full":
          return `start = 10
end = 20

for ${outerVar} in range(start, end + 1):
    count = 0
    for ${innerVar} in range(1, ${outerVar} + 1):
        if ${outerVar} % ${innerVar} == 0:
            count += 1
    if count == 2:
        print(${outerVar})`;
      }
    } else if (lang === "c" || lang === "cpp") {
      const printStmt = lang === "cpp" ? `std::cout << ${outerVar} << " ";` : `printf("%d\\n", ${outerVar});`;
      switch (type) {
        case "step1":
          return `int start = 10, end = 20;`;
        case "step2":
          return `int start = 10, end = 20;
for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {`;
        case "step3":
          return `for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
    int count = 0;`;
        case "step4":
          return `    int count = 0;
    for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {`;
        case "step5":
          return `        if (${outerVar} % ${innerVar} == 0) {
            count++;
        }`;
        case "step6":
          return `    if (count == 2) {
        ${printStmt}
    }`;
        case "full":
          return `int start = 10, end = 20;

for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
    int count = 0;
    for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {
        if (${outerVar} % ${innerVar} == 0) {
            count++;
        }
    }
    if (count == 2) {
        ${printStmt}
    }
}`;
      }
    } else if (lang === "java") {
      switch (type) {
        case "step1":
          return `int start = 10, end = 20;`;
        case "step2":
          return `int start = 10, end = 20;
for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {`;
        case "step3":
          return `for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
    int count = 0;`;
        case "step4":
          return `    int count = 0;
    for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {`;
        case "step5":
          return `        if (${outerVar} % ${innerVar} == 0) {
            count++;
        }`;
        case "step6":
          return `    if (count == 2) {
        System.out.println(${outerVar});
    }`;
        case "full":
          return `int start = 10, end = 20;

for (int ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
    int count = 0;
    for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {
        if (${outerVar} % ${innerVar} == 0) {
            count++;
        }
    }
    if (count == 2) {
        System.out.println(${outerVar});
    }
}`;
      }
    } else {
      switch (type) {
        case "step1":
          return `let start = 10;
let end = 20;`;
        case "step2":
          return `let start = 10;
let end = 20;
for (let ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {`;
        case "step3":
          return `for (let ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
  let count = 0;`;
        case "step4":
          return `  let count = 0;
  for (let ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {`;
        case "step5":
          return `    if (${outerVar} % ${innerVar} === 0) {
      count++;
    }`;
        case "step6":
          return `  if (count === 2) {
    console.log(${outerVar});
  }`;
        case "full":
          return `let start = 10;
let end = 20;

for (let ${outerVar} = start; ${outerVar} <= end; ${outerVar}++) {
  let count = 0;
  for (let ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++) {
    if (${outerVar} % ${innerVar} === 0) {
      count++;
    }
  }
  if (count === 2) {
    console.log(${outerVar});
  }
}`;
      }
    }
  };
  if (step6Complete) {
    const langLabel = lang === "python" ? "Python" : lang === "java" ? "Java" : lang === "cpp" ? "C++" : lang === "c" ? "C" : "JavaScript";
    return {
      allVerified: true,
      sampleCodeStepProgress: sampleCodeStepProgress.map((s) => ({ ...s, completed: true, current: false })),
      feedback: `\u{1F31F} Coach Maara here! Outstanding work! \u{1F389} You have successfully implemented the complete Prime Numbers in a Given Range program in ${langLabel} with range variables, outer range \`for\` loop, inner divisor \`for\` loop, proper divisor counter scoping (\`count = 0\`), divisibility modulo checking, and final prime verification (\`count == 2\`)! Let's code!`,
      matchedFirebaseInput: getLanguageSnippet("full"),
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInnerRangeCopyBug) {
    const loopCorrection = lang === "python" ? `for ${innerVar} in range(1, ${outerVar} + 1):` : `for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++)`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Inner Divisor Loop Alert:
You wrote your second loop from \`${startVar}\` to \`${endVar}\` (${lang === "python" ? `range(${startVar}, ${endVar})` : `for(${innerVar}=${startVar}; ${innerVar}<=${endVar}; ${innerVar}++)`}) which is repeating the outer range bounds!

Remember their distinct roles:
\u2022 **Outer loop (\`${outerVar}\`)**: iterates from \`${startVar}\` to \`${endVar}\` to pick each number in the range.
\u2022 **Inner loop (\`${innerVar}\`)**: tests divisors for the current number \`${outerVar}\`. Divisors must start from \`1\` and go up to \`${outerVar}\`!

\u{1F449} Change your inner loop to: \`${loopCorrection}\``,
      correction: `Step 4: Change inner divisor loop to start from 1 up to ${outerVar}: ${loopCorrection}`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: `for (${innerVar} = ${startVar}; ${innerVar} <= ${endVar}; ${innerVar}++)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInnerSameVarBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Variable Conflict Alert:
Your inner loop reuses the outer loop variable \`${outerVar}\`! Overwriting \`${outerVar}\` inside the inner loop destroys your range iteration state.

\u{1F449} Use a separate variable (like \`${innerVar}\` or \`divisor\`) for your inner loop: \`${lang === "python" ? `for ${innerVar} in range(1, ${outerVar} + 1):` : `for (int ${innerVar} = 1; ${innerVar} <= ${outerVar}; ${innerVar}++)`}\`.`,
      correction: `Step 4: Use a different variable like ${innerVar} for the inner loop.`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: `for (${outerVar} = 1; ${outerVar} <= ${outerVar}; ${outerVar}++)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInnerLoopEndAtRangeBug) {
    const endCorrection = lang === "python" ? `range(1, ${outerVar} + 1)` : `${innerVar} <= ${outerVar}`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Inner Loop Boundary Alert:
Your inner divisor loop goes up to \`${endVar}\` instead of \`${outerVar}\`! When testing if \`${outerVar}\` is prime, you only check divisors up to that specific number (\`${outerVar}\`), not up to the entire range boundary (\`${endVar}\`).

\u{1F449} Change inner loop end condition to: \`${endCorrection}\``,
      correction: `Step 4: End inner divisor loop at ${outerVar}: ${endCorrection}`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: `for (${innerVar} = 1; ${innerVar} <= ${endVar}; ${innerVar}++)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInvertedModuloBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Modulo Condition Alert:
You wrote \`${innerVar} % ${outerVar} == 0\`. In mathematical division, you want to see if the candidate number \`${outerVar}\` is divided by the divisor \`${innerVar}\`!

\u{1F449} Swap the operands: \`${outerVar} % ${innerVar} == 0\`.`,
      correction: `Step 5: Fix modulo condition: ${outerVar} % ${innerVar} == 0`,
      suggestedInput: getLanguageSnippet("step5"),
      matchedFirebaseInput: `if (${innerVar} % ${outerVar} == 0)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition: false,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasCountOutsideLoopBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Scope Alert:
Look at where \`count = 0\` is declared! Because \`count\` is initialized outside the outer loop, it is never reset for each new number. It keeps accumulating divisors across all numbers (e.g. 2 + 4 + 2 = 8), so after the first prime, no other prime will ever match \`count == 2\`!

\u{1F449} Move \`var count = 0;\` (or \`count = 0\`) **INSIDE** the outer \`for\` loop right at the beginning of each iteration.`,
      correction: `Move count = 0 inside the outer for loop to reset per number.`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "var start = 10, end = 20;\nvar count = 0;\nfor (var num = start; num <= end; num++)",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: false,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInnerLoopZeroBug) {
    const startInnerCode = lang === "python" ? `range(1, ${outerVar} + 1)` : `${innerVar} = 1`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Division by Zero Alert:
In your inner divisor loop, \`${innerVar}\` starts at 0! Calculating \`${outerVar} % 0\` causes a runtime Division by Zero crash! Divisors must start from \`1\` (\`${startInnerCode}\`).`,
      correction: `Start inner loop divisor from 1: ${startInnerCode}`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: `for (var ${innerVar} = 0; ${innerVar} <= ${outerVar}; ${innerVar}++)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasInnerStrictBoundBug) {
    const boundCode = lang === "python" ? `range(1, ${outerVar} + 1)` : `${innerVar} <= ${outerVar}`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Boundary Condition Alert:
In your inner divisor loop, stopping at \`< ${outerVar}\` (or \`range(1, ${outerVar})\` in Python) stops before checking if the number divides itself! For every prime number, its divisor count will only reach 1 (from 1) instead of 2. Make sure the inner loop includes the number itself (\`${boundCode}\`).`,
      correction: `Change inner loop boundary to include ${outerVar}: ${boundCode}`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: `for (var ${innerVar} = 1; ${innerVar} < ${outerVar}; ${innerVar}++)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (isPrintingInnerVar) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Variable Output Alert:
You wrote \`print(${innerVar})\`! Notice what your variables represent:
\u2022 \`${innerVar}\` is your inner loop divisor (numbers 1 to ${outerVar} that test for factors).
\u2022 \`${outerVar}\` is your current range number being tested for primality!

When \`count == 2\`, the prime number is \`${outerVar}\`, not the divisor \`${innerVar}\`. Change your print statement to \`print(${outerVar})\`.`,
      correction: `Change print to output ${outerVar}: print(${outerVar}) instead of print(${innerVar}).`,
      suggestedInput: getLanguageSnippet("step6"),
      matchedFirebaseInput: `print(${innerVar})`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint: false,
      detectedLang: lang
    };
  }
  if (isPrintingLiteralBug) {
    const printExample = lang === "python" ? `print(${outerVar})` : lang === "cpp" ? `std::cout << ${outerVar} << " ";` : lang === "c" ? `printf("%d\\n", ${outerVar});` : lang === "java" ? `System.out.println(${outerVar});` : `console.log(${outerVar});`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Print Output Alert:
You wrote \`print(prime number)\`! In this problem, we need to print the actual prime numbers from the range (e.g. 11, 13, 17, 19), not a text message.

Your outer loop candidate variable is \`${outerVar}\`. When \`count == 2\`, print that number variable directly: \`${printExample}\`.`,
      correction: `Step 6: Print the candidate variable ${outerVar}: ${printExample}`,
      suggestedInput: getLanguageSnippet("step6"),
      matchedFirebaseInput: `print(${outerVar})`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint: false,
      detectedLang: lang
    };
  }
  if (hasDivisionBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Operator Alert: You used the division operator \`/\` in \`${outerVar} / ${innerVar} == 0\`. Division gives the quotient. To test if a number divides evenly with zero remainder, use the modulo operator \`%\`: \`${outerVar} % ${innerVar} == 0\`.`,
      correction: `Use modulo operator: ${outerVar} % ${innerVar} == 0`,
      suggestedInput: getLanguageSnippet("step5"),
      matchedFirebaseInput: `if (${outerVar} / ${innerVar} == 0)`,
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition: false,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (hasAssignmentInIfBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F50D} Syntax Alert: In your if condition, \`count = 2\` uses a single \`=\` which is variable assignment! To test for equality, use \`==\` (e.g. \`if (count == 2)\` or \`if count == 2:\`).`,
      correction: `Use equality operator == inside if condition: count == 2`,
      suggestedInput: getLanguageSnippet("step6"),
      matchedFirebaseInput: "if (count = 2)",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck: false,
      hasPrint,
      detectedLang: lang
    };
  }
  if (!step1Complete) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara here! Let's build our Prime Numbers in a Given Range program step by step! First, declare and initialize your range limit variables (e.g. \`start = 10\`, \`end = 20\`).`,
      correction: `Step 1: Declare range limits (start = 10, end = 20).`,
      suggestedInput: getLanguageSnippet("step1"),
      matchedFirebaseInput: "how to start sample code",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (!step2Complete) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Great! You defined your range variables. Next (Step 2), create your outer \`for\` loop to iterate through every number from \`${startVar}\` to \`${endVar}\`.`,
      correction: `Step 2: Add outer for loop from start to end.`,
      suggestedInput: getLanguageSnippet("step2"),
      matchedFirebaseInput: "outer loop for range",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (!step3Complete) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Outer loop ready! Now (Step 3), initialize your divisor counter \`count = 0\` **INSIDE** the outer loop so that each candidate number starts with a fresh counter of 0.`,
      correction: `Step 3: Initialize count = 0 inside outer loop.`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "count = 0 inside outer loop",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: false,
      hasInnerLoop,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (!step4Complete) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Great! Now (Step 4), create your inner \`for\` loop with loop variable \`${innerVar}\` from \`1\` up to \`${outerVar}\` to test all possible divisors.`,
      correction: `Step 4: Add inner loop from 1 to ${outerVar}.`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: "inner divisor loop",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop: false,
      hasModuloCondition,
      hasCountIncrement,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  if (!step5Complete) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Inner loop set! Inside this loop (Step 5), test if \`${innerVar}\` divides \`${outerVar}\` evenly using modulo (\`${outerVar} % ${innerVar} == 0\`) and increment \`count\` (\`count = count + 1\` or \`count++\`).`,
      correction: `Step 5: Add divisibility check: if (${outerVar} % ${innerVar} == 0) count++`,
      suggestedInput: getLanguageSnippet("step5"),
      matchedFirebaseInput: "divisibility check in sample code",
      hasStart,
      hasEnd,
      hasOuterLoop,
      hasCountInit: hasCountInitInside,
      hasInnerLoop,
      hasModuloCondition: false,
      hasCountIncrement: false,
      hasPrimeCheck,
      hasPrint,
      detectedLang: lang
    };
  }
  return {
    allVerified: false,
    sampleCodeStepProgress,
    feedback: `\u{1F31F} Almost there! After the inner loop finishes (Step 6), check if \`count == 2\`. If true, print the prime candidate number (\`print(${outerVar})\`).`,
    correction: `Step 6: Add prime check: if (count == 2) print(${outerVar})`,
    suggestedInput: getLanguageSnippet("step6"),
    matchedFirebaseInput: "prime check print in sample code",
    hasStart,
    hasEnd,
    hasOuterLoop,
    hasCountInit: hasCountInitInside,
    hasInnerLoop,
    hasModuloCondition,
    hasCountIncrement,
    hasPrimeCheck: false,
    hasPrint,
    detectedLang: lang
  };
}
export {
  detectLoopVariables,
  validatePrimeRangeIngredients,
  validatePrimeRangeLogic,
  validatePrimeRangeRecipe,
  validatePrimeRangeSampleCode
};
