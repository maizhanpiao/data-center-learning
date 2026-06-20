import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { CliDrill } from "@/components/cli-drill";

export const metadata = { title: "命令行模拟题 · 数据中心学习站" };

export default function CliPage() {
  return (
    <div>
      <Link href="/practice" className="text-sm text-muted hover:text-primary-strong">← 返回实操练习</Link>
      <div className="mt-2">
        <PageHeader emoji="⌨️" title="命令行模拟题" subtitle="给任务、你敲命令、即时判对错。练 Linux / Docker / Kubernetes 的命令肌肉记忆。" />
      </div>
      <CliDrill />
      <div className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-muted">
        💡 想要真实终端？打开 <a href="https://killercoda.com" target="_blank" rel="noopener noreferrer" className="text-primary-strong hover:underline">Killercoda</a> 在真环境里敲这些命令，效果最佳。
      </div>
    </div>
  );
}
