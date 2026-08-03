// packages\code-analysis\test\unit\language\typescript\typescript-source-unit.exports.test.ts
import { describe, expect, it } from 'vitest';

import { createSourceUnit } from '../../../fixtures/language/create-source-unit-fixture.js';

describe('TypeScriptSourceUnit.getExports', () => {
  it('returns default re-exports', () => {
    const unit = createSourceUnit(`
      export { default } from './report.js';
    `);

    const exports = unit.getExports();
    expect(exports).toHaveLength(1);

    expect(exports[0]).toMatchObject({
      kind: 'default',
      moduleSpecifier: './report.js',
    });

    expect(exports[0].symbols).toHaveLength(1);

    expect(exports[0].symbols[0]).toMatchObject({
      exportedName: 'default',
      localName: 'default',
    });

    expect(exports[0].symbols[0].id).toContain('#default');
  });
  it('returns named exports', () => {
    const unit = createSourceUnit(`
      export { Foo } from './foo.js';
    `);

    const exports = unit.getExports();
    expect(exports).toHaveLength(1);
    expect(exports[0].kind).toBe('named');
  });

  it('returns star exports', () => {
    const unit = createSourceUnit(`
      export * from './foo.js';
    `);

    const exports = unit.getExports();
    expect(exports[0].kind).toBe('star');
  });
});
