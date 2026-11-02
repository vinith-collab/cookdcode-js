/**
 * CTC Pedagogy Validator for Problem 21: "Print Even Numbers from 1 to 50"
 * Focuses on loop iteration from 1 to 50 combined with modulo divisibility by 2 or step of 2.
 */

export function validateEvenNumbers1To50Logic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();

  // Step 1: Range limits (1 to 50)
  const hasStep1Range = (/\b1\b/.test(norm) && /\b50\b/.test(norm)) ||
    /\b1\s*(?:to|-|till|through)\s*50\b/.test(norm) ||
    /\b(?:up\s*to|until|till|limit)\s*50\b/.test(norm) ||
    /\bbetween\s*1\s*and\s*50\b/.test(norm);

  // Step 2: Divisibility by 2 rule
  const hasStep2Divisibility = /\bdivisib(?:le|ility)\s*by\s*2\b/.test(norm) ||
    /\b(?:modulo\s*)?divid(?:e|ed|ing)\b.*?\bby\s*2\b/.test(norm) ||
    /\bby\s*2\b.*?\bdivid(?:e|ed|ing)\b/.test(norm) ||
    /\bmultiple\s*of\s*2\b/.test(norm) ||
    /\b2\s*(?:multiplication\s*)?table\b/.test(norm) ||
    /%\s*2\b/.test(norm) ||
    (/\b2\b/.test(norm) && (/\bdivide\b|\bdivisible\b|\bmodulo\b|\bmultiplication\b/.test(norm)));

  // Step 3: Modulo remainder / leftover test (remainder is 0 or % 2 == 0 or leftover is 0 / no leftover)
  const hasStep3Remainder = /%\s*2\s*==?\s*0\b/.test(norm) ||
    /\b(?:remainder|leftover|left\s*over|balance)\s*(?:is\s*|equals?\s*|==?\s*)?(?:0|zero)\b/.test(norm) ||
    /\b(?:no|zero|0)\s*(?:remainder|leftover|left\s*over|balance)\b/.test(norm) ||
    /\brem\s*(?:0|zero)\b/.test(norm) ||
    ((/\bremainder\b|\bleftover\b|\bleft\s*over\b|\bbalance\b/.test(norm)) && (/\b0\b|\bzero\b|\bno\b/.test(norm)));

  // Step 4: Filter even sequence / examples
  const hasStep4Filter = /\b(?:filter|select|collect|print|display|show|pick|keep|output|identify|find|spot)\b/.test(norm) ||
    /\b(?:2,\s*4,\s*6|2\s+4\s+6|2\s*4\s*6\s*8)\b/.test(norm) ||
    (/\beven\b/.test(norm) && /\bnumbers?\b/.test(norm));

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Range limits (1 to 50)", completed: hasStep1Range, current: !hasStep1Range },
    { stepNumber: 2, title: "2. Divisibility by 2 rule", completed: hasStep2Divisibility, current: hasStep1Range && !hasStep2Divisibility },
    { stepNumber: 3, title: "3. Modulo remainder test", completed: hasStep3Remainder, current: hasStep1Range && hasStep2Divisibility && !hasStep3Remainder },
    { stepNumber: 4, title: "4. Filter even sequence", completed: hasStep4Filter, current: hasStep1Range && hasStep2Divisibility && hasStep3Remainder && !hasStep4Filter }
  ];

  const completedStepsCount = [hasStep1Range, hasStep2Divisibility, hasStep3Remainder, hasStep4Filter].filter(Boolean).length;
  const isFullyVerified = hasStep1Range && hasStep2Divisibility && hasStep3Remainder;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      logicStepProgress,
      feedback: "🎉 **Logic Approved by Coach Maara!** 🏆\nExcellent understanding! Even numbers leave remainder 0 when divided by 2 (`number % 2 == 0`). You have correctly identified the rule and the target range 1 to 50.\n\nProceed to Stage 2: Recipe!",
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "even numbers leave remainder 0 when divided by 2"
    };
  }

  // 1. Detect if student is asking an unresolved conversational question
  const isQuestion = norm.endsWith("?") ||
    /\b(?:how|what|why|help|puriyala|theriyala|doubt|explain|start|where)\b/i.test(norm);

  // If question or incomplete input
  if (isQuestion || norm.length < 5) {
    if (attemptCount >= 4) {
      const advancedHints = [
        "🌟 Coach Maara here! You are making steady progress building your logic.\nTo identify even numbers between 1 and 50, remember the remainder rule when dividing by 2.\nWhen any even number is divided by 2, what remainder is left over? (Think about number % 2).\nDescribe this remainder check for numbers from 1 to 50 in your worksheet!",
        "🌟 Coach Maara cheering you on! Let's think through our 2 key logic ingredients together.\nFirst, we need to inspect all numbers across our range from 1 up to 50.\nSecond, an even number leaves remainder 0 whenever it is divided by 2 (`number % 2 == 0`).\nHow would you combine the range and remainder test into a clear sentence in your worksheet?",
        "🌟 Coach Maara with a fresh perspective! Think of this as filtering numbers from 1 to 50.\nEvery number between 1 and 50 that divides evenly by 2 is an even number.\nIn programming logic, we test this using the modulo operation: `number % 2 == 0`.\nCan you write down this rule in your worksheet to complete this stage?"
      ];
      const hintIndex = (attemptCount - 4) % advancedHints.length;
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: advancedHints[hintIndex],
        correction: "Write: An even number leaves remainder 0 when divided by 2 (number % 2 == 0). From 1 to 50, even numbers are 2, 4, 6 ... up to 50.",
        suggestedInput: "An even number is completely divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.",
        matchedFirebaseInput: "what are even numbers from 1 to 50"
      };
    }
    if (attemptCount === 3) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara with a direct hint! In programming, we test divisibility using the modulo operator `%`. For even numbers, `number % 2 == 0`. Write down this rule for numbers from 1 to 50 in your worksheet!",
        correction: "Explain using modulo 2: 'number % 2 == 0' for range 1 to 50.",
        suggestedInput: "An even number is completely divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.",
        matchedFirebaseInput: "what are even numbers from 1 to 50"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! To find even numbers between 1 and 50, we test each number by dividing by 2. If remainder is 0 (`number % 2 == 0`), it is an even number (like 2, 4, 6...). What rule can you write in your worksheet to describe this?",
        correction: "Explain using modulo 2: 'number % 2 == 0'.",
        suggestedInput: "An even number leaves remainder 0 when divided by 2 (number % 2 == 0). Between 1 and 50, numbers like 2, 4, 6 ... 50 are even numbers.",
        matchedFirebaseInput: "how to identify even numbers"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara here! Even numbers are numbers exactly divisible by 2 (leaving a remainder of 0: `number % 2 == 0`). Between 1 and 50, the even numbers are 2, 4, 6, 8, ... up to 50!\n\n👉 Explain in simple words: How do we identify even numbers from 1 to 50?",
      correction: "Even numbers leave remainder 0 when divided by 2 (n % 2 == 0). From 1 to 50, we check each number and print if remainder is 0.",
      suggestedInput: "An even number is completely divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.",
      matchedFirebaseInput: "what are even numbers from 1 to 50"
    };
  }

  // If student only provided sample numbers (e.g. "2,4,6,8 are even numbers")
  if (!hasStep1Range && hasStep4Filter && !hasStep3Remainder) {
    if (attemptCount >= 3) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara here! You've listed examples (`2, 4, 6, 8`), now add the general rule: 'From 1 to 50, a number is even if dividing by 2 leaves remainder 0 (number % 2 == 0).' Type this to complete the stage!",
        correction: "State the mathematical formula: number % 2 == 0 for range 1 to 50.",
        suggestedInput: "An even number leaves remainder 0 when divided by 2 (number % 2 == 0). From 1 to 50, numbers like 2, 4, 6 ... 50 are even.",
        matchedFirebaseInput: "2 4 6 8 are even numbers without range or formula"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! Listing examples like `2, 4, 6, 8` is a great observation, but the computer needs the general mathematical rule for all numbers from **1 to 50**!\n\nState in your worksheet: A number is even if dividing by 2 leaves remainder 0 (`number % 2 == 0`) for the range 1 to 50.",
        correction: "State the mathematical formula: number % 2 == 0 for range 1 to 50.",
        suggestedInput: "An even number leaves remainder 0 when divided by 2 (number % 2 == 0). From 1 to 50, numbers like 2, 4, 6 ... 50 are even.",
        matchedFirebaseInput: "2 4 6 8 are even numbers without range or formula"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You've correctly spotted even numbers like `2, 4, 6, 8`! 👏\n\nHowever, our challenge is to identify all even numbers from **1 to 50** using computer logic. To complete Stage 1:\n1. State our range: **1 to 50**.\n2. State the mathematical test: A number is even if dividing by 2 leaves a remainder of 0 (`number % 2 == 0`).",
      correction: "Add range 1 to 50 and remainder rule: 'number % 2 == 0'.",
      suggestedInput: "An even number is divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.",
      matchedFirebaseInput: "2 4 6 8 are even numbers without range or formula"
    };
  }

  // If missing range or remainder rule
  if (!hasStep1Range) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: Great formula! Now, make sure to specify our target range: we need to test numbers from **1 to 50**.",
      correction: "Mention the range 1 to 50 in your worksheet.",
      suggestedInput: "From 1 to 50, a number is even if number % 2 == 0.",
      matchedFirebaseInput: "even number formula without range 1 to 50"
    };
  }

  if (!hasStep2Divisibility || !hasStep3Remainder) {
    if (attemptCount >= 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara with a fresh clue! Remember the core mathematical test: dividing by 2 leaves remainder 0 (`number % 2 == 0`). State this formula and mention the range 1 to 50 in your worksheet!",
        correction: "State the mathematical formula: number % 2 == 0 for range 1 to 50.",
        suggestedInput: "An even number leaves remainder 0 when divided by 2 (number % 2 == 0). From 1 to 50, numbers like 2, 4, 6 ... 50 are even.",
        matchedFirebaseInput: "how to identify even numbers"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: Remember, a number is even if dividing by 2 leaves a remainder of 0 (`number % 2 == 0`). How do we apply this rule to numbers from 1 to 50?",
      correction: "Define even numbers using remainder 0 with 2: 'number % 2 == 0'.",
      suggestedInput: "A number is even if number % 2 == 0. From 1 to 50, numbers like 2, 4, 6 ... 50 are even numbers.",
      matchedFirebaseInput: "how to identify even numbers"
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: `🌟 Coach Maara here! You have completed ${completedStepsCount} of 4 logic steps. Make sure to define: 1) Range 1 to 50, 2) Divisible by 2, 3) Remainder equals 0 (number % 2 == 0).`,
    correction: "Explain the range 1 to 50 and the even condition number % 2 == 0.",
    suggestedInput: "From 1 to 50, a number is even if dividing by 2 leaves remainder 0 (number % 2 == 0)."
  };
}

