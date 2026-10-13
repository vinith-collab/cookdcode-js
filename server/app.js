import express from "express";
import dotenv from "dotenv";
import { aiMentorRouter } from "./routes/aiMentorRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/ai-mentor", aiMentorRouter);
app.use("/api", aiMentorRouter);
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
