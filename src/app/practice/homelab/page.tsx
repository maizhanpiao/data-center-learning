"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { HOMELAB_STAGES, HOMELAB_INTRO } from "@/content/homelab";
import { PageHeader, ProgressBar } from "@/components/ui";

export default function HomelabPage() {
  const { state, setPracticeDone } = useStore();
  const done = HOMELAB_STAGES.filter((s) => state.practiceDone[s.id]).length;
  const pct = Math.round((done / HOMELAB_STAGES.length) * 100);

  return (
    <div>
      <Link href="/practice" className="text-sm text-muted hover:text-primary-strong">← 返回实操练习</Link>
      <div className="mt-2">
        <PageHeader emoji="🏠" title="homelab 搭建引导实验" subtitle="把你的 Mac + 联想 组成迷你机房，跑通真实运维闭环。" />
      </div>

      <div className="mb-6 rounded-2xl border border-primary bg-primary-soft p-4 text-sm leading-relaxed">{HOMELAB_INTRO}</div>

      <div className="mb-6 flex items-center gap-3">
        <ProgressBar pct={pct} color={pct === 100 ? "var(--ok)" : "var(--primary)"} />
        <span className="shrink-0 text-sm font-semibold tabular-nums">{done}/{HOMELAB_STAGES.length} 阶段</span>
      </div>

      <div className="space-y-5">
        {HOMELAB_STAGES.map((s) => {
          const isDone = !!state.practiceDone[s.id];
          return (
            <div key={s.id} className={`rounded-2xl border bg-surface p-5 ${isDone ? "border-ok" : "border-border"}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold">{s.title}</span>
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">{s.machine}</span>
                    <span className="text-xs text-muted">约 {s.minutes} 分钟</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{s.goal}</p>
                </div>
                <button onClick={() => setPracticeDone(s.id, !isDone)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${isDone ? "bg-[var(--ok-soft)] text-ok" : "border border-border hover:border-primary"}`}>
                  {isDone ? "✓ 已完成" : "标记完成"}
                </button>
              </div>

              <ol className="mt-4 space-y-3">
                {s.steps.map((st, i) => (
                  <li key={i} className="text-sm">
                    <div className="flex gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold">{i + 1}</span>
                      <span className="flex-1">{st.text}</span>
                    </div>
                    {st.cmd && (
                      <pre className="mt-1.5 ml-7 overflow-x-auto rounded-lg bg-[var(--surface-2)] p-2.5 font-mono text-xs leading-relaxed whitespace-pre-wrap">{st.cmd}</pre>
                    )}
                  </li>
                ))}
              </ol>

              <div className="mt-4 rounded-lg bg-[var(--ok-soft)] p-3 text-sm">
                <div className="font-semibold text-ok">✅ 验收清单</div>
                <ul className="mt-1 ml-4 list-disc text-foreground">
                  {s.verify.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
              </div>

              {s.pitfalls && s.pitfalls.length > 0 && (
                <div className="mt-2 rounded-lg bg-[var(--warn-soft)] p-3 text-sm">
                  <div className="font-semibold text-warn">⚠️ 常见坑</div>
                  <ul className="mt-1 ml-4 list-disc text-foreground">
                    {s.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pct === 100 && (
        <div className="mt-6 rounded-2xl border border-ok bg-[var(--ok-soft)] p-5 text-center">
          <div className="text-3xl">🏆</div>
          <p className="mt-2 font-semibold">恭喜！你已搭出自己的 homelab，并跑通 Linux + K8s + 自动化 + 监控的完整闭环。</p>
          <p className="mt-1 text-sm text-muted">这套环境可以反复折腾：故意搞坏再修、部署更多服务、对接「今日训练」里的命令行题与故障情景。简历上可以写“自建 homelab”了。</p>
        </div>
      )}
    </div>
  );
}