export function validateEvenNumbers1To50Recipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();

  // Recipe steps:
  // 1. Loop / Count from 1 to 50
  // 2. Check if number is divisible by 2 (or count by 2s)
  // 3. Print / Display the even number
  // 4. Repeat until reaching 50
  const hasStep1 = (norm.includes("1") && (norm.includes("50") || norm.includes("start") || norm.includes("count") || norm.includes("from 1"))) ||
    /\b(?:start|count|range)\b.*?\b(?:1\s*(?:to|-)\s*50|50)\b/.test(norm);
  const hasStep2 = /\bdivisib(?:le|ility)\s*by\s*2\b/.test(norm) ||
    /\bdivid(?:e|ed|ing)\b.*?\bby\s*2\b/.test(norm) ||
    /\bby\s*2\b.*?\bdivid(?:e|ed|ing)\b/.test(norm) ||
    /\bremainder\s*(?:is\s*|equals?\s*|==?\s*)?(?:0|zero)\b/.test(norm) ||
    /\bleftover\s*(?:is\s*|equals?\s*|==?\s*)?(?:0|zero)\b/.test(norm) ||
    /\b(?:no|zero)\s*(?:remainder|leftover)\b/.test(norm) ||
    /%\s*2\b/.test(norm) ||
    norm.includes("step of 2") ||
    norm.includes("add 2") ||
    (norm.includes("check") && (norm.includes("even") || norm.includes("2")));
  const hasStep3 = norm.includes("display") || norm.includes("print") || norm.includes("show") || norm.includes("output") || norm.includes("announce");
  const hasStep4 = norm.includes("repeat") || norm.includes("next") || norm.includes("continue") || norm.includes("until 50") || norm.includes("till 50");

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Start counting from 1 up to 50", completed: Boolean(hasStep1), current: !hasStep1 },
    { stepNumber: 2, title: "2. Check if current number is divisible by 2", completed: Boolean(hasStep2), current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. Display the number if it is even", completed: Boolean(hasStep3), current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Repeat until reaching 50", completed: Boolean(hasStep4), current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 }
  ];

  const hasPlaceholders = (text || "").toLowerCase().includes("not found in your notes") || (text || "").toLowerCase().includes("please write this step");
  const isFullyVerified = hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasPlaceholders;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback: "🎉 **Recipe Verified!** Excellent sequence! You have clearly outlined counting from 1 to 50, checking for divisibility by 2, and displaying the even numbers. Proceed to Stage 3: Ingredients!",
      correction: "Proceed to Stage 3: Ingredients to identify the loop and condition components.",
      suggestedInput: void 0,
      matchedFirebaseInput: "recipe for even numbers from 1 to 50"
    };
  }

  // Socratic Step-by-Step Guidance: Guide ONLY the immediate next step without spoiling all steps!
  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (!hasStep1) {
    feedback = "🌟 Coach Maara here! Let's start our recipe with Step 1: How do we begin our counting sequence? (e.g. Start counting numbers from 1 up to 50).";
    correction = "Write Step 1: Start counting numbers from 1 up to 50.";
    suggestedInput = "Step 1: Start counting numbers from 1 up to 50";
  } else if (!hasStep2) {
    feedback = "🌟 Coach Maara here! Step 1 looks solid! 👏 Now for Step 2: For each number, what condition checks if the number is an even number? (e.g. Check if the number is divisible by 2 with remainder 0).";
    correction = "Write Step 2: Check if current number is divisible by 2 (remainder 0).";
    suggestedInput = "Step 2: Check if current number is divisible by 2 (remainder 0)";
  } else if (!hasStep3) {
    feedback = "🌟 Coach Maara here! Great progress on Step 1 and Step 2! 👏 Now for Step 3: When a number is divisible by 2, what action should our recipe take to announce or show it?";
    correction = "Write Step 3: If divisible by 2, display or print the number.";
    suggestedInput = "Step 3: If divisible by 2, display the number";
  } else {
    feedback = "🌟 Coach Maara here! Almost done! 👏 For Step 4: After checking and displaying the current number, what instruction repeats this process for the next numbers until we reach 50?";
    correction = "Write Step 4: Repeat for all numbers until reaching 50.";
    suggestedInput = "Step 4: Repeat until reaching 50";
  }

  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: "how to write recipe for even numbers 1 to 50"
  };
}

