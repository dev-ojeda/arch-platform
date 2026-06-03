// packages/cli/src/services/checks/check-workspace.ts

import fs from 'node:fs';
import path from 'node:path';

import type { DoctorCheck } from './doctor-check.js';

export const checkWorkspace: DoctorCheck = {
  name: 'workspace',

  async run() {
    const workspacePath = path.resolve('pnpm-workspace.yaml');

    const exists = fs.existsSync(workspacePath);

    if (exists) {
      return Promise.resolve({
        severity: 'info',

        message: 'pnpm-workspace.yaml found',
      });
    }
    return Promise.resolve({
      severity: 'error',

      message: 'pnpm-workspace.yaml missing',

      details: ['Run this command from the workspace root.'],
    });
  },
};
