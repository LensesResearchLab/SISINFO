import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { AuthPage } from "../pages/auth.page";

let authPage: AuthPage;

Given('I am logged in as an {string}', async function (this: CustomWorld, role: string) {
    authPage = new AuthPage(this.page);
    switch(role) {
        case 'administrator':
            
            await authPage.login('admin@admin.com', 'admin');
            break;
        case 'coordinator':
            await authPage.login('coordinator@example.com', 'password');
            break;
        case 'professor':
            await authPage.login('professor@example.com', 'password');
            break;
        case 'student':
            await authPage.login('student@example.com', 'password');
            break;
        case 'master_student':
            await authPage.login('master@example.com', 'password');
            break;
        default:
            throw new Error(`Login for role '${role}' is not implemented.`);
    }
});


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
