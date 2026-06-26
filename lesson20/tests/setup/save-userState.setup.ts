import { faker } from "@faker-js/faker";
import { generateUniqueEmail } from "../../utils/data-generation/email";
import { test, expect } from '../../utils/fixtures/app';
import saveUserData from "../../utils/data-generation/saveUserData";

test('Register testUser1 and save storage state', async ({ app }) => {
    const testUserName = faker.internet.username();
    const testUserEmail = generateUniqueEmail();
    const testUserPassword = faker.internet.password({ length: 10 });

    await app.registerPage.navigateTo();
    await app.registerPage.register(
        testUserName,
        testUserEmail,
        testUserPassword,
        testUserPassword
    );
    await expect(app.dashboardPage.navBarUserName).toHaveText(testUserName);
    await app.page.context().storageState({ path: '.states/testUser1.json' });

    saveUserData({
        userName: testUserName,
        userEmail: testUserEmail,
        userPassword: testUserPassword
    }, './test-data/users/testUser1.json');
});