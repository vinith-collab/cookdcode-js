export interface OddEvenValidation {
  hasList: boolean;
  hasOdd: boolean;
  hasEven: boolean;
  oddNumbers: number[];
  evenNumbers: number[];
  wrongInOdd: number[]; // Even numbers wrongly placed under odd
  wrongInEven: number[]; // Odd numbers wrongly placed under even
  isCorrect: boolean;
  feedback?: string;
  correction?: string;
  suggestedInput?: string;
}

function parseNumbers(str: string): number[] {
  const matches = str.match(/\b\d+\b/g);
  if (!matches) return [];
  return matches.map(Number).filter(n => !isNaN(n));
}

/**
 * Validates whether the student's listed odd and even numbers are mathematically correct.
 */
export function validateOddEvenClassification(text: string): OddEvenValidation {
  const result: OddEvenValidation = {
    hasList: false,
    hasOdd: false,
    hasEven: false,
    oddNumbers: [],
    evenNumbers: [],
    wrongInOdd: [],
    wrongInEven: [],
    isCorrect: false
  };

  if (!text || typeof text !== 'string') return result;

  const lines = text.split(/[\r\n]+/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // If the line is an equation or logic check (like 2%2=0, 3%2=1, 4 / 2 = 2, ==0), skip it from list classification
    if (trimmed.includes('%') || trimmed.includes('==') || /=\s*\d+/.test(trimmed)) {
      continue;
    }

    // Clean '2 table', 'table of 2'
    const sanitizedLine = trimmed
      .replace(/\b\d+\s*table\b/gi, ' ')
      .replace(/\btable\s*of\s*\d+\b/gi, ' ');

    // Pattern 1: "odd: 1, 2, 3", "odd numbers: 1, 3, 5", "even: 2, 4, 6"
    for (const m of sanitizedLine.matchAll(/\b(odd|even)(?:\s+numbers?)?[\s:=]+([0-9\s,]+)/gi)) {
      const type = m[1].toLowerCase();
      const nums = parseNumbers(m[2]);
      if (nums.length > 0) {
        if (type === 'odd') {
          result.hasOdd = true;
          for (const n of nums) {
            if (!result.oddNumbers.includes(n)) {
              result.oddNumbers.push(n);
              if (n % 2 === 0) result.wrongInOdd.push(n);
            }
          }
        } else if (type === 'even') {
          result.hasEven = true;
          for (const n of nums) {
            if (!result.evenNumbers.includes(n)) {
              result.evenNumbers.push(n);
              if (n % 2 !== 0) result.wrongInEven.push(n);
            }
          }
        }
      }
    }

    // Pattern 2: "1, 3, 5 are odd", "2, 4, 6 are even", "1, 3, 5 odd"
    for (const m of sanitizedLine.matchAll(/([0-9\s,]+)\s*(?:are|is)?\s*\b(odd|even)\b/gi)) {
      const type = m[2].toLowerCase();
      const nums = parseNumbers(m[1]);
      if (nums.length > 0) {
        if (type === 'odd') {
          result.hasOdd = true;
          for (const n of nums) {
            if (!result.oddNumbers.includes(n)) {
              result.oddNumbers.push(n);
              if (n % 2 === 0) result.wrongInOdd.push(n);
            }
          }
        } else if (type === 'even') {
          result.hasEven = true;
          for (const n of nums) {
            if (!result.evenNumbers.includes(n)) {
              result.evenNumbers.push(n);
              if (n % 2 !== 0) result.wrongInEven.push(n);
            }
          }
        }
      }
    }
  }

  // Determine overall status
  if (result.hasOdd || result.hasEven) {
    result.hasList = true;
    result.isCorrect =
      result.hasOdd &&
      result.hasEven &&
      result.wrongInOdd.length === 0 &&
      result.wrongInEven.length === 0;

    if (!result.isCorrect) {
      if (result.wrongInOdd.length > 0 && result.wrongInEven.length > 0) {
        const wrongOddStr = result.wrongInOdd.join(', ');
        const wrongEvenStr = result.wrongInEven.join(', ');
        result.feedback = `Take another close look at your numbers! In your odd list, ${wrongOddStr} is an even number because it splits evenly into 2 equal parts. In your even list, ${wrongEvenStr} is an odd number because it leaves 1 leftover when paired. Remember: Even numbers pair up evenly (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...). Can you separate numbers from 1 to 6 into odd and even correctly?`;
        result.correction = `Check your numbers: Even numbers can be split into 2 equal parts (2, 4, 6...), while Odd numbers leave 1 leftover (1, 3, 5...).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (result.wrongInOdd.length > 0) {
        const wrongOddStr = result.wrongInOdd.join(', ');
        result.feedback = `Take another close look at your odd numbers! In your list, ${wrongOddStr} is an even number because it splits evenly into 2 equal parts. Remember, odd numbers leave 1 leftover when paired into twos (like 1, 3, 5...). Can you correct your odd list?`;
        result.correction = `Check your odd numbers: ${wrongOddStr} is an even number. Odd numbers are 1, 3, 5...`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (result.wrongInEven.length > 0) {
        const wrongEvenStr = result.wrongInEven.join(', ');
        result.feedback = `Take another close look at your even numbers! In your list, ${wrongEvenStr} is an odd number because it leaves 1 leftover when paired into groups of 2. Remember, even numbers divide evenly into 2 equal parts (like 2, 4, 6...). Can you correct your even list?`;
        result.correction = `Check your even numbers: ${wrongEvenStr} is an odd number. Even numbers are 2, 4, 6...`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (!result.hasOdd) {
        result.feedback = `Great job listing even numbers (${result.evenNumbers.join(', ')})! Now, also list the odd numbers (like 1, 3, 5...) so we have examples of both.`;
        result.correction = `List odd numbers as well (e.g., Odd: 1, 3, 5).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      } else if (!result.hasEven) {
        result.feedback = `Great job listing odd numbers (${result.oddNumbers.join(', ')})! Now, also list the even numbers (like 2, 4, 6...) so we have examples of both.`;
        result.correction = `List even numbers as well (e.g., Even: 2, 4, 6).`;
        result.suggestedInput = `Odd: 1, 3, 5 and Even: 2, 4, 6`;
      }
    }
  }

  return result;
}
