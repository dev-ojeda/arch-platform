// packages/code-analysis/src/symbols/function-metadata.ts

export interface FunctionMetadata {
  readonly name: string;

  readonly parameters: readonly {
    name: string;
    type: string;
  }[];

  readonly returnType: string;

  readonly sourceFile: string;
}
