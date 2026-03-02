import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // 创建程序生成资源（无需外部图片）
    this.createUIAssets()
  }

  create(): void {
    this.scene.start('IntroScene')
  }

  private createUIAssets(): void {
    // 创建WhatsApp绿色圆角矩形
    const whatsappGraphics = this.make.graphics({ x: 0, y: 0 })
    whatsappGraphics.fillStyle(0x25d366, 1)
    whatsappGraphics.fillRoundedRect(0, 0, 64, 64, 12)
    whatsappGraphics.generateTexture('whatsapp-icon', 64, 64)

    // 创建Telegram蓝色圆角矩形
    const telegramGraphics = this.make.graphics({ x: 0, y: 0 })
    telegramGraphics.fillStyle(0x0088cc, 1)
    telegramGraphics.fillRoundedRect(0, 0, 64, 64, 12)
    telegramGraphics.generateTexture('telegram-icon', 64, 64)

    // 创建Discord紫色圆角矩形
    const discordGraphics = this.make.graphics({ x: 0, y: 0 })
    discordGraphics.fillStyle(0x5865f2, 1)
    discordGraphics.fillRoundedRect(0, 0, 64, 64, 12)
    discordGraphics.generateTexture('discord-icon', 64, 64)

    // 创建邮件红色圆角矩形
    const emailGraphics = this.make.graphics({ x: 0, y: 0 })
    emailGraphics.fillStyle(0xea4335, 1)
    emailGraphics.fillRoundedRect(0, 0, 64, 64, 12)
    emailGraphics.generateTexture('email-icon', 64, 64)

    // 创建窗口背景
    const windowGraphics = this.make.graphics({ x: 0, y: 0 })
    windowGraphics.fillStyle(0x16213e, 1)
    windowGraphics.fillRoundedRect(0, 0, 400, 500, 8)
    windowGraphics.lineStyle(2, 0x2d3748, 1)
    windowGraphics.strokeRoundedRect(0, 0, 400, 500, 8)
    windowGraphics.generateTexture('window-bg', 400, 500)

    // 创建消息气泡 - 接收方
    const receivedBubble = this.make.graphics({ x: 0, y: 0 })
    receivedBubble.fillStyle(0x2d3748, 1)
    receivedBubble.fillRoundedRect(0, 0, 200, 60, 12)
    receivedBubble.generateTexture('msg-received', 200, 60)

    // 创建消息气泡 - 发送方
    const sentBubble = this.make.graphics({ x: 0, y: 0 })
    sentBubble.fillStyle(0x075e54, 1)
    sentBubble.fillRoundedRect(0, 0, 200, 60, 12)
    sentBubble.generateTexture('msg-sent', 200, 60)

    // 创建阅后即焚图标
    const burnGraphics = this.make.graphics({ x: 0, y: 0 })
    burnGraphics.fillStyle(0xff6b35, 1)
    burnGraphics.fillCircle(16, 16, 16)
    burnGraphics.generateTexture('burn-icon', 32, 32)

    // 创建线索标记
    const clueGraphics = this.make.graphics({ x: 0, y: 0 })
    clueGraphics.fillStyle(0xffd700, 1)
    clueGraphics.fillCircle(12, 12, 12)
    clueGraphics.generateTexture('clue-marker', 24, 24)
  }
}
