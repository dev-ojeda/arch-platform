// packages/contracts/src/generators/generator-type-erasure.ts

import type { NamedVariables } from '../variables/named-variables.js';

import type { GeneratorDefinition } from './generator-definition.js';

export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;
