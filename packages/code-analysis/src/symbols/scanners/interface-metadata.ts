// packages/code-analysis/src/symbols/scanners/interface-metadata.ts

export interface InterfacePropertyMetadata {
  readonly name: string;

  readonly type: string;
}

export interface InterfaceMetadata {
  readonly name: string;

  readonly sourceFile: string;

  readonly properties: readonly InterfacePropertyMetadata[];
}
