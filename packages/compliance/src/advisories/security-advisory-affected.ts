// packages/compliance/src/advisories/security-advisory-affected.ts

import type { SecurityAdvisoryAffectedVersion } from './security-advisory-affected-versions.js';

export interface SecurityAdvisoryAffected {
  readonly packageName: string;
  readonly vendor?: string;
  readonly product?: string;
  readonly platforms?: readonly string[];
  readonly collectionURL?: string;
  readonly repo?: string;
  readonly defaultStatus?: 'affected' | 'unaffected' | 'unknown';
  readonly versions: readonly SecurityAdvisoryAffectedVersion[];
}
