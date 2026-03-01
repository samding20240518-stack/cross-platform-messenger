// Jest setup file
// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
} as any

// Mock Phaser
global.Phaser = {
  Game: jest.fn(),
  Scene: jest.fn(),
  AUTO: 0,
  Scale: {
    FIT: 0,
    CENTER_BOTH: 0,
  },
} as any
