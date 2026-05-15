import { GenerationCancelledError } from "../errors/generation/generation-cancelled.error.js";



export function assertNotCancelled(
    signal?: AbortSignal
): void {

    if (signal?.aborted) {

        throw new GenerationCancelledError()
    }
}