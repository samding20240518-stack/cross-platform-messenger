// 类型声明文件

declare global {
  interface Window {
    game: Phaser.Game
  }
}

// 游戏配置
export interface GameConfig {
  width: number
  height: number
  backgroundColor: string
}

// 线索数据
export interface ClueData {
  id: string
  title: string
  description: string
  icon: string
  platform: string
  source: string
}

// 谜题数据
export interface PuzzleData {
  id: string
  title: string
  description: string
  requiredClues: string[]
  answer: string
  hint: string
}

// NPC数据
export interface NPCData {
  id: string
  name: string
  platform: string
  avatar: string
  personality: string
}
