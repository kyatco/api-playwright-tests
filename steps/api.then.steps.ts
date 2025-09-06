import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DataTable } from '@cucumber/cucumber';
import { resolveEndpoint } from '../utils/endpoints';
import { getNestedValue, validateType } from '../utils/validations';

// Given('I set the endpoint to {string}', async function (this: CustomWorld, endpoint: string) {
//   const cleanEndpoint = endpoint.replace(/['"]+/g, '').trim();
//   endpoint = cleanEndpoint;
//   console.log('🌐 Current endpoint set to:', endpoint);
// });

Then('the response status should be {int}',
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

Then('the response should contain {string}',
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

Then('the response should contain message {string}', async function (this: CustomWorld, message: string) {
  const text = await this.response.text();
  let body: any;

  try {
    body = JSON.parse(text);
    const found = Object.values(body).some((v) => String(v).includes(message));
    if (!found) {
      console.warn(`⚠️ Message "${message}" not found in response`, body);
    }
    expect(found).toBeTruthy();
  } catch {
    console.warn('Response is not JSON, raw response:', text);
    throw new Error(`❌ Cannot check message "${message}" in non-JSON response`);
  }
});

Then('the response header {string} should be {string}', async function(header: string, expectedValue: string) {
    const actualValue = this.response.headers()[header.toLowerCase()];
    expect(actualValue).toBe(expectedValue);
  });

// Then('the response should contain bookingIds', async function (this: CustomWorld) {
//     const responseBody = await this.response.json();
    
//     expect(Array.isArray(responseBody)).toBeTruthy();
//     expect(responseBody.length).toBeGreaterThan(0);
    
//     responseBody.forEach((booking: any) => {
//       expect(booking).toHaveProperty('bookingid');
//       expect(typeof booking.bookingid).toBe('number');
//     });
    
//     console.log(`✅ Found ${responseBody.length} booking IDs`);
//   });


// Then('the response should match schema:', async function (this: CustomWorld, dataTable: DataTable) {
//     const schema = dataTable.rowsHash();
//     const responseBody = await this.response.json();
  
//     // Log response for debugging
//     console.log('Response Body:', JSON.stringify(responseBody, null, 2));
  
//     // Ensure response is not empty
//     expect(responseBody).toBeDefined();
//     expect(Array.isArray(responseBody)).toBeTruthy();
//     expect(responseBody.length).toBeGreaterThan(0);
  
//     for (const [path, expectedType] of Object.entries(schema)) {
//       if (path.includes('[]')) {
//         // For array properties
//         responseBody.forEach((item, index) => {
//           const propertyName = path.replace('[]', '').replace('.', '');
//           expect(item).toHaveProperty(propertyName);
//           expect(typeof item[propertyName]).toBe(expectedType.toLowerCase());
//           console.log(`✓ Item ${index}: ${propertyName} is ${expectedType}`);
//         });
//       }
//     }
    
//     console.log('✅ Schema validation complete');
//   });
  
//
// Step: Schema validation only
//
Then('the response should match schema:', async function (this: CustomWorld, dataTable: DataTable) {
    const schema = dataTable.rowsHash();
    const responseBody: unknown = await this.response.json();
  
    const validateObject = (obj: Record<string, unknown>, schema: Record<string, string>, pathPrefix = '') => {
      for (const [path, expectedType] of Object.entries(schema)) {
        if (!path.startsWith(pathPrefix)) continue;
        const relativePath = pathPrefix ? path.replace(`${pathPrefix}.`, '') : path;
  
        if (relativePath.includes('.')) {
          const [prop, ...rest] = relativePath.split('.');
          const nestedKey = rest.join('.');
          const value = obj[prop];
          expect(value).toBeDefined();
  
          if (typeof value === 'object' && value !== null) {
            validateObject(value as Record<string, unknown>, { [nestedKey]: expectedType }, '');
          } else {
            throw new Error(`Expected ${prop} to be an object but got ${typeof value}`);
          }
        } else {
          expect(obj).toHaveProperty(relativePath);
          const actualType = typeof obj[relativePath];
          expect(actualType).toBe(expectedType.toLowerCase());
          console.log(`✓ ${path} is ${expectedType}`);
        }
      }
    };
  
    if (Array.isArray(responseBody)) {
      expect(responseBody.length).toBeGreaterThan(0);
      responseBody.forEach((item, index) => {
        validateObject(item as Record<string, unknown>, schema);
        console.log(`✓ Item ${index} schema validated`);
      });
    } else {
      validateObject(responseBody as Record<string, unknown>, schema);
    }
  
    console.log('✅ Schema validation complete');
  });
  
  //
  // Step: Data validation only
  //
  Then('the response should match data1:', async function (this: CustomWorld, dataTable: DataTable) {
    const expectedData = dataTable.rowsHash();
    const responseBody: unknown = await this.response.json();
  
    const validateObject = (obj: Record<string, unknown>, expected: Record<string, string>, pathPrefix = '') => {
      for (const [path, expectedValue] of Object.entries(expected)) {
        if (!path.startsWith(pathPrefix)) continue;
        const relativePath = pathPrefix ? path.replace(`${pathPrefix}.`, '') : path;
  
        if (relativePath.includes('.')) {
          const [prop, ...rest] = relativePath.split('.');
          const nestedKey = rest.join('.');
          const value = obj[prop];
          expect(value).toBeDefined();
  
          if (typeof value === 'object' && value !== null) {
            validateObject(value as Record<string, unknown>, { [nestedKey]: expectedValue }, '');
          } else {
            throw new Error(`Expected ${prop} to be an object but got ${typeof value}`);
          }
        } else {
          expect(obj).toHaveProperty(relativePath);
          const actualValue = obj[relativePath];
  
          // Try to coerce types (number, boolean, date, string)
          let parsedExpected: unknown = expectedValue;
          if (!isNaN(Number(expectedValue))) parsedExpected = Number(expectedValue);
          if (expectedValue === 'true' || expectedValue === 'false') parsedExpected = expectedValue === 'true';
  
          expect(actualValue).toEqual(parsedExpected);
          console.log(`✓ ${path} equals ${expectedValue}`);
        }
      }
    };
  
    if (Array.isArray(responseBody)) {
      expect(responseBody.length).toBeGreaterThan(0);
      responseBody.forEach((item, index) => {
        validateObject(item as Record<string, unknown>, expectedData);
        console.log(`✓ Item ${index} data validated`);
      });
    } else {
      validateObject(responseBody as Record<string, unknown>, expectedData);
    }
  
    console.log('✅ Data validation complete');
  });

  Then('the response should match data:', async function (this: CustomWorld, dataTable: DataTable) {
    const expectedData = dataTable.rowsHash();
    const responseBody: any = await this.response.json();
  
    // If the API wrapped the booking inside "booking", unwrap it
    const target =
      responseBody && typeof responseBody === 'object' && 'booking' in responseBody
        ? responseBody.booking
        : responseBody;
  
    const validateObject = (
      obj: Record<string, unknown>,
      expected: Record<string, string>,
      pathPrefix = ''
    ) => {
      for (const [path, expectedValue] of Object.entries(expected)) {
        // strip "booking." prefix if present
        const cleanPath = path.startsWith('booking.') ? path.replace('booking.', '') : path;
  
        if (!cleanPath.startsWith(pathPrefix)) continue;
        const relativePath = pathPrefix ? cleanPath.replace(`${pathPrefix}.`, '') : cleanPath;
  
        if (relativePath.includes('.')) {
          const [prop, ...rest] = relativePath.split('.');
          const nestedKey = rest.join('.');
          const value = obj[prop];
          expect(value).toBeDefined();
  
          if (typeof value === 'object' && value !== null) {
            validateObject(value as Record<string, unknown>, { [nestedKey]: expectedValue }, '');
          } else {
            throw new Error(`Expected ${prop} to be an object but got ${typeof value}`);
          }
        } else {
          expect(obj).toHaveProperty(relativePath);
          const actualValue = obj[relativePath];
  
          // type coercion (number, boolean, string)
          let parsedExpected: unknown = expectedValue;
          if (!isNaN(Number(expectedValue))) parsedExpected = Number(expectedValue);
          if (expectedValue === 'true' || expectedValue === 'false') parsedExpected = expectedValue === 'true';
  
          expect(actualValue).toEqual(parsedExpected);
          console.log(`✓ ${path} equals ${expectedValue}`);
        }
      }
    };
  
    if (Array.isArray(target)) {
      expect(target.length).toBeGreaterThan(0);
      target.forEach((item, index) => {
        validateObject(item as Record<string, unknown>, expectedData);
        console.log(`✓ Item ${index} data validated`);
      });
    } else {
      validateObject(target as Record<string, unknown>, expectedData);
    }
  
    console.log('✅ Data validation complete');
  });