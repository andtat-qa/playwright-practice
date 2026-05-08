import { Locator } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class CartPage extends BasePage {
    public readonly title: Locator = this.page.locator('[data-test="title"]', { hasText: 'Your Cart' });
    public readonly cartItems: Locator = this.page.locator('[data-test="cart-item"]');
    public readonly cartItemQuantity: Locator = this.page.locator('.cart_quantity');
    public readonly continueShoppingButton: Locator = this.page.locator('[data-test="continue-shopping"]'); 
    public readonly removeButton: Locator = this.page.getByRole('button', { name: 'Remove' });
    public readonly checkoutButton: Locator = this.page.locator('[data-test="checkout"]');

    async navigate() {
        await this.page.goto(Urls.CART_PAGE);
    }

    async clickRemoveButton() {
        await this.removeButton.click();
    }

    async clickCheckoutButton() {
        await this.checkoutButton.click();
    }

    async clickContinueShoppingButton() {
        await this.continueShoppingButton.click();
    }
}
