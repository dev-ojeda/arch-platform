// packages/infrastructure/src/process/node-execution-process.ts

import { execFile, spawn } from 'node:child_process';
import { platform } from 'node:process';
import { promisify } from 'node:util';

import type { ExecutionProcess } from '@arch-platform/platform-model';

const execFileAsync = promisify(execFile);
function quoteCommandArgument(argument: string): string {
  if (!/[\s"&|<>^]/.test(argument)) {
    return argument;
  }

  return `"${argument.replace(/"/g, '""')}"`;
}
export class NodeExecutionProcess implements ExecutionProcess {
  async executeInteractive(filePath: string, args: readonly string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (
        platform === 'win32' &&
        (filePath.toLowerCase().endsWith('.cmd') || filePath.toLowerCase().endsWith('.bat'))
      ) {
        const command = [quoteCommandArgument(filePath), ...args.map(quoteCommandArgument)].join(
          ' ',
        );
        console.log('[executeInteractive] spawning:', command);
        const child = spawn('cmd.exe', ['/d', '/s', '/c', command], {
          stdio: 'inherit',
        });

        child.on('spawn', () => {
          console.log('[executeInteractive] spawned:', child.pid);
        });

        child.on('error', (error) => {
          console.error('[executeInteractive] error:', error);
          reject(error);
        });

        child.on('close', (code, signal) => {
          console.log('[executeInteractive] close:', { code, signal });

          if (code === 0) {
            resolve();
            return;
          }

          reject(new Error(`Interactive process failed with exit code: ${code ?? 'unknown'}`));
        });

        return;
      }

      const child = spawn(filePath, args, {
        stdio: 'inherit',
      });

      child.on('error', reject);

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
          return;
        }

        reject(new Error(`Interactive process failed with exit code: ${code ?? 'unknown'}`));
      });
    });
  }
  async execute(
    filePath: string,
    args: readonly string[],
  ): Promise<{
    readonly stdout: string;
    readonly stderr: string;
  }> {
    // Si estamos en Windows y es un comando global común como npm, pnpm, git o termina en .cmd
    const isWindowsCommand =
      process.platform === 'win32' &&
      (!filePath.includes('.') ||
        filePath.toLowerCase().endsWith('.cmd') ||
        filePath.toLowerCase().endsWith('.bat'));

    if (isWindowsCommand) {
      // Node.js maneja de forma nativa el escape y la ejecución en CMD si activamos shell: true
      const { stdout, stderr } = await execFileAsync(filePath, args, { shell: true });

      return { stdout, stderr };
    }

    // Comportamiento por defecto para binarios directos (Linux, macOS, o .exe en Windows)
    const { stdout, stderr } = await execFileAsync(filePath, args);

    return { stdout, stderr };
  }
}
