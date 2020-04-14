// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: false,

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // The test environment that will be used for testing
  testEnvironment: "node",

  // Global settings
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json"
    }
  }
};
