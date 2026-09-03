// packages/platform-model/src/compliance/events/compliance-event-name.ts

export type ComplianceEventName =
  | 'COMPLIANCE_STARTED'
  | 'COMPLIANCE_COMPLETED'
  | 'COMPLIANCE_FAILED'
  | 'COMPLIANCE_CANCELLED'
  | 'COMPLIANCE_RULE_STARTED'
  | 'COMPLIANCE_RULE_COMPLETED'
  | 'DEPENDENCY_BLOCKED';
