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

```
你在维护「数据中心学习站」仓库的资源库。请执行每周更新：

1. 联网搜索数据中心领域（涵盖：供配电、制冷暖通、电工、网络、服务器存储、
   虚拟化云、运维可靠性、标准认证、职业发展）最新的优质学习资源，
   类型包括：视频课程、文章博客、书籍、官方/白皮书、社区论坛、行业资讯、
   认证培训、工具模拟器。中英文都要，优先零基础友好与权威来源。

2. 打开 src/content/resources.ts：
   - 把 CURRENT_WEEK 更新为当前 ISO 周标签（格式 "YYYY-Www"）。
   - 校验现有条目链接是否仍有效；失效的更正或移除。
   - 新增 3–8 个本周发现的高质量资源，addedWeek 设为新的 CURRENT_WEEK。
   - 为每个资源给出 1–5 星 rating（综合权威性/质量/零基础友好度）、
     一句话 reason（推荐理由/适合谁）、正确的 type/lang/level/price/topics。
   - 保持 Resource 类型字段完整、TypeScript 可编译。

3. 运行 `npm run build` 确认通过。

4. git add、commit（信息如「资源库每周更新 YYYY-Www」）、push 到 main。

注意：只改 src/content/resources.ts，不要改动其它文件。评级与推荐理由要中立、务实。
```

## 手动触发

不想等定时，也可以随时在 Claude Code 里说「更新资源库」，按上面指令跑一次即可。
