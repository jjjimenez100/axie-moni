import { AxieInfinityService } from './AxieInfinityService';
import { SmoothLovePotion, SmoothLovePotionResponse } from '../../entities/SmoothLovePotion';
import { HttpClient } from '../../lib/http-client/HttpClient';
import { Currency } from '../Currency';
import { CryptoCurrencyService } from '../crypto-currency/CryptoCurrencyService';
import { CryptoCurrencyCode } from '../crypto-currency/CryptoCurrencyCode';

export class DefaultAxieInfinityService implements AxieInfinityService {
    public static readonly GET_SLP_URL = 'https://game-api.skymavis.com/game-api/clients/:ronin_address/items/1';

    constructor(
        private readonly httpClient: HttpClient,
        private readonly cryptoCurrencyService: CryptoCurrencyService,
    ) {}

    public async getSlp(roninAddress: string): Promise<SmoothLovePotion> {
        const getSlpUrl = DefaultAxieInfinityService.GET_SLP_URL.replace(':ronin_address', roninAddress);
        const response = (await this.httpClient.get(getSlpUrl)) as SmoothLovePotionResponse;

        return SmoothLovePotion.fromResponse(response);
    }

    public getSlpPriceInCurrencyOf(currency: Currency): Promise<number> {
        return this.cryptoCurrencyService.getCryptoPrice(CryptoCurrencyCode.SLP, currency);
    }
}
