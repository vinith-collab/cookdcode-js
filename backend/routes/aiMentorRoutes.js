import { Router } from "express";
import { aiMentorPipeline } from "../services/aiMentorPipeline.js";
import { inputCheckerService } from "../services/inputCheckerService.js";
import { studentHistoryService } from "../services/studentHistoryService.js";
import { firebaseHintService } from "../services/firebaseHintService.js";
import { detectProblemType } from "../services/problemTypes.js";
import { SEED_PROBLEMS } from "../data/seedData.js";
import { validateCode } from "../services/staticCodeValidator.js";
import { recipeSummarizerService } from "../services/recipeSummarizerService.js";

function sanitizeCoachName(text) {
  if (!text || typeof text !== "string") return text;
  return text.replace(/Coach\s+Ma?ya/gi, "Coach Maara");
}

const aiMentorRouter = Router();
aiMentorRouter.post("/hint", async (req, res) => {
  try {
    const {
      userId,
      programId,
      section,
      studentInput,
      studentWorksheet,
      studentCode,
      hintLevel,
      problemTitle,
      problemDescription,
      previousHints,
      forceLlm,
      isClarityRequest
    } = req.body;
    if (!section) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: section (must be logic, recipe, ingredients, or samplecode)"
      });
    }
    const payload = {
      userId: userId || "guest_user",
      programId: programId || "sum-natural-numbers",
      section,
      studentInput: studentInput || "",
      studentWorksheet: studentWorksheet || "",
      studentCode: studentCode || "",
      hintLevel: typeof hintLevel === "number" ? hintLevel : 1,
      problemTitle,
      problemDescription,
      previousHints: Array.isArray(previousHints) ? previousHints : void 0,
      forceLlm: Boolean(forceLlm),
      isClarityRequest: Boolean(isClarityRequest)
    };
    const response = await aiMentorPipeline.execute(payload);
    if (response && response.hint) {
      response.hint = sanitizeCoachName(response.hint);
    }
    return res.json(response);
  } catch (err) {
    console.error("[AI Mentor API Error]", err);
    return res.status(500).json({
      success: false,
      error: "Failed to process AI mentor hint",
      message: err?.message || "Internal error"
    });
  }
});
aiMentorRouter.get("/history", (req, res) => {
  const userId = req.query.userId || "guest_user";
  const programId = req.query.programId;
  const history = studentHistoryService.getHistory(userId, programId);
  return res.json({ success: true, history });
});
aiMentorRouter.get("/hints-cache", (req, res) => {
  const programId = req.query.programId;
  const section = req.query.section;
  const hints = firebaseHintService.getAllCachedHints(programId, section);
  return res.json({ success: true, hints, count: hints.length });
});
const PROBLEM_METADATA_MAP = {
  "problem01": {
    id: "problem01",
    canonicalId: "odd-even",
    title: "Challenge: Odd or Even",
    description: "Write a program that takes an integer number from user input and determines whether the number is Even or Odd.",
    phase: "Phase 1",
    problemBadge: "Problem 1",
    concept: "Modulo Operator & Parity",
    objective: "Write a program that takes an integer number from user input and determines whether the number is Even or Odd.",
    specifications: [
      {
        label: "Input",
        desc: "A single integer number <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Determine whether the input number is Even or Odd.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Print <code>'Even'</code> if the number is even, or <code>'Odd'</code> if the number is odd.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "4", output: "'Even'" },
      { input: "7", output: "'Odd'" }
    ]
  },
  "problem02": {
    id: "problem02",
    canonicalId: "sum-natural-numbers",
    title: "Challenge: Sum of N Natural Numbers",
    description: "Write a program to calculate the total sum of the first N positive natural numbers from 1 up to N.",
    phase: "Phase 1",
    problemBadge: "Problem 2",
    concept: "Loops and Accumulator",
    objective: "Write a program to calculate the total sum of the first N positive natural numbers from 1 up to N.",
    specifications: [
      {
        label: "Input",
        desc: "A single positive integer <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Calculate the total sum of all natural numbers from 1 up to <code>n</code>.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Print the final calculated sum.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "5", output: "15" },
      { input: "3", output: "6" }
    ]
  },
  "problem03": {
    id: "problem03",
    canonicalId: "factorial",
    title: "Challenge: Factorial of a Number",
    description: "Write a program to calculate the factorial of a given positive integer N.",
    phase: "Phase 1",
    problemBadge: "Problem 3",
    concept: "Multiplication Accumulator & Loops",
    objective: "Write a program to calculate the factorial of a given positive integer N.",
    specifications: [
      {
        label: "Input",
        desc: "A single non-negative integer <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Calculate the factorial value of <code>n</code>.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Print the final factorial product.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "5", output: "120" },
      { input: "4", output: "24" }
    ]
  },
  "problem04": {
    id: "problem04",
    canonicalId: "divisor-of-a-number",
    title: "Challenge: Divisors of a Number",
    description: "Write a program to find and display all positive divisors of a given number N.",
    phase: "Phase 1",
    problemBadge: "Problem 4",
    concept: "Factors & Remainder Division",
    objective: "Write a program to find and display all positive divisors of a given number N.",
    specifications: [
      {
        label: "Input",
        desc: "A single positive integer <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Find all positive integers that divide <code>n</code> completely.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Display the list of all matching divisors.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "6", output: "1, 2, 3, 6" },
      { input: "8", output: "1, 2, 4, 8" }
    ]
  },
  "problem05": {
    id: "problem05",
    canonicalId: "multiplication-table",
    title: "Challenge: Multiplication Table",
    description: "Write a program to display the multiplication table of a given number N.",
    phase: "Phase 1",
    problemBadge: "Problem 5",
    concept: "Arithmetic Progression & Iterative Multiples",
    objective: "Write a program to display the multiplication table of a given number N.",
    specifications: [
      {
        label: "Input",
        desc: "A single positive integer <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Generate the multiplication multiples for <code>n</code>.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Display the table rows up to 10 multiples.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "5", output: "Multiplication table of 5" }
    ]
  },
  "problem06": {
    id: "problem06",
    canonicalId: "prime-number",
    title: "Challenge: Prime Number Checker",
    description: "Write a program to check whether a given integer N is a Prime number or Not Prime.",
    phase: "Phase 1",
    problemBadge: "Problem 6",
    concept: "Primality Testing & Divisibility Boundary",
    objective: "Write a program to check whether a given integer N is a Prime number or Not Prime.",
    specifications: [
      {
        label: "Input",
        desc: "A single positive integer <code>n</code>.",
        icon: "fa-right-to-bracket",
        color: "#2563eb"
      },
      {
        label: "Task",
        desc: "Determine if <code>n</code> is a Prime number or Not Prime.",
        icon: "fa-bullseye",
        color: "#7c3aed"
      },
      {
        label: "Output",
        desc: "Print <code>'Prime'</code> or <code>'Not Prime'</code>.",
        icon: "fa-display",
        color: "#059669"
      }
    ],
    examples: [
      { input: "13", output: "'Prime'" },
      { input: "9", output: "'Not Prime'" }
    ]
  },
  "problem07": {
    id: "problem07",
    canonicalId: "next-prime-number",
    title: "Challenge: Next Prime Number",
    description: "Write a program to find the smallest prime number strictly greater than a given integer n.",
    phase: "Phase 1",
    problemBadge: "Problem 7",
    concept: "Successor Primality Search",
    objective: "Write a program to find the smallest prime number strictly greater than a given integer n.",
    specifications: [
      { label: "Input", desc: "A single positive integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Find the smallest prime number strictly greater than <code>n</code>.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print the next prime number.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "7", output: "11" },
      { input: "14", output: "17" }
    ]
  },
  "problem08": {
    id: "problem08",
    canonicalId: "prime-between-range",
    title: "Challenge: Prime Numbers in Range",
    description: "Write a program to find and print all prime numbers between a start range and an end range.",
    phase: "Phase 1",
    problemBadge: "Problem 8",
    concept: "Range Primality Filter",
    objective: "Write a program to find and print all prime numbers between a start range and an end range.",
    specifications: [
      { label: "Input", desc: "Start and end range limits <code>a</code> and <code>b</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Find all prime numbers between <code>a</code> and <code>b</code> inclusive.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print all prime numbers in the range separated by commas.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "10, 20", output: "11, 13, 17, 19" }
    ]
  },
  "problem09": {
    id: "problem09",
    canonicalId: "sexy-prime-number",
    title: "Challenge: Sexy Prime Pairs",
    description: "Write a program to check if two prime numbers differ by six (p, p+6), forming a sexy prime pair.",
    phase: "Phase 1",
    problemBadge: "Problem 9",
    concept: "Prime Constant Difference Pairs",
    objective: "Write a program to check if two prime numbers differ by six (p, p+6), forming a sexy prime pair.",
    specifications: [
      { label: "Input", desc: "Two prime integers <code>p1</code> and <code>p2</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check if both are prime and differ by exactly 6.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Sexy Prime'</code> or <code>'Not Sexy Prime'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "5, 11", output: "'Sexy Prime'" },
      { input: "7, 11", output: "'Not Sexy Prime'" }
    ]
  },
  "problem10": {
    id: "problem10",
    canonicalId: "positive-negative",
    title: "Challenge: Positive or Negative",
    description: "Write a program to determine whether a given integer is Positive (>0), Negative (<0), or Zero (==0).",
    phase: "Phase 1",
    problemBadge: "Problem 10",
    concept: "Signum Classification",
    objective: "Write a program to determine whether a given integer is Positive, Negative, or Zero.",
    specifications: [
      { label: "Input", desc: "A single integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Evaluate whether <code>n</code> is positive, negative, or zero.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Positive'</code>, <code>'Negative'</code>, or <code>'Zero'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "5", output: "'Positive'" },
      { input: "-3", output: "'Negative'" }
    ]
  },
  "problem11": {
    id: "problem11",
    canonicalId: "three-digit-number",
    title: "Challenge: Three-Digit Number",
    description: "Write a program to check whether a given integer is a 3-digit number (between 100 and 999 inclusive).",
    phase: "Phase 1",
    problemBadge: "Problem 11",
    concept: "Magnitude Range Checking",
    objective: "Write a program to check whether a given integer is a 3-digit number.",
    specifications: [
      { label: "Input", desc: "A single integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check if <code>n</code> is between 100 and 999 inclusive.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Three-Digit'</code> or <code>'Not Three-Digit'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "450", output: "'Three-Digit'" },
      { input: "45", output: "'Not Three-Digit'" }
    ]
  },
  "problem12": {
    id: "problem12",
    canonicalId: "voting-eligibility",
    title: "Challenge: Voting Eligibility",
    description: "Write a program to check whether a person is eligible to vote based on age (age >= 18).",
    phase: "Phase 1",
    problemBadge: "Problem 12",
    concept: "Threshold Evaluation",
    objective: "Write a program to check whether a person is eligible to vote based on age.",
    specifications: [
      { label: "Input", desc: "A person's age <code>age</code> as an integer.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check if <code>age</code> is greater than or equal to 18.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Eligible'</code> or <code>'Not Eligible'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "19", output: "'Eligible'" },
      { input: "16", output: "'Not Eligible'" }
    ]
  },
  "problem13": {
    id: "problem13",
    canonicalId: "pass-or-fail",
    title: "Challenge: Pass or Fail",
    description: "Write a program to check if a student has passed or failed based on marks (mark >= 35 is Pass).",
    phase: "Phase 1",
    problemBadge: "Problem 13",
    concept: "Academic Benchmark Evaluation",
    objective: "Write a program to check if a student has passed or failed based on marks.",
    specifications: [
      { label: "Input", desc: "Student mark <code>mark</code> as an integer.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check if <code>mark</code> is at least 35.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Pass'</code> or <code>'Fail'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "42", output: "'Pass'" },
      { input: "28", output: "'Fail'" }
    ]
  },
  "problem14": {
    id: "problem14",
    canonicalId: "greater-than-100",
    title: "Challenge: Greater Than 100",
    description: "Write a program to check if an entered number is strictly greater than 100.",
    phase: "Phase 1",
    problemBadge: "Problem 14",
    concept: "Century Threshold Comparison",
    objective: "Write a program to check if an entered number is strictly greater than 100.",
    specifications: [
      { label: "Input", desc: "A single integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Verify if <code>n</code> is greater than 100.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Greater'</code> or <code>'Not Greater'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "150", output: "'Greater'" },
      { input: "95", output: "'Not Greater'" }
    ]
  },
  "problem15": {
    id: "problem15",
    canonicalId: "profit-or-loss",
    title: "Challenge: Profit or Loss",
    description: "Write a program to calculate profit or loss by comparing Selling Price (SP) and Cost Price (CP).",
    phase: "Phase 1",
    problemBadge: "Problem 15",
    concept: "Commercial Financial Difference",
    objective: "Write a program to calculate profit or loss by comparing Selling Price and Cost Price.",
    specifications: [
      { label: "Input", desc: "Cost Price <code>CP</code> and Selling Price <code>SP</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Compare SP and CP to determine profit, loss, or no profit.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Profit'</code>, <code>'Loss'</code>, or <code>'No Profit No Loss'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "100, 150", output: "'Profit'" },
      { input: "200, 160", output: "'Loss'" }
    ]
  },
  "problem16": {
    id: "problem16",
    canonicalId: "leap-year",
    title: "Challenge: Leap Year or Not",
    description: "Write a program to determine if a given year is a Leap Year.",
    phase: "Phase 1",
    problemBadge: "Problem 16",
    concept: "Gregorian Calendar Rules",
    objective: "Write a program to determine if a given year is a Leap Year.",
    specifications: [
      { label: "Input", desc: "A four-digit year <code>year</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check leap year divisibility (divisible by 4, not 100 unless 400).", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Leap Year'</code> or <code>'Not Leap Year'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "2024", output: "'Leap Year'" },
      { input: "2023", output: "'Not Leap Year'" }
    ]
  },
  "problem17": {
    id: "problem17",
    canonicalId: "adult-or-minor",
    title: "Challenge: Adult or Minor",
    description: "Write a program to classify a person as an Adult or Minor based on age.",
    phase: "Phase 1",
    problemBadge: "Problem 17",
    concept: "Demographic Classification",
    objective: "Write a program to classify a person as an Adult or Minor based on age.",
    specifications: [
      { label: "Input", desc: "A person's age <code>age</code> as an integer.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Classify as Adult (age >= 18) or Minor (age < 18).", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Adult'</code> or <code>'Minor'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "21", output: "'Adult'" },
      { input: "15", output: "'Minor'" }
    ]
  },
  "problem18": {
    id: "problem18",
    canonicalId: "divisible-by-5",
    title: "Challenge: Divisible by 5 or Not",
    description: "Write a program to check if an entered number is divisible by 5.",
    phase: "Phase 1",
    problemBadge: "Problem 18",
    concept: "Divisibility Test",
    objective: "Write a program to check if an entered number is divisible by 5.",
    specifications: [
      { label: "Input", desc: "A single integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check whether <code>n % 5 == 0</code>.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Divisible'</code> or <code>'Not Divisible'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "25", output: "'Divisible'" },
      { input: "14", output: "'Not Divisible'" }
    ]
  },
  "problem19": {
    id: "problem19",
    canonicalId: "maximum-of-two",
    title: "Challenge: Maximum of Two Numbers",
    description: "Write a program to find and print the larger of two input numbers.",
    phase: "Phase 1",
    problemBadge: "Problem 19",
    concept: "Binary Extremum Comparison",
    objective: "Write a program to find and print the larger of two input numbers.",
    specifications: [
      { label: "Input", desc: "Two integers <code>a</code> and <code>b</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Compare both numbers to find the greater value.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print the larger number.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "12, 25", output: "25" },
      { input: "80, 45", output: "80" }
    ]
  },
  "problem20": {
    id: "problem20",
    canonicalId: "vowel-or-consonant",
    title: "Challenge: Vowel or Consonant",
    description: "Write a program to check if an entered character is a Vowel (a, e, i, o, u) or Consonant.",
    phase: "Phase 1",
    problemBadge: "Problem 20",
    concept: "Character Set Membership Test",
    objective: "Write a program to check if an entered character is a Vowel or Consonant.",
    specifications: [
      { label: "Input", desc: "A single alphabet character <code>ch</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Check if <code>ch</code> is in [a, e, i, o, u] (case-insensitive).", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Print <code>'Vowel'</code> or <code>'Consonant'</code>.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "'e'", output: "'Vowel'" },
      { input: "'b'", output: "'Consonant'" }
    ]
  },
  "problem21": {
    id: "problem21",
    canonicalId: "multiplication-table",
    title: "Challenge: Multiplication Table",
    description: "Write a program to generate and display the multiplication table of a given number.",
    phase: "Phase 1",
    problemBadge: "Problem 21",
    concept: "Multiplication Loops",
    objective: "Write a program to generate and display the multiplication table of a given number.",
    specifications: [
      { label: "Input", desc: "A single positive integer <code>n</code>.", icon: "fa-right-to-bracket", color: "#2563eb" },
      { label: "Task", desc: "Generate the multiplication multiples up to 10 for <code>n</code>.", icon: "fa-bullseye", color: "#7c3aed" },
      { label: "Output", desc: "Display the multiplication table.", icon: "fa-display", color: "#059669" }
    ],
    examples: [
      { input: "5", output: "Table of 5" }
    ]
  },
  "senior-citizen": {
    id: "senior-citizen",
    canonicalId: "senior-citizen",
    title: "Challenge: Senior Citizen Checker",
    description: "Write a program to check if a person qualifies as a Senior Citizen (age >= 60).",
    phase: "Phase 1",
    problemBadge: "Challenge",
    concept: "Threshold Comparison (>= 60)"
  }
};

function resolveProblemMetadata(rawId) {
  if (!rawId) return PROBLEM_METADATA_MAP["problem01"];
  const cleanId = rawId.toString().toLowerCase().trim();

  if (PROBLEM_METADATA_MAP[cleanId]) return PROBLEM_METADATA_MAP[cleanId];

  const m = cleanId.match(/^problem0?(\d+)$/);
  if (m) {
    const num = parseInt(m[1], 10);
    const key = `problem${num < 10 ? '0' + num : num}`;
    if (PROBLEM_METADATA_MAP[key]) return PROBLEM_METADATA_MAP[key];
  }

  const detected = detectProblemType(cleanId);
  for (const item of Object.values(PROBLEM_METADATA_MAP)) {
    if (item.canonicalId === detected || item.canonicalId === cleanId) {
      return item;
    }
  }

  const seed = SEED_PROBLEMS[cleanId] || SEED_PROBLEMS[detected];
  if (seed) {
    return {
      id: cleanId,
      canonicalId: seed.id || cleanId,
      title: seed.programName || `Challenge: ${cleanId}`,
      description: seed.description || "Solve the challenge step-by-step.",
      phase: "Phase 1",
      problemBadge: "Challenge",
      concept: seed.concept || "Programming Logic"
    };
  }

  return {
    id: cleanId,
    canonicalId: cleanId,
    title: `Challenge: ${cleanId.replace(/[-_]/g, ' ')}`,
    description: "Write a program to solve this challenge step-by-step.",
    phase: "Phase 1",
    problemBadge: "Challenge",
    concept: "Programming Logic"
  };
}

function generateFallbackSpecifications(meta) {
  if (meta && meta.specifications && Array.isArray(meta.specifications) && meta.specifications.length > 0) {
    return meta.specifications;
  }
  return [
    {
      label: "Input",
      desc: "Read input value(s) from user as required by the challenge.",
      icon: "fa-right-to-bracket",
      color: "#2563eb"
    },
    {
      label: "Task",
      desc: meta && meta.description ? meta.description.replace(/^Write a program (to|that) /i, "") : "Solve the challenge requirements.",
      icon: "fa-bullseye",
      color: "#7c3aed"
    },
    {
      label: "Output",
      desc: "Display or print the calculated result in the expected format.",
      icon: "fa-display",
      color: "#059669"
    }
  ];
}

aiMentorRouter.all("/getProblemDetails", (req, res) => {
  const pId = req.body?.problemID || req.query?.problemID || req.body?.problemId || req.query?.problemId || req.body?.programId || req.query?.programId || "problem01";
  const meta = resolveProblemMetadata(pId);
  const specifications = generateFallbackSpecifications(meta);
  const examples = (meta.examples && Array.isArray(meta.examples) && meta.examples.length > 0)
    ? meta.examples
    : (meta.example ? [{ input: meta.example.input || "-", output: meta.example.output || "-" }] : []);

  return res.json({
    title: meta.title,
    description: meta.description,
    phase: meta.phase || "Phase 1",
    problemBadge: meta.problemBadge || (meta.id ? meta.id.replace("problem", "Problem ") : "Problem 1"),
    concept: meta.concept,
    objective: meta.objective || meta.description,
    specifications: specifications,
    examples: examples
  });
});

const handleCheckInput = async (req, res) => {
  const {
    category,
    problemID,
    problemId,
    programId,
    problemTitle,
    problemDescription,
    concept,
    reveal,
    section,
    userInput,
    userContent,
    recipeContent,
    logicContent,
    attemptCount,
    isStuck
  } = req.body;

  const rawId = problemID || problemId || programId || "problem01";
  const meta = resolveProblemMetadata(rawId);
  const effectiveId = meta.canonicalId || meta.id || rawId;
  const effectiveInput = (userInput || userContent || "").toString();

  const result = await inputCheckerService.check(
    category || "fundamentals",
    effectiveId,
    section || "logic",
    effectiveInput,
    {
      attemptCount,
      isStuck,
      problemTitle: problemTitle || meta.title,
      problemDescription: problemDescription || meta.description,
      concept: concept || meta.concept,
      reveal,
      recipeContent,
      logicContent
    }
  );
  if (result && result.feedback) {
    result.feedback = sanitizeCoachName(result.feedback);
  }

  // If section is recipe, automatically attach strictly user-content-derived recipe summary
  if (section === "recipe" && result && !result.recipeSummary) {
    try {
      result.recipeSummary = recipeSummarizerService.extractRecipeStepsFromUserContent(effectiveInput, meta);
    } catch (e) {
      console.warn("[handleCheckInput] could not extract recipe summary:", e.message);
    }
  }

  return res.json(result);
};

aiMentorRouter.post("/checkInput", handleCheckInput);
aiMentorRouter.post("/check", handleCheckInput);

aiMentorRouter.post("/clean-step", async (req, res) => {
  try {
    const {
      section,
      userInput,
      userContent,
      recipeContent,
      problemID,
      problemId,
      programId,
      category
    } = req.body;

    const rawId = problemID || problemId || programId || "problem01";
    const meta = resolveProblemMetadata(rawId);
    const textToClean = (userInput || userContent || recipeContent || "").toString();

    const result = await recipeSummarizerService.cleanAndFormatSection(section || "recipe", textToClean, meta);
    return res.json(result);
  } catch (err) {
    console.error("[clean-step route error]", err);
    return res.status(500).json({
      success: false,
      error: "Failed to clean & format section",
      message: err.message
    });
  }
});

aiMentorRouter.post("/summarize-recipe", async (req, res) => {
  try {
    const {
      userInput,
      userContent,
      recipeContent,
      problemID,
      problemId,
      programId,
      category
    } = req.body;

    const rawId = problemID || problemId || programId || "problem01";
    const meta = resolveProblemMetadata(rawId);
    const textToSummarize = (userInput || userContent || recipeContent || "").toString();

    const summary = await recipeSummarizerService.summarizeRecipe(textToSummarize, meta);
    return res.json(summary);
  } catch (err) {
    console.error("[summarize-recipe route error]", err);
    return res.status(500).json({
      success: false,
      error: "Failed to summarize recipe",
      message: err.message
    });
  }
});

aiMentorRouter.post("/summarizeRecipe", async (req, res) => {
  try {
    const {
      userInput,
      userContent,
      recipeContent,
      problemID,
      problemId,
      programId,
      category
    } = req.body;

    const rawId = problemID || problemId || programId || "problem01";
    const meta = resolveProblemMetadata(rawId);
    const textToSummarize = (userInput || userContent || recipeContent || "").toString();

    const summary = await recipeSummarizerService.summarizeRecipe(textToSummarize, meta);
    return res.json(summary);
  } catch (err) {
    console.error("[summarizeRecipe route error]", err);
    return res.status(500).json({
      success: false,
      error: "Failed to summarize recipe",
      message: err.message
    });
  }
});

aiMentorRouter.post("/rewriteHintStream", async (req, res) => {
  try {
    const {
      category = "fundamentals",
      problemID,
      problemId,
      programId,
      section = "logic",
      userContent,
      userInput,
      recipeContent,
      logicContent,
      hintLevel = 1
    } = req.body;

    const rawId = problemID || problemId || programId || "problem01";
    const meta = resolveProblemMetadata(rawId);
    const effectiveId = meta.canonicalId || meta.id || rawId;

    let effectiveInput = (userContent || userInput || "").toString().trim();
    if (!effectiveInput) {
      if (section === "recipe" && recipeContent) effectiveInput = recipeContent.toString().trim();
      if (section === "logic" && logicContent) effectiveInput = logicContent.toString().trim();
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    let isCorrect = false;
    let hintText = "";
    let checkResult = null;

    if (!effectiveInput || effectiveInput.length < 2) {
      checkResult = await inputCheckerService.check(
        category,
        effectiveId,
        section,
        effectiveInput || "what should we do",
        {
          hintLevel,
          attemptCount: hintLevel || 1,
          recipeContent,
          logicContent,
          problemTitle: meta.title,
          problemDescription: meta.description,
          concept: meta.concept
        }
      );
      if (checkResult && checkResult.feedback) {
        hintText = checkResult.feedback;
        isCorrect = Boolean(checkResult.correct);
      } else {
        const match = await firebaseHintService.findMatchingHint(effectiveId, section, "what should we do", hintLevel);
        const rawHint = (typeof match?.hint === "string" ? match.hint : (match?.hint?.hint || (typeof match === "string" ? match : ""))) || `What should we do to solve ${meta.title}? Write your initial thinking in the worksheet!`;
        const cleanRawHint = String(rawHint || "");
        hintText = cleanRawHint.startsWith("🌟") || cleanRawHint.toLowerCase().includes("coach maara") ? cleanRawHint : `🌟 Coach Maara here! ${cleanRawHint}`;
        isCorrect = false;
      }
    } else {
      checkResult = await inputCheckerService.check(
        category,
        effectiveId,
        section,
        effectiveInput,
        {
          hintLevel,
          attemptCount: hintLevel || 1,
          recipeContent,
          logicContent,
          problemTitle: meta.title,
          problemDescription: meta.description,
          concept: meta.concept
        }
      );

      const feedbackIndicatesCompletion = checkResult?.correct !== false && /ready to (?:move on|proceed)|taste the sample|everything is (?:perfectly )?in place|all \d+ ingredients (?:are )?verified|ingredients verified|solution verified/i.test(checkResult?.feedback || "");
      isCorrect = Boolean(checkResult?.correct) || feedbackIndicatesCompletion;
      hintText = checkResult?.feedback || "";

      if (!hintText || hintText.trim().length === 0) {
        const match = await firebaseHintService.findMatchingHint(effectiveId, section, effectiveInput, hintLevel);
        hintText = match?.hint || "🌟 Coach Maara here! Let's think through this step together in your worksheet.";
      }
    }

    if (checkResult) {
      if (checkResult.feedback) checkResult.feedback = sanitizeCoachName(checkResult.feedback);
      if (checkResult.correction) checkResult.correction = sanitizeCoachName(checkResult.correction);
      if (checkResult.suggestedInput) checkResult.suggestedInput = sanitizeCoachName(checkResult.suggestedInput);
    }
    hintText = sanitizeCoachName(hintText);

    res.write(`data: ${JSON.stringify({ 
      type: "start", 
      source: "ai_human_touch", 
      isCorrect,
      correction: checkResult?.correction || null,
      suggestedInput: checkResult?.suggestedInput || null,
      proofType: checkResult?.proofType || null
    })}\n\n`);

    const words = hintText.split(" ");
    const streamDelay = (words.length > 60) ? 4 : 6;
    for (let i = 0; i < words.length; i++) {
      const chunkText = (i === 0 ? "" : " ") + words[i];
      res.write(`data: ${JSON.stringify({ type: "chunk", text: chunkText })}\n\n`);
      await new Promise(resolve => setTimeout(resolve, streamDelay));
    }

    res.write(`data: [DONE]\n\n`);
    return res.end();
  } catch (err) {
    console.error("[rewriteHintStream Error]", err);
    if (!res.headersSent) {
      res.setHeader("Content-Type", "text/event-stream");
    }
    res.write(`data: ${JSON.stringify({ type: "start", source: "error", isCorrect: false })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: "chunk", text: "🌟 Coach Maara here! Let's think through this step carefully in your worksheet. What do you think comes next?" })}\n\n`);
    res.write(`data: [DONE]\n\n`);
    return res.end();
  }
});

aiMentorRouter.post("/rewriteHint", async (req, res) => {
  const { userContent, userInput, section, hintLevel, problemName, problemID, source, retrievedHint } = req.body;
  const rawId = problemID || problemName || "problem01";
  const meta = resolveProblemMetadata(rawId);
  const effectiveId = meta.canonicalId || meta.id || rawId;

  if (retrievedHint && source === "firebase") {
    return res.json({
      hint: retrievedHint,
      hintLevel: hintLevel || 1,
      source: "firebase",
      section: section || "logic"
    });
  }

  const effectiveInput = (userContent || userInput || "").toString().trim();
  let checkResult = await inputCheckerService.check(
    "fundamentals",
    effectiveId,
    section || "logic",
    effectiveInput || "what should we do",
    { hintLevel: hintLevel || 1, problemTitle: meta.title, problemDescription: meta.description }
  );

  let hintText = checkResult?.feedback || "";
  if (!hintText || hintText.trim().length === 0) {
    const match = await firebaseHintService.findMatchingHint(effectiveId, section || "logic", effectiveInput || "what should we do", hintLevel || 1);
    const rawHint = (typeof match?.hint === "string" ? match.hint : (match?.hint?.hint || (typeof match === "string" ? match : ""))) || `What should we do to solve ${meta.title}? Write your initial thinking in the worksheet!`;
    const cleanRawHint = String(rawHint || "");
    hintText = cleanRawHint.startsWith("🌟") || cleanRawHint.toLowerCase().includes("coach maara") ? cleanRawHint : `🌟 Coach Maara here! ${cleanRawHint}`;
  }

  if (checkResult) {
    if (checkResult.feedback) checkResult.feedback = sanitizeCoachName(checkResult.feedback);
    if (checkResult.correction) checkResult.correction = sanitizeCoachName(checkResult.correction);
    if (checkResult.suggestedInput) checkResult.suggestedInput = sanitizeCoachName(checkResult.suggestedInput);
  }

  return res.json({
    hint: sanitizeCoachName(hintText) || "Coach Maara here! Try writing your thoughts in the worksheet.",
    hintLevel: hintLevel || 1,
    source: "ai_human_touch",
    section: section || "logic",
    isCorrect: Boolean(checkResult?.correct),
    correction: checkResult?.correction || null,
    suggestedInput: checkResult?.suggestedInput || null,
    proofType: checkResult?.proofType || null
  });
});
aiMentorRouter.get("/run-tests", async (_req, res) => {
  const testResults = [];
  try {
    const test1 = await aiMentorPipeline.execute({
      userId: "test_user_1",
      programId: "prime-number",
      section: "logic",
      studentInput: "I don't understand prime number",
      hintLevel: 1
    });
    testResults.push({
      name: "Existing Firebase Hint Retrieval",
      stage: "logic",
      status: test1.source === "firebase" ? "PASS" : "FAIL",
      details: { source: test1.source, hint: test1.hint, concept: test1.concept }
    });
    const test2 = await aiMentorPipeline.execute({
      userId: "test_user_2",
      programId: "prime-number",
      section: "recipe",
      studentInput: "I know I need to check divisibility, but what should I do next?",
      hintLevel: 2
    });
    testResults.push({
      name: "Recipe Stage Specificity",
      stage: "recipe",
      status: test2.section === "recipe" ? "PASS" : "FAIL",
      details: { section: test2.section, hint: test2.hint, level: test2.hintLevel }
    });
    const test3 = await aiMentorPipeline.execute({
      userId: "test_user_3",
      programId: "prime-number",
      section: "ingredients",
      studentInput: "Why do I need count?",
      hintLevel: 2
    });
    testResults.push({
      name: "Ingredients Stage Identification",
      stage: "ingredients",
      status: test3.section === "ingredients" ? "PASS" : "FAIL",
      details: { hint: test3.hint, concept: test3.concept }
    });
    const test4 = await aiMentorPipeline.execute({
      userId: "test_user_4",
      programId: "prime-number",
      section: "samplecode",
      studentInput: "My output is wrong for 6",
      studentCode: "n = 6\ncount = 0\nfor i in range(1, n+1):\n  if n % i == 0: count += 1",
      hintLevel: 3
    });
    testResults.push({
      name: "Taste The Sample Tracing",
      stage: "samplecode",
      status: test4.section === "samplecode" ? "PASS" : "FAIL",
      details: { hint: test4.hint, level: test4.hintLevel }
    });
    const uniqueQuery = `What is the geometric meaning of triangle numbers? ${Date.now()}`;
    const test5 = await aiMentorPipeline.execute({
      userId: "test_user_5",
      programId: "sum-natural-numbers",
      section: "logic",
      studentInput: uniqueQuery,
      hintLevel: 1,
      forceLlm: true
    });
    testResults.push({
      name: "Unknown Input LLM Generation",
      stage: "logic",
      status: test5.source === "llm" && test5.hint.length > 10 ? "PASS" : "FAIL",
      details: { source: test5.source, hint: test5.hint }
    });
    const test6a = await aiMentorPipeline.execute({
      userId: "test_user_6",
      programId: "sum-natural-numbers",
      section: "ingredients",
      studentInput: "I am completely stuck on what variables to use",
      hintLevel: 1
    });
    const test6b = await aiMentorPipeline.execute({
      userId: "test_user_6",
      programId: "sum-natural-numbers",
      section: "ingredients",
      studentInput: "I am completely stuck on what variables to use",
      hintLevel: 4
    });
    testResults.push({
      name: "Progressive Hints Escalation",
      stage: "ingredients",
      status: test6b.hintLevel === 4 && test6a.hint !== test6b.hint ? "PASS" : "FAIL",
      details: { level1Hint: test6a.hint, level4Hint: test6b.hint }
    });
    const history = studentHistoryService.getHistory("test_user_6", "sum-natural-numbers");
    testResults.push({
      name: "Student Hint History Stored",
      stage: "ingredients",
      status: history.length >= 2 ? "PASS" : "FAIL",
      details: { recordedInteractions: history.length }
    });
    const test8a = await aiMentorPipeline.execute({
      userId: "test_user_8",
      programId: "next-prime-number",
      section: "recipe",
      studentInput: "while (true) { candidate++; if (isPrime) break; }",
      hintLevel: 1
    });
    const test8b = await aiMentorPipeline.execute({
      userId: "test_user_8",
      programId: "next-prime-number",
      section: "recipe",
      studentInput: "Step 1: Get the input number n\nStep 2: Start candidate number as n + 1\nStep 3: Check if candidate is prime\nStep 4: If candidate is prime, display candidate and stop\nStep 5: If not prime, increase candidate by 1 and repeat Step 3",
      hintLevel: 1
    });
    testResults.push({
      name: "Next Prime Recipe Code Keyword Guard",
      stage: "recipe",
      status: test8a.hint.includes("without programming") || test8a.hint.includes("gentle reminder") || test8a.hint.includes("code syntax") ? "PASS" : "FAIL",
      details: { hint: test8a.hint }
    });
    testResults.push({
      name: "Next Prime Recipe Full Step Verification",
      stage: "recipe",
      status: test8b.hint.includes("Proceed to Stage 3") || test8b.hint.includes("Ingredients") || test8b.hint.includes("Outstanding") || test8b.hint.includes("complete") ? "PASS" : "FAIL",
      details: { hint: test8b.hint }
    });
    const test9a = await aiMentorPipeline.execute({
      userId: "test_user_9",
      programId: "pass-or-fail",
      section: "logic",
      studentInput: "what mark is pass",
      hintLevel: 1
    });
    testResults.push({
      name: "Problem 12 Logic Firebase Hint Retrieval",
      stage: "logic",
      status: test9a.hint.includes("35") && (test9a.hint.includes("Pass") || test9a.hint.includes("pass")) ? "PASS" : "FAIL",
      details: { hint: test9a.hint, source: test9a.source }
    });
    const test9b = await aiMentorPipeline.execute({
      userId: "test_user_9",
      programId: "pass-or-fail",
      section: "samplecode",
      studentInput: "how to write sample code",
      studentCode: 'var mark = 45; if (mark >= 35) print("Pass"); else print("Fail");',
      hintLevel: 1
    });
    testResults.push({
      name: "Problem 12 Sample Code Hint & Syntax Handling",
      stage: "samplecode",
      status: test9b.hint.includes("35") || test9b.hint.includes("Pass") || test9b.hint.includes("mark") || test9b.hint.includes("comparison") ? "PASS" : "FAIL",
      details: { hint: test9b.hint }
    });
    return res.json({
      success: true,
      allPassed: testResults.every((t) => t.status === "PASS"),
      results: testResults
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || err, results: testResults });
  }
});

const JUDGE0_LANG_MAP = {
  // JavaScript & TypeScript
  javascript: 102,
  js: 102,
  node: 102,
  typescript: 101,
  ts: 101,

  // Python
  python: 100,
  py: 100,
  python3: 100,
  python2: 70,

  // C & C++
  c: 103,
  cpp: 105,
  "c++": 105,
  "c-clang": 110,
  "cpp-clang": 76,

  // Java & JVM Languages
  java: 91,
  kotlin: 111,
  scala: 112,
  groovy: 88,
  clojure: 86,

  // Systems & Compiled
  csharp: 51,
  "c#": 51,
  cs: 51,
  go: 107,
  golang: 107,
  rust: 108,
  rs: 108,
  swift: 83,
  dart: 90,
  d: 56,
  fortran: 59,
  pascal: 67,
  assembly: 45,
  nasm: 45,
  objectivec: 79,
  "objective-c": 79,

  // Scripting & Dynamic
  php: 98,
  ruby: 72,
  rb: 72,
  perl: 85,
  pl: 85,
  lua: 64,
  r: 99,
  haskell: 61,
  hs: 61,
  elixir: 57,
  ex: 57,
  erlang: 58,
  erl: 58,
  commonlisp: 55,
  lisp: 55,
  ocaml: 65,
  fsharp: 87,
  "f#": 87,

  // Additional Languages
  bash: 46,
  sh: 46,
  sql: 82,
  sqlite: 82,
  prolog: 69,
  basic: 47,
  cobol: 77,
  vbnet: 84,
  "visualbasic": 84,
  octave: 66,
  matlab: 66
};

aiMentorRouter.post("/compile", async (req, res) => {
  const { language = "javascript", code = "", stdin = "" } = req.body;
  const langKey = language.toString().toLowerCase().trim();
  const langId = JUDGE0_LANG_MAP[langKey] || (!isNaN(parseInt(langKey, 10)) ? parseInt(langKey, 10) : 102);

  if (!code || !code.trim()) {
    return res.json({
      success: false,
      status: "Empty Code",
      statusCode: 0,
      stdout: "",
      stderr: "No code provided to execute.",
      compileOutput: "",
      executionTime: "0ms"
    });
  }

  // Comprehensive static validation across the FULL code (all branches, syntax, undeclared calls)
  const validation = validateCode(langKey, code);
  if (!validation.valid) {
    return res.json({
      success: false,
      status: "Compilation / Reference Error",
      statusCode: 11,
      stdout: "",
      stderr: validation.error,
      compileOutput: validation.error,
      executionTime: "1ms"
    });
  }

  try {
    const judge0Res = await fetch("https://ce.judge0.com/submissions?wait=true", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        source_code: code,
        language_id: langId,
        stdin: stdin || ""
      })
    });

    if (judge0Res.ok) {
      const result = await judge0Res.json();
      const statusId = result.status?.id || 0;
      const isAccepted = statusId === 3;
      const execTime = result.time ? `${Math.round(parseFloat(result.time) * 1000)}ms` : "1ms";

      return res.json({
        success: isAccepted,
        status: result.status?.description || (isAccepted ? "Accepted" : "Execution Error"),
        statusCode: statusId,
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        compileOutput: result.compile_output || "",
        executionTime: execTime,
        memory: result.memory
      });
    }

    const errorText = await judge0Res.text();
    console.warn("[Judge0 API Non-200]", judge0Res.status, errorText);
    throw new Error(`Judge0 responded with status ${judge0Res.status}`);
  } catch (apiErr) {
    console.error("[Compile Route API Error]", apiErr.message);

    // Fallback for JavaScript in Node VM if Judge0 fails or is offline
    if (langKey === "javascript" || langKey === "js") {
      try {
        let outputLogs = [];
        const customConsole = {
          log: (...args) => outputLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" ")),
          error: (...args) => outputLogs.push("[error] " + args.join(" ")),
          warn: (...args) => outputLogs.push("[warn] " + args.join(" ")),
          info: (...args) => outputLogs.push(args.join(" "))
        };

        const startTime = Date.now();
        // Run with standard Node console
        const runner = new Function("console", `
          ${code}
        `);
        runner(customConsole);
        const duration = Date.now() - startTime;

        return res.json({
          success: true,
          status: "Accepted (Local VM)",
          statusCode: 3,
          stdout: outputLogs.join("\n") + (outputLogs.length > 0 ? "\n" : ""),
          stderr: "",
          compileOutput: "",
          executionTime: `${duration}ms`
        });
      } catch (vmErr) {
        return res.json({
          success: false,
          status: "Runtime / Syntax Error",
          statusCode: 11,
          stdout: "",
          stderr: vmErr.stack || vmErr.message,
          compileOutput: vmErr.message,
          executionTime: "0ms"
        });
      }
    }

    return res.status(502).json({
      success: false,
      status: "Compiler Service Unavailable",
      statusCode: 502,
      stdout: "",
      stderr: `Online compiler service temporarily unavailable: ${apiErr.message}`,
      compileOutput: "",
      executionTime: "0ms"
    });
  }
});

export {
  aiMentorRouter
};

