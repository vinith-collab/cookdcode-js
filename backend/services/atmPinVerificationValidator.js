/**
 * CTC Pedagogy Validator for Problem 23: "ATM PIN Verification"
 * Focuses on variable input, equality comparison (==), and two-way branch (if-else).
 */

export function validateAtmPinVerificationLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*><!/]/g, " ").replace(/\s+/g, " ").trim();

  // Step 1: Registered PIN reference (1234 or any 4-digit PIN like 2006)
  const hasStep1Pin = /\b(?:1234|pin|secret|stored\s*pin|registered\s*pin|bank\s*pin|actual\s*pin|saved\s*pin|\d{4})\b/.test(norm);

  // Step 2: Equality comparison rule (equals, match, identical, same, ==)
  const hasStep2Comparison = /==\s*\d+\b/.test(norm) ||
    /\b(?:equal|equals|match|matches|matching|identical|same\s*as|check\s*if\s*same|is\s*\d+)\b/.test(norm) ||
    /==/.test(norm);

  // Step 3: Approved outcome (PIN Verified / Access Granted / Valid)
  const hasStep3Approved = /\b(?<!not\s+|not|in)(?:verified|valid|approved|access\s*granted|allow|granted|success|login)\b/.test(norm);

  // Step 4: Rejected outcome (Incorrect PIN / Access Denied / Invalid / Not Valid)
  const hasStep4Rejected = /\b(?:incorrect|invalid|not\s*valid|notvalid|denied|access\s*denied|reject|wrong|fail|error|not\s*match)\b/.test(norm);

  // CRITICAL SEMANTIC RELATION CHECK: Detect inverted / backwards logic!
  // e.g. "if match it is notvalid" or "otherwise not match valid"
  const isDirectMatchInvalid = /(?<!not\s+|does\s*not\s*|doesn't\s*)\b(?:match(?:es|ing)?|equals?|==|identical|same|is\s*\d+|matches\s*with\s*\d+)\b(?:(?!\b(?:otherwise|else|mismatch|not\s*match|different)\b).)*?\b(?:not\s*valid|notvalid|invalid|incorrect|denied|reject(?:ed)?|wrong|fail(?:ure|ed)?)\b/i.test(norm);
  const isDirectMismatchValid = /\b(?:otherwise|else|not\s*match(?:es|ing)?|mismatch|not\s*equal|different)\b(?:(?!\b(?:when|if\s*(?!not)match|if\s*(?!not)equal)\b).)*?\b(?<!not\s+|not|in)(?:valid|verified|approved|granted|allow(?:ed)?|success)\b/i.test(norm);
  const isInvertedLogic = isDirectMatchInvalid || isDirectMismatchValid;

  if (isInvertedLogic) {
    return {
      isFullyVerified: false,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Registered PIN reference (1234)", completed: hasStep1Pin, current: false },
        { stepNumber: 2, title: "2. Comparison rule (matches 1234)", completed: hasStep2Comparison, current: false },
        { stepNumber: 3, title: "3. Approved outcome (PIN Verified)", completed: false, current: true },
        { stepNumber: 4, title: "4. Rejected outcome (Incorrect PIN)", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara note: Check the cause-and-effect relationship in your logic!\nWhen the entered PIN matches the registered PIN, access must be approved ('PIN Verified' / 'Valid').\nWhen it does NOT match, access must be rejected ('Incorrect PIN' / 'Not Valid').\nCurrently, your statement has these reversed (matching leads to invalid). Swap them so matching grants access!",
      correction: "Swap the outcomes: When the PIN matches, it is Valid (PIN Verified). When it does not match, it is Incorrect (Not Valid).",
      suggestedInput: "If the entered PIN matches 1234, display 'PIN Verified'; otherwise, display 'Incorrect PIN'.",
      matchedFirebaseInput: "what if pin matches in logic?"
    };
  }

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Registered PIN reference (1234)", completed: hasStep1Pin, current: !hasStep1Pin },
    { stepNumber: 2, title: "2. Comparison rule (matches 1234)", completed: hasStep2Comparison, current: hasStep1Pin && !hasStep2Comparison },
    { stepNumber: 3, title: "3. Approved outcome (PIN Verified)", completed: hasStep3Approved, current: hasStep1Pin && hasStep2Comparison && !hasStep3Approved },
    { stepNumber: 4, title: "4. Rejected outcome (Incorrect PIN)", completed: hasStep4Rejected, current: hasStep1Pin && hasStep2Comparison && hasStep3Approved && !hasStep4Rejected }
  ];

  const isFullyVerified = hasStep1Pin && hasStep2Comparison && hasStep3Approved && hasStep4Rejected;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Registered PIN reference (1234)", completed: true, current: false },
        { stepNumber: 2, title: "2. Comparison rule (matches 1234)", completed: true, current: false },
        { stepNumber: 3, title: "3. Approved outcome (PIN Verified)", completed: true, current: false },
        { stepNumber: 4, title: "4. Rejected outcome (Incorrect PIN)", completed: true, current: false }
      ],
      feedback: "🎉 **Logic Approved by Coach Maara!** 🏆\nExcellent understanding! You have clearly identified that the entered PIN must match 1234, and you covered both the verified and incorrect PIN outcomes.\n\nProceed to Stage 2: Recipe!",
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "If the entered PIN equals 1234, display PIN Verified; otherwise, display Incorrect PIN."
    };
  }

  // Detect questions or very short text
  const isQuestion = norm.endsWith("?") ||
    /\b(?:how|what|why|help|puriyala|theriyala|doubt|explain|start|where)\b/i.test(norm);

  if (isQuestion || norm.length < 5) {
    if (attemptCount >= 4) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara cheering you on! Let's take this one step at a time.\nFirst, start by comparing the user's entered PIN with our registered PIN 1234.\nThen describe what happens when the PIN matches.\nTry writing the comparison condition in your worksheet now!",
        correction: "Describe comparing the entered PIN with 1234.",
        suggestedInput: "Check if the entered PIN matches 1234.",
        matchedFirebaseInput: "how to verify atm pin in logic?"
      };
    }
    if (attemptCount === 3) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara with a direct hint! In problem logic, we test if two values match.\nWe compare the entered digits against the secret PIN 1234.\nFocus on describing what the screen should show when the digits match 1234!\nWrite down that matching rule in your worksheet!",
        correction: "Describe what happens when the entered PIN matches 1234.",
        suggestedInput: "If the entered PIN equals 1234, display 'PIN Verified'.",
        matchedFirebaseInput: "what rule compares the pin?"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        logicStepProgress,
        feedback: "🌟 Coach Maara checking back! Think about real-world ATM security.\nWhen a customer types their PIN, how does the machine decide if it matches 1234?\nDescribe this matching check in your worksheet to take the next step!",
        correction: "Define the matching check against 1234.",
        suggestedInput: "Check if the entered PIN matches 1234.",
        matchedFirebaseInput: "what happens if user enters wrong pin?"
      };
    }
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara here! Welcome to ATM PIN Verification!\nThink of inserting your ATM card into the machine: what secret PIN does the machine compare your input against?\nStart by stating how the entered PIN should be compared with 1234 in your worksheet!\nWhat rule can you write to describe this check?",
      correction: "State the comparison between the entered PIN and 1234.",
      suggestedInput: "Check if the entered PIN matches 1234.",
      matchedFirebaseInput: "how to verify atm pin in logic?"
    };
  }

  // Missing Step 1: Registered PIN reference
  if (!hasStep1Pin) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara here! Let's build our security logic step by step.\nFirst, what registered secret PIN (such as 1234) does our ATM machine check against?\nMention the registered PIN in your worksheet to begin!",
      correction: "Mention the secret registered PIN (1234).",
      suggestedInput: "Check against the registered PIN 1234.",
      matchedFirebaseInput: "how to verify atm pin in logic?"
    };
  }

  // Missing Step 2: Equality comparison rule
  if (!hasStep2Comparison) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You have the PIN in mind! 👏\nNow, how does the machine test the entered digits against this PIN?\nState the comparison rule in your worksheet: check whether the entered PIN matches 1234!",
      correction: "Specify the comparison rule (e.g. check if the entered PIN matches 1234).",
      suggestedInput: "Check whether the entered PIN is equal to 1234.",
      matchedFirebaseInput: "what rule compares the pin?"
    };
  }

  // Missing Step 3: Approved outcome (Success case)
  if (!hasStep3Approved) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara checking back! You have established the comparison condition! 👏\nNow, what should the ATM screen display to the customer when the entered PIN matches 1234?\nDescribe the approved outcome in your worksheet to move forward!",
      correction: "Add the approved outcome: display 'PIN Verified' when the PIN matches 1234.",
      suggestedInput: "If the entered PIN equals 1234, display 'PIN Verified'.",
      matchedFirebaseInput: "how to verify atm pin in logic?"
    };
  }

  // Missing Step 4: Rejected outcome (Failure case)
  if (!hasStep4Rejected) {
    return {
      isFullyVerified: false,
      logicStepProgress,
      feedback: "🌟 Coach Maara note: You have the matching success case ready! 👏\nHowever, real-world security logic must handle wrong attempts too.\nWhat should the ATM screen display if someone types the wrong digits?\nAdd the rejection outcome to your worksheet to complete this stage!",
      correction: "Add the rejection outcome: otherwise, display 'Incorrect PIN'.",
      suggestedInput: "Otherwise, display 'Incorrect PIN'.",
      matchedFirebaseInput: "what happens if user enters wrong pin?"
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: "🌟 Coach Maara here! You are making steady progress on your logic.\nCheck the active step in your tracker and formulate that single step in everyday words to proceed!",
    correction: "Complete the next pending step in your logic tracker.",
    suggestedInput: "If the entered PIN equals 1234, display 'PIN Verified'; otherwise, display 'Incorrect PIN'.",
    matchedFirebaseInput: "how to verify atm pin in logic?"
  };
}

export function validateAtmPinVerificationRecipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();

  // Step 1: Get entered PIN
  const hasStep1 = /\b(?:get|input|read|take|obtain|enter|ask|user|customer)\b/i.test(norm) &&
    /\b(?:pin|digits|code|number)\b/i.test(norm);

  // Step 2: Check whether entered PIN is equal to 1234
  const hasStep2 = /\b(?:check|compare|test|if|verify|equal|matches?|same)\b/i.test(norm) &&
    (/\b1234\b/.test(norm) || /\b(?:valid|registered|correct)\s*pin\b/.test(norm));

  // Step 3: If matches, display PIN Verified
  const hasStep3 = /\b(?:display|print|show|output)\b/i.test(norm) &&
    /\b(?:verified|valid|access\s*granted|success)\b/i.test(norm);

  // Step 4: Otherwise, display Incorrect PIN
  const hasStep4 = /\b(?:otherwise|else|incorrect|invalid|denied|wrong|reject)\b/i.test(norm) &&
    /\b(?:display|print|show|output|incorrect|denied)\b/i.test(norm);

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Obtain the entered PIN from the user", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Check whether entered PIN equals 1234", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. If matches, display 'PIN Verified'", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Otherwise, display 'Incorrect PIN'", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 }
  ];

  // CRITICAL SEMANTIC RELATION CHECK: Inverted recipe steps
  const isDirectMatchInvalid = /(?<!not\s+|does\s*not\s*|doesn't\s*)\b(?:match(?:es|ing)?|equals?|identical|same|is\s*\d+|matches\s*with\s*\d+)\b(?:(?!\b(?:otherwise|else|mismatch|not\s*match|different)\b).)*?\b(?:not\s*valid|notvalid|invalid|incorrect|denied|reject(?:ed)?|wrong|fail(?:ure|ed)?)\b/i.test(norm);
  const isDirectMismatchValid = /\b(?:otherwise|else|not\s*match(?:es|ing)?|mismatch|not\s*equal|different)\b(?:(?!\b(?:when|if\s*(?!not)match|if\s*(?!not)equal)\b).)*?\b(?<!not\s+|not|in)(?:valid|verified|approved|granted|allow(?:ed)?|success)\b/i.test(norm);
  const isInvertedLogic = isDirectMatchInvalid || isDirectMismatchValid;

  if (isInvertedLogic) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "🌟 Coach Maara note: Check your recipe steps carefully!\nStep 3 must display the approved message ('PIN Verified') when the PIN matches.\nStep 4 must display the error message ('Incorrect PIN') when it does not match.\nMake sure matching leads to success and mismatch leads to failure!",
      correction: "Step 3: If matches, display 'PIN Verified'. Step 4: Otherwise, display 'Incorrect PIN'.",
      suggestedInput: "Step 3: If matches, display 'PIN Verified'\nStep 4: Otherwise, display 'Incorrect PIN'",
      matchedFirebaseInput: "what are the steps for atm pin recipe?"
    };
  }

  const isFullyVerified = !isInvertedLogic && hasStep1 && hasStep2 && hasStep3 && hasStep4;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Obtain the entered PIN from the user", completed: true, current: false },
        { stepNumber: 2, title: "2. Check whether entered PIN equals 1234", completed: true, current: false },
        { stepNumber: 3, title: "3. If matches, display 'PIN Verified'", completed: true, current: false },
        { stepNumber: 4, title: "4. Otherwise, display 'Incorrect PIN'", completed: true, current: false }
      ],
      feedback: "🎉 **Recipe Verified by Coach Maara!** 🏆\nSuperb algorithmic thinking! You have cleanly sequenced all 4 natural steps without any programming jargon.\n\nProceed to Stage 3: Ingredients!",
      correction: "Proceed to Stage 3: Ingredients to identify variables and condition blocks.",
      suggestedInput: void 0,
      matchedFirebaseInput: "Step 1: Get entered PIN\nStep 2: Check if entered PIN equals 1234\nStep 3: If matches, display PIN Verified\nStep 4: Otherwise, display Incorrect PIN"
    };
  }

  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (!hasStep1) {
    const step1Hints = [
      "🌟 Coach Maara here! Let's write our recipe steps like a master chef.\nBefore checking any security, what must the customer type into the machine?\nState your starting action in simple everyday words without code keywords.\nTry writing: `Step 1: Get the entered PIN from the user` in your worksheet!",
      "🌟 Coach Maara checking back! You are on the right track setting up the recipe.\nEvery security algorithm begins by accepting the user's input.\nIn your worksheet, specify obtaining the PIN digits from the user.\nWrite: `Step 1: Get the entered PIN from the user`.",
      "🌟 Coach Maara with a fresh tip! Let's take this one recipe step at a time.\nOur first goal is to receive the 4-digit PIN from the user.\nWhat instruction describes this initial step in plain English?\nAdd `Step 1: Get the entered PIN from the user` to your worksheet!"
    ];
    const idx = Math.max(0, attemptCount - 1) % step1Hints.length;
    feedback = step1Hints[idx];
    correction = "Write Step 1: Get the entered PIN from the user.";
    suggestedInput = "Step 1: Get the entered PIN from the user.";
  } else if (!hasStep2) {
    const step2Hints = [
      "🌟 Coach Maara here! Step 1 looks crystal clear! 👏\nNow in Step 2, we need the decision action to inspect the entered digits.\nHow would you instruct the computer to compare the entered digits with 1234 in plain English?\nAdd: `Step 2: Check whether the entered PIN is equal to 1234` in your worksheet!",
      "🌟 Coach Maara checking back! Great job obtaining the PIN in Step 1.\nNow for Step 2: formulate the comparison test against our secret PIN 1234.\nState that we check if the entered PIN matches 1234.\nWrite: `Step 2: Check whether the entered PIN is equal to 1234`.",
      "🌟 Coach Maara encouraging you! Step 1 is verified!\nNext, we need the decision step that tests if the PIN is correct.\nHow do you say 'compare with 1234' in simple English without programming syntax?\nIn your worksheet, write: `Step 2: Check whether the entered PIN is equal to 1234`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step2Hints.length;
    feedback = step2Hints[idx];
    correction = "Write Step 2: Check whether the entered PIN is equal to 1234.";
    suggestedInput = "Step 2: Check whether the entered PIN is equal to 1234.";
  } else if (!hasStep3) {
    const step3Hints = [
      "🌟 Coach Maara here! Steps 1 and 2 are established nicely! 👏\nNow we need the action step when our comparison succeeds.\nWhen the PIN matches 1234, what should the ATM screen display to the customer?\nWrite: `Step 3: If it matches, display \"PIN Verified\"` in your worksheet!",
      "🌟 Coach Maara checking back! Your recipe logic is coming together smoothly.\nOnce we identify that the PIN is correct, we grant access to the account.\nWhat message informs the customer their PIN is valid?\nAdd: `Step 3: If it matches, display \"PIN Verified\"` to your worksheet!",
      "🌟 Coach Maara with a fresh tip! Now let's handle the success message.\nWhen the equality check passes, show the verification confirmation.\nHow would you state this action in a clear recipe step?\nIn your worksheet, write: `Step 3: If it matches, display \"PIN Verified\"`."
    ];
    const idx = Math.max(0, attemptCount - 1) % step3Hints.length;
    feedback = step3Hints[idx];
    correction = "Write Step 3: If it matches, display \"PIN Verified\".";
    suggestedInput = "Step 3: If it matches, display \"PIN Verified\".";
  } else if (!hasStep4) {
    const step4Hints = [
      "🌟 Coach Maara here! You are on the very final step of the recipe! 👏\nWhat should the ATM display if the customer typed the wrong digits?\nState the alternative rejection action in simple English.\nIn your worksheet, write: `Step 4: Otherwise, display \"Incorrect PIN\"`!",
      "🌟 Coach Maara checking back! Three steps are ready, now for the fallback action.\nIf the comparison fails, we must inform the user the PIN was rejected.\nHow would you write this final alternative step?\nAdd: `Step 4: Otherwise, display \"Incorrect PIN\"` to complete the stage!",
      "🌟 Coach Maara with a fresh tip! Every security check needs a rejection path.\nWhen the PIN does not match 1234, display an error message.\nFinish your 4-step recipe by writing:\n`Step 4: Otherwise, display \"Incorrect PIN\"` in your worksheet!"
    ];
    const idx = Math.max(0, attemptCount - 1) % step4Hints.length;
    feedback = step4Hints[idx];
    correction = "Write Step 4: Otherwise, display \"Incorrect PIN\".";
    suggestedInput = "Step 4: Otherwise, display \"Incorrect PIN\".";
  }

  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: "what are the steps for atm pin recipe?"
  };
}

export function validateAtmPinVerificationIngredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();

  // 1. Variable declaration (entered_pin / pin / valid_pin)
  const hasVariable = /\b(?:var|let|const|variable|input)\s+([a-zA-Z_]\w*)/i.test(norm) ||
    /\b(?:entered_pin|pin|user_pin|enteredpin|actual_pin|valid_pin)\s*=/i.test(norm) ||
    /\b1234\b/.test(norm);

  // 2. If condition with Left Side, Operator (==), Right Side (1234)
  const hasIfKeyword = /\bif\b/i.test(norm) || /\bcondition\b/i.test(norm);
  const hasEqualsOp = /==/.test(norm) || /===/.test(norm) || /\boperator\s*[:=\s]\s*==/i.test(norm);
  const hasPinVal = /\b1234\b/.test(norm) || /\bright\s*side\s*[:=\s]\s*1234/i.test(norm);
  const hasIfCondition = (hasIfKeyword && hasEqualsOp) || (hasEqualsOp && hasPinVal) || /==\s*1234/.test(norm);

  // 3. Print "PIN Verified"
  const hasPrintSuccess = /\b(?:print|console\.log|display|show)\s*\(\s*["']?(?:pin\s*verified|access\s*granted|verified|valid)["']?\s*\)/i.test(norm) ||
    (/\bprint\b/i.test(norm) && /\b(?:verified|access\s*granted|valid)\b/i.test(norm));

  // 4. Else block
  const hasElseBlock = /\belse\b/i.test(norm);

  // 5. Print "Incorrect PIN" inside else
  const hasPrintFailure = /\b(?:print|console\.log|display|show)\s*\(\s*["']?(?:incorrect(?:\s*pin)?|access\s*denied|invalid(?:\s*pin)?|wrong)["']?\s*\)/i.test(norm) ||
    (/\bprint\b/i.test(norm) && /\b(?:incorrect|denied|invalid|wrong)\b/i.test(norm));

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. Input variable (entered_pin = 1234)", completed: hasVariable, current: !hasVariable },
    { stepNumber: 2, title: "2. If condition (Left Side: entered_pin, Operator: ==, Right Side: 1234)", completed: hasIfCondition, current: hasVariable && !hasIfCondition },
    { stepNumber: 3, title: "3. Inside if block: print('PIN Verified')", completed: hasPrintSuccess, current: hasVariable && hasIfCondition && !hasPrintSuccess },
    { stepNumber: 4, title: "4. Else fallback block", completed: hasElseBlock, current: hasVariable && hasIfCondition && hasPrintSuccess && !hasElseBlock },
    { stepNumber: 5, title: "5. Inside else block: print('Incorrect PIN')", completed: hasPrintFailure, current: hasVariable && hasIfCondition && hasPrintSuccess && hasElseBlock && !hasPrintFailure }
  ];

  const isFullyVerified = hasVariable && hasIfCondition && hasPrintSuccess && hasElseBlock && hasPrintFailure;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable (entered_pin = 1234)", completed: true, current: false },
        { stepNumber: 2, title: "2. If condition (Left Side: entered_pin, Operator: ==, Right Side: 1234)", completed: true, current: false },
        { stepNumber: 3, title: "3. Inside if block: print('PIN Verified')", completed: true, current: false },
        { stepNumber: 4, title: "4. Else fallback block", completed: true, current: false },
        { stepNumber: 5, title: "5. Inside else block: print('Incorrect PIN')", completed: true, current: false }
      ],
      feedback: "🎉 **Ingredients Verified!** 🏆\nOutstanding preparation! You have gathered all 5 building blocks: variable, equality test, success print, fallback else, and error print.\n\nProceed to Stage 4: Taste the Sample!",
      correction: "Proceed to Stage 4: Taste the Sample to write your executable code.",
      suggestedInput: void 0,
      matchedFirebaseInput: "Step 1: variable entered_pin = 1234\nStep 2: If condition with Left Side: entered_pin, Operator: ==, Right Side: 1234\nStep 3: Inside if: print(\"PIN Verified\")\nStep 4: else block\nStep 5: Inside else: print(\"Incorrect PIN\")"
    };
  }

  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (!hasVariable) {
    feedback = "🌟 Coach Maara here! Let's gather our 5 programming ingredients for ATM verification.\nFirst, we need an input variable to store the digits typed by the user.\nGive your variable a clear name (like `entered_pin = 1234`).\nDefine your variable in your worksheet to start Ingredient 1!";
    correction = "Define variable: 'Step 1: variable entered_pin = 1234'.";
    suggestedInput = "Step 1: variable entered_pin = 1234";
  } else if (!hasIfCondition) {
    feedback = "🌟 Coach Maara checking back! Your input variable is declared nicely! 👏\nFor Ingredient 2, we need an `if` condition with 3 components:\n• Left Side: `entered_pin`\n• Operator: `==`\n• Right Side: `1234`\nWrite in your worksheet: `Step 2: If condition with Left Side: entered_pin, Operator: ==, Right Side: 1234`!";
    correction = "Define: 'Step 2: If condition with Left Side: entered_pin, Operator: ==, Right Side: 1234'.";
    suggestedInput = "Step 2: If condition with Left Side: entered_pin, Operator: ==, Right Side: 1234";
  } else if (!hasPrintSuccess) {
    feedback = "🌟 Coach Maara encouraging you! We have our variable and condition ready.\nNow we need the action statement inside the `if` block.\nWhen the PIN matches, what should the program print?\nAdd: `Step 3: Inside if block: print(\"PIN Verified\")` to your worksheet!";
    correction = "Add: 'Step 3: Inside if block: print(\"PIN Verified\")'.";
    suggestedInput = "Step 3: Inside if block: print(\"PIN Verified\")";
  } else if (!hasElseBlock) {
    feedback = "🌟 Coach Maara with a fresh tip! Remember our branch rules.\nAn `if` condition handles the valid PIN, but we need an `else` branch for invalid attempts.\nRemember, `else` is a catch-all that does NOT need any condition.\nIn your worksheet, add: `Step 4: else block`!";
    correction = "Add: 'Step 4: else block'.";
    suggestedInput = "Step 4: else block";
  } else if (!hasPrintFailure) {
    feedback = "🌟 Coach Maara note: You are on the very final ingredient! 👏\nInside the `else` block, what message should print when the PIN is wrong?\nDefine printing the error message to complete the ingredients stage.\nAdd: `Step 5: Inside else block: print(\"Incorrect PIN\")` in your worksheet!";
    correction = "Add: 'Step 5: Inside else block: print(\"Incorrect PIN\")'.";
    suggestedInput = "Step 5: Inside else block: print(\"Incorrect PIN\")";
  }

  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: "what ingredients do we need for atm pin verification?"
  };
}

