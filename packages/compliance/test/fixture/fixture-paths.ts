import { fileURLToPath } from 'node:url';

export const FIXTURE_PATHS = {
  archWorkspace: fileURLToPath(new URL('./arch-workspace', import.meta.url)),
} as const;
