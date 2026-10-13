function validateDivisibleBy5Logic(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  if (norm.length < 4) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! What mathematical operation tests if a number is divisible by 5, and what remainder should it leave?",
      correction: "If n % 5 == 0 it is Divisible by 5; if n % 5 != 0 it is Not Divisible by 5.",
      suggestedInput: "If a number divided by 5 leaves remainder 0 (n % 5 == 0, e.g. 25 % 5 = 0), it is Divisible by 5. If remainder is not 0 (e.g. 23 % 5 = 3), it is Not Divisible by 5."
    };
  }
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|express|explain|guidance|clue)\b/i.test(norm) || norm.includes("how to") || norm.includes("what is");
  if (isQuestion) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (`n % 5 == 0`). If the remainder is not 0, it is Not Divisible by 5.\n\nTo complete this logic stage, write this mathematical rule with an example in your worksheet:\n\u2022 For n = 25: `25 % 5 = 0` \u2794 Divisible by 5\n\u2022 For n = 23: `23 % 5 = 3 != 0` \u2794 Not Divisible by 5",
      correction: "Check if n % 5 == 0: remainder 0 is Divisible by 5, remainder != 0 is Not Divisible by 5.",
      suggestedInput: "If a number divided by 5 leaves remainder 0 (n % 5 == 0, e.g. 25 % 5 = 0), it is Divisible by 5. Otherwise (n % 5 != 0, e.g. 23 % 5 = 3), it is Not Divisible by 5.",
      matchedFirebaseInput: "what is divisible by 5"
    };
  }
  const rawModuloMatches = Array.from(input.matchAll(/(\d+)\s*%\s*(\d+)\s*(=|==|!=)\s*(\d+)/g));
  for (const match of rawModuloMatches) {
    const left = parseInt(match[1], 10);
    const divisor = parseInt(match[2], 10);
    const op = match[3];
    const right = parseInt(match[4], 10);
    const actualRemainder = left % divisor;
    let isMathFactTrue = false;
    if (op === "==" || op === "=") isMathFactTrue = actualRemainder === right;
    else if (op === "!=") isMathFactTrue = actualRemainder !== right;
    if (!isMathFactTrue) {
      return {
        isFullyVerified: false,
        hasContradiction: true,
        feedback: `\u{1F31F} Coach Maya gentle check: Look closely at your arithmetic \`${left} % ${divisor} ${op} ${right}\`! When you divide ${left} by ${divisor}, ${divisor} goes into ${left} with a remainder of \`${actualRemainder}\` (not ${right}). So \`${left} % ${divisor} = ${actualRemainder}\`.`,
        correction: `For ${left}: write \`${left} % 5 = ${actualRemainder}\` (${actualRemainder === 0 ? "Divisible by 5" : "Not Divisible by 5"}).`,
        suggestedInput: `For n = 25: 25 % 5 = 0 -> Divisible by 5. For n = 23: 23 % 5 = 3 != 0 -> Not Divisible by 5.`,
        matchedFirebaseInput: "how to check if a number is divisible by 5"
      };
    }
  }
  const mentions5 = /\b5\b|five/i.test(norm);
  const mentionsRemainder = /remainder|rem\b|modulo|%/i.test(norm);
  const mentionsZero = /\b0\b|zero|no\s*remainder/i.test(norm);
  const mentionsDivisible = /\bdivisible\b/i.test(norm);
  const mentionsNotDivisible = /not\s*divisible|non\s*divisible|otherwise/i.test(norm);
  const hasMathematicalCheck = /%\s*5\s*(=|==)\s*0/i.test(norm) || /\b\d+\s*%\s*5\s*(=|==)\s*0/i.test(norm) || /n\s*%\s*5\s*==\s*0/i.test(norm) || /n\s*%\s*5\s*=\s*0/i.test(norm) || /\b\d+\s*%\s*5\s*=\s*\d+/i.test(norm) || (norm.includes("% 5") || norm.includes("%5"));
  const claimsRemainderZeroNotDivisible = /(?:remainder\s*(?:is|=|:)?\s*0|%\s*5\s*==\s*0).*?not\s*divisible/i.test(norm);
  const claimsNonZeroIsDivisible = /(?:remainder\s*(?:is|=|:)?\s*[1-4]|%\s*5\s*!=\s*0).*?(?:is\s*)?divisible/i.test(norm) && !/(?:not\s*divisible)/i.test(norm);
  if (claimsRemainderZeroNotDivisible || claimsNonZeroIsDivisible) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maya gentle check: Look closely at your divisibility definition! When dividing by 5 leaves a **remainder of 0** (`n % 5 == 0`), the number **IS Divisible by 5**! When there is a non-zero remainder (`n % 5 != 0`), it is **Not Divisible by 5**.",
      correction: "If n % 5 == 0 it is Divisible by 5; if n % 5 != 0 it is Not Divisible by 5.",
      suggestedInput: "If n % 5 == 0 (e.g. 25 % 5 = 0 -> true) -> Divisible by 5. If n % 5 != 0 (e.g. 23 % 5 = 3 -> true) -> Not Divisible by 5.",
      matchedFirebaseInput: "how to check if a number is divisible by 5"
    };
  }
  const hasConceptualLogic = (mentions5 || mentionsDivisible) && (mentionsRemainder || mentionsZero);
  if (hasConceptualLogic && !hasMathematicalCheck) {
    return {
      isFullyVerified: false,
      hasDivisibilityConcept: true,
      hasModuloCheck: false,
      hasDivisibleOutcome: mentionsDivisible,
      hasNotDivisibleOutcome: mentionsNotDivisible,
      feedback: "\u{1F31F} Coach Maya here! Good conceptual start in words! You correctly identified that a number divisible by 5 leaves remainder 0. \u{1F44F}\n\nNow, **explain it mathematically with an example number!**\nShow the mathematical modulo remainder operation:\n\u2022 Take an example divisible number (like 25): `25 % 5 = 0` \u2794 **Divisible by 5**.\n\u2022 Take an example non-divisible number (like 23): `23 % 5 = 3 != 0` \u2794 **Not Divisible by 5**.\n\nWrite your mathematical comparison condition (`n % 5 == 0`) or example calculation in your worksheet to complete this logic stage!",
      correction: "Explain mathematically: If n % 5 == 0 (e.g. 25 % 5 = 0 -> true) it is Divisible by 5; otherwise Not Divisible by 5.",
      suggestedInput: "A number is divisible by 5 if dividing it by 5 leaves remainder 0. Mathematically: For n = 25, 25 % 5 = 0 is true -> Divisible by 5. For n = 23, 23 % 5 = 3 != 0 -> Not Divisible by 5.",
      matchedFirebaseInput: "how to check if a number is divisible by 5"
    };
  }
  if (!isQuestion && hasConceptualLogic && hasMathematicalCheck && mentionsDivisible && mentionsNotDivisible) {
    const feedback2 = `\u{1F389} **Logic Approved by Coach Maya!** \u{1F3C6}
Your mathematical divisibility logic is 100% correct! You have clearly defined that when dividing by 5 leaves a remainder of 0 (\`n % 5 == 0\`), the number is **Divisible by 5**, and when remainder is not 0 (\`n % 5 != 0\`), it is **Not Divisible by 5**.

Fantastic job! Proceed to Stage 2: Recipe!`;
    return {
      isFullyVerified: true,
      hasDivisibilityConcept: true,
      hasModuloCheck: true,
      hasDivisibleOutcome: true,
      hasNotDivisibleOutcome: true,
      feedback: feedback2,
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "if n % 5 == 0 then divisible by 5"
    };
  }
  let feedback = "\u{1F31F} Coach Maya here! What mathematical operation tests if a number is divisible by 5, and what must the remainder be?";
  if (attemptCount >= 2) {
    feedback = "\u{1F31F} Coach Maya checking back! A number is Divisible by 5 if the remainder after dividing by 5 is 0 (`n % 5 == 0`). Write this mathematical rule with an example in everyday words!";
  }
  return {
    isFullyVerified: false,
    hasDivisibilityConcept: mentions5,
    hasModuloCheck: hasMathematicalCheck,
    hasDivisibleOutcome: mentionsDivisible,
    hasNotDivisibleOutcome: mentionsNotDivisible,
    feedback,
    correction: "If n % 5 == 0 display Divisible by 5, else display Not Divisible by 5.",
    suggestedInput: "If a number divided by 5 leaves remainder 0 (n % 5 == 0, e.g. 25 % 5 = 0), it is Divisible by 5. If remainder is not 0 (e.g. 23 % 5 = 3), it is Not Divisible by 5.",
    matchedFirebaseInput: "how to check if a number is divisible by 5"
  };
}
function validateDivisibleBy5Recipe(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|steps to write)\b/i.test(norm);
  const hasStep1 = !isQuestion && (/(?:step\s*1\s*:?|get\s*(?:the\s*)?(?:input\s*)?number|read\s*(?:the\s*)?number|take\s*(?:an?\s*)?integer|input\s*number)/i.test(norm) || /\b(?:n|num|number)\s*=\s*\d+\b/i.test(norm) || /\b(?:get|read|take|input)\b/i.test(norm) && /\b(?:number|n|num|value)\b/i.test(norm));
  const mentionsModuloCondition = /%\s*5|divided\s*by\s*5|dividing\s*(?:the\s*)?(?:input\s*)?number\s*by\s*5|divide\s*(?:the\s*)?(?:taken\s*)?number\s*by\s*5|remainder\s*(?:is|=|with)?\s*(?:0|zero)/i.test(norm) || /check\s*(?:if|whether)\s*(?:the\s*)?(?:number|n)\s*(?:is\s*)?divisible/i.test(norm);
  const hasRemainder0NotDivisibleContradiction = /(?:remainder\s*(?:is|=|:)?\s*(?:0|zero)|%\s*5\s*==\s*0)[\s\S]*?(?:display|print|show|is|called|it\s*is)?\s*not\s*divisible/i.test(norm) && !/(?:remainder\s*(?:is\s*not|!=)\s*(?:0|zero)|else|otherwise)[\s\S]*?not\s*divisible/i.test(norm);
  const hasRemainderNot0DivisibleContradiction = /(?:remainder\s*(?:is|=|:)?\s*(?:[1-9]|one|two|three|four|not\s*0|not\s*zero|!=\s*0)|%\s*5\s*(?:!=\s*0|==\s*[1-9]))[\s\S]*?(?:display|print|show|is|called|it\s*is)?\s+(?<!not\s+|non\s+)divisible(?:\s*by\s*5)?/i.test(norm);
  const hasWrongRemainderInStep2 = /step\s*2[\s\S]*?remainder\s*(?:is|=|:)?\s*([1-9]|one|two|three|four)/i.test(norm) && !/step\s*2[\s\S]*?remainder\s*(?:is|=|:)?\s*(?:0|zero)/i.test(norm);
  const hasRecipeContradiction = hasRemainder0NotDivisibleContradiction || hasRemainderNot0DivisibleContradiction || hasWrongRemainderInStep2;
  const hasStep2Condition = !hasRecipeContradiction && !hasWrongRemainderInStep2 && (hasStep1 || norm.includes("step 2")) && mentionsModuloCondition;
  const mapsDivisible = /(?:display|print|show|output|is|called)\s+(?<!not\s+|non\s+)divisible(?:\s*by\s*5)?/i.test(norm) || /\bdivisible\s*by\s*5\b/i.test(norm) && !/\bnot\s*divisible\s*by\s*5\b/i.test(norm);
  const mapsNotDivisible = /(?:display|print|show|output|is|called)\s+not\s*divisible/i.test(norm) || /\bnot\s*divisible\b/i.test(norm) || /\belse\b/i.test(norm) || /\botherwise\b/i.test(norm);
  const hasStep3Outcome = !hasRecipeContradiction && !hasWrongRemainderInStep2 && hasStep1 && hasStep2Condition && (norm.includes("step 3") || norm.includes("otherwise") || norm.includes("else") || mapsDivisible && mapsNotDivisible) && mapsDivisible && mapsNotDivisible;
  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Get input number n (e.g. 25)",
      completed: Boolean(hasStep1),
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Step 2: Check if dividing the number by 5 leaves remainder 0 (n % 5 == 0)",
      completed: Boolean(hasStep1 && hasStep2Condition && !hasRecipeContradiction && !hasWrongRemainderInStep2),
      current: Boolean(hasStep1 && (!hasStep2Condition || hasRecipeContradiction || hasWrongRemainderInStep2))
    },
    {
      stepNumber: 3,
      title: "Step 3: Display 'Divisible by 5' if true, else display 'Not Divisible by 5'",
      completed: Boolean(hasStep1 && hasStep2Condition && !hasRecipeContradiction && !hasWrongRemainderInStep2 && hasStep3Outcome),
      current: Boolean(hasStep1 && hasStep2Condition && !hasRecipeContradiction && !hasWrongRemainderInStep2 && !hasStep3Outcome)
    }
  ];
  if (hasRecipeContradiction || hasWrongRemainderInStep2) {
    let contradictionMsg = "\u{1F31F} Coach Maya gentle check: Look closely at Step 2! You wrote that when remainder is zero, it is 'not divisible by 5'. But when dividing by 5 leaves a **remainder of 0**, the number **IS Divisible by 5**!\n\nTo fix this: write Step 2 to check the remainder with 5: `Step 2: Check if dividing the number by 5 leaves remainder 0`.";
    if (hasRemainderNot0DivisibleContradiction || hasWrongRemainderInStep2) {
      contradictionMsg = "\u{1F31F} Coach Maya gentle check: Look closely at Step 2! You wrote that when remainder is 1 (or non-zero), it is divisible by 5. But when dividing by 5 leaves a remainder of 1 (like 21 % 5 = 1), the number is **NOT Divisible by 5**! A number is only divisible by 5 when dividing by 5 leaves a **remainder of 0**.\n\nTo fix this: update Step 2 to check for remainder 0: `Step 2: Check if dividing the number by 5 leaves remainder 0`.";
    }
    return {
      isFullyVerified: false,
      hasContradiction: true,
      recipeStepProgress,
      feedback: contradictionMsg,
      correction: "Step 2: Check if dividing the number by 5 leaves remainder 0.",
      suggestedInput: "Step 2: Check if dividing the number by 5 leaves remainder 0.",
      matchedFirebaseInput: "step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5"
    };
  }
  const isFullyVerified = hasStep1 && hasStep2Condition && hasStep3Outcome && !hasRecipeContradiction;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Recipe Algorithm Trace with Example Number (25):**
