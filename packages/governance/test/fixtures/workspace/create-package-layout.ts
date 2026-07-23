import type { PackageLayout } from '@arch/platform-model';

export function createPackageLayout(overrides: Partial<PackageLayout> = {}): PackageLayout {
  return {
    sourceDirectory: '/workspace/packages/example/src',
    hasSourceDirectory: true,
    testsDirectory: '/workspace/packages/example/test',
    hasTestsDirectory: true,
    distributionDirectory: '/workspace/packages/example/dist',
    hasDistributionDirectory: true,
    ...overrides,
  };
}
