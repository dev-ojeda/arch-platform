// packages/cli/src/commands/build.command.ts

import type { CAC } from 'cac';

import { buildCommand } from '@arch-platform/tooling';

import type { BuildCliOptions } from '../contracts/build-cli-options.js';
import { logger } from '../ui/logger.js';

/**
 * Orquesta la ejecución lógica de la compilación de forma segura.
 * Aísla el manejo de excepciones para asegurar que siempre retorne un código numérico estándar.
 */
export async function runBuildCommand(options: BuildCliOptions): Promise<number> {
  try {
    logger.info('cli.commands.build', {
      metadata: {
        options,
      },
    });

    const result = await buildCommand({
      // ✅ Buena práctica: Forzamos el uso del directorio de trabajo actual.
      // Esto garantiza que tsc encuentre el tsconfig.json correcto sin importar el entorno.
      packageName: options.package,
    });

    // Si buildCommand ya retorna un número (0 o 1) lo pasamos directamente,
    // si retorna un booleano o truthy/falsy, usamos el ternario: result ? 0 : 1;
    return typeof result === 'number' ? result : result ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(`Error durante la compilación: ${message}`);
    return 1;
  }
}

export function registerBuildCommand(cli: CAC): void {
  cli
    .command('build')
    .option('--package <packageName>', 'Build specific package')
    .action(async (options: BuildCliOptions) => {
      // 🚀 Aplicación de Buena Práctica para Códigos de Salida:
      // El hilo de ejecución asíncrono se resuelve y el código se asigna limpiamente a Node,
      // asegurando que los metadatos y logs del logger de @arch-platform se vacíen en la consola.
      process.exitCode = await runBuildCommand(options);
    });
}
