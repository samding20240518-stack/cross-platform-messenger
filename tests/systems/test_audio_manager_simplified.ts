/**
 * 音效系统核心功能测试
 * 验证音效系统基本功能
 * 基于工程规范要求
 */

import { AudioManager } from '../../src/systems/AudioManager'

describe('AudioManager - 核心功能验证', () => {
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
        frequency: { 
          value: 800, 
          setValueAtTime: jest.fn(), 
          exponentialRampToValueAtTime: jest.fn() 
        },
        connect: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        onended: null,
        disconnect: jest.fn()
      })),
      createGain: jest.fn(() => ({
        gain: { 
          value: 0.5, 
          setValueAtTime: jest.fn(), 
          exponentialRampToValueAtTime: jest.fn() 
        },
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

  describe('1. 核心功能完整性', () => {
    test('应该成功初始化音效系统', () => {
      expect(audioManager).toBeDefined()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该定义所有核心方法', () => {
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
        expect(() => audioManager.playPlatformSound(platform)).not.toThrow()
      })
    })

    test('应该处理未知的平台类型', () => {
      // 模拟未知平台
      expect(() => audioManager.playPlatformSound('unknown-platform')).not.toThrow()
    })
  })

  describe('3. 游戏事件音效功能', () => {
    test('应该播放线索发现音效', () => {
      expect(typeof audioManager.playClue).toBe('function')
      expect(() => audioManager.playClue()).not.toThrow()
    })

    test('应该播放解谜成功音效', () => {
      expect(typeof audioManager.playSuccess).toBe('function')
      expect(() => audioManager.playSuccess()).not.toThrow()
    })

    test('应该播放游戏事件音效', () => {
      expect(typeof audioManager.playGameSound).toBe('function')
      expect(() => audioManager.playGameSound('clue-found')).not.toThrow()
      expect(() => audioManager.playGameSound('burn-warning')).not.toThrow()
      expect(() => audioManager.playGameSound('puzzle-solved')).not.toThrow()
    })
  })

  describe('4. UI交互音效功能', () => {
    test('应该播放按钮点击音效', () => {
      expect(typeof audioManager.playButtonClick).toBe('function')
      expect(() => audioManager.playButtonClick()).not.toThrow()
    })

    test('应该播放通知音效', () => {
      expect(typeof audioManager.playNotification).toBe('function')
      expect(() => audioManager.playNotification()).not.toThrow()
    })
  })

  describe('5. 音量控制功能', () => {
    test('应该设置音量', () => {
      expect(typeof audioManager.setVolume).toBe('function')
      expect(() => audioManager.setVolume(0.8)).not.toThrow()
    })

    test('应该设置静音', () => {
      expect(typeof audioManager.setMute).toBe('function')
      expect(() => audioManager.setMute(true)).not.toThrow()
    })
  })

  describe('6. 背景音乐功能', () => {
    test('应该能够控制背景音乐', () => {
      expect(typeof audioManager.startBackgroundMusic).toBe('function')
      expect(typeof audioManager.stopBackgroundMusic).toBe('function')
      expect(() => audioManager.startBackgroundMusic()).not.toThrow()
      expect(() => audioManager.stopBackgroundMusic()).not.toThrow()
    })
  })

  describe('7. 错误处理', () => {
    test('应该处理Web Audio API不可用的情况', () => {
      // 模拟Web Audio API不可用
      global.AudioContext = jest.fn(() => {
        throw new Error('Web Audio API not supported')
      }) as any
      
      const audioManagerWithError = new AudioManager(mockScene as any)
      
      // 验证降级处理
      expect(audioManagerWithError).toBeDefined()
      expect(typeof audioManagerWithError.setMute).toBe('function')
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

  describe('9. 规范符合性验证', () => {
    test('应该使用doubao-code模型开发', () => {
      // 验证代码中记录了模型使用
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('doubao-code')
    })

    test('应该实现错误边界处理', () => {
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('handleInitError')
      expect(audioManagerCode).toContain('try')
      expect(audioManagerCode).toContain('catch')
    })

    test('应该实现配置变更记录', () => {
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('logConfigChange')
      expect(audioManagerCode).toContain('logSoundEvent')
    })
  })
})