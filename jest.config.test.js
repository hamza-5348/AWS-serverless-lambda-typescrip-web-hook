module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  testEnvironment: "node",
  testMatch: ["**/**/**/*.test.ts"],
};

process.env = Object.assign(process.env, {
  TABLE_NAME: "table-1",
  SNS_PARAMETER_PATH: "dev/sns/path",
  MAILGUN_SIGNING_PARAMETER_PATH: "dev/sns/path",
});
