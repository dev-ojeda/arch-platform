// packages/code-analysis/src/language/create-typescript-language.ts

import type { Project } from 'ts-morph';

import type { SourceReader } from './typescript/source/source-reader.js';
import { TypeScriptSourceReader } from './typescript/typescript-source-reader.js';

export function createTypeScriptLanguage(project: Project): SourceReader {
  return new TypeScriptSourceReader(project);
}
