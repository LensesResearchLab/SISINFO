import { Page, Locator } from "playwright/test";
import path from "path";
import dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(__dirname, '../../config/.env'),
});

const BASE_URL = process.env.FRONT_URL;

if (!BASE_URL) {
  throw new Error('❌ FRONT_URL not found');
}

export class SidebarPage {
  private readonly sidebarContainer: Locator;
  private readonly uniandesLogo: Locator;
  private readonly sisinfoTitle: Locator;

  constructor(private readonly page: Page) {
    this.sidebarContainer = page.locator("div.fixed.inset-y-0.z-10.hidden.h-svh.w-\\[--sidebar-width\\].transition-\\[left,right,width\\]");
    this.uniandesLogo = page.locator("img[alt='Uniandes Logo']");
    this.sisinfoTitle = page.locator("span:has-text('SISINFO')");
  }

  getSidebarContainer(): Locator {
    return this.sidebarContainer;
  }

  getUniandesLogo(): Locator {
    return this.uniandesLogo;
  }

  getSisinfoTitle(): Locator {
    return this.sisinfoTitle;
  }

  async clickMenuItem(itemText: string): Promise<void> {
    console.log(itemText)
    await this.page.locator(`span:has-text("${itemText.trim()}")`).click();

  }

  async isMenuItemExpanded(itemText: string): Promise<boolean> {
    const collapsibleItem = this.page.locator(`li[data-slot='collapsible'] button[data-slot='collapsible-trigger'] span:has-text('${itemText}')`).locator('..').locator('..');
    const dataState = await collapsibleItem.getAttribute("data-state");
    return dataState === "open";
  }
}