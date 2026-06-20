import { Chapter } from "@/lib/types";

// ============================================================
// 第 10 部分　云与虚拟化（云原生主线，归入进阶地图 L3）
// ============================================================

export const PART10: Chapter[] = [
  // ---------------------- 10-1 ----------------------
  {
    id: "10-1",
    part: 10,
    index: "V1",
    title: "虚拟化原理",
    summary: "一台物理机切成多台虚拟机、Hypervisor 两种类型、快照与迁移。",
    tier: 3,
    minutes: 22,
    objectives: ["理解虚拟化为何能提高资源利用率", "分清 Type1/Type2 Hypervisor", "了解快照、克隆、热迁移的价值"],
    blocks: [
      { type: "h2", text: "把一台机器“切”成很多台" },
      { type: "p", text: "一台物理服务器往往很强，但单个应用用不满，闲着浪费。**虚拟化**用一层软件把物理资源（CPU/内存/存储/网络）切分、抽象成多台**虚拟机(VM)**，每台像独立的电脑、跑各自的操作系统，互不干扰。这样一台物理机能跑多套系统，利用率大幅提升——这正是云的底层基础。" },
      { type: "h2", text: "Hypervisor：虚拟化的“管理层”" },
      { type: "p", text: "实现虚拟化的核心软件叫 **Hypervisor（虚拟机监视器）**，分两类：" },
      { type: "table", headers: ["类型", "装在哪", "代表", "场景"], rows: [
        ["Type 1（裸机型）", "直接装在物理硬件上", "VMware ESXi、KVM、Hyper-V、Xen", "数据中心/云，性能好"],
        ["Type 2（宿主型）", "装在已有操作系统之上", "VirtualBox、VMware Workstation", "个人电脑上做实验"],
      ] },
      { type: "knowledge", discipline: "计算机", title: "虚拟化 vs 容器（再对照一次）", body: "虚拟机靠 Hypervisor 虚拟出硬件、各自带一套完整 OS，隔离强但重；容器共享宿主内核、只隔离应用，轻但隔离弱。云上常见的组合是：物理机 → 虚拟机 → 容器（在 VM 里跑 K8s）。两者不是替代，而是不同层次的工具。" },
      { type: "h2", text: "虚拟化带来的“超能力”" },
      { type: "list", items: [
        "**快照(Snapshot)**：给虚拟机某一刻“拍照”，改坏了可秒回到那一刻——做实验神器",
        "**克隆(Clone)**：把一台配好的 VM 复制成多台，批量部署快",
        "**热迁移(Live Migration)**：VM 不停机从一台物理机搬到另一台，便于维护和负载均衡",
        "**资源弹性**：给 VM 动态调整 CPU/内存",
      ] },
      { type: "callout", variant: "key", title: "为什么先学虚拟化", body: "公有云的“云主机”本质就是跑在巨量物理机上的虚拟机；私有云、你的 homelab 也都靠虚拟化。理解它，云就不再神秘。" },
      { type: "callout", variant: "tip", title: "🧪 动手练", body: "在 Mac 用 VirtualBox/UTM、或在联想用 Proxmox，建一台 Linux 虚拟机；装好后拍个快照，故意改坏配置，再恢复快照——亲身体会虚拟化的“后悔药”。" },
    ],
    quiz: [
      { id: "10-1-q1", kind: "single", question: "虚拟化最核心的价值是？", options: ["让电脑变快", "把物理资源切分成多台虚拟机，提高利用率与灵活性", "防病毒", "省电"], answer: [1], explanation: "虚拟化抽象切分物理资源为多台 VM，大幅提升利用率，是云的基础。" },
      { id: "10-1-q2", kind: "single", question: "VMware ESXi、KVM 属于哪类 Hypervisor？", options: ["Type 2 宿主型", "Type 1 裸机型", "容器引擎", "操作系统"], answer: [1], explanation: "ESXi/KVM/Hyper-V 直接装在硬件上，属 Type 1，性能更好，数据中心常用。" },
      { id: "10-1-q3", kind: "single", question: "做实验前想能“随时反悔”，应使用？", options: ["克隆", "快照(Snapshot)", "热迁移", "删除"], answer: [1], explanation: "快照保存某一刻状态，改坏了可秒回，是实验利器。" },
      { id: "10-1-q4", kind: "single", question: "让虚拟机不停机从一台物理机搬到另一台叫？", options: ["快照", "克隆", "热迁移(Live Migration)", "格式化"], answer: [2], explanation: "热迁移在不中断服务的情况下迁移 VM，便于维护与负载均衡。" },
    ],
    flashcards: [
      { id: "10-1-f1", front: "虚拟化是什么", back: "用软件把物理资源切成多台虚拟机，各跑独立OS，提高利用率。", chapterId: "10-1" },
      { id: "10-1-f2", front: "Hypervisor 两类", back: "Type1裸机型(ESXi/KVM,数据中心)、Type2宿主型(VirtualBox,个人实验)。", chapterId: "10-1" },
      { id: "10-1-f3", front: "虚拟化三大能力", back: "快照(秒回)、克隆(批量复制)、热迁移(不停机搬家)。", chapterId: "10-1" },
      { id: "10-1-f4", front: "层次关系", back: "物理机→虚拟机→容器；云主机本质是巨量物理机上的VM。", chapterId: "10-1" },
    ],
  },

  // ---------------------- 10-2 ----------------------
  {
    id: "10-2",
    part: 10,
    index: "V2",
    title: "主流虚拟化技术与实操",
    summary: "KVM / VMware / Hyper-V / Proxmox / VirtualBox，以及在 homelab 上手。",
    tier: 3,
    minutes: 22,
    objectives: ["认识主流虚拟化平台及定位", "知道哪种适合 homelab", "在自己机器上建出第一台虚拟机"],
    blocks: [
      { type: "h2", text: "主流虚拟化平台一览" },
      { type: "table", headers: ["平台", "类型", "定位"], rows: [
        ["KVM", "Type1", "Linux 内核自带，开源，公有云底座(很多云用它)"],
        ["VMware vSphere/ESXi", "Type1", "企业级主流，功能强、生态成熟(商业)"],
        ["Hyper-V", "Type1", "微软生态，Windows Server 自带"],
        ["Proxmox VE", "Type1", "开源、带网页管理，homelab/中小企业很流行"],
        ["VirtualBox", "Type2", "免费跨平台，个人电脑做实验最省事"],
      ] },
      { type: "knowledge", discipline: "计算机", title: "KVM 为什么重要", body: "KVM 内置于 Linux 内核，免费、性能好，是众多公有云和私有云(OpenStack)的虚拟化引擎。学会 Linux + KVM，等于摸到了云的“发动机”。企业里 VMware 仍占很大份额，两者都值得了解。" },
      { type: "h2", text: "在你的 homelab 怎么选" },
      { type: "list", items: [
        "🍎 **Mac(M2/16G)**：用 VirtualBox（Intel镜像）或 **UTM**（更适配 Apple 芯片）建 Linux VM 做练习",
        "💻 **联想(8G/双核)**：内存有限，建议**直接装 Linux + 用 KVM**，或装 **Proxmox** 但只跑 1–2 台小 VM；别指望同时跑很多",
        "想体验“数据中心管 VM”的感觉，Proxmox 的网页控制台最直观",
      ] },
      { type: "callout", variant: "warn", title: "硬件虚拟化要开启", body: "建 VM 前确认 BIOS/UEFI 里开启了硬件虚拟化（Intel VT-x / AMD-V），否则要么建不了、要么极慢。这是新手最常踩的坑。" },
      { type: "callout", variant: "tip", title: "🧪 动手练（验收清单）", body: "目标：建出第一台可用的 Linux VM。步骤：①下载 Ubuntu Server ISO ②新建 VM 分配 2 核/2G/20G ③挂载 ISO 安装 ④装好后能登录、能 ping 通外网、能 ssh 进去。完成 = 你已掌握虚拟化最基础的动手能力。" },
    ],
    quiz: [
      { id: "10-2-q1", kind: "single", question: "下列哪个内置于 Linux 内核、是很多云的虚拟化底座？", options: ["VirtualBox", "KVM", "Hyper-V", "VMware Workstation"], answer: [1], explanation: "KVM 内置 Linux 内核，开源高效，是众多公有/私有云的引擎。" },
      { id: "10-2-q2", kind: "single", question: "个人电脑上做实验最省事的 Type2 平台是？", options: ["ESXi", "KVM", "VirtualBox", "Proxmox"], answer: [2], explanation: "VirtualBox 免费跨平台、装在现有系统上，适合个人做实验。" },
      { id: "10-2-q3", kind: "single", question: "建虚拟机前必须在 BIOS 里开启什么？", options: ["蓝牙", "硬件虚拟化(VT-x/AMD-V)", "节能模式", "声卡"], answer: [1], explanation: "需开启 Intel VT-x / AMD-V 硬件虚拟化，否则无法或极慢地运行 VM。" },
      { id: "10-2-q4", kind: "single", question: "带网页管理、适合 homelab 的开源 Type1 平台是？", options: ["VirtualBox", "Proxmox VE", "Notepad", "Chrome"], answer: [1], explanation: "Proxmox VE 开源、自带网页控制台，homelab 与中小企业常用。" },
    ],
    flashcards: [
      { id: "10-2-f1", front: "主流虚拟化平台", back: "KVM(云底座)、VMware ESXi(企业主流)、Hyper-V(微软)、Proxmox(homelab)、VirtualBox(桌面)。", chapterId: "10-2" },
      { id: "10-2-f2", front: "homelab 怎么选", back: "Mac 用 VirtualBox/UTM；联想内存小→直接 Linux+KVM 或 Proxmox 跑1-2台。", chapterId: "10-2" },
      { id: "10-2-f3", front: "建VM前提", back: "BIOS 开启硬件虚拟化 VT-x/AMD-V，否则建不了或极慢。", chapterId: "10-2" },
    ],
  },

  // ---------------------- 10-3 ----------------------
  {
    id: "10-3",
    part: 10,
    index: "V3",
    title: "云计算是什么",
    summary: "按需弹性的本质、IaaS/PaaS/SaaS、公有/私有/混合云。",
    tier: 3,
    minutes: 22,
    objectives: ["说清云计算的本质特征", "用类比理解 IaaS/PaaS/SaaS", "分清公有/私有/混合云"],
    blocks: [
      { type: "h2", text: "云的本质：像用水电一样用计算" },
      { type: "p", text: "云计算就是把计算、存储、网络等资源做成**按需取用、即开即用、用多少付多少**的服务。你不用自己买服务器、建机房，打开网页点几下，几分钟就有一台服务器在跑——要扩容随时加、不用了随时退。" },
      { type: "list", items: ["**按需自助**：自己点几下就能开通", "**弹性伸缩**：随负载快速增减", "**资源池化**：背后是共享的大资源池", "**计量付费**：按用量计费，像水电表"] },
      { type: "h2", text: "三种服务模型：IaaS / PaaS / SaaS" },
      { type: "table", headers: ["模型", "你拿到什么", "你管什么", "例子"], rows: [
        ["IaaS 基础设施即服务", "虚拟机/网络/存储", "操作系统及以上全归你管", "阿里云 ECS、AWS EC2"],
        ["PaaS 平台即服务", "运行环境/数据库/中间件", "只管你的应用和数据", "云数据库、应用引擎"],
        ["SaaS 软件即服务", "现成的软件", "啥都不用管，直接用", "企业邮箱、在线文档"],
      ] },
      { type: "knowledge", discipline: "计算机", title: "用“住”来类比", body: "IaaS = 租块地自己盖房（给你地基水电，房子自己建）；PaaS = 租精装房（拎包入住，只管自己的家具）；SaaS = 住酒店（什么都备好，直接住）。越往上你操心越少，灵活度也越低。理解“责任边界”是用云的关键。" },
      { type: "h2", text: "三种部署模型" },
      { type: "list", items: [
        "**公有云**：云厂商建好、大家共用（阿里云/华为云/腾讯云/AWS/Azure/GCP），开箱即用、弹性强",
        "**私有云**：企业自建自用（常用 OpenStack/VMware），可控、合规，但要自己运维",
        "**混合云/多云**：公有+私有结合，或同时用多家云，兼顾弹性与可控、避免被单一厂商绑定",
      ] },
      { type: "callout", variant: "key", title: "云 = 别人的(超大)数据中心", body: "公有云本质是云厂商运营的超大规模数据中心，把它的算力按服务卖给你。所以“学数据中心”和“学云”是一枚硬币的两面——你既懂物理底座，又懂上层云服务，会非常吃香。" },
    ],
    quiz: [
      { id: "10-3-q1", kind: "single", question: "下列哪个不是云计算的核心特征？", options: ["按需自助", "弹性伸缩", "计量付费", "必须自购服务器"], answer: [3], explanation: "云的本质正是不必自购服务器，按需取用、用多少付多少。" },
      { id: "10-3-q2", kind: "single", question: "租到一台云主机、自己装系统和软件，属于？", options: ["IaaS", "PaaS", "SaaS", "都不是"], answer: [0], explanation: "拿到虚拟机/网络/存储、自管 OS 及以上，是 IaaS。" },
      { id: "10-3-q3", kind: "single", question: "“拎包入住、只管自己应用和数据”对应？", options: ["IaaS", "PaaS", "SaaS", "私有云"], answer: [1], explanation: "PaaS 提供运行环境，你只管应用与数据，像租精装房。" },
      { id: "10-3-q4", kind: "single", question: "企业自建自用、追求可控合规的云是？", options: ["公有云", "私有云", "SaaS", "CDN"], answer: [1], explanation: "私有云由企业自建自用，可控合规，但需自行运维。" },
    ],
    flashcards: [
      { id: "10-3-f1", front: "云的本质特征", back: "按需自助、弹性伸缩、资源池化、计量付费(像水电)。", chapterId: "10-3" },
      { id: "10-3-f2", front: "IaaS/PaaS/SaaS", back: "租地自盖/租精装房/住酒店；管得越少越省心、越不灵活。", chapterId: "10-3" },
      { id: "10-3-f3", front: "公有/私有/混合云", back: "公有(共用弹性)、私有(自建可控)、混合多云(兼顾+防绑定)。", chapterId: "10-3" },
      { id: "10-3-f4", front: "云与数据中心", back: "公有云=云厂商的超大规模数据中心；懂底座+懂云服务很吃香。", chapterId: "10-3" },
    ],
  },

  // ---------------------- 10-4 ----------------------
  {
    id: "10-4",
    part: 10,
    index: "V4",
    title: "云的核心服务",
    summary: "计算、网络(VPC/安全组)、存储(块/对象)、身份权限(IAM)、计费。",
    tier: 3,
    minutes: 24,
    objectives: ["认识云上最常用的几类服务", "理解 VPC/安全组/对象存储", "建立 IAM 与成本意识"],
    blocks: [
      { type: "h2", text: "云上你最常打交道的几类服务" },
      { type: "h3", text: "① 计算" },
      { type: "list", items: ["**云主机(ECS/EC2)**：一台按需的虚拟机，选规格(几核几G)、选镜像(操作系统)", "弹性伸缩：按负载自动增减云主机数量", "无服务器(Serverless/函数计算)：连机器都不用管，按调用付费"] },
      { type: "h3", text: "② 网络" },
      { type: "list", items: [
        "**VPC（专有网络）**：你在云上的一块隔离的私有网络，自己划子网",
        "**安全组**：云主机的“虚拟防火墙”，控制哪些端口/来源能访问（如只放行 22/80/443）",
        "**公网 IP / 弹性 IP(EIP)**：让云主机能被公网访问",
        "**负载均衡(LB)**：把流量分到多台云主机，提升可用与性能",
      ] },
      { type: "h3", text: "③ 存储" },
      { type: "table", headers: ["类型", "是什么", "用途"], rows: [
        ["块存储(云盘)", "挂给云主机当硬盘", "系统盘/数据库盘"],
        ["对象存储(OSS/S3)", "海量文件按对象存取，有 URL", "图片/视频/备份/静态网站"],
        ["文件存储(NAS)", "可被多台共享挂载的文件系统", "多机共享数据"],
      ] },
      { type: "h3", text: "④ 身份与权限(IAM) + 计费" },
      { type: "list", items: [
        "**IAM**：管理“谁能对哪些资源做什么”，建子账号、按**最小权限**授权，别全用主账号",
        "**计费**：按量付费(灵活)、包年包月(便宜)；务必设**预算告警**，避免忘关资源烧钱",
      ] },
      { type: "knowledge", discipline: "通信", title: "安全组：最常见也最易错", body: "新手部署完发现“网站打不开”，十有八九是安全组没放行端口。安全组按“入方向/出方向 + 端口 + 来源IP”控制访问，遵循最小开放原则（比如管理端口 22 只放行你自己的 IP，对外服务才开 80/443）。" },
      { type: "callout", variant: "warn", title: "成本红线", body: "云是按用量烧钱的。学习时：用免费额度、用完即**释放(删除)** 资源、关掉不用的公网IP和负载均衡、**设预算告警**。很多人的“天价账单”都是忘了关资源。" },
    ],
    quiz: [
      { id: "10-4-q1", kind: "single", question: "云主机的“虚拟防火墙”、控制端口访问的是？", options: ["VPC", "安全组", "对象存储", "IAM"], answer: [1], explanation: "安全组控制云主机的入/出方向端口与来源，是访问控制的关键。" },
      { id: "10-4-q2", kind: "single", question: "存图片/视频/备份、按对象存取且有 URL 的是？", options: ["块存储", "对象存储(OSS/S3)", "内存", "VPC"], answer: [1], explanation: "对象存储适合海量非结构化文件，按对象存取并可通过 URL 访问。" },
      { id: "10-4-q3", kind: "single", question: "授权时应遵循的原则是？", options: ["全部给主账号", "最小权限", "权限越大越好", "不用授权"], answer: [1], explanation: "用 IAM 建子账号并按最小权限授权，降低风险。" },
      { id: "10-4-q4", kind: "single", question: "学习用云、避免天价账单最重要的习惯是？", options: ["多开资源", "用完释放资源 + 设预算告警", "不看账单", "只用主账号"], answer: [1], explanation: "用完即释放、设预算告警，是控制云成本的关键习惯。" },
    ],
    flashcards: [
      { id: "10-4-f1", front: "云四类核心服务", back: "计算(云主机/弹性)、网络(VPC/安全组/EIP/LB)、存储(块/对象/文件)、身份计费(IAM/预算)。", chapterId: "10-4" },
      { id: "10-4-f2", front: "安全组", back: "云主机的虚拟防火墙，按入/出+端口+来源控制；网站打不开常是它没放行。", chapterId: "10-4" },
      { id: "10-4-f3", front: "对象存储", back: "OSS/S3，海量文件按对象存取、带URL，用于图片/视频/备份/静态站。", chapterId: "10-4" },
      { id: "10-4-f4", front: "云成本红线", back: "用免费额度、用完释放、关闲置资源、设预算告警。", chapterId: "10-4" },
    ],
  },

  // ---------------------- 10-5 ----------------------
  {
    id: "10-5",
    part: 10,
    index: "V5",
    title: "上云实操与云认证",
    summary: "用免费额度开一台云主机、配安全组、SSH 部署，以及云认证。",
    tier: 3,
    minutes: 26,
    objectives: ["用免费额度开通并访问一台云主机", "掌握上云部署的标准动作", "了解主流云认证与备考方向"],
    blocks: [
      { type: "h2", text: "免费练云的途径" },
      { type: "list", items: [
        "**Oracle Cloud 永久免费**：额度较大，能跑小服务器甚至小集群",
        "**AWS / Azure / GCP 免费套餐**：新用户一年免费额度",
        "**阿里云 / 华为云 / 腾讯云**：新人试用与学生优惠，中文界面友好",
      ] },
      { type: "h2", text: "上云部署标准动作（以开一台 Linux 云主机为例）" },
      { type: "list", ordered: true, items: [
        "注册并实名，进入控制台，创建一台云主机(ECS)：选地域、规格(1-2核2G)、镜像(Ubuntu)",
        "设置登录方式：推荐**SSH 密钥对**（比密码安全）",
        "配置**安全组**：放行 22(SSH)、80/443(网站)；22 最好只放行你自己的 IP",
        "绑定**公网 IP**，拿到公网地址",
        "本地 `ssh -i 密钥 用户@公网IP` 登录成功",
        "装 nginx：`sudo apt update && sudo apt install -y nginx`，浏览器访问 `http://公网IP` 看到欢迎页",
        "**用完释放**：删除云主机、解绑/释放 EIP，避免计费",
      ] },
      { type: "knowledge", discipline: "英语", title: "云控制台基本都是英文术语", body: "Instance(实例/云主机)、Image(镜像)、Region/Zone(地域/可用区)、VPC、Subnet(子网)、Security Group(安全组)、Key Pair(密钥对)、EIP(弹性IP)、Bucket(对象存储桶)。把这十几个词记熟，看任何一家云的控制台都不慌。" },
      { type: "h2", text: "云认证地图（按主线挑 1 张深耕）" },
      { type: "table", headers: ["认证", "厂商", "定位"], rows: [
        ["HCIA/HCIP-Cloud", "华为云", "国内云岗常见，中文友好"],
        ["阿里云 ACP（云计算）", "阿里云", "国内市场份额大"],
        ["AWS SAA（解决方案架构师）", "AWS", "全球通用，外企/出海首选"],
        ["Azure AZ-104", "微软", "微软生态/外企"],
      ] },
      { type: "callout", variant: "tip", title: "🧪 动手练（验收清单）", body: "用任一免费额度，完成上面的“标准动作”全流程：开机 → 配安全组 → SSH 登录 → 部署 nginx → 浏览器访问成功 → **释放资源**。能独立走完这一遍，你就具备了最基础的上云能力。" },
    ],
    quiz: [
      { id: "10-5-q1", kind: "single", question: "登录云主机更安全的方式是？", options: ["弱密码", "SSH 密钥对", "不设密码", "公开端口"], answer: [1], explanation: "SSH 密钥对比密码更安全，是云主机登录的推荐方式。" },
      { id: "10-5-q2", kind: "single", question: "部署完网站却访问不了，最先检查？", options: ["重装系统", "安全组是否放行 80/443", "换电脑", "升级套餐"], answer: [1], explanation: "对外服务打不开，优先检查安全组是否放行对应端口。" },
      { id: "10-5-q3", kind: "single", question: "学习用云后，避免持续扣费应做？", options: ["关机即可", "释放(删除)云主机并解绑/释放公网IP", "不用管", "改密码"], answer: [1], explanation: "仅关机可能仍计费，应释放资源并解绑/释放 EIP。" },
      { id: "10-5-q4", kind: "single", question: "面向外企/出海、全球通用的云认证是？", options: ["华为云 HCIP", "阿里云 ACP", "AWS SAA", "等保测评"], answer: [2], explanation: "AWS SAA 全球认可度高，适合外企与出海方向。" },
    ],
    flashcards: [
      { id: "10-5-f1", front: "免费练云途径", back: "Oracle 永久免费、AWS/Azure/GCP 免费套餐、阿里/华为/腾讯新人试用。", chapterId: "10-5" },
      { id: "10-5-f2", front: "上云部署标准动作", back: "开云主机→密钥登录→配安全组(22/80/443)→绑EIP→SSH→装服务→访问→释放。", chapterId: "10-5" },
      { id: "10-5-f3", front: "云控制台必懂英文", back: "Instance/Image/Region/VPC/Subnet/Security Group/Key Pair/EIP/Bucket。", chapterId: "10-5" },
      { id: "10-5-f4", front: "主流云认证", back: "华为云HCIP-Cloud、阿里云ACP、AWS SAA、Azure AZ-104；挑1张深耕。", chapterId: "10-5" },
    ],
  },

  // ---------------------- 10-6 ----------------------
  {
    id: "10-6",
    part: 10,
    index: "V6",
    title: "私有云与混合云",
    summary: "OpenStack、私有云 vs 公有云权衡、混合多云与数据中心的关系。",
    tier: 3,
    minutes: 20,
    objectives: ["了解 OpenStack 与私有云组成", "权衡私有云与公有云", "理解混合多云趋势与云-数据中心关系"],
    blocks: [
      { type: "h2", text: "私有云与 OpenStack" },
      { type: "p", text: "**私有云**是企业用自己的数据中心搭建、自用的云平台。开源世界里最有名的是 **OpenStack**——一套用来把一堆物理服务器变成“自家公有云”的软件，由多个组件协作：" },
      { type: "table", headers: ["组件", "管什么"], rows: [
        ["Nova", "计算（虚拟机）"],
        ["Neutron", "网络"],
        ["Cinder", "块存储"],
        ["Swift", "对象存储"],
        ["Keystone", "身份认证"],
        ["Glance", "镜像"],
      ] },
      { type: "knowledge", discipline: "计算机", title: "OpenStack 与 K8s 不是一回事", body: "OpenStack 偏“管虚拟机/基础设施”（IaaS 层，像私有的 AWS）；K8s 偏“管容器/应用编排”。现实中常组合：OpenStack 提供 VM 资源，上面再跑 K8s 管容器。别把两者搞混。" },
      { type: "h2", text: "私有云 vs 公有云：怎么权衡" },
      { type: "table", headers: ["维度", "公有云", "私有云"], rows: [
        ["弹性/速度", "强，即开即用", "受自有资源限制"],
        ["成本", "按需，省去自建；规模大时可能更贵", "前期投入大，长期可控"],
        ["可控/合规", "依赖厂商", "数据自留，合规可控"],
        ["运维", "厂商负责底层", "全靠自己"],
      ] },
      { type: "h2", text: "混合云 / 多云：现实的主流" },
      { type: "list", items: [
        "**混合云**：核心/敏感业务放私有云，弹性/突发业务放公有云",
        "**多云**：同时用多家公有云，避免被单一厂商绑定、提升容灾",
        "趋势：很少有大企业“纯一种”，组合使用是常态",
      ] },
      { type: "callout", variant: "key", title: "回到数据中心这条线", body: "无论公有云、私有云，底层都跑在**数据中心**里——供电、制冷、网络、服务器、虚拟化层层叠加，最上面才是云服务。你这套课程正是从物理底座一路学到云原生顶层，这种“全栈视角”在招聘里很稀缺、很值钱。" },
      { type: "callout", variant: "tip", title: "🧪 进阶可选", body: "想深入私有云，可在 homelab 用 DevStack 体验单机版 OpenStack（吃资源，建议在内存大的机器或云上免费额度试）。入门阶段了解概念即可，不必强求。" },
    ],
    quiz: [
      { id: "10-6-q1", kind: "single", question: "开源私有云平台、把物理服务器变成“自家公有云”的是？", options: ["Kubernetes", "OpenStack", "Docker", "Nginx"], answer: [1], explanation: "OpenStack 是主流开源私有云(IaaS)平台，由 Nova/Neutron 等组件协作。" },
      { id: "10-6-q2", kind: "single", question: "关于 OpenStack 与 K8s，正确的是？", options: ["完全相同", "OpenStack 管基础设施(VM)，K8s 管容器编排，常组合使用", "K8s 是 OpenStack 的旧版", "二者不能共存"], answer: [1], explanation: "OpenStack 偏 IaaS，K8s 偏容器编排，现实常组合(VM上跑K8s)。" },
      { id: "10-6-q3", kind: "single", question: "把敏感业务放私有云、弹性业务放公有云，属于？", options: ["纯公有云", "混合云", "SaaS", "CDN"], answer: [1], explanation: "混合云结合私有云的可控与公有云的弹性。" },
      { id: "10-6-q4", kind: "single", question: "同时使用多家公有云的主要好处是？", options: ["更便宜一定", "避免被单一厂商绑定、提升容灾", "不用运维", "无需网络"], answer: [1], explanation: "多云可降低厂商锁定风险并增强容灾能力。" },
    ],
    flashcards: [
      { id: "10-6-f1", front: "OpenStack 是什么", back: "开源私有云(IaaS)平台；Nova(算)/Neutron(网)/Cinder(块存)/Keystone(认证)等。", chapterId: "10-6" },
      { id: "10-6-f2", front: "OpenStack vs K8s", back: "前者管VM/基础设施，后者管容器编排；常组合：VM上跑K8s。", chapterId: "10-6" },
      { id: "10-6-f3", front: "私有 vs 公有云", back: "公有=弹性快、运维省;私有=可控合规、但自运维投入大。", chapterId: "10-6" },
      { id: "10-6-f4", front: "混合云/多云", back: "敏感放私有+弹性放公有=混合；用多家=多云防绑定+容灾。", chapterId: "10-6" },
    ],
  },
];
