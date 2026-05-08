import { Locator } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class LoginPage extends BasePage {
    private readonly userNameField: Locator = this.page.locator('[data-test="username"]');
    private readonly passwordField: Locator = this.page.locator('[data-test="password"]');
    private readonly loginButton: Locator = this.page.locator('[data-test="login-button"]');
    public readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

    async navigate() {
        await this.page.goto(Urls.LOGIN_PAGE);
    }

    async enterUsername(username: string) {
        await this.userNameField.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async loginWithCredentials(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}