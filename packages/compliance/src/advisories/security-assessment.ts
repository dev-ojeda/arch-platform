// packages/compliance/src/advisories/security-assessment.ts

export interface SecurityAssessment {
  version: string;
  baseScore: number;
  vectorString: string;
  baseSeverity?: string; // Opcional, ya que CVSS 2.0 no lo incluye
}
export interface TransformedAssessment {
  cvssV: string;
  description: SecurityAssessment;
}
