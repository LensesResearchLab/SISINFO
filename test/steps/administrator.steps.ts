import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../support/custom-world";

Then('I should be redirected to the incidents page', async function (this: CustomWorld) {
    await this.page.waitForURL(/.*\/incidencia/, { timeout: 10000 });
    expect(this.page.url()).toMatch(/.*\/incidencia/);
});

Then('the incidents page should be visible', async function (this: CustomWorld) {
    await expect(this.page.locator('h2:has-text("Listado de incidencias")')).toBeVisible();
});