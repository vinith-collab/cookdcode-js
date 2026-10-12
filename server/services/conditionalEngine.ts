import { CTCStage } from '../types.js';

export interface ConditionalRecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
}

export interface ConditionalIngredientsStep {
  stepNumber: number;
  title: string;
  instruction: string;
  construct: 'variables' | 'if_condition' | 'inside_if_block' | 'else_block' | 'inside_else_block';
  targetBlock?: 'if' | 'else';
  leftSide?: string;
  operator?: string;
  rightSide?: string;
  expectedPrint?: string;
  outcome?: string;
}

export interface ConditionalProblemSpec {
  problemId: string;
  problemTitle: string;
  problemNumber?: number;
  variables: string[];
  variableNamesString: string;
  variableDeclarationSample: string;
  leftSide: string;
  operator: string;
  rightSide: string;
  trueOutcome: string;
  falseOutcome: string;
  trueConditionDisplay: string;
  falseConditionDisplay: string;
  truePrintStatement: string;
  falsePrintStatement: string;
  recipeSteps: [ConditionalRecipeStep, ConditionalRecipeStep];
  ingredientsSteps: [
    ConditionalIngredientsStep,
    ConditionalIngredientsStep,
    ConditionalIngredientsStep,
    ConditionalIngredientsStep,
    ConditionalIngredientsStep
  ];
  testCaseTrue: {
    title: string;
    inputs: Record<string, number | string>;
    formula: string;
    evaluatedTrue: boolean;
    output: string;
    explanation: string;
  };
  testCaseFalse: {
    title: string;
    inputs: Record<string, number | string>;
    formula: string;
    evaluatedTrue: boolean;
    output: string;
    explanation: string;
  };
}

export function buildStandardSteps(spec: Omit<ConditionalProblemSpec, 'recipeSteps' | 'ingredientsSteps'>): ConditionalProblemSpec {
  const isMultiVar = spec.variables.length > 1;
  const varSuffix = isMultiVar ? 's' : '';
  const recipeStep1 = isMultiVar
    ? `Step 1: Obtain ${spec.variableNamesString} (${spec.variables.join(', ')})`
    : `Step 1: Obtain input variable ${spec.variableNamesString}`;
  const recipeStep2 = `Step 2: If ${spec.trueConditionDisplay}, display ${spec.trueOutcome}, else display ${spec.falseOutcome}`;

  return {
    ...spec,
    recipeSteps: [
      { stepNumber: 1, title: recipeStep1, instruction: `Get input variable${varSuffix} ${spec.variableNamesString}` },
      { stepNumber: 2, title: recipeStep2, instruction: `Check condition and display outcome` }
    ],
    ingredientsSteps: [
      {
        stepNumber: 1,
        title: `Step 1: ${spec.variableNamesString} for input variable${varSuffix}`,
        instruction: `${spec.variableNamesString} for input variables`,
        construct: 'variables'
      },
      {
        stepNumber: 2,
        title: `Step 2: If condition with L.S: ${spec.leftSide}, R.S: ${spec.rightSide}, Operator: ${spec.operator}`,
        instruction: `If condition with L.S: ${spec.leftSide}, R.S: ${spec.rightSide}, Operator: ${spec.operator}`,
        construct: 'if_condition',
        leftSide: spec.leftSide,
        operator: spec.operator,
        rightSide: spec.rightSide
      },
      {
        stepNumber: 3,
        title: `Step 3: Inside if block: ${spec.truePrintStatement}`,
        instruction: `Inside if block: ${spec.truePrintStatement}`,
        construct: 'inside_if_block',
        targetBlock: 'if',
        expectedPrint: spec.truePrintStatement,
        outcome: spec.trueOutcome
      },
      {
        stepNumber: 4,
        title: `Step 4: Fallback else block`,
        instruction: `Fallback else block`,
        construct: 'else_block',
        targetBlock: 'else'
      },
      {
        stepNumber: 5,
        title: `Step 5: Inside else block: ${spec.falsePrintStatement}`,
        instruction: `Inside else block: ${spec.falsePrintStatement}`,
        construct: 'inside_else_block',
        targetBlock: 'else',
        expectedPrint: spec.falsePrintStatement,
        outcome: spec.falseOutcome
      }
    ]
  };
}

