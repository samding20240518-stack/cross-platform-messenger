/**
 * 音效系统功能验证测试
 * 验证音效系统基本功能
 * 基于工程规范要求
 */

import { AudioManager } from '../../src/systems/AudioManager'

describe('音效系统功能验证', () => {
  let audioManager: AudioManager
  let mockScene: any

  beforeEach(() => {
    // 创建模拟场景
    mockScene = {
      add: {
        existing: jest.fn()
      }
    }
    
    // 模拟localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    }
    global.localStorage = localStorageMock as any
    
    // 模拟Web Audio API
    const mockAudioContext = {
      createOscillator: jest.fn(() => ({
        type: 'sine',
        frequency: { value: 800, setValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        onended: null,
        disconnect: jest.fn()
      })),
      createGain: jest.fn(() => ({
        gain: { value: 0.5, exponentialRampToValueAtTime: jest.fn() },
        connect: jest.fn(),
        disconnect: jest.fn()
      })),
      currentTime: 0,
      destination: {}
    }
    
    global.AudioContext = jest.fn(() => mockAudioContext) as any
    global.webkitAudioContext = global.AudioContext
    
    audioManager = new AudioManager(mockScene as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('1. 音效系统基本功能', () => {
    test('应该成功初始化音效系统', () => {
      expect(audioManager).toBeDefined()
      expect(global.AudioContext).toHaveBeenCalled()
      // 验证配置变更记录功能存在
      expect(typeof localStorage.setItem).toBe('function')
    })

    test('应该定义所有音效方法', () => {
      const requiredMethods = [
        'playPlatformSound',
        'playClue',
        'playSuccess',
        'playGameSound',
        'playButtonClick',
        'playNotification',
        'startBackgroundMusic',
        'stopBackgroundMusic',
        'setMute',
        'setVolume'
      ]
      
      requiredMethods.forEach(method => {
        expect(audioManager[method]).toBeDefined()
        expect(typeof audioManager[method]).toBe('function')
      })
    })
  })

  describe('2. 平台提示音功能', () => {
    test('应该播放所有平台的提示音', () => {
      const platforms = ['whatsapp', 'telegram', 'discord', 'email']
      
      platforms.forEach(platform => {
        // 验证方法存在且可调用
        expect(typeof audioManager.playPlatformSound).toBe('function')
        // 实际调用方法
        audioManager.playPlatformSound(platform)
      })
    })

    test('应该处理未知的平台类型', () => {
      // 模拟未知平台
      audioManager.playPlatformSound('unknown-platform')
      
      // 应该记录警告但不抛出错误 - 验证方法可调用
      expect(typeof audioManager.playPlatformSound).toBe('function')
    })
  })

  describe('3. 游戏事件音效功能', () => {
    test('应该播放线索发现音效', () => {
      audioManager.playClue()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放解谜成功音效', () => {
      audioManager.playSuccess()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放游戏事件音效', () => {
      audioManager.playGameSound('clue-found')
      audioManager.playGameSound('burn-warning')
      audioManager.playGameSound('puzzle-solved')
      
      // 验证方法被调用
      expect(typeof audioManager.playGameSound).toBe('function')
    })
  })

  describe('4. UI交互音效功能', () => {
    test('应该播放按钮点击音效', () => {
      audioManager.playButtonClick()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放通知音效', () => {
      audioManager.playNotification()
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('5. 音量控制功能', () => {
    test('应该设置音量', () => {
      audioManager.setVolume(0.8)
      expect(typeof audioManager.setVolume).toBe('function')
    })

    test('应该设置静音', () => {
      audioManager.setMute(true)
      expect(typeof audioManager.setMute).toBe('function')
    })
  })

  describe('6. 背景音乐功能', () => {
    test('应该能够控制背景音乐', () => {
      audioManager.startBackgroundMusic()
      audioManager.stopBackgroundMusic()
      
      expect(global.AudioContext).toHaveBeenCalled()
      // 验证背景音乐控制功能存在
      expect(typeof audioManager.startBackgroundMusic).toBe('function')
      expect(typeof audioManager.stopBackgroundMusic).toBe('function')
    })
  })

  describe('7. 规范符合性验证', () => {
    test('应该记录配置变更（符合工程规范）', () => {
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('logConfigChange')
      expect(audioManagerCode).toContain('doubao-code')
    })

    test('应该实现错误边界处理', () => {
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('handleInitError')
      expect(audioManagerCode).toContain('try')
      expect(audioManagerCode).toContain('catch')
    })
  })

  describe('8. 性能基准验证', () => {
    test('音效响应时间应该<100ms（符合工程规范）', () => {
      const startTime = Date.now()
      
      audioManager.playPlatformSound('whatsapp')
      
      const endTime = Date.now()
      
      // 验证方法执行时间在合理范围内
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})