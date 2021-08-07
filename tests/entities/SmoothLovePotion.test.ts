import { SmoothLovePotion, SmoothLovePotionResponse } from '../../src/entities/SmoothLovePotion';
import { TimezoneNotSupportedError } from '../../src/services/axie-infinity/TimezoneNotSupportedError';
import moment from 'moment-timezone';

describe('SmoothLovePotion tests', () => {
    const defaultTimezone = SmoothLovePotion.getTimezone();
    beforeEach(() => {
        SmoothLovePotion.setTimezone(defaultTimezone);
    });

    describe('getTimezone() - ', () => {
        it('should return DEFAULT_TIMEZONE', () => {
            const timezone = SmoothLovePotion.getTimezone();
            expect(timezone).toBe(defaultTimezone);
        });
    });

    describe('setTimezone() - ', () => {
        describe('given valid timezone of Africa/Abidjan', () => {
            it('should set timezone to Africa/Abidjan', () => {
                const newTimezone = 'Africa/Abidjan';
                SmoothLovePotion.setTimezone(newTimezone);
                expect(SmoothLovePotion.getTimezone()).toBe(newTimezone);
            });
        });

        describe('given invalid timezone test', () => {
            it('should throw TimezoneNotSupportedError', () => {
                const newTimezone = 'test';
                expect(() => SmoothLovePotion.setTimezone(newTimezone)).toThrowError(TimezoneNotSupportedError);
            });
        });
    });

    describe('getSupportedTimezones() - ', () => {
        describe('given supported timezones from moment.tz', () => {
            it('should return a deep copy of supported timezones', () => {
                expect(SmoothLovePotion.getSupportedTimezones()).not.toBe(moment.tz.names());
            });
        });
    });

    describe('fromResponse() - ', () => {
        describe('given SmoothLovePotionResponse', () => {
            it('should return SmoothLovePotion instance', () => {
                const smoothLovePotionResponse: SmoothLovePotionResponse = {
                    total: 12,
                    last_claimed_at: 12,
                    claimable_total: 12,
                };
                expect(() => SmoothLovePotion.fromResponse(smoothLovePotionResponse)).not.toThrowError();
            });
        });
    });
});
