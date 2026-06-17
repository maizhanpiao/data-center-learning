"use client";

import { useMemo, useState } from "react";
import { RESOURCES, CURRENT_WEEK } from "@/content/resources";
import { ResourceType } from "@/lib/types";
import { PageHeader } from "@/components/ui";

const TYPES: ResourceType[] = ["视频", "文章", "书籍", "官方", "社区", "资讯", "证书", "工具"];
const TYPE_ICON: Record<ResourceType, string> = {
  视频: "🎥", 文章: "📄", 书籍: "📘", 官方: "🏛", 社区: "💬", 资讯: "📰", 证书: "🎓", 工具: "🔧",
};

export default function ResourcesPage() {
  const [type, setType] = useState<ResourceType | "全部">("全部");
  const [lang, setLang] = useState<"全部" | "中" | "英">("全部");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const latestWeek = useMemo(
    () => RESOURCES.reduce((m, r) => (r.addedWeek > m ? r.addedWeek : m), CURRENT_WEEK),
    []
  );

  const list = useMemo(() => {
    return RESOURCES
      .filter((r) => type === "全部" || r.type === type)
      .filter((r) => lang === "全部" || r.lang === lang)
      .filter((r) => !onlyFree || r.price === "免费")
      .filter((r) => !onlyNew || r.addedWeek === latestWeek)
      .sort((a, b) => b.rating - a.rating);
  }, [type, lang, onlyFree, onlyNew, latestWeek]);

  const newCount = RESOURCES.filter((r) => r.addedWeek === latestWeek).length;

  return (
    <div>
      <PageHeader emoji="🌐" title="资源库" subtitle={`分类 + 评级的外部优质学习资源。最后更新：${latestWeek} · 本周新增 ${newCount} 项（由每周云端定时任务自动维护）。`} />

      {/* 筛选 */}
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={type === "全部"} onClick={() => setType("全部")}>全部类型</FilterChip>
          {TYPES.map((t) => (
            <FilterChip key={t} active={type === t} onClick={() => setType(t)}>{TYPE_ICON[t]} {t}</FilterChip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {(["全部", "中", "英"] as const).map((l) => (
            <FilterChip key={l} active={lang === l} onClick={() => setLang(l)}>{l === "全部" ? "中英" : l + "文"}</FilterChip>
          ))}
          <FilterChip active={onlyFree} onClick={() => setOnlyFree((v) => !v)}>仅免费</FilterChip>
          <FilterChip active={onlyNew} onClick={() => setOnlyNew((v) => !v)}>🆕 本周新增</FilterChip>
        </div>
      </div>

      {/* 列表 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((r) => (
          <a key={r.id} href={r.url} target="_blank" rel="noopener noreferrer"
            className="card-hover flex flex-col rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">{TYPE_ICON[r.type]}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold leading-snug">{r.title}</h3>
                  {r.addedWeek === latestWeek && <span className="rounded bg-[var(--warn-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--warn)]">新</span>}
                </div>
                <div className="mt-0.5 text-xs" style={{ color: "var(--warn)" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
              </div>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted">{r.reason}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              <Tag>{r.type}</Tag><Tag>{r.lang}文</Tag><Tag>{r.level}</Tag>
              <Tag className={r.price === "免费" ? "text-ok" : ""}>{r.price}</Tag>
            </div>
          </a>
        ))}
      </div>

      {list.length === 0 && <p className="py-10 text-center text-muted">没有符合条件的资源，换个筛选试试。</p>}

      <div className="mt-8 rounded-xl border border-border bg-surface-2 p-4 text-xs text-muted">
        🤖 本资源库由每周云端定时任务自动联网搜索、评级与排序，并提交更新到仓库后自动重新部署。评级为综合编辑判断，链接如失效会在下次更新中修正。
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-primary bg-primary-soft font-semibold text-primary-strong" : "border-border text-muted hover:border-primary"}`}>
      {children}
    </button>
  );
}

function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded bg-surface-2 px-1.5 py-0.5 text-muted ${className}`}>{children}</span>;
}
