import love from 'eslint-config-love'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    {
        ...love,
        files: ['**/*.js', '**/*.cjs', '**/*.ts', '**/*.tsx'],
        rules: {
            ...love.rules,
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-magic-numbers': 'off',
            '@typescript-eslint/class-methods-use-this': 'off',
            '@typescript-eslint/no-unsafe-type-assertion': 'off',
        },
    },
    {
        files: ['**/*.spec.ts', '**/*.test.ts'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                it: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                jest: 'readonly',
            },
        },
    },
    eslintConfigPrettier,
]
