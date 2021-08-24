import { Command } from '../Command';
import { CryptoCurrencyService } from '../../crypto-currency/CryptoCurrencyService';
import { CryptoCurrencyCode } from '../../crypto-currency/CryptoCurrencyCode';
import { Currency } from '../../Currency';

export class GetSlpPriceCommand implements Command<string> {
    private static readonly COMMAND_NAME = 'GET_SLP_PRICE';
    private static readonly COMMAND_TRIGGER = 'get slp price';

    constructor(private readonly cryptoCurrencyService: CryptoCurrencyService) {}

    public async execute(): Promise<string> {
        const price = await this.cryptoCurrencyService.getCryptoPrice(CryptoCurrencyCode.SLP, Currency.PHP);

        return `Current price of SLP is ${price} ${Currency.PHP}`;
    }

    public getName(): string {
        return GetSlpPriceCommand.COMMAND_NAME;
    }

    public getCommandTrigger(): string {
        return GetSlpPriceCommand.COMMAND_TRIGGER;
    }
}
