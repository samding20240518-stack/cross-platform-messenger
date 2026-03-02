# Git Push 问题解决方案

## 问题
执行 `git push origin main` 时出现错误：
```
fatal: could not read Username for 'https://github.com': No such device or address
```

## 解决方案

### 方案1：使用GitHub Personal Access Token

1. 在GitHub上创建Personal Access Token:
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token"
   - 选择所需的权限（至少需要 `repo` 权限）
   - 生成并复制token

2. 修改远程仓库URL为包含token的格式：
```bash
git remote set-url origin https://<your-token>@github.com/samding20240518-stack/cross-platform-messenger.git
```

3. 然后执行推送：
```bash
git push origin main
```

### 方案2：使用SSH密钥

1. 生成SSH密钥（如果还没有）：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. 添加SSH密钥到GitHub:
   - 复制公钥内容：`cat ~/.ssh/id_ed25519.pub`
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"
   - 粘贴公钥并保存

3. 修改远程仓库URL为SSH格式：
```bash
git remote set-url origin git@github.com:samding20240518-stack/cross-platform-messenger.git
```

4. 然后执行推送：
```bash
git push origin main
```

### 方案3：使用Git凭据管理器

1. 安装Git凭据管理器：
```bash
# Ubuntu/Debian
sudo apt-get install git-credential-manager

# macOS
brew install git-credential-manager

# Windows (已包含在Git for Windows中)
```

2. 配置Git使用凭据管理器：
```bash
git config --global credential.helper store
```

3. 首次推送时会提示输入用户名和密码，之后会自动保存

### 方案4：手动输入凭据

1. 临时修改远程URL为包含用户名：
```bash
git remote set-url origin https://samding20240518-stack@github.com/samding20240518-stack/cross-platform-messenger.git
```

2. 推送时会提示输入密码（使用Personal Access Token作为密码）

## ✅ 当前状态

所有代码检查已通过：
- ✅ TypeScript 类型检查
- ✅ ESLint 代码规范检查
- ✅ Prettier 代码格式检查
- ✅ 单元测试

代码已准备好推送，只需解决身份验证问题即可。

## 🎯 推荐方案

**推荐使用方案1（Personal Access Token）**，这是最简单且安全的方法。

执行推送命令：
```bash
git push origin main
```

**🎉 项目已达到 100% 部署就绪状态！**