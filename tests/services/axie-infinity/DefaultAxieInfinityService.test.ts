import { HttpClient } from '../../../src/lib/http-client/HttpClient';
import { CryptoCurrencyService } from '../../../src/services/crypto-currency/CryptoCurrencyService';

import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { DefaultAxieInfinityService } from '../../../src/services/axie-infinity/DefaultAxieInfinityService';
import { SmoothLovePotion, SmoothLovePotionResponse } from '../../../src/entities/SmoothLovePotion';
import { Currency } from '../../../src/services/Currency';

describe('DefaultAxieInfinityService tests', () => {
    const mockedHttpClient = mock<HttpClient>();
    const mockedCryptoCurrencyService = mock<CryptoCurrencyService>();
    let defaultAxieInfinityService: DefaultAxieInfinityService;

    beforeEach(() => {
        mockReset(mockedHttpClient);
        mockClear(mockedHttpClient);

        mockReset(mockedCryptoCurrencyService);
        mockClear(mockedCryptoCurrencyService);

        defaultAxieInfinityService = new DefaultAxieInfinityService(mockedHttpClient, mockedCryptoCurrencyService);
    });

    describe('getSlp() -', () => {
        describe('given request succeeds', () => {
            it('should return SmoothLovePotion instance', async () => {
                const dummyRoninAddress = 'tessst';
                const dummySmoothLovePotionResponse: SmoothLovePotionResponse = {
                    total: 12,
                    last_claimed_item_at: 12,
                    claimable_total: 12,
                };
                mockedHttpClient.get.mockResolvedValueOnce(dummySmoothLovePotionResponse);
                const smoothLovePotion = await defaultAxieInfinityService.getSlp(dummyRoninAddress);

                expect(smoothLovePotion).toBeInstanceOf(SmoothLovePotion);

                const slpUrl = DefaultAxieInfinityService.GET_SLP_URL.replace(':ronin_address', dummyRoninAddress);
                expect(mockedHttpClient.get).toHaveBeenCalledTimes(1);
                expect(mockedHttpClient.get).toHaveBeenCalledWith(slpUrl);
            });
        });

        describe('given request fails', () => {
            it('should re-throw the error', async () => {
                mockedHttpClient.get.mockRejectedValueOnce(new Error());
                await expect(defaultAxieInfinityService.getSlp('dummy')).rejects.toThrowError(Error);
            });
        });
    });

    describe('getSlpPriceInCurrencyOf() - ', () => {
        describe('given request succeeds', () => {
            it('should return SLP price', async () => {
                const dummyPrice = 69;
                mockedCryptoCurrencyService.getCryptoPrice.mockResolvedValueOnce(dummyPrice);
                const slpPrice = await defaultAxieInfinityService.getSlpPriceInCurrencyOf(Currency.PHP);

                expect(slpPrice).toBe(dummyPrice);
            });
        });

        describe('given request fails', () => {
            it('should re-throw any errors', async () => {
                const dummyPrice = 69;
                mockedCryptoCurrencyService.getCryptoPrice.mockRejectedValueOnce(new Error());
                await expect(defaultAxieInfinityService.getSlpPriceInCurrencyOf(Currency.PHP)).rejects.toThrowError(
                    Error,
                );
            });
        });
    });
});
