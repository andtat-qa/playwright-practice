import { APIRequestContext } from '@playwright/test';

export class ApiUtils {
    constructor(private readonly request: APIRequestContext) { }

    async post(url: string, data?: any, token?: string) {
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        return await this.request.post(url, {
            data,
            headers
        });
    }

    async get(url: string, params?: any, token?: string) {
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        return await this.request.get(url, {
            params,
            headers
        });
    }

    async put(url: string, data?: any, token?: string) {
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        return await this.request.put(url, {
            data,
            headers
        });
    }

    async delete(url: string, data?: any, params?: any, token?: string) {
        const options: any = {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        if (data !== undefined && data !== null) options.data = data;
        if (params !== undefined && params !== null) options.params = params;

        return await this.request.delete(url, options);
    }
}
