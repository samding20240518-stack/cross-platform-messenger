import Phaser from 'phaser'

export interface Puzzle {
  id: string
  name: string
  description: string
  requiredClues: string[]
  checkSolution: (input: string) => boolean
  hint: string
}

export class PuzzleSystem extends Phaser.Events.EventEmitter {
  private puzzles: Map<string, Puzzle> = new Map()
  private solvedPuzzles: Set<string> = new Set()

  constructor() {
    super()
    this.initializePuzzles()
  }

  private initializePuzzles(): void {
    // 谜题1: IP地址拼图
    this.puzzles.set('ip-puzzle', {
      id: 'ip-puzzle',
      name: 'IP地址重构',
      description: '将从WhatsApp和Telegram获得的IP片段组合成完整地址',
      requiredClues: ['ip-part1', 'ip-part2'],
      checkSolution: (input: string) => {
        // 接受 192.168.1.100 或类似格式
        return input.includes('192.168') && input.includes('100')
      },
      hint: 'WhatsApp给了前半，Telegram给了后半，组合起来是 192.168.1.100'
    })

    // 谜题2: 凯撒密码
    this.puzzles.set('cipher-puzzle', {
      id: 'cipher-puzzle',
      name: '凯撒密码破解',
      description: '黑客X留下的加密信息：dwwdfn dw gawn',
      requiredClues: ['cipher-key'],
      checkSolution: (input: string) => {
        const normalized = input.toLowerCase().trim()
        return normalized === 'attack at dawn' || normalized === 'attack'
      },
      hint: '每个字母向前移动3位，d→a, w→t...'
    })

    // 谜题3: 嫌疑人识别
    this.puzzles.set('identify-suspect', {
      id: 'identify-suspect',
      name: '锁定嫌疑人',
      description: '根据收集的线索，输入嫌疑人代号',
      requiredClues: ['suspect-name', 'time-stamp', 'location'],
      checkSolution: (input: string) => {
        return input.toLowerCase().includes('phantom')
      },
      hint: 'Discord上的那个人叫自己什么？'
    })
  }

  getPuzzle(id: string): Puzzle | undefined {
    return this.puzzles.get(id)
  }

  canAttempt(puzzleId: string, discoveredClues: Set<string>): boolean {
    const puzzle = this.puzzles.get(puzzleId)
    if (!puzzle) return false

    return puzzle.requiredClues.every(clue => discoveredClues.has(clue))
  }

  attemptSolution(puzzleId: string, input: string): boolean {
    const puzzle = this.puzzles.get(puzzleId)
    if (!puzzle) return false

    const isCorrect = puzzle.checkSolution(input)
    
    if (isCorrect && !this.solvedPuzzles.has(puzzleId)) {
      this.solvedPuzzles.add(puzzleId)
      this.emit('puzzle-solved', puzzleId)
    }

    return isCorrect
  }

  isSolved(puzzleId: string): boolean {
    return this.solvedPuzzles.has(puzzleId)
  }

  getAvailablePuzzles(discoveredClues: Set<string>): Puzzle[] {
    return Array.from(this.puzzles.values()).filter(puzzle => {
      return this.canAttempt(puzzle.id, discoveredClues)
    })
  }

  getHint(puzzleId: string): string {
    const puzzle = this.puzzles.get(puzzleId)
    return puzzle?.hint || '没有提示可用'
  }

  getProgress(): { total: number; solved: number } {
    return {
      total: this.puzzles.size,
      solved: this.solvedPuzzles.size
    }
  }

  reset(): void {
    this.solvedPuzzles.clear()
  }
}
