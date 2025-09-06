import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DataTable } from '@cucumber/cucumber';
import { resolveEndpoint } from '../utils/endpoints';
import { GlobalStore } from '../support/globalStore'; // ✅ central import

function resolvePlaceholders(text: string, world: CustomWorld): string {
  return text.replace(/\{(.+?)\}/g, (_, key) => {
    const value = world.variables[key] ?? GlobalStore[key];
    console.log(`🔄 Replacing {${key}} with: ${value}`);
    return value ?? `{${key}}`;
  });
}

// --- Send request with custom headers ---
When('I send a {string} request to {string} with headers:', async function (
  this: CustomWorld,
  method: string,
  endpoint: string,
  dataTable: DataTable
) {
  const headers = dataTable.rowsHash();
  const url = resolveEndpoint(endpoint, process.env.BASE_URL);

  this.requestHeaders = headers;

  switch (method.toUpperCase()) {
    case 'POST':
      this.response = await this.requestContext.post(url, { headers });
      break;
    case 'GET':
      this.response = await this.requestContext.get(url, { headers });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
});

// --- GET/POST/PUT/DELETE without body ---
When('I send a {string} request to {string}', async function (
  this: CustomWorld,
  method: string,
  endpoint: string
) {
  const resolvedEndpoint = resolvePlaceholders(endpoint, this);
  const url = resolveEndpoint(resolvedEndpoint, process.env.BASE_URL);

  const effectiveToken = this.token || GlobalStore['token'];
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(effectiveToken ? { Cookie: `token=${effectiveToken}` } : {}),
  };

  console.log(`TOKEN used: ${effectiveToken}`);
  console.log(`➡️ Sending ${method.toUpperCase()} to ${url}`);

  switch (method.toUpperCase()) {
    case 'GET':
      this.response = await this.requestContext.get(url, { headers });
      break;
    case 'POST':
      this.response = await this.requestContext.post(url, { headers });
      break;
    case 'PUT':
      this.response = await this.requestContext.put(url, { headers });
      break;
    case 'DELETE':
      this.response = await this.requestContext.delete(url, { headers });
      break;
    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  try {
    const json = await this.response.json();
    console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
  } catch {
    const text = await this.response.text();
    console.log('⬅️ Response Text:', text.substring(0, 300));
  }
});

// --- Request with body (POST/PUT/DELETE) ---
When('I send a {string} request to {string} with body:', async function (
  this: CustomWorld,
  method: string,
  endpoint: string,
  bodyOrTable: DataTable | string
) {
  const resolvedEndpoint = resolvePlaceholders(endpoint, this);
  const url = resolveEndpoint(resolvedEndpoint, process.env.BASE_URL);

  let body: any;
  if (typeof bodyOrTable !== 'string' && typeof bodyOrTable.rowsHash === 'function') {
    body = bodyOrTable.rowsHash();
    if (body.email) {
      body.username = body.email;
      delete body.email;
    }
  } else if (typeof bodyOrTable === 'string') {
    try {
      body = JSON.parse(bodyOrTable);
    } catch (e) {
      throw new Error(`❌ Invalid JSON body in step: ${e}`);
    }
  } else {
    throw new Error('❌ Unsupported body format. Use DataTable or JSON string.');
  }

  const effectiveToken = this.token || GlobalStore['token'];
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(effectiveToken ? { Cookie: `token=${effectiveToken}` } : {}),
  };

  console.log(`TOKEN used: ${effectiveToken}`);
  console.log(`➡️ Sending request: ${method.toUpperCase()} ${url}`);
  console.log('Request body:', body);
  console.log('Request headers:', headers);

  switch (method.toUpperCase()) {
    case 'PATCH':
      this.response = await this.requestContext.patch(url, { data: body, headers });
    break;
    case 'POST':
      this.response = await this.requestContext.post(url, { data: body, headers });
      break;
    case 'PUT':
      this.response = await this.requestContext.put(url, { data: body, headers });
      break;
    case 'DELETE':
      this.response = await this.requestContext.delete(url, { data: body, headers });
      break;
    default:
      throw new Error(`Unsupported method with body: ${method}`);
  }

  try {
    const json = await this.response.json();

    if (json.bookingid) {
      this.variables['booking.id'] = json.bookingid;
      GlobalStore['booking.id'] = json.bookingid;
      console.log(`💾 Saved booking.id = ${json.bookingid}`);
    }

    if (json.token) {
      this.token = json.token;
      GlobalStore['token'] = json.token;
      console.log('✅ Token received and saved globally:', this.token);
    }

    console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
  } catch {
    const text = await this.response.text();
    console.log('⬅️ Response Text:', text.substring(0, 300));
  }
});
