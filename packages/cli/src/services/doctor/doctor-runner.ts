// packages/cli/src/services/doctor/doctor-runner.ts

import { logger } from '../../ui/logger.js';
import { checkNode } from '../checks/check-node.js';
import { checkPackageConsistency } from '../checks/check-package-consistency.js';
import { checkPaths } from '../checks/check-paths.js';
import { checkPnpm } from '../checks/check-pnpm.js';
import { checkTsConfig } from '../checks/check-tsconfig.js';
import { checkWorkspace } from '../checks/check-workspace.js';

import type { DoctorCheck } from '../checks/doctor-check.js';

const checks: DoctorCheck[] = [
  checkNode,
  checkPnpm,
  checkWorkspace,
  checkPaths,
  checkTsConfig,
  checkPackageConsistency,
];

export interface DoctorRunResult {
  success: boolean;
}

export async function runDoctor(): Promise<DoctorRunResult> {
  let hasErrors = false;

  for (const check of checks) {
    const result = await check.run();

    switch (result.severity) {
      case 'info': {
        logger.success(`${check.name} - ${result.message}`);
        break;
      }

      case 'warning': {
        logger.info(`${check.name} - ${result.message}`);

        result.details?.forEach((detail) => {
          logger.info(`  - ${detail}`);
        });

        break;
      }

      case 'error': {
        hasErrors = true;

        logger.error(`${check.name} - ${result.message}`);

        result.details?.forEach((detail) => {
          logger.error(`  - ${detail}`);
        });

        break;
      }
    }
  }

  if (hasErrors) {
    process.exitCode = 1;

    return {
      success: false,
    };
  }
  logger.newline();

  logger.success('Doctor completed successfully');

  return {
    success: true,
  };
}
