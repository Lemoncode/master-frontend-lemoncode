module.exports = {
  rootDir: '../../',
  restoreMocks: true,
  testEnvironment: 'jsdom',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  setupFilesAfterEnv: ['<rootDir>/config/test/setup-after.ts'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
