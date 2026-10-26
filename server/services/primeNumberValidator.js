function isPrimeNumber(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}
function analyzePrimeLogicInput(text) {
  const norm = (text || "").toLowerCase();
  const arithmeticErrors = [];
  const divisorsFound = [];
  let zeroRemainderCount = 0;
  let totalEquationsCount = 0;
  let testedNumber = null;
  const nMatches = [
    /\b(?:n|num|number|val|input)\s*[:=]\s*(\d+)\b/i,
    /\b(?:for|test|testing|take|check)\s+(?:n\s*[:=]\s*)?(\d+)\b/i,
    /\bprime\s+number\s+(\d+)\b/i
  ];
  for (const re of nMatches) {
    const m = text.match(re);
    if (m && m[1]) {
      testedNumber = parseInt(m[1], 10);
      break;
    }
  }
  const eqRegex = /(\d+)\s*([%/%*+])\s*(\d+)\s*=\s*(\d+)/gi;
  let match;
  let hasModulo = false;
  let hasWrongOp = false;
  let hasSlashAsRemainder = false;
  while ((match = eqRegex.exec(text || "")) !== null) {
    const a = parseInt(match[1], 10);
    const op = match[2];
    const b = parseInt(match[3], 10);
    const result = parseInt(match[4], 10);
    if (op === "%") {
      hasModulo = true;
      if (!testedNumber) testedNumber = a;
      totalEquationsCount++;
      if (b !== 0) {
        const actualRem = a % b;
        if (result !== actualRem) {
          arithmeticErrors.push(`In \`${a} % ${b} = ${result}\`, the actual remainder is **${actualRem}** (not ${result}).`);
        } else if (result === 0) {
          zeroRemainderCount++;
          divisorsFound.push(b);
        }
      }
    } else if (op === "/") {
      if (b !== 0 && result === a % b) {
        hasSlashAsRemainder = true;
        if (!testedNumber) testedNumber = a;
        totalEquationsCount++;
        if (result === 0) {
          zeroRemainderCount++;
          divisorsFound.push(b);
        }
      } else {
        hasWrongOp = true;
      }
    } else {
      hasWrongOp = true;
    }
  }
  const mentionsTwoDivisorsRule = /2\s*times/i.test(norm) || /two\s*times/i.test(norm) || /count\s+of\s+zero.*(?:two|2)/i.test(norm) || /count.*(?:two|2)\s*times/i.test(norm) || /getting\s*(?:two|2)\s*times\s*zero/i.test(norm) || /only\s*(?:two|2)\s*(?:divisors?|factors?|times)/i.test(norm) || /divisible\s*by\s*1\s*and\s*itself/i.test(norm) || /divisible\s*by\s*one\s*and\s*itself/i.test(norm) || /divided\s*by\s*1\s*and\s*itself/i.test(norm);
  const mentionsCompositeFact = norm.includes("not prime") || norm.includes("composite") || /4\s*times/i.test(norm) || /more than (?:two|2)/i.test(norm);
  return {
    testedNumber,
    isPrime: testedNumber !== null ? isPrimeNumber(testedNumber) : null,
    zeroRemainderCount,
    totalEquationsCount,
    divisorsFound,
    hasModuloOperator: hasModulo,
    hasSlashAsRemainder,
    hasWrongOperator: hasWrongOp,
    arithmeticErrors,
    mentionsTwoDivisorsRule,
    mentionsCompositeFact
  };
}
function validatePrimeLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  const rawText = (text || "").toLowerCase();
  const analysis = analyzePrimeLogicInput(text);
  if (/^(what\s+is|how\s+to|what\s+do|explain|help|tell me|what\s+should)/i.test(norm) && (norm.includes("what is a prime number") || norm.includes("how to find prime") || norm.includes("how do i know") || norm.includes("what should we do to check") || norm.includes("how to check"))) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! What is a Prime Number? For example, why is 7 called a prime number, but 6 is not? How many numbers can divide them completely?\n\nWhen we divide a number n by numbers from 1 to n using the modulo operator (%), the remainder is 0 exactly twice for a prime number. Try testing a number like 5 with % from 1 to 5!",
      correction: "Test a number (like n = 5) by dividing it with modulo % from 1 to n.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (at 1 and 5), so 5 is a Prime number.",
      matchedFirebaseInput: "what should we do to check if a number is prime"
    };
  }
  if (norm.includes("don t know") || norm.includes("dont know") || norm.includes("puriyala") || norm.includes("theriyala") || norm.includes("no idea")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! A prime number is a whole number greater than 1 that has exactly two distinct divisors: 1 and itself.\n\nFor example:\n\u2022 7 can only be divided by 1 and 7 (Prime)\n\u2022 6 can be divided by 1, 2, 3, and 6 (More than two divisors -> Not Prime / Composite).",
      correction: "A prime number is divisible only by 1 and itself.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (at 1 and 5), so 5 is a Prime number.",
      matchedFirebaseInput: "I don't know"
    };
  }
  if (norm.includes("1 is a prime") || norm.includes("1 is prime") || norm.includes("one is prime") || norm.includes("1 prime number")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Important math rule: 1 is neither prime nor composite because a prime number must have exactly two different divisors. The number 1 has only one divisor (itself).\n\nPlease test with a prime number greater than 1, like 2, 3, 5, or 7!",
      correction: "1 is not prime. Prime numbers are greater than 1 with exactly two distinct divisors.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (1 and 5) -> Prime",
      matchedFirebaseInput: "1 is a prime number"
    };
  }
  if (norm.includes("all odd") || norm.includes("odd numbers are prime") || norm.includes("odd is prime") || norm.includes("if number is odd it is prime")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Not all odd numbers are prime! For example, 9, 15, 21, 25, 27 are odd, but they can be divided by 3 or 5, so they are composite (not prime).\n\nTo prove prime, test if any number between 2 and N-1 divides it with remainder 0!",
      correction: "Not all odd numbers are prime (e.g. 9 and 15 have divisors 3 and 5).",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 occurs 2 times (1 and 5) -> Prime",
      matchedFirebaseInput: "all odd numbers are prime numbers"
    };
  }
  if (norm.includes("2 is even so") || norm.includes("2 is not prime") || norm.includes("even cannot be prime")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! 2 is the only even prime number! Its only divisors are 1 and 2 (exactly two divisors).",
      correction: "2 is an even prime number because its only divisors are 1 and 2.",
      suggestedInput: "n=2\n2%1=0\n2%2=0\nDivisors: 1 and 2 -> Prime",
      matchedFirebaseInput: "2 is an even number so it cannot be prime"
    };
  }
  if (norm.includes("0 or negative") || norm.includes("negative numbers") || norm.includes("what about 0") || norm.includes("is 0 prime")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Prime numbers are strictly positive integers greater than 1 (2, 3, 5, 7, 11...). 0 and negative numbers are not prime.",
      correction: "Prime numbers must be positive integers greater than 1.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 occurs 2 times -> Prime",
      matchedFirebaseInput: "what about 0 or negative numbers"
    };
  }
  if (norm.includes("divide by 2") || norm.includes("divide with 2") || norm.includes("check if divisible by 2")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Dividing by 2 only checks if a number is even or odd. A number like 9 or 25 is not divisible by 2, but it is divisible by 3 or 5. We must test other numbers too!",
      correction: "Test numbers from 2 up to N-1 (or count divisors from 1 to N), not just 2.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 comes 2 times -> Prime",
      matchedFirebaseInput: "just divide by 2 to check if prime"
    };
  }
  if (norm.includes("what range") || norm.includes("which range") || norm.includes("numbers should we test") || norm.includes("which numbers to test")) {
    return {
      isFullyVerified: false,
      feedback: "\u{1F31F} Coach Maara here! Since 1 and the number itself always divide the number, we only need to test if any number between 2 and the number before it (N - 1) can divide it with remainder 0.\n\nAlternatively, test all numbers from 1 to N and check if the total count of divisors with remainder 0 is exactly 2!",
      correction: "Test numbers from 2 to N-1 (or 1 to N).",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 occurs 2 times (1 and 5) -> Prime",
      matchedFirebaseInput: "what range of numbers should we test"
    };
  }
  if (analysis.arithmeticErrors.length > 0) {
    const errorsJoined = analysis.arithmeticErrors.join("\n\u2022 ");
    let arithFb = `\u{1F31F} Coach Maara arithmetic check! Look closely at your remainder calculations:
\u2022 ${errorsJoined}

Please check your division remainders with the % operator so all equations are accurate!`;
    if (attemptCount >= 2) {
      arithFb = `\u{1F31F} Coach Maara checking back! Remember that \`a % b\` calculates the integer remainder left after division:
\u2022 ${errorsJoined}

\u{1F4A1} Tip: For instance, \`5 % 2 = 1\` because 2 fits into 5 two times with 1 left over. Let's adjust those remainder lines!`;
    }
    return {
      isFullyVerified: false,
      feedback: arithFb,
      correction: "Recalculate the remainders using the modulo % operator accurately.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 occurs 2 times (1 and 5) -> Prime",
      matchedFirebaseInput: "recalculate remainders"
    };
  }
  if (analysis.hasWrongOperator && !analysis.hasModuloOperator && !analysis.hasSlashAsRemainder) {
    const isMultiplication = /[*×]/.test(text);
    let opFb = `\u{1F31F} Coach Maara here! I noticed you're testing operations with \`${isMultiplication ? "*" : "/"}\`.

For prime number testing, instead of calculating multiplication products or division quotients, we need to check how many times the division leaves **zero remainder**.

Use the **modulo operator (%)** (e.g., \`5 % 1 = 0\`, \`5 % 2 = 1\`, etc.) to count how many numbers divide your input evenly!`;
    if (attemptCount >= 2) {
      opFb = `\u{1F31F} Coach Maara checking in! To prove if a number \`n\` is Prime, we check if \`n % i == 0\` for all numbers from 1 to \`n\`.

\u2022 **Modulo (%)** gives the remainder: \`5 % 2 = 1\`.
\u2022 When remainder is \`0\`, that number is an exact divisor!

\u{1F449} Replace your multiplication lines with modulo remainder equations from \`1\` to \`5\`!`;
    }
    return {
      isFullyVerified: false,
      feedback: opFb,
      correction: "Use the modulo operator % instead of * or / to test remainders.",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder 0 comes 2 times (1 and 5) -> Prime",
      matchedFirebaseInput: "use modulo operator %"
    };
  }
  if (analysis.testedNumber !== null && analysis.testedNumber > 1 && !analysis.isPrime) {
    const num = analysis.testedNumber;
    const allActualDivisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) allActualDivisors.push(i);
    }
    const divList = allActualDivisors.join(", ");
    return {
      isFullyVerified: false,
      feedback: `\u{1F31F} Coach Maara observation: You did a great job testing n=${num}! You observed that ${num} has ${allActualDivisors.length} divisors (${divList}) where the remainder is 0. This correctly proves that ${num} is a **Composite Number (Not Prime)**!

However, to complete and prove the Prime Number logic, we need to test an **actual Prime number** (such as **5**, **7**, or **3**). Please pick a prime number like 5, calculate its remainders from 1 to 5 using the % operator, and show that it produces remainder 0 exactly 2 times (1 and itself)!`,
      correction: `Now test an actual prime number (e.g. n = 5 or n = 7) with % from 1 to n to prove it has exactly 2 divisors with remainder 0.`,
      suggestedInput: `n=5
5%1=0
5%2=1
5%3=2
5%4=1
5%5=0
Remainder is 0 exactly 2 times (1 and 5), so 5 is a Prime number.`,
      matchedFirebaseInput: "tested composite number"
    };
  }
  if (analysis.testedNumber !== null && analysis.testedNumber <= 1) {
    return {
      isFullyVerified: false,
      feedback: `\u{1F31F} Coach Maara note: The number ${analysis.testedNumber} is not a prime number! Prime numbers must be whole numbers greater than 1 with exactly two distinct divisors (1 and itself). 1 only has 1 divisor (1).

Please test with a prime number like 2, 3, 5, or 7 to demonstrate the 2-divisor rule!`,
      correction: "Test with an actual prime number greater than 1 (such as 5, 7, or 3).",
      suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (1 and 5), so 5 is a Prime number.",
      matchedFirebaseInput: "1 is a prime number"
    };
  }
  if (analysis.testedNumber !== null && analysis.isPrime && analysis.totalEquationsCount >= 2) {
    if (analysis.zeroRemainderCount === 2 || analysis.mentionsTwoDivisorsRule) {
      return {
        isFullyVerified: true,
        feedback: `\u{1F389} Logic Approved! Outstanding work! You have clearly demonstrated that for prime number n=${analysis.testedNumber}, when divided by numbers from 1 to ${analysis.testedNumber} using modulo (%), exactly 2 numbers (1 and ${analysis.testedNumber}) give remainder 0. You have mastered the prime number logic and are ready to sequence this in the Recipe stage!`,
        correction: "Proceed to the Recipe stage to sequence the algorithmic steps.",
        suggestedInput: void 0,
        matchedFirebaseInput: "if any number between 2 and N-1 divides the number with remainder 0 it is not prime otherwise it is prime"
      };
    }
  }
  if (analysis.mentionsTwoDivisorsRule) {
    const mentionsFullTheory = (norm.includes("only by 1 and itself") || norm.includes("only 1 and itself") || norm.includes("divisible by 1 and itself") || norm.includes("2 divisors") || norm.includes("two divisors") || norm.includes("two factors")) && (norm.includes("greater than 1") || norm.includes("positive") || norm.includes("not prime") || norm.includes("composite") || norm.includes("between 2 and") || norm.includes("remainder") || norm.includes("no other") || norm.includes("only two"));
    if (mentionsFullTheory || norm.includes("if any number between 2 and n-1") || norm.includes("if any number between 2 and n - 1")) {
      return {
        isFullyVerified: true,
        feedback: "\u{1F31F} Coach Maara here! Outstanding logic! \u{1F389} You have correctly and fully explained the mathematical theory of prime numbers: a prime number is an integer greater than 1 that is divisible only by 1 and itself (having exactly 2 positive divisors). You have mastered the logic and are ready to sequence this in the Recipe stage!",
        correction: "Proceed to the Recipe stage to sequence the algorithmic steps.",
        suggestedInput: void 0,
        matchedFirebaseInput: "if any number between 2 and N-1 divides the number with remainder 0 it is not prime otherwise it is prime"
      };
    }
    if (analysis.totalEquationsCount === 0) {
      return {
        isFullyVerified: false,
        feedback: "\u{1F31F} Coach Maara here! You've correctly noted that a prime number is divisible only by 1 and itself (having remainder 0 exactly 2 times). Either explain how we test numbers from 2 to N-1 for divisors or write down a quick example like n = 5 (5%1=0, 5%2=1, 5%3=2, 5%4=1, 5%5=0)!",
        correction: "Explain testing divisors between 2 and N-1 or test n = 5 with modulo % equations.",
        suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (at 1 and 5), so 5 is a Prime number.",
        matchedFirebaseInput: "if any number between 2 and N-1 divides the number with remainder 0 it is not prime otherwise it is prime"
      };
    }
  }
  return {
    isFullyVerified: false,
    feedback: "\u{1F31F} Coach Maara here! To analyze prime numbers, pick a prime number (like n = 5) and test its remainders when divided by 1, 2, 3, 4, and 5 using `%`. Count how many times the remainder is 0!",
    correction: "Test n = 5 with modulo % from 1 to 5 and check how many times remainder is 0.",
    suggestedInput: "n=5\n5%1=0\n5%2=1\n5%3=2\n5%4=1\n5%5=0\nRemainder is 0 exactly 2 times (at 1 and 5), so 5 is a Prime number.",
    matchedFirebaseInput: "what should we do to check if a number is prime"
  };
}
function validatePrimeRecipe(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const lines = norm.split("\n").map((l) => l.trim()).filter(Boolean);
  if (/^(what\s+should|what\s+do|how\s+to\s+start|where\s+to\s+start|i\s+don't\s+know|puriyala|theriyala)/i.test(norm)) {
    return {
      isFullyVerified: false,
      recipeStepProgress: [
        { stepNumber: 1, title: "Get input number N from the user", completed: false, current: true },
        { stepNumber: 2, title: "Edge case check (if N <= 1, not prime) or initialize divisor count as 0", completed: false, current: false },
        { stepNumber: 3, title: "Test numbers from 2 to N-1 (or 1 to N)", completed: false, current: false },
        { stepNumber: 4, title: "Check if dividing leaves remainder 0", completed: false, current: false },
        { stepNumber: 5, title: "Conclude Prime or Not Prime based on results", completed: false, current: false }
      ],
      feedback: "🌟 Coach Maara here! Based on our mathematical logic, write down the sequential steps one by one in plain English without code keywords.\n\nExample:\nStep 1: Get the input number N\nStep 2: Check if N is less than or equal to 1...",
      correction: "Start with Step 1: Get the input number N from the user.",
      suggestedInput: "Step 1: Get the input number N",
      matchedFirebaseInput: "what should i do here"
    };
  }
  const hasStep1 = lines.some(
    (l) => (l.includes("get") || l.includes("read") || l.includes("take") || l.includes("accept") || l.includes("input") || l.includes("enter") || l.includes("number")) && (l.includes("number") || l.includes("input") || l.includes("value") || l.includes("n") || l.includes("num"))
  );
  const hasStep2Edge = lines.some(
    (l) => (l.includes("1") || l.includes("<= 1") || l.includes("less than") || l.includes("smaller than")) && (l.includes("not prime") || l.includes("composite") || l.includes("stop"))
  );
  const hasStep2Count = lines.some(
    (l) => (l.includes("count") || l.includes("counter") || l.includes("divisor") || l.includes("factor")) && (l.includes("0") || l.includes("zero") || l.includes("start with") || l.includes("initial") || l.includes("set") || l.includes("as 0") || l.includes("= 0")) && !l.includes("increase") && !l.includes("increment") && !l.includes("add 1")
  );
  const hasStep2 = hasStep2Edge || hasStep2Count;
  const hasStep3Range2ToN = lines.some(
    (l) => (l.includes("2") || l.includes("two")) && (l.includes("n - 1") || l.includes("n-1") || l.includes("before n") || l.includes("up to n") || l.includes("to n-1"))
  );
  const hasStep3Range1ToN = lines.some(
    (l) => (l.includes("repeat") || l.includes("each number") || l.includes("every number") || l.includes("from 1") || l.includes("1 to n") || l.includes("1 up to n") || l.includes("for each") || l.includes("all numbers") || l.includes("consecutive")) && !l.includes("print") && !l.includes("display")
  );
  const hasStep3 = hasStep3Range2ToN || hasStep3Range1ToN;
  const hasStep4Divisibility = lines.some(
    (l) => (l.includes("remainder is 0") || l.includes("remainder 0") || l.includes("divisible") || l.includes("divides") || l.includes("%")) && (l.includes("divide") || l.includes("leaves") || l.includes("check") || l.includes("if"))
  );
  const hasStep4CountIncrement = lines.some(
    (l) => (l.includes("increase") || l.includes("increment") || l.includes("add 1") || l.includes("add one")) && (l.includes("count") || l.includes("counter") || l.includes("divisor") || l.includes("0") || l.includes("remainder"))
  );
  const hasStep4 = hasStep4Divisibility || hasStep4CountIncrement;
  const hasFalsePrimeCountCondition = lines.some(
    (l) => (l.includes("more than two") || l.includes("more than 2") || l.includes("greater than 2") || l.includes("> 2") || l.includes("above 2") || l.includes("more than twice")) && (l.includes("it is a prime") || l.includes("it is prime") || l.includes("is prime") || l.includes("is a prime")) && !l.includes("not prime") && !l.includes("not a prime") && !l.includes("composite")
  );
  const hasDivisibleMeansPrimeBug = lines.some(
    (l) => (l.includes("remainder is 0") || l.includes("remainder 0") || l.includes("divisible")) && (l.includes("decide it is prime") || l.includes("mark as prime") || l.includes("then it is prime")) && !l.includes("not prime") && !l.includes("count == 2") && !l.includes("count is 2") && !l.includes("two times")
  );
  const hasEarlyPrimeConclusion = lines.some(
    (l) => (l.includes("remainder is not 0") || l.includes("remainder != 0") || l.includes("not divisible") || l.includes("not 0")) && (l.includes("immediately") || l.includes("directly") || l.includes("then prime") || l.includes("decide it is prime")) && !l.includes("after") && !l.includes("all") && !l.includes("finished")
  );
  const hasValidStep5 = !hasFalsePrimeCountCondition && !hasDivisibleMeansPrimeBug && !hasEarlyPrimeConclusion && lines.some(
    (l) => (l.includes("prime") || l.includes("not prime")) && (l.includes("exactly 2") || l.includes("exactly two") || l.includes("count is 2") || l.includes("count == 2") || l.includes("two times") || l.includes("2 times") || l.includes("only two") || l.includes("only 2") || l.includes("no number") || l.includes("cannot divide") || l.includes("no divisor") || l.includes("count == 0") || l.includes("not divide") || l.includes("if count > 2 not prime") || l.includes("if count > 2") || l.includes("decide") || l.includes("print") || l.includes("display") || l.includes("output"))
  );
  const recipeStepProgress = [
    {
      stepNumber: 1,
      title: "Get input number N from user",
      completed: hasStep1,
      current: !hasStep1
    },
    {
      stepNumber: 2,
      title: "Handle edge cases (if N <= 1, not prime) or initialize count as 0",
      completed: hasStep2,
      current: hasStep1 && !hasStep2
    },
    {
      stepNumber: 3,
      title: "Test numbers from 2 up to N-1 (or 1 to N)",
      completed: hasStep3,
      current: hasStep1 && hasStep2 && !hasStep3
    },
    {
      stepNumber: 4,
      title: "Check if dividing leaves remainder 0",
      completed: hasStep4,
      current: hasStep1 && hasStep2 && hasStep3 && !hasStep4
    },
    {
      stepNumber: 5,
      title: "Conclude Prime if divisor count is EXACTLY 2 (or 0)",
      completed: hasValidStep5,
      current: hasStep1 && hasStep2 && hasStep3 && hasStep4 && !hasValidStep5
    }
  ];
  if (hasFalsePrimeCountCondition) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Look closely at Step 4! If the zero remainder count is **more than two times** (e.g. 4 times for number 6), the number has extra divisors and is a **Composite Number (Not Prime)**!\n\nA number is a **Prime Number** only when the remainder is 0 **EXACTLY two times** (1 and itself). Change your condition to: 'If the zero's count is exactly 2 times, it is a prime number'.",
      correction: "Change Step 4: 'If the zero's count is exactly two times, it is a prime number (if more than two, it is not prime)'.",
      suggestedInput: "Step 4: If the zero's count is exactly two times it is a prime number",
      matchedFirebaseInput: "if zero count is more than two times it is prime"
    };
  }
  if (hasDivisibleMeansPrimeBug) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Careful in your recipe! When testing numbers from 2 to N-1, if dividing leaves remainder 0, it means the number has extra factors, so it is **Not Prime (Composite)**! We conclude Prime only when NO numbers between 2 and N-1 leave remainder 0.",
      correction: "If remainder is 0, mark as not prime. If no number divides it with remainder 0, decide it is prime.",
      suggestedInput: "Step 3.2: If remainder is 0, mark as not prime and stop testing",
      matchedFirebaseInput: "step 3.2 : If remainder is 0, mark as not prime and stop testing"
    };
  }
  if (hasEarlyPrimeConclusion) {
    return {
      isFullyVerified: false,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Careful! Just because one test number (like 2) doesn't divide 9 doesn't mean 9 is prime (3 will divide 9 later). You can only conclude Not Prime early, but Prime only AFTER testing ALL numbers!",
      correction: "Conclude Prime only after testing all numbers from 2 to N-1 (or after counting all divisors up to N).",
      suggestedInput: "Step 4: If no number between 2 and N-1 could divide it, decide it is prime",
      matchedFirebaseInput: "step 3.2 : If remainder is not 0, immediately decide it is prime"
    };
  }
  const completedCount = [hasStep1, hasStep2, hasStep3, hasStep4, hasValidStep5].filter(Boolean).length;
  const isFullyVerified = completedCount >= 4 && hasValidStep5;
  if (isFullyVerified) {
    return {
      isFullyVerified: true,
      recipeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Superb work! \u{1F389} You have sequenced all the steps of the Prime Number algorithm in plain English. You're ready to proceed to the Ingredients stage to identify variables and programming constructs!",
      correction: "Proceed to Ingredients to identify variables, loops, and conditions.",
      suggestedInput: void 0,
      matchedFirebaseInput: "step 4 : If no number between 2 and N-1 could divide it, decide it is prime"
    };
  }
  let matchedInput = "what should i do here";
  let nextTip = "Step 1: Get the input number N from the user";
  let nextSuggested = "Step 1: Get the input number N";
  let fbText = "";
  if (!hasStep1) {
    matchedInput = "what should i do here";
    nextTip = "Step 1: Get the input number N";
    nextSuggested = "Step 1: Get the input number N";
    fbText = "\u{1F31F} Coach Maara recipe guidance: Let's begin our recipe with Step 1: Get the input number N from the user.";
  } else if (!hasStep2) {
    matchedInput = "step 1 : Get the input number N";
    nextTip = "Step 2: If N is less than or equal to 1, decide it is not prime (or initialize divisor count as 0)";
    nextSuggested = "Step 2: If N is less than or equal to 1, decide it is not prime";
    fbText = "\u{1F31F} Coach Maara recipe guidance: Great start with Step 1! What is the first check we should do for numbers less than or equal to 1, or what counter variable should we set up?";
  } else if (!hasStep3) {
    matchedInput = "step 2 : If N is less than or equal to 1, decide it is not prime";
    nextTip = "Step 3: For every number from 2 up to N - 1 (or 1 to N)";
    nextSuggested = "Step 3: For every number from 2 up to N - 1";
    fbText = "\u{1F31F} Coach Maara recipe guidance: Spot on! Now, for numbers starting from 2, what sequence of testing numbers do we take up to N - 1?";
  } else if (!hasStep4) {
    matchedInput = "step 3 : For every number from 2 up to N - 1";
    nextTip = "Step 3.1: Check if dividing N by current number leaves remainder 0";
    nextSuggested = "Step 3.1: Check if dividing N by the current number leaves a remainder of 0";
    fbText = "\u{1F31F} Coach Maara recipe guidance: Nice! For each number in this sequence, what condition must we check using division remainders?";
  } else if (!hasValidStep5) {
    matchedInput = "step 3.1 : Check if dividing N by the current number leaves a remainder of 0";
    nextTip = "Step 4: If no number between 2 and N-1 could divide it, decide it is prime (or if count == 2 display Prime)";
    nextSuggested = "Step 4: If no number between 2 and N-1 could divide it, decide it is prime";
    fbText = "\u{1F31F} Coach Maara recipe guidance: Awesome! What final decision concludes whether N is Prime or Not Prime?";
  }
  return {
    isFullyVerified: false,
    recipeStepProgress,
    feedback: fbText || `\u{1F31F} Coach Maara recipe guidance: You are crafting the algorithm recipe! Next, add the missing step:
\u{1F449} ${nextTip}`,
    correction: nextTip,
    suggestedInput: nextSuggested,
    matchedFirebaseInput: matchedInput
  };
}
function validatePrimeIngredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const lines = norm.split("\n").map((l) => l.trim()).filter(Boolean);
  if (/^(what\s+do\s+i\s+do|what\s+should|how\s+to\s+start|i\s+don't\s+know|puriyala|theriyala)/i.test(norm)) {
    return {
      isFullyVerified: false,
      ingredientsStepProgress: [
        { stepNumber: 1, title: "Input variable (n)", completed: false, current: true },
        { stepNumber: 2, title: "Divisor tracking variable (count = 0 or isPrime = true)", completed: false, current: false },
        { stepNumber: 3, title: "For loop construct (start, stop, step)", completed: false, current: false },
        { stepNumber: 4, title: "Divisibility check condition (n % i == 0)", completed: false, current: false },
        { stepNumber: 5, title: "Decision print condition (Prime / Not Prime)", completed: false, current: false }
      ],
      feedback: "\u{1F31F} Coach Maara here! Identify the variables, conditions, flags/counters, and print statements needed.\n\nFor Step 1, what variable is needed to store the input number?",
      correction: "Step 1: Variable n for input number.",
      suggestedInput: "Step 1: use n variable\nStep 1.1: use variable count = 0 (or isPrime = true)\nStep 2: use for loop\n  start (1),\n  end (n), and\n  next step (+1)\nStep 3: use if condition\n  left side (n % i)\n  operator (==)\n  right side (0)\nStep 4: count = count + 1\nStep 5: if count == 2 display Prime else Not Prime",
      matchedFirebaseInput: "what do I do here"
    };
  }
  const hasInput = /\b(?:var|let|const)?\s*(?:n|num|number|a)\s*=\s*\d+/i.test(norm) || /\b(?:variable|var)\s*\(?\s*(?:n|num|number|a)\s*(?:=\s*\d+)?\)?/i.test(norm) || /\b(?:use|have|declare|need|take|get|one)?\s*(?:an?\s+)?(?:input|n|number|num)\s+(?:variable|var)\b/i.test(norm) || /\b(?:use|get|read)\s+(?:n|num|number)\b/i.test(norm) || /\binput\s+(?:n|number|value|variable)\b/i.test(norm) || /n\s*=\s*\d+/i.test(norm) || /step\s*1\s*:\s*.*(?:n|number)/i.test(norm);
  const hasCount = /\b(?:var|let|const)?\s*(?:count|c|factors?|divcount)\s*=\s*0/i.test(norm) || /\b(?:count|counter|divisor\s*count|factor\s*count)\s*(?:variable|var)?\s*(?:as\s*0|= 0|initialized to 0|to count)?\b/i.test(norm) || /\b(?:variable|var)\s*(?:for\s+)?(?:counting|tracking|count)\b/i.test(norm) || /\b(?:counting|track|count)\s*(?:the\s+)?(?:remainder|divisors?|zero|factors?)/i.test(norm) || /\b(?:use|have|declare|need|set|initialize)?\s*(?:a|another)?\s*(?:count|counter|divisor)\s+(?:variable|var)\b/i.test(norm) || /\b(?:count|counter)\s*(?:=|is|as)\s*0\b/i.test(norm) || /\b(?:isprime|primeflag|flag)\s*(?:=|is|as)\s*true\b/i.test(norm) || /\b(?:var|let|const)?\s*isprime\s*=\s*true/i.test(norm);
  const hasLoopStartZeroBug = lines.some((l) => /\b(?:start|i)\s*[:=]\s*0\b/i.test(l) || /from\s+i\s*=\s*0/i.test(l));
  const hasLoopStartBug = lines.some((l) => /\bstart\s*:\s*(?:[3-9]|\d{2,}|n)\b/i.test(l) && !l.includes("1") && !l.includes("2"));
  const hasLoopDecrementBug = lines.some((l) => /\b(?:next\s*step|step)\s*:\s*(?:--|-1|-|\bi--)\b/i.test(l) || /i\s*--/i.test(l));
  const hasLoopStopInclusiveWith2Bug = lines.some((l) => (l.includes("start: 2") || l.includes("i = 2")) && (l.includes("stop: n") || l.includes("i <= n")));
  const hasWhileForDivisorCheckBug = lines.some(
    (l) => /\bwhile\b/i.test(l) && (l.includes("check") || l.includes("divisor") || l.includes("divide") || l.includes("remainder") || l.includes("zero"))
  );
  const hasSingleLineLoop = !hasLoopStartBug && !hasLoopDecrementBug && lines.some(
    (l) => /for\s*\(\s*(?:var|let|const)?\s*\w+\s*=\s*(?:1|2)\s*;\s*\w+\s*(?:<=|<)\s*(?:n|num|a|b|number|\d+)\s*;\s*(?:\w+\+\+|\w+\s*=\s*\w+\s*\+\s*1)\s*\)/i.test(l) || /for\s*\(/i.test(l) && (l.includes("1") || l.includes("2")) && (l.includes("n") || l.includes("num") || l.includes("a") || l.includes("input") || l.includes("<=")) || /range\(\s*(?:1|2)\s*,\s*(?:n|num|a|input|\d+)/i.test(l) || /\bfor\s+loop\b/i.test(l) && (l.includes("1") || l.includes("2") || l.includes("start")) && (l.includes("n") || l.includes("a") || l.includes("end") || l.includes("stop") || l.includes("to")) || /\bloop\s*(?:from\s*(?:1|2)|(?:1|2)\s*to\s*(?:n|a|input)|to\s*(?:n|a|input)|(?:1|2)\s*up\s*to\s*(?:n|a|input))\b/i.test(l) || /\b(?:iterate|repeat)\s+(?:from\s*(?:1|2)|(?:1|2)\s*to\s*(?:n|a|input)|to\s*(?:n|a|input)|(?:1|2)\s*up\s*to\s*(?:n|a|input))\b/i.test(l)
  );
  const hasStartBound = !hasLoopStartBug && lines.some((l) => /\bstart\b/i.test(l) && (l.includes("1") || l.includes("2") || l.includes("one") || l.includes("two")));
  const hasEndBound = lines.some((l) => /\b(?:end|stop|to|until)\b/i.test(l) && (l.includes("n") || l.includes("num") || l.includes("number") || l.includes("n-1") || l.includes("a") || l.includes("b") || l.includes("input") || /\d+/.test(l)));
  const hasStepBound = !hasLoopDecrementBug && lines.some((l) => /\b(?:step|next|advance|increment)\b/i.test(l) && (l.includes("1") || l.includes("+1") || l.includes("++") || l.includes("one")) || /\bi\+\+/i.test(l));
  const hasMultiLineLoop = hasStartBound && hasEndBound && hasStepBound;
  const hasLoop = hasSingleLineLoop || hasMultiLineLoop;
  const hasConditionLeft = (norm.includes("left side") || norm.includes("left") || norm.includes("l.s")) && (norm.includes("%") || norm.includes("mod") || norm.includes("modulo") || norm.includes("remainder"));
  const hasConditionOp = (norm.includes("operator") || norm.includes("op")) && (norm.includes("==") || norm.includes("===") || norm.includes("=") || norm.includes("equals") || norm.includes("is"));
  const hasConditionRight = (norm.includes("right side") || norm.includes("right") || norm.includes("r.s")) && (norm.includes("0") || norm.includes("zero"));
  const hasMissingConditionOperatorBug = hasConditionLeft && hasConditionRight && !hasConditionOp && !lines.some((l) => l.includes("== 0") || l.includes("=== 0") || l.includes("= 0"));
  const hasSingleLineCondition = lines.some(
    (l) => /if\s*\(?\s*(?:n|num|a|b|number)\s*%\s*(?:i|divisor|j)\s*(?:===|==|=)\s*0\s*\)?/i.test(l) || /if\s*\(?[^)]*%.*(?:===|==|=)\s*0\)?/i.test(l) || l.includes("%") && (l.includes("== 0") || l.includes("= 0") || l.includes("=== 0") || l.includes("is 0") || l.includes("equals 0") || l.includes("==0")) || /\b(?:remainder|modulo|mod)\s*(?:is|==|=|===)\s*0\b/i.test(l) || /\b(?:check\s+if\s+)?(?:(?:n|a)\s+is\s+divisible|divisible\s+by\s+i)\b/i.test(l)
  );
  const hasDecomposedCondition = hasConditionLeft && hasConditionOp && hasConditionRight;
  const hasCondition = !hasMissingConditionOperatorBug && (hasSingleLineCondition || hasDecomposedCondition);
  const hasIncrement = lines.some(
    (l) => /\b(?:count|c)\s*(?:\+\+|=\s*(?:count|c)\s*\+\s*1|=\s*(?:count|c)\+\+)/i.test(l) || /\b(?:increment|increase|add\s*1\s*to)\s+(?:count|counter|divisor)/i.test(l) || /\bcount\s*\+\+/i.test(l) || /\bcount\s*=\s*count\s*\+\s*1/i.test(l) || /\bisprime\s*=\s*false/i.test(l)
  );
  const hasPrint = lines.some(
    (l) => /\b(?:print|console\.log|system\.out\.println)\b/i.test(l) || /\b(?:decision\s+print|print\s+prime|display\s+prime|show\s+prime)\b/i.test(l) || l.includes("print") && (l.includes("prime") || l.includes("not prime"))
  );
  const ingredientsStepProgress = [
    {
      stepNumber: 1,
      title: "Input variable (use n variable)",
      completed: hasInput,
      current: !hasInput
    },
    {
      stepNumber: 2,
      title: "Tracking variable (use variable count = 0 or isPrime = true)",
      completed: hasCount,
      current: hasInput && !hasCount
    },
    {
      stepNumber: 3,
      title: "For loop (start: 1, end: n, next step: +1)",
      completed: hasLoop,
      current: hasInput && hasCount && !hasLoop
    },
    {
      stepNumber: 4,
      title: "Divisibility condition (left: n % i, right: 0)",
      completed: hasCondition,
      current: hasInput && hasCount && hasLoop && !hasCondition
    },
    {
      stepNumber: 5,
      title: "Update count or flag (count = count + 1 or isPrime = false)",
      completed: hasIncrement,
      current: hasInput && hasCount && hasLoop && hasCondition && !hasIncrement
    },
    {
      stepNumber: 6,
      title: "Decision print condition (if count == 2 display Prime else Not Prime)",
      completed: hasPrint,
      current: hasInput && hasCount && hasLoop && hasCondition && hasIncrement && !hasPrint
    }
  ];
  const allVerified = hasInput && hasCount && hasLoop && hasCondition && (hasIncrement || hasPrint);
  if (allVerified && hasPrint) {
    return {
      isFullyVerified: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Brilliant! \u{1F389} You have identified all essential programming ingredients: input variable n, tracking variable, loop bounds, modulo condition (n % i == 0), count increment / flag update, and prime decision print. You are ready for Taste the Sample!",
      correction: "Proceed to Taste the Sample stage to assemble your code!",
      suggestedInput: void 0,
      matchedFirebaseInput: 'step 4 : if (count == 0) print("Prime") else print("Not Prime")'
    };
  }
  if (hasLoopStartZeroBug) {
    return {
      isFullyVerified: false,
      hasLoopStartZeroBug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! If i = 0, it causes division by zero (n % 0). If testing from 2 to n-1, start at i = 2. If counting all divisors, start at i = 1.",
      correction: "Ingredient 3: For loop start value is 1 (or 2).",
      suggestedInput: "use for loop\n  start (1),\n  end (n), and\n  next step (+1)",
      matchedFirebaseInput: "step 3 : For loop starting from i = 0"
    };
  }
  if (hasLoopStartBug) {
    return {
      isFullyVerified: false,
      hasLoopStartBug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Look at your loop `Start: 5`! To test divisors, the loop must start from **1** (to count all divisors up to n) or from **2** (to test if any number before n divides it). Starting at 5 tests only the number itself!",
      correction: "Ingredient 3: For loop Start should be 1 (or 2): 'start: 1, end: n, next step: +1'.",
      suggestedInput: "step 2: For loop\nstart: 1\nend: n\nnext step: +1",
      matchedFirebaseInput: "step 3 : For loop with Start: 1 (i), Stop: n, Step: +1"
    };
  }
  if (hasLoopDecrementBug) {
    return {
      isFullyVerified: false,
      hasLoopDecrementBug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Look at your loop `next step: --`! Since the loop starts at 1 and counts upwards towards n, you must increment the counter with **+1** (or `i++`), not decrement with `--`!",
      correction: "Ingredient 3: For loop next step should be +1 (or i++).",
      suggestedInput: "step 2: For loop\nstart: 1\nend: n\nnext step: +1",
      matchedFirebaseInput: "step 3 : For loop with Start: 1 (i), Stop: n, Step: +1"
    };
  }
  if (hasLoopStopInclusiveWith2Bug) {
    return {
      isFullyVerified: false,
      hasLoopStopInclusiveWith2Bug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara here! If you start at 2 and write Stop: n (i <= n), the loop tests n % n == 0, which is always true for itself! Use i < n (or Stop: n-1).",
      correction: "Ingredient 3: When starting from 2, use Stop: n - 1 (or i < n).",
      suggestedInput: "use for loop\n  start (2),\n  end (n - 1), and\n  next step (+1)",
      matchedFirebaseInput: "step 3 : For loop with Stop condition i <= n"
    };
  }
  if (hasWhileForDivisorCheckBug) {
    return {
      isFullyVerified: false,
      hasWhileForDivisorCheckBug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Great job setting up the For loop in Step 2 to iterate through numbers 1 to n! For Step 3, to test whether each number divides evenly with remainder 0, you don't need another loop like `while`. Instead, we use a **Conditional statement (`if` condition)** with the modulo operator (`%`)!\n\nIngredient 4: Define an If condition with Left Side (n % i), Operator (==), and Right Side (0).",
      correction: "Ingredient 4: If condition with left side (n % i), operator (==), and right side (0).",
      suggestedInput: "step 3: If condition\nleft side: n % i\noperator: ==\nright side: 0\nstep 4: count = count + 1",
      matchedFirebaseInput: "step 3.1 : if (n % i == 0) count++ (or isPrime = false)"
    };
  }
  if (hasMissingConditionOperatorBug) {
    return {
      isFullyVerified: false,
      hasMissingConditionOperatorBug: true,
      ingredientsStepProgress,
      feedback: "\u{1F31F} Coach Maara note: Look closely at Step 3! You specified `Left side: a % i` and `right side: 0`, but you missed the comparison operator (`operator: ==`). A conditional statement needs the equality operator `==` to check if the remainder equals zero!\n\nIngredient 4: Add `operator: ==` between left side (`a % i`) and right side (`0`).",
      correction: "Ingredient 4: If condition with left side (a % i), operator (==), and right side (0).",
      suggestedInput: "Step 3: If\nLeft side: a % i\noperator: ==\nright side: 0",
      matchedFirebaseInput: "step 3.1 : if (n % i == 0) count++ (or isPrime = false)"
    };
  }
  let missingFeedback = "";
  let missingCorrection = "";
  let missingSuggestedInput = "";
  let matchedInput = "what do I do here";
  if (!hasInput) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: Let's start with Ingredient 1: What variable is needed to store the input number? (e.g. `use n variable`)";
    missingCorrection = "Ingredient 1: Input variable (e.g. use n variable)";
    missingSuggestedInput = "use n variable";
    matchedInput = "what do I do here";
  } else if (!hasCount) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: Spot on! Now for Ingredient 2, what variable or flag can we use to track whether the number is prime (e.g. `use variable count = 0` or `isPrime = true`)?";
    missingCorrection = "Ingredient 2: Divisor counter variable initialized to 0 (e.g. use variable count = 0)";
    missingSuggestedInput = "use variable count = 0";
    matchedInput = "step 1 : n for input number";
  } else if (!hasLoop) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: You have the variables! Now for Ingredient 3, what loop construct is needed to test divisors from 1 up to n (or 2 to n-1)? Define Start, Stop, and Step:\n\u2022 **Start:** 1\n\u2022 **Stop:** n\n\u2022 **Next step:** +1";
    missingCorrection = "Ingredient 3: For loop with start (1), end (n), and next step (+1)";
    missingSuggestedInput = "use for loop\n  start (1),\n  end (n), and\n  next step (+1)";
    matchedInput = "step 3 : For loop with Start: 2 (i), Stop: n - 1 (i < n), Step: +1 (i++)";
  } else if (!hasCondition) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: Nice loop! Next for Ingredient 4, what condition checks if n is divisible by loop counter i using the modulo operator? Specify left side (n % i), operator (==), and right side (0).";
    missingCorrection = "Ingredient 4: If condition with left side (n % i), operator (==), right side (0)";
    missingSuggestedInput = "use if condition\n  left side (n % i)\n  operator (==)\n  right side (0)";
    matchedInput = "step 3.1 : if (n % i == 0) count++ (or isPrime = false)";
  } else if (!hasIncrement) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: You have the condition! Now for Ingredient 5, how do you increase the divisor count whenever a remainder of 0 is found? (e.g. `count = count + 1` or `increment count`)";
    missingCorrection = "Ingredient 5: Increment divisor count (e.g. count = count + 1)";
    missingSuggestedInput = "count = count + 1";
    matchedInput = "step 3.1 : if (n % i == 0) count++ (or isPrime = false)";
  } else if (!hasPrint) {
    missingFeedback = "\u{1F31F} Coach Maara ingredients guidance: Almost complete! For Ingredient 6, what final decision statement outputs 'Prime' if count is 2 (or if count == 0), or 'Not Prime' otherwise?";
    missingCorrection = "Ingredient 6: Decision condition (if count == 2 display Prime else display Not Prime)";
    missingSuggestedInput = "if count == 2 display Prime else display Not Prime";
    matchedInput = 'step 4 : if (count == 0) print("Prime") else print("Not Prime")';
  }
  return {
    isFullyVerified: false,
    ingredientsStepProgress,
    feedback: missingFeedback,
    correction: missingCorrection,
    suggestedInput: missingSuggestedInput,
    matchedFirebaseInput: matchedInput
  };
}
function validatePrimeSampleCode(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const isAskingForLoopSyntax = /\b(?:loop\s+syntax|syntax\s+(?:for|of)\s+loop|how\s+to\s+(?:write|define|use)\s+(?:the\s+)?loop|loop\s+help|loop\s+structure|syntax\s+help|how\s+to\s+define\s+them)\b/i.test(norm) || norm.includes("loop") && (norm.includes("syntax") || norm.includes("not know") || norm.includes("dont know") || norm.includes("theriyala") || norm.includes("puriyala") || norm.includes("how to define") || norm.includes("please help") || norm.includes("how to write"));
  if (!isAskingForLoopSyntax && /^(do\s+i\s+need|how\s+to\s+write|where\s+to\s+start|i\s+don't\s+know|puriyala|theriyala)/i.test(norm) && !text.includes("var ") && !text.includes("for(")) {
    return {
      allVerified: false,
      sampleCodeStepProgress: [
        { stepNumber: 1, title: "Declare input & counter (var n = 5; var count = 0;)", completed: false, current: true },
        { stepNumber: 2, title: "For loop iterating from 1 to n", completed: false, current: false },
        { stepNumber: 3, title: "Divisibility check & increment (if (n % i == 0) count++;)", completed: false, current: false },
        { stepNumber: 4, title: 'Prime decision print (if (count == 2) print("Prime") else print("Not Prime"))', completed: false, current: false }
      ],
      feedback: '\u{1F31F} Coach Maara here! Yes! Draft an executable code prototype using the variables, loop, if condition, and print statements defined in Ingredients.\n\nExample structure:\n```javascript\nvar n = 7;\nvar count = 0;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    count++;\n  }\n}\nif (count == 2) {\n  print("Prime");\n} else {\n  print("Not Prime");\n}\n```',
      correction: "Start with Step 1: Declare input number variable and initialize counter to 0.",
      suggestedInput: 'var n = 5;\nvar count = 0;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    count++;\n  }\n}\nif (count == 2) {\n  print("Prime");\n} else {\n  print("Not Prime");\n}',
      matchedFirebaseInput: "Do I need to write the code here",
      hasInput: false,
      hasCount: false,
      hasLoop: false,
      hasCondition: false,
      hasIncrement: false,
      hasPrint: false,
      isAskingForLoopSyntax: false
    };
  }
  const hasInput = /\b(?:var|let|const)?\s*(?:n|num|number|a|input|val)\s*=\s*\d+/i.test(text);
  const hasCount = /\b(?:var|let|const)?\s*(?:count|c|factors?|b|divcount|k|res|ans)\s*=\s*0/i.test(text) || /\b(?:var|let|const)?\s*isprime\s*=\s*true/i.test(text);
  const hasLoop = /for\s*\(/i.test(text) || /range\(/i.test(text) || /while\b/i.test(text);
  const hasCondition = /if\s*\(?.*%.*(=|==|===)\s*0\)?/i.test(text) || norm.includes("%") && norm.includes("== 0");
  const hasIncrement = /\b(?:count|c|b)\s*(?:\+\+|=\s*(?:count|c|b)\s*\+\s*1)/i.test(text) || /\bisprime\s*=\s*false/i.test(text);
  const hasPrint = /\b(?:print|console\.log|System\.out\.println)\b/i.test(text);
  const hasLoopStart1WithFlagBug = /isprime\s*=\s*true/i.test(text) && /for\s*\(\s*(?:var|let|const)?\s*i\s*=\s*1\b/i.test(text);
  const hasLoopBoundaryWithFlagBug = /isprime\s*=\s*true/i.test(text) && /for\s*\(\s*(?:var|let|const)?\s*i\s*=\s*2\s*;\s*i\s*<=\s*n\b/i.test(text);
  const hasPrintInsideLoopBug = /for\s*\([^)]*\)\s*\{[^}]*print\s*\(\s*["'](?:Prime|Not Prime)["']\s*\)[^}]*\}/i.test(text);
  const hasAssignmentInConditionBug = /if\s*\(\s*(?:count|c|b|factors?)\s*=\s*\d+\s*\)/i.test(text) && !/if\s*\(\s*(?:count|c|b|factors?)\s*==/i.test(text);
  const hasDivisionInsteadOfModuloBug = /if\s*\(\s*(?:(?:i\s*\/\s*(?:a|n|num|number))|(?:(?:a|n|num|number)\s*\/\s*i))\s*(?:=|==|===)\s*0\s*\)/i.test(text) || /if\s*\([^)]*(?:i|a|n)\s*\/\s*(?:a|n|i)[^)]*\)/i.test(text) || /\b(?:i\/a|a\/i|n\/i|i\/n)\s*(?:=|==|===)\s*0/i.test(text);
  const hasSingleEqualInModuloBug = /if\s*\(\s*(?:(?:a|n|num|number)\s*%\s*i|i\s*%\s*(?:a|n))\s*=\s*0\s*\)/i.test(text) && !/if\s*\(.*(==|===).*\)/.test(text);
  const hasReversedModuloOperandsBug = /if\s*\(\s*i\s*%\s*(?:a|n|num|number)\s*(?:==|===|=)\s*0\s*\)/i.test(text);
  const hasDecrementBug = /\b(?:b|count|c|factors?)\s*(?:--|-=\s*1|=\s*(?:b|count|c|factors?)\s*-\s*1)/i.test(text);
  const hasLoopVariableMismatchBug = /\ba\s*=\s*\d+/i.test(text) && !/\bn\s*=\s*\d+/i.test(text) && /for\s*\([^)]*\bi\s*(?:<=|<)\s*n\b/i.test(text);
  const hasFactorCount1Bug = /if\s*\(\s*(?:b|count|c|factors?)\s*(?:==|===|=)\s*1\s*\)/i.test(text);
  const hasFactorCount0Bug = /if\s*\(\s*(?:b|count|c|factors?)\s*(?:==|===|=)\s*0\s*\)/i.test(text) && /for\s*\([^)]*\bi\s*=\s*1\b/i.test(text);
  const hasCounterEqualsInputBug = /if\s*\(\s*(?:b|count|c)\s*(?:==|===|=)\s*(?:a|n)\s*\)/i.test(text);
  const hasBareWordPrintBug = /(?:prime\s*number|prime|not\s*prime)\b/i.test(text) && !/\b(?:print|console\.log|System\.out\.println)\b/i.test(text);
  const hasMissingQuotesInPrintBug = /\bprint\s*\(\s*(?:Prime|Not\s*Prime)\s*\)/i.test(text) && !/\bprint\s*\(\s*["'][^"']+["']\s*\)/i.test(text);
  const hasStrictLessThanLoopBug = /for\s*\([^)]*\bi\s*=\s*1\s*;\s*i\s*<\s*(?:a|n)\s*;/i.test(text) && !/i\s*<=/i.test(text);
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Input variable & counter initialization (var n = 5; var count = 0;)",
      completed: hasInput && hasCount,
      current: !(hasInput && hasCount)
    },
    {
      stepNumber: 2,
      title: "For loop iterating from 1 to n (for var i = 1; i <= n; i++)",
      completed: hasLoop,
      current: hasInput && hasCount && !hasLoop
    },
    {
      stepNumber: 3,
      title: "Divisibility condition & count increment (if (n % i == 0) count++;)",
      completed: hasCondition && hasIncrement,
      current: hasInput && hasCount && hasLoop && !(hasCondition && hasIncrement)
    },
    {
      stepNumber: 4,
      title: 'Prime decision print outside loop (if (count == 2) print("Prime") else print("Not Prime"))',
      completed: hasPrint && !hasPrintInsideLoopBug,
      current: hasInput && hasCount && hasLoop && hasCondition && hasIncrement && (!hasPrint || hasPrintInsideLoopBug)
    }
  ];
  const allVerified = hasInput && hasCount && hasLoop && hasCondition && hasIncrement && hasPrint && !hasPrintInsideLoopBug && !hasAssignmentInConditionBug && !hasLoopStart1WithFlagBug && !hasLoopBoundaryWithFlagBug;
  if (allVerified) {
    return {
      allVerified: true,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maara here! Outstanding work! \u{1F389} You have successfully assembled the complete Prime Number prototype code with input, counter initialization, loop from 1 to n, modulo divisibility check, and decision output. You are ready for the full Code Editor!",
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: 'var n = 7;\nvar count = 0;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    count++;\n  }\n}\nif (count == 2) {\n  print("Prime");\n} else {\n  print("Not Prime");\n}',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint
    };
  }
  if (hasLoopStart1WithFlagBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maara bug alert: Initialization bug! Starting loop at `i = 1` makes `n % 1 == 0` true on the very first step, making every number falsely 'Not Prime'! When testing divisors directly, start the loop from `var i = 2`.",
      correction: "Change loop initialization to `var i = 2`.",
      suggestedInput: "for (var i = 2; i < n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
      matchedFirebaseInput: "var n = 7;\nvar isPrime = true;\nfor (var i = 1; i < n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint
    };
  }
  if (hasLoopBoundaryWithFlagBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maara bug alert: Boundary bug! `i <= n` checks `n % n == 0`, which turns `isPrime = false` for every number! Change the condition to `i < n` (or stop before n).",
      correction: "Change condition from `i <= n` to `i < n`.",
      suggestedInput: "for (var i = 2; i < n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
      matchedFirebaseInput: "var n = 7;\nvar isPrime = true;\nfor (var i = 2; i <= n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint
    };
  }
  if (hasPrintInsideLoopBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maara bug alert: Placement bug! Placing `print('Prime')` or `print('Not Prime')` inside the loop causes it to print prematurely on intermediate numbers! Finish the entire loop first, then check the final status outside the loop.",
      correction: "Move the final decision `if` and `print` statements outside and below the loop.",
      suggestedInput: 'if (count == 2) {\n  print("Prime");\n} else {\n  print("Not Prime");\n}',
      matchedFirebaseInput: 'var n = 9;\nfor (var i = 2; i < n; i++) {\n  if (n % i == 0) { print("Not Prime"); }\n  else { print("Prime"); }\n}',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint
    };
  }
  if (hasAssignmentInConditionBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: "\u{1F31F} Coach Maara syntax alert: Syntax error! `count = 2` (or `count = 0`) is an assignment statement. Use the equality comparison operator `count == 2` (or `count == 0`) inside `if (...)`.",
      correction: "Use equality operator `count == 2` inside the `if` condition.",
      suggestedInput: 'if (count == 2) {\n  print("Prime");\n} else {\n  print("Not Prime");\n}',
      matchedFirebaseInput: 'if (count = 0) { print("Prime"); }',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint
    };
  }
  const inputVar = /\ba\s*=\s*\d+/i.test(text) ? "a" : "n";
  const counterVar = /\bb\s*=\s*0/i.test(text) ? "b" : /\bc\s*=\s*0/i.test(text) ? "c" : "count";
  if (hasDivisionInsteadOfModuloBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara bug alert: Look closely at your condition \`if(i/a=0)\`! \u{1F50D}

1. **Division vs Remainder:** The \`/\` operator calculates quotient (e.g. 4 / 2 = 2). To check if a number divides evenly with 0 remainder, you must use the **modulo remainder operator \`%\`** (\`${inputVar} % i\`).
2. **Order of Operands:** We want to divide our test number \`${inputVar}\` by the loop counter \`i\`, so it must be \`${inputVar} % i\` (not \`i / ${inputVar}\`).
3. **Comparison vs Assignment:** A single \`=\` is for variable assignment. To compare if remainder is zero, use the equality operator \`== 0\`.

\u{1F449} **Fix your condition to:**
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\``,
      correction: `Step 3: Fix condition to: if (${inputVar} % i == 0) { ${counterVar}++; }`,
      suggestedInput: `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`,
      matchedFirebaseInput: "if (n % i == 0) count++",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition: false,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasSingleEqualInModuloBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: In your condition, you used a single \`=\`. In JavaScript, a single \`=\` is for variable assignment. For checking equality in an \`if\` statement, use the comparison operator \`==\` (\`if (${inputVar} % i == 0)\`)!

\u{1F449} **Update to:**
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\``,
      correction: `Step 3: Use == operator: if (${inputVar} % i == 0) { ${counterVar}++; }`,
      suggestedInput: `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`,
      matchedFirebaseInput: "if (n % i == 0) count++",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition: false,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasReversedModuloOperandsBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: You wrote \`i % ${inputVar} == 0\`. This calculates loop counter \`i\` divided by \`${inputVar}\`! But we want to test if our input number \`${inputVar}\` is divisible by \`i\`. Swap the order to \`${inputVar} % i == 0\`.

\u{1F449} **Update to:**
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\``,
      correction: `Step 3: Fix operand order: if (${inputVar} % i == 0) { ${counterVar}++; }`,
      suggestedInput: `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`,
      matchedFirebaseInput: "if (n % i == 0) count++",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition: false,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasDecrementBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at \`${counterVar}--\`! \u{1F50D} Decrementing (\`--\`) decreases your counter. But whenever a number divides evenly (\`${inputVar} % i == 0\`), we found a valid divisor, so we must **increment / increase** our divisor counter by 1 (\`${counterVar}++\` or \`${counterVar} = ${counterVar} + 1\`) inside curly braces \`{ ... }\`!

\u{1F449} **Update to:**
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\``,
      correction: `Step 3: Increment counter instead of decrementing: if (${inputVar} % i == 0) { ${counterVar}++; }`,
      suggestedInput: `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`,
      matchedFirebaseInput: "if (n % i == 0) count++",
      hasInput,
      hasCount,
      hasLoop,
      hasCondition: true,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasLoopVariableMismatchBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara variable name alert: In your code, you defined your test number as \`a = 4\`, but your loop header tests \`i <= n\`! Since variable \`n\` is not defined in your code, the loop won't know where to stop. Change \`n\` to \`a\` (\`for (var i = 1; i <= a; i++)\`) so it iterates up to your input number.`,
      correction: `Step 2: Change loop limit to match input variable: for (var i = 1; i <= a; i++)`,
      suggestedInput: `for (var i = 1; i <= a; i++) {
  
}`,
      matchedFirebaseInput: "for (var i = 1; i <= n; i++)",
      hasInput,
      hasCount,
      hasLoop: false,
      hasCondition: false,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasStrictLessThanLoopBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara boundary alert: In your loop condition \`i < ${inputVar}\`, strictly less than (\`<\`) stops BEFORE reaching \`${inputVar}\` itself! \u{1F50D} This means the number itself won't be tested as a divisor, so a prime number would only count 1 divisor instead of 2. Change \`i < ${inputVar}\` to \`i <= ${inputVar}\` (\`for (var i = 1; i <= ${inputVar}; i++)\`) so it includes the number itself!`,
      correction: `Step 2: Change loop condition to i <= ${inputVar}: for (var i = 1; i <= ${inputVar}; i++)`,
      suggestedInput: `for (var i = 1; i <= ${inputVar}; i++) {
  
}`,
      matchedFirebaseInput: "for (var i = 1; i <= n; i++)",
      hasInput,
      hasCount,
      hasLoop: false,
      hasCondition: false,
      hasIncrement: false,
      hasPrint
    };
  }
  if (hasFactorCount1Bug || hasAssignmentInConditionBug && /=\s*1\b/.test(text)) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look closely at your decision \`if (${counterVar} == 1)\` (or \`if (${counterVar} = 1)\`)! \u{1F50D}

1. **Prime Factor Count (1 vs 2):** A prime number has **exactly 2 divisors** (1 and itself). When your loop tests numbers from 1 to \`${inputVar}\`, any prime number will find 2 divisors, so \`${counterVar}\` becomes **2** (only the number 1 has 1 divisor, and 1 is not a prime number!).
2. **Comparison Operator:** Remember to use the equality comparison \`==\` (\`if (${counterVar} == 2)\`) rather than a single \`=\`.
3. **Print Output:** Wrap your output inside \`print("Prime")\` with quotes, followed by \`else { print("Not Prime"); }\`.

\u{1F449} **Update your final decision check to:**
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\``,
      correction: `Step 4: Check if ${counterVar} == 2 (prime numbers have 2 divisors): if (${counterVar} == 2) print('Prime') else print('Not Prime')`,
      suggestedInput: `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`,
      matchedFirebaseInput: 'if (count == 2) print("Prime") else print("Not Prime")',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint: false
    };
  }
  if (hasFactorCount0Bug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: You checked \`if (${counterVar} == 0)\`! Because your loop starts from 1 and goes all the way to \`${inputVar}\`, every prime number will be divided evenly by 1 and itself, giving \`${counterVar} = 2\`. Change your decision check to \`if (${counterVar} == 2)\`.

\u{1F449} **Update to:**
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\``,
      correction: `Step 4: Change check to ${counterVar} == 2: if (${counterVar} == 2) print('Prime') else print('Not Prime')`,
      suggestedInput: `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`,
      matchedFirebaseInput: 'if (count == 2) print("Prime") else print("Not Prime")',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint: false
    };
  }
  if (hasCounterEqualsInputBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: You wrote \`if (${counterVar} == ${inputVar})\`! \`${counterVar}\` is the number of divisors found, not the value of \`${inputVar}\`. For any prime number, there are always exactly 2 divisors (1 and itself), so test \`if (${counterVar} == 2)\`!

\u{1F449} **Update to:**
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\``,
      correction: `Step 4: Check if ${counterVar} == 2: if (${counterVar} == 2) print('Prime') else print('Not Prime')`,
      suggestedInput: `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`,
      matchedFirebaseInput: 'if (count == 2) print("Prime") else print("Not Prime")',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint: false
    };
  }
  if (hasBareWordPrintBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: In JavaScript, text like \`prime number\` cannot be written as bare words! \u{1F50D} To display text on screen, wrap words in quotation marks inside a \`print()\` function (e.g. \`print("Prime");\`).

\u{1F449} **Write it with an if-else decision check:**
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\``,
      correction: `Step 4: Wrap output in print() function: print("Prime") and print("Not Prime")`,
      suggestedInput: `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`,
      matchedFirebaseInput: 'if (count == 2) print("Prime") else print("Not Prime")',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint: false
    };
  }
  if (hasMissingQuotesInPrintBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: In your \`print(...)\` statement, text without quotes is treated as an undefined variable name! \u{1F50D} Wrap string literals in quotes like \`print("Prime");\` and \`print("Not Prime");\`.

\u{1F449} **Update to:**
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\``,
      correction: `Step 4: Add quotes to print string literals: print("Prime")`,
      suggestedInput: `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`,
      matchedFirebaseInput: 'if (count == 2) print("Prime") else print("Not Prime")',
      hasInput,
      hasCount,
      hasLoop,
      hasCondition,
      hasIncrement,
      hasPrint: false
    };
  }
  let missingFeedback = "";
  let missingCorrection = "";
  let missingSuggestedInput = "";
  let matchedInput = "Do I need to write the code here";
  if (!hasInput || !hasCount) {
    missingFeedback = `\u{1F31F} Coach Maara here! Welcome! Let's build our prime number checker step-by-step. To get started, we need two starting variables:
1. An input number to test (e.g. \`var ${inputVar} = 5;\`)
2. A counter initialized to 0 to keep track of how many divisors we find (\`var ${counterVar} = 0;\`).

Add these two variable declarations to your code:`;
    missingCorrection = `Step 1: Declare input variable ${inputVar} and initialize counter ${counterVar} = 0.`;
    missingSuggestedInput = `var ${inputVar} = 5;
var ${counterVar} = 0;`;
    matchedInput = "var n = 5;";
  } else if (!hasLoop) {
    missingFeedback = `\u{1F31F} Coach Maara here! Great start with your variables! \u{1F680} Now, to test every potential divisor from 1 up to our number, we need a \`for loop\`. In JavaScript, the loop defines three key parts:

\u2022 **Start:** \`var i = 1\` (begins checking from 1)
\u2022 **Stop / End:** \`i <= ${inputVar}\` (keeps running until it reaches ${inputVar})
\u2022 **Next Step:** \`i++\` (adds +1 after each step to check the next number)

Here is how you write it:
\`\`\`javascript
for (var i = 1; i <= ${inputVar}; i++) {
  // divisibility check goes inside
}
\`\`\`
Try adding this loop below your variables!`;
    missingCorrection = `Step 2: Write for loop from 1 to ${inputVar}: for (var i = 1; i <= ${inputVar}; i++)`;
    missingSuggestedInput = `for (var i = 1; i <= ${inputVar}; i++) {
  
}`;
    matchedInput = "for (var i = 1; i <= n; i++)";
  } else if (!hasCondition || !hasIncrement) {
    if (hasCondition && !hasIncrement) {
      missingFeedback = `\u{1F31F} Coach Maara here! Spot on with the divisibility condition \`if (${inputVar} % i == 0)\`! \u{1F44F} You're right on track. Now, when that condition evaluates to true, what action should happen inside? We need to record that a divisor was found by incrementing our counter \`${counterVar}\` by 1 (\`${counterVar}++\` or \`${counterVar} = ${counterVar} + 1\`) inside the curly braces \`{ ... }\`.

Like this:
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\`
Add that increment step inside your if block!`;
      missingCorrection = `Step 3: Inside loop, increment counter: if (${inputVar} % i == 0) { ${counterVar}++; }`;
      missingSuggestedInput = `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`;
    } else if (!hasCondition && hasIncrement) {
      missingFeedback = `\u{1F31F} Coach Maara here! Great work adding the counter increment \`${counterVar}++\`! \u{1F44F} Now we just need to wrap it inside an \`if\` condition so it only increases when \`${inputVar}\` divides evenly by \`i\` with zero remainder (\`${inputVar} % i == 0\`).

Like this:
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\`
Give that a try inside your loop!`;
      missingCorrection = `Step 3: Wrap increment in divisibility check: if (${inputVar} % i == 0) { ${counterVar}++; }`;
      missingSuggestedInput = `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`;
    } else {
      missingFeedback = `\u{1F31F} Coach Maara checking in! Awesome progress setting up your variables and loop! \u{1F680} Now, inside the loop body, we need to check if each number \`i\` divides \`${inputVar}\` evenly without any remainder (\`${inputVar} % i == 0\`). If it does, we increase our divisor counter \`${counterVar}\` by 1 (\`${counterVar}++\`).

Here is how to write that inside your loop:
\`\`\`javascript
if (${inputVar} % i == 0) {
  ${counterVar}++;
}
\`\`\`
Give that a shot inside your loop!`;
      missingCorrection = `Step 3: Inside loop, check divisibility: if (${inputVar} % i == 0) { ${counterVar}++; }`;
      missingSuggestedInput = `  if (${inputVar} % i == 0) {
    ${counterVar}++;
  }`;
    }
    matchedInput = "if (n % i == 0) count++";
  } else if (!hasPrint) {
    missingFeedback = `\u{1F31F} Coach Maara here! Outstanding work! \u{1F389} Your loop and divisor counting logic are completely set up! Now for the final step: outside and below the loop, we inspect our counter \`${counterVar}\`.

A prime number has exactly 2 divisors (1 and itself). If \`${counterVar} == 2\`, display \`'Prime'\`, otherwise display \`'Not Prime'\`.

Here is how to write the final decision check:
\`\`\`javascript
if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}
\`\`\`
Add this below your loop to complete your code prototype!`;
    missingCorrection = `Step 4: Outside loop, check if ${counterVar} == 2 and print 'Prime' or 'Not Prime'.`;
    missingSuggestedInput = `if (${counterVar} == 2) {
  print("Prime");
} else {
  print("Not Prime");
}`;
    matchedInput = 'if (count == 2) print("Prime") else print("Not Prime")';
  }
  return {
    allVerified: false,
    sampleCodeStepProgress,
    feedback: missingFeedback,
    correction: missingCorrection,
    suggestedInput: missingSuggestedInput,
    matchedFirebaseInput: matchedInput,
    hasInput,
    hasCount,
    hasLoop,
    hasCondition,
    hasIncrement,
    hasPrint
  };
}
export {
  analyzePrimeLogicInput,
  isPrimeNumber,
  validatePrimeIngredients,
  validatePrimeLogic,
  validatePrimeRecipe,
  validatePrimeSampleCode
};
