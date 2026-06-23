// packages/build-core/src/workspace/workspace-provider.ts

import type { WorkspacePackage } from './workspace-package.js';

export interface WorkspaceProvider {
  discover(root: string): Promise<WorkspacePackage[]>;
}
