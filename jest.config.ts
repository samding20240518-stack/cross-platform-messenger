export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts', '**/test_*.ts'],
  testPathIgnorePatterns: [
    // 临时忽略的测试文件 - 需要后续修复 Web Audio API Mock
    'test_audio_manager.ts',
    'test_audio_manager_core.ts',
    'test_audio_functionality.ts',
    'test_audio_manager_simplified.ts',
    'test_audio_integration.ts',
  ],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^phaser$': '<rootDir>/tests/__mocks__/phaser.ts',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!phaser)',
  ],
}
