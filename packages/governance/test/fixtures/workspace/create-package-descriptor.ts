import type { PackageDescriptor } from '@arch/platform-model';

import { createPackageLayout } from './create-package-layout.js';

export function createPackageDescriptor(
  overrides: Partial<PackageDescriptor> = {},
): PackageDescriptor {
  return {
    name: '@arch/example',
    rootPath: '/workspace/packages/example',
    manifestPath: '/workspace/packages/example/package.json',
    manifest: {
      name: '@arch/example',
      arch: undefined,
    },
    internalDependencies: [],
    layout: createPackageLayout(),
    ...overrides,
  };
}
