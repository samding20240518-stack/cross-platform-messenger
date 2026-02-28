import Phaser from 'phaser'

export class CluePanel extends Phaser.GameObjects.Container {
  private clues: Set<string> = new Set()
  private clueList!: Phaser.GameObjects.Container

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)

    this.createPanel()
    scene.add.existing(this)
  }

  private createPanel(): void {
    // 面板背景
    const bg = this.scene.add.graphics()
    bg.fillStyle(0x16213e, 0.95)
    bg.fillRoundedRect(0, 0, 350, 560, 12)
    bg.lineStyle(2, 0x2d3748)
    bg.strokeRoundedRect(0, 0, 350, 560, 12)
    this.add(bg)

    // 标题
    const title = this.scene.add.text(175, 20, '📋 侦探笔记本', {
      fontSize: '20px',
      color: '#ffd700',
      fontFamily: 'sans-serif'
    }).setOrigin(0.5)
    this.add(title)

    // 线索列表容器
    this.clueList = this.scene.add.container(20, 60)
    this.add(this.clueList)

    // 空状态提示
    const emptyText = this.scene.add.text(175, 280, '暂无线索\n与NPC对话收集线索', {
      fontSize: '14px',
      color: '#666666',
      align: 'center'
    }).setOrigin(0.5)
    ;(emptyText as any).setName('empty-hint')
    this.add(emptyText)
  }

  addClue(clueId: string): void {
    if (this.clues.has(clueId)) return

    this.clues.add(clueId)

    // 隐藏空状态
    const emptyHint = this.getByName('empty-hint') as Phaser.GameObjects.Text | null
    if (emptyHint) {
      emptyHint.setVisible(false)
    }

    // 获取线索信息
    const clueInfo = this.getClueInfo(clueId)

    // 创建线索条目
    const y = (this.clues.size - 1) * 70
    const item = this.scene.add.container(0, y)

    // 线索背景
    const itemBg = this.scene.add.graphics()
    itemBg.fillStyle(0x2d3748, 0.8)
    itemBg.fillRoundedRect(0, 0, 310, 60, 8)
    item.add(itemBg)

    // 线索图标
    const icon = this.scene.add.text(15, 15, clueInfo.icon, {
      fontSize: '24px'
    })
    item.add(icon)

    // 线索标题
    const title = this.scene.add.text(50, 10, clueInfo.title, {
      fontSize: '14px',
      color: '#ffd700',
      fontFamily: 'sans-serif'
    })
    item.add(title)

    // 线索描述
    const desc = this.scene.add.text(50, 32, clueInfo.description, {
      fontSize: '11px',
      color: '#a0aec0',
      fontFamily: 'sans-serif'
    })
    item.add(desc)

    this.clueList.add(item)

    // 入场动画
    item.setAlpha(0)
    item.setX(-20)
    this.scene.tweens.add({
      targets: item,
      alpha: 1,
      x: 0,
      duration: 400,
      ease: 'Back.out'
    })

    // 更新其他线索位置
    this.updateCluePositions()
  }

  private updateCluePositions(): void {
    const clues = this.clueList.list as Phaser.GameObjects.Container[]
    clues.forEach((clue, index) => {
      const targetY = index * 70
      if (clue.y !== targetY) {
        this.scene.tweens.add({
          targets: clue,
          y: targetY,
          duration: 300,
          ease: 'Power2'
        })
      }
    })
  }

  private getClueInfo(clueId: string): { icon: string; title: string; description: string } {
    const clueDatabase: Record<string, { icon: string; title: string; description: string }> = {
      'ip-part1': {
        icon: '🌐',
        title: 'IP地址 (前半)',
        description: '192.168.xxx.xxx'
      },
      'ip-part2': {
        icon: '🌐',
        title: 'IP地址 (后半)',
        description: 'xxx.xxx.1.100'
      },
      'cipher-key': {
        icon: '🔑',
        title: '解密密钥',
        description: 'Caesar +3'
      },
      'suspect-name': {
        icon: '👤',
        title: '嫌疑人代号',
        description: 'Phantom'
      },
      'time-stamp': {
        icon: '⏰',
        title: '案发时间',
        description: '2024-02-28 03:00'
      },
      'location': {
        icon: '📍',
        title: '服务器位置',
        description: '新加坡数据中心'
      }
    }

    return clueDatabase[clueId] || {
      icon: '❓',
      title: '未知线索',
      description: '需要进一步调查'
    }
  }

  hasClue(clueId: string): boolean {
    return this.clues.has(clueId)
  }

  getClueCount(): number {
    return this.clues.size
  }
}
