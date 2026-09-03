import { describe, expect, it } from 'vitest';

import { DependencyRulesEngine } from '../../src/engine/dependency-rules.engine.js';
import { createGovernanceContext } from '../fixtures/governance/create-governance-context.js';
import { createPackageDescriptor } from '../fixtures/workspace/create-package-descriptor.js';

describe('DependencyRulesEngine', () => {
  it('reports diagnostics for denied layer dependencies', () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/domain',
            manifest: {
              name: '@arch/domain',
              arch: {
                kind: 'domain',
                artifactType: 'runtime',
              },
            },
            internalDependencies: ['@arch/infra'],
          }),

          createPackageDescriptor({
            name: '@arch/infra',
            manifest: {
              name: '@arch/infra',
              arch: {
                kind: 'infra',
                artifactType: 'runtime',
              },
            },
          }),
        ],
      },
    });

    const diagnostics = new DependencyRulesEngine().run(context);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'INVALID_LAYER_DEPENDENCY',
      severity: 'error',
      metadata: {
        from: '@arch/domain',
        to: '@arch/infra',
        fromLayer: 'domain',
        toLayer: 'infra',
      },
    });
  });

  it('allows dependencies permitted by the matrix', () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/application',
            manifest: {
              name: '@arch/application',
              arch: {
                kind: 'app',
                artifactType: 'runtime',
              },
            },
            internalDependencies: ['@arch/domain'],
          }),

          createPackageDescriptor({
            name: '@arch/domain',
            manifest: {
              name: '@arch/domain',
              arch: {
                kind: 'domain',
                artifactType: 'runtime',
              },
            },
          }),
        ],
      },
    });

    const diagnostics = new DependencyRulesEngine().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('ignores packages without an architectural layer', () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/application',
            internalDependencies: ['@arch/infra'],
          }),

          createPackageDescriptor({
            name: '@arch/infra',
            manifest: {
              name: '@arch/infra',
              arch: {
                kind: 'infra',
                artifactType: 'runtime',
              },
            },
          }),
        ],
      },
    });

    const diagnostics = new DependencyRulesEngine().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('ignores dependencies that are not workspace packages', () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/domain',
            manifest: {
              name: '@arch/domain',
              arch: {
                kind: 'domain',
                artifactType: 'runtime',
              },
            },
            internalDependencies: ['external-package'],
          }),
        ],
      },
    });

    const diagnostics = new DependencyRulesEngine().run(context);

    expect(diagnostics).toEqual([]);
  });

  it('ignores dependencies whose target package has no architectural layer', () => {
    const context = createGovernanceContext({
      workspace: {
        root: '/workspace',
        layout: undefined,

        packages: [
          createPackageDescriptor({
            name: '@arch/domain',
            manifest: {
              name: '@arch/domain',
              arch: {
                kind: 'domain',
                artifactType: 'runtime',
              },
            },
            internalDependencies: ['@arch/unknown'],
          }),

          createPackageDescriptor({
            name: '@arch/unknown',
          }),
        ],
      },
    });

    const diagnostics = new DependencyRulesEngine().run(context);

    expect(diagnostics).toEqual([]);
  });
});
