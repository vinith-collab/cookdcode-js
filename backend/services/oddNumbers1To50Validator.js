/**
 * CTC Pedagogy Validator for Problem 22: "Print Odd Numbers from 1 to 50"
 * Focuses on loop iteration from 1 to 50 combined with modulo odd condition (i % 2 == 1 or i % 2 != 0) or step of 2.
 */

export function validateOddNumbers1To50Logic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Step 1: Range limits (1 to 50)
  const hasStep1Range = (/\b1\b/.test(norm) && /\b50\b/.test(norm)) ||
    /\b1\s*(?:to|-|till|through)\s*50\b/.test(norm) ||
    /\b(?:up\s*to|until|till|limit)\s*50\b/.test(norm) ||
    /\bbetween\s*1\s*and\s*50\b/.test(norm);

  // Step 2: Divisibility by 2 rule
  const hasStep2Divisibility = /\b(?:not\s+divisible|indivisible|undivisible|cannot\s+divide|cant\s+divide|cannot\s+be\s+divided|cant\s+be\s+divided)\s*by\s*2\b/.test(norm) ||
    /\bdivisib(?:le|ility)\s*by\s*2\b/.test(norm) ||
    /\b(?:modulo\s*)?divid(?:e|ed|ing)\b.*?\bby\s*2\b/.test(norm) ||
    /\bby\s*2\b.*?\bdivid(?:e|ed|ing)\b/.test(norm) ||
    /%\s*2\b/.test(norm) ||
    (/\b2\b/.test(norm) && (/\bdivide\b|\bdivisible\b|\bmodulo\b/.test(norm)));

  // Step 3: Modulo remainder / leftover test (remainder is 1, % 2 == 1, % 2 != 0, leftover is 1, leaves a remainder)
  const hasStep3Remainder = /%\s*2\s*==?\s*1\b/.test(norm) ||
    /%\s*2\s*!=?\s*0\b/.test(norm) ||
    /%\s*2\s*!==\s*0\b/.test(norm) ||
    /\b(?:remainder|leftover|left\s*over|balance)\s*(?:is\s*|equals?\s*|==?\s*)?1\b/.test(norm) ||
    /\b(?:remainder|leftover|left\s*over|balance)\s*(?:is\s*)?(?:not|!=)\s*(?:0|zero)\b/.test(norm) ||
    /\b(?:leaves?|has)\s*(?:a\s*)?(?:remainder|leftover|left\s*over)\b/.test(norm) ||
    /\bnot\s*(?:completely|evenly|exactly)\s*divisible\b/.test(norm) ||
    ((/\bremainder\b|\bleftover\b|\bleft\s*over\b|\bbalance\b/.test(norm)) && (/\b1\b|\bone\b/.test(norm)));

  // Step 4: Filter odd sequence / examples
  const hasStep4Filter = /\b(?:filter|select|collect|print|display|show|pick|keep|output|identify|find|spot)\b/.test(norm) ||
    /\b(?:1,\s*3,\s*5|1\s+3\s+5|1\s*3\s*5\s*7)\b/.test(norm) ||
    (/\bodd\b/.test(norm) && /\bnumbers?\b/.test(norm));

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Range limits (1 to 50)", completed: hasStep1Range, current: !hasStep1Range },
    { stepNumber: 2, title: "2. Divisibility test by 2", completed: hasStep2Divisibility, current: hasStep1Range && !hasStep2Divisibility },
    { stepNumber: 3, title: "3. Modulo remainder test (1 or != 0)", completed: hasStep3Remainder, current: hasStep1Range && hasStep2Divisibility && !hasStep3Remainder },
    { stepNumber: 4, title: "4. Filter odd sequence (1 to 49)", completed: hasStep4Filter, current: hasStep1Range && hasStep2Divisibility && hasStep3Remainder && !hasStep4Filter }
  ];

  const isFullyVerified = hasStep1Range && hasStep2Divisibility && hasStep3Remainder;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Range limits (1 to 50)", completed: true, current: false },
        { stepNumber: 2, title: "2. Divisibility test by 2", completed: true, current: false },
        { stepNumber: 3, title: "3. Modulo remainder test (1 or != 0)", completed: true, current: false },
        { stepNumber: 4, title: "4. Filter odd sequence (1 to 49)", completed: true, current: false }
      ],
      feedback: "🎉 **Logic Approved by Coach Maara!** 🏆\nExcellent understanding! Odd numbers leave remainder 1 when divided by 2 (`number % 2 == 1` or `number % 2 != 0`). You have correctly identified the rule and the target range 1 to 50.\n\nProceed to Stage 2: Recipe!",
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "odd numbers leave remainder 1 when divided by 2"
    };
  }

  // 1. Detect if student is asking an unresolved conversational question
  const isQuestion = norm.endsWith("?") ||
    /\b(?:how|what|why|help|puriyala|theriyala|doubt|explain|start|where)\b/i.test(norm);

  if (isQuestion || norm.length < 5) {
    if (attemptCount >= 4) {
      const advancedHints = [
        "🌟 Coach Maara here! You are making steady progress building your logic.\nTo identify odd numbers between 1 and 50, remember the remainder rule when dividing by 2.\nWhen any odd number is divided by 2, what remainder is left over? (Think about number % 2).\nDescribe this remainder check for numbers from 1 to 50 in your worksheet!",
        "🌟 Coach Maara cheering you on! Let's think through our 2 key logic ingredients together.\nFirst, we need to inspect all numbers across our range from 1 up to 50.\nSecond, an odd number leaves a remainder of 1 whenever it is divided by 2 (`number % 2 == 1`).\nHow would you combine the range and remainder test into a clear sentence in your worksheet?",
        "🌟 Coach Maara with a fresh perspective! Think of this as filtering numbers from 1 to 50.\nEvery number between 1 and 50 that does not divide evenly by 2 is an odd number.\nIn programming logic, we test this using the modulo operation: `number % 2 == 1`.\nCan you write down this rule in your worksheet to complete this stage?"
      ];
      const hintIndex = (attemptCount - 4) % advancedHints.length;
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: advancedHints[hintIndex],
        correction: "Write: An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, odd numbers are 1, 3, 5 ... up to 49.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
        matchedFirebaseInput: "what are odd numbers from 1 to 50"
      };
    }
    if (attemptCount === 3) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara with a direct hint! You are very close to nailing the logic.\nIn programming, we test divisibility using the modulo operator `%`.\nWhen you divide any odd number by 2, the leftover remainder is always 1 (`number % 2 == 1`).\nWrite down this rule for our target range 1 to 50 in your worksheet!",
        correction: "Explain using modulo 2: 'number % 2 == 1' for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
        matchedFirebaseInput: "what are odd numbers from 1 to 50"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! Let's examine how we spot odd numbers.\nTo find odd numbers between 1 and 50, we test each number by dividing it by 2.\nIf dividing by 2 leaves a remainder of 1 (`number % 2 == 1`), that number is odd (like 1, 3, 5...).\nWhat rule can you write in your worksheet to describe this test for numbers up to 50?",
        correction: "Explain using modulo 2: 'number % 2 == 1'.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). Between 1 and 50, numbers like 1, 3, 5 ... 49 are odd numbers.",
        matchedFirebaseInput: "how to identify odd numbers"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara here! Let's explore odd numbers together.\nOdd numbers are numbers that leave a remainder of 1 when divided by 2 (`number % 2 == 1`).\nBetween 1 and 50, the odd numbers follow the sequence 1, 3, 5, 7, ... up to 49.\nExplain in simple words: How do we identify odd numbers from 1 to 50?",
      correction: "Odd numbers leave remainder 1 when divided by 2 (n % 2 == 1). From 1 to 50, we check each number and print if remainder is 1.",
      suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
      matchedFirebaseInput: "what are odd numbers from 1 to 50"
    };
  }

  // If student only provided sample numbers (e.g. "1,3,5,7 are odd numbers")
  if (!hasStep1Range && hasStep4Filter && !hasStep3Remainder) {
    if (attemptCount >= 3) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara here! You've listed great examples like `1, 3, 5, 7`.\nNow we need to provide the general mathematical rule that covers all numbers up to 50.\nRemember, dividing by 2 leaves a remainder of 1 for every odd number (`number % 2 == 1`).\nAdd this general rule with our range 1 to 50 into your worksheet!",
        correction: "State the mathematical formula: number % 2 == 1 for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, numbers like 1, 3, 5 ... 49 are odd.",
        matchedFirebaseInput: "1 3 5 7 are odd numbers without range or formula"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! Listing examples like `1, 3, 5, 7` is a great start.\nHowever, computer logic needs the general mathematical rule for all numbers from **1 to 50**.\nWhen any number in this range is divided by 2, it is odd if the remainder is 1 (`number % 2 == 1`).\nCan you state this rule in your worksheet to complete this step?",
        correction: "State the mathematical formula: number % 2 == 1 for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, numbers like 1, 3, 5 ... 49 are odd.",
        matchedFirebaseInput: "1 3 5 7 are odd numbers without range or formula"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You've correctly spotted odd numbers like `1, 3, 5, 7`! 👏\nOur challenge is to identify all odd numbers from **1 to 50** using computer logic.\nTo complete Stage 1, state our target range (1 to 50) and the remainder test (`number % 2 == 1`).\nHow would you describe this in a sentence in your worksheet?",
      correction: "Add range 1 to 50 and remainder rule: 'number % 2 == 1'.",
      suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
      matchedFirebaseInput: "1 3 5 7 are odd numbers without range or formula"
    };
  }

  // Missing remainder check
  if (!hasStep3Remainder) {
    if (attemptCount >= 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! You're making solid progress on your logic.\nWhat remainder does an odd number leave when divided by 2?\nIn mathematics and programming, dividing by 2 leaves a remainder of 1 (`number % 2 == 1`).\nAdd this remainder test for our range 1 to 50 in your worksheet!",
        correction: "Add the remainder test: 'number % 2 == 1' (remainder is 1).",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, odd numbers are 1, 3, 5 ... up to 49.",
        matchedFirebaseInput: "odd numbers range 1 to 50 missing remainder test"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You have the range identified nicely!\nNow let's specify the exact mathematical remainder test.\nWhen any number is divided by 2, how does the computer know it's odd? The remainder is 1 (`number % 2 == 1`).\nInclude this remainder rule in your worksheet to move forward!",
      correction: "Add remainder test: 'number % 2 == 1'.",
      suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, odd numbers are 1, 3, 5 ... up to 49.",
      matchedFirebaseInput: "odd numbers range 1 to 50 missing remainder test"
    };
  }

  // Missing range
  if (!hasStep1Range) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: Your odd divisibility test (`number % 2 == 1`) is spot on!\nNow we need to specify our target boundary for the algorithm.\nRemember, our program needs to test and identify numbers from **1 to 50**.\nAdd this target range into your worksheet to complete Stage 1!",
      correction: "Add the range '1 to 50' to your worksheet.",
      suggestedInput: "Check numbers from 1 to 50: an odd number leaves remainder 1 when divided by 2 (number % 2 == 1).",
      matchedFirebaseInput: "number % 2 == 1 missing range 1 to 50"
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: "🌟 Coach Maara note: You are making good progress on your logic!\nTo complete this stage, make sure both essential elements are defined:\n1. The counting range from 1 to 50.\n2. The remainder test: a number is odd if dividing by 2 leaves remainder 1 (`number % 2 == 1`).",
    correction: "Combine range 1 to 50 and remainder rule: 'number % 2 == 1'.",
    suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
    matchedFirebaseInput: "odd numbers 1 to 50 logic"
  };
}

