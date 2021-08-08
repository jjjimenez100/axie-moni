import { Currency } from '../Currency';
import { CryptoCurrencyCode } from './CryptoCurrencyCode';

export interface CryptoCurrencyService {
    getCryptoPrice(cryptoCode: CryptoCurrencyCode, currency: Currency): Promise<number>;
}
