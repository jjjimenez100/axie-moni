import { DiscordManager } from './DiscordManager';
import { EventHook } from './EventHook';
import { Client, ClientEvents, TextChannel } from 'discord.js';
import { UnrecognizedEventHookError } from './UnrecognizedEventHookError';
import { FailedToInitializeDiscordClientError } from './FailedToInitializeDiscordClientError';
import Logger from '../../lib/Logger';
import { FailedToSendDiscordMessageError } from './FailedToSendDiscordMessageError';

export class DefaultDiscordManager implements DiscordManager {
    constructor(private readonly client: Client, private readonly logger: Logger) {}

    public addEventHandler(eventHook: EventHook, handler: Function): void {
        const mappedEvent = this.mapEventHookToDiscordJsEvent(eventHook);
        this.client.on(mappedEvent, async (...args) => {
            await handler(args);
        });
    }

    private mapEventHookToDiscordJsEvent(eventHook: EventHook): keyof ClientEvents {
        if (eventHook === EventHook.NEW_MESSAGE_RECEIVED) {
            return 'messageCreate';
        }

        throw new UnrecognizedEventHookError(eventHook);
    }

    public async initialize(token: string, onReadyHandler: Function): Promise<void> {
        try {
            this.client.once('ready', async () => {
                await onReadyHandler();
            });
            await this.client.login(token);
        } catch (error) {
            this.logger.error('Failed to initialize discord client', error);
            throw new FailedToInitializeDiscordClientError();
        }
    }

    public async sendMessage(id: string, message: string): Promise<void> {
        try {
            const channel = await this.client.channels.fetch(id);
            if (!channel) {
                throw new Error('Channel does not exist');
            }

            const parsedChannel = channel as TextChannel;
            await parsedChannel.send(message);
        } catch (error) {
            this.logger.error('Failed to send discord message', error);
            throw new FailedToSendDiscordMessageError(message);
        }
    }
}
