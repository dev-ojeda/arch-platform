// packages/cli/src/services/checks/check-pnpm.ts

import { execSync } from 'node:child_process';

import type { DoctorCheck } from './doctor-check.js';

export const checkPnpm: DoctorCheck = {
  name: 'pnpm',

  async run() {
    try {
      const version = execSync('pnpm --version', {
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .toString()
        .trim();

      return {
        severity: 'info',

        message: `pnpm version OK (${version})`,
      };
    } catch {
      return {
        severity: 'error',

        message: 'pnpm is not installed',

        details: [
          'Install pnpm globally before using arch-platform.',
          'Required version: pnpm >= 10.',
        ],
      };
    }
  },
};
