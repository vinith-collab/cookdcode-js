import { CTCStage } from '../types.js';
import { SEED_FIREBASE_HINTS } from '../data/seedData.js';
import { validateOddEvenClassification } from './oddEvenValidator.js';
import { detectProblemType } from './problemTypes.js';
import { checkSumArithmetic, validateSumOfNLogic, validateSumOfNRecipe, validateSumOfNIngredients } from './sumOfNValidator.js';
import { validateFactorialLogic, validateFactorialRecipe, validateFactorialIngredients } from './factorialValidator.js';
import { validateDivisorLogic, validateDivisorRecipe, validateDivisorIngredients, validateDivisorSampleCode } from './divisorValidator.js';
import { validateMultiplicationLogic, validateMultiplicationRecipe, validateMultiplicationIngredients, validateMultiplicationSampleCode } from './multiplicationTableValidator.js';
import { validatePrimeLogic, validatePrimeRecipe, validatePrimeIngredients, validatePrimeSampleCode } from './primeNumberValidator.js';
import { validateNextPrimeLogic, validateNextPrimeRecipe, validateNextPrimeIngredients, validateNextPrimeSampleCode } from './nextPrimeValidator.js';
import { validatePrimeRangeLogic, validatePrimeRangeRecipe, validatePrimeRangeIngredients, validatePrimeRangeSampleCode } from './primeRangeValidator.js';
import { validateSexyPrimeLogic, validateSexyPrimeRecipe, validateSexyPrimeIngredients, validateSexyPrimeSampleCode } from './sexyPrimeValidator.js';
import { validatePositiveNegativeLogic, validatePositiveNegativeRecipe, validatePositiveNegativeIngredients, validatePositiveNegativeSampleCode } from './positiveNegativeValidator.js';
import { validateVotingEligibilityLogic, validateVotingEligibilityRecipe, validateVotingEligibilityIngredients, validateVotingEligibilitySampleCode } from './votingEligibilityValidator.js';
import { validateAdultMinorLogic, validateAdultMinorRecipe, validateAdultMinorIngredients, validateAdultMinorSampleCode } from './adultMinorValidator.js';
import { validateDivisibleBy5Logic, validateDivisibleBy5Recipe, validateDivisibleBy5Ingredients, validateDivisibleBy5SampleCode } from './divisibleBy5Validator.js';
import { validateMaximumOfTwoLogic, validateMaximumOfTwoRecipe, validateMaximumOfTwoIngredients, validateMaximumOfTwoSampleCode } from './maximumOfTwoValidator.js';
import { validateSeniorCitizenLogic, validateSeniorCitizenRecipe, validateSeniorCitizenIngredients, validateSeniorCitizenSampleCode } from './seniorCitizenValidator.js';

export interface FirebaseHintPair {
  input: string;
  hint: string;
}

export interface FirebaseSectionData {
  title?: string;
  description?: string;
  pairs?: FirebaseHintPair[];
  keywords?: Record<string, string>;
  successFeedback?: string;
}

export interface FirebaseProblemData {
  title: string;
  description: string;
  phase?: string;
  problemBadge?: string;
  sections?: {
    logic?: FirebaseSectionData;
    recipe?: FirebaseSectionData;
    ingredients?: FirebaseSectionData;
    samplecode?: FirebaseSectionData;
  };
}

export interface MatchedPairResult {
  matched: boolean;
  bestPair?: FirebaseHintPair;
  allPairs: FirebaseHintPair[];
  sectionDescription?: string;
  sectionTitle?: string;
  score: number;
}

