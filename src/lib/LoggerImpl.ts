import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import path from 'path'
import Logger from './Logger';

const LOGGING_LEVEL: string = 'info';

export class LoggerImpl implements Logger {
    #loggerInstance: WinstonLogger;

    constructor() {
        this.#loggerInstance = createLogger({
                level: LOGGING_LEVEL,
                format: format.combine(
                    format.errors({ stack: true }),
                    format.label({
                        label: path.basename(process.mainModule!.filename),
                    }),
                    format.timestamp({
                        format: 'YYYY-MM-DD hh:mm:ss',
                    }),
                ),
                transports: [
                    new transports.Console({
                        format: format.combine(
                            format.colorize(),
                            format.printf(
                                (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`,
                            ),
                        ),
                    }),
                ],
            }
        );
    }

    debug(message: string, ...params: string[]): void {
        this.#loggerInstance.debug(message, params);
    }

    error(message: string, ...params: string[]): void {
        this.#loggerInstance.error(message, params);
    }

    info(message: string, ...params: string[]): void {
        this.#loggerInstance.info(message, params);
    }
}