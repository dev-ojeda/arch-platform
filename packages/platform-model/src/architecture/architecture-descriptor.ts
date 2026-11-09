// packages/platform-model/src/architecture/architecture-descriptor.ts


import type { ArchitectureLayout } from './architecture-layout.js';
import type { ArchitecturePackage } from './architecture-package.js';
import type { WorkspaceDescriptor } from '../workspace/workspace-descriptor.js';

export interface ArchitectureDescriptor {
  readonly root: string;
  readonly layout: ArchitectureLayout;
  readonly workspace: WorkspaceDescriptor;
  readonly packages: readonly ArchitecturePackage[];
}
