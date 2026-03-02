/**
 * 音效系统存在性测试
 * 验证音效系统方法存在
 */

import { AudioManager } from '../../src/systems/AudioManager'

describe('AudioManager - 方法存在性测试', () => {
  test('应该定义所有音效方法', () => {
    const audioManager = new AudioManager()
    
    // 验证方法存在
    expect(typeof audioManager.playPlatformSound).toBe('function')
    expect(typeof audioManager.playClue).toBe('function')
    expect(typeof audioManager.playSuccess).toBe('function')
    expect(typeof audioManager.playButtonClick).toBe('function')
    expect(typeof audioManager.playNotification).toBe('function')
    expect(typeof audioManager.startBackgroundMusic).toBe('function')
    expect(typeof audioManager.stopBackgroundMusic).toBe('function')
    expect(typeof audioManager.setMute).toBe('function')
    expect(typeof audioManager.setVolume).toBe('function')
  })
})