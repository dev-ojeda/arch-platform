// packages/platform-model/src/ports/output-validator.ts

export interface OutputValidator {
  exists(root: string, outputs: readonly string[]): Promise<boolean>;
}
