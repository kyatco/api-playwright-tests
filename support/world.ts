import { setWorldConstructor, IWorldOptions } from '@cucumber/cucumber';
import { request, APIRequestContext } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

export class CustomWorld {
  requestContext!: APIRequestContext;
  response: any;
  parameters: any; // use 'any' if you want to hold Cucumber world params

  constructor(options: IWorldOptions) {
    this.parameters = options.parameters;
  }

  async initRequest() {
    this.requestContext = await request.newContext({
      baseURL: process.env.BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': process.env.CONTENT_TYPE || 'application/json',
      },
    });
  }
}

setWorldConstructor(CustomWorld);
