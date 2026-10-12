export interface VotingEligibilityValidationResult {
  isFullyVerified: boolean;
  hasUnquotedPrint?: boolean;
  hasAgeConcept?: boolean;
  hasComparisonOperator?: boolean;
  hasEligibleOutcome?: boolean;
  hasNotEligibleOutcome?: boolean;
  hasEligibleExample?: boolean;
  hasNotEligibleExample?: boolean;
  hasExample?: boolean;
  claimsOver18Ineligible?: boolean;
  claimsUnder18Eligible?: boolean;
  claimsBoundary18Ineligible?: boolean;
  hasRecipeContradiction?: boolean;
  hasBoundaryContradiction?: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  recipeStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
  ingredientsStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
}

export interface VotingEligibilitySampleValidationResult {
  allVerified: boolean;
  hasInputVar: boolean;
  hasCondition: boolean;
  hasPositivePrint: boolean;
  hasElse: boolean;
  hasNegativePrint: boolean;
  hasElseWithCondition?: boolean;
  hasElseBoundaryError?: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
  matchedFirebaseInput?: string;
  sampleCodeStepProgress?: {
    stepNumber: number;
    title: string;
    completed: boolean;
    current: boolean;
  }[];
}

/**
 * Validates the Logic stage for Voting Eligibility (Problem 11)
 *
 * Grounded in Firebase hint pairs without any coding keywords in Logic:
 * 1. "what is voting eligibility age" -> "A person must be 18 years old or older to be eligible to vote."
 * 2. "how to check if a person can vote" -> "Check whether the person's age is 18 or older. If they are at least 18, they can vote; otherwise, they cannot vote."
 * 3. "if age is 18 or more then eligible" -> "Spot on! If someone is 18 or older, they are Eligible to Vote; if they are under 18, they are Not Eligible. Proceed to Recipe."
 */
