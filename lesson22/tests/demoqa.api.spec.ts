import { test, expect, globalSession } from '../utils/fixtures';
import { generateUserData } from '../utils/generate-user';
import { ApiMessages } from '../test-data/api/api-messages';

test.describe('DemoQA API Tests', () => {

    test('Create User Account - Success', async ({ accountPage }) => {
        const credentials = generateUserData();
        const response = await accountPage.createUser(credentials);
        expect(response.status()).toBe(201);
        
        const body = await response.json();
        const createdUserId = body.userID;
        expect(createdUserId).toBeDefined();
        expect(body.username).toBe(credentials.userName);
    });

    test('Create User Account - Already Exists', async ({ accountPage, session }) => {
        const response = await accountPage.createUser({ 
            userName: session.userName, 
            password: session.password 
        });
        expect(response.status()).toBe(406);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.USER_EXISTS);
    });

    test('Create User Account - Weak Password', async ({ accountPage }) => {
        const response = await accountPage.createUser({ 
            userName: generateUserData().userName, 
            password: '123' 
        });
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.WEAK_PASSWORD);
    });

    test('Generate Auth Token - Success', async ({ accountPage, session }) => {
        const response = await accountPage.generateToken({ 
            userName: session.userName, 
            password: session.password 
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('Success');
        expect(body.result).toBe(ApiMessages.AUTH_SUCCESS);
        expect(body.token).toBeDefined();

        // Update the global token so it will be valid for subsequent tests
        if (globalSession) {
            globalSession.token = body.token;
        }
    });

    test('Generate Auth Token - Invalid Credentials', async ({ accountPage, session }) => {
        const response = await accountPage.generateToken({ 
            userName: session.userName, 
            password: 'WrongPassword123!' 
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('Failed');
        expect(body.result).toBe(ApiMessages.AUTH_FAILED);
        expect(body.token).toBeNull();
    });

    test('Check User Authorization - Authorized', async ({ accountPage, session }) => {
        const response = await accountPage.checkAuthorization({ 
            userName: session.userName, 
            password: session.password 
        });
        expect(response.status()).toBe(200);
        const isAuthorized = await response.json();
        expect(isAuthorized).toBe(true);
    });

    test('Get User Information - Success', async ({ accountPage, session }) => {
        const response = await accountPage.getUser(session.userId, session.token);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.userId).toBe(session.userId);
        expect(body.username).toBe(session.userName);
        expect(Array.isArray(body.books)).toBe(true);
    });

    test('Get User Information - Unauthorized', async ({ accountPage, session }) => {
        const response = await accountPage.getUser(session.userId, '');
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.USER_NOT_AUTHORIZED);
    });

    test('Get All Books - Success', async ({ bookstorePage }) => {
        const response = await bookstorePage.getAllBooks();
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.books.length).toBeGreaterThan(0);
        expect(body.books[0].isbn).toBeDefined();
        expect(body.books[0].title).toBeDefined();
    });

    test('Get Specific Book - Success', async ({ bookstorePage, session }) => {
        const response = await bookstorePage.getBook(session.isbn);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.isbn).toBe(session.isbn);
        expect(body.title).toBeDefined();
    });

    test('Get Specific Book - Not Found', async ({ bookstorePage }) => {
        const response = await bookstorePage.getBook('9999999999');
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.ISBN_NOT_AVAILABLE);
    });

    test('Add Book to Collection - Success', async ({ bookstorePage, session }) => {
        const payload = {
            userId: session.userId,
            collectionOfIsbns: [{ isbn: session.isbn }]
        };
        const response = await bookstorePage.addBooksToCollection(payload, session.token);
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.books[0].isbn).toBe(session.isbn);
    });

    test('Add Book to Collection - Duplicate Entry', async ({ bookstorePage, session }) => {
        const payload = {
            userId: session.userId,
            collectionOfIsbns: [{ isbn: session.isbn }]
        };
        
        await bookstorePage.addBooksToCollection(payload, session.token);

        const response = await bookstorePage.addBooksToCollection(payload, session.token);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.ISBN_ALREADY_PRESENT);
    });

    test('Update Book in Collection - Success', async ({ bookstorePage, session }) => {
        await bookstorePage.addBooksToCollection({
            userId: session.userId,
            collectionOfIsbns: [{ isbn: session.isbn }]
        }, session.token);

        const payload = {
            userId: session.userId,
            isbn: session.secondaryIsbn
        };
        const response = await bookstorePage.replaceBook(session.isbn, payload, session.token);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.userId).toBe(session.userId);
        expect(body.books.some((b: { isbn: string }) => b.isbn === session.secondaryIsbn)).toBe(true);
    });

    test('Update Book in Collection - Invalid ISBN', async ({ bookstorePage, session }) => {
        const payload = {
            userId: session.userId,
            isbn: 'invalid-isbn'
        };
        const response = await bookstorePage.replaceBook(session.isbn, payload, session.token);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.ISBN_NOT_AVAILABLE);
    });

    test('Delete Book from Collection - Success', async ({ accountPage, bookstorePage, session }) => {
        await bookstorePage.addBooksToCollection({
            userId: session.userId,
            collectionOfIsbns: [{ isbn: session.isbn }]
        }, session.token);

        const payload = {
            isbn: session.isbn,
            userId: session.userId
        };
        const response = await bookstorePage.deleteBook(payload, session.token);
        expect(response.status()).toBe(204);

        const userRes = await accountPage.getUser(session.userId, session.token);
        const userBody = await userRes.json();
        expect(userBody.books.some((b: { isbn: string }) => b.isbn === session.isbn)).toBe(false);
    });

    test('Delete Book from Collection - Not Found', async ({ bookstorePage, session }) => {
        const payload = {
            isbn: 'invalid-isbn',
            userId: session.userId
        };
        const response = await bookstorePage.deleteBook(payload, session.token);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe(ApiMessages.ISBN_NOT_IN_USER_COLLECTION);
    });

    test('Clear Book Collection - Success', async ({ accountPage, bookstorePage, session }) => {
        const response = await bookstorePage.deleteAllBooks(session.userId, session.token);
        expect(response.status()).toBe(204);

        const userRes = await accountPage.getUser(session.userId, session.token);
        const userBody = await userRes.json();
        expect(userBody.books.length).toBe(0);
        expect(userBody.userId).toBe(session.userId);
    });

    test('Delete User Account - Success', async ({ accountPage, session }) => {
        const response = await accountPage.deleteUserByToken(session.userId, session.token);
        expect(response.status()).toBe(204);

        const checkUser = await accountPage.getUser(session.userId, session.token);
        expect(checkUser.status()).toBe(401);
        const checkBody = await checkUser.json();
        expect(checkBody.message).toBe(ApiMessages.USER_NOT_FOUND);
    });
});
