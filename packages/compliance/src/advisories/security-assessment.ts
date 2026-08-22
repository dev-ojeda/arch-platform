// packages/compliance/src/advisories/security-assessment.ts

export interface SecurityAssessment {
  source: string;
  type: 'cvss-v4' | 'cvss-v3' | 'other';
  score?: number;
  vector?: string;
}
