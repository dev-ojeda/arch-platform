// packages/compliance/src/test/__tests__/advisory-identifier.test.ts

import { describe, expect, it } from 'vitest';

import { AdvisoryIdentifier } from '@arch/compliance';

describe('AdvisoryIdentifier', () => {
  it('creates an identifier from namespace and value', () => {
    const identifier = new AdvisoryIdentifier('GHSA', 'xxxx-yyyy-zzzz');

    expect(identifier.namespace).toBe('GHSA');
    expect(identifier.value).toBe('xxxx-yyyy-zzzz');
  });

  it('creates a CVE identifier', () => {
    const identifier = new AdvisoryIdentifier('CVE', 'CVE-2026-12345');

    expect(identifier.namespace).toBe('CVE');
    expect(identifier.value).toBe('CVE-2026-12345');
  });

  it('rejects an empty namespace', () => {
    expect(() => new AdvisoryIdentifier('', 'CVE-2026-12345')).toThrow();
  });

  it('rejects an empty value', () => {
    expect(() => new AdvisoryIdentifier('CVE', '')).toThrow();
  });

  it('compares identifiers by value', () => {
    const first = new AdvisoryIdentifier('GHSA', 'xxxx-yyyy-zzzz');
    const second = new AdvisoryIdentifier('GHSA', 'xxxx-yyyy-zzzz');
    const different = new AdvisoryIdentifier('CVE', 'CVE-2026-12345');

    expect(first.equals(second)).toBe(true);
    expect(first.equals(different)).toBe(false);
  });
});
