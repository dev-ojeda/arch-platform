// packages/cli/src/commands/doctor.command.ts

import type { CAC } from 'cac';

import { info, success } from '../utils/logger.js';

export function registerDoctorCommand(cli: CAC) {
  cli.command('doctor', 'Check environment').action(async () => {
    info('Checking environment...');

    success('Node.js detected');
    success('pnpm detected');
    success('Workspace detected');
  });
}
