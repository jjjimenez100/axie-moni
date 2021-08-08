import { CryptoCurrencyCode } from './CryptoCurrencyCode';
import { Currency } from '../Currency';

export class GetCryptoPriceError extends Error {
    private static readonly message = 'Encountered an unexpected error when fetching crypto price';

    constructor(private readonly cryptoCode: CryptoCurrencyCode, private readonly currency: Currency) {
        super(GetCryptoPriceError.message);
        this.stack = new Error().stack;
    }
}
