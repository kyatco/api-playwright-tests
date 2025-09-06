import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { DataTable } from '@cucumber/cucumber';
import { resolveEndpoint } from '../utils/endpoints';

// 🔄 Shared store across scenarios (optional)
const GlobalStore: Record<string, any> = {};

function resolvePlaceholders(text: string, world: CustomWorld): string {
  return text.replace(/\{(.+?)\}/g, (_, key) => {
    const value = world.variables[key] ?? GlobalStore[key];
    console.log(`🔄 Replacing {${key}} with: ${value}`);
    return value ?? `{${key}}`;
  });
}


When('I send a {string} request to {string} with headers:', async function (
    this: CustomWorld,
    method: string,
    endpoint: string,
    dataTable: DataTable
  ) {
    const headers = dataTable.rowsHash();
    const url = resolveEndpoint(endpoint, process.env.BASE_URL);
  
    // Store headers in world context for later assertions
    this.requestHeaders = headers;
  
    // Send request with headers
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
// GET/POST/PUT/DELETE without body
// When('I send a {string} request to {string}', 
//   async function (this: CustomWorld, method: string, endpoint: string) {
//     // Replace {var} placeholders with saved variables
//     const resolvedEndpoint = endpoint.replace(/\{(.+?)\}/g, (_, key) => {
//       return this.variables[key] ?? `{${key}}`;
//     });

//     const url = resolveEndpoint(resolvedEndpoint, process.env.BASE_URL);

//     switch (method.toUpperCase()) {
//       case 'GET':
//         this.response = await this.requestContext.get(url);
//         break;
//       case 'POST':
//         this.response = await this.requestContext.post(url);
//         break;
//       case 'PUT':
//         this.response = await this.requestContext.put(url);
//         break;
//       case 'DELETE':
//         this.response = await this.requestContext.delete(url);
//         break;
//       default:
//         throw new Error(`Unsupported method: ${method}`);
//     }
//   }
// );

// When('I send a {string} request to {string} with body:', 
//     async function (
//       this: CustomWorld,
//       method: string,
//       endpoint: string,
//       bodyOrTable: DataTable | string
//     ) {
//       const url = resolveEndpoint(endpoint, process.env.BASE_URL);
  
//       let body: any;
  
//       if (typeof bodyOrTable !== 'string' && typeof bodyOrTable.rowsHash === 'function') {
//         body = bodyOrTable.rowsHash();
  
//         if (body.email) {
//           body.username = body.email;
//           delete body.email;
//         }
//       } else if (typeof bodyOrTable === 'string') {
//         try {
//           body = JSON.parse(bodyOrTable);
//         } catch (e) {
//           throw new Error(`❌ Invalid JSON body in step: ${e}`);
//         }
//       } else {
//         throw new Error('❌ Unsupported body format. Use DataTable or JSON string.');
//       }
  
//       console.log('➡️ Sending request:', method.toUpperCase(), url);
//       console.log('Request body:', body);
  
//       switch (method.toUpperCase()) {
//         case 'POST':
//           this.response = await this.requestContext.post(url, { data: body });
//           break;
//         case 'PUT':
//           this.response = await this.requestContext.put(url, { data: body });
//           break;
//         case 'DELETE':
//           this.response = await this.requestContext.delete(url, { data: body });
//           break;
//         default:
//           throw new Error(`Unsupported method with body: ${method}`);
//       }
  
//       try {
//         const json = await this.response.json();
  
//         // 🔑 Save bookingid if present
//         if (json.bookingid) {
//           this.variables['booking.id'] = json.bookingid;
//           console.log(`💾 Saved booking.id = ${json.bookingid}`);
//         }
  
//         if (json.token) {
//           this.token = json.token;
//           console.log('✅ Token received:', this.token);
//         }
  
//         console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
//       } catch {
//         const text = await this.response.text();
//         console.log('⬅️ Response Text:', text.substring(0, 300));
//       }
//     }
//   );


When('I send a {string} request to {string}', 
  async function (this: CustomWorld, method: string, endpoint: string) {
    const resolvedEndpoint = resolvePlaceholders(endpoint, this);
    const url = resolveEndpoint(resolvedEndpoint, process.env.BASE_URL);

    console.log(`➡️ Sending ${method.toUpperCase()} to ${url}`);

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

    try {
      const json = await this.response.json();
      console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
    } catch {
      const text = await this.response.text();
      console.log('⬅️ Response Text:', text.substring(0, 300));
    }
  }
);

When('I send a {string} request to {string} with body:', 
  async function (
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

    console.log('➡️ Sending request:', method.toUpperCase(), url);
    console.log('Request body:', body);

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

    try {
      const json = await this.response.json();

      // 🔑 Save booking.id for later use
      if (json.bookingid) {
        this.variables['booking.id'] = json.bookingid;
        GlobalStore['booking.id'] = json.bookingid;
        console.log(`💾 Saved booking.id = ${json.bookingid}`);
      }

      if (json.token) {
        this.token = json.token;
        GlobalStore['token'] = json.token;
        console.log('✅ Token received:', this.token);
      }

      console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
    } catch {
      const text = await this.response.text();
      console.log('⬅️ Response Text:', text.substring(0, 300));
    }
  }
);

// When('I send a {string} request to {string} with body:', async function (
//     this: CustomWorld,
//     method: string,
//     endpoint: string,
//     dataTable: DataTable
//   ) {
//     const url = resolveEndpoint(endpoint, process.env.BASE_URL);
//     let body = dataTable.rowsHash();
  
//     // Map 'email' to 'username' for Restful-Booker
//     if (body.email) {
//       body.username = body.email;
//       delete body.email;
//     }
  
//     console.log('➡️ Sending request:', method.toUpperCase(), url);
//     console.log('Request body:', body);
  
//     switch (method.toUpperCase()) {
//       case 'POST':
//         this.response = await this.requestContext.post(url, { data: body });
//         break;
//       case 'PUT':
//         this.response = await this.requestContext.put(url, { data: body });
//         break;
//       case 'DELETE':
//         this.response = await this.requestContext.delete(url, { data: body });
//         break;
//       default:
//         throw new Error(`Unsupported method with body: ${method}`);
//     }
  
//     // Parse JSON response and store token if present
//     const json = await this.response.json();
//     if (json.token) {
//       this.token = json.token;
//       console.log('✅ Token received:', this.token);
//     } else {
//       console.log('⚠️ No token in response');
//     }
  
//     const text = await this.response.text();
//     console.log('⬅️ Response:', text.substring(0, 300));
// });

// When('I send a {string} request to {string} with body:',
//   async function (
//     this: CustomWorld,
//     method: string,
//     endpoint: string,
//     bodyOrTable: DataTable | string
//   ) {
//     const url = resolveEndpoint(endpoint, process.env.BASE_URL);

//     let body: any;

//     // Case 1: DataTable (key-value rows)
//     if (typeof bodyOrTable !== 'string' && typeof bodyOrTable.rowsHash === 'function') {
//       body = bodyOrTable.rowsHash();

//       // Map 'email' -> 'username' for Restful-Booker
//       if (body.email) {
//         body.username = body.email;
//         delete body.email;
//       }
//     }
//     // Case 2: JSON doc string
//     else if (typeof bodyOrTable === 'string') {
//       try {
//         body = JSON.parse(bodyOrTable);
//       } catch (e) {
//         throw new Error(`❌ Invalid JSON body in step: ${e}`);
//       }
//     } else {
//       throw new Error('❌ Unsupported body format. Use DataTable or JSON string.');
//     }

//     console.log('➡️ Sending request:', method.toUpperCase(), url);
//     console.log('Request body:', body);

//     switch (method.toUpperCase()) {
//       case 'POST':
//         this.response = await this.requestContext.post(url, { data: body });
//         break;
//       case 'PUT':
//         this.response = await this.requestContext.put(url, { data: body });
//         break;
//       case 'DELETE':
//         this.response = await this.requestContext.delete(url, { data: body });
//         break;
//       default:
//         throw new Error(`Unsupported method with body: ${method}`);
//     }

//     // Try to parse response
//     try {
//       const json = await this.response.json();
//       if (json.token) {
//         this.token = json.token;
//         console.log('✅ Token received:', this.token);
//       }
//       console.log('⬅️ Response JSON:', JSON.stringify(json, null, 2));
//     } catch {
//       const text = await this.response.text();
//       console.log('⬅️ Response Text:', text.substring(0, 300));
//     }
//   }
// );
