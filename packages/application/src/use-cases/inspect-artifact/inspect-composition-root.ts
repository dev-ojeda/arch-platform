// packages/application/src/use-cases/inspect-artifact/inspect-composition-root.ts

import {
  ArtifactDistributionPreparedProvider,
  NodePathService,
  NodeWorkspaceProvider,
  PackArtifactInspectProvider,
} from '@arch-platform/infrastructure';

export class InspectCompositionRoot {
  async create(fromDirectory: string) {
    const workspace = await new NodeWorkspaceProvider().discover(fromDirectory);

    const pathService = new NodePathService();

    const packArtifactInspectProvider = new PackArtifactInspectProvider();

    const packReader = packArtifactInspectProvider.createReaderForWorkspace(workspace.root);

    const distributionProvider = new ArtifactDistributionPreparedProvider();

    const distributionWriter = await distributionProvider.createWriterForWorkspace(workspace.root);

    return {
      packReader,
      distributionWriter,
      artifactsDirectory: pathService.join(workspace.root, 'artifacts'),
    };
  }
}
