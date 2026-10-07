// packages/infrastructure/src/versioning/npm-artifact-registry-reader.ts

import type {
  ArtifactRegistryPublishing,
  ArtifactRegistryPublishingReader,
} from '@arch-platform/platform-model';

export class NpmArtifactRegistryReader implements ArtifactRegistryPublishingReader {
  constructor(private readonly registryUrl = 'https://registry.npmjs.org') {}

  async find(
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing | undefined> {
    const packagePath = encodeURIComponent(packageName);
    const url = `${this.registryUrl}/${packagePath}/${encodeURIComponent(version)}`;

    const response = await fetch(url);

    if (response.status === 404) {
      return undefined;
    }

    if (!response.ok) {
      throw new Error(`Npm registry request failed: ${response.status} ${response.statusText}`);
    }

    const metadata = (await response.json()) as {
      name: string;
      version: string;
      dist?: {
        integrity?: string;
      };
    };
    return {
      packageName: metadata.name,
      version: metadata.version,
      integrity: metadata.dist?.integrity,
    };
  }
}
