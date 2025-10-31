// eslint.config.mjs (ESLint v9, Flat Config)
import {FlatCompat} from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
});

export default [
  // Игноры, чтобы не трогать артефакты
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'public/**'
    ]
  },

  // Базовые рекомендации JS
  js.configs.recommended,

  // Конфиг Next (react/react-hooks/jsx-a11y и т.п.) из legacy-мира → через compat
  ...compat.extends('next/core-web-vitals'),

  // TS-override: говорим ESLint, как парсить *.ts/*.tsx и какие плагины/правила включить
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {jsx: true}
        // Если когда-нибудь захочешь type-aware правила, добавь:
        // project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // Базовые правила отключаем в TS-файлах, чтобы не бить по типам/аннотациям
      'no-undef': 'off',
      'no-unused-vars': 'off',

      // TS-aware вариант: мягко предупреждаем об неиспользуемых (не ломаем pre-commit)
      '@typescript-eslint/no-unused-vars': ['warn', {
        args: 'none',
        ignoreRestSiblings: true
      }],

      // Эти правила у тебя встречаются в директивах — подключаем их, но не валим сборку
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn'
    }
  },

  // Общие настройки
  {
    settings: {
      react: {version: 'detect'}
    },
    rules: {
      'no-console': ['warn', {allow: ['warn', 'error']}]
    }
  }
];