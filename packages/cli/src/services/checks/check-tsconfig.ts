// packages/cli/src/services/checks/check-tsconfig.ts

import { existsSync, readFileSync } from 'node:fs';

import type { DoctorCheck } from './doctor-check.js';

export const checkTsConfig: DoctorCheck = {
  name: 'tsconfig',

  async run() {
    const tsconfigPath = 'tsconfig.json';

    if (!existsSync(tsconfigPath)) {
      return {
        severity: 'error',

        message: 'tsconfig.json missing',

        details: ['Expected file: ./tsconfig.json'],
      };
    }

    try {
      const rawConfig = readFileSync(tsconfigPath, 'utf8');

      JSON.parse(rawConfig);
      return Promise.resolve({
        severity: 'info',

        message: 'tsconfig validated',
      });
    } catch (error) {
      return Promise.resolve({
        severity: 'error',

        message: 'Invalid tsconfig',

        details: [error instanceof Error ? error.message : 'Unknown error'],
      });
    }
  },
};
