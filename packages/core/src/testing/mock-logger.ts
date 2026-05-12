// packages/core/src/testing/mock-logger.ts

import { vi } from 'vitest'

import type {
    Logger
} from '@arch/contracts'

export function createMockLogger(): Logger {

    return {

        info: vi.fn(),

        warn: vi.fn(),

        error: vi.fn()
    }
}