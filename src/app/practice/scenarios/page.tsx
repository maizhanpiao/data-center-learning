import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { ScenarioPlayer } from "@/components/scenario";
import { SCENARIOS } from "@/content/scenarios";

export const metadata = { title: "故障排查情景模拟 · 数据中心学习站" };

export default function ScenariosPage() {
  return (
    <div>
      <Link href="/practice" className="text-sm text-muted hover:text-primary-strong">← 返回实操练习</Link>
      <div className="mt-2">
        <PageHeader emoji="🚨" title="故障排查情景模拟" subtitle="真实告警场景，你一步步决策处置，系统按规范给反馈——不用真硬件，练的是排障思路与流程。" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {SCENARIOS.map((s) => (
          <ScenarioPlayer key={s.id} scenario={s} />
        ))}
      </div>
    </div>
  );
}