const RAW_REGISTRY: Record<string, Omit<ConditionalProblemSpec, 'recipeSteps' | 'ingredientsSteps'>> = {
  'maximum-of-two': {
    problemId: 'maximum-of-two',
    problemTitle: 'Maximum of Two Numbers',
    problemNumber: 18,
    variables: ['a', 'b'],
    variableNamesString: 'a and b',
    variableDeclarationSample: 'var a = 10, b = 25;',
    leftSide: 'a',
    operator: '>',
    rightSide: 'b',
    trueOutcome: 'a is max',
    falseOutcome: 'b is max',
    trueConditionDisplay: 'a > b',
    falseConditionDisplay: 'otherwise (or b > a)',
    truePrintStatement: 'print("a is max")',
    falsePrintStatement: 'print("b is max")',
    testCaseTrue: {
      title: 'First number is greater (a = 25, b = 10)',
      inputs: { a: 25, b: 10 },
      formula: '25 > 10',
      evaluatedTrue: true,
      output: 'a is max',
      explanation: '25 > 10 is true, so the if block executes and prints "a is max".'
    },
    testCaseFalse: {
      title: 'Second number is greater (a = 15, b = 40)',
      inputs: { a: 15, b: 40 },
      formula: '15 > 40',
      evaluatedTrue: false,
      output: 'b is max',
      explanation: '15 > 40 is false, so the fallback else block executes and prints "b is max".'
    }
  },

  'divisible-by-5': {
    problemId: 'divisible-by-5',
    problemTitle: 'Divisible by 5 or Not',
    problemNumber: 17,
    variables: ['n'],
    variableNamesString: 'n',
    variableDeclarationSample: 'var n = 25;',
    leftSide: 'n % 5',
    operator: '==',
    rightSide: '0',
    trueOutcome: 'Divisible by 5',
    falseOutcome: 'Not divisible by 5',
    trueConditionDisplay: 'n % 5 == 0',
    falseConditionDisplay: 'otherwise (n % 5 != 0)',
    truePrintStatement: 'print("Divisible by 5")',
    falsePrintStatement: 'print("Not divisible by 5")',
    testCaseTrue: {
      title: 'Number evenly divisible (n = 25)',
      inputs: { n: 25 },
      formula: '25 % 5 == 0',
      evaluatedTrue: true,
      output: 'Divisible by 5',
      explanation: '25 divided by 5 leaves remainder 0, so it is divisible by 5.'
    },
    testCaseFalse: {
      title: 'Number not divisible (n = 13)',
      inputs: { n: 13 },
      formula: '13 % 5 == 3 != 0',
      evaluatedTrue: false,
      output: 'Not divisible by 5',
      explanation: '13 divided by 5 leaves remainder 3 (not 0), so it is not divisible by 5.'
    }
  },

  'adult-or-minor': {
    problemId: 'adult-or-minor',
    problemTitle: 'Adult or Minor',
    problemNumber: 16,
    variables: ['age'],
    variableNamesString: 'age',
    variableDeclarationSample: 'var age = 20;',
    leftSide: 'age',
    operator: '>=',
    rightSide: '18',
    trueOutcome: 'Adult',
    falseOutcome: 'Minor',
    trueConditionDisplay: 'age >= 18',
    falseConditionDisplay: 'otherwise (age < 18)',
    truePrintStatement: 'print("Adult")',
    falsePrintStatement: 'print("Minor")',
    testCaseTrue: {
      title: 'Person is 18 or older (age = 20)',
      inputs: { age: 20 },
      formula: '20 >= 18',
      evaluatedTrue: true,
      output: 'Adult',
      explanation: 'Age 20 is greater than or equal to 18, so the person is an Adult.'
    },
    testCaseFalse: {
      title: 'Person is under 18 (age = 15)',
      inputs: { age: 15 },
      formula: '15 >= 18 is false',
      evaluatedTrue: false,
      output: 'Minor',
      explanation: 'Age 15 is strictly less than 18, so the person is a Minor.'
    }
  },

  'leap-year': {
    problemId: 'leap-year',
    problemTitle: 'Leap Year or Not',
    problemNumber: 15,
    variables: ['year'],
    variableNamesString: 'year',
    variableDeclarationSample: 'var year = 2024;',
    leftSide: 'year % 4',
    operator: '==',
    rightSide: '0',
    trueOutcome: 'Leap Year',
    falseOutcome: 'Not a Leap Year',
    trueConditionDisplay: 'year % 4 == 0',
    falseConditionDisplay: 'otherwise (year % 4 != 0)',
    truePrintStatement: 'print("Leap Year")',
    falsePrintStatement: 'print("Not a Leap Year")',
    testCaseTrue: {
      title: 'Year divisible by 4 (year = 2024)',
      inputs: { year: 2024 },
      formula: '2024 % 4 == 0',
      evaluatedTrue: true,
      output: 'Leap Year',
      explanation: '2024 is evenly divisible by 4 with remainder 0, so it is a Leap Year.'
    },
    testCaseFalse: {
      title: 'Year not divisible by 4 (year = 2023)',
      inputs: { year: 2023 },
      formula: '2023 % 4 == 3 != 0',
      evaluatedTrue: false,
      output: 'Not a Leap Year',
      explanation: '2023 leaves remainder 3 when divided by 4, so it is not a Leap Year.'
    }
  },

  'odd-even': {
    problemId: 'odd-even',
    problemTitle: 'Odd or Even Checker',
    problemNumber: 1,
    variables: ['n'],
    variableNamesString: 'n',
    variableDeclarationSample: 'var n = 10;',
    leftSide: 'n % 2',
    operator: '==',
    rightSide: '0',
    trueOutcome: 'Even',
    falseOutcome: 'Odd',
    trueConditionDisplay: 'n % 2 == 0',
    falseConditionDisplay: 'otherwise (n % 2 != 0)',
    truePrintStatement: 'print("Even")',
    falsePrintStatement: 'print("Odd")',
    testCaseTrue: {
      title: 'Even number test (n = 10)',
      inputs: { n: 10 },
      formula: '10 % 2 == 0',
      evaluatedTrue: true,
      output: 'Even',
      explanation: '10 divided by 2 leaves remainder 0, so it is Even.'
    },
    testCaseFalse: {
      title: 'Odd number test (n = 7)',
      inputs: { n: 7 },
      formula: '7 % 2 == 1 != 0',
      evaluatedTrue: false,
      output: 'Odd',
      explanation: '7 divided by 2 leaves remainder 1, so it is Odd.'
    }
  },

  'positive-negative': {
    problemId: 'positive-negative',
    problemTitle: 'Positive or Negative Number',
    problemNumber: 9,
    variables: ['num'],
    variableNamesString: 'num',
    variableDeclarationSample: 'var num = 15;',
    leftSide: 'num',
    operator: '>',
    rightSide: '0',
    trueOutcome: 'Positive',
    falseOutcome: 'Negative',
    trueConditionDisplay: 'num > 0',
    falseConditionDisplay: 'otherwise (num <= 0)',
    truePrintStatement: 'print("Positive")',
    falsePrintStatement: 'print("Negative")',
    testCaseTrue: {
      title: 'Positive number test (num = 15)',
      inputs: { num: 15 },
      formula: '15 > 0',
      evaluatedTrue: true,
      output: 'Positive',
      explanation: '15 is strictly greater than 0, so it is Positive.'
    },
    testCaseFalse: {
      title: 'Negative number test (num = -8)',
      inputs: { num: -8 },
      formula: '-8 > 0 is false',
      evaluatedTrue: false,
      output: 'Negative',
      explanation: '-8 is less than 0, so it is Negative.'
    }
  },

  'pass-or-fail': {
    problemId: 'pass-or-fail',
    problemTitle: 'Pass or Fail Based on Mark',
    problemNumber: 12,
    variables: ['mark'],
    variableNamesString: 'mark',
    variableDeclarationSample: 'var mark = 75;',
    leftSide: 'mark',
    operator: '>=',
    rightSide: '35',
    trueOutcome: 'Pass',
    falseOutcome: 'Fail',
    trueConditionDisplay: 'mark >= 35',
    falseConditionDisplay: 'otherwise (mark < 35)',
    truePrintStatement: 'print("Pass")',
    falsePrintStatement: 'print("Fail")',
    testCaseTrue: {
      title: 'Pass mark test (mark = 75)',
      inputs: { mark: 75 },
      formula: '75 >= 35',
      evaluatedTrue: true,
      output: 'Pass',
      explanation: 'Mark 75 is greater than or equal to pass mark 35, so result is Pass.'
    },
    testCaseFalse: {
      title: 'Fail mark test (mark = 28)',
      inputs: { mark: 28 },
      formula: '28 >= 35 is false',
      evaluatedTrue: false,
      output: 'Fail',
      explanation: 'Mark 28 is less than 35, so result is Fail.'
    }
  },

  'voting-eligibility': {
    problemId: 'voting-eligibility',
    problemTitle: 'Voting Eligibility',
    problemNumber: 11,
    variables: ['age'],
    variableNamesString: 'age',
    variableDeclarationSample: 'var age = 22;',
    leftSide: 'age',
    operator: '>=',
    rightSide: '18',
    trueOutcome: 'Eligible to vote',
    falseOutcome: 'Not eligible to vote',
    trueConditionDisplay: 'age >= 18',
    falseConditionDisplay: 'otherwise (age < 18)',
    truePrintStatement: 'print("Eligible to vote")',
    falsePrintStatement: 'print("Not eligible to vote")',
    testCaseTrue: {
      title: 'Eligible age test (age = 22)',
      inputs: { age: 22 },
      formula: '22 >= 18',
      evaluatedTrue: true,
      output: 'Eligible to vote',
      explanation: 'Age 22 is >= 18, so the person is eligible to vote.'
    },
    testCaseFalse: {
      title: 'Not eligible age test (age = 16)',
      inputs: { age: 16 },
      formula: '16 >= 18 is false',
      evaluatedTrue: false,
      output: 'Not eligible to vote',
      explanation: 'Age 16 is < 18, so the person is not eligible to vote.'
    }
  }
};

