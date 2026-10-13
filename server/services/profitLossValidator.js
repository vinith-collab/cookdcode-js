function validateProfitLossLogic(input) {
  const text = (input || "").trim();
  const norm = text.toLowerCase().replace(/\s+/g, " ");
  const hasCostPrice = /\b(?:cost\s*pr[iy][sc]e|costpr[iy][sc]e|cp|bought\s*pr[iy][sc]e|buy\s*pr[iy][sc]e|purchase\s*pr[iy][sc]e|cost\s*amount|cost)\b/i.test(norm) || /\bcost\b/i.test(norm);
  const hasSellingPrice = /\b(?:selling\s*pr[iy][sc]e|sellingpr[iy][sc]e|sp|sold\s*pr[iy][sc]e|sale\s*pr[iy][sc]e|sale\s*amount|selling\s*amount|sale|sell|selling)\b/i.test(norm);
  const hasComparison = /\b(?:gr[ea]+t[ea]*r|gr[ea]+t[ea]*rthan|gr[ea]+t[ea]*r\s*than|greater|grater|more|morethan|more\s*than|higher|above|exceeds?|less|lessthan|less\s*than|lesser|lesserthan|lesser\s*than|lower|below|smaller|>|<|>=|<=)\b/i.test(norm) || /(?:>|<|>=|<=)/.test(norm) || /gr[ea]+t[ea]*r/i.test(norm);
  let costNumber = null;
  let sellingNumber = null;
  const cpMatch = norm.match(/(?:cost\s*pr[iy][sc]e|costpr[iy][sc]e|cp|cost)\s*(?:is|=|:|be|as|of)?\s*(\d+)/i) || norm.match(/(\d+)\s*(?:is\s*)?(?:cost\s*pr[iy][sc]e|costpr[iy][sc]e|cp)/i);
  if (cpMatch) {
    costNumber = parseInt(cpMatch[1], 10);
  }
  const spMatch = norm.match(/(?:selling\s*pr[iy][sc]e|sellingpr[iy][sc]e|sp|selling|sale)\s*(?:is|=|:|be|as|of)?\s*(\d+)/i) || norm.match(/(\d+)\s*(?:is\s*)?(?:selling\s*pr[iy][sc]e|sellingpr[iy][sc]e|sp)/i);
  if (spMatch) {
    sellingNumber = parseInt(spMatch[1], 10);
  }
  let hasNumericContradiction = false;
  let numericAnalysis = "";
  if (costNumber !== null && sellingNumber !== null) {
    const diff = Math.abs(sellingNumber - costNumber);
    if (sellingNumber > costNumber) {
      numericAnalysis = `Cost Price = ${costNumber}, Selling Price = ${sellingNumber}. Selling Price (${sellingNumber}) > Cost Price (${costNumber}) results in a Profit of ${diff}.`;
      const strippedOfConditions = norm.replace(/if\s+(?:the\s+)?(?:cost\s*pr[iy][sc]e|cp|selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|lessthan|smaller|lower|<|gr[ea]+t[ea]*r|more|higher|>)[^.]*?(?:is|gives|means|so)?\s*loss/gi, "").replace(/otherwise\s*(?:it\s*is)?\s*loss/gi, "");
      const claimsLossDirectly = /(?:cost\s*pr[iy][sc]e|cp)?\s*\d+[^.]*?(?:selling\s*pr[iy][sc]e|sp)?\s*\d+[^.]*?(?:so\s*it\s*is|this\s*is|it\s*is|means|gives|result\s*is|therefore)\s*loss\b/i.test(strippedOfConditions);
      if (claimsLossDirectly) {
        hasNumericContradiction = true;
      }
    } else if (costNumber > sellingNumber) {
      numericAnalysis = `Cost Price = ${costNumber}, Selling Price = ${sellingNumber}. Cost Price (${costNumber}) > Selling Price (${sellingNumber}) results in a Loss of ${diff}.`;
      const strippedOfConditions = norm.replace(/if\s+(?:the\s+)?(?:cost\s*pr[iy][sc]e|cp|selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|lessthan|smaller|lower|<|gr[ea]+t[ea]*r|more|higher|>)[^.]*?(?:is|gives|means|so)?\s*profit/gi, "").replace(/otherwise\s*(?:it\s*is)?\s*profit/gi, "");
      const claimsProfitDirectly = /(?:cost\s*pr[iy][sc]e|cp)?\s*\d+[^.]*?(?:selling\s*pr[iy][sc]e|sp)?\s*\d+[^.]*?(?:so\s*it\s*is|this\s*is|it\s*is|means|gives|result\s*is|therefore)\s*profit\b/i.test(strippedOfConditions);
      if (claimsProfitDirectly) {
        hasNumericContradiction = true;
      }
    } else {
      numericAnalysis = `Cost Price = ${costNumber}, Selling Price = ${sellingNumber}. Break-even (No Profit No Loss).`;
    }
  }
  const strippedOfTitle = norm.replace(/\b(?:problem\s*14|problem|program|topic|task|concept)?\s*[:\-]?\s*profit\s*(?:or|and|\/)\s*loss\b/gi, " ").replace(/\b(?:find|calculate|check|determine)\s+profit\s*(?:or|and|\/)\s*loss\b/gi, " ");
  const spGreaterProfit = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:loss|lost)).)*?(?:is|called|gives|means|display|announce|so|then)?\s*(?:profit|gain)/i.test(strippedOfTitle) || /(?:profit|gain)\s*(?:is\s*)?(?:when|if)\s*(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)/i.test(strippedOfTitle);
  const cpLessProfit = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:loss|lost)).)*?(?:is|called|gives|means|display|announce|so|then)?\s*(?:profit|gain)/i.test(strippedOfTitle) || /(?:profit|gain)\s*(?:is\s*)?(?:when|if)\s*(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)/i.test(strippedOfTitle);
  const otherwiseProfit = /(?:otherwise|else|if\s*not)\s*(?:it\s*is\s*|display\s*|announce\s*|show\s*|it\s*shows\s*)?(?:profit|gain)/i.test(strippedOfTitle);
  const hasProfitRule = spGreaterProfit || cpLessProfit || otherwiseProfit;
  const cpGreaterLoss = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:profit|gain)).)*?(?:is|called|gives|means|display|announce|so|then)?\s*(?:loss|lost)/i.test(strippedOfTitle) || /(?:loss|lost)\s*(?:is\s*)?(?:when|if)\s*(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)/i.test(strippedOfTitle);
  const spLessLoss = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:profit|gain)).)*?(?:is|called|gives|means|display|announce|so|then)?\s*(?:loss|lost)/i.test(strippedOfTitle) || /(?:loss|lost)\s*(?:is\s*)?(?:when|if)\s*(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)/i.test(strippedOfTitle);
  const otherwiseLoss = /(?:otherwise|else|if\s*not)\s*(?:it\s*is\s*|display\s*|announce\s*|show\s*|it\s*shows\s*)?(?:loss|lost)/i.test(strippedOfTitle);
  const hasLossRule = cpGreaterLoss || spLessLoss || otherwiseLoss;
  const hasProfitConcept = hasProfitRule || /\b(?:profit|gain|profitable|profitt)\b/i.test(strippedOfTitle);
  const hasLossConcept = hasLossRule || /\b(?:loss|lost|deficit|lossing)\b/i.test(strippedOfTitle);
  const claimsCPGreaterThanSPIsProfit = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:loss|lost)).)*?(?:is|called|gives|means|display|announce)?\s*(?:profit|gain)/i.test(norm) || /(?:profit|gain)\s*(?:is\s*)?(?:when|if)\s*(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)/i.test(norm);
  const claimsSPGreaterThanCPIsLoss = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:profit|gain)).)*?(?:is|called|gives|means|display|announce)?\s*(?:loss|lost)/i.test(norm) || /(?:loss|lost)\s*(?:is\s*)?(?:when|if)\s*(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|above|>)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)/i.test(norm);
  const claimsProfitWhenSPLessThanCP = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:loss|lost)).)*?(?:is|called|gives|means|display|announce)?\s*(?:profit|gain)/i.test(norm);
  const claimsLossWhenCPMinor = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:less|lessthan|lower|below|smaller|<)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:profit|gain)).)*?(?:is|called|gives|means|display|announce)?\s*(?:loss|lost)/i.test(norm);
  const statesCPLossOtherwiseProfit = (cpGreaterLoss || spLessLoss) && otherwiseProfit;
  const statesSPProfitOtherwiseLoss = (spGreaterProfit || cpLessProfit) && otherwiseLoss;
  const statesBothExplicit = (spGreaterProfit || cpLessProfit) && (cpGreaterLoss || spLessLoss);
  const hasContradiction = claimsCPGreaterThanSPIsProfit || claimsSPGreaterThanCPIsLoss || claimsProfitWhenSPLessThanCP || claimsLossWhenCPMinor || hasNumericContradiction;
  const hasBothRules = hasProfitRule && hasLossRule;
  const hasCompleteValidLogic = hasBothRules && (statesCPLossOtherwiseProfit || statesSPProfitOtherwiseLoss || statesBothExplicit) && !hasContradiction;
  const isQuestion = !hasCompleteValidLogic && (norm.endsWith("?") || /\b(?:how\s*to\s*start|how\s*to\s*do|how\s*to\s*solve|what\s*to\s*do|help|puriyala|explain|doubt|theriyala)\b/i.test(norm) || /\b(?:how|what|why)\b/i.test(norm) && norm.length < 80);
  let isFullyVerified = false;
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasNumericContradiction && costNumber !== null && sellingNumber !== null) {
    const diff = Math.abs(sellingNumber - costNumber);
    if (costNumber > sellingNumber) {
      feedback = `Let's look at your numbers: Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. You bought the item for ${costNumber} but sold it for only ${sellingNumber}, which means you lost ${diff}! That is a **Loss**, not a Profit! Profit only happens when you sell for more than you bought (Selling Price > Cost Price).`;
      correction = `For Cost Price = ${costNumber} and Selling Price = ${sellingNumber}, it is a Loss.`;
    } else {
      feedback = `Let's look at your numbers: Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. You bought the item for ${costNumber} and sold it for ${sellingNumber}, which means you gained ${diff}! That is a **Profit**, not a Loss! Selling Price > Cost Price is Profit.`;
      correction = `For Cost Price = ${costNumber} and Selling Price = ${sellingNumber}, it is a Profit.`;
    }
    suggestedInput = "If selling price is greater than cost price, it is profit; otherwise it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  } else if (claimsCPGreaterThanSPIsProfit) {
    feedback = "Take a closer look at your rule! When Cost Price is greater than Selling Price (CP > SP), you spent more money than you earned\u2014that is a **Loss**, not a Profit! Profit happens only when Selling Price is greater than Cost Price (SP > CP).";
    correction = "Selling Price > Cost Price is Profit. Cost Price > Selling Price is Loss.";
    suggestedInput = "If selling price is greater than cost price, it is profit; otherwise it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  } else if (claimsSPGreaterThanCPIsLoss) {
    feedback = "Wait a moment! When Selling Price is higher than Cost Price (SP > CP), you received more money than you spent\u2014that is a **Profit**, not a Loss! Loss happens when Selling Price is less than Cost Price (SP < CP).";
    correction = "Selling Price > Cost Price is Profit; otherwise Loss.";
    suggestedInput = "If selling price is greater than cost price, it is profit; otherwise it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  } else if (claimsProfitWhenSPLessThanCP || claimsLossWhenCPMinor) {
    feedback = "Double check your comparison! When Selling Price is less than Cost Price, money is lost, resulting in a **Loss**! Profit only occurs when Selling Price exceeds Cost Price.";
    correction = "Compare: SP > CP is Profit, and SP < CP is Loss.";
    suggestedInput = "If selling price is greater than cost price, it is profit; otherwise it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  } else if (hasCompleteValidLogic) {
    isFullyVerified = true;
    if (costNumber !== null && sellingNumber !== null) {
      const diff = Math.abs(sellingNumber - costNumber);
      const ruleText = statesCPLossOtherwiseProfit ? "when Cost Price is greater than Selling Price (or Selling Price is less than Cost Price) it is a Loss, otherwise Profit" : "when Selling Price is greater than Cost Price it is a Profit, otherwise Loss";
      if (sellingNumber > costNumber) {
        feedback = `\u{1F31F} Coach Maya here! Fantastic reasoning! Correct! Logic Approved! \u{1F389}
\u2022 **Your example:** Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. Since Selling Price (${sellingNumber}) is greater than Cost Price (${costNumber}), you earned ${diff} more than you spent\u2014which is a **Profit** of ${diff}!
\u2022 **Your rule:** You stated that ${ruleText}. That logic is 100% sound, correct, and successful! \u{1F389}
Proceed to the Recipe stage to sequence the steps.`;
      } else if (costNumber > sellingNumber) {
        feedback = `\u{1F31F} Coach Maya here! Fantastic reasoning! Correct! Logic Approved! \u{1F389}
\u2022 **Your example:** Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. Since Cost Price (${costNumber}) is greater than Selling Price (${sellingNumber}), you spent ${diff} more than you received\u2014which is a **Loss** of ${diff}!
\u2022 **Your rule:** You stated that ${ruleText}. That logic is 100% sound, correct, and successful! \u{1F389}
Proceed to the Recipe stage to sequence the steps.`;
      } else {
        feedback = `\u{1F31F} Coach Maya here! Fantastic reasoning! Correct! Logic Approved! \u{1F389} In your example, Cost Price is ${costNumber} and Selling Price is ${sellingNumber}, which breaks even (No Profit No Loss). Your rule correctly covers Profit and Loss! That logic is 100% sound, correct, and successful! \u{1F389}
Proceed to the Recipe stage to sequence the steps.`;
      }
    } else if (statesCPLossOtherwiseProfit) {
      feedback = "Spot on! Correct! Logic Approved! \u{1F389} You reasoned that when Cost Price is greater than Selling Price (or Selling Price is less than Cost Price) it is a Loss, and otherwise (when Selling Price is higher) it is a Profit. That logic is 100% sound, correct, and successful! Proceed to the Recipe stage to sequence the steps.";
    } else {
      feedback = "Spot on! Correct! Logic Approved! \u{1F389} You have clearly reasoned that if Selling Price exceeds Cost Price (SP > CP), it is a Profit, otherwise a Loss. Excellent logic, correct, and successful! Proceed to the Recipe stage to sequence the steps.";
    }
    correction = "Proceed to the Recipe stage to sequence the steps.";
    suggestedInput = void 0;
    matchedFirebaseInput = "the cost price is 50 and selling price is 100. if selling price is greater than cost price it is profit else loss";
  } else if (isQuestion) {
    feedback = `\u{1F31F} Coach Maya here! Let's understand this with a real numeric example:
\u2022 **Example 1 (Profit):** Suppose Cost Price is 50 and Selling Price is 100. Since Selling Price (100) is greater than Cost Price (50), you earned 50 more than you spent\u2014that is a **Profit of 50**!
\u2022 **Example 2 (Loss):** Suppose Cost Price is 100 and Selling Price is 70. Since Cost Price (100) is greater than Selling Price (70), you spent 30 more than you earned\u2014that is a **Loss of 30**!
\u2022 **General Rule:** If Selling Price is greater than Cost Price, it is Profit; otherwise if Cost Price is greater than Selling Price, it is Loss.

Now try writing your own rule or test it with numbers in your worksheet!`;
    correction = "Explain with numbers or words: SP > CP is Profit; CP > SP is Loss.";
    suggestedInput = "For example: cost price is 50 and selling price is 100. If selling price is greater than cost price it is profit, otherwise if cost price is greater than selling price it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss with an example of numbers";
  } else if (hasLossRule && !hasProfitRule) {
    if (costNumber !== null && sellingNumber !== null) {
      const diff = Math.abs(sellingNumber - costNumber);
      if (sellingNumber > costNumber) {
        feedback = `\u{1F31F} Coach Maya here! You've clearly identified the rule for **Loss**! Now look at your numbers: Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. Since Selling Price (${sellingNumber}) is greater than Cost Price (${costNumber}), this actually yields a **Profit** of ${diff}! You haven't defined what happens for Profit yet. Complete your logic by adding the rule for **Profit** (for example: 'otherwise Profit' or 'if selling price is greater than cost price it is profit')!`;
      } else {
        feedback = `\u{1F31F} Coach Maya here! You've clearly identified the rule for **Loss** (Cost Price > Selling Price), and your example numbers illustrate it (Cost Price ${costNumber} > Selling Price ${sellingNumber} = Loss of ${diff})! However, your logic is not complete yet because you haven't defined **Profit**! What happens in the opposite case when Selling Price is greater than Cost Price? Add the rule for **Profit** (for example: 'otherwise Profit') to complete your logic!`;
      }
      suggestedInput = `Cost price is ${costNumber} and selling price is ${sellingNumber}. If cost price is greater than selling price it is loss, otherwise profit.`;
      correction = "You've defined Loss! Now add the rule for Profit: 'otherwise Profit'.";
    } else {
      feedback = "\u{1F31F} Coach Maya here! You've clearly identified when a **Loss** happens (when Cost Price > Selling Price)! However, your logic is not complete yet because you haven't defined **Profit**! To make your logic complete for all transactions, what happens in the opposite case when Selling Price is greater than Cost Price? Add the rule for **Profit** (for example: 'otherwise Profit')!";
      correction = "You've defined Loss! Now add what happens when Selling Price > Cost Price: 'otherwise Profit'.";
      suggestedInput = "If cost price is greater than selling price it is loss, otherwise profit.";
    }
    matchedFirebaseInput = "the cost price is 50 and selling price is 100. if cost price is greater than selling price it is loss, otherwise profit";
  } else if (hasProfitRule && !hasLossRule) {
    if (costNumber !== null && sellingNumber !== null) {
      const diff = Math.abs(sellingNumber - costNumber);
      if (sellingNumber > costNumber) {
        feedback = `\u{1F31F} Coach Maya here! Great start! You've defined the rule for **Profit** (Selling Price > Cost Price gives a Profit of ${diff} for your numbers)! However, your logic is not complete yet because you haven't defined **Loss**! What happens in the opposite case when Cost Price is greater than Selling Price? Add 'otherwise Loss' to complete your logic!`;
      } else {
        feedback = `\u{1F31F} Coach Maya here! You've defined the rule for **Profit**! Looking at your numbers: Cost Price is ${costNumber} and Selling Price is ${sellingNumber}, which is a Loss of ${diff}. You haven't defined what happens for Loss yet! Add the rule for **Loss** (for example: 'otherwise Loss') to complete your logic!`;
      }
      suggestedInput = `Cost price is ${costNumber} and selling price is ${sellingNumber}. If selling price is greater than cost price it is profit, otherwise loss.`;
      correction = "You've defined Profit! Now add what happens when Cost Price > Selling Price: 'otherwise Loss'.";
    } else {
      feedback = "\u{1F31F} Coach Maya here! You've clearly identified when a **Profit** happens (when Selling Price > Cost Price)! However, your logic is not complete yet because you haven't defined **Loss**! To make your logic complete for all transactions, what happens in the opposite case when Cost Price is greater than Selling Price? Add the rule for **Loss** (for example: 'otherwise Loss')!";
      correction = "You've defined Profit! Now add what happens when Cost Price > Selling Price: 'otherwise Loss'.";
      suggestedInput = "If selling price is greater than cost price it is profit, otherwise loss.";
    }
    matchedFirebaseInput = "the cost price is 50 and selling price is 100. if selling price is greater than cost price it is profit else loss";
  } else if (hasCostPrice && hasSellingPrice && !hasProfitRule && !hasLossRule) {
    if (costNumber !== null && sellingNumber !== null) {
      const diff = Math.abs(sellingNumber - costNumber);
      const isProfitScenario = sellingNumber > costNumber;
      feedback = `\u{1F31F} Coach Maya here! Great start with your numbers: Cost Price is ${costNumber} and Selling Price is ${sellingNumber}. Since ${isProfitScenario ? `Selling Price (${sellingNumber}) is greater than Cost Price (${costNumber})` : `Cost Price (${costNumber}) is greater than Selling Price (${sellingNumber})`}, this results in a ${isProfitScenario ? `**Profit** of ${diff}` : `**Loss** of ${diff}`}! Now state your general rule: when is it Profit, and when is it Loss?`;
      correction = "State the rule: Selling Price > Cost Price is Profit, otherwise Loss.";
      suggestedInput = `cost price is ${costNumber} and selling price is ${sellingNumber}. If selling price is greater than cost price it is profit, otherwise loss.`;
    } else {
      feedback = "\u{1F31F} Coach Maya here! You have Cost Price and Selling Price ready! Now write the decision rule: If Selling Price is greater than Cost Price, what is it? And otherwise, what is it?";
      correction = "State the rule: Selling Price > Cost Price is Profit, otherwise Loss.";
      suggestedInput = "If selling price is greater than cost price it is profit, otherwise loss.";
    }
    matchedFirebaseInput = "how to calculate profit or loss";
  } else if ((hasCostPrice || hasSellingPrice) && (hasProfitConcept || hasLossConcept)) {
    feedback = "\u{1F31F} Coach Maya here! You're very close! Make sure to mention BOTH prices (Cost Price and Selling Price) and BOTH outcomes (Profit and Loss). When Selling Price is greater than Cost Price, it is Profit; otherwise Loss.";
    correction = "Explain both: SP > CP is Profit, and SP < CP is Loss.";
    suggestedInput = "If selling price is greater than cost price it is profit, otherwise loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  } else {
    feedback = "To understand Profit or Loss, think about two key values with an example: Cost Price (e.g. 50) and Selling Price (e.g. 100). When is it a Profit, and when is it a Loss?";
    correction = "State the rule: Selling Price > Cost Price is Profit; Selling Price < Cost Price is Loss.";
    suggestedInput = "For example: cost price is 50 and selling price is 100. If selling price is greater than cost price it is profit, otherwise if cost price is greater than selling price it is loss.";
    matchedFirebaseInput = "how to calculate profit or loss";
  }
  return {
    isFullyVerified,
    hasCostPrice,
    hasSellingPrice,
    hasProfitConcept,
    hasLossConcept,
    hasComparison,
    costNumber,
    sellingNumber,
    numericAnalysis,
    hasNumericContradiction,
    claimsCPGreaterThanSPIsProfit,
    claimsSPGreaterThanCPIsLoss,
    claimsProfitWhenSPLessThanCP,
    claimsLossWhenSPGreaterThanCP: claimsLossWhenCPMinor,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateProfitLossRecipe(input) {
  const text = (input || "").trim();
  const norm = text.toLowerCase().replace(/\s+/g, " ");
  const isQuestion = text.endsWith("?") || /\b(?:how|what|why|start|help|puriyala|theriyala|explain|guide|doubt|steps?|enna)\b/i.test(norm);
  const hasStep1Input = /\b(?:step\s*1|first|take|get|input|read|obtain|receive|ask)\b/i.test(norm) && (/\b(?:cost|cp)\b/i.test(norm) || /\b(?:selling|sp)\b/i.test(norm) || /\bpr[iy][sc]es?\b/i.test(norm)) || /\b(?:cost|cp)\b/i.test(norm) && /\b(?:selling|sp)\b/i.test(norm) && /\b(?:get|take|input|read|accept)\b/i.test(norm);
  const step2Text = norm.replace(/\b(?:problem\s*14|problem|program|topic|task|concept)?\s*[:\-]?\s*profit\s*(?:or|and|\/)\s*loss\b/gi, " ");
  const hasStep2Profit = /\b(?:display|announce|show|print|it\s*is|is|gives)?\s*(?:profit|gain)\b/i.test(step2Text) && /\b(?:profit|gain)\b/i.test(step2Text);
  const hasStep2Loss = /\b(?:display|announce|show|print|it\s*is|is|gives)?\s*(?:loss|lost)\b/i.test(step2Text) && /\b(?:loss|lost)\b/i.test(step2Text);
  const hasStep2Comparison = /\b(?:step\s*2|then|next|check|compare|if|when|otherwise|else)\b/i.test(norm) || /\b(?:gr[ea]+t[ea]*r|more|higher|less|smaller|lower|>|<)\b/i.test(norm);
  const hasStep2Decision = hasStep2Profit && hasStep2Loss && hasStep2Comparison;
  const claimsCPGreaterIsProfit = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|>)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:loss|lost)).)*?(?:display|print|announce|is)?\s*(?:profit|gain)/i.test(norm);
  const claimsSPGreaterIsLoss = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|>)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:profit|gain)).)*?(?:display|print|announce|is)?\s*(?:loss|lost)/i.test(norm);
  const claimsSPLessIsProfit = /(?:selling\s*pr[iy][sc]e|sp)\s*(?:is\s*)?(?:less|smaller|lower|<)\s*(?:than\s*)?(?:cost\s*pr[iy][sc]e|cp)(?:(?!(?:loss|lost)).)*?(?:display|print|announce|is)?\s*(?:profit|gain)/i.test(norm);
  const claimsCPLessIsLoss = /(?:cost\s*pr[iy][sc]e|cp)\s*(?:is\s*)?(?:less|smaller|lower|<)\s*(?:than\s*)?(?:selling\s*pr[iy][sc]e|sp)(?:(?!(?:profit|gain)).)*?(?:display|print|announce|is)?\s*(?:loss|lost)/i.test(norm);
  const hasContradiction = claimsCPGreaterIsProfit || claimsSPGreaterIsLoss || claimsSPLessIsProfit || claimsCPLessIsLoss;
  const steps = [
    {
      stepNumber: 1,
      title: "Step 1: Get Cost Price (CP) and Selling Price (SP)",
      completed: hasStep1Input,
      current: !hasStep1Input
    },
    {
      stepNumber: 2,
      title: "Step 2: Compare: If SP > CP display Profit, else display Loss",
      completed: hasStep2Decision && !hasContradiction,
      current: hasStep1Input && (!hasStep2Decision || hasContradiction)
    }
  ];
  const isFullyVerified = hasStep1Input && hasStep2Decision && !hasContradiction;
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasContradiction) {
    feedback = "\u{1F31F} Coach Maya recipe check: Take a moment to think about a shopkeeper! If they bought an item for \u20B9100 (Cost Price) and sold it for \u20B970 (Selling Price), did they make a profit? No, they lost \u20B930! When Cost Price is higher than Selling Price (or Selling Price is less than Cost Price), that means a Loss. When Selling Price is higher, that's a Profit! Let's fix Step 2: 'Step 2: If selling price is greater than cost price, display Profit, else display Loss'.";
    correction = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    suggestedInput = "Step 1: Get cost price and selling price.\nStep 2: If selling price is greater than cost price, display Profit, else display Loss.";
    matchedFirebaseInput = "what steps to write";
  } else if (!hasStep1Input && hasStep2Decision) {
    feedback = "\u{1F31F} Coach Maya here! You've already got your comparison decision rule down! \u{1F44F} But before our program can compare, where do the prices come from? We must first obtain the inputs! Add Step 1 first: 'Step 1: Get cost price and selling price'.";
    correction = "Step 1: Get cost price and selling price.";
    suggestedInput = "Step 1: Get cost price and selling price.\nStep 2: If selling price is greater than cost price, display Profit, else display Loss.";
    matchedFirebaseInput = "what steps to write";
  } else if (!hasStep1Input && !hasStep2Decision) {
    if (isQuestion) {
      feedback = "\u{1F31F} Coach Maya here! In the Recipe stage, we think like a chef writing step-by-step cooking instructions in plain English (strictly zero coding words!):\n\u2022 Step 1: Get the two starting values from the user\u2014cost price and selling price.\n\u2022 Step 2: Compare them\u2014if selling price is greater than cost price, display Profit, else display Loss.\nTry typing Step 1 in your worksheet to get started!";
    } else {
      feedback = "\u{1F31F} Coach Maya here! Let's begin our recipe by getting the starting values. What two prices do we need to obtain from the user? Write: 'Step 1: Get cost price and selling price'.";
    }
    correction = "Step 1: Get cost price and selling price.";
    suggestedInput = "Step 1: Get cost price and selling price.";
    matchedFirebaseInput = "what steps to write";
  } else if (hasStep1Input && hasStep2Loss && !hasStep2Profit) {
    feedback = "\u{1F31F} Coach Maya recipe check: Great work on Step 1, and you've clearly stated when to announce **Loss**! But you haven't defined what happens for **Profit** yet! A complete cooking recipe must tell the computer what to display in BOTH cases! Complete Step 2 by adding the Profit outcome: 'Step 2: If cost price is greater than selling price, display Loss, otherwise display Profit' (or 'Step 2: If selling price is greater than cost price, display Profit, else display Loss').";
    correction = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    suggestedInput = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    matchedFirebaseInput = "step 1 : Get cost price and selling price";
  } else if (hasStep1Input && hasStep2Profit && !hasStep2Loss) {
    feedback = "\u{1F31F} Coach Maya recipe check: Great work on Step 1, and you've clearly stated when to announce **Profit**! But you haven't defined what happens for **Loss** yet! A complete cooking recipe must tell the computer what to display in BOTH cases! Complete Step 2 by adding the Loss outcome: 'Step 2: If selling price is greater than cost price, display Profit, else display Loss'.";
    correction = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    suggestedInput = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    matchedFirebaseInput = "step 1 : Get cost price and selling price";
  } else if (hasStep1Input && !hasStep2Decision) {
    feedback = "\u{1F31F} Coach Maya here! High five! \u270B You nailed Step 1 by getting the cost price and selling price! Now, let's write Step 2: How do we compare selling price with cost price to announce whether it's a Profit or a Loss? Write: 'Step 2: If selling price is greater than cost price, display Profit, else display Loss'.";
    correction = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    suggestedInput = "Step 2: If selling price is greater than cost price, display Profit, else display Loss.";
    matchedFirebaseInput = "step 1 : Get cost price and selling price";
  } else {
    feedback = "\u{1F389} Outstanding! You have written a crystal-clear, sequential recipe algorithm: Step 1 gets the cost price and selling price, and Step 2 compares them to announce Profit or Loss! You are fully ready for the Ingredients stage\u2014let's go gather our coding tools! \u{1F680}";
    correction = "Proceed to the Ingredients stage to gather the programming tools.";
    suggestedInput = void 0;
    matchedFirebaseInput = "step 2 : If selling price is greater than cost price, display Profit, else display Loss";
  }
  return {
    isFullyVerified,
    hasRecipeContradiction: hasContradiction,
    recipeStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateProfitLossIngredients(input) {
  const text = (input || "").trim();
  const norm = text.toLowerCase().replace(/\s+/g, " ");
  const isQuestion = text.endsWith("?") || /\b(?:how|what|why|start|help|puriyala|theriyala|explain|guide|doubt|need|ingredients?|enna)\b/i.test(norm);
  const hasCostVar = /\b(?:cp|cost|cost_price|costprice|c)\b/i.test(norm) && /\b(?:variable|variables|input|step\s*1)\b/i.test(norm);
  const hasSellingVar = /\b(?:sp|selling|selling_price|sellingprice|s)\b/i.test(norm) && /\b(?:variable|variables|input|step\s*1)\b/i.test(norm);
  const hasVarDeclaration = hasCostVar && hasSellingVar || /\b(?:cp|cost)\b/i.test(norm) && /\b(?:sp|selling)\b/i.test(norm) && /\b(?:variables?|use|take|input)\b/i.test(norm) || /\bstep\s*1\b.*?\b(?:cp|cost|sp|selling)\b/i.test(norm);
  const hasLeftSide = /(?:l\.?s\b|left(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:sp|cp|selling|cost)/i.test(text);
  const hasRightSide = /(?:r\.?s\b|right(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:cp|sp|cost|selling)/i.test(text);
  const hasOperator = /(?:operator\s*[:=]?\s*[><]|>|<|\bgreater\b|\bless\b)/i.test(text);
  const hasDirectCondition = /\bif\s*\(\s*(?:sp|cp)\s*[><]\s*(?:cp|sp)\s*\)/i.test(text) || /\b(?:sp|cp)\s*[><]\s*(?:cp|sp)\b/i.test(text) || /\b(?:sp|selling(?:\s*price)?)\s*(?:is\s*)?(?:gr[ea]+t[ea]*r|more|higher|>)\s*(?:than\s*)?(?:cp|cost(?:\s*price)?)/i.test(text) || /\b(?:cp|cost(?:\s*price)?)\s*(?:is\s*)?(?:less|smaller|lower|<)\s*(?:than\s*)?(?:sp|selling(?:\s*price)?)/i.test(text);
  const hasLeftAndRight = hasLeftSide && hasRightSide || hasDirectCondition;
  const hasIfConditionDeclaration = /\b(?:if\s*condition|condition|step\s*2|if\s*statement|if\s*\()/i.test(norm) || hasDirectCondition;
  const lsIsCP = /(?:l\.?s\b|left(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:cp|cost)/i.test(text);
  const rsIsSP = /(?:r\.?s\b|right(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:sp|selling)/i.test(text);
  const opIsGreater = /operator\s*[:=]?\s*>/i.test(text) || /(?:l\.?s\b|left).*?>.*?(?:r\.?s\b|right)/i.test(text);
  const conditionClaimsCPGreaterSP = lsIsCP && rsIsSP && opIsGreater;
  const lsIsSP = /(?:l\.?s\b|left(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:sp|selling)/i.test(text);
  const rsIsCP = /(?:r\.?s\b|right(?:\s*side)?(?:\s*\([^\)]*\))?)\s*[:=]?\s*(?:cp|cost)/i.test(text);
  const opIsLess = /operator\s*[:=]?\s*</i.test(text) || /(?:l\.?s\b|left).*?<.*?(?:r\.?s\b|right)/i.test(text);
  const conditionClaimsSPLessCP = lsIsSP && rsIsCP && opIsLess;
  const conditionPortion = text.replace(/step\s*1[^.]*?(?:variables?|input)/gi, "");
  const directCPGreaterSP = /\bcp\s*>\s*sp\b/i.test(conditionPortion) || /\b(?:cp|cost)\s*(?:is\s*)?(?:greater|more|higher)\s*(?:than\s*)?(?:sp|selling)/i.test(conditionPortion);
  const hasWrongConditionForProfit = conditionClaimsCPGreaterSP || conditionClaimsSPLessCP || directCPGreaterSP;
  const hasValidCondition = hasIfConditionDeclaration && hasLeftAndRight && !hasWrongConditionForProfit;
  const hasQuotedProfitPrint = /(?:print|console\.log|display)\s*\(?\s*["'](?:it\s*is\s*)?profit["']\s*\)?/i.test(text) || /\b(?:in\s+if|inside\s+if|if\s+block|step\s*3).*?["']profit["']/i.test(norm);
  const mentionsLossInIf = /(?:in\s+if|inside\s+if|if\s+block|step\s*3)\b(?:(?!\belse\b).)*?\b(?:loss|lost)\b/i.test(norm);
  const hasInvertedIfPrint = mentionsLossInIf;
  const hasUnquotedProfitPrint = /(?:print|console\.log)\s*\(\s*profit\s*\)/i.test(text) || /\bprint\s+(?!["'`\(\s])profit\b/i.test(text);
  const hasUnquotedLossPrint = /(?:print|console\.log)\s*\(\s*loss\s*\)/i.test(text) || /\bprint\s+(?!["'`\(\s])loss\b/i.test(text);
  const hasUnquotedPrint = hasUnquotedProfitPrint || hasUnquotedLossPrint;
  const hasQuotedLossPrint = /(?:print|console\.log|display)\s*\(?\s*["'](?:it\s*is\s*)?loss["']\s*\)?/i.test(text) || /\b(?:in\s+else|inside\s+else|else\s+block|step\s*4|otherwise).*?["']loss["']/i.test(norm);
  function hasTrueOutputMention(s) {
    if (/\bloss\b/i.test(s) && !/\bprofit\b/i.test(s)) return false;
    return /\bprint\b/i.test(s) && /\bprofit\b/i.test(s);
  }
  function hasFalseOutputMention(s) {
    const hasElseContext = /\b(?:else|otherwise|step\s*4|false\s*block)\b/i.test(s);
    return /\bprint\b/i.test(s) && /\bloss\b/i.test(s) && hasElseContext;
  }
  const isStep1Done = hasVarDeclaration;
  const isStep2Done = hasValidCondition;
  const isStep3Done = !hasInvertedIfPrint && (hasQuotedProfitPrint || hasTrueOutputMention(norm) && !hasUnquotedProfitPrint);
  const isStep4Done = hasQuotedLossPrint || hasFalseOutputMention(norm) && !hasUnquotedLossPrint;
  const steps = [
    {
      stepNumber: 1,
      title: "Step 1: Input variables (cp, sp)",
      completed: isStep1Done,
      current: !isStep1Done
    },
    {
      stepNumber: 2,
      title: "Step 2: If condition (L.S: sp, Operator: >, R.S: cp)",
      completed: isStep2Done,
      current: isStep1Done && !isStep2Done
    },
    {
      stepNumber: 3,
      title: 'Step 3: Inside if block: print("Profit")',
      completed: isStep3Done,
      current: isStep1Done && isStep2Done && !isStep3Done
    },
    {
      stepNumber: 4,
      title: 'Step 4: Inside else block: print("Loss")',
      completed: isStep4Done,
      current: isStep1Done && isStep2Done && isStep3Done && !isStep4Done
    }
  ];
  const isFullyVerified = isStep1Done && isStep2Done && isStep3Done && isStep4Done && !hasInvertedIfPrint && !hasUnquotedPrint;
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  let matchedFirebaseInput = void 0;
  if (hasWrongConditionForProfit) {
    feedback = "\u{1F31F} Coach Maya ingredients check: Look closely at your operator and sides! You wrote `cp > sp`. If Cost Price is greater than Selling Price, that means a Loss! For Profit, Selling Price must be greater: Left Side (L.S): sp, Operator: >, Right Side (R.S): cp (or L.S: cp, Operator: <, R.S: sp).";
    correction = "step 2 : If condition with Left Side: sp, Operator: >, Right Side: cp";
    suggestedInput = "step 2 : If condition with L.S: sp, Operator: >, R.S: cp";
    matchedFirebaseInput = "how to write if condition";
  } else if (hasInvertedIfPrint) {
    feedback = '\u{1F31F} Coach Maya logic check: When `sp > cp` is true, Selling Price is higher, so it\'s a Profit! Put `print("Profit")` inside the `if` block (Step 3) and save `print("Loss")` for the `else` block (Step 4)!';
    correction = 'step 3 : Inside if block: print("Profit")';
    suggestedInput = 'step 3 : Inside if block: print("Profit")';
    matchedFirebaseInput = "what is next step";
  } else if (hasUnquotedPrint) {
    feedback = '\u{1F31F} Coach Maya syntax alert: You\'re super close! Just remember to wrap words inside print in quotation marks: `print("Profit")` and `print("Loss")`. Without quotes, JavaScript treats Profit and Loss as undefined variables!';
    correction = 'print("Profit");';
    suggestedInput = 'step 3 : Inside if block: print("Profit")\nstep 4 : Inside else block: print("Loss")';
    matchedFirebaseInput = "what is next step";
  } else if (!isStep1Done) {
    if (isQuestion) {
      feedback = '\u{1F31F} Coach Maya here! Just like gathering ingredients before cooking, let\'s gather our 4 coding ingredients for Profit or Loss:\n1. Input variables: `cp` and `sp`\n2. Condition: Left Side: `sp`, Operator: `>`, Right Side: `cp`\n3. True message: `print("Profit")`\n4. False message: `print("Loss")`\nLet\'s start with Step 1: Write `step 1 : cp and sp variables`!';
    } else {
      feedback = "\u{1F31F} Coach Maya here! Let's start with Step 1: To determine Profit or Loss, we need two input variables\u2014one for Cost Price (`cp`) and one for Selling Price (`sp`). Write: `step 1 : cp and sp variables`.";
    }
    correction = "step 1 : cp and sp variables";
    suggestedInput = "step 1 : cp and sp variables";
    matchedFirebaseInput = "what ingredients do we need";
  } else if (!isStep2Done) {
    feedback = "\u{1F31F} Coach Maya here! Great start! \u{1F3AF} You've got your two input variables: `cp` and `sp`! Now for Step 2: Let's break down the if condition into 3 simple parts:\n\u2022 Left Side (L.S): sp\n\u2022 Operator: >\n\u2022 Right Side (R.S): cp\nWrite: `step 2 : If condition with L.S: sp, Operator: >, R.S: cp`!";
    correction = "step 2 : If condition with Left Side: sp, Operator: >, Right Side: cp";
    suggestedInput = "step 2 : If condition with L.S: sp, Operator: >, R.S: cp";
    matchedFirebaseInput = "how to write if condition";
  } else if (!isStep3Done) {
    feedback = "\u{1F31F} Coach Maya here! Excellent work! \u{1F680} Variables and condition are ready! Now for Step 3: Inside the 'if' block, when `sp > cp` is true, what message should print? Remember to wrap your text in quotes: `step 3 : Inside if block: print(\"Profit\")`!";
    correction = 'step 3 : Inside if block: print("Profit")';
    suggestedInput = 'step 3 : Inside if block: print("Profit")';
    matchedFirebaseInput = "what is next step";
  } else if (!isStep4Done) {
    feedback = "\u{1F31F} Coach Maya here! You're almost at the finish line! \u{1F44F} Steps 1, 2, and 3 are locked in! Now for the final ingredient: Step 4! Inside the 'else' block (when the condition is false), what message should print? Wrap it in quotes: `step 4 : Inside else block: print(\"Loss\")`!";
    correction = 'step 4 : Inside else block: print("Loss")';
    suggestedInput = 'step 4 : Inside else block: print("Loss")';
    matchedFirebaseInput = "what is next step";
  } else {
    feedback = '\u{1F389} Hurray! You have identified all 4 programming ingredients: variables `cp` and `sp`, if-condition `sp > cp`, `print("Profit")`, and `print("Loss")`! Proceed to Taste the Sample stage to build your working prototype! \u{1F680}';
    correction = "Proceed to Taste the Sample stage to assemble your code!";
    suggestedInput = void 0;
    matchedFirebaseInput = "step 2 : If condition with L.S: sp, R.S: cp, Operator: >";
  }
  return {
    isFullyVerified,
    hasInvertedIfPrint,
    hasUnquotedPrint,
    ingredientsStepProgress: steps,
    feedback,
    correction,
    suggestedInput,
    matchedFirebaseInput
  };
}
function validateProfitLossSampleCode(input, attemptCount = 1) {
  const text = (input || "").trim();
  const norm = text.toLowerCase().replace(/\s+/g, " ");
  const isQuestion = text.endsWith("?") || /\b(?:how|what|why|start|help|puriyala|theriyala|explain|guide|doubt|syntax|sample|code|enna)\b/i.test(norm);
  const hasCostVar = /\b(?:var|let|const|int|float|double)?\s*(?:cp|cost|cost_price)\s*=\s*\d+/i.test(text);
  const hasSellingVar = /\b(?:var|let|const|int|float|double)?\s*(?:sp|selling|selling_price)\s*=\s*\d+/i.test(text);
  const hasCondition = /\bif\s*\(\s*(?:sp|selling)\s*>\s*(?:cp|cost)\s*\)/i.test(text) || /\bif\s+(?:sp|selling)\s*>\s*(?:cp|cost)\s*:/i.test(text) || /\b(?:sp|selling)\s*>\s*(?:cp|cost)\b/i.test(text) || /\bif\s*\(\s*(?:cp|cost)\s*<\s*(?:sp|selling)\s*\)/i.test(text);
  const hasElseWithCondition = /\belse\s*\([^)]*\)/i.test(text);
  const hasQuotedPositivePrint = /print\s*\(\s*["']profit["']\s*\)/i.test(text) || /print\s*\(?["'](?:it\s*is\s*)?profit["']\)?/i.test(text);
  const hasQuotedNegativePrint = /print\s*\(\s*["']loss["']\s*\)/i.test(text) || /print\s*\(?["'](?:it\s*is\s*)?loss["']\)?/i.test(text);
  const hasUnquotedPositivePrint = /print\s*\(\s*profit\s*\)/i.test(text);
  const hasUnquotedNegativePrint = /print\s*\(\s*loss\s*\)/i.test(text);
  const hasElse = /\belse\b/i.test(text) && !hasElseWithCondition;
  const hasInvertedBranches = /if\s*\([^)]*\)\s*\{?\s*print\s*\(\s*["']?loss["']?\s*\)/i.test(text) || /if\s*:\s*print\s*\(\s*["']?loss["']?\s*\)/i.test(text);
  const steps = [
    {
      stepNumber: 1,
      title: "Step 1: Declare input variables (cp, sp)",
      completed: hasCostVar && hasSellingVar,
      current: !(hasCostVar && hasSellingVar)
    },
    {
      stepNumber: 2,
      title: "Step 2: Write if condition (sp > cp)",
      completed: hasCondition,
      current: hasCostVar && hasSellingVar && !hasCondition
    },
    {
      stepNumber: 3,
      title: 'Step 3: Print "Profit" inside if block',
      completed: hasQuotedPositivePrint && !hasInvertedBranches,
      current: hasCondition && (!hasQuotedPositivePrint || hasInvertedBranches)
    },
    {
      stepNumber: 4,
      title: "Step 4: Add else branch",
      completed: hasElse,
      current: hasQuotedPositivePrint && !hasElse
    },
    {
      stepNumber: 5,
      title: 'Step 5: Print "Loss" inside else block',
      completed: hasQuotedNegativePrint,
      current: hasElse && !hasQuotedNegativePrint
    }
  ];
  const allVerified = hasCostVar && hasSellingVar && hasCondition && hasQuotedPositivePrint && hasElse && hasQuotedNegativePrint && !hasElseWithCondition && !hasInvertedBranches;
  let feedback = "";
  let correction = "";
  let suggestedInput = void 0;
  if (hasInvertedBranches) {
    feedback = '\u{1F31F} Coach Maya logic check: Look closely at your test numbers! If Cost Price is 100 and Selling Price is 150, `sp > cp` is TRUE, which is a Profit! Inside the `if` block, print `"Profit"`, and inside the `else` block, print `"Loss"`.';
    correction = 'if (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}';
    suggestedInput = 'if (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}';
  } else if (hasElseWithCondition) {
    feedback = "\u{1F31F} Coach Maya syntax alert: Look closely at your `else` statement: `else(...)`! In programming, `else` is the automatic fallback for everything else\u2014it does NOT take parentheses or a condition. Simply write: `else {`.";
    correction = 'else {\n  print("Loss");\n}';
    suggestedInput = 'else {\n  print("Loss");\n}';
  } else if (!(hasCostVar && hasSellingVar)) {
    if (isQuestion) {
      feedback = "\u{1F31F} Coach Maya here! Ready to build our code prototype? Don't worry about syntax\u2014we'll build it line by line together!\nLet's start with Step 1: Declare two test variables with numbers:\n`var cp = 100;`\n`var sp = 150;`\nType that first line in your code window!";
    } else {
      feedback = "\u{1F31F} Coach Maya here! Ready to build our prototype? Let's start with Step 1: Declare two variables with test prices\u2014for example `var cp = 100; var sp = 150;`. How would you write that first line?";
    }
    correction = "var cp = 100;\nvar sp = 150;";
    suggestedInput = "var cp = 100;\nvar sp = 150;";
  } else if (!hasCondition) {
    if (attemptCount >= 3) {
      feedback = "\u{1F31F} Coach Maya with a scaffolded syntax tip! Here is how we connect your variables to the condition:\n\u2022 Left Side: `sp`\n\u2022 Comparison: `>`\n\u2022 Right Side: `cp`\nWrap it like this: `if (sp > cp) {`";
    } else if (attemptCount === 2) {
      feedback = "\u{1F31F} Coach Maya checking back! Since Selling Price (150) is greater than Cost Price (100), testing `sp > cp` lets the code decide whether to reward profit! Write your comparison: `if (sp > cp) {`.";
    } else {
      feedback = "\u{1F31F} Coach Maya here! Fantastic! You've declared your variables `cp = 100` and `sp = 150`! \u{1F44F} Now for Step 2: Write the `if` statement to test if selling price is greater than cost price: `if (sp > cp) {`.";
    }
    correction = 'if (sp > cp) {\n  print("Profit");\n}';
    suggestedInput = 'if (sp > cp) {\n  print("Profit");\n}';
  } else if (!hasQuotedPositivePrint) {
    if (hasUnquotedPositivePrint) {
      feedback = '\u{1F31F} Coach Maya syntax alert: Wrap the word Profit in quotation marks: `print("Profit");`. Without quotes, the compiler looks for an undeclared variable named Profit!';
      correction = 'print("Profit");';
      suggestedInput = 'print("Profit");';
    } else {
      feedback = '\u{1F31F} Coach Maya here! Great condition! Now inside the `{` curly braces `}` of your `if` block, print the winning message: `print("Profit");`.';
      correction = 'print("Profit");';
      suggestedInput = 'print("Profit");';
    }
  } else if (!hasElse) {
    feedback = "\u{1F31F} Coach Maya here! You have the positive profit branch ready! Now for Step 4: What happens if selling price is not greater than cost price? Add the fallback `else` branch: `else {`.";
    correction = 'else {\n  print("Loss");\n}';
    suggestedInput = 'else {\n  print("Loss");\n}';
  } else if (!hasQuotedNegativePrint) {
    if (hasUnquotedNegativePrint) {
      feedback = '\u{1F31F} Coach Maya syntax alert: Inside the `else` block, wrap your message in quotation marks: `print("Loss");`.';
      correction = 'print("Loss");';
      suggestedInput = 'print("Loss");';
    } else {
      feedback = '\u{1F31F} Coach Maya here! Almost done! Inside the `else` block, print the loss message: `print("Loss");`.';
      correction = 'print("Loss");';
      suggestedInput = 'print("Loss");';
    }
  } else {
    feedback = "\u{1F389} Woohoo! You gotcha! Spot on comparison prototype! \u{1F3C6} You have successfully implemented Profit or Loss determination with clean variables, proper `if (sp > cp)` condition, quoted messages, and neat branching! You are an algorithmic champion! \u{1F680}";
    correction = 'var cp = 100;\nvar sp = 150;\nif (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}';
    suggestedInput = 'var cp = 100;\nvar sp = 150;\nif (sp > cp) {\n  print("Profit");\n} else {\n  print("Loss");\n}';
  }
  return {
    allVerified,
    hasCostVar,
    hasSellingVar,
    hasCondition,
    hasPositivePrint: hasQuotedPositivePrint,
    hasElse,
    hasNegativePrint: hasQuotedNegativePrint,
    hasElseWithCondition,
    hasInvertedBranches,
    feedback,
    correction,
    suggestedInput,
    sampleCodeStepProgress: steps
  };
}
export {
  validateProfitLossIngredients,
  validateProfitLossLogic,
  validateProfitLossRecipe,
  validateProfitLossSampleCode
};
