import Phaser from 'phaser'

/**
 * AudioManager - 游戏音效管理系统
 * 使用doubao-code模型开发
 */
export class AudioManager extends Phaser.Events.EventEmitter {
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map()
  private isMuted: boolean = false
  private volume: number = 1.0
  private backgroundMusic: any = null
  private isMusicPlaying: boolean = false

  constructor() {
    super()
    this.createSounds()
    this.handleInitError()
  }

  /**
   * 处理初始化错误
   */
  private handleInitError(): void {
    try {
      // 初始化检查
      if (
        typeof window !== 'undefined' &&
        !window.AudioContext &&
        !(window as any).webkitAudioContext
      ) {
        console.warn('Web Audio API not supported')
        this.logConfigChange('audio_init_failed', { error: 'Web Audio API not supported' })
      }
    } catch (e) {
      console.warn('Audio initialization warning:', e)
    }
  }

  /**
   * 记录配置变更
   */
  private logConfigChange(key: string, value: any): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const logs = JSON.parse(localStorage.getItem('audio_config_changes') || '[]')
        logs.push({
          timestamp: new Date().toISOString(),
          key,
          value,
          modelUsed: 'doubao-code',
        })
        localStorage.setItem('audio_config_changes', JSON.stringify(logs))
      } catch (e) {
        // 忽略 localStorage 错误
      }
    }
  }

  /**
   * 记录音效事件
   */
  private logSoundEvent(event: string, details?: any): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const logs = JSON.parse(localStorage.getItem('audio_event_logs') || '[]')
        logs.push({
          timestamp: new Date().toISOString(),
          event,
          details,
          modelUsed: 'doubao-code',
        })
        localStorage.setItem('audio_event_logs', JSON.stringify(logs))
      } catch (e) {
        // 忽略 localStorage 错误
      }
    }
  }

  private createSounds(): void {
    // 使用 Web Audio API 生成音效，不依赖外部音频文件
    // 不需要预创建，直接在 playTone 中生成
  }

  play(soundName: string): void {
    if (this.isMuted) return

    const sound = this.sounds.get(soundName)
    if (sound) {
      sound.play()
    }
  }

  playMessage(): void {
    this.playTone(800, 0.1, 'sine')
  }

  playClue(): void {
    // 上升音阶
    this.playTone(523, 0.1, 'sine') // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100) // E5
    setTimeout(() => this.playTone(784, 0.2, 'sine'), 200) // G5
  }

  playBurn(): void {
    // 下降音
    this.playTone(400, 0.1, 'sawtooth')
  }

  playSuccess(): void {
    // 胜利音效
    this.playTone(523, 0.1, 'sine')
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100)
    setTimeout(() => this.playTone(784, 0.1, 'sine'), 200)
    setTimeout(() => this.playTone(1047, 0.3, 'sine'), 300)
  }

  playError(): void {
    this.playTone(200, 0.2, 'sawtooth')
  }

  playClick(): void {
    this.playTone(1000, 0.05, 'sine')
  }

  /**
   * 播放游戏事件音效
   * @param event - 事件类型: 'clue-found', 'burn-warning', 'puzzle-solved'
   */
  playGameSound(event: string): void {
    if (this.isMuted) return

    const eventSounds: Record<string, () => void> = {
      'clue-found': () => this.playClue(),
      'burn-warning': () => this.playBurn(),
      'puzzle-solved': () => this.playSuccess(),
    }

    const playFn = eventSounds[event]
    if (playFn) {
      playFn()
      this.logSoundEvent(event)
    } else {
      console.warn(`Unknown game event sound: ${event}`)
    }
  }

  /**
   * 播放按钮点击音效
   */
  playButtonClick(): void {
    this.playClick()
  }

  /**
   * 播放通知音效
   */
  playNotification(): void {
    this.playMessage()
  }

  /**
   * 启动背景音乐
   */
  startBackgroundMusic(): void {
    if (this.isMuted || this.isMusicPlaying) return

    this.isMusicPlaying = true
    this.logConfigChange('background_music', { action: 'start' })

    // 使用 Web Audio API 创建循环背景音乐
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.backgroundMusic = audioContext
      this.logSoundEvent('background_music_start')
    } catch (e) {
      console.warn('Background music start failed:', e)
    }
  }

  /**
   * 停止背景音乐
   */
  stopBackgroundMusic(): void {
    if (!this.isMusicPlaying) return

    this.isMusicPlaying = false
    this.logConfigChange('background_music', { action: 'stop' })

    if (this.backgroundMusic) {
      try {
        this.backgroundMusic.close?.()
        this.backgroundMusic = null
        this.logSoundEvent('background_music_stop')
      } catch (e) {
        console.warn('Background music stop failed:', e)
      }
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType): void {
    if (this.isMuted) return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = frequency
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    } catch (e) {
      console.warn('Audio play failed:', e)
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted
    return this.isMuted
  }

  isAudioMuted(): boolean {
    return this.isMuted
  }

  // 为测试添加的方法
  playSFX(name: string): void {
    if (this.isMuted) return

    const sfxMap: Record<string, () => void> = {
      message: () => this.playMessage(),
      clue: () => this.playClue(),
      burn: () => this.playBurn(),
      success: () => this.playSuccess(),
      error: () => this.playError(),
      click: () => this.playClick(),
      'puzzle-solve': () => this.playSuccess(),
    }

    const playFn = sfxMap[name]
    if (playFn) {
      playFn()
    }
  }

  setMute(muted: boolean): void {
    this.isMuted = muted
    this.logConfigChange('mute', { muted })
  }

  setVolume(vol: number): number {
    this.volume = Math.max(0, Math.min(1, vol))
    this.logConfigChange('volume', { volume: this.volume })
    return this.volume
  }

  /**
   * 播放平台提示音（用于平台切换）
   * @param platform - 平台名称
   */
  playPlatformSound(platform: string): void {
    if (this.isMuted) return

    const platformSounds: Record<string, () => void> = {
      whatsapp: () => this.playTone(800, 0.1, 'sine'),
      telegram: () => this.playTone(1000, 0.08, 'square'),
      discord: () => this.playTone(1200, 0.12, 'triangle'),
      email: () => this.playTone(600, 0.15, 'sawtooth'),
    }

    if (platformSounds[platform]) {
      platformSounds[platform]()
    } else {
      console.warn(`Unknown platform sound: ${platform}`)
    }
  }
}
