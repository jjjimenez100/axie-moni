import { HttpClient } from '../../../src/lib/http-client/HttpClient';
import { mock, mockReset, mockClear } from 'jest-mock-extended';
import { DefaultAxieInfinityService } from '../../../src/services/axie-infinity/DefaultAxieInfinityService';
import { SmoothLovePotion, SmoothLovePotionResponse } from '../../../src/entities/SmoothLovePotion';

describe('DefaultAxieInfinityService tests', () => {
    const mockedHttpClient = mock<HttpClient>();
    let defaultAxieInfinityService: DefaultAxieInfinityService;

    beforeEach(() => {
        mockReset(mockedHttpClient);
        mockClear(mockedHttpClient);

        defaultAxieInfinityService = new DefaultAxieInfinityService(mockedHttpClient);
    });

    describe('getSlp() -', () => {
        describe('given request succeeds', () => {
            it('should return SmoothLovePotion instance', async () => {
                const dummyRoninAddress = 'tessst';
                const dummySmoothLovePotionResponse: SmoothLovePotionResponse = {
                    total: 12,
                    last_claimed_at: 12,
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
});
