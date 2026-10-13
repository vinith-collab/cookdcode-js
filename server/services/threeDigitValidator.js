function validateThreeDigitLogic(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ").trim();
  const hasLowerBound = norm.includes("100") || norm.includes("99") || norm.includes("greater than or equal to 100") || norm.includes(">= 100") || norm.includes(">=100") || norm.includes("> 99") || norm.includes(">99") || norm.includes("above 99") || norm.includes("from 100") || norm.includes("starts at 100");
  const hasUpperBound = norm.includes("999") || norm.includes("less than or equal to 999") || norm.includes("<= 999") || norm.includes("<=999") || norm.includes("< 1000") || norm.includes("<1000") || norm.includes("below 1000") || norm.includes("less than 1000") || norm.includes("under 1000") || norm.includes("to 999") || norm.includes("upto 999") || norm.includes("ends at 999") || norm.includes("1000") && (norm.includes("below") || norm.includes("under") || norm.includes("less") || norm.includes("smaller") || norm.includes("upto") || norm.includes("up to") || norm.includes("before"));
  const hasLogicalAnd = norm.includes("and") || norm.includes("&&") || norm.includes("between") || norm.includes("range") || norm.includes("both") || hasLowerBound && hasUpperBound;
  const hasSpecific3DigitSample = /\b(?:1[0-9]{2}|[2-9][0-9]{2})\b/.test(norm.replace(/\b(?:100|999|1000)\b/g, ""));
  const hasThreeDigitExample = (
    // e.g. "3-digit number is 150", "3 digit: 150", "example 150"
    /(?:3[\s-]*digit|three[\s-]*digit|valid)\s*(?:is|are|example|eg|e\.g|like|number|as)?\s*.*?\b(?:[1-9]\d{2})\b/i.test(norm) || // e.g. "number as 150 ... is three digit number" or "150 is a 3-digit number" or "150 ... so this number is three digit number"
    /\b(?:[1-9]\d{2})\b[\s\w]*(?:is|are|means|so|this|number)?\s*.*?(?:3[\s-]*digit|three[\s-]*digit)/i.test(norm) || // Any non-boundary 3-digit number mentioned alongside 3-digit terminology (e.g. 150, 250, 456)
    hasSpecific3DigitSample && (norm.includes("3 digit") || norm.includes("3digit") || norm.includes("three digit") || norm.includes("three-digit")) || /\b(?:150|250|456|500|123|789|345|555|678|321|987)\b/.test(norm) || norm.includes("100") && (norm.includes("is 3") || norm.includes("is a 3") || norm.includes("example"))
  );
  const hasNonThreeDigitExample = (
    // e.g. "not a 3-digit number is 50", "not 3 digit: 1200"
    /(?:not|not a|invalid|non)\s*(?:a\s*)?3[\s-]*digit\s*(?:is|are|example|eg|e\.g|like|number|as)?\s*.*?\b(?:\d{1,2}|\d{4,})\b/i.test(norm) || // e.g. "1200 ... that number is a not a three digit number" or "50 ... not a three digit number"
    /\b(?:\d{1,2}|\d{4,})\b[\s\w]*(?:not|not a|non)\s*(?:a\s*)?(?:3[\s-]*digit|three[\s-]*digit)/i.test(norm) || // Specific non-3-digit numbers mentioned with "not 3 digit"
    /\b(?:50|45|42|5|9|25|99|1000|1200|10000|5000|1234)\b/.test(norm) && (norm.includes("not 3") || norm.includes("not a 3") || norm.includes("not three") || norm.includes("non 3")) || norm.includes("45 is not") || norm.includes("50 is not") || norm.includes("1000 is not") || norm.includes("1200 is not") || norm.includes("99 is not")
  );
  const hasUpperBoundaryError = (/(?:is|are|means)\s*(?:a\s*)?3[\s-]*digit[\s\w]*(?:greater than 1000|> ?1000|above 1000)/i.test(norm) || /(?:greater than 1000|> ?1000|above 1000)[\s\w]*(?:is|are|means)\s*(?:a\s*)?3[\s-]*digit(?!\s*not)/i.test(norm)) && !norm.includes("not a 3 digit") && !norm.includes("not 3 digit") && !norm.includes("not a three digit");
  const hasExample = hasThreeDigitExample && hasNonThreeDigitExample;
  const isFullyVerified = hasLowerBound && hasUpperBound && !hasUpperBoundaryError && hasLogicalAnd && hasThreeDigitExample && hasNonThreeDigitExample;
  let feedback = void 0;
  let correction = void 0;
  let suggestedInput = void 0;
  if (isFullyVerified) {
    const verified3Digit = hasSpecific3DigitSample ? norm.match(/\b(1[0-9]{2}|[2-9][0-9]{2})\b/)?.[0] || "150" : "250";
    const verifiedNon3Digit = norm.match(/\b(?:\d{1,2}|\d{4,})\b/)?.[0] || "1200 or 50";
    feedback = `Spot on! \u{1F31F} Coach Maya here! Outstanding logical proof! You've verified both boundaries (100 <= n <= 999), provided a valid 3-digit example (${verified3Digit}), and verified non-3-digit examples (${verifiedNon3Digit}). You've mastered the logic\u2014proceed to Recipe!`;
    correction = "Proceed to the Recipe stage to sequence the steps.";
  } else if (hasUpperBoundaryError) {
    feedback = "Coach Maya here! Let's take a closer look at that upper boundary. You mentioned that being greater than 1000 means it is a 3-digit number or part of the range. Think about the upper limit\u2014if a number is 1000 or larger, it actually has 4 or more digits! To be a 3-digit number, it must stay strictly below 1000 (up to 999). Could you adjust that boundary for me?";
    correction = "A 3-digit number must be strictly less than 1000 (<= 999), not greater than 1000.";
    suggestedInput = "A 3-digit number is between 100 and 999 inclusive (less than 1000).";
  } else if (!hasLowerBound && !hasUpperBound) {
    feedback = "Coach Maya here! Let's understand 3-digit numbers. What is the range of a 3-digit number (from 100 to 999)? And what are example numbers for a 3-digit number AND a NOT 3-digit number?";
    correction = "Specify the range: greater than or equal to 100 and less than or equal to 999.";
    suggestedInput = "A 3-digit number ranges from 100 up to 999 inclusive.";
  } else if (!hasLowerBound) {
    feedback = "Great start on the upper limit! What is the minimum value for a 3-digit number (e.g., greater than or equal to 100), and what are examples of 3-digit and non-3-digit numbers?";
    correction = "Specify the lower boundary (e.g., greater than or equal to 100).";
    suggestedInput = "The number must be greater than or equal to 100.";
  } else if (!hasUpperBound) {
    feedback = "Great start on the lower limit! What is the maximum value for a 3-digit number (e.g., less than or equal to 999 or strictly below 1000), and what are examples of 3-digit and non-3-digit numbers?";
    correction = "Specify the upper boundary (less than or equal to 999 or less than 1000).";
    suggestedInput = "and less than or equal to 999 (strictly below 1000).";
  } else if (!hasThreeDigitExample && !hasNonThreeDigitExample) {
    feedback = "Coach Maya here! You defined the range (100 to 999)! Now, to complete the Logic stage, please give both examples:\n1. An example of a 3-digit number (e.g., 250 or 456)\n2. An example of a number that is NOT a 3-digit number (e.g., 45 or 1000)\nWhat are your two example numbers?";
    correction = "Give an example of a 3-digit number (e.g. 250) and a non-3-digit number (e.g. 45).";
    suggestedInput = "For example, 250 is a 3-digit number, while 45 is not a 3-digit number.";
  } else if (!hasThreeDigitExample) {
    feedback = "Coach Maya here! You gave an example for a non-3-digit number! Now, what is an example number that IS a 3-digit number (e.g., 250 or 456)?";
    correction = "Add an example of a 3-digit number (e.g., 250).";
    suggestedInput = "For example, 250 is a 3-digit number.";
  } else if (!hasNonThreeDigitExample) {
    feedback = "Coach Maya here! You gave an example for a 3-digit number! Now, what is an example number that is NOT a 3-digit number (e.g., 45 or 1000)?";
    correction = "Add an example of a number that is not 3 digits (e.g., 45 or 1000).";
    suggestedInput = "For example, 45 is not a 3-digit number.";
  }
  return {
    isFullyVerified,
    hasLowerBound,
    hasUpperBound,
    hasLogicalAnd,
    hasThreeDigitExample,
    hasNonThreeDigitExample,
    hasExample,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: isFullyVerified ? "a 3-digit number is between 100 and 999 (e.g. 250 is 3-digit, 45 is not)" : void 0
  };
}
function validateThreeDigitRecipe(text) {
  const cleanLines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const recipeLines = cleanLines.filter((line) => {
    const l = line.toLowerCase();
    const isQuestion = l.includes("how to") || l.includes("what") || l.includes("dont know") || l.includes("don't know") || l.includes("did not know") || l.includes("didnt know") || l.includes("help me") || l.includes("explain") || l.includes("tell me") || l.includes("doubt");
    if (isQuestion && !/^step\s*\d+/i.test(line)) {
      return false;
    }
    return true;
  });
  const recipeText = recipeLines.join(" ").toLowerCase().replace(/[^a-z0-9\s><=+\-:&]/g, " ").replace(/\s+/g, " ").trim();
  const hasInputStep = recipeLines.some((line) => {
    const l = line.toLowerCase();
    return (l.includes("get") || l.includes("take") || l.includes("read") || l.includes("input") || l.includes("enter") || l.includes("given") || l.includes("obtain") || l.includes("ask") || /^step\s*1/i.test(line)) && (l.includes("number") || l.includes(" n ") || l.includes(" n") || l.includes("num") || l.includes("val") || l.includes("digit") || l.includes("input") || /^step\s*1/i.test(line));
  }) || recipeText.includes("get input") || recipeText.includes("get the input") || recipeText.includes("get the number") || recipeText.includes("take input") || recipeText.includes("take a number") || recipeText.includes("step 1");
  const hasConditionStep = recipeLines.some((line) => {
    const l = line.toLowerCase();
    const has100 = l.includes("100") || l.includes("99");
    const has999 = l.includes("999") || l.includes("1000");
    const hasComparison = l.includes("between") || l.includes("range") || l.includes("renage") || l.includes("greater") || l.includes("less") || l.includes(">=") || l.includes("<=") || l.includes("check") || l.includes("if") || l.includes("to");
    return has100 && has999 || has100 && hasComparison || has999 && hasComparison;
  }) || (recipeText.includes("100") || recipeText.includes("99")) && (recipeText.includes("999") || recipeText.includes("1000"));
  const step3Lines = recipeLines.filter((l) => /step\s*3/i.test(l) || /in\s+(?:the\s+)?(?:range|renage)/i.test(l));
  const hasStep3NegationError = step3Lines.some((l) => {
    const lower = l.toLowerCase();
    return lower.includes("not a 3 digit") || lower.includes("not 3 digit") || lower.includes("not a three digit") || lower.includes("not three digit") || lower.includes("not") && (lower.includes("3 digit") || lower.includes("three digit"));
  });
  const hasTrueOutput = !hasStep3NegationError && recipeLines.some((line) => {
    const l = line.toLowerCase();
    const mentionsThreeDigit = l.includes("3 digit") || l.includes("three digit") || l.includes("3-digit") || l.includes("3digit");
    const mentionsNot = l.includes("not") || l.includes("non") || l.includes("invalid") || l.includes("else") || l.includes("otherwise");
    return mentionsThreeDigit && !mentionsNot;
  });
  const hasFalseOutput = recipeLines.some((line) => {
    const l = line.toLowerCase();
    const mentionsThreeDigit = l.includes("3 digit") || l.includes("three digit") || l.includes("3-digit") || l.includes("3digit");
    const mentionsNot = l.includes("not") || l.includes("non") || l.includes("invalid") || l.includes("else") || l.includes("otherwise");
    return mentionsThreeDigit && mentionsNot;
  });
  const hasBranchContradiction = hasStep3NegationError || !hasTrueOutput && hasFalseOutput && recipeLines.length >= 4;
  const isFullyVerified = hasInputStep && hasConditionStep && hasTrueOutput && hasFalseOutput && !hasStep3NegationError;
  const steps = [
    { stepNumber: 1, title: "Step 1: Get input number n", completed: hasInputStep, current: !hasInputStep },
    { stepNumber: 2, title: "Step 2: Check whether n is between 100 and 999", completed: hasConditionStep, current: hasInputStep && !hasConditionStep },
    { stepNumber: 3, title: 'Step 3: When in range, show "3-digit number"', completed: hasTrueOutput, current: hasInputStep && hasConditionStep && !hasTrueOutput || hasStep3NegationError },
    { stepNumber: 4, title: 'Step 4: Otherwise, show "Not a 3-digit number"', completed: hasFalseOutput && hasTrueOutput, current: hasInputStep && hasConditionStep && hasTrueOutput && !hasFalseOutput }
  ];
  let feedback = void 0;
  let correction = void 0;
  let suggestedInput = void 0;
  if (isFullyVerified) {
    feedback = "Kudos! \u{1F31F} Coach Maya here! You have written a complete, crystal-clear step-by-step algorithm for checking a 3-digit number. Proceed to Ingredients!";
    correction = "Proceed to Ingredients stage!";
  } else if (hasStep3NegationError) {
    feedback = "Coach Maya here! Let's take a closer look at Step 3: You wrote that if the number is in the range between 100 to 999, it is *not* a three-digit number. But remember, any number between 100 and 999 (like 150 or 500) *is* a 3-digit number! In Step 3, describe that it *is* a 3-digit number.";
    correction = "Step 3: When in range (100 to 999), that number is a 3-digit number";
    suggestedInput = "Step 3: If that number in the range between 100 to 999 that number is a three digit number";
  } else if (!hasInputStep) {
    feedback = "Coach Maya here! Let's start with Step 1 of the recipe: How do we get the number from the user? (e.g. `Step 1: Get input number n`).";
    correction = "Step 1: Get input number n";
    suggestedInput = "Step 1: Get input number n";
  } else if (!hasConditionStep) {
    feedback = "Coach Maya here! Great start with Step 1 (Get input number n)! For Step 2, what step checks whether n is a 3-digit number (between 100 and 999)?";
    correction = "Step 2: Check whether n is greater than or equal to 100 and less than or equal to 999";
    suggestedInput = "Step 2: Check whether n is greater than or equal to 100 and less than or equal to 999";
  } else if (!hasTrueOutput) {
    feedback = "Coach Maya here! You've got Step 1 and the comparison in Step 2! Now for Step 3: When the number is in that range, what message should we show to the user?";
    correction = "Step 3: When in range, show '3-digit number'";
    suggestedInput = "Step 3: When in range, that number is a 3-digit number";
  } else if (!hasFalseOutput) {
    feedback = "Coach Maya here! You're almost done! Now for Step 4: Otherwise, when the number is not in that range, what message should we show to the user?";
    correction = "Step 4: Otherwise, show 'Not a 3-digit number'";
    suggestedInput = "Step 4: Otherwise, that number is not a 3-digit number";
  }
  return {
    isFullyVerified,
    hasStep3NegationError,
    hasBranchContradiction,
    recipeStepProgress: steps,
    matchedFirebaseInput: isFullyVerified ? "step 1: get input number n\nstep 2: check whether n is greater than or equal to 100 and less than or equal to 999\nstep 3: when in range show 3-digit number\nstep 4: otherwise show not a 3-digit number" : void 0,
    feedback,
    correction,
    suggestedInput
  };
}
function validateThreeDigitIngredients(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-:\.&]/g, " ").replace(/\s+/g, " ").trim();
  const varMatch = text.match(/(?:var|let|const|int|declare|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) || text.match(/(?:var|let|const|int|variable|input)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i) || text.match(/step\s*1\s*:\s*(?:var|let|const|int|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i);
  const detectedVar = varMatch && varMatch[1] && !["step", "if", "else", "var", "let", "const", "what", "how"].includes(varMatch[1].toLowerCase()) ? varMatch[1] : "n";
  const hasVar = /(?:var|let|const|int)?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=/i.test(text) || /\b(?:var|let|const|int|variable|input)\b/i.test(text) || /\b(?:n|a|b|x|y|num|val|number)\b/i.test(norm) || norm.includes("step 1") || norm.includes("get input");
  const hasLeftSide = /(?:left(?:\s*side)?|l\.s)\s*[:=]?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i.test(norm) || norm.includes(`left side: ${detectedVar.toLowerCase()}`) || norm.includes(`left side:${detectedVar.toLowerCase()}`) || norm.includes(`l.s: ${detectedVar.toLowerCase()}`) || norm.includes(`left: ${detectedVar.toLowerCase()}`) || norm.includes("left side: a") || norm.includes("left side:a") || norm.includes("left side: n") || norm.includes("left side:n") || norm.includes("l.s: a") || norm.includes("l.s: n");
  const hasRightSide = norm.includes("100") && (norm.includes("999") || norm.includes("1000")) || norm.includes("99") && (norm.includes("1000") || norm.includes("999"));
  const hasLowerOp = norm.includes(">=") || norm.includes(">") || norm.includes("greater");
  const hasUpperOp = norm.includes("<=") || norm.includes("<") || norm.includes("less");
  const hasLogicalOp = norm.includes("&&") || norm.includes("and") || norm.includes("logical");
  const hasCompoundConditionString = norm.includes(`${detectedVar.toLowerCase()} >= 100 && ${detectedVar.toLowerCase()} <= 999`) || norm.includes("n >= 100 && n <= 999") || norm.includes("a >= 100 && a <= 999") || norm.includes("n >= 100 and n <= 999") || norm.includes("a >= 100 and a <= 999") || norm.includes("100 <=") && norm.includes("<= 999");
  const hasOperators = hasCompoundConditionString || hasLowerOp && hasUpperOp && hasLogicalOp;
  const hasConditionBreakdown = hasLeftSide && hasRightSide && hasOperators || hasCompoundConditionString;
  const hasInsideIf = /(?:inside\s*if|if\s*block)[\s\S]*?(?:3[-\s]*digit|three\s*digit)/i.test(norm) || /(?:print|display|show|output)[\s\S]*?(?:3[-\s]*digit|three\s*digit)/i.test(norm) && /(?:3[-\s]*digit|three\s*digit)/i.test(norm);
  const hasInsideElse = /(?:not\s*(?:a\s*)?(?:3[-\s]*digit|three\s*digit))/i.test(norm) && /(?:print|display|show|inside\s*else|else\s*block|output)/i.test(norm);
  const hasElseConditionAttempt = /step\s*4\s*:\s*else[\s\S]*?(?:left\s*side|l\.s|operator|right\s*side|r\.s)/i.test(text) || /else\s*\(.*?\)/i.test(text) || /(?:inside\s+)?else[\s\S]*?(?:l\.s|left\s*side|operator)/i.test(text);
  const hasValidInsideElse = hasInsideElse && !hasElseConditionAttempt;
  const isFullyVerified = hasVar && hasConditionBreakdown && hasInsideIf && hasValidInsideElse;
  const steps = [
    { stepNumber: 1, title: `Step 1: Input variable (${detectedVar})`, completed: hasVar, current: !hasVar },
    { stepNumber: 2, title: `Step 2: If condition parts (Left Side: ${detectedVar}, Operators: >= & <=, Right Side: 100 & 999, Logical Op: &&)`, completed: hasConditionBreakdown, current: hasVar && !hasConditionBreakdown },
    { stepNumber: 3, title: `Step 3: Inside 'if' block \u2014 print "3-digit number"`, completed: hasInsideIf, current: hasVar && hasConditionBreakdown && !hasInsideIf },
    { stepNumber: 4, title: `Step 4: Inside 'else' block \u2014 print "Not a 3-digit number"`, completed: hasValidInsideElse, current: hasVar && hasConditionBreakdown && hasInsideIf && !hasValidInsideElse }
  ];
  let feedback = void 0;
  let correction = void 0;
  let suggestedInput = void 0;
  if (isFullyVerified) {
    feedback = `Hurray! \u{1F31F} Coach Maya here! You defined every required ingredient: Input variable ${detectedVar}, complete condition breakdown (Left Side: ${detectedVar}, Operators: >= & <=, Right Side: 100 & 999, Logical Operator: &&), and the exact operations inside both the 'if' block (print '3-digit number') and 'else' block (print 'Not a 3-digit number'). Proceed to Taste the Sample!`;
    correction = "Proceed to Taste the Sample!";
  } else if (!hasVar) {
    feedback = "Coach Maya here! Let's start with the first ingredient: We need an input variable (e.g., `Step 1: var a = 456` or `Step 1: Variable n for input`) to store our number.";
    correction = `Step 1: Define an input variable (e.g., var ${detectedVar} = 456)`;
    suggestedInput = `Step 1: var ${detectedVar} = 456`;
  } else if (!hasConditionBreakdown) {
    if (hasLeftSide && hasRightSide && !hasOperators) {
      feedback = `Coach Maya here! Great work setting Left Side to \`${detectedVar}\` and boundaries to ${norm.includes("1000") ? "100 and 1000" : "100 and 999"}! However, checking a 3-digit number requires TWO boundary comparisons connected by logical AND: you provided \`>=\`, but don't forget the upper boundary operator (\`<=\` or \`<\`) and the logical operator (\`&&\`)!`;
      correction = `Step 2: Add operators <= and && (e.g., Operators: >= & <=, Logical Operator: &&)`;
      suggestedInput = `Step 2: If condition with Left Side: ${detectedVar}, Operators: >= & <=, Right Side: 100 & 999, Logical Operator: &&`;
    } else {
      feedback = `Coach Maya here! Great start with variable \`${detectedVar}\`! In the Ingredients stage for 'if' conditions, we break down the condition into its building blocks:
\u2022 Left Side: ${detectedVar}
\u2022 Comparison Operators: >= and <=
\u2022 Right Side bounds: 100 and 999
\u2022 Logical Operator: &&

Can you define the Left Side, Operators, and Right Side in your worksheet?`;
      correction = `Step 2: Condition breakdown (Left Side: ${detectedVar}, Operators: >= & <=, Right Side: 100 & 999, Logical Op: &&)`;
      suggestedInput = `Step 2: If condition with Left Side: ${detectedVar}, Operators: >= & <=, Right Side: 100 & 999, Logical Operator: &&`;
    }
  } else if (!hasInsideIf) {
    feedback = "Coach Maya here! You've got the condition breakdown! Now for Step 3: What operation should execute inside the `if` block when the condition is true? (e.g., `Step 3: Inside 'if' block: print(\"3-digit number\")`)";
    correction = `Step 3: Inside 'if' block: print("3-digit number")`;
    suggestedInput = `Step 3: Inside 'if' block: print("3-digit number")`;
  } else if (!hasValidInsideElse) {
    if (hasElseConditionAttempt) {
      feedback = "Coach Maya here! Notice a key rule in programming: The 'if' block requires a condition (Left Side, Right Side, Operators), but 'else' is a catch-all branch that does NOT take any condition (no Left Side, Right Side, or Operators)! When 'if' is false, 'else' runs automatically. Please remove the condition parts from Step 4 and only specify: `Step 4: Inside 'else' block: print(\"Not a 3-digit number\")`.";
      correction = `Step 4: Inside 'else' block: print("Not a 3-digit number")`;
      suggestedInput = `Step 4: Inside 'else' block: print("Not a 3-digit number")`;
    } else {
      feedback = "Coach Maya here! Almost there! Remember that while 'if' requires a condition (Left Side, Right Side, Operators), 'else' does NOT have any condition\u2014it automatically runs when 'if' is false! So for Step 4, you only need to define what executes inside the 'else' block: `Step 4: Inside 'else' block: print(\"Not a 3-digit number\")`.";
      correction = `Step 4: Inside 'else' block: print("Not a 3-digit number")`;
      suggestedInput = `Step 4: Inside 'else' block: print("Not a 3-digit number")`;
    }
  }
  return {
    isFullyVerified,
    ingredientsStepProgress: steps,
    matchedFirebaseInput: isFullyVerified ? `step 1: input variable ${detectedVar}
step 2: if condition with L.S: ${detectedVar}, Operators: >= and <=, R.S: 100 and 999, Logical Op: && (${detectedVar} >= 100 && ${detectedVar} <= 999)
step 3: inside if print 3-digit number
step 4: inside else print Not a 3-digit number` : void 0,
    feedback,
    correction,
    suggestedInput
  };
}
function validateThreeDigitSampleCode(text) {
  const norm = text.toLowerCase();
  const varMatch = text.match(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) || text.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:int\s*\(\s*)?input/i);
  const detectedVar = varMatch ? varMatch[1] : "a";
  const hasInputVar = /(?:var|let|const|int)?\s*(?:n|a|num|val|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\d+/i.test(text) || /(?:n|a|num|val|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:int\s*\(\s*)?input/i.test(text);
  const hasCondition = /if\s*\(?.*?(?:100|99).*?(?:999|1000)/i.test(text) && (/&&|and/i.test(text) || /100\s*<=\s*[a-zA-Z_]\w*\s*<=\s*999/.test(text)) || /if\s*\(?\s*[a-zA-Z_]\w*\s*>=\s*100\s*&&\s*[a-zA-Z_]\w*\s*<=\s*999\s*\)?/i.test(text) || /if\s+[a-zA-Z_]\w*\s*>=\s*100\s+and\s+[a-zA-Z_]\w*\s*<=\s*999/i.test(text);
  const hasQuotedPositivePrint = /(?:print|console\.log|printf|cout)\s*\(\s*["'`\u201c\u201d][^"'`\u201c\u201d\n]*(?:3[-\s]*digit|three\s*digit|yes)[^"'`\u201c\u201d\n]*["'`\u201c\u201d]\s*\)/i.test(text);
  const hasAnyPositivePrint = /(?:print|console\.log|printf|cout)\s*\(?.*?(?:3[-\s]*digit|three\s*digit|yes)/i.test(text);
  const hasUnquotedPositivePrint = hasAnyPositivePrint && !hasQuotedPositivePrint;
  const hasElseWithCondition = /\belse\s*\([^)]*\)/i.test(text);
  const hasElse = /else\b/i.test(text) && !hasElseWithCondition;
  const hasQuotedNegativePrint = /(?:print|console\.log|printf|cout)\s*\(\s*["'`\u201c\u201d][^"'`\u201c\u201d\n]*(?:not|no)[^"'`\u201c\u201d\n]*["'`\u201c\u201d]\s*\)/i.test(text);
  const hasAnyNegativePrint = /(?:print|console\.log|printf|cout)\s*\(?.*?(?:not|no)/i.test(text);
  const hasUnquotedNegativePrint = hasAnyNegativePrint && !hasQuotedNegativePrint;
  const allVerified = hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && hasQuotedNegativePrint;
  const steps = [
    { stepNumber: 1, title: `Step 1: Declare input variable (var ${detectedVar} = 150)`, completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: `Step 2: Check condition if (${detectedVar} >= 100 && ${detectedVar} <= 999)`, completed: hasCondition, current: hasInputVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Print "3-digit number" (with quotes) if true', completed: hasQuotedPositivePrint, current: hasInputVar && hasCondition && !hasQuotedPositivePrint },
    { stepNumber: 4, title: "Step 4: Else branch", completed: hasElse, current: hasInputVar && hasCondition && hasQuotedPositivePrint && !hasElse },
    { stepNumber: 5, title: 'Step 5: Print "Not a 3-digit number" (with quotes) if false', completed: hasQuotedNegativePrint, current: hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && !hasQuotedNegativePrint }
  ];
  if (allVerified) {
    const allDone = steps.map((s) => ({ ...s, completed: true, current: false }));
    return {
      allVerified: true,
      hasInputVar,
      hasCondition,
      hasPositivePrint: hasQuotedPositivePrint,
      hasElse,
      hasNegativePrint: hasQuotedNegativePrint,
      matchedFirebaseInput: `var ${detectedVar} = 150; if (${detectedVar} >= 100 && ${detectedVar} <= 999) print("3-digit number"); else print("Not a 3-digit number");`,
      feedback: "\u{1F31F} Coach Maya here! You gotcha! \u{1F389} Outstanding prototype! You have successfully implemented the 3-digit number checker with compound logical conditions, proper quotation marks, and clean branching. You are ready to run and test!",
      sampleCodeStepProgress: allDone,
      correction: "Sample code prototype completed!",
      suggestedInput: void 0
    };
  }
  let feedback = void 0;
  let correction = void 0;
  let suggestedInput = void 0;
  if (!hasInputVar) {
    feedback = `Coach Maya here! Let's start with Step 1 of our sample code: Declare an input variable with a test number (e.g. \`var ${detectedVar} = 150;\` or \`${detectedVar} = 456\`).`;
    correction = `var ${detectedVar} = 150;`;
    suggestedInput = `var ${detectedVar} = 150;`;
  } else if (!hasCondition) {
    feedback = `Coach Maya here! Great start with variable \`${detectedVar}\`! For Step 2: Check if \`${detectedVar}\` is a 3-digit number using: \`if (${detectedVar} >= 100 && ${detectedVar} <= 999) {\`.`;
    correction = `if (${detectedVar} >= 100 && ${detectedVar} <= 999) {`;
    suggestedInput = `if (${detectedVar} >= 100 && ${detectedVar} <= 999) {`;
  } else if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      feedback = `Coach Maya here! You wrote the print statement, but notice that in programming text messages must be wrapped in quotation marks: \`print("3-digit number")\`. Without quotes, the compiler treats words like variable names and throws a syntax error!`;
      correction = `  print("3-digit number");
}`;
      suggestedInput = `  print("3-digit number");
}`;
    } else {
      feedback = `Coach Maya here! Great job with the condition! Now for Step 3: Add the action inside the if block to display: \`print("3-digit number");\`.`;
      correction = `  print("3-digit number");
}`;
      suggestedInput = `  print("3-digit number");
}`;
    }
  } else if (!hasElse) {
    feedback = `Coach Maya here! You've got the condition and the true branch! Now for Step 4: Add the \`else\` branch to handle numbers that are outside the 3-digit range: \`else {\`.`;
    correction = `else {
  print("Not a 3-digit number");
}`;
    suggestedInput = `else {
  print("Not a 3-digit number");
}`;
  } else if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      feedback = `Coach Maya here! You're almost there! Inside the \`else\` block, make sure to wrap your message in quotation marks: \`print("Not a 3-digit number")\`.`;
      correction = `  print("Not a 3-digit number");
}`;
      suggestedInput = `  print("Not a 3-digit number");
}`;
    } else {
      feedback = `Coach Maya here! You added the \`else\` branch! Now for Step 5: Inside the else block, print the message: \`print("Not a 3-digit number");\`.`;
      correction = `  print("Not a 3-digit number");
}`;
      suggestedInput = `  print("Not a 3-digit number");
}`;
    }
  }
  return {
    allVerified: false,
    hasInputVar,
    hasCondition,
    hasPositivePrint: hasQuotedPositivePrint,
    hasElse,
    hasNegativePrint: hasQuotedNegativePrint,
    sampleCodeStepProgress: steps,
    feedback,
    correction,
    suggestedInput
  };
}
export {
  validateThreeDigitIngredients,
  validateThreeDigitLogic,
  validateThreeDigitRecipe,
  validateThreeDigitSampleCode
};
