module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,
  resetModules: true,
};