// packages/governance/src/rules/public-api/private-path-detector.ts

import { InternalSourceDetector } from './internal-source-detector.js';

export class PrivatePathDetector {
  constructor(private readonly sourceDetector = new InternalSourceDetector()) {}

  isPrivate(moduleSpecifier: string, privatePaths?: readonly string[]): boolean {
    if (privatePaths?.includes(moduleSpecifier)) {
      return true;
    }

    return this.sourceDetector.isInternalSource(moduleSpecifier);
  }
}
