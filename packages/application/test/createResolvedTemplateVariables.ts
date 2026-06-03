export function createResolvedTemplateVariables(overrides = {}) {
  return {
    name: 'user',
    className: 'User',

    controllerName: 'UserController',

    serviceName: 'UserService',

    repositoryName: 'UserRepository',

    modelName: 'User',

    fileExtension: '.ts',

    folderLayout: {
      controller: 'controllers',

      service: 'services',

      repository: 'repositories',

      model: 'models',
    },

    ...overrides,
  };
}
