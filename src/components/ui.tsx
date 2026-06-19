import Link from "next/link";

export function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color ?? "var(--primary)" }} />
    </div>
  );
}

export function Card({ children, className = "", href }: { children: React.ReactNode; className?: string; href?: string }) {
  const cls = `rounded-2xl border border-border bg-surface p-5 ${href ? "card-hover block" : ""} ${className}`;
  return href ? <Link href={href} className={cls}>{children}</Link> : <div className={cls}>{children}</div>;
}

export function PageHeader({ title, subtitle, emoji }: { title: string; subtitle?: string; emoji?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{emoji && <span className="mr-2">{emoji}</span>}{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}
