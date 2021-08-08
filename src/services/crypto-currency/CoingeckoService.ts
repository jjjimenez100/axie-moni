import { CryptoCurrencyService } from './CryptoCurrencyService';
import { CryptoCurrencyCode } from './CryptoCurrencyCode';
import { Currency } from '../Currency';
import CoinGecko from 'coingecko-api';
import { get as getNestedProperty, isNumber } from 'lodash';
import { GetCryptoPriceError } from './GetCryptoPriceError';
import { UnexpectedTypeOnCryptoPriceError } from './UnexpectedTypeOnCryptoPriceError';

export class CoingeckoService implements CryptoCurrencyService {
    constructor(private readonly coingeckoApi: CoinGecko) {}

    public async getCryptoPrice(cryptoCode: CryptoCurrencyCode, currency: Currency): Promise<number> {
        let response: object = {};
        try {
            response = await this.coingeckoApi.simple.price({
                ids: cryptoCode,
                vs_currencies: currency,
            });
        } catch (error) {
            throw new GetCryptoPriceError(cryptoCode, currency);
        }

        const cryptoPrice = getNestedProperty(response, ['data', cryptoCode, currency]);
        if (!cryptoPrice || !isNumber(cryptoPrice)) {
            throw new UnexpectedTypeOnCryptoPriceError(response);
        }

        return cryptoPrice;
    }
}
