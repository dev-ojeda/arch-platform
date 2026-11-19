// scripts/cleanup/cleanup-workspace.mjs
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, rm } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { Logger } from '../git/logger.mjs'; // Ajusta la ruta relativa a tu logger.mjs

const args = new Set(process.argv.slice(2));
const isDryRun = args.has('--dry-run');
const isVerbose = args.has('--verbose');
const isDeepClean = args.has('--all');

const logger = new Logger({
  nivel: isVerbose ? 'DEBUG' : 'INFO',
});

const EXCLUDED_SEGMENT_NAMES = new Set([
  '.git',
  '.idea',
  '.vscode',
  'security-workspace',
  'arch-workspace',
]);

// Rutas relativas exactas (en formato POSIX) que nunca deben borrarse ni recorrerse
const EXCLUDED_RELATIVE_PATHS = new Set([
  'packages/tooling/src/build',
  'packages/tooling/src/commands/build',
  'packages/tooling/test/fixtures/workspace/packages/package-to-pack/dist',
  'packages/tooling/test/fixtures/workspace/.arch',
]);

const ARTIFACT_DIRECTORIES = new Set([
  '.arch',
  '.arch-cache',
  '.arch-platform',
  '.arch-platform-cache',
  '.turbo',
  '.cache',
  '.vite',
  '.next',
  '.nx',
  '.parcel-cache',
  'coverage',
  'dist',
  'build',
  'out',
  'storybook-static',
  'logs-ram',
]);

const CLEANUP_FILE_EXTENSIONS = ['.tsbuildinfo', '.tmp', '.cache', '.eslintcache'];

const TARGET_PROCESS_NAMES = new Set([
  'node',
  'node.exe',
  'pnpm',
  'pnpm.exe',
  'turbo',
  'turbo.exe',
  'tsx',
  'tsx.exe',
  'vite',
  'vitest',
  'eslint_d',
  'tsserver',
]);

function findWorkspaceRoot(startDir) {
  let current = resolve(startDir);

  while (true) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      throw new Error('Unable to locate pnpm-workspace.yaml');
    }
    current = parent;
  }
}

function stopWorkspaceProcesses(workspaceRoot) {
  logger.info('Stopping active workspace processes...');
  const currentPid = process.pid;
  const parentPid = process.ppid;

  try {
    if (process.platform === 'win32') {
      const output = execSync(
        'powershell -NoProfile -Command "Get-CimInstance Win32_Process | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"',
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      );

      if (!output.trim()) return;
      const parsed = JSON.parse(output);
      const processes = Array.isArray(parsed) ? parsed : [parsed];

      for (const proc of processes) {
        if (!proc || !proc.ProcessId || !proc.CommandLine) continue;
        if (proc.ProcessId === currentPid || proc.ProcessId === parentPid) continue;

        const procName = String(proc.Name ?? '').toLowerCase();
        if (!TARGET_PROCESS_NAMES.has(procName)) continue;
        if (!String(proc.CommandLine).includes(workspaceRoot)) continue;

        if (isDryRun) {
          logger.info(`[DRYRUN] Stop process: ${proc.Name} [${proc.ProcessId}]`);
          continue;
        }

        try {
          process.kill(proc.ProcessId, 'SIGKILL');
          logger.success(`Stopped process: ${proc.Name} [${proc.ProcessId}]`);
        } catch (err) {
          logger.warn(`Could not stop ${proc.Name} [${proc.ProcessId}]: ${err.message}`);
        }
      }
    } else {
      // Ubuntu / Linux / macOS
      const output = execSync('ps -eo pid,comm,args', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });

      for (const line of output.split('\n').slice(1)) {
        const match = line.trim().match(/^(\d+)\s+(\S+)\s+(.*)$/);
        if (!match) continue;

        const pid = Number(match[1]);
        const comm = match[2].toLowerCase();
        const cmdArgs = match[3];

        if (pid === currentPid || pid === parentPid) continue;
        if (!TARGET_PROCESS_NAMES.has(comm)) continue;
        if (!cmdArgs.includes(workspaceRoot)) continue;

        if (isDryRun) {
          logger.info(`[DRYRUN] Stop process: ${comm} [${pid}]`);
          continue;
        }

        try {
          process.kill(pid, 'SIGKILL');
          logger.success(`Stopped process: ${comm} [${pid}]`);
        } catch (err) {
          logger.warn(`Could not stop ${comm} [${pid}]: ${err.message}`);
        }
      }
    }
  } catch (error) {
    logger.debug(`Process inspection skipped: ${error.message}`);
  }
}

