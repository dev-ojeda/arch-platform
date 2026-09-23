// packages/platform-model/src/security/security-advisory-affected-versions.ts

export interface SecurityAdvisoryAffectedVersion {
  readonly status: 'affected' | 'unaffected' | 'unknown';
  readonly range: string;
  readonly lessThanOrEqual?: string;
  readonly versionType?: string;
}
