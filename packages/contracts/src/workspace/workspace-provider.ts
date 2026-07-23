// packages/contracts/src/workspace/workspace-provider.ts

export interface WorkspaceProvider {
  findRoot(fromDirectory: string): string;
}
