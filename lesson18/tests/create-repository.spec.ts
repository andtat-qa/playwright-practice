import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import RegisterPage from '../pom/pages/registerPage';
import DashboardPage from '../pom/pages/DashboardPage';
import CreateRepositoryPage from '../pom/pages/CreateRepositoryPage';
import SignInPage from '../pom/pages/SignInPage';
import RepositoryPage from '../pom/pages/RepositoryPage';
import RepositorySettingsPage from '../pom/pages/RepositorySettingsPage';
import { generateUniqueEmail } from '../utils/data-generation/email';

test.describe('Create Repository Tests', () => {
    let registerPage: RegisterPage;
    let dashboardPage: DashboardPage;
    let createRepositoryPage: CreateRepositoryPage;
    let signInPage: SignInPage;
    let repositoryPage: RepositoryPage;
    let repositorySettingsPage: RepositorySettingsPage;

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
        dashboardPage = new DashboardPage(page);
        createRepositoryPage = new CreateRepositoryPage(page);
        signInPage = new SignInPage(page);
        repositoryPage = new RepositoryPage(page);
        repositorySettingsPage = new RepositorySettingsPage(page);

        await signInPage.navigateTo();
        await signInPage.signIn(testUserEmail, testUserPassword);
        await dashboardPage.navigateTo();
        await dashboardPage.clickNewRepositoryButton();
    });

    test('Successful repository creation with minimal required fields', async () => {
        const repoName = `AQA-repo-${faker.number.int()}`;
        const expectedFullRepoName = `${testUserName}/${repoName}`;

        await createRepositoryPage.createRepository(repoName);
        expect(expectedFullRepoName).toBe(await repositoryPage.getRepositoryFullName());
        expect(repositoryPage.page.url()).toContain(expectedFullRepoName);
    });

    test('Repository name is empty', async () => {
        await createRepositoryPage.createRepository('');
        await createRepositoryPage.validateEmptyErrorMessage(createRepositoryPage.repositoryNameField);
        expect(createRepositoryPage.page.url()).toContain(createRepositoryPage.url);
    });

    test('Repository with description provided', async () => {
        const repoName = `AQA-repo-${faker.number.int()}`;
        const repoDescription = faker.lorem.sentence();
        await createRepositoryPage.createRepository(repoName, { description: repoDescription });
        await expect(repositoryPage.repositoryName).toHaveText(repoName);
        await repositoryPage.navigateToSettings();
        await expect(repositorySettingsPage.descriptionField).toHaveValue(repoDescription);
    });
})