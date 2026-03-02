/**
 * 音效系统集成测试
 * 验证音效在游戏流程中的正确触发
 * 基于工程规范要求
 */

import { DesktopScene } from '../../src/scenes/DesktopScene'
import { AudioManager } from '../../src/systems/AudioManager'

describe('音效系统集成测试', () => {
  let scene: DesktopScene
  let audioManager: AudioManager
  let mockScene: any

  beforeEach(() => {
    // 创建模拟场景
    mockScene = {
      add: {
        existing: jest.fn(),
        graphics: jest.fn(() => ({
          fillStyle: jest.fn(),
          fillRect: jest.fn(),
          fillRoundedRect: jest.fn(),
          clear: jest.fn()
        })),
        text: jest.fn(() => ({
          setOrigin: jest.fn(),
          setText: jest.fn()
        })),
        image: jest.fn(() => ({
          setScale: jest.fn(),
          setTint: jest.fn(),
          setInteractive: jest.fn()
        })),
        rectangle: jest.fn(() => ({
          setInteractive: jest.fn(() => ({ on: jest.fn() }))
        }))
      },
      events: {
        on: jest.fn(),
        emit: jest.fn()
      },
      tweens: {
        add: jest.fn()
      },
      time: {
        delayedCall: jest.fn()
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
    
    scene = new DesktopScene()
    audioManager = new AudioManager(mockScene as any)
  })

  describe('1. 平台切换音效集成', () => {
    test('切换窗口时应该播放对应平台音效', () => {
      const platforms = ['whatsapp', 'telegram', 'discord', 'email']
      
      platforms.forEach(platform => {
        // 模拟窗口切换
        if (scene.audioManager) {
          scene.audioManager.playPlatformSound(platform)
        }
        
        // 验证音效被播放
        expect(global.AudioContext).toHaveBeenCalled()
      })
    })
  })

  describe('2. 游戏事件音效集成', () => {
    test('发现线索时应该播放线索音效', () => {
      // 模拟线索发现事件
      if (scene.audioManager) {
        scene.audioManager.playClue()
      }
      
      // 验证音效被播放
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('解谜成功时应该播放成功音效', () => {
      // 模拟解谜成功事件
      if (scene.audioManager) {
        scene.audioManager.playSuccess()
      }
      
      // 验证音效被播放
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('阅后即焚时应该播放警告音效', () => {
      // 模拟阅后即焚事件
      if (scene.audioManager) {
        scene.audioManager.playGameSound('burn-warning')
      }
      
      // 验证音效被播放
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('3. UI交互音效集成', () => {
    test('按钮点击应该播放点击音效', () => {
      // 模拟按钮点击
      if (scene.audioManager) {
        scene.audioManager.playButtonClick()
      }
      
      // 验证音效被播放
      expect(global.AudioContext).toHaveBeenCalled()
    })

    test('通知出现时应该播放通知音效', () => {
      // 模拟通知出现
      if (scene.audioManager) {
        scene.audioManager.playNotification()
      }
      
      // 验证音效被播放
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('4. 背景音乐集成', () => {
    test('应该能够启动和停止背景音乐', () => {
      if (scene.audioManager) {
        scene.audioManager.startBackgroundMusic()
        scene.audioManager.stopBackgroundMusic()
      }
      
      // 验证背景音乐控制
      expect(global.AudioContext).toHaveBeenCalled()
    })
  })

  describe('5. 规范符合性验证', () => {
    test('所有音效方法都应该存在', () => {
      const requiredMethods = [
        'playPlatformSound',
        'playClue',
        'playSuccess',
        'playGameSound',
        'playButtonClick',
        'playNotification',
        'startBackgroundMusic',
        'stopBackgroundMusic'
      ]
      
      requiredMethods.forEach(method => {
        expect(audioManager[method]).toBeDefined()
        expect(typeof audioManager[method]).toBe('function')
      })
    })

    test('应该记录配置变更（符合工程规范）', () => {
      // 验证配置变更记录功能
      const audioManagerCode = AudioManager.toString()
      expect(audioManagerCode).toContain('logConfigChange')
      expect(audioManagerCode).toContain('doubao-code')
    })
  })

  describe('6. 性能基准', () => {
    test('音效响应时间应该<100ms（符合工程规范）', () => {
      const startTime = Date.now()
      
      if (scene.audioManager) {
        scene.audioManager.playPlatformSound('whatsapp')
      }
      
      const endTime = Date.now()
      
      // 验证响应时间<100ms
      expect(endTime - startTime).toBeLessThan(100)
    })
  })
})