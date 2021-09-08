import dotenv from 'dotenv';
dotenv.config();

import { CryptoCurrencyService } from '../services/crypto-currency/CryptoCurrencyService';
import { CoingeckoService } from '../services/crypto-currency/CoingeckoService';
import coinGecko from 'coingecko-api';
import { HttpClient } from '../lib/http-client/HttpClient';
import { AxiosHttpClient } from '../lib/http-client/AxiosHttpClient';
import axios from 'axios';
import { AxieInfinityService } from '../services/axie-infinity/AxieInfinityService';
import { DefaultAxieInfinityService } from '../services/axie-infinity/DefaultAxieInfinityService';
import { Currency } from '../services/Currency';

(async () => {
    const coingeckoService: CryptoCurrencyService = new CoingeckoService(new coinGecko());
    const defaultHttpClient: HttpClient = new AxiosHttpClient(axios);
    const axieService: AxieInfinityService = new DefaultAxieInfinityService(defaultHttpClient, coingeckoService);

    const currentSlpPrice = await axieService.getSlpPriceInCurrencyOf(Currency.PHP);
    const { DISCORD_WEBHOOK = '' } = process.env;
    const requestBody = {
        content: `P ${currentSlpPrice}`,
    };
    await defaultHttpClient.post(DISCORD_WEBHOOK, requestBody);
})();
