// packages\compliance\test\__tests__\security-finding.test.ts

import { describe, expect, it } from 'vitest';

import type { SecurityFinding, SecuritySeverity } from '@arch-platform/compliance';

describe('SecurityFinding', () => {
  it('supports a critical vulnerability finding', () => {
    const finding: SecurityFinding = {
      id: 'CVE-2026-0001',
      severity: 'critical',
      category: 'vulnerability',
      message: 'Critical vulnerability detected',
      blocking: true,
    };

    expect(finding.id).toBe('CVE-2026-0001');
    expect(finding.severity).toBe('critical');
    expect(finding.category).toBe('vulnerability');
    expect(finding.blocking).toBe(true);
  });

  it('supports a non-blocking medium finding', () => {
    const severity: SecuritySeverity = 'medium';

    const finding: SecurityFinding = {
      id: 'SEC-0001',
      severity,
      category: 'configuration',
      message: 'Configuration requires review',
      blocking: false,
    };

    expect(finding.severity).toBe('medium');
    expect(finding.blocking).toBe(false);
  });
});
