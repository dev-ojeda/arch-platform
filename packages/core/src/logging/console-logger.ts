import type {
    Logger
} from '@arch/contracts'

export const consoleLogger: Logger = {
    info(message) {
        console.log(message)
    },

    warn(message) {
        console.warn(message)
    },

    error(message) {
        console.error(message)
    },
    debug: function (message: string, meta?: Record<string, unknown>): void {
        throw new Error('Function not implemented.')
    }
}