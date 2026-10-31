// Universal Cross-Problem Detector
// Detects if user input belongs to a different problem than the active one

import { detectProblemType } from "./problemTypes.js";

export const PROBLEM_DEFINITIONS = {
  "odd-even": {
    id: "odd-even",
    problemNo: 1,
    title: "Odd or Even Checker",
    patterns: [
      /\b(even|odd)\b/i,
      /even\s*number/i,
      /odd\s*number/i,
      /%\s*2\b/,
      /divisible\s+by\s+2\b/i,
      /parity/i
    ],
    goalSummary: "checking if a single number is evenly divisible by 2 (n % 2 == 0)"
  },
  "sum-natural-numbers": {
    id: "sum-natural-numbers",
    problemNo: 2,
    title: "Sum of N Natural Numbers",
    patterns: [
      /natural\s*numbers?/i,
      /sum\s*of\s*(?:the\s*)?(?:first\s*)?n/i,
      /accumulator/i,
      /sum\s*\+=\s*[a-zA-Z_]\w*/i,
      /sum\s*=\s*sum\s*\+\s*[a-zA-Z_]\w*/i,
      /\b1\s*\+\s*2\s*\+\s*3\b/
    ],
    goalSummary: "accumulating the sequential sum of counting numbers from 1 up to n"
  },
  "factorial": {
    id: "factorial",
    problemNo: 3,
    title: "Factorial of a Number",
    patterns: [
      /\bfactorial\b/i,
      /\bn!\b/i,
      /fact\s*\*=/i,
      /fact\s*=\s*fact\s*\*/i,
      /product\s*of\s*(?:the\s*)?(?:first\s*)?n/i,
      /\b1\s*\*\s*2\s*\*\s*3\b/
    ],
    goalSummary: "calculating n! = 1 * 2 * ... * n by multiplying numbers from 1 to n into an accumulator"
  },
  "divisor-of-a-number": {
    id: "divisor-of-a-number",
    problemNo: 4,
    title: "Divisors of a Number",
    patterns: [
      /\bdivisors?\b/i,
      /\bfactors?\b/i,
      /divides?\s*completely/i,
      /divisible\s*completely/i,
      /test\s*(?:every|each)\s*number\s*from\s*1/i,
      /n\s*%\s*i\s*={1,3}\s*0/i
    ],
    goalSummary: "testing all numbers from 1 up to n to find every divisor where n % i == 0"
  },
  "multiplication-table": {
    id: "multiplication-table",
    problemNo: 5,
    title: "Multiplication Table",
    patterns: [
      /multiplication\s*table/i,
      /times\s*table/i,
      /\b[a-zA-Z_]\w*\s*\*\s*i\b/i,
      /\b[a-zA-Z_0-9]+\s+\bx\b\s+[a-zA-Z_0-9]+\b/i,
      /\b\d+\s*[*x]\s*i\b/i
    ],
    goalSummary: "generating consecutive products from 1 to 10 (n * 1, n * 2 ... n * 10)"
  },
  "prime-number": {
    id: "prime-number",
    problemNo: 6,
    title: "Prime Number Checker",
    patterns: [
      /\bprime\s*(?:number)?\b/i,
      /\bnot\s*prime\b/i,
      /exactly\s*2\s*(?:distinct\s*)?divisors/i,
      /no\s*positive\s*divisors?\s*other\s*than\s*1/i
    ],
    goalSummary: "checking if a number greater than 1 has exactly 2 distinct divisors (1 and itself)"
  },
  "next-prime-number": {
    id: "next-prime-number",
    problemNo: 7,
    title: "Next Prime Number",
    patterns: [
      /next\s*prime/i,
      /smallest\s*prime\s*greater/i,
      /prime\s*strictly\s*greater/i
    ],
    goalSummary: "finding the smallest prime number strictly greater than a given integer n"
  },
  "prime-between-range": {
    id: "prime-between-range",
    problemNo: 8,
    title: "Prime Numbers in a Range",
    patterns: [
      /prime.*range/i,
      /primes?\s*between/i,
      /start.*end.*prime/i
    ],
    goalSummary: "finding and displaying all prime numbers between a start range and an end range"
  },
  "sexy-prime-number": {
    id: "sexy-prime-number",
    problemNo: 9,
    title: "Sexy Prime Pairs",
    patterns: [
      /sexy\s*prime/i,
      /differ\s*by\s*6/i,
      /p\s*,\s*p\s*\+\s*6/i
    ],
    goalSummary: "checking if two prime numbers differ by six (p, p+6)"
  },
  "positive-negative": {
    id: "positive-negative",
    problemNo: 10,
    title: "Positive, Negative, or Zero",
    patterns: [
      /\bpositive\b.*\bnegative\b/i,
      /\bnegative\b.*\bpositive\b/i,
      />\s*0.*<\s*0/i
    ],
    goalSummary: "classifying a number as Positive (>0), Negative (<0), or Zero (==0)"
  },
  "three-digit-number": {
    id: "three-digit-number",
    problemNo: 11,
    title: "3-Digit Number Checker",
    patterns: [
      /3[\s-]digit/i,
      /three[\s-]digit/i,
      />=\s*100.*<=\s*999/i
    ],
    goalSummary: "checking if a number is between 100 and 999 inclusive"
  },
  "voting-eligibility": {
    id: "voting-eligibility",
    problemNo: 12,
    title: "Voting Eligibility",
    patterns: [
      /\b(?:voting|eligible\s*to\s*vote)\b/i,
      /\b(?:not\s*eligible|eligible)\b/i,
      /age\s*>=\s*18/i
    ],
    goalSummary: "checking if age is greater than or equal to 18 to vote"
  },
  "pass-or-fail": {
    id: "pass-or-fail",
    problemNo: 13,
    title: "Pass or Fail",
    patterns: [
      /\bpass\b.*\bfail\b/i,
      /\bfail\b.*\bpass\b/i,
      /mark\s*>=\s*35/i
    ],
    goalSummary: "checking if marks >= 35 to classify student as Pass or Fail"
  },
  "greater-than-100": {
    id: "greater-than-100",
    problemNo: 14,
    title: "Greater than 100",
    patterns: [
      /greater\s*than\s*100/i,
      /[a-zA-Z_]\w*\s*>\s*100\b/i
    ],
    goalSummary: "checking if an entered number is strictly greater than 100"
  },
  "profit-or-loss": {
    id: "profit-or-loss",
    problemNo: 15,
    title: "Profit or Loss",
    patterns: [
      /\bprofit\b.*\bloss\b/i,
      /\bloss\b.*\bprofit\b/i,
      /selling\s*price/i,
      /cost\s*price/i,
      /\bsp\s*>\s*cp\b/i
    ],
    goalSummary: "calculating whether Selling Price (SP) is greater than Cost Price (CP)"
  },
  "leap-year": {
    id: "leap-year",
    problemNo: 16,
    title: "Leap Year Checker",
    patterns: [
      /leap\s*year/i,
      /%\s*400/i,
      /%\s*100.*%\s*4/i
    ],
    goalSummary: "determining if a year is divisible by 4, not 100 unless divisible by 400"
  },
  "adult-or-minor": {
    id: "adult-or-minor",
    problemNo: 17,
    title: "Adult or Minor",
    patterns: [
      /\badult\b.*\bminor\b/i,
      /\bminor\b.*\badult\b/i,
      /age\s*>=\s*18.*adult/i
    ],
    goalSummary: "classifying a person as Adult (age >= 18) or Minor (age < 18)"
  },
  "divisible-by-5": {
    id: "divisible-by-5",
    problemNo: 18,
    title: "Divisible by 5",
    patterns: [
      /divisible\s*by\s*5/i,
      /%\s*5\s*={1,3}\s*0/i
    ],
    goalSummary: "testing if a number leaves remainder 0 when divided by 5 (num % 5 == 0)"
  },
  "maximum-of-two": {
    id: "maximum-of-two",
    problemNo: 19,
    title: "Maximum of Two Numbers",
    patterns: [
      /maximum\s*of\s*two/i,
      /larger\s*of\s*two/i,
      /max\s*of\s*two/i,
      /\bmax(?:imum)?\b/i,
      /[ab]\s*>\s*[ab]/i,
      /[ab]\s*is\s*(?:greater|larger|max|maximum)\b/i,
      /\bdisplay\s+[ab]\s+is\s+max/i,
      /\bprint\s*\(?["']?[ab]\s*is\s*max/i
    ],
    goalSummary: "finding and printing the larger of two numbers"
  },
  "vowel-or-consonant": {
    id: "vowel-or-consonant",
    problemNo: 20,
    title: "Vowel or Consonant",
    patterns: [
      /\bvowels?\b.*\bconsonants?\b/i,
      /\bconsonants?\b.*\bvowels?\b/i,
      /['"][aeiou]['"]/i
    ],
    goalSummary: "checking if a character is a vowel (a, e, i, o, u) or consonant"
  },
  "senior-citizen": {
    id: "senior-citizen",
    problemNo: 21,
    title: "Senior Citizen Checker",
    patterns: [
      /senior\s*citizen/i,
      /age\s*>=\s*60/i
    ],
    goalSummary: "checking if age is greater than or equal to 60"
  },
  "even-numbers-1-to-50": {
    id: "even-numbers-1-to-50",
    problemNo: 21,
    title: "Print Even Numbers from 1 to 50",
    patterns: [
      /\b50\b/,
      /1\s*(?:to|-)\s*50/i,
      /even\s*numbers?/i,
      /%\s*2\b/,
      /divisible\s+by\s+2\b/i
    ],
    goalSummary: "iterating numbers from 1 to 50 and printing even numbers divisible by 2"
  },
  "odd-numbers-1-to-50": {
    id: "odd-numbers-1-to-50",
    problemNo: 22,
    title: "Print Odd Numbers from 1 to 50",
    patterns: [
      /\b50\b/,
      /1\s*(?:to|-)\s*50/i,
      /odd\s*numbers?/i,
      /%\s*2\b/,
      /not\s+divisible\s+by\s+2\b/i
    ],
    goalSummary: "iterating numbers from 1 to 50 and printing odd numbers leaving remainder 1 when divided by 2"
  }
};

/**
 * Checks if the student's text/code belongs to a DIFFERENT problem than currentProblemId.
 * Returns null if no cross-problem mismatch is detected.
 * Returns a detailed mismatch report if a foreign problem signature is clearly identified.
 */
export function detectCrossProblemMismatch(currentProblemId, section, text) {
  if (!text || text.trim().length < 5) return null;
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Normalize current problem ID using detectProblemType or raw string
  const resolvedType = detectProblemType(currentProblemId);
  const cleanCurrentId = (resolvedType !== "custom" && resolvedType) 
    ? resolvedType 
    : (currentProblemId || "").toLowerCase().trim();
  const currentDef = PROBLEM_DEFINITIONS[cleanCurrentId];
  const currentTitle = currentDef ? currentDef.title : "this challenge";
  const currentGoal = currentDef ? currentDef.goalSummary : "the current challenge logic";

  // Check against all other problem signatures
  for (const [probKey, probDef] of Object.entries(PROBLEM_DEFINITIONS)) {
    if (probKey === cleanCurrentId) continue;

    // Special exclusion: 'odd-even' vs 'even-numbers-1-to-50' (both talk about even and % 2)
    if ((cleanCurrentId === "even-numbers-1-to-50" && probKey === "odd-even") ||
        (cleanCurrentId === "odd-even" && probKey === "even-numbers-1-to-50")) {
      continue;
    }

    // Special exclusion: 'prime-number' vs 'next-prime-number' / 'prime-between-range' / 'sexy-prime-number'
    if (cleanCurrentId.includes("prime") && probKey.includes("prime")) continue;

    // Special exclusion: In any prime problem, student may legitimately talk about divisors or counting divisors to test primality
    if (cleanCurrentId.includes("prime") && probKey === "divisor-of-a-number") {
      if (lower.includes("prime") || lower.includes("count") || /exactly\s*2/i.test(lower) || /2\s*divisors/i.test(lower) || lower.includes("range") || lower.includes("next") || lower.includes("n+1") || lower.includes("n + 1") || lower.includes("current") || lower.includes("between") || lower.includes("step 2")) {
        continue;
      }
    }

    // Special exclusion: 'voting-eligibility' vs 'adult-or-minor' (both use 18)
    if ((cleanCurrentId === "voting-eligibility" && probKey === "adult-or-minor") ||
        (cleanCurrentId === "adult-or-minor" && probKey === "voting-eligibility")) {
      continue;
    }

    // Check if the input strongly matches the foreign problem's pattern
    const matchesPattern = probDef.patterns.some(pattern => pattern.test(trimmed));
    if (matchesPattern) {
      // Confirm that the text does NOT genuinely describe the current problem
      let isTrulyCurrent = false;
      if (currentDef && currentDef.patterns) {
        // If current problem's primary pattern matches strongly, it's not a mismatch
        isTrulyCurrent = currentDef.patterns.some(p => p.test(trimmed));
      }

      // Specific guard: Odd/Even in Divisors of a Number
      if (cleanCurrentId === "divisor-of-a-number" && (lower.includes("even") || lower.includes("odd") || /%\s*2\b/.test(trimmed))) {
        // Divisors do NOT care about even/odd
        isTrulyCurrent = false;
      }

      // Specific guard: Foreign Voting/Eligibility/Adult/Positive terms in Odd or Even
      if (cleanCurrentId === "odd-even") {
        if (lower.includes("eligible") || lower.includes("voting") || lower.includes("vote") || lower.includes("adult") || lower.includes("minor")) {
          isTrulyCurrent = false;
        }
      }

      // Specific guard: Divisible by 5 in Divisors of a Number
      if (cleanCurrentId === "divisor-of-a-number" && probKey === "divisible-by-5") {
        if (!lower.includes("loop") && !lower.includes("1 to")) isTrulyCurrent = false;
      }

      if (!isTrulyCurrent) {
        const stageName = section === "samplecode" ? "code" : section;
        return {
          isMismatch: true,
          foreignProblemKey: probKey,
          foreignTitle: probDef.title,
          currentTitle,
          message: `🌟 Coach Maara here! It looks like you've written ${stageName} for **${probDef.title}** (Problem ${probDef.problemNo})! In this workspace, our goal is **${currentTitle}** (${currentGoal}). Please write the ${stageName} specifically for ${currentTitle}!`
        };
      }
    }
  }

  return null;
}
