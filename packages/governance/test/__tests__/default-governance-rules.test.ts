// packages\governance\test\__tests__\default-governance-rules.test.ts

import { describe, expect, it } from 'vitest';

import { GovernanceCompositionRoot } from '../../src/composition/governance-composition-root.js';

describe('GovernanceCompositionRoot', () => {
  it('creates governance engine', () => {
    const engine = new GovernanceCompositionRoot().create();

    expect(engine).toBeDefined();
  });
});
