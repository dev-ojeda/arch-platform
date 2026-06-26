// src/context/build-governance-execution-context.ts

import path from 'node:path';

import { buildCodeAnalysisContext } from '../analysis/code-analysis/build-code-analysis-context.js';
import { CodeAnalysisAdapter } from '../analysis/index.js';
import type { GovernanceExecutionContext } from '../types/governance-context.js';

import { buildGovernanceContext } from './build-governance-context.js';

export async function buildGovernanceExecutionContext(
  workspaceRoot: string,
): Promise<GovernanceExecutionContext> {
  const context = await buildGovernanceContext(workspaceRoot);

  return buildCodeAnalysisContext(
    context,
    new CodeAnalysisAdapter(),
    path.join(workspaceRoot, 'tsconfig.json'),
  );
}
