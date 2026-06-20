// ============================================================
// 命令行模拟题：给任务，你敲命令，系统判对错 —— 练命令肌肉记忆
// accept 为可接受答案的正则（字符串形式），canonical 为标准答案
// ============================================================

export interface CliTask {
  id: string;
  category: "Linux" | "网络" | "Docker" | "Kubernetes";
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

  // ---------- Linux（扩充）----------
  { id: "linux-cd-home", category: "Linux", prompt: "快速回到当前用户的家目录。", accept: ["^cd$", "^cd\\s+~$", "^cd\\s+\\$HOME$"], canonical: "cd ~", explanation: "cd 不带参数或 cd ~ 都回到家目录。" },
  { id: "linux-mkdir-p", category: "Linux", prompt: "一次性创建多级目录 a/b/c（父目录不存在也自动建）。", accept: ["^mkdir\\s+-p\\s+a/b/c$", "^mkdir\\s+-p\\s+\\S+"], canonical: "mkdir -p a/b/c", explanation: "-p 自动创建所有缺失的父目录。", hint: "mkdir 加一个参数" },
  { id: "linux-rm-dir", category: "Linux", prompt: "删除目录 logs 及其全部内容。", accept: ["^rm\\s+-r\\s+logs$", "^rm\\s+-rf\\s+logs$", "^rm\\s+-fr\\s+logs$"], canonical: "rm -r logs", explanation: "-r 递归删除目录；rm 不可恢复，谨慎使用。" },
  { id: "linux-cat", category: "Linux", prompt: "查看文件 app.conf 的全部内容。", accept: ["^cat\\s+app\\.conf$"], canonical: "cat app.conf", explanation: "cat 输出整个文件；大文件用 less 分页。" },
  { id: "linux-chown", category: "Linux", prompt: "把文件 data.log 的属主改为 alice。", accept: ["^chown\\s+alice\\s+data\\.log$", "^chown\\s+alice:[a-z]*\\s+data\\.log$"], canonical: "chown alice data.log", explanation: "chown 用户 文件；改属主属组用 用户:组。", hint: "chown 用户 文件" },
  { id: "linux-pgrep", category: "Linux", prompt: "找出名字包含 nginx 的进程。", accept: ["^pgrep\\s+nginx$", "^ps\\s+-ef\\s*\\|\\s*grep\\s+nginx$", "^ps\\s+aux\\s*\\|\\s*grep\\s+nginx$"], canonical: "pgrep nginx", explanation: "pgrep 按名找进程；也可 ps -ef | grep nginx。" },
  { id: "linux-free", category: "Linux", prompt: "以人类可读单位查看内存使用情况。", accept: ["^free\\s+-h$"], canonical: "free -h", explanation: "free -h 显示内存/交换使用，-h 用 G/M。" },
  { id: "linux-uptime", category: "Linux", prompt: "查看系统已运行多久以及平均负载。", accept: ["^uptime$"], canonical: "uptime", explanation: "uptime 显示运行时长与 1/5/15 分钟负载。" },
  { id: "linux-which", category: "Linux", prompt: "查看 python3 可执行文件的路径。", accept: ["^which\\s+python3$", "^type\\s+python3$", "^command\\s+-v\\s+python3$"], canonical: "which python3", explanation: "which 查命令所在路径。" },
  { id: "linux-grep-r", category: "Linux", prompt: "在当前目录递归搜索包含 TODO 的文件。", accept: ["^grep\\s+-r\\s+TODO\\s+\\.$", "^grep\\s+-rn\\s+TODO\\s+\\.$", "^grep\\s+-nr\\s+TODO\\s+\\.$"], canonical: "grep -r TODO .", explanation: "-r 递归搜索目录；加 -n 显示行号。", hint: "grep -r 关键词 路径" },
  { id: "linux-tar-list", category: "Linux", prompt: "不解压，列出 backup.tar.gz 里的内容。", accept: ["^tar\\s+-tzf\\s+backup\\.tar\\.gz$", "^tar\\s+tzf\\s+backup\\.tar\\.gz$"], canonical: "tar -tzf backup.tar.gz", explanation: "-t 列出内容，-z gzip，-f 文件。" },
  { id: "linux-scp", category: "Linux", prompt: "把本地 a.txt 拷到远程主机 ops@10.0.0.5 的 /tmp 目录。", accept: ["^scp\\s+a\\.txt\\s+ops@10\\.0\\.0\\.5:/tmp/?$"], canonical: "scp a.txt ops@10.0.0.5:/tmp", explanation: "scp 本地路径 用户@主机:远程路径。", hint: "scp 文件 用户@IP:路径" },

