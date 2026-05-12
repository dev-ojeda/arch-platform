/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [
        /**
         * =========================================
         * REGLAS GENERALES
         * =========================================
         */

        {
            name: 'no-circular',
            severity: 'error',
            comment: 'Evita dependencias circulares',
            from: {},
            to: {
                circular: true
            }
        },

        {
            name: 'no-orphans',
            severity: 'warn',
            comment: 'Detecta archivos no utilizados',
            from: {
                orphan: true,
                pathNot: [
                    '\\.test\\.ts$',
                    '\\.spec\\.ts$',
                    '__tests__',
                    'index\\.ts$',
                    '\\.d\\.ts$'
                ]
            },
            to: {}
        },

        {
            name: 'no-deprecated-core-node',
            severity: 'warn',
            from: {},
            to: {
                dependencyTypes: ['core'],
                path: '^(punycode|domain|sys)$'
            }
        },

        /**
         * =========================================
         * BOUNDARIES MONOREPO
         * =========================================
         */

        {
            name: 'apps-cannot-import-apps',
            severity: 'error',
            comment: 'Apps no deben depender de otras apps',
            from: {
                path: '^apps/([^/]+)/src'
            },
            to: {
                path: '^apps/([^/]+)/src',
                pathNot: '^apps/$1/src'
            }
        },

        {
            name: 'generators-cannot-import-apps',
            severity: 'error',
            comment: 'Generators no deben depender de apps',
            from: {
                path: '^generators'
            },
            to: {
                path: '^apps'
            }
        },

        {
            name: 'packages-cannot-import-apps',
            severity: 'error',
            comment: 'Packages no deben depender de apps',
            from: {
                path: '^packages'
            },
            to: {
                path: '^apps'
            }
        },

        /**
         * =========================================
         * CLEAN ARCHITECTURE
         * =========================================
         */

        {
            name: 'application-no-core-engine',
            severity: 'error',
            comment: 'Application no debe depender directamente del engine',
            from: {
                path: '^packages/application'
            },
            to: {
                path: '^packages/core/src/engine'
            }
        },

        {
            name: 'contracts-must-be-pure',
            severity: 'error',
            comment: 'Contracts debe ser completamente agnóstico',
            from: {
                path: '^packages/contracts'
            },
            to: {
                path: '^packages/(core|application|language-registry)'
            }
        },

        {
            name: 'shared-must-not-depend-on-domain',
            severity: 'error',
            comment: 'Shared debe permanecer utilitario y desacoplado',
            from: {
                path: '^packages/shared'
            },
            to: {
                path: '^packages/(application|core|contracts)'
            }
        },

        /**
         * =========================================
         * CORE RULES
         * =========================================
         */

        {
            name: 'core-no-tests-import',
            severity: 'warn',
            comment: 'Evitar importar testing dentro del runtime',
            from: {
                path: '^packages/core/src/(?!testing)'
            },
            to: {
                path: '^packages/core/src/testing'
            }
        },

        {
            name: 'core-engine-no-templates',
            severity: 'warn',
            comment: 'Engine no debe depender directamente de templates concretos',
            from: {
                path: '^packages/core/src/engine'
            },
            to: {
                path: '^generators/templates'
            }
        },

        /**
         * =========================================
         * APPLICATION LAYER
         * =========================================
         */

        {
            name: 'use-cases-only-through-ports',
            severity: 'error',
            comment: 'Use cases solo deben comunicarse mediante ports',
            from: {
                path: '^packages/application/src/use-cases'
            },
            to: {
                path: '^packages/core/src'
            }
        },

        /**
         * =========================================
         * VS CODE EXTENSION
         * =========================================
         */

        {
            name: 'vscode-ui-no-core',
            severity: 'warn',
            comment: 'UI no debe acceder directamente al core',
            from: {
                path: '^apps/vscode-extension/src/ui'
            },
            to: {
                path: '^packages/core'
            }
        },

        {
            name: 'commands-no-ui',
            severity: 'warn',
            comment: 'Commands no deben depender de UI',
            from: {
                path: '^apps/vscode-extension/src/commands'
            },
            to: {
                path: '^apps/vscode-extension/src/ui'
            }
        },

        /**
         * =========================================
         * IMPORTS
         * =========================================
         */

        {
            name: 'no-relative-parent-imports',
            severity: 'warn',
            comment: 'Evita ../../../../ imports',
            from: {},
            to: {
                path: '^\\.\\./\\.\\.'
            }
        },

        {
            name: 'no-src-leakage',
            severity: 'warn',
            comment: 'Consumir packages vía exports/index.ts',
            from: {},
            to: {
                path: '.*/src/.*'
            }
        },

        /**
         * =========================================
         * TYPESCRIPT
         * =========================================
         */

        {
            name: 'no-ts-ignore',
            severity: 'warn',
            comment: 'Evitar @ts-ignore',
            from: {
                path: '\\.ts$'
            },
            to: {
                dependencyTypes: ['unknown']
            }
        }
    ],

    options: {
        /**
         * =========================================
         * TYPESCRIPT
         * =========================================
         */

        tsConfig: {
            fileName: './tsconfig.json'
        },

        enhancedResolveOptions: {
            exportsFields: ['exports'],
            conditionNames: [
                'import',
                'require',
                'node',
                'default'
            ],
            extensions: [
                '.ts',
                '.tsx',
                '.mts',
                '.js',
                '.mjs',
                '.json'
            ]
        },

        /**
         * =========================================
         * SCAN
         * =========================================
         */

        includeOnly: [
            '^apps',
            '^packages',
            '^generators',
            '^config'
        ],

        exclude: {
            path: [
                'node_modules',
                'dist',
                'coverage',
                '.turbo',
                '.git',
                '\\.next',
                'tmp',
                'build',
                'out',
                'templates'
            ]
        },

        /**
         * =========================================
         * DEPENDENCY TYPES
         * =========================================
         */

        doNotFollow: {
            dependencyTypes: [
                'npm',
                'npm-dev',
                'npm-optional',
                'npm-peer',
                'npm-bundled'
            ]
        },

        /**
         * =========================================
         * REPORTS
         * =========================================
         */

        reporterOptions: {
            dot: {
                collapsePattern:
                    'node_modules/[^/]+'
            },

            archi: {
                collapsePattern:
                    '^(packages|apps|generators)/[^/]+'
            }
        },

        /**
         * =========================================
         * PERFORMANCE
         * =========================================
         */

        cache: false,

        /**
         * =========================================
         * VALIDATION
         * =========================================
         */

        checkForCircularDependencies: true,

        checkForUnusedDependencies: true,

        checkForPreCompilationOnly: false
    }
};