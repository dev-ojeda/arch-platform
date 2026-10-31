// packages/platform-model/src/ports/artifact-output-preparer.ts

export interface ArtifactOutputPreparer {
  prepare(root: string, outputs: readonly string[]): Promise<void>;
}