  // ---------- 网络 ----------
  { id: "net-ip", category: "网络", prompt: "查看本机网卡 IP 地址（现代命令）。", accept: ["^ip\\s+a$", "^ip\\s+addr$", "^ip\\s+addr\\s+show$", "^ip\\s+a\\s+s$"], canonical: "ip a", explanation: "ip a（ip addr）查看网卡与 IP；ifconfig 已过时。" },
  { id: "net-ping", category: "网络", prompt: "测试到 8.8.8.8 的连通性。", accept: ["^ping\\s+8\\.8\\.8\\.8$", "^ping\\s+-c\\s+\\d+\\s+8\\.8\\.8\\.8$"], canonical: "ping 8.8.8.8", explanation: "ping 测连通与延迟；-c 指定次数。" },
  { id: "net-route", category: "网络", prompt: "查看本机路由表。", accept: ["^ip\\s+route$", "^ip\\s+r$", "^route\\s+-n$"], canonical: "ip route", explanation: "ip route 看路由表，含默认网关。" },
  { id: "net-dns", category: "网络", prompt: "查询 example.com 的 DNS 解析结果。", accept: ["^dig\\s+example\\.com.*", "^nslookup\\s+example\\.com$", "^host\\s+example\\.com$"], canonical: "dig example.com", explanation: "dig/nslookup/host 都能查 DNS 解析。", hint: "dig 或 nslookup" },
  { id: "net-listen", category: "网络", prompt: "查看本机所有正在监听的端口及对应进程。", accept: ["^ss\\s+-tlnp$", "^ss\\s+-lntp$", "^ss\\s+-tulnp$", "^netstat\\s+-tlnp$"], canonical: "ss -tlnp", explanation: "ss -tlnp 列 TCP 监听端口+进程(替代 netstat)。" },
  { id: "net-curl-head", category: "网络", prompt: "只查看 http://localhost 的 HTTP 响应头。", accept: ["^curl\\s+-I\\s+(http://)?localhost/?$"], canonical: "curl -I http://localhost", explanation: "curl -I 只取响应头，排查状态码很方便。", hint: "curl 加 -I" },
  { id: "net-nc", category: "网络", prompt: "测试到 10.0.0.5 的 80 端口是否可达（用 nc）。", accept: ["^nc\\s+-zv?\\s+10\\.0\\.0\\.5\\s+80$", "^nc\\s+-vz\\s+10\\.0\\.0\\.5\\s+80$", "^telnet\\s+10\\.0\\.0\\.5\\s+80$"], canonical: "nc -zv 10.0.0.5 80", explanation: "nc -zv 主机 端口 探测端口连通；-z 不发数据 -v 详细。", hint: "nc -zv 主机 端口" },
  { id: "net-traceroute", category: "网络", prompt: "跟踪到 8.8.8.8 经过的路由路径。", accept: ["^traceroute\\s+8\\.8\\.8\\.8$", "^tracepath\\s+8\\.8\\.8\\.8$", "^mtr\\s+8\\.8\\.8\\.8$"], canonical: "traceroute 8.8.8.8", explanation: "traceroute 显示到目标每一跳，定位在哪段不通。" },

  // ---------- Docker（扩充）----------
  { id: "docker-images", category: "Docker", prompt: "列出本地所有镜像。", accept: ["^docker\\s+images$", "^docker\\s+image\\s+ls$"], canonical: "docker images", explanation: "docker images 列本地镜像。" },
  { id: "docker-pull", category: "Docker", prompt: "从仓库拉取 nginx 镜像。", accept: ["^docker\\s+pull\\s+nginx$"], canonical: "docker pull nginx", explanation: "docker pull 拉取镜像到本地。" },
  { id: "docker-build", category: "Docker", prompt: "用当前目录的 Dockerfile 构建镜像 myapp:1.0。", accept: ["^docker\\s+build\\s+-t\\s+myapp:1\\.0\\s+\\.$"], canonical: "docker build -t myapp:1.0 .", explanation: "-t 命名:标签，结尾的 . 是构建上下文(当前目录)。", hint: "别忘了结尾的 ." },
  { id: "docker-run-d", category: "Docker", prompt: "后台运行一个 redis 容器。", accept: ["^docker\\s+run\\s+-d\\s+redis$", "^docker\\s+run\\s+-d\\s+--name\\s+\\S+\\s+redis$"], canonical: "docker run -d redis", explanation: "-d 后台运行；可加 --name 命名。" },
  { id: "docker-stop", category: "Docker", prompt: "停止名为 web 的容器。", accept: ["^docker\\s+stop\\s+web$"], canonical: "docker stop web", explanation: "docker stop 优雅停止容器。" },
  { id: "docker-rm", category: "Docker", prompt: "删除名为 web 的容器。", accept: ["^docker\\s+rm\\s+web$", "^docker\\s+rm\\s+-f\\s+web$"], canonical: "docker rm web", explanation: "docker rm 删除容器；-f 可强制删运行中的。" },

