// packages/build-core/src/public/build-service-summary.ts

import type { BuildResult } from '../executor/build-result.js';

export type BuildServiceSummary = {
  results: BuildResult[];
  executed: number;
  restored: number;
  cached: number;
  failed: number;
};
