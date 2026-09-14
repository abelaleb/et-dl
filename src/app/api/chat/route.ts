import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { getChatModel, hasConfiguredAI } from "@/lib/ai/providers";
import { getTutorSystemPrompt } from "@/lib/ai/prompts";
import { retrieveRelevantContext } from "@/lib/rag/retriever";

export async function POST(req: NextRequest) {
  try {
    const { messages, locale = "am" } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage.content || "";

    // 1. RAG Retrieval from official Ethiopian driving curriculum
    const retrieved = await retrieveRelevantContext(userQuery, locale);

    // 2. Build bilingual grounding system prompt
    const systemPrompt = getTutorSystemPrompt(locale, retrieved.formattedContext);

    // Serialize citations and matched signs for header transport
    const citationHeader = encodeURIComponent(JSON.stringify(retrieved.citations));
    const signsHeader = encodeURIComponent(JSON.stringify(retrieved.matchedSigns));

    // 3. Check if external LLM API is configured
    if (hasConfiguredAI()) {
      const { model } = getChatModel();

      const result = streamText({
        model,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      });

      return result.toTextStreamResponse({
        headers: {
          "x-citations": citationHeader,
          "x-signs": signsHeader,
        },
      });
    }

    // 4. Zero-Dependency Developer Fallback Mode
    // When no external API key is set, returns an intelligent grounded response
    // showcasing how RAG works with the retrieved manual articles.
    const topResult = retrieved.results[0];
    let fallbackText = "";

    if (locale === "am") {
      if (topResult) {
        fallbackText = `**[የማኑዋል ማጣቀሻ / Grounded Answer]**\n\n${topResult.chunk.contentAm}\n\n`;
        if (retrieved.matchedSigns.length > 0) {
          fallbackText += `\n**ተያያዥ የትራፊክ ምልክት:**\n<SignCard id="${retrieved.matchedSigns[0].id}" />\n`;
        }
        fallbackText += `\n*(ማስታወሻ፡ የቀጥታ AI መልስ ለማግኘት በ \`.env.local\` ውስጥ \`GEMINI_API_KEY\` ወይም \`OPENAI_API_KEY\` ያስገቡ።)*`;
      } else {
        fallbackText = `ጥያቄዎን ተመልክቻለሁ። በኢትዮጵያ የትራፊክ ደንብ መሰረት የተሻለውን መልስ ለማግኘት እባክዎ እንደ "አደባባይ"፣ "የቀኝ እጅ ቀዳሚነት"፣ "የፍጥነት ገደብ"፣ ወይም "የቅድመ ጉዞ ፍተሻ" የመሳሰሉ ቃላትን ተጠቅመው ይጠይቁ።\n\n*(ማስታወሻ፡ የቀጥታ AI መልስ ለማግኘት \`GEMINI_API_KEY\` በ \`.env.local\` ውስጥ ያስገቡ።)*`;
      }
    } else {
      if (topResult) {
        fallbackText = `**[Official Manual Reference / Grounded Answer]**\n\n${topResult.chunk.contentEn}\n\n`;
        if (retrieved.matchedSigns.length > 0) {
          fallbackText += `\n**Associated Traffic Sign:**\n<SignCard id="${retrieved.matchedSigns[0].id}" />\n`;
        }
        fallbackText += `\n*(Note: For dynamic conversational generation, configure \`GEMINI_API_KEY\` or \`OPENAI_API_KEY\` in your \`.env.local\` file.)*`;
      } else {
        fallbackText = `I have reviewed your query against the Ethiopian Driver's Manual. To get targeted grounding, try inquiring about topics such as "roundabout priority", "speed limits", "pre-trip inspection", or "traffic signs".\n\n*(Note: Set \`GEMINI_API_KEY\` in \`.env.local\` for live LLM streaming.)*`;
      }
    }

    // Return mock streaming response using readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream in small natural text chunks
        const chunks = fallbackText.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          const part = (i === 0 ? "" : " ") + chunks[i];
          controller.enqueue(encoder.encode(`0:${JSON.stringify(part)}\n`));
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-vercel-ai-data-stream": "v1",
        "x-citations": citationHeader,
        "x-signs": signsHeader,
      },
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error while generating chat response." },
      { status: 500 }
    );
  }
}
