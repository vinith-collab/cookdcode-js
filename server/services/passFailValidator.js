function validatePassFailLogic(text) {
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
        feedback: `\u{1F31F} Coach Maara gentle check: Look closely at your mathematical comparison \`${left} ${op} ${right}\`! ${left} is ${left > right ? "greater than" : "less than"} ${right}, so \`${left} ${op} ${right}\` is mathematically false! For mark ${left}, write \`${left} ${left >= right ? ">=" : "<"} ${right}\`.`,
        correction: `For mark ${left}: write \`${left} ${left >= right ? ">=" : "<"} ${right}\` (${left >= 35 ? "Pass" : "Fail"}).`,
        suggestedInput: `If mark >= 35 (e.g. 50 >= 35 -> true) -> Pass. If mark < 35 (e.g. 20 < 35 -> true) -> Fail.`,
        matchedFirebaseInput: "if mark is 35 or more it is pass else fail"
      };
    }
  }
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ").trim();
  const hasPassMarkConcept = norm.includes("35") || norm.includes("thirty five") || norm.includes("thirty-five") || norm.includes("40") || norm.includes("50") || norm.includes("pass mark") || norm.includes("passing mark") || norm.includes("cut off") || norm.includes("threshold");
  const hasComparisonOperator = norm.includes("35 or above") || norm.includes("35 and above") || norm.includes("35 or more") || norm.includes("35 and more") || norm.includes("at least 35") || norm.includes("above 35") || norm.includes("greater than or equal to 35") || norm.includes("greater than 34") || norm.includes(">= 35") || norm.includes(">=35") || norm.includes(">=") && (norm.includes("35") || norm.includes("40") || norm.includes("50")) || norm.includes("greater") && (norm.includes("35") || norm.includes("mark")) || norm.includes("compare") && (norm.includes("35") || norm.includes("mark"));
  const textWithoutNegations = norm.replace(/\b(?:not|never|no|cannot|cant|can't)\s+(?:pass|passes|passed|passing|cleared|promoted)\b/gi, " ").replace(/\bnot\s+pass\b/gi, " ").replace(/\bnot\s+passing\b/gi, " ").replace(/\s+/g, " ");
  const hasPassOutcome = /\b(?:pass|passes|passed|passing|cleared|promoted)\b/i.test(textWithoutNegations);
  const hasFailOutcome = /\b(?:fail|fails|failed|failing|failure|not\s+pass(?:ed)?|cannot\s+pass)\b/i.test(norm) || hasPassOutcome && /\b(?:otherwise|else)\b/i.test(norm);
  const clauses = norm.split(/[\n;\.]|\b(?:but|however|else|otherwise|whereas|while|then)\b/i);
  const isUnder35Condition = (s) => /(?:<=?\s*34|<\s*35|\bless\s*than\s*35\b|\bbelow\s*35\b|\bunder\s*35\b|\bstrictly\s*below\s*35\b|\b(?:0|[1-2]?[0-9]|3[0-4])\b)/i.test(s);
  const isOver35Condition = (s) => /(?:>=?\s*35|>\s*34|\bgreater\s*than\s*(?:or\s*equal\s*to\s*)?35\b|\babove\s*35\b|\b35\s*(?:or|and)\s*(?:more|above)\b|\bat\s*least\s*35\b|\b(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|100)\b)/i.test(s);
  const isBoundary35FailCondition = (s) => /(?:<=\s*35|\bless\s*than\s*or\s*equal\s*to\s*35\b|\bsmaller\s*than\s*or\s*equal\s*to\s*35\b|\b35\s*(?:or|and)\s*(?:less|below|under)\b)/i.test(s);
  const hasInclusivePassCondition = /\b35\s*(?:or|and)\s*(?:above|more|higher|greater)\b/i.test(norm) || /\b(?:at\s*least|minimum|from)\s*35\b/i.test(norm) || /\bgreater\s*than\s*(?:or\s*equal\s*(?:to\s*)?|and\s*equal\s*(?:to\s*)?)\s*35\b/i.test(norm) || /\bgreater\s*or\s*equal\s*(?:to\s*)?\s*35\b/i.test(norm) || />=\s*35/i.test(norm) || /(?:\bgreater\s*than|(?<!=)>)\s*34\b/i.test(norm) || /\b(?:equal\s*to\s*35|mark\s*is\s*35|is\s*35)\s*(?:it\s*is\s*)?(?:pass|passed)\b/i.test(norm) || norm.includes("35") && (norm.includes("cutoff") || norm.includes("cut off") || norm.includes("threshold"));
  const strictlyGreaterOmits35 = !hasInclusivePassCondition && (/\bgreater\s*than\s*35\b/i.test(norm) || /\bmore\s*than\s*35\b/i.test(norm) || /\babove\s*35\b/i.test(norm) || /(?<!=)>\s*35/i.test(norm));
  let claimsUnder35Passed = false;
  let claimsOver35Failed = false;
  let claimsBoundary35Failed = false;
  for (const rawClause of clauses) {
    const clause = rawClause.trim();
    if (!clause) continue;
    if (isUnder35Condition(clause)) {
      const hasPassWord = /\b(?:pass|passes|passed|passing|cleared|promoted)\b/i.test(clause);
      const hasNegation = /\b(?:not|never|no|cant|cannot|can't)\b/i.test(clause);
      const hasFailWord = /\b(?:fail|fails|failed|failing)\b/i.test(clause);
      if (hasPassWord && !hasNegation && !hasFailWord) {
        claimsUnder35Passed = true;
      }
      if (hasNegation && hasFailWord) {
        claimsUnder35Passed = true;
      }
    }
    if (isOver35Condition(clause)) {
      const hasFailWord = /\b(?:fail|fails|failed|failing)\b/i.test(clause);
      const hasNegation = /\b(?:not|never|no|cant|cannot|can't)\b/i.test(clause);
      const hasPassWord = /\b(?:pass|passes|passed|passing|cleared|promoted)\b/i.test(clause);
      if (hasFailWord && !hasNegation) {
        claimsOver35Failed = true;
      }
      if (hasNegation && hasPassWord) {
        claimsOver35Failed = true;
      }
    }
    if (isBoundary35FailCondition(clause)) {
      const hasFailWord = /\b(?:fail|fails|failed|failing)\b/i.test(clause);
      const hasNegation = /\b(?:not|never|no|cant|cannot|can't)\b/i.test(clause);
      if (hasFailWord && !hasNegation) {
        claimsBoundary35Failed = true;
      }
    }
  }
  const hasCodeKeywords = /\b(?:var|let|const|int|float|string|def|function|print\s*\(|console\.log|printf|echo|if\s*\(|else\s*\{|syntax|L\.S|R\.S|&&|\|\||==)\b/i.test(text);
  const isQuestion = /\b(?:what|how|why|where|explain|clarify|mean|doubt|help|puriyala)\b/i.test(text) || text.trim().endsWith("?");
  const isFullyVerified = !isQuestion && !claimsOver35Failed && !claimsUnder35Passed && !claimsBoundary35Failed && !strictlyGreaterOmits35 && !hasCodeKeywords && hasPassOutcome && hasFailOutcome && (hasInclusivePassCondition || norm.includes("thirty-five") || norm.includes("thirty five"));
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (claimsUnder35Passed) {
    feedback = "\u{1F31F} Coach Maara logic alert: Look closely at your condition! You wrote that a mark less than 35 is also Pass. But scoring below 35 is considered FAIL! A student only passes when their mark is 35 or above.";
    correction = "If mark is 35 or more it is Pass; if mark is less than 35 it is Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (claimsOver35Failed) {
    feedback = "\u{1F31F} Coach Maara logic alert: Look closely at your numbers! A mark of 35 or above (like 40, 50, 60, 75) is a PASSING mark, not Fail! A student only fails when their mark is strictly below 35.";
    correction = "If mark is 35 or more it is pass, else fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (claimsBoundary35Failed) {
    feedback = "\u{1F31F} Coach Maara boundary alert: Be careful with the number 35! Exactly 35 is the minimum mark to PASS! If you say '35 or less is fail', someone who scored 35 would unfairly fail. You must say 'strictly below 35 is fail' or '35 and above is pass'.";
    correction = "A mark of 35 or above is Pass, and below 35 is Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (strictlyGreaterOmits35) {
    feedback = "\u{1F31F} Coach Maara boundary alert: Look closely at your condition! You wrote 'greater than 35 is pass'. But what if the mark is exactly 35? A mark of 35 is the minimum passing score! If you only check strictly greater than 35, a student who scores 35 will NOT pass! You must say '35 or more', '35 or above', or 'greater than or equal to 35' (mark >= 35).";
    correction = "If mark is 35 or more it is Pass, else Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "what if mark is exactly 35";
  } else if (hasCodeKeywords) {
    feedback = "Coach Maara here! You are thinking in programming terms, which is wonderful! But here in Stage 1 (Logic), we explain the real-world rule purely in everyday human words without syntax like 'print', 'var', or 'if-else'. How would you explain pass/fail to a school student?";
    correction = "A student passes if their mark is 35 or above; otherwise they fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (isFullyVerified) {
    feedback = "\u{1F31F} Coach Maara here! Spot on! \u{1F389} If mark is 35 or more -> Pass, otherwise Fail. You've clearly mastered the real-world logic! Proceed to the Recipe stage to write the step-by-step algorithm in everyday words.";
    correction = "Proceed to the Recipe stage.";
    suggestedInput = void 0;
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (isQuestion) {
    if (norm.includes("exactly 35") || norm.includes("mark is 35") || norm.includes("mark == 35")) {
      feedback = "Exactly 35 is a Pass! 35 is the minimum passing cutoff mark, which is why we use '>=' (mark >= 35). A student only fails when their mark is strictly below 35.";
      correction = "If mark is 35 or more it is Pass, else Fail.";
      suggestedInput = "if mark is 35 or more it is pass else fail";
      matchedFirebaseInput = "what if mark is exactly 35";
    } else if (norm.includes("what mark") || norm.includes("passing mark") || norm.includes("cut off")) {
      feedback = "Usually, a mark of 35 or above (mark >= 35) is considered Pass. Less than 35 is Fail.";
      correction = "A mark of 35 or above is Pass, less than 35 is Fail.";
      suggestedInput = "if mark is 35 or more it is pass else fail";
      matchedFirebaseInput = "what mark is pass";
    } else {
      feedback = "Compare the student's mark with 35 using comparison operator >=. If mark is 35 or more it is pass, otherwise fail.";
      correction = "Compare the mark with 35 using comparison operator >=.";
      suggestedInput = "if mark is 35 or more it is pass else fail";
      matchedFirebaseInput = "how to check if student passed";
    }
  } else if (!hasPassOutcome && !hasFailOutcome) {
    feedback = "Coach Maara here! To explain pass or fail logic: State what mark a student needs to Pass (e.g. 35 or more), and what happens if they score less (Fail).";
    correction = "A mark of 35 or above is Pass, otherwise Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (!hasPassOutcome) {
    feedback = "Coach Maara here! You explained what happens when someone fails. Now state the positive outcome clearly: What mark does a student need to Pass?";
    correction = "A mark of 35 or above is Pass, and below 35 is Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (!hasFailOutcome) {
    feedback = "Coach Maara here! Great start explaining when a student passes! Now complete the logic: What happens if the student scores less than 35? State both outcomes: Pass and Fail.";
    correction = "If mark is 35 or more it is pass, otherwise fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  } else if (!hasPassMarkConcept) {
    feedback = "Coach Maara here! What is the minimum passing mark needed for a student to pass? (For instance, 35 out of 100).";
    correction = "A student must score 35 or above to pass.";
    suggestedInput = "what mark is pass";
    matchedFirebaseInput = "what mark is pass";
  } else {
    feedback = "Coach Maara here! To complete Stage 1, state the real-world pass/fail rule: A mark of 35 or above is Pass, otherwise Fail.";
    correction = "A mark of 35 or above is Pass, else Fail.";
    suggestedInput = "if mark is 35 or more it is pass else fail";
    matchedFirebaseInput = "if mark is 35 or more it is pass else fail";
  }
  return {
    isFullyVerified,
    hasPassMarkConcept,
    hasComparisonOperator,
    hasPassOutcome,
    hasFailOutcome,
    claimsOver35Failed,
    claimsUnder35Passed,
    claimsBoundary35Failed,
    strictlyGreaterOmits35,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validatePassFailRecipe(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ").trim();
  const hasInputStep = norm.includes("get mark") || norm.includes("input mark") || norm.includes("take mark") || norm.includes("read mark") || norm.includes("enter mark") || norm.includes("student mark") || norm.includes("get input") || norm.includes("take input") || norm.includes("input number") || norm.includes("input m") || norm.includes("get m") || norm.includes("step 1 : get mark input") || norm.includes("step 1 get mark input") || norm.includes("step 1: get mark input") || /\b(?:step\s*1|first\s*step)[\s:]+(?:get|take|input|read|enter|ask)\b/i.test(text);
  const hasConditionStep = norm.includes("35") || norm.includes("greater than or equal to 35") || norm.includes("greater than 34") || norm.includes("at least 35") || norm.includes("35 or more") || norm.includes("35 or above") || norm.includes("mark >= 35") || norm.includes("m >= 35") || norm.includes(">= 35");
  const textWithoutNegations = norm.replace(/\b(?:not|never|cannot)\s+pass\b/g, " ").replace(/\s+/g, " ");
  const hasTrueOutput = /\bpass\b/.test(textWithoutNegations) || /\bpassed\b/.test(textWithoutNegations) || /\bdisplay pass\b/.test(textWithoutNegations) || /\bannounce pass\b/.test(textWithoutNegations);
  const hasFalseOutput = norm.includes("fail") || norm.includes("failed") || norm.includes("not pass") || norm.includes("display fail") || norm.includes("announce fail") || norm.includes("else display fail");
  const hasRecipeUnder35PassContradiction = /(?:\b(?:(?:this\s*)?mark\s*(?:is\s*)?)?(?:<=?\s*34|<\s*35|\bless\s*than\s*35\b|\bbelow\s*35\b|\bunder\s*35\b|\b(?:0|[1-2]?[0-9]|3[0-4])\b))\s*(?:is|means|results\s*in|->|=>|=|to|should\s*be|then)?\s*(?:display|announce|print|show|it\s*is)?\s*(?:pass|passed)\b/i.test(text) || /\b(?:display|announce|print|show)?\s*(?:pass|passed)\b\s*(?:if|when)?\s*(?:(?:this\s*)?mark\s*(?:is\s*)?)?(?:<=?\s*34|<\s*35|less\s*than\s*35|below\s*35|under\s*35)/i.test(text);
  const hasRecipeOver35FailContradiction = /(?:\b(?:(?:this\s*)?mark\s*(?:is\s*)?)?(?:>=?\s*35|>\s*34|\bgreater\s*than\s*(?:or\s*equal\s*to\s*)?35\b|\babove\s*35\b|\b35\s*(?:or|and)\s*(?:more|above)\b|\bat\s*least\s*35\b|\b(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|100)\b))\s*(?:is|means|results\s*in|->|=>|=|to|should\s*be|then)?\s*(?:display|announce|print|show|it\s*is)?\s*(?:fail|failed|not\s*pass)\b/i.test(text) || /\b(?:display|announce|print|show)?\s*(?:fail|failed|not\s*pass)\b\s*(?:if|when)?\s*(?:(?:this\s*)?mark\s*(?:is\s*)?)?(?:>=?\s*35|>\s*34|greater\s*than\s*(?:or\s*equal\s*to\s*)?35|above\s*35|35\s*(?:or|and)\s*(?:more|above))/i.test(text);
  const hasRecipeContradiction = hasRecipeUnder35PassContradiction || hasRecipeOver35FailContradiction;
  const hasBoundaryContradiction = /(?:\b(?:(?:this\s*)?mark\s*(?:is\s*)?)?(?:<=?\s*35|smaller\s*than\s*or\s*equal\s*to\s*35|less\s*than\s*or\s*equal\s*to\s*35|35\s*(?:or|and)\s*(?:less|below|under)))\s*(?:is|means|results\s*in|->|=>|=|to|should\s*be|then)?\s*(?:display|announce|print|show|it\s*is)?\s*(?:fail|failed|not\s*pass)\b/i.test(text);
  const hasRecipeInclusive35 = /\b35\s*(?:or|and)\s*(?:above|more|higher|greater)\b/i.test(norm) || /\b(?:at\s*least|minimum|from)\s*35\b/i.test(norm) || /\bgreater\s*than\s*(?:or\s*equal\s*(?:to\s*)?|and\s*equal\s*(?:to\s*)?)\s*35\b/i.test(norm) || /\bgreater\s*or\s*equal\s*(?:to\s*)?\s*35\b/i.test(norm) || />=\s*35/i.test(norm) || /(?:\bgreater\s*than|(?<!=)>)\s*34\b/i.test(norm);
  const hasRecipeStrictlyGreaterOmission = !hasRecipeInclusive35 && (/\bgreater\s*than\s*35\b/i.test(norm) || /\bmore\s*than\s*35\b/i.test(norm) || /\babove\s*35\b/i.test(norm) || /(?<!=)>\s*35/i.test(norm));
  const isFullyVerified = hasInputStep && hasConditionStep && hasTrueOutput && hasFalseOutput && !hasRecipeContradiction && !hasBoundaryContradiction && !hasRecipeStrictlyGreaterOmission;
  const steps = [
    { stepNumber: 1, title: "Step 1: Get mark input", completed: hasInputStep, current: !hasInputStep },
    { stepNumber: 2, title: "Step 2: If mark >= 35 display Pass, else display Fail", completed: hasConditionStep && hasTrueOutput && hasFalseOutput && !hasRecipeContradiction && !hasBoundaryContradiction && !hasRecipeStrictlyGreaterOmission, current: hasInputStep && (!hasConditionStep || !hasTrueOutput || !hasFalseOutput || hasRecipeContradiction || hasBoundaryContradiction || hasRecipeStrictlyGreaterOmission) }
  ];
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasRecipeUnder35PassContradiction) {
    feedback = "\u{1F31F} Coach Maara logic alert: In your Recipe, you wrote that a mark under 35 displays Pass! Remember: scoring less than 35 is Fail. Please update: If mark >= 35 display Pass, else display Fail.";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else if (hasRecipeOver35FailContradiction) {
    feedback = "\u{1F31F} Coach Maara logic alert: In your Recipe, you wrote that 35 or above results in Fail! Remember: scoring 35 or more is a Pass. Please update: If mark >= 35 display Pass, else display Fail.";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else if (hasBoundaryContradiction) {
    feedback = "\u{1F31F} Coach Maara boundary alert: Saying 'less than or equal to 35 is Fail' accidentally fails a student who scored 35! Exactly 35 is Pass. Write 'less than 35 is Fail' or simply 'else display Fail'.";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else if (hasRecipeStrictlyGreaterOmission) {
    feedback = "\u{1F31F} Coach Maara boundary alert: In Step 2, you wrote 'if mark is greater than 35'! If a student scores exactly 35, they will fall into the 'else' branch and fail! Make sure to write 'greater than or equal to 35' (or mark >= 35) so that mark 35 is included in Pass.";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else if (isFullyVerified) {
    feedback = "\u{1F31F} Coach Maara here! Kudos! \u{1F389} Complete step-by-step algorithm in clear everyday words: Step 1 gets the mark, and Step 2 checks if mark >= 35 to display Pass or Fail. Proceed to the Ingredients stage!";
    correction = "step 1 : Get mark input\nstep 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = void 0;
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else if (!hasInputStep) {
    feedback = "Coach Maara here! Let's write our recipe starting with Step 1: How do we take the student's mark as input?";
    correction = "step 1 : Get mark input";
    suggestedInput = "step 1 : Get mark input";
    matchedFirebaseInput = "step 1 : Get mark input";
  } else if (!hasConditionStep) {
    feedback = "Great! Step 1 is done! Now for Step 2: What is the passing mark condition to check?";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 1 : Get mark input";
  } else if (!hasTrueOutput || !hasFalseOutput) {
    feedback = "Almost complete! In Step 2, be sure to state both outcomes: what to display if the mark is 35 or above, and what to display otherwise.";
    correction = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
  } else {
    feedback = "Coach Maara here! Write the 2-step recipe:\nStep 1: Get mark input.\nStep 2: If mark >= 35 display Pass, else display Fail.";
    correction = "step 1 : Get mark input\nstep 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    suggestedInput = !hasInputStep ? "step 1 : Get mark input" : "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail";
    matchedFirebaseInput = "what steps to write";
  }
  return {
    isFullyVerified,
    hasRecipeContradiction,
    hasBoundaryContradiction,
    hasRecipeStrictlyGreaterOmission,
    recipeStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validatePassFailIngredients(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, " ").replace(/\s+/g, " ").trim();
  const varMatch = text.match(/\b(?:var|let|const|variable|input)\s+([a-zA-Z_]\w*)/i) || text.match(/\b([a-zA-Z_]\w*)\s*=\s*\d+/i);
  const rawVar = varMatch && varMatch[1] && !["step", "if", "else", "var", "let", "const", "what", "how", "when", "print", "is", "it", "do", "here"].includes(varMatch[1].toLowerCase()) ? varMatch[1] : void 0;
  const detectedVar = rawVar || (norm.includes("mark") ? "mark" : norm.includes("m") ? "m" : "mark");
  const hasVariable = norm.includes("mark variable") || norm.includes("variable mark") || norm.includes("input variable mark") || norm.includes("variable m") || norm.includes("m variable") || norm.includes("var mark") || norm.includes("let mark") || norm.includes("mark =") || norm.includes("mark=") || Boolean(rawVar) || norm.includes("input variable") || norm.includes("integer variable");
  const hasLeftRightCondition = (norm.includes("l s") || norm.includes("left side")) && (norm.includes("r s") || norm.includes("right side")) && (norm.includes("operator") || norm.includes(">=")) || norm.includes("if condition with l s") || norm.includes("if condition with left side") || norm.includes("if (mark >= 35)") || norm.includes("if(mark>=35)") || norm.includes("if (m >= 35)") || norm.includes("if(m>=35)") || norm.includes("if") && norm.includes(">=") && (norm.includes("35") || norm.includes("40") || norm.includes("50"));
  const textWithoutNegations = norm.replace(/\b(?:not|non|never)\s+pass\b/g, " ").replace(/\bfail\b/g, " ");
  const hasUnquotedPositivePrint = /(?:print|display|announce|echo|printf|console\.log)\s*\(\s*(?!["'`\u201c\u201d])[^)\n]*(?:pass|passed)[^)\n]*\)/i.test(text);
  const hasUnquotedNegativePrint = /(?:print|display|announce|echo|printf|console\.log)\s*\(\s*(?!["'`\u201c\u201d])[^)\n]*(?:fail|failed|not\s*pass)[^)\n]*\)/i.test(text);
  const hasUnquotedPrint = hasUnquotedPositivePrint || hasUnquotedNegativePrint;
  const hasTruePrint = !hasUnquotedPositivePrint && (norm.includes("print pass") || norm.includes("display pass") || norm.includes("announce pass") || norm.includes("inside if") || norm.includes("if block") || norm.includes("true print") || /\b(?:print|display|announce)\s*\(?['"]?pass['"]?\)?\b/.test(textWithoutNegations) || /\bpass\b/.test(textWithoutNegations));
  const hasFalsePrint = !hasUnquotedNegativePrint && (norm.includes("print fail") || norm.includes("display fail") || norm.includes("announce fail") || norm.includes("inside else") || norm.includes("else block") || norm.includes("false print") || norm.includes("fail"));
  const isFullyVerified = hasVariable && hasLeftRightCondition && hasTruePrint && hasFalsePrint && !hasUnquotedPrint;
  const steps = [
    { stepNumber: 1, title: `Step 1: Input variable ${detectedVar}`, completed: hasVariable, current: !hasVariable },
    { stepNumber: 2, title: `Step 2: If condition (L.S: ${detectedVar}, Operator: >=, R.S: 35)`, completed: hasLeftRightCondition, current: hasVariable && !hasLeftRightCondition },
    {
      stepNumber: 3,
      title: hasUnquotedPositivePrint ? 'Step 3: Print "Pass" (Quotes needed!)' : 'Step 3: Inside if block: print("Pass")',
      completed: hasTruePrint,
      current: hasVariable && hasLeftRightCondition && !hasTruePrint
    },
    {
      stepNumber: 4,
      title: hasUnquotedNegativePrint ? 'Step 4: Print "Fail" (Quotes needed!)' : 'Step 4: Inside else block: print("Fail")',
      completed: hasFalsePrint,
      current: hasVariable && hasLeftRightCondition && hasTruePrint && !hasFalsePrint
    }
  ];
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (isFullyVerified) {
    feedback = `\u{1F31F} Coach Maara here! Hurray! \u{1F389} You have identified all the ingredients: variable \`${detectedVar}\`, condition \`if (${detectedVar} >= 35)\`, printing 'Pass' inside if, and printing 'Fail' inside else! Proceed to Taste the Sample stage to build the code!`;
    correction = `step 1 : ${detectedVar} variable
step 2 : If condition with L.S: ${detectedVar}, R.S: 35, Operator: >=
step 3 : Inside if block: print("Pass")
step 4 : Inside else block: print("Fail")`;
    suggestedInput = `step 1 : ${detectedVar} variable
step 2 : If condition with L.S: ${detectedVar}, R.S: 35, Operator: >=
step 3 : Inside if block: print("Pass")
step 4 : Inside else block: print("Fail")`;
    matchedFirebaseInput = "step 2 : If condition with L.S: mark, R.S: 35, Operator: >=";
  } else if (hasUnquotedPrint) {
    feedback = `\u{1F31F} Coach Maara syntax alert: Look closely at your \`print(...)\` statement! In programming, any text message (string literal) inside \`print(...)\` must be enclosed in quotation marks: \`print("Pass")\` and \`print("Fail")\`. Without quotes, the computer treats words as undefined variables and produces a syntax error!`;
    correction = `step 3 : Inside if block: print("Pass")
step 4 : Inside else block: print("Fail")`;
    suggestedInput = `step 3 : Inside if block: print("Pass")
step 4 : Inside else block: print("Fail")`;
    matchedFirebaseInput = "how to write if condition";
  } else if (!hasVariable) {
    feedback = "Coach Maara here! Let's start with Step 1 of Ingredients: What variable do we need to store the student's mark? (e.g. `Step 1: Variable mark=45` or `Step 1: mark variable`).";
    correction = "step 1 : mark variable";
    suggestedInput = "step 1 : mark variable";
    matchedFirebaseInput = "what ingredients do we need";
  } else if (!hasLeftRightCondition) {
    const isAskingQuestion = /\b(?:what|how|why|where|next|stuck|do here)\b/i.test(text);
    feedback = isAskingQuestion ? `\u{1F31F} Coach Maara here! You have already identified your input variable \`${detectedVar}\` in Step 1! \u{1F389} For what to do next in Step 2: we need to break down the \`if\` condition to test if the mark is 35 or above. Break it down into: Left Side (L.S: ${detectedVar}), Operator (>=), and Right Side (R.S: 35).` : `\u{1F31F} Coach Maara here! Spot on! You have identified the input variable \`${detectedVar}\` in Step 1! \u{1F389} Now for Step 2: How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?`;
    correction = `step 2 : If condition with L.S: ${detectedVar}, R.S: 35, Operator: >=`;
    suggestedInput = `step 2 : If condition with L.S: ${detectedVar}, R.S: 35, Operator: >=`;
    matchedFirebaseInput = "step 1 : mark variable";
  } else if (!hasTruePrint) {
    feedback = `Awesome condition! Step 3: Inside the 'if' block, what print statement runs when (${detectedVar} >= 35) is true? (e.g. \`print("Pass")\`).`;
    correction = 'step 3 : Inside if block: print("Pass")';
    suggestedInput = 'step 3 : Inside if block: print("Pass")';
    matchedFirebaseInput = "how to write if condition";
  } else if (!hasFalsePrint) {
    feedback = "Almost done! Step 4: Inside the 'else' block, what print statement runs when the condition is false?";
    correction = 'step 4 : Inside else block: print("Fail")';
    suggestedInput = 'step 4 : Inside else block: print("Fail")';
    matchedFirebaseInput = "step 2 : If condition with L.S: mark, R.S: 35, Operator: >=";
  }
  return {
    isFullyVerified,
    hasUnquotedPrint,
    ingredientsStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validatePassFailSampleCode(text) {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&()'";{}]/g, " ");
  const varMatch = text.match(/\b(?:var|let|const)?\s*([a-zA-Z_]\w*)\s*=\s*\d+/i);
  const detectedVar = varMatch && varMatch[1] && !["if", "else", "print"].includes(varMatch[1].toLowerCase()) ? varMatch[1] : "mark";
  const hasInputVar = new RegExp(`\\b(?:var|let|const)?\\s*${detectedVar}\\s*=\\s*\\d+`, "i").test(text) || /\b(?:var|let|const)?\s*(?:mark|m|score|val|num|n)\s*=\s*\d+/i.test(text);
  const hasCondition = new RegExp(`\\bif\\s*\\(\\s*${detectedVar}\\s*>=\\s*35\\s*\\)`, "i").test(text) || /\bif\s*\(\s*(?:mark|m|score|[a-zA-Z_]\w*)\s*>=\s*35\s*\)/i.test(text) || /\bif\s*\(\s*(?:mark|m|score|[a-zA-Z_]\w*)\s*>\s*34\s*\)/i.test(text);
  const hasQuotedPositivePrint = /(?:print|display|printf|console\.log)\s*\(\s*["'`\u201c\u201d]\s*pass\s*["'`\u201c\u201d]\s*\)/i.test(text);
  const hasAnyPositivePrint = /(?:print|display|printf|console\.log)\s*\([^)\n]*pass[^)\n]*\)/i.test(text);
  const hasUnquotedPositivePrint = hasAnyPositivePrint && !hasQuotedPositivePrint;
  const hasElseWithCondition = /\belse\s*\([^)]*\)/i.test(text);
  const hasElseBoundaryError = /\belse\s*(?:if)?\s*\(?\s*(?:mark|[a-zA-Z_]\w*)\s*<=\s*35/i.test(text);
  const hasElse = /else\b/i.test(text) && !hasElseWithCondition && !hasElseBoundaryError;
  const hasQuotedNegativePrint = /(?:print|display|printf|console\.log)\s*\(\s*["'`\u201c\u201d]\s*(?:fail|failed)\s*["'`\u201c\u201d]\s*\)/i.test(text);
  const hasAnyNegativePrint = /(?:print|display|printf|console\.log)\s*\([^)\n]*(?:fail|failed)[^)\n]*\)/i.test(text);
  const hasUnquotedNegativePrint = hasAnyNegativePrint && !hasQuotedNegativePrint;
  const hasInvertedBranches = /if\s*\([^)]*(?:>=?\s*35|>\s*34)[^)]*\)\s*\{?[^}]*(?:print|display|printf|console\.log)\s*\(\s*["'`\u201c\u201d]\s*fail/i.test(text) || /else\s*\{?[^}]*(?:print|display|printf|console\.log)\s*\(\s*["'`\u201c\u201d]\s*pass/i.test(text);
  const allVerified = hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && hasQuotedNegativePrint && !hasElseWithCondition && !hasElseBoundaryError && !hasInvertedBranches;
  const steps = [
    { stepNumber: 1, title: `Step 1: Declare input variable (var ${detectedVar} = 45)`, completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: `Step 2: Check condition if (${detectedVar} >= 35)`, completed: hasCondition, current: hasInputVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Print "Pass" (with quotes) if true', completed: hasQuotedPositivePrint && !hasInvertedBranches, current: hasInputVar && hasCondition && (!hasQuotedPositivePrint || hasInvertedBranches) },
    {
      stepNumber: 4,
      title: hasElseWithCondition ? "Step 4: Else branch (Syntax error: 'else' cannot take condition)" : hasElseBoundaryError ? "Step 4: Else branch (35 is pass, use 'else {' without <= 35)" : "Step 4: Else branch",
      completed: hasElse,
      current: hasInputVar && hasCondition && hasQuotedPositivePrint && !hasElse
    },
    { stepNumber: 5, title: 'Step 5: Print "Fail" (with quotes) if false', completed: hasQuotedNegativePrint && !hasInvertedBranches, current: hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && (!hasQuotedNegativePrint || hasInvertedBranches) }
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
      hasElseBoundaryError: false,
      hasInvertedBranches: false,
      matchedFirebaseInput: `var ${detectedVar} = 45; if (${detectedVar} >= 35) print("Pass"); else print("Fail");`,
      feedback: "\u{1F31F} Coach Maara here! You gotcha! \u{1F389} Spot on comparison code! You have successfully implemented pass or fail checking with comparison operator >=, proper quotation marks, and clean branching. You are ready to run and test!",
      sampleCodeStepProgress: allDone,
      correction: void 0,
      suggestedInput: void 0
    };
  }
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  if (hasInvertedBranches) {
    feedback = `\u{1F31F} Coach Maara logic alert: Look at your output messages! In your \`if (${detectedVar} >= 35)\` block, you are printing 'Fail'! When a student scores 35 or above, they Pass. Swap them so the \`if\` block prints 'Pass' and the \`else\` block prints 'Fail'.`;
    correction = `if (${detectedVar} >= 35) {
  print("Pass");
} else {
  print("Fail");
}`;
    suggestedInput = `if (${detectedVar} >= 35) {
  print("Pass");
} else {
  print("Fail");
}`;
  } else if (hasElseWithCondition) {
    feedback = `\u{1F31F} Coach Maara syntax alert: Look closely at your \`else\` statement: \`else(...)\`! \u{1F50D} In programming languages, the \`else\` keyword cannot take a condition or parentheses! It acts as the automatic fallback for all other cases, so write it simply as \`else {\` without any condition in parentheses. (Also note: mark 35 is passing, so \`<= 35\` would incorrectly include 35 as fail).`;
    correction = `else {
  print("Fail");
}`;
    suggestedInput = `else {
  print("Fail");
}`;
  } else if (hasElseBoundaryError) {
    feedback = `\u{1F31F} Coach Maara logic alert: Look at the condition in your else branch! Mark 35 is a passing score. If you check \`<= 35\`, then a student who scored exactly 35 would also be marked 'Fail'! Simply use \`else {\` for all remaining cases (or \`else if (${detectedVar} < 35)\`).`;
    correction = `else {
  print("Fail");
}`;
    suggestedInput = `else {
  print("Fail");
}`;
  } else if (!hasInputVar) {
    feedback = `Coach Maara here! Let's start with Step 1 of our sample code: Declare an input variable with a test mark (e.g. \`var ${detectedVar} = 45;\`).`;
    correction = `var ${detectedVar} = 45;`;
    suggestedInput = `var ${detectedVar} = 45;`;
  } else if (!hasCondition) {
    feedback = `Coach Maara here! You declared the variable! Now for Step 2: Write the \`if\` condition to test if the mark is 35 or above: \`if (${detectedVar} >= 35) {\`.`;
    correction = `if (${detectedVar} >= 35) {
  print("Pass");
}`;
    suggestedInput = `if (${detectedVar} >= 35) {
  print("Pass");
}`;
  } else if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      feedback = `Coach Maara here! You've got the print statement, but make sure to wrap the word in quotation marks: \`print("Pass")\`. Without quotes, the compiler looks for a variable named Pass and throws an error!`;
      correction = 'print("Pass");';
      suggestedInput = 'print("Pass");';
    } else {
      feedback = `Coach Maara here! Inside the \`if\` block, print the passing message: \`print("Pass");\`.`;
      correction = 'print("Pass");';
      suggestedInput = 'print("Pass");';
    }
  } else if (!hasElse) {
    feedback = `Coach Maara here! You've got the condition and true branch! Now for Step 4: Add the \`else\` branch to handle marks under 35: \`else {\`.`;
    correction = `else {
  print("Fail");
}`;
    suggestedInput = `else {
  print("Fail");
}`;
  } else if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      feedback = `Coach Maara here! Inside the \`else\` block, make sure to wrap your message in quotation marks: \`print("Fail")\`.`;
      correction = 'print("Fail");';
      suggestedInput = 'print("Fail");';
    } else {
      feedback = `Coach Maara here! Almost done! For Step 5: Inside the else block, print the fail message: \`print("Fail");\`.`;
      correction = 'print("Fail");';
      suggestedInput = 'print("Fail");';
    }
  } else {
    feedback = `Coach Maara here! Draft the sample code comparing mark with 35:
var ${detectedVar} = 45;
if (${detectedVar} >= 35) {
  print("Pass");
} else {
  print("Fail");
}`;
    correction = `var ${detectedVar} = 45;
if (${detectedVar} >= 35) {
  print("Pass");
} else {
  print("Fail");
}`;
    suggestedInput = `var ${detectedVar} = 45;
if (${detectedVar} >= 35) {
  print("Pass");
} else {
  print("Fail");
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
    hasElseBoundaryError,
    hasInvertedBranches,
    sampleCodeStepProgress: steps,
    feedback,
    correction,
    suggestedInput
  };
}
export {
  validatePassFailIngredients,
  validatePassFailLogic,
  validatePassFailRecipe,
  validatePassFailSampleCode
};
