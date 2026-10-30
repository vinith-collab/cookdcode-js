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
        "🌟 Coach Maara here to guide you across the finish line! Here is the complete logic statement for your worksheet:\n\n👉 `An even number is divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.`\n\nTry typing this statement into your worksheet!",
        "🌟 Coach Maara cheering you on! Remember our 2 core logic ingredients:\n1. **Range:** Test all numbers from 1 up to 50.\n2. **Even Test:** Check if `number % 2 == 0` (dividing by 2 leaves remainder 0).\n\nCombine these into a simple statement in your worksheet!",
        "🌟 Coach Maara with a fresh perspective! Think of this as filtering numbers from 1 to 50: for each number, if `number % 2 == 0`, it is an even number! State this in simple words in your worksheet."
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

  const completedCount = [hasStep1, hasStep2, hasStep3, hasStep4].filter(Boolean).length;
  const isFullyVerified = hasStep1 && hasStep2 && hasStep3;

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
  const hasLoopStart = /\bstart\s*[:=\s]\s*\(?\s*[12]\b/i.test(withoutStepHeaders) ||
    /\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*[12]\b/i.test(withoutStepHeaders) ||
    /\bi\s*=\s*[12]\b/i.test(withoutStepHeaders) ||
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
  const hasCompleteLoop = hasLoopKeyword && hasRange1To50;

  // Check if condition (left side: i % 2, op: ==, right side: 0)
  const hasIfCondition = /\bif\b/i.test(norm) || /\bcondition\b/i.test(norm) || /\bcheck\b/i.test(norm);
  const hasMod2 = /%\s*2\b/i.test(norm) || /divide\s*by\s*2/i.test(norm) || /divisible\s*by\s*2/i.test(norm) || /remainder/i.test(norm) || /leftover/i.test(norm);
  const hasEqualsZero = /==\s*0\b/i.test(norm) || /=\s*0\b/i.test(norm) || /right\s*side\s*[:=]?\s*0\b/i.test(norm) || /remainder\s*(?:is|==|=)?\s*0\b/i.test(norm) || /leftover\s*(?:is|==|=)?\s*0\b/i.test(norm) || /zero/i.test(norm);

  const hasStepBy2Shortcut = hasExplicitLoopStep && (/step\s*[:=\s]\s*\(?\s*\+?2\b/i.test(withoutStepHeaders) || /\bi\s*\+=\s*2\b/i.test(withoutStepHeaders) || /step\s*\(\s*\+?2\s*\)/i.test(withoutStepHeaders));

  // Print statement
  const hasPrint = /\b(?:print|display|console\.log|show|output|write)\b/i.test(norm);

  const hasEvenCheck = (hasIfCondition && (hasMod2 || hasEqualsZero)) || (hasMod2 && hasEqualsZero) || hasStepBy2Shortcut || /i\s*%\s*2\s*==\s*0/i.test(norm);

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. For loop with Start: 1 (or 2), Stop: 50 (i <= 50), Step: +1 (or +2)", completed: hasCompleteLoop, current: !hasCompleteLoop },
    { stepNumber: 2, title: "2. If condition (Left Side: i % 2, Operator: ==, Right Side: 0)", completed: Boolean(hasEvenCheck), current: hasCompleteLoop && !hasEvenCheck },
    { stepNumber: 3, title: "3. Print statement inside loop to print the even number", completed: Boolean(hasPrint), current: hasCompleteLoop && hasEvenCheck && !hasPrint }
  ];

  // If user only wrote "for loop" or didn't provide complete loop controls:
  if (!hasCompleteLoop) {
    const loopHints = [
      "🌟 Coach Maara note: To find even numbers between 1 and 50, our first ingredient must be a **Loop** to iterate through all numbers from 1 to 50.\n\nDefine a **For loop** in your worksheet:\n• **Start:** 1 (or 2)\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)\n\n👉 Example: `Step 1: For loop from 1 to 50 (Start: 1, Stop: 50, Step: +1)`",
      "🌟 Coach Maara checking back! For Ingredient 1, define the 3 loop controls clearly in your worksheet:\n• **Start:** 1 (or 2)\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)\n\n👉 Example: `Step 1: For loop with Start: 1, Stop: 50, Step: +1`",
      "🌟 Coach Maara with a fresh tip! Think of a loop like a counter that runs from 1 to 50. In your worksheet, you can write: `Step 1: For loop starting at 1 up to 50 with step +1`.",
      "🌟 Coach Maara encouraging you! We need a counting loop covering our range. Try writing: `Step 1: For loop from 1 to 50` in your worksheet!"
    ];
    const loopIndex = Math.max(0, attemptCount - 1) % loopHints.length;
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasEvenCheck,
      hasPrint,
      ingredientsStepProgress,
      feedback: loopHints[loopIndex],
      correction: "Define loop controls: 'Step 1: For loop with Start: 1, Stop: 50, Step: +1'.",
      suggestedInput: "Step 1: For loop with Start: 1, Stop: 50, Step: +1",
      matchedFirebaseInput: "for loop without start stop step"
    };
  }

  if (!hasEvenCheck && !hasStepBy2Shortcut) {
    const evenHints = [
      "🌟 Coach Maara note: Loop is ready! Now we need Ingredient 2: How do we test if the current number `i` is even inside the loop?\n\nAdd an **If condition**:\n• **Left Side:** `i % 2`\n• **Operator:** `==`\n• **Right Side:** `0`",
      "🌟 Coach Maara checking back! Inside the loop, test if number is even: Left Side: `i % 2`, Operator: `==`, Right Side: `0`.\n\n👉 Example: `Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0`",
      "🌟 Coach Maara with a fresh tip! Remember that an even number divided by 2 leaves remainder 0! In your worksheet, write: `Step 2: If condition (i % 2 == 0)`.",
      "🌟 Coach Maara encouraging you! To filter even numbers, compare the remainder: `Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0`."
    ];
    const evenIndex = Math.max(0, attemptCount - 1) % evenHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: false,
      hasPrint,
      ingredientsStepProgress,
      feedback: evenHints[evenIndex],
      correction: "Add if condition: 'Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0'.",
      suggestedInput: "Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0\nStep 3: Inside if block: print(i)",
      matchedFirebaseInput: "step 2 : if condition for even numbers"
    };
  }

  if (!hasPrint) {
    const printHints = [
      "🌟 Coach Maara note: Loop and even check are in place! Now, what action do we take when the number is even?\n\nAdd a **Print statement** inside the if condition to display the number: `print(i)`.",
      "🌟 Coach Maara checking back! Don't forget to output the number: `Step 3: print(i)` inside the if block.",
      "🌟 Coach Maara with a fresh tip! When the check passes, we want to see the number on screen. Add: `Step 3: display i`.",
      "🌟 Coach Maara encouraging you! Wrap up Ingredient 3 by outputting the verified even number: `Step 3: Inside if block: print(i)`."
    ];
    const printIndex = Math.max(0, attemptCount - 1) % printHints.length;
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: true,
      hasPrint: false,
      ingredientsStepProgress,
      feedback: printHints[printIndex],
      correction: "Add print statement: 'Step 3: Inside if block: print(i)'.",
      suggestedInput: "Step 3: Inside if block: print(i)",
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
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara here! Let's assemble our verified ingredients into working code. Start by writing the loop from 1 to 50!",
      correction: "Write a for loop from 1 to 50 with if (i % 2 == 0) and print(i)."
    };
  }

  const norm = code.toLowerCase().trim();
  const issues = [];

  // 1. Detect conversational questions mixed into code editor
  const hasQuestion = /\b(?:how\s*to|what\s*is|how\s*do|why|help|puriyala|theriyala)\b/i.test(norm) ||
    /^(?:how|what|why|can\s*i)\b/i.test(norm) ||
    norm.includes("?");
  if (hasQuestion) {
    issues.push("• **Question text in editor:** Remove conversational questions (like 'how to define...') from the code editor so only executable code remains.");
  }

  // 2. Loop detection
  const hasLoop = /\b(?:for|while)\b/i.test(norm);
  const has50 = /\b50\b/.test(norm) || /\b51\b/.test(norm);
  if (!hasLoop || !has50) {
    issues.push("• **Loop boundary:** Ensure your loop iterates from 1 up to 50 (e.g. `for (var i = 1; i <= 50; i++)`).");
  }

  // Detect loop variable (e.g. "for (var i = 1" -> "i", "for i in range" -> "i", "for (let num = 1" -> "num")
  const loopVarMatch = code.match(/for\s*(?:\(\s*(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*(?:=|in|<=)/i) ||
    code.match(/while\s*\(\s*([a-zA-Z_]\w*)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : "i";

  const hasStep2 = /\+=\s*2\b/.test(norm) || /,\s*2\s*\)/.test(norm);
  const hasIfKeyword = /\bif\b/i.test(norm);
  const hasMod2 = /%\s*2\b/.test(norm);
  const hasConditionWithoutIf = !hasIfKeyword && (/% 2\s*==\s*0/.test(norm) || /%\s*2\s*==/.test(norm));

  if (!hasStep2) {
    if (hasConditionWithoutIf) {
      issues.push(`• **Missing \`if\` keyword:** You wrote \`${loopVar} % 2 == 0 {\` with the \`==\` operator, but the condition check is missing the \`if\` keyword! Change it to: \`if (${loopVar} % 2 == 0) {\`.`);
    } else if (!hasIfKeyword || !hasMod2) {
      issues.push(`• **Even number condition:** Inside the loop, test if the number is even with an if condition: \`if (${loopVar} % 2 == 0)\`.`);
    }
  }

  // 3. Print check
  const hasPrint = /\b(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<)\b/i.test(norm);
  const printsStringOrText = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?`, "i").test(norm);
  const printsLoopVar = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*${loopVar}\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*${loopVar}\\b`, "i").test(norm);

  if (!hasPrint) {
    issues.push(`• **Print output missing:** Add a print statement inside the condition to display the even number: \`print(${loopVar})\`.`);
  } else if (printsStringOrText && !printsLoopVar) {
    issues.push(`• **Wrong print target:** In \`print(even number)\`, you are printing the text 'even number' instead of the number itself! Update it to print your loop variable: \`print(${loopVar})\` (or \`console.log(${loopVar})\`).`);
  }

  if (issues.length > 0) {
    let header;
    if (attemptCount >= 3) {
      header = "🌟 Coach Maara here! We are so close! Let's solve the remaining issues together:";
    } else if (attemptCount === 2) {
      header = "🌟 Coach Maara checking back! Good progress on your code. Please address these adjustments:";
    } else {
      header = "🌟 Coach Maara here! Good effort! You have the loop and you've used the `==` comparison operator, but there are a few adjustments needed:";
    }
    const feedback = `${header}\n\n${issues.join("\n\n")}\n\n👉 Fix these lines in your code editor and try again!`;
    return {
      isFullyVerified: false,
      feedback,
      correction: "Fix the identified syntax issues: add 'if', print variable " + loopVar + ", and remove question text."
    };
  }

  return {
    isFullyVerified: true,
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program correctly loops from 1 to 50, checks for even numbers, and prints each even number! Fantastic job mastering this challenge! Proceed to the Compiler to compile and run your code!",
    correction: "All done! Run the code in the compiler."
  };
}

