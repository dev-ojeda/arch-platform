// packages/application/tsup.config.ts

import { defineConfig } from "tsup";

import { baseConfig } from "../../tsup.base.js";

export default defineConfig({
  ...baseConfig,

  clean: true,

  metafile: true,

  entry: ["src/index.ts"],
});
