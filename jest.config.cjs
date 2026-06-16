'use strict'

module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.jest.json'
    }]
  },
  moduleNameMapper: {
    '^(\\.\\.\?\\/.+)\\.ts$': '$1',
    '^(\\.\\.\?\\/.+)\\.js$': '$1'
  }
}
