import { Locator } from "playwright-core";
import BasePage from "../BasePage";

export default class Header extends BasePage {
    public readonly cartIcon = this.page.locator('[data-test="shopping-cart-badge"]');
    public readonly emptyCartIcon: Locator = this.page.locator('[data-test="shopping-cart-link"]');

    async clickCartIcon() {
        await this.cartIcon.click();
    }

    async clickEmptyCartIcon() {
        await this.emptyCartIcon.click();
    }
}