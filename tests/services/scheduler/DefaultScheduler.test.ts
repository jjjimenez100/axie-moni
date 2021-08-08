import { DefaultScheduler } from '../../../src/services/scheduler/DefaultScheduler';
import { DefaultScheduledJob } from '../../../src/services/scheduler/DefaultScheduledJob';
import { FailedToCreateScheduledJobError } from '../../../src/services/scheduler/FailedToCreateScheduledJobError';

describe('DefaultScheduler tests', () => {
    let defaultScheduler: DefaultScheduler;

    beforeEach(() => {
        defaultScheduler = new DefaultScheduler();
    });

    describe('given a valid cron expression', () => {
        it('should return an instance of DefaultScheduledJob', () => {
            const everyMinuteCronExpression = '* * * * *';
            const scheduledJob = defaultScheduler.createJob(everyMinuteCronExpression, () => {
                return 1;
            });
            expect(scheduledJob).toBeInstanceOf(DefaultScheduledJob);
        });
    });

    describe('given a non-valid cron expression', () => {
        it('should throw FailedToCreateScheduledJobError', () => {
            const invalidCronExpression = 'test';
            expect(() =>
                defaultScheduler.createJob(invalidCronExpression, () => {
                    return 1;
                }),
            ).toThrowError(FailedToCreateScheduledJobError);
        });
    });
});
