// packages/governance/src/engine/governance-rule-id.ts

export const GovernanceRuleId = {
  ValidatePackageStructure: 'validate-package-structure',
  ForbiddenDependency: 'forbidden-dependency',
  DetectCycles: 'detect-cycles',
  DependencyLayer: 'dependency-layer',
  OnlyPublicApi: 'only-public-api',
  WorkspacePackageRule: 'validate-workspace-package-structure',

  TestSuccess: 'test-success',
  TestFailure: 'test-failure',
} as const;

export type GovernanceRuleId = (typeof GovernanceRuleId)[keyof typeof GovernanceRuleId];
