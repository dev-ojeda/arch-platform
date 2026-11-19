// packages\tooling\src\commands\index.ts

type BuildOptions = Parameters<typeof import('./builder/build.js').buildCommand>[0];

type CleanOptions = Parameters<typeof import('./clean/clean.js').cleanCommand>[0];

type LintOptions = Parameters<typeof import('./lint/lint.js').lintCommand>[0];

type PackOptions = Parameters<typeof import('./pack/pack.js').packCommand>[0];

type TypecheckOptions = Parameters<typeof import('./typecheck/typecheck.js').typecheckCommand>[0];

export async function buildCommand(options: BuildOptions): Promise<number> {
  const { buildCommand } = await import('./builder/build.js');
  return buildCommand(options);
}

export async function cleanCommand(options?: CleanOptions): Promise<number> {
  const { cleanCommand } = await import('./clean/clean.js');
  return cleanCommand(options);
}

export async function lintCommand(options: LintOptions): Promise<number> {
  const { lintCommand } = await import('./lint/lint.js');
  return lintCommand(options);
}

export async function packCommand(options: PackOptions): Promise<number> {
  const { packCommand } = await import('./pack/pack.js');
  return packCommand(options);
}

export async function typecheckCommand(options?: TypecheckOptions): Promise<number> {
  const { typecheckCommand } = await import('./typecheck/typecheck.js');
  return typecheckCommand(options);
}
