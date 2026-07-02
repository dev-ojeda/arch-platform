// packages\build-core\src\cache\cache-types.ts

export type ChangeReason =
  | 'none'
  | 'source'
  | 'dependency'
  | 'first-build'
  | 'cache-version'
  | 'config'
  | 'dependency-failed'
  | 'missing-output';

export type CacheDecision = 'hit' | 'miss' | 'stale' | 'invalid' | 'restore';

export type CacheAction = 'restore' | 'none';
