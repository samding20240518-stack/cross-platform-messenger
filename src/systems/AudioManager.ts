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
