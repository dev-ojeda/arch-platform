// packages/application/src/runtime/timeline/timeline-status.ts
export const TimelineStatuses = {
  Pending: "pending",
  Running: "running",
  Success: "success",
  Failed: "failed",
} as const;

export type TimelineStatus =
  (typeof TimelineStatuses)[keyof typeof TimelineStatuses];
