"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { CHAPTERS, ALL_FLASHCARDS, isAuthored } from "@/content/chapters";
import { TIERS, tierByLevel } from "@/content/tiers";
import { PARTS } from "@/content/parts";
import { overallProgress, currentTier, tierStatus, avgQuizScore, dueFlashcards, partProgress } from "@/lib/progress";
import { Card, ProgressBar, Stat } from "@/components/ui";

export default function Home() {
  const { state } = useStore();
  const prog = overallProgress(state);
  const curLevel = currentTier(state);
  const tier = tierByLevel(curLevel)!;
  const ts = tierStatus(state, curLevel);
  const avg = avgQuizScore(state);
  const due = dueFlashcards(state, ALL_FLASHCARDS.map((f) => f.id));

  // 找到“继续学习”的下一章：第一个未完成的章节
  const nextChapter = CHAPTERS.find((c) => !state.completedChapters[c.id]) ?? CHAPTERS[0];

  return (
    <div className="space-y-8">
      {/* 欢迎 */}
      <section className="rounded-3xl border border-border bg-gradient-to-br from-[var(--primary-soft)] to-[var(--surface)] p-6 sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {state.name ? `${state.name}，欢迎回来 👋` : "欢迎来到数据中心学习站 🗄️"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          从零基础到认证水平，系统掌握数据中心。当前进度 <strong className="text-primary-strong">{prog.pct}%</strong>，
          所在段位 <strong className="text-primary-strong">{tier.badge} L{tier.level} {tier.name}</strong>。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href={`/learn/${nextChapter.id}`} className="rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-strong">
            ▶ 继续学习：{nextChapter.index} {nextChapter.title}
          </Link>
          <Link href="/path" className="rounded-xl border border-border bg-surface px-5 py-2.5 font-semibold transition hover:border-primary">
            🏆 查看进阶地图
          </Link>
        </div>
      </section>

      {/* 关键指标 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="总进度" value={`${prog.pct}%`} sub={`${prog.done}/${prog.total} 章`} color="var(--primary)" />
        <Stat label="当前段位" value={`L${curLevel}`} sub={tier.name} color="var(--accent)" />
        <Stat label="平均自测正确率" value={avg !== null ? `${avg}%` : "—"} sub={avg !== null ? "" : "还没做测验"} color="var(--ok)" />
        <Stat label="待复习抽认卡" value={String(due)} sub="今日到期" color="var(--warn)" />
      </section>

      {/* 当前段位进度 */}
      <section>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted">当前目标</div>
              <div className="text-lg font-bold">{tier.badge} L{tier.level} · {tier.name}</div>
            </div>
            <Link href="/path" className="text-sm text-primary-strong hover:underline">详情 →</Link>
          </div>
          <p className="mt-2 text-sm text-muted">{tier.goal}</p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar pct={ts.pct} />
            <span className="shrink-0 text-sm font-semibold tabular-nums">{ts.done}/{ts.total}</span>
          </div>
        </Card>
      </section>

      {/* 课程部分概览 */}
      <section>
        <h2 className="mb-3 text-lg font-bold">课程进度</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {PARTS.map((p) => {
            const pp = partProgress(state, p.id);
            return (
              <Card key={p.id} href={`/learn#part-${p.id}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold">第{p.id}部分 · {p.title}</div>
                    <div className="text-xs text-muted">{p.subtitle}</div>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-muted">{pp.done}/{pp.total}</span>
                </div>
                <div className="mt-3"><ProgressBar pct={pp.pct} color={p.color} /></div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 快捷入口 */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { href: "/practice", icon: "🧪", t: "实操练习" },
          { href: "/flashcards", icon: "🎴", t: "抽认卡复习" },
          { href: "/resources", icon: "🌐", t: "资源库" },
          { href: "/settings", icon: "⚙️", t: "设置/同步" },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="card-hover rounded-2xl border border-border bg-surface p-4 text-center">
            <div className="text-2xl">{q.icon}</div>
            <div className="mt-1 text-sm font-medium">{q.t}</div>
          </Link>
        ))}
      </section>

      <p className="text-center text-xs text-muted">
        共 {CHAPTERS.length} 章 · 已上线完整内容 {CHAPTERS.filter(isAuthored).length} 章 · {TIERS.length} 段进阶体系
      </p>
    </div>
  );
}
