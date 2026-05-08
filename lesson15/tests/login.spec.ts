import test, { expect } from "@playwright/test";
import { problemUser, standardUser } from "../test-data/users";
import { LoginErrors } from "../test-data/errors";
import { faker } from "@faker-js/faker";
import LoginPage from "../pom/pages/LoginPage";
import ProductsPage from "../pom/pages/ProductsPage";
import { Urls } from "../test-data/urls";

let loginPage: LoginPage;
let productsPage: ProductsPage;

test.describe('Login tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.navigate();
    })

    test('Successful login', async ({ page }) => {
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.title).toBeVisible();
    })

    test('Login without username', async () => {
        await loginPage.enterPassword(standardUser.password);
        await loginPage.clickLoginButton();
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.EMPTY_USERNAME_MESSAGE);
    })

    test('Login without password', async () => {
        await loginPage.enterUsername(standardUser.username);
        await loginPage.clickLoginButton();
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.EMPTY_PASSWORD_MESSAGE);
    })

    test('Login without valid credentials', async () => {
        await loginPage.loginWithCredentials(faker.internet.username(), faker.internet.password());
        await loginPage.clickLoginButton();
        await expect(loginPage.errorMessage).toHaveText(LoginErrors.INVALID_DATA_MESSAGE);
    })

    test('Successful login as problem_user', async ({ page }) => {
        await loginPage.loginWithCredentials(problemUser.username, problemUser.password);
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.title).toBeVisible();
    })
})