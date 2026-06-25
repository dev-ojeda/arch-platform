// packages/code-analysis/src/architecture/architecture-rule-result.ts

export interface ArchitectureViolation {
  fromPackage: string;

  toPackage: string;

  symbol?: string;

  message: string;
}

export interface ArchitectureRuleResult {
  ruleId: string;

  passed: boolean;

  violations: ArchitectureViolation[];
}
