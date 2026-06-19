// ============================================================
// 职业路线图 / 认证地图
// 依据真实招聘要求设计：以"系统·云原生运维"为复利主干，
// 按性价比与重要性分层，认证作为里程碑。
// ============================================================

export interface Cert {
  name: string;
  full: string;
  org: string;
  level: "入门" | "进阶" | "专家";
  exam: "笔试" | "实操" | "笔试+实操";
  value: number; // 含金量 1–5
  note: string;
}

export type Priority = "垫脚石" | "核心主干" | "重要进阶" | "前沿增值" | "设施选修";

export interface RoadmapLayer {
  id: string;
  icon: string;
  title: string;
  priority: Priority;
  tagline: string;
  skills: string[];
  certs: Cert[];
}

export const NORTH_STAR = {
  path: "Linux → 网络 → 容器/Kubernetes → 云 → 自动化 → SRE/平台工程 →（前沿）AI 基础设施",
  reasons: [
    { icon: "📈", title: "会复利", body: "每层踩在上一层肩膀上，底层 Linux/网络功底十年不过时，越叠越值钱。" },
    { icon: "🛡️", title: "抗变化", body: "Linux、网络、自动化思维、读英文文档是“元技能”，新工具来了也能快速上手。" },
    { icon: "🌬️", title: "顺风口", body: "AI 让数据中心爆发，最缺懂 K8s + 云 + GPU 集群的人，个人价值天花板高。" },
    { icon: "🔄", title: "可迁移", body: "这条线的技能几乎所有公司都要，不绑死一家公司、一座城市。" },
  ],
};

export const PRIORITY_META: Record<Priority, { color: string; order: number; desc: string }> = {
  垫脚石: { color: "#7c3aed", order: 0, desc: "底层基础，必备但不必精" },
  核心主干: { color: "#0e7c86", order: 1, desc: "最高性价比，必学，决定你的价值下限" },
  重要进阶: { color: "#2563eb", order: 2, desc: "拉开差距的加分项，该学" },
  前沿增值: { color: "#c2410c", order: 3, desc: "面向未来，决定你的价值上限" },
  设施选修: { color: "#15803d", order: 4, desc: "理解数据中心物理底座，按兴趣/岗位选学" },
};

