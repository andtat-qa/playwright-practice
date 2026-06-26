import { expect, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class SettingsPage extends BasePage {
    public url: string = '/user/settings';

    public fullNameField: Locator = this.page.locator('#full_name');
    public websiteField: Locator = this.page.locator('#website');
    public locationField: Locator = this.page.locator('#location');
    public bioField: Locator = this.page.locator('#description');
    public updateProfileButton: Locator = this.page.locator('button:has-text("Update Profile")');
    public successMessage: Locator = this.page.locator('.ui.positive.message');
    public hideEmailCheckbox: Locator = this.page.locator('input[name="keep_email_private"]');

    async enterFullName(fullName: string) {
        await this.fullNameField.fill(fullName);
    }

    async enterWebsite(website: string) {
        await this.websiteField.fill(website);
    }

    async enterLocation(location: string) {
        await this.locationField.fill(location);
    }

    async enterBio(bio: string) {
        await this.bioField.fill(bio);
    }

    async clickUpdateProfile() {
        await this.updateProfileButton.click();
    }

    async toggleHideEmail(check: boolean) {
        if (check) {
            await this.hideEmailCheckbox.check();
        } else {
            await this.hideEmailCheckbox.uncheck();
        }
    }

    async updateProfile(fullName: string, website: string, location: string, bio: string) {
        await this.enterFullName(fullName);
        await this.enterWebsite(website);
        await this.enterLocation(location);
        await this.enterBio(bio);
        await this.clickUpdateProfile();
    }

    async validateSuccessMessage(expectedMessage: string) {
        await expect(this.successMessage).toBeVisible();
        await expect(this.successMessage).toContainText(expectedMessage);
    }
}