export function validateEvenNumbers1To50Ingredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();

  // Strip worksheet step labels ("Step 1:", "Step 2:", etc.) at line starts so they are not confused with loop steps
  const withoutStepHeaders = norm.replace(/(?:^|\n)\s*step\s*\d+\s*[:\-]/gi, "\n");

  const hasLoopKeyword = /\b(?:for\s*loop|while\s*loop|for\s*\(|while\s*\(|for\s+\w+\s+in|\bloop\b)/i.test(norm);

  // Check Start: must define start value (1 or 2) or range starting at 1
  const hasLoopStart = /\bstart\s*[:=\s]\s*\(?\s*(?:(?:variable|var|counter|let|int)\s*)?(?:[a-zA-Z_]\w*\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*)?[12]\b/i.test(withoutStepHeaders) ||
    /\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*(?:(?:variable|var|counter|let|int)\s*)?(?:[a-zA-Z_]\w*\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*)?[12]\b/i.test(withoutStepHeaders) ||
    /\b[a-zA-Z_]\w*\s*=\s*[12]\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,/i.test(withoutStepHeaders) ||
    /\b[12]\s*(?:to|-)\s*50\b/i.test(withoutStepHeaders);

  // Check Stop: must define limit up to 50
  const hasLoopStop = /\bstop\s*[:=\s]\s*\(?\s*(?:i\s*<=?\s*)?50\b/i.test(withoutStepHeaders) ||
    /\b(?:up\s*to|to|till|until|limit|end\s*(?:at|:|\s))\s*50\b/i.test(withoutStepHeaders) ||
    /\bi\s*<=?\s*50\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,\s*5[01]\b/i.test(withoutStepHeaders) ||
    /\b[12]\s*(?:to|-)\s*50\b/i.test(withoutStepHeaders);

  // Check Step: must define increment (+1 or +2 or i++ or i+=2), or default +1 when loop covers range 1 to 50
  const hasExplicitLoopStep = /\b(?:next\s*step|step)\s*[:=\s]\s*\(?\s*\+?[12]\b/i.test(withoutStepHeaders) ||
    /\bi\+\+/i.test(withoutStepHeaders) ||
    /\bi\s*\+=\s*[12]\b/i.test(withoutStepHeaders) ||
    /\bstep\s*\(\s*\+?[12]\s*\)/i.test(withoutStepHeaders) ||
    /\bincrement\s*by\s*[12]\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,\s*5[01]\s*,\s*[12]\s*\)/i.test(withoutStepHeaders);

  const hasRange1To50 = /\b[12]\s*(?:to|-)\s*50\b/i.test(norm) || (hasLoopStart && hasLoopStop);
  const hasLoopStep = hasExplicitLoopStep || hasRange1To50;

  // Extract loop variable name (e.g. i = 1, start: i = 1, variable i starts at 1, for loop(i), for (let i = 1...))
  const loopVarMatch = withoutStepHeaders.match(/\bstart\s*[:=\s]\s*(?:(?:variable|var|counter|let|int)\s*)?([a-zA-Z_]\w*)\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*[12]\b/i) ||
    withoutStepHeaders.match(/\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*(?:(?:variable|var|counter|let|int)\s*)?([a-zA-Z_]\w*)\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*[12]\b/i) ||
    withoutStepHeaders.match(/\bfor\s*\(\s*(?:let|var|int)?\s*([a-zA-Z_]\w*)\s*=/i) ||
    withoutStepHeaders.match(/\bfor\s+([a-zA-Z_]\w*)\s+in\b/i) ||
    withoutStepHeaders.match(/\bfor\s*loop\s*\(\s*([a-zA-Z_]\w*)\s*\)/i) ||
    withoutStepHeaders.match(/\b(?:loop\s*)?variable\s*[:=]?\s*([a-zA-Z_]\w*)/i) ||
    withoutStepHeaders.match(/\bcounter\s*[:=]?\s*([a-zA-Z_]\w*)/i) ||
    withoutStepHeaders.match(/\b([a-zA-Z_]\w*)\s*=\s*[12]\b/i);

  const reservedWords = ["for", "loop", "start", "stop", "end", "step", "next", "to", "from", "use", "let", "var", "int", "with", "range", "up", "the", "a", "an", "is", "at"];
  const rawVar = loopVarMatch ? loopVarMatch[1].trim() : null;
  const loopVar = (rawVar && !reservedWords.includes(rawVar.toLowerCase())) ? rawVar : null;
  const hasLoopVar = Boolean(loopVar);
  const varName = loopVar || "i";

  const hasCompleteLoop = hasLoopKeyword && hasRange1To50 && hasLoopVar;

  // Check if condition (left side: i % 2, op: ==, right side: 0)
  const hasIfCondition = /\bif\b/i.test(norm) || /\bcondition\b/i.test(norm) || /\bcheck\b/i.test(norm);
  const hasMod2 = /%\s*2\b/i.test(norm) || /divide\s*by\s*2/i.test(norm) || /divisible\s*by\s*2/i.test(norm) || /remainder/i.test(norm) || /leftover/i.test(norm);
  const hasEqualsZero = /==\s*0\b/i.test(norm) || /=\s*0\b/i.test(norm) || /right\s*side\s*[:=]?\s*0\b/i.test(norm) || /remainder\s*(?:is|==|=)?\s*0\b/i.test(norm) || /leftover\s*(?:is|==|=)?\s*0\b/i.test(norm) || /zero/i.test(norm);

  const hasStepBy2Shortcut = hasExplicitLoopStep && (/step\s*[:=\s]\s*\(?\s*\+?2\b/i.test(withoutStepHeaders) || /\bi\s*\+=\s*2\b/i.test(withoutStepHeaders) || /step\s*\(\s*\+?2\s*\)/i.test(withoutStepHeaders));

  // Print statement
  const hasPrint = /\b(?:print|display|console\.log|show|output|write)\b/i.test(norm);

  const hasEvenCheck = (hasIfCondition && (hasMod2 || hasEqualsZero)) || (hasMod2 && hasEqualsZero) || hasStepBy2Shortcut || /i\s*%\s*2\s*==\s*0/i.test(norm) || new RegExp(`(?:${varName}|[a-zA-Z_]\\w*)\\s*%\\s*2\\s*(?:==|!=)\\s*[01]`, "i").test(norm);

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. For loop to iterate from 1 up to 50", completed: hasCompleteLoop, current: !hasCompleteLoop },
    { stepNumber: 2, title: "2. If condition to check if number is even", completed: Boolean(hasEvenCheck), current: hasCompleteLoop && !hasEvenCheck },
    { stepNumber: 3, title: "3. Print statement inside loop to print the even number", completed: Boolean(hasPrint), current: hasCompleteLoop && hasEvenCheck && !hasPrint }
  ];

  if (!hasLoopVar && (hasLoopKeyword || hasRange1To50)) {
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasEvenCheck,
      hasPrint,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. For loop with counter variable (e.g. start: i = 1)", completed: false, current: true },
        { stepNumber: 2, title: "2. If condition to check if number is even", completed: false, current: false },
        { stepNumber: 3, title: "3. Print statement inside loop to print the even number", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! You've set up your loop range from 1 to 50 with step +1, which is great! 👏\nHowever, every loop needs a **counter variable name** (such as `i`, `num`, or `count`) to hold each number as we count.\nPlease give your starting step a variable name, for example: `start: i = 1` (or `variable i starts at 1`).",
      correction: "Assign a variable name to your loop counter in Step 1 (e.g. 'start: i = 1' or 'variable i = 1').",
      suggestedInput: "Step 1: For loop with Start: i = 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "loop without variable name"
    };
  }

  // If user only wrote "for loop" or didn't provide complete loop controls:
  if (!hasCompleteLoop) {
    const loopHints = [
      "🌟 Coach Maara here! To inspect numbers from 1 to 50, our first ingredient is a **Counting Loop**.\nEvery counting loop needs a **counter variable** and 3 essential loop controls:\n1. Variable name and start value (e.g. `start: i = 1`)\n2. Stop value / limit (e.g. `stop: 50`)\n3. Step increment (e.g. `step: +1`)\nHow would you describe these controls for a For loop with a variable in your worksheet?",
      "🌟 Coach Maara checking back! For a For loop from 1 to 50, specify a variable name and the loop controls clearly in your worksheet:\n• **Start:** Assign a variable name starting at 1 (e.g. `start: i = 1` or `variable i = 1`)\n• **Stop:** What is our upper limit? (e.g. `stop: 50`)\n• **Step:** How much do we increase on each iteration? (e.g. `step: +1`)\nTry defining your For loop with a variable name and these controls!",
      "🌟 Coach Maara encouraging you! We need a counting loop with a variable covering our range.\nIn your worksheet, specify a variable name like `i`, the start (1), stop (50), and step (+1) for your For loop.\nTry writing: `Step 1: For loop from 1 to 50 with Start: i = 1, Stop: 50, Step: +1`."
    ];
    const loopIndex = Math.max(0, attemptCount - 1) % loopHints.length;
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasEvenCheck,
      hasPrint,
      ingredientsStepProgress,
      feedback: loopHints[loopIndex],
      correction: "Define loop with a variable name: 'Step 1: For loop with Start: i = 1, Stop: 50, Step: +1'.",
      suggestedInput: "Step 1: For loop with Start: i = 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "for loop without start stop step"
    };
  }

  if (!hasEvenCheck && !hasStepBy2Shortcut) {
    const evenHints = [
      `🌟 Coach Maara here! Your counting loop with variable \`${varName}\` is ready! 👏 Now we need Ingredient 2: A decision step to filter the even numbers.\nIn our Logic stage, how did we determine whether a counting number is even?\nThink about what condition or remainder check on \`${varName}\` we need inside our loop to identify even numbers!`,
      `🌟 Coach Maara checking back! In programming, we check remainders using the modulo operator (\`%\`).\nTo test if our counter \`${varName}\` is an even number:\n• What mathematical expression calculates the remainder when \`${varName}\` is divided by 2?\n• What remainder value indicates that a number is evenly divisible by 2?\nTry framing an **If condition** with your Left Side, Operator, and Right Side!`,
      `🌟 Coach Maara encouraging you! Every even number leaves a remainder of 0 when divided by 2.\nSet up your Ingredient 2 structure:\n• **Left Side:** remainder expression of \`${varName}\` divided by 2\n• **Operator:** comparison operator for equality (\`==\`)\n• **Right Side:** the expected remainder for an even number (\`0\`)\nWhat rule will you write in your worksheet?`,
      `🌟 Coach Maara with a direct tip! To filter even numbers inside the loop, check if dividing \`${varName}\` by 2 leaves remainder 0:\n\`Step 2: If condition with Left Side: ${varName} % 2, Operator: ==, Right Side: 0\`.`
    ];
    const evenIndex = Math.max(0, attemptCount - 1) % evenHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: false,
      hasPrint,
      ingredientsStepProgress,
      feedback: evenHints[evenIndex],
      correction: `Add an if condition comparing the remainder of dividing ${varName} by 2.`,
      suggestedInput: `Step 2: If condition with Left Side: ${varName} % 2, Operator: ==, Right Side: 0`,
      matchedFirebaseInput: "step 2 : if condition for even numbers"
    };
  }

  if (!hasPrint) {
    const printHints = [
      `🌟 Coach Maara here! Loop and even check are in place! 👏 Now, what action should happen when \`${varName}\` is found to be even?\nWhat statement outputs the current number \`${varName}\` to the screen?`,
      `🌟 Coach Maara checking back! When our even condition succeeds, we need to show that number.\nIn your worksheet, write an output instruction (like \`print\`) inside the if block to display \`${varName}\`!`,
      `🌟 Coach Maara encouraging you! Wrap up Ingredient 3 by outputting the verified even number: \`Step 3: Inside if block: print(${varName})\`.`
    ];
    const printIndex = Math.max(0, attemptCount - 1) % printHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: true,
      hasPrint: false,
      ingredientsStepProgress,
      feedback: printHints[printIndex],
      correction: `Add print statement: 'Step 3: Inside if block: print(${varName})'.`,
      suggestedInput: `Step 3: Inside if block: print(${varName})`,
      matchedFirebaseInput: "step 3 : print the even number"
    };
  }

  return {
    isFullyVerified: true,
    hasLoop: true,
    hasEvenCheck: true,
    hasPrint: true,
    ingredientsStepProgress: [
      { stepNumber: 1, title: "1. For loop with Start: 1 (or 2), Stop: 50 (i <= 50), Step: +1 (or +2)", completed: true, current: false },
      { stepNumber: 2, title: "2. If condition (Left Side: i % 2, Operator: ==, Right Side: 0)", completed: true, current: false },
      { stepNumber: 3, title: "3. Print statement inside loop to print the even number", completed: true, current: false }
    ],
    feedback: "🎉 **Ingredients Verified!** 🏆 Brilliant work! You have gathered all necessary ingredients: the loop from 1 to 50, the even divisibility check (`i % 2 == 0`), and the print statement inside the loop. Proceed to Stage 4: Taste the Sample!",
    correction: "Proceed to Stage 4: Taste the Sample to assemble your verified ingredients into working code.",
    suggestedInput: void 0,
    matchedFirebaseInput: "ingredients for even numbers 1 to 50 verified"
  };
}

export function validateEvenNumbers1To50SampleCode(code, attemptCount = 1) {
  if (!code || typeof code !== "string" || code.trim().length < 5) {
    const emptySteps = [
      { stepNumber: 1, title: "1. Setup for loop 1 to 50", completed: false, current: true },
      { stepNumber: 2, title: "2. Check if i % 2 == 0", completed: false, current: false },
      { stepNumber: 3, title: "3. Print even integer", completed: false, current: false },
      { stepNumber: 4, title: "4. Verify output 2 to 50", completed: false, current: false }
    ];
    return {
      isFullyVerified: false,
      sampleCodeStepProgress: emptySteps,
      feedback: "🌟 Coach Maara note: Welcome to Taste the Sample! Let's assemble our verified ingredients into working code. Start by writing the counting loop from 1 to 50!",
      correction: "Write a for loop from 1 to 50 in your editor."
    };
  }

  const norm = code.toLowerCase().trim();

  // 1. Detect conversational questions mixed into code editor
  const hasQuestion = /\b(?:how\s*to|what\s*is|how\s*do|why|help|puriyala|theriyala)\b/i.test(norm) ||
    /^(?:how|what|why|can\s*i)\b/i.test(norm) ||
    norm.includes("?");

  // 2. Loop detection
  const hasLoop = /\b(?:for\s*\(|while\s*\(|for\s+\w+\s+in|\bfor\b|\bwhile\b)/i.test(norm);
  const has50 = /\b50\b/.test(norm) || /\b51\b/.test(norm);
  const hasValidLoop = hasLoop && has50;

  // Detect loop variable (e.g. "for (var i = 1" -> "i", "for i in range" -> "i", "for (let num = 1" -> "num")
  const loopVarMatch = code.match(/for\s*(?:\(\s*(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*(?:=|in|<=)/i) ||
    code.match(/while\s*\(\s*([a-zA-Z_]\w*)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : "i";

  // Step increment shortcut: for (...; i += 2) or range(2, 51, 2)
  const hasStep2 = /\+=\s*2\b/.test(norm) || /,\s*2\s*\)/.test(norm);

  // 3. Condition detection
  const hasIfKeyword = /\bif\b/i.test(norm);
  const hasMod2 = /%\s*2\b/.test(norm);
  const hasEqualsZero = /==\s*0\b/.test(norm) || /===\s*0\b/.test(norm) || /=\s*0\b/.test(norm);
  const hasConditionWithoutIf = !hasIfKeyword && (/% 2\s*==\s*0/.test(norm) || /%\s*2\s*==/.test(norm) || /%\s*2\s*=/.test(norm));
  const hasSingleEqual = hasIfKeyword && /%\s*2\s*=\s*0\b/.test(norm);

  const hasValidCondition = (hasIfKeyword && hasMod2 && hasEqualsZero) || hasStep2;

  // 4. Print detection
  const hasPrint = /\b(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<)\b/i.test(norm);
  const printsStringOrText = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?`, "i").test(norm);
  const printsLoopVar = (new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*${loopVar}\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*${loopVar}\\b`, "i").test(norm)) && !printsStringOrText;

  // Track progress
  const step1Done = hasValidLoop;
  const step2Done = step1Done && hasValidCondition;
  const step3Done = step2Done && printsLoopVar;
  const step4Done = step3Done && !hasQuestion;

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: "1. Setup for loop 1 to 50", completed: step1Done, current: !step1Done },
    { stepNumber: 2, title: `2. Check if ${loopVar} % 2 == 0`, completed: step2Done, current: step1Done && !step2Done },
    { stepNumber: 3, title: "3. Print even integer", completed: step3Done, current: step2Done && !step3Done },
    { stepNumber: 4, title: "4. Verify output 2 to 50", completed: step4Done, current: step3Done && !step4Done }
  ];

  // Check for plain English notes in code editor
  const hasPlainEnglishNotes = /\b(?:step\s*\d|use\s*for\s*loop|start\s*[:=]|stop\s*[:=]|next\s*step)\b/i.test(norm) &&
    !code.includes("for (") && !code.includes("for(") && !code.includes("for var");

  // Check for mismatched/unclosed braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  const hasUnclosedBrace = openBraces > closeBraces && (hasLoop || hasIfKeyword);

  // STRICT SINGLE-STEP SOCRATIC GUIDANCE & SYNTAX EXAMPLES:
  // If user asks questions or asks for syntax in editor:
  if (hasQuestion || /\bsyntax\b/i.test(norm)) {
    let specificSyntaxExample = "";
    if (/if|condition|check|modulo|%/i.test(norm) || (step1Done && !step2Done)) {
      specificSyntaxExample = `\n\n📝 **If Condition Syntax Example:**
\`\`\`javascript
if (${loopVar} % 2 == 0) {
    // action when number is even
}
\`\`\`
• **Left Side (\`${loopVar} % 2\`):** Computes remainder when dividing by 2.
• **Operator (\`==\`):** Comparison operator for equality.
• **Right Side (\`0\`):** Expected remainder for an even number.
• **Condition Structure:** \`if (Left Side Operator Right Side)\` ➔ \`if (${loopVar} % 2 == 0)\`
• **Braces (\`{ ... }\`):** Enclose the action to take when the condition is met!`;
    } else if (/print|display|output|show/i.test(norm) || (step2Done && !step3Done)) {
      specificSyntaxExample = `\n\n📝 **Print Output Syntax Example:**
\`\`\`javascript
print(${loopVar});
// or in JavaScript:
console.log(${loopVar});
\`\`\`
• Displays the even number stored in variable \`${loopVar}\`.`;
    } else if (/for|loop/i.test(norm) || !step1Done) {
      specificSyntaxExample = `\n\n📝 **For Loop Syntax Example:**
\`\`\`javascript
for (var i = 1; i <= 50; i++) {
    // your code inside the loop
}
\`\`\`
• **Start:** \`var i = 1;\` (initializes counter variable \`i\` to 1)
• **Stop:** \`i <= 50;\` (runs while \`i\` is less than or equal to 50)
• **Step:** \`i++\` (increases \`i\` by 1 each round)`;
    } else {
      specificSyntaxExample = `\n\n📝 **Complete Prototype Syntax Example:**
\`\`\`javascript
for (var i = 1; i <= 50; i++) {
    if (i % 2 == 0) {
        print(i);
    }
}
\`\`\``;
    }

    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara here! Here is the example syntax to guide you:${specificSyntaxExample}\n\n💡 *Note: Type this clean syntax in your editor and remove any question lines before clicking Verify & Run!*`,
      correction: "Write your code using the example syntax provided."
    };
  }

  // If user wrote plain English notes instead of code syntax:
  if (hasPlainEnglishNotes) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara syntax tip: You've written plain English notes in the code editor!
In Taste the Sample, we convert those ingredient notes into real programming syntax.

📝 **Convert your loop note into syntax:**
Instead of: \`step 1: use for loop start: 1, end: 50\`
Write:
\`\`\`javascript
for (var i = 1; i <= 50; i++) {
    // code inside loop
}
\`\`\`
Replace your plain English notes with this syntax in your editor!`,
      correction: "Convert plain English notes into JavaScript syntax: for (var i = 1; i <= 50; i++) {"
    };
  }

  // If user has unclosed curly braces:
  if (hasUnclosedBrace && (step1Done || step2Done)) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara syntax alert: You have unclosed curly braces \`{\`!
Every opening brace \`{\` must have a matching closing brace \`}\`.

📝 **Check your closing braces:**
\`\`\`javascript
for (var i = 1; i <= 50; i++) {
    if (${loopVar} % 2 == 0) {
        print(${loopVar});
    } // closes if block
} // closes for loop
\`\`\`
Add the missing closing brace \`}\` to fix your syntax!`,
      correction: "Add closing curly brace '}' to close your loop or if block."
    };
  }

  // STEP 1 GUIDANCE: If loop is missing or incomplete
  if (!step1Done) {
    const loopHints = [
      "🌟 Coach Maara note: Let's begin with Step 1! What loop construct will count through all numbers starting from 1 up to 50?",
      "🌟 Coach Maara checking back! Set up your `for` loop with: Start: 1, Stop: 50 (`i <= 50`), Step: `i++`. Write your loop header to start!",
      "🌟 Coach Maara with a fresh tip! In your code editor, write a counting loop header: `for (var i = 1; i <= 50; i++) {`. That gives us our range 1 to 50!",
      "🌟 Coach Maara encouraging you! Every journey starts with the first step. Write your loop from 1 up to 50 to complete Step 1!"
    ];
    const hintIdx = Math.max(0, attemptCount - 1) % loopHints.length;
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: loopHints[hintIdx],
      correction: "Write the loop header iterating from 1 to 50."
    };
  }

  // STEP 2 GUIDANCE: If condition is missing or incorrect
  if (!step2Done) {
    if (hasConditionWithoutIf) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: You wrote \`${loopVar} % 2 == 0 {\` with the \`==\` operator, which is great thinking! But in programming, a conditional decision requires the \`if\` keyword. Wrap your condition in \`if (...)\`: \`if (${loopVar} % 2 == 0) {\`.`,
        correction: `Change '${loopVar} % 2 == 0 {' to 'if (${loopVar} % 2 == 0) {'.`
      };
    }
    if (hasSingleEqual) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look closely at your comparison! You wrote a single \`=\` (\`${loopVar} % 2 = 0\`). In programming, \`=\` is for assignment, while \`==\` compares values. Update to: \`if (${loopVar} % 2 == 0) {\`.`,
        correction: `Use '==' instead of '=': 'if (${loopVar} % 2 == 0) {'.`
      };
    }
    const condHints = [
      `🌟 Coach Maara note: Loop from 1 to 50 is set! Now for Step 2: Inside the loop, how do we test if \`${loopVar}\` is an even number using the modulo operator \`%\`?`,
      `🌟 Coach Maara checking back! Inside your loop, check if dividing by 2 leaves remainder 0: write an \`if\` condition with \`${loopVar} % 2 == 0\`.`,
      `🌟 Coach Maara with a fresh tip! Add your decision block inside the loop: \`if (${loopVar} % 2 == 0) {\`. What action should run when this condition is true?`,
      `🌟 Coach Maara encouraging you! We need to filter only even numbers. Write: \`if (${loopVar} % 2 == 0) {\` inside your loop body.`
    ];
    const condIdx = Math.max(0, attemptCount - 1) % condHints.length;
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: condHints[condIdx],
      correction: `Add the condition: 'if (${loopVar} % 2 == 0) {'.`
    };
  }

  // STEP 3 GUIDANCE: If print is missing or wrong
  if (!step3Done) {
    if (printsStringOrText) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: In your print statement, you wrote text ('even number') instead of the number itself! Print the loop variable \`${loopVar}\` so the program actually outputs 2, 4, 6...: \`print(${loopVar});\`.`,
        correction: `Change print target to the loop variable: 'print(${loopVar})'.`
      };
    }
    const printedVarMatch = norm.match(/(?:print|println|printf|console\.log)\s*\(\s*([a-zA-Z_]\w*)\s*\)/i);
    const printedVar = printedVarMatch ? printedVarMatch[1] : null;
    if (printedVar && printedVar !== loopVar && !["odd", "even", "number"].includes(printedVar)) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look at your print statement!\nYou wrote \`print(${printedVar})\`, but your loop counter variable is \`${loopVar}\`.\nUpdate your code to print the loop counter: \`print(${loopVar});\` so the numbers 2, 4, 6... actually get displayed!`,
        correction: `Change 'print(${printedVar})' to 'print(${loopVar})'.`
      };
    }
    const printHints = [
      `🌟 Coach Maara note: Loop and even check are both in place! Now for Step 3: What action displays the number when the even check passes? Add a print statement inside your \`if\` block!`,
      `🌟 Coach Maara checking back! Inside your \`if\` condition, display the current even number: write \`print(${loopVar});\` (or \`console.log(${loopVar});\`).`,
      `🌟 Coach Maara with a fresh tip! To output the numbers from 2 to 50, put \`print(${loopVar});\` inside the condition block. Give it a try!`,
      `🌟 Coach Maara encouraging you! You are on the final action! Add \`print(${loopVar})\` inside your if block to complete the prototype.`
    ];
    const printIdx = Math.max(0, attemptCount - 1) % printHints.length;
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: printHints[printIdx],
      correction: `Add 'print(${loopVar});' inside the if block.`
    };
  }

  // STEP 4 / COMPLETION:
  return {
    isFullyVerified: true,
    sampleCodeStepProgress: [
      { stepNumber: 1, title: "1. Setup for loop 1 to 50", completed: true, current: false },
      { stepNumber: 2, title: `2. Check if ${loopVar} % 2 == 0`, completed: true, current: false },
      { stepNumber: 3, title: "3. Print even integer", completed: true, current: false },
      { stepNumber: 4, title: "4. Verify output 2 to 50", completed: true, current: false }
    ],
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program correctly loops from 1 to 50, checks for even numbers (`" + loopVar + " % 2 == 0`), and prints each even number! Outstanding job assembling all 4 steps! Proceed to the Compiler to compile and run your code across languages!",
    correction: "All done! Run the code in the compiler."
  };
}

