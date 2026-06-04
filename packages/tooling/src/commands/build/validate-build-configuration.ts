// packages/tooling/src/commands/build/validate-build-configuration.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { fileExists } from '../../utils/file-exists.js';
import { logger } from '../../utils/logger.js';

export function validateBuildConfiguration(
  configPath: string,
  declarationsConfigPath: string,
): boolean {
  if (!fileExists(configPath)) {
    logger.warn(ToolingEvents.build.skipped, {
      metadata: {
        reason: 'missing-config',
        configPath,
      },
    });

    return false;
  }

  if (!fileExists(declarationsConfigPath)) {
    logger.warn(ToolingEvents.build.skipped, {
      metadata: {
        reason: 'missing-types-config',
        declarationsConfigPath,
      },
    });

    return false;
  }

  return true;
}
