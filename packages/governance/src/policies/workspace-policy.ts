// packages/governance/src/policies/workspace-policy.ts
export const workspacePolicy = {
  layers: {
    domain: {
      canDependOn: ['shared'],
    },

    application: {
      canDependOn: ['domain', 'shared'],
    },
  },
};
