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

const NODE_BUILTINS =
  '^(fs|fs/promises|path|os|crypto|child_process|cluster|dgram|net|tls|worker_threads)$';

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
 * CIRCULAR DEPENDENCIES
 * ============================================================
 */

const circularRules = [
  createRule({
    name: 'no-circular',

    comment: 'Circular dependencies increase coupling and break architectural boundaries.',

    from: {},

    to: {
      circular: true,
    },
  }),
];

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

  createRule({
    name: 'core-isolation',

    comment: 'Core layer must remain isolated from infrastructure and application concerns.',

    from: {
      path: PATHS.core,
    },

    to: {
      path: '^packages/(application|infrastructure|generators)',
    },
  }),

  createRule({
    name: 'contracts-independent',

    comment: 'Contracts must remain isolated from implementation layers.',

    from: {
      path: PATHS.contracts,
    },

    to: {
      path: '^packages/(core|application|infrastructure|generators)',
    },
  }),
];

/**
 * ============================================================
 * LAYERING RULES
 * ============================================================
 */

const layeringRules = [
  createRule({
    name: 'core-no-application',

    comment: 'Core layer must not depend on application layer.',

    from: {
      path: PATHS.core,
    },

    to: {
      path: PATHS.application,
    },
  }),

  createRule({
    name: 'application-no-infrastructure',

    comment:
      'Application layer must depend on abstractions instead of infrastructure implementations.',

    from: {
      path: PATHS.application,
    },

    to: {
      path: PATHS.infrastructure,
    },
  }),

  createRule({
    name: 'application-no-vscode',

    comment: 'Application layer must remain editor agnostic.',

    from: {
      path: PATHS.application,
    },

    to: {
      path: 'vscode',
    },
  }),
];

/**
 * ============================================================
 * DOMAIN PROTECTION
 * ============================================================
 */

const domainProtectionRules = [
  createRule({
    name: 'domain-no-node-builtins',

    comment: 'Domain layers must not depend directly on Node.js runtime infrastructure.',

    from: {
      path: '^packages/(core|contracts|application)/src',
    },

    to: {
      path: NODE_BUILTINS,
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
    name: 'no-internal-imports',

    comment: 'Internal modules must not be imported outside their owning package.',

    from: {},

    to: {
      path: PATHS.internal,
    },
  }),

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

  createRule({
    name: 'no-cross-package-relative-imports',

    comment: 'Cross-package imports must use workspace aliases instead of relative paths.',

    from: {
      path: PATHS.packages,
    },

    to: {
      path: '^\\.\\./\\.\\./',
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
    ...circularRules,

    ...isolationRules,

    ...layeringRules,

    ...domainProtectionRules,

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
