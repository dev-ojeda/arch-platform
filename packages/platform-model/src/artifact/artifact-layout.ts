// packages/platform-model/src/artifact/artifact-layout.ts

export interface ArtifactLayout {
  readonly root: string;

  manifest(): string;

  /**
   * Returns the storage location for an artifact path.
   * The path may represent either a file or a directory.
   */
  output(path: string): string;

  temporary(suffix: string): ArtifactLayout;
}
