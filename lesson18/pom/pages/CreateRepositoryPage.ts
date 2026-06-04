import BasePage from "./BasePage";

export default class CreateRepositoryPage extends BasePage {
    public url: string = '/repo/create';
    public repositoryNameField = this.page.locator('#repo_name');
    private repositoryDescriptionField = this.page.locator('#description')
    private gitIgnoreDropdown = this.page.locator('[aria-controls="_aria_dropdown_menu_28"]');
    private licenseDropdown = this.page.locator('[aria-controls="_aria_dropdown_menu_299"]');
    private makePrivateCheckbox = this.page.locator('[id="_aria_label_input_0"]');
    private defaultBranchField = this.page.locator('#default_branch');
    private createRepositoryButton = this.page.locator('button.primary', { hasText: 'Create Repository' });

    async createRepository(repoName: string, options?: { description?: string; gitIgnore?: string; license?: string; isPrivate?: boolean; defaultBranch?: string }) {
        await this.repositoryNameField.fill(repoName);
        if (options?.description) {
            await this.repositoryDescriptionField.fill(options.description);
        }
        // if (options?.gitIgnore) {
        //     await this.gitIgnoreDropdown.click();
        //     const gitIgnoreOption = this.page.locator(`.dropdown-menu [role="option"]`, { hasText: options.gitIgnore });
        //     await gitIgnoreOption.click();
        // }
        // if (options?.license) {
        //     await this.licenseDropdown.click();
        //     const licenseOption = this.page.locator(`.dropdown-menu [role="option"]`, { hasText: options.license });
        //     await licenseOption.click();
        // }
        // if (options?.isPrivate) {
        //     await this.makePrivateCheckbox.check();
        // }
        // if (options?.defaultBranch) {
        //     await this.defaultBranchField.fill(options.defaultBranch);
        // }
        await this.createRepositoryButton.click();
    }
}