// packages/build-core/src/artifact/artifact-cache.ts

/**
 * Stores and restores build outputs.
 *
 * Keys are derived from build hashes.
 * Implementations must guarantee that:
 * - exists() only returns true for valid artifacts.
 * - restore() must return false when artifact is missing, invalid or incomplete.
 */
export interface ArtifactCache {
  exists(key: string): Promise<boolean>;

  save(key: string, root: string, outputs: string[]): Promise<void>;

  restore(key: string, destination: string): Promise<boolean>;
}
