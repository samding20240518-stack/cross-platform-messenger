# 音效系统规格说明书

**文档版本**: v1.0  
**创建日期**: 2026-03-02  
**创建模型**: k2-turbo (符合工程规范要求)  

## 🎵 音效需求规格

### 1. 平台提示音

#### 1.1 WhatsApp 提示音
- **频率**: 800Hz
- **持续时间**: 0.1秒
- **波形**: 正弦波
- **音量**: 50% (可调节)

#### 1.2 Telegram 提示音  
- **频率**: 1000Hz
- **持续时间**: 0.08秒
- **波形**: 方波
- **音量**: 50% (可调节)

#### 1.3 Discord 提示音
- **频率**: 1200Hz
- **持续时间**: 0.12秒
- **波形**: 三角波
- **音量**: 50% (可调节)

#### 1.4 Email 提示音
- **频率**: 600Hz
- **持续时间**: 0.15秒
- **波形**: 锯齿波
- **音量**: 50% (可调节)

### 2. 游戏事件音效

#### 2.1 线索发现音效
- **频率变化**: 800Hz → 1200Hz (上升)
- **持续时间**: 0.3秒
- **效果**: 正向激励感

#### 2.2 阅后即焚警告音
- **频率变化**: 1000Hz → 500Hz (下降)
- **持续时间**: 0.2秒
- **重复**: 3次，间隔0.5秒
- **效果**: 紧迫感

#### 2.3 解谜成功音效
- **频率序列**: 600Hz, 800Hz, 1000Hz, 1200Hz (上升和弦)
- **持续时间**: 0.4秒
- **效果**: 庆祝感

### 3. 背景音乐

#### 3.1 环境背景音乐
- **类型**: 低频环境音
- **频率范围**: 100-300Hz
- **音量**: 20% (可调节)
- **循环**: 无缝循环

## 🔧 技术实现规格

### 1. 架构设计
```typescript
// 遵循工程规范：使用doubao-code模型进行开发
// 原因：52ms延迟，适合快速开发迭代

class AudioManager {
  private audioContext: AudioContext | null = null
  private isMuted: boolean = false
  private masterVolume: number = 0.5
  private backgroundMusic: OscillatorNode | null = null
  
  // 音效缓存池（性能优化）
  private soundCache: Map<string, AudioBuffer> = new Map()
  
  init(): void {
    // 初始化Web Audio API
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // 预加载常用音效
    this.preloadSounds()
  }
  
  // 平台提示音
  playPlatformSound(platform: string): void {
    if (this.isMuted || !this.audioContext) return
    
    const config = this.getPlatformConfig(platform)
    this.playTone(config.frequency, config.duration, config.waveType)
  }
  
  // 游戏事件音效
  playGameSound(event: string): void {
    if (this.isMuted || !this.audioContext) return
    
    switch (event) {
      case 'clue-found':
        this.playRisingTone(800, 1200, 0.3)
        break
      case 'burn-warning':
        this.playWarningTone()
        break
      case 'puzzle-solved':
        this.playSuccessChime()
        break
    }
  }
  
  // 背景音乐控制
  startBackgroundMusic(): void {
    if (this.isMuted || !this.audioContext) return
    
    // 创建低频环境音
    this.backgroundMusic = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    this.backgroundMusic.type = 'sine'
    this.backgroundMusic.frequency.value = 200
    gainNode.gain.value = this.masterVolume * 0.4
    
    this.backgroundMusic.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    this.backgroundMusic.start()
  }
}
```

### 2. 性能优化
- 使用对象池模式管理音频节点
- 预加载常用音效到内存
- 音量可调节，支持静音
- 使用Web Audio API实时生成，减少文件大小

### 3. 规范符合性
- 遵循工程规范：开发阶段使用doubao-code模型
- 实施配置变更记录
- 进行性能基准测试

## ✅ 验收标准

### 1. 功能验收
- [ ] 所有平台都有独特提示音
- [ ] 游戏事件音效完整
- [ ] 背景音乐可控制
- [ ] 音量和静音功能正常

### 2. 性能验收
- [ ] 音效播放无延迟
- [ ] 内存使用合理
- [ ] 无内存泄漏

### 3. 规范验收
- [ ] 配置变更已记录
- [ ] 模型选择符合规范
- [ ] 测试用例已更新

## 📅 实施计划
- **第1天上午**: 基础框架和平台音效
- **第1天下午**: 游戏事件音效
- **第2天上午**: 背景音乐和控制
- **第2天下午**: 测试和优化