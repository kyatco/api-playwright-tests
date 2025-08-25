import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I send a GET request to {string}', async function (this: CustomWorld, endpoint: string) {
  // remove quotes if passed
  const cleanEndpoint = endpoint.replace(/['"]+/g, '');
  this.response = await this.requestContext.get(cleanEndpoint);
});

Then('the response status should be {int}', async function (this: CustomWorld, statusCode: number) {
  expect(this.response.status()).toBe(statusCode);
});

Then('the response should contain {string}', async function (this: CustomWorld, key: string) {
  const body = await this.response.json();
  expect(body).toHaveProperty(key);
  console.log("✅ Products count:", body[key]?.length);
});
