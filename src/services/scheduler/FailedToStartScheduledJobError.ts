export class FailedToStartScheduledJobError extends Error {
    private static readonly message = 'Encountered an error when trying to start scheduled job';

    constructor() {
        super(FailedToStartScheduledJobError.message);
        this.stack = new Error().stack;
    }
}
