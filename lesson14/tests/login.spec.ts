import test, { expect } from "@playwright/test";
import { problemUser, standardUser } from "../test-data/users";
import { LoginErrors } from "../test-data/errors";
import { faker } from "@faker-js/faker";

test.describe('Login tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    })

    test('Successful login', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })

    test('Login without username', async ({ page }) => {
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText(LoginErrors.EMPTY_USERNAME_MESSAGE);

    })

    test('Login without password', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText(LoginErrors.EMPTY_PASSWORD_MESSAGE);
    })

    test('Login without valid credentials', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(faker.internet.username());
        await page.locator('[data-test="password"]').fill(faker.internet.password());
        await page.locator('[data-test="login-button"]').click();
        await expect(page.locator('[data-test="error"]')).toHaveText(LoginErrors.INVALID_DATA_MESSAGE);
    })

    test('Successful login as problem_user', async ({ page }) => {
        await page.locator('[data-test="username"]').fill(problemUser.username);
        await page.locator('[data-test="password"]').fill(problemUser.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })
})