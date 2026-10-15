// packages/application/src/use-cases/publish-artifact/publish-composition-root.ts

import {
  NodeExecutionProcess,
  NpmArtifactRegistryPublisher,
  NpmArtifactRegistryReader,
  PublicationArtifactProvider,
} from '@arch-platform/infrastructure';

import { DefaultPublicationEligibilityEvaluator } from './default-publication-eligibility-evaluator.js';

export class PublishCompositionRoot {
  create(workspaceRoot: string) {
    const process = new NodeExecutionProcess();
    const registryReader = new NpmArtifactRegistryReader();

    return {
      publicationArtifactReader: new PublicationArtifactProvider().createReader(workspaceRoot),

      publicationEligibilityEvaluator: new DefaultPublicationEligibilityEvaluator(),

      artifactRegistryPublisher: new NpmArtifactRegistryPublisher(process, registryReader),
    };
  }
}
