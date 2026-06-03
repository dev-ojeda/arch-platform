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
      return Promise.resolve({
        severity: 'info',

        message: `pnpm version OK (${version})`,
      });
    } catch {
      return Promise.resolve({
        severity: 'error',

        message: 'pnpm is not installed',

        details: [
          'Install pnpm globally before using arch-platform.',
          'Required version: pnpm >= 10.',
        ],
      });
    }
  },
};
