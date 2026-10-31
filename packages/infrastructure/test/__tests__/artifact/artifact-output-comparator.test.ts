import { describe, expect, it } from 'vitest';

import { ArtifactOutputComparator } from '../../../src/artifact/adapter/artifact-output-comparator.js';
import {
  expectedOutputFingerprints,
  modifiedOutputFingerprints,
} from '../../helpers/artifact-output-fingerprint-fixtures.js';

describe('ArtifactOutputComparator', () => {
  it('detects modified outputs', () => {
    const comparator = new ArtifactOutputComparator();

    const result = comparator.compare(expectedOutputFingerprints, modifiedOutputFingerprints);

    expect(result.isIdentical).toBe(false);
    expect(result.diff).toEqual({
      added: [],
      modified: ['dist'],
      deleted: [],
    });
  });
});
