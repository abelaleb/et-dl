import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/context";
import { Header } from "@/components/common/Header";

export const metadata: Metadata = {
  title: "መንጃ ፈቃድ ረዳት | Ethiopian Driver's License RAG AI",
  description:
    "A modern bilingual RAG chatbot and exam preparation platform for the Ethiopian Driver's License Theory Examination in Amharic and English.",
  keywords: [
    "Ethiopian drivers license",
    "መንጃ ፈቃድ",
    "Ethiopia traffic signs",
    "Ethiopia driving test",
    "Amharic RAG chatbot",
    "የመንጃ ፈቃድ ፈተና",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="am" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
