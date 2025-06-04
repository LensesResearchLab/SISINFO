import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";
import { SidebarPage } from "../pages/sidebar.page";

let sidebarPage: SidebarPage;

Given('the {string} menu is expanded', async function (this: CustomWorld, menuName: string) {
    sidebarPage = new SidebarPage(this.page);
    if (!(await sidebarPage.isMenuItemExpanded(menuName))) {
        await sidebarPage.clickMenuItem(menuName);
    }
    await expect(await sidebarPage.isMenuItemExpanded(menuName)).toBe(true);
});

When('I click on the {string} option', async function (this: CustomWorld, optionName: string) {
    sidebarPage = new SidebarPage(this.page);
    await sidebarPage.clickMenuItem(optionName);
});