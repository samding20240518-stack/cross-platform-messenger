import Phaser from 'phaser'

export class MessageBubble extends Phaser.GameObjects.Container {
  private bg!: Phaser.GameObjects.Graphics
  private textObj!: Phaser.GameObjects.Text
  private burnIcon: Phaser.GameObjects.Image | null = null
  private clueMarker: Phaser.GameObjects.Image | null = null
  private isBurned: boolean = false
  private isDiscovered: boolean = false
  private isReceivedFlag: boolean
  private burnTime: number
  private isClueFlag: boolean

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    content: string,
    isReceived: boolean,
    burnTime: number,
    isClue: boolean
  ) {
    super(scene, x, y)
    this.isReceivedFlag = isReceived
    this.burnTime = burnTime
    this.isClueFlag = isClue
    super(scene, x, y)

    this.createBubble(content)
    scene.add.existing(this)

    // 如果是线索，添加交互
    if (isClue) {
      this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 280, 60), Phaser.Geom.Rectangle.Contains)
    }
  }

  private createBubble(content: string): void {
    const maxWidth = 280
    const padding = 12

    // 先创建文字来计算尺寸
    this.textObj = this.scene.add.text(padding, padding, content, {
      fontSize: '14px',
      color: this.isReceivedFlag ? '#ffffff' : '#e2e8f0',
      fontFamily: 'sans-serif',
      wordWrap: { width: maxWidth - padding * 2 },
    })

    const textWidth = this.textObj.width
    const textHeight = this.textObj.height
    const bubbleWidth = textWidth + padding * 2
    const bubbleHeight = textHeight + padding * 2

    // 创建气泡背景
    this.bg = this.scene.add.graphics()
    this.bg.fillStyle(this.isReceivedFlag ? 0x2d3748 : 0x075e54, 1)
    this.bg.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 12)
    this.add(this.bg)
    this.add(this.textObj)

    // 阅后即焚标记
    if (this.burnTime > 0 && this.burnIcon) {
      this.burnIcon = this.scene.add.image(bubbleWidth - 16, 16, 'burn-icon')
      this.burnIcon.setScale(0.5)
      this.add(this.burnIcon)

      // 倒计时文字
      const timerText = this.scene.add.text(bubbleWidth - 30, 8, `${this.burnTime}s`, {
        fontSize: '10px',
        color: '#ff6b35',
      })
      this.add(timerText)
    }

    // 线索标记
    if (this.isClueFlag) {
      this.clueMarker = this.scene.add.image(-12, bubbleHeight / 2, 'clue-marker')
      this.clueMarker.setScale(0.6)
      this.add(this.clueMarker)

      // 脉冲动画
      this.scene.tweens.add({
        targets: this.clueMarker,
        scale: 0.8,
        duration: 500,
        yoyo: true,
        repeat: -1,
      })
    }
  }

  setBurnTimer(seconds: number, onBurn: () => void): void {
    if (this.burnIcon) {
      // 播放阅后即焚警告音效
      const audioManager = (this.scene as any).audioManager
      if (audioManager) {
        audioManager.playGameSound('burn-warning')
      }
      
      // 闪烁动画
      this.scene.tweens.add({
        targets: this.burnIcon,
        alpha: 0.3,
        duration: 200,
        yoyo: true,
        repeat: seconds * 2 - 1,
        onComplete: () => {
          if (!this.isDiscovered) {
            onBurn()
          }
        },
      })
    }
  }

  burn(): void {
    if (this.isBurned) return
    this.isBurned = true

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 500,
      onComplete: () => {
        this.setVisible(false)
      },
    })
  }

  markAsDiscovered(): void {
    if (this.isDiscovered) return
    this.isDiscovered = true

    // 播放线索发现音效（符合工程规范）
    const audioManager = (this.scene as any).audioManager
    if (audioManager) {
      audioManager.playClue()
    }

    // 变灰表示已收集
    this.bg.clear()
    this.bg.fillStyle(0x4a5568, 1)
    this.bg.fillRoundedRect(0, 0, this.textObj.width + 24, this.textObj.height + 24, 12)

    // 停止线索标记动画
    if (this.clueMarker) {
      this.scene.tweens.killTweensOf(this.clueMarker)
      this.clueMarker.setScale(0.6)
      this.clueMarker.setAlpha(0.5)
    }

    // 停止阅后即焚
    if (this.burnIcon) {
      this.scene.tweens.killTweensOf(this.burnIcon)
      this.burnIcon.setAlpha(0.3)
    }

    // 发现特效
    const flash = this.scene.add.graphics()
    flash.fillStyle(0xffd700, 0.5)
    flash.fillRoundedRect(-10, -10, this.textObj.width + 44, this.textObj.height + 44, 16)
    this.add(flash)

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      onComplete: () => flash.destroy(),
    })
  }

  isClueMessage(): boolean {
    return this.isClueFlag
  }
}
