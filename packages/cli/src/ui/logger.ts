// packages/cli/src/ui/logger.ts

export const logger = {
  info(message: string) {
    console.log(`[arch] ${message}`);
  },

  success(message: string) {
    console.log(`[arch:success] ${message}`);
  },

  error(message: string) {
    console.error(`[arch:error] ${message}`);
  },
};
