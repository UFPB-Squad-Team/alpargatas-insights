// server/eslint.config.cjs

const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  prettierConfig,
  ...tseslint.configs.recommended,
);
