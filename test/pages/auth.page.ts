import { Page } from "playwright/test";

export class AuthPage {
  constructor(private readonly page: Page) {}

  async gotoLogin() {
    await this.page.goto('http://localhost:3000/auth');
  }

  async fillEmail(email: string) {
    await this.page.fill('#email', email);
  }

  async fillPassword(password: string) {
    await this.page.fill('#password', password);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.gotoLogin();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}