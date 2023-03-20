module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: [
      "<rootDir>/src"
    ],
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
    testTimeout: 10000, // 10 seconds
  };