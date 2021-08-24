import { Command } from './Command';

export interface CommandList {
    add(command: Command<any>): void;
    findByCommandName(commandName: string): Command<any> | null;
    findByCommandTrigger(commandTrigger: string): Command<any> | null;
    getAll(): Command<any>[];
}
