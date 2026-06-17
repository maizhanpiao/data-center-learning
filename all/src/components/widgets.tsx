"use client";

import { useState } from "react";
import { WidgetKey } from "@/lib/types";

// ============================================================
// 通用小零件
// ============================================================
function Field({ label, value, onChange, unit, step = "any" }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; step?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-muted">{label}</span>
      <span className="flex items-center gap-1.5">
        <input
          type="number" inputMode="decimal" step={step} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-right text-sm tabular-nums outline-none focus:border-primary"
        />
        {unit && <span className="w-10 text-xs text-muted">{unit}</span>}
      </span>
    </label>
  );
}

function Result({ items }: { items: { label: string; value: string; unit?: string }[] }) {
  return (
    <div className="mt-3 grid gap-2 rounded-xl bg-primary-soft p-3">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <span className="text-sm text-muted">{it.label}</span>
          <span className="font-mono text-lg font-bold text-primary-strong tabular-nums">
            {it.value} <span className="text-xs font-normal">{it.unit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function num(s: string): number | null {
  if (s.trim() === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
const fmt = (n: number, d = 2) => (Number.isInteger(n) ? String(n) : n.toFixed(d));

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-surface-2 p-4">{children}</div>;
}

// ============================================================
// 各计算器
// ============================================================
function Ohm() {
  const [u, setU] = useState("230");
  const [i, setI] = useState("2");
  const U = num(u), I = num(i);
  const res = U !== null && I !== null && I !== 0
    ? [{ label: "功率 P = U×I", value: fmt(U * I), unit: "W" },
       { label: "电阻 R = U÷I", value: fmt(U / I), unit: "Ω" }]
    : [];
  return (
    <Shell>
      <Field label="电压 U" value={u} onChange={setU} unit="V" />
      <Field label="电流 I" value={i} onChange={setI} unit="A" />
      {res.length > 0 && <Result items={res} />}
    </Shell>
  );
}

function ThreePhase() {
  const [u, setU] = useState("380");
  const [i, setI] = useState("16");
  const [pf, setPf] = useState("0.9");
  const U = num(u), I = num(i), PF = num(pf);
  const res = U !== null && I !== null && PF !== null
    ? [{ label: "三相有功 P = √3·U·I·PF", value: fmt((Math.sqrt(3) * U * I * PF) / 1000), unit: "kW" },
       { label: "视在功率 S = √3·U·I", value: fmt((Math.sqrt(3) * U * I) / 1000), unit: "kVA" }]
    : [];
  return (
    <Shell>
      <Field label="线电压 U" value={u} onChange={setU} unit="V" />
      <Field label="线电流 I" value={i} onChange={setI} unit="A" />
      <Field label="功率因数 PF" value={pf} onChange={setPf} />
      {res.length > 0 && <Result items={res} />}
      <p className="mt-2 text-xs text-muted">三相功率 P = √3 × 线电压 × 线电流 × 功率因数。</p>
    </Shell>
  );
}

function DataUnits() {
  const [v, setV] = useState("100");
  const [unit, setUnit] = useState("Mb");
  const V = num(v);
  // 统一换算成 bit
  const toBit: Record<string, number> = {
    bit: 1, b: 1, Mb: 1e6, Gb: 1e9,
    B: 8, KB: 8 * 1024, MB: 8 * 1024 ** 2, GB: 8 * 1024 ** 3, TB: 8 * 1024 ** 4,
  };
  const bits = V !== null ? V * (toBit[unit] ?? 1) : null;
  const res = bits !== null
    ? [
        { label: "换算为兆字节", value: fmt(bits / 8 / 1024 ** 2, 2), unit: "MB" },
        { label: "换算为吉字节", value: fmt(bits / 8 / 1024 ** 3, 4), unit: "GB" },
        { label: "若为带宽，约可下载", value: fmt(bits / 8 / 1e6, 2), unit: "MB/s" },
      ]
    : [];
  return (
    <Shell>
      <div className="flex items-center justify-between gap-3 py-1.5">
        <span className="text-sm text-muted">数值</span>
        <span className="flex items-center gap-1.5">
          <input type="number" value={v} onChange={(e) => setV(e.target.value)}
            className="w-24 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-right text-sm tabular-nums outline-none focus:border-primary" />
          <select value={unit} onChange={(e) => setUnit(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-primary">
            {["bit", "Mb", "Gb", "B", "KB", "MB", "GB", "TB"].map((u) => <option key={u}>{u}</option>)}
          </select>
        </span>
      </div>
      {res.length > 0 && <Result items={res} />}
      <p className="mt-2 text-xs text-muted">注意 bit(b) 与 Byte(B) 的区别：1 Byte = 8 bit。</p>
    </Shell>
  );
}

function Pue() {
  const [total, setTotal] = useState("1500");
  const [it, setIt] = useState("1000");
  const T = num(total), I = num(it);
  const pue = T !== null && I !== null && I !== 0 ? T / I : null;
  let grade = "";
  if (pue !== null) {
    if (pue <= 1.3) grade = "优秀 🟢";
    else if (pue <= 1.5) grade = "良好 🟡";
    else if (pue <= 1.8) grade = "一般 🟠";
    else grade = "偏高，节能空间大 🔴";
  }
  return (
    <Shell>
      <Field label="总用电（设施总功率）" value={total} onChange={setTotal} unit="kW" />
      <Field label="IT 设备用电" value={it} onChange={setIt} unit="kW" />
      {pue !== null && (
        <Result items={[
          { label: "PUE = 总用电 ÷ IT 用电", value: fmt(pue, 3) },
          { label: "评价", value: grade },
        ]} />
      )}
      <p className="mt-2 text-xs text-muted">PUE 越接近 1 越节能。1.0 表示电几乎全用在了 IT 设备上。</p>
    </Shell>
  );
}

function UpsRuntime() {
  const [cap, setCap] = useState("20");
  const [load, setLoad] = useState("8");
  const [dod, setDod] = useState("80");
  const [eff, setEff] = useState("92");
  const C = num(cap), L = num(load), D = num(dod), E = num(eff);
  let minutes: number | null = null;
  if (C !== null && L !== null && L > 0 && D !== null && E !== null) {
    minutes = (C * (D / 100) * (E / 100)) / L * 60;
  }
  return (
    <Shell>
      <Field label="电池总容量" value={cap} onChange={setCap} unit="kWh" />
      <Field label="负载功率" value={load} onChange={setLoad} unit="kW" />
      <Field label="放电深度 DoD" value={dod} onChange={setDod} unit="%" />
      <Field label="逆变效率" value={eff} onChange={setEff} unit="%" />
      {minutes !== null && (
        <Result items={[{ label: "估算续航时间", value: fmt(minutes, 1), unit: "分钟" }]} />
      )}
      <p className="mt-2 text-xs text-muted">粗略估算：续航 ≈ 电池容量×放电深度×效率 ÷ 负载。实际还受温度、电池老化影响。</p>
    </Shell>
  );
}

function Redundancy() {
  const [units, setUnits] = useState("3");
  const [per, setPer] = useState("100");
  const [load, setLoad] = useState("180");
  const [mode, setMode] = useState("N+1");
  const U = num(units), P = num(per), L = num(load);
  let verdict = "";
  if (U !== null && P !== null && L !== null) {
    const total = U * P;
    const afterOneFail = (U - 1) * P;
    const need = mode === "2N" ? L * 2 : L;
    if (mode === "2N") {
      verdict = total >= need
        ? `✅ 满足 2N：总容量 ${total} ≥ 需求两套共 ${need}（任一整套失效仍可独立带载）`
        : `❌ 不满足 2N：需要两套各 ≥ ${L}`;
    } else if (mode === "N+1") {
      verdict = afterOneFail >= L
        ? `✅ 满足 N+1：坏 1 台后剩余 ${afterOneFail} ≥ 负载 ${L}`
        : `❌ 不满足 N+1：坏 1 台后仅 ${afterOneFail} < 负载 ${L}`;
    } else {
      verdict = total >= L
        ? `✅ 满足 N：总容量 ${total} ≥ 负载 ${L}（无冗余，坏 1 台即不足）`
        : `❌ 连 N 都不满足：总容量 ${total} < 负载 ${L}`;
    }
  }
  return (
    <Shell>
      <div className="flex items-center justify-between gap-3 py-1.5">
        <span className="text-sm text-muted">冗余模式</span>
        <select value={mode} onChange={(e) => setMode(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-primary">
          {["N", "N+1", "2N"].map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <Field label="设备台数" value={units} onChange={setUnits} unit="台" />
      <Field label="单台容量" value={per} onChange={setPer} unit="kW" />
      <Field label="负载需求" value={load} onChange={setLoad} unit="kW" />
      {verdict && (
        <div className="mt-3 rounded-xl bg-primary-soft p-3 text-sm leading-relaxed text-foreground">{verdict}</div>
      )}
    </Shell>
  );
}

function Availability() {
  const [a, setA] = useState("99.99");
  const A = num(a);
  const res = A !== null
    ? (() => {
        const down = (1 - A / 100);
        return [
          { label: "每年宕机", value: fmt(down * 8760, 2), unit: "小时" },
          { label: "每月宕机", value: fmt(down * 730 * 60, 1), unit: "分钟" },
          { label: "每天宕机", value: fmt(down * 24 * 3600, 1), unit: "秒" },
        ];
      })()
    : [];
  return (
    <Shell>
      <Field label="可用性" value={a} onChange={setA} unit="%" />
      {res.length > 0 && <Result items={res} />}
      <p className="mt-2 text-xs text-muted">试试 99 / 99.9 / 99.99 / 99.999，感受“多一个 9”的威力。</p>
    </Shell>
  );
}

function CoolingLoad() {
  const [it, setIt] = useState("100");
  const [factor, setFactor] = useState("1.1");
  const I = num(it), F = num(factor);
  const res = I !== null && F !== null
    ? [
        { label: "所需制冷量", value: fmt(I * F), unit: "kW" },
        { label: "约合冷吨(RT)", value: fmt((I * F) / 3.517), unit: "RT" },
      ]
    : [];
  return (
    <Shell>
      <Field label="IT 发热（≈IT 用电）" value={it} onChange={setIt} unit="kW" />
      <Field label="余量系数" value={factor} onChange={setFactor} />
      {res.length > 0 && <Result items={res} />}
      <p className="mt-2 text-xs text-muted">服务器用电几乎全变成热，制冷量需 ≥ IT 发热并留余量。1 冷吨(RT) ≈ 3.517 kW。</p>
    </Shell>
  );
}

function WireAmpacity() {
  const [load, setLoad] = useState("32");
  const L = num(load);
  // 简化版铜芯导线载流量参考（明敷、常温），仅作教学示意
  const table: [number, number][] = [
    [1.5, 18], [2.5, 26], [4, 35], [6, 45], [10, 63], [16, 85], [25, 112], [35, 138], [50, 168],
  ];
  const pick = L !== null ? table.find(([, amp]) => amp >= L * 1.25) : undefined;
  return (
    <Shell>
      <Field label="工作电流" value={load} onChange={setLoad} unit="A" />
      {L !== null && (
        <div className="mt-3 rounded-xl bg-primary-soft p-3 text-sm text-foreground">
          {pick
            ? `建议铜芯截面 ≥ ${pick[0]} mm²（该规格约可载 ${pick[1]}A，已含 1.25 倍安全裕量）`
            : "电流过大，超出本示意表范围，需专业计算选型。"}
        </div>
      )}
      <p className="mt-2 text-xs text-muted">⚠️ 仅为教学示意。实际选线须按规范综合敷设方式、环境温度、根数等因素，由持证电气人员确定。</p>
    </Shell>
  );
}

function RefrigerationCycle() {
  return (
    <Shell>
      <svg viewBox="0 0 360 200" className="w-full" role="img" aria-label="制冷循环示意">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--primary)" />
          </marker>
        </defs>
        {[
          { x: 30, y: 20, w: 120, h: 40, t: "压缩机", s: "低压气→高压气", c: "var(--warn-soft)" },
          { x: 210, y: 20, w: 120, h: 40, t: "冷凝器", s: "放热→液化", c: "var(--danger-soft)" },
          { x: 210, y: 140, w: 120, h: 40, t: "膨胀阀", s: "降压降温", c: "var(--surface)" },
          { x: 30, y: 140, w: 120, h: 40, t: "蒸发器", s: "吸热→气化(制冷)", c: "var(--primary-soft)" },
        ].map((b) => (
          <g key={b.t}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="8" fill={b.c} stroke="var(--border)" />
            <text x={b.x + b.w / 2} y={b.y + 18} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--foreground)">{b.t}</text>
            <text x={b.x + b.w / 2} y={b.y + 33} textAnchor="middle" fontSize="9" fill="var(--muted)">{b.s}</text>
          </g>
        ))}
        <line x1="150" y1="40" x2="205" y2="40" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="270" y1="60" x2="270" y2="135" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="210" y1="160" x2="155" y2="160" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="90" y1="140" x2="90" y2="65" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrow)" />
      </svg>
      <p className="mt-2 text-xs text-muted">制冷剂循环：压缩 → 冷凝放热 → 膨胀降压 → 蒸发吸热（即制冷），周而复始。</p>
    </Shell>
  );
}

// ============================================================
// 注册表
// ============================================================
const REGISTRY: Record<WidgetKey, () => React.ReactElement> = {
  "ohm": Ohm,
  "three-phase": ThreePhase,
  "data-units": DataUnits,
  "pue": Pue,
  "ups-runtime": UpsRuntime,
  "redundancy": Redundancy,
  "availability": Availability,
  "cooling-load": CoolingLoad,
  "wire-ampacity": WireAmpacity,
  "refrigeration-cycle": RefrigerationCycle,
};

export const WIDGET_META: { key: WidgetKey; name: string; desc: string }[] = [
  { key: "ohm", name: "欧姆定律 / 功率计算器", desc: "由电压电流求功率与电阻" },
  { key: "three-phase", name: "三相功率计算器", desc: "线电压电流与功率因数求功率" },
  { key: "pue", name: "PUE 计算器", desc: "评估数据中心能效" },
  { key: "ups-runtime", name: "UPS 电池续航计算器", desc: "估算停电后可撑多久" },
  { key: "cooling-load", name: "制冷量估算器", desc: "由 IT 发热估算所需制冷" },
  { key: "redundancy", name: "N+1 / 2N 冗余推演", desc: "判断冗余是否满足负载" },
  { key: "availability", name: "可用性 / 宕机计算器", desc: "几个 9 等于多少宕机" },
  { key: "data-units", name: "数据单位换算器", desc: "bit/Byte/带宽换算" },
  { key: "wire-ampacity", name: "线径载流量选择器", desc: "按电流估算导线截面（示意）" },
  { key: "refrigeration-cycle", name: "制冷循环示意", desc: "四大件如何制冷" },
];

export function Widget({ widget }: { widget: WidgetKey }) {
  const Comp = REGISTRY[widget];
  return Comp ? <Comp /> : null;
}
