// packages/platform-model/src/patterns/pattern-definition.ts

import type {
  ArtifactId,
  CapabilityId,
  ConventionId,
  PatternId,
} from "../shared/identifier.js";
import type { Metadata } from "../shared/metadata.js";

export interface PatternDefinition extends Metadata {
  id: PatternId;

  capabilities?: CapabilityId[];

  artifacts?: ArtifactId[];

  conventions?: ConventionId[];

  dependencies?: PatternId[];

  incompatibleWith?: PatternId[];
}
