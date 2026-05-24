// packages/tooling/src/commands/clean.ts

import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { removePath } from '../runtime/remove-path.js';

const cwd = process.cwd();

await Promise.all([removePath(path.join(cwd, 'dist')), removePath(path.join(cwd, 'coverage'))]);

const entries = await readdir(cwd);

await Promise.all(
  entries
    .filter((entry) => entry.endsWith('.tsbuildinfo'))
    .map((entry) => removePath(path.join(cwd, entry))),
);
