import { IVectorStore, SearchOptions } from "./vector-store";
import { KnowledgeChunk, SearchResult } from "../types";
import { KNOWLEDGE_CHUNKS } from "../knowledge-data";
import { cosineSimilarity, generateLocalEmbedding, getEmbedding } from "../embeddings";
import { computeKeywordOverlap, normalizeAmharic } from "../../nlp/amharic-normalizer";

export class LocalVectorStore implements IVectorStore {
  private chunks: KnowledgeChunk[] = [];
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    // Load static knowledge base and pre-compute local embeddings if missing
    this.chunks = KNOWLEDGE_CHUNKS.map((chunk) => {
      if (!chunk.embedding || chunk.embedding.length === 0) {
        const textToEmbed = `${chunk.titleAm} ${chunk.titleEn} ${chunk.contentAm} ${chunk.contentEn} ${(chunk.keywordsAm || []).join(" ")} ${(chunk.keywordsEn || []).join(" ")}`;
        return {
          ...chunk,
          embedding: generateLocalEmbedding(textToEmbed),
        };
      }
      return chunk;
    });

    this.isInitialized = true;
  }

  async addChunks(newChunks: KnowledgeChunk[]): Promise<void> {
    await this.init();
    for (const chunk of newChunks) {
      if (!chunk.embedding) {
        const textToEmbed = `${chunk.titleAm} ${chunk.titleEn} ${chunk.contentAm} ${chunk.contentEn}`;
        chunk.embedding = generateLocalEmbedding(textToEmbed);
      }
      this.chunks.push(chunk);
    }
  }

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    await this.init();
    const { topK = 4, category, minScore = 0.15 } = options;

    const normalizedQuery = normalizeAmharic(query);
    const queryEmbedding = await getEmbedding(normalizedQuery);

    const scoredResults: SearchResult[] = [];

    for (const chunk of this.chunks) {
      if (category && chunk.category !== category) {
        continue;
      }

      // 1. Vector Dense Cosine Similarity
      const similarity = chunk.embedding
        ? cosineSimilarity(queryEmbedding, chunk.embedding)
        : 0;

      // 2. Sparse Keyword Matching on Amharic and English contents
      const combinedDoc = `${chunk.titleAm} ${chunk.titleEn} ${chunk.contentAm} ${chunk.contentEn} ${(chunk.keywordsAm || []).join(" ")} ${(chunk.keywordsEn || []).join(" ")}`;
      const keywordScore = computeKeywordOverlap(query, combinedDoc);

      // 3. Hybrid weighted combination (60% Dense + 40% Keyword)
      const finalScore = 0.6 * similarity + 0.4 * keywordScore;

      if (finalScore >= minScore) {
        scoredResults.push({
          chunk,
          similarity,
          keywordScore,
          finalScore,
        });
      }
    }

    // Sort descending by finalScore
    scoredResults.sort((a, b) => b.finalScore - a.finalScore);

    return scoredResults.slice(0, topK);
  }
}

// Singleton instance for server routes
export const localVectorStore = new LocalVectorStore();
