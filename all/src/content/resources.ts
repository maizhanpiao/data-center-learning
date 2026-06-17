import { Resource } from "@/lib/types";

// 当前收录周（自动更新任务每周会追加更新的批次标签）
export const CURRENT_WEEK = "2026-W25";

// ============================================================
// 初始精选资源库（之后由每周云端定时任务自动扩充与重排）
// 评级 rating：1–5 星，综合权威性 / 质量 / 零基础友好度
// ============================================================
export const RESOURCES: Resource[] = [
  {
    id: "uptime-institute",
    title: "Uptime Institute 官网与知识库",
    type: "官方", url: "https://uptimeinstitute.com", lang: "英", level: "进阶", price: "免费",
    rating: 5, topics: [6, 7],
    reason: "Tier 等级体系的制定者，权威性最高。读懂 Tier I–IV 必看，部分白皮书免费。",
    addedWeek: "2026-W25",
  },
  {
    id: "dcd",
    title: "Data Center Dynamics (DCD)",
    type: "资讯", url: "https://www.datacenterdynamics.com", lang: "英", level: "入门", price: "免费",
    rating: 5, topics: [1, 4, 6],
    reason: "全球数据中心行业第一资讯媒体，了解趋势、新闻、案例的窗口，还有免费在线课程 DCD>Academy。",
    addedWeek: "2026-W25",
  },
  {
    id: "schneider-eu",
    title: "施耐德 Energy University 免费课程",
    type: "视频", url: "https://www.se.com", lang: "英", level: "入门", price: "免费",
    rating: 5, topics: [2, 4, 6],
    reason: "施耐德电气出品的免费在线课程，供配电、制冷、能效讲得系统又实用，颁发学习证书。",
    addedWeek: "2026-W25",
  },
  {
    id: "ashrae-tc99",
    title: "ASHRAE TC 9.9 数据中心热环境指南",
    type: "官方", url: "https://www.ashrae.org", lang: "英", level: "进阶", price: "付费",
    rating: 5, topics: [3, 4],
    reason: "机房温湿度标准的权威来源，做暖通/制冷必读的行业基准。",
    addedWeek: "2026-W25",
  },
  {
    id: "gb50174",
    title: "GB 50174《数据中心设计规范》",
    type: "官方", url: "https://www.mohurd.gov.cn", lang: "中", level: "进阶", price: "免费",
    rating: 5, topics: [4, 6, 7],
    reason: "中国数据中心设计国家标准，国内从业必须熟悉，等级划分与各专业要求的依据。",
    addedWeek: "2026-W25",
  },
  {
    id: "cisco-netacad",
    title: "Cisco Networking Academy（思科网院）",
    type: "视频", url: "https://www.netacad.com", lang: "英", level: "入门", price: "免费",
    rating: 5, topics: [5],
    reason: "学网络的黄金起点，CCNA 方向课程免费，配套 Packet Tracer 模拟器做实验。",
    addedWeek: "2026-W25",
  },
  {
    id: "packet-tracer",
    title: "Cisco Packet Tracer（网络模拟器）",
    type: "工具", url: "https://www.netacad.com/courses/packet-tracer", lang: "英", level: "入门", price: "免费",
    rating: 5, topics: [5],
    reason: "零成本在电脑里搭网络拓扑、配交换机/路由器，本站网络实验首选工具。",
    addedWeek: "2026-W25",
  },
  {
    id: "falstad",
    title: "Falstad 在线电路模拟器",
    type: "工具", url: "https://www.falstad.com/circuit/", lang: "英", level: "入门", price: "免费",
    rating: 4, topics: [0, 2],
    reason: "浏览器里直接搭电路、看电流流动，学电工基础时把抽象的电“看见”。",
    addedWeek: "2026-W25",
  },
  {
    id: "phet",
    title: "PhET 互动科学模拟（科罗拉多大学）",
    type: "工具", url: "https://phet.colorado.edu/zh_CN/", lang: "中", level: "入门", price: "免费",
    rating: 4, topics: [0, 2, 3],
    reason: "免费的物理互动实验（电路、热学等），有中文，打物理/电学基础很直观。",
    addedWeek: "2026-W25",
  },
  {
    id: "zhihu-dc",
    title: "知乎「数据中心」话题",
    type: "社区", url: "https://www.zhihu.com/topic/19594169", lang: "中", level: "入门", price: "免费",
    rating: 4, topics: [1, 4, 7],
    reason: "中文社区，从业者经验、转行问答、行业八卦都有，适合了解真实工作状态。",
    addedWeek: "2026-W25",
  },
  {
    id: "reddit-dc",
    title: "Reddit r/datacenter",
    type: "社区", url: "https://www.reddit.com/r/datacenter/", lang: "英", level: "入门", price: "免费",
    rating: 4, topics: [1, 4, 6],
    reason: "全球数据中心从业者社区，一线运维、设施、布线的真实日常与避坑经验。",
    addedWeek: "2026-W25",
  },
  {
    id: "vertiv-resources",
    title: "Vertiv 资源与白皮书",
    type: "官方", url: "https://www.vertiv.com", lang: "英", level: "进阶", price: "免费",
    rating: 4, topics: [2, 3, 4],
    reason: "供电与制冷设备龙头，白皮书把 UPS、精密空调等原理讲得很透。",
    addedWeek: "2026-W25",
  },
  {
    id: "epi-cdcp",
    title: "EPI CDCP 认证介绍",
    type: "证书", url: "https://www.epi-ap.com", lang: "英", level: "入门", price: "付费",
    rating: 5, topics: [4, 6, 7],
    reason: "本站主线认证。了解考纲、报名与培训机构信息的官方入口。",
    addedWeek: "2026-W25",
  },
  {
    id: "cnet-training",
    title: "CNet Training（数据中心专业认证）",
    type: "证书", url: "https://www.cnet-training.com", lang: "英", level: "进阶", price: "付费",
    rating: 4, topics: [4, 6, 7],
    reason: "BICSI/CDCDP 等数据中心设计与运维认证的知名培训方，了解认证地图用。",
    addedWeek: "2026-W25",
  },
  {
    id: "comptia",
    title: "CompTIA Server+ / Network+ 官方",
    type: "证书", url: "https://www.comptia.org", lang: "英", level: "入门", price: "付费",
    rating: 4, topics: [5],
    reason: "IT 硬件与网络入门认证，考纲清晰，是 IT 基础设施方向的扎实起点。",
    addedWeek: "2026-W25",
  },
  {
    id: "bilibili-dc",
    title: "B 站「数据中心 / 弱电 / 机房」视频合集",
    type: "视频", url: "https://search.bilibili.com/all?keyword=数据中心运维", lang: "中", level: "入门", price: "免费",
    rating: 3, topics: [1, 2, 3, 4],
    reason: "中文视频资源多、直观，适合入门扫盲；质量参差，认准高播放与系统化的UP主。",
    addedWeek: "2026-W25",
  },
];
