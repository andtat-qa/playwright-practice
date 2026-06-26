import BasePage from "./BasePage";

export default class RepositoryPage extends BasePage {
    public repositoryOwnerName = this.page.locator('.repo-header .flex-item-title a').first();
    public repositoryName = this.page.locator('.repo-header .flex-item-title a').nth(1);
    private settingsButton = this.page.locator('[href*=settings]').nth(1);
    private moreItemsButton = this.page.locator('button[aria-label="More items"]');

    async getRepositoryFullName(): Promise<string> {
        const owner = await this.repositoryOwnerName.textContent();
        const repoName = await this.repositoryName.textContent();
        return `${owner}/${repoName}`;
    }

    async navigateToSettings() {
        if (await this.moreItemsButton.isVisible()) {
            await this.moreItemsButton.click();
        }
        await this.settingsButton.click();
    }
}