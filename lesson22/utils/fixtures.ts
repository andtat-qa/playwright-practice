import { test as base } from '@playwright/test';
import { ApiUtils } from './api-utils';
import { AccountPage } from '../pom/api-pages/account-page';
import { BookStorePage } from '../pom/api-pages/bookstore-page';
import { generateUserData } from './generate-user';

// Shared data between tests
export let globalSession:
    | {
          userName: string;
          password: string;
          userId: string;
          token: string;
      }
    | null = null;
let cachedBooks: { isbn: string; secondaryIsbn: string } | null = null;

export const test = base.extend<{
    accountPage: AccountPage;
    bookstorePage: BookStorePage;
    session: {
        userName: string;
        password: string;
        userId: string;
        token: string;
        isbn: string;
        secondaryIsbn: string;
    };
}>({
    accountPage: async ({ request }, use) => {
        const apiUtils = new ApiUtils(request);
        await use(new AccountPage(apiUtils));
    },
    bookstorePage: async ({ request }, use) => {
        const apiUtils = new ApiUtils(request);
        await use(new BookStorePage(apiUtils));
    },
    session: async ({ accountPage, bookstorePage }, use) => {
        // Fetch books only once
        if (!cachedBooks) {
            const booksRes = await bookstorePage.getAllBooks();
            const booksBody = await booksRes.json();
            cachedBooks = {
                isbn: booksBody.books[0].isbn,
                secondaryIsbn: booksBody.books[1].isbn
            };
        }

        // Create global shared user only once
        if (!globalSession) {
            const credentials = generateUserData();
            const { userId, token } = await accountPage.setupUser(credentials);
            globalSession = { ...credentials, userId, token };
        }
        
        await use({
            ...globalSession,
            isbn: cachedBooks.isbn,
            secondaryIsbn: cachedBooks.secondaryIsbn
        });
    },
});

export { expect } from '@playwright/test';
