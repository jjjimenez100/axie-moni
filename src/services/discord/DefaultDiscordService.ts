import { CommandList } from './CommandList';
import { DiscordManager } from './DiscordManager';
import { EventHook } from './EventHook';
import Logger from '../../lib/Logger';
import { Message } from 'discord.js';
import { DiscordService } from './DiscordService';

export class DefaultDiscordService implements DiscordService {
    constructor(
        private readonly commandList: CommandList,
        private readonly manager: DiscordManager,
        private readonly logger: Logger,
        private readonly botChannelId: string,
    ) {}

    public async start(token: string): Promise<void> {
        this.manager.addEventHandler(EventHook.NEW_MESSAGE_RECEIVED, (params: any[]) => this.processNewMessage(params));

        await this.manager.initialize(token, () => {
            this.logger.info('Client successfully started');
        });
    }

    public async processNewMessage(params: any[]): Promise<void> {
        const message: Message = params[0];

        if (!message) {
            throw new Error('Expecting message as the first item of the event parameter');
        }

        this.logger.info(`Got message: ${message.content}`);

        const content = message.content;
        const matchingCommand = this.commandList.findByCommandTrigger(content);

        if (!matchingCommand) {
            this.logger.info(`No matching command for ${content}`);
            return;
        }

        let result: string;
        try {
            result = await matchingCommand.execute(content);
        } catch (error) {
            result = `Encountered an error when trying to run ${matchingCommand.getName()}`;
            this.logger.error(result, error);
        }

        try {
            await this.manager.sendMessage(this.botChannelId, result);
        } catch (error) {
            this.logger.error(
                `Failed to send message to discord channel ${this.botChannelId} with message of ${result}`,
            );
        }
    }
}
