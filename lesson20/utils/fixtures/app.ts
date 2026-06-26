import { test as base, Page } from '@playwright/test';
import RegisterPage from '../../pom/pages/registerPage';
import DashboardPage from '../../pom/pages/DashboardPage';
import SignInPage from '../../pom/pages/SignInPage';
import CreateRepositoryPage from '../../pom/pages/CreateRepositoryPage';
import RepositoryPage from '../../pom/pages/RepositoryPage';
import RepositorySettingsPage from '../../pom/pages/RepositorySettingsPage';
import SettingsPage from '../../pom/pages/SettingsPage';

type App = {
    page: Page;
    registerPage: RegisterPage;
    dashboardPage: DashboardPage;
    signInPage: SignInPage;
    createRepositoryPage: CreateRepositoryPage;
    repositoryPage: RepositoryPage;
    repositorySettingsPage: RepositorySettingsPage;
    settingsPage: SettingsPage;
};

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        const app: App = {
            page,
            registerPage: new RegisterPage(page),
            dashboardPage: new DashboardPage(page),
            signInPage: new SignInPage(page),
            createRepositoryPage: new CreateRepositoryPage(page),
            repositoryPage: new RepositoryPage(page),
            repositorySettingsPage: new RepositorySettingsPage(page),
            settingsPage: new SettingsPage(page),
        };
        await use(app);
    },
});

export { expect } from '@playwright/test';