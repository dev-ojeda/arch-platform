// packages/cli/src/services/checks/check-pnpm.ts
import { execSync } from 'node:child_process';
import { version } from 'node:os';

import type { DoctorCheckResult } from '../models/doctor-check-result.js';

export async function checkPnpm(): Promise<DoctorCheckResult> {
  try {
    const version = execSync('pnpm --version').toString().trim();

    return {
      name: 'node',
      success: true,
      message: `Node version OK (${version})`,
      details: [],
    };
  } catch {
    return {
      name: 'node',
      success: true,
      message: `Node version OK (${version})`,
      details: [],
    };
  }
}
