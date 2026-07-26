// packages/testing/src/contracts/artifact/create-mock-artifact-layout.ts

import { vi } from 'vitest';

import type { ArtifactLayout } from '@arch/platform-model';

export function createMockArtifactLayout(
  root = '/cache/artifact',
  temporaryLayout?: ArtifactLayout,
): ArtifactLayout {
  const layout: ArtifactLayout = {
    root,
    manifest: () => `${root}/manifest.json`,
    output: (output) => `${root}/${output}`,
    temporary: vi.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  vi.mocked(layout.temporary).mockReturnValue(temporaryLayout ?? layout);

  return layout;
}
