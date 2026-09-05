// packages\build-core\test\__tests__\build-core-public-entry-points.test.ts
import { describe, expect, it } from 'vitest';

import { BuildApplicationFactory } from '@arch-platform/build-core';

describe('@arch-platform/build-core public API', () => {
  it('should expose build entry points', () => {
    expect(BuildApplicationFactory).toBeDefined();
    expect(typeof BuildApplicationFactory).toBe('function');
  });
});
