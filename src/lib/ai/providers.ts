import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

export function getChatModel() {
  const provider = process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "google" : "openai");

  if (provider === "google") {
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    return {
      provider: "google",
      model: google(modelName),
    };
  }

  const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini";
  return {
    provider: "openai",
    model: openai(modelName),
  };
}

export function hasConfiguredAI(): boolean {
  return !!(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.OPENAI_API_KEY
  );
}
