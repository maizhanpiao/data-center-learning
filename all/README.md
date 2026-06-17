# 🗄️ 数据中心学习站

一个从**零基础到认证水平**的数据中心系统学习平台，为自用打造。

- 📚 **课程**：8 大部分 / 35 章（基础垫脚石 · 入门全景 · 电工 · 暖通 · 物理基础设施 · IT 基础设施 · 运营可靠性 · 安全标准职业）
- 🏆 **进阶地图**：6 段进阶体系，知识关 + 实操关，对标 CDCP 等认证
- 🧪 **实操练习**：内置欧姆/三相/PUE/UPS续航/冗余/可用性/制冷量等计算器 + 引导式自助实验
- 🎴 **抽认卡**：基于遗忘曲线的间隔复习
- 🌐 **资源库**：分类 + 评级的外部资源，支持每周云端自动更新
- ☁️ **跨设备同步**：本地存储 + Neon 云端同步（访问口令保护），随时随地学

---

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:3000 即可。本地默认用浏览器本地存储，无需数据库。

---

## 🚀 部署到 Vercel（手机/电脑随时学）

### 第 1 步：推送到 GitHub

```bash
# 在项目目录下
git add -A
git commit -m "数据中心学习站初版"
# 在 GitHub 新建一个空仓库（如 dc-learn），然后：
git remote add origin https://github.com/你的用户名/dc-learn.git
git branch -M main
git push -u origin main
```

### 第 2 步：在 Vercel 导入

1. 打开 https://vercel.com → 用 GitHub 登录
2. **Add New… → Project** → 选中刚推送的 `dc-learn` 仓库 → **Import**
3. 框架会自动识别为 Next.js，直接 **Deploy**
4. 等一两分钟，得到一个网址（如 `dc-learn.vercel.app`）—— 现在已经能用了（本地存储模式）

### 第 3 步：开启云同步（创建 Neon 数据库）

> 不做这步也能用，只是进度不跨设备同步。要随时随地同步就做这步。

1. 进入你的 Vercel 项目 → 顶部 **Storage** 标签
2. 点 **Create Database** → 选 **Neon (Postgres)** → 按提示创建（免费）
3. 创建后 Vercel 会**自动注入 `DATABASE_URL` 等环境变量**到项目，无需手动复制

### 第 4 步：设置访问口令

1. 项目 → **Settings → Environment Variables**
2. 新增一条：
   - Name：`ACCESS_PASSCODE`
   - Value：自己设一个口令（如 `mydc2026`）
3. 保存后，到 **Deployments** 里点最新部署 **Redeploy**（让环境变量生效）

### 第 5 步：在每台设备开启同步

打开网站 → **设置 ⚙️ → 跨设备云同步** → 输入第 4 步的口令 → 开启。
之后手机、平板、电脑只要输一次口令，进度就自动同步。

---

## 🤖 资源库每周自动更新

资源库设计为由一个**每周运行的云端定时任务**自动联网搜索、评级、排序，并提交更新到本仓库，Vercel 检测到提交后自动重新部署。

配置方法见 [`docs/weekly-update.md`](docs/weekly-update.md)。该步骤需在仓库推送到 GitHub 后进行。

---

## 环境变量一览

| 变量 | 用途 | 必需 |
|------|------|------|
| `DATABASE_URL` | Neon 数据库连接（Vercel 创建 Neon 后自动注入） | 云同步时需要 |
| `ACCESS_PASSCODE` | 访问口令，保护你的个人学习数据 | 云同步时需要 |

本地开发可在项目根目录建 `.env.local` 填入上述变量（参考 `.env.example`）来测试云同步。

---

## 技术栈

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Neon (Postgres)

数据模型与内容均为数据驱动（`src/content/`），新增/扩写章节、题目、抽认卡、资源都只需改数据文件。
