// packages\infrastructure\src\filesystem\node-filesystem.adapter.ts
import { promises as fs } from 'node:fs';
import * as path from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts/filesystem';

export class NodeFileSystemAdapter implements FileSystemPort {
  async read(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf8');
  }

  async write(
    filePath: string,

    content: string,

    options?: WriteFileOptions,
  ): Promise<void> {
    const exists = await this.exists(filePath);

    const overwrite = options?.overwrite ?? 'overwrite';

    if (exists) {
      switch (overwrite) {
        case 'skip':
          return;

        case 'error':
          throw new Error(`File already exists: ${filePath}`);

        case 'overwrite':
        default:
          break;
      }
    }

    await this.createDirectory(path.dirname(filePath));

    await fs.writeFile(filePath, content, 'utf8');
  }

  async copy(
    source: string,

    destination: string,
  ): Promise<void> {
    await this.createDirectory(path.dirname(destination));

    await fs.copyFile(source, destination);
  }

  async createDirectory(directoryPath: string): Promise<void> {
    await fs.mkdir(directoryPath, {
      recursive: true,
    });
  }

  async exists(targetPath: string): Promise<boolean> {
    try {
      await fs.access(targetPath);

      return true;
    } catch {
      return false;
    }
  }

  async remove(targetPath: string): Promise<void> {
    await fs.rm(targetPath, {
      recursive: true,
      force: true,
    });
  }

  async readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const entries = await fs.readdir(directoryPath, {
      withFileTypes: true,
    });

    return entries.map((entry) => ({
      name: entry.name,

      path: path.join(directoryPath, entry.name),

      isDirectory: entry.isDirectory(),
    }));
  }
}
