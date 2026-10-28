function parseNumbers(str) {
  const matches = str.match(/\b\d+\b/g);
  if (!matches) return [];
  return matches.map(Number).filter((n) => !isNaN(n));
}
function validateOddEvenClassification(text) {
  const result = {
    hasList: false,
    hasOdd: false,
    hasEven: false,
    oddNumbers: [],
    evenNumbers: [],
    wrongInOdd: [],
    wrongInEven: [],
    isCorrect: false
  };
  if (!text || typeof text !== "string") return result;
  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.includes("%") || trimmed.includes("==") || /=\s*\d+/.test(trimmed)) {
      continue;
    }
    const sanitizedLine = trimmed.replace(/\b\d+\s*table\b/gi, " ").replace(/\btable\s*of\s*\d+\b/gi, " ");
    for (const m of sanitizedLine.matchAll(/\b(odd|even)(?:\s+numbers?)?[\s:=]+([0-9\s,]+)/gi)) {
      const type = m[1].toLowerCase();
      const nums = parseNumbers(m[2]);
      if (nums.length > 0) {
        if (type === "odd") {
          result.hasOdd = true;
          // If this line provides a clean odd list with no even numbers, supersede previous odd numbers
          const wrongHere = nums.filter((n) => n % 2 === 0);
          if (wrongHere.length === 0) {
            result.oddNumbers = nums;
            result.wrongInOdd = [];
          } else {
            for (const n of nums) {
              if (!result.oddNumbers.includes(n)) {
                result.oddNumbers.push(n);
                if (n % 2 === 0) result.wrongInOdd.push(n);
              }
            }
          }
        } else if (type === "even") {
          result.hasEven = true;
          // If this line provides a clean even list with no odd numbers, supersede previous even numbers
          const wrongHere = nums.filter((n) => n % 2 !== 0);
          if (wrongHere.length === 0) {
            result.evenNumbers = nums;
            result.wrongInEven = [];
          } else {
            for (const n of nums) {
              if (!result.evenNumbers.includes(n)) {
                result.evenNumbers.push(n);
                if (n % 2 !== 0) result.wrongInEven.push(n);
              }
            }
          }
        }
      }
    }
    for (const m of sanitizedLine.matchAll(/([0-9\s,]+)\s*(?:are|is)?\s*\b(odd|even)\b/gi)) {
      const type = m[2].toLowerCase();
      const nums = parseNumbers(m[1]);
      if (nums.length > 0) {
        if (type === "odd") {
          result.hasOdd = true;
          const wrongHere = nums.filter((n) => n % 2 === 0);
          if (wrongHere.length === 0) {
            result.oddNumbers = nums;
            result.wrongInOdd = [];
          } else {
            for (const n of nums) {
              if (!result.oddNumbers.includes(n)) {
                result.oddNumbers.push(n);
                if (n % 2 === 0) result.wrongInOdd.push(n);
              }
            }
          }
        } else if (type === "even") {
          result.hasEven = true;
          const wrongHere = nums.filter((n) => n % 2 !== 0);
          if (wrongHere.length === 0) {
            result.evenNumbers = nums;
            result.wrongInEven = [];
          } else {
            for (const n of nums) {
              if (!result.evenNumbers.includes(n)) {
                result.evenNumbers.push(n);
                if (n % 2 !== 0) result.wrongInEven.push(n);
              }
            }
          }
        }
      }
    }
  }
  if (result.hasOdd || result.hasEven) {
    result.hasList = true;
    result.isCorrect = result.hasOdd && result.hasEven && result.wrongInOdd.length === 0 && result.wrongInEven.length === 0;
    if (!result.isCorrect) {
      if (result.wrongInOdd.length > 0 && result.wrongInEven.length > 0) {
        const wrongOddStr = result.wrongInOdd.join(", ");
        const wrongEvenStr = result.wrongInEven.join(", ");
        result.feedback = `Take another close look at your numbers! In your odd list, ${wrongOddStr} is an even number because it splits evenly into 2 equal parts. In your even list, ${wrongEvenStr} is an odd number because it leaves 1 leftover when paired. Remember: Even numbers pair up evenly (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...). Can you separate numbers from 1 to 6 into odd and even correctly?`;
        result.correction = `Check your numbers: Even numbers can be split into 2 equal parts (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (result.wrongInOdd.length > 0) {
        const wrongOddStr = result.wrongInOdd.join(", ");
        result.feedback = `Take another close look at your odd numbers! In your list, ${wrongOddStr} is an even number because it splits evenly into 2 equal parts. Remember, odd numbers leave 1 leftover when paired into twos (like 1, 3, 5...). Can you correct your odd list?`;
        result.correction = `Check your odd numbers: ${wrongOddStr} is an even number. Odd numbers are 1, 3, 5...`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (result.wrongInEven.length > 0) {
        const wrongEvenStr = result.wrongInEven.join(", ");
        result.feedback = `Take another close look at your even numbers! In your list, ${wrongEvenStr} is an odd number because it leaves 1 leftover when paired into groups of 2. Remember, even numbers divide evenly into 2 equal parts (like 2, 4, 6...). Can you correct your even list?`;
        result.correction = `Check your even numbers: ${wrongEvenStr} is an odd number. Even numbers are 2, 4, 6...`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (!result.hasOdd) {
        result.feedback = `Great job listing even numbers (${result.evenNumbers.join(", ")})! Now, also list the odd numbers (like 1, 3, 5...) so we have examples of both.`;
        result.correction = `List odd numbers as well (e.g., Odd: 1, 3, 5).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (!result.hasEven) {
        result.feedback = `Great job listing odd numbers (${result.oddNumbers.join(", ")})! Now, also list the even numbers (like 2, 4, 6...) so we have examples of both.`;
        result.correction = `List even numbers as well (e.g., Even: 2, 4, 6).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      }
    }
  }
  return result;
}

function validateOddEvenRecipe(text) {
  const norm = (text || "").toLowerCase();

  // 1. Step 1: Input step
  const hasInputStep =
    /(?:get|read|take|input|receive|accept)\b/i.test(norm) ||
    (/(?:step\s*1|1[\.\:\)])/i.test(norm) && /(?:input|number|value)/i.test(norm));

  // 2. Step 2: Modulo divide by 2
  const hasModulo = /(?:modulo|modulodivide|%|mod\b)/i.test(norm);
  const textWithoutStepLabels = norm.replace(/\bstep\s*[0-9]+/gi, "").replace(/^[0-9]+[\.\)\:\-]\s*/gm, "");
  const has2 = /(?:by\s*2\b|%\s*2\b)/.test(norm) || /(?:modulo|modulodivide)\s*(?:divide\s*)?(?:the\s*input\s*)?(?:by\s*)?2\b/i.test(norm) || /\b(?:2|two)\b/.test(textWithoutStepLabels);
  const hasModuloBy2 = (hasModulo && has2) || /(?:modulo|modulodivide|%)\s*(?:divide\s*)?(?:the\s*input\s*)?(?:by\s*)?2/i.test(norm) || /divide\s*.*by\s*2/i.test(norm) || /%\s*2/.test(norm);

  // 4. Step 4: Decision check for Odd / Even parity
  // Split into individual clauses/statements to evaluate each condition independently without cross-sentence bleed
  const clauses = norm.split(/[\.\n;,]+|\b(?:and|or|otherwise|else)\b/);

  let zeroIsOdd = false;
  let oneIsEven = false;
  let zeroIsEven = false;
  let oneIsOdd = false;
  const hasOddFallback = /\b(?:else|otherwise|or)\b.*?\bodd\b/i.test(norm);
  const hasEvenFallback = /\b(?:else|otherwise|or)\b.*?\beven\b/i.test(norm);

  for (const c of clauses) {
    const trimmed = c.trim();
    if (!trimmed) continue;

    const hasZero = /\b(?:0|zero)\b/.test(trimmed);
    const hasOne = /\b(?:1|one)\b/.test(trimmed);
    const hasOdd = /\bodd\b/.test(trimmed);
    const hasEven = /\beven\b/.test(trimmed);

    if (hasZero && hasOdd && !hasEven) zeroIsOdd = true;
    if (hasOne && hasEven && !hasOdd) oneIsEven = true;
    if (hasZero && hasEven && !hasOdd) {
      zeroIsEven = true;
      zeroIsOdd = false; // Subsequent correct parity clause supersedes earlier inverted clause!
    }
    if (hasOne && hasOdd && !hasEven) {
      oneIsOdd = true;
      oneIsEven = false; // Subsequent correct parity clause supersedes earlier inverted clause!
    }
  }

  // If a later clause or fallback successfully states remainder 0 is even, clear parity inversion!
  if (zeroIsEven && (oneIsOdd || hasOddFallback || /\bodd\b/.test(norm))) {
    zeroIsOdd = false;
    oneIsEven = false;
  }

  const isParityInverted = Boolean(zeroIsOdd || oneIsEven);
  const step4Correct = !isParityInverted && (
    (zeroIsEven && (oneIsOdd || hasOddFallback)) ||
    (oneIsOdd && hasEvenFallback) ||
    (zeroIsEven && /\bodd\b/.test(norm))
  );

  // 3. Step 3: Check remainder
  const hasExplicitStep3 = /(?:step\s*3|3[\.\:\)])/i.test(norm);
  const hasCheckWord = /\b(?:check|see|test|inspect|verify|find\s*out|determine|look\s*at)\b/i.test(norm);
  const hasRemainderWord = /(?:remainder|rem\b|remind)/i.test(norm);
  const hasCheckRemainderStep = (hasExplicitStep3 && hasRemainderWord) || (hasCheckWord && hasRemainderWord) || (hasRemainderWord && /(?:after|division|divide)/i.test(norm)) || (hasRemainderWord && step4Correct) || (hasModuloBy2 && step4Correct);

  const step1Done = Boolean(hasInputStep);
  const step2Done = Boolean(hasModuloBy2);
  const step3Done = Boolean(hasCheckRemainderStep || (hasModuloBy2 && step4Correct));
  const step4Done = Boolean(step4Correct);

  const isFullyVerified = step1Done && step2Done && step3Done && step4Done;

  const userLines = (text || "").split(/[\r\n]+/).map(l => l.trim()).filter(Boolean);
  const numberedLines = userLines.filter(l => /^(?:step\s*\d+|\d+[\.\:\)\-])/i.test(l));

  let recipeStepProgress;
  if (numberedLines.length === 2 && isFullyVerified) {
    recipeStepProgress = [
      { stepNumber: 1, title: numberedLines[0].replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 35) || "Input & modulo divide by 2", completed: true, current: false },
      { stepNumber: 2, title: numberedLines[1].replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 35) || "Check remainder & print even/odd", completed: true, current: false }
    ];
  } else if (numberedLines.length === 3 && isFullyVerified) {
    recipeStepProgress = [
      { stepNumber: 1, title: numberedLines[0].replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 35) || "Input number", completed: true, current: false },
      { stepNumber: 2, title: numberedLines[1].replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 35) || "Modulo divide & check", completed: true, current: false },
      { stepNumber: 3, title: numberedLines[2].replace(/^(?:step\s*\d+[:.]?|\d+[\.\:\)\-]?)\s*/i, '').slice(0, 35) || "Remainder 0 even, else odd", completed: true, current: false }
    ];
  } else {
    recipeStepProgress = [
      { stepNumber: 1, title: "Get input number", completed: step1Done, current: !step1Done },
      { stepNumber: 2, title: "Modulo divide by 2", completed: step2Done, current: step1Done && !step2Done },
      { stepNumber: 3, title: "Check remainder", completed: step3Done, current: step1Done && step2Done && !step3Done },
      { stepNumber: 4, title: "Remainder 0 even, else odd", completed: step4Done, current: step1Done && step2Done && step3Done && !step4Done }
    ];
  }

  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (isParityInverted) {
    feedback = "Take a close look at Step 4! When you divide a number by 2, a remainder of 0 means the number divides completely with no leftover, so it is Even (not odd). A remainder of 1 means 1 is leftover, so it is Odd (not even). Please correct Step 4: If remainder is 0 it is even, otherwise (or remainder 1) it is odd.";
    correction = "Correct Step 4: Remainder 0 is even, and remainder 1 is odd.";
    suggestedInput = "Step 4: If the remainder is 0 it is even, or else it is odd";
  } else if (!step1Done) {
    feedback = "Start your recipe with Step 1: Get or take the input number from the user.";
    correction = "Step 1: Get the input number from the user";
    suggestedInput = "Step 1: Take a number";
  } else if (!step2Done) {
    feedback = "Great! For Step 2, normal division only gives the quotient. To check for odd/even we need the remainder. State that we modulo divide the number by 2.";
    correction = "Step 2: Modulo divide the number by 2";
    suggestedInput = "Step 2: Modulo divide the number by 2";
  } else if (!step3Done) {
    feedback = "Good progress! For Step 3, state that after division we need to check the remainder.";
    correction = "Step 3: Check the remainder";
    suggestedInput = "Step 3: Check the remainder";
  } else if (!step4Done) {
    feedback = "Almost there! For Step 4, complete the decision: when the remainder is 0 it is even, or else (when remainder is 1) it is odd.";
    correction = "Step 4: If remainder is 0 it is even, or else it is odd";
    suggestedInput = "Step 4: If remainder is 0 it is even, or else it is odd";
  } else {
    feedback = "\u{1F389} Recipe Successful! Brilliant work! You've sequenced all 4 steps of the algorithm from reading input to making the final decision. You're ready to proceed to the Ingredients stage!";
    correction = "Proceed to Ingredients to identify the required programming components.";
  }

  return {
    isFullyVerified,
    isParityInverted,
    step1Done,
    step2Done,
    step3Done,
    step4Done,
    recipeStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

function validateOddEvenLogic(text) {
  const norm = (text || "").toLowerCase();
  const clean = (text || "").replace(/\s+/g, "");

  // 1. Understand problem & input (variable or number mentioned)
  const hasInputOrVar = /\b(?:n|num|number|input|val|value)\b/i.test(norm) || /\b\d+\b/.test(norm);

  // 2. Parity rule (divisible by 2, modulo 2, 2 table)
  const hasModulo = /(?:modulo|%|mod\b|remainder|rem\b)/i.test(norm);
  const hasTwo = /(?:by\s*2\b|%\s*2\b|\b2\b|two)/i.test(norm);
  const hasParityRule = (hasModulo && hasTwo) || /divisible\s*by\s*2/i.test(norm) || /2\s*table/i.test(norm);

  // 3. Even mathematical definition with remainder
  const hasEvenMath =
    /%\s*2\s*(=|==)\s*0/.test(norm) ||
    /([02468]|\b[0-9]*[02468]\b)\s*%\s*2\s*(=|==)\s*0/.test(clean) ||
    /(remainder|rem)\s*(is|=|:)?\s*0/.test(norm) ||
    /0\s*(is|=|means)\s*(an?\s*)?even/.test(norm) ||
    /even\s*.*(remainder|rem)\s*(is|=|:)?\s*0/.test(norm) ||
    /divisible\s*by\s*2\s*(and|with)?\s*remainder\s*0/.test(norm) ||
    /(else|otherwise)\s*(?:it\s*is\s*)?even/.test(norm);

  // 4. Odd mathematical definition with remainder
  // CRITICAL: Must explicitly specify remainder 1, % 2 == 1, % 2 != 0, remainder not 0, or leaves 1 leftover!
  // Merely saying "7 is odd" or "n=7 it is odd number" without remainder/modulo DOES NOT QUALIFY!
  const hasOddMath =
    /%\s*2\s*(=|==)\s*1/.test(norm) ||
    /%\s*2\s*(!=|!==)\s*0/.test(norm) ||
    /([13579]|\b[0-9]*[13579]\b)\s*%\s*2\s*(=|==)\s*1/.test(clean) ||
    /(remainder|rem)\s*(is|=|:)?\s*1/.test(norm) ||
    /(remainder|rem)\s*(is|=|:)?\s*(not\s*0|non\s*zero|!=0)/.test(norm) ||
    /1\s*(is|=|means)\s*(an?\s*)?odd/.test(norm) ||
    /odd\s*.*(remainder|rem)\s*(is|=|:)?\s*1/.test(norm) ||
    /(?:leave|leaves)\s*(?:a\s*)?(?:remainder\s*(?:of\s*)?1|1\s*leftover)/.test(norm) ||
    /(?:remainder|rem)\s*(?:is\s*)?1\s*(?:means|is)?\s*odd/.test(norm) ||
    /(else|otherwise)\s*(?:it\s*is\s*)?odd/.test(norm) ||
    /not\s*divisible\s*by\s*2/.test(norm);

  // Check if odd was mentioned but without remainder
  const hasOddMentionWithoutRemainder = !hasOddMath && (
    /\bodd\b/i.test(norm) ||
    /\b(?:n\s*=\s*[13579]|\b[13579]\b.*?odd)\b/i.test(norm)
  );

  const step1Done = Boolean(hasInputOrVar);
  const step2Done = Boolean(hasParityRule);
  const step3Done = Boolean(hasEvenMath && hasOddMath);
  const step4Done = Boolean(hasEvenMath && hasOddMath && (norm.includes("even") && norm.includes("odd")));

  const isFullyVerified = step1Done && step2Done && step3Done && step4Done;

  const logicStepProgress = [
    { stepNumber: 1, title: "1. Understand problem & input", completed: step1Done, current: !step1Done },
    { stepNumber: 2, title: "2. Parity rule (divisible by 2)", completed: step2Done, current: step1Done && !step2Done },
    { stepNumber: 3, title: "3. Sample test verification", completed: step3Done, current: step1Done && step2Done && !step3Done },
    { stepNumber: 4, title: "4. Decision output logic", completed: step4Done, current: step1Done && step2Done && step3Done && !step4Done }
  ];

  let feedback = "";
  let correction = "";
  let suggestedInput = "";

  if (isFullyVerified) {
    feedback = "🎉 Logic Approved! Spot on! You've defined both Even (remainder 0) and Odd (remainder 1) using modulo 2. Proceed to the Recipe stage!";
    correction = "Proceed to Recipe to write the step-by-step instructions.";
  } else if (hasEvenMath && !hasOddMath) {
    if (hasOddMentionWithoutRemainder) {
      feedback = "Good start! You correctly showed that when divided by 2, remainder 0 means it is an even number (e.g., 8 % 2 = 0). You also mentioned an odd number, but you didn't state what remainder it gives when divided by 2! What is the remainder when an odd number like 7 is divided by 2 (e.g. 7 % 2 = 1)? Please show the remainder for the odd number.";
      correction = "State the remainder for the odd number too: When divided by 2, remainder 1 is odd (e.g. 7 % 2 = 1 is odd).";
      suggestedInput = "n=8\n8%2=0 its even number\nn=7\n7%2=1 its odd number";
    } else {
      feedback = "Superb start! You've correctly identified the mathematical rule for even numbers using remainder 0 (e.g. 8 % 2 = 0). However, this problem checks whether a number is Odd OR Even—we also need to define odd numbers mathematically! What remainder does an odd number (like 7 or 5) give when divided by 2 using the modulo % operator? Please state the remainder for the odd number.";
      correction = "Define odd numbers mathematically too by showing its remainder (e.g. 7 % 2 = 1 is odd).";
      suggestedInput = "7 % 2 = 1 is odd number";
    }
  } else if (hasOddMath && !hasEvenMath) {
    feedback = "Great start! You've shown that dividing an odd number by 2 leaves remainder 1 (e.g. 7 % 2 = 1). But we also need the mathematical rule for even numbers! What remainder does an even number (like 8) give when divided by 2 using modulo? Please state the remainder for even numbers.";
    correction = "Define even numbers mathematically too by showing its remainder (e.g. 8 % 2 = 0 is even).";
    suggestedInput = "8 % 2 = 0 is even number";
  } else if (!step1Done) {
    feedback = "Let's start by taking a sample number or variable n to test whether it is odd or even.";
    correction = "Choose an input number or variable (e.g. n = 8).";
    suggestedInput = "n = 8";
  } else if (!step2Done) {
    feedback = "Look closely at even numbers (2, 4, 6, 8...). Which multiplication table do they belong to? In programming, we use the modulo operator (%) with 2 to find the leftover remainder when dividing by 2.";
    correction = "Use modulo % with 2 to find the remainder.";
    suggestedInput = "8 % 2 = 0";
  } else {
    feedback = "State the mathematical rule for both even and odd: When divided by 2 using %, remainder 0 is Even (e.g. 8 % 2 = 0) and remainder 1 is Odd (e.g. 7 % 2 = 1).";
    correction = "Show remainder 0 for even and remainder 1 for odd using modulo 2.";
    suggestedInput = "n=8\n8%2=0 its even number\nn=7\n7%2=1 its odd number";
  }

  return {
    isFullyVerified,
    step1Done,
    step2Done,
    step3Done,
    step4Done,
    logicStepProgress,
    feedback,
    correction,
    suggestedInput
  };
}

function validateOddEvenSampleCode(text) {
  if (!text || typeof text !== "string") {
    return {
      allVerified: false,
      hasInputVar: false,
      hasCondition: false,
      hasElse: false,
      hasEvenPrint: false,
      hasOddPrint: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "1. Declare input variable", completed: false, current: true },
        { stepNumber: 2, title: "2. If (n % 2 == 0) check", completed: false, current: false },
        { stepNumber: 3, title: "3. Else branch statement", completed: false, current: false },
        { stepNumber: 4, title: "4. Test with sample input", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Let's write the code prototype for Odd or Even: First, declare an input variable (e.g. var n = 8;).",
      correction: "Declare input variable: var n = 8;",
      suggestedInput: "var n = 8;\nif (n % 2 == 0) {\n  print(\"Even\");\n} else {\n  print(\"Odd\");\n}"
    };
  }

  const norm = text.toLowerCase();
  const clean = text.replace(/\s+/g, "");

  // Detect foreign problem outputs (e.g. Eligible / Not Eligible)
  const hasEligible = /\b(?:eligible|not\s*eligible|can\s*vote|cannot\s*vote)\b/i.test(norm);
  const hasAdultMinor = /\b(?:adult|minor)\b/i.test(norm);
  const hasPosNeg = /\b(?:positive|negative)\b/i.test(norm);
  const hasPrime = /\b(?:prime|not\s*prime)\b/i.test(norm);

  // 1. Declare input variable
  const hasInputVar =
    /(?:(?:let|var|const|int|float|double|long)\s+)?[a-zA-Z_]\w*\s*=\s*(?:[0-9]+|int\s*\(|prompt|scanner|cin|read|input)/i.test(text) ||
    /^[a-zA-Z_]\w*\s*=\s*\d+/m.test(text);

  // Check if variable used is 'age'
  const isAgeVar = /\bage\b/i.test(norm);

  // 2. If condition with modulo 2
  const hasCondition =
    /\bif\s*\(?[^)]*?%\s*2\s*(?:==|=|!=|!==)\s*[01]/i.test(text) ||
    /if\s+.*%\s*2\s*(?:==|=|!=|!==)\s*[01]/i.test(text) ||
    /%\s*2\s*(?:==|!=)\s*[01]/.test(clean);

  // 3. Else branch
  const hasElse = /\belse\b/i.test(norm) || /\belif\b/i.test(norm);

  // 4. Output: Even & Odd
  const hasEvenPrint =
    /(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<|echo|puts)\s*(?:\(|\<\<)?\s*["'`][^"'`\n]*even[^"'`\n]*["'`]/i.test(text) ||
    /["'`]even["'`]/i.test(text);

  const hasOddPrint =
    /(?:print|println|printf|console\.log|system\.out\.print|cout\s*<<|echo|puts)\s*(?:\(|\<\<)?\s*["'`][^"'`\n]*odd[^"'`\n]*["'`]/i.test(text) ||
    /["'`]odd["'`]/i.test(text);

  const allVerified = hasInputVar && hasCondition && hasElse && hasEvenPrint && hasOddPrint && !hasEligible && !hasAdultMinor && !hasPosNeg && !hasPrime;

  const steps = [
    { stepNumber: 1, title: "1. Declare input variable", completed: hasInputVar && !isAgeVar, current: !hasInputVar || isAgeVar },
    { stepNumber: 2, title: "2. If (n % 2 == 0) check", completed: hasCondition, current: hasInputVar && !isAgeVar && !hasCondition },
    { stepNumber: 3, title: "3. Else branch statement", completed: hasElse, current: hasInputVar && !isAgeVar && hasCondition && !hasElse },
    { stepNumber: 4, title: "4. Test with sample input", completed: hasEvenPrint && hasOddPrint, current: hasInputVar && !isAgeVar && hasCondition && hasElse && (!hasEvenPrint || !hasOddPrint) }
  ];

  let feedback = "";
  let correction = "";
  let suggestedInput = "var n = 8;\nif (n % 2 == 0) {\n  print(\"Even\");\n} else {\n  print(\"Odd\");\n}";

  if (hasEligible) {
    feedback = "🌟 Coach Maara here! You are currently working on the **Odd or Even** challenge, but your code prints 'Eligible' / 'Not Eligible', which belongs to the **Voting Eligibility** challenge! In this challenge, your program should print 'Even' if the number % 2 == 0, and 'Odd' otherwise.";
    correction = "Change prints from 'Eligible'/'Not Eligible' to 'Even' and 'Odd', and declare an input number (e.g. var n = 8;).";
  } else if (hasAdultMinor || hasPosNeg || hasPrime) {
    const foreignTopic = hasAdultMinor ? "Adult or Minor" : hasPosNeg ? "Positive or Negative" : "Prime Number";
    feedback = `🌟 Coach Maara here! You are working on the **Odd or Even** challenge, but your code has outputs for **${foreignTopic}**! In this challenge, your program should print 'Even' if the number % 2 == 0, and 'Odd' otherwise.`;
    correction = "Change output to print 'Even' and 'Odd'.";
  } else if (allVerified) {
    feedback = "🌟 Coach Maara here! Fantastic job! Your code prototype for \"Odd or Even\" is structurally verified across all components! Proceed to the Compiler to compile and run your code!";
    correction = void 0;
    suggestedInput = void 0;
  } else if (!hasInputVar || isAgeVar) {
    if (isAgeVar) {
      feedback = "🌟 Coach Maara here! In the **Odd or Even** challenge, we test an integer number (like n or num), not an age! Please declare a number variable (e.g. `var n = 8;`).";
      correction = "Declare a number variable (e.g. var n = 8;) instead of age.";
    } else {
      feedback = "🌟 Coach Maara here! Start your prototype by declaring the input variable (e.g. `var n = 8;` or `n = 8`).";
      correction = "Step 1: Declare input variable (e.g. var n = 8;).";
    }
  } else if (!hasCondition) {
    feedback = "🌟 Coach Maara here! Next, write the if condition to check if the number is divisible by 2 with remainder 0: `if (n % 2 == 0)`.";
    correction = "Step 2: Add if condition: if (n % 2 == 0)";
  } else if (!hasElse) {
    feedback = "🌟 Coach Maara here! Great progress! Now add the `else` branch to handle odd numbers.";
    correction = "Step 3: Add else branch: else { print(\"Odd\"); }";
  } else if (!hasEvenPrint || !hasOddPrint) {
    feedback = "🌟 Coach Maara here! Make sure your program prints 'Even' inside the if block, and 'Odd' inside the else block!";
    correction = "Step 4: Output 'Even' in if block and 'Odd' in else block.";
  }

  return {
    allVerified,
    hasInputVar,
    hasCondition,
    hasElse,
    hasEvenPrint,
    hasOddPrint,
    hasEligible,
    sampleCodeStepProgress: steps,
    stepProgress: steps,
    feedback,
    correction,
    suggestedInput: allVerified ? void 0 : suggestedInput
  };
}

export {
  validateOddEvenClassification,
  validateOddEvenRecipe,
  validateOddEvenLogic,
  validateOddEvenSampleCode
};
