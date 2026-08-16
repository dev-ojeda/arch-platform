import type { WorkspaceLayout } from '@arch/platform-model';

export function createWorkspaceLayout(overrides: Partial<WorkspaceLayout> = {}): WorkspaceLayout {
  return {
    packageJsonPath: '/workspace/package.json',
    tsconfigPath: '/workspace/tsconfig.json',
    archManifestPath: '/workspace/config/arch.manifest.json',
    hasPackageManifest: true,
    hasTsconfig: true,
    hasArchManifest: true,
    ...overrides,
  };
}
