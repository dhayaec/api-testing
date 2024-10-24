// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jest-fixed-jsdom',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   testEnvironmentOptions: {
//     customExportConditions: [''],
//   },
//   globals: {
//     Uint8Array: Uint8Array,
//   },
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//   },
// };

import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  // Define test environment
  testEnvironment: 'jest-fixed-jsdom',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Add moduleDirectories to resolve modules inside the src folder
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Add moduleNameMapper to resolve paths (optional, only if you're using aliases)
  moduleNameMapper: {
    // Handle module aliases (if any)
    '^@/(.*)$': '<rootDir>/src/$1',

    // Mock static files like images and styles
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/mocks/styleMock.ts',
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$':
      '<rootDir>/__mocks__/fileMock.ts',
  },

  // Specify test files to look for
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],

  // Ignore patterns
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

  // Set up global configurations for Jest
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Collect test coverage and include src directory
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/*.d.ts',
    '!<rootDir>/src/lib/db.ts',
  ],
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  globals: {
    Uint8Array: Uint8Array,
  },
};

module.exports = createJestConfig(customJestConfig);
