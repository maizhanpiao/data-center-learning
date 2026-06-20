import { Part } from "@/lib/types";

export const PARTS: Part[] = [
  { id: 0, title: "基础垫脚石", subtitle: "英语 · 数学 · 物理 · 计算机 · 通信", icon: "🧱", color: "#7c3aed" },
  { id: 1, title: "入门与全景", subtitle: "认识数据中心与行业", icon: "🌐", color: "#0e7c86" },
  { id: 2, title: "设施基本功 · 电工", subtitle: "供电相关的电学基础", icon: "⚡", color: "#d97706" },
  { id: 3, title: "设施基本功 · 暖通", subtitle: "制冷与空气调节", icon: "❄️", color: "#0284c7" },
  { id: 4, title: "物理基础设施", subtitle: "机房 · 供配电 · 制冷 · 布线", icon: "🏢", color: "#0d9488" },
  { id: 5, title: "IT 基础设施", subtitle: "服务器 · 存储 · 网络 · 云", icon: "🖥️", color: "#2563eb" },
  { id: 6, title: "运营与可靠性", subtitle: "冗余 · 等级 · 监控 · 运维", icon: "🛠️", color: "#15803d" },
  { id: 7, title: "安全 · 标准 · 职业", subtitle: "规范 · 认证 · 求职", icon: "🎓", color: "#be123c" },
  { id: 8, title: "Linux 系统运维", subtitle: "云原生主线起点 · 对标 RHCSA/RHCE", icon: "🐧", color: "#16a34a" },
  { id: 9, title: "容器与 Kubernetes", subtitle: "招聘核心 · 对标 CKA", icon: "☸️", color: "#326ce5" },
];

export function partById(id: number) {
  return PARTS.find((p) => p.id === id)!;
}
