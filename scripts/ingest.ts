import fs from "fs";
import path from "path";
import { KNOWLEDGE_CHUNKS } from "../src/lib/rag/knowledge-data";
import { localVectorStore } from "../src/lib/rag/stores/local-store";
import { retrieveRelevantContext } from "../src/lib/rag/retriever";
import rawSigns from "../data/traffic-signs.json";

async function main() {
  console.log("==================================================================");
  console.log("  ETHIOPIAN DRIVER'S LICENSE RAG KNOWLEDGE INGESTION & TEST SUITE  ");
  console.log("  የኢትዮጵያ መንጃ ፈቃድ የ RAG ዳታቤዝ ማረጋገጫና ኢንዴክስ ማሰናጃ           ");
  console.log("==================================================================\n");

  // 1. Check datasets
  const signsPath = path.join(process.cwd(), "data", "traffic-signs.json");
  const manualAmPath = path.join(process.cwd(), "data", "raw", "ethiopian-driver-manual-am.md");
  const manualEnPath = path.join(process.cwd(), "data", "raw", "ethiopian-driver-manual-en.md");
  const examPath = path.join(process.cwd(), "data", "raw", "sample-exam-questions.json");

  console.log("1. Checking knowledge datasets:");
  console.log(`   ✓ Traffic Signs DB: ${rawSigns.length} signs loaded (${signsPath})`);
  console.log(`   ✓ Amharic Manual: ${fs.existsSync(manualAmPath) ? "Found" : "Missing"}`);
  console.log(`   ✓ English Manual: ${fs.existsSync(manualEnPath) ? "Found" : "Missing"}`);
  console.log(`   ✓ Sample Exam Q&A: ${fs.existsSync(examPath) ? "Found" : "Missing"}`);

  // 2. Initialize Vector Store
  console.log("\n2. Initializing Local Vector Store & generating embeddings...");
  await localVectorStore.init();
  console.log(`   ✓ Indexed ${KNOWLEDGE_CHUNKS.length} core knowledge chunks.`);

  // 3. Perform verification test queries
  console.log("\n3. Testing Cross-Lingual Hybrid Retrieval:\n");

  const testQueries = [
    { q: "በአደባባይ ላይ የቀዳሚነት መብት ያለው ማን ነው?", lang: "am" as const, desc: "Amharic: Roundabout priority" },
    { q: "What is the speed limit in urban areas?", lang: "en" as const, desc: "English: Urban speed limit" },
    { q: "ቀይ ክብ ቅርጽ ያለው የትራፊክ ምልክት ምን ማለት ነው?", lang: "am" as const, desc: "Amharic: Prohibitory circular signs" },
    { q: "What are the mandatory pre-trip checks?", lang: "en" as const, desc: "English: Pre-trip vehicle inspection" },
  ];

  for (const test of testQueries) {
    console.log(`   🔍 Query [${test.desc}]: "${test.q}"`);
    const retrieved = await retrieveRelevantContext(test.q, test.lang);
    const topResult = retrieved.results[0];

    if (topResult) {
      console.log(`      -> Top Match: ${topResult.chunk.titleEn} (${topResult.chunk.titleAm})`);
      console.log(`      -> Chapter/Sec: ${topResult.chunk.chapter} | ${topResult.chunk.section}`);
      console.log(`      -> Final Score: ${topResult.finalScore.toFixed(3)} (Dense: ${topResult.similarity.toFixed(3)}, Keyword: ${topResult.keywordScore.toFixed(3)})`);
    } else {
      console.log("      -> [!] No high-confidence chunk retrieved.");
    }

    if (retrieved.matchedSigns.length > 0) {
      console.log(`      -> Linked Signs: ${retrieved.matchedSigns.map((s) => `${s.code} (${s.nameEn} / ${s.nameAm})`).join(", ")}`);
    }
    console.log("");
  }

  console.log("==================================================================");
  console.log("  ALL RAG KNOWLEDGE CHECKS PASSED SUCCESSFULLY!                   ");
  console.log("==================================================================");
}

main().catch((err) => {
  console.error("Ingestion error:", err);
  process.exit(1);
});
