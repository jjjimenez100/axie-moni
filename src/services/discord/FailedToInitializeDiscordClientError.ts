export class FailedToInitializeDiscordClientError extends Error {
    private static readonly message = `Failed to initialize discord client`;

    constructor() {
        super(FailedToInitializeDiscordClientError.message);
        this.stack = new Error().stack;
    }
}
