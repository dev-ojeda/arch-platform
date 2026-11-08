// packages/platform-model/src/stacks/technology-stack.ts

import type { FrameworkDefinition } from './framework-definition.js';
import type { LanguageDefinition } from './language-definition.js';
import type { ArtifactDefinition } from '../artifact/artifact-definition.js';
import type { CapabilityDefinition } from '../capabilities/capability-definition.js';
import type { ConventionDefinition } from '../conventions/convention-definition.js';
import type { PatternDefinition } from '../patterns/pattern-definition.js';


export interface TechnologyStack {
  id: string;

  name: string;

  language: LanguageDefinition;

  framework?: FrameworkDefinition;

  patterns?: PatternDefinition[];

  capabilities?: CapabilityDefinition[];

  artifacts?: ArtifactDefinition[];

  conventions?: ConventionDefinition[];
}
