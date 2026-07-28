// packages\build-core\src\hash\dag-hasher.ts

import type {
  ConfigHashService,
  DirectoryHashService,
  HashService,
  PathService,
} from '@arch/contracts';
import { HASH_SCHEMA_VERSION } from '@arch/platform-model';
import type { DagNode, HashContext, HashInput, HashResult } from '@arch/platform-model';

import { logger } from '../logging/logger.js';

import type { HashValidator } from './validator/hash-validator.js';

function stableJoin(values: readonly string[]): string {
  return [...values].sort().join('|');
}

export class DagHasher {
  constructor(
    private readonly directoryHashService: DirectoryHashService,
    private readonly configHashService: ConfigHashService,
    private readonly hashService: HashService,
    private readonly pathService: PathService,
    private readonly validator?: HashValidator,
  ) {}

  hash(node: DagNode, context: HashContext): HashResult {
    const sourceHash = this.directoryHashService.hashDirectory(
      this.pathService.join(node.root, 'src'),
    );

    const configHash = this.configHashService.hashConfig(node.root);

    const depsHash = this.hashService.hash(stableJoin(context.dependencyHashes));

    const hashInput: HashInput = {
      nodeName: node.name,
      sourceHash,
      configHash,
      depsHash,
      schemaVersion: HASH_SCHEMA_VERSION,
    };

    const hash = this.hashService.hashObject(hashInput);

    const result: HashResult = {
      hash,
      sourceHash,
      configHash,
      depsHash,
      schemaVersion: HASH_SCHEMA_VERSION,
    };

    this.validator?.validate({
      input: hashInput,
      result,
    });
    logger.trace('build.hash.calculated', {
      category: 'hash',
      metadata: {
        packageName: node.name,
        hash: result.hash,
      },
    });
    return result;
  }
}
