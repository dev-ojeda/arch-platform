import {
  defineConfig,
  mergeConfig
}
from 'vitest/config'

import {
  sharedVitestConfig
}
from '../../vitest.shared.js'

export default mergeConfig(

  sharedVitestConfig,

  defineConfig({

    test: {

      name:
        'testing',

      include: [

        'src/**/*.test.ts'
      ]
    }
  })
)