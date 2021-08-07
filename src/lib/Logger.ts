interface Logger {
    info(message: string, ...params: string[]): void;
    debug(message: string, ...params: string[]): void;
    error(message: string, ...params: string[]): void;
}

export default Logger;
