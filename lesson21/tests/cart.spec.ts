import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { getRandomElementFromList } from "../utils/getElements";

test.describe('Cart Page tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="username"]').fill(standardUser.username);
        await page.locator('[data-test="password"]').fill(standardUser.password);
        await page.locator('[data-test="login-button"]').click();
    })

    test('Check empty cart page', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();

        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart');
        await expect(page.locator('[data-test="cart-item"]')).toHaveCount(0);
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    })

    test('Check cart page with items', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page).toHaveURL('/cart.html');
        await expect(page.locator('[data-test="item-quantity"]')).toHaveCount(1);
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
    })

    test('Removing items from cart', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.getByRole('button', { name: 'Remove' }).click();
        await expect(page.locator('[data-test="cart-item"]')).not.toBeVisible();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
    })

    test('Proceed to Checkout page', async ({ page }) => {
        const randomProductIndex = await getRandomElementFromList(page.locator('[data-test="inventory-item-name"]'));
        await page.locator('.btn_inventory').nth(randomProductIndex).click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL('/checkout-step-one.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
    })

    test('Check Continue Shopping button', async ({ page }) => {
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="continue-shopping"]').click();
        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })
})