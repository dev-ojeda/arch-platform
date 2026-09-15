// packages\compliance\test\__tests__\security-advisory-affected-adapter.test.ts

import { describe, expect, it } from 'vitest';

import { SecurityAdvisoryAffectedAdapter } from '@arch-platform/compliance';

import {
  securityAdvisoryAffectedRecordFixtureCVE13149,
  securityAdvisoryAffectedRecordFixtureCVE14257,
  securityAdvisoryAffectedRecordFixtureCVE69152,
} from '../fixture/create-security-advisory-affected-record.js';

describe('SecurityAdvisoryAffectedAdapter', () => {
  const adapter = new SecurityAdvisoryAffectedAdapter();

  it('normalizes CVE-2026-13149', () => {
    const result = adapter.advisoryAffected(securityAdvisoryAffectedRecordFixtureCVE13149);

    expect(result).toMatchObject({
      packageName: 'brace-expansion',
      vendor: 'juliangruber',
      product: 'brace-expansion',
      collectionURL: 'https://registry.npmjs.org',
      repo: 'https://github.com/juliangruber/brace-expansion',
    });

    expect(result.versions).toEqual([
      {
        status: 'affected',
        range: '<=5.0.6',
        versionType: 'semver',
      },
    ]);
  });

  it('normalizes CVE-2026-14257', () => {
    const result = adapter.advisoryAffected(securityAdvisoryAffectedRecordFixtureCVE14257);

    expect(result).toMatchObject({
      packageName: 'brace-expansion',
      vendor: 'juliangruber',
      product: 'brace-expansion',
      platforms: ['Linux', 'macOS', 'Windows'],
      collectionURL: 'https://www.npmjs.com/package/brace-expansion',
    });

    expect(result.versions).toEqual([
      {
        status: 'affected',
        range: '<=5.0.7',
        versionType: 'semver',
      },
    ]);
  });

  it('normalizes CVE-2026-69152 using product as package name', () => {
    const result = adapter.advisoryAffected(securityAdvisoryAffectedRecordFixtureCVE69152);

    expect(result).toMatchObject({
      packageName: 'brace-expansion',
      vendor: 'juliangruber',
      product: 'brace-expansion',
    });

    expect(result.versions).toEqual([
      {
        status: 'affected',
        range: '< 1.1.18',
        versionType: 'semver',
      },
      {
        status: 'affected',
        range: '>= 2.0.0 < 2.1.4',
        versionType: 'semver',
      },
      {
        status: 'affected',
        range: '>= 3.0.0 < 3.0.6',
        versionType: 'semver',
      },
      {
        status: 'affected',
        range: '>= 4.0.0 < 5.0.9',
        versionType: 'semver',
      },
    ]);
  });
});
