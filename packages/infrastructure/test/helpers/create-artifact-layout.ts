import type { ArtifactLayout } from '@arch-platform/platform-model';

export function createArtifactLoyout(artifactRoot: '/cache/artifact'): ArtifactLayout {
  return {
    root: artifactRoot,
    manifest: () => `${artifactRoot}/manifest.json`,
    output: (output) => `${artifactRoot}/${output}`,
    temporary: (suffix) => {
      const temporaryArtifactRoot = `${artifactRoot}.${suffix}`;

      return {
        root: temporaryArtifactRoot,
        manifest: () => `${temporaryArtifactRoot}/manifest.json`,
        output: (output) => `${temporaryArtifactRoot}/${output}`,
        temporary: (nestedSuffix) => {
          const nestedRoot = `${temporaryArtifactRoot}.${nestedSuffix}`;

          return {
            root: nestedRoot,
            manifest: () => `${nestedRoot}/manifest.json`,
            output: (output) => `${nestedRoot}/${output}`,
            temporary: () => {
              throw new Error('Unexpected nested temporary layout');
            },
          };
        },
      };
    },
  };
}
