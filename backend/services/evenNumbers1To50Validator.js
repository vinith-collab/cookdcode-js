/**
 * CTC Pedagogy Validator for Problem 21: "Print Even Numbers from 1 to 50"
 * Focuses on loop iteration from 1 to 50 combined with modulo divisibility by 2 or step of 2.
 */

export function validateEvenNumbers1To50Logic(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();

  const isQuestion = norm.endsWith("?") ||
    /\b(?:how|what|why|help|puriyala|theriyala|doubt|know|rule|explain|start|where)\b/i.test(norm);

  if (isQuestion || norm.length < 5) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara here! Even numbers are numbers exactly divisible by 2 (leaving a remainder of 0: `number % 2 == 0`). Between 1 and 50, the even numbers are 2, 4, 6, 8, ... up to 50!\n\n👉 Explain in simple words: How do we identify even numbers from 1 to 50?",
      correction: "Even numbers leave remainder 0 when divided by 2 (n % 2 == 0). From 1 to 50, we check each number and print if remainder is 0.",
      suggestedInput: "An even number is completely divisible by 2 with remainder 0 (number % 2 == 0). From 1 to 50, the even numbers are 2, 4, 6, 8 ... up to 50.",
      matchedFirebaseInput: "what are even numbers from 1 to 50"
    };
  }

  const mentionsEven = /\beven\b/i.test(norm);
  const mentions2 = /\b2\b|two/i.test(norm);
  const mentions50 = /\b50\b|fifty/i.test(norm);
  const mentionsRemainderOrMod = /remainder|rem\b|modulo|%|divide|divisible/i.test(norm);
  const mentionsLoopOrRange = /1\s*(?:to|-)\s*50|range|each|every|all\s*numbers|loop|repeat/i.test(norm);

  const hasEvenMathFact = /%\s*2\s*(=|==)\s*0/i.test(norm) ||
    /2,\s*4,\s*6/i.test(norm) ||
    (mentionsEven && (mentions2 || mentionsRemainderOrMod));

  if (!hasEvenMathFact) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara note: Remember, a number is even if dividing by 2 leaves a remainder of 0 (`number % 2 == 0`). How do we apply this rule to numbers from 1 to 50?",
      correction: "Define even numbers using remainder 0 with 2: 'number % 2 == 0'.",
      suggestedInput: "A number is even if number % 2 == 0. From 1 to 50, numbers like 2, 4, 6 ... 50 are even numbers.",
      matchedFirebaseInput: "how to identify even numbers"
    };
  }

  return {
    isFullyVerified: true,
    feedback: "🎉 **Logic Approved by Coach Maara!** 🏆\nExcellent understanding! Even numbers leave remainder 0 when divided by 2 (`number % 2 == 0`). You have correctly identified the rule and the target range 1 to 50.\n\nProceed to Stage 2: Recipe!",
    correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
    suggestedInput: void 0,
    matchedFirebaseInput: "even numbers leave remainder 0 when divided by 2"
  };
}

export function validateEvenNumbers1To50Recipe(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();

  // Recipe steps:
  // 1. Loop / Count from 1 to 50
  // 2. Check if number is divisible by 2 (or count by 2s)
  // 3. Print / Display the even number
  // 4. Repeat until reaching 50
  const hasStep1 = norm.includes("1") && (norm.includes("50") || norm.includes("start") || norm.includes("count") || norm.includes("from 1"));
  const hasStep2 = norm.includes("divisible by 2") || norm.includes("divide by 2") || norm.includes("remainder 0") || norm.includes("% 2") || norm.includes("even") || norm.includes("step of 2") || norm.includes("add 2");
  const hasStep3 = norm.includes("display") || norm.includes("print") || norm.includes("show") || norm.includes("output");
  const hasStep4 = norm.includes("repeat") || norm.includes("next") || norm.includes("continue") || norm.includes("until 50") || norm.includes("50");

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Start counting from 1 up to 50", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Check if current number is divisible by 2", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. Display the number if it is even", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Repeat until reaching 50", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 }
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

  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: `🌟 Coach Maara here! You have completed ${completedCount} of 4 recipe steps. Make sure to describe:
1. Start counting numbers from 1 to 50.
2. Check if the current number is divisible by 2.
3. Display the number if it is even.
4. Repeat for all numbers up to 50.`,
    correction: "Outline all 4 steps: 1) Start at 1, 2) Check if divisible by 2, 3) Display if even, 4) Repeat up to 50.",
    suggestedInput: "Step 1: Start counting from 1 up to 50\nStep 2: Check if current number is divisible by 2 (remainder 0)\nStep 3: If divisible by 2, display the number\nStep 4: Repeat until reaching 50",
    matchedFirebaseInput: "how to write recipe for even numbers 1 to 50"
  };
}

