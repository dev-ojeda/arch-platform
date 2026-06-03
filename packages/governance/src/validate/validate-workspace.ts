// packages/governance/src/validate/validate-workspace.ts

import { DiagnosticEngine } from '../diagnostics/diagnostic-engine.js';
import type { Diagnostic } from '../diagnostics/diagnostic.js';
import { PackageJsonRule } from '../rules/package-json-rule.js';
import { buildGovernanceContext } from '../workspace/build-governance-context.js';

export async function validateWorkspace(workspaceRoot: string): Promise<Diagnostic[]> {
  const context = await buildGovernanceContext(workspaceRoot);

  const engine = new DiagnosticEngine([new PackageJsonRule()]);

  return engine.run(context);
}
