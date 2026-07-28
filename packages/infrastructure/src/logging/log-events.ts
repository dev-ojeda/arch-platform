export const LOG_EVENTS = {
  NODE_WORKSPACE_PROVIDER: 'node.workspace.provider',
  NODE_WORKSPACE_PROVIDER_INFO: 'node.workspace.provider.info',
  NODE_WORKSPACE_PROVIDER_FAIL: 'node.workspace.provider.fail',
  INVALID_PACKAGE_MANIFEST: 'node.workspace.provider.invalid.package.manifest',
  NODE_WORKSPACE_PROVIDER_BOUNDARIES_LOAD_FAILED: 'node.workspace.provider.boundaries.load.fail',
  FILESYSTEM_IO_FS_ASYNC_FAILED: 'filesystem.io.fs.async.failed',
  DISCOVER_WORKSPACE_PACKAGE: 'workspace.discover.package',
} as const;
