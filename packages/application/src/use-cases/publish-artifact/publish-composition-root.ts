// packages/application/src/use-cases/publish-artifact/publish-composition-root.ts

import { PublicationArtifactProvider } from '@arch-platform/infrastructure';

import { DefaultPublicationEligibilityEvaluator } from './default-publication-eligibility-evaluator.js';

export class PublishCompositionRoot {
  create(workspaceRoot: string) {
    return {
      publicationArtifactReader: new PublicationArtifactProvider().createReader(workspaceRoot),
      publicationEligibilityEvaluator: new DefaultPublicationEligibilityEvaluator(),
    };
  }
}
