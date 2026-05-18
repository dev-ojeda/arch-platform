// packages/contracts/src/generation/generation-result.ts
export interface GenerationResult {
  success: boolean;

  generatedFiles: readonly string[];

  duration: number;

  warnings: readonly string[];
}
