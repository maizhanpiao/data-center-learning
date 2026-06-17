"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

const LINKS = [
  { href: "/", label: "仪表盘", icon: "🏠" },
  { href: "/learn", label: "课程", icon: "📚" },
  { href: "/path", label: "进阶地图", icon: "🏆" },
  { href: "/practice", label: "实操练习", icon: "🧪" },
  { href: "/flashcards", label: "抽认卡", icon: "🎴" },
  { href: "/resources", label: "资源库", icon: "🌐" },
  { href: "/settings", label: "设置", icon: "⚙️" },
];

const SYNC_LABEL: Record<string, { t: string; c: string }> = {
  off: { t: "本地", c: "var(--muted)" },
  local: { t: "本地（云端离线）", c: "var(--warn)" },
  syncing: { t: "同步中…", c: "var(--accent)" },
  synced: { t: "已云同步", c: "var(--ok)" },
  error: { t: "同步出错", c: "var(--danger)" },
};

export function Nav() {
  const pathname = usePathname();
  const { sync } = useStore();
  const [open, setOpen] = useState(false);
  const s = SYNC_LABEL[sync] ?? SYNC_LABEL.off;

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">🗄️</span>
          <span className="hidden sm:inline">数据中心学习站</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${isActive(l.href) ? "bg-primary-soft font-semibold text-primary-strong" : "text-muted hover:bg-surface-2"}`}>
              <span className="mr-1">{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>

        <span className="ml-auto flex items-center gap-1.5 text-xs md:ml-2" style={{ color: s.c }}>
          <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
          <span className="hidden sm:inline">{s.t}</span>
        </span>

        <button onClick={() => setOpen((o) => !o)} className="md:hidden" aria-label="菜单">
          <span className="text-xl">☰</span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`block px-4 py-3 text-sm ${isActive(l.href) ? "bg-primary-soft font-semibold text-primary-strong" : ""}`}>
              <span className="mr-2">{l.icon}</span>{l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
