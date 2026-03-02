import Phaser from 'phaser'

export class EffectsManager {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  // 创建星星粒子效果
  createStarExplosion(x: number, y: number): void {
    // 使用简单的圆圈模拟粒子效果
    for (let i = 0; i < 10; i++) {
      const star = this.scene.add.circle(x, y, 4, 0xffd700)

      const angle = (i / 10) * Math.PI * 2
      const speed = Phaser.Math.Between(50, 150)
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed

      this.scene.tweens.add({
        targets: star,
        x: x + vx,
        y: y + vy,
        alpha: 0,
        scale: 0,
        duration: 800,
        onComplete: () => star.destroy(),
      })
    }
  }

  // 屏幕闪烁效果
  flashScreen(color: number = 0xffffff, duration: number = 300): void {
    const flash = this.scene.add.graphics()
    flash.fillStyle(color, 0.5)
    flash.fillRect(0, 0, 1280, 720)
    flash.setDepth(1000)

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: duration,
      onComplete: () => flash.destroy(),
    })
  }

  // 文字打字机效果
  typewriterEffect(
    textObject: Phaser.GameObjects.Text,
    fullText: string,
    speed: number = 50
  ): void {
    let currentIndex = 0
    textObject.setText('')

    const timer = this.scene.time.addEvent({
      delay: speed,
      callback: () => {
        if (currentIndex < fullText.length) {
          textObject.setText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          timer.destroy()
        }
      },
      repeat: fullText.length - 1,
    })
  }

  // 脉冲效果
  pulseEffect(
    target: Phaser.GameObjects.GameObject,
    scale: number = 1.2,
    duration: number = 500
  ): void {
    this.scene.tweens.add({
      targets: target,
      scale: scale,
      duration: duration / 2,
      yoyo: true,
      ease: 'Sine.easeInOut',
    })
  }

  // 震动效果
  shakeCamera(intensity: number = 0.01, duration: number = 300): void {
    this.scene.cameras.main.shake(duration, intensity)
  }

  // 浮动效果
  floatingEffect(
    target: Phaser.GameObjects.GameObject,
    distance: number = 10,
    duration: number = 2000
  ): void {
    this.scene.tweens.add({
      targets: target,
      y: `+=${distance}`,
      duration: duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  // 创建扫描线效果
  createScanline(): void {
    const graphics = this.scene.add.graphics()
    graphics.lineStyle(2, 0x00ff00, 0.3)

    const scanline = this.scene.add.rectangle(640, 0, 1280, 2, 0x00ff00, 0.5)
    scanline.setDepth(100)

    this.scene.tweens.add({
      targets: scanline,
      y: 720,
      duration: 3000,
      repeat: -1,
      ease: 'Linear',
    })
  }

  // 创建黑客风格的背景动画
  createMatrixRain(): void {
    const chars = '0123456789ABCDEF'
    const drops: Phaser.GameObjects.Text[] = []

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(50, 1230)
      const text = this.scene.add.text(
        x,
        Phaser.Math.Between(-100, 720),
        chars[Phaser.Math.Between(0, chars.length - 1)],
        {
          fontSize: '14px',
          color: '#00ff00',
        }
      )
      text.setAlpha(0.3)
      drops.push(text)
    }

    drops.forEach((drop) => {
      this.scene.tweens.add({
        targets: drop,
        y: 800,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          drop.setY(-20)
          drop.setText(chars[Phaser.Math.Between(0, chars.length - 1)])
        },
      })
    })
  }

  // 创建警告闪烁边框
  createWarningBorder(): Phaser.GameObjects.Graphics {
    const border = this.scene.add.graphics()
    border.lineStyle(4, 0xff0000, 0.8)
    border.strokeRect(0, 0, 1280, 720)
    border.setDepth(999)

    this.scene.tweens.add({
      targets: border,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    })

    return border
  }
}
