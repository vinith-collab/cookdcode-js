/**
 * CookDcode - Challenge Workspace with Personalized AI Mentor (CTC Methodology)
 * Powered by CodeRead
 * Theme: Frosted Glass
 */
import React, { useState, useEffect } from 'react';

type CTCStage = 'logic' | 'recipe' | 'ingredients' | 'samplecode';

interface Problem {
  id: string;
  category: string;
  phaseLabel: string;
  problemNo: string;
  title: string;
  shortTitle?: string;
  description: string[];
  concept: string;
  reveal: Record<CTCStage, string>;
  starterQuestionSuggestions: Record<CTCStage, string[]>;
}

interface HintResult {
  hint: string;
  hintLevel: number;
  source: 'firebase' | 'llm';
  concept: string;
  section: CTCStage;
  shouldRevealSolution?: boolean;
  nextSuggestedAction?: string;
  personalizedReason?: string;
}

interface HistoryItem {
  interactionId: string;
  programId: string;
  section: CTCStage;
  studentInput: string;
  hint: string;
  hintLevel: number;
  source: 'firebase' | 'llm';
  concept?: string;
  timestamp: number;
}

const PROBLEMS: Record<string, Problem> = {
  'sum-natural-numbers': {
    id: 'sum-natural-numbers',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 1',
    shortTitle: 'Sum of N Natural Numbers',
    title: 'Write a program to find the sum of n natural numbers.',
    description: [
      'Write a program to calculate the sum of the first n natural numbers.',
      'The program should take an integer input n from the user.',
      'The input n should be a positive integer.',
      'The program should calculate the sum of all natural numbers from 1 to n.',
      'The sum should be calculated by step-by-step sequential accumulation.'
    ],
    concept: 'Sequential Accumulation',
    reveal: {
      logic: 'Natural numbers start from 1. To sum the first n natural numbers, we sequentially combine every counting number from 1 up through n into a growing total.',
      recipe: '1. Get the input number n.\n2. Start with total sum as 0 and current number as 1.\n3. Move to the next number and repeat until reaching n.\n4. Add the current number to the total sum.\n5. Display the final total sum.',
      ingredients: 'Variables: n (input integer), sum (accumulator initialized to 0), i (loop counter initialized to 1).\nConstructs: while loop / for loop, addition operator (+), assignment operator (=).',
      samplecode: `n = int(input())\nsum_val = 0\nfor i in range(1, n + 1):\n    sum_val += i\nprint(sum_val)`
    },
    starterQuestionSuggestions: {
      logic: [
        'What should we do to find the sum of N numbers?',
        "I don't know",
        'What are natural numbers?',
        'Can we use formula n * (n + 1) / 2?'
      ],
      recipe: [
        'What should I do here?',
        'Step 1: Get the input number n',
        'Step 2: Start with total sum as 0 and current number as 1',
        'Step 3: Move to the next number and repeat until reaching n'
      ],
      ingredients: [
        'What do I do here?',
        'Step 1: Variable for input n',
        'Step 2: Variable sum = 0',
        'Step 3: For loop (start: 1, end: n, next step: +1)',
        'Step 4: sum = sum + i'
      ],
      samplecode: [
        'Do I need to write the code here?',
        'How to trace for n = 5',
        'n = int(input())\nsum_val = 0\nfor i in range(1, n + 1):\n    sum_val += i\nprint(sum_val)'
      ]
    }
  },
  'factorial': {
    id: 'factorial',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 3',
    shortTitle: 'Factorial of a Number',
    title: 'Write a program to find the factorial of a number.',
    description: [
      'Write a program to calculate the factorial of a given positive integer n (denoted as n!).',
      'The factorial of n is the product of all positive integers from 1 up to n (1 × 2 × 3 × ... × n).',
      'By mathematical definition, 0! = 1 and 1! = 1.',
      'Take input integer n from the user.',
      'Calculate the sequential product using a loop and display the final factorial value.'
    ],
    concept: 'Sequential Product & Accumulation',
    reveal: {
      logic: 'Factorial of N (N!) is the product of all whole numbers from 1 to N. We start with total product = 1 (not 0) and sequentially multiply each number from 1 to N into the product variable.',
      recipe: '1. Step 1: Accept a number as input.\n2. Step 2: Generate all numbers from 1 up to the input number.\n3. Step 2.1: Multiply each generated number with the factorial variable (fact = fact * i).\n4. Step 3: Print the final factorial value outside the loop.',
      ingredients: 'Variables: n for input number, fact initialized to 1.\nConstructs: For loop with Start: 1 (i), Stop: n, Next step: +1.\nOperation: fact = fact * i.\nOutput: Print the final value of fact.',
      samplecode: `var n = 5;\nvar fact = 1;\nfor (var i = 1; i <= n; i++) {\n  fact = fact * i;\n}\nprint(fact);`
    },
    starterQuestionSuggestions: {
      logic: [
        'what should we do to find the factorial of a number',
        "I don't know",
        'we multiply 1 to 5 one by one',
        'start fact with 1 and for every number from 1 to N multiply that number to fact'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Accept a number as input',
        'step 2 : Generate all numbers from 1 up to the input number',
        'step 2.1 : Multiply each generated number with the factorial variable',
        'step 3 : Print the final factorial value'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : n for input number, fact initialized to 1',
        'step 2 : For loop with Start: 1 (i), Stop: n, Next step: +1',
        'step 2.1 : fact = fact * i',
        'step 3 : Print the final value of fact'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var n = 5;\nvar fact = 1;\nfor (var i = 1; i <= n; i++) {\n  fact = fact * i;\n}\nprint(fact);'
      ]
    }
  },
  'odd-even': {
    id: 'odd-even',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 2',
    shortTitle: 'Odd or Even',
    title: 'Write a program to check if an integer is odd or even.',
    description: [
      'Write a program to determine if an integer is odd or even.',
      'Even numbers are divisible by 2 with remainder 0.',
      'Odd numbers leave remainder 1 when divided by 2.'
    ],
    concept: 'Modulo Operator & Parity',
    reveal: {
      logic: 'Even numbers are perfectly divisible by 2 leaving a remainder of 0. Odd numbers leave a remainder of 1 when divided by 2.',
      recipe: '1. Take input number n.\n2. Calculate remainder r = n % 2.\n3. If r == 0, print Even; else print Odd.',
      ingredients: 'Variable: num.\nOperators: % (modulo), == (equality comparison).\nConstruct: if-else statement.',
      samplecode: `num = int(input())\nif num % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")`
    },
    starterQuestionSuggestions: {
      logic: ['How does modulo 2 determine even or odd?', 'Why is division / not suitable?', 'What remainder does an odd number leave?'],
      recipe: ['What is the step-by-step algorithm?', 'Do I need a loop or just a condition?'],
      ingredients: [
        'What do I do here?',
        'Step 1: Variable for input',
        'What operator gives the remainder?',
        'How do I use if-else condition?',
        'What condition compares remainder to 0?'
      ],
      samplecode: [
        'Do I need to write the code here?',
        'Step 1: Set sample input a = 10',
        'Step 2: Write if (a % 2 == 0)',
        'Step 3 & 4: Add print even and else print odd',
        'How to trace test case with 10 and 7?'
      ]
    }
  },
  'divisor-of-a-number': {
    id: 'divisor-of-a-number',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 4',
    shortTitle: 'Divisors of a Number',
    title: 'Write a program to find all divisors of a number.',
    description: [
      'Write a program to find and display all the divisors of a given positive integer n.',
      'A divisor is an integer that divides n completely without leaving a remainder (n % i == 0).',
      'Divisors of n must lie between 1 and n inclusive.',
      'Take input integer n from the user.',
      'Test each number from 1 to n and display all divisors.'
    ],
    concept: 'Divisibility & Modulo Division',
    reveal: {
      logic: 'Divisors of a number are all positive whole numbers from 1 to n that divide n evenly with remainder 0. For example, for 6, the divisors are 1, 2, 3, 6.',
      recipe: '1. Step 1: Accept a number as input.\n2. Step 2: For every number from 1 up to the given number (include the number itself, start from 1 not 0).\n3. Step 2.1: Check if dividing the given number by the current number leaves a remainder of 0.\n4. Step 2.2: If the remainder is 0, record / display the current number as a divisor.',
      ingredients: 'Variables: n for input number.\nConstructs: For loop with Start: 1 (i), Stop: n (i <= n), Step: +1.\nCondition: if (n % i == 0).\nOutput: print(i) to display the divisor.',
      samplecode: `var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    print(i);\n  }\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what should we do to find the divisor of a number',
        "I don't know",
        "test each number from 1 to the given number, and if the remainder is 0, it's a divisor",
        '1, 2, 3, 6 are divisors of 6'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get the input number',
        'step 2 : For every number from 1 up to the given number',
        'step 2.1 : Check if dividing the given number by the current number leaves a remainder of 0',
        'step 2.2 : If the remainder is 0, note down the number'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : n for input number',
        'step 2 : For loop with Start: 1 (i), Stop: n, Next step: +1',
        'step 2.1 : if (n % i == 0)',
        'step 2.2 : print(i)'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var a=4',
        'how to start\nvar a=4',
        'var a = 4;\nfor (var i = 1; i <= a; i++)',
        'var a = 4;\nfor (var i = 1; i <= a; i++) {\n  if (a % i == 0) {\n    print(i);\n  }\n}',
        'var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    print(i);\n  }\n}',
        'why we write i = 1 and not i = 0'
      ]
    }
  },
  'multiplication-table': {
    id: 'multiplication-table',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 5',
    shortTitle: 'Multiplication Table',
    title: 'Write a program to generate the multiplication table of a number.',
    description: [
      'Write a program to calculate and display the multiplication table of a given positive integer n.',
      'A multiplication table shows the product of the fixed number n multiplied consecutively by numbers from 1 to 10.',
      'Take input integer n from the user.',
      'Calculate n × i for each multiplier i from 1 up to 10 and display the formatted output (e.g., 5 x 1 = 5).'
    ],
    concept: 'Sequential Multiplication & Repetition',
    reveal: {
      logic: 'A multiplication table shows the product of a fixed number multiplied sequentially by numbers from 1 up to a limit (like 10). For example, for 5: 5 × 1 = 5, 5 × 2 = 10, ... up to 5 × 10 = 50.',
      recipe: '1. Step 1: Get the input number for the table.\n2. Step 2: Take multiplier numbers starting from 1 up to 10.\n3. Step 2.1: Multiply the input number by the current multiplier.\n4. Step 2.2: Display the multiplier and the calculated product.\n5. Step 2.3: Repeat the process until the multiplier reaches 10.',
      ingredients: 'Variables: n for the table number.\nConstructs: For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++).\nCalculation: product = n * i.\nOutput: print statement inside the loop showing n, i, and product.',
      samplecode: `var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + " x " + i + " = " + product);\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what should we do to generate the multiplication table of a number',
        "I don't know / puriyala",
        'keep the given number fixed and multiply it with each number from 1 up to the limit to get the product',
        'for any step we calculate result = number * multiplier'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get the input number for the table',
        'step 2 : Take multiplier numbers starting from 1 up to 10',
        'step 2.1 : Multiply the input number by the current multiplier',
        'step 2.2 : Display the multiplier and the calculated product'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : n for the table number',
        'step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)',
        'step 2.1 : product = n * i',
        'step 2.2 : print statement inside the loop showing n, i, and product'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + " x " + i + " = " + product);\n}',
        'var n = 5;\nfor (var i = 0; i <= 10; i++)',
        'var n = 5;\nfor (var i = 1; i < 10; i++)'
      ]
    }
  },
  'prime-number': {
    id: 'prime-number',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 6',
    shortTitle: 'Prime Number Checker',
    title: 'Write a program to check whether a number is prime.',
    description: [
      'Write a program to check if an integer n is a prime number.',
      'A prime number is a number greater than 1 with no positive divisors other than 1 and itself.',
      'Take input integer n from the user.',
      'Output "Prime" if n is prime, otherwise output "Not Prime".'
    ],
    concept: 'Divisibility & Factor Counting',
    reveal: {
      logic: 'A prime number has exactly 2 distinct positive factors: 1 and itself. If any number between 2 and n-1 divides n with remainder 0, n is not prime.',
      recipe: '1. Take input n.\n2. If n <= 1, it is not prime.\n3. Count how many numbers from 1 to n divide n evenly (remainder == 0).\n4. If count is exactly 2, print Prime; otherwise print Not Prime.',
      ingredients: 'Variables: n (integer input), count (factor tally initialized to 0), i (loop divisor from 1 to n).\nConstructs: for loop, modulo operator (%), if condition (== 0), print statement.',
      samplecode: `n = int(input())\nif n <= 1:\n    print("Not Prime")\nelse:\n    count = 0\n    for i in range(1, n + 1):\n        if n % i == 0:\n            count += 1\n    if count == 2:\n        print("Prime")\n    else:\n        print("Not Prime")`
    },
    starterQuestionSuggestions: {
      logic: ["I don't understand prime number", 'How do I know if a number is prime?', 'What makes 2 the only even prime?'],
      recipe: ['I know I need to check divisibility, but what should I do next?', 'How do I sequence the condition checks?', 'What is the order of steps?'],
      ingredients: ['Why do I need count?', 'Why do I need a loop?', 'Which operator checks for divisibility?'],
      samplecode: ['My output is wrong for 6', 'How do I trace execution for input 5?', 'Why does 1 say Prime in my code?']
    }
  },
  'next-prime-number': {
    id: 'next-prime-number',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 7',
    shortTitle: 'Next Prime Number',
    title: 'Write a program to find the next prime number.',
    description: [
      'Write a program to find and display the next prime number strictly greater than a given positive integer n.',
      'A prime number is a positive integer greater than 1 with no positive divisors other than 1 and itself.',
      'Take input integer n from the user.',
      'Start testing candidate numbers sequentially from n + 1 (or 2 if n < 2).',
      'The first prime number found is the next prime number. Display that prime number and stop.'
    ],
    concept: 'Incremental Search & Primality Testing',
    reveal: {
      logic: 'To find the next prime number after n, we start testing candidate numbers from n + 1 (if n < 2, start at 2). For each candidate, we check if it is prime by verifying that no number from 2 up to candidate - 1 divides it evenly. The very first prime number encountered is our answer.',
      recipe: '1. Step 1: Get the input number n from the user.\n2. Step 2: Start candidate number as n + 1 (if candidate < 2, candidate = 2).\n3. Step 3: Check if the candidate number is prime.\n4. Step 3.1: If the candidate is prime, display candidate as the next prime and stop.\n5. Step 3.2: If the candidate is not prime, increase candidate by 1 and repeat from Step 3.',
      ingredients: 'Variables: n for input number, candidate = n + 1.\nConstructs: while (true) loop for outer candidate search, boolean isPrime flag, inner for loop with Start: 2 (i), Stop: candidate - 1 (i < candidate), Step: +1.\nCondition: if (candidate % i == 0) -> isPrime = false; break.\nVerdict: if (isPrime) -> print(candidate); break; else -> candidate++;',
      samplecode: `var n = 7;\nvar candidate = n + 1;\nif (candidate < 2) candidate = 2;\nwhile (true) {\n  var isPrime = true;\n  for (var i = 2; i < candidate; i++) {\n    if (candidate % i == 0) {\n      isPrime = false;\n      break;\n    }\n  }\n  if (isPrime) {\n    print(candidate);\n    break;\n  } else {\n    candidate++;\n  }\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what should we do to find the next prime number',
        "I don't know / puriyala",
        'start from n + 1 and test each candidate number one by one until finding a prime',
        'for n = 7, candidate starts at 8, 9, 10, then 11 is prime'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get the input number n',
        'step 2 : Start candidate number as n + 1',
        'step 3 : Check if candidate number is prime',
        'step 3.1 : If candidate is prime, display candidate and stop',
        'step 3.2 : If candidate is not prime, increase candidate by 1 and repeat'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : Variables n and candidate = n + 1',
        'step 2 : while (true) loop for searching candidates',
        'step 3 : isPrime = true flag and inner for loop from 2 to candidate - 1',
        'step 3.1 : if (candidate % i == 0) isPrime = false',
        'step 4 : if (isPrime) print candidate and break, else candidate++'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var n = 7;\nvar candidate = n + 1;\nwhile (true) {\n  var isPrime = true;\n  for (var i = 2; i < candidate; i++) {\n    if (candidate % i == 0) {\n      isPrime = false;\n      break;\n    }\n  }\n  if (isPrime) {\n    print(candidate);\n    break;\n  } else {\n    candidate++;\n  }\n}'
      ]
    }
  },
  'prime-between-range': {
    id: 'prime-between-range',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 8',
    shortTitle: 'Prime Numbers in Range',
    title: 'Write a program to find all prime numbers in a given range.',
    description: [
      'Write a program to find and display all prime numbers within a given range [start, end].',
      'The program takes two integer inputs: start (lower bound) and end (upper bound).',
      'For every number in this range, verify if it is prime (has exactly 2 unique divisors: 1 and itself).',
      'Output all prime numbers found in the range.'
    ],
    concept: 'Nested Loops & Range Primality Testing (Divisor count == 2)',
    reveal: {
      logic: 'A prime number can only be divided by 1 and itself (2 unique divisors). To find all primes in a range, iterate through every number from start to end, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2, it is a Prime Number.',
      recipe: '1. Step 1: Get starting number and ending number (start, end).\n2. Step 2: For each number in the range from start up to end:\n3. Step 2.1: Start divisor count at 0 for the current number.\n4. Step 2.2: Test every number from 1 up to the current number.\n5. Step 2.3: If dividing leaves a remainder of 0, increase divisor count by 1.\n6. Step 2.4: If divisor count is exactly 2, record / display the current number as prime.',
      ingredients: 'Variables: start and end for range limits, num for range iterator.\nConstructs: Outer for loop (start to end), count = 0 inside outer loop, inner for loop (i = 1 to num).\nCondition: if (num % i == 0) { count++; }\nVerdict: if (count == 2) { print(num); }',
      samplecode: `var start = 10;\nvar end = 20;\nfor (var num = start; num <= end; num++) {\n  var count = 0;\n  for (var i = 1; i <= num; i++) {\n    if (num % i == 0) {\n      count++;\n    }\n  }\n  if (count == 2) {\n    print(num);\n  }\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what should we do to find prime numbers in a range',
        "I don't know / puriyala",
        'for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime',
        'why must the count of divisors be exactly 2',
        'between 10 and 20, 11 and 13 have 2 divisors so they are prime'
      ],
      recipe: [
        'what should i do here',
        'Step 1: Get starting number and ending number',
        'Step 2: For each number in the range from start up to end',
        'Step 2.1: Start divisor count at 0 for the current number',
        'Step 2.2: Test every number from 1 up to the current number',
        'Step 2.3: If dividing leaves a remainder of 0, increase divisor count by 1',
        'Step 2.4: If divisor count is exactly 2, record / display the current number as prime'
      ],
      ingredients: [
        'what do I do here',
        'Step 1: Variables start, end, num',
        'Step 2: Outer for loop (start: start, stop: num <= end, step: +1)',
        'Step 3: count = 0 inside outer loop',
        'Step 4: Inner for loop (start: 1, stop: i <= num, step: +1)',
        'Step 5: if (num % i == 0) count++',
        'Step 6: if (count == 2) print(num)'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var start = 10;\nvar end = 20;\nfor (var num = start; num <= end; num++) {\n  var count = 0;\n  for (var i = 1; i <= num; i++) {\n    if (num % i == 0) count++;\n  }\n  if (count == 2) print(num);\n}'
      ]
    }
  },
  'sexy-prime': {
    id: 'sexy-prime',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 8',
    shortTitle: 'Sexy Prime Pairs',
    title: 'Write a program to find Sexy Prime number pairs.',
    description: [
      'Write a program to find and display all pairs of prime numbers that differ from each other by six (p, p + 6).',
      'Sexy prime pairs are pairs of prime numbers (p, p + 6) such that both p and p + 6 are prime numbers.',
      'For example, (5, 11), (7, 13), (11, 17), (13, 19), (17, 23), and (23, 29) are sexy prime pairs.',
      'Take an upper limit integer n, and find all pairs (p, p + 6) where p + 6 <= n.'
    ],
    concept: 'Paired Primality & Offset Testing (diff = 6)',
    reveal: {
      logic: 'Sexy primes are pairs of prime numbers of the form (p, p + 6). A pair is valid only when BOTH p is prime and p + 6 is prime (each having exactly 2 divisors).',
      recipe: '1. Step 1: Get the upper limit n.\n2. Step 2: For each number p from 2 up to n - 6:\n3. Step 2.1: Check if p is a prime number (divisor count == 2).\n4. Step 2.2: If p is prime, check if p + 6 is also a prime number (divisor count == 2).\n5. Step 2.3: If both p and p + 6 are prime, display the pair (p, p + 6).',
      ingredients: 'Variables: n for limit, p for first candidate, q for second candidate (q = p + 6), count1 and count2 for divisor counters.\nConstructs: Outer for loop (p from 2 to n - 6), inner divisor loops (1 to p, and 1 to q).\nCondition: if (count1 == 2 && count2 == 2) -> print(p, q)',
      samplecode: `var n = 30;\nfor (var p = 2; p <= n - 6; p++) {\n  var count1 = 0;\n  for (var i = 1; i <= p; i++) {\n    if (p % i == 0) count1++;\n  }\n  if (count1 == 2) {\n    var q = p + 6;\n    var count2 = 0;\n    for (var j = 1; j <= q; j++) {\n      if (q % j == 0) count2++;\n    }\n    if (count2 == 2) {\n      print("(" + p + ", " + q + ")");\n    }\n  }\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is sexy prime number',
        'is 5 and 11 a sexy prime pair',
        'what if p is prime but p+6 is not prime',
        'what is the upper bound condition',
        'for each number p up to n-6 check if both p and p+6 are prime'
      ],
      recipe: [
        'what should i do here',
        'step 1 : get upper limit n',
        'step 2 : for each number p from 2 up to n - 6',
        'step 3 : check if p is a prime number',
        'step 4 : check if p + 6 is also a prime number',
        'step 5 : display the pair (p, p + 6)'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : n for limit, p for first candidate, q = p + 6',
        'step 2 : outer for loop with Start: 2, Stop: n - 6, Step: +1',
        'step 3 : count1 = 0 for p, count2 = 0 for p + 6',
        'step 4 : if (p % i == 0) count1++ and if ((p+6) % j == 0) count2++',
        'step 5 : if (count1 == 2 && count2 == 2) print pair (p, p + 6)'
      ],
      samplecode: [
        'Do I need to write the code here',
        'for (var p = 2; p <= n - 6; p++)',
        'can we use same count variable for both numbers',
        'var n = 30;\nfor (var p = 2; p <= n - 6; p++) {\n  var count1 = 0;\n  for (var i = 1; i <= p; i++) {\n    if (p % i == 0) count1++;\n  }\n  if (count1 == 2) {\n    var q = p + 6;\n    var count2 = 0;\n    for (var j = 1; j <= q; j++) {\n      if (q % j == 0) count2++;\n    }\n    if (count2 == 2) {\n      print("(" + p + ", " + q + ")");\n    }\n  }\n}'
      ]
    }
  },
  'positive-negative': {
    id: 'positive-negative',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 9',
    shortTitle: 'Positive or Negative',
    title: 'Write a program to check if a number is positive or negative.',
    description: [
      'Write a program to determine whether a given integer n is positive or negative.',
      'Numbers greater than 0 are positive (n > 0).',
      'Numbers less than 0 are negative (n < 0).',
      'Zero (0) is neither positive nor negative.',
      'Take input integer n from the user and display whether it is Positive, Negative, or Zero.'
    ],
    concept: 'Comparison Operators & Multi-way Branching (> , < , ==)',
    reveal: {
      logic: 'Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative. We test the number against 0 using comparison operators (> or <).',
      recipe: '1. Step 1: Get input number n from the user.\n2. Step 2: If the number is greater than 0, display "Positive".\n3. Step 3: Else if the number is less than 0, display "Negative".\n4. Step 4: Else, display "Zero".',
      ingredients: 'Variables: n for input number.\nOperators: > (greater than), < (less than), == (equality).\nConstructs: if - else if - else conditional structure.\nOutput: print("Positive"), print("Negative"), print("Zero").',
      samplecode: `var n = 5;\nif (n > 0) {\n  print("Positive");\n} else if (n < 0) {\n  print("Negative");\n} else {\n  print("Zero");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is a positive number and negative number',
        'give examples of positive and negative numbers',
        'is 0 positive or negative',
        'positive numbers are greater than 0 (e.g. 1, 2, 5), negative numbers are less than 0 (e.g. -1, -2, -5)'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get input number n',
        'step 2 : If n is greater than 0 display Positive',
        'step 3 : Else if n is less than 0 display Negative',
        'step 4 : Else display Zero'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : Variable n for input\nstep 2 : If condition with L.S: n, Operator: >, R.S: 0\nstep 3 : Inside if block: print("Positive")\nstep 4 : Inside else block: print("Negative")',
        'step 1 : Variable n for input',
        'step 2 : If condition with Left side (L.S): n, Operator: >, Right side (R.S): 0',
        'step 3 : Inside if block: print("Positive") and Inside else block: print("Negative")'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var n = 5;\nif (n > 0) {\n  print("Positive");\n} else {\n  print("Negative");\n}'
      ]
    }
  },
  'three-digit-number': {
    id: 'three-digit-number',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 10',
    shortTitle: 'Three-Digit Number',
    title: 'Write a program to check whether a given number is a 3-digit number or not.',
    description: [
      'Write a program to check whether a given integer is a 3-digit number or not.',
      'A 3-digit number has exactly 3 digits and ranges from 100 to 999 inclusive (100 <= n <= 999).',
      'Take an integer input n from the user.',
      'Check both boundaries using a compound condition (n >= 100 && n <= 999).',
      'Display "3-digit number" if valid, else display "Not a 3-digit number".'
    ],
    concept: 'Relational & Compound Logical Operators (n >= 100 && n <= 999)',
    reveal: {
      logic: 'A 3-digit number has 3 digits and ranges from 100 up to 999 inclusive (e.g., 100, 250, 456, 999). We test if the number is greater than or equal to 100 AND less than or equal to 999 (100 <= n <= 999).',
      recipe: '1. Step 1: Get input number n.\n2. Step 2: Check if n is greater than or equal to 100 and less than or equal to 999.\n3. Step 3: If true, display "3-digit number".\n4. Step 4: Else, display "Not a 3-digit number".',
      ingredients: 'Variables: n for input number.\nOperators: >=, <=, && (logical AND).\nConstructs: if - else conditional structure.\nOutput: print("3-digit number"), print("Not a 3-digit number").',
      samplecode: `var n = 456;\nif (n >= 100 && n <= 999) {\n  print("3-digit number");\n} else {\n  print("Not a 3-digit number");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is a 3-digit number',
        'how to check if a number is a 3-digit number',
        'a 3-digit number is between 100 and 999 inclusive (e.g. 250 is 3-digit, 45 is not)',
        'what if number is 99 or 1000'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get input number n',
        'step 2 : If n is greater than or equal to 100 and less than or equal to 999 display 3-digit number, else display Not a 3-digit number',
        'step 1: Get input number n\nstep 2: Check if n is between 100 and 999\nstep 3: If true, display "3-digit number"\nstep 4: Else, display "Not a 3-digit number"'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : Variable n for input\nstep 2 : If condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Op: && (n >= 100 && n <= 999)\nstep 3 : Inside if block: print("3-digit number")\nstep 4 : Inside else block: print("Not a 3-digit number")',
        'step 1 : Variable n for input',
        'step 2 : If condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Operator: &&',
        'step 3 : Inside if block: print("3-digit number") and Inside else block: print("Not a 3-digit number")'
      ],
      samplecode: [
        'Do I need to write the code here',
        'var n = 456;\nif (n >= 100 && n <= 999) {\n  print("3-digit number");\n} else {\n  print("Not a 3-digit number");\n}'
      ]
    }
  },
  'voting-eligibility': {
    id: 'voting-eligibility',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 11',
    shortTitle: 'Voting Eligibility',
    title: 'Write a program to check whether a person is eligible to vote or not.',
    description: [
      'Write a program to check whether a person is eligible to vote based on their age.',
      'A person is eligible to vote if their age is 18 years or above (age >= 18).',
      'Take an integer input age from the user.',
      'Check if age is greater than or equal to 18 (age >= 18).',
      'Display "Eligible" if the person can vote, else display "Not Eligible".'
    ],
    concept: 'Relational Operator & Branching (age >= 18)',
    reveal: {
      logic: 'A person must be 18 years old or above (age >= 18) to be eligible to vote. We compare the person\'s age with 18 using comparison operator >=. If age >= 18 -> Eligible to Vote, else -> Not Eligible.',
      recipe: '1. Step 1: Get input age.\n2. Step 2: If age is greater than or equal to 18, display Eligible, else display Not Eligible.',
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 18).\nOutput: print("Eligible"), print("Not Eligible").',
      samplecode: `var age = 20;\nif (age >= 18) {\n  print("Eligible");\n} else {\n  print("Not Eligible");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is voting eligibility age',
        'how to check if a person can vote',
        'a person must be 18 years old or above (age >= 18) to vote. Ex: age 20 is eligible, age 16 is not',
        'what if age is exactly 18'
      ],
      recipe: [
        'what should i do here',
        'step 1 : Get input age',
        'step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible',
        'step 1: Get input age\nstep 2: Check if age >= 18\nstep 3: If true, display Eligible\nstep 4: Else, display Not Eligible'
      ],
      ingredients: [
        'what do I do here',
        'step 1 : age variable',
        'how to write if condition',
        'step 1 : age variable\nstep 2 : If condition with L.S: age, R.S: 18, Operator: >=\nstep 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")',
        'step 2 : If condition with L.S: age, R.S: 18, Operator: >='
      ],
      samplecode: [
        'how to write sample code',
        'var age = 20;\nif (age >= 18) {\n  print("Eligible");\n} else {\n  print("Not Eligible");\n}'
      ]
    }
  },
  'pass-or-fail': {
    id: 'pass-or-fail',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 12',
    shortTitle: 'Pass or Fail',
    title: 'Write a program to check whether a student passed or failed based on their mark.',
    description: [
      'Write a program to check whether a student has Passed or Failed based on their marks.',
      'A student passes if their mark is 35 or above (mark >= 35); otherwise they Fail.',
      'Take an integer input mark from the user.',
      'Check if mark is greater than or equal to 35 (mark >= 35).',
      'Display "Pass" if the student passed, else display "Fail".'
    ],
    concept: 'Relational Operator & Branching (mark >= 35)',
    reveal: {
      logic: 'A student must score 35 marks or above (mark >= 35) to pass. We compare the student\'s mark with 35 using comparison operator >=. If mark >= 35 -> Pass, else -> Fail.',
      recipe: '1. Step 1: Get mark input.\n2. Step 2: If mark is greater than or equal to 35, display Pass, else display Fail.',
      ingredients: 'Variables: mark for input mark.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: mark, Operator: >=, R.S: 35).\nOutput: print("Pass"), print("Fail").',
      samplecode: `var mark = 45;\nif (mark >= 35) {\n  print("Pass");\n} else {\n  print("Fail");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what mark is pass',
        'how to check if student passed',
        'if mark is 35 or more it is pass else fail',
        'what if mark is exactly 35'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get mark input',
        'step 2 : If mark is greater than or equal to 35, display Pass, else display Fail'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : mark variable',
        'how to write if condition',
        'step 2 : If condition with L.S: mark, R.S: 35, Operator: >='
      ],
      samplecode: [
        'how to write sample code',
        'var mark = 45;\nif (mark >= 35) {\n  print("Pass");\n} else {\n  print("Fail");\n}'
      ]
    }
  },
  'greater-than-100': {
    id: 'greater-than-100',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 13',
    shortTitle: 'Greater Than 100',
    title: 'Write a program to check whether a given number is greater than 100 or not.',
    description: [
      'Write a program to check whether a given number is Greater than 100 or Not.',
      'A number is greater than 100 if num > 100; otherwise it is Not greater than 100.',
      'Take an integer input num from the user.',
      'Check if num is strictly greater than 100 (num > 100).',
      'Display "Greater than 100" if true, else display "Not greater than 100".'
    ],
    concept: 'Relational Operator & Branching (num > 100)',
    reveal: {
      logic: 'Take a number and compare it with 100 using the greater than operator (>). If num > 100 -> Greater, otherwise Not Greater.',
      recipe: '1. Step 1: Get number input.\n2. Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100.',
      ingredients: 'Variables: num for input number.\nOperators: > (greater than).\nConstructs: if - else conditional structure (L.S: num, Operator: >, R.S: 100).\nOutput: print("Greater than 100"), print("Not greater than 100").',
      samplecode: `var num = 120;\nif (num > 100) {\n  print("Greater than 100");\n} else {\n  print("Not greater than 100");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'how to check if number is greater than 100',
        'what if number is 100',
        'if number is greater than 100 it is greater else not greater'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get number input',
        'step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : num variable',
        'how to write if condition',
        'step 2 : If condition with L.S: num, R.S: 100, Operator: >'
      ],
      samplecode: [
        'how to write sample code',
        'var num = 120;\nif (num > 100) {\n  print("Greater than 100");\n} else {\n  print("Not greater than 100");\n}'
      ]
    }
  },
  'profit-or-loss': {
    id: 'profit-or-loss',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 14',
    shortTitle: 'Profit or Loss',
    title: 'Write a program to determine Profit or Loss based on Cost Price and Selling Price.',
    description: [
      'Write a program to determine whether a transaction results in Profit or Loss.',
      'Take two numbers as input: Cost Price (CP) and Selling Price (SP).',
      'Example with numbers: If Cost Price is 50 and Selling Price is 100, Selling Price is higher, so it is a Profit of 50! If Cost Price is 100 and Selling Price is 70, Cost Price is higher, so it is a Loss of 30!',
      'In everyday logic: When Selling Price > Cost Price, it is Profit; otherwise (or when Cost Price > Selling Price), it is Loss.',
      'Display "Profit" if SP > CP, otherwise display "Loss".'
    ],
    concept: 'Conditional Statements & Comparison (Selling Price vs Cost Price)',
    reveal: {
      logic: 'Take an example with numbers: Cost Price = 50, Selling Price = 100. Since Selling Price (100) > Cost Price (50), it is a Profit of 50! If Cost Price > Selling Price, it is a Loss. Rule: If Selling Price is greater than Cost Price it is Profit, otherwise Loss.',
      recipe: '1. Step 1: Get cost price and selling price.\n2. Step 2: If selling price is greater than cost price, display Profit, else display Loss.',
      ingredients: 'Variables: cp (cost price) and sp (selling price).\nOperators: > (greater than).\nConstructs: if - else conditional structure (L.S: sp, Operator: >, R.S: cp).\nOutput: print("Profit"), print("Loss").',
      samplecode: `var cp = 100;\nvar sp = 150;\nif (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'how to calculate profit or loss with an example of numbers',
        'the cost price is 50 and selling price is 100. if selling price is greater than cost price it is profit else loss',
        'cost price is 50, selling price is 100. when cost price is greater than selling price it is loss, otherwise profit',
        'what if selling price and cost price are equal'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get cost price and selling price',
        'step 2 : If selling price is greater than cost price, display Profit, else display Loss',
        'how to start recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : cp and sp variables',
        'how to write if condition',
        'step 2 : If condition with L.S: sp, R.S: cp, Operator: >',
        'step 3 : Inside if block: print("Profit")'
      ],
      samplecode: [
        'how to write sample code',
        'var cp = 100;\nvar sp = 150;\nif (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}',
        'where to start',
        'syntax theriyala'
      ]
    }
  },
  'leap-year': {
    id: 'leap-year',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 15',
    shortTitle: 'Leap Year or Not',
    title: 'Write a program to check if a given year is a Leap Year or Not.',
    description: [
      'Write a program to check if a given year is a Leap Year or Not.',
      'A leap year occurs every 4 years and has 366 days.',
      'In everyday logic: If a year is evenly divisible by 4 (i.e. year % 4 == 0), it is a Leap Year; otherwise, it is Not a Leap Year.',
      'Display "Leap Year" if year % 4 == 0, otherwise display "Not a Leap Year".'
    ],
    concept: 'Conditional Statements & Modulo Operator (year % 4 == 0)',
    reveal: {
      logic: 'Take an example: Year 2024. 2024 / 4 = 506 with remainder 0. Since 2024 % 4 == 0, it is a Leap Year! For 2023, 2023 % 4 = 3 (not 0), so it is Not a Leap Year. Rule: If year divided by 4 leaves remainder 0, it is a Leap Year, otherwise Not a Leap Year.',
      recipe: '1. Step 1: Get input year.\n2. Step 2: If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year.',
      ingredients: 'Variables: year for input year.\nOperators: % (modulo), == (equality).\nConstructs: if - else conditional structure (L.S: year % 4, Operator: ==, R.S: 0).\nOutput: print("Leap Year"), print("Not a Leap Year").',
      samplecode: `var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is a leap year',
        'how to check if a year is leap year',
        'if year % 4 == 0 it is leap year',
        'how many days does a leap year have'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get input year',
        'step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year',
        'how to start recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : year variable',
        'how to write if condition',
        'step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==',
        'step 3 : Inside if block: print("Leap Year")'
      ],
      samplecode: [
        'how to write sample code',
        'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
        'where to start',
        'how to write if condition for leap year'
      ]
    }
  },
  'adult-or-minor': {
    id: 'adult-or-minor',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 16',
    shortTitle: 'Adult or Minor',
    title: 'Write a program to check if a person is an Adult or Minor based on their age.',
    description: [
      'Write a program to check if a person is an Adult or Minor based on their age.',
      'A person is classified as an Adult if their age is 18 or older (age >= 18).',
      'Otherwise, if their age is under 18 (age < 18), they are classified as a Minor.',
      'Display "Adult" if age >= 18, otherwise display "Minor".'
    ],
    concept: 'Conditional Statements & Comparison Operator (age >= 18)',
    reveal: {
      logic: 'Take an example: Age 20. 20 >= 18 is true, so the person is an Adult! For Age 15, 15 >= 18 is false (15 < 18), so the person is a Minor. Rule: If age >= 18 display Adult, otherwise display Minor.',
      recipe: '1. Step 1: Get input age (e.g. 20).\n2. Step 2: Check if age >= 18.\n3. Step 3: Display Adult if true, else display Minor.',
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 18).\nOutput: print("Adult"), print("Minor").',
      samplecode: `var age = 20;\nif (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is adult or minor',
        'how to check if a person is adult or minor',
        'if age >= 18 then adult',
        'what is the minimum age to be an adult'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get input age',
        'step 2 : If age is 18 or older display Adult, else display Minor',
        'how to start recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : age variable',
        'how to write if condition',
        'step 2 : If condition with L.S: age, Operator: >=, R.S: 18',
        'step 3 : Inside if block: print("Adult")'
      ],
      samplecode: [
        'how to write sample code',
        'var age = 20;\nif (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}',
        'where to start',
        'how to write if condition for adult or minor'
      ]
    }
  },
  'divisible-by-5': {
    id: 'divisible-by-5',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 17',
    shortTitle: 'Divisible by 5 or Not',
    title: 'Write a program to check if a number is Divisible by 5 or Not.',
    description: [
      'Write a program to check if a given integer is divisible by 5 or not.',
      'A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0).',
      'Otherwise, if the remainder is not 0 (n % 5 != 0), it is not divisible by 5.',
      'Display "Divisible by 5" if n % 5 == 0, otherwise display "Not Divisible by 5".'
    ],
    concept: 'Conditional Statements & Modulo Operator (n % 5 == 0)',
    reveal: {
      logic: 'Take an example: Number 25. 25 % 5 = 0 (leaves remainder 0), so it is Divisible by 5! For 23, 23 % 5 = 3 != 0, so it is Not Divisible by 5. Rule: If n % 5 == 0 display Divisible by 5, otherwise Not Divisible by 5.',
      recipe: '1. Step 1: Get input number n (e.g. 25).\n2. Step 2: If number divided by 5 leaves remainder 0 (n % 5 == 0), display Divisible by 5, else display Not Divisible by 5.',
      ingredients: 'Variables: n for input number.\nOperators: % (modulo), == (equality).\nConstructs: if - else conditional structure (L.S: n % 5, Operator: ==, R.S: 0).\nOutput: print("Divisible by 5"), print("Not Divisible by 5").',
      samplecode: `var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'what is divisible by 5',
        'how to check if a number is divisible by 5',
        'if n % 5 == 0 then divisible by 5',
        'numbers ending in 0 or 5 are divisible'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get input number',
        'step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5',
        'how to start recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : n variable',
        'how to write if condition',
        'step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0',
        'step 3 : Inside if block: print("Divisible by 5")'
      ],
      samplecode: [
        'how to write sample code',
        'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}',
        'where to start',
        'how to write if condition for divisible by 5'
      ]
    }
  },
  'maximum-of-two': {
    id: 'maximum-of-two',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 18',
    shortTitle: 'Maximum of Two Numbers',
    title: 'Write a program to find the maximum (larger) of two given numbers.',
    description: [
      'Write a program to find the maximum (larger) of two given numbers.',
      'Get two numbers a and b from the user.',
      'Compare them: if a > b, then a is the maximum number.',
      'Otherwise (if b >= a), then b is the maximum number.',
      'Display the maximum number accordingly.'
    ],
    concept: 'Conditional Statements & Relational Operators (a > b)',
    reveal: {
      logic: 'Compare number a and number b using the greater-than operator (>). If a > b, a is greater (maximum); else b is greater (maximum). For example: with a = 25 and b = 10, 25 > 10 is true, so 25 is maximum.',
      recipe: '1. Step 1: Get two numbers a and b.\n2. Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.',
      ingredients: 'Variables: a and b for input variables.\nOperators: > (greater than comparison).\nConstructs: if - else conditional structure (L.S: a, Operator: >, R.S: b).\nOutput: print("a is max"), print("b is max").',
      samplecode: `var a = 10, b = 25;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'how to find maximum of two numbers',
        'if a > b then a is maximum else b is maximum',
        'what is greater than operator',
        'compare two numbers'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get two numbers a and b',
        'step 2 : If a is greater than b, display a is Maximum, else display b is Maximum',
        'how to compare two numbers in recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : a and b for input variables',
        'how to write if condition',
        'step 2 : If condition with L.S: a, R.S: b, Operator: >',
        'step 3 : Inside if block: print("a is max")'
      ],
      samplecode: [
        'how to write sample code',
        'var a = 10, b = 25;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}',
        'where to start',
        'how to compare a and b in code'
      ]
    }
  },
  'senior-citizen': {
    id: 'senior-citizen',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 19',
    shortTitle: 'Senior Citizen or Not',
    title: 'Write a program to check whether a person is a Senior Citizen or Not based on their age (age >= 60).',
    description: [
      'Write a program to check whether a person is a Senior Citizen or Not based on their age.',
      'Get an age value from the user.',
      'Check if age is 60 or above (age >= 60).',
      'If age is 60 or greater, display "Senior Citizen".',
      'Otherwise, display "Not Senior Citizen".'
    ],
    concept: 'Conditional Statements & Relational Operators (age >= 60)',
    reveal: {
      logic: 'A person aged 60 or above is considered a Senior Citizen. We test this using the relational comparison operator >= with 60 (age >= 60). If age >= 60 is true, the person is a Senior Citizen; otherwise, Not a Senior Citizen. For example: with age = 65, 65 >= 60 is true -> Senior Citizen. With age = 45, 45 >= 60 is false -> Not Senior Citizen.',
      recipe: '1. Step 1: Get age input.\n2. Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen.',
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to comparison).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 60).\nOutput: print("Senior Citizen"), print("Not Senior Citizen").',
      samplecode: `var age = 65;\nif (age >= 60) {\n  print("Senior Citizen");\n} else {\n  print("Not Senior Citizen");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'who is a senior citizen',
        'how to check senior citizen',
        'if age >= 60 senior citizen',
        'age 65 is senior citizen example'
      ],
      recipe: [
        'what steps to write',
        'step 1 : Get age input',
        'step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen',
        'how to write senior citizen algorithm'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : age variable',
        'how to write if condition',
        'step 2 : If condition with L.S: age, R.S: 60, Operator: >=',
        'step 3 : Inside if block: print("Senior Citizen")',
        'step 4 : Fallback else block',
        'step 5 : Inside else block: print("Not Senior Citizen")'
      ],
      samplecode: [
        'how to write sample code',
        'var age = 65; if (age >= 60) print("Senior Citizen"); else print("Not Senior Citizen");',
        'where to start',
        'how to check age 60 in code'
      ]
    }
  },
  'vowel-or-consonant': {
    id: 'vowel-or-consonant',
    category: 'fundamentals',
    phaseLabel: 'Phase 1: Fundamentals',
    problemNo: 'Problem 20',
    shortTitle: 'Vowel or Consonant',
    title: 'Write a program to check whether a given character is a Vowel or a Consonant.',
    description: [
      'Write a program to check whether a given character is a Vowel or a Consonant.',
      'Get a character ch from the user.',
      'Check if ch is equal to any of the vowels: \'a\', \'e\', \'i\', \'o\', or \'u\' (case-insensitive).',
      'If ch matches any vowel, display "Vowel".',
      'Otherwise, display "Consonant".'
    ],
    concept: 'Conditional Logic & Logical OR Operator (ch == \'a\' || ch == \'e\' || ...)',
    reveal: {
      logic: 'Check if character ch is equal to \'a\', \'e\', \'i\', \'o\', or \'u\'. We use logical OR (||) because matching ANY ONE vowel makes it a Vowel. If it matches none of them, it is a Consonant.',
      recipe: '1. Step 1: Get character input ch from the user.\n2. Step 2: If ch is equal to \'a\', \'e\', \'i\', \'o\', or \'u\', display Vowel, else display Consonant.',
      ingredients: 'Variables: ch for input character.\nOperators: == (equality) and || (logical OR).\nConstructs: if - else conditional structure.\nOutput: print("Vowel"), print("Consonant").',
      samplecode: `var ch = 'e';\nif (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n  print("Vowel");\n} else {\n  print("Consonant");\n}`
    },
    starterQuestionSuggestions: {
      logic: [
        'how to check if a character is a vowel or consonant',
        'vowels are a, e, i, o, u and rest are consonants',
        'why use OR operator for vowels',
        'check character against vowels'
      ],
      recipe: [
        'what steps to write in recipe',
        'step 1 : Get character input ch from user',
        'step 2 : If ch is equal to a, e, i, o, or u display Vowel, else display Consonant',
        'how to write vowel check step in recipe'
      ],
      ingredients: [
        'what ingredients do we need',
        'step 1 : ch variable for character',
        'step 2 : If condition checking ch == \'a\' || ch == \'e\' || ch == \'i\' || ch == \'o\' || ch == \'u\'',
        'step 3 : Inside if block: print("Vowel")',
        'step 4 : Fallback else block',
        'step 5 : Inside else block: print("Consonant")'
      ],
      samplecode: [
        'how to write sample code for vowel or consonant',
        'var ch = \'e\';\nif (ch == \'a\' || ch == \'e\' || ch == \'i\' || ch == \'o\' || ch == \'u\') {\n  print("Vowel");\n} else {\n  print("Consonant");\n}',
        'how to test vowel or consonant code'
      ]
    }
  }
};

