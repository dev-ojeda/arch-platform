// packages\contracts\src\filesystem\filesystem.port.ts

import type {
    OverwritePolicy
} from './overwrite-policy.js'

export interface WriteFileOptions {

    overwrite?:
        OverwritePolicy
}

export interface DirectoryEntry {

    name: string

    path: string

    isDirectory: boolean
}

export interface FileSystemPort {

    read(
        path: string
    ): Promise<string>

    write(
        path: string,

        content: string,

        options?: WriteFileOptions
    ): Promise<void>

    copy(
        source: string,

        destination: string
    ): Promise<void>

    createDirectory(
        path: string
    ): Promise<void>

    exists(
        path: string
    ): Promise<boolean>

    remove(
        path: string
    ): Promise<void>

    readDirectory(
        path: string
    ): Promise<DirectoryEntry[]>
}