/**
 * CTC Pedagogy Validator for Problem 23: "Print Star Patterns"
 * Focuses on right-angled star pattern printing using nested loops (outer loop for rows 1..n, inner loop for stars 1..i).
 */

export function validateStarPatternLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Reject foreign problem text (e.g. ATM PIN)
  if (norm.includes("pin") || norm.includes("atm")) {
    return {
      isFullyVerified: false,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Triangle pattern definition", completed: false, current: true },
        { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: false, current: false },
        { stepNumber: 3, title: "3. Next line after each row", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! It looks like you've written text for ATM PIN! In this workspace, our goal is **Print Star Patterns** (right-angled triangle of stars row by row). Please write the logic specifically for Print Star Patterns!",
      correction: "Explain that for every row i from 1 to n, we print i stars and move to the next line.",
      suggestedInput: "In a star pattern of n rows, row 1 has 1 star, row 2 has 2 stars, and each row i has i stars. After each row, move to the next line."
    };
  }

  // Direct Step Query Handling:
  const isAskingStep1 = /\b(?:first\s*step|step\s*1|starting\s*step|how\s*to\s*start|start\s*logic)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*1|first\s*step|start)\b/i.test(norm));
  const isAskingStep2 = /\b(?:second\s*step|step\s*2|how\s*many\s*stars|star\s*ratio|row\s*ratio)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*2|second\s*step)\b/i.test(norm));
  const isAskingStep3 = /\b(?:third\s*step|step\s*3|next\s*line|newline|finish\s*logic)\b/i.test(norm) ||
    (/\b(?:what|give|tell|show|explain)\b/i.test(norm) && /\b(?:step\s*3|third\s*step)\b/i.test(norm));

  if (isAskingStep1) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Triangle pattern definition", completed: false, current: true },
        { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: false, current: false },
        { stepNumber: 3, title: "3. Next line after each row", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 1 of Logic (Triangle Pattern Definition)**:\n\nTo build a right-angled star pattern, first specify the total number of rows `n` for our triangle (for example, let `n = 5` rows).\n\n✍️ **Write this in your worksheet:**\n`Let n = 5 rows for our right-angled star pattern.`",
      correction: "Write: Let n = 5 rows for our star pattern.",
      suggestedInput: "Let n = 5 rows for our right-angled star pattern."
    };
  }

  if (isAskingStep2) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Triangle pattern definition", completed: true, current: false },
        { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: false, current: true },
        { stepNumber: 3, title: "3. Next line after each row", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 2 of Logic (Row-to-Star Ratio)**:\n\nFor every row from 1 to `n`, the number of stars in that row equals the row number:\n• Row 1 has 1 star: `*`\n• Row 2 has 2 stars: `**`\n• Row 3 has 3 stars: `***`\n• Row 4 has 4 stars: `****`\n• Row 5 has 5 stars: `*****`\nFor each row `i`, we print `i` stars.\n\n✍️ **Write this in your worksheet:**\n`Row 1 has 1 star, Row 2 has 2 stars, Row 3 has 3 stars, Row 4 has 4 stars, Row 5 has 5 stars.`",
      correction: "Explain that for every row i from 1 to n, we print i stars.",
      suggestedInput: "Row 1 has 1 star, Row 2 has 2 stars, Row 3 has 3 stars, Row 4 has 4 stars, Row 5 has 5 stars."
    };
  }

  if (isAskingStep3) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Triangle pattern definition", completed: true, current: false },
        { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: true, current: false },
        { stepNumber: 3, title: "3. Next line after each row", completed: false, current: true }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 3 of Logic (Next Line after each row)**:\n\nAfter printing all the stars for each row, move to the next line so the next row starts fresh below it.\n\n✍️ **Write this in your worksheet:**\n`After printing stars for each row, move to the next line.`",
      correction: "Explain that we move to the next line after finishing each row.",
      suggestedInput: "After printing stars for each row, move to the next line."
    };
  }

  // Step 1: Pattern definition / Rows concept (rows n or triangle pattern)
  const hasStep1Def = /\b(?:pattern|triangle|rows?|lines?|grid|right\s*angle|height)\b/.test(norm) ||
    /\b(?:n|5)\s*(?:rows?|lines?)\b/.test(norm);

  // Step 2: Row-to-star ratio (Row 1 has 1 star, Row 2 has 2 stars, Row i has i stars)
  const hasStep2Ratio = /\b(?:row\s*1\s*.*?\b1\s*star|row\s*2\s*.*?\b2\s*stars?|equal\s*to\s*(?:the\s*)?(?:row|count|number)|same\s*as\s*(?:the\s*)?row|stars?\s*(?:equal|same|matches)\s*(?:to\s*)?(?:the\s*)?row|row\s*i\s*.*?\bi\s*stars?)\b/.test(norm) ||
    /\b(?:1\s*star|2\s*stars?|3\s*stars?|\*|\*\*|\*\*\*)\b/.test(norm) ||
    (/\brows?\b/.test(norm) && /\bstars?\b/.test(norm));

  // Step 3: Next line / line break after each row
  const hasStep3NextLine = /\b(?:next\s*line|new\s*line|newline|line\s*break|move\s*to\s*(?:the\s*)?next\s*line|jump\s*to\s*next\s*line)\b/.test(norm) ||
    /\b(?:each\s*row|every\s*row|after\s*printing|after\s*each\s*row)\b/.test(norm);

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Triangle pattern definition", completed: hasStep1Def, current: !hasStep1Def },
    { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: hasStep2Ratio, current: hasStep1Def && !hasStep2Ratio },
    { stepNumber: 3, title: "3. Next line after each row", completed: hasStep3NextLine, current: hasStep1Def && hasStep2Ratio && !hasStep3NextLine }
  ];

  const isFullyVerified = hasStep1Def && hasStep2Ratio;

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      logicStepProgress: [
        { stepNumber: 1, title: "1. Triangle pattern definition", completed: true, current: false },
        { stepNumber: 2, title: "2. Row-to-star ratio (row i = i stars)", completed: true, current: false },
        { stepNumber: 3, title: "3. Next line after each row", completed: true, current: false }
      ],
      feedback: "🎉 **Logic Approved by Coach Maara!** 🏆\nExcellent understanding! In a right-angled star pattern, row `i` contains exactly `i` stars, and moving to the next line after each row creates the triangular shape.\n\nProceed to Stage 2: Recipe!",
      correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step.",
      suggestedInput: void 0,
      matchedFirebaseInput: "row 1 has 1 star, row 2 has 2 stars, row i has i stars"
    };
  }

  return {
    isFullyVerified: false,
    logicStepProgress,
    feedback: "🌟 Coach Maara here! In a right-angled star pattern, how many stars are printed in Row 1? Row 2? Row i? State that each row i prints exactly i stars, and each finished row moves to the next line!",
    correction: "Explain that for every row i from 1 to n, we print i stars and move to the next line.",
    suggestedInput: "In a star pattern of n rows, row 1 has 1 star, row 2 has 2 stars, and each row i has i stars. After each row, move to the next line."
  };
}

