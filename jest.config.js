module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testMatch: ['**/tests/**/*.test.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: true,
    collectCoverageFrom: ['!src/**/index.ts', 'src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', 'dist/', '<rootDir>/src/config/', '<rootDir>/src/index.ts'],
    coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'text-summary', 'html'],
    testEnvironment: 'node',
    verbose: true,
};
