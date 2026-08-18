// packages\governance\test\rules\public-api\only-public-api.rule.test.ts

import { describe, expect, it } from 'vitest';

import { OnlyPublicApiRule } from '../../../src/rules/public-api/only-public-api.rule.js';
import { createContext } from '../../fixtures/public-api/create-context.js';
import { createInternalExportContext } from '../../fixtures/public-api/create-export-internal-context.js';

describe('OnlyPublicApiRule', () => {
  const rule = new OnlyPublicApiRule();
  it('allows importing exported symbols', async () => {
    const diagnostics = rule.run(createContext('@arch/application', '@arch/domain', true));
    expect(diagnostics).toHaveLength(0);
  });

  it('rejects importing non exported symbols', () => {
    const diagnostics = rule.run(createContext('@arch/application', '@arch/domain', false));

    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'ARCH_ONLY_PUBLIC_API',
      severity: 'error',
    });
  });

  it('allows internal imports inside same package', async () => {
    const diagnostics = rule.run(createContext('@arch/domain', '@arch/domain', false));
    expect(diagnostics).toHaveLength(0);
  });

  it('rejects importing an exported internal entrypoint', () => {
    const context = createInternalExportContext();

    const diagnostics = rule.run(context);
    expect(diagnostics).toHaveLength(1);

    expect(diagnostics[0]).toMatchObject({
      code: 'ARCH_PRIVATE_API_ACCESS',
      severity: 'error',
    });
  });
});
