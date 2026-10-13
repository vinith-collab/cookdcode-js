import { GoogleGenAI } from "@google/genai";
import { promptBuilder } from "./promptBuilder.js";
let genAIClient = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return genAIClient;
}
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-3.1-pro-preview"
];
const modelCooldownMap = /* @__PURE__ */ new Map();
function isTransientError(err) {
  if (!err) return false;
  const msg = (err.message || "").toLowerCase();
  const status = String(err.status || err.code || "").toLowerCase();
  const raw = typeof err === "object" ? JSON.stringify(err).toLowerCase() : String(err).toLowerCase();
  return status === "unavailable" || status === "503" || msg.includes("503") || msg.includes("high demand") || msg.includes("unavailable") || msg.includes("temporarily") || msg.includes("overloaded") || raw.includes("503") || raw.includes("high demand");
}
function isQuotaError(err) {
  if (!err) return false;
  const msg = (err.message || "").toLowerCase();
  const status = String(err.status || err.code || "").toLowerCase();
  const raw = typeof err === "object" ? JSON.stringify(err).toLowerCase() : String(err).toLowerCase();
  return status === "429" || msg.includes("429") || msg.includes("resource_exhausted") || msg.includes("quota") || msg.includes("rate limit") || raw.includes("429") || raw.includes("resource_exhausted");
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class LLMService {
  async generateHint(context) {
    const ai = getGenAI();
    if (!ai) {
      console.warn("[LLMService] No GEMINI_API_KEY found, invoking pedagogical fallback engine.");
      return this.generateFallbackHint(context);
    }
    const systemInstruction = promptBuilder.buildSystemInstruction(context);
    const userPrompt = promptBuilder.buildUserPrompt(context);
    for (const modelName of CANDIDATE_MODELS) {
      const cooldownUntil = modelCooldownMap.get(modelName) || 0;
      if (cooldownUntil > Date.now()) {
        continue;
      }
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: userPrompt,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              temperature: 0.3
            }
          });
          modelCooldownMap.delete(modelName);
          const rawText = response.text || "";
          if (rawText.trim()) {
            return this.parseLLMResponse(rawText, context);
          }
        } catch (err) {
          if (isQuotaError(err)) {
            const errMsg = err?.message || String(err);
            let cooldownSec = 60;
            const match = errMsg.match(/retry in ([0-9.]+)s/i);
            if (match && match[1]) {
              cooldownSec = Math.ceil(parseFloat(match[1])) + 2;
            }
            modelCooldownMap.set(modelName, Date.now() + cooldownSec * 1e3);
            console.info(`[LLMService Notice] Model ${modelName} rate-limited/quota exceeded (429), cooling down for ${cooldownSec}s. Switching model...`);
            break;
          }
          const transient = isTransientError(err);
          if (transient) {
            console.info(`[LLMService Notice] Model ${modelName} returned busy status (503). Switching model...`);
            modelCooldownMap.set(modelName, Date.now() + 15e3);
            break;
          } else {
            console.warn(`[LLMService Notice] Model ${modelName} encountered error:`, err?.message || err);
            modelCooldownMap.set(modelName, Date.now() + 3e4);
            break;
          }
        }
      }
    }
    console.warn("[LLMService Notice] Gemini models currently experiencing high demand; delivering pedagogical guidance directly.");
    return this.generateFallbackHint(context);
  }
  parseLLMResponse(rawText, context) {
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
      } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
      }
      const parsed = JSON.parse(cleaned);
      return {
        hint: String(parsed.hint || "").trim(),
        hintLevel: Number(parsed.hintLevel) || context.hintLevel,
        concept: String(parsed.concept || context.problem.concept).trim(),
        section: context.section,
        shouldRevealSolution: Boolean(parsed.shouldRevealSolution),
        nextSuggestedAction: parsed.nextSuggestedAction || void 0
      };
    } catch (parseError) {
      console.warn("[LLMService] Failed to parse JSON response directly, recovering text:", rawText);
      return {
        hint: rawText.replace(/[\{\}"]/g, "").replace(/hint:/i, "").trim() || "Focus on breaking the current step into smaller logic parts.",
        hintLevel: context.hintLevel,
        concept: context.problem.concept,
        section: context.section,
        shouldRevealSolution: false
      };
    }
  }
  generateFallbackHint(context) {
    const section = context.section;
    const level = context.hintLevel;
    const isSumProblem = context.programId === "sum-natural-numbers" || context.problem.programName.toLowerCase().includes("sum");
    const isOddEven = context.programId === "odd-even" || context.problem.programName.toLowerCase().includes("odd");
    const isFactorial = context.programId === "factorial" || context.problem.programName.toLowerCase().includes("factorial");
    const isDivisors = context.programId === "problem04" || context.programId === "divisors" || context.problem.programName.toLowerCase().includes("divisor");
    const ws = (context.studentWorksheet || "").toLowerCase();
    const inp = (context.studentInput || "").toLowerCase();
    const prevs = context.previousHints || [];
    const selectUnused = (candidates) => {
      const unused = candidates.filter(
        (c) => !prevs.some((p) => p.trim().toLowerCase() === c.hint.trim().toLowerCase() || p.toLowerCase().includes(c.hint.slice(0, 30).toLowerCase()))
      );
      return unused.length > 0 ? unused[0] : candidates[0];
    };
    if (isFactorial) {
      if (section === "ingredients") {
        if (ws.includes("= 0") || inp.includes("= 0") || ws.includes("=0") || inp.includes("=0")) {
          return {
            hint: "\u{1F31F} Coach Maya here! Notice how your container is set to 0. In Factorial, we are repeatedly multiplying: if we start at 0, multiplying 0 by any number leaves us with 0! What number should we initialize our container to instead so our multiplications work?",
            hintLevel: level,
            concept: "multiplicative identity",
            section: "ingredients",
            shouldRevealSolution: false
          };
        }
        const combinedText = (context.studentInput || "") + "\n" + (context.studentWorksheet || "");
        const normCombined = combinedText.toLowerCase();
        const startM = normCombined.match(/(?:start|from|i\s*=)\s*[:=]?\s*([a-z0-9_]+)/i);
        const stopM = normCombined.match(/(?:stop|end|i\s*<=|i\s*>=)\s*[:=]?\s*([a-z0-9_]+)/i);
        if (startM && stopM && startM[1].toLowerCase() === stopM[1].toLowerCase()) {
          return {
            hint: `\u{1F31F} Coach Maya here! Notice how your loop has Start: ${startM[1]} and Stop: ${stopM[1]}. Because start and stop are the same, the loop won't cycle through your numbers! If counting down from ${startM[1]} with '--', where should the loop stop so it reaches the end of the factorial chain? (Hint: 1)`,
            hintLevel: level,
            concept: "loop boundaries",
            section: "ingredients",
            shouldRevealSolution: false
          };
        }
        const pool = {
          1: [
            {
              hint: "\u{1F31F} Coach Maya here! In Factorial, we need 6 essential programming ingredients: an input variable, a container initialized to 1, a loop construct, loop controls (start, end, next step), our multiplication update, and a print statement outside the loop. Which one shall we add next?",
              hintLevel: 1,
              concept: "programming ingredients",
              section: "ingredients",
              shouldRevealSolution: false
            }
          ],
          2: [
            {
              hint: "\u{1F31F} Coach Maya here! For your container variable, make sure it starts with 1 (`fact = 1`), and for your loop, tell it where to start (1), where to stop (n), and your next step (+1).",
              hintLevel: 2,
              concept: "container and loop controls",
              section: "ingredients",
              shouldRevealSolution: false
            }
          ]
        };
        const candidates = pool[level] || pool[1];
        return selectUnused(candidates);
      }
      if (section === "recipe") {
        return {
          hint: "\u{1F31F} Coach Maya here! Our Factorial recipe has 4 chronological steps: 1) Read input n, 2) Initialize container fact = 1, 3) Multiply each number from 1 to n into fact, and 4) Print the final factorial. Where are you currently?",
          hintLevel: level,
          concept: "factorial algorithm",
          section: "recipe",
          shouldRevealSolution: false
        };
      }
    }
    if (isSumProblem) {
      if (ws.includes("6+4=9") || inp.includes("6+4=9") || ws.includes("6 + 4 = 9")) {
        return {
          hint: "Look closely at step 6 + 4 = 9 in your worksheet: 6 + 4 equals 10, not 9! Because of this calculation error, your final answer became 9 instead of 10. Fix this step to 6 + 4 = 10, and your final output for n = 4 will be 10.",
          hintLevel: level,
          concept: "arithmetic precision",
          section: "logic",
          shouldRevealSolution: false,
          nextSuggestedAction: "Change 6 + 4 = 9 to 6 + 4 = 10 and the final answer to 10."
        };
      }
      if (section === "logic") {
        const pool = {
          1: [
            {
              hint: "Natural numbers start from 1. To sum the first n natural numbers, think about gathering each counting number from 1 up to n into a growing total.",
              hintLevel: 1,
              concept: "accumulating natural numbers",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Consider what happens when n = 4: 1 + 2 + 3 + 4 = 10. How does the total grow step by step?"
            },
            {
              hint: "Think of accumulation like filling a piggy bank: start with 0 coins, on day 1 add 1 coin (total 1), on day 2 add 2 coins (total 3), and keep adding until day n.",
              hintLevel: 1,
              concept: "sequential addition",
              section: "logic",
              shouldRevealSolution: false
            }
          ],
          2: [
            {
              hint: "Notice the pattern: as you step through each count from 1 up to n, you add that number to what you previously collected. What starting value should your total have before adding 1?",
              hintLevel: 2,
              concept: "running total pattern",
              section: "logic",
              shouldRevealSolution: false
            },
            {
              hint: "Every step needs two numbers: the previous total you already gathered on the left, and the next counting number on the right. For example: 0+1=1, then 1+2=3, then 3+3=6.",
              hintLevel: 2,
              concept: "operands in accumulation",
              section: "logic",
              shouldRevealSolution: false
            }
          ],
          3: [
            {
              hint: "Consider stepping through with a small target like 4: first 0 + 1 = 1, then 1 + 2 = 3, then 3 + 3 = 6, and finally 6 + 4 = 10. Notice how each count in sequence is combined into a growing sum.",
              hintLevel: 3,
              concept: "sequential accumulation",
              section: "logic",
              shouldRevealSolution: false
            },
            {
              hint: "Check your operands carefully: the left number is always your previously collected sum, and the right number goes from 1, 2, 3, up to n. Add them accurately at each step to reach the true total.",
              hintLevel: 3,
              concept: "operand tracing",
              section: "logic",
              shouldRevealSolution: false
            }
          ],
          4: [
            {
              hint: "The core logic is sequential accumulation: begin with a total of 0, and repeatedly combine each successive counting number from 1 up through n until all numbers are added.",
              hintLevel: 4,
              concept: "sequential accumulation",
              section: "logic",
              shouldRevealSolution: false
            },
            {
              hint: "Complete mathematical walkthrough for n=4: Step 1: 0+1=1. Step 2: 1+2=3. Step 3: 3+3=6. Step 4: 6+4=10. The final sum of numbers 1 to 4 is 10.",
              hintLevel: 4,
              concept: "complete trace",
              section: "logic",
              shouldRevealSolution: false
            }
          ]
        };
        const candidates = pool[level] || pool[1];
        return selectUnused(candidates);
      }
      if (section === "recipe") {
        const pool = {
          1: [
            {
              hint: "Convert the accumulation logic into chronological steps: 1) Read n from the user, 2) Set up a total starting at 0, 3) Count from 1 to n adding each number to the total.",
              hintLevel: 1,
              concept: "sequential algorithm",
              section: "recipe",
              shouldRevealSolution: false
            },
            {
              hint: "Every recipe has an order: first get the input number n, second prepare your container (sum = 0), third repeat adding numbers 1 to n, and fourth display the result.",
              hintLevel: 1,
              concept: "ordered steps",
              section: "recipe",
              shouldRevealSolution: false
            }
          ],
          2: [
            {
              hint: "Plan your loop boundaries: what is the very first number you add (1) and what is the last number you add (n)? Make sure n is included in your sum.",
              hintLevel: 2,
              concept: "loop boundaries",
              section: "recipe",
              shouldRevealSolution: false
            },
            {
              hint: "Make sure your recipe specifies repeating the addition from 1 up to and including n so no number is missed.",
              hintLevel: 2,
              concept: "inclusive boundary",
              section: "recipe",
              shouldRevealSolution: false
            }
          ]
        };
        const candidates = pool[level] || pool[1];
        return selectUnused(candidates);
      }
      if (section === "ingredients") {
        const pool = {
          1: [
            {
              hint: "Think about what you need to know at the end. You need a variable to store values that change as your program runs.",
              hintLevel: 1,
              concept: "state tracking",
              section: "ingredients",
              shouldRevealSolution: false
            },
            {
              hint: "You need three basic ingredients: an input variable for n, an accumulator to keep the growing total, and a counter to step from 1 to n.",
              hintLevel: 1,
              concept: "required variables",
              section: "ingredients",
              shouldRevealSolution: false
            }
          ],
          2: [
            {
              hint: "You need three variables: `n` for the user input, `sum` initialized to 0 before the loop to accumulate the total, and loop counter `i` starting at 1.",
              hintLevel: 2,
              concept: "accumulator and counter",
              section: "ingredients",
              shouldRevealSolution: false
            },
            {
              hint: "Specify initial values: sum starts at 0 so nothing extra is added, and i starts at 1 to begin with the first natural number.",
              hintLevel: 2,
              concept: "initial values",
              section: "ingredients",
              shouldRevealSolution: false
            }
          ]
        };
        const candidates = pool[level] || pool[1];
        return selectUnused(candidates);
      }
      return {
        hint: "Trace with a small input like n = 3: initial sum = 0. Step 1: sum becomes 1. Step 2: sum becomes 3. Step 3: sum becomes 6. Verify your code produces 6.",
        hintLevel: level,
        concept: "dry run tracing",
        section: "samplecode",
        shouldRevealSolution: false
      };
    }
    if (isOddEven) {
      if (section === "logic") {
        return {
          hint: "Even numbers divide by 2 with remainder 0, while odd numbers leave remainder 1 when divided by 2. Consider how the remainder distinguishes parity.",
          hintLevel: level,
          concept: "divisibility and parity",
          section: "logic",
          shouldRevealSolution: false
        };
      }
      if (section === "recipe") {
        if (ws.includes("step 3") || inp.includes("step 3") || inp.includes("check remainder") || inp.includes("remainder you are getting")) {
          return {
            hint: "When you get remainder as 0 then it is even. Complete the sentence: write Step 4 for what happens when remainder is 0 (even) or else 1 (odd).",
            hintLevel: level,
            concept: "conditional decision",
            section: "recipe",
            shouldRevealSolution: false
          };
        }
        if (ws.includes("step 2") || inp.includes("step 2") || inp.includes("modulo")) {
          return {
            hint: "Step 2 with modulo divide by 2 is great! Now for Step 3, check what remainder you are getting. Make that as a sentence.",
            hintLevel: level,
            concept: "remainder checking",
            section: "recipe",
            shouldRevealSolution: false
          };
        }
        if (ws.includes("step 1") || inp.includes("step 1") || inp.includes("get input") || inp.includes("divide")) {
          return {
            hint: "Great start getting the input in Step 1! For Step 2, you have to modulo divide by 2 to get the remainder.",
            hintLevel: level,
            concept: "modulo division",
            section: "recipe",
            shouldRevealSolution: false
          };
        }
        return {
          hint: "Whatever you found on logic, write it here step by step. Ex: Step 1: Get the input, Step 2: Modulo divide by 2 to get remainder, Step 3: Check remainder, etc.",
          hintLevel: level,
          concept: "step by step algorithm",
          section: "recipe",
          shouldRevealSolution: false
        };
      }
      if (section === "ingredients") {
        return {
          hint: "Variable: num. Operators: % (modulo) and == (comparison). Construct: if-else statement.",
          hintLevel: level,
          concept: "operators and branching",
          section: "ingredients",
          shouldRevealSolution: false
        };
      }
      return {
        hint: 'Test with sample inputs: n = 4 gives 4 % 2 == 0 ("Even"). n = 7 gives 7 % 2 == 1 ("Odd").',
        hintLevel: level,
        concept: "parity test cases",
        section: "samplecode",
        shouldRevealSolution: false
      };
    }
    if (isDivisors) {
      if (section === "logic") {
        return {
          hint: "\u{1F31F} Coach Maya here! To find divisors, test each number from 1 up to the given number. Check if dividing leaves a remainder of 0.\nFor example, if input n = 4:\n\u2022 4 % 1 = 0 (Remainder 0 \u2192 1 is a divisor)\n\u2022 4 % 2 = 0 (Remainder 0 \u2192 2 is a divisor)\n\u2022 4 % 3 = 1 (Remainder 1 \u2192 3 is not a divisor)\n\u2022 4 % 4 = 0 (Remainder 0 \u2192 4 is a divisor)\nSo the numbers that divide 4 completely (divisors of 4) are: 1, 2, and 4!",
          hintLevel: level,
          concept: "divisors logic and testing remainder",
          section: "logic",
          shouldRevealSolution: false
        };
      }
      if (section === "ingredients") {
        if (ws.includes("if") || inp.includes("if") || ws.includes("step 2") || inp.includes("step 2") || ws.includes("step 3") || inp.includes("step 3") || !ws.includes("n % i == 0")) {
          return {
            hint: "\u{1F31F} Coach Maya here! In an If condition we have two sides: Left Side & Right Side of the operator.\n\u2022 Left Side (L.S) : n % i (calculates remainder when input n is divided by loop counter i)\n\u2022 Operator : == (equality comparison)\n\u2022 Right Side (R.S) : 0 (checks if remainder is 0)\nSo your 'if condition' looks like: if (n % i == 0)",
            hintLevel: level,
            concept: "conditional structure (L.S, R.S, Operator)",
            section: "ingredients",
            shouldRevealSolution: false
          };
        }
        return {
          hint: "The ingredients for Divisors are: 1) Variable n for input, 2) For loop (Start: 1, Stop: n, Step: +1), 3) If condition with modulo (if (n % i == 0)), 4) Print statement to display divisor i.",
          hintLevel: level,
          concept: "ingredients breakdown",
          section: "ingredients",
          shouldRevealSolution: false
        };
      }
    }
    const isSeniorCitizen = context.programId === "senior-citizen" || context.problem.programName.toLowerCase().includes("senior") || context.problem.programName.toLowerCase().includes("citizen");
    if (isSeniorCitizen) {
      const combinedText = (inp + " " + ws).toLowerCase();
      const allNumbers = Array.from(combinedText.matchAll(/\b\d+\b/g)).map((m) => parseInt(m[0], 10));
      const testNum = allNumbers.find((n) => n !== 60 && n !== 19 && n !== 1 && n !== 2);
      if (section === "logic") {
        if (combinedText.includes("20") && !combinedText.includes("60")) {
          const pool20 = [
            {
              hint: "\u{1F31F} Coach Maya gentle check: Look at your comparison benchmark: 20! For Senior Citizen status, the legal threshold is age 60, not 20! If someone is 20: 20 >= 60 is false (under 60). If someone is 75: 75 >= 60 is true (Senior Citizen). Please compare age against 60 using `>=`: `age >= 60`.",
              hintLevel: level,
              concept: "relational operator >= with threshold 60",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Compare age with 60 using >= operator."
            },
            {
              hint: "\u{1F31F} Coach Maya checking back! Remember that age 20 is a young adult. The criteria for a Senior Citizen requires being 60 years or older. In your worksheet, test whether `age >= 60` rather than 20!",
              hintLevel: Math.max(2, level),
              concept: "threshold correction to 60",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Update comparison to age >= 60."
            }
          ];
          return selectUnused(pool20);
        }
        if (testNum !== void 0) {
          const isSenior = testNum >= 60;
          const poolWithAge = {
            1: [
              {
                hint: `\u{1F31F} Coach Maya here! You tested with age ${testNum}! Let's check ${testNum} mathematically: ${testNum} >= 60 is ${isSenior ? "true \u2794 Senior Citizen" : "false \u2794 Not Senior Citizen"}. \u{1F44F} What is the general rule for anyone aged 60 or above?`,
                hintLevel: 1,
                concept: "mathematical comparison example",
                section: "logic",
                shouldRevealSolution: false,
                nextSuggestedAction: `For age = ${testNum}: ${testNum} >= 60 is ${isSenior ? "true -> Senior Citizen" : "false -> Not Senior Citizen"}.`
              }
            ],
            2: [
              {
                hint: `\u{1F31F} Coach Maya checking back! Your calculation for age ${testNum} (${testNum} >= 60 is ${isSenior ? "true" : "false"}) is spot on. To complete Logic, state both the general rule and your calculation: 'A person aged 60 or older (age >= 60) is a Senior Citizen; otherwise not. For age = ${testNum}: ${testNum} >= 60 is ${isSenior ? "true (Senior Citizen)" : "false (Not Senior Citizen)"}.'`,
                hintLevel: 2,
                concept: "combining rule with mathematical example",
                section: "logic",
                shouldRevealSolution: false,
                nextSuggestedAction: "Include both general rule and numerical calculation."
              }
            ],
            3: [
              {
                hint: `\u{1F31F} Coach Maya with a fresh tip! Here is the exact two-part structure needed for Logic:
1) Rule: age >= 60 is Senior Citizen, otherwise Not Senior Citizen.
2) Proof: For age = ${testNum}, ${testNum} >= 60 is ${isSenior ? "true -> Senior Citizen" : "false -> Not Senior Citizen"}.
Write this right into your worksheet!`,
                hintLevel: 3,
                concept: "logic stage template",
                section: "logic",
                shouldRevealSolution: false,
                nextSuggestedAction: "Copy template with your test age into worksheet."
              }
            ],
            4: [
              {
                hint: `\u{1F31F} Coach Maya worked walkthrough! Here is the complete logic to finish this stage:
"A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen. For example, if age = ${testNum}, ${testNum} >= 60 is ${isSenior ? "true (Senior Citizen)" : "false (Not Senior Citizen)"}."`,
                hintLevel: 4,
                concept: "complete logic verification",
                section: "logic",
                shouldRevealSolution: false,
                nextSuggestedAction: "Submit complete logic definition."
              }
            ]
          };
          const candidates2 = poolWithAge[level] || poolWithAge[1];
          return selectUnused(candidates2);
        }
        const generalPool = {
          1: [
            {
              hint: "\u{1F31F} Coach Maya here! A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen. State the rule and provide a numerical calculation (e.g. 65 >= 60 -> Senior Citizen)!",
              hintLevel: 1,
              concept: "relational comparison",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "State age >= 60 rule and provide an example like 65 >= 60."
            }
          ],
          2: [
            {
              hint: "\u{1F31F} Coach Maya checking in! In the Logic stage, we test our condition using actual numbers. Choose an age like 75 or 45, and check it against 60 using `>=`. Is 75 >= 60 true or false?",
              hintLevel: 2,
              concept: "testing numerical values",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Test with an age like 75 or 45."
            }
          ],
          3: [
            {
              hint: "\u{1F31F} Coach Maya with a fresh clue! In your worksheet, write both cases: 1) Positive case: if age = 65, 65 >= 60 is true (Senior Citizen). 2) Negative case: if age = 45, 45 >= 60 is false (Not Senior Citizen).",
              hintLevel: 3,
              concept: "positive and negative test cases",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Write both positive (65) and negative (45) cases."
            }
          ],
          4: [
            {
              hint: '\u{1F31F} Coach Maya worked example! Here is the full mathematical logic to pass Stage 1:\n"A person aged 60 or above (age >= 60) is considered a Senior Citizen; otherwise Not a Senior Citizen. For example, if age = 65, 65 >= 60 is true -> Senior Citizen. If age = 45, 45 >= 60 is false -> Not Senior Citizen."',
              hintLevel: 4,
              concept: "complete logic specification",
              section: "logic",
              shouldRevealSolution: false,
              nextSuggestedAction: "Copy logic into worksheet and verify."
            }
          ]
        };
        const candidates = generalPool[level] || generalPool[1];
        return selectUnused(candidates);
      }
      if (section === "recipe") {
        const hasStep1 = /(?:step\s*1|first\s*step).*?(?:get|read|take|input|receive|accept).*?age/i.test(combinedText) || /(?:get|read|take|input|receive|accept).*?age/i.test(combinedText);
        if (!hasStep1) {
          const rec1Pool = [
            {
              hint: "\u{1F31F} Coach Maya here! What is the very first step of our algorithm? Before we can check if someone is a Senior Citizen, we need their age. Write Step 1: Get age input from the user.",
              hintLevel: level,
              concept: "recipe step 1",
              section: "recipe",
              shouldRevealSolution: false,
              nextSuggestedAction: "Step 1: Get age input"
            },
            {
              hint: "\u{1F31F} Coach Maya checking back! Every recipe starts with ingredients or inputs. For this program, start with: 'Step 1: Get age input from the user.'",
              hintLevel: Math.max(2, level),
              concept: "recipe input step",
              section: "recipe",
              shouldRevealSolution: false,
              nextSuggestedAction: "Step 1: Get age input"
            }
          ];
          return selectUnused(rec1Pool);
        }
        const rec2Pool = [
          {
            hint: "\u{1F31F} Coach Maya here! Step 1 is done! \u{1F44F} Now for Step 2: In plain everyday English without code words, check if age is 60 or greater: if true display Senior Citizen, otherwise display Not Senior Citizen.",
            hintLevel: level,
            concept: "recipe step 2",
            section: "recipe",
            shouldRevealSolution: false,
            nextSuggestedAction: "Step 2: If age is 60 or greater, display Senior Citizen, else display Not Senior Citizen"
          },
          {
            hint: "\u{1F31F} Coach Maya with the next clue! For Step 2, describe the decision in everyday words: 'Step 2: If age is 60 or greater, display Senior Citizen; otherwise display Not Senior Citizen.'",
            hintLevel: Math.max(2, level),
            concept: "recipe step 2 complete",
            section: "recipe",
            shouldRevealSolution: false,
            nextSuggestedAction: "Step 2: Decision and display"
          }
        ];
        return selectUnused(rec2Pool);
      }
      if (section === "ingredients") {
        if (!combinedText.includes("age") && !combinedText.includes("step 1")) {
          return {
            hint: "\u{1F31F} Coach Maya here! What variable do we need to store the person's age input? Write Step 1: age variable.",
            hintLevel: level,
            concept: "input variable",
            section: "ingredients",
            shouldRevealSolution: false,
            nextSuggestedAction: "step 1 : age variable"
          };
        }
        if (!combinedText.includes(">=") && !combinedText.includes("60")) {
          return {
            hint: "\u{1F31F} Coach Maya here! Step 1 is in place! For Step 2, define the `if` condition using Left Side (L.S: age), Right Side (R.S: 60), and Operator (>=).",
            hintLevel: level,
            concept: "if condition components",
            section: "ingredients",
            shouldRevealSolution: false,
            nextSuggestedAction: "step 2 : If condition with L.S: age, R.S: 60, Operator: >="
          };
        }
        return {
          hint: "\u{1F31F} Coach Maya here! In an If condition, we test `age >= 60`. If true print 'Senior Citizen', else print 'Not Senior Citizen'!",
          hintLevel: level,
          concept: "ingredients branching",
          section: "ingredients",
          shouldRevealSolution: false
        };
      }
      return {
        hint: '\u{1F31F} Coach Maya here! Draft your code step-by-step: 1) `var age = 65;`, 2) `if (age >= 60) print("Senior Citizen");`, 3) `else print("Not Senior Citizen");`',
        hintLevel: level,
        concept: "sample code implementation",
        section: "samplecode",
        shouldRevealSolution: false
      };
    }
    if (section === "logic") {
      if (level === 1) {
        return {
          hint: "First think about this: what does the problem ask you to test or calculate, and what happens step-by-step with simple numbers?",
          hintLevel: 1,
          concept: "problem formulation",
          section: "logic",
          shouldRevealSolution: false,
          nextSuggestedAction: "Identify the core mathematical condition before writing code."
        };
      }
      return {
        hint: "Break it into parts: 1) What input arrives? 2) What condition separates a valid answer from an invalid one?",
        hintLevel: level,
        concept: "algorithmic logic",
        section: "logic",
        shouldRevealSolution: false
      };
    }
    if (section === "recipe") {
      return {
        hint: "Convert your logic into numbered chronological steps. What must happen before anything else, and what repeats in a loop?",
        hintLevel: level,
        concept: "algorithm sequencing",
        section: "recipe",
        shouldRevealSolution: false
      };
    }
    if (section === "ingredients") {
      return {
        hint: "Identify what constructs you need: variables to hold input and state, operators for calculations or conditions, and control structures.",
        hintLevel: level,
        concept: "programming constructs",
        section: "ingredients",
        shouldRevealSolution: false
      };
    }
    return {
      hint: "Dry run your steps with a small input: trace each variable line-by-line from input to processing to final output.",
      hintLevel: level,
      concept: "trace execution",
      section: "samplecode",
      shouldRevealSolution: false
    };
  }
}
const llmService = new LLMService();
export {
  LLMService,
  llmService
};
