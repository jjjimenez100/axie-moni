import { DefaultDiscordManager } from '../../../src/services/discord/DefaultDiscordManager';
import { mock, mockClear, mockReset } from 'jest-mock-extended';
import Logger from '../../../src/lib/Logger';
import { EventHook } from '../../../src/services/discord/EventHook';
import { UnrecognizedEventHookError } from '../../../src/services/discord/UnrecognizedEventHookError';
import { FailedToInitializeDiscordClientError } from '../../../src/services/discord/FailedToInitializeDiscordClientError';
import { FailedToSendDiscordMessageError } from '../../../src/services/discord/FailedToSendDiscordMessageError';

describe('DefaultDiscordManager tests', () => {
    const dummyClient = {
        on: jest.fn(),
        once: jest.fn(),
        login: jest.fn(),
        channels: {
            fetch: jest.fn(),
        },
    };
    const mockedLogger = mock<Logger>();
    let defaultDiscordManager: DefaultDiscordManager;

    beforeEach(() => {
        mockReset(mockedLogger);
        mockClear(mockedLogger);

        jest.clearAllMocks();

        defaultDiscordManager = new DefaultDiscordManager((dummyClient as unknown) as any, mockedLogger);
    });

    describe('addEventHandler () - ', () => {
        describe('given valid event hook', () => {
            it('should not throw an error', () => {
                defaultDiscordManager.addEventHandler(EventHook.NEW_MESSAGE_RECEIVED, () => {
                    return 1;
                });

                expect(dummyClient.on).toHaveBeenCalled();
            });
        });

        describe('given invalid event hook', () => {
            it('should throw UnrecognizedEventHookError', () => {
                expect(() =>
                    defaultDiscordManager.addEventHandler(('test' as unknown) as any, () => {
                        return 1;
                    }),
                ).toThrowError(UnrecognizedEventHookError);
                expect(dummyClient.on).not.toHaveBeenCalled();
            });
        });
    });

    describe('initialize () - ', () => {
        describe('given no errors were encountered by the client', () => {
            it('should be able to initialize client', async () => {
                const dummyToken = 'dumb-token';
                await defaultDiscordManager.initialize(dummyToken, () => {
                    return 1;
                });

                expect(dummyClient.once).toHaveBeenCalled();
                expect(dummyClient.login).toHaveBeenCalledWith(dummyToken);
            });
        });

        describe('given an error has been encountered by the client', () => {
            it('should throw FailedToInitializeDiscordClientError', async () => {
                const dummyToken = 'dumb-token';
                const error = new Error();
                dummyClient.login.mockRejectedValueOnce(error);
                await expect(
                    defaultDiscordManager.initialize(dummyToken, () => {
                        return 1;
                    }),
                ).rejects.toThrowError(FailedToInitializeDiscordClientError);
                expect(mockedLogger.error).toHaveBeenCalledWith('Failed to initialize discord client', error);
            });
        });
    });

    describe('sendMessage () - ', () => {
        describe('given channel exists', () => {
            it('should be able to send the message', async () => {
                const dummySend = jest.fn();
                dummyClient.channels.fetch.mockResolvedValueOnce({
                    send: dummySend,
                });

                const dummyChannelId = 'channel-x';
                const dummyMessage = 'dummy-msg';
                await defaultDiscordManager.sendMessage(dummyChannelId, dummyMessage);
                expect(dummyClient.channels.fetch).toHaveBeenCalledWith(dummyChannelId);
                expect(dummySend).toHaveBeenCalledWith(dummyMessage);
            });
        });

        describe('given channel does not exist', () => {
            it('should throw a FailedToSendDiscordMessageError', async () => {
                const error = new Error();
                dummyClient.channels.fetch.mockRejectedValueOnce(error);

                const dummyChannelId = 'channel-x';
                const dummyMessage = 'dummy-msg';
                await expect(defaultDiscordManager.sendMessage(dummyChannelId, dummyMessage)).rejects.toThrowError(
                    FailedToSendDiscordMessageError,
                );

                expect(dummyClient.channels.fetch).toHaveBeenCalledWith(dummyChannelId);
                expect(mockedLogger.error).toHaveBeenCalledWith('Failed to send discord message', error);
            });
        });

        describe('given sendingMessage encounters an error', () => {
            it('should throw a FailedToSendDiscordMessageError', async () => {
                const error = new Error();
                const dummySend = jest.fn().mockRejectedValueOnce(error);
                dummyClient.channels.fetch.mockResolvedValueOnce({
                    send: dummySend,
                });

                const dummyChannelId = 'channel-x';
                const dummyMessage = 'dummy-msg';
                await expect(defaultDiscordManager.sendMessage(dummyChannelId, dummyMessage)).rejects.toThrowError(
                    FailedToSendDiscordMessageError,
                );

                expect(dummyClient.channels.fetch).toHaveBeenCalledWith(dummyChannelId);
                expect(dummySend).toHaveBeenCalledWith(dummyMessage);
            });
        });
    });
});
