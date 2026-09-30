// packages/application/src/use-cases/publish-artifact/create-publish-artifact-use-case.ts

import { PublishArtifactUseCase } from './publish-artifact.use-case.js';
import { PublishCompositionRoot } from './publish-composition-root.js';

export function createPublishArtifactUseCase(workspaceRoot: string): PublishArtifactUseCase {
  const { publicationArtifactReader, publicationEligibilityEvaluator } =
    new PublishCompositionRoot().create(workspaceRoot);

  return new PublishArtifactUseCase(publicationArtifactReader, publicationEligibilityEvaluator);
}
