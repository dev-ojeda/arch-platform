// packages/governance/src/engine/governance-rule-id.ts

export const GOVERNANCE_RULE_ID = {
  ValidatePackageStructure: 'validate-package-structure',
  ForbiddenDependency: 'forbidden-dependency',
  DetectCycles: 'detect-cycles',
  DetectPrivateBarrel: 'detect-private-barrel',
  DependencyLayer: 'dependency-layer',
  OnlyPublicApi: 'only-public-api',
  WorkspacePackageRule: 'validate-workspace-package-structure',
  TypeOnlyImportRule: 'type-only-import-rule',
  TypeOnlyExportRule: 'type-only-export-rule',
  TestSuccess: 'test-success',
  TestFailure: 'test-failure',
} as const;

export type GovernanceRuleId = (typeof GOVERNANCE_RULE_ID)[keyof typeof GOVERNANCE_RULE_ID];
