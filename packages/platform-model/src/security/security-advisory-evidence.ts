// packages/platform-model/src/security/security-advisory-evidence.ts

export interface SecurityAdvisoryEvidence {
  readonly advisoryId: string;
  readonly packageName: string;
  readonly versionRange: string;
}
