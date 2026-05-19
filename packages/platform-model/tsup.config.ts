import { defineConfig } from "tsup";

import { baseConfig } from "../../tsup.base";

export default defineConfig({
  ...baseConfig,

  bundle: true,

  splitting: false,

  entry: ["src/index.ts"],
});
