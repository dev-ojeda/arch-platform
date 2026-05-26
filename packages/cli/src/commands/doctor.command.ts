// packages/cli/src/commands/doctor.command.ts

import type { CAC } from 'cac';

import { runDoctor } from '../services/doctor/doctor-runner.js';

export function registerDoctorCommand(cli: CAC): void {
  cli.command('doctor', 'Validate workspace health').action(async () => {
    const result = await runDoctor();

    if (!result.success) {
      process.exitCode = 1;
    }
  });
}
