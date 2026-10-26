function validateMaxOfTwoLogic(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  if (norm.length < 4) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! How do we compare two numbers to find which one is larger, and what mathematical comparison operator do we use?",
      correction: "If a > b then a is Maximum; if b > a then b is Maximum.",
      suggestedInput: "Take two numbers a and b (e.g. a = 20, b = 10). If a > b (20 > 10 is true), a is Maximum. If b > a (10 > 20 is false), b is Maximum."
    };
  }
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|which is maximum)\b/i.test(norm) || norm.includes("how to find") || norm.includes("what is maximum");
  if (isQuestion) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! To find the maximum of two numbers (a and b), we compare them using the greater than operator (`>`).\n\n\u2022 For example with `a = 20` and `b = 10`:\n  - We test `20 > 10` \u2794 evaluates to **true** \u2794 **20 (a) is the Maximum**!\n  - If `a = 15` and `b = 40` \u2794 `15 > 40` is false \u2794 **40 (b) is the Maximum**!\n\nWrite this mathematical comparison rule with an example in your worksheet to complete the Logic stage!",
      correction: "Compare a and b: If a > b then a is Maximum, else b is Maximum.",
      suggestedInput: "If a > b (e.g. for a = 20, b = 10, 20 > 10 is true), then a is the Maximum. Otherwise (b > a), b is the Maximum.",
      matchedFirebaseInput: "what is maximum of two numbers"
    };
  }
  const rawComparisonMatches = Array.from(input.matchAll(/(\d+)\s*(>|<|>=|<=|==)\s*(\d+)/g));
  for (const match of rawComparisonMatches) {
    const left = parseInt(match[1], 10);
    const op = match[2];
    const right = parseInt(match[3], 10);
    let isMathFactTrue = false;
    if (op === ">") isMathFactTrue = left > right;
    else if (op === "<") isMathFactTrue = left < right;
    else if (op === ">=") isMathFactTrue = left >= right;
    else if (op === "<=") isMathFactTrue = left <= right;
    else if (op === "==") isMathFactTrue = left === right;
    const isClaimedTrue = /true|maximum|greater|larger|big/i.test(norm);
    if (!isMathFactTrue && isClaimedTrue && norm.includes(`${left} ${op} ${right} is maximum`)) {
      return {
        isFullyVerified: false,
        hasContradiction: true,
        feedback: `\u{1F31F} Coach Maara gentle check: Look closely at your comparison \`${left} ${op} ${right}\`! ${left} is not greater than ${right}. So \`${left} > ${right}\` is false, meaning ${right} would be the larger number.`,
        correction: `For ${left} and ${right}: \`${Math.max(left, right)} > ${Math.min(left, right)}\` is true -> ${Math.max(left, right)} is Maximum.`,
        suggestedInput: `For a = 20 and b = 10: 20 > 10 is true -> 20 is Maximum. For a = 5 and b = 15: 15 > 5 is true -> 15 is Maximum.`,
        matchedFirebaseInput: "how to find maximum of two numbers"
      };
    }
  }
  const mentionsComparison = />|<|greater|larger|bigger|compare|maximum|max/i.test(norm);
  const mentionsTwoVariables = /\ba\b/i.test(norm) && /\bb\b/i.test(norm) || /\bnum1\b/i.test(norm) && /\bnum2\b/i.test(norm) || /\bx\b/i.test(norm) && /\by\b/i.test(norm) || /first\s*number/i.test(norm) && /second\s*number/i.test(norm) || /two\s*numbers/i.test(norm);
  const hasMathematicalCheck = />|<|>=|<=/i.test(norm) || /a\s*>\s*b/i.test(norm) || /b\s*>\s*a/i.test(norm) || /num1\s*>\s*num2/i.test(norm) || /\d+\s*>\s*\d+/i.test(norm);
  const mentionsMaxOutcome = /maximum|greater|larger|biggest|first\s*number|second\s*number/i.test(norm);
  const claimsSmallerIsMax = /if\s*a\s*>\s*b.*?b\s*is\s*maximum/i.test(norm) || /if\s*b\s*>\s*a.*?a\s*is\s*maximum/i.test(norm) || /a\s*<\s*b.*?a\s*is\s*maximum/i.test(norm);
  if (claimsSmallerIsMax) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at your comparison! When `a > b` evaluates to **true**, it means `a` is greater than `b`, so **`a` is the Maximum**! When `a > b` is **false** (or `b > a`), then **`b` is the Maximum**.",
      correction: "If a > b then a is Maximum; if b > a then b is Maximum.",
      suggestedInput: "If a > b (e.g. 20 > 10 -> true), then a is the Maximum. Otherwise (b > a), b is the Maximum.",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  const hasConceptualLogic = mentionsComparison && mentionsTwoVariables;
  if (hasConceptualLogic && !hasMathematicalCheck) {
    return {
      isFullyVerified: false,
      hasTwoNumbersConcept: true,
      hasComparisonOperator: false,
      hasMaxOutcome: mentionsMaxOutcome,
      feedback: "\u{1F31F} Coach Maara here! Good conceptual start in words! You understand we need to compare the two numbers. \u{1F44F}\n\nNow, **explain it mathematically with comparison operator (>) and an example!**\n\u2022 Take two example numbers (like `a = 20` and `b = 10`):\n\u2022 Condition: `a > b` (i.e. `20 > 10`) \u2794 evaluates to **true** \u2794 **`a` (20) is Maximum**.\n\u2022 Otherwise if `b > a` \u2794 **`b` is Maximum**.\n\nWrite your mathematical comparison condition (`a > b`) in your worksheet to complete this logic stage!",
      correction: "Explain mathematically: If a > b (e.g. 20 > 10 -> true) then a is Maximum, else b is Maximum.",
      suggestedInput: "Take two numbers a and b. Mathematically: If a > b (e.g. for a = 20, b = 10, 20 > 10 is true), then a is Maximum. Otherwise, b is Maximum.",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  if (!isQuestion && hasConceptualLogic && hasMathematicalCheck && mentionsMaxOutcome) {
    const feedback2 = `\u{1F389} **Logic Approved by Coach Maara!** \u{1F3C6}
Your mathematical comparison logic is 100% correct! You clearly defined that when \`a > b\` is true, **a is the Maximum**, and when false, **b is the Maximum**.

Fantastic job! Proceed to Stage 2: Recipe!`;
    return {
      isFullyVerified: true,
      hasTwoNumbersConcept: true,
      hasComparisonOperator: true,
      hasMaxOutcome: true,
      feedback: feedback2,
      correction: "Proceed to Stage 2: Recipe to write the step-by-step algorithm.",
      suggestedInput: void 0,
      matchedFirebaseInput: "if a > b then a is maximum else b is maximum"
    };
  }
  let feedback = "\u{1F31F} Coach Maara here! What mathematical comparison tests which of two numbers (a and b) is larger?";
  if (attemptCount >= 2) {
    feedback = "\u{1F31F} Coach Maara checking back! To find the maximum of two numbers `a` and `b`, we test if `a > b`. If true, `a` is maximum; otherwise `b` is maximum. Write this rule with an example in your worksheet!";
  }
  return {
    isFullyVerified: false,
    hasTwoNumbersConcept: mentionsTwoVariables,
    hasComparisonOperator: hasMathematicalCheck,
    hasMaxOutcome: mentionsMaxOutcome,
    feedback,
    correction: "If a > b display a is Maximum, else display b is Maximum.",
    suggestedInput: "If a > b (e.g. a = 20, b = 10 -> 20 > 10 is true), then a is Maximum. Otherwise, b is Maximum.",
    matchedFirebaseInput: "how to find maximum of two numbers"
  };
}
function validateMaxOfTwoRecipe(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|what steps)\b/i.test(norm);
  const hasStep1 = !isQuestion && (/step\s*1\s*:?\s*(?:get|input|read|accept|take|declare|initialize)/i.test(norm) || /1\s*[\.\)]\s*(?:get|input|read|accept|take)/i.test(norm) || /(?:get|read|take|input)\s+(?:two\s*numbers|numbers|values|a\s*(?:and|&)\s*b|num1\s*(?:and|&)\s*num2|first\s*and\s*second)/i.test(norm));
  const hasStep2Condition = !isQuestion && (/step\s*2\s*:?\s*(?:if|check|compare)/i.test(norm) || /2\s*[\.\)]\s*(?:if|check|compare)/i.test(norm) || /(?:if|check\s*if|compare)\s+(?:a\s*>\s*b|a\s*is\s*greater|first\s*number\s*is\s*greater|b\s*>\s*a)/i.test(norm) || /compare\s+(?:a\s*and\s*b|the\s*two\s*numbers|two\s*numbers)/i.test(norm));
  const hasStep2Outcomes = !isQuestion && (/display\s+(?:a|first\s*number|maximum)|print\s+(?:a|maximum)|a\s*is\s*maximum/i.test(norm) && /display\s+(?:b|second\s*number)|print\s+(?:b)|b\s*is\s*maximum|else|otherwise/i.test(norm));
  const hasInvertedStep2 = /if\s*a\s*>\s*b.*?display\s*b/i.test(norm) || /if\s*b\s*>\s*a.*?display\s*a/i.test(norm);
  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Get two input numbers a and b",
      completed: Boolean(hasStep1),
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum",
      completed: Boolean(hasStep1 && hasStep2Condition && hasStep2Outcomes && !hasInvertedStep2),
      current: Boolean(hasStep1 && (!hasStep2Condition || !hasStep2Outcomes || hasInvertedStep2))
    }
  ];
  if (hasInvertedStep2) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara logic alert: Look closely at Step 2! When `a > b` is true, `a` is the larger number, so display `a` (not `b`)! Please correct your recipe step.",
      correction: "Step 2: If a is greater than b display a is Maximum, else display b is Maximum.",
      suggestedInput: "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.",
      matchedFirebaseInput: "step 2 : If a is greater than b display a is Maximum, else display b is Maximum"
    };
  }
  const isFullyVerified = hasStep1 && hasStep2Condition && hasStep2Outcomes && !hasInvertedStep2;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Recipe Algorithm Trace with Example Numbers (a = 20, b = 10):**
