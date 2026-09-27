// packages/platform-model/src/publication/publication-block-reason.ts

export type PublicationBlockReason =
  | 'artifact-state-unavailable'
  | 'compliance-not-approved'
  | 'compliance-hash-mismatch'
  | 'security-not-secure'
  | 'security-not-allowed'
  | 'security-hash-mismatch';
