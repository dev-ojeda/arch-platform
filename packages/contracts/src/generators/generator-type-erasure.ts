// packages/contracts/src/generators/generator-type-erasure.ts

import type { GeneratorDefinition } from './generator-definition.js';
import type { NamedVariables } from '../variables/named-variables.js';


export type RegisteredGeneratorDefinition = GeneratorDefinition<NamedVariables>;
