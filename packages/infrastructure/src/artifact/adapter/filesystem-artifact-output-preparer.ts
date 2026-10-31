// packages/infrastructure/src/artifact/adapter/filesystem-artifact-output-preparer.ts

import type { FileSystemAsyncPort, PathService } from '@arch-platform/contracts';
import type { ArtifactOutputPreparer } from '@arch-platform/platform-model';

export class FilesystemArtifactOutputPreparer implements ArtifactOutputPreparer {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
  ) {}

  async prepare(root: string, outputs: readonly string[]): Promise<void> {
    const packageRoot = this.pathService.resolve(root);

    const targets = outputs.map((output) => {
      if (
        output.trim().length === 0 ||
        this.pathService.isAbsolute(output) ||
        /^[a-zA-Z]:/.test(output) ||
        /^(?:[/\\]{2}|[/\\])/.test(output)
      ) {
        throw new Error(
          `Invalid build output path: "${output}". Outputs must be relative to the package root.`,
        );
      }

      const normalizedOutput = output.replace(/\\/g, '/');
      const segments = normalizedOutput.split('/');

      if (segments.includes('..')) {
        throw new Error(
          `Invalid build output path: "${output}". Traversal segments are not allowed.`,
        );
      }

      const target = this.pathService.resolve(packageRoot, output);
      const relative = this.pathService.relative(packageRoot, target).replace(/\\/g, '/');

      // Never allow the output to resolve to the package root itself
      // or to a location outside it.
      if (
        relative === '' ||
        relative === '.' ||
        relative === '..' ||
        relative.startsWith('../') ||
        this.pathService.isAbsolute(relative)
      ) {
        throw new Error(
          `Build output "${output}" resolves outside the allowed output area: "${target}".`,
        );
      }

      return target;
    });
    // Only begin filesystem mutations after every path has passed validation.
    for (const target of targets) {
      if (!(await this.filesystem.exists(target))) {
        await this.filesystem.remove(target);
      }
    }
  }
}
