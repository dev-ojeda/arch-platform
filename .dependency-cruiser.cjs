// .dependency-cruiser.cjs

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies are forbidden',
      from: {},
      to: {
        circular: true,
      },
    },

    {
      name: 'core-boundary',
      severity: 'error',
      comment: 'Core cannot depend on upper layers',
      from: {
        path: '^packages/core/src',
      },
      to: {
        path: '^packages/(application|infrastructure|generators)/src',
      },
    },

    {
      name: 'contracts-boundary',
      severity: 'error',
      comment: 'Contracts cannot depend on implementations',
      from: {
        path: '^packages/contracts/src',
      },
      to: {
        path: '^packages/(core|application|infrastructure|generators)/src',
      },
    },

    {
      name: 'application-boundary',
      severity: 'error',
      comment: 'Application cannot depend on infrastructure',
      from: {
        path: '^packages/application/src',
      },
      to: {
        path: '^packages/infrastructure/src',
      },
    },

    {
      name: 'no-cross-package-relative-imports',
      severity: 'error',
      comment: 'Cross package imports must use workspace aliases',
      from: {
        path: '^packages/[^/]+/src/',
      },
      to: {
        path: '^packages/[^/]+/src/',
        pathNot: '^packages/([^/]+)/src/',
      },
    },

    {
      name: 'no-package-internal-imports',
      severity: 'warn',
      comment: 'Production code should not import internal package implementation',
      from: {
        path: '^packages/[^/]+/src/',
        pathNot: '^packages/[^/]+/test/',
      },
      to: {
        path: '^packages/[^/]+/src/(internal|private|impl|implementation)/',
      },
    },
  ],

  options: {
    tsConfig: {
      fileName: 'tsconfig.json',
    },

    tsPreCompilationDeps: true,

    doNotFollow: {
      path: 'node_modules',
    },

    enhancedResolveOptions: {
      exportsFields: ['exports'],
    },

    exclude: {
      path: ['node_modules', 'dist', 'coverage', '.turbo', '.pnpm'].join('|'),
    },
  },
};
