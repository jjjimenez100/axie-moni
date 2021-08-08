import { ScheduledJob } from './ScheduledJob';
import { CronJob } from 'cron';
import { FailedToStartScheduledJobError } from './FailedToStartScheduledJobError';
import { FailedToStopScheduledJobError } from './FailedToStopScheduledJobError';

export class DefaultScheduledJob implements ScheduledJob {
    public constructor(private readonly cronJob: CronJob) {}

    public start(): void {
        try {
            this.cronJob.start();
        } catch (error) {
            throw new FailedToStartScheduledJobError();
        }
    }

    public stop(): void {
        try {
            this.cronJob.stop();
        } catch (error) {
            throw new FailedToStopScheduledJobError();
        }
    }
}
