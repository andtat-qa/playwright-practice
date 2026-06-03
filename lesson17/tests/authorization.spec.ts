import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../pom/pages/RegisterPage';
import SignInPage from '../pom/pages/SignInPage';
import DashboardPage from '../pom/pages/DashboardPage';
import { generateUniqueEmail } from '../utils/data-generation/email';

test.describe('Authorization Tests', () => {
    let registerPage: RegisterPage;
    let signInPage: SignInPage;
    let dashboardPage: DashboardPage;

    const testUserName = faker.internet.username();
    const testUserEmail = generateUniqueEmail();
    const testUserPassword = faker.internet.password({ length: 10 });

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        registerPage = new RegisterPage(page);
        await registerPage.navigateTo();
        await registerPage.register(testUserName, testUserEmail, testUserPassword, testUserPassword);
        await page.close();
        await context.close();
    });

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        dashboardPage = new DashboardPage(page);
        await signInPage.navigateTo();
    });

    test('Successful login with valid credentials', async () => {
        await signInPage.signIn(testUserEmail, testUserPassword);
        await expect(dashboardPage.navBarUserName).toHaveText(testUserName);
    });

    test('Login failed with invalid password', async () => {
        await signInPage.signIn(testUserEmail, faker.internet.password({ length: 10 }));
        await signInPage.validateIncorrectErrorMessage(signInPage.errorMessage);
        await expect(signInPage.page.url()).toContain(signInPage.url);
    });

    test('Login failed with non-existent user', async () => {
        await signInPage.signIn('nonexistent@example.com', faker.internet.password({ length: 10 }));
        await signInPage.validateIncorrectErrorMessage(signInPage.errorMessage);
        await expect(signInPage.page.url()).toContain(signInPage.url);
    });

    test('Login failed with empty fields', async () => {
        await signInPage.signIn('', '');
        await signInPage.validateEmptyErrorMessage(signInPage.emailField);
    });

    test('Successful logout', async () => {
        await signInPage.signIn(testUserEmail, testUserPassword);
        await dashboardPage.logout();
        await expect(dashboardPage.signInLink).toBeVisible();
    });
});
