// packages/testing/src/filesystem/create-mock-filesystem.ts

import { vi } from "vitest";

import type {
  DirectoryEntry,
  FileSystemPort,
  WriteFileOptions,
} from "@arch/contracts";

export interface MockFilesystemState {
  files: Map<string, string>;

  directories: Set<string>;
}

export interface MockFilesystem extends FileSystemPort {
  state: MockFilesystemState;
}

export function createMockFilesystem(): MockFilesystem {
  const state: MockFilesystemState = {
    files: new Map<string, string>(),

    directories: new Set<string>(),
  };

  return {
    state,

    read: vi.fn(async (targetPath: string): Promise<string> => {
      const file = state.files.get(targetPath);

      if (file === undefined) {
        throw new Error(`File not found: ${targetPath}`);
      }

      return file;
    }),

    write: vi.fn(
      async (
        targetPath: string,

        content: string,

        _options?: WriteFileOptions
      ): Promise<void> => {
        state.files.set(targetPath, content);
      }
    ),

    copy: vi.fn(
      async (
        source: string,

        destination: string
      ): Promise<void> => {
        const content = state.files.get(source);

        if (content === undefined) {
          throw new Error(`File not found: ${source}`);
        }

        state.files.set(destination, content);
      }
    ),

    createDirectory: vi.fn(async (targetPath: string): Promise<void> => {
      state.directories.add(targetPath);
    }),

    exists: vi.fn(async (targetPath: string): Promise<boolean> => {
      return state.files.has(targetPath) || state.directories.has(targetPath);
    }),

    remove: vi.fn(async (targetPath: string): Promise<void> => {
      state.files.delete(targetPath);

      state.directories.delete(targetPath);
    }),

    readDirectory: vi.fn(
      async (directoryPath: string): Promise<DirectoryEntry[]> => {
        return Array.from(state.files.keys())

          .filter((path) => path.startsWith(directoryPath))

          .map((path) => ({
            name: path.split("/").pop() ?? "",

            path,

            isDirectory: false,
          }));
      }
    ),
  };
}
