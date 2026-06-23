// packages/tooling/src/runtime/command-runner.ts

import type { CommandRunner } from '@arch/build-core';
import { execa } from 'execa';

import { logger } from '../logging/logger.js';

export const commandRunner: CommandRunner = async (command, args, options) => {
  try {
    logger.trace('executing command', {
      metadata: {
        command,
        args,
        cwd: options.cwd,
      },
    });
    const result = await execa(command, args, {
      cwd: options.cwd,
      encoding: 'utf8',
    });

    return {
      exitCode: result.exitCode ?? 0,
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
    };
  } catch (error) {
    const err = error as {
      exitCode?: number;
      stdout?: string;
      stderr?: string;
    };

    return {
      exitCode: err.exitCode ?? 1,
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? String(error),
    };
  }
};
