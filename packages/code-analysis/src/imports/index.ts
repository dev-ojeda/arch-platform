// packages/code-analysis/src/imports/index.ts

export type {
  ImportResolutionType,
  ResolvedImport,
  ResolvedImportReference,
} from './import-types.js';

export { resolveImports } from './import-resolver.js';
