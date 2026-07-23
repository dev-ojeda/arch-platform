// packages/platform-model/src/workspace/workspace-layout.ts

export interface WorkspaceLayout {
  readonly packageJsonPath: string;
  readonly tsconfigPath: string;

  readonly hasPackageManifest: boolean;
  readonly hasTsconfig: boolean;
}
