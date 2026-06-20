"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";
import { useStore, MistakeReason } from "@/lib/store";

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

const REASONS: MistakeReason[] = ["概念没懂", "记错了", "审题失误", "粗心"];

export function Quiz({ questions, scoreId, chapterId }: { questions: QuizQuestion[]; scoreId: string; chapterId?: string }) {
  const { setQuizScore, recordMistakes, tagMistakeReason, state } = useStore();
  const [picks, setPicks] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) return null;

  const toggle = (qid: string, idx: number, multi: boolean) => {
    if (submitted) return;
    setPicks((p) => {
      const cur = p[qid] ?? [];
      if (multi) {
        return { ...p, [qid]: cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx] };
      }
      return { ...p, [qid]: [idx] };
    });
  };

  const correctCount = questions.filter((q) => sameSet(picks[q.id] ?? [], q.answer)).length;

  const submit = () => {
    setSubmitted(true);
    setQuizScore(scoreId, correctCount, questions.length);
    const wrongs = questions
      .filter((q) => !sameSet(picks[q.id] ?? [], q.answer))
      .map((q) => ({
        qid: q.id, scoreId, chapterId,
        question: q.question, options: q.options, answer: q.answer,
        yourAnswer: picks[q.id] ?? [], explanation: q.explanation, kind: q.kind,
      }));
    recordMistakes(wrongs);
  };

  const reset = () => { setPicks({}); setSubmitted(false); };

  const pct = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="space-y-5">
      {questions.map((q, qi) => {
        const picked = picks[q.id] ?? [];
        const multi = q.kind === "multi";
        const isCorrect = sameSet(picked, q.answer);
        return (
          <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-3 flex items-start gap-2">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-strong">{qi + 1}</span>
              <p className="font-medium">{q.question}{multi && <span className="ml-1 text-xs text-muted">（多选）</span>}</p>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const sel = picked.includes(oi);
                const isAns = q.answer.includes(oi);
                let cls = "border-border bg-surface hover:border-primary";
                if (submitted) {
                  if (isAns) cls = "border-ok bg-[var(--ok-soft)]";
                  else if (sel) cls = "border-danger bg-[var(--danger-soft)]";
                  else cls = "border-border opacity-70";
                } else if (sel) {
                  cls = "border-primary bg-primary-soft";
                }
                return (
                  <button key={oi} onClick={() => toggle(q.id, oi, multi)} disabled={submitted}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${cls}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${multi ? "rounded" : "rounded-full"} border ${sel ? "border-primary bg-primary text-white" : "border-border"}`}>
                      {sel ? "✓" : ""}
                    </span>
                    <span>{opt}</span>
                    {submitted && isAns && <span className="ml-auto text-xs font-semibold text-ok">正确答案</span>}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className={`mt-3 rounded-lg p-3 text-sm ${isCorrect ? "bg-[var(--ok-soft)]" : "bg-[var(--warn-soft)]"}`}>
                <span className="font-semibold">{isCorrect ? "✅ 答对了" : "📖 解析"}：</span>{q.explanation}
                {!isCorrect && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border pt-2">
                    <span className="text-xs text-muted">🔍 错因复盘：</span>
                    {REASONS.map((r) => {
                      const active = state.mistakes[q.id]?.reason === r;
                      return (
                        <button key={r} onClick={() => tagMistakeReason(q.id, r)}
                          className={`rounded-full px-2 py-0.5 text-xs transition ${active ? "bg-primary text-white" : "bg-surface border border-border hover:border-primary"}`}>
                          {r}
                        </button>
                      );
                    })}
                    <span className="ml-auto text-xs text-muted">已存入错题本 →</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button onClick={submit}
          className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-strong">
          提交答案
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-5">
          <div className="text-3xl font-bold tabular-nums" style={{ color: pct >= 80 ? "var(--ok)" : pct >= 60 ? "var(--warn)" : "var(--danger)" }}>
            {correctCount} / {questions.length}　({pct}%)
          </div>
          <p className="text-sm text-muted">
            {pct >= 80 ? "🎉 掌握得不错，进入下一章吧！" : pct >= 60 ? "👍 基本掌握，建议复习错题。" : "📚 别灰心，回顾正文再来一次。"}
          </p>
          <button onClick={reset} className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">
            重新作答
          </button>
        </div>
      )}
    </div>
  );
}
