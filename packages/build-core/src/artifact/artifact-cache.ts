// packages/build-core/src/artifact/artifact-cache.ts

/**
 * Stores and restores build artifacts identified by a cache key.
 *
 * Implementations are responsible for cache semantics, while the
 * underlying persistence mechanism is implementation-specific.
 *
 * Keys are derived from build hashes.
 *
 * Guarantees:
 * - exists() only returns true for valid artifacts.
 * - restore() returns false when an artifact is missing, invalid or incomplete.
 */
export interface ArtifactCache {
  exists(key: string): Promise<boolean>;

  save(key: string, root: string, outputs: string[]): Promise<void>;

  restore(key: string, destination: string): Promise<boolean>;
}
