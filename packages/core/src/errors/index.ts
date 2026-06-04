export { BaseError, type ErrorOptions } from './base/base-error.js';
export { FILESYSTEM_ERROR_CODES, type FilesystemErrorCode } from './codes/filesystem.codes.js';
export { GENERATION_ERROR_CODES, type GenerationErrorCode } from './codes/generation.codes.js';
export { REGISTRY_ERROR_CODES, type RegistryErrorCode } from './codes/registry.codes.js';
export { RUNTIME_ERROR_CODES, type RuntimeErrorCode } from './codes/runtime.codes.js';
export { VALIDATION_ERROR_CODES, type ValidationErrorCode } from './codes/validation.codes.js';
export { FilesystemError } from './filesystem/filesystem-error.js';
export {
  InvalidPathError,
  type InvalidPathMetadata,
} from './filesystem/filesystem-invalid-path.error.js';
export {
  GenerationCancelledError,
  type GenerationCancelledMetadata,
} from './generation/generation-cancelled.error.js';
export { GenerationError } from './generation/generation-errors.js';
export {
  DuplicateGeneratorError,
  type DuplicateGeneratorMetadata,
} from './registry/duplicate-generator.error.js';
export {
  GeneratorNotFoundError,
  type GeneratorNotFoundMetadata,
} from './registry/generator-not-found.error.js';
export {
  LanguageNotFoundError,
  type LanguageNotFoundMetadata,
} from './registry/language-not-found.error.js';
export { RegistryError } from './registry/registry-errors.js';
export {
  InvalidGeneratorDefinitionError,
  type InvalidGeneratorDefinitionMetadata,
} from './validation/invalid-generator-definition.error.js';
export { ValidationError } from './validation/validation-errors.js';
