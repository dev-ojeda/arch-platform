import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  Artifact,
  ArtifactCache,
  ArtifactProvider,
  BuildState,
  HashResult,
  OutputValidator,
} from '@arch-platform/platform-model';

import { CacheEvaluator } from '../../../src/cache/cache-evaluator.js';
import { HASH_SCHEMA_VERSION } from '../../../src/hash/hash-schema-version.js';

const packageName = '@arch-platform/example';
const root = '/workspace/packages/example';
const outputs = ['dist'];

const currentHash: HashResult = {
  hash: 'current-hash',
  sourceHash: 'source-hash',
  configHash: 'config-hash',
  depsHash: 'deps-hash',
  schemaVersion: HASH_SCHEMA_VERSION,
};

const artifact: Artifact = {
  packageName,
  id: 'current-artifact-id',
};

describe('CacheEvaluator', () => {
  let state: BuildState;
  let outputValidator: OutputValidator;
  let artifactCache: ArtifactCache;
  let artifactProvider: ArtifactProvider;
  let evaluator: CacheEvaluator;

  beforeEach(() => {
    state = new Map();

    outputValidator = {
      exists: vi.fn().mockResolvedValue(false),
    };

    artifactCache = {
      exists: vi.fn().mockResolvedValue(false),
      save: vi.fn().mockResolvedValue(undefined),
      restore: vi.fn().mockResolvedValue(true),
      verifyOutputs: vi.fn().mockResolvedValue(false),
    };

    artifactProvider = {
      create: vi.fn().mockReturnValue(artifact),
    };

    evaluator = new CacheEvaluator(state, outputValidator, artifactCache, artifactProvider);
  });

  function addPreviousState(
    overrides: Partial<HashResult> = {},
    schemaVersion = HASH_SCHEMA_VERSION,
  ): void {
    const previousHash: HashResult = {
      ...currentHash,
      ...overrides,
    };

    state.set(packageName, {
      schemaVersion,
      hash: previousHash,
      outputs,
      timestamp: Date.now(),
    });
  }

  it('returns miss when there is no previous state and cache is unavailable', async () => {
    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'miss',
      changeReason: 'first-build',
      available: false,
    });

    expect(artifactCache.exists).toHaveBeenCalledWith(artifact);
    expect(outputValidator.exists).not.toHaveBeenCalled();
  });

  it('returns restore when there is no previous state and cache is available', async () => {
    vi.mocked(artifactCache.exists).mockResolvedValue(true);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'restore',
      changeReason: 'first-build',
      available: true,
    });

    expect(outputValidator.exists).not.toHaveBeenCalled();
  });

  it('returns stale when the previous source hash differs', async () => {
    addPreviousState({ sourceHash: 'previous-source-hash' });

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toMatchObject({
      decision: 'stale',
      changeReason: 'source',
    });

    expect(outputValidator.exists).not.toHaveBeenCalled();
    expect(artifactCache.exists).not.toHaveBeenCalled();
  });

  it('returns stale when the previous config hash differs', async () => {
    addPreviousState({ configHash: 'previous-config-hash' });

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toMatchObject({
      decision: 'stale',
      changeReason: 'config',
    });
  });

  it('returns stale when the previous dependency hash differs', async () => {
    addPreviousState({ depsHash: 'previous-deps-hash' });

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toMatchObject({
      decision: 'stale',
      changeReason: 'dependency',
    });
  });

  it('returns stale when the previous hash schema version differs', async () => {
    addPreviousState({}, HASH_SCHEMA_VERSION - 1);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toMatchObject({
      decision: 'stale',
      changeReason: 'cache-version',
    });
  });

  it('returns restore when outputs are missing and cache is available', async () => {
    addPreviousState();

    vi.mocked(outputValidator.exists).mockResolvedValue(false);
    vi.mocked(artifactCache.exists).mockResolvedValue(true);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'restore',
      changeReason: 'missing-output',
      available: true,
    });

    expect(artifactCache.verifyOutputs).not.toHaveBeenCalled();
  });

  it('returns invalid when outputs are missing and cache is unavailable', async () => {
    addPreviousState();

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'invalid',
      changeReason: 'missing-output',
      available: false,
    });
  });

  it('returns restore when output integrity fails and cache is available', async () => {
    addPreviousState();

    vi.mocked(outputValidator.exists).mockResolvedValue(true);
    vi.mocked(artifactCache.verifyOutputs).mockResolvedValue(false);
    vi.mocked(artifactCache.exists).mockResolvedValue(true);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'restore',
      changeReason: 'output-integrity',
      available: true,
    });
  });

  it('returns hit when outputs are valid and cache is available', async () => {
    addPreviousState();

    vi.mocked(outputValidator.exists).mockResolvedValue(true);
    vi.mocked(artifactCache.verifyOutputs).mockResolvedValue(true);
    vi.mocked(artifactCache.exists).mockResolvedValue(true);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'hit',
      changeReason: 'none',
      available: true,
    });

    expect(artifactCache.save).not.toHaveBeenCalled();
  });

  it('repairs cache when outputs are valid but cache is unavailable', async () => {
    addPreviousState();

    vi.mocked(outputValidator.exists).mockResolvedValue(true);
    vi.mocked(artifactCache.verifyOutputs).mockResolvedValue(true);
    vi.mocked(artifactCache.exists).mockResolvedValueOnce(false).mockResolvedValueOnce(true);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'hit',
      changeReason: 'none',
      available: true,
    });

    expect(artifactCache.save).toHaveBeenCalledWith(artifact, root, outputs);
    expect(artifactCache.exists).toHaveBeenCalledTimes(2);
  });

  it('returns hit even when cache repair cannot be verified', async () => {
    addPreviousState();

    vi.mocked(outputValidator.exists).mockResolvedValue(true);
    vi.mocked(artifactCache.verifyOutputs).mockResolvedValue(true);
    vi.mocked(artifactCache.exists).mockResolvedValue(false);

    const result = await evaluator.evaluate(packageName, root, outputs, currentHash);

    expect(result).toEqual({
      packageName,
      decision: 'hit',
      changeReason: 'none',
      available: false,
    });

    expect(artifactCache.save).toHaveBeenCalledWith(artifact, root, outputs);
  });
});
