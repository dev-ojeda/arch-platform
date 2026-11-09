// packages/domain-order/src/index.ts
export {
  CustomerId,
  DomainError,
  InvalidOrderError,
  Money,
  OrderCreatedEvent,
  OrderId,
  OrderNotFoundError,
  OrderService,
  OrderStatus,
} from './public/index.js';
export type {
  CreateOrderInput,
  DomainEvent,
  EventPublisherContract,
  Order,
  OrderCreatedPayload,
  OrderRepositoryContract,
  OrderServiceContract,
} from './public/index.js';
