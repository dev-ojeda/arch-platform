// packages/infrastructure/src/artifact/adapter/artifact-output-fingerprinter.ts

import type { FileSystemAsyncPort, HashService, PathService } from '@arch-platform/contracts';
import type {
  ArtifactOutputFingerprinterPort,
  OutputFingerprint,
} from '@arch-platform/platform-model';

interface FingerprintedEntry {
  readonly path: string;
  readonly kind: 'file' | 'directory';
  readonly sizeInBytes: number;
  readonly integrity?: string;
}

export class ArtifactOutputFingerprinter implements ArtifactOutputFingerprinterPort {
  constructor(
    private readonly filesystem: FileSystemAsyncPort,
    private readonly pathService: PathService,
    private readonly hashService: HashService,
  ) {}

  async fingerprint(root: string, outputs: readonly string[]): Promise<OutputFingerprint[]> {
    const fingerprints: OutputFingerprint[] = [];

    for (const output of outputs) {
      const target = this.pathService.join(root, output);

      if (!(await this.filesystem.exists(target))) {
        throw new Error(`Cannot fingerprint missing artifact output: ${output}`);
      }

      const kind = await this.getEntryKind(target);

      if (kind === 'file') {
        const content = await this.filesystem.readBuffer(target);

        fingerprints.push({
          path: output,
          sizeInBytes: content.byteLength,
          integrity: `sha256:${this.hashService.hash(content)}`,
        });

        continue;
      }

      const entries = await this.fingerprintDirectory(target);
      const sizeInBytes = entries.reduce((total, entry) => total + entry.sizeInBytes, 0);

      fingerprints.push({
        path: output,
        sizeInBytes,
        integrity: `sha256:${this.hashService.hashObject({
          kind: 'directory',
          entries,
        })}`,
      });
    }

    return fingerprints;
  }

  private async getEntryKind(target: string): Promise<'file' | 'directory'> {
    const parent = this.pathService.dirname(target);
    const name = this.pathService.basename(target);
    const entries = await this.filesystem.readDirectory(parent);
    const entry = entries.find((candidate) => candidate.name === name);

    if (!entry) {
      throw new Error(`Cannot determine artifact output type: ${target}`);
    }

    if (entry.isSymbolicLink) {
      throw new Error(`Symbolic links are not supported as artifact outputs: ${target}`);
    }

    if (entry.isFile) {
      return 'file';
    }

    if (entry.isDirectory) {
      return 'directory';
    }

    throw new Error(`Unsupported artifact output type: ${target}`);
  }

  private async fingerprintDirectory(directory: string): Promise<FingerprintedEntry[]> {
    const entries = await this.filesystem.readDirectory(directory);
    const result: FingerprintedEntry[] = [];

    for (const entry of entries) {
      if (entry.isSymbolicLink) {
        throw new Error(`Symbolic links are not supported in artifact outputs: ${entry.path}`);
      }

      // Construir una ruta física coherente con el directorio que estamos recorriendo.
      // entry.path puede ser una ruta virtual del adaptador.
      const entryPath = this.pathService.join(directory, entry.name);

      const relativePath = this.pathService.relative(directory, entryPath).replace(/\\/g, '/');

      if (entry.isDirectory) {
        result.push({
          path: relativePath,
          kind: 'directory',
          sizeInBytes: 0,
        });

        const children = await this.fingerprintDirectory(entryPath);

        for (const child of children) {
          result.push({
            ...child,
            path: `${relativePath}/${child.path}`,
          });
        }

        continue;
      }

      if (!entry.isFile) {
        throw new Error(`Unsupported artifact entry type: ${entryPath}`);
      }

      const content = await this.filesystem.readBuffer(entryPath);

      result.push({
        path: relativePath,
        kind: 'file',
        sizeInBytes: content.byteLength,
        integrity: `sha256:${this.hashService.hash(content)}`,
      });
    }

    return result.sort((left, right) => left.path.localeCompare(right.path));
  }
}
