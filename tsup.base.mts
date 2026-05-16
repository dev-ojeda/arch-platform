// tsup.base.mts
import type {
    Options
}
from 'tsup'

export const baseConfig:
Options = {

    format: ['esm'],

    target: 'node20',

    platform: 'node',

    clean: true,

    sourcemap: false,

    treeshake: true,

    splitting: true,

    minify: false,

    metafile: true,

    bundle: true,

    skipNodeModulesBundle: true,

    dts: true
}