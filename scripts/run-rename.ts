import { spawn } from 'child_process';
import * as path from 'path';

function ejecutarScriptBloqueo(): Promise<void> {
  return new Promise((resolve, reject) => {
    const rutaScript = path.resolve(import.meta.dirname, 'lock-and-rename.ps1');

    const ps = spawn(
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', rutaScript],
      {
        stdio: ['inherit', 'pipe', 'pipe'],
      },
    );

    ps.stdout.setEncoding('utf8');
    ps.stderr.setEncoding('utf8');

    ps.stdout.on('data', (data: string) => {
      process.stdout.write(data);
    });

    ps.stderr.on('data', (data: string) => {
      process.stderr.write(data);
    });

    ps.on('error', reject);

    ps.on('close', (code, signal) => {
      if (code === 0) {
        console.log('Lock process completed successfully.');
        resolve();
        return;
      }

      reject(
        new Error(
          `PowerShell exited with code ${code ?? 'null'}` + (signal ? ` (signal: ${signal})` : ''),
        ),
      );
    });
  });
}

ejecutarScriptBloqueo().catch((error: Error) => {
  console.error('Failed to execute PowerShell lock script:', error.message);
  process.exitCode = 1;
});
