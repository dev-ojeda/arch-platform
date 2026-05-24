// packages/cli/src/services/checks/check-pnpm.ts
import { execSync } from 'node:child_process';

import type { DoctorCheckResult } from '../models/doctor-check-result.js';

export async function checkPnpm(): Promise<DoctorCheckResult> {
  try {
    const version = execSync('pnpm --version').toString().trim();

    return {
      name: 'pnpm',
      success: true,
      message: `pnpm version OK (${version})`,
      details: [],
    };
  } catch {
    return {
      name: 'pnpm',
      success: false,
      message: 'pnpm is not installed',
      details: [],
    };
  }
}
