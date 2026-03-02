import Phaser from 'phaser'
import { ChatWindow } from '../components/ChatWindow'
import { CluePanel } from '../components/CluePanel'
import { PuzzlePanel } from '../components/PuzzlePanel'
import { GameState } from '../systems/GameState'
import { AudioManager } from '../systems/AudioManager'

export class DesktopScene extends Phaser.Scene {
  private gameState: GameState
  private windows: Map<string, ChatWindow> = new Map()
  private cluePanel: CluePanel | null = null
  private puzzlePanel: PuzzlePanel | null = null
  private activeWindow: string = 'whatsapp'
  private audioManager: AudioManager | null = null

  // 平台配置
  private readonly platforms = [
    { id: 'whatsapp', name: 'WhatsApp', color: 0x25d366, x: 50, y: 80 },
    { id: 'telegram', name: 'Telegram', color: 0x0088cc, x: 470, y: 80 },
    { id: 'discord', name: 'Discord', color: 0x5865f2, x: 50, y: 400 },
    { id: 'email', name: '邮件', color: 0xea4335, x: 470, y: 400 },
  ]

  constructor() {
    super({ key: 'DesktopScene' })
    this.gameState = new GameState()
  }

  create(): void {
    // 初始化音效管理器
    this.audioManager = new AudioManager()
    // 绑定到场景，供其他组件访问
    ;(this as any).audioManager = this.audioManager

    // 创建桌面背景
    this.createDesktopBackground()

    // 创建状态栏
    this.createStatusBar()

    // 创建四个聊天窗口
    this.createChatWindows()

    // 创建线索面板
    this.cluePanel = new CluePanel(this, 900, 80)

    // 创建谜题面板（初始隐藏）
    this.puzzlePanel = new PuzzlePanel(this, 440, 210)
    this.puzzlePanel.hide()

    // 创建窗口切换标签
    this.createWindowTabs()

    // 创建底部工具栏
    this.createToolbar()

    // 启动游戏
    this.startGame()

    // 监听事件
    this.setupEventListeners()
  }