export const LAYERS: RoadmapLayer[] = [
  // ---------------- 垫脚石 ----------------
  {
    id: "foundation",
    icon: "🧱",
    title: "基础垫脚石",
    priority: "垫脚石",
    tagline: "看懂技术世界的“通用语”，只学够用即可。",
    skills: ["英语：读官方文档/报错", "计算机基础：操作系统/进程/文件", "网络模型与二进制/进制", "必要数学：单位换算/对数/比例"],
    certs: [],
  },
  // ---------------- 核心主干 ----------------
  {
    id: "linux",
    icon: "🐧",
    title: "Linux 系统运维",
    priority: "核心主干",
    tagline: "一切服务器与云的根基，运维第一硬功夫。",
    skills: ["命令行与 Shell", "用户/权限/文件系统", "进程与 systemd", "网络配置与排错", "软件包与日志", "防火墙与 SELinux"],
    certs: [
      { name: "RHCSA", full: "红帽认证系统管理员", org: "Red Hat", level: "入门", exam: "实操", value: 4, note: "Linux 运维敲门砖，纯上机考。" },
      { name: "RHCE", full: "红帽认证工程师", org: "Red Hat", level: "进阶", exam: "实操", value: 5, note: "含 Ansible 自动化，运维硬通货。" },
    ],
  },
  {
    id: "network",
    icon: "🌐",
    title: "计算机网络",
    priority: "核心主干",
    tagline: "数据中心的血管，懂网络才懂分布式。",
    skills: ["TCP/IP 与 OSI", "子网划分与 VLAN", "路由与交换", "DNS/DHCP", "负载均衡", "防火墙与 NAT"],
    certs: [
      { name: "HCIA-Datacom", full: "华为认证·数通", org: "华为", level: "入门", exam: "笔试", value: 3, note: "网络入门，国内认可度高。" },
      { name: "CCNA", full: "思科网络工程师", org: "Cisco", level: "入门", exam: "笔试", value: 4, note: "国际通用网络入门证。" },
    ],
  },
  {
    id: "k8s",
    icon: "☸️",
    title: "容器与 Kubernetes",
    priority: "核心主干",
    tagline: "招聘最高频、最值钱的技能，云原生的心脏。",
    skills: ["Docker 镜像/容器", "K8s 架构与组件", "Pod/Deployment/Service", "存储与网络(CNI)", "Helm 与配置管理", "排障与扩缩容"],
    certs: [
      { name: "CKA", full: "认证 Kubernetes 管理员", org: "CNCF", level: "进阶", exam: "实操", value: 5, note: "真集群里 2 小时做题，招聘高频，含金量极高。" },
      { name: "CKAD", full: "认证 K8s 应用开发者", org: "CNCF", level: "进阶", exam: "实操", value: 4, note: "偏应用部署，与 CKA 互补。" },
      { name: "KCNA", full: "K8s 与云原生入门", org: "CNCF", level: "入门", exam: "笔试", value: 3, note: "云原生全景入门，适合打底。" },
    ],
  },
  {
    id: "cloud",
    icon: "☁️",
    title: "云计算",
    priority: "核心主干",
    tagline: "现代基础设施都在云上，至少精通一朵云。",
    skills: ["IaaS/PaaS/SaaS", "云主机/网络/存储", "对象存储与 CDN", "弹性伸缩与负载均衡", "IAM 权限", "计费与成本"],
    certs: [
      { name: "华为云 HCIP-Cloud", full: "华为云计算", org: "华为云", level: "进阶", exam: "笔试+实操", value: 4, note: "国内云岗常见。" },
      { name: "阿里云 ACP", full: "阿里云专业认证", org: "阿里云", level: "进阶", exam: "笔试", value: 4, note: "国内市场份额大。" },
      { name: "AWS SAA", full: "AWS 解决方案架构师", org: "AWS", level: "进阶", exam: "笔试", value: 4, note: "全球通用，外企/出海首选。" },
    ],
  },
  {
    id: "automation",
    icon: "🤖",
    title: "自动化与 IaC",
    priority: "核心主干",
    tagline: "把重复劳动交给代码，是运维进阶的分水岭。",
    skills: ["Shell / Python 脚本", "Git 版本控制", "Ansible 配置管理", "Terraform 基础设施即代码", "CI/CD 流水线"],
    certs: [
      { name: "RHCE", full: "含 Ansible 自动化", org: "Red Hat", level: "进阶", exam: "实操", value: 5, note: "RHCE 核心就是 Ansible 自动化。" },
    ],
  },
  {
    id: "sre",
    icon: "📊",
    title: "可观测性与 SRE 思维",
    priority: "核心主干",
    tagline: "从“救火”到“防火”，让系统可靠是高阶能力。",
    skills: ["Prometheus + Grafana 监控", "日志体系(ELK/Loki)", "告警与值班", "SLO/SLI/错误预算", "故障复盘(Postmortem)"],
    certs: [],
  },
  // ---------------- 重要进阶 ----------------
  {
    id: "network-pro",
    icon: "🛰️",
    title: "网络进阶",
    priority: "重要进阶",
    tagline: "深入数据中心网络，进国企/运营商的利器。",
    skills: ["脊叶(Spine-Leaf)架构", "BGP/OSPF", "SDN 与 Overlay", "VXLAN", "网络自动化"],
    certs: [
      { name: "HCIP-Datacom", full: "华为认证·数通进阶", org: "华为", level: "进阶", exam: "笔试", value: 4, note: "国企/运营商青睐。" },
      { name: "HCIE-Datacom", full: "华为网络专家", org: "华为", level: "专家", exam: "笔试+实操", value: 5, note: "含金量高、难度大、薪资高。" },
    ],
  },
  {
    id: "security",
    icon: "🔐",
    title: "安全基础",
    priority: "重要进阶",
    tagline: "安全是所有岗位的加分项，越来越刚需。",
    skills: ["等保合规", "漏洞与加固", "入侵检测", "访问控制", "K8s 安全"],
    certs: [
      { name: "CISP", full: "注册信息安全专业人员", org: "中国信息安全测评中心", level: "进阶", exam: "笔试", value: 4, note: "国内安全岗常见门槛。" },
      { name: "CKS", full: "认证 K8s 安全专家", org: "CNCF", level: "专家", exam: "实操", value: 4, note: "需先有 CKA。" },
    ],
  },
  {
    id: "database",
    icon: "🗃️",
    title: "数据库基础",
    priority: "重要进阶",
    tagline: "数据是核心资产，运维绕不开数据库。",
    skills: ["MySQL / PostgreSQL", "Redis 缓存", "备份与恢复", "主从与高可用", "慢查询优化"],
    certs: [
      { name: "OCP", full: "Oracle 认证专家", org: "Oracle", level: "进阶", exam: "笔试+实操", value: 4, note: "传统大型数据库岗。" },
    ],
  },
  // ---------------- 前沿增值 ----------------
  {
    id: "ai-infra",
    icon: "🧠",
    title: "AI 基础设施（未来高地）",
    priority: "前沿增值",
    tagline: "AI 浪潮下最稀缺、价值天花板最高的方向。",
    skills: ["GPU 集群与调度", "高性能网络(RoCE/InfiniBand)", "K8s + GPU(Kubeflow/Volcano)", "分布式训练/推理", "向量数据库"],
    certs: [
      { name: "RHCA", full: "红帽认证架构师", org: "Red Hat", level: "专家", exam: "实操", value: 5, note: "多门叠加，架构级能力。" },
    ],
  },
  {
    id: "platform",
    icon: "🏗️",
    title: "平台工程",
    priority: "前沿增值",
    tagline: "为开发者造“内部云”，新兴高价值角色。",
    skills: ["内部开发者平台(IDP)", "GitOps(ArgoCD)", "黄金路径(Golden Path)", "服务网格(Istio)", "多集群管理"],
    certs: [],
  },
  // ---------------- 设施选修 ----------------
  {
    id: "facilities",
    icon: "🏢",
    title: "设施 / 动力（选修）",
    priority: "设施选修",
    tagline: "懂物理底座，让你比纯软件的人更全面。",
    skills: ["供配电与 UPS", "制冷与气流", "电工基础", "暖通基础", "可用性等级(Tier)"],
    certs: [
      { name: "CDCP", full: "认证数据中心专业人员", org: "EPI", level: "入门", exam: "笔试", value: 3, note: "数据中心设施综合，设施/动力岗。" },
    ],
  },
];