export function validateVotingEligibilityLogic(text: string): VotingEligibilityValidationResult {
  // Strict mathematical comparison verification across all written numeric comparisons
  const rawComparisonMatches = Array.from(text.matchAll(/(\d+)\s*(>=|<=|>|<|==|!=|=)\s*(\d+)/g));
  for (const match of rawComparisonMatches) {
    const left = parseInt(match[1], 10);
    const op = match[2];
    const right = parseInt(match[3], 10);

    let isMathFactTrue = false;
    if (op === '<') isMathFactTrue = left < right;
    else if (op === '>') isMathFactTrue = left > right;
    else if (op === '<=') isMathFactTrue = left <= right;
    else if (op === '>=') isMathFactTrue = left >= right;
    else if (op === '==' || op === '=') isMathFactTrue = left === right;
    else if (op === '!=') isMathFactTrue = left !== right;

    if (!isMathFactTrue) {
      return {
        isFullyVerified: false,
        hasBoundaryContradiction: true,
        feedback: `🌟 Coach Maya gentle check: Look closely at your mathematical comparison \`${left} ${op} ${right}\`! ${left} is ${left > right ? 'greater than' : 'less than'} ${right}, so \`${left} ${op} ${right}\` is mathematically false! For age ${left}, write \`${left} ${left >= right ? '>=' : '<'} ${right}\`.`,
        correction: `For age ${left}: write \`${left} ${left >= right ? '>=' : '<'} ${right}\` (${left >= 18 ? 'Eligible' : 'Not Eligible'}).`,
        suggestedInput: `If age >= 18 (e.g. 20 >= 18 -> true) -> Eligible. If age < 18 (e.g. 15 < 18 -> true) -> Not Eligible.`,
        matchedFirebaseInput: "if age is 18 or more then eligible"
      };
    }
  }

  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-\.&]/g, ' ').replace(/\s+/g, ' ').trim();

  // 1. Age 18 concept (minimum voting age is 18)
  const hasAgeConcept =
    norm.includes('18') ||
    norm.includes('eighteen') ||
    norm.includes('minimum age') ||
    norm.includes('voting age');

  // 2. Comparison concept (at least 18, 18 or above, 18 or older, greater than or equal to 18)
  const hasComparisonOperator =
    norm.includes('18 or above') ||
    norm.includes('18 and above') ||
    norm.includes('18 or more') ||
    norm.includes('18 and more') ||
    norm.includes('18 or older') ||
    norm.includes('18 and older') ||
    norm.includes('at least 18') ||
    norm.includes('above 18') ||
    norm.includes('greater than or equal to 18') ||
    norm.includes('greater than or equal to eighteen') ||
    norm.includes('more than 17') ||
    norm.includes('> 17') ||
    norm.includes('>17') ||
    norm.includes('>= 18') ||
    norm.includes('>=18') ||
    (norm.includes('>=') && norm.includes('18')) ||
    (norm.includes('greater') && norm.includes('18')) ||
    (norm.includes('compare') && (norm.includes('18') || norm.includes('age')));

  // Text with negations stripped to verify genuine affirmative eligibility
  const textWithoutNegations = norm
    .replace(/\b(?:not|non|never|cannot|cant|can't)\s+(?:eligible|allowed|qualif\w*)\b/g, ' ')
    .replace(/\b(?:cannot|cant|can't)\s+vote\b/g, ' ')
    .replace(/\bnot\s+allowed\s+to\s+vote\b/g, ' ')
    .replace(/\bineligible\b/g, ' ')
    .replace(/\bnot\s+able\s+to\s+vote\b/g, ' ')
    .replace(/\s+/g, ' ');

  // 3. Eligible outcome (MUST be affirmative, not part of "not eligible")
  const hasEligibleOutcome =
    /\b(?:is\s+|are\s+)?eligible\b/.test(textWithoutNegations) ||
    /\b(?:can|allowed\s+to|qualifies\s+to)\s+vote\b/.test(textWithoutNegations);

  // 4. Not Eligible outcome
  const hasNotEligibleOutcome =
    norm.includes('not eligible') ||
    norm.includes('cannot vote') ||
    norm.includes('cant vote') ||
    norm.includes("can't vote") ||
    norm.includes('not allowed to vote') ||
    norm.includes('ineligible') ||
    norm.includes('under 18') ||
    norm.includes('below 18') ||
    norm.includes('less than 18');

  // 5. Misconception / Contradiction checks (clause-by-clause analysis):
  // e.g. User claims age 20 (or >= 18) is NOT eligible: "20>=18-->vote is not eligible"
  // or user claims "smaller than or equal to 18 is not eligible" (which wrongly includes 18)
  // Split on sentence boundaries and contrastive conjunctions, but NOT on commas
  const rawClauses = text.toLowerCase().split(/[;\n\r.!?]+|\b(?:otherwise|whereas|while|but)\b/);

  let claimsOver18Ineligible = false;
  let claimsBoundary18Ineligible = false;
  let claimsUnder18Eligible = false;

  for (const rawClause of rawClauses) {
    const clause = rawClause.trim();
    if (!clause) continue;

    const hasNegation =
      clause.includes('not eligible') ||
      clause.includes('cannot vote') ||
      clause.includes('cant vote') ||
      clause.includes("can't vote") ||
      clause.includes('not allowed to vote') ||
      clause.includes('ineligible');

    const clauseWithoutNegations = clause
      .replace(/\b(?:not|non|never|cannot|cant|can't)\s+(?:eligible|allowed|qualif\w*)\b/g, ' ')
      .replace(/\b(?:cannot|cant|can't)\s+vote\b/g, ' ')
      .replace(/\bnot\s+allowed\s+to\s+vote\b/g, ' ')
      .replace(/\bineligible\b/g, ' ')
      .replace(/\bnot\s+able\s+to\s+vote\b/g, ' ')
      .trim();

    const hasAffirmative =
      /\b(?:is\s+|are\s+)?eligible\b/.test(clauseWithoutNegations) ||
      /\b(?:can|allowed\s+to|qualifies\s+to)\s+vote\b/.test(clauseWithoutNegations);

    // Contradiction 1: Claims >= 18 or adult age (18+, 20, etc.) or <= 18 is NOT eligible
    if (hasNegation) {
      // Check for boundary error: "smaller than or equal to 18", "less than or equal to 18", "<= 18", "18 or younger/less"
      const mentionsBoundary18Ineligible =
        /(?:smaller|less|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18/i.test(clause) ||
        /<=\s*18/i.test(clause) ||
        /\b18\s*(?:or|and)\s*(?:smaller|less|below|younger)\b/i.test(clause) ||
        /\b(?:smaller|less|below|younger)\s*(?:than\s*)?18\s*(?:or|and)\s*(?:equal|18)\b/i.test(clause);

      if (mentionsBoundary18Ineligible) {
        claimsBoundary18Ineligible = true;
        claimsOver18Ineligible = true;
      }

      const mentionsAdultOrGTE =
        clause.includes('>=') ||
        clause.includes('greater than or equal') ||
        clause.includes('more than or equal') ||
        clause.includes('18 or older') ||
        clause.includes('18 and older') ||
        clause.includes('18 or above') ||
        clause.includes('18 and above') ||
        clause.includes('at least 18') ||
        clause.includes('more than 18') ||
        clause.includes('above 18') ||
        /\b(?:19|20|21|22|23|24|25|30|40|50)\b/.test(clause);

      // Check if this clause is strictly talking about under 18 (e.g. strictly < 18, not <= 18)
      const isStrictlyUnder18 =
        !mentionsBoundary18Ineligible && (
          clause.includes('under') ||
          clause.includes('below') ||
          clause.includes('less than') ||
          clause.includes('smaller than') ||
          clause.includes('<') ||
          clause.includes('younger than')
        );

      if (mentionsAdultOrGTE && !isStrictlyUnder18) {
        claimsOver18Ineligible = true;
      }
      if (/20\s*>=\s*18\s*[-=>]+\s*(?:vote\s+is\s+)?not\s+eligible/i.test(clause)) {
        claimsOver18Ineligible = true;
      }
    }

    // Contradiction 2: Claims < 18 (e.g. 16, under 18) IS eligible
    if (hasAffirmative) {
      const cleanedClause = clauseWithoutNegations.replace(/\bstep\s*\d+\b/gi, '').replace(/^\s*\d+[\.\)]\s*/, '');
      const mentionsUnder18 =
        clause.includes('under 18') ||
        clause.includes('below 18') ||
        clause.includes('less than 18') ||
        clause.includes('smaller than 18') ||
        clause.includes('younger than 18') ||
        clause.includes('< 18') ||
        clause.includes('<= 17') ||
        /\b(?:age\s+|aged\s+|is\s+|==\s*|person\s+of\s+)?(?:1[0-7]|[1-9])\s*(?:years|yr|age)?\b/.test(cleanedClause) &&
        !/\b(?:step|rule|case|option|phase|stage)\s*\d+\b/i.test(clauseWithoutNegations);

      const mentionsOver18 =
        clause.includes('18 or older') ||
        clause.includes('18 and older') ||
        clause.includes('18 or above') ||
        clause.includes('at least 18') ||
        clause.includes('>= 18');

      if (mentionsUnder18 && !mentionsOver18) {
        claimsUnder18Eligible = true;
      }
    }
  }

  // 6. Examples check:
  // Example of eligible (e.g. 18, 19, 20, 21, 25, 30, etc.)
  const hasEligibleExample =
    /\b(?:18|19|20|21|22|23|24|25|30|35|40|50|60)\b/.test(textWithoutNegations) &&
    (textWithoutNegations.includes('example') || textWithoutNegations.includes('eg') || textWithoutNegations.includes('like') || textWithoutNegations.includes('eligible') || textWithoutNegations.includes('vote'));

  // Example of not eligible (e.g. 10, 12, 14, 15, 16, 17)
  const hasNotEligibleExample =
    /\b(?:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17)\b/.test(norm) &&
    (norm.includes('not eligible') || norm.includes('cannot') || norm.includes('below') || norm.includes('under') || norm.includes('less'));

  const hasBothExamples = hasEligibleExample && hasNotEligibleExample;

  // Fully verified when:
  // - mentions age 18
  // - mentions comparison (18 or older)
  // - explicitly states eligible outcome
  // - explicitly states not eligible outcome
  // - NO logical contradictions!
  const isFullyVerified =
    hasAgeConcept &&
    hasComparisonOperator &&
    hasEligibleOutcome &&
    hasNotEligibleOutcome &&
    !claimsOver18Ineligible &&
    !claimsUnder18Eligible;

  let feedback = '';
  let correction = '';
  let suggestedInput = '';
  let matchedFirebaseInput = undefined;

  // Handle contradictions first
  if (claimsBoundary18Ineligible) {
    feedback = "🌟 Coach Maya here! Look closely at the comparison: you wrote that 'smaller than or equal to 18' is not eligible. But if someone is 18 years old, they ARE eligible to vote! Saying 'smaller than or equal to 18' mistakenly includes age 18 in the not-eligible group. A person is only not eligible when their age is strictly younger than 18 (below 18).";
    correction = "If a person is 18 or older, they are Eligible to Vote; if they are younger than 18, they are Not Eligible to Vote.";
    suggestedInput = "A person must be 18 years old or older to be eligible to vote. If a person is 18 or older, they are Eligible to Vote; if they are under 18, they are Not Eligible.";
    matchedFirebaseInput = "how to check if a person can vote";
  } else if (claimsOver18Ineligible) {
    feedback = "🌟 Coach Maya here! Hold on a moment! Take a close look at your example: you wrote that age 20 (or 18 and older) is 'not eligible'. But 20 is greater than 18, which means someone aged 20 IS eligible to vote! Remember: if a person is 18 or older, they are Eligible to Vote; only when they are younger than 18 are they Not Eligible.";
    correction = "If a person is 18 or older, they are Eligible to Vote. If they are younger than 18, they are Not Eligible to Vote.";
    suggestedInput = "A person must be 18 years old or older to be eligible to vote. If a person is 18 or older, they are Eligible to Vote (e.g., age 20 is eligible); if they are under 18, they are Not Eligible (e.g., age 16 is not eligible).";
    matchedFirebaseInput = "how to check if a person can vote";
  } else if (claimsUnder18Eligible) {
    feedback = "🌟 Coach Maya here! Look closely at your conclusion: anyone younger than 18 (like age 16) cannot vote legally. A person is only Eligible to Vote if they are 18 or older; otherwise they are Not Eligible.";
    correction = "If age is 18 or older, they are Eligible to Vote. If age is under 18, they are Not Eligible.";
    suggestedInput = "A person must be 18 years old or older to vote. Age 18 or older is Eligible to Vote, and age under 18 is Not Eligible to Vote.";
    matchedFirebaseInput = "how to check if a person can vote";
  } else if (isFullyVerified) {
    feedback = "🌟 Coach Maya here! You gotcha! 🎉 Outstanding logic! If someone is 18 or older, they are Eligible to Vote; otherwise (younger than 18), they are Not Eligible (for example, someone aged 20 is eligible, whereas someone aged 16 is not eligible). You have mastered the real-world logic—proceed to the Recipe stage to sequence your steps!";
    correction = "If someone is 18 or older, they are Eligible to Vote; otherwise, they are Not Eligible. Proceed to Recipe.";
    suggestedInput = "A person must be 18 years old or older to be eligible to vote. If someone is 18 or older, announce Eligible to Vote; otherwise, announce Not Eligible (e.g., age 20 is eligible, age 16 is not eligible).";
    matchedFirebaseInput = "if age is 18 or more then eligible";
  } else if (!hasAgeConcept) {
    feedback = "Coach Maya here! Let's start with the fundamental real-world rule of voting: What is the minimum age required for a person to be legally eligible to vote?";
    correction = "A person must be 18 years old or older to be eligible to vote.";
    suggestedInput = "A person must be 18 years old or older to be eligible to vote.";
    matchedFirebaseInput = "what is voting eligibility age";
  } else if (!hasComparisonOperator) {
    feedback = "Spot on about age 18! Now, how do we decide whether a person qualifies to vote? Explain how their age compares with the minimum age of 18.";
    correction = "Check whether the person's age is 18 or older.";
    suggestedInput = "Check whether the person's age is 18 or older. If they are at least 18, they can vote; otherwise, they cannot vote.";
    matchedFirebaseInput = "how to check if a person can vote";
  } else if (!hasEligibleOutcome) {
    feedback = "You noted the rule and when someone is not eligible. Now state the positive outcome clearly: What happens when a person's age is 18 or older? Are they eligible to vote?";
    correction = "If a person is 18 or older, they are Eligible to Vote.";
    suggestedInput = "If someone is 18 or older, they are Eligible to Vote. If they are under 18, they are Not Eligible to Vote.";
    matchedFirebaseInput = "if age is 18 or more then eligible";
  } else if (!hasNotEligibleOutcome) {
    feedback = "You stated when someone is eligible! Now state the other outcome: What happens if their age is below 18?";
    correction = "If someone is younger than 18, they are Not Eligible to Vote.";
    suggestedInput = "If someone is 18 or older, they are Eligible to Vote; if they are under 18, they are Not Eligible to Vote.";
    matchedFirebaseInput = "if age is 18 or more then eligible";
  }

  return {
    isFullyVerified,
    hasAgeConcept,
    hasComparisonOperator,
    hasEligibleOutcome,
    hasNotEligibleOutcome,
    hasEligibleExample,
    hasNotEligibleExample,
    hasExample: hasBothExamples,
    claimsOver18Ineligible,
    claimsBoundary18Ineligible,
    claimsUnder18Eligible,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}

/**
 * Validates the Recipe stage for Voting Eligibility (Problem 11)
 *
 * Target Firebase hint pairs in simple everyday English (NO CODE WORDS):
 * 1. "what steps to write" -> "Step 1: Take the person's age. Step 2: Check if age is 18 or older. Step 3: If yes, announce Eligible to vote; otherwise, announce Not Eligible."
 * 2. "step 1 : Get input age" -> "Great! Next, check whether the age meets the requirement of 18 or older."
 * 3. "step 2 : If age is 18 or older, announce Eligible, otherwise announce Not Eligible" -> "Kudos! Complete step-by-step recipe in everyday words. Proceed to Ingredients."
 */
export function validateVotingEligibilityRecipe(text: string): VotingEligibilityValidationResult {
  const cleanLines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const recipeLines = cleanLines.filter(line => {
    const l = line.toLowerCase();
    const isQuestion =
      l.includes('how to') ||
      l.includes('what') ||
      l.includes('dont know') ||
      l.includes("don't know") ||
      l.includes('puriyala') ||
      l.includes('help me');
    if (isQuestion && !/^step\s*\d+/i.test(line)) {
      return false;
    }
    return true;
  });

  const recipeText = recipeLines.join(' ').toLowerCase().replace(/[^a-z0-9\s><=+\-:]/g, ' ').replace(/\s+/g, ' ').trim();

  // Contradiction in recipe checks:
  let hasRecipeContradiction = false;
  let hasBoundaryContradiction = false;
  let hasAdultNotEligible = false;
  let hasUnder18Eligible = false;

  for (const line of recipeLines) {
    const l = line.toLowerCase();
    const clauses = l.split(/[;\n\r.!?]+|\b(?:otherwise|else)\b/);

    for (const c of clauses) {
      const trimmed = c.trim();
      if (!trimmed) continue;

      const mentionsNotEligible =
        trimmed.includes('not eligible') ||
        trimmed.includes('cannot vote') ||
        trimmed.includes("can't vote") ||
        trimmed.includes('cant vote') ||
        trimmed.includes('not allowed to vote') ||
        trimmed.includes('ineligible');

      const clauseWithoutNegations = trimmed
        .replace(/\b(?:not|non|never|cannot|cant|can't)\s+(?:eligible|allowed|qualif\w*)\b/g, ' ')
        .replace(/\b(?:cannot|cant|can't)\s+vote\b/g, ' ')
        .replace(/\bnot\s+allowed\s+to\s+vote\b/g, ' ')
        .replace(/\bineligible\b/g, ' ')
        .replace(/\bnot\s+able\s+to\s+vote\b/g, ' ')
        .trim();

      const mentionsEligibleAffirmative =
        /\b(?:is\s+|announce\s+|display\s+|show\s+|print\s+)?eligible\b/.test(clauseWithoutNegations) ||
        /\b(?:can|allowed\s+to|qualifies\s+to)\s+vote\b/.test(clauseWithoutNegations);

      // 1. Boundary check on Not Eligible:
      // "smaller than or equal to 18", "less than or equal to 18", "<= 18", "18 or smaller", "18 or younger", "18 or below", "18 or less"
      const mentionsBoundary18 =
        /(?:smaller|less|lesser)\s*than\s*or\s*equal\s*(?:to\s*)?18/i.test(trimmed) ||
        /<=\s*18/i.test(trimmed) ||
        /\b18\s*(?:or|and)\s*(?:smaller|less|below|younger)\b/i.test(trimmed) ||
        /\b(?:smaller|less|below|younger)\s*(?:than\s*)?18\s*(?:or|and)\s*(?:equal|18)\b/i.test(trimmed);

      if (mentionsBoundary18 && mentionsNotEligible) {
        hasBoundaryContradiction = true;
        hasRecipeContradiction = true;
      }

      // 2. Adult / >= 18 claimed as Not Eligible:
      const isAdultCheck =
        trimmed.includes('>=') ||
        trimmed.includes('greater than or equal') ||
        trimmed.includes('more than or equal') ||
        trimmed.includes('18 or older') ||
        trimmed.includes('18 and older') ||
        trimmed.includes('18 or above') ||
        trimmed.includes('18 and above') ||
        trimmed.includes('at least 18') ||
        /\b(?:19|20|21|22|23|24|25|30|40|50)\b/.test(trimmed);

      const isStrictlyUnder18 =
        !mentionsBoundary18 && (
          trimmed.includes('under') ||
          trimmed.includes('below') ||
          trimmed.includes('less than') ||
          trimmed.includes('smaller than') ||
          trimmed.includes('<') ||
          trimmed.includes('younger than')
        );

      if (isAdultCheck && mentionsNotEligible && !isStrictlyUnder18) {
        hasAdultNotEligible = true;
        hasRecipeContradiction = true;
      }

      // 3. Under 18 claimed as Eligible:
      const cleanedClause = clauseWithoutNegations.replace(/\bstep\s*\d+\b/gi, '').replace(/^\s*\d+[\.\)]\s*/, '');
      const mentionsUnder18 =
        trimmed.includes('under 18') ||
        trimmed.includes('below 18') ||
        trimmed.includes('less than 18') ||
        trimmed.includes('smaller than 18') ||
        trimmed.includes('younger than 18') ||
        trimmed.includes('< 18') ||
        trimmed.includes('<= 17') ||
        (/\b(?:age\s+|aged\s+|is\s+|==\s*|person\s+of\s+)?(?:1[0-7]|[1-9])\s*(?:years|yr|age)?\b/.test(cleanedClause) &&
         !/\b(?:step|rule|case|option|phase|stage)\s*\d+\b/i.test(clauseWithoutNegations));

      if (mentionsUnder18 && mentionsEligibleAffirmative && !isAdultCheck) {
        hasUnder18Eligible = true;
        hasRecipeContradiction = true;
      }
    }
  }

  // Step 1: Get input age
  const hasInputStep =
    recipeLines.some(line => {
      const l = line.toLowerCase();
      return (l.includes('get') || l.includes('take') || l.includes('read') || l.includes('input') || l.includes('step 1')) &&
             (l.includes('age') || l.includes('input') || l.includes('number') || l.includes('user') || l.includes('person'));
    }) ||
    recipeText.includes('get input age') ||
    recipeText.includes('get the input age') ||
    recipeText.includes('get age') ||
    recipeText.includes('take age') ||
    recipeText.includes('take the person') ||
    recipeText.includes('read age') ||
    recipeText.includes('input age');

  // Step 2: Condition check (age is 18 or older / 18 or above)
  const hasConditionStep =
    recipeText.includes('18') &&
    (
      recipeText.includes('greater than or equal') ||
      recipeText.includes('>=') ||
      recipeText.includes('more than or equal') ||
      recipeText.includes('18 or above') ||
      recipeText.includes('18 or more') ||
      recipeText.includes('18 or older') ||
      recipeText.includes('at least 18') ||
      recipeText.includes('check if age') ||
      recipeText.includes('check whether age') ||
      recipeText.includes('if age is') ||
      recipeText.includes('compare age')
    );

  // Clean text without negations to accurately test Step 3
  const recipeWithoutNegations = recipeText
    .replace(/\b(?:not|non|never)\s+eligible\b/g, ' ')
    .replace(/\botherwise[^\n.]+/g, ' ')
    .replace(/\belse[^\n.]+/g, ' ');

  // Step 3: True outcome (Announce/Display Eligible)
  const hasTrueOutput =
    recipeText.includes('display eligible') ||
    recipeText.includes('announce eligible') ||
    recipeText.includes('show eligible') ||
    recipeText.includes('is eligible') ||
    recipeText.includes('then eligible') ||
    /\b(?:display|announce|show|output)\s+eligible\b/.test(recipeWithoutNegations) ||
    /\beligible\b/.test(recipeWithoutNegations);

  // Step 4: False outcome / otherwise branch (Announce/Display Not Eligible)
  // Step 4 is ONLY considered validly completed if there are no contradictions on not eligible
  const mentionsFalseOutput =
    recipeText.includes('display not eligible') ||
    recipeText.includes('announce not eligible') ||
    recipeText.includes('show not eligible') ||
    recipeText.includes('otherwise display not eligible') ||
    recipeText.includes('otherwise announce not eligible') ||
    recipeText.includes('not eligible');

  const hasFalseOutput = mentionsFalseOutput && !hasBoundaryContradiction && !hasAdultNotEligible && !hasRecipeContradiction;

  const isFullyVerified =
    hasInputStep &&
    hasConditionStep &&
    hasTrueOutput &&
    hasFalseOutput &&
    !hasRecipeContradiction;

  const steps = [
    { stepNumber: 1, title: "Step 1: Take the person's age", completed: hasInputStep, current: !hasInputStep },
    { stepNumber: 2, title: "Step 2: Check whether age is 18 or older", completed: hasConditionStep, current: hasInputStep && !hasConditionStep },
    { stepNumber: 3, title: 'Step 3: If yes, announce Eligible', completed: hasTrueOutput, current: hasInputStep && hasConditionStep && !hasTrueOutput },
    { stepNumber: 4, title: 'Step 4: Otherwise, announce Not Eligible', completed: hasFalseOutput, current: hasInputStep && hasConditionStep && hasTrueOutput && !hasFalseOutput }
  ];

  let feedback = '';
  let correction = '';
  let suggestedInput = '';
  let matchedFirebaseInput = undefined;

  if (hasBoundaryContradiction) {
    feedback = "🌟 Coach Maya here! Take a close look at your Step 3: you wrote 'smaller than or equal to 18 it is not eligible to vote'. But if a person is 18 years old, they ARE eligible to vote! Saying 'smaller than or equal to 18' mistakenly includes 18 in the not-eligible group. You should write strictly 'smaller than 18' (less than 18), or simply: 'Otherwise, announce Not Eligible'.";
    correction = "Step 3: If age is smaller than 18 (or otherwise), announce Not Eligible.";
    suggestedInput = "Step 1: Get the age\nStep 2: If age is greater than or equal to 18, announce Eligible\nStep 3: Otherwise (or if age is smaller than 18), announce Not Eligible";
    matchedFirebaseInput = "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible";
  } else if (hasRecipeContradiction) {
    feedback = "🌟 Coach Maya here! Check your step sequencing: if the age is 18 or older, they should be announced as Eligible, not as Not Eligible! Only announce Not Eligible in the otherwise step.";
    correction = "Step 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible.";
    suggestedInput = "Step 1: Take the person's age\nStep 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    matchedFirebaseInput = "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible";
  } else if (isFullyVerified) {
    feedback = "🌟 Coach Maya here! Kudos! 🎉 Complete step-by-step recipe in simple everyday words! You have specified taking the input, checking if age is 18 or older, and announcing both outcomes clearly. Proceed to the Ingredients stage!";
    correction = "Step 1: Take the person's age\nStep 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    suggestedInput = "Step 1: Take the person's age\nStep 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    matchedFirebaseInput = "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible";
  } else if (!hasInputStep) {
    feedback = "Coach Maya here! Let's start with Step 1 of our recipe: What is the first thing we must obtain from the user? (Step 1: Take the person's age).";
    correction = "Step 1: Take the person's age";
    suggestedInput = "Step 1: Take the person's age";
    matchedFirebaseInput = "what steps to write";
  } else if (!hasConditionStep) {
    feedback = "Great! You have the input age in Step 1. Next for Step 2: Check whether the age meets the requirement of 18 or older.";
    correction = "Step 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    suggestedInput = "Step 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    matchedFirebaseInput = "step 1 : Get input age";
  } else if (!hasTrueOutput || !hasFalseOutput) {
    feedback = "You've set up the check! Now complete the recipe by specifying what to announce for both cases: announce 'Eligible' if 18 or older, and announce 'Not Eligible' otherwise.";
    correction = "Step 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    suggestedInput = "Step 1: Take the person's age\nStep 2: If age is 18 or older, announce Eligible; otherwise, announce Not Eligible";
    matchedFirebaseInput = "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible";
  }

  return {
    isFullyVerified,
    hasRecipeContradiction,
    hasBoundaryContradiction,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput,
    recipeStepProgress: steps
  };
}

/**
 * Validates the Ingredients stage for Voting Eligibility (Problem 11)
 *
 * Target Firebase hint pairs (hints/problem11/ingredients):
 * 1. "what ingredients do we need" -> "Input variable age, and an if-else condition using comparison operator >=."
 * 2. "step 1 : age variable" -> "Spot on! Now, how do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
 * 3. "how to write if condition" -> "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether age is 18 or above\n• L.S : age\n• R.S : 18\n• Operator : >=\nSo 'if' looks like this: if (age >= 18)."
 * 4. "step 2 : If condition with L.S: age, R.S: 18, Operator: >=" -> "Hurray! if (age >= 18). If true print 'Eligible', else print 'Not Eligible'. Proceed to Sample Code."
 */
export function validateVotingEligibilityIngredients(text: string): VotingEligibilityValidationResult {
  const norm = text.toLowerCase().replace(/[^a-z0-9\s><=+\-:\.]/g, ' ').replace(/\s+/g, ' ').trim();

  // Find variable name dynamically if declared (e.g. 'Variable a=25', 'var a=25', 'var age=18', 'let x', etc.)
  const varMatch = text.match(/(?:var|let|const|int|declare|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) ||
                   text.match(/(?:var|let|const|int|variable|input)\s+([a-zA-Z_][a-zA-Z0-9_]*)\b/i) ||
                   text.match(/step\s*1\s*:\s*(?:var|let|const|int|variable)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/i);

  const rawVar = varMatch && varMatch[1] && !['step', 'if', 'else', 'var', 'let', 'const', 'what', 'how', 'when', 'print', 'is', 'it', 'do', 'here'].includes(varMatch[1].toLowerCase())
    ? varMatch[1]
    : 'age';
  const detectedVar = rawVar;
  const detectedVarLower = detectedVar.toLowerCase();

  // Step 1: Input variable (accepts 'age', 'a', 'x', 'n', 'input variable', 'variable a=25', etc.)
  const hasVariable =
    /(?:var|let|const|int|declare|variable)?\s*[a-zA-Z_][a-zA-Z0-9_]*\s*=/i.test(text) ||
    /\b(?:var|let|const|int|variable|input)\b/i.test(text) ||
    /\b(?:age|person_age|user_age|a|n|x|val|number|person)\b/i.test(norm) ||
    norm.includes('step 1') ||
    norm.includes('get input') ||
    norm.includes('input age');

  // Step 2: If condition breakdown (L.S: age/a, Operator: >=, R.S: 18, or if (age >= 18) / if (a >= 18))
  const mentionsVarInCondition =
    norm.includes(detectedVarLower) ||
    norm.includes('age') ||
    norm.includes(' a ') ||
    norm.startsWith('a ') ||
    norm.includes(': a') ||
    norm.includes(':a') ||
    norm.includes('l s a') ||
    norm.includes('l s');

  // Left Side (L.S) check in Step 2:
  const lsMatch = text.match(/(?:left\s*side|\bl\.?s\.?\b)\s*[:=]?\s*\(?\s*([^;\n\r,)]+)\)?/i);
  let wrongLeftSideDetected: string | null = null;
  if (lsMatch) {
    const rawLS = lsMatch[1].trim().replace(/^\(/, '').replace(/\)$/, '').trim();
    if (!/age|person|a\b|var|input/i.test(rawLS) || /^(?:=|>|<|>=|<=|18|\d+)$/.test(rawLS)) {
      wrongLeftSideDetected = rawLS || '(empty)';
    }
  }

  // Operator error detection in Step 2:
  const explicitOperatorMatch = text.match(/operator\s*:?\s*([^;\n\r,]+)/i);
  let wrongOperatorDetected: string | null = null;
  if (explicitOperatorMatch) {
    const rawOp = explicitOperatorMatch[1].trim();
    if (rawOp !== '>=' && !rawOp.includes('>=')) {
      wrongOperatorDetected = rawOp || '(empty)';
    }
  }

  // Right Side (R.S) error detection in Step 2:
  const rsExplicitMatch = text.match(/(?:right\s*side|r\.?s\.?)\s*:?\s*([^;\n\r,]+)/i);
  let wrongRightSideDetected: string | null = null;
  if (rsExplicitMatch) {
    const rawRS = rsExplicitMatch[1].trim();
    if (!/\b18\b/.test(rawRS)) {
      wrongRightSideDetected = rawRS || '(empty)';
    }
  }

  const mentions18InCondition = norm.includes('18') || norm.includes('eighteen');

  const hasLeftRightCondition =
    !wrongLeftSideDetected &&
    !wrongOperatorDetected &&
    !wrongRightSideDetected &&
    mentions18InCondition &&
    (
      (norm.includes('l s') && norm.includes('r s') && norm.includes('operator')) ||
      (norm.includes('left side') && norm.includes('right side')) ||
      (norm.includes('l.s') && norm.includes('r.s')) ||
      (mentionsVarInCondition && (norm.includes('>=') || norm.includes('greater') || norm.includes('more than') || norm.includes('operator')) && norm.includes('18')) ||
      /\bif\s*\(?\s*(?:age|[a-zA-Z_]\w*)\s*>=\s*18\s*\)?/i.test(text) ||
      /(?:age|[a-zA-Z_]\w*)\s*>=\s*18/i.test(text)
    );

  const textWithoutNegations = norm
    .replace(/\b(?:not|non|never)\s+eligible\b/g, ' ')
    .replace(/\bineligible\b/g, ' ');

  // Quotes detection for print statements:
  // If the user uses function-call syntax like print(...) or display(...) without quotation marks:
  const hasUnquotedPositivePrint =
    /(?:print|display|announce|echo|printf|console\.log)\s*\(\s*(?!["'`\u201c\u201d])[^)\n]*(?:eligible|can\s*vote)[^)\n]*\)/i.test(text);

  const hasUnquotedNegativePrint =
    /(?:print|display|announce|echo|printf|console\.log)\s*\(\s*(?!["'`\u201c\u201d])[^)\n]*(?:not\s*eligible|cannot\s*vote|ineligible)[^)\n]*\)/i.test(text);

  const hasUnquotedPrint = hasUnquotedPositivePrint || hasUnquotedNegativePrint;

  // Step 3: Inside if block print "Eligible"
  const hasTruePrint =
    !hasUnquotedPositivePrint &&
    (norm.includes('print eligible') ||
     norm.includes('display eligible') ||
     norm.includes('announce eligible') ||
     norm.includes('inside if') ||
     norm.includes('if block') ||
     norm.includes('true print') ||
     /\b(?:print|display|announce)\s*\(?['"]?eligible['"]?\)?\b/.test(textWithoutNegations) ||
     /\beligible\b/.test(textWithoutNegations));

  // Step 4: Inside else block print "Not Eligible"
  const hasFalsePrint =
    !hasUnquotedNegativePrint &&
    (norm.includes('print not eligible') ||
     norm.includes('display not eligible') ||
     norm.includes('announce not eligible') ||
     norm.includes('inside else') ||
     norm.includes('else block') ||
     norm.includes('false print') ||
     norm.includes('not eligible'));

  const isFullyVerified =
    hasVariable &&
    hasLeftRightCondition &&
    hasTruePrint &&
    hasFalsePrint &&
    !hasUnquotedPrint;

  const steps = [
    { stepNumber: 1, title: `Step 1: Input variable ${detectedVar}`, completed: hasVariable, current: !hasVariable },
    { stepNumber: 2, title: `Step 2: If condition (L.S: ${detectedVar}, Operator: >=, R.S: 18)`, completed: hasLeftRightCondition, current: hasVariable && !hasLeftRightCondition },
    { 
      stepNumber: 3, 
      title: hasUnquotedPositivePrint ? 'Step 3: Print "Eligible" (Quotes needed!)' : 'Step 3: Inside if block: print("Eligible")', 
      completed: hasTruePrint, 
      current: hasVariable && hasLeftRightCondition && !hasTruePrint 
    },
    { 
      stepNumber: 4, 
      title: hasUnquotedNegativePrint ? 'Step 4: Print "Not Eligible" (Quotes needed!)' : 'Step 4: Inside else block: print("Not Eligible")', 
      completed: hasFalsePrint, 
      current: hasVariable && hasLeftRightCondition && hasTruePrint && !hasFalsePrint 
    }
  ];

  let feedback = '';
  let correction = '';
  let suggestedInput = '';
  let matchedFirebaseInput = undefined;

  if (isFullyVerified) {
    feedback = `🌟 Coach Maya here! Hurray! 🎉 You have identified all the ingredients: variable \`${detectedVar}\`, condition \`if (${detectedVar} >= 18)\`, printing 'Eligible' inside if, and printing 'Not Eligible' inside else! Proceed to Taste the Sample stage to build the code!`;
    correction = `step 1 : ${detectedVar} variable\nstep 2 : If condition with L.S: ${detectedVar}, R.S: 18, Operator: >=\nstep 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")`;
    suggestedInput = `step 1 : ${detectedVar} variable\nstep 2 : If condition with L.S: ${detectedVar}, R.S: 18, Operator: >=\nstep 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")`;
    matchedFirebaseInput = "step 2 : If condition with L.S: age, R.S: 18, Operator: >=";
  } else if (hasUnquotedPrint) {
    feedback = `🌟 Coach Maya syntax alert: Look closely at your \`print(...)\` statement! In programming, any text message (string literal) inside \`print(...)\` must be enclosed in quotation marks: \`print("Eligible")\` and \`print("Not Eligible")\`. Without quotes, the computer treats them as undefined variables and gives a syntax error!`;
    correction = `step 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")`;
    suggestedInput = `step 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")`;
    matchedFirebaseInput = "how to write if condition";
  } else if (!hasVariable) {
    feedback = "Coach Maya here! Let's start with Step 1 of Ingredients: What variable do we need to store the person's age? (e.g. `Step 1: Variable a=25` or `Step 1: Variable age`).";
    correction = "step 1 : age variable";
    suggestedInput = "step 1 : age variable";
    matchedFirebaseInput = "what ingredients do we need";
  } else if (!hasLeftRightCondition) {
    if (wrongLeftSideDetected) {
      feedback = `🌟 Coach Maya checking Step 2 Left Side: Look at your Left Side (L.S)! You wrote \`Left side: ${wrongLeftSideDetected}\`. The Left Side of the comparison must be our input variable \`${detectedVar}\` (e.g. \`Left side: ${detectedVar}\` or \`L.S: ${detectedVar}\`).`;
    } else if (wrongOperatorDetected) {
      let operatorTip = `You wrote \`operator: ${wrongOperatorDetected}\`.`;
      if (wrongOperatorDetected === '<' || wrongOperatorDetected === '<=') {
        operatorTip += ` Using \`${wrongOperatorDetected}\` tests if someone is under 18. But for voting eligibility, we test if the person is 18 or older, which requires \`>=\` (\`operator: >=\`).`;
      } else if (wrongOperatorDetected === '>') {
        operatorTip += ` Using strictly \`>\` leaves out age 18! An 18-year-old **is eligible to vote**, so use \`>=\` (\`operator: >=\`).`;
      } else {
        operatorTip += ` To test if someone is 18 or older, use the greater-than-or-equal operator \`>=\` (\`operator: >=\`).`;
      }
      feedback = `🌟 Coach Maya operator check: ${operatorTip}`;
    } else if (wrongRightSideDetected) {
      feedback = `🌟 Coach Maya checking Step 2 Right Side: Look at your Right Side (R.S)! You wrote \`right side: ${wrongRightSideDetected}\`. In the condition \`age >= 18\`, the Right Side is the voting threshold number **18** (\`right side: 18\` or \`R.S: 18\`).`;
    } else {
      const isAskingQuestion = /\b(?:what|how|why|where|next|stuck|do here)\b/i.test(text);
      feedback = isAskingQuestion
        ? `🌟 Coach Maya here! You have already identified your input variable \`${detectedVar}\` in Step 1! 🎉 For what to do next in Step 2: we need to break down the \`if\` condition to test if the person is 18 or older. Break it down into Left Side (L.S: ${detectedVar}), Operator (>=), and Right Side (R.S: 18).`
        : `🌟 Coach Maya here! Spot on! You have identified the input variable \`${detectedVar}\` in Step 1! 🎉 Now for Step 2: How do you write the \`if\` condition? Break it down into Left Side (L.S: ${detectedVar}), Operator (>=), and Right Side (R.S: 18).`;
    }
    correction = `step 2 : If condition with L.S: ${detectedVar}, R.S: 18, Operator: >=`;
    suggestedInput = `step 2 : If condition with L.S: ${detectedVar}, R.S: 18, Operator: >=`;
    matchedFirebaseInput = "step 1 : age variable";
  } else if (!hasTruePrint) {
    feedback = `Awesome condition! Step 3: Inside the 'if' block, what print statement runs when (${detectedVar} >= 18) is true?`;
    correction = 'step 3 : Inside if block: print("Eligible")';
    suggestedInput = 'step 3 : Inside if block: print("Eligible")';
    matchedFirebaseInput = "how to write if condition";
  } else if (!hasFalsePrint) {
    feedback = "Almost done! Step 4: Inside the 'else' block, what print statement runs when the condition is false?";
    correction = 'step 4 : Inside else block: print("Not Eligible")';
    suggestedInput = 'step 4 : Inside else block: print("Not Eligible")';
    matchedFirebaseInput = "step 2 : If condition with L.S: age, R.S: 18, Operator: >=";
  }

  return {
    isFullyVerified,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput,
    ingredientsStepProgress: steps
  };
}

/**
 * Validates the Sample Code stage for Voting Eligibility (Problem 11)
 *
 * Target Firebase hint pairs (hints/problem11/samplecode):
 * 1. "how to write sample code" -> "Draft the code comparing age with 18.\nExample:\nvar age = 20;\nif (age >= 18) print(\"Eligible\");\nelse print(\"Not Eligible\");"
 * 2. "var age = 20; if (age >= 18) print(\"Eligible\"); else print(\"Not Eligible\");" -> "You gotcha! Perfect condition checking."
 */
export function validateVotingEligibilitySampleCode(text: string): VotingEligibilitySampleValidationResult {
  const norm = text.toLowerCase();

  const varMatch = text.match(/(?:var|let|const|int)?\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/i) ||
                   text.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:int\s*\(\s*)?input/i);
  const detectedVar = varMatch ? varMatch[1] : 'age';

  const hasInputVar =
    /(?:var|let|const|int)?\s*(?:age|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\d+/i.test(text) ||
    /(?:age|[a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:int\s*\(\s*)?input/i.test(text);

  const hasCondition =
    /if\s*\(?.*?(?:18|17)/i.test(text) && (/>=|>/i.test(text));

  // Quoted positive print check: print("Eligible")
  const hasQuotedPositivePrint =
    /(?:print|console\.log|printf|cout)\s*\(\s*["'`\u201c\u201d][^"'`\u201c\u201d\n]*(?:eligible|can\s*vote|yes)[^"'`\u201c\u201d\n]*["'`\u201c\u201d]\s*\)/i.test(text);

  const hasAnyPositivePrint =
    /(?:print|console\.log|printf|cout)\s*\(?.*?(?:eligible|can\s*vote|yes)/i.test(text);

  const hasUnquotedPositivePrint = hasAnyPositivePrint && !hasQuotedPositivePrint;

  // Detect syntax error: in programming, `else` keyword CANNOT take a condition or parentheses like `else(a <= 18)`!
  const hasElseWithCondition = /\belse\s*\([^)]*\)/i.test(text);

  // Detect boundary bug: <= 18 contradicts >= 18 at 18 (18 is eligible, not ineligible)
  const hasElseBoundaryError = /\belse\s*(?:if)?\s*\(?\s*(?:age|[a-zA-Z_]\w*)\s*<=\s*18/i.test(text);

  // Clean Else branch check: requires proper else keyword without illegal condition
  const hasElse = /else\b/i.test(text) && !hasElseWithCondition && !hasElseBoundaryError;

  // Quoted negative print check: print("Not Eligible")
  const hasQuotedNegativePrint =
    /(?:print|console\.log|printf|cout)\s*\(\s*["'`\u201c\u201d][^"'`\u201c\u201d\n]*(?:not\s*eligible|cannot\s*vote|no)[^"'`\u201c\u201d\n]*["'`\u201c\u201d]\s*\)/i.test(text);

  const hasAnyNegativePrint =
    /(?:print|console\.log|printf|cout)\s*\(?.*?(?:not\s*eligible|cannot\s*vote|no)/i.test(text);

  const hasUnquotedNegativePrint = hasAnyNegativePrint && !hasQuotedNegativePrint;

  const allVerified =
    hasInputVar &&
    hasCondition &&
    hasQuotedPositivePrint &&
    hasElse &&
    hasQuotedNegativePrint;

  const steps = [
    { stepNumber: 1, title: `Step 1: Declare input variable (var ${detectedVar} = 20)`, completed: hasInputVar, current: !hasInputVar },
    { stepNumber: 2, title: `Step 2: Check condition if (${detectedVar} >= 18)`, completed: hasCondition, current: hasInputVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Print "Eligible" (with quotes) if true', completed: hasQuotedPositivePrint, current: hasInputVar && hasCondition && !hasQuotedPositivePrint },
    { 
      stepNumber: 4, 
      title: hasElseWithCondition 
        ? "Step 4: Else branch (Syntax error: 'else' cannot take condition)" 
        : (hasElseBoundaryError ? "Step 4: Else branch (18 is eligible, use 'else {' without <= 18)" : 'Step 4: Else branch'), 
      completed: hasElse, 
      current: hasInputVar && hasCondition && hasQuotedPositivePrint && !hasElse 
    },
    { stepNumber: 5, title: 'Step 5: Print "Not Eligible" (with quotes) if false', completed: hasQuotedNegativePrint, current: hasInputVar && hasCondition && hasQuotedPositivePrint && hasElse && !hasQuotedNegativePrint }
  ];

  if (allVerified) {
    const allDone = steps.map(s => ({ ...s, completed: true, current: false }));
    return {
      allVerified: true,
      hasInputVar,
      hasCondition,
      hasPositivePrint: hasQuotedPositivePrint,
      hasElse,
      hasNegativePrint: hasQuotedNegativePrint,
      hasElseWithCondition: false,
      hasElseBoundaryError: false,
      matchedFirebaseInput: `var ${detectedVar} = 20; if (${detectedVar} >= 18) print("Eligible"); else print("Not Eligible");`,
      feedback: "🌟 Coach Maya here! You gotcha! 🎉 Perfect condition checking! You have successfully implemented voting eligibility checking with comparison operator >=, proper quotation marks, and clean branching. You are ready to run and test!",
      sampleCodeStepProgress: allDone,
      correction: "Sample code prototype completed!",
      suggestedInput: undefined
    };
  }

  let feedback = '';
  let correction = '';
  let suggestedInput = undefined;

  if (hasElseWithCondition) {
    feedback = `🌟 Coach Maya syntax alert: Look closely at your \`else\` statement: \`else(...)\`! 🔍 In programming languages, the \`else\` keyword cannot take a condition or parentheses! It acts as the automatic fallback for all other cases, so write it simply as \`else {\` without any condition in parentheses. (Also note: age 18 is eligible, so \`<= 18\` would incorrectly include 18 as not eligible).`;
    correction = `else {\n  print("Not eligible");\n}`;
    suggestedInput = `else {\n  print("Not eligible");\n}`;
  } else if (hasElseBoundaryError) {
    feedback = `🌟 Coach Maya logic alert: Look at the condition in your else branch! Age 18 is legally eligible to vote. If you check \`<= 18\`, then someone who is exactly 18 would also be marked 'Not eligible'! Simply use \`else {\` for all remaining cases (or \`else if (${detectedVar} < 18)\`).`;
    correction = `else {\n  print("Not eligible");\n}`;
    suggestedInput = `else {\n  print("Not eligible");\n}`;
  } else if (!hasInputVar) {
    feedback = `Coach Maya here! Let's start with Step 1 of our sample code: Declare an input variable with a test age (e.g. \`var ${detectedVar} = 20;\`).`;
    correction = `var ${detectedVar} = 20;`;
    suggestedInput = `var ${detectedVar} = 20;`;
  } else if (!hasCondition) {
    feedback = `Coach Maya here! Great start with variable \`${detectedVar}\`! For Step 2: Check if \`${detectedVar}\` is 18 or above using: \`if (${detectedVar} >= 18) {\`.`;
    correction = `if (${detectedVar} >= 18) {`;
    suggestedInput = `if (${detectedVar} >= 18) {`;
  } else if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      feedback = `Coach Maya here! You wrote the print statement, but notice that text messages in programming must be enclosed in quotation marks: \`print("Eligible")\`. Without quotes, it causes a syntax error!`;
      correction = `  print("Eligible");\n}`;
      suggestedInput = `  print("Eligible");\n}`;
    } else {
      feedback = `Coach Maya here! Great job with the condition! Now for Step 3: Inside the if block, display the eligible message: \`print("Eligible");\`.`;
      correction = `  print("Eligible");\n}`;
      suggestedInput = `  print("Eligible");\n}`;
    }
  } else if (!hasElse) {
    feedback = `Coach Maya here! You've got the condition and true branch! Now for Step 4: Add the \`else\` branch to handle ages under 18: \`else {\`.`;
    correction = `else {\n  print("Not Eligible");\n}`;
    suggestedInput = `else {\n  print("Not Eligible");\n}`;
  } else if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      feedback = `Coach Maya here! Inside the \`else\` block, make sure to wrap your message in quotation marks: \`print("Not Eligible")\`.`;
      correction = `  print("Not Eligible");\n}`;
      suggestedInput = `  print("Not Eligible");\n}`;
    } else {
      feedback = `Coach Maya here! Almost done! For Step 5: Inside the else block, print the not eligible message: \`print("Not Eligible");\`.`;
      correction = `  print("Not Eligible");\n}`;
      suggestedInput = `  print("Not Eligible");\n}`;
    }
  }

  return {
    allVerified: false,
    hasInputVar,
    hasCondition,
    hasPositivePrint: hasQuotedPositivePrint,
    hasElse,
    hasNegativePrint: hasQuotedNegativePrint,
    hasElseWithCondition,
    hasElseBoundaryError,
    sampleCodeStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput: undefined
  };
}