export function validateOddNumbers1To50Recipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();

  // Step 1: Start counting / range from 1 to 50
  const hasStep1 = (/\b1\b/.test(norm) && /\b50\b/.test(norm)) ||
    /\b(?:start|count|begin|from|range)\s*(?:counting|numbers?)?\s*(?:from|at)?\s*1\s*(?:to|up\s*to|-)\s*50\b/i.test(norm) ||
    /\bnumbers?\s*(?:from|between)\s*1\s*(?:to|and)\s*50\b/i.test(norm);

  // Step 2: Check divisibility by 2 / odd check
  const hasStep2 = /\b(?:check|test|if|divide|divisible|modulo|remainder|leftover)\b/i.test(norm) &&
    (/\b2\b/.test(norm) || /%\s*2\b/.test(norm));

  // Step 3: Display / print odd number
  const hasStep3 = /\b(?:display|print|show|output|write|announce)\b/i.test(norm);

  // Step 4: Repeat / loop until 50
  const hasStep4 = /\b(?:repeat|loop|continue|next|until|while|for\s+each|reach(?:ing)?\s*50|one\s+after\s+one|increment)\b/i.test(norm) &&
    !norm.includes("(not found in your notes");

  const hasPlaceholders = norm.includes("not found in your notes") || norm.includes("please write this step");

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Start counting numbers from 1 up to 50", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Check if number leaves remainder 1 when divided by 2", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. If remainder is 1, display the number", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Repeat until reaching 50", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 }
  ];

  const isFullyVerified = hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasPlaceholders;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Start counting numbers from 1 up to 50", completed: true, current: false },
        { stepNumber: 2, title: "2. Check if number leaves remainder 1 when divided by 2", completed: true, current: false },
        { stepNumber: 3, title: "3. If remainder is 1, display the number", completed: true, current: false },
        { stepNumber: 4, title: "4. Repeat until reaching 50", completed: true, current: false }
      ],
      feedback: "🎉 **Recipe Verified!** 🏆 Superb algorithmic thinking! You have clearly sequenced all 4 steps to print odd numbers from 1 to 50. Proceed to Stage 3: Ingredients!",
      correction: "Proceed to Stage 3: Ingredients to gather your programming building blocks.",
      suggestedInput: void 0,
      matchedFirebaseInput: "recipe for odd numbers 1 to 50 verified"
    };
  }

  // Socratic Single-Step Guidance:
  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (hasPlaceholders) {
    feedback = "🌟 Coach Maara here! It looks like your worksheet contains placeholder lines like `(Not found in your notes — please write this step)`. Please replace those placeholders with your actual recipe instructions (or delete empty placeholder lines) so we can verify your 4 recipe steps!";
    correction = "Replace or delete `(Not found in your notes)` lines and write your actual recipe steps.";
    suggestedInput = "Step 4: Repeat for all numbers until reaching 50.";
  } else if (!hasStep1) {
    const step1Hints = [
      "🌟 Coach Maara here! Let's think like a chef preparing our recipe steps.\nEvery algorithm starts with a clear starting boundary for our sequence.\nTo inspect every number from 1 to 50, how would you state our starting count?\nTry writing your very first action as `Step 1: Start counting numbers from 1 up to 50` in your worksheet!",
      "🌟 Coach Maara checking back! You are on the right track setting up the recipe.\nBefore we can test each number, we must establish our counting range.\nState our starting and ending limits in simple everyday English.\nIn your worksheet, write: `Step 1: Start counting numbers from 1 up to 50`.",
      "🌟 Coach Maara with a fresh tip! Let's take this one step at a time.\nOur goal is to examine all numbers beginning at 1 and finishing at 50.\nWhat clear instruction tells the computer where to begin counting?\nWrite down your initial action: `Step 1: Start counting from 1 up to 50`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step1Hints.length;
    feedback = step1Hints[idx];
    correction = "Write Step 1: Start counting numbers from 1 up to 50.";
    suggestedInput = "Step 1: Start counting numbers from 1 up to 50.";
  } else if (!hasStep2) {
    const step2Hints = [
      "🌟 Coach Maara here! Step 1 looks fantastic! 👏\nNow we need our second recipe action to check each counting number.\nRemember our math rule: when an odd number is divided by 2, it leaves a remainder of 1.\nHow would you describe this remainder check in everyday English for Step 2?",
      "🌟 Coach Maara checking back! Great job setting up the counting range in Step 1.\nFor Step 2, describe how to test if the current number is an odd number.\nFocus on checking whether dividing by 2 leaves a remainder of 1 (or is not divisible by 2).\nIn your worksheet, add: `Step 2: Check if dividing the number by 2 leaves a remainder of 1`.",
      "🌟 Coach Maara encouraging you! You are halfway through the recipe!\nNow we need the decision step that filters the odd numbers.\nCheck if dividing by 2 leaves a leftover of 1 before displaying it.\nTry writing `Step 2: Check if dividing by 2 leaves remainder 1` in your worksheet!"
    ];
    const idx = Math.max(0, attemptCount - 1) % step2Hints.length;
    feedback = step2Hints[idx];
    correction = "Write Step 2: Check if dividing by 2 leaves remainder 1.";
    suggestedInput = "Step 2: Check if dividing the number by 2 leaves a remainder of 1.";
  } else if (!hasStep3) {
    const step3Hints = [
      "🌟 Coach Maara here! Steps 1 and 2 are clearly established! 👏\nNow we need the action step that takes place when our condition is met.\nWhen a number leaves a remainder of 1, what should we do with that odd number?\nDescribe displaying or printing the number for Step 3 in your worksheet!",
      "🌟 Coach Maara checking back! Your recipe logic is coming together nicely.\nOnce we identify that a number is odd, we need to show it to the user.\nWhat simple instruction shows or displays that specific number?\nIn your worksheet, write: `Step 3: If remainder is 1, display the number`.",
      "🌟 Coach Maara with a fresh tip! Now let's handle the output action.\nWhen the odd test succeeds, we display that number on the screen.\nHow would you state this action in a clean recipe step?\nAdd `Step 3: If remainder is 1, display the number` to your worksheet!"
    ];
    const idx = Math.max(0, attemptCount - 1) % step3Hints.length;
    feedback = step3Hints[idx];
    correction = "Write Step 3: If remainder is 1, display the number.";
    suggestedInput = "Step 3: If remainder is 1, display the number.";
  } else if (!hasStep4) {
    const step4Hints = [
      "🌟 Coach Maara here! You are almost at the finish line for your recipe! 👏\nAfter displaying an odd number, we must continue checking the remaining numbers.\nWhat final instruction tells the recipe to keep repeating until reaching 50?\nWrite your final repeat action as Step 4 in your worksheet!",
      "🌟 Coach Maara checking back! Three steps are ready, now for the grand finale.\nWe need an instruction to repeat the process for all subsequent numbers up to 50.\nHow would you phrase this repetition step in simple everyday words?\nIn your worksheet, write: `Step 4: Repeat until reaching 50` to complete the stage!",
      "🌟 Coach Maara with a fresh tip! Every loop recipe needs a completion rule.\nState that the counting and checking should repeat until 50 is reached.\nAdd this final action to wrap up your 4-step recipe.\nTry writing `Step 4: Repeat until reaching 50` in your worksheet!"
    ];
    const idx = Math.max(0, attemptCount - 1) % step4Hints.length;
    feedback = step4Hints[idx];
    correction = "Write Step 4: Repeat until reaching 50.";
    suggestedInput = "Step 4: Repeat for all numbers until reaching 50.";
  }

  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: "how to write recipe for odd numbers 1 to 50"
  };
}

