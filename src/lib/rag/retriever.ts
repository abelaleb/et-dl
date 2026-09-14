import { localVectorStore } from "./stores/local-store";
import { CitationReference, SearchResult, TrafficSign } from "./types";
import rawSigns from "../../../data/traffic-signs.json";

const TRAFFIC_SIGNS: TrafficSign[] = rawSigns as TrafficSign[];

export interface RetrievedContext {
  results: SearchResult[];
  matchedSigns: TrafficSign[];
  citations: CitationReference[];
  formattedContext: string;
}

/**
 * Searches knowledge chunks and enriches them with linked traffic signs and citation references.
 */
export async function retrieveRelevantContext(
  query: string,
  locale: "am" | "en" = "am"
): Promise<RetrievedContext> {
  const searchResults = await localVectorStore.search(query, {
    topK: 3,
    locale,
  });

  // Find any linked or mentioned traffic signs
  const signIdSet = new Set<string>();
  for (const res of searchResults) {
    if (res.chunk.signIds) {
      for (const sId of res.chunk.signIds) {
        signIdSet.add(sId);
      }
    }
  }

  // Also do direct sign keyword lookup (e.g. if user specifically asked about "ቁም", "stop", "አደባባይ", etc.)
  const lowerQuery = query.toLowerCase();
  for (const sign of TRAFFIC_SIGNS) {
    if (
      lowerQuery.includes(sign.nameAm.toLowerCase()) ||
      lowerQuery.includes(sign.nameEn.toLowerCase()) ||
      lowerQuery.includes(sign.code.toLowerCase())
    ) {
      signIdSet.add(sign.id);
    }
  }

  const matchedSigns = TRAFFIC_SIGNS.filter((s) => signIdSet.has(s.id));

  // Build clean citations for UI display
  const citations: CitationReference[] = searchResults.map((r) => ({
    id: r.chunk.id,
    title: locale === "am" ? r.chunk.titleAm : r.chunk.titleEn,
    chapter: r.chunk.chapter,
    section: r.chunk.section,
    snippet: locale === "am" ? r.chunk.contentAm.substring(0, 150) + "..." : r.chunk.contentEn.substring(0, 150) + "...",
    category: r.chunk.category,
  }));

  // Build formatted markdown context for LLM prompt
  let formattedContext = "=== OFFICIAL ETHIOPIAN DRIVER MANUAL & REGULATIONS (GROUNDING DATA) ===\n\n";

  if (searchResults.length === 0) {
    formattedContext += "No direct article match found. Rely on general Ethiopian road traffic rules and principles.\n";
  } else {
    searchResults.forEach((res, i) => {
      const chunk = res.chunk;
      formattedContext += `[Source ${i + 1}]: ${chunk.chapter} - ${chunk.section}\n`;
      formattedContext += `Title: ${chunk.titleEn} (${chunk.titleAm})\n`;
      formattedContext += `Official English Text: ${chunk.contentEn}\n`;
      formattedContext += `Official Amharic Text: ${chunk.contentAm}\n\n`;
    });
  }

  if (matchedSigns.length > 0) {
    formattedContext += "\n=== RELEVANT ETHIOPIAN TRAFFIC SIGNS ===\n";
    matchedSigns.forEach((sign) => {
      formattedContext += `[Sign ${sign.code}]: ${sign.nameEn} / ${sign.nameAm} (${sign.category.toUpperCase()})\n`;
      formattedContext += `Meaning: ${sign.meaningEn} / ${sign.meaningAm}\n`;
      formattedContext += `Action Required: ${sign.actionEn} / ${sign.actionAm}\n`;
      formattedContext += `Render Tag: <SignCard id="${sign.id}" />\n\n`;
    });
  }

  return {
    results: searchResults,
    matchedSigns,
    citations,
    formattedContext,
  };
}
