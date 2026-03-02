#!/bin/bash
# GitHub 自动部署脚本 - 一键创建仓库并上传

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Cross-Platform Messenger - GitHub 自动部署${NC}"
echo "=================================================="
echo ""

# 检查GitHub CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ 错误: GitHub CLI (gh) 未安装${NC}"
    echo "请安装: https://cli.github.com/"
    exit 1
fi

# 检查登录状态
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️ 需要先登录 GitHub${NC}"
    echo "运行: gh auth login"
    gh auth login
fi

# 获取用户名
USERNAME=$(gh api user -q '.login')
echo -e "${GREEN}✅ 已登录: $USERNAME${NC}"
echo ""

# 检查本地仓库
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📁 初始化本地Git仓库...${NC}"
    git init
    git add .
    git commit -m "Initial commit: Cross-Platform Messenger v0.2.0"
fi

# 创建GitHub仓库
echo -e "${YELLOW}📦 创建GitHub仓库...${NC}"
REPO_NAME="cross-platform-messenger"

if gh repo view "$USERNAME/$REPO_NAME" &> /dev/null; then
    echo -e "${YELLOW}⚠️ 仓库已存在，跳过创建${NC}"
else
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    echo -e "${GREEN}✅ 仓库创建并推送完成！${NC}"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}📋 仓库地址:${NC}"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo -e "${GREEN}🌐 游戏地址（部署后）:${NC}"
echo "https://$USERNAME.github.io/$REPO_NAME/"
echo ""
echo "=================================================="
echo -e "${YELLOW}⚠️ 重要：需要手动启用GitHub Pages${NC}"
echo ""
echo "步骤:"
echo "1. 访问: https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "2. Source 选择: GitHub Actions"
echo "3. 等待1-2分钟部署完成"
echo ""
echo "或运行命令:"
echo "gh api repos/$USERNAME/$REPO_NAME/pages -X POST -F source=\"github_actions\" 2>/dev/null || echo '请手动在网页设置'"
echo ""
echo -e "${GREEN}🎮 部署完成后即可在线游玩！${NC}"
echo "=================================================="
