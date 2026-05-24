// packages/cli/src/index.ts


import { cac } from "cac";
import { execa } from "execa";

const cli = cac("arch");

async function runScript(script: string) {
  await execa("pnpm", [script], {
    stdio: "inherit",
    shell: true,
  });
}

cli.command("build", "Build workspace").action(async () => {
  await runScript("build");
});

cli.command("lint", "Lint workspace").action(async () => {
  await runScript("lint");
});

cli.command("test", "Run tests").action(async () => {
  await runScript("test");
});

cli.command("validate", "Validate architecture").action(async () => {
  await runScript("validate");
});

cli.command("clean", "Clean workspace").action(async () => {
  await runScript("clean");
});

cli.command("reset", "Reset workspace").action(async () => {
  await runScript("reset");
});

cli.help();

cli.parse();