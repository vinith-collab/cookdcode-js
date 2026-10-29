import fetch from "node-fetch";

const COMMON_TYPOS = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmal.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com"
};

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "dispostable.com",
  "getnada.com"
]);

/**
 * Validates an email address for format, domain existence (MX via Google DoH),
 * typos, disposable provider, and optional external API (ZeroBounce / Hunter / AbstractAPI).
 * @param {string} email
 * @returns {Promise<{valid: boolean, error?: string, suggestion?: string}>}
 */
export async function validateEmailAddress(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email address is required." };
  }

  const clean = email.trim().toLowerCase();

  // 1. Syntax check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: "Please enter a valid email format." };
  }

  const parts = clean.split("@");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid email address." };
  }

  const [user, domain] = parts;

  if (user.length > 64 || clean.length > 254) {
    return { valid: false, error: "Email address is too long." };
  }

  // 2. Common typo check
  if (COMMON_TYPOS[domain]) {
    const suggested = `${user}@${COMMON_TYPOS[domain]}`;
    return {
      valid: false,
      error: `Did you mean ${suggested}? The domain '@${domain}' is likely a typo.`,
      suggestion: suggested
    };
  }

  // 3. Disposable email check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "Temporary or disposable email addresses are not allowed."
    };
  }

  // 4. External Verification API (if configured in .env)
  // 4A. ZeroBounce
  if (process.env.ZEROBOUNCE_API_KEY) {
    try {
      const zbUrl = `https://api.zerobounce.net/v2/validate?api_key=${encodeURIComponent(process.env.ZEROBOUNCE_API_KEY)}&email=${encodeURIComponent(clean)}`;
      const zbRes = await fetch(zbUrl, { timeout: 5000 });
      if (zbRes.ok) {
        const zbData = await zbRes.json();
        if (zbData.status === "invalid") {
          return {
            valid: false,
            error: "This email address does not exist. Please enter a valid email."
          };
        }
      }
    } catch (zbErr) {
      console.warn("[EmailValidator] ZeroBounce check failed, falling back:", zbErr.message);
    }
  }

  // 4B. Hunter.io
  if (process.env.HUNTER_API_KEY) {
    try {
      const hUrl = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(clean)}&api_key=${encodeURIComponent(process.env.HUNTER_API_KEY)}`;
      const hRes = await fetch(hUrl, { timeout: 5000 });
      if (hRes.ok) {
        const hData = await hRes.json();
        if (hData.data && hData.data.result === "undeliverable") {
          return {
            valid: false,
            error: "This email address does not exist. Please enter a valid email."
          };
        }
      }
    } catch (hErr) {
      console.warn("[EmailValidator] Hunter check failed, falling back:", hErr.message);
    }
  }

  // 5. DNS MX Record Check via Google DoH (Domain Existence & Mail Server verification)
  try {
    const dohUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`;
    const dohRes = await fetch(dohUrl, { timeout: 4000 });
    if (dohRes.ok) {
      const dohData = await dohRes.json();
      // Status 3 = NXDOMAIN (Domain does not exist)
      if (dohData.Status === 3 || (!dohData.Answer && !dohData.Authority)) {
        return {
          valid: false,
          error: `The email domain '@${domain}' does not exist.`
        };
      }

      // Check if there are MX records in Answer
      const hasMx = Array.isArray(dohData.Answer) && dohData.Answer.some(a => a.type === 15);
      if (!hasMx) {
        // Also check if domain has A record (RFC 5321 fallback)
        const aUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
        const aRes = await fetch(aUrl, { timeout: 4000 });
        const aData = await aRes.json();
        const hasA = Array.isArray(aData.Answer) && aData.Answer.some(a => a.type === 1);
        if (!hasA) {
          return {
            valid: false,
            error: `The domain '@${domain}' cannot receive emails.`
          };
        }
      }
    }
  } catch (dnsErr) {
    console.warn("[EmailValidator] Google DoH lookup warning:", dnsErr.message);
  }

  return { valid: true };
}
