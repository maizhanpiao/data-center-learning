import { QuizQuestion } from "@/lib/types";
import { chaptersByPart } from "@/content/chapters";

// ============================================================
// 模拟考：计时组卷 + 判分 + 错题进闭环 + 纳入进阶地图解锁
// 题池 = 本文件 extra 新题 + 对应章节(poolParts)的自测题
// ============================================================

export interface Exam {
  id: string;
  title: string;
  cert: string;      // 对标认证
  tier: number;      // 关联段位
  durationMin: number;
  pass: number;      // 通过分(百分比)
  count: number;     // 抽题数
  poolParts: number[];
  extra: QuizQuestion[];
}

const LINUX_EXTRA: QuizQuestion[] = [
  { id: "lx-01", kind: "single", question: "查看当前登录用户名的命令是？", options: ["whoami", "whois", "who -u", "id -G"], answer: [0], explanation: "whoami 输出当前有效用户名。" },
  { id: "lx-02", kind: "single", question: "权限 rwxr-xr-x 用数字表示是？", options: ["644", "755", "777", "750"], answer: [1], explanation: "rwx=7, r-x=5, r-x=5 → 755。" },
  { id: "lx-03", kind: "single", question: "chmod 644 file 表示该文件权限为？", options: ["rw-r--r--", "rwxr--r--", "rw-rw-r--", "rwxr-xr-x"], answer: [0], explanation: "6=rw-,4=r--,4=r-- → rw-r--r--。" },
  { id: "lx-04", kind: "single", question: "递归复制整个目录用？", options: ["cp dir", "cp -r dir dst", "mv -r", "scp dir"], answer: [1], explanation: "cp -r（或 -R）递归复制目录。" },
  { id: "lx-05", kind: "single", question: "在 /etc 下按名字查找 passwd 文件，正确的是？", options: ["find /etc -name passwd", "grep passwd /etc", "locate -e", "ls -R passwd"], answer: [0], explanation: "find 路径 -name 文件名。" },
  { id: "lx-06", kind: "single", question: "查看本机正在监听的 TCP 端口(现代命令)？", options: ["ss -tlnp", "ps -ef", "df -h", "top"], answer: [0], explanation: "ss -tlnp 列出监听端口(替代 netstat)。" },
  { id: "lx-07", kind: "single", question: "强制杀死进程（不可被捕获）用哪个信号？", options: ["kill -1 (HUP)", "kill -9 (KILL)", "kill -15 (TERM)", "kill -2 (INT)"], answer: [1], explanation: "SIGKILL(9) 强制终止，进程无法捕获/忽略。" },
  { id: "lx-08", kind: "single", question: "创建软链接(符号链接)用？", options: ["ln file link", "ln -s 目标 链接名", "link -s", "cp -l"], answer: [1], explanation: "ln -s 创建符号链接。" },
  { id: "lx-09", kind: "single", question: "让一个 systemd 服务开机自启用？", options: ["systemctl start", "systemctl enable", "systemctl status", "systemctl daemon-reload"], answer: [1], explanation: "enable 设置开机自启；start 只是本次启动。" },
  { id: "lx-10", kind: "single", question: "查看某 systemd 服务的日志用？", options: ["journalctl -u 服务名", "dmesg", "cat /var/log/all", "tail /etc/服务"], answer: [0], explanation: "journalctl -u 服务名 查看该单元日志。" },
  { id: "lx-11", kind: "single", question: "把用户 alice 加入 docker 组(追加，不动其它组)用？", options: ["usermod -g docker alice", "usermod -aG docker alice", "groupadd alice docker", "adduser alice"], answer: [1], explanation: "-aG 追加附加组；只用 -g 会替换主组。" },
  { id: "lx-12", kind: "single", question: "把目录打包压缩为 tar.gz 用？", options: ["tar -xzf x.tgz", "tar -czf x.tgz 目录", "gzip 目录", "zip -r"], answer: [1], explanation: "-c 创建 -z gzip -f 文件名；解压用 -xzf。" },
  { id: "lx-13", kind: "single", question: "查看磁盘各分区使用率(人类可读)用？", options: ["du -h", "df -h", "ls -lh", "free -h"], answer: [1], explanation: "df -h 看分区使用率；du 看目录占用；free 看内存。" },
  { id: "lx-14", kind: "tf", question: "环境变量赋值 `NAME=value` 等号两边可以有空格。", options: ["正确", "错误"], answer: [1], explanation: "Bash 中等号两边不能有空格，否则会被当成命令。" },
  { id: "lx-15", kind: "single", question: "在 vim 中保存并退出用？", options: [":q!", ":wq", ":w", "dd"], answer: [1], explanation: ":wq 保存并退出；:q! 不保存强制退出。" },
  { id: "lx-16", kind: "single", question: "统计文件行数用？", options: ["wc -l file", "cat -n", "grep -c .", "lines file"], answer: [0], explanation: "wc -l 统计行数。" },
  { id: "lx-17", kind: "single", question: "编辑当前用户的定时任务用？", options: ["crontab -e", "cron -e", "at now", "systemctl edit"], answer: [0], explanation: "crontab -e 编辑当前用户 cron 任务。" },
  { id: "lx-18", kind: "single", question: "查看内核版本用？", options: ["uname -r", "cat /version", "ver", "lsb_release -k"], answer: [0], explanation: "uname -r 输出内核版本。" },
  { id: "lx-19", kind: "multi", question: "以下哪些能查看正在运行的进程？（多选）", options: ["ps -ef", "top", "ls -p", "htop"], answer: [0, 1, 3], explanation: "ps、top、htop 都能看进程；ls -p 只是给目录加斜杠。" },
  { id: "lx-20", kind: "single", question: "排查“磁盘写满”，定位到具体大目录应先用？", options: ["df -h 看哪个分区满", "rm -rf /*", "reboot", "top"], answer: [0], explanation: "先 df -h 找满的分区，再 du 逐层定位大目录。" },
];

