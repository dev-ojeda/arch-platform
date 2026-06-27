// packages\infrastructure\src\filesystem\node-filesystem.adapter.ts
import { access, copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import type { DirectoryEntry, FileSystemPort, WriteFileOptions } from '@arch/contracts';

export class NodeFileSystemAdapter implements FileSystemPort {
  async read(filePath: string): Promise<string> {
    return await readFile(filePath, 'utf8');
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

    await this.createDirectory(dirname(filePath));

    await writeFile(filePath, content, 'utf8');
  }

  async copy(
    source: string,

    destination: string,
  ): Promise<void> {
    await this.createDirectory(dirname(destination));

    await copyFile(source, destination);
  }

  async createDirectory(directoryPath: string): Promise<void> {
    await mkdir(directoryPath, {
      recursive: true,
    });
  }

  async exists(targetPath: string): Promise<boolean> {
    try {
      await access(targetPath);

      return true;
    } catch {
      return false;
    }
  }

  async remove(targetPath: string): Promise<void> {
    await rm(targetPath, {
      recursive: true,
      force: true,
    });
  }

  async readDirectory(directoryPath: string): Promise<DirectoryEntry[]> {
    const entries = await readdir(directoryPath, {
      withFileTypes: true,
    });

    return entries.map((entry) => ({
      name: entry.name,

      path: join(directoryPath, entry.name),

      isDirectory: entry.isDirectory(),
    }));
  }
}