export function validateOddNumbers1To50Ingredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const withoutStepHeaders = norm.replace(/(?:^|\n)\s*step\s*\d+\s*[:\-]/gi, "\n");

  const hasLoopKeyword = /\b(?:for\s*loop|while\s*loop|for\s*\(|while\s*\(|for\s+\w+\s+in|\bloop\b)/i.test(norm);

  // Check Start: 1 (or 1 to 50)
  const hasLoopStart = /\bstart\s*[:=\s]\s*\(?\s*(?:(?:variable|var|counter|let|int)\s*)?(?:[a-zA-Z_]\w*\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*)?1\b/i.test(withoutStepHeaders) ||
    /\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*(?:(?:variable|var|counter|let|int)\s*)?(?:[a-zA-Z_]\w*\s*(?:=|starts?\s*(?:at|from|with)|[:=])\s*)?1\b/i.test(withoutStepHeaders) ||
    /\b[a-zA-Z_]\w*\s*=\s*1\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*1\s*,/i.test(withoutStepHeaders) ||
    /\b1\s*(?:to|-)\s*50\b/i.test(withoutStepHeaders);

  // Check Stop: 50
  const hasLoopStop = /\bstop\s*[:=\s]\s*\(?\s*(?:i\s*<=?\s*)?50\b/i.test(withoutStepHeaders) ||
    /\b(?:up\s*to|to|till|until|limit|end\s*(?:at|:|\s))\s*50\b/i.test(withoutStepHeaders) ||
    /\bi\s*<=?\s*50\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*1\s*,\s*5[01]\b/i.test(withoutStepHeaders) ||
    /\b1\s*(?:to|-)\s*50\b/i.test(withoutStepHeaders);

  // Check Step increment
  const hasExplicitLoopStep = /\b(?:next\s*step|step)\s*[:=\s]\s*\(?\s*\+?[12]\b/i.test(withoutStepHeaders) ||
    /\bi\+\+/i.test(withoutStepHeaders) ||
    /\bi\s*\+=\s*[12]\b/i.test(withoutStepHeaders) ||
    /\bstep\s*\(\s*\+?[12]\s*\)/i.test(withoutStepHeaders) ||
    /\bincrement\s*by\s*[12]\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*1\s*,\s*5[01]\s*,\s*[12]\s*\)/i.test(withoutStepHeaders);

  const hasRange1To50 = /\b1\s*(?:to|-)\s*50\b/i.test(norm) || (hasLoopStart && hasLoopStop);
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

  // Check if condition for odd: i % 2 == 1 or i % 2 != 0
  const hasIfCondition = /\bif\b/i.test(norm) || /\bcondition\b/i.test(norm) || /\bcheck\b/i.test(norm);
  const hasMod2 = /%\s*2\b/i.test(norm) || /divide\s*by\s*2/i.test(norm) || /remainder/i.test(norm) || /leftover/i.test(norm);
  const hasOddRemainder = /==\s*1\b/i.test(norm) || /!=\s*0\b/i.test(norm) || /!==\s*0\b/i.test(norm) ||
    /right\s*side\s*[:=]?\s*1\b/i.test(norm) || /remainder\s*(?:is|==|=)?\s*1\b/i.test(norm) ||
    /leftover\s*(?:is|==|=)?\s*1\b/i.test(norm) || /not\s*(?:equal\s*to\s*)?0\b/i.test(norm);

  const hasStepBy2Shortcut = hasExplicitLoopStep && (/step\s*[:=\s]\s*\(?\s*\+?2\b/i.test(withoutStepHeaders) || /\bi\s*\+=\s*2\b/i.test(withoutStepHeaders) || /step\s*\(\s*\+?2\s*\)/i.test(withoutStepHeaders));

  const hasOddCheck = (hasIfCondition && (hasMod2 || hasOddRemainder)) || (hasMod2 && hasOddRemainder) || hasStepBy2Shortcut || /i\s*%\s*2\s*==\s*1/i.test(norm) || /i\s*%\s*2\s*!=\s*0/i.test(norm) || new RegExp(`(?:${varName}|[a-zA-Z_]\\w*)\\s*%\\s*2\\s*(?:==|!=)\\s*[01]`, "i").test(norm);

  // Print statement
  const hasPrint = /\b(?:print|display|console\.log|show|output|write)\b/i.test(norm);

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. For loop to iterate from 1 up to 50", completed: hasCompleteLoop, current: !hasCompleteLoop },
    { stepNumber: 2, title: "2. If condition to check if number is odd", completed: Boolean(hasOddCheck), current: hasCompleteLoop && !hasOddCheck },
    { stepNumber: 3, title: "3. Print statement inside loop to print the odd number", completed: Boolean(hasPrint), current: hasCompleteLoop && hasOddCheck && !hasPrint }
  ];

  if (!hasLoopVar && (hasLoopKeyword || hasRange1To50)) {
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasOddCheck,
      hasPrint,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. For loop with counter variable (e.g. start: i = 1)", completed: false, current: true },
        { stepNumber: 2, title: "2. If condition to check if number is odd", completed: false, current: false },
        { stepNumber: 3, title: "3. Print statement inside loop to print the odd number", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! You've set up your loop range from 1 to 50 with step +1, which is great! 👏\nHowever, every loop needs a **counter variable name** (such as `i`, `num`, or `count`) to hold each number as we count.\nPlease give your starting step a variable name, for example: `start: i = 1` (or `variable i starts at 1`).",
      correction: "Assign a variable name to your loop counter in Step 1 (e.g. 'start: i = 1' or 'variable i = 1').",
      suggestedInput: "Step 1: For loop with Start: i = 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "loop without variable name"
    };
  }

  if (!hasCompleteLoop) {
    const loopHints = [
      "🌟 Coach Maara here! To inspect numbers from 1 to 50, our first ingredient is a **Counting Loop**.\nEvery counting loop needs a **counter variable** and 3 essential loop controls:\n1. Variable name and where the count begins (e.g. `start: i = 1`)\n2. Where does our count stop? (e.g. `stop: 50`)\n3. By how much does the counter step each round? (e.g. `step: +1`)\nHow would you describe these controls for a For loop with a variable in your worksheet?",
      "🌟 Coach Maara checking back! For a For loop from 1 to 50, specify a variable name and the loop controls clearly in your worksheet:\n• **Start:** Assign a variable name starting at 1 (e.g. `start: i = 1` or `variable i = 1`)\n• **Stop:** What is our upper limit? (e.g. `stop: 50`)\n• **Step:** How much do we increase on each iteration? (e.g. `step: +1`)\nTry defining your For loop with a variable name and these controls!",
      "🌟 Coach Maara encouraging you! We need a counting loop with a variable covering our range.\nIn your worksheet, specify a variable name like `i`, the start (1), stop (50), and step (+1) for your For loop.\nTry writing: `Step 1: For loop from 1 to 50 with Start: i = 1, Stop: 50, Step: +1`."
    ];
    const loopIndex = Math.max(0, attemptCount - 1) % loopHints.length;
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasOddCheck,
      hasPrint,
      ingredientsStepProgress,
      feedback: loopHints[loopIndex],
      correction: "Define loop with a variable name: 'Step 1: For loop with Start: i = 1, Stop: 50, Step: +1'.",
      suggestedInput: "Step 1: For loop with Start: i = 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "for loop without start stop step"
    };
  }

  if (!hasOddCheck && !hasStepBy2Shortcut) {
    const oddHints = [
      `🌟 Coach Maara here! Your counting loop with variable \`${varName}\` is ready! 👏 Now we need Ingredient 2: A decision step to filter the odd numbers.\nIn our Logic stage, how did we determine whether a counting number is odd?\nThink about what condition or remainder check on \`${varName}\` we need inside our loop to identify odd numbers!`,
      `🌟 Coach Maara checking back! In programming, we check remainders using the modulo operator (\`%\`).\nTo test if our counter \`${varName}\` is an odd number:\n• What mathematical expression calculates the remainder when \`${varName}\` is divided by 2?\n• What remainder value indicates that a number is odd?\nTry framing an **If condition** with your Left Side, Operator, and Right Side!`,
      `🌟 Coach Maara encouraging you! Every odd number leaves a remainder of 1 when divided by 2.\nSet up your Ingredient 2 structure:\n• **Left Side:** remainder expression of \`${varName}\` divided by 2\n• **Operator:** comparison operator for equality (\`==\`)\n• **Right Side:** the expected remainder for an odd number (\`1\`)\nWhat rule will you write in your worksheet?`,
      `🌟 Coach Maara with a direct tip! To filter odd numbers inside the loop, check if dividing \`${varName}\` by 2 leaves remainder 1:\n\`Step 2: If condition with Left Side: ${varName} % 2, Operator: ==, Right Side: 1\`.`
    ];
    const oddIndex = Math.max(0, attemptCount - 1) % oddHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasOddCheck: false,
      hasPrint,
      ingredientsStepProgress,
      feedback: oddHints[oddIndex],
      correction: `Add an if condition comparing the remainder of dividing ${varName} by 2.`,
      suggestedInput: `Step 2: If condition with Left Side: ${varName} % 2, Operator: ==, Right Side: 1`,
      matchedFirebaseInput: "step 2 : if condition for odd numbers"
    };
  }

  if (!hasPrint) {
    const printHints = [
      `🌟 Coach Maara here! Loop and odd check are in place! 👏 Now, what action should happen when \`${varName}\` is found to be odd?\nWhat statement outputs the current number \`${varName}\` to the screen?`,
      `🌟 Coach Maara checking back! When our odd condition succeeds, we need to show that number.\nIn your worksheet, write an output instruction (like \`print\`) inside the if block to display \`${varName}\`!`,
      `🌟 Coach Maara encouraging you! Wrap up Ingredient 3 by outputting the verified odd number: \`Step 3: Inside if block: print(${varName})\`.`
    ];
    const printIndex = Math.max(0, attemptCount - 1) % printHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasOddCheck: true,
      hasPrint: false,
      ingredientsStepProgress,
      feedback: printHints[printIndex],
      correction: `Add print statement: 'Step 3: Inside if block: print(${varName})'.`,
      suggestedInput: `Step 3: Inside if block: print(${varName})`,
      matchedFirebaseInput: "step 3 : print the odd number"
    };
  }

  return {
    isFullyVerified: true,
    hasLoop: true,
    hasOddCheck: true,
    hasPrint: true,
    ingredientsStepProgress: [
      { stepNumber: 1, title: "1. For loop with Start: 1, Stop: 50 (i <= 50), Step: +1 (or +2)", completed: true, current: false },
      { stepNumber: 2, title: "2. If condition (Left Side: i % 2, Operator: ==, Right Side: 1)", completed: true, current: false },
      { stepNumber: 3, title: "3. Print statement inside loop to print the odd number", completed: true, current: false }
    ],
    feedback: "🎉 **Ingredients Verified!** 🏆 Brilliant work! You have gathered all necessary ingredients: the loop from 1 to 50, the odd remainder check (`i % 2 == 1`), and the print statement inside the loop. Proceed to Stage 4: Taste the Sample!",
    correction: "Proceed to Stage 4: Taste the Sample to assemble your verified ingredients into working code.",
    suggestedInput: void 0,
    matchedFirebaseInput: "ingredients for odd numbers 1 to 50 verified"
  };
}

