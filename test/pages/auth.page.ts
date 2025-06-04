import path from "path";
import { Page } from "playwright/test";
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '../../config/.env'),
});

const BASE_URL = process.env.FRONT_URL;

if (!BASE_URL) {
  throw new Error('❌ FRONT_URL not found');
}

export class AuthPage {
  constructor(private readonly page: Page) {}

  async gotoLogin() {
    await this.page.goto(`${BASE_URL}/auth`);
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