export function validateEvenNumbers1To50Ingredients(text) {
  const norm = (text || "").toLowerCase();

  // Strip worksheet step labels ("Step 1:", "Step 2:", etc.) at line starts so they are not confused with loop steps
  const withoutStepHeaders = norm.replace(/(?:^|\n)\s*step\s*\d+\s*[:\-]/gi, "\n");

  const hasLoopKeyword = /\b(?:for\s+loop|while\s+loop|for\s*\(|while\s*\(|for\s+\w+\s+in|\bloop\b)/i.test(norm);

  // Check Start: must specifically define start value (1 or 2)
  const hasLoopStart = /\bstart\s*[:=\s]\s*\(?\s*[12]\b/i.test(withoutStepHeaders) ||
    /\b(?:start\s*at|starts?\s*at|starts?\s*with|starting\s*from|from)\s*[12]\b/i.test(withoutStepHeaders) ||
    /\bi\s*=\s*[12]\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,/i.test(withoutStepHeaders);

  // Check Stop: must specifically define limit up to 50
  const hasLoopStop = /\bstop\s*[:=\s]\s*\(?\s*(?:i\s*<=?\s*)?50\b/i.test(withoutStepHeaders) ||
    /\b(?:up\s*to|to|till|until|limit)\s*50\b/i.test(withoutStepHeaders) ||
    /\bi\s*<=?\s*50\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,\s*5[01]\b/i.test(withoutStepHeaders);

  // Check Step: must define increment (+1 or +2 or i++ or i+=2)
  const hasLoopStep = /\b(?:next\s*step|step)\s*[:=\s]\s*\(?\s*\+?[12]\b/i.test(withoutStepHeaders) ||
    /\bi\+\+/i.test(withoutStepHeaders) ||
    /\bi\s*\+=\s*[12]\b/i.test(withoutStepHeaders) ||
    /\bstep\s*\(\s*\+?[12]\s*\)/i.test(withoutStepHeaders) ||
    /\bincrement\s*by\s*[12]\b/i.test(withoutStepHeaders) ||
    /\brange\s*\(\s*[12]\s*,\s*5[01]\s*,\s*[12]\s*\)/i.test(withoutStepHeaders);

  const hasCompleteLoop = hasLoopKeyword && hasLoopStart && hasLoopStop && hasLoopStep;

  // Check if condition (left side: i % 2, op: ==, right side: 0)
  const hasIfCondition = /\bif\b/i.test(norm);
  const hasMod2 = /%\s*2\b/i.test(norm) || /divide\s*by\s*2/i.test(norm) || /remainder/i.test(norm);
  const hasEqualsZero = /==\s*0\b/i.test(norm) || /right\s*side\s*[:=]?\s*0\b/i.test(norm) || /remainder\s*is\s*0\b/i.test(norm);

  const hasStepBy2Shortcut = hasLoopStep && (/step\s*[:=\s]\s*\(?\s*\+?2\b/i.test(withoutStepHeaders) || /\bi\s*\+=\s*2\b/i.test(withoutStepHeaders) || /step\s*\(\s*\+?2\s*\)/i.test(withoutStepHeaders));

  // Print statement
  const hasPrint = /\b(?:print|display|console\.log)\b/i.test(norm);

  const hasEvenCheck = (hasIfCondition && (hasMod2 || hasEqualsZero)) || hasStepBy2Shortcut;

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. For loop with Start: 1 (or 2), Stop: 50 (i <= 50), Step: +1 (or +2)", completed: hasCompleteLoop, current: !hasCompleteLoop },
    { stepNumber: 2, title: "2. If condition (Left Side: i % 2, Operator: ==, Right Side: 0)", completed: Boolean(hasEvenCheck), current: hasCompleteLoop && !hasEvenCheck },
    { stepNumber: 3, title: "3. Print statement inside loop to print the even number", completed: Boolean(hasPrint), current: hasCompleteLoop && hasEvenCheck && !hasPrint }
  ];

  // If user only wrote "for loop" or didn't provide complete loop controls:
  if (!hasCompleteLoop) {
    if (hasLoopKeyword) {
      return {
        isFullyVerified: false,
        hasLoop: false,
        hasEvenCheck,
        hasPrint,
        ingredientsStepProgress,
        feedback: "🌟 Coach Maara note: You have chosen the right tool—a **For loop**! 👏\n\nNow, define the 3 essential loop controls for counting from 1 to 50:\n• **Start:** 1 (or 2)\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)\n\n👉 Example: `Step 1: For loop with Start: 1, Stop: 50, Step: +1`",
        correction: "Define loop controls: 'Step 1: For loop with Start: 1, Stop: 50, Step: +1'.",
        suggestedInput: "Step 1: For loop with Start: 1 (i = 1), Stop: 50 (i <= 50), Step: +1 (i++)\nStep 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0\nStep 3: Inside if block: print(i)",
        matchedFirebaseInput: "for loop without start stop step"
      };
    }
    return {
      isFullyVerified: false,
      hasLoop: false,
      hasEvenCheck,
      hasPrint,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maara note: To print even numbers from **1 to 50**, we need a **Loop** to iterate through all numbers from 1 to 50.\n\nDefine a **For loop** with:\n• **Start:** 1 (or 2)\n• **Stop:** 50 (`i <= 50`)\n• **Step:** +1 (or +2)",
      correction: "Add the loop ingredient: 'Step 1: For loop with Start: 1, Stop: 50, Step: +1'.",
      suggestedInput: "Step 1: For loop with Start: 1 (i = 1), Stop: 50 (i <= 50), Step: +1 (i++)\nStep 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0\nStep 3: Inside if block: print(i)",
      matchedFirebaseInput: "step 1 : variable a step 2 : if condition without loop"
    };
  }

  if (!hasEvenCheck && !hasStepBy2Shortcut) {
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: false,
      hasPrint,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maara note: Great job setting up the loop from 1 to 50! Now, inside the loop, how do we test if the current number `i` is even?\n\nAdd an **If condition**:\n• **Left Side:** `i % 2`\n• **Operator:** `==`\n• **Right Side:** `0`",
      correction: "Add if condition: 'Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0'.",
      suggestedInput: "Step 2: If condition with Left Side: i % 2, Operator: ==, Right Side: 0\nStep 3: Inside if block: print(i)",
      matchedFirebaseInput: "step 2 : if condition for even numbers"
    };
  }

  if (!hasPrint) {
    return {
      isFullyVerified: false,
      hasLoop: true,
      hasEvenCheck: true,
      hasPrint: false,
      ingredientsStepProgress,
      feedback: "🌟 Coach Maara note: Loop and even check are in place! Now, what action do we take when the number is even?\n\nAdd a **Print statement** inside the if condition to display the number: `print(i)`.",
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
    ingredientsStepProgress,
    feedback: "🎉 **Ingredients Verified!** 🏆 Brilliant work! You have gathered all necessary ingredients: the loop from 1 to 50, the even divisibility check (`i % 2 == 0`), and the print statement inside the loop. Proceed to Stage 4: Taste the Sample!",
    correction: "Proceed to Stage 4: Taste the Sample to assemble your verified ingredients into working code.",
    suggestedInput: void 0,
    matchedFirebaseInput: "ingredients for even numbers 1 to 50 verified"
  };
}

export function validateEvenNumbers1To50SampleCode(code) {
  if (!code || typeof code !== "string" || code.trim().length < 5) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara here! Let's assemble our verified ingredients into working code. Start by writing the loop from 1 to 50!",
      correction: "Write a for loop from 1 to 50 with if (i % 2 == 0) and print(i)."
    };
  }

  const norm = code.toLowerCase().trim();

  // 1. Detect conversational questions mixed into code editor
  const hasQuestion = /\b(?:how\s*to|what\s*is|how\s*do|why|help|puriyala|theriyala)\b/i.test(norm) ||
    /^(?:how|what|why|can\s*i)\b/i.test(norm) ||
    norm.includes("?");

  if (hasQuestion) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara here! I see you asked a question in the code editor. To write the loop for even numbers from 1 to 50, start with:\n`for (var i = 1; i <= 50; i++) {`\nand inside it check `if (i % 2 == 0)` and print `i`! Remove the question from the editor and try writing the code.",
      correction: "Remove question text from the code editor and write the code prototype."
    };
  }

  // 2. Loop detection
  const hasLoop = /\b(?:for|while)\b/i.test(norm);
  const has50 = /\b50\b/.test(norm) || /\b51\b/.test(norm);

  if (!hasLoop || !has50) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara note: To print even numbers from 1 to 50, you need a loop that iterates up to 50 (e.g. `for (var i = 1; i <= 50; i++)` in JS or `for i in range(1, 51):` in Python).",
      correction: "Include a loop that counts from 1 up to 50."
    };
  }

  // Detect loop variable (e.g. "for (var i = 1" -> "i", "for i in range" -> "i", "for (let num = 1" -> "num")
  const loopVarMatch = code.match(/for\s*(?:\(\s*(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*(?:=|in|<=)/i) ||
    code.match(/while\s*\(\s*([a-zA-Z_]\w*)/i);
  const loopVar = loopVarMatch ? loopVarMatch[1] : "i";

  // Check if stepping by 2 directly (e.g. i += 2 or range(2, 51, 2))
  const hasStep2 = /\+=\s*2\b/.test(norm) || /,\s*2\s*\)/.test(norm);

  // 3. If condition check (when not stepping by 2)
  const hasIfKeyword = /\bif\b/i.test(norm);
  const hasMod2 = /%\s*2\b/.test(norm);

  // Check specific mistake: wrote "i % 2 == 0 {" WITHOUT "if" keyword!
  const hasConditionWithoutIf = !hasIfKeyword && (/% 2\s*==\s*0/.test(norm) || /%\s*2\s*==/.test(norm));
  if (hasConditionWithoutIf) {
    return {
      isFullyVerified: false,
      feedback: `🌟 Coach Maara note: Look at \`${loopVar} % 2 == 0 {\`! In programming, condition checks must start with the \`if\` keyword: \`if (${loopVar} % 2 == 0) {\`. Add \`if\` before your condition!`,
      correction: `Add the 'if' keyword before your condition: if (${loopVar} % 2 == 0) {`
    };
  }

  if (!hasStep2 && (!hasIfKeyword || !hasMod2)) {
    return {
      isFullyVerified: false,
      feedback: `🌟 Coach Maara note: Inside the loop, check if the current number is even using an if condition: \`if (${loopVar} % 2 == 0)\`!`,
      correction: `Add 'if (${loopVar} % 2 == 0)' check inside the loop.`
    };
  }

  // 4. Print check
  const hasPrint = /\b(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<)\b/i.test(norm);
  if (!hasPrint) {
    return {
      isFullyVerified: false,
      feedback: `🌟 Coach Maara note: Don't forget to display the even number! Add \`print(${loopVar})\` or \`console.log(${loopVar})\` inside your if condition.`,
      correction: `Add print statement inside the loop: print(${loopVar})`
    };
  }

  // Check specific mistake: printing text/string like print(even number) or print("even number") instead of loop counter variable!
  const printsStringOrText = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*["']?(?:even(?:\\s*number)?|odd|number)["']?`, "i").test(norm);

  const printsLoopVar = new RegExp(`(?:print|println|printf|console\\.log)\\s*\\(\\s*${loopVar}\\s*\\)`, "i").test(norm) ||
    new RegExp(`cout\\s*<<\\s*${loopVar}\\b`, "i").test(norm);

  if (printsStringOrText && !printsLoopVar) {
    return {
      isFullyVerified: false,
      feedback: `🌟 Coach Maara note: You are printing the text 'even number' instead of the actual number! The challenge is to print each even number (2, 4, 6... up to 50). Update your print statement to print the loop variable: \`print(${loopVar})\` (or \`console.log(${loopVar})\`)!`,
      correction: `Print the loop counter variable: print(${loopVar})`
    };
  }

  return {
    isFullyVerified: true,
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program correctly loops from 1 to 50, checks for even numbers, and prints each even number! Fantastic job mastering this challenge! Proceed to the Compiler to compile and run your code!",
    correction: "All done! Run the code in the compiler."
  };
}

