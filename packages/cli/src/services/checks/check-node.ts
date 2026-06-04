// packages/cli/src/services/checks/check-node.ts

import type { DoctorCheck } from './doctor-check.js';

export const checkNode: DoctorCheck = {
  name: 'node',

  run() {
    const version = process.version;

    const major = Number(version.replace('v', '').split('.')[0]);

    const supported = major >= 20;

    return Promise.resolve(
      supported
        ? {
            severity: 'info' as const,

            message: `Node version OK (${version})`,
          }
        : {
            severity: 'error' as const,

            message: `Unsupported Node version (${version})`,

            details: ['Node.js 20 or newer is required.'],
          },
    );
  },
};
