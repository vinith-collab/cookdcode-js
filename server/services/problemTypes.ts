export type SupportedProblemType = 'odd-even' | 'sum-natural-numbers' | 'factorial' | 'divisor-of-a-number' | 'multiplication-table' | 'prime-number' | 'next-prime-number' | 'prime-between-range' | 'sexy-prime-number' | 'positive-negative' | 'three-digit-number' | 'voting-eligibility' | 'pass-or-fail' | 'greater-than-100' | 'profit-or-loss' | 'leap-year' | 'adult-or-minor' | 'divisible-by-5' | 'maximum-of-two' | 'vowel-or-consonant' | 'senior-citizen' | 'custom';

/**
 * Robustly detects which problem type is being solved to prevent hint cross-contamination
 */
export function detectProblemType(problemId?: string, problemTitle?: string): SupportedProblemType {
  const normId = (problemId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const normTitle = (problemTitle || '').toLowerCase();

  // Senior Citizen or Not check (Problem 19)
  if (
    normId.includes('senior') ||
    normId.includes('citizen') ||
    (normId.includes('problem19') && !normTitle.includes('vowel')) ||
    normTitle.includes('senior') ||
    normTitle.includes('citizen')
  ) {
    return 'senior-citizen';
  }

  // Vowel or Consonant check
  if (
    normId.includes('vowel') ||
    normId.includes('consonant') ||
    normId === 'problem20' ||
    normId === 'problem020' ||
    normTitle.includes('vowel') ||
    normTitle.includes('consonant')
  ) {
    return 'vowel-or-consonant';
  }

  // Maximum of Two Numbers check (Problem 18)
  if (
    normId.includes('maximumoftwo') ||
    normId.includes('maxoftwo') ||
    normId.includes('maximumtwo') ||
    normId.includes('maxtwo') ||
    normId === 'problem18' ||
    normId === 'problem018' ||
    (normTitle.includes('maximum') && (normTitle.includes('two') || normTitle.includes('2'))) ||
    (normTitle.includes('larger') && (normTitle.includes('two') || normTitle.includes('2'))) ||
    (normId.includes('maximum') && normId.includes('two'))
  ) {
    return 'maximum-of-two';
  }

  // Divisible by 5 or Not check (Problem 17)
  if (
    normId.includes('divisibleby5') ||
    normId.includes('divisible5') ||
    normId === 'problem17' ||
    normId === 'problem017' ||
    (normTitle.includes('divisible') && (normTitle.includes('5') || normTitle.includes('five'))) ||
    (normId.includes('divisible') && (normId.includes('5') || normId.includes('five')))
  ) {
    return 'divisible-by-5';
  }

  // Adult or Minor check (Problem 16)
  if (
    normId.includes('adult') ||
    normId.includes('minor') ||
    normId === 'problem16' ||
    normId === 'problem016' ||
    normTitle.includes('adult') ||
    normTitle.includes('minor')
  ) {
    return 'adult-or-minor';
  }

  // Leap Year or Not check (Problem 15)
  if (
    normId.includes('leap') ||
    normId === 'problem15' ||
    normId === 'problem015' ||
    normTitle.includes('leap') ||
    normTitle.includes('leap year')
  ) {
    return 'leap-year';
  }

  // Profit or Loss check (Problem 14)
  if (
    normId.includes('profit') ||
    normId.includes('loss') ||
    normId === 'problem14' ||
    normId === 'problem014' ||
    normTitle.includes('profit') ||
    normTitle.includes('loss')
  ) {
    return 'profit-or-loss';
  }

  // Number is Greater than 100 or Not check (Problem 13)
  if (
    normId.includes('greaterthan100') ||
    normId.includes('greater100') ||
    normId === 'problem13' ||
    normId === 'problem013' ||
    (normTitle.includes('greater than 100') || (normTitle.includes('100') && (normTitle.includes('greater') || normTitle.includes('number'))))
  ) {
    return 'greater-than-100';
  }

  // Pass or Fail Based on Mark check (Problem 12)
  if (
    normId.includes('pass') ||
    normId.includes('fail') ||
    normId === 'problem12' ||
    normId === 'problem012' ||
    normTitle.includes('pass or fail') ||
    normTitle.includes('pass/fail') ||
    (normTitle.includes('mark') && (normTitle.includes('pass') || normTitle.includes('fail')))
  ) {
    return 'pass-or-fail';
  }

  // Voting Eligibility check (Problem 11)
  if (
    normId.includes('voting') ||
    normId.includes('vote') ||
    normId.includes('eligible') ||
    normId === 'problem11' ||
    normId === 'problem011' ||
    normTitle.includes('vote') ||
    normTitle.includes('voting') ||
    normTitle.includes('eligible')
  ) {
    return 'voting-eligibility';
  }

  // 3-Digit Number check (Problem 10)
  if (
    normId.includes('threedigit') ||
    normId.includes('3digit') ||
    normId === 'problem10' ||
    normId === 'problem010' ||
    normTitle.includes('3-digit') ||
    normTitle.includes('3 digit') ||
    normTitle.includes('three digit') ||
    normTitle.includes('three-digit')
  ) {
    return 'three-digit-number';
  }

  // Positive or Negative Number check (Problem 09)
  if (
    normId.includes('positive') ||
    normId.includes('negative') ||
    normId === 'problem09' ||
    normId === 'problem9' ||
    normTitle.includes('positive') ||
    normTitle.includes('negative')
  ) {
    return 'positive-negative';
  }

  // Sexy Prime Pairs check (must precede plain prime check)
  if (
    normId.includes('sexy') ||
    normTitle.includes('sexy') ||
    normId === 'problem08' ||
    normId === 'problem8'
  ) {
    return 'sexy-prime-number';
  }

  // Prime in Range check (must precede plain prime check)
  if (
    (normId.includes('prime') && (normId.includes('range') || normId.includes('between'))) ||
    (normTitle.includes('prime') && (normTitle.includes('range') || normTitle.includes('between'))) ||
    normId === 'problem07' ||
    normId === 'problem7'
  ) {
    return 'prime-between-range';
  }

  // Next Prime Number check (must precede plain prime check)
  if (
    normId.includes('nextprime') ||
    (normId.includes('next') && normId.includes('prime')) ||
    normTitle.includes('next prime') ||
    normId === 'problem06' ||
    normId === 'problem6'
  ) {
    return 'next-prime-number';
  }

  // Prime Number Checker check
  if (
    normId.includes('prime') ||
    normTitle.includes('prime') ||
    (normId === 'problem05' && !normTitle.includes('multiplication') && !normTitle.includes('table')) ||
    (normId === 'problem5' && !normTitle.includes('multiplication') && !normTitle.includes('table'))
  ) {
    return 'prime-number';
  }

  if (
    normId.includes('multiplication') ||
    normId.includes('table') ||
    normTitle.includes('multiplication') ||
    normTitle.includes('table')
  ) {
    return 'multiplication-table';
  }

  if (
    normId.includes('divisor') ||
    normId === 'problem04' ||
    normId === 'problem4' ||
    normTitle.includes('divisor')
  ) {
    return 'divisor-of-a-number';
  }

  if (
    normId.includes('factorial') ||
    normId === 'problem03' ||
    normId === 'problem3' ||
    normTitle.includes('factorial')
  ) {
    return 'factorial';
  }

  if (
    normId.includes('odd') ||
    normId.includes('even') ||
    normId === 'problem01' ||
    normId === 'problem1' ||
    normTitle.includes('odd') ||
    normTitle.includes('even')
  ) {
    return 'odd-even';
  }

  if (
    normId.includes('sum') ||
    normId.includes('natural') ||
    normId === 'problem02' ||
    normId === 'problem2' ||
    normTitle.includes('sum') ||
    normTitle.includes('natural')
  ) {
    return 'sum-natural-numbers';
  }

  return 'custom';
}
