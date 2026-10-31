// 📦 Paquetes Core (Packages)/distribution/src/register-commands.ts

import type { CAC } from 'cac';

import { registerBuildCommand } from './commands/build.command.js';

export function registerCommands(cli: CAC): void {
  registerBuildCommand(cli);
}
