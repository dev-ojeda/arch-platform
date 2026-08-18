// packages/code-analysis/src/application/analysis-request.ts

import type { PackageResolver } from '../package/resolvers/package-resolver.js';

export interface AnalysisRequest {
  readonly tsConfigFilePath?: string;
  readonly packageResolver?: PackageResolver;
}
