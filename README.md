# 🚗 መንጃ ፈቃድ ረዳት (EthioDrive AI)
### Modern Next.js Bilingual RAG Chatbot Boilerplate for Ethiopian Driver's License Preparation

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-v7-black?style=flat)](https://sdk.vercel.ai/)
[![Languages](https://img.shields.io/badge/Languages-Amharic_%7C_English-emerald)](https://github.com/)

A production-ready, full-stack **Next.js RAG Chatbot and Exam Simulator** tailored specifically for candidates studying for the **Ethiopian Driver's License Theory Examination** (የመንጃ ፈቃድ የንድፈ-ሃሳብ ፈተና).

Built from the ground up to support **Amharic (አማርኛ)** and **English** with first-class Ge'ez typography (`Noto Sans Ethiopic`), Ethiopic character normalization, hybrid retrieval (dense embeddings + BM25 keyword overlap), grounded manual citations, and interactive visual traffic sign cards.

---

## 🌟 Key Features

- **🌐 Native Bilingual Experience:** Instant client-side switching between Amharic (አማርኛ) and English without page reloads.
- **📚 Grounded Legal Citations (RAG):** Responses cite exact chapters and articles from official Ethiopian Federal Transport and Logistics regulations.
- **🚦 Multimodal Traffic Signs Engine:** Visual vector and metadata catalog containing Ethiopian road signs (Warning, Regulatory, Mandatory, Informative) rendered as interactive SVG cards in chat.
- **📝 Interactive Mock Exam Simulator:** Practice multiple-choice questions categorized by topic (Right-of-Way, Signs, Speed Limits, Safety Checks) with timers, immediate explanations, and a one-click *"Ask AI Tutor about this"* handoff.
- **⚡ Zero-Dependency Local Vector Store:** Works out of the box on first clone without mandatory cloud vector databases, with pluggable adapters for Supabase `pgvector` and Pinecone.
- **🇪🇹 Ethiopic NLP Normalizer:** Resolves Amharic homophones (`ሀ/ሐ/ኀ`, `ሰ/ሠ`, `አ/ዐ`, `ጸ/ፀ`) and Ge'ez punctuation for high-precision retrieval recall.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) |
| **Styling** | Tailwind CSS v4, Lucide React icons |
| **Typography** | Noto Sans Ethiopic & Plus Jakarta Sans |
| **AI Orchestration** | Vercel AI SDK (`ai`, `@ai-sdk/google`, `@ai-sdk/openai`) |
| **Default Models** | Google Gemini 2.0 Flash / OpenAI GPT-4o-mini |
| **Embeddings** | Gemini `text-embedding-004` / OpenAI `text-embedding-3-small` / Local Fallback |
| **Vector Store** | In-memory Cosine + BM25 Hybrid (pluggable to Supabase / Pinecone) |

---

## 🚀 Quickstart Guide

### 1. Clone & Install
```bash
git clone https://github.com/your-username/et-dl.git
cd et-dl
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Add your Google Gemini or OpenAI API key:
```env
AI_PROVIDER=google
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note:** The boilerplate includes a **Zero-Dependency Fallback Mode**. If no API key is set, the application still runs locally, retrieves grounded manual chapters, and streams responses demonstrating the RAG pipeline.

### 3. Verify Knowledge Base & Ingestion
Run the verification and test query suite:
```bash
pnpm ingest
```

### 4. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
et-dl/
├── data/
│   ├── raw/
│   │   ├── ethiopian-driver-manual-am.md   # Official Amharic driving manual
│   │   ├── ethiopian-driver-manual-en.md   # Official English driving manual
│   │   └── sample-exam-questions.json     # 30+ categorized bilingual exam questions
│   └── traffic-signs.json                 # Structured Ethiopian traffic signs with SVGs
├── scripts/
│   └── ingest.ts                          # CLI ingestion and hybrid search verification
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts              # Streaming RAG endpoint with citations
│   │   │   ├── exam/route.ts              # Exam questions API
│   │   │   └── signs/route.ts             # Traffic signs search API
│   │   ├── chat/page.tsx                  # Dedicated AI Tutor chat page
│   │   ├── exam/page.tsx                  # Full mock examination interface
│   │   ├── signs/page.tsx                 # Traffic signs visual directory
│   │   ├── layout.tsx                     # Root layout with Noto Sans Ethiopic & Header
│   │   └── page.tsx                       # High-impact Landing Page
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx             # Streaming chat with suggestion chips
│   │   │   ├── ChatMessage.tsx            # Markdown bubble with <SignCard /> parser
│   │   │   ├── SignBadge.tsx              # Visual traffic sign card with action notes
│   │   │   └── SourceCitation.tsx         # Collapsible citations drawer
│   │   ├── exam/
│   │   │   └── ExamRunner.tsx             # Quiz simulator with timer & score review
│   │   ├── signs/
│   │   │   └── SignCatalog.tsx            # Searchable visual road sign gallery
│   │   └── common/
│   │       └── Header.tsx                 # Navigation bar & language switcher
│   └── lib/
│       ├── ai/
│       │   ├── providers.ts               # Gemini & OpenAI model configuration
│       │   └── prompts.ts                 # Bilingual system prompts
│       ├── i18n/
│       │   ├── context.tsx                # LanguageProvider Context
│       │   └── translations.ts            # Typed bilingual dictionary (AM / EN)
│       ├── nlp/
│       │   └── amharic-normalizer.ts      # Ethiopic homophone & punctuation normalizer
│       └── rag/
│           ├── embeddings.ts              # Dense embedding generator + local fallback
│           ├── retriever.ts               # Hybrid RAG retriever & sign enricher
│           ├── types.ts                   # TypeScript interfaces
│           ├── knowledge-data.ts          # Pre-compiled core knowledge chunks
│           └── stores/
│               ├── vector-store.ts        # Abstract vector store interface
│               └── local-store.ts         # Fast in-memory / local vector store
```

---

## 💡 How It Works

### 1. Ethiopic NLP Normalization
Amharic text frequently uses homophone characters interchangeably (`ሀ`/`ሐ`/`ኀ`, `ሰ`/`ሠ`, `አ`/`ዐ`, `ጸ`/`ፀ`). The normalizer in [amharic-normalizer.ts](file:///home/sillywatch/Documents/Development/AI-ML/et-dl/src/lib/nlp/amharic-normalizer.ts) canonicalizes these characters so that a query written with `ሐሳብ` matches documents containing `ሀሳብ`, boosting retrieval accuracy.

### 2. Hybrid RAG Retrieval
When a user asks a question (e.g. *"በአደባባይ ላይ የቀዳሚነት መብት ያለው ማን ነው?"* or *"Who has right-of-way at a roundabout?"*):
1. The query is normalized and embedded.
2. The retriever calculates **Dense Cosine Similarity** + **Sparse Keyword Overlap (BM25-style)**.
3. Linked traffic signs (e.g. `W-01` Roundabout Ahead, `M-02` Compulsory Roundabout) are retrieved.
4. The system prompt is assembled with grounding data and sent to the LLM.
5. The streaming response includes `<SignCard id="warn-01" />` tags, which the frontend renders as rich visual badges with SVG illustrations.
6. The exact legal manual references are attached via the `x-citations` response header.

---

## 🚢 Deployment

### Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Add your environment variables (`GEMINI_API_KEY` or `OPENAI_API_KEY`).
4. Click **Deploy**.

---

## 📜 License & Disclaimer

This project is open-source under the MIT License. It is designed for educational preparation only; official driving licenses in Ethiopia are granted solely by authorized government licensing bodies.
