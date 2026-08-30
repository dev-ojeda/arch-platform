// packages/governance/src/compliance/compliance-rule-id.ts

export const COMPLIANCE_RULE_ID = {
  ArtifactCompliance: 'artifact-compliance',
} as const;

export type ComplianceRuleId = (typeof COMPLIANCE_RULE_ID)[keyof typeof COMPLIANCE_RULE_ID];
