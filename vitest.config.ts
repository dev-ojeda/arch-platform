import { defineConfig }
    from 'vitest/config'

export default defineConfig({

    test: {

        environment: 'node',

        globals: true,

        pool: 'threads',

        include: [
            'packages/**/src/**/*.test.ts',
            'generators/**/src/**/*.test.ts'
        ],

        exclude: [
            '**/dist/**',
            '**/node_modules/**'
        ],

        coverage: {
            provider: 'v8'
        }
    }
})