function validateNextPrimeLogic(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase().replace(/[^a-z0-9\s%+\-=*×/]/g, " ").replace(/\s+/g, " ").trim();
  const rawText = (text || "").toLowerCase();
  if (/^(what\s+i\s+do|what\s+do\s+i\s+do|what\s+next|how\s+to|what|how|where|tell me|explain|help)/i.test(norm) && (norm.includes("next prime") || norm.includes("what should we do") || norm.includes("how to start") || norm.includes("where to start") || norm.includes("what i do") || norm.includes("what do i do")) || norm === "what should we do") {
    if (attemptCount >= 3) {
      return {
        isFullyVerified: false,
        hasFatalMisconception: false,
        isTheoryExplanation: false,
        isMathematicalExplanation: false,
        feedback: "🌟 Coach Maara here with a concrete step! To find the next prime of N, start a candidate number at N + 1. Check if candidate % divisor == 0 for all numbers from 2 up to candidate - 1. If no divisor divides candidate evenly, candidate is our next prime!",
        correction: "Start from N+1 and test each consecutive number for divisors.",
        suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
        matchedFirebaseInput: "what should we do to find the next prime number"
      };
    }
    if (attemptCount === 2) {
      return {
        isFullyVerified: false,
        hasFatalMisconception: false,
        isTheoryExplanation: false,
        isMathematicalExplanation: false,
        feedback: "🌟 Coach Maara checking back! The next prime number is the very first prime number that comes strictly AFTER the given number.\nFor example:\n• If the given number is 7, the following numbers are 8 (not prime), 9 (not prime), 10 (not prime), 11 (Prime!)\nSo the next prime of 7 is 11. What number should we test first if input is 7?",
        correction: "Start checking numbers one by one starting from N + 1 until a prime is found.",
        suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
        matchedFirebaseInput: "what should we do to find the next prime number"
      };
    }
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "🌟 Coach Maara here! What does 'Next Prime Number' mean? For example, if the given number is 7, what is the smallest prime number strictly greater than 7?",
      correction: "Think about the first prime number that comes after the given number.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
      matchedFirebaseInput: "what should we do to find the next prime number"
    };
  }
  if (norm.includes("dont know") || norm.includes("don't know") || norm.includes("puriyala") || norm.includes("theriyala") || norm.includes("no idea") || norm === "i don t know") {
    if (attemptCount >= 2) {
      return {
        isFullyVerified: false,
        hasFatalMisconception: false,
        isTheoryExplanation: false,
        isMathematicalExplanation: false,
        feedback: "🌟 Coach Maara here with a concrete step! Start with a candidate variable equal to N + 1. Check if candidate has any divisors other than 1 and itself. When no divisor is found, candidate is the next prime!",
        correction: "Start from N+1 and test each consecutive number for divisors.",
        suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
        matchedFirebaseInput: "I don't know"
      };
    }
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "🌟 Coach Maara here! The next prime number is the very first prime number that comes AFTER the given number.\nFor example:\n• If given number is 7, the next numbers are 8 (not prime), 9 (not prime), 10 (not prime), 11 (Prime!)\nSo the next prime of 7 is 11.\nHow do we test numbers one by one to find it?",
      correction: "Start checking numbers one by one starting from N + 1 until a prime is found.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
      matchedFirebaseInput: "I don't know"
    };
  }
  if (norm.includes("next prime of 7 is 7") || norm.includes("same number") || norm.includes("next prime is 7") || norm.includes("next prime is itself") || norm.includes("next prime is n")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: true,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara logic alert: The next prime must be strictly GREATER than the given number! Even if 7 is already a prime number, we must look for the next prime that comes after 7 (which is 11).",
      correction: "Next prime must be strictly greater than N: start testing from N + 1.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a prime",
      matchedFirebaseInput: "next prime of 7 is 7"
    };
  }
  if ((norm.includes("add 1 or 2") || norm.includes("add 2") || norm.includes("n + 2") || norm.includes("n+2") || norm.includes("just add 2") || norm.includes("plus 2")) && !norm.includes("check") && !norm.includes("test") && !norm.includes("divis") && !norm.includes("candidate")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: true,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara note: Adding 1 or 2 does not always give a prime number! For example, 7 + 2 = 9 (not prime, 3 \xD7 3 = 9), and 13 + 2 = 15 (not prime, 3 \xD7 5 = 15). We must mathematically check each candidate until we find a prime.",
      correction: "Test candidate numbers for primality instead of just adding a fixed number.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a prime",
      matchedFirebaseInput: "just add 1 or 2 to the number"
    };
  }
  if ((norm === "0 or 1" || norm === "what if input is 0" || norm === "what if 0 or 1") && !norm.includes("next") && !norm.includes("start")) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara note: The smallest prime number is 2. So if the input is 0 or 1 (or negative), the next prime number is 2.",
      correction: "If N <= 1, the next prime number is 2.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a prime",
      matchedFirebaseInput: "what if input is 0 or 1"
    };
  }
  const mentionsStartAfterN = norm.includes("n+1") || norm.includes("n + 1") || norm.includes("given number + 1") || norm.includes("number + 1") || norm.includes("next number") || norm.includes("after n") || norm.includes("after the given number") || norm.includes("greater than n") || norm.includes("strictly greater") || norm.includes("smallest prime greater") || norm.includes("candidate = n + 1") || norm.includes("candidate starts at") || norm.includes("adutha number") || norm.includes("adutha prime") || norm.includes("next integer") || norm.includes("increment n") || norm.includes("numbers after") || norm.includes("x > n") || norm.includes("candidate > n");
  const mentionsPrimeDefinitionOrCheck = norm.includes("prime") || norm.includes("divisor") || norm.includes("divisible") || norm.includes("divisibility") || norm.includes("factors") || norm.includes("only by 1 and itself") || norm.includes("only 1 and itself") || norm.includes("only 2 divisors") || norm.includes("two divisors") || norm.includes("two factors") || norm.includes("remainder 0") || norm.includes("remainder is 0") || norm.includes("modulo") || norm.includes("%") || norm.includes("no other divisor") || norm.includes("between 2 and");
  const mentionsSearchOrIteration = norm.includes("consecutive") || norm.includes("one by one") || norm.includes("sequential") || norm.includes("until") || norm.includes("loop") || norm.includes("repeat") || norm.includes("each number") || norm.includes("every number") || norm.includes("increase by 1") || norm.includes("candidate++") || norm.includes("increment") || norm.includes("first prime") || norm.includes("stop when") || norm.includes("smallest prime") || norm.includes("first prime number found") || norm.includes("keep check") || norm.includes("continue") || norm.includes("ovvoru number");
  const isAskingQuestion = /what (do|should|i do|to do|can i do)|how (do|to|can)|help|explain|i don't know|what next/i.test(text);
  const mentionsFullMathematicalTrace = norm.includes("3") && norm.includes("5") && (norm.includes("4") || norm.includes("divisor") || norm.includes("divisible")) || norm.includes("7") && norm.includes("11") && (norm.includes("8") || norm.includes("9") || norm.includes("10") || norm.includes("check") || norm.includes("test")) || norm.includes("5") && norm.includes("7") && (norm.includes("6") || norm.includes("test")) || norm.includes("13") && norm.includes("17") && (norm.includes("14") || norm.includes("15") || norm.includes("16"));
  const mentionsMathCompositeOnly = (norm.includes("3") && norm.includes("4") && !norm.includes("5") || norm.includes("7") && (norm.includes("8") || norm.includes("9") || norm.includes("10")) && !norm.includes("11") || norm.includes("5") && norm.includes("6") && !norm.includes("7") || norm.includes("13") && (norm.includes("14") || norm.includes("15") || norm.includes("16")) && !norm.includes("17")) && (norm.includes("/") || norm.includes("%") || norm.includes("divisor") || norm.includes("divisible") || norm.includes("remainder"));
  if (mentionsMathCompositeOnly) {
    let testedComp = "4";
    let nextCandidate = "5";
    let initialNum = "3";
    if (norm.includes("7")) {
      testedComp = "8";
      nextCandidate = "11 (testing 8, 9, 10, 11)";
      initialNum = "7";
    } else if (norm.includes("5")) {
      testedComp = "6";
      nextCandidate = "7";
      initialNum = "5";
    } else if (norm.includes("13")) {
      testedComp = "14";
      nextCandidate = "17 (testing 14, 15, 16, 17)";
      initialNum = "13";
    }
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: true,
      feedback: `\u{1F31F} Coach Maara here! Spot-on mathematical check for candidate ${testedComp}! You clearly demonstrated that ${testedComp} has more than 2 divisors and is not prime. Now, take the next step and repeat this test for the next number: check candidate ${nextCandidate}. When you test its divisors, does it satisfy the prime condition to be our next prime?`,
      correction: `Continue the mathematical check for candidate ${nextCandidate} until you find the first number that has no other divisors (prime), and state that it is the next prime for ${initialNum}.`,
      suggestedInput: `If input is ${initialNum}, we test candidate ${testedComp} (not prime because it has >2 divisors). We repeat for next candidate ${nextCandidate}: it is only divisible by 1 and itself, so ${nextCandidate.split(" ")[0]} is prime and our next prime!`,
      matchedFirebaseInput: "repeat this process"
    };
  }
  const mentionsSingleExampleOnly = (norm.includes("7") && norm.includes("11") || norm.includes("5") && norm.includes("7") || norm.includes("13") && norm.includes("17") || norm.includes("11") && norm.includes("13") || norm.includes("17") && norm.includes("19") || norm.includes("19") && norm.includes("23")) && !mentionsStartAfterN && !mentionsSearchOrIteration && !(norm.includes("8") || norm.includes("9") || norm.includes("10") || norm.includes("divisor") || norm.includes("divisible"));
  if (isAskingQuestion && !mentionsStartAfterN && !mentionsSearchOrIteration) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! In this Logic stage, explain the general thinking of finding the Next Prime Number: For any given number N, where do you start checking (e.g. from N + 1), and how do you test each consecutive number until you hit the first prime?",
      correction: "Start testing candidate numbers from N + 1 and test each number for primality until the first prime is found.",
      suggestedInput: "To find the next prime number for N, start testing numbers from N + 1 one by one. Check if each number has any divisors from 2 to candidate - 1. As soon as we find a number with no divisors, that is our next prime.",
      matchedFirebaseInput: "what i do here"
    };
  }
  if (mentionsSingleExampleOnly) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! That is a correct example\u201411 is indeed the next prime after 7! Now explain the general algorithm: For ANY given number N, where do we start searching (e.g. from N + 1), and what test do we perform on each candidate to check if it's prime?",
      correction: "Explain the general logic: Start from N + 1 and test each candidate for primality until the first prime is found.",
      suggestedInput: "For a given number N, start testing candidate numbers from N + 1. Check each number one by one to see if it has no divisors other than 1 and itself, and stop at the first prime found.",
      matchedFirebaseInput: "11 is the next prime number for 7"
    };
  }
  if ((mentionsStartAfterN || norm.includes("next number") || norm.includes("adutha number")) && mentionsPrimeDefinitionOrCheck && !mentionsSearchOrIteration && !mentionsFullMathematicalTrace) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! That is a great starting observation\u2014you are checking the candidate right after your number (for 7, checking 8). But notice that 8 is NOT prime (it is divisible by 2 and 4)! What should we do next if that number is not prime? How do we keep incrementing and checking each consecutive number (8, 9, 10, 11...) until we reach the first prime number?",
      correction: "Explain what happens if the next number is not prime: keep incrementing by 1 and checking each number one by one until the first prime is found.",
      suggestedInput: "If the input is 7, we check the next number 8. Since 8 is not prime, we keep increasing by 1 and check 9, 10, 11 until we find the first prime (11).",
      matchedFirebaseInput: "We need to check the next number of the taken number is prime or not"
    };
  }
  const isTheoryVerified = !isAskingQuestion && // Full definition of prime + starting from n+1 + search/iteration
  ((mentionsStartAfterN || norm.includes("strictly greater") || norm.includes("smallest prime greater")) && mentionsPrimeDefinitionOrCheck && mentionsSearchOrIteration || // Definition of next prime as smallest prime strictly greater than n with explanation
  norm.includes("smallest prime") && (norm.includes("greater than") || norm.includes("after")) && mentionsPrimeDefinitionOrCheck || // Plain theory in everyday English/Tanglish
  norm.includes("start from n+1 and check") && mentionsSearchOrIteration || norm.includes("check each consecutive number until") && norm.includes("prime") || norm.includes("test candidate") && norm.includes("prime") && (norm.includes("n+1") || norm.includes("n + 1") || norm.includes("increment")));
  const isMathVerified = !isAskingQuestion && // Mathematical full trace + prime verification
  (mentionsFullMathematicalTrace && mentionsPrimeDefinitionOrCheck || // Modulo / divisor formula condition: candidate % i == 0 from 2 to candidate - 1
  (norm.includes("%") || norm.includes("modulo") || norm.includes("remainder")) && (mentionsStartAfterN || norm.includes("candidate")) && mentionsSearchOrIteration || // Range explanation: check divisors between 2 and n/candidate
  (norm.includes("2 to candidate") || norm.includes("2 to n") || norm.includes("2 up to") || norm.includes("between 2 and")) && (mentionsStartAfterN || mentionsPrimeDefinitionOrCheck) && mentionsSearchOrIteration);
  if (isTheoryVerified || isMathVerified) {
    const proofKind = isMathVerified ? "mathematical" : "theoretical";
    return {
      isFullyVerified: true,
      hasFatalMisconception: false,
      isTheoryExplanation: isTheoryVerified,
      isMathematicalExplanation: isMathVerified,
      feedback: `\u{1F31F} Coach Maara here! Outstanding logic! \u{1F389} You have clearly and accurately explained the concept of Next Prime Number: Start testing candidate numbers strictly greater than N (from N + 1), test each candidate for primality (ensuring no divisors between 2 and candidate - 1), and stop as soon as the first prime number is found. Excellent mastery! Proceed to Recipe stage!`,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself"
    };
  }
  if (mentionsStartAfterN && !mentionsPrimeDefinitionOrCheck) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! Great start! Starting from (given number + 1), what mathematical test do we perform on each candidate number to check if it is prime?",
      correction: "Check if the candidate number is prime (has no divisors other than 1 and itself).",
      suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
      matchedFirebaseInput: "start testing from given number + 1"
    };
  }
  if (mentionsPrimeDefinitionOrCheck && !mentionsStartAfterN && !mentionsSearchOrIteration) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: true,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! Superb! A prime number has no divisors other than 1 and itself. To find the NEXT prime number for a given N, where do we start our search, and how do we test each number?",
      correction: "Start from N + 1 and test each consecutive candidate number until a prime is found.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
      matchedFirebaseInput: "check if the candidate number is prime"
    };
  }
  if (mentionsSearchOrIteration && !mentionsStartAfterN && !mentionsPrimeDefinitionOrCheck) {
    return {
      isFullyVerified: false,
      hasFatalMisconception: false,
      isTheoryExplanation: false,
      isMathematicalExplanation: false,
      feedback: "\u{1F31F} Coach Maara here! Exactly! Keep increasing the candidate by 1 and testing each number until the first prime is found.",
      correction: "Combine into a full explanation: start from N+1, test each candidate for primality, and return the first prime.",
      suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
      matchedFirebaseInput: "increase by 1 and check the next number"
    };
  }
  return {
    isFullyVerified: false,
    hasFatalMisconception: false,
    isTheoryExplanation: false,
    isMathematicalExplanation: false,
    feedback: "\u{1F31F} Coach Maara here! You're making progress. Remember, the next prime number is the first prime strictly greater than N. Start from N + 1, test each consecutive candidate number for primality (no divisors other than 1 and itself), and stop when you find the first prime!",
    correction: "Explain: Start from N + 1, test each candidate for divisors, if not prime increase by 1, stop at first prime.",
    suggestedInput: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
    matchedFirebaseInput: "what should we do to find the next prime number"
  };
}
function detectRecipeCodeKeywords(text) {
  const detectedItems = [];
  if (/\bn\+\+/i.test(text)) {
    detectedItems.push("`n++` (code increment operator on input n)");
  } else if (/\bcandidate\+\+/i.test(text)) {
    detectedItems.push("`candidate++` (code increment operator)");
  } else if (/\b[a-zA-Z0-9_]+\s*(\+\+|\-\-)|\bcount\+\+|\bi\+\+|\bj\+\+/i.test(text)) {
    detectedItems.push("increment operators (`++`, `--`)");
  }
  if (/\b(var|let|const)\s+[a-zA-Z_]/i.test(text)) {
    detectedItems.push("variable declaration (`var`, `let`, `const`)");
  }
  if (/\b(int|float|double|char|bool|boolean)\s+[a-zA-Z_]/i.test(text)) {
    detectedItems.push("data type declaration (`int`, `boolean`)");
  }
  if (/\bwhile\s*\(|\bfor\s*\(|\bwhile\s+true\b/i.test(text)) {
    detectedItems.push("loop statements (`while (...)`, `for (...)`)");
  }
  if (/===|!==|==/.test(text)) {
    detectedItems.push("comparison operators (`===`, `==`)");
  }
  if (/%\s*[0-9a-zA-Z_]/.test(text)) {
    detectedItems.push("modulo operator (`%`)");
  }
  if (/;\s*$/m.test(text) || /[{}]/.test(text)) {
    detectedItems.push("code syntax symbols (`;`, `{}`)");
  }
  if (/console\.log|printf\b|System\.out|cin\s*>>|cout\s*<<|\bprint\s*\(/i.test(text)) {
    detectedItems.push("programming print functions (`console.log`, `print()`)");
  }
  if (/isPrime\s*=\s*(true|false)|\bboolean\s+isPrime/i.test(text)) {
    detectedItems.push("boolean flag assignments (`isPrime = true`)");
  }
  if (/\breturn\s+[0-9a-zA-Z_]/i.test(text)) {
    detectedItems.push("return statements (`return`)");
  }
  return {
    hasCode: detectedItems.length > 0,
    detectedItems
  };
}
function validateNextPrimeRecipe(text) {
  const norm = (text || "").toLowerCase();
  const { hasCode, detectedItems } = detectRecipeCodeKeywords(text);
  const step1 = /step\s*1\s*[:.-]?\s*(get|accept|take|read|input|enter|start\s*with|receive|prompt)/i.test(text) || /1\s*[\.)]\s*(get|accept|take|read|input|enter|start\s*with|receive|prompt)/i.test(text) || (norm.includes("input") || norm.includes("get") || norm.includes("read") || norm.includes("take") || norm.includes("accept")) && (norm.includes("number") || norm.includes(" n ") || norm.endsWith(" n") || norm.includes(" n\n") || norm.includes("given number") || norm.includes("integer"));
  const step2 = /step\s*2\s*[:.-]?\s*.*?(start\s*candidate|candidate|take\s*(?:n|input)\s*\+\s*1|(?:n|input)\s*\+\s*1|after\s*(?:the\s*)?(?:input|n)|next\s*(?:prime\s*)?number|initialize\s*candidate|start\s*testing)/i.test(text) || /2\s*[\.)]\s*.*?(start\s*candidate|candidate|take\s*(?:n|input)\s*\+\s*1|(?:n|input)\s*\+\s*1|after\s*(?:the\s*)?(?:input|n)|next\s*(?:prime\s*)?number|initialize\s*candidate|start\s*testing)/i.test(text) || (norm.includes("candidate") || norm.includes("next number") || norm.includes("next prime") || norm.includes("start testing") || norm.includes("after the input") || norm.includes("after input")) && (norm.includes("n + 1") || norm.includes("n+1") || norm.includes("input+1") || norm.includes("input + 1") || norm.includes("after n") || norm.includes("after input") || norm.includes("after the input") || norm.includes("greater than n") || norm.includes("greater than input") || norm.includes("next integer"));
  const step3 = /step\s*3\s*[:.-]?\s*(to\s*check|check|test|verify|examine|is\s*candidate\s*prime|primality|prime\s*number\s*condition|primenumber\s*condition|prime\s*condition|divisor|factor)/i.test(text) || /3\s*[\.)]\s*(to\s*check|check|test|verify|examine|is\s*candidate\s*prime|primality|prime\s*number\s*condition|primenumber\s*condition|prime\s*condition|divisor|factor)/i.test(text) || /step\s*3\b/i.test(text) && (norm.includes("check") || norm.includes("prime") || norm.includes("divisor") || norm.includes("factor")) || (norm.includes("divisor") || norm.includes("factor") || norm.includes("divisible") || norm.includes("divide") || norm.includes("from 2 to")) && (norm.includes("check") || norm.includes("test") || norm.includes("verify") || norm.includes("examine") || norm.includes("prime"));
  const step4 = /step\s*(3\.1|4)\s*[:.-]?\s*(the\s*number\s*is\s*prime|if\s*the\s*number\s*is\s*prime|if\s*candidate\s*is\s*prime|if\s*prime|when\s*prime|is\s*prime|display|diplay|disply|dispaly|print|show|output|stop|terminate|finish)/i.test(text) || /(3\.1|4)\s*[\.)]\s*(the\s*number\s*is\s*prime|if\s*the\s*number\s*is\s*prime|if\s*candidate\s*is\s*prime|if\s*prime|when\s*prime|is\s*prime|display|diplay|disply|dispaly|print|show|output|stop|terminate|finish)/i.test(text) || (norm.includes("if prime") || norm.includes("is prime") || norm.includes("number is prime") || norm.includes("candidate is prime") || norm.includes("no divisor") || norm.includes("no factors")) && (norm.includes("display") || norm.includes("diplay") || norm.includes("disply") || norm.includes("dispaly") || norm.includes("print") || norm.includes("show") || norm.includes("output") || norm.includes("stop") || norm.includes("terminate") || norm.includes("finish") || norm.includes("exit") || norm.includes("next prime")) || /step\s*4\b/i.test(text) && (norm.includes("prime") || norm.includes("diplay") || norm.includes("display") || norm.includes("print") || norm.includes("next prime"));
  const step5 = /step\s*(3\.2|5)\s*[:.-]?\s*(if\s*(not\s*prime|candidate\s*is\s*not\s*prime|the\s*number\s*is\s*not\s*prime)|move\s*to\s*the\s*next|increase|increment|add\s*1|repeat|loop\s*back|go\s*back)/i.test(text) || /(3\.2|5)\s*[\.)]\s*(if\s*(not\s*prime|candidate\s*is\s*not\s*prime|the\s*number\s*is\s*not\s*prime)|move\s*to\s*the\s*next|increase|increment|add\s*1|repeat|loop\s*back|go\s*back)/i.test(text) || (norm.includes("not prime") || norm.includes("composite") || norm.includes("has divisor") || norm.includes("has factors")) && (norm.includes("increase") || norm.includes("increment") || norm.includes("add 1") || norm.includes("repeat") || norm.includes("next candidate") || norm.includes("next number") || norm.includes("go back") || norm.includes("check again")) || (norm.includes("increase") || norm.includes("increment") || norm.includes("add 1") || norm.includes("move to the next number")) && (norm.includes("repeat") || norm.includes("again") || norm.includes("step 3") || norm.includes("go back")) || /step\s*5\b/i.test(text) && (norm.includes("not prime") || norm.includes("next number") || norm.includes("repeat") || norm.includes("go back") || norm.includes("again"));
  const stepProgress = [
    {
      stepNumber: 1,
      title: "Get the input number N",
      completed: step1,
      current: !step1
    },
    {
      stepNumber: 2,
      title: "Start candidate number as N + 1",
      completed: step2,
      current: step1 && !step2
    },
    {
      stepNumber: 3,
      title: "Check if candidate number is prime (divisors from 2 to candidate - 1)",
      completed: step3,
      current: step1 && step2 && !step3
    },
    {
      stepNumber: 4,
      title: "If candidate is prime, display candidate and stop",
      completed: step4,
      current: step1 && step2 && step3 && !step4
    },
    {
      stepNumber: 5,
      title: "If candidate is not prime, increase candidate by 1 and repeat Step 3",
      completed: step5,
      current: step1 && step2 && step3 && step4 && !step5
    }
  ];
  if (hasCode) {
    const itemsList = detectedItems.join(", ");
    const hasNPlusPlus = /\bn\+\+/i.test(text);
    const nextRecipeStep = !step1 ? "Step 1: Get the input number N" :
      !step2 ? "Step 2: Start candidate number as N + 1 (if candidate < 2, set candidate to 2)" :
      !step3 ? "Step 3: Check if the candidate number is prime" :
      !step4 ? "Step 4: If candidate is prime, display candidate as the next prime and stop" :
      "Step 5: If candidate is not prime, increase candidate by 1 and repeat Step 3";
    if (step1 && step2 && step3 && step4 && step5) {
      if (hasNPlusPlus) {
        return {
          isFullyVerified: false,
          stepProgress,
          feedback: "\u{1F31F} Coach Maara checking in! You have mapped out all 5 steps of the recipe flow very well:\n\u2022 Step 1: Read input number N \u2705\n\u2022 Step 2: Start candidate number as N + 1 \u2705\n\u2022 Step 3: Check prime condition \u2705\n\u2022 Step 4: If prime, display candidate as next prime and stop \u2705\n\u2022 Step 5: If not prime, move to next number and repeat \u2705\n\n\u{1F50D} **One small correction for Step 5:**\nYou wrote `n++`. In the Recipe stage:\n1. We describe algorithmic steps in plain everyday English without code symbols like `++`.\n2. Also, remember we increment the **candidate number** (candidate + 1), not the original input `n`!\n\n\u{1F449} Simply update that line to plain English: **'If the number is not prime, increase candidate by 1 and repeat from Step 3'**.",
          correction: "Replace 'n++' with plain English: 'Increase candidate by 1 and repeat Step 3'.",
          suggestedInput: "Step 5: If candidate is not prime, increase candidate by 1 and repeat Step 3",
          matchedFirebaseInput: "what should i do here"
        };
      }
      return {
        isFullyVerified: false,
        stepProgress,
        feedback: `\u{1F31F} Coach Maara checking in! You have sequenced all 5 recipe steps well! In the **Recipe** stage, we describe our solution as a human kitchen-style recipe in plain English, without programming tool keywords or code syntax (spotted: ${itemsList}).

\u{1F449} Rephrase any code keywords into everyday plain words (e.g. 'increase candidate by 1 and repeat Step 3') so we can complete this stage!`,
        correction: "Write the algorithm in plain English without programming keywords.",
        suggestedInput: nextRecipeStep,
        matchedFirebaseInput: "what should i do here"
      };
    }
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: `\u{1F31F} Coach Maara gentle reminder: In the **Recipe** stage, we describe our solution as a human kitchen-style recipe in plain English, without programming tool keywords or code syntax (spotted: ${itemsList}).

Please describe the steps in everyday plain language:
- Step 1: Get the input number N
- Step 2: Start candidate number as N + 1 (if candidate < 2, set candidate to 2)
- Step 3: Check if the candidate number is prime
- Step 4: If candidate is prime, display candidate as the next prime and stop
- Step 5: If candidate is not prime, increase candidate by 1 and repeat Step 3`,
      correction: "Write the algorithm in plain English without programming keywords.",
      suggestedInput: nextRecipeStep,
      matchedFirebaseInput: "what should i do here"
    };
  }
  if (step1 && step2 && step3 && step4 && step5) {
    return {
      isFullyVerified: true,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Outstanding! \u{1F389} You have written down the complete, step-by-step recipe with every essential step in place and zero programming jargon. Proceed to Stage 3: Ingredients!",
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "step 3.2 : If candidate is not prime, increase candidate by 1 and repeat Step 3"
    };
  }
  if (!step1) {
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Let's turn our Next Prime logic into an easy-to-follow cooking recipe! In plain English (no code tools/keywords), what is our very first step to begin the program?",
      correction: "Step 1: Get the input number N",
      suggestedInput: "Step 1: Get the input number N",
      matchedFirebaseInput: "what should i do here"
    };
  }
  if (!step2) {
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Great start with Step 1! In Step 2, what initial candidate number do we start testing to find the next prime strictly greater than N?",
      correction: "Step 2: Start candidate number as N + 1 (if candidate < 2, set candidate to 2)",
      suggestedInput: "Step 2: Start candidate number as N + 1 (if candidate < 2, set candidate to 2)",
      matchedFirebaseInput: "step 1 : Get the input number N"
    };
  }
  if (!step3) {
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Spot on with Steps 1 & 2! Now in Step 3, how do we test this candidate to check whether it is a prime number?",
      correction: "Step 3: Check if the candidate number is prime (test if any number from 2 to candidate - 1 divides it evenly)",
      suggestedInput: "Step 3: Check if the candidate number is prime",
      matchedFirebaseInput: "step 2 : Start candidate number as N + 1 (if candidate < 2, set candidate to 2)"
    };
  }
  if (!step4) {
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Wonderful progress! In Step 4 (or Step 3.1), what should happen if our candidate number turns out to be prime?",
      correction: "Step 4: If candidate is prime, display candidate as the next prime and stop",
      suggestedInput: "Step 4: If candidate is prime, display candidate as the next prime and stop",
      matchedFirebaseInput: "step 3 : Check if the candidate number is prime"
    };
  }
  return {
    isFullyVerified: false,
    stepProgress,
    feedback: "\u{1F31F} Coach Maara here! You're almost done! In Step 5 (or Step 3.2), what should we do if our candidate is NOT prime?",
    correction: "Step 5: If candidate is not prime, increase candidate by 1 and repeat Step 3",
    suggestedInput: "Step 5: If candidate is not prime, increase candidate by 1 and repeat Step 3",
    matchedFirebaseInput: "step 3.1 : If candidate is prime, display candidate as the next prime and stop"
  };
}
function validateNextPrimeIngredients(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const lines = norm.split("\n").map((l) => l.trim()).filter(Boolean);
  const hasInputVar = /\b(?:n|num|number|a|input)\b\s*=\s*\d+/i.test(text) || /step\s*1\s*:\s*[a-z]\s*=\s*\d+/i.test(text) || /\b(?:n|num|number|a)\b/i.test(text) && (norm.includes("input") || norm.includes("store") || norm.includes("get") || norm.includes("variable") || norm.includes("use n") || norm.includes("use a") || norm.includes("take") || norm.includes("declare") || /n\s*=/i.test(text) || /step\s*1\b/i.test(text) || norm.includes("user input")) || norm.includes("input number") || norm.includes("n variable");
  const hasCandidateVar = /step\s*1(?:\.1)?\s*:\s*[a-z]\s*=\s*[a-z]\s*\+\s*1/i.test(text) || /\b[a-z]\s*=\s*[a-z]\s*\+\s*1/i.test(text) || /candi[dt]a[dt]e/i.test(text) || /\bc\b|\bb\b/i.test(text) && (norm.includes("+1") || norm.includes("+ 1") || norm.includes("next")) || /\bc\s*=\s*(?:n|a)\s*\+\s*1/i.test(text) || /\bb\s*=\s*(?:n|a)\s*\+\s*1/i.test(text) || norm.includes("n+1") || norm.includes("n + 1") || norm.includes("a+1") || norm.includes("a + 1") || norm.includes("candidate = n + 1") || norm.includes("candidate variable") || norm.includes("canditate variable") || norm.includes("next number");
  const step1 = hasInputVar && hasCandidateVar;
  const getStepLines = (stepNum) => {
    const startIdx = lines.findIndex((l) => new RegExp(`^\\s*step\\s*${stepNum}\\b`, "i").test(l));
    if (startIdx === -1) return [];
    let endIdx = lines.findIndex((l, idx) => idx > startIdx && /^\s*step\s*\d+\b/i.test(l));
    if (endIdx === -1) endIdx = lines.length;
    return lines.slice(startIdx, endIdx);
  };
  const step2Lines = getStepLines(2);
  const step3Lines = getStepLines(3);
  const step4Lines = getStepLines(4);
  const step5Lines = getStepLines(5);
  const step6Lines = getStepLines(6);
  const hasStepLabels = /^\s*step\s*\d+/im.test(text);
  const step2Scope = step2Lines.length > 0 ? step2Lines : hasStepLabels ? [] : lines;
  const innerLoopCandidateLines = step3Lines.length > 0 && step4Lines.length > 0 && step4Lines.some((l) => /\bfor\s*loop\b/i.test(l) || /\bstart\b/i.test(l)) ? [...step3Lines, ...step4Lines] : step3Lines.length > 0 ? step3Lines : hasStepLabels ? [...step3Lines, ...step4Lines] : lines;
  const step3Scope = innerLoopCandidateLines;
  const condCandidateLines = step4Lines.length > 0 && step5Lines.length > 0 && step5Lines.some((l) => /%\s*[ij]/i.test(l) || /left\s*side/i.test(l) || /right\s*side/i.test(l) || /operator/i.test(l)) ? [...step4Lines, ...step5Lines] : step4Lines.length > 0 ? step4Lines : hasStepLabels ? [...step4Lines, ...step5Lines] : lines;
  const step4Scope = condCandidateLines;
  const step5Scope = step5Lines.length > 0 ? [...step5Lines, ...step6Lines] : hasStepLabels ? step6Lines : lines;
  const step3Text = innerLoopCandidateLines.length > 0 ? innerLoopCandidateLines.join("\n").toLowerCase() : norm;
  const step4Text = condCandidateLines.length > 0 ? condCandidateLines.join("\n").toLowerCase() : norm;
  const step5Text = step5Scope.length > 0 ? step5Scope.join("\n").toLowerCase() : norm;
  const hasOuterStart = step2Scope.some((l) => /\bstart\b/i.test(l) && (l.includes("+1") || l.includes("+ 1") || l.includes("n+1") || l.includes("n + 1") || l.includes("a+1") || l.includes("a + 1") || l.includes("candidate") || l.includes("b") || l.includes("i")));
  const hasOuterEnd = step2Scope.some((l) => /\b(?:end|stop|to|until)\b/i.test(l) && (l.includes("infinite") || l.includes("prime") || l.includes("found") || l.includes("true") || l.includes("no end") || l.includes("no stop")));
  const hasOuterStep = step2Scope.some((l) => /\b(?:step|next|advance|increment)\b/i.test(l) && (l.includes("+1") || l.includes("+ 1") || l.includes("1") || l.includes("++") || l.includes("one") || l.includes("b++") || l.includes("i++")));
  const hasFaultyOuterEnd = step2Lines.length > 0 && step2Lines.some((l) => /\b(?:end|stop)\b/i.test(l) && (/:\s*(?:b|a|n|\d+)\s*$/i.test(l) || /\b(?:end|stop)\s*:\s*(?:b|a|n)\b/i.test(l)) && !l.includes("infinite") && !l.includes("prime") && !l.includes("found") && !l.includes("true") && !l.includes("no end"));
  const hasDecomposedOuterLoop = hasOuterStart && hasOuterEnd && hasOuterStep && !hasFaultyOuterEnd;
  const hasOuterWhile = norm.includes("while true") || norm.includes("while(true)") || norm.includes("while (true)") || norm.includes("while") && norm.includes("candidate");
  const hasFullOuterLoopSyntax = /for\s*\(\s*(?:var|let|const)?\s*(?:candidate|c|b|i)\s*=\s*(?:n|a)\s*\+\s*1/i.test(text) || hasOuterWhile;
  const step2 = hasDecomposedOuterLoop || hasFullOuterLoopSyntax;
  const hasInnerLoopStart = step3Scope.some((l) => /\bstart\b/i.test(l) && (l.includes("1") || l.includes("2") || l.includes("one") || l.includes("two") || l.includes("i = 1") || l.includes("i = 2") || l.includes("i=1") || l.includes("i=2") || l.includes("j = 1") || l.includes("j=1")));
  const hasInnerLoopEnd = step3Scope.some((l) => /\b(?:end|stop|to|until)\b/i.test(l) && (l.includes("candidate") || l.includes("canditate") || l.includes("c - 1") || l.includes("candidate - 1") || l.includes("candidate-1") || l.includes("c") || l.includes("b - 1") || l.includes("b-1") || l.includes("b") || l.includes("i") || l.includes("i - 1") || l.includes("i-1")));
  const hasInnerLoopStep = step3Scope.some((l) => /\b(?:step|next|advance|increment)\b/i.test(l) && (l.includes("1") || l.includes("+1") || l.includes("++") || l.includes("one")) || /\b[ij]\+\+/i.test(l));
  const hasInnerEndTargetingInputA = step3Scope.some((l) => /\b(?:end|stop)\b/i.test(l) && (/:\s*a\s*$/i.test(l) || /\b(?:end|stop)\s*:\s*a\b/i.test(l)) && !l.includes("b") && !l.includes("candidate") && !l.includes("i"));
  const hasDecomposedInnerLoop = hasInnerLoopStart && hasInnerLoopEnd && hasInnerLoopStep && !hasInnerEndTargetingInputA;
  const hasPrimeFlagOrCountInStep3 = hasStepLabels ? /\bisprime\b/i.test(step3Text) || /\bprimeflag\b/i.test(step3Text) || /\bflag\b/i.test(step3Text) || /\bcount\s*=\s*0\b/i.test(step3Text) || /\bcount\b/i.test(step3Text) || /\bdivisor\s*=\s*0\b/i.test(step3Text) || /\bdivisors\b/i.test(step3Text) || step3Text.includes("isprime = true") || step3Text.includes("isprime=true") || step3Text.includes("prime flag") || step3Text.includes("count = 0") || step3Text.includes("count=0") : /\bisprime\b/i.test(text) || /\bprimeflag\b/i.test(text) || /\bflag\b/i.test(text) || /\bcount\s*=\s*0\b/i.test(text) || /\bcount\b/i.test(text) || /\bdivisor\s*=\s*0\b/i.test(text) || /\bdivisors\b/i.test(text) || norm.includes("isprime = true") || norm.includes("isprime=true") || norm.includes("prime flag") || norm.includes("count = 0") || norm.includes("count=0");
  const hasMisplacedCountZero = /if\s*\([^)]*%\s*[^)]*==\s*0\)[^]*?count\s*=\s*0/i.test(text) || /when\s+remainder\s+is\s+0[^]*?count\s*=\s*0/i.test(text) || /action\s*:\s*count\s*=\s*0/i.test(step4Text) || step4Lines.length > 0 && step4Lines.some((l) => /\bcount\s*=\s*0\b/i.test(l)) || hasStepLabels && step5Lines.some((l) => /\bcount\s*=\s*0\b/i.test(l) && !l.includes("== 2") && !l.includes("==2") && !l.includes("=== 2") && !l.includes("== 0") && !l.includes("==0")) || /step\s*[45]\s*[:.-]?\s*count\s*=\s*0/i.test(text) && !/step\s*3\s*[:.-]?.*?count\s*=\s*0/i.test(text);
  const hasExplicitStep3 = /for\s*\(\s*(?:var|let|const)?\s*[ij]\s*=\s*1\s*;\s*[ij]\s*<=\s*(?:candidate|c|b|i)\b/i.test(text) || /for\s*\(\s*(?:var|let|const)?\s*[ij]\s*=\s*2\s*;\s*[ij]\s*<\s*(?:candidate|c|b|i)\b/i.test(text) || /for\s*\(\s*(?:var|let|const)?\s*[ij]\s*=\s*2\s*;\s*[ij]\s*<=\s*(?:candidate|c|b|i)\s*-\s*1\b/i.test(text) || hasDecomposedInnerLoop && hasPrimeFlagOrCountInStep3 && !hasMisplacedCountZero;
  const step3 = hasDecomposedInnerLoop && hasPrimeFlagOrCountInStep3 && !hasMisplacedCountZero || hasExplicitStep3;
  const hasCondLeft = (norm.includes("left side") || norm.includes("left") || norm.includes("l.s")) && (norm.includes("candidate % i") || norm.includes("c % i") || norm.includes("b % i") || norm.includes("b % j") || norm.includes("b%j") || norm.includes("candidate%i") || norm.includes("b%i") || norm.includes("%") || norm.includes("mod") || norm.includes("remainder") || norm.includes("i%j") || norm.includes("i % j") || norm.includes("i %") || norm.includes("b %"));
  const hasCondOp = (norm.includes("operator") || norm.includes("op")) && (norm.includes("==") || norm.includes("===") || norm.includes("=") || norm.includes("equals") || norm.includes("is"));
  const hasCondRight = (norm.includes("right side") || norm.includes("right") || norm.includes("r.s")) && (norm.includes("0") || norm.includes("zero"));
  const hasSingleEqualInOperator = /(?:operator|op)\s*:\s*=(?!=)/i.test(text) || /\boperator\s*=\s*(?:'='|"="|`=`|=)(?!=)/i.test(text);
  const hasDecomposedModulo = hasCondLeft && hasCondRight || hasCondLeft && hasCondOp;
  const hasSingleLineModulo = /candidate\s*%\s*[ij]\s*(?:===|==|=)\s*0/i.test(norm) || /c\s*%\s*[ij]\s*(?:===|==|=)\s*0/i.test(norm) || /b\s*%\s*[ij]\s*(?:===|==|=)\s*0/i.test(norm) || /i\s*%\s*j\s*(?:===|==|=)\s*0/i.test(norm) || /\bcandidate\s*%\s*[ij]\b/i.test(norm) || /\bb\s*%\s*[ij]\b/i.test(norm) || /\bi\s*%\s*j\b/i.test(norm) || norm.includes("%") && (norm.includes("== 0") || norm.includes("==0") || norm.includes("= 0") || norm.includes("is 0") || norm.includes("equals 0"));
  const hasModuloAction = !norm.includes("action: count = 0") && !norm.includes("action: count=0") && (norm.includes("count = count + 1") || norm.includes("count=count+1") || norm.includes("count++") || norm.includes("count + 1") || norm.includes("count+1") || norm.includes("count = count+1") || norm.includes("isprime = false") || norm.includes("isprime=false") || norm.includes("break") || norm.includes("not prime"));
  const step4 = !hasSingleEqualInOperator && !hasMisplacedCountZero && (hasDecomposedModulo && hasModuloAction || hasSingleLineModulo && hasModuloAction);
  const decisionText = norm;
  const hasPrintInputAInsteadOfCandidate = (/\bprint\s*\(\s*(?:a|n)\s*\)/i.test(decisionText) || /\bprint\s+(?:a|n)\b/i.test(decisionText) || /\bdisplay\s+(?:a|n)\b/i.test(decisionText)) && !/\bprint\s*\(\s*(?:b|i|candidate)\s*\)/i.test(decisionText);
  const hasPrintCandidate = decisionText.includes("print(candidate)") || decisionText.includes("print(b)") || decisionText.includes("print(i)") || decisionText.includes("print b") || decisionText.includes("print i") || decisionText.includes("output b") || decisionText.includes("display b");
  const hasBreak = decisionText.includes("break") || decisionText.includes("stop") || decisionText.includes("exit") || decisionText.includes("return");
  const hasStep5Condition = decisionText.includes("count == 2") || decisionText.includes("count === 2") || decisionText.includes("count=2") || decisionText.includes("count") && (decisionText.includes("2") || decisionText.includes("two")) || decisionText.includes("isprime");
  const step5 = !hasPrintInputAInsteadOfCandidate && hasStep5Condition && hasPrintCandidate && hasBreak;
  const stepProgress = [
    {
      stepNumber: 1,
      title: "Variables: a (or n) for input, b = a + 1 (or candidate = n + 1)",
      completed: step1,
      current: !step1
    },
    {
      stepNumber: 2,
      title: "Outer search: for loop (start: b, end: infinite / until prime found, next step: +1)",
      completed: step2,
      current: step1 && !step2
    },
    {
      stepNumber: 3,
      title: "Reset count = 0 & Inner prime check: for loop (start: 1, end: b, next step: +1)",
      completed: step3,
      current: step1 && step2 && !step3
    },
    {
      stepNumber: 4,
      title: "Condition: use if condition (left side: b % i, operator: ==, right side: 0, action: count = count + 1)",
      completed: step4,
      current: step1 && step2 && step3 && !step4
    },
    {
      stepNumber: 5,
      title: "Decision: if (count == 2) { print(b); break; }",
      completed: step5,
      current: step1 && step2 && step3 && step4 && !step5
    }
  ];
  if (step1 && step2 && step3 && step4 && step5) {
    return {
      isFullyVerified: true,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara here! Outstanding! \u{1F389} All 5 essential ingredients for the Next Prime Number algorithm are thoroughly identified:\n\u2022 Variables: input `a` and candidate `b = a + 1` \u2705\n\u2022 Outer search loop (start, end, next step): `for (b = a + 1; ; b++)` \u2705\n\u2022 Inner prime check loop with `count = 0` set right above it: `for (i = 1; i <= b; i++)` \u2705\n\u2022 Divisibility condition: `b % i == 0` with `action: count = count + 1` \u2705\n\u2022 Decision: `if (count == 2) { print(b); break; }` \u2705\n\nProceed to Stage 4: Taste the Sample!",
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: "step 5 : if (count == 2) { print(b); break; }"
    };
  }
  if (step1 && !step2) {
    let feedbackMsg2 = "\u{1F31F} Coach Maara here! You've identified using a **For Loop** for Step 2! In our ingredients structure, every loop must be decomposed into its 3 core parts:\n\u2022 **Start**: Where do we start testing candidate numbers? (e.g. `start: a + 1` or `start: n + 1`)\n\u2022 **End / Stop**: When do we stop searching? (e.g. `end: infinite / until prime found`)\n\u2022 **Next Step**: How do we advance to the next candidate? (e.g. `next step: +1`)\n\nPlease specify the **start**, **stop/end**, and **next step** for your loop!";
    if (hasFaultyOuterEnd) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! Look closely at your outer loop's **End**: You wrote `End: b`. If the outer search loop starts at `b` and ends at `b`, it will only run once for that single number and stop! But if `b` is not prime (for example, if input is 5, then b is 6, which is composite), our program must keep searching through 7, 8, 9... until it lands on the next prime! Therefore, the outer loop's end condition must be **infinite / until prime found**.";
    }
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: feedbackMsg2,
      correction: "Step 2: use for loop\n  start (b)\n  end (infinite / until prime found)\n  next step (+1)",
      suggestedInput: "Step 2: use for loop\n  start (b)\n  end (infinite / until prime found)\n  next step (+1)",
      matchedFirebaseInput: "step 1 : n for input number, candidate = n + 1"
    };
  }
  if (!step1) {
    const feedbackMsg2 = attemptCount >= 3 ? "\u{1F31F} Coach Maara here! For **Step 1 (Variables)**: We need an input variable (e.g. `a = 5` or `n = 5`) to store the given number, and a candidate variable initialized to the next consecutive number (e.g. `b = a + 1` or `candidate = n + 1`)." : "\u{1F31F} Coach Maara here! Let's start with Step 1 (Variables): What variable will store the user's input number, and what variable holds our starting candidate (e.g. `step 1: a=5`, `step 1.1: b=a+1`)?";
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: feedbackMsg2,
      correction: "Step 1: a = 5\nStep 1.1: b = a + 1",
      suggestedInput: "Step 1: a = 5\nStep 1.1: b = a + 1",
      matchedFirebaseInput: "what do I do here"
    };
  }
  if (hasMisplacedCountZero) {
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: "\u{1F31F} Coach Maara logic alert: Look at where you placed `count = 0`! You placed `count = 0` below or after the `if` condition (in Step 4/Step 5).\n\n\u2022 **Step 3 (Reset before loop)**: `count = 0` must be initialized in Step 3 BEFORE the inner loop begins (so each candidate starts fresh with 0 divisors).\n\u2022 **Step 4 (Inside if condition)**: Inside the inner loop, when a divisor is found (`b % j == 0`), the action must be **count = count + 1** (or `count++`) to count that divisor!\n\u2022 **Step 5 (Decision)**: After the inner loop finishes counting divisors, we check: **if (count == 2) { print(b); break; }**.",
      correction: "Step 3: count = 0, inner for loop (start: 1, end: b, next step: +1)\nStep 4: use if condition (left side: b % j, operator: ==, right side: 0, action: count = count + 1)\nStep 5: if (count == 2) { print(b); break; }",
      suggestedInput: "Step 3: count = 0\n  start (1)\n  end (b)\n  next step (+1)\nStep 4: use if condition\n  left side (b % j)\n  operator (==)\n  right side (0)\n  action: count = count + 1\nStep 5: use if condition\n  left side (count)\n  operator (==)\n  right side (2)\n  action: print(b); break;",
      matchedFirebaseInput: "step 4 : left side: b % j, operator: ==, right side: 0, action: count = count + 1"
    };
  }
  if (!step3) {
    let feedbackMsg2 = attemptCount >= 3 ? "\u{1F31F} Coach Maara here! Step 1 and Step 2 are completed!\n\nNow for **Step 3 (Inner Prime Check Loop)**: We can use the **Two Divisors Method**:\n1. Initialize `count = 0` (or `divisor = 0`)\n2. Decompose the inner loop for testing candidate `b`:\n\u2022 **Start**: `1`\n\u2022 **End**: `b` (the candidate number)\n\u2022 **Next Step**: `+1`" : "\u{1F31F} Coach Maara here! Step 1 and Step 2 look great!\n\nNow for **Step 3 (Prime Check Loop & Counter)**: We need to count the divisors of candidate `b`! Set `count = 0` and define your inner `for loop` with its 3 parts:\n\u2022 **Start**: `1`\n\u2022 **End**: `b` (testing candidate `b`, not `a`)\n\u2022 **Next Step**: `+1`";
    if (hasInnerEndTargetingInputA) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! Look closely at your inner loop's **End**: You wrote `End: a`. Remember, `a` is only the initial user input (e.g. 5), but we want to check if the candidate `b` (e.g. 6, 7...) is prime! So your inner loop must end at `End: b` (testing from 1 to b) so we can count divisors for `b`!";
    } else if (hasDecomposedInnerLoop && !hasPrimeFlagOrCountInStep3) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! Great work decomposing your inner loop (`Start: 1`, `End: b`, `Next Step: +1`)! Now, right above or with the inner loop in Step 3, make sure to initialize **`count = 0`** so each candidate number starts fresh with 0 divisors.";
    }
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: feedbackMsg2,
      correction: "Step 3: count = 0\nuse for loop\n  start (1)\n  end (b)\n  next step (+1)",
      suggestedInput: "Step 3: count = 0\nuse for loop\n  start (1)\n  end (b)\n  next step (+1)",
      matchedFirebaseInput: "step 2 : for loop (candidate = n + 1)"
    };
  }
  if (!step4) {
    let feedbackMsg2 = attemptCount >= 3 ? "\u{1F31F} Coach Maara here! Step 3 is complete! For **Step 4 (Divisibility Condition)**: When checking factors inside the inner loop:\n\u2022 **Left side (L.S)**: `b % j` (or `b % i`)\n\u2022 **Operator**: `==` (use `==` for comparison)\n\u2022 **Right side (R.S)**: `0`\n\u2022 **Action**: `count = count + 1` (or `count++`)" : "\u{1F31F} Coach Maara here! Step 3 is complete! Now for **Step 4 (Divisibility Condition)**: Inside the inner loop, specify the `if condition` to count divisors:\n\u2022 **Left side**: `b % j` (or `b % i`)\n\u2022 **Operator**: `==`\n\u2022 **Right side**: `0`\n\u2022 **Action**: `count = count + 1`";
    if (hasSingleEqualInOperator) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! Look closely at your **Operator**: You wrote single equal (`=`). Remember, `=` is for assignment, whereas `==` (double equals) is required for comparison in an `if condition`! Please update `operator: ==` and add the **Action**: `count = count + 1`!";
    } else if (hasCondLeft && hasCondRight && !hasCondOp && !hasModuloAction) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! Step 3 is completed! For **Step 4 (Divisibility Condition)**, you have `Left side: b % j` and `Right side: 0`! Now just add:\n\u2022 **Operator**: `==`\n\u2022 **Action**: `count = count + 1` (or `count++`) to count each factor!";
    } else if (hasDecomposedModulo && !hasModuloAction) {
      feedbackMsg2 = "\u{1F31F} Coach Maara here! You have defined the condition parts (Left side, Operator, Right side)! Now just add the **Action** to complete this step: What should happen to `count` when a divisor is found? Add `action: count = count + 1` (or `count++`)!";
    }
    return {
      isFullyVerified: false,
      stepProgress,
      feedback: feedbackMsg2,
      correction: "Step 4: use if condition\n  left side (b % j)\n  operator (==)\n  right side (0)\n  action: count = count + 1",
      suggestedInput: "Step 4: use if condition\n  left side (b % j)\n  operator (==)\n  right side (0)\n  action: count = count + 1",
      matchedFirebaseInput: "step 3 : count = 0, and for loop from i = 1 to i <= b"
    };
  }
  let feedbackMsg = attemptCount >= 3 ? "\u{1F31F} Coach Maara here! For **Step 5 (Decision)**: A prime number has **exactly 2 divisors** (1 and itself). After the inner loop finishes:\n\u2022 **Left side**: `count`\n\u2022 **Operator**: `==`\n\u2022 **Right side**: `2`\n\u2022 **Action**: `print(b); break;`" : "\u{1F31F} Coach Maara here! Step 4 is complete! Now for **Step 5 (Decision)**: After counting divisors in the inner loop, use an `if condition` on `count`: If `count == 2`, print candidate `b` and `break`! (Since `count = 0` is already placed right above the inner loop inside our outer loop, no else is needed!)";
  if (hasPrintInputAInsteadOfCandidate) {
    feedbackMsg = "\u{1F31F} Coach Maara here! Look at your print statement in Step 5: You wrote `print(a)`. Remember, `a` is the original user input (e.g., 5). The prime number we found is stored in candidate variable `b` (or `i`)! Please update it to `print(b)` and add `break;`!";
  } else if (!hasBreak) {
    feedbackMsg = "\u{1F31F} Coach Maara here! In **Step 5 (Decision)**, after printing the prime candidate `print(b)`, we must stop our search by adding **`break;`**!";
  }
  return {
    isFullyVerified: false,
    stepProgress,
    feedback: feedbackMsg,
    correction: "Step 5: use if condition\n  left side (count)\n  operator (==)\n  right side (2)\n  action: print(b); break;",
    suggestedInput: "Step 5: use if condition\n  left side (count)\n  operator (==)\n  right side (2)\n  action: print(b); break;",
    matchedFirebaseInput: "step 5 : if (count == 2) { print(b); break; }"
  };
}
function detectLanguage(text) {
  const norm = (text || "").toLowerCase();
  if (norm.includes("def ") || norm.includes("range(") || norm.includes("in range") || norm.includes("elif ") || /\b(?:True|False|None)\b/.test(text) || (norm.includes("while true:") || norm.includes("while 1:") || norm.includes("if ") && text.includes(":") && !text.includes(";")) || norm.includes("print(") && !text.includes(";") && !text.includes("{")) {
    return "python";
  }
  if (norm.includes("system.out.print") || norm.includes("public class") || norm.includes("public static void main") || norm.includes("boolean isprime") || norm.includes("boolean ")) {
    return "java";
  }
  if (norm.includes("cout") || norm.includes("cin") || norm.includes("#include <iostream>") || norm.includes("std::")) {
    return "cpp";
  }
  if (norm.includes("printf(") || norm.includes("#include <stdio.h>") || norm.includes("#include")) {
    return "c";
  }
  if (norm.includes("console.log") || norm.includes("var ") || norm.includes("let ") || norm.includes("const ") || norm.includes("===") || norm.includes("function")) {
    return "javascript";
  }
  return "generic";
}
function validateNextPrimeSampleCode(text, attemptCount = 1) {
  const norm = (text || "").toLowerCase();
  const lang = detectLanguage(text);
  const hasInput = /(?:(?:var|let|const|int|float|double|auto)\s+)?(?:n|a|num|number|val|input)\s*=\s*(?:\d+|int\s*\(|scan|cin|\w+)/i.test(text) || /\b(?:n|a|num|number)\s*=\s*\d+/i.test(text);
  const inputVar = /\ba\s*=\s*/i.test(text) ? "a" : /\bnum\s*=\s*/i.test(text) ? "num" : "n";
  const candidateVar = /\bb\s*=\s*/i.test(text) ? "b" : /\bc\s*=\s*/i.test(text) ? "c" : /\bnext_prime\b/i.test(text) ? "next_prime" : "candidate";
  const hasCandidateInit = new RegExp(`${candidateVar}\\s*=\\s*${inputVar}\\s*\\+\\s*1`, "i").test(text) || new RegExp(`${candidateVar}\\s*=\\s*\\d+`, "i").test(text) || /\b(?:candidate|b|c|next_prime)\s*=\s*(?:n|a|num)\s*\+\s*1/i.test(text) || /for\s*\([^;]*\b(?:candidate|b|c|next_prime)\s*=\s*(?:n|a|num)\s*\+\s*1/i.test(text) || /for\s+\w+\s+in\s+range\s*\(\s*(?:n|a|num)\s*\+\s*1/i.test(text);
  const hasOuterForLoop = /for\s*\([^;]*\b(?:candidate|b|c|next_prime)\s*=\s*[^;]*;[^;]*;\s*(?:candidate|b|c|next_prime)\s*(?:\+\+|\+=\s*1)\)/i.test(text) || /for\s*\([^;]*\b(?:candidate|b|c|next_prime)\s*=\s*[^;]*;[^;]*\)/i.test(text) || /for\s*\([^;]*\b(?:candidate|b|c|next_prime)\s*=\s*[^;]*;/i.test(text) || /for\s*\([^;]*;[^;]*;\s*(?:candidate|b|c|next_prime)\s*(?:\+\+|\+=\s*1)\)/i.test(text) || /for\s*\(\s*;\s*;\s*\)/i.test(text) || /for\s+(?:candidate|b|c|next_prime)\s+in\s+range\s*\(\s*(?:n|a|num)\s*\+\s*1/i.test(text);
  const hasOuterWhileLoop = /\bwhile\s*\(?\s*(?:true|1|!\s*found|found\s*==\s*false|candidate|c)\s*\)?/i.test(text) || /\bwhile\s+True\s*:/i.test(text);
  const hasOuterLoop = hasOuterForLoop || hasOuterWhileLoop;
  const hasInnerLoop = /for\s*\([^)]*\b(?:i|d|divisor|j)\s*=\s*1/i.test(text) || /for\s*\([^)]*\b(?:i|d|divisor|j)\s*=\s*2/i.test(text) || /for\s+\w+\s+in\s+range\s*\(\s*[12]\s*,/i.test(text) || /while\s*\(?\s*(?:i|d|divisor|j)\s*<=\s*(?:candidate|b|c)\b/i.test(text) || /while\s*\(?\s*(?:i|d|divisor|j)\s*<\s*(?:candidate|b|c)\b/i.test(text) || norm.split("for").length >= 3;
  const hasModuloCondition = /%\s*(?:i|d|divisor|j)\s*(?:==|===|=)\s*0/i.test(text) || new RegExp(`${candidateVar}\\s*%\\s*(?:i|d|divisor|j)`, "i").test(text) || /\b(?:candidate|b|c)\s*%\s*(?:i|d|divisor|j)/i.test(text) || /\bi\s*%\s*j\s*(?:==|===|=)\s*0/i.test(text);
  const hasModuloAction = /\bcount\s*\+\+/i.test(text) || /\bcount\s*=\s*count\s*\+\s*1/i.test(text) || /\bcount\s*\+=\s*1/i.test(text) || /\bis_?prime\s*=\s*(?:false|0|False)/i.test(text) || /\bflag\s*=\s*(?:false|0|1)/i.test(text);
  const hasFlagOrCount = /\bis_?prime\b/i.test(text) || /\bcount\b/i.test(text) || /\bflag\b/i.test(text) || /\bfound\b/i.test(text);
  const usesCountMethod = /\bcount\b/i.test(text) || /\bdivisor\b/i.test(text);
  const hasPrint = /\bprint\s*\(\s*(?:candidate|b|c|next_prime|i)\s*\)/i.test(text) || /\bconsole\.log\s*\(\s*(?:candidate|b|c|next_prime|i)\s*\)/i.test(text) || /\bprintf\s*\(\s*["'][^"']*%d[^"']*["']\s*,\s*(?:candidate|b|c|next_prime|i)\s*\)/i.test(text) || /\bSystem\.out\.print(?:ln)?\s*\(\s*(?:candidate|b|c|next_prime|i)\s*\)/i.test(text) || /\bcout\s*<<\s*(?:candidate|b|c|next_prime|i)/i.test(text);
  const hasBreak = /\bbreak\b/i.test(text) || /\breturn\b/i.test(text);
  const hasIncrement = hasOuterForLoop || new RegExp(`(?:${candidateVar}|candidate|b|c)\\s*(?:\\+\\+|\\+=\\s*1|=\\s*(?:${candidateVar}|candidate|b|c)\\s*\\+\\s*1)`, "i").test(text);
  const hasStartAtNBug = (new RegExp(`(?:(?:var|let|const|int|auto)\\s+)?${candidateVar}\\s*=\\s*${inputVar}\\s*(?:;|
|$)`, "i").test(text) || /for\s*\([^;]*\b(?:candidate|b|c)\s*=\s*(?:n|a)\s*;/i.test(text) || /for\s+(?:candidate|b|c)\s+in\s+range\s*\(\s*(?:n|a)\s*,/i.test(text)) && !new RegExp(`\\+\\s*1`, "i").test(text);
  const hasFlagResetBug = /\bis_?prime\s*=\s*(?:true|1|True)/i.test(text) && (norm.indexOf("is") < norm.indexOf("for") || norm.includes("while") && norm.indexOf("is") < norm.indexOf("while")) && !norm.slice(norm.indexOf("for") + 3).includes("isprime = true") && !norm.slice(norm.indexOf("for") + 3).includes("is_prime = true") && !norm.slice(norm.indexOf("for") + 3).includes("is_prime = True") && !norm.slice(norm.indexOf("for") + 3).includes("isprime = 1") && !norm.slice(norm.indexOf("for") + 3).includes("let isprime") && !norm.slice(norm.indexOf("for") + 3).includes("var isprime") && !norm.slice(norm.indexOf("for") + 3).includes("boolean isprime") || /\bcount\s*=\s*0/i.test(text) && (norm.indexOf("count") < norm.indexOf("for") || norm.includes("while") && norm.indexOf("count") < norm.indexOf("while")) && !norm.slice(norm.indexOf("for") + 3).includes("count = 0") && !norm.slice(norm.indexOf("for") + 3).includes("count=0");
  const hasInfiniteLoopAfterPrintBug = hasOuterLoop && hasPrint && !hasBreak;
  const hasInnerLoopZeroBug = /\bfor\s*\(\s*(?:var|let|const|int)?\s*(?:i|d|j)\s*=\s*0\b/i.test(text) || /\bfor\s+\w+\s+in\s+range\s*\(\s*0\s*,/i.test(text);
  const hasInnerLoopOneBug = !usesCountMethod && (/\bfor\s*\(\s*(?:var|let|const|int)?\s*(?:i|d)\s*=\s*1\s*;/i.test(text) || /\bfor\s+\w+\s+in\s+range\s*\(\s*1\s*,/i.test(text)) && hasFlagOrCount;
  const hasInnerLoopBoundaryBug = !usesCountMethod && (/\bfor\s*\(\s*(?:var|let|const|int)?\s*(?:i|d)\s*=\s*2\s*;\s*(?:i|d)\s*<=\s*(?:candidate|b|c)\b/i.test(text) || /\bfor\s+\w+\s+in\s+range\s*\(\s*2\s*,\s*(?:candidate|b|c)\s*\+\s*1\s*\)/i.test(text)) && hasFlagOrCount;
  const hasDivisionBug = /if\s*\(?\s*(?:candidate|c)\s*\/\s*(?:i|d)\s*(?:==|=)\s*0\s*\)?/i.test(text);
  const hasSingleEqualBug = /if\s*\(?\s*(?:candidate|c)\s*%\s*(?:i|d)\s*=\s*0\s*\)?/i.test(text) && !/==/.test(text);
  const hasMissingIncrementBug = hasOuterWhileLoop && !hasIncrement;
  const step1Complete = hasInput && hasCandidateInit && !hasStartAtNBug;
  const step2Complete = step1Complete && hasOuterLoop;
  const step3Complete = step2Complete && hasInnerLoop && hasModuloCondition && hasModuloAction && !hasInnerLoopZeroBug && !hasInnerLoopOneBug && !hasInnerLoopBoundaryBug;
  const step4Complete = step3Complete && hasPrint && hasBreak && hasIncrement && !hasInfiniteLoopAfterPrintBug && !hasFlagResetBug;
  const sampleCodeStepProgress = [
    {
      stepNumber: 1,
      title: "Input & Candidate initialization (n = 7, candidate = n + 1)",
      completed: step1Complete,
      current: !step1Complete
    },
    {
      stepNumber: 2,
      title: "Outer search for loop",
      completed: step2Complete,
      current: step1Complete && !step2Complete
    },
    {
      stepNumber: 3,
      title: "Inner primality check for loop & divisor condition",
      completed: step3Complete,
      current: step2Complete && !step3Complete
    },
    {
      stepNumber: 4,
      title: "Display next prime & break",
      completed: step4Complete,
      current: step3Complete && !step4Complete
    }
  ];
  const getLanguageSyntaxPattern = (step) => {
    if (lang === "python") {
      switch (step) {
        case "step1":
          return `# Syntax Pattern Example:
input_var = 7
candidate_var = input_var + 1`;
        case "step2":
          return `# Syntax Pattern Example:
for candidate in range(start_number, max_limit):
    # primality check inside`;
        case "step3":
          return `# Syntax Pattern Example:
is_prime = True
for i in range(start_divisor, candidate):
    if candidate % i == 0:
        is_prime = False
        break`;
        case "step4":
          return `# Syntax Pattern Example:
if is_prime:
    print(candidate)
    break`;
      }
    } else if (lang === "c" || lang === "cpp") {
      const printExample = lang === "cpp" ? `std::cout << candidate << std::endl;` : `printf("%d\\n", candidate);`;
      switch (step) {
        case "step1":
          return `// Syntax Pattern Example:
int input_var = 7;
int candidate_var = input_var + 1;`;
        case "step2":
          return `// Syntax Pattern Example:
for (int candidate = start_number; ; candidate++) {
    // primality check inside
}`;
        case "step3":
          return `// Syntax Pattern Example:
int isPrime = 1;
for (int i = start_divisor; i < candidate; i++) {
    if (candidate % i == 0) {
        isPrime = 0;
        break;
    }
}`;
        case "step4":
          return `// Syntax Pattern Example:
if (isPrime) {
    ${printExample}
    break;
}`;
      }
    } else if (lang === "java") {
      switch (step) {
        case "step1":
          return `// Syntax Pattern Example:
int input_var = 7;
int candidate_var = input_var + 1;`;
        case "step2":
          return `// Syntax Pattern Example:
for (int candidate = start_number; ; candidate++) {
    // primality check inside
}`;
        case "step3":
          return `// Syntax Pattern Example:
boolean isPrime = true;
for (int i = start_divisor; i < candidate; i++) {
    if (candidate % i == 0) {
        isPrime = false;
        break;
    }
}`;
        case "step4":
          return `// Syntax Pattern Example:
if (isPrime) {
    System.out.println(candidate);
    break;
}`;
      }
    } else {
      switch (step) {
        case "step1":
          return `// Syntax Pattern Example:
let a = 5;
let b = a + 1;`;
        case "step2":
          return `// Syntax Pattern Example:
for (let b = a + 1; ; b++) {
  // primality check inside
}`;
        case "step3":
          return `// Syntax Pattern Example (Two Divisors Count Method):
let count = 0;
for (let i = 1; i <= b; i++) {
  if (b % i === 0) {
    count++;
  }
}`;
        case "step4":
          return `// Syntax Pattern Example:
if (count === 2) {
  console.log(b);
  break;
}`;
      }
    }
  };
  const getLanguageSnippet = (snippetType) => {
    if (lang === "python") {
      switch (snippetType) {
        case "step1":
          return `a = 5
b = a + 1`;
        case "step2":
          return `for b in range(a + 1, a + 100):
    pass`;
        case "step3":
          return `    count = 0
    for i in range(1, b + 1):
        if b % i == 0:
            count += 1`;
        case "step4":
          return `    if count == 2:
        print(b)
        break`;
        case "full":
          return `a = 5

for b in range(a + 1, a + 100):
    count = 0
    for i in range(1, b + 1):
        if b % i == 0:
            count += 1
    if count == 2:
        print(b)
        break`;
      }
    } else if (lang === "c" || lang === "cpp") {
      const printStmt = lang === "cpp" ? `std::cout << b << std::endl;` : `printf("%d\\n", b);`;
      switch (snippetType) {
        case "step1":
          return `int a = 5;
int b = a + 1;`;
        case "step2":
          return `for (int b = a + 1; ; b++) {
    
}`;
        case "step3":
          return `    int count = 0;
    for (int i = 1; i <= b; i++) {
        if (b % i == 0) {
            count++;
        }
    }`;
        case "step4":
          return `    if (count == 2) {
        ${printStmt}
        break;
    }`;
        case "full":
          return `int a = 5;

for (int b = a + 1; ; b++) {
    int count = 0;
    for (int i = 1; i <= b; i++) {
        if (b % i == 0) {
            count++;
        }
    }
    if (count == 2) {
        ${printStmt}
        break;
    }
}`;
      }
    } else if (lang === "java") {
      switch (snippetType) {
        case "step1":
          return `int a = 5;
int b = a + 1;`;
        case "step2":
          return `for (int b = a + 1; ; b++) {
    
}`;
        case "step3":
          return `    int count = 0;
    for (int i = 1; i <= b; i++) {
        if (b % i == 0) {
            count++;
        }
    }`;
        case "step4":
          return `    if (count == 2) {
        System.out.println(b);
        break;
    }`;
        case "full":
          return `int a = 5;

for (int b = a + 1; ; b++) {
    int count = 0;
    for (int i = 1; i <= b; i++) {
        if (b % i == 0) {
            count++;
        }
    }
    if (count == 2) {
        System.out.println(b);
        break;
    }
}`;
      }
    } else {
      switch (snippetType) {
        case "step1":
          return `let a = 5;
let b = a + 1;`;
        case "step2":
          return `for (let b = a + 1; ; b++) {
  
}`;
        case "step3":
          return `  let count = 0;
  for (let i = 1; i <= b; i++) {
    if (b % i === 0) {
      count++;
    }
  }`;
        case "step4":
          return `  if (count === 2) {
    console.log(b);
    break;
  }`;
        case "full":
          return `let a = 5;

for (let b = a + 1; ; b++) {
  let count = 0;
  for (let i = 1; i <= b; i++) {
    if (b % i === 0) {
      count++;
    }
  }
  if (count === 2) {
    console.log(b);
    break;
  }
}`;
      }
    }
  };
  if (step4Complete) {
    const langLabel2 = lang === "python" ? "Python" : lang === "java" ? "Java" : lang === "cpp" ? "C++" : lang === "c" ? "C" : "JavaScript";
    return {
      allVerified: true,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara here! You gotcha! \u{1F389} You have successfully implemented the complete Next Prime Number program in ${langLabel2} with candidate initialization (\`candidate = n + 1\`), outer search \`for\` loop, inner primality check \`for\` loop with flag resetting, clean output display, and break termination! That completes the Next Prime Number journey! Let's code!`,
      correction: void 0,
      suggestedInput: void 0,
      matchedFirebaseInput: getLanguageSnippet("full"),
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasStartAtNBug) {
    const fixCode = lang === "python" ? `candidate in range(${inputVar} + 1, ${inputVar} + 100)` : `candidate = ${inputVar} + 1`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: Look at your candidate initialization! If you start candidate at \`${inputVar}\`, when \`${inputVar} = 7\`, 7 will immediately be returned as prime instead of the NEXT prime (11)! Start your \`for\` loop candidate at \`${inputVar} + 1\` (\`${fixCode}\`).`,
      correction: `Step 1: Start candidate from ${inputVar} + 1: ${fixCode}`,
      suggestedInput: getLanguageSnippet("step1"),
      matchedFirebaseInput: "var n = 7;\nvar candidate = n;\nfor (var candidate = n; ; candidate++)",
      hasInput,
      hasCandidate: false,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasFlagResetBug) {
    const flagResetCode = lang === "python" ? `is_prime = True` : lang === "java" ? `boolean isPrime = true;` : lang === "c" ? `int isPrime = 1;` : `let isPrime = true;`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara bug alert: Your primality flag is initialized outside the outer \`for\` loop! \u{1F50D} Once a non-prime candidate (like 8) sets it to false, it will stay false forever and never find 11! Reset \`${flagResetCode}\` INSIDE the outer \`for\` loop at the start of each candidate iteration.`,
      correction: `Step 3: Reset isPrime inside outer for loop for each new candidate: ${flagResetCode}`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "var n = 7;\nvar isPrime = true;\nfor (var candidate = n + 1; ; candidate++) { ... }",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasInfiniteLoopAfterPrintBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara loop alert: In your search loop, after finding and printing the prime, there is no \`break\` statement! Without \`break\`, the loop will keep searching and printing every subsequent prime number. Add \`break\` right after printing!`,
      correction: `Step 4: Add break statement after printing candidate.`,
      suggestedInput: getLanguageSnippet("step4"),
      matchedFirebaseInput: "if (isPrime) print(candidate);",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak: false,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasInnerLoopZeroBug) {
    const startCode = lang === "python" ? `range(2, ${candidateVar})` : `i = 2`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: In your inner \`for\` loop, \`i\` starts at 0. Calculating \`${candidateVar} % 0\` causes a Division by Zero error! Change inner loop start to \`${startCode}\`.`,
      correction: `Step 3: Start inner for loop from 2: ${startCode}`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "for (var i = 0; i < candidate; i++)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop: false,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasInnerLoopOneBug) {
    const startCode = lang === "python" ? `range(2, ${candidateVar})` : `i = 2`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara logic alert: In your inner \`for\` loop, starting at \`i = 1\` means \`${candidateVar} % 1 == 0\` is always true for EVERY number! This marks every number as non-prime. Start your divisor test from \`${startCode}\`.`,
      correction: `Step 3: Start inner for loop at 2: ${startCode}`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "for (var i = 1; i < candidate; i++)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop: false,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasInnerLoopBoundaryBug) {
    const boundCode = lang === "python" ? `range(2, ${candidateVar})` : `i < ${candidateVar}`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara boundary alert: In your inner \`for\` loop condition, testing \`${candidateVar} % ${candidateVar} == 0\` is always true for itself! This incorrectly flags prime numbers as composite. Change inner loop boundary to strictly less than candidate (\`${boundCode}\`).`,
      correction: `Step 3: Change inner loop condition to strictly less than candidate: ${boundCode}`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "for (var i = 2; i <= candidate; i++)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop: false,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasDivisionBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: You used division operator \`/\` in \`${candidateVar} / i == 0\`. Division gives quotient. To check divisibility, use the modulo remainder operator \`%\` (\`${candidateVar} % i == 0\`)!`,
      correction: `Step 3: Use % operator: ${candidateVar} % i == 0`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "if (candidate / i == 0)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition: false,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasSingleEqualBug) {
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara syntax alert: In your condition, you wrote a single \`=\`. Single \`=\` is for assignment. Use equality comparison operator \`==\` (\`${candidateVar} % i == 0\`)!`,
      correction: `Step 3: Use == operator: ${candidateVar} % i == 0`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "if (candidate % i = 0)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition: false,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (hasMissingIncrementBug) {
    const incCode = lang === "python" ? `${candidateVar} += 1` : `${candidateVar}++;`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: `\u{1F31F} Coach Maara loop alert: In your search loop, if a candidate is not prime, you must increment it by 1 (\`${incCode}\`) to test the next number! (Or simply use an outer \`for\` loop \`for (let candidate = n + 1; ; candidate++)\` which increments automatically).`,
      correction: `Step 2/4: Use outer for loop with candidate++: ${getLanguageSnippet("step2").replace(/\n/g, " ")}`,
      suggestedInput: getLanguageSnippet("step2"),
      matchedFirebaseInput: "missing candidate++",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement: false,
      detectedLang: lang
    };
  }
  const langLabel = lang === "python" ? "Python" : lang === "java" ? "Java" : lang === "cpp" ? "C++" : lang === "c" ? "C" : "JavaScript";
  const langTag = lang === "python" ? "python" : lang === "c" || lang === "cpp" || lang === "java" ? "c" : "javascript";
  if (!hasInput || !hasCandidateInit) {
    const hintText2 = attemptCount >= 3 ? `\u{1F31F} Coach Maara here! For **Step 1 (Input & Candidate)** in ${langLabel}:
\`\`\`${langTag}
${getLanguageSnippet("step1")}
\`\`\`
Try adding these variable initializations to start!` : `\u{1F31F} Coach Maara here! Welcome to Taste the Sample for Next Prime Number! Let's build our code step-by-step using \`for\` loops.

Here is the syntax structure pattern to guide you:
\`\`\`${langTag}
${getLanguageSyntaxPattern("step1")}
\`\`\`
\u{1F449} **Your Turn**: Declare your input number (\`n = 7\`) and initialize candidate starting at the next number (\`candidate = n + 1\`) using this structure!`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: hintText2,
      correction: `Step 1: Declare input variable and candidate = n + 1: ${getLanguageSnippet("step1").replace(/\n/g, " ")}`,
      suggestedInput: getLanguageSnippet("step1"),
      matchedFirebaseInput: "Do I need to write the code here",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (!hasOuterLoop) {
    const hintText2 = attemptCount >= 3 ? `\u{1F31F} Coach Maara here! For **Step 2 (Outer Search Loop)** in ${langLabel}:
Create an outer \`for\` loop that starts from \`n + 1\` and increments \`candidate\` continuously:
\`\`\`${langTag}
${getLanguageSnippet("step2")}
\`\`\`` : `\u{1F31F} Coach Maara here! Great start with \`${inputVar}\`! Now for **Step 2 (Outer Search Loop)**.
We need an outer \`for\` loop to test candidates one by one starting from \`n + 1\`.

Here is the syntax structure pattern:
\`\`\`${langTag}
${getLanguageSyntaxPattern("step2")}
\`\`\`
\u{1F449} **Your Turn**: Write the outer \`for\` loop that increments \`candidate\` starting from \`n + 1\`!`;
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: hintText2,
      correction: `Step 2: Add outer for search loop: ${getLanguageSnippet("step2").replace(/\n/g, " ")}`,
      suggestedInput: getLanguageSnippet("step2"),
      matchedFirebaseInput: "step 2 : for loop (for candidate = n + 1)",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop: false,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  if (!hasInnerLoop || !hasModuloCondition || !hasModuloAction) {
    let hintText2 = attemptCount >= 3 ? `\u{1F31F} Coach Maara here! For **Step 3 (Inner Primality Check)** in ${langLabel}:
Inside your outer \`for\` loop, reset \`count = 0\` and count divisors from 1 to \`b\`:
\`\`\`${langTag}
${getLanguageSnippet("step3")}
\`\`\`` : `\u{1F31F} Coach Maara here! Outer loop is set up! Now for **Step 3 (Inner Primality Check)**.
Inside your outer \`for\` loop, reset \`count = 0\` and test divisors from 1 up to \`b\`.

Here is the syntax structure pattern:
\`\`\`${langTag}
${getLanguageSyntaxPattern("step3")}
\`\`\`
\u{1F449} **Your Turn**: Inside your outer loop, initialize \`count = 0\` and add the inner divisor \`for\` loop with modulo check (\`b % i === 0\`) and action (\`count++\`)!`;
    if (hasInnerLoop && hasModuloCondition && !hasModuloAction) {
      hintText2 = `\u{1F31F} Coach Maara here! You wrote the condition \`if (b % i == 0)\`! Now add the action inside: when a divisor is found, increment the divisor counter by writing \`count++\` (or \`count = count + 1\`)!`;
    }
    return {
      allVerified: false,
      sampleCodeStepProgress,
      feedback: hintText2,
      correction: `Step 3: Reset count = 0 and add inner for loop (1 to b) with count++: ${getLanguageSnippet("step3").replace(/\n/g, " ")}`,
      suggestedInput: getLanguageSnippet("step3"),
      matchedFirebaseInput: "step 3 : count = 0, and for loop from i = 1 to i <= b",
      hasInput,
      hasCandidate: hasCandidateInit,
      hasOuterLoop,
      hasInnerLoop,
      hasModuloCondition,
      hasFlagOrCount,
      hasPrint,
      hasBreak,
      hasIncrement,
      detectedLang: lang
    };
  }
  const hintText = attemptCount >= 3 ? `\u{1F31F} Coach Maara here! For **Step 4 (Decision & Print)** in ${langLabel}:
After the inner \`for\` loop finishes:
\`\`\`${langTag}
${getLanguageSnippet("step4")}
\`\`\`` : `\u{1F31F} Coach Maara here! Almost finished! Now for **Step 4 (Decision & Print)**.
After the inner \`for\` loop finishes counting divisors, if \`count === 2\`, print candidate \`b\` and break out of the search!

Here is the syntax structure pattern:
\`\`\`${langTag}
${getLanguageSyntaxPattern("step4")}
\`\`\`
\u{1F449} **Your Turn**: Add the \`if (count === 2)\` condition to print \`b\` and \`break\`!`;
  return {
    allVerified: false,
    sampleCodeStepProgress,
    feedback: hintText,
    correction: `Step 4: If count == 2, print b and break: ${getLanguageSnippet("step4").replace(/\n/g, " ")}`,
    suggestedInput: getLanguageSnippet("step4"),
    matchedFirebaseInput: "step 4 : if (count == 2) { print(b); break; }",
    hasInput,
    hasCandidate: hasCandidateInit,
    hasOuterLoop,
    hasInnerLoop,
    hasModuloCondition,
    hasFlagOrCount,
    hasPrint,
    hasBreak,
    hasIncrement,
    detectedLang: lang
  };
}
export {
  detectLanguage,
  detectRecipeCodeKeywords,
  validateNextPrimeIngredients,
  validateNextPrimeLogic,
  validateNextPrimeRecipe,
  validateNextPrimeSampleCode
};
