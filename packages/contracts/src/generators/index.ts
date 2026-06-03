// packages/contracts/src/generators/index.ts

export type { GeneratorCapabilities } from './generator-capabilities.js';
export type { GeneratorDefinition } from './generator-definition.js';
export type { GeneratorDescriptor } from './generator-descriptor.js';
export type { GeneratorHooks } from './generator-hooks.js';
export type { GeneratorModule } from './generator-module.js';
export type { GeneratorRegistry } from './generator-registry.js';
export type { GeneratorRuntime } from './generator-runtime.js';
export type { GeneratorField } from './generator-schema.js';

export { eraseGeneratorType, restoreGeneratorType } from './generator-type-erasure.js';
export type { RegisteredGeneratorDefinition } from './generator-type-erasure.js';
