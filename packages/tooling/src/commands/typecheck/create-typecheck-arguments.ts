// packages/tooling/src/commands/typecheck/create-typecheck-arguments.ts

export function createTypecheckArguments(
  configPath: string,
  noEmit: boolean,
  args: readonly string[],
): string[] {
  return ['-p', configPath, ...(noEmit ? ['--noEmit'] : []), ...args];
}
