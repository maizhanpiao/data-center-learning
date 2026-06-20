"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { TIERS, ELECTIVE_PARTS } from "@/content/tiers";
import { partById } from "@/content/parts";
import { chaptersByPart } from "@/content/chapters";
import { tierStatus, currentTier, partProgress } from "@/lib/progress";
import { PageHeader, ProgressBar } from "@/components/ui";

export default function PathPage() {
  const { state } = useStore();
  const cur = currentTier(state);

  return (
    <div>
      <PageHeader emoji="🏆" title="进阶地图" subtitle="6 段进阶体系，对齐云原生运维主线：每段需通过【知识关】与【实操关】点亮徽章、解锁下一段。设施轨为选修。" />

      <div className="relative space-y-4">
        {TIERS.map((t) => {
          const ts = tierStatus(state, t.level);
          const isCurrent = t.level === cur;
          const locked = !ts.unlocked;
          return (
            <div key={t.level}
              className={`rounded-2xl border p-5 transition ${isCurrent ? "border-primary shadow-[0_0_0_2px_var(--primary-soft)]" : "border-border"} ${locked ? "opacity-60" : ""}`}
              style={{ background: "var(--surface)" }}>
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${ts.completed ? "" : locked ? "grayscale" : ""}`}
                  style={{ background: ts.completed ? "var(--ok-soft)" : "var(--surface-2)" }}>
                  {locked ? "🔒" : t.badge}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-bold">L{t.level} · {t.name}</span>
                    <span className="text-xs text-muted">{t.title}</span>
                    {ts.completed && <span className="rounded-full bg-[var(--ok-soft)] px-2 py-0.5 text-xs font-semibold text-ok">已通关</span>}
                    {isCurrent && !ts.completed && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-strong">进行中</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted">{t.goal}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <ProgressBar pct={ts.pct} color={ts.completed ? "var(--ok)" : "var(--primary)"} />
                    <span className="shrink-0 text-xs font-semibold tabular-nums">{ts.done}/{ts.total}</span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-muted">📖 知识关</div>
                      <p className="mt-0.5">{t.knowledge}</p>
                      {t.parts.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {t.parts.map((pid) => {
                            const p = partById(pid);
                            return <span key={pid} className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">{p.icon} {p.title}</span>;
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted">🧪 实操关</div>
                      <ul className="mt-0.5 ml-4 list-disc text-xs text-muted">
                        {t.practice.slice(0, 4).map((pr, i) => <li key={i}>{pr}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg bg-primary-soft px-3 py-2 text-xs">
                    🎯 <span className="font-semibold">对标认证：</span>{t.certs}
                  </div>

                  {ts.examId && (
                    <div className={`mt-2 flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-xs ${ts.examPassed ? "bg-[var(--ok-soft)]" : "bg-surface-2"}`}>
                      <span className="font-semibold">📝 考核关：</span>
                      <span>{ts.examPassed ? "✅ 模拟考已通过" : "需通过本段模拟考才能解锁下一段"}</span>
                      <Link href={`/exams/${ts.examId}`} className="ml-auto font-semibold text-primary-strong hover:underline">
                        {ts.examPassed ? "再考一次 →" : "去模拟考 →"}
                      </Link>
                    </div>
                  )}

                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted hover:text-primary-strong">解锁条件清单 ▾</summary>
                    <ul className="mt-1 ml-4 list-disc text-xs text-muted">
                      {t.unlock.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 选修轨：设施 / 动力 */}
      <div className="mt-10">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-lg font-bold">🏢 选修轨 · 设施 / 动力</span>
        </div>
        <p className="mb-4 text-sm text-muted">理解数据中心的物理底座（供配电、制冷、电工、暖通）。不计入主线闯关，但懂它能让你比纯软件的人更全面，部分岗位也需要。按兴趣选学。</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {ELECTIVE_PARTS.map((pid) => {
            const p = partById(pid);
            const pp = partProgress(state, pid);
            const first = chaptersByPart(pid)[0];
            return (
              <Link key={pid} href={first ? `/learn/${first.id}` : "/learn"}
                className="card-hover rounded-2xl border border-border bg-surface p-4">
                <div className="flex items-center gap-2 font-semibold">{p.icon} {p.title}</div>
                <div className="text-xs text-muted">{p.subtitle}</div>
                <div className="mt-3 flex items-center gap-2">
                  <ProgressBar pct={pp.pct} />
                  <span className="shrink-0 text-xs tabular-nums">{pp.done}/{pp.total}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
