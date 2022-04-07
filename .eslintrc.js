module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "standard",
    "plugin:prettier/recommended",
    "plugin:node/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules"] },
    ],
    "no-unused-vars": "warn",
    "no-redeclare": "off",
    "node/no-missing-import": "off",
    "no-unused-expressions": "warn",
    "no-useless-constructor": "off",
    "prefer-const": "warn",
    "node/no-unsupported-features/es-builtins": "off",
    "prettier/prettier": "warn",
  },
};
