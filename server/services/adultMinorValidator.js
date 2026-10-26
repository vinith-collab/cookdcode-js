function validateAdultMinorLogic(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase();
  const isQuestion = norm.includes("who is an adult") || norm.includes("what is adult") || norm.includes("what is minor") || norm.includes("how to check") || norm.includes("how do we know") || norm.endsWith("?");
  if (isQuestion && !norm.includes(">=") && !norm.includes(">") && !norm.includes("18")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! A person is an Adult if their age is 18 or older, and a Minor if they are under 18. To check this in logic, we test if `age >= 18`. What comparison tests if someone is an adult?",
      correction: "Check if age is 18 or older: age >= 18 is Adult, age < 18 is Minor.",
      suggestedInput: "If age is 18 or older (age >= 18), the person is an Adult. If age is under 18 (age < 18), the person is a Minor.",
      matchedFirebaseInput: "what is adult or minor"
    };
  }
  const rawComparisonMatches = Array.from(input.matchAll(/(\d+)\s*(>=|<=|>|<|==|!=|=)\s*(\d+)/g));
  const validComparisons = [];
  const invalidComparisons = [];
  for (const match of rawComparisonMatches) {
    const left = parseInt(match[1], 10);
    const op = match[2];
    const right = parseInt(match[3], 10);
    let isMathFactTrue = false;
    if (op === "<") isMathFactTrue = left < right;
    else if (op === ">") isMathFactTrue = left > right;
    else if (op === "<=") isMathFactTrue = left <= right;
    else if (op === ">=") isMathFactTrue = left >= right;
    else if (op === "==" || op === "=") isMathFactTrue = left === right;
    else if (op === "!=") isMathFactTrue = left !== right;
    if (isMathFactTrue) {
      validComparisons.push({ left, op, right });
    } else {
      invalidComparisons.push({ left, op, right });
    }
  }
  const uncorrected = invalidComparisons.filter((inv) => !validComparisons.some((v) => v.left === inv.left));
  if (uncorrected.length > 0) {
    const { left, op, right } = uncorrected[0];
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: `\u{1F31F} Coach Maara gentle check: Look closely at your mathematical comparison \`${left} ${op} ${right}\`! ${left} is ${left > right ? "greater than" : "less than"} ${right}, so \`${left} ${op} ${right}\` is mathematically false! For age ${left}, the correct comparison is \`${left} ${left >= right ? ">=" : "<"} ${right}\`.`,
      correction: `For age ${left}: write \`${left} ${left >= right ? ">=" : "<"} ${right}\` (${left >= 18 ? "Adult" : "Minor"}).`,
      suggestedInput: `If age >= 18 (e.g. 25 >= 18 -> true) -> Adult. If age < 18 (e.g. 12 < 18 -> true) -> Minor.`,
      matchedFirebaseInput: "how to check if a person is adult or minor"
    };
  }
  const wroteStrictlyGreaterSymbol = /\b(?:1[89]|2[0-9]|[3-9][0-9]|age)\s*>\s*18\b/.test(norm) || />\s*18\b/.test(norm);
  const hasGreaterEqualSymbol = />=\s*18|age\s*>=\s*18|\b(?:1[89]|2[0-9]|[3-9][0-9])\s*>=\s*18|>\s*17/i.test(norm);
  if (wroteStrictlyGreaterSymbol && !hasGreaterEqualSymbol) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at your mathematical operator! You wrote strictly `>` without `=` (`25 > 18` or `age > 18`). What happens if someone is exactly 18 years old? `18 > 18` is false, but an 18-year-old **IS an Adult**! You must use `>=` (`25 >= 18` or `age >= 18`) with the `=` sign so that age 18 is included.",
      correction: "Write `>= 18` (greater than or equal to 18) with the `=` sign: `25 >= 18` or `age >= 18`.",
      suggestedInput: "If age is 18 or older (age >= 18, e.g. 25 >= 18 -> true), the person is an Adult. If age < 18 (e.g. 12 < 18 -> true), the person is a Minor.",
      matchedFirebaseInput: "how to check if a person is adult or minor"
    };
  }
  const claimsBoundary18IsMinor = /(?:less|smaller|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18.*?minor/i.test(norm) || /<=\s*18.*?minor/i.test(norm) || /\b18\s*(?:or|and)\s*(?:less|smaller|below|younger|under).*?minor/i.test(norm) || /(?:minor).*?(?:less|smaller|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18/i.test(norm) || /(?:minor).*?<=\s*18/i.test(norm);
  if (claimsBoundary18IsMinor) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at your minor condition! You wrote 'less than or equal to 18' (`<= 18`) for Minor. But if a person is 18 years old, they **are an Adult**! A Minor is strictly **under 18** (`< 18`), so use `< 18` (less than 18) for minors.",
      correction: "If age >= 18 it is Adult; if age < 18 it is Minor.",
      suggestedInput: "If age is 18 or older (age >= 18), the person is an Adult. If age is under 18 (age < 18), the person is a Minor.",
      matchedFirebaseInput: "how to check if a person is adult or minor"
    };
  }
  const mentions18 = /\b18\b|eighteen/i.test(norm);
  const mentionsAge = /\bage\b|person|human|years?\s*old/i.test(norm);
  const mentionsAdult = /\badult\b|major/i.test(norm);
  const mentionsMinor = /\bminor\b|child|kid|under\s*age/i.test(norm);
  const mentionsWordsComparison = /18\s*(?:or|and)\s*(?:above|older|more|greater)|at\s*least\s*18|greater\s*than\s*(?:or\s*equal\s*to\s*)?18|above\s*18|under\s*18|below\s*18|less\s*than\s*18/i.test(norm);
  const hasMathematicalCheck = hasGreaterEqualSymbol;
  const allAgeMatches = Array.from(norm.matchAll(/\b(1[0-9]|2[0-9]|[3-9][0-9]|[1-9])\b/g)).map((m) => parseInt(m[1], 10));
  const claimsUnder18IsAdult = /(?:<\s*18|under\s*18|below\s*18|less\s*than\s*18|15|12|16|10).*?(?:is|=|gives|means)?\s*(?:an?\s*)?adult/i.test(norm) && !/(?:not\s*an?\s*adult|minor)/i.test(norm);
  const claimsOver18IsMinor = /(?:>=\s*18|above\s*18|18\s*or\s*(?:older|above|more)|20|25|30).*?(?:is|=|gives|means)?\s*(?:a\s*)?minor/i.test(norm) && !/(?:not\s*a\s*minor|adult)/i.test(norm);
  if (claimsUnder18IsAdult || claimsOver18IsMinor) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at your age definitions! An **Adult** is someone whose age is **18 or older** (`age >= 18`), while a **Minor** is someone **under 18** (`age < 18`). Please check your condition outcomes!",
      correction: "If age >= 18 it is Adult; if age < 18 it is Minor.",
      suggestedInput: "If age >= 18 (e.g. 20 >= 18) -> Adult. If age < 18 (e.g. 15 < 18) -> Minor.",
      matchedFirebaseInput: "how to check if a person is adult or minor"
    };
  }
  const hasConceptualLogic = (mentions18 || mentionsAge) && (mentionsAdult || mentionsMinor) && (mentionsWordsComparison || hasMathematicalCheck);
  if (hasConceptualLogic && !hasMathematicalCheck) {
    return {
      isFullyVerified: false,
      hasAgeConcept: true,
      hasComparisonOperator: false,
      hasAdultOutcome: mentionsAdult,
      hasMinorOutcome: mentionsMinor,
      hasMathematicalCheck: false,
      feedback: "\u{1F31F} Coach Maara here! Good conceptual start in words! You correctly identified that someone 18 or older is an Adult, and under 18 is a Minor. \u{1F44F}\n\nNow, **explain it mathematically with an example age!**\nShow the mathematical comparison operation:\n\u2022 Take an example adult age (like 20): `20 >= 18 (true)` \u2794 **Adult**.\n\u2022 Take an example minor age (like 15): `15 >= 18 (false)` \u2794 **Minor**.\n\nWrite your mathematical comparison condition (`age >= 18`) or example age calculation in your worksheet to complete this logic stage!",
      correction: "Explain mathematically: If age >= 18 (e.g. 20 >= 18 -> true) it is Adult; otherwise Minor.",
      suggestedInput: "An adult is 18 or older, and a minor is under 18. Mathematically: For age = 20, 20 >= 18 is true -> Adult. For age = 15, 15 >= 18 is false -> Minor.",
      matchedFirebaseInput: "how to check if a person is adult or minor"
    };
  }
  if (hasConceptualLogic && hasMathematicalCheck) {
    const studentExplicitAge = allAgeMatches.find((a) => a !== 18 && a !== 17) || 20;
    const testAge1 = studentExplicitAge;
    const isAdult1 = testAge1 >= 18;
    const testAge2 = isAdult1 ? 15 : 22;
    const isAdult2 = testAge2 >= 18;
    const operationTestCases = [
      {
        testCaseTitle: isAdult1 ? "Example 1 (Adult Test)" : "Example 1 (Minor Test)",
        inputAge: testAge1,
        operationFormula: `age = ${testAge1} \u2794 ${testAge1} >= 18`,
        conditionCheck: `${testAge1} >= 18 evaluates to ${isAdult1 ? "TRUE" : "FALSE"}`,
        conditionEvaluated: isAdult1,
        executedBranch: isAdult1 ? "if" : "else",
        outputMessage: isAdult1 ? "Adult" : "Minor",
        expectedOutput: isAdult1 ? "Adult" : "Minor",
        passed: true,
        explanation: `Age ${testAge1} ${isAdult1 ? "is 18 or older" : "is less than 18"}, so the person is classified as an ${isAdult1 ? "Adult" : "Minor"}.`
      },
      {
        testCaseTitle: isAdult2 ? "Example 2 (Adult Test)" : "Example 2 (Minor Test)",
        inputAge: testAge2,
        operationFormula: `age = ${testAge2} \u2794 ${testAge2} >= 18`,
        conditionCheck: `${testAge2} >= 18 evaluates to ${isAdult2 ? "TRUE" : "FALSE"}`,
        conditionEvaluated: isAdult2,
        executedBranch: isAdult2 ? "if" : "else",
        outputMessage: isAdult2 ? "Adult" : "Minor",
        expectedOutput: isAdult2 ? "Adult" : "Minor",
        passed: true,
        explanation: `Age ${testAge2} ${isAdult2 ? "is 18 or older" : "is less than 18"}, so the person is classified as an ${isAdult2 ? "Adult" : "Minor"}.`
      }
    ];
    const feedback2 = `\u{1F52C} **Logic & Mathematical Comparison Verified:**
\u2022 **Example 1 (${isAdult1 ? "Adult" : "Minor"}):** \`age = ${testAge1}\` \u2794 \`${testAge1} >= 18\` is **${isAdult1 ? "true" : "false"}** \u2794 Result: **${isAdult1 ? "Adult" : "Minor"}** \u2705
\u2022 **Example 2 (${isAdult2 ? "Adult" : "Minor"}):** \`age = ${testAge2}\` \u2794 \`${testAge2} >= 18\` is **${isAdult2 ? "true" : "false"}** \u2794 Result: **${isAdult2 ? "Adult" : "Minor"}** \u2705

\u{1F389} **Both conceptual logic and mathematical comparison verified!** \u{1F3C6} Having tested the condition with concrete example ages, your comparison rule (\`age >= 18\`) is verified as **SUCCESSFUL**! Fantastic job! Proceed to Stage 2: Recipe!`;
    return {
      isFullyVerified: true,
      hasAgeConcept: true,
      hasComparisonOperator: true,
      hasAdultOutcome: true,
      hasMinorOutcome: true,
      hasMathematicalCheck: true,
      operationTestCases,
      feedback: feedback2,
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "if age >= 18 then adult"
    };
  }
  let feedback = "\u{1F31F} Coach Maara here! What is the minimum age to be considered an Adult, and what mathematical comparison tests if a person's age meets that threshold?";
  if (attemptCount >= 2) {
    feedback = "\u{1F31F} Coach Maara checking back! A person is an Adult at age 18 or older (`age >= 18`), and a Minor if under 18 (`age < 18`). Write this comparison rule with an example in everyday words!";
  }
  return {
    isFullyVerified: false,
    hasAgeConcept: mentions18,
    hasComparisonOperator: hasMathematicalCheck,
    hasAdultOutcome: mentionsAdult,
    hasMinorOutcome: mentionsMinor,
    feedback,
    correction: "If age >= 18 display Adult, else display Minor.",
    suggestedInput: "If age is 18 or older (age >= 18), the person is an Adult. If age is under 18 (age < 18), the person is a Minor.",
    matchedFirebaseInput: "how to check if a person is adult or minor"
  };
}
function validateAdultMinorRecipe(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase();
  const hasStep1 = /(?:step\s*1\s*:?|get\s*(?:the\s*)?(?:input\s*)?age|read\s*(?:the\s*)?age|take\s*(?:an?\s*)?age|input\s*age)/i.test(norm) || /\bage\s*=\s*\d+\b/i.test(norm) || /\b(?:get|read|take|input)\b/i.test(norm) && /\bage\b/i.test(norm);
  const mentionsComparison = />=\s*18|18\s*or\s*(?:older|above|more)|at\s*least\s*18|greater\s*than\s*(?:or\s*equal\s*to\s*)?18|above\s*18/i.test(norm) || /compare\s*age/i.test(norm);
  const hasStep2Condition = (hasStep1 || norm.includes("step 2")) && mentionsComparison;
  const mapsAdult = /(?:display|print|show|output|is)\s*(?:an?\s*)?adult/i.test(norm) || norm.includes("adult");
  const mapsMinor = /(?:display|print|show|output|is)\s*(?:a\s*)?minor/i.test(norm) || norm.includes("minor");
  const hasInvertedStep3 = /(?:>=\s*18|18\s*or\s*(?:older|above)).*?(?:display|print|is|called\s*as)?\s*(?:a\s*)?minor/i.test(norm) && !/(?:not\s*a\s*minor|adult)/i.test(norm);
  const hasBoundaryMinorContradiction = /(?:less|smaller|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18.*?(?:is|called|display|print)?.*?(?:a\s*)?minor/i.test(norm) || /<=\s*18.*?(?:is|called|display|print)?.*?(?:a\s*)?minor/i.test(norm) || /\b18\s*(?:or|and)\s*(?:less|smaller|below|younger|under).*?(?:is|called|display|print)?.*?(?:a\s*)?minor/i.test(norm) || /(?:minor).*?(?:less|smaller|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18/i.test(norm) || /(?:minor).*?<=\s*18/i.test(norm);
  const wroteStrictlyGreaterInRecipe = /\b(?:greater|more|above)\s*than\s*18\b/i.test(norm) && !/(?:greater|more|above)\s*than\s*or\s*equal|>=|>=\s*18|18\s*or\s*(?:older|above|more|greater)|at\s*least\s*18/i.test(norm);
  const hasStep3Outcome = !hasInvertedStep3 && !hasBoundaryMinorContradiction && !wroteStrictlyGreaterInRecipe && mapsAdult && (mapsMinor || norm.includes("else") || norm.includes("otherwise"));
  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Get input age (e.g. 20)",
      completed: Boolean(hasStep1),
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Step 2: Check if age >= 18 (age is 18 or older)",
      completed: Boolean(hasStep2Condition && !wroteStrictlyGreaterInRecipe),
      current: Boolean(hasStep1 && (!hasStep2Condition || wroteStrictlyGreaterInRecipe))
    },
    {
      stepNumber: 3,
      title: "Step 3: Display 'Adult' if true, else display 'Minor'",
      completed: Boolean(hasStep3Outcome),
      current: Boolean(hasStep1 && hasStep2Condition && !hasStep3Outcome)
    }
  ];
  if (hasBoundaryMinorContradiction) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at Step 3! You wrote 'less than or equal to 18 it is called as minor'. But if a person is 18 years old, they **ARE an Adult**! Saying 'less than or equal to 18' mistakenly includes age 18 in the minor group.\n\nYou should write strictly 'less than 18' (under 18), or simply: 'Step 3: Otherwise (or if age < 18), it is called as minor'.",
      correction: "Step 3: If age is less than 18 (or otherwise), it is called as minor.",
      suggestedInput: "Step 3: Otherwise (or if age is less than 18), it is called as minor",
      matchedFirebaseInput: "step 2 : If age is 18 or older display Adult, else display Minor"
    };
  }
  if (wroteStrictlyGreaterInRecipe) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara gentle check: In Step 2, you wrote 'greater than 18' without 'or equal to'. A person who is exactly 18 years old **is an Adult**! If you use strictly 'greater than 18', an 18-year-old would not be counted as an Adult. Please update Step 2 to: 'greater than or equal to 18' (or '18 or older').",
      correction: "Step 2: If age is greater than or equal to 18, it is called as adult.",
      suggestedInput: "Step 2: If age is greater than or equal to 18, it is called as adult",
      matchedFirebaseInput: "step 2 : If age is 18 or older display Adult, else display Minor"
    };
  }
  if (hasInvertedStep3) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at Step 3! When age is 18 or older (`age >= 18`), the person **IS an Adult**! When age is under 18, they are a **Minor**.\n\nPlease update Step 3: 'Step 3: If age >= 18 display Adult, else display Minor'.",
      correction: "Step 3: If age >= 18 display Adult, else display Minor.",
      suggestedInput: "Step 3: If age >= 18 display Adult, else display Minor.",
      matchedFirebaseInput: "step 2 : If age is 18 or older display Adult, else display Minor"
    };
  }
  const isFullyVerified = hasStep1 && hasStep2Condition && hasStep3Outcome && !hasInvertedStep3;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Recipe Algorithm Trace with Example Age (20):**
