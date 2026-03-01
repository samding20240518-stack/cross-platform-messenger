// Jest setup file
// Mock localStorage with actual storage functionality
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    _reset: () => { store = {} }
  }
})()

global.localStorage = localStorageMock as any

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear()
})

// Also clear after all tests
afterAll(() => {
  localStorageMock.clear()
})

// Mock Phaser
global.Phaser = {
  Game: jest.fn(),
  Scene: jest.fn(),
  AUTO: 0,
  Scale: {
    FIT: 0,
    CENTER_BOTH: 0,
  },
  Events: {
    EventEmitter: class EventEmitter {
      on() {}
      emit() {}
    }
  }
} as any
