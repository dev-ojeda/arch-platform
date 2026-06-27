// packages/cli/src/services/checks/check-workspace.ts

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import type { DoctorCheck } from './doctor-check.js';

export const checkWorkspace: DoctorCheck = {
  name: 'workspace',

  async run() {
    const workspacePath = resolve('pnpm-workspace.yaml');

    const exists = existsSync(workspacePath);

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
