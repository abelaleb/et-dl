"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExamQuestion } from "@/lib/rag/types";
import { useLanguage } from "@/lib/i18n/context";
import { SignBadge } from "../chat/SignBadge";
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Timer,
  Check,
} from "lucide-react";

export function ExamRunner() {
  const router = useRouter();
  const { t, isAm } = useLanguage();
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  const fetchQuestions = async (cat: string) => {
    setIsLoading(true);
    setIsFinished(false);
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
    setSecondsElapsed(0);

    try {
      const res = await fetch(`/api/exam?category=${cat}&count=10`);
      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(category);
  }, [category]);

  // Timer
  useEffect(() => {
    if (isFinished || isLoading) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, isLoading]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // Answered already
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleAskTutor = (questionText: string) => {
    const query = isAm
      ? `የመንጃ ፈቃድ ፈተና ጥያቄ ማብራሪያ እፈልጋለሁ፡ "${questionText}"`
      : `Can you explain this driver license exam question in detail: "${questionText}"?`;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const categories = [
    { id: "all", label: t.examFilterAll },
    { id: "priority", label: t.examFilterPriority },
    { id: "signs", label: t.examFilterSigns },
    { id: "speed", label: t.examFilterSpeed },
    { id: "safety", label: t.examFilterSafety },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">{t.thinkingText}</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 75;

    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center shadow-sm">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${
              passed ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
            }`}
          >
            {passed ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
          </div>

          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {passed ? t.examPassed : t.examFailed}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.examPassRate}</p>

          <div className="my-6 rounded-2xl bg-secondary/60 p-6">
            <div className="text-4xl font-extrabold text-foreground">{percentage}%</div>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              {score} / {totalQuestions} {t.examQuestionCount}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t.examTimeRemaining}: {formatTimer(secondsElapsed)}
            </div>
          </div>

          <button
            onClick={() => fetchQuestions(category)}
            className="flex items-center gap-2 mx-auto rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t.examRestartButton}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Category Pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              category === c.id
                ? "bg-primary text-white shadow-sm"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Progress & Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {t.examQuestionCount} {currentIndex + 1} / {totalQuestions}
          </span>
          <div className="mt-1.5 h-2 w-48 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1 text-xs font-mono font-medium text-muted-foreground">
          <Timer className="h-3.5 w-3.5 text-primary" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {isAm ? currentQ.questionAm : currentQ.questionEn}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAm ? currentQ.questionEn : currentQ.questionAm}
          </p>

          {/* If sign is referenced, render visual sign badge */}
          {currentQ.signId && (
            <div className="my-4">
              <SignBadge id={currentQ.signId} />
            </div>
          )}

          {/* Options */}
          <div className="mt-6 space-y-2.5">
            {(isAm ? currentQ.optionsAm : currentQ.optionsEn).map((option, idx) => {
              const isSelected = selectedAnswers[currentIndex] === idx;
              const hasAnswered = selectedAnswers[currentIndex] !== undefined;
              const isCorrect = idx === currentQ.correctIndex;

              let optionStyle = "border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary";
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold";
                } else if (isSelected) {
                  optionStyle = "border-red-500 bg-red-500/10 text-red-800 dark:text-red-300";
                } else {
                  optionStyle = "border-border bg-card opacity-50";
                }
              }

              const letters = ["A", "B", "C", "D"];

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-all cursor-pointer ${optionStyle}`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      hasAnswered && isCorrect
                        ? "bg-emerald-600 text-white"
                        : hasAnswered && isSelected
                        ? "bg-red-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {letters[idx]}
                  </span>
                  <span className="flex-1 leading-snug">{option}</span>
                  {hasAnswered && isCorrect && (
                    <Check className="h-5 w-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation[currentIndex] && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t.examExplanation}</span>
              </div>
              <p className="mt-1.5 text-foreground/90 leading-relaxed">
                {isAm ? currentQ.explanationAm : currentQ.explanationEn}
              </p>

              <button
                onClick={() =>
                  handleAskTutor(isAm ? currentQ.questionAm : currentQ.questionEn)
                }
                className="mt-3 flex items-center gap-1.5 text-primary hover:underline font-semibold cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t.examAskTutor}</span>
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t.examPrevButton}</span>
            </button>

            {currentIndex + 1 < totalQuestions ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-white shadow-sm hover:opacity-90 cursor-pointer"
              >
                <span>{t.examNextButton}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsFinished(true)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 text-xs font-semibold text-white shadow-sm hover:opacity-90 cursor-pointer"
              >
                <Award className="h-4 w-4" />
                <span>{t.examSubmitButton}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
