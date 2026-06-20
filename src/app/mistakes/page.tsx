"use client";

import Link from "next/link";
import { useStore, MistakeReason, Mistake } from "@/lib/store";
import { chapterById } from "@/content/chapters";
import { activeMistakes, dueMistakes, masteredMistakes } from "@/lib/progress";
import { PageHeader, Stat } from "@/components/ui";

const REASONS: MistakeReason[] = ["概念没懂", "记错了", "审题失误", "粗心", "不会操作"];

function MistakeCard({ m }: { m: Mistake }) {
  const { tagMistakeReason, removeMistake } = useStore();
  const ch = m.chapterId ? chapterById(m.chapterId) : undefined;
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {ch && <Link href={`/learn/${ch.id}`} className="rounded bg-surface-2 px-1.5 py-0.5 hover:text-primary-strong">📖 {ch.index} {ch.title}</Link>}
        <span>错 {m.wrongCount} 次</span>
        <span className="ml-auto flex items-center gap-1">
          攻克进度
          {[0, 1].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full" style={{ background: i < m.streak ? "var(--ok)" : "var(--surface-2)", border: "1px solid var(--border)" }} />
          ))}
        </span>
      </div>

      <p className="mt-2 font-medium">{m.question}</p>

      <div className="mt-2 space-y-1 text-sm">
        {m.options.map((opt, i) => {
          const isAns = m.answer.includes(i);
          const yours = m.yourAnswer.includes(i);
          return (
            <div key={i} className={`rounded-lg border px-2.5 py-1.5 ${isAns ? "border-ok bg-[var(--ok-soft)]" : yours ? "border-danger bg-[var(--danger-soft)]" : "border-border"}`}>
              {opt}
              {isAns && <span className="ml-2 text-xs font-semibold text-ok">正确</span>}
              {yours && !isAns && <span className="ml-2 text-xs font-semibold text-danger">你的选择</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-2 rounded-lg bg-surface-2 p-2.5 text-sm"><span className="font-semibold">解析：</span>{m.explanation}</div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted">🔍 错因：</span>
        {REASONS.map((r) => (
          <button key={r} onClick={() => tagMistakeReason(m.qid, r)}
            className={`rounded-full px-2 py-0.5 text-xs transition ${m.reason === r ? "bg-primary text-white" : "bg-surface border border-border hover:border-primary"}`}>
            {r}
          </button>
        ))}
        <button onClick={() => removeMistake(m.qid)} className="ml-auto text-xs text-muted hover:text-danger">移除</button>
      </div>
    </div>
  );
}

export default function MistakesPage() {
  const { state } = useStore();
  const active = activeMistakes(state).sort((a, b) => b.lastTs - a.lastTs);
  const due = dueMistakes(state).length;
  const mastered = masteredMistakes(state);

  return (
    <div>
      <PageHeader emoji="❌" title="错题本" subtitle="做错的题自动归档。复盘错因 → 重测攻克 → 连对 2 次毕业。这是“越错越强”的核心。" />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat label="待攻克" value={String(active.length)} sub="未毕业错题" color="var(--warn)" />
        <Stat label="今日待重测" value={String(due)} sub="已到期" color="var(--danger)" />
        <Stat label="已攻克" value={String(mastered)} sub="连对毕业" color="var(--ok)" />
      </div>

      {due > 0 && (
        <Link href="/train" className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-strong">
          ▶ 开始今日重测（{due} 题）
        </Link>
      )}

      {active.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
          🎉 暂无待攻克的错题。去 <Link href="/learn" className="text-primary-strong underline">课程</Link> 做题，错的会自动收进这里。
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((m) => <MistakeCard key={m.qid} m={m} />)}
        </div>
      )}
    </div>
  );
}
