import Phaser from 'phaser'
import { PuzzleSystem } from '../systems/PuzzleSystem'

export class PuzzlePanel extends Phaser.GameObjects.Container {
  private puzzleSystem: PuzzleSystem
  private currentPuzzleId: string | null = null
  private inputText: Phaser.GameObjects.Text | null = null
  private feedbackText: Phaser.GameObjects.Text | null = null
  private discoveredClues: Set<string> = new Set()
  private panelWidth: number
  private panelHeight: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number = 400,
    height: number = 300
  ) {
    super(scene, x, y)
    this.panelWidth = width
    this.panelHeight = height
    this.puzzleSystem = new PuzzleSystem()
    this.createPanel()
    scene.add.existing(this)

    // 监听解谜成功
    this.puzzleSystem.on('puzzle-solved', (puzzleId: string) => {
      this.onPuzzleSolved(puzzleId)
    })
  }

  private createPanel(): void {
    // 背景
    const bg = this.scene.add.graphics()
    bg.fillStyle(0x1a1a2e, 0.98)
    bg.fillRoundedRect(0, 0, this.panelWidth, this.panelHeight, 12)
    bg.lineStyle(2, 0xffd700)
    bg.strokeRoundedRect(0, 0, this.panelWidth, this.panelHeight, 12)
    this.add(bg)

    // 标题
    const title = this.scene.add
      .text(this.panelWidth / 2, 15, '🧩 谜题挑战', {
        fontSize: '20px',
        color: '#ffd700',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5, 0)
    this.add(title)

    // 关闭按钮
    const closeBtn = this.scene.add
      .text(this.panelWidth - 30, 15, '✕', {
        fontSize: '20px',
        color: '#888888',
      })
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
    this.add(closeBtn)

    // 初始内容
    this.showPuzzleList()
  }

  private showPuzzleList(): void {
    this.clearContent()

    const availablePuzzles = this.puzzleSystem.getAvailablePuzzles(this.discoveredClues)

    if (availablePuzzles.length === 0) {
      const msg = this.scene.add
        .text(this.panelWidth / 2, 150, '暂无可解谜题\n继续收集线索后重试', {
          fontSize: '16px',
          color: '#888888',
          align: 'center',
        })
        .setOrigin(0.5)
      this.add(msg)
      return
    }

    availablePuzzles.forEach((puzzle, index) => {
      const y = 60 + index * 70
      const isSolved = this.puzzleSystem.isSolved(puzzle.id)

      // 谜题项背景
      const bg = this.scene.add.graphics()
      bg.fillStyle(isSolved ? 0x2d5a3d : 0x2d3748, 0.8)
      bg.fillRoundedRect(20, y, this.panelWidth - 40, 60, 8)
      this.add(bg)

      // 状态图标
      const statusIcon = this.scene.add.text(35, y + 15, isSolved ? '✅' : '🧩', {
        fontSize: '24px',
      })
      this.add(statusIcon)

      // 谜题名称
      const name = this.scene.add.text(70, y + 10, puzzle.name, {
        fontSize: '16px',
        color: isSolved ? '#4ade80' : '#e2e8f0',
        fontFamily: 'sans-serif',
      })
      this.add(name)

      // 描述
      const desc = this.scene.add.text(70, y + 32, puzzle.description, {
        fontSize: '11px',
        color: '#888888',
        wordWrap: { width: this.panelWidth - 100 },
      })
      this.add(desc)

      // 点击区域
      if (!isSolved) {
        const hitArea = this.scene.add
          .rectangle(this.panelWidth / 2, y + 30, this.panelWidth - 40, 60, 0x000000, 0)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => this.showPuzzleDetail(puzzle.id))
        this.add(hitArea)
      }
    })
  }

  private showPuzzleDetail(puzzleId: string): void {
    this.currentPuzzleId = puzzleId
    const puzzle = this.puzzleSystem.getPuzzle(puzzleId)
    if (!puzzle) return

    this.clearContent()

    // 返回按钮
    const backBtn = this.scene.add
      .text(20, 15, '← 返回', {
        fontSize: '14px',
        color: '#888888',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showPuzzleList())
    this.add(backBtn)

    // 谜题名称
    const name = this.scene.add
      .text(this.panelWidth / 2, 50, puzzle.name, {
        fontSize: '18px',
        color: '#ffd700',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)
    this.add(name)

    // 描述
    const desc = this.scene.add
      .text(this.panelWidth / 2, 80, puzzle.description, {
        fontSize: '13px',
        color: '#e2e8f0',
        align: 'center',
        wordWrap: { width: this.panelWidth - 40 },
      })
      .setOrigin(0.5, 0)
    this.add(desc)

    // 输入框背景
    const inputBg = this.scene.add.graphics()
    inputBg.fillStyle(0x0f0f23, 1)
    inputBg.fillRoundedRect(50, 140, this.panelWidth - 100, 40, 6)
    inputBg.lineStyle(2, 0x4a5568)
    inputBg.strokeRoundedRect(50, 140, this.panelWidth - 100, 40, 6)
    this.add(inputBg)

    // 输入提示
    this.inputText = this.scene.add
      .text(this.panelWidth / 2, 160, '点击输入答案...', {
        fontSize: '14px',
        color: '#666666',
      })
      .setOrigin(0.5)
    this.add(this.inputText)

    // 点击输入区域
    const inputArea = this.scene.add
      .rectangle(this.panelWidth / 2, 160, this.panelWidth - 100, 40, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.promptForInput())
    this.add(inputArea)

    // 提交按钮
    const submitBtn = this.createButton(this.panelWidth / 2, 210, '提交答案', () => {
      this.promptForInput()
    })
    this.add(submitBtn)

    // 提示按钮
    const hintBtn = this.createButton(
      this.panelWidth / 2,
      250,
      '💡 获取提示',
      () => {
        this.showHint(puzzleId)
      },
      0x4a5568
    )
    this.add(hintBtn)

    // 反馈文字
    this.feedbackText = this.scene.add
      .text(this.panelWidth / 2, 290, '', {
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
    this.add(this.feedbackText)
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    color: number = 0x075e54
  ): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y)

    const bg = this.scene.add.graphics()
    bg.fillStyle(color, 1)
    bg.fillRoundedRect(-60, -15, 120, 30, 6)
    container.add(bg)

    const label = this.scene.add
      .text(0, 0, text, {
        fontSize: '14px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
    container.add(label)

    const hitArea = this.scene.add
      .rectangle(0, 0, 120, 30, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
      .on('pointerover', () => {
        bg.clear()
        bg.fillStyle(color + 0x111111, 1)
        bg.fillRoundedRect(-60, -15, 120, 30, 6)
      })
      .on('pointerout', () => {
        bg.clear()
        bg.fillStyle(color, 1)
        bg.fillRoundedRect(-60, -15, 120, 30, 6)
      })
      .on('pointerdown', onClick)
    container.add(hitArea)

    return container
  }

  private promptForInput(): void {
    if (!this.currentPuzzleId) return

    const answer = prompt('请输入你的答案：') || ''
    if (!answer.trim()) return

    this.checkAnswer(answer)
  }

  private checkAnswer(answer: string): void {
    if (!this.currentPuzzleId) return

    const isCorrect = this.puzzleSystem.attemptSolution(this.currentPuzzleId, answer)

    if (isCorrect) {
      this.showFeedback('🎉 答案正确！', '#4ade80')
    } else {
      this.showFeedback('❌ 答案错误，请重试', '#f87171')
    }
  }

  private showFeedback(message: string, color: string): void {
    if (this.feedbackText) {
      this.feedbackText.setText(message)
      this.feedbackText.setColor(color)

      this.scene.tweens.add({
        targets: this.feedbackText,
        alpha: { from: 0, to: 1 },
        duration: 300,
      })
    }
  }

  private showHint(puzzleId: string): void {
    const hint = this.puzzleSystem.getHint(puzzleId)
    alert(`💡 提示：\n${hint}`)
  }

  private onPuzzleSolved(puzzleId: string): void {
    this.scene.events.emit('puzzle-solved', puzzleId)

    // 显示成功动画
    const successText = this.scene.add
      .text(this.panelWidth / 2, this.panelHeight / 2, '🎉 谜题解开！', {
        fontSize: '28px',
        color: '#4ade80',
      })
      .setOrigin(0.5)
    this.add(successText)

    this.scene.tweens.add({
      targets: successText,
      scale: { from: 0.5, to: 1.2 },
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      onComplete: () => {
        successText.destroy()
        this.showPuzzleList()
      },
    })
  }

  private clearContent(): void {
    // 保留背景和标题，移除其他元素
    const toRemove = this.list.filter((_child, index) => index > 2)
    toRemove.forEach((c) => c.destroy())
  }

  updateDiscoveredClues(clues: Set<string>): void {
    this.discoveredClues = clues
    if (this.visible) {
      this.showPuzzleList()
    }
  }

  show(): void {
    this.setVisible(true)
    this.showPuzzleList()
  }

  hide(): void {
    this.setVisible(false)
  }

  getProgress(): { total: number; solved: number } {
    return this.puzzleSystem.getProgress()
  }
}
