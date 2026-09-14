/**
 * Ethiopic (Ge'ez / Amharic) NLP Normalization & Tokenization Utility
 * 
 * Standardizes Amharic homophones (ሀ/ሐ/ኀ, ሰ/ሠ, አ/ዐ, ጸ/ፀ) and Ge'ez punctuation
 * to maximize recall and semantic accuracy across searches and embeddings.
 */

// Mapping of phonetic homophone variants to canonical Fidel characters
const HOMOPHONE_MAP: Record<string, string> = {
  // Ha variants -> ሀ
  "ሐ": "ሀ", "ኀ": "ሀ",
  "ሑ": "ሁ", "ኁ": "ሁ",
  "ሒ": "ሂ", "ኺ": "ሂ",
  "ሓ": "ሃ", "ኃ": "ሃ",
  "ሔ": "ሄ", "ኼ": "ሄ",
  "ሕ": "ህ", "ኅ": "ህ",
  "ሖ": "ሆ", "ኆ": "ሆ",

  // Se variants (ሠ -> ሰ)
  "ሠ": "ሰ",
  "ሡ": "ሱ",
  "ሢ": "ሲ",
  "ሣ": "ሳ",
  "ሤ": "ሴ",
  "ሥ": "ስ",
  "ሦ": "ሶ",

  // A variants (ዐ -> አ)
  "ዐ": "አ",
  "ዑ": "ኡ",
  "ዒ": "ኢ",
  "ዓ": "ኣ",
  "ዔ": "ኤ",
  "ዕ": "እ",
  "ዖ": "ኦ",

  // Tse variants (ፀ -> ጸ)
  "ፀ": "ጸ",
  "ፁ": "ጹ",
  "ፂ": "ጺ",
  "ፃ": "ጻ",
  "ፄ": "ጼ",
  "ፅ": "ጽ",
  "ፆ": "ጾ",
};

// Ethiopic punctuation to standard ASCII
const PUNCTUATION_MAP: Record<string, string> = {
  "፡": " ", // Ge'ez word separator
  "።": ".", // Ge'ez full stop
  "፣": ",", // Ge'ez comma
  "፤": ";", // Ge'ez semicolon
  "፦": ":", // Ge'ez preface colon
  "፧": "?", // Ge'ez question mark
  "፨": "\n", // Ge'ez paragraph separator
};

/**
 * Check if the text contains Ge'ez/Ethiopic Unicode characters (\u1200 - \u137F)
 */
export function isAmharic(text: string): boolean {
  return /[\u1200-\u137F]/.test(text);
}

/**
 * Normalizes Amharic text by harmonizing homophones, replacing Ethiopic punctuation,
 * and trimming whitespace.
 */
export function normalizeAmharic(text: string): string {
  if (!text) return "";

  let result = "";
  for (const char of text) {
    if (HOMOPHONE_MAP[char]) {
      result += HOMOPHONE_MAP[char];
    } else if (PUNCTUATION_MAP[char]) {
      result += PUNCTUATION_MAP[char];
    } else {
      result += char;
    }
  }

  // Collapse multiple spaces
  return result.replace(/\s+/g, " ").trim();
}

/**
 * Tokenizes text into normalized words for keyword search.
 * Supports both Latin and Ethiopic scripts.
 */
export function tokenizeText(text: string): string[] {
  const normalized = normalizeAmharic(text).toLowerCase();
  // Split on whitespace or non-word punctuation
  return normalized
    .split(/[\s,.;:?!'"`()\[\]{}<>\/\\-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

/**
 * Computes BM25-style keyword overlap score between query and document text.
 */
export function computeKeywordOverlap(query: string, document: string): number {
  const queryTokens = tokenizeText(query);
  if (queryTokens.length === 0) return 0;

  const docNormalized = normalizeAmharic(document).toLowerCase();
  const docTokens = new Set(tokenizeText(document));

  let matches = 0;
  for (const token of queryTokens) {
    if (docTokens.has(token) || docNormalized.includes(token)) {
      matches++;
    }
  }

  return matches / queryTokens.length;
}
