import { cloneDeep } from 'lodash';

import { CommandList } from './CommandList';
import { Command } from './Command';

export class DiscordCommandList implements CommandList {
    private readonly commands: Command<any>[];

    constructor() {
        this.commands = [];
    }

    public add(command: Command<any>): void {
        this.commands.push(command);
    }

    public findByCommandName(commandName: string): Command<any> | null {
        const foundCommand = this.commands.find(command => command.getName() === commandName);

        if (!foundCommand) {
            return null;
        }

        return cloneDeep(foundCommand);
    }

    public findByCommandTrigger(commandTrigger: string): Command<any> | null {
        const foundCommand = this.commands.find(command => commandTrigger.startsWith(command.getCommandTrigger()));

        if (!foundCommand) {
            return null;
        }

        return cloneDeep(foundCommand);
    }

    public getAll(): Command<any>[] {
        return cloneDeep(this.commands);
    }
}
