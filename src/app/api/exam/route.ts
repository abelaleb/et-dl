import { NextRequest, NextResponse } from "next/server";
import sampleQuestions from "../../../../data/raw/sample-exam-questions.json";
import { ExamQuestion } from "@/lib/rag/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const count = parseInt(searchParams.get("count") || "10", 10);

    let questions: ExamQuestion[] = sampleQuestions as ExamQuestion[];

    if (category && category !== "all") {
      questions = questions.filter((q) => q.category === category);
    }

    // Shuffle for variety
    const shuffled = [...questions].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      total: questions.length,
      questions: shuffled.slice(0, count),
    });
  } catch (error) {
    console.error("Exam API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam questions." },
      { status: 500 }
    );
  }
}
