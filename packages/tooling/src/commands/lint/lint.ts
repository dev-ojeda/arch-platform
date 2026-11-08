// packages/tooling/src/commands/lint/lint.ts

import {
  NodeAsyncFileSystemAdapter,
  NodePathService,
  NodeWorkspaceProvider,
  normalizeSeparators,
  resolveLintTargets,
} from '@arch-platform/infrastructure';

import type { LintRequest } from './request.js';
import { runLintCommand } from './run.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';

export async function lintCommand(options: LintRequest): Promise<number> {
  const workspaceProvider = new NodeWorkspaceProvider();
  const pathService = new NodePathService();
  const fsAdapter = new NodeAsyncFileSystemAdapter();
  const cwd = process.cwd();

  const workspace = await workspaceProvider.discover(options.workspaceRoot);
  let rawTargets: string[] = [];

  // Escenario A: Filtrado por paquete único (Orquestado por Turborepo para sub-paquetes)
  if (options.packageName) {
    const baseTargets = resolveLintTargets(workspace, options.packageName);
    rawTargets = [...baseTargets];
  } else {
    // Escenario B: Invocación desde la raíz (//:lint:scripts)
    // Agregamos dinámicamente todas las carpetas globales de configuración del monorrepo
    const infrastructurePaths = [
      pathService.join(options.workspaceRoot, 'scripts'),
      pathService.join(options.workspaceRoot, 'config'),
      pathService.join(options.workspaceRoot, 'eslint.config.mjs'), // Audita el archivo de configuración base
    ];

    for (const p of infrastructurePaths) {
      if (await fsAdapter.exists(p)) {
        rawTargets.push(p);
      }
    }

    if (workspace.layout.hasScriptPath && typeof workspace.layout.scriptPath === 'string') {
      if (
        (await fsAdapter.exists(workspace.layout.scriptPath)) &&
        !rawTargets.includes(workspace.layout.scriptPath)
      ) {
        rawTargets.push(workspace.layout.scriptPath);
      }
    }
  }

  if (rawTargets.length === 0) {
    return 0;
  }

  // Convertimos a rutas relativas portátiles uniformes y limpias usando tu infraestructura
  const relativeTargets = rawTargets.map((target) => {
    const isAbs = pathService.isAbsolute(target);
    const relative = isAbs ? pathService.relative(cwd, target) : target;
    return normalizeSeparators(relative);
  });

  return runTask({
    task: ToolingTasks.lint,
    action: () =>
      runLintCommand({
        targets: relativeTargets,
        args: options.fix ? ['--fix'] : options.debug ? ['--debug'] : [],
      }),
  });
}
