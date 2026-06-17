"use client";

import { useStore } from "@/lib/store";
import { TIERS } from "@/content/tiers";
import { partById } from "@/content/parts";
import { tierStatus, currentTier } from "@/lib/progress";
import { PageHeader, ProgressBar } from "@/components/ui";

export default function PathPage() {
  const { state } = useStore();
  const cur = currentTier(state);

  return (
    <div>
      <PageHeader emoji="🏆" title="进阶地图" subtitle="6 段进阶体系：每段需通过【知识关】与【实操关】才能点亮徽章、解锁下一段。" />

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
    </div>
  );
}
