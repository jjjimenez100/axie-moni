import express from 'express';
import AppLoader from './loaders/App';
import { LoggerImpl } from './lib/LoggerImpl';
import MiddlewareLoader from './loaders/MiddlewareLoader';
import RouteLoader from './loaders/RouteLoader';

export const init = async () => {
    const app = express();
    // Change to config itf
    const PORT = 8009;

    const appLoader: AppLoader = new AppLoader();
    const logger = new LoggerImpl();
    await appLoader.initLoaders(app, logger, [new MiddlewareLoader(), new RouteLoader()]);

    app.listen(PORT, () => {
        logger.info('Listening at port ' + PORT);
    });
};
