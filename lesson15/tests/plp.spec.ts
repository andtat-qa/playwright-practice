import test, { expect } from "@playwright/test";
import { standardUser } from "../test-data/users";
import { getRandomElementIndexFromList, parsePrices, sortNumbersAscending } from "../utils/getElements";
import LoginPage from "../pom/pages/LoginPage";
import ProductsPage from "../pom/pages/ProductsPage";
import ProductDetailsPage from "../pom/pages/ProductDetailsPage";
import Header from "../pom/modules/header";

let loginPage: LoginPage;
let productsPage: ProductsPage;
let productDetailsPage: ProductDetailsPage;
let header: Header;

test.describe('Product List Page tests', () => {

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        productDetailsPage = new ProductDetailsPage(page);
        header = new Header(page);
        await loginPage.navigate();
        await loginPage.loginWithCredentials(standardUser.username, standardUser.password);
    })

    test('Opening PDP page by clicking product name', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        const productName = await productsPage.getProductNameByIndex(randomProductIndex);
        await productsPage.clickProductNameByIndex(randomProductIndex);
        await expect(productDetailsPage.productName).toHaveText(productName!);
    })

    test('Adding product to cart', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        //Adding product to cart
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Remove');
        await expect(header.cartIcon).toHaveText('1');
    })

    test('Removing product from cart', async () => {
        const randomProductIndex = await getRandomElementIndexFromList(productsPage.productNames);
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Remove');
        await productsPage.addProductToCartByIndex(randomProductIndex);
        await expect(productsPage.addToCartButton.nth(randomProductIndex)).toHaveText('Add to cart');
        await expect(header.cartIcon).not.toBeVisible();
    })

    test.describe('Sorting', () => {

        test('Default sort option is "Name (A to Z)"', async () => {
            await expect(productsPage.sortDropdown).toHaveValue('az');
        })

        test('Sort by price - low to high', async () => {
            await productsPage.sortBy('lohi');
            const pricesRaw = await productsPage.getAllPrices();
            const prices = parsePrices(pricesRaw);
            const sortedPrices = sortNumbersAscending(prices);
            expect(prices).toEqual(sortedPrices);
        })
    })
})