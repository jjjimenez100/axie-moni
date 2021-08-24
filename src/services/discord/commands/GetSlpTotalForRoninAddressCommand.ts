import { Command } from '../Command';
import { AxieInfinityService } from '../../axie-infinity/AxieInfinityService';
import { SmoothLovePotion } from '../../../entities/SmoothLovePotion';

export class GetSlpTotalForRoninAddressCommand implements Command<string> {
    private static readonly COMMAND_NAME = 'GET_SLP_TOTAL_FOR_RONIN_ADDRESS';
    private static readonly COMMAND_TRIGGER = 'ronin:';

    constructor(private readonly axieService: AxieInfinityService) {}

    public async execute(roninAddress: string): Promise<string> {
        const slp: SmoothLovePotion = await this.axieService.getSlp(roninAddress);
        const { total, claimableTotal, lastClaimedAt } = slp;

        return `**Total SLP**: ${total}\n **Claimable Total**: ${claimableTotal}\n **Last Claimed At**: ${lastClaimedAt}`;
    }

    public getName(): string {
        return GetSlpTotalForRoninAddressCommand.COMMAND_NAME;
    }

    public getCommandTrigger(): string {
        return GetSlpTotalForRoninAddressCommand.COMMAND_TRIGGER;
    }
}
