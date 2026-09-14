"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { ChatMessage, MessageItem } from "./ChatMessage";
import { CitationReference } from "@/lib/rag/types";
import { Send, Sparkles, Trash2, Shield, Loader2, ArrowUpCircle } from "lucide-react";

export function ChatWindow() {
  const { t, locale, isAm } = useLanguage();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasTriggeredInitial = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && !hasTriggeredInitial.current) {
      hasTriggeredInitial.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    let assistantMessage: MessageItem = {
      id: assistantMsgId,
      role: "assistant",
      content: "",
      citations: [],
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.statusText}`);
      }

      // Read citations from response headers if present
      const citationHeader = response.headers.get("x-citations");
      if (citationHeader) {
        try {
          const parsedCitations: CitationReference[] = JSON.parse(
            decodeURIComponent(citationHeader)
          );
          assistantMessage.citations = parsedCitations;
        } catch {
          // Ignore header parsing errors
        }
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response reader available.");
      }

      setMessages((prev) => [...prev, assistantMessage]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        
        // Handle Vercel AI SDK data stream format: lines like `0:"text"`
        const lines = chunkText.split("\n");
        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const textPart = JSON.parse(line.substring(2));
              accumulatedContent += textPart;
            } catch {
              accumulatedContent += line.substring(2);
            }
          } else if (line.trim() && !line.startsWith("d:") && !line.startsWith("e:")) {
            // Raw text or fallback
            accumulatedContent += line;
          }
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: isAm
            ? "ይቅርታ፣ ምላሹን በማመንጨት ላይ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።"
            : "Apologies, an error occurred while generating the response. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            /* Welcome Empty State */
            <div className="my-8 flex flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {t.chatTutorWelcome}
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
                {t.chatTutorDescription}
              </p>

              {/* Suggestions Grid */}
              <div className="mt-8 w-full max-w-2xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-3 justify-center">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{t.chatSuggestedTitle}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-left">
                  {t.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="group flex items-start gap-2.5 rounded-xl border border-border bg-card p-3.5 text-xs text-foreground transition-all hover:border-primary/40 hover:bg-secondary cursor-pointer shadow-xs"
                    >
                      <ArrowUpCircle className="h-4 w-4 shrink-0 text-primary opacity-60 group-hover:opacity-100 transition-opacity mt-0.5" />
                      <span className="leading-snug">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message Stream */
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground italic">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{t.thinkingText}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-background/80 p-4 backdrop-blur">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={t.chatClearHistory}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatPlaceholder}
                disabled={isLoading}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>{t.chatSend}</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
