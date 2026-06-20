// ============================================================
// 故障排查情景模拟器：给真实告警场景，你一步步决策，系统按规范反馈
// 每步有一个“正确选项”推动剧情(next)，错误选项给出原因并让你重选(记一次失误)
// terminal 步骤为结局，含复盘 summary
// ============================================================

export interface Choice {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface ScenarioStep {
  id: string;
  situation: string;
  choices?: Choice[];
  next?: string;       // 选对后前往的步骤
  terminal?: boolean;
  summary?: string;    // 结局复盘
}

export interface Scenario {
  id: string;
  title: string;
  domain: "Kubernetes" | "Linux" | "网络" | "设施";
  difficulty: "入门" | "进阶";
  brief: string;
  steps: ScenarioStep[]; // 第一个为起点
}

export const SCENARIOS: Scenario[] = [
  {
    id: "k8s-crashloop",
    title: "网站 502：一个 Pod 反复重启",
    domain: "Kubernetes",
    difficulty: "进阶",
    brief: "凌晨值班，监控告警：线上网站返回 502。你登录集群，`kubectl get pods` 显示 web-0 状态为 CrashLoopBackOff（反复崩溃重启）。",
    steps: [
      {
        id: "start",
        situation: "面对一个 CrashLoopBackOff 的 Pod，你的第一步是？",
        next: "logs",
        choices: [
          { text: "删除这个 Pod 让它自动重建", correct: false, feedback: "❌ 治标不治本。崩溃有根因，重建后大概率还会崩，且你丢失了现场。" },
          { text: "查看该 Pod 的日志找崩溃原因", correct: true, feedback: "✅ 正确。排障第一性原则：先观察、看日志，再动手。" },
          { text: "重启整个集群", correct: false, feedback: "❌ 严重过度操作，影响所有业务，绝不能作为首选。" },
        ],
      },
      {
        id: "logs",
        situation: "`kubectl logs web-0` 显示：`Error: cannot connect to database at db:5432`。应用因连不上数据库而崩溃。下一步？",
        next: "dbcheck",
        choices: [
          { text: "把 web 的副本数从 1 扩到 5", correct: false, feedback: "❌ 连不上数据库，加副本只会得到更多崩溃的 Pod。" },
          { text: "检查 db 这个依赖：看 Service 与 db Pod 状态", correct: true, feedback: "✅ 对。顺着“依赖”往下查，是排障的正路。" },
          { text: "修改 web 代码忽略数据库错误", correct: false, feedback: "❌ 掩盖问题，不是修复，半夜也不该乱改线上代码。" },
        ],
      },
      {
        id: "dbcheck",
        situation: "`kubectl get pods` 看到 db-0 状态是 Pending（调度不上去）。`kubectl describe pod db-0` 的 Events 提示：Insufficient memory。根因最可能是？",
        next: "win",
        choices: [
          { text: "节点内存不足，db Pod 无法被调度，导致 web 连不上库", correct: true, feedback: "✅ 找到根因了！资源不足 → db 起不来 → web 崩。" },
          { text: "是 web 的 bug，与 db 无关", correct: false, feedback: "❌ 日志和现象都指向数据库依赖，证据不支持这个结论。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 故障定位完成。",
        summary: "你用「看日志 → 查依赖 → 定根因」的链路，定位到根因：节点内存不足导致数据库 Pod 无法调度，连锁让 web 崩溃。规范处置：扩容/释放节点资源或给 db 调整调度，让 db 正常起来。\n\n带走的方法论：自顶向下、先观察再动手、顺着依赖链查、用证据下结论。",
      },
    ],
  },
  {
    id: "linux-diskfull",
    title: "服务器磁盘写满，服务异常",
    domain: "Linux",
    difficulty: "入门",
    brief: "一台 Linux 服务器上的应用频繁报错，疑似写文件失败。你 SSH 登录上去开始排查。",
    steps: [
      {
        id: "start",
        situation: "怀疑磁盘满了，先用哪条命令确认？",
        next: "found",
        choices: [
          { text: "df -h 查看各分区磁盘使用率", correct: true, feedback: "✅ 对，df -h 一眼看出哪个分区满了。" },
          { text: "top 查看 CPU", correct: false, feedback: "❌ CPU 不是当前怀疑点，方向偏了。" },
          { text: "直接 reboot 重启", correct: false, feedback: "❌ 盲目重启，问题还在，还可能让服务长时间中断。" },
        ],
      },
      {
        id: "found",
        situation: "df -h 显示 / 分区已用 100%。接下来要定位是谁占了空间，怎么做？",
        next: "logbig",
        choices: [
          { text: "用 du 排查大目录，如 du -sh /var/* 逐层下钻", correct: true, feedback: "✅ 正确，du 逐层找出占用大户。" },
          { text: "把所有文件都删掉", correct: false, feedback: "❌ 极度危险，可能删掉系统/数据文件造成更大事故。" },
        ],
      },
      {
        id: "logbig",
        situation: "定位到 /var/log 下一个日志文件占了 40G（程序疯狂打日志）。最稳妥的处理是？",
        next: "win",
        choices: [
          { text: "先确认可清理后清空/转储该日志并配置日志轮转(logrotate)，再排查程序为何狂打日志", correct: true, feedback: "✅ 既解燃眉之急，又治本（轮转 + 查根因）。" },
          { text: "rm -rf /var 整个删掉", correct: false, feedback: "❌ 灾难操作，会破坏系统。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 磁盘空间恢复，服务正常。",
        summary: "排障链路：df 定位满的分区 → du 找占用大户 → 安全清理 + 配置日志轮转 + 追根因。\n\n关键意识：先确认再动手、清理前判断文件能否删、解决“为什么会满”而不只是清一次。",
      },
    ],
  },
  {
    id: "facility-hotspot",
    title: "机房某机柜温度告警",
    domain: "设施",
    difficulty: "入门",
    brief: "动环监控告警：某机柜进风口温度升至 35°C（远超建议的 18–27°C）。你在值班室收到通知。",
    steps: [
      {
        id: "start",
        situation: "面对单个机柜温度告警，第一步最合理的是？",
        next: "check",
        choices: [
          { text: "立刻去现场核实，并查看该区域空调与气流状况", correct: true, feedback: "✅ 对，先到现场确认告警真实性并观察制冷与气流。" },
          { text: "直接把整个机房空调温度调到最低", correct: false, feedback: "❌ 一刀切既浪费能耗，也未必解决局部热点，且可能引发别处问题。" },
          { text: "忽略，等它自己恢复", correct: false, feedback: "❌ 高温会损伤设备甚至宕机，温度告警必须及时处理。" },
        ],
      },
      {
        id: "check",
        situation: "到现场发现：该机柜冷热通道封闭的盲板缺失，冷空气大量短路、没进到设备。最可能的直接原因是？",
        next: "win",
        choices: [
          { text: "气流管理问题：缺盲板导致冷热气流混合，制冷没送达设备", correct: true, feedback: "✅ 正确。盲板缺失是典型的气流短路问题。" },
          { text: "一定是空调坏了", correct: false, feedback: "❌ 证据指向气流管理，不能直接断定设备故障，要按证据来。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 热点定位完成。",
        summary: "处置：补齐盲板、规范冷热通道封闭，恢复气流后温度回落；同时检查该列制冷余量。\n\n带走的认知：机房高温不一定是“空调不够冷”，更多是“冷量没送对地方”——气流管理(盲板/封闭/架空地板开孔)往往是关键。安全第一，按证据判断。",
      },
    ],
  },

  {
    id: "k8s-svc-unreachable",
    title: "Pod 都正常，Service 却访问不通",
    domain: "Kubernetes",
    difficulty: "进阶",
    brief: "前端报错连不上后端。`kubectl get pods` 显示后端 3 个 Pod 全是 Running，但通过 Service 访问超时。",
    steps: [
      {
        id: "start",
        situation: "Pod 都 Running，但 Service 访问不通。第一步查什么？",
        next: "endpoints",
        choices: [
          { text: "kubectl get endpoints 看 Service 后面有没有挂上 Pod", correct: true, feedback: "✅ 对。Endpoints 为空往往就是 selector 没匹配上 Pod。" },
          { text: "直接重启所有 Pod", correct: false, feedback: "❌ Pod 本来就正常，重启无济于事，先看 Service 与 Pod 的关联。" },
          { text: "重装 CNI 网络插件", correct: false, feedback: "❌ 还没定位就动网络底座，过度操作，先收集证据。" },
        ],
      },
      {
        id: "endpoints",
        situation: "`kubectl get endpoints backend` 显示 ENDPOINTS 为 <none>（没有任何后端）。下一步？",
        next: "label",
        choices: [
          { text: "对比 Service 的 selector 与 Pod 的 labels 是否一致", correct: true, feedback: "✅ 正确。Endpoints 为空，几乎必然是标签选择器对不上。" },
          { text: "加大 Service 的端口范围", correct: false, feedback: "❌ 与端口无关，问题在选择器匹配。" },
        ],
      },
      {
        id: "label",
        situation: "发现 Service 的 selector 是 app=backend，但 Pod 的 label 是 app=back-end（多了个连字符）。结论与处置？",
        next: "win",
        choices: [
          { text: "标签不匹配导致 Service 选不到 Pod；统一标签(改 Deployment 模板或 Service selector)", correct: true, feedback: "✅ 找到根因了，统一两边标签即可恢复。" },
          { text: "是 DNS 问题，改 CoreDNS", correct: false, feedback: "❌ 证据指向标签不匹配，不是 DNS。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 服务恢复。",
        summary: "排障链路：Service 不通 → 看 Endpoints(为空) → 比对 selector 与 Pod label → 发现标签不一致。\n\n带走的认知：K8s 里 Service 靠 label/selector 关联 Pod，“Endpoints 为空”是标签不匹配的强信号。先看 Endpoints，能少走很多弯路。",
      },
    ],
  },

  {
    id: "k8s-node-notready",
    title: "一个节点变成 NotReady",
    domain: "Kubernetes",
    difficulty: "进阶",
    brief: "监控告警：节点 node2 状态 NotReady，上面的 Pod 开始被驱逐。",
    steps: [
      {
        id: "start",
        situation: "节点 NotReady，先做什么？",
        next: "describe",
        choices: [
          { text: "kubectl describe node node2 看 Conditions 与 Events", correct: true, feedback: "✅ 对，先看节点状况(磁盘/内存/网络/kubelet)。" },
          { text: "立刻 drain 并删除该节点", correct: false, feedback: "❌ 还没定位就删节点太激进，先查原因。" },
        ],
      },
      {
        id: "describe",
        situation: "Conditions 显示 DiskPressure=True，且 kubelet 最近有重启。登录节点后该查？",
        next: "win",
        choices: [
          { text: "df -h 看磁盘是否写满，并检查 kubelet 服务状态/日志", correct: true, feedback: "✅ 正确，DiskPressure 多半是磁盘满导致 kubelet 异常。" },
          { text: "重装操作系统", correct: false, feedback: "❌ 灾难级操作，先按证据清理磁盘。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 节点恢复 Ready。",
        summary: "排障链路：节点 NotReady → describe node 看 Conditions(DiskPressure) → 上节点 df -h + 查 kubelet → 清理磁盘/重启 kubelet。\n\n带走的认知：节点问题先看 describe 的 Conditions 和 Events；DiskPressure/MemoryPressure 等直接点明方向。",
      },
    ],
  },

  {
    id: "linux-service-down",
    title: "nginx 服务起不来",
    domain: "Linux",
    difficulty: "入门",
    brief: "部署后 `systemctl start nginx` 失败，网站打不开。",
    steps: [
      {
        id: "start",
        situation: "服务启动失败，第一步？",
        next: "test",
        choices: [
          { text: "systemctl status nginx + journalctl -u nginx 看具体报错", correct: true, feedback: "✅ 对，先看状态和日志拿到确切错误。" },
          { text: "重启服务器", correct: false, feedback: "❌ 盲目重启掩盖问题，先看日志。" },
          { text: "把 nginx 卸载重装", correct: false, feedback: "❌ 八成是配置或端口问题，重装多半白费。" },
        ],
      },
      {
        id: "test",
        situation: "日志提示 “bind() to 0.0.0.0:80 failed (98: Address already in use)”。下一步？",
        next: "win",
        choices: [
          { text: "用 ss -tlnp 找出谁占用了 80 端口，再决定停它或换端口", correct: true, feedback: "✅ 正确，端口被占就先定位占用进程。" },
          { text: "把 nginx 配置里的 error_log 关掉", correct: false, feedback: "❌ 关日志只会让你更看不见问题。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ nginx 正常启动。",
        summary: "排障链路：服务起不来 → status/journalctl 看报错 → “端口被占用” → ss -tlnp 定位占用进程 → 停掉冲突进程或改端口。\n\n带走的认知：服务启动失败，答案几乎都在 journalctl 里；常见根因是端口冲突或配置语法错(可用 nginx -t 验证配置)。",
      },
    ],
  },

  {
    id: "net-intermittent",
    title: "网站时通时断、偶发超时",
    domain: "网络",
    difficulty: "进阶",
    brief: "用户反馈网站“有时打得开、有时超时”。服务端 CPU/内存都正常。",
    steps: [
      {
        id: "start",
        situation: "时通时断，先判断是应用问题还是网络问题，怎么做？",
        next: "ping",
        choices: [
          { text: "持续 ping 目标看丢包/延迟，并结合监控分层定位", correct: true, feedback: "✅ 对，先用 ping/监控判断是网络层还是应用层。" },
          { text: "直接改应用代码加重试", correct: false, feedback: "❌ 还没定位就改代码，可能掩盖真正的网络问题。" },
        ],
      },
      {
        id: "ping",
        situation: "持续 ping 显示间歇性高延迟和丢包；traceroute 发现卡在某一跳。下一步？",
        next: "win",
        choices: [
          { text: "定位到该跳对应的链路/设备，检查端口错包、光功率或该链路负载", correct: true, feedback: "✅ 正确，顺着丢包的那一跳查物理链路与端口状态。" },
          { text: "把所有交换机重启一遍", correct: false, feedback: "❌ 大面积重启影响业务，应精准定位到问题链路。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 找到抖动链路。",
        summary: "排障链路：时通时断 → ping 看丢包/延迟(分清网络/应用) → traceroute 定位到具体一跳 → 查该链路端口错包/光功率/负载。\n\n带走的认知：间歇性问题靠“持续观测 + 分层定位”，别凭感觉改代码或大面积重启。",
      },
    ],
  },

  {
    id: "facility-power-outage",
    title: "市电中断，机房靠什么撑住",
    domain: "设施",
    difficulty: "入门",
    brief: "动环告警：市电失电。机房还在运行，你需要确认应急供电链路是否正常接力。",
    steps: [
      {
        id: "start",
        situation: "市电中断的第一时间，最该确认什么？",
        next: "gen",
        choices: [
          { text: "确认 UPS 是否已无缝切换、IT 负载是否仍正常供电", correct: true, feedback: "✅ 对。UPS 的作用就是市电中断瞬间无缝顶上，先确认它在带载。" },
          { text: "立刻手动拉闸断电检修", correct: false, feedback: "❌ 机房还在运行，盲目断电会直接造成宕机。" },
          { text: "什么都不做，等市电自己回来", correct: false, feedback: "❌ 电池只能撑几分钟，必须确认柴发接力，不能干等。" },
        ],
      },
      {
        id: "gen",
        situation: "UPS 正在放电、电池可撑约 10 分钟。要让供电持续，靠什么接力？该确认什么？",
        next: "win",
        choices: [
          { text: "确认柴油发电机自动启动、ATS 完成切换，并监控油量/水温/频率", correct: true, feedback: "✅ 正确。柴发是长时供电来源，UPS 只是过渡到柴发的桥梁。" },
          { text: "再加几组 UPS 电池就行", correct: false, feedback: "❌ 电池只解决分钟级过渡，长时断电必须靠柴发。" },
        ],
      },
      {
        id: "win",
        terminal: true,
        situation: "✅ 柴发接力成功，供电稳定。",
        summary: "供电链路：市电失电 → UPS 无缝切换(撑分钟级) → 柴油发电机自动启动 + ATS 切换(长时供电)。处置：确认各级切换正常并监控柴发运行参数。\n\n带走的认知：数据中心“不断电”靠的是 市电→UPS→柴发 三级接力；UPS 争取的是启动柴发的时间，缺一不可。",
      },
    ],
  },
];

export function scenarioById(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
