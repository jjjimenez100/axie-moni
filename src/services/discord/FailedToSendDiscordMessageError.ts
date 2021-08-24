export class FailedToSendDiscordMessageError extends Error {
    private static readonly message = `Failed to send discord message`;

    constructor(private readonly discordMessage: string) {
        super(FailedToSendDiscordMessageError.message);
        this.stack = new Error().stack;
    }
}
