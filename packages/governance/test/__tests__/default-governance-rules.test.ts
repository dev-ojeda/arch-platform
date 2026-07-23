// packages\governance\test\__tests__\default-governance-rules.test.ts

import { describe, expect, it } from 'vitest';

import { createGovernanceRules } from '../../src/composition/governance-rules.js';

describe('createDefaultGovernanceRules', () => {
  it('registers all default rules', () => {
    const rules = createGovernanceRules();

    expect(rules.map((rule) => rule.name)).toContain('detect-cycles-rule');
  });
});
