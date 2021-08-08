import { Scheduler } from './Scheduler';
import { CronJob } from 'cron';
import { ScheduledJob } from './ScheduledJob';
import { DefaultScheduledJob } from './DefaultScheduledJob';
import { FailedToCreateScheduledJobError } from './FailedToCreateScheduledJobError';

export class DefaultScheduler implements Scheduler {
    public createJob(cronExpression: string, handler: Function): ScheduledJob {
        try {
            const newCronJob = new CronJob(cronExpression, () => handler());
            return new DefaultScheduledJob(newCronJob);
        } catch (error) {
            throw new FailedToCreateScheduledJobError(cronExpression);
        }
    }
}
