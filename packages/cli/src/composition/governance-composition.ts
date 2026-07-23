// packages/cli/src/composition/governance-composition.ts

import { NodeWorkspaceProvider } from '@arch/infrastructure';

export function createGovernanceDependencies() {
  return {
    workspaceProvider: new NodeWorkspaceProvider(),
  };
}
