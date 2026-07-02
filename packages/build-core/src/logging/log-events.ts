// packages/build-core/src/logging/log-events.ts

export const LOG_EVENTS = {
  CACHE_EVALUATE: 'cache.evaluate',
  CACHE_HIT: 'cache.hit',
  CACHE_MISS: 'cache.miss',
  CACHE_RESTORE: 'cache.restore',
  CACHE_STALE: 'cache.stale',
  BUILD_STARTED: 'build.started',
  BUILD_COMPLETED: 'build.completed',
  BUILD_TASK_RUNNER: 'build.task.runner',
  DEPENDENCY_RESOLVER: 'dependency.resolver',
  STATE_CHANGED: 'build.service.state.changed',
  ARTIFACT_SAVE: 'file.system.artifact.cache.save',
  ARTIFACT_RESTORE: 'file.system.artifact.cache.restore',
  ARTIFACT_FAIL: 'file.system.artifact.cache.fail',
} as const;
