// packages\governance\src\analysis\code-analysis\code-analysis-adapter.ts

import type { AnalysisContext } from '@arch/code-analysis';
import { analyzeCode } from '@arch/code-analysis';

import type { GovernanceContext } from '../../context/governance-context.js';

import type { AnalysisAdapter } from './analysis-adapter.js';
import { DefaultTsConfigResolver } from './default-tsconfig-resolver.js';
import type { TsConfigResolver } from './tsconfig-resolver.js';
import { WorkspacePackageResolver } from './workspace-package-resolver.js';

export class CodeAnalysisAdapter implements AnalysisAdapter {
  constructor(private readonly resolver: TsConfigResolver = new DefaultTsConfigResolver()) {}

  analyze(context: GovernanceContext): AnalysisContext {
    return analyzeCode({
      tsConfigFilePath: this.resolver.resolve(context),
      packageResolver: new WorkspacePackageResolver(context.packages.all()),
    });
  }
}
