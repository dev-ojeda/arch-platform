import { defineConfig }
    from 'tsup';

import { baseConfig }
    from '../../../tsup.base.mjs';

export default defineConfig({
    ...baseConfig,

    entry: [
        'src/index.ts'
    ]
});