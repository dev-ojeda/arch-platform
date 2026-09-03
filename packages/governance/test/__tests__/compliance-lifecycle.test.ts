// packages\governance\test\__tests__\compliance-lifecycle.test.ts

import { describe, expect, it } from 'vitest';

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import { resolveComplianceAction } from '../../src/diagnostics/resolved-compliance-action.js';
import { createHashResult } from '../fixtures/compliance/create-hash-result.js';

describe('Compliance lifecycle', () => {
  const hash = createHashResult();

  it('requires evaluation when an artifact enters transition for the first time', () => {
    const change: ComplianceStateChange = {
      environment: 'dev',
      artifact: '@arch/contracts',
      previousStatus: undefined,
      nextStatus: 'transition',
      evaluatedHash: hash,
    };

    expect(resolveComplianceAction([change], [])).toBe('evaluate');
  });

  it('requires evaluation when an approved artifact becomes transition', () => {
    const change: ComplianceStateChange = {
      environment: 'dev',
      artifact: '@arch/contracts',
      previousStatus: 'approved',
      nextStatus: 'transition',
      evaluatedHash: hash,
    };

    expect(resolveComplianceAction([change], [])).toBe('evaluate');
  });

  it('approves an artifact when transition advances to approved', () => {
    const change: ComplianceStateChange = {
      environment: 'dev',
      artifact: '@arch/contracts',
      previousStatus: 'transition',
      nextStatus: 'approved',
      evaluatedHash: hash,
    };

    expect(resolveComplianceAction([change], [])).toBe('approve');
  });

  it('reports none when there are no changes or diagnostics', () => {
    expect(resolveComplianceAction([], [])).toBe('none');
  });

  it('requires evaluation when a warning diagnostic blocks compliance', () => {
    const diagnostic: Diagnostic = {
      code: 'ARCH_DEPENDENCY_NOT_COMPLIANT',
      severity: 'warning',
      message: 'Dependency is not compliant.',
    };

    expect(resolveComplianceAction([], [diagnostic])).toBe('evaluate');
  });

  it('reports none when diagnostics contain no warnings', () => {
    const diagnostic: Diagnostic = {
      code: 'TEST_INFO',
      severity: 'info',
      message: 'Informational diagnostic.',
    };

    expect(resolveComplianceAction([], [diagnostic])).toBe('none');
  });
});
