"use client";

import { useEffect, useState } from "react";
import { Scenario, ScenarioStep, Choice } from "@/content/scenarios";
import { useStore } from "@/lib/store";

export function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const { setPracticeDone } = useStore();
  const [stepId, setStepId] = useState(scenario.steps[0].id);
  const [picked, setPicked] = useState<number | null>(null);
  const [missteps, setMissteps] = useState(0);
  const [started, setStarted] = useState(false);

  const step: ScenarioStep = scenario.steps.find((s) => s.id === stepId) ?? scenario.steps[0];

  // 完美通关（零弯路）记为一次实操完成
  useEffect(() => {
    if (step.terminal && missteps === 0) setPracticeDone(`scenario:${scenario.id}`, true);
  }, [step.terminal, missteps, scenario.id, setPracticeDone]);

  const restart = () => { setStepId(scenario.steps[0].id); setPicked(null); setMissteps(0); setStarted(false); };

  if (!started) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-strong">{scenario.domain}</span>
          <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs">{scenario.difficulty}</span>
        </div>
        <h3 className="text-lg font-bold">{scenario.title}</h3>
        <div className="mt-3 rounded-xl border-l-4 border-[var(--warn)] bg-[var(--warn-soft)] p-3 text-sm">
          🚨 <span className="font-semibold">告警/背景：</span>{scenario.brief}
        </div>
        <button onClick={() => setStarted(true)} className="mt-4 w-full rounded-xl bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-strong">
          ▶ 开始处置
        </button>
      </div>
    );
  }

  if (step.terminal) {
    return (
      <div className="rounded-2xl border border-ok bg-surface p-5">
        <div className="text-center text-4xl">{missteps === 0 ? "🏆" : "✅"}</div>
        <p className="mt-2 text-center font-semibold">{step.situation}</p>
        <div className="mt-3 rounded-xl bg-[var(--ok-soft)] p-4 text-sm whitespace-pre-line">{step.summary}</div>
        <p className="mt-3 text-center text-sm text-muted">本次走了 {missteps} 次弯路。{missteps === 0 ? "一气呵成，完美！" : "看清错误选项的原因，再来一次会更稳。"}</p>
        <button onClick={restart} className="mt-4 w-full rounded-xl border border-border py-2.5 text-sm hover:border-primary">重新演练</button>
      </div>
    );
  }

  const choose = (idx: number, c: Choice) => {
    if (picked !== null) return;
    setPicked(idx);
    if (!c.correct) setMissteps((m) => m + 1);
  };
  const advance = () => { setPicked(null); if (step.next) setStepId(step.next); };
  const pickedChoice = picked !== null ? step.choices?.[picked] : null;

  return (
    <div className="rounded-2xl border border-primary bg-surface p-5">
      <div className="mb-1 text-xs text-muted">{scenario.title} · 弯路 {missteps}</div>
      <p className="font-medium">{step.situation}</p>

      <div className="mt-3 space-y-2">
        {step.choices?.map((c, idx) => {
          const sel = picked === idx;
          let cls = "border-border hover:border-primary";
          if (picked !== null) {
            if (c.correct) cls = "border-ok bg-[var(--ok-soft)]";
            else if (sel) cls = "border-danger bg-[var(--danger-soft)]";
            else cls = "border-border opacity-70";
          }
          return (
            <button key={idx} onClick={() => choose(idx, c)} disabled={picked !== null}
              className={`block w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${cls}`}>
              {c.text}
            </button>
          );
        })}
      </div>

      {pickedChoice && (
        <div className={`mt-3 rounded-lg p-3 text-sm ${pickedChoice.correct ? "bg-[var(--ok-soft)]" : "bg-[var(--warn-soft)]"}`}>
          {pickedChoice.feedback}
        </div>
      )}

      {pickedChoice && (
        pickedChoice.correct ? (
          <button onClick={advance} className="mt-3 w-full rounded-xl bg-primary py-2.5 font-semibold text-white transition hover:bg-primary-strong">继续 →</button>
        ) : (
          <button onClick={() => setPicked(null)} className="mt-3 w-full rounded-xl border border-border py-2.5 text-sm hover:border-primary">换个选择再试</button>
        )
      )}
    </div>
  );
}
