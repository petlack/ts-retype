import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { useESM: true }],
  },
  collectCoverageFrom: ['<rootDir>/retype/src/**', '<rootDir>/retype/tests/**'],
  modulePathIgnorePatterns: ['<rootDir>/retype/dist/', '<rootDir>/e2e'],
  coverageReporters: ['json-summary', 'lcov'],
};

export default config;
