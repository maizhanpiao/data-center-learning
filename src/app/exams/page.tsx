"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { EXAMS, examPool } from "@/content/exams";
import { PageHeader } from "@/components/ui";

export default function ExamsPage() {
  const { state } = useStore();
  return (
    <div>
      <PageHeader emoji="📝" title="模拟考" subtitle="计时组卷 · 判分 · 做错的题自动进错题本。通过后会解锁进阶地图对应段位的「考核关」。" />

      <div className="space-y-4">
        {EXAMS.map((e) => {
          const r = state.examResults[e.id];
          const poolSize = examPool(e).length;
          return (
            <div key={e.id} className={`rounded-2xl border bg-surface p-5 ${r?.passed ? "border-ok" : "border-border"}`}>
              <div className="flex flex-wrap items-start gap-3">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold">{e.title}</span>
                    {r?.passed && <span className="rounded-full bg-[var(--ok-soft)] px-2 py-0.5 text-xs font-semibold text-ok">已通过</span>}
                  </div>
                  <div className="mt-1 text-sm text-muted">{e.cert}</div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span>⏱ {e.durationMin} 分钟</span>
                    <span>📋 {e.count} 题（题库 {poolSize} 题随机抽）</span>
                    <span>🎯 {e.pass} 分及格</span>
                    {r && <span className="font-semibold text-foreground">最佳成绩：{r.best} 分</span>}
                  </div>
                </div>
                <Link href={`/exams/${e.id}`} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">
                  {r ? "再考一次" : "开始模拟考"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl bg-surface-2 p-4 text-xs text-muted">
        💡 每次随机抽题、计时作答；交卷后给出分数与逐题解析，做错的自动收进「错题本」，可在「今日训练」里循环攻克。更多方向（网络/云/设施等）的模拟考会陆续加上。
      </div>
    </div>
  );
}
