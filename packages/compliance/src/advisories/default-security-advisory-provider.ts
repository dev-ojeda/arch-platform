// packages/compliance/src/advisories/default-security-advisory-provider.ts

import type { SecurityAdvisoryProvider } from '../ports/security-advisory-provider.js';
import { SecurityVulnerabilityMatcher } from '../security/security-vulnerability-matcher.js';

import type { SecurityAdvisory } from './security-advisory.js';

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
