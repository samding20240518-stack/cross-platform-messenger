import Phaser from 'phaser'
import { AchievementSystem } from '../systems/AchievementSystem'
import { Achievement } from '../systems/AchievementSystem'

export class AchievementPanel extends Phaser.GameObjects.Container {
  private achievementSystem: AchievementSystem
  private listContainer!: Phaser.GameObjects.Container
  private panelWidth: number
  private panelHeight: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    achievementSystem: AchievementSystem,
    width: number = 400,
    height: number = 500
  ) {
    super(scene, x, y)
    this.panelWidth = width
    this.panelHeight = height
    this.achievementSystem = achievementSystem
    this.createPanel()
    scene.add.existing(this)
    this.setVisible(false)

    // 监听成就解锁
    this.achievementSystem.on('achievement-unlocked', (achievement: Achievement) => {
      this.showUnlockNotification(achievement)
      this.refreshList()
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
      .text(this.panelWidth / 2, 20, '🏆 成就系统', {
        fontSize: '24px',
        color: '#ffd700',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)
    this.add(title)

    // 进度
    const progress = this.achievementSystem.getUnlockedCount()
    const total = this.achievementSystem.getTotalCount()
    const progressText = this.scene.add
      .text(this.panelWidth / 2, 55, `进度: ${progress}/${total}`, {
        fontSize: '14px',
        color: '#888888',
      })
      .setOrigin(0.5)
    this.add(progressText)

    // 列表容器
    this.listContainer = this.scene.add.container(20, 90)
    this.add(this.listContainer)

    // 关闭按钮
    const closeBtn = this.scene.add
      .text(this.panelWidth - 30, 20, '✕', {
        fontSize: '20px',
        color: '#888888',
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.hide())
    this.add(closeBtn)

    this.refreshList()
  }

  private refreshList(): void {
    // 清除旧列表
    this.listContainer.removeAll(true)

    const achievements = this.achievementSystem.getAllAchievements()

    achievements.forEach((achievement, index) => {
      const y = index * 70

      // 背景
      const bg = this.scene.add.graphics()
      bg.fillStyle(achievement.unlocked ? 0x2d5a3d : 0x2d3748, 0.8)
      bg.fillRoundedRect(0, y, this.panelWidth - 40, 60, 8)
      this.listContainer.add(bg)

      // 图标
      const icon = this.scene.add.text(15, y + 10, achievement.unlocked ? achievement.icon : '🔒', {
        fontSize: '28px',
      })
      this.listContainer.add(icon)

      // 名称
      const name = this.scene.add.text(60, y + 8, achievement.name, {
        fontSize: '16px',
        color: achievement.unlocked ? '#ffd700' : '#666666',
        fontFamily: 'sans-serif',
      })
      this.listContainer.add(name)

      // 描述
      const desc = this.scene.add.text(
        60,
        y + 32,
        achievement.unlocked ? achievement.description : '???',
        {
          fontSize: '11px',
          color: achievement.unlocked ? '#aaaaaa' : '#444444',
        }
      )
      this.listContainer.add(desc)
    })
  }

  private showUnlockNotification(achievement: Achievement): void {
    const notif = this.scene.add.container(640, 100)

    // 背景
    const bg = this.scene.add.graphics()
    bg.fillStyle(0x2d5a3d, 0.95)
    bg.fillRoundedRect(-200, -40, 400, 80, 12)
    bg.lineStyle(2, 0x4ade80)
    bg.strokeRoundedRect(-200, -40, 400, 80, 12)
    notif.add(bg)

    // 图标
    const icon = this.scene.add
      .text(-170, 0, achievement.icon, {
        fontSize: '36px',
      })
      .setOrigin(0, 0.5)
    notif.add(icon)

    // 标题
    const title = this.scene.add
      .text(0, -10, '成就解锁！', {
        fontSize: '14px',
        color: '#4ade80',
      })
      .setOrigin(0.5)
    notif.add(title)

    // 名称
    const name = this.scene.add
      .text(0, 15, achievement.name, {
        fontSize: '20px',
        color: '#ffd700',
        fontFamily: 'sans-serif',
      })
      .setOrigin(0.5)
    notif.add(name)

    this.scene.add.existing(notif)
    notif.setDepth(1000)

    // 动画
    this.scene.tweens.add({
      targets: notif,
      scale: { from: 0.5, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 400,
      ease: 'Back.out',
    })

    // 自动消失
    this.scene.time.delayedCall(3000, () => {
      this.scene.tweens.add({
        targets: notif,
        alpha: 0,
        y: 50,
        duration: 500,
        onComplete: () => notif.destroy(),
      })
    })
  }

  show(): void {
    this.refreshList()
    this.setVisible(true)
  }

  hide(): void {
    this.setVisible(false)
  }
}
