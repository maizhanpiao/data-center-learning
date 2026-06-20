"use client";

import { useState } from "react";
import Link from "next/link";
import { WIDGET_META, Widget } from "@/components/widgets";
import { WidgetKey } from "@/lib/types";
import { PageHeader } from "@/components/ui";

const LABS = [
  { icon: "🌐", title: "搭建脊叶网络拓扑", tool: "Cisco Packet Tracer", url: "https://www.netacad.com/courses/packet-tracer",
    desc: "在模拟器里搭一个 2 脊 2 叶拓扑，配置 VLAN 并互通，理解数据中心网络架构。" },
  { icon: "🖥️", title: "安装并配置一台虚拟服务器", tool: "VirtualBox", url: "https://www.virtualbox.org",
    desc: "创建虚拟机、安装 Linux、练习基础命令行，体会服务器运维日常。" },
  { icon: "💾", title: "RAID 配置模拟", tool: "VirtualBox / 在线模拟", url: "https://www.virtualbox.org",
    desc: "用多块虚拟磁盘组建 RAID 0/1/5，理解冗余与性能的取舍。" },
  { icon: "⚡", title: "虚拟电路搭建", tool: "Falstad / Tinkercad", url: "https://www.falstad.com/circuit/",
    desc: "在浏览器里搭简单电路，观察电流流动，把电学概念“看见”。" },
];

export default function PracticePage() {
  const [active, setActive] = useState<WidgetKey | null>(null);

  return (
    <div>
      <PageHeader emoji="🧪" title="实操练习" subtitle="浏览器内动手练：故障排查模拟、命令行训练、计算器工具，以及引导式自助实验手册。" />

      <h2 className="mb-3 text-lg font-bold">🎮 模拟实操</h2>
      <Link href="/practice/homelab" className="card-hover mb-3 block rounded-2xl border border-primary bg-primary-soft p-5">
        <div className="flex items-center gap-2 text-base font-bold">🏠 homelab 搭建引导实验 <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">旗舰</span></div>
        <p className="mt-1 text-sm text-muted">用你的 Mac + 联想 两台机，从装系统到 K8s、Ansible、监控，一步步搭出真实运维环境。分阶段可勾选、带验收清单。</p>
        <span className="mt-2 inline-block text-xs font-semibold text-primary-strong">开始搭建 →</span>
      </Link>
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <Link href="/practice/scenarios" className="card-hover rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-base font-bold">🚨 故障排查情景模拟</div>
          <p className="mt-1 text-sm text-muted">真实告警场景下一步步决策处置，练排障思路与流程，不需要真硬件。</p>
          <span className="mt-2 inline-block text-xs font-semibold text-primary-strong">开始演练 →</span>
        </Link>
        <Link href="/practice/cli" className="card-hover rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 text-base font-bold">⌨️ 命令行模拟题</div>
          <p className="mt-1 text-sm text-muted">给任务敲命令、即时判对错，练 Linux / Docker / Kubernetes 命令肌肉记忆。</p>
          <span className="mt-2 inline-block text-xs font-semibold text-primary-strong">开始训练 →</span>
        </Link>
      </div>

      <h2 className="mb-3 text-lg font-bold">🧮 内置计算器与实操工具</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {WIDGET_META.map((w) => (
          <div key={w.key} className="rounded-2xl border border-border bg-surface p-4">
            <button onClick={() => setActive(active === w.key ? null : w.key)} className="flex w-full items-center gap-3 text-left">
              <span className="text-xl">🧪</span>
              <div className="flex-1">
                <div className="font-semibold">{w.name}</div>
                <div className="text-xs text-muted">{w.desc}</div>
              </div>
              <span className="text-muted transition-transform" style={{ transform: active === w.key ? "rotate(180deg)" : "" }}>▾</span>
            </button>
            {active === w.key && <div className="mt-3"><Widget widget={w.key} /></div>}
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-bold">🛠️ 引导式自助实验</h2>
      <p className="mb-3 text-sm text-muted">用免费工具在自己电脑上动手做。点击工具名了解/下载。物理实操（带电作业、制冷剂操作等）须线下持证进行。</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {LABS.map((l) => (
          <div key={l.title} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 font-semibold">{l.icon} {l.title}</div>
            <p className="mt-1 text-sm text-muted">{l.desc}</p>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary-strong hover:underline">
              🔧 工具：{l.tool} ↗
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-[var(--warn)] bg-[var(--warn-soft)] p-4 text-sm">
        ⚠️ <span className="font-semibold">安全提醒：</span>电工与暖通的真实操作（带电作业、制冷剂加注/检漏等）属特种作业，必须经正规培训、持操作证、按规程在合格场所进行。本站工具仅用于理论计算与概念练习。
      </div>
    </div>
  );
}
