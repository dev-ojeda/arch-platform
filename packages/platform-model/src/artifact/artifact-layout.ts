// packages/platform-model/src/artifact/artifact-layout.ts

export interface ArtifactLayout {
  readonly root: string;

  manifest(): string;

  output(path: string): string;

  temporary(suffix: string): ArtifactLayout;
}
