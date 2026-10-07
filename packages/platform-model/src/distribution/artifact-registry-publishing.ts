// packages/platform-model/src/distribution/artifact-registry-publishing.ts

export interface ArtifactRegistryPublishing {
  readonly packageName: string;
  readonly version: string;
  readonly integrity?: string;
  readonly tarball?: string;
}
