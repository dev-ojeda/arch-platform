// packages/governance/src/public/compliance-scope.ts

export type ComplianceScope =
  | {
      kind: 'workspace';
      root: string;
    }
  | {
      kind: 'package';
      root: string;
      packageName: string;
    };
