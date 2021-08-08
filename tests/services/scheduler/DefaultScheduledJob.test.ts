import { DefaultScheduledJob } from '../../../src/services/scheduler/DefaultScheduledJob';
import { CronJob } from 'cron';
import { FailedToStartScheduledJobError } from '../../../src/services/scheduler/FailedToStartScheduledJobError';
import { FailedToStopScheduledJobError } from '../../../src/services/scheduler/FailedToStopScheduledJobError';

describe('DefaultScheduledJob tests', () => {
    const mockCronJob = {
        start: jest.fn(),
        stop: jest.fn(),
    };
    const mockCronJobInstance = (mockCronJob as unknown) as CronJob;

    describe('given a CronJob instance', () => {
        beforeEach(() => {
            mockCronJob.start.mockClear();
            mockCronJob.stop.mockClear();
        });

        describe('start() -', () => {
            it('should delegate start() to the CronJob instance', () => {
                mockCronJob.start = jest.fn();
                const scheduledJob = new DefaultScheduledJob(mockCronJobInstance);
                scheduledJob.start();

                expect(mockCronJob.start).toHaveBeenCalledTimes(1);
            });

            it('should wrap any errors to FailedToStartScheduledJobError', () => {
                mockCronJob.start.mockImplementationOnce(() => {
                    throw new Error();
                });
                const scheduledJob = new DefaultScheduledJob(mockCronJobInstance);
                expect(() => scheduledJob.start()).toThrowError(FailedToStartScheduledJobError);
            });
        });

        describe('stop() -', () => {
            it('should delegate stop() to the CronJob instance', () => {
                mockCronJob.stop = jest.fn();
                const scheduledJob = new DefaultScheduledJob(mockCronJobInstance);
                scheduledJob.stop();

                expect(mockCronJob.stop).toHaveBeenCalledTimes(1);
            });

            it('should wrap any errors to FailedToStopScheduledJobError', () => {
                mockCronJob.stop.mockImplementationOnce(() => {
                    throw new Error();
                });
                const scheduledJob = new DefaultScheduledJob(mockCronJobInstance);
                expect(() => scheduledJob.stop()).toThrowError(FailedToStopScheduledJobError);
            });
        });
    });
});
