// packages/governance/src/public/governance-scope.ts
export type GovernanceScope =
  | {
      kind: 'workspace';
      root: string;
    }
  | {
      kind: 'package';
      root: string;
      packageName: string;
    }
  | {
      kind: 'changed';
      root: string;
    };