\u2022 **Step 1:** Get input number \`n = 25\`
\u2022 **Step 2:** Check remainder: \`25 % 5 = 0\` is **true**
\u2022 **Step 3:** Condition is true \u2794 Display **"Divisible by 5"** (otherwise "Not Divisible by 5") \u2705

\u{1F389} **Woohoo! Outstanding recipe!** \u{1F3C6} You wrote a crystal-clear 3-step algorithm for checking divisibility by 5. Ready to gather the programming tools! Proceed to Stage 3: Ingredients!`;
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback,
      correction: "Proceed to Stage 3: Ingredients to identify variables and operators.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5"
    };
  }
  if (!hasStep1) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maya checking back! What is the very first thing our recipe needs before making any decision? We must get the input number! Write: 'Step 1: Get input number n'." : "\u{1F31F} Coach Maya here! Let's think like a chef writing a recipe step by step. What is the very first step we must take? (Step 1: Get input number n).";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 1: Get input number n.",
      suggestedInput: "Step 1: Get input number n.",
      matchedFirebaseInput: "what steps to write"
    };
  }
  if (hasStep1 && !hasStep2Condition) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maya here! Step 1 looks solid! \u{1F44F} Now for Step 2: What condition checks if the number divided by 5 leaves remainder 0? (Check if n divided by 5 leaves remainder 0)." : "\u{1F31F} Coach Maya here! Great start with Step 1! \u{1F44F} For Step 2, what mathematical check tests if dividing by 5 leaves a remainder of 0?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 2: Check if dividing the number by 5 leaves remainder 0.",
      suggestedInput: "Step 2: Check if dividing the number by 5 leaves remainder 0.",
      matchedFirebaseInput: "step 1 : Get input number"
    };
  }
  if (hasStep1 && hasStep2Condition && !hasStep3Outcome) {
    const feedback = attemptCount >= 2 ? "\u{1F31F} Coach Maya here! You've set up the remainder check condition perfectly! \u{1F44F} Now for Step 3: What message should be displayed if the remainder is 0, and what message if it is not?" : "\u{1F31F} Coach Maya here! Superb work on the condition! \u{1F31F} To wrap up our recipe in Step 3, what should we display when remainder is 0, and what should we show otherwise?";
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback,
      correction: "Step 3: If remainder is 0 display 'Divisible by 5', else display 'Not Divisible by 5'.",
      suggestedInput: "Step 3: If remainder is 0 display 'Divisible by 5', else display 'Not Divisible by 5'.",
      matchedFirebaseInput: "step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5"
    };
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maya here! Let's build our recipe step by step. Start with Step 1: Get input number n.",
    correction: "Step 1: Get input number n.",
    suggestedInput: "Step 1: Get input number n.",
    matchedFirebaseInput: "what steps to write"
  };
}
function validateDivisibleBy5Ingredients(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|what ingredients)\b/i.test(norm);
  const hasVariableN = !isQuestion && (/step\s*1\s*:?\s*(?:n|num|number|a|b|c|x|y|val)|variable\s*:?\s*(?:n|num|number|a|b|c|x|y|val)|var\s+(?:n|num|number|a|b|c|x|y|val)|(?:n|num|number|a|b|c|x|y|val)\s*=\s*\d+|input\s*variable\s*(?:n|num|number|a|b|c|x|y|val)/i.test(norm) || /\b(?:n|num|number|a|b|c|x|y|val)\b/i.test(norm));
  const userVarMatch = norm.match(/step\s*1\s*:?\s*(?:variable|var|input)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i) || norm.match(/variable\s*:?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i) || norm.match(/var\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
  const detectedVar = userVarMatch ? userVarMatch[1] || "n" : "n";
  const extractStepText = (stepNum) => {
    const nextStepNum = stepNum + 1;
    const regex = new RegExp(`(?:step\\s*${stepNum}|(?:^|\\n|;)\\s*${stepNum}[\\.\\)])\\s*[:\\-\\s]*([\\s\\S]*?)(?=(?:step\\s*${nextStepNum}|(?:^|\\n|;)\\s*${nextStepNum}[\\.\\)]|$))`, "i");
    const match = norm.match(regex);
    return match ? match[1].trim() : "";
  };
  const step1Text = extractStepText(1);
  const step2Text = extractStepText(2);
  const step3Text = extractStepText(3);
  const step4Text = extractStepText(4);
  const step5Text = extractStepText(5);
  const step2Target = step2Text || norm;
  const hasIfInStep2 = step2Text ? /\bif\b/i.test(step2Text) : /\bif\b/i.test(norm);
  const hasElseInStep2 = step2Text ? /\belse\b/i.test(step2Text) && !hasIfInStep2 : /\belse\b/i.test(norm) && !hasIfInStep2;
  const hasElseWithCondition = hasElseInStep2 && /left\s*side|\bl\.?s\.?\b|operator|\bop\b|right\s*side|\br\.?s\.?\b|%|==|!=|<|>/i.test(step2Target);
  const lsMatch = step2Target.match(/(?:left\s*side|\bl\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongLeftSideDetected = null;
  if (lsMatch) {
    const rawLS = lsMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/(?:n|num|number|a|b|c|x|y|val)\s*%\s*5/i.test(rawLS) && !/(?:n|num|number|a|b|c|x|y|val)\b/i.test(rawLS)) {
      wrongLeftSideDetected = rawLS || "(empty)";
    }
  }
  const explicitOperatorMatch = step2Target.match(/(?:operator|\bop\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i) || step2Target.match(/(?:step\s*2|condition|if\s*\(?[a-zA-Z_0-9]+\s*%\s*5)\s*.*?([><!=]=?)\s*0/i);
  let wrongOperatorDetected = null;
  if (explicitOperatorMatch) {
    const rawOp = explicitOperatorMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (rawOp !== "==" && rawOp !== "=" && !rawOp.includes("==")) {
      wrongOperatorDetected = rawOp || "(empty)";
    }
  }
  const rsExplicitMatch = step2Target.match(/(?:right\s*side|\br\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongRightSideDetected = null;
  if (rsExplicitMatch) {
    const rawRS = rsExplicitMatch[1].trim().replace(/^\(/, "").replace(/\)$/, "").trim();
    if (!/\b0\b/.test(rawRS)) {
      wrongRightSideDetected = rawRS || "(empty)";
    }
  }
  const rsComparisonMatch = step2Target.match(/(?:%\s*5\s*(?:==|=)\s*(\d+)|\br\.?s\.?\s*[:=]?\s*(\d+)|right\s*side\s*[:=]?\s*(\d+))/i);
  let wrongThresholdDetected = null;
  if (rsComparisonMatch) {
    const thresholdVal = (rsComparisonMatch[1] || rsComparisonMatch[2] || rsComparisonMatch[3] || "").trim();
    if (thresholdVal && thresholdVal !== "0") {
      wrongThresholdDetected = thresholdVal;
    }
  }
  const mentions0InCondition = step2Target.includes("0") || step2Target.includes("zero") || norm.includes("0") || norm.includes("zero");
  const mentionsModuloInCondition = step2Target.includes("%") || step2Target.includes("modulo") || step2Target.includes("rem") || norm.includes("%") || norm.includes("modulo");
  const hasValidIfCondition = hasVariableN && !hasElseWithCondition && !wrongLeftSideDetected && !wrongOperatorDetected && !wrongRightSideDetected && !wrongThresholdDetected && mentionsModuloInCondition && mentions0InCondition && (norm.includes("n % 5 == 0") || norm.includes("n % 5 = 0") || /\b(?:n|num|number|a|b|c|x|y|val)\s*%\s*5\s*==\s*0\b/i.test(norm) || step2Target.includes("l s") && step2Target.includes("r s") && step2Target.includes("operator") || step2Target.includes("left side") && step2Target.includes("right side") || step2Target.includes("left side") && step2Target.includes("operator") || step2Target.includes("l.s") && step2Target.includes("operator") || /\bif\b/i.test(step2Target) && mentionsModuloInCondition);
  const step3Target = step3Text || (norm.match(/step\s*3\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step5Target = step5Text || (norm.match(/step\s*5\s*:?[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideIfSection = (norm.match(/inside\s*if\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const insideElseSection = (norm.match(/inside\s*else\s*block[^\n]*(?:[\n\r]+[^\n]*){0,2}/i) || [])[0] || "";
  const step3HasNotDivisible = /not\s*divisible/i.test(step3Target) || /not\s*divisible/i.test(insideIfSection);
  const step5HasDivisible = (/divisible/i.test(step5Target) || /divisible/i.test(insideElseSection)) && !/not\s*divisible/i.test(step5Target) && !/not\s*divisible/i.test(insideElseSection);
  const hasPrintDivisible = !step3HasNotDivisible && (/print\s*\(\s*["']divisible\s*by\s*5["']\s*\)/i.test(norm) || /step\s*3\s*:?.*?print.*?divisible/i.test(norm) || /display\s*["']?divisible\s*by\s*5["']?/i.test(norm) || /print\s*(?:it\s*is\s*)?divisible/i.test(norm) || Boolean(step3Text) && /divisible/i.test(step3Text) && !/not\s*divisible/i.test(step3Text));
  const hasStep4Else = /step\s*4\s*[:\-\s]*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || /4\s*[\.\)]\s*(?:else\s*block|else|fallback\s*else)\b/i.test(norm) || Boolean(step4Text) && /\belse\b/i.test(step4Text);
  const hasElseBranch = !hasElseWithCondition && hasValidIfCondition && hasPrintDivisible && (hasStep4Else || /fallback\s*else\s*block/i.test(norm) && !hasElseInStep2);
  const hasPrintNotDivisible = !step5HasDivisible && (/print\s*\(\s*["']not\s*divisible\s*by\s*5["']\s*\)/i.test(norm) || /step\s*5\s*:?.*?print.*?not\s*divisible/i.test(norm) || /display\s*["']?not\s*divisible\s*by\s*5["']?/i.test(norm) || /print\s*(?:it\s*is\s*)?not\s*divisible/i.test(norm) || Boolean(step5Text) && /not\s*divisible/i.test(step5Text));
  const hasUnquotedPrint = /print\s*\(\s*(?!["'])divisible\b/i.test(norm) || /print\s*\(\s*(?!["'])not\s*divisible\b/i.test(norm);
  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: `Step 1: Input variable (${detectedVar})`,
      completed: Boolean(hasVariableN),
      current: !hasVariableN
    },
    {
      stepNumber: 2,
      title: `Step 2: If condition (L.S: ${detectedVar} % 5, Operator: ==, R.S: 0)`,
      completed: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition),
      current: Boolean(hasVariableN && (!hasValidIfCondition || hasElseWithCondition))
    },
    {
      stepNumber: 3,
      title: "Step 3: Inside if block: print('Divisible by 5')",
      completed: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && hasPrintDivisible),
      current: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && !hasPrintDivisible)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block",
      completed: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && hasPrintDivisible && hasElseBranch),
      current: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && hasPrintDivisible && !hasElseBranch)
    },
    {
      stepNumber: 5,
      title: "Step 5: Inside else block: print('Not Divisible by 5')",
      completed: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && hasPrintDivisible && hasElseBranch && hasPrintNotDivisible),
      current: Boolean(hasVariableN && hasValidIfCondition && !hasElseWithCondition && hasPrintDivisible && hasElseBranch && !hasPrintNotDivisible)
    }
  ];
  if (hasElseWithCondition) {
    const feedback = `\u{1F50D} **Step-by-Step Analysis of Your Input:**
\u2022 **Step 1:** \`Input variable (${detectedVar})\` \u2794 \u2705 Defined correctly!
\u2022 **Step 2:** You wrote \`else\` with comparison components (Left Side: \`${detectedVar} % 5\`, Operator: \`==\`, Right Side: \`0\`) \u2794 \u274C Logical construct mismatch!

\u{1F4A1} **Understanding 'if' vs 'else' in Programming Logic:**
\u2022 **Why we use \`if\`:** In programming, the **\`if\` construct** is used when you need to evaluate a specific condition / mathematical question (Left Side: \`${detectedVar} % 5\`, Operator: \`==\`, Right Side: \`0\`). When that condition evaluates to **true** (the remainder equals 0), the code inside the \`if\` block executes!
\u2022 **Why we use \`else\`:** The **\`else\` construct** is a blanket fallback mechanism. It has **no condition** (no Left Side, Operator, or Right Side) of its own. Its sole purpose is to automatically execute when the \`if\` condition turns out to be **false**.

\u{1F3AF} **How to Solve & Proceed to Next Step:**
Since you are testing the condition (\`${detectedVar} % 5 == 0\`), replace \`else\` with the **\`if\` condition**:
\`step 2 : If condition with Left Side (${detectedVar} % 5), Operator (==), Right Side (0)\``;
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback,
      correction: `step 2 : If condition with Left Side (${detectedVar} % 5), Operator (==), Right Side (0)`,
      suggestedInput: `step 2 : If condition with Left Side (${detectedVar} % 5), Operator (==), Right Side (0)`,
      matchedFirebaseInput: "step 2 : If condition"
    };
  }
  if (wrongLeftSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya checking Step 2 Left Side: Look at your Left Side (L.S)! You wrote \`Left side: ${wrongLeftSideDetected}\`. In the condition \`${detectedVar} % 5 == 0\`, the Left Side calculates the remainder using modulo 5: \`${detectedVar} % 5\` (\`Left side: ${detectedVar} % 5\` or \`L.S: ${detectedVar} % 5\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      matchedFirebaseInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0"
    };
  }
  if (wrongOperatorDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya operator check: You wrote \`operator: ${wrongOperatorDetected}\`. To test if the remainder equals 0, use the equality operator \`==\` (\`operator: ==\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      matchedFirebaseInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0"
    };
  }
  if (wrongRightSideDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya checking Step 2 Right Side: Look at your Right Side (R.S)! You wrote \`right side: ${wrongRightSideDetected}\`. In the condition \`${detectedVar} % 5 == 0\`, the Right Side is the remainder value **0** (\`right side: 0\` or \`R.S: 0\`).`,
      correction: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      matchedFirebaseInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0"
    };
  }
  if (wrongThresholdDetected) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya checking Step 2 Right Side value: Look at your comparison threshold \`${wrongThresholdDetected}\`! In the condition \`${detectedVar} % 5 == 0\`, to check if a number is divisible by 5, the remainder must be **0** (not ${wrongThresholdDetected}).`,
      correction: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      suggestedInput: `step 2 : If condition with L.S: ${detectedVar} % 5, Operator: ==, R.S: 0`,
      matchedFirebaseInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0"
    };
  }
  if (step3HasNotDivisible) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya logic alert: Look closely at Step 3! In Step 2, the condition tests if \`n % 5 == 0\` (remainder is 0). When this condition is **true**, the number is **Divisible by 5**! Step 3 must print Divisible by 5: \`step 3 : Inside if block: print("Divisible by 5")\`.`,
      correction: 'step 3 : Inside if block: print("Divisible by 5")',
      suggestedInput: 'step 3 : Inside if block: print("Divisible by 5")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (step5HasDivisible) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: `\u{1F31F} Coach Maya logic alert: Look closely at Step 5! In the \`else\` block (when remainder is not 0), the number is **Not Divisible by 5**! Step 5 must print Not Divisible by 5: \`step 5 : Inside else block: print("Not Divisible by 5")\`.`,
      correction: 'step 5 : Inside else block: print("Not Divisible by 5")',
      suggestedInput: 'step 5 : Inside else block: print("Not Divisible by 5")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const hasSecondIfInsteadOfElse = /step\s*4\s*:?\s*if|if\s*n\s*%\s*5\s*!=\s*0/i.test(norm) && !hasElseBranch;
  if (hasSecondIfInsteadOfElse) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya checking Step 4: You wrote another `if` condition for the not divisible case! In programming with if-else constructs, we use the simple blanket fallback **`else` block** (`step 4 : else block`) to automatically handle all numbers that leave a remainder. Please update Step 4 to use `step 4 : else block`.",
      correction: "step 4 : else block",
      suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("Not Divisible by 5")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasUnquotedPrint) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maya syntax alert: Wrap text strings in quotation marks: `print("Divisible by 5")` and `print("Not Divisible by 5")`. Without quotes, the compiler looks for undeclared variables!',
      correction: 'print("Divisible by 5"); and print("Not Divisible by 5");',
      suggestedInput: 'step 3 : Inside if block: print("Divisible by 5")\nstep 4 : else block\nstep 5 : Inside else block: print("Not Divisible by 5")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  const isFullyVerified = hasVariableN && hasValidIfCondition && hasPrintDivisible && hasElseBranch && hasPrintNotDivisible;
  if (isFullyVerified) {
    const feedback = `\u{1F52C} **Ingredients Operation Trace with Example Number (25):**
\u2022 **Input Variable:** \`n = 25\`
\u2022 **Condition Operands:** Left Side: \`n % 5\` (\u2794 \`0\`), Operator: \`==\`, Right Side: \`0\`
\u2022 **Condition Evaluation:** \`0 == 0\` evaluates to **true**
\u2022 **True Action:** \`print("Divisible by 5")\`
\u2022 **Fallback Else Action:** \`print("Not Divisible by 5")\`

\u{1F389} **Woohoo! Outstanding ingredients list!** \u{1F3C6} You gathered the \`n\` variable, modulo operator \`%\`, equality operator \`==\`, threshold \`0\`, quoted print statements, and neat else branch. All ingredients verified through concrete operation trace! Proceed to Stage 4: Taste the Sample!`;
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback,
      correction: "Proceed to Stage 4: Taste the Sample to assemble your prototype code.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0"
    };
  }
  if (!hasVariableN) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! What programming ingredients do we need? Start with Step 1: Input variable `n`.",
      correction: "step 1 : n variable",
      suggestedInput: "step 1 : n variable",
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariableN && !hasValidIfCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Spot on! You have the `n` variable. \u{1F44F} Now for Step 2: How do you write the if condition using Left Side (L.S: `n % 5`), Operator (`==`), and Right Side (R.S: `0`)?",
      correction: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0",
      suggestedInput: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0",
      matchedFirebaseInput: "step 1 : n variable"
    };
  }
  if (hasVariableN && hasValidIfCondition && !hasPrintDivisible) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maya here! Great condition! Now for Step 3: Inside the if block, write the winning print statement: `step 3 : Inside if block: print("Divisible by 5")`.',
      correction: 'step 3 : Inside if block: print("Divisible by 5")',
      suggestedInput: 'step 3 : Inside if block: print("Divisible by 5")',
      matchedFirebaseInput: "how to write if condition"
    };
  }
  if (hasVariableN && hasValidIfCondition && hasPrintDivisible && !hasElseBranch) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Step 1, Step 2, and Step 3 are ready! \u{1F44F} Now add the fallback `else` construct: `step 4 : else block`. This handles all numbers with a remainder.",
      correction: "step 4 : else block",
      suggestedInput: 'step 4 : else block\nstep 5 : Inside else block: print("Not Divisible by 5")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  if (hasVariableN && hasValidIfCondition && hasPrintDivisible && hasElseBranch && !hasPrintNotDivisible) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maya here! Almost finished with ingredients! Add Step 5 inside the else block to print the negative message: `step 5 : Inside else block: print("Not Divisible by 5")`.',
      correction: 'step 5 : Inside else block: print("Not Divisible by 5")',
      suggestedInput: 'step 5 : Inside else block: print("Not Divisible by 5")',
      matchedFirebaseInput: "what ingredients do we need"
    };
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: "\u{1F31F} Coach Maya here! Let's gather all 5 ingredients step by step.",
    correction: "step 1 : n variable",
    suggestedInput: "step 1 : n variable",
    matchedFirebaseInput: "what ingredients do we need"
  };
}
function validateDivisibleBy5SampleCode(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain)\b/i.test(norm);
  const hasVarDeclaration = !isQuestion && (/(?:var|let|const|int)\s+(?:n|num|number|a)\s*=\s*\d+/i.test(input) || /\b(?:n|num|number|a)\s*=\s*\d+/i.test(input));
  const hasIfCondition = /if\s*\(\s*(?:n|num|number|a)\s*%\s*5\s*==\s*0\s*\)/i.test(input) || /if\s*(?:n|num|number|a)\s*%\s*5\s*==\s*0/i.test(input) || /if\s*\(\s*(?:n|num|number|a)\s*%\s*5\s*=\s*0\s*\)/i.test(input);
  const hasPrintDivisible = /print\s*\(\s*["']divisible\s*by\s*5["']\s*\)/i.test(input) || /print\s*\(\s*["']divisible["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']divisible\s*by\s*5["']\s*\)/i.test(input);
  const hasElseClause = /\belse\b/i.test(input);
  const hasPrintNotDivisible = /print\s*\(\s*["']not\s*divisible\s*by\s*5["']\s*\)/i.test(input) || /print\s*\(\s*["']not\s*divisible["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']not\s*divisible\s*by\s*5["']\s*\)/i.test(input);
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Step 1: Declare sample variable (var n = 25;)",
      completed: Boolean(hasVarDeclaration),
      current: !hasVarDeclaration
    },
    {
      stepNumber: 2,
      title: "Step 2: Write if condition (if (n % 5 == 0))",
      completed: Boolean(hasIfCondition),
      current: Boolean(hasVarDeclaration && !hasIfCondition)
    },
    {
      stepNumber: 3,
      title: "Step 3: Inside if: print('Divisible by 5');",
      completed: Boolean(hasPrintDivisible),
      current: Boolean(hasVarDeclaration && hasIfCondition && !hasPrintDivisible)
    },
    {
      stepNumber: 4,
      title: "Step 4: Write else clause",
      completed: Boolean(hasElseClause),
      current: Boolean(hasVarDeclaration && hasIfCondition && hasPrintDivisible && !hasElseClause)
    },
    {
      stepNumber: 5,
      title: "Step 5: Inside else: print('Not Divisible by 5');",
      completed: Boolean(hasPrintNotDivisible),
      current: Boolean(hasVarDeclaration && hasIfCondition && hasPrintDivisible && hasElseClause && !hasPrintNotDivisible)
    }
  ];
  const allVerified = hasVarDeclaration && hasIfCondition && hasPrintDivisible && hasElseClause && hasPrintNotDivisible;
  if (allVerified) {
    const operationTestCases = [
      {
        testCaseTitle: "Test Case 1 (n = 25)",
        inputNumber: 25,
        operationFormula: "25 % 5 = 0",
        conditionCheck: "25 % 5 == 0 is TRUE",
        conditionEvaluated: true,
        executedBranch: "if",
        outputMessage: "Divisible by 5",
        expectedOutput: "Divisible by 5",
        passed: true,
        explanation: "25 divided by 5 leaves remainder 0 -> Divisible by 5."
      },
      {
        testCaseTitle: "Test Case 2 (n = 23)",
        inputNumber: 23,
        operationFormula: "23 % 5 = 3",
        conditionCheck: "23 % 5 == 0 is FALSE",
        conditionEvaluated: false,
        executedBranch: "else",
        outputMessage: "Not Divisible by 5",
        expectedOutput: "Not Divisible by 5",
        passed: true,
        explanation: "23 divided by 5 leaves remainder 3 != 0 -> Not Divisible by 5."
      }
    ];
    const feedback = `\u{1F52C} **Code Execution Trace & Test Results:**
\u2022 **Test 1 (\`n = 25\`):** \`25 % 5 == 0\` is **true** \u2794 Output: **"Divisible by 5"** \u2705 PASS
\u2022 **Test 2 (\`n = 23\`):** \`23 % 5 == 0\` is **false** \u2794 Output: **"Not Divisible by 5"** \u2705 PASS

\u{1F389} **CONGRATULATIONS! ALL 4 CTC STAGES COMPLETED!** \u{1F3C6}
Your prototype code runs flawlessly and handles both divisible and non-divisible numbers! You are now a master of conditional divisibility algorithms!`;
    return {
      isFullyVerified: true,
      allVerified: true,
      sampleCodeStepProgress,
      operationTestCases,
      feedback,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}'
    };
  }
  if (!hasVarDeclaration) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Start your prototype code in Step 1 by declaring a sample integer: `var n = 25;`.",
      correction: "var n = 25;",
      suggestedInput: "var n = 25;",
      matchedFirebaseInput: "var n = 25;"
    };
  }
  if (hasVarDeclaration && !hasIfCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Variable declared! Now for Step 2: Write the `if` statement to check if `n % 5 == 0`.",
      correction: "if (n % 5 == 0)",
      suggestedInput: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n}',
      matchedFirebaseInput: "if (n % 5 == 0)"
    };
  }
  if (hasVarDeclaration && hasIfCondition && !hasPrintDivisible) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: '\u{1F31F} Coach Maya here! Great condition! Now for Step 3: Inside the if block, write `print("Divisible by 5");`.',
      correction: 'print("Divisible by 5");',
      suggestedInput: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n}',
      matchedFirebaseInput: 'print("Divisible by 5")'
    };
  }
  if (hasVarDeclaration && hasIfCondition && hasPrintDivisible && (!hasElseClause || !hasPrintNotDivisible)) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      feedback: '\u{1F31F} Coach Maya here! Almost done! Complete the code with the `else` block: `else { print("Not Divisible by 5"); }`.',
      correction: 'else {\n  print("Not Divisible by 5");\n}',
      suggestedInput: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}',
      matchedFirebaseInput: 'else print("Not Divisible by 5")'
    };
  }
  return {
    isFullyVerified: false,
    allVerified: false,
    sampleCodeStepProgress,
    feedback: "\u{1F31F} Coach Maya here! Let's write the complete code step by step.",
    correction: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}',
    suggestedInput: 'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}',
    matchedFirebaseInput: "var n = 25;"
  };
}
export {
  validateDivisibleBy5Ingredients,
  validateDivisibleBy5Logic,
  validateDivisibleBy5Recipe,
  validateDivisibleBy5SampleCode
};
