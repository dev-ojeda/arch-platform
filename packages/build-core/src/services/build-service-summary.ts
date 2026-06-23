// packages/build-core/src/services/build-service-summary.ts

import type { BuildResult } from '../cache/cache-types.js';

export type BuildServiceSummary = {
  results: BuildResult[];
  executed: number;
  restored: number;
  cached: number;
  failed: number;
};
