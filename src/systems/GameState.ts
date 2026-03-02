export class GameState {
  private discoveredClues: Set<string> = new Set()
  private currentChapter: string = 'chapter1'
  private gameProgress: number = 0

  // 所有线索定义
  private readonly allClues = [
    'ip-part1',
    'ip-part2',
    'cipher-key',
    'suspect-name',
    'time-stamp',
    'location',
  ]

  constructor() {
    this.loadFromStorage()
  }

  discoverClue(clueId: string): boolean {
    if (this.discoveredClues.has(clueId)) {
      return false
    }

    this.discoveredClues.add(clueId)
    this.saveToStorage()
    return true
  }

  hasClue(clueId: string): boolean {
    return this.discoveredClues.has(clueId)
  }

  getDiscoveredCluesSet(): Set<string> {
    return new Set(this.discoveredClues)
  }

  getDiscoveredClues(): number {
    return this.discoveredClues.size
  }

  getTotalClues(): number {
    return this.allClues.length
  }

  setChapter(chapter: string): void {
    this.currentChapter = chapter
    this.saveToStorage()
  }

  getChapter(): string {
    return this.currentChapter
  }

  setProgress(progress: number): void {
    this.gameProgress = progress
    this.saveToStorage()
  }

  getProgress(): number {
    return this.gameProgress
  }

  reset(): void {
    this.discoveredClues.clear()
    this.currentChapter = 'chapter1'
    this.gameProgress = 0
    this.saveToStorage()
  }

  private saveToStorage(): void {
    try {
      const data = {
        discoveredClues: Array.from(this.discoveredClues),
        currentChapter: this.currentChapter,
        gameProgress: this.gameProgress,
      }
      localStorage.setItem('crossPlatformMessenger', JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save game state')
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('crossPlatformMessenger')
      if (saved) {
        const data = JSON.parse(saved)
        this.discoveredClues = new Set(data.discoveredClues || data.clues || [])
        this.currentChapter = data.currentChapter || data.chapter || 'chapter1'
        this.gameProgress = data.gameProgress || data.progress || 0
      }
    } catch (e) {
      console.warn('Failed to load game state')
    }
  }

  // 检查谜题是否可解
  canSolvePuzzle(puzzleId: string): boolean {
    const puzzleRequirements: Record<string, string[]> = {
      'ip-puzzle': ['ip-part1', 'ip-part2'],
      'cipher-puzzle': ['cipher-key'],
      'identify-suspect': ['suspect-name', 'time-stamp', 'location'],
    }

    const required = puzzleRequirements[puzzleId] || []
    return required.every((clue) => this.discoveredClues.has(clue))
  }
}
