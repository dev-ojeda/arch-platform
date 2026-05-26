// packages/cli/src/services/checks/check-paths.ts

import fs from 'node:fs';

import type { DoctorCheck } from './doctor-check.js';

const requiredDirectories = ['packages', 'docs'];

export const checkPaths: DoctorCheck = {
  name: 'paths',

  async run() {
    const missingDirectories = requiredDirectories.filter((directory) => !fs.existsSync(directory));

    if (missingDirectories.length > 0) {
      return {
        severity: 'error',

        message: 'Missing required paths',

        details: missingDirectories,
      };
    }

    return {
      severity: 'info',

      message: 'Required paths validated',
    };
  },
};
