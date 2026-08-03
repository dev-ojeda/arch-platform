// packages/code-analysis/src/language/typescript/source/source-scanner.ts

import type { SourceUnit } from './source-unit.js';

export interface SourceScanner<T> {
  scan(source: SourceUnit): readonly T[];
}
