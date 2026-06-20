// ============================================================
// 命令行模拟题：给任务，你敲命令，系统判对错 —— 练命令肌肉记忆
// accept 为可接受答案的正则（字符串形式），canonical 为标准答案
// ============================================================

export interface CliTask {
  id: string;
  category: "Linux" | "Docker" | "Kubernetes";
  prompt: string;
  accept: string[];   // 正则源串（不区分大小写由引擎统一处理为否——命令大小写敏感）
  canonical: string;
  explanation: string;
  hint?: string;
}

export const CLI_TASKS: CliTask[] = [
  // ---------- Linux ----------
  {
    id: "linux-ls",
    category: "Linux",
    prompt: "列出当前目录下的所有文件，包括隐藏文件，并显示详细信息。",
    accept: ["^ls\\s+-la$", "^ls\\s+-al$", "^ls\\s+-l\\s+-a$", "^ls\\s+-a\\s+-l$", "^ll\\s+-a$"],
    canonical: "ls -la",
    explanation: "-l 显示详细信息（权限/大小/时间），-a 显示隐藏文件（以 . 开头）。",
    hint: "ls 加两个参数",
  },
  {
    id: "linux-pwd",
    category: "Linux",
    prompt: "查看当前所在的目录的完整路径。",
    accept: ["^pwd$"],
    canonical: "pwd",
    explanation: "pwd = print working directory，打印当前工作目录。",
  },
  {
    id: "linux-df",
    category: "Linux",
    prompt: "以人类易读的单位（GB/MB）查看磁盘空间使用情况。",
    accept: ["^df\\s+-h$", "^df\\s+-h\\s+.*"],
    canonical: "df -h",
    explanation: "df 看磁盘使用，-h 让容量以 G/M 显示。排查“磁盘写满”第一条命令。",
    hint: "df 加一个表示 human-readable 的参数",
  },
  {
    id: "linux-tail",
    category: "Linux",
    prompt: "实时滚动查看日志文件 /var/log/syslog 的最新内容。",
    accept: ["^tail\\s+-f\\s+/var/log/syslog$", "^tail\\s+-f\\s+\\S+$"],
    canonical: "tail -f /var/log/syslog",
    explanation: "tail 看文件末尾，-f 持续跟随输出，排查实时日志必备。",
    hint: "tail 加 -f 再加文件路径",
  },
  {
    id: "linux-systemctl",
    category: "Linux",
    prompt: "查看名为 nginx 的服务（systemd）当前运行状态。",
    accept: ["^systemctl\\s+status\\s+nginx$", "^systemctl\\s+status\\s+nginx\\.service$"],
    canonical: "systemctl status nginx",
    explanation: "systemctl 管理 systemd 服务，status 查看是否在运行、最近日志。",
  },
  {
    id: "linux-grep",
    category: "Linux",
    prompt: "在文件 app.log 中查找所有包含 error 的行（忽略大小写）。",
    accept: ["^grep\\s+-i\\s+error\\s+app\\.log$", "^grep\\s+-i\\s+['\"]?error['\"]?\\s+app\\.log$"],
    canonical: "grep -i error app.log",
    explanation: "grep 按关键词过滤，-i 忽略大小写。定位报错的利器。",
    hint: "grep 加 -i（忽略大小写）",
  },
  // ---------- Docker ----------
  {
    id: "docker-ps",
    category: "Docker",
    prompt: "列出当前正在运行的所有容器。",
    accept: ["^docker\\s+ps$"],
    canonical: "docker ps",
    explanation: "docker ps 列出运行中的容器；加 -a 可列出包括已停止的全部容器。",
  },
  {
    id: "docker-logs",
    category: "Docker",
    prompt: "查看名为 web 的容器的日志输出。",
    accept: ["^docker\\s+logs\\s+web$", "^docker\\s+logs\\s+-f\\s+web$"],
    canonical: "docker logs web",
    explanation: "docker logs <容器名/ID> 查看容器标准输出，排查容器为何异常。",
  },
  {
    id: "docker-exec",
    category: "Docker",
    prompt: "进入正在运行的容器 web 的 bash 终端（交互式）。",
    accept: ["^docker\\s+exec\\s+-it\\s+web\\s+(bash|sh|/bin/bash|/bin/sh)$"],
    canonical: "docker exec -it web bash",
    explanation: "exec -it 以交互终端进入容器，-i 保持输入、-t 分配终端。",
    hint: "docker exec -it 容器名 bash",
  },
  // ---------- Kubernetes ----------
  {
    id: "k8s-get-pods",
    category: "Kubernetes",
    prompt: "查看 default 命名空间下的所有 Pod。",
    accept: ["^kubectl\\s+get\\s+pods?$", "^kubectl\\s+get\\s+pods?\\s+-n\\s+default$", "^k\\s+get\\s+pods?$"],
    canonical: "kubectl get pods",
    explanation: "kubectl get pods 列出当前命名空间的 Pod；不写 -n 默认 default。",
  },
  {
    id: "k8s-get-all-ns",
    category: "Kubernetes",
    prompt: "查看所有命名空间下的全部 Pod。",
    accept: ["^kubectl\\s+get\\s+pods?\\s+(-A|--all-namespaces)$", "^k\\s+get\\s+pods?\\s+-A$"],
    canonical: "kubectl get pods -A",
    explanation: "-A（等价 --all-namespaces）跨所有命名空间查看，排障常用。",
    hint: "在 get pods 后加一个表示“所有命名空间”的参数",
  },
  {
    id: "k8s-logs",
    category: "Kubernetes",
    prompt: "查看名为 web-0 的 Pod 的日志。",
    accept: ["^kubectl\\s+logs\\s+web-0$", "^kubectl\\s+logs\\s+-f\\s+web-0$", "^k\\s+logs\\s+web-0$"],
    canonical: "kubectl logs web-0",
    explanation: "kubectl logs <pod> 看容器日志，是 Pod 崩溃排查第一步。",
  },
  {
    id: "k8s-describe-node",
    category: "Kubernetes",
    prompt: "排查节点问题：查看名为 node1 的节点的详细信息与事件。",
    accept: ["^kubectl\\s+describe\\s+node\\s+node1$", "^k\\s+describe\\s+node\\s+node1$"],
    canonical: "kubectl describe node node1",
    explanation: "describe 展示对象的详情与 Events，定位 NotReady/资源不足等问题。",
    hint: "kubectl describe node 节点名",
  },
  {
    id: "k8s-exec",
    category: "Kubernetes",
    prompt: "进入 Pod web-0 的 shell 终端（交互式，用 sh）。",
    accept: ["^kubectl\\s+exec\\s+-it\\s+web-0\\s+--\\s+(sh|bash|/bin/sh|/bin/bash)$"],
    canonical: "kubectl exec -it web-0 -- sh",
    explanation: "kubectl exec -it <pod> -- sh 进入容器排查；注意 K8s 里命令前要加 --。",
    hint: "注意 kubectl exec 里要有 -- 分隔",
  },
];

export const CLI_CATEGORIES = ["Linux", "Docker", "Kubernetes"] as const;
