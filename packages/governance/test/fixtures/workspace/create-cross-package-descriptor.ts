import type { WorkspaceDescriptor } from '@arch/platform-model';

import { createPackageDescriptor } from './create-package-descriptor.js';
import { createPackageDescriptors } from './create-package-descriptors.js';
import { createPackageLayout } from './create-package-layout.js';

export function createCrossPackageDescriptors(
  workspaceRoot: string,
): WorkspaceDescriptor['packages'] {
  return createPackageDescriptors([
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
  ]);
}
