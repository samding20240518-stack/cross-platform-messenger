import { GameState } from '../src/systems/GameState'
import { PuzzleSystem } from '../src/systems/PuzzleSystem'
import { AudioManager } from '../src/systems/AudioManager'
import { AchievementSystem } from '../src/systems/AchievementSystem'

describe('GameState', () => {
  let gameState: GameState

  beforeEach(() => {
    gameState = new GameState()
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  // 基础功能测试
  test('should discover new clue', () => {
    const result = gameState.discoverClue('ip-part1')
    expect(result).toBe(true)
    expect(gameState.hasClue('ip-part1')).toBe(true)
  })

  test('should not discover duplicate clue', () => {
    gameState.discoverClue('ip-part1')
    const result = gameState.discoverClue('ip-part1')
    expect(result).toBe(false)
  })

  test('should return correct clue count', () => {
    gameState.discoverClue('clue1')
    gameState.discoverClue('clue2')
    expect(gameState.getDiscoveredClues()).toBe(2)
  })

  test('should return total clues count', () => {
    expect(gameState.getTotalClues()).toBe(6)
  })

  // 边界条件测试
  test('should handle empty clue id', () => {
    const result = gameState.discoverClue('')
    expect(result).toBe(true) // 空字符串也是有效ID
    expect(gameState.hasClue('')).toBe(true)
  })

  test('should handle non-existent clue check', () => {
    expect(gameState.hasClue('non-existent')).toBe(false)
  })

  // 状态管理测试
  test('should change chapter', () => {
    gameState.setChapter('chapter2')
    expect(gameState['currentChapter']).toBe('chapter2')
  })

  test('should save to localStorage', () => {
    gameState.discoverClue('test-clue')
    // 验证已保存到 localStorage
    const saved = localStorage.getItem('crossPlatformMessenger')
    expect(saved).toContain('test-clue')
  })

  test('should load from localStorage', () => {
    // 预先设置 localStorage
    localStorage.setItem('crossPlatformMessenger', JSON.stringify({
      discoveredClues: ['loaded-clue'],
      currentChapter: 'chapter3'
    }))
    
    const newGameState = new GameState()
    expect(newGameState.hasClue('loaded-clue')).toBe(true)
  })

  // 进度计算测试
  test('should calculate progress correctly', () => {
    expect(gameState.getDiscoveredClues()).toBe(0)
    gameState.discoverClue('clue1')
    expect(gameState.getDiscoveredClues()).toBe(1)
    expect(gameState.getTotalClues()).toBe(6)
  })
})

describe('PuzzleSystem', () => {
  let puzzleSystem: PuzzleSystem
  let mockGameState: GameState

  beforeEach(() => {
    mockGameState = new GameState()
    puzzleSystem = new PuzzleSystem(mockGameState)
  })

  // IP地址验证测试
  test('should validate correct IP address format', () => {
    expect(puzzleSystem.validateIPAddress('192.168.1.1')).toBe(true)
    expect(puzzleSystem.validateIPAddress('10.0.0.1')).toBe(true)
    expect(puzzleSystem.validateIPAddress('255.255.255.255')).toBe(true)
  })

  test('should reject invalid IP address format', () => {
    expect(puzzleSystem.validateIPAddress('192.168.1')).toBe(false)
    expect(puzzleSystem.validateIPAddress('192.168.1.1.1')).toBe(false)
    expect(puzzleSystem.validateIPAddress('abc.def.ghi.jkl')).toBe(false)
    expect(puzzleSystem.validateIPAddress('')).toBe(false)
  })

  test('should reject out of range IP octets', () => {
    expect(puzzleSystem.validateIPAddress('256.168.1.1')).toBe(false)
    expect(puzzleSystem.validateIPAddress('192.168.1.256')).toBe(false)
    expect(puzzleSystem.validateIPAddress('-1.168.1.1')).toBe(false)
  })

  // 线索检查测试
  test('should check required clues for puzzle', () => {
    const canSolve = puzzleSystem.canSolvePuzzle('ip-puzzle')
    expect(canSolve).toBe(false)
  })

  test('should allow solving when all clues collected', () => {
    // 收集所有必需线索
    const requiredClues = ['ip-part1', 'ip-part2']
    requiredClues.forEach(clue => mockGameState.discoverClue(clue))
    
    const canSolve = puzzleSystem.canSolvePuzzle('ip-puzzle')
    expect(canSolve).toBe(true)
  })

  // 答案验证测试
  test('should accept correct answer', () => {
    mockGameState.discoverClue('ip-part1')
    mockGameState.discoverClue('ip-part2')
    
    const result = puzzleSystem.solve('ip-puzzle', '192.168.1.100')
    expect(result.success).toBe(true)
  })

  test('should reject incorrect answer', () => {
    mockGameState.discoverClue('ip-part1')
    mockGameState.discoverClue('ip-part2')
    
    const result = puzzleSystem.solve('ip-puzzle', '192.168.1.1')
    expect(result.success).toBe(false)
  })

  test('should provide hint on failure', () => {
    mockGameState.discoverClue('ip-part1')
    
    const result = puzzleSystem.solve('ip-puzzle', 'wrong-answer')
    expect(result.hint).toBeDefined()
    expect(result.hint.length).toBeGreaterThan(0)
  })

  // 边界条件测试
  test('should handle empty answer', () => {
    const result = puzzleSystem.solve('ip-puzzle', '')
    expect(result.success).toBe(false)
  })

  test('should handle puzzle without required clues', () => {
    const result = puzzleSystem.solve('ip-puzzle', '192.168.1.100')
    expect(result.success).toBe(false)
    expect(result.error).toContain('clues')
  })
})

describe('AudioManager', () => {
  let audioManager: AudioManager

  beforeEach(() => {
    audioManager = new AudioManager()
  })

  // 基础功能测试
  test('should be initialized', () => {
    expect(audioManager).toBeDefined()
    expect(audioManager['isMuted']).toBe(false)
  })

  test('should play sound effect without error', () => {
    expect(() => audioManager.playSFX('message')).not.toThrow()
    expect(() => audioManager.playSFX('clue')).not.toThrow()
    expect(() => audioManager.playSFX('puzzle-solve')).not.toThrow()
  })

  // 静音功能测试
  test('should toggle mute state', () => {
    expect(audioManager['isMuted']).toBe(false)
    
    audioManager.toggleMute()
    expect(audioManager['isMuted']).toBe(true)
    
    audioManager.toggleMute()
    expect(audioManager['isMuted']).toBe(false)
  })

  test('should not play sound when muted', () => {
    audioManager.toggleMute()
    // 静音时不应该抛出错误，但也不应该实际播放
    expect(() => audioManager.playSFX('message')).not.toThrow()
  })

  test('should set mute state explicitly', () => {
    audioManager.setMute(true)
    expect(audioManager['isMuted']).toBe(true)
    
    audioManager.setMute(false)
    expect(audioManager['isMuted']).toBe(false)
  })

  // 音量控制测试
  test('should set volume', () => {
    audioManager.setVolume(0.5)
    expect(audioManager['volume']).toBe(0.5)
  })

  test('should clamp volume to valid range', () => {
    audioManager.setVolume(1.5)
    expect(audioManager['volume']).toBe(1.0)
    
    audioManager.setVolume(-0.5)
    expect(audioManager['volume']).toBe(0.0)
  })

  // 边界条件测试
  test('should handle unknown sound effect gracefully', () => {
    expect(() => audioManager.playSFX('unknown-sound')).not.toThrow()
  })

  test('should handle multiple rapid plays', () => {
    expect(() => {
      for (let i = 0; i < 10; i++) {
        audioManager.playSFX('message')
      }
    }).not.toThrow()
  })
})

describe('AchievementSystem', () => {
  let achievementSystem: AchievementSystem
  let mockGameState: GameState

  beforeEach(() => {
    mockGameState = new GameState()
    achievementSystem = new AchievementSystem(mockGameState)
    localStorage.clear()
  })

  // 基础功能测试
  test('should unlock achievement', () => {
    const result = achievementSystem.unlock('first-clue')
    expect(result).toBe(true)
    expect(achievementSystem.hasAchievement('first-clue')).toBe(true)
  })

  test('should not unlock duplicate achievement', () => {
    achievementSystem.unlock('first-clue')
    const result = achievementSystem.unlock('first-clue')
    expect(result).toBe(false)
  })

  // 成就进度测试
  test('should track progress for progress-based achievements', () => {
    achievementSystem.updateProgress('collector', 1)
    expect(achievementSystem.getProgress('collector')).toBe(1)
    
    achievementSystem.updateProgress('collector', 2)
    expect(achievementSystem.getProgress('collector')).toBe(3)
  })

  test('should unlock when progress reaches target', () => {
    // 假设 collector 成就需要收集 5 个线索
    for (let i = 0; i < 5; i++) {
      achievementSystem.updateProgress('collector', 1)
    }
    
    expect(achievementSystem.hasAchievement('collector')).toBe(true)
  })

  // 条件检查测试
  test('should check unlock conditions', () => {
    // 未满足条件时
    expect(achievementSystem.checkCondition('speed-runner')).toBe(false)
    
    // 模拟满足条件
    mockGameState.discoverClue('clue1')
    mockGameState.discoverClue('clue2')
    // 假设 speed-runner 需要收集所有线索
    
    // 这个测试需要根据实际情况调整
  })

  // 持久化测试
  test('should save achievements to storage', () => {
    achievementSystem.unlock('test-achievement')
    
    const saved = localStorage.getItem('crossPlatformMessenger_achievements')
    expect(saved).toContain('test-achievement')
  })

  test('should load achievements from storage', () => {
    localStorage.setItem('crossPlatformMessenger_achievements', JSON.stringify({
      unlocked: ['loaded-achievement'],
      progress: { 'collector': 3 }
    }))
    
    const newSystem = new AchievementSystem(mockGameState)
    expect(newSystem.hasAchievement('loaded-achievement')).toBe(true)
    expect(newSystem.getProgress('collector')).toBe(3)
  })

  // 边界条件测试
  test('should handle invalid achievement id', () => {
    expect(() => achievementSystem.unlock('')).not.toThrow()
    expect(() => achievementSystem.hasAchievement('')).not.toThrow()
  })

  test('should return all unlocked achievements', () => {
    achievementSystem.unlock('achievement1')
    achievementSystem.unlock('achievement2')
    
    const all = achievementSystem.getAllUnlocked()
    expect(all).toContain('achievement1')
    expect(all).toContain('achievement2')
    expect(all).toHaveLength(2)
  })
})

// 集成测试
describe('Integration: GameState + PuzzleSystem', () => {
  let gameState: GameState
  let puzzleSystem: PuzzleSystem

  beforeEach(() => {
    gameState = new GameState()
    puzzleSystem = new PuzzleSystem(gameState)
    localStorage.clear()
  })

  test('should complete full puzzle flow', () => {
    // 1. 开始游戏，没有线索
    expect(puzzleSystem.canSolvePuzzle('main')).toBe(false)
    
    // 2. 收集线索
    gameState.discoverClue('ip-part1')
    gameState.discoverClue('ip-part2')
    
    // 3. 现在可以解谜了
    expect(puzzleSystem.canSolvePuzzle('main')).toBe(true)
    
    // 4. 提交正确答案
    const result = puzzleSystem.solve('main', '192.168.1.100')
    expect(result.success).toBe(true)
  })

  test('should persist progress across sessions', () => {
    // 第一次会话：收集线索
    gameState.discoverClue('clue1')
    
    // 模拟页面刷新（创建新实例）
    const newGameState = new GameState()
    const newPuzzleSystem = new PuzzleSystem(newGameState)
    
    // 验证进度已恢复
    expect(newGameState.hasClue('clue1')).toBe(true)
  })
})
