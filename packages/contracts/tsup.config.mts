// packages\contracts\tsup.config.mts

import { defineConfig } from 'tsup'
import { baseConfig } from '../../tsup.base.js'

export default defineConfig({

    ...baseConfig,

    tsconfig: './tsconfig.build.json',

    entry: ['src/index.ts']
})