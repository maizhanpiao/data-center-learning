"use client";

import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader, Card } from "@/components/ui";

export default function SettingsPage() {
  const { state, sync, passcodeSet, setName, configurePasscode, clearPasscode, exportData, importData, resetAll } = useStore();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const connect = async () => {
    setMsg("连接中…");
    const ok = await configurePasscode(code.trim());
    setMsg(ok ? "✅ 云同步已开启，进度将自动跟随你的口令同步。" : "❌ 连接失败：口令错误，或该部署尚未配置云同步（DATABASE_URL / ACCESS_PASSCODE）。");
    if (ok) setCode("");
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(String(reader.result));
      setMsg(ok ? "✅ 进度已导入。" : "❌ 文件格式不正确。");
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader emoji="⚙️" title="设置" subtitle="同步、备份与个人偏好。" />

      {/* 昵称 */}
      <Card>
        <h2 className="font-bold">昵称</h2>
        <p className="mt-1 text-sm text-muted">显示在仪表盘问候语中。</p>
        <input value={state.name} onChange={(e) => setName(e.target.value)} placeholder="给自己起个名字"
          className="mt-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
      </Card>

      {/* 云同步 */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">☁️ 跨设备云同步</h2>
          <span className="text-xs" style={{ color: passcodeSet ? "var(--ok)" : "var(--muted)" }}>
            {passcodeSet ? `状态：${sync}` : "未开启"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          输入部署时设置的访问口令，即可让进度、笔记、抽认卡在手机/电脑间自动同步（数据存于你的 Neon 数据库）。
        </p>
        {!passcodeSet ? (
          <div className="mt-3 flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} type="password" placeholder="访问口令"
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={connect} disabled={!code.trim()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50">
              开启同步
            </button>
          </div>
        ) : (
          <button onClick={() => { clearPasscode(); setMsg("已关闭云同步（本地数据保留）。"); }}
            className="mt-3 rounded-xl border border-border px-4 py-2 text-sm hover:border-danger">
            关闭云同步
          </button>
        )}
        <p className="mt-2 text-xs text-muted">本地未部署数据库时此功能不可用，使用下方导出/导入即可手动备份与迁移。</p>
      </Card>

      {/* 备份 */}
      <Card>
        <h2 className="font-bold">💾 备份与迁移</h2>
        <p className="mt-1 text-sm text-muted">导出为文件保存，或在另一台设备导入。</p>
        <div className="mt-3 flex gap-2">
          <button onClick={exportData} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary">导出进度</button>
          <button onClick={() => fileRef.current?.click()} className="rounded-xl border border-border px-4 py-2 text-sm hover:border-primary">导入进度</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        </div>
      </Card>

      {/* 重置 */}
      <Card>
        <h2 className="font-bold text-[var(--danger)]">⚠️ 危险区</h2>
        <p className="mt-1 text-sm text-muted">清空所有学习进度、笔记与抽认卡记录，不可恢复。</p>
        <button onClick={() => { if (confirm("确定清空全部学习数据？此操作不可恢复。")) { resetAll(); setMsg("已重置全部数据。"); } }}
          className="mt-3 rounded-xl border border-[var(--danger)] px-4 py-2 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)]">
          清空全部数据
        </button>
      </Card>

      {msg && <p className="rounded-xl bg-surface-2 p-3 text-sm">{msg}</p>}
    </div>
  );
}