function toPosixRelative(workspaceRoot, fullPath) {
  return relative(workspaceRoot, fullPath).replaceAll('\\', '/');
}

function shouldDeleteFile(fileName) {
  return CLEANUP_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

async function scanAndCollect(workspaceRoot, directory, targets) {
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    logger.debug(`Cannot read directory ${directory}: ${error.message}`);
    return;
  }

  const subDirectoryTasks = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);
    const relPath = toPosixRelative(workspaceRoot, fullPath);

    if (EXCLUDED_RELATIVE_PATHS.has(relPath)) {
      logger.debug(`Skipping excluded path: ${relPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      if (EXCLUDED_SEGMENT_NAMES.has(entry.name)) {
        logger.debug(`Skipping excluded directory: ${relPath}`);
        continue;
      }

      if (entry.name === 'node_modules') {
        if (isDeepClean) {
          targets.nodeModules.push(fullPath);
        } else {
          logger.debug(`Skipping node_modules (use --all to remove): ${relPath}`);
        }
        continue;
      }

      if (ARTIFACT_DIRECTORIES.has(entry.name)) {
        targets.directories.push(fullPath);
        continue;
      }

      subDirectoryTasks.push(scanAndCollect(workspaceRoot, fullPath, targets));
    } else if (entry.isFile() && shouldDeleteFile(entry.name)) {
      targets.files.push(fullPath);
    }
  }

  await Promise.all(subDirectoryTasks);
}

async function removeTarget(targetPath, typeLabel) {
  if (isDryRun) {
    logger.info(`[DRYRUN] Remove ${typeLabel}: ${targetPath}`);
    return true;
  }

  await rm(targetPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  logger.success(`Removed: ${targetPath}`);
  return true;
}

async function main() {
  const workspaceRoot = findWorkspaceRoot(process.cwd());

  console.log('\n========================================');
  console.log(isDeepClean ? ' DEEP WORKSPACE CLEANUP (--all)' : ' WORKSPACE CLEANUP');
  console.log('========================================\n');
  logger.info(`Workspace root: ${workspaceRoot}`);

  if (isDeepClean) {
    stopWorkspaceProcesses(workspaceRoot);
    if (!isDryRun) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  const targets = { nodeModules: [], directories: [], files: [] };
  await scanAndCollect(workspaceRoot, workspaceRoot, targets);

  let removedDirectories = 0;
  let removedFiles = 0;
  let failedItems = 0;

  const allDirectories = [...targets.nodeModules, ...targets.directories];

  await Promise.all(
    allDirectories.map(async (dirPath) => {
      try {
        if (await removeTarget(dirPath, 'directory')) {
          removedDirectories += 1;
        }
      } catch (error) {
        logger.error(`Failed to remove directory: ${dirPath} (${error.message})`);
        failedItems += 1;
      }
    }),
  );

  await Promise.all(
    targets.files.map(async (filePath) => {
      try {
        if (await removeTarget(filePath, 'file')) {
          removedFiles += 1;
        }
      } catch (error) {
        logger.error(`Failed to remove file: ${filePath} (${error.message})`);
        failedItems += 1;
      }
    }),
  );

  console.log('\n----------------------------------------');
  console.log(' CLEANUP SUMMARY');
  console.log('----------------------------------------\n');
  console.log(`Directories removed : ${removedDirectories}`);
  console.log(`Files removed       : ${removedFiles}`);
  console.log(`Failures            : ${failedItems}`);

  if (isDryRun) {
    console.log('');
    logger.warn('Mode : DRY RUN');
  }

  console.log('');

  if (failedItems > 0) {
    logger.warn('Cleanup completed with warnings');
    process.exitCode = 1;
    return;
  }

  logger.success('Workspace cleanup completed successfully\n');
}

await main();
