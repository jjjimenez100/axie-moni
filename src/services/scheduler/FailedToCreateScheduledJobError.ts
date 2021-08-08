export class FailedToCreateScheduledJobError extends Error {
    private static readonly message = 'Encountered an error when trying to create scheduled job';

    constructor(private readonly cronExpression: string) {
        super(FailedToCreateScheduledJobError.message);
        this.stack = new Error().stack;
    }
}
