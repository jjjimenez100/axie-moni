export interface Command<T> {
    execute(...args: any[]): Promise<T>;
    getName(): string;
    getCommandTrigger(): string;
}
