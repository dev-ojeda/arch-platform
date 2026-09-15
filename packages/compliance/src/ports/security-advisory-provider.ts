// packages/compliance/src/ports/security-advisory-provider.ts

import type { SecurityAdvisory } from '../advisories/security-advisory.js';

export interface SecurityAdvisoryProvider {
  getAdvisories(packageName: string, version: string): Promise<readonly SecurityAdvisory[]>;
}
