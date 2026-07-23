import type { WorkspaceLayout } from '@arch/platform-model';

export function createWorkspaceLayout(overrides: Partial<WorkspaceLayout> = {}): WorkspaceLayout {
  return {
    packageJsonPath: '/workspace/package.json',
    tsconfigPath: '/workspace/tsconfig.json',
    hasPackageManifest: true,
    hasTsconfig: true,
    ...overrides,
  };
}
