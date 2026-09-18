import { ApiUtils } from '../utils/api-utils';

export class AccountPage {
    private apiUtils: ApiUtils;

    constructor(apiUtils: ApiUtils) {
        this.apiUtils = apiUtils;
    }

    async setupUser(payload: any) {
        const userRes = await this.createUser(payload);
        if (userRes.status() !== 201) {
            const errorBody = await userRes.json().catch(() => ({}));
            throw new Error(`User creation failed with status ${userRes.status()}: ${errorBody.message || 'Unknown error'}`);
        }
        const userBody: any = await userRes.json();
        
        const tokenRes = await this.generateToken(payload);
        const tokenBody: any = await tokenRes.json();
        
        return { userId: userBody.userID, token: tokenBody.token };
    }

    async createUser(payload: any) {
        return await this.apiUtils.post('/Account/v1/User', payload);
    }

    async generateToken(payload: any) {
        return await this.apiUtils.post('/Account/v1/GenerateToken', payload);
    }

    async checkAuthorization(payload: any) {
        return await this.apiUtils.post('/Account/v1/Authorized', payload);
    }

    async getUser(userId: string, token: string) {
        return await this.apiUtils.get(`/Account/v1/User/${userId}`, undefined, token);
    }

    async deleteUserByToken(userId: string, token: string) {
        return await this.apiUtils.delete(`/Account/v1/User/${userId}`, undefined, undefined, token);
    }

    async deleteUserByCredentials(userId: string, credentials: any) {
        const tokenRes = await this.generateToken(credentials);
        const { token } = await tokenRes.json();
        return await this.deleteUserByToken(userId, token);
    }
}
