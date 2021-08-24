import { EventHook } from './EventHook';

export class UnrecognizedEventHookError extends Error {
    private static readonly message = `Valid values for event hook are: ${Object.values(EventHook).join(', ')}`;

    constructor(private readonly unrecognizedEventHook: string) {
        super(`${UnrecognizedEventHookError.message}. Got ${unrecognizedEventHook}`);
        this.stack = new Error().stack;
    }
}
