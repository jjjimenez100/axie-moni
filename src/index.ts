import dotenv from 'dotenv';
dotenv.config();

import { Client, Intents } from 'discord.js';
import { CoingeckoService } from './services/crypto-currency/CoingeckoService';
import coinGecko from 'coingecko-api';
import { DefaultAxieInfinityService } from './services/axie-infinity/DefaultAxieInfinityService';
import { AxiosHttpClient } from './lib/http-client/AxiosHttpClient';
import axios from 'axios';
import { DefaultDiscordManager } from './services/discord/DefaultDiscordManager';
import { DiscordManager } from './services/discord/DiscordManager';
import { CommandList } from './services/discord/CommandList';
import { DiscordCommandList } from './services/discord/DiscordCommandList';
import Logger from './lib/Logger';
import { LoggerImpl } from './lib/LoggerImpl';
import { Command } from './services/discord/Command';
import { GetSlpPriceCommand } from './services/discord/commands/GetSlpPriceCommand';
import { GetSlpTotalForRoninAddressCommand } from './services/discord/commands/GetSlpTotalForRoninAddressCommand';
import { DefaultDiscordService } from './services/discord/DefaultDiscordService';
import { DiscordService } from './services/discord/DiscordService';
import { AxieInfinityService } from './services/axie-infinity/AxieInfinityService';
import { HttpClient } from './lib/http-client/HttpClient';
import { CryptoCurrencyService } from './services/crypto-currency/CryptoCurrencyService';
import { DISCORD_TOKEN } from './config/discord';
import { Scheduler } from './services/scheduler/Scheduler';
import { DefaultScheduler } from './services/scheduler/DefaultScheduler';
import { Currency } from './services/Currency';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
console.log('josh DISCORD_TOKEN', DISCORD_TOKEN);
(async () => {
    const coingeckoService: CryptoCurrencyService = new CoingeckoService(new coinGecko());
    const defaultHttpClient: HttpClient = new AxiosHttpClient(axios);
    const axieService: AxieInfinityService = new DefaultAxieInfinityService(defaultHttpClient, coingeckoService);

    const scheduler: Scheduler = new DefaultScheduler();
    scheduler.createJob('* * * * *', () => axieService.getSlpPriceInCurrencyOf(Currency.PHP));

    const commandList: CommandList = new DiscordCommandList();
    const getSlpPriceCommand: Command<string> = new GetSlpPriceCommand(coingeckoService);
    commandList.add(getSlpPriceCommand);
    const getSlpTotalForRoninAddressCommand: Command<string> = new GetSlpTotalForRoninAddressCommand(axieService);
    commandList.add(getSlpTotalForRoninAddressCommand);

    const logger: Logger = new LoggerImpl();
    const commandManager: DiscordManager = new DefaultDiscordManager(client, logger);

    const bootstrap: DiscordService = new DefaultDiscordService(
        commandList,
        commandManager,
        logger,
        '873849375758114837',
    );
    await bootstrap.start(DISCORD_TOKEN);
})();
