import { neon } from "@neondatabase/serverless";

// ============================================================
// Neon (Postgres) 连接 —— 仅在配置了 DATABASE_URL 时启用
// 个人学习数据以单条 JSON 记录存储，按访问口令归档
// ============================================================

export function hasDb() {
  return !!process.env.DATABASE_URL;
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 未配置");
  return neon(url);
}

let ensured = false;
export async function ensureTable() {
  if (ensured) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS study_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ensured = true;
}

/** 简单哈希，把口令变成稳定的存储键（不直接存明文口令） */
export function keyOf(passcode: string) {
  let h = 0;
  for (let i = 0; i < passcode.length; i++) {
    h = (h * 31 + passcode.charCodeAt(i)) | 0;
  }
  return "u_" + (h >>> 0).toString(36);
}
