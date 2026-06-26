const { Before, After, setDefaultTimeout, Given } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(60 * 1000);

let browser;
let context;
let page;

Before(async function () {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    this.page = page;
});

After(async function () {
    await browser.close();
});

Given('I am logged in as {string}', async function (username) {
    await this.page.goto('https://www.saucedemo.com/');
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill('secret_sauce');
    await this.page.locator('[data-test="login-button"]').click();
});

exports.getPage = () => page;
