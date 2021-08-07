import { Express } from 'express';
import Logger from '../lib/Logger';

export default interface Loader {
    init(server: Express, logger: Logger): Promise<boolean> | boolean;
}
