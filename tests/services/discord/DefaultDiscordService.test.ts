import { mock, mockClear, mockReset } from 'jest-mock-extended';
import { CommandList } from '../../../src/services/discord/CommandList';
import { DiscordManager } from '../../../src/services/discord/DiscordManager';
import Logger from '../../../src/lib/Logger';
import { DefaultDiscordService } from '../../../src/services/discord/DefaultDiscordService';
import { Command } from '../../../src/services/discord/Command';

describe('DefaultDiscordService tests', () => {
    const mockedCommandList = mock<CommandList>();
    const mockedCommand = mock<Command<string>>();
    const mockedDiscordManager = mock<DiscordManager>();
    const mockedLogger = mock<Logger>();
    const dummyBotChannelId = 'teeest-channeeel';

    let defaultDiscordService: DefaultDiscordService;

    beforeEach(() => {
        mockReset(mockedCommandList);
        mockClear(mockedCommandList);

        mockReset(mockedCommand);
        mockClear(mockedCommand);

        mockReset(mockedDiscordManager);
        mockClear(mockedDiscordManager);

        mockReset(mockedLogger);
        mockClear(mockedLogger);

        jest.resetAllMocks();

        defaultDiscordService = new DefaultDiscordService(
            mockedCommandList,
            mockedDiscordManager,
            mockedLogger,
            dummyBotChannelId,
        );
    });

    describe('start () - ', () => {
        describe('given initialization encounters no errors', () => {
            it('should not throw any errors', async () => {
                mockedDiscordManager.initialize.mockResolvedValueOnce();
                await defaultDiscordService.start('test');

                expect(mockedDiscordManager.addEventHandler).toHaveBeenCalled();
                expect(mockedDiscordManager.initialize).toHaveBeenCalled();
            });
        });

        describe('given initialization encounters an error', () => {
            it('should re-throw that error', async () => {
                mockedDiscordManager.initialize.mockRejectedValueOnce(new Error());
                await expect(defaultDiscordService.start('test')).rejects.toThrowError(Error);

                expect(mockedDiscordManager.addEventHandler).toHaveBeenCalled();
                expect(mockedDiscordManager.initialize).toHaveBeenCalled();
            });
        });
    });

    describe('processNewMessage () - ', () => {
        describe('given params has one element, a matching command, and no errors encountered during execution', () => {
            it('should be able to send message to channel', async () => {
                const dummyResult = 'dummy-result';
                mockedCommand.execute.mockResolvedValueOnce(dummyResult);
                mockedCommandList.findByCommandTrigger.mockReturnValue(mockedCommand);

                const dummyContent = 'dummy-content';
                const dummyParams = [
                    {
                        content: dummyContent,
                    },
                ];
                await defaultDiscordService.processNewMessage(dummyParams);

                expect(mockedLogger.info).toHaveBeenCalledWith(`Got message: ${dummyContent}`);
                expect(mockedCommandList.findByCommandTrigger).toHaveBeenCalledWith(dummyContent);
                expect(mockedCommand.execute).toHaveBeenCalledWith(dummyContent);
                expect(mockedDiscordManager.sendMessage).toHaveBeenCalledWith(dummyBotChannelId, dummyResult);
            });
        });

        describe('given params has no elements', () => {
            it('should throw an error', async () => {
                const dummyParams: any[] = [];
                await expect(defaultDiscordService.processNewMessage(dummyParams)).rejects.toThrowError(Error);

                expect(mockedCommandList.findByCommandTrigger).not.toHaveBeenCalled();
                expect(mockedCommand.execute).not.toHaveBeenCalled();
                expect(mockedDiscordManager.sendMessage).not.toHaveBeenCalled();
            });
        });

        describe('given no matching commands', () => {
            it('should log and halt execution', async () => {
                mockedCommandList.findByCommandTrigger.mockReturnValue(null);

                const dummyContent = 'dummy-content';
                const dummyParams = [
                    {
                        content: dummyContent,
                    },
                ];
                await defaultDiscordService.processNewMessage(dummyParams);

                expect(mockedLogger.info).toHaveBeenCalledWith(`No matching command for ${dummyContent}`);
                expect(mockedCommandList.findByCommandTrigger).toHaveBeenCalledWith(dummyContent);
                expect(mockedCommand.execute).not.toHaveBeenCalled();
                expect(mockedDiscordManager.sendMessage).not.toHaveBeenCalled();
            });
        });

        describe('given a matching command', () => {
            describe('given sending of message throws an error', () => {
                it('should log the error', async () => {
                    const dummyResult = 'dummy-result';
                    mockedCommand.execute.mockResolvedValueOnce(dummyResult);
                    mockedCommandList.findByCommandTrigger.mockReturnValue(mockedCommand);
                    mockedDiscordManager.sendMessage.mockRejectedValueOnce(new Error());

                    const dummyContent = 'dummy-content';
                    const dummyParams = [
                        {
                            content: dummyContent,
                        },
                    ];
                    await defaultDiscordService.processNewMessage(dummyParams);

                    expect(mockedLogger.error).toHaveBeenCalledWith(
                        `Failed to send message to discord channel ${dummyBotChannelId} with message of ${dummyResult}`,
                    );
                    expect(mockedCommandList.findByCommandTrigger).toHaveBeenCalledWith(dummyContent);
                    expect(mockedCommand.execute).toHaveBeenCalledWith(dummyContent);
                });
            });

            describe('given execution throws an error', () => {
                it('should log and set result to error message', async () => {
                    const dummyCommandName = 'dummy-command-name';
                    const dummyResult = `Encountered an error when trying to run ${dummyCommandName}`;
                    mockedCommand.getName.mockReturnValueOnce(dummyCommandName);

                    const error = new Error();
                    mockedCommand.execute.mockRejectedValueOnce(error);
                    mockedCommandList.findByCommandTrigger.mockReturnValue(mockedCommand);

                    const dummyContent = 'dummy-content';
                    const dummyParams = [
                        {
                            content: dummyContent,
                        },
                    ];
                    await defaultDiscordService.processNewMessage(dummyParams);

                    expect(mockedLogger.info).toHaveBeenCalledWith(`Got message: ${dummyContent}`);
                    expect(mockedLogger.error).toHaveBeenCalledWith(dummyResult, error);
                    expect(mockedCommandList.findByCommandTrigger).toHaveBeenCalledWith(dummyContent);
                    expect(mockedCommand.execute).toHaveBeenCalledWith(dummyContent);
                    expect(mockedDiscordManager.sendMessage).toHaveBeenCalledWith(dummyBotChannelId, dummyResult);
                });
            });
        });
    });
});
