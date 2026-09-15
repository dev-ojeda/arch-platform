// packages/compliance/src/advisories/security-advisory-affected-record.ts

export interface SecurityAdvisoryAffectedRecord {
  readonly vendor?: string;
  readonly product?: string;
  readonly packageName?: string;
  readonly platforms?: readonly string[];
  readonly collectionURL?: string;
  readonly repo?: string;
  readonly defaultStatus?: 'affected' | 'unaffected' | 'unknown';
  readonly versions: readonly {
    readonly status: 'affected' | 'unaffected' | 'unknown';
    readonly version: string;
    readonly lessThanOrEqual?: string;
    readonly versionType?: string;
  }[];
}
