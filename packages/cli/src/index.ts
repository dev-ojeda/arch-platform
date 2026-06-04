// packages/cli/src/index.ts

import { cac } from 'cac';

import { registerBuildCommand } from './commands/build.command.js';
import { registerCleanCommand } from './commands/clean.command.js';
import { registerDoctorCommand } from './commands/doctor.command.js';
import { registerLintCommand } from './commands/lint.command.js';
import { registerResetCommand } from './commands/reset.command.js';
import { registerTestCommand } from './commands/test.command.js';
import { registerValidateCommand } from './commands/validate.command.js';

const cli = cac('arch');

registerBuildCommand(cli);
registerCleanCommand(cli);
registerDoctorCommand(cli);
registerLintCommand(cli);
registerResetCommand(cli);
registerTestCommand(cli);
registerValidateCommand(cli);

cli.help();

cli.parse();
