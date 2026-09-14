export interface KnowledgeChunk {
  id: string;
  titleAm: string;
  titleEn: string;
  chapter: string;
  section: string;
  contentAm: string;
  contentEn: string;
  category: "priority" | "speed" | "safety" | "signs" | "penalties" | "first_aid" | "general";
  keywordsAm?: string[];
  keywordsEn?: string[];
  signIds?: string[];
  embedding?: number[];
}

export interface TrafficSign {
  id: string;
  code: string;
  category: "warning" | "regulatory" | "mandatory" | "informational";
  nameAm: string;
  nameEn: string;
  meaningAm: string;
  meaningEn: string;
  actionAm: string;
  actionEn: string;
  shape: "triangle" | "circle" | "octagon" | "rectangle";
  svg: string;
  embedding?: number[];
}

export interface ExamQuestion {
  id: string;
  category: "priority" | "speed" | "safety" | "signs" | "penalties" | "first_aid";
  questionAm: string;
  questionEn: string;
  optionsAm: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAm: string;
  explanationEn: string;
  signId?: string | null;
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  similarity: number;
  keywordScore: number;
  finalScore: number;
}

export interface CitationReference {
  id: string;
  title: string;
  chapter: string;
  section: string;
  snippet: string;
  category: string;
}