\u2022 **Step 1:** Get input age \`age = 20\`
\u2022 **Step 2:** Check condition: \`20 >= 18\` is **true**
\u2022 **Step 3:** Condition is true \u2794 Display **"Adult"** (otherwise "Minor") \u2705

\u{1F389} **Woohoo! Outstanding recipe!** \u{1F3C6} You wrote a crystal-clear 3-step algorithm for identifying Adult or Minor. Ready to gather the programming tools! Proceed to Stage 3: Ingredients!`;
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback,
      correction: "Proceed to Stage 3: Ingredients to identify variables and operators.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If age is 18 or older display Adult, else display Minor"
    };
  }
  if (!hasStep1) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maara checking back! What is the very first thing our recipe needs before making any decision? We must get the person's age! Write: 'Step 1: Get input age'." : "\u{1F31F} Coach Maara here! Let's think like a chef writing a recipe step by step. What is the very first step we must take? (Step 1: Get input age).";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 1: Get input age.",
      suggestedInput: "Step 1: Get input age.",
      matchedFirebaseInput: "what steps to write"
    };
  }
  if (hasStep1 && !hasStep2Condition) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maara here! Step 1 looks solid! \u{1F44F} Now for Step 2: What condition tests whether the person is at least 18 years old? (Check if age >= 18)." : "\u{1F31F} Coach Maara here! Great start with Step 1! \u{1F44F} For Step 2, what mathematical comparison checks if the person is 18 or older?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 2: Check if age >= 18 (age is 18 or older).",
      suggestedInput: "Step 2: Check if age >= 18.",
      matchedFirebaseInput: "step 1 : Get input age"
    };
  }
  if (hasStep1 && hasStep2Condition && !hasStep3Outcome) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maara here! You've set up the age comparison condition perfectly! \u{1F44F} Now for Step 3: What message should be displayed if age >= 18 is true, and what message if it is false?" : "\u{1F31F} Coach Maara here! Superb work on the condition! \u{1F31F} To wrap up our recipe in Step 3, what should we display when the age meets 18, and what should we show otherwise?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 3: If true display 'Adult', else display 'Minor'.",
      suggestedInput: "Step 3: If true display 'Adult', else display 'Minor'.",
      matchedFirebaseInput: "step 2 : If age is 18 or older display Adult, else display Minor"
    };
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Let's build our recipe step by step. Start with Step 1: Get input age.",
    correction: "Step 1: Get input age.",
    suggestedInput: "Step 1: Get input age.",
    matchedFirebaseInput: "what steps to write"
  };
}
function validateAdultMinorIngredients(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase();
  const hasVariableAge = /step\s*1\s*:?\s*age|variable\s*:?\s*age|var\s+age|age\s*=\s*\d+|input\s*variable\s*age/i.test(norm) || /\bage\b/i.test(norm);
  const extractStepText = (stepNum) => {
    const nextStepNum = stepNum + 1;
    const regex = new RegExp(`(?:step\\s*${stepNum}|(?:^|\\n|;)\\s*${stepNum}[\\.\\)])\\s*[:\\-\\s]*([\\s\\S]*?)(?=(?:step\\s*${nextStepNum}|(?:^|\\n|;)\\s*${nextStepNum}[\\.\\)]|$))`, "gi");
    const matches = Array.from(norm.matchAll(regex));
    return matches.length > 0 ? matches[matches.length - 1][1].trim() : "";
  };
  const step1Text = extractStepText(1);
  const step2Text = extractStepText(2);
  const step3Text = extractStepText(3);
  const step4Text = extractStepText(4);
  const step5Text = extractStepText(5);
  const step2Target = step2Text || norm;
  const hasIfInStep2 = step2Text ? /\bif\b/i.test(step2Text) : /\bif\b/i.test(norm);
  const hasElseInStep2 = step2Text ? /\belse\b/i.test(step2Text) && !hasIfInStep2 : /\belse\b/i.test(norm) && !hasIfInStep2;
  const hasElseWithCondition = hasElseInStep2 && /left\s*side|\bl\.?s\.?\b|operator|\bop\b|right\s*side|\br\.?s\.?\b|>=|<=|>|<|==|!=/i.test(step2Target);
  const hasGreaterEqualOperator = />=|operator\s*:?\s*>=|greater\s*than\s*or\s*equal/i.test(step2Target);
  const hasSingleEqualOperator = /operator\s*:?\s*=['"]?(?!=|>|<)/i.test(step2Target);
  const lsMatch = step2Target.match(/(?:left\s*side|\bl\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongLeftSideDetected = null;
  if (lsMatch) {
    const rawLS = lsMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/age|person|a\b|var|input/i.test(rawLS) || /^(?:=|>|<|>=|<=|18|\d+)$/.test(rawLS)) {
      wrongLeftSideDetected = rawLS || "(empty)";
    }
  }
  const explicitOperatorMatch = step2Target.match(/operator\s*:?\s*([^;\n\r,]+)/i) || step2Target.match(/(?:step\s*2|condition|if\s*\(?age)\s*.*?([><!=]=?)\s*18/i);
  let wrongOperatorDetected = null;
  if (explicitOperatorMatch) {
    const rawOp = explicitOperatorMatch[1].trim();
    if (rawOp !== ">=" && !rawOp.includes(">=")) {
      wrongOperatorDetected = rawOp || "(empty)";
    }
  }
  const rsExplicitMatch = step2Target.match(/(?:right\s*side|r\.?s\.?)\s*:?\s*([^;\n\r,]+)/i);
  let wrongRightSideDetected = null;
  if (rsExplicitMatch) {
    const rawRS = rsExplicitMatch[1].trim();
    if (!/\b18\b/.test(rawRS)) {
      wrongRightSideDetected = rawRS || "(empty)";
    }
  }
  const rsMatch = step2Target.match(/(?:>=|<=|>|<|==)\s*(\d+)|\br\.?s\.?\s*[:=]?\s*(\d+)|right\s*side\s*[:=]?\s*(\d+)/i);
  let wrongThresholdDetected = null;
  if (rsMatch) {
    const thresholdVal = (rsMatch[1] || rsMatch[2] || rsMatch[3] || "").trim();
    if (thresholdVal && thresholdVal !== "18" && thresholdVal !== "17") {
      wrongThresholdDetected = thresholdVal;
    }
  }
  const mentions18InCondition = step2Target.includes("18") || step2Target.includes("eighteen") || norm.includes("18");
  const hasValidIfCondition = hasVariableAge && !hasElseWithCondition && !wrongLeftSideDetected && !wrongOperatorDetected && !wrongRightSideDetected && !wrongThresholdDetected && !hasSingleEqualOperator && mentions18InCondition && (norm.includes("age >= 18") || /\bage\s*>=\s*18\b/i.test(norm) || hasGreaterEqualOperator && mentions18InCondition);
  const step3Section = (norm.match(/step\s*3\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step5Section = (norm.match(/step\s*5\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideIfSection = (norm.match(/inside\s*if\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideElseSection = (norm.match(/inside\s*else\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step3HasMinor = (/minor/i.test(step3Section) || /minor/i.test(insideIfSection)) && !/adult/i.test(step3Section) && !/adult/i.test(insideIfSection);
  const step5HasAdult = (/adult/i.test(step5Section) || /adult/i.test(insideElseSection)) && !/minor/i.test(step5Section) && !/minor/i.test(insideElseSection);
  const hasPrintAdult = !step3HasMinor && (/print\s*\(\s*["']adult["']\s*\)|step\s*3\s*:?.*?print.*?adult/i.test(norm) || /display\s*["']?adult["']?/i.test(norm) || /print\s*(?:it\s*is\s*(?:an?\s*)?)?adult/i.test(norm));
  const hasStep4Else = /step\s*4\s*[:\-\s]*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || /4\s*[\.\)]\s*(?:else\s*block|else|fallback\s*else)\b/i.test(norm);
  const hasElseBranch = !hasElseWithCondition && hasValidIfCondition && hasPrintAdult && (hasStep4Else || /fallback\s*else\s*block/i.test(norm) && !hasElseInStep2);
  const hasPrintMinor = !step5HasAdult && (/print\s*\(\s*["']minor["']\s*\)|step\s*5\s*:?.*?print.*?minor/i.test(norm) || /display\s*["']?minor["']?/i.test(norm) || /print\s*(?:it\s*is\s*(?:a\s*)?)?minor/i.test(norm));
  const hasUnquotedPrint = /print\s*\(\s*(?!["'])adult\s*\)|print\s*\(\s*(?!["'])minor\s*\)/i.test(norm);
  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Input variable (age)",
      completed: Boolean(hasVariableAge),
      current: !hasVariableAge
    },
    {
      stepNumber: 2,
      title: "Step 2: If condition (L.S: age, Operator: >=, R.S: 18)",
      completed: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition),
      current: Boolean(hasVariableAge && (!hasValidIfCondition || hasElseWithCondition))
    },
    {
      stepNumber: 3,
      title: "Step 3: Inside if block: print('Adult')",
      completed: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && hasPrintAdult),
      current: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && !hasPrintAdult)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block",
      completed: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && hasPrintAdult && hasElseBranch),
      current: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && hasPrintAdult && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: "Step 5: Inside else block: print('Minor')",
      completed: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && hasPrintAdult && hasElseBranch && hasPrintMinor),
      current: Boolean(hasVariableAge && hasValidIfCondition && !hasElseWithCondition && hasPrintAdult && hasElseBranch && !hasPrintMinor)
    }
  ];
  if (hasElseWithCondition) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Input variable (age)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** You wrote \`else\` with comparison components (Left Side: \`age\`, Operator: \`>=\`, Right Side: \`18\`) \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' in Programming Logic:**
\u2022 **Why we use \`if\`:** In programming, the **\`if\` construct** is used when you need to evaluate a specific condition / comparison test (Left Side: \`age\`, Operator: \`>=\`, Right Side: \`18\`). When that condition evaluates to **true** (age is 18 or older), the code inside the \`if\` block executes to print "Adult"!
\u2022 **Why we use \`else\`:** The **\`else\` construct** is a blanket fallback mechanism. It has **no condition** (no Left Side, Operator, or Right Side) of its own. Its sole purpose is to automatically execute when the \`if\` condition turns out to be **false**.

\u{1F3AF} **How to Solve & Proceed to Next Step:**
Since you are testing the condition (\`age >= 18\`), replace \`else\` with the **\`if\` condition**:
\`step 2 : If condition with Left Side (age), Operator (>=), Right Side (18)\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 2 : If condition"
    };
  }
  if (wrongLeftSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Left Side: Look at your Left Side (L.S)! You wrote \`Left side: ${wrongLeftSideDetected}\`. The Left Side of the comparison must be our input variable \`age\` (e.g. \`Left side: age\` or \`L.S: age\`).`,
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (wrongOperatorDetected) {
    let operatorTip = `You wrote \`operator: ${wrongOperatorDetected}\`.`;
    if (wrongOperatorDetected === "<" || wrongOperatorDetected === "<=") {
      operatorTip += ` Using \`${wrongOperatorDetected}\` checks for a Minor. But in Step 2, the \`if\` condition tests for an **Adult** (18 or older), which requires \`>=\` (\`operator: >=\`).`;
    } else if (wrongOperatorDetected === ">") {
      operatorTip += ` Using strictly \`>\` without \`=\` leaves out age 18! An 18-year-old **is an Adult**, so use \`>=\` (\`operator: >=\`).`;
    } else if (wrongOperatorDetected === "==" || wrongOperatorDetected === "=") {
      operatorTip += ` Using \`${wrongOperatorDetected}\` only checks if someone is exactly 18. For 18 and all older ages, use \`>=\` (\`operator: >=\`).`;
    } else {
      operatorTip += ` To test if someone is 18 or older, use the greater-than-or-equal operator \`>=\` (\`operator: >=\`).`;
    }
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara operator check: ${operatorTip}`,
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (wrongRightSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Right Side: Look at your Right Side (R.S)! You wrote \`right side: ${wrongRightSideDetected}\`. In the condition \`age >= 18\`, the Right Side is the threshold value **18** (\`right side: 18\` or \`R.S: 18\`).`,
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (wrongThresholdDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara threshold check: In Step 2, you set Right Side (R.S) to \`${wrongThresholdDetected}\`. The legal threshold to be classified as an Adult is 18. Please update Right Side to 18 (\`R.S: 18\`).`,
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (step3HasMinor) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at Step 3! The condition in Step 2 tests if \`age >= 18\` (18 or older). When this condition is **true**, the person is an **Adult**! Step 3 must print Adult: \`step 3 : Inside if block: print("Adult")\`.`,
      correction: 'step 3 : Inside if block: print("Adult")',
      suggestedInput: 'step 3 : Inside if block: print("Adult")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (step5HasAdult) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at Step 5! In the \`else\` block (when age is under 18), the person is a **Minor**! Step 5 must print Minor: \`step 5 : Inside else block: print("Minor")\`.`,
      correction: 'step 5 : Inside else block: print("Minor")',
      suggestedInput: 'step 5 : Inside else block: print("Minor")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const hasSecondIfInsteadOfElse = /step\s*4\s*:?\s*if|if\s*(?:age\s*)?<\s*18/i.test(norm) && !hasElseBranch;
  if (hasSecondIfInsteadOfElse) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara checking Step 4: You wrote another `if` condition for the minor case! In programming with if-else constructs, we use the simple blanket fallback **`else` block** (`step 4 : else block`) to automatically handle all ages under 18. Please update Step 4 to use `step 4 : else block`.",
      correction: "step 4 : else block",
      suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("Minor")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasSingleEqualOperator && !hasGreaterEqualOperator) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara checking Step 2 Operator: You wrote `operator: =`. In programming, a single `=` is for assigning a value. For comparing if age is 18 or older, use the greater-than-or-equal operator `>=` \u2794 `operator: >=`.",
      correction: "operator: >=",
      suggestedInput: "Step 2: If\nLeft side: age\noperator: >=\nRight side: 18",
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (hasUnquotedPrint) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maara syntax alert: Wrap text strings in quotation marks: `print("Adult")` and `print("Minor")`. Without quotes, the compiler looks for undeclared variables!',
      correction: 'print("Adult"); and print("Minor");',
      suggestedInput: 'step 3 : Inside if block: print("Adult")\nstep 4 : else block\nstep 5 : Inside else block: print("Minor")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const isFullyVerified = hasVariableAge && hasValidIfCondition && hasPrintAdult && hasElseBranch && hasPrintMinor;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Ingredients Operation Trace with Example Age (20):**
\u2022 **Input Variable:** \`age = 20\`
\u2022 **Condition Operands:** Left Side: \`age\` (\u2794 \`20\`), Operator: \`>=\`, Right Side: \`18\`
\u2022 **Condition Evaluation:** \`20 >= 18\` evaluates to **true**
\u2022 **True Action:** \`print("Adult")\`
\u2022 **Fallback Else Action:** \`print("Minor")\`

\u{1F389} **Woohoo! Outstanding ingredients list!** \u{1F3C6} You gathered the \`age\` variable, comparison operator \`>=\`, comparison threshold \`18\`, quoted print statements, and neat else branch. All ingredients verified through concrete operation trace! Proceed to Stage 4: Taste the Sample!`;
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback,
      correction: "Proceed to Stage 4: Taste the Sample to assemble your prototype code.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18"
    };
  }
  if (!hasVariableAge) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! What programming ingredients do we need? Start with Step 1: Input variable `age`.",
      correction: "step 1 : age variable",
      suggestedInput: "step 1 : age variable",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariableAge && !hasValidIfCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Spot on! You have the `age` variable. \u{1F44F} Now for Step 2: How do you write the if condition using Left Side (L.S: `age`), Operator (`>=`), and Right Side (R.S: `18`)?",
      correction: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      suggestedInput: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
      matchedFirebaseInput: "step 1 : age variable"
    };
  }
  if (hasVariableAge && hasValidIfCondition && !hasPrintAdult) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maara here! Great condition! Now for Step 3: Inside the if block, write the winning print statement: `step 3 : Inside if block: print("Adult")`.',
      correction: 'step 3 : Inside if block: print("Adult")',
      suggestedInput: 'step 3 : Inside if block: print("Adult")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasVariableAge && hasValidIfCondition && hasPrintAdult && !hasElseBranch) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Step 1, Step 2, and Step 3 are ready! \u{1F44F} Now add the fallback `else` construct: `step 4 : else block`. This handles all ages under 18.",
      correction: "step 4 : else block",
      suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("Minor")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariableAge && hasValidIfCondition && hasPrintAdult && hasElseBranch && !hasPrintMinor) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maara here! Almost finished with ingredients! Add Step 5 inside the else block to print the negative message: `step 5 : Inside else block: print("Minor")`.',
      correction: 'step 5 : Inside else block: print("Minor")',
      suggestedInput: 'step 5 : Inside else block: print("Minor")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Let's gather all 5 ingredients step by step.",
    correction: "step 1 : age variable",
    suggestedInput: "step 1 : age variable",
    matchedFirebaseInput: "what ingredients do we need"
  };
}
function validateAdultMinorSampleCode(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase();
  let studentAge = null;
  const ageVarMatch = input.match(/(?:var|let|const|int)?\s*age\s*=\s*(\d+)/i) || input.match(/\b(1[0-9]|2[0-9]|[3-9][0-9]|[1-9])\b/);
  if (ageVarMatch) {
    studentAge = parseInt(ageVarMatch[1], 10);
  }
  const hasVariable = /(?:var|let|const|int)?\s*age\s*=/i.test(input) || /age\s*:\s*\d+/i.test(input);
  const hasCondition = /if\s*\(\s*age\s*>=\s*18\s*\)/i.test(input) || /if\s*\(\s*age\s*>\s*17\s*\)/i.test(input) || /if\s*age\s*>=\s*18/i.test(input);
  const hasQuotedPositivePrint = /print\s*\(\s*["']adult["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']adult["']\s*\)/i.test(input);
  const hasUnquotedPositivePrint = /print\s*\(\s*adult\s*\)/i.test(input) || /console\.log\s*\(\s*adult\s*\)/i.test(input);
  const hasElse = /\belse\b/i.test(input);
  const hasQuotedNegativePrint = /print\s*\(\s*["']minor["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']minor["']\s*\)/i.test(input);
  const hasUnquotedNegativePrint = /print\s*\(\s*minor\s*\)/i.test(input) || /console\.log\s*\(\s*minor\s*\)/i.test(input);
  const hasElseWithCondition = /else\s*\([^)]*\)/i.test(input) || /else\s*if\s*\(\s*age\s*<\s*18\s*\)/i.test(input);
  const hasInvertedBranches = /if\s*\(\s*age\s*>=\s*18\s*\)\s*\{?[^}]*?print\s*\(\s*["']?minor["']?\s*\)/i.test(input) || /if\s*\(\s*age\s*<\s*18\s*\)\s*\{?[^}]*?print\s*\(\s*["']?adult["']?\s*\)/i.test(input);
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Line 1: Declare age variable (e.g. var age = 20;)",
      completed: Boolean(hasVariable),
      current: !hasVariable
    },
    {
      stepNumber: 2,
      title: "Line 2: if (age >= 18) {",
      completed: Boolean(hasCondition),
      current: Boolean(hasVariable && !hasCondition)
    },
    {
      stepNumber: 3,
      title: "Line 3: print('Adult');",
      completed: Boolean(hasQuotedPositivePrint || hasUnquotedPositivePrint),
      current: Boolean(hasVariable && hasCondition && !hasQuotedPositivePrint && !hasUnquotedPositivePrint)
    },
    {
      stepNumber: 4,
      title: "Line 4: } else {",
      completed: Boolean(hasElse),
      current: Boolean(hasVariable && hasCondition && (hasQuotedPositivePrint || hasUnquotedPositivePrint) && !hasElse)
    },
    {
      stepNumber: 5,
      title: "Line 5: print('Minor'); }",
      completed: Boolean(hasQuotedNegativePrint || hasUnquotedNegativePrint),
      current: Boolean(hasVariable && hasCondition && (hasQuotedPositivePrint || hasUnquotedPositivePrint) && hasElse && !hasQuotedNegativePrint && !hasUnquotedNegativePrint)
    }
  ];
  const testAge1 = studentAge !== null ? studentAge : 20;
  const isAdult1 = testAge1 >= 18;
  const testAge2 = isAdult1 ? 15 : 22;
  const isAdult2 = testAge2 >= 18;
  const simConditionPassed1 = hasCondition && isAdult1;
  const simConditionPassed2 = hasCondition && isAdult2;
  let simExecutedBranch1 = "none";
  let simOutput1 = "No output";
  if (simConditionPassed1) {
    simExecutedBranch1 = "if";
    simOutput1 = hasQuotedPositivePrint || hasUnquotedPositivePrint ? hasInvertedBranches ? "Minor" : "Adult" : "No output";
  } else if (hasElse) {
    simExecutedBranch1 = "else";
    simOutput1 = hasQuotedNegativePrint || hasUnquotedNegativePrint ? hasInvertedBranches ? "Adult" : "Minor" : "No output";
  }
  let simExecutedBranch2 = "none";
  let simOutput2 = "No output";
  if (simConditionPassed2) {
    simExecutedBranch2 = "if";
    simOutput2 = hasQuotedPositivePrint || hasUnquotedPositivePrint ? hasInvertedBranches ? "Minor" : "Adult" : "No output";
  } else if (hasElse) {
    simExecutedBranch2 = "else";
    simOutput2 = hasQuotedNegativePrint || hasUnquotedNegativePrint ? hasInvertedBranches ? "Adult" : "Minor" : "No output";
  }
  const expectedOutput1 = isAdult1 ? "Adult" : "Minor";
  const expectedOutput2 = isAdult2 ? "Adult" : "Minor";
  const test1Passed = simOutput1 === expectedOutput1 && hasCondition && hasElse;
  const test2Passed = simOutput2 === expectedOutput2 && hasCondition && hasElse;
  const operationTestCases = [
    {
      testCaseTitle: isAdult1 ? "Test Case 1 (Adult Age Test)" : "Test Case 1 (Minor Age Test)",
      inputAge: testAge1,
      operationFormula: `age = ${testAge1}`,
      conditionCheck: `age >= 18 \u2794 ${testAge1} >= 18 evaluates to ${isAdult1 ? "TRUE" : "FALSE"}`,
      conditionEvaluated: isAdult1,
      executedBranch: simExecutedBranch1,
      outputMessage: simOutput1,
      expectedOutput: expectedOutput1,
      passed: test1Passed,
      explanation: `When age is ${testAge1}, the condition ${testAge1} >= 18 is ${isAdult1 ? "true" : "false"}, so the ${isAdult1 ? "if" : "else"} branch executes, displaying '${expectedOutput1}'.`
    },
    {
      testCaseTitle: isAdult2 ? "Test Case 2 (Adult Age Test)" : "Test Case 2 (Minor Age Test)",
      inputAge: testAge2,
      operationFormula: `age = ${testAge2}`,
      conditionCheck: `age >= 18 \u2794 ${testAge2} >= 18 evaluates to ${isAdult2 ? "TRUE" : "FALSE"}`,
      conditionEvaluated: isAdult2,
      executedBranch: simExecutedBranch2,
      outputMessage: simOutput2,
      expectedOutput: expectedOutput2,
      passed: test2Passed,
      explanation: `When age is ${testAge2}, the condition ${testAge2} >= 18 is ${isAdult2 ? "true" : "false"}, so the ${isAdult2 ? "if" : "else"} branch executes, displaying '${expectedOutput2}'.`
    }
  ];
  if (hasElseWithCondition) {
    return {
      allVerified: false,
      hasElseWithCondition: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: "\u{1F31F} Coach Maara syntax alert: `else` is a blanket fallback and never takes parentheses or a condition! Just write `else {`.",
      correction: 'else {\n  print("Minor");\n}',
      suggestedInput: 'else {\n  print("Minor");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasInvertedBranches) {
    return {
      allVerified: false,
      hasInvertedBranches: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: '\u{1F31F} Coach Maara logic check: Inverted print statements! When `age >= 18` is true, print `"Adult"` inside the `if` block, and print `"Minor"` inside the `else` block.',
      correction: 'if (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}',
      suggestedInput: 'var age = 20;\nif (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (!hasVariable) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: "\u{1F31F} Coach Maara here! Let's build your program step by step! Start with Line 1 by declaring your age variable: `var age = 20;`.",
      correction: "var age = 20;",
      suggestedInput: "var age = 20;",
      matchedFirebaseInput: "where to start"
    };
  }
  if (!hasCondition) {
    return {
      allVerified: false,
      hasVariable: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: "\u{1F31F} Coach Maara here! Great variable declaration! \u{1F44F} Now add Line 2: Write the if statement: `if (age >= 18) {`.",
      correction: "if (age >= 18) {",
      suggestedInput: "if (age >= 18) {",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (!hasQuotedPositivePrint && !hasUnquotedPositivePrint) {
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: '\u{1F31F} Coach Maara here! Spot on condition! \u{1F44F} Inside the if block on Line 3, write: `print("Adult");`.',
      correction: 'print("Adult");',
      suggestedInput: 'print("Adult");',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasUnquotedPositivePrint && !hasQuotedPositivePrint) {
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: '\u{1F31F} Coach Maara syntax alert: Wrap text strings in double quotes: `print("Adult");`.',
      correction: 'print("Adult");',
      suggestedInput: 'print("Adult");',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (!hasElse) {
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      hasQuotedPositivePrint: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: "\u{1F31F} Coach Maara here! Close the if block and add the else fallback on Line 4: `} else {`.",
      correction: "} else {",
      suggestedInput: "} else {",
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      return {
        allVerified: false,
        hasVariable: true,
        hasCondition: true,
        hasQuotedPositivePrint: true,
        hasElse: true,
        sampleCodeStepProgress,
        operationTestCases,
        feedback: '\u{1F31F} Coach Maara syntax alert: Wrap text in quotation marks: `print("Minor");`.',
        correction: 'print("Minor");',
        suggestedInput: 'print("Minor");',
        matchedFirebaseInput: "how to write sample code"
      };
    }
    return {
      allVerified: false,
      hasVariable: true,
      hasCondition: true,
      hasQuotedPositivePrint: true,
      hasElse: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback: '\u{1F31F} Coach Maara here! Inside the else block on Line 5, write: `print("Minor");` and close with `}`.',
      correction: '  print("Minor");\n}',
      suggestedInput: '  print("Minor");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  const allVerified = hasVariable && hasCondition && hasQuotedPositivePrint && hasElse && hasQuotedNegativePrint && !hasElseWithCondition && !hasInvertedBranches && test1Passed && test2Passed;
  const feedback = `\u{1F52C} **Live Code Execution & Test Cases Verified:**
\u2022 **Test Case 1 (\`age = ${testAge1}\`):** Evaluates \`${testAge1} >= 18\` \u2794 **${isAdult1 ? "TRUE" : "FALSE"}** \u2794 Executed: \`${simExecutedBranch1}\` branch \u2794 Output: **"${simOutput1}"** \u2705
\u2022 **Test Case 2 (\`age = ${testAge2}\`):** Evaluates \`${testAge2} >= 18\` \u2794 **${isAdult2 ? "TRUE" : "FALSE"}** \u2794 Executed: \`${simExecutedBranch2}\` branch \u2794 Output: **"${simOutput2}"** \u2705

\u{1F389} **CHEF-DE-CODE PROTOTYPE VERIFIED!** \u{1F3C6} Your Adult or Minor program ran flawlessly across both adult and minor age test cases. You have mastered variables, comparison operators (\`>=\`), conditional branching (\`if-else\`), and text outputs! Outstanding accomplishment!`;
  return {
    allVerified,
    hasVariable: true,
    hasCondition: true,
    hasQuotedPositivePrint: true,
    hasElse: true,
    hasQuotedNegativePrint: true,
    operationTestCases,
    sampleCodeStepProgress,
    feedback,
    correction: "All steps complete! Great job!",
    suggestedInput: void 0,
    matchedFirebaseInput: 'var age = 20;\nif (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}'
  };
}
export {
  validateAdultMinorIngredients,
  validateAdultMinorLogic,
  validateAdultMinorRecipe,
  validateAdultMinorSampleCode
};
