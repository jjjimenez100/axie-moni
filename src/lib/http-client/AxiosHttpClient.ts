import { HttpClient } from './HttpClient';
import { AxiosStatic } from 'axios';
import axiosRetry from 'axios-retry';

import { HttpClientError } from './HttpClientError';

export class AxiosHttpClient implements HttpClient {
    private readonly axios: AxiosStatic;

    constructor(axios: AxiosStatic) {
        axiosRetry(axios, { retries: 3 });
        this.axios = axios;
    }

    async get(url: string, queryParameters?: object): Promise<object> {
        try {
            const { data } = await this.axios.get(url, {
                params: queryParameters,
            });

            return data;
        } catch (error) {
            throw new HttpClientError(url, queryParameters);
        }
    }
}
