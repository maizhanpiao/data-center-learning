"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { ALL_FLASHCARDS, chapterById } from "@/content/chapters";
import { PageHeader } from "@/components/ui";

export default function FlashcardsPage() {
  const { state, reviewCard } = useStore();
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(0);

  // 到期/未学过的卡片队列（每次渲染基于最新 state 计算）
  const queue = useMemo(() => {
    const now = Date.now();
    return ALL_FLASHCARDS.filter((f) => {
      const srs = state.flashcards[f.id];
      return !srs || srs.due <= now;
    });
  }, [state.flashcards]);

  const card = queue[0];

  const rate = (q: "again" | "good" | "easy") => {
    if (!card) return;
    reviewCard(card.id, q);
    setFlipped(false);
    setSessionDone((n) => n + 1);
  };

  const totalLearned = Object.keys(state.flashcards).length;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader emoji="🎴" title="抽认卡" subtitle="基于遗忘曲线的间隔复习。答得越熟，下次出现间隔越长。" />

      <div className="mb-4 flex gap-3 text-sm">
        <span className="rounded-lg bg-surface-2 px-3 py-1.5">待复习 <strong className="tabular-nums">{queue.length}</strong></span>
        <span className="rounded-lg bg-surface-2 px-3 py-1.5">本次已复习 <strong className="tabular-nums">{sessionDone}</strong></span>
        <span className="rounded-lg bg-surface-2 px-3 py-1.5">卡片总数 <strong className="tabular-nums">{ALL_FLASHCARDS.length}</strong></span>
      </div>

      {!card ? (
        <div className="rounded-2xl border border-border bg-surface p-10 text-center">
          <div className="text-4xl">🎉</div>
          <p className="mt-3 font-semibold">今天的卡片复习完啦！</p>
          <p className="mt-1 text-sm text-muted">
            已学习 {totalLearned} 张卡片。学习更多章节会自动加入新卡片；到期的卡片会再次出现。
          </p>
        </div>
      ) : (
        <div>
          <div
            onClick={() => setFlipped((f) => !f)}
            className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-border bg-surface p-8 text-center card-hover"
          >
            <div className="mb-2 text-xs text-muted">
              {chapterById(card.chapterId)?.index} {chapterById(card.chapterId)?.title}
            </div>
            {!flipped ? (
              <>
                <div className="text-lg font-semibold">{card.front}</div>
                <div className="mt-4 text-xs text-muted">点击翻面查看答案 ↻</div>
              </>
            ) : (
              <div className="flip-in">
                <div className="text-sm text-muted">{card.front}</div>
                <hr className="my-3 border-border" />
                <div className="text-base leading-relaxed">{card.back}</div>
              </div>
            )}
          </div>

          {flipped && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button onClick={() => rate("again")} className="rounded-xl border border-[var(--danger)] py-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]">
                再来一次<div className="text-xs font-normal">没记住</div>
              </button>
              <button onClick={() => rate("good")} className="rounded-xl border border-border py-3 text-sm font-semibold hover:border-primary">
                记得<div className="text-xs font-normal text-muted">有点犹豫</div>
              </button>
              <button onClick={() => rate("easy")} className="rounded-xl border border-[var(--ok)] py-3 text-sm font-semibold text-[var(--ok)] hover:bg-[var(--ok-soft)]">
                很简单<div className="text-xs font-normal">脱口而出</div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
