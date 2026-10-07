import { describe, expect, it } from 'vitest';

import { FilesystemSecurityStateReader } from '../../../src/artifact/adapter/filesystem-security-state-reader.js';
import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { FIXTURE_PATHS } from '../../fixture/fixture-paths.js';

describe('FilesystemSecurityStateReader', () => {
  const reader = new FilesystemSecurityStateReader(
    new NodeAsyncFileSystemAdapter({
      root: FIXTURE_PATHS.securityWorkspace,
    }),
  );

  it('reads the persisted security state from the workspace', async () => {
    const state = await reader.read();

    expect(state.schemaVersion).toBe(1);

    const artifact = state.artifacts['@arch-platform/code-analysis'];

    expect(artifact).toBeDefined();
    expect(artifact?.previousStatus).toBe('blocked');

    expect(artifact?.evaluation.status).toBe('blocked');
    expect(artifact?.evaluation.artifactHash).toBe('sha256:H2');

    expect(artifact?.evaluation.findings).toHaveLength(1);

    expect(artifact?.evaluation.findings[0]).toEqual({
      id: 'CVE-2026-69152',
      advisory: {
        namespace: 'CVE',
        value: 'CVE-2026-69152',
      },
      severity: 'high',
      category: 'vulnerability',
      message: 'Vulnerable dependency brace-expansion@2.1.1',
      blocking: true,
    });

    expect(artifact?.decision).toEqual({
      status: 'blocked',
      artifactHash: 'sha256:H2',
      policyId: 'default',
      policyVersion: '1',
      reasons: ['Security evaluation is blocked'],
    });
  });
});
