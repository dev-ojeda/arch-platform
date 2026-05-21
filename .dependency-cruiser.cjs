/** @type {import("dependency-cruiser").IConfiguration} */

module.exports = {
  forbidden: [
    /**
     * ============================================================
     * CIRCULAR DEPENDENCIES
     * ============================================================
     */

    {
      name: "no-circular",

      comment:
        "Circular dependencies increase coupling and break architectural boundaries.",

      severity: "error",

      from: {},

      to: {
        circular: true,
      },
    },
    {
      name: "packages-no-apps",

      severity: "error",

      from: {
        path: "^packages",
      },

      to: {
        path: "^apps",
      },
    },
    {
      name: "core-isolation",

      severity: "error",

      from: {
        path: "^packages/core/src",
      },

      to: {
        path: "^packages/(application|infrastructure|generators)",
      },
    },
    /**
     * ============================================================
     * LAYERING RULES
     * ============================================================
     */

    {
      name: "contracts-independent",

      comment: "Contracts must remain completely isolated from other layers.",

      severity: "error",

      from: {
        path: "^packages/contracts/src",
      },

      to: {
        pathNot: "^packages/contracts/src",
      },
    },

    {
      name: "core-no-application",

      comment: "Core layer must not depend on application layer.",

      severity: "error",

      from: {
        path: "^packages/core/src",
      },

      to: {
        path: "^packages/application/src",
      },
    },

    {
      name: "application-no-infrastructure",

      comment: "Application layer must not depend directly on infrastructure.",

      severity: "error",

      from: {
        path: "^packages/application/src",
      },

      to: {
        path: "^packages/infrastructure/src",
      },
    },

    {
      name: "application-no-vscode",

      comment: "Application layer must remain editor agnostic.",

      severity: "error",

      from: {
        path: "^packages/application/src",
      },

      to: {
        path: "vscode",
      },
    },

    /**
     * ============================================================
     * DOMAIN PROTECTION
     * ============================================================
     */

    {
      name: "domain-no-node-builtins",

      comment:
        "Domain layers must not depend on Node.js runtime infrastructure.",

      severity: "error",

      from: {
        path: "^packages/(core|contracts|application)/src",
      },

      to: {
        path: "^(fs|fs/promises|child_process|cluster|dgram|net|tls)$",
      },
    },

    /**
     * ============================================================
     * PACKAGE BOUNDARIES
     * ============================================================
     */

    {
      name: "no-internal-imports",

      comment: "Internal modules must not be imported outside their package.",

      severity: "error",

      to: {
        path: "src/internal",
      },
    },

    {
      name: "no-deep-package-imports",

      comment: "Consumers must import from public package entrypoints only.",

      severity: "error",

      from: {
        path: "^packages",
      },

      to: {
        path: "^@arch/.+/src/",
      },
    },

    {
      name: "no-cross-package-relative-imports",

      comment:
        "Cross-package imports must use workspace aliases instead of relative paths.",

      severity: "error",

      from: {
        path: "^packages",
      },

      to: {
        path: "^\\.\\./",
      },
    },

    /**
     * ============================================================
     * GENERATORS
     * ============================================================
     */

    {
      name: "generators-no-filesystem",

      comment: "Generators should not directly manipulate filesystem",

      severity: "warn",

      from: {
        path: "^packages/generators/.+/src",
      },

      to: {
        path: "^(fs|path)$",
      },
    },

    {
      name: "generators-no-infrastructure",

      comment:
        "Generators should depend on ports/contracts instead of infrastructure.",

      severity: "warn",

      from: {
        path: "^packages/generators/src",
      },

      to: {
        path: "^packages/infrastructure/src",
      },
    },

    /**
     * ============================================================
     * TESTING
     * ============================================================
     */

    {
      name: "tests-no-internal-access",

      comment:
        "Tests should avoid coupling to internal implementation details.",

      severity: "warn",

      from: {
        path: "(__tests__|\\.test\\.ts$|\\.spec\\.ts$)",
      },

      to: {
        path: "src/internal",
      },
    },

    /**
     * ============================================================
     * ARCHITECTURE SMELLS
     * ============================================================
     */

    {
      name: "shared-package-warning",

      comment:
        "Shared/common/utils packages tend to become architectural dumping grounds.",

      severity: "info",

      from: {
        path: "^packages",
      },

      to: {
        path: "^packages/(shared|common|utils|helpers)",
      },
    },
  ],

  allowed: [],

  options: {
    /**
     * ============================================================
     * TYPESCRIPT
     * ============================================================
     */

    tsPreCompilationDeps: true,

    combinedDependencies: true,

    /**
     * ============================================================
     * RESOLUTION
     * ============================================================
     */

    enhancedResolveOptions: {
      exportsFields: ["exports"],

      conditionNames: ["import", "require", "node", "default"],

      extensions: [".ts", ".tsx", ".js", ".mjs", ".cjs"],
    },

    /**
     * ============================================================
     * IGNORE
     * ============================================================
     */

    doNotFollow: {
      path: ["node_modules"],
    },

    exclude: {
      path: [
        "node_modules",
        "dist",
        "build",
        "coverage",

        "\\.test\\.ts$",
        "\\.spec\\.ts$",

        "vitest\\.config",
        "tsup\\.config",
        "eslint\\.config",

        "scripts",
        "docs",
      ],
    },

    /**
     * ============================================================
     * REPORTING
     * ============================================================
     */

    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
    },
  },
};