const K8S_EXTRA: QuizQuestion[] = [
  { id: "k8-01", kind: "single", question: "Kubernetes 中最小的调度单位是？", options: ["容器", "Pod", "Node", "Deployment"], answer: [1], explanation: "Pod 是最小调度单位，内含一个或多个容器。" },
  { id: "k8-02", kind: "single", question: "负责维持 Pod 副本数、滚动更新与自愈的是？", options: ["Service", "Deployment", "ConfigMap", "Namespace"], answer: [1], explanation: "Deployment 管理副本、滚动更新、回滚与自愈。" },
  { id: "k8-03", kind: "single", question: "为一组会变的 Pod 提供固定访问入口和负载均衡的是？", options: ["Ingress", "Service", "PVC", "Node"], answer: [1], explanation: "Service 通过标签选择器为 Pod 提供稳定入口。" },
  { id: "k8-04", kind: "single", question: "存放数据库密码等敏感信息应使用？", options: ["ConfigMap", "Secret", "Pod 注解", "镜像内"], answer: [1], explanation: "Secret 存敏感信息；ConfigMap 存非敏感配置。" },
  { id: "k8-05", kind: "single", question: "查看 Pod 日志的命令是？", options: ["kubectl describe", "kubectl logs", "kubectl get", "kubectl top"], answer: [1], explanation: "kubectl logs <pod> 查看容器日志。" },
  { id: "k8-06", kind: "single", question: "查看所有命名空间下的全部 Pod 用？", options: ["kubectl get pods", "kubectl get pods -A", "kubectl get ns", "kubectl all"], answer: [1], explanation: "-A / --all-namespaces 跨所有命名空间。" },
  { id: "k8-07", kind: "single", question: "Pod 状态 ImagePullBackOff 最可能的原因是？", options: ["应用崩溃", "拉取镜像失败", "内存不足", "端口冲突"], answer: [1], explanation: "ImagePullBackOff 指镜像拉取失败(名字错/未认证/网络)。" },
  { id: "k8-08", kind: "single", question: "CrashLoopBackOff 排查第一步通常是？", options: ["kubectl logs 看应用报错", "重装集群", "加节点", "改名字"], answer: [0], explanation: "应用起来就崩、反复重启，先看 logs 找崩溃原因。" },
  { id: "k8-09", kind: "single", question: "按 YAML 声明式创建/更新对象用？", options: ["kubectl run", "kubectl apply -f 文件", "kubectl create pod", "kubectl edit"], answer: [1], explanation: "kubectl apply -f 按期望状态创建/更新。" },
  { id: "k8-10", kind: "single", question: "Service 的默认类型是？", options: ["NodePort", "ClusterIP", "LoadBalancer", "Ingress"], answer: [1], explanation: "ClusterIP 仅集群内部可达，是默认类型。" },
  { id: "k8-11", kind: "single", question: "通过“节点IP:端口”把服务暴露到外部的 Service 类型是？", options: ["ClusterIP", "NodePort", "Headless", "ExternalName"], answer: [1], explanation: "NodePort 在每个节点开端口对外暴露。" },
  { id: "k8-12", kind: "single", question: "按域名/路径做七层 HTTP 路由、统一入口的是？", options: ["NodePort", "Ingress", "ConfigMap", "PVC"], answer: [1], explanation: "Ingress 提供七层路由并可统一管理 HTTPS。" },
  { id: "k8-13", kind: "single", question: "应用申领持久化存储用的对象是？", options: ["PV", "PVC", "Pod", "Secret"], answer: [1], explanation: "PVC 是应用的存储申领，绑定到实际的 PV。" },
  { id: "k8-14", kind: "single", question: "存储整个集群期望/实际状态的键值数据库是？", options: ["MySQL", "etcd", "Redis", "kubelet"], answer: [1], explanation: "etcd 是 K8s 的状态存储。" },
  { id: "k8-15", kind: "single", question: "集群的统一入口、所有操作都经过的组件是？", options: ["Scheduler", "API Server", "kube-proxy", "etcd"], answer: [1], explanation: "API Server 是集群入口。" },
  { id: "k8-16", kind: "single", question: "在工作节点上管理本机容器的组件是？", options: ["kubelet", "Controller Manager", "Scheduler", "etcd"], answer: [0], explanation: "kubelet 在节点上干活、管理容器。" },
  { id: "k8-17", kind: "single", question: "把 web 这个 Deployment 扩到 5 个副本用？", options: ["kubectl scale deployment web --replicas=5", "kubectl resize web 5", "kubectl run web -5", "kubectl expand web"], answer: [0], explanation: "kubectl scale ... --replicas=N 扩缩容。" },
  { id: "k8-18", kind: "single", question: "查看某对象详情及底部 Events 用？", options: ["kubectl logs", "kubectl describe", "kubectl top", "kubectl edit"], answer: [1], explanation: "describe 展示详情与事件，排障关键。" },
  { id: "k8-19", kind: "tf", question: "CKA 考试是纯选择题，不需要上机操作。", options: ["正确", "错误"], answer: [1], explanation: "CKA 是真集群上机实操考，可查官方文档。" },
  { id: "k8-20", kind: "multi", question: "下列关于 Deployment 优于裸 Pod 的说法，正确的有？（多选）", options: ["挂了能自愈", "支持滚动更新", "可一键回滚", "运行速度更快"], answer: [0, 1, 2], explanation: "Deployment 提供自愈/滚动更新/回滚；与运行速度无关。" },
];

export const EXAMS: Exam[] = [
  {
    id: "linux",
    title: "Linux 系统运维 模拟考",
    cert: "对标 RHCSA / RHCE",
    tier: 2,
    durationMin: 25,
    pass: 70,
    count: 18,
    poolParts: [8],
    extra: LINUX_EXTRA,
  },
  {
    id: "k8s",
    title: "容器与 Kubernetes 模拟考",
    cert: "对标 CKA",
    tier: 4,
    durationMin: 25,
    pass: 70,
    count: 18,
    poolParts: [9],
    extra: K8S_EXTRA,
  },
];

export function examById(id: string) {
  return EXAMS.find((e) => e.id === id);
}

export function examByTier(tier: number) {
  return EXAMS.find((e) => e.tier === tier);
}

/** 题池 = 本考试新题 + 关联章节的自测题 */
export function examPool(e: Exam): QuizQuestion[] {
  const fromParts = e.poolParts.flatMap((p) => chaptersByPart(p).flatMap((c) => c.quiz));
  return [...e.extra, ...fromParts];
}

/** 随机抽 count 道（洗牌取前 N） */
export function sampleQuestions(e: Exam): QuizQuestion[] {
  const pool = [...examPool(e)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(e.count, pool.length));
}
