module.exports = {
  rootDir: '../../',
  preset: 'ts-jest',
  restoreMocks: true,
  setupFiles: ['<rootDir>/config/test/setup.js'],
  modulePathIgnorePatterns: ['node_modules', '<rootDir>/dist/'],
  testEnvironment: 'node',
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
};
