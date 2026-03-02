# 🚀 GitHub Pages 部署指南

让《跨平台信使》可以直接在线游玩！

---

## 📋 部署步骤

### 第1步：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 仓库名称：`cross-platform-messenger`
4. 选择 **Public**（公开）
5. 点击 **Create repository**

---

### 第2步：上传代码

#### 方式A：命令行上传

```bash
# 进入项目目录
cd /root/.openclaw/workspace/games/cross-platform-messenger

# 初始化git仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Cross-Platform Messenger v0.2.0"

# 添加远程仓库（替换为你的用户名）
git remote add origin https://github.com/你的用户名/cross-platform-messenger.git

# 推送
git branch -M main
git push -u origin main
```

#### 方式B：打包上传

```bash
# 打包源代码
cd /root/.openclaw/workspace/games/cross-platform-messenger
tar -czvf game-source.tar.gz --exclude='node_modules' --exclude='dist' .

# 下载 game-source.tar.gz 到你的电脑
# 解压后上传到GitHub
```

---

### 第3步：启用 GitHub Pages

1. 进入你的仓库页面
2. 点击 **Settings**（设置）
3. 左侧菜单选择 **Pages**
4. **Source** 选择 **GitHub Actions**
5. 保存

---

### 第4步：等待自动部署

1. 点击仓库顶部 **Actions** 标签
2. 等待 workflow 完成（约1-2分钟）
3. 完成后，点击 **Settings** → **Pages**
4. 看到绿色勾勾 ✅ 和网址即表示成功

---

## 🌐 访问地址

部署成功后，游戏地址为：

```
https://你的用户名.github.io/cross-platform-messenger/
```

---

## 📁 部署文件说明

已自动配置以下文件：

| 文件 | 作用 |
|------|------|
| `.github/workflows/deploy.yml` | GitHub Actions 自动部署脚本 |
| `vite.config.ts` | 已配置 base 路径 |

---

## ✅ 部署检查清单

- [ ] 创建 GitHub 仓库
- [ ] 上传源代码
- [ ] 启用 GitHub Pages
- [ ] 等待 Actions 完成
- [ ] 访问测试网址

---

## 🔧 自定义域名（可选）

如需使用自己的域名：

1. 在 `dist/` 文件夹创建 `CNAME` 文件
2. 写入你的域名，如：`game.yourdomain.com`
3. 在你的域名DNS添加 CNAME 记录指向 `你的用户名.github.io`
4. 重新部署

---

## 🐛 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台是否有404错误，可能是 base 路径配置问题。

### Q: Actions 失败？
A: 检查仓库 Settings → Actions → General → Workflow permissions 是否设置为 "Read and write permissions"

### Q: 如何更新游戏？
A: 修改代码后 push 到 main 分支，会自动重新部署。

---

## 🎮 部署成功后

分享这个链接给朋友：
```
https://你的用户名.github.io/cross-platform-messenger/
```

他们可以直接在浏览器玩，无需下载！

---

**预计部署时间：5-10分钟** ⏱️
