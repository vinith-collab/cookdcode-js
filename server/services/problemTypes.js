function detectProblemType(problemId, problemTitle) {
  const normId = (problemId || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normTitle = (problemTitle || "").toLowerCase();
  if (normId.includes("multiplication") || normId.includes("table") || normId === "problem05" || normId === "problem5" || normId === "problem21" || normId === "problem021" || normTitle.includes("multiplication") || normTitle.includes("table")) {
    return "multiplication-table";
  }
  if (normId.includes("vowel") || normId.includes("consonant") || normId === "problem20" || normId === "problem020" || normTitle.includes("vowel") || normTitle.includes("consonant")) {
    return "vowel-or-consonant";
  }
  if (normId.includes("maximumoftwo") || normId.includes("maxoftwo") || normId.includes("maximumtwo") || normId.includes("maxtwo") || normId === "problem19" || normId === "problem019" || normTitle.includes("maximum") && (normTitle.includes("two") || normTitle.includes("2")) || normTitle.includes("larger") && (normTitle.includes("two") || normTitle.includes("2")) || normId.includes("maximum") && normId.includes("two")) {
    return "maximum-of-two";
  }
  if (normId.includes("divisibleby5") || normId.includes("divisible5") || normId === "problem18" || normId === "problem018" || normTitle.includes("divisible") && (normTitle.includes("5") || normTitle.includes("five")) || normId.includes("divisible") && (normId.includes("5") || normId.includes("five"))) {
    return "divisible-by-5";
  }
  if (normId.includes("adult") || normId.includes("minor") || normId === "problem17" || normId === "problem017" || normTitle.includes("adult") || normTitle.includes("minor")) {
    return "adult-or-minor";
  }
  if (normId.includes("leap") || normId === "problem16" || normId === "problem016" || normTitle.includes("leap") || normTitle.includes("leap year")) {
    return "leap-year";
  }
  if (normId.includes("profit") || normId.includes("loss") || normId === "problem15" || normId === "problem015" || normTitle.includes("profit") || normTitle.includes("loss")) {
    return "profit-or-loss";
  }
  if (normId.includes("greaterthan100") || normId.includes("greater100") || normId === "problem14" || normId === "problem014" || (normTitle.includes("greater than 100") || normTitle.includes("100") && (normTitle.includes("greater") || normTitle.includes("number")))) {
    return "greater-than-100";
  }
  if (normId.includes("pass") || normId.includes("fail") || normId === "problem13" || normId === "problem013" || normTitle.includes("pass or fail") || normTitle.includes("pass/fail") || normTitle.includes("mark") && (normTitle.includes("pass") || normTitle.includes("fail"))) {
    return "pass-or-fail";
  }
  if (normId.includes("voting") || normId.includes("vote") || normId.includes("eligible") || normId === "problem12" || normId === "problem012" || normTitle.includes("vote") || normTitle.includes("voting") || normTitle.includes("eligible")) {
    return "voting-eligibility";
  }
  if (normId.includes("threedigit") || normId.includes("3digit") || normId === "problem11" || normId === "problem011" || normTitle.includes("3-digit") || normTitle.includes("3 digit") || normTitle.includes("three digit") || normTitle.includes("three-digit")) {
    return "three-digit-number";
  }
  if (normId.includes("positive") || normId.includes("negative") || normId === "problem10" || normId === "problem010" || normTitle.includes("positive") || normTitle.includes("negative")) {
    return "positive-negative";
  }
  if (normId.includes("sexy") || normTitle.includes("sexy") || normId === "problem09" || normId === "problem9") {
    return "sexy-prime-number";
  }
  if (normId.includes("prime") && (normId.includes("range") || normId.includes("between")) || normTitle.includes("prime") && (normTitle.includes("range") || normTitle.includes("between")) || normId === "problem08" || normId === "problem8") {
    return "prime-between-range";
  }
  if (normId.includes("nextprime") || normId.includes("next") && normId.includes("prime") || normTitle.includes("next prime") || normId === "problem07" || normId === "problem7") {
    return "next-prime-number";
  }
  if (normId.includes("prime") || normTitle.includes("prime") || normId === "problem06" || normId === "problem6") {
    return "prime-number";
  }
  if (normId.includes("senior") || normId.includes("citizen") || normTitle.includes("senior") || normTitle.includes("citizen")) {
    return "senior-citizen";
  }
  if (normId.includes("divisor") || normId === "problem04" || normId === "problem4" || normTitle.includes("divisor")) {
    return "divisor-of-a-number";
  }
  if (normId.includes("factorial") || normId === "problem03" || normId === "problem3" || normTitle.includes("factorial")) {
    return "factorial";
  }
  if (normId.includes("odd") || normId.includes("even") || normId === "problem01" || normId === "problem1" || normTitle.includes("odd") || normTitle.includes("even")) {
    return "odd-even";
  }
  if (normId.includes("sum") || normId.includes("natural") || normId === "problem02" || normId === "problem2" || normTitle.includes("sum") || normTitle.includes("natural")) {
    return "sum-natural-numbers";
  }
  return "custom";
}
export {
  detectProblemType
};