const USERS = [
  { id: 'student_alex', name: 'Alex Rivera', role: 'Level 1: Logic Apprentice' },
  { id: 'student_priya', name: 'Priya Sharma', role: 'Level 2: Recipe Planner' },
  { id: 'student_chen', name: 'Chen Wei', role: 'Level 4: Full Stack Architect' }
];

const getInitialProblemId = (): string => {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const pParam = urlParams.get('problem');
      if (pParam && PROBLEMS[pParam]) return pParam;
      const hash = window.location.hash.replace('#', '');
      if (hash && PROBLEMS[hash]) return hash;
      const saved = localStorage.getItem('cookdcode_active_problem_id');
      if (saved && PROBLEMS[saved]) return saved;
    }
  } catch (e) {
    console.error('Error reading initial problem ID:', e);
  }
  return 'sum-natural-numbers';
};

const getInitialUser = () => {
  try {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('cookdcode_active_user_id');
      if (savedUserId) {
        const found = USERS.find(u => u.id === savedUserId);
        if (found) return found;
      }
    }
  } catch (e) {}
  return USERS[2];
};

const getSavedProblemData = (userId: string, problemId: string) => {
  try {
    if (typeof window !== 'undefined') {
      // One-time build purge check for prime-between-range to ensure user gets clean state after rules update
      const versionKey = 'cookdcode_v_2026_09_21_prime_range_v20';
      if (!localStorage.getItem(versionKey)) {
        localStorage.removeItem(`cookdcode_${userId}_prime-between-range`);
        localStorage.setItem(versionKey, 'true');
      }

      const saved = localStorage.getItem(`cookdcode_${userId}_${problemId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {}
  return null;
};

const getInitialHintForProblem = (problemId: string): HintResult | null => {
  if (problemId === 'prime-number') {
    return {
      hint: 'A prime number is greater than 1 and has no positive divisors other than 1 and itself. Think about how to check if any number divides it evenly.',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Divisibility & Factor Counting',
      section: 'logic',
      nextSuggestedAction: 'What condition must be met for a number to divide another evenly?'
    };
  }
  if (problemId === 'sexy-prime') {
    return {
      hint: 'Sexy primes are pairs of prime numbers (p, p + 6) such that both p and p + 6 are prime numbers (differing by 6).',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Paired Primality & Offset Testing',
      section: 'logic',
      nextSuggestedAction: 'How can you verify that both p and p + 6 are prime numbers?'
    };
  }
  if (problemId === 'odd-even') {
    return {
      hint: 'Even numbers are cleanly divisible by 2 with no remainder, while odd numbers leave a remainder of 1 when divided by 2.',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Modulo Operator & Parity',
      section: 'logic',
      nextSuggestedAction: 'Which operator allows you to check the remainder when dividing by 2?'
    };
  }
  if (problemId === 'positive-negative') {
    return {
      hint: 'Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative.',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Comparison Operators & Multi-way Branching',
      section: 'logic',
      nextSuggestedAction: 'How can you compare a number against 0 to check if it is positive or negative?'
    };
  }
  if (problemId === 'leap-year') {
    return {
      hint: 'A leap year occurs every 4 years and has 366 days. It is divisible by 4 with remainder 0 (year % 4 == 0).',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Modulo Arithmetic & Divisibility by 4',
      section: 'logic',
      nextSuggestedAction: 'How can you check if a year leaves a remainder of 0 when divided by 4?'
    };
  }
  if (problemId === 'adult-or-minor') {
    return {
      hint: 'A person is classified as an Adult if their age is 18 or older (age >= 18), and a Minor if under 18 (age < 18).',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Comparison Operators & Threshold (age >= 18)',
      section: 'logic',
      nextSuggestedAction: 'How can you compare a person\'s age to 18 to check if they are an Adult or Minor?'
    };
  }
  if (problemId === 'divisible-by-5') {
    return {
      hint: 'A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0). If the remainder is not 0, it is Not Divisible by 5.',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Modulo Arithmetic & Divisibility by 5',
      section: 'logic',
      nextSuggestedAction: 'How can you check if a number leaves a remainder of 0 when divided by 5?'
    };
  }
  if (problemId === 'maximum-of-two') {
    return {
      hint: 'Compare number a and number b using the greater-than operator (>). If a > b, a is greater; else b is greater.',
      hintLevel: 1,
      source: 'firebase',
      concept: 'Comparison Operators (a > b)',
      section: 'logic',
      nextSuggestedAction: 'How can you compare number a and number b using the greater-than operator?'
    };
  }
  if (problemId === 'senior-citizen') {
    return {
      hint: "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen.",
      hintLevel: 1,
      source: 'firebase',
      concept: "Relational Comparison Operator (age >= 60)",
      section: 'logic',
      nextSuggestedAction: "How can you compare a person's age to 60 using the >= operator?"
    };
  }
  if (problemId === 'vowel-or-consonant') {
    return {
      hint: "Check if character ch equals 'a', 'e', 'i', 'o', or 'u' using logical OR (||). If true, it is a Vowel; else it is a Consonant.",
      hintLevel: 1,
      source: 'firebase',
      concept: "Logical OR Operator (ch == 'a' || ch == 'e' || ...)",
      section: 'logic',
      nextSuggestedAction: "How do you check if a character equals any of the 5 vowels?"
    };
  }
  // Sum of N Numbers: Remove preset hints; hints are driven dynamically by student input
  return null;
};

export default function App() {
  const [currentProblemId, setCurrentProblemId] = useState<string>(getInitialProblemId);
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [tokens, setTokens] = useState<number>(10);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Load initial stage data for current problem
  const initialData = getSavedProblemData(currentUser.id, currentProblemId);

  // CTC Stage Inputs
  const [inputs, setInputs] = useState<Record<CTCStage, string>>({
    logic: initialData?.logic || '',
    recipe: initialData?.recipe || '',
    ingredients: initialData?.ingredients || '',
    samplecode: initialData?.samplecode || ''
  });

  // CTC Stage Completion Status
  const [completed, setCompleted] = useState<Record<CTCStage, boolean>>({
    logic: !!initialData?.completedLogic,
    recipe: !!initialData?.completedRecipe,
    ingredients: !!initialData?.completedIngredients,
    samplecode: !!initialData?.completedSample
  });

  // Open/Close toggle for section card textareas
  const [openSections, setOpenSections] = useState<Record<CTCStage, boolean>>({
    logic: true,
    recipe: !!initialData?.completedLogic,
    ingredients: !!(initialData?.completedLogic && initialData?.completedRecipe),
    samplecode: !!(initialData?.completedLogic && initialData?.completedRecipe && initialData?.completedIngredients)
  });

  // Stage Verification Feedback
  const [stageFeedback, setStageFeedback] = useState<Record<CTCStage, {
    correct: boolean;
    feedback: string;
    proofType?: string;
    correction?: string;
    suggestedInput?: string;
    operationTestCases?: {
      testCaseTitle: string;
      inputYear?: number;
      inputAge?: number;
      inputNumber?: number;
      operationFormula: string;
      quotient?: number;
      remainder?: number;
      conditionCheck?: string;
      conditionEvaluated?: boolean;
      executedBranch?: string;
      outputMessage: string;
      expectedOutput?: string;
      passed?: boolean;
      explanation?: string;
    }[];
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
    sampleCodeStepProgress?: {
      stepNumber: number;
      title: string;
      completed: boolean;
      current: boolean;
    }[];
  } | null>>({
    logic: initialData?.stageFeedback?.logic || null,
    recipe: initialData?.stageFeedback?.recipe || null,
    ingredients: initialData?.stageFeedback?.ingredients || null,
    samplecode: initialData?.stageFeedback?.samplecode || null
  });

  // AI Feedback Drawer State
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(true);
  const [feedbackLoading, setFeedbackLoading] = useState<boolean>(false);
  const [currentHint, setCurrentHint] = useState<HintResult | null>(() => getInitialHintForProblem(currentProblemId));
  const [activeHintSection, setActiveHintSection] = useState<CTCStage>('logic');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [lastStudentThought, setLastStudentThought] = useState<string>('');
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [deliveredHints, setDeliveredHints] = useState<string[]>(() => {
    const init = getInitialHintForProblem(currentProblemId);
    return init?.hint ? [init.hint] : [];
  });
  const [stageHelpCount, setStageHelpCount] = useState<Record<CTCStage, number>>({
    logic: 0,
    recipe: 0,
    ingredients: 0,
    samplecode: 0
  });
  const [stageAttemptCounts, setStageAttemptCounts] = useState<Record<CTCStage, number>>({
    logic: 0,
    recipe: 0,
    ingredients: 0,
    samplecode: 0
  });
  const [isGeneratingSectionHint, setIsGeneratingSectionHint] = useState<Record<CTCStage, boolean>>({
    logic: false,
    recipe: false,
    ingredients: false,
    samplecode: false
  });
  const isGeneratingSampleHint = isGeneratingSectionHint.samplecode;
  const setIsGeneratingSampleHint = (val: boolean) => {
    setIsGeneratingSectionHint(prev => ({ ...prev, samplecode: val }));
  };

  // History, Reveal & Reset Modals
  const [revealSection, setRevealSection] = useState<CTCStage | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [runningTests, setRunningTests] = useState<boolean>(false);
  const [showCompletePopup, setShowCompletePopup] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);

  const problem = PROBLEMS[currentProblemId] || PROBLEMS['sum-natural-numbers'];

  // Helper for Section-wise AI Human Touch Quick Prompt Chips
  const getSectionHumanTouchPrompts = (section: CTCStage, problemId: string): string[] => {
    if (problemId === 'senior-citizen') {
      if (section === 'logic') {
        return [
          'Who is considered a Senior Citizen?',
          'How to check senior citizen using >= operator?',
          'If age >= 60 -> Senior Citizen, else -> Not Senior Citizen',
          'Example: age = 65 -> 65 >= 60 is true (Senior Citizen)',
          'Example: age = 45 -> 45 >= 60 is false (Not Senior Citizen)'
        ];
      }
      if (section === 'recipe') {
        return [
          'What steps to write in recipe?',
          'Step 1: Get age input',
          'Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen',
          'How to write senior citizen algorithm without code words?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What ingredients do we need?',
          'Step 1: age variable for input',
          'Step 2: If condition with L.S: age, R.S: 60, Operator: >=',
          'Step 3: Inside if block: print("Senior Citizen")',
          'Step 4: Fallback else block',
          'Step 5: Inside else block: print("Not Senior Citizen")'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to write sample code for Senior Citizen?',
          'var age = 65; if (age >= 60) print("Senior Citizen"); else print("Not Senior Citizen");',
          'How to compare age with 60 using >= operator?',
          'How to test with age 65 and age 45?'
        ];
      }
    }

    if (problemId === 'vowel-or-consonant') {
      if (section === 'logic') {
        return [
          'How to check if a character is a vowel or consonant?',
          'What are the 5 vowels (a, e, i, o, u)?',
          'Why use the OR operator (||) for vowels?',
          'Example with character \'e\' vs \'x\'',
          'What is a consonant in English alphabet?'
        ];
      }
      if (section === 'recipe') {
        return [
          'What steps to write in recipe?',
          'Step 1: Get character input ch from user',
          'Step 2: If ch is equal to a, e, i, o, or u, display Vowel, else display Consonant',
          'How to sequence steps without code words?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What ingredients do we need?',
          'Step 1: ch variable for character',
          'Step 2: If condition checking ch == \'a\' || ch == \'e\' || ch == \'i\' || ch == \'o\' || ch == \'u\'',
          'Step 3: Inside if block: print("Vowel")',
          'Step 4: Fallback else block',
          'Step 5: Inside else block: print("Consonant")'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to write sample code for vowel or consonant?',
          'How to declare character variable var ch = \'e\';?',
          'How to write if (ch == \'a\' || ch == \'e\' || ...) condition?',
          'How to test both Vowel and Consonant test cases?'
        ];
      }
    }

    if (problemId === 'maximum-of-two') {
      if (section === 'logic') {
        return [
          'How to find maximum of two numbers?',
          'If a > b then a is maximum else b is maximum',
          'What is the greater-than operator (>) in logic?',
          'Example with concrete numbers (25 vs 10)',
          'Why must logic be defined mathematically?'
        ];
      }
      if (section === 'recipe') {
        return [
          'What steps to write in recipe?',
          'Step 1: Get two numbers a and b',
          'Step 2: If a is greater than b, display a is Maximum, else display b is Maximum',
          'Why avoid code words in recipe?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What ingredients do we need?',
          'Step 1: a and b for input variables',
          'How to write if condition with Left Side, Right Side, Operator?',
          'Step 2: If condition with L.S: a, R.S: b, Operator: >',
          'Step 3: Inside if block: print("a is max")'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to write sample code for maximum of two?',
          'How to declare test variables (var a = 10, b = 25;)?',
          'How to write if (a > b) print("a is max"); else print("b is max");',
          'How to test both branches with test cases?'
        ];
      }
    }

    if (problemId === 'divisible-by-5') {
      if (section === 'logic') {
        return [
          'Why is a number divisible by 5?',
          'How to express n % 5 == 0 mathematically?',
          'Example calculation for 25 vs 23',
          'What remainder does a non-divisible number leave?',
          'Why must logic be defined mathematically?'
        ];
      }
      if (section === 'recipe') {
        return [
          'What is Step 1 in plain English?',
          'How to check remainder with 5 without code words?',
          'How to write Divisible vs Not Divisible branches?',
          'Why avoid code words in recipe?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What variable is needed (n)?',
          'What operators are needed (% and ==)?',
          'How to write the if-else construct (L.S: n % 5, Operator: ==, R.S: 0)?',
          'How to write print statements with quotes?'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How do I start the prototype code (var n = 25;)?',
          'How to write if (n % 5 == 0)?',
          'How to write the else branch and print messages?',
          'How to trace test cases for 25 and 23?'
        ];
      }
    }

    if (problemId === 'adult-or-minor') {
      if (section === 'logic') {
        return [
          'Who is an adult vs minor?',
          'How to write the mathematical condition (age >= 18)?',
          'Example calculation for age 20 vs 15',
          'Why must logic be defined mathematically?',
          'How to test both adult and minor outcomes?'
        ];
      }
      if (section === 'recipe') {
        return [
          'What is Step 1 in plain English?',
          'How to write the condition step without code keywords?',
          'How to write the Minor outcome step?',
          'Why should we avoid if/else code words in recipe?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What variables do I need (age)?',
          'What comparison operator is needed (>=)?',
          'What construct connects the two branches (if-else)?',
          'How to write print statements with quotes?'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How do I start the prototype code?',
          'I declared var age = 20, what is my next line?',
          'How to write the if condition (age >= 18)?',
          'How to write the else branch?',
          'Why is quotation mark needed in print?'
        ];
      }
    }

    if (problemId === 'leap-year') {
      if (section === 'logic') {
        return [
          'Why is a leap year divisible by 4?',
          'How to express year % 4 == 0 mathematically?',
          'Example calculation for year 2024 vs 2023',
          'What is the remainder logic?'
        ];
      }
      if (section === 'recipe') {
        return [
          'How to write Step 1 (take input year)?',
          'How to write remainder check step in plain English?',
          'How to write Leap Year vs Not Leap Year branches?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What variables are needed (year, rem)?',
          'What operators are needed (% and ==)?',
          'What construct connects branches (if-else)?'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How do I start the prototype code?',
          'I declared var year = 2024, what is my next line?',
          'How to write the if condition (year % 4 == 0)?',
          'How to write the else branch?',
          'Why is quotation mark needed in print?'
        ];
      }
    }

    if (problemId === 'profit-or-loss') {
      if (section === 'logic') {
        return [
          'When does a transaction make profit vs loss?',
          'Mathematical formula for profit (sp > cp)',
          'Example calculation with cp = 100, sp = 150',
          'What happens when sp == cp (no profit no loss)?'
        ];
      }
      if (section === 'recipe') {
        return [
          'How to step-by-step compare selling price and cost price?',
          'How to formulate the profit calculation step?',
          'How to formulate the loss condition step?'
        ];
      }
      if (section === 'ingredients') {
        return [
          'What variables are needed (cp, sp, profit)?',
          'What comparison operator is needed (> and -)?',
          'What branching structure handles profit, loss, neither?'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How do I start the prototype code?',
          'I declared variables (cp = 100, sp = 150), what is my next line?',
          'How to write the if condition (sp > cp)?',
          'How to write the else branch?',
          'Why is quotation mark needed in print?'
        ];
      }
    }

    if (problemId === 'positive-negative') {
      if (section === 'logic') {
        return [
          'How to test if a number is positive, negative or zero?',
          'Mathematical comparison against 0 (n > 0, n < 0)',
          'Example with positive (5), negative (-3), zero (0)'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Get input number',
          'Step 2: Check if number > 0 for Positive',
          'Step 3: Else if number < 0 for Negative',
          'Step 4: Else display Zero'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: n',
          'Operators: >, <, ==',
          'Construct: if - else if - else',
          'Output: print statements with strings'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to initialize var n = 5?',
          'How to write if (n > 0)?',
          'How to write else if (n < 0)?',
          'How to write else { print("Zero"); }?'
        ];
      }
    }

    if (problemId === 'voting-eligibility') {
      if (section === 'logic') {
        return [
          'Who is eligible to vote (age >= 18)?',
          'Mathematical comparison for voting age',
          'Example testing age 18 and age 16'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Take age input',
          'Step 2: Check if age >= 18',
          'Step 3: If true display Eligible, else Not Eligible'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: age',
          'Operators: >=',
          'Construct: if-else statement'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to start with var age = 20?',
          'How to check if (age >= 18)?',
          'How to handle the else branch?'
        ];
      }
    }

    if (problemId === 'three-digit-number') {
      if (section === 'logic') {
        return [
          'What is the mathematical range of 3-digit numbers?',
          'Compound condition: n >= 100 && n <= 999',
          'Testing candidate 456 vs 45 vs 1000'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Get input integer',
          'Step 2: Check if number is between 100 and 999',
          'Step 3: If within range display 3-digit number, else Not'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: n',
          'Operators: >=, <=, &&',
          'Construct: if-else statement'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to check compound condition (n >= 100 && n <= 999)?',
          'How to print result strings in quotes?'
        ];
      }
    }

    if (problemId === 'sum-natural-numbers') {
      if (section === 'logic') {
        return [
          'How does summing natural numbers from 1 to n work?',
          'Step-by-step accumulator addition example',
          'Formula n*(n+1)/2 vs iterative addition'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Get input number n',
          'Step 2: Start total sum as 0 and counter as 1',
          'Step 3: Repeat adding current number until reaching n',
          'Step 4: Display total sum'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: n, sum = 0, i = 1',
          'Loop construct: while loop or for loop',
          'Operators: +, =, <=',
          'Output: print(sum)'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to declare sum = 0 and loop from 1 to n?',
          'How to accumulate sum += i in loop?',
          'How to print final sum after loop finishes?'
        ];
      }
    }

    if (problemId === 'prime-number') {
      if (section === 'logic') {
        return [
          'Why does a prime number have exactly 2 divisors?',
          'Testing divisors from 1 to n for n = 7',
          'Why 1 is not a prime number'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Get input number n',
          'Step 2: Start divisor count at 0',
          'Step 3: Test each divisor from 1 to n',
          'Step 4: If divisor count == 2 display Prime, else Not Prime'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: n, count = 0, i = 1',
          'Loop: for loop (1 to n)',
          'Condition: if (n % i == 0)',
          'Decision: if (count == 2)'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to set up for loop from 1 to n?',
          'How to check n % i == 0 and increment count?',
          'How to check count == 2 after loop?'
        ];
      }
    }

    if (problemId === 'odd-even') {
      if (section === 'logic') {
        return [
          'Why is even number divisible by 2 with remainder 0?',
          'Modulo operation n % 2 for 8 and 7',
          'Mathematical formula for parity'
        ];
      }
      if (section === 'recipe') {
        return [
          'Step 1: Get input number n',
          'Step 2: Check if n % 2 == 0',
          'Step 3: If remainder is 0 display Even, else Odd'
        ];
      }
      if (section === 'ingredients') {
        return [
          'Variables: n or num',
          'Operators: % (modulo), == (equality)',
          'Construct: if-else statement'
        ];
      }
      if (section === 'samplecode') {
        return [
          'How to write if (n % 2 == 0)?',
          'How to write the else branch?',
          'How to print "Even" and "Odd"?'
        ];
      }
    }

    // Generic fallbacks for any other problem:
    if (section === 'logic') {
      return [
        'How does this problem work conceptually?',
        'How to define this logic mathematically with an example?',
        'What inputs and boundary test cases should I verify?',
        'How do the math operations prove the correct answer?'
      ];
    }
    if (section === 'recipe') {
      return [
        'What is Step 1 in plain English?',
        'How to describe sequential steps without code keywords?',
        'How to express decision branches in simple English?',
        'How to display the final output?'
      ];
    }
    if (section === 'ingredients') {
      return [
        'What variables and data types are needed?',
        'What arithmetic or comparison operators are required?',
        'What control structures (if-else, loop) should be used?',
        'What output statement is needed?'
      ];
    }
    return [
      'How do I start the prototype code?',
      'I declared variables, what is my next line?',
      'How to write the conditional or loop statement?',
      'How to handle the else branch / loop termination?',
      'Why is quotation mark needed in print?'
    ];
  };

  // Show Toast Helper
  const triggerToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to append suggested examples below existing input without clearing prior work
  const appendBelowExisting = (existing: string, addition: string): string => {
    const current = (existing || '').trimEnd();
    const toAdd = (addition || '').trim();
    if (!current) return toAdd;
    if (!toAdd) return current;

    // Split lines to avoid duplicating lines that already exist
    const currentLinesLower = current.split('\n').map(l => l.trim().toLowerCase());
    const newLines = toAdd.split('\n').filter(line => {
      const trimmed = line.trim().toLowerCase();
      return trimmed && !currentLinesLower.includes(trimmed);
    });

    if (newLines.length === 0) {
      return `${current}\n${toAdd}`;
    }

    return `${current}\n${newLines.join('\n')}`;
  };

  // Clear an individual stage for clean re-attempt
  const handleClearStage = (stage: CTCStage) => {
    setInputs(prev => ({ ...prev, [stage]: '' }));
    setCompleted(prev => ({ ...prev, [stage]: false }));
    setStageFeedback(prev => ({ ...prev, [stage]: null }));
    try {
      const saved = localStorage.getItem(`cookdcode_${currentUser.id}_${currentProblemId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed[stage] = '';
        if (stage === 'logic') parsed.completedLogic = false;
        if (stage === 'recipe') parsed.completedRecipe = false;
        if (stage === 'ingredients') parsed.completedIngredients = false;
        if (stage === 'samplecode') parsed.completedSample = false;
        if (parsed.stageFeedback) parsed.stageFeedback[stage] = null;
        localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(parsed));
      }
    } catch (e) {}
    triggerToast(`${stage.toUpperCase()} cleared! You can now re-write fresh.`, 'info');
  };

  // Dynamic AI Human Touch hint generator for Logic, Recipe, Ingredients & Taste the Sample
  const handleGenerateSectionHint = async (section: CTCStage, customPrompt?: string) => {
    setIsGeneratingSectionHint(prev => ({ ...prev, [section]: true }));
    const currentText = (inputs[section] || '').trim();
    const nextAttempt = (stageAttemptCounts[section] || 0) + 1;
    setStageAttemptCounts(prev => ({ ...prev, [section]: nextAttempt }));

    const stageLabels: Record<CTCStage, string> = {
      logic: 'Logic',
      recipe: 'Recipe',
      ingredients: 'Ingredients',
      samplecode: 'Taste Sample'
    };

    triggerToast(`✨ Coach Maya is generating your AI human touch hint for ${stageLabels[section]}...`, 'info');
    setActiveHintSection(section);

    try {
      const res = await fetch('/api/checkInput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: problem.category,
          problemID: problem.id,
          problemTitle: problem.title,
          problemDescription: Array.isArray(problem.description) ? problem.description.join(' ') : problem.description,
          concept: problem.concept,
          reveal: problem.reveal,
          section,
          userInput: customPrompt
            ? (currentText ? `${currentText}\n// Student Question: ${customPrompt}` : customPrompt)
            : (currentText || `How do I approach the ${section} stage for ${problem.title}?`),
          attemptCount: nextAttempt,
          isStuck: true
        })
      });

      const data = await res.json();
      setStageFeedback(prev => ({
        ...prev,
        [section]: {
          correct: Boolean(data.correct),
          feedback: data.feedback,
          proofType: data.proofType || (section === 'logic' ? 'mathematical' : section === 'samplecode' ? 'code' : 'plan'),
          correction: data.correction,
          suggestedInput: data.suggestedInput,
          recipeStepProgress: data.recipeStepProgress,
          ingredientsStepProgress: data.ingredientsStepProgress,
          sampleCodeStepProgress: data.sampleCodeStepProgress,
          operationTestCases: data.operationTestCases
        }
      }));

      // Update currentHint in drawer as well so both Stage and Drawer stay in sync
      if (data.feedback) {
        setCurrentHint({
          hint: data.feedback,
          hintLevel: Math.min(4, nextAttempt),
          source: 'llm',
          concept: problem.concept,
          section: section,
          nextSuggestedAction: data.correction
        });
        setDeliveredHints(prev => [...prev, data.feedback]);
      }

      if (data.correct && currentText.trim().length >= 4 && !customPrompt) {
        triggerToast(`🎉 ${stageLabels[section]} Approved! Outstanding work with Coach Maya!`, 'success');
        setCompleted(prev => {
          const updated = { ...prev, [section]: true };
          if (section === 'samplecode' && updated.logic && updated.recipe && updated.ingredients) {
            setShowCompletePopup(true);
          }
          return updated;
        });
      } else {
        triggerToast(`✨ Coach Maya generated a human touch hint for your ${stageLabels[section]}!`, 'info');
      }
    } catch (err) {
      console.error(err);
      triggerToast(`Could not reach Coach Maya AI for ${stageLabels[section]}. Please try again.`, 'error');
    } finally {
      setIsGeneratingSectionHint(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleGenerateSampleCodeHint = async (customPrompt?: string) => {
    return handleGenerateSectionHint('samplecode', customPrompt);
  };

  // Reset current challenge to start completely fresh
  const handleResetChallenge = (targetProblemId = currentProblemId) => {
    try {
      localStorage.removeItem(`cookdcode_${currentUser.id}_${targetProblemId}`);
    } catch (e) {}

    setInputs({
      logic: '',
      recipe: '',
      ingredients: '',
      samplecode: ''
    });
    setCompleted({
      logic: false,
      recipe: false,
      ingredients: false,
      samplecode: false
    });
    setOpenSections({
      logic: true,
      recipe: false,
      ingredients: false,
      samplecode: false
    });
    setStageFeedback({
      logic: null,
      recipe: null,
      ingredients: null,
      samplecode: null
    });

    const initHint = getInitialHintForProblem(targetProblemId);
    setCurrentHint(initHint);
    setCurrentHintLevel(1);
    setActiveHintSection('logic');
    setUserQuestion('');
    setLastStudentThought('');
    setDeliveredHints(initHint?.hint ? [initHint.hint] : []);
    setStageHelpCount({ logic: 0, recipe: 0, ingredients: 0, samplecode: 0 });
    setStageAttemptCounts({ logic: 0, recipe: 0, ingredients: 0, samplecode: 0 });
    setShowResetConfirmModal(false);

    triggerToast(`"${PROBLEMS[targetProblemId]?.title || 'Challenge'}" reset to a clean, fresh start!`, 'info');
  };

  // Problem selection handler with auto-save & history state
  const handleSelectProblem = (newProblemId: string) => {
    if (!PROBLEMS[newProblemId]) return;
    if (newProblemId === currentProblemId) return;

    // 1. Immediately flush current problem's inputs & status to localStorage
    try {
      const currentPayload = {
        logic: inputs.logic,
        recipe: inputs.recipe,
        ingredients: inputs.ingredients,
        samplecode: inputs.samplecode,
        completedLogic: completed.logic,
        completedRecipe: completed.recipe,
        completedIngredients: completed.ingredients,
        completedSample: completed.samplecode,
        stageFeedback,
        updatedAt: Date.now()
      };
      localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(currentPayload));
      localStorage.setItem('cookdcode_active_problem_id', newProblemId);
      
      const url = new URL(window.location.href);
      url.searchParams.set('problem', newProblemId);
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}

    // 2. Load newly selected problem's saved data
    const newData = getSavedProblemData(currentUser.id, newProblemId);
    setInputs({
      logic: newData?.logic || '',
      recipe: newData?.recipe || '',
      ingredients: newData?.ingredients || '',
      samplecode: newData?.samplecode || ''
    });
    setCompleted({
      logic: !!newData?.completedLogic,
      recipe: !!newData?.completedRecipe,
      ingredients: !!newData?.completedIngredients,
      samplecode: !!newData?.completedSample
    });
    setOpenSections({
      logic: true,
      recipe: !!newData?.completedLogic,
      ingredients: !!(newData?.completedLogic && newData?.completedRecipe),
      samplecode: !!(newData?.completedLogic && newData?.completedRecipe && newData?.completedIngredients)
    });
    setStageFeedback({
      logic: newData?.stageFeedback?.logic || null,
      recipe: newData?.stageFeedback?.recipe || null,
      ingredients: newData?.stageFeedback?.ingredients || null,
      samplecode: newData?.stageFeedback?.samplecode || null
    });

    const initHint = getInitialHintForProblem(newProblemId);
    setCurrentHint(initHint);
    setCurrentHintLevel(1);
    setActiveHintSection('logic');
    setUserQuestion('');
    setLastStudentThought('');
    setDeliveredHints(initHint?.hint ? [initHint.hint] : []);
    setStageHelpCount({ logic: 0, recipe: 0, ingredients: 0, samplecode: 0 });
    setStageAttemptCounts({ logic: 0, recipe: 0, ingredients: 0, samplecode: 0 });

    setCurrentProblemId(newProblemId);
  };

  // User persona selection handler with auto-save
  const handleSelectUser = (newUser: typeof USERS[0]) => {
    // 1. Flush current user's state
    try {
      const currentPayload = {
        logic: inputs.logic,
        recipe: inputs.recipe,
        ingredients: inputs.ingredients,
        samplecode: inputs.samplecode,
        completedLogic: completed.logic,
        completedRecipe: completed.recipe,
        completedIngredients: completed.ingredients,
        completedSample: completed.samplecode,
        stageFeedback,
        updatedAt: Date.now()
      };
      localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(currentPayload));
      localStorage.setItem('cookdcode_active_user_id', newUser.id);
    } catch (e) {}

    // 2. Load newUser's data for this problem
    const userData = getSavedProblemData(newUser.id, currentProblemId);
    setInputs({
      logic: userData?.logic || '',
      recipe: userData?.recipe || '',
      ingredients: userData?.ingredients || '',
      samplecode: userData?.samplecode || ''
    });
    setCompleted({
      logic: !!userData?.completedLogic,
      recipe: !!userData?.completedRecipe,
      ingredients: !!userData?.completedIngredients,
      samplecode: !!userData?.completedSample
    });
    setOpenSections({
      logic: true,
      recipe: !!userData?.completedLogic,
      ingredients: !!(userData?.completedLogic && userData?.completedRecipe),
      samplecode: !!(userData?.completedLogic && userData?.completedRecipe && userData?.completedIngredients)
    });
    setStageFeedback({
      logic: userData?.stageFeedback?.logic || null,
      recipe: userData?.stageFeedback?.recipe || null,
      ingredients: userData?.stageFeedback?.ingredients || null,
      samplecode: userData?.stageFeedback?.samplecode || null
    });

    setCurrentUser(newUser);
    setProfileDropdownOpen(false);
    triggerToast(`Switched persona to ${newUser.name}`, 'info');
  };

  // Continuous real-time debounced auto-save so student work is NEVER lost
  useEffect(() => {
    setAutoSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        const payload = {
          logic: inputs.logic,
          recipe: inputs.recipe,
          ingredients: inputs.ingredients,
          samplecode: inputs.samplecode,
          completedLogic: completed.logic,
          completedRecipe: completed.recipe,
          completedIngredients: completed.ingredients,
          completedSample: completed.samplecode,
          stageFeedback,
          updatedAt: Date.now()
        };
        localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(payload));
        localStorage.setItem('cookdcode_active_problem_id', currentProblemId);
        localStorage.setItem('cookdcode_active_user_id', currentUser.id);
        setAutoSaveStatus('saved');
      } catch (e) {
        console.error('Auto-save error:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs, completed, stageFeedback, currentProblemId, currentUser.id]);

  // Flush data before unload / visibility loss / Ctrl+S
  useEffect(() => {
    const flushData = () => {
      try {
        const payload = {
          logic: inputs.logic,
          recipe: inputs.recipe,
          ingredients: inputs.ingredients,
          samplecode: inputs.samplecode,
          completedLogic: completed.logic,
          completedRecipe: completed.recipe,
          completedIngredients: completed.ingredients,
          completedSample: completed.samplecode,
          stageFeedback,
          updatedAt: Date.now()
        };
        localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(payload));
        localStorage.setItem('cookdcode_active_problem_id', currentProblemId);
        localStorage.setItem('cookdcode_active_user_id', currentUser.id);
      } catch (e) {}
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        flushData();
        triggerToast('Progress Auto-Saved!', 'success');
      }
    };

    window.addEventListener('beforeunload', flushData);
    document.addEventListener('visibilitychange', flushData);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', flushData);
      document.removeEventListener('visibilitychange', flushData);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputs, completed, stageFeedback, currentProblemId, currentUser.id]);

  // Unlock sequence calculation
  const isUnlocked = (section: CTCStage): boolean => {
    if (section === 'logic') return true;
    if (section === 'recipe') return completed.logic;
    if (section === 'ingredients') return completed.logic && completed.recipe;
    if (section === 'samplecode') return completed.logic && completed.recipe && completed.ingredients;
    return false;
  };

  // Toggle Section Collapse
  const toggleSection = (section: CTCStage) => {
    if (!isUnlocked(section)) {
      triggerToast('Complete the previous stage first to unlock!', 'warning');
      return;
    }
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Save Progress Functionality (Manual Click or Shortcut)
  const saveProgress = async () => {
    if (!inputs.logic.trim()) {
      triggerToast('Write your Logic first before saving progress.', 'warning');
      return;
    }

    const payload = {
      logic: inputs.logic,
      recipe: inputs.recipe,
      ingredients: inputs.ingredients,
      samplecode: inputs.samplecode,
      completedLogic: completed.logic,
      completedRecipe: completed.recipe,
      completedIngredients: completed.ingredients,
      completedSample: completed.samplecode,
      stageFeedback,
      updatedAt: Date.now()
    };

    localStorage.setItem(`cookdcode_${currentUser.id}_${currentProblemId}`, JSON.stringify(payload));
    localStorage.setItem('cookdcode_active_problem_id', currentProblemId);
    triggerToast('Progress successfully saved in glass container!', 'success');
  };

  // Check Input Validation
  const checkInput = async (section: CTCStage, forceStuck: boolean = false) => {
    const text = inputs[section]?.trim();
    if (!text) {
      triggerToast(`Please write your ${section === 'samplecode' ? 'code' : section} before checking!`, 'warning');
      return;
    }

    const currentAttempt = (stageAttemptCounts[section] || 0) + 1;
    setStageAttemptCounts(prev => ({ ...prev, [section]: currentAttempt }));

    if (section === 'samplecode') {
      setIsGeneratingSampleHint(true);
      triggerToast('✨ Coach Maya is analyzing your code with AI human touch...', 'info');
      setActiveHintSection('samplecode');
      setFeedbackOpen(true);
    } else {
      triggerToast(`Validating ${section}...`, 'info');
    }

    try {
      const res = await fetch('/api/checkInput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: problem.category,
          problemID: problem.id,
          problemTitle: problem.title,
          problemDescription: Array.isArray(problem.description) ? problem.description.join(' ') : problem.description,
          concept: problem.concept,
          reveal: problem.reveal,
          section,
          userInput: text,
          attemptCount: currentAttempt,
          isStuck: forceStuck || section === 'samplecode'
        })
      });

      const data = await res.json();

      setStageFeedback(prev => ({
        ...prev,
        [section]: {
          correct: Boolean(data.correct),
          feedback: data.feedback,
          proofType: data.proofType,
          correction: data.correction,
          suggestedInput: data.suggestedInput,
          recipeStepProgress: data.recipeStepProgress,
          ingredientsStepProgress: data.ingredientsStepProgress,
          sampleCodeStepProgress: data.sampleCodeStepProgress,
          operationTestCases: data.operationTestCases
        }
      }));

      if (data.correct) {
        const title = section === 'logic' ? '🎉 Logic Successful!' : section === 'samplecode' ? '🎉 Taste the Sample Verified!' : '✅ Stage Verified!';
        triggerToast(`${title} ${data.feedback}`, 'success');
        setCompleted(prev => {
          const updated = { ...prev, [section]: true };
          if (section === 'samplecode' && updated.logic && updated.recipe && updated.ingredients) {
            setShowCompletePopup(true);
          }
          return updated;
        });

        // Auto open next section
        const nextMap: Record<CTCStage, CTCStage | null> = {
          logic: 'recipe',
          recipe: 'ingredients',
          ingredients: 'samplecode',
          samplecode: null
        };
        const next = nextMap[section];
        if (next) {
          setOpenSections(prev => ({ ...prev, [next]: true }));
          setTimeout(() => {
            document.getElementById(`stage-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 150);
        }
      } else {
        if (section === 'samplecode') {
          triggerToast('✨ Coach Maya generated AI Human Touch guidance for your code!', 'info');
          if (data.feedback) {
            setCurrentHint({
              hint: data.feedback,
              hintLevel: Math.min(4, currentAttempt),
              source: 'llm',
              concept: problem.concept,
              section: 'samplecode',
              nextSuggestedAction: data.correction
            });
          }
        } else {
          triggerToast(`❌ Needs adjustment: ${data.feedback}`, 'error');
        }
        setCompleted(prev => ({ ...prev, [section]: false }));
      }
    } catch (err) {
      triggerToast('Validation check error. Please ensure server is running.', 'error');
    } finally {
      if (section === 'samplecode') {
        setIsGeneratingSampleHint(false);
      }
    }
  };

  // Request Help from AI Mentor
  const requestHelp = async (
    section: CTCStage,
    customLevel?: number,
    explicitQuestion?: string,
    isClarityEscalation: boolean = false
  ) => {
    if (tokens <= 0) {
      triggerToast('No tokens remaining! You can still use Check.', 'warning');
      return;
    }

    setTokens(prev => Math.max(0, prev - 1));
    setActiveHintSection(section);
    setFeedbackOpen(true);
    setFeedbackLoading(true);

    // If user clicks Help repeatedly on the same section without customLevel, advance progressively (1 -> 2 -> 3 -> 4)
    let level = customLevel;
    if (!level) {
      const priorCount = stageHelpCount[section] || 0;
      if (activeHintSection === section && priorCount > 0) {
        level = Math.min(4, ((currentHintLevel % 4) + 1));
      } else {
        level = 1;
      }
    }
    setCurrentHintLevel(level);

    const worksheetContent = (inputs[section] || '').trim();

    // Determine the student's question or thought
    let studentQuestion = explicitQuestion || userQuestion;
    if (!studentQuestion && isClarityEscalation && lastStudentThought) {
      studentQuestion = lastStudentThought;
    }
    if (!studentQuestion && worksheetContent) {
      studentQuestion = `Student work in ${section}: "${worksheetContent}". Please evaluate my thought process, check my operands and calculations step by step, and provide a clear, user-friendly hint in simple English to guide my next step.`;
    }
    if (!studentQuestion) {
      studentQuestion = `How do I approach the ${section} stage for ${problem.title}?`;
    }

    setLastStudentThought(studentQuestion);

    try {
      const res = await fetch('/api/ai-mentor/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          programId: problem.id,
          section,
          studentInput: studentQuestion,
          studentWorksheet: worksheetContent,
          studentCode: inputs.samplecode,
          hintLevel: level,
          problemTitle: problem.title,
          problemDescription: problem.description.join(' '),
          previousHints: deliveredHints,
          forceLlm: true, // Always invoke Gen AI to analyze student input dynamically
          isClarityRequest: isClarityEscalation
        })
      });

      const data = await res.json();

      if (data.success) {
        setCurrentHint(data);
        setCurrentHintLevel(data.hintLevel);
        setDeliveredHints(prev => [...prev, data.hint]);
        setStageHelpCount(prev => ({ ...prev, [section]: (prev[section] || 0) + 1 }));
        setUserQuestion('');
      } else {
        triggerToast('Could not load hint from AI Mentor.', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to contact AI Mentor API.', 'error');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // "Need More Help" Escalator - Analyzes user input to provide deeper Gen AI clarity
  const handleNeedMoreHelp = () => {
    const nextLevel = Math.min(currentHintLevel + 1, 4);
    setCurrentHintLevel(nextLevel);
    requestHelp(activeHintSection, nextLevel, undefined, true);
  };

  // Speech Synthesizer for feedback
  const toggleSpeech = () => {
    if (!currentHint?.hint) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentHint.hint);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Load Student History
  const fetchStudentHistory = async () => {
    try {
      const res = await fetch(`/api/ai-mentor/history?userId=${currentUser.id}&programId=${problem.id}`);
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.history || []);
        setShowHistoryModal(true);
      }
    } catch (e) {
      triggerToast('Error loading hint history', 'error');
    }
  };

  // Run Automated Diagnostic Tests
  const runDiagnosticTests = async () => {
    setRunningTests(true);
    try {
      const res = await fetch('/api/ai-mentor/run-tests');
      const data = await res.json();
      setTestResults(data);
      setShowTestModal(true);
    } catch (e) {
      triggerToast('Failed to execute test suite', 'error');
    } finally {
      setRunningTests(false);
    }
  };

  // Calculate overall progress %
  const progressPercent =
    (completed.logic ? 25 : 0) +
    (completed.recipe ? 25 : 0) +
    (completed.ingredients ? 25 : 0) +
    (completed.samplecode ? 25 : 0);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Frosted Glass Background Ambient Blur Orbs */}
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-600/25 rounded-full blur-[130px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-100px] right-[-100px] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-[25%] right-[10%] w-[350px] h-[350px] bg-blue-500/15 rounded-full blur-[110px] pointer-events-none z-0"></div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[12000] px-6 py-3 rounded-full shadow-2xl backdrop-blur-2xl border flex items-center gap-3 font-semibold text-sm transition-all duration-300 ${
          toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50' :
          toast.type === 'error' ? 'bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/50' :
          toast.type === 'warning' ? 'bg-amber-950/80 border-amber-500/40 text-amber-200 shadow-amber-950/50' :
          'bg-indigo-950/80 border-indigo-500/40 text-indigo-200 shadow-indigo-950/50'
        }`}>
          <i className={`fas ${
            toast.type === 'success' ? 'fa-check-circle text-emerald-400' :
            toast.type === 'error' ? 'fa-times-circle text-rose-400' :
            toast.type === 'warning' ? 'fa-exclamation-triangle text-amber-400' :
            'fa-info-circle text-indigo-400'
          }`}></i>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar - Frosted Glass Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.04] border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-300 hover:text-white p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all focus:outline-none"
            title="Toggle Sidebar"
            aria-label="Toggle navigation menu"
          >
            <i className="fas fa-bars text-sm"></i>
          </button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSidebarOpen(true)}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30 border border-white/20">
              <span className="text-xl font-black">C</span>
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight leading-none block">CookDcode</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mt-0.5">by CodeRead</span>
            </div>
          </div>

          {/* Program / Problem Dropdown in Top Navbar */}
          <div className="flex items-center gap-2 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-2xl px-3 py-1.5 backdrop-blur-md transition-all shadow-sm">
            <i className="fas fa-code-branch text-indigo-300 text-xs"></i>
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider hidden md:inline">Program:</span>
            <select
              value={currentProblemId}
              onChange={(e) => handleSelectProblem(e.target.value)}
              className="text-xs font-bold text-white bg-transparent focus:outline-none cursor-pointer pr-1 border-none outline-none max-w-[160px] sm:max-w-[220px] md:max-w-[280px] truncate"
              aria-label="Select coding challenge program"
            >
              {Object.values(PROBLEMS).map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white font-medium">
                  {p.problemNo}: {p.shortTitle || p.title.replace('Write a program to ', '').replace('find the ', '').replace('.', '')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navbar Center: Level & CTC Flow */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Progress dots */}
          <div className="flex gap-1.5 items-center">
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${completed.logic ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${completed.recipe ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${completed.ingredients ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${completed.samplecode ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-700'}`}></div>
          </div>

          <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-2.5 backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
            <span className="text-xs font-semibold text-slate-200">{currentUser.role}</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/[0.05] border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CTC Progress:</span>
            <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs font-extrabold text-indigo-300">{progressPercent}%</span>
          </div>
        </div>

        {/* Navbar Right: Actions & User */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Real-time Auto-Save status badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/[0.05] border border-white/10 rounded-full text-[11px] font-semibold text-slate-300 backdrop-blur-md">
            <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
              autoSaveStatus === 'saving'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
            }`}></span>
            <span>{autoSaveStatus === 'saving' ? 'Saving...' : 'Auto-Saved'}</span>
          </div>

          {/* Reset / Start Fresh Button */}
          <button
            onClick={() => setShowResetConfirmModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded-full text-xs font-bold border border-rose-500/30 transition-all active:scale-95 shadow-sm backdrop-blur-md"
            title="Reset this challenge to start completely fresh"
          >
            <i className="fas fa-rotate-left text-rose-400"></i>
            <span>Start Fresh</span>
          </button>

          {/* Diagnostic Test Runner */}
          <button
            onClick={runDiagnosticTests}
            disabled={runningTests}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 rounded-full text-xs font-bold border border-indigo-500/30 transition-all shadow-sm active:scale-95 backdrop-blur-md"
            title="Run AI Mentor System Diagnostics & Test Cases"
          >
            <i className={`fas ${runningTests ? 'fa-spinner fa-spin' : 'fa-flask'} text-amber-300`}></i>
            <span>{runningTests ? 'Testing...' : 'AI Mentor Tests'}</span>
          </button>

          {/* Save Progress Button */}
          <button
            onClick={saveProgress}
            className="nav-save-btn"
            title="Save Current Challenge Progress (Ctrl+S)"
          >
            <i className="fas fa-cloud-upload-alt text-indigo-400"></i>
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Token Display */}
          <div className="token-display" title="Available tokens for AI guidance">
            <div className="token-icon">
              <i className="fas fa-coins text-amber-100"></i>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Tokens:</span>
            <span className="text-sm font-extrabold text-white">{tokens}</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-white/20 p-0.5 hover:border-indigo-400 transition-all focus:outline-none"
            >
              <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-indigo-200 shadow-inner">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 backdrop-blur-2xl bg-slate-900/90 rounded-2xl shadow-2xl border border-white/15 py-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 pb-3 border-b border-white/10">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Active Learner</span>
                  <p className="font-bold text-sm text-white mt-0.5">{currentUser.name}</p>
                  <p className="text-xs text-indigo-400 font-semibold">{currentUser.role}</p>
                </div>
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block mb-1 tracking-wider">Switch Student Persona</span>
                  {USERS.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                        currentUser.id === u.id ? 'bg-indigo-500/20 text-indigo-200 font-bold border border-indigo-500/40' : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <span>{u.name}</span>
                      {currentUser.id === u.id && <i className="fas fa-check text-indigo-400"></i>}
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-2 px-2">
                  <button
                    onClick={() => {
                      fetchStudentHistory();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-2.5 transition-all"
                  >
                    <i className="fas fa-history text-indigo-400"></i>
                    <span>View Hint History</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-80 max-w-[85vw] backdrop-blur-2xl bg-slate-950/90 h-full border-r border-white/10 shadow-2xl p-6 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-500/30">
                    C
                  </div>
                  <div>
                    <span className="font-bold text-lg text-white">CookDcode</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block">by CodeRead</span>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                  <i className="fas fa-times text-base"></i>
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-2 block mb-2">
                  Methodology & Challenges
                </label>
                {Object.values(PROBLEMS).map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      handleSelectProblem(p.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all ${
                      currentProblemId === p.id
                        ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/40 backdrop-blur-xl shadow-lg shadow-indigo-500/10'
                        : 'hover:bg-white/5 text-slate-300 border border-transparent'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentProblemId === p.id ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.problemNo.replace('Problem ', '')}
                    </span>
                    <div>
                      <div className="font-bold text-white leading-tight">{p.shortTitle || p.title.replace('Write a program to ', '').replace('find the ', '').replace('.', '')}</div>
                      <div className="text-[10px] font-normal text-indigo-300/70 mt-0.5">{p.concept}</div>
                    </div>
                  </button>
                ))}

                <div className="pt-4 border-t border-white/10 mt-4 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest px-2 block mb-2">
                    Developer & Analytics
                  </label>
                  <button
                    onClick={() => {
                      runDiagnosticTests();
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-3 transition-all"
                  >
                    <i className="fas fa-flask text-amber-400"></i>
                    <span>Run AI Mentor Test Suite</span>
                  </button>
                  <button
                    onClick={() => {
                      fetchStudentHistory();
                      setSidebarOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 flex items-center gap-3 transition-all"
                  >
                    <i className="fas fa-clock-rotate-left text-indigo-400"></i>
                    <span>Student Interaction Log</span>
                  </button>
                </div>
              </nav>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">CTC Methodology</p>
              <p className="text-xs font-medium text-slate-300 leading-tight">1. Logic &rarr; 2. Recipe &rarr; 3. Ingredients &rarr; 4. Taste Sample</p>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="relative z-10 flex-1 p-4 md:p-6 grid grid-cols-1 xl:grid-cols-[440px_1fr] gap-6 items-start max-w-7xl mx-auto w-full">
        {/* Left Column: Challenge Card & AI Mentor Card */}
        <div className="flex flex-col gap-6 xl:sticky xl:top-20">
          {/* Challenge Card - Frosted Glass Panel */}
          <div className="backdrop-blur-xl bg-white/[0.05] border border-white/10 rounded-[28px] shadow-2xl shadow-indigo-950/20 overflow-hidden">
            <div className="p-6 md:p-7 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full shadow-[0_0_6px_rgba(129,140,248,0.8)]"></span>
                  <span>{problem.phaseLabel}</span> • <span>{problem.problemNo}</span>
                </div>

                {/* Switch Problem Selector & Reset Button */}
                <div className="flex items-center gap-2">
                  <select
                    value={currentProblemId}
                    onChange={(e) => handleSelectProblem(e.target.value)}
                    className="text-xs bg-white/10 border border-white/15 rounded-xl px-2.5 py-1.5 font-semibold text-slate-200 focus:outline-none focus:border-indigo-400 transition-all backdrop-blur-md cursor-pointer"
                    aria-label="Select coding challenge"
                  >
                    {Object.values(PROBLEMS).map((p) => (
                      <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                        {p.shortTitle || p.title.replace('Write a program to ', '').replace('find the ', '').replace('.', '')}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowResetConfirmModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 rounded-xl text-xs font-bold border border-rose-500/30 transition-all active:scale-95 shadow-sm"
                    title="Start this challenge fresh (Clear saved progress)"
                  >
                    <i className="fas fa-rotate-left text-xs"></i>
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-snug mb-3">
                {problem.title}
              </h1>
            </div>

            <div className="border-t border-white/10 p-6 md:p-7 pt-5 bg-white/[0.02]">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
                <i className="fas fa-book-open"></i>
                <span>Problem Definition & Concept</span>
              </div>
              <div className="text-sm text-slate-300 space-y-2 leading-relaxed font-normal">
                {problem.description.map((line, idx) => (
                  <p key={idx} className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold mt-1 text-xs">•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Core Concept: <strong className="text-indigo-200 font-semibold">{problem.concept}</strong></span>
                <span className="text-emerald-300 font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px]">
                  CTC Compliant
                </span>
              </div>
            </div>
          </div>

          {/* AI Mentor Card - Frosted Glass Panel */}
          <div className="backdrop-blur-2xl bg-white/[0.07] border border-white/15 rounded-[28px] overflow-hidden shadow-2xl shadow-indigo-500/10 transition-all duration-300">
            {/* AI Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                      <path d="M12 12L2.7 7.3a10 10 0 0 0 0 9.4L12 12Z"></path>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>AI Mentor</span>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-200 font-bold">
                      {activeHintSection}
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentHint && (
                  <button
                    onClick={toggleSpeech}
                    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all text-xs text-slate-300 hover:text-white"
                    title={isSpeaking ? 'Stop voice' : 'Listen to hint'}
                  >
                    <i className={`fas ${isSpeaking ? 'fa-pause' : 'fa-volume-up'}`}></i>
                  </button>
                )}
                <button
                  onClick={() => setFeedbackOpen(!feedbackOpen)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all text-xs text-slate-300 hover:text-white"
                  title="Toggle Assistant"
                >
                  <i className={`fas ${feedbackOpen ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                </button>
              </div>
            </div>

            {/* AI Feedback Body */}
            {feedbackOpen && (
              <div className="p-6 flex flex-col gap-4">
                {feedbackLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                      Analyzing Stage & Knowledge Base...
                    </p>
                  </div>
                ) : currentHint ? (
                  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                    {/* Metadata Badges: Level, Source, Concept */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/10 text-slate-300">
                        Level {currentHint.hintLevel} of 4
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <i className={`fas ${currentHint.source === 'firebase' ? 'fa-database' : 'fa-brain'} mr-1 text-[9px]`}></i>
                        {currentHint.source === 'firebase' ? 'FIREBASE' : 'GEMINI AI'}
                      </span>
                      {currentHint.concept && (
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] font-medium">
                          {currentHint.concept}
                        </span>
                      )}
                    </div>

                    {/* Hint Content Bubble */}
                    <div className="p-4 bg-white/[0.05] rounded-2xl rounded-tl-none border border-white/10">
                      <p className="text-[13px] leading-relaxed text-slate-200">{currentHint.hint}</p>
                    </div>

                    {/* Next Suggested Action Bubble */}
                    {currentHint.nextSuggestedAction && (
                      <div className="p-4 bg-indigo-500/20 rounded-2xl rounded-tl-none border border-indigo-500/30">
                        <p className="text-[13px] leading-relaxed text-indigo-100 font-medium flex items-start gap-2">
                          <i className="fas fa-lightbulb text-amber-300 mt-1 text-xs"></i>
                          <span>{currentHint.nextSuggestedAction}</span>
                        </p>
                      </div>
                    )}

                    {/* Progressive Hint Progress Bar */}
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progressive Hint</span>
                        <span className="text-[10px] font-bold text-indigo-400">Level {currentHint.hintLevel}/4</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)] transition-all duration-500"
                          style={{ width: `${(currentHint.hintLevel / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col gap-2">
                      {currentHint.hintLevel < 4 && (
                        <button
                          onClick={handleNeedMoreHelp}
                          disabled={feedbackLoading}
                          className="w-full py-3 bg-white/10 hover:bg-white/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-bold tracking-wider transition-all border border-white/10 text-slate-200 flex items-center justify-center gap-2"
                        >
                          {feedbackLoading ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-indigo-400"></i>
                              <span>ANALYZING YOUR INPUT...</span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sparkles text-indigo-400"></i>
                              <span>I NEED MORE CLARITY</span>
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => toggleSection(activeHintSection)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold tracking-wider transition-all shadow-lg shadow-indigo-600/30 border border-indigo-400/20 text-white"
                      >
                        WRITE MY ANSWER IN {activeHintSection.toUpperCase()}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    <p className="font-semibold text-slate-200 mb-1">Welcome to the CookDcode AI Mentor</p>
                    <p>Select any CTC stage and click <strong>Help</strong>, or ask a question below.</p>
                  </div>
                )}

                {/* Ask Mentor Custom Question Box */}
                <div className="pt-4 border-t border-white/10 space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                    Ask Mentor About {activeHintSection.toUpperCase()}:
                  </span>

                  {/* Starter Question Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(problem.starterQuestionSuggestions[activeHintSection] || []).map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUserQuestion(q);
                          requestHelp(activeHintSection, currentHintLevel, q);
                        }}
                        className="text-[11px] bg-white/[0.06] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/10 px-3 py-1 rounded-full font-medium transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userQuestion.trim()) {
                          requestHelp(activeHintSection, currentHintLevel);
                        }
                      }}
                      placeholder={`Share your thought process or question on ${activeHintSection}...`}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 text-white placeholder:text-slate-500"
                    />
                    <button
                      onClick={() => requestHelp(activeHintSection, currentHintLevel)}
                      disabled={feedbackLoading}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 border border-indigo-400/20"
                    >
                      Ask
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Cook The Code (CTC) Stages */}
        <div className="space-y-6">
          {/* ================= STAGE 1: LOGIC ================= */}
          <div id="stage-logic" className="backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-[28px] shadow-2xl shadow-indigo-950/20 overflow-hidden transition-all duration-300">
            <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-full bg-indigo-500/30 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-200 shadow-lg shadow-indigo-500/30">
                  1
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white tracking-tight">LOGIC</h3>
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      Stage Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Pattern recognition & algorithmic thinking before syntax.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                {completed.logic && (
                  <span className="text-emerald-300 font-bold text-xs bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
                    <i className="fas fa-check-circle text-emerald-400"></i> Logic Successful
                  </span>
                )}
                <button onClick={() => setRevealSection('logic')} className="btn-reveal">
                  <i className="fas fa-eye"></i> Reveal
                </button>
                <button onClick={() => requestHelp('logic')} className="btn-help">
                  <i className="fas fa-lightbulb"></i> Help
                </button>
                <button onClick={() => toggleSection('logic')} className="btn-write">
                  <i className={`fas ${openSections.logic ? 'fa-times' : 'fa-pen'}`}></i>
                  <span>{openSections.logic ? 'Close' : 'Write'}</span>
                </button>
              </div>
            </div>

            {openSections.logic && (
              <div className="p-5 md:p-6 bg-slate-950/50 border-t border-white/10 space-y-4">
                <div className="bg-slate-950/70 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                  <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span className="uppercase tracking-widest text-[10px] text-indigo-400">// logic.txt - Problem Analysis Worksheet</span>
                    <button
                      onClick={() => handleClearStage('logic')}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex items-center gap-1 text-[11px]"
                      title="Clear Logic to Re-write"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                      <span className="text-[10px] hidden sm:inline">Clear Stage</span>
                    </button>
                  </div>
                  <textarea
                    value={inputs.logic}
                    onChange={(e) => setInputs(prev => ({ ...prev, logic: e.target.value }))}
                    placeholder="Write your logic here to prove how this problem works..."
                    className="w-full h-44 p-4 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none bg-transparent leading-relaxed"
                  />
                </div>

                {stageFeedback.logic && (
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    stageFeedback.logic.correct
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
                      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
                  } flex items-start gap-3.5`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                      stageFeedback.logic.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
                    }`}>
                      <i className={`fas ${stageFeedback.logic.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base`}></i>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${stageFeedback.logic.correct ? 'text-emerald-300' : 'text-indigo-300'}`}>
                          <span>{stageFeedback.logic.correct ? '🎉 Logic Approved by Coach!' : '🧑‍🏫 Coach Maya (1-on-1 Trainer)'}</span>
                        </h4>
                        {stageFeedback.logic.proofType && (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 uppercase tracking-wider font-semibold">
                            {stageFeedback.logic.proofType}
                          </span>
                        )}
                      </div>

                      <div className="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
                        {stageFeedback.logic.feedback}
                      </div>

                      {stageFeedback.logic.correction && !stageFeedback.logic.correct && (
                        <div className="text-xs text-amber-200/90 font-sans flex items-start gap-2 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                          <i className="fas fa-lightbulb text-amber-400 shrink-0 mt-0.5"></i>
                          <span><strong>Coach's Tip:</strong> {stageFeedback.logic.correction}</span>
                        </div>
                      )}

                      {/* When user is stuck or example is available */}
                      {!stageFeedback.logic.correct && stageFeedback.logic.suggestedInput && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30 text-slate-200">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                              <i className="fas fa-lightbulb text-amber-300"></i> {
                                stageFeedback.logic.proofType === 'theoretical'
                                  ? 'Worked-Out Theoretical Example:'
                                  : 'Worked-Out Mathematical Example:'
                              }
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (stageFeedback.logic?.suggestedInput) {
                                  setInputs(prev => ({ ...prev, logic: appendBelowExisting(prev.logic, stageFeedback.logic!.suggestedInput!) }));
                                  triggerToast('Example added below your input!', 'success');
                                }
                              }}
                              className="text-[11px] px-2.5 py-1 bg-indigo-500/25 hover:bg-indigo-500/40 text-indigo-200 rounded-md font-bold transition-all active:scale-95 flex items-center gap-1.5"
                            >
                              <i className="fas fa-arrow-down text-[10px]"></i> Insert Set Example
                            </button>
                          </div>
                          <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                            {stageFeedback.logic.suggestedInput}
                          </pre>
                        </div>
                      )}

                      {/* If user hasn't gotten the example yet and wants help */}
                      {!stageFeedback.logic.correct && !stageFeedback.logic.suggestedInput && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => checkInput('logic', true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95 shadow-sm"
                          >
                            <i className="fas fa-lightbulb text-amber-300"></i>
                            <span>
                              {stageFeedback.logic.proofType === 'theoretical'
                                ? "I'm stuck — Show Coach's worked theory example"
                                : stageFeedback.logic.proofType === 'mathematical'
                                ? "I'm stuck — Show Coach's worked math example"
                                : "I'm stuck — Show a starting example"}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleClearStage('logic')}
                      className="px-3 py-2 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
                      title="Clear Logic to re-write fresh"
                    >
                      <i className="fas fa-rotate-left text-xs"></i>
                      <span>Clear & Re-write Logic</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => checkInput('logic')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-400/20 transition-all active:scale-95"
                    >
                      <i className="fas fa-check text-[10px]"></i> Check Logic
                    </button>

                    {(completed.logic || stageFeedback.logic?.correct) && (
                      <button
                        onClick={() => {
                          setOpenSections(prev => ({ ...prev, recipe: true }));
                          setTimeout(() => {
                            document.getElementById('stage-recipe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                          triggerToast('Proceeding to Stage 2: Recipe!', 'success');
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-2 transition-all active:scale-95 ring-2 ring-emerald-400/30"
                      >
                        <span>Proceed to Stage 2: Recipe</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= STAGE 2: RECIPE ================= */}
          <div id="stage-recipe" className={`backdrop-blur-xl rounded-[28px] border transition-all duration-300 overflow-hidden ${
            !isUnlocked('recipe')
              ? 'bg-white/[0.02] border-white/5 opacity-60'
              : 'bg-white/[0.06] border-white/15 shadow-2xl shadow-indigo-950/20'
          }`}>
            <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  completed.recipe
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                    : isUnlocked('recipe')
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50'
                    : 'bg-slate-800 text-slate-500 border border-white/5'
                }`}>
                  2
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white tracking-tight">RECIPE</h3>
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Stage 2
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Step-by-step sequential plan and algorithm breakdown.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                {!isUnlocked('recipe') ? (
                  <span className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
                    <i className="fas fa-lock"></i> Locked
                  </span>
                ) : (
                  <>
                    {completed.recipe && (
                      <span className="text-emerald-300 font-bold text-xs bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                        <i className="fas fa-check-circle text-emerald-400"></i> Recipe Verified
                      </span>
                    )}
                    <button onClick={() => setRevealSection('recipe')} className="btn-reveal">
                      <i className="fas fa-eye"></i> Reveal
                    </button>
                    <button onClick={() => requestHelp('recipe')} className="btn-help">
                      <i className="fas fa-lightbulb"></i> Help
                    </button>
                    <button onClick={() => toggleSection('recipe')} className="btn-write">
                      <i className={`fas ${openSections.recipe ? 'fa-times' : 'fa-pen'}`}></i>
                      <span>{openSections.recipe ? 'Close' : 'Write'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {isUnlocked('recipe') && openSections.recipe && (
              <div className="p-5 md:p-6 bg-slate-950/50 border-t border-white/10 space-y-4">
                {/* Plain English Rule Notice */}
                <div id="recipe-plain-language-guideline" className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs flex items-start sm:items-center gap-2.5 text-amber-200 shadow-sm">
                  <i className="fas fa-feather-alt text-amber-400 shrink-0 mt-0.5 sm:mt-0 text-sm"></i>
                  <div className="leading-relaxed">
                    <span className="font-bold text-amber-300">Plain English Rule: </span>
                    Write your algorithm in everyday human language! Do <strong>NOT</strong> use programming tools or code words (avoid <code className="bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-mono text-[11px]">loop</code>, <code className="bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-mono text-[11px]">while</code>, <code className="bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-mono text-[11px]">for</code>, <code className="bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded text-amber-200 font-mono text-[11px]">counter i</code>). Use words like <em>'repeat until reaching n'</em>, <em>'add current number'</em>, and <em>'next number'</em>.
                  </div>
                </div>

                <div className="bg-slate-950/70 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                  <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span className="uppercase tracking-widest text-[10px] text-indigo-400">// recipe.txt - Execution Recipe</span>
                    <button
                      onClick={() => handleClearStage('recipe')}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex items-center gap-1 text-[11px]"
                      title="Clear Recipe to Re-write"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                      <span className="text-[10px] hidden sm:inline">Clear Stage</span>
                    </button>
                  </div>
                  <textarea
                    value={inputs.recipe}
                    onChange={(e) => setInputs(prev => ({ ...prev, recipe: e.target.value }))}
                    placeholder={`Write your sequential plan in plain English (No programming keywords):\n${
                      currentProblemId === 'sexy-prime'
                        ? 'Step 1: Get the upper limit number from the user\nStep 2: For each number starting from 2 up to 6 less than the limit\nStep 3: Check if the first number is a prime number\nStep 4: Check if adding 6 to the number also gives a prime number\nStep 5: If both numbers are prime, display them as a pair'
                        : currentProblemId === 'prime-between-range'
                        ? 'Step 1: Get starting number and ending number\nStep 2: For each number in the range from start up to end\nStep 3: Reset divisor count to 0\nStep 4: Test divisors from 1 to number\nStep 5: If divisor count is 2, display as prime'
                        : currentProblemId === 'next-prime-number'
                        ? 'Step 1: Get the input number n\nStep 2: Start candidate number as n + 1 (if candidate < 2, candidate = 2)\nStep 3: Check if the candidate number is prime\nStep 4: If candidate is prime, display candidate as the next prime and stop\nStep 5: If candidate is not prime, increase candidate by 1 and repeat Step 3'
                        : currentProblemId === 'prime-number'
                        ? 'Step 1: Get the input number n\nStep 2: Start divisor counter at 0\nStep 3: Test each divisor from 1 to n\nStep 4: If divisor divides n evenly, increase count\nStep 5: If count is exactly 2, display Prime, else Not Prime'
                        : currentProblemId === 'factorial'
                        ? 'Step 1: Get the input number n\nStep 2: Initialize factorial as 1\nStep 3: Multiply each number from 1 to n into factorial\nStep 4: Display the final factorial result'
                        : currentProblemId === 'odd-even'
                        ? 'Step 1: Get the input number n\nStep 2: Check if n is divisible by 2 with remainder 0\nStep 3: If divisible, display Even\nStep 4: Otherwise, display Odd'
                        : currentProblemId === 'divisor-of-a-number'
                        ? 'Step 1: Get the input number n\nStep 2: Check each number from 1 to n\nStep 3: If the number divides n with remainder 0, display it as a divisor'
                        : currentProblemId === 'multiplication-table'
                        ? 'Step 1: Get the input number n\nStep 2: Count from 1 to 10\nStep 3: Multiply n by each count\nStep 4: Display each multiplication result'
                        : 'Step 1: Get the input number n\nStep 2: Start total sum as 0\nStep 3: Add each number from 1 to n to the sum\nStep 4: Display the final total sum'
                    }`}
                    className="w-full h-44 p-4 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none bg-transparent leading-relaxed"
                  />
                </div>

                {/* Step-by-Step Recipe Progress Tracker - Only show when user writes steps correctly */}
                {stageFeedback.recipe?.recipeStepProgress && stageFeedback.recipe.recipeStepProgress.some(s => s.completed) && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <i className="fas fa-list-ol text-amber-400"></i>
                        Algorithm Step Tracker:
                      </span>
                      <span className="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {stageFeedback.recipe.recipeStepProgress.filter(s => s.completed).length} of {stageFeedback.recipe.recipeStepProgress.length} Steps Completed
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-0.5">
                      {stageFeedback.recipe.recipeStepProgress.filter(step => step.completed).map(step => (
                        <div
                          key={step.stepNumber}
                          className="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30"
                        >
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                            <i className="fas fa-check text-[9px] text-amber-300"></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-amber-100 truncate">{step.title}</div>
                            <div className="text-[10px] text-amber-300/80 font-medium">✓ Step Completed</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stageFeedback.recipe && (
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    stageFeedback.recipe.correct
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
                      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
                  } flex items-start gap-3.5`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                      stageFeedback.recipe.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
                    }`}>
                      <i className={`fas ${stageFeedback.recipe.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base`}></i>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${stageFeedback.recipe.correct ? 'text-emerald-300' : 'text-indigo-300'}`}>
                          <span>{stageFeedback.recipe.correct ? '🎉 Recipe Approved by Coach!' : '🧑‍🏫 Coach Maya (1-on-1 Trainer)'}</span>
                        </h4>
                        {!stageFeedback.recipe.correct && (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 uppercase tracking-wider font-semibold">
                            AI Human Touch Hint
                          </span>
                        )}
                      </div>
                      <div className="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
                        {stageFeedback.recipe.feedback}
                      </div>

                      {stageFeedback.recipe.correction && !stageFeedback.recipe.correct && (
                        <div className="text-xs text-amber-200/90 font-sans flex items-start gap-2 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                          <i className="fas fa-lightbulb text-amber-400 shrink-0 mt-0.5"></i>
                          <span><strong>Coach's Thinking Clue:</strong> {stageFeedback.recipe.correction}</span>
                        </div>
                      )}

                      {stageFeedback.recipe.suggestedInput && !stageFeedback.recipe.correct && (
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setInputs(prev => ({ ...prev, recipe: appendBelowExisting(prev.recipe, stageFeedback.recipe!.suggestedInput!) }));
                              triggerToast('Step example inserted below your input!', 'info');
                            }}
                            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all font-semibold"
                          >
                            <i className="fas fa-magic text-amber-400"></i>
                            <span>Insert Step Example</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleClearStage('recipe')}
                      className="px-3 py-2 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
                      title="Clear Recipe to re-write fresh"
                    >
                      <i className="fas fa-rotate-left text-xs"></i>
                      <span>Clear & Re-write Recipe</span>
                    </button>
                    <button
                      onClick={() => checkInput('recipe', true)}
                      className="text-xs text-amber-300/80 hover:text-amber-300 flex items-center gap-1.5 transition-colors underline decoration-amber-500/40 underline-offset-2"
                    >
                      <i className="fas fa-question-circle"></i>
                      <span>I'm stuck on this step</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => checkInput('recipe')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-400/20 transition-all active:scale-95"
                    >
                      <i className="fas fa-check text-[10px]"></i> Check Recipe
                    </button>

                    {(completed.recipe || stageFeedback.recipe?.correct) && (
                      <button
                        onClick={() => {
                          setOpenSections(prev => ({ ...prev, ingredients: true }));
                          setTimeout(() => {
                            document.getElementById('stage-ingredients')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                          triggerToast('Proceeding to Stage 3: Ingredients!', 'success');
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-2 transition-all active:scale-95 ring-2 ring-emerald-400/30"
                      >
                        <span>Proceed to Stage 3: Ingredients</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= STAGE 3: INGREDIENTS ================= */}
          <div id="stage-ingredients" className={`backdrop-blur-xl rounded-[28px] border transition-all duration-300 overflow-hidden ${
            !isUnlocked('ingredients')
              ? 'bg-white/[0.02] border-white/5 opacity-60'
              : 'bg-white/[0.06] border-white/15 shadow-2xl shadow-indigo-950/20'
          }`}>
            <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  completed.ingredients
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                    : isUnlocked('ingredients')
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50'
                    : 'bg-slate-800 text-slate-500 border border-white/5'
                }`}>
                  3
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white tracking-tight">INGREDIENTS</h3>
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Stage 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Variables, loops, operators & programming constructs.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                {!isUnlocked('ingredients') ? (
                  <span className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
                    <i className="fas fa-lock"></i> Locked
                  </span>
                ) : (
                  <>
                    {completed.ingredients && (
                      <span className="text-emerald-300 font-bold text-xs bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                        <i className="fas fa-check-circle text-emerald-400"></i> Ingredients Verified
                      </span>
                    )}
                    <button onClick={() => setRevealSection('ingredients')} className="btn-reveal">
                      <i className="fas fa-eye"></i> Reveal
                    </button>
                    <button onClick={() => requestHelp('ingredients')} className="btn-help">
                      <i className="fas fa-lightbulb"></i> Help
                    </button>
                    <button onClick={() => toggleSection('ingredients')} className="btn-write">
                      <i className={`fas ${openSections.ingredients ? 'fa-times' : 'fa-pen'}`}></i>
                      <span>{openSections.ingredients ? 'Close' : 'Write'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {isUnlocked('ingredients') && openSections.ingredients && (
              <div className="p-5 md:p-6 bg-slate-950/50 border-t border-white/10 space-y-4">
                {/* Ingredients Guidance Clue Box */}
                <div className="p-3.5 bg-indigo-950/30 rounded-2xl border border-indigo-500/20 text-xs text-indigo-200/90 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-indigo-300">
                      <i className="fas fa-lightbulb text-amber-400"></i>
                      <span>Ingredients Checklist — What tools do we need to write this code?</span>
                    </div>
                    <button
                      onClick={() => {
                        const template = currentProblemId === 'sexy-prime'
                          ? "Step 1: Variables: n for limit, p for first candidate, q = p + 6 for companion\nStep 2: Outer loop for p from 2 to n - 6\nStep 3: Separate divisor counters: count1 = 0 for p, count2 = 0 for q\nStep 4: Inner divisor loops with modulo checks: if (p % i == 0) count1++ and if (q % j == 0) count2++\nStep 5: Combined verification: if (count1 == 2 && count2 == 2) print pair (p, q)"
                          : currentProblemId === 'prime-between-range'
                          ? "Step 1: Variables start, end, num\nStep 2: Outer loop from start to end (for num = start; num <= end; num++)\nStep 3: count = 0 inside outer loop\nStep 4: Inner loop i = 1 to num (for i = 1; i <= num; i++)\nStep 5: if (num % i == 0) count++\nStep 6: if (count == 2) print(num)"
                          : currentProblemId === 'next-prime-number'
                          ? "Step 1: use n variable\nStep 1.1: candidate = n + 1\nStep 2: use while loop (while true)\nStep 3: isPrime = true, use for loop\n  start (2)\n  end (candidate - 1)\n  next step (+1)\nStep 4: use if condition\n  left side (candidate % i)\n  operator (==)\n  right side (0)\n  action: isPrime = false; break;\nStep 5: if (isPrime) { print(candidate); break; } else { candidate++; }"
                          : currentProblemId === 'prime-number'
                          ? "Step 1: use n variable\nStep 1.1: use variable count = 0 (or isPrime = true)\nStep 2: use for loop\n  start (1),\n  end (n), and\n  next step (+1)\nStep 3: use if condition\n  left side (n % i)\n  operator (==)\n  right side (0)\nStep 4: count = count + 1\nStep 5: if count == 2 display Prime else Not Prime"
                          : currentProblemId === 'divisor-of-a-number'
                          ? "Variables:\n• n: input integer\n• i: loop counter starting from 1\n\nConstructs:\n• for loop with Start: 1 (i), Stop: n (i <= n), Step: +1\n\nCondition (Step 2.1):\n• Left Side (L.S): n % i (calculates remainder)\n• Operator: == (equality comparison)\n• Right Side (R.S): 0 (checks if remainder is 0)\n• if (n % i == 0)\n\nOutput (Step 2.2):\n• print(i) to display the divisor"
                          : currentProblemId === 'factorial'
                          ? "Variables:\n• n: input integer\n• fact = 1: container variable to hold the running product\n• i = 1: loop counter starting from 1\n\nConstructs:\n• for loop or while loop (Start: 1, Stop: n, Next step: +1)\n\nOperators:\n• * or *= for multiplication\n• = for assignment\n• <= for loop stopping condition\n\nOutput:\n• print(fact) to display the final factorial"
                          : "Variables:\n• n: input integer\n• sum = 0: accumulator to hold the total\n• i = 1: loop counter starting from 1\n\nConstructs:\n• while loop or for loop to repeat adding numbers up to n\n\nOperators:\n• + or += for addition\n• = for assignment\n• <= for loop stopping condition";
                        setInputs(prev => ({ ...prev, ingredients: template }));
                        triggerToast('Ingredients starter template loaded!', 'info');
                      }}
                      className="text-[11px] text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <i className="fas fa-pencil-alt text-amber-400"></i>
                      <span>Load Template</span>
                    </button>
                  </div>
                  {currentProblemId === 'sexy-prime' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables (3):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (upper limit)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">p</code> (first candidate)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">q = p + 6</code> (companion)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Outer Loop:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for (var p = 2; p &lt;= n - 6; p++)</code><br/>
                        <span className="text-slate-400 text-[10px]">Iterates up to n - 6</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-search text-[10px]"></i> 3. Separate Counters:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">count1 = 0</code> for p<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">count2 = 0</code> for p + 6
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 4. Modulo Loops:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (p % i == 0) count1++</code><br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (q % j == 0) count2++</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-terminal text-[10px]"></i> 5. Pair Verdict:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (count1 == 2 &amp;&amp; count2 == 2)</code><br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">print("(" + p + ", " + q + ")");</code>
                      </div>
                    </div>
                  ) : currentProblemId === 'prime-between-range' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables (3):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">start, end</code> (limits)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">num, i</code> (counters)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">count = 0</code> (divisor tally)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Outer Loop:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for (var num = start; num &lt;= end; num++)</code><br/>
                        <span className="text-slate-400 text-[10px]">Iterates through range candidates</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-search text-[10px]"></i> 3. Inner Loop & Reset:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">var count = 0;</code> inside outer loop<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for (var i = 1; i &lt;= num; i++)</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 4. Divisor Modulo:
                        </span>
                        • Left Side: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">num % i</code><br/>
                        • Condition: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (num % i == 0) count++;</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-terminal text-[10px]"></i> 5. Prime Verdict:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (count == 2) print(num);</code>
                      </div>
                    </div>
                  ) : currentProblemId === 'next-prime-number' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables (2):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (input number)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">candidate = n + 1</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Outer Loop:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">while (true)</code><br/>
                        <span className="text-slate-400 text-[10px]">Continuously test consecutive candidates</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-search text-[10px]"></i> 3. Inner Prime Check:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">isPrime = true</code><br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for loop</code> (start: 2, end: candidate-1, step: +1)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 4. Modulo Condition:
                        </span>
                        • Left Side: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">candidate % i</code><br/>
                        • Operator: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">==</code><br/>
                        • Right Side: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">0</code><br/>
                        • Action: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">isPrime = false; break;</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-terminal text-[10px]"></i> 5. Decision:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (isPrime) &#123; print(candidate); break; &#125; else &#123; candidate++; &#125;</code>
                      </div>
                    </div>
                  ) : currentProblemId === 'prime-number' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (input number)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">count = 0</code> (or isPrime = true)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Loop Construct:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for loop</code><br/>
                        <span className="text-slate-400 text-[10px]">Start: 1, End: n, Step: +1</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 3. Condition:
                        </span>
                        • Left: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n % i</code>, Op: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">==</code>, Right: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">0</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-plus text-[10px]"></i> 4. Update:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">count = count + 1</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-terminal text-[10px]"></i> 5. Decision:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (count == 2) print("Prime") else print("Not Prime")</code>
                      </div>
                    </div>
                  ) : currentProblemId === 'divisor-of-a-number' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-slate-300 pt-1">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables (2):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (input number)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">i = 1</code> (loop counter)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Loop Construct:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for loop</code><br/>
                        <span className="text-slate-400 text-[10px]">Start: 1 (i), Stop: n (i &lt;= n), Step: +1</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 3. If Condition (Step 2.1):
                        </span>
                        • Left Side: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n % i</code><br/>
                        • Operator: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">==</code><br/>
                        • Right Side: <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">0</code><br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">if (n % i == 0)</code>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-terminal text-[10px]"></i> 4. Output Statement (Step 2.2):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">print(i)</code><br/>
                        <span className="text-slate-400 text-[10px]">Displays the divisor i inside the if block</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`grid grid-cols-1 sm:grid-cols-3 ${currentProblemId === 'factorial' ? 'lg:grid-cols-4' : ''} gap-2 text-[11px] text-slate-300 pt-1`}>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-tags text-[10px]"></i> 1. Variables (3):
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (user input)<br/>
                        {currentProblemId === 'factorial' ? (
                          <>• <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">fact = 1</code> (container variable)<br/></>
                        ) : (
                          <>• <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">sum = 0</code> (accumulator)<br/></>
                        )}
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">i = 1</code> (loop counter)
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-redo text-[10px]"></i> 2. Loop Construct:
                        </span>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for loop</code> or <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">while loop</code><br/>
                        <span className="text-slate-400 text-[10px]">{currentProblemId === 'factorial' ? 'Repeats multiplications from 1 up to n' : 'Repeats the additions from 1 up to n'}</span>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <i className="fas fa-calculator text-[10px]"></i> 3. Operators:
                        </span>
                        {currentProblemId === 'factorial' ? (
                          <>• <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">*</code> / <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">*=</code> (multiplication)<br/></>
                        ) : (
                          <>• <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">+</code> / <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">+=</code> (addition)<br/></>
                        )}
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">=</code> (assignment)<br/>
                        • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">&lt;=</code> (boundary condition)
                      </div>
                      {currentProblemId === 'factorial' && (
                        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                          <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                            <i className="fas fa-terminal text-[10px]"></i> 4. Output Statement:
                          </span>
                          • <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">print(fact)</code><br/>
                          <span className="text-slate-400 text-[10px]">Displays the calculated factorial outside the loop</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/70 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                  <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span className="uppercase tracking-widest text-[10px] text-indigo-400">// ingredients.txt - Constructs Roster</span>
                    <button
                      onClick={() => handleClearStage('ingredients')}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex items-center gap-1 text-[11px]"
                      title="Clear Ingredients to Re-write"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                      <span className="text-[10px] hidden sm:inline">Clear Stage</span>
                    </button>
                  </div>
                  <textarea
                    value={inputs.ingredients}
                    onChange={(e) => setInputs(prev => ({ ...prev, ingredients: e.target.value }))}
                    placeholder="List all required ingredients: Variables (n, fact = 1, i = 1), Loop construct (for or while loop), Operators (*, =, <=), Print statement..."
                    className="w-full h-44 p-4 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none bg-transparent leading-relaxed"
                  />
                </div>

                {/* Step-by-Step Programming Ingredients Progress Tracker */}
                {stageFeedback.ingredients?.ingredientsStepProgress && stageFeedback.ingredients.ingredientsStepProgress.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <i className="fas fa-cubes text-amber-400"></i>
                        Programming Ingredients Tracker:
                      </span>
                      <span className="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {stageFeedback.ingredients.ingredientsStepProgress.filter(s => s.completed).length} of {stageFeedback.ingredients.ingredientsStepProgress.length} Ingredients Identified
                      </span>
                    </div>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${stageFeedback.ingredients.ingredientsStepProgress.length >= 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-2 pt-0.5`}>
                      {stageFeedback.ingredients.ingredientsStepProgress.map(step => (
                        <div
                          key={step.stepNumber}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                            step.completed
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30'
                              : 'bg-white/[0.02] border-dashed border-white/15 text-slate-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                            step.completed
                              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                              : 'bg-white/5 text-slate-500 border border-white/10'
                          }`}>
                            {step.completed ? (
                              <i className="fas fa-check text-[9px] text-amber-300"></i>
                            ) : (
                              <span className="text-[10px]">{step.stepNumber}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`font-medium truncate ${step.completed ? 'text-amber-100' : 'text-slate-300'}`}>{step.title}</div>
                            <div className={`text-[10px] font-medium ${step.completed ? 'text-amber-300/80' : 'text-slate-500'}`}>
                              {step.completed ? '✓ Identified' : '⏳ Needed'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stageFeedback.ingredients && (
                  <div className={`p-4.5 rounded-2xl border transition-all ${
                    stageFeedback.ingredients.correct
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
                      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
                  } flex items-start gap-3.5`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                      stageFeedback.ingredients.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
                    }`}>
                      <i className={`fas ${stageFeedback.ingredients.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base`}></i>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${stageFeedback.ingredients.correct ? 'text-emerald-300' : 'text-indigo-300'}`}>
                          <span>{stageFeedback.ingredients.correct ? '🎉 Ingredients Approved by Coach!' : '🧑‍🏫 Coach Maya (1-on-1 Trainer)'}</span>
                        </h4>
                        {!stageFeedback.ingredients.correct && (
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 uppercase tracking-wider font-semibold">
                            AI Human Touch Hint
                          </span>
                        )}
                      </div>
                      <div className="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
                        {stageFeedback.ingredients.feedback}
                      </div>

                      {stageFeedback.ingredients.correction && !stageFeedback.ingredients.correct && (
                        <div className="text-xs text-amber-200/90 font-sans flex items-start gap-2 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                          <i className="fas fa-lightbulb text-amber-400 shrink-0 mt-0.5"></i>
                          <span><strong>Coach's Thinking Clue:</strong> {stageFeedback.ingredients.correction}</span>
                        </div>
                      )}

                      {stageFeedback.ingredients.suggestedInput && !stageFeedback.ingredients.correct && (
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setInputs(prev => ({ ...prev, ingredients: appendBelowExisting(prev.ingredients, stageFeedback.ingredients!.suggestedInput!) }));
                              triggerToast('Ingredient example inserted below your input!', 'info');
                            }}
                            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all font-semibold"
                          >
                            <i className="fas fa-magic text-amber-400"></i>
                            <span>Insert Ingredient Example</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleClearStage('ingredients')}
                      className="px-3 py-2 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
                      title="Clear Ingredients to re-write fresh"
                    >
                      <i className="fas fa-rotate-left text-xs"></i>
                      <span>Clear & Re-write Ingredients</span>
                    </button>
                    <button
                      onClick={() => checkInput('ingredients', true)}
                      className="text-xs text-amber-300/80 hover:text-amber-300 flex items-center gap-1.5 transition-colors underline decoration-amber-500/40 underline-offset-2"
                    >
                      <i className="fas fa-question-circle"></i>
                      <span>I'm stuck on this ingredient</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => checkInput('ingredients')}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 border border-indigo-400/20 transition-all active:scale-95"
                    >
                      <i className="fas fa-check text-[10px]"></i> Check Ingredients
                    </button>

                    {(completed.ingredients || stageFeedback.ingredients?.correct) && (
                      <button
                        onClick={() => {
                          setOpenSections(prev => ({ ...prev, samplecode: true }));
                          setTimeout(() => {
                            document.getElementById('stage-samplecode')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                          triggerToast('Proceeding to Stage 4: Taste Sample!', 'success');
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center gap-2 transition-all active:scale-95 ring-2 ring-emerald-400/30"
                      >
                        <span>Proceed to Stage 4: Taste Sample</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= STAGE 4: TASTE THE SAMPLE ================= */}
          <div id="stage-samplecode" className={`backdrop-blur-xl rounded-[28px] border transition-all duration-300 overflow-hidden ${
            !isUnlocked('samplecode')
              ? 'bg-white/[0.02] border-white/5 opacity-60'
              : 'bg-white/[0.06] border-white/15 shadow-2xl shadow-indigo-950/20'
          }`}>
            <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  completed.samplecode
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-500/50'
                    : isUnlocked('samplecode')
                    ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50'
                    : 'bg-slate-800 text-slate-500 border border-white/5'
                }`}>
                  4
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-white tracking-tight">TASTE SAMPLE</h3>
                    <span className="text-[10px] bg-white/10 text-slate-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Stage 4
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Dry run, variable tracing, testing & implementation.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                {!isUnlocked('samplecode') ? (
                  <span className="flex items-center gap-2 text-slate-500 font-bold text-xs bg-white/5 px-3.5 py-1.5 rounded-full border border-white/5">
                    <i className="fas fa-lock"></i> Locked
                  </span>
                ) : (
                  <>
                    {completed.samplecode && (
                      <span className="text-emerald-300 font-bold text-xs bg-emerald-500/20 px-3.5 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                        <i className="fas fa-check-circle text-emerald-400"></i> Code Verified
                      </span>
                    )}
                    <button onClick={() => setRevealSection('samplecode')} className="btn-reveal">
                      <i className="fas fa-eye"></i> Reveal
                    </button>
                    <button onClick={() => requestHelp('samplecode')} className="btn-help">
                      <i className="fas fa-lightbulb"></i> Help
                    </button>
                    <button onClick={() => toggleSection('samplecode')} className="btn-write">
                      <i className={`fas ${openSections.samplecode ? 'fa-times' : 'fa-pen'}`}></i>
                      <span>{openSections.samplecode ? 'Close' : 'Write'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {isUnlocked('samplecode') && openSections.samplecode && (
              <div className="p-5 md:p-6 bg-slate-950/50 border-t border-white/10 space-y-4">
                <div className="bg-slate-950/70 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
                  <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
                    <span className="uppercase tracking-widest text-[10px] text-emerald-400">// main.py - Complete Code Implementation</span>
                    <button
                      onClick={() => handleClearStage('samplecode')}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex items-center gap-1 text-[11px]"
                      title="Clear Code to Re-write"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                      <span className="text-[10px] hidden sm:inline">Clear Stage</span>
                    </button>
                  </div>
                  <textarea
                    value={inputs.samplecode}
                    onChange={(e) => setInputs(prev => ({ ...prev, samplecode: e.target.value }))}
                    placeholder="Write and execute your code implementation (Python / C / Java / JS)..."
                    className="w-full h-52 p-4 text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none resize-none bg-transparent leading-relaxed"
                  />
                </div>

                {/* Progressive Taste The Sample / Code Tracker - Matches Ingredients layout and feedback */}
                {stageFeedback.samplecode?.sampleCodeStepProgress && stageFeedback.samplecode.sampleCodeStepProgress.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <i className="fas fa-tasks text-amber-400"></i>
                        Sample Code & Prototype Tracker:
                      </span>
                      <span className="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        {stageFeedback.samplecode.sampleCodeStepProgress.filter(s => s.completed).length} of {stageFeedback.samplecode.sampleCodeStepProgress.length} Verified
                      </span>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${stageFeedback.samplecode.sampleCodeStepProgress.length >= 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-2 pt-0.5`}>
                      {stageFeedback.samplecode.sampleCodeStepProgress.map((step) => (
                        <div
                          key={step.stepNumber}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                            step.completed
                              ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30'
                              : step.current
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300/90 ring-1 ring-amber-500/20'
                              : 'bg-white/[0.02] border-white/10 text-slate-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                            step.completed
                              ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                              : step.current
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-slate-500 border border-white/10'
                          }`}>
                            {step.completed ? (
                              <i className="fas fa-check text-[9px] text-amber-300"></i>
                            ) : (
                              <span className="text-[10px]">{step.stepNumber}</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`font-medium truncate ${step.completed ? 'text-amber-100' : 'text-slate-300'}`}>{step.title}</div>
                            <div className={`text-[10px] font-medium ${step.completed ? 'text-amber-300/80' : 'text-slate-500'}`}>
                              {step.completed ? '✓ Verified' : '⏳ Needed'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stageFeedback.samplecode && (
                  <div className={`p-4 rounded-2xl border transition-all ${
                    stageFeedback.samplecode.correct
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-100 shadow-xl shadow-amber-950/20'
                  } flex items-start gap-3.5`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      stageFeedback.samplecode.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-amber-500/30 border border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/20'
                    }`}>
                      <i className={`fas ${stageFeedback.samplecode.correct ? 'fa-check-circle' : 'fa-lightbulb'} text-sm`}></i>
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`font-bold text-sm tracking-wide uppercase flex items-center gap-2 ${stageFeedback.samplecode.correct ? 'text-emerald-300' : 'text-amber-300'}`}>
                          <span>{stageFeedback.samplecode.correct ? '✅ Taste the Sample Verified!' : '🧑‍🏫 Coach Maya • AI Human Touch Guidance'}</span>
                        </h4>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold flex items-center gap-1">
                          <i className="fas fa-sparkles text-[9px] text-amber-300"></i>
                          AI Human Touch Hint
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line">
                        {stageFeedback.samplecode.feedback}
                      </p>

                      {stageFeedback.samplecode.correction && !stageFeedback.samplecode.correct && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-sans mt-1 space-y-2 shadow-inner">
                          <div className="flex items-start gap-2">
                            <i className="fas fa-lightbulb text-amber-400 mt-0.5 shrink-0"></i>
                            <div className="flex-1">
                              <span className="font-bold text-amber-300 mr-1.5">Coach's Next Step Clue:</span>
                              <span className="font-mono text-amber-100">{stageFeedback.samplecode.correction}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <button
                              onClick={() => {
                                setInputs(prev => ({ ...prev, samplecode: appendBelowExisting(prev.samplecode, stageFeedback.samplecode!.correction!) }));
                                triggerToast('Next step clue inserted into code editor!', 'success');
                              }}
                              className="text-[11px] bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 border border-amber-500/40 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold transition-all active:scale-95"
                            >
                              <i className="fas fa-paste text-[10px]"></i>
                              <span>Insert Clue into Editor</span>
                            </button>
                            <button
                              onClick={() => handleGenerateSampleCodeHint("Can you give me another human touch hint with a different explanation?")}
                              className="text-[11px] bg-white/10 hover:bg-white/20 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold transition-all active:scale-95"
                            >
                              <i className="fas fa-redo text-[10px]"></i>
                              <span>Different AI Hint</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {stageFeedback.samplecode.suggestedInput && (
                        <div className="pt-1">
                          <button
                            onClick={() => {
                              setInputs(prev => ({ ...prev, samplecode: appendBelowExisting(prev.samplecode, stageFeedback.samplecode!.suggestedInput!) }));
                              triggerToast('Prototype example inserted below your input!', 'info');
                            }}
                            className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-xl flex items-center gap-2 transition-all font-semibold"
                          >
                            <i className="fas fa-magic text-amber-400"></i>
                            <span>Insert Prototype Example</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleClearStage('samplecode')}
                      className="px-3 py-2 bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 rounded-xl text-xs font-semibold border border-white/10 transition-all flex items-center gap-1.5 active:scale-95"
                      title="Clear Code to re-write fresh"
                    >
                      <i className="fas fa-rotate-left text-xs"></i>
                      <span>Clear & Re-write Code</span>
                    </button>

                    <button
                      onClick={() => handleGenerateSampleCodeHint("I am stuck on this code step")}
                      disabled={isGeneratingSampleHint}
                      className="text-xs text-amber-300/90 hover:text-amber-200 flex items-center gap-1.5 transition-colors underline decoration-amber-500/40 underline-offset-2 active:scale-95"
                    >
                      <i className="fas fa-question-circle"></i>
                      <span>I'm stuck on this code</span>
                    </button>
                  </div>

                  <button
                    onClick={() => checkInput('samplecode')}
                    disabled={isGeneratingSampleHint}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all active:scale-95 disabled:opacity-50"
                    title="Check & Run Code (Runs Dynamic AI Human Touch Analysis with Coach Maya)"
                  >
                    {isGeneratingSampleHint ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-[11px] text-emerald-200"></i>
                        <span>AI Coach Analyzing Code...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play text-[10px]"></i>
                        <span>Check & Run Code</span>
                        <span className="hidden xl:inline text-[10px] font-normal text-emerald-200/80">• AI Touch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Reveal Solution Modal */}
      {revealSection && (
        <div className="modal-overlay">
          <div className="backdrop-blur-2xl bg-slate-900/90 w-[90%] max-w-lg rounded-[28px] p-6 shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <i className="fas fa-eye text-indigo-400"></i>
                <span>Reference Solution: {revealSection.toUpperCase()}</span>
              </h3>
              <button onClick={() => setRevealSection(null)} className="text-slate-400 hover:text-white p-1">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <textarea
              readOnly
              value={problem.reveal[revealSection] || 'No reference solution available.'}
              className="w-full h-48 p-4 bg-slate-950/70 border border-white/10 rounded-2xl text-xs font-mono text-slate-200 focus:outline-none resize-none leading-relaxed"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setRevealSection(null)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl text-xs border border-white/10 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInputs(prev => ({ ...prev, [revealSection]: problem.reveal[revealSection] }));
                  setRevealSection(null);
                  triggerToast(`Inserted reference into ${revealSection}`, 'success');
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/25 border border-indigo-400/20 transition-all"
              >
                Insert Solution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Hint History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="backdrop-blur-2xl bg-slate-900/95 w-[92%] max-w-2xl rounded-[28px] p-6 shadow-2xl border border-white/15 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <i className="fas fa-clock-rotate-left text-indigo-400"></i>
                  <span>Student Hint History: {currentUser.name}</span>
                </h3>
                <p className="text-xs text-slate-400">Stored in Firebase to personalize future hints</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white p-1">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {historyList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No previous hint interactions recorded for this student on this challenge yet.
                </div>
              ) : (
                historyList.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-300 uppercase text-[10px]">
                        Stage: {item.section} • Level {item.hintLevel}
                      </span>
                      <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                        {item.source}
                      </span>
                    </div>
                    {item.studentInput && (
                      <p className="text-slate-400 italic">Q: &ldquo;{item.studentInput}&rdquo;</p>
                    )}
                    <p className="font-semibold text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                      {item.hint}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl text-xs border border-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Automated Diagnostic Test Runner Modal */}
      {showTestModal && testResults && (
        <div className="modal-overlay">
          <div className="backdrop-blur-2xl bg-slate-900/95 w-[92%] max-w-2xl rounded-[28px] p-6 shadow-2xl border border-white/15 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200 text-white">
            <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <i className="fas fa-flask text-amber-400"></i>
                  <span>AI Mentor Validation Test Results</span>
                </h3>
                <p className="text-xs text-slate-400">Verifies Section 25 requirements across all 4 CTC stages</p>
              </div>
              <button onClick={() => setShowTestModal(false)} className="text-slate-400 hover:text-white p-1">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {testResults.results?.map((res: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">{res.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      res.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono bg-slate-950/70 p-2.5 rounded-xl border border-white/5 overflow-x-auto">
                    {JSON.stringify(res.details, null, 2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                ✓ All CTC criteria tested & validated
              </span>
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl text-xs border border-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Completed Trophy Modal */}
      {showCompletePopup && (
        <div className="modal-overlay">
          <div className="backdrop-blur-2xl bg-slate-900/95 w-[90%] max-w-md rounded-[32px] p-8 shadow-2xl border border-white/15 text-center animate-in zoom-in-90 duration-300 text-white">
            <div className="w-20 h-20 bg-indigo-500/20 border border-indigo-500/30 text-amber-300 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-indigo-500/20 trophy-animated">
              <i className="fas fa-trophy"></i>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Challenge Completed!</h2>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Congratulations! You successfully progressed through all 4 Cook The Code (CTC) stages: Logic &rarr; Recipe &rarr; Ingredients &rarr; Taste The Sample.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowCompletePopup(false)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl text-xs border border-white/10 transition-all"
              >
                Review Workspace
              </button>
              <button
                onClick={() => {
                  setShowCompletePopup(false);
                  handleSelectProblem('prime-number');
                  triggerToast('Switched to Challenge 2: Prime Number Checker', 'success');
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/20 transition-all"
              >
                Next Challenge &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Challenge Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="modal-overlay">
          <div className="backdrop-blur-2xl bg-slate-900/95 w-[90%] max-w-md rounded-[32px] p-7 shadow-2xl border border-white/15 text-center animate-in zoom-in-95 duration-200 text-white">
            <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-rose-500/20">
              <i className="fas fa-rotate-left"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Start Challenge Fresh?</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              This will clear all 4 stages (Logic, Recipe, Ingredients, Sample Code) and saved progress for <strong className="text-indigo-300">{problem.title}</strong> so you can solve it cleanly from scratch.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-slate-300 font-bold rounded-xl text-xs border border-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResetChallenge()}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-600/30 border border-rose-400/20 transition-all flex items-center gap-2"
              >
                <i className="fas fa-trash-alt"></i>
                <span>Yes, Reset to Fresh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
