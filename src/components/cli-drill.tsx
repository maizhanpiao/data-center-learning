"use client";

import { useMemo, useState } from "react";
import { CLI_TASKS, CLI_CATEGORIES, CliTask } from "@/content/cli-tasks";

function normalize(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

function check(task: CliTask, input: string) {
  const v = normalize(input);
  return task.accept.some((p) => new RegExp(p).test(v));
}

export function CliDrill() {
  const [cat, setCat] = useState<(typeof CLI_CATEGORIES)[number]>("Linux");
  const tasks = useMemo(() => CLI_TASKS.filter((t) => t.category === cat), [cat]);
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [showHint, setShowHint] = useState(false);

  const task = tasks[i];

  const switchCat = (c: (typeof CLI_CATEGORIES)[number]) => {
    setCat(c); setI(0); setInput(""); setResult(null); setShowHint(false);
  };
  const submit = () => { if (input.trim()) setResult(check(task, input)); };
  const next = () => {
    setI((x) => (x + 1) % tasks.length); setInput(""); setResult(null); setShowHint(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {CLI_CATEGORIES.map((c) => (
          <button key={c} onClick={() => switchCat(c)}
            className={`rounded-full px-3 py-1 text-sm transition ${c === cat ? "bg-primary text-white" : "border border-border hover:border-primary"}`}>
            {c}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted">{i + 1} / {tasks.length}</span>
      </div>

      <div className="mb-2 text-sm text-muted">任务：</div>
      <p className="mb-3 font-medium">{task.prompt}</p>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2 font-mono text-sm">
        <span className="select-none text-muted">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") (result === null ? submit() : next()); }}
          placeholder="在此输入命令，回车提交…"
          spellCheck={false} autoCapitalize="off" autoCorrect="off"
          disabled={result !== null}
          className="w-full bg-transparent outline-none disabled:opacity-70"
        />
      </div>

      {result !== null && (
        <div className={`mt-3 rounded-lg p-3 text-sm ${result ? "bg-[var(--ok-soft)]" : "bg-[var(--warn-soft)]"}`}>
          <div className="font-semibold">{result ? "✅ 正确！" : "❌ 不对，再看看"}</div>
          <div className="mt-1">标准答案：<code className="font-mono">{task.canonical}</code></div>
          <div className="mt-1 text-muted">{task.explanation}</div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {result === null ? (
          <>
            <button onClick={submit} disabled={!input.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50">提交</button>
            {task.hint && (
              <button onClick={() => setShowHint((h) => !h)} className="text-xs text-muted hover:text-primary-strong">💡 提示</button>
            )}
            {showHint && task.hint && <span className="text-xs text-muted">{task.hint}</span>}
          </>
        ) : (
          <button onClick={next} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong">下一题 →</button>
        )}
      </div>
    </div>
  );
}
