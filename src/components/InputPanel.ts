import Phaser from 'phaser'

export class InputPanel extends Phaser.GameObjects.Container {
  private choices: Phaser.GameObjects.Text[] = []
  private onSelect!: (index: number) => void
  private panelWidth: number
  private panelHeight: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number = 360,
    height: number = 100
  ) {
    super(scene, x, y)
    this.panelWidth = width
    this.panelHeight = height
    super(scene, x, y)
    this.createPanel()
    scene.add.existing(this)
  }

  private createPanel(): void {
    // 背景
    const bg = this.scene.add.graphics()
    bg.fillStyle(0x2d3748, 0.95)
    bg.fillRoundedRect(0, 0, this.panelWidth, this.panelHeight, 8)
    bg.lineStyle(2, 0x4a5568)
    bg.strokeRoundedRect(0, 0, this.panelWidth, this.panelHeight, 8)
    this.add(bg)

    // 标题
    const title = this.scene.add
      .text(this.panelWidth / 2, 10, '💬 选择回复', {
        fontSize: '12px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)
    this.add(title)
  }

  showChoices(options: string[], onSelect: (index: number) => void): void {
    this.onSelect = onSelect
    this.clearChoices()

    const startY = 30
    const itemHeight = 35

    options.forEach((option, index) => {
      const y = startY + index * itemHeight

      // 选项背景
      const bg = this.scene.add.graphics()
      bg.fillStyle(0x1a202c, 0.8)
      bg.fillRoundedRect(10, y, this.panelWidth - 20, 30, 6)
      this.add(bg)

      // 选项文字
      const text = this.scene.add.text(20, y + 6, option, {
        fontSize: '13px',
        color: '#e2e8f0',
        fontFamily: 'sans-serif',
        wordWrap: { width: this.panelWidth - 40 },
      })
      this.add(text)
      this.choices.push(text)

      // 点击区域
      const hitArea = this.scene.add
        .rectangle(this.panelWidth / 2, y + 15, this.panelWidth - 20, 30, 0x000000, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
          bg.clear()
          bg.fillStyle(0x4a5568, 0.8)
          bg.fillRoundedRect(10, y, this.panelWidth - 20, 30, 6)
          text.setColor('#ffffff')
        })
        .on('pointerout', () => {
          bg.clear()
          bg.fillStyle(0x1a202c, 0.8)
          bg.fillRoundedRect(10, y, this.panelWidth - 20, 30, 6)
          text.setColor('#e2e8f0')
        })
        .on('pointerdown', () => {
          this.selectChoice(index)
        })
      this.add(hitArea)
    })

    this.setVisible(true)
  }

  private selectChoice(index: number): void {
    this.setVisible(false)
    if (this.onSelect) {
      this.onSelect(index)
    }
  }

  private clearChoices(): void {
    // 清除旧的选项（保留前两个子元素：背景和标题）
    while (this.list.length > 2) {
      const child = this.list[2]
      this.remove(child, true)
    }
    this.choices = []
  }

  hide(): void {
    this.setVisible(false)
  }

  show(): void {
    this.setVisible(true)
  }
}
