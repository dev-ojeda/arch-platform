import type { WorkspaceDescriptor } from '@arch/platform-model';

export function createIntegrationWorkspace(root: string): WorkspaceDescriptor {
  return {
    root,
    layout: {
      packageJsonPath: `${root}/package.json`,
      tsconfigPath: `${root}/tsconfig.json`,
      hasPackageManifest: false,
      hasTsconfig: true,
    },
    packages: [],
  };
}
