#!/bin/bash
# GitHub Pages 部署准备脚本

echo "🚀 Cross-Platform Messenger - GitHub Pages 部署准备"
echo "=================================================="
echo ""

# 检查git是否安装
if ! command -v git &> /dev/null; then
    echo "❌ 错误: git 未安装"
    echo "请安装 git: apt-get install git"
    exit 1
fi

# 检查GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️ 警告: GitHub CLI (gh) 未安装"
    echo "建议安装以简化操作: https://cli.github.com/"
    echo ""
fi

# 进入项目目录
cd "$(dirname "$0")"

echo "📦 步骤1: 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"
echo ""

# 检查是否已有git仓库
if [ ! -d ".git" ]; then
    echo "📁 步骤2: 初始化Git仓库..."
    git init
    git add .
    git commit -m "Initial commit: Cross-Platform Messenger v1.1"
    echo "✅ Git仓库初始化完成"
else
    echo "📁 Git仓库已存在"
fi

echo ""
echo "=================================================="
echo "📋 下一步操作:"
echo ""
echo "1. 在GitHub创建新仓库:"
echo "   https://github.com/new"
echo "   名称: cross-platform-messenger"
echo ""
echo "2. 连接远程仓库并推送:"
echo "   git remote add origin https://github.com/你的用户名/cross-platform-messenger.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 启用GitHub Pages:"
echo "   - 进入仓库 Settings → Pages"
echo "   - Source 选择 GitHub Actions"
echo ""
echo "4. 等待自动部署完成 (约1-2分钟)"
echo ""
echo "5. 访问你的游戏:"
echo "   https://你的用户名.github.io/cross-platform-messenger/"
echo ""
echo "📖 详细指南: DEPLOY.md"
echo "=================================================="
