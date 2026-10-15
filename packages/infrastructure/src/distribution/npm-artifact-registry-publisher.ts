// packages/infrastructure/src/distribution/npm-artifact-registry-publisher.ts

import process from 'node:process';

import type {
  ArtifactRegistryPublisher,
  ArtifactRegistryPublishing,
  ArtifactRegistryPublishingReader,
  ExecutionProcess,
} from '@arch-platform/platform-model';

import { loggerFactory } from '../logging/logger.js';

type RegistryVerificationOptions = {
  readonly timeoutMs?: number;
  readonly intervalMs?: number;
  readonly wait?: (milliseconds: number) => Promise<void>;
};

const REGISTRY_VERIFICATION_TIMEOUT_MS = 5 * 60 * 1000;
const REGISTRY_VERIFICATION_INTERVAL_MS = 10 * 1000;

export class NpmArtifactRegistryPublisher implements ArtifactRegistryPublisher {
  private readonly logger = loggerFactory.createLogger({
    component: 'NpmArtifactRegistryPublisher',
  });

  constructor(
    private readonly process: ExecutionProcess,
    private readonly registryReader: ArtifactRegistryPublishingReader,
    private readonly registryUrl = 'https://registry.npmjs.org',
    private readonly verification: RegistryVerificationOptions = {},
  ) {}

  async publish(
    tarball: string,
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing> {
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    this.logger.info('npm.publisher.started', {
      metadata: {
        method: 'publish',
        packageName,
        version,
        registryUrl: this.registryUrl,
      },
    });

    try {
      await this.process.executeInteractive(npmCommand, [
        'publish',
        tarball,
        '--registry',
        this.registryUrl,
        '--access',
        'public',
      ]);
    } catch (error: unknown) {
      this.logger.error('npm.publisher.execution.failed', {
        metadata: {
          method: 'publish',
          packageName,
          version,
          error: error instanceof Error ? error.message : String(error),
        },
      });

      throw error;
    }

    this.logger.info('npm.publisher.execution.completed', {
      metadata: {
        method: 'publish',
        packageName,
        version,
      },
    });

    return this.verifyPublication(packageName, version);
  }

  private async verifyPublication(
    packageName: string,
    version: string,
  ): Promise<ArtifactRegistryPublishing> {
    const timeoutMs = this.verification.timeoutMs ?? REGISTRY_VERIFICATION_TIMEOUT_MS;

    const intervalMs = this.verification.intervalMs ?? REGISTRY_VERIFICATION_INTERVAL_MS;

    const wait =
      this.verification.wait ??
      ((milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));

    const startedAt = performance.now();
    const deadline = startedAt + timeoutMs;
    let attempts = 0;

    this.logger.info('npm.publisher.verification.started', {
      metadata: {
        method: 'verifyPublication',
        packageName,
        version,
        timeoutMs,
        intervalMs,
      },
    });

    while (true) {
      attempts++;

      let publication: ArtifactRegistryPublishing | undefined;
      const elapsedMs = Math.round(performance.now() - startedAt);
      const remainingMs = deadline - performance.now();
      try {
        publication = await this.registryReader.find(packageName, version);
      } catch (error: unknown) {
        this.logger.error('npm.publisher.verification.request.failed', {
          metadata: {
            method: 'verifyPublication',
            packageName,
            version,
            attempts,
            elapsedMs,
            error: error instanceof Error ? error.message : String(error),
          },
        });

        throw error;
      }

      if (publication) {
        this.logger.success('npm.publisher.verification.completed', {
          metadata: {
            method: 'verifyPublication',
            packageName,
            version,
            attempts,
            elapsedMs,
          },
        });

        return publication;
      }

      if (remainingMs <= 0) {
        this.logger.warn('npm.publisher.verification.timeout', {
          metadata: {
            method: 'verifyPublication',
            packageName,
            version,
            attempts,
            timeoutMs,
            elapsedMs,
            reason: 'verification-timeout',
          },
        });

        throw new Error(
          `npm publish succeeded, but registry publication could not be verified for "${packageName}@${version}"`,
        );
      }

      await wait(Math.min(intervalMs, remainingMs));
    }
  }
}
