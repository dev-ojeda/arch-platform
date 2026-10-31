import type { OutputFingerprint } from '@arch-platform/platform-model';

export const expectedOutputFingerprints: OutputFingerprint[] = [
  {
    path: 'dist',
    sizeInBytes: 10,
    integrity: `sha256:${'a'.repeat(64)}`,
  },
];

export const modifiedOutputFingerprints: OutputFingerprint[] = [
  {
    path: 'dist',
    sizeInBytes: 11,
    integrity: `sha256:${'b'.repeat(64)}`,
  },
];
