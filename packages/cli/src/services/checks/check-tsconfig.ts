// packages/cli/src/services/checks/check-tsconfig.ts

import fs from 'node:fs';

import type { DoctorCheck } from './doctor-check.js';

export const checkTsConfig: DoctorCheck = {
  name: 'tsconfig',

  async run() {
    const tsconfigPath = 'tsconfig.json';

    if (!fs.existsSync(tsconfigPath)) {
      return {
        severity: 'error',

        message: 'tsconfig.json missing',

        details: ['Expected file: ./tsconfig.json'],
      };
    }

    try {
      const rawConfig = fs.readFileSync(tsconfigPath, 'utf8');

      JSON.parse(rawConfig);

      return {
        severity: 'info',

        message: 'tsconfig validated',
      };
    } catch (error) {
      return {
        severity: 'error',

        message: 'Invalid tsconfig',

        details: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  },
};
