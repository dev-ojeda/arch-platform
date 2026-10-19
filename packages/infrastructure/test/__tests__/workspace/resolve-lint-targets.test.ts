import { describe, expect, it } from 'vitest';

import type { PackageDescriptor, WorkspaceDescriptor } from '@arch-platform/platform-model';

import { resolveLintTargets } from '../../../src/workspace/resolve-lint-targets.js';

function createWorkspace(overrides: Partial<WorkspaceDescriptor> = {}): WorkspaceDescriptor {
  const packageLayout = {
    sourceDirectory: '/workspace/packages/example/src',
    hasSourceDirectory: true,
    testsDirectory: '/workspace/packages/example/test',
    hasTestsDirectory: true,
    distributionDirectory: '/workspace/packages/example/dist',
    hasDistributionDirectory: true,
    tsconfigPath: '/workspace/packages/example/tsconfig.json',
    hasTsconfig: true,
  };

  const packageDescriptor: PackageDescriptor = {
    rootPath: '/workspace/packages/example',
    name: '@arch/example',
    layout: packageLayout,
    manifestPath: '',
    manifest: undefined,
    internalDependencies: [],
  };

  return {
    root: '/workspace',
    layout: {
      packageJsonPath: '/workspace/package.json',
      tsconfigPath: '/workspace/tsconfig.json',
      archManifestPath: '/workspace/config/arch.manifest.json',
      hasPackageManifest: true,
      hasTsconfig: true,
      hasArchManifest: true,
      scriptPath: '/workspace/scripts/git',
      hasScriptPath: true,
    },
    packages: [packageDescriptor],
    ...overrides,
  };
}

describe('resolveLintTargets', () => {
  it('includes workspace scripts for a global lint', () => {
    expect(resolveLintTargets(createWorkspace())).toEqual([
      '/workspace/packages/example/src',
      '/workspace/packages/example/test',
      '/workspace/scripts/git',
    ]);
  });

  it('omits workspace scripts when the directory is absent', () => {
    const workspace = createWorkspace({
      layout: {
        ...createWorkspace().layout,
        hasScriptPath: false,
      },
    });

    expect(resolveLintTargets(workspace)).toEqual([
      '/workspace/packages/example/src',
      '/workspace/packages/example/test',
    ]);
  });

  it('does not include workspace scripts for package-specific lint', () => {
    expect(resolveLintTargets(createWorkspace(), '@arch/example')).toEqual([
      '/workspace/packages/example/src',
      '/workspace/packages/example/test',
    ]);
  });

  it('includes only directories enabled by the package layout', () => {
    const workspace = createWorkspace({
      packages: [
        {
          ...createWorkspace().packages[0],
          layout: {
            ...createWorkspace().packages[0].layout,
            hasTestsDirectory: false,
          },
        },
      ],
    });

    expect(resolveLintTargets(workspace)).toEqual([
      '/workspace/packages/example/src',
      '/workspace/scripts/git',
    ]);
  });

  it('returns an empty list for an unknown package', () => {
    expect(resolveLintTargets(createWorkspace(), '@arch/missing')).toEqual([]);
  });
});
