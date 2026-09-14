"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrafficSign } from "@/lib/rag/types";
import { useLanguage } from "@/lib/i18n/context";
import { Search, Compass, Sparkles, Filter } from "lucide-react";

export function SignCatalog() {
  const router = useRouter();
  const { t, isAm } = useLanguage();
  const [signs, setSigns] = useState<TrafficSign[]>([]);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchSigns = async (cat: string, query: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat !== "all") params.set("category", cat);
      if (query.trim()) params.set("search", query.trim());

      const res = await fetch(`/api/signs?${params.toString()}`);
      const data = await res.json();
      if (data.signs) {
        setSigns(data.signs);
      }
    } catch (err) {
      console.error("Failed to load signs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSigns(category, search);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [category, search]);

  const categories = [
    { id: "all", label: t.signsFilterAll },
    { id: "warning", label: t.signsFilterWarning },
    { id: "regulatory", label: t.signsFilterRegulatory },
    { id: "mandatory", label: t.signsFilterMandatory },
    { id: "informational", label: t.signsFilterInformational },
  ];

  const handleAskTutor = (signName: string, signCode: string) => {
    const query = isAm
      ? `ስለ ትራፊክ ምልክት ${signCode} (${signName}) ደንብና ዝርዝር ማብራሪያ ስጠኝ።`
      : `Explain the detailed rules and driver responsibilities for traffic sign ${signCode}: ${signName}.`;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider justify-center sm:justify-start mb-1">
          <Compass className="h-4 w-4" />
          <span>{isAm ? "የትራፊክ ምልክቶች ካታሎግ" : "Traffic Sign Directory"}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t.signsTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.signsSubtitle}</p>
      </div>

      {/* Controls: Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.signsSearchPlaceholder}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1 hidden sm:block" />
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                category === c.id
                  ? "bg-primary text-white shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signs Grid */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : signs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          <p className="text-sm">
            {isAm ? "ምንም ምልክት አልተገኘም። እባክዎ ፍለጋዎን ይቀይሩ።" : "No traffic signs matched your query."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {signs.map((sign) => (
            <div
              key={sign.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {sign.code}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                    {sign.category}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary/50 p-1 flex items-center justify-center border border-border"
                    dangerouslySetInnerHTML={{ __html: sign.svg }}
                  />
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug">
                      {isAm ? sign.nameAm : sign.nameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAm ? sign.nameEn : sign.nameAm}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-foreground/85 leading-relaxed">
                  {isAm ? sign.meaningAm : sign.meaningEn}
                </p>

                <div className="mt-3 rounded-lg bg-secondary/60 p-2 text-[11px] text-foreground/80">
                  <span className="font-semibold text-primary">{t.signsActionRequired}</span>{" "}
                  {isAm ? sign.actionAm : sign.actionEn}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <button
                  onClick={() =>
                    handleAskTutor(
                      isAm ? sign.nameAm : sign.nameEn,
                      sign.code
                    )
                  }
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary/40 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{t.signsAskTutorAboutSign}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
