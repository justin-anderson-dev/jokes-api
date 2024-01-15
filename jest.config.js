/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};
