// packages/application/src/use-cases/publish-artifact/publish-artifact.use-case.ts

import type {
  ArtifactLayout,
  ArtifactManifest,
  ArtifactPublisher,
} from '@arch-platform/platform-model';

export interface PublishArtifactInput {
  readonly root: string;
  readonly manifest: ArtifactManifest;
  readonly layout: ArtifactLayout;
}

export class PublishArtifactUseCase {
  public constructor(private readonly publisher: ArtifactPublisher) {}

  public async execute(input: PublishArtifactInput): Promise<void> {
    await this.publisher.publish(input.root, input.manifest, input.layout);
  }
}
