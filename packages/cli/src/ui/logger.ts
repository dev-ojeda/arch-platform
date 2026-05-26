// packages/cli/src/ui/logger.ts

type LogLevel = 'info' | 'success' | 'error' | 'warn';

interface LogOptions {
  prefix?: boolean;
}

const ARCH_PREFIX = '[arch]';

function write(level: LogLevel, message: string, options: LogOptions = {}): void {
  const { prefix = true } = options;

  const formattedMessage = prefix ? `${ARCH_PREFIX} ${message}` : message;

  switch (level) {
    case 'info':
      console.log(formattedMessage);
      break;

    case 'success':
      console.log(`✔ ${formattedMessage}`);
      break;

    case 'warn':
      console.warn(`▲ ${formattedMessage}`);
      break;

    case 'error':
      console.error(`✖ ${formattedMessage}`);
      break;
  }
}

export const logger = {
  info(message: string, options?: LogOptions): void {
    write('info', message, options);
  },

  success(message: string, options?: LogOptions): void {
    write('success', message, options);
  },

  warn(message: string, options?: LogOptions): void {
    write('warn', message, options);
  },

  error(message: string, options?: LogOptions): void {
    write('error', message, options);
  },
  newline(): void {
    console.log();
  },
};
