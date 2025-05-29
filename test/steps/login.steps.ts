import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { AuthPage } from "../pages/auth.page";

let authPage: AuthPage;

Given('the user navigates to the login page', async function (this: CustomWorld) {
    authPage = new AuthPage(this.page);
    await authPage.gotoLogin();
});

When('the user enters {string} into the {string} field', async function (this: CustomWorld, value: string, field: string) {
    authPage = new AuthPage(this.page);
    if (field === 'email') await authPage.fillEmail(value);
    else if (field === 'password') await authPage.fillPassword(value);
    else throw new Error(`Unknown field: ${field}`);
});

When('the user clicks the {string} button', async function (this: CustomWorld, buttonText: string) {
    authPage = new AuthPage(this.page);
    if (buttonText === "Iniciar Sesión") await authPage.submit();
    else await this.page.getByRole('button', { name: buttonText }).click();
});

Then('the user should be redirected to the main page', async function (this: CustomWorld) {
    await this.page.waitForURL('**/inicio');
    expect(this.page.url()).toContain('/inicio');
});
