import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(prettierConfig, ...tseslint.configs.recommended);
