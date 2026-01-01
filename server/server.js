import Fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Recommendation from "./models/recommendation.js";

dotenv.config();
function extractJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON Parse Failed:", text);
    throw new Error("Invalid AI JSON response");
  }
}

const fastify = Fastify({ logger: true });

// CORS
await fastify.register(cors, {
  origin: true,
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// OpenAI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

// API Route
fastify.post("/recommend", async (request, reply) => {
  try {
    const { user_input } = request.body;

    if (!user_input) {
      return reply.status(400).send({ error: "user_input is required" });
    }

    const prompt = `
You are an API.
Return ONLY valid JSON.
No explanation.

Format:
["Movie 1", "Movie 2", "Movie 3", "Movie 4"]

User preference:
"${user_input}"
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const movies = extractJSON(text);

    const saved = await Recommendation.create({
      userInput: user_input,
      recommendedMovies: movies,
    });

    reply.send({
      recommendations: movies,
      savedId: saved._id,
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({
      error: "Gemini API error",
      message: error.message,
    });
  }
});
const PORT = process.env.PORT || 3000;

fastify.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`Server running on port ${PORT}`);
});
