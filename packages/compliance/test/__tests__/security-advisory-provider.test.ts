// packages\compliance\test\__tests__\security-advisory-provider.test.ts

import { describe, expect, it } from 'vitest';

import type { SecurityAdvisory } from '@arch-platform/platform-model';

import { DefaultSecurityAdvisoryProvider } from '../../src/advisories/default-security-advisory-provider.js';
import { SecurityVulnerabilityMatcher } from '../../src/security/security-vulnerability-matcher.js';

describe('DefaultSecurityAdvisoryProvider', () => {
  const advisory: SecurityAdvisory = {
    identifiers: [
      {
        namespace: 'CVE',
        value: 'CVE-2026-13149',
      },
    ],
    affected: [
      {
        packageName: 'brace-expansion',
        versions: [
          {
            status: 'affected',
            range: '<=5.0.6',
            versionType: 'semver',
          },
        ],
      },
    ],
    cweIds: [],
  };

  it('returns advisories affecting the package version', async () => {
    const provider = new DefaultSecurityAdvisoryProvider(
      [advisory],
      new SecurityVulnerabilityMatcher(),
    );

    const result = await provider.getAdvisories('brace-expansion', '5.0.6');

    expect(result).toHaveLength(1);
  });
  it('does not return advisories for a patched package version', async () => {
    const provider = new DefaultSecurityAdvisoryProvider(
      [advisory],
      new SecurityVulnerabilityMatcher(),
    );

    const result = await provider.getAdvisories('brace-expansion', '5.0.7');

    expect(result).toEqual([]);
  });

  it('does not return advisories for an unknown package', async () => {
    const provider = new DefaultSecurityAdvisoryProvider(
      [advisory],
      new SecurityVulnerabilityMatcher(),
    );

    const result = await provider.getAdvisories('other-package', '5.0.6');

    expect(result).toEqual([]);
  });
});
