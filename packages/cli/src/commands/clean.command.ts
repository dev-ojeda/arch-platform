// packages/cli/src/commands/clean.command.ts

import type { CAC } from "cac";

import { runCommand } from "../services/command-runner.js";
import { info } from "../utils/logger.js";

export function registerCleanCommand(cli: CAC) {
  cli
    .command("clean", "Clean workspace")
    .action(async () => {
      info("Cleaning workspace...");

      await runCommand("pnpm", ["clean"]);
    });
}