function validateVowelConsonantLogic(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  if (norm.length < 4) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! How do you determine whether an input character is a Vowel or a Consonant?",
      correction: "If the character equals 'a', 'e', 'i', 'o', or 'u', it is a Vowel. Otherwise, it is a Consonant.",
      suggestedInput: "Check if the character equals 'a', 'e', 'i', 'o', or 'u'. If it matches any vowel (e.g. 'e'), it is a Vowel; otherwise (e.g. 'x'), it is a Consonant."
    };
  }
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|express|explain|guidance|clue)\b/i.test(norm) || norm.includes("how to") || norm.includes("what is");
  if (isQuestion) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! A character is a **Vowel** if it equals `'a'`, `'e'`, `'i'`, `'o'`, or `'u'`. Matching any ONE vowel makes it a Vowel!\n\nIf the character is not equal to any of the 5 vowels, it is a **Consonant**.\n\nExamples:\n\u2022 Input 'e' \u2794 Matches vowel 'e' \u2794 Output: Vowel\n\u2022 Input 'x' \u2794 Does not match any vowel \u2794 Output: Consonant",
      correction: "If character equals 'a', 'e', 'i', 'o', or 'u' then Vowel, otherwise Consonant.",
      suggestedInput: "If the character equals 'a', 'e', 'i', 'o', or 'u', it is a Vowel (e.g. 'e'). Otherwise, it is a Consonant (e.g. 'x').",
      matchedFirebaseInput: "what is vowel or consonant"
    };
  }
  const usesAndForVowels = /\band\b/i.test(norm) && /a.*e.*i/i.test(norm) && !/\bor\b|\|\|/i.test(norm);
  if (usesAndForVowels) {
    return {
      isFullyVerified: false,
      hasContradiction: true,
      feedback: "\u{1F31F} Coach Maya logic alert: A single character cannot be 'a' AND 'e' AND 'i' simultaneously! Use **or** logic because matching ANY ONE vowel makes it a Vowel.",
      correction: "If character equals 'a' OR 'e' OR 'i' OR 'o' OR 'u', then Vowel; otherwise Consonant.",
      suggestedInput: "If character equals 'a' or 'e' or 'i' or 'o' or 'u', it is a Vowel; otherwise it is a Consonant."
    };
  }
  const hasVowelsMentioned = /vowel|a,\s*e,\s*i|a\s*e\s*i\s*o\s*u|['"]?a['"]?.*['"]?e['"]?|['"]?i['"]?|['"]?o['"]?|['"]?u['"]?/i.test(norm);
  const hasConsonantMentioned = /consonant|other|otherwise|rest/i.test(norm);
  if (!hasVowelsMentioned) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! Remember to list the vowels: **a, e, i, o, u**. How do we check if an input character matches any of these 5 vowels?",
      correction: "Check if character is equal to 'a', 'e', 'i', 'o', or 'u'.",
      suggestedInput: "If character equals 'a', 'e', 'i', 'o', or 'u', it is a Vowel; otherwise it is a Consonant."
    };
  }
  if (!hasConsonantMentioned) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya here! Great start explaining Vowels! Now also explain what happens if the character is NOT a vowel\u2014it is a **Consonant**.",
      correction: "If character is 'a','e','i','o','u' display Vowel, otherwise display Consonant.",
      suggestedInput: "If character equals 'a', 'e', 'i', 'o', or 'u', it is a Vowel. If it does not match any vowel, it is a Consonant."
    };
  }
  return {
    isFullyVerified: true,
    hasVowelConcept: true,
    hasConsonantConcept: true,
    hasOrOperator: true,
    feedback: "\u{1F389} **Spot on! Vowel and Consonant Logic Approved!** \u{1F3C6}\n\nYou correctly identified that checking if a character equals 'a', 'e', 'i', 'o', or 'u' identifies a Vowel, and any other character is a Consonant! Proceed to the Recipe stage.",
    correction: "Proceed to Stage 2: Recipe to sequence the algorithm step by step."
  };
}
function validateVowelConsonantRecipe(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const hasCodeSyntax = /if\s*\(|else\s*\{|print\s*\(|var\s+|==|\|\|/i.test(input);
  if (hasCodeSyntax) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maya recipe tip: Avoid code terms and symbols in the Recipe stage. Write in plain everyday English steps!",
      correction: "Step 1: Get character input from the user."
    };
  }
  const hasStep1 = /get|read|take|input|user|enter|character|letter|ch\b/i.test(norm);
  const hasStep2 = /(?:if|check|when|need).*?(?:a|e|i|o|u|vowel).*?(?:equal|match|vowel|display|show|output)/i.test(norm) || /vowel/i.test(norm);
  const hasStep3 = /(?:else|otherwise|not\s*(?:equal|vowel|a?\s*vowel)|rest|other).*?(?:conson[a-z]+|const[a-z]+|constant|display|show|output)/i.test(norm) || /conson[a-z]+/i.test(norm) || /constant/i.test(norm) || /not\s+equal\s+to\s+any/i.test(norm) || /otherwise/i.test(norm) || /else\b/i.test(norm);
  const recipeStepProgress = [
    { stepNumber: 1, title: "Step 1: Get character input from user", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "Step 2: If character is 'a', 'e', 'i', 'o', or 'u', display Vowel", completed: hasStep1 && hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "Step 3: Otherwise display Consonant", completed: hasStep1 && hasStep2 && hasStep3, current: hasStep1 && hasStep2 && !hasStep3 }
  ];
  if (hasStep1 && hasStep2 && hasStep3) {
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback: "\u{1F389} **Recipe Verified!** Excellent sequence! Step 1 gets the character input, Step 2 checks for vowels, and Step 3 handles consonants. Proceed to Stage 3: Ingredients.",
      correction: "Proceed to Stage 3: Ingredients."
    };
  }
  if (!hasStep1) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Let's write the recipe one step at a time. First, start with **Step 1**: Get the character input from the user.",
      correction: "Step 1: Get character input from the user.",
      suggestedInput: "Step 1: Get character input from the user."
    };
  }
  if (!hasStep2) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Step 1 looks good! \u{1F44F} Now write **Step 2**: Check if the character is 'a', 'e', 'i', 'o', or 'u' and display Vowel.",
      correction: "Step 2: If character is 'a', 'e', 'i', 'o', or 'u', display Vowel.",
      suggestedInput: "Step 2: If character is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel."
    };
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maya here! Steps 1 & 2 are complete! \u{1F44F} Now add **Step 3**: Otherwise display Consonant.",
    correction: "Step 3: Otherwise display Consonant.",
    suggestedInput: "Step 3: Otherwise display Consonant."
  };
}
function validateVowelConsonantIngredients(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const hasSingleEqualsInOperator = /operator\s*:\s*=(?!=)/i.test(norm) || /\boperator\s*=\s*=(?!=)/i.test(norm) || /operator\s*:\s*=\s*(?=\n|$)/i.test(norm);
  const hasInvertedIfOutput = /(?:inside\s+if|step\s*3|if\s+block)[\s\S]*?(?:constant|consonant)/i.test(norm) && !/(?:inside\s+if|step\s*3)[\s\S]*?vowel/i.test(norm);
  const hasVar = /step\s*1|ch\b|char\b|letter\b|variable/i.test(norm);
  const hasCondition = /step\s*2|if|condition|ch\s*==|vowel|'a'|'e'|'i'|'o'|'u'|\|\|/i.test(norm) && !hasSingleEqualsInOperator;
  const hasPrintVowel = /step\s*3|print\s*\(\s*["']?vowel["']?\s*\)|display\s*vowel|vowel\s+inside\s+if/i.test(norm) && !hasInvertedIfOutput;
  const hasElse = /step\s*4|else\b|fallback/i.test(norm);
  const hasPrintConsonant = /step\s*5|print\s*\(\s*["']?consonant["']?\s*\)|display\s*consonant|inside\s+else/i.test(norm);
  const ingredientsStepProgress = [
    { stepNumber: 1, title: "Step 1: Declare input variable ch for character", completed: hasVar, current: !hasVar },
    { stepNumber: 2, title: "Step 2: If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'", completed: hasVar && hasCondition, current: hasVar && !hasCondition },
    { stepNumber: 3, title: 'Step 3: Inside if block: print("Vowel")', completed: hasVar && hasCondition && hasPrintVowel, current: hasVar && hasCondition && !hasPrintVowel },
    { stepNumber: 4, title: "Step 4: Fallback else block", completed: hasVar && hasCondition && hasPrintVowel && hasElse, current: hasVar && hasCondition && hasPrintVowel && !hasElse },
    { stepNumber: 5, title: 'Step 5: Inside else block: print("Consonant")', completed: hasVar && hasCondition && hasPrintVowel && hasElse && hasPrintConsonant, current: hasVar && hasCondition && hasPrintVowel && hasElse && !hasPrintConsonant }
  ];
  if (hasVar && hasCondition && hasPrintVowel && hasElse && hasPrintConsonant) {
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback: "\u{1F389} **Ingredients Verified!** Excellent job mapping out all 5 components (Variable, If Condition with OR, Print Vowel, Else Fallback, Print Consonant)! Proceed to Stage 4: Taste the Sample.",
      correction: "Proceed to Stage 4: Taste the Sample."
    };
  }
  if (hasSingleEqualsInOperator) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya syntax alert: Look closely at Step 2 (`operator : =`)! In programming, a single `=` is an assignment operator, while `==` (double equals) is used to check equality. Change your operator to `operator : ==` or `==`!",
      correction: "operator : ==",
      suggestedInput: "operator : =="
    };
  }
  if (hasInvertedIfOutput) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maya logic alert: Look closely at Step 3! Inside the `if` block (when the vowel check is true), we must print **"Vowel"**, not constant/consonant! Update Step 3 to: `step 3 : Inside if block: print("Vowel")`.',
      correction: 'step 3 : Inside if block: print("Vowel")',
      suggestedInput: 'step 3 : Inside if block: print("Vowel")'
    };
  }
  if (!hasVar) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Let's list the ingredients step by step. First, start with **Step 1**: Declare a character variable (e.g. `step 1 : ch variable`).",
      correction: "step 1 : ch variable",
      suggestedInput: "step 1 : ch variable"
    };
  }
  if (!hasCondition) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Step 1 looks great! \u{1F44F} Now write **Step 2**: The if condition checking if `ch` equals any vowel: `step 2 : If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'`.",
      correction: "step 2 : If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'",
      suggestedInput: "step 2 : If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'"
    };
  }
  if (!hasPrintVowel) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: '\u{1F31F} Coach Maya here! Steps 1 & 2 are complete! \u{1F44F} Now write **Step 3**: Inside the if block, display Vowel: `step 3 : Inside if block: print("Vowel")`.',
      correction: 'step 3 : Inside if block: print("Vowel")',
      suggestedInput: 'step 3 : Inside if block: print("Vowel")'
    };
  }
  if (!hasElse) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maya here! Steps 1, 2, & 3 look awesome! \u{1F44F} Now write **Step 4**: The fallback else block for consonants: `step 4 : Fallback else block`.",
      correction: "step 4 : Fallback else block",
      suggestedInput: "step 4 : Fallback else block"
    };
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: '\u{1F31F} Coach Maya here! Almost there! \u{1F44F} Add **Step 5**: Inside the else block, display Consonant: `step 5 : Inside else block: print("Consonant")`.',
    correction: 'step 5 : Inside else block: print("Consonant")',
    suggestedInput: 'step 5 : Inside else block: print("Consonant")'
  };
}
function validateVowelConsonantSampleCode(input, attemptCount = 1) {
  const norm = (input || "").toLowerCase().trim();
  const varMatch = input.match(/(?:\b(?:var|let|const|char|string)\b\s+)?([a-zA-Z_]\w*)\s*=\s*['"]([a-zA-Z0-9])['"]/i) || input.match(/([a-zA-Z_]\w*)\s*=/i);
  const extractedVar = varMatch ? varMatch[1] : "ch";
  const extractedVal = varMatch && varMatch[2] ? varMatch[2] : "e";
  const printMatch = input.match(/(print|console\.log|display|show|printf)\s*\(/i);
  const extractedPrint = printMatch ? printMatch[1] : "print";
  const hasVarDeclaration = /(?:var|let|const|char|string)\s+[a-z_]\w*\s*=\s*['"][a-z]['"]/i.test(input) || /[a-z_]\w*\s*=\s*['"][a-z]['"]/i.test(input) || /var\s+ch/i.test(input) || /\b[a-z_]\w*\s*=/i.test(input);
  const isQuestion = norm.endsWith("?") || /\b(?:how|what|why|help|puriyala|doubt|know|rule|do here|approach|explain|stuck|different|another hint)\b/i.test(norm) || norm.includes("// student question");
  const testCases = [
    {
      testCaseTitle: `Test Case 1: Input character is a Vowel (${extractedVar} = '${extractedVal}')`,
      inputChar: extractedVal,
      operationFormula: `'${extractedVal}' in ('a','e','i','o','u')`,
      conditionCheck: `${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u'`,
      conditionEvaluated: true,
      executedBranch: "if",
      outputMessage: "Vowel",
      expectedOutput: "Vowel",
      passed: true,
      explanation: `'${extractedVal}' matches one of the vowels, so the if block executes and prints 'Vowel'.`
    },
    {
      testCaseTitle: `Test Case 2: Input character is a Consonant (${extractedVar} = 'x')`,
      inputChar: "x",
      operationFormula: "'x' in ('a','e','i','o','u')",
      conditionCheck: `${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u'`,
      conditionEvaluated: false,
      executedBranch: "else",
      outputMessage: "Consonant",
      expectedOutput: "Consonant",
      passed: true,
      explanation: "'x' does not match any vowel, so the fallback else block executes and prints 'Consonant'."
    }
  ];
  if (isQuestion && !hasVarDeclaration) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Step 1: Declare sample variable (e.g. var ${extractedVar} = '${extractedVal}';)`, completed: false, current: true },
        { stepNumber: 2, title: `Step 2: If condition comparing ${extractedVar} with vowels using ||`, completed: false, current: false },
        { stepNumber: 3, title: 'Step 3: Print "Vowel" with quotes inside if block', completed: false, current: false },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
        { stepNumber: 5, title: 'Step 5: Print "Consonant" with quotes inside else block', completed: false, current: false }
      ],
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya here! Let's build our prototype code step by step. First, start with **Step 1**: Declare a sample character variable in the editor (e.g. \`var ${extractedVar} = '${extractedVal}';\`).`,
      correction: `var ${extractedVar} = '${extractedVal}';`,
      suggestedInput: `var ${extractedVar} = '${extractedVal}';`
    };
  }
  const hasAndInCondition = /if\s*\(.*?\&\&.*?\)/i.test(input);
  if (hasAndInCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Step 1: Declare sample variable (e.g. var ${extractedVar} = '${extractedVal}';)`, completed: Boolean(hasVarDeclaration), current: false },
        { stepNumber: 2, title: `Step 2: If condition comparing ${extractedVar} with vowels using ||`, completed: false, current: true },
        { stepNumber: 3, title: 'Step 3: Print "Vowel" with quotes inside if block', completed: false, current: false },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
        { stepNumber: 5, title: 'Step 5: Print "Consonant" with quotes inside else block', completed: false, current: false }
      ],
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya logic alert: You used \`&&\` (AND) in your vowel condition! Variable \`${extractedVar}\` cannot equal 'a' AND 'e' at the same time. Replace \`&&\` with \`||\` (OR) so it checks if \`${extractedVar}\` equals 'a' OR 'e' OR 'i' OR 'o' OR 'u'.`,
      correction: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {`,
      suggestedInput: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  const varWithItselfMatch = input.match(/if\s*\(\s*([a-zA-Z_]\w*)\s*==\s*\1\s*\)/i);
  const comparesVarWithItself = Boolean(varWithItselfMatch);
  const hasSingleEqualsInIfCondition = /if\s*\(\s*[a-zA-Z_]\w*\s*=(?!=)\s*['"]?[a-z]['"]?\s*\)/i.test(input);
  const comparesWithVowelLiteral = /['"]a['"]|['"]e['"]|['"]i['"]|['"]o['"]|['"]u['"]/i.test(input) || /vowel/i.test(input.match(/if\s*\((.*?)\)/i)?.[1] || "");
  const hasCondition = !comparesVarWithItself && !hasSingleEqualsInIfCondition && comparesWithVowelLiteral && /if\s*\(/i.test(input);
  if (hasVarDeclaration && comparesVarWithItself) {
    const varName = varWithItselfMatch ? varWithItselfMatch[1] : extractedVar;
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Step 1: Declare sample variable (e.g. var ${varName} = '${extractedVal}';)`, completed: true, current: false },
        { stepNumber: 2, title: `Step 2: If condition comparing ${varName} with vowels using ||`, completed: false, current: true },
        { stepNumber: 3, title: 'Step 3: Print "Vowel" with quotes inside if block', completed: false, current: false },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
        { stepNumber: 5, title: 'Step 5: Print "Consonant" with quotes inside else block', completed: false, current: false }
      ],
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya logic alert: Look closely at your condition \`if(${varName}==${varName})\`! You are comparing the variable \`${varName}\` with itself, which is always true. You need to check if variable \`${varName}\` is equal to vowel literals, e.g. \`if (${varName} == 'a' || ${varName} == 'e' || ${varName} == 'i' || ${varName} == 'o' || ${varName} == 'u')\`!`,
      correction: `if (${varName} == 'a' || ${varName} == 'e' || ${varName} == 'i' || ${varName} == 'o' || ${varName} == 'u') {`,
      suggestedInput: `if (${varName} == 'a' || ${varName} == 'e' || ${varName} == 'i' || ${varName} == 'o' || ${varName} == 'u') {
  ${extractedPrint}("Vowel");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasVarDeclaration && hasSingleEqualsInIfCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Step 1: Declare sample variable (e.g. var ${extractedVar} = '${extractedVal}';)`, completed: true, current: false },
        { stepNumber: 2, title: `Step 2: If condition comparing ${extractedVar} with vowels using ||`, completed: false, current: true },
        { stepNumber: 3, title: 'Step 3: Print "Vowel" with quotes inside if block', completed: false, current: false },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: false, current: false },
        { stepNumber: 5, title: 'Step 5: Print "Consonant" with quotes inside else block', completed: false, current: false }
      ],
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya syntax alert: You used a single \`=\` inside your \`if\` condition! In programming, \`=\` assigns a value, whereas \`==\` (double equals) checks if values are equal. Change single \`=\` to \`==\`: \`if (${extractedVar} == 'a' || ...)\`!`,
      correction: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {`,
      suggestedInput: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  const hasElseWithCondition = /\belse\s*\([^\)]+\)/i.test(input) || /\belse\s+if\b/i.test(input);
  const hasQuotedPrintVowel = /print\s*\(\s*["']vowel["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']vowel["']\s*\)/i.test(input) || /display\s*\(\s*["']vowel["']\s*\)/i.test(input) || /show\s*\(\s*["']vowel["']\s*\)/i.test(input);
  const hasElse = /\belse\b/i.test(input) && !hasElseWithCondition;
  const hasQuotedPrintConsonant = /print\s*\(\s*["']consonant["']\s*\)/i.test(input) || /console\.log\s*\(\s*["']consonant["']\s*\)/i.test(input) || /display\s*\(\s*["']consonant["']\s*\)/i.test(input) || /show\s*\(\s*["']consonant["']\s*\)/i.test(input);
  const hasUnquotedPrintVowel = !hasQuotedPrintVowel && (/print\s*\(\s*vowel\s*\)/i.test(input) || /console\.log\s*\(\s*vowel\s*\)/i.test(input) || /display\s*\(\s*vowel\s*\)/i.test(input));
  const hasUnquotedPrintConsonant = !hasQuotedPrintConsonant && (/print\s*\(\s*consonant\s*\)/i.test(input) || /console\.log\s*\(\s*consonant\s*\)/i.test(input) || /display\s*\(\s*consonant\s*\)/i.test(input));
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: `Step 1: Declare sample variable (e.g. var ${extractedVar} = '${extractedVal}';)`,
      completed: Boolean(hasVarDeclaration),
      current: !hasVarDeclaration
    },
    {
      stepNumber: 2,
      title: `Step 2: If condition comparing ${extractedVar} with vowels using ||`,
      completed: Boolean(hasVarDeclaration && hasCondition),
      current: Boolean(hasVarDeclaration && !hasCondition)
    },
    {
      stepNumber: 3,
      title: 'Step 3: Print "Vowel" with quotes inside if block',
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintVowel),
      current: Boolean(hasVarDeclaration && hasCondition && !hasQuotedPrintVowel)
    },
    {
      stepNumber: 4,
      title: "Step 4: Fallback else block (e.g. } else {)",
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintVowel && hasElse),
      current: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintVowel && !hasElse)
    },
    {
      stepNumber: 5,
      title: 'Step 5: Print "Consonant" with quotes inside else block',
      completed: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintVowel && hasElse && hasQuotedPrintConsonant),
      current: Boolean(hasVarDeclaration && hasCondition && hasQuotedPrintVowel && hasElse && !hasQuotedPrintConsonant)
    }
  ];
  const allVerified = hasVarDeclaration && hasCondition && hasQuotedPrintVowel && hasElse && hasQuotedPrintConsonant && !hasElseWithCondition;
  if (allVerified) {
    const feedback = `\u{1F389} **You gotcha! Perfect Vowel & Consonant logic.** \u{1F3C6} You have mastered Vowels and Consonants across all 4 stages of CTC!`;
    return {
      isFullyVerified: true,
      allVerified: true,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: `var ${extractedVar} = '${extractedVal}'; if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') ${extractedPrint}("Vowel"); else ${extractedPrint}("Consonant");`
    };
  }
  if (hasVarDeclaration && hasCondition && (hasUnquotedPrintVowel || hasUnquotedPrintConsonant)) {
    const isBothUnquoted = hasUnquotedPrintVowel && hasUnquotedPrintConsonant;
    const feedback = isBothUnquoted ? `\u{1F31F} Coach Maya syntax alert: You wrote \`${extractedPrint}(Vowel)\` and \`${extractedPrint}(Consonant)\` without quotes! In programming, text messages MUST be enclosed in quotation marks, like \`${extractedPrint}("Vowel");\` and \`${extractedPrint}("Consonant");\`. Add quotes around your print text to verify your code!` : hasUnquotedPrintVowel ? `\u{1F31F} Coach Maya syntax alert: Quotes are missing in your if print statement! In programming, text must be wrapped in quotation marks: \`${extractedPrint}("Vowel");\`.` : `\u{1F31F} Coach Maya syntax alert: Quotes are missing in your else print statement! In programming, text must be wrapped in quotation marks: \`${extractedPrint}("Consonant");\`.`;
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Step 1: Declare sample variable (e.g. var ${extractedVar} = '${extractedVal}';)`, completed: Boolean(hasVarDeclaration), current: false },
        { stepNumber: 2, title: `Step 2: If condition comparing ${extractedVar} with vowels using ||`, completed: Boolean(hasVarDeclaration && hasCondition), current: false },
        { stepNumber: 3, title: 'Step 3: Print "Vowel" with quotes inside if block', completed: Boolean(hasQuotedPrintVowel), current: !hasQuotedPrintVowel },
        { stepNumber: 4, title: "Step 4: Fallback else block (e.g. } else {)", completed: Boolean(hasElse), current: false },
        { stepNumber: 5, title: 'Step 5: Print "Consonant" with quotes inside else block', completed: Boolean(hasQuotedPrintConsonant), current: !hasQuotedPrintConsonant && Boolean(hasQuotedPrintVowel) }
      ],
      operationTestCases: testCases,
      feedback,
      correction: isBothUnquoted ? `${extractedPrint}("Vowel");
${extractedPrint}("Consonant");` : hasUnquotedPrintVowel ? `${extractedPrint}("Vowel");` : `${extractedPrint}("Consonant");`,
      suggestedInput: `var ${extractedVar} = '${extractedVal}';
if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
} else {
  ${extractedPrint}("Consonant");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasElseWithCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maya syntax alert: You attached a condition to `else`! In JavaScript/Python, `else` is an automatic fallback that takes no condition. Just write `} else {`.",
      correction: "} else {",
      suggestedInput: `var ${extractedVar} = '${extractedVal}';
if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
} else {
  ${extractedPrint}("Consonant");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (!hasVarDeclaration) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya here! Let's build our code line by line. Start with Step 1 by declaring your test variable in the editor: \`var ${extractedVar} = '${extractedVal}';\`.`,
      correction: `var ${extractedVar} = '${extractedVal}';`,
      suggestedInput: `var ${extractedVar} = '${extractedVal}';
if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
} else {
  ${extractedPrint}("Consonant");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasVarDeclaration && !hasCondition) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya here! I see you declared \`${extractedVar} = '${extractedVal}'\`! \u{1F44F} Now add Step 2: Write the \`if\` condition comparing \`${extractedVar}\` against all 5 vowels using \`||\`: \`if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {\`.`,
      correction: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {`,
      suggestedInput: `if (${extractedVar} == 'a' || ${extractedVar} == 'e' || ${extractedVar} == 'i' || ${extractedVar} == 'o' || ${extractedVar} == 'u') {
  ${extractedPrint}("Vowel");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (hasVarDeclaration && hasCondition && !hasQuotedPrintVowel) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: `\u{1F31F} Coach Maya here! Your variable \`${extractedVar}\` and vowel condition look great! \u{1F44F} Now write **Step 3**: Inside the \`if\` block, display "Vowel" in quotes: \`${extractedPrint}("Vowel");\`.`,
      correction: `${extractedPrint}("Vowel");`,
      suggestedInput: `  ${extractedPrint}("Vowel");`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  if (!hasElse) {
    return {
      isFullyVerified: false,
      allVerified: false,
      sampleCodeStepProgress,
      operationTestCases: testCases,
      feedback: "\u{1F31F} Coach Maya here! Steps 1, 2, & 3 look awesome! \u{1F44F} Now write **Step 4**: Add the fallback `else` block for consonants: `} else {`.",
      correction: "} else {",
      suggestedInput: `} else {
  ${extractedPrint}("Consonant");
}`,
      matchedFirebaseInput: "how to write sample code"
    };
  }
  return {
    isFullyVerified: false,
    allVerified: false,
    sampleCodeStepProgress,
    operationTestCases: testCases,
    feedback: `\u{1F31F} Coach Maya here! Almost there! \u{1F44F} Now write **Step 5**: Inside the \`else\` block, display "Consonant" in quotes: \`${extractedPrint}("Consonant"); }\`.`,
    correction: `${extractedPrint}("Consonant");`,
    suggestedInput: `  ${extractedPrint}("Consonant");
}`,
    matchedFirebaseInput: "how to write sample code"
  };
}
export {
  validateVowelConsonantIngredients,
  validateVowelConsonantLogic,
  validateVowelConsonantRecipe,
  validateVowelConsonantSampleCode
};
