# 🤖 资源库每周自动更新

资源库（`src/content/resources.ts`）的内容由一个**每周运行的云端定时任务**自动维护：联网搜索 → 评级排序 → 提交到 GitHub → Vercel 自动重新部署。

## 工作原理

```
每周一次  →  云端 Claude Code 任务被唤起
          →  联网搜索数据中心领域最新优质学习资源
          →  按维度分类、评级、排序，更新 src/content/resources.ts
          →  把 CURRENT_WEEK 改为新的一周标签，新条目 addedWeek 设为该周
          →  git commit & push
          →  Vercel 检测到提交，自动重新部署
          →  你打开网站即是最新（首页/资源库显示“最后更新”和“本周新增”）
```

## 如何配置

> 前提：仓库已推送到 GitHub。

这一步交给我（Claude）来挂载即可——部署完成后告诉我「配置每周自动更新」，我会用 `/schedule` 建立一个每周运行的云端 routine，并填入下面的标准指令。你也可以自行在 Claude Code 里用 `/schedule` 创建。

## 给定时任务的标准指令（routine prompt）

> 学习站主线为「**云原生运维**」(Linux→网络→容器/K8s→云→自动化/SRE)，兼顾设施(电工/暖通/供配电制冷)、标准认证与职业发展。`topics` 字段用课程部分编号 **0–11**：
> 0 基础垫脚石 · 1 入门全景 · 2 电工 · 3 暖通 · 4 物理基础设施 · 5 IT基础设施 · 6 运营可靠性 · 7 安全标准职业 · 8 Linux · 9 容器与K8s · 10 云与虚拟化 · 11 自动化与可观测性。

```
你在维护 GitHub 仓库 maizhanpiao/data-center-learning（Next.js「数据中心学习站」）的资源库。
每周自动更新一次，且只允许修改 src/content/resources.ts 这一个文件。

1. 联网搜索本周最新的优质学习资源，重点覆盖云原生运维主线：
   Linux(RHCSA/RHCE)、Docker 与 Kubernetes(CKA/CKAD/CKS)、云(华为云/阿里云/AWS)、
   自动化(Shell/Python/Ansible/Git)、可观测性与 SRE(Prometheus/Grafana)、网络(HCIA/HCIP-Datacom)；
   也可补充设施(电工/暖通/供配电制冷)、标准认证(CDCP/CISP)、行业资讯与职业发展方向。
   类型：视频/文章/书籍/官方/社区/资讯/证书/工具。中英文皆可，优先权威来源、零基础友好、免费。

2. 编辑 src/content/resources.ts：
   - 把 CURRENT_WEEK 改为当前 ISO 周标签（格式 "YYYY-Www"，如 "2026-W26"）。
   - 新增 3–8 个高质量资源对象，addedWeek 设为新的 CURRENT_WEEK；不得与已有 id 或 url 重复。
   - 每个资源字段必须完整且类型正确：
     id(kebab-case 唯一)、title、type(视频/文章/书籍/官方/社区/资讯/证书/工具其一)、
     url、lang(中/英)、level(入门/进阶)、price(免费/付费)、rating(1–5 整数)、
     topics(number[]，取值 0–11)、reason(一句话推荐理由/适合谁)、addedWeek。
   - 顺手校验已有链接，明显失效的更正或删除。
   - 评级与推荐理由保持中立、务实。

3. 运行 `npm run build`，确认 TypeScript 编译通过、无报错（不通过就修好再继续）。

4. 仅提交 src/content/resources.ts：git add 该文件 → commit（信息「资源库每周更新 YYYY-Www」）→ push 到 main 分支。

严格约束：除 src/content/resources.ts 外不要改动任何文件；不要改 Resource 接口或其它代码。
```

## 手动触发

不想等定时，也可以随时在 Claude Code 里说「更新资源库」，按上面指令跑一次即可。
