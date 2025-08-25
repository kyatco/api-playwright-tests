import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load env file (default is .env, but we can override)
dotenv.config({ path: process.env.ENV_FILE || '.env' });

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Content-Type': process.env.CONTENT_TYPE || 'application/json',
    },
  },
});
