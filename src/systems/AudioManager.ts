import Phaser from 'phaser'

export class AudioManager extends Phaser.Events.EventEmitter {
  private scene: Phaser.Scene
  private sounds: Map<string, Phaser.Sound.BaseSound> = new Map()
  private isMuted: boolean = false

  constructor(scene: Phaser.Scene) {
    super()
    this.scene = scene
    this.createSounds()
  }

  private createSounds(): void {
    // 使用 Web Audio API 生成简单音效
    // 新消息提示音
    this.sounds.set('message', this.scene.sound.add('message', { volume: 0.5 }))
    
    // 线索发现音
    this.sounds.set('clue', this.scene.sound.add('clue', { volume: 0.6 }))
    
    // 阅后即焚警告音
    this.sounds.set('burn', this.scene.sound.add('burn', { volume: 0.4 }))
    
    // 解谜成功音
    this.sounds.set('success', this.scene.sound.add('success', { volume: 0.7 }))
    
    // 错误/失败音
    this.sounds.set('error', this.scene.sound.add('error', { volume: 0.4 }))
    
    // 按钮点击音
    this.sounds.set('click', this.scene.sound.add('click', { volume: 0.3 }))
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
}
