// packages\build-core\test\__tests__\build-core-public-contracts.test.ts
import { describe, expect, it } from 'vitest';

import type { BuildScope, BuildServiceSummary } from '@arch/build-core';

describe('@arch/build-core public contracts', () => {
  it('should expose public build contracts', () => {
    const scope = {
      kind: 'workspace',
    } satisfies BuildScope;

    const summary = {
      results: [],
      executed: 0,
      restored: 0,
      cached: 0,
      failed: 0,
    } satisfies BuildServiceSummary;

    expect(scope).toBeDefined();
    expect(summary.failed).toBe(0);
  });
});
