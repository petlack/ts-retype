import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.(ts|tsx)?$': ['ts-jest', { useESM: true, isolatedModules: true }],
  },
  collectCoverageFrom: ['<rootDir>/src/**', '<rootDir>/tests/**'],
  modulePathIgnorePatterns: ['<rootDir>/e2e', '<rootDir>/clikit'],
  coverageReporters: ['json-summary', 'lcov'],
};

export default config;
