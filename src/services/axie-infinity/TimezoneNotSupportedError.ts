export class TimezoneNotSupportedError extends Error {
    private static readonly message = 'Provided timezone is not supported';

    constructor(private readonly timezone: string) {
        super(TimezoneNotSupportedError.message);
        this.stack = new Error().stack;
    }
}
