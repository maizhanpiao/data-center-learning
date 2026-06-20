import { Tier } from "@/lib/types";

// ============================================================
// 进阶体系（6 段）—— 对齐云原生运维主线（依据真实招聘）
// 段位按 parts 归组（见 progress.tierStatus）。
// 设施部分(2/3/4)为“选修轨”，不计入主线闯关。
// ============================================================

export const TIERS: Tier[] = [
  {
    level: 1,
    badge: "🥉",
    name: "通识者",
    title: "DC Apprentice",
    goal: "建立全景认知、补齐基础垫脚石，听懂行话，知道数据中心与各角色在做什么。",
    parts: [0, 1],
    knowledge: "基础垫脚石 + 入门与全景（第0、1部分）",
    practice: ["组件识别配对", "“一个请求的旅程”路径追踪", "数据单位换算", "数据中心类型辨识"],
    certs: "打底，无对应认证",
    unlock: ["完成第0、1部分全部章节", "各章自测 ≥ 80%"],
  },
  {
    level: 2,
    badge: "🥈",
    name: "Linux 系统运维",
    title: "Linux Sysadmin",
    goal: "练好一切服务器与云的根基——Linux 命令行、权限、服务、网络、排错。",
    parts: [8],
    knowledge: "Linux 系统运维（第8部分）",
    practice: ["命令行模拟题(Linux 分类)", "Killercoda Linux 实验", "“磁盘写满”故障情景模拟", "在 homelab 装 Ubuntu Server"],
    certs: "≈ RHCSA → RHCE（红帽，上机实操考）",
    unlock: ["完成第8部分全部章节", "完成 Linux 命令行模拟与至少 1 个实验", "通过段位模拟考 ≥ 70%"],
  },
  {
    level: 3,
    badge: "🥇",
    name: "网络 · IT 基础 · 云",
    title: "Infra, Networking & Cloud",
    goal: "掌握服务器、存储、网络，以及虚拟化与云——懂数据中心怎么连、怎么算、怎么上云。",
    parts: [5, 10],
    knowledge: "IT 基础设施 + 云与虚拟化（第5、10部分）",
    practice: ["机柜上架布局", "子网/网络计算", "Packet Tracer 脊叶拓扑实验", "建一台虚拟机", "用免费额度开云主机并部署"],
    certs: "≈ HCIA-Datacom / Network+ · Server+ / 华为云·阿里云·AWS 云认证",
    unlock: ["完成第5、10部分全部章节", "完成网络实验 + 上云部署实操", "通过段位模拟考 ≥ 70%"],
  },
  {
    level: 4,
    badge: "🏅",
    name: "容器与 Kubernetes",
    title: "Cloud-Native Core",
    goal: "啃下招聘最高频、最值钱的技能：Docker 与 Kubernetes 的部署、运维、排障。",
    parts: [9],
    knowledge: "容器与 Kubernetes（第9部分）",
    practice: ["命令行模拟题(Docker/K8s 分类)", "homelab k3s 完整部署实验", "“Pod 反复重启”故障情景模拟", "Killercoda K8s 实验"],
    certs: "≈ Docker → CKA（→CKAD/CKS，真集群上机实操考）",
    unlock: ["完成第9部分全部章节", "完成 K8s 命令行模拟与 homelab 部署", "通过段位模拟考 ≥ 70%"],
  },
  {
    level: 5,
    badge: "🎖️",
    name: "自动化 · 运营 · 可观测",
    title: "Automation, Ops & SRE",
    goal: "会自动化(脚本/Ansible)、会算可用性、会按规程处理故障、会用监控让系统可靠（SRE 思维）。",
    parts: [6, 11],
    knowledge: "运营与可靠性 + 自动化与可观测性（第6、11部分）",
    practice: ["Shell/Python 脚本", "Mac→联想 Ansible 自动化部署", "Prometheus/Grafana 监控实验", "故障排查决策树(MOP/EOP)", "可用性/SLA 计算", "写一份故障复盘"],
    certs: "≈ RHCE(Ansible) / EPI CDCS / SRE 运维能力",
    unlock: ["完成第6、11部分全部章节", "完成 Ansible 与监控实验", "通过段位模拟考 ≥ 70%"],
  },
  {
    level: 6,
    badge: "👑",
    name: "安全 · 标准 · 进阶专精",
    title: "Security & Expert",
    goal: "补齐安全与标准规范，并在一个方向走深，冲击专家级认证与上岗。",
    parts: [7],
    knowledge: "安全 · 标准 · 职业（第7部分）+ 综合复盘",
    practice: ["安全加固与等保要点", "毕业大项目：设计/部署一套小型云原生平台", "全真模拟考"],
    certs: "≈ CISP / RHCA / HCIE / CKS 等专家级",
    unlock: ["完成第7部分全部章节", "完成毕业大项目", "通过全真模拟考 ≥ 75%"],
  },
];

/** 选修轨：设施/动力（理解物理底座，按兴趣/岗位选学，不计入主线闯关） */
export const ELECTIVE_PARTS = [2, 3, 4];

export function tierByLevel(level: number) {
  return TIERS.find((t) => t.level === level);
}
