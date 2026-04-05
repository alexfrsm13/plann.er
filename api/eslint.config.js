import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build/**', 'database/**', 'generated/**', 'prisma/']),
  {
    files: ['**/*.{ts}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    plugins: {
        prettier: pluginPrettier
    },
    rules: {
        'prettier/prettier': [
            'error',
        ]
    }
  },
  pluginPrettier,
  prettierConfig,
])