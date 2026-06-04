# @arch/domain-order

## Objetivo

`@arch/domain-order` representa un bounded context de dominio orientado a la gestión de órdenes dentro de la plataforma.

El package define:

- modelos de dominio
- contratos públicos
- servicios de dominio
- validaciones
- boundaries arquitectónicos
- metadata reusable

---

# Arquitectura

```txt
contracts/
  API pública del dominio

models/
  Entidades y value objects

services/
  Casos de uso y lógica de dominio

internal/
  Implementaciones privadas y utilidades internas

types/
  Tipos compartidos y utilidades
```

---

# Estructura Inicial

```txt
packages/domain-order
│   .boundaries.json
│   package.json
│   README.md
│   tsconfig.build.json
│   tsconfig.json
│   tsup.config.ts
│   vitest.config.ts
│
├───docs
│       architecture.md
│
├───src
│   │   index.ts
│   │
│   ├───contracts
│   │       order-service.contract.ts
│   │
│   ├───internal
│   │       order.mapper.ts
│   │       order.validators.ts
│   │
│   ├───models
│   │       order-status.ts
│   │       order.ts
│   │
│   ├───services
│   │       order.service.ts
│   │
│   └───types
│           index.ts
│
└───test
        domain-order.spec.ts
```

---

# Implementación Inicial

## src/models/order-status.ts

```ts
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
```

---

## src/models/order.ts

```ts
import { OrderStatus } from './order-status.js';

export interface Order {
  id: string;
  customerId: string;
  total: number;
  createdAt: Date;
  status: OrderStatus;
}
```

---

## src/contracts/order-service.contract.ts

```ts
import type { Order } from '../models/order.js';

export interface CreateOrderInput {
  customerId: string;
  total: number;
}

export interface OrderServiceContract {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}
```

---

## src/internal/order.validators.ts

```ts
import type { CreateOrderInput } from '../contracts/order-service.contract.js';

export function validateCreateOrderInput(input: CreateOrderInput): void {
  if (!input.customerId?.trim()) {
    throw new Error('customerId is required');
  }

  if (input.total <= 0) {
    throw new Error('total must be greater than zero');
  }
}
```

---

## src/internal/order.mapper.ts

```ts
import type { CreateOrderInput } from '../contracts/order-service.contract.js';
import type { Order } from '../models/order.js';
import { OrderStatus } from '../models/order-status.js';

export function toOrder(input: CreateOrderInput): Order {
  return {
    id: crypto.randomUUID(),
    customerId: input.customerId,
    total: input.total,
    createdAt: new Date(),
    status: OrderStatus.PENDING,
  };
}
```

---

## src/services/order.service.ts

```ts
import type {
  CreateOrderInput,
  OrderServiceContract,
} from '../contracts/order-service.contract.js';
import type { Order } from '../models/order.js';

import { toOrder } from '../internal/order.mapper.js';
import { validateCreateOrderInput } from '../internal/order.validators.js';

export class OrderService implements OrderServiceContract {
  private readonly orders = new Map<string, Order>();

  async create(input: CreateOrderInput): Promise<Order> {
    validateCreateOrderInput(input);

    const order = toOrder(input);

    this.orders.set(order.id, order);

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }
}
```

---

## src/types/index.ts

```ts
export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
```

---

## src/index.ts

```ts
export * from './contracts/order-service.contract.js';

export * from './models/order.js';
export * from './models/order-status.js';

export * from './services/order.service.js';

export * from './types/index.js';
```

---

# Boundaries

## .boundaries.json

```json
{
  "layer": "domain",
  "type": "bounded-context",
  "public": ["src/contracts/**", "src/models/**", "src/services/**", "src/index.ts"],
  "private": ["src/internal/**"],
  "forbiddenDependencies": ["apps/*", "infra/*"]
}
```

---

# Testing

## test/domain-order.spec.ts

```ts
import { describe, expect, it } from 'vitest';

import { OrderService } from '../src/services/order.service.js';

describe('OrderService', () => {
  it('should create an order', async () => {
    const service = new OrderService();

    const order = await service.create({
      customerId: 'customer-001',
      total: 100,
    });

    expect(order.customerId).toBe('customer-001');
    expect(order.total).toBe(100);
  });

  it('should find an order by id', async () => {
    const service = new OrderService();

    const created = await service.create({
      customerId: 'customer-001',
      total: 100,
    });

    const found = await service.findById(created.id);

    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);
  });
});
```

---

# Próximos pasos

## Fase 1

- completar setup del package
- configurar exports
- validar build ESM
- integrar Vitest
- agregar coverage

## Fase 2

- domain events
- repository contracts
- CQRS contracts
- value objects
- policy validation
- domain errors

## Fase 3

- architecture metadata
- governance integration
- graph analysis
- generators automáticos
- package diagnostics
- ownership metadata
