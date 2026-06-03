// packages/application/src/runtime/timeline/timeline-status.ts
export const TimelineStatus = {
  Pending: 'pending',
  Running: 'running',
  Success: 'success',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;

export type TimelineStatus = (typeof TimelineStatus)[keyof typeof TimelineStatus];
