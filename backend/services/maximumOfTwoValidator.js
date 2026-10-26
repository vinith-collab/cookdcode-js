function validateMaximumOfTwoLogic(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  if (norm.length < 4) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! How do we compare two numbers `a` and `b` to find which one is larger (maximum)? What comparison operator do we use?",
      correction: "If a > b, then a is maximum, else b is maximum.",
      suggestedInput: "If number a is greater than number b (a > b), then a is maximum, else b is maximum. For example: 25 > 10 is true, so 25 is maximum.",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|express|explain|guidance|clue)\b/i.test(norm) || norm.includes("how to find") || norm.includes("what is maximum");
  if (isQuestion && !norm.includes(">") && !norm.includes("greater")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Compare number `a` and number `b` using the greater-than operator (`>`).\n\nIf `a > b`, then `a` is the maximum; otherwise `b` is the maximum.\n\nTo complete this logic stage, write this comparison rule with an example in your worksheet:\n\u2022 For a = 25, b = 10: `25 > 10` is true \u2794 **25 is Maximum**\n\u2022 For a = 7, b = 15: `7 > 15` is false \u2794 **15 is Maximum**",
      correction: "If a > b then a is maximum else b is maximum.",
      suggestedInput: "If a > b then a is maximum else b is maximum (e.g. 25 > 10 is true -> 25 is maximum; 7 > 15 is false -> 15 is maximum).",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  const explicitWordContradictions = Array.from(norm.matchAll(/(\d+)\s+is\s+(?:greater|larger|more)\s+than\s+(\d+)/g));
  for (const match of explicitWordContradictions) {
    const l = parseInt(match[1], 10);
    const r = parseInt(match[2], 10);
    if (l <= r) {
      return {
        isFullyVerified: false,
        hasContradiction: true,
        feedback: `\u{1F31F} Coach Maara gentle check: Look closely at your arithmetic: you wrote \`${l} is greater than ${r}\`, but ${l} is actually smaller than ${r}!`,
        correction: `Write a true statement like \`${r} is greater than ${l}\` or \`a > b\`.`,
        suggestedInput: `If a > b then a is maximum else b is maximum.`,
        matchedFirebaseInput: "how to find maximum of two numbers"
      };
    }
  }
  const claimsLessThanIsMax = /(?:^|[\n;,])\s*(?:if\s+)?(?:a\s*<\s*b|b\s*>\s*a)\s*(?:then\s*)?(?:a\s*(?:is\s*)?max|first\s*(?:is\s*)?max)/i.test(norm) && !/(?:else|otherwise)\s*(?:a\s*(?:is\s*)?max)/i.test(norm);
  const claimsGreaterThanIsMin = /(?:^|[\n;,])\s*(?:if\s+)?(?:a\s*>\s*b)\s*(?:then\s*)?(?:b\s*(?:is\s*)?max|second\s*(?:is\s*)?max)/i.test(norm) && !/(?:else|otherwise)\s*(?:b\s*(?:is\s*)?max)/i.test(norm);
  if (claimsLessThanIsMax || claimsGreaterThanIsMin) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maara gentle check: Look closely at your comparison! When `a > b` (number `a` is strictly greater than `b`), `a` is the **Maximum**! Only when that condition is false (or `b > a`) does `b` become the Maximum.",
      correction: "If a > b then a is maximum else b is maximum.",
      suggestedInput: "If a > b then a is maximum else b is maximum (e.g. 25 > 10 -> 25 is maximum).",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  const mentionsTwoVariables = /\b(?:a|num1|first|x)\b/i.test(norm) && /\b(?:b|num2|second|y)\b/i.test(norm) || /\btwo\s*numbers?\b/i.test(norm) || /\bboth\s*numbers?\b/i.test(norm);
  const mentionsComparison = /\b(?:greater|larger|bigger|more|highest|maximum|max|>|<)\b/i.test(norm) || norm.includes(">") || norm.includes("<");
  const mentionsGreaterOperator = norm.includes(">") || /\bgreater\s*than\b/i.test(norm) || /\blarger\s*than\b/i.test(norm) || /\bbigger\s*than\b/i.test(norm);
  const hasMathematicalCheck = /a\s*>\s*b/i.test(norm) || /b\s*>\s*a/i.test(norm) || /num1\s*>\s*num2/i.test(norm) || /\b\d+\s*>\s*\d+\b/.test(norm) || norm.includes("a > b") || norm.includes("num1 > num2");
  const mentionsAIsMax = /(?:a|first|num1)\s*(?:is\s*)?(?:the\s*)?(?:max|maximum|greater|larger|bigger)/i.test(norm) || /(?:max|maximum|larger|greater)\s*(?:is\s*)?(?:a\b|first|num1)/i.test(norm) || /if\s*\(?a\s*>\s*b\)?\s*(?:then\s*)?(?:a\s*(?:is\s*)?max|first)/i.test(norm) || /a\s*>\s*b\s*(?:->|=>|then|:)\s*a/i.test(norm);
  const mentionsBIsMax = /(?:b|second|num2)\s*(?:is\s*)?(?:the\s*)?(?:max|maximum|greater|larger|bigger)/i.test(norm) || /(?:max|maximum|larger|greater)\s*(?:is\s*)?(?:b\b|second|num2)/i.test(norm) || /(?:else|otherwise)\s*(?:b\s*(?:is\s*)?(?:the\s*)?max(?:imum)?|b\b|second)/i.test(norm) || /if\s*\(?b\s*>\s*a\)?\s*(?:then\s*)?(?:b\s*(?:is\s*)?max|second)/i.test(norm) || /if\s*\(?a\s*<=\s*b\)?\s*(?:then\s*)?(?:b\s*(?:is\s*)?max|second)/i.test(norm) || /b\s*>\s*a\s*(?:->|=>|then|:)\s*b/i.test(norm) || norm.includes("else b is maximum") || norm.includes("else b is max");
  const hasFullIfElseRule = /if\s+a\s*>\s*b\s+then\s+a\s+is\s+max(?:imum)?\s+else\s+b\s+is\s+max(?:imum)?/i.test(norm) || mentionsAIsMax && mentionsBIsMax;
  if (mentionsBIsMax && !mentionsAIsMax) {
    return {
      isFullyVerified: false,
      hasTwoNumbersConcept: true,
      hasComparisonOperator: mentionsComparison,
      hasGreaterOutcome: false,
      hasLesserOutcome: true,
      feedback: "\u{1F31F} Coach Maara here! You correctly defined that `b` is the Maximum! \u{1F44F} But under what condition is `a` the Maximum? (Hint: when `a > b`!). Define both cases (when `a` is maximum and when `b` is maximum) in your worksheet to complete your logic!",
      correction: "If a > b then a is maximum, else b is maximum.",
      suggestedInput: "If a > b then a is maximum, else b is maximum.",
      matchedFirebaseInput: "if a > b then a is maximum else b is maximum"
    };
  }
  if (mentionsAIsMax && !mentionsBIsMax) {
    return {
      isFullyVerified: false,
      hasTwoNumbersConcept: true,
      hasComparisonOperator: mentionsComparison,
      hasGreaterOutcome: true,
      hasLesserOutcome: false,
      feedback: "\u{1F31F} Coach Maara here! You correctly defined that when `a > b`, `a` is the Maximum! \u{1F44F} But what if that condition is false (or if `b > a`)? Which number is the maximum then? Define both cases (when `a` is maximum and when `b` is maximum) to complete your logic!",
      correction: "If a > b then a is maximum, else b is maximum.",
      suggestedInput: "If a > b then a is maximum, else b is maximum.",
      matchedFirebaseInput: "if a > b then a is maximum else b is maximum"
    };
  }
  if (!isQuestion && (hasMathematicalCheck || mentionsGreaterOperator) && !mentionsAIsMax && !mentionsBIsMax) {
    return {
      isFullyVerified: false,
      hasTwoNumbersConcept: mentionsTwoVariables,
      hasComparisonOperator: true,
      hasGreaterOutcome: false,
      hasLesserOutcome: false,
      feedback: "\u{1F31F} Coach Maara here! You compared the numbers using `>`. Now what are the two outcomes? If `a > b` is true, which number is maximum? And otherwise, which number is maximum? Write: 'If a > b then a is maximum, else b is maximum.'",
      correction: "If a > b then a is maximum, else b is maximum.",
      suggestedInput: "If a > b then a is maximum, else b is maximum.",
      matchedFirebaseInput: "how to find maximum of two numbers"
    };
  }
  if (!isQuestion && hasFullIfElseRule && (mentionsTwoVariables || norm.includes("compare") || hasMathematicalCheck)) {
    const feedback2 = `\u{1F389} **Logic Approved by Coach Maara!** \u{1F3C6}
Spot on! You have clearly defined the logic to find the maximum of two numbers:
If \`a > b\`, then \`a\` is the Maximum; otherwise \`b\` is the Maximum!

Fantastic work! Proceed to Stage 2: Recipe!`;
    return {
      isFullyVerified: true,
      hasTwoNumbersConcept: true,
      hasComparisonOperator: true,
      hasGreaterOutcome: true,
      hasLesserOutcome: true,
      feedback: feedback2,
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "if a > b then a is maximum else b is maximum"
    };
  }
  let feedback = "\u{1F31F} Coach Maara here! How do we compare number `a` and number `b` to find which one is larger? What comparison operator (`>`) do we use?";
  if (attemptCount >= 2) {
    feedback = "\u{1F31F} Coach Maara checking back! Compare number `a` and number `b` using the greater-than operator (`>`). Write: 'If a > b, then a is maximum, else b is maximum.'";
  }
  return {
    isFullyVerified: false,
    hasTwoNumbersConcept: mentionsTwoVariables,
    hasComparisonOperator: mentionsComparison,
    hasGreaterOutcome: Boolean(mentionsAIsMax),
    hasLesserOutcome: Boolean(mentionsBIsMax),
    feedback,
    correction: "If a > b then a is maximum else b is maximum.",
    suggestedInput: "If a > b then a is maximum else b is maximum.",
    matchedFirebaseInput: "how to find maximum of two numbers"
  };
}
function validateMaximumOfTwoRecipe(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|what steps to write)\b/i.test(norm);
  const hasStep1 = !isQuestion && (/(?:step\s*1\s*:?|(?:^|\n|;)\s*1[\.\)]\s*:?).*?(?:get|read|input|take|obtain|accept|receive|two\s*numbers|a\s*(?:and|&|,)\s*b|values)/i.test(norm) || /\b(?:get|input|read|take|obtain|accept|receive)\s+(?:two\s*numbers|a\s*(?:and|&|,)\s*b|numbers?\s*a\s*(?:and|&|,)\s*b|two\s*values|numbers?)\b/i.test(norm) || /\b(?:obtain|get|read|take|input)\s+two\s+numbers\s*(?:\(\s*a\s*,\s*b\s*\)|a\s*(?:and|&|,)\s*b)/i.test(norm) || (norm.includes("step 1") || /^\s*1[\.\)]/m.test(norm)) && (norm.includes("a") || norm.includes("b") || norm.includes("number") || norm.includes("obtain")) || norm.includes("obtain two numbers") || norm.includes("get two numbers") || norm.includes("take two numbers") || norm.includes("read two numbers") || norm.includes("input two numbers"));
  const hasStep2Determination = /\b(?:determine|find|check|decide|identify|know)\s+(?:which|what|the)?\s*(?:number\s*)?(?:is\s*)?(?:larger|greater|bigger|maximum|max)\b/i.test(norm) || /\bwhich\s+is\s+(?:larger|greater|bigger|maximum|max)\b/i.test(norm) || /determine\s+(?:which\s*(?:is\s*)?larger|larger\s*number|maximum)/i.test(norm);
  const mentionsComparisonOrCondition = /\b(?:bigger|greater|larger|more|highest|maximum|max)\b/i.test(norm) || /check\s+.*?(?:bigger|greater|larger|max)/i.test(norm) || /compare/i.test(norm) || /determine/i.test(norm) || norm.includes(">") || norm.includes("<");
  const hasStep2Condition = !isQuestion && (hasStep2Determination || mentionsComparisonOrCondition || /step\s*2\s*:?.*?(?:if|check|need\s*to\s*check|compare|a\s*(?:is\s*)?(?:bigger|greater|larger)|determine)/i.test(norm) || /\b(?:check|if)\s+.*?(?:a\s*(?:is\s*)?(?:bigger|greater|larger)\s*(?:than\s*b)?|a\s*>\s*b)\b/i.test(norm) || /compare\s+(?:a\s*(?:and|&)\s*b|two\s*numbers|them|the\s*numbers)/i.test(norm) || norm.includes("a > b"));
  const mentionsAIsMax = /(?:a|first|num1)\s*(?:is\s*)?(?:the\s*)?(?:max|maximum|greater|larger|bigger)/i.test(norm) || /(?:max|maximum|larger|greater|bigger)\s*(?:is\s*)?(?:a\b|first|num1)/i.test(norm) || /a\s*is\s*maximum/i.test(norm) || /a\s*is\s*max/i.test(norm);
  const mentionsBIsMax = /(?:b|second|num2)\s*(?:is\s*)?(?:the\s*)?(?:max|maximum|greater|larger|bigger)/i.test(norm) || /(?:max|maximum|larger|greater|bigger)\s*(?:is\s*)?(?:b\b|second|num2)/i.test(norm) || /(?:else|otherwise|when\s+.*?(?:not|false)|if\s+not)\s*.*?(?:b\s*(?:is\s*)?(?:max|maximum|greater|larger|bigger)|b\b)/i.test(norm) || /not\s*(?:bigger|greater|larger)\s*.*?(?:b\s*(?:is\s*)?max)/i.test(norm) || /b\s*is\s*maximum/i.test(norm) || /b\s*is\s*max/i.test(norm);
  const hasStep2Outcomes = hasStep2Determination || mentionsAIsMax && mentionsBIsMax || (/(?:display|print|show|announce).*?(?:a\s*(?:is\s*)?(?:max|maximum|greater|larger|bigger)|b\s*(?:is\s*)?(?:max|maximum|greater|larger|bigger))/i.test(norm) || /\ba\s*is\s*(?:maximum|max|greater|bigger)\b/i.test(norm) || /a\s*is\s*maximum/i.test(norm)) && (/\b(?:else|otherwise|when|if\s*not).*?(?:b\s*(?:is\s*)?(?:max|maximum|greater|larger|bigger)|display|print)/i.test(norm) || /\bb\s*is\s*(?:maximum|max|greater|bigger)\b/i.test(norm) || /b\s*is\s*maximum/i.test(norm) || norm.includes("else")) || /(?:print|display|show|output)\s+(?:result|maximum|larger|the\s*result)/i.test(norm);
  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Obtain two numbers (a, b)",
      completed: Boolean(hasStep1),
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Step 2: Determine which is larger (a or b)",
      completed: Boolean(hasStep1 && hasStep2Condition && hasStep2Outcomes),
      current: Boolean(hasStep1 && (!hasStep2Condition || !hasStep2Outcomes))
    }
  ];
  if (isQuestion && !hasStep1) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Let's think step by step like a chef writing a recipe:\n\u2022 Step 1: Obtain two numbers `a` and `b`.\n\u2022 Step 2: Determine which is larger (a or b) \u2014 if `a > b`, display `a is Maximum`, else display `b is Maximum`.\n\nStart by writing Step 1 in your worksheet!",
      correction: "Step 1: Obtain two numbers (a, b).",
      suggestedInput: "Step 1: Obtain two numbers (a, b).",
      matchedFirebaseInput: "what steps to write"
    };
  }
  if (hasStep1 && hasStep2Condition && hasStep2Outcomes) {
    const feedback = `\u{1F389} **Kudos! Recipe Approved by Coach Maara!** \u{1F3C6}
You have sequenced the step-by-step algorithm perfectly:
\u2022 Step 1: Obtain two numbers (a, b)
\u2022 Step 2: Determine which is larger (a or b)

Outstanding work! Proceed to Stage 3: Ingredients to gather the programming tools!`;
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback,
      correction: "Proceed to Stage 3: Ingredients to identify variables and operators.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If a is greater than b, display a is Maximum, else display b is Maximum"
    };
  }
  if (!hasStep1) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! What is the very first step in our algorithm? We need to get the two numbers to compare. Write: `Step 1: Obtain two numbers (a, b)`.",
      correction: "Step 1: Obtain two numbers (a, b).",
      suggestedInput: "Step 1: Obtain two numbers (a, b).",
      matchedFirebaseInput: "what steps to write"
    };
  }
  if (hasStep1 && !hasStep2Condition) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Great start with Step 1! \u{1F44F} Now for Step 2: How do you determine which number is larger? (e.g. Determine which is larger (a or b) / If a is greater than b, display a is Maximum, else display b is Maximum).",
      correction: "Step 2: Determine which is larger (a or b).",
      suggestedInput: "Step 2: Determine which is larger (a or b).",
      matchedFirebaseInput: "step 1 : Get two numbers a and b"
    };
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Almost done with recipe! For Step 2: What message do you display if `a > b` is true, and what message if it is false?",
    correction: "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.",
    suggestedInput: "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.",
    matchedFirebaseInput: "step 1 : Get two numbers a and b"
  };
}
function validateMaximumOfTwoIngredients(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|what ingredients)\b/i.test(norm);
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
  const hasVariablesAB = !isQuestion && (Boolean(step1Text && (/\ba\b/i.test(step1Text) || /\bnum/i.test(step1Text) || /\bvar/i.test(step1Text))) || /step\s*1\s*:?.*?(?:a\s*(?:and|&)\s*b|variables?\s*a|var\s*a|a\s*,\s*b|a\s*and\s*b)/i.test(norm) || /\b(?:variables?\s*a\s*(?:and|&)\s*b|a\s*and\s*b\s*for\s*input\s*variables|input\s*variables\s*a\s*and\s*b)\b/i.test(norm) || norm.includes("input variables") && /\ba\b/i.test(norm) && /\bb\b/i.test(norm));
  const step2Target = step2Text || norm;
  const hasIfInStep2 = step2Text ? /\bif\b/i.test(step2Text) : /\bif\b/i.test(norm);
  const hasElseInStep2 = step2Text ? /\belse\b/i.test(step2Text) && !hasIfInStep2 : /\belse\b/i.test(norm) && !hasIfInStep2;
  const hasElseWithCondition = hasElseInStep2 && /left\s*side|\bl\.?s\.?\b|operator|\bop\b|right\s*side|\br\.?s\.?\b|>|<|>=|<=/i.test(step2Target);
  const lsMatch = step2Target.match(/(?:left\s*side|\bl\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongLeftSideDetected = null;
  if (lsMatch && lsMatch[1]) {
    const rawLS = lsMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/\ba\b/i.test(rawLS) && !/\bnum1\b/i.test(rawLS) && !/\bfirst\b/i.test(rawLS) && !/\bx\b/i.test(rawLS)) {
      wrongLeftSideDetected = rawLS || "(empty)";
    }
  }
  const explicitOperatorMatch = step2Target.match(/(?:operator|\bop\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i) || step2Target.match(/(?:step\s*2|condition|if)\s*\(?[ab]\s*([><!=]=?)\s*[ab]/i) || step2Target.match(/[ab]\s*([><!=]=?)\s*[ab]/i);
  let wrongOperatorDetected = null;
  if (explicitOperatorMatch && explicitOperatorMatch[1]) {
    const rawOp = explicitOperatorMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (rawOp !== ">" && rawOp !== ">=" && !rawOp.includes(">")) {
      wrongOperatorDetected = rawOp || "(empty)";
    }
  }
  const rsExplicitMatch = step2Target.match(/(?:right\s*side|\br\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongRightSideDetected = null;
  if (rsExplicitMatch && rsExplicitMatch[1]) {
    const rawRS = rsExplicitMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/\bb\b/i.test(rawRS) && !/\bnum2\b/i.test(rawRS) && !/\bsecond\b/i.test(rawRS) && !/\by\b/i.test(rawRS)) {
      wrongRightSideDetected = rawRS || "(empty)";
    }
  }
  const mentionsGreaterOperator = step2Target.includes(">") || step2Target.includes("greater") || norm.includes(">");
  const hasValidIfCondition = hasVariablesAB && !hasElseWithCondition && !wrongLeftSideDetected && !wrongOperatorDetected && !wrongRightSideDetected && mentionsGreaterOperator && (norm.includes("a > b") || norm.includes("num1 > num2") || step2Target.includes("l s") && step2Target.includes("r s") && step2Target.includes("operator") || step2Target.includes("left side") && step2Target.includes("right side") || step2Target.includes("left side") && step2Target.includes("operator") || step2Target.includes("l.s") && step2Target.includes("operator") || /\bif\b/i.test(step2Target) && mentionsGreaterOperator);
  const step3Target = step3Text || (norm.match(/step\s*3\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step5Target = step5Text || (norm.match(/step\s*5\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const hasInvertedElseInStep3 = /\belse\b/i.test(step3Target) && !/\bif\b/i.test(step3Target.replace(/inside\s+else/i, "")) || /inside\s+else\s*:\s*print\s*\(?.*?(?:a\b|a\s*is\s*(?:bigger|max))/i.test(norm) || /step\s*3\s*[:\-\s]*inside\s+else/i.test(norm);
  const hasInvertedIfInStep5 = /\bif\b/i.test(step5Target) && !/\belse\b/i.test(step5Target.replace(/inside\s+if/i, "")) || /inside\s+if\s*:\s*print\s*\(?.*?(?:b\b|b\s*is\s*(?:bigger|max))/i.test(norm) || /step\s*5\s*[:\-\s]*inside\s+if/i.test(norm);
  const hasPrintA = !hasInvertedElseInStep3 && (/inside\s+if\s*[:\-\s]*print\s*\(\s*["']?a(?:\s*is\s*(?:max|maximum|bigger))?["']?\s*\)/i.test(norm) || /step\s*3\s*:?.*?(?:inside\s+if|if\s*block).*?print.*?(?:a\b|a\s*is\s*(?:max|maximum|bigger))/i.test(norm) || /print\s*\(\s*["']?a(?:\s*is\s*(?:max|maximum|bigger))?["']?\s*\)/i.test(norm) || /display\s*["']?a/i.test(norm) || Boolean(step3Text) && !/\belse\b/i.test(step3Text) && (/print/i.test(step3Text) || /display/i.test(step3Text)) && (/\ba\b/i.test(step3Text) || /max/i.test(step3Text) || /bigger/i.test(step3Text)));
  const normExcludingStep3 = norm.replace(/step\s*3[\s\S]*?(?=step\s*4|step\s*5|$)/i, "");
  const hasStep4Else = /step\s*4\s*[:\-\s]*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || /4\s*[\.\)]\s*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || Boolean(step4Text) && /\belse\b/i.test(step4Text) || /fallback\s*else\s*block/i.test(normExcludingStep3) || /if\s*[-/]\s*else/i.test(normExcludingStep3) || /\belse\b/i.test(normExcludingStep3) && !hasElseInStep2;
  const hasElseBranch = !hasElseWithCondition && hasValidIfCondition && hasPrintA && !hasInvertedElseInStep3 && hasStep4Else;
  const step5HasA = /\b(?:print|display)\s*\(?\s*["']?a\b/i.test(step5Target) || /\ba\s*is\s*(?:max|maximum|bigger|larger)\b/i.test(step5Target);
  const step5HasB = /\b(?:print|display)\s*\(?\s*["']?b\b/i.test(step5Target) || /\bb\s*is\s*(?:max|maximum|bigger|larger)\b/i.test(step5Target) || /\bb\b/i.test(step5Target);
  const hasRepeatedAInStep5 = Boolean(step5Target && step5HasA && !step5HasB);
  const hasPrintB = !hasInvertedIfInStep5 && !hasRepeatedAInStep5 && (/inside\s+else\s*[:\-\s]*print\s*\(\s*["']?b(?:\s*is\s*(?:max|maximum|bigger))?["']?\s*\)/i.test(norm) || /step\s*5\s*:?.*?(?:inside\s+else|else\s*block).*?print.*?(?:b\b|b\s*is\s*(?:max|maximum|bigger))/i.test(norm) || /print\s*\(\s*["']?b(?:\s*is\s*(?:max|maximum|bigger))?["']?\s*\)/i.test(norm) || /display\s*["']?b/i.test(norm) || Boolean(step5Text) && !/\bif\b/i.test(step5Text) && (/print/i.test(step5Text) || /display/i.test(step5Text)) && /\bb\b/i.test(step5Text));
  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: a and b for input variables",
      completed: Boolean(hasVariablesAB),
      current: !hasVariablesAB
    },
    {
      stepNumber: 2,
      title: "Step 2: If condition with L.S: a, R.S: b, Operator: >",
      completed: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition),
      current: Boolean(hasVariablesAB && (!hasValidIfCondition || hasElseWithCondition))
    },
    {
      stepNumber: 3,
      title: "Step 3: Inside if block: print('a is max')",
      completed: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasInvertedElseInStep3),
      current: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && (!hasPrintA || hasInvertedElseInStep3))
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block",
      completed: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasInvertedElseInStep3 && hasElseBranch),
      current: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasInvertedElseInStep3 && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: "Step 5: Inside else block: print('b is max')",
      completed: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasInvertedElseInStep3 && hasElseBranch && hasPrintB && !hasInvertedIfInStep5 && !hasRepeatedAInStep5),
      current: Boolean(hasVariablesAB && hasValidIfCondition && !hasElseWithCondition && hasPrintA && !hasInvertedElseInStep3 && hasElseBranch && (!hasPrintB || hasInvertedIfInStep5 || hasRepeatedAInStep5))
    }
  ];
  if (hasRepeatedAInStep5) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Variables (a and b)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** \`If condition (a > b)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 3:** \`inside if : print a is bigger\` \u2794 \u2705 Defined correctly!
\u2022 **Step 4:** \`else block\` \u2794 \u2705 Defined correctly!
\u2022 **Step 5:** You wrote \`print a is bigger\` again \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' blocks:**
\u2022 In Step 3, you already printed that **a is bigger** when \`a > b\` is true.
\u2022 In Step 5 (inside \`else\`), the condition \`a > b\` is **false**, which means **b is the larger number**! So you must print that **b is bigger** (or **b is max**), NOT \`a\` again.

\u{1F3AF} **Fix:** Change Step 5 to print b:
\`step 5 : Inside else block: print("b is max")\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: 'step 5 : Inside else block: print("b is max")',
      suggestedInput: 'step 5 : Inside else block: print("b is max")',
      matchedFirebaseInput: 'step 5 : Inside else block: print("b is max")'
    };
  }
  if (hasInvertedElseInStep3) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Variables (a and b)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** \`If condition (a > b)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 3:** You wrote \`inside else : print a is bigger\` \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' blocks:**
\u2022 When the condition \`a > b\` is **true**, the \`if\` block executes! So printing \`a is max\` (or \`a is bigger\`) belongs **inside the 'if' block**, NOT inside \`else\`.
\u2022 The \`else\` block only runs when the condition is **false** (when b is maximum).

\u{1F3AF} **Fix:** Change Step 3 to inside if block:
\`step 3 : Inside if block: print("a is max")\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: 'step 3 : Inside if block: print("a is max")',
      suggestedInput: 'step 3 : Inside if block: print("a is max")',
      matchedFirebaseInput: 'step 3 : Inside if block: print("a is max")'
    };
  }
  if (hasInvertedIfInStep5) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 5:** You wrote \`inside if : print b is max\` \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' blocks:**
\u2022 Printing \`b is max\` (or \`b is bigger\`) happens only when \`a > b\` is false in the fallback \`else\` block!

\u{1F3AF} **Fix:** Change Step 5 to inside else block:
\`step 5 : Inside else block: print("b is max")\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: 'step 5 : Inside else block: print("b is max")',
      suggestedInput: 'step 5 : Inside else block: print("b is max")',
      matchedFirebaseInput: 'step 5 : Inside else block: print("b is max")'
    };
  }
  if (hasElseWithCondition) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Variables (a and b)\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** You wrote \`else\` with comparison components (Left Side: \`a\`, Operator: \`>\`, Right Side: \`b\`) \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else':**
\u2022 Use \`if\` when evaluating a condition: \`if (a > b)\`.
\u2022 Use \`else\` as a blanket fallback without condition.

\u{1F3AF} **Fix:** Replace \`else\` with \`if\` in Step 2: \`step 2 : If condition with L.S: a, R.S: b, Operator: >\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      suggestedInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      matchedFirebaseInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >"
    };
  }
  if (wrongLeftSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Left Side: Look at your Left Side (L.S)! You wrote \`${wrongLeftSideDetected}\`. In the condition \`a > b\`, the Left Side is the first variable \`a\` (\`L.S: a\` or \`Left side: a\`).`,
      correction: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      suggestedInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (wrongOperatorDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara operator check: You wrote \`operator: ${wrongOperatorDetected}\`. To test if \`a\` is strictly greater than \`b\`, use the greater-than operator \`>\` (\`operator: >\`).`,
      correction: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      suggestedInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (wrongRightSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maara checking Step 2 Right Side: Look at your Right Side (R.S)! You wrote \`${wrongRightSideDetected}\`. In the condition \`a > b\`, the Right Side is the second variable \`b\` (\`R.S: b\` or \`Right side: b\`).`,
      correction: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      suggestedInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const isFullyVerified = hasVariablesAB && hasValidIfCondition && hasPrintA && hasElseBranch && hasPrintB;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Ingredients Operation Trace with Example Numbers (a = 25, b = 10):**
\u2022 **Input Variables:** \`a = 25\`, \`b = 10\`
\u2022 **Condition Operands:** Left Side: \`a\` (25), Operator: \`>\`, Right Side: \`b\` (10)
\u2022 **Condition Evaluation:** \`25 > 10\` evaluates to **true**
\u2022 **True Action:** \`print("a is max")\` (or \`print(a)\`)
\u2022 **Fallback Else Action:** \`print("b is max")\` (or \`print(b)\`)

\u{1F389} **Hurray! if (a > b) prints a, else prints b.** \u{1F3C6} Outstanding ingredients gathered! Proceed to Stage 4: Taste the Sample!`;
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback,
      correction: "Proceed to Stage 4: Taste the Sample to assemble your prototype code.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >"
    };
  }
  if (!hasVariablesAB) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! What ingredients do we need? Start with Step 1: Input variables `a` and `b`.",
      correction: "step 1 : a and b for input variables",
      suggestedInput: "step 1 : a and b for input variables",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariablesAB && !hasValidIfCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Spot on! You have variables `a` and `b`. \u{1F44F} Now for Step 2: How do you write the if condition using Left Side (`a`), Right Side (`b`), and Operator (`>`)?",
      correction: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      suggestedInput: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
      matchedFirebaseInput: "step 1 : a and b for input variables"
    };
  }
  if (hasVariablesAB && hasValidIfCondition && !hasPrintA) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maara here! Great condition `a > b`! Now for Step 3: Inside the if block, write the winning print statement: `step 3 : Inside if block: print("a is max")`.',
      correction: 'step 3 : Inside if block: print("a is max")',
      suggestedInput: 'step 3 : Inside if block: print("a is max")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasVariablesAB && hasValidIfCondition && hasPrintA && !hasElseBranch) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Steps 1, 2, and 3 are ready! \u{1F44F} Now add the fallback `else` construct: `step 4 : else block`.",
      correction: "step 4 : else block",
      suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("b is max")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: '\u{1F31F} Coach Maara here! Almost done with ingredients! Add Step 5 inside the else block: `step 5 : Inside else block: print("b is max")`.',
    correction: 'step 5 : Inside else block: print("b is max")',
    suggestedInput: 'step 5 : Inside else block: print("b is max")',
    matchedFirebaseInput: "what ingredients do we need"
  };
}
function validateMaximumOfTwoSampleCode(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|stuck|different|another hint)\b/i.test(norm) || norm.includes("// student question");
  const testCases = [
    {
      testCaseTitle: "Test Case 1: First number is greater (a = 25, b = 10)",
      inputA: 25,
      inputB: 10,
      operationFormula: "25 > 10",
      conditionCheck: "25 > 10",
      conditionEvaluated: true,
      executedBranch: "if",
      outputMessage: "a is max",
      expectedOutput: "a is max",
      passed: true,
      explanation: "25 is strictly greater than 10, so the if block executes and prints 'a is max'."
    },
    {
      testCaseTitle: "Test Case 2: Second number is greater (a = 15, b = 40)",
      inputA: 15,
      inputB: 40,
      operationFormula: "15 > 40",
      conditionCheck: "15 > 40",
      conditionEvaluated: false,
      executedBranch: "else",
      outputMessage: "b is max",
      expectedOutput: "b is max",
      passed: true,
      explanation: "15 > 40 is false, so the fallback else block executes and prints 'b is max'."
    }
  ];
  if (isQuestion) {
    if (/how to write sample code|approach|where to start|how do i start|begin/i.test(norm)) {
      return {
        isFullyVerified: false,
        allVerified: false,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)", completed: false, current: true },
          { stepNumber: 2, title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)", completed: false, current: false },
          { stepNumber: 3, title: 'Step 3: Print a is max inside if block (e.g. print("a is max");)', completed: false, current: false },
          { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
          { stepNumber: 5, title: 'Step 5: Print b is max inside else block (e.g. print("b is max"); })', completed: false, current: false }
        ],
        operationTestCases: testCases,
        feedback: '\u{1F31F} Coach Maara here! To assemble the working prototype code for Maximum of Two Numbers, follow these 5 clear steps:\n\n1\uFE0F\u20E3 **Variables:** Declare test values: `var a = 20, b = 40;`\n2\uFE0F\u20E3 **Condition:** Check which is larger: `if (a > b) {`\n3\uFE0F\u20E3 **True Branch:** Inside if, display result: `print("a is max");`\n4\uFE0F\u20E3 **Fallback:** Catch the other outcome: `} else {`\n5\uFE0F\u20E3 **False Branch:** Inside else, display result: `print("b is max"); }`\n\nLet\'s start by declaring your test variables in the editor!',
        correction: "var a = 20, b = 40;",
        suggestedInput: 'var a = 20, b = 40;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}'
      };
    }
    if (/declare|variable|var a|initialize/i.test(norm)) {
      return {
        isFullyVerified: false,
        allVerified: false,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)", completed: false, current: true },
          { stepNumber: 2, title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)", completed: false, current: false },
          { stepNumber: 3, title: 'Step 3: Print a is max inside if block (e.g. print("a is max");)', completed: false, current: false },
          { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
          { stepNumber: 5, title: 'Step 5: Print b is max inside else block (e.g. print("b is max"); })', completed: false, current: false }
        ],
        operationTestCases: testCases,
        feedback: "\u{1F31F} Coach Maara here! To test our algorithm, we initialize two sample numbers into variables:\n```javascript\nvar a = 10, b = 25;\n```\nOr in Python style:\n```python\na = 20\nb = 40\n```\nThis gives concrete numbers for our conditional logic to test against!",
        correction: "var a = 10, b = 25;",
        suggestedInput: "var a = 10, b = 25;"
      };
    }
    if (/test\s*case|how to test|test both|test cases/i.test(norm)) {
      return {
        isFullyVerified: false,
        allVerified: false,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)", completed: true, current: false },
          { stepNumber: 2, title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)", completed: true, current: false },
          { stepNumber: 3, title: 'Step 3: Print a is max inside if block (e.g. print("a is max");)', completed: true, current: false },
          { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: true, current: false },
          { stepNumber: 5, title: 'Step 5: Print b is max inside else block (e.g. print("b is max"); })', completed: true, current: false }
        ],
        operationTestCases: testCases,
        feedback: '\u{1F31F} Coach Maara here! We test both branches with two sample runs:\n\u2022 **Test Case 1 (a = 25, b = 10):** `25 > 10` is true \u2794 Runs `if` branch \u2794 Output: **"a is max"** \u2705\n\u2022 **Test Case 2 (a = 15, b = 40):** `15 > 40` is false \u2794 Runs `else` branch \u2794 Output: **"b is max"** \u2705\nWhen you assemble both branches in your code, both tests pass automatically!',
        correction: 'var a = 25, b = 10;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}',
        suggestedInput: 'var a = 25, b = 10;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}'
      };
    }
    if (/if\s*\(?a\s*>\s*b|print\s*\(?["']?a\s*is\s*max|else\s*print/i.test(norm)) {
      return {
        isFullyVerified: false,
        allVerified: false,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)", completed: true, current: false },
          { stepNumber: 2, title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)", completed: true, current: false },
          { stepNumber: 3, title: 'Step 3: Print a is max inside if block (e.g. print("a is max");)', completed: true, current: false },
          { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: true },
          { stepNumber: 5, title: 'Step 5: Print b is max inside else block (e.g. print("b is max"); })', completed: false, current: false }
        ],
        operationTestCases: testCases,
        feedback: '\u{1F31F} Coach Maara here! The conditional structure works in two branches:\n\u2022 `if (a > b)` tests if `a` is strictly greater. When true, it prints `"a is max"`.\n\u2022 `else` is the automatic fallback when `a > b` is false (meaning `b` is larger), printing `"b is max"`!\nNotice `else` does not need any condition.',
        correction: '} else {\n  print("b is max");\n}',
        suggestedInput: 'if (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}'
      };
    }
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)", completed: false, current: true },
        { stepNumber: 2, title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)", completed: false, current: false },
        { stepNumber: 3, title: 'Step 3: Print a is max inside if block (e.g. print("a is max");)', completed: false, current: false },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
        { stepNumber: 5, title: 'Step 5: Print b is max inside else block (e.g. print("b is max"); })', completed: false, current: false }
      ],
      operationTestCases: testCases,
      feedback: '\u{1F31F} Coach Maara here! In Taste the Sample, we turn our recipe into runnable code:\n1. Declare sample variables: `var a = 10, b = 25;`\n2. Write comparison: `if (a > b) { print("a is max"); }`\n3. Add fallback: `else { print("b is max"); }`\nTry writing out the first line in the editor!',
      correction: "var a = 10, b = 25;",
      suggestedInput: 'var a = 10, b = 25;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}'
    };
  }
  const hasVarDeclaration = /(?:var|let|const|int)\s+[ab]\s*=\s*\d+/i.test(input) || /(?:var|let|const|int)\s+a\s*=\s*\d+\s*,\s*b\s*=\s*\d+/i.test(input) || /\ba\s*=\s*\d+/i.test(input) && /\bb\s*=\s*\d+/i.test(input) || (/\ba\s*=\s*\d+/i.test(input) || /\bb\s*=\s*\d+/i.test(input));
  const hasCondition = /if\s*\(\s*a\s*>\s*b\s*\)/i.test(input) || /if\s*\(\s*a\s*>=\s*b\s*\)/i.test(input) || /if\s+a\s*>\s*b/i.test(input) || /if\s*\(\s*a\s*>\s*b/i.test(input);
  const hasElseWithCondition = /\belse\s*\([^\)]+\)/i.test(input) || /\belse\s+if\b/i.test(input);
  const hasQuotedPrintA = /print\s*\(\s*["'][^"']*\ba\b[^"']*["']\s*\)/i.test(input) || /console\.log\s*\(\s*["'][^"']*\ba\b[^"']*["']\s*\)/i.test(input);
  const hasElse = /\belse\b/i.test(input) && !hasElseWithCondition;
  const hasQuotedPrintB = /print\s*\(\s*["'][^"']*\bb\b[^"']*["']\s*\)/i.test(input) || /console\.log\s*\(\s*["'][^"']*\bb\b[^"']*["']\s*\)/i.test(input);
  const hasUnquotedPrintA = !hasQuotedPrintA && (/print\s*\(\s*a\s+(?:is\s+)?(?:big|bigger|max|maximum|large|greater)/i.test(input) || /print\s*\(\s*a\s+(?:is\s+)?[a-z]+/i.test(input) || /print\s*\(\s*a\s*\)/i.test(input) || /console\.log\s*\(\s*a\s*\)/i.test(input));
  const hasUnquotedPrintB = !hasQuotedPrintB && (/print\s*\(\s*b\s+(?:is\s+)?(?:big|bigger|max|maximum|large|greater)/i.test(input) || /print\s*\(\s*b\s+(?:is\s+)?[a-z]+/i.test(input) || /print\s*\(\s*b\s*\)/i.test(input) || /console\.log\s*\(\s*b\s*\)/i.test(input));
  const hasPrintA = hasQuotedPrintA;
  const hasPrintB = hasQuotedPrintB;
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)",
      completed: Boolean(hasVarDeclaration),
      current: !hasVarDeclaration
    },
    {
      stepNumber: 2,
      title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)",
      completed: Boolean(hasVarDeclaration && hasCondition),
      current: Boolean(hasVarDeclaration && !hasCondition)
    },
    {
      stepNumber: 3,
      title: 'Step 3: Print "a is max" with quotes inside if block',
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintA),
      current: Boolean(hasVarDeclaration && hasCondition && !hasQuotedPrintA)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block (e.g. } else {)",
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintA && hasElse),
      current: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintA && !hasElse)
    },
    {
      stepNumber: 5,
      title: 'Step 5: Print "b is max" with quotes inside else block',
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintA && hasElse && hasQuotedPrintB),
      current: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintA && hasElse && !hasQuotedPrintB)
    }
  ];
  const allVerified = hasVarDeclaration && hasCondition && hasQuotedPrintA && hasElse && hasQuotedPrintB && !hasElseWithCondition;
  if (allVerified) {
    const feedback = `\u{1F389} **You gotcha! Perfect comparison logic.** \u{1F3C6} You have mastered Maximum of Two Numbers across all 4 stages of CTC!`;
    return {
      isFullyVerified: true,
      allVerified: true,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: 'var a = 10, b = 25; if (a > b) print("a is max"); else print("b is max");'
    };
  }
  if (hasVarDeclaration && hasCondition && (hasUnquotedPrintA || hasUnquotedPrintB)) {
    const isBothUnquoted = hasUnquotedPrintA && hasUnquotedPrintB;
    const feedback = isBothUnquoted ? '\u{1F31F} Coach Maara syntax alert: You wrote `print(a is big)` and `print(b is big)` without quotes! In programming (Python, JavaScript, etc.), text messages MUST be enclosed in quotation marks, like `print("a is big");` and `print("b is big");`. Without quotes, the computer causes a syntax error. Add quotes around your print text to verify your code!' : hasUnquotedPrintA ? '\u{1F31F} Coach Maara syntax alert: Quotes are missing in your if print statement! In programming, text must be wrapped in quotation marks: `print("a is big");` or `print("a is max");`.' : '\u{1F31F} Coach Maara syntax alert: Quotes are missing in your else print statement! In programming, text must be wrapped in quotation marks: `print("b is big");` or `print("b is max");`.';
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        {
          stepNumber: 1,
          title: "Step 1: Declare sample variables (e.g. var a = 20, b = 40;)",
          completed: Boolean(hasVarDeclaration),
          current: false
        },
        {
          stepNumber: 2,
          title: "Step 2: If condition comparing a > b (e.g. if (a > b) {)",
          completed: Boolean(hasVarDeclaration && hasCondition),
          current: false
        },
        {
          stepNumber: 3,
          title: 'Step 3: Print "a is max" with quotes inside if block',
          completed: Boolean(hasQuotedPrintA),
          current: !hasQuotedPrintA
        },
        {
          stepNumber: 4,
          title: "Step 4: Fallback else block (e.g. } else {)",
          completed: Boolean(hasElse),
          current: false
        },
        {
          stepNumber: 5,
          title: 'Step 5: Print "b is max" with quotes inside else block',
          completed: Boolean(hasQuotedPrintB),
          current: !hasQuotedPrintB && Boolean(hasQuotedPrintA)
        }
      ],
      operationTestCases: testCases,
      feedback,
      correction: isBothUnquoted ? 'print("a is big");\nprint("b is big");' : hasUnquotedPrintA ? 'print("a is big");' : 'print("b is big");',
      suggestedInput: 'a = 20\nb = 40\nif (a > b) {\n  print("a is big");\n} else {\n  print("b is big");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasElseWithCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara syntax alert: You attached a condition to `else`! In JavaScript/Python, `else` is an automatic fallback that takes no condition. Just write `} else {`.",
      correction: "} else {",
      suggestedInput: 'var a = 10, b = 25;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (!hasVarDeclaration) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara here! Let's build our code line by line. Start with Step 1 by declaring your test variables: `var a = 20, b = 40;`.",
      correction: "var a = 20, b = 40;",
      suggestedInput: 'var a = 20, b = 40;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasVarDeclaration && !hasCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maara here! Variables declared! \u{1F44F} Now add Step 2: Write the if condition comparing `a > b`: `if (a > b) {`.",
      correction: "if (a > b) {",
      suggestedInput: 'if (a > b) {\n  print("a is max");\n}',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasVarDeclaration && hasCondition && !hasPrintA) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: '\u{1F31F} Coach Maara here! Step 1 and 2 look great! \u{1F44F} Add Step 3 inside the if block: `print("a is max");`.',
      correction: 'print("a is max");',
      suggestedInput: 'print("a is max");',
      matchedFirebaseInput: "how to write sample code"
    };
  }
  return {
    isFullyVerified: false,
    allVerified: false,
    sampleCodeStepProgress,
    operationTestCases: testCases,
    feedback: `\u{1F31F} Coach Maara here! You've declared your variables and written the if comparison\u2014fantastic progress! \u{1F44F}

Now complete the prototype with the fallback **else block** (Steps 4 & 5) so the program knows what to show when **b** is larger:
\`\`\`javascript
} else {
  print("b is max");
}
\`\`\``,
    correction: '} else {\n  print("b is max");\n}',
    suggestedInput: '} else {\n  print("b is max");\n}',
    matchedFirebaseInput: "how to write sample code"
  };
}
export {
  validateMaximumOfTwoIngredients,
  validateMaximumOfTwoLogic,
  validateMaximumOfTwoRecipe,
  validateMaximumOfTwoSampleCode
};
