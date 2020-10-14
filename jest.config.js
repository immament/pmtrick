// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.test.json',
        },
    },

    moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '@src/(.*)': '<rootDir>/src/$1',
        '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
    },

    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/src'],
    // The paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: ['jest-webextension-mock'],

    // The glob patterns Jest uses to detect test files
    // testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    testMatch: ['**/__tests__/**/?(*.)+(spec|test).[tj]s?(x)'],
    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ['/node_modules/', 'stories.tsx'],

    // A map from regular expressions to paths to transformers
    // transform: null,
    transform: {
        '\\.tsx?$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },

    setupFilesAfterEnv: ['<rootDir>src/__tests__/setupTests.js'],
};
