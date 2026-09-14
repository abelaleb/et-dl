import { normalizeAmharic, tokenizeText } from "../nlp/amharic-normalizer";

/**
 * Calculates cosine similarity between two numeric vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Lightweight deterministic n-gram vector generator for local zero-dependency RAG.
 * Produces a normalized 128-dimensional vector based on character and word n-grams,
 * ensuring robust fuzzy matching across both English and Ethiopic Fidel tokens.
 */
export function generateLocalEmbedding(text: string, dimensions = 128): number[] {
  const vector = new Array(dimensions).fill(0);
  const normalized = normalizeAmharic(text).toLowerCase();
  const tokens = tokenizeText(normalized);

  if (tokens.length === 0 && normalized.length === 0) return vector;

  // 1. Hash word tokens
  for (const token of tokens) {
    let hash = 0;
    for (let i = 0; i < token.length; i++) {
      hash = (hash << 5) - hash + token.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % dimensions;
    vector[index] += 2.0;
  }

  // 2. Hash character 3-grams for typo and homophone resilience
  for (let i = 0; i < normalized.length - 2; i++) {
    const trigram = normalized.substring(i, i + 3);
    let hash = 0;
    for (let j = 0; j < 3; j++) {
      hash = (hash << 5) - hash + trigram.charCodeAt(j);
      hash |= 0;
    }
    const index = Math.abs(hash) % dimensions;
    vector[index] += 0.5;
  }

  // L2 Normalize
  let norm = 0;
  for (let i = 0; i < dimensions; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) {
      vector[i] = vector[i] / norm;
    }
  }

  return vector;
}

/**
 * Generate embedding vector using Gemini, OpenAI, or the built-in local vectorizer
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text }] },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data?.embedding?.values) {
          return data.embedding.values;
        }
      }
    } catch {
      // Fallback to local
    }
  }

  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "text-embedding-3-small",
          input: text,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.data?.[0]?.embedding) {
          return data.data[0].embedding;
        }
      }
    } catch {
      // Fallback to local
    }
  }

  // Zero-dependency local fallback
  return generateLocalEmbedding(text);
}
