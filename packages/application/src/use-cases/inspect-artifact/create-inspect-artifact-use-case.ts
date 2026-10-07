// packages/application/src/use-cases/inspect-artifact/create-inspect-artifact-use-case.ts

import { InspectArtifactUseCase } from './inspect-artifact.use-case.js';
import { InspectCompositionRoot } from './inspect-composition-root.js';

export async function createInspectArtifactUseCase(
  fromDirectory: string,
): Promise<InspectArtifactUseCase> {
  const { packReader, distributionWriter, artifactsDirectory } =
    await new InspectCompositionRoot().create(fromDirectory);

  return new InspectArtifactUseCase(packReader, distributionWriter, artifactsDirectory);
}
