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
        "🌟 Coach Maara here to guide you across the finish line! Here is the complete logic statement for your worksheet:\n\n👉 `An odd number leaves a remainder of 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.`\n\nTry typing this statement into your worksheet!",
        "🌟 Coach Maara cheering you on! Remember our 2 core logic ingredients:\n1. **Range:** Test all numbers from 1 up to 50.\n2. **Odd Test:** Check if `number % 2 == 1` (or dividing by 2 leaves remainder 1).\n\nCombine these into a simple statement in your worksheet!",
        "🌟 Coach Maara with a fresh perspective! Think of this as filtering numbers from 1 to 50: for each number, if `number % 2 == 1` (remainder is 1), it is an odd number! State this in simple words in your worksheet."
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
        feedback: "🌟 Coach Maara with a direct hint! In programming, we test divisibility using the modulo operator `%`. For odd numbers, dividing by 2 leaves remainder 1 (`number % 2 == 1`). Write down this rule for numbers from 1 to 50 in your worksheet!",
        correction: "Explain using modulo 2: 'number % 2 == 1' for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, the odd numbers are 1, 3, 5, 7 ... up to 49.",
        matchedFirebaseInput: "what are odd numbers from 1 to 50"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! To find odd numbers between 1 and 50, we test each number by dividing by 2. If remainder is 1 (`number % 2 == 1`), it is an odd number (like 1, 3, 5...). What rule can you write in your worksheet to describe this?",
        correction: "Explain using modulo 2: 'number % 2 == 1'.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). Between 1 and 50, numbers like 1, 3, 5 ... 49 are odd numbers.",
        matchedFirebaseInput: "how to identify odd numbers"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara here! Odd numbers are numbers that leave a remainder of 1 when divided by 2 (`number % 2 == 1` or `number % 2 != 0`). Between 1 and 50, the odd numbers are 1, 3, 5, 7, ... up to 49!\n\n👉 Explain in simple words: How do we identify odd numbers from 1 to 50?",
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
        feedback: "🌟 Coach Maara here! You've listed examples (`1, 3, 5, 7`), now add the general rule: 'From 1 to 50, a number is odd if dividing by 2 leaves remainder 1 (number % 2 == 1).' Type this to complete the stage!",
        correction: "State the mathematical formula: number % 2 == 1 for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, numbers like 1, 3, 5 ... 49 are odd.",
        matchedFirebaseInput: "1 3 5 7 are odd numbers without range or formula"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! Listing examples like `1, 3, 5, 7` is a great observation, but the computer needs the general mathematical rule for all numbers from **1 to 50**!\n\nState in your worksheet: A number is odd if dividing by 2 leaves remainder 1 (`number % 2 == 1`) for the range 1 to 50.",
        correction: "State the mathematical formula: number % 2 == 1 for range 1 to 50.",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, numbers like 1, 3, 5 ... 49 are odd.",
        matchedFirebaseInput: "1 3 5 7 are odd numbers without range or formula"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You've correctly spotted odd numbers like `1, 3, 5, 7`! 👏\n\nHowever, our challenge is to identify all odd numbers from **1 to 50** using computer logic. To complete Stage 1:\n1. State our range: **1 to 50**.\n2. State the mathematical test: A number is odd if dividing by 2 leaves a remainder of 1 (`number % 2 == 1`).",
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
        feedback: "🌟 Coach Maara checking back! What remainder does an odd number leave when divided by 2? An odd number divided by 2 leaves a remainder of 1 (`number % 2 == 1`). Add this rule to your worksheet!",
        correction: "Add the remainder test: 'number % 2 == 1' (remainder is 1).",
        suggestedInput: "An odd number leaves remainder 1 when divided by 2 (number % 2 == 1). From 1 to 50, odd numbers are 1, 3, 5 ... up to 49.",
        matchedFirebaseInput: "odd numbers range 1 to 50 missing remainder test"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You have the range! Now specify the exact mathematical remainder test. In programming, how does the computer know a number is odd? When divided by 2, the remainder is 1 (`number % 2 == 1`).",
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
      feedback: "🌟 Coach Maara note: Your odd divisibility test (`number % 2 == 1`) is spot on! Now add our target range: state that we are checking numbers from **1 to 50**.",
      correction: "Add the range '1 to 50' to your worksheet.",
      suggestedInput: "Check numbers from 1 to 50: an odd number leaves remainder 1 when divided by 2 (number % 2 == 1).",
      matchedFirebaseInput: "number % 2 == 1 missing range 1 to 50"
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: "🌟 Coach Maara note: You are very close! Define the range (1 to 50) and state that numbers leaving remainder 1 when divided by 2 (`number % 2 == 1`) are odd numbers.",
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
  const hasStep4 = /\b(?:repeat|loop|continue|next|until|while|for\s+each|reach(?:ing)?\s*50)\b/i.test(norm) ||
    /\bstep\s*4\b/i.test(norm);

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Start counting numbers from 1 up to 50", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Check if number leaves remainder 1 when divided by 2", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. If remainder is 1, display the number", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Repeat until reaching 50", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 }
  ];

  const isFullyVerified = hasStep1 && hasStep2 && hasStep3 && hasStep4;

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

  if (!hasStep1) {
    const step1Hints = [
      "🌟 Coach Maara here! Let's think like a chef writing a recipe. What is the very first step to inspect numbers from 1 to 50? (Hint: Start counting from 1 up to 50).",
      "🌟 Coach Maara checking back! What is our starting point for the recipe? Write: 'Step 1: Start counting numbers from 1 up to 50.'",
      "🌟 Coach Maara with a fresh tip! Every recipe starts with a starting action. In your worksheet, write: `Step 1: Start counting from 1 up to 50`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step1Hints.length;
    feedback = step1Hints[idx];
    correction = "Write Step 1: Start counting numbers from 1 up to 50.";
    suggestedInput = "Step 1: Start counting numbers from 1 up to 50.";
  } else if (!hasStep2) {
    const step2Hints = [
      "🌟 Coach Maara here! Step 1 looks great! 👏 Now for Step 2: For each number, how do we check if it is odd? (Hint: Check if dividing by 2 leaves a remainder of 1).",
      "🌟 Coach Maara checking back! In Step 2, test the current number: 'Step 2: Check if dividing the number by 2 leaves remainder 1 (or is not divisible by 2).'",
      "🌟 Coach Maara with a fresh tip! To filter odd numbers, check the remainder: `Step 2: Check if dividing by 2 leaves remainder 1`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step2Hints.length;
    feedback = step2Hints[idx];
    correction = "Write Step 2: Check if dividing by 2 leaves remainder 1.";
    suggestedInput = "Step 2: Check if dividing the number by 2 leaves a remainder of 1.";
  } else if (!hasStep3) {
    const step3Hints = [
      "🌟 Coach Maara here! Steps 1 & 2 are ready! 👏 Now for Step 3: If the number leaves remainder 1, what action should we take? (Hint: Display the number).",
      "🌟 Coach Maara checking back! What do we do when our odd condition is met? Write: 'Step 3: If remainder is 1, display the number.'",
      "🌟 Coach Maara encouraging you! Now display the result: `Step 3: If remainder is 1, display the number`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step3Hints.length;
    feedback = step3Hints[idx];
    correction = "Write Step 3: If remainder is 1, display the number.";
    suggestedInput = "Step 3: If remainder is 1, display the number.";
  } else if (!hasStep4) {
    const step4Hints = [
      "🌟 Coach Maara here! Almost done with the recipe! 👏 What is the final step to keep checking subsequent numbers until we finish? (Hint: Repeat until reaching 50).",
      "🌟 Coach Maara checking back! To finish the recipe, add: 'Step 4: Repeat for all numbers until reaching 50.'",
      "🌟 Coach Maara with a fresh tip! Add the loop repeat step: `Step 4: Repeat until reaching 50` to complete your recipe!"
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
  const hasLoopStart = /\bstart\s*[:=\s]\s*\(?\s*1\b/i.test(withoutStepHeaders) ||
    /\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*1\b/i.test(withoutStepHeaders) ||
    /\bi\s*=\s*1\b/i.test(withoutStepHeaders) ||
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
  const hasCompleteLoop = hasLoopKeyword && hasRange1To50;

  // Check if condition for odd: i % 2 == 1 or i % 2 != 0
  const hasIfCondition = /\bif\b/i.test(norm) || /\bcondition\b/i.test(norm) || /\bcheck\b/i.test(norm);
  const hasMod2 = /%\s*2\b/i.test(norm) || /divide\s*by\s*2/i.test(norm) || /remainder/i.test(norm) || /leftover/i.test(norm);
  const hasOddRemainder = /==\s*1\b/i.test(norm) || /!=\s*0\b/i.test(norm) || /!==\s*0\b/i.test(norm) ||
    /right\s*side\s*[:=]?\s*1\b/i.test(norm) || /remainder\s*(?:is|==|=)?\s*1\b/i.test(norm) ||
    /leftover\s*(?:is|==|=)?\s*1\b/i.test(norm) || /not\s*(?:equal\s*to\s*)?0\b/i.test(norm);

  const hasStepBy2Shortcut = hasExplicitLoopStep && (/step\s*[:=\s]\s*\(?\s*\+?2\b/i.test(withoutStepHeaders) || /\bi\s*\+=\s*2\b/i.test(withoutStepHeaders) || /step\s*\(\s*\+?2\s*\)/i.test(withoutStepHeaders));

  const hasOddCheck = (hasIfCondition && (hasMod2 || hasOddRemainder)) || (hasMod2 && hasOddRemainder) || hasStepBy2Shortcut || /i\s*%\s*2\s*==\s*1/i.test(norm) || /i\s*%\s*2\s*!=\s*0/i.test(norm);

  // Print statement
  const hasPrint = /\b(?:print|display|console\.log|show|output|write)\b/i.test(norm);

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. For loop with Start: 1, Stop: 50 (i <= 50), Step: +1 (or +2)", completed: hasCompleteLoop, current: !hasCompleteLoop },
    { stepNumber: 2, title: "2. If condition (Left Side: i % 2, Operator: ==, Right Side: 1)", completed: Boolean(hasOddCheck), current: hasCompleteLoop && !hasOddCheck },
    { stepNumber: 3, title: "3. Print statement inside loop to print the odd number", completed: Boolean(hasPrint), current: hasCompleteLoop && hasOddCheck && !hasPrint }
  ];

  if (!hasCompleteLoop) {
    const loopHints = [
      "🌟 Coach Maara note: To find odd numbers between 1 and 50, our first ingredient must be a **Loop** to iterate through all numbers from 1 to 50.\n\nDefine a **For loop** in your worksheet:\n• **Start:** 1\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)\n\n👉 Example: `Step 1: For loop from 1 to 50 (Start: 1, Stop: 50, Step: +1)`",
      "🌟 Coach Maara checking back! For Ingredient 1, define the 3 loop controls clearly in your worksheet:\n• **Start:** 1\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)\n\n👉 Example: `Step 1: For loop with Start: 1, Stop: 50, Step: +1`",
      "🌟 Coach Maara with a fresh tip! Think of a loop like a counter that runs from 1 to 50. In your worksheet, you can write: `Step 1: For loop starting at 1 up to 50 with step +1`.",
      "🌟 Coach Maara encouraging you! We need a counting loop covering our range. Try writing: `Step 1: For loop from 1 to 50` in your worksheet!"
    ];
    const loopIndex = Math.max(0, attemptCount - 1) % loopHints.length;
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasOddCheck,
      hasPrint,
      ingredientsStepProgress,
      feedback: loopHints[loopIndex],
      correction: "Define loop controls: 'Step 1: For loop with Start: 1, Stop: 50, Step: +1'.",
      suggestedInput: "Step 1: For loop with Start: 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "for loop without start stop step"
    };
  }

  if (!hasOddCheck && !hasStepBy2Shortcut) {
    const oddHints = [
      "🌟 Coach Maara note: Loop is ready! Now we need Ingredient 2: How do we test if current number `i` is odd inside the loop?\n\nAdd an **If condition**:\n• **Left Side:** `i % 2`\n• **Operator:** `==`\n• **Right Side:** `1` (or Operator: `!=`, Right Side: `0`)",
      "🌟 Coach Maara checking back! Inside the loop, test if number is odd: Left Side: `i % 2`, Operator: `==`, Right Side: `1`.\n\n👉 Example: `Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 1`",
      "🌟 Coach Maara with a fresh tip! Remember that an odd number divided by 2 leaves remainder 1! In your worksheet, write: `Step 2: If condition (i % 2 == 1)`.",
      "🌟 Coach Maara encouraging you! To filter odd numbers, check the remainder: `Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 1`."
    ];
    const oddIndex = Math.max(0, attemptCount - 1) % oddHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasOddCheck: false,
      hasPrint,
      ingredientsStepProgress,
      feedback: oddHints[oddIndex],
      correction: "Add if condition: 'Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 1'.",
      suggestedInput: "Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 1\nStep 3: Inside if block: print(i)",
      matchedFirebaseInput: "step 2 : if condition for odd numbers"
    };
  }

  if (!hasPrint) {
    const printHints = [
      "🌟 Coach Maara note: Loop and odd check are in place! Now, what action do we take when the number is odd?\n\nAdd a **Print statement** inside the if condition to display the number: `print(i)`.",
      "🌟 Coach Maara checking back! Don't forget to output the number: `Step 3: print(i)` inside the if block.",
      "🌟 Coach Maara with a fresh tip! When the check passes, we want to see the number on screen. Add: `Step 3: display i`.",
      "🌟 Coach Maara encouraging you! Wrap up Ingredient 3 by outputting the verified odd number: `Step 3: Inside if block: print(i)`."
    ];
    const printIndex = Math.max(0, attemptCount - 1) % printHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasOddCheck: true,
      hasPrint: false,
      ingredientsStepProgress,
      feedback: printHints[printIndex],
      correction: "Add print statement: 'Step 3: Inside if block: print(i)'.",
      suggestedInput: "Step 3: Inside if block: print(i)",
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
    if (hasEvenCheckInstead) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look closely at your condition! You wrote \`${loopVar} % 2 == 0\`, which checks for **EVEN** numbers! For **ODD** numbers, test if the remainder is 1: \`if (${loopVar} % 2 == 1) {\` (or \`if (${loopVar} % 2 != 0) {\`).`,
        correction: `Change '${loopVar} % 2 == 0' to 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    if (hasConditionWithoutIf) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: You wrote \`${loopVar} % 2 == 1 {\` with the \`==\` operator, which is great thinking! But in programming, a conditional decision requires the \`if\` keyword. Wrap your condition in \`if (...)\`: \`if (${loopVar} % 2 == 1) {\`.`,
        correction: `Change '${loopVar} % 2 == 1 {' to 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    if (hasSingleEqual) {
      return {
        isFullyVerified: false,
        sampleCodeStepProgress,
        feedback: `🌟 Coach Maara note: Look closely at your comparison! You wrote a single \`=\` (\`${loopVar} % 2 = 1\`). In programming, \`=\` is for assignment, while \`==\` compares values. Update to: \`if (${loopVar} % 2 == 1) {\`.`,
        correction: `Use '==' instead of '=': 'if (${loopVar} % 2 == 1) {'.`
      };
    }
    const condHints = [
      `🌟 Coach Maara note: Loop from 1 to 50 is set! Now for Step 2: Inside the loop, how do we test if \`${loopVar}\` is an odd number using the modulo operator \`%\`?`,
      `🌟 Coach Maara checking back! Inside your loop, check if dividing by 2 leaves remainder 1: write an \`if\` condition with \`${loopVar} % 2 == 1\` (or \`${loopVar} % 2 != 0\`).`,
      `🌟 Coach Maara with a fresh tip! Add your decision block inside the loop: \`if (${loopVar} % 2 == 1) {\`. What action should run when this condition is true?`,
      `🌟 Coach Maara encouraging you! We need to filter only odd numbers. Write: \`if (${loopVar} % 2 == 1) {\` inside your loop body.`
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
        feedback: `🌟 Coach Maara note: In your print statement, you wrote text ('odd number') instead of the number itself! Print the loop variable \`${loopVar}\` so the program actually outputs 1, 3, 5...: \`print(${loopVar});\`.`,
        correction: `Change print target to the loop variable: 'print(${loopVar})'.`
      };
    }
    const printHints = [
      `🌟 Coach Maara note: Loop and odd check are both in place! Now for Step 3: What action displays the number when the odd check passes? Add a print statement inside your \`if\` block!`,
      `🌟 Coach Maara checking back! Inside your \`if\` condition, display the current odd number: write \`print(${loopVar});\` (or \`console.log(${loopVar});\`).`,
      `🌟 Coach Maara with a fresh tip! To output the numbers from 1 to 49, put \`print(${loopVar});\` inside the condition block. Give it a try!`,
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
      { stepNumber: 2, title: `2. Check if ${loopVar} % 2 == 1`, completed: true, current: false },
      { stepNumber: 3, title: "3. Print odd integer", completed: true, current: false },
      { stepNumber: 4, title: "4. Verify output 1 to 49", completed: true, current: false }
    ],
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program correctly loops from 1 to 50, checks for odd numbers (`" + loopVar + " % 2 == 1`), and prints each odd number! Outstanding job assembling all 4 steps! Proceed to the Compiler to compile and run your code across languages!",
    correction: "All done! Run the code in the compiler."
  };
}

