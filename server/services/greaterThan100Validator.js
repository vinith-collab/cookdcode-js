function validateGreaterThan100Logic(text) {
  const rawComparisonMatches = Array.from(text.matchAll(/(\d+)\s*(>=|<=|>|<|==|!=|=)\s*(\d+)/g));
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
    if (!isMathFactTrue) {
      return {
        isFullyVerified: false,
        hasBoundaryContradiction: true,
        feedback: `\u{1F31F} Coach Maya gentle check: Look closely at your mathematical comparison \`${left} ${op} ${right}\`! ${left} is ${left > right ? "greater than" : "less than"} ${right}, so \`${left} ${op} ${right}\` is mathematically false! For number ${left}, write \`${left} ${left > right ? ">" : "<="} ${right}\`.`,
        correction: `For number ${left}: write \`${left} ${left > right ? ">" : "<="} ${right}\` (${left > 100 ? "Greater than 100" : "Not Greater than 100"}).`,
        suggestedInput: `If num > 100 (e.g. 150 > 100 -> true) -> Greater than 100. If num <= 100 (e.g. 80 <= 100 -> true) -> Not Greater than 100.`,
        matchedFirebaseInput: "if number is greater than 100 then display greater than 100"
      };
    }
  }
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/[^\S\r\n]+/g, " ").trim();
  const has100Concept = norm.includes("100") || norm.includes("hundred") || norm.includes("one hundred");
  const hasNumberConcept = norm.includes("number") || norm.includes("num") || norm.includes("input") || norm.includes("digit") || norm.includes("value");
  const hasGreaterThanOperator = /\b(?:greater|greatest|more|exceeds|larger|above|higher|bigger)\b/i.test(norm) || />\s*100/i.test(norm) || norm.includes("compare");
  const textWithoutConcreteExamples = norm.replace(/\b(?:eg|example|e\.g)\s*[:=]?\s*[0-9]+(?:\s*,\s*[0-9]+)*/gi, " ").replace(/\b[0-9]+\s+(?:is\s+)?(?:greater|greatest|more|bigger|biggest|larger|largest|above|higher|less|lesser|least|smaller|smallest|lower|lowest|below|under|equal\s+to)\s+(?:than\s+|to\s+)?100\b/gi, " ").replace(/\s+/g, " ");
  const textWithoutNegations = textWithoutConcreteExamples.replace(/\b(?:not|never|no|cannot|cant|can't)\s+(?:greater|greatest|more|larger|above|higher|exceed|bigger)\b/gi, " ").replace(/\s+/g, " ");
  const hasPositiveOutcome = /\b(?:greater|greatest|more|larger|largest|above|exceeds|bigger|biggest|higher|highest)\b/i.test(textWithoutNegations);
  const hasNegativeOutcome = /\b(?:not\s+greater|not\s+greatest|not\s+more|not\s+above|not\s+exceed|not\s+large|not\s+larger|not\s+largest|not\s+bigger|not\s+biggest|not\s+higher|not\s+highest)\b/i.test(textWithoutConcreteExamples) || /\b(?:is\s+|called\s+(?:as\s+)?|say\s+|output\s+|result\s+is\s+|conclude\s+|show\s+|display\s+)(?:less|lesser|least|lowest|lower|smaller|smallest|below|under|not\s+greater|not\s+greatest|not\s+bigger|not\s+more)\b/i.test(textWithoutConcreteExamples) || hasPositiveOutcome && /\b(?:otherwise|else)\b/i.test(textWithoutConcreteExamples) || /\b(?:when|if|whenever)\s+(?:a\s+)?(?:number|num|value|input)?\s*(?:is\s*)?(?:less|lesser|least|smaller|smallest|lower|lowest|below|under|100\s*or\s*less)\s*(?:than\s*100)?.*?(?:called|say|consider|output|result|is|show|display|then)\s*(?:as\s*)?(?:not\s*greatest|not\s*greater|not\s*bigger|not\s*more|less|lesser|least|lowest|lower|smaller|smallest|not)/i.test(textWithoutConcreteExamples) || /\b(?:called\s+as\s+lowest|called\s+as\s+least|called\s+as\s+smaller|called\s+as\s+lesser|called\s+as\s+less|called\s+as\s+not\s+greater)\b/i.test(textWithoutConcreteExamples);
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const clauses = [];
  for (const line of rawLines) {
    const parts = line.split(/[;\.]|\b(?:but|however|else|otherwise|whereas|while|then)\b/i);
    for (const p of parts) {
      const cleanP = p.trim().toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ");
      if (cleanP) clauses.push(cleanP);
    }
  }
  let claimsUnder100IsGreater = false;
  let claimsOver100IsNotGreater = false;
  let claims100IsGreater = false;
  const concreteGreaterMatches = text.matchAll(/\b([0-9]+)\s+(?:is\s+)?(?:greater|greatest|more|bigger|larger|above|higher)\s+than\s+100\b/gi);
  for (const m of concreteGreaterMatches) {
    const val = parseInt(m[1], 10);
    if (val <= 100) {
      claimsUnder100IsGreater = true;
    }
  }
  const concreteLessMatches = text.matchAll(/\b([0-9]+)\s+(?:is\s+)?(?:less|smaller|below|under)\s+than\s+100\b/gi);
  for (const m of concreteLessMatches) {
    const val = parseInt(m[1], 10);
    if (val > 100) {
      claimsOver100IsNotGreater = true;
    }
  }
  if (/\b(?:exactly\s*100|equal\s*to\s*100)\s*(?:is\s*)?(?:greater|greatest|more)\b/i.test(norm) || /\b100\s+is\s+(?:greater|greatest|more|larger)\s+than\s+100\b/i.test(norm) || /\bif\s+(?:the\s*)?(?:number|num|value|it)?\s*(?:is\s*)?100\s*(?:it\s*is\s*|is\s*)?(?:greater|greatest|more)\b(?! than)/i.test(norm)) {
    if (!norm.includes("not greater") && !norm.includes("not more") && !norm.includes("not greatest")) {
      claims100IsGreater = true;
    }
  }
  for (const clause of clauses) {
    const underMatch = clause.match(/(?:<=\s*100|<\s*100|\bless\s*than\s*100\b|\blesser\s*than\s*100\b|\bbelow\s*100\b|\bunder\s*100\b|\b100\s*or\s*less\b|\bsmaller\s*than\s*100\b)(.*)/i);
    if (underMatch) {
      const outcome = underMatch[1].trim();
      if (outcome.length > 0) {
        const hasGreaterWord = /\b(?:is\s+)?(?:called\s+(?:as\s+)?)?(?:greater|greatest|more|larger|above|higher|exceeds|bigger)\b/i.test(outcome);
        const hasNegation = /\b(?:not|never|no|cant|cannot|can't)\b/i.test(outcome);
        const hasNotGreater = /\b(?:not\s+greater|not\s+more|not\s+larger|not\s+greatest|not\s+bigger|less|lesser|least|lowest|lower|smaller|below)\b/i.test(outcome);
        if (hasGreaterWord && !hasNegation && !hasNotGreater) {
          claimsUnder100IsGreater = true;
        }
      }
    }
    if (/\b(?:is\s+)?(?:greater|greatest|more|larger|bigger)\s*(?:if|when)?\s*(?:<=\s*100|<\s*100|less\s*than\s*100|lesser\s*than\s*100|below\s*100|under\s*100)/i.test(clause)) {
      if (!/\b(?:not\s+greater|not\s+more|not\s+greatest|not\s+bigger)\b/i.test(clause)) {
        claimsUnder100IsGreater = true;
      }
    }
    const overMatch = clause.match(/(?:>\s*100|\bgreater\s*than\s*100\b|\bmore\s*than\s*100\b|\babove\s*100\b|\bexceeds\s*100\b|\blarger\s*than\s*100\b|\bbigger\s*than\s*100\b)(.*)/i);
    if (overMatch) {
      const outcome = overMatch[1].trim();
      if (outcome.length > 0) {
        const hasNotGreater = /\b(?:not\s+greater|not\s+more|not\s+larger|not\s+greatest|not\s+bigger|less|smaller|below)\b/i.test(outcome) || /\bnot\b/i.test(outcome);
        if (hasNotGreater) {
          claimsOver100IsNotGreater = true;
        }
      }
    }
    if (/\b(?:not\s*greater|less|smaller)\s*(?:if|when)?\s*(?:>\s*100|greater\s*than\s*100|above\s*100|more\s*than\s*100|bigger\s*than\s*100)/i.test(clause)) {
      claimsOver100IsNotGreater = true;
    }
  }
  const hasCodeKeywords = /\b(?:var|let|const|int|float|string|def|function|print\s*\(|console\.log|printf|echo|if\s*\(|else\s*\{|syntax|L\.S|R\.S|&&|\|\||==)\b/i.test(text);
  const isQuestion = /\b(?:what|how|why|where|explain|clarify|mean|doubt|help|puriyala)\b/i.test(text) || text.trim().endsWith("?");
  const isFullyVerified = !isQuestion && has100Concept && hasGreaterThanOperator && hasPositiveOutcome && hasNegativeOutcome && !claimsUnder100IsGreater && !claimsOver100IsNotGreater && !claims100IsGreater && !hasCodeKeywords;
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (claimsUnder100IsGreater) {
    feedback = "\u{1F31F} Coach Maya logic alert: Look closely at your condition! A number less than 100 (like 50 or 80) is NOT greater than 100. A number is only greater when it is strictly more than 100 (like 101, 120, 200).";
    correction = "If number is greater than 100 it is Greater, otherwise Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else if (claimsOver100IsNotGreater) {
    feedback = "\u{1F31F} Coach Maya logic alert: A number greater than 100 (like 105 or 150) is Greater than 100! Check your outputs so that numbers over 100 say 'Greater' and numbers 100 or below say 'Not Greater'.";
    correction = "If number is greater than 100 it is Greater, else Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else if (claims100IsGreater) {
    feedback = "\u{1F31F} Coach Maya boundary alert: Look closely at the number 100! 100 is EQUAL to 100, so it is NOT greater than 100! Strictly greater than 100 starts from 101.";
    correction = "If number is greater than 100 it is Greater, otherwise Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "what if number is 100";
  } else if (hasCodeKeywords) {
    feedback = "Coach Maya here! You are thinking in programming syntax, which is wonderful! But here in Stage 1 (Logic), explain the rule in everyday words without code like 'var', 'if(...)', or 'print'. How would you explain 'greater than 100' to a friend?";
    correction = "If a number is greater than 100 it is Greater, otherwise Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else if (isFullyVerified) {
    feedback = "\u{1F31F} Coach Maya here! Spot on! \u{1F389} If number is greater than 100 -> Greater, otherwise Not Greater. You've clearly mastered the real-world logic! Proceed to the Recipe stage to sequence the steps in everyday words.";
    correction = "Proceed to the Recipe stage.";
    suggestedInput = void 0;
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else if (isQuestion) {
    if (norm.includes("100") && (norm.includes("what if") || norm.includes("equal") || norm.includes("exactly"))) {
      feedback = "If the number is exactly 100, it is NOT greater than 100! 100 is equal to 100. Strictly greater than 100 means 101 or more.";
      correction = "If number is greater than 100 it is Greater, else Not Greater.";
      suggestedInput = "if number is greater than 100 it is greater else not greater";
      matchedFirebaseInput = "what if number is 100";
    } else {
      feedback = "Take a number and compare it with 100 using the greater than operator (>). If number is greater than 100 it is Greater, otherwise Not Greater.";
      correction = "Compare the number with 100 using operator >.";
      suggestedInput = "if number is greater than 100 it is greater else not greater";
      matchedFirebaseInput = "how to check if number is greater than 100";
    }
  } else if (!has100Concept) {
    feedback = "Coach Maya here! What benchmark number are we comparing against? Mention 100 in your logic!";
    correction = "If number is greater than 100 it is Greater, else Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "how to check if number is greater than 100";
  } else if (!hasPositiveOutcome) {
    feedback = "Coach Maya here! State the positive outcome clearly: What should we conclude if the number is greater than 100?";
    correction = "If number is greater than 100 it is Greater, else Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else if (!hasNegativeOutcome) {
    feedback = "Coach Maya here! You've defined what to call a number when it is greater than 100! \u{1F44F} Now complete the logic: What should we call it when the number is 100 or less (or otherwise)? Define the second outcome (e.g., 'otherwise it is called as not greatest') so both cases are covered!";
    correction = "Define the second outcome: what happens when the number is 100 or less (e.g., otherwise it is not greatest).";
    suggestedInput = "When a number is greater than 100 it is called as greatest, otherwise it is not greatest";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  } else {
    feedback = "Coach Maya here! To complete Stage 1, state the logic: If a number is greater than 100 it is Greater, otherwise Not Greater.";
    correction = "If number is greater than 100 it is Greater, else Not Greater.";
    suggestedInput = "if number is greater than 100 it is greater else not greater";
    matchedFirebaseInput = "if number is greater than 100 it is greater else not greater";
  }
  return {
    isFullyVerified,
    hasNumberConcept,
    has100Concept,
    hasGreaterThanOperator,
    hasPositiveOutcome,
    hasNegativeOutcome,
    claimsUnder100IsGreater,
    claimsOver100IsNotGreater,
    claims100IsGreater,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateGreaterThan100Recipe(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ").trim();
  const hasInputStep = norm.includes("input") || norm.includes("get num") || norm.includes("read num") || norm.includes("take num") || norm.includes("enter num") || norm.includes("get number") || norm.includes("read number") || norm.includes("take number") || norm.includes("step 1");
  const hasConditionStep = norm.includes("greater than 100") || norm.includes("more than 100") || norm.includes("above 100") || norm.includes("exceeds 100") || norm.includes("num > 100") || norm.includes("number > 100") || norm.includes("> 100");
  const textWithoutNegations = norm.replace(/\b(?:not|never|cannot)\s+greater\b/g, " ").replace(/\s+/g, " ");
  const hasTrueOutput = /\b(?:display\s+|print\s+|show\s+|called\s+(?:as\s+)?(?:the\s+)?|is\s+)?(?:greater|greatest|bigger|above)\b/i.test(textWithoutNegations);
  const hasFalseOutput = /\b(?:not\s+greater|not\s+greatest|not\s+bigger|not\s+more|lowest|least|otherwise|else)\b/i.test(norm) || /\b(?:display|print|show|called\s+(?:as\s+)?(?:the\s+)?|say|announce|output)\s+(?:not\s+greater|not\s+greatest|not\s+bigger|less|lesser|least|lowest|smaller)\b/i.test(norm);
  let hasRecipeUnder100GreaterContradiction = false;
  let hasRecipeOver100NotGreaterContradiction = false;
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const clauses = [];
  for (const line of rawLines) {
    const parts = line.split(/[;\.]|\b(?:but|however|while|then|and)\b/i);
    for (const p of parts) {
      if (p.trim()) clauses.push(p.trim().toLowerCase());
    }
  }
  for (const c of clauses) {
    const isUnder = /(?:<=\s*100|<\s*100|\bless(?:er)?\s*than\s*100\b|\bbelow\s*100\b|\bunder\s*100\b|\b100\s*or\s*less\b|\bsmaller\s*than\s*100\b)/i.test(c);
    if (isUnder) {
      const hasNegationOfGreater = /\b(?:not\s+greatest|not\s+greater|not\s+bigger|lowest|least|smaller)\b/i.test(c);
      const hasPositiveGreater = /\b(?:is\s+|called\s+(?:as\s+)?(?:the\s+)?|display\s+|print\s+|show\s+|say\s+)?(?:the\s+)?(?:greater|greatest|bigger)\b(?! than 100)/i.test(c);
      if (hasPositiveGreater && !hasNegationOfGreater) {
        hasRecipeUnder100GreaterContradiction = true;
      }
    }
    const isOver = /(?:>\s*100|\bgreater\s*than\s*100\b|\bmore\s*than\s*100\b|\babove\s*100\b|\bbigger\s*than\s*100\b)/i.test(c);
    if (isOver) {
      const hasNegativeOutcome = /\b(?:not\s+greater|not\s+greatest|not\s+bigger|lowest|least)\b/i.test(c);
      if (hasNegativeOutcome && !c.includes("else") && !c.includes("otherwise")) {
        hasRecipeOver100NotGreaterContradiction = true;
      }
    }
  }
  const hasRecipeContradiction = hasRecipeUnder100GreaterContradiction || hasRecipeOver100NotGreaterContradiction;
  const isFullyVerified = hasInputStep && hasConditionStep && hasTrueOutput && hasFalseOutput && !hasRecipeContradiction;
  const steps = [
    { stepNumber: 1, title: "Step 1: Get number input", completed: hasInputStep, current: !hasInputStep },
    {
      stepNumber: 2,
      title: "Step 2: If number > 100 display Greater than 100, else display Not greater than 100",
      completed: hasConditionStep && hasTrueOutput && hasFalseOutput && !hasRecipeContradiction,
      current: hasInputStep && (!hasConditionStep || !hasTrueOutput || !hasFalseOutput || hasRecipeContradiction)
    }
  ];
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasRecipeUnder100GreaterContradiction) {
    feedback = "\u{1F31F} Coach Maya logic alert: Look closely at your step for numbers lesser than 100! If a number is less than 100 (like 10, 50, or 80), it cannot be called 'the greatest'. For numbers lesser than 100, it should be called 'lowest' or 'Not greater than 100'.";
    correction = "step 3: if that number is lesser than 100 it is called as the lowest";
    suggestedInput = "step 3: if that number is lesser than 100 it is called as the lowest";
    matchedFirebaseInput = "step 3:if that number is lesser than 100 it is called as the greatest";
  } else if (hasRecipeOver100NotGreaterContradiction) {
    feedback = "\u{1F31F} Coach Maya logic alert: Check your step for numbers greater than 100! If a number is greater than 100, it is 'greatest' or 'Greater than 100', not lowest.";
    correction = "step 2: if number is greater than 100 it is called as greatest";
    suggestedInput = "step 2: if number is greater than 100 it is called as greatest";
    matchedFirebaseInput = "step 2:if number is greater than 100 it is called as lowest";
  } else if (hasRecipeContradiction) {
    feedback = "\u{1F31F} Coach Maya logic alert: In your Recipe, check your outputs! If number > 100, display 'Greater than 100'; otherwise display 'Not greater than 100'.";
    correction = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    suggestedInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    matchedFirebaseInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
  } else if (isFullyVerified) {
    feedback = "\u{1F31F} Coach Maya here! Kudos! \u{1F389} Complete step-by-step algorithm in clear everyday words: Step 1 gets the number, and Step 2 checks if number is greater than 100 to display Greater or Not Greater. Proceed to the Ingredients stage!";
    correction = "step 1 : Get number input\nstep 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    suggestedInput = "step 1 : Get number input\nstep 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    matchedFirebaseInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
  } else if (!hasInputStep) {
    feedback = "Coach Maya here! Let's write our recipe starting with Step 1: How do we take the number as input?";
    correction = "step 1 : Get number input";
    suggestedInput = "step 1 : Get number input";
    matchedFirebaseInput = "step 1 : Get number input";
  } else if (!hasConditionStep) {
    feedback = "Great! Step 1 is done! Now for Step 2: What condition tests whether the number is greater than 100?";
    correction = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    suggestedInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    matchedFirebaseInput = "step 1 : Get number input";
  } else if (!hasTrueOutput || !hasFalseOutput) {
    feedback = "Almost complete! In Step 2, be sure to state both outcomes: what to display if number > 100, and what to display otherwise.";
    correction = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    suggestedInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    matchedFirebaseInput = "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
  } else {
    feedback = "Coach Maya here! Write the 2-step recipe:\nStep 1: Get number input.\nStep 2: If number > 100 display Greater than 100, else display Not greater than 100.";
    correction = "step 1 : Get number input\nstep 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    suggestedInput = "step 1 : Get number input\nstep 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100";
    matchedFirebaseInput = "what steps to write";
  }
  return {
    isFullyVerified,
    hasRecipeContradiction,
    recipeStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateGreaterThan100Ingredients(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&:"'\(\)]/g, " ").replace(/\s+/g, " ").trim();
  const hasVarDeclaration = /\b(?:num|number|n|val|value|[a-z])\b/i.test(norm) && /\b(?:var|variable|input|let|integer|val|step\s*1|use|take|get|declare)\b/i.test(norm) || /\b(?:num|number|n|[a-z])\s*=\s*\d+/i.test(text);
  const hasLeftSide = /\b(?:l\.?s|left\s*side)\s*[:=]?\s*(?:num|number|n|val|value|[a-z0-9_]+)\b/i.test(norm) || /\b(?:num|number|n)\b/i.test(norm) || /\b(?:l\.?s|left\s*side)\b/i.test(norm);
  const rightSideMatch = /(?:r\.?s|right\s*side)\s*[:=]?\s*(\d+)/i.exec(text) || /(?:>|<|>=|<=|==)\s*(\d+)/i.exec(text);
  const parsedRightSideNum = rightSideMatch ? rightSideMatch[1] : null;
  const hasWrongRightSide = parsedRightSideNum !== null && parsedRightSideNum !== "100";
  const hasExact100 = (/\b(?:r\.?s|right\s*side)\s*[:=]?\s*100\b/i.test(norm) || /\b(?:num|number|n|[a-z0-9_]+)\s*>\s*100\b/i.test(text) || /\b100\b/.test(norm)) && !hasWrongRightSide;
  const hasRightSide = hasExact100;
  const operatorMatch = /\b(?:operator|op)\s*[:=]?\s*([<>=!]+|greater\s*than|less\s*than)/i.exec(norm);
  const parsedOp = operatorMatch ? operatorMatch[1].trim() : null;
  const hasWrongOperator = parsedOp !== null && (parsedOp === "<" || parsedOp === "<=" || parsedOp === "less than" || parsedOp === "less");
  const hasGreaterThanOperator = !hasWrongOperator && (/\b(?:operator|op)\s*[:=]?\s*(?:>|greater(?:\s*than)?)\b/i.test(norm) || /\b(?:operator|op)\b/i.test(norm) || />/.test(text) || norm.includes("greater than"));
  const hasInvertedIfPrint = /(?:in\s+if|inside\s+if|if\s+block|step\s*3).*?\b(?:not\s*greatest|not\s*greater|lowest|least)\b/i.test(text) || /\bif\b.*?\bprint\s*\(?["']?(?:not\s*greatest|not\s*greater|lowest|least)["']?\)?/i.test(text);
  const hasUnquotedPositivePrint = /print\s*\(\s*(?:greater\s*than\s*100|greater|greatest)\s*\)/i.test(text) || /\bprint\s+(?!["'`\(\s])(?:greater\s*than\s*100|greater|greatest)\b/i.test(text);
  const hasUnquotedNegativePrint = /print\s*\(\s*(?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least)\s*\)/i.test(text) || /\bprint\s+(?!["'`\(\s])(?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least)\b/i.test(text);
  const hasUnquotedPrint = hasUnquotedPositivePrint || hasUnquotedNegativePrint;
  const hasQuotedPositivePrint = /print\s*\(\s*["'](?:greater\s*than\s*100|greater|greatest|yes)["']\s*\)/i.test(text) || /\bprint\s*["'](?:greater\s*than\s*100|greater|greatest)["']/i.test(text);
  const hasQuotedNegativePrint = /print\s*\(\s*["'](?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least|no)["']\s*\)/i.test(text) || /\bprint\s*["'](?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least)["']/i.test(text);
  const hasCondition = hasLeftSide && hasRightSide && hasGreaterThanOperator || /if\s*\(\s*(?:num|number|n|[a-z0-9_]+)\s*>\s*100\s*\)/i.test(text) || /\b(?:num|number|n|[a-z0-9_]+)\s*>\s*100\b/i.test(text);
  function hasTrueOutputMention(s) {
    if (/\bnot\s*(?:greatest|greater)\b/i.test(s) && !/\b(?:print\s*\(?["']?(?:greater|greatest)["']?\)?.*(?:print|else))/i.test(s)) {
      return false;
    }
    return /\bprint\b/i.test(s) && (/\bgreater\b/i.test(s) || /\bgreatest\b/i.test(s));
  }
  function hasFalseOutputMention(s) {
    const hasElseContext = /\b(?:else|otherwise|step\s*4|false\s*block)\b/i.test(s);
    const mentionsNegative = /\b(?:not\s*greater|not\s*greatest|lowest|least)\b/i.test(s);
    return /\bprint\b/i.test(s) && mentionsNegative && hasElseContext;
  }
  const isStep1Done = hasVarDeclaration;
  const isStep2Done = hasCondition;
  const isStep3Done = !hasInvertedIfPrint && (hasQuotedPositivePrint || hasTrueOutputMention(norm) && !hasUnquotedPositivePrint);
  const isStep4Done = hasQuotedNegativePrint || hasFalseOutputMention(norm) && !hasUnquotedNegativePrint;
  const hasOutputs = isStep3Done && isStep4Done;
  const isFullyVerified = isStep1Done && isStep2Done && isStep3Done && isStep4Done && !hasInvertedIfPrint && !hasUnquotedPrint;
  const isAskingNext = /\b(?:what(?:\s+is)?(?:\s+the)?\s+next(?:\s+step)?|next\s+step|what\s+next|next\s+enna)\b/i.test(text);
  const steps = [
    { stepNumber: 1, title: "Step 1: Input variable (num / n)", completed: isStep1Done, current: !isStep1Done },
    { stepNumber: 2, title: "Step 2: If condition (L.S: num, Operator: >, R.S: 100)", completed: isStep2Done, current: isStep1Done && !isStep2Done },
    { stepNumber: 3, title: 'Step 3: Inside if block: print("Greater than 100")', completed: isStep3Done, current: isStep1Done && isStep2Done && !isStep3Done },
    { stepNumber: 4, title: 'Step 4: Inside else block: print("Not greater than 100")', completed: isStep4Done, current: isStep1Done && isStep2Done && isStep3Done && !isStep4Done }
  ];
  const varMatch = /step\s*1\s*:\s*(?:use\s+)?([a-z0-9_]+)\s*variable/i.exec(text) || /\bvar\s+([a-z0-9_]+)/i.exec(text) || /\b([a-z0-9_]+)\s*variable\b/i.exec(text);
  const detectedVar = varMatch?.[1] || (/\bn\b/i.test(text) ? "n" : "num");
  const isAskingHowToWriteCondition = /\b(?:how\s+to|how\s+do|don'?t\s*know|did\s*not\s*know|puriyala|theriyala|explain|help)\b/i.test(text);
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasInvertedIfPrint) {
    feedback = `\u{1F31F} Coach Maya alert: Take a closer look at Step 3! Inside the 'if' block (when condition ${detectedVar} > 100 is true), the number is greater than 100! So you should print: print("Greater than 100") (or print("greatest")). Printing 'not greatest' belongs in the 'else' block (Step 4)! Update Step 3 to: print("Greater than 100").`;
    correction = 'step 3 : Inside if block: print("Greater than 100")';
    suggestedInput = 'step 3 : Inside if block: print("Greater than 100")';
    matchedFirebaseInput = "what is next step after if condition";
  } else if (hasUnquotedPrint) {
    feedback = 'Coach Maya syntax alert: Wrap the text inside print in quotation marks: `print("Greater than 100")` and `print("Not greater than 100")`. Without quotes, JavaScript treats it as an undeclared variable!';
    correction = 'print("Greater than 100");';
    suggestedInput = 'step 3 : Inside if block: print("Greater than 100")\nstep 4 : Inside else block: print("Not greater than 100")';
    matchedFirebaseInput = "how to write if condition";
  } else if (isFullyVerified) {
    feedback = `\u{1F31F} Coach Maya here! Hurray! \u{1F389} All ingredients identified: input variable '${detectedVar}', if-condition, and quoted print statements. Proceed to Sample Code!`;
    correction = `step 1 : ${detectedVar} variable
step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >
step 3 : Inside if block: print("Greater than 100")
step 4 : Inside else block: print("Not greater than 100")`;
    suggestedInput = void 0;
    matchedFirebaseInput = "step 2 : If condition with L.S: num, R.S: 100, Operator: >";
  } else if (!isStep1Done) {
    feedback = "\u{1F31F} Coach Maya here! Let's identify our ingredients starting with Step 1: What variable holds the input number?";
    correction = "step 1 : num variable";
    suggestedInput = "step 1 : num variable";
    matchedFirebaseInput = "step 1 : num variable";
  } else if (!isStep2Done) {
    if (hasWrongRightSide) {
      feedback = `\u{1F31F} Coach Maya alert: Take a closer look at your Right Side (R.S)! You wrote ${parsedRightSideNum}, but our problem specifically checks whether the number is greater than 100, not ${parsedRightSideNum}! Change Right Side to 100:

\u2022 Left Side (L.S): ${detectedVar}
\u2022 Operator: >
\u2022 Right Side (R.S): 100`;
    } else if (hasWrongOperator) {
      feedback = `\u{1F31F} Coach Maya alert: Take a closer look at your Operator! You used '${parsedOp}', but our challenge is to check if the number is GREATER than 100! Please use the greater-than operator (>):

\u2022 Left Side (L.S): ${detectedVar}
\u2022 Operator: >
\u2022 Right Side (R.S): 100`;
    } else if (isAskingHowToWriteCondition) {
      feedback = `\u{1F31F} Coach Maya here! No worries at all\u2014writing an \`if\` condition is super easy when we break it down into 3 simple pieces!

Since you chose variable '${detectedVar}', we compare it against 100:
\u2022 Left Side (L.S): ${detectedVar} (your input number)
\u2022 Operator: > (greater than)
\u2022 Right Side (R.S): 100 (the comparison threshold)

In your Ingredients worksheet, write:
step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >`;
    } else {
      feedback = `\u{1F31F} Coach Maya here! Great start with variable '${detectedVar}'! Now, how do you write the if-condition to check if '${detectedVar}' is greater than 100 using Left Side (L.S), Right Side (R.S), and Operator (>)?`;
    }
    correction = `step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >`;
    suggestedInput = `step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >`;
    matchedFirebaseInput = "how to write if condition";
  } else if (!isStep3Done) {
    feedback = isAskingNext ? `\u{1F31F} Coach Maya here! You've already got your variable '${detectedVar}' and your condition (${detectedVar} > 100) set up! For your NEXT step (Step 3): Inside the \`if\` block, what print statement runs when the condition is true? Remember quotation marks: \`print("Greater than 100")\` (or \`print("greatest")\`).` : `\u{1F31F} Coach Maya here! Inside the \`if\` block, what print statement runs when the condition is true? Remember quotation marks: \`print("Greater than 100")\` (or \`print("greatest")\`).`;
    correction = 'step 3 : Inside if block: print("Greater than 100")';
    suggestedInput = 'step 3 : Inside if block: print("Greater than 100")';
    matchedFirebaseInput = "what is next step after if condition";
  } else if (!isStep4Done) {
    feedback = isAskingNext ? `\u{1F31F} Coach Maya here! Great progress! You've set up your condition and your positive print statement! For your NEXT step (Step 4): Inside the \`else\` block, what print statement runs when the number is not greater than 100? Remember quotation marks: \`print("Not greater than 100")\` (or \`print("lowest")\`).` : `Coach Maya here! Almost there! Inside the \`else\` block, what print statement runs when the number is not greater than 100? Remember quotation marks: \`print("Not greater than 100")\`.`;
    correction = 'step 4 : Inside else block: print("Not greater than 100")';
    suggestedInput = 'step 4 : Inside else block: print("Not greater than 100")';
    matchedFirebaseInput = "what is next step after if condition";
  } else {
    feedback = `\u{1F31F} Coach Maya here! Ingredients needed:
1. Input variable: ${detectedVar}
2. Condition: L.S: ${detectedVar}, Operator: >, R.S: 100
3. True output: print("Greater than 100")
4. False output: print("Not greater than 100")`;
    correction = `step 1 : ${detectedVar} variable
step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >`;
    suggestedInput = `step 2 : If condition with L.S: ${detectedVar}, R.S: 100, Operator: >`;
    matchedFirebaseInput = "what ingredients do we need";
  }
  return {
    isFullyVerified,
    hasInvertedIfPrint,
    hasUnquotedPrint,
    hasWrongRightSide,
    ingredientsStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateGreaterThan100SampleCode(text) {
  const varMatch = text.match(/\b(?:var|let|const)\s+([a-zA-Z_]\w*)\s*=\s*\d+/i);
  const detectedVar = varMatch ? varMatch[1] : "num";
  const hasInputVar = new RegExp(`\\b(?:var|let|const)\\s+${detectedVar}\\s*=\\s*\\d+`, "i").test(text) || /\b(?:var|let|const)\s+(?:num|number|n|val)\s*=\s*\d+/i.test(text);
  const hasCondition = new RegExp(`\\bif\\s*\\(\\s*${detectedVar}\\s*>\\s*100\\s*\\)`, "i").test(text) || /\bif\s*\(\s*(?:num|number|n|[a-zA-Z_]\w*)\s*>\s*100\s*\)/i.test(text);
  const hasQuotedPositivePrint = /print\s*\(\s*["'](?:greater\s*than\s*100|greater|greatest|yes)["']\s*\)/i.test(text);
  const hasUnquotedPositivePrint = /print\s*\(\s*(?:greater\s*than\s*100|greater|greatest)\s*\)/i.test(text);
  const hasElse = /\belse\b/i.test(text);
  const hasQuotedNegativePrint = /print\s*\(\s*["'](?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least|no)["']\s*\)/i.test(text);
  const hasUnquotedNegativePrint = /print\s*\(\s*(?:not\s*greater\s*than\s*100|not\s*greater|not\s*greatest|lowest|least)\s*\)/i.test(text);
  const hasElseWithCondition = /\belse\s*\([^)]*\)/i.test(text);
  let hasInvertedBranches = false;
  const ifBlockMatch = text.match(/\bif\s*\([^)]*\)\s*\{?([^}]+)\}?/i);
  const elseBlockMatch = text.match(/\belse\s*\{?([^}]+)\}?/i);
  if (ifBlockMatch && elseBlockMatch) {
    const ifContent = ifBlockMatch[1];
    const elseContent = elseBlockMatch[1];
    const ifPrintsNotGreater = /print\s*\(\s*["']?(?:not\s*greater|no)/i.test(ifContent);
    const elsePrintsGreater = /print\s*\(\s*["']?(?:greater|yes)/i.test(elseContent) && !/not\s*greater/i.test(elseContent);
    if (ifPrintsNotGreater && elsePrintsGreater) {
      hasInvertedBranches = true;
    }
  }
  const allVerified = hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && hasQuotedNegativePrint && !hasElseWithCondition && !hasInvertedBranches;
  const steps = [
    { stepNumber: 1, title: "Step 1: Declare input variable (var num = 120;)", completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: "Step 2: Write if condition (if (num > 100))", completed: hasCondition, current: hasInputVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Print positive message (print("Greater than 100");)', completed: hasQuotedPositivePrint, current: hasInputVar && hasCondition && !hasQuotedPositivePrint },
    { stepNumber: 4, title: "Step 4: Add else branch (else {)", completed: hasElse && !hasElseWithCondition, current: hasInputVar && hasCondition && hasQuotedPositivePrint && (!hasElse || hasElseWithCondition) },
    { stepNumber: 5, title: 'Step 5: Print negative message (print("Not greater than 100");)', completed: hasQuotedNegativePrint, current: hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && !hasQuotedNegativePrint }
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
      hasElseWithCondition: false,
      hasInvertedBranches: false,
      matchedFirebaseInput: `var ${detectedVar} = 120; if (${detectedVar} > 100) print("Greater than 100"); else print("Not greater than 100");`,
      feedback: "\u{1F31F} Coach Maya here! You gotcha! \u{1F389} Spot on comparison code! You have successfully implemented greater than 100 checking with comparison operator >, proper quotation marks, and clean branching. You are ready to run and test!",
      sampleCodeStepProgress: allDone,
      correction: void 0,
      suggestedInput: void 0
    };
  }
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  if (hasInvertedBranches) {
    feedback = `\u{1F31F} Coach Maya logic alert: Look at your print statements! Inside your \`if (${detectedVar} > 100)\` block, you are printing 'Not greater'! When the condition is true, print 'Greater than 100'. In the \`else\` block, print 'Not greater than 100'.`;
    correction = `if (${detectedVar} > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`;
    suggestedInput = `if (${detectedVar} > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`;
  } else if (hasElseWithCondition) {
    feedback = `\u{1F31F} Coach Maya syntax alert: Look closely at your \`else\` statement: \`else(...)\`! In programming, the \`else\` keyword cannot take a condition or parentheses! It acts as the automatic fallback for all other numbers. Write it simply as \`else {\`.`;
    correction = `else {
  print("Not greater than 100");
}`;
    suggestedInput = `else {
  print("Not greater than 100");
}`;
  } else if (!hasInputVar) {
    feedback = `\u{1F31F} Coach Maya here! Ready to build our code prototype? Let's begin by declaring an input variable with a test number\u2014like \`var ${detectedVar} = 120;\`! How would you write that first line?`;
    correction = `var ${detectedVar} = 120;`;
    suggestedInput = `var ${detectedVar} = 120;`;
  } else if (!hasCondition) {
    feedback = `\u{1F31F} Coach Maya here! Great job setting up your variable \`${detectedVar}\`! Now let's test if it's greater than 100. How do you write an \`if\` statement using \`${detectedVar} > 100\`?`;
    correction = `if (${detectedVar} > 100) {
  print("Greater than 100");
}`;
    suggestedInput = `if (${detectedVar} > 100) {
  print("Greater than 100");
}`;
  } else if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      feedback = `\u{1F31F} Coach Maya syntax alert: You have the right print idea, but make sure to wrap your message in quotation marks like \`print("Greater than 100")\`! Without quotes, the computer searches for a variable named Greater!`;
      correction = 'print("Greater than 100");';
      suggestedInput = 'print("Greater than 100");';
    } else {
      feedback = `\u{1F31F} Coach Maya here! Wonderful condition! Now inside the \`if\` block, when \`${detectedVar} > 100\` is true, what message should we announce? Try: \`print("Greater than 100");\`.`;
      correction = 'print("Greater than 100");';
      suggestedInput = 'print("Greater than 100");';
    }
  } else if (!hasElse) {
    feedback = `\u{1F31F} Coach Maya here! You've got the positive branch ready! Now for Step 4: What keyword handles all other numbers 100 or below? Add the fallback branch: \`else {\`.`;
    correction = `else {
  print("Not greater than 100");
}`;
    suggestedInput = `else {
  print("Not greater than 100");
}`;
  } else if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      feedback = `\u{1F31F} Coach Maya syntax alert: Inside the \`else\` block, remember to wrap your display text in quotation marks: \`print("Not greater than 100")\`.`;
      correction = 'print("Not greater than 100");';
      suggestedInput = 'print("Not greater than 100");';
    } else {
      feedback = `\u{1F31F} Coach Maya here! You're right at the finish line! Inside your \`else\` block, what message should print when the number is not greater than 100? Try: \`print("Not greater than 100");\`.`;
      correction = 'print("Not greater than 100");';
      suggestedInput = 'print("Not greater than 100");';
    }
  } else {
    feedback = `\u{1F31F} Coach Maya here! Let's assemble our prototype code step by step using your variable \`${detectedVar}\`!`;
    correction = `var ${detectedVar} = 120;
if (${detectedVar} > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`;
    suggestedInput = `var ${detectedVar} = 120;
if (${detectedVar} > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`;
  }
  return {
    allVerified,
    hasInputVar,
    hasCondition,
    hasPositivePrint: hasQuotedPositivePrint,
    hasElse,
    hasNegativePrint: hasQuotedNegativePrint,
    hasElseWithCondition,
    hasInvertedBranches,
    sampleCodeStepProgress: steps,
    feedback,
    correction,
    suggestedInput
  };
}
export {
  validateGreaterThan100Ingredients,
  validateGreaterThan100Logic,
  validateGreaterThan100Recipe,
  validateGreaterThan100SampleCode
};
