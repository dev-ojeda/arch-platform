/** @type {import("dependency-cruiser").IConfiguration} */

const PATHS = {
  packages: '^packages',

  apps: '^apps',

  contracts: '^packages/contracts/src',

  core: '^packages/core/src',

  application: '^packages/application/src',

  infrastructure: '^packages/infrastructure/src',

  generators: '^packages/generators/.+/src',

  testing: '^packages/testing/src',

  internal: 'src/internal',

  sharedPackages: '^packages/(shared|common|utils|helpers)',
};

function createRule({ name, comment, severity = 'error', from, to }) {
  return {
    name,
    comment,
    severity,
    from,
    to,
  };
}

/**
 * ============================================================
 * PACKAGE / APP ISOLATION
 * ============================================================
 */

const isolationRules = [
  createRule({
    name: 'packages-no-apps',

    comment: 'Packages must not depend directly on application shells.',

    from: {
      path: PATHS.packages,
    },

    to: {
      path: PATHS.apps,
    },
  }),
];

/**
 * ============================================================
 * PACKAGE BOUNDARIES
 * ============================================================
 */

const boundaryRules = [
  createRule({
    name: 'no-deep-package-imports',

    comment: 'Consumers must import from public package entrypoints only.',

    from: {
      path: PATHS.packages,
    },

    to: {
      path: '^@arch/.+/src/',
    },
  }),
];

/**
 * ============================================================
 * GENERATORS
 * ============================================================
 */

const generatorRules = [
  createRule({
    name: 'generators-no-filesystem',

    comment: 'Generators should not manipulate the filesystem directly.',

    severity: 'warn',

    from: {
      path: PATHS.generators,
    },

    to: {
      path: '^(fs|path)$',
    },
  }),

  createRule({
    name: 'generators-no-infrastructure',

    comment:
      'Generators should depend on ports/contracts instead of infrastructure implementations.',

    severity: 'warn',

    from: {
      path: PATHS.generators,
    },

    to: {
      path: PATHS.infrastructure,
    },
  }),
];

/**
 * ============================================================
 * TESTING
 * ============================================================
 */

const testingRules = [
  createRule({
    name: 'tests-no-internal-access',

    comment: 'Tests should avoid coupling to internal implementation details.',

    severity: 'warn',

    from: {
      path: '(__tests__|\\.test\\.ts$|\\.spec\\.ts$)',
    },

    to: {
      path: PATHS.internal,
    },
  }),
];

/**
 * ============================================================
 * ARCHITECTURE SMELLS
 * ============================================================
 */

const architectureSmellRules = [
  createRule({
    name: 'no-orphans',

    comment: 'Detect orphan modules that are not referenced anywhere in the workspace.',

    severity: 'warn',

    from: {
      orphan: true,

      pathNot: [
        '\\.d\\.ts$',
        '\\.test\\.ts$',
        '\\.spec\\.ts$',

        '^vitest',
        '^commitlint',
        '^syncpack',
        '^tsup',
        '^eslint',
        '^\\.dependency-cruiser',

        '^config/',
        '^scripts/',
        '^docs/',

        '^apps/.+/src/composition/',
        '^apps/.+/src/bootstrap/',
        '^packages/cli/bin/',
        '/test/',
        '/tests/',
        '/__tests__/',
        '/fixtures/',
      ].join('|'),
    },

    to: {},
  }),

  createRule({
    name: 'shared-package-warning',

    comment: 'Shared/common/utils packages tend to become architectural dumping grounds.',

    severity: 'info',

    from: {
      path: PATHS.packages,
    },

    to: {
      path: PATHS.sharedPackages,
    },
  }),
];

module.exports = {
  forbidden: [
    ...isolationRules,

    ...boundaryRules,

    ...generatorRules,

    ...testingRules,

    ...architectureSmellRules,
  ],

  options: {
    /**
     * ============================================================
     * TYPESCRIPT
     * ============================================================
     */

    tsPreCompilationDeps: true,

    combinedDependencies: true,

    skipAnalysisNotInRules: true,

    /**
     * ============================================================
     * RESOLUTION
     * ============================================================
     */

    enhancedResolveOptions: {
      exportsFields: ['exports'],

      conditionNames: ['import', 'require', 'node', 'default'],

      extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs'],
    },

    /**
     * ============================================================
     * IGNORE
     * ============================================================
     */

    doNotFollow: {
      path: ['node_modules'],
    },

    exclude: {
      path: [
        'node_modules',

        'dist',
        'build',
        'coverage',

        '\\.test\\.ts$',
        '\\.spec\\.ts$',

        'vitest\\.config',
        'tsup\\.config',
        'eslint\\.config',

        'scripts',
        'docs',
      ],
    },

    /**
     * ============================================================
     * REPORTING
     * ============================================================
     */

    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/[^/]+',
      },
    },
  },
};
