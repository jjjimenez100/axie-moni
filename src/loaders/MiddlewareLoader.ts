import { Express, Request, Response } from 'express';
import BodyParser from 'body-parser';
import RateLimiter from 'express-rate-limit';
import Helmet from 'helmet';
import CORS from 'cors';

import Loader from './Loader';
import Logger from '../lib/Logger';

export default class MiddlewareLoader implements Loader {
    initRateLimiter(server: Express, logger: Logger): void {
        // Consider doing this on per domain route basis
        const windowMs = 15 * 60 * 1000;
        const max = 100;
        const rateLimiter = RateLimiter({
            windowMs,
            max,
            handler(request: Request, response: Response) {
                const { ip } = request;
                const errorMessage = `${ip} exceeded ${max} requests within ${windowMs}`;
                logger.info(`Rate limit exceeded for ${ip} with ${max} requests within ${windowMs}`);
                response.status(429).send(errorMessage);
            },
        });
        server.use(rateLimiter);
    }

    initCors(server: Express): void {
        server.use(CORS());
        server.options('*', CORS());
    }

    init(server: Express, logger: Logger): boolean {
        try {
            this.initRateLimiter(server, logger);
            this.initCors(server);
            server.use(BodyParser.json());
            server.use(Helmet());

            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }
}
