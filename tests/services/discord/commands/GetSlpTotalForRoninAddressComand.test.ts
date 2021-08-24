import { GetSlpTotalForRoninAddressCommand } from '../../../../src/services/discord/commands/GetSlpTotalForRoninAddressCommand';
import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { AxieInfinityService } from '../../../../src/services/axie-infinity/AxieInfinityService';
import { SmoothLovePotion } from '../../../../src/entities/SmoothLovePotion';

describe('GetSlpTotalForRoninAddressCommand tests', () => {
    const mockedAxieInfinityService = mock<AxieInfinityService>();
    let getSlpTotalForRoninAddressCommand: GetSlpTotalForRoninAddressCommand;

    beforeEach(() => {
        mockReset(mockedAxieInfinityService);
        mockClear(mockedAxieInfinityService);

        getSlpTotalForRoninAddressCommand = new GetSlpTotalForRoninAddressCommand(mockedAxieInfinityService);
    });

    describe('execute() - ', () => {
        it('should return message containing slp account details', async () => {
            const dummySmoothLovePotion: SmoothLovePotion = SmoothLovePotion.fromResponse({
                last_claimed_item_at: 144515,
                total: 24,
                claimable_total: 39,
            });
            mockedAxieInfinityService.getSlp.mockResolvedValueOnce(dummySmoothLovePotion);

            const dummyRoninAddr = 'ronin:';
            const message = await getSlpTotalForRoninAddressCommand.execute(dummyRoninAddr);
            expect(message).toEqual(
                `**Total SLP**: ${dummySmoothLovePotion.total}\n **Claimable Total**: ${dummySmoothLovePotion.claimableTotal}\n **Last Claimed At**: ${dummySmoothLovePotion.lastClaimedAt}`,
            );

            expect(mockedAxieInfinityService.getSlp).toHaveBeenCalledWith(dummyRoninAddr);
        });

        it('should re-throw any errors', async () => {
            mockedAxieInfinityService.getSlp.mockRejectedValueOnce(new Error());
            await expect(getSlpTotalForRoninAddressCommand.execute('s')).rejects.toThrowError(Error);
        });
    });

    describe('getName() - ', () => {
        it('should return command name', () => {
            expect(getSlpTotalForRoninAddressCommand.getName()).toEqual('GET_SLP_TOTAL_FOR_RONIN_ADDRESS');
        });
    });

    describe('getCommandTrigger() - ', () => {
        it('should return command trigger', () => {
            expect(getSlpTotalForRoninAddressCommand.getCommandTrigger()).toEqual('ronin:');
        });
    });
});
