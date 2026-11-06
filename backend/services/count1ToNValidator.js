/**
 * CTC Pedagogy Validator for Problem 24: "Count Numbers from 1 to N"
 * Focuses on sequential counting and printing from 1 up to N using a loop.
 */

export function validateCount1ToNLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Direct Step Query Handling:
  const isAskingStep1 = /\b(?:first\s*step|step\s*1|starting\s*step|how\s*to\s*start|start\s*logic)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*1|first\s*step|start)\b/i.test(norm));
  const isAskingStep2 = /\b(?:second\s*step|step\s*2|how\s*to\s*increment|increment|add\s*1)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*2|second\s*step)\b/i.test(norm));
  const isAskingStep3 = /\b(?:third\s*step|step\s*3|stopping\s*limit|when\s*to\s*stop|finish\s*logic)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*3|third\s*step)\b/i.test(norm));

  if (isAskingStep1) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Starting number 1", completed: false, current: true },
        { stepNumber: 2, title: "2. Step increment (+1)", completed: false, current: false },
        { stepNumber: 3, title: "3. Stopping limit n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 1 of Logic (Starting Boundary)**:\n\nCounting starts from the very first natural number `1` for a given upper limit `n` (for example, `n = 5`).\n\n✍️ **Write this in your worksheet:**\n`Counting starts from 1 for a given limit n.`",
      correction: "Write: Counting starts from 1 for a given limit n.",
      suggestedInput: "Counting starts from 1 for a given limit n."
    };
  }

  if (isAskingStep2) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Starting number 1", completed: true, current: false },
        { stepNumber: 2, title: "2. Step increment (+1)", completed: false, current: true },
        { stepNumber: 3, title: "3. Stopping limit n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 2 of Logic (Step Increment)**:\n\nTo move sequentially through the count, we add 1 to the current number (+1 each step).\n\n✍️ **Write this in your worksheet:**\n`For each next number, we add 1 to the current number.`",
      correction: "Explain that for each next number we add 1 to the current number.",
      suggestedInput: "For each next number, we add 1 to the current number."
    };
  }

  if (isAskingStep3) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Starting number 1", completed: true, current: false },
        { stepNumber: 2, title: "2. Step increment (+1)", completed: true, current: false },
        { stepNumber: 3, title: "3. Stopping limit n", completed: false, current: true }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 3 of Logic (Stopping Limit)**:\n\nWe continue the sequential counting and stop when reaching upper limit `n`.\n\n✍️ **Write this in your worksheet:**\n`We continue counting by 1 and stop when reaching n.`",
      correction: "Explain that we continue counting by 1 until reaching n.",
      suggestedInput: "We continue counting by 1 and stop when reaching n."
    };
  }

  // Step 1: Starting boundary 1
  const hasStep1Start = /\b(?:starts?\s*(?:at|from)?\s*1|initial\s*(?:value|number)?\s*1|first\s*number\s*1|from\s*1)\b/.test(norm) ||
    /\b(?:1\s*to\s*n)\b/.test(norm);

  // Step 2: Increment (+1 / adding 1)
  const hasStep2Inc = /\b(?:add\s*1|increment\s*(?:by\s*1)?|\+1|step\s*(?:by\s*)?1|next\s*number\s*by\s*adding\s*1|one\s*by\s*one)\b/.test(norm) ||
    /\b(?:sequentially|next\s*number)\b/.test(norm);

  // Step 3: Stopping limit n
  const hasStep3End = /\b(?:stop\s*(?:at|when)?\s*n|reach(?:ing)?\s*n|up\s*to\s*n|limit\s*n|until\s*n|<=?\s*n)\b/.test(norm);

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Starting number 1", completed: hasStep1Start, current: !hasStep1Start },
    { stepNumber: 2, title: "2. Step increment (+1)", completed: hasStep2Inc, current: hasStep1Start && !hasStep2Inc },
    { stepNumber: 3, title: "3. Stopping limit n", completed: hasStep3End, current: hasStep1Start && hasStep2Inc && !hasStep3End }
  ];

  const isFullyVerified = (hasStep1Start && hasStep2Inc) || (hasStep1Start && hasStep3End);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Starting number 1", completed: true, current: false },
        { stepNumber: 2, title: "2. Step increment (+1)", completed: true, current: false },
        { stepNumber: 3, title: "3. Stopping limit n", completed: true, current: false }
      ],
      feedback: "🎉 **Logic Verified by Coach Maara!** 🏆\nExcellent breakdown! You clearly defined that counting begins at 1, increments by +1 sequentially, and stops upon reaching upper limit n.\n\nProceed to Stage 2: Recipe to structure the 5 algorithm steps!",
      correction: "Proceed to Stage 2: Recipe to list the chronological steps.",
      suggestedInput: void 0,
      matchedFirebaseInput: "Counting starts from 1 for a given limit n. For each next number, we add 1 to the current number. We continue counting and stop when reaching n."
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: "🌟 Coach Maara here! In Logic, clearly outline:\n1. Counting starts from `1` for upper limit `n`\n2. For each next step, we add 1 (+1)\n3. We continue until reaching `n`!",
    correction: "Describe counting starting from 1, adding 1 each time, and stopping at n.",
    suggestedInput: "Counting starts from 1 for a given limit n. For each next number, we add 1 to the current number. We continue counting and stop when reaching n."
  };
}

