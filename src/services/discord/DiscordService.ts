export interface DiscordService {
    start(token: string): Promise<void>;
    processNewMessage(params: any[]): Promise<void>;
}