export const CONDITIONAL_PROBLEMS_REGISTRY: Record<string, ConditionalProblemSpec> = Object.fromEntries(
  Object.entries(RAW_REGISTRY).map(([key, spec]) => [key, buildStandardSteps(spec)])
);

/**
 * Resolves or dynamically infers the conditional problem specification
 */
export function getConditionalSpec(problemId?: string, problemTitle?: string, concept?: string): ConditionalProblemSpec | null {
  const normId = (problemId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTitle = (problemTitle || '').toLowerCase();

  // 1. Registry direct lookup
  for (const [key, spec] of Object.entries(CONDITIONAL_PROBLEMS_REGISTRY)) {
    const normKey = key.replace(/[^a-z0-9]/g, '');
    if (
      normId.includes(normKey) ||
      normTitle.includes(spec.problemTitle.toLowerCase()) ||
      (spec.problemNumber && normId === `problem${spec.problemNumber}`) ||
      (spec.problemNumber && normId === `problem0${spec.problemNumber}`)
    ) {
      return spec;
    }
  }

  // 2. Generic Divisibility check (e.g. Divisible by 3, Divisible by 7, etc.)
  const divMatch = normTitle.match(/divisible\s*by\s*(\d+)/i) || normId.match(/divisible(\d+)/i);
  if (divMatch) {
    const divisor = divMatch[1];
    return buildStandardSteps({
      problemId: problemId || `divisible-by-${divisor}`,
      problemTitle: problemTitle || `Divisible by ${divisor} or Not`,
      variables: ['n'],
      variableNamesString: 'n',
      variableDeclarationSample: `var n = ${parseInt(divisor, 10) * 3};`,
      leftSide: `n % ${divisor}`,
      operator: '==',
      rightSide: '0',
      trueOutcome: `Divisible by ${divisor}`,
      falseOutcome: `Not divisible by ${divisor}`,
      trueConditionDisplay: `n % ${divisor} == 0`,
      falseConditionDisplay: `otherwise (n % ${divisor} != 0)`,
      truePrintStatement: `print("Divisible by ${divisor}")`,
      falsePrintStatement: `print("Not divisible by ${divisor}")`,
      testCaseTrue: {
        title: `Divisible test (n = ${parseInt(divisor, 10) * 3})`,
        inputs: { n: parseInt(divisor, 10) * 3 },
        formula: `${parseInt(divisor, 10) * 3} % ${divisor} == 0`,
        evaluatedTrue: true,
        output: `Divisible by ${divisor}`,
        explanation: `${parseInt(divisor, 10) * 3} divided by ${divisor} leaves remainder 0.`
      },
      testCaseFalse: {
        title: `Not divisible test (n = ${parseInt(divisor, 10) * 2 + 1})`,
        inputs: { n: parseInt(divisor, 10) * 2 + 1 },
        formula: `${parseInt(divisor, 10) * 2 + 1} % ${divisor} != 0`,
        evaluatedTrue: false,
        output: `Not divisible by ${divisor}`,
        explanation: `Leaves remainder 1 when divided by ${divisor}.`
      }
    });
  }

  return null;
}

/**
 * Universal directive generator for any conditional / if-else problem
 */
export function generateUniversalIfDirectives(spec: ConditionalProblemSpec): string {
  return `
UNIVERSAL CONDITIONAL PROBLEM SPECIFICATION: "${spec.problemTitle}" (Problem ${spec.problemNumber || ''})
Core Decision Construct: If-Else Branching & Relational/Modulo Evaluation

1. STAGE 1 (LOGIC) - MATHEMATICAL COMPARISON & BOTH OUTCOMES MANDATE:
   - True Condition: ${spec.trueConditionDisplay} ➔ Outcome: "${spec.trueOutcome}"
   - False/Else Condition: ${spec.falseConditionDisplay} ➔ Outcome: "${spec.falseOutcome}"
   - Variables: ${spec.variableNamesString}
   - CRITICAL COMPLETION & VALIDATION RULES:
     • 'correct': true ONLY WHEN BOTH OUTCOMES ARE FULLY DEFINED!
     • If the student only defines the true outcome ("${spec.trueOutcome}"): Set 'correct': false! Praise the true outcome, then ask what happens otherwise ("${spec.falseOutcome}").
     • If the student only defines the false/else outcome ("${spec.falseOutcome}"): Set 'correct': false! Praise the false outcome, then ask what condition produces "${spec.trueOutcome}".
     • NEVER mark 'correct': true for a single step, single equation, or single outcome!
     • ZERO CODE WORDS: No 'if', 'else', 'var', 'print', 'operator', 'syntax', '=='.
     • CLEAN APPROVAL FEEDBACK: When both outcomes are defined, approve directly without printing example calculation tables!

2. STAGE 2 (RECIPE) - 2-STEP EVERYDAY ALGORITHM (NO CODE WORDS):
   - Step 1: Get input variable (${spec.variableNamesString}).
   - Step 2: If ${spec.trueConditionDisplay}, display "${spec.trueOutcome}", else display "${spec.falseOutcome}".
   - CRITICAL COMPLETION RULES:
     • 'correct': true ONLY WHEN BOTH Step 1 AND Step 2 ARE COMPLETED!
     • If student only writes Step 1: Set 'correct': false and prompt for Step 2.
     • If student only writes Step 2: Set 'correct': false and prompt for Step 1.
     • ZERO CODE WORDS: Use only plain everyday action words.

3. STAGE 3 (INGREDIENTS) - 5 PROGRAMMING TOOLS WITH SOCRATIC GUIDANCE:
   - Step 1: ${spec.ingredientsSteps[0].title}
   - Step 2: ${spec.ingredientsSteps[1].title}
   - Step 3: ${spec.ingredientsSteps[2].title} (MUST be placed inside the 'if' block! Outcome: "${spec.trueOutcome}")
   - Step 4: ${spec.ingredientsSteps[3].title}
   - Step 5: ${spec.ingredientsSteps[4].title} (MUST be placed inside the 'else' block! Outcome: "${spec.falseOutcome}")
   - CRITICAL PEDAGOGY ON 'if' vs 'else' & BRANCH INVERSIONS:
     • If student writes 'inside else' for Step 3 (or puts true outcome in else):
       SET 'correct': false! Flag severe contradiction: When ${spec.trueConditionDisplay} is true, the 'if' block runs! Printing "${spec.trueOutcome}" belongs inside the 'if' block, NOT inside 'else'!
     • If student writes 'inside if' for Step 5 (or puts false outcome in if):
       SET 'correct': false! Flag severe contradiction: Printing "${spec.falseOutcome}" only happens when the condition is false in the 'else' block, NOT inside 'if'!
     • If student writes 'else' in Step 2 with Left Side, Right Side, or Operator:
       Warmly explain that 'if' evaluates a condition (${spec.leftSide} ${spec.operator} ${spec.rightSide}), while 'else' is an automatic catch-all without condition!
     • If student writes wrong Left Side, wrong Operator, or wrong Right Side:
       Point out the mismatch gently and guide them to L.S: ${spec.leftSide}, Operator: ${spec.operator}, R.S: ${spec.rightSide}.
   - CRITICAL COMPLETION RULE:
     • 'correct': true ONLY WHEN ALL 5 INGREDIENT STEPS ARE COMPLETED!
     • Never mark 'correct': true for an intermediate single step!

4. STAGE 4 (TASTE THE SAMPLE / SAMPLE CODE) - PROTOTYPE ASSEMBLY:
   - Line 1: ${spec.variableDeclarationSample}
   - Line 2: if (${spec.leftSide} ${spec.operator} ${spec.rightSide}) {
   - Line 3:   ${spec.truePrintStatement};
   - Line 4: } else {
   - Line 5:   ${spec.falsePrintStatement}; }
   - CRITICAL SYNTAX & COMPLETION RULES:
     • 'correct': true ONLY WHEN ALL 5 CODE STEPS ARE COMPLETED!
     • If student writes 'else (condition)': Explain that 'else' has no condition.
     • If student misses quotes in print: Remind them strings need quotes.
     • If inverted branches: Remind them which outcome corresponds to the true branch.
`;
}
