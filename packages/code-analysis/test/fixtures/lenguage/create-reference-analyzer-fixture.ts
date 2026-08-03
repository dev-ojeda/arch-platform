import { createReferenceAnalyzer } from '../../../src/language/create-reference-analyzer.js';
import type { ReferenceAnalyzer } from '../../../src/language/typescript/scanners/reference-analyzer.js';

import { createSourceReader } from './create-source-reader-fixture.js';

export function createReferenceAnalyzerFixture(tsconfig: string): ReferenceAnalyzer {
  return createReferenceAnalyzer(createSourceReader(tsconfig));
}
