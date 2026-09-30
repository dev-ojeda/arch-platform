// packages/application/src/use-cases/publish-artifact/publish-artifact.use-case.ts

import type {
  ComplianceEnvironment,
  PublicationArtifactReader,
  PublicationEligibilityEvaluator,
} from '@arch-platform/platform-model';

import type { PublishResult } from './publish-result.js';

export interface PublishArtifactInput {
  readonly environment: ComplianceEnvironment;
  readonly artifact: string;
}

export class PublishArtifactUseCase {
  constructor(
    private readonly reader: PublicationArtifactReader,
    private readonly evaluator: PublicationEligibilityEvaluator,
  ) {}

  public async execute(input: PublishArtifactInput): Promise<PublishResult> {
    const startedAt = performance.now();

    const context = await this.reader.read(input.environment, input.artifact);

    if (!context) {
      throw new Error(`Artifact "${input.artifact}" publication state is unavailable`);
    }

    const eligibility = this.evaluator.evaluate(context);

    return {
      success: eligibility.status === 'eligible',
      durationMs: performance.now() - startedAt,
      artifact: input.artifact,
      eligibility,
    };
  }
}
