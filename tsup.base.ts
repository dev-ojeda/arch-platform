import type { Options } from "tsup";

export const baseConfig: Options = {
  format: ["esm"],

  target: "node20",

  platform: "node",

  clean: true,

  sourcemap: false,

  treeshake: false,

  splitting: false,

  minify: false,

  metafile: false,

  bundle: true,

  dts: false,
};
