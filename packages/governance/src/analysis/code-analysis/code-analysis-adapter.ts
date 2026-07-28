// code-analysis-adapter.ts

import { buildAnalysisContext, createTsProject } from '@arch/code-analysis';
import type { AnalysisContext } from '@arch/code-analysis';

import type { GovernanceContext } from '../../context/governance-context.js';

import type { AnalysisAdapter } from './analysis-adapter.js';
import { DefaultTsConfigResolver } from './default-tsconfig-resolver.js';
import type { TsConfigResolver } from './tsconfig-resolver.js';

export class CodeAnalysisAdapter implements AnalysisAdapter {
  constructor(private readonly resolver: TsConfigResolver = new DefaultTsConfigResolver()) {}

  analyze(context: GovernanceContext): AnalysisContext {
    const project = createTsProject({
      tsConfigFilePath: this.resolver.resolve(context),
    });

    return buildAnalysisContext(project);
  }
}
