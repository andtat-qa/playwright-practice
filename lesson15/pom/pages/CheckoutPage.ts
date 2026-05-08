import { Locator } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class CheckoutPage extends BasePage {
    public readonly title: Locator = this.page.locator('[data-test="title"]', { hasText: 'Checkout: Your Information' });

    async navigate() {
        await this.page.goto(Urls.CHECKOUT_PAGE);
    }
}