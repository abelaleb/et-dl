import { NextRequest, NextResponse } from "next/server";
import rawSigns from "../../../../data/traffic-signs.json";
import { TrafficSign } from "@/lib/rag/types";
import { normalizeAmharic } from "@/lib/nlp/amharic-normalizer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let signs: TrafficSign[] = rawSigns as TrafficSign[];

    if (category && category !== "all") {
      signs = signs.filter((s) => s.category === category);
    }

    if (search && search.trim()) {
      const q = normalizeAmharic(search.trim()).toLowerCase();
      signs = signs.filter((s) => {
        const nameAm = normalizeAmharic(s.nameAm).toLowerCase();
        const nameEn = s.nameEn.toLowerCase();
        const code = s.code.toLowerCase();
        const meaningAm = normalizeAmharic(s.meaningAm).toLowerCase();
        const meaningEn = s.meaningEn.toLowerCase();
        return (
          nameAm.includes(q) ||
          nameEn.includes(q) ||
          code.includes(q) ||
          meaningAm.includes(q) ||
          meaningEn.includes(q)
        );
      });
    }

    return NextResponse.json({
      success: true,
      total: signs.length,
      signs,
    });
  } catch (error) {
    console.error("Signs API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic signs." },
      { status: 500 }
    );
  }
}
