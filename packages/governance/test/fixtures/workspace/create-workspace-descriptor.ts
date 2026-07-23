import type { WorkspaceDescriptor } from '@arch/platform-model';

import { createPackageDescriptor } from './create-package-descriptor.js';
import { createWorkspaceLayout } from './create-workspace-layout.js';

export function createWorkspaceDescriptor(
  overrides: Partial<WorkspaceDescriptor> = {},
): WorkspaceDescriptor {
  return {
    root: '/workspace',
    layout: createWorkspaceLayout(),
    packages: [createPackageDescriptor()],
    ...overrides,
  };
}
