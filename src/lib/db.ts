import { neon } from "@neondatabase/serverless";

// ============================================================
// Neon (Postgres) 连接 —— 仅在配置了数据库连接串时启用
// 个人学习数据以单条 JSON 记录存储，按访问口令归档
// 兼容 Vercel 各集成可能注入的不同变量名
// ============================================================

function getDbUrl(): string | undefined {
  // 1) 先用常见的标准变量名
  const known =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  if (known) return known;

  // 2) 兜底：扫描所有环境变量，找出任意一个 Postgres 连接串
  //    （兼容 Vercel/Neon 集成可能加的自定义前缀，如 STORAGE_DATABASE_URL）
  const isPg = (v?: string) => !!v && /^postgres(ql)?:\/\//.test(v);
  // 优先选连接池(pooler)地址，更适合 serverless
  const candidates = Object.values(process.env).filter(isPg) as string[];
  const pooled = candidates.find((v) => v.includes("-pooler"));
  return pooled || candidates[0];
}

export function hasDb() {
  return !!getDbUrl();
}

export function getSql() {
  const url = getDbUrl();
  if (!url) throw new Error("数据库连接串未配置");
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
