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
  domain: "Kubernetes" | "Linux" | "设施";
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
];

export function scenarioById(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
