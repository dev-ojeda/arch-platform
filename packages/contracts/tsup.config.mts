// packages\contracts\tsup.config.mts

import { defineConfig } from 'tsup'
import { baseConfig } from '../../tsup.base'

export default defineConfig({

    ...baseConfig,

    tsconfig: './tsconfig.build.json',

    entry: ['src/index.ts']
})