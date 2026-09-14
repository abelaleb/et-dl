"use client";

import React, { useState } from "react";
import { CitationReference } from "@/lib/rag/types";
import { useLanguage } from "@/lib/i18n/context";
import { BookOpen, ChevronDown, ChevronUp, FileText } from "lucide-react";

interface SourceCitationProps {
  citations: CitationReference[];
}

export function SourceCitation({ citations }: SourceCitationProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (!citations || citations.length === 0) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border/80 bg-secondary/40 text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 text-left font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
          <BookOpen className="h-3.5 w-3.5 text-primary" />
          {t.chatSourcesTitle} ({citations.length})
        </span>
        {isOpen ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {isOpen && (
        <div className="divide-y divide-border border-t border-border px-3 py-2 bg-card/60 space-y-2">
          {citations.map((c, i) => (
            <div key={`${c.id}-${i}`} className="pt-2 first:pt-0">
              <div className="flex items-center gap-1.5 font-semibold text-primary">
                <FileText className="h-3 w-3" />
                <span>{c.title}</span>
              </div>
              <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                {c.chapter} • {c.section}
              </div>
              <p className="mt-1 text-foreground/80 leading-relaxed text-[11px] italic">
                &ldquo;{c.snippet}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
