import { Before, After } from '@cucumber/cucumber';
import { request } from '@playwright/test';
import { CustomWorld } from './world';
import dotenv from 'dotenv';

dotenv.config();

Before(async function (this: CustomWorld) {
  this.requestContext = await request.newContext({
    baseURL: process.env.BASE_URL, // ✅ from .env
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  });
});

After(async function (this: CustomWorld) {
  if (this.requestContext) {
    await this.requestContext.dispose();
  }
});
