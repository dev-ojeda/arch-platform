// packages/code-analysis/src/language/create-reference-analyzer.ts

import { ReferenceAnalyzer } from './typescript/scanners/reference-analyzer.js';
import { ImportReferenceScanner } from './typescript/scanners/references/import-reference-scanner.js';
import { ParameterTypeReferenceScanner } from './typescript/scanners/references/parameter-type-reference-scanner.js';
import { PropertyTypeReferenceScanner } from './typescript/scanners/references/property-type-reference-scanner.js';
import { ReturnTypeReferenceScanner } from './typescript/scanners/references/return-type-reference-scanner.js';
import type { SourceReader } from './typescript/source/source-reader.js';

export function createReferenceAnalyzer(sourceReader: SourceReader): ReferenceAnalyzer {
  return new ReferenceAnalyzer(sourceReader, [
    new ImportReferenceScanner(),
    new PropertyTypeReferenceScanner(),
    new ParameterTypeReferenceScanner(),
    new ReturnTypeReferenceScanner(),
  ]);
}
