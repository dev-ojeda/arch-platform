// packages/code-analysis/src/language/typescript/source/source-reader.ts

import type { SourceUnit } from './source-unit.js';

export interface SourceReader {
  getSources(): readonly SourceUnit[];
}
