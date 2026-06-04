import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import RegisterPage from '../pom/pages/RegisterPage';
import DashboardPage from '../pom/pages/DashboardPage';
import { RegisterMessages } from '../test-data/messages/register-messages';
import { generateUniqueEmail } from '../utils/data-generation/email';

test.describe('Register Page Tests', () => {
    let registerPage: RegisterPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        registerPage = new RegisterPage(page);
        dashboardPage = new DashboardPage(page);
        await registerPage.navigateTo();
    });

    test('Successful register', async () => {
        const randomUserName = faker.internet.username();
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(randomUserName, generateUniqueEmail(), randomPassword, randomPassword);
        await expect(dashboardPage.successRegistrationMessage).toBeVisible();
        await expect(dashboardPage.navBarUserName).toHaveText(randomUserName);
    });

    test('Username is empty', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register('', generateUniqueEmail(), randomPassword, randomPassword);
        await registerPage.validateEmptyErrorMessage(registerPage.userNameField);
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

    test('Email is empty', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), '', randomPassword, randomPassword);
        await registerPage.validateEmptyErrorMessage(registerPage.emailField);
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

    test('Email is incorrect', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), 'invalidEmail', randomPassword, randomPassword);
        await expect(registerPage.emailField).toHaveJSProperty('validity.typeMismatch', true);
        await expect(registerPage.emailField).toHaveJSProperty('validationMessage', RegisterMessages.EMAIL_INCORRECT_MESSAGE);
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

    test('Password is empty', async () => {
        await registerPage.register(faker.internet.username(), generateUniqueEmail(), '', '');
        await registerPage.validateEmptyErrorMessage(registerPage.passwordField);
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

    test('Confirm Password is empty', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), generateUniqueEmail(), randomPassword, '');
        await registerPage.validateEmptyErrorMessage(registerPage.confirmPasswordField);
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

    test('Confirm Password is different', async () => {
        const randomPassword = faker.internet.password({ length: 10 });

        await registerPage.register(faker.internet.username(), generateUniqueEmail(), randomPassword, randomPassword + 'diff');
        await expect(registerPage.passwordsDoNotMatchMessage).toBeVisible();
        await expect(registerPage.page.url()).toContain(registerPage.url);
    });

});