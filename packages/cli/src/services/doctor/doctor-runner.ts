// packages/cli/src/services/doctor/doctor-runner.ts
import { error, info, success } from '../../utils/logger.js';
import { checkNode } from '../checks/check-node.js';
import { checkPackageConsistency } from '../checks/check-package-consistency.js';
import { checkPaths } from '../checks/check-paths.js';
import { checkPnpm } from '../checks/check-pnpm.js';
import { checkTsConfig } from '../checks/check-tsconfig.js';
import { checkWorkspace } from '../checks/check-workspace.js';
import type { DoctorCheckResult } from '../models/doctor-check-result.js';

const checks: Array<() => Promise<DoctorCheckResult>> = [
  checkNode,
  checkPnpm,
  checkWorkspace,
  checkPaths,
  checkTsConfig,
  checkPackageConsistency,
];

export async function runDoctor(): Promise<void> {
  let hasErrors = false;

  for (const check of checks) {
    const result = await check();

    if (result.success) {
      success(`${result.message}`);
    } else {
      hasErrors = true;
      error(`${result.message}`);

      result.details?.forEach((detail) => {
        error(` - ${detail}`);
      });
    }
  }

  if (hasErrors) {
    process.exitCode = 1;
    return;
  }

  info('\nDoctor completed successfully');
}
