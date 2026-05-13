module.exports = {
    forbidden: [
        {
            name: 'no-circular',

            severity: 'error',

            from: {},

            to: {
                circular: true
            }
        },

        {
            name: 'no-orphans',

            severity: 'warn',

            from: {
                orphan: true,

                pathNot: [
                    '(^|/)(index)\\.(ts|js)$',

                    '\\.d\\.ts$',

                    'eslint\\.config\\.js$',
                    'vitest\\.config\\.ts$',
                    'vitest\\.workspace\\.ts$',

                    '\\.dependency-cruiser\\.cjs$'
                ]
            },

            to: {}
        },

        {
            name: 'domain-no-infrastructure',

            severity: 'error',

            from: {
                path: '^packages/domain'
            },

            to: {
                path: '^packages/infrastructure'
            }
        },

        {
            name: 'domain-no-application',

            severity: 'error',

            from: {
                path: '^packages/domain'
            },

            to: {
                path: '^packages/application'
            }
        },

        {
            name: 'application-no-vscode',

            severity: 'error',

            from: {
                path: '^packages/application'
            },

            to: {
                path: '^vscode$'
            }
        },

        {
            name: 'apps-through-application',

            severity: 'warn',

            from: {
                path: '^apps'
            },

            to: {
                path: '^packages/domain'
            }
        }
    ],

    options: {
        tsPreCompilationDeps: true,

        doNotFollow: {
            path: 'node_modules'
        },

        exclude: {
            path: [
                'dist',
                '\\.turbo',
                'node_modules'
            ]
        },

        reporterOptions: {
            dot: {
                collapsePattern: 'node_modules/[^/]+'
            }
        }
    }
};