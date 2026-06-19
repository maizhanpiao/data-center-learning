import { PageHeader } from "@/components/ui";
import { LAYERS, NORTH_STAR, PRIORITY_META, Priority, Cert } from "@/content/roadmap";

export const metadata = { title: "职业路线图 · 数据中心学习站" };

const PRIORITY_ORDER: Priority[] = ["垫脚石", "核心主干", "重要进阶", "前沿增值", "设施选修"];

const EXAM_STYLE: Record<Cert["exam"], string> = {
  实操: "bg-[var(--ok-soft)] text-ok",
  笔试: "bg-surface-2 text-muted",
  "笔试+实操": "bg-primary-soft text-primary-strong",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="tabular-nums text-xs" style={{ color: "var(--warn)" }} title={`含金量 ${n}/5`}>
      {"★".repeat(n)}<span className="text-muted">{"★".repeat(5 - n)}</span>
    </span>
  );
}

function CertRow({ c }: { c: Cert }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
      <span className="font-semibold">{c.name}</span>
      <span className="text-xs text-muted">{c.full} · {c.org}</span>
      <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${EXAM_STYLE[c.exam]}`}>{c.exam}</span>
      <span className="rounded bg-surface px-1.5 py-0.5 text-[11px] text-muted">{c.level}</span>
      <Stars n={c.value} />
      <span className="w-full text-xs text-muted">{c.note}</span>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <div>
      <PageHeader emoji="🗺️" title="职业路线图 · 认证地图"
        subtitle="依据真实招聘要求设计：以“系统·云原生运维”为复利主干，按性价比与重要性分层，认证作为里程碑。" />

      {/* 北极星 */}
      <div className="mb-8 rounded-2xl border border-primary bg-primary-soft p-6">
        <div className="text-xs font-semibold text-primary-strong">⭐ 北极星路线</div>
        <div className="mt-2 text-lg font-bold leading-relaxed">{NORTH_STAR.path}</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NORTH_STAR.reasons.map((r) => (
            <div key={r.title} className="rounded-xl bg-surface p-3">
              <div className="font-semibold">{r.icon} {r.title}</div>
              <div className="mt-1 text-xs text-muted">{r.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 优先级说明 */}
      <div className="mb-6 flex flex-wrap gap-2">
        {PRIORITY_ORDER.map((p) => (
          <div key={p} className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIORITY_META[p].color }} />
            <span className="font-semibold">{p}</span>
            <span className="text-muted">· {PRIORITY_META[p].desc}</span>
          </div>
        ))}
      </div>

      {/* 分层 */}
      <div className="space-y-8">
        {PRIORITY_ORDER.map((p) => {
          const layers = LAYERS.filter((l) => l.priority === p);
          if (!layers.length) return null;
          const meta = PRIORITY_META[p];
          return (
            <section key={p}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-4 w-1.5 rounded-full" style={{ background: meta.color }} />
                <h2 className="text-lg font-bold">{p}</h2>
                <span className="text-xs text-muted">{meta.desc}</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {layers.map((l) => (
                  <div key={l.id} className="rounded-2xl border border-border bg-surface p-5"
                    style={{ borderLeft: `4px solid ${meta.color}` }}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{l.icon}</span>
                      <span className="text-base font-bold">{l.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{l.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {l.skills.map((s) => (
                        <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs">{s}</span>
                      ))}
                    </div>
                    {l.certs.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-xs font-semibold text-muted">🎯 里程碑认证</div>
                        {l.certs.map((c) => <CertRow key={c.name} c={c} />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl bg-surface-2 p-4 text-sm text-muted">
        💡 <span className="font-semibold text-foreground">心法</span>：证书是“里程碑”不是“目的”，真正增值的是<strong>功底 + 动手能力</strong>。
        其中 <strong>CKA、RHCE</strong> 等是<strong>上机实操考</strong>（真终端/真集群），需配合实验练习——本站会用免费的 killercoda / kind / minikube 提供分步实验手册。
      </div>
    </div>
  );
}