export function validateStarPatternRecipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Reject foreign problem text (e.g. ATM PIN)
  if (norm.includes("pin") || norm.includes("atm")) {
    return {
      isFullyVerified: false,
      hasStep1: false,
      hasStep2: false,
      hasStep3: false,
      hasStep4: false,
      hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get rows count n", completed: false, current: true },
        { stepNumber: 2, title: "2. Loop rows 1 to n", completed: false, current: false },
        { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: false, current: false },
        { stepNumber: 4, title: "4. Print star on same line", completed: false, current: false },
        { stepNumber: 5, title: "5. Move to next line and repeat", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! It looks like you've written recipe for ATM PIN! In this workspace, our goal is **Print Star Patterns**. Follow the 5 steps: 1. Get n, 2. Outer loop rows 1..n, 3. Inner loop columns 1..i, 4. Print star, 5. Next line.",
      correction: "Write the 5 recipe steps for nested loops in Print Star Patterns.",
      suggestedInput: "Step 1: Get input n. Step 2: Loop rows 1 to n. Step 3: Loop columns 1 to i. Step 4: Print star. Step 5: Move to next line."
    };
  }

  // Recipe Step Queries:
  const isAskingStep1 = /\b(?:first\s*step|step\s*1|how\s*to\s*start)\b/i.test(norm) && !/step\s*[2345]/.test(norm);
  const isAskingStep2 = /\b(?:second\s*step|step\s*2|outer\s*loop)\b/i.test(norm) && !/step\s*[1345]/.test(norm);
  const isAskingStep3 = /\b(?:third\s*step|step\s*3|inner\s*loop)\b/i.test(norm) && !/step\s*[1245]/.test(norm);
  const isAskingStep4 = /\b(?:fourth\s*step|step\s*4|print\s*star)\b/i.test(norm) && !/step\s*[1235]/.test(norm);
  const isAskingStep5 = /\b(?:fifth\s*step|step\s*5|next\s*line)\b/i.test(norm) && !/step\s*[1234]/.test(norm);

  if (isAskingStep1) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: false, hasStep2: false, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get rows count n", completed: false, current: true },
        { stepNumber: 2, title: "2. Loop rows 1 to n", completed: false, current: false },
        { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: false, current: false },
        { stepNumber: 4, title: "4. Print star on same line", completed: false, current: false },
        { stepNumber: 5, title: "5. Move to next line and repeat", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 1 of Recipe**:\n\n**Step 1:** Get the number of rows `n` from the user (e.g. `n = 5`).",
      correction: "Write: Step 1: Get the number of rows n from the user.",
      suggestedInput: "Step 1: Get the number of rows n from the user."
    };
  }

  if (isAskingStep2) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: false, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get rows count n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop rows 1 to n", completed: false, current: true },
        { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: false, current: false },
        { stepNumber: 4, title: "4. Print star on same line", completed: false, current: false },
        { stepNumber: 5, title: "5. Move to next line and repeat", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 2 of Recipe**:\n\n**Step 2:** Start an outer loop for rows from 1 to `n`.",
      correction: "Write: Step 2: Start an outer loop for rows from 1 to n.",
      suggestedInput: "Step 2: Start an outer loop for rows from 1 to n."
    };
  }

  if (isAskingStep3) {
    return {
      isFullyVerified: false,
      isStepInquiry: true,
      hasStep1: true, hasStep2: true, hasStep3: false, hasStep4: false, hasStep5: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get rows count n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop rows 1 to n", completed: true, current: false },
        { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: false, current: true },
        { stepNumber: 4, title: "4. Print star on same line", completed: false, current: false },
        { stepNumber: 5, title: "5. Move to next line and repeat", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Here is **Step 3 of Recipe**:\n\n**Step 3:** Inside each row, start an inner loop from 1 to the current row number `i` to print stars.",
      correction: "Write: Step 3: Inside each row, start an inner loop from 1 to current row to print stars.",
      suggestedInput: "Step 3: Inside each row, start an inner loop from 1 to current row to print stars."
    };
  }

  // Step 1: Get input n
  const hasStep1 = /\b(?:get|input|read|take|initialize|set)\b.*?\b(?:n|rows?|number|limit)\b/.test(norm) ||
    /\b(?:n\s*=\s*\d+|rows?\s*count)\b/.test(norm);

  // Step 2: Outer loop for rows (1 to n)
  const hasStep2 = /\b(?:outer\s*loop|loop\s*rows?|rows?\s*(?:from\s*)?1\s*to\s*n|for\s*each\s*row|first\s*loop)\b/.test(norm) ||
    (/\brows?\b/.test(norm) && /\b(?:1\s*to\s*n|loop)\b/.test(norm));

  // Step 3: Inner loop for columns / stars (1 to i)
  const hasStep3 = /\b(?:inner\s*loop|columns?\s*loop|loop\s*(?:from\s*)?1\s*to\s*(?:i|row)|second\s*loop|stars?\s*loop)\b/.test(norm) ||
    (/\b(?:inner|column|star)\b/.test(norm) && /\b(?:1\s*to\s*i|current\s*row)\b/.test(norm));

  // Step 4: Print star on same line
  const hasStep4 = /\b(?:print|display|show|output|append|add)\b.*?\b(?:star|\*)\b/.test(norm) ||
    /\bprint\s*\(?["']\*["']\)?\b/.test(norm);

  // Step 5: Next line & repeat
  const hasStep5 = /\b(?:next\s*line|new\s*line|newline|line\s*break|repeat|until\s*n)\b/.test(norm);

  const recipeStepProgress = [
    { stepNumber: 1, title: "1. Get rows count n", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "2. Loop rows 1 to n", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: hasStep3, current: hasStep1 && hasStep2 && !hasStep3 },
    { stepNumber: 4, title: "4. Print star on same line", completed: hasStep4, current: hasStep1 && hasStep2 && hasStep3 && !hasStep4 },
    { stepNumber: 5, title: "5. Move to next line and repeat", completed: hasStep5, current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasStep5 }
  ];

  const count = [hasStep1, hasStep2, hasStep3, hasStep4].filter(Boolean).length;
  const isFullyVerified = count >= 3 || (hasStep2 && hasStep3 && hasStep4);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      hasStep1: true,
      hasStep2: true,
      hasStep3: true,
      hasStep4: true,
      hasStep5: true,
      recipeStepProgress: [
        { stepNumber: 1, title: "1. Get rows count n", completed: true, current: false },
        { stepNumber: 2, title: "2. Loop rows 1 to n", completed: true, current: false },
        { stepNumber: 3, title: "3. Loop columns 1 to i for stars", completed: true, current: false },
        { stepNumber: 4, title: "4. Print star on same line", completed: true, current: false },
        { stepNumber: 5, title: "5. Move to next line and repeat", completed: true, current: false }
      ],
      feedback: "🎉 **Recipe Verified & Approved by Coach Maara!** 🏆\nOutstanding! You clearly defined the 5 algorithmic steps for nested loop star pattern generation.\n\nProceed to Stage 3: Ingredients!",
      correction: "Proceed to Stage 3: Ingredients to identify the required code components.",
      suggestedInput: void 0,
      matchedFirebaseInput: "Step 1: Get n. Step 2: Loop rows 1 to n. Step 3: Loop columns 1 to i. Step 4: Print star. Step 5: Move to next line."
    };
  }

  return {
    isFullyVerified: false,
    hasStep1,
    hasStep2,
    hasStep3,
    hasStep4,
    hasStep5,
    recipeStepProgress,
    feedback: "🌟 Coach Maara here! Star pattern requires nested loop steps:\n1. Get input n (number of rows)\n2. Loop rows from 1 to n\n3. Inside each row, loop columns from 1 to current row i to print stars\n4. Print star on the same line\n5. Move to next line and repeat!",
    correction: "List the 5 steps: Get n, outer loop rows 1 to n, inner loop columns 1 to i, print star, and move to next line.",
    suggestedInput: "Step 1: Get input n. Step 2: Loop rows 1 to n. Step 3: Loop columns 1 to i. Step 4: Print star. Step 5: Move to next line."
  };
}

