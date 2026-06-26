import { test, expect } from '../utils/fixtures/app';
import { faker } from '@faker-js/faker';
import { SettingsMessages } from '../test-data/messages/settings-messages';

test.describe('User Settings Tests', () => {
    test.use({ storageState: '.states/testUser1.json' });

    test.beforeEach(async ({ app }) => {
        await app.signInPage.navigateTo();
        await app.settingsPage.navigateTo();
    });

    test('Update profile with full name', async ({ app }) => {
        await app.settingsPage.enterFullName(faker.person.fullName());
        await app.settingsPage.clickUpdateProfile();
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with website', async ({ app }) => {
        await app.settingsPage.enterWebsite(faker.internet.url());
        await app.settingsPage.clickUpdateProfile();
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with location', async ({ app }) => {
        await app.settingsPage.enterLocation(faker.location.city());
        await app.settingsPage.clickUpdateProfile();
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update profile with bio', async ({ app }) => {
        await app.settingsPage.enterBio(faker.lorem.sentence());
        await app.settingsPage.clickUpdateProfile();
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Update all profile fields', async ({ app }) => {
        await app.settingsPage.updateProfile(
            faker.person.fullName(),
            faker.internet.url(),
            faker.location.city(),
            faker.lorem.sentence()
        );
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
    });

    test('Toggle "Hide Email Address" privacy setting', async ({ app }) => {
        const isChecked = await app.settingsPage.hideEmailCheckbox.isChecked();
        await app.settingsPage.toggleHideEmail(!isChecked);
        await app.settingsPage.clickUpdateProfile();
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);
        await expect(app.settingsPage.hideEmailCheckbox).toBeChecked({ checked: !isChecked });
    });

    test('Check if profile data is saved after reload', async ({ app }) => {
        const newProfile = {
            fullName: faker.person.fullName(),
            website: faker.internet.url(),
            location: faker.location.city(),
            bio: faker.lorem.sentence()
        };

        await app.settingsPage.updateProfile(
            newProfile.fullName,
            newProfile.website,
            newProfile.location,
            newProfile.bio
        );
        await app.settingsPage.validateSuccessMessage(SettingsMessages.SUCCESSFUL_UPDATE);

        await app.settingsPage.page.reload();
        await expect(app.settingsPage.fullNameField).toHaveValue(newProfile.fullName);
        await expect(app.settingsPage.websiteField).toHaveValue(newProfile.website);
        await expect(app.settingsPage.locationField).toHaveValue(newProfile.location);
        await expect(app.settingsPage.bioField).toHaveValue(newProfile.bio);
    });
});
