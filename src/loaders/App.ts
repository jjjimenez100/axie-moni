import Loader from './Loader';
import Logger from '../lib/Logger';
import { Express } from 'express';

export default class App {
    async initLoaders(server: Express, logger: Logger, loaders: Loader[]): Promise<void> {
        logger.info('Initializing app loaders...');
        await Promise.all(loaders.map((loader: Loader) => loader.init(server, logger)));
        logger.info('Done initializing app loaders');
    }
}
