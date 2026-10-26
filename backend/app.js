import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { aiMentorRouter } from "./routes/aiMentorRoutes.js";
import { sendOtpEmail } from "./services/emailService.js";
import { authenticateUser, findUserByEmail, updateUserPassword } from "./services/authService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
app.use(express.json());
app.use("/api/ai-mentor", aiMentorRouter);
app.use("/api", aiMentorRouter);

// In-memory OTP storage with expiration
const activeOtps = new Map();

app.post("/api/sendOtp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtps.set(cleanEmail, { otp, expiresAt });

    const result = await sendOtpEmail(cleanEmail, otp);
    return res.json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}`,
      otp: result.otp || otp,
      previewUrl: result.previewUrl || null,
      mode: result.mode
    });
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({ error: "Failed to send OTP: " + err.message });
  }
});

app.post("/api/verifyOtp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ valid: false, error: "Email and OTP are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const record = activeOtps.get(cleanEmail);

  if (!record) {
    return res.status(400).json({ valid: false, error: "No OTP requested for this email or it has expired." });
  }

  if (Date.now() > record.expiresAt) {
    activeOtps.delete(cleanEmail);
    return res.status(400).json({ valid: false, error: "OTP has expired. Please request a new one." });
  }

  if (record.otp === otp.trim()) {
    activeOtps.delete(cleanEmail);
    return res.json({ valid: true, message: "OTP verified successfully." });
  }

  return res.status(400).json({ valid: false, error: "Invalid OTP. Please check the code and try again." });
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }
    const result = await authenticateUser(email, password);
    if (result.success) {
      return res.json(result);
    }
    return res.status(401).json(result);
  } catch (err) {
    console.error("Login route error:", err);
    return res.status(500).json({ success: false, error: "Server error during login: " + err.message });
  }
});

app.post("/api/findUser", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ exists: false, error: "Email is required." });
    }
    const userMatch = await findUserByEmail(email);
    if (userMatch) {
      const data = userMatch.data;
      const name = data.name || (data.firstname ? `${data.firstname} ${data.lastname || ""}`.trim() : "Coder");
      return res.json({
        exists: true,
        userKey: userMatch.key,
        val: {
          email: data.email,
          name,
          phone: data.phone || ""
        }
      });
    }
    return res.json({ exists: false });
  } catch (err) {
    console.error("findUser route error:", err);
    return res.status(500).json({ exists: false, error: err.message });
  }
});

app.post("/api/updatePassword", async (req, res) => {
  try {
    const { userKey, newPassword } = req.body;
    if (!userKey || !newPassword) {
      return res.status(400).json({ success: false, error: "User key and new password are required." });
    }
    const result = await updateUserPassword(userKey, newPassword);
    return res.json(result);
  } catch (err) {
    console.error("updatePassword route error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "online",
    platform: "CookDcode",
    engine: "Cook The Code (CTC) AI Mentor",
    version: "2.0.0",
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});
export {
  app
};
