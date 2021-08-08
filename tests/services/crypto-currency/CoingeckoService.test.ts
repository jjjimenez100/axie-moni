import CoinGecko from 'coingecko-api';
import { CoingeckoService } from '../../../src/services/crypto-currency/CoingeckoService';
import { CryptoCurrencyCode } from '../../../src/services/crypto-currency/CryptoCurrencyCode';
import { Currency } from '../../../src/services/Currency';
import { GetCryptoPriceError } from '../../../src/services/crypto-currency/GetCryptoPriceError';
import { UnexpectedTypeOnCryptoPriceError } from '../../../src/services/crypto-currency/UnexpectedTypeOnCryptoPriceError';

const mockedCoinGeckoApi = {
    simple: {
        price: jest.fn(),
    },
};

describe('CoinGeckoService tests', () => {
    let coinGeckoService: CoingeckoService;

    beforeEach(() => {
        coinGeckoService = new CoingeckoService((mockedCoinGeckoApi as unknown) as CoinGecko);
    });

    describe('getCryptoPrice() - ', () => {
        beforeEach(() => {
            mockedCoinGeckoApi.simple.price.mockClear();
        });

        describe('given request succeeds', () => {
            it('should return slp price', async () => {
                const dummyPrice = 99;
                const dummyResponse = {
                    success: true,
                    message: 'test',
                    data: {
                        [CryptoCurrencyCode.SLP]: {
                            [Currency.PHP]: dummyPrice,
                        },
                    },
                };

                mockedCoinGeckoApi.simple.price.mockResolvedValueOnce(dummyResponse);
                const price = await coinGeckoService.getCryptoPrice(CryptoCurrencyCode.SLP, Currency.PHP);

                expect(price).toBe(dummyPrice);
                expect(mockedCoinGeckoApi.simple.price).toHaveBeenCalledTimes(1);
                expect(mockedCoinGeckoApi.simple.price).toHaveBeenCalledWith({
                    ids: CryptoCurrencyCode.SLP,
                    vs_currencies: Currency.PHP,
                });
            });
        });

        describe('given request fails', () => {
            it('should throw GetCryptoPrice error', async () => {
                mockedCoinGeckoApi.simple.price.mockRejectedValueOnce(new Error());
                await expect(
                    coinGeckoService.getCryptoPrice(CryptoCurrencyCode.SLP, Currency.PHP),
                ).rejects.toThrowError(GetCryptoPriceError);
            });
        });

        describe('given parsed crypto price is not a number', () => {
            it('should throw UnexpectedTypeOnCryptoPriceError', async () => {
                const dummyPrice = '99';
                const dummyResponse = {
                    success: true,
                    message: 'test',
                    data: {
                        [CryptoCurrencyCode.SLP]: {
                            [Currency.PHP]: dummyPrice,
                        },
                    },
                };

                mockedCoinGeckoApi.simple.price.mockResolvedValueOnce(dummyResponse);
                await expect(
                    coinGeckoService.getCryptoPrice(CryptoCurrencyCode.SLP, Currency.PHP),
                ).rejects.toThrowError(UnexpectedTypeOnCryptoPriceError);
            });
        });
    });
});
