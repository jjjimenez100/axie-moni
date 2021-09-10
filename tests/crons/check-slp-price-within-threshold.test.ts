import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { HttpClient } from '../../src/lib/http-client/HttpClient';
import { Scheduler } from '../../src/services/scheduler/Scheduler';
import { AxieInfinityService } from '../../src/services/axie-infinity/AxieInfinityService';
import Logger from '../../src/lib/Logger';
import {
    checkSlpHandler,
    CheckSlpPriceDependencies,
    createCheckSlpPriceWithinThresholdCron,
} from '../../src/crons/check-slp-price-within-threshold';
import { Currency } from '../../src/services/Currency';

describe('check-slp-price-within-threshold tests', () => {
    const mockedScheduler = mock<Scheduler>();
    const mockedHttpClient = mock<HttpClient>();
    const mockedAxieService = mock<AxieInfinityService>();
    const mockedLogger = mock<Logger>();

    beforeEach(() => {
        mockReset(mockedScheduler);
        mockClear(mockedScheduler);

        mockReset(mockedHttpClient);
        mockClear(mockedHttpClient);

        mockReset(mockedAxieService);
        mockClear(mockedAxieService);

        mockReset(mockedLogger);
        mockClear(mockedLogger);
    });

    const dependencies: CheckSlpPriceDependencies = {
        logger: mockedLogger,
        axieService: mockedAxieService,
        httpClient: mockedHttpClient,
        scheduler: mockedScheduler,
    };
    const cronExpressionForEveryFiveMinutes = '*/5 * * * *';
    const dummyWebhookUrl = 'test.com';

    describe('given slp price is within minimum threshold', () => {
        it('should send an http request to the webhook url', async () => {
            const minimum = 6;
            const maximum = 10;
            mockedAxieService.getSlpPriceInCurrencyOf.mockResolvedValueOnce(minimum);

            const threshold = { minimum, maximum };
            await checkSlpHandler(dependencies, threshold, dummyWebhookUrl);

            expect(mockedAxieService.getSlpPriceInCurrencyOf).toHaveBeenCalledWith(Currency.PHP);
            expect(mockedHttpClient.post).toHaveBeenCalledWith(dummyWebhookUrl, {
                content: `<@&866366582888464424> SLP price is within set threshold of min. ${minimum} and  max. ${maximum} || **P ${minimum}**`,
            });
        });
    });

    describe('given slp price is within maximum threshold', () => {
        it('should send an http request to the webhook url', async () => {
            const minimum = 6;
            const maximum = 10;
            mockedAxieService.getSlpPriceInCurrencyOf.mockResolvedValueOnce(maximum);

            const threshold = { minimum, maximum };
            await checkSlpHandler(dependencies, threshold, dummyWebhookUrl);

            expect(mockedAxieService.getSlpPriceInCurrencyOf).toHaveBeenCalledWith(Currency.PHP);
            expect(mockedHttpClient.post).toHaveBeenCalledWith(dummyWebhookUrl, {
                content: `<@&866366582888464424> SLP price is within set threshold of min. ${minimum} and  max. ${maximum} || **P ${maximum}**`,
            });
        });
    });

    describe('given slp price is not within any thresholds', () => {
        it('should not send an http request to the webhook url', async () => {
            const minimum = 6;
            const maximum = 10;
            mockedAxieService.getSlpPriceInCurrencyOf.mockResolvedValueOnce(8);

            const threshold = { minimum, maximum };
            await checkSlpHandler(dependencies, threshold, dummyWebhookUrl);

            expect(mockedAxieService.getSlpPriceInCurrencyOf).toHaveBeenCalledWith(Currency.PHP);
            expect(mockedHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('given an error was encountered by the CRON handler', () => {
        it('should handle the error and log it', async () => {
            const error = new Error();
            mockedAxieService.getSlpPriceInCurrencyOf.mockRejectedValueOnce(error);

            await checkSlpHandler(dependencies, { maximum: 1, minimum: 2 }, dummyWebhookUrl);

            expect(mockedAxieService.getSlpPriceInCurrencyOf).toHaveBeenCalledWith(Currency.PHP);
            expect(mockedLogger.error).toHaveBeenCalledWith(
                'Encountered an error when trying to run check slp price within threshold cron',
                error,
            );
        });
    });

    describe('given create cron was called', () => {
        const defaultCronExpr = '*/5 * * * *';

        beforeEach(() => {
            process.env.CHECK_SLP_PRICE_CRON_EXPR = defaultCronExpr;
        });

        it('should create a cron job for every 5 minutes', () => {
            createCheckSlpPriceWithinThresholdCron(dependencies, { maximum: 1, minimum: 2 }, 'ss');
            expect(mockedScheduler.createJob).toHaveBeenCalledWith(defaultCronExpr, expect.any(Function));
        });
    });
});