export function validateAtmPinVerificationSampleCode(code, attemptCount = 1) {
  const norm = (code || "").trim();

  // Detect conversational questions
  const hasQuestion = /\b(?:how|what|why|help|explain|puriyala|theriyala)\b/i.test(norm) &&
    !norm.includes("print(") && !norm.includes("console.log");

  if (hasQuestion) {
    return {
      isFullyVerified: false,
      feedback: "🌟 Coach Maara note: In the code editor, only executable program lines belong!\nPlease remove conversational questions from the editor so the compiler can read your clean code.\nStart with declaring your variable: `var entered_pin = 1234;`.",
      correction: "Remove conversational questions from the code editor."
    };
  }

  // 1. Variable declaration
  const varMatch = norm.match(/(?:var|let|const|int)?\s*([a-zA-Z_]\w*)\s*=\s*(?:1234|"[^"]*"|'[^']*'|\d+)/i);
  const hasVariable = Boolean(varMatch);
  const pinVar = varMatch ? varMatch[1] : "entered_pin";

  // 2. If condition
  const hasIfKeyword = /\bif\b/i.test(norm);
  const hasEqualsOp = /==/.test(norm) || /===/.test(norm);
  const hasSingleEqual = hasIfKeyword && /if\s*\([^=]*=[^=]*\)/.test(norm) && !hasEqualsOp;
  const hasCondition = hasIfKeyword && hasEqualsOp;

  // 3. Success Print
  const hasPrintSuccess = /\b(?:print|console\.log|printf|println|cout\s*<<)\s*\(?\s*["'](?:pin\s*verified|access\s*granted|verified)["']/i.test(norm);

  // 4. Else branch & Failure Print
  const hasElseBlock = /\belse\b/i.test(norm);
  const hasPrintFailure = /\b(?:print|console\.log|printf|println|cout\s*<<)\s*\(?\s*["'](?:incorrect(?:\s*pin)?|access\s*denied|invalid)["']/i.test(norm);

  const step1Done = hasVariable;
  const step2Done = step1Done && hasCondition;
  const step3Done = step2Done && hasPrintSuccess;
  const step4Done = step3Done && hasElseBlock && hasPrintFailure;

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: "1. Declare PIN variable (entered_pin = 1234)", completed: step1Done, current: !step1Done },
    { stepNumber: 2, title: `2. Check if ${pinVar} == 1234`, completed: step2Done, current: step1Done && !step2Done },
    { stepNumber: 3, title: "3. Print 'PIN Verified' on success", completed: step3Done, current: step2Done && !step3Done },
    { stepNumber: 4, title: "4. Else branch printing 'Incorrect PIN'", completed: step4Done, current: step3Done && !step4Done }
  ];

  if (!step1Done) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: "🌟 Coach Maara note: Let's begin with Step 1 for our code prototype!\nStart by declaring your PIN variable in universal syntax.\nAssign it the test value 1234: `var entered_pin = 1234;`.\nType this variable declaration in your code editor to start Step 1!",
      correction: "Declare variable: 'var entered_pin = 1234;'."
    };
  }

  if (hasSingleEqual) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara note: Look closely at your comparison operator!\nYou wrote a single \`=\` (\`${pinVar} = 1234\`), which assigns a value instead of comparing.\nIn programming conditions, always use double equals \`==\` to test equality.\nUpdate your condition to: \`if (${pinVar} == 1234) {\`!`,
      correction: `Change '=' to '==': 'if (${pinVar} == 1234) {'.`
    };
  }

  if (!step2Done) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara checking back! Your variable \`${pinVar}\` is declared nicely! 👏\nNow for Step 2: add an \`if\` condition to test if \`${pinVar}\` equals 1234.\nIn universal syntax, write: \`if (${pinVar} == 1234) {\`.\nAdd this condition block in your code editor!`,
      correction: `Add condition: 'if (${pinVar} == 1234) {'.`
    };
  }

  if (!step3Done) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara encouraging you! Condition \`if (${pinVar} == 1234)\` is ready! 👏\nNow for Step 3: what should be printed when the PIN matches?\nPlace \`print(\"PIN Verified\");\` directly inside the curly braces of your if block.\nAdd this success print statement in your code editor!`,
      correction: "Add 'print(\"PIN Verified\");' inside the if block."
    };
  }

  if (!step4Done) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress,
      feedback: `🌟 Coach Maara note: You are right at the finish line! 👏\nYour \`if\` branch handles valid PINs, but what if someone enters the wrong PIN?\nAdd an \`else\` block: \`else { print(\"Incorrect PIN\"); }\`.\nAdd this fallback block to complete your prototype!`,
      correction: "Add 'else { print(\"Incorrect PIN\"); }' block."
    };
  }

  return {
    isFullyVerified: true,
    sampleCodeStepProgress: [
      { stepNumber: 1, title: "1. Declare PIN variable (entered_pin = 1234)", completed: true, current: false },
      { stepNumber: 2, title: `2. Check if ${pinVar} == 1234`, completed: true, current: false },
      { stepNumber: 3, title: "3. Print 'PIN Verified' on success", completed: true, current: false },
      { stepNumber: 4, title: "4. Else branch printing 'Incorrect PIN'", completed: true, current: false }
    ],
    feedback: "🎉 **Congratulations! Code Verified!** 🏆\nYour program prototype correctly verifies the ATM PIN with both success and failure branches working flawlessly!\n\nYou are now ready to run and test this solution in the Compiler!",
    correction: "All done! Run the code in the compiler."
  };
}

