"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  MessageSquare,
  Award,
  Compass,
  ArrowRight,
  ShieldCheck,
  Languages,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const { t, isAm } = useLanguage();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-card via-background to-background py-16 sm:py-24">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>{t.heroBadge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
            {t.heroTitle}{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/chat"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t.startChatting}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/exam"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-secondary hover:scale-[1.02]"
            >
              <Award className="h-4 w-4 text-emerald-600" />
              <span>{t.takeExam}</span>
            </Link>

            <Link
              href="/signs"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-xs transition-all hover:bg-secondary hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4 text-amber-500" />
              <span>{t.exploreSigns}</span>
            </Link>
          </div>

          {/* Quick Stats / Highlights */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto border-t border-border pt-8 text-left">
            <div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isAm ? "የሁለት ቋንቋ (አማ / EN)" : "Bilingual Fidel & EN"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">RAG</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isAm ? "በትራፊክ ህግ የተረጋገጠ" : "Grounded Citations"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isAm ? "የትራፊክ ምልክቶች" : "Ethiopian Road Signs"}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">0 Config</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {isAm ? "ወዲያውኑ የሚሰራ (Local)" : "Local Vector Store"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t.featuresTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.featuresSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Card 1 */}
            <div className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-4">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t.featureBilingualTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t.featureBilingualDesc}
              </p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t.featureRagTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t.featureRagDesc}
              </p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t.featureSignsTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t.featureSignsDesc}
              </p>
            </div>

            {/* Card 4 */}
            <div className="group rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {t.featureExamTitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t.featureExamDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 max-w-4xl space-y-2">
          <p>{t.footerDisclaimer}</p>
          <p>© {new Date().getFullYear()} {t.footerRights}</p>
        </div>
      </footer>
    </div>
  );
}
