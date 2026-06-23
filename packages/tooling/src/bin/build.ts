// packages/tooling/src/bin/build.ts
import { buildCommand } from '../commands/build.js';
import { logger } from '../logging/logger.js';

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;

  const value = process.argv[index + 1];
  if (!value || value.startsWith('-')) return undefined;

  return value;
}

const packageName = getArg('--package');

if (!packageName) {
  logger.error('[build-dev] missing required argument: --package');
  process.exit(1);
}

try {
  process.exitCode = await buildCommand(packageName);
} catch (error) {
  logger.error('[build-dev] fatal error:', {
    metadata: {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : String(error),
    },
  });

  process.exitCode = 1;
}
