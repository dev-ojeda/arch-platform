// packages/code-analysis/src/project/compiler-options.ts

import { ModuleKind, ScriptTarget } from 'typescript';

export function createCompilerOptions() {
  return {
    target: ScriptTarget.ES2022,
    module: ModuleKind.ESNext,
    declaration: true,
    skipLibCheck: true,
  };
}
