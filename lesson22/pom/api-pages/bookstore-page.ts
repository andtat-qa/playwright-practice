import { ApiUtils } from '../../utils/api-utils';

export class BookStorePage {
    private apiUtils: ApiUtils;

    constructor(apiUtils: ApiUtils) {
        this.apiUtils = apiUtils;
    }

    async getAllBooks() {
        return await this.apiUtils.get('/BookStore/v1/Books');
    }

    async getBook(isbn: string) {
        return await this.apiUtils.get('/BookStore/v1/Book', { ISBN: isbn });
    }

    async addBooksToCollection(payload: any, token: string) {
        return await this.apiUtils.post('/BookStore/v1/Books', payload, token);
    }

    async replaceBook(isbn: string, payload: any, token: string) {
        return await this.apiUtils.put(`/BookStore/v1/Books/${isbn}`, payload, token);
    }

    async deleteBook(payload: any, token: string) {
        return await this.apiUtils.delete('/BookStore/v1/Book', payload, undefined, token);
    }

    async deleteAllBooks(userId: string, token: string) {
        return await this.apiUtils.delete('/BookStore/v1/Books', undefined, { UserId: userId }, token);
    }
}
