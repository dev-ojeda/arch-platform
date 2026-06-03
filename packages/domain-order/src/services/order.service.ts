// packages/domain-order/src/services/order.service.ts
import type { EventPublisherContract } from '../contracts/event-publisher.contract.js';
import type { OrderRepositoryContract } from '../contracts/order-repository.contract.js';
import type {
  CreateOrderInput,
  OrderServiceContract,
} from '../contracts/order-service.contract.js';
import { OrderNotFoundError } from '../errors/order-not-found.error.js';
import { OrderCreatedEvent } from '../events/order-created.event.js';
import { toOrder } from '../internal/order.mapper.js';
import { validateCreateOrderInput } from '../internal/order.validators.js';
import type { Order } from '../models/order.js';
import { OrderId } from '../value-objects/order-id.js';

export class OrderService implements OrderServiceContract {
  constructor(
    private readonly repository: OrderRepositoryContract,
    private readonly publisher: EventPublisherContract,
  ) {}

  async create(input: CreateOrderInput): Promise<Order> {
    validateCreateOrderInput(input);

    const order = toOrder(input);
    const event = new OrderCreatedEvent({
      order,
    });

    await this.publisher.publish(event);
    await this.repository.save(order);

    return order;
  }

  async findById(id: string): Promise<Order> {
    const orderId = new OrderId(id);

    const order = await this.repository.findById(orderId);

    if (!order) {
      throw new OrderNotFoundError(id);
    }

    return order;
  }
}
