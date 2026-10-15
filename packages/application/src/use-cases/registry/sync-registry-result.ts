// packages/application/src/use-cases/registry/sync-registry-result.ts

export interface SyncRegistryResult {
  readonly success: boolean;
  readonly durationMs: number;
  readonly scope: string;
  readonly packagesSynchronized: number;
  readonly versionsSynchronized: number;
}
