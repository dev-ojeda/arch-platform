import { describe, expect, it } from 'vitest';

import { runSecurity, type SecurityOptions } from '@arch-platform/compliance';

import { FIXTURE_PATHS } from '../fixture/fixture-paths.js';

describe('runSecurity', () => {
  it('evaluates security using the approved compliance artifact', async () => {
    const options: SecurityOptions = {
      workspaceRoot: FIXTURE_PATHS.archWorkspace,
      packageName: '@arch-platform/code-analysis',
      environment: 'dev',
      lockfilePath: './data/security/pnpm-lock-test.yaml',
    };

    const result = await runSecurity(options);

    expect(result).toMatchObject({
      success: true,
      artifact: '@arch-platform/code-analysis',
      previousStatus: 'blocked',
      evaluationStatus: 'blocked',
      decisionStatus: 'blocked',
      changes: 1,
    });
  });
});
