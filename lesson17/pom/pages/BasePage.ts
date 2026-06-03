import { expect, Locator, Page } from "@playwright/test";

export default class BasePage {
    page: Page;
    url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = '';
    }

    async navigateTo() {
        await this.page.goto(this.url);
    }

    async validateEmptyErrorMessage(locator: Locator) {
        await expect(locator).toHaveJSProperty('validity.valueMissing', true)
        const message = await locator.evaluate(el => (el as HTMLInputElement).validationMessage);
        expect(message).toMatch(/Please fill (in|out) this field\./);
    }

    async validateIncorrectErrorMessage(locator: Locator) {
        const message = await locator.textContent();
        expect(message).toMatch('Username or password is incorrect');
    }
}