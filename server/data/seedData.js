const SEED_PROBLEMS = {
  "sum-natural-numbers": {
    id: "sum-natural-numbers",
    category: "fundamentals",
    programName: "Sum of N Natural Numbers",
    description: `Write a program to calculate the sum of the first n natural numbers.
The program should take an integer input n from the user.
The input n should be a positive integer.
The program should calculate the sum of all natural numbers from 1 to n.
The sum should be calculated using a loop or formula.`,
    concept: "Loops and Accumulator",
    logicReveal: "Natural numbers start from 1. To sum the first n natural numbers, we sequentially combine every counting number from 1 up through n into a growing total.",
    recipeReveal: "1. Get the input number n.\n2. Start with total sum as 0 and current number as 1.\n3. Move to the next number and repeat until reaching n.\n4. Add the current number to the total sum.\n5. Display the final total sum.",
    ingredientsReveal: "Variables: n (input integer), sum (accumulator initialized to 0), i (loop counter initialized to 1).\nConstructs: while loop / for loop, addition operator (+), assignment operator (=).",
    sampleReveal: `n = int(input())
sum_val = 0
for i in range(1, n + 1):
    sum_val += i
print(sum_val)`
  },
  "prime-number": {
    id: "prime-number",
    category: "fundamentals",
    programName: "Prime Number Checker",
    description: `Write a program to check whether a given positive integer n is a prime number.
A prime number is a number greater than 1 that has no positive divisors other than 1 and itself.`,
    concept: "Divisibility & Factor Counting",
    logicReveal: "A prime number has exactly 2 distinct positive factors: 1 and itself. If any number between 2 and n-1 divides n with remainder 0, n is not prime.",
    recipeReveal: "1. Take input n.\n2. If n <= 1, it is not prime.\n3. Count how many numbers from 1 to n divide n evenly.\n4. If count is exactly 2, print Prime; otherwise print Not Prime.",
    ingredientsReveal: "Variables: n (integer input), count (factor tally initialized to 0), i (loop divisor from 1 to n).\nConstructs: for loop, modulo operator (%), if condition (== 0), print statement.",
    sampleReveal: `n = int(input())
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
  "odd-even": {
    id: "odd-even",
    category: "fundamentals",
    programName: "Odd or Even Checker",
    description: `Write a program to determine if an integer is odd or even using remainder division.`,
    concept: "Modulo Operator & Parity",
    logicReveal: "Even numbers are perfectly divisible by 2 leaving a remainder of 0. Odd numbers leave a remainder of 1 when divided by 2.",
    recipeReveal: "1. Take input number n.\n2. Calculate remainder r = n % 2.\n3. If r == 0, print Even; else print Odd.",
    ingredientsReveal: "Variable: num.\nOperators: % (modulo), == (equality comparison).\nConstruct: if-else statement.",
    sampleReveal: `num = int(input())
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`
  },
  "divisor-of-a-number": {
    id: "divisor-of-a-number",
    category: "fundamentals",
    programName: "Divisors of a Number",
    description: `Write a program to find all the divisors of a given positive integer n.
A divisor is an integer that divides n completely without leaving a remainder (n % i == 0).
Divisors must be between 1 and n inclusive.`,
    concept: "Divisibility & Factor Finding",
    logicReveal: "Divisors of a number are all positive whole numbers from 1 to n that divide n evenly with remainder 0.",
    recipeReveal: "1. Get the input number n.\n2. For every number from 1 up to the given number (starts from 1; up to n).\n2.1 Check if dividing the given number by the current number leaves a remainder of 0.\n2.2 If the remainder is 0, record / display the current number as a divisor.",
    ingredientsReveal: "Variables: n for input number.\nLoop: For loop with Start: 1 (i), Stop: n (i <= n), Step: +1.\nCondition: if (n % i == 0).\nOutput: print(i).",
    sampleReveal: `var n = 6;
for (var i = 1; i <= n; i++) {
  if (n % i == 0) {
    print(i);
  }
}`
  },
  "multiplication-table": {
    id: "multiplication-table",
    category: "fundamentals",
    programName: "Multiplication Table of a Number",
    description: `Write a program to calculate and display the multiplication table of a given positive integer n.
A multiplication table shows the product of the fixed number n multiplied consecutively by numbers from 1 to 10.
Take input integer n from the user.
Calculate n \xD7 i for each multiplier i from 1 up to 10 and display the formatted output.`,
    concept: "Sequential Multiplication & Repetition",
    logicReveal: "A multiplication table shows the product of a fixed number multiplied sequentially by numbers from 1 up to a limit (like 10). For example, for 5: 5 \xD7 1 = 5, 5 \xD7 2 = 10, ... up to 5 \xD7 10 = 50.",
    recipeReveal: "1. Get the input number for the table.\n2. Take multiplier numbers starting from 1 up to 10.\n2.1 Multiply the input number by the current multiplier.\n2.2 Display the multiplier and the calculated product.\n2.3 Repeat until multiplier reaches 10.",
    ingredientsReveal: "Variables: n for the table number.\nConstructs: For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++).\nCalculation: product = n * i.\nOutput: print statement inside the loop showing n, i, and product.",
    sampleReveal: `var n = 5;
for (var i = 1; i <= 10; i++) {
  var product = n * i;
  print(n + " x " + i + " = " + product);
}`
  },
  "next-prime-number": {
    id: "next-prime-number",
    category: "fundamentals",
    programName: "Next Prime Number",
    description: `Write a program to find the next prime number strictly greater than a given positive integer n.
The program should take an integer input n from the user.
Starting from n + 1, test each consecutive number to check if it is prime.
Output the first prime number found.`,
    concept: "Incremental Search & Primality Testing",
    logicReveal: "The next prime number is the smallest prime strictly greater than n. We start testing candidate numbers from n + 1 onwards. For each candidate, we verify if it has any divisors other than 1 and itself. The first candidate with zero other divisors is our answer.",
    recipeReveal: "1. Get the input number n.\n2. Start candidate number as n + 1 (if candidate < 2, set candidate to 2).\n3. Check if the candidate number is prime.\n3.1. If candidate is prime, display candidate as the next prime and stop.\n3.2. If candidate is not prime, increase candidate by 1 and repeat from Step 3.",
    ingredientsReveal: "Variables: n for input number, candidate = n + 1.\nOuter Loop: while (true) loop.\nInner Loop & Flag: isPrime = true, for loop from 2 up to candidate - 1 (i < candidate).\nCondition: if (candidate % i == 0) { isPrime = false; break; }\nOutput & Termination: if (isPrime) { print(candidate); break; } else { candidate++; }",
    sampleReveal: `var n = 7;
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
  }
  candidate++;
}`
  },
  "prime-between-range": {
    id: "prime-between-range",
    category: "fundamentals",
    programName: "Prime Numbers in a Given Range",
    description: `Write a program to find and display all prime numbers within a given range [start, end].
