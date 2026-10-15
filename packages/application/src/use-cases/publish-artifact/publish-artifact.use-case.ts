// packages/application/src/use-cases/publish-artifact/publish-artifact.use-case.ts

import type {
  ArtifactRegistryPublisher,
  ComplianceEnvironment,
  PublicationArtifactReader,
  PublicationEligibilityEvaluator,
} from '@arch-platform/platform-model';

import { createStopwatch } from '../../helpers/create-stopwatch.js';

import type { PublishResult } from './publish-result.js';

export interface PublishArtifactInput {
  readonly environment: ComplianceEnvironment;
  readonly artifact: string;
  readonly dryRun?: boolean;
}

export class PublishArtifactUseCase {
  constructor(
    private readonly reader: PublicationArtifactReader,
    private readonly evaluator: PublicationEligibilityEvaluator,
    private readonly publisher: ArtifactRegistryPublisher,
  ) {}

  public async execute(input: PublishArtifactInput): Promise<PublishResult> {
    const stopwatch = createStopwatch();
    const context = await this.reader.read(input.environment, input.artifact);

    if (!context) {
      throw new Error(`Artifact "${input.artifact}" publication state is unavailable`);
    }

    const eligibility = this.evaluator.evaluate(context);
    const version = context.artifactDistributionPrepared.version;

    if (eligibility.status !== 'eligible') {
      return {
        success: false,
        durationMs: stopwatch.milliseconds(),
        artifact: input.artifact,
        version,
        eligibility,
        dryRun: input.dryRun ?? false,
      };
    }

    if (input.dryRun) {
      return {
        success: true,
        durationMs: stopwatch.milliseconds(),
        artifact: input.artifact,
        version,
        eligibility,
        dryRun: true,
      };
    }

    const publication = await this.publisher.publish(
      context.artifactDistributionPrepared.file,
      context.artifactDistributionPrepared.packageName,
      version,
    );

    return {
      success: true,
      durationMs: stopwatch.milliseconds(),
      artifact: input.artifact,
      version,
      eligibility,
      dryRun: false,
      publication,
    };
  }
}
