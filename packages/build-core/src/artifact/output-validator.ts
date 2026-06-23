// packages/build-core/src/artifact/output-validator.ts

export interface OutputValidator {
  exists(root: string, outputs: string[]): boolean;
}
