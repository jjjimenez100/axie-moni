export class HttpClientError extends Error {
    private static readonly message = 'Encountered an error when trying to send the HTTP request';

    constructor(private readonly url: string, private readonly properties?: object) {
        super(HttpClientError.message);
        this.stack = new Error().stack;
    }
}
