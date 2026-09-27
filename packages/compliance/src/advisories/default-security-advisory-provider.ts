// packages/compliance/src/advisories/default-security-advisory-provider.ts

import type { SecurityAdvisory, SecurityAdvisoryProvider } from '@arch-platform/platform-model';

import { SecurityVulnerabilityMatcher } from '../security/security-vulnerability-matcher.js';

export class DefaultSecurityAdvisoryProvider implements SecurityAdvisoryProvider {
  constructor(
    private readonly advisories: readonly SecurityAdvisory[],
    private readonly matcher: SecurityVulnerabilityMatcher,
  ) {}

  getAdvisories(packageName: string, version: string): Promise<readonly SecurityAdvisory[]> {
    return Promise.resolve(
      this.advisories.filter((advisory) =>
        advisory.affected.some(
          (affected) =>
            affected.packageName === packageName && this.matcher.matchesAdvisory(version, affected),
        ),
      ),
    );
  }
}
