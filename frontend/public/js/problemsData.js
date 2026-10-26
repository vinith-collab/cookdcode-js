export const PROBLEMS = {
  "sum-natural-numbers": {
    id: "sum-natural-numbers",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 1",
    shortTitle: "Sum of N Natural Numbers",
    title: "Write a program to find the sum of n natural numbers.",
    description: [
      "Write a program to calculate the sum of the first n natural numbers.",
      "The program should take an integer input n from the user.",
      "The input n should be a positive integer.",
      "The program should calculate the sum of all natural numbers from 1 to n.",
      "The sum should be calculated by step-by-step sequential accumulation."
    ],
    concept: "Sequential Accumulation",
    reveal: {
      logic: "Natural numbers start from 1. To sum the first n natural numbers, we sequentially combine every counting number from 1 up through n into a growing total.",
      recipe: "1. Get the input number n.\n2. Start with total sum as 0 and current number as 1.\n3. Move to the next number and repeat until reaching n.\n4. Add the current number to the total sum.\n5. Display the final total sum.",
      ingredients: "Variables: n (input integer), sum (accumulator initialized to 0), i (loop counter initialized to 1).\nConstructs: while loop / for loop, addition operator (+), assignment operator (=).",
      samplecode: `n = int(input())
sum_val = 0
for i in range(1, n + 1):
    sum_val += i
print(sum_val)`
    },
    starterQuestionSuggestions: {
      logic: [
        "What should we do to find the sum of N numbers?",
        "I don't know",
        "What are natural numbers?",
        "Can we use formula n * (n + 1) / 2?"
      ],
      recipe: [
        "What should I do here?",
        "Step 1: Get the input number n",
        "Step 2: Start with total sum as 0 and current number as 1",
        "Step 3: Move to the next number and repeat until reaching n"
      ],
      ingredients: [
        "What do I do here?",
        "Step 1: Variable for input n",
        "Step 2: Variable sum = 0",
        "Step 3: For loop (start: 1, end: n, next step: +1)",
        "Step 4: sum = sum + i"
      ],
      samplecode: [
        "Do I need to write the code here?",
        "How to trace for n = 5",
        "n = int(input())\nsum_val = 0\nfor i in range(1, n + 1):\n    sum_val += i\nprint(sum_val)"
      ]
    }
  },
  "factorial": {
    id: "factorial",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 3",
    shortTitle: "Factorial of a Number",
    title: "Write a program to find the factorial of a number.",
    description: [
      "Write a program to calculate the factorial of a given positive integer n (denoted as n!).",
      "The factorial of n is the product of all positive integers from 1 up to n (1 \xD7 2 \xD7 3 \xD7 ... \xD7 n).",
      "By mathematical definition, 0! = 1 and 1! = 1.",
      "Take input integer n from the user.",
      "Calculate the sequential product using a loop and display the final factorial value."
    ],
    concept: "Sequential Product & Accumulation",
    reveal: {
      logic: "Factorial of N (N!) is the product of all whole numbers from 1 to N. We start with total product = 1 (not 0) and sequentially multiply each number from 1 to N into the product variable.",
      recipe: "1. Step 1: Accept a number as input.\n2. Step 2: Generate all numbers from 1 up to the input number.\n3. Step 2.1: Multiply each generated number with the factorial variable (fact = fact * i).\n4. Step 3: Print the final factorial value outside the loop.",
      ingredients: "Variables: n for input number, fact initialized to 1.\nConstructs: For loop with Start: 1 (i), Stop: n, Next step: +1.\nOperation: fact = fact * i.\nOutput: Print the final value of fact.",
      samplecode: `var n = 5;
var fact = 1;
for (var i = 1; i <= n; i++) {
  fact = fact * i;
}
print(fact);`
    },
    starterQuestionSuggestions: {
      logic: [
        "what should we do to find the factorial of a number",
        "I don't know",
        "we multiply 1 to 5 one by one",
        "start fact with 1 and for every number from 1 to N multiply that number to fact"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Accept a number as input",
        "step 2 : Generate all numbers from 1 up to the input number",
        "step 2.1 : Multiply each generated number with the factorial variable",
        "step 3 : Print the final factorial value"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : n for input number, fact initialized to 1",
        "step 2 : For loop with Start: 1 (i), Stop: n, Next step: +1",
        "step 2.1 : fact = fact * i",
        "step 3 : Print the final value of fact"
      ],
      samplecode: [
        "Do I need to write the code here",
        "var n = 5;\nvar fact = 1;\nfor (var i = 1; i <= n; i++) {\n  fact = fact * i;\n}\nprint(fact);"
      ]
    }
  },
  "odd-even": {
    id: "odd-even",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 2",
    shortTitle: "Odd or Even",
    title: "Write a program to check if an integer is odd or even.",
    description: [
      "Write a program to determine if an integer is odd or even.",
      "Even numbers are divisible by 2 with remainder 0.",
      "Odd numbers leave remainder 1 when divided by 2."
    ],
    concept: "Modulo Operator & Parity",
    reveal: {
      logic: "Even numbers are perfectly divisible by 2 leaving a remainder of 0. Odd numbers leave a remainder of 1 when divided by 2.",
      recipe: "1. Take input number n.\n2. Calculate remainder r = n % 2.\n3. If r == 0, print Even; else print Odd.",
      ingredients: "Variable: num.\nOperators: % (modulo), == (equality comparison).\nConstruct: if-else statement.",
      samplecode: `num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`
    },
    starterQuestionSuggestions: {
      logic: ["How does modulo 2 determine even or odd?", "Why is division / not suitable?", "What remainder does an odd number leave?"],
      recipe: ["What is the step-by-step algorithm?", "Do I need a loop or just a condition?"],
      ingredients: [
        "What do I do here?",
        "Step 1: Variable for input",
        "What operator gives the remainder?",
        "How do I use if-else condition?",
        "What condition compares remainder to 0?"
      ],
      samplecode: [
        "Do I need to write the code here?",
        "Step 1: Set sample input a = 10",
        "Step 2: Write if (a % 2 == 0)",
        "Step 3 & 4: Add print even and else print odd",
        "How to trace test case with 10 and 7?"
      ]
    }
  },
  "divisor-of-a-number": {
    id: "divisor-of-a-number",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 4",
    shortTitle: "Divisors of a Number",
    title: "Write a program to find all divisors of a number.",
    description: [
      "Write a program to find and display all the divisors of a given positive integer n.",
      "A divisor is an integer that divides n completely without leaving a remainder (n % i == 0).",
      "Divisors of n must lie between 1 and n inclusive.",
      "Take input integer n from the user.",
      "Test each number from 1 to n and display all divisors."
    ],
    concept: "Divisibility & Modulo Division",
    reveal: {
      logic: "Divisors of a number are all positive whole numbers from 1 to n that divide n evenly with remainder 0. For example, for 6, the divisors are 1, 2, 3, 6.",
      recipe: "1. Step 1: Accept a number as input.\n2. Step 2: For every number from 1 up to the given number (include the number itself, start from 1 not 0).\n3. Step 2.1: Check if dividing the given number by the current number leaves a remainder of 0.\n4. Step 2.2: If the remainder is 0, record / display the current number as a divisor.",
      ingredients: "Variables: n for input number.\nConstructs: For loop with Start: 1 (i), Stop: n (i <= n), Step: +1.\nCondition: if (n % i == 0).\nOutput: print(i) to display the divisor.",
      samplecode: `var n = 6;
for (var i = 1; i <= n; i++) {
  if (n % i == 0) {
    print(i);
  }
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what should we do to find the divisor of a number",
        "I don't know",
        "test each number from 1 to the given number, and if the remainder is 0, it's a divisor",
        "1, 2, 3, 6 are divisors of 6"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get the input number",
        "step 2 : For every number from 1 up to the given number",
        "step 2.1 : Check if dividing the given number by the current number leaves a remainder of 0",
        "step 2.2 : If the remainder is 0, note down the number"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : n for input number",
        "step 2 : For loop with Start: 1 (i), Stop: n, Next step: +1",
        "step 2.1 : if (n % i == 0)",
        "step 2.2 : print(i)"
      ],
      samplecode: [
        "Do I need to write the code here",
        "var a=4",
        "how to start\nvar a=4",
        "var a = 4;\nfor (var i = 1; i <= a; i++)",
        "var a = 4;\nfor (var i = 1; i <= a; i++) {\n  if (a % i == 0) {\n    print(i);\n  }\n}",
        "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    print(i);\n  }\n}",
        "why we write i = 1 and not i = 0"
      ]
    }
  },
  "multiplication-table": {
    id: "multiplication-table",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 5",
    shortTitle: "Multiplication Table",
    title: "Write a program to generate the multiplication table of a number.",
    description: [
      "Write a program to calculate and display the multiplication table of a given positive integer n.",
      "A multiplication table shows the product of the fixed number n multiplied consecutively by numbers from 1 to 10.",
      "Take input integer n from the user.",
      "Calculate n \xD7 i for each multiplier i from 1 up to 10 and display the formatted output (e.g., 5 x 1 = 5)."
    ],
    concept: "Sequential Multiplication & Repetition",
    reveal: {
      logic: "A multiplication table shows the product of a fixed number multiplied sequentially by numbers from 1 up to a limit (like 10). For example, for 5: 5 \xD7 1 = 5, 5 \xD7 2 = 10, ... up to 5 \xD7 10 = 50.",
      recipe: "1. Step 1: Get the input number for the table.\n2. Step 2: Take multiplier numbers starting from 1 up to 10.\n3. Step 2.1: Multiply the input number by the current multiplier.\n4. Step 2.2: Display the multiplier and the calculated product.\n5. Step 2.3: Repeat the process until the multiplier reaches 10.",
      ingredients: "Variables: n for the table number.\nConstructs: For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++).\nCalculation: product = n * i.\nOutput: print statement inside the loop showing n, i, and product.",
      samplecode: `var n = 5;
for (var i = 1; i <= 10; i++) {
  var product = n * i;
  print(n + " x " + i + " = " + product);
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what should we do to generate the multiplication table of a number",
        "I don't know / puriyala",
        "keep the given number fixed and multiply it with each number from 1 up to the limit to get the product",
        "for any step we calculate result = number * multiplier"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get the input number for the table",
        "step 2 : Take multiplier numbers starting from 1 up to 10",
        "step 2.1 : Multiply the input number by the current multiplier",
        "step 2.2 : Display the multiplier and the calculated product"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : n for the table number",
        "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
        "step 2.1 : product = n * i",
        "step 2.2 : print statement inside the loop showing n, i, and product"
      ],
      samplecode: [
        "Do I need to write the code here",
        'var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + " x " + i + " = " + product);\n}',
        "var n = 5;\nfor (var i = 0; i <= 10; i++)",
        "var n = 5;\nfor (var i = 1; i < 10; i++)"
      ]
    }
  },
  "prime-number": {
    id: "prime-number",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 6",
    shortTitle: "Prime Number Checker",
    title: "Write a program to check whether a number is prime.",
    description: [
      "Write a program to check if an integer n is a prime number.",
      "A prime number is a number greater than 1 with no positive divisors other than 1 and itself.",
      "Take input integer n from the user.",
      'Output "Prime" if n is prime, otherwise output "Not Prime".'
    ],
    concept: "Divisibility & Factor Counting",
    reveal: {
      logic: "A prime number has exactly 2 distinct positive factors: 1 and itself. If any number between 2 and n-1 divides n with remainder 0, n is not prime.",
      recipe: "1. Take input n.\n2. If n <= 1, it is not prime.\n3. Count how many numbers from 1 to n divide n evenly (remainder == 0).\n4. If count is exactly 2, print Prime; otherwise print Not Prime.",
      ingredients: "Variables: n (integer input), count (factor tally initialized to 0), i (loop divisor from 1 to n).\nConstructs: for loop, modulo operator (%), if condition (== 0), print statement.",
      samplecode: `n = int(input())
if n <= 1:
    print("Not Prime")
else:
    count = 0
    for i in range(1, n + 1):
        if n % i == 0:
            count += 1
    if count == 2:
        print("Prime")
    else:
        print("Not Prime")`
    },
    starterQuestionSuggestions: {
      logic: ["I don't understand prime number", "How do I know if a number is prime?", "What makes 2 the only even prime?"],
      recipe: ["I know I need to check divisibility, but what should I do next?", "How do I sequence the condition checks?", "What is the order of steps?"],
      ingredients: ["Why do I need count?", "Why do I need a loop?", "Which operator checks for divisibility?"],
      samplecode: ["My output is wrong for 6", "How do I trace execution for input 5?", "Why does 1 say Prime in my code?"]
    }
  },
  "next-prime-number": {
    id: "next-prime-number",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 7",
    shortTitle: "Next Prime Number",
    title: "Write a program to find the next prime number.",
    description: [
      "Write a program to find and display the next prime number strictly greater than a given positive integer n.",
      "A prime number is a positive integer greater than 1 with no positive divisors other than 1 and itself.",
      "Take input integer n from the user.",
      "Start testing candidate numbers sequentially from n + 1 (or 2 if n < 2).",
      "The first prime number found is the next prime number. Display that prime number and stop."
    ],
    concept: "Incremental Search & Primality Testing",
    reveal: {
      logic: "To find the next prime number after n, we start testing candidate numbers from n + 1 (if n < 2, start at 2). For each candidate, we check if it is prime by verifying that no number from 2 up to candidate - 1 divides it evenly. The very first prime number encountered is our answer.",
      recipe: "1. Step 1: Get the input number n from the user.\n2. Step 2: Start candidate number as n + 1 (if candidate < 2, candidate = 2).\n3. Step 3: Check if the candidate number is prime.\n4. Step 3.1: If the candidate is prime, display candidate as the next prime and stop.\n5. Step 3.2: If the candidate is not prime, increase candidate by 1 and repeat from Step 3.",
      ingredients: "Variables: n for input number, candidate = n + 1.\nConstructs: while (true) loop for outer candidate search, boolean isPrime flag, inner for loop with Start: 2 (i), Stop: candidate - 1 (i < candidate), Step: +1.\nCondition: if (candidate % i == 0) -> isPrime = false; break.\nVerdict: if (isPrime) -> print(candidate); break; else -> candidate++;",
      samplecode: `var n = 7;
var candidate = n + 1;
if (candidate < 2) candidate = 2;
while (true) {
  var isPrime = true;
  for (var i = 2; i < candidate; i++) {
    if (candidate % i == 0) {
      isPrime = false;
      break;
    }
  }
  if (isPrime) {
    print(candidate);
    break;
  } else {
    candidate++;
  }
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what should we do to find the next prime number",
        "I don't know / puriyala",
        "start from n + 1 and test each candidate number one by one until finding a prime",
        "for n = 7, candidate starts at 8, 9, 10, then 11 is prime"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get the input number n",
        "step 2 : Start candidate number as n + 1",
        "step 3 : Check if candidate number is prime",
        "step 3.1 : If candidate is prime, display candidate and stop",
        "step 3.2 : If candidate is not prime, increase candidate by 1 and repeat"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : Variables n and candidate = n + 1",
        "step 2 : while (true) loop for searching candidates",
        "step 3 : isPrime = true flag and inner for loop from 2 to candidate - 1",
        "step 3.1 : if (candidate % i == 0) isPrime = false",
        "step 4 : if (isPrime) print candidate and break, else candidate++"
      ],
      samplecode: [
        "Do I need to write the code here",
        "var n = 7;\nvar candidate = n + 1;\nwhile (true) {\n  var isPrime = true;\n  for (var i = 2; i < candidate; i++) {\n    if (candidate % i == 0) {\n      isPrime = false;\n      break;\n    }\n  }\n  if (isPrime) {\n    print(candidate);\n    break;\n  } else {\n    candidate++;\n  }\n}"
      ]
    }
  },
  "prime-between-range": {
    id: "prime-between-range",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 8",
    shortTitle: "Prime Numbers in Range",
    title: "Write a program to find all prime numbers in a given range.",
    description: [
      "Write a program to find and display all prime numbers within a given range [start, end].",
      "The program takes two integer inputs: start (lower bound) and end (upper bound).",
      "For every number in this range, verify if it is prime (has exactly 2 unique divisors: 1 and itself).",
      "Output all prime numbers found in the range."
    ],
    concept: "Nested Loops & Range Primality Testing (Divisor count == 2)",
    reveal: {
      logic: "A prime number can only be divided by 1 and itself (2 unique divisors). To find all primes in a range, iterate through every number from start to end, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2, it is a Prime Number.",
      recipe: "1. Step 1: Get starting number and ending number (start, end).\n2. Step 2: For each number in the range from start up to end:\n3. Step 2.1: Start divisor count at 0 for the current number.\n4. Step 2.2: Test every number from 1 up to the current number.\n5. Step 2.3: If dividing leaves a remainder of 0, increase divisor count by 1.\n6. Step 2.4: If divisor count is exactly 2, record / display the current number as prime.",
      ingredients: "Variables: start and end for range limits, num for range iterator.\nConstructs: Outer for loop (start to end), count = 0 inside outer loop, inner for loop (i = 1 to num).\nCondition: if (num % i == 0) { count++; }\nVerdict: if (count == 2) { print(num); }",
      samplecode: `var start = 10;
var end = 20;
for (var num = start; num <= end; num++) {
  var count = 0;
  for (var i = 1; i <= num; i++) {
    if (num % i == 0) {
      count++;
    }
  }
  if (count == 2) {
    print(num);
  }
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what should we do to find prime numbers in a range",
        "I don't know / puriyala",
        "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
        "why must the count of divisors be exactly 2",
        "between 10 and 20, 11 and 13 have 2 divisors so they are prime"
      ],
      recipe: [
        "what should i do here",
        "Step 1: Get starting number and ending number",
        "Step 2: For each number in the range from start up to end",
        "Step 2.1: Start divisor count at 0 for the current number",
        "Step 2.2: Test every number from 1 up to the current number",
        "Step 2.3: If dividing leaves a remainder of 0, increase divisor count by 1",
        "Step 2.4: If divisor count is exactly 2, record / display the current number as prime"
      ],
      ingredients: [
        "what do I do here",
        "Step 1: Variables start, end, num",
        "Step 2: Outer for loop (start: start, stop: num <= end, step: +1)",
        "Step 3: count = 0 inside outer loop",
        "Step 4: Inner for loop (start: 1, stop: i <= num, step: +1)",
        "Step 5: if (num % i == 0) count++",
        "Step 6: if (count == 2) print(num)"
      ],
      samplecode: [
        "Do I need to write the code here",
        "var start = 10;\nvar end = 20;\nfor (var num = start; num <= end; num++) {\n  var count = 0;\n  for (var i = 1; i <= num; i++) {\n    if (num % i == 0) count++;\n  }\n  if (count == 2) print(num);\n}"
      ]
    }
  },
  "sexy-prime": {
    id: "sexy-prime",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 8",
    shortTitle: "Sexy Prime Pairs",
    title: "Write a program to find Sexy Prime number pairs.",
    description: [
      "Write a program to find and display all pairs of prime numbers that differ from each other by six (p, p + 6).",
      "Sexy prime pairs are pairs of prime numbers (p, p + 6) such that both p and p + 6 are prime numbers.",
      "For example, (5, 11), (7, 13), (11, 17), (13, 19), (17, 23), and (23, 29) are sexy prime pairs.",
      "Take an upper limit integer n, and find all pairs (p, p + 6) where p + 6 <= n."
    ],
    concept: "Paired Primality & Offset Testing (diff = 6)",
    reveal: {
      logic: "Sexy primes are pairs of prime numbers of the form (p, p + 6). A pair is valid only when BOTH p is prime and p + 6 is prime (each having exactly 2 divisors).",
      recipe: "1. Step 1: Get the upper limit n.\n2. Step 2: For each number p from 2 up to n - 6:\n3. Step 2.1: Check if p is a prime number (divisor count == 2).\n4. Step 2.2: If p is prime, check if p + 6 is also a prime number (divisor count == 2).\n5. Step 2.3: If both p and p + 6 are prime, display the pair (p, p + 6).",
      ingredients: "Variables: n for limit, p for first candidate, q for second candidate (q = p + 6), count1 and count2 for divisor counters.\nConstructs: Outer for loop (p from 2 to n - 6), inner divisor loops (1 to p, and 1 to q).\nCondition: if (count1 == 2 && count2 == 2) -> print(p, q)",
      samplecode: `var n = 30;
for (var p = 2; p <= n - 6; p++) {
  var count1 = 0;
  for (var i = 1; i <= p; i++) {
    if (p % i == 0) count1++;
  }
  if (count1 == 2) {
    var q = p + 6;
    var count2 = 0;
    for (var j = 1; j <= q; j++) {
      if (q % j == 0) count2++;
    }
    if (count2 == 2) {
      print("(" + p + ", " + q + ")");
    }
  }
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is sexy prime number",
        "is 5 and 11 a sexy prime pair",
        "what if p is prime but p+6 is not prime",
        "what is the upper bound condition",
        "for each number p up to n-6 check if both p and p+6 are prime"
      ],
      recipe: [
        "what should i do here",
        "step 1 : get upper limit n",
        "step 2 : for each number p from 2 up to n - 6",
        "step 3 : check if p is a prime number",
        "step 4 : check if p + 6 is also a prime number",
        "step 5 : display the pair (p, p + 6)"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : n for limit, p for first candidate, q = p + 6",
        "step 2 : outer for loop with Start: 2, Stop: n - 6, Step: +1",
        "step 3 : count1 = 0 for p, count2 = 0 for p + 6",
        "step 4 : if (p % i == 0) count1++ and if ((p+6) % j == 0) count2++",
        "step 5 : if (count1 == 2 && count2 == 2) print pair (p, p + 6)"
      ],
      samplecode: [
        "Do I need to write the code here",
        "for (var p = 2; p <= n - 6; p++)",
        "can we use same count variable for both numbers",
        'var n = 30;\nfor (var p = 2; p <= n - 6; p++) {\n  var count1 = 0;\n  for (var i = 1; i <= p; i++) {\n    if (p % i == 0) count1++;\n  }\n  if (count1 == 2) {\n    var q = p + 6;\n    var count2 = 0;\n    for (var j = 1; j <= q; j++) {\n      if (q % j == 0) count2++;\n    }\n    if (count2 == 2) {\n      print("(" + p + ", " + q + ")");\n    }\n  }\n}'
      ]
    }
  },
  "positive-negative": {
    id: "positive-negative",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 9",
    shortTitle: "Positive or Negative",
    title: "Write a program to check if a number is positive or negative.",
    description: [
      "Write a program to determine whether a given integer n is positive or negative.",
      "Numbers greater than 0 are positive (n > 0).",
      "Numbers less than 0 are negative (n < 0).",
      "Zero (0) is neither positive nor negative.",
      "Take input integer n from the user and display whether it is Positive, Negative, or Zero."
    ],
    concept: "Comparison Operators & Multi-way Branching (> , < , ==)",
    reveal: {
      logic: "Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative. We test the number against 0 using comparison operators (> or <).",
      recipe: '1. Step 1: Get input number n from the user.\n2. Step 2: If the number is greater than 0, display "Positive".\n3. Step 3: Else if the number is less than 0, display "Negative".\n4. Step 4: Else, display "Zero".',
      ingredients: 'Variables: n for input number.\nOperators: > (greater than), < (less than), == (equality).\nConstructs: if - else if - else conditional structure.\nOutput: print("Positive"), print("Negative"), print("Zero").',
      samplecode: `var n = 5;
if (n > 0) {
  print("Positive");
} else if (n < 0) {
  print("Negative");
} else {
  print("Zero");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is a positive number and negative number",
        "give examples of positive and negative numbers",
        "is 0 positive or negative",
        "positive numbers are greater than 0 (e.g. 1, 2, 5), negative numbers are less than 0 (e.g. -1, -2, -5)"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get input number n",
        "step 2 : If n is greater than 0 display Positive",
        "step 3 : Else if n is less than 0 display Negative",
        "step 4 : Else display Zero"
      ],
      ingredients: [
        "what do I do here",
        'step 1 : Variable n for input\nstep 2 : If condition with L.S: n, Operator: >, R.S: 0\nstep 3 : Inside if block: print("Positive")\nstep 4 : Inside else block: print("Negative")',
        "step 1 : Variable n for input",
        "step 2 : If condition with Left side (L.S): n, Operator: >, Right side (R.S): 0",
        'step 3 : Inside if block: print("Positive") and Inside else block: print("Negative")'
      ],
      samplecode: [
        "Do I need to write the code here",
        'var n = 5;\nif (n > 0) {\n  print("Positive");\n} else {\n  print("Negative");\n}'
      ]
    }
  },
  "three-digit-number": {
    id: "three-digit-number",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 10",
    shortTitle: "Three-Digit Number",
    title: "Write a program to check whether a given number is a 3-digit number or not.",
    description: [
      "Write a program to check whether a given integer is a 3-digit number or not.",
      "A 3-digit number has exactly 3 digits and ranges from 100 to 999 inclusive (100 <= n <= 999).",
      "Take an integer input n from the user.",
      "Check both boundaries using a compound condition (n >= 100 && n <= 999).",
      'Display "3-digit number" if valid, else display "Not a 3-digit number".'
    ],
    concept: "Relational & Compound Logical Operators (n >= 100 && n <= 999)",
    reveal: {
      logic: "A 3-digit number has 3 digits and ranges from 100 up to 999 inclusive (e.g., 100, 250, 456, 999). We test if the number is greater than or equal to 100 AND less than or equal to 999 (100 <= n <= 999).",
      recipe: '1. Step 1: Get input number n.\n2. Step 2: Check if n is greater than or equal to 100 and less than or equal to 999.\n3. Step 3: If true, display "3-digit number".\n4. Step 4: Else, display "Not a 3-digit number".',
      ingredients: 'Variables: n for input number.\nOperators: >=, <=, && (logical AND).\nConstructs: if - else conditional structure.\nOutput: print("3-digit number"), print("Not a 3-digit number").',
      samplecode: `var n = 456;
if (n >= 100 && n <= 999) {
  print("3-digit number");
} else {
  print("Not a 3-digit number");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is a 3-digit number",
        "how to check if a number is a 3-digit number",
        "a 3-digit number is between 100 and 999 inclusive (e.g. 250 is 3-digit, 45 is not)",
        "what if number is 99 or 1000"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get input number n",
        "step 2 : If n is greater than or equal to 100 and less than or equal to 999 display 3-digit number, else display Not a 3-digit number",
        'step 1: Get input number n\nstep 2: Check if n is between 100 and 999\nstep 3: If true, display "3-digit number"\nstep 4: Else, display "Not a 3-digit number"'
      ],
      ingredients: [
        "what do I do here",
        'step 1 : Variable n for input\nstep 2 : If condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Op: && (n >= 100 && n <= 999)\nstep 3 : Inside if block: print("3-digit number")\nstep 4 : Inside else block: print("Not a 3-digit number")',
        "step 1 : Variable n for input",
        "step 2 : If condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Operator: &&",
        'step 3 : Inside if block: print("3-digit number") and Inside else block: print("Not a 3-digit number")'
      ],
      samplecode: [
        "Do I need to write the code here",
        'var n = 456;\nif (n >= 100 && n <= 999) {\n  print("3-digit number");\n} else {\n  print("Not a 3-digit number");\n}'
      ]
    }
  },
  "voting-eligibility": {
    id: "voting-eligibility",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 11",
    shortTitle: "Voting Eligibility",
    title: "Write a program to check whether a person is eligible to vote or not.",
    description: [
      "Write a program to check whether a person is eligible to vote based on their age.",
      "A person is eligible to vote if their age is 18 years or above (age >= 18).",
      "Take an integer input age from the user.",
      "Check if age is greater than or equal to 18 (age >= 18).",
      'Display "Eligible" if the person can vote, else display "Not Eligible".'
    ],
    concept: "Relational Operator & Branching (age >= 18)",
    reveal: {
      logic: "A person must be 18 years old or above (age >= 18) to be eligible to vote. We compare the person's age with 18 using comparison operator >=. If age >= 18 -> Eligible to Vote, else -> Not Eligible.",
      recipe: "1. Step 1: Get input age.\n2. Step 2: If age is greater than or equal to 18, display Eligible, else display Not Eligible.",
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 18).\nOutput: print("Eligible"), print("Not Eligible").',
      samplecode: `var age = 20;
if (age >= 18) {
  print("Eligible");
} else {
  print("Not Eligible");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is voting eligibility age",
        "how to check if a person can vote",
        "a person must be 18 years old or above (age >= 18) to vote. Ex: age 20 is eligible, age 16 is not",
        "what if age is exactly 18"
      ],
      recipe: [
        "what should i do here",
        "step 1 : Get input age",
        "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible",
        "step 1: Get input age\nstep 2: Check if age >= 18\nstep 3: If true, display Eligible\nstep 4: Else, display Not Eligible"
      ],
      ingredients: [
        "what do I do here",
        "step 1 : age variable",
        "how to write if condition",
        'step 1 : age variable\nstep 2 : If condition with L.S: age, R.S: 18, Operator: >=\nstep 3 : Inside if block: print("Eligible")\nstep 4 : Inside else block: print("Not Eligible")',
        "step 2 : If condition with L.S: age, R.S: 18, Operator: >="
      ],
      samplecode: [
        "how to write sample code",
        'var age = 20;\nif (age >= 18) {\n  print("Eligible");\n} else {\n  print("Not Eligible");\n}'
      ]
    }
  },
  "pass-or-fail": {
    id: "pass-or-fail",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 12",
    shortTitle: "Pass or Fail",
    title: "Write a program to check whether a student passed or failed based on their mark.",
    description: [
      "Write a program to check whether a student has Passed or Failed based on their marks.",
      "A student passes if their mark is 35 or above (mark >= 35); otherwise they Fail.",
      "Take an integer input mark from the user.",
      "Check if mark is greater than or equal to 35 (mark >= 35).",
      'Display "Pass" if the student passed, else display "Fail".'
    ],
    concept: "Relational Operator & Branching (mark >= 35)",
    reveal: {
      logic: "A student must score 35 marks or above (mark >= 35) to pass. We compare the student's mark with 35 using comparison operator >=. If mark >= 35 -> Pass, else -> Fail.",
      recipe: "1. Step 1: Get mark input.\n2. Step 2: If mark is greater than or equal to 35, display Pass, else display Fail.",
      ingredients: 'Variables: mark for input mark.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: mark, Operator: >=, R.S: 35).\nOutput: print("Pass"), print("Fail").',
      samplecode: `var mark = 45;
if (mark >= 35) {
  print("Pass");
} else {
  print("Fail");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what mark is pass",
        "how to check if student passed",
        "if mark is 35 or more it is pass else fail",
        "what if mark is exactly 35"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get mark input",
        "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : mark variable",
        "how to write if condition",
        "step 2 : If condition with L.S: mark, R.S: 35, Operator: >="
      ],
      samplecode: [
        "how to write sample code",
        'var mark = 45;\nif (mark >= 35) {\n  print("Pass");\n} else {\n  print("Fail");\n}'
      ]
    }
  },
  "greater-than-100": {
    id: "greater-than-100",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 13",
    shortTitle: "Greater Than 100",
    title: "Write a program to check whether a given number is greater than 100 or not.",
    description: [
      "Write a program to check whether a given number is Greater than 100 or Not.",
      "A number is greater than 100 if num > 100; otherwise it is Not greater than 100.",
      "Take an integer input num from the user.",
      "Check if num is strictly greater than 100 (num > 100).",
      'Display "Greater than 100" if true, else display "Not greater than 100".'
    ],
    concept: "Relational Operator & Branching (num > 100)",
    reveal: {
      logic: "Take a number and compare it with 100 using the greater than operator (>). If num > 100 -> Greater, otherwise Not Greater.",
      recipe: "1. Step 1: Get number input.\n2. Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100.",
      ingredients: 'Variables: num for input number.\nOperators: > (greater than).\nConstructs: if - else conditional structure (L.S: num, Operator: >, R.S: 100).\nOutput: print("Greater than 100"), print("Not greater than 100").',
      samplecode: `var num = 120;
if (num > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "how to check if number is greater than 100",
        "what if number is 100",
        "if number is greater than 100 it is greater else not greater"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get number input",
        "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : num variable",
        "how to write if condition",
        "step 2 : If condition with L.S: num, R.S: 100, Operator: >"
      ],
      samplecode: [
        "how to write sample code",
        'var num = 120;\nif (num > 100) {\n  print("Greater than 100");\n} else {\n  print("Not greater than 100");\n}'
      ]
    }
  },
  "profit-or-loss": {
    id: "profit-or-loss",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 14",
    shortTitle: "Profit or Loss",
    title: "Write a program to determine Profit or Loss based on Cost Price and Selling Price.",
    description: [
      "Write a program to determine whether a transaction results in Profit or Loss.",
      "Take two numbers as input: Cost Price (CP) and Selling Price (SP).",
      "Example with numbers: If Cost Price is 50 and Selling Price is 100, Selling Price is higher, so it is a Profit of 50! If Cost Price is 100 and Selling Price is 70, Cost Price is higher, so it is a Loss of 30!",
      "In everyday logic: When Selling Price > Cost Price, it is Profit; otherwise (or when Cost Price > Selling Price), it is Loss.",
      'Display "Profit" if SP > CP, otherwise display "Loss".'
    ],
    concept: "Conditional Statements & Comparison (Selling Price vs Cost Price)",
    reveal: {
      logic: "Take an example with numbers: Cost Price = 50, Selling Price = 100. Since Selling Price (100) > Cost Price (50), it is a Profit of 50! If Cost Price > Selling Price, it is a Loss. Rule: If Selling Price is greater than Cost Price it is Profit, otherwise Loss.",
      recipe: "1. Step 1: Get cost price and selling price.\n2. Step 2: If selling price is greater than cost price, display Profit, else display Loss.",
      ingredients: 'Variables: cp (cost price) and sp (selling price).\nOperators: > (greater than).\nConstructs: if - else conditional structure (L.S: sp, Operator: >, R.S: cp).\nOutput: print("Profit"), print("Loss").',
      samplecode: `var cp = 100;
var sp = 150;
if (sp > cp) {
  print("Profit");
} else {
  print("Loss");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "how to calculate profit or loss with an example of numbers",
        "the cost price is 50 and selling price is 100. if selling price is greater than cost price it is profit else loss",
        "cost price is 50, selling price is 100. when cost price is greater than selling price it is loss, otherwise profit",
        "what if selling price and cost price are equal"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get cost price and selling price",
        "step 2 : If selling price is greater than cost price, display Profit, else display Loss",
        "how to start recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : cp and sp variables",
        "how to write if condition",
        "step 2 : If condition with L.S: sp, R.S: cp, Operator: >",
        'step 3 : Inside if block: print("Profit")'
      ],
      samplecode: [
        "how to write sample code",
        'var cp = 100;\nvar sp = 150;\nif (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}',
        "where to start",
        "syntax theriyala"
      ]
    }
  },
  "leap-year": {
    id: "leap-year",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 15",
    shortTitle: "Leap Year or Not",
    title: "Write a program to check if a given year is a Leap Year or Not.",
    description: [
      "Write a program to check if a given year is a Leap Year or Not.",
      "A leap year occurs every 4 years and has 366 days.",
      "In everyday logic: If a year is evenly divisible by 4 (i.e. year % 4 == 0), it is a Leap Year; otherwise, it is Not a Leap Year.",
      'Display "Leap Year" if year % 4 == 0, otherwise display "Not a Leap Year".'
    ],
    concept: "Conditional Statements & Modulo Operator (year % 4 == 0)",
    reveal: {
      logic: "Take an example: Year 2024. 2024 / 4 = 506 with remainder 0. Since 2024 % 4 == 0, it is a Leap Year! For 2023, 2023 % 4 = 3 (not 0), so it is Not a Leap Year. Rule: If year divided by 4 leaves remainder 0, it is a Leap Year, otherwise Not a Leap Year.",
      recipe: "1. Step 1: Get input year.\n2. Step 2: If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year.",
      ingredients: 'Variables: year for input year.\nOperators: % (modulo), == (equality).\nConstructs: if - else conditional structure (L.S: year % 4, Operator: ==, R.S: 0).\nOutput: print("Leap Year"), print("Not a Leap Year").',
      samplecode: `var year = 2024;
if (year % 4 == 0) {
  print("Leap Year");
} else {
  print("Not a Leap Year");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is a leap year",
        "how to check if a year is leap year",
        "if year % 4 == 0 it is leap year",
        "how many days does a leap year have"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get input year",
        "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year",
        "how to start recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : year variable",
        "how to write if condition",
        "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
        'step 3 : Inside if block: print("Leap Year")'
      ],
      samplecode: [
        "how to write sample code",
        'var year = 2024;\nif (year % 4 == 0) {\n  print("Leap Year");\n} else {\n  print("Not a Leap Year");\n}',
        "where to start",
        "how to write if condition for leap year"
      ]
    }
  },
  "adult-or-minor": {
    id: "adult-or-minor",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 16",
    shortTitle: "Adult or Minor",
    title: "Write a program to check if a person is an Adult or Minor based on their age.",
    description: [
      "Write a program to check if a person is an Adult or Minor based on their age.",
      "A person is classified as an Adult if their age is 18 or older (age >= 18).",
      "Otherwise, if their age is under 18 (age < 18), they are classified as a Minor.",
      'Display "Adult" if age >= 18, otherwise display "Minor".'
    ],
    concept: "Conditional Statements & Comparison Operator (age >= 18)",
    reveal: {
      logic: "Take an example: Age 20. 20 >= 18 is true, so the person is an Adult! For Age 15, 15 >= 18 is false (15 < 18), so the person is a Minor. Rule: If age >= 18 display Adult, otherwise display Minor.",
      recipe: "1. Step 1: Get input age (e.g. 20).\n2. Step 2: Check if age >= 18.\n3. Step 3: Display Adult if true, else display Minor.",
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 18).\nOutput: print("Adult"), print("Minor").',
      samplecode: `var age = 20;
if (age >= 18) {
  print("Adult");
} else {
  print("Minor");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is adult or minor",
        "how to check if a person is adult or minor",
        "if age >= 18 then adult",
        "what is the minimum age to be an adult"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get input age",
        "step 2 : If age is 18 or older display Adult, else display Minor",
        "how to start recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : age variable",
        "how to write if condition",
        "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
        'step 3 : Inside if block: print("Adult")'
      ],
      samplecode: [
        "how to write sample code",
        'var age = 20;\nif (age >= 18) {\n  print("Adult");\n} else {\n  print("Minor");\n}',
        "where to start",
        "how to write if condition for adult or minor"
      ]
    }
  },
  "divisible-by-5": {
    id: "divisible-by-5",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 17",
    shortTitle: "Divisible by 5 or Not",
    title: "Write a program to check if a number is Divisible by 5 or Not.",
    description: [
      "Write a program to check if a given integer is divisible by 5 or not.",
      "A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0).",
      "Otherwise, if the remainder is not 0 (n % 5 != 0), it is not divisible by 5.",
      'Display "Divisible by 5" if n % 5 == 0, otherwise display "Not Divisible by 5".'
    ],
    concept: "Conditional Statements & Modulo Operator (n % 5 == 0)",
    reveal: {
      logic: "Take an example: Number 25. 25 % 5 = 0 (leaves remainder 0), so it is Divisible by 5! For 23, 23 % 5 = 3 != 0, so it is Not Divisible by 5. Rule: If n % 5 == 0 display Divisible by 5, otherwise Not Divisible by 5.",
      recipe: "1. Step 1: Get input number n (e.g. 25).\n2. Step 2: If number divided by 5 leaves remainder 0 (n % 5 == 0), display Divisible by 5, else display Not Divisible by 5.",
      ingredients: 'Variables: n for input number.\nOperators: % (modulo), == (equality).\nConstructs: if - else conditional structure (L.S: n % 5, Operator: ==, R.S: 0).\nOutput: print("Divisible by 5"), print("Not Divisible by 5").',
      samplecode: `var n = 25;
if (n % 5 == 0) {
  print("Divisible by 5");
} else {
  print("Not Divisible by 5");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "what is divisible by 5",
        "how to check if a number is divisible by 5",
        "if n % 5 == 0 then divisible by 5",
        "numbers ending in 0 or 5 are divisible"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get input number",
        "step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5",
        "how to start recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : n variable",
        "how to write if condition",
        "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0",
        'step 3 : Inside if block: print("Divisible by 5")'
      ],
      samplecode: [
        "how to write sample code",
        'var n = 25;\nif (n % 5 == 0) {\n  print("Divisible by 5");\n} else {\n  print("Not Divisible by 5");\n}',
        "where to start",
        "how to write if condition for divisible by 5"
      ]
    }
  },
  "maximum-of-two": {
    id: "maximum-of-two",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 18",
    shortTitle: "Maximum of Two Numbers",
    title: "Write a program to find the maximum (larger) of two given numbers.",
    description: [
      "Write a program to find the maximum (larger) of two given numbers.",
      "Get two numbers a and b from the user.",
      "Compare them: if a > b, then a is the maximum number.",
      "Otherwise (if b >= a), then b is the maximum number.",
      "Display the maximum number accordingly."
    ],
    concept: "Conditional Statements & Relational Operators (a > b)",
    reveal: {
      logic: "Compare number a and number b using the greater-than operator (>). If a > b, a is greater (maximum); else b is greater (maximum). For example: with a = 25 and b = 10, 25 > 10 is true, so 25 is maximum.",
      recipe: "1. Step 1: Get two numbers a and b.\n2. Step 2: If a is greater than b, display a is Maximum, else display b is Maximum.",
      ingredients: 'Variables: a and b for input variables.\nOperators: > (greater than comparison).\nConstructs: if - else conditional structure (L.S: a, Operator: >, R.S: b).\nOutput: print("a is max"), print("b is max").',
      samplecode: `var a = 10, b = 25;
if (a > b) {
  print("a is max");
} else {
  print("b is max");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "how to find maximum of two numbers",
        "if a > b then a is maximum else b is maximum",
        "what is greater than operator",
        "compare two numbers"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get two numbers a and b",
        "step 2 : If a is greater than b, display a is Maximum, else display b is Maximum",
        "how to compare two numbers in recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : a and b for input variables",
        "how to write if condition",
        "step 2 : If condition with L.S: a, R.S: b, Operator: >",
        'step 3 : Inside if block: print("a is max")'
      ],
      samplecode: [
        "how to write sample code",
        'var a = 10, b = 25;\nif (a > b) {\n  print("a is max");\n} else {\n  print("b is max");\n}',
        "where to start",
        "how to compare a and b in code"
      ]
    }
  },
  "senior-citizen": {
    id: "senior-citizen",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 19",
    shortTitle: "Senior Citizen or Not",
    title: "Write a program to check whether a person is a Senior Citizen or Not based on their age (age >= 60).",
    description: [
      "Write a program to check whether a person is a Senior Citizen or Not based on their age.",
      "Get an age value from the user.",
      "Check if age is 60 or above (age >= 60).",
      'If age is 60 or greater, display "Senior Citizen".',
      'Otherwise, display "Not Senior Citizen".'
    ],
    concept: "Conditional Statements & Relational Operators (age >= 60)",
    reveal: {
      logic: "A person aged 60 or above is considered a Senior Citizen. We test this using the relational comparison operator >= with 60 (age >= 60). If age >= 60 is true, the person is a Senior Citizen; otherwise, Not a Senior Citizen. For example: with age = 65, 65 >= 60 is true -> Senior Citizen. With age = 45, 45 >= 60 is false -> Not Senior Citizen.",
      recipe: "1. Step 1: Get age input.\n2. Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen.",
      ingredients: 'Variables: age for input age.\nOperators: >= (greater than or equal to comparison).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 60).\nOutput: print("Senior Citizen"), print("Not Senior Citizen").',
      samplecode: `var age = 65;
if (age >= 60) {
  print("Senior Citizen");
} else {
  print("Not Senior Citizen");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "who is a senior citizen",
        "how to check senior citizen",
        "if age >= 60 senior citizen",
        "age 65 is senior citizen example"
      ],
      recipe: [
        "what steps to write",
        "step 1 : Get age input",
        "step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen",
        "how to write senior citizen algorithm"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : age variable",
        "how to write if condition",
        "step 2 : If condition with L.S: age, R.S: 60, Operator: >=",
        'step 3 : Inside if block: print("Senior Citizen")',
        "step 4 : Fallback else block",
        'step 5 : Inside else block: print("Not Senior Citizen")'
      ],
      samplecode: [
        "how to write sample code",
        'var age = 65; if (age >= 60) print("Senior Citizen"); else print("Not Senior Citizen");',
        "where to start",
        "how to check age 60 in code"
      ]
    }
  },
  "vowel-or-consonant": {
    id: "vowel-or-consonant",
    category: "fundamentals",
    phaseLabel: "Phase 1: Fundamentals",
    problemNo: "Problem 20",
    shortTitle: "Vowel or Consonant",
    title: "Write a program to check whether a given character is a Vowel or a Consonant.",
    description: [
      "Write a program to check whether a given character is a Vowel or a Consonant.",
      "Get a character ch from the user.",
      "Check if ch is equal to any of the vowels: 'a', 'e', 'i', 'o', or 'u' (case-insensitive).",
      'If ch matches any vowel, display "Vowel".',
      'Otherwise, display "Consonant".'
    ],
    concept: "Conditional Logic & Logical OR Operator (ch == 'a' || ch == 'e' || ...)",
    reveal: {
      logic: "Check if character ch is equal to 'a', 'e', 'i', 'o', or 'u'. We use logical OR (||) because matching ANY ONE vowel makes it a Vowel. If it matches none of them, it is a Consonant.",
      recipe: "1. Step 1: Get character input ch from the user.\n2. Step 2: If ch is equal to 'a', 'e', 'i', 'o', or 'u', display Vowel, else display Consonant.",
      ingredients: 'Variables: ch for input character.\nOperators: == (equality) and || (logical OR).\nConstructs: if - else conditional structure.\nOutput: print("Vowel"), print("Consonant").',
      samplecode: `var ch = 'e';
if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
  print("Vowel");
} else {
  print("Consonant");
}`
    },
    starterQuestionSuggestions: {
      logic: [
        "how to check if a character is a vowel or consonant",
        "vowels are a, e, i, o, u and rest are consonants",
        "why use OR operator for vowels",
        "check character against vowels"
      ],
      recipe: [
        "what steps to write in recipe",
        "step 1 : Get character input ch from user",
        "step 2 : If ch is equal to a, e, i, o, or u display Vowel, else display Consonant",
        "how to write vowel check step in recipe"
      ],
      ingredients: [
        "what ingredients do we need",
        "step 1 : ch variable for character",
        "step 2 : If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'",
        'step 3 : Inside if block: print("Vowel")',
        "step 4 : Fallback else block",
        'step 5 : Inside else block: print("Consonant")'
      ],
      samplecode: [
        "how to write sample code for vowel or consonant",
        `var ch = 'e';
if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
  print("Vowel");
} else {
  print("Consonant");
}`,
        "how to test vowel or consonant code"
      ]
    }
  }
};
const USERS = [
  { id: "student_alex", name: "Alex Rivera", role: "Level 1: Logic Apprentice" },
  { id: "student_priya", name: "Priya Sharma", role: "Level 2: Recipe Planner" },
  { id: "student_chen", name: "Chen Wei", role: "Level 4: Full Stack Architect" }
];
const getInitialProblemId = () => {
  try {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pParam = urlParams.get("problem");
      if (pParam && PROBLEMS[pParam]) return pParam;
      const hash = window.location.hash.replace("#", "");
      if (hash && PROBLEMS[hash]) return hash;
      const saved = localStorage.getItem("cookdcode_active_problem_id");
      if (saved && PROBLEMS[saved]) return saved;
    }
  } catch (e) {
    console.error("Error reading initial problem ID:", e);
  }
  return "sum-natural-numbers";
};
const getInitialUser = () => {
  try {
    if (typeof window !== "undefined") {
      const savedUserId = localStorage.getItem("cookdcode_active_user_id");
      if (savedUserId) {
        const found = USERS.find((u) => u.id === savedUserId);
        if (found) return found;
      }
    }
  } catch (e) {
  }
  return USERS[2];
};
const getSavedProblemData = (userId, problemId) => {
  try {
    if (typeof window !== "undefined") {
      const versionKey = "cookdcode_v_2026_09_21_prime_range_v20";
      if (!localStorage.getItem(versionKey)) {
        localStorage.removeItem(`cookdcode_${userId}_prime-between-range`);
        localStorage.setItem(versionKey, "true");
      }
      const saved = localStorage.getItem(`cookdcode_${userId}_${problemId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
  }
  return null;
};
const getInitialHintForProblem = (problemId) => {
  if (problemId === "prime-number") {
    return {
      hint: "A prime number is greater than 1 and has no positive divisors other than 1 and itself. Think about how to check if any number divides it evenly.",
      hintLevel: 1,
      source: "firebase",
      concept: "Divisibility & Factor Counting",
      section: "logic",
      nextSuggestedAction: "What condition must be met for a number to divide another evenly?"
    };
  }
  if (problemId === "sexy-prime") {
    return {
      hint: "Sexy primes are pairs of prime numbers (p, p + 6) such that both p and p + 6 are prime numbers (differing by 6).",
      hintLevel: 1,
      source: "firebase",
      concept: "Paired Primality & Offset Testing",
      section: "logic",
      nextSuggestedAction: "How can you verify that both p and p + 6 are prime numbers?"
    };
  }
  if (problemId === "odd-even") {
    return {
      hint: "Even numbers are cleanly divisible by 2 with no remainder, while odd numbers leave a remainder of 1 when divided by 2.",
      hintLevel: 1,
      source: "firebase",
      concept: "Modulo Operator & Parity",
      section: "logic",
      nextSuggestedAction: "Which operator allows you to check the remainder when dividing by 2?"
    };
  }
  if (problemId === "positive-negative") {
    return {
      hint: "Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative.",
      hintLevel: 1,
      source: "firebase",
      concept: "Comparison Operators & Multi-way Branching",
      section: "logic",
      nextSuggestedAction: "How can you compare a number against 0 to check if it is positive or negative?"
    };
  }
  if (problemId === "leap-year") {
    return {
      hint: "A leap year occurs every 4 years and has 366 days. It is divisible by 4 with remainder 0 (year % 4 == 0).",
      hintLevel: 1,
      source: "firebase",
      concept: "Modulo Arithmetic & Divisibility by 4",
      section: "logic",
      nextSuggestedAction: "How can you check if a year leaves a remainder of 0 when divided by 4?"
    };
  }
  if (problemId === "adult-or-minor") {
    return {
      hint: "A person is classified as an Adult if their age is 18 or older (age >= 18), and a Minor if under 18 (age < 18).",
      hintLevel: 1,
      source: "firebase",
      concept: "Comparison Operators & Threshold (age >= 18)",
      section: "logic",
      nextSuggestedAction: "How can you compare a person's age to 18 to check if they are an Adult or Minor?"
    };
  }
  if (problemId === "divisible-by-5") {
    return {
      hint: "A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0). If the remainder is not 0, it is Not Divisible by 5.",
      hintLevel: 1,
      source: "firebase",
      concept: "Modulo Arithmetic & Divisibility by 5",
      section: "logic",
      nextSuggestedAction: "How can you check if a number leaves a remainder of 0 when divided by 5?"
    };
  }
  if (problemId === "maximum-of-two") {
    return {
      hint: "Compare number a and number b using the greater-than operator (>). If a > b, a is greater; else b is greater.",
      hintLevel: 1,
      source: "firebase",
      concept: "Comparison Operators (a > b)",
      section: "logic",
      nextSuggestedAction: "How can you compare number a and number b using the greater-than operator?"
    };
  }
  if (problemId === "senior-citizen") {
    return {
      hint: "A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen.",
      hintLevel: 1,
      source: "firebase",
      concept: "Relational Comparison Operator (age >= 60)",
      section: "logic",
      nextSuggestedAction: "How can you compare a person's age to 60 using the >= operator?"
    };
  }
  if (problemId === "vowel-or-consonant") {
    return {
      hint: "Check if character ch equals 'a', 'e', 'i', 'o', or 'u' using logical OR (||). If true, it is a Vowel; else it is a Consonant.",
      hintLevel: 1,
      source: "firebase",
      concept: "Logical OR Operator (ch == 'a' || ch == 'e' || ...)",
      section: "logic",
      nextSuggestedAction: "How do you check if a character equals any of the 5 vowels?"
    };
  }
  return null;
};
export { USERS, getInitialProblemId, getInitialUser, getSavedProblemData, getInitialHintForProblem };

export const getSectionHumanTouchPrompts = (section, problemId) => {
  if (problemId === "senior-citizen") {
    if (section === "logic") {
      return [
        "Who is considered a Senior Citizen?",
        "How to check senior citizen using >= operator?",
        "If age >= 60 -> Senior Citizen, else -> Not Senior Citizen",
        "Example: age = 65 -> 65 >= 60 is true (Senior Citizen)",
        "Example: age = 45 -> 45 >= 60 is false (Not Senior Citizen)"
      ];
    }
    if (section === "recipe") {
      return [
        "What steps to write in recipe?",
        "Step 1: Get age input",
        "Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen",
        "How to write senior citizen algorithm without code words?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What ingredients do we need?",
        "Step 1: age variable for input",
        "Step 2: If condition with L.S: age, R.S: 60, Operator: >=",
        'Step 3: Inside if block: print("Senior Citizen")',
        "Step 4: Fallback else block",
        'Step 5: Inside else block: print("Not Senior Citizen")'
      ];
    }
    if (section === "samplecode") {
      return [
        "How to write sample code for Senior Citizen?",
        'var age = 65; if (age >= 60) print("Senior Citizen"); else print("Not Senior Citizen");',
        "How to compare age with 60 using >= operator?",
        "How to test with age 65 and age 45?"
      ];
    }
  }
  if (problemId === "vowel-or-consonant") {
    if (section === "logic") {
      return [
        "How to check if a character is a vowel or consonant?",
        "What are the 5 vowels (a, e, i, o, u)?",
        "Why use the OR operator (||) for vowels?",
        "Example with character 'e' vs 'x'",
        "What is a consonant in English alphabet?"
      ];
    }
    if (section === "recipe") {
      return [
        "What steps to write in recipe?",
        "Step 1: Get character input ch from user",
        "Step 2: If ch is equal to a, e, i, o, or u, display Vowel, else display Consonant",
        "How to sequence steps without code words?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What ingredients do we need?",
        "Step 1: ch variable for character",
        "Step 2: If condition checking ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u'",
        'Step 3: Inside if block: print("Vowel")',
        "Step 4: Fallback else block",
        'Step 5: Inside else block: print("Consonant")'
      ];
    }
    if (section === "samplecode") {
      return [
        "How to write sample code for vowel or consonant?",
        "How to declare character variable var ch = 'e';?",
        "How to write if (ch == 'a' || ch == 'e' || ...) condition?",
        "How to test both Vowel and Consonant test cases?"
      ];
    }
  }
  if (problemId === "maximum-of-two") {
    if (section === "logic") {
      return [
        "How to find maximum of two numbers?",
        "If a > b then a is maximum else b is maximum",
        "What is the greater-than operator (>) in logic?",
        "Example with concrete numbers (25 vs 10)",
        "Why must logic be defined mathematically?"
      ];
    }
    if (section === "recipe") {
      return [
        "What steps to write in recipe?",
        "Step 1: Get two numbers a and b",
        "Step 2: If a is greater than b, display a is Maximum, else display b is Maximum",
        "Why avoid code words in recipe?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What ingredients do we need?",
        "Step 1: a and b for input variables",
        "How to write if condition with Left Side, Right Side, Operator?",
        "Step 2: If condition with L.S: a, R.S: b, Operator: >",
        'Step 3: Inside if block: print("a is max")'
      ];
    }
    if (section === "samplecode") {
      return [
        "How to write sample code for maximum of two?",
        "How to declare test variables (var a = 10, b = 25;)?",
        'How to write if (a > b) print("a is max"); else print("b is max");',
        "How to test both branches with test cases?"
      ];
    }
  }
  if (problemId === "divisible-by-5") {
    if (section === "logic") {
      return [
        "Why is a number divisible by 5?",
        "How to express n % 5 == 0 mathematically?",
        "Example calculation for 25 vs 23",
        "What remainder does a non-divisible number leave?",
        "Why must logic be defined mathematically?"
      ];
    }
    if (section === "recipe") {
      return [
        "What is Step 1 in plain English?",
        "How to check remainder with 5 without code words?",
        "How to write Divisible vs Not Divisible branches?",
        "Why avoid code words in recipe?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What variable is needed (n)?",
        "What operators are needed (% and ==)?",
        "How to write the if-else construct (L.S: n % 5, Operator: ==, R.S: 0)?",
        "How to write print statements with quotes?"
      ];
    }
    if (section === "samplecode") {
      return [
        "How do I start the prototype code (var n = 25;)?",
        "How to write if (n % 5 == 0)?",
        "How to write the else branch and print messages?",
        "How to trace test cases for 25 and 23?"
      ];
    }
  }
  if (problemId === "adult-or-minor") {
    if (section === "logic") {
      return [
        "Who is an adult vs minor?",
        "How to write the mathematical condition (age >= 18)?",
        "Example calculation for age 20 vs 15",
        "Why must logic be defined mathematically?",
        "How to test both adult and minor outcomes?"
      ];
    }
    if (section === "recipe") {
      return [
        "What is Step 1 in plain English?",
        "How to write the condition step without code keywords?",
        "How to write the Minor outcome step?",
        "Why should we avoid if/else code words in recipe?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What variables do I need (age)?",
        "What comparison operator is needed (>=)?",
        "What construct connects the two branches (if-else)?",
        "How to write print statements with quotes?"
      ];
    }
    if (section === "samplecode") {
      return [
        "How do I start the prototype code?",
        "I declared var age = 20, what is my next line?",
        "How to write the if condition (age >= 18)?",
        "How to write the else branch?",
        "Why is quotation mark needed in print?"
      ];
    }
  }
  if (problemId === "leap-year") {
    if (section === "logic") {
      return [
        "Why is a leap year divisible by 4?",
        "How to express year % 4 == 0 mathematically?",
        "Example calculation for year 2024 vs 2023",
        "What is the remainder logic?"
      ];
    }
    if (section === "recipe") {
      return [
        "How to write Step 1 (take input year)?",
        "How to write remainder check step in plain English?",
        "How to write Leap Year vs Not Leap Year branches?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What variables are needed (year, rem)?",
        "What operators are needed (% and ==)?",
        "What construct connects branches (if-else)?"
      ];
    }
    if (section === "samplecode") {
      return [
        "How do I start the prototype code?",
        "I declared var year = 2024, what is my next line?",
        "How to write the if condition (year % 4 == 0)?",
        "How to write the else branch?",
        "Why is quotation mark needed in print?"
      ];
    }
  }
  if (problemId === "profit-or-loss") {
    if (section === "logic") {
      return [
        "When does a transaction make profit vs loss?",
        "Mathematical formula for profit (sp > cp)",
        "Example calculation with cp = 100, sp = 150",
        "What happens when sp == cp (no profit no loss)?"
      ];
    }
    if (section === "recipe") {
      return [
        "How to step-by-step compare selling price and cost price?",
        "How to formulate the profit calculation step?",
        "How to formulate the loss condition step?"
      ];
    }
    if (section === "ingredients") {
      return [
        "What variables are needed (cp, sp, profit)?",
        "What comparison operator is needed (> and -)?",
        "What branching structure handles profit, loss, neither?"
      ];
    }
    if (section === "samplecode") {
      return [
        "How do I start the prototype code?",
        "I declared variables (cp = 100, sp = 150), what is my next line?",
        "How to write the if condition (sp > cp)?",
        "How to write the else branch?",
        "Why is quotation mark needed in print?"
      ];
    }
  }
  if (problemId === "positive-negative") {
    if (section === "logic") {
      return [
        "How to test if a number is positive, negative or zero?",
        "Mathematical comparison against 0 (n > 0, n < 0)",
        "Example with positive (5), negative (-3), zero (0)"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Get input number",
        "Step 2: Check if number > 0 for Positive",
        "Step 3: Else if number < 0 for Negative",
        "Step 4: Else display Zero"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: n",
        "Operators: >, <, ==",
        "Construct: if - else if - else",
        "Output: print statements with strings"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to initialize var n = 5?",
        "How to write if (n > 0)?",
        "How to write else if (n < 0)?",
        'How to write else { print("Zero"); }?'
      ];
    }
  }
  if (problemId === "voting-eligibility") {
    if (section === "logic") {
      return [
        "Who is eligible to vote (age >= 18)?",
        "Mathematical comparison for voting age",
        "Example testing age 18 and age 16"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Take age input",
        "Step 2: Check if age >= 18",
        "Step 3: If true display Eligible, else Not Eligible"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: age",
        "Operators: >=",
        "Construct: if-else statement"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to start with var age = 20?",
        "How to check if (age >= 18)?",
        "How to handle the else branch?"
      ];
    }
  }
  if (problemId === "three-digit-number") {
    if (section === "logic") {
      return [
        "What is the mathematical range of 3-digit numbers?",
        "Compound condition: n >= 100 && n <= 999",
        "Testing candidate 456 vs 45 vs 1000"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Get input integer",
        "Step 2: Check if number is between 100 and 999",
        "Step 3: If within range display 3-digit number, else Not"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: n",
        "Operators: >=, <=, &&",
        "Construct: if-else statement"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to check compound condition (n >= 100 && n <= 999)?",
        "How to print result strings in quotes?"
      ];
    }
  }
  if (problemId === "sum-natural-numbers") {
    if (section === "logic") {
      return [
        "How does summing natural numbers from 1 to n work?",
        "Step-by-step accumulator addition example",
        "Formula n*(n+1)/2 vs iterative addition"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Get input number n",
        "Step 2: Start total sum as 0 and counter as 1",
        "Step 3: Repeat adding current number until reaching n",
        "Step 4: Display total sum"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: n, sum = 0, i = 1",
        "Loop construct: while loop or for loop",
        "Operators: +, =, <=",
        "Output: print(sum)"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to declare sum = 0 and loop from 1 to n?",
        "How to accumulate sum += i in loop?",
        "How to print final sum after loop finishes?"
      ];
    }
  }
  if (problemId === "prime-number") {
    if (section === "logic") {
      return [
        "Why does a prime number have exactly 2 divisors?",
        "Testing divisors from 1 to n for n = 7",
        "Why 1 is not a prime number"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Get input number n",
        "Step 2: Start divisor count at 0",
        "Step 3: Test each divisor from 1 to n",
        "Step 4: If divisor count == 2 display Prime, else Not Prime"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: n, count = 0, i = 1",
        "Loop: for loop (1 to n)",
        "Condition: if (n % i == 0)",
        "Decision: if (count == 2)"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to set up for loop from 1 to n?",
        "How to check n % i == 0 and increment count?",
        "How to check count == 2 after loop?"
      ];
    }
  }
  if (problemId === "odd-even") {
    if (section === "logic") {
      return [
        "Why is even number divisible by 2 with remainder 0?",
        "Modulo operation n % 2 for 8 and 7",
        "Mathematical formula for parity"
      ];
    }
    if (section === "recipe") {
      return [
        "Step 1: Get input number n",
        "Step 2: Check if n % 2 == 0",
        "Step 3: If remainder is 0 display Even, else Odd"
      ];
    }
    if (section === "ingredients") {
      return [
        "Variables: n or num",
        "Operators: % (modulo), == (equality)",
        "Construct: if-else statement"
      ];
    }
    if (section === "samplecode") {
      return [
        "How to write if (n % 2 == 0)?",
        "How to write the else branch?",
        'How to print "Even" and "Odd"?'
      ];
    }
  }
  if (section === "logic") {
    return [
      "How does this problem work conceptually?",
      "How to define this logic mathematically with an example?",
      "What inputs and boundary test cases should I verify?",
      "How do the math operations prove the correct answer?"
    ];
  }
  if (section === "recipe") {
    return [
      "What is Step 1 in plain English?",
      "How to describe sequential steps without code keywords?",
      "How to express decision branches in simple English?",
      "How to display the final output?"
    ];
  }
  if (section === "ingredients") {
    return [
      "What variables and data types are needed?",
      "What arithmetic or comparison operators are required?",
      "What control structures (if-else, loop) should be used?",
      "What output statement is needed?"
    ];
  }
  return [
    "How do I start the prototype code?",
    "I declared variables, what is my next line?",
    "How to write the conditional or loop statement?",
    "How to handle the else branch / loop termination?",
    "Why is quotation mark needed in print?"
  ];
};
