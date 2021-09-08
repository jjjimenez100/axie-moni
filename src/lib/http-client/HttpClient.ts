export interface HttpClient {
    get(url: string, queryParameters?: object): Promise<object>;
    post(url: string, body?: object): Promise<object>;
}
