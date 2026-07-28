// packages/contracts/src/variables/build-types.ts

import type { GeneratorDefinition } from '../generators/generator-definition.js';

import type { NamedVariables } from './named-variables.js';

export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;
