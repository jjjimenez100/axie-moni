import { Scheduler } from '../services/scheduler/Scheduler';
import { AxieInfinityService } from '../services/axie-infinity/AxieInfinityService';
import { HttpClient } from '../lib/http-client/HttpClient';
import Logger from '../lib/Logger';
import { ScheduledJob } from '../services/scheduler/ScheduledJob';
import { Currency } from '../services/Currency';
import { CHECK_SLP_PRICE_CRON_EXPR } from '../config/cron';

export interface CheckSlpPriceDependencies {
    scheduler: Scheduler;
    axieService: AxieInfinityService;
    httpClient: HttpClient;
    logger: Logger;
}

export interface ValueThreshold {
    minimum: number;
    maximum: number;
}

export const checkSlpHandler = async (
    dependencies: CheckSlpPriceDependencies,
    threshold: ValueThreshold,
    webhookUrl: string,
): Promise<void> => {
    const { httpClient, logger, axieService } = dependencies;
    const { minimum, maximum } = threshold;

    logger.info('Starting check slp price within threshold CRON');
    try {
        const currentSlpPrice = await axieService.getSlpPriceInCurrencyOf(Currency.PHP);
        const isWithinMinimumThreshold = currentSlpPrice <= minimum;
        const isWithinMaximumThreshold = currentSlpPrice >= maximum;
        const isWithinThresholds = isWithinMaximumThreshold || isWithinMinimumThreshold;

        if (isWithinThresholds) {
            const requestBody = {
                content: `<@&866366582888464424> SLP price is within set threshold of min. ${minimum} and  max. ${maximum} || **P ${currentSlpPrice}**`,
            };
            await httpClient.post(webhookUrl, requestBody);
        }
    } catch (error) {
        logger.error('Encountered an error when trying to run check slp price within threshold cron', error);
    }
    logger.info('Done executing check slp price within threshold CRON');
};

export const createCheckSlpPriceWithinThresholdCron = (
    dependencies: CheckSlpPriceDependencies,
    threshold: ValueThreshold,
    webhookUrl: string,
): ScheduledJob => {
    const { scheduler } = dependencies;

    return scheduler.createJob(CHECK_SLP_PRICE_CRON_EXPR, () => checkSlpHandler(dependencies, threshold, webhookUrl));
};
