import BasePage from "./BasePage";

export default class DashboardPage extends BasePage {
    public url: string = '/';

    public successRegistrationMessage = this.page.locator('.flash-success>p', { hasText: 'Account was successfully created. Welcome!' });
    public navBarUserName = this.page.locator('.gt-ellipsis').first();
    public navBarUserMenu = this.page.locator('.ui.dropdown.item:has(img.ui.avatar)');
    public newRepositoryButton = this.page.locator('a[data-tooltip-content="New Repository"]');
    public logoutButton = this.page.locator('a', { hasText: 'Sign out' });
    public signInLink = this.page.locator('a', { hasText: 'Sign in' });

    async clickNewRepositoryButton() {
        await this.newRepositoryButton.click();
    }

    async logout() {
        await this.navBarUserMenu.click();
        await this.logoutButton.click();
    }
}