export function validateCount1ToNRecipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Direct Step Query Handling:
  const isAskingStep1 = /\b(?:first\s*step|step\s*1)\b/i.test(norm) && !/step\s*[2345]/.test(norm);
  const isAskingStep2 = /\b(?:second\s*step|step\s*2)\b/i.test(norm) && !/step\s*[1345]/.test(norm);
  const isAskingStep3 = /\b(?:third\s*step|step\s*3)\b/i.test(norm) && !/step\s*[1245]/.test(norm);
  const isAskingStep4 = /\b(?:fourth\s*step|step\s*4)\b/i.test(norm) && !/step\s*[1235]/.test(norm);
  const isAskingStep5 = /\b(?:fifth\s*step|step\s*5)\b/i.test(norm) && !/step\s*[1234]/.test(norm);

  if (isAskingStep1) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: false, hasStep2: false, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: false, current: true },
        { stepNumber: 2, title: "2. Start counting from 1", completed: false, current: false },
        { stepNumber: 3, title: "3. Display current number", completed: false, current: false },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: false, current: false },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 1 of Recipe**:\n\n**Step 1:** Get the upper limit number `n` from the user (e.g. `n = 5`).",
      correction: "Write: Step 1: Get the upper limit number n from the user.",
      suggestedInput: "Step 1: Get the upper limit number n from the user."
    };
  }

  if (isAskingStep2) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: false, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: true, current: false },
        { stepNumber: 2, title: "2. Start counting from 1", completed: false, current: true },
        { stepNumber: 3, title: "3. Display current number", completed: false, current: false },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: false, current: false },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 2 of Recipe**:\n\n**Step 2:** Start counting from number 1 (set `count = 1` or loop index `i = 1`).",
      correction: "Write: Step 2: Start counting from number 1.",
      suggestedInput: "Step 2: Start counting from number 1."
    };
  }

  if (isAskingStep3) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: true, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: true, current: false },
        { stepNumber: 2, title: "2. Start counting from 1", completed: true, current: false },
        { stepNumber: 3, title: "3. Display current number", completed: false, current: true },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: false, current: false },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 3 of Recipe**:\n\n**Step 3:** Display / print the current number.",
      correction: "Write: Step 3: Display the current number.",
      suggestedInput: "Step 3: Display the current number."
    };
  }

  if (isAskingStep4) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: true, hasStep3: true, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: true, current: false },
        { stepNumber: 2, title: "2. Start counting from 1", completed: true, current: false },
        { stepNumber: 3, title: "3. Display current number", completed: true, current: false },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: false, current: true },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 4 of Recipe**:\n\n**Step 4:** Add 1 to the current number to advance the count.",
      correction: "Write: Step 4: Add 1 to the current number.",
      suggestedInput: "Step 4: Add 1 to the current number."
    };
  }

  if (isAskingStep5) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: true, hasStep3: true, hasStep4: true, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: true, current: false },
        { stepNumber: 2, title: "2. Start counting from 1", completed: true, current: false },
        { stepNumber: 3, title: "3. Display current number", completed: true, current: false },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: true, current: false },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: false, current: true }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 5 of Recipe**:\n\n**Step 5:** Repeat steps 3 and 4 until reaching `n`.",
      correction: "Write: Step 5: Repeat steps 3 and 4 until reaching n.",
      suggestedInput: "Step 5: Repeat steps 3 and 4 until reaching n."
    };
  }

  // Step 1: Get input n
  const hasStep1 = /\b(?:get|input|read|take|initialize|set)\b.*?\b(?:n|limit|number)\b/.test(norm) ||
    /\b(?:n\s*=\s*\d+)\b/.test(norm);

  // Step 2: Start from 1
  const hasStep2 = /\b(?:start|begin|initialize|set)\b.*?\b(?:1|one)\b/.test(norm) ||
    /\b(?:from\s*1)\b/.test(norm);

  // Step 3: Print current number
  const hasStep3 = /\b(?:print|display|show|output)\b.*?\b(?:current|number|count|i)\b/.test(norm);

  // Step 4: Add 1 to current number
  const hasStep4 = /\b(?:add\s*1|increment|next\s*number|\+1)\b/.test(norm);

  // Step 5: Repeat until reaching n
  const hasStep5 = /\b(?:repeat|loop|continue|until\s*n|reaches\s*n)\b/.test(norm);

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Get upper limit n", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Start counting from 1", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. Display current number", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Add 1 to current number", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 },
    { stepNumber: 5, title: "5. Repeat until reaching n", completed: hasStep5, current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasStep5 }
  ];

  const count = [hasStep1, hasStep2, hasStep3, hasStep4, hasStep5].filter(Boolean).length;
  const isFullyVerified = count >= 3 || (hasStep1 && hasStep2 && hasStep3);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      hasStep1: true,
      hasStep2: true,
      hasStep3: true,
      hasStep4: true,
      hasStep5: true,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get upper limit n", completed: true, current: false },
        { stepNumber: 2, title: "2. Start counting from 1", completed: true, current: false },
        { stepNumber: 3, title: "3. Display current number", completed: true, current: false },
        { stepNumber: 4, title: "4. Add 1 to current number", completed: true, current: false },
        { stepNumber: 5, title: "5. Repeat until reaching n", completed: true, current: false }
      ],
      feedback: "🎉 **Recipe Verified by Coach Maara!** 🏆\nYour 5 sequential steps are structured logically and clearly! Proceed to Stage 3: Ingredients to choose your programming components.",
      correction: "Proceed to Stage 3: Ingredients to identify required variables and loop structures.",
      suggestedInput: void 0,
      matchedFirebaseInput: "1. Get input n from user. 2. Start counting from 1. 3. Display current number. 4. Add 1 to current number. 5. Repeat until reaching n."
    };
  }

  return {
    isFullyVerified: false,
    hasStep1, hasStep2, hasStep3, hasStep4, hasStep5,
    recipeStepProgress,
    feedback: "🌟 Coach Maara here! Make sure your Recipe includes:\n1. Get upper limit `n`\n2. Start counting from `1`\n3. Display current number\n4. Add 1 to current number\n5. Repeat until reaching `n`!",
    correction: "List the 5 steps: 1. Get n, 2. Start at 1, 3. Print current number, 4. Add 1, 5. Repeat until reaching n.",
    suggestedInput: "1. Get input n from user. 2. Start counting from 1. 3. Display current number. 4. Add 1 to current number. 5. Repeat until reaching n."
  };
}

