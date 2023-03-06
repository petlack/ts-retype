import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['<rootDir>/src/**', '<rootDir>/tests/**'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  coverageReporters: ['json-summary', 'lcov'],
};

export default config;
