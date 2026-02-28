# 《跨平台信使》(Cross-Platform Messenger)

> 一款解谜冒险游戏，在模拟电脑桌面上破解网络犯罪谜团

![Phaser 3](https://img.shields.io/badge/Phaser-3.70-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 游戏简介

玩家扮演一名网络安全调查员，通过 **WhatsApp、Telegram、Discord、邮件** 四个即时通讯平台收集线索，破解一桩神秘的网络犯罪事件。

### 核心特色

- 🔥 **阅后即焚** - 关键消息会在几秒后消失，增加紧张感
- 🧩 **跨平台解谜** - 线索分散在不同平台，需要整合推理
- 🤖 **AI生成对话** - NPC对话由OpenClaw AI辅助生成
- 🎨 **复古桌面界面** - 沉浸式模拟电脑桌面体验

## 🚀 快速开始

### 在线试玩

```bash
# 克隆项目
git clone <repository-url>
cd cross-platform-messenger

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器访问 http://localhost:5173
```

### 生产构建

```bash
npm run build
npm run preview
```

## 🎯 游戏玩法

### 第一章：初探

1. **WhatsApp** - 与匿名线人对话
   - 收集IP地址前半段
   - 获取解密密钥线索

2. **Telegram** - 黑客X的挑战
   - 破解凯撒密码谜题
   - 收集IP地址后半段

3. **Discord** - 公会成员的信息
   - 获得案发时间
   - 获取嫌疑人代号

4. **邮件** - 系统日志
   - 获取服务器位置

5. **解谜面板** - 整合线索
   - 输入完整IP地址
   - 破解密码
   - 指认嫌疑人 Phantom

## 🛠️ 技术栈

- **游戏引擎**: Phaser 3.70
- **语言**: TypeScript 5.3
- **构建工具**: Vite 5
- **代码规范**: ESLint + Prettier

## 📁 项目结构

```
src/
├── components/       # UI组件
│   ├── ChatWindow.ts      # 聊天窗口
│   ├── MessageBubble.ts   # 消息气泡
│   ├── CluePanel.ts       # 线索面板
│   ├── PuzzlePanel.ts     # 谜题面板
│   └── InputPanel.ts      # 输入面板
├── scenes/           # 游戏场景
│   ├── BootScene.ts       # 启动场景
│   └── DesktopScene.ts    # 主桌面场景
├── systems/          # 游戏系统
│   ├── GameState.ts       # 游戏状态
│   ├── PuzzleSystem.ts    # 谜题系统
│   ├── AudioManager.ts    # 音效管理
│   └── EffectsManager.ts  # 特效管理
├── data/             # 游戏数据
│   └── dialogues.ts       # 对话数据
└── main.ts           # 入口文件
```

## 🎨 美术资源

所有美术资源均为程序生成，无需外部图片：
- 使用 Phaser Graphics API 绘制UI元素
- Emoji 作为角色头像
- CSS渐变背景

## 🔊 音效

使用 Web Audio API 实时生成：
- 新消息提示音
- 线索发现音效
- 阅后即焚警告音
- 解谜成功音效

## 📝 开发历程

| 阶段 | 时间 | 内容 |
|------|------|------|
| Day 1 | 2天 | 项目搭建、核心框架、基础UI |
| Day 2 | 2天 | 对话系统、谜题系统、完整流程 |
| Day 3 | 2天 | 音效、特效、测试优化 |

## 🎯 设计亮点

### 阅后即焚机制
- 带🔥标记的消息会在5-15秒后消失
- 需要快速阅读并记忆关键信息
- 错过无法再次查看（除非使用特殊道具）

### 跨平台线索整合
- 线索分散在四个不同平台
- 需要跨平台切换收集完整信息
- 例如：IP地址需要两个平台的片段组合

### 渐进式难度
- 从单平台简单对话开始
- 逐步引入多平台联动
- 最终挑战需要整合所有线索

## 🔮 未来扩展

- [ ] 多章节剧情
- [ ] 动态AI对话
- [ ] 更多谜题类型
- [ ] 成就系统
- [ ] 多结局分支

## 👥 团队

- 开发: OpenClaw AI + Phaser.js
- 设计: 跨平台信使团队
- 测试: 社区玩家

## 📄 许可证

MIT License

---

Made with ❤️ and Phaser 3