  private createDesktopBackground(): void {
    // 渐变背景
    const graphics = this.add.graphics()
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1)
    graphics.fillRect(0, 0, 1280, 720)
  }

  private createStatusBar(): void {
    const bar = this.add.graphics()
    bar.fillStyle(0x0f0f23)
    bar.fillRect(0, 0, 1280, 40)

    // 标题
    this.add.text(20, 10, '跨平台信使 - 调查员桌面', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
    })

    // 当前任务
    this.add.text(400, 10, '当前任务: 调查神秘网络攻击', {
      fontSize: '14px',
      color: '#888888',
    })

    // 线索数量
    const clueText = this.add.text(900, 10, `线索: 0/${this.gameState.getTotalClues()}`, {
      fontSize: '14px',
      color: '#ffd700',
    })

    // 更新线索显示
    this.events.on('clue-found', () => {
      clueText.setText(
        `线索: ${this.gameState.getDiscoveredClues()}/${this.gameState.getTotalClues()}`
      )
    })
  }

  private createChatWindows(): void {
    this.platforms.forEach((platform) => {
      const window = new ChatWindow(
        this,
        platform.x,
        platform.y,
        platform.id,
        platform.name,
        platform.color
      )
      this.windows.set(platform.id, window)

      // 默认只显示WhatsApp
      if (platform.id !== 'whatsapp') {
        window.setVisible(false)
      }
    })
  }

  private createWindowTabs(): void {
    const tabY = 720 - 60
    const startX = 50
    const spacing = 150

    this.platforms.forEach((platform, index) => {
      const x = startX + index * spacing

      // 标签背景
      const bg = this.add.graphics()
      bg.fillStyle(platform.color, 0.8)
      bg.fillRoundedRect(x, tabY, 120, 40, 8)

      // 标签文字
      this.add
        .text(x + 60, tabY + 10, platform.name, {
          fontSize: '14px',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        })
        .setOrigin(0.5, 0)

      // 点击区域
      this.add
        .rectangle(x + 60, tabY + 20, 120, 40, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.switchWindow(platform.id)
        })
    })
  }

  private switchWindow(windowId: string): void {
    // 播放点击音效
    this.audioManager?.playClick()

    // 隐藏当前窗口
    this.windows.get(this.activeWindow)?.setVisible(false)

    // 显示新窗口
    this.activeWindow = windowId
    this.windows.get(windowId)?.setVisible(true)
  }

  private createToolbar(): void {
    const toolbarY = 720 - 60

    // 谜题按钮
    this.createToolButton(900, toolbarY, '🧩 谜题', () => {
      this.puzzlePanel?.show()
      this.puzzlePanel?.updateDiscoveredClues(this.gameState.getDiscoveredCluesSet())
    })

    // 笔记按钮
    this.createToolButton(1020, toolbarY, '📋 笔记', () => {
      alert('侦探笔记本功能：\n\n收集到的线索会自动记录在这里。')
    })

    // 帮助按钮
    this.createToolButton(1140, toolbarY, '❓ 帮助', () => {
      alert(
        '游戏帮助：\n\n1. 点击底部标签切换不同平台\n2. 与NPC对话收集线索\n3. 带🔥标记的消息会消失，要快！\n4. 收集足够线索后解锁谜题'
      )
    })
  }

  private createToolButton(x: number, y: number, text: string, onClick: () => void): void {
    const bg = this.add.graphics()
    bg.fillStyle(0x2d3748, 0.8)
    bg.fillRoundedRect(x - 50, y, 100, 40, 8)

    this.add
      .text(x, y + 20, text, {
        fontSize: '14px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5)

    this.add
      .rectangle(x, y + 20, 100, 40, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.clear()
        bg.fillStyle(0x4a5568, 0.8)
        bg.fillRoundedRect(x - 50, y, 100, 40, 8)
      })
      .on('pointerout', () => {
        bg.clear()
        bg.fillStyle(0x2d3748, 0.8)
        bg.fillRoundedRect(x - 50, y, 100, 40, 8)
      })
      .on('pointerdown', onClick)
  }

  private setupEventListeners(): void {
    // 监听线索发现
    this.events.on('clue-found', () => {
      // 播放线索音效
      this.audioManager?.playClue()

      // 更新谜题面板的线索状态
      this.puzzlePanel?.updateDiscoveredClues(this.gameState.getDiscoveredCluesSet())
    })

    // 监听对话完成
    this.events.on('dialogue-complete', (windowId: string) => {
      this.onDialogueComplete(windowId)
    })

    // 监听谜题解决
    this.events.on('puzzle-solved', (puzzleId: string) => {
      this.onPuzzleSolved(puzzleId)
    })
  }

  private onDialogueComplete(windowId: string): void {
    // 根据完成的对话加载下一段
    const dialogueMap: Record<string, { chapter: string; npc: string; platform: string }> = {
      whatsapp: { chapter: 'chapter1', npc: 'hacker_x', platform: 'telegram' },
      telegram: { chapter: 'chapter1', npc: 'guild_member', platform: 'discord' },
      discord: { chapter: 'chapter1', npc: 'system', platform: 'email' },
    }

    const next = dialogueMap[windowId]
    if (next) {
      // 提示玩家切换到下一个平台
      const platformNames: Record<string, string> = {
        telegram: 'Telegram',
        discord: 'Discord',
        email: '邮件',
      }

      this.showNotification(`💡 提示：去${platformNames[next.platform]}找线索`)
    } else if (windowId === 'email') {
      // 第一章结束
      this.showNotification('🎉 第一章完成！去解谜题吧！')
    }
  }

  private onPuzzleSolved(puzzleId: string): void {
    // 播放成功音效
    this.audioManager?.playSuccess()

    if (puzzleId === 'identify-suspect') {
      // 最终谜题解决，游戏通关
      this.showVictoryScreen()
    }
  }

  private showNotification(message: string): void {
    const notif = this.add
      .text(640, 100, message, {
        fontSize: '16px',
        color: '#ffd700',
        backgroundColor: '#1a1a2e',
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)

    this.tweens.add({
      targets: notif,
      y: 80,
      alpha: { from: 0, to: 1 },
      duration: 500,
      onComplete: () => {
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: notif,
            alpha: 0,
            duration: 500,
            onComplete: () => notif.destroy(),
          })
        })
      },
    })
  }

  private showVictoryScreen(): void {
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.8)
    overlay.fillRect(0, 0, 1280, 720)

    const title = this.add
      .text(640, 300, '🎉 恭喜通关！', {
        fontSize: '48px',
        color: '#ffd700',
      })
      .setOrigin(0.5)

    const subtitle = this.add
      .text(640, 380, '你成功破解了谜团，揭露了Phantom的身份！', {
        fontSize: '20px',
        color: '#e2e8f0',
      })
      .setOrigin(0.5)

    const stats = this.add
      .text(
        640,
        440,
        `收集线索：${this.gameState.getDiscoveredClues()}/${this.gameState.getTotalClues()}\n` +
          `感谢游玩《跨平台信使》！`,
        {
          fontSize: '16px',
          color: '#888888',
          align: 'center',
        }
      )
      .setOrigin(0.5)

    // 动画效果
    this.tweens.add({
      targets: [title, subtitle, stats],
      scale: { from: 0.8, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 800,
      ease: 'Back.out',
    })
  }

  private startGame(): void {
    // 加载第一章对话
    const whatsapp = this.windows.get('whatsapp')
    if (whatsapp) {
      whatsapp.loadDialogue('chapter1', 'informant_a')
    }

    // 显示开始提示
    this.showNotification('💡 游戏开始！与匿名线人对话收集线索')
  }

  getGameState(): GameState {
    return this.gameState
  }

  discoverClue(clueId: string): void {
    if (this.gameState.discoverClue(clueId)) {
      this.events.emit('clue-found')
      this.cluePanel?.addClue(clueId)
    }
  }
}
