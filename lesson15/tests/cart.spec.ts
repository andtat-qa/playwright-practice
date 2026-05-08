import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { getRandomElementIndexFromList } from "../utils/getElements";
import LoginPage from "../pom/pages/LoginPage";
import ProductsPage from "../pom/pages/ProductsPage";
import Header from "../pom/modules/header";
import { Urls } from "../test-data/urls";
import CartPage from "../pom/pages/CartPage";
import CheckoutPage from "../pom/pages/CheckoutPage";

let loginPage: LoginPage;
let productsPage: ProductsPage;
let header: Header;
let cartPage: CartPage;
let checkoutPage: CheckoutPage;

test.describe('Cart Page tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        header = new Header(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
    })

    test('Check empty cart page', async ({ page }) => {
        await header.clickEmptyCartIcon();
        await expect(page).toHaveURL(Urls.CART_PAGE);
        await expect(cartPage.title).toHaveText('Your Cart');
        await expect(cartPage.cartItems).toHaveCount(0);
        await expect(header.cartIcon).not.toBeVisible();
    })

    test('Check cart page with items', async ({ page }) => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await header.clickCartIcon();
        await expect(page).toHaveURL(Urls.CART_PAGE);
        await expect(cartPage.cartItemQuantity).toHaveCount(1);
        await expect(header.cartIcon).toHaveText('1');
    })

    test('Removing items from cart', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await header.clickCartIcon();
        await cartPage.clickRemoveButton();
        await expect(cartPage.cartItems).not.toBeVisible();
        await expect(header.cartIcon).not.toBeVisible();
    })

    test('Proceed to Checkout page', async ({ page }) => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await header.clickCartIcon();
        await cartPage.clickCheckoutButton();
        await expect(page).toHaveURL(Urls.CHECKOUT_PAGE);
        await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    })

    test('Check Continue Shopping button', async ({ page }) => {
        await header.clickEmptyCartIcon();
        await expect(page).toHaveURL(Urls.CART_PAGE);
        await expect(cartPage.title).toHaveText('Your Cart');
        await cartPage.clickContinueShoppingButton();
        await expect(page).toHaveURL(Urls.PRODUCTS_PAGE);
        await expect(productsPage.title).toHaveText('Products');
    })

})