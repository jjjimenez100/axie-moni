import { DiscordCommandList } from '../../../src/services/discord/DiscordCommandList';
import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { Command } from '../../../src/services/discord/Command';

describe('DiscordCommandList tests', () => {
    const dummyCommand = mock<Command<any>>();
    let discordCommandsList: DiscordCommandList;

    beforeEach(() => {
        discordCommandsList = new DiscordCommandList();

        mockClear(dummyCommand);
        mockReset(dummyCommand);
    });

    describe('add () - ', () => {
        it('should not throw any error', () => {
            discordCommandsList.add(dummyCommand);
        });
    });

    describe('findByCommandName () - ', () => {
        it('should be able to return a deep copy of the found command', () => {
            const dummyName = 'naaame';
            dummyCommand.getName.mockReturnValue(dummyName);
            discordCommandsList.add(dummyCommand);

            const foundCommand = discordCommandsList.findByCommandName(dummyName);
            expect(foundCommand).not.toEqual(null);
            expect(foundCommand).not.toEqual(dummyCommand);

            expect(foundCommand?.getName()).toEqual(dummyName);
        });
    });

    describe('findByCommandTrigger () - ', () => {
        it('should be able to return the found command', () => {
            const dummyName = 'naaame-trigger';
            dummyCommand.getCommandTrigger.mockReturnValue(dummyName);
            discordCommandsList.add(dummyCommand);

            const foundCommand = discordCommandsList.findByCommandTrigger(dummyName + 'test');
            expect(foundCommand?.getCommandTrigger()).toEqual(dummyName);
        });
    });

    describe('getAll() - ', () => {
        it('should return all commands', () => {
            const commands = [dummyCommand, dummyCommand, dummyCommand];
            discordCommandsList.add(commands[0]);
            discordCommandsList.add(commands[1]);
            discordCommandsList.add(commands[2]);

            expect(discordCommandsList.getAll().length).toEqual(commands.length);
        });
    });
});
