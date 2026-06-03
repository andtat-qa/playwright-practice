import { Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class RegisterPage extends BasePage {
    public url: string = '/user/sign_up';

    public userNameField: Locator = this.page.locator('#user_name');
    public emailField: Locator = this.page.locator('#email');
    public passwordField: Locator = this.page.locator('#password');
    public confirmPasswordField: Locator = this.page.locator('#retype');
    public registerAccountButton: Locator = this.page.locator('.ui.primary.button');
    public passwordsDoNotMatchMessage: Locator = this.page.locator('div.negative.message>p', { hasText: 'The passwords do not match.' });

    async enterUserName(userName: string) {
        await this.userNameField.fill(userName);
    }

    async enterEmail(email: string) {
        await this.emailField.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async enterConfirmPassword(confirmPassword: string) {
        await this.confirmPasswordField.fill(confirmPassword);
    }

    async clickRegisterAccount() {
        await this.registerAccountButton.click();
    }

    async register(userName: string, email: string, password: string, confirmPassword: string) {
        await this.enterUserName(userName);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.enterConfirmPassword(confirmPassword);
        await this.clickRegisterAccount();
    }
}