import love from 'eslint-config-love'

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
    },
    {
        ...love,
        files: ['**/*.js', '**/*.cjs', '**/*.ts', '**/*.tsx'],
    },
]
