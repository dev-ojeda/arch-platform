// packages/cli/src/commands/validate.command.ts

import {
  buildGovernanceContext,
  formatDiagnostic,
  GovernanceEngine,
  ValidatePackageStructureRule,
  WorkspacePackageRule,
} from '@arch/governance';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerValidateCommand(cli: CAC): void {
  cli.command('validate', 'Validate workspace governance').action(async () => {
    const context = await buildGovernanceContext(process.cwd());

    const engine = new GovernanceEngine([
      new WorkspacePackageRule(),
      new ValidatePackageStructureRule(),
    ]);

    const result = await engine.run(context);

    if (result.diagnostics.length === 0) {
      logger.success(
        `No diagnostics found ` +
          `(${result.evaluatedRules} rules, ` +
          `${result.durationMs.toFixed(1)}ms)`,
      );

      return;
    }

    for (const diagnostic of result.diagnostics) {
      const formatted = formatDiagnostic(diagnostic);

      if (diagnostic.severity === 'warning') {
        logger.warn(formatted);

        continue;
      }

      logger.error(formatted);
    }

    logger.info(
      `Evaluated ${result.evaluatedRules} rules ` + `in ${result.durationMs.toFixed(1)}ms`,
    );

    process.exit(result.success ? 0 : 1);
  });
}