\u2022 **Step 1:** Get input numbers \`a = 20\` and \`b = 10\`
\u2022 **Step 2:** Check condition: \`20 > 10\` evaluates to **true**
\u2022 **Step 3:** Since true \u2794 Display **"a (20) is Maximum"** (otherwise display b) \u2705

\u{1F389} **Woohoo! Outstanding recipe!** \u{1F3C6} You wrote a crystal-clear 2-step algorithm for finding the Maximum of Two Numbers. Proceed to Stage 3: Ingredients!`;
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback,
      correction: "Proceed to Stage 3: Ingredients to gather variables and comparison tools.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If a is greater than b display a is Maximum, else display b is Maximum"
    };
  }
  if (!hasStep1) {
    const variedFeedback = attemptCount >= 2 ? "\u{1F31F} Coach Maara checking back! What is the very first step before comparing? We must get the two numbers from the user! Write: 'Step 1: Get two input numbers a and b'." : "\u{1F31F} Coach Maara here! Let's think like a chef writing a recipe step by step. What is the very first step we must take? (Step 1: Get two input numbers a and b).";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: variedFeedback,
      correction: "Step 1: Get two input numbers a and b.",
      suggestedInput: "Step 1: Get two input numbers a and b.",
      matchedFirebaseInput: "what steps to write"
    };
  }
  if (hasStep1 && (!hasStep2Condition || !hasStep2Outcomes)) {
    const variedFeedback = attemptCount >= 2 ? "\u{1F31F} Coach Maara here! Step 1 looks solid! \u{1F44F} Now for Step 2: How do you compare `a` and `b`, and what do you display when `a > b` is true vs false? (If a is greater than b display a is Maximum, else display b is Maximum)." : "\u{1F31F} Coach Maara here! Great start with Step 1! \u{1F44F} For Step 2, write the decision: compare if a is greater than b and state what to display for both cases!";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: variedFeedback,
      correction: "Step 2: If a is greater than b display a is Maximum, else display b is Maximum.",
      suggestedInput: "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.",
      matchedFirebaseInput: "step 1 : Get two input numbers a and b"
    };
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Let's build our recipe step by step. Start with Step 1: Get two input numbers a and b.",
    correction: "Step 1: Get two input numbers a and b.",
    suggestedInput: "Step 1: Get two input numbers a and b.",
    matchedFirebaseInput: "what steps to write"
  };
}
function validateMaxOfTwoIngredients(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|what ingredients)\b/i.test(norm);
  const hasVariables = !isQuestion && (/step\s*1\s*:?\s*(?:a\s*(?:and|&)\s*b|num1\s*(?:and|&)\s*num2|x\s*(?:and|&)\s*y|variables?\s*a\s*(?:and|&)\s*b)/i.test(norm) || /\ba\b/i.test(norm) && /\bb\b/i.test(norm) || /\bnum1\b/i.test(norm) && /\bnum2\b/i.test(norm));
  const userVarMatch = norm.match(/step\s*1\s*:?\s*(?:variables?|vars?|inputs?)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:and|&|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)/i) || norm.match(/variables?\s*:?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*(?:and|&|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)/i);
  const detectedVar1 = userVarMatch ? userVarMatch[1] || "a" : "a";
  const detectedVar2 = userVarMatch ? userVarMatch[2] || "b" : "b";
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
  const hasElseWithCondition = hasElseInStep2 && /left\s*side|\bl\.?s\.?\b|operator|\bop\b|right\s*side|\br\.?s\.?\b|>|<|>=|<=|==/i.test(step2Target);
  const lsMatch = step2Target.match(/(?:left\s*side|\bl\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongLeftSideDetected = null;
  if (lsMatch) {
    const rawLS = lsMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/(?:a|b|num1|num2|x|y|val1|val2)\b/i.test(rawLS)) {
      wrongLeftSideDetected = rawLS || "(empty)";
    }
  }
  const explicitOperatorMatch = step2Target.match(/(?:operator|\bop\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i) || step2Target.match(/(?:step\s*2|condition|if\s*\(?[a-zA-Z_0-9]+)\s*.*?([><!=]=?)\s*[a-zA-Z_0-9]+/i);
  let wrongOperatorDetected = null;
  if (explicitOperatorMatch) {
    const rawOp = explicitOperatorMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (rawOp !== ">" && rawOp !== ">=" && !rawOp.includes(">")) {
      wrongOperatorDetected = rawOp || "(empty)";
    }
  }
  const rsExplicitMatch = step2Target.match(/(?:right\s*side|\br\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongRightSideDetected = null;
  if (rsExplicitMatch) {
    const rawRS = rsExplicitMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/(?:b|a|num2|num1|y|x|val2|val1)\b/i.test(rawRS)) {
      wrongRightSideDetected = rawRS || "(empty)";
    }
  }
  const mentionsComparisonInCondition = step2Target.includes(">") || step2Target.includes("greater") || norm.includes(">") || norm.includes("greater");
  const hasValidIfCondition = hasVariables && !hasElseWithCondition && !wrongLeftSideDetected && !wrongOperatorDetected && !wrongRightSideDetected && mentionsComparisonInCondition && (norm.includes("a > b") || norm.includes("num1 > num2") || norm.includes("x > y") || /\b[a-zA-Z_0-9]+\s*>\s*[a-zA-Z_0-9]+\b/i.test(norm) || step2Target.includes("l s") && step2Target.includes("r s") && step2Target.includes("operator") || step2Target.includes("left side") && step2Target.includes("right side") || step2Target.includes("left side") && step2Target.includes("operator") || step2Target.includes("l.s") && step2Target.includes("operator") || /\bif\b/i.test(step2Target) && mentionsComparisonInCondition);
  const step3Target = step3Text || (norm.match(/step\s*3\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step5Target = step5Text || (norm.match(/step\s*5\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideIfSection = (norm.match(/inside\s*if\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideElseSection = (norm.match(/inside\s*else\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step3HasB = /print\s*\(\s*["']?b\b/i.test(step3Target) || /print\s*\(\s*["']?b\s*is\s*maximum/i.test(step3Target);
  const step5HasA = /print\s*\(\s*["']?a\b/i.test(step5Target) || /print\s*\(\s*["']?a\s*is\s*maximum/i.test(step5Target);
  const hasPrintA = !step3HasB && (/print\s*\(\s*(?:a|["']a\s*is\s*maximum["']|a\s*\+\s*["'].*?["'])\s*\)/i.test(norm) || /step\s*3\s*:?.*?print.*?a/i.test(norm) || /display\s*["']?a/i.test(norm) || Boolean(step3Text) && /print|display/i.test(step3Text));
  const hasStep4Else = /step\s*4\s*[:\-\s]*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || /4\s*[\.\)]\s*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || Boolean(step4Text) && /\belse\b/i.test(step4Text);
  const hasElseBranch = !hasElseWithCondition && hasValidIfCondition && hasPrintA && (hasStep4Else || /fallback\s*else\s*block/i.test(norm) && !hasElseInStep2);
  const hasPrintB = !step5HasA && (/print\s*\(\s*(?:b|["']b\s*is\s*maximum["']|b\s*\+\s*["'].*?["'])\s*\)/i.test(norm) || /step\s*5\s*:?.*?print.*?b/i.test(norm) || /display\s*["']?b/i.test(norm) || Boolean(step5Text) && /print|display/i.test(step5Text));
  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: `Step 1: Input variables (${detectedVar1} and ${detectedVar2})`,
      completed: Boolean(hasVariables),
      current: !hasVariables
    },
    {
      stepNumber: 2,
      title: `Step 2: If condition (L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2})`,
      completed: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition),
      current: Boolean(hasVariables && (!hasValidIfCondition || hasElseWithCondition))
    },
    {
      stepNumber: 3,
      title: `Step 3: Inside if block: print(${detectedVar1})`,
      completed: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && hasPrintA),
      current: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && !hasPrintA)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block",
      completed: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && hasPrintA && hasElseBranch),
      current: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: `Step 5: Inside else block: print(${detectedVar2})`,
      completed: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && hasPrintA && hasElseBranch && hasPrintB),
      current: Boolean(hasVariables && hasValidIfCondition && !hasElseWithCondition && hasPrintA && hasElseBranch && !hasPrintB)
    }
  ];
  if (hasElseWithCondition) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Input variables (${detectedVar1} and ${detectedVar2})\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** You wrote \`else\` with comparison components (Left Side: \`${detectedVar1}\`, Operator: \`>\`, Right Side: \`${detectedVar2}\`) \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' in Programming Logic:**
\u2022 **Why we use \`if\`:** In programming, the **\`if\` construct** is used when you need to evaluate a specific comparison question (Left Side: \`${detectedVar1}\`, Operator: \`>\`, Right Side: \`${detectedVar2}\`). When that condition evaluates to **true**, the code inside the \`if\` block executes!
\u2022 **Why we use \`else\`:** The **\`else\` construct** is a blanket fallback mechanism. It has **no condition** (no Left Side, Operator, or Right Side) of its own. Its sole purpose is to automatically execute when the \`if\` condition turns out to be **false**.

\u{1F3AF} **How to Solve & Proceed to Next Step:**
Since you are testing the condition (\`${detectedVar1} > ${detectedVar2}\`), replace \`else\` with the **\`if\` condition**:
\`step 2 : If condition with Left Side (${detectedVar1}), Operator (>), Right Side (${detectedVar2})\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: `step 2 : If condition with Left Side (${detectedVar1}), Operator (>), Right Side (${detectedVar2})`,
      suggestedInput: `step 2 : If condition with Left Side (${detectedVar1}), Operator (>), Right Side (${detectedVar2})`,
      matchedFirebaseInput: "step 2 : If condition"
    };
  }
  if (wrongLeftSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Left Side: Look at your Left Side (L.S)! You wrote \`Left side: ${wrongLeftSideDetected}\`. In the condition \`${detectedVar1} > ${detectedVar2}\`, the Left Side is the first variable \`${detectedVar1}\` (\`Left side: ${detectedVar1}\` or \`L.S: ${detectedVar1}\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      matchedFirebaseInput: "step 2 : If condition with L.S: a, Operator: >, R.S: b"
    };
  }
  if (wrongOperatorDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara operator check: You wrote \`operator: ${wrongOperatorDetected}\`. To test if the first number is larger than the second, use the greater than operator \`>\` (\`operator: >\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      matchedFirebaseInput: "step 2 : If condition with L.S: a, Operator: >, R.S: b"
    };
  }
  if (wrongRightSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Right Side: Look at your Right Side (R.S)! You wrote \`right side: ${wrongRightSideDetected}\`. In the condition \`${detectedVar1} > ${detectedVar2}\`, the Right Side is the second variable \`${detectedVar2}\` (\`right side: ${detectedVar2}\` or \`R.S: ${detectedVar2}\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      matchedFirebaseInput: "step 2 : If condition with L.S: a, Operator: >, R.S: b"
    };
  }
  if (step3HasB) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at Step 3! In Step 2, the condition tests if \`a > b\` (a is greater than b). When this condition is **true**, \`a\` is the Maximum! Step 3 must print variable a: \`step 3 : Inside if block: print(a)\`.`,
      correction: "step 3 : Inside if block: print(a)",
      suggestedInput: "step 3 : Inside if block: print(a)",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (step5HasA) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at Step 5! In the \`else\` block (when a > b is false), \`b\` is the Maximum! Step 5 must print variable b: \`step 5 : Inside else block: print(b)\`.`,
      correction: "step 5 : Inside else block: print(b)",
      suggestedInput: "step 5 : Inside else block: print(b)",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const isFullyVerified = hasVariables && hasValidIfCondition && hasPrintA && hasElseBranch && hasPrintB;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Ingredients Operation Trace with Example Numbers (a = 20, b = 10):**
\u2022 **Input Variables:** \`a = 20\`, \`b = 10\`
\u2022 **Condition Operands:** Left Side: \`a\` (\u2794 \`20\`), Operator: \`>\`, Right Side: \`b\` (\u2794 \`10\`)
\u2022 **Condition Evaluation:** \`20 > 10\` evaluates to **true**
\u2022 **True Action:** \`print(a)\` (prints \`20\`)
\u2022 **Fallback Else Action:** \`print(b)\` (prints \`10\`)

\u{1F389} **Woohoo! Outstanding ingredients list!** \u{1F3C6} You gathered the \`a\` and \`b\` variables, greater than operator \`>\`, if-else structure, and print statements. All ingredients verified through concrete operation trace! Proceed to Stage 4: Taste the Sample!`;
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback,
      correction: "Proceed to Stage 4: Taste the Sample to assemble your prototype code.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If condition with L.S: a, Operator: >, R.S: b"
    };
  }
  if (!hasVariables) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! What programming ingredients do we need? Start with Step 1: Input variables `a` and `b`.",
      correction: "step 1 : a and b variables",
      suggestedInput: "step 1 : a and b variables",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariables && !hasValidIfCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara here! Spot on! You have the \`${detectedVar1}\` and \`${detectedVar2}\` variables. \u{1F44F} Now for Step 2: How do you write the if condition using Left Side (L.S: \`${detectedVar1}\`), Operator (\`>\`), and Right Side (R.S: \`${detectedVar2}\`)?`,
      correction: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar1}, Operator: >, R.S: ${detectedVar2}`,
      matchedFirebaseInput: "step 1 : a and b variables"
    };
  }
  if (hasVariables && hasValidIfCondition && !hasPrintA) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara here! Great condition! Now for Step 3: Inside the if block, write the print statement for the maximum value: \`step 3 : Inside if block: print(${detectedVar1})\`.`,
      correction: `step 3 : Inside if block: print(${detectedVar1})`,
      suggestedInput: `step 3 : Inside if block: print(${detectedVar1})`,
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasVariables && hasValidIfCondition && hasPrintA && !hasElseBranch) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Step 1, Step 2, and Step 3 are ready! \u{1F44F} Now add the fallback `else` construct: `step 4 : else block`. This automatically handles when the second number is larger.",
      correction: "step 4 : else block",
      suggestedInput: `step 4 : else block
step 5 : Inside else block: print(${detectedVar2})`,
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariables && hasValidIfCondition && hasPrintA && hasElseBranch && !hasPrintB) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara here! Almost finished with ingredients! Add Step 5 inside the else block: \`step 5 : Inside else block: print(${detectedVar2})\`.`,
      correction: `step 5 : Inside else block: print(${detectedVar2})`,
      suggestedInput: `step 5 : Inside else block: print(${detectedVar2})`,
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Let's gather all 5 ingredients step by step.",
    correction: "step 1 : a and b variables",
    suggestedInput: "step 1 : a and b variables",
    matchedFirebaseInput: "what ingredients do we need"
  };
}
function validateMaxOfTwoSampleCode(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain)\b/i.test(norm);
  const hasVarDeclaration = !isQuestion && (/(?:var|let|const|int)\s+[a-zA-Z_0-9]+\s*=\s*\d+/i.test(input) || /\b(?:a|num1|x)\s*=\s*\d+/i.test(input));
  const hasTwoVars = !isQuestion && (/(?:var|let|const|int)?\s*[a-zA-Z_0-9]+\s*=\s*\d+.*?(?:var|let|const|int)?\s*[a-zA-Z_0-9]+\s*=\s*\d+/is.test(input) || /\ba\s*=\s*\d+/i.test(input) && /\bb\s*=\s*\d+/i.test(input) || /\bnum1\s*=\s*\d+/i.test(input) && /\bnum2\s*=\s*\d+/i.test(input));
  const userVar1Match = input.match(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\d+)/i);
  const detectedVar1 = userVar1Match ? userVar1Match[1] : "a";
  const val1 = userVar1Match ? parseInt(userVar1Match[2], 10) : 20;
  const allVarMatches = Array.from(input.matchAll(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(\d+)/gi));
  const detectedVar2 = allVarMatches.length > 1 ? allVarMatches[1][1] : "b";
  const val2 = allVarMatches.length > 1 ? parseInt(allVarMatches[1][2], 10) : 10;
  const hasIfCondition = !isQuestion && (/if\s*\(\s*[a-zA-Z_0-9]+\s*>\s*[a-zA-Z_0-9]+\s*\)/i.test(input) || /if\s*\(\s*[a-zA-Z_0-9]+\s*>=\s*[a-zA-Z_0-9]+\s*\)/i.test(input));
  const hasElseBranch = !isQuestion && /\belse\b/i.test(input);
  const hasPrintVar1 = !isQuestion && (new RegExp(`print\\s*\\(\\s*(?:${detectedVar1}|["']${detectedVar1}|${detectedVar1}\\s*\\+)`, "i").test(input) || /print\s*\(\s*(?:a|num1|x)\s*\)/i.test(input) || /console\.log\s*\(\s*(?:a|num1|x)\s*\)/i.test(input));
  const hasPrintVar2 = !isQuestion && (new RegExp(`print\\s*\\(\\s*(?:${detectedVar2}|["']${detectedVar2}|${detectedVar2}\\s*\\+)`, "i").test(input) || /print\s*\(\s*(?:b|num2|y)\s*\)/i.test(input) || /console\.log\s*\(\s*(?:b|num2|y)\s*\)/i.test(input));
  const hasElseWithCondition = /\belse\s*\([^\)]+\)/i.test(input);
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: `Step 1: Declare input variables (var ${detectedVar1} = ${val1}; var ${detectedVar2} = ${val2};)`,
      completed: Boolean(hasTwoVars),
      current: !hasTwoVars
    },
    {
      stepNumber: 2,
      title: `Step 2: If condition (if (${detectedVar1} > ${detectedVar2}) {)`,
      completed: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition),
      current: Boolean(hasTwoVars && (!hasIfCondition || hasElseWithCondition))
    },
    {
      stepNumber: 3,
      title: `Step 3: Inside if block: print(${detectedVar1});`,
      completed: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && hasPrintVar1),
      current: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && !hasPrintVar1)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else branch: } else {",
      completed: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && hasPrintVar1 && hasElseBranch),
      current: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && hasPrintVar1 && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: `Step 5: Inside else block: print(${detectedVar2}); }`,
      completed: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && hasPrintVar1 && hasElseBranch && hasPrintVar2),
      current: Boolean(hasTwoVars && hasIfCondition && !hasElseWithCondition && hasPrintVar1 && hasElseBranch && !hasPrintVar2)
    }
  ];
  const testCases = [
    {
      testCaseTitle: "Test Case 1: First number larger (a = 20, b = 10)",
      inputA: 20,
      inputB: 10,
      operationFormula: "20 > 10",
      conditionCheck: "20 > 10",
      conditionEvaluated: true,
      executedBranch: "if",
      outputMessage: "20",
      expectedOutput: "20",
      passed: true,
      explanation: "20 is greater than 10 (20 > 10 is true), so the if-block executes and displays 20."
    },
    {
      testCaseTitle: "Test Case 2: Second number larger (a = 15, b = 45)",
      inputA: 15,
      inputB: 45,
      operationFormula: "15 > 45",
      conditionCheck: "15 > 45",
      conditionEvaluated: false,
      executedBranch: "else",
      outputMessage: "45",
      expectedOutput: "45",
      passed: true,
      explanation: "15 is not greater than 45 (15 > 45 is false), so the fallback else-block executes and displays 45."
    }
  ];
  if (hasElseWithCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      hasContradiction: true,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara syntax alert: Look at your `else` statement! In JavaScript, the `else` keyword is a blanket fallback that takes **no condition** (no parentheses `()`). Just write `} else {`.",
      correction: "} else {",
      suggestedInput: `var ${detectedVar1} = 20;
var ${detectedVar2} = 10;
if (${detectedVar1} > ${detectedVar2}) {
  print(${detectedVar1});
} else {
  print(${detectedVar2});
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  const allVerified = hasTwoVars && hasIfCondition && hasPrintVar1 && hasElseBranch && hasPrintVar2 && !hasElseWithCondition;
  if (allVerified) {
    const feedback = `\u{1F52C} **Concrete Code Execution & Trace (a = ${val1}, b = ${val2}):**
\u2022 **Variables:** \`${detectedVar1} = ${val1}\`, \`${detectedVar2} = ${val2}\`
\u2022 **Condition:** \`${val1} > ${val2}\` evaluates to **${val1 > val2 ? "true" : "false"}**
\u2022 **Branch Executed:** ${val1 > val2 ? "`if` block" : "`else` block"}
\u2022 **Output:** \`${val1 > val2 ? val1 : val2}\`

\u{1F389} **CONGRATULATIONS! CHALLENGE COMPLETED!** \u{1F3C6}
Your code prototype successfully finds and prints the maximum of two numbers across all test cases! You have mastered the complete CTC journey: Logic \u2794 Recipe \u2794 Ingredients \u2794 Taste the Sample!`;
    return {
      isFullyVerified: true,
      allVerified: true,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "var a = 20; var b = 10; if (a > b) print(a); else print(b);"
    };
  }
  if (!hasTwoVars) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara here! Let's start our JavaScript prototype with Step 1: Declare two test variables with numbers (e.g. `var a = 20; var b = 10;`).",
      correction: "var a = 20; var b = 10;",
      suggestedInput: "var a = 20;\nvar b = 10;",
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasTwoVars && !hasIfCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maara here! Variables are declared! \u{1F44F} Now for Step 2: Write the \`if\` condition to compare \`${detectedVar1}\` and \`${detectedVar2}\`: \`if (${detectedVar1} > ${detectedVar2}) {\`.`,
      correction: `if (${detectedVar1} > ${detectedVar2}) {`,
      suggestedInput: `if (${detectedVar1} > ${detectedVar2}) {
  print(${detectedVar1});
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasTwoVars && hasIfCondition && !hasPrintVar1) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maara here! Inside the \`if\` block, write Step 3: Print the first number: \`print(${detectedVar1});\`.`,
      correction: `print(${detectedVar1});`,
      suggestedInput: `print(${detectedVar1});`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasTwoVars && hasIfCondition && hasPrintVar1 && !hasElseBranch) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara here! Add Step 4: Write the fallback `else` branch: `} else {` to handle when the second number is larger.",
      correction: "} else {",
      suggestedInput: `} else {
  print(${detectedVar2});
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasTwoVars && hasIfCondition && hasPrintVar1 && hasElseBranch && !hasPrintVar2) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maara here! Almost done! Inside the \`else\` block, write Step 5: Print the second number: \`print(${detectedVar2}); }\`.`,
      correction: `print(${detectedVar2}); }`,
      suggestedInput: `print(${detectedVar2});
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  return {
    isFullyVerified: false,
    allVerified: false,
    sampleCodeStepProgress,
    operationTestCases: testCases,
    feedback: "\u{1F31F} Coach Maara here! Let's write the code line by line.",
    correction: "var a = 20; var b = 10;",
    suggestedInput: "var a = 20;\nvar b = 10;\nif (a > b) {\n  print(a);\n} else {\n  print(b);\n}",
    matchedFirebaseInput: "how to write sample code"
  };
}
export {
  validateMaxOfTwoIngredients,
  validateMaxOfTwoLogic,
  validateMaxOfTwoRecipe,
  validateMaxOfTwoSampleCode
};
