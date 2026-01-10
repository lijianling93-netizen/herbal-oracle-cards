# 草药占星神谕卡 - 部署指南

## 📋 目录
1. [前置准备](#前置准备)
2. [GitHub 仓库设置](#github-仓库设置)
3. [Vercel 部署](#vercel-部署)
4. [环境变量配置](#环境变量配置)
5. [恢复会员系统UI](#恢复会员系统ui)
6. [常见问题](#常见问题)

---

## 前置准备

### 1. 准备账号
- **GitHub 账号**：[注册地址](https://github.com/signup)
- **Vercel 账号**：[注册地址](https://vercel.com/signup)
- **Vercel 推荐用 GitHub 账号直接登录**（方便后续自动部署）

### 2. 本地安装 Git
如果本地没有 Git，需要先安装：
- Windows：[下载 Git](https://git-scm.com/download/win)
- Mac：`brew install git`
- Linux：`sudo apt install git`

---

## GitHub 仓库设置

### 步骤 1：创建新仓库
1. 登录 GitHub
2. 点击右上角 `+` → `New repository`
3. 填写仓库信息：
   - Repository name: `herbal-oracle-cards`（或自定义）
   - Description: 草药占星神谕卡占卜应用
   - 选择 **Public** 或 **Private**（都可以）
   - 勾选 `Add a README file`（可选）
4. 点击 `Create repository`

### 步骤 2：获取沙箱代码
在沙箱环境中运行以下命令导出代码：

```bash
# 1. 初始化 Git 仓库
cd /workspace/projects
git init

# 2. 添加所有文件
git add .

# 3. 创建首次提交
git commit -m "feat: 草药占星神谕卡初始版本"

# 4. 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/herbal-oracle-cards.git

# 5. 推送到 GitHub（首次推送）
git branch -M main
git push -u origin main
```

**注意**：将 `YOUR_USERNAME` 替换成你的 GitHub 用户名。

---

## Vercel 部署

### 方法 1：通过 Vercel 网页部署（推荐）

#### 步骤 1：导入项目
1. 登录 [Vercel](https://vercel.com/)
2. 点击 `Add New Project`
3. 在 `Import Git Repository` 中选择 `Continue with GitHub`
4. 授权 Vercel 访问你的 GitHub
5. 选择刚创建的 `herbal-oracle-cards` 仓库
6. 点击 `Import`

#### 步骤 2：配置项目
Vercel 会自动检测到 Next.js 项目，配置如下：

**Framework Preset**: Next.js
**Root Directory**: `./`（保持默认）
**Build Command**: `pnpm install && pnpm run build`
**Output Directory**: `.next`
**Install Command**: `pnpm install`

#### 步骤 3：配置环境变量
在 `Environment Variables` 部分添加以下变量：

| Key | Value | 环境 |
|-----|-------|------|
| `DATABASE_URL` | 从平台集成获取 | Production, Preview, Development |

**获取 DATABASE_URL**：
1. 在开发环境中，数据库是通过 `coze-coding-dev-sdk` 自动连接的
2. 部署后需要联系平台管理员获取生产环境的数据库连接字符串

#### 步骤 4：部署
1. 点击 `Deploy` 按钮
2. 等待 2-3 分钟，Vercel 会自动构建和部署
3. 部署成功后，会显示类似 `https://herbal-oracle-cards.vercel.app` 的链接

### 方法 2：通过 Vercel CLI 部署

如果你更熟悉命令行，可以使用 Vercel CLI：

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署
vercel

# 4. 按提示操作，选择：
#    - Set up and deploy "~/workspace/projects"? [Y/n] Y
#    - Which scope do you want to deploy to? (选择你的账号)
#    - Link to existing project? [y/N] N
#    - What's your project's name? herbal-oracle-cards
#    - In which directory is your code located? ./
#    - Want to override the settings? [y/N] N

# 5. 部署到生产环境
vercel --prod
```

---

## 环境变量配置

### 开发环境
项目目前使用 `coze-coding-dev-sdk` 自动获取数据库连接，无需配置环境变量。

### 生产环境
部署到 Vercel 后，需要配置环境变量：

1. 登录 Vercel 控制台
2. 进入项目设置 → `Environment Variables`
3. 添加以下变量：

```env
# 数据库连接字符串（需从平台获取）
DATABASE_URL=postgresql://user:password@host:5432/database

# 可选：其他环境变量
NODE_ENV=production
```

---

## 恢复会员系统UI

当前项目中，会员系统相关 UI 已被隐藏（如登录按钮、用户菜单、保存历史按钮）。部署后如需恢复，请按以下步骤操作：

### 步骤 1：恢复用户菜单
在 `src/app/page.tsx` 中找到以下注释并取消注释：

```tsx
// ========== 恢复用户菜单 ==========
// 找到 Header 部分的用户菜单代码
// 取消注释以下部分：
{/* {user && (
  <div className="user-menu">
    <User size={20} />
    <span>{user.username || user.email}</span>
  </div>
)} */}
```

### 步骤 2：恢复登录按钮
在首页右上角恢复登录/注册按钮：

```tsx
// 恢复登录/注册按钮
{!user && (
  <button onClick={() => setIsAuthModalOpen(true)}>
    登录 / 注册
  </button>
)}
```

### 步骤 3：恢复保存历史按钮
在 `CardInterpretation.tsx` 中恢复保存按钮：

```tsx
// 恢复保存历史记录按钮
<button onClick={handleSaveHistory}>
  保存占卜结果
</button>
```

### 步骤 4：测试会员功能
1. 注册新账号
2. 测试登录功能
3. 测试保存历史记录
4. 测试查看历史记录

---

## 常见问题

### Q1: 部署后数据库连接失败？
**A**: 检查以下几点：
1. 环境变量 `DATABASE_URL` 是否正确配置
2. 数据库是否允许外部访问（白名单配置）
3. 生产环境可能需要获取独立的数据库服务（如 Supabase、Neon）

### Q2: 部署后样式错乱？
**A**: 确保：
1. `tailwind.config.ts` 配置正确
2. 构建没有报错（检查 Vercel 构建日志）
3. 清除浏览器缓存后重新加载

### Q3: Cookie 在部署后不生效？
**A**: 这是正常现象，因为：
1. 部署后域名变为 `*.vercel.app`
2. Cookie 的 `domain` 属性需要匹配
3. 确保代码中没有硬编码 `localhost`

### Q4: 如何更新网站？
**A**: 只需推送代码到 GitHub：
```bash
git add .
git commit -m "fix: 修复某个问题"
git push
```
Vercel 会自动检测并重新部署。

### Q5: 免费额度用完了怎么办？
**A**: 免费额度通常够用，如果超出：
1. Vercel 免费额度：100GB/月
2. 数据库推荐 Supabase（免费 500MB）
3. 可升级到 Pro 计划（$20/月）

---

## 下一步建议

1. **自定义域名**：在 Vercel 项目设置中绑定自定义域名
2. **CDN 加速**：Vercel 自带全球 CDN，无需额外配置
3. **SEO 优化**：添加 `metadata` 和 `sitemap`
4. **数据分析**：集成 Google Analytics
5. **监控告警**：配置 Vercel 错误监控

---

## 技术支持

如遇到问题，可以：
1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. 检查项目日志：Vercel 控制台 → Logs

---

## 附录：快速命令参考

```bash
# Git 操作
git status                    # 查看状态
git add .                     # 添加所有文件
git commit -m "message"       # 提交
git push                      # 推送到 GitHub
git pull                      # 拉取最新代码

# Vercel 操作
vercel login                  # 登录 Vercel
vercel                        # 部署到预览环境
vercel --prod                 # 部署到生产环境
vercel logs                   # 查看日志

# 项目操作
pnpm install                  # 安装依赖
pnpm dev                      # 启动开发服务器
pnpm build                    # 构建项目
pnpm start                    # 启动生产服务器
```

---

**祝部署顺利！** ✨
