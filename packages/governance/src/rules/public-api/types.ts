// packages/governance/src/rules/public-api/types.ts

export type PublicApiViolationType = 'deep-import' | 'internal-access' | 'not-exported';

export interface PublicApiViolation {
  type: PublicApiViolationType;

  importer: string;

  imported: string;

  packageName: string;

  message: string;
}
