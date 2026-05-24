// packages/cli/src/utils/logger.ts

import { logger } from '../ui/logger.js';

export function info(message: string) {
  logger.info(`[INFO] ${message}`);
}

export function success(message: string) {
  logger.success(`[SUCCESS] ${message}`);
}

export function error(message: string) {
  logger.error(`[ERROR] ${message}`);
}
