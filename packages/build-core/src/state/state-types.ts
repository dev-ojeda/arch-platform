// packages/build-core/src/state/state-types.ts

import type { HashResult } from '@arch/platform-model';

import { HASH_SCHEMA_VERSION } from '../hash/hash-schema-version.js';

export interface BuildStateEntry {
  schemaVersion: number;

  hash: HashResult;

  outputs: string[];

  timestamp: number;
}

export type BuildState = Map<string, BuildStateEntry>;

export const CURRENT_SCHEMA_VERSION = HASH_SCHEMA_VERSION;
