// packages/build-core/src/workspace/workspace-provider.ts

import type { PackageRoot } from '../package/packages-root.js';

export interface WorkspaceProvider {
  discover(root: string): Promise<PackageRoot[]>;
}
