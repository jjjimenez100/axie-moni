import axios, { AxiosResponse } from 'axios';
import { AxiosHttpClient } from '../../../src/lib/http-client/AxiosHttpClient';
import { HttpClientError } from '../../../src/lib/http-client/HttpClientError';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient tests', () => {
    let axiosHttpClient: AxiosHttpClient;
    beforeEach(() => {
        axiosHttpClient = new AxiosHttpClient(mockedAxios);
    });

    describe('get() - ', () => {
        describe('given http request succeeds', () => {
            it('should return the response', async () => {
                const mockedResponse: AxiosResponse = {
                    data: 'im a test',
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: {},
                };
                mockedAxios.get.mockResolvedValueOnce(mockedResponse);

                const dummyUrl = 'test';
                const dummyQueryParams = {};

                const response = await axiosHttpClient.get(dummyUrl, dummyQueryParams);
                expect(response).toBe(mockedResponse.data);
                expect(mockedAxios.get).toHaveBeenCalledTimes(1);
                expect(mockedAxios.get).toHaveBeenCalledWith(dummyUrl, {
                    params: dummyQueryParams,
                });
            });
        });

        describe('given http request fails', () => {
            it('should throw HttpClientError', async () => {
                mockedAxios.get.mockRejectedValueOnce(new Error());

                const dummyUrl = 'test';
                const dummyQueryParams = {};

                await expect(axiosHttpClient.get(dummyUrl, dummyQueryParams)).rejects.toThrow(HttpClientError);
            });
        });
    });
});