The program takes two integer inputs: start (lower bound) and end (upper bound).
For every number in this range, verify if it is prime (has exactly 2 unique divisors: 1 and itself).
Output all prime numbers found in the range.`,
    concept: "Nested Loops & Range Primality Testing (Divisor count == 2)",
    logicReveal: "A prime number can only be divided by 1 and itself (2 unique divisors). To find all primes in a range, iterate through every number from start to end, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2, it is a Prime Number.",
    recipeReveal: "1. Get starting number and ending number.\n2. For each number in the range from start up to end:\n2.1. Start divisor count at 0 for the current number.\n2.2. Test every number from 1 up to the current number.\n2.3. If dividing leaves a remainder of 0, increase divisor count by 1.\n2.4. If divisor count is exactly 2, record / display the current number as prime.",
    ingredientsReveal: "Step 1: start and end for range limits.\nStep 2: Outer for loop with Start: start (num), Stop: end (num <= end), Step: +1.\nStep 2.1: var count = 0 inside the outer loop.\nStep 2.2: Inner for loop with Start: 1 (i), Stop: num (i <= num), Step: +1.\nStep 2.3: if (num % i == 0) { count++; }\nStep 2.4: if (count == 2) { print(num); }",
    sampleReveal: `var start = 10;
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
  "positive-negative": {
    id: "positive-negative",
    category: "fundamentals",
    programName: "Positive or Negative Number",
    description: `Write a program to check whether a given number is positive or negative.
Numbers greater than 0 are positive (n > 0).
Numbers less than 0 are negative (n < 0).
Zero (0) is neither positive nor negative.
Take an integer input n from the user and display whether it is Positive, Negative, or Zero.`,
    concept: "Comparison Operators & Multi-way Branching (> , < , ==)",
    logicReveal: "Numbers greater than 0 are Positive (e.g. 1, 2, 5). Numbers less than 0 are Negative (e.g. -1, -2, -5). Zero is neither positive nor negative. We test the number against 0 using comparison operators (> or <).",
    recipeReveal: '1. Step 1: Get input number n.\n2. Step 2: If n is greater than 0, display "Positive".\n3. Step 3: Else if n is less than 0, display "Negative".\n4. Step 4: Else, display "Zero".',
    ingredientsReveal: 'Variables: n for input number.\nOperators: > (greater than), < (less than), == (equality).\nConstructs: if - else if - else conditional structure.\nOutput: print("Positive"), print("Negative"), print("Zero").',
    sampleReveal: `var n = 5;
if (n > 0) {
  print("Positive");
} else if (n < 0) {
  print("Negative");
} else {
  print("Zero");
}`
  },
  "three-digit-number": {
    id: "three-digit-number",
    category: "fundamentals",
    programName: "Number is 3-Digit or Not",
    description: `Write a program to check whether a given integer is a 3-digit number or not.
A 3-digit number has exactly 3 digits and ranges from 100 to 999 inclusive (100 <= n <= 999).
Take an integer input n from the user and display whether it is a "3-digit number" or "Not a 3-digit number".`,
    concept: "Relational & Compound Logical Operators (n >= 100 && n <= 999)",
    logicReveal: "A 3-digit number has 3 digits and ranges from 100 up to 999 inclusive. We test if the number is greater than or equal to 100 AND less than or equal to 999 (100 <= n <= 999).",
    recipeReveal: '1. Step 1: Get input number n.\n2. Step 2: Check if n is greater than or equal to 100 and less than or equal to 999.\n3. Step 3: If true, display "3-digit number".\n4. Step 4: Else, display "Not a 3-digit number".',
    ingredientsReveal: 'Variables: n for input integer.\nOperators: >= (greater than or equal to), <= (less than or equal to), && (logical AND).\nConstructs: if - else conditional structure.\nOutput: print("3-digit number"), print("Not a 3-digit number").',
    sampleReveal: `var n = 456;
if (n >= 100 && n <= 999) {
  print("3-digit number");
} else {
  print("Not a 3-digit number");
}`
  },
  "voting-eligibility": {
    id: "voting-eligibility",
    category: "fundamentals",
    programName: "Eligible or Not Eligible to Vote",
    description: `Write a program to check whether a person is eligible to vote based on their age.
A person is eligible to vote if their age is 18 years or above (age >= 18). If their age is less than 18, they are not eligible.
Take an integer input 'age' from the user and display whether they are "Eligible" or "Not Eligible".`,
    concept: "Relational Operator & Branching (age >= 18)",
    logicReveal: "A person must be 18 years old or older to be eligible to vote. If someone is 18 or older, they are Eligible to Vote; otherwise (younger than 18), they are Not Eligible to Vote.",
    recipeReveal: "1. Step 1: Take the person's age.\n2. Step 2: Check whether age is 18 or older.\n3. Step 3: If yes, announce Eligible to vote.\n4. Step 4: Otherwise, announce Not Eligible.",
    ingredientsReveal: 'Variables: age for input age.\nOperators: >= (greater than or equal to).\nConstructs: if - else conditional structure (L.S: age, Operator: >=, R.S: 18).\nOutput: print("Eligible"), print("Not Eligible").',
    sampleReveal: `var age = 20;
if (age >= 18) {
  print("Eligible");
} else {
  print("Not Eligible");
}`
  },
  "pass-or-fail": {
    id: "pass-or-fail",
    category: "fundamentals",
    programName: "Pass or Fail Based on Mark",
    description: `Write a program to check whether a student passed or failed based on their mark.
A student passes if their mark is 35 or above (mark >= 35); otherwise they fail.
Take an integer input 'mark' from the user and display whether they passed or failed.`,
    concept: "Relational Operator & Branching (mark >= 35)",
    logicReveal: "Usually, a mark of 35 or above (mark >= 35) is considered Pass. Less than 35 is Fail.",
    recipeReveal: "1. Step 1: Get mark input.\n2. Step 2: If mark is greater than or equal to 35, display Pass, else display Fail.",
    ingredientsReveal: 'Input variable mark, and an if-else condition using comparison operator >=.\nL.S: mark, Operator: >=, R.S: 35.\nOutput: print("Pass"), print("Fail").',
    sampleReveal: `var mark = 45;
if (mark >= 35) {
  print("Pass");
} else {
  print("Fail");
}`
  },
  "greater-than-100": {
    id: "greater-than-100",
    category: "fundamentals",
    programName: "Number is Greater than 100 or Not",
    description: `Write a program to check whether a given number is greater than 100 or not.
A number is greater than 100 if num > 100; otherwise it is not greater than 100.
Take an integer input 'num' from the user and display whether it is greater than 100 or not.`,
    concept: "Relational Operator & Branching (num > 100)",
    logicReveal: "Take a number and compare it with 100 using the greater than operator (>). If number is greater than 100 it is Greater, otherwise Not Greater.",
    recipeReveal: "1. Step 1: Get number input.\n2. Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100.",
    ingredientsReveal: 'Input variable num, and an if-else condition using comparison operator >.\nL.S: num, Operator: >, R.S: 100.\nOutput: print("Greater than 100"), print("Not greater than 100").',
    sampleReveal: `var num = 120;
if (num > 100) {
  print("Greater than 100");
} else {
  print("Not greater than 100");
}`
  },
  "divisible-by-5": {
    id: "divisible-by-5",
    category: "fundamentals",
    programName: "Divisible by 5 or Not",
    description: `Write a program to check whether a given integer is divisible by 5 or not.
A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0).
Otherwise, if the remainder is not 0 (n % 5 != 0), it is not divisible by 5.
Take an integer input 'n' from the user and display whether it is "Divisible by 5" or "Not Divisible by 5".`,
    concept: "Conditional Statements & Modulo Operator (n % 5 == 0)",
    logicReveal: "Take an example: Number 25. 25 % 5 = 0 (leaves remainder 0), so it is Divisible by 5! For 23, 23 % 5 = 3 != 0, so it is Not Divisible by 5. Rule: If n % 5 == 0 display Divisible by 5, otherwise Not Divisible by 5.",
    recipeReveal: "1. Step 1: Get input number n (e.g. 25).\n2. Step 2: If number divided by 5 leaves remainder 0 (n % 5 == 0), display Divisible by 5, else display Not Divisible by 5.",
    ingredientsReveal: 'Input variable n, and an if-else condition using modulo operator % and equality operator ==.\nL.S: n % 5, Operator: ==, R.S: 0.\nOutput: print("Divisible by 5"), print("Not Divisible by 5").',
    sampleReveal: `var n = 25;
if (n % 5 == 0) {
  print("Divisible by 5");
} else {
  print("Not Divisible by 5");
}`
  }
};
const SEED_FIREBASE_HINTS = [
  // Prime Numbers in a Range - Logic
  {
    id: "hint_primerange_logic_01",
    programId: "prime-between-range",
    section: "logic",
    studentInput: "what should we do to find prime numbers in a range",
    normalizedInput: "what should we do to find prime numbers in a range",
    hint: "What does 'Prime numbers in a range' mean? For example, between 10 and 20, what are all the prime numbers, and how do we check each one?",
    hintLevel: 1,
    concept: "range understanding",
    source: "firebase",
    createdAt: Date.now() - 3e4
  },
  {
    id: "hint_primerange_logic_02",
    programId: "prime-between-range",
    section: "logic",
    studentInput: "I don't know / puriyala",
    normalizedInput: "dont know puriyala",
    hint: "A range gives a starting number and an ending number (e.g., 10 to 20). We must check every number in that range one by one. For each number, we count how many numbers divide it with remainder 0 (from 1 to that number). If the total count of divisors is exactly 2, it is a Prime Number!",
    hintLevel: 1,
    concept: "divisor count == 2 definition",
    source: "firebase",
    createdAt: Date.now() - 29e3
  },
  {
    id: "hint_primerange_logic_03",
    programId: "prime-between-range",
    section: "logic",
    studentInput: "why must the count of divisors be exactly 2",
    normalizedInput: "why must count of divisors be exactly 2",
    hint: "By definition, a prime number can only be divided by 1 and itself (2 unique divisors).\n\u2022 For 7: Divisors are 1 and 7 -> Total divisors = 2 (Prime!)\n\u2022 For 6: Divisors are 1, 2, 3, 6 -> Total divisors = 4 (Not Prime)\n\u2022 For 1: Divisor is only 1 -> Total divisors = 1 (Not Prime).",
    hintLevel: 2,
    concept: "mathematical justification",
    source: "firebase",
    createdAt: Date.now() - 28e3
  },
  {
    id: "hint_primerange_logic_04",
    programId: "prime-between-range",
    section: "logic",
    studentInput: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
    normalizedInput: "for each number in range count how many numbers from 1 to that number divide it with remainder 0 and if count is exactly 2 it is prime",
    hint: "Fantastic! That is the exact mathematical logic: Iterate through the range, count divisors from 1 to the current number, and if count is exactly 2, it is a Prime Number. Proceed to Recipe.",
    hintLevel: 3,
    concept: "success path",
    source: "firebase",
    createdAt: Date.now() - 27e3
  },
  // Prime Numbers in a Range - Recipe
  {
    id: "hint_primerange_recipe_01",
    programId: "prime-between-range",
    section: "recipe",
    studentInput: "what should i do here",
    normalizedInput: "what should i do here",
    hint: "Based on our divisor counting logic, write down the sequential steps one by one. Example: Step 1: Get the starting and ending numbers, Step 2: ...",
    hintLevel: 1,
    concept: "plain english recipe",
    source: "firebase",
    createdAt: Date.now() - 26e3
  },
  {
    id: "hint_primerange_recipe_02",
    programId: "prime-between-range",
    section: "recipe",
    studentInput: "step 1 : Get starting number and ending number",
    normalizedInput: "step 1 get starting number and ending number",
    hint: "Great! What is the next step to go through each number in this range from start to end?",
    hintLevel: 2,
    concept: "step 1 input range",
    source: "firebase",
    createdAt: Date.now() - 25e3
  },
  {
    id: "hint_primerange_recipe_03",
    programId: "prime-between-range",
    section: "recipe",
    studentInput: "step 2.4 : If divisor count is exactly 2, record / display the current number as prime",
    normalizedInput: "step 2 4 if divisor count is exactly 2 record display current number as prime",
    hint: "Kudos! You have written down a complete, crystal-clear step-by-step algorithm. Proceed to Ingredients.",
    hintLevel: 3,
    concept: "complete recipe",
    source: "firebase",
    createdAt: Date.now() - 24e3
  },
  // Prime Numbers in a Range - Ingredients
  {
    id: "hint_primerange_ingredients_01",
    programId: "prime-between-range",
    section: "ingredients",
    studentInput: "what do I do here",
    normalizedInput: "what do i do here",
    hint: "Identify the variables, nested loops, condition checks, and print statements needed. For Step 1, what variables store the range limits?",
    hintLevel: 1,
    concept: "ingredients identification",
    source: "firebase",
    createdAt: Date.now() - 23e3
  },
  {
    id: "hint_primerange_ingredients_02",
    programId: "prime-between-range",
    section: "ingredients",
    studentInput: "step 2.1 : count = 0 before the outer loop",
    normalizedInput: "step 2 1 count 0 before outer loop",
    hint: "Placement Bug! If count = 0 is outside the outer loop, the divisor count will keep accumulating for all numbers combined. Place var count = 0; INSIDE the outer loop!",
    hintLevel: 2,
    concept: "counter scope bug",
    source: "firebase",
    createdAt: Date.now() - 22e3
  },
  {
    id: "hint_primerange_ingredients_03",
    programId: "prime-between-range",
    section: "ingredients",
    studentInput: "step 2.4 : if (count == 2) { print(num); }",
    normalizedInput: "step 2 4 if count 2 print num",
    hint: "Awesome! All ingredients are systematically identified. Now let's proceed to Taste the Sample.",
    hintLevel: 3,
    concept: "all ingredients verified",
    source: "firebase",
    createdAt: Date.now() - 21e3
  },
  // Prime Numbers in a Range - Sample Code
  {
    id: "hint_primerange_sample_01",
    programId: "prime-between-range",
    section: "samplecode",
    studentInput: "Do I need to write the code here",
    normalizedInput: "do i need to write the code here",
    hint: "Yes! Draft an executable code prototype using nested loops, inner divisor counting, and checking count == 2.\nExample structure:\nvar start = 10, end = 20;\nfor (var num = start; num <= end; num++) { ... }",
    hintLevel: 1,
    concept: "sample code prototype",
    source: "firebase",
    createdAt: Date.now() - 2e4
  },
  {
    id: "hint_primerange_sample_02",
    programId: "prime-between-range",
    section: "samplecode",
    studentInput: "var start = 10;\nvar end = 20;\nfor (var num = start; num <= end; num++) {\n var count = 0;\n for (var i = 1; i <= num; i++) {\n if (num % i == 0) {\n count++;\n }\n }\n if (count == 2) {\n print(num);\n }\n}",
    normalizedInput: "var start 10 var end 20 for var num start num end num var count 0 for var i 1 i num i if num i 0 count if count 2 print num",
    hint: "You gotcha! You have written the complete, robust nested loop implementation using divisor count count == 2. It handles all range numbers, boundary conditions, and proper counter scoping. Let's code!",
    hintLevel: 3,
    concept: "complete prototype pass",
    source: "firebase",
    createdAt: Date.now() - 19e3
  },
  // Prime Number - Logic
  {
    id: "hint_prime_logic_01",
    programId: "prime-number",
    section: "logic",
    studentInput: "I don't understand prime number",
    normalizedInput: "dont understand prime number",
    hint: "Think about how many numbers divide the given number with remainder 0.",
    hintLevel: 1,
    concept: "divisibility",
    source: "firebase",
    createdAt: Date.now() - 1e5
  },
  {
    id: "hint_prime_logic_02",
    programId: "prime-number",
    section: "logic",
    studentInput: "How do I know if a number is prime?",
    normalizedInput: "how do i know if number is prime",
    hint: "A prime number is only divisible by 1 and itself. What condition must be met for a number to divide another evenly?",
    hintLevel: 2,
    concept: "factors",
    source: "firebase",
    createdAt: Date.now() - 9e4
  },
  // Prime Number - Recipe
  {
    id: "hint_prime_recipe_01",
    programId: "prime-number",
    section: "recipe",
    studentInput: "I know I need to check divisibility, but what should I do next?",
    normalizedInput: "know need check divisibility what should do next",
    hint: "Think about how you can repeatedly divide the input by a series of numbers. What range of numbers would you need to check?",
    hintLevel: 2,
    concept: "range iteration",
    source: "firebase",
    createdAt: Date.now() - 8e4
  },
  // Prime Number - Ingredients
  {
    id: "hint_prime_ingredients_01",
    programId: "prime-number",
    section: "ingredients",
    studentInput: "Why do I need count?",
    normalizedInput: "why do i need count",
    hint: "Think about what you need to know at the end. You need to know how many times the remainder becomes 0. Which variable could keep track of that number?",
    hintLevel: 2,
    concept: "accumulator variable",
    source: "firebase",
    createdAt: Date.now() - 7e4
  },
  {
    id: "hint_prime_ingredients_02",
    programId: "prime-number",
    section: "ingredients",
    studentInput: "Why do I need a loop?",
    normalizedInput: "why do i need a loop",
    hint: "To test if any number from 1 to n divides n, you must repeat the remainder check multiple times. Which programming construct repeats actions?",
    hintLevel: 2,
    concept: "loop construct",
    source: "firebase",
    createdAt: Date.now() - 65e3
  },
  // Prime Number - Taste the Sample
  {
    id: "hint_prime_sample_01",
    programId: "prime-number",
    section: "samplecode",
    studentInput: "My output is wrong for 6",
    normalizedInput: "my output is wrong for 6",
    hint: "Let us trace 6: divisors of 6 are 1, 2, 3, 6. The count of factors becomes 4, which is greater than 2. Check if your condition compares count == 2.",
    hintLevel: 3,
    concept: "tracing and debugging",
    source: "firebase",
    createdAt: Date.now() - 6e4
  },
  // Sum of Natural Numbers - Logic
  {
    id: "hint_sum_logic_01",
    programId: "sum-natural-numbers",
    section: "logic",
    studentInput: "How do I add natural numbers?",
    normalizedInput: "how do i add natural numbers",
    hint: "If n is 4, you want 1 + 2 + 3 + 4. Notice that each step adds the next integer to what you previously collected.",
    hintLevel: 1,
    concept: "accumulation",
    source: "firebase",
    createdAt: Date.now() - 5e4
  },
  // Sum of Natural Numbers - Recipe
  {
    id: "hint_sum_recipe_01",
    programId: "sum-natural-numbers",
    section: "recipe",
    studentInput: "How to write recipe for sum of n numbers?",
    normalizedInput: "how to write recipe for sum of n numbers",
    hint: "Write 5 plain English steps without programming words (avoid loop, while, counter i): 1. Get input number n. 2. Start total sum at 0 and current number at 1. 3. Add current number to total sum. 4. Move to next number and repeat until reaching n. 5. Display final total sum.",
    hintLevel: 1,
    concept: "5-step plain English algorithm",
    source: "firebase",
    createdAt: Date.now() - 45e3
  },
  {
    id: "hint_sum_recipe_02",
    programId: "sum-natural-numbers",
    section: "recipe",
    studentInput: "Can I use loop or variable in recipe?",
    normalizedInput: "can i use loop or variable in recipe",
    hint: 'No programming keywords in Recipe! Avoid words like loop, while, for, and counter i. Use everyday words like "repeat until reaching n" and "starting number 1".',
    hintLevel: 2,
    concept: "anti-code recipe guidelines",
    source: "firebase",
    createdAt: Date.now() - 44e3
  },
  // Sum of Natural Numbers - Ingredients
  {
    id: "hint_sum_ingredients_01",
    programId: "sum-natural-numbers",
    section: "ingredients",
    studentInput: "What variables do I need for sum of n numbers?",
    normalizedInput: "what variables do i need for sum of n numbers",
    hint: "You need a container for the user input n, a running total starting at 0, and a counter to step from 1 up to n.",
    hintLevel: 2,
    concept: "variable identification",
    source: "firebase",
    createdAt: Date.now() - 4e4
  }
];
export {
  SEED_FIREBASE_HINTS,
  SEED_PROBLEMS
};
