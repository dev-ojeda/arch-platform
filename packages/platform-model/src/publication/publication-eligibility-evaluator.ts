// packages/platform-model/src/publication/publication-eligibility-evaluator.ts

import type { PublicationArtifactContext } from './publication-artifact-context.js';
import type { PublicationEligibility } from './publication-eligibility.js';

export interface PublicationEligibilityEvaluator {
  evaluate(context: PublicationArtifactContext): PublicationEligibility;
}
