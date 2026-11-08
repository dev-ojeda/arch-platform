// packages/contracts/src/variables/build-types.ts

import type { NamedVariables } from './named-variables.js';
import type { GeneratorDefinition } from '../generators/generator-definition.js';


export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;
