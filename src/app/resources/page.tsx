"use client";

import { useEffect, useMemo, useState } from "react";
import { RESOURCES, CURRENT_WEEK } from "@/content/resources";
import { Resource, ResourceType } from "@/lib/types";
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
  const [extra, setExtra] = useState<Resource[]>([]);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchExtra = () => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((d) => setExtra(Array.isArray(d.resources) ? d.resources : []))
      .catch(() => setExtra([]));
  };
  useEffect(fetchExtra, []);

  // 合并：AI 收录(extra) + 静态精选(RESOURCES)，按 id 去重
  const all = useMemo(() => {
    const map = new Map<string, Resource>();
    for (const r of RESOURCES) map.set(r.id, r);
    for (const r of extra) if (r && r.id) map.set(r.id, r);
    return [...map.values()];
  }, [extra]);

  const latestWeek = useMemo(
    () => all.reduce((m, r) => (r.addedWeek > m ? r.addedWeek : m), CURRENT_WEEK),
    [all]
  );

  const list = useMemo(() => {
    return all
      .filter((r) => type === "全部" || r.type === type)
      .filter((r) => lang === "全部" || r.lang === lang)
      .filter((r) => !onlyFree || r.price === "免费")
      .filter((r) => !onlyNew || r.addedWeek === latestWeek)
      .sort((a, b) => b.rating - a.rating);
  }, [all, type, lang, onlyFree, onlyNew, latestWeek]);

  const newCount = all.filter((r) => r.addedWeek === latestWeek).length;

  const runUpdate = async () => {
    setMsg(null);
    const passcode = typeof window !== "undefined" ? localStorage.getItem("dc_passcode") : null;
    if (!passcode) {
      setMsg("请先到「设置」页输入访问口令，再使用立即更新。");
      return;
    }
    setUpdating(true);
    try {
      const r = await fetch("/api/resources/update", { method: "POST", headers: { "x-passcode": passcode } });
      const d = await r.json();
      if (r.ok) {
        setMsg(d.added > 0 ? `✅ 已新增 ${d.added} 项资源（${d.week}）` : (d.message || "本次没有新增。"));
        fetchExtra();
      } else {
        setMsg("⚠️ " + (d.error || `更新失败（${r.status}）`));
      }
    } catch (e) {
      setMsg("⚠️ 网络错误：" + String(e));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <PageHeader emoji="🌐" title="资源库" subtitle={`分类 + 评级的外部优质学习资源。最后更新：${latestWeek} · 本周新增 ${newCount} 项。`} />

      {/* 立即更新 */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex-1">
          <div className="font-semibold">🔄 立即更新资源库</div>
          <div className="text-xs text-muted">由 AI 联网搜索最新优质资源并入库（需已开通 API；用你的访问口令）。</div>
        </div>
        <button onClick={runUpdate} disabled={updating}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60">
          {updating ? "更新中…（约30–60秒）" : "立即更新"}
        </button>
      </div>
      {msg && <div className="mb-5 rounded-lg bg-surface-2 p-3 text-sm">{msg}</div>}

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
        🤖 资源库 = 精心整理的静态精选 + AI 联网收录。点「立即更新」可随时让 AI 搜罗最新资源并自动入库（开通 API 后生效）；评级为综合编辑判断，链接如失效会在后续更新中修正。
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
