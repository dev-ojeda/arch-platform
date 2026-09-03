// packages\governance\test\fixtures\compliance\create-compliance-execution-context.ts

import type { ComplianceExecutionContext } from '../../../src/context/compliance-execution-context.js';

export function createComplianceExecutionContext(): ComplianceExecutionContext {
  return {
    workspace: {} as ComplianceExecutionContext['workspace'],

    scope: {
      kind: 'package',
      root: '',
      packageName: '@arch/testing',
      environment: 'dev',
    },

    artifactStates: new Map(),

    complianceStates: {
      schemaVersion: 1,
      environment: {
        name: 'dev',
        order: 0,
        artifacts: {},
        schemaVersion: 1,
      },
    },

    environment: 'dev',

    artifacts: [],
  };
}
