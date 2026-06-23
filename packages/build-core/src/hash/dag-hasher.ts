// packages\build-core\src\hash\dag-hasher.ts

import { joinPath } from '../fs/path-utils.js';
import type { DagNode } from '../graph/dag-types.js';

import { hashConfig } from './filesystem/hash-config.js';
import { hashDirectory } from './filesystem/hash-directory.js';
import type { HashContext } from './hash-context.js';
import type { HashInput } from './hash-input.js';
import type { HashResult } from './hash-result.js';
import { createHash, createObjectHash } from './hash-utils.js';
import { HASH_SCHEMA_VERSION } from './hash-version.js';
import type { HashValidator } from './validator/hash-validator.js';

export class DagHasher {
  constructor(private readonly validator?: HashValidator) {}

  hash(node: DagNode, context: HashContext): HashResult {
    const sourceHash = hashDirectory(joinPath(node.root, 'src'));

    const configHash = hashConfig(node.root);

    const depsHash = createHash(context.dependencyHashes.toSorted().join('|'));

    const hashInput: HashInput = {
      nodeName: node.name,
      sourceHash,
      configHash,
      depsHash,
      schemaVersion: HASH_SCHEMA_VERSION,
    };

    const hash = createObjectHash(hashInput);

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

    return result;
  }
}
