function extractDivisorInputAnalysis(text) {
  if (!text) return null;
  let targetN = null;
  const nMatches = [
    /\b(?:n|num|number|input|val)\s*[:=]\s*(\d+)\b/i,
    /\bdivisors?\s+of\s+(\d+)\b/i,
    /\b(?:for|test|testing|take)\s+(?:n\s*[:=]\s*)?(\d+)\b/i
  ];
  for (const re of nMatches) {
    const m = text.match(re);
    if (m && m[1]) {
      const val = parseInt(m[1], 10);
      if (val > 0 && val <= 100) {
        targetN = val;
        break;
      }
    }
  }
  if (!targetN) {
    const modMatch = text.match(/\b(\d+)\s*[%/]\s*\d+/);
    if (modMatch && modMatch[1]) {
      const val = parseInt(modMatch[1], 10);
      if (val > 0 && val <= 100) {
        targetN = val;
      }
    }
  }
  if (!targetN || targetN < 1) return null;
  const divisors = [];
  const nonDivisors = [];
  const testSteps = [];
  for (let i = 1; i <= targetN; i++) {
    const rem = targetN % i;
    const isDiv = rem === 0;
    if (isDiv) {
      divisors.push(i);
    } else {
      nonDivisors.push(i);
    }
    testSteps.push({ i, remainder: rem, isDivisor: isDiv });
  }
  return { n: targetN, divisors, nonDivisors, testSteps };
}
function checkModuloArithmetic(text) {
  const notes = [];
  const lines = text.split("\n");
  const modRegex = /(\d+)\s*%\s*(\d+)\s*=\s*(\d+)/g;
  for (const line of lines) {
    let match;
    while ((match = modRegex.exec(line)) !== null) {
      const a = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const claimedRem = parseInt(match[3], 10);
      if (b !== 0) {
        const actualRem = a % b;
        if (claimedRem !== actualRem) {
          notes.push(`In \`${a} % ${b} = ${claimedRem}\`, ${a} divided by ${b} is ${Math.floor(a / b)} with remainder **${actualRem}** (not ${claimedRem}).`);
        }
      }
    }
  }
  return {
    hasErrors: notes.length > 0,
    notes
  };
}
function checkMentionedDivisors(text, analysis) {
  if (!analysis) {
    const norm = text.toLowerCase();
    const hasDivisorWord = norm.includes("divisor") || norm.includes("divisible");
    return {
      hasMentioned: hasDivisorWord,
      correctDivisors: hasDivisorWord,
      missingDivisors: [],
      incorrectDivisors: [],
      userStatedNumbers: []
    };
  }
  const { n, divisors, nonDivisors } = analysis;
  const divisorPatterns = [
    /divisors?\s*(?:of\s*\d+\s*)?(?:are|is|:|=|include)?\s*([0-9\s,and&]+)/i,
    /([0-9\s,and&]+)\s*(?:are|is)\s*(?:the\s*)?(?:divisors?|divisible)/i,
    /divisible\s*(?:numbers?|by)?\s*(?:are|is|:|=|include)?\s*([0-9\s,and&]+)/i,
    /numbers?\s*that\s*divide\s*\d*\s*(?:completely)?\s*(?:are|is|:|=|include)?\s*([0-9\s,and&]+)/i
  ];
  let statedNumbers = [];
  let foundExplicitStatement = false;
  for (const re of divisorPatterns) {
    const match = text.match(re);
    if (match && match[1]) {
      const nums = match[1].match(/\d+/g);
      if (nums && nums.length > 0) {
        statedNumbers = nums.map((x) => parseInt(x, 10)).filter((x) => x > 0 && x <= n);
        if (statedNumbers.length > 0) {
          foundExplicitStatement = true;
          break;
        }
      }
    }
  }
  if (!foundExplicitStatement) {
    const lines = text.split("\n");
    const inlineDivisors = [];
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes("divisor") || lower.includes("divisible")) {
        const m = line.match(/\b\d+\s*[%/]\s*(\d+)/);
        if (m && m[1]) {
          inlineDivisors.push(parseInt(m[1], 10));
        } else {
          const standaloneNums = line.match(/\b\d+\b/g);
          if (standaloneNums) {
            for (const s of standaloneNums) {
              const val = parseInt(s, 10);
              if (val > 0 && val <= n) {
                inlineDivisors.push(val);
              }
            }
          }
        }
      }
    }
    if (inlineDivisors.length > 0) {
      statedNumbers = Array.from(new Set(inlineDivisors));
      foundExplicitStatement = true;
    }
  }
  if (!foundExplicitStatement) {
    return {
      hasMentioned: false,
      correctDivisors: false,
      missingDivisors: divisors,
      incorrectDivisors: [],
      userStatedNumbers: []
    };
  }
  const missing = divisors.filter((d) => !statedNumbers.includes(d));
  const incorrect = statedNumbers.filter((s) => nonDivisors.includes(s));
  const correct = missing.length === 0 && incorrect.length === 0;
  return {
    hasMentioned: true,
    correctDivisors: correct,
    missingDivisors: missing,
    incorrectDivisors: incorrect,
    userStatedNumbers: statedNumbers
  };
}
function formatDivisorBreakdown(analysis) {
  if (!analysis) {
    return "\n\n\u{1F4CC} **Divisors Breakdown Example (for n = 4):**\n\u2022 4 % 1 = 0 (Remainder 0 \u2192 **1 is a divisor**)\n\u2022 4 % 2 = 0 (Remainder 0 \u2192 **2 is a divisor**)\n\u2022 4 % 3 = 1 (Remainder 1 \u2192 3 is not a divisor)\n\u2022 4 % 4 = 0 (Remainder 0 \u2192 **4 is a divisor**)\n\u{1F449} **Numbers that divide 4 completely (divisors of 4):** **1, 2, and 4**!";
  }
  const { n, divisors, testSteps } = analysis;
  const formattedDivisors = divisors.length <= 1 ? divisors[0] !== void 0 ? String(divisors[0]) : "" : divisors.length === 2 ? `${divisors[0]} and ${divisors[1]}` : `${divisors.slice(0, -1).join(", ")}, and ${divisors[divisors.length - 1]}`;
  let stepsList = "";
  if (testSteps.length <= 12) {
    stepsList = testSteps.map((s) => {
      return `\u2022 ${n} % ${s.i} = ${s.remainder} (${s.isDivisor ? `Remainder is 0 \u2192 **${s.i} is a divisor**` : `Remainder is ${s.remainder} \u2192 ${s.i} is not a divisor`})`;
    }).join("\n") + "\n";
  }
  return `

\u{1F4CC} **Divisible numbers for your input (n = ${n}):**
` + stepsList + `\u{1F449} **Numbers that divide ${n} completely (divisors of ${n}):** **${formattedDivisors}**!`;
}
function validateDivisorLogic(text) {
  let norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  norm = norm.replace(/\breaminder\b/g, "remainder").replace(/\breaminders\b/g, "remainders").replace(/\bremender\b/g, "remainder").replace(/\bremenders\b/g, "remainders").replace(/\bremaindr\b/g, "remainder").replace(/\brem\b/g, "remainder");
  const isOddEvenForeign = (norm.includes("even") || norm.includes("odd") || /%\s*2\b/.test(norm) || norm.includes("divisible by 2")) && !norm.includes("1 to");
  if (isOddEvenForeign) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: true,
      feedback: "🌟 Coach Maara here! That describes Odd or Even numbers (dividing by 2)! In this challenge, our goal is to find all **Divisors of a Number** by testing each number from 1 up to n to see which ones leave remainder 0.",
      correction: "Test each number from 1 up to n and check if dividing leaves remainder 0.",
      suggestedInput: "Test each number from 1 up to that number and if remainder is 0 it is a divisor."
    };
  }
  const isDontKnow = norm.includes("don't know") || norm.includes("dont know") || norm.includes("don t know") || norm.includes("puriyala") || norm.includes("theriyala") || norm.includes("no idea") || norm === "i don t know" || norm === "i dont know" || norm === "dont know" || norm === "puriyala" || norm === "theriyala";
  const isStarterQuestion = /^(what|how|where|tell me|explain|help)/i.test(norm) || norm.includes("what should we do") || norm.includes("what should i do") || norm.includes("what do i do") || norm.includes("what i do") || norm.includes("what to do") || norm.includes("how to start") || norm.includes("where to start") || norm.includes("what is divisor") || norm.includes("what are divisors") || norm.includes("what does divisor mean") || norm === "help" || norm === "start";
  if (isDontKnow) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: true,
      matchedFirebaseInput: "I don't know",
      feedback: "\u{1F31F} Coach Maara here! A divisor is a number that divides a given number completely, leaving a remainder of 0.\nFor example, for number 6, let's test numbers from 1 to 6:\n\u2022 6 divided by 1 leaves remainder 0 (Divisor)\n\u2022 6 divided by 2 leaves remainder 0 (Divisor)\n\u2022 6 divided by 3 leaves remainder 0 (Divisor)\n\u2022 6 divided by 4 leaves remainder 2 (Not a divisor)\n\u2022 6 divided by 5 leaves remainder 1 (Not a divisor)\n\u2022 6 divided by 6 leaves remainder 0 (Divisor)\nSo the divisors of 6 are: 1, 2, 3, and 6.",
      correction: "Test each number from 1 up to the given number, and check if dividing leaves a remainder of 0.",
      suggestedInput: "Test each number from 1 up to that number and if remainder is 0 it is a divisor."
    };
  }
  if (isStarterQuestion) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: true,
      matchedFirebaseInput: "what should we do to find the divisors of a number",
      feedback: "\u{1F31F} Coach Maara here! What does 'Divisors of a number' mean? For example, if the number is 6, what are all the numbers that can divide 6 completely without leaving any remainder?",
      correction: "Think about what divides a number completely without leaving a remainder. For example, what numbers divide 6 evenly?",
      suggestedInput: "Test each number from 1 up to that number and if remainder is 0 it is a divisor."
    };
  }
  if (norm.includes("12") && norm.includes("18") && (norm.includes("24") || norm.includes("multiple"))) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "divisors of 6 are 12, 18, 24",
      feedback: "\u{1F31F} Coach Maara note: Those are Multiples! Divisors can never be larger than the number itself. They always lie between 1 and the given number.",
      correction: "Test numbers from 1 up to 6, not numbers larger than 6.",
      suggestedInput: "Divisors of 6 are between 1 and 6: 1, 2, 3, and 6."
    };
  }
  if (norm.includes("divided by 2 is 3") && norm.includes("only 3")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "6 divided by 2 is 3 so only 3 is the divisor",
      feedback: "\u{1F31F} Coach Maara note: 3 is the quotient, but both 2 (the dividing number) and 3 are divisors because both divide 6 with remainder 0!",
      correction: "Remember that both 2 and 3 divide 6 completely.",
      suggestedInput: "Both 2 and 3 are divisors of 6."
    };
  }
  if ((norm.includes("multiply") || norm.includes("add")) && !norm.includes("divide") && !norm.includes("modulo") && !norm.includes("%")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "we should multiply or add numbers",
      feedback: "\u{1F31F} Coach Maara note: Multiplication makes numbers larger. To find what divides a number, we must test using division and check the remainder, not multiplication or addition.",
      correction: "Use division or modulo (%) to test if numbers split cleanly.",
      suggestedInput: "We test using division to check if the remainder is 0."
    };
  }
  if (norm.includes("from 0") || norm.includes("start from 0") || norm.includes("checking from 0") || norm.includes("divide by 0")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "start checking from 0",
      feedback: "\u{1F31F} Coach Maara note: In mathematics, dividing any number by 0 is undefined and impossible. Always start testing from 1!",
      correction: "Start testing from 1 up to the given number.",
      suggestedInput: "Test numbers starting from 1 up to n."
    };
  }
  if (norm.includes("greater than") || norm.includes("more than") || norm.includes("larger than")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "we can test numbers greater than the given number",
      feedback: "\u{1F31F} Coach Maara note: A number larger than the given number cannot divide it completely (e.g., 7 cannot divide 6). Only test numbers from 1 up to that number.",
      correction: "Only test numbers from 1 up to the given number n.",
      suggestedInput: "Test numbers from 1 up to n."
    };
  }
  if (norm.includes("divide the testing number by the given") || norm.includes("test number by the number") || norm.includes("i by n")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "divide the testing number by the given number",
      feedback: "\u{1F31F} Coach Maara note: Order matters! You must divide the main given number by each testing number (n % i), not the other way around.",
      correction: "Divide the given number n by the testing number i.",
      suggestedInput: "Divide given number n by each testing number i."
    };
  }
  if (norm.includes("remainder is 1") && norm.includes("divisor")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "when remainder is 1 or more it is a divisor",
      feedback: "\u{1F31F} Coach Maara note: If the remainder is 1 or more, it means the number was not divisible completely. A divisor must leave a remainder of exactly 0!",
      correction: "A divisor is a number where remainder is exactly 0.",
      suggestedInput: "When remainder is 0, the number is a divisor."
    };
  }
  if (norm.includes("just divide") && norm.includes("by 2")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: false,
      hasTestRange: false,
      hasRemainderZero: false,
      isConfusion: false,
      matchedFirebaseInput: "just divide the number by 2",
      feedback: "\u{1F31F} Coach Maara note: Dividing by 2 only tells us if 2 is a divisor. We need to test all numbers from 1 up to the given number!",
      correction: "Test every number from 1 up to n.",
      suggestedInput: "Test each number from 1 up to that number, and if remainder is 0 it is a divisor."
    };
  }
  const hasTestRange = norm.includes("1") && (norm.includes("up to") || norm.includes("to n") || norm.includes("to that number") || norm.includes("to the number") || norm.includes("every number") || norm.includes("each number") || norm.includes("all numbers") || norm.includes("1 to") || norm.includes("from 1") || /\b1\s*(to|-)\s*(\d+|n|the\s*number|that\s*number)\b/.test(norm)) || norm.includes("1") && norm.includes("5") || norm.includes("1") && norm.includes("6") || norm.includes("1") && norm.includes("2") && norm.includes("3");
  const hasRemainderZero = norm.includes("remainder") && (norm.includes("0") || norm.includes("zero")) || norm.includes("zero as the remainder") || norm.includes("zero as remainder") || norm.includes("remainder is zero") || norm.includes("remainder as zero") || norm.includes("remainder is 0") || norm.includes("remainder as 0") || norm.includes("divides completely") || norm.includes("divisible completely") || norm.includes("without remainder") || norm.includes("no remainder") || /=\s*0\b/.test(norm);
  const hasDivisorConcept = norm.includes("divisor") || norm.includes("divide") || norm.includes("dividing") || norm.includes("divided") || norm.includes("division") || norm.includes("divisible") || norm.includes("%") || norm.includes("/");
  const analysis = extractDivisorInputAnalysis(text);
  const arithCheck = checkModuloArithmetic(text);
  const mentionCheck = checkMentionedDivisors(text, analysis);
  if (analysis) {
    const formattedDivisors = analysis.divisors.length <= 1 ? analysis.divisors[0] !== void 0 ? String(analysis.divisors[0]) : "" : analysis.divisors.length === 2 ? `${analysis.divisors[0]} and ${analysis.divisors[1]}` : `${analysis.divisors.slice(0, -1).join(", ")}, and ${analysis.divisors[analysis.divisors.length - 1]}`;
    if (!mentionCheck.hasMentioned) {
      let arithMsg = "";
      if (arithCheck.hasErrors) {
        arithMsg = `

\u26A0\uFE0F **Arithmetic note:**
` + arithCheck.notes.map((n) => `\u2022 ${n}`).join("\n");
      }
      return {
        isFullyVerified: false,
        isDivisorIdentified: false,
        hasTestRange: true,
        hasRemainderZero,
        isConfusion: false,
        matchedFirebaseInput: "which numbers are divisible / what are the divisors",
        feedback: `\u{1F31F} Coach Maara here! You did a great job testing the numbers from 1 to ${analysis.n} using modulo (%) to check remainders!${arithMsg}

\u{1F449} **Important next step: Which numbers are divisible?**
You haven't mentioned which numbers are actually the divisors of ${analysis.n}!
Look at your calculations where the remainder is 0: which numbers divided ${analysis.n} completely without leaving a remainder?

Please state which numbers are the divisors (for example: **'Divisors of ${analysis.n} are ${formattedDivisors}'** or **'${formattedDivisors} are divisible'**).

Once you mention the divisors, your logic will be approved!`,
        correction: `State which numbers are the divisors (where remainder is 0), for example: 'Divisors of ${analysis.n} are ${formattedDivisors}'.`,
        suggestedInput: `${text.trim()}
Divisors of ${analysis.n} are ${formattedDivisors}`
      };
    }
    if (!mentionCheck.correctDivisors) {
      let arithMsg = "";
      if (arithCheck.hasErrors) {
        arithMsg = `

\u26A0\uFE0F **Arithmetic note:**
` + arithCheck.notes.map((n) => `\u2022 ${n}`).join("\n");
      }
      if (mentionCheck.incorrectDivisors.length > 0) {
        const wrongNums = mentionCheck.incorrectDivisors.join(", ");
        return {
          isFullyVerified: false,
          isDivisorIdentified: true,
          hasTestRange: true,
          hasRemainderZero: true,
          isConfusion: false,
          matchedFirebaseInput: "incorrect divisors listed",
          feedback: `\u{1F31F} Coach Maara note: Look closely at your calculations! You mentioned ${wrongNums} as a divisor, but dividing ${analysis.n} by ${wrongNums} does not leave a remainder of 0.${arithMsg}

Remember: only numbers where the remainder is exactly 0 are divisors.
\u{1F449} The actual divisors of ${analysis.n} are: **${formattedDivisors}**. Please update your divisors statement!`,
          correction: `Only list numbers where remainder is 0. Divisors of ${analysis.n} are ${formattedDivisors}.`,
          suggestedInput: `${text.trim()}
Divisors of ${analysis.n} are ${formattedDivisors}`
        };
      }
      if (mentionCheck.missingDivisors.length > 0) {
        const missingNums = mentionCheck.missingDivisors.join(", ");
        return {
          isFullyVerified: false,
          isDivisorIdentified: true,
          hasTestRange: true,
          hasRemainderZero: true,
          isConfusion: false,
          matchedFirebaseInput: "missing divisors",
          feedback: `\u{1F31F} Coach Maara note: You are almost there! But you missed ${missingNums}.${arithMsg}
Remember that ${missingNums} also divides ${analysis.n} with a remainder of 0!
\u{1F449} Divisors of ${analysis.n} are: **${formattedDivisors}**. Please include all of them!`,
          correction: `Include all numbers that leave remainder 0: Divisors of ${analysis.n} are ${formattedDivisors}.`,
          suggestedInput: `${text.trim()}
Divisors of ${analysis.n} are ${formattedDivisors}`
        };
      }
    }
    if (arithCheck.hasErrors) {
      return {
        isFullyVerified: false,
        isDivisorIdentified: true,
        hasTestRange: true,
        hasRemainderZero: true,
        isConfusion: false,
        matchedFirebaseInput: "arithmetic error in modulo",
        feedback: `\u{1F31F} Coach Maara here! You correctly identified that the divisors of ${analysis.n} are ${formattedDivisors}! \u{1F389}

However, check your modulo calculation:
` + arithCheck.notes.map((n) => `\u2022 ${n}`).join("\n") + `
Please fix that remainder calculation in your worksheet so your math is 100% accurate!`,
        correction: `Fix the remainder calculation in your modulo equations.`,
        suggestedInput: void 0
      };
    }
    const breakdown = formatDivisorBreakdown(analysis);
    return {
      isFullyVerified: true,
      isDivisorIdentified: true,
      hasTestRange: true,
      hasRemainderZero: true,
      isConfusion: false,
      matchedFirebaseInput: "test each number from 1 up to that number and if remainder is 0 it is a divisor",
      feedback: `\u{1F31F} Coach Maara here! Fantastic! You tested every number from 1 up to ${analysis.n}, checked the remainders, and correctly identified that the numbers dividing ${analysis.n} completely are **${formattedDivisors}**!${breakdown}

You have mastered the core logic! Proceed to the Recipe stage!`,
      correction: void 0,
      suggestedInput: void 0
    };
  }
  if (hasTestRange && hasRemainderZero || hasRemainderZero && hasDivisorConcept && (hasTestRange || norm.includes("1 to") || /\b1\s*(?:to|-|up to)\s*(?:\d+|n)\b/.test(norm)) || (norm.includes("remainder is 0") || norm.includes("remainder is zero") || norm.includes("remainder as zero") || norm.includes("remainder as 0") || norm.includes("zero as the remainder") || norm.includes("zero as remainder")) && (norm.includes("divisor") || norm.includes("divides") || norm.includes("dividing")) || norm.includes("1") && norm.includes("2") && norm.includes("3") && norm.includes("6") && norm.includes("divisor") || norm.includes("1") && norm.includes("5") && norm.includes("divisor")) {
    const breakdown = formatDivisorBreakdown(analysis);
    return {
      isFullyVerified: true,
      isDivisorIdentified: true,
      hasTestRange: true,
      hasRemainderZero: true,
      isConfusion: false,
      matchedFirebaseInput: "test each number from 1 up to that number and if remainder is 0 it is a divisor",
      feedback: `\u{1F31F} Coach Maara here! Fantastic! That is the exact mathematical logic: Test every number from 1 up to the given number. If dividing leaves a remainder of 0, that number is a divisor.${breakdown}

Proceed to Recipe!`,
      correction: void 0,
      suggestedInput: void 0
    };
  }
  if (norm.includes("divide") || norm.includes("dividing") || norm.includes("division") || norm.includes("quotient") || norm.includes("divided") || norm.includes("divisor")) {
    return {
      isFullyVerified: false,
      isDivisorIdentified: true,
      hasTestRange,
      hasRemainderZero,
      isConfusion: false,
      matchedFirebaseInput: "divide and check answer",
      feedback: "\u{1F31F} Coach Maara note: You are on the right track! Normal division only gives the quotient. To verify if a number divides completely, we must look at the remainder. What must the remainder be, and which numbers should we test?",
      correction: "State the testing range (from 1 to n) and the required remainder (0).",
      suggestedInput: "Test each number from 1 up to that number and if remainder is 0 it is a divisor."
    };
  }
  return {
    isFullyVerified: false,
    isDivisorIdentified: false,
    hasTestRange: false,
    hasRemainderZero: false,
    isConfusion: true,
    matchedFirebaseInput: "what should we do to find the divisors of a number",
    feedback: "\u{1F31F} Coach Maara here! What does 'Divisors of a number' mean? For example, if the number is 6, what are all the numbers that can divide 6 completely without leaving any remainder?",
    correction: "Think about what divides a number completely without leaving a remainder. For example, what numbers divide 6 evenly?",
    suggestedInput: "Test each number from 1 up to that number and if remainder is 0 it is a divisor."
  };
}
function validateDivisorRecipe(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  const isOddEvenForeign = (norm.includes("even") || norm.includes("odd") || /%\s*2\b/.test(norm) || norm.includes("divisible by 2")) && !norm.includes("1 to");
  if (isOddEvenForeign) {
    return {
      hasStep1: false,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 0,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: false, current: true },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: false, current: false },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0 (Step 2.1)", completed: false, current: false },
        { stepNumber: 4, title: "If remainder is 0, record/display divisor (Step 2.2)", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! It looks like you've written recipe steps for Odd/Even! For Divisors of a Number, we need a recipe that loops through every number from 1 up to n.",
      correction: "Write Step 1: 'step 1 : Get the input number'.",
      suggestedInput: "step 1 : Get the input number"
    };
  }
  const hasStep1 = norm.includes("input") || norm.includes("get the number") || norm.includes("get input") || norm.includes("read") || norm.includes("take number") || norm.includes("taken number") || norm.includes("given number") || norm.includes("variable") || /\bn\s*\(?\s*\d+\s*\)?/.test(norm);
  const hasStep2 = (norm.includes("1 up to") || norm.includes("from 1 to") || norm.includes("1 to") || norm.includes("every number") || norm.includes("each number")) && (norm.includes("given number") || norm.includes("input number") || norm.includes("input") || norm.includes("n") || norm.includes("5") || norm.includes("6"));
  const hasRemainderZero = norm.includes("remainder is 0") || norm.includes("remainder is zero") || norm.includes("remainder 0") || norm.includes("remainder of 0") || norm.includes("remainder as 0") || norm.includes("leave remainder 0") || norm.includes("leaves remainder 0") || norm.includes("leaves a remainder of 0") || norm.includes("no remainder") || norm.includes("divides evenly") || norm.includes("divides completely") || norm.includes("divided completely") || norm.includes("evenly divisible") || norm.includes("perfectly divides");
  const hasRemainderOne = norm.includes("remainder is 1") || norm.includes("remainder is one") || norm.includes("remainder 1") || norm.includes("remainder as 1") || norm.includes("remainder of 1") || norm.includes("leaves remainder 1") || norm.includes("leaves a remainder of 1") || norm.includes("remainder != 0") || norm.includes("remainder not 0");
  const hasStep21 = (norm.includes("divide") || norm.includes("dividing") || norm.includes("%")) && hasRemainderZero && !hasRemainderOne;
  const hasStep22 = (norm.includes("display") || norm.includes("record") || norm.includes("print") || norm.includes("note down") || norm.includes("show")) && (norm.includes("divisor") || norm.includes("current number") || norm.includes("number") || norm.includes("that number"));
  const completedStepsCount = [hasStep1, hasStep2, hasStep21, hasStep22].filter(Boolean).length;
  const isStarter = completedStepsCount === 0 && (/^(what|how|where|tell me|explain|help)/i.test(norm) || norm.includes("what should i do") || norm.includes("what do i do") || norm.includes("what i do") || norm.includes("what to do") || norm.includes("how to start") || norm.includes("where to start") || norm.includes("puriyala") || norm.includes("theriyala") || norm.includes("dont know") || norm.includes("don't know"));
  if (isStarter) {
    return {
      hasStep1: false,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 0,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: false, current: true },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: false, current: false },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0 (Step 2.1)", completed: false, current: false },
        { stepNumber: 4, title: "If remainder is 0, record/display divisor (Step 2.2)", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! Based on our mathematical logic, write down the steps one by one.\nExample:\nStep 1: Get the input number\nStep 2: ...",
      correction: "Write Step 1: 'step 1 : Get the input number'.",
      suggestedInput: "step 1 : Get the input number",
      matchedFirebaseInput: "what should i do here"
    };
  }
  if (norm.includes("starting from 0") || norm.includes("from 0 up to") || norm.includes("start from 0")) {
    return {
      hasStep1: true,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 1,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: true, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: false, current: true },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0", completed: false, current: false },
        { stepNumber: 4, title: "If remainder is 0, display divisor", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: Careful! In mathematics, dividing by 0 is impossible. Change your starting number from 0 to 1.",
      correction: "Change Step 2 to start from 1: 'Step 2 : For every number from 1 up to the given number'.",
      suggestedInput: "step 2 : For every number from 1 up to the given number",
      matchedFirebaseInput: "starting from 0"
    };
  }
  if (norm.includes("before the given number") || norm.includes("less than the given number") || norm.includes("up to before")) {
    return {
      hasStep1: true,
      hasStep2: false,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 1,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: true, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: false, current: true },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0", completed: false, current: false },
        { stepNumber: 4, title: "If remainder is 0, display divisor", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: Remember: Every number is divisible by itself (e.g., 6 divided by 6 leaves remainder 0). So make sure to include the number itself (from 1 up to the given number).",
      correction: "Include the number itself in Step 2: 'For every number from 1 up to the given number'.",
      suggestedInput: "step 2 : For every number from 1 up to the given number",
      matchedFirebaseInput: "before the given number"
    };
  }
  if (norm.includes("write down all numbers") || norm.includes("list all numbers") || norm.includes("print all numbers")) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: false,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 2,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: true, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: true, current: false },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0", completed: false, current: true },
        { stepNumber: 4, title: "If remainder is 0, display divisor", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: If you write down all numbers, you will list every number from 1 to N! You must first check if dividing leaves a remainder of 0.",
      correction: "Add Step 2.1: 'Check if dividing the given number by the current number leaves a remainder of 0'.",
      suggestedInput: "step 2.1 : Check if dividing the given number by the current number leaves a remainder of 0",
      matchedFirebaseInput: "write down all numbers"
    };
  }
  if ((norm.includes("stop the process") || norm.includes("stop") || norm.includes("break")) && norm.includes("step 2 2")) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: true,
      hasStep22: false,
      isFullyVerified: false,
      completedStepsCount: 3,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: true, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: true, current: false },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0", completed: true, current: false },
        { stepNumber: 4, title: "If remainder is 0, display divisor", completed: false, current: true }
      ],
      feedback: "\u{1F31F} Coach Maara note: Do not stop! A number can have multiple divisors. Continue testing the remaining numbers until you reach the given number.",
      correction: "Step 2.2: 'If the remainder is 0, record / display the current number as a divisor'.",
      suggestedInput: "step 2.2 : If the remainder is 0, record / display the current number as a divisor",
      matchedFirebaseInput: "stop the process after first divisor"
    };
  }
  if (hasRemainderOne && !hasRemainderZero) {
    return {
      hasStep1,
      hasStep2,
      hasStep21: false,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount: [hasStep1, hasStep2, false, hasStep22].filter(Boolean).length,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: hasStep1, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: hasStep2, current: false },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0 (Step 2.1)", completed: false, current: true },
        { stepNumber: 4, title: "If remainder is 0, record/display divisor (Step 2.2)", completed: hasStep22, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: In your condition step, you checked if remainder is 1. Remember, a number is a divisor only when it divides completely with a **remainder of 0**! If the remainder is 1, it is not a divisor.\n\nUpdate your step to: 'Check if dividing the input by the generated number leaves a remainder of 0'.",
      correction: "Step 3: Check if dividing leaves a remainder of 0.",
      suggestedInput: "Step 3: Check if dividing leaves a remainder of 0",
      matchedFirebaseInput: "remainder is 1 in recipe"
    };
  }
  const isFullyVerified = hasStep1 && hasStep2 && hasStep21 && hasStep22;
  const recipeStepProgress = [
    { stepNumber: 1, title: "Get the input number", completed: hasStep1, current: !hasStep1 },
    { stepNumber: 2, title: "For every number from 1 up to the given number", completed: hasStep2, current: hasStep1 && !hasStep2 },
    { stepNumber: 3, title: "Check if dividing leaves remainder 0 (Step 2.1)", completed: hasStep21, current: hasStep1 && hasStep2 && !hasStep21 },
    { stepNumber: 4, title: "If remainder is 0, record/display divisor (Step 2.2)", completed: hasStep22, current: hasStep1 && hasStep2 && hasStep21 && !hasStep22 }
  ];
  if (isFullyVerified) {
    return {
      hasStep1: true,
      hasStep2: true,
      hasStep21: true,
      hasStep22: true,
      isFullyVerified: true,
      completedStepsCount: 4,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Kudos! You have written down a clear, step-by-step algorithm without any code jargon. Proceed to Ingredients!",
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2.2 : if remainder 0, record current number as divisor"
    };
  }
  if (hasStep1 && !hasStep2 && hasStep21) {
    return {
      hasStep1,
      hasStep2: false,
      hasStep21: true,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get the input number", completed: true, current: false },
        { stepNumber: 2, title: "For every number from 1 up to the given number", completed: false, current: true },
        { stepNumber: 3, title: "Check if dividing leaves remainder 0 (Step 2.1)", completed: true, current: false },
        { stepNumber: 4, title: "If remainder is 0, record/display divisor (Step 2.2)", completed: hasStep22, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! You correctly identified that we must check if dividing leaves a remainder of 0! But what numbers are we dividing by? We need to repeat this test for every number from 1 up to the given number in Step 2!",
      correction: "Write Step 2: 'For every number from 1 up to the given number'.",
      suggestedInput: "step 2 : For every number from 1 up to the given number",
      matchedFirebaseInput: "step 2 : for every number from 1 up to the given number"
    };
  }
  if (hasStep21 && !hasStep22) {
    return {
      hasStep1,
      hasStep2,
      hasStep21,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Superb! If the remainder is 0, what action should you take with that number in Step 2.2?",
      correction: "Write Step 2.2: 'If the remainder is 0, record / display the current number as a divisor'.",
      suggestedInput: "step 2.2 : If the remainder is 0, record / display the current number as a divisor",
      matchedFirebaseInput: "step 2.1 : check if dividing leaves remainder 0"
    };
  }
  if (hasStep2 && !hasStep21) {
    return {
      hasStep1,
      hasStep2,
      hasStep21,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Nice! In this repeating process, what condition must we check for each number in Step 2.1?",
      correction: "Write Step 2.1: 'Check if dividing the given number by the current number leaves a remainder of 0'.",
      suggestedInput: "step 2.1 : Check if dividing the given number by the current number leaves a remainder of 0",
      matchedFirebaseInput: "step 2 : for every number from 1 up to the given number"
    };
  }
  if (hasStep1 && !hasStep2) {
    return {
      hasStep1,
      hasStep2,
      hasStep21,
      hasStep22,
      isFullyVerified: false,
      completedStepsCount,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Great! What is the next step to go through each number starting from 1 up to that given number?",
      correction: "Write Step 2: 'For every number from 1 up to the given number'.",
      suggestedInput: "step 2 : For every number from 1 up to the given number",
      matchedFirebaseInput: "step 1 : get the input number"
    };
  }
  return {
    hasStep1: false,
    hasStep2: false,
    hasStep21: false,
    hasStep22: false,
    isFullyVerified: false,
    completedStepsCount: 0,
    recipeStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Based on our mathematical logic, write down the steps one by one.\nExample:\nStep 1: Get the input number\nStep 2: ...",
    correction: "Write Step 1: 'Get the input number'.",
    suggestedInput: "step 1 : Get the input number",
    matchedFirebaseInput: "what should i do here"
  };
}
function validateDivisorIngredients(text) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/<>()_]/g, " ").replace(/\s+/g, " ").trim();
  const isOddEvenForeign = (norm.includes("even") || norm.includes("odd") || /%\s*2\b/.test(norm) || norm.includes("divisible by 2")) && !norm.includes("1 to");
  if (isOddEvenForeign) {
    return {
      hasInput: false,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: false, current: true },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Those ingredients are for checking Odd or Even! Divisors of a Number requires a loop to test divisors from 1 up to n.",
      correction: "Step 1: Variable n for input number.",
      suggestedInput: "step 1 : n for input number"
    };
  }
  const hasInput = norm.includes("n for input") || norm.includes("a for input") || norm.includes("input number") || norm.includes("variable n") || norm.includes("variable a") || norm.includes("var n") || norm.includes("var a") || /\b(variable|var)?\s*[an](\s*\(?\s*\d*\s*\)?)?\b/.test(norm) || norm.includes("get input") || norm.includes("take number") || /\bstep\s*1\s*:\s*.*[an]\b/.test(norm) || norm.includes("n = input") || norm.includes("a = input") || norm.includes("input") && (norm.includes("number") || norm.includes("n") || norm.includes("a"));
  const hasLoopConfusionWithIf = (norm.includes("if") || norm.includes("condition")) && (norm.includes("start") || norm.includes("stop") || norm.includes("next step") || norm.includes("step=+1") || norm.includes("step = +1") || norm.includes("step = 1") || norm.includes("step:+1") || norm.includes("step +1")) && !norm.includes("for loop") && !norm.includes("while loop");
  const hasLoopStart0 = !norm.includes("%") && !norm.includes("if") && (norm.includes("from i = 0") || norm.includes("start: 0") || norm.includes("start=0") || norm.includes("start = 0") || norm.includes("starts with 0") || norm.includes("i = 0") || norm.includes("i=0"));
  const hasLoopStopBeforeN = (norm.includes("i < n") || norm.includes("i < a") || norm.includes("stop: i < n") || norm.includes("stop: i < a") || norm.includes("stop: n - 1") || norm.includes("stop = i < n")) && !norm.includes("<=") && !norm.includes("up to");
  const hasLoopStepDecrement = (norm.includes("next step:-1") || norm.includes("next step: -1") || norm.includes("next step -1") || norm.includes("next step: - 1") || norm.includes("next step = -1") || norm.includes("step:-1") || norm.includes("step: -1") || norm.includes("step = -1") || norm.includes("step=-1") || norm.includes("step -1") || norm.includes("step: -") || norm.includes("i--") || norm.includes("i = i - 1") || norm.includes("i -= 1") || norm.includes("decrement")) && !norm.includes("+1") && !norm.includes("i++");
  const hasCompleteLoop = !hasLoopConfusionWithIf && !hasLoopStart0 && !hasLoopStopBeforeN && !hasLoopStepDecrement && (norm.includes("for loop") || norm.includes("while loop") || norm.includes("start: 1") || norm.includes("start = 1") || norm.includes("from 1 to") || norm.includes("1 up to") || /range\s*\(\s*1\s*,/i.test(norm) || /let\s+i\s*=\s*1/i.test(norm) || /var\s+i\s*=\s*1/i.test(norm) || /int\s+i\s*=\s*1/i.test(norm) || /i\s*=\s*1/i.test(norm) || norm.includes("loop"));
  const hasPartialLoop = !hasCompleteLoop && !hasLoopConfusionWithIf && !hasLoopStart0 && !hasLoopStopBeforeN && (norm.includes("use for loop") || norm.includes("for loop") || norm.includes("while loop") || norm.includes("use loop") || /\bstep\s*2\s*:\s*.*loop\b/.test(norm) || norm.includes("loop") && !norm.includes("if"));
  const hasConditionLeftSide = /\bleft\s*side\s*[:=]?\s*([an]\s*%\s*i|%|[an]\s*mod\s*i)\b/.test(norm) || /\bl\s*\.?\s*s\s*[:=]?\s*([an]\s*%\s*i|%|[an]\s*mod\s*i)\b/.test(norm) || /\bleft\s*[:=]?\s*([an]\s*%\s*i|%|[an]\s*mod\s*i)\b/.test(norm) || norm.includes("left side") && (norm.includes("%") || norm.includes("mod") || norm.includes("a%i") || norm.includes("n%i")) || norm.includes("a % i") || norm.includes("a%i") || norm.includes("n % i") || norm.includes("n%i") || norm.includes("%");
  const hasConditionRightSide = /\bright\s*side\s*[:=]?\s*0\b/.test(norm) || /\br\s*\.?\s*s\s*[:=]?\s*0\b/.test(norm) || /\bright\s*[:=]?\s*0\b/.test(norm) || norm.includes("right side 0") || norm.includes("right side : 0") || norm.includes("right side: 0") || norm.includes("right side:0") || norm.includes("right side = 0") || norm.includes("right side == 0") || norm.includes("r s 0") || norm.includes("r.s 0") || norm.includes("r.s : 0") || norm.includes("r.s: 0") || norm.includes("r.s:0") || norm.includes("rs 0") || norm.includes("right 0") || norm.includes("right : 0") || norm.includes("right: 0") || norm.includes("right:0") || norm.includes("right side zero") || norm.includes("right side : zero") || norm.includes("right side: zero") || norm.includes("== 0") || norm.includes("=== 0") || norm.includes("= 0") || norm.includes("remainder is 0") || norm.includes("remainder : 0") || norm.includes("remainder: 0") || norm.includes("remainder 0") || norm.includes("remainder=0") || norm.includes("remainder = 0") || norm.includes("remainder == 0");
  const hasConditionOperator = /\boperator\s*[:=]?\s*={2,3}\b/.test(norm) || norm.includes("operator ==") || norm.includes("operator : ==") || norm.includes("operator: ==") || norm.includes("operator:==") || norm.includes("operator ===") || norm.includes("operator : ===") || norm.includes("operator: ===") || norm.includes("operator:===") || norm.includes("==") || norm.includes("===") || norm.includes("equality operator") || norm.includes("equal operator") || norm.includes("double equal");
  const hasConditionReversed = norm.includes("i % n == 0") || norm.includes("i % a == 0") || norm.includes("i % n = 0") || norm.includes("i%n==0") || norm.includes("i%a==0") || norm.includes("left side") && (norm.includes("i % n") || norm.includes("i % a") || norm.includes("i%n") || norm.includes("i%a"));
  const hasConditionSingleEqual = (norm.includes("n % i = 0") || norm.includes("a % i = 0") || norm.includes("n%i=0") || norm.includes("a%i=0") || norm.includes("operator : =") || norm.includes("operator: =") || norm.includes("operator =")) && !norm.includes("==") && !norm.includes("===");
  const hasConditionQuotient = norm.includes("n / i == 0") || norm.includes("a / i == 0") || norm.includes("n / i = 0") || norm.includes("n/i==0") || norm.includes("left side") && (norm.includes("n / i") || norm.includes("a / i") || norm.includes("n/i"));
  const hasCompleteCondition = !hasLoopConfusionWithIf && !hasConditionReversed && !hasConditionSingleEqual && !hasConditionQuotient && (norm.includes("n % i == 0") || norm.includes("a % i == 0") || norm.includes("n%i==0") || norm.includes("a%i==0") || norm.includes("n % i === 0") || norm.includes("a % i === 0") || norm.includes("n%i===0") || norm.includes("a%i===0") || hasConditionLeftSide && hasConditionOperator && hasConditionRightSide || norm.includes("if") && (norm.includes("%") || norm.includes("modulo")) && (norm.includes("== 0") || norm.includes("==0") || norm.includes("remainder is 0") || norm.includes("remainder 0") || norm.includes("leaves 0") || norm.includes("divisible")));
  const hasPartialCondition = !hasCompleteCondition && !hasLoopConfusionWithIf && !hasConditionReversed && !hasConditionSingleEqual && !hasConditionQuotient && (hasConditionLeftSide || hasConditionRightSide || hasConditionOperator || norm.includes("if condition") || norm.includes("use if") || norm.includes("if statement") || /\bstep\s*(?:2\.1|3)\s*:\s*.*if\b/.test(norm) || norm.includes("how to write if") || norm.includes("write if"));
  const hasPrintN = norm.includes("print(n)") || norm.includes("print(a)") || norm.includes("print n") || norm.includes("print a") || (norm.includes("display") && (norm.includes(" n") || norm.includes(" a")) && !norm.includes(" i"));
  const hasCompletePrint = !hasPrintN && (norm.includes("print(i)") || norm.includes("print i") || norm.includes("print statement to display divisor i") || norm.includes("print statement to display the divisor i") || norm.includes("display divisor i") || norm.includes("display the divisor i") || norm.includes("print divisor") || norm.includes("display divisor") || norm.includes("display current number i") || /\bstep\s*(?:2\.2|4)\s*:\s*.*print\b/.test(norm) && (norm.includes("i") || norm.includes("divisor")));
  const hasLoop = hasCompleteLoop;
  const hasCondition = hasCompleteCondition;
  const hasPrint = hasCompletePrint;
  const completedStepsCount = [hasInput, hasLoop, hasCondition, hasPrint].filter(Boolean).length;
  const isFullyVerified = hasInput && hasLoop && hasCondition && hasPrint;
  const ingredientsStepProgress = [
    { stepNumber: 1, title: "Variable n for input number", completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: hasLoop, current: hasInput && !hasLoop },
    { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: hasCondition, current: hasInput && hasLoop && !hasCondition },
    { stepNumber: 4, title: "Print statement to display divisor i", completed: hasPrint, current: hasInput && hasLoop && hasCondition && !hasPrint }
  ];
  if (hasLoopConfusionWithIf) {
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      hasLoopConfusionWithIf: true,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: true },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! Look carefully at Step 2: you wrote 'if condition start=1, stop=n, step=+1'. That is a very important mistake to fix! In programming, an **if condition** does NOT have a start, stop, or step. An **if condition** only checks a condition (such as checking if the remainder is zero).\n\nWhat has **Start: 1, Stop: n, and Step: +1** is actually a **For Loop**! A loop is the tool that generates numbers from 1 to n. In Step 2, change 'if condition' to 'For loop'!\n\nAfter setting up the For loop in Step 2, you can use the 'if condition' in Step 2.1 to test: if (n % i == 0).",
      correction: "Notice that 'start=1, stop=n, step=+1' is a For Loop, NOT an if condition! In Step 2, change 'if condition' to 'For loop': 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "step 2 : for loop with start: 1, stop: n, step: +1"
    };
  }
  if (hasLoopStart0) {
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: true },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: Remember: i starts from 1 because n % 0 will cause a division by zero error! Start from i = 1.",
      correction: "Change loop start to 1: 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "from i = 0"
    };
  }
  if (hasLoopStopBeforeN) {
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: true },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: If you write i < n, the loop stops before N, missing N itself as a divisor! Use i <= n (or Stop at n inclusive).",
      correction: "Use i <= n so that n itself is tested: 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "i < n"
    };
  }
  if (hasLoopStepDecrement) {
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      hasLoopStepDecrement: true,
      completedStepsCount: hasInput ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: true },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara note: Look at your loop step where you wrote `next step: -1`! Since your loop starts at 1 and needs to count up to 5 (or n), decrementing with `-1` will decrease into negative numbers (1, 0, -1, -2...) and will never reach your stop target 5!\n\nTo count upwards from 1 to n, your loop step must increment by +1. Change your step to **`+1`** (e.g. `next step: +1` or `step: +1`).",
      correction: "Change loop step to +1: 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "loop step -1"
    };
  }
  if (hasConditionSingleEqual) {
    return {
      hasInput,
      hasLoop: true,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      needsIfConditionHint: true,
      completedStepsCount: 2,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: true, current: false },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: true, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: true },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! In an If condition, we have two sides: Left Side (L.S) and Right Side (R.S) of the operator.\n\u2022 Left Side (L.S) : n % i (calculates remainder when n is divided by i)\n\u2022 Operator : == (use double equal == for comparison, not a single = which assigns!)\n\u2022 Right Side (R.S) : 0 (checks if remainder is 0)\nSo your 'if condition' looks like: if (n % i == 0).",
      correction: "In an If condition: Left Side is n % i, Operator is ==, Right Side is 0. Use double equal ==: 'step 2.1 : If condition with modulo operator: if (n % i == 0)'.",
      suggestedInput: "step 2.1 : If condition with modulo operator: if (n % i == 0)",
      matchedFirebaseInput: "n % i = 0"
    };
  }
  if (hasConditionReversed) {
    return {
      hasInput,
      hasLoop: true,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      needsIfConditionHint: true,
      completedStepsCount: 2,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: true, current: false },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: true, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: true },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! In an If condition, we have two sides: Left Side (L.S) and Right Side (R.S) of the operator.\nVariable order check: You want to divide given number n by testing divisor i:\n\u2022 Left Side (L.S) : n % i (divide n by i, not i % n)\n\u2022 Operator : ==\n\u2022 Right Side (R.S) : 0\nSo your 'if condition' looks like: if (n % i == 0).",
      correction: "Write 'if (n % i == 0)' to divide n by counter i: 'step 2.1 : If condition with modulo operator: if (n % i == 0)'.",
      suggestedInput: "step 2.1 : If condition with modulo operator: if (n % i == 0)",
      matchedFirebaseInput: "i % n == 0"
    };
  }
  if (hasConditionQuotient) {
    return {
      hasInput,
      hasLoop: true,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      needsIfConditionHint: true,
      completedStepsCount: 2,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: true, current: false },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: true, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: true },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! In an If condition, we have two sides: Left Side (L.S) and Right Side (R.S) of the operator.\nn / i gives the quotient, but we need to check the remainder! Use modulo %:\n\u2022 Left Side (L.S) : n % i (remainder of n divided by i)\n\u2022 Operator : ==\n\u2022 Right Side (R.S) : 0\nSo your 'if condition' looks like: if (n % i == 0).",
      correction: "Use modulo operator % for remainder: 'step 2.1 : If condition with modulo operator: if (n % i == 0)'.",
      suggestedInput: "step 2.1 : If condition with modulo operator: if (n % i == 0)",
      matchedFirebaseInput: "n / i == 0"
    };
  }
  if (hasPrintN) {
    return {
      hasInput,
      hasLoop: true,
      hasCondition: true,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: 3,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: true, current: false },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: true, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: true, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: true }
      ],
      feedback: "\u{1F31F} Coach Maara note: If you print n, it will print the input number repeatedly! You need to print the current divisor i.",
      correction: "Print the divisor i: 'step 2.2 : Print statement to display divisor i'.",
      suggestedInput: "step 2.2 : Print statement to display divisor i",
      matchedFirebaseInput: "print(n)"
    };
  }
  if (isFullyVerified) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: true,
      hasPrint: true,
      isFullyVerified: true,
      completedStepsCount: 4,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Awesome! You have identified all 4 ingredients ready for the Divisors of a Number program. Now let's proceed to Taste the Sample!",
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "step 2.2 : print statement to display divisor i"
    };
  }
  if (hasInput && hasLoop && hasCondition && !hasPrint) {
    return {
      hasInput,
      hasLoop,
      hasCondition,
      hasPrint,
      isFullyVerified: false,
      completedStepsCount: 3,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Hurray, that's right! You have identified the input variable, loop, and modulo condition. Finally, for Step 2.2, what statement is needed inside the if condition to display the divisor i?",
      correction: "Write Step 2.2 to display the divisor: 'step 2.2 : Print statement to display divisor i'.",
      suggestedInput: "step 2.2 : Print statement to display divisor i",
      matchedFirebaseInput: "step 2.1 : if condition with modulo operator: if (n % i == 0)"
    };
  }
  if (hasInput && hasLoop && !hasCondition) {
    let feedbackMsg = "\u{1F31F} Coach Maara here! You have set up your variable and for loop! Now inside the loop (Step 2.1), we need an If condition to check if the current number `i` divides `n` completely.\n\nIn an If condition, we have two sides of the operator:\n\u2022 Left Side (L.S) : n % i (calculates remainder when input n is divided by loop counter i)\n\u2022 Operator : == (equality comparison)\n\u2022 Right Side (R.S) : 0 (checks if remainder is 0)\n\nSo write Step 2.1: 'step 2.1 : If condition with modulo operator: if (n % i == 0)'.";
    let correctionMsg = "In an If condition: Left Side is n % i, Operator is ==, Right Side is 0. Write Step 2.1: 'step 2.1 : If condition with modulo operator: if (n % i == 0)'.";
    let suggestedMsg = "step 2.1 : If condition with modulo operator: if (n % i == 0)";
    if (hasConditionLeftSide && hasConditionRightSide && !hasConditionOperator) {
      feedbackMsg = "\u{1F31F} Coach Maara here! You correctly identified the Left Side (`n % i`) and Right Side (`0`)! You only missed mentioning the comparison operator. In programming, use the equality operator `==` (double equal) to compare them. Add `operator : ==` to complete your if condition.";
      correctionMsg = "You have Left Side (n % i) and Right Side (0). Just specify the operator: 'operator : ==' (or 'if (n % i == 0)').";
      suggestedMsg = "step 3 : use if condition: left side : n % i, operator : ==, right side : 0";
    } else if (hasConditionLeftSide && hasConditionOperator && !hasConditionRightSide) {
      feedbackMsg = "\u{1F31F} Coach Maara here! You specified the Left Side (`n % i`) and Operator (`==`)! You just missed specifying the Right Side. For a divisor, what should the remainder be? It must be `0` (e.g. `right side : 0`).";
      correctionMsg = "Specify the Right Side (remainder 0): 'right side : 0' (or 'if (n % i == 0)').";
      suggestedMsg = "step 3 : use if condition: left side : n % i, operator : ==, right side : 0";
    } else if (!hasConditionLeftSide && hasConditionOperator && hasConditionRightSide) {
      feedbackMsg = "\u{1F31F} Coach Maara here! You specified the Operator (`==`) and Right Side (`0`)! You just missed specifying the Left Side. Use `n % i` to calculate the remainder when dividing the input `n` by loop counter `i`.";
      correctionMsg = "Specify the Left Side (n % i): 'left side : n % i' (or 'if (n % i == 0)').";
      suggestedMsg = "step 3 : use if condition: left side : n % i, operator : ==, right side : 0";
    } else if (hasConditionLeftSide && !hasConditionOperator && !hasConditionRightSide) {
      feedbackMsg = "\u{1F31F} Coach Maara here! You've got the Left Side (`n % i`)! To complete the condition, specify the Operator (`==`) and Right Side (`0` remainder).";
      correctionMsg = "Specify Operator (==) and Right Side (0): 'operator : ==, right side : 0'.";
      suggestedMsg = "step 3 : use if condition: left side : n % i, operator : ==, right side : 0";
    } else if (hasPartialCondition) {
      feedbackMsg = "\u{1F31F} Coach Maara here! You correctly identified that an 'if condition' is needed inside the loop! To write the condition, define its 3 components:\n\u2022 Left Side (L.S) : `n % i` (calculates remainder when `n` is divided by `i`)\n\u2022 Operator : `==` (equality comparison)\n\u2022 Right Side (R.S) : `0` (checks if remainder is 0)\n\nOr write: 'step 2.1 : If condition: if (n % i == 0)'.";
      correctionMsg = "Specify the condition components: Left Side (n % i), Operator (==), Right Side (0) or 'if (n % i == 0)'.";
      suggestedMsg = "step 2.1 : If condition with modulo operator: if (n % i == 0)";
    }
    return {
      hasInput,
      hasLoop,
      hasCondition,
      hasPrint,
      isFullyVerified: false,
      needsIfConditionHint: true,
      completedStepsCount: 2,
      ingredientsStepProgress,
      feedback: feedbackMsg,
      correction: correctionMsg,
      suggestedInput: suggestedMsg,
      matchedFirebaseInput: "step 2.1 : if condition with modulo operator: if (n % i == 0)"
    };
  }
  if (hasInput && hasPartialLoop) {
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint,
      isFullyVerified: false,
      completedStepsCount: 1,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: true, current: false },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: true },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! You've got the right idea with the for loop for Step 2! To make it work in code, we need to define how that loop behaves:\n\u2022 Start : 1 (i) \u2014 we start testing from 1 because dividing by 0 is undefined\n\u2022 Stop : n (i <= n) \u2014 we test up to and including n so n itself is checked\n\u2022 Step : +1 \u2014 increment by 1 each time\n\nPlease specify the loop with its parameters: 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      correction: "Define the loop parameters (Start: 1, Stop: n, Step: +1): 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "step 2 : for loop with start: 1, stop: n, step: +1"
    };
  }
  if (hasInput && !hasLoop) {
    return {
      hasInput,
      hasLoop,
      hasCondition,
      hasPrint,
      isFullyVerified: false,
      completedStepsCount: 1,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Spot on! You have identified 'n for input number' for Step 1. Now, what programming structure do we use to generate numbers from 1 to n repeatedly? Define its Start, Stop, and Step.",
      correction: "Write Step 2: 'step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1'.",
      suggestedInput: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
      matchedFirebaseInput: "step 1 : n for input number"
    };
  }
  if (!hasInput && (hasCompleteLoop || hasPartialLoop)) {
    return {
      hasInput: false,
      hasLoop: hasCompleteLoop,
      hasCondition: false,
      hasPrint: false,
      isFullyVerified: false,
      completedStepsCount: hasCompleteLoop ? 1 : 0,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Variable n for input number", completed: false, current: true },
        { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: hasCompleteLoop, current: false },
        { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! Great thinking on the loop! But before we run the loop up to n, what variable do we need to get and store the input number in Step 1?",
      correction: "Write Step 1: 'step 1 : n for input number'.",
      suggestedInput: "step 1 : n for input number",
      matchedFirebaseInput: "step 1 : n for input number"
    };
  }
  return {
    hasInput: false,
    hasLoop: false,
    hasCondition: false,
    hasPrint: false,
    isFullyVerified: false,
    completedStepsCount: 0,
    ingredientsStepProgress: [
      { stepNumber: 1, title: "Variable n for input number", completed: false, current: true },
      { stepNumber: 2, title: "For loop with Start: 1 (i), Stop: n (i <= n), Step: +1", completed: false, current: false },
      { stepNumber: 3, title: "If condition with modulo operator: if (n % i == 0)", completed: false, current: false },
      { stepNumber: 4, title: "Print statement to display divisor i", completed: false, current: false }
    ],
    feedback: "\u{1F31F} Coach Maara here! Identify the variables, loops, conditions, and operators needed for each step.\nFor Step 1, what variable is needed to store the input number?",
    correction: "Write Step 1: 'step 1 : n for input number'.",
    suggestedInput: "step 1 : n for input number",
    matchedFirebaseInput: "what do i do here"
  };
}
function validateDivisorSampleCode(code, attemptCount = 1) {
  const trimmed = (code || "").trim();
  const isOddEvenForeignCode = /\b(even|odd)\b/i.test(trimmed) || /%\s*2\b/.test(trimmed);
  if (isOddEvenForeignCode) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 0,
      allVerified: false,
      detectedInputName: "n",
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable n`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to n)`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (n % i == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor i`, completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! That code checks if a number is Odd or Even (% 2). In this Divisors challenge, we need to test all divisors from 1 to n using a loop (for i = 1 to n) and check if n % i == 0!",
      correction: "Use a for loop to test each number from 1 to n: for (var i = 1; i <= n; i++)",
      suggestedInput: "for (var i = 1; i <= n; i++)"
    };
  }
  const hasInput = /(?:var|let|const|int|float)?\s*([a-zA-Z_]\w*)\s*=\s*(?:\d+|int\s*\(\s*input|Scanner|prompt)/i.test(trimmed) || /input\s*\(/i.test(trimmed);
  const inputMatch = trimmed.match(/(?:var|let|const|int|float)?\s*([a-zA-Z_]\w*)\s*=\s*\d+/i);
  const rawInputVar = inputMatch ? inputMatch[1] : "n";
  const inputVar = ["for", "if", "while", "int", "var", "let", "const"].includes(rawInputVar.toLowerCase()) ? "n" : rawInputVar;
  const loopVarMatch = trimmed.match(/for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)/i) || trimmed.match(/for\s+([a-zA-Z_]\w*)\s+in/i);
  const rawLoopVar = loopVarMatch ? loopVarMatch[1] : "i";
  const loopVar = ["for", "if", "while", "int", "var", "let", "const", inputVar].includes(rawLoopVar.toLowerCase()) ? "i" : rawLoopVar;
  const isForwardLoop = new RegExp(`for\\s*\\(\\s*(?:(?:var|let|const|int)\\s+)?${loopVar}\\s*=\\s*1\\s*;\\s*${loopVar}\\s*<=\\s*(?:${inputVar}|n|\\d+)\\s*;\\s*(?:\\+\\+\\s*${loopVar}|${loopVar}\\s*\\+\\+|${loopVar}\\s*\\+=\\s*1|${loopVar}\\s*=\\s*${loopVar}\\s*\\+\\s*1)\\s*\\)`, "i").test(trimmed) || /for\s*\(\s*(?:(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*=\s*1\s*;\s*\1\s*<=\s*[a-zA-Z_0-9]+\s*;\s*(?:\+\+\s*\1|\1\s*\+\+|\1\s*\+=\s*1|\1\s*=\s*\1\s*\+\s*1)\s*\)/i.test(trimmed) || new RegExp(`for\\s+${loopVar}\\s+in\\s+range\\s*\\(\\s*1\\s*,\\s*(?:${inputVar}|n|\\d+)\\s*\\+\\s*1\\s*\\)`, "i").test(trimmed) || /for\s+[a-zA-Z_]\w*\s+in\s+range\s*\(\s*1\s*,\s*[a-zA-Z_0-9]+\s*\+\s*1\s*\)/i.test(trimmed);
  const isReverseLoop = new RegExp(`for\\s*\\(\\s*(?:(?:var|let|const|int)\\s+)?${loopVar}\\s*=\\s*(?:${inputVar}|n|\\d+)\\s*;\\s*${loopVar}\\s*>=\\s*1\\s*;\\s*(?:--\\s*${loopVar}|${loopVar}\\s*--|${loopVar}\\s*-=\\s*1|${loopVar}\\s*=\\s*${loopVar}\\s*-\\s*1)\\s*\\)`, "i").test(trimmed) || /for\s*\(\s*(?:(?:var|let|const|int)\s+)?([a-zA-Z_]\w*)\s*=\s*[a-zA-Z_0-9]+\s*;\s*\1\s*>=\s*1\s*;\s*(?:--\s*\1|\1\s*--|\1\s*-=\\s*1|\1\s*=\\s*\1\s*-\\s*1)\s*\)/i.test(trimmed) || new RegExp(`for\\s+${loopVar}\\s+in\\s+range\\s*\\(\\s*(?:${inputVar}|n|\\d+)\\s*,\\s*0\\s*,\\s*-1\\s*\\)`, "i").test(trimmed);
  const isWhileLoop = new RegExp(`while\\s*\\(\\s*${loopVar}\\s*<=\\s*(?:${inputVar}|n|\\d+)\\s*\\)`, "i").test(trimmed) && /(?:var|let|int)?\s*[a-zA-Z_]\w*\s*=\s*1/i.test(trimmed);
  const hasLoop = isForwardLoop || isReverseLoop || isWhileLoop;
  const startsAtInputReversedCondition = !isReverseLoop && (new RegExp(`for\\s*\\(\\s*(?:(?:var|let|const|int)\\s+)?${loopVar}\\s*=\\s*(?:${inputVar}|n)\\s*;\\s*${loopVar}\\s*<=?\\s*1`, "i").test(trimmed) || /for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*)\s*;\s*\1\s*<=?\s*1/i.test(trimmed));
  const startsAtInputWithIncrement = !isReverseLoop && !startsAtInputReversedCondition && (new RegExp(`for\\s*\\(\\s*(?:(?:var|let|const|int)\\s+)?${loopVar}\\s*=\\s*(?:${inputVar}|n)\\s*;[^;]*;\\s*(?:\\+\\+\\s*${loopVar}|${loopVar}\\s*\\+\\+|${loopVar}\\s*\\+=\\s*1)`, "i").test(trimmed) || /for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*)\s*;[^;]*;\s*(?:\+\+\s*\1|\1\s*\+\+|\1\s*\+=\s*1)/i.test(trimmed));
  const startsAtZero = /for\s*\(\s*(?:var|let|int)?\s*([a-zA-Z_]\w*)\s*=\s*0/i.test(trimmed) || /range\s*\(\s*0\s*,/i.test(trimmed) || /while\s*\(\s*([a-zA-Z_]\w*)\s*=\s*0/i.test(trimmed);
  const missesN = !hasLoop && (/for\s*\([^;]+;\s*[a-zA-Z_]\w*\s*<\s*[a-zA-Z_]\w*\s*;/i.test(trimmed) && !/<=/.test(trimmed));
  const pythonMissesN = !hasLoop && /range\s*\(\s*1\s*,\s*([a-zA-Z_]\w*)\s*\)/i.test(trimmed) && !/\+\s*1/.test(trimmed);
  const infiniteLoopDecrement = new RegExp(`for\\s*\\(\\s*(?:(?:var|let|const|int)\\s+)?${loopVar}\\s*=\\s*1\\s*;[^;]*;\\s*(?:--\\s*${loopVar}|${loopVar}\\s*--|${loopVar}\\s*-=\\s*1)`, "i").test(trimmed);
  const isMalformedForLoop = !hasLoop && /for\s*\(/i.test(trimmed);
  const hasCondition = /if\s*\(\s*[a-zA-Z_]\w*\s*%\s*[a-zA-Z_]\w*\s*={2,3}\s*0\s*\)/i.test(trimmed) || /if\s+[a-zA-Z_]\w*\s*%\s*[a-zA-Z_]\w*\s*={2,3}\s*0/i.test(trimmed) || new RegExp(`if\\s*\\(\\s*${inputVar}\\s*%\\s*${loopVar}\\s*={2,3}\\s*0\\s*\\)`, "i").test(trimmed) || new RegExp(`if\\s+${inputVar}\\s*%\\s*${loopVar}\\s*={2,3}\\s*0`, "i").test(trimmed);
  const divisionInIf = !hasCondition && (/if\s*\(\s*[a-zA-Z_]\w*\s*\/\s*[a-zA-Z_]\w*(?:\s*={1,3}\s*0)?\s*\)/i.test(trimmed) || /if\s+[a-zA-Z_]\w*\s*\/\s*[a-zA-Z_]\w*(?:\s*={1,3}\s*0)?/i.test(trimmed) || /(?:^|\s|\n)[a-zA-Z_]\w*\s*\/\s*[a-zA-Z_]\w*\s*={1,3}\s*0/i.test(trimmed));
  const divisionOrderReversed = !hasCondition && (new RegExp(`if\\s*\\(\\s*${loopVar}\\s*\\/\\s*${inputVar}(?:\\s*={1,3}\\s*0)?`, "i").test(trimmed) || /if\s*\(\s*i\s*\/\s*[a-zA-Z_]\w*(?:\s*={1,3}\s*0)?/i.test(trimmed));
  const multiplicationInIf = !hasCondition && /if\s*\(\s*[a-zA-Z_]\w*\s*\*\s*[a-zA-Z_]\w*(?:\s*={1,3}\s*0)?\s*\)/i.test(trimmed);
  const assignmentInIf = !hasCondition && /if\s*\(\s*[a-zA-Z_]\w*\s*%\s*[a-zA-Z_]\w*\s*=\s*0\s*\)/i.test(trimmed) && !/==/.test(trimmed);
  const orderReversed = !hasCondition && (new RegExp(`if\\s*\\(\\s*${loopVar}\\s*%\\s*${inputVar}\\s*={1,3}\\s*0`, "i").test(trimmed) || /if\s*\(\s*i\s*%\s*[a-zA-Z_]\w*\s*={1,3}\s*0/i.test(trimmed));
  const nonZeroRemainderInIf = !hasCondition && /if\s*\(\s*[a-zA-Z_]\w*\s*%\s*[a-zA-Z_]\w*\s*(?:!=|>|<|==\s*[1-9])\s*\d*\s*\)/i.test(trimmed);
  const isMalformedIf = !hasCondition && !divisionInIf && !assignmentInIf && !orderReversed && /if\s*\(/i.test(trimmed) && !/if\s*\([^)]+\)/i.test(trimmed);
  const printsInput = new RegExp(`(?:print|console\\.log|System\\.out\\.println)\\s*\\(\\s*${inputVar}\\s*\\)`, "i").test(trimmed);
  const emptyIfWithPrintOutside = /if\s*\([^)]+\)\s*\{\s*\}\s*(?:print|console\.log)/i.test(trimmed);
  const hasBreak = /break\s*;/i.test(trimmed) || /\bbreak\b/i.test(trimmed);
  const hasPrint = new RegExp(`(?:print|console\\.log|System\\.out\\.println|cout\\s*<<)\\s*\\(?\\s*${loopVar}\\b`, "i").test(trimmed) || /print\s*\(\s*i\s*\)/i.test(trimmed) || /console\.log\s*\(\s*i\s*\)/i.test(trimmed);
  const hasAnyCode = hasInput || hasLoop || hasCondition || hasPrint || startsAtZero || missesN || pythonMissesN || assignmentInIf || divisionInIf;
  const isSyntaxQuery = !hasAnyCode && (/^(do i need|how to|can you|what to|what i|what do|why|explain|syntax|help|theriyala|puriyala)/i.test(trimmed) || trimmed.toLowerCase().includes("do i need to write the code here") || trimmed.toLowerCase().includes("what should i do") || trimmed.toLowerCase().includes("what do i do") || trimmed.toLowerCase().includes("what i do here") || trimmed.toLowerCase().includes("how to start") || trimmed.toLowerCase().includes("how to write"));
  if (isSyntaxQuery) {
    return {
      hasInput: false,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 0,
      allVerified: false,
      isSyntaxQuery: true,
      detectedInputName: "a",
      detectedLoopVar: "i",
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "Ingredient 1: Input variable (var a = 4;)", completed: false, current: true },
        { stepNumber: 2, title: "Ingredient 2: For loop (from 1 to a)", completed: false, current: false },
        { stepNumber: 3, title: "Ingredient 2.1: If condition (a % i == 0)", completed: false, current: false },
        { stepNumber: 4, title: "Ingredient 2.2: Print divisor (print(i))", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! To assemble our sample prototype, follow the ingredients we planned in Stage 3 step-by-step:\n\u2022 Step 1: Declare your input variable (e.g., `var a = 4;`)\n\u2022 Step 2: For loop with Start: 1 (i), Stop: a (i <= a), Step: +1\n\u2022 Step 2.1: If condition with modulo: `if (a % i == 0)`\n\u2022 Step 2.2: Print statement to display the divisor: `print(i);`\n\nLet's start with Step 1: declare your input variable!",
      correction: "Based on Ingredient Step 1, declare your input variable: var a = 4;",
      suggestedInput: "var a = 4;",
      matchedFirebaseInput: "do i need to write the code here"
    };
  }
  if (startsAtInputReversedCondition) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to ${inputVar})`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Loop start & boundary check! You wrote \`for(${loopVar}=${inputVar}; ${loopVar}<=1; ${loopVar}++)\`. Because \`${loopVar}\` starts at \`${inputVar}\` (e.g. 5), the condition \`${loopVar} <= 1\` is immediately false, so the loop will never execute!

Remember Ingredient Step 2: we must test each divisor starting from 1 up to \`${inputVar}\`:
\u2022 Start: 1 (\`${loopVar} = 1\`)
\u2022 Stop: \`${inputVar}\` (\`${loopVar} <= ${inputVar}\`)
\u2022 Step: +1 (\`${loopVar}++\`)

Change your loop to: \`for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)\`.`,
      correction: `Based on Ingredient Step 2, change loop to count from 1 to ${inputVar}: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "loop start and boundary check"
    };
  }
  if (startsAtInputWithIncrement) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to ${inputVar})`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Your loop starts at \`${inputVar}\` (\`${loopVar} = ${inputVar}\`) and increments upward. To test all divisors, the loop must start from 1 up to \`${inputVar}\`!

Update your loop to: \`for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)\`.`,
      correction: `Based on Ingredient Step 2, write loop from 1 to ${inputVar}: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "loop starts at n with increment"
    };
  }
  if (infiniteLoopDecrement) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to ${inputVar})`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Step direction check! Starting at 1 with \`${loopVar}--\` will count backwards into negative numbers and cause an infinite loop. Use \`${loopVar}++\` to step forward from 1 to \`${inputVar}\`!`,
      correction: `Change loop step to increment: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "loop decrement bug"
    };
  }
  if (startsAtZero) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop from 1 to ${inputVar} (Start at 1)`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Bug alert: loop variable starts at 0, leading to ${inputVar} % 0 (Division by zero error!). Remember our Ingredient Step 2: loop must start at 1! Change loop initialization to start at 1: \`for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)\`.`,
      correction: `Based on Ingredient Step 2, change loop initialization to start at 1: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "bug alert: i starts at 0"
    };
  }
  if (missesN || pythonMissesN) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop from 1 to ${inputVar} (<= ${inputVar})`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Boundary bug: \`${loopVar} < ${inputVar}\` stops before ${inputVar}, missing ${inputVar} itself as a divisor! Remember Ingredient Step 2: Stop: ${inputVar} (inclusive <=). Change condition to \`${loopVar} <= ${inputVar}\` (or in Python: \`range(1, ${inputVar} + 1)\`).`,
      correction: `Based on Ingredient Step 2, change loop condition to include ${inputVar}: ${loopVar} <= ${inputVar}.`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "boundary bug: i < n"
    };
  }
  if (isMalformedForLoop) {
    return {
      hasInput: true,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: 1,
      allVerified: false,
      detectedInputName: inputVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to ${inputVar})`, completed: false, current: true },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Loop syntax check! For Ingredient Step 2, write a complete for loop with Start: 1, Stop: \`${inputVar}\` (\`${loopVar} <= ${inputVar}\`), and Step: +1 (\`${loopVar}++\`):
\`for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)\`.`,
      correction: `Based on Ingredient Step 2, write loop from 1 to ${inputVar}: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      suggestedInput: `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`,
      matchedFirebaseInput: "malformed for loop"
    };
  }
  const ifConditionMatch = trimmed.match(/if\s*\(\s*([a-zA-Z_]\w*)\s*([%/])\s*([a-zA-Z_]\w*)\s*(={1,3})\s*(\d+)\s*\)/i) || trimmed.match(/if\s+([a-zA-Z_]\w*)\s*([%/])\s*([a-zA-Z_]\w*)\s*(={1,3})\s*(\d+)/i) || trimmed.match(/if\s*\(\s*([a-zA-Z_]\w*)\s*([%/])\s*([a-zA-Z_]\w*)\s*\)/i);
  if (ifConditionMatch) {
    const lhs = ifConditionMatch[1];
    const mathOp = ifConditionMatch[2];
    const rhs = ifConditionMatch[3];
    const relOp = ifConditionMatch[4] || "";
    if (mathOp === "/") {
      const isReversed2 = lhs.toLowerCase() === loopVar.toLowerCase() && rhs.toLowerCase() === inputVar.toLowerCase() || lhs.toLowerCase() === "i" && rhs.toLowerCase() !== "i";
      if (isReversed2) {
        return {
          hasInput: true,
          hasLoop: true,
          hasCondition: false,
          hasPrint: false,
          completedCount: 2,
          allVerified: false,
          detectedInputName: inputVar,
          detectedLoopVar: loopVar,
          sampleCodeStepProgress: [
            { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
            { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
            { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
            { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
          ],
          feedback: `\u{1F31F} Coach Maara note: Look at your condition \`if(${lhs}/${rhs}${relOp ? relOp + "0" : ""})\`. Two adjustments are needed:
1. Use the **modulo operator \`%\`** instead of \`/\` to calculate remainder.
2. Divide the input number \`${inputVar}\` by the loop counter \`${loopVar}\` (\`${inputVar} % ${loopVar}\`), not the other way around!

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
          correction: `Based on Ingredient Step 2.1, write if (${inputVar} % ${loopVar} == 0)`,
          suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
          matchedFirebaseInput: "division order reversed in if"
        };
      }
      return {
        hasInput: true,
        hasLoop: true,
        hasCondition: false,
        hasPrint: false,
        completedCount: 2,
        allVerified: false,
        detectedInputName: inputVar,
        detectedLoopVar: loopVar,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
          { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
          { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
          { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
        ],
        feedback: `\u{1F31F} Coach Maara note: Operator check! You wrote \`if(${lhs}/${rhs}${relOp ? relOp + "0" : ""})\`. In programming, the \`/\` (division) operator calculates the **quotient** (for example, 5 / 1 = 5, not 0), whereas to check if a number divides evenly, we need to check if the **remainder is 0** using the **modulo operator \`%\`**!

Remember Ingredient Step 2.1:
\u2022 Left Side (L.S): \`${inputVar} % ${loopVar}\`
\u2022 Operator: \`==\`
\u2022 Right Side (R.S): \`0\`

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
        correction: `Based on Ingredient Step 2.1, use modulo operator % instead of /: write if (${inputVar} % ${loopVar} == 0)`,
        suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
        matchedFirebaseInput: "division instead of modulo in if"
      };
    }
    const isReversed = lhs.toLowerCase() === loopVar.toLowerCase() && rhs.toLowerCase() === inputVar.toLowerCase() || lhs.toLowerCase() === "i" && rhs.toLowerCase() !== "i";
    if (isReversed) {
      if (relOp === "=") {
        return {
          hasInput: true,
          hasLoop: true,
          hasCondition: false,
          hasPrint: false,
          completedCount: 2,
          allVerified: false,
          detectedInputName: inputVar,
          detectedLoopVar: loopVar,
          sampleCodeStepProgress: [
            { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
            { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
            { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
            { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
          ],
          feedback: `\u{1F31F} Coach Maara note: Look at your condition \`if(${lhs}%${rhs}=0)\`. Two adjustments are needed:
1. **Order check**: You wrote \`${lhs} % ${rhs}\`. To test divisors of \`${inputVar}\`, divide the input number by the counter: \`${inputVar} % ${loopVar}\`.
2. **Operator check**: Single \`=\` is assignment; use \`==\` (equality comparison) to compare with 0.

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
          correction: `Based on Ingredient Step 2.1, write if (${inputVar} % ${loopVar} == 0)`,
          suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
          matchedFirebaseInput: "syntax error: i % n = 0"
        };
      }
      return {
        hasInput: true,
        hasLoop: true,
        hasCondition: false,
        hasPrint: false,
        completedCount: 2,
        allVerified: false,
        detectedInputName: inputVar,
        detectedLoopVar: loopVar,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
          { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
          { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
          { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
        ],
        feedback: `\u{1F31F} Coach Maara note: Variable order check! In \`if(${lhs}%${rhs}==0)\`, you are dividing the loop counter \`${lhs}\` by \`${rhs}\`. To test divisors of \`${inputVar}\`, we must divide the input number \`${inputVar}\` by each testing counter \`${loopVar}\`!

Update your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
        correction: `Based on Ingredient Step 2.1, Left Side is ${inputVar} % ${loopVar}: write if (${inputVar} % ${loopVar} == 0)`,
        suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
        matchedFirebaseInput: "syntax error: i % n == 0"
      };
    }
    if (relOp === "=") {
      return {
        hasInput: true,
        hasLoop: true,
        hasCondition: false,
        hasPrint: false,
        completedCount: 2,
        allVerified: false,
        detectedInputName: inputVar,
        detectedLoopVar: loopVar,
        sampleCodeStepProgress: [
          { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
          { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
          { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
          { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
        ],
        feedback: `\u{1F31F} Coach Maara note: Syntax error: \`${lhs} % ${rhs} = 0\` is an assignment. Remember Ingredient Step 2.1: Operator is \`==\` (equality comparison)! Change to \`if (${inputVar} % ${loopVar} == 0)\`.`,
        correction: `Based on Ingredient Step 2.1, use == operator: if (${inputVar} % ${loopVar} == 0)`,
        suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
        matchedFirebaseInput: "syntax error: n % i = 0"
      };
    }
  }
  if (divisionInIf) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Operator check! In programming, the \`/\` (division) operator calculates the **quotient**, whereas to check if a number divides evenly, we need to check if the **remainder is 0** using the **modulo operator \`%\`**!

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
      correction: `Based on Ingredient Step 2.1, use modulo operator % instead of /: write if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "division instead of modulo in if"
    };
  }
  if (multiplicationInIf) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Operator check! In \`if(${inputVar} * ${loopVar} == 0)\`, you used \`*\` (multiplication). To check if \`${loopVar}\` is a divisor of \`${inputVar}\`, we must test if the division remainder is 0 using the **modulo operator \`%\`**!

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
      correction: `Based on Ingredient Step 2.1, use modulo operator %: write if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "multiplication in if"
    };
  }
  if (assignmentInIf) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Syntax error: \`${inputVar} % ${loopVar} = 0\` is an assignment. Remember Ingredient Step 2.1: Operator is \`==\` (equality comparison)! Change to \`if (${inputVar} % ${loopVar} == 0)\`.`,
      correction: `Based on Ingredient Step 2.1, use == operator: if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "syntax error: n % i = 0"
    };
  }
  if (orderReversed) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Variable order check: In Ingredient Step 2.1, Left Side is \`${inputVar} % ${loopVar}\` (divide input number by loop counter). Update to \`if (${inputVar} % ${loopVar} == 0)\`.`,
      correction: `Based on Ingredient Step 2.1, Left Side is ${inputVar} % ${loopVar}: write if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "syntax error: i % n == 0"
    };
  }
  if (nonZeroRemainderInIf) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: Remainder comparison check! A number is a divisor only when it divides completely with **remainder equal to 0** (\`== 0\`).

Change your condition to: \`if (${inputVar} % ${loopVar} == 0)\`.`,
      correction: `Based on Ingredient Step 2.1, compare remainder with 0: write if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "non zero remainder in if"
    };
  }
  if (isMalformedIf) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: `\u{1F31F} Coach Maara note: If condition syntax check! For Ingredient Step 2.1, complete your if condition: \`if (${inputVar} % ${loopVar} == 0) {\``,
      correction: `Based on Ingredient Step 2.1, write: if (${inputVar} % ${loopVar} == 0)`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0)`,
      matchedFirebaseInput: "malformed if condition"
    };
  }
  if (hasBreak) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: true,
      hasPrint: false,
      completedCount: 3,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: true, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: true }
      ],
      feedback: "\u{1F31F} Coach Maara note: Logic bug: `break` terminates the loop after finding only the first divisor (1). Remove `break` so the loop continues and prints all divisors!",
      correction: "Remove the `break;` statement from inside your loop.",
      suggestedInput: `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`,
      matchedFirebaseInput: "logic bug: break"
    };
  }
  if (printsInput) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: true,
      hasPrint: false,
      completedCount: 3,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: true, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: true }
      ],
      feedback: `\u{1F31F} Coach Maara note: Output bug: You wrote \`print(${inputVar})\`, which will repeatedly print the input number (${inputVar}). Remember Ingredient Step 2.2: display the divisor \`${loopVar}\`! Write \`print(${loopVar});\`.`,
      correction: `Based on Ingredient Step 2.2, change print(${inputVar}) to print(${loopVar}).`,
      suggestedInput: `print(${loopVar});`,
      matchedFirebaseInput: "output bug: print(n)"
    };
  }
  if (emptyIfWithPrintOutside) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: true,
      hasPrint: false,
      completedCount: 3,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: true, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: true }
      ],
      feedback: `\u{1F31F} Coach Maara note: Indentation/placement bug: \`print(${loopVar})\` must be placed INSIDE the \`{ ... }\` of the if statement so only valid divisors get printed!`,
      correction: `Based on Ingredient Step 2.2, place print(${loopVar}) inside the if block.`,
      suggestedInput: `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`,
      matchedFirebaseInput: "indentation bug: print outside if"
    };
  }
  const completedCount = [hasInput, hasLoop, hasCondition, hasPrint].filter(Boolean).length;
  const allVerified = hasInput && hasLoop && hasCondition && hasPrint;
  const sampleCodeStepProgress = [
    { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: hasInput, current: !hasInput },
    { stepNumber: 2, title: `Ingredient 2: For loop (1 to ${inputVar})`, completed: hasLoop, current: hasInput && !hasLoop },
    { stepNumber: 3, title: `Ingredient 2.1: If (${inputVar} % ${loopVar} == 0)`, completed: hasCondition, current: hasInput && hasLoop && !hasCondition },
    { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: hasPrint, current: hasInput && hasLoop && hasCondition && !hasPrint }
  ];
  if (allVerified) {
    return {
      hasInput: true,
      hasLoop: true,
      hasCondition: true,
      hasPrint: true,
      completedCount: 4,
      allVerified: true,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara here! You gotcha! All 4 ingredients are perfectly assembled: input variable \`${inputVar}\`, loop from 1 to \`${inputVar}\`, condition \`if (${inputVar} % ${loopVar} == 0)\`, and \`print(${loopVar})\`! That completes the Divisors of a Number Cook The Code journey. Let's code! \u{1F680}`,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "complete sample code verified"
    };
  }
  if (!hasLoop) {
    let loopFeedback = "";
    let loopCorrection = "";
    let loopSuggested = "";
    if (hasInput) {
      if (attemptCount <= 1) {
        loopFeedback = `\u{1F31F} Coach Maara here! Superb start! You declared your input variable \`${inputVar}\` (Ingredient Step 1).

Now, bring in **Ingredient Step 2**! Before checking conditions, write a **For loop** with Start: 1, Stop: \`${inputVar}\` (\`${loopVar} <= ${inputVar}\`), and Step: +1 to test every number from 1 to \`${inputVar}\`:
\`for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {\``;
        loopCorrection = `Based on Ingredient Step 2 (Start: 1, Stop: ${inputVar}, Step: +1), write the loop from 1 to ${inputVar}: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`;
        loopSuggested = `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {

}`;
      } else if (attemptCount === 2) {
        loopFeedback = `\u{1F31F} Coach Maara loop breakdown (Step 2):
We need a loop to test every possible divisor from 1 up to \`${inputVar}\`:
\u2022 **Start:** \`${loopVar} = 1\`
\u2022 **Stop boundary:** \`${loopVar} <= ${inputVar}\`
\u2022 **Step:** \`${loopVar}++\`

Add this loop structure to your code!`;
        loopCorrection = `Step 2: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++)`;
        loopSuggested = `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {

}`;
      } else if (attemptCount === 3) {
        loopFeedback = `\u{1F31F} Coach Maara loop syntax template (Step 2):
\`\`\`javascript
for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {
  // if condition inside
}
\`\`\`
\u{1F40D} In Python:
\`\`\`python
for ${loopVar} in range(1, ${inputVar} + 1):
    pass
\`\`\``;
        loopCorrection = `Step 2: Write for loop from 1 to ${inputVar}`;
        loopSuggested = `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {

}`;
      } else {
        loopFeedback = `\u{1F31F} Coach Maara worked code (Step 2):
Add this loop below your input variable declaration:
\`\`\`javascript
for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {
}
\`\`\``;
        loopCorrection = `Step 2: for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) { }`;
        loopSuggested = `for (var ${loopVar} = 1; ${loopVar} <= ${inputVar}; ${loopVar}++) {

}`;
      }
    } else {
      if (attemptCount <= 1) {
        loopFeedback = `\u{1F31F} Coach Maara here! Start your prototype code with Ingredient Step 1: declare the input variable (e.g. \`var a = 4;\` or \`var n = 6;\`). Give it a shot!`;
        loopCorrection = `Based on Ingredient Step 1, declare the input variable: var a = 4;`;
        loopSuggested = `var a = 4;`;
      } else if (attemptCount === 2) {
        loopFeedback = `\u{1F31F} Coach Maara variable guidance (Step 1): Before looping, declare the number you want to find divisors for:
\`var a = 4;\` (or \`var n = 6;\`).`;
        loopCorrection = `Step 1: Declare input variable e.g. var a = 4;`;
        loopSuggested = `var a = 4;`;
      } else {
        loopFeedback = `\u{1F31F} Coach Maara syntax (Step 1):
\`\`\`javascript
var a = 4;
\`\`\`
\u{1F40D} In Python: \`a = 4\``;
        loopCorrection = `Step 1: var a = 4;`;
        loopSuggested = `var a = 4;`;
      }
    }
    return {
      hasInput,
      hasLoop: false,
      hasCondition: false,
      hasPrint: false,
      completedCount: hasInput ? 1 : 0,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: hasInput, current: !hasInput },
        { stepNumber: 2, title: `Ingredient 2: For loop (from 1 to ${inputVar})`, completed: false, current: hasInput },
        { stepNumber: 3, title: `Ingredient 2.1: If (${inputVar} % ${loopVar} == 0)`, completed: false, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: loopFeedback,
      correction: loopCorrection,
      suggestedInput: loopSuggested,
      matchedFirebaseInput: hasInput ? "step 2: for loop" : "step 1: declare input variable"
    };
  }
  if (hasLoop && !hasCondition) {
    let condFeedback = "";
    let condCorrection = "";
    let condSuggested = "";
    if (attemptCount <= 1) {
      condFeedback = `\u{1F31F} Coach Maara here! Great loop! You have your input variable \`${inputVar}\` (Ingredient Step 1) and your For loop from 1 to \`${inputVar}\` (Ingredient Step 2).

Now, bring in **Ingredient Step 2.1**! Inside the loop body, add the **If condition with modulo operator** to test if \`${inputVar}\` is divisible by \`${loopVar}\` with remainder 0:
\u2022 Left Side (L.S) : ${inputVar} % ${loopVar}
\u2022 Operator : ==
\u2022 Right Side (R.S) : 0

Write: \`if (${inputVar} % ${loopVar} == 0) {\``;
      condCorrection = `Based on Ingredient Step 2.1 (L.S: ${inputVar} % ${loopVar}, Op: ==, R.S: 0), write: if (${inputVar} % ${loopVar} == 0)`;
      condSuggested = `if (${inputVar} % ${loopVar} == 0)`;
    } else if (attemptCount === 2) {
      condFeedback = `\u{1F31F} Coach Maara condition breakdown (Step 2.1):
Inside the loop, test if \`${loopVar}\` divides \`${inputVar}\` evenly:
\u2022 Left Side: \`${inputVar} % ${loopVar}\` (remainder)
\u2022 Operator: \`==\`
\u2022 Right Side: \`0\`

Combine this into: \`if (${inputVar} % ${loopVar} == 0) { ... }\``;
      condCorrection = `Step 2.1: if (${inputVar} % ${loopVar} == 0)`;
      condSuggested = `if (${inputVar} % ${loopVar} == 0)`;
    } else if (attemptCount === 3) {
      condFeedback = `\u{1F31F} Coach Maara syntax template (Step 2.1):
\`\`\`javascript
  if (${inputVar} % ${loopVar} == 0) {
    // print inside
  }
\`\`\`
\u{1F40D} In Python:
\`\`\`python
    if ${inputVar} % ${loopVar} == 0:
        pass
\`\`\``;
      condCorrection = `Step 2.1: if (${inputVar} % ${loopVar} == 0)`;
      condSuggested = `if (${inputVar} % ${loopVar} == 0)`;
    } else {
      condFeedback = `\u{1F31F} Coach Maara worked code (Step 2.1):
Add this condition inside your loop body:
\`\`\`javascript
  if (${inputVar} % ${loopVar} == 0) {
  }
\`\`\``;
      condCorrection = `Step 2.1: if (${inputVar} % ${loopVar} == 0)`;
      condSuggested = `if (${inputVar} % ${loopVar} == 0)`;
    }
    return {
      hasInput,
      hasLoop: true,
      hasCondition: false,
      hasPrint: false,
      completedCount: 2,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: false, current: true },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: false }
      ],
      feedback: condFeedback,
      correction: condCorrection,
      suggestedInput: condSuggested,
      matchedFirebaseInput: "step 3: if condition with modulo"
    };
  }
  if (hasLoop && hasCondition && !hasPrint) {
    let printFeedback = "";
    let printCorrection = "";
    let printSuggested = "";
    if (attemptCount <= 1) {
      printFeedback = `\u{1F31F} Coach Maara here! You've set up the condition (Ingredient Step 2.1)!

Now, bring in **Ingredient Step 2.2**! Inside the if block, add the print statement to output the divisor \`${loopVar}\`: \`print(${loopVar});\` (or \`console.log(${loopVar});\`).`;
      printCorrection = `Based on Ingredient Step 2.2, add print(${loopVar}) inside the if block.`;
      printSuggested = `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`;
    } else if (attemptCount === 2) {
      printFeedback = `\u{1F31F} Coach Maara output step (Step 2.2):
When the condition \`${inputVar} % ${loopVar} == 0\` is met, \`${loopVar}\` is a confirmed divisor! Print \`${loopVar}\` directly inside the if block:
\`print(${loopVar});\``;
      printCorrection = `Step 2.2: print(${loopVar});`;
      printSuggested = `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`;
    } else if (attemptCount === 3) {
      printFeedback = `\u{1F31F} Coach Maara syntax template (Step 2.2):
\`\`\`javascript
  if (${inputVar} % ${loopVar} == 0) {
    print(${loopVar});
  }
\`\`\`
\u{1F40D} In Python:
\`\`\`python
    if ${inputVar} % ${loopVar} == 0:
        print(${loopVar})
\`\`\``;
      printCorrection = `Step 2.2: print(${loopVar});`;
      printSuggested = `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`;
    } else {
      printFeedback = `\u{1F31F} Coach Maara final touch (Step 2.2):
Complete your prototype with the print statement inside the if block:
\`\`\`javascript
  if (${inputVar} % ${loopVar} == 0) {
    print(${loopVar});
  }
\`\`\``;
      printCorrection = `Step 2.2: print(${loopVar});`;
      printSuggested = `if (${inputVar} % ${loopVar} == 0) {
  print(${loopVar});
}`;
    }
    return {
      hasInput,
      hasLoop: true,
      hasCondition: true,
      hasPrint: false,
      completedCount: 3,
      allVerified: false,
      detectedInputName: inputVar,
      detectedLoopVar: loopVar,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: `Ingredient 1: Input variable ${inputVar}`, completed: true, current: false },
        { stepNumber: 2, title: `Ingredient 2: Loop 1 to ${inputVar}`, completed: true, current: false },
        { stepNumber: 3, title: `Ingredient 2.1: If condition (${inputVar} % ${loopVar} == 0)`, completed: true, current: false },
        { stepNumber: 4, title: `Ingredient 2.2: Print divisor ${loopVar}`, completed: false, current: true }
      ],
      feedback: printFeedback,
      correction: printCorrection,
      suggestedInput: printSuggested,
      matchedFirebaseInput: "step 4: print statement"
    };
  }
  return {
    hasInput: false,
    hasLoop: false,
    hasCondition: false,
    hasPrint: false,
    completedCount: 0,
    allVerified: false,
    sampleCodeStepProgress,
    feedback: "\u{1F31F} Coach Maara here! Start your prototype code with Ingredient Step 1: declare the input variable (e.g. `var a = 4;` or `var n = 6;`). Give it a shot!",
    correction: "Based on Ingredient Step 1, declare the input variable: var a = 4;",
    suggestedInput: "var a = 4;",
    matchedFirebaseInput: "step 1: declare input variable"
  };
}
export {
  checkMentionedDivisors,
  checkModuloArithmetic,
  extractDivisorInputAnalysis,
  formatDivisorBreakdown,
  validateDivisorIngredients,
  validateDivisorLogic,
  validateDivisorRecipe,
  validateDivisorSampleCode
};
