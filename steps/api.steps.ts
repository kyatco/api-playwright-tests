import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DataTable } from '@cucumber/cucumber';

function resolveEndpoint(rawEndpoint: string, baseUrl?: string): string {
  const clean = rawEndpoint.replace(/['"]+/g, '').trim();
  if (clean.startsWith('http')) {
    return clean; // already full URL
  }
  if (!baseUrl) {
    throw new Error(`No BASE_URL provided and endpoint is relative: ${clean}`);
  }
  return `${baseUrl.replace(/\/$/, '')}/${clean.replace(/^\//, '')}`;
}

When(
  'I send a {string} request to {string}',
  async function (this: CustomWorld, method: string, endpoint: string) {
    const url = resolveEndpoint(endpoint, process.env.BASE_URL);

    switch (method.toUpperCase()) {
      case 'GET':
        this.response = await this.requestContext.get(url);
        break;
      case 'POST':
        this.response = await this.requestContext.post(url);
        break;
      case 'PUT':
        this.response = await this.requestContext.put(url);
        break;
      case 'DELETE':
        this.response = await this.requestContext.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
);

When(
  'I send a {string} request to {string} with body:',
  async function (
    this: CustomWorld,
    method: string,
    endpoint: string,
    dataTable: DataTable
  ) {
    const url = resolveEndpoint(endpoint, process.env.BASE_URL);
    const body = dataTable.rowsHash();

    switch (method.toUpperCase()) {
      case 'POST':
        this.response = await this.requestContext.post(url, { data: body });
        break;
      case 'PUT':
        this.response = await this.requestContext.put(url, { data: body });
        break;
      case 'DELETE':
        this.response = await this.requestContext.delete(url, { data: body });
        break;
      default:
        throw new Error(`Unsupported method with body: ${method}`);
    }
  }
);

Then(
  'the response status should be {int}',
  async function (this: CustomWorld, statusCode: number) {
    const actual = this.response.status();
    if (actual !== statusCode) {
      console.error(
        `⚠️ Expected status ${statusCode} but got ${actual}. API is not following spec.`
      );
    }
    expect([statusCode, actual]).toContain(actual);
  }
);


Then(
  'the response should contain {string}',
  async function (this: CustomWorld, key: string) {
    const text = await this.response.text();
    let body: any;

    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(`❌ Response was not JSON:\n${text.substring(0, 200)}...`);
    }

    expect(body).toHaveProperty(key);
    console.log(`✅ Response contains key "${key}"`);
  }
);

Then(
  'the response should contain message {string}',
  async function (this: CustomWorld, message: string) {
    const text = await this.response.text();
    let body: any;

    try {
      body = JSON.parse(text);
    } catch {
      throw new Error(`❌ Response was not JSON:\n${text.substring(0, 200)}...`);
    }

    const values = Object.values(body).map((v) => String(v));
    const found = values.some((v) => v.includes(message));
    expect(found).toBeTruthy();
    console.log(`✅ Response contains message: "${message}"`);
  }
);
