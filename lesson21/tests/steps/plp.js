const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

let lastSelectedProductName;
let lastSelectedProductIndex;

When('I click on a random product name', async function () {
    const numberOfProducts = await this.page.locator('[data-test="inventory-item-name"]').count();
    lastSelectedProductIndex = Math.floor(Math.random() * numberOfProducts);
    lastSelectedProductName = (await this.page.locator('[data-test="inventory-item-name"]').nth(lastSelectedProductIndex).textContent())?.trim();
    await this.page.locator('[data-test="inventory-item-name"]').nth(lastSelectedProductIndex).click();
});

Then('I should be on the product detail page for that product', async function () {
    await expect(this.page.locator('[data-test="inventory-item-name"]')).toHaveText(lastSelectedProductName);
});

When('I add a random product to the cart', async function () {
    const numberOfProducts = await this.page.locator('[data-test="inventory-item-name"]').count();
    lastSelectedProductIndex = Math.floor(Math.random() * numberOfProducts);
    await this.page.locator('.btn_inventory').nth(lastSelectedProductIndex).click();
});

Then('the product button should change to {string}', async function (expectedText) {
    await expect(this.page.locator('.btn_inventory').nth(lastSelectedProductIndex)).toHaveText(expectedText);
});

Then('the shopping cart badge should show {string}', async function (count) {
    await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveText(count);
});

When('I click {string} on that product', async function (buttonText) {
    await this.page.locator('.btn_inventory').nth(lastSelectedProductIndex).click();
});

Then('the shopping cart badge should not be visible', async function () {
    await expect(this.page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

Then('the default sort option should be {string}', async function (expectedText) {
    // Note: The value is 'az' for 'Name (A to Z)'
    await expect(this.page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
});

When('I sort products by {string}', async function (sortOption) {
    let val = 'az';
    if (sortOption === 'Price (low to high)') val = 'lohi';
    await this.page.locator('[data-test="product-sort-container"]').selectOption(val);
});

Then('the products should be sorted by price ascending', async function () {
    const priceElements = this.page.locator('[data-test="inventory-item-price"]');
    const pricesRaw = await priceElements.allTextContents();
    const prices = pricesRaw.map(p => parseFloat(p.replace('$', '')));

    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
});
