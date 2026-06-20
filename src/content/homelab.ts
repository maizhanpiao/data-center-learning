// ============================================================
// homelab 搭建引导实验（按用户两台机：Mac M2Pro/16G + 联想 i5-6200U/8G）
// 目标：从零搭出 Ubuntu + k3s + Ansible + 监控的真实运维闭环
// ============================================================

export interface LabStep {
  text: string;
  cmd?: string;   // 可选命令（在哪台机执行见 stage.machine）
}

export interface LabStage {
  id: string;      // 用作 practiceDone 的 key
  icon: string;
  title: string;
  machine: string; // 在哪台机器操作
  minutes: number;
  goal: string;
  steps: LabStep[];
  verify: string[];
  pitfalls?: string[];
}

export const HOMELAB_INTRO =
  "把你的两台机器组成一个迷你机房：🍎 Mac（M2 Pro/16G）当控制端与多节点沙盘，💻 联想（i5-6200U/8G/238G）清盘装 Ubuntu 当常开服务器。跟着做完，你就在自己家里真刀真枪练了一遍 Linux + K8s + 自动化 + 监控。命令里的 192.168.x.x 换成你联想的实际局域网 IP，ops 换成你的用户名。";

export const HOMELAB_STAGES: LabStage[] = [
  {
    id: "homelab:s0",
    icon: "🧰",
    title: "阶段 0 · 准备",
    machine: "Mac + 联想",
    minutes: 20,
    goal: "备份数据、确认硬件、在 Mac 上装好控制端工具。",
    steps: [
      { text: "把联想里需要的文件全部备份到移动硬盘/网盘（装系统会清空整盘）。" },
      { text: "联想开机按 F2/F12 进 BIOS，确认开启硬件虚拟化（Intel VT-x），保存退出。" },
      { text: "Mac 安装 Homebrew（已装可跳过）。", cmd: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"' },
      { text: "Mac 装控制端工具：kubectl、ansible，以及做 U 盘的 Raspberry Pi Imager。", cmd: "brew install kubectl ansible && brew install --cask raspberry-pi-imager" },
    ],
    verify: ["联想数据已备份", "Mac 上 kubectl version 与 ansible --version 都能正常输出"],
    pitfalls: ["没开 VT-x 会导致后续跑容器/虚拟机失败或极慢。"],
  },
  {
    id: "homelab:s1",
    icon: "🐧",
    title: "阶段 1 · 给联想装 Ubuntu Server",
    machine: "联想",
    minutes: 40,
    goal: "把联想装成一台干净的 Ubuntu Server，并开启 SSH。",
    steps: [
      { text: "在 Mac 下载 Ubuntu Server 24.04 LTS 的 ISO（ubuntu.com/download/server）。" },
      { text: "用 Raspberry Pi Imager 把 ISO 写入一个 U 盘（≥4G，会清空 U 盘）。" },
      { text: "联想插 U 盘，开机狂按 F12 选择从 U 盘启动，进入安装界面。" },
      { text: "按引导安装：整盘安装、设用户名(如 ops)与密码，**务必勾选 Install OpenSSH server**。" },
      { text: "安装完成、拔 U 盘重启，登录后查看局域网 IP 并记下来。", cmd: "ip a" },
    ],
    verify: ["联想能用账号密码登录", "ip a 看到一个 192.168.x.x 的局域网地址（记下它）"],
    pitfalls: ["忘了勾 OpenSSH 就无法远程登录——可装完后 sudo apt install -y openssh-server 补上。"],
  },
  {
    id: "homelab:s2",
    icon: "🔑",
    title: "阶段 2 · 从 Mac 远程登录（含免密）",
    machine: "Mac",
    minutes: 15,
    goal: "在 Mac 上 SSH 进联想，并配置免密登录，为自动化铺路。",
    steps: [
      { text: "Mac 终端首次 SSH 登录联想（输一次密码）。", cmd: "ssh ops@192.168.x.x" },
      { text: "退出回到 Mac。若没有密钥则生成一个（一路回车）。", cmd: "ssh-keygen -t ed25519" },
      { text: "把公钥拷给联想，实现免密。", cmd: "ssh-copy-id ops@192.168.x.x" },
      { text: "再次 SSH，应当不再要密码。", cmd: "ssh ops@192.168.x.x" },
    ],
    verify: ["第二次 ssh 无需输入密码即可登录联想"],
    pitfalls: ["连不上先确认两台机在同一 WiFi/局域网，且 IP 没记错。"],
  },
  {
    id: "homelab:s3",
    icon: "☸️",
    title: "阶段 3 · 装 k3s 并从 Mac 接管",
    machine: "联想 + Mac",
    minutes: 25,
    goal: "在联想上一条命令装好 Kubernetes(k3s)，并让 Mac 的 kubectl 能管它。",
    steps: [
      { text: "【联想】一条命令安装 k3s（轻量 K8s）。", cmd: "curl -sfL https://get.k3s.io | sh -" },
      { text: "【联想】确认节点就绪。", cmd: "sudo k3s kubectl get nodes" },
      { text: "【联想】打印 kubeconfig 内容，整段复制下来。", cmd: "sudo cat /etc/rancher/k3s/k3s.yaml" },
      { text: "【Mac】把内容存到 ~/.kube/config，并把里面的 127.0.0.1 改成联想的 IP。", cmd: "mkdir -p ~/.kube && nano ~/.kube/config" },
      { text: "【Mac】验证能远程看到联想节点。", cmd: "kubectl get nodes" },
    ],
    verify: ["联想上 get nodes 显示节点 Ready", "Mac 上 kubectl get nodes 也能看到该节点"],
    pitfalls: ["Mac 连不上多半是 kubeconfig 里 server 还写着 127.0.0.1，要改成联想 IP（端口 6443 保留）。"],
  },
  {
    id: "homelab:s4",
    icon: "🚀",
    title: "阶段 4 · 部署第一个应用",
    machine: "Mac",
    minutes: 20,
    goal: "用 YAML 在集群里部署 nginx 并对外访问，亲历自愈与扩缩容。",
    steps: [
      { text: "命令式快速起一个：创建 nginx Deployment（2 副本）。", cmd: "kubectl create deployment web --image=nginx --replicas=2" },
      { text: "用 NodePort 暴露到外部。", cmd: "kubectl expose deployment web --port=80 --type=NodePort" },
      { text: "查看分配到的 NodePort 端口。", cmd: "kubectl get svc web" },
      { text: "浏览器访问 http://联想IP:NodePort，看到 nginx 欢迎页。" },
      { text: "删掉一个 Pod，观察它自动补回（自愈）。", cmd: "kubectl delete pod <某个web的pod名>" },
      { text: "扩容到 4 个副本再看。", cmd: "kubectl scale deployment web --replicas=4" },
    ],
    verify: ["浏览器能打开 nginx 页面", "删 Pod 后副本数自动恢复", "scale 后 Pod 数变化"],
    pitfalls: ["打不开页面：确认用的是 NodePort 端口(3 万多的那个)，且联想防火墙没拦。"],
  },
  {
    id: "homelab:s5",
    icon: "🤖",
    title: "阶段 5 · 用 Ansible 远程自动化",
    machine: "Mac",
    minutes: 25,
    goal: "在 Mac 写剧本，一键远程给联想装软件——体会“一处编写、批量执行”。",
    steps: [
      { text: "建清单文件 inventory.ini，写入联想。", cmd: "[lab]\n192.168.x.x ansible_user=ops" },
      { text: "测试连通（应返回 SUCCESS/pong）。", cmd: "ansible -i inventory.ini lab -m ping" },
      { text: "建剧本 site.yml：更新源并安装 htop。", cmd: "- hosts: lab\n  become: true\n  tasks:\n    - name: 安装 htop\n      apt: { name: htop, update_cache: yes }" },
      { text: "执行剧本。", cmd: "ansible-playbook -i inventory.ini site.yml" },
      { text: "SSH 进联想确认 htop 已装上。", cmd: "ssh ops@192.168.x.x 'which htop'" },
    ],
    verify: ["ansible ping 返回 SUCCESS", "playbook 执行成功(changed)", "联想上能运行 htop"],
    pitfalls: ["become: true 用于 sudo 提权；若报权限错，确认 ops 有 sudo 权限。"],
  },
  {
    id: "homelab:s6",
    icon: "📊",
    title: "阶段 6 · 上监控（可观测性）",
    machine: "联想",
    minutes: 30,
    goal: "用 Docker 跑起 Prometheus + Grafana + node_exporter，看到联想的实时指标。",
    steps: [
      { text: "【联想】安装 Docker。", cmd: "curl -fsSL https://get.docker.com | sh" },
      { text: "跑 node_exporter（采集主机指标）。", cmd: "docker run -d --name node-exporter -p 9100:9100 prom/node-exporter" },
      { text: "跑 Prometheus（最简：先用默认配置，或挂一个抓 node-exporter 的 prometheus.yml）。", cmd: "docker run -d --name prometheus -p 9090:9090 prom/prometheus" },
      { text: "跑 Grafana。", cmd: "docker run -d --name grafana -p 3000:3000 grafana/grafana" },
      { text: "浏览器开 http://联想IP:3000 (admin/admin) → 添加 Prometheus 数据源 (http://联想IP:9090) → 导入主机监控大盘(如 Node Exporter Full, ID 1860)。" },
    ],
    verify: ["Grafana 能打开并登录", "大盘上能看到联想的 CPU/内存/磁盘实时曲线"],
    pitfalls: ["8G 内存有限，监控栈+其它服务别全开太多；练完可 docker stop 释放。", "Prometheus 要抓到 node-exporter 需在其配置里加 target 192.168.x.x:9100。"],
  },
];
