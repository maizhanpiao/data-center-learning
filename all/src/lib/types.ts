// ============================================================
// 全站数据模型
// ============================================================

/** 支撑学科（用于"即时知识卡"分类） */
export type Discipline = "数学" | "物理" | "计算机" | "通信" | "英语" | "安全";

/** 章节正文的内容块 —— 用数据驱动渲染，便于扩展和嵌入互动组件 */
export type Block =
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "callout"; variant: "info" | "tip" | "warn" | "danger" | "key"; title?: string; body: string }
  | { type: "knowledge"; discipline: Discipline; title: string; body: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "term"; en: string; zh: string; abbr?: string; note?: string }
  | { type: "widget"; widget: WidgetKey; title?: string }
  | { type: "diagram"; svg: string; caption?: string }
  | { type: "divider" };

/** 可嵌入章节的互动组件标识 */
export type WidgetKey =
  | "ohm"            // 欧姆定律 / 功率计算器
  | "three-phase"    // 三相功率计算器
  | "wire-ampacity"  // 线径载流量选择器
  | "ups-runtime"    // UPS 电池续航计算器
  | "pue"            // PUE 计算器
  | "cooling-load"   // 制冷量估算器
  | "redundancy"     // N+1 / 2N 冗余推演
  | "availability"   // 可用性 / SLA 计算器
  | "data-units"     // 数据单位换算器
  | "refrigeration-cycle"; // 制冷循环示意

export interface QuizQuestion {
  id: string;
  /** single = 单选, multi = 多选, tf = 判断 */
  kind: "single" | "multi" | "tf";
  question: string;
  options: string[];
  /** 正确选项的下标（multi 可多个；tf 用 [0]=对 / [1]=错） */
  answer: number[];
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  chapterId: string;
}

export interface Chapter {
  id: string;            // 如 "0-2", "1-1"
  part: number;          // 所属部分编号（0–7）
  index: string;         // 显示用编号，如 "0.2" / "5"
  title: string;
  summary: string;       // 一句话简介
  tier: number;          // 关联段位 L1–L6
  minutes: number;       // 预计学习时长
  objectives: string[];  // 学习目标
  blocks: Block[];       // 正文内容；空数组表示"内容编写中"
  quiz: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface Part {
  id: number;
  title: string;
  subtitle: string;
  icon: string;          // emoji
  color: string;         // CSS 颜色
}

/** 6 段进阶体系 */
export interface Tier {
  level: number;         // 1–6
  badge: string;         // emoji 徽章
  name: string;
  title: string;         // 称号
  goal: string;
  parts: number[];       // 涵盖的课程部分
  knowledge: string;
  practice: string[];
  certs: string;
  unlock: string[];      // 解锁条件清单
}

/** 资源库条目 */
export type ResourceType =
  | "视频" | "文章" | "书籍" | "官方" | "社区" | "资讯" | "证书" | "工具";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  lang: "中" | "英";
  level: "入门" | "进阶";
  price: "免费" | "付费";
  rating: number;        // 1–5 星
  topics: number[];      // 关联课程部分
  reason: string;        // 推荐理由 / 适合谁
  addedWeek: string;     // 收录周（用于"本周新增"）
}
