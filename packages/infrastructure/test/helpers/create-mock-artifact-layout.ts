import { vi } from 'vitest';

import type { ArtifactLayout } from '@arch-platform/platform-model';

export function createMockArtifactLayout(root = '/cache/artifact'): ArtifactLayout {
  const layout: ArtifactLayout = {
    root,
    manifest: () => `${root}/manifest.json`,
    output: (output) => `${root}/${output}`,
    temporary: vi.fn(),
  };

  vi.mocked(layout.temporary).mockImplementation((suffix) =>
    createMockArtifactLayout(`${root}.${suffix}`),
  );

  return layout;
}
