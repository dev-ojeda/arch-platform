import { readdir, readFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import process from 'node:process';

import { Logger } from './git/logger.mjs';

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.git',
  '.turbo',
  '.arch-cache',
]);

const DEFAULT_EXTENSIONS = new Set(['.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs']);
const logger = new Logger();

function parseArguments(args) {
  const options = {
    pattern: undefined,
    root: '.',
    extensions: DEFAULT_EXTENSIONS,
  };

  for (let index = 0; index < args.length; index++) {
    const argument = args[index];

    if (argument === '--root') {
      options.root = args[++index];
    } else if (argument === '--extensions') {
      options.extensions = new Set(
        args[++index].split(',').map((ext) => (ext.startsWith('.') ? ext : `.${ext}`)),
      );
    } else if (!argument.startsWith('--') && !options.pattern) {
      options.pattern = argument;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.pattern) {
    throw new Error(
      'Usage: pnpm search:source -- "<pattern>" [--root packages] [--extensions ts,tsx]',
    );
  }

  return options;
}

async function* findFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue;
      }

      yield* findFiles(fullPath, extensions);
      continue;
    }

    if (entry.isFile() && extensions.has(extname(entry.name))) {
      yield fullPath;
    }
  }
}

async function searchFile(file, expression) {
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);

  for (let index = 0; index < lines.length; index++) {
    expression.lastIndex = 0;

    if (expression.test(lines[index])) {
      logger.info(`${file}:${index + 1}: ${lines[index].trim()}`);
    }
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const expression = new RegExp(options.pattern);

  const root = resolve(options.root);
  let matches = 0;

  for await (const file of findFiles(root, options.extensions)) {
    await searchFile(file, expression);
    matches++;
  }

  console.log(`\nFiles scanned: ${matches}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
