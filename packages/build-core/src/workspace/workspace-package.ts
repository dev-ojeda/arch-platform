// packages/build-core/src/workspace/workspace-package.ts

export interface WorkspacePackage {
  name: string;
  root: string;
  dependencies: string[];
  outputs: string[];
}
