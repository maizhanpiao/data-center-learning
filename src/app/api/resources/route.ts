import { NextResponse } from "next/server";
import { getExtraResources, hasDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 读取 AI 收录的资源（与前端静态精选库合并展示）。无数据库时返回空数组。
export async function GET() {
  if (!hasDb()) return NextResponse.json({ resources: [] });
  try {
    const resources = await getExtraResources();
    return NextResponse.json({ resources });
  } catch {
    return NextResponse.json({ resources: [] });
  }
}
