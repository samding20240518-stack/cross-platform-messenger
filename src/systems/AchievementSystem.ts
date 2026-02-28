import Phaser from 'phaser'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  condition: () => boolean
}

export class AchievementSystem extends Phaser.Events.EventEmitter {
  private achievements: Map<string, Achievement> = new Map()
  private gameState: any

  constructor(gameState: any) {
    super()
    this.gameState = gameState
    this.initializeAchievements()
  }

  private initializeAchievements(): void {
    this.achievements.set('first-clue', {
      id: 'first-clue',
      name: '初出茅庐',
      description: '收集第一条线索',
      icon: '🔍',
      unlocked: false,
      condition: () => this.gameState.getDiscoveredClues() >= 1
    })

    this.achievements.set('half-clues', {
      id: 'half-clues',
      name: '侦探新手',
      description: '收集一半线索',
      icon: '📋',
      unlocked: false,
      condition: () => this.gameState.getDiscoveredClues() >= 3
    })

    this.achievements.set('all-clues', {
      id: 'all-clues',
      name: '线索大师',
      description: '收集所有线索',
      icon: '🏆',
      unlocked: false,
      condition: () => this.gameState.getDiscoveredClues() >= 6
    })

    this.achievements.set('speed-reader', {
      id: 'speed-reader',
      name: '速读专家',
      description: '在阅后即焚消失前收集线索',
      icon: '⚡',
      unlocked: false,
      condition: () => false // 需要特殊追踪
    })

    this.achievements.set('puzzle-master', {
      id: 'puzzle-master',
      name: '解谜大师',
      description: '解开所有谜题',
      icon: '🧩',
      unlocked: false,
      condition: () => false // 需要谜题系统配合
    })

    this.achievements.set('completionist', {
      id: 'completionist',
      name: '完美通关',
      description: '收集所有线索并解开所有谜题',
      icon: '👑',
      unlocked: false,
      condition: () => this.gameState.getDiscoveredClues() >= 6
    })
  }

  checkAchievements(): string[] {
    const newlyUnlocked: string[] = []

    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition()) {
        achievement.unlocked = true
        newlyUnlocked.push(achievement.id)
        this.emit('achievement-unlocked', achievement)
      }
    })

    return newlyUnlocked
  }

  getAchievement(id: string): Achievement | undefined {
    return this.achievements.get(id)
  }

  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values())
  }

  getUnlockedCount(): number {
    return Array.from(this.achievements.values()).filter(a => a.unlocked).length
  }

  getTotalCount(): number {
    return this.achievements.size
  }

  unlockAchievement(id: string): boolean {
    const achievement = this.achievements.get(id)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      this.emit('achievement-unlocked', achievement)
      return true
    }
    return false
  }

  reset(): void {
    this.achievements.forEach(a => a.unlocked = false)
  }

  // 特殊成就追踪
  trackBurnSaved(): void {
    this.unlockAchievement('speed-reader')
  }
}
