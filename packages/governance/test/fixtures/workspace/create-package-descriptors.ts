import type { PackageDescriptor } from '@arch/platform-model';

import { createPackageDescriptor } from './create-package-descriptor.js';

export function createPackageDescriptors(
  packages: Partial<PackageDescriptor>[] = [],
): readonly PackageDescriptor[] {
  return packages.map((pkg) => createPackageDescriptor(pkg));
}
