// packages/infrastructure/src/workspace/read-package-json.ts

import type { PackageJson } from '@arch/platform-model';

import { readTextFileSync } from '../filesystem/io/fs-sync.js';
import { safeParse } from '../serialization/safe-stringify.js';

export function readPackageJson(path: string): PackageJson {
  const raw = readTextFileSync(path);

  const parsed = safeParse(raw);

  if (!isPackageJson(parsed)) {
    throw new Error(`Invalid package.json: ${path}`);
  }

  return parsed;
}

export function isPackageJson(value: unknown): value is PackageJson {
  return (
    typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string'
  );
}
