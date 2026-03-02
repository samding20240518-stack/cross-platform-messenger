import Phaser from 'phaser'
import { MessageBubble } from './MessageBubble'
import { DialogueData, getDialogue } from '../data/dialogues'
import { InputPanel } from './InputPanel'

export class ChatWindow extends Phaser.GameObjects.Container {
  private windowBg!: Phaser.GameObjects.Image
  private messages: MessageBubble[] = []
  private messageContainer!: Phaser.GameObjects.Container
  private scrollY: number = 0
  private dialogueStep: number = 0
  private currentDialogue: DialogueData | null = null
  private inputPanel!: InputPanel

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private windowId: string,
    private windowName: string,
    private themeColor: number
  ) {
    super(scene, x, y)

    this.createWindow()
    scene.add.existing(this)
  }

  private createWindow(): void {
    // 窗口背景
    this.windowBg = this.scene.add.image(200, 250, 'window-bg')
    this.add(this.windowBg)

    // 标题栏
    const titleBar = this.scene.add.graphics()
    titleBar.fillStyle(this.themeColor, 1)
    titleBar.fillRoundedRect(10, 10, 380, 40, 8)
    this.add(titleBar)

    // 标题文字
    const titleText = this.scene.add
      .text(200, 30, this.windowName, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)
    this.add(titleText)

    // 消息容器
    this.messageContainer = this.scene.add.container(20, 60)
    this.add(this.messageContainer)

    // 输入面板
    this.inputPanel = new InputPanel(this.scene, 20, 420)
    this.inputPanel.hide()
    this.add(this.inputPanel)
  }

  showInputChoices(choices: string[]): Promise<number> {
    return new Promise((resolve) => {
      this.inputPanel.showChoices(choices, (index) => {
        resolve(index)
      })
    })
  }

  loadDialogue(chapter: string, npcId: string): void {
    this.currentDialogue = getDialogue(chapter, npcId, this.windowId)
    this.dialogueStep = 0
    this.showNextMessage()
  }

  async showNextMessage(): Promise<void> {
    if (!this.currentDialogue || this.dialogueStep >= this.currentDialogue.messages.length) {
      this.onDialogueComplete()
      return
    }

    const msg = this.currentDialogue.messages[this.dialogueStep]

    // 处理选择类型
    if (msg.type === 'choice') {
      const choices = (msg as any).options || ['继续...']
      const selectedIndex = await this.showInputChoices(choices)

      // 显示玩家选择
      const selectedText = choices[selectedIndex]
      this.addPlayerMessage(selectedText)

      this.dialogueStep++

      // 延迟后显示NPC回复
      this.scene.time.delayedCall(800, () => {
        this.showNextMessage()
      })
      return
    }

    // 创建消息气泡
    const bubble = new MessageBubble(
      this.scene,
      msg.type === 'npc' ? 20 : 180,
      this.messages.length * 80 + 10,
      msg.content,
      msg.type === 'npc',
      msg.burnAfter || 0,
      msg.isClue || false
    )

    // 阅后即焚消息
    if (msg.burnAfter && msg.burnAfter > 0) {
      bubble.setBurnTimer(msg.burnAfter, () => {
        this.burnMessage(bubble)
      })
    }

    // 线索消息
    if (msg.isClue && msg.clueId) {
      bubble.setInteractive()
      bubble.on('pointerdown', () => {
        const desktopScene = this.scene as any
        desktopScene.discoverClue(msg.clueId)
        bubble.markAsDiscovered()
      })
    }

    this.messageContainer.add(bubble)
    this.messages.push(bubble)

    // 滚动到最新消息
    this.scrollToBottom()

    this.dialogueStep++

    // 检查下一条消息
    const nextMsg = this.currentDialogue.messages[this.dialogueStep]

    if (nextMsg) {
      if (nextMsg.type === 'npc') {
        // NPC消息自动继续
        this.scene.time.delayedCall(msg.nextDelay || 1000, () => {
          this.showNextMessage()
        })
      } else if (nextMsg.type === 'choice') {
        // 选择消息等待玩家输入
        this.showNextMessage()
      }
    } else {
      // 对话结束
      this.onDialogueComplete()
    }
  }

  private onDialogueComplete(): void {
    // 触发对话完成事件
    this.scene.events.emit('dialogue-complete', this.windowId)
  }

  private burnMessage(bubble: MessageBubble): void {
    bubble.burn()
    // 阅后即焚提示
    const burnText = this.scene.add
      .text(200, 300, '🔥 消息已焚毁', {
        fontSize: '18px',
        color: '#ff6b35',
      })
      .setOrigin(0.5)

    this.scene.tweens.add({
      targets: burnText,
      alpha: 0,
      duration: 2000,
      onComplete: () => burnText.destroy(),
    })
  }

  private scrollToBottom(): void {
    const totalHeight = this.messages.length * 80
    if (totalHeight > 360) {
      this.scrollY = -(totalHeight - 360)
      this.messageContainer.setY(60 + this.scrollY)
    }
  }

  addPlayerMessage(content: string): void {
    const bubble = new MessageBubble(
      this.scene,
      180,
      this.messages.length * 80 + 10,
      content,
      false,
      0,
      false
    )
    this.messageContainer.add(bubble)
    this.messages.push(bubble)
    this.scrollToBottom()

    // 延迟显示NPC回复
    this.scene.time.delayedCall(500, () => {
      this.showNextMessage()
    })
  }
}
