export class FailedToStopScheduledJobError extends Error {
    private static readonly message = 'Encountered an error when trying to stop scheduled job';

    constructor() {
        super(FailedToStopScheduledJobError.message);
        this.stack = new Error().stack;
    }
}
