// packages/governance/test/integration/code-analysis-adapter.test.ts

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { CrossPackageRelativeImportScanner, type GovernanceScope } from '@arch/governance';
import type { ArchitectureManifest, WorkspaceDescriptor } from '@arch/platform-model';

import { CodeAnalysisAdapter } from '../../src/analysis/code-analysis/code-analysis-adapter.js';
import { createGovernanceAnalysisContext } from '../../src/analysis/code-analysis/create-governance-analysis-context.js';
import { buildGovernanceContext } from '../../src/context/build-governance-context.js';
import { createPackageDescriptor } from '../fixtures/workspace/create-package-descriptor.js';
import { createPackageDescriptors } from '../fixtures/workspace/create-package-descriptors.js';
import { createPackageLayout } from '../fixtures/workspace/create-package-layout.js';

const fixturePathCodeAnalysis = fileURLToPath(
  new URL('../fixtures/workspaces/code-analysis', import.meta.url),
);
const fixturePathCrossPackageRelativeImport = fileURLToPath(
  new URL('../fixtures/workspaces/cross-package-relative-import', import.meta.url),
);
async function analyzeWorkspace(
  fixturePath: string,
  options: {
    hasPackageManifest?: boolean;
    packages?: WorkspaceDescriptor['packages'];
  } = {},
) {
  const workspaceRoot = resolve(fixturePath);

  const packages =
    options.packages ??
    createPackageDescriptors([
      createPackageDescriptor({
        name: '@fixture/code-analysis',
        rootPath: workspaceRoot,
        manifestPath: `${workspaceRoot}/package.json`,
        layout: createPackageLayout({
          sourceDirectory: `${workspaceRoot}/src`,
          hasDistributionDirectory: false,
          hasTestsDirectory: false,
          tsconfigPath: `${workspaceRoot}/tsconfig.json`,
        }),
      }),
    ]);

  const workspace: WorkspaceDescriptor = {
    root: workspaceRoot,
    layout: {
      packageJsonPath: `${workspaceRoot}/package.json`,
      tsconfigPath: `${workspaceRoot}/tsconfig.json`,
      archManifestPath: '',
      hasPackageManifest: options.hasPackageManifest ?? true,
      hasTsconfig: true,
      hasArchManifest: false,
    },
    packages,
  };

  const archManifest: ArchitectureManifest = {
    schemaVersion: 0,
    workspace: {
      name: '',
    },
    packages: [],
  };
  const scope: GovernanceScope = {
    kind: 'workspace',
    root: workspaceRoot,
  };

  const context = buildGovernanceContext(
    {
      workspaceRoot: scope.root,
    },
    archManifest,
    workspace,
  );

  return createGovernanceAnalysisContext(context, new CodeAnalysisAdapter());
}
function getAnalysis(executionContext: Awaited<ReturnType<typeof analyzeWorkspace>>) {
  const analysis = executionContext.analyses[0]?.analysis;

  expect(analysis).toBeDefined();

  return analysis!;
}
function findImports(
  executionContext: Awaited<ReturnType<typeof analyzeWorkspace>>,
  symbolName: string,
) {
  const analysis = getAnalysis(executionContext);

  return analysis.symbolGraph.edges.filter(
    (edge) => edge.type === 'import' && edge.to.endsWith(`#${symbolName}`),
  );
}
describe('CodeAnalysisAdapter', () => {
  it('builds symbol and package analysis context', async () => {
    const executionContext = await analyzeWorkspace(fixturePathCodeAnalysis, {
      hasPackageManifest: false,
    });

    expect(executionContext.workspace.root).toBe(resolve(fixturePathCodeAnalysis));
    expect(executionContext.scope.kind).toBe('workspace');

    const analysis = getAnalysis(executionContext);

    expect(analysis.symbolGraph.nodes.length).toBeGreaterThan(0);
    expect(analysis.packageGraph).toBeDefined();
  });
  it('detects type-only imports', async () => {
    const executionContext = await analyzeWorkspace(fixturePathCodeAnalysis, {
      hasPackageManifest: false,
    });

    const edges = findImports(executionContext, 'UserService');

    expect(edges.length).toBeGreaterThan(0);

    expect(edges).toContainEqual(
      expect.objectContaining({
        type: 'import',
        metadata: expect.objectContaining({
          moduleSpecifier: './user.service.js',
          isTypeOnly: true,
        }),
      }),
    );
  });
  it('detects type-only imports of runtime symbols', async () => {
    const executionContext = await analyzeWorkspace(fixturePathCodeAnalysis, {
      hasPackageManifest: false,
    });

    const userServiceEdges = findImports(executionContext, 'UserService');

    const orderStatusEdges = findImports(executionContext, 'OrderStatus');

    expect(userServiceEdges).toContainEqual(
      expect.objectContaining({
        type: 'import',
        metadata: expect.objectContaining({
          moduleSpecifier: './user.service.js',
          isTypeOnly: true,
        }),
      }),
    );

    expect(orderStatusEdges).toContainEqual(
      expect.objectContaining({
        type: 'import',
        metadata: expect.objectContaining({
          moduleSpecifier: './model/index.js',
          isTypeOnly: true,
        }),
      }),
    );
    expect(orderStatusEdges).toContainEqual(
      expect.objectContaining({
        type: 'import',
        to: expect.stringContaining('/model/order-status.ts#OrderStatus'),
        metadata: expect.objectContaining({
          moduleSpecifier: './model/index.js',
          isTypeOnly: true,
        }),
      }),
    );
  });
  it('builds cross-package import metadata', async () => {
    const workspaceRoot = resolve(fixturePathCrossPackageRelativeImport);

    const executionContext = await analyzeWorkspace(fixturePathCrossPackageRelativeImport, {
      packages: createPackageDescriptors([
        createPackageDescriptor({
          name: '@fixture/package-a',
          rootPath: `${workspaceRoot}/package-a`,
          manifestPath: `${workspaceRoot}/package-a/package.json`,
          manifest: {
            name: '@fixture/package-a',
          },
          internalDependencies: ['@fixture/package-b'],
          layout: createPackageLayout({
            sourceDirectory: `${workspaceRoot}/package-a/src`,
            hasDistributionDirectory: false,
            hasTestsDirectory: false,
            tsconfigPath: `${workspaceRoot}/package-a/tsconfig.json`,
          }),
        }),
        createPackageDescriptor({
          name: '@fixture/package-b',
          rootPath: `${workspaceRoot}/package-b`,
          manifestPath: `${workspaceRoot}/package-b/package.json`,
          manifest: {
            name: '@fixture/package-b',
            exports: {
              '.': './src/index.ts',
            },
          },
          internalDependencies: [],
          layout: createPackageLayout({
            sourceDirectory: `${workspaceRoot}/package-b/src`,
            hasDistributionDirectory: false,
            hasTestsDirectory: false,
            tsconfigPath: `${workspaceRoot}/package-b/tsconfig.json`,
          }),
        }),
      ]),
    });
    const packageA = executionContext.analyses.find(
      (analysis) => analysis.packageName === '@fixture/package-a',
    );

    expect(packageA).toBeDefined();

    const edge = packageA!.analysis.symbolGraph.edges.find(
      (edge) =>
        edge.type === 'import' &&
        edge.metadata?.moduleSpecifier === '../../package-b/src/user.service.js',
    );
    expect(edge).toBeDefined();
  });
  it('detects cross-package relative imports', async () => {
    const scanner = new CrossPackageRelativeImportScanner();
    const workspaceRoot = resolve(fixturePathCrossPackageRelativeImport);

    const executionContext = await analyzeWorkspace(fixturePathCrossPackageRelativeImport, {
      packages: createPackageDescriptors([
        createPackageDescriptor({
          name: '@fixture/package-a',
          rootPath: `${workspaceRoot}/package-a`,
          manifestPath: `${workspaceRoot}/package-a/package.json`,
          manifest: {
            name: '@fixture/package-a',
          },
          internalDependencies: ['@fixture/package-b'],
          layout: createPackageLayout({
            sourceDirectory: `${workspaceRoot}/package-a/src`,
            hasDistributionDirectory: false,
            hasTestsDirectory: false,
            tsconfigPath: `${workspaceRoot}/package-a/tsconfig.json`,
          }),
        }),
        createPackageDescriptor({
          name: '@fixture/package-b',
          rootPath: `${workspaceRoot}/package-b`,
          manifestPath: `${workspaceRoot}/package-b/package.json`,
          manifest: {
            name: '@fixture/package-b',
            exports: {
              '.': './src/index.ts',
            },
          },
          internalDependencies: [],
          layout: createPackageLayout({
            sourceDirectory: `${workspaceRoot}/package-b/src`,
            hasDistributionDirectory: false,
            hasTestsDirectory: false,
            tsconfigPath: `${workspaceRoot}/package-b/tsconfig.json`,
          }),
        }),
      ]),
    });
    const diagnostics = scanner.scan(executionContext);

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'ARCH_CROSS_PACKAGE_RELATIVE_IMPORT',
        metadata: expect.objectContaining({
          importer: '@fixture/package-a',
          imported: '@fixture/package-b',
          importPath: '../../package-b/src/user.service.js',
        }),
      }),
    );
  });
});
