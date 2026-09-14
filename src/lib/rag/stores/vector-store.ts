import { KnowledgeChunk, SearchResult } from "../types";

export interface SearchOptions {
  topK?: number;
  category?: string;
  locale?: "am" | "en";
  minScore?: number;
}

export interface IVectorStore {
  init(): Promise<void>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  addChunks(chunks: KnowledgeChunk[]): Promise<void>;
}
