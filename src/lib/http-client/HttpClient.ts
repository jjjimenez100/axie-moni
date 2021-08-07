export interface HttpClient {
    get(url: string, queryParameters?: object): Promise<object>;
}
