import { GenerationCancelledError } from "../../errors/generation-errors.js";


export function assertNotCancelled(
    signal?: AbortSignal
): void {

    if (signal?.aborted) {

        throw new GenerationCancelledError()
    }
}