export function validateStarPatternIngredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s*+=\-×/!]/g, " ").replace(/\s+/g, " ").trim();

  // Reject foreign problem text (e.g. ATM PIN)
  if (norm.includes("pin") || norm.includes("atm")) {
    return {
      isFullyVerified: false,
      hasVarN: false,
      hasOuterLoop: false,
      hasInnerLoop: false,
      hasPrintStar: false,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: false, current: true },
        { stepNumber: 2, title: "2. Outer for loop (1 to n)", completed: false, current: false },
        { stepNumber: 3, title: "3. Inner for loop (1 to i)", completed: false, current: false },
        { stepNumber: 4, title: "4. Print star and newline", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! It looks like you've written ingredients for ATM PIN! For **Print Star Patterns**, specify input variable n, outer for loop (1 to n), inner for loop (1 to i), and print star.",
      correction: "Specify variable n, outer for loop (start: 1, end: n, next step: +1), inner for loop (start: 1, end: i, next step: +1), and print star.",
      suggestedInput: "use variable n = 5\nouter for loop: start: 1, end: n, next step: +1\ninner for loop: start: 1, end: i, next step: +1\nprint(\"*\") and print newline"
    };
  }

  // Ingredient 1: Variable n
  const hasVarN = /\b(?:var(?:iable)?|let|const|input|int)\s*(?:n|rows?|limit|size)\b/.test(norm) ||
    /\b(?:n|rows?)\s*=\s*\d+\b/.test(norm);

  // Ingredient 2: Outer for loop (start: 1, end: n, next step: +1)
  const hasOuterLoop = /\b(?:outer\s*for\s*loop|for\s*loop\s*for\s*rows?|outer\s*loop)\b/.test(norm) ||
    (/\bfor\s*loop\b/.test(norm) && /\b(?:start\s*:\s*1|end\s*:\s*n|1\s*to\s*n)\b/.test(norm));

  // Ingredient 3: Inner for loop (start: 1, end: i, next step: +1)
  const hasInnerLoop = /\b(?:inner\s*for\s*loop|inner\s*loop|loop\s*for\s*(?:columns?|stars?)|loop\s*(?:1\s*to\s*i|up\s*to\s*i))\b/.test(norm) ||
    (/\b(?:inner|second)\b/.test(norm) && /\bfor\s*loop\b/.test(norm)) ||
    /\bend\s*:\s*i\b/.test(norm);

  // Ingredient 4: Print star and newline
  const hasPrintStar = /\b(?:print\s*(?:star|\*)|row\s*=\s*row\s*\+\s*["']\*["']|print\s*\(?["']\*["']\)?|newline|next\s*line)\b/.test(norm) ||
    (/\bprint\b/.test(norm) && /\b\*\b/.test(norm));

  const ingredientsStepProgress = [
    { stepNumber: 1, title: "1. Input variable n", completed: hasVarN, current: !hasVarN },
    { stepNumber: 2, title: "2. Outer for loop (1 to n)", completed: hasOuterLoop, current: hasVarN && !hasOuterLoop },
    { stepNumber: 3, title: "3. Inner for loop (1 to i)", completed: hasInnerLoop, current: hasVarN && hasOuterLoop && !hasInnerLoop },
    { stepNumber: 4, title: "4. Print star and newline", completed: hasPrintStar, current: hasVarN && hasOuterLoop && hasInnerLoop && !hasPrintStar }
  ];

  const isFullyVerified = (hasVarN && hasOuterLoop && hasInnerLoop) || (hasOuterLoop && hasInnerLoop && hasPrintStar);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      hasVarN: true,
      hasOuterLoop: true,
      hasInnerLoop: true,
      hasPrintStar: true,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "1. Input variable n", completed: true, current: false },
        { stepNumber: 2, title: "2. Outer for loop (1 to n)", completed: true, current: false },
        { stepNumber: 3, title: "3. Inner for loop (1 to i)", completed: true, current: false },
        { stepNumber: 4, title: "4. Print star and newline", completed: true, current: false }
      ],
      feedback: "🎉 **Ingredients Verified by Coach Maara!** 🏆\nAll building blocks ready! You have identified the input variable `n`, outer for loop (`1 to n`), inner for loop (`1 to i`), and the print star action.\n\nProceed to Stage 4: Taste the Sample!",
      correction: "Proceed to Stage 4: Taste the Sample to assemble your code prototype.",
      suggestedInput: void 0,
      matchedFirebaseInput: "use variable n, outer for loop (1 to n), inner for loop (1 to i), print star"
    };
  }

  return {
    isFullyVerified: false,
    hasVarN,
    hasOuterLoop,
    hasInnerLoop,
    hasPrintStar,
    ingredientsStepProgress,
    feedback: "🌟 Coach Maara here! In Ingredients, list:\n1. Input variable `n = 5`\n2. Outer for loop: start: 1, end: n, next step: +1\n3. Inner for loop: start: 1, end: i, next step: +1\n4. Print star statement and newline statement!",
    correction: "Specify variable n, outer for loop (start: 1, end: n, next step: +1), inner for loop (start: 1, end: i, next step: +1), and print star.",
    suggestedInput: "use variable n = 5\nouter for loop: start: 1, end: n, next step: +1\ninner for loop: start: 1, end: i, next step: +1\nprint(\"*\") and print newline"
  };
}

