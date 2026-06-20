"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { chapterById, adjacentChapters } from "@/content/chapters";
import { partById } from "@/content/parts";
import { ContentRenderer } from "@/components/content";
import { Quiz } from "@/components/quiz";

export default function ChapterPage() {
  const params = useParams<{ chapterId: string }>();
  const { state, toggleChapter, setNote } = useStore();
  const c = chapterById(params.chapterId);

  if (!c) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg">未找到该章节。</p>
        <Link href="/learn" className="mt-4 inline-block text-primary-strong hover:underline">← 返回课程</Link>
      </div>
    );
  }

  const part = partById(c.part);
  const done = !!state.completedChapters[c.id];
  const { prev, next } = adjacentChapters(c.id);
  const noteKey = `ch:${c.id}`;
  const score = state.quizScores[c.id];

  return (
    <article className="mx-auto max-w-3xl">
      {/* 面包屑 */}
      <div className="mb-4 flex items-center gap-2 text-xs text-muted">
        <Link href="/learn" className="hover:text-primary-strong">课程</Link>
        <span>/</span>
        <span>{part.icon} 第{part.id}部分 · {part.title}</span>
      </div>

      {/* 标题区 */}
      <header className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="font-mono">{c.index}</span><span>·</span><span>约 {c.minutes} 分钟</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{c.title}</h1>
        <p className="mt-2 text-muted">{c.summary}</p>

        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
          <div className="text-sm font-semibold">🎯 学习目标</div>
          <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-muted">
            {c.objectives.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>
      </header>

      {/* 正文 */}
      <ContentRenderer blocks={c.blocks} />

      {/* 自测 */}
      {c.quiz.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">📝 本章自测</h2>
          {score && (
            <p className="mb-3 text-sm text-muted">上次成绩：{score.correct}/{score.total}</p>
          )}
          <Quiz questions={c.quiz} scoreId={c.id} chapterId={c.id} />
        </section>
      )}

      {/* 笔记 */}
      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">✍️ 我的笔记</h2>
        <textarea
          value={state.notes[noteKey] ?? ""}
          onChange={(e) => setNote(noteKey, e.target.value)}
          placeholder="在这里记录你对本章的理解、疑问、要点……（自动保存）"
          className="min-h-32 w-full rounded-xl border border-border bg-surface p-4 text-sm outline-none focus:border-primary"
        />
      </section>

      {/* 完成 + 翻页 */}
      <section className="mt-10 flex flex-col gap-4">
        <button
          onClick={() => toggleChapter(c.id)}
          className={`w-full rounded-xl py-3 font-semibold transition ${done ? "border border-ok text-ok" : "bg-primary text-white hover:bg-primary-strong"}`}
          style={done ? { borderColor: "var(--ok)", color: "var(--ok)" } : {}}
        >
          {done ? "✓ 已完成本章（点击取消）" : "标记本章为已完成"}
        </button>

        <div className="flex items-center justify-between gap-3">
          {prev ? (
            <Link href={`/learn/${prev.id}`} className="flex-1 rounded-xl border border-border bg-surface p-3 text-sm card-hover">
              <div className="text-xs text-muted">← 上一章</div>
              <div className="font-medium">{prev.index} {prev.title}</div>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link href={`/learn/${next.id}`} className="flex-1 rounded-xl border border-border bg-surface p-3 text-right text-sm card-hover">
              <div className="text-xs text-muted">下一章 →</div>
              <div className="font-medium">{next.index} {next.title}</div>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </section>
    </article>
  );
}