export function validateOddNumbers1To50SampleCode(code, attemptCount = 1) {
  if (!code || typeof code !== "string" || code.trim().length < 5) {
    const emptySteps = [
      { stepNumber: 1, title: "1. Setup for loop 1 to 50", completed: false, current: true },
      { stepNumber: 2, title: "2. Check if i % 2 == 1", completed: false, current: false },
      { stepNumber: 3, title: "3. Print odd integer", completed: false, current: false },
      { stepNumber: 4, title: "4. Verify output 1 to 49", completed: false, current: false }
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

  // Detect loop variable
  const loopVarMatch = code.match(/for\s*(?:\(\s*(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*(?:=|in|<=)/i) ||
    code.match(/while\s*\(\s*([a-zA-Z_]\w*)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : "i";

  // Step increment shortcut: for (...; i += 2) or range(1, 51, 2)
  const hasStep2 = /\+=\s*2\b/.test(norm) || /,\s*2\s*\)/.test(norm);

  // 3. Condition detection
  const hasIfKeyword = /\bif\b/i.test(norm);
  const hasMod2 = /%\s*2\b/.test(norm);
  const hasEqualsOne = /==\s*1\b/.test(norm) || /===\s*1\b/.test(norm) || /=\s*1\b/.test(norm);
  const hasNotEqualsZero = /!=\s*0\b/.test(norm) || /!==\s*0\b/.test(norm);
  const hasConditionWithoutIf = !hasIfKeyword && (/% 2\s*==\s*1/.test(norm) || /%\s*2\s*!=\s*0/.test(norm) || /%\s*2\s*==/.test(norm));
  const hasSingleEqual = hasIfKeyword && /%\s*2\s*=\s*1\b/.test(norm);
  const hasEvenCheckInstead = hasIfKeyword && hasMod2 && (/==\s*0\b/.test(norm) || /===\s*0\b/.test(norm));

  const hasValidCondition = (hasIfKeyword && hasMod2 && (hasEqualsOne || hasNotEqualsZero)) || hasStep2;

  // 4. Print detection
  const hasPrint = /\b(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<)\b/i.test(norm);
  const printsStringOrText = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*["']?(?:odd(?:\\s*number)?|even|number)["']?\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*["']?(?:odd(?:\\s*number)?|even|number)["']?`, "i").test(norm);
  const printsLoopVar = (new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*${loopVar}\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*${loopVar}\\b`, "i").test(norm)) && !printsStringOrText;

  // Track progress
  const step1Done = hasValidLoop;
  const step2Done = step1Done && hasValidCondition;
  const step3Done = step2Done && printsLoopVar;
  const step4Done = step3Done && !hasQuestion;

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: "1. Setup for loop 1 to 50", completed: step1Done, current: !step1Done },
    { stepNumber: 2, title: `2. Check if ${loopVar} % 2 == 1`, completed: step2Done, current: step1Done && !step2Done },
    { stepNumber: 3, title: "3. Print odd integer", completed: step3Done, current: step2Done && !step3Done },
    { stepNumber: 4, title: "4. Verify output 1 to 49", completed: step4Done, current: step3Done && !step4Done }
  ];

  // STRICT SINGLE-STEP SOCRATIC GUIDANCE:
  // First, if user has questions in editor:
  if (hasQuestion) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maara note: In the code editor, only executable program lines belong! Please remove conversational questions (like 'how to define...') from the editor so the compiler can read your clean code.",
      correction: "Remove question text from the code editor."
    };
  }

  // STEP 1 GUIDANCE: If loop is missing or incomplete
  if (!step1Done) {
    const loopHints = [
      "🌟 Coach Maara note: Let's begin with Step 1 for our code prototype!\nTo print odd numbers from 1 to 50, we first need a counting structure.\nWhat loop construct will iterate through all counting numbers starting from 1 up to 50?\nWrite your `for` loop header in the editor to start Step 1!",
      "🌟 Coach Maara checking back! You are on the right track setting up the program.\nRemember our loop needs 3 controls: Start: 1, Stop: 50 (`i <= 50`), and Step: `i++`.\nIn your code editor, set up the loop: `for (var i = 1; i <= 50; i++) {`.\nGive this loop header a try to complete Step 1!",
      "🌟 Coach Maara with a fresh tip! Every loop starts with establishing the range.\nWe want our counter variable `i` to begin at 1 and run until it reaches 50.\nIn universal syntax, this is written: `for (var i = 1; i <= 50; i++) {`.\nType your loop header in your code editor to move forward!",
      "🌟 Coach Maara encouraging you! Let's build our code step by step.\nStart by writing a loop that counts through our target numbers 1 to 50.\nWhat initial statement begins this counting journey?\nWrite your for loop header in the code editor to complete this step!"
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
    if (hasEvenCheckInstead) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look closely at your condition!\nYou wrote \`${loopVar} % 2 == 0\`, which checks for **EVEN** numbers.\nFor **ODD** numbers, we test if dividing by 2 leaves remainder 1 (or is not 0).\nUpdate your condition to: \`if (${loopVar} % 2 == 1) {\` in your editor!`,
        correction: `Change '${loopVar} % 2 == 0' to 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    if (hasConditionWithoutIf) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: You wrote \`${loopVar} % 2 == 1 {\` with the \`==\` operator, which is great thinking!\nIn programming, a conditional decision always requires the \`if\` keyword.\nWrap your comparison inside \`if (...)\`: \`if (${loopVar} % 2 == 1) {\`.\nAdd the \`if\` keyword to fix your condition!`,
        correction: `Change '${loopVar} % 2 == 1 {' to 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    if (hasSingleEqual) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look closely at your comparison operator!\nYou wrote a single \`=\` (\`${loopVar} % 2 = 1\`), which assigns rather than compares.\nIn programming conditions, always use \`==\` (or \`!==\`) to compare values.\nUpdate to: \`if (${loopVar} % 2 == 1) {\` in your editor!`,
        correction: `Use '==' instead of '=': 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    const condHints = [
      `🌟 Coach Maara note: Your loop from 1 to 50 is set up nicely! 👏\nNow for Step 2: we must check each number before displaying it.\nHow do we test if \`${loopVar}\` is an odd number using the modulo operator \`%\`?\nAdd your condition: \`if (${loopVar} % 2 == 1) {\` inside your loop body!`,
      `🌟 Coach Maara checking back! Inside the loop, we filter only odd numbers.\nIn programming, checking if dividing by 2 leaves remainder 1 tests for oddness.\nWrite an \`if\` decision block with \`${loopVar} % 2 == 1\` (or \`${loopVar} % 2 != 0\`).\nTry adding this if condition inside your loop!`,
      `🌟 Coach Maara with a fresh tip! Let's inspect the remainder of each number.\nWhen \`${loopVar} % 2\` produces 1, that number is odd and should be printed.\nAdd your decision statement: \`if (${loopVar} % 2 == 1) {\` inside the loop.\nWhat action will you put inside this condition?`,
      `🌟 Coach Maara encouraging you! You are halfway through the prototype!\nFilter only the odd numbers by testing if the remainder with 2 is 1.\nWrite: \`if (${loopVar} % 2 == 1) {\` inside your loop body.\nGive it a try in your code editor!`
    ];
    const condIdx = Math.max(0, attemptCount - 1) % condHints.length;
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: condHints[condIdx],
      correction: `Add the condition: 'if (${loopVar} % 2 == 1) {'.`
    };
  }

  // STEP 3 GUIDANCE: If print is missing or wrong
  if (!step3Done) {
    if (printsStringOrText) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look at your print target!\nYou wrote text ('odd number') instead of the actual number itself.\nPrint the loop variable \`${loopVar}\` so the program actually outputs 1, 3, 5...: \`print(${loopVar});\`.\nUpdate the print statement in your code editor!`,
        correction: `Change print target to the loop variable: 'print(${loopVar})'.`
      };
    }
    const printHints = [
      `🌟 Coach Maara note: Both your loop and odd condition are looking great! 👏\nNow for Step 3: we need to display each odd number that passes our test.\nMake sure to output the loop variable \`${loopVar}\` rather than a fixed text string.\nAdd \`print(${loopVar});\` inside your if condition to see the numbers 1, 3, 5...!`,
      `🌟 Coach Maara checking back! You are on the very final action of your code!\nInside your \`if\` condition, display the current odd integer.\nIn universal syntax, write: \`print(${loopVar});\` (or \`console.log(${loopVar});\`).\nAdd this print statement to complete your prototype!`,
      `🌟 Coach Maara with a fresh tip! To display each odd number on the screen:\nPlace \`print(${loopVar});\` directly between the curly braces of your if block.\nThis ensures only numbers passing the odd test get displayed.\nAdd this final line in your code editor now!`,
      `🌟 Coach Maara encouraging you! You are right at the finish line! 🏆\nAll that remains is printing each approved odd number.\nAdd \`print(${loopVar});\` inside your condition block.\nRun your code to complete this challenge!`
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
      { stepNumber: 2, title: `2. Check if ${loopVar} % 2 == 1`, completed: true, current: false },
      { stepNumber: 3, title: "3. Print odd integer", completed: true, current: false },
      { stepNumber: 4, title: "4. Verify output 1 to 49", completed: true, current: false }
    ],
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program correctly loops from 1 to 50, checks for odd numbers (`" + loopVar + " % 2 == 1`), and prints each odd number! Outstanding job assembling all 4 steps! Proceed to the Compiler to compile and run your code across languages!",
    correction: "All done! Run the code in the compiler."
  };
}

