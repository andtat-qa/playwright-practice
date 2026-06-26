import { test, expect } from '../utils/fixtures/app';
import { faker } from '@faker-js/faker';
import testUser1Data from '../test-data/users/testUser1.json';

test.describe('Authorization Tests', () => {
    const testUserName = testUser1Data.userName;
    const testUserEmail = testUser1Data.userEmail;
    const testUserPassword = testUser1Data.userPassword;

    test.beforeEach(async ({ app }) => {
        await app.signInPage.navigateTo();
    });

    test('Successful login with valid credentials', async ({ app }) => {
        await app.signInPage.signIn(testUserEmail, testUserPassword);
        await expect(app.dashboardPage.navBarUserName).toHaveText(testUserName);
    });

    test('Login failed with invalid password', async ({ app }) => {
        await app.signInPage.signIn(testUserEmail, faker.internet.password({ length: 10 }));
        await app.signInPage.validateIncorrectErrorMessage(app.signInPage.errorMessage);
        await expect(app.signInPage.page.url()).toContain(app.signInPage.url);
    });

    test('Login failed with non-existent user', async ({ app }) => {
        await app.signInPage.signIn('nonexistent@example.com', faker.internet.password({ length: 10 }));
        await app.signInPage.validateIncorrectErrorMessage(app.signInPage.errorMessage);
        await expect(app.signInPage.page.url()).toContain(app.signInPage.url);
    });

    test('Login failed with empty fields', async ({ app }) => {
        await app.signInPage.signIn('', '');
        await app.signInPage.validateEmptyErrorMessage(app.signInPage.emailField);
    });

    test('Successful logout', async ({ app }) => {
        await app.signInPage.signIn(testUserEmail, testUserPassword);
        await app.dashboardPage.logout();
        await app.dashboardPage.showNavigationMenu();
        await expect(app.dashboardPage.signInLink).toBeVisible();
    });
});
