// packages/tooling/src/commands/lint/create-lint-arguments.ts

export function createLintArguments(
  targets: readonly string[],
  maxWarnings: number,
  additionalArguments: readonly string[] = [],
): string[] {
  return [...targets, '--max-warnings', String(maxWarnings), ...additionalArguments];
}
