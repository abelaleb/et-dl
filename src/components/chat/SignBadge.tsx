"use client";

import React from "react";
import { TrafficSign } from "@/lib/rag/types";
import { useLanguage } from "@/lib/i18n/context";
import rawSigns from "../../../data/traffic-signs.json";
import { AlertTriangle, AlertCircle, CheckCircle, Info } from "lucide-react";

const SIGNS_MAP: Record<string, TrafficSign> = {};
(rawSigns as TrafficSign[]).forEach((s) => {
  SIGNS_MAP[s.id] = s;
});

interface SignBadgeProps {
  id: string;
}

export function SignBadge({ id }: SignBadgeProps) {
  const { isAm, t } = useLanguage();
  const sign = SIGNS_MAP[id];

  if (!sign) return null;

  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case "warning":
        return {
          badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
          icon: AlertTriangle,
          label: isAm ? "ማስጠንቀቂያ" : "Warning",
        };
      case "regulatory":
        return {
          badgeBg: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
          icon: AlertCircle,
          label: isAm ? "መከልከያ" : "Prohibitory",
        };
      case "mandatory":
        return {
          badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30",
          icon: CheckCircle,
          label: isAm ? "መመሪያ / ግዴታ" : "Mandatory",
        };
      default:
        return {
          badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
          icon: Info,
          label: isAm ? "መረጃ ሰጪ" : "Informational",
        };
    }
  };

  const theme = getCategoryTheme(sign.category);
  const CatIcon = theme.icon;

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4 max-w-lg">
      <div className="flex items-start gap-4">
        {/* Visual SVG Sign Icon */}
        <div
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary/50 p-1 flex items-center justify-center border border-border"
          dangerouslySetInnerHTML={{ __html: sign.svg }}
        />

        {/* Text Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {sign.code}
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${theme.badgeBg}`}
            >
              <CatIcon className="h-3 w-3" />
              {theme.label}
            </span>
          </div>

          <h4 className="text-sm font-bold text-foreground truncate">
            {isAm ? sign.nameAm : sign.nameEn}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAm ? sign.nameEn : sign.nameAm}
          </p>

          <p className="text-xs text-foreground/90 mt-2 leading-relaxed">
            {isAm ? sign.meaningAm : sign.meaningEn}
          </p>

          <div className="mt-2 rounded bg-secondary/60 px-2.5 py-1.5 text-[11px] text-foreground/80">
            <span className="font-semibold text-primary">
              {t.signsActionRequired}
            </span>{" "}
            {isAm ? sign.actionAm : sign.actionEn}
          </div>
        </div>
      </div>
    </div>
  );
}
