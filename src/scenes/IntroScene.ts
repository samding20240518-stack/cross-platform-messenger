import Phaser from 'phaser'

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' })
  }

  create(): void {
    this.createBackground()
    this.showIntro()
  }

  private createBackground(): void {
    // 深色背景
    const bg = this.add.graphics()
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a2e, 0x1a1a2e, 1)
    bg.fillRect(0, 0, 1280, 720)

    // 矩阵雨效果
    this.createMatrixEffect()
  }

  private createMatrixEffect(): void {
    const chars = '01'
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, 1280)
      const text = this.add.text(
        x,
        Phaser.Math.Between(-100, 720),
        chars[Phaser.Math.Between(0, 1)],
        {
          fontSize: '14px',
          color: '#00ff00',
        }
      )
      text.setAlpha(0.2)

      this.tweens.add({
        targets: text,
        y: 800,
        duration: Phaser.Math.Between(3000, 8000),
        repeat: -1,
        onRepeat: () => {
          text.setY(-20)
          text.setX(Phaser.Math.Between(0, 1280))
        },
      })
    }
  }

  private showIntro(): void {
    const centerX = 640
    const centerY = 360

    // 标题
    const title = this.add
      .text(centerX, centerY - 100, '跨平台信使', {
        fontSize: '64px',
        color: '#00ff00',
        fontFamily: 'monospace',
        stroke: '#00ff00',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // 副标题
    const subtitle = this.add
      .text(centerX, centerY - 20, 'CROSS-PLATFORM MESSENGER', {
        fontSize: '24px',
        color: '#888888',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // 描述
    const desc = this.add
      .text(
        centerX,
        centerY + 60,
        '你是一名网络安全调查员\n在多个聊天平台间收集线索\n破解神秘的网络犯罪事件',
        {
          fontSize: '18px',
          color: '#aaaaaa',
          align: 'center',
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0)

    // 提示
    const hint = this.add
      .text(centerX, centerY + 200, '点击任意处开始调查', {
        fontSize: '16px',
        color: '#00ff00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // 打字机效果动画
    this.typewriterEffect(title, '跨平台信使', 100, () => {
      this.tweens.add({
        targets: [subtitle, desc],
        alpha: 1,
        duration: 1000,
        onComplete: () => {
          // 闪烁提示
          this.tweens.add({
            targets: hint,
            alpha: { from: 0, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: -1,
          })
        },
      })
    })

    // 点击开始
    this.input.on('pointerdown', () => {
      this.cameras.main.fadeOut(500)
      this.time.delayedCall(500, () => {
        this.scene.start('DesktopScene')
      })
    })
  }

  private typewriterEffect(
    textObject: Phaser.GameObjects.Text,
    fullText: string,
    speed: number,
    onComplete?: () => void
  ): void {
    let currentIndex = 0
    textObject.setText('')
    textObject.setAlpha(1)

    const timer = this.time.addEvent({
      delay: speed,
      callback: () => {
        if (currentIndex < fullText.length) {
          textObject.setText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          timer.destroy()
          onComplete?.()
        }
      },
      repeat: fullText.length - 1,
    })
  }
}
