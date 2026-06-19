import { NextRequest, NextResponse } from "next/server";
import { ensureTable, getSql, hasDb, keyOf } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 校验访问口令：若设置了 ACCESS_PASSCODE 环境变量则必须匹配
function checkAuth(req: NextRequest): { ok: boolean; passcode: string } {
  const passcode = req.headers.get("x-passcode") ?? "";
  const expected = process.env.ACCESS_PASSCODE;
  if (expected && passcode !== expected) return { ok: false, passcode };
  if (!passcode) return { ok: false, passcode };
  return { ok: true, passcode };
}

export async function GET(req: NextRequest) {
  if (!hasDb()) return NextResponse.json({ error: "云同步未配置" }, { status: 404 });
  const { ok, passcode } = checkAuth(req);
  if (!ok) return NextResponse.json({ error: "口令错误" }, { status: 401 });
  try {
    await ensureTable();
    const sql = getSql();
    const rows = (await sql`SELECT data FROM study_state WHERE id = ${keyOf(passcode)}`) as { data: unknown }[];
    return NextResponse.json({ state: rows[0]?.data ?? null });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!hasDb()) return NextResponse.json({ error: "云同步未配置" }, { status: 404 });
  const { ok, passcode } = checkAuth(req);
  if (!ok) return NextResponse.json({ error: "口令错误" }, { status: 401 });
  try {
    const body = await req.json();
    const data = body?.state;
    if (!data) return NextResponse.json({ error: "缺少 state" }, { status: 400 });
    await ensureTable();
    const sql = getSql();
    await sql`
      INSERT INTO study_state (id, data, updated_at)
      VALUES (${keyOf(passcode)}, ${JSON.stringify(data)}, now())
      ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
