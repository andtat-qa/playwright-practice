import { Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class SignInPage extends BasePage {
    public url: string = '/user/login';

    public emailField: Locator = this.page.locator('#user_name');
    public passwordField: Locator = this.page.locator('#password');
    public signInButton: Locator = this.page.locator('.ui.primary.button');
    public errorMessage: Locator = this.page.locator('.ui.negative.message:visible');

    async enterEmail(email: string) {
        await this.emailField.fill(email);
    }       

    async enterPassword(password: string) {
        await this.passwordField.fill(password);
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }

    async signIn(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSignInButton();
    }   

}
