// packages/build-core/src/workspace/read-package-json.ts

import { readTextFileSync } from '../fs/fs-sync.js';
import { safeParse } from '../serialization/safe-stringify.js';

import { isPackageJson, type PackageJson } from './package-json.js';

export function readPackageJson(path: string): PackageJson {
  const raw = readTextFileSync(path);

  const parsed = safeParse(raw);

  if (!isPackageJson(parsed)) {
    throw new Error(`Invalid package.json: ${path}`);
  }

  return parsed;
}
