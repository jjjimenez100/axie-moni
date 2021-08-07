import Loader from './Loader';
import Logger from '../lib/Logger';
import { Express, Router } from 'express';

export default class RouteLoader implements Loader {
    constructor() {
        // Call Router.use(EntityRoute) here
    }

    init(server: Express, logger: Logger): boolean {
        try {
            logger.info('Loading routes...');
            server.use('/', Router);
            logger.info(' \u2714 mounted');

            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }
}
