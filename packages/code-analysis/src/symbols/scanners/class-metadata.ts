// packages/code-analysis/src/symbols/scanners/class-metadata.ts

export interface ClassPropertyMetadata {
  readonly name: string;

  readonly type: string;
}

export interface ClassMethodMetadata {
  readonly name: string;

  readonly returnType: string;
}

export interface ClassMetadata {
  readonly name: string;

  readonly sourceFile: string;

  readonly properties: readonly ClassPropertyMetadata[];

  readonly methods: readonly ClassMethodMetadata[];
}
