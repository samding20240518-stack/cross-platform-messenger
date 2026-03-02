// Phaser mock for Jest testing
import { EventEmitter } from 'events'

export default {
  Scene: class Scene {},
  GameObjects: {
    Sprite: class Sprite {},
    Text: class Text {},
    Image: class Image {},
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
}
