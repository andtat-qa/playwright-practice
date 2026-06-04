import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../pom/pages/RegisterPage';
import SignInPage from '../pom/pages/SignInPage';
import SettingsPage from '../pom/pages/SettingsPage';
import { SettingsMessages } from '../test-data/messages/settings-messages';
import { generateUniqueEmail } from '../utils/data-generation/email';

test.describe('User Settings Tests', () => {
    let registerPage: RegisterPage;
    let signInPage: SignInPage;
    let settingsPage: SettingsPage;

    const testUserName = faker.internet.username();
    const testUserEmail = generateUniqueEmail();
    const testUserPassword = faker.internet.password({ length: 10 });

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        registerPage = new RegisterPage(page);
        await registerPage.navigateTo();
        await registerPage.register(testUserName, testUserEmail, testUserPassword, testUserPassword);
        
        await page.close();
        await context.close();
    });

    test.beforeEach(async ({ page }) => {
        signInPage = new SignInPage(page);
        settingsPage = new SettingsPage(page);

        await signInPage.navigateTo();
        await signInPage.signIn(testUserEmail, testUserPassword);
        await settingsPage.navigateTo();
    });

    test('Update profile with full name', async () => {
        await settingsPage.enterFullName(faker.person.fullName());
        await settingsPage.clickUpdateProfile();
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with website', async () => {
        await settingsPage.enterWebsite(faker.internet.url());
        await settingsPage.clickUpdateProfile();
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with location', async () => {
        await settingsPage.enterLocation(faker.location.city());
        await settingsPage.clickUpdateProfile();
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with bio', async () => {
        await settingsPage.enterBio(faker.lorem.sentence());
        await settingsPage.clickUpdateProfile();
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update all profile fields', async () => {
        await settingsPage.updateProfile(
            faker.person.fullName(),
            faker.internet.url(),
            faker.location.city(),
            faker.lorem.sentence()
        );
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Toggle "Hide Email Address" privacy setting', async () => {
        const isChecked = await settingsPage.hideEmailCheckbox.isChecked();
        await settingsPage.toggleHideEmail(!isChecked);
        await settingsPage.clickUpdateProfile();
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
        await expect(settingsPage.hideEmailCheckbox).toBeChecked({ checked: !isChecked });
    });

    test('Check if profile data is saved after reload', async () => {
        const newProfile = {
            fullName: faker.person.fullName(),
            website: faker.internet.url(),
            location: faker.location.city(),
            bio: faker.lorem.sentence()
        };

        await settingsPage.updateProfile(
            newProfile.fullName,
            newProfile.website,
            newProfile.location,
            newProfile.bio
        );
        await settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
        
        await settingsPage.page.reload();
        await expect(settingsPage.fullNameField).toHaveValue(newProfile.fullName);
        await expect(settingsPage.websiteField).toHaveValue(newProfile.website);
        await expect(settingsPage.locationField).toHaveValue(newProfile.location);
        await expect(settingsPage.bioField).toHaveValue(newProfile.bio);
    });
});
