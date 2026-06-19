"use client";

import { useState } from "react";
import { Block, Discipline } from "@/lib/types";
import { Widget } from "./widgets";

// 极简行内格式：**粗体** 与 `代码`
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    return <span key={i}>{p}</span>;
  });
}

const DISC_STYLE: Record<Discipline, { bg: string; label: string }> = {
  数学: { bg: "#7c3aed", label: "📐 数学" },
  物理: { bg: "#0284c7", label: "🔬 物理" },
  计算机: { bg: "#2563eb", label: "💻 计算机" },
  通信: { bg: "#0d9488", label: "📡 通信" },
  英语: { bg: "#be123c", label: "🔤 英语" },
  安全: { bg: "#c2410c", label: "⚠️ 安全" },
};

function KnowledgeCard({ discipline, title, body }: { discipline: Discipline; title: string; body: string }) {
  const [open, setOpen] = useState(false);
  const s = DISC_STYLE[discipline];
  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border bg-surface">
      <button onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left">
        <span className="rounded-md px-2 py-0.5 text-xs font-semibold text-white" style={{ background: s.bg }}>
          {s.label}
        </span>
        <span className="flex-1 text-sm font-semibold">即时知识卡 · {title}</span>
        <span className="text-muted transition-transform" style={{ transform: open ? "rotate(180deg)" : "" }}>▾</span>
      </button>
      {open && (
        <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted">
          {renderInline(body)}
        </div>
      )}
    </div>
  );
}

const CALLOUT: Record<string, { icon: string; bg: string; bd: string }> = {
  info: { icon: "ℹ️", bg: "var(--surface-2)", bd: "var(--border)" },
  tip: { icon: "💡", bg: "var(--ok-soft)", bd: "var(--ok)" },
  warn: { icon: "⚠️", bg: "var(--warn-soft)", bd: "var(--warn)" },
  danger: { icon: "🚨", bg: "var(--danger-soft)", bd: "var(--danger)" },
  key: { icon: "🔑", bg: "var(--primary-soft)", bd: "var(--primary)" },
};

export function ContentRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-zh">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i} className="mt-8 mb-3 text-xl font-bold tracking-tight">{b.text}</h2>;
          case "h3":
            return <h3 key={i} className="mt-6 mb-2 text-lg font-semibold">{b.text}</h3>;
          case "p":
            return <p key={i}>{renderInline(b.text)}</p>;
          case "list":
            return b.ordered ? (
              <ol key={i} className="my-3 ml-5 list-decimal space-y-1.5">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ol>
            ) : (
              <ul key={i} className="my-3 ml-5 list-disc space-y-1.5">
                {b.items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}
              </ul>
            );
          case "callout": {
            const c = CALLOUT[b.variant];
            return (
              <div key={i} className="my-4 rounded-xl border-l-4 p-4"
                style={{ background: c.bg, borderLeftColor: c.bd }}>
                {b.title && <div className="mb-1 font-semibold">{c.icon} {b.title}</div>}
                <div className="text-sm leading-relaxed">{renderInline(b.body)}</div>
              </div>
            );
          }
          case "knowledge":
            return <KnowledgeCard key={i} discipline={b.discipline} title={b.title} body={b.body} />;
          case "table":
            return (
              <div key={i} className="my-4 overflow-x-auto no-scrollbar">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j} className="border border-border bg-surface-2 px-3 py-2 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="border border-border px-3 py-2 align-top">{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b.caption && <p className="mt-1 text-center text-xs text-muted">{b.caption}</p>}
              </div>
            );
          case "term":
            return (
              <div key={i} className="my-3 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
                <span className="font-mono font-semibold">{b.en}</span>
                {b.abbr && <span className="ml-2 text-muted">({b.abbr})</span>}
                <span className="mx-2">·</span><span>{b.zh}</span>
                {b.note && <span className="ml-2 text-muted">— {b.note}</span>}
              </div>
            );
          case "widget":
            return (
              <div key={i} className="my-5">
                {b.title && <div className="mb-2 text-sm font-semibold text-primary-strong">🧪 {b.title}</div>}
                <Widget widget={b.widget} />
              </div>
            );
          case "diagram":
            return (
              <div key={i} className="my-4 rounded-xl border border-border bg-surface p-4">
                <div dangerouslySetInnerHTML={{ __html: b.svg }} />
                {b.caption && <p className="mt-1 text-center text-xs text-muted">{b.caption}</p>}
              </div>
            );
          case "divider":
            return <hr key={i} className="my-6 border-border" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
