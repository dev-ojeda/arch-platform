// packages/cli/src/commands/build.command.ts

import type { CAC } from "cac";

import { runCommand } from "../services/command-runner.js";
import { info } from "../utils/logger.js";

export function registerBuildCommand(cli: CAC) {
  cli
    .command("build", "Build workspace")
    .action(async () => {
      info("Running build...");

      await runCommand("pnpm", ["build"]);
    });
}