export function validateCount1ToNIngredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Direct Step Query Handling:
  const isAskingStep1 = /\b(?:first\s*step|step\s*1|first\s*ingredient)\b/i.test(norm) && !/step\s*[23]/.test(norm);
  const isAskingStep2 = /\b(?:second\s*step|step\s*2|second\s*ingredient|loop)\b/i.test(norm) && !/step\s*[13]/.test(norm);
  const isAskingStep3 = /\b(?:third\s*step|step\s*3|third\s*ingredient|print)\b/i.test(norm) && !/step\s*[12]/.test(norm);

  if (isAskingStep1) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: false, current: true },
        { stepNumber: 2, title: "2. Loop 1 to n (step +1)", completed: false, current: false },
        { stepNumber: 3, title: "3. Print current number", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Ingredient 1**:\n\n**Variable `n`** to store the upper limit number given by the user.",
      correction: "Specify variable n for the upper limit.",
      suggestedInput: "variable n = 5"
    };
  }

  if (isAskingStep2) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop 1 to n (step +1)", completed: false, current: true },
        { stepNumber: 3, title: "3. Print current number", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Ingredient 2**:\n\n**For loop** configured with: start: 1, end: n, next step: +1.",
      correction: "Specify for loop with start: 1, end: n, next step: +1.",
      suggestedInput: "for loop: start: 1, end: n, next step: +1"
    };
  }

  if (isAskingStep3) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop 1 to n (step +1)", completed: true, current: false },
        { stepNumber: 3, title: "3. Print current number", completed: false, current: true }
      ],
      feedback: "🌟 Coach Maara here! Here is **Ingredient 3**:\n\n**Print statement** `print(i)` inside the loop to display each number.",
      correction: "Specify print(i) inside loop.",
      suggestedInput: "print(i) statement inside loop"
    };
  }

  // Ingredient 1: Variable n
  const hasVarN = /\b(?:variable\s*n|input\s*n|n\s*=\s*\d+|int\s*n|var\s*n|let\s*n)\b/.test(norm) ||
    /\b(?:n|limit)\b/.test(norm);

  // Ingredient 2: For loop (1 to n, step +1)
  const hasLoop = /\b(?:for\s*loop|loop\s*(?:from\s*)?1\s*to\s*n|start\s*:\s*1|end\s*:\s*n|\+1|step\s*:\s*\+?1)\b/.test(norm);

  // Ingredient 3: Print statement
  const hasPrint = /\b(?:print|display|console\s*log|print\s*\(?i\)?|show\s*number)\b/.test(norm);

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. Input variable n", completed: hasVarN, current: !hasVarN },
    { stepNumber: 2, title: "2. Loop 1 to n (step +1)", completed: hasLoop, current: hasVarN && !hasLoop },
    { stepNumber: 3, title: "3. Print current number", completed: hasPrint, current: hasVarN && hasLoop && !hasPrint }
  ];

  const isFullyVerified = (hasVarN && hasLoop) || (hasLoop && hasPrint);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      hasVarN: true,
      hasLoop: true,
      hasPrint: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop 1 to n (step +1)", completed: true, current: false },
        { stepNumber: 3, title: "3. Print current number", completed: true, current: false }
      ],
      feedback: "🎉 **Ingredients Verified by Coach Maara!** 🏆\nAll building blocks ready! You identified variable `n`, for loop (`start: 1, end: n, step: +1`), and `print(i)`.\n\nProceed to Stage 4: Taste the Sample!",
      correction: "Proceed to Stage 4: Taste the Sample to assemble your code prototype.",
      suggestedInput: void 0,
      matchedFirebaseInput: "use variable n, for loop (start: 1, end: n, next step: +1), print(i)"
    };
  }

  return {
    isFullyVerified: false,
    hasVarN,
    hasLoop,
    hasPrint,
    ingredientsStepProgress,
    feedback: "🌟 Coach Maara here! In Ingredients, list:\n1. Input variable `n`\n2. For loop: start: 1, end: n, next step: +1\n3. Print statement: `print(i)`!",
    correction: "Specify variable n, for loop (start: 1, end: n, next step: +1), and print statement print(i).",
    suggestedInput: "use variable n\nfor loop: start: 1, end: n, next step: +1\nprint(i) inside loop"
  };
}

