const FIREBASE_RTDB_URL = "https://cookdcode-4ce23-default-rtdb.firebaseio.com";

// Map: lowercase email -> Array of { key, email, password, firstname, lastname, name, phone, tokens }
const emailUserMap = new Map();
let indexingPromise = null;
let lastIndexTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Builds the email -> userKey index by fetching only /users/${k}/email.json.
 * This takes only ~1.5 seconds and avoids downloading massive objects (e.g. profileImage base64).
 */
async function refreshEmailIndex(force = false) {
  if (indexingPromise) {
    return indexingPromise;
  }
  if (!force && emailUserMap.size > 0 && Date.now() - lastIndexTime < CACHE_TTL_MS) {
    return;
  }

  indexingPromise = (async () => {
    try {
      const shallowRes = await fetch(`${FIREBASE_RTDB_URL}/users.json?shallow=true`);
      if (!shallowRes.ok) return;

      const keysObj = await shallowRes.json();
      if (!keysObj || typeof keysObj !== "object") return;

      const keys = Object.keys(keysObj);

      // Parallel fetch of just emails for all keys
      const emailResults = await Promise.all(
        keys.map(async (k) => {
          try {
            const res = await fetch(`${FIREBASE_RTDB_URL}/users/${k}/email.json`);
            if (!res.ok) return null;
            const emailVal = await res.json();
            if (typeof emailVal === "string" && emailVal.trim()) {
              return { key: k, email: emailVal.trim() };
            }
          } catch (_) {}
          return null;
        })
      );

      // Rebuild email map preserving cached passwords if already fetched
      const newMap = new Map();
      for (const item of emailResults) {
        if (!item) continue;
        const normEmail = item.email.toLowerCase();
        const list = newMap.get(normEmail) || [];

        // Check if we already cached this key's profile in existing map
        const existingList = emailUserMap.get(normEmail) || [];
        const cached = existingList.find((x) => x.key === item.key);

        list.push(cached || { key: item.key, email: item.email });
        newMap.set(normEmail, list);
      }

      emailUserMap.clear();
      for (const [k, v] of newMap.entries()) {
        emailUserMap.set(k, v);
      }
      lastIndexTime = Date.now();
      console.log(`[AuthService] Indexed ${emailUserMap.size} user emails in memory.`);
    } catch (err) {
      console.warn("[AuthService] Error in refreshEmailIndex:", err?.message || err);
    } finally {
      indexingPromise = null;
    }
  })();

  return indexingPromise;
}

/**
 * Loads detailed user profile for a specific user key without fetching huge images.
 */
async function loadUserData(userKey) {
  try {
    const [pwdRes, emRes, fnRes, lnRes, nmRes, phRes, tkRes] = await Promise.all([
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/password.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/email.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/firstname.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/lastname.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/name.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/phone.json`),
      fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/tokens.json`)
    ]);

    const password = (await pwdRes.json()) ?? "";
    const email = (await emRes.json()) ?? "";
    const firstname = (await fnRes.json()) ?? "";
    const lastname = (await lnRes.json()) ?? "";
    const directName = (await nmRes.json()) ?? "";
    const phone = (await phRes.json()) ?? "";
    const tokens = (await tkRes.json()) ?? 10;

    const name = directName || `${firstname} ${lastname}`.trim() || "Coder";

    return {
      key: userKey,
      email,
      password: String(password),
      firstname,
      lastname,
      name,
      phone: String(phone),
      tokens: Number(tokens)
    };
  } catch (err) {
    console.warn(`[AuthService] Error loading user data for ${userKey}:`, err?.message || err);
    return null;
  }
}

/**
 * Authenticates user credentials.
 */
async function authenticateUser(email, password) {
  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const target = email.trim().toLowerCase();

  // If cache is empty, refresh once
  if (emailUserMap.size === 0) {
    await refreshEmailIndex(true);
  }

  let accounts = emailUserMap.get(target);

  // If still not found, force refresh in case user signed up recently
  if (!accounts || accounts.length === 0) {
    await refreshEmailIndex(true);
    accounts = emailUserMap.get(target);
  }

  if (!accounts || accounts.length === 0) {
    return {
      success: false,
      error: "No account found with this email address. Please check or sign up."
    };
  }

  // Load details for all matching accounts if not already loaded
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    if (!acc.password) {
      const full = await loadUserData(acc.key);
      if (full) {
        accounts[i] = full;
      }
    }
  }

  // Match password
  const matched = accounts.find((a) => a.password && a.password === password);

  if (matched) {
    return {
      success: true,
      userKey: matched.key,
      email: matched.email || email,
      name: matched.name || "Coder",
      phone: matched.phone || "",
      tokens: matched.tokens ?? 10
    };
  }

  return {
    success: false,
    error: "Incorrect password. Please try again."
  };
}

/**
 * Finds user accounts by email address.
 */
async function findUserByEmail(email) {
  if (!email) return null;
  const target = email.trim().toLowerCase();

  if (emailUserMap.size === 0) {
    await refreshEmailIndex(true);
  }

  let accounts = emailUserMap.get(target);
  if (!accounts || accounts.length === 0) {
    await refreshEmailIndex(true);
    accounts = emailUserMap.get(target);
  }

  if (!accounts || accounts.length === 0) {
    return null;
  }

  // Use the latest account
  const lastAcc = accounts[accounts.length - 1];
  if (!lastAcc.name) {
    const full = await loadUserData(lastAcc.key);
    if (full) {
      accounts[accounts.length - 1] = full;
      return { key: full.key, data: full };
    }
  }

  return { key: lastAcc.key, data: lastAcc };
}

/**
 * Updates a user's password in Firebase RTDB and local cache.
 */
async function updateUserPassword(userKey, newPassword) {
  if (!userKey || !newPassword) {
    return { success: false, error: "User key and new password are required." };
  }

  const res = await fetch(`${FIREBASE_RTDB_URL}/users/${userKey}/password.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPassword)
  });

  if (!res.ok) {
    return { success: false, error: "Failed to update password in database." };
  }

  // Update in local cache
  for (const list of emailUserMap.values()) {
    for (const item of list) {
      if (item.key === userKey) {
        item.password = String(newPassword);
      }
    }
  }

  return { success: true };
}

// Background index warm up
refreshEmailIndex().catch(() => {});

export {
  authenticateUser,
  findUserByEmail,
  refreshEmailIndex as refreshUserIndex,
  updateUserPassword
};
