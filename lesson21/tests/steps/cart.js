const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('I open the shopping cart', async function () {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
});

Then('I should be on the cart page', async function () {
    await expect(this.page).toHaveURL(/.*cart.html/);
});

Then('the cart should be empty', async function () {
    await expect(this.page.locator('[data-test="cart-item"]')).toHaveCount(0);
});

Then('the cart should contain 1 item', async function () {
    await expect(this.page.locator('[data-test="item-quantity"]')).toHaveCount(1);
});

When('I remove the item from the cart', async function () {
    await this.page.getByRole('button', { name: 'Remove' }).click();
});

Then('the cart item should not be visible', async function () {
    await expect(this.page.locator('[data-test="cart-item"]')).not.toBeVisible();
});

When('I click the checkout button', async function () {
    await this.page.locator('[data-test="checkout"]').click();
});

Then('I should be on the checkout information page', async function () {
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
});

When('I click the continue shopping button', async function () {
    await this.page.locator('[data-test="continue-shopping"]').click();
});
