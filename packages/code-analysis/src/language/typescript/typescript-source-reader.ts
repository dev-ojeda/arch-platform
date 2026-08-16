// packages/code-analysis/src/language/typescript/typescript-source-reader.ts

import type { Project } from 'ts-morph';

import type { SourceReader } from './source/source-reader.js';
import type { SourceUnit } from './source/source-unit.js';
import { TypeScriptSourceUnit } from './typescript-source-unit.js';

export class TypeScriptSourceReader implements SourceReader {
  constructor(private readonly project: Project) {}

  getSources(): readonly SourceUnit[] {
    const program = this.project.getProgram().compilerObject;

    return program
      .getRootFileNames()
      .map((filePath) => this.project.getSourceFile(filePath))
      .filter((file): file is NonNullable<typeof file> => file !== undefined)
      .map((file) => new TypeScriptSourceUnit(file));
  }
}
