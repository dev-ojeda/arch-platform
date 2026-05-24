// packages/cli/src/services/checks/check-node.ts

import type { DoctorCheckResult } from '../models/doctor-check-result.js';

export async function checkNode(): Promise<DoctorCheckResult> {
  const version = process.version;

  const major = Number(version.replace('v', '').split('.')[0]);

  const supported = major >= 20;

  return {
    name: 'node',
    success: supported,
    message: supported ? `Node version OK (${version})` : `Unsupported Node version (${version})`,
    details: [],
  };
}
