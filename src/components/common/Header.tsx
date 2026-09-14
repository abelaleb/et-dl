"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { MessageSquare, Award, Compass, Globe, Shield } from "lucide-react";

export function Header() {
  const { locale, toggleLocale, t, isAm } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: "/chat", label: t.navChat, icon: MessageSquare },
    { href: "/exam", label: t.navExam, icon: Award },
    { href: "/signs", label: t.navSigns, icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-500 text-white shadow-md shadow-emerald-600/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-foreground text-lg sm:text-xl block leading-tight">
              {isAm ? "መንጃ ፈቃድ ረዳት" : "EthioDrive AI"}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {isAm ? "የኢትዮጵያ መንጃ ፈቃድ RAG AI" : "Ethiopian DL RAG Chatbot"}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary hover:bg-border/60 text-xs font-semibold tracking-wide transition-all cursor-pointer"
            title={t.languageSelect}
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>{locale === "am" ? "አማርኛ (AM)" : "English (EN)"}</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-primary text-white font-bold">
              {locale === "am" ? "EN" : "አማ"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
