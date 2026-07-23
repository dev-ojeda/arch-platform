// packages/platform-model/src/package/package-provider.ts

import type { PackageDescriptor } from './package-descriptor.js';

export interface PackageProvider {
  discover(root: string): Promise<readonly PackageDescriptor[]>;
}
