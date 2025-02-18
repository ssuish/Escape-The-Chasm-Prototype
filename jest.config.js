// filepath: /home/ssuish/projects/phaser-react/jest.config.js
export const preset = 'ts-jest';
export const testEnvironment = 'jest-environment-jsdom';
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx'];
export const transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest',
};
export const testMatch = ['**/__tests__/**/*.test.(ts|tsx|js)'];