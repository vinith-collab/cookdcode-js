import { StructuredLLMOutput, CTCStage } from '../types.js';
import { FullLearningContext } from './contextCollector.js';

export interface ValidationResult {
  isValid: boolean;
  sanitizedOutput: StructuredLLMOutput;
  reason?: string;
}

export class HintValidator {
  public validate(output: StructuredLLMOutput, context: FullLearningContext): ValidationResult {
    // 1. Check basic content existence
    if (!output || !output.hint || typeof output.hint !== 'string' || output.hint.trim().length < 5) {
      return {
        isValid: false,
        sanitizedOutput: this.createSafeFallback(context, 'empty hint response'),
        reason: 'Hint text is missing or too brief.'
      };
    }

    let hint = output.hint.trim();

    // 2. Check section correctness
    if (output.section !== context.section) {
      output.section = context.section;
    }

    // 3. Section-specific rule verification
    // In Logic stage: No formulas like n*(n+1)/2 and NO coding-related words
    if (context.section === 'logic') {
      const formulaRegex = /\b(n\s*\*\s*\(\s*n\s*\+\s*1\s*\)\s*\/\s*2|algebraic\s*formula|formula\s*n\s*\*|\(n\s*\+\s*1\)\s*\/\s*2)\b/i;
      const codeRegex = /\b(def |function |int main|void |import |#include|for\s*\(|while\s*\(|console\.log|print\(|System\.out|loop\w*|variab\w*|syntax|array\w*|while\b|for\s+loop|coding|int\b|float|data\s*type|initializ\w*|increment\w*|decrement\w*|iterat\w*|accumulator\s*variable|modulo\s*operator)\b/i;

      if (formulaRegex.test(hint) || codeRegex.test(hint)) {
        let cleaned = hint
          .replace(/either accumulate with a loop from 1 to n or use the algebraic formula n \* \(n \+ 1\) \/ 2\.?/gi, 'repeatedly combine each consecutive counting number from 1 up through n.')
          .replace(/algebraic\s*formula\s*(n\s*\*\s*\(\s*n\s*\+\s*1\s*\)\s*\/\s*2)?/gi, 'systematic accumulation')
          .replace(/n\s*\*\s*\(\s*n\s*\+\s*1\s*\)\s*\/\s*2/gi, 'the step-by-step sum')
          .replace(/\binitialized\s+to\s+zero\b/gi, 'starting at zero')
          .replace(/\binitialized\s+to\b/gi, 'starting at')
          .replace(/\binitializ\w*\b/gi, 'start')
          .replace(/\bwith a loop from 1 to n\b/gi, 'by counting sequentially from 1 to n')
          .replace(/\bloops?\b/gi, 'repetition')
          .replace(/\blooping\b/gi, 'repeating')
          .replace(/\bvariables?\b/gi, 'values')
          .replace(/\biterations?\b/gi, 'steps')
          .replace(/\biterate\b/gi, 'step through')
          .replace(/\baccumulator\b/gi, 'running total')
          .replace(/\bincrements?\b/gi, 'advances')
          .replace(/\bdecrements?\b/gi, 'decreases');

        if (formulaRegex.test(cleaned) || codeRegex.test(cleaned)) {
          cleaned = this.createCleanLogicHint(context);
        }

        hint = cleaned;
      }

      // Sanitize concept for logic stage so it contains no coding words
      if (output.concept) {
        output.concept = output.concept
          .replace(/\b(accumulator|iteration|loop|variable|modulo\s*operator)\b/gi, '')
          .trim();
        if (!output.concept || output.concept.length < 3) {
          output.concept = 'Sequential Accumulation';
        }
      }
    }

    // 4. Check for premature complete solution reveal
    const fullSolutionKeywords = ['here is the full code', 'complete solution:', 'the final code is:'];
    const revealsFull = fullSolutionKeywords.some(kw => hint.toLowerCase().includes(kw));
    if (revealsFull && context.hintLevel < 4) {
      hint = 'Think about how each part connects: step through your logic and recipe one piece at a time.';
      output.shouldRevealSolution = false;
    }

    // 5. Check repetition of previous hints
    if (context.previousHints && context.previousHints.length > 0) {
      const isRepeated = context.previousHints.some(prev => {
        const normPrev = prev.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normCurr = hint.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normPrev === normCurr || (normPrev.length > 20 && normCurr.includes(normPrev));
      });

      if (isRepeated) {
        hint = this.generateAlternativeHint(context);
      }
    }

    // 6. Enforce conciseness (no multi-paragraph essays)
    if (hint.length > 350) {
      const sentences = hint.split(/(?<=[.?!])\s+/);
      hint = sentences.slice(0, 2).join(' ');
    }

    return {
      isValid: true,
      sanitizedOutput: {
        hint,
        hintLevel: context.hintLevel,
        concept: output.concept || context.problem.concept,
        section: context.section,
        shouldRevealSolution: output.shouldRevealSolution || false,
        nextSuggestedAction: output.nextSuggestedAction
      }
    };
  }

  private generateAlternativeHint(context: FullLearningContext): string {
    switch (context.section) {
      case 'logic':
        return `Let's look at this differently: if you test with a small number, what exact condition tells you whether the condition holds true?`;
      case 'recipe':
        return `Let's break the sequence down: write what the program does upon receiving input, before any decision is made.`;
      case 'ingredients':
        return `Consider the data flow: what variable stores the input, and what structure evaluates the conditions?`;
      case 'samplecode':
        return `Trace the execution step-by-step: write down the value of each variable before and after the central step.`;
    }
  }

  private createCleanLogicHint(context: FullLearningContext): string {
    const isSum = context.programId.includes('sum') || context.problem.programName.toLowerCase().includes('sum');
    if (isSum) {
      if (context.hintLevel === 1) {
        return 'Natural numbers start from 1. To find the sum up to a target number, imagine starting with an empty count and combining each number in sequence into a growing total.';
      }
      if (context.hintLevel === 2) {
        return 'Notice the pattern: start with an initial total of 0. Step through each number from 1 to your target, repeatedly adding each number to the total.';
      }
      if (context.hintLevel === 3) {
        return 'Consider stepping through with a small target like 4: first add 1 (total 1), then add 2 (total 3), then add 3 (total 6), and then add 4 (total 10). Notice how the total grows step-by-step.';
      }
      return 'The core logic is sequential accumulation: begin with an initial total of 0, and repeatedly add each successive counting number from 1 up through the target until all numbers are combined.';
    }

    if (context.programId.includes('prime')) {
      if (context.hintLevel === 1) {
        return 'Think about factors: a prime number is a positive whole number greater than 1 that cannot be formed by multiplying two smaller whole numbers.';
      }
      return 'To test if a number is prime, check whether any number between 2 and the number itself divides it with no remainder left over.';
    }

    return 'Focus purely on human reasoning: what initial value do you start with, and what step-by-step combination must occur?';
  }

  private createSafeFallback(context: FullLearningContext, reason: string): StructuredLLMOutput {
    return {
      hint: `Take a step back: what is the fundamental condition or step you need for ${context.problem.programName}?`,
      hintLevel: context.hintLevel,
      concept: context.problem.concept,
      section: context.section,
      shouldRevealSolution: false
    };
  }
}

export const hintValidator = new HintValidator();
