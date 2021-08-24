import { GetSlpPriceCommand } from '../../../../src/services/discord/commands/GetSlpPriceCommand';
import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { CryptoCurrencyService } from '../../../../src/services/crypto-currency/CryptoCurrencyService';
import { Currency } from '../../../../src/services/Currency';
import { CryptoCurrencyCode } from '../../../../src/services/crypto-currency/CryptoCurrencyCode';

describe('GetSlpPriceCommand tests', () => {
    const mockedCryptoCurrencyService = mock<CryptoCurrencyService>();
    let getSlpPriceCommand: GetSlpPriceCommand;

    beforeEach(() => {
        mockReset(mockedCryptoCurrencyService);
        mockClear(mockedCryptoCurrencyService);

        getSlpPriceCommand = new GetSlpPriceCommand(mockedCryptoCurrencyService);
    });

    describe('execute() - ', () => {
        it('should return message containing slp price', async () => {
            const dummyPrice = 69;
            mockedCryptoCurrencyService.getCryptoPrice.mockResolvedValueOnce(dummyPrice);

            const message = await getSlpPriceCommand.execute();
            expect(message).toEqual(`Current price of SLP is ${dummyPrice} ${Currency.PHP}`);

            expect(mockedCryptoCurrencyService.getCryptoPrice).toHaveBeenCalledWith(
                CryptoCurrencyCode.SLP,
                Currency.PHP,
            );
        });

        it('should re-throw any errors', async () => {
            mockedCryptoCurrencyService.getCryptoPrice.mockRejectedValueOnce(new Error());
            await expect(getSlpPriceCommand.execute()).rejects.toThrowError(Error);

            expect(mockedCryptoCurrencyService.getCryptoPrice).toHaveBeenCalledWith(
                CryptoCurrencyCode.SLP,
                Currency.PHP,
            );
        });
    });

    describe('getName() - ', () => {
        it('should return command name', () => {
            expect(getSlpPriceCommand.getName()).toEqual('GET_SLP_PRICE');
        });
    });

    describe('getCommandTrigger() - ', () => {
        it('should return command trigger', () => {
            expect(getSlpPriceCommand.getCommandTrigger()).toEqual('get slp price');
        });
    });
});
