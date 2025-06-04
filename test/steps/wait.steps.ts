import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../support/custom-world";

When('I wait {string} seconds', async function (this: CustomWorld, seconds: string) {
    const delayMilliseconds = parseFloat(seconds) * 1000;
    if (isNaN(delayMilliseconds) || delayMilliseconds < 0) {
        throw new Error(`Invalid number of seconds provided: "${seconds}". Please provide a positive number.`);
    }
    await this.page.waitForTimeout(delayMilliseconds);
});