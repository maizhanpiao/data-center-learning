import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { hasDb, getExtraResources, insertResources } from "@/lib/db";
import { RESOURCES } from "@/content/resources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 联网搜索+生成可能较久

const MODEL = "claude-opus-4-8";
const TYPES = ["视频", "文章", "书籍", "官方", "社区", "资讯", "证书", "工具"];

function isoWeek(d = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function idFromUrl(url: string): string {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (h * 31 + url.charCodeAt(i)) | 0;
  return "ai-" + (h >>> 0).toString(36);
}

const PROMPT = `你在维护一个中文「数据中心学习站」的资源库。主线是云原生运维(Linux→网络→容器/K8s→云→自动化/SRE)，兼顾设施(电工/暖通/供配电制冷)、标准认证、职业发展。

请用 web_search 联网搜索本周值得收录的 5–8 个高质量学习资源，重点覆盖：Linux(RHCSA/RHCE)、Docker 与 Kubernetes(CKA/CKAD/CKS)、云(华为云/阿里云/AWS)、自动化(Shell/Python/Ansible/Git)、可观测性与SRE(Prometheus/Grafana)、网络(HCIA/HCIP-Datacom)，也可补设施/认证/资讯/职业。优先权威来源、零基础友好、免费。

最后只输出一个 JSON 数组（不要任何解释、不要 markdown 代码围栏），每个元素字段：
- title: 字符串（中文标题）
- type: 必须是其中之一：视频/文章/书籍/官方/社区/资讯/证书/工具
- url: 有效的 https 链接
- lang: "中" 或 "英"
- level: "入门" 或 "进阶"
- price: "免费" 或 "付费"
- rating: 1到5的整数（综合权威性/质量/零基础友好度）
- topics: 整数数组，取值0-11（0基础 1入门全景 2电工 3暖通 4物理设施 5 IT基础 6运营可靠 7安全标准职业 8 Linux 9容器K8s 10云与虚拟化 11自动化可观测）
- reason: 一句话中文推荐理由/适合谁

只输出 JSON 数组本身。`;

function checkAuth(req: NextRequest): boolean {
  const passcode = req.headers.get("x-passcode") ?? "";
  const expected = process.env.ACCESS_PASSCODE;
  if (expected && passcode !== expected) return false;
  if (!passcode) return false;
  return true;
}

function extractJsonArray(text: string): unknown[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) throw new Error("模型未返回 JSON 数组");
  return JSON.parse(text.slice(start, end + 1));
}

type Raw = Record<string, unknown>;
function valid(r: Raw): boolean {
  return (
    typeof r.title === "string" && r.title.length > 0 &&
    typeof r.url === "string" && /^https?:\/\//.test(r.url) &&
    typeof r.type === "string" && TYPES.includes(r.type) &&
    (r.lang === "中" || r.lang === "英") &&
    (r.level === "入门" || r.level === "进阶") &&
    (r.price === "免费" || r.price === "付费") &&
    Number.isInteger(r.rating) && (r.rating as number) >= 1 && (r.rating as number) <= 5 &&
    Array.isArray(r.topics) && (r.topics as unknown[]).every((t) => Number.isInteger(t) && (t as number) >= 0 && (t as number) <= 11) &&
    typeof r.reason === "string" && r.reason.length > 0
  );
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "未开通 API：请在 Vercel 配置 ANTHROPIC_API_KEY 后即可使用本功能。" }, { status: 503 });
  }
  if (!hasDb()) {
    return NextResponse.json({ error: "云数据库未配置（需先连接 Neon）。" }, { status: 503 });
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "口令错误" }, { status: 401 });
  }

  try {
    const week = isoWeek();
    // 已有 id / url，用于去重
    const existing = await getExtraResources().catch(() => [] as unknown[]);
    const seenUrls = new Set<string>([...RESOURCES.map((r) => r.url), ...existing.map((r) => (r as Raw).url as string)]);
    const seenIds = new Set<string>([...RESOURCES.map((r) => r.id), ...existing.map((r) => (r as Raw).id as string)]);

    const client = new Anthropic();
    const params: any = {
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      tools: [{ type: "web_search_20260209", name: "web_search" }],
      messages: [{ role: "user", content: PROMPT }],
    };

    let resp = await client.messages.create(params);
    let guard = 0;
    while (resp.stop_reason === "pause_turn" && guard++ < 6) {
      params.messages.push({ role: "assistant", content: resp.content });
      resp = await client.messages.create(params);
    }
    if (resp.stop_reason === "refusal") {
      return NextResponse.json({ error: "模型拒绝了本次请求，请稍后再试。" }, { status: 502 });
    }

    const text = resp.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
    const arr = extractJsonArray(text);

    const items: Array<Raw & { id: string; addedWeek: string; week: string }> = [];
    for (const raw of arr) {
      const r = raw as Raw;
      if (!valid(r)) continue;
      const url = r.url as string;
      const id = idFromUrl(url);
      if (seenUrls.has(url) || seenIds.has(id)) continue;
      seenUrls.add(url); seenIds.add(id);
      items.push({ ...r, id, addedWeek: week, week });
    }

    if (items.length === 0) {
      return NextResponse.json({ added: 0, week, message: "本次未发现可新增的资源（可能都已收录）。" });
    }

    const added = await insertResources(items);
    return NextResponse.json({ added, week, titles: items.map((i) => i.title) });
  } catch (e) {
    return NextResponse.json({ error: "更新失败：" + String(e) }, { status: 500 });
  }
}