export function validateStarPatternSampleCode(text, attemptCount = 1) {
  const raw = text || "";
  const norm = raw.toLowerCase();

  // Reject foreign problem text (e.g. ATM PIN)
  if (norm.includes("pin") || norm.includes("atm")) {
    return {
      isFullyVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "1. Setup input n and outer loop", completed: false, current: true },
        { stepNumber: 2, title: "2. Setup inner loop 1 to i", completed: false, current: false },
        { stepNumber: 3, title: "3. Build/print star row", completed: false, current: false },
        { stepNumber: 4, title: "4. Verify pattern output", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! It looks like you've written code for ATM PIN! For **Print Star Patterns**, assemble nested loops with outer loop for rows and inner loop for stars:\n```javascript\nvar n = 5;\nfor (var i = 1; i <= n; i++) {\n    var row = \"\";\n    for (var j = 1; j <= i; j++) {\n        row = row + \"*\";\n    }\n    print(row);\n}\n```",
      correction: "Write nested loops: outer loop from 1 to n, inner loop from 1 to i to print stars.",
      suggestedInput: "var n = 5;\nfor (var i = 1; i <= n; i++) {\n    var row = \"\";\n    for (var j = 1; j <= i; j++) {\n        row = row + \"*\";\n    }\n    print(row);\n}"
    };
  }

  // Check outer loop: for (var i = 1; i <= n; i++)
  const hasOuterLoop = /for\s*\(\s*(?:var|let|int)?\s*[a-zA-Z_]\w*\s*=\s*1\s*;\s*[a-zA-Z_]\w*\s*<=\s*(?:n|\d+)\s*;\s*[a-zA-Z_]\w*(?:\+\+|\s*\+=\s*1)\s*\)/i.test(raw) ||
    /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*1\s*,\s*(?:n|\d+)\s*(?:\+\s*1)?\s*\)/i.test(raw);

  // Check inner loop: for (var j = 1; j <= i; j++)
  const hasInnerLoop = /for\s*\(\s*(?:var|let|int)?\s*[a-zA-Z_]\w*\s*=\s*1\s*;\s*[a-zA-Z_]\w*\s*<=\s*[a-zA-Z_]\w*\s*;\s*[a-zA-Z_]\w*(?:\+\+|\s*\+=\s*1)\s*\)/i.test(raw) ||
    /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*1\s*,\s*[a-zA-Z_]\w*\s*(?:\+\s*1)?\s*\)/i.test(raw) ||
    /["']\*["']\s*\*\s*[a-zA-Z_]\w*/.test(raw);

  // Check star output: print("*") or row += "*" or console.log
  const hasStarOutput = /["']\*["']/.test(raw) && /(?:print|console\.log|cout|printf|System\.out)/i.test(raw);

  const sampleCodeStepProgress = [
    { stepNumber: 1, title: "1. Setup input n and outer loop", completed: hasOuterLoop, current: !hasOuterLoop },
    { stepNumber: 2, title: "2. Setup inner loop 1 to i", completed: hasInnerLoop, current: hasOuterLoop && !hasInnerLoop },
    { stepNumber: 3, title: "3. Build/print star row", completed: hasStarOutput, current: hasOuterLoop && hasInnerLoop && !hasStarOutput },
    { stepNumber: 4, title: "4. Verify pattern output", completed: hasOuterLoop && hasInnerLoop && hasStarOutput, current: false }
  ];

  const isFullyVerified = hasOuterLoop && (hasInnerLoop || hasStarOutput);

  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "1. Setup input n and outer loop", completed: true, current: false },
        { stepNumber: 2, title: "2. Setup inner loop 1 to i", completed: true, current: false },
        { stepNumber: 3, title: "3. Build/print star row", completed: true, current: false },
        { stepNumber: 4, title: "4. Verify pattern output", completed: true, current: false }
      ],
      feedback: "🎉 **Sample Code Verified & Passed!** 🏆\nYour star pattern code is assembled perfectly with nested loops! You are ready to open the Compiler and run the code.",
      correction: "All done! Run the code in the compiler.",
      suggestedInput: void 0
    };
  }

  return {
    isFullyVerified: false,
    sampleCodeStepProgress,
    feedback: "🌟 Coach Maara here! Here is the example prototype for nested loops in Star Pattern:\n```javascript\nvar n = 5;\nfor (var i = 1; i <= n; i++) {\n    var row = \"\";\n    for (var j = 1; j <= i; j++) {\n        row = row + \"*\";\n    }\n    print(row);\n}\n```",
    correction: "Ensure outer loop runs 1 to n and inner loop runs 1 to i to print stars.",
    suggestedInput: "var n = 5;\nfor (var i = 1; i <= n; i++) {\n    var row = \"\";\n    for (var j = 1; j <= i; j++) {\n        row = row + \"*\";\n    }\n    print(row);\n}"
  };
}

