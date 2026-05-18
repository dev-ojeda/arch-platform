import { defineConfig } from "tsup";

import { baseConfig } from "../../tsup.base.js";

export default defineConfig({
  ...baseConfig,

  bundle: true,

  splitting: false,

  entry: ["src/index.ts"],
});
