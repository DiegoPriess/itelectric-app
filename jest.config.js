module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'lcov', 'text-summary'],
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
  };
  