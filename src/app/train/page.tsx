"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, Mistake } from "@/lib/store";
import { CHAPTERS, chapterById, ALL_FLASHCARDS } from "@/content/chapters";
import { dueMistakes, dueFlashcards, weakChapters } from "@/lib/progress";
import { PageHeader } from "@/components/ui";

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

function RetestRunner({ queue, onExit }: { queue: Mistake[]; onExit: () => void }) {
  const { retestMistake } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [correctN, setCorrectN] = useState(0);

  if (i >= queue.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <div className="text-4xl">🎯</div>
        <div className="mt-2 text-2xl font-bold tabular-nums">{correctN} / {queue.length} 答对</div>
        <p className="mt-2 text-sm text-muted">答对的错题连对 2 次即毕业；答错的会留在错题本继续陪你。</p>
        <button onClick={onExit} className="mt-4 rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">完成</button>
      </div>
    );
  }

  const m = queue[i];
  const multi = m.kind === "multi";
  const ch = m.chapterId ? chapterById(m.chapterId) : undefined;
  const ok = sameSet(picked, m.answer);

  const toggle = (idx: number) => {
    if (checked) return;
    setPicked((cur) => (multi ? (cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx]) : [idx]));
  };
  const submit = () => { setChecked(true); retestMistake(m.qid, ok); if (ok) setCorrectN((n) => n + 1); };
  const next = () => { setI((x) => x + 1); setPicked([]); setChecked(false); };

  return (
    <div className="rounded-2xl border border-primary bg-surface p-5">
      <div className="mb-3 flex items-center justify-between text-xs text-muted">
        <span>重测 {i + 1} / {queue.length}</span>
        {ch && <span>📖 {ch.index} {ch.title}</span>}
      </div>
      <p className="font-medium">{m.question}{multi && <span className="ml-1 text-xs text-muted">（多选）</span>}</p>
      <div className="mt-3 space-y-2">
        {m.options.map((opt, oi) => {
          const sel = picked.includes(oi);
          const isAns = m.answer.includes(oi);
          let cls = "border-border hover:border-primary";
          if (checked) {
            if (isAns) cls = "border-ok bg-[var(--ok-soft)]";
            else if (sel) cls = "border-danger bg-[var(--danger-soft)]";
            else cls = "border-border opacity-70";
          } else if (sel) cls = "border-primary bg-primary-soft";
          return (
            <button key={oi} onClick={() => toggle(oi)} disabled={checked}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${cls}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${multi ? "rounded" : "rounded-full"} border ${sel ? "border-primary bg-primary text-white" : "border-border"}`}>{sel ? "✓" : ""}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {checked && (
        <div className={`mt-3 rounded-lg p-3 text-sm ${ok ? "bg-[var(--ok-soft)]" : "bg-[var(--warn-soft)]"}`}>
          <span className="font-semibold">{ok ? "✅ 这次对了！" : "📖 再记牢："}</span>{m.explanation}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        {!checked ? (
          <button onClick={submit} disabled={picked.length === 0} className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50">提交</button>
        ) : (
          <button onClick={next} className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-strong">{i + 1 < queue.length ? "下一题" : "查看结果"}</button>
        )}
        <button onClick={onExit} className="rounded-xl border border-border px-4 text-sm hover:border-primary">退出</button>
      </div>
    </div>
  );
}

export default function TrainPage() {
  const { state } = useStore();
  const [queue, setQueue] = useState<Mistake[] | null>(null);

  const due = dueMistakes(state);
  const dueCards = dueFlashcards(state, ALL_FLASHCARDS.map((f) => f.id));
  const weak = weakChapters(state).slice(0, 5);
  const nextChapter = CHAPTERS.find((c) => !state.completedChapters[c.id]);

  if (queue) return (
    <div>
      <PageHeader emoji="🔥" title="今日重测" subtitle="把错题再做一遍，连对 2 次即毕业。" />
      <RetestRunner queue={queue} onExit={() => setQueue(null)} />
    </div>
  );

  return (
    <div>
      <PageHeader emoji="🔥" title="今日训练" subtitle="学 → 测/练 → 错 → 复盘 → 强化 → 再测，闭环每天转一圈。打开就照着做。" />

      <div className="space-y-4">
        {/* 重测错题 */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div className="flex-1">
              <div className="font-semibold">重测错题</div>
              <div className="text-sm text-muted">今日到期 {due.length} 道</div>
            </div>
            {due.length > 0 ? (
              <button onClick={() => setQueue(due)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">开始</button>
            ) : <span className="text-sm text-ok">✓ 清空</span>}
          </div>
        </div>

        {/* 复习抽认卡 */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎴</span>
            <div className="flex-1">
              <div className="font-semibold">复习抽认卡</div>
              <div className="text-sm text-muted">今日待复习 {dueCards} 张</div>
            </div>
            <Link href="/flashcards" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">去复习</Link>
          </div>
        </div>

        {/* 弱项强化 */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div className="flex-1">
              <div className="font-semibold">弱项强化</div>
              <div className="text-sm text-muted">{weak.length ? "错题最多的章节，重学巩固" : "暂无明显弱项"}</div>
            </div>
            <Link href="/mistakes" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">错题本</Link>
          </div>
          {weak.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {weak.map((w) => {
                const ch = chapterById(w.chapterId);
                if (!ch) return null;
                return <Link key={w.chapterId} href={`/learn/${ch.id}`} className="rounded-full bg-[var(--warn-soft)] px-3 py-1 text-xs text-warn hover:underline">{ch.index} {ch.title} · 错{w.count}</Link>;
              })}
            </div>
          )}
        </div>

        {/* 学新内容 */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div className="flex-1">
              <div className="font-semibold">学新内容</div>
              <div className="text-sm text-muted">{nextChapter ? `下一章：${nextChapter.index} ${nextChapter.title}` : "🎉 全部章节已学完"}</div>
            </div>
            {nextChapter && <Link href={`/learn/${nextChapter.id}`} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">去学习</Link>}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-surface-2 p-4 text-xs text-muted">
        💡 闭环心法：错题不是负担，是你的“私人提分清单”。每天清空重测队列，弱项会肉眼可见地变少。
      </div>
    </div>
  );
}
