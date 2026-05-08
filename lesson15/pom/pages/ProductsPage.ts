import { Locator } from "@playwright/test";
import { Urls } from "../../test-data/urls";
import BasePage from "../BasePage";

export default class ProductsPage extends BasePage {
    public readonly title: Locator = this.page.locator('[data-test="title"]', { hasText: 'Products' });
    public readonly productNames: Locator = this.page.locator('[data-test="inventory-item-name"]');
    public readonly addToCartButton: Locator = this.page.locator('.btn_inventory');
    public readonly sortDropdown: Locator = this.page.locator('[data-test="product-sort-container"]');
    public readonly productPrices: Locator = this.page.locator('[data-test="inventory-item-price"]');

    async navigate() {
        await this.page.goto(Urls.PRODUCTS_PAGE);
    }

    async getProductNameByIndex(index: number) {
        return this.productNames.nth(index).textContent();
    }

    async clickProductNameByIndex(index: number) {
        return this.productNames.nth(index).click();
    }

    async addProductToCartByIndex(index: number) {
        return this.addToCartButton.nth(index).click();
    }

    async sortBy(optionValue: string) {
        await this.sortDropdown.selectOption(optionValue);
    }

    async getAllPrices() {
        return await this.productPrices.allTextContents();
    }
}