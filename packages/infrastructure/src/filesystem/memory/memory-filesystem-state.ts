export interface MemoryFileSystemState {
  readonly files: ReadonlyMap<string, string>;

  readonly directories: ReadonlySet<string>;
}
