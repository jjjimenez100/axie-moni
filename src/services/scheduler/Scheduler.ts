import { ScheduledJob } from './ScheduledJob';

export interface Scheduler {
    createJob(cronExpression: string, handler: Function): ScheduledJob;
}
