"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { PARTS } from "@/content/parts";
import { CHAPTERS, isAuthored } from "@/content/chapters";
import { partProgress } from "@/lib/progress";
import { PageHeader, ProgressBar } from "@/components/ui";

export default function LearnPage() {
  const { state, toggleChapter } = useStore();

  return (
    <div>
      <PageHeader emoji="📚" title="课程" subtitle="按部分顺序学习，每章包含讲解、实操、自测与抽认卡。点击圆圈可手动标记完成。" />

      <div className="space-y-8">
        {PARTS.map((p) => {
          const chs = CHAPTERS.filter((c) => c.part === p.id);
          const pp = partProgress(state, p.id);
          return (
            <section key={p.id} id={`part-${p.id}`} className="scroll-mt-20">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <h2 className="font-bold">第{p.id}部分 · {p.title}</h2>
                  <p className="text-xs text-muted">{p.subtitle}</p>
                </div>
                <span className="text-sm tabular-nums text-muted">{pp.done}/{pp.total}</span>
              </div>
              <div className="mb-4"><ProgressBar pct={pp.pct} color={p.color} /></div>

              <div className="grid gap-2">
                {chs.map((c) => {
                  const done = !!state.completedChapters[c.id];
                  const authored = isAuthored(c);
                  return (
                    <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 card-hover">
                      <button
                        onClick={() => toggleChapter(c.id)}
                        aria-label="标记完成"
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm transition ${done ? "border-ok bg-ok text-white" : "border-border hover:border-primary"}`}
                        style={done ? { background: "var(--ok)", borderColor: "var(--ok)" } : {}}
                      >
                        {done ? "✓" : ""}
                      </button>
                      <Link href={`/learn/${c.id}`} className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-muted">{c.index}</span>
                          <span className="font-medium">{c.title}</span>
                          {!authored && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted">编写中</span>}
                        </div>
                        <div className="text-xs text-muted">{c.summary}</div>
                      </Link>
                      <span className="hidden shrink-0 text-xs text-muted sm:inline">{c.minutes} 分钟</span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
