// packages/tooling/src/commands/pack/create-pack-arguments.ts

export function createPackArguments(
  outputDirectory: string,
  args: readonly string[] = [],
): string[] {
  return ['pack', '--pack-destination', outputDirectory, ...args];
}
