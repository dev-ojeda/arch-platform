// packages/platform-model/src/artifact/artifact-definition.ts

import type { ArtifactKind } from './artifact-kind.js';
import type { ArtifactId, CapabilityId, ConventionId } from '../shared/identifier.js';
import type { Metadata } from '../shared/metadata.js';


export interface ArtifactDefinition extends Metadata {
  kind: ArtifactKind;

  capabilities?: CapabilityId[];

  conventions?: ConventionId[];

  dependencies?: ArtifactId[];
}