// Complete fallback seed data for problem01 (Odd or Even) matching Firebase RTDB
const SEED_PROBLEM01: FirebaseProblemData = {
  title: "Challenge: Odd or Even",
  description: "Write a program to find if a number is odd or even",
  phase: "Phase 1",
  problemBadge: "Problem 1",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to find if a number is odd or even",
      pairs: [
        {
          input: "what should we do to find out whether the number is odd or even",
          hint: "What should we do to find out whether the number is odd or even?"
        },
        {
          input: "I don't know",
          hint: "Do you know what odd and even numbers are? If yes, list them out."
        },
        {
          input: "what is odd and even",
          hint: "Odd numbers are those that cannot be divided into two equal parts (e.g. 1, 3, 5). Even numbers can be divided into two equal parts (e.g. 2, 4, 6)."
        },
        {
          input: "odd numbers are 1, 3, 5, 7, 9 even numbers are 2, 4, 6, 8, 10",
          hint: "Look at the even numbers (2, 4, 6...). Which multiplication table do they belong to? What arithmetic operation (+,-,*,/) could test if a number fits into that pattern?"
        },
        {
          input: "even numbers belong to 2 table",
          hint: "Yes you are right! Even numbers belong to the 2 table. But how will a computer check if a number comes in the 2 table? What basic arithmetic operation (+,-,*,/) tests if a number fits into the 2 table?"
        },
        {
          input: "we can multiply by 2",
          hint: "Multiplication makes numbers larger (e.g. 8 * 2 = 16 doesn't test 8). Which arithmetic operation (+,-,*,/) splits a number down to test if it fits into equal groups of 2?"
        },
        {
          input: "we can divide by 2",
          hint: "When you divide a number by 2 you will only get quotient. Which operator should we use to get the remainder instead?"
        },
        {
          input: "what is divisible",
          hint: "Divisible means when a number is divided, it splits cleanly with no remainder (remainder is 0)."
        },
        {
          input: "what is remainder",
          hint: "Remainder is the leftover amount after dividing into equal groups. For example, 7 divided by 2 gives quotient 3 with remainder 1."
        },
        {
          input: "what is modulo operator",
          hint: "The modulo operator (%) calculates the remainder of division. For example, 10 % 2 = 0 and 7 % 2 = 1."
        },
        {
          input: "how to use % and 2 table / how to use modulo",
          hint: "To test any number: divide it by 2 using the modulo operator (%). If the remainder is 0, it fits into the 2 table and is Even. If the remainder is 1, it has 1 leftover and is Odd."
        },
        {
          input: "when divided by 2 remainder 0 is even and remainder 1 is odd",
          hint: "Fantastic, that's right! When divided by 2, remainder 0 is even and remainder 1 is odd. The modulo operator (%) gives the remainder. You've completed the mathematical logic—proceed to the Recipe stage!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step by step process to find if a number is odd or even",
      pairs: [
        {
          input: "what should i do here",
          hint: "whatever you find on logic, write it here step by step. Ex: step 1 : Get the input, step 2 : Do the process etc.."
        },
        {
          input: "step 1: Get the input",
          hint: "great. You have to modulo divide to get remainder."
        },
        {
          input: "step 2: divide by 2",
          hint: "Normal division only gives the quotient. To check for odd/even we need remainder. Modulo divide by 2 instead."
        },
        {
          input: "step 2: modulo divide the input by 2",
          hint: "& check what remainder you are getting. Make that as a sentence."
        },
        {
          input: "step 3: check the remainder",
          hint: "when you get remainder as 0 then it is even. Complete the sentence. Tip: You got either or chances for getting 0 and 1."
        },
        {
          input: "step 4: if remainder is 0 it is even or else it is odd",
          hint: "Kudos. proceed to ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Decide the components you will need to execute the recipe",
      pairs: [
        {
          input: "what should I do here?",
          hint: "Find out what are the programming components you need to use. Ex: when you want to get a value in programming you need to use a variable. Likewise decide what to use for every step."
        },
        {
          input: "step 1 : Get the input",
          hint: "Variable"
        },
        {
          input: "step 2 : Modulo divide the input by 2",
          hint: "when modulo divided we may have two chances. Either we get 0 or 1. whenever you are in this situation use a conditional operator.\nEx : If , Switch"
        },
        {
          input: "step 3 : Use if condition",
          hint: "in If condition we have two sides Left side & Right side of the operator.\nEx: Check whether a is greater than 10\nL.S : a\nR.S : 10\nOperator : > so\n'if' look like this if (a > 10)"
        },
        {
          input: "Help you ingredient in the same\nstep 4: way.\nL.S , R.S & Operator .",
          hint: "Hurray you got it. Use printing statements to print odd (or) even."
        },
        {
          input: "step 5: If remainder is 0 print even or print odd.",
          hint: "Good work. Now let's proceed to taste the sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here .",
          hint: "No, I will guide you.Let's take an addition program. We are going to write the prototype here.\na = 10\nb = 10\nc = a + b\nprint c\nThis prototype doesn't reflect any programming language. You can also draft one based on the ingredients you decided."
        },
        {
          input: "step 1: a = 10",
          hint: "Great! Now check whether this test number is divisible by 2 using the modulo operator % in an if condition."
        },
        {
          input: "step 2: if (a % 2 == 0)",
          hint: "Now what should be printed if that condition evaluates to true? Add the print statement for even numbers."
        },
        {
          input: "step 3: print even and else print odd",
          hint: "Excellent! Combine them together into your complete prototype so you can taste test both branches."
        },
        {
          input: "a = 10\nif (a % 2 == 0)\nprint even\nelse\nprint odd",
          hint: "You gotcha. Let's code"
        },
        {
          input: "how to trace sample test case with 10",
          hint: "For input 10: 10 % 2 equals 0. 0 == 0 evaluates to True, so it executes the if block and displays 'Even'. For input 7: 7 % 2 equals 1, which goes to else and displays 'Odd'."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem02 (Sum of N Natural Numbers)
const SEED_PROBLEM02: FirebaseProblemData = {
  title: "Challenge: Sum of N Numbers",
  description: "Write a program to calculate the sum of the first n natural numbers",
  phase: "Phase 1",
  problemBadge: "Problem 2",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to find the sum of N numbers",
      pairs: [
        {
          input: "what should we do to find the sum of n numbers",
          hint: "What should we do to find the sum of the first N natural numbers?"
        },
        {
          input: "I don't know",
          hint: "Do you know what natural numbers are? If yes, list them out."
        },
        {
          input: "what are natural numbers",
          hint: "Natural numbers are the positive counting numbers starting from 1 (e.g. 1, 2, 3, 4, 5...). Write a list of the first 5 natural numbers in the box!"
        },
        {
          input: "puriyala sum of n",
          hint: "Example: If n = 5, the first 5 natural numbers are 1, 2, 3, 4, and 5. Finding their sum means combining them into a total: 1 + 2 + 3 + 4 + 5. Try writing out this list!"
        },
        {
          input: "1, 2, 3, 4, 5",
          hint: "Great! Now, how will we find their total sum? What value should we start with before adding any numbers?"
        },
        {
          input: "natural numbers are 1, 2, 3, 4, 5",
          hint: "Great! Now, how will we find their total sum? What value should we start with before adding any numbers?"
        },
        {
          input: "we start with 0",
          hint: "Yes you are right! We start with a total sum of 0. Now how do we add each number from 1 to 5 to this sum one by one?"
        },
        {
          input: "we can use formula n * (n + 1) / 2",
          hint: "While n * (n + 1) / 2 is a great mathematical formula, in programming we build algorithmic thinking by accumulating numbers one by one using a running total. How does the total grow step by step starting from 0?"
        },
        {
          input: "we add 1 to 5 one by one",
          hint: "When you add numbers one by one, trace it step by step starting from 0 (e.g. 0 + 1 = 1, 1 + 2 = 3...). Can you trace all the steps up to 5 in your worksheet?"
        },
        {
          input: "what is accumulation",
          hint: "Accumulation means keeping a running total basket: starting at 0, you add in the first number (1), then add the next (2), and keep growing the total until you reach n."
        },
        {
          input: "0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15",
          hint: "Exactly! We start with total 0: step 1: 0 + 1 = 1; step 2: 1 + 2 = 3; step 3: 3 + 3 = 6; step 4: 6 + 4 = 10; step 5: 10 + 5 = 15. How would you summarize this logic in words?"
        },
        {
          input: "calculation error in addition",
          hint: "Check your calculation closely in your worksheet: make sure each addition correctly adds the next number to the previous running total!"
        },
        {
          input: "start sum with 0 and for every number from 1 to n add that number to sum",
          hint: "Fantastic, that's right! Start with a total sum of 0, and sequentially add each number from 1 up to n to the growing total. You've completed the mathematical logic—proceed to the Recipe stage!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm to calculate sum of N numbers",
      pairs: [
        {
          input: "what should i do here",
          hint: "whatever you found in logic, write it here step by step.\nEx: Step 1: Get the input\nStep 2: Do the process etc.."
        },
        {
          input: "step 1: get the input number n",
          hint: "great. Now before starting the addition, what initial values must the total sum and the starting number have? Write Step 2."
        },
        {
          input: "step 2: start with total sum as 0 and current number as 1",
          hint: "spot on! Now write Step 3: how do you move to the next number and repeat until reaching n? (Use plain everyday words like 'repeat', avoid 'loop')."
        },
        {
          input: "step 3: move to the next number and repeat until reaching n",
          hint: "nice! Now write Step 4 as an atomic action: inside this repetition, what do you do with the current number and the total sum?"
        },
        {
          input: "step 4: add the current number to the total sum",
          hint: "superb! Finally, write Step 5: once all numbers up to n are added, what should the computer do with the final total sum?"
        },
        {
          input: "step 5: display the final total sum",
          hint: "Kudos. You've sequenced all 5 steps of the algorithm in plain English. Proceed to ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Decide the components you will need to execute the recipe",
      pairs: [
        {
          input: "what do I do here",
          hint: "Find out what programming components you need to use for each step of your recipe.\nEx: when you want to store a value, use a variable. When you want to repeat steps, use a loop construct. Likewise decide what to use for every step."
        },
        {
          input: "step 1: variable for input n",
          hint: "great! What accumulator variable and starting value do we need to store the running total sum?"
        },
        {
          input: "step 2: sum = 0",
          hint: "spot on! In step 2, sum = 0 prepares our accumulator. Now for repeating actions from 1 up to n, which programming construct should we use? Ex: while loop or for loop."
        },
        {
          input: "step 2: variable sum = 0 and current number = 1",
          hint: "spot on! Now for repeating actions from 1 up to n, which programming construct should we use? Ex: while loop or for loop."
        },
        {
          input: "step 3: for loop",
          hint: "Awesome choice! When using a for loop, specify what are the values for start (starts at 1), end (up to n, or n + 1 in Python range), and next step (increment by 1). Also, what is the main step to add each number into the total sum?"
        },
        {
          input: "for loop",
          hint: "Awesome choice! When using a for loop, specify what are the values for start (starts at 1), end (up to n, or n + 1 in Python range), and next step (increment by 1). Also, what is the main step to add each number into the total sum?"
        },
        {
          input: "step 3: while loop or for loop from 1 to n",
          hint: "great! In your for loop, make sure to specify what are the values for start (starts at 1), end (up to n, or n + 1 in range), and next step (increment by 1). Inside the loop, what is the main step to add each number into the total sum (e.g. sum = sum + i)?"
        },
        {
          input: "step 4: start=1, end=n, next step=+1",
          hint: "Awesome! You defined the start, end, and next increment steps for your for loop. Now, the main step is missing: inside the loop, we need to accumulate each number into our total sum using `sum = sum + i` (or `sum += i`).\n\nWhy do we write `sum = sum + i`? Because `sum` holds our running total so far, we add the loop counter `i` with `+`, and save the updated total back into `sum` with `=`. If we only wrote `sum = i`, previous numbers would get overwritten!"
        },
        {
          input: "start=1,end=n,next step=+1",
          hint: "Awesome! You defined the start, end, and next increment steps for your for loop. Now, the main step is missing: inside the loop, we need to accumulate each number into our total sum using `sum = sum + i` (or `sum += i`).\n\nWhy do we write `sum = sum + i`? Because `sum` holds our running total so far, we add the loop counter `i` with `+`, and save the updated total back into `sum` with `=`. If we only wrote `sum = i`, previous numbers would get overwritten!"
        },
        {
          input: "step 4: addition operator (+) and assignment (=) like sum = sum + i",
          hint: "Hurray you got it! And what statement do we use to display the final total sum to the user?"
        },
        {
          input: "step 5: sum = sum + startnum",
          hint: "⚠️ In Step 5, you wrote `sum = sum + startnum`. Notice that in your loop (`for loop(i)`), the loop variable that changes on each iteration is `i`! `startnum` is only the initial starting value (1) and does not increase inside the loop. If you write `sum = sum + startnum`, the loop will just add 1 every single time instead of adding each number (1, 2, 3... up to n)! To correctly accumulate each number from the loop into the total sum, use the loop variable `i`: `sum = sum + i` (or `sum += i`)."
        },
        {
          input: "step 5: sum = sum + i",
          hint: "Hurray you got it! You've defined the main step to add each number to the total sum: sum = sum + i. All 5 ingredients are verified! Now let's proceed to Taste the sample stage to assemble your code."
        },
        {
          input: "step 5: print statement to display sum",
          hint: "Good work. You have all the ingredients ready. Now let's proceed to taste the sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code prototype for sum of N numbers",
      pairs: [
        {
          input: "Do I need to write the code here / where to start / how to write prototype",
          hint: "No, I will guide you step by step! Let's draft the prototype line by line. First, start with Step 1 & 2: declare your input variable `n` and initialize your accumulator `sum = 0`."
        },
        {
          input: "syntax theriyala / what is for loop syntax / syntax help / how to write for loop",
          hint: "Here is the general **for loop syntax** template:\n\n🐍 **Python:**\n```python\nfor i in range(start, end + 1):\n    # code inside loop\n```\n\n💻 **JavaScript:**\n```javascript\nfor (let i = start; i <= end; i++) {\n  // code inside loop\n}\n```\n\n☕ **Java / C:**\n```java\nfor (int i = start; i <= end; i++) {\n  // code inside loop\n}\n```\n\n💡 In our Sum of N problem: `start` is 1 and `end` is `n`.\nNow try writing your prototype step by step: start with declaring `n` and `sum = 0`!"
        },
        {
          input: "n = int(input())\nsum_val = 0\nfor i in range(1, n + 1):\n    sum_val += i\nprint(sum_val)",
          hint: "🎉 Taste the Sample Verified! Fantastic work! Your prototype correctly implements the full algorithm across all steps:\n• Input variable n\n• Initial accumulator sum = 0\n• Loop iterating from 1 to n\n• Accumulator update (sum += i)\n• Output printing the final total\n\nYou're fully ready to code and run tests!"
        },
        {
          input: "how to trace for n = 5",
          hint: "Let's trace step by step for n = 5:\nStart: sum = 0\ni = 1 -> sum = 0 + 1 = 1\ni = 2 -> sum = 1 + 2 = 3\ni = 3 -> sum = 3 + 3 = 6\ni = 4 -> sum = 6 + 4 = 10\ni = 5 -> sum = 10 + 5 = 15\nLoop ends. Output is 15!"
        }
      ]
    }
  }
};

// Complete fallback seed data for problem03 (Factorial of a Number) matching Firebase RTDB hints/problem03
const SEED_PROBLEM03: FirebaseProblemData = {
  title: "Challenge: Factorial of a Number",
  description: "Write a program to find the factorial of a number",
  phase: "Phase 1",
  problemBadge: "Problem 3",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to find the factorial of a number",
      pairs: [
        {
          input: "what should we do to find the factorial of a number",
          hint: "What does \"Factorial of a number\" mean? For example, if N = 5 (written as 5!), what numbers do we need to multiply?"
        },
        {
          input: "I don't know",
          hint: "Factorial of N means multiplying all whole numbers starting from 1 up to N.\nFor example, if N = 5:\n1 × 2 × 3 × 4 × 5 = 120.\nCan you explain how the multiplication accumulates step by step?"
        },
        {
          input: "we multiply 1 to 5 one by one",
          hint: "Exactly! We start with total product = 1 (Why not 0? Because multiplying by 0 gives 0!).\nStep 1: fact = 1 × 1 = 1\nStep 2: fact = 1 × 2 = 2\nStep 3: fact = 2 × 3 = 6\nStep 4: fact = 6 × 4 = 24\nStep 5: fact = 24 × 5 = 120.\nHow would you summarize this logic?"
        },
        {
          input: "start fact with 1 and for every number from 1 to N multiply that number to fact",
          hint: "Fantastic! That's the exact logic: Start fact at 1, generate numbers from 1 to N, and multiply each number to fact. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on the logic, write down the steps one by one.\nExample:\nStep 1: Get input\nStep 2: ..."
        },
        {
          input: "step 1 : Accept a number as input",
          hint: "Great! What is the next step to go through each number from 1 up to the given number?"
        },
        {
          input: "step 2 : Generate all numbers from 1 up to the input number",
          hint: "Nice! While generating each number, what action must be performed inside this repetitive process?"
        },
        {
          input: "step 2.1 : Multiply each generated number with the factorial variable",
          hint: "Superb! (Hint: Inside the loop). What should you do after all numbers up to N are multiplied?"
        },
        {
          input: "step 3 : Print the final factorial value",
          hint: "Kudos! After the loop finishes, print the final factorial value. (Hint: Outside the loop). Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables and programming constructs for each step.\nFor Step 1, what variables do we need to store the input number and the factorial product (remember its initial value)?"
        },
        {
          input: "step 1 : n for input number, fact initialized to 1",
          hint: "Spot on! (Initializing fact to 1 is key). Now, what programming structure do we use to generate numbers from 1 to N repeatedly? Define its Start, Stop, and Step."
        },
        {
          input: "step 2 : For loop with Start: 1 (i), Stop: n, Next step: +1",
          hint: "Great! Inside the loop body (Step 2.1), what arithmetic operation updates the factorial product?"
        },
        {
          input: "step 2.1 : fact = fact * i",
          hint: "Hurray, that's right! Finally, for Step 3, what statement is needed outside the loop?"
        },
        {
          input: "step 3 : Print the final value of fact",
          hint: "Awesome! You have all the ingredients ready. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here",
          hint: "Yes, write a simple prototype using the variables and loop you defined in Ingredients.\nExample format:\nvar n = 5;\nvar fact = 1;\n..."
        },
        {
          input: "var n = 5;\nvar fact = 1;\nfor (var i = 1; i <= n; i++) {\n  fact = fact * i;\n}\nprint(fact);",
          hint: "You gotcha! That completes the Factorial of a Number Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

// Complete fallback seed data for problem04 (Divisors of a Number) matching Firebase RTDB hints/problem04
const SEED_PROBLEM04: FirebaseProblemData = {
  title: "Challenge: Divisors of a Number",
  description: "Write a program to find all divisors of a number",
  phase: "Phase 1",
  problemBadge: "Problem 4",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to find all divisors of a number",
      pairs: [
        {
          input: "what should we do to find the divisors of a number",
          hint: "What does 'Divisors of a number' mean? For example, if the number is 6, what are all the numbers that can divide 6 completely without leaving any remainder?"
        },
        {
          input: "I don't know",
          hint: "A divisor is a number that divides a given number completely, leaving a remainder of 0.\nFor example, for number 6, let's test numbers from 1 to 6:\n• 6 divided by 1 leaves remainder 0 (Divisor)\n• 6 divided by 2 leaves remainder 0 (Divisor)\n• 6 divided by 3 leaves remainder 0 (Divisor)\n• 6 divided by 4 leaves remainder 2 (Not a divisor)\n• 6 divided by 5 leaves remainder 1 (Not a divisor)\n• 6 divided by 6 leaves remainder 0 (Divisor)\nSo the divisors of 6 are: 1, 2, 3, and 6."
        },
        {
          input: "divisors of 6 are 12, 18, 24",
          hint: "Those are Multiples! Divisors can never be larger than the number itself. They always lie between 1 and the given number."
        },
        {
          input: "6 divided by 2 is 3 so only 3 is the divisor",
          hint: "3 is the quotient, but both 2 (the dividing number) and 3 are divisors because both divide 6 with remainder 0."
        },
        {
          input: "we should multiply or add numbers",
          hint: "Multiplication makes numbers larger. To find what divides a number, we must test using division and check the remainder, not multiplication or addition."
        },
        {
          input: "divide and check answer",
          hint: "Normal division only gives the quotient. To verify if a number divides completely, we must look at the remainder. What must the remainder be?"
        },
        {
          input: "start checking from 0",
          hint: "In mathematics, dividing any number by 0 is undefined and impossible. Always start testing from 1."
        },
        {
          input: "we can test numbers greater than the given number",
          hint: "A number larger than the given number cannot divide it completely (e.g., 7 cannot divide 6). Only test numbers from 1 up to that number."
        },
        {
          input: "divide the testing number by the given number",
          hint: "Order matters! You must divide the main given number by each testing number, not the other way around."
        },
        {
          input: "when remainder is 1 or more it is a divisor",
          hint: "If the remainder is 1 or more, it means the number was not divisible completely. A divisor must leave a remainder of exactly 0."
        },
        {
          input: "just divide the number by 2",
          hint: "Dividing by 2 only tells us if 2 is a divisor. We need to test all numbers from 1 up to the given number."
        },
        {
          input: "test each number from 1 up to that number and if remainder is 0 it is a divisor",
          hint: "Fantastic! That is the exact mathematical logic: Test every number from 1 up to the given number. If dividing leaves a remainder of 0, that number is a divisor. For example, for input n = 4, the numbers that divide 4 completely are 1, 2, and 4, so the divisors of 4 are: 1, 2, and 4! Proceed to Recipe."
        },
        {
          input: "n=4 4%1=0 4%2=0 4%3=1 4%4=0",
          hint: "Fantastic work testing n = 4! The numbers that divide 4 completely (with remainder 0) are 1, 2, and 4. So the divisors of 4 are: 1, 2, and 4 (3 is not a divisor because 4 % 3 = 1). Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our mathematical logic, write down the steps one by one.\nExample:\nStep 1: Get the input number\nStep 2: ..."
        },
        {
          input: "step 1 : Get the input number",
          hint: "Great! What is the next step to go through each number starting from 1 up to that given number?"
        },
        {
          input: "step 2 : Take numbers starting from 0 up to the given number",
          hint: "Careful! In mathematics, dividing by 0 is impossible. Change your starting number from 0 to 1."
        },
        {
          input: "step 2 : Take numbers from 1 up to before the given number",
          hint: "Remember: Every number is divisible by itself (e.g., 6 divided by 6 leaves remainder 0). So make sure to include the number itself (from 1 up to the given number)."
        },
        {
          input: "step 2 : For every number from 1 up to the given number",
          hint: "Nice! In this repeating process, what condition must we check for each number?"
        },
        {
          input: "step 2.1 : write down all numbers",
          hint: "If you write down all numbers, you will list every number from 1 to N. You must first check if dividing leaves a remainder of 0!"
        },
        {
          input: "step 2.1 : Check if dividing the given number by the current number leaves a remainder of 0",
          hint: "Superb! If the remainder is 0, what action should you take with that number?"
        },
        {
          input: "step 2.2 : note down the number and stop the process",
          hint: "Do not stop! A number can have multiple divisors. Continue testing the remaining numbers until you reach the given number."
        },
        {
          input: "step 2.2 : If the remainder is 0, record / display the current number as a divisor",
          hint: "Kudos! You have written down a clear, step-by-step algorithm without any code jargon. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, loops, conditions, and operators needed for each step.\nFor Step 1, what variable is needed to store the input number?"
        },
        {
          input: "step 1 : n for input number",
          hint: "Spot on! Now, what programming structure do we use to generate numbers from 1 to N repeatedly? Define its Start, Stop, and Step."
        },
        {
          input: "step 2 : For loop with Start: 1, Stop: i < n, Step: +1",
          hint: "If you write i < n, the loop stops before N, missing N itself as a divisor! Use i <= n (or Stop at n inclusive)."
        },
        {
          input: "step 2 : For loop from i = 0",
          hint: "Remember: i starts from 1 because n % 0 will cause a division by zero error. Start from i = 1."
        },
        {
          input: "step 2 : For loop with Start: 1 (i), Stop: n (i <= n), Step: +1",
          hint: "Great! Inside the loop (Step 2.1), we need an If condition. In an If condition we have two sides: Left side & Right side of the operator.\n• Left Side (L.S) : n % i (calculates remainder when n is divided by i)\n• Operator : == (equality comparison)\n• Right Side (R.S) : 0 (checks if remainder is 0)\nSo your 'if condition' looks like: if (n % i == 0)."
        },
        {
          input: "now how to write if condition",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\n• Left Side (L.S) : n % i (calculates remainder when n is divided by i)\n• Operator : == (equality comparison)\n• Right Side (R.S) : 0 (checks if remainder is 0)\nSo 'if condition' looks like: if (n % i == 0)"
        },
        {
          input: "step 3 : now how to write if condition",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\n• Left Side (L.S) : n % i (calculates remainder when n is divided by i)\n• Operator : == (equality comparison)\n• Right Side (R.S) : 0 (checks if remainder is 0)\nSo 'if condition' looks like: if (n % i == 0)"
        },
        {
          input: "step 3 : use if condition",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\n• Left Side (L.S) : n % i (calculates remainder when n is divided by i)\n• Operator : == (equality comparison)\n• Right Side (R.S) : 0 (checks if remainder is 0)\nSo 'if condition' looks like: if (n % i == 0)"
        },
        {
          input: "step 3 : use if condition left side : n % i right side : 0",
          hint: "You correctly identified the Left Side (n % i) and Right Side (0)! You only missed the comparison operator (==). In programming, use double equals (operator : ==) to compare them."
        },
        {
          input: "step 2.1 : if (n % i = 0)",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\nSyntax check: In conditions, a single = assigns a value. Use == (double equal) for comparison!\n• Left Side (L.S) : n % i\n• Operator : ==\n• Right Side (R.S) : 0\nSo use if (n % i == 0)."
        },
        {
          input: "step 2.1 : if (i % n == 0)",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\nVariable order check: You want to divide given number n by testing divisor i.\n• Left Side (L.S) : n % i\n• Operator : ==\n• Right Side (R.S) : 0\nSo use if (n % i == 0)."
        },
        {
          input: "step 2.1 : if (n / i == 0)",
          hint: "In an If condition we have two sides: Left side & Right side of the operator.\nn / i gives quotient. Modulo % gives remainder:\n• Left Side (L.S) : n % i\n• Operator : ==\n• Right Side (R.S) : 0\nSo use if (n % i == 0)."
        },
        {
          input: "step 2.1 : If condition with modulo operator: if (n % i == 0)",
          hint: "Hurray, that's right! Finally, for Step 2.2, what statement is needed inside the if condition to display the divisor?"
        },
        {
          input: "step 2.2 : print(n)",
          hint: "If you print n, it will print the input number repeatedly! You need to print the current divisor i."
        },
        {
          input: "step 2.2 : Print statement to display the divisor i",
          hint: "Awesome! You have all the ingredients ready. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here",
          hint: "Yes, write a simple prototype using the variables, loop, if condition, and print statement you defined in Ingredients.\n• Step 1: Declare input variable (var a = 4;)\n• Step 2: For loop from 1 to a (i <= a)\n• Step 2.1: If condition (a % i == 0)\n• Step 2.2: Print divisor (print(i))\n\nStart with Step 1: declare your input variable!"
        },
        {
          input: "how to start",
          hint: "To assemble our sample prototype, follow the ingredients we planned in Stage 3 step-by-step:\n• Step 1: Declare your input variable (var a = 4;)\n• Step 2: For loop with Start: 1 (i), Stop: a (i <= a), Step: +1\n• Step 2.1: If condition with modulo (a % i == 0)\n• Step 2.2: Print statement to display divisor (print(i))\n\nLet's start with Step 1: declare your input variable!"
        },
        {
          input: "var a = 4",
          hint: "Superb start! You declared your input variable a = 4 (matching Ingredient Step 1).\n\nNow, bring in Ingredient Step 2: write the For loop with Start: 1 (i), Stop: a (i <= a), and Step: +1 to test each number from 1 to a:\nfor (var i = 1; i <= a; i++) {\n\n}"
        },
        {
          input: "var a=4",
          hint: "Superb start! You declared your input variable a = 4 (matching Ingredient Step 1).\n\nNow, bring in Ingredient Step 2: write the For loop with Start: 1 (i), Stop: a (i <= a), and Step: +1 to test each number from 1 to a:\nfor (var i = 1; i <= a; i++) {\n\n}"
        },
        {
          input: "how to start\nvar a=4",
          hint: "Superb start! You declared your input variable a = 4 (matching Ingredient Step 1).\n\nNow, bring in Ingredient Step 2: write the For loop with Start: 1 (i), Stop: a (i <= a), and Step: +1 to test each number from 1 to a:\nfor (var i = 1; i <= a; i++) {\n\n}"
        },
        {
          input: "var a = 4;\nfor (var i = 1; i <= a; i++)",
          hint: "Great loop! You have your input variable a (Ingredient Step 1) and your For loop from 1 to a (Ingredient Step 2).\n\nNow, bring in Ingredient Step 2.1: inside the loop body, add the If condition with modulo operator: if (a % i == 0) (Left Side: a % i, Operator: ==, Right Side: 0) to check if the number divides evenly."
        },
        {
          input: "var n = 6;\nfor (var i = 0; i <= n; i++) {\n  if (n % i == 0) print(i);\n}",
          hint: "Bug alert: i starts at 0, leading to 6 % 0 (Division by zero). Change loop initialization to var i = 1."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i < n; i++) {\n  if (n % i == 0) print(i);\n}",
          hint: "Boundary bug: i < n misses 6 as a divisor of 6! Change condition to i <= n."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i = 0) print(i);\n}",
          hint: "Syntax error: n % i = 0 is an assignment. Use equality operator == inside if (...)."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) { print(n); }\n}",
          hint: "Output bug: You are printing n (which is 6). You should print the divisor i."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) { print(i); break; }\n}",
          hint: "Logic bug: break terminates the loop after finding only the first divisor (1). Remove break to print all divisors."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {}\n  print(i);\n}",
          hint: "Indentation bug: print(i) must be placed INSIDE the { ... } of the if statement so only divisors get printed."
        },
        {
          input: "var n = 6;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    print(i);\n  }\n}",
          hint: "You gotcha! That completes the Divisors of a Number Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

// Complete fallback seed data for problem05 (Multiplication Table of a Number) matching Firebase RTDB hints/problem05
const SEED_PROBLEM05: FirebaseProblemData = {
  title: "Challenge: Multiplication Table of a Number",
  description: "Write a program to calculate and display the multiplication table of a given number",
  phase: "Phase 1",
  problemBadge: "Problem 5",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to generate the multiplication table of a number",
      pairs: [
        {
          input: "what should we do to generate the multiplication table of a number",
          hint: "What is a multiplication table? For example, for the number 5, what are the values when we multiply 5 by numbers starting from 1 up to 10?"
        },
        {
          input: "what should we do here",
          hint: "What is a multiplication table? For example, for the number 5, what are the values when we multiply 5 by numbers starting from 1 up to 10?"
        },
        {
          input: "I don't know / puriyala",
          hint: "Multiplication is repeated addition. For table 5:\n• 5 × 1 = 5, 5 × 2 = 10, 5 × 3 = 15, 5 × 4 = 20 ... up to 5 × 10 = 50.\nHow does each step produce the result?"
        },
        {
          input: "what is multiplication table",
          hint: "A multiplication table shows the product of a fixed number multiplied sequentially by numbers from 1 to 10 (e.g. 5x1=5, 5x2=10... 5x10=50)."
        },
        {
          input: "we just add the number in every step / we add n + i",
          hint: "While multiplication is repeated addition, for any specific row (like step 4), we multiply the given number directly by the step multiplier: 5 × 4 = 20! How do we write that formula?"
        },
        {
          input: "we should divide or find remainder",
          hint: "Division splits a number or finds remainders. To build a multiplication table, we must multiply the given number with consecutive multiplier numbers (1, 2, 3...)."
        },
        {
          input: "start multiplying from 0",
          hint: "Multiplying by 0 gives 0 (e.g. 5 × 0 = 0). Standard multiplication tables start from 1 up to a specified limit (like 10 or 12). Start from 1!"
        },
        {
          input: "just multiply the number by 10",
          hint: "Multiplying only by 10 gives a single value (e.g. 50). A table requires calculating and showing the product for every consecutive number from 1 to 10."
        },
        {
          input: "change the main number in every step",
          hint: "The main table number stays constant (e.g. 5). It is the multiplier that changes consecutively (1, 2, 3, 4, ...)."
        },
        {
          input: "concrete table values example like 5 * 1 = 5, 5 * 2 = 10",
          hint: "Great example! Notice the exact pattern: the table number (5) stays fixed, while the multiplier (1, 2, 3...) increases one by one up to 10 to give each product! You have mastered the logic. Proceed to Recipe!"
        },
        {
          input: "for any step we calculate result = number * multiplier",
          hint: "Fantastic! That is the core formula: Result = Given Number × Multiplier, where the given number is kept fixed and the multiplier steps sequentially from 1 up to 10! Proceed to Recipe!"
        },
        {
          input: "keep the given number fixed and multiply it with each number from 1 up to 10 to get the product",
          hint: "Fantastic! That is the exact mathematical logic: Take the fixed number, multiply it sequentially with numbers from 1 to the limit (e.g. 10), and display each product! Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm to generate the multiplication table",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our mathematical logic, write down the steps one by one in plain English without code keywords.\nExample:\nStep 1: Get the input number\nStep 2: ..."
        },
        {
          input: "step 1 : Get the input number for the table",
          hint: "Great! What is the next step to take the multiplier numbers starting from 1 up to 10?"
        },
        {
          input: "step 2 : Take numbers starting from 0 up to 10",
          hint: "Careful! Standard multiplication tables start from 1. Adjust your starting multiplier from 0 to 1."
        },
        {
          input: "step 2 : Take multiplier numbers starting from 1 up to 10",
          hint: "Nice! For each multiplier in this repetitive process, what calculation action must be performed?"
        },
        {
          input: "step 2.1 : multiply the number by 10",
          hint: "You need to repeat the calculation for every multiplier from 1 to 10, not just the last number."
        },
        {
          input: "step 2.1 : Multiply the input number by the current multiplier",
          hint: "Superb! After calculating the product, what should you do to show the result?"
        },
        {
          input: "step 2.2 : display the result and stop the process",
          hint: "Do not stop after one multiplier! Continue the repeating process until all multipliers up to 10 are completed."
        },
        {
          input: "step 2.2 : Display the multiplier and the calculated product, repeat until multiplier reaches 10",
          hint: "Kudos! You have written down a clear, step-by-step algorithm without any code jargon. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, loops, calculations, and print statements needed for each step.\nFor Step 1, what variable is needed to store the table number?"
        },
        {
          input: "step 1 : n for the table number",
          hint: "Spot on! Now, what programming structure do we use to generate multipliers from 1 to 10 repeatedly? Define its Start, Stop, and Step."
        },
        {
          input: "step 2 : For loop from i = 0",
          hint: "Multiplication tables start at 1. Initialize your loop counter with i = 1."
        },
        {
          input: "step 2 : For loop with Start: 1, Stop: i < 10, Step: +1",
          hint: "If you write i < 10, the loop stops at 9, missing the 10th row! Use i <= 10 (or Stop at 10 inclusive)."
        },
        {
          input: "step 2 : For loop with Start: 1, Stop: 10, Step: -1",
          hint: "Since your loop starts at 1 and counts up to 10, decrementing with -1 will go into negative numbers! Use step: +1."
        },
        {
          input: "step 2 : For loop with Start: 1 (i), Stop: 10 (i <= 10), Step: +1 (i++)",
          hint: "Great! Inside the loop (Step 2.1), what calculation formula stores the product of n and i?"
        },
        {
          input: "step 2.1 : product = n + i",
          hint: "That performs addition! To calculate the table value, use multiplication: product = n * i."
        },
        {
          input: "step 2.1 : product = n * i",
          hint: "Hurray, that's right! Finally, for Step 2.2, what statement is needed inside the loop to display n, i, and product?"
        },
        {
          input: "step 2.2 : Print outside the loop",
          hint: "If print is outside the loop, it will only print the very last product (50). Place print inside the loop to display all 10 rows!"
        },
        {
          input: "step 2.2 : Print statement inside the loop showing n, i, and product",
          hint: "Awesome! You have all the ingredients ready. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here / how to start",
          hint: "Yes, write a simple prototype assembling your verified ingredients:\n• Step 1: Declare input variable (var n = 5;)\n• Step 2: For loop from 1 to 10 (for var i = 1; i <= 10; i++)\n• Step 3: Calculate product (var product = n * i;)\n• Step 4: Formatted print inside loop (print(n + \" x \" + i + \" = \" + product);)\n\nStart with Step 1: declare your input variable!"
        },
        {
          input: "var n = 5;",
          hint: "Superb start! You declared your input variable n = 5 (Step 1). Now add Step 2: the For loop from 1 to 10:\nfor (var i = 1; i <= 10; i++) {\n\n}"
        },
        {
          input: "var n = 5;\nfor (var i = 0; i <= 10; i++) {\n  var product = n * i;\n  print(n + \" x \" + i + \" = \" + product);\n}",
          hint: "Table start bug: The loop starts at 0, printing 5 x 0 = 0. Change initialization to var i = 1."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i < 10; i++) {\n  var product = n * i;\n  print(n + \" x \" + i + \" = \" + product);\n}",
          hint: "Boundary bug: i < 10 stops at 9! Change condition to i <= 10 to include the 10th row."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n + i;\n  print(n + \" x \" + i + \" = \" + product);\n}",
          hint: "Calculation bug: n + i adds the numbers (giving 6, 7, 8...). Use n * i for multiplication."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  n = n * i;\n  print(n + \" x \" + i + \" = \" + n);\n}",
          hint: "Variable overwrite bug: Modifying n inside the loop changes the base table number exponentially! Keep n constant and multiply n * i into a separate product variable."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n}\nprint(n + \" x \" + i + \" = \" + product);",
          hint: "Placement bug: Placing print outside the loop only displays the final product (50). Move print inside the loop block to print all 10 lines."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + \" x \" + i + \" = \" + product);\n  break;\n}",
          hint: "Loop termination bug: break stops the loop immediately after the 1st line. Remove break so the table runs up to 10."
        },
        {
          input: "var n = 5;\nfor (var i = 1; i <= 10; i++) {\n  var product = n * i;\n  print(n + \" x \" + i + \" = \" + product);\n}",
          hint: "You gotcha! That completes the Multiplication Table Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

const SEED_PROBLEM06: FirebaseProblemData = {
  title: "Challenge: Prime Number",
  description: "Write a program to check whether a given number is a Prime number",
  phase: "Phase 1",
  problemBadge: "Problem 6",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to determine if a number is prime",
      pairs: [
        {
          input: "what should we do to check if a number is prime",
          hint: "What is a Prime Number? For example, why is 7 called a prime number, but 6 is not? How many numbers can divide them completely?"
        },
        {
          input: "what should we do here",
          hint: "What is a Prime Number? For example, why is 7 called a prime number, but 6 is not? How many numbers can divide them completely?"
        },
        {
          input: "I don't know / puriyala / theriyala",
          hint: "A prime number is a whole number greater than 1 that has exactly two distinct divisors: 1 and itself.\nFor example:\n• 7 can only be divided by 1 and 7 (Prime)\n• 6 can be divided by 1, 2, 3, and 6 (More than two divisors -> Not Prime / Composite)."
        },
        {
          input: "1 is a prime number",
          hint: "Important math rule: 1 is neither prime nor composite because a prime number must have exactly two different divisors. The number 1 has only one divisor (itself)."
        },
        {
          input: "all odd numbers are prime numbers / if number is odd it is prime",
          hint: "Not all odd numbers are prime! For example, 9, 15, 21, 25, 27 are odd, but they can be divided by 3 or 5, so they are not prime."
        },
        {
          input: "2 is an even number so it cannot be prime",
          hint: "2 is the only even prime number! Its only divisors are 1 and 2 (exactly two divisors)."
        },
        {
          input: "what about 0 or negative numbers",
          hint: "Prime numbers are strictly positive integers greater than 1 (2, 3, 5, 7, 11...). 0 and negative numbers are not prime."
        },
        {
          input: "just divide by 2 to check if prime",
          hint: "Dividing by 2 only checks if it is even or odd. A number like 9 or 25 is not divisible by 2, but it is divisible by 3 or 5. We must test other numbers too!"
        },
        {
          input: "what range of numbers should we test",
          hint: "Since 1 and the number itself always divide the number, we only need to test if any number between 2 and the number before it (N - 1) can divide it with remainder 0."
        },
        {
          input: "if any number between 2 and N-1 divides the number with remainder 0 it is not prime otherwise it is prime",
          hint: "Fantastic! That is the exact mathematical logic: Check numbers from 2 up to N-1 (or count divisors from 1 to N). If any number divides it with remainder 0, it is Not Prime (Composite). If only 1 and itself divide it, it is Prime. Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm to check if a number is prime",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our mathematical logic, write down the sequential steps one by one in plain English without code keywords.\nExample:\nStep 1: Get the input number N\nStep 2: ..."
        },
        {
          input: "step 1 : Get the input number N",
          hint: "Great! What is the first check we should do for numbers less than or equal to 1?"
        },
        {
          input: "step 2 : start testing from 2",
          hint: "What if the user enters 1 or 0? We should first specify that any number less than or equal to 1 is immediately Not Prime."
        },
        {
          input: "step 2 : If N is less than or equal to 1, decide it is not prime",
          hint: "Spot on! Now, for numbers starting from 2, what sequence of testing numbers do we take?"
        },
        {
          input: "step 3 : Test all numbers from 1 up to N",
          hint: "Remember: 1 divides every number! If you test 1, every number will seem non-prime. Start your test from 2 up to N - 1 (or count divisors from 1 to N with counter initialized to 0)."
        },
        {
          input: "step 3 : For every number from 2 up to N - 1",
          hint: "Nice! For each number in this sequence, what condition must we check?"
        },
        {
          input: "step 3.1 : Check if dividing N by the current number leaves a remainder of 0",
          hint: "Superb! If dividing leaves a remainder of 0, what does that mean?"
        },
        {
          input: "step 3.2 : If remainder is not 0, immediately decide it is prime",
          hint: "Careful! Just because the first number (like 2) doesn't divide 9 doesn't mean 9 is prime (3 will divide 9 later). You can only conclude Not Prime early, but Prime only AFTER testing ALL numbers!"
        },
        {
          input: "step 3.2 : If remainder is 0, mark as not prime and stop testing",
          hint: "Awesome! What happens if the entire test finishes without finding any divisor?"
        },
        {
          input: "step 4 : If no number between 2 and N-1 could divide it, decide it is prime",
          hint: "Kudos! You have constructed a flawless, complete algorithm without any code jargon. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, conditions, flags/counters, and print statements needed.\nFor Step 1, what variable is needed to store the input number?"
        },
        {
          input: "step 1 : n for input number",
          hint: "Spot on! Now, what variable or flag can we use to track whether the number is prime (e.g., count = 0 or isPrime = true)?"
        },
        {
          input: "step 1.1 : count initialized to 0 (or isPrime = true)",
          hint: "Great! How do you handle the edge case for numbers n <= 1 using an if condition?"
        },
        {
          input: "step 2 : if (n <= 1) print not prime",
          hint: "Nice! For numbers greater than 1, what loop construct is needed to test divisors from 2 to n - 1 (or 1 to n)? Define Start, Stop, and Step."
        },
        {
          input: "step 3 : For loop starting from i = 0 (or i = 1)",
          hint: "If i = 0, it causes division by zero (n % 0). If testing from 2 to n-1, start at i = 2. If counting all divisors, start at i = 1."
        },
        {
          input: "step 3 : For loop with Stop condition i <= n",
          hint: "If testing from 2 to n-1, writing i <= n tests n % n == 0 (which is always true for itself!). Use i < n (or stop before n). If counting all divisors, use i <= n."
        },
        {
          input: "step 3 : For loop with Start: 2 (i), Stop: n - 1 (i < n), Step: +1 (i++)",
          hint: "Great! Inside the loop (Step 3.1), what if condition and operator check if i divides n?"
        },
        {
          input: "step 3.1 : if (n % i == 0) count++ (or isPrime = false)",
          hint: "Hurray, that's right! Finally, after the loop finishes, what conditional statement prints whether it is Prime or Not Prime?"
        },
        {
          input: "step 4 : if (count == 0) print(\"Prime\") else print(\"Not Prime\")",
          hint: "Awesome! All ingredients are ready and precise. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here",
          hint: "Yes! Draft an executable code prototype using the variables, loop, if condition, and print statements defined in Ingredients.\nExample structure:\nvar n = 7;\nvar isPrime = true;\n..."
        },
        {
          input: "var n = 7;\nvar isPrime = true;\nfor (var i = 1; i < n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
          hint: "Initialization bug: i = 1 makes n % 1 == 0 true on the very first step, making every number falsely 'Not Prime'! Start loop from var i = 2."
        },
        {
          input: "var n = 7;\nvar isPrime = true;\nfor (var i = 2; i <= n; i++) {\n  if (n % i == 0) isPrime = false;\n}",
          hint: "Boundary bug: i <= n checks 7 % 7 == 0, which turns isPrime = false for every number! Change condition to i < n."
        },
        {
          input: "var n = 9;\nfor (var i = 2; i < n; i++) {\n  if (n % i == 0) { print(\"Not Prime\"); }\n  else { print(\"Prime\"); }\n}",
          hint: "Placement bug: At i = 2, 9 % 2 != 0 so it prints 'Prime', then at i = 3 it prints 'Not Prime'! You must finish the whole loop and check the final status outside the loop."
        },
        {
          input: "var n = 1;\nvar isPrime = true;\nfor (var i = 2; i < n; i++) {\n  if (n % i == 0) isPrime = false;\n}\nif (isPrime) print(\"Prime\");",
          hint: "Edge case bug: For n = 1, the loop from 2 to 0 doesn't run, leaving isPrime = true and incorrectly printing 1 as Prime! Add if (n <= 1) isPrime = false; before the loop."
        },
        {
          input: "if (count = 0) { print(\"Prime\"); }",
          hint: "Syntax error: count = 0 is an assignment. Use equality operator count == 0 inside if (...)."
        },
        {
          input: "var n = 7;\nvar isPrime = true;\nif (n <= 1) {\n  isPrime = false;\n} else {\n  for (var i = 2; i < n; i++) {\n    if (n % i == 0) {\n      isPrime = false;\n      break;\n    }\n  }\n}\nif (isPrime) {\n  print(\"Prime\");\n} else {\n  print(\"Not Prime\");\n}",
          hint: "You gotcha! You have handled edge cases (<= 1), correct loop ranges (2 to n-1), early break optimizations, and clean conditional printing. Let's code!"
        },
        {
          input: "var n = 7;\nvar count = 0;\nfor (var i = 1; i <= n; i++) {\n  if (n % i == 0) {\n    count++;\n  }\n}\nif (count == 2) {\n  print(\"Prime\");\n} else {\n  print(\"Not Prime\");\n}",
          hint: "You gotcha! A prime number has exactly 2 divisors (1 and itself). Counting divisors from 1 to N and checking count == 2 works cleanly for all numbers including 1, 0, and negatives! That completes the Prime Number Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

const SEED_PROBLEM06_NEXT_PRIME: FirebaseProblemData = {
  title: "Challenge: Next Prime Number",
  description: "Write a program to find the next prime number strictly greater than a given number",
  phase: "Phase 1",
  problemBadge: "Problem 7",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to find the next prime number strictly greater than a given number",
      pairs: [
        {
          input: "what should we do to find the next prime number",
          hint: "What is the Next Prime Number? For example, if the given number is 7, what is the smallest prime number strictly greater than 7? How do we search for it starting from N + 1?"
        },
        {
          input: "I don't know / puriyala / theriyala",
          hint: "The next prime number is the very first prime number strictly greater than the given number.\nFor example:\n• If given number is 7, we test candidates starting from 8: 8 (not prime), 9 (not prime), 10 (not prime), 11 (Prime!).\nSo the next prime of 7 is 11. How do we test candidate numbers sequentially?"
        },
        {
          input: "next prime of 7 is 7",
          hint: "The next prime must be strictly GREATER than the given number! Even if 7 is prime, the next prime that comes after 7 is 11."
        },
        {
          input: "just add 1 or 2 to the number",
          hint: "Adding 1 or 2 does not guarantee a prime! For example, 7 + 2 = 9 (not prime) and 13 + 2 = 15 (not prime). We must test each candidate for primality until we find a prime."
        },
        {
          input: "what if input is 0 or 1",
          hint: "Since the smallest prime number is 2, if the input is 0 or 1 (or negative), the next prime number is 2."
        },
        {
          input: "start testing from given number + 1",
          hint: "Great! Starting from candidate = N + 1, what test do we perform on each candidate number to check if it is prime?"
        },
        {
          input: "check if the candidate number is prime",
          hint: "Superb! If the candidate number has no divisors between 2 and candidate-1, it is prime. What should we do if it is not prime?"
        },
        {
          input: "increase by 1 and check the next number",
          hint: "Exactly! Keep increasing candidate by 1 and testing each number until the first prime is found."
        },
        {
          input: "start from N+1 and check each consecutive number until we find a number with no divisors other than 1 and itself",
          hint: "Fantastic! That is the exact mathematical logic for Next Prime Number: Start candidate at N + 1, test each candidate for primality, and return the first prime found. Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm to find the next prime number",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our mathematical logic, write down the sequential cooking steps in plain English without code keywords:\nStep 1: Get the input number n\nStep 2: ..."
        },
        {
          input: "recipe eppdi eluthurathu",
          hint: "Namma Stage 1 Logic ah step-by-step plain English recipe ah eluthanum! Step 1 la input n vaangurathu, Step 2 la candidate n+1 set panrathu nu sequence ah eluthunga."
        },
        {
          input: "adutha step enna",
          hint: "Great question! Identify which steps you've written so far. If you have Step 1 (Get N) and Step 2 (Candidate N+1), the next Step 3 is to check if candidate is a prime number (testing divisors from 2 to candidate - 1)."
        },
        {
          input: "while (true) / for loop / candidate++",
          hint: "🌟 Coach Maya gentle reminder: In the Recipe stage, we use plain human kitchen-like steps without code words (no `while`, `for`, `candidate++`, `%`, or `;`). Use everyday words like 'start candidate as N + 1', 'check if prime', and 'repeat until prime is found'."
        },
        {
          input: "step 1 : Get the input number n",
          hint: "Great! In Step 2, what initial candidate number do we start testing from?"
        },
        {
          input: "step 2 : Start candidate number as n + 1",
          hint: "Spot on! (If candidate < 2, set candidate to 2). Now what is Step 3 to test this candidate?"
        },
        {
          input: "step 3 : Check if candidate number is prime",
          hint: "Superb! In Step 4 (or 3.1), what should we do if the candidate is prime?"
        },
        {
          input: "step 3.1 : If candidate is prime, display candidate as next prime and stop",
          hint: "Awesome! In Step 5 (or 3.2), what should we do if the candidate is not prime?"
        },
        {
          input: "step 4 : If candidate is prime, display candidate as next prime and stop",
          hint: "Awesome! In Step 5, what should we do if the candidate is not prime?"
        },
        {
          input: "step 3.2 : If candidate is not prime, increase candidate by 1 and repeat from step 3",
          hint: "Kudos! You have constructed a clear, complete step-by-step algorithm without any code jargon. Proceed to Ingredients!"
        },
        {
          input: "step 5 : If candidate is not prime, increase candidate by 1 and repeat from step 3",
          hint: "Kudos! You have constructed a clear, complete step-by-step algorithm without any code jargon. Proceed to Ingredients!"
        },
        {
          input: "Step 1: Get input N\nStep 2: Start candidate as N + 1\nStep 3: Check if candidate is prime\nStep 4: If prime, display candidate and stop\nStep 5: If not prime, increase candidate by 1 and repeat Step 3",
          hint: "You gotcha! Perfect 5-step recipe without missing any step. Proceed to Stage 3: Ingredients!"
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, loops, counters/flags, conditions, and print statements needed.\nFor Step 1, what variables are needed for the input number `a` and the candidate number `b`?"
        },
        {
          input: "step 1 : a for input number, b = a + 1 (or n for input, candidate = n + 1)",
          hint: "Spot on! In Step 2, what outer loop construct starts at candidate `b` and searches until a prime is found? Decompose its Start, End, and Next step."
        },
        {
          input: "step 2 : for loop (start: b, end: infinite / until prime found, next step: +1)",
          hint: "Spot on! Now in Step 3, to count the divisors of candidate `b` (Two Divisors Method), set `count = 0` and write the inner `for loop` with its 3 parts:\n• Start: 1\n• End: b (testing candidate b)\n• Next Step: +1"
        },
        {
          input: "step 3 : for loop start 1 end a",
          hint: "⚠️ Notice your inner loop's **End**: You wrote `End: a`. Remember that `a` is only the initial user input (e.g. 5), but we want to test if candidate `b` (e.g. 6, 7...) is prime! So your inner loop must end at `End: b` (testing from 1 to b) to count divisors for `b`!"
        },
        {
          input: "step 3 : count = 0, for loop (start: 1, end: b, next step: +1)",
          hint: "Superb! In Step 4, inside the inner loop, what if condition checks if `i` divides `b` and increments the count?"
        },
        {
          input: "step 4 : use if condition\n  left side (b % i)\n  operator (==)\n  right side (0)\n  action: count = count + 1",
          hint: "Hurray, that's right! Finally, for Step 5: A prime number has exactly 2 divisors (1 and itself). After the inner loop finishes, what `if condition` checks if `count == 2` to print `b` and break?"
        },
        {
          input: "step 5 : use if condition\n  left side (count)\n  operator (==)\n  right side (2)\n  action: print(b); break;",
          hint: "Awesome! All 5 ingredients are verified! Since `count = 0` is initialized right above the inner loop inside the search loop, no else is needed. Now let's proceed to Taste the Sample."
        },
        {
          input: "step 3 : isPrime = true flag and for loop with Start: 2 (i), Stop: candidate - 1 (i < candidate), Step: +1",
          hint: "Nice! Inside the inner loop (Step 3.1), what if condition checks if i divides candidate?"
        },
        {
          input: "step 3.1 : if (candidate % i == 0) { isPrime = false; break; }",
          hint: "Hurray, that's right! Finally, after the inner loop finishes, what conditional statement prints the candidate and stops the search, or increments candidate?"
        },
        {
          input: "step 4 : if (isPrime) { print(candidate); break; } else { candidate++; }",
          hint: "Awesome! All ingredients are ready and precise. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "Do I need to write the code here / how to start",
          hint: "Yes! Let's draft the executable code prototype step-by-step using for loops:\nStep 1: Declare input variable and start candidate at n + 1 (e.g. let a = 5; let b = a + 1; or let n = 7; let candidate = n + 1;)"
        },
        {
          input: "how to define for loop / outer loop / for(b=a+1; / for loop",
          hint: "Great! To define the outer search for-loop that starts at candidate `b` (or `candidate = n + 1`), search until a prime is found by continuously incrementing:\n`for (let b = a + 1; ; b++) {` (or `for (let candidate = n + 1; ; candidate++) {`)\nNow inside this outer loop, write the inner primality check!"
        },
        {
          input: "var candidate = n;",
          hint: "Candidate start bug: If candidate = n and n is prime (like 7), your code will return 7 instead of the next prime! Start candidate at n + 1 (var candidate = n + 1; or for (let b = a + 1; ; b++))."
        },
        {
          input: "how to define inner loop / divisor check",
          hint: "For the inner primality check inside the outer loop, test divisors `i` from 2 up to `b - 1` (or count from 1 to b):\n`let isPrime = true;\nfor (let i = 2; i < b; i++) {\n  if (b % i === 0) {\n    isPrime = false;\n    break;\n  }\n}`"
        },
        {
          input: "for (var i = 2; i <= candidate; i++)",
          hint: "Inner loop boundary bug: i <= candidate tests candidate % candidate == 0, making every candidate falsely non-prime! Use strictly less than candidate: `i < b` (or `i < candidate`)."
        },
        {
          input: "while (isPrime)",
          hint: "Outer loop condition bug: isPrime will become false on the first non-prime candidate (like 8), stopping the outer loop permanently! Use `for (let b = a + 1; ; b++)` or `while (true)` with isPrime reset inside."
        },
        {
          input: "let a = 5;\nfor (let b = a + 1; ; b++) {\n  let isPrime = true;\n  for (let i = 2; i < b; i++) {\n    if (b % i === 0) {\n      isPrime = false;\n      break;\n    }\n  }\n  if (isPrime) {\n    console.log(b);\n    break;\n  }\n}",
          hint: "You gotcha! That completes the Next Prime Number Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

const SEED_PROBLEM07: FirebaseProblemData = {
  title: "Challenge: Prime Numbers in a Given Range",
  description: "Write a program to find and display all prime numbers within a given range",
  phase: "Phase 1",
  problemBadge: "Problem 7",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to find all prime numbers in a range using divisor counting",
      pairs: [
        {
          input: "what should we do to find prime numbers in a range",
          hint: "What does 'Prime numbers in a range' mean? For example, between 10 and 20, what are all the prime numbers, and how do we check each one?"
        },
        {
          input: "what should we do here",
          hint: "What does 'Prime numbers in a range' mean? For example, between 10 and 20, what are all the prime numbers, and how do we check each one?"
        },
        {
          input: "I don't know / puriyala",
          hint: "A range gives a starting number and an ending number (e.g., 10 to 20). We must check every number in that range one by one. For each number, we count how many numbers divide it with remainder 0 (from 1 to that number). If the total count of divisors is exactly 2, it is a Prime Number!"
        },
        {
          input: "why must the count of divisors be exactly 2",
          hint: "By definition, a prime number can only be divided by 1 and itself (2 unique divisors).\n• For 7: Divisors are 1 and 7 -> Total divisors = 2 (Prime!)\n• For 6: Divisors are 1, 2, 3, 6 -> Total divisors = 4 (Not Prime)\n• For 1: Divisor is only 1 -> Total divisors = 1 (Not Prime)."
        },
        {
          input: "if range starts from 1, is 1 prime because count is small",
          hint: "No! Number 1 has only 1 divisor (itself). Since its divisor count is 1 (not 2), 1 is not prime."
        },
        {
          input: "should we test starting and ending numbers",
          hint: "Yes! Unless specified otherwise, test all whole numbers starting from the beginning of the range up to and including the ending number."
        },
        {
          input: "should we keep adding divisor counts together",
          hint: "No! Each number in the range is an independent test. When you move to the next number, you must start counting its divisors from 0 again."
        },
        {
          input: "for each number in the range, count how many numbers from 1 to that number divide it with remainder 0, and if the count is exactly 2 it is prime",
          hint: "Fantastic! That is the exact mathematical logic: Iterate through the range, count divisors from 1 to the current number, and if count is exactly 2, it is a Prime Number. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm in plain English without code keywords",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our divisor counting logic, write down the sequential steps one by one. Example: Step 1: Get the starting and ending numbers, Step 2: ..."
        },
        {
          input: "step 1 : Get starting number and ending number",
          hint: "Great! What is the next step to go through each number in this range from start to end?"
        },
        {
          input: "step 2 : For each number in the range from start up to end",
          hint: "Nice! For the current number, what must you do before testing its divisors?"
        },
        {
          input: "step 2.1 : test all numbers without setting counter",
          hint: "You must reset your divisor counter! Set divisor count = 0 at the start of each new number."
        },
        {
          input: "step 2.1 : Start divisor count at 0 for the current number",
          hint: "Spot on! Now, what sequence of numbers do you divide this current number by?"
        },
        {
          input: "step 2.2 : Test every number from 1 up to the current number",
          hint: "Good! While testing each number, what condition increases the divisor count?"
        },
        {
          input: "step 2.3 : If dividing leaves a remainder of 0, increase divisor count by 1",
          hint: "Superb! After testing all numbers up to the current number, how do you decide if it is prime?"
        },
        {
          input: "step 2.4 : If divisor count is exactly 2, record / display the current number as prime",
          hint: "Kudos! You have written down a complete, crystal-clear step-by-step algorithm. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed (variables, nested loops, count)",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, nested loops, condition checks, and print statements needed. For Step 1, what variables store the range limits?"
        },
        {
          input: "step 1 : start and end for range limits",
          hint: "Spot on! Now, what outer loop construct iterates through every number from start to end?"
        },
        {
          input: "step 2 : For loop with num < end",
          hint: "If you write num < end, the loop stops before end, missing the ending number! Use num <= end."
        },
        {
          input: "step 2 : Outer for loop with Start: start (num), Stop: end (num <= end), Step: +1",
          hint: "Great! Inside the outer loop, what variable tracks the number of divisors for the current num?"
        },
        {
          input: "step 2.1 : count = 0 before the outer loop",
          hint: "Placement Bug! If count = 0 is outside the outer loop, the divisor count will keep accumulating for all numbers combined. Place var count = 0; INSIDE the outer loop!"
        },
        {
          input: "step 2.1 : var count = 0 inside the outer loop",
          hint: "Spot on! Now, what inner loop construct tests every divisor from 1 up to num?"
        },
        {
          input: "step 2.2 : Inner for loop from i = 2 to i < num",
          hint: "For the count == 2 logic, we must count ALL divisors including 1 and num itself! Inner loop must run from i = 1 to i <= num."
        },
        {
          input: "step 2.2 : Inner for loop with Start: 1 (i), Stop: num (i <= num), Step: +1",
          hint: "Great! Inside the inner loop (Step 2.3), what condition and operator check divisibility and increment count?"
        },
        {
          input: "step 2.3 : if (num % i == 0) { count++; }",
          hint: "Hurray, that's right! Finally, after the inner loop finishes (Step 2.4), what conditional statement prints the prime number?"
        },
        {
          input: "step 2.4 : if (count == 2) { print(num); }",
          hint: "Awesome! All ingredients are systematically identified. Now let's proceed to Taste the Sample."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code prototype and fix bugs",
      pairs: [
        {
          input: "Do I need to write the code here",
          hint: "Yes! Draft an executable code prototype using nested loops, inner divisor counting, and checking count == 2.\nExample structure:\nvar start = 10, end = 20;\nfor (var num = start; num <= end; num++) {\n  var count = 0;\n  for (var i = 1; i <= num; i++) {\n    if (num % i == 0) count++;\n  }\n  if (count == 2) print(num);\n}"
        },
        {
          input: "var start = 10, end = 20;\nvar count = 0;\nfor (var num = start; num <= end; num++) {\n for (var i = 1; i <= num; i++) \n{ if (num % i == 0) count++; }\n if (count == 2) print(num);\n}",
          hint: "Scope Bug: count is not reset for each number! It keeps increasing (2, 6, 8...), so after the first prime, no other prime will ever match count == 2. Move var count = 0; INSIDE the outer loop."
        },
        {
          input: "for (var num = start; num <= end; num++) {\n var count = 0;\n for (var i = 1; i < num; i++) { if (num % i == 0) count++; }\n if (count == 2) print(num);\n}",
          hint: "Boundary Bug: i < num misses the number itself, so prime numbers will only get count = 1 (from divisor 1)! Change inner loop condition to i <= num."
        },
        {
          input: "for (var num = start; num <= end; num++) {\n var count = 0;\n for (var i = 1; i <= num; i++) {\n if (num % i == 0) count++;\n if (count == 2) print(num);\n }\n}",
          hint: "Placement Bug: If you check count == 2 inside the inner loop, composite numbers like 6 will reach count == 2 when i = 2 and prematurely print 6 as prime! Check if (count == 2) OUTSIDE the inner loop."
        },
        {
          input: "if (count = 2) { print(num); }",
          hint: "Syntax error: count = 2 assigns 2 to count. Use equality operator count == 2 inside if (...)."
        },
        {
          input: "for (var i = 0; i <= num; i++) { if (num % i == 0) count++; }",
          hint: "Runtime Bug: i = 0 causes num % 0 (Division by zero crash!). Start inner loop at var i = 1."
        },
        {
          input: "var start = 10;\nvar end = 20;\nfor (var num = start; num <= end; num++) {\n var count = 0;\n for (var i = 1; i <= num; i++) {\n if (num % i == 0) {\n count++;\n }\n }\n if (count == 2) {\n print(num);\n }\n}",
          hint: "You gotcha! You have written the complete, robust nested loop implementation using divisor count count == 2. It handles all range numbers, boundary conditions, and proper counter scoping. Let's code!"
        }
      ]
    }
  }
};

const SEED_PROBLEM08_SEXY_PRIME: FirebaseProblemData = {
  title: "Challenge: Sexy Prime Numbers",
  description: "Write a program to find and display all pairs of prime numbers that differ from each other by six (p, p + 6)",
  phase: "Phase 1",
  problemBadge: "Problem 8",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to find sexy prime pairs where both p and p + 6 are prime",
      pairs: [
        {
          input: "what is sexy prime number",
          hint: "Sexy primes are pairs of prime numbers of the form (p, p + 6) such that both p and p + 6 are prime numbers (the name comes from 'sex', the Latin word for six). For example: (5, 11), (7, 13), and (11, 17)."
        },
        {
          input: "is 5 and 11 a sexy prime pair",
          hint: "Yes! 5 is a prime number and 11 is a prime number. Their difference is 11 - 5 = 6. Since both numbers are prime and differ by 6, (5, 11) is a valid sexy prime pair!"
        },
        {
          input: "what if p is prime but p+6 is not prime",
          hint: "If p is prime but p + 6 is composite (for example, p = 19 is prime, but 19 + 6 = 25 is composite with divisors 1, 5, 25), then (19, 25) is NOT a sexy prime pair. BOTH numbers must be prime!"
        },
        {
          input: "what is the upper bound condition",
          hint: "If the upper limit is n, candidate p only needs to be checked up to p <= n - 6, ensuring that the paired number p + 6 does not exceed n."
        },
        {
          input: "for each number p up to n-6 check if both p and p+6 are prime",
          hint: "Fantastic! That is the complete mathematical logic: check every candidate p up to n - 6, verify that both p and p + 6 are prime numbers (difference of 6), and pair them. Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm in plain English without code keywords",
      pairs: [
        {
          input: "what should i do here",
          hint: "Based on our sexy prime logic, write down the sequential steps one by one in plain English. Step 1: Get the upper limit number from the user, Step 2: ..."
        },
        {
          input: "step 1 : get upper limit number",
          hint: "Great! Now for Step 2, what sequence of numbers will you check starting from 2 up to 6 less than the limit?"
        },
        {
          input: "step 2 : for each number from 2 up to 6 less than the limit",
          hint: "Nice! Now for Step 3, what must you first check for the current number to see if it is prime?"
        },
        {
          input: "step 3 : check if the first number is a prime number",
          hint: "Superb! In Step 4, if the first number is prime, what do you check for the companion number (adding 6 to the current number)?"
        },
        {
          input: "step 4 : check if adding 6 to the number also gives a prime number",
          hint: "Spot on! Finally, in Step 5, if both numbers are prime, what action do you take to output the pair?"
        },
        {
          input: "step 5 : if both numbers are prime display them as a pair",
          hint: "Kudos! You have sequenced all 5 steps of the algorithm in plain English without variable symbols. Proceed to Ingredients!"
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the variables, loops, counters, and condition checks needed",
      pairs: [
        {
          input: "what do I do here",
          hint: "Identify the variables, nested loops, condition checks, and print statements needed for sexy prime pairs. For Step 1, what variables store the limit and candidates?"
        },
        {
          input: "step 1 : n for limit, p for first candidate, q = p + 6",
          hint: "Great! What outer loop construct will iterate p from 2 up to n - 6?"
        },
        {
          input: "step 2 : outer for loop with Start: 2, Stop: n - 6, Step: +1",
          hint: "Spot on! Now what counters and inner divisor loops test primality for p and p + 6?"
        },
        {
          input: "step 3 : count1 = 0 for p, count2 = 0 for p + 6",
          hint: "Superb! Inside each divisor loop, what condition increments count1 for p and count2 for p + 6?"
        },
        {
          input: "step 4 : if (p % i == 0) count1++ and if ((p+6) % j == 0) count2++",
          hint: "Hurray! Finally, what combined if-condition checks if BOTH numbers are prime to display the pair?"
        },
        {
          input: "step 5 : if (count1 == 2 && count2 == 2) print pair (p, p + 6)",
          hint: "Awesome! All 5 ingredients are identified and verified. Proceed to Taste the Sample!"
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the executable prototype and verify test cases",
      pairs: [
        {
          input: "Do I need to write the code here",
          hint: "Yes! Let's draft the executable prototype for Sexy Primes using nested loops:\nvar n = 30;\nfor (var p = 2; p <= n - 6; p++) {\n  var count1 = 0;\n  for (var i = 1; i <= p; i++) {\n    if (p % i == 0) count1++;\n  }\n  if (count1 == 2) {\n    var q = p + 6;\n    var count2 = 0;\n    for (var j = 1; j <= q; j++) {\n      if (q % j == 0) count2++;\n    }\n    if (count2 == 2) {\n      print(\"(\" + p + \", \" + q + \")\");\n    }\n  }\n}"
        },
        {
          input: "for (var p = 2; p <= n - 6; p++)",
          hint: "Great start! Now inside the loop, reset count1 = 0 and count divisors of p from 1 to p."
        },
        {
          input: "can we use same count variable for both numbers",
          hint: "Variable Collision Bug: If you use the same `count` variable for both p and p + 6 without separate tracking, the divisor counts will blend together! Use distinct counters: `count1` for p and `count2` for p + 6 (or reset count between checks)."
        },
        {
          input: "var n = 30;\nfor (var p = 2; p <= n - 6; p++) {\n  var count1 = 0;\n  for (var i = 1; i <= p; i++) {\n    if (p % i == 0) count1++;\n  }\n  if (count1 == 2) {\n    var q = p + 6;\n    var count2 = 0;\n    for (var j = 1; j <= q; j++) {\n      if (q % j == 0) count2++;\n    }\n    if (count2 == 2) {\n      print(\"(\" + p + \", \" + q + \")\");\n    }\n  }\n}",
          hint: "You gotcha! That completes the Sexy Prime Number Pairs Cook The Code journey. Let's code!"
        }
      ]
    }
  }
};

// Complete fallback seed data for problem09 (Positive or Negative Number) matching Firebase RTDB
const SEED_PROBLEM09_POSITIVE_NEGATIVE: FirebaseProblemData = {
  title: "Challenge: Positive or Negative",
  description: "Write a program to check if a given number is positive or negative",
  phase: "Phase 1",
  problemBadge: "Problem 9",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to find if a number is positive or negative",
      pairs: [
        {
          input: "what is positive or negative",
          hint: "Numbers greater than 0 are Positive (e.g., 1, 2, 5). Numbers less than 0 are Negative (e.g., -1, -2, -5). Zero (0) is neither positive nor negative."
        },
        {
          input: "how to check positive or negative",
          hint: "Compare the number with 0 using comparison operators (> or <). What are examples of positive numbers (e.g., 5, 10) and negative numbers (e.g., -5, -10)?"
        },
        {
          input: "positive number: 1, 2, 3 negative number: -1, -2, -3",
          hint: "You gave great example numbers for positive and negative! Now, what is the logical rule? How do we test whether any number is positive or negative by comparing with 0 (e.g., numbers greater than 0 are positive, numbers less than 0 are negative)?"
        },
        {
          input: "if number is greater than 0 it is positive else negative",
          hint: "You've got the concept! Now provide concrete examples: What is an example of a positive number (e.g., 1, 2, 5), and a negative number (e.g., -1, -2, -5)?"
        },
        {
          input: "positive numbers are greater than 0 (e.g. 5) and negative numbers are less than 0 (e.g. -5)",
          hint: "Spot on! Numbers greater than 0 are Positive (e.g., 1, 2, 5) and numbers less than 0 are Negative (e.g., -1, -2, -5). Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "To begin your recipe, start with Step 1: How do we get the number from the user? (e.g. Step 1: Get input number n)."
        },
        {
          input: "what id do here",
          hint: "To begin your recipe, start with Step 1: How do we get the number from the user? (e.g. Step 1: Get input number n)."
        },
        {
          input: "what i do here",
          hint: "To begin your recipe, start with Step 1: How do we get the number from the user? (e.g. Step 1: Get input number n)."
        },
        {
          input: "how to write recipe",
          hint: "To begin your recipe, start with Step 1: How do we get the number from the user? (e.g. Step 1: Get input number n)."
        },
        {
          input: "step 1 : Get input number n",
          hint: "Great start! You wrote Step 1. Now for Step 2: What condition tests whether n is positive (e.g. checking if it is greater than 0)?"
        },
        {
          input: "step 2 : Check if n is greater than 0",
          hint: "Awesome! You have Step 1 and the condition in Step 2. Now for Step 3: If that condition is true, what message should we display?"
        },
        {
          input: "step 3 : If true, display Positive",
          hint: "Almost done! Now for Step 4: In the else case, if the number is not greater than 0, what message should we display?"
        },
        {
          input: "step 1: get input number n\nstep 2: check if n is greater than 0\nstep 3: if true display positive\nstep 4: else display negative",
          hint: "Kudos! Complete step-by-step recipe. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "For checking positive/negative, we need:\n1. Input variable n\n2. If condition broken down into Left Side (L.S: n), Operator (>), and Right Side (R.S: 0)\n3. Inside 'if' block: print(\"Positive\")\n4. Inside 'else' block: print(\"Negative\")"
        },
        {
          input: "step 1 : n for input",
          hint: "Spot on! Now define the If condition parts: What are the Left Side (L.S), Operator, and Right Side (R.S)?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether a is greater than 10:\n• L.S : a\n• Operator : >\n• R.S : 10\nSo 'if' looks like: if (a > 10).\nNow define L.S, Operator, and R.S for positive check, plus what gets printed inside 'if' and 'else'!"
        },
        {
          input: "step 2 : If condition with L.S: n, Operator: >, R.S: 0",
          hint: "Great! Now specify what happens inside each block:\n• Inside 'if' block: print(\"Positive\")\n• Inside 'else' block: print(\"Negative\")"
        },
        {
          input: "step 1: input variable n\nstep 2: if condition with L.S: n, Operator: >, R.S: 0\nstep 3: inside if print Positive\nstep 4: inside else print Negative",
          hint: "Hurray! Complete ingredients identified: Variable n, Condition breakdown (L.S: n, Operator: >, R.S: 0), and operations inside 'if' (print 'Positive') and 'else' (print 'Negative'). Proceed to Sample Code!"
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code by comparing n with 0.\nExample:\nvar n = 5;\nif (n > 0) print(\"Positive\");\nelse print(\"Negative\");"
        },
        {
          input: "var n = 5; if (n > 0) print(\"Positive\"); else print(\"Negative\");",
          hint: "You gotcha! Clean and correct comparison code."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem10 (Number is 3-Digit or Not) matching Firebase RTDB /hints/problem10
const SEED_PROBLEM10_THREE_DIGIT: FirebaseProblemData = {
  title: "Challenge: 3-Digit Number Checker",
  description: "Write a program to check whether a given integer is a 3-digit number",
  phase: "Phase 1",
  problemBadge: "Problem 10",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to determine if a number is a 3-digit number",
      pairs: [
        {
          input: "what is a 3-digit number",
          hint: "A 3-digit number has 3 digits and ranges from 100 up to 999 inclusive. For example, 100, 250, 456, 999 are 3-digit numbers, whereas 5, 42, and 1000 are not."
        },
        {
          input: "how to check if number is 3-digit",
          hint: "Check if the number is greater than or equal to 100 AND less than or equal to 999 (100 <= n <= 999). Can you give an example of a 3-digit number (e.g. 250) and a NOT 3-digit number (e.g. 45 or 1000)?"
        },
        {
          input: "a 3-digit number is between 100 and 999 (e.g. 250 is 3-digit, 45 is not)",
          hint: "Spot on! Numbers from 100 to 999 inclusive are 3-digit numbers (e.g. 250), while numbers outside this range (e.g. 45 or 1000) are not. Proceed to Recipe!"
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get input number n. Step 2: Check if n >= 100 and n <= 999. Step 3: If true display '3-digit number'. Step 4: Else display 'Not a 3-digit number'."
        },
        {
          input: "step 1 : Get number n",
          hint: "Great start! What condition checks if n is between 100 and 999 inclusive for Step 2?"
        },
        {
          input: "step 2",
          hint: "For Step 2, test the 3-digit range: 'Step 2: Check if n is greater than or equal to 100 and less than or equal to 999'."
        },
        {
          input: "step 1: get input number n\nstep 2: check if n is greater than or equal to 100 and less than or equal to 999\nstep 3: if true display 3-digit number\nstep 4: else display not a 3-digit number",
          hint: "Kudos! Complete step-by-step recipe. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "For checking a 3-digit number, we need:\n1. Step 1: Variable n for input\n2. Step 2: If condition parts (Left Side: n, Operators: >= and <=, Right Side: 100 and 999, Logical Operator: && -> `n >= 100 && n <= 999`)\n3. Step 3: Inside 'if' block operation: print(\"3-digit number\")\n4. Step 4: Inside 'else' block operation: print(\"Not a 3-digit number\")"
        },
        {
          input: "step 1 : n for input",
          hint: "Spot on! Now break down the condition parts: What is the Left Side (L.S), Operators, and Right Side (R.S) for checking if n is between 100 and 999?"
        },
        {
          input: "step 2 : if condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Operator: &&",
          hint: "Great condition breakdown! Now specify what happens inside each block:\n• Inside 'if' block: print(\"3-digit number\")\n• Inside 'else' block: print(\"Not a 3-digit number\")"
        },
        {
          input: "step 1: input variable n\nstep 2: if condition with L.S: n, Operators: >= and <=, R.S: 100 and 999, Logical Op: && (n >= 100 && n <= 999)\nstep 3: inside if print 3-digit number\nstep 4: inside else print Not a 3-digit number",
          hint: "Hurray! Complete ingredients identified: Variable n, condition breakdown (L.S: n, Operators: >= & <=, R.S: 100 & 999, Logical Operator: &&), and operations inside 'if' (print '3-digit number') and 'else' (print 'Not a 3-digit number'). Proceed to Sample Code!"
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code checking if n is between 100 and 999.\nExample:\nvar n = 456;\nif (n >= 100 && n <= 999) {\n  print(\"3-digit number\");\n} else {\n  print(\"Not a 3-digit number\");\n}"
        },
        {
          input: "var n = 456; if (n >= 100 && n <= 999) print(\"3-digit number\"); else print(\"Not a 3-digit number\");",
          hint: "You gotcha! Clean and correct compound condition code."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem11 (Eligible or Not Eligible to Vote) matching Firebase RTDB /hints/problem11
const SEED_PROBLEM11_VOTING: FirebaseProblemData = {
  title: "Challenge: Eligible or Not Eligible to Vote",
  description: "Check if a person is eligible to vote based on their age",
  phase: "Phase 1",
  problemBadge: "Problem 11",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the real-world rule to check voting eligibility based on age",
      pairs: [
        {
          input: "what is voting eligibility age",
          hint: "A person must be 18 years old or older to be eligible to vote."
        },
        {
          input: "how to check if a person can vote",
          hint: "Check whether the person's age is 18 or older. If they are at least 18, they can vote; otherwise, they cannot vote."
        },
        {
          input: "if age is 18 or more then eligible",
          hint: "Spot on! If someone is 18 or older, they are Eligible to Vote; if they are under 18, they are Not Eligible. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm in everyday words",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Take the person's age. Step 2: Check if age is 18 or older. Step 3: If yes, announce Eligible to vote; otherwise, announce Not Eligible."
        },
        {
          input: "step 1 : Get input age",
          hint: "Great! Next, check whether the age meets the requirement of 18 or older."
        },
        {
          input: "step 2 : If age is 18 or older, announce Eligible, otherwise announce Not Eligible",
          hint: "Kudos! Complete step-by-step recipe in everyday words. Proceed to Ingredients."
        },
        {
          input: "step 2 : If age is greater than or equal to 18, display Eligible, else display Not Eligible",
          hint: "Kudos! Complete step-by-step recipe in everyday words. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable age, and an if-else condition using comparison operator >=."
        },
        {
          input: "step 1 : age variable",
          hint: "Spot on! Now, how do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether age is 18 or above\n• L.S : age\n• R.S : 18\n• Operator : >=\nSo 'if' looks like this: if (age >= 18)."
        },
        {
          input: "step 2 : If condition with L.S: age, R.S: 18, Operator: >=",
          hint: "Hurray! if (age >= 18). If true print 'Eligible', else print 'Not Eligible'. Proceed to Sample Code."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code comparing age with 18.\nExample:\nvar age = 20;\nif (age >= 18) print(\"Eligible\");\nelse print(\"Not Eligible\");"
        },
        {
          input: "var age = 20; if (age >= 18) print(\"Eligible\"); else print(\"Not Eligible\");",
          hint: "You gotcha! Perfect condition checking."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem12 (Pass or Fail Based on Mark) matching Firebase RTDB /hints/problem12
const SEED_PROBLEM12_PASS_FAIL: FirebaseProblemData = {
  title: "Challenge: Pass or Fail Based on Mark",
  description: "Write a program to check if a student has Passed or Failed based on their mark (mark >= 35)",
  phase: "Phase 1",
  problemBadge: "Problem 12",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to check pass or fail status based on mark",
      pairs: [
        {
          input: "what mark is pass",
          hint: "Usually, a mark of 35 or above (mark >= 35) is considered Pass. Less than 35 is Fail."
        },
        {
          input: "how to check if student passed",
          hint: "Compare the mark with 35 using comparison operator >=."
        },
        {
          input: "if mark is 35 or more it is pass else fail",
          hint: "Spot on! If mark >= 35 -> Pass, else -> Fail. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get mark input. Step 2: Check if mark >= 35. Step 3: Print result."
        },
        {
          input: "step 1 : Get mark input",
          hint: "Great! What is the passing mark condition?"
        },
        {
          input: "step 2 : If mark is greater than or equal to 35, display Pass, else display Fail",
          hint: "Kudos! Complete step-by-step algorithm. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable mark, and an if-else condition using comparison operator >=."
        },
        {
          input: "step 1 : mark variable",
          hint: "Spot on! How do you write the if condition for checking pass mark using Left Side (L.S), Right Side (R.S), and Operator?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether mark is 35 or above\n• L.S : mark\n• R.S : 35\n• Operator : >=\nSo 'if' looks like this: if (mark >= 35)."
        },
        {
          input: "step 2 : If condition with L.S: mark, R.S: 35, Operator: >=",
          hint: "Hurray! if (mark >= 35). If true print 'Pass', else print 'Fail'. Proceed to Sample Code."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code comparing mark with 35.\nExample:\nvar mark = 45;\nif (mark >= 35) print(\"Pass\");\nelse print(\"Fail\");"
        },
        {
          input: "var mark = 45; if (mark >= 35) print(\"Pass\"); else print(\"Fail\");",
          hint: "You gotcha! Spot on comparison code."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem13 (Number is Greater than 100 or Not) matching Firebase RTDB /hints/problem13
const SEED_PROBLEM13_GREATER_100: FirebaseProblemData = {
  title: "Challenge: Number is Greater than 100 or Not",
  description: "Write a program to check whether a given number is greater than 100 or not (num > 100)",
  phase: "Phase 1",
  problemBadge: "Problem 13",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to check whether a number is greater than 100 or not",
      pairs: [
        {
          input: "how to check if number is greater than 100",
          hint: "Take a number and compare it with 100 using the greater than operator (>). If number is greater than 100 it is Greater, otherwise Not Greater."
        },
        {
          input: "what if number is 100",
          hint: "If the number is exactly 100, it is NOT greater than 100! 100 is equal to 100. Strictly greater than 100 means 101 or more."
        },
        {
          input: "if number is greater than 100 it is greater else not greater",
          hint: "Spot on! If num > 100 -> Greater, otherwise Not Greater. Proceed to Recipe stage."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm in everyday words",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get number input. Step 2: If number is greater than 100, display Greater than 100, else display Not greater than 100."
        },
        {
          input: "step 1 : Get number input",
          hint: "Great! You got Step 1. Now for Step 2: What condition tests if the number is greater than 100, and what should be displayed?"
        },
        {
          input: "step 2 : If number is greater than 100, display Greater than 100, else display Not greater than 100",
          hint: "Kudos! Complete step-by-step algorithm in clear everyday words. Proceed to Ingredients stage!"
        },
        {
          input: "if that number is lesser than 100 it is called as the greatest",
          hint: "Wait a moment! A number lesser than 100 (like 10 or 80) cannot be 'the greatest'! For numbers lesser than 100, it should be called 'Not greater than 100' or 'lowest'. Please fix Step 3."
        },
        {
          input: "step 3:if that number is lesser than 100 it is called as the greatest",
          hint: "Take a closer look at Step 3: When a number is lesser than 100, it cannot be called 'the greatest'! It should be 'Not greater than 100' or 'lowest'. Only numbers above 100 are greatest."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable num, and an if-else condition using comparison operator > (L.S: num, Operator: >, R.S: 100)."
        },
        {
          input: "step 1 : num variable",
          hint: "🌟 Coach Maya here! You've got your input variable! Now, how do you write the if-condition to check if your variable is greater than 100 using Left Side (L.S), Operator (>), and Right Side (R.S)?"
        },
        {
          input: "step 1: use n variable",
          hint: "🌟 Coach Maya here! You've got your input variable n! Now, how do you write the if-condition to check if n is greater than 100 using Left Side (L.S: n), Operator (>), and Right Side (R.S: 100)?"
        },
        {
          input: "how to write if condition",
          hint: "🌟 Coach Maya here! In an If condition, we break it down into 3 simple parts:\n• Left Side (L.S) : your variable (like n)\n• Operator : >\n• Right Side (R.S) : 100\nSo in your ingredients, write: Step 2: If condition with L.S: n, Operator: >, R.S: 100."
        },
        {
          input: "i did not know how to write if condition",
          hint: "🌟 Coach Maya here! No worries at all—writing an If condition is easy when we break it down into 3 simple parts:\n• Left Side (L.S): your variable (like n)\n• Operator: > (greater than)\n• Right Side (R.S): 100 (comparison number)\nIn your ingredients worksheet, write: Step 2: If condition with L.S: n, Operator: >, R.S: 100."
        },
        {
          input: "step 2 : If condition with L.S: num, R.S: 100, Operator: >",
          hint: "Hurray! if (num > 100). If true print 'Greater than 100', else print 'Not greater than 100'. Proceed to Sample Code."
        },
        {
          input: "step 2 : If condition with L.S: n, R.S: 100, Operator: >",
          hint: "Hurray! You've got if (n > 100). For Step 3: Inside the if block, write what should print when the condition is true: print(\"Greater than 100\") [or print(\"greatest\")]. Then for Step 4, inside else block: print(\"Not greater than 100\")."
        },
        {
          input: "what is next step",
          hint: "For your NEXT step (Step 3): Inside the if block, write what should print when the condition is true: print(\"Greater than 100\") [or print(\"greatest\")]. Then in Step 4, inside the else block: print(\"Not greater than 100\")."
        },
        {
          input: "what is next step?",
          hint: "For your NEXT step (Step 3): Inside the if block, write what should print when the condition is true: print(\"Greater than 100\") [or print(\"greatest\")]. Then in Step 4, inside the else block: print(\"Not greater than 100\")."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code comparing num with 100.\nExample:\nvar num = 120;\nif (num > 100) {\n  print(\"Greater than 100\");\n} else {\n  print(\"Not greater than 100\");\n}"
        },
        {
          input: "var num = 120; if (num > 100) print(\"Greater than 100\"); else print(\"Not greater than 100\");",
          hint: "You gotcha! Spot on comparison code! You have successfully implemented greater than 100 checking with comparison operator >, proper quotation marks, and clean branching."
        }
      ]
    }
  }
};

// Complete fallback seed data for problem14 (Profit or Loss) matching Firebase RTDB /hints/problem14
const SEED_PROBLEM14_PROFIT_OR_LOSS: FirebaseProblemData = {
  title: "Challenge: Profit or Loss",
  description: "Write a program to determine Profit or Loss based on Cost Price and Selling Price",
  phase: "Phase 1",
  problemBadge: "Problem 14",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to determine Profit or Loss",
      pairs: [
        {
          input: "how to calculate profit or loss with an example of numbers",
          hint: "🌟 Coach Maya here! Take a real-world example with numbers:\n• Suppose Cost Price is 50 and Selling Price is 100. Since Selling Price (100) > Cost Price (50), you made a Profit of 50!\n• But if Cost Price is 100 and Selling Price is 70, Cost Price is greater than Selling Price, so it is a Loss of 30!\n• Rule: If selling price is greater than cost price, it is profit; otherwise if cost price is greater than selling price, it is loss."
        },
        {
          input: "cost price and selling price example with numbers",
          hint: "🌟 Coach Maya here! Let's use numbers:\n• Cost Price = 50, Selling Price = 100 -> Selling Price is greater, so it is Profit!\n• Cost Price = 100, Selling Price = 50 -> Cost Price is greater, so it is Loss!\nWrite your rule with these numbers in your worksheet!"
        },
        {
          input: "how to calculate profit or loss",
          hint: "🌟 Coach Maya here! Let's take a clear example with numbers:\n• Cost Price is 50 and Selling Price is 100: Selling Price > Cost Price, so it is a Profit of 50!\n• Cost Price is 100 and Selling Price is 70: Cost Price > Selling Price, so it is a Loss of 30!\n• In everyday words: If selling price is greater than cost price, it is profit; otherwise if cost price is greater than selling price, it is loss."
        },
        {
          input: "the cost price is 50 and selling price is 100. if selling price is greater than cost price it is profit else loss",
          hint: "Spot on! With Cost Price = 50 and Selling Price = 100, you made a Profit of 50. Your rule (Selling Price > Cost Price is Profit, otherwise Loss) is 100% correct! Proceed to Recipe stage."
        },
        {
          input: "the cost price is 50 and selling price is 100. if cost price is greater than selling price it is loss, otherwise profit",
          hint: "Spot on! With Cost Price = 50 and Selling Price = 100, you made a Profit of 50. Your rule (Cost Price > Selling Price is Loss, otherwise Profit) is 100% correct! Proceed to Recipe stage."
        },
        {
          input: "what if selling price and cost price are equal",
          hint: "If selling price equals cost price (SP == CP), there is No Profit No Loss (Break-even)."
        },
        {
          input: "if selling price is greater than cost price it is profit else loss",
          hint: "Spot on! Selling Price > Cost Price is Profit, otherwise Loss. Proceed to Recipe stage."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm in everyday words",
      pairs: [
        {
          input: "what steps to write",
          hint: "🌟 Coach Maya here! In the Recipe stage, we think like a chef writing step-by-step cooking instructions in plain English (strictly zero coding words!):\n• Step 1: Get the two starting values from the user—cost price and selling price.\n• Step 2: Compare them—if selling price is greater than cost price, display Profit, else display Loss.\nTry typing Step 1 in your worksheet to get started!"
        },
        {
          input: "how to start recipe",
          hint: "🌟 Coach Maya here! Let's start with Step 1: Before our algorithm can decide anything, we need to receive the two transaction prices from the user! Write: 'Step 1: Get cost price and selling price'."
        },
        {
          input: "recipe puriyala",
          hint: "🌟 Coach Maya here! Recipe is just everyday instructions, step-by-step! First, we need to know what the item cost and what it was sold for (Step 1). Then, we compare them: if selling price is higher, announce Profit, else announce Loss (Step 2)!"
        },
        {
          input: "step 1 : Get cost price and selling price",
          hint: "🌟 Coach Maya here! High five! ✋ You nailed Step 1 by getting the cost price and selling price! Now, let's write Step 2: How do we compare selling price with cost price to announce whether it's a Profit or a Loss? Write: 'Step 2: If selling price is greater than cost price, display Profit, else display Loss'."
        },
        {
          input: "step 2 : If selling price is greater than cost price, display Profit, else display Loss",
          hint: "🎉 Outstanding! You have written a crystal-clear, sequential recipe algorithm: Step 1 gets the cost price and selling price, and Step 2 compares them to announce Profit or Loss! You are fully ready for the Ingredients stage—let's go gather our coding tools! 🚀"
        },
        {
          input: "step 2 : If cost price is greater than selling price, display Loss, otherwise display Profit",
          hint: "🎉 Fantastic job! You formulated the decision rule focusing on Loss first, which is 100% logically correct! Proceed to the Ingredients stage to gather our programming tools!"
        },
        {
          input: "step 2 : If selling price is less than cost price, display Loss, otherwise display Profit",
          hint: "🎉 Spot on! Comparing selling price less than cost price for Loss is completely valid and accurate! Proceed to the Ingredients stage!"
        },
        {
          input: "if selling price is greater than cost price display profit else loss",
          hint: "🌟 Coach Maya here! You've got the comparison decision rule! 👏 But remember, before the computer can compare values, it needs to get them from the user first! Add Step 1 first: 'Step 1: Get cost price and selling price'."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "🌟 Coach Maya here! Just like gathering ingredients before cooking, let's gather our 4 coding ingredients for Profit or Loss:\n1. Input variables: cp and sp\n2. Condition: Left Side: sp, Operator: >, Right Side: cp\n3. True message: print(\"Profit\")\n4. False message: print(\"Loss\")\nLet's start with Step 1: Write 'step 1 : cp and sp variables'!"
        },
        {
          input: "how to start ingredients",
          hint: "🌟 Coach Maya here! Let's start with Step 1: To determine Profit or Loss, we need two input variables—one for Cost Price (cp) and one for Selling Price (sp). Write: 'step 1 : cp and sp variables'!"
        },
        {
          input: "ingredients puriyala",
          hint: "🌟 Coach Maya here! In the Ingredients stage, we map our recipe steps to programming tools: variables to store the prices (cp, sp), an if condition comparing them (sp > cp), and print statements wrapped in quotation marks!"
        },
        {
          input: "step 1 : cp and sp variables",
          hint: "🌟 Coach Maya here! Great start! 🎯 You've got your two input variables: cp and sp! Now for Step 2: Let's break down the if condition into 3 simple parts:\n• Left Side (L.S): sp\n• Operator: >\n• Right Side (R.S): cp\nWrite: 'step 2 : If condition with L.S: sp, Operator: >, R.S: cp'!"
        },
        {
          input: "how to write if condition",
          hint: "🌟 Coach Maya here! In an If condition, we break it down into 3 simple parts:\n• Left Side (L.S): sp\n• Operator: >\n• Right Side (R.S): cp\nSo in your ingredients worksheet, write: 'step 2 : If condition with L.S: sp, Operator: >, R.S: cp'!"
        },
        {
          input: "step 2 : If condition with L.S: sp, R.S: cp, Operator: >",
          hint: "🌟 Coach Maya here! Excellent work! 🚀 Variables and condition are ready! Now for Step 3: Inside the 'if' block (when sp > cp is true), what message should print? Remember to wrap your text in quotes: 'step 3 : Inside if block: print(\"Profit\")'!"
        },
        {
          input: "step 2 : If condition with L.S: cp, R.S: sp, Operator: <",
          hint: "🌟 Coach Maya here! Great comparison! Testing cp < sp is mathematically equivalent to sp > cp! Now for Step 3: Inside the 'if' block, what message should print? Write: 'step 3 : Inside if block: print(\"Profit\")'!"
        },
        {
          input: "step 3 : Inside if block: print(\"Profit\")",
          hint: "🌟 Coach Maya here! You're almost at the finish line! 👏 Steps 1, 2, and 3 are locked in! Now for the final ingredient: Step 4! Inside the 'else' block (when the condition is false), what should print? Wrap it in quotes: 'step 4 : Inside else block: print(\"Loss\")'!"
        },
        {
          input: "what is next step",
          hint: "🌟 Coach Maya here! For your next step: Write what should print inside the if block: 'print(\"Profit\")' (Step 3), and inside the else block: 'print(\"Loss\")' (Step 4)!"
        },
        {
          input: "step 4 : Inside else block: print(\"Loss\")",
          hint: "🎉 Hurray! You have identified all 4 programming ingredients: variables cp and sp, if-condition sp > cp, print(\"Profit\"), and print(\"Loss\")! Proceed to Taste the Sample stage to build your working prototype! 🚀"
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "🌟 Coach Maya here! Ready to build our code prototype? Don't worry about syntax—we'll build it line by line together!\nLet's start with Step 1: Declare two test variables with numbers:\nvar cp = 100;\nvar sp = 150;\nType that first line in your code window!"
        },
        {
          input: "where to start",
          hint: "🌟 Coach Maya here! Start by declaring two numbers to test our program: Cost Price (cp = 100) and Selling Price (sp = 150). Try typing: 'var cp = 100; var sp = 150;'!"
        },
        {
          input: "syntax theriyala",
          hint: "🌟 Coach Maya here! No worries at all! Here is the step-by-step structure:\n1. Declare variables: var cp = 100; var sp = 150;\n2. Check condition: if (sp > cp) {\n3. Print profit: print(\"Profit\");\n4. Fallback else: } else {\n5. Print loss: print(\"Loss\"); }"
        },
        {
          input: "var cp = 100; var sp = 150;",
          hint: "🌟 Coach Maya here! Fantastic! You've declared your variables cp = 100 and sp = 150! 👏 Now for Step 2: Write the if statement to test if selling price is greater than cost price: 'if (sp > cp) {'."
        },
        {
          input: "if (sp > cp) { print(\"Profit\"); } else { print(\"Loss\"); }",
          hint: "🌟 Coach Maya here! Great comparison logic! Now declare test variables at the beginning so the program can run: 'var cp = 100; var sp = 150;' at the top!"
        },
        {
          input: "var cp = 100; var sp = 150; if (sp > cp) print(\"Profit\"); else print(\"Loss\");",
          hint: "🎉 Woohoo! You gotcha! Spot on comparison prototype! 🏆 You have successfully implemented Profit or Loss determination with clean variables, proper if (sp > cp) condition, quoted messages, and neat branching! You are an algorithmic champion! 🚀"
        }
      ]
    }
  }
};

// Complete fallback seed data for problem15 (Leap Year or Not) matching Firebase RTDB /hints/problem15
const SEED_PROBLEM15_LEAP_YEAR: FirebaseProblemData = {
  title: "Challenge: Leap Year or Not",
  description: "Write a program to check if a given year is a Leap Year or Not",
  phase: "Phase 1",
  problemBadge: "Problem 15",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to check if a year is a leap year",
      pairs: [
        {
          input: "what is a leap year",
          hint: "A leap year occurs every 4 years and has 366 days. It is divisible by 4 with remainder 0 (year % 4 == 0)."
        },
        {
          input: "how to check if a year is leap year",
          hint: "Divide the year by 4 and check if remainder is 0 using modulo operator (%)."
        },
        {
          input: "if year % 4 == 0 it is leap year",
          hint: "Spot on! year % 4 == 0 -> Leap Year, else -> Not a Leap Year. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get input year. Step 2: Check if year % 4 == 0. Step 3: Print result."
        },
        {
          input: "step 1 : Get input year",
          hint: "Great! Next step?"
        },
        {
          input: "step 2 : If year divided by 4 leaves remainder 0, display Leap Year, else display Not a Leap Year",
          hint: "Kudos! Complete step-by-step algorithm. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable year, and an if-else condition using modulo operator (%) and equality operator (==)."
        },
        {
          input: "step 1 : year variable",
          hint: "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether remainder when year divided by 4 is 0\n• L.S : year % 4\n• R.S : 0\n• Operator : ==\nSo 'if' looks like this: if (year % 4 == 0)."
        },
        {
          input: "step 2 : If condition with L.S: year % 4, R.S: 0, Operator: ==",
          hint: "Hurray! if (year % 4 == 0). If true print 'Leap Year', else print 'Not a Leap Year'. Proceed to Sample Code."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code checking year % 4 == 0.\nExample:\nvar year = 2024;\nif (year % 4 == 0) print(\"Leap Year\");\nelse print(\"Not a Leap Year\");"
        },
        {
          input: "var year = 2024; if (year % 4 == 0) print(\"Leap Year\"); else print(\"Not a Leap Year\");",
          hint: "You gotcha! Perfect modulo check for leap year."
        }
      ]
    }
  }
};

const SEED_PROBLEM16_ADULT_MINOR: FirebaseProblemData = {
  title: "Challenge: Adult or Minor",
  description: "Write a program to check if a person is an Adult or Minor based on their age",
  phase: "Phase 1",
  problemBadge: "Problem 16",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to determine if a person is an Adult or Minor based on age",
      pairs: [
        {
          input: "what is adult or minor",
          hint: "An adult is someone whose age is 18 or older, and a minor is someone whose age is under 18."
        },
        {
          input: "how to check if a person is adult or minor",
          hint: "Check whether the person's age is greater than or equal to 18 (age >= 18). If age >= 18, they are an Adult; otherwise, they are a Minor."
        },
        {
          input: "if age >= 18 then adult",
          hint: "Spot on! If age >= 18 -> Adult, else -> Minor. Proceed to Recipe."
        },
        {
          input: "what is the minimum age to be an adult",
          hint: "The minimum age to be an adult is 18 years old."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get input age. Step 2: Check if age >= 18. Step 3: Display 'Adult' if true, else display 'Minor'."
        },
        {
          input: "step 1 : Get input age",
          hint: "Great start! Now for Step 2: What condition checks if age is 18 or older?"
        },
        {
          input: "step 2 : If age is 18 or older display Adult, else display Minor",
          hint: "Kudos! Clear step-by-step recipe. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming tools needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable age, and an if-else condition using greater-than-or-equal operator (>=) and threshold 18."
        },
        {
          input: "step 1 : age variable",
          hint: "Spot on! How do you write the if condition using Left Side (L.S: age), Operator (>=), and Right Side (R.S: 18)?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we compare Left Side & Right Side around the operator:\n• L.S : age\n• Operator : >=\n• R.S : 18\nSo 'if' looks like: if (age >= 18)."
        },
        {
          input: "step 2 : If condition with L.S: age, Operator: >=, R.S: 18",
          hint: "Hurray! If true print 'Adult', else print 'Minor'. Proceed to Sample Code."
        },
        {
          input: "step 3 : Inside if block: print(\"Adult\")",
          hint: "Great! Now add Step 4: else block and Step 5: Inside else block: print(\"Minor\")."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft code testing age >= 18.\nExample:\nvar age = 20;\nif (age >= 18) {\n  print(\"Adult\");\n} else {\n  print(\"Minor\");\n}"
        },
        {
          input: "var age = 20;\nif (age >= 18) {\n  print(\"Adult\");\n} else {\n  print(\"Minor\");\n}",
          hint: "Bravo! Clean if-else code classifying Adult or Minor."
        }
      ]
    }
  }
};

const SEED_PROBLEM17_DIVISIBLE_BY_5: FirebaseProblemData = {
  title: "Challenge: Divisible by 5 or Not",
  description: "Write a program to check if a given number is divisible by 5 or not",
  phase: "Phase 1",
  problemBadge: "Problem 17",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the mathematical logic to check if a number is divisible by 5",
      pairs: [
        {
          input: "what is divisible by 5",
          hint: "A number is divisible by 5 if dividing it by 5 leaves a remainder of 0 (n % 5 == 0). If the remainder is not 0, it is Not Divisible by 5."
        },
        {
          input: "how to check if a number is divisible by 5",
          hint: "We use the modulo operator (%) to find the remainder: if n % 5 == 0, it is Divisible by 5. For example, 25 % 5 = 0 (Divisible), and 23 % 5 = 3 (Not Divisible)."
        },
        {
          input: "if n % 5 == 0 then divisible by 5",
          hint: "Spot on! That is the exact mathematical rule: n % 5 == 0 means Divisible by 5, and n % 5 != 0 means Not Divisible by 5. Proceed to Stage 2: Recipe!"
        },
        {
          input: "numbers ending in 0 or 5 are divisible",
          hint: "Good conceptual start in words! Now explain it mathematically with an example number: For n = 25, 25 % 5 = 0 -> Divisible by 5. For n = 23, 23 % 5 = 3 != 0 -> Not Divisible by 5."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step by step process to check if a number is divisible by 5",
      pairs: [
        {
          input: "what steps to write",
          hint: "Let's think step by step: Step 1: Get input number n (e.g. 25)."
        },
        {
          input: "step 1 : Get input number",
          hint: "Great! Step 2: Check if dividing the number by 5 leaves a remainder of 0 (n % 5 == 0)."
        },
        {
          input: "step 2 : If remainder is 0 display Divisible by 5, else display Not Divisible by 5",
          hint: "Kudos! You have sequenced the complete 3-step algorithm. Proceed to Stage 3: Ingredients!"
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the variables, operators, and constructs needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "You need an integer variable n, modulo operator %, comparison operator ==, threshold 0, and an if-else structure with print statements."
        },
        {
          input: "step 1 : n variable",
          hint: "Spot on! Step 2: Write the if condition with Left Side (L.S: n % 5), Operator (==), and Right Side (R.S: 0)."
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we compare Left Side & Right Side around the operator:\n• L.S : n % 5\n• Operator : ==\n• R.S : 0\nSo 'if' looks like: if (n % 5 == 0)."
        },
        {
          input: "step 2 : If condition with L.S: n % 5, Operator: ==, R.S: 0",
          hint: "Awesome! Step 3: Inside if block: print(\"Divisible by 5\"). Step 4: else block. Step 5: Inside else block: print(\"Not Divisible by 5\")."
        },
        {
          input: "step 3 : Inside if block: print(\"Divisible by 5\")",
          hint: "Great! Now add Step 4: else block and Step 5: Inside else block: print(\"Not Divisible by 5\")."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Assemble and verify the complete prototype code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft code testing n % 5 == 0.\nExample:\nvar n = 25;\nif (n % 5 == 0) {\n  print(\"Divisible by 5\");\n} else {\n  print(\"Not Divisible by 5\");\n}"
        },
        {
          input: "var n = 25;\nif (n % 5 == 0) {\n  print(\"Divisible by 5\");\n} else {\n  print(\"Not Divisible by 5\");\n}",
          hint: "Bravo! Clean if-else code verifying Divisible by 5 or Not."
        }
      ]
    }
  }
};

const SEED_PROBLEM18_MAXIMUM_OF_TWO: FirebaseProblemData = {
  title: "Challenge: Maximum of Two Numbers",
  description: "Write a program to find the maximum (larger) of two given numbers",
  phase: "Phase 1",
  problemBadge: "Problem 18",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to find the maximum of two numbers",
      pairs: [
        {
          input: "how to find maximum of two numbers",
          hint: "Compare number a and number b using the greater-than operator (>)."
        },
        {
          input: "if a > b then a is maximum else b is maximum",
          hint: "Spot on! If a > b, a is greater; else b is greater. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get two numbers a and b. Step 2: Compare a and b. Step 3: Print result."
        },
        {
          input: "step 1 : Get two numbers a and b",
          hint: "Great! How do you compare them?"
        },
        {
          input: "step 2 : If a is greater than b, display a is Maximum, else display b is Maximum",
          hint: "Kudos! Complete step-by-step logic. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variables a and b, and an if-else condition using comparison operator >."
        },
        {
          input: "step 1 : a and b for input variables",
          hint: "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether a is greater than b\n• L.S : a\n• R.S : b\n• Operator : >\nSo 'if' looks like this: if (a > b)."
        },
        {
          input: "step 2 : If condition with L.S: a, R.S: b, Operator: >",
          hint: "Hurray! if (a > b) prints a, else prints b. Proceed to Sample Code."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code comparing a and b.\nExample:\nvar a = 10, b = 25;\nif (a > b) print(\"a is max\");\nelse print(\"b is max\");"
        },
        {
          input: "var a = 10, b = 25; if (a > b) print(\"a is max\"); else print(\"b is max\");",
          hint: "You gotcha! Perfect comparison logic."
        }
      ]
    }
  }
};

const SEED_PROBLEM19_SENIOR_CITIZEN: FirebaseProblemData = {
  title: "Challenge: Senior Citizen or Not",
  description: "Write a program to check if a person is a Senior Citizen based on their age (age >= 60)",
  phase: "Phase 1",
  problemBadge: "Problem 19",
  sections: {
    logic: {
      title: "Logic",
      description: "Explain the logic to check if a person is a Senior Citizen",
      pairs: [
        {
          input: "who is a senior citizen",
          hint: "A person aged 60 or above (age >= 60) is considered a Senior Citizen."
        },
        {
          input: "how to check senior citizen",
          hint: "Compare age with 60 using comparison operator >=."
        },
        {
          input: "if age >= 60 senior citizen",
          hint: "Spot on! If age >= 60 -> Senior Citizen, else -> Not Senior Citizen. Proceed to Recipe."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Write the step-by-step algorithm",
      pairs: [
        {
          input: "what steps to write",
          hint: "Step 1: Get age input. Step 2: Check if age >= 60. Step 3: Print result."
        },
        {
          input: "step 1 : Get age input",
          hint: "Great! Next step?"
        },
        {
          input: "step 2 : If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen",
          hint: "Kudos! Complete step-by-step algorithm. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable age, and an if-else condition using comparison operator >=."
        },
        {
          input: "step 1 : age variable",
          hint: "Spot on! How do you write the if condition using Left Side (L.S), Right Side (R.S), and Operator?"
        },
        {
          input: "how to write if condition",
          hint: "In an If condition, we have two sides: Left Side (L.S) & Right Side (R.S) around the operator.\nEx: Check whether age is 60 or above\n• L.S : age\n• R.S : 60\n• Operator : >=\nSo 'if' looks like this: if (age >= 60)."
        },
        {
          input: "step 2 : If condition with L.S: age, R.S: 60, Operator: >=",
          hint: "Hurray! if (age >= 60). If true print 'Senior Citizen', else print 'Not Senior Citizen'. Proceed to Sample Code."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code comparing age with 60.\nExample:\nvar age = 65;\nif (age >= 60) print(\"Senior Citizen\");\nelse print(\"Not Senior Citizen\");"
        },
        {
          input: "var age = 65; if (age >= 60) print(\"Senior Citizen\"); else print(\"Not Senior Citizen\");",
          hint: "You gotcha! Clean condition."
        }
      ]
    }
  }
};

const SEED_PROBLEM20_VOWEL_OR_CONSONANT: FirebaseProblemData = {
  title: "Challenge: Vowel or Consonant",
  description: "Write a program to check whether a given alphabet character is a Vowel or a Consonant",
  phase: "Phase 1",
  problemBadge: "Problem 20",
  sections: {
    logic: {
      title: "Logic",
      description: "Define the logic for checking vowel or consonant",
      pairs: [
        {
          input: "how to check vowel or consonant",
          hint: "The English alphabet has 5 vowels: a, e, i, o, u. All other 21 letters are consonants. Check if the given letter is equal to any of the 5 vowels."
        },
        {
          input: "if character is a, e, i, o, or u then vowel else consonant",
          hint: "Spot on! If the letter is equal to 'a', 'e', 'i', 'o', or 'u', it is a Vowel; otherwise, it is a Consonant. Proceed to Recipe."
        },
        {
          input: "what are vowels",
          hint: "Vowels are the letters a, e, i, o, and u. Any other alphabet letter is a consonant."
        }
      ]
    },
    recipe: {
      title: "Recipe",
      description: "Step-by-step plain English instructions",
      pairs: [
        {
          input: "what steps to write in recipe",
          hint: "Step 1: Get character ch from user.\nStep 2: Check if ch is equal to 'a', 'e', 'i', 'o', or 'u'.\nStep 3: If true display Vowel, else display Consonant."
        },
        {
          input: "step 1 : Get character ch",
          hint: "Great! How do you check if ch is one of the vowels?"
        },
        {
          input: "step 2 : If ch is equal to a, e, i, o, or u, display Vowel, else display Consonant",
          hint: "Kudos! Clear algorithmic sequence without code words. Proceed to Ingredients."
        }
      ]
    },
    ingredients: {
      title: "Ingredients",
      description: "Identify the programming concepts needed",
      pairs: [
        {
          input: "what ingredients do we need",
          hint: "Input variable ch, comparison equality operator == and logical OR operator ||, if-else construct, and print statements for \"Vowel\" and \"Consonant\"."
        },
        {
          input: "step 1 : ch variable",
          hint: "Spot on! How do you write the if condition comparing ch with vowels using Left Side, Right Side, and Operator?"
        },
        {
          input: "step 2 : If condition with L.S: ch, R.S: 'a'||'e'||'i'||'o'||'u', Operator: ==",
          hint: "Hurray! If condition checks all vowels using logical OR. Add print statements and else block."
        },
        {
          input: "step 3 : Inside if block: print(\"Vowel\")",
          hint: "Great! Now add Step 4 for fallback else and Step 5 for print(\"Consonant\")."
        }
      ]
    },
    samplecode: {
      title: "Sample Code",
      description: "Draft the sample code",
      pairs: [
        {
          input: "how to write sample code",
          hint: "Draft the code checking vowels.\nExample:\nvar ch = 'a';\nif (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {\n  print(\"Vowel\");\n} else {\n  print(\"Consonant\");\n}"
        },
        {
          input: "var ch = 'a'; if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') print(\"Vowel\"); else print(\"Consonant\");",
          hint: "You gotcha! Perfect vowel-consonant comparison code."
        }
      ]
    }
  }
};

export class FirebaseHintService {
  private cache: Map<string, FirebaseSectionData> = new Map();
  private firebaseBaseUrl = 'https://cookdcode-4ce23-default-rtdb.firebaseio.com';

  /**
   * Resolves problem ID string (e.g. 'odd-even') to Firebase document/node (e.g. 'problem01')
   */
  public resolveProblemId(problemId: string): string {
    const norm = (problemId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (norm.includes('senior') || norm.includes('citizen') || norm.startsWith('problem19') || norm === 'problem19' || norm === 'problem019') {
      return 'problem19';
    }
    if (norm.includes('vowel') || norm.includes('consonant') || norm.startsWith('problem20') || norm === 'problem20' || norm === 'problem020') {
      return 'problem20';
    }
    if (norm.includes('maximumoftwo') || norm.includes('maxoftwo') || norm.includes('maximumtwo') || norm.includes('maxtwo') || norm.startsWith('problem18') || norm === 'problem18' || norm === 'problem018' || (norm.includes('maximum') && norm.includes('two'))) {
      return 'problem18';
    }
    if (norm.includes('divisibleby5') || norm.includes('divisible5') || (norm.includes('divisible') && (norm.includes('5') || norm.includes('five'))) || norm.startsWith('problem17') || norm === 'problem17' || norm === 'problem017') {
      return 'problem17';
    }
    if (norm.includes('adult') || norm.includes('minor') || norm.startsWith('problem16') || norm === 'problem16' || norm === 'problem016') {
      return 'problem16';
    }
    if (norm.includes('leap') || norm.startsWith('problem15') || norm === 'problem15' || norm === 'problem015') {
      return 'problem15';
    }
    if (norm.includes('profit') || norm.includes('loss') || norm.startsWith('problem14') || norm === 'problem14' || norm === 'problem014') {
      return 'problem14';
    }
    if (norm.includes('greaterthan100') || norm.includes('greater100') || (norm.includes('100') && (norm.includes('greater') || norm.includes('number'))) || norm.startsWith('problem13') || norm === 'problem13' || norm === 'problem013') {
      return 'problem13';
    }
    if (norm.includes('pass') || norm.includes('fail') || (norm.includes('mark') && !norm.includes('table')) || norm.startsWith('problem12') || norm === 'problem12' || norm === 'problem012') {
      return 'problem12';
    }
    if (norm.includes('voting') || norm.includes('vote') || norm.includes('eligible') || norm.startsWith('problem11') || norm === 'problem11' || norm === 'problem011') {
      return 'problem11';
    }
    if (norm.includes('threedigit') || norm.includes('3digit') || norm.startsWith('problem10') || norm === 'problem10' || norm === 'problem010') {
      return 'problem10';
    }
    if (norm.includes('positive') || norm.includes('negative') || norm.startsWith('problem09') || norm === 'problem9') {
      return 'problem09';
    }
    if (norm.includes('sexy') || norm.startsWith('problem08') || norm === 'problem8') {
      return 'problem08';
    }
    if ((norm.includes('prime') && (norm.includes('range') || norm.includes('between'))) || norm.startsWith('problem07') || norm === 'problem7') {
      return 'problem07';
    }
    if (norm.includes('nextprime') || (norm.includes('next') && norm.includes('prime')) || norm.startsWith('problem06') || norm === 'problem6') {
      return 'problem06';
    }
    if (norm.includes('odd') || norm.includes('even') || norm.startsWith('problem01') || norm === 'problem1') {
      return 'problem01';
    }
    if (norm.includes('sum') || norm.includes('natural') || norm.startsWith('problem02') || norm === 'problem2') {
      return 'problem02';
    }
    if (norm.includes('factorial') || norm.startsWith('problem03') || norm === 'problem3') {
      return 'problem03';
    }
    if (norm.includes('divisor') || norm.startsWith('problem04') || norm === 'problem4') {
      return 'problem04';
    }
    if (norm.includes('multiplication') || norm.includes('table')) {
      return 'problem05';
    }
    if (norm.includes('prime') || norm.startsWith('problem05') || norm === 'problem5') {
      return 'problem05';
    }
    return problemId;
  }

  /**
   * Normalizes text for matching
   */
  public normalizeText(text: string): string {
    return (text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s%+\-=*×]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Fetches section data from Firebase RTDB (with local cache and seed fallback)
   */
  public async getSectionData(problemId: string, section: CTCStage): Promise<FirebaseSectionData | null> {
    const firebaseId = this.resolveProblemId(problemId);
    const cacheKey = `${firebaseId}::${section}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // 1. Try URL pattern used for problem01 (/hints/${id}/sections/${section}.json)
      let url = `${this.firebaseBaseUrl}/hints/${encodeURIComponent(firebaseId)}/sections/${encodeURIComponent(section)}.json`;
      let res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      let data: any = null;
      if (res.ok) {
        data = await res.json();
      }

      // 2. If not found or empty, try direct section pattern (/hints/${id}/${section}.json)
      if (!data || Object.keys(data).length === 0) {
        url = `${this.firebaseBaseUrl}/hints/${encodeURIComponent(firebaseId)}/${encodeURIComponent(section)}.json`;
        res = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          data = await res.json();
        }
      }

      if (data && typeof data === 'object') {
        // Normalize if keywords map exists instead of pairs array
        if ((!data.pairs || data.pairs.length === 0) && data.keywords) {
          const pairs: FirebaseHintPair[] = [];
          for (const [key, val] of Object.entries(data.keywords)) {
            pairs.push({
              input: key,
              hint: typeof val === 'string' ? val : JSON.stringify(val)
            });
          }
          data.pairs = pairs;
        }

        if (data.pairs && data.pairs.length > 0) {
          this.cache.set(cacheKey, data as FirebaseSectionData);
          return data as FirebaseSectionData;
        }
      }
    } catch (err: any) {
      console.warn(`[FirebaseHintService] Fetch failed for ${cacheKey}, using seed fallback:`, err?.message || err);
    }

    // Fallback to embedded seed data for problem01
    if (firebaseId === 'problem01' && SEED_PROBLEM01.sections?.[section]) {
      const fallback = SEED_PROBLEM01.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem02 (Sum of N Numbers)
    if (firebaseId === 'problem02' && SEED_PROBLEM02.sections?.[section]) {
      const fallback = SEED_PROBLEM02.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem03 (Factorial of a Number)
    if (firebaseId === 'problem03' && SEED_PROBLEM03.sections?.[section]) {
      const fallback = SEED_PROBLEM03.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem04 (Divisors of a Number)
    if (firebaseId === 'problem04' && SEED_PROBLEM04.sections?.[section]) {
      const fallback = SEED_PROBLEM04.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem05 (Multiplication Table of a Number)
    if (firebaseId === 'problem05' && SEED_PROBLEM05.sections?.[section]) {
      const fallback = SEED_PROBLEM05.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem19 (Senior Citizen or Not)
    if ((firebaseId === 'problem19' || problemId === 'senior-citizen' || problemId === 'senior' || problemId === 'seniorcitizen') && SEED_PROBLEM19_SENIOR_CITIZEN.sections?.[section]) {
      const fallback = SEED_PROBLEM19_SENIOR_CITIZEN.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem20 (Vowel or Consonant)
    if ((firebaseId === 'problem20' || problemId === 'vowel-or-consonant' || problemId === 'vowels-and-consonants') && SEED_PROBLEM20_VOWEL_OR_CONSONANT.sections?.[section]) {
      const fallback = SEED_PROBLEM20_VOWEL_OR_CONSONANT.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem18 (Maximum of Two Numbers)
    if ((firebaseId === 'problem18' || problemId === 'maximum-of-two' || problemId === 'maximum-of-two-numbers' || problemId === 'max-of-two' || problemId === 'maxoftwo') && SEED_PROBLEM18_MAXIMUM_OF_TWO.sections?.[section]) {
      const fallback = SEED_PROBLEM18_MAXIMUM_OF_TWO.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem17 (Divisible by 5 or Not)
    if ((firebaseId === 'problem17' || problemId === 'divisible-by-5' || problemId === 'divisible-by-5-or-not' || problemId === 'divisible5') && SEED_PROBLEM17_DIVISIBLE_BY_5.sections?.[section]) {
      const fallback = SEED_PROBLEM17_DIVISIBLE_BY_5.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem16 (Adult or Minor)
    if ((firebaseId === 'problem16' || problemId === 'adult-or-minor' || problemId === 'adult' || problemId === 'minor') && SEED_PROBLEM16_ADULT_MINOR.sections?.[section]) {
      const fallback = SEED_PROBLEM16_ADULT_MINOR.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem15 (Leap Year or Not)
    if ((firebaseId === 'problem15' || problemId === 'leap-year' || problemId === 'leap') && SEED_PROBLEM15_LEAP_YEAR.sections?.[section]) {
      const fallback = SEED_PROBLEM15_LEAP_YEAR.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem14 (Profit or Loss)
    if ((firebaseId === 'problem14' || problemId === 'profit-or-loss' || problemId === 'profit-loss') && SEED_PROBLEM14_PROFIT_OR_LOSS.sections?.[section]) {
      const fallback = SEED_PROBLEM14_PROFIT_OR_LOSS.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem13 (Number is Greater than 100 or Not)
    if ((firebaseId === 'problem13' || problemId === 'greater-than-100' || problemId === 'greater-100') && SEED_PROBLEM13_GREATER_100.sections?.[section]) {
      const fallback = SEED_PROBLEM13_GREATER_100.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem12 (Pass or Fail Based on Mark)
    if ((firebaseId === 'problem12' || problemId === 'pass-or-fail' || problemId === 'pass-fail') && SEED_PROBLEM12_PASS_FAIL.sections?.[section]) {
      const fallback = SEED_PROBLEM12_PASS_FAIL.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem11 (Eligible or Not Eligible to Vote)
    if ((firebaseId === 'problem11' || problemId === 'voting-eligibility' || problemId === 'eligible-vote') && SEED_PROBLEM11_VOTING.sections?.[section]) {
      const fallback = SEED_PROBLEM11_VOTING.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem10 (Number is 3-Digit or Not)
    if ((firebaseId === 'problem10' || problemId === 'three-digit-number' || problemId === '3-digit-number') && SEED_PROBLEM10_THREE_DIGIT.sections?.[section]) {
      const fallback = SEED_PROBLEM10_THREE_DIGIT.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem09 (Positive or Negative Number)
    if ((firebaseId === 'problem09' || problemId === 'positive-negative' || problemId === 'positive-or-negative') && SEED_PROBLEM09_POSITIVE_NEGATIVE.sections?.[section]) {
      const fallback = SEED_PROBLEM09_POSITIVE_NEGATIVE.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem08 (Sexy Prime Numbers)
    if ((firebaseId === 'problem08' || problemId === 'sexy-prime' || problemId === 'sexy-prime-number') && SEED_PROBLEM08_SEXY_PRIME.sections?.[section]) {
      const fallback = SEED_PROBLEM08_SEXY_PRIME.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem07 (Prime Numbers in a Given Range)
    if ((firebaseId === 'problem07' || problemId === 'prime-between-range') && SEED_PROBLEM07.sections?.[section]) {
      const fallback = SEED_PROBLEM07.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem06 (Next Prime Number)
    if ((firebaseId === 'problem06' || problemId === 'next-prime-number') && SEED_PROBLEM06_NEXT_PRIME.sections?.[section]) {
      const fallback = SEED_PROBLEM06_NEXT_PRIME.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to embedded seed data for problem06 (Prime Number Checker)
    if (firebaseId === 'problem06' && SEED_PROBLEM06.sections?.[section]) {
      const fallback = SEED_PROBLEM06.sections[section]!;
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    // Fallback to SEED_FIREBASE_HINTS for other problems
    const matchingSeedHints = SEED_FIREBASE_HINTS.filter(
      h => (h.programId === problemId || this.resolveProblemId(h.programId) === firebaseId) && h.section === section
    );
    if (matchingSeedHints.length > 0) {
      const fallback: FirebaseSectionData = {
        title: section.toUpperCase(),
        pairs: matchingSeedHints.map(h => ({
          input: h.studentInput,
          hint: h.hint
        }))
      };
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    return null;
  }

  /**
   * Finds the best matching pair from Firebase pairs for student input
   */
  public async findBestMatchingPair(
    problemId: string,
    section: CTCStage,
    userInput: string
  ): Promise<MatchedPairResult> {
    const sectionData = await this.getSectionData(problemId, section);
    const pairs: FirebaseHintPair[] = sectionData?.pairs || [];

    if (pairs.length === 0) {
      return {
        matched: false,
        allPairs: [],
        sectionDescription: sectionData?.description,
        sectionTitle: sectionData?.title,
        score: 0
      };
    }

    const normUser = this.normalizeText(userInput);
    if (!normUser) {
      return {
        matched: true,
        bestPair: pairs[0],
        allPairs: pairs,
        sectionDescription: sectionData?.description,
        sectionTitle: sectionData?.title,
        score: 10
      };
    }

    // Determine problem type to prevent any cross-problem hint pollution
    const problemType = detectProblemType(problemId);
    const isOddEven = problemType === 'odd-even';
    const isSumN = problemType === 'sum-natural-numbers';
    const isFactorial = problemType === 'factorial';
    const isDivisor = problemType === 'divisor-of-a-number';
    const isMultiplication = problemType === 'multiplication-table';
    const isPrime = problemType === 'prime-number';
    const isNextPrime = problemType === 'next-prime-number';
    const isPrimeRange = problemType === 'prime-between-range';
    const isSexyPrime = problemType === 'sexy-prime-number';
    const isPositiveNegative = problemType === 'positive-negative';
    const isThreeDigit = problemType === 'three-digit-number';
    const isVotingEligibility = problemType === 'voting-eligibility';
    const isDivisibleBy5 = problemType === 'divisible-by-5';
    const isSeniorCitizen = problemType === 'senior-citizen';

    // Helper: is single token valid (including digits 0-9 and %)
    const isToken = (w: string) => w.length > 1 || /\d/.test(w) || w === '%';

    const isPureConfusion =
      normUser === 'i don t know' ||
      normUser === 'i dont know' ||
      normUser === 'dont know' ||
      normUser === 'don t know' ||
      normUser === 'puriyala' ||
      normUser === 'theriyala' ||
      normUser === 'enakku theriyala' ||
      normUser === 'what to do' ||
      normUser === 'where to start' ||
      normUser.includes('what should i do') ||
      normUser.includes('what to do here') ||
      normUser.includes('what i do here') ||
      normUser.includes('where to start') ||
      normUser.includes('how to start') ||
      normUser.includes('puriyala') ||
      normUser.includes('theriyala') ||
      normUser.includes('enna pannanum');

    // =========================================================================
    // BRANCH 1: ODD OR EVEN CHECKER (problem01)
    // =========================================================================
    if (isOddEven) {
      const oddEvenVal = validateOddEvenClassification(userInput);
      const hasNumbers = /\d/.test(normUser);
      const hasOddAndEven = normUser.includes('odd') && normUser.includes('even');
      const clean = userInput.replace(/\s+/g, '');

      const evenMath =
        /%\s*2\s*(=|==)\s*0/.test(normUser) ||
        /([02468]|\b[0-9]*[02468]\b)\s*%\s*2\s*(=|==)\s*0/.test(clean) ||
        /(remainder|rem)\s*(is|=|:)?\s*0/.test(normUser) ||
        /0\s*(is|=|means)\s*(an?\s*)?even/.test(normUser) ||
        /even\s*.*(remainder|rem)\s*(is|=|:)?\s*0/.test(normUser) ||
        /divisible\s*by\s*2\s*(and|with)?\s*remainder\s*0/.test(normUser);

      const oddMath =
        /%\s*2\s*(=|==)\s*1/.test(normUser) ||
        /%\s*2\s*(!=|!==)\s*0/.test(normUser) ||
        /([13579]|\b[0-9]*[13579]\b)\s*%\s*2\s*(=|==)\s*1/.test(clean) ||
        /(remainder|rem)\s*(is|=|:)?\s*1/.test(normUser) ||
        /(remainder|rem)\s*(is|=|:)?\s*(not\s*0|non\s*zero)/.test(normUser) ||
        /1\s*(is|=|means)\s*(an?\s*)?odd/.test(normUser) ||
        /odd\s*.*(remainder|rem)\s*(is|=|:)?\s*1/.test(normUser) ||
        /not\s*divisible\s*by\s*2/.test(normUser);

      const hasBothMathLogic = evenMath && oddMath;
      const hasAnyMathLogic =
        evenMath ||
        oddMath ||
        normUser.includes('%') ||
        normUser.includes('modulo') ||
        normUser.includes('remainder') ||
        normUser.includes('rem');

      if (section === 'logic') {
        if (hasBothMathLogic) {
          const successPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.input.toLowerCase().includes('remainder as 0')) || pairs[pairs.length - 1];
          if (successPair) {
            return {
              matched: true,
              bestPair: {
                input: successPair.input,
                hint: "Fantastic, that's right! When divided by 2, remainder 0 is even and remainder 1 is odd. The modulo operator (%) gives the remainder. You've completed the mathematical logic—proceed to the Recipe stage!"
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 99
            };
          }
        }

        const isNumberListProvided = oddEvenVal.hasList || (hasNumbers && (hasOddAndEven || normUser.includes('numbers')));

        if (isPureConfusion && !isNumberListProvided && !hasAnyMathLogic) {
          const dontKnowPair = pairs.find(p => {
            const n = this.normalizeText(p.input);
            return n.includes('dont know') || n.includes('don t know') || n.includes('know');
          }) || pairs[1];
          if (dontKnowPair) {
            return {
              matched: true,
              bestPair: dontKnowPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }

        if (isNumberListProvided) {
          if (oddEvenVal.hasList && !oddEvenVal.isCorrect) {
            return {
              matched: true,
              bestPair: {
                input: userInput,
                hint: oddEvenVal.feedback || "Take another close look at your numbers! Even numbers can be split into 2 equal parts (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...). Can you check which numbers are odd and which are even?"
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }

          if (!hasAnyMathLogic) {
            const listPair = pairs.find(p => {
              const n = this.normalizeText(p.input);
              return n.includes('odd numbers: 1, 3, 5') || n.includes('1, 3, 5') || (n.includes('odd') && n.includes('even') && /\d/.test(n));
            }) || pairs[3];
            if (listPair) {
              return {
                matched: true,
                bestPair: {
                  input: listPair.input,
                  hint: "You've done a wonderful job identifying these examples! To help the computer test any number, look at the even numbers (2, 4, 6...). Which multiplication table do they all belong to? What arithmetic operation (+,-,*,/) could you use to test if a number fits into that pattern?"
                },
                allPairs: pairs,
                sectionDescription: sectionData?.description,
                sectionTitle: sectionData?.title,
                score: 98
              };
            }
          }
        }

        if (!hasAnyMathLogic && (normUser.includes('2 table') || normUser.includes('table of 2') || (normUser.includes('table') && normUser.includes('2')))) {
          const tablePair = pairs.find(p => p.input.toLowerCase().includes('2 table') || p.input.toLowerCase().includes('table')) || pairs[4];
          if (tablePair) {
            return {
              matched: true,
              bestPair: {
                input: tablePair.input,
                hint: "Yes you are right! Even numbers belong to the 2 table. But how will a computer check if a number comes in the 2 table? What basic arithmetic operation (+,-,*,/) tests if a number fits into the 2 table?"
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }

        if (normUser.includes('multipl')) {
          const multiplyPair = pairs.find(p => p.input.toLowerCase().includes('multiply')) || pairs[5];
          if (multiplyPair) {
            return {
              matched: true,
              bestPair: {
                input: multiplyPair.input,
                hint: "Multiplication makes numbers larger (e.g. 8 * 2 = 16 doesn't test 8). Which arithmetic operation (+,-,*,/) splits a number down to test if it fits into equal groups of 2?"
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }

        if (normUser.includes('divid') || normUser.includes('divis')) {
          const dividePair = pairs.find(p => p.input.toLowerCase().includes('dividing') || p.input.toLowerCase().includes('divide')) || pairs[6];
          if (dividePair) {
            return {
              matched: true,
              bestPair: {
                input: dividePair.input,
                hint: "When you divide a number by 2 you will only get quotient. Which operator should we use to get the remainder instead?"
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }

        if (normUser.includes('%') || normUser.includes('modulo') || (normUser.includes('remainder') && !hasBothMathLogic)) {
          const moduloPair = pairs.find(p => p.input.toLowerCase().includes('what is modulo') || p.input.toLowerCase().includes('modulo') || p.input.toLowerCase().includes('remainder 0')) || pairs[10];
          if (moduloPair) {
            return {
              matched: true,
              bestPair: {
                input: moduloPair.input,
                hint: "You've successfully identified dividing by 2 and using the modulo operator (%)! To use it: when a computer divides a number by 2 using % (e.g. number % 2), it calculates the leftover remainder. If the remainder is 0 (like 4 % 2 = 0), the number is Even. If the remainder is 1 (like 5 % 2 = 1), the number is Odd."
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }
      }

      if (section === 'recipe') {
        if (isPureConfusion) {
          const recipeStartPair = pairs[0];
          if (recipeStartPair) {
            return {
              matched: true,
              bestPair: recipeStartPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 98
            };
          }
        }
      }
    }

    // =========================================================================
    // BRANCH 2: SUM OF N NATURAL NUMBERS (problem02)
    // =========================================================================
    if (isSumN) {
      if (section === 'logic') {
        const sumVal = validateSumOfNLogic(userInput);
        const arith = checkSumArithmetic(userInput);

        // 1. Arithmetic error in worksheet equations
        if (arith.hasEquations && !arith.allEquationsValid && arith.invalidEquations.length > 0) {
          const err = arith.invalidEquations[0];
          return {
            matched: true,
            bestPair: {
              input: err.equation,
              hint: `Check your calculation in your worksheet: ${err.equation} is not mathematically correct. ${err.equation.split('=')[0].trim()} equals ${err.expected}, not ${err.actual}! Correct this step so your accumulated total is accurate.`
            },
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }

        // 1b. Target N mismatch or Stated Sum mismatch (e.g. n=3 but sum stated as 10 or added 4)
        if (!sumVal.isCorrect && (sumVal.hasTargetMismatch || sumVal.hasSumMismatch)) {
          return {
            matched: true,
            bestPair: {
              input: userInput,
              hint: sumVal.feedback || "Look closely at your chosen number n and your final sum. For n = 3, the sum of 1 to 3 is 6, not 10. Check that the numbers you add match your test number."
            },
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }

        // 1c. Doubling numbers (1+1=2, 2+2=4) or broken sequential accumulation chain
        if (arith.hasEquations && (arith.isDoubling || !arith.isSequentialAccumulation)) {
          return {
            matched: true,
            bestPair: {
              input: userInput,
              hint: sumVal.feedback || "In each step, carry forward the previous total instead of doubling each number. For n=3: 0+1=1, 1+2=3, 3+3=6."
            },
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }

        // 2. Student summarizes the sequential accumulation logic in words
        const isSummarizingLogic =
          (normUser.includes('start') || normUser.includes('initial')) &&
          (normUser.includes('0') || normUser.includes('zero')) &&
          (normUser.includes('add') || normUser.includes('sum')) &&
          (normUser.includes('number') || normUser.includes('each') || normUser.includes('every') || normUser.includes('1 to n'));
        if (isSummarizingLogic || (sumVal.isCorrect && normUser.includes('summary') || normUser.includes('sequentially add'))) {
          const sumPair = pairs.find(p => p.input.toLowerCase().includes('start sum with 0') || p.hint.toLowerCase().includes('fantastic')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: sumPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 100
          };
        }

        // 3. Sequential accumulation trace (e.g. 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15)
        if (sumVal.isCorrect && sumVal.hasAccumulation) {
          const tracePair = pairs.find(p => p.input.includes('0+1=1') || p.hint.toLowerCase().includes('exactly! we start with total 0')) || {
            input: userInput,
            hint: "Exactly! We start with total 0: step 1: 0 + 1 = 1; step 2: 1 + 2 = 3; step 3: 3 + 3 = 6; step 4: 6 + 4 = 10; step 5: 10 + 5 = 15. How would you summarize this logic in words?"
          };
          return {
            matched: true,
            bestPair: tracePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }

        // 4. Formula shortcut check n*(n+1)/2
        if (sumVal.hasFormula || normUser.includes('formula') || normUser.includes('n*(n+1)/2') || normUser.includes('n * (n + 1) / 2')) {
          const formulaPair = pairs.find(p => p.input.toLowerCase().includes('formula') || p.hint.toLowerCase().includes('formula')) || {
            input: "we can use formula n * (n + 1) / 2",
            hint: "While n * (n + 1) / 2 is a great mathematical formula, in programming we build algorithmic thinking by accumulating numbers one by one using a running total. How does the total grow step by step starting from 0?"
          };
          return {
            matched: true,
            bestPair: formulaPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }

        // 5. User says "what is accumulation"
        if (normUser.includes('accumulation') || normUser.includes('accumulate')) {
          const accPair = pairs.find(p => p.input.toLowerCase().includes('what is accumulation')) || pairs[9];
          if (accPair) {
            return {
              matched: true,
              bestPair: accPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 96
            };
          }
        }

        // 6. User asks "what are natural numbers"
        if (normUser.includes('what are natural numbers') || normUser.includes('what is natural number')) {
          const natPair = pairs.find(p => p.input.toLowerCase().includes('what are natural numbers')) || pairs[2];
          if (natPair) {
            return {
              matched: true,
              bestPair: natPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 96
            };
          }
        }

        // 7. User says "we add 1 to 5 one by one" or asks about adding step by step
        if (normUser.includes('add 1 to 5') || normUser.includes('one by one') || normUser.includes('add one by one')) {
          const addPair = pairs.find(p => p.input.toLowerCase().includes('we add 1 to 5 one by one')) || pairs[8];
          if (addPair) {
            return {
              matched: true,
              bestPair: addPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }

        // 8. User says "we start with 0" or answers starting value 0
        if (normUser === '0' || normUser === 'zero' || normUser.includes('start with 0') || normUser.includes('we start with 0') || normUser.includes('start at 0')) {
          const startZeroPair = pairs.find(p => p.input.toLowerCase().includes('start with 0')) || pairs[6];
          if (startZeroPair) {
            return {
              matched: true,
              bestPair: startZeroPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 96
            };
          }
        }

        // 9. User lists 1, 2, 3, 4, 5
        const isListingNatural =
          (normUser.includes('1') && normUser.includes('2') && normUser.includes('3') && normUser.includes('4') && normUser.includes('5')) ||
          normUser.includes('natural numbers are');
        if (isListingNatural) {
          const listPair = pairs.find(p => p.input.includes('1, 2, 3, 4, 5') || p.input.toLowerCase().includes('natural numbers are')) || pairs[4];
          if (listPair) {
            return {
              matched: true,
              bestPair: listPair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 96
            };
          }
        }

        // 10. Student expresses confusion ("I don't know", "puriyala", "theriyala")
        if (
          normUser.includes('dont know') ||
          normUser.includes('don t know') ||
          normUser.includes('puriyala') ||
          normUser.includes('theriyala')
        ) {
          const dontKnowPair = pairs.find(p => p.input.toLowerCase().includes("don't know") || p.input.toLowerCase().includes("dont know") || p.input.toLowerCase().includes("puriyala")) || pairs[1];
          return {
            matched: true,
            bestPair: dontKnowPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }

        // 11. Initial question ("what should we do to find the sum of n numbers", "where to start")
        if (isPureConfusion || normUser.includes('what should we do') || normUser.includes('where to start')) {
          const startPair = pairs[0];
          return {
            matched: true,
            bestPair: startPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
      }

      if (section === 'recipe') {
        const rec = validateSumOfNRecipe(userInput);
        if (rec.allStepsDone || normUser.includes('step 5') || (normUser.includes('display') && (normUser.includes('sum') || normUser.includes('total'))) || rec.hasStep5) {
          const step5Pair = pairs.find(p => p.input.toLowerCase().includes('step 5')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: step5Pair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 100
          };
        }
        if (normUser.includes('step 4') || (normUser.includes('add') && (normUser.includes('current number') || normUser.includes('sum'))) || rec.hasStep4) {
          const step4Pair = pairs.find(p => p.input.toLowerCase().includes('step 4')) || pairs[4];
          return {
            matched: true,
            bestPair: step4Pair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 3') || normUser.includes('repeat') || normUser.includes('next number') || rec.hasStep3) {
          const step3Pair = pairs.find(p => p.input.toLowerCase().includes('step 3')) || pairs[3];
          return {
            matched: true,
            bestPair: step3Pair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 2') || (normUser.includes('sum') && normUser.includes('0') && (normUser.includes('1') || normUser.includes('current'))) || rec.hasStep2) {
          const step2Pair = pairs.find(p => p.input.toLowerCase().includes('step 2')) || pairs[2];
          return {
            matched: true,
            bestPair: step2Pair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 1') || normUser.includes('input number n') || normUser.includes('get the input') || normUser.includes('get input') || normUser.includes('read input') || normUser.includes('read n') || rec.hasStep1) {
          const step1Pair = pairs.find(p => p.input.toLowerCase().includes('step 1')) || pairs[1];
          return {
            matched: true,
            bestPair: step1Pair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (isPureConfusion || normUser.includes('what should i do') || normUser.includes('where to start') || normUser.includes('how to start') || normUser.includes('how to write')) {
          return {
            matched: true,
            bestPair: pairs[0],
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
      }

      if (section === 'ingredients') {
        const ing = validateSumOfNIngredients(userInput);
        if (ing.hasWrongSumAccumulation || normUser.includes('sum = sum + start') || normUser.includes('sum=sum+start')) {
          const wrongPair = pairs.find(p => p.input.includes('startnum')) || {
            input: "step 5: sum = sum + startnum",
            hint: ing.feedback
          };
          return {
            matched: true,
            bestPair: wrongPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }
        if (ing.allIngredientsDone) {
          const ingDone = pairs.find(p => p.input.toLowerCase().includes('step 5: sum = sum + i') || p.hint.toLowerCase().includes('all 5 ingredients are verified') || p.hint.toLowerCase().includes('all the ingredients ready')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: ingDone,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
        if (ing.hasOperators || normUser.includes('sum = sum + i') || normUser.includes('sum=sum+i') || normUser.includes('sum += i') || normUser.includes('sum+=i')) {
          const ing5 = pairs.find(p => p.input.toLowerCase().includes('step 5: sum = sum + i')) || pairs[5];
          return {
            matched: true,
            bestPair: ing5,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
        if (normUser.includes('step 4') || ing.hasOperators || normUser.includes('addition operator') || normUser.includes('sum = sum + i') || normUser.includes('+=') || normUser.includes('operator')) {
          const ing4 = pairs.find(p => p.input.toLowerCase().includes('step 4')) || pairs[4];
          return {
            matched: true,
            bestPair: ing4,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 3') || ing.hasLoopConstruct || normUser.includes('while loop') || normUser.includes('for loop') || normUser.includes('loop')) {
          const ing3 = pairs.find(p => p.input.toLowerCase().includes('step 3')) || pairs[3];
          return {
            matched: true,
            bestPair: ing3,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 2') || ing.hasAccumulator || normUser.includes('sum = 0') || normUser.includes('accumulator')) {
          const ing2 = pairs.find(p => p.input.toLowerCase().includes('step 2')) || pairs[2];
          return {
            matched: true,
            bestPair: ing2,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (normUser.includes('step 1') || ing.hasInputVar || (normUser.includes('variable') && normUser.includes('n')) || normUser.includes('input n')) {
          const ing1 = pairs.find(p => p.input.toLowerCase().includes('step 1')) || pairs[1];
          return {
            matched: true,
            bestPair: ing1,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 97
          };
        }
        if (isPureConfusion || normUser.includes('what do i do') || normUser.includes('what should i do') || normUser.includes('where to start') || normUser.includes('how to start')) {
          return {
            matched: true,
            bestPair: pairs[0],
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
      }

      if (section === 'samplecode') {
        if (normUser.includes('syntax') || normUser.includes('loop syntax') || normUser.includes('for loop syntax') || normUser.includes('how to write for loop')) {
          const syntaxPair = pairs.find(p => p.input.toLowerCase().includes('syntax')) || pairs[1];
          return {
            matched: true,
            bestPair: syntaxPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 99
          };
        }
        if (normUser.includes('trace') || normUser.includes('n = 5') || normUser.includes('how to trace') || normUser.includes('step by step for n')) {
          const tracePair = pairs.find(p => p.input.toLowerCase().includes('trace')) || pairs[3];
          return {
            matched: true,
            bestPair: tracePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
        if (normUser.includes('for i in range') || normUser.includes('sum_val') || normUser.includes('print(') || normUser.includes('int(input())') || normUser.includes('sum +=') || normUser.includes('sum = 0') || normUser.includes('while')) {
          const codePair = pairs.find(p => p.input.includes('sum_val') || p.hint.toLowerCase().includes('verified')) || pairs[2];
          return {
            matched: true,
            bestPair: codePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
        if (isPureConfusion || normUser.includes('do i need to write') || normUser.includes('where to start') || normUser.includes('how to write') || normUser.includes('what to do')) {
          return {
            matched: true,
            bestPair: pairs[0],
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
      }
    }

    // =========================================================================
    // BRANCH 3: FACTORIAL OF A NUMBER (problem03)
    // =========================================================================
    if (isFactorial) {
      if (isPureConfusion) {
        return {
          matched: true,
          bestPair: pairs[0],
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const factLog = validateFactorialLogic(userInput);
        if (factLog.isFullyVerified) {
          const successPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.input.toLowerCase().includes('start fact with 1')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: successPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 100
          };
        }

        if (factLog.hasAccumulationTrace || factLog.hasMultiplication) {
          const stepPair = pairs.find(p => p.input.toLowerCase().includes('one by one') || p.hint.toLowerCase().includes('start with total product = 1')) || pairs[2] || pairs[1];
          return {
            matched: true,
            bestPair: stepPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }
      }

      if (section === 'recipe') {
        const rec = validateFactorialRecipe(userInput);
        if (rec.isFullyVerified) {
          const donePair = pairs.find(p => p.input.toLowerCase().includes('step 3') || p.hint.toLowerCase().includes('proceed to ingredients')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: donePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 100
          };
        }

        if (rec.hasMultiplyEach) {
          const step21Pair = pairs.find(p => p.input.toLowerCase().includes('step 2.1') || p.hint.toLowerCase().includes('inside the loop')) || pairs[3];
          if (step21Pair) {
            return {
              matched: true,
              bestPair: step21Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }

        if (rec.hasGenerateNumbers) {
          const step2Pair = pairs.find(p => p.input.toLowerCase().includes('step 2 :') || p.hint.toLowerCase().includes('repetitive process')) || pairs[2];
          if (step2Pair) {
            return {
              matched: true,
              bestPair: step2Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 90
            };
          }
        }

        if (rec.hasInput) {
          const step1Pair = pairs.find(p => p.input.toLowerCase().includes('step 1') || p.hint.toLowerCase().includes('next step')) || pairs[1];
          if (step1Pair) {
            return {
              matched: true,
              bestPair: step1Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 85
            };
          }
        }
      }

      if (section === 'ingredients') {
        const ing = validateFactorialIngredients(userInput);
        if (ing.isFullyVerified) {
          const donePair = pairs.find(p => p.input.toLowerCase().includes('step 3') || p.hint.toLowerCase().includes('taste the sample')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: donePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 100
          };
        }

        if (ing.hasMultiplyOperator) {
          const step21Pair = pairs.find(p => p.input.toLowerCase().includes('fact * i') || p.input.toLowerCase().includes('step 2.1')) || pairs[3];
          if (step21Pair) {
            return {
              matched: true,
              bestPair: step21Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }

        if (ing.hasLoopConstruct) {
          const step2Pair = pairs.find(p => p.input.toLowerCase().includes('for loop') || p.input.toLowerCase().includes('step 2')) || pairs[2];
          if (step2Pair) {
            return {
              matched: true,
              bestPair: step2Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 90
            };
          }
        }

        if (ing.hasInputVar || ing.hasFactInitial) {
          const step1Pair = pairs.find(p => p.input.toLowerCase().includes('step 1') || p.hint.toLowerCase().includes('initializing fact to 1')) || pairs[1];
          if (step1Pair) {
            return {
              matched: true,
              bestPair: step1Pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 85
            };
          }
        }
      }

      if (section === 'samplecode') {
        const hasCode = /fact\s*=\s*fact\s*[\*×]\s*i|fact\s*\*=|for\s*\(|range\(/i.test(userInput);
        if (hasCode) {
          const donePair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.input.toLowerCase().includes('fact = fact * i')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: donePair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }
      }
    }

    // =========================================================================
    // BRANCH 4: DIVISORS OF A NUMBER (problem04)
    // =========================================================================
    if (isDivisor) {
      if (isPureConfusion) {
        const isDontKnow =
          normUser.includes("don't know") ||
          normUser.includes("dont know") ||
          normUser.includes("puriyala") ||
          normUser.includes("theriyala") ||
          normUser.includes("no idea");
        const targetPair = isDontKnow
          ? (pairs.find(p => p.input.toLowerCase().includes("don't know")) || pairs[1] || pairs[0])
          : pairs[0];
        return {
          matched: true,
          bestPair: targetPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateDivisorLogic(userInput);
        if (val.isConfusion) {
          const isDontKnow =
            normUser.includes("don't know") ||
            normUser.includes("dont know") ||
            normUser.includes("puriyala") ||
            normUser.includes("theriyala");
          const confPair = isDontKnow
            ? (pairs.find(p => p.input.toLowerCase().includes("don't know")) || pairs[1] || pairs[0])
            : (pairs.find(p => p.input.toLowerCase().includes("what should we do")) || pairs[0]);
          return {
            matched: true,
            bestPair: confPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 98
          };
        }
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('test each number') && p.input.toLowerCase().includes('remainder is 0')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: passPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }
      }

      if (section === 'recipe') {
        const val = validateDivisorRecipe(userInput);
        if (normUser.includes('what should i do') || normUser.includes('what do i do') || normUser.includes('what i do') || normUser.includes('what to do') || normUser.includes('how to start') || normUser.includes('where to start')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('what should i do here')) || pairs[0];
          return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 98 };
        }
        if (normUser.includes('0 up to') || normUser.includes('starting from 0')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('starting from 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('before the given number') || normUser.includes('less than')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('before the given number'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('write down all numbers') || normUser.includes('list all numbers')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('write down all numbers'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('stop the process') || normUser.includes('note down the number and stop')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('stop the process'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 2.2') && p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (val.hasStep21) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 2.1') && p.input.toLowerCase().includes('leaves a remainder of 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
        if (val.hasStep2) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 2') && p.input.toLowerCase().includes('for every number'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
        if (val.hasStep1) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 1'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
      }

      if (section === 'ingredients') {
        const val = validateDivisorIngredients(userInput);
        if (normUser.includes('what do i do') || normUser.includes('what should i do') || normUser.includes('what i do') || normUser.includes('what to do') || normUser.includes('how to start') || normUser.includes('where to start')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('what do i do here')) || pairs[0];
          return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 98 };
        }
        if (normUser.includes('from i = 0') || normUser.includes('start: 0') || normUser.includes('i = 0')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('from i = 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('i < n')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('i < n'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('n % i = 0') || (normUser.includes('%') && normUser.includes('= 0') && !normUser.includes('== 0'))) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('n % i = 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('i % n == 0')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('i % n == 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('n / i == 0')) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('n / i == 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('print(n)') || (normUser.includes('display') && normUser.includes(' n'))) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('print(n)'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 2.2') && p.hint.toLowerCase().includes('awesome')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (val.hasCondition) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 2.1') && p.hint.toLowerCase().includes('hurray'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
        if (val.hasLoop) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 2') && p.hint.toLowerCase().includes('great'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
        if (val.hasInput) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('step 1'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 90 };
        }
      }

      if (section === 'samplecode') {
        const val = validateDivisorSampleCode(userInput);
        if (val.isSyntaxQuery) {
          const pair = pairs.find(p => p.input.toLowerCase().includes('do i need to write'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('i = 0') || normUser.includes('range 0')) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('bug alert: i starts at 0') || p.input.toLowerCase().includes('i = 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (normUser.includes('i < n') || /range\s*\(\s*1\s*,\s*n\s*\)/i.test(userInput)) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('boundary bug: i < n') || p.input.toLowerCase().includes('i < n'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (/n\s*%\s*i\s*=\s*0/i.test(userInput)) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('syntax error: n % i = 0') || p.input.toLowerCase().includes('n % i = 0'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (/print\s*\(\s*n\s*\)/i.test(userInput) || /console\.log\s*\(\s*n\s*\)/i.test(userInput)) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('output bug') || p.input.toLowerCase().includes('print(n)'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (/break/i.test(userInput)) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('logic bug: break') || p.input.toLowerCase().includes('break'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (/if\s*\([^)]+\)\s*\{\s*\}\s*print/i.test(userInput)) {
          const pair = pairs.find(p => p.hint.toLowerCase().includes('indentation bug'));
          if (pair) return { matched: true, bestPair: pair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    if (isMultiplication) {
      if (isPureConfusion) {
        const isDontKnow =
          normUser.includes("don't know") ||
          normUser.includes("dont know") ||
          normUser.includes("puriyala") ||
          normUser.includes("theriyala") ||
          normUser.includes("no idea");
        const targetPair = isDontKnow
          ? (pairs.find(p => p.input.toLowerCase().includes("don't know") || p.input.toLowerCase().includes("puriyala")) || pairs[1] || pairs[0])
          : pairs[0];
        return {
          matched: true,
          bestPair: targetPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateMultiplicationLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('keep the given number fixed') || p.hint.toLowerCase().includes('proceed to recipe')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: passPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }
      }

      if (section === 'recipe') {
        const val = validateMultiplicationRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 2.3') || p.hint.toLowerCase().includes('kudos') || p.hint.toLowerCase().includes('proceed to ingredients')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }

      if (section === 'ingredients') {
        const val = validateMultiplicationIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 2.2') && p.hint.toLowerCase().includes('ready to taste')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }

      if (section === 'samplecode') {
        const val = validateMultiplicationSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('kudos') || p.hint.toLowerCase().includes('congratulations') || p.hint.toLowerCase().includes('mastered')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    if (isPrime) {
      if (isPureConfusion) {
        const isDontKnow =
          normUser.includes("don't know") ||
          normUser.includes("dont know") ||
          normUser.includes("puriyala") ||
          normUser.includes("theriyala") ||
          normUser.includes("no idea");
        const targetPair = isDontKnow
          ? (pairs.find(p => p.input.toLowerCase().includes("don't know") || p.input.toLowerCase().includes("puriyala")) || pairs[1] || pairs[0])
          : pairs[0];
        return {
          matched: true,
          bestPair: targetPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validatePrimeLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('between 2 and n-1') || p.hint.toLowerCase().includes('proceed to recipe')) || pairs[pairs.length - 1];
          return {
            matched: true,
            bestPair: passPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: 95
          };
        }
      }

      if (section === 'recipe') {
        const val = validatePrimeRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 4') || p.hint.toLowerCase().includes('kudos') || p.hint.toLowerCase().includes('proceed to ingredients')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }

      if (section === 'ingredients') {
        const val = validatePrimeIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.input.toLowerCase().includes('step 4') && (p.hint.toLowerCase().includes('ready') || p.hint.toLowerCase().includes('proceed to taste'))) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }

      if (section === 'samplecode') {
        const val = validatePrimeSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normMatch = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => this.normalizeText(p.input).includes(normMatch) || normMatch.includes(this.normalizeText(p.input)));
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('journey')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // Next Prime Number Specific Validator Routing
    if (isNextPrime) {
      if (section === 'logic') {
        const val = validateNextPrimeLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('fantastic')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }

        // Fuzzy token matching across all logic pairs in problem06
        let bestLogicPair = pairs[0];
        let maxScore = -1;
        for (const pair of pairs) {
          const pairTokens = this.normalizeText(pair.input).split(' ').filter(isToken);
          const overlap = pairTokens.filter(t => normUser.includes(t)).length;
          const score = (overlap / Math.max(1, pairTokens.length)) * 100;
          if (score > maxScore) {
            maxScore = score;
            bestLogicPair = pair;
          }
        }
        if (maxScore > 15) {
          return {
            matched: true,
            bestPair: bestLogicPair,
            allPairs: pairs,
            sectionDescription: sectionData?.description,
            sectionTitle: sectionData?.title,
            score: Math.round(maxScore)
          };
        }
      } else if (section === 'recipe') {
        const val = validateNextPrimeRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validateNextPrimeIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('taste the sample') || p.hint.toLowerCase().includes('awesome')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validateNextPrimeSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('journey')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // Prime Numbers in a Given Range (Problem 07) Specific Validator Routing
    if (isPrimeRange) {
      if (section === 'logic') {
        const val = validatePrimeRangeLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('fantastic')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validatePrimeRangeRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validatePrimeRangeIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('taste the sample') || p.hint.toLowerCase().includes('awesome')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validatePrimeRangeSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('journey') || p.hint.toLowerCase().includes('let\'s code')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // Sexy Prime Numbers (Problem 08) Specific Validator & Inheritance Routing
    if (isSexyPrime) {
      // Check if user is asking a general prime number concept question (Modular Inheritance)
      const isPrimeQuestion =
        normUser.includes('what is prime') ||
        normUser.includes('what are prime') ||
        normUser.includes('how to check prime') ||
        normUser.includes('why must the count of divisors be exactly 2') ||
        normUser.includes('why 2 divisors') ||
        normUser.includes('why count is 2') ||
        normUser.includes('how to test prime') ||
        normUser.includes('divisor count') ||
        (normUser.includes('prime') && (normUser.includes('mean') || normUser.includes('definition') || normUser.includes('concept')));

      if (isPrimeQuestion) {
        // Inherit prime logic from base prime problem (Problem 5/6/7)
        return {
          matched: true,
          bestPair: {
            input: userInput,
            hint: "Coach Maya: You already know how to check for prime numbers from Problem 5! A number is prime if it has exactly 2 divisors (1 and itself). In Sexy Primes, apply that exact same prime test to both 'p' and 'p + 6'!"
          },
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateSexyPrimeLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('fantastic')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validateSexyPrimeRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validateSexyPrimeIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('taste the sample') || p.hint.toLowerCase().includes('awesome')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validateSexyPrimeSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('journey') || p.hint.toLowerCase().includes('let\'s code')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // =========================================================================
    // BRANCH: POSITIVE OR NEGATIVE NUMBER (Problem 09)
    // =========================================================================
    if (isPositiveNegative) {
      if (isPureConfusion) {
        const confPair = pairs.find(p => p.input.toLowerCase().includes('what is positive') || p.input.toLowerCase().includes('what ingredients') || p.input.toLowerCase().includes('what steps') || p.input.toLowerCase().includes('how to write')) || pairs[0];
        return {
          matched: true,
          bestPair: confPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validatePositiveNegativeLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('spot on')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validatePositiveNegativeRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validatePositiveNegativeIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to sample code') || p.hint.toLowerCase().includes('hurray')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validatePositiveNegativeSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('clean and correct')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // =========================================================================
    // BRANCH: VOTING ELIGIBILITY (Problem 11)
    // =========================================================================
    if (isVotingEligibility) {
      if (isPureConfusion) {
        const confPair = pairs.find(p => p.input.toLowerCase().includes('what is voting') || p.input.toLowerCase().includes('what ingredients') || p.input.toLowerCase().includes('what steps') || p.input.toLowerCase().includes('how to write')) || pairs[0];
        return {
          matched: true,
          bestPair: confPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateVotingEligibilityLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('spot on')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validateVotingEligibilityRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validateVotingEligibilityIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to sample code') || p.hint.toLowerCase().includes('hurray')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validateVotingEligibilitySampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('you gotcha') || p.hint.toLowerCase().includes('perfect condition')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // =========================================================================
    // BRANCH: DIVISIBLE BY 5 OR NOT (Problem 17)
    // =========================================================================
    if (isDivisibleBy5) {
      if (isPureConfusion) {
        const confPair = pairs.find(p => p.input.toLowerCase().includes('what is divisible') || p.input.toLowerCase().includes('what ingredients') || p.input.toLowerCase().includes('what steps') || p.input.toLowerCase().includes('how to write')) || pairs[0];
        return {
          matched: true,
          bestPair: confPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateDivisibleBy5Logic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to') || p.hint.toLowerCase().includes('spot on') || p.hint.toLowerCase().includes('exact mathematical')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validateDivisibleBy5Recipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validateDivisibleBy5Ingredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to sample code') || p.hint.toLowerCase().includes('awesome')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validateDivisibleBy5SampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('bravo') || p.hint.toLowerCase().includes('you gotcha')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // =========================================================================
    // BRANCH: SENIOR CITIZEN OR NOT (Problem 19)
    // =========================================================================
    if (isSeniorCitizen) {
      if (isPureConfusion) {
        const confPair = pairs.find(p => p.input.toLowerCase().includes('who is') || p.input.toLowerCase().includes('what ingredients') || p.input.toLowerCase().includes('what steps') || p.input.toLowerCase().includes('how to write')) || pairs[0];
        return {
          matched: true,
          bestPair: confPair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 98
        };
      }

      if (section === 'logic') {
        const val = validateSeniorCitizenLogic(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            // If student mentioned a specific age, adapt the hint dynamically
            const allNumbers = Array.from(normUser.matchAll(/\b\d+\b/g)).map(m => parseInt(m[0], 10));
            const userAge = allNumbers.find(n => n !== 60 && n !== 19 && n !== 1 && n !== 2);
            let dynamicHint = pair.hint;
            if (userAge !== undefined) {
              const isSenior = userAge >= 60;
              dynamicHint = `${pair.hint} For your test age ${userAge}: ${userAge} >= 60 is ${isSenior ? 'true (Senior Citizen)' : 'false (Not Senior Citizen)'}.`;
            }
            return {
              matched: true,
              bestPair: {
                input: pair.input,
                hint: dynamicHint
              },
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to recipe') || p.hint.toLowerCase().includes('spot on')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'recipe') {
        const val = validateSeniorCitizenRecipe(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to ingredients') || p.hint.toLowerCase().includes('kudos')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'ingredients') {
        const val = validateSeniorCitizenIngredients(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.isFullyVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('proceed to sample code') || p.hint.toLowerCase().includes('hurray')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      } else if (section === 'samplecode') {
        const val = validateSeniorCitizenSampleCode(userInput);
        if (val.matchedFirebaseInput) {
          const normTarget = this.normalizeText(val.matchedFirebaseInput);
          const pair = pairs.find(p => {
            const normP = this.normalizeText(p.input);
            return normP.includes(normTarget) || normTarget.includes(normP);
          });
          if (pair) {
            return {
              matched: true,
              bestPair: pair,
              allPairs: pairs,
              sectionDescription: sectionData?.description,
              sectionTitle: sectionData?.title,
              score: 95
            };
          }
        }
        if (val.allVerified) {
          const passPair = pairs.find(p => p.hint.toLowerCase().includes('clean condition') || p.hint.toLowerCase().includes('you gotcha')) || pairs[pairs.length - 1];
          return { matched: true, bestPair: passPair, allPairs: pairs, sectionDescription: sectionData?.description, sectionTitle: sectionData?.title, score: 95 };
        }
      }
    }

    // =========================================================================
    // GENERAL / UNIVERSAL PAIR MATCHING (Safe across ALL problems)
    // =========================================================================
    let bestPair = pairs[0];
    let highestScore = -1;
    const userTokens = new Set(normUser.split(' ').filter(isToken));

    for (const pair of pairs) {
      const normCand = this.normalizeText(pair.input);

      // 1. Exact match
      if (normUser === normCand) {
        return {
          matched: true,
          bestPair: pair,
          allPairs: pairs,
          sectionDescription: sectionData?.description,
          sectionTitle: sectionData?.title,
          score: 100
        };
      }

      // 2. Substring match
      if (normUser.includes(normCand) || normCand.includes(normUser)) {
        const score = 85;
        if (score > highestScore) {
          highestScore = score;
          bestPair = pair;
        }
        continue;
      }

      // 3. Token overlap with digits and symbols preserved
      const candTokens = normCand.split(' ').filter(isToken);
      let matchCount = 0;
      for (const t of candTokens) {
        if (userTokens.has(t)) matchCount++;
      }

      const ratio = candTokens.length > 0 ? matchCount / candTokens.length : 0;
      const userRatio = userTokens.size > 0 ? matchCount / userTokens.size : 0;
      const combinedScore = Math.round((ratio * 0.65 + userRatio * 0.35) * 90);

      if (combinedScore > highestScore) {
        highestScore = combinedScore;
        bestPair = pair;
      }
    }

    return {
      matched: highestScore >= 20,
      bestPair: highestScore >= 0 ? bestPair : pairs[0],
      allPairs: pairs,
      sectionDescription: sectionData?.description,
      sectionTitle: sectionData?.title,
      score: Math.max(0, highestScore)
    };
  }

  /**
   * Finds matching hint record for aiMentorPipeline
   */
  public async findMatchingHint(
    programId: string,
    section: CTCStage,
    studentInput: string,
    hintLevel: number = 1
  ): Promise<{ matched: boolean; hint?: any; score?: number }> {
    const pairResult = await this.findBestMatchingPair(programId, section, studentInput);
    if (pairResult.matched && pairResult.bestPair) {
      return {
        matched: true,
        score: pairResult.score,
        hint: {
          id: `hint_${Date.now()}`,
          programId,
          section,
          studentInput: pairResult.bestPair.input,
          hint: pairResult.bestPair.hint,
          hintLevel,
          concept: pairResult.sectionTitle || 'Logic & Algorithm',
          source: 'firebase'
        }
      };
    }
    return { matched: false };
  }

  private generatedHintsHistory: Map<string, any[]> = new Map();

  /**
   * Get all cached hints
   */
  public getAllCachedHints(_programId?: string, _section?: CTCStage): any[] {
    const list: any[] = [];
    for (const [key, sec] of this.cache.entries()) {
      if (sec.pairs) {
        for (const p of sec.pairs) {
          list.push({
            id: key,
            input: p.input,
            hint: p.hint
          });
        }
      }
    }
    for (const [key, history] of this.generatedHintsHistory.entries()) {
      for (const h of history) {
        list.push({
          id: `generated::${key}`,
          input: h.input,
          hint: h.hint
        });
      }
    }
    return list;
  }

  /**
   * Save generated hint into history without polluting curriculum pairs
   */
  public async saveGeneratedHint(
    programId: string,
    section: CTCStage,
    studentInput: string,
    hint: string,
    hintLevel: number = 1,
    concept: string = '',
    source: string = 'llm'
  ): Promise<void> {
    const firebaseId = this.resolveProblemId(programId);
    const cacheKey = `${firebaseId}::${section}`;
    const list = this.generatedHintsHistory.get(cacheKey) || [];
    list.push({
      input: studentInput,
      hint,
      hintLevel,
      concept,
      source,
      timestamp: Date.now()
    });
    this.generatedHintsHistory.set(cacheKey, list);
  }

  /**
   * Clears the memory cache to force reload from Firebase RTDB
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

export const firebaseHintService = new FirebaseHintService();