  // ---------- Kubernetes（扩充）----------
  { id: "k8s-get-svc", category: "Kubernetes", prompt: "查看 default 命名空间下所有 Service。", accept: ["^kubectl\\s+get\\s+(svc|services)$", "^k\\s+get\\s+svc$"], canonical: "kubectl get svc", explanation: "svc 是 services 的简写。" },
  { id: "k8s-get-deploy", category: "Kubernetes", prompt: "查看所有 Deployment。", accept: ["^kubectl\\s+get\\s+(deploy|deployments)$", "^k\\s+get\\s+deploy$"], canonical: "kubectl get deploy", explanation: "deploy 是 deployments 简写。" },
  { id: "k8s-get-nodes", category: "Kubernetes", prompt: "查看集群所有节点及状态。", accept: ["^kubectl\\s+get\\s+nodes$", "^k\\s+get\\s+nodes$"], canonical: "kubectl get nodes", explanation: "排查节点 NotReady 的第一步。" },
  { id: "k8s-describe-pod", category: "Kubernetes", prompt: "查看 Pod web-0 的详情与 Events。", accept: ["^kubectl\\s+describe\\s+pod\\s+web-0$"], canonical: "kubectl describe pod web-0", explanation: "describe 底部 Events 常含 Pending/拉镜像失败原因。" },
  { id: "k8s-scale", category: "Kubernetes", prompt: "把 Deployment web 扩到 3 个副本。", accept: ["^kubectl\\s+scale\\s+deploy(ment)?\\s+web\\s+--replicas=3$"], canonical: "kubectl scale deployment web --replicas=3", explanation: "scale --replicas=N 扩缩容。", hint: "kubectl scale deployment 名 --replicas=N" },
  { id: "k8s-create-deploy", category: "Kubernetes", prompt: "用 nginx 镜像创建一个名为 web 的 Deployment。", accept: ["^kubectl\\s+create\\s+deployment\\s+web\\s+--image=nginx$"], canonical: "kubectl create deployment web --image=nginx", explanation: "命令式快速创建 Deployment。" },
  { id: "k8s-expose", category: "Kubernetes", prompt: "把 Deployment web 以 NodePort 暴露 80 端口。", accept: ["^kubectl\\s+expose\\s+deploy(ment)?\\s+web\\s+--port=80\\s+--type=NodePort$"], canonical: "kubectl expose deployment web --port=80 --type=NodePort", explanation: "expose 创建 Service；NodePort 对外暴露。" },
  { id: "k8s-apply", category: "Kubernetes", prompt: "按 deploy.yaml 声明式创建/更新对象。", accept: ["^kubectl\\s+apply\\s+-f\\s+deploy\\.yaml$"], canonical: "kubectl apply -f deploy.yaml", explanation: "apply -f 是声明式部署的核心命令。" },
  { id: "k8s-delete-pod", category: "Kubernetes", prompt: "删除 Pod web-0（观察 Deployment 自愈补回）。", accept: ["^kubectl\\s+delete\\s+pod\\s+web-0$"], canonical: "kubectl delete pod web-0", explanation: "删 Pod 后由 Deployment 自动重建，体会自愈。" },
  { id: "k8s-get-ns", category: "Kubernetes", prompt: "查看集群所有命名空间。", accept: ["^kubectl\\s+get\\s+(ns|namespaces)$"], canonical: "kubectl get ns", explanation: "ns 是 namespaces 简写。" },
  { id: "k8s-current-context", category: "Kubernetes", prompt: "查看 kubectl 当前连接的是哪个集群上下文。", accept: ["^kubectl\\s+config\\s+current-context$"], canonical: "kubectl config current-context", explanation: "多集群时确认当前操作的是哪个集群，避免误操作。", hint: "kubectl config ..." },
];

export const CLI_CATEGORIES = ["Linux", "网络", "Docker", "Kubernetes"] as const;
