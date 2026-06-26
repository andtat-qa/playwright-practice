const { Given, When, Then, expect } = require('@cucumber/cucumber');
const { faker } = require('@faker-js/faker');

Given('I open the login page', async function () {
    await this.page.goto('https://www.saucedemo.com/');
});

When('I enter {string} and {string}', async function (username, password) {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
});

When('I enter username {string}', async function (username) {
    await this.page.locator('[data-test="username"]').fill(username);
});

When('I enter password {string}', async function (password) {
    await this.page.locator('[data-test="password"]').fill(password);
});

When('I enter invalid username and password', async function () {
    await this.page.locator('[data-test="username"]').fill(faker.internet.username());
    await this.page.locator('[data-test="password"]').fill(faker.internet.password());
});

When('I click the login button', async function () {
    await this.page.locator('[data-test="login-button"]').click();
});

Then('I should be redirected to the inventory page', async function () {
    const { expect } = require('@playwright/test');
    await expect(this.page).toHaveURL(/.*inventory.html/);
});

Then('I should see the {string} title', async function (title) {
    const { expect } = require('@playwright/test');
    await expect(this.page.locator('[data-test="title"]')).toHaveText(title);
});

Then('I should see the error message {string}', async function (errorMessage) {
    const { expect } = require('@playwright/test');
    await expect(this.page.locator('[data-test="error"]')).toHaveText(errorMessage);
});
