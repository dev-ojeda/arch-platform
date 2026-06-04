// packages/domain-order/src/events/domain-event.ts

export interface DomainEvent<TPayload> {
  readonly type: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
}
