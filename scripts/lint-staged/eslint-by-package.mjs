import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Logger } from '../git/logger.mjs';

const logger = new Logger();
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '../..');

const require = createRequire(import.meta.url);
const eslintApiPath = require.resolve('eslint');
const eslintCliPath = resolve(dirname(eslintApiPath), '../bin/eslint.js');

function findPackageRoot(filePath) {
  let currentDirectory = dirname(filePath);

  while (currentDirectory !== repositoryRoot) {
    const manifestPath = resolve(currentDirectory, 'package.json');

    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

      if (typeof manifest.name === 'string' && manifest.name.startsWith('@arch-platform/')) {
        return currentDirectory;
      }
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory) {
      break;
    }

    currentDirectory = parentDirectory;
  }

  return repositoryRoot;
}

function groupFilesByPackage(files) {
  const groups = new Map();

  for (const file of files) {
    const absolutePath = isAbsolute(file) ? resolve(file) : resolve(repositoryRoot, file);

    const packageRoot = findPackageRoot(absolutePath);
    const packageFiles = groups.get(packageRoot) ?? [];

    packageFiles.push(absolutePath);
    groups.set(packageRoot, packageFiles);
  }

  return groups;
}

function runEslint(packageRoot, files) {
  logger.info(`\nESLint cwd: ${packageRoot}`);
  logger.info(`Files: ${files.length}`);

  const result = spawnSync(
    process.execPath,
    [
      eslintCliPath,
      '--fix',
      '--max-warnings',
      '0',
      '--no-warn-ignored',
      '--cache',
      '--cache-strategy',
      'content',
      ...files,
    ],
    {
      cwd: packageRoot,
      stdio: 'inherit',
      windowsHide: true,
    },
  );

  if (result.error) {
    console.error(result.error.message);
    return 1;
  }

  return result.status ?? 1;
}

const files = process.argv.slice(2);

if (files.length === 0) {
  logger.error('No staged file paths received by eslint-by-package.');
  process.exit(1);
}

if (!existsSync(eslintCliPath)) {
  logger.error(`ESLint CLI not found: ${eslintCliPath}`);
  process.exit(1);
}

const groups = groupFilesByPackage(files);
let exitCode = 0;

for (const [packageRoot, packageFiles] of groups) {
  const result = runEslint(packageRoot, packageFiles);

  if (result !== 0) {
    exitCode = result;
  }
}

process.exit(exitCode);
