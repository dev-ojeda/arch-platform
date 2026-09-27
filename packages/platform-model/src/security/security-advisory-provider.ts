// packages/platform-model/src/security/security-advisory-provider.ts

import type { SecurityAdvisory } from './security-advisory.js';

export interface SecurityAdvisoryProvider {
  getAdvisories(packageName: string, version: string): Promise<readonly SecurityAdvisory[]>;
}
