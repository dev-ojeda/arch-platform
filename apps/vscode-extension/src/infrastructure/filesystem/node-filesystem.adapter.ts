import { promises as fs }
    from 'node:fs';

import type {
    FileSystemPort
} from '@arch/application';

export class NodeFileSystemAdapter
    implements FileSystemPort {

    readFile(
        path: string
    ): Promise<string> {

        return fs.readFile(
            path,
            'utf8'
        );
    }

    async writeFile(
        path: string,
        content: string
    ): Promise<void> {

        await fs.writeFile(
            path,
            content,
            'utf8'
        );
    }

    async createDirectory(
        path: string
    ): Promise<void> {

        await fs.mkdir(path, {
            recursive: true
        });
    }

    async exists(
        path: string
    ): Promise<boolean> {

        try {
            await fs.access(path);

            return true;

        } catch {
            return false;
        }
    }

    async delete(
        path: string
    ): Promise<void> {

        await fs.rm(path, {
            recursive: true,
            force: true
        });
    }

    async readDirectory(
        path: string
    ): Promise<string[]> {

        return fs.readdir(path);
    }
}