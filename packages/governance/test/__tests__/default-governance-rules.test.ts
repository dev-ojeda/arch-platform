// packages\governance\test\__tests__\default-governance-rules.test.ts

import { describe, expect, it } from 'vitest';

import { createDefaultGovernanceRules } from '../../src/rules/default-governance-rules.js';

describe('createDefaultGovernanceRules', () => {
  it('registers all default rules', () => {
    const rules = createDefaultGovernanceRules();

    expect(rules.map((rule) => rule.name)).toContain('detect-cycles-rule');
  });
});
