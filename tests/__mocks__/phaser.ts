// Phaser mock for Jest testing
import { EventEmitter } from 'events'

class MockContainer extends EventEmitter {
  x: number = 0
  y: number = 0
  visible: boolean = true
  alpha: number = 1
  scale: number = 1
  rotation: number = 0
  width: number = 100
  height: number = 100
  scene: any = null
  
  constructor(scene?: any, x?: number, y?: number) {
    super()
    this.scene = scene
    if (x !== undefined) this.x = x
    if (y !== undefined) this.y = y
  }
  
  add(): this { return this }
  remove(): this { return this }
  removeAll(): this { return this }
  setPosition(x: number, y?: number): this {
    this.x = x
    if (y !== undefined) this.y = y
    return this
  }
  setVisible(visible: boolean): this {
    this.visible = visible
    return this
  }
  setAlpha(alpha: number): this {
    this.alpha = alpha
    return this
  }
  setScale(scale: number): this {
    this.scale = scale
    return this
  }
  setSize(width: number, height: number): this {
    this.width = width
    this.height = height
    return this
  }
  setInteractive(): this { return this }
  destroy(): void {}
}

class MockGraphics {
  fillStyle(): this { return this }
  fillRect(): this { return this }
  fillRoundedRect(): this { return this }
  fillGradientStyle(): this { return this }
  lineStyle(): this { return this }
  strokeRoundedRect(): this { return this }
  clear(): this { return this }
  destroy(): void {}
}

class MockText {
  text: string = ''
  x: number = 0
  y: number = 0
  width: number = 100
  height: number = 20
  style: any = {}
  
  constructor(scene?: any, x?: number, y?: number, text?: string, style?: any) {
    this.x = x || 0
    this.y = y || 0
    this.text = text || ''
    this.style = style || {}
  }
  
  setText(text: string): this {
    this.text = text
    return this
  }
  setStyle(): this { return this }
  setOrigin(): this { return this }
  destroy(): void {}
}

class MockImage {
  visible: boolean = true
  x: number = 0
  y: number = 0
  
  setVisible(visible: boolean): this {
    this.visible = visible
    return this
  }
  setOrigin(): this { return this }
  setScale(): this { return this }
  setTint(): this { return this }
  setInteractive(): this { return this }
  destroy(): void {}
}

class MockRectangle {
  x: number = 0
  y: number = 0
  width: number = 100
  height: number = 100
  
  setInteractive(): any {
    return { on: jest.fn() }
  }
}

class MockTweenManager {
  add(config: any): any {
    if (config.onComplete) {
      setTimeout(() => config.onComplete?.(), 10)
    }
    return { stop: jest.fn() }
  }
}

class MockTimeEvent {
  remove(): void {}
}

class MockTimeManager {
  delayedCall(delay: number, callback: () => void): any {
    setTimeout(callback, delay)
    return new MockTimeEvent()
  }
}

// Geom namespace
const MockGeom = {
  Rectangle: {
    Contains: jest.fn(() => true)
  }
}

export default {
  Scene: class Scene {
    add = {
      container: (x?: number, y?: number) => new MockContainer(this, x, y),
      graphics: () => new MockGraphics(),
      text: (x?: number, y?: number, text?: string, style?: any) => new MockText(this, x, y, text, style),
      image: () => new MockImage(),
      existing: () => {},
      rectangle: () => new MockRectangle(),
    }
    events = new EventEmitter()
    tweens = new MockTweenManager()
    time = new MockTimeManager()
  },
  GameObjects: {
    Sprite: class Sprite {},
    Text: MockText,
    Image: MockImage,
    Graphics: MockGraphics,
    Container: MockContainer,
    Rectangle: MockRectangle,
  },
  Scale: {
    FIT: 'FIT',
    EXPAND: 'EXPAND',
  },
  Renderer: {
    WEBGL: 'WEBGL',
    CANVAS: 'CANVAS',
  },
  Events: {
    EventEmitter: EventEmitter,
  },
  Geom: MockGeom,
}
