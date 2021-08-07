import moment from 'moment-timezone';
import { clone } from 'lodash';
import { TimezoneNotSupportedError } from '../services/axie-infinity/TimezoneNotSupportedError';

export interface SmoothLovePotionResponse {
    total: number;
    claimable_total: number;
    last_claimed_at: number;
}

export class SmoothLovePotion {
    private static DEFAULT_TIMEZONE = 'Asia/Manila';
    private static SUPPORTED_TIMEZONES: string[] = moment.tz.names();

    private readonly lastClaimedAt: Date;

    private constructor(
        private readonly total: number,
        private readonly claimableTotal: number,
        lastClaimedAt: number,
    ) {
        this.lastClaimedAt = this.parseTimestamp(lastClaimedAt);
    }

    public static getTimezone(): string {
        return this.DEFAULT_TIMEZONE;
    }

    public static setTimezone(newTimezone: string): void {
        const isValidTimezone = this.SUPPORTED_TIMEZONES.find(supportedTimezone => supportedTimezone === newTimezone);
        if (!isValidTimezone) {
            throw new TimezoneNotSupportedError(newTimezone);
        }

        this.DEFAULT_TIMEZONE = newTimezone;
    }

    public static getSupportedTimezones(): string[] {
        return clone(this.SUPPORTED_TIMEZONES);
    }

    public static fromResponse(response: SmoothLovePotionResponse): SmoothLovePotion {
        return new SmoothLovePotion(response.total, response.claimable_total, response.last_claimed_at);
    }

    private parseTimestamp(timestamp: number): Date {
        return moment.tz(new Date(timestamp * 1000), SmoothLovePotion.DEFAULT_TIMEZONE).toDate();
    }
}
