// 📦 Paquetes Core (Packages)/distribution/src/process/process-runner.ts

import { execa } from 'execa';

import type { CommandRunner } from '@arch-platform/build-core';

export const processRunner: CommandRunner = async (command, args, options) => {
  try {
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
