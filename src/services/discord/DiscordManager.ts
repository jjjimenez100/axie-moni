import { EventHook } from './EventHook';

export interface DiscordManager {
    initialize(token: string, onReadyHandler: Function): Promise<void>;
    addEventHandler(eventHook: EventHook, handler: Function): void;
    sendMessage(id: string, message: string): Promise<void>;
}