export function validateCount1ToNSampleCode(text, attemptCount = 1) {
  const raw = text || "";
  const norm = raw.toLowerCase();

  // Check loop: for (var i = 1; i <= n; i++)
  const hasLoop = /for\s*\(\s*(?:var|let|int)?\s*[a-zA-Z_]\w*\s*=\s*1\s*;\s*[a-zA-Z_]\w*\s*<=\s*(?:n|\d+)\s*;\s*[a-zA-Z_]\w*(?:\+\+|\s*\+=\s*1)\s*\)/i.test(raw) ||
    /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*1\s*,\s*(?:n|\d+)\s*(?:\+\s*1)?\s*\)/i.test(raw) ||
    /while\s*\(\s*[a-zA-Z_]\w*\s*<=\s*(?:n|\d+)\s*\)/i.test(raw);

  // Check variable declaration
  const hasVar = /(?:var|let|const|int)\s+[a-zA-Z_]\w*\s*=/i.test(raw) || /n\s*=\s*\d+/i.test(raw);

  // Check print statement
  const hasPrint = /(?:print|console\.log|cout|printf|System\.out)/i.test(raw);

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: "1. Declare variable n", completed: hasVar, current: !hasVar },
    { stepNumber: 2, title: "2. Setup loop 1 to n", completed: hasLoop, current: hasVar && !hasLoop },
    { stepNumber: 3, title: "3. Print i inside loop", completed: hasPrint, current: hasVar && hasLoop && !hasPrint },
    { stepNumber: 4, title: "4. Verify sequential output", completed: hasVar && hasLoop && hasPrint, current: false }
  ];

  const isFullyVerified = hasLoop && hasPrint;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "1. Declare variable n", completed: true, current: false },
        { stepNumber: 2, title: "2. Setup loop 1 to n", completed: true, current: false },
        { stepNumber: 3, title: "3. Print i inside loop", completed: true, current: false },
        { stepNumber: 4, title: "4. Verify sequential output", completed: true, current: false }
      ],
      feedback: "🎉 **Sample Code Verified & Passed!** 🏆\nYour sequential counting code is assembled cleanly! You are ready to open the Compiler and run the code.",
      correction: "All done! Run the code in the compiler.",
      suggestedInput: void 0
    };
  }

  return {
    isFullyVerified: false,
    sampleCodeStepProgress,
    feedback: "🌟 Coach Maara here! Here is the clean sample code to count from 1 to N:\n```javascript\nvar n = 5;\nfor (var i = 1; i <= n; i++) {\n    print(i);\n}\n```",
    correction: "Write a loop from 1 to n and print i inside the loop.",
    suggestedInput: "var n = 5;\nfor (var i = 1; i <= n; i++) {\n    print(i);\n}"
  };
}

