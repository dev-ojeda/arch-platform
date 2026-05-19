// packages/platform-model/src/capabilities/capability-definition.ts

import type { ArtifactId, CapabilityId } from "../shared/identifier.js";
import type { Metadata } from "../shared/metadata.js";

export interface CapabilityDefinition extends Metadata {
  requiredArtifacts?: ArtifactId[];

  optionalArtifacts?: ArtifactId[];

  dependencies?: CapabilityId[];

  incompatibleWith?: CapabilityId[];
}
