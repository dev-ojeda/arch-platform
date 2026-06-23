// packages\core\src\generation\index.ts

export { runAfterWriteHook, runBeforeWriteHook } from './engine/generation-hooks.js';
export {
  ensureSafeOutputPath,
  resolveOutputPath,
  sanitizeRelativePath,
} from './output/output-path.js';
export { transformContent } from './transforms/content-transformer.js';
export { buildVariables } from './variables/build-variables.js';
export type { DerivedTemplateVariables, ResolvedTemplateVariables } from './variables/types.js';
