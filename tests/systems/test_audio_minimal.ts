/**
 * 音效系统存在性测试
 * 验证AudioManager基本功能
 */

import { AudioManager } from '../../src/systems/AudioManager'

describe('AudioManager - 存在性验证', () => {
  test('应该成功创建AudioManager实例', () => {
    const audioManager = new AudioManager()
    expect(audioManager).toBeDefined()
  })

  test('应该定义核心音效方法', () => {
    const audioManager = new AudioManager()
    
    // 验证核心方法存在
    expect(typeof audioManager.playPlatformSound).toBe('function')
    expect(typeof audioManager.playClue).toBe('function')
    expect(typeof audioManager.playSuccess).toBe('function')
    expect(typeof audioManager.startBackgroundMusic).toBe('function')
    expect(typeof audioManager.stopBackgroundMusic).toBe('function')
    expect(typeof audioManager.setMute).toBe('function')
    expect(typeof audioManager.setVolume).toBe('function')
  })
})