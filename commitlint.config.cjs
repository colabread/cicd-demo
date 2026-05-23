const czConfig = require("./cz-config.cjs");

const types = czConfig.types.map((type) => type.value);
const scopes = czConfig.scopes;
const subjectLimit = czConfig.subjectLimit || 72;

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", types],
    "scope-empty": [2, "never"],
    "scope-enum": [2, "always", scopes],
    "subject-empty": [2, "never"],
    "subject-max-length": [2, "always", subjectLimit],
  },
};
