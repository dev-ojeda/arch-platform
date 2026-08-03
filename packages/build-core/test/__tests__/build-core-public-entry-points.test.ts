// packages\build-core\test\__tests__\build-core-public-entry-points.test.ts
import { describe, expect, it } from 'vitest';

import { BuildApplicationFactory } from '@arch/build-core';

describe('@arch/build-core public API', () => {
  it('should expose build entry points', () => {
    expect(BuildApplicationFactory).toBeDefined();
    expect(typeof BuildApplicationFactory).toBe('function');
  });
});
