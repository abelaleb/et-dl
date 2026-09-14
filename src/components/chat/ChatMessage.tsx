"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CitationReference } from "@/lib/rag/types";
import { SignBadge } from "./SignBadge";
import { SourceCitation } from "./SourceCitation";
import { Bot, User, Copy, Check } from "lucide-react";

export interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: CitationReference[];
}

interface ChatMessageProps {
  message: MessageItem;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Extract <SignCard id="..." /> tags from markdown content
  const renderContentWithSigns = (content: string) => {
    const signCardRegex = /<SignCard\s+id=["']([^"']+)["']\s*\/>/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = signCardRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <div
            key={`md-${lastIndex}`}
            className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content.substring(lastIndex, match.index)}
            </ReactMarkdown>
          </div>
        );
      }

      const signId = match[1];
      parts.push(<SignBadge key={`sign-${match.index}`} id={signId} />);
      lastIndex = signCardRegex.lastIndex;
    }

    if (lastIndex < content.length) {
      parts.push(
        <div
          key={`md-${lastIndex}`}
          className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content.substring(lastIndex)}
          </ReactMarkdown>
        </div>
      );
    }

    return parts;
  };

  return (
    <div
      className={`flex w-full gap-3 p-4 transition-colors ${
        isUser ? "bg-transparent justify-end" : "bg-card/40 rounded-2xl border border-border/60"
      }`}
    >
      {/* Bot Icon */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm mt-0.5">
          <Bot className="h-5 w-5" />
        </div>
      )}

      {/* Message Content Bubble */}
      <div
        className={`relative max-w-2xl text-sm ${
          isUser
            ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-white shadow-sm"
            : "flex-1 overflow-hidden"
        }`}
      >
        <div className="space-y-2">
          {renderContentWithSigns(message.content)}
        </div>

        {/* Citations if available */}
        {!isUser && message.citations && message.citations.length > 0 && (
          <SourceCitation citations={message.citations} />
        )}

        {/* Copy Button for assistant messages */}
        {!isUser && (
          <div className="mt-2 flex items-center justify-end">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary cursor-pointer"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground border border-border mt-0.5">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}
