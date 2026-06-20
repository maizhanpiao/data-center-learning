"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { examById, sampleQuestions } from "@/content/exams";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/ui";

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}
function mmss(t: number) {
  const m = Math.floor(t / 60), s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ExamRunner() {
  const params = useParams();
  const examId = String(params.examId);
  const exam = examById(examId);
  const { recordMistakes, setExamResult } = useStore();

  const [questions] = useState(() => (exam ? sampleQuestions(exam) : []));
  const [picks, setPicks] = useState<Record<string, number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<null | { correct: number; total: number; pct: number; passed: boolean }>(null);
  const [secondsLeft, setSecondsLeft] = useState(exam ? exam.durationMin * 60 : 0);

  const toggle = (q: { id: string; kind: string }, idx: number) => {
    if (submitted) return;
    setPicks((p) => {
      const cur = p[q.id] ?? [];
      const next = q.kind === "multi" ? (cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx]) : [idx];
      return { ...p, [q.id]: next };
    });
  };

  const doSubmit = () => {
    if (submitted || !exam) return;
    let correct = 0;
    const wrongs = questions.filter((q) => {
      const ok = sameSet(picks[q.id] ?? [], q.answer);
      if (ok) correct++;
      return !ok;
    });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    const passed = pct >= exam.pass;
    recordMistakes(wrongs.map((q) => ({
      qid: q.id, scoreId: `exam:${exam.id}`,
      chapterId: /^(\d+-\d+)-/.exec(q.id)?.[1],
      question: q.question, options: q.options, answer: q.answer,
      yourAnswer: picks[q.id] ?? [], explanation: q.explanation, kind: q.kind,
    })));
    setExamResult(exam.id, pct, passed);
    setResult({ correct, total: questions.length, pct, passed });
    setSubmitted(true);
  };

  // 倒计时（到 0 自动交卷）
  useEffect(() => {
    if (!exam || submitted) return;
    if (secondsLeft <= 0) { doSubmit(); return; }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, submitted, exam]);

  if (!exam) {
    return <div><PageHeader emoji="📝" title="模拟考" /><p className="text-muted">未找到该模拟考。<Link href="/exams" className="text-primary-strong underline">返回列表</Link></p></div>;
  }

  const answeredCount = questions.filter((q) => (picks[q.id]?.length ?? 0) > 0).length;
  const low = secondsLeft <= 60;

  return (
    <div className="pb-24">
      <Link href="/exams" className="text-sm text-muted hover:text-primary-strong">← 返回模拟考</Link>
      <div className="mt-2">
        <PageHeader emoji="📝" title={exam.title} subtitle={`${exam.cert} · 共 ${questions.length} 题 · 满分100 · ${exam.pass} 分及格`} />
      </div>

      {/* 计时条 */}
      {!submitted && (
        <div className="sticky top-[57px] z-30 mb-4 flex items-center justify-between rounded-xl border border-border bg-[var(--surface)]/95 px-4 py-2 backdrop-blur">
          <span className="text-sm text-muted">已答 {answeredCount}/{questions.length}</span>
          <span className={`font-mono text-lg font-bold tabular-nums ${low ? "text-danger" : ""}`}>⏱ {mmss(secondsLeft)}</span>
        </div>
      )}

      {result && (
        <div className={`mb-6 rounded-2xl border p-6 text-center ${result.passed ? "border-ok bg-[var(--ok-soft)]" : "border-[var(--warn)] bg-[var(--warn-soft)]"}`}>
          <div className="text-4xl">{result.passed ? "🎉" : "📕"}</div>
          <div className="mt-2 text-3xl font-bold tabular-nums">{result.pct} 分</div>
          <div className="mt-1 text-sm">{result.correct}/{result.total} 题正确 · {result.passed ? "✅ 通过！" : `未达 ${exam.pass} 分，继续加油`}</div>
          {result.passed && <p className="mt-2 text-sm text-muted">该段位的「考核关」已通过，进阶地图会自动解锁后续。</p>}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button onClick={() => location.reload()} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong">再考一次（重新组卷）</button>
            <Link href="/mistakes" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">去错题本攻克错题</Link>
            <Link href="/path" className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary">看进阶地图</Link>
          </div>
        </div>
      )}

      {/* 题目 */}
      <div className="space-y-4">
        {questions.map((q, qi) => {
          const picked = picks[q.id] ?? [];
          const ok = submitted && sameSet(picked, q.answer);
          return (
            <div key={q.id} className={`rounded-2xl border bg-surface p-5 ${submitted ? (ok ? "border-ok" : "border-[var(--danger)]") : "border-border"}`}>
              <p className="font-medium">
                <span className="mr-2 text-muted">{qi + 1}.</span>{q.question}
                {q.kind === "multi" && <span className="ml-1 text-xs text-muted">（多选）</span>}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const sel = picked.includes(oi);
                  const isAns = q.answer.includes(oi);
                  let cls = "border-border hover:border-primary";
                  if (submitted) {
                    if (isAns) cls = "border-ok bg-[var(--ok-soft)]";
                    else if (sel) cls = "border-danger bg-[var(--danger-soft)]";
                    else cls = "border-border opacity-70";
                  } else if (sel) cls = "border-primary bg-primary-soft";
                  return (
                    <button key={oi} onClick={() => toggle(q, oi)} disabled={submitted}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${cls}`}>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${q.kind === "multi" ? "rounded" : "rounded-full"} border ${sel ? "border-primary bg-primary text-white" : "border-border"}`}>{sel ? "✓" : ""}</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className={`mt-3 rounded-lg p-3 text-sm ${ok ? "bg-[var(--ok-soft)]" : "bg-[var(--warn-soft)]"}`}>
                  <span className="font-semibold">{ok ? "✅ 正确" : "📖 解析"}：</span>{q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 交卷条 */}
      {!submitted && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[var(--surface)]/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-muted">已答 {answeredCount}/{questions.length} · ⏱ {mmss(secondsLeft)}</span>
            <button onClick={doSubmit} className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white transition hover:bg-primary-strong">交卷</button>
          </div>
        </div>
      )}
    </div>
  );
}
