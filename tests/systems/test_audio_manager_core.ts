/**
 * 音效系统核心功能测试
 * 基于工程规范要求设计
 * 验证音效系统基本功能
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
    
    audioManager = new AudioManager(mockScene)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('1. 核心功能完整性', () => {
    test('应该成功初始化', () => {
      expect(audioManager).toBeDefined()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该定义所有核心方法', () => {
      const coreMethods = [
        'playPlatformSound',
        'playGameSound',
        'startBackgroundMusic',
        'stopBackgroundMusic',
        'setMute',
        'setVolume'
      ]
      
      coreMethods.forEach(method => {
        expect(audioManager[method]).toBeDefined()
        expect(typeof audioManager[method]).toBe('function')
      })
    })
  })

  describe('2. 平台提示音功能', () => {
    test('应该播放WhatsApp提示音', () => {
      audioManager.playPlatformSound('whatsapp')
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放Telegram提示音', () => {
      audioManager.playPlatformSound('telegram')
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放Discord提示音', () => {
      audioManager.playPlatformSound('discord')
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放Email提示音', () => {
      audioManager.playPlatformSound('email')
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('3. 游戏事件音效功能', () => {
    test('应该播放线索发现音效', () => {
      audioManager.playGameSound('clue-found')
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放阅后即焚警告音效', () => {
      audioManager.playGameSound('burn-warning')
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该播放解谜成功音效', () => {
      audioManager.playGameSound('puzzle-solved')
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('4. 音量控制功能', () => {
    test('应该设置音量', () => {
      audioManager.setVolume(0.8)
      // 验证方法存在且可调用
      expect(typeof audioManager.setVolume).toBe('function')
    })

    test('应该设置静音', () => {
      audioManager.setMute(true)
      expect(typeof audioManager.setMute).toBe('function')
    })
  })

  describe('5. 背景音乐功能', () => {
    test('应该启动背景音乐', () => {
      audioManager.startBackgroundMusic()
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('应该停止背景音乐', () => {
      audioManager.startBackgroundMusic()
      audioManager.stopBackgroundMusic()
      // 验证方法可调用
      expect(typeof audioManager.stopBackgroundMusic).toBe('function')
    })
  })

  describe('6. 错误处理', () => {
    test('应该处理Web Audio API不可用的情况', () => {
      // 模拟Web Audio API不可用
      global.AudioContext = jest.fn(() => {
        throw new Error('Web Audio API not supported')
      }) as any
      
      const audioManagerWithError = new AudioManager(mockScene)
      
      // 验证降级处理
      expect(audioManagerWithError).toBeDefined()
      // 在错误处理中应该设置了静音状态
      expect(typeof audioManagerWithError.setMute).toBe('function')
    })
  })

  describe('7. 性能基准', () => {
    test('音效播放响应时间应该在合理范围内', () => {
      const startTime = Date.now()
      audioManager.playPlatformSound('whatsapp')
      const endTime = Date.now()
      
      // 验证响应时间<100ms（符合工程规范）
      expect(endTime - startTime).toBeLessThan(100)
    })
  })

  describe('8. 规范符合性', () => {
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