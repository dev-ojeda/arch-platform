// packages\governance\test\__tests__\governance-public-entry-points.test.ts
import { describe, expect, it } from 'vitest';

import { runGovernance } from '@arch/governance';

describe('@arch/governance public API', () => {
  it('should expose governance entry points', () => {
    expect(runGovernance).toBeDefined();
    expect(typeof runGovernance).toBe('function');
  